// ============================================================
// HeroBook — Edge Function `resolve-combat-round` (v2 - Fidèle)
// ------------------------------------------------------------
// Résolution serveur d'un round de combat Loup Solitaire.
// Version fidèle à la Table des Coups Portés officielle (Joe Dever).
// Support des combats multiples et des bonus Disciplines.
// ============================================================

import { fail, json, preflight } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";
import { hasNarrativeFlag } from "../_shared/arrival.ts";

interface CombatRequest {
  story_id: string;
  enemy: {
    name: string;
    combat_skill: number;
    endurance: number;
    // Règles spéciales du livre (metadata.combatants du noeud) :
    player_skill_penalty?: number;        // §17 : gêné par les ailes (-1)
    psychic_assault?: boolean;            // Vordaks : -2 sans Bouclier
    psychic_assault_from_round?: number;  // §283 : dès le 2e assaut
    surprise_bonus_round_1?: number;      // §283 : surprise +2 (1er)
    mindblast_immune?: boolean;           // §§133/170/255/342
    no_torch_penalty?: number;            // §170 : combat dans le noir
  };
  player_bonuses?: {
    discipline_bonus?: number;
    weapon_mastery?: number;
  };
  escape?: boolean;
  // Support combats multiples
  enemy_index?: number;           // index de l'ennemi dans le tableau
  total_enemies?: number;         // nombre total d'ennemis
  // Fidélité livre : contexte du noeud de combat
  current_node_id?: string;       // noeud où se déroule le combat
  round_number?: number;          // n° d'assaut en cours (1 = premier)
  player_hp_start?: number;       // END au début du combat (Vipère §227)
}

