// ============================================================
// HeroBook — Edge Function `game-setup-action`
// ------------------------------------------------------------
// Exécute les actions de configuration du jeu qui ne passent
// pas par make-choice (les phases préparatoires comme le choix
// des disciplines Kaï, l'équipement de départ, et les jets de
// Hasard narratifs). Toute écriture sensible est faite avec
// service_role pour contourner les RLS restrictives.
//
// Actions supportées :
//   save_disciplines  → sauvegarde les flags narratifs + avance
//   setup_equipment   → ajoute les objets de départ + avance
//   hazard_roll       → applique les conséquences du jet de Hasard
//
// Entrée  : {
//   action: string,
//   story_id: uuid,
//   // selon action :
//   disciplines?: string[],
//   equipment_roll?: number,
//   hazard_roll?: number,
//   current_node_id?: uuid,
// }
// Sortie  : { stats?, node?, effects_applied: string[] }
// Erreurs : 400 · 401 · 404 · 500
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";

// ------------------------------------------------------------
// Gestionnaire : sauvegarde des disciplines Kaï
// ------------------------------------------------------------
async function handleSaveDisciplines(
  admin: ReturnType<typeof createAdminClient>,
  user: { id: string },
  body: { story_id: string; disciplines?: string[] },
) {
  const { story_id, disciplines } = body;
  if (!disciplines || disciplines.length === 0) {
    return fail("bad_request", "Aucune discipline fournie", 400);
  }

  // 1. Mettre à jour narrative_flags sur character_stats
  //    On préfixe par "discipline_" pour correspondre aux flag_key
  //    utilisés dans choice_effects (ex: "discipline_six_cieme_sens")
  const flags: Record<string, boolean> = {};
  for (const slug of disciplines) {
    flags[`discipline_${slug}`] = true;
  }

  const { data: existingStats } = await admin
    .from("character_stats")
    .select("narrative_flags")
    .eq("user_id", user.id)
    .eq("story_id", story_id)
    .single();

  const mergedFlags = {
    ...((existingStats?.narrative_flags as Record<string, unknown>) ?? {}),
    ...flags,
  };

  await admin
    .from("character_stats")
    .update({ narrative_flags: mergedFlags })
    .eq("user_id", user.id)
    .eq("story_id", story_id);

  // 2. Trouver le prochain noeud (equipment_setup ou fallback section_001)
  let nextNode = null;

  const { data: equipmentNode } = await admin
    .from("story_nodes")
    .select("*")
    .eq("story_id", story_id)
    .eq("metadata->>kind", "equipment_setup")
    .maybeSingle();

  if (equipmentNode) {
    nextNode = equipmentNode;
  } else {
    const { data: sectionOne } = await admin
      .from("story_nodes")
      .select("*")
      .eq("story_id", story_id)
      .eq("node_key", "section_001")
      .maybeSingle();
    nextNode = sectionOne;
  }

  if (nextNode) {
    await admin.from("user_story_progress").upsert(
      {
        user_id: user.id,
        story_id: story_id,
        current_node_id: nextNode.id,
        last_played_at: new Date().toISOString(),
      },
      { onConflict: "user_id,story_id" },
    );
  }

  // 3. Re-lire les stats
  const { data: updatedStats } = await admin
    .from("character_stats")
    .select("*")
    .eq("user_id", user.id)
    .eq("story_id", story_id)
    .single();

  return json({
    stats: updatedStats,
    node: nextNode,
    effects_applied: disciplines.map((d) => `⚑ ${d}`),
  });
}

