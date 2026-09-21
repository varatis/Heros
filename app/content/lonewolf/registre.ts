import type { StoryBook } from "../../lib/lonewolf/types";
import { LS01 } from "./ls01";
import { LS02 } from "./ls02";
import { LS03 } from "./ls03";
import { LS04 } from "./ls04";
import { LS05 } from "./ls05";

/**
 * Registre des livres jouables. La sauvegarde étant unique, la partie en
 * cours référence son livre par `bookSlug` : ajouter un tome ici le rend
 * disponible à la création et à la reprise.
 */
export const LIVRES: Record<string, StoryBook> = {
  [LS01.slug]: LS01,
  [LS02.slug]: LS02,
  [LS03.slug]: LS03,
  [LS04.slug]: LS04,
  [LS05.slug]: LS05,
};

export const LISTE_LIVRES: StoryBook[] = [LS01, LS02, LS03, LS04, LS05];

/** Retrouve un livre par slug (repli : Tome 1, pour les vieilles sauvegardes). */
export function livreParSlug(slug: string | undefined | null): StoryBook {
  if (slug && LIVRES[slug]) return LIVRES[slug];
  return LS01;
}