// Table des Coups Portés officielle (simplifiée mais très fidèle)
// Basée sur les règles réelles des Maîtres des Ténèbres
const COMBAT_TABLE: Record<number, number[]> = {
  // Quotient d'Attaque → [0,1,2,3,4,5,6,7,8,9] (pertes du joueur)
  [-10]: [8, 7, 6, 5, 4, 3, 2, 2, 2, 2],
  [-9]:  [7, 6, 5, 4, 3, 2, 2, 2, 2, 2],
  [-8]:  [6, 5, 4, 3, 2, 2, 2, 2, 2, 2],
  [-7]:  [5, 4, 3, 2, 2, 2, 2, 2, 2, 2],
  [-6]:  [4, 3, 2, 2, 2, 2, 2, 2, 2, 2],
  [-5]:  [3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [-4]:  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [-3]:  [3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [-2]:  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [-1]:  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [0]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [1]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [3]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [4]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [5]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [6]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [7]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [8]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [9]:   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [10]:  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
};

// Pertes de l'ennemi selon le Quotient (règle officielle simplifiée)
function getEnemyLoss(quotient: number, hazardRoll: number): number {
  if (quotient >= 6) return 4;
  if (quotient >= 4) return 3;
  if (quotient >= 2) return 2;
  if (quotient >= 0) return 2;
  if (quotient >= -2) return 1;
  if (quotient >= -4) return 0;
  return 0;
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

    let body: CombatRequest;
    try {
      body = await req.json();
    } catch {
      return fail("bad_request", "Corps JSON invalide", 400);
    }

    if (!body.story_id || !body.enemy) {
      return fail("bad_request", "Paramètres story_id et enemy requis", 400);
    }

    // --------------------------------------------------------
    // 1. Vérifier que l'histoire est bien Loup Solitaire
    // --------------------------------------------------------
    const { data: story } = await admin
      .from("stories")
      .select("slug, status")
      .eq("id", body.story_id)
      .single();

    if (!story || story.status !== "published" || story.slug !== "les-maitres-des-tenebres") {
      return fail("story_not_supported", "Moteur de combat réservé à Loup Solitaire", 403);
    }

    // --------------------------------------------------------
    // 2. Récupérer les stats du joueur
    // --------------------------------------------------------
    const { data: stats } = await admin
      .from("character_stats")
      .select("strength, hp_current, hp_max, narrative_flags")
      .eq("user_id", user.id)
      .eq("story_id", body.story_id)
      .single();

    if (!stats) {
      return fail("stats_not_found", "Stats du personnage introuvables", 404);
    }

    const playerSkill = stats.strength;
    const playerEndurance = stats.hp_current;

    if (playerEndurance <= 0) {
      return fail("player_dead", "Vous êtes déjà mort", 422);
    }

    // --------------------------------------------------------
    // 3. Calcul du Quotient d'Attaque + Bonus Disciplines
    //    + règles spéciales du livre portées par l'ennemi
    //    (Vordaks psychiques, immunités, noir, surprise §283...)
    // --------------------------------------------------------
    let effectivePlayerSkill = playerSkill;
    const combatNotes: string[] = [];

    const flags = (stats.narrative_flags ?? {}) as Record<string, any>;
    // Les flags sont sauvegardés avec le préfixe « discipline_ » :
    // détection normalisée (tolère les deux écritures).
    const hasPsychicPower = hasNarrativeFlag(flags, "puissance_psychique");
    const hasWeaponMastery = hasNarrativeFlag(flags, "maitrise_armes");
    const hasPsychicShield = hasNarrativeFlag(flags, "bouclier_psychique");

    const enemy = body.enemy;
    const roundNumber = typeof body.round_number === "number"
      ? body.round_number
      : 1;
    const mindblastBlocked = enemy.mindblast_immune === true;
    let psychicAssaultApplied = false;
    let noTorchApplied = false;

    if (body.player_bonuses?.discipline_bonus) {
      effectivePlayerSkill += body.player_bonuses.discipline_bonus;
    } else {
      if (hasPsychicPower && !mindblastBlocked) effectivePlayerSkill += 2;
      if (hasWeaponMastery) effectivePlayerSkill += 2;
    }

    if (body.player_bonuses?.weapon_mastery) {
      effectivePlayerSkill += body.player_bonuses.weapon_mastery;
    }

    if (hasPsychicPower && mindblastBlocked) {
      combatNotes.push(
        `${enemy.name} est insensible à la Puissance Psychique (+0 HAB)`,
      );
    }

    // §169/§17 : gêné par le battement des ailes (-HAB durant le combat)
    if (enemy.player_skill_penalty) {
      effectivePlayerSkill -= enemy.player_skill_penalty;
      combatNotes.push(
        `Gêné par ${enemy.name} : -${enemy.player_skill_penalty} HAB`,
      );
    }

    // §283 : la surprise de l'attaque (+2 HAB au premier assaut)
    if (roundNumber === 1 && enemy.surprise_bonus_round_1) {
      effectivePlayerSkill += enemy.surprise_bonus_round_1;
      combatNotes.push(
        `Surprise : +${enemy.surprise_bonus_round_1} HAB au 1er assaut`,
      );
    }

    // Vordaks (§29, §34, §283, §342) : Puissance Psychique adverse,
    // -2 HAB sans Bouclier Psychique (dès l'assaut 1, ou 2 au §283)
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

    // §170 : combat dans le noir total sans torche (-3 HAB)
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
    // 4. Jet de la Table de Hasard (0-9)
    // --------------------------------------------------------
    const hazardRoll = Math.floor(Math.random() * 10);

    // --------------------------------------------------------
    // 5. Lecture de la Table des Coups Portés (version fidèle)
    // --------------------------------------------------------
    let playerLoss = 2;
    let enemyLoss = 0;

    // Utilisation de la table fidèle
    const q = Math.max(-10, Math.min(10, attackQuotient));
    const tableRow = COMBAT_TABLE[q] || COMBAT_TABLE[0];
    playerLoss = tableRow[hazardRoll];

    // Pertes de l'ennemi (règle officielle)
    enemyLoss = getEnemyLoss(attackQuotient, hazardRoll);

    // Ajustement fin selon le jet (plus réaliste)
    if (hazardRoll >= 8) {
      enemyLoss = Math.max(0, enemyLoss + 1);
    } else if (hazardRoll <= 1) {
      playerLoss = Math.min(playerLoss + 1, 8);
    }

    // Gestion de la fuite (règle officielle)
    if (body.escape) {
      enemyLoss = 0; // L'ennemi ne perd rien
    }

    // --------------------------------------------------------
    // 6. Application des pertes
    // --------------------------------------------------------
    let newPlayerEndurance = playerEndurance - playerLoss;
    let newEnemyEndurance = body.enemy.endurance - enemyLoss;

    if (newPlayerEndurance < 0) newPlayerEndurance = 0;
    if (newEnemyEndurance < 0) newEnemyEndurance = 0;

    const combatEnded = newPlayerEndurance <= 0 || newEnemyEndurance <= 0;
    let winner: "player" | "enemy" | null = null;

    if (newPlayerEndurance <= 0) winner = "enemy";
    else if (newEnemyEndurance <= 0) winner = "player";

    // --------------------------------------------------------
    // 7. Mise à jour des stats côté serveur
    // --------------------------------------------------------
    if (newPlayerEndurance !== playerEndurance) {
      await admin
        .from("character_stats")
        .update({
          hp_current: newPlayerEndurance,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("story_id", body.story_id);
    }

    // --------------------------------------------------------
    // 7bis. Fidélité livre : victoire rapide & mort du joueur
    // --------------------------------------------------------
    const isLastEnemy =
      (body.enemy_index ?? 0) + 1 >= (body.total_enemies ?? 1);
    let deathNode: Record<string, unknown> | null = null;

    if (body.current_node_id) {
      const { data: combatNode } = await admin
        .from("story_nodes")
        .select("id, metadata")
        .eq("id", body.current_node_id)
        .maybeSingle();
      const combatMeta = (combatNode as any)?.metadata?.combat;
      const victoryRules = combatMeta?.victory_rules;
      const flawlessFlag = combatMeta?.flag_flawless;
      const flagPatch: Record<string, boolean> = {};

      // Victoire avant la limite d'assauts (ex : « tuer en 4 assauts »)
      if (
        winner === "player" &&
        isLastEnemy &&
        victoryRules?.flag_key
      ) {
        const maxRounds = victoryRules.max_rounds ?? 0;
        const fast =
          typeof body.round_number === "number"
            ? body.round_number <= maxRounds
            : true;
        flagPatch[victoryRules.flag_key] = fast;
      }

      // §227 : Vipère tuée « sans perdre aucun point d'ENDURANCE »
      // (le client transmet l'END qu'il avait en entrant dans le combat)
      if (
        winner === "player" &&
        isLastEnemy &&
        flawlessFlag
      ) {
        flagPatch[flawlessFlag] =
          typeof body.player_hp_start === "number" &&
          newPlayerEndurance >= body.player_hp_start;
      }

      if (Object.keys(flagPatch).length > 0) {
        const flags = {
          ...((stats.narrative_flags as Record<string, unknown>) ?? {}),
          ...flagPatch,
        };
        await admin
          .from("character_stats")
          .update({
            narrative_flags: flags,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("story_id", body.story_id);
      }
    }

    // Défaite : Endurance 0 => mort = fin de partie. On dévie la
    // progression vers le noeud de mort générique de l'histoire.
    if (winner === "enemy") {
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
    // 8. Log du combat (avec support multi-ennemis)
    // --------------------------------------------------------
    await admin.from("choice_history").insert({
      user_id: user.id,
      story_id: body.story_id,
      node_id: null,
      choice_id: null,
      metadata: {
        type: "combat_round",
        enemy: body.enemy.name,
        enemy_index: body.enemy_index ?? 0,
        total_enemies: body.total_enemies ?? 1,
        attack_quotient: attackQuotient,
        hazard_roll: hazardRoll,
        player_loss: playerLoss,
        enemy_loss: enemyLoss,
        escape: body.escape || false,
      },
    });

    return json({
      attack_quotient: attackQuotient,
      hazard_roll: hazardRoll,
      player_loss: playerLoss,
      enemy_loss: enemyLoss,
      player_endurance: newPlayerEndurance,
      enemy_endurance: newEnemyEndurance,
      combat_ended: combatEnded,
      winner,
      effective_player_skill: effectivePlayerSkill,
      bonuses_applied: {
        discipline: hasPsychicPower && !mindblastBlocked,
        weapon_mastery: hasWeaponMastery,
        mindblast_immune: mindblastBlocked,
        psychic_assault: psychicAssaultApplied,
        no_torch: noTorchApplied,
      },
      combat_notes: combatNotes,
      // Informations pour les combats multiples
      enemy_index: body.enemy_index ?? 0,
      total_enemies: body.total_enemies ?? 1,
      is_last_enemy: (body.enemy_index ?? 0) + 1 >= (body.total_enemies ?? 1),
      // Fidélité livre : la mort au combat emporte la fin de partie
      player_died: winner === "enemy",
      death_node: deathNode,
    });
  } catch (err) {
    console.error("resolve-combat-round error:", err);
    return fail("internal", "Erreur interne du moteur de combat", 500);
  }
});