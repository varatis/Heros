// ============================================================
// HeroBook — Edge Function `make-choice` — v2 : Vie/Armure/Attaque
// ------------------------------------------------------------
// Validation serveur d'un choix narratif + sacoche par aventure
// ------------------------------------------------------------

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";
import {
  addItemQuantity,
  applyArrivalEffects,
  removeItemQuantity,
} from "../_shared/arrival.ts";

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
  armor: number;
  attack_power: number;
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

    if (!story.is_free) {
      const { data: access } = await admin
        .from("user_story_progress")
        .select("is_purchased")
        .eq("user_id", user.id)
        .eq("story_id", story.id)
        .maybeSingle();
      if (!access?.is_purchased) {
        return fail("story_locked", "Histoire non achetée", 403);
      }
    }

    await admin.from("character_stats").upsert(
      {
        user_id: user.id,
        story_id: story.id,
        armor: 0,
        attack_power: 5,
      },
      { onConflict: "user_id,story_id", ignoreDuplicates: true },
    );

    const { data: stats } = await admin
      .from("character_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("story_id", story.id)
      .single();
    if (!stats) {
      return fail("stats_unavailable", "Stats introuvables", 500);
    }

    const { data: effects } = await admin
      .from("choice_effects")
      .select("*")
      .eq("choice_id", choice.id);
    const choiceEffects: ChoiceEffect[] = effects ?? [];

    // Pré-conditions : inventaire PAR AVENTURE
    for (const effect of choiceEffects) {
      if (effect.effect_type === "inventory_require" && effect.item_id) {
        const requiredQty = effect.stat_value ?? 1;
        const { data: owned } = await admin
          .from("user_inventory")
          .select("quantity")
          .eq("user_id", user.id)
          .eq("item_id", effect.item_id)
          .eq("story_id", story.id)
          .gte("quantity", requiredQty)
          .maybeSingle();
        if (!owned) {
          return fail(
            "requirement_not_met",
            requiredQty > 1
              ? `Objet requis en quantité insuffisante (${requiredQty} requis)`
              : "Objet requis manquant dans la sacoche",
            422,
          );
        }
      }
      if (effect.effect_type === "flag_require" && effect.flag_key) {
        const flags = (stats.narrative_flags ?? {}) as Record<string, unknown>;
        const normalize = (str: string) =>
          str
            .toLowerCase()
            .replace(/^discipline_/, "")
            .replace("sixième", "sixieme")
            .replace("six_cieme", "sixieme")
            .replace(/[^a-z]/g, "");
        const requiredNormalized = normalize(effect.flag_key);
        let current = flags[effect.flag_key];
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
          return fail("requirement_not_met", "Condition narrative non remplie", 422);
        }
      }
    }

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
          p_metadata: { reason: "premium_choice", choice_id: choice.id },
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

    await admin.from("choice_history").insert({
      user_id: user.id,
      story_id: story.id,
      node_id: node.id,
      choice_id: choice.id,
    });

    const updatedStats: CharacterStatsRow = {
      hp_current: stats.hp_current,
      hp_max: stats.hp_max,
      strength: stats.strength,
      agility: stats.agility,
      luck: stats.luck,
      charisma: stats.charisma,
      armor: (stats as any).armor ?? 0,
      attack_power: (stats as any).attack_power ?? stats.strength ?? 5,
      narrative_flags: { ...(stats.narrative_flags ?? {}) },
    };
    const effectsApplied: string[] = [];
    const statPatch: Record<string, number> = {};
    let flagsChanged = false;

    for (const effect of choiceEffects) {
      if (effect.effect_type === "stat_modifier" && effect.stat_key) {
        const delta = effect.stat_value ?? 0;
        if (effect.stat_key === "hp_current") {
          statPatch.hp_current =
            (statPatch.hp_current ?? updatedStats.hp_current) + delta;
          effectsApplied.push(
            `${delta > 0 ? "+" : ""}${delta} ${story.slug === "les-maitres-des-tenebres" ? "END" : "Vie"}`,
          );
        } else if (effect.stat_key === "hp_max") {
          statPatch.hp_max = (statPatch.hp_max ?? updatedStats.hp_max) + delta;
          effectsApplied.push(`${delta > 0 ? "+" : ""}${delta} Vie max`);
        } else if (effect.stat_key === "armor" || effect.stat_key === "agility") {
          statPatch.armor = (statPatch.armor ?? updatedStats.armor) + delta;
          effectsApplied.push(`${delta > 0 ? "+" : ""}${delta} Armure`);
        } else if (
          effect.stat_key === "attack" ||
          effect.stat_key === "attack_power" ||
          effect.stat_key === "strength"
        ) {
          statPatch.attack_power =
            (statPatch.attack_power ?? updatedStats.attack_power) + delta;
          const label = story.slug === "les-maitres-des-tenebres"
            ? "HAB"
            : "Attaque";
          effectsApplied.push(`${delta > 0 ? "+" : ""}${delta} ${label}`);
        } else if (
          ["luck", "charisma"].includes(effect.stat_key)
        ) {
          statPatch[effect.stat_key] =
            (statPatch[effect.stat_key] ??
              (updatedStats as unknown as Record<string, number>)[
                effect.stat_key
              ]) + delta;
          effectsApplied.push(
            `${delta > 0 ? "+" : ""}${delta} ${effect.stat_key.toUpperCase()}`,
          );
        }
      } else if (effect.effect_type === "flag_set" && effect.flag_key) {
        (updatedStats.narrative_flags as Record<string, unknown>)[
          effect.flag_key
        ] = effect.flag_value ?? true;
        flagsChanged = true;
        effectsApplied.push(`⚑ ${effect.flag_key}`);
      } else if (effect.effect_type === "inventory_add" && effect.item_id) {
        const qty = effect.stat_value ?? 1;
        const res = await addItemQuantity(
          admin,
          user.id,
          effect.item_id,
          qty,
          story.id,
        );
        effectsApplied.push(res.message ?? "🎁 Objet ajouté");
      } else if (effect.effect_type === "inventory_remove" && effect.item_id) {
        const qty = effect.stat_value ?? 1;
        const msg = await removeItemQuantity(
          admin,
          user.id,
          effect.item_id,
          qty,
          story.id,
        );
        if (msg) effectsApplied.push(msg);
      }
    }

    if (statPatch.hp_max !== undefined) updatedStats.hp_max = statPatch.hp_max;
    if (statPatch.hp_current !== undefined)
      updatedStats.hp_current = statPatch.hp_current;
    if (statPatch.armor !== undefined) updatedStats.armor = statPatch.armor;
    if (statPatch.attack_power !== undefined)
      updatedStats.attack_power = statPatch.attack_power;

    if (updatedStats.hp_current > updatedStats.hp_max)
      updatedStats.hp_current = updatedStats.hp_max;
    if (updatedStats.hp_current < 0) updatedStats.hp_current = 0;
    if (updatedStats.armor < 0) updatedStats.armor = 0;
    if (updatedStats.attack_power < 0) updatedStats.attack_power = 0;

    for (const key of ["strength", "agility", "luck", "charisma"]) {
      if (statPatch[key] !== undefined) {
        (updatedStats as unknown as Record<string, number>)[key] =
          statPatch[key];
      }
    }
    // Compat : strength = attack, agility = armor pour UI
    if (statPatch.attack_power !== undefined) {
      (updatedStats as any).strength = updatedStats.attack_power;
    }
    if (statPatch.armor !== undefined) {
      (updatedStats as any).agility = updatedStats.armor;
    }

    const statsUpdate: Record<string, unknown> = {
      hp_current: updatedStats.hp_current,
      hp_max: updatedStats.hp_max,
      strength: updatedStats.attack_power,
      agility: updatedStats.armor,
      armor: updatedStats.armor,
      attack_power: updatedStats.attack_power,
      luck: updatedStats.luck,
      charisma: updatedStats.charisma,
      combat_state: null,
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

    const { data: targetNode } = await admin
      .from("story_nodes")
      .select("*")
      .eq("id", choice.target_node_id)
      .single();
    if (!targetNode) {
      return fail("target_not_found", "Noeud cible introuvable", 404);
    }

    const arrivalMessages = await applyArrivalEffects(
      admin,
      user.id,
      story.id,
      targetNode,
      updatedStats as any,
    );
    if (arrivalMessages.length > 0) {
      effectsApplied.push(...arrivalMessages);
      await admin
        .from("character_stats")
        .update({
          hp_current: updatedStats.hp_current,
          hp_max: updatedStats.hp_max,
          strength: updatedStats.attack_power,
          agility: updatedStats.armor,
          armor: updatedStats.armor,
          attack_power: updatedStats.attack_power,
          luck: updatedStats.luck,
          charisma: updatedStats.charisma,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("story_id", story.id);
    }

    let finalNode = targetNode;
    if (updatedStats.hp_current <= 0) {
      const { data: deathNode } = await admin
        .from("story_nodes")
        .select("*")
        .eq("story_id", story.id)
        .eq("node_key", "mort_epuisement")
        .maybeSingle();
      if (deathNode) finalNode = deathNode;
      else {
        const { data: anyDeath } = await admin
          .from("story_nodes")
          .select("*")
          .eq("story_id", story.id)
          .eq("is_ending", true)
          .eq("ending_type", "death")
          .limit(1)
          .maybeSingle();
        if (anyDeath) finalNode = anyDeath;
      }
    }

    const isEnding = Boolean(finalNode.is_ending);
    const isVictory = finalNode.ending_type === "victory";
    const endingKey = finalNode.node_key ?? finalNode.id;

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
      current_node_id: finalNode.id,
      completion_pct: isEnding ? 100 : Math.max(50, progress?.id ? 50 : 10),
      endings_found: updatedEndings,
      last_played_at: new Date().toISOString(),
    };
    if (isEnding) {
      progressPatch.is_completed = true;
      progressPatch.completed_at = new Date().toISOString();
    } else if (progress?.is_completed) {
      progressPatch.is_completed = true;
    }

    if (progress) {
      await admin.from("user_story_progress").update(progressPatch).eq("id", progress.id);
    } else {
      await admin.from("user_story_progress").insert({
        user_id: user.id,
        story_id: story.id,
        current_node_id: finalNode.id,
        completion_pct: isEnding ? 100 : 10,
        endings_found: updatedEndings,
        is_completed: isEnding,
        completed_at: isEnding ? new Date().toISOString() : null,
        last_played_at: new Date().toISOString(),
      });
    }

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
      }
    }

    const achievementsUnlocked: string[] = [];
    if (isEnding) {
      const { data: achData } = await admin.rpc("claim_achievements", {
        p_user_id: user.id,
      });
      if (achData) {
        const unlocked = achData.unlocked ?? [];
        for (const a of unlocked) achievementsUnlocked.push(a.name);
        if (typeof achData.gems === "number") walletGems = achData.gems;
      }
    }

    const { data: nextChoices } = await admin
      .from("story_choices")
      .select("*, choice_effects(*)")
      .eq("node_id", finalNode.id)
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
      node: finalNode,
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
