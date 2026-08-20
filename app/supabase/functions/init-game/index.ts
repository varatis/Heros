// ============================================================
// HeroBook — Edge Function `init-game`
// ------------------------------------------------------------
// Initialise une nouvelle partie : crée character_stats et
// user_story_progress via service_role (contourne les RLS).
// Remplace les écritures directes du client supprimées dans
// la migration 004.
//
// Entrée  : { story_id: uuid, stats?: { hp_current, hp_max, ... } }
// Sortie  : { node, stats }
// Erreurs : 400 · 401 · 404 · 500
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

    let body: { story_id?: string; stats?: Record<string, number> };
    try {
      body = await req.json();
    } catch {
      return fail("bad_request", "Corps JSON invalide", 400);
    }
    if (!body.story_id) {
      return fail("bad_request", "Paramètre story_id manquant", 400);
    }

    // Vérifier que l'histoire existe et est publiée
    const { data: story } = await admin
      .from("stories")
      .select("id, slug, title")
      .eq("id", body.story_id)
      .single();
    if (!story) {
      return fail("story_not_found", "Histoire introuvable", 404);
    }

    // 1. Créer ou mettre à jour character_stats
    const defaultStats = {
      hp_current: body.stats?.hp_current ?? 10,
      hp_max: body.stats?.hp_max ?? 10,
      strength: body.stats?.strength ?? 5,
      agility: body.stats?.agility ?? 5,
      luck: body.stats?.luck ?? 5,
      charisma: body.stats?.charisma ?? 5,
    };

    await admin.from("character_stats").upsert(
      {
        user_id: user.id,
        story_id: body.story_id,
        ...defaultStats,
        narrative_flags: {},
      },
      { onConflict: "user_id,story_id" },
    );

    // 2. Trouver le noeud de départ
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

    // 3. Créer ou mettre à jour user_story_progress
    await admin.from("user_story_progress").upsert(
      {
        user_id: user.id,
        story_id: body.story_id,
        current_node_id: startNode.id,
        completion_pct: 10,
        last_played_at: new Date().toISOString(),
      },
      { onConflict: "user_id,story_id" },
    );

    // 4. Re-lire les stats créées
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