// ============================================================
// HeroBook — Edge Function `resolve-combat-round` — v4
// Vie / Armure / Attaque générique + Loup Solitaire legacy
// ------------------------------------------------------------
// Deux modes :
//  - les-maitres-des-tenebres : Table des coups portés (legacy)
//  - autres histoires : système générique Vie/Armure/Attaque
//    Sacoche par aventure (story_id) déjà gérée par arrival.ts
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";
import { hasNarrativeFlag } from "../_shared/arrival.ts";
import {
  applyLoss,
  INSTANT_KILL,
  resolveCombatRound as lookupCombatTable,
} from "../_shared/combat-table.ts";

interface Combatant {
  name: string;
  combat_skill: number; // Attaque (legacy HAB)
  endurance: number; // Vie
  armor?: number; // Armure générique
  attack?: number; // Attaque générique (fallback combat_skill)
  // Loup Solitaire specials
  player_skill_penalty?: number;
  psychic_assault?: boolean;
  psychic_assault_from_round?: number;
  surprise_bonus_round_1?: number;
  mindblast_immune?: boolean;
  no_torch_penalty?: number;
}

interface CombatState {
  node_key: string;
  node_id: string;
  enemies: Combatant[];
  enemy_index: number;
  round: number;
  hp_at_start: number;
}

