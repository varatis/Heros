import type { StoryBook, StorySection } from "../../../lib/lonewolf/types";
import { SECTIONS_001_89 } from "./sections-001-089";
import { SECTIONS_090_179 } from "./sections-090-179";
import { SECTIONS_180_269 } from "./sections-180-269";
import { SECTIONS_270_350 } from "./sections-270-350";

/**
 * Livre 4 — Le Gouffre Maudit (Joe Dever / Gary Chalk).
 * Adaptation intégrale des 350 paragraphes de l'édition Gallimard
 * Jeunesse (Folio Junior), traduction Camille Fabien. Les textes sont
 * importés depuis le PDF par scripts/ls04-importer.cjs (ne pas éditer
 * les sections-*.ts à la main : corriger ls04-overrides.json).
 * Usage privé : les droits commerciaux restent à confirmer
 * (voir content/stories/source-pdfs/README.md).
 */

const toutes: StorySection[] = [
  ...SECTIONS_001_89,
  ...SECTIONS_090_179,
  ...SECTIONS_180_269,
  ...SECTIONS_270_350,
];

export const LS04: StoryBook = {
  slug: "loup-solitaire-04",
  numero: 4,
  titre: "Le Gouffre Maudit",
  sousTitre: "Loup Solitaire — Livre 4",
  resume:
    "Le convoi d'or de Ruanon et la troupe du capitaine Gayal ont disparu. À la tête de cinquante éclaireurs d'élite, vous devez traverser la Contrée des Pillards, retrouver la province minière et percer le secret du Gouffre Maudit où Vashna, le plus puissant des Maîtres des Ténèbres, attend son heure.",
  auteur: "Joe Dever · Gary Chalk",
  illustration: "/lonewolf/ls04/couverture.webp",
  orDepartMin: 10,
  orDepartMax: 19,
  objetsDepart: [
    { id: "carte-sommerlund", message: "Carte de la Vassagonie, fournie par l'Armurerie Royale." },
  ],
  /**
   * Jusqu'à 6 objets parmi : Poignard · Potion de Laumspur · Épée · Lance ·
   * 2 Rations Spéciales · Masse d'Armes · Bouclier.
   * L'app les tire à la Table de Hasard pour proposer 6 choix parmi 8 ?
   * En pratique, on propose le tirage officiel LS04 :
   * 0 = Poignard · 1 = Potion Laumspur · 2 = Épée · 3 = Lance ·
   * 4 = 2 Repas · 5 = Masse · 6 = Bouclier · 7 = (re-tirage) · 8/9 = 2 Repas.
   * Simplifié ici en 6 tirages optionnels.
   */
  tiragesEquipement: 6,
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

/** Version tableau, pratique pour les outils de vérification. */
export const LS04_SECTIONS = toutes;
