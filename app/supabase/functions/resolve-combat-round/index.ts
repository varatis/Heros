// ============================================================
// HeroBook — Edge Function `resolve-combat-round` (v3 — fidèle & stateful)
// ------------------------------------------------------------
// Résolution serveur d'un assaut de combat Loup Solitaire.
//
// Corrige les deux bugs bloquants de l'audit « passe 3 » :
//
//  B1 — L'ENDURANCE des ennemis est désormais PERSISTÉE côté serveur
//       (`character_stats.combat_state`). Le client n'envoie plus jamais
//       l'ENDURANCE de l'ennemi : il ne peut donc plus la « rembobiner »
//       (bug) ni la falsifier (triche). Le serveur initialise l'état
//       depuis `story_nodes.metadata.combatants` au premier assaut.
//
//  B2 — Les pertes sont lues dans la VRAIE « Table des coups portés »
//       du livre (`_shared/combat-table.ts`), y compris le « T »
//       (tué sur le coup) et les pertes joueur nulles.
//
// Entrée : { story_id, current_node_id, escape? }
// Sortie : état complet du combat après l'assaut.
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
  combat_skill: number;
  endurance: number;
  // Règles spéciales portées par metadata.combatants
  player_skill_penalty?: number;       // §17 : gêné par les ailes (-1)
  psychic_assault?: boolean;           // Vordaks : -2 sans Bouclier
  psychic_assault_from_round?: number; // §283 : dès le 2e assaut
  surprise_bonus_round_1?: number;     // §283 : surprise +2 au 1er
  mindblast_immune?: boolean;          // §§133/170/255/342
  no_torch_penalty?: number;           // §170 : combat dans le noir
}

interface CombatState {
  node_key: string;
  node_id: string;
  enemies: Combatant[];       // `endurance` = END COURANTE
  enemy_index: number;
  round: number;              // nombre d'assauts déjà menés (tous ennemis)
  hp_at_start: number;        // END du joueur en entrant dans le combat
}

