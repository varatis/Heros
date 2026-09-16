import type {
  AdventureState,
  EnemyDef,
  GameEvent,
  ItemGrant,
  KaiDisciplineId,
  Requirement,
  SectionEffects,
  StoryBook,
  StorySection,
  WeaponId,
} from "./types";
import {
  getItem,
  LIMITE_ARMES,
  LIMITE_COURONNES,
  LIMITE_SAC,
  PENALITE_REPAS,
  resultatCombat,
} from "./rules";
import { nouvelleGraine } from "./table-hasard";

export const VERSION_SAUVEGARDE = 3;

/* ==================================================================
   CRÉATION D'UNE AVENTURE
   ================================================================== */

export interface CreationParams {
  book: StoryBook;
  habileteBase: number;
  enduranceBase: number;
  disciplines: KaiDisciplineId[];
  armeMaitrisee?: WeaponId;
  /** Tirage de l'objet trouvé au monastère en ruine (clé = chiffre 0-9). */
  tirageDepart?: string;
  /** Nombre de Pièces d'Or de départ (1D10). */
  orDepart?: number;
}

export function creerAventure(params: CreationParams): AdventureState {
  const { book } = params;

  const state: AdventureState = {
    version: VERSION_SAUVEGARDE,
    bookSlug: book.slug,
    habileteBase: params.habileteBase,
    habileteMod: 0,
    enduranceBase: params.enduranceBase,
    enduranceActuelle: params.enduranceBase,
    disciplines: [...params.disciplines],
    armeMaitrisee: params.armeMaitrisee,
    mains: [],
    armeEnMain: undefined,
    sac: [],
    objetsSpeciaux: [],
    couronnes: 0,
    drapeaux: {},
    paragraphe: "1",
    historique: [],
    visites: [],
    fins: [],
    tempsDebut: Date.now(),
    graine: nouvelleGraine(),
    termine: false,
  };

  // Équipement de départ : arme + objets + or.
  ajouterObjet(state, { id: book.armeDepart });
  state.armeEnMain = book.armeDepart;

  for (const grant of book.objetsDepart) {
    ajouterObjet(state, grant);
  }

  if (params.orDepart !== undefined) {
    state.couronnes = Math.max(
      book.orDepartMin,
      Math.min(LIMITE_COURONNES, params.orDepart)
    );
  }

  if (params.tirageDepart !== undefined) {
    const grants = book.tirageDepart[params.tirageDepart] ?? [];
    for (const grant of grants) ajouterObjet(state, grant);
  }

  // Le total d'Endurance de départ intègre les objets permanents (casque, cotte).
  state.enduranceActuelle = enduranceMax(state);

  return state;
}

/* ==================================================================
   CALCULS DÉRIVÉS
   ================================================================== */

/** Endurance maximale = Endurance de base + bonus permanents des objets. */
export function enduranceMax(state: AdventureState): number {
  let bonus = 0;
  for (const id of [...state.objetsSpeciaux, ...state.mains, ...state.sac]) {
    const it = getItem(id);
    if (it?.effet?.permanent && it.effet.endurance) bonus += it.effet.endurance;
  }
  return state.enduranceBase + bonus;
}

/** Habileté hors combat : base + modificateurs + objets permanents. */
export function habileteHorsCombat(state: AdventureState): number {
  let bonus = 0;
  for (const id of state.objetsSpeciaux) {
    const it = getItem(id);
    if (it?.effet?.permanent && it.effet.habilete) bonus += it.effet.habilete;
  }
  return state.habileteBase + state.habileteMod + bonus;
}

export interface DetailHabilete {
  label: string;
  valeur: number;
  emoji?: string;
}

export interface HabileteCombat {
  total: number;
  details: DetailHabilete[];
}

/**
 * Habileté utilisée au combat, détaillée ligne par ligne comme sur une
 * Feuille d'Aventure (c'est ce que la série appelle « ajouter les points
 * supplémentaires que confèrent les Disciplines et les Objets Spéciaux »).
 */
