import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Point d'arrivée unique de Supabase Auth (PKCE) :
 *
 * 1. OAuth (Google, Microsoft, Apple, GitHub…) : `?code=…`
 *    → échange du code contre une session, puis :
 *      - compte tout juste créé → /onboarding (choix du nom de héros)
 *      - compte existant (ou invité converti) → `next`
 * 2. Liens de confirmation d'email : `?token_hash=…&type=signup|email_change`
 *    → vérification du token, puis :
 *      - signup        → /onboarding (session créée, compte neuf)
 *      - email_change  → /register?confirmed=1 (l'invité définit son mot de passe)
 * 3. Erreur (accès refusé, identité déjà liée à un autre compte…) :
 *    → /login avec un message clair.
 */

function friendlyError(message: string | null): string {
  const msg = (message || "").toLowerCase();
  if (msg.includes("already linked")) {
    return "Ce compte est déjà lié à un autre compte HeroBook. Connectez-vous avec ce compte, ou utilisez un autre réseau.";
  }
  if (msg.includes("manual linking")) {
    return "La liaison invité → compte n'est pas activée sur ce projet Supabase (Auth → Providers → Manual linking).";
  }
  if (msg.includes("access_denied") || msg.includes("cancelled")) {
    return "Connexion annulée.";
  }
  return message || "Échec de l'authentification.";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const rawNext = searchParams.get("next") ?? "/catalogue";

  // Anti open-redirect : uniquement des chemins internes.
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/catalogue";

  const supabase = await createClient();

  // ── 1. OAuth : échange du code ────────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?oauth_error=${encodeURIComponent(friendlyError(error.message))}`
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Compte créé dans les 5 dernières minutes → onboarding pour choisir
    // le nom du héros (les invités convertis gardent leur date d'origine).
    const isBrandNew =
      user && Date.now() - new Date(user.created_at).getTime() < 5 * 60_000;

    return NextResponse.redirect(`${origin}${isBrandNew ? "/onboarding" : next}`);
  }

  // ── 2. Lien de confirmation d'email ───────────────────────────────
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "invite" | "magiclink" | "recovery" | "email_change",
    });

    if (error) {
      return NextResponse.redirect(
        `${origin}/login?oauth_error=${encodeURIComponent("Lien de confirmation invalide ou expiré.")}`
      );
    }

    if (type === "email_change") {
      // Conversion invité : email confirmé → l'utilisateur définit son
      // mot de passe sur /register (même session, même wallet).
      return NextResponse.redirect(`${origin}/register?confirmed=1`);
    }
    if (type === "signup") {
      return NextResponse.redirect(`${origin}/onboarding`);
    }
    return NextResponse.redirect(`${origin}/login?confirmed=1`);
  }

  // ── 3. Erreur renvoyée par le fournisseur / GoTrue ────────────────
  const errorDescription = searchParams.get("error_description");
  return NextResponse.redirect(
    `${origin}/login?oauth_error=${encodeURIComponent(friendlyError(errorDescription))}`
  );
}
