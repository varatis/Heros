/**
 * Loup Solitaire — Types du moteur de jeu
 * ---------------------------------------
 * Reproduit fidèlement les règles de la série « Loup Solitaire » de Joe Dever :
 *  - Habileté (COMBAT SKILL) et Endurance (ENDURANCE) déterminées à la Table de Hasard
 *  - 5 Disciplines Kaï au choix parmi 10
 *  - 2 armes maximum, 8 objets de Sac à Dos maximum, 50 Pièces d'Or maximum
 *  - Combat résolu par Quotient d'Attaque + Table des Coups Portés
 */

/** Identifiant d'une Discipline Kaï. */
export type KaiDisciplineId =
  | "camouflage"
  | "chasse"
  | "sixieme-sens"
  | "orientation"
  | "guerison"
  | "maitrise-armes"
  | "bouclier-psychique"
  | "puissance-psychique"
  | "communication-animale"
  | "maitrise-matiere";

export interface KaiDiscipline {
  id: KaiDisciplineId;
  nom: string;
  nomCourt: string;
  emoji: string;
  /** Effet résumé affiché sur la Feuille d'Aventure. */
  effet: string;
  /** Description détaillée pour la section Règles. */
  description: string;
  /** Note mécanique précise (boni, cas particuliers). */
  mecanique: string;
}

/** Type d'arme (utilisé pour la Maîtrise des Armes). */
export type WeaponId =
  | "poignard"
  | "lance"
  | "masse"
  | "sabre"
  | "marteau-de-guerre"
  | "epee"
  | "hache"
  | "baton"
  | "glaive"
  | "epee-courte"
  | "arc";

export type BackpackTag =
  | "repas"
  | "potion-laumspur"
  | "potion-alether"
  | "potion-guerison"
  | "corde"
  | "torche"
  | "briquet"
  | "couverture"
  | "savon"
  | "message"
  | "autre";

export interface ItemDef {
  id: string;
  nom: string;
  emoji: string;
  /** Où l'objet se range : main (arme), sac à dos, bourse, objet spécial. */
  slot: "arme" | "sac" | "bourse" | "special" | "or";
  /** Valeur en Pièces d'Or si slot = "or". */
  valeurOr?: number;
  /** Sous-type d'arme si slot = arme. */
  weapon?: WeaponId;
  /** Nature d'objet de sac à dos. */
  tag?: BackpackTag;
  description: string;
  /** Effet mécanique éventuel (PV rendus, boni d'Habileté...). */
  effet?: {
    endurance?: number;
    habilete?: number;
    /** true = boni permanent tant que l'objet est possédé. */
    permanent?: boolean;
    /** true = consommable (une seule utilisation). */
    consommable?: boolean;
    max?: number;
  };
}

/** Ce qu'un objet ajouté par un paragraphe peut demander de choisir. */
export interface ItemGrant {
  id: string;
  quantity?: number;
  /** Le joueur doit-il choisir d'emporter l'objet ? (certains sont optionnels) */
  optionnel?: boolean;
  /** Texte affiché quand on ramasse l'objet. */
  message?: string;
}

/** Condition d'accès à un choix ou à un paragraphe. */
export interface Requirement {
  discipline?: KaiDisciplineId;
  /** Arme présente dans la main (id du catalogue d'objets). */
  arme?: string;
  /** Objet du sac à dos présent. */
  sac?: string;
  /** Objet spécial possédé. */
  special?: string;
  /** Id d'objet possédé, quel que soit l'emplacement. */
  objet?: string;
  /** Nombre de Pièces d'Or minimum. */
  or?: number;
  /** Nombre de Repas minimum. */
  repas?: number;
  /** Drapeau narratif. */
  drapeau?: string;
}

/** Choix menant à un autre paragraphe. */
export interface Choice {
  /** Texte du choix, tel qu'il doit apparaître. */
  texte: string;
  /** Numéro du paragraphe cible. */
  vers: string;
  /** Condition d'accès (masque le choix si absent/non rempli). */
  requis?: Requirement;
  /** Effet narratif appliqué en quittant le paragraphe. */
  effets?: SectionEffects;
  /** true = le choix est affiché même si la condition n'est pas remplie (grisé). */
  montreToujours?: boolean;
}

