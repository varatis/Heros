export interface CharacterBaseStats {
  hp_current: number;
  hp_max: number;
  strength: number;
  agility: number;
  luck: number;
  charisma: number;
  armor?: number;
  attack_power?: number;
}

/**
 * Nouveau système générique : Vie / Armure / Attaque
 * Compatibilité Loup Solitaire : strength=Attaque/HAB, agility=Armure
 */
export function calculateInventoryBonuses(
  inventory: any[],
): Record<string, number> {
  const bonuses: Record<string, number> = {
    hp_max: 0,
    hp: 0,
    strength: 0,
    agility: 0,
    luck: 0,
    charisma: 0,
    armor: 0,
    attack: 0,
    attack_power: 0,
  };

  if (!Array.isArray(inventory)) return bonuses;

  for (const inv of inventory) {
    const item = inv?.items || inv?.item || (inv?.stat_bonus ? inv : null);
    if (!item || !item.stat_bonus) continue;

    let statBonus = item.stat_bonus;
    if (typeof statBonus === "string") {
      try {
        statBonus = JSON.parse(statBonus);
      } catch {
        continue;
      }
    }

    if (typeof statBonus === "object" && statBonus !== null) {
      for (const [key, val] of Object.entries(statBonus)) {
        if (typeof val === "number") {
          const k = key === "attack" ? "attack_power" : key;
          bonuses[k] = (bonuses[k] || 0) + val;
          // Sync compat
          if (k === "armor") bonuses.agility = (bonuses.agility || 0) + val;
          if (k === "attack_power") bonuses.strength = (bonuses.strength || 0) + val;
          if (key === "agility") bonuses.armor = (bonuses.armor || 0) + val;
          if (key === "strength") bonuses.attack_power = (bonuses.attack_power || 0) + val;
        }
      }
    }
  }

  return bonuses;
}

export function applyEquipmentStats(
  baseStats: CharacterBaseStats,
  inventory: any[],
): CharacterBaseStats {
  const bonuses = calculateInventoryBonuses(inventory);

  const finalHpMax = baseStats.hp_max + (bonuses.hp_max || 0);
  const armor = (baseStats.armor ?? baseStats.agility ?? 0) + (bonuses.armor || 0);
  const attack = (baseStats.attack_power ?? baseStats.strength ?? 0) + (bonuses.attack_power || 0);

  return {
    hp_current: Math.min(finalHpMax, baseStats.hp_current + (bonuses.hp_max || 0) + (bonuses.hp || 0)),
    hp_max: finalHpMax,
    strength: attack,
    agility: armor,
    luck: baseStats.luck + (bonuses.luck || 0),
    charisma: baseStats.charisma + (bonuses.charisma || 0),
    armor,
    attack_power: attack,
  };
}

// Helpers pour le nouveau système
export function getVie(stats: CharacterBaseStats): { current: number; max: number } {
  return { current: stats.hp_current, max: stats.hp_max };
}
export function getArmure(stats: CharacterBaseStats): number {
  return stats.armor ?? stats.agility ?? 0;
}
export function getAttaque(stats: CharacterBaseStats): number {
  return stats.attack_power ?? stats.strength ?? 0;
}
