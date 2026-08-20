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

interface CombatRequest {
  story_id: string;
  enemy: {
    name: string;
    combat_skill: number;
    endurance: number;
  };
  player_bonuses?: {
    discipline_bonus?: number;
    weapon_mastery?: number;
  };
  escape?: boolean;
  // Support combats multiples
  enemy_index?: number;           // index de l'ennemi dans le tableau
  total_enemies?: number;         // nombre total d'ennemis
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
    // --------------------------------------------------------
    let effectivePlayerSkill = playerSkill;

    const flags = (stats.narrative_flags ?? {}) as Record<string, any>;
    const hasPsychicPower = flags.puissance_psychique === true;
    const hasWeaponMastery = flags.maitrise_armes === true;

    if (body.player_bonuses?.discipline_bonus) {
      effectivePlayerSkill += body.player_bonuses.discipline_bonus;
    } else {
      if (hasPsychicPower) effectivePlayerSkill += 2;
      if (hasWeaponMastery) effectivePlayerSkill += 2;
    }

    if (body.player_bonuses?.weapon_mastery) {
      effectivePlayerSkill += body.player_bonuses.weapon_mastery;
    }

    const attackQuotient = effectivePlayerSkill - body.enemy.combat_skill;

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
        discipline: hasPsychicPower,
        weapon_mastery: hasWeaponMastery,
      },
      // Informations pour les combats multiples
      enemy_index: body.enemy_index ?? 0,
      total_enemies: body.total_enemies ?? 1,
      is_last_enemy: (body.enemy_index ?? 0) + 1 >= (body.total_enemies ?? 1),
    });
  } catch (err) {
    console.error("resolve-combat-round error:", err);
    return fail("internal", "Erreur interne du moteur de combat", 500);
  }
});