export function habileteCombat(
  state: AdventureState,
  ennemi?: EnemyDef
): HabileteCombat {
  const details: DetailHabilete[] = [
    { label: "Habileté de base", valeur: state.habileteBase },
  ];
  if (state.habileteMod !== 0) {
    details.push({ label: "Modificateurs d'aventure", valeur: state.habileteMod });
  }

  // Objets spéciaux permanents (bouclier, glaive de Sommer...).
  for (const id of state.objetsSpeciaux) {
    const it = getItem(id);
    if (!it) continue;
    if (it.effet?.permanent && it.effet.habilete) {
      details.push({ label: it.nom, valeur: it.effet.habilete, emoji: it.emoji });
    }
  }

  // Arme en main : Maîtrise des Armes.
  if (state.armeEnMain) {
    const item = getItem(state.armeEnMain);
    if (
      state.disciplines.includes("maitrise-armes") &&
      item?.weapon &&
      state.armeMaitrisee === item.weapon
    ) {
      details.push({ label: `Maîtrise : ${item.nom}`, valeur: 2, emoji: "⚔️" });
    }
  } else {
    // Combat sans arme : -4 points d'Habileté.
    details.push({ label: "Combat sans arme", valeur: -4, emoji: "✊" });
  }

  // Puissance Psychique : +2, sauf créature immunisée.
  if (state.disciplines.includes("puissance-psychique")) {
    if (ennemi && ennemi.immunisePsychique) {
      details.push({
        label: `${ennemi.nom} immunisé (Puissance Psychique)`,
        valeur: 0,
        emoji: "🚫",
      });
    } else {
      details.push({ label: "Puissance Psychique", valeur: 2, emoji: "🔮" });
    }
  }

  // Boni narratif du paragraphe (combat à l'avantage, embuscade...).
  if (ennemi?.bonusJoueur) {
    details.push({ label: "Situation du combat", valeur: ennemi.bonusJoueur, emoji: "🎯" });
  }

  // Malus psychique de l'ennemi (annulé par le Bouclier Psychique).
  if (ennemi?.malusPsychique) {
    const eviteParObjet =
      ennemi.malusEvitePar !== undefined && possede(state, ennemi.malusEvitePar);
    if (eviteParObjet) {
      details.push({
        label: `${getItem(ennemi.malusEvitePar!)?.nom ?? "Objet"} : malus annulé`,
        valeur: 0,
        emoji: "🔥",
      });
    } else if (state.disciplines.includes("bouclier-psychique")) {
      details.push({
        label: "Bouclier Psychique (malus annulé)",
        valeur: 0,
        emoji: "🛡️",
      });
    } else {
      details.push({
        label: `${ennemi.nom} : attaque mentale`,
        valeur: -ennemi.malusPsychique,
        emoji: "💀",
      });
    }
  }

  const total = details.reduce((acc, d) => acc + d.valeur, 0);
  return { total, details };
}

/* ==================================================================
   INVENTAIRE
   ================================================================== */

export interface AjoutResultat {
  ajoute: boolean;
  raison?: string;
}

/** Ajoute un objet en respectant les limites officielles. */
export function ajouterObjet(
  state: AdventureState,
  grant: ItemGrant
): AjoutResultat {
  const def = getItem(grant.id);
  if (!def) return { ajoute: false, raison: "Objet inconnu" };

  const quantite = grant.quantity ?? 1;

  for (let i = 0; i < quantite; i++) {
    if (def.slot === "arme") {
      if (state.mains.length >= LIMITE_ARMES) {
        return { ajoute: false, raison: "Vous ne pouvez porter que 2 armes." };
      }
      state.mains.push(def.id);
      if (!state.armeEnMain) state.armeEnMain = def.id;
    } else if (def.slot === "sac") {
      if (state.sac.length >= LIMITE_SAC) {
        return {
          ajoute: false,
          raison: `Votre Sac à Dos est plein (${LIMITE_SAC} objets maximum).`,
        };
      }
      state.sac.push(def.id);
    } else if (def.slot === "bourse" || def.slot === "or") {
      state.couronnes = Math.min(
        LIMITE_COURONNES,
        state.couronnes + (def.valeurOr ?? 1)
      );
    } else {
      state.objetsSpeciaux.push(def.id);
    }
  }
  return { ajoute: true };
}

