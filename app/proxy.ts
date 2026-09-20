import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (remplace middleware.ts depuis Next.js 16).
 *
 * Règles mobile-first :
 * ──────────────────────────────────────────────────────────────────
 * 1. Pages PUBLIQUES : "/", "/login", "/register", "/auth/callback",
 *    "/regles", "/illustrations" — accessibles à tous, plus les assets
 *    statiques (exclus via `config.matcher`).
 *
 * 2. Pages PROTÉGÉES : "/catalogue", "/jouer", "/shop", "/character",
 *    "/achievements", "/story/", "/onboarding"
 *    - Aucune session → /login?redirectTo=<page>
 *    - Session invité (anonyme) → autorisé (jeu, boutique simulée OK).
 *    - Session permanente → autorisé.
 *
 * 3. Utilisateur permanent déjà connecté qui visite /login ou /register :
 *    redirection vers /catalogue (ou le `redirectTo` fourni) pour
 *    éviter de lui représenter l'écran de connexion.
 *
 * 4. Rafraîchit la session Supabase (cookies) à chaque requête —
 *    restaure les sessions persistées sur mobile.
 */

// Pages accessibles SANS connexion.
const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/register",
  "/regles",
  "/illustrations",
]);

// Préfixes accessibles uniquement avec une session (un invité suffit).
const PROTECTED_PREFIXES = [
  "/catalogue",
  "/jouer",
  "/shop",
  "/character",
  "/achievements",
  "/story/",
  "/onboarding",
];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

function isSafeRedirect(raw: string | null): raw is string {
  if (!raw) return false;
  return raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\");
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // La route de callback gère elle-même ses redirections/cookies.
  if (pathname === "/auth/callback") {
    return NextResponse.next({ request });
  }

  // API : on laisse passer (elles utilisent le client serveur Supabase
  // qui lit les cookies de la requête).
  if (pathname.startsWith("/api/")) {
    return NextResponse.next({ request });
  }

  if (!supabaseConfigured) {
    // Mode preview local : toutes les pages sont accessibles.
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Copier les nouveaux cookies à la fois sur la requête (pour
          // les lectures ultérieures de cette même requête) et sur la
          // réponse (pour le client).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT : getUser() vérifie le JWT auprès de Supabase / via le JWT
  // signé — évite de faire confiance aux cookies client.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const hasUser = !!user && !error;
  const isAnonymous = !!user?.is_anonymous;

  const url = request.nextUrl.clone();

  // ── Pages d'auth / publiques : si un utilisateur PERMANENT est déjà
  //    connecté, on le redirige (évite un double écran de connexion).
  //    L'invité, lui, reste sur /login pour pouvoir se lier un compte.
  if (pathname === "/login" || pathname === "/register") {
    if (hasUser && !isAnonymous) {
      const redirectTo = isSafeRedirect(searchParams.get("redirectTo"))
        ? searchParams.get("redirectTo")!
        : "/catalogue";
      url.pathname = redirectTo;
      url.search = "";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Page d'accueil "/" toujours accessible.
  if (PUBLIC_PATHS.has(pathname)) {
    return supabaseResponse;
  }

  // ── Pages protégées : sans session, on renvoie vers /login.
  //    L'invité anonyme est autorisé — il joue avec un compte volatile.
  if (isProtected(pathname) && !hasUser) {
    url.pathname = "/login";
    const redirectTo =
      isSafeRedirect(pathname) && pathname !== "/login"
        ? pathname + (request.nextUrl.search ?? "")
        : "/catalogue";
    url.search = "";
    url.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static, _next/image (assets Next.js)
     * - favicon, manifest, icônes PWA
     * - fichiers statiques images/fonts/pdf
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|assets/|lonewolf/pdf/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};

export default proxy;