// ------------------------------------------------------------
// Gestionnaire : équipement de départ (Table de Hasard)
// ------------------------------------------------------------
async function handleSetupEquipment(
  admin: ReturnType<typeof createAdminClient>,
  user: { id: string },
  body: { story_id: string; equipment_roll?: number },
) {
  const { story_id, equipment_roll } = body;
  if (equipment_roll === undefined || equipment_roll === null) {
    return fail("bad_request", "Valeur du tirage d'équipement manquante", 400);
  }
  if (equipment_roll < 0 || equipment_roll > 9) {
    return fail("bad_request", "Tirage d'équipement invalide (0-9)", 400);
  }

  // 1. Objets de départ Loup Solitaire
  const startingSlugs = [
    "hache",
    "sac-a-dos",
    "repas",
    "carte-geographique",
  ];

  for (const slug of startingSlugs) {
    const { data: item } = await admin
      .from("items")
      .select("id")
      .eq("slug", slug)
      .eq("story_id", story_id)
      .maybeSingle();
    if (item) {
      await admin.from("user_inventory").upsert(
        { user_id: user.id, item_id: item.id, quantity: 1 },
        { onConflict: "user_id,item_id" },
      );
    }
  }

  // 2. Objet aléatoire (Table de Hasard)
  const { data: equipNode } = await admin
    .from("story_nodes")
    .select("metadata")
    .eq("story_id", story_id)
    .eq("metadata->>kind", "equipment_setup")
    .single();

  if (equipNode) {
    const randomTable = (equipNode.metadata as any)?.random_table ?? {};
    const randomItemName = Object.values(randomTable)[equipment_roll] as
      | string
      | undefined;
    if (randomItemName) {
      const { data: randomItem } = await admin
        .from("items")
        .select("id")
        .ilike("name", `%${randomItemName}%`)
        .eq("story_id", story_id)
        .limit(1)
        .maybeSingle();

      if (randomItem) {
        await admin.from("user_inventory").upsert(
          { user_id: user.id, item_id: randomItem.id, quantity: 1 },
          { onConflict: "user_id,item_id" },
        );
      }
    }
  }

  // 3. Avancer vers la section 001
  let nextNode = null;
  const { data: sectionOne } = await admin
    .from("story_nodes")
    .select("*")
    .eq("story_id", story_id)
    .eq("node_key", "section_001")
    .maybeSingle();

  if (sectionOne) {
    nextNode = sectionOne;
    await admin.from("user_story_progress").upsert(
      {
        user_id: user.id,
        story_id: story_id,
        current_node_id: sectionOne.id,
        last_played_at: new Date().toISOString(),
      },
      { onConflict: "user_id,story_id" },
    );
  }

  return json({
    node: nextNode,
    effects_applied: [
      "Objets de depart ajoutes a la sacoche",
      `Objet aleatoire (tirage ${equipment_roll}) ajoute`,
    ],
  });
}