export interface EnemyDef {
  nom: string;
  habilete: number;
  endurance: number;
  /** Immunisé à la Puissance Psychique. */
  immunisePsychique?: boolean;
  /** Le joueur subit ce malus d'Habileté sauf s'il possède Bouclier Psychique. */
  malusPsychique?: number;
  /** Objet qui annule le malus d'Habileté (ex. une torche face à une créature des ténèbres). */
  malusEvitePar?: string;
  /** Boni d'Habileté accordé au joueur pour ce combat. */
  bonusJoueur?: number;
  /** Bonus d'Habileté du joueur limité au premier assaut (attaque par surprise, Tome 2). */
  bonusPremierAssaut?: number;
  /** L'ennemi ne peut pas se défendre pendant les N premiers assauts (Halvorc, Tome 2). */
  sansDefenseAssauts?: number;
  /** L'ennemi encaisse le double des dégâts du Glaive de Sommer (morts-vivants). */
  vulnerableGlaiveSommer?: boolean;
  /** Le joueur peut fuir ce combat (choix proposés). */
  fuite?: { texte: string; vers: string }[];
  /** Dégâts spéciaux : perte d'Endurance automatique par assaut (poison...). */
  poisonParAssaut?: number;
  emoji?: string;
  image?: string;
  description?: string;
}

export type EventKind =
  | "jet-hasard"
  | "jet-hasard-table"
  | "indice"
  | "repos"
  | "mort"
  | "victoire"
  | "discipline"
  | "cout"
  | "or"
  | "repas";

export interface RandomEvent {
  /** Type d'évènement. */
  type: EventKind;
  titre?: string;
  texte?: string;
  /** Résultat du dé : { "0-4": {...}, "5-9": {...} } */
  branches?: Record<string, BranchResult>;
  /** Émotion / couleur pour l'animation. */
  ton?: "danger" | "espoir" | "neutre" | "mystere" | "joie";
}

export interface BranchResult {
  endurance?: number;
  habilete?: number;
  vers?: string;
  texte?: string;
  objets?: ItemGrant[];
  or?: number;
  drapeau?: string;
  mort?: boolean;
  combat?: EnemyDef;
}

export interface SectionEffects {
  /** Modification d'Endurance (négatif = dégâts). */
  endurance?: number;
  /** Modification d'Habileté (permanente sauf indication). */
  habilete?: number;
  or?: number;
  repas?: number;
  /** Objets à ajouter. */
  objets?: ItemGrant[];
  /** Objets à retirer (perte du sac à dos, arme cassée...). */
  retirerObjets?: string[];
  /** "main" = le joueur perd toutes ses armes, les deux = perd son arme en cours,
   *  "tout" = armes + sac + bourse + objets spéciaux (spoliation complète, §194 Tome 2). */
  perdreArme?: "une" | "toutes" | "sac" | "bourse" | "tout";
  /** Note d'histoire mémorisée. */
  drapeau?: string;
  /** Passer par un combat avant de continuer. */
  combat?: EnemyDef;
  /** Évènement animé. */
  evenement?: RandomEvent;
  /** Le joueur meurt immédiatement. */
  mort?: boolean;
  /** Le joueur doit manger un repas (échec = -3 Endurance). */
  repasObligatoire?: boolean;
  /** L'utilisation de la discipline remplace le repas. */
  repasChassePossible?: boolean;
  /** Perte d'Endurance appliquée uniquement si le joueur NE maîtrise PAS la discipline indiquée
   *  (ex. attaque mentale d'un Monstre d'Enfer hors combat, sans Bouclier Psychique). */
  enduranceSiSansDiscipline?: { discipline: KaiDisciplineId; perte: number };
}

export interface StorySection {
  /** Numéro du paragraphe (clé). */
  id: string;
  /** Illustrations associées (chemin /lonewolf/xxx.webp). */
  image?: string;
  /** Description de la scène réellement représentée, notamment en cas de réemploi. */
  imageAlt?: string;
  /** Titre court affiché au-dessus du texte. */
  titre?: string;
  /** Texte narratif. */
  texte: string;
  /** Suite linéaire : « Si vous êtes vainqueur, rendez-vous au 213. » */
  suite?: string;
  /** Choix multiples. */
  choix?: Choice[];
  /** Effets appliqués à l'arrivée sur le paragraphe. */
  effets?: SectionEffects;
  /** Combat à mener sur ce paragraphe. */
  combat?: EnemyDef;
  /** Évènement (jet de hasard, découverte, etc.). */
  evenement?: RandomEvent;
  /** Fin de l'aventure. */
  fin?: "victoire" | "mort" | "neutre";
  /** Fin atteinte nommée (pour la galerie des fins). */
  nomFin?: string;
}

