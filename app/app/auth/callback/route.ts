import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Point d'arrivée unique de Supabase Auth (PKCE + Magic Link + liens email) :
 *
 * Cas pris en compte :
 *  1. OAuth (Google, Microsoft, Apple, GitHub…) : échange du `code`.
 *     - ?guest_upgrade=1 : l'invité a lié un fournisseur → rediriger vers
 *       `next` (pas d'onboarding, le profil existe déjà).
 *     - compte neuf (created_at < 5 min) → /onboarding.
 *     - compte existant → `next`.
 *
 *  2. Magic Link / Email OTP / confirmation email signup :
 *     - signup → /onboarding si nouveau, /catalogue sinon.
 *     - magiclink (login sans mot de passe) → `next`.
 *     - recovery (reset mot de passe) → /login?reset=1 (pour l'instant
 *       le reset se fait via Supabase hosted UI ou sera ajouté plus
 *       tard ; on affiche un message).
 *     - email_change (ajout d'email à un invité) → /catalogue avec
 *       message de confirmation.
 *
 *  3. Erreur : /login avec message clair.
 */

function friendlyError(message: string | null): string {
  const msg = (message || "").toLowerCase();
  if (msg.includes("already linked") || msg.includes("identity already")) {
    return "Ce compte social est déjà lié à un autre compte HeroBook. Connectez-vous avec ce compte, ou utilisez un autre réseau.";
  }
  if (msg.includes("manual linking")) {
    return "La liaison invité → compte n'est pas activée sur ce projet (Dashboard Supabase → Auth → Providers → Allow manual linking).";
  }
  if (msg.includes("access_denied") || msg.includes("cancelled")) {
    return "Connexion annulée.";
  }
  if (msg.includes("expired") || msg.includes("invalid")) {
    return "Ce lien a expiré ou n'est plus valide. Demandez-en un nouveau.";
  }
  return message || "Échec de l'authentification.";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const rawNext = searchParams.get("next") ?? "/catalogue";
  const guestUpgrade = searchParams.get("guest_upgrade") === "1";

  // Anti open-redirect : uniquement des chemins internes.
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/catalogue";

  const supabase = await createClient();

  // ── 1. OAuth / PKCE : échange du code ─────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?oauth_error=${encodeURIComponent(friendlyError(error.message))}`,
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Si c'était une mise à niveau depuis l'invité, l'utilisateur avait
    // déjà son profil — on ne le renvoie PAS sur /onboarding.
    if (guestUpgrade) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Compte créé dans les 5 dernières minutes → onboarding pour choisir
    // le nom du héros (les invités convertis ont un created_at ancien
    // car lier une identité ne change pas created_at).
    const isBrandNew =
      user && Date.now() - new Date(user.created_at).getTime() < 5 * 60_000;

    return NextResponse.redirect(
      `${origin}${isBrandNew ? "/onboarding" : next}`,
    );
  }

  // ── 2. Token hash (Magic Link / confirmation email / reset) ───────
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as
        | "signup"
        | "invite"
        | "magiclink"
        | "recovery"
        | "email_change",
    });

    if (error) {
      return NextResponse.redirect(
        `${origin}/login?oauth_error=${encodeURIComponent(friendlyError(error.message))}`,
      );
    }

    // Vérifier si c'est un nouveau compte ou une connexion
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (type === "recovery") {
      return NextResponse.redirect(`${origin}/login?reset=done`);
    }

    if (type === "email_change") {
      return NextResponse.redirect(
        `${origin}/catalogue?email_confirmed=1`,
      );
    }

    // Magic Link de connexion
    if (type === "magiclink") {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Signup (nouveau compte par email)
    if (type === "signup") {
      const isBrandNew =
        user && Date.now() - new Date(user.created_at).getTime() < 5 * 60_000;
      return NextResponse.redirect(
        `${origin}${isBrandNew ? "/onboarding" : next}`,
      );
    }

    return NextResponse.redirect(`${origin}/login?confirmed=1`);
  }

  // ── 3. Erreur renvoyée par le fournisseur / GoTrue ────────────────
  const errorDescription = searchParams.get("error_description");
  return NextResponse.redirect(
    `${origin}/login?oauth_error=${encodeURIComponent(friendlyError(errorDescription))}`,
  );
}