// ------------------------------------------------------------
// Gestionnaire : jet de Hasard narratif (ex : Section 36)
// ------------------------------------------------------------
async function handleHazardRoll(
  admin: ReturnType<typeof createAdminClient>,
  user: { id: string },
  body: { story_id: string; hazard_roll?: number; current_node_id?: string },
) {
  const { story_id, hazard_roll, current_node_id } = body;
  if (hazard_roll === undefined || hazard_roll === null) {
    return fail("bad_request", "Valeur du jet de Hasard manquante", 400);
  }
  if (!current_node_id) {
    return fail("bad_request", "current_node_id manquant", 400);
  }

  // 1. Charger le noeud actuel
  const { data: currentNode } = await admin
    .from("story_nodes")
    .select("*")
    .eq("id", current_node_id)
    .single();

  if (!currentNode) {
    return fail("node_not_found", "Noeud introuvable", 404);
  }

  // 2. Relever les stats actuelles
  const { data: stats } = await admin
    .from("character_stats")
    .select("*")
    .eq("user_id", user.id)
    .eq("story_id", story_id)
    .single();

  if (!stats) {
    return fail("stats_not_found", "Stats du personnage introuvables", 404);
  }

  const content = (currentNode.content as string) ?? "";
  const effectsApplied: string[] = [];
  let nextNode = null;
  let hpDelta = 0;

  // 3. Chercher des conséquences dans les métadonnées ou le contenu
  const hazardMetadata = (currentNode as any)?.metadata?.hazard_consequences;

  if (hazardMetadata && Array.isArray(hazardMetadata)) {
    // Mode générique : métadonnées du noeud
    for (const rule of hazardMetadata) {
      if (hazard_roll >= (rule.min ?? 0) && hazard_roll <= (rule.max ?? 9)) {
        if (rule.hp_delta) {
          hpDelta = rule.hp_delta;
          stats.hp_current = Math.max(0, stats.hp_current + hpDelta);
          if (stats.hp_current > stats.hp_max) {
            stats.hp_current = stats.hp_max;
          }
          effectsApplied.push(`${hpDelta > 0 ? "+" : ""}${hpDelta} END`);
        }
        if (rule.target_node_key) {
          const { data: targetNode } = await admin
            .from("story_nodes")
            .select("*")
            .eq("story_id", story_id)
            .eq("node_key", rule.target_node_key)
            .single();
          if (targetNode) nextNode = targetNode;
        }
        break;
      }
    }
  } else if (
    content.includes("Section 36") ||
    content.includes("vieille tour de guet")
  ) {
    // Mode compatibilité Section 36 (histoire Le Maîtres des Ténèbres)
    if (hazard_roll <= 4) {
      hpDelta = -2;
      stats.hp_current = Math.max(0, stats.hp_current - 2);
      effectsApplied.push("-2 END (chute)");

      const { data: section140 } = await admin
        .from("story_nodes")
        .select("*")
        .eq("story_id", story_id)
        .eq("node_key", "section_140")
        .single();
      if (section140) nextNode = section140;
    } else {
      effectsApplied.push("Aucune perte (vous ne tombez pas)");

      const { data: section323 } = await admin
        .from("story_nodes")
        .select("*")
        .eq("story_id", story_id)
        .eq("node_key", "section_323")
        .single();
      if (section323) nextNode = section323;
    }
  }

  // 4. Appliquer les modifs si les HP ont changé
  if (hpDelta !== 0) {
    await admin
      .from("character_stats")
      .update({
        hp_current: stats.hp_current,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("story_id", story_id);
  }

  // 5. Mettre à jour la progression si on navigue
  if (nextNode) {
    await admin.from("user_story_progress").upsert(
      {
        user_id: user.id,
        story_id: story_id,
        current_node_id: nextNode.id,
        last_played_at: new Date().toISOString(),
      },
      { onConflict: "user_id,story_id" },
    );
  }

  return json({
    stats: {
      hp_current: stats.hp_current,
      hp_max: stats.hp_max,
      strength: stats.strength,
      agility: stats.agility,
      luck: stats.luck,
      charisma: stats.charisma,
      narrative_flags: stats.narrative_flags,
    },
    node: nextNode,
    effects_applied: effectsApplied,
  });
}

// ------------------------------------------------------------
// Routeur principal
// ------------------------------------------------------------
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
      action?: string;
      disciplines?: string[];
      equipment_roll?: number;
      hazard_roll?: number;
      current_node_id?: string;
    };
    try {
      body = await req.json();
    } catch {
      return fail("bad_request", "Corps JSON invalide", 400);
    }

    if (!body.story_id) {
      return fail("bad_request", "Paramètre story_id manquant", 400);
    }
    if (!body.action) {
      return fail("bad_request", "Paramètre action manquant", 400);
    }

    switch (body.action) {
      case "save_disciplines":
        return await handleSaveDisciplines(admin, user, body);
      case "setup_equipment":
        return await handleSetupEquipment(admin, user, body);
      case "hazard_roll":
        return await handleHazardRoll(admin, user, body);
      default:
        return fail("invalid_action", `Action inconnue : ${body.action}`, 400);
    }
  } catch (err) {
    console.error("game-setup-action unexpected error:", err);
    return fail("internal", "Erreur interne du serveur", 500);
  }
});