export interface BookChapter {
  titre: string;
  sections: StorySection[];
}

export interface StoryBook {
  slug: string;
  numero: number;
  titre: string;
  sousTitre: string;
  resume: string;
  auteur: string;
  illustration: string;
  /** Arme de départ (aucune pour le Tome 2). */
  armeDepart?: string;
  /** Or de départ : entre orDepartMin et orDepartMax Pièces d'Or. */
  orDepartMin: number;
  orDepartMax: number;
  /** Nombre de tirages d'équipement à la création (1 pour le Tome 1, 2 pour le Tome 2). */
  tiragesEquipement?: number;
  /** Objets de départ fixes. */
  objetsDepart: ItemGrant[];
  /** Table de tirage de l'objet bonus du monastère (1 nombre de la Table de Hasard). */
  tirageDepart: Record<string, ItemGrant[]>;
  /** Toutes les sections, indexées par numéro. */
  sections: Record<string, StorySection>;
}

/* ------------------------------------------------------------------ */
/* État de partie                                                      */
/* ------------------------------------------------------------------ */

export interface CombatState {
  ennemi: EnemyDef;
  /** Endurance actuelle de l'ennemi. */
  enduranceEnnemi: number;
  tour: number;
  /** Journal des assauts. */
  journal: CombatLogEntry[];
  termine: "victoire" | "fuite" | "mort" | null;
  /** Boni d'Habileté temporaires (Alether...). */
  bonusTemp: number;
}

export interface CombatLogEntry {
  tour: number;
  nombre: number;
  quotient: number;
  degatsEnnemi: number;
  degatsJoueur: number;
  enduranceEnnemi: number;
  enduranceJoueur: number;
  critique?: "ennemi-tue" | "joueur-tue" | "aucun-degat";
}

export interface AdventureState {
  version: number;
  bookSlug: string;
  /** Habileté tirée à la Table de Hasard (10 + nombre). */
  habileteBase: number;
  /** Modificateurs permanents d'Habileté (évènements de l'aventure). */
  habileteMod: number;
  /** Endurance tirée à la Table de Hasard (20 + nombre). */
  enduranceBase: number;
  enduranceActuelle: number;
  disciplines: KaiDisciplineId[];
  /** Arme maîtrisée avec la Maîtrise des Armes. */
  armeMaitrisee?: WeaponId;
  /** Armes portées (2 maximum). */
  mains: string[];
  /** Arme utilisée au combat (id d'objet présent dans `mains`). */
  armeEnMain?: string;
  /** Sac à dos (8 objets maximum). */
  sac: string[];
  /** Objets spéciaux (hors sac). */
  objetsSpeciaux: string[];
  /** Bourse de Pièces d'Or (50 maximum). */
  couronnes: number;
  drapeaux: Record<string, boolean | number | string>;
  /** Paragraphe courant. */
  paragraphe: string;
  /** Historique de lecture (fil d'Ariane / mode texte). */
  historique: string[];
  /** Paragraphes déjà visités. */
  visites: string[];
  /** Fins atteintes, cumulées d'une partie à l'autre. */
  fins: string[];
  tempsDebut: number;
  /** Graine de la Table de Hasard (grille 10×10 reproductible). */
  graine: number;
  termine: boolean;
}

/** Évènement généré par le moteur, consommé par l'interface pour l'animation. */
export type GameEvent =
  | { kind: "objet"; itemId: string; quantity: number; message?: string; perdu?: boolean }
  | { kind: "endurance"; delta: number; raison?: string }
  | { kind: "habilete"; delta: number; raison?: string }
  | { kind: "or"; delta: number }
  | { kind: "repas"; texte: string; ton: "ok" | "malus" | "chasse" }
  | { kind: "discipline"; discipline: KaiDisciplineId; texte: string }
  | { kind: "jet"; nombre: number; texte: string; ton?: RandomEvent["ton"] }
  | { kind: "info"; texte: string; ton?: RandomEvent["ton"] }
  | { kind: "mort"; texte: string }
  | { kind: "fin"; fin: "victoire" | "mort" | "neutre"; nom?: string };