const MAX_ENEMY_SKILL = 60;

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
      current_node_id?: string;
      escape?: boolean;
    };
    try {
      body = await req.json();
    } catch {
      return fail("bad_request", "Corps JSON invalide", 400);
    }

    if (!body.story_id || !body.current_node_id) {
      return fail(
        "bad_request",
        "Paramètres story_id et current_node_id requis",
        400,
      );
    }

    // --------------------------------------------------------
    // 1. Histoire supportée
    // --------------------------------------------------------
    const { data: story } = await admin
      .from("stories")
      .select("slug, status")
      .eq("id", body.story_id)
      .single();

    if (
      !story || story.status !== "published" ||
      story.slug !== "les-maitres-des-tenebres"
    ) {
      return fail(
        "story_not_supported",
        "Moteur de combat réservé à Loup Solitaire",
        403,
      );
    }

    // --------------------------------------------------------
    // 2. Stats + nœud de combat
    // --------------------------------------------------------
    const { data: stats } = await admin
      .from("character_stats")
      .select("strength, hp_current, hp_max, narrative_flags, combat_state")
      .eq("user_id", user.id)
      .eq("story_id", body.story_id)
      .single();

    if (!stats) {
      return fail("stats_not_found", "Stats du personnage introuvables", 404);
    }
    if (stats.hp_current <= 0) {
      return fail("player_dead", "Vous êtes déjà mort", 422);
    }

    const { data: node } = await admin
      .from("story_nodes")
      .select("id, node_key, metadata")
      .eq("id", body.current_node_id)
      .eq("story_id", body.story_id)
      .maybeSingle();

    if (!node) {
      return fail("node_not_found", "Section de combat introuvable", 404);
    }

    const declaredEnemies =
      ((node.metadata as Record<string, unknown> | null)
        ?.combatants as Combatant[] | undefined) ?? [];

    if (declaredEnemies.length === 0) {
      return fail(
        "no_combat_here",
        "Cette section ne comporte aucun combat",
        422,
      );
    }

    // --------------------------------------------------------
    // 3. État de combat — SOURCE DE VÉRITÉ SERVEUR (B1)
    //    Initialisé depuis la section au premier assaut, puis
    //    conservé (END courante des ennemis) d'un round à l'autre.
    // --------------------------------------------------------
    let state = stats.combat_state as CombatState | null;

    const stateMatchesNode = state &&
      state.node_id === node.id &&
      Array.isArray(state.enemies) &&
      state.enemies.length === declaredEnemies.length;

    if (!stateMatchesNode) {
      state = {
        node_key: (node.node_key as string) ?? "",
        node_id: node.id as string,
        // copie profonde : on y décrémentera l'ENDURANCE
        enemies: declaredEnemies.map((e) => ({ ...e })),
        enemy_index: 0,
        round: 0,
        hp_at_start: stats.hp_current,
      };
    }
    const combat = state as CombatState;

    // Sécurité : bornes des valeurs venues des métadonnées
    for (const e of combat.enemies) {
      if (
        typeof e.combat_skill !== "number" || e.combat_skill < 0 ||
        e.combat_skill > MAX_ENEMY_SKILL || typeof e.endurance !== "number"
      ) {
        return fail(
          "invalid_combatant",
          "Données de combat invalides pour cette section",
          500,
        );
      }
    }

    // Ennemi courant : le premier encore debout
    while (
      combat.enemy_index < combat.enemies.length &&
      combat.enemies[combat.enemy_index].endurance <= 0
    ) {
      combat.enemy_index++;
    }
    if (combat.enemy_index >= combat.enemies.length) {
      // Tous déjà vaincus : on nettoie et on le signale
      await admin
        .from("character_stats")
        .update({ combat_state: null, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("story_id", body.story_id);
      return fail("combat_already_won", "Ce combat est déjà terminé", 422);
    }

    const enemy = combat.enemies[combat.enemy_index];
    const roundNumber = combat.round + 1;

    // --------------------------------------------------------
    // 4. Quotient d'Attaque (disciplines + règles spéciales)
    // --------------------------------------------------------
    const flags = (stats.narrative_flags ?? {}) as Record<string, unknown>;
    const hasPsychicPower = hasNarrativeFlag(flags, "puissance_psychique");
    const hasWeaponMastery = hasNarrativeFlag(flags, "maitrise_armes");
    const hasPsychicShield = hasNarrativeFlag(flags, "bouclier_psychique");

    let effectivePlayerSkill = stats.strength;
    const combatNotes: string[] = [];
    const mindblastBlocked = enemy.mindblast_immune === true;
    let psychicAssaultApplied = false;
    let noTorchApplied = false;

    if (hasPsychicPower && !mindblastBlocked) {
      effectivePlayerSkill += 2;
    }
    if (hasWeaponMastery) {
      effectivePlayerSkill += 2;
    }
    if (hasPsychicPower && mindblastBlocked) {
      combatNotes.push(
        `${enemy.name} est insensible à la Puissance Psychique (+0 HAB)`,
      );
    }

    // §17 : gêné par le battement des ailes
    if (enemy.player_skill_penalty) {
      effectivePlayerSkill -= enemy.player_skill_penalty;
      combatNotes.push(
        `Gêné par ${enemy.name} : -${enemy.player_skill_penalty} HAB`,
      );
    }

    // §283 : surprise au premier assaut
    if (roundNumber === 1 && enemy.surprise_bonus_round_1) {
      effectivePlayerSkill += enemy.surprise_bonus_round_1;
      combatNotes.push(
        `Surprise : +${enemy.surprise_bonus_round_1} HAB au 1er assaut`,
      );
    }

    // Vordaks : Puissance Psychique adverse
    if (enemy.psychic_assault && !hasPsychicShield) {
      const fromRound = enemy.psychic_assault_from_round ?? 1;
      if (roundNumber >= fromRound) {
        effectivePlayerSkill -= 2;
        psychicAssaultApplied = true;
        combatNotes.push(
          "Puissance Psychique adverse : -2 HAB (Bouclier Psychique requis pour l'annuler)",
        );
      }
    }

    // §170 : combat dans le noir sans Torche
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
          .gt("quantity", 0)
          .maybeSingle();
        hasTorch = Boolean(torchInv);
      }
      if (!hasTorch) {
        effectivePlayerSkill -= enemy.no_torch_penalty;
        noTorchApplied = true;
        combatNotes.push(
          `Combat dans le noir : -${enemy.no_torch_penalty} HAB (une Torche l'aurait évité)`,
        );
      }
    }

    const attackQuotient = effectivePlayerSkill - enemy.combat_skill;

    // --------------------------------------------------------
    // 5. Assaut : Table de Hasard + Table des coups portés (B2)
    // --------------------------------------------------------
    const hazardRoll = Math.floor(Math.random() * 10);
    const outcome = lookupCombatTable(attackQuotient, hazardRoll);

    // Règle de fuite du livre : « votre adversaire ne perdra alors
    // aucun point d'ENDURANCE ; seul vous, le Loup Solitaire, perdrez
    // le nombre de points indiqué par la Table des coups portés ».
    const escaping = body.escape === true;
    const enemyLoss = escaping ? 0 : outcome.enemyLoss;
    const playerLoss = outcome.playerLoss;

    const newPlayerEndurance = applyLoss(stats.hp_current, playerLoss);
    const newEnemyEndurance = applyLoss(enemy.endurance, enemyLoss);

    // Persistance de l'END de l'ennemi : LE correctif du bug B1
    enemy.endurance = newEnemyEndurance;
    combat.round = roundNumber;

    const playerDead = newPlayerEndurance <= 0;
    const enemyDead = newEnemyEndurance <= 0;

    // Passe à l'ennemi suivant s'il en reste
    let allEnemiesDefeated = false;
    if (enemyDead) {
      const nextIndex = combat.enemies.findIndex(
        (e, i) => i > combat.enemy_index && e.endurance > 0,
      );
      if (nextIndex === -1) {
        allEnemiesDefeated = true;
      } else {
        combat.enemy_index = nextIndex;
      }
    }

    const combatEnded = playerDead || allEnemiesDefeated || escaping;
    const winner: "player" | "enemy" | null = playerDead
      ? "enemy"
      : allEnemiesDefeated
      ? "player"
      : null;

    // --------------------------------------------------------
    // 6. Persistance des stats + de l'état de combat
    // --------------------------------------------------------
    const statsPatch: Record<string, unknown> = {
      hp_current: newPlayerEndurance,
      updated_at: new Date().toISOString(),
      combat_state: combatEnded ? null : combat,
    };

    // Flags de fin de combat (§227 sans blessure, §231/§339 rapides)
    const combatMeta = (node.metadata as Record<string, unknown> | null)
      ?.combat as Record<string, unknown> | undefined;
    const flagPatch: Record<string, boolean> = {};

    if (winner === "player") {
      const victoryRules = combatMeta?.victory_rules as
        | { flag_key?: string; max_rounds?: number }
        | undefined;
      if (victoryRules?.flag_key) {
        flagPatch[victoryRules.flag_key] =
          combat.round <= (victoryRules.max_rounds ?? 0);
      }
      const flawlessFlag = combatMeta?.flag_flawless as string | undefined;
      if (flawlessFlag) {
        // « sans perdre aucun point d'ENDURANCE » sur tout le combat
        flagPatch[flawlessFlag] = newPlayerEndurance >= combat.hp_at_start;
      }
    }

    const updatedFlags = { ...flags, ...flagPatch };
    if (Object.keys(flagPatch).length > 0) {
      statsPatch.narrative_flags = updatedFlags;
    }

    await admin
      .from("character_stats")
      .update(statsPatch)
      .eq("user_id", user.id)
      .eq("story_id", body.story_id);

    // --------------------------------------------------------
    // 7. Mort du joueur => fin de partie (règle du livre)
    // --------------------------------------------------------
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
          await admin
            .from("user_story_progress")
            .update(patch)
            .eq("id", progress.id);
        } else {
          await admin.from("user_story_progress").upsert(
            { user_id: user.id, story_id: body.story_id, ...patch },
            { onConflict: "user_id,story_id" },
          );
        }
      }
    }

    // --------------------------------------------------------
    // 8. Journal
    // --------------------------------------------------------
    await admin.from("choice_history").insert({
      user_id: user.id,
      story_id: body.story_id,
      node_id: null,
      choice_id: null,
      metadata: {
        type: "combat_round",
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
      // "K" est renvoyé tel quel pour l'affichage « Tué sur le coup »
      player_loss: playerLoss,
      enemy_loss: enemyLoss,
      instant_kill: enemyLoss === INSTANT_KILL || playerLoss === INSTANT_KILL,
      player_endurance: newPlayerEndurance,
      enemy_endurance: newEnemyEndurance,
      enemy_name: enemy.name,
      enemy_combat_skill: enemy.combat_skill,
      round: combat.round,
      combat_ended: combatEnded,
      winner,
      escaped: escaping,
      effective_player_skill: effectivePlayerSkill,
      bonuses_applied: {
        discipline: hasPsychicPower && !mindblastBlocked,
        weapon_mastery: hasWeaponMastery,
        mindblast_immune: mindblastBlocked,
        psychic_assault: psychicAssaultApplied,
        no_torch: noTorchApplied,
      },
      combat_notes: combatNotes,
      enemy_index: combat.enemy_index,
      total_enemies: combat.enemies.length,
      // état complet des ennemis pour l'affichage (END courante)
      enemies: combat.enemies.map((e) => ({
        name: e.name,
        combat_skill: e.combat_skill,
        endurance: e.endurance,
      })),
      is_last_enemy: combat.enemies.every(
        (e, i) => i <= combat.enemy_index || e.endurance <= 0,
      ),
      narrative_flags: updatedFlags,
      player_died: playerDead,
      death_node: deathNode,
    });
  } catch (err) {
    console.error("resolve-combat-round error:", err);
    return fail("internal", "Erreur interne du moteur de combat", 500);
  }
});