/** Retire un objet du premier emplacement où il se trouve. */
export function retirerObjet(state: AdventureState, id: string): boolean {
  const inMains = state.mains.indexOf(id);
  if (inMains >= 0) {
    state.mains.splice(inMains, 1);
    if (state.armeEnMain === id) state.armeEnMain = state.mains[0];
    return true;
  }
  const inSac = state.sac.indexOf(id);
  if (inSac >= 0) {
    state.sac.splice(inSac, 1);
    return true;
  }
  const inSpe = state.objetsSpeciaux.indexOf(id);
  if (inSpe >= 0) {
    state.objetsSpeciaux.splice(inSpe, 1);
    return true;
  }
  return false;
}

export function possede(state: AdventureState, id: string): boolean {
  const def = getItem(id);
  if (!def) return false;
  if (def.slot === "arme") return state.mains.includes(id);
  if (def.slot === "sac") return state.sac.includes(id);
  if (def.slot === "special") return state.objetsSpeciaux.includes(id);
  return false;
}

export function couronnesAjoutees(def: { valeurOr?: number }): number {
  return def.valeurOr ?? 1;
}

export function nombreRepas(state: AdventureState): number {
  return state.sac.filter((id) => id === "repas").length;
}

export function requiert(state: AdventureState, req?: Requirement): boolean {
  if (!req) return true;
  if (req.discipline && !state.disciplines.includes(req.discipline)) return false;
  if (req.arme && !state.mains.includes(req.arme)) return false;
  if (req.sac && !state.sac.includes(req.sac)) return false;
  if (req.special && !state.objetsSpeciaux.includes(req.special)) return false;
  if (req.objet && !possede(state, req.objet)) return false;
  if (req.or !== undefined && state.couronnes < req.or) return false;
  if (req.repas !== undefined && nombreRepas(state) < req.repas) return false;
  if (req.drapeau && !state.drapeaux[req.drapeau]) return false;
  return true;
}

/** Baisse l'Endurance. Retourne true si le héros est mort. */
export function perdreEndurance(
  state: AdventureState,
  montant: number
): boolean {
  state.enduranceActuelle = Math.max(0, state.enduranceActuelle - montant);
  return state.enduranceActuelle <= 0;
}

export function gagnerEndurance(
  state: AdventureState,
  montant: number
): number {
  const max = enduranceMax(state);
  const avant = state.enduranceActuelle;
  state.enduranceActuelle = Math.min(max, state.enduranceActuelle + montant);
  return state.enduranceActuelle - avant;
}

/* ==================================================================
   APPLICATION DES EFFETS D'UN PARAGRAPHE
   ================================================================== */

export interface ApplicationResultat {
  state: AdventureState;
  events: GameEvent[];
  mort: boolean;
}

/**
 * Applique les effets d'un paragraphe (dégâts, objets, or, repas, drapeaux...).
 * Le state passé est cloné : la fonction reste pure.
 */
