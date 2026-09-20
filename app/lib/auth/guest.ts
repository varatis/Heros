import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/** Session créée via `signInAnonymously` — progression persistante en base,
 *  mais liée à un token volatile tant qu'un identifiant n'est pas ajouté. */
export function isAnonymousUser(user: User | null | undefined): boolean {
  return Boolean(user?.is_anonymous);
}

/**
 * Vrai démarrage en mode invité : crée un utilisateur anonyme Supabase.
 * - La progression (profil, gemmes, succès, sauvegardes) est alors persistée
 *   côté serveur avec le même UUID, ce qui permet :
 *     1. de ne PAS perdre la progression si l'utilisateur se reconnecte
 *        depuis le même appareil (session restaurée par le refresh token);
 *     2. de convert IR l'invité en compte permanent (Google/Apple/email)
 *        plus tard via `linkIdentity` — l'UUID et le wallet sont conservés.
 *
 * Retourne l'utilisateur anonyme créé ou existant, ou `null` si Supabase
 * n'est pas configuré (mode preview).
 */
export async function ensureAnonymousUser(): Promise<User | null> {
  if (
    typeof process !== "undefined" &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    return null;
  }

  const supabase = createClient();

  // Vérifier d'abord s'il n'y a pas déjà une session (évitera de créer un
  // nouveau compte anonyme à chaque clic "Jouer en invité").
  const {
    data: { user: existing },
  } = await supabase.auth.getUser();

  if (existing) {
    return existing;
  }

  // Aucune session → création anonyme
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn("[auth/guest] signInAnonymously a échoué :", error.message);
    return null;
  }

  return data.user ?? null;
}

/**
 * Tente de convertir l'utilisateur anonyme courant vers un fournisseur
 * OAuth (Google/Apple/Microsoft…) sans perdre l'UUID ni les données liées.
 *
 * Requiert l'option « Manual linking » activée dans le dashboard Supabase
 * (Auth → Providers → Allow manual linking). Si l'utilisateur n'est pas
 * anonyme, on retombe sur un signInWithOAuth classique.
 */
export async function upgradeGuestWithOAuth(
  provider: "google" | "apple" | "azure" | "github",
  next: string = "/catalogue",
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}&guest_upgrade=1`;

  if (user?.is_anonymous) {
    // Liaison manuelle : l'identité est ajoutée à l'utilisateur anonyme
    // (même UUID, mêmes gemmes, mêmes sauvegardes).
    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: { redirectTo },
    } as any);
    if (error) throw error;
    return;
  }

  // Pas d'invité → connexion OAuth classique
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) throw error;
}

/**
 * Convertit un invité en compte email/mot de passe (updateUser, même UUID).
 * Utile quand l'utilisateur est déjà en session anonyme et renseigne un
 * email + mot de passe dans le formulaire de création de compte.
 */
export async function upgradeGuestWithEmail(email: string, password: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.is_anonymous) {
    // Pas un invité → signup classique
    return supabase.auth.signUp({ email, password });
  }

  // Invité → on ajoute l'email + mot de passe au même compte
  const { data, error } = await supabase.auth.updateUser({
    email,
    password,
  });

  if (error) return { data: { user: null, session: null }, error };

  // Après mise à jour, il faut une confirmation d'email → on envoie via
  // un re-signIn si l'email n'est pas encore confirmé. Supabase traite
  // cela comme un changement d'email sur un compte anonyme.
  return {
    data: { user: data.user, session: null },
    error: null,
  };
}
