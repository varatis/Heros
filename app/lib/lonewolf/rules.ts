import type {
  KaiDiscipline,
  KaiDisciplineId,
  ItemDef,
  WeaponId,
} from "./types";

/* ==================================================================
   DISCIPLINES KAÏ
   Cinq disciplines sont choisies au début de l'aventure.
   ================================================================== */

export const DISCIPLINES: KaiDiscipline[] = [
  {
    id: "camouflage",
    nom: "Camouflage",
    nomCourt: "Camouflage",
    emoji: "🌿",
    effet: "Se fondre dans le décor et passer inaperçu.",
    description:
      "Vous savez vous glisser dans le paysage. À la campagne, vous disparaissez parmi les arbres et les rochers, au point de frôler un ennemi sans être vu. En ville, vous savez prendre l'allure et l'accent des habitants, ce qui vous aide à trouver un abri ou une cachette sûre.",
    mecanique:
      "Utilisée à la demande : certains paragraphes signalent la possibilité d'y recourir pour éviter un combat ou un danger.",
  },
  {
    id: "chasse",
    nom: "Chasse",
    nomCourt: "Chasse",
    emoji: "🏹",
    effet: "Ne jamais manquer de nourriture en pleine nature.",
    description:
      "Vous ne mourrez jamais de faim dans les régions sauvages : vous savez toujours trouver de quoi vous nourrir. Cet entraînement vous rend également plus rapide et plus agile dans vos déplacements.",
    mecanique:
      "Chaque fois que le texte vous demande de rayer un Repas, la Chasse vous en dispense. En revanche, elle est inutile dans un désert, une terre stérile ou des souterrains sans vie.",
  },
  {
    id: "sixieme-sens",
    nom: "Sixième Sens",
    nomCourt: "6e Sens",
    emoji: "👁️",
    effet: "Deviner les dangers et percer les intentions cachées.",
    description:
      "Un avertissement intérieur vous prévient du danger qui approche. Il vous révèle aussi la véritable intention d'un inconnu ou la nature exacte d'un objet étrange.",
    mecanique:
      "De nombreux paragraphes proposent une option « Si vous possédez le Sixième Sens » qui vous fait bénéficier d'un avertissement.",
  },
  {
    id: "orientation",
    nom: "Orientation",
    nomCourt: "Orientation",
    emoji: "🧭",
    effet: "Toujours choisir le bon chemin, lire les traces.",
    description:
      "Vous savez trouver votre route en pleine nature comme dans les ruelles d'une cité, repérer la cachette d'une personne ou d'un objet, et déchiffrer l'histoire que racontent des traces de pas.",
    mecanique:
      "Intervient sur les paragraphes d'égarement, de choix de piste et de recherche d'indices en ville.",
  },
  {
    id: "guerison",
    nom: "Guérison",
    nomCourt: "Guérison",
    emoji: "✨",
    effet: "+1 point d'Endurance par paragraphe hors combat.",
    description:
      "La science du corps acquise au monastère vous permet de récupérer rapidement de vos blessures, par la respiration, la maîtrise du sang et la connaissance des plantes.",
    mecanique:
      "Restaure 1 point d'Endurance pour chaque paragraphe traversé sans combat, tant que votre Endurance est inférieure à son total de départ. L'Endurance ne peut jamais dépasser son maximum de départ. La Guérison ne compense pas les dégâts d'un Repas manquant.",
  },
  {
    id: "maitrise-armes",
    nom: "Maîtrise des Armes",
    nomCourt: "Maîtrise",
    emoji: "⚔️",
    effet: "+2 Habileté avec une arme tirée à la Table de Hasard.",
    description:
      "Au monastère, chaque élève reçoit l'enseignement d'une arme particulière. Un tirage à la Table de Hasard détermine celle dont le maniement vous a été enseigné.",
    mecanique:
      "+2 points d'Habileté à chaque fois que vous combattez avec cette arme en main. Vous pouvez retirer la même arme que le tirage initial en début d'aventure (consigne officielle de la série).",
  },
  {
    id: "bouclier-psychique",
    nom: "Bouclier Psychique",
    nomCourt: "Bouclier",
    emoji: "🛡️",
    effet: "Aucun dégât lors d'une attaque mentale.",
    description:
      "Les Maîtres des Ténèbres et beaucoup de créatures malfaisantes savent frapper par la seule force de leur esprit. Le Bouclier Psychique vous protège de ces attaques et renforce aussi votre défense contre l'hypnose et les illusions.",
    mecanique:
      "Vous ne perdez aucun point d'Endurance lors d'une attaque psychique, et vous annulez les malus d'Habileté infligés par un adversaire doté de ce pouvoir.",
  },
  {
    id: "puissance-psychique",
    nom: "Puissance Psychique",
    nomCourt: "Puissance",
    emoji: "🔮",
    effet: "+2 Habileté au combat, sauf contre les créatures immunisées.",
    description:
      "Vous projetez la force de votre esprit sur votre adversaire. Cette attaque se combine à votre arme et décuple la puissance de vos coups.",
    mecanique:
      "+2 points d'Habileté, utilisable en même temps qu'une arme. Certaines créatures y sont insensibles : le texte vous en avertit alors, et le bonus est perdu pour ce combat.",
  },
  {
    id: "communication-animale",
    nom: "Communication Animale",
    nomCourt: "Animaux",
    emoji: "🐺",
    effet: "Deviner les intentions des bêtes, combattre monté.",
    description:
      "Vous ressentez les émotions des animaux et savez apaiser une bête farouche. Une fois en selle, vous ne faites qu'un avec votre monture.",
    mecanique:
      "Permet d'éviter certains combats contre des animaux et d'obtenir des informations auprès d'eux. Indispensable pour combattre à cheval.",
  },
  {
    id: "maitrise-matiere",
    nom: "Maîtrise psychique de la Matière",
    nomCourt: "Matière",
    emoji: "🪨",
    effet: "Déplacer de petits objets par la pensée.",
    description:
      "Par la seule force de votre volonté, vous pouvez déplacer de petits objets : faire glisser un verrou, saisir une clé, pousser un levier à distance.",
    mecanique:
      "Ouvre des solutions alternatives face à un mécanisme, une serrure ou un objet hors d'atteinte.",
  },
];

export const DISCIPLINE_BY_ID: Record<KaiDisciplineId, KaiDiscipline> =
  Object.fromEntries(DISCIPLINES.map((d) => [d.id, d])) as Record<
    KaiDisciplineId,
    KaiDiscipline
  >;

export const DISCIPLINES_RECOMMANDEES: KaiDisciplineId[] = [
  "sixieme-sens",
  "camouflage",
];

/* ==================================================================
   ARMES — le tirage de la Maîtrise des Armes
   ================================================================== */

export const ARME_PAR_TIRAGE: Record<string, WeaponId> = {
  "0": "poignard",
  "1": "lance",
  "2": "masse",
  "3": "sabre",
  "4": "marteau-de-guerre",
  "5": "epee",
  "6": "hache",
  "7": "epee",
  "8": "baton",
  "9": "glaive",
};

export const NOM_ARME: Record<WeaponId, string> = {
  poignard: "Poignard",
  lance: "Lance",
  masse: "Masse d'Armes",
  sabre: "Sabre",
  "marteau-de-guerre": "Marteau de Guerre",
  epee: "Épée",
  hache: "Hache",
  baton: "Bâton",
  glaive: "Glaive",
  "epee-courte": "Épée Courte",
  arc: "Arc",
};

/* ==================================================================
   CATALOGUE DES OBJETS
   ================================================================== */

const item = (def: ItemDef) => def;

export const ITEMS: ItemDef[] = [
  item({"id": "herbe-laumspur", "nom": "Herbe de Laumspur", "emoji": "🌿", "slot": "sac", "tag": "repas", "description": "Un repas qui rend 3 points d’Endurance (§103) ; antidote au §145.", "effet": {"endurance": 3, "consommable": true}}),
  item({"id": "potion-guerison-3", "nom": "Potion de Guérison (3 points)", "emoji": "🧪", "slot": "sac", "tag": "potion-guerison", "description": "Une dose, 3 points après un combat (§15/302).", "effet": {"endurance": 3, "consommable": true}}),
  item({"id": "laumspur-5", "nom": "Fiole de Laumspur (5 points)", "emoji": "🧪", "slot": "sac", "tag": "potion-laumspur", "description": "Don de Madin Rendalim, une dose, 5 points après un combat (§40).", "effet": {"endurance": 5, "consommable": true}}),
  item({"id": "sac-a-dos", "nom": "Sac à Dos", "emoji": "🎒", "slot": "special", "description": "Contenant ; ne prend pas une place à l’intérieur du sac. Capacité totale : 8 objets."}),
  item({"id": "documents-port-bax", "nom": "Documents falsifiés", "emoji": "📜", "slot": "special", "description": "Permis d’entrée et autorisation du §327. Ce ne sont pas des laissez-passer."}),
  item({"id": "liquide-orange", "nom": "Fiole de liquide orange", "emoji": "🧪", "slot": "sac", "tag": "autre", "description": "Trouvée au §262. Le PDF ne précise aucun effet : ne pas inventer un soin."}),
  item({"id": "anneau-or", "nom": "Anneau d’or", "emoji": "💍", "slot": "sac", "tag": "autre", "description": "Article vendu au §283. Ce n’est pas le Sceau d’Hammardal."}),
  /* ---- Armes ---- */
  item({
    id: "hache",
    nom: "Hache",
    emoji: "🪓",
    slot: "arme",
    weapon: "hache",
    description: "La hache de guerre des Seigneurs Kaï. Solide et équilibrée.",
  }),
  item({
    id: "epee",
    nom: "Épée",
    emoji: "🗡️",
    slot: "arme",
    weapon: "epee",
    description: "Une lame droite et fiable, classique chez les gens du Sommerlund.",
  }),
  item({
    id: "epee-courte",
    nom: "Épée Courte",
    emoji: "⚔️",
    slot: "arme",
    weapon: "epee-courte",
    description: "Légère, idéale dans les couloirs étroits.",
  }),
  item({
    id: "poignard",
    nom: "Poignard",
    emoji: "🔪",
    slot: "arme",
    weapon: "poignard",
    description: "Une lame courte, utile quand tout le reste a échoué.",
  }),
  item({
    id: "lance",
    nom: "Lance",
    emoji: "🔱",
    slot: "arme",
    weapon: "lance",
    description: "Portée à la main, pratique contre les cavaliers.",
  }),
  item({
    id: "masse",
    nom: "Masse d'Armes",
    emoji: "🔨",
    slot: "arme",
    weapon: "masse",
    description: "Une tête de fer qui brise les os et les boucliers.",
  }),
  item({
    id: "marteau-de-guerre",
    nom: "Marteau de Guerre",
    emoji: "⚒️",
    slot: "arme",
    weapon: "marteau-de-guerre",
    description: "Lourd, lent, mais redoutable face aux armures.",
  }),
  item({
    id: "baton",
    nom: "Bâton",
    emoji: "🪵",
    slot: "arme",
    weapon: "baton",
    description: "Le bâton des voyageurs, long et noueux.",
  }),
  item({
    id: "glaive",
    nom: "Glaive",
    emoji: "⚔️",
    slot: "arme",
    weapon: "glaive",
    description: "Une longue lame à deux mains, réservée aux combattants aguerris.",
  }),
  item({
    id: "sabre",
    nom: "Sabre",
    emoji: "🗡️",
    slot: "arme",
    weapon: "sabre",
    description: "Une lame courbe qui fend l'air avec un sifflement.",
  }),

  /* ---- Objets de sac à dos ---- */
  item({
    id: "repas",
    nom: "Repas",
    emoji: "🍖",
    slot: "sac",
    tag: "repas",
    description: "Un repas de voyage. Occupe une place dans le Sac à Dos.",
  }),
  item({
    id: "potion-laumspur",
    nom: "Potion de Laumspur",
    emoji: "🧪",
    slot: "sac",
    tag: "potion-laumspur",
    description:
      "Une décoction de laumspur. Rend 4 points d'Endurance si elle est bue à l'issue d'un combat. Une seule dose.",
    effet: { endurance: 4, consommable: true, max: 4 },
  }),
  item({
    id: "potion-guerison",
    nom: "Potion de Guérison",
    emoji: "⚗️",
    slot: "sac",
    tag: "potion-guerison",
    description:
      "Un flacon d'un liquide ambré. Rend 4 points d'Endurance lorsqu'on l'avale après un combat.",
    effet: { endurance: 4, consommable: true, max: 4 },
  }),
  item({
    id: "potion-alether",
    nom: "Potion d'Alether",
    emoji: "🍶",
    slot: "sac",
    tag: "potion-alether",
    description:
      "Le breuvage des guerriers. Ajoute 2 points d'Habileté pour la durée d'un seul combat.",
    effet: { habilete: 2, consommable: true },
  }),
  item({
    id: "corde",
    nom: "Corde",
    emoji: "🪢",
    slot: "sac",
    tag: "corde",
    description: "Une corde solide de plusieurs mètres.",
  }),
  item({
    id: "torche",
    nom: "Torche",
    emoji: "🔥",
    slot: "sac",
    tag: "torche",
    description: "Une torche de résine. Éclaire les lieux sans lumière.",
  }),
  item({
    id: "briquet",
    nom: "Briquet à amadou",
    emoji: "🪥",
    slot: "sac",
    tag: "briquet",
    description: "Un briquet à amadou pour allumer un feu.",
  }),
  item({
    id: "couverture",
    nom: "Couverture",
    emoji: "🧣",
    slot: "sac",
    tag: "couverture",
    description: "Une couverture de laine épaisse pour les nuits froides.",
  }),
  item({
    id: "savon",
    nom: "Savon parfumé",
    emoji: "🧼",
    slot: "sac",
    tag: "savon",
    description: "Une tablette de savon parfumé. Un luxe inattendu.",
  }),
  item({
    id: "message",
    nom: "Message codé",
    emoji: "📜",
    slot: "sac",
    tag: "message",
    description: "Un pli scellé portant l'écriture du Roi.",
  }),
  item({
    id: "canne-peche",
    nom: "Canne à pêche",
    emoji: "🎣",
    slot: "sac",
    tag: "autre",
    description: "Une ligne et un hameçon : de quoi trouver un repas près de l'eau.",
  }),

  /* ---- Objets spéciaux ---- */
  item({
    id: "carte-sommerlund",
    nom: "Carte du Sommerlund",
    emoji: "🗺️",
    slot: "special",
    description:
      "La carte du royaume, remise par vos maîtres. Elle ne compte pas dans le Sac à Dos.",
  }),
  item({
    id: "casque",
    nom: "Casque",
    emoji: "🪖",
    slot: "special",
    description: "Un casque de fer. Ajoute 2 points d'Endurance au total de départ.",
    effet: { endurance: 2, permanent: true },
  }),
  item({
    id: "cotte-mailles",
    nom: "Cotte de Mailles",
    emoji: "🛡️",
    slot: "special",
    description:
      "Une cotte de mailles de belle facture. Ajoute 4 points d'Endurance au total de départ.",
    effet: { endurance: 4, permanent: true },
  }),
  item({
    id: "bouclier",
    nom: "Bouclier",
    emoji: "🛡️",
    slot: "special",
    description:
      "Un bouclier de bois cerclé de fer. Ajoute 2 points d'Habileté lorsque vous l'utilisez au combat.",
    effet: { habilete: 2, permanent: true },
  }),
  item({
    id: "cristal-etoile",
    nom: "Pendentif de l'Étoile de Cristal",
    emoji: "⭐",
    slot: "special",
    description:
      "Le pendentif de l'Étoile de Cristal, porté par le Maître Kaï. Sa lumière vous rappelle le monastère.",
  }),
  item({
    id: "cle-or",
    nom: "Clé d'Or",
    emoji: "🗝️",
    slot: "special",
    description:
      "Une clé d'or marquée du sceau du Sommerlund. Elle ouvre davantage de portes que vous ne l'imaginez.",
  }),
  item({
    id: "cle-argent",
    nom: "Clé d'Argent",
    emoji: "🔑",
    slot: "special",
    description: "Une clé d'argent terni, ramassée dans les mains d'un mort.",
  }),
  item({
    id: "gemme-vordak",
    nom: "Gemme de Vordak",
    emoji: "💎",
    slot: "special",
    description:
      "Une gemme noire pulsant d'une lueur mauvaise. Elle vaut une fortune, mais elle attire l'œil des serviteurs du Roi-Sorcier.",
  }),
  item({
    id: "lance-magique",
    nom: "Lance Magique",
    emoji: "🔱",
    slot: "special",
    description:
      "Lance aux caractères runiques, rangée parmi les Objets Spéciaux (§106, livre 2). Elle blesse les Monstres d’Enfer, sans bonus d’Habileté supplémentaire.",
  }),
  item({
    id: "couronnes-12",
    nom: "12 Pièces d'Or",
    emoji: "🪙",
    slot: "or",
    valeurOr: 12,
    description:
      "Douze Pièces d'Or, à mettre dans la Bourse (50 Pièces d'Or au maximum).",
  }),
  item({
    id: "glaive-sommer",
    nom: "Glaive de Sommer",
    emoji: "🌟",
    slot: "special",
    description:
      "Le Glaive de Sommer, forgé par une race de dieux, fléau des créatures des ténèbres. Il ajoute 8 points d'Habileté (10 avec la Maîtrise de l'Épée) tant qu'il vous accompagne, double les pertes d'Endurance des morts-vivants et annule la magie ennemie. C'est la seule arme capable de tuer un Maître des Ténèbres.",
    effet: { habilete: 8, permanent: true },
  }),
  item({
    id: "sceau-hammardal",
    nom: "Sceau d'Hammardal",
    emoji: "💍",
    slot: "special",
    description:
      "Anneau d’or gravé des armes de Durenor, datant d'Alin le Souverain. Sa présentation ouvre toutes les portes du royaume : sans lui, nul n'accède au Roi Alin IV ni au Glaive de Sommer.",
  }),
  item({
    id: "laissez-passer-blanc",
    nom: "Laissez-passer blanc",
    emoji: "🎫",
    slot: "special",
    description:
      "Laissez-passer de marchand, valable sept jours, délivré dans un bureau de Port Bax contre 10 Pièces d'Or. Il ne donne pas accès à la base navale.",
  }),
  item({
    id: "billet-port-bax",
    nom: "Billet pour Port Bax",
    emoji: "🎟️",
    slot: "special",
    description:
      "Billet de diligence pour Port Bax, acheté 20 Pièces d'Or au relais de Ragadorn.",
  }),
  item({
    id: "carte-durenor",
    nom: "Carte du Durenor",
    emoji: "🗺️",
    slot: "special",
    description:
      "Carte du royaume de Durenor, confiée avec le Sceau d'Hammardal au départ de Holmgard. Elle montre la route de Port Bax et la capitale Hammardal.",
  }),
  item({
    id: "laissez-passer-rouge",
    nom: "Laissez-passer rouge",
    emoji: "🎟️",
    slot: "special",
    description:
      "Laissez-passer prioritaire de la base navale de Port Bax, accordé sur présentation du Sceau d'Hammardal. Il ouvre la porte rouge du poste de garde.",
  }),
];

