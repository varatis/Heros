import type { StoryBook, StorySection } from "../../../lib/lonewolf/types";
import { SECTIONS_MONASTERE } from "./sections-monastere";
import { SECTIONS_ROUTE } from "./sections-route";
import { SECTIONS_HOLMGARD } from "./sections-holmgard";
import { avecTextes } from "./textes-officiels";

/**
 * LOUP SOLITAIRE — Livre 1 : LES MAÎTRES DES TÉNÈBRES
 * ------------------------------------------------
 * Adaptation française pour l'application. Mêmes lieux, mêmes personnages,
 * mêmes ennemis (avec leurs Habileté / Endurance d'origine), mêmes objets et
 * mêmes règles de jeu que le livre-jeu de Joe Dever.
 *
 * Le texte est écrit pour HeroBook ; il reprend la trame et les numéros de
 * paragraphes du livre original afin qu'un futur import du texte officiel
 * (fourni par l'éditeur/détenteur des droits) se fasse par simple
 * remplacement, section par section.
 */

const toutes: StorySection[] = avecTextes([
  ...SECTIONS_MONASTERE,
  ...SECTIONS_ROUTE,
  ...SECTIONS_HOLMGARD,
]);

export const LS01: StoryBook = {
  slug: "loup-solitaire-01",
  numero: 1,
  titre: "Les Maîtres des Ténèbres",
  sousTitre: "Loup Solitaire — Livre 1",
  resume:
    "Le monastère Kaï a été anéanti durant la nuit. Vous êtes le dernier des Seigneurs Kaï du Sommerlund. Trois cents kilomètres de forêts, de routes encombrées de réfugiés et de terres conquises vous séparent du Roi, à Holmgard. Vous devez y arriver avant l'armée du Roi-Sorcier.",
  auteur: "D'après l'univers de Joe Dever",
  illustration: "/lonewolf/couverture.jpg",
  armeDepart: "hache",
  orDepartMin: 1,
  orDepartMax: 10,
  objetsDepart: [
    { id: "repas" },
    { id: "carte-sommerlund" },
  ],
  /**
   * Tirage de l'objet trouvé au monastère (Table de Hasard) :
   * 1 = Épée · 2 = Casque · 3 = 2 Repas · 4 = Cotte de Mailles · 5 = Masse d'Armes
   * 6 = Potion de Guérison · 7 = Bâton · 8 = Lance · 9 = 12 Pièces d'Or · 0 = Glaive
   */
  tirageDepart: {
    "0": [{ id: "glaive", optionnel: true }],
    "1": [{ id: "epee", optionnel: true }],
    "2": [{ id: "casque", optionnel: true }],
    "3": [{ id: "repas", quantity: 2, optionnel: true }],
    "4": [{ id: "cotte-mailles", optionnel: true }],
    "5": [{ id: "masse", optionnel: true }],
    "6": [{ id: "potion-guerison", optionnel: true }],
    "7": [{ id: "baton", optionnel: true }],
    "8": [{ id: "lance", optionnel: true }],
    "9": [{ id: "couronnes-12", optionnel: true }],
  },
  sections: Object.fromEntries(toutes.map((s) => [s.id, s])),
};

/** Version tableau, pratique pour les outils de vérification. */
export const LS01_SECTIONS = toutes;

/** Découpage en chapitres pour l'affichage. */
export const LS01_CHAPITRES = [
  {
    titre: "I. La nuit du monastère Kaï",
    image: "/lonewolf/monastere-en-feu.jpg",
    sections: SECTIONS_MONASTERE.map((s) => s.id),
  },
  {
    titre: "II. La route de Toran",
    image: "/lonewolf/route-toran.jpg",
    sections: SECTIONS_ROUTE.map((s) => s.id),
  },
  {
    titre: "III. Holmgard",
    image: "/lonewolf/finale.jpg",
    sections: SECTIONS_HOLMGARD.map((s) => s.id),
  },
];
