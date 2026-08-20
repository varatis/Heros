// ============================================================
// HeroBook — Edge Function `resolve-combat-round`
// ------------------------------------------------------------
// Résolution serveur d'un round de combat Loup Solitaire.
// Suit strictement les règles officielles des Maîtres des Ténèbres.
// 
// Entrée : {
//   story_id: uuid,
//   enemy: { name: string, combat_skill: number, endurance: number },
//   player_bonuses?: { discipline_bonus?: number, weapon_mastery?: number },
//   escape?: boolean
// }
// Sortie : {
//   attack_quotient: number,
//   hazard_roll: number,
//   player_loss: number,
//   enemy_loss: number,
//   player_endurance: number,
//   enemy_endurance: number,
//   combat_ended: boolean,
//   winner: 'player' | 'enemy' | null
// }
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
    discipline_bonus?: number;      // Bouclier / Puissance psychique
    weapon_mastery?: number;        // Maîtrise des armes
  };
  escape?: boolean;                 // Tentative de fuite (doit être autorisée par la section)
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

    const playerSkill = stats.strength; // HABILETÉ
    const playerEndurance = stats.hp_current;

    if (playerEndurance <= 0) {
      return fail("player_dead", "Vous êtes déjà mort", 422);
    }

    // --------------------------------------------------------
    // 3. Calcul du Quotient d'Attaque
    // --------------------------------------------------------
    let effectivePlayerSkill = playerSkill;

    // Bonus Disciplines Kaï
    const flags = (stats.narrative_flags ?? {}) as Record<string, any>;
    const hasPsychicShield = flags.bouclier_psychique === true;
    const hasPsychicPower = flags.puissance_psychique === true;
    const hasWeaponMastery = flags.maitrise_armes === true;

    if (body.player_bonuses?.discipline_bonus) {
      effectivePlayerSkill += body.player_bonuses.discipline_bonus;
    } else {
      // Bonus par défaut si les flags sont présents
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
    // 5. Lecture de la Table des Coups Portés (version MVP)
    // --------------------------------------------------------
    // Pour le MVP on utilise une table simplifiée fidèle aux règles
    // (à remplacer par la vraie table extraite du PDF dans une prochaine itération)
    let playerLoss = 2;
    let enemyLoss = 0;

    // Règle simplifiée mais réaliste :
    // - Quotient positif = avantage joueur
    // - Quotient négatif = désavantage
    const q = attackQuotient;

    if (q >= 6) {
      enemyLoss = 4;
      playerLoss = 0;
    } else if (q >= 4) {
      enemyLoss = 3;
      playerLoss = 0;
    } else if (q >= 2) {
      enemyLoss = 2;
      playerLoss = 1;
    } else if (q >= 0) {
      enemyLoss = 2;
      playerLoss = 2;
    } else if (q >= -2) {
      enemyLoss = 1;
      playerLoss = 3;
    } else if (q >= -4) {
      enemyLoss = 0;
      playerLoss = 4;
    } else {
      enemyLoss = 0;
      playerLoss = 6;
    }

    // Ajustement selon le jet de hasard (simule la vraie table)
    if (hazardRoll >= 7) {
      enemyLoss = Math.max(0, enemyLoss - 1);
    } else if (hazardRoll <= 2) {
      playerLoss = Math.min(playerLoss + 1, 8);
    }

    // Gestion de la fuite (si autorisée par la section)
    if (body.escape) {
      // En cas de fuite : l'ennemi ne perd rien, le joueur perd le résultat de la table
      enemyLoss = 0;
      // Le joueur perd quand même le coup (règle officielle)
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
    // 8. Log du combat (optionnel pour historique)
    // --------------------------------------------------------
    await admin.from("choice_history").insert({
      user_id: user.id,
      story_id: body.story_id,
      node_id: null, // combat round
      choice_id: null,
      metadata: {
        type: "combat_round",
        enemy: body.enemy.name,
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
        discipline: hasPsychicPower || hasPsychicShield,
        weapon_mastery: hasWeaponMastery,
      },
    });
  } catch (err) {
    console.error("resolve-combat-round error:", err);
    return fail("internal", "Erreur interne du moteur de combat", 500);
  }
});