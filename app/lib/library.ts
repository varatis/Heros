import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

export interface Livre {
  slug: string;
  numero: number;
  titre: string;
  resume: string | null;
  illustration: string | null;
  is_free: boolean;
  price_gems: number | null;
}

// Public metadata only. Never bundle the text of future paid books here.
export const LIVRE_DECOUVERTE: Livre = {
  slug: "loup-solitaire-01",
  numero: 1,
  titre: "Les Maîtres des Ténèbres",
  resume:
    "Dernier survivant des Seigneurs Kaï, traversez le Sommerlund pour avertir le Roi. Chaque décision écrit la suite de votre histoire.",
  illustration: "/lonewolf/pdf/originals/p001-x4.png",
  is_free: true,
  price_gems: null,
};

export const getAccount = cache(async () => {
  if (!supabaseConfigured) return { supabase: null, user: null };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
});

export const getLibrary = cache(async () => {
  const { supabase, user } = await getAccount();
  if (!supabase)
    return {
      livres: [LIVRE_DECOUVERTE],
      owned: [] as string[],
      user,
      local: true,
      error: false,
    };
  // LW tables are not yet in the repository's generated Supabase types.
  const db = supabase as unknown as SupabaseClient;
  const { data, error } = await db
    .from("lw_livres")
    .select("slug, numero, titre, resume, illustration, is_free, price_gems")
    .eq("status", "published")
    .order("numero");
  const access = user
    ? await db
        .from("lw_livres_utilisateur")
        .select("livre_slug")
        .eq("user_id", user.id)
    : null;
  return {
    // Render the verified cover even before metadata migration 008 is applied.
    // Leave all other books, custom covers, prices and access flags untouched.
    livres: ((data ?? []) as Livre[]).map((livre) =>
      livre.slug === LIVRE_DECOUVERTE.slug &&
      livre.illustration === "/lonewolf/couverture.jpg"
        ? { ...livre, illustration: LIVRE_DECOUVERTE.illustration }
        : livre,
    ),
    owned: ((access?.data ?? []) as { livre_slug: string }[]).map(
      (row) => row.livre_slug,
    ),
    user,
    local: false,
    error: !!error || !!access?.error,
  };
});

export function canRead(livre: Livre, owned: string[]) {
  return livre.is_free || owned.includes(livre.slug);
}

export function playable(livre: Livre) {
  return livre.slug === LIVRE_DECOUVERTE.slug;
}
