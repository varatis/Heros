/** Verified against the supplied 175-page PDF. PDF sections ≠ adaptation IDs. */
export interface SceneIllustration {
  id: string;
  src: string;
  label: string;
  origin: "pdf-colorized" | "pdf-original";
  original: string;
  pdfPage: number;
  pdfSection?: number;
  width: number;
  height: number;
}

const original = (file: string) => `/lonewolf/pdf/originals/${file}`;
const colored = (id: string) => `/lonewolf/pdf/colored/${id}.png`;
function plate(
  id: string,
  label: string,
  file: string,
  pdfPage: number,
  pdfSection: number | undefined,
  width: number,
  height: number,
): SceneIllustration {
  return {
    id,
    label,
    src: colored(id),
    origin: "pdf-colorized",
    original: original(file),
    pdfPage,
    pdfSection,
    width,
    height,
  };
}

export const SCENE_ILLUSTRATIONS: SceneIllustration[] = [
  {
    id: "couverture",
    label: "Couverture de l’édition fournie",
    src: original("p001-x4.png"),
    original: original("p001-x4.png"),
    origin: "pdf-original",
    pdfPage: 1,
    width: 637,
    height: 1049,
  },
  {
    id: "carte",
    label: "Carte du Sommerlund",
    src: original("p002-x12.png"),
    original: original("p002-x12.png"),
    origin: "pdf-original",
    pdfPage: 2,
    width: 575,
    height: 801,
  },
  plate(
    "parchemin-kai",
    "Le parchemin d’initiation aux disciplines Kaï",
    "p007-x32.png",
    7,
    undefined,
    486,
    812,
  ),
  plate(
    "holmgard",
    "Les murs de la citadelle de Holmgard",
    "p029-x113.png",
    29,
    7,
    470,
    774,
  ),
  plate(
    "crypte",
    "La porte sculptée de la chambre mortuaire",
    "p035-x159.png",
    35,
    23,
    464,
    770,
  ),
  plate(
    "kraan",
    "Un Kraan et son cavalier en piqué",
    "p040-x189.png",
    40,
    34,
    457,
    770,
  ),
  plate(
    "gloks",
    "Le chef des Gloks, un archer et un Loup Maudit",
    "p043-x205.png",
    43,
    41,
    475,
    775,
  ),
  plate(
    "mur-rondas",
    "Le mur de rondins écroulé",
    "p047-x233.png",
    47,
    51,
    499,
    782,
  ),
  plate(
    "vieil-homme",
    "Le vieil homme fou qui vous insulte",
    "p053-x269.png",
    53,
    63,
    467,
    780,
  ),
  plate(
    "gourgaz",
    "Le Gourgaz brandissant sa Hache Noire",
    "p066-x357.png",
    66,
    97,
    464,
    780,
  ),
  plate(
    "vordak",
    "Le Vordak sous son capuchon, avec le corbeau",
    "p076-x423.png",
    76,
    121,
    472,
    776,
  ),
  plate(
    "banedon",
    "Banedon, jeune magicien à la robe étoilée",
    "p081-x450.png",
    81,
    131,
    473,
    766,
  ),
  plate(
    "herboriste",
    "L’herboriste et son choix de potions",
    "p090-x506.png",
    90,
    152,
    517,
    768,
  ),
  plate(
    "gluatre",
    "Le Gluâtre des Profondeurs et ses tentacules",
    "p099-x553.png",
    99,
    170,
    462,
    764,
  ),
  plate(
    "roulotte",
    "La roulotte tirée par six chevaux",
    "p110-x627.png",
    110,
    200,
    469,
    772,
  ),
  plate(
    "homme-herbes",
    "L’homme à la coupe d’herbes",
    "p115-x659.png",
    115,
    212,
    444,
    764,
  ),
  plate(
    "drakkarim",
    "Le Drakkarim au masque de crâne",
    "p126-x731.png",
    126,
    246,
    473,
    758,
  ),
  plate(
    "message-sac",
    "Le message runique sur une peau d’animal",
    "p135-x789.png",
    135,
    267,
    502,
    784,
  ),
  plate(
    "cimetiere",
    "Le Cimetière des Anciens",
    "p143-x833.png",
    143,
    284,
    463,
    757,
  ),
  plate(
    "ermite",
    "L’ermite recroquevillé dans son coin",
    "p151-x878.png",
    151,
    307,
    470,
    764,
  ),
  plate(
    "roi-ulnar",
    "Le Roi Ulnar et ses capitaines",
    "p172-x984.png",
    172,
    350,
    466,
    775,
  ),
];

