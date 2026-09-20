import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Connexion invité côté serveur (infaillible côté cookies).
 *
 * Le navigateur est simplement redirigé ici : la session anonyme est créée
 * avec le client serveur et les cookies de session sont posés directement
 * sur la réponse de redirection. Le middleware voit donc la session dès
 * la requête suivante — aucun risque de rebond vers /login.
 *
 * Usage : /api/auth/guest?next=/onboarding
 */

function safeNext(raw: string | null): string {
  if (
    raw &&
    raw.startsWith("/") &&
    !raw.startsWith("//") &&
    !raw.includes("\\")
  ) {
    return raw;
  }
  return "/onboarding";
}

function friendlyGuestError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("anonymous") &&
    (m.includes("disabled") ||
      m.includes("not allowed") ||
      m.includes("not enabled"))
  ) {
    return "La connexion invité n'est pas activée sur ce projet. Créez un compte pour jouer.";
  }
  return "La connexion invité est indisponible pour le moment. Réessayez plus tard.";
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const next = safeNext(request.nextUrl.searchParams.get("next"));

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Mode preview sans Supabase : accès direct.
    return NextResponse.redirect(new URL(next, origin));
  }

  const response = NextResponse.redirect(new URL(next, origin));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Session existante (même expirée, elle sera rafraîchie) → on garde tout.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?oauth_error=${encodeURIComponent(
          friendlyGuestError(error.message),
        )}`,
      );
    }
  }

  return response;
}