export function appliquerEffets(
  etat: AdventureState,
  effets?: SectionEffects,
  options: { section?: StorySection } = {}
): ApplicationResultat {
  const state = structuredClone(etat);
  const events: GameEvent[] = [];
  let mort = false;

  if (!effets) return { state, events, mort };

  // --- Repas obligatoire (règle : -3 Endurance si aucun Repas) ---
  if (effets.repasObligatoire) {
    const aChasse =
      effets.repasChassePossible !== false &&
      state.disciplines.includes("chasse");
    if (aChasse) {
      events.push({
        kind: "repas",
        texte:
          "Chasse : vous trouvez de quoi vous nourrir dans la nature, aucun Repas n'est consommé.",
        ton: "chasse",
      });
    } else if (nombreRepas(state) > 0) {
      const index = state.sac.indexOf("repas");
      state.sac.splice(index, 1);
      events.push({
        kind: "repas",
        texte: "Vous rayez un Repas de votre Feuille d'Aventure.",
        ton: "ok",
      });
    } else {
      perdreEndurance(state, PENALITE_REPAS);
      events.push({
        kind: "repas",
        texte: `Aucun Repas à manger : vous perdez ${PENALITE_REPAS} points d'Endurance.`,
        ton: "malus",
      });
    }
  }

  // --- Objets ---
  if (effets.objets) {
    for (const grant of effets.objets) {
      const res = ajouterObjet(state, grant);
      const def = getItem(grant.id);
      events.push({
        kind: "objet",
        itemId: grant.id,
        quantity: grant.quantity ?? 1,
        message: res.ajoute
          ? grant.message
          : `Impossible d'emporter ${def?.nom ?? grant.id} : ${res.raison}`,
        perdu: !res.ajoute,
      });
    }
  }

  // --- Objets retirés ---
  if (effets.retirerObjets) {
    for (const id of effets.retirerObjets) {
      if (retirerObjet(state, id)) {
        const def = getItem(id);
        events.push({
          kind: "objet",
          itemId: id,
          quantity: 1,
          perdu: true,
          message: `${def?.nom ?? id} est perdu.`,
        });
      }
    }
  }

  if (effets.perdreArme === "toutes") {
    const perdues = [...state.mains];
    state.mains = [];
    state.armeEnMain = undefined;
    for (const id of perdues) {
      events.push({
        kind: "objet",
        itemId: id,
        quantity: 1,
        perdu: true,
        message: "Vous perdez votre arme.",
      });
    }
  } else if (effets.perdreArme === "sac") {
    const perdus = [...state.sac];
    state.sac = [];
    for (const id of perdus) {
      events.push({
        kind: "objet",
        itemId: id,
        quantity: 1,
        perdu: true,
        message: "Votre Sac à Dos est perdu.",
      });
    }
  } else if (effets.perdreArme === "bourse") {
    const perdu = state.couronnes;
    state.couronnes = 0;
    if (perdu > 0) events.push({ kind: "or", delta: -perdu });
  } else if (effets.perdreArme === "une" && state.mains.length > 0) {
    const perdue = state.mains[state.mains.length - 1];
    retirerObjet(state, perdue);
    events.push({
      kind: "objet",
      itemId: perdue,
      quantity: 1,
      perdu: true,
      message: `${getItem(perdue)?.nom ?? "Une arme"} est brisée.`,
    });
  }

  // --- Or ---
  if (effets.or) {
    const avant = state.couronnes;
    state.couronnes = Math.max(
      0,
      Math.min(LIMITE_COURONNES, state.couronnes + effets.or)
    );
    const delta = state.couronnes - avant;
    if (delta !== 0) events.push({ kind: "or", delta });
    if (effets.or > 0 && avant + effets.or > LIMITE_COURONNES) {
      events.push({
        kind: "info",
        texte: `Votre bourse ne peut contenir que ${LIMITE_COURONNES} Pièces d'Or.`,
        ton: "neutre",
      });
    }
  }

  // --- Repas (delta direct) ---
  if (effets.repas && effets.repas !== 0) {
    if (effets.repas > 0) {
      for (let i = 0; i < effets.repas; i++) {
        ajouterObjet(state, { id: "repas" });
      }
    } else {
      for (let i = 0; i < -effets.repas; i++) {
        const idx = state.sac.indexOf("repas");
        if (idx >= 0) state.sac.splice(idx, 1);
      }
    }
  }

  // --- Endurance ---
  if (effets.endurance) {
    if (effets.endurance < 0) {
      mort = perdreEndurance(state, -effets.endurance) || mort;
      events.push({
        kind: "endurance",
        delta: effets.endurance,
        raison: options.section?.titre,
      });
    } else {
      const gagne = gagnerEndurance(state, effets.endurance);
      if (gagne !== 0) {
        events.push({ kind: "endurance", delta: gagne, raison: "Soins" });
      }
    }
  }

  // --- Habileté ---
  if (effets.habilete) {
    state.habileteMod += effets.habilete;
    events.push({ kind: "habilete", delta: effets.habilete });
  }

  // --- Drapeaux ---
  if (effets.drapeau) state.drapeaux[effets.drapeau] = true;

  // --- Évènement animé ---
  if (effets.evenement?.texte) {
    events.push({
      kind: "info",
      texte: effets.evenement.texte,
      ton: effets.evenement.ton,
    });
  }

  if (effets.mort) {
    mort = true;
  }

  return { state, events, mort };
}

