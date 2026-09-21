/**
 * Loup Solitaire — Table de Hasard
 * --------------------------------
 * Dans les livres, le lecteur ferme les yeux et pointe son crayon sur une
 * grille de 100 chiffres (0 à 9) disposée en 10 lignes et 10 colonnes.
 * Le chiffre désigné sert de « nombre aléatoire ».
 *
 * Ici :
 *  - la grille est générée à partir d'une graine, donc reproductible et
 *    identique pour toute la partie (comme la page de la Table de Hasard) ;
 *  - le joueur peut désigner une case lui-même (mode « crayon ») ;
 *  - ou laisser l'application désigner une case au hasard, avec une
 *    animation de roulement (mode « laissez faire le hasard »).
 */

/** PRNG déterministe (mulberry32). */
export function prng(graine: number) {
  let a = graine >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TAILLE_TABLE = 10;

/** Construit une grille 10×10 de chiffres 0-9 équilibrée puis mélangée. */
export function genererTableHasard(graine: number): number[][] {
  const rnd = prng(graine);
  const cases: number[] = [];
  // 10 exemplaires de chaque chiffre, comme dans la table du livre.
  for (let n = 0; n < 10; n++) {
    for (let i = 0; i < 10; i++) cases.push(n);
  }
  // Mélange de Fisher-Yates.
  for (let i = cases.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [cases[i], cases[j]] = [cases[j], cases[i]];
  }
  const grille: number[][] = [];
  for (let l = 0; l < TAILLE_TABLE; l++) {
    grille.push(cases.slice(l * TAILLE_TABLE, (l + 1) * TAILLE_TABLE));
  }
  return grille;
}

/** Nouvelle graine aléatoire. */
export function nouvelleGraine(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0];
  }
  return Math.floor(Math.random() * 0xffffffff);
}

/**
 * Tire un nombre aléatoire de 0 à 9 (usage interne quand le joueur
 * « laisse faire le hasard » sans pointer la table).
 */
export function tirerNombre(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % 10;
  }
  return Math.floor(Math.random() * 10);
}

/** Case au hasard de la table (mode « crayon » automatique). */
export function caseAuHasard(graine: number, coup: number): {
  ligne: number;
  colonne: number;
  nombre: number;
} {
  const rnd = prng(graine * 7919 + coup * 104729 + 13);
  const ligne = Math.floor(rnd() * TAILLE_TABLE);
  const colonne = Math.floor(rnd() * TAILLE_TABLE);
  const grille = genererTableHasard(graine);
  return { ligne, colonne, nombre: grille[ligne][colonne] };
}
