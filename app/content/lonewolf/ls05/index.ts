import type { StoryBook, StorySection } from "../../../lib/lonewolf/types";
import { SECTIONS_001_100 } from "./sections-001-100";
import { SECTIONS_101_200 } from "./sections-101-200";
import { SECTIONS_201_300 } from "./sections-201-300";
import { SECTIONS_301_400 } from "./sections-301-400";

/**
 * Livre 5 — Le Tyran du Désert (Joe Dever / Gary Chalk).
 * Adaptation intégrale des 400 paragraphes de l'édition française Gallimard
 * (regroupement en un seul tome des deux parties originales : §1–200 =
 * première partie, §201–400 = deuxième partie). Traduction de Pascale
 * Jusforgues et Alain Vaulont. Les textes sont importés depuis le PDF par
 * scripts/ls05-importer.cjs (ne pas éditer les sections-*.ts à la main :
 * corriger scripts/ls05-overrides.json puis relancer l'import).
 * Usage privé : les droits commerciaux restent à confirmer
 * (voir content/stories/source-pdfs/README.md).
 */

const toutes: StorySection[] = [
  ...SECTIONS_001_100,
  ...SECTIONS_101_200,
  ...SECTIONS_201_300,
  ...SECTIONS_301_400,
];

export const LS05: StoryBook = {
  slug: "loup-solitaire-05",
  numero: 5,
  titre: "Le Tyran du Désert",
  sousTitre: "Loup Solitaire — Livre 5",
  resume:
    "Envoyé en mission diplomatique à Barrakeesh pour signer un traité de paix avec la Vassagonie, Loup Solitaire tombe dans un piège ourdi par les Seigneurs des Ténèbres. Trahi, pourchassé à travers le désert, il doit s'échapper et retrouver le légendaire Livre du Magnakaï enfoui dans le Tombeau du Majhan pour espérer devenir Grand Maître Kaï.",
  auteur: "Joe Dever · Gary Chalk",
  illustration: "/lonewolf/ls05/couverture.webp",
  orDepartMin: 11,
  orDepartMax: 20,
  // 5 Disciplines Kaï à choisir parmi 10 (Magnakaï, rang d'Initié au départ) ; équipement : carte + bourse + 6 choix.
  objetsDepart: [
    { id: "carte-vassagonie", message: "Carte de la Vassagonie, fournie par l'Armurerie Royale." },
  ],
  tiragesEquipement: 6,
  // Équipement LS05 (règles) : Poignard · Potion de Laumspur · Épée · Lance · 2 Rations · Masse · Bouclier.
  tirageDepart: {
    "0": [{ id: "poignard", optionnel: true }],
    "1": [{ id: "potion-laumspur", optionnel: true }],
    "2": [{ id: "epee", optionnel: true }],
    "3": [{ id: "lance", optionnel: true }],
    "4": [{ id: "repas", quantity: 2, optionnel: true }],
    "5": [{ id: "masse", optionnel: true }],
    "6": [{ id: "bouclier", optionnel: true }],
    "7": [{ id: "repas", quantity: 2, optionnel: true }],
    "8": [{ id: "repas", quantity: 2, optionnel: true }],
    "9": [{ id: "bouclier", optionnel: true }],
  },
  sections: Object.fromEntries(toutes.map((s) => [s.id, s])),
};

export const LS05_SECTIONS = toutes;