/**
 * Applique la Guérison Kaï : +1 Endurance par paragraphe traversé sans combat.
 */
export function appliquerGuerison(
  etat: AdventureState,
  paragrapheSansCombat: boolean
): { state: AdventureState; event?: GameEvent } {
  if (!paragrapheSansCombat) return { state: etat };
  if (!etat.disciplines.includes("guerison")) return { state: etat };
  const state = structuredClone(etat);
  const avant = state.enduranceActuelle;
  const gagne = gagnerEndurance(state, 1);
  if (gagne <= 0 || avant >= enduranceMax(state)) return { state };
  return {
    state,
    event: {
      kind: "discipline",
      discipline: "guerison",
      texte: "Guérison Kaï : +1 point d'Endurance.",
    },
  };
}

/* ==================================================================
   COMBAT
   ================================================================== */

export interface AssautResultat {
  state: AdventureState;
  enduranceEnnemi: number;
  event: GameEvent;
  log: {
    tour: number;
    nombre: number;
    quotient: number;
    degatsEnnemi: number;
    degatsJoueur: number;
    enduranceEnnemi: number;
    enduranceJoueur: number;
    critique?: "ennemi-tue" | "joueur-tue" | "aucun-degat";
  };
  termine: "victoire" | "mort" | null;
}

/**
 * Résout un assaut : on calcule le Quotient d'Attaque, on croise le nombre
 * tiré à la Table de Hasard avec la Table des Coups Portés, et les deux
 * combattants perdent les points d'Endurance indiqués.
 */
export function resoudreAssaut(
  etat: AdventureState,
  ennemi: EnemyDef,
  enduranceEnnemi: number,
  nombre: number,
  tour: number
): AssautResultat {
  const state = structuredClone(etat);
  const { total } = habileteCombat(state, ennemi);
  const quotient = total - ennemi.habilete;
  const { degatsEnnemi, degatsJoueur, ennemiTue, joueurTue } = resultatCombat(
    quotient,
    nombre
  );

  const nouvelleEnduranceEnnemi = Math.max(0, enduranceEnnemi - degatsEnnemi);
  const enduranceAvant = state.enduranceActuelle;
  state.enduranceActuelle = Math.max(0, state.enduranceActuelle - degatsJoueur);

  if (joueurTue) state.enduranceActuelle = 0;

  // Poison éventuel (ex. Vipère des marais).
  let poison = 0;
  if (
    ennemi.poisonParAssaut &&
    nouvelleEnduranceEnnemi > 0 &&
    degatsJoueur > 0
  ) {
    poison = ennemi.poisonParAssaut;
    state.enduranceActuelle = Math.max(0, state.enduranceActuelle - poison);
  }

  const journalEntry = {
    tour,
    nombre,
    quotient,
    degatsEnnemi,
    degatsJoueur: degatsJoueur + poison,
    enduranceEnnemi: nouvelleEnduranceEnnemi,
    enduranceJoueur: state.enduranceActuelle,
    critique: ennemiTue
      ? ("ennemi-tue" as const)
      : joueurTue
        ? ("joueur-tue" as const)
        : degatsJoueur === 0 && enduranceAvant === state.enduranceActuelle
          ? ("aucun-degat" as const)
          : undefined,
  };

  let termine: "victoire" | "mort" | null = null;
  if (state.enduranceActuelle <= 0) termine = "mort";
  else if (nouvelleEnduranceEnnemi <= 0) termine = "victoire";

  const parts: string[] = [];
  if (degatsEnnemi > 0) parts.push(`${ennemi.nom} perd ${degatsEnnemi} points d'Endurance`);
  if (degatsJoueur > 0 || poison > 0)
    parts.push(`vous en perdez ${degatsJoueur + poison}`);
  const texte =
    parts.length > 0
      ? `Assaut ${tour} — Table de Hasard : ${nombre}. Quotient d'Attaque ${quotient >= 0 ? "+" : ""}${quotient} : ` +
        parts.join(", ") + "."
      : `Assaut ${tour} — Table de Hasard : ${nombre}. Aucun coup porté.`;

  return {
    state,
    enduranceEnnemi: nouvelleEnduranceEnnemi,
    event: { kind: "info", texte, ton: termine === "mort" ? "danger" : "neutre" },
    log: journalEntry,
    termine,
  };
}

