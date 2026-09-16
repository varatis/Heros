import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Livre 1 — Les Maîtres des Ténèbres
 * Chapitre II : La route de Toran jusqu'aux portes de Holmgard
 */
export const SECTIONS_ROUTE: StorySection[] = [
  {
    id: "157",
    titre: "La route de Toran",
    image: "/lonewolf/route-toran.jpg",
    texte:
      "La route de Toran est une longue artère de terre battue qui traverse le Sommerlund du nord au sud. En temps de paix, on y croise des marchands, des ménestrels et des moines en voyage. Aujourd'hui, c'est un fleuve de misère.\n\nDes centaines de villageois fuient vers le sud, poussant des charrettes, portant des enfants endormis, traînant des bêtes affolées. Les visages sont gris de cendre. Personne ne parle. Au loin, dans votre dos, une colonne de fumée noire marque l'emplacement de votre monastère.\n\nUn cri perçant domine soudain la rumeur : deux enfants sont tombés dans un fossé, et un chariot renversé les sépare du reste de la colonne. Les parents hurlent, mais la foule avance, elle ne s'arrêtera pas.",
    effets: { repasObligatoire: true },
    choix: [
      {
        texte: "Vous précipiter pour sortir les enfants du fossé",
        vers: "86",
      },
      {
        texte: "Rejoindre la caravane et poursuivre vers le sud sans vous arrêter",
        vers: "207",
      },
      {
        texte:
          "Vous fondre dans la colonne sous l'apparence d'un paysan (Discipline du Camouflage)",
        vers: "200",
        requis: { discipline: "camouflage" },
        montreToujours: true,
      },
      {
        texte:
          "Repérer un sentier de contrebandiers qui coupe à travers bois (Discipline de l'Orientation)",
        vers: "90",
        requis: { discipline: "orientation" },
        montreToujours: true,
      },
    ],
  },
  {
    id: "90",
    titre: "Le sentier des contrebandiers",
    texte:
      "Vous repérez, sous les fougères, une trace à peine visible : deux ornières parallèles, des branches cassées à hauteur d'épaule, et l'odeur ténue d'un feu de charbon. Un sentier de contrebandiers, qui coupe tout le bois des Bruyères et permet d'éviter la route.\n\nVous le suivez pendant des heures. Le soir, vous débouchez près d'un ancien abri de bûcherons où deux hommes, un chien et une mule montent la garde.\n\nIls vous voient. L'un d'eux pose la main sur son coutelas ; l'autre vous détaille, puis crache par terre : « Un Kaï ? Il en reste donc un. » Vous expliquez. Le plus vieux hoche la tête : « Les Giaks ont brûlé mon village, la semaine dernière. Prends ce que tu veux dans le barda, gamin. Et si tu croises ces chiens, fais-leur payer. »\n\nIls vous offrent deux Repas et vous indiquent le raccourci qui rejoint la caravane à la nuit tombée.",
    effets: { objets: [{ id: "repas", quantity: 2 }], drapeau: "contrebandiers" },
    suite: "200",
  },
  {
    id: "86",
    titre: "La ferme incendiée",
    image: "/lonewolf/ferme.jpg",
    texte:
      "Vous sautez dans le fossé et hissez la petite sur vos épaules tandis que le garçon s'accroche à votre tunique. Au moment où vous les déposez auprès d'une vieille femme, un grondement monte de derrière la ferme : un chien de guerre, aussi haut qu'un poney, la gueule écumante, un reste de chaîne brisée au collier.\n\nLe garçon hurle. Vous le poussez derrière le mur et vous empoignez votre arme.",
    combat: {
      nom: "Loup Maudit",
      habilete: 13,
      endurance: 16,
      emoji: "🐺",
      description:
        "Un chien de guerre du Roi-Sorcier, dressé à la chasse aux hommes. Sa chaîne brisée fouette l'air.",
    },
    suite: "87",
  },
  {
    id: "87",
    titre: "Ce que la ferme a laissé",
    texte:
      "La bête s'effondre dans un dernier souffle, et un grand silence tombe sur la ferme. Le père des enfants vous remercie d'une voix brisée et vous guide jusqu'à l'atelier : la maison a brûlé, mais la réserve du fond est intacte.\n\nVous y trouvez un Marteau de Guerre de belle facture, deux Repas et une petite réserve de Pièces d'Or. La famille refuse tout en retour ; elle dit simplement : « Que les dieux vous gardent, Seigneur Kaï. »",
    effets: {
      or: 8,
      objets: [
        { id: "marteau-de-guerre", optionnel: true },
        { id: "repas", quantity: 2 },
      ],
    },
    suite: "188",
  },
  {
    id: "207",
    titre: "La caravane",
    texte:
      "Vous aidez une vieille femme à pousser sa charrette pendant une heure, puis deux, jusqu'à ce que la nuit tombe sur la route. Elle vous parle du roi, des Seigneurs Kaï, et de son fils qui est garde à Holmgard. « Si tu arrives là-bas, cherche la porte du Sud, mon garçon. Dis-leur que tu viens de la part d'Alinne. »\n\nElle vous offre un Repas, et vous vous endormez au milieu du bétail, bercé par les roues et les sabots.",
    effets: { objets: [{ id: "repas" }] },
    suite: "200",
  },
  {
    id: "188",
    titre: "Les cavaliers de Toran",
    texte:
      "À l'aube, un bruit de tonnerre fait trembler la route : une troupe de cavaliers descend au galop, bannières au vent. Ce sont les Chevaliers de Toran, ce qu'il reste de la garnison du nord. Ils s'arrêtent auprès de la caravane et leur chef, un colosse à barbe rousse, annonce qu'il faut se hâter vers Holmgard.\n\nPlus loin, sur la gauche, une rangée de haies d'aubépine longe la rivière : un chemin discret, que les chevaux ne peuvent emprunter.\n\nDerrière le rideau d'arbres, à l'écart, une silhouette démesurée vous observe : une créature osseuse, haute comme trois hommes, montée sur des jambes de reptile. Les réfugiés ne l'ont pas vue. Vous, si.",
    choix: [
      {
        texte: "Rejoindre les cavaliers et chevaucher à leur côté (les prévenir)",
        vers: "255",
      },
      {
        texte: "Emprunter seul le chemin des haies et vous éloigner de la bête",
        vers: "64",
      },
    ],
  },
  {
    id: "200",
    titre: "La charrette du marchand",
    texte:
      "Une charrette vous rattrape, tirée par un cheval efflanqué. Le marchand, un petit homme rond vêtu d'un manteau rapiécé, vous fait monter d'un geste. Il s'appelle Griff et prétend n'avoir jamais quitté la route de Toran de sa vie.\n\n« Les cavaliers, là-bas, ne valent rien pour toi, dit-il en mâchant une racine. Ils vont s'arrêter toutes les deux lieues pour rassurer les fuyards. Si tu veux sauver le royaume, mon garçon, coupe par les collines et longe les aubépines. Tu croiseras des bêtes du Roi-Sorcier, forcément. Mais tu arriveras. »\n\nIl vous laisse descendre un peu plus loin, après vous avoir offert un Repas et une information précieuse : à Holmgard, c'est la porte du Sud qu'il faut viser, celle que garde l'Hermine.",
    effets: {
      objets: [{ id: "repas" }],
      drapeau: "indication_porte_sud",
    },
    suite: "188",
  },
  {
    id: "255",
    titre: "Le Gourgaz",
    image: "/lonewolf/gourgaz.jpg",
    texte:
      "Vous vous portez à hauteur du chef de la troupe et lui désignez la chose du doigt. Il devient livide. « Un Gourgaz ! siffle-t-il. Ces monstres commandent les meutes du Roi-Sorcier. » Il tire son épée et fait signe aux siens de protéger la caravane.\n\nLe Gourgaz se dresse alors de toute sa hauteur, et le premier cheval s'effondre, la gorge ouverte. Vous bondissez au sol. C'est vous qu'il regarde maintenant.",
    combat: {
      nom: "Gourgaz",
      habilete: 20,
      endurance: 30,
      immunisePsychique: true,
      emoji: "🦎",
      description:
        "Le plus redoutable des serviteurs du Roi-Sorcier sur la route de Toran. Immunisé à la Puissance Psychique.",
    },
    suite: "65",
  },
  {
    id: "65",
    titre: "La dépouille du Gourgaz",
    texte:
      "Le monstre s'abat dans un fracas d'os et de cuir. Les cavaliers vous acclament, puis repartent au galop — ils doivent couvrir la caravane.\n\nSur le corps, vous trouvez une bourse de dix Pièces d'Or et un flacon de verre noir, soigneusement enveloppé de cuir. Le chef de la troupe, avant de s'éloigner, vous crie : « C'est de l'Alether ! Garde-le pour le jour où tu devras tuer beaucoup plus fort que toi ! »",
    effets: {
      or: 10,
      objets: [{ id: "potion-alether" }],
    },
    suite: "66",
  },
  {
    id: "66",
    titre: "Le Vordak",
    texte:
      "Vous rangez le flacon dans votre Sac à Dos. C'est alors que le silence se fait : tout à coup, plus un oiseau, plus un criquet. Les chevaux de la caravane, cent mètres plus loin, refusent d'avancer.\n\nUne forme descend de la colline, enveloppée dans une cape grise. Sous le capuchon, vous ne voyez qu'un masque d'os pâle, et deux lueurs rouges là où devraient être les yeux. Un Vordak — l'un de ces serviteurs morts-vivants que les Maîtres Kaï redoutaient entre tous. Sa voix résonne directement dans votre crâne : « Le dernier petit loup… enfin seul. »\n\nSi vous ne possédez pas le Bouclier Psychique, son souffle mental vous infligera un malus d'Habileté tant que vous ne l'aurez pas abattu.",
    choix: [
      {
        texte: "Lever votre arme et aller au-devant de lui",
        vers: "67",
      },
      {
        texte: "Disparaître dans les fourrés et le laisser passer (jet de hasard)",
        vers: "68",
      },
    ],
  },
  {
    id: "67",
    titre: "Le duel des ombres",
    texte:
      "Vous foncez. Le Vordak glisse vers vous sans que ses pieds touchent vraiment le sol, et la froideur de son esprit s'insinue dans vos tempes comme une aiguille de glace. Vous serrez les dents et vous frappez.",
    combat: {
      nom: "Vordak",
      habilete: 18,
      endurance: 26,
      immunisePsychique: true,
      malusPsychique: 2,
      emoji: "💀",
      description:
        "Un serviteur mort-vivant du Roi-Sorcier. Immunisé à la Puissance Psychique ; son attaque mentale coûte 2 points d'Habileté, sauf si vous possédez le Bouclier Psychique.",
    },
    suite: "69",
  },
  {
    id: "69",
    titre: "La gemme noire",
    texte:
      "Le Vordak se brise comme un bloc de glace et sa cape vide s'affaisse dans la poussière. À l'endroit où son cœur aurait dû battre, une gemme noire roule sur la route. Elle pulse d'une lueur mauvaise, et vous sentez qu'elle vaut une fortune.\n\nVous la ramassez, ou vous la jetez. Peu importe : la route de Toran n'a pas fini de vous réclamer.",
    choix: [
      {
        texte: "Emporter la Gemme de Vordak (elle attire l'œil des serviteurs du Roi-Sorcier)",
        vers: "64",
        effets: {
          objets: [{ id: "gemme-vordak" }],
          drapeau: "gemme_vordak",
        },
      },
      {
        texte: "La jeter dans la rivière et poursuivre votre route",
        vers: "64",
      },
    ],
  },
  {
    id: "68",
    titre: "Le souffle du Vordak",
    texte:
      "Vous vous jetez dans les orties. Le Vordak s'arrête, humant l'air — puis, sans se retourner, il reprend sa descente vers la route. Vous retenez votre souffle.\n\nQuand vous osez enfin lever la tête, il a disparu. Mais quelque chose cloche : vos mains tremblent, et une migraine froide s'est installée derrière vos yeux.",
    evenement: {
      type: "jet-hasard",
      titre: "Le Vordak vous cherche",
      texte:
        "Une voix sans visage murmure votre nom dans votre tête. Vous priez pour que la forêt vous garde quelques secondes de plus.",
      ton: "mystere",
      branches: {
        "0-4": {
          texte:
            "Le Vordak vous trouve. Il n'y aura pas de fuite cette fois : rendez-vous au 67.",
          vers: "67",
        },
        "5-9": {
          texte:
            "Le silence revient. Vous perdez 2 points d'Endurance, mais vous êtes vivant. Rendez-vous au 64.",
          endurance: -2,
          vers: "64",
        },
      },
    },
  },
  {
    id: "64",
    titre: "Le gué aux loups",
    image: "/lonewolf/loups-maudits.jpg",
    texte:
      "Le chemin des haies vous mène à une rivière étroite et profonde, franchie par un vieux pont de pierre. De l'autre côté, un cheval sellé tourne en rond près d'un chariot abandonné, hennissant de terreur. Entre vous et lui, deux Loups Maudits, maigres et affamés, se disputent un quartier de viande.\n\nAu-dessus de la rivière, une ombre immense tourne en cercles : un Kraan, l'une de ces créatures ailées au service du Roi-Sorcier. Elle n'a pas encore repéré votre présence — mais elle finira par le faire.",
    effets: { repasObligatoire: true },
    choix: [
      {
        texte: "Foncer, attraper le cheval et traverser le pont au galop",
        vers: "70",
      },
      {
        texte: "Traverser la rivière à la nage, plus bas, entre les roseaux",
        vers: "522",
      },
      {
        texte:
          "Vous glisser dans les roseaux et attendre que tout ce petit monde s'en aille (Discipline du Camouflage)",
        vers: "142",
        requis: { discipline: "camouflage" },
        montreToujours: true,
      },
      {
        texte: "Abattre les loups et vous emparer du cheval",
        vers: "71",
      },
      {
        texte: "Attirer le Kraan au sol et le combattre avant qu'il ne donne l'alerte",
        vers: "45",
      },
    ],
  },
  {
    id: "45",
    titre: "Le Kraan",
    image: "/lonewolf/kraan.jpg",
    texte:
      "Vous ramassez une poignée de cailloux et vous les lancez vers la créature ailée. Elle pique vers vous dans un sifflement de cuir et de plumes, toutes griffes dehors : c'est exactement ce que vous vouliez. Un Kraan mort ne préviendra personne.",
    combat: {
      nom: "Kraan",
      habilete: 16,
      endurance: 24,
      emoji: "🦇",
      description:
        "Une créature ailée au service du Roi-Sorcier, environ deux fois plus grande qu'un aigle. Ses griffes sont enduites de poison.",
    },
    suite: "46",
  },
  {
    id: "46",
    titre: "La fiole du cavalier",
    texte:
      "La créature s'écrase dans la rivière dans un grand geyser d'eau noire. Sur son harnais, vous trouvez une petite besace de cuir imperméable : six Pièces d'Or et un parchemin couvert d'une écriture runique que vous ne savez pas lire. Vous emportez le tout et traversez le pont sans plus attendre.",
    effets: {
      or: 6,
      objets: [{ id: "message" }],
      drapeau: "a_message",
    },
    suite: "142",
  },
  {
    id: "70",
    titre: "La course du pont",
    texte:
      "Vous bondissez, saisissez les rênes et vous jetez sur le dos du cheval affolé. Les loups hurlent, l'ombre du Kraan s'abat — trop tard : vous êtes déjà sur l'autre rive, et la bête ailée ne peut vous suivre entre les arbres.\n\nLe cheval vous portera jusqu'aux collines de Holmgard.",
    effets: { drapeau: "a_cheval" },
    suite: "142",
  },
  {
    id: "71",
    titre: "Les deux loups",
    texte:
      "Vous n'avez pas le temps de ruser : les bêtes vous ont senti. Elles abandonnent leur charogne et viennent de front, l'une à gauche, l'autre à droite, exactement comme les chasseurs du Roi-Sorcier leur ont appris à le faire.",
    combat: {
      nom: "Meute de Loups Maudits",
      habilete: 14,
      endurance: 24,
      emoji: "🐺",
      description:
        "Deux chiens de guerre du Roi-Sorcier, attaquant ensemble : leurs valeurs sont cumulées, comme le veut la règle des combats multiples.",
    },
    suite: "142",
  },
  {
    id: "522",
    titre: "Les eaux noires",
    texte:
      "Vous entrez dans l'eau et le froid vous coupe le souffle. Le courant est bien plus violent qu'il n'y paraît : la rivière de Toran, gonflée par les pluies, vous emporte vers les rapides.\n\nVous vous débattez, mais vos bottes s'alourdissent, votre Sac à Dos se remplit d'eau, et les cris des loups s'éloignent derrière vous. Sur la rive, personne ne vous verra disparaître. Le dernier Seigneur Kaï du Sommerlund se noie dans une rivière anonyme, à cent kilomètres de la capitale.",
    fin: "mort",
    nomFin: "Les eaux noires de Toran",
  },
  {
    id: "142",
    titre: "Holmgard, enfin",
    image: "/lonewolf/holmgard.jpg",
    texte:
      "Au sommet de la dernière colline, vous la voyez enfin : Holmgard, la capitale du Sommerlund. Ses remparts blancs montent vers le ciel, ses tours portent les couleurs or et pourpre du Roi, et dans la brume du matin, des milliers de fumées s'élèvent des faubourgs. Le cœur serré, vous pensez aux ruines noires du monastère.\n\nMais des colonnes de fumée montent aussi de la ville basse. L'armée du Roi-Sorcier est plus proche que vous ne le pensiez.\n\nDeux itinéraires s'offrent à vous : la route royale, large et surveillée, ou le raccourci du Cimetière des Anciens, un vieux champ de tombes que les Sommerlendiens évitent par superstition.",
    effets: { repasObligatoire: true },
    choix: [
      {
        texte: "Couper par le Cimetière des Anciens",
        vers: "153",
      },
      {
        texte: "Prendre la route royale et rejoindre les portes de la ville",
        vers: "129",
      },
    ],
  },
  {
    id: "153",
    titre: "Le Cimetière des Anciens",
    image: "/lonewolf/cimetiere.jpg",
    texte:
      "Le Cimetière des Anciens est un champ de mausolées penchés, rongés par le lierre. Les tombes les plus vieilles datent de l'arrivée des Sommerlendiens, il y a plus de mille ans. L'air y est étrangement immobile.\n\nDevant vous, un escalier de pierre descend sous un mausolée ouvert. Une odeur de renfermé et de cire froide en monte. Au-dessus de la porte, une inscription en vieux sommerlien : « Ici repose la garde du premier Roi. Que celui qui descend sans y être invité descende pour toujours. »\n\nQuelque part dans votre dos, des cors de guerre sonnent : les Giaks ne sont pas loin.",
    choix: [
      {
        texte:
          "Écouter votre Sixième Sens avant de descendre (Discipline du Sixième Sens)",
        vers: "154",
        requis: { discipline: "sixieme-sens" },
        montreToujours: true,
      },
      {
        texte: "Descendre hardiment dans la crypte",
        vers: "154",
      },
      {
        texte: "Presser le pas et rejoindre les portes de la ville",
        vers: "129",
      },
    ],
  },
  {
    id: "154",
    titre: "La crypte du Premier Roi",
    image: "/lonewolf/crypte.jpg",
    texte:
      "Votre lampe de poche improvisée éclaire des rangées de sarcophages sculptés. Vous avancez entre deux haies de statues de gardes, jusqu'au fond de la salle, où se dresse un trône de pierre noire.\n\nSur le trône est assis un squelette en armure, un casque doré sur le crâne, et dans sa main osseuse repose une grande clé d'or. Vous n'avez pas fait trois pas qu'un craquement retentit derrière vous : quelque chose de grand s'est réveillé dans l'ombre des tombeaux.",
    effets: { repasObligatoire: true },
    combat: {
      nom: "Rejeton de crypte",
      habilete: 16,
      endurance: 16,
      emoji: "☠️",
      description:
        "Un gardien de tombeau animé par une magie ancienne, bien plus vieux que le Roi-Sorcier.",
    },
    suite: "155",
  },
  {
    id: "155",
    titre: "La Clé d'Or",
    texte:
      "Le gardien s'effondre en un tas d'os et de poussière. Vous gravissez les marches du trône, et prenez la Clé d'Or dans la main du Premier Roi. Elle est lourde, froide, et porte gravé le sceau de la maison de Sommerlund.\n\nEn vous retournant, vous apercevez une trappe dérobée, par laquelle vous remontez à l'air libre, derrière les murs de la ville.",
    effets: {
      objets: [{ id: "cle-or", message: "La Clé d'Or du Premier Roi" }],
      drapeau: "a_cle_or",
    },
    suite: "129",
  },
  {
    id: "129",
    titre: "Les portes de Holmgard",
    image: "/lonewolf/porte-sud.jpg",
    texte:
      "Vous atteignez la porte du Sud au moment où la garde la referme derrière un dernier convoi de réfugiés. Une foule effrayée se presse sous les voûtes. Les gardes, épuisés, refoulent des familles entières.\n\nVous vous frayez un chemin dans la cohue jusqu'à un officier en cotte de mailles, qui observe la scène d'un air sombre. Il porte l'écu du Roi.\n\nQue faites-vous ?",
    choix: [
      {
        texte: "Aller droit à lui et décliner votre identité de Seigneur Kaï",
        vers: "318",
      },
      {
        texte: "Le prendre à part discrètement et raconter ce que vous avez vu",
        vers: "318",
      },
      {
        texte: "Traverser la ville par vous-même jusqu'au palais royal",
        vers: "319",
      },
    ],
  },
  {
    id: "319",
    titre: "Seul dans la ville basse",
    texte:
      "Vous vous engagez dans les ruelles de Holmgard, mais la ville est en état de siège : chaque carrefour est barré par des barricades, chaque rue surveillée par des milices nerveuses. On vous arrête trois fois. La troisième, un sergent vous plaque contre un mur et vous demande d'où vient cette hache couverte de sang.\n\nIl faut vous expliquer, et vite.",
    evenement: {
      type: "jet-hasard",
      titre: "Le sergent vous fouille",
      texte: "Vous cherchez vos mots tandis qu'un attroupement se forme autour de vous.",
      ton: "danger",
      branches: {
        "0-4": {
          texte:
            "On vous traîne en cellule. On refuse de vous croire. Le lendemain, le Roi-Sorcier franchit les remparts : vous avez perdu trop de temps.",
          vers: "520",
        },
        "5-9": {
          texte:
            "Un vieux garde reconnaît en vous le disciple du monastère et se porte garant. On vous escorte jusqu'au palais.",
          vers: "318",
        },
      },
    },
  },
  {
    id: "520",
    titre: "Trop tard",
    texte:
      "La ville tombe avant l'aube. Des cris, des incendies, et cette même odeur de poix brûlée que vous connaissez trop bien. Le Roi-Sorcier est entré dans Holmgard, et personne n'a prévenu le Roi.\n\nVous avez survécu, mais le Sommerlund, lui, ne survit pas. Il ne reste rien d'un messager arrivé trop tard.",
    fin: "mort",
    nomFin: "Le message trop tardif",
  },
];
