export interface CharacterBaseStats {
  hp_current: number;
  hp_max: number;
  strength: number;
  agility: number;
  luck: number;
  charisma: number;
}

/**
 * Calcule les bonus cumulés conférés par les équipements et reliques de l'inventaire
 */
export function calculateInventoryBonuses(
  inventory: any[]
): Record<string, number> {
  const bonuses: Record<string, number> = {
    hp_max: 0,
    strength: 0,
    agility: 0,
    luck: 0,
    charisma: 0,
  };

  if (!Array.isArray(inventory)) return bonuses;

  for (const inv of inventory) {
    // Récupérer l'objet item (gère aussi bien inv.items que inv.item ou inv directement)
    const item = inv?.items || inv?.item || (inv?.stat_bonus ? inv : null);
    if (!item || !item.stat_bonus) continue;

    let statBonus = item.stat_bonus;
    if (typeof statBonus === "string") {
      try {
        statBonus = JSON.parse(statBonus);
      } catch (e) {
        continue;
      }
    }

    if (typeof statBonus === "object" && statBonus !== null) {
      for (const [key, val] of Object.entries(statBonus)) {
        if (typeof val === "number") {
          bonuses[key] = (bonuses[key] || 0) + val;
        }
      }
    }
  }

  return bonuses;
}

/**
 * Applique les bonus passifs d'inventaire sur les statistiques d'aventure
 */
export function applyEquipmentStats(
  baseStats: CharacterBaseStats,
  inventory: any[]
): CharacterBaseStats {
  const bonuses = calculateInventoryBonuses(inventory);

  const finalHpMax = baseStats.hp_max + (bonuses.hp_max || 0);

  return {
    hp_current: Math.min(finalHpMax, baseStats.hp_current + (bonuses.hp_max || 0)),
    hp_max: finalHpMax,
    strength: baseStats.strength + (bonuses.strength || 0),
    agility: baseStats.agility + (bonuses.agility || 0),
    luck: baseStats.luck + (bonuses.luck || 0),
    charisma: baseStats.charisma + (bonuses.charisma || 0),
  };
}