const MAX_ENEMY_SKILL = 80;

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  try {
    const admin = createAdminClient();
    const user = await getUser(req, admin);
    if (!user) return fail("unauthorized", "Authentification requise", 401);

    let body: { story_id?: string; current_node_id?: string; escape?: boolean };
    try {
      body = await req.json();
    } catch {
      return fail("bad_request", "Corps JSON invalide", 400);
    }
    if (!body.story_id || !body.current_node_id) {
      return fail("bad_request", "story_id et current_node_id requis", 400);
    }

    const { data: story } = await admin
      .from("stories")
      .select("slug, status, genre")
      .eq("id", body.story_id)
      .single();

    if (!story || story.status !== "published") {
      return fail("story_not_supported", "Histoire non publiée", 403);
    }

    const isLoneWolf = story.slug === "les-maitres-des-tenebres";

    const { data: stats } = await admin
      .from("character_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("story_id", body.story_id)
      .single();

    if (!stats) return fail("stats_not_found", "Stats introuvables", 404);
    if (stats.hp_current <= 0) return fail("player_dead", "Vous êtes déjà mort", 422);

    const { data: node } = await admin
      .from("story_nodes")
      .select("id, node_key, metadata")
      .eq("id", body.current_node_id)
      .eq("story_id", body.story_id)
      .maybeSingle();

    if (!node) return fail("node_not_found", "Section introuvable", 404);

    const declaredEnemies =
      ((node.metadata as Record<string, unknown> | null)?.combatants as
        | Combatant[]
        | undefined) ?? [];

    if (declaredEnemies.length === 0) {
      return fail("no_combat_here", "Pas de combat ici", 422);
    }

    // État de combat serveur
    let state = (stats as any).combat_state as CombatState | null;
    const stateMatchesNode =
      state &&
      state.node_id === node.id &&
      Array.isArray(state.enemies) &&
      state.enemies.length === declaredEnemies.length;

    if (!stateMatchesNode) {
      state = {
        node_key: (node.node_key as string) ?? "",
        node_id: node.id as string,
        enemies: declaredEnemies.map((e) => ({ ...e })),
        enemy_index: 0,
        round: 0,
        hp_at_start: stats.hp_current,
      };
    }
    const combat = state as CombatState;

    for (const e of combat.enemies) {
      if (
        typeof e.combat_skill !== "number" ||
        e.combat_skill < 0 ||
        e.combat_skill > MAX_ENEMY_SKILL ||
        typeof e.endurance !== "number"
      ) {
        // Pour le système générique, combat_skill peut être remplacé par attack
        if (
          !isLoneWolf &&
          typeof (e as any).attack === "number" &&
          typeof e.endurance === "number"
        ) {
          continue;
        }
        return fail("invalid_combatant", "Données de combat invalides", 500);
      }
    }

    while (
      combat.enemy_index < combat.enemies.length &&
      combat.enemies[combat.enemy_index].endurance <= 0
    ) {
      combat.enemy_index++;
    }
    if (combat.enemy_index >= combat.enemies.length) {
      await admin
        .from("character_stats")
        .update({ combat_state: null, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("story_id", body.story_id);
      return fail("combat_already_won", "Combat déjà terminé", 422);
    }

    const enemy = combat.enemies[combat.enemy_index];
    const roundNumber = combat.round + 1;
    const hazardRoll = Math.floor(Math.random() * 10);

    let attackQuotient = 0;
    let playerLoss: number | typeof INSTANT_KILL = 0;
    let enemyLoss: number | typeof INSTANT_KILL = 0;
    let effectivePlayerSkill = 0;
    let effectiveEnemySkill = 0;
    const combatNotes: string[] = [];
    let psychicAssaultApplied = false;
    let noTorchApplied = false;
    let mindblastBlocked = false;

    if (isLoneWolf) {
      // === Mode Loup Solitaire (Table officielle) ===
      const flags = (stats.narrative_flags ?? {}) as Record<string, unknown>;
      const hasPsychicPower = hasNarrativeFlag(flags, "puissance_psychique");
      const hasWeaponMastery = hasNarrativeFlag(flags, "maitrise_armes");
      const hasPsychicShield = hasNarrativeFlag(flags, "bouclier_psychique");

      effectivePlayerSkill = stats.strength;
      mindblastBlocked = enemy.mindblast_immune === true;

      if (hasPsychicPower && !mindblastBlocked) effectivePlayerSkill += 2;
      if (hasWeaponMastery) effectivePlayerSkill += 2;
      if (hasPsychicPower && mindblastBlocked) {
        combatNotes.push(`${enemy.name} est insensible à la Puissance Psychique (+0 HAB)`);
      }
      if (enemy.player_skill_penalty) {
        effectivePlayerSkill -= enemy.player_skill_penalty;
        combatNotes.push(`Gêné par ${enemy.name} : -${enemy.player_skill_penalty} HAB`);
      }
      if (roundNumber === 1 && enemy.surprise_bonus_round_1) {
        effectivePlayerSkill += enemy.surprise_bonus_round_1;
        combatNotes.push(`Surprise : +${enemy.surprise_bonus_round_1} HAB au 1er assaut`);
      }
      if (enemy.psychic_assault && !hasPsychicShield) {
        const fromRound = enemy.psychic_assault_from_round ?? 1;
        if (roundNumber >= fromRound) {
          effectivePlayerSkill -= 2;
          psychicAssaultApplied = true;
          combatNotes.push("Puissance Psychique adverse : -2 HAB");
        }
      }
      if (enemy.no_torch_penalty) {
        const { data: torchItem } = await admin
          .from("items")
          .select("id")
          .eq("slug", "torches")
          .eq("story_id", body.story_id)
          .maybeSingle();
        let hasTorch = false;
        if (torchItem) {
          const { data: torchInv } = await admin
            .from("user_inventory")
            .select("quantity")
            .eq("user_id", user.id)
            .eq("item_id", torchItem.id)
            .eq("story_id", body.story_id)
            .gt("quantity", 0)
            .maybeSingle();
          hasTorch = Boolean(torchInv);
        }
        if (!hasTorch) {
          effectivePlayerSkill -= enemy.no_torch_penalty;
          noTorchApplied = true;
          combatNotes.push(`Combat dans le noir : -${enemy.no_torch_penalty} HAB`);
        }
      }

      attackQuotient = effectivePlayerSkill - enemy.combat_skill;
      const outcome = lookupCombatTable(attackQuotient, hazardRoll);
      const escaping = body.escape === true;
      enemyLoss = escaping ? 0 : outcome.enemyLoss;
      playerLoss = outcome.playerLoss;
    } else {
      // === Mode générique Vie / Armure / Attaque ===
      const playerAttack = (stats as any).attack_power ?? stats.strength ?? 5;
      const playerArmor = (stats as any).armor ?? stats.agility ?? 0;
      const enemyAttack = (enemy as any).attack ?? enemy.combat_skill ?? 5;
      const enemyArmor = enemy.armor ?? 0;

      effectivePlayerSkill = playerAttack;
      effectiveEnemySkill = enemyAttack;

      // Jet de hasard : 0-9 → variance
      const variancePlayer = hazardRoll % 3; // 0-2 bonus dégât joueur
      const varianceEnemy = (hazardRoll % 2); // 0-1 bonus dégât ennemi

      // Formule générique : Attaque - Armure adverse + variance
      // Minimum 1 dégât infligé par le joueur si attaque réussie, 0 pour l'ennemi si armure élevée
      const basePlayerDamage = Math.max(1, playerAttack - enemyArmor + variancePlayer);
      const baseEnemyDamage = Math.max(0, enemyAttack - playerArmor + varianceEnemy);

      // Critique sur 9 ou 0 (10% chance)
      const isCritical = hazardRoll === 9 || hazardRoll === 0;
      enemyLoss = isCritical ? basePlayerDamage + 2 : basePlayerDamage;
      playerLoss = isCritical && baseEnemyDamage > 0 ? baseEnemyDamage + 1 : baseEnemyDamage;

      if (isCritical) {
        combatNotes.push(
          hazardRoll === 9
            ? "Coup critique ! Dégâts augmentés."
            : "Frappe dévastatrice !",
        );
      }

      attackQuotient = playerAttack - enemyAttack;

      // Fuite : ennemi ne perd rien, joueur prend dégât
      if (body.escape) {
        enemyLoss = 0;
        combatNotes.push("Vous tentez de fuir...");
      }
    }

    const newPlayerEndurance = applyLoss(stats.hp_current, playerLoss as any);
    const newEnemyEndurance = applyLoss(enemy.endurance, enemyLoss as any);

    enemy.endurance = newEnemyEndurance;
    combat.round = roundNumber;

    const playerDead = newPlayerEndurance <= 0;
    const enemyDead = newEnemyEndurance <= 0;

    let allEnemiesDefeated = false;
    if (enemyDead) {
      const nextIndex = combat.enemies.findIndex(
        (e, i) => i > combat.enemy_index && e.endurance > 0,
      );
      if (nextIndex === -1) allEnemiesDefeated = true;
      else combat.enemy_index = nextIndex;
    }

    const escaping = body.escape === true;
    const combatEnded = playerDead || allEnemiesDefeated || escaping;
    const winner: "player" | "enemy" | null = playerDead
      ? "enemy"
      : allEnemiesDefeated
        ? "player"
        : null;

    const flags = (stats.narrative_flags ?? {}) as Record<string, unknown>;
    const flagPatch: Record<string, boolean> = {};
    const combatMeta = (node.metadata as Record<string, unknown> | null)
      ?.combat as Record<string, unknown> | undefined;

    if (winner === "player" && isLoneWolf) {
      const victoryRules = combatMeta?.victory_rules as
        | { flag_key?: string; max_rounds?: number }
        | undefined;
      if (victoryRules?.flag_key) {
        flagPatch[victoryRules.flag_key] =
          combat.round <= (victoryRules.max_rounds ?? 0);
      }
      const flawlessFlag = combatMeta?.flag_flawless as string | undefined;
      if (flawlessFlag) {
        flagPatch[flawlessFlag] = newPlayerEndurance >= combat.hp_at_start;
      }
    }

    const updatedFlags = { ...flags, ...flagPatch };

    await admin
      .from("character_stats")
      .update({
        hp_current: newPlayerEndurance,
        combat_state: combatEnded ? null : combat,
        ...(Object.keys(flagPatch).length > 0
          ? { narrative_flags: updatedFlags }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("story_id", body.story_id);

    let deathNode: Record<string, unknown> | null = null;
    if (playerDead) {
      const { data: dn } = await admin
        .from("story_nodes")
        .select("*")
        .eq("story_id", body.story_id)
        .eq("node_key", "mort_epuisement")
        .maybeSingle();
      if (dn) {
        deathNode = dn;
        const { data: progress } = await admin
          .from("user_story_progress")
          .select("id, endings_found")
          .eq("user_id", user.id)
          .eq("story_id", body.story_id)
          .maybeSingle();
        const oldEndings: string[] = progress?.endings_found ?? [];
        const endingKey = (dn.node_key as string) ?? (dn.id as string);
        const endings = oldEndings.includes(endingKey)
          ? oldEndings
          : [...oldEndings, endingKey];
        const patch: Record<string, unknown> = {
          current_node_id: dn.id,
          endings_found: endings,
          is_completed: true,
          completed_at: new Date().toISOString(),
          completion_pct: 100,
          last_played_at: new Date().toISOString(),
        };
        if (progress) {
          await admin.from("user_story_progress").update(patch).eq("id", progress.id);
        } else {
          await admin.from("user_story_progress").upsert(
            { user_id: user.id, story_id: body.story_id, ...patch },
            { onConflict: "user_id,story_id" },
          );
        }
      } else {
        // Fallback générique : première fin de mort
        const { data: anyDeath } = await admin
          .from("story_nodes")
          .select("*")
          .eq("story_id", body.story_id)
          .eq("is_ending", true)
          .eq("ending_type", "death")
          .limit(1)
          .maybeSingle();
        if (anyDeath) {
          deathNode = anyDeath;
          await admin.from("user_story_progress").upsert(
            {
              user_id: user.id,
              story_id: body.story_id,
              current_node_id: anyDeath.id,
              is_completed: true,
              completed_at: new Date().toISOString(),
              completion_pct: 100,
              last_played_at: new Date().toISOString(),
            },
            { onConflict: "user_id,story_id" },
          );
        }
      }
    }

    await admin.from("choice_history").insert({
      user_id: user.id,
      story_id: body.story_id,
      node_id: node.id,
      choice_id: null,
      metadata: {
        type: "combat_round",
        system: isLoneWolf ? "lone_wolf" : "vie_armure_attaque",
        enemy: enemy.name,
        enemy_index: combat.enemy_index,
        total_enemies: combat.enemies.length,
        attack_quotient: attackQuotient,
        hazard_roll: hazardRoll,
        player_loss: playerLoss,
        enemy_loss: enemyLoss,
        round: combat.round,
        escape: escaping,
      },
    });

    return json({
      attack_quotient: attackQuotient,
      hazard_roll: hazardRoll,
      player_loss: playerLoss,
      enemy_loss: enemyLoss,
      instant_kill: enemyLoss === INSTANT_KILL || playerLoss === INSTANT_KILL,
      player_endurance: newPlayerEndurance,
      enemy_endurance: newEnemyEndurance,
      enemy_name: enemy.name,
      enemy_combat_skill: enemy.combat_skill,
      enemy_armor: (enemy as any).armor ?? 0,
      round: combat.round,
      combat_ended: combatEnded,
      winner,
      escaped: escaping,
      effective_player_skill: effectivePlayerSkill,
      effective_enemy_skill: effectiveEnemySkill,
      bonuses_applied: isLoneWolf
        ? {
            discipline: hasNarrativeFlag(
              (stats.narrative_flags ?? {}) as Record<string, unknown>,
              "puissance_psychique",
            ) && !mindblastBlocked,
            weapon_mastery: hasNarrativeFlag(
              (stats.narrative_flags ?? {}) as Record<string, unknown>,
              "maitrise_armes",
            ),
            mindblast_immune: mindblastBlocked,
            psychic_assault: psychicAssaultApplied,
            no_torch: noTorchApplied,
          }
        : {
            armor: (stats as any).armor ?? 0,
            attack: (stats as any).attack_power ?? 0,
          },
      combat_notes: combatNotes,
      enemy_index: combat.enemy_index,
      total_enemies: combat.enemies.length,
      enemies: combat.enemies.map((e) => ({
        name: e.name,
        combat_skill: e.combat_skill,
        endurance: e.endurance,
        armor: (e as any).armor ?? 0,
        attack: (e as any).attack ?? e.combat_skill,
      })),
      is_last_enemy: combat.enemies.every(
        (e, i) => i <= combat.enemy_index || e.endurance <= 0,
      ),
      narrative_flags: updatedFlags,
      player_died: playerDead,
      death_node: deathNode,
      combat_system: isLoneWolf ? "lone_wolf" : "vie_armure_attaque",
    });
  } catch (err) {
    console.error("resolve-combat-round error:", err);
    return fail("internal", "Erreur interne du moteur de combat", 500);
  }
});