export const ITEM_BY_ID: Record<string, ItemDef> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i])
);

export function getItem(id: string): ItemDef | undefined {
  return ITEM_BY_ID[id];
}

/* ==================================================================
   TABLE DES COUPS PORTÉS (Combat Results Table)
   Lignes = nombre tiré à la Table de Hasard (0 à 9)
   Colonnes = Quotient d'Attaque
   Chaque case : [Endurance perdue par l'ENNEMI, Endurance perdue par VOUS]
   "K" = mort instantanée.
   ================================================================== */

/** Bornes supérieures des colonnes (Quotient d'Attaque). */
export const COLONNES_QA: { min: number; max: number; label: string }[] = [
  { min: -99, max: -11, label: "≤ -11" },
  { min: -10, max: -9, label: "-10/-9" },
  { min: -8, max: -7, label: "-8/-7" },
  { min: -6, max: -5, label: "-6/-5" },
  { min: -4, max: -3, label: "-4/-3" },
  { min: -2, max: -1, label: "-2/-1" },
  { min: 0, max: 0, label: "0" },
  { min: 1, max: 2, label: "+1/+2" },
  { min: 3, max: 4, label: "+3/+4" },
  { min: 5, max: 6, label: "+5/+6" },
  { min: 7, max: 8, label: "+7/+8" },
  { min: 9, max: 10, label: "+9/+10" },
  { min: 11, max: 99, label: "≥ +11" },
];

