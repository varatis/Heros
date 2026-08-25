// ============================================================
// HeroBook — Edge Function `init-game` — v2 : Vie/Armure/Attaque
// ------------------------------------------------------------
// Initialise une nouvelle partie : crée character_stats et
// user_story_progress via service_role (contourne les RLS).
// Nouveau système :
//  - Vie / Armure / Attaque pour les histoires génériques
//  - Sacoche vide au début (story_id cloisonnée)
//  - Si reset=true (logique client) on purge l'inventaire de
//    cette aventure pour repartir à zéro.
// Entrée  : { story_id: uuid, stats?: {...}, reset?: boolean }
// Sortie  : { node, stats }
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  try {
    const admin = createAdminClient();
    const user = await getUser(req, admin);
    if (!user) {
      return fail("unauthorized", "Authentification requise", 401);
    }

    let body: {
      story_id?: string;
      stats?: Record<string, number>;
      reset?: boolean;
    };
    try {
      body = await req.json();
    } catch {
      return fail("bad_request", "Corps JSON invalide", 400);
    }
    if (!body.story_id) {
      return fail("bad_request", "Paramètre story_id manquant", 400);
    }

    const { data: story } = await admin
      .from("stories")
      .select("id, slug, title, genre")
      .eq("id", body.story_id)
      .single();
    if (!story) {
      return fail("story_not_found", "Histoire introuvable", 404);
    }

    // Stats par défaut selon le type d'histoire
    const isLoneWolf = story.slug === "les-maitres-des-tenebres";
    const defaultStats = isLoneWolf
      ? {
          hp_current: body.stats?.hp_current ?? 10,
          hp_max: body.stats?.hp_max ?? 10,
          strength: body.stats?.strength ?? 5,
          agility: body.stats?.agility ?? 5,
          luck: body.stats?.luck ?? 5,
          charisma: body.stats?.charisma ?? 5,
          armor: body.stats?.armor ?? 0,
          attack_power: body.stats?.attack_power ?? 5,
        }
      : {
          // Nouveau système générique Vie/Armure/Attaque
          hp_current: body.stats?.hp_current ?? 20,
          hp_max: body.stats?.hp_max ?? 20,
          strength: body.stats?.attack_power ?? body.stats?.strength ?? 5,
          agility: body.stats?.armor ?? body.stats?.agility ?? 0,
          luck: body.stats?.luck ?? 5,
          charisma: body.stats?.charisma ?? 5,
          armor: body.stats?.armor ?? body.stats?.agility ?? 0,
          attack_power: body.stats?.attack_power ?? body.stats?.strength ?? 5,
        };

    // Si reset demandé, purger la sacoche de cette aventure
    if (body.reset) {
      await admin
        .from("user_inventory")
        .delete()
        .eq("user_id", user.id)
        .eq("story_id", body.story_id);
    }

    await admin.from("character_stats").upsert(
      {
        user_id: user.id,
        story_id: body.story_id,
        ...defaultStats,
        narrative_flags: {},
        combat_state: null,
      },
      { onConflict: "user_id,story_id" },
    );

    const { data: startNodes } = await admin
      .from("story_nodes")
      .select("*")
      .eq("story_id", body.story_id)
      .order("is_start", { ascending: false })
      .limit(1);

    const startNode = startNodes?.[0];
    if (!startNode) {
      return fail("no_start_node", "Aucun noeud de départ trouvé", 404);
    }

    await admin.from("user_story_progress").upsert(
      {
        user_id: user.id,
        story_id: body.story_id,
        current_node_id: startNode.id,
        completion_pct: 10,
        last_played_at: new Date().toISOString(),
        is_completed: false,
        completed_at: null,
      },
      { onConflict: "user_id,story_id" },
    );

    const { data: createdStats } = await admin
      .from("character_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("story_id", body.story_id)
      .single();

    return json({
      node: startNode,
      stats: createdStats,
    });
  } catch (err) {
    console.error("init-game unexpected error:", err);
    return fail("internal", "Erreur interne du serveur", 500);
  }
});
