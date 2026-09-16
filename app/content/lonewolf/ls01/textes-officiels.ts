import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Textes officiels des paragraphes.
 * --------------------------------
 * Fichier généré par :  node scripts/importer-texte.cjs <fichier.txt>
 * Ne pas éditer à la main : relance le script après correction du fichier source.
 *
 * Tant que ce fichier est vide, l'application affiche les textes d'adaptation
 * écrits dans content/lonewolf/ls01/sections-*.ts. Les IDs sont ceux de
 * l’adaptation, pas une correspondance validée avec les 350 paragraphes du PDF.
 */
export const TEXTES_OFFICIELS: Record<string, string> = {};

/** Applique les textes importés (s'ils existent) sur les sections du graphe. */
export function avecTextes(sections: StorySection[]): StorySection[] {
  if (Object.keys(TEXTES_OFFICIELS).length === 0) return sections;
  return sections.map((s) => {
    const texte = TEXTES_OFFICIELLES_SAFE(s.id);
    return texte && texte.trim().length > 0 ? { ...s, texte } : s;
  });
}

function TEXTES_OFFICIELLES_SAFE(id: string): string | undefined {
  return TEXTES_OFFICIELS[id];
}
