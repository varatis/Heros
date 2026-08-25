export type SealId =
  | "lantern"
  | "quill"
  | "compass"
  | "key"
  | "moon"
  | "flame"
  | "star"
  | "oak";

export type SealUnlock = {
  type: "starter" | "stories_completed";
  count?: number;
};

export type ReaderSealDef = {
  id: SealId;
  name: string;
  tagline: string;
  unlock: SealUnlock;
};

export const SEAL_PREFIX = "seal:";

export const READER_SEALS: ReaderSealDef[] = [
  {
    id: "lantern",
    name: "Lanterne",
    tagline: "Pour ceux qui lisent trop tard.",
    unlock: { type: "starter" },
  },
  {
    id: "quill",
    name: "Plume",
    tagline: "Pour ceux qui relisent les phrases.",
    unlock: { type: "starter" },
  },
  {
    id: "compass",
    name: "Boussole",
    tagline: "Pour ceux qui veulent se perdre.",
    unlock: { type: "starter" },
  },
  {
    id: "key",
    name: "Clé",
    tagline: "Pour ceux qui ouvrent chaque porte.",
    unlock: { type: "starter" },
  },
  {
    id: "moon",
    name: "Lune",
    tagline: "Pour ceux qui aiment l’ombre des livres.",
    unlock: { type: "starter" },
  },
  {
    id: "flame",
    name: "Flamme",
    tagline: "Pour ceux que l’histoire brûle encore.",
    unlock: { type: "starter" },
  },
  {
    id: "star",
    name: "Étoile",
    tagline: "Offerte à qui termine un premier livre.",
    unlock: { type: "stories_completed", count: 1 },
  },
  {
    id: "oak",
    name: "Chêne",
    tagline: "Réservé à qui en a fini trois.",
    unlock: { type: "stories_completed", count: 3 },
  },
];

export const STARTER_SEALS = READER_SEALS.filter((s) => s.unlock.type === "starter");

export function encodeSeal(id: SealId): string {
  return `${SEAL_PREFIX}${id}`;
}

export function parseSealId(value: string | null | undefined): SealId | null {
  if (!value) return null;
  if (value.startsWith(SEAL_PREFIX)) {
    const id = value.slice(SEAL_PREFIX.length) as SealId;
    return READER_SEALS.some((s) => s.id === id) ? id : null;
  }
  return null;
}

export function getSeal(id: SealId | null | undefined): ReaderSealDef {
  return READER_SEALS.find((s) => s.id === id) ?? READER_SEALS[0];
}

export function getSealFromAvatar(avatarUrl: string | null | undefined): ReaderSealDef {
  return getSeal(parseSealId(avatarUrl));
}

export function isSealUnlocked(seal: ReaderSealDef, completedStories: number): boolean {
  if (seal.unlock.type === "starter") return true;
  return completedStories >= (seal.unlock.count ?? 0);
}

export function unlockHint(seal: ReaderSealDef): string | null {
  if (seal.unlock.type === "starter") return null;
  const n = seal.unlock.count ?? 1;
  return n === 1 ? "Terminez 1 livre" : `Terminez ${n} livres`;
}

const PLACEHOLDER_NAME = /^Héros_[a-f0-9]{6}$/i;

export function isPlaceholderUsername(name: string | null | undefined): boolean {
  if (!name) return true;
  return PLACEHOLDER_NAME.test(name.trim());
}
