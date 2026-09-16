import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Livre 1 — Les Maîtres des Ténèbres
 * Chapitre III : Le palais de Holmgard et les dénouements
 */
export const SECTIONS_HOLMGARD: StorySection[] = [
  {
    id: "318",
    titre: "La salle du Roi",
    image: "/lonewolf/pdf/colored/roi-ulnar.png",
    texte:
      "Le palais de Holmgard est une fourmilière : officiers, messagers, prêtres et guérisseurs se croisent dans les escaliers. On vous conduit dans la grande salle, où le Roi Ulnar de Sommerlund, encore en armure, écoute ses généraux autour d'une carte immense.\n\nQuand vous entrez, un silence pesant tombe. Le vieux Roi vous regarde — la hache maculée de sang, la tunique déchirée, l'étoile d'argent à votre cou — et son visage se décompose avant même que vous n'ayez parlé.\n\n« Les Seigneurs Kaï… ? » demande-t-il.\n\nC'est le moment. Tout ce que vous allez dire décidera peut-être de l'avenir du Sommerlund.",
    choix: [
      {
        texte:
          "Tout raconter, du monastère en flammes jusqu'à la route de Toran",
        vers: "350",
      },
      {
        texte:
          "Remettre au Roi le pendentif de Banedon et la Clé d'Or du Premier Roi (Objets Spéciaux requis)",
        vers: "351",
        requis: { special: "cristal-etoile", objet: "cle-or" },
        montreToujours: true,
      },
      {
        texte:
          "Vous tenir à l'écart : la gemme du Vordak, dans votre sac, chuchote des choses (Gemme de Vordak)",
        vers: "352",
        requis: { special: "gemme-vordak" },
        montreToujours: true,
      },
    ],
  },
  {
    id: "352",
    titre: "Le regard de la gemme",
    texte:
      "Vous reculez d'un pas. La gemme noire pulse contre votre flanc, de plus en plus vite, comme un cœur. Autour de vous, les conversations s'arrêtent : les flammes des chandelles s'inclinent toutes dans votre direction.\n\nUn craquement sec au plafond, et une forme noire tombe au milieu de la salle, épée au poing. Ce n'est pas un Giak : c'est un assassin du Roi-Sorcier, venu reprendre ce qu'on lui a volé — et tuer le dernier témoin du massacre.",
    combat: {
      nom: "Assassin du Roi-Sorcier",
      habilete: 16,
      endurance: 20,
      immunisePsychique: true,
      emoji: "🗡️",
      description:
        "Un tueur envoyé pour récupérer la gemme. Il frappe vite et sans un mot.",
    },
    suite: "350",
  },
  {
    id: "350",
    titre: "Le Serment de Sommerlund",
    image: "/lonewolf/pdf/colored/roi-ulnar.png",
    texte:
      "Vous parlez. Du dortoir en flammes, des Maîtres massacrés dans leur sommeil, de la mine où Banedon a failli mourir, de la route de Toran et de ses enfants dans le fossé. Le Roi Ulnar vous écoute sans vous interrompre, les mains crispées sur le pommeau de son épée.\n\nQuand vous avez terminé, un long silence traverse la salle. Puis le vieux Roi se lève, et devant toute sa cour, il dit d'une voix qui porte jusqu'aux voûtes :\n\n« Le Sommerlund est orphelin de ses Seigneurs Kaï. Mais il est resté un disciple — un disciple qui a traversé trois cents kilomètres de pays conquis pour m'apporter la vérité. Qu'il soit désormais Loup Solitaire, Seigneur Kaï de plein droit, et qu'il porte notre dernière espérance. La guerre commence demain, et je jure devant vous tous : tant qu'un seul Sommerlendien vivra, la lumière ne s'éteindra pas. »\n\nAu-dehors, les cloches de Holmgard sonnent le rassemblement. Votre première aventure s'achève ici ; la suivante commence à l'aube.",
    fin: "victoire",
    nomFin: "Le Serment de Sommerlund",
  },
  {
    id: "351",
    titre: "L'Étoile et la Clé",
    image: "/lonewolf/pdf/colored/roi-ulnar.png",
    texte:
      "Vous posez sur la table de chêne du Roi deux choses : la Clé d'Or du Premier Roi, encore froide, et le pendentif de l'Étoile de Cristal que Banedon vous a confié dans la lumière bleue de la colline.\n\nLe Roi Ulnar se penche. Sa main tremble légèrement lorsqu'elle effleure l'étoile à sept branches. « Mon père portait un sceau identique, dit-il. La Confrérie de l'Étoile de Cristal n'a donc pas disparu — et voici la Clé que les Anciens confièrent aux Seigneurs Kaï pour qu'elle ne tombe jamais aux mains des Ténèbres. »\n\nIl se tourne vers vous, et pour la première fois depuis votre arrivée, il sourit.\n\n« Tu n'apportes pas seulement une nouvelle, Loup Solitaire. Tu apportes une alliance. Ce soir, Holmgard n'est plus seule. Demain, nous nous battrons. »\n\nOn vous remet une cape blanche à liseré d'or : la cape d'un Seigneur Kaï de la nouvelle génération. Sur les remparts, les cloches de la ville sonnent à l'espérance.",
    fin: "victoire",
    nomFin: "L'Étoile et la Clé (fin remarquable)",
  },
];
