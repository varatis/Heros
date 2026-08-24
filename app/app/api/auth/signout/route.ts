import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Si la session est un invité anonyme, on le supprime de la base
  // AVANT la déconnexion (la RPC vérifie auth.uid() : elle doit tourner
  // tant que le token est encore valide). Garde-fou SQL : elle ne peut
  // jamais toucher un compte permanent. → plus de « compte fantôme ».
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.is_anonymous) {
      await supabase.rpc("purge_anonymous_user");
    }
  } catch {
    // RPC absente (migration 016 non déployée) ou session déjà morte —
    // on continue : le compte restera purgeable via le SQL de AUTH.md §6.
  }

  // Invalide la session côté GoTrue (erreur ignorée : on force le
  // nettoyage local des cookies quoi qu'il arrive).
  try {
    await supabase.auth.signOut();
  } catch {
    // Session déjà expirée, utilisateur déjà supprimé, ou réseau — rien à faire.
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
