import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (anciennement Middleware en Next.js 16).
 *
 * Le jeu Loup Solitaire fonctionne en autonomie : la sauvegarde vit dans le
 * navigateur et le contenu est embarqué dans l'application. L'authentification
 * n'est donc exigée que pour les écrans qui dépendent réellement de Supabase
 * (catalogue, boutique, profil, succès). Si Supabase n'est pas configuré dans
 * l'environnement, on laisse tout passer.
 */
const ROUTES_PUBLIQUES = [
  "/",
  "/regles",
  "/jouer",
  "/login",
  "/register",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const estPublique =
    ROUTES_PUBLIQUES.some(
      (r) => pathname === r || pathname.startsWith(`${r}/`)
    ) || pathname.startsWith("/api");

  if (!supabaseConfigured) {
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !estPublique) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|lonewolf|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default proxy;
