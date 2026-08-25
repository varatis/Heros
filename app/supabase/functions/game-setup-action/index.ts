// ============================================================
// HeroBook — Edge Function `game-setup-action` — v2
// ------------------------------------------------------------
// Actions préparatoires + génériques Vie/Armure/Attaque
// Sacoche par aventure (story_id) — migration 017
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";
import {
  applyArrivalEffects,
  destroyBackpack,
  GOLD_CAP,
} from "../_shared/arrival.ts";

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
    await admin.from("user_story_progress").update(patch).eq("id", progress.id);
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

async function handleSaveDisciplines(
  admin: ReturnType<typeof createAdminClient>,
  user: { id: string },
  body: { story_id: string; disciplines?: string[] },
) {
  const { story_id, disciplines } = body;
  if (!disciplines || disciplines.length === 0) {
    return fail("bad_request", "Aucune discipline fournie", 400);
  }

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

  const startingSlugs = ["hache", "sac-a-dos", "repas", "carte-geographique"];

  for (const slug of startingSlugs) {
    const { data: item } = await admin
      .from("items")
      .select("id")
      .eq("slug", slug)
      .eq("story_id", story_id)
      .maybeSingle();
    if (item) {
      await admin.from("user_inventory").upsert(
        {
          user_id: user.id,
          item_id: item.id,
          quantity: 1,
          story_id: story_id,
        },
        { onConflict: "user_id,story_id,item_id" },
      );
    }
  }

  const { data: equipNode } = await admin
    .from("story_nodes")
    .select("metadata")
    .eq("story_id", story_id)
    .eq("metadata->>kind", "equipment_setup")
    .single();

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
        const { data: existing } = await admin
          .from("user_inventory")
          .select("id, quantity")
          .eq("user_id", user.id)
          .eq("item_id", randomItem.id)
          .eq("story_id", story_id)
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
            story_id: story_id,
          });
        }
      }
    }
  }

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

  const { data: currentNode } = await admin
    .from("story_nodes")
    .select("*")
    .eq("id", current_node_id)
    .single();

  if (!currentNode) {
    return fail("node_not_found", "Noeud introuvable", 404);
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

  const effectsApplied: string[] = [];
  let nextNode = null;
  const hpBefore = stats.hp_current;
  const hpMaxBefore = stats.hp_max;
  const strengthBefore = stats.strength;
  const armorBefore = (stats as any).armor ?? 0;
  const attackBefore = (stats as any).attack_power ?? 0;

  const hazardMetadata = (currentNode as any)?.metadata?.hazard_consequences;

  if (hazardMetadata && Array.isArray(hazardMetadata)) {
    for (const rule of hazardMetadata) {
      if (hazard_roll >= (rule.min ?? 0) && hazard_roll <= (rule.max ?? 9)) {
        if (rule.hp_delta) {
          stats.hp_current = Math.max(0, stats.hp_current + rule.hp_delta);
          if (stats.hp_current > stats.hp_max) stats.hp_current = stats.hp_max;
          effectsApplied.push(
            `${rule.hp_delta > 0 ? "+" : ""}${rule.hp_delta} ${story_id ? "Vie" : "END"}`,
          );
        }
        if (rule.armor_delta) {
          (stats as any).armor = Math.max(
            0,
            ((stats as any).armor ?? 0) + rule.armor_delta,
          );
          effectsApplied.push(
            `${rule.armor_delta > 0 ? "+" : ""}${rule.armor_delta} Armure`,
          );
        }
        if (rule.attack_delta) {
          (stats as any).attack_power = Math.max(
            0,
            ((stats as any).attack_power ?? 0) + rule.attack_delta,
          );
          effectsApplied.push(
            `${rule.attack_delta > 0 ? "+" : ""}${rule.attack_delta} Attaque`,
          );
        }
        if (rule.lose_backpack) {
          const lost = await destroyBackpack(admin, user.id, story_id);
          effectsApplied.push(
            ...(lost.length > 0
              ? lost
              : ["🎒 Sac à Dos détruit (il était déjà perdu ou vide)."]),
          );
        }
        if (rule.message) effectsApplied.push(rule.message);
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

  if (nextNode) {
    const arrivalMessages = await applyArrivalEffects(
      admin,
      user.id,
      story_id,
      nextNode,
      stats as any,
    );
    effectsApplied.push(...arrivalMessages);
  }

  const statsChanged =
    stats.hp_current !== hpBefore ||
    stats.strength !== strengthBefore ||
    stats.hp_max !== hpMaxBefore ||
    (stats as any).armor !== armorBefore ||
    (stats as any).attack_power !== attackBefore;

  if (statsChanged || nextNode) {
    await admin
      .from("character_stats")
      .update({
        hp_current: stats.hp_current,
        hp_max: stats.hp_max,
        strength: stats.strength,
        agility: (stats as any).armor ?? stats.agility,
        armor: (stats as any).armor ?? 0,
        attack_power: (stats as any).attack_power ?? stats.strength,
        ...(nextNode ? { combat_state: null } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("story_id", story_id);
  }

  if (stats.hp_current <= 0) {
    const { data: deathNode } = await admin
      .from("story_nodes")
      .select("*")
      .eq("story_id", story_id)
      .eq("node_key", "mort_epuisement")
      .maybeSingle();
    if (deathNode) {
      nextNode = deathNode;
      effectsApplied.push("Votre Vie est tombée à zéro : vous succombez.");
    }
  }

  if (nextNode) {
    await upsertProgressToNode(admin, user.id, story_id, nextNode);
  }

  return json({
    stats: {
      hp_current: stats.hp_current,
      hp_max: stats.hp_max,
      strength: stats.strength,
      agility: (stats as any).armor ?? stats.agility,
      armor: (stats as any).armor ?? 0,
      attack_power: (stats as any).attack_power ?? stats.strength,
      luck: stats.luck,
      charisma: stats.charisma,
      narrative_flags: stats.narrative_flags,
    },
    node: nextNode,
    effects_applied: effectsApplied,
  });
}

async function handleCombatFlee(
  admin: ReturnType<typeof createAdminClient>,
  user: { id: string },
  body: { story_id: string; current_node_id?: string },
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
    return fail("flee_not_allowed", "La fuite n'est pas possible.", 422);
  }

  const { data: stats } = await admin
    .from("character_stats")
    .select("*")
    .eq("user_id", user.id)
    .eq("story_id", story_id)
    .single();
  if (!stats) {
    return fail("stats_not_found", "Stats introuvables", 404);
  }
  if (stats.hp_current <= 0) {
    return fail("player_dead", "Vous êtes déjà mort", 422);
  }

  const minRounds = flee.min_rounds ?? 0;
  const combatState = stats.combat_state as
    | { node_id?: string; round?: number }
    | null;
  const rounds = combatState && combatState.node_id === currentNode.id
    ? (combatState.round ?? 0)
    : 0;
  if (rounds < minRounds) {
    return fail(
      "flee_too_early",
      `Fuite autorisée seulement après ${minRounds} assaut(s).`,
      422,
    );
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

  const arrivalMessages = await applyArrivalEffects(
    admin,
    user.id,
    story_id,
    target,
    stats as any,
  );
  await admin
    .from("character_stats")
    .update({
      hp_current: stats.hp_current,
      strength: stats.strength,
      armor: (stats as any).armor,
      attack_power: (stats as any).attack_power,
      combat_state: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("story_id", story_id);

  await upsertProgressToNode(admin, user.id, story_id, target);

  return json({
    node: target,
    effects_applied: ["Vous prenez la fuite !", ...arrivalMessages],
  });
}

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
