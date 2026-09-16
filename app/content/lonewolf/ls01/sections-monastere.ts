import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Livre 1 — Les Maîtres des Ténèbres
 * Chapitre I : La nuit du monastère & la forêt de Fryelund
 *
 * Adaptation française : mêmes lieux, mêmes ennemis, mêmes rencontres et mêmes
 * embranchements que le livre-jeu original de Joe Dever, textes écrits pour
 * cette application.
 */
export const SECTIONS_MONASTERE: StorySection[] = [
  {
    id: "1",
    titre: "La nuit du monastère Kaï",
    image: "/lonewolf/monastere-en-feu.jpg",
    texte:
      "Un cri déchire la nuit. Vous ouvrez les yeux dans le dortoir glacial du monastère Kaï et, avant même d'avoir repris vos esprits, une odeur de poix brûlée vous saisit à la gorge. Par la fenêtre, le ciel est rouge. Des silhouettes sombres courent entre les bâtiments, des torches à la main, et leurs hurlements rauques se répondent sans fin.\n\nLe cœur battant, vous roulez hors de votre paillasse. Les autres novices ont disparu. Sur le mur de pierre, l'ombre tremblante d'une créature armée d'une hache passe et repasse — puis s'éloigne.\n\nLe monastère qui vous a formé est en train de mourir. Que faites-vous ?",
    choix: [
      {
        texte: "Foncer vers la salle des Maîtres pour leur porter secours",
        vers: "12",
      },
      {
        texte: "Rassembler votre équipement d'initié et fuir vers la falaise",
        vers: "2",
      },
    ],
  },
  {
    id: "12",
    titre: "La salle des Maîtres",
    texte:
      "Vous traversez à grandes enjambées le couloir des « Étoiles », que les fumées rendent irrespirable. La porte de la salle des Maîtres est arrachée de ses gonds. À l'intérieur, c'est un charnier : vos maîtres gisent sur les dalles, frappés dans leur sommeil, leurs robes blanches souillées de suie et de sang.\n\nAu centre de la pièce, le vieux Maître Kaï en chef repose comme un homme qui aurait simplement fermé les yeux. Sa main est tendue vers la porte, comme s'il avait voulu vous avertir. Une gargouille au regard de braise s'écrase dans l'embrasure : vous vous jetez sous une table basse et l'impact projette autour de vous un nuage de pierre brûlante (vous perdez 2 points d'ENDURANCE).\n\nIl n'y a plus rien à sauver ici. Le monastère n'appartient plus aux hommes. Il vous faut partir, et vivre pour porter la nouvelle.",
    effets: { endurance: -2 },
    suite: "2",
  },
  {
    id: "2",
    titre: "La salle d'armes",
    image: "/lonewolf/salle-armes.jpg",
    texte:
      "La salle d'armes n'a pas encore été atteinte par le feu. Vous décrochez votre hache de la Râtelier des Novices, devenue votre unique arme, puis vous bourrez votre Sac à Dos d'un Repas. Dans le coffre de la chambrée des Sacs, vous prenez une bourse de Pièces d'Or et la Carte du Sommerlund que les Maîtres remettent à chaque initié qui part en épreuve.\n\nDans une niche de pierre, un rayon de lune éclaire une dernière étagère, sous laquelle sont éparpillés des effets ayant appartenu à vos aînés. Il neige de la cendre. Vous pouvez emporter une seule de ces choses.",
    choix: [
      {
        texte: "Emporter votre butin et sortir par la petite porte de l'étable",
        vers: "4",
      },
    ],
  },
  {
    id: "4",
    titre: "La cour des morts",
    image: "/lonewolf/cour-des-morts.jpg",
    texte:
      "Vous sortez par la petite porte de l'étable et manquez de glisser sur les marches : la cour du monastère est jonchée de corps. La pluie fine fait fumer les torches renversées. Tout en haut du mur d'enceinte, des formes ailées tournoient lentement, comme des rapaces.\n\nDes voix rauques, toutes proches, échangent des ordres dans cette langue sifflante qui vous fait froid dans le dos. Une patrouille remonte le sentier. Vous n'avez que quelques secondes pour décider.",
    choix: [
      {
        texte:
          "Suivre votre Sixième Sens, qui vous souffle de filer vers le nord-est (Discipline du Sixième Sens)",
        vers: "131",
        requis: { discipline: "sixieme-sens" },
        montreToujours: true,
      },
      {
        texte: "Se faufiler entre les corps et descendre vers la route du sud",
        vers: "100",
      },
      {
        texte: "Se plaquer contre le mur et attendre le passage de la patrouille",
        vers: "60",
      },
    ],
  },
  {
    id: "60",
    titre: "Dans l'ombre du mur",
    texte:
      "Vous vous aplatissez derrière un sarcophage et respirez à peine. Les Giaks passent si près que vous sentez leur haleine fétide. Au moment où vous croyez le danger passé, vous marchez sur une branche qui craque.\n\nUne des créatures s'arrête. Elle renifle. Votre main se referme sur le manche de votre hache.",
    evenement: {
      type: "jet-hasard",
      titre: "Un craquement de branche",
      texte:
        "La sentinelle hésite, puis reprend sa route. Vous attendez que le dernier souffle de la nuit efface le bruit de leurs pas.",
      ton: "danger",
      branches: {
        "0-4": {
          texte:
            "Le Giak vous a entendu : il abaisse sa lance vers vous. Rendez-vous au 100.",
          vers: "100",
        },
        "5-9": {
          texte:
            "La créature hausse les épaules et s'éloigne en grommelant. Vous profitez de l'ombre pour gagner le sentier sud. Rendez-vous au 131.",
          vers: "131",
        },
      },
    },
    suite: "100",
  },
  {
    id: "100",
    titre: "La patrouille",
    image: "/lonewolf/giaks-patrouille.jpg",
    texte:
      "Le sentier descend sous les pins. Vous n'avez pas fait cent pas que des grognements éclatent derrière vous : trois Giaks ont relevé votre piste. Leurs yeux rouges luisent sous des casques de fer bosselé, leurs lances sont barbelées de crocs d'animaux.\n\nL'un d'eux pousse un cri de chasse et se détache du groupe. Il sera sur vous dans un instant.",
    effets: { repasObligatoire: true },
    choix: [
      {
        texte: "L'attendre de pied ferme et combattre",
        vers: "101",
      },
      {
        texte:
          "Vous jeter derrière les rochers et disparaître dans la fougère (Discipline du Camouflage)",
        vers: "102",
        requis: { discipline: "camouflage" },
        montreToujours: true,
      },
      {
        texte: "Détaler vers la lisière de la forêt en espérant les semer",
        vers: "103",
      },
    ],
  },
  {
    id: "101",
    titre: "Premier sang",
    texte:
      "Vous bondissez par-dessus une souche et faites face. Le Giak, emporté par son élan, ouvre sa garde — et vous n'avez pas l'intention de laisser passer cette chance. Donnez le premier coup avant de poursuivre le combat.",
    combat: {
      nom: "Giak",
      habilete: 9,
      endurance: 9,
      bonusJoueur: 4,
      emoji: "👹",
      description:
        "Un soldat giak, petit mais hargneux, armé d'une lance barbelée et d'un bouclier de cuir.",
    },
    suite: "102",
  },
  {
    id: "102",
    titre: "La lisière de Fryelund",
    image: "/lonewolf/foret-fryelund.jpg",
    texte:
      "Vous courez longtemps, sans regarder en arrière, jusqu'à ce que les murs du monastère ne soient plus qu'une lueur rouge au sommet de la colline. Devant vous s'ouvre la forêt de Fryelund : des pins immenses dont les aiguilles vous griffent le visage, et une humidité froide qui sent la résine et la mousse.\n\nVous êtes le dernier des Seigneurs Kaï. Derrière vous, l'armée du Roi-Sorcier. Devant, trois cents kilomètres de forêt et de route jusqu'à Holmgard, la capitale du Sommerlund. Et dans votre poche, un secret qui pourrait sauver le royaume.\n\nVous vous accordez quelques minutes, le dos contre un tronc, le temps de reprendre votre souffle.",
    choix: [
      {
        texte: "Trancher vers le nord-est, en suivant la lumière de l'aube",
        vers: "131",
      },
      {
        texte: "Suivre le ruisseau vers l'est et longer les collines",
        vers: "131",
      },
    ],
  },
  {
    id: "103",
    titre: "Sous les ronces",
    texte:
      "Vous vous jetez dans un fourré de ronces si épais que vos poursuivants perdent votre trace en quelques minutes. Vous rampez sur une dizaine de mètres, le visage en sang, avant de déboucher sur un petit sentier de chevreuil.\n\nEn vous relevant, votre pied heurte quelque chose de dur sous la mousse : une bourse de cuir oubliée là, contenant six Pièces d'Or. Un peu plus loin, dans un bouquet de fougères, une tablette de savon parfumé embaume encore. Vous emportez les deux, avec le sentiment étrange que la forêt, elle, ne vous veut pas de mal.",
    effets: {
      or: 6,
      objets: [{ id: "savon" }],
    },
    suite: "131",
  },
  {
    id: "131",
    titre: "L'homme sur la route",
    image: "/lonewolf/banedon.jpg",
    texte:
      "Vous marchez depuis deux heures quand un bruit nouveau résonne dans la forêt : des cris, des coups de sifflet, puis une détonation sèche qui fait s'envoler tout un envol de corneilles.\n\nSur le sentier, un homme en robe bleu nuit court vers vous en trébuchant. Il est vieux, essoufflé, et serre contre sa poitrine un bâton noueux incrusté de verre. Derrière lui, vous entendez les grognements d'une meute de Giaks.\n\nIl vous voit, lève la main et crie : « Loup Solitaire ! Ils ont brûlé le monastère ! Fuis, garçon — non, attends… aide-moi, et je te donnerai de quoi traverser ce royaume vivant. »",
    choix: [
      {
        texte: "Lui crier de se jeter derrière vous et faire face aux Giaks",
        vers: "281",
      },
      {
        texte: "Se mettre à couvert et le laisser poursuivre seul",
        vers: "133",
      },
    ],
  },
  {
    id: "133",
    titre: "Le prix de la prudence",
    texte:
      "Vous vous glissez derrière un tronc mort. Le vieil homme passe en haletant, les Giaks sur ses talons. Il se retourne une dernière fois, cherche votre aide du regard, et vous voyez la déception traverser son visage — puis un projectile le frappe à l'épaule et il s'effondre dans les fougères.\n\nLes Giaks, trop occupés à fouiller son corps, ne vous remarquent pas. Vous repartez le ventre serré d'une honte que rien ne lavera, et il vous semble que la forêt s'est refermée derrière vous pour toujours.",
    effets: { drapeau: "abandonne_banedon" },
    suite: "281",
  },
  {
    id: "281",
    titre: "L'embuscade de la colline",
    image: "/lonewolf/embuscade-colline.jpg",
    texte:
      "L'homme s'appelle Banedon, et il est Maître de la Confrérie de l'Étoile de Cristal. « Mon vaisseau est posé sur la colline, là-haut, dit-il en désignant la crête. Ses moteurs sont gelés. Il me faut encore une heure, et ils seront là dans dix minutes. »\n\nEn haut de la colline, une trappe s'ouvre dans l'herbe brune : c'est l'entrée d'une ancienne mine. Vous y poussez Banedon juste au moment où les premiers Giaks jaillissent des fougères. Vous vous retournez, hache en main, le dos à l'ouverture.",
    combat: {
      nom: "Giaks de la confrérie",
      habilete: 13,
      endurance: 20,
      emoji: "👺",
      description:
        "Deux Giaks d'élite, revêtus de plaques de cuir clouté. Ils se battent ensemble, en se couvrant l'un l'autre.",
    },
    suite: "44",
  },
  {
    id: "44",
    titre: "La mine abandonnée",
    texte:
      "Le calme revient. Banedon est assis contre la paroi, sa robe déchirée, une longue estafilade à l'épaule. Il sourit malgré tout : « Tu t'es battu comme un Seigneur Kaï, garçon. Il reste peut-être un espoir pour ce royaume. »\n\nDans un coin de la galerie, il a rassemblé ce qu'il a pu trouver : un rouleau de corde solide et deux flacons d'un liquide vert sombre. « Du laumspur, dit-il. Tu en boiras une dose après un combat, quand tu tiendras à peine debout : cela vaut tous les médecins du Sommerlund. »\n\nAvant de repartir, il vous regarde gravement : « Tu portes deux armes, maintenant. Prends-en une seule, celle qui te va le mieux : l'encombrement tue plus de fuyards que les lames. »",
    effets: {
      objets: [
        { id: "corde" },
        { id: "potion-laumspur", quantity: 2 },
        { id: "torche" },
        { id: "briquet" },
        { id: "epee-courte", optionnel: true },
      ],
    },
    suite: "113",
  },
  {
    id: "113",
    titre: "Le départ du vieux maître",
    image: "/lonewolf/etoile-cristal.jpg",
    texte:
      "Dehors, la nuit commence à tomber et une lueur bleue danse au sommet de la colline. Le vaisseau de Banedon ressemble à un grand oiseau de toile et de verre, posé entre les pins. Il embarque, puis se penche une dernière fois vers vous.\n\n« Ceci appartenait à mon ordre, dit-il en détachant de son cou un pendentif d'argent en forme d'étoile à sept branches. Elle n'éclaire pas les routes, Loup Solitaire — elle éclaire les cœurs. Garde-la, et souviens-toi que tu n'es pas seul. »\n\nLe pendentif de l'Étoile de Cristal se referme dans votre paume, encore chaud. Dans un souffle, le vaisseau s'arrache au sol et disparaît vers le nord. Vous êtes seul, avec une étoile autour du cou.",
    effets: {
      objets: [{ id: "cristal-etoile", message: "Le pendentif de l'Étoile de Cristal" }],
      drapeau: "a_cristal_etoile",
    },
    suite: "213",
  },
  {
    id: "213",
    titre: "Le tunnel",
    image: "/lonewolf/tunnel.jpg",
    texte:
      "Au matin, la forêt de Fryelund se resserre. Vous suivez un ancien chemin de bûcherons quand une odeur de charogne vous arrête net : devant vous, un tunnel de pierre taillée s'enfonce dans le flanc d'un coteau, et quelque chose y a traîné une carcasse de cerf.\n\nLa galerie est le raccourci le plus court vers la route de Toran ; la contourner vous coûterait une journée, et les Giaks ratissent la forêt. Des bruits lourds, humides, montent des profondeurs. Vous cherchez dans votre Sac à Dos.",
    choix: [
      {
        texte:
          "Allumer la torche et descendre dans le tunnel (nécessite une Torche et un Briquet)",
        vers: "214",
        requis: { sac: "torche" },
        montreToujours: true,
      },
      {
        texte: "Descendre à l'aveugle, une main sur la paroi",
        vers: "215",
      },
      {
        texte: "Faire un long détour par la crête, à découvert",
        vers: "331",
      },
    ],
  },
  {
    id: "214",
    titre: "La créature des profondeurs",
    texte:
      "La torche s'allume dans un crépitement. La lumière vous sauve la vie : elle aveugle la chose qui vous attendait dans le noir. Elle a la forme d'une chenille de la taille d'une charrette, couverte d'écailles visqueuses et terminée par une gueule circulaire hérissée de dents.\n\nLa torche bat en retrait la créature, mais elle frappe à l'aveugle, et ses coups suffisent à briser la pierre.",
    combat: {
      nom: "Gluatre des profondeurs",
      habilete: 17,
      endurance: 7,
      immunisePsychique: true,
      malusPsychique: 3,
      malusEvitePar: "torche",
      emoji: "🐛",
      description:
        "Un prédateur aveugle des galeries. La torche annule les 3 points d'Habileté qu'il inflige par sa terreur visqueuse.",
    },
    suite: "216",
  },
  {
    id: "215",
    titre: "Dans le noir absolu",
    texte:
      "Vous avancez à tâtons, une main sur la paroi glacée. Votre respiration est si forte qu'elle couvre tous les bruits… tous, non : un frottement humide approche quelque part devant vous, et vous n'avez ni torche ni repère pour vous défendre.\n\nLa chose vous frappe avant même que vous ne la voyiez. Vous roulez sur le sol, votre hache frappant au hasard dans la nuit la plus totale.",
    effets: { endurance: -3 },
    combat: {
      nom: "Gluatre des profondeurs",
      habilete: 17,
      endurance: 7,
      immunisePsychique: true,
      malusPsychique: 3,
      emoji: "🐛",
      description:
        "Sans lumière, la créature conserve son avantage : 3 points d'Habileté de moins pour vous.",
    },
    suite: "216",
  },
  {
    id: "216",
    titre: "L'or du mineur",
    texte:
      "La créature se replie en sifflant dans une galerie latérale. Vous continuez, le cœur battant, et débouchez dans une ancienne chambre d'exploitation. Un squelette de mineur git contre une poutre, une bourse à la ceinture, et à côté de lui un poignard de belle facture, encore gainé de cuir.\n\nVous prenez les vingt Pièces d'Or et le poignard, puis vous remontez vers la lumière du jour par une cheminée effondrée.",
    effets: {
      or: 20,
      objets: [{ id: "poignard", optionnel: true }],
    },
    suite: "331",
  },
  {
    id: "331",
    titre: "Le bois des bûcherons",
    image: "/lonewolf/cabane.jpg",
    texte:
      "Vous émergez enfin du tunnel et respirez à pleins poumons. La forêt de Fryelund n'est plus qu'un rideau vert derrière vous.\n\nSur votre droite, une cabane de bûcherons s'accroche à un énorme chêne, à quatre mètres du sol. On y accède par une échelle de corde. Une lanterne s'y balance : quelqu'un est chez lui, ou bien y a-t-il trouvé refuge.\n\nVous entendez la rumeur lointaine d'une rivière, et, plus loin encore, celle de la route de Toran.",
    choix: [
      {
        texte: "Grimper à l'échelle de corde et frapper à la porte",
        vers: "332",
      },
      {
        texte: "Continuer sans s'arrêter vers la route de Toran",
        vers: "157",
      },
    ],
  },
  {
    id: "332",
    titre: "Le bûcheron",
    texte:
      "Un vieil homme voûté vous ouvre, une hachette à la main. Il vous examine longuement, puis vous fait signe d'entrer. « J'ai vu la lumière sur la colline, cette nuit, grommelle-t-il. Le monastère, hein ? »\n\nIl ne pose pas d'autre question. Il vous tend une miche de pain, une couverture de laine, et un marteau de guerre qu'il décroche du mur. « Prends. Je n'ai plus l'âge de m'en servir. »\n\nQuand vous redescendez à l'aube, il vous crie une dernière chose : « Sur la route de Toran, évite les convois de soldats. Les Giaks sont partout, et il y a pire que les Giaks, mon garçon. »",
    effets: {
      objets: [
        { id: "repas", quantity: 2 },
        { id: "couverture" },
        { id: "marteau-de-guerre", optionnel: true },
      ],
      drapeau: "a_marteau",
    },
    suite: "157",
  },
];
