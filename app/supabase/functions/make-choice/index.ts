// ============================================================
// HeroBook — Edge Function `make-choice`
// ------------------------------------------------------------
// Validation serveur d'un choix narratif. Remplace l'écriture directe
// du client : pré-conditions, débit premium, historique, effets,
// progression, récompenses de fin et succès — tout est recalculé et
// écrit côté serveur (service_role).
//
// Entrée  : { choice_id: uuid }
// Sortie  : {
//   node, choices, stats, wallet, effects_applied,
//   is_ending, is_victory, is_new_ending, reward_gems,
//   achievements_unlocked
// }
// Erreurs : 400 bad_request · 401 unauthorized · 402 insufficient_funds
//           403 story_locked/not_published · 404 choice_not_found
//           422 requirement_not_met · 500 internal
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";

interface ChoiceEffect {
  effect_type: string;
  stat_key: string | null;
  stat_value: number | null;
  item_id: string | null;
  flag_key: string | null;
  flag_value: boolean | null;
}

interface CharacterStatsRow {
  hp_current: number;
  hp_max: number;
  strength: number;
  agility: number;
  luck: number;
  charisma: number;
  narrative_flags: Record<string, unknown> | null;
}

const FIRST_VICTORY_REWARD_GEMS = 20;

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  try {
    const admin = createAdminClient();
    const user = await getUser(req, admin);
    if (!user) {
      return fail("unauthorized", "Authentification requise", 401);
    }

    let body: { choice_id?: string };
    try {
      body = await req.json();
    } catch {
      return fail("bad_request", "Corps JSON invalide", 400);
    }
    if (!body.choice_id) {
      return fail("bad_request", "Paramètre choice_id manquant", 400);
    }

    // --------------------------------------------------------
    // 1. Charger le choix, son noeud source, l'histoire
    // --------------------------------------------------------
    const { data: choice, error: choiceError } = await admin
      .from("story_choices")
      .select("*")
      .eq("id", body.choice_id)
      .single();
    if (choiceError || !choice) {
      return fail("choice_not_found", "Choix introuvable", 404);
    }
    if (!choice.target_node_id) {
      return fail("choice_has_no_target", "Ce choix ne mène nulle part", 400);
    }

    const { data: node } = await admin
      .from("story_nodes")
      .select("*")
      .eq("id", choice.node_id)
      .single();
    if (!node) {
      return fail("node_not_found", "Noeud source introuvable", 404);
    }

    const { data: story } = await admin
      .from("stories")
      .select("*")
      .eq("id", node.story_id)
      .single();
    if (!story) {
      return fail("story_not_found", "Histoire introuvable", 404);
    }
    if (story.status !== "published") {
      return fail("story_not_published", "Histoire non publiée", 403);
    }

    // --------------------------------------------------------
    // 2. Droit d'accès à l'histoire (gratuite ou achetée)
    // --------------------------------------------------------
    if (!story.is_free) {
      const { data: access } = await admin
        .from("user_story_progress")
        .select("is_purchased")
        .eq("user_id", user.id)
        .eq("story_id", story.id)
        .maybeSingle();
      if (!access?.is_purchased) {
        return fail(
          "story_locked",
          "Histoire non achetée",
          403,
        );
      }
    }

    // --------------------------------------------------------
    // 3. Stats du run (créées au besoin) + effets du choix
    // --------------------------------------------------------
    await admin
      .from("character_stats")
      .upsert(
        { user_id: user.id, story_id: story.id },
        { onConflict: "user_id,story_id", ignoreDuplicates: true },
      );

    const { data: stats } = await admin
      .from("character_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("story_id", story.id)
      .single();
    if (!stats) {
      return fail("stats_unavailable", "Stats du personnage introuvables", 500);
    }

    const { data: effects } = await admin
      .from("choice_effects")
      .select("*")
      .eq("choice_id", choice.id);
    const choiceEffects: ChoiceEffect[] = effects ?? [];

    // --------------------------------------------------------
    // 4. Pré-conditions (avant tout débit / mutation)
    // --------------------------------------------------------
    for (const effect of choiceEffects) {
      if (effect.effect_type === "inventory_require" && effect.item_id) {
        const { data: owned } = await admin
          .from("user_inventory")
          .select("quantity")
          .eq("user_id", user.id)
          .eq("item_id", effect.item_id)
          .gt("quantity", 0)
          .maybeSingle();
        if (!owned) {
          return fail(
            "requirement_not_met",
            "Objet requis manquant dans la sacoche",
            422,
          );
        }
      }
      if (effect.effect_type === "flag_require" && effect.flag_key) {
        const flags = (stats.narrative_flags ?? {}) as Record<string, unknown>;
        
        const requiredKey = effect.flag_key;
        
        // Fonction de normalisation ultra-tolérante
        // ATTENTION : les replace spéciaux doivent passer AVANT le strip
        // des caractères non-alpha, sinon 'six_cieme' ne peut pas être
        // trouvé après suppression des underscores.
        const normalize = (str: string) => str.toLowerCase()
          .replace('sixième', 'sixieme')
          .replace('six_cieme', 'sixieme')
          .replace(/[^a-z]/g, '');

        const requiredNormalized = normalize(requiredKey);
        
        // Chercher une correspondance dans les flags
        let current = flags[requiredKey];
        
        if (current === undefined) {
          for (const [key, value] of Object.entries(flags)) {
            if (normalize(key) === requiredNormalized) {
              current = value;
              break;
            }
          }
        }

        const expected = effect.flag_value ?? true;
        if (Boolean(current) !== Boolean(expected)) {
          return fail(
            "requirement_not_met",
            "Condition narrative non remplie",
            422,
          );
        }
      }
    }

    // --------------------------------------------------------
    // 5. Débit premium — atomique, AVANT toute mutation
    // --------------------------------------------------------
    let walletGems: number | null = null;
    const premiumPrice = choice.is_premium ? (choice.price_gems ?? 0) : 0;

    if (premiumPrice > 0) {
      const { data: walletData, error: walletError } = await admin.rpc(
        "process_wallet_transaction",
        {
          p_user_id: user.id,
          p_type: "gem_spend",
          p_gems_delta: -premiumPrice,
          p_story_id: story.id,
          p_metadata: {
            reason: "premium_choice",
            choice_id: choice.id,
          },
        },
      );
      if (walletError) {
        if (walletError.message.includes("insufficient_funds")) {
          return fail(
            "insufficient_funds",
            "Gemmes insuffisantes pour ce choix premium",
            402,
          );
        }
        console.error("make-choice wallet error:", walletError.message);
        return fail("wallet_error", "Erreur de portefeuille", 500);
      }
      walletGems = walletData?.[0]?.gems ?? null;
    }

    // --------------------------------------------------------
    // 6. Historique du choix (serveur = source de vérité)
    // --------------------------------------------------------
    await admin.from("choice_history").insert({
      user_id: user.id,
      story_id: story.id,
      node_id: node.id,
      choice_id: choice.id,
    });

    // --------------------------------------------------------
    // 7. Application des effets (stats / flags / inventaire)
    // --------------------------------------------------------
    const updatedStats: CharacterStatsRow = {
      hp_current: stats.hp_current,
      hp_max: stats.hp_max,
      strength: stats.strength,
      agility: stats.agility,
      luck: stats.luck,
      charisma: stats.charisma,
      narrative_flags: { ...(stats.narrative_flags ?? {}) },
    };
    const effectsApplied: string[] = [];

    const statPatch: Record<string, number> = {};
    let flagsChanged = false;

    for (const effect of choiceEffects) {
      if (effect.effect_type === "stat_modifier" && effect.stat_key) {
        const delta = effect.stat_value ?? 0;
        if (effect.stat_key === "hp_current" || effect.stat_key === "hp_max") {
          if (effect.stat_key === "hp_max") {
            statPatch.hp_max = (statPatch.hp_max ?? updatedStats.hp_max) + delta;
          } else {
            statPatch.hp_current =
              (statPatch.hp_current ?? updatedStats.hp_current) + delta;
          }
        } else if (
          ["strength", "agility", "luck", "charisma"].includes(
            effect.stat_key,
          )
        ) {
          statPatch[effect.stat_key] =
            (statPatch[effect.stat_key] ??
              (updatedStats as unknown as Record<string, number>)[
                effect.stat_key
              ]) + delta;
        } else {
          continue; // clé inconnue : ignorée côté serveur
        }
        effectsApplied.push(
          `${delta > 0 ? "+" : ""}${delta} ${effect.stat_key.toUpperCase()}`,
        );
      } else if (
        effect.effect_type === "flag_set" &&
        effect.flag_key
      ) {
        (updatedStats.narrative_flags as Record<string, unknown>)[
          effect.flag_key
        ] = effect.flag_value ?? true;
        flagsChanged = true;
        effectsApplied.push(`⚑ ${effect.flag_key}`);
      } else if (effect.effect_type === "inventory_add" && effect.item_id) {
        const { data: existingInv } = await admin
          .from("user_inventory")
          .select("id, quantity")
          .eq("user_id", user.id)
          .eq("item_id", effect.item_id)
          .maybeSingle();
        if (existingInv) {
          await admin
            .from("user_inventory")
            .update({ quantity: existingInv.quantity + 1 })
            .eq("id", existingInv.id);
        } else {
          await admin
            .from("user_inventory")
            .insert({ user_id: user.id, item_id: effect.item_id, quantity: 1 });
        }
        effectsApplied.push("🎁 Objet ajouté à la sacoche");
      }
    }

    // Clamp PV après application des modificateurs
    if (statPatch.hp_max !== undefined) updatedStats.hp_max = statPatch.hp_max;
    if (statPatch.hp_current !== undefined) {
      updatedStats.hp_current = statPatch.hp_current;
    }
    if (updatedStats.hp_current > updatedStats.hp_max) {
      updatedStats.hp_current = updatedStats.hp_max;
    }
    if (updatedStats.hp_current < 0) updatedStats.hp_current = 0;
    for (const key of ["strength", "agility", "luck", "charisma"]) {
      if (statPatch[key] !== undefined) {
        (updatedStats as unknown as Record<string, number>)[key] =
          statPatch[key];
      }
    }

    const statsUpdate: Record<string, unknown> = {
      hp_current: updatedStats.hp_current,
      hp_max: updatedStats.hp_max,
      strength: updatedStats.strength,
      agility: updatedStats.agility,
      luck: updatedStats.luck,
      charisma: updatedStats.charisma,
      updated_at: new Date().toISOString(),
    };
    if (flagsChanged) {
      statsUpdate.narrative_flags = updatedStats.narrative_flags;
    }
    await admin
      .from("character_stats")
      .update(statsUpdate)
      .eq("user_id", user.id)
      .eq("story_id", story.id);

    // --------------------------------------------------------
    // 8. Noeud cible + progression (serveur = source de vérité)
    // --------------------------------------------------------
    const { data: targetNode } = await admin
      .from("story_nodes")
      .select("*")
      .eq("id", choice.target_node_id)
      .single();
    if (!targetNode) {
      return fail("target_not_found", "Noeud cible introuvable", 404);
    }

    const isEnding = Boolean(targetNode.is_ending);
    const isVictory = targetNode.ending_type === "victory";
    const endingKey = targetNode.node_key ?? targetNode.id;

    const { data: progress } = await admin
      .from("user_story_progress")
      .select("id, endings_found, is_completed, completed_at")
      .eq("user_id", user.id)
      .eq("story_id", story.id)
      .maybeSingle();

    const oldEndings: string[] = progress?.endings_found ?? [];
    const isNewEnding = isEnding && !oldEndings.includes(endingKey);
    const updatedEndings = isEnding
      ? Array.from(new Set([...oldEndings, endingKey]))
      : oldEndings;

    const progressPatch: Record<string, unknown> = {
      current_node_id: targetNode.id,
      completion_pct: isEnding ? 100 : Math.max(50, progress?.id ? 50 : 10),
      endings_found: updatedEndings,
      last_played_at: new Date().toISOString(),
    };
    if (isEnding) {
      progressPatch.is_completed = true;
      progressPatch.completed_at = new Date().toISOString();
    } else if (progress?.is_completed) {
      progressPatch.is_completed = true; // une histoire finie reste finie
    }

    if (progress) {
      await admin
        .from("user_story_progress")
        .update(progressPatch)
        .eq("id", progress.id);
    } else {
      await admin.from("user_story_progress").insert({
        user_id: user.id,
        story_id: story.id,
        current_node_id: targetNode.id,
        completion_pct: isEnding ? 100 : 10,
        endings_found: updatedEndings,
        is_completed: isEnding,
        completed_at: isEnding ? new Date().toISOString() : null,
        last_played_at: new Date().toISOString(),
      });
    }

    // --------------------------------------------------------
    // 9. Récompense de 1ère victoire (serveur, anti-rejeu)
    // --------------------------------------------------------
    let rewardGems = 0;
    if (isVictory && isNewEnding) {
      const { data: rewardData, error: rewardError } = await admin.rpc(
        "process_wallet_transaction",
        {
          p_user_id: user.id,
          p_type: "gem_reward",
          p_gems_delta: FIRST_VICTORY_REWARD_GEMS,
          p_story_id: story.id,
          p_metadata: { reason: "first_victory", ending: endingKey },
        },
      );
      if (!rewardError && rewardData?.[0]) {
        rewardGems = FIRST_VICTORY_REWARD_GEMS;
        walletGems = rewardData[0].gems;
      } else if (rewardError) {
        console.error("make-choice reward error:", rewardError.message);
      }
    }

    // --------------------------------------------------------
    // 10. Succès (conditions revalidées côté serveur)
    // --------------------------------------------------------
    const achievementsUnlocked: string[] = [];
    if (isEnding) {
      const { data: achData, error: achError } = await admin.rpc(
        "claim_achievements",
        { p_user_id: user.id },
      );
      if (!achError && achData) {
        const unlocked = achData.unlocked ?? [];
        for (const a of unlocked) achievementsUnlocked.push(a.name);
        if (typeof achData.gems === "number") walletGems = achData.gems;
      } else if (achError) {
        console.error("make-choice achievements error:", achError.message);
      }
    }

    // --------------------------------------------------------
    // 11. Choix disponibles au prochain noeud
    // --------------------------------------------------------
    const { data: nextChoices } = await admin
      .from("story_choices")
      .select("*, choice_effects(*)")
      .eq("node_id", targetNode.id)
      .order("display_order", { ascending: true });

    if (walletGems === null) {
      const { data: wallet } = await admin
        .from("wallets")
        .select("gems, coins")
        .eq("user_id", user.id)
        .single();
      walletGems = wallet?.gems ?? null;
    }

    return json({
      node: targetNode,
      choices: nextChoices ?? [],
      stats: updatedStats,
      wallet: { gems: walletGems },
      effects_applied: effectsApplied,
      is_ending: isEnding,
      is_victory: isVictory,
      is_new_ending: isNewEnding,
      reward_gems: rewardGems,
      achievements_unlocked: achievementsUnlocked,
    });
  } catch (err) {
    console.error("make-choice unexpected error:", err);
    return fail("internal", "Erreur interne du serveur", 500);
  }
});