/* ==================================================================
   DÉPLACEMENT
   ================================================================== */

export interface ChargementResultat {
  state: AdventureState;
  section: StorySection;
  events: GameEvent[];
  mort: boolean;
}

/**
 * Charge un paragraphe : met à jour l'historique, applique ses effets,
 * puis la Guérison Kaï si le paragraphe ne comporte pas de combat.
 */
export function chargerParagraphe(
  etat: AdventureState,
  book: StoryBook,
  id: string
): ChargementResultat {
  const section = book.sections[id];
  let state = structuredClone(etat);
  const events: GameEvent[] = [];

  state.paragraphe = id;
  if (!state.visites.includes(id)) state.visites.push(id);
  state.historique = [...state.historique, id].slice(-60);

  const res = appliquerEffets(state, section.effets, { section });
  state = res.state;
  events.push(...res.events);
  let mort = res.mort;

  // Fin d'aventure déclarée par le paragraphe.
  if (section.fin) {
    state.termine = true;
    const cle = `${id}:${section.nomFin ?? section.fin}`;
    if (!state.fins.includes(cle)) state.fins.push(cle);
    events.push({ kind: "fin", fin: section.fin, nom: section.nomFin });
    if (section.fin === "mort") mort = true;
  }

  // Guérison Kaï (1 point par paragraphe sans combat).
  if (!section.combat && !section.fin) {
    const g = appliquerGuerison(state, true);
    state = g.state;
    if (g.event) events.push(g.event);
  }

  if (mort && state.enduranceActuelle <= 0) {
    state.termine = true;
    events.push({ kind: "mort", texte: "Votre Endurance est réduite à zéro." });
  }

  return { state, section, events, mort };
}

/* ==================================================================
   ÉVÈNEMENTS À JET DE HASARD
   ================================================================== */

export interface EvenementResultat {
  state: AdventureState;
  events: GameEvent[];
  /** Paragraphe vers lequel l'évènement renvoie. */
  vers?: string;
  mort: boolean;
}

/** Trouve la branche correspondant à un nombre tiré (clé "0-4", "5-9"...). */
export function branchePour(
  evenement: { branches?: Record<string, BranchResultT> },
  nombre: number
) {
  if (!evenement.branches) return undefined;
  for (const [cle, valeur] of Object.entries(evenement.branches)) {
    const [min, max] = cle.split("-").map((v) => parseInt(v.trim(), 10));
    if (nombre >= min && nombre <= max) return valeur;
  }
  return undefined;
}

type BranchResultT = import("./types").BranchResult;

/**
 * Résout un évènement « jetez la Table de Hasard » : le résultat du jet
 * détermine la suite du récit et ses conséquences.
 */
export function resoudreEvenement(
  etat: AdventureState,
  evenement: import("./types").RandomEvent,
  nombre: number
): EvenementResultat {
  const branche = branchePour(evenement, nombre);
  const events: GameEvent[] = [
    {
      kind: "jet",
      nombre,
      texte: evenement.titre ?? "Jet à la Table de Hasard",
      ton: evenement.ton,
    },
  ];

  if (!branche) {
    return { state: etat, events, mort: false };
  }

  if (branche.texte) {
    events.push({ kind: "info", texte: branche.texte, ton: evenement.ton });
  }

  const res = appliquerEffets(etat, {
    endurance: branche.endurance,
    habilete: branche.habilete,
    or: branche.or,
    objets: branche.objets,
    drapeau: branche.drapeau,
    mort: branche.mort,
  });

  return {
    state: res.state,
    events: [...events, ...res.events],
    vers: branche.vers,
    mort: res.mort,
  };
}