export const BOOK_COVER = original("p001-x4.png");
export function sceneForSource(src: string | undefined) {
  return SCENE_ILLUSTRATIONS.find((scene) => scene.src === src);
}

export interface FighterIllustration {
  name: string;
  src?: string;
  source?: string;
  note: string;
}
const portrait = (id: string) => `/lonewolf/portraits/${id}.webp`;
export const HERO_PORTRAIT: FighterIllustration = {
  name: "Loup Solitaire",
  src: portrait("loup-solitaire"),
  source: BOOK_COVER,
  note: "Emblème du loup, extrait de la couverture (p. 1). Ce n’est pas un portrait humain du héros.",
};

/** Keep EnemyDef keys stable for saves; never substitute an unrelated creature. */
export const ENEMY_PORTRAITS: Record<string, FighterIllustration> = {
  Giak: {
    name: "Giak",
    src: portrait("giak"),
    source: colored("gloks"),
    note: "Glok du PDF, p. 43 · §41. Le jeu emploie le nom Giak.",
  },
  "Giaks de la confrérie": {
    name: "Giaks de la confrérie",
    src: portrait("giaks"),
    source: colored("gloks"),
    note: "Les Gloks de la planche p. 43 · §41 ; la scène de confrérie appartient à l’adaptation.",
  },
  "Gluatre des profondeurs": {
    name: "Gluatre des profondeurs",
    src: portrait("gluatre"),
    source: colored("gluatre"),
    note: "Gluâtre des Profondeurs, p. 99 · §170.",
  },
  "Loup Maudit": {
    name: "Loup Maudit",
    src: portrait("loup-maudit"),
    source: colored("gloks"),
    note: "Le Loup Maudit à gauche de la planche p. 43 · §41.",
  },
  Gourgaz: {
    name: "Gourgaz",
    src: portrait("gourgaz"),
    source: colored("gourgaz"),
    note: "Gourgaz, p. 66 · §97 ; combat du livre au §255.",
  },
  Vordak: {
    name: "Vordak",
    src: portrait("vordak"),
    source: colored("vordak"),
    note: "Silhouette de dos, p. 76 · §121. Identité révélée au §283 : aucun visage inventé.",
  },
  Kraan: {
    name: "Kraan",
    src: portrait("kraan"),
    source: colored("kraan"),
    note: "Kraan avec son cavalier, p. 40 · §34.",
  },
  "Meute de Loups Maudits": {
    name: "Meute de Loups Maudits",
    src: portrait("loup-maudit"),
    source: colored("gloks"),
    note: "Un représentant de l’espèce (p. 43 · §41), pas une illustration de deux loups.",
  },
  "Rejeton de crypte": {
    name: "Rejeton de crypte",
    note: "Gardien ajouté par l’adaptation. Aucun dessin identifié dans ce PDF ; le Kakarmi et le Drakkarim ne sont pas des substituts.",
  },
  "Assassin du Roi-Sorcier": {
    name: "Assassin du Roi-Sorcier",
    note: "Rencontre ajoutée au §352 de l’adaptation. Le livre source s’arrête au §350 ; aucun dessin correspondant identifié.",
  },
};

/** Exact object miniatures; unmatched/special variants keep a category icon. */
export const ITEM_ILLUSTRATIONS: Record<string, string> = {
  lance: colored("lance"),
  masse: colored("masse"),
  sabre: colored("sabre"),
  "marteau-de-guerre": colored("marteau-de-guerre"),
  epee: colored("epee"),
  hache: colored("hache"),
  baton: colored("baton"),
  glaive: colored("glaive"),
  casque: colored("casque"),
  repas: colored("repas"),
  "cotte-mailles": colored("cotte-mailles"),
  "potion-guerison": colored("potion"),
  "carte-sommerlund": original("p002-x12.png"),
};
