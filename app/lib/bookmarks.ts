export interface Bookmark {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  lore: string;
  tagline: string;
  rarity: "Héritage Kaï" | "Guerre Ancestrale" | "Arcanes Noires" | "Esprit de la Sylve" | "Céleste" | "Terres Maudites";
  ribbonGradient: string;
  accentColor: string;
  glowColor: string;
  sealSymbol: "sun" | "dragon" | "crow" | "tree" | "star" | "claw";
  iconEmoji: string;
}

export const BOOKMARKS: Bookmark[] = [
  {
    id: "kai-sun",
    name: "Le Signet d'Argent de Kaï",
    title: "Soleil du Sommerlund",
    subtitle: "Tressé de soie d'argent sous la bénédiction des Seigneurs Kaï",
    lore: "Remis aux novices du monastère Kaï avant les nuits d'épreuve dans les bois de Durncrag. Son médaillon solaire en or repousse le doute et protège l'esprit du lecteur des ténèbres.",
    tagline: "« Que le soleil guide votre lame et éclaire chaque page de votre destin. »",
    rarity: "Héritage Kaï",
    ribbonGradient: "linear-gradient(180deg, #dfbb78 0%, #b88628 50%, #68480d 100%)",
    accentColor: "#dfbb78",
    glowColor: "rgba(223, 187, 120, 0.4)",
    sealSymbol: "sun",
    iconEmoji: "☀️",
  },
  {
    id: "crimson-dragon",
    name: "Le Ruban de Sang Pourpre",
    title: "Sceau du Wyrm Écarlate",
    subtitle: "Velours cramoisi épais portant l'empreinte d'un dragon antique",
    lore: "Trempé dans la cire des cryptes impériales et frappé aux armes des guerriers déchus. Il retient la mémoire ardente des batailles épiques et des victoires chèrement acquises.",
    tagline: "« Par le fer et par le sang, aucune page ne restera vierge de gloire. »",
    rarity: "Guerre Ancestrale",
    ribbonGradient: "linear-gradient(180deg, #b91c1c 0%, #881337 50%, #450a0a 100%)",
    accentColor: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.4)",
    sealSymbol: "dragon",
    iconEmoji: "🐉",
  },
  {
    id: "obsidian-crow",
    name: "La Plume de Corbeau d'Obsidienne",
    title: "Messager des Brumes Nocturnes",
    subtitle: "Plume de nuit lustrée terminée par une pointe de pierre volcanique",
    lore: "Les messagers de la forêt murmurante la laissaient glisser entre les tomes interdits. Ses runes gravées dans l'obsidienne murmurent à l'oreille du lecteur attentif les embûches à venir.",
    tagline: "« Les ombres ne mentent jamais à qui sait lire leur silence. »",
    rarity: "Arcanes Noires",
    ribbonGradient: "linear-gradient(180deg, #334155 0%, #0f172a 60%, #020617 100%)",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.35)",
    sealSymbol: "crow",
    iconEmoji: "🪶",
  },
  {
    id: "elderwood-rune",
    name: "L'Écorce d'If Sylvestre",
    title: "Esprit de la Forêt Millénaire",
    subtitle: "Fine lamelle de bois sacré imprégnée d'une luminescence végétale",
    lore: "Façonnée dans le cœur d'un if millénaire enraciné au carrefour des ley-lines. Ses nervures émeraude scintillent doucement au crépuscule pour guider le voyageur solitaire.",
    tagline: "« La forêt retient ton souffle et veille sur chacun de tes choix. »",
    rarity: "Esprit de la Sylve",
    ribbonGradient: "linear-gradient(180deg, #059669 0%, #064e3b 60%, #022c22 100%)",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    sealSymbol: "tree",
    iconEmoji: "🌿",
  },
  {
    id: "astral-star",
    name: "Le Fil d'Or Astral",
    title: "Constellation Céleste",
    subtitle: "Soie de minuit ornée d'un croissant d'argent et de poussière stellaire",
    lore: "Confectionné pour les mages arpentant les Terres Obscures. Sous la lueur des constellations, ce marque-page révèle les passages secrets dissimulés entre les lignes du destin.",
    tagline: "« Même au cœur de la nuit sans lune, les étoiles tracent la route. »",
    rarity: "Céleste",
    ribbonGradient: "linear-gradient(180deg, #7c3aed 0%, #4c1d95 60%, #1e1b4b 100%)",
    accentColor: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.4)",
    sealSymbol: "star",
    iconEmoji: "✨",
  },
  {
    id: "wyrm-fang",
    name: "La Griffe Cendrée du Gouffre",
    title: "Talisman de Braise",
    subtitle: "Fragment d'os poli retenu par un lacet de cuir de bête nocturne",
    lore: "Forgé dans les feux souterrains de Kazan-Gor et poli avec les cendres de créatures des abysses. Il porte la marque des survivants qui n'ont jamais tremblé devant l'inconnu.",
    tagline: "« Ne crains ni les crocs de la bête ni le gouffre qui t'attend. »",
    rarity: "Terres Maudites",
    ribbonGradient: "linear-gradient(180deg, #c2410c 0%, #7c2d12 60%, #292524 100%)",
    accentColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.4)",
    sealSymbol: "claw",
    iconEmoji: "🦴",
  },
];

export function getAllBookmarks(): Bookmark[] {
  return BOOKMARKS;
}

export function getBookmarkById(id: string | null | undefined): Bookmark {
  if (!id) return BOOKMARKS[0];
  const found = BOOKMARKS.find((b) => b.id === id);
  return found ?? BOOKMARKS[0];
}

export const FANTASY_HERO_NAMES = [
  "Sombrelame",
  "Vaelin Ombresort",
  "Aldric de Sommerlund",
  "Kaelen le Rôdeur",
  "Rowan Sylvebrume",
  "Théron Vent-d'Acier",
  "Morrigan Noir-Ébène",
  "Eldrin Cendre-Loup",
  "Lyra Sombreflamme",
  "Darian Brisecroc",
  "Gildas Clair-de-Lune",
  "Sylas Garde-Nuit",
];

export function getRandomHeroName(): string {
  const idx = Math.floor(Math.random() * FANTASY_HERO_NAMES.length);
  return FANTASY_HERO_NAMES[idx];
}