export const COUPS_PORTES: [number | "K", number | "K"][][] = [
  /* 0 */ [
    [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [14, 0],
    [16, 0], [18, 0], ["K", 0], ["K", 0], ["K", 0],
  ],
  /* 1 */ [
    [0, "K"], [0, "K"], [0, 8], [0, 6], [1, 6], [2, 5], [3, 5], [4, 5],
    [5, 4], [6, 4], [7, 4], [8, 3], [9, 3],
  ],
  /* 2 */ [
    [0, "K"], [0, 8], [0, 7], [1, 6], [2, 5], [3, 5], [4, 4], [5, 4],
    [6, 3], [7, 3], [8, 3], [9, 3], [10, 2],
  ],
  /* 3 */ [
    [0, 8], [0, 7], [1, 6], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3],
    [7, 3], [8, 3], [9, 2], [10, 2], [11, 2],
  ],
  /* 4 */ [
    [0, 8], [1, 7], [2, 6], [3, 5], [4, 4], [5, 4], [6, 3], [7, 3],
    [8, 2], [9, 2], [10, 2], [11, 2], [12, 2],
  ],
  /* 5 */ [
    [1, 7], [2, 6], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 2],
    [9, 2], [10, 2], [11, 2], [12, 2], [14, 1],
  ],
  /* 6 */ [
    [2, 6], [3, 6], [4, 5], [5, 4], [6, 3], [7, 2], [8, 2], [9, 2],
    [10, 2], [11, 1], [12, 1], [14, 1], [16, 1],
  ],
  /* 7 */ [
    [3, 5], [4, 5], [5, 4], [6, 3], [7, 2], [8, 2], [9, 1], [10, 1],
    [11, 1], [12, 0], [14, 0], [16, 0], [18, 0],
  ],
  /* 8 */ [
    [4, 4], [5, 4], [6, 3], [7, 2], [8, 1], [9, 1], [10, 0], [11, 0],
    [12, 0], [14, 0], [16, 0], [18, 0], ["K", 0],
  ],
  /* 9 */ [
    [5, 3], [6, 3], [7, 2], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0],
    [14, 0], [16, 0], [18, 0], ["K", 0], ["K", 0],
  ],
];

/** Retourne l'index de colonne correspondant à un Quotient d'Attaque. */
export function colonnePourQa(qa: number): number {
  const index = COLONNES_QA.findIndex((c) => qa >= c.min && qa <= c.max);
  return index === -1 ? (qa < -11 ? 0 : 12) : index;
}

/** Résultat de la Table des Coups Portés. */
export function resultatCombat(qa: number, nombre: number): {
  degatsEnnemi: number;
  degatsJoueur: number;
  ennemiTue: boolean;
  joueurTue: boolean;
} {
  const col = colonnePourQa(qa);
  const lig = Math.max(0, Math.min(9, Math.round(nombre)));
  const [e, j] = COUPS_PORTES[lig][col];
  return {
    degatsEnnemi: e === "K" ? 0 : e,
    degatsJoueur: j === "K" ? 0 : j,
    ennemiTue: e === "K",
    joueurTue: j === "K",
  };
}

/* ==================================================================
   LIMITES D'INVENTAIRE
   ================================================================== */

export const LIMITE_SAC = 8;
export const LIMITE_ARMES = 2;
export const LIMITE_COURONNES = 50;

/** Nombre d'Endurance perdu quand on ne peut pas manger de Repas. */
export const PENALITE_REPAS = 3;
