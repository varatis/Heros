import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Invalide la session côté GoTrue (erreur ignorée : on force le
  // nettoyage local des cookies quoi qu'il arrive).
  try {
    await supabase.auth.signOut();
  } catch {
    // Session déjà expirée ou réseau indisponible — rien à faire.
  }

  // 303 : le navigateur rejoue la navigation en GET (un 307 conserverait
  // le POST et provoquerait un 405 sur /login).
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 303,
  });

  // Supprime explicitement tout cookie d'auth Supabase (invité compris)
  // pour éviter qu'une session anonyme « fantôme » ne survive au logout.
  request.cookies.getAll().forEach(({ name }) => {
    if (name.startsWith("sb-") || name.includes("auth-token")) {
      response.cookies.set(name, "", {
        maxAge: 0,
        path: "/",
        sameSite: "lax",
      });
    }
  });

  return response;
}
