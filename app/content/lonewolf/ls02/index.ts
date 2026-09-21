import type { StoryBook, StorySection } from "../../../lib/lonewolf/types";
import { SECTIONS_001_89 } from "./sections-001-089";
import { SECTIONS_090_179 } from "./sections-090-179";
import { SECTIONS_180_269 } from "./sections-180-269";
import { SECTIONS_270_350 } from "./sections-270-350";

/**
 * Livre 2 — La Traversée Infernale (Joe Dever / Gary Chalk).
 * Adaptation intégrale des 350 paragraphes de l'édition Gallimard
 * Jeunesse (Folio Junior), traduction Camille Fabien. Les textes sont
 * importés depuis le PDF par scripts/ls02-importer.cjs (ne pas éditer
 * les sections-*.ts à la main : corriger ls02-overrides.json).
 * Usage privé : les droits commerciaux restent à confirmer
 * (voir content/stories/source-pdfs/README.md).
 */

/** Portraits de la planche p.141 (Ganon, Dorier, Halvorc, Parsion, Viveka). */
export const PORTRAITS_ENNEMIS_LS02: Record<string, { src: string; label: string }> = {
  "Dorier et Ganon": {
    src: "/lonewolf/ls02/p141-freres.webp",
    label: "Dorier et Ganon, Chevaliers de la Montagne Blanche (planche p.141)",
  },
  Halvorc: {
    src: "/lonewolf/ls02/p141-halvorc.webp",
    label: "Halvorc, le marchand (planche p.141)",
  },
  Viveka: {
    src: "/lonewolf/ls02/p141-viveka.webp",
    label: "Viveka, l'aventurière (planche p.141)",
  },
};

const toutes: StorySection[] = [
  ...SECTIONS_001_89,
  ...SECTIONS_090_179,
  ...SECTIONS_180_269,
  ...SECTIONS_270_350,
].map((section) => ({
  ...section,
  combat: section.combat
    ? {
        ...section.combat,
        image:
          section.combat.image ??
          PORTRAITS_ENNEMIS_LS02[section.combat.nom]?.src,
      }
    : undefined,
}));

export const LS02: StoryBook = {
  slug: "loup-solitaire-02",
  numero: 2,
  titre: "La Traversée Infernale",
  sousTitre: "Loup Solitaire — Livre 2",
  resume:
    "Porteur du Sceau d'Hammardal, vous avez quarante jours pour rejoindre le royaume de Durenor, obtenir le Glaive de Sommer et ramener des secours à Holmgard, assiégée par les armées des Maîtres des Ténèbres.",
  auteur: "Joe Dever · Gary Chalk",
  illustration: "/lonewolf/ls02/p001-x5.webp",
  // Le Tome 2 ne donne aucune arme au départ : Épée, Sabre, Masse, Lance,
  // Glaive ou Bâton font partie des deux objets à choisir à la création.
  orDepartMin: 10,
  orDepartMax: 19,
  objetsDepart: [
    { id: "sceau-hammardal", message: "Le Sceau d'Hammardal, gage de votre mission." },
    { id: "carte-durenor", message: "La carte du royaume de Durenor." },
    { id: "sac-a-dos" },
  ],
  /**
   * Deux objets à choisir parmi : Épée · Sabre · 2 Repas · Cotte de Mailles ·
   * Masse d'Armes · Potion de Guérison · Bâton · Lance · Glaive · Bouclier.
   * Les clés 0–9 identifient les options de l’interface ; ce ne sont pas
   * des tirages aléatoires. Le joueur choisit deux objets (PDF p.14–15).
   */
  tiragesEquipement: 2,
  tirageDepart: {
    "0": [{ id: "bouclier", optionnel: true }],
    "1": [{ id: "epee", optionnel: true }],
    "2": [{ id: "sabre", optionnel: true }],
    "3": [{ id: "repas", quantity: 2, optionnel: true }],
    "4": [{ id: "cotte-mailles", optionnel: true }],
    "5": [{ id: "masse", optionnel: true }],
    "6": [{ id: "potion-guerison", optionnel: true }],
    "7": [{ id: "baton", optionnel: true }],
    "8": [{ id: "lance", optionnel: true }],
    "9": [{ id: "glaive", optionnel: true }],
  },
  sections: Object.fromEntries(toutes.map((s) => [s.id, s])),
};

/** Version tableau, pratique pour les outils de vérification. */
export const LS02_SECTIONS = toutes;
