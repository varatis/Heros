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
//   combat_flee       → fuite de combat vers une section du livre
//
// Entrée  : {
//   action: string,
//   story_id: uuid,
//   // selon action :
//   disciplines?: string[],
//   equipment_roll?: number,
//   hazard_roll?: number,
//   current_node_id?: uuid,
//   round_count?: number,
// }
// Sortie  : { stats?, node?, effects_applied: string[] }
// Erreurs : 400 · 401 · 404 · 422 · 500
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";
import {
  applyArrivalEffects,
  destroyBackpack,
  GOLD_CAP,
} from "../_shared/arrival.ts";

// ------------------------------------------------------------
// Progression partagée : avance vers un noeud (serveur = vérité)
// en comptabilisant les fins découvertes comme make-choice.
// ------------------------------------------------------------
async function upsertProgressToNode(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  storyId: string,
  node: { id: string; node_key?: string | null; is_ending?: boolean | null },
) {
  const { data: progress } = await admin
    .from("user_story_progress")
    .select("id, endings_found")
    .eq("user_id", userId)
    .eq("story_id", storyId)
    .maybeSingle();

  const isEnding = Boolean(node.is_ending);
  const endingKey = node.node_key ?? node.id;
  const oldEndings: string[] = progress?.endings_found ?? [];
  const endings = isEnding && !oldEndings.includes(endingKey)
    ? [...oldEndings, endingKey]
    : oldEndings;

  const patch: Record<string, unknown> = {
    current_node_id: node.id,
    endings_found: endings,
    last_played_at: new Date().toISOString(),
  };
  if (isEnding) {
    patch.is_completed = true;
    patch.completed_at = new Date().toISOString();
    patch.completion_pct = 100;
  }

  if (progress) {
    await admin
      .from("user_story_progress")
      .update(patch)
      .eq("id", progress.id);
  } else {
    await admin.from("user_story_progress").upsert(
      {
        user_id: userId,
        story_id: storyId,
        completion_pct: isEnding ? 100 : 10,
        is_completed: isEnding,
        completed_at: isEnding ? new Date().toISOString() : null,
        ...patch,
      },
      { onConflict: "user_id,story_id" },
    );
  }
}

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

  // 2. Objet aléatoire (Table de Hasard) — correspondance fidèle au
  //    livre (le nom « Deux Repas » / « Douze Couronnes » requiert une
  //    quantité, et les noms du livre ne coïncident pas tous avec les
  //    slugs du catalogue).
  const { data: equipNode } = await admin
    .from("story_nodes")
    .select("metadata")
    .eq("story_id", story_id)
    .eq("metadata->>kind", "equipment_setup")
    .single();

  // Nom du livre → [slug catalogue, quantité]
  const NAME_TO_ITEM: Record<string, [string, number]> = {
    "Épée": ["epee", 1],
    "Casque": ["casque", 1],
    "Deux Repas": ["repas", 2],
    "Cotte de mailles": ["cotte-de-mailles", 1],
    "Masse d'armes": ["masse-armes", 1],
    "Potion de Guérison": ["potion-guerison", 1],
    "Bâton": ["baton", 1],
    "Lance": ["lance", 1],
    "Douze Couronnes": ["couronnes", 12],
    "Glaive": ["glaive", 1],
  };

  if (equipNode) {
    const randomTable = (equipNode.metadata as any)?.random_table ?? {};
    const randomItemName = (
      randomTable[String(equipment_roll)] ??
      Object.values(randomTable)[equipment_roll]
    ) as string | undefined;
    const mapping = randomItemName ? NAME_TO_ITEM[randomItemName] : undefined;
    if (mapping) {
      const [slug, qty] = mapping;
      const { data: randomItem } = await admin
        .from("items")
        .select("id")
        .eq("slug", slug)
        .eq("story_id", story_id)
        .maybeSingle();

      if (randomItem) {
        // Quantité (le tirage « Deux Repas » ajoute 2 Repas au Repas
        // de départ ; l'or est plafonné à 50 comme dans le livre).
        const { data: existing } = await admin
          .from("user_inventory")
          .select("id, quantity")
          .eq("user_id", user.id)
          .eq("item_id", randomItem.id)
          .maybeSingle();
        const newQty = slug === "couronnes"
          ? Math.min(GOLD_CAP, (existing?.quantity ?? 0) + qty)
          : (existing?.quantity ?? 0) + qty;
        if (existing) {
          await admin
            .from("user_inventory")
            .update({ quantity: newQty })
            .eq("id", existing.id);
        } else {
          await admin.from("user_inventory").insert({
            user_id: user.id,
            item_id: randomItem.id,
            quantity: newQty,
          });
        }
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

  const effectsApplied: string[] = [];
  let nextNode = null;
  let hpDelta = 0;
  const hpBefore = stats.hp_current;
  const hpMaxBefore = stats.hp_max;
  const strengthBefore = stats.strength;

  // 3. Conséquences du jet (metadata.hazard_consequences du noeud —
  //    plages 0-9 fidèles au livre, ajoutées par les migrations 010/012)
  const hazardMetadata = (currentNode as any)?.metadata?.hazard_consequences;

  if (hazardMetadata && Array.isArray(hazardMetadata)) {
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
        // §188 : le Kraan déchire le Sac à Dos (contenu perdu)
        if (rule.lose_backpack) {
          const lost = await destroyBackpack(admin, user.id, story_id);
          effectsApplied.push(
            ...(lost.length > 0
              ? lost
              : ["🎒 Sac à Dos détruit (il était déjà perdu ou vide)."]),
          );
        }
        if (rule.message) {
          effectsApplied.push(rule.message);
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
  }

  // 3bis. Règles d'arrivée sur la section ciblée par le jet
  // (repas, blessures narratives, butins... — même mécanique que
  // make-choice).
  if (nextNode) {
    const arrivalMessages = await applyArrivalEffects(
      admin,
      user.id,
      story_id,
      nextNode,
      stats,
    );
    effectsApplied.push(...arrivalMessages);
  }

  // 4. Persister si les stats ont bougé (jet ou règles d'arrivée)
  const statsChanged =
    stats.hp_current !== hpBefore ||
    stats.strength !== strengthBefore ||
    stats.hp_max !== hpMaxBefore;
  if (statsChanged) {
    await admin
      .from("character_stats")
      .update({
        hp_current: stats.hp_current,
        hp_max: stats.hp_max,
        strength: stats.strength,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("story_id", story_id);
  }

  // 4bis. Règle Loup Solitaire : Endurance 0 => mort = fin de partie.
  //        La mort l'emporte sur la destination normale du jet.
  if (stats.hp_current <= 0) {
    const { data: deathNode } = await admin
      .from("story_nodes")
      .select("*")
      .eq("story_id", story_id)
      .eq("node_key", "mort_epuisement")
      .maybeSingle();
    if (deathNode) {
      nextNode = deathNode;
      effectsApplied.push(
        "Votre Endurance est tombée à zéro : vous succombez.",
      );
    }
  }

  // 5. Mettre à jour la progression si on navigue
  if (nextNode) {
    await upsertProgressToNode(admin, user.id, story_id, nextNode);
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
// Gestionnaire : fuite de combat (règle du livre-jeu Loup Solitaire)
// Le round de fuite (perte d'ENDURANCE) est résolu avant via
// `resolve-combat-round` ; ici on valide la possibilité de fuir
// (metadata.combat.flee du noeud) puis on navigue vers la section
// de fuite prévue par le livre.
// ------------------------------------------------------------
async function handleCombatFlee(
  admin: ReturnType<typeof createAdminClient>,
  user: { id: string },
  body: { story_id: string; current_node_id?: string; round_count?: number },
) {
  const { story_id, current_node_id } = body;
  if (!current_node_id) {
    return fail("bad_request", "current_node_id manquant", 400);
  }

  const { data: currentNode } = await admin
    .from("story_nodes")
    .select("*")
    .eq("id", current_node_id)
    .single();
  if (!currentNode) {
    return fail("node_not_found", "Noeud introuvable", 404);
  }

  const flee = (currentNode as any)?.metadata?.combat?.flee;
  if (!flee?.target_node_key) {
    return fail(
      "flee_not_allowed",
      "La fuite n'est pas possible pour ce combat.",
      422,
    );
  }

  const minRounds = flee.min_rounds ?? 0;
  const rounds = typeof body.round_count === "number" ? body.round_count : 0;
  if (rounds < minRounds) {
    return fail(
      "flee_too_early",
      `Fuite autorisée seulement après ${minRounds} assaut(s).`,
      422,
    );
  }

  const { data: stats } = await admin
    .from("character_stats")
    .select("*")
    .eq("user_id", user.id)
    .eq("story_id", story_id)
    .single();
  if (!stats) {
    return fail("stats_not_found", "Stats du personnage introuvables", 404);
  }
  if (stats.hp_current <= 0) {
    return fail("player_dead", "Vous êtes déjà mort", 422);
  }

  const { data: target } = await admin
    .from("story_nodes")
    .select("*")
    .eq("story_id", story_id)
    .eq("node_key", flee.target_node_key)
    .single();
  if (!target) {
    return fail("target_not_found", "Section de fuite introuvable", 404);
  }

  // Règles d'arrivée sur la section de fuite (repas, blessures...)
  const hpBefore = stats.hp_current;
  const strengthBefore = stats.strength;
  const arrivalMessages = await applyArrivalEffects(
    admin,
    user.id,
    story_id,
    target,
    stats,
  );
  if (stats.hp_current !== hpBefore || stats.strength !== strengthBefore) {
    await admin
      .from("character_stats")
      .update({
        hp_current: stats.hp_current,
        strength: stats.strength,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("story_id", story_id);
  }

  await upsertProgressToNode(admin, user.id, story_id, target);

  return json({
    node: target,
    effects_applied: ["Vous prenez la fuite !", ...arrivalMessages],
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
      round_count?: number;
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
      case "combat_flee":
        return await handleCombatFlee(admin, user, body);
      default:
        return fail("invalid_action", `Action inconnue : ${body.action}`, 400);
    }
  } catch (err) {
    console.error("game-setup-action unexpected error:", err);
    return fail("internal", "Erreur interne du serveur", 500);
  }
});