import type { StoryBook, StorySection } from "../../../lib/lonewolf/types";
import { SECTIONS_001_89 } from "./sections-001-089";
import { SECTIONS_090_179 } from "./sections-090-179";
import { SECTIONS_180_269 } from "./sections-180-269";
import { SECTIONS_270_350 } from "./sections-270-350";
import { SECTIONS_SUPP } from "./sections-supp";

/**
 * Livre 3 — Les Grottes de Kalte (Joe Dever / Gary Chalk).
 * Adaptation intégrale des 350 paragraphes de l'édition Gallimard
 * Jeunesse, traduction Camille Fabien. Textes importés depuis le PDF
 * par scripts/ls03-importer.cjs — ne pas éditer les sections-*.ts à la
 * main : corriger ls03-overrides.json puis relancer l'import.
 */

const toutes: StorySection[] = [
  ...SECTIONS_001_89,
  ...SECTIONS_090_179,
  ...SECTIONS_180_269,
  ...SECTIONS_270_350,
  ...(typeof SECTIONS_SUPP !== "undefined" ? SECTIONS_SUPP : []),
];

export const LS03: StoryBook = {
  slug: "loup-solitaire-03",
  numero: 3,
  titre: "Les Grottes de Kalte",
  sousTitre: "Loup Solitaire — Livre 3",
  resume:
    "Trahi par Vonotar, le Brumalmarc est mort. Le traître règne désormais sur Ikaya, la Forteresse de Glace. Vous devez traverser la banquise de Liouk, survivre aux Languabarbs, aux Bakanals et aux Loups Maudits, pénétrer les Grottes de Kalte et capturer Vonotar avant que le Cardonal ne soit pris par les glaces.",
  auteur: "Joe Dever · Gary Chalk",
  illustration: "/lonewolf/ls03/p001.webp",
  orDepartMin: 10,
  orDepartMax: 19,
  objetsDepart: [
    { id: "carte-sommerlund", message: "Carte de Kalte fournie avec l'équipement polaire." },
  ],
  tiragesEquipement: 2,
  tirageDepart: {
    "0": [{ id: "glaive", optionnel: true }],
    "1": [{ id: "epee", optionnel: true }],
    "2": [{ id: "sabre", optionnel: true }],
    "3": [{ id: "gilet-cuir-matelasse", optionnel: true }],
    "4": [{ id: "lance", optionnel: true }],
    "5": [{ id: "masse", optionnel: true }],
    "6": [{ id: "marteau-de-guerre", optionnel: true }],
    "7": [{ id: "hache", optionnel: true }],
    "8": [{ id: "potion-laumspur", optionnel: true }],
    "9": [{ id: "baton", optionnel: true }],
  },
  sections: Object.fromEntries(toutes.map((s) => [s.id, s])),
};

/** Version tableau pour outils de vérification */
export const LS03_SECTIONS = toutes;
