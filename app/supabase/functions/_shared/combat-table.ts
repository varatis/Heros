// ============================================================
// HeroBook — `_shared/combat-table.ts`
// ------------------------------------------------------------
// LA « Table des coups portés » officielle de Joe Dever, transcrite
// depuis la table imprimée à la fin du livre « Les Maîtres des
// Ténèbres » (PDF de référence, dernière page).
//
//   E  = points d'ENDURANCE perdus par l'Ennemi
//   LS = points d'ENDURANCE perdus par le Loup Solitaire
//   T  = « Tué sur le coup » (mort instantanée)
//
// Structure du livre :
//  - 13 COLONNES par *bandes* de Quotient d'Attaque
//    (≤ −11, −10/−9, −8/−7, −6/−5, −4/−3, −2/−1, 0, +1/+2,
//     +3/+4, +5/+6, +7/+8, +9/+10, ≥ +11)
//  - 10 LIGNES = chiffre donné par la Table de Hasard (1..9 puis 0)
//
// Vérification de fidélité (exemple des règles, p. 20-21 du livre) :
//   « Quotient −3, chiffre 6 → le Loup Solitaire perd 3 points
//     d'ENDURANCE, le Diable Volant en perd 6. »
//   => resolveCombatRound(-3, 6) === { enemyLoss: 6, playerLoss: 3 }
// ============================================================

/** Perte marquée « T » dans le livre : tué sur le coup. */
export const INSTANT_KILL = "K" as const;

export type Loss = number | typeof INSTANT_KILL;

export interface CombatRoundOutcome {
  /** ENDURANCE perdue par l'ennemi (ou "K" = tué sur le coup). */
  enemyLoss: Loss;
  /** ENDURANCE perdue par le Loup Solitaire (ou "K" = tué sur le coup). */
  playerLoss: Loss;
}

/**
 * Bornes des 13 colonnes de la table, dans l'ordre du livre.
 * `[min, max]` inclusifs sur le Quotient d'Attaque.
 */
export const QUOTIENT_BANDS: ReadonlyArray<readonly [number, number]> = [
  [-Infinity, -11], // ≤ −11
  [-10, -9],
  [-8, -7],
  [-6, -5],
  [-4, -3],
  [-2, -1],
  [0, 0],
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
  [9, 10],
  [11, Infinity], // ≥ +11
];

/** Libellés des colonnes tels qu'imprimés dans le livre. */
export const QUOTIENT_BAND_LABELS: readonly string[] = [
  "-11 ou inférieur",
  "-10/-9",
  "-8/-7",
  "-6/-5",
  "-4/-3",
  "-2/-1",
  "0/0",
  "+1/+2",
  "+3/+4",
  "+5/+6",
  "+7/+8",
  "+9/+10",
  "+11 ou supérieur",
];

/**
 * Table des coups portés — 10 lignes (chiffre de Hasard) × 13 colonnes.
 * Chaque cellule est `[E, LS]`, transcrite cellule par cellule depuis
 * la table imprimée du livre.
 */
const TABLE: Record<number, ReadonlyArray<readonly [Loss, Loss]>> = {
  // Chiffre 1
  1: [
    [0, INSTANT_KILL], [0, INSTANT_KILL], [0, 8], [0, 6], [1, 6], [2, 5],
    [3, 5], [4, 5], [5, 4], [6, 4], [7, 4], [8, 3], [9, 3],
  ],
  // Chiffre 2
  2: [
    [0, INSTANT_KILL], [0, 8], [0, 7], [1, 6], [2, 5], [3, 5],
    [4, 4], [5, 4], [6, 3], [7, 3], [8, 3], [9, 3], [10, 2],
  ],
  // Chiffre 3
  3: [
    [0, 8], [0, 7], [1, 6], [2, 5], [3, 5], [4, 4],
    [5, 4], [6, 3], [7, 3], [8, 3], [9, 2], [10, 2], [11, 2],
  ],
  // Chiffre 4
  4: [
    [0, 8], [1, 7], [2, 6], [3, 5], [4, 4], [5, 4],
    [6, 3], [7, 3], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2],
  ],
  // Chiffre 5
  5: [
    [1, 7], [2, 6], [3, 5], [4, 4], [5, 4], [6, 3],
    [7, 2], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [14, 1],
  ],
  // Chiffre 6
  6: [
    [2, 6], [3, 6], [4, 5], [5, 4], [6, 3], [7, 2],
    [8, 2], [9, 2], [10, 2], [11, 1], [12, 1], [14, 1], [16, 1],
  ],
  // Chiffre 7
  7: [
    [3, 5], [4, 5], [5, 4], [6, 3], [7, 2], [8, 2],
    [9, 1], [10, 1], [11, 1], [12, 0], [14, 0], [16, 0], [18, 0],
  ],
  // Chiffre 8
  8: [
    [4, 4], [5, 4], [6, 3], [7, 2], [8, 1], [9, 1],
    [10, 0], [11, 0], [12, 0], [14, 0], [16, 0], [18, 0], [INSTANT_KILL, 0],
  ],
  // Chiffre 9
  9: [
    [5, 3], [6, 3], [7, 2], [8, 0], [9, 0], [10, 0],
    [11, 0], [12, 0], [14, 0], [16, 0], [18, 0], [INSTANT_KILL, 0], [INSTANT_KILL, 0],
  ],
  // Chiffre 0
  0: [
    [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0],
    [12, 0], [14, 0], [16, 0], [18, 0], [INSTANT_KILL, 0], [INSTANT_KILL, 0], [INSTANT_KILL, 0],
  ],
};

/** Index de la colonne correspondant à un Quotient d'Attaque. */
export function quotientBandIndex(quotient: number): number {
  for (let i = 0; i < QUOTIENT_BANDS.length; i++) {
    const [min, max] = QUOTIENT_BANDS[i];
    if (quotient >= min && quotient <= max) return i;
  }
  // Inatteignable : les bornes couvrent ]-inf, +inf[
  return quotient < 0 ? 0 : QUOTIENT_BANDS.length - 1;
}

/**
 * Résout un assaut selon la Table des coups portés du livre.
 *
 * @param quotient Quotient d'Attaque (HABILETÉ du joueur − HABILETÉ ennemi)
 * @param hazardRoll Chiffre 0-9 donné par la Table de Hasard
 */
export function resolveCombatRound(
  quotient: number,
  hazardRoll: number,
): CombatRoundOutcome {
  const row = TABLE[hazardRoll];
  if (!row) {
    throw new Error(
      `Chiffre de Table de Hasard invalide : ${hazardRoll} (attendu 0-9)`,
    );
  }
  const [enemyLoss, playerLoss] = row[quotientBandIndex(quotient)];
  return { enemyLoss, playerLoss };
}

/**
 * Applique une perte à un total d'ENDURANCE.
 * « T » (tué sur le coup) réduit directement le total à 0.
 */
export function applyLoss(endurance: number, loss: Loss): number {
  if (loss === INSTANT_KILL) return 0;
  return Math.max(0, endurance - loss);
}

/** Sérialisation de la table pour stockage/inspection (rulebook, tests). */
export function combatTableAsMatrix(): Record<
  string,
  Array<{ enemy: Loss; player: Loss }>
> {
  const out: Record<string, Array<{ enemy: Loss; player: Loss }>> = {};
  for (const roll of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
    out[String(roll)] = TABLE[roll].map(([enemy, player]) => ({
      enemy,
      player,
    }));
  }
  return out;
}
