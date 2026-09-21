import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 03 — Les Grottes de Kalte
 * Paragraphes 270 à 350. Généré par ls03-importer.cjs
 */
export const SECTIONS_270_350: StorySection[] = [
  {
  id: "270",
  texte: "Les Barbares des Glaces sont pris au dépourvu et vous parvenez à en tuer un avant que l'autre ait eu le temps de réagir. Votre adversaire n'a pas d'arme, mais il est décidé à vous combattre avec acharnement.",
  suite: "340",
  combat: { nom: "Barbare des Glaces", habilete: 14, endurance: 25 }
  },
  {
  id: "271",
  texte: "Votre attaque a fait perdre l'équilibre à l'éclaireur Barbare qui tombe en soulevant une gerbe de neige et de débris provenant de ses skis brisés sous le choc. L'enfant emmitouflé de fourrure est projeté hors du sac à dos de son père et roule sur lui-même en venant s'immobiliser face contre terre à moins de 3 mètres de vous. L'éclaireur Barbare est quelque peu ébranlé par sa chute, mais il essaie déjà de se relever.",
  choix: [
    { texte: "Si vous souhaitez attaquer l'éclaireur Barbare avant qu'il n'ait complètement repris ses esprits", vers: "241" },
    { texte: "Si vous préférez capturer l'enfant pour le prendre en otage et tenter ainsi de vous échapper", vers: "262" }
  ]
  },
  {
  id: "272",
  texte: "Tandis que l'immonde Akranionor meurt à vos pieds dans un ultime tremblement, Vonotar interrompt son attaque psychique et va se réfugier derrière le Trône du Brumalmarc. Loi-Kymar est commotionné, mais il a survécu à l'épreuve. Il vous rejoint alors au bord du fossé dans lequel il jette une poignée d'herbes. Quelques secondes plus tard, un enchevêtrement de plantes grimpantes apparaît, formant un pont qui permet de passer de l'autre côté. Vous vous précipitez vers la plateforme, et vous êtes arrivé à mi-chemin lorsque Vonotar se montre à nouveau, brandissant une baguette de cristal. Il vise la passerelle végétale et un cône de givre jaillit aussitôt de l'extrémité de sa baguette.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer, Sinon, utilisez la Table de Hasard pour obtenir un chiffre", vers: "213", requis: {"special":"glaive-sommer"} }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "143", texte: "Si vous tirez un chiffre entre 0 et 3," },
        "4-9": { vers: "58", texte: "Entre 4 et 9," }
      }
      }
  },
  {
  id: "273",
  texte: "Vous allez voyager en traîneau jusqu'à Ikaya. Vous disposez de deux traîneaux chargés de vivres et de matériel et tirés par des attelages de chiens Kanu. Il s'agit d'une race de chiens de traîneaux particulièrement robustes que l'on élève uniquement dans les terres de Kalte. Leur épaisse fourrure fauve et leur puissant poitrail, ainsi que leur ardeur bien connue les rendent parfaitement aptes à accomplir la rude tâche qui les attend. Vos trois guides, Irian, Fenor et Dyce, sont tous des trappeurs expérimentés. Les techniques de survie dans les déserts glacés n'ont plus de secrets pour eux et ils connaissent bien les multiples dangers que recèle le pays de Kalte. Dès que les chiens sont attelés, vous montez sur l'un des traîneaux en compagnie d'Irian et vous faites signe aux autres d'ouvrir la voie. En contemplant l'étendue glacée de la banquise de Liouk, vous apercevez au loin une tache blanche étincelante : c'est la plaine de Hrod qui se reflète ainsi sous le soleil. « Ne vous y fiez pas, il s'agit en fait d'un mirage, avertit Irian, les yeux brillants sous son capuchon de fourrure. La plaine de glace se reflète dans l'atmosphère en donnant l'impression qu'elle se trouve à 6 ou 7 kilomètres mais, en fait, elle est distante d'au moins 60 kilomètres. Les apparences peuvent être trompeuses dans les terres de Kalte. » Le temps est clair et aucun vent ne souffle, ce qui vous permet de parcourir une distance appréciable dès ce premier jour. A la nuit tombée, vous établissez votre camp. Les traîneaux sont rangés côte à côte et la tente dressée sous un roc en saillie qui offre un bon abri contre le vent.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "35", requis: {"discipline":"sixieme-sens"} },
    { texte: "Sinon", vers: "112" }
  ]
  },
  {
  id: "274",
  texte: "Vous examinez attentivement l'autel et les deux piliers noirs qui se dressent à sa surface. L'éclair qui avait jailli entre ces deux piliers, les reliant par une mystérieuse énergie, s'est éteint au moment précis où vous avez plongé le Glaive de Sommer dans le cyclone démoniaque. Vous remarquez à présent que deux boutons de pierre dépassent de la surface de l'autel, à l'endroit où la statue était couchée.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kai du Sixième Sens", vers: "131", requis: {"discipline":"sixieme-sens"} },
    { texte: "Si vous souhaitez appuyer sur ces boutons", vers: "227" },
    { texte: "Si vous préférez quitter le temple", vers: "306" }
  ]
  },
  {
  id: "275",
  texte: "Le tunnel, étroit et bas de plafond, descend en pente douce vers une caverne d'où jaillit une lumière. Lorsque vous arrivez au bout du passage, vous jetez un regard prudent à l'intérieur de cette grotte, de peur que votre arrivée ne dérange quelqu'un ou quelque chose qu'il vaudrait mieux laisser tranquille. Vous avez eu raison d'être prudent car deux grandes créatures à l'épaisse fourrure sont couchées au milieu de cet espace glacé. Les débris d'une carcasse déchiquetée sont répandus sur la neige autour des deux énormes bêtes.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Chasse, celle de l'Orientation ou celle de la Communication Animale", vers: "293", requis: {"discipline":"chasse"} },
    { texte: "Sinon", vers: "197" }
  ]
  },
  {
  id: "276",
  texte: "Vous arrivez bientôt au croisement : là, le couloir dans lequel vous vous trouvez aboutit à un autre passage orienté est-ouest.",
  choix: [
    { texte: "Si vous souhaitez aller vers l'est", vers: "349" },
    { texte: "Si vous préférez aller vers l'ouest", vers: "50" },
    { texte: "Enfin, si vous maîtrisez les Disciplines Kaï de la Chasse ou de l'Orientation", vers: "219" }
  ]
  },
  {
  id: "277",
  texte: "Vous vous enfuyez à toutes jambes en revenant sur vos pas, mais les Languabarbs sont familiers des lieux et ils gagnent du terrain. Lorsque vous atteignez la cascade gelée, vous remarquez qu'un gros bloc rocheux aux couleurs argentées forme saillie au-dessus de l'entrée de la grotte.",
  choix: [
    { texte: "Si vous possédez une arme, vous pouvez essayer de faire tomber ce roc pour obstruer le passage", vers: "142" },
    { texte: "Si vous ne disposez d'aucune arme, vous devrez faire face aux créatures et les combattre", vers: "32" }
  ]
  },
  {
  id: "278",
  texte: "Le premier coup que vous lui portez fracasse le squelette en projetant ses os alentour. Il ne s'agissait que des restes tout à fait inoffensifs d'un ancien gardien de tombeau. En examinant l'épée de plus près, vous vous apercevez que sa couleur noire est simplement due à la rouille qui recouvre sa lame.",
  choix: [
    { texte: "Vous abaissez votre arme et vous montez l'escalier à pas lents", vers: "36" }
  ]
  },
  {
  id: "279",
  texte: "Les Bakanals sont réputés pour leur extraordinaire capacité de sommeil : ils peuvent parfois dormir trois jours de suite après avoir fait un copieux repas. Et, à en juger par la quantité d'os fraîchement rongés qui sont répandus sur le sol, ce Bakanal ne se réveillera probablement pas avant plusieurs heures.",
  choix: [
    { texte: "Vous pouvez donc passer sans danger devant la créature et quitter les lieux", vers: "235" }
  ]
  },
  {
  id: "280",
  texte: "La Clé est recouverte d'un suc digestif particulièrement acide qui transperce vos moufles et vous brûle les doigts. Vous perdez 1 point d'ENDURANCE. Lâchant aussitôt la Clé, vous plongez vos mains dans la neige pour calmer la douleur. Si vous tenez quand même à conserver cette Clé, essuyez-la dans la neige avant de la glisser dans votre poche, et inscrivez-la sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Il vous faut à présent trouver le moyen d'ouvrir la porte de la forteresse", vers: "344" }
  ]
  },
  {
  id: "281",
  texte: "Vous vous enfouissez le nez dans votre manche et vous vous détournez de la carcasse. Irian a repris connaissance et il se hâte de plonger à son tour les mains dans l'huile de Bakanal dont il s'enduit également le corps. Le jour tombe vite et vous décidez d'établir votre campement ici même. Un repas est bientôt préparé et, après avoir mangé, vous vous portez volontaire pour monter la garde au cas où des Bakanals reviendraient.",
  choix: [
    { texte: "Vous préférez de beaucoup, en effet, passer une nuit sans dormir en bravant le souffle du vent plutôt que de dormir sous la tente, dans l'effroyable odeur d'huile de Bakanal que dégagent vos guides", vers: "325" }
  ]
  },
  {
  id: "282",
  texte: "Le Barbare des Glaces était armé d'une Lance que vous pouvez vous approprier si vous le désirez. En fouillant le cadavre, vous découvrez un étrange Disque de Pierre Bleue. Si vous souhaitez conserver ce Disque de Pierre Bleue, glissez-le dans votre poche et inscrivez-le sur votre Feuille d'Aventure, dans la case Objets Spéciaux.",
  choix: [
    { texte: "Une fois parvenu en haut de l'escalier, vous pouvez prendre à gauche, en direction du nord", vers: "104" },
    { texte: "Si vous préférez prendre à droite en direction du sud", vers: "330" }
  ]
  },
  {
  id: "283",
  texte: "La porte se ferme rapidement et il ne vous reste guère d'espace pour la franchir. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, vous pourrez ajouter 3 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Porte qui se ferme",
        texte: "Si Chasse, +3",
        branches: {
        "0-4": { vers: "53", texte: "Écrasé" },
        "5-7": { vers: "16" },
        "8-12": { vers: "113" }
      }
      }
  },
  {
  id: "284",
  texte: "Après avoir parcouru une centaine de mètres, vous vous retrouvez dans une immense caverne qui s'étend dans toutes les directions aussi loin que le regard peut porter. Vous venez de pénétrer dans les Grottes de Kalte et vous contemplez en ce moment même un monde inconnu que très peu de Sommerlundais ont eu l'occasion de voir. Ce gigantesque labyrinthe souterrain fut construit par les Anciens en des temps très reculés, bien avant que les Sommerlundais eussent mis le pied sur les terres de Magnamund. Ses larges tunnels, ses temples, ses cavernes ont abrité une race de créatures pour qui la glace était un environnement naturel et, sous ces voûtes, a retenti l'écho de leurs pas et de leurs voix. Des coupes de M'iare sont toujours suspendues aux plafonds, baignant les cavernes de leur lumière éternelle. Vous marchez d'un bon pas pendant presque six heures avant d'arriver au bord d'une petite rivière au cours rapide. Sur la berge opposée, vous apercevez un tunnel qu'il vous faut emprunter pour poursuivre votre chemin. L'eau est profonde, et le seul moyen de la franchir consiste à prendre pied sur des morceaux de glace qui flottent à sa surface, en sautant de l'un à l'autre. Vous pourriez ainsi atteindre l'autre rive, mais c'est une tentative risquée et périlleuse. Pour traverser la rivière, vous devrez sauter trois blocs de glace au moins. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, vous aurez le droit d'ajouter 2 au chiffre que vous aurez tiré. Si votre total actuel d'ENDURANCE est inférieur à 8, vous devrez ôter 2 du chiffre donné par la Table.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "2-3": { vers: "94", texte: "Si le total obtenu est de - 2 à + 3," },
        "4-11": { vers: "176", texte: "S'il est de 4 à 11," }
      }
      }
  },
  {
  id: "285",
  texte: "La porte s'ouvre en coulissant latéralement, et vous découvrez avec horreur le regard d'un Barbare des Glaces qui vous fixe de ses yeux blancs totalement dépourvus de pupilles. Un cri rauque, qui ne ressemble à aucun son connu, monte de sa gorge et, un instant plus tard, les Loups Maudits s'éveillent et se mettent à grogner.",
  choix: [
    { texte: "Si vous souhaitez vous enfuir, il vous faut faire volteface et redescendre l'escalier quatre à quatre", vers: "261" },
    { texte: "Si vous préférez faire face et combattre", vers: "343" }
  ]
  },
  {
  id: "286",
  texte: "La lance vous a écorché l'épaule et vous êtes projeté à terre. Tandis que vous vous relevez tant bien que mal, l'éclaireur Barbare s'arrête, enlève ses skis et s'avance vers vous en tenant à la main une épée en os à l'aspect redoutable.",
  choix: [
    { texte: "Préparez-vous à combattre", vers: "68" }
  ]
  },
  {
  id: "287",
  texte: "Le Barbare des Glaces pousse un cri rauque qui ne ressemble à aucun son connu. Il vous a repéré et vous devez à tout prix le neutraliser avant qu'il n'avertisse toute la forteresse de votre présence.",
  choix: [
    { texte: "Vous vous préparez donc à combattre", vers: "161" }
  ]
  },
  {
  id: "288",
  texte: "Cette nuit-là, une tempête souffle sur la banquise et enterre votre tente sous la neige. Tandis que vous dormez, la toile fléchit sous le poids de cette couche compacte et vient effleurer vos Couvertures de Fourrure. Au matin, celles-ci sont trempées et, lorsque vous vous réveillez, vos deux jambes sont paralysées par de terribles crampes. Il vous faut les masser pendant presque une heure avant que vous ne puissiez à nouveau vous tenir debout.",
  choix: [
    { texte: "Vous souhaitez alors n'avoir jamais mis les pieds dans cet enfer glacé", vers: "167" }
  ]
  },
  {
  id: "289",
  texte: "Vous parvenez à ôter la cire et le bouchon sans casser la fiole dont vous pouvez à présent flairer le contenu. Si cette Discipline Kaï vous est inconnue et que vous n'ayez pas le titre d'Aspirant, l'odeur de moisissure du liquide vous rend méfiant et vous vous débarrassez de la fiole.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale, ou si vous avez le titre Kaï d'Aspirant, ou un titre supérieur (ce qui signifie que vous maîtrisez au moins 6 Disciplines Kaï)", vers: "156", requis: {"discipline":"communication-animale"} },
    { texte: "Faites un nouveau choix", vers: "10" }
  ]
  },
  {
  id: "290",
  texte: "La porte de pierre s'ouvre lentement, laissant apparaître une arcade baignée de brume qui s'élève en volutes et vous empêche de voir ce qui se trouve derrière. Vous remarquez alors que la température a brutalement baissé.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens et si vous avez atteint le rang de Gardien (ce qui signifie que vous maîtrisez 7 Disciplines Kaï)", vers: "341", requis: {"discipline":"sixieme-sens"} },
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens mais que vous n'aviez pas encore atteint le rang de Gardien", vers: "124", requis: {"discipline":"sixieme-sens"} },
    { texte: "Si vous ne maîtrisez pas la Discipline Kaï du Sixième Sens vous vous préparez au combat et vous franchissez l'arcade baignée de brume", vers: "264", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "291",
  texte: "Lorsque vous vous éveillez, vous sentez que quelque chose a changé. Il vous faut alors presque une minute pour vous rendre compte que le hurlement incessant du vent a cessé. « C'est une belle matinée », dit Irian d'un ton joyeux, en passant la tête audehors. Vous vous levez en hâte et vous allez jeter un coup d'œil à l'extérieur. Devant vous, l'étendue de glace baigne dans un air frais et limpide, et un mirage au loin semble projeter dans le ciel le paysage de Kalte. « Nous devrions arriver au lieu dit Le Roc à la nuit tombée, annonce Fenor en passant son harnais à un chien Kanu récalcitrant. Nous ferions bien d'y établir notre camp jusqu'à demain, c'est un bon abri. Sur la banquise, à cette distance de la mer, un blizzard peut se lever à tout instant et tout balayer sur son passage. Il est arrivé que des trappeurs imprudents ou malchanceux soient ainsi emportés par les vents sur des kilomètres après avoir été surpris à découvert. » Ce jourlà, les traîneaux glissent sans difficulté à la surface lisse de la banquise et les chiens peuvent avancer à bonne allure. Lorsque le soir tombe, vous avez atteint Le Roc, comme prévu : il s'agit d'un pic de granité qui s'élève à travers la glace et dont la forme étrange vous rappelle la Citadelle du roi, à Holmgard, la capitale de votre pays. Vous dressez votre tente à l'abri du Roc pour vous protéger des vents nocturnes. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "103", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "220", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "292",
  texte: "La lourde porte s'ouvre en coulissant latéralement et laisse apparaître un long pont de pierre qui traverse une vaste caverne baignant dans le rougeoiement d'un feu d'enfer. Une bouffée d'air chaud à l'odeur putride vous frappe aussitôt au visage et un bruit assourdissant met vos oreilles à rude épreuve. A15 mètres en contrebas du pont, de grandes cuves de pierre sont suspendues au-dessus de flammes ronflantes. Chacune de ces cuves est remplie d'une substance visqueuse et bouillonnante qui semble s'agiter en tous sens comme si elle était douée de vie. Peu à peu, vous commencez à comprendre ce qui se passe en ce lieu sinistre et un sentiment de peur mêlée de répulsion vous soulève le cœur. Des rangées de socles de pierre portent en effet les cadavres mutilés de Barbares des Glaces que l'on a écorchés et dont la peau est épinglée de part et d'autre du corps, comme sur une table de dissection. Des créatures hideuses s'activent autour de chacun des cadavres: c'est une véritable légion de mutants vampiriques qui grouillent ainsi sur un sol ruisselant de sang. Cette caverne est un endroit hautement maléfique, un laboratoire de cauchemar, un temple consacré par Vonotar le Traître à l'art ténébreux de la nécromancie. De l'autre côté du pont, une autre porte s'ouvre soudain et quatre Barbares des Glaces mutants s'avancent vers vous d'un pas traînant. La vue de ces malheureuses créatures vous remplit tout à la fois d'horreur et de pitié.",
  choix: [
    { texte: "Si vous souhaitez combattre les Barbares mutants", vers: "83" },
    { texte: "Si vous préférez vous enfuir de cette caverne de malheur", vers: "130" }
  ]
  },
  {
  id: "293",
  texte: "Les créatures que vous voyez devant vous sont des Languabards, de cruels et sauvages prédateurs des terres de Kalte. Les Bakanals constituent leurs proies favorites, et c'est précisément l'un de ces animaux qu'ils viennent de dévorer, abandonnant ses restes sur le sol de la caverne. Un autre passage orienté au nord vous permettrait de poursuivre votre chemin si toutefois vous parveniez à en atteindre l'entrée : il se trouve en effet tout au fond de la caverne.",
  choix: [
    { texte: "Si vous voulez essayer de passer devant les Languabarbs en espérant qu'ils ne se réveilleront pas", vers: "125" },
    { texte: "Si vous préférez rebrousser chemin et prendre l'autre tunnel, également orienté au nord", vers: "235" },
    { texte: "Enfin, si vous jugez plus judicieux d'attaquer les créatures endormies", vers: "109" }
  ]
  },
  {
  id: "294",
  texte: "Abattre la porte de cette façon représente une tâche harassante qui vous demandera six heures d'effort. Lorsque vous serez arrivé au bout de vos peines, il vous faudra prendre 2 Repas, sinon, vous perdrez 6 points d'ENDURANCE en raison de la fatigue.",
  choix: [
    { texte: "Quand enfin vous aurez réussi à creuser un trou suffisamment large pour vous permettre de passer, vous vous rendrez compte que vous avez malencontreusement attiré l'attention de quelqu'un", vers: "106" }
  ]
  },
  {
  id: "295",
  texte: "En vous voyant entrer, les deux hommes se relèvent d'un bond et s'enfuient par un petit couloir. Leurs cris de panique retentissent en écho dans les profondeurs des souterrains. Vous avez grandfaim et vous dévorez gloutonnement la carcasse rôtie, en ne cessant d'engloutir la viande que pour cracher parfois quelques os. Bientôt, vous remarquez que le feu allumé devant vous brûle dans une demi-sphère de métal. Une autre demi-sphère est posée sur le sol de glace un peu plus loin, et vous constatez que les deux moitiés s'ajustent parfaitement pour former une sphère complète. Lorsque vous séparez à nouveau les deux moitiés, le feu continue de brûler à l'intérieur: c'est donc un feu perpétuel qui est enfermé dans ce globe.",
  choix: [
    { texte: "Si vous souhaitez conserver cette Sphère de Feu, rangez-la dans votre tunique et inscrivez-la sur votre Feuille d'Aventure dans la case Objets Spéciaux", vers: "132" }
  ]
  },
  {
  id: "296",
  texte: "Malheureusement, les gardes se doutent de quelque chose et ils vous interpellent dans leur étrange langage. Il ne vous reste plus à présent qu'à les attaquer avant qu'ils aient le temps de donner l'alerte. Les vapeurs du mélange d'herbes affectent cependant vos adversaires et le combat en sera ainsi facilité. Vous n'aurez en effet à livrer que 3 Assauts ; à la fin du troisième Assaut, les Barbares des Glaces s'écrouleront à vos pieds, endormis par la mixture fumante. Si vous êtes toujours vivant à l'issue du combat, vous faites signe à Loi-Kymar de s'approcher. A votre grande joie, vous constatez alors que l'une des magnifiques portes incrustées de pierreries n'est pas fermée à clé.",
  suite: "173",
  combat: { nom: "Barbares Des Glaces", habilete: 17, endurance: 30 }
  },
  {
  id: "297",
  texte: "Au bout de cinq minutes de marche environ, le couloir tourne brusquement en direction du nord. Un peu plus loin sur votre gauche, vous apercevez une grande porte de pierre ; le levier fixé au mur, juste à côté, est en position haute et la porte fermée.",
  choix: [
    { texte: "Si vous souhaitez tirer ce levier et ouvrir la porte", vers: "317" },
    { texte: "Si vous préférez poursuivre votre chemin en direction du nord", vers: "126" }
  ]
  },
  {
  id: "298",
  texte: "Vous découvrez un étrange Triangle de Pierre Bleue attaché à une chaînette. La main décharnée de l'un des cadavres le tient étroitement serré et vous êtes obligé de fracasser les phalanges blanchies pour libérer l'objet. Si vous souhaitez conserver ce Triangle de Pierre Bleue, passez la chaînette autour de votre cou et glissez l'objet sous votre tunique. Inscrivez-le ensuite sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Vous pouvez quitter les lieux par un tunnel dont l'entrée se trouve dans le mur du fond", vers: "315" },
    { texte: "Vous pouvez également revenir sur vos pas et emprunter l'autre tunnel", vers: "125" }
  ]
  },
  {
  id: "299",
  texte: "Si vous ne possédez pas la Discipline Kaï de la Maîtrise Psychique de la Matière, des éclairs bleus jaillissent des piliers noirs et vous atteignent en pleine poitrine. Vous êtes projeté en arrière sous la force du choc et vous tombez de tout votre long sur le sol glacé du temple. Vous perdez alors 2 points d'ENDURANCE. S'il vous est possible, en revanche de recourir à la Discipline Kaï de la Maîtrise Psychique de la Matière, les éclairs se révèlent inoffensifs pour vous et vous êtes indemne.",
  choix: [
    { texte: "Si vous voulez essayer à nouveau d'appuyer sur les boutons", vers: "65" },
    { texte: "Si vous préférez quitter le temple", vers: "306" }
  ]
  },
  {
  id: "300",
  texte: "Pendant trois jours et trois nuits vous parcourez les étendues mornes et hostiles du glacier de Viad. Irian et Fenor ont tous deux souffert de cécité des neiges et il semble que le vent implacable qui souffle du nord épuise les forces de chacun. Au matin du quatrième jour, le vent tombe enfin et vous pouvez faire le point pour calculer votre position exacte. A la consternation générale, Irian annonce alors que vous vous êtes sensiblement écartés de votre route. Face à vous, les crêtes grises d'une chaîne de montagnes se dessinent dans les neiges du nord, offrant un spectacle sinistre et menaçant. «Ce sont les monts Myjavik, constate Dyce, nous sommes allés trop loin à l'est. » Son visage barbu exprime une amère déception. Les monts Myjavik se dressent à présent entre la forteresse et vous. Pour les franchir, vous devrez abandonner chiens et traîneaux, porter votre matériel sur le dos et poursuivre votre chemin à pied. Il y a une autre possibilité, mais elle vous ferait perdre deux jours qui pourraient être précieux : il s'agirait de revenir en arrière jusqu'au glacier pour reprendre là votre route jusqu'à Ikaya.",
  choix: [
    { texte: "Si vous souhaitez abandonner les traîneaux et les chiens pour franchir à pied les monts Myjavik", vers: "12" },
    { texte: "Si vous préférez perdre deux jours et revenir sur le glacier de Viad", vers: "238" }
  ]
  },
  {
  id: "301",
  texte: "« Nous sommes à l'étage où se trouve la salle du Trône du Brumalmarc, murmure Loi-Kymar en regardant à travers une fente de la porte de la cuisine. Elle est située au bout de ce couloir. » Deux Barbares des Glaces sont assis près des portes incrustées de pierreries qui donnent accès à la grande salle du Trône. Ils sont protégés de la tête aux pieds par d'étranges armures en os et armés d'épées de cristal. Le vieux magicien se tourne vers vous et dit : « Avec eux, il faut agir vite et en silence. » Il tire alors de ses poches trois bocaux et marmonne une incantation en mélangeant leurs contenus dans un bol de pierre. Il prend ensuite un pichet d'eau dont il verse quelques gouttes sur la mixture : aussitôt, un filet de fumée bleue s'élève du bol. « Voici qui fera taire les gardes si nous parvenons à placer le bol suffisamment près d'eux. »",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Camouflage", vers: "122", requis: {"discipline":"camouflage"} },
    { texte: "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière", vers: "228", requis: {"discipline":"maitrise-matiere"} },
    { texte: "Si vous maîtrisez la Discipline Kaï de la Chasse", vers: "347", requis: {"discipline":"chasse"} },
    { texte: "Si vous ne maîtrisez aucune de ces Disciplines", vers: "179" }
  ]
  },
  {
  id: "302",
  texte: "Vous descendez une hauteur de 60 mètres avant d'atteindre le fond de la crevasse. Il y règne une totale obscurité, à l'exception d'une petite lueur que l'on peut apercevoir au loin. Vous vous dirigez vers cette lueur, mais vous n'avancez que lentement et péniblement. De gros fragments de roc et de glace sont répandus çà et là sur le sol et, dans l'obscurité, vous vous y cognez sans cesse, en tombant quelquefois. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Sixième Sens, vous pouvez ajouter 2 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-1": { vers: "37", texte: "Si le total obtenu est de 0 ou 1," },
        "2-7": { vers: "193", texte: "De 2 à 7," },
        "8-11": { vers: "243", texte: "De 8 à 11," }
      }
      }
  },
  {
  id: "303",
  texte: "Vous insérez la Clé dans la serrure et vous la tournez dans le sens des aiguilles d'une montre. Un cliquetis vous indique que le mécanisme fonctionne. Peu à peu, la tige de la Clé s'enfonce dans le trou de la serrure et la Clé toute entière, vous glissant des doigts, y disparaît bientôt. Le grand couvercle de pierre s'ouvre alors, laissant apparaître un magnifique Casque d'Argent.",
  choix: [
    { texte: "Si vous souhaitez vous coiffer de ce Casque", vers: "308" },
    { texte: "Si vous préférez le laisser là où il est, vous pouvez à présent poursuivre votre chemin en montant l'escalier", vers: "323" }
  ]
  },
  {
  id: "304",
  texte: "Le Glaive puissant illumine le passage de son flamboiement d'or. Le Monstre d'Enfer pousse un hurlement aigu et bat en retraite, les yeux rouges étincelant de haine et de peur. Il a reconnu en effet l'arme que vous brandissez, une arme dont le pouvoir signifie, pour ceux de son espèce, la mort et la destruction éternelle. Saisi de panique, il vous attaque en faisant usage de sa redoutable Puissance Psychique. Si vous ne maîtrisez pas la Discipline Kaï du Bouclier Psychique, vous perdrez 2 points d'ENDURANCE supplémentaires à chaque Assaut que vous livrerez contre cette créature. Sachez aussi qu'elle est elle-même invulnérable à votre propre Puissance Psychique, si vous maîtrisez cette Discipline Kaï. Cependant, le Monstre d'Enfer appartenant à l'espèce des morts vivants, vous aurez le droit de doubler tous les points d'ENDURANCE perdus par lui, cela en raison de la puissance du Glaive de Sommer.",
  suite: "20",
  combat: { nom: "Monstre d'Enfer", habilete: 22, endurance: 30 }
  },
  {
  id: "305",
  texte: "L'énorme bête roule à bas du traîneau et s'immobilise dans la neige. Fenor a réussi à allumer une torche et l'agite devant les deux autres Bakanals qui s'enfuient terrifiés. Vous saluez par des cris de joie la défaite des créatures et vous vous tournez vers vos courageux guides pour les féliciter. Vous êtes alors stupéfait de voir qu'ils ont commencé à dépecer le cadavre du Bakanal que vous avez tué. Avec dégoût, vous voyez Dyce ouvrir le ventre de la bête sur toute sa longueur avec son couteau de chasse. Il écarte ensuite la peau et plonge les mains dans la graisse de l'animal. L'odeur qui se dégage de cette graisse est infecte, à tel point que les chiens Kanu eux-mêmes s'enfouissent le museau dans la neige pour essayer de ne pas la sentir. Lorsque enfin les deux guides commencent à s'enduire le visage et le corps de cette substance répugnante, vous avez du mal à en croire vos yeux. « C'est de l'huile de Bakanal, lance Fenor d'un ton réjoui, c'est ce qu'il y a de mieux pour se protéger contre le froid et l'humidité. » Il plonge à nouveau la main dans le cadavre de la bête et vous tend une poignée de cette gelée putride.",
  choix: [
    { texte: "Si vous souhaitez suivre son exemple et vous enduire à votre tour de cette graisse pestilentielle", vers: "8" },
    { texte: "Si en revanche la perspective de sentir aussi bon qu'une bassine de roquefort rance ne vous séduit guère", vers: "281" }
  ]
  },
  {
  id: "306",
  texte: "Lorsque vous avez franchi l'arcade, vous remarquez un levier fixé dans le mur. Vous le tirez et une porte coulisse aussitôt, fermant le temple derrière vous. La température est plus élevée dans ce passage et vous entendez quelque part au loin un sourd grondement. Devant vous, vous apercevez une lueur, au bout du sombre couloir. Cette lueur filtre à travers une ouverture proche du sol et par laquelle vous distinguez un autre couloir, à 3 mètres au-dessous.",
  choix: [
    { texte: "Si vous souhaitez vous glisser à travers cette ouverture et sauter dans le couloir en contrebas", vers: "206" },
    { texte: "Si vous préférez poursuivre votre chemin le long du passage", vers: "6" }
  ]
  },
  {
  id: "307",
  texte: "Vous vous préparez à combattre et vous faites signe aux autres de passer à l'attaque. Les Barbares des Glaces ont tôt fait de mesurer le danger qui les menace et ils s'enfuient vers l'ouest. Vous avez alors la mauvaise surprise de constater qu'ils sont équipés de skis et peuvent ainsi s'échapper très vite. Chacun de ces Barbares vêtus de fourrure porte attaché dans le dos une tige au bout de laquelle flotte un étrange drapeau bleu. « Ce sont les éclaireurs d'un convoi de traîneaux, dit Irian, la main en visière pour se protéger de l'éclat de la neige, leurs \" Banachs bleus \" (c'est ainsi que l'on appelle leurs drapeaux) indiquent qu'ils escortent une expédition de marchands. Ils reviennent probablement du comptoir de Liouk. Leur convoi ne doit pas être à plus de quelques kilomètres, 7 ou 8 tout au plus. »",
  choix: [
    { texte: "Si vous souhaitez poursuivre votre chemin en direction d'Ikaya en essayant de prendre les Barbares de vitesse avant qu'ils ne puissent revenir avec des renforts", vers: "327" },
    { texte: "Si vous préférez suivre ces éclaireurs vers l'ouest pour essayer d'en savoir plus au sujet de leur convoi", vers: "178" }
  ]
  },
  {
  id: "308",
  texte: "En dépit de sa taille, le Casque vous paraît léger et agréable à porter. Inscrivez-le sur votre Feuille d'Aventure, dans la case Objets Spéciaux. Chaque fois que vous en serez coiffé au cours d'un combat, il augmentera de 2 points votre total d'HABILETÉ. Le couvercle du coffre se referme lentement et vous quittez les lieux, enchanté de votre trouvaille.",
  choix: [
    { texte: "Vous poursuivez ensuite votre chemin le long du couloir et vous montez l'escalier", vers: "323" }
  ]
  },
  {
  id: "309",
  texte: "Vous fouillez les cadavres des Barbares et vous découvrez, passée au cou de l'un d'eux, une chaînette à laquelle est accroché un Triangle de Pierre Bleue. Si vous souhaitez conserver cet objet, inscrivez-le sur votre Feuille d'Aventure dans la case Objets Spéciaux. Vous êtes affamé et vous dévorez gloutonnement la carcasse rôtie en ne cessant d'engloutir la viande que pour cracher parfois quelques os. Bientôt, vous remarquez que le feu allumé devant vous brûle dans une demi-sphère de métal. Une autre demi-sphère est posée sur le sol de glace, un peu plus loin, et vous constatez que les deux moitiés s'ajustent parfaitement pour former une sphère complète. Lorsque vous séparez à nouveau les deux moitiés, le feu continue de brûler à l'intérieur : c'est donc un feu perpétuel qui est enfermé dans ce globe. Si vous souhaitez conserver cette Sphère de Feu, rangez-la dans votre tunique et inscrivez-la sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Vous finissez alors les derniers restes de viande encore attachés aux os et vous retournez dans le tunnel", vers: "132" }
  ]
  },
  {
  id: "310",
  texte: "Vous ouvrez la Sphère de Feu et, aussitôt, un mugissement sonore retentit à vos oreilles. Le cyclone s'immobilise et il ne s'approchera plus de vous tant que vous tiendrez dans vos mains la Sphère enflammée.",
  choix: [
    { texte: "Si vous souhaitez quitter le temple", vers: "306" },
    { texte: "Si vous préférez examiner l'autel et l'alcôve qui l'abrite", vers: "72" }
  ]
  },
  {
  id: "311",
  texte: "Ce liquide vous est familier, il s'agit d'une décoction d'Alether, une Potion de Force dont vos maîtres Kaï se servaient pour augmenter leur HABILETÉ au combat. Cette fiole contient suffisamment de Potion d'Alether pour augmenter de 4 points votre total d'HABILETÉ pour la durée d'un seul combat. Vous devrez la boire juste avant le combat pendant lequel vous souhaiterez voir votre HABILETÉ ainsi accrue. Si vous voulez conserver cette Potion, inscrivez-la sur votre Feuille d'Aventure dans la liste des objets contenus dans votre Sac à Dos.",
  suite: "10",
  choix: [
    { texte: "Faites un nouveau choix", vers: "10" }
  ],
  effets: { objets: [{"id":"potion-alether","quantity":1}] }
  },
  {
  id: "312",
  texte: "Vous essayez désespérément de dégager votre pied, mais le traîneau bascule déjà dans la crevasse. Vous êtes alors précipité dans le vide. Votre chute vous semble interminable et, tandis que vous tombez ainsi d'une hauteur de plusieurs centaines de mètres, les cris horrifiés de vos guides retentissent à la surface, de plus en plus lointains. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Chute dans la crevasse — §312"
  },
  {
  id: "313",
  texte: "Les cadavres des mutants sont étendus à vos pieds. Vous vous apprêtez à les enjamber pour attaquer la créature qui les commande mais, à ce moment, plusieurs autres de ces misérables monstres apparaissent aux côtés de leur maître. Ils sont trop nombreux pour que vous ayez une chance de leur résister et il vous faut donc vous enfuir au plus vite pour échapper à une mort certaine.",
  choix: [
    { texte: "Vous vous précipitez donc vers la porte par laquelle vous êtes entré et vous courez le long du couloir principal aussi vite que vos jambes tremblantes peuvent vous porter", vers: "130" }
  ]
  },
  {
  id: "314",
  texte: "Vous parcourez encore une centaine de mètres le long de la paroi rocheuse, et vous découvrez alors une grande fissure : c'est l'entrée d'une grotte. Dans votre impatience d'échapper à la morsure du vent, vous vous hâtez d'y entrer et, dans l'obscurité, vous ne remarquez pas la crevasse qui s'ouvre dans le sol de la grotte.",
  choix: [
    { texte: "Vous tombez aussitôt tête la première dans les ténèbres, accompagné d'une avalanche de glace et de pierres", vers: "240" }
  ]
  },
  {
  id: "315",
  texte: "Vous arrivez bientôt dans une vaste caverne où, sous la pression de la glace en mouvement, une immense crevasse s'est ouverte dans le sol. Elle fait une vingtaine de mètres de large et il n'y a apparemment aucun moyen de la traverser. En jetant un coup d'œil dans le gouffre, vous remarquez que des marches ont été grossièrement taillées dans la paroi, permettant ainsi de descendre dans les ténèbres.",
  choix: [
    { texte: "Si vous souhaitez descendre ces marches", vers: "302" },
    { texte: "Si vous préférez revenir sur vos pas en direction de l'autre tunnel", vers: "125" }
  ]
  },
  {
  id: "316",
  texte: "Ce Bracelet dégage une aura de puissance qui vous met mal à l'aise. Les Barbares des Glaces fabriquent leurs armes à l'aide d'os et de dents. Il n'y a en effet aucune mine à Kalte et les métaux y sont considérés comme un bien rare et précieux, tous les métaux, pas seulement l'or. Or, d'après ce que vous savez, lorsque les Barbares des Glaces vont échanger leurs fourrures contre du métal, seul l'acier les intéresse. Ces cruels chasseurs sont tout à fait insensibles à l'art de la joaillerie. Vous en tirez donc la conclusion que ce Bracelet était porté par obligation et non par quelque souci de coquetterie. Vous pouvez prendre ce Bracelet d'Or et le passer à votre poignet ; inscrivez-le alors sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Si vous décidez de passer ce Bracelet à votre poignet", vers: "236" },
    { texte: "Si vous préférez le laisser là, poursuivez votre chemin le long du couloir en direction du croisement situé plus loin", vers: "215" }
  ]
  },
  {
  id: "317",
  texte: "La porte de pierre commence à s'ouvrir en grinçant, mais elle se coince brusquement alors qu'elle est simplement entrebâillée. L'ouverture ainsi ménagée ne fait guère plus d'une soixantaine de centimètres de large et vous parvenez tout juste à vous y faufiler. Derrière la porte, vous découvrez une pièce à la température glaciale et qui sent le renfermé. De toute évidence, il doit y avoir une éternité que personne n'est entré ici. Des étagères de pierre fixées au mur sont surchargées de bouteilles et de flacons, tandis que, sur une table, au centre de la pièce, est posé un sac rempli de potions de différentes couleurs.",
  choix: [
    { texte: "Si vous souhaitez examiner ces anciennes potions", vers: "10" },
    { texte: "Si vous préférez quitter les lieux et poursuivre votre chemin en direction du nord", vers: "126" }
  ]
  },
  {
  id: "318",
  texte: "Vous devinez que le Bakanal cherche désespérément quelque chose à manger. Votre Discipline Kaï, cependant, ne vous sera d'aucune utilité : en effet, à présent qu'il a senti l'odeur des chiens Kanu, il vous sera impossible de lui ordonner de quitter le campement. Vous n'ignorez pas que les Bakanals sont de courageux chasseurs qui n'ont peur de rien, ou plutôt, qui n'ont peur que d'une seule chose : le feu. Vous saisissez alors une torche, vous l'allumez et vous vous précipitez hors de la tente. Il fait nuit noire et il tombe une neige épaisse, mais un mouvement à votre droite trahit la présence du Bakanal qui s'avance vers vous. Au moment où il s'apprête à bondir, il aperçoit la flamme de la torche et pousse aussitôt un hurlement de terreur. Une seconde plus tard, il a fait volte-face et il disparaît dans la nuit.",
  choix: [
    { texte: "Les chiens Kanu sont sains et saufs, mais pour être sûr que les Bakanals ne reviendront pas, vous décidez, cette nuit-là, de prendre des tours de garde en conservant une torche et une arme à portée de main", vers: "134" }
  ]
  },
  {
  id: "319",
  texte: "Vous visez soigneusement et vous jetez les Pièces d'Or dans le couloir. Alerté par ce bruit soudain, le guerrier tire son épée en os et va voir de quoi il retourne. Votre plan s'est révélé efficace : le Barbare est en effet à quatre pattes, en train de chercher les Pièces et il ne vous voit pas passer derrière lui. Vous pouvez à présent monter l'escalier.",
  choix: [
    { texte: "N'oubliez pas de déduire sur votre Feuille d'Aventure les Pièces d'Or que vous avez utilisées", vers: "332" }
  ]
  },
  {
  id: "320",
  texte: "Vous parvenez à immobiliser l'enfant et à ôter de sa botte un poignard en os qu'il cherchait à atteindre pour vous frapper dans le dos. Les Barbares des Glaces, pendant ce temps, vous ont encerclé, mais ils n'osent pas vous attaquer tant que vous tenez un de leurs enfants en otage. Le poignard en os appuyé contre la gorge du jeune garçon, vous vous approchez prudemment du traîneau, mais vous vous rendez bientôt compte que vous ne parviendrez pas à distancer vos poursuivants sur un traîneau chargé. Il va falloir prendre rapidement une décision.",
  choix: [
    { texte: "Si vous souhaitez débarrasser le traîneau de son chargement, libérer l'enfant Barbare et vous enfuir sur le traîneau ainsi allégé", vers: "190" },
    { texte: "Si vous préférez vous débarrasser du chargement mais garder l'enfant en otage au cours de votre fuite", vers: "33" }
  ]
  },
  {
  id: "321",
  texte: "Vous suivez ce souterrain glacé et sinueux sur plusieurs kilomètres avant d'arriver enfin dans une grotte. Un petit cours d'eau coule au milieu de cette caverne et un autre passage permet de continuer en direction du nord. Lorsque vous sautez le ruisseau, vous apercevez au fond de l'eau un petit Triangle de Pierre Bleue accroché à une chaînette. Si vous souhaitez conserver ce Triangle de Pierre Bleue, passez la chaînette autour de votre cou et glissez le Triangle sous votre tunique. N'oubliez pas ensuite d'inscrire l'objet sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Une lumière plus intense éclaire le passage orienté au nord et vous distinguez au loin une grande caverne", vers: "235" }
  ]
  },
  {
  id: "322",
  texte: "Tandis que vous courez sur la surface glissante, la glace commence à se fissurer. En jetant un coup d'œil derrière vous, vous constatez que le Languabarb s'est arrêté au bord du lac. Il semble terrifié par l'ombre noire que vous aviez vu évoluer dans l'eau. Or, cette ombre vient justement de réapparaître à moins de 5 mètres de vous. La panique vous saisit et vous vous mettez à courir de plus en plus vite en priant le ciel que votre chance et la glace tiennent bon. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-2": { vers: "153", texte: "Si vous tirez le 0, le 1 ou le 2," },
        "3-9": { vers: "59", texte: "Si vous tirez un chiffre de 3 à 9," }
      }
      }
  },
  {
  id: "323",
  texte: "Vous montez plus de cent marches avant d'arriver enfin à un palier étroit. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Sixième Sens, celle de l'Orientation'ou de la Chasse, ajoutez 3 au chitfre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "76", texte: "Si vous obtenez un total de 0 à 4," },
        "5-12": { vers: "2", texte: "De 5 à 12," }
      }
      }
  },
  {
  id: "324",
  texte: "Tandis que le répugnant Akranionor meurt à vos pieds, vous voyez le traître bossu descendre de sa plate-forme et se précipiter vers une porte, un peu plus loin. Vous vous apprêtez à le poursuivre lorsque vous vous immobilisez soudain en découvrant le corps de Loi-Kymar étendu dans le fossé. Il est mort, tué au cours du combat psychique qui l'a opposé à Vonotar. La colère bouillonne en vous et vous brandissez votre arme en vous lançant à la poursuite de l'infâme renégat ; cette fois, vous êtes décidé à le tuer. La porte s'ouvre sur un long couloir au bout duquel se trouve une arcade fermée par des rideaux.",
  choix: [
    { texte: "D'un geste vif, vous écartez les rideaux et vous continuez à courir", vers: "61" }
  ]
  },
  {
  id: "325",
  texte: "Le lendemain matin, le ciel est clair et il n'y a pas de vent. Les rayons du soleil percent une fine couche de nuages en baignant l'horizon d'une lueur rose pâle. Contemplant ce spectacle magnifique, vous vous rappelez ce que vous ont dit un jour vos Maîtres Kaï : la lumière de Kalte est unique, il n'en existe de semblable nulle part ailleurs, dans les terres de Magnamund tout au moins. Le matériel et la tente sont bientôt chargés sur les traîneaux et vous quittez le défilé pour vous aventurer sur la plaine de Hrod. Il vous faut désormais parcourir plus de 150 kilomètres d'une étendue glacée avant d'atteindre le défilé de la Tempête. Tout d'abord, le voyage ne présente pas de difficultés. Le vent a en effet balayé la plaine, rendant le sol parfaitement lisse et aucune crevasse ne se cache sous la neige dure et compacte. A l'aube du troisième jour, cependant, les choses tournent mal. Vous êtes tiré d'un sommeil profond par Dyce qui vous secoue l'épaule. De toute évidence, il a l'air terrifié. « Que se passe-t-il ? » demandez-vous d'une vois endormie, le regard encore brouillé. « A l'horizon... des Barbares des Glaces, répond Dyce d'une voix hachée, ils sont vingt, peut-être plus. Ils ont cinq traîneaux à voile et une escorte de guerriers. Je crois bien qu'ils nous ont vus. » En un instant, vous vous arrachez tous à vos Couvertures de Fourrure et vous commencez à replier la tente. Dyce a raison, les Barbares des Glaces sont bien là, en effet, et ils se dirigent vers vous en venant de l'ouest. « S'ils nous attrapent, nous sommes morts, » avertit Fenor en achevant d'arrimer le matériel sur les traîneaux. Les Barbares des Glaces des terres de Kalte constituent une peuplade féroce et guerrière aux mœurs nomades. Pendant des millénaires, ils ont sillonné ces déserts glacés en chassant les animaux pour leur fourrure et en domestiquant des mammouths. Les seuls contacts qu'ils entretiennent avec le reste de Magnamund s'établissent au comptoir de commerce de Liouk. En été, lorsque la banquise a fondu autour de Liouk, ils se rendent dans la ville pour y échanger leurs fourrures contre les armes et les outils qu'ils ne peuvent fabriquer eux-mêmes, le bois et le fer n'existant pas à l'état naturel dans les terres de Kalte. Ces Barbares éprouvent une haine profonde pour tous les autres peuples et ils tuent sans pitié quiconque vient s'aventurer dans leur domaine de glace.",
  choix: [
    { texte: "Bientôt, vous entendez leurs cris de guerre, à moins de 5 kilomètres de distance et, pour la première fois depuis que vous êtes arrivé à Kalte, vous priez le ciel qu'un blizzard se lève pour vous permettre de leur échapper", vers: "216" }
  ]
  },
  {
  id: "326",
  texte: "Au bout d'un moment d'intense concentration, l'image de la serrure se forme peu à peu dans votre esprit. Cette serrure est protégée par un enchantement, mais votre Discipline Kaï, soutenue par votre farouche détermination, finit par l'emporter. Vous entendez en effet un cliquetis indiquant que vos efforts ont été couronnés de succès. Vous avez dû, cependant, dépenser une énergie considérable et vous perdez 1 point d'ENDURANCE. Quelques instants plus tard, le lourd couvercle de pierre s'ouvre tout seul et silencieusement, laissant apparaître un magnifique Casque d'Argent.",
  choix: [
    { texte: "Si vous souhaitez vous coiffer de ce Casque", vers: "308" },
    { texte: "Si vous préférez le laisser là où il est, vous pouvez poursuivre votre chemin en montant l'escalier", vers: "323" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "127", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "327",
  texte: "A mesure que vous approchez d'Ikaya, votre récente rencontre avec les Barbares des Glaces vous préoccupe de plus en plus. Allez-vous réussir à arriver avant eux ou bien sont-ils déjà en train de vous préparer une embuscade ? Irian et Fenor semblent tous les deux très inquiets et vous ne dites pas grand-chose tandis que vous parcourez ce trajet difficile. Vos soucis, cependant, vous font oublier d'autres dangers plus familiers : parvenu en effet à une douzaine de kilomètres de la forteresse, la neige se dérobe soudain et vous êtes précipité dans une crevasse que vous n'aviez pas vue. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-8": { vers: "105", texte: "Si vous tirez un chiffre de 0 à 8," },
        "9-9": { vers: "144", texte: "Si vous tirez le 9," }
      }
      }
  },
  {
  id: "328",
  texte: "En dépit de sa frêle constitution, l'homme monte à la Corde avec une rapidité et une agilité surprenantes. Vous le hissez à travers l'ouverture et vous récupérez votre Corde. « L'escalier, dit-il en montrant l'obscurité, c'est par là que nous pourrons nous enfuir, mais il vaut mieux que vous passiez devant. J'ai en effet trop mal aux yeux pour y voir clairement : les séquelles de la cécité des neiges. » Vous rangez votre Corde dans votre Sac à Dos et vous avancez le long du passage. Vous vous apprêtez à descendre les marches lorsque des mains squelettiques vous saisissent parderrière et se referment autour de votre cou. Un cri terrifiant trahit alors la véritable identité du prétendu « marchand ». C'est en fait un Monstre d'Enfer, un redoutable serviteur des Maîtres des Ténèbres, une créature qui a la faculté de changer d'apparence à sa guise. Le Monstre a réussi à vous convaincre de le libérer et il a maintenant l'intention de vous tuer. Vous tentez désespérément de reprendre votre souffle tandis que les phalanges décharnées de la créature vous déchirent et vous brûlent la gorge. Vous perdez aussitôt 6 points d'ENDURANCE. Si vous êtes toujours vivant, vous parvenez enfin à vous libérer de l'étreinte d'acier mais il vous faut à présent engager avec le Monstre un combat à mort. La surprise de l'attaque et la blessure que votre agresseur vous a infligée au cou vous interdisent d'avaler quelque Potion que ce soit avant de l'affronter.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "99", requis: {"special":"glaive-sommer"} },
    { texte: "Sinon", vers: "175" }
  ]
  },
  {
  id: "329",
  texte: "Ce sont des Languabarbs que vous entendez et ils sont trois en tout. 11 s'agit là de créatures malfaisantes qui habitent les montagnes de Kalte. Prédateurs redoutables, leur gibier préféré est le Bakanal.",
  choix: [
    { texte: "Si vous vous êtes enduit le corps d'huile de Bakanal", vers: "202" },
    { texte: "Sinon, vous pouvez éviter les Languabarbs en revenant sur vos pas, vers l'entrée de l'autre tunnel", vers: "284" },
    { texte: "Enfin, si vous souhaitez attaquer ces créatures", vers: "138" }
  ]
  },
  {
  id: "330",
  texte: "Vous parvenez bientôt au pied d'un escalier en colimaçon ; il semble qu'il n'y ait pas d'autre choix que de l'emprunter. Après avoir monté plus de deux cents marches, vous arrivez dans un couloir qui mène à un balcon. A une dizaine de mètres audessous, vous apercevez Vonotar le Traître qui fait face à deux guerriers Barbares. Il est en train de passer un Bracelet d'Or au poignet de l'un d'eux et, de toute évidence, il ne s'est pas aperçu de votre présence. Il n'existe pas d'escalier permettant de descendre dans la salle où se trouve Vonotar; en revanche, vous découvrez une porte au bout du balcon.",
  choix: [
    { texte: "Si vous possédez une Corde, vous pouvez vous en servir pour descendre du balcon et tenter de capturer Vonotar", vers: "100" },
    { texte: "Si vous n'avez pas de Corde, vous pouvez redescendre l'escalier en colimaçon", vers: "148" },
    { texte: "Enfin, si vous préférez examiner la porte, au bout du balcon", vers: "61" }
  ]
  },
  {
  id: "331",
  texte: "Le lendemain, la température descend et un froid rigoureux s'installe. Des vents du nord amènent une grêle de glace qui vous cingle le visage et vos lèvres gercées se mettent à saigner. Vers midi, vous êtes pris dans un blizzard qui rend votre progression difficile et épuisante. Le vent violent vous force à descendre du traîneau pour le pousser. Vous êtes exténué, vos mains et vos orteils sont engourdis par le froid et la transpiration provoquée par vos efforts harassants a gelé sur votre peau, déposant à l'intérieur de vos moufles et de vos bottes une couche de glace. Lorsque vous atteignez enfin le glacier, la nuit est presque tombée, et vous êtes tous si fatigués que vous avez à peine suffisamment de force pour dresser la tente et prendre un repas. La situation frise le désastre. Vos orteils, vos doigts et votre nez ont subi la morsure du gel et, à moins que vous ne maîtrisiez la Discipline Kaï de la Guérison, vous perdez 4 points d'ENDURANCE. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "62", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "288", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "332",
  texte: "Au sommet de l'escalier, vous découvrez un vaste palier que traverse un couloir orienté nord-sud.",
  choix: [
    { texte: "Si vous souhaitez vous diriger vers le nord", vers: "104" },
    { texte: "Si vous préférez aller au sud", vers: "69" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens ou celle de la Chasse", vers: "249", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "333",
  texte: "La rapidité de vos réflexes vous a sauvé. L'extrémité de la lance du Barbare déchire en effet votre manche sans provoquer d'autres dommages. Un instant plus tard, cependant, l'éclaireur Barbare s'arrête, déchausse ses skis puis, d'un geste rapide qui traduit une longue habitude, il tire une épée en os.",
  choix: [
    { texte: "Il faut vous préparer à combattre", vers: "68" }
  ]
  },
  {
  id: "334",
  texte: "Un panneau s'ouvre à côté du pilier de droite, découvrant un compartiment secret dans lequel a été dissimulée une magnifique Pierre Rayonnante. Elle est tiède au toucher et ses facettes étincellent. Si vous souhaitez conserver cette Pierre Rayonnante, glissez-la dans votre poche et inscrivez-la sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Si vous souhaitez appuyer à nouveau sur les boutons", vers: "65" },
    { texte: "Si vous préférez quitter le temple", vers: "306" }
  ]
  },
  {
  id: "335",
  texte: "La paroi glacée offre de nombreuses prises, mais vous ne pouvez pas vous y agripper tant que vous portez vos moufles ; en revanche, si vous ôtez vos moufles, vous aurez sans nul doute à subir la morsure du gel.",
  choix: [
    { texte: "Si vous souhaitez risquer votre vie et vos mains, vous pouvez entrep", vers: "55" },
    { texte: "Si vous préférez y renoncer, vous pouvez essayer de trouver une issue pour quitter la caverne", vers: "182" }
  ]
  },
  {
  id: "336",
  texte: "Au bout d'une vingtaine de mètres, vous arrivez au pied d'un escalier dont vous montez les marches. Parvenu au sommet, vous apercevez un peu plus loin une faible lumière qui se répand sur le sol malpropre d'un nouveau couloir. Vous vous approchez de cette lueur et vous découvrez une ouverture aménagée dans la paroi. En regardant au travers, vous apercevez un vieil homme recroquevillé dans le coin d'une cellule, à 5 ou 6 mètres en contrebas. Ses cheveux sont longs et emmêlés et la saleté dont sa toge est incrustée a presque effacé les croissants de lune et les étoiles brodés sur l'étoffe.",
  choix: [
    { texte: "Si vous souhaitez appeler ce vieil homme", vers: "247" },
    { texte: "Si vous préférez poursuivre votre chemin le long du couloir", vers: "30" }
  ]
  },
  {
  id: "337",
  texte: "L'éclaireur Barbare passe à côté de vous comme un éclair, puis il s'immobilise quelques mètres plus loin dans un impeccable christiania. Il déchausse aussitôt ses skis et, d'un geste rapide qui révèle une longue pratique, il tire une épée en os à l'aspect menaçant.",
  choix: [
    { texte: "Il faut vous préparer à combattre", vers: "68" }
  ]
  },
  {
  id: "338",
  texte: "Vous enjambez les cadavres des Barbares des Glaces et vous apercevez à ce moment une créature grotesque qui vous observe, tapie au coin d'un couloir situé à votre gauche. La créature disparaît aussitôt et vous ne l'avez donc vue que l'espace d'un bref instant, mais la vision que vous en gardez suffit cependant à vous faire frissonner d'horreur. Cet être est en effet constitué d'une énorme tête humaine posée sur de grands pieds et pourvue d'une longue queue couverte d'écaillés. La créature est vêtue d'une cape à capuchon et, de toute évidence, elle n'a pas de torse. L'image de cet être de cauchemar vous remplit de dégoût et vous vous demandez, le cœur battant, quelles autres monstruosités vous attendent encore.",
  choix: [
    { texte: "Si vous souhaitez vous lancer à la poursuite de l'étrange créature", vers: "87" },
    { texte: "Si vous préférez fouiller les cadavres des Barbares des Glaces", vers: "26" }
  ]
  },
  {
  id: "339",
  texte: "Dix minutes plus tard, vos pieds et vos mains ont subi les effets du gel. Sur cette paroi exposée, les vents glacés soufflent à plus de 150 kilomètres à l'heure. Vous tenez bon pendant encore une demi-heure, mais le froid a finalement raison de vous : vous perdez connaissance et vous tombez d'une hauteur de 900 mètres. Faut-il préciser que votre mission s'achève ici en même temps que votre vie ?",
  fin: "mort",
  nomFin: "Mort — §339"
  },
  {
  id: "340",
  texte: "Vous traînez les cadavres hors de la cuisine et vous les abandonnez derrière la porte secrète. Lorsque vous revenez, LoiKymar est occupé à examiner les bocaux remplis d'herbes qui sont alignés sur les étagères. Il prend plusieurs de ces bocaux qu'il range dans ses poches, puis il en ouvre deux autres dont il mélange le contenu dans un petit bol de pierre. Il vous tend ensuite une poignée d'herbes sèches en vous conseillant de les manger. « Elles vous rendront vos forces, Loup Solitaire», dit-il. Vous mangez les herbes au goût douceâtre et une chaleur bienfaisante rayonne aussitôt dans tout votre corps.",
  choix: [
    { texte: "Vous pouvez ajouter 6 points d'ENDURANCE à votre total actuel", vers: "301" }
  ]
  },
  {
  id: "341",
  texte: "Vous sentez la présence d'une force puissante derrière cette arcade baignée de brume. Et, tandis que vous vous concentrez, le souvenir vous revient d'une légende qu'on vous avait racontée dans votre enfance: la « Légende de la Porte de Vagadyn ». C'était l'histoire de Démons de Glace qui avaient mené une guerre pour pouvoir quitter leur monde et venir à Kalte. Ces créatures n'avaient pas de corps, pas de forme, pas de substance, elles n'étaient que pure énergie dans une autre dimension, audelà des limites du temps et de l'espace. Or, les Démons de Glaces avaient découvert la Porte de Vagadyn, un seuil qui reliait leur monde à celui de Magnamund et ils se battaient entre eux pour passer cette Porte sans se douter du sort qui les attendait de l'autre côté. Car les Anciens, eux aussi, connaissaient l'existence du seuil de Vagadyn et, chaque fois qu'un Démon le franchissait, ils l'emprisonnaient dans un cristal, pour utiliser son énergie à bâtir la forteresse d'Ikaya. Les coupes de M'iare qui éclairent d'une lumière éternelle les souterrains d'Ikaya contiennent ainsi les esprits de Démons de Glace inférieurs qui y sont enfermés. Vous vous rappelez également que, dans ce conte, on promettait les pires malheurs à quiconque détruirait la prison de cristal d'un de ces Démons car alors, la créature immatérielle chercherait à s'emparer du corps de son sauveur.",
  choix: [
    { texte: "Averti par la mise en pratique de votre Discipline Kaï, vous franchissez l'arcade baignée de brume", vers: "264" }
  ]
  },
  {
  id: "342",
  texte: "Votre Discipline Kaï de l'Orientation vous révèle que le tunnel de droite est orienté à l'est et celui de gauche au nord. Vous vous trouvez en ce moment juste au-dessous du mont des Brumes. Consultez la carte de Kalte qui figure au début de ce volume pour choisir le tunnel que vous allez emprunter.",
  choix: [
    { texte: "Si vous prenez le tunnel orienté à l'est", vers: "199" },
    { texte: "Si vous préférez celui qui mène vers le nord", vers: "284" }
  ]
  },
  {
  id: "343",
  texte: "L'étroitesse de la cellule interdit à vos adversaires de vous attaquer tous en même temps. Vous devrez donc les combattre un par un en respectant l'ordre dans lequel ils sont disposés cidessous. Il est à noter que le Barbare des Glaces est insensible à la Discipline Kaï de la Puissance Psychique.",
  suite: "343-b",
  choix: [
    { texte: "HABILETÉ ENDURANCE Premier LOUP MAUDIT 15 24 Deuxième LOUP MAUDIT 14 23 Troisième LOUP MAUDIT 14 20 BARBARE DES GLACES 17 29 Si vous sortez vainqueur de ce quadruple combat", vers: "28" }
  ],
  combat: { nom: "Loup Maudit", habilete: 15, endurance: 24 }
  },
  {
  id: "344",
  texte: "La porte de la forteresse est complètement lisse et ne comporte apparemment ni serrure, ni gond, ni trou de serrure. En examinant le mur d'à côté, vous découvrez cependant que l'un des blocs qui le constituent est différent des autres : un petit triangle est en effet gravé à sa surface.",
  choix: [
    { texte: "Si vous possédez un Triangle de Pierre Bleue", vers: "41" },
    { texte: "Sinon", vers: "147" }
  ]
  },
  {
  id: "345",
  texte: "Vous fermez les yeux et vous vous concentrez pour essayer de résister à la Force Mentale. Peu à peu, vous parvenez à surmonter votre douleur, juste assez longtemps pour pouvoir arracher le Bracelet de votre poignet et le jeter sur le sol.",
  choix: [
    { texte: "Maudissant votre malchance, vous poursuivez alors votre chemin d'un pas chancelant en vous dirigeant vers le croisement situé à l'extrémité du couloir", vers: "215" }
  ]
  },
  {
  id: "346",
  texte: "Dyce saute de l'autre côté sans difficulté. Irian, lui, glisse et tombe, mais vous parvenez à le remonter à la surface grâce à la corde attachée à sa ceinture. Fenor et vous-même êtes toujours de ce côté de la crevasse et c'est à votre tour de sauter. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, vous pouvez ajoutez 2 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "195", texte: "Si le total obtenu est de 0 à 3," },
        "4-11": { vers: "232", texte: "De 4 à 11," }
      }
      }
  },
  {
  id: "347",
  texte: "Le couloir n'est que faiblement éclairé et votre grande habileté de chasseur doit vous permettre de vous approcher des gardes en vous glissant dans l'ombre sans être vu. Vous protégeant le nez des vapeurs qui s'élèvent du bol, vous avancez pas à pas le long du mur sans que les Barbares soupçonnent votre présence. Vous posez ensuite le bol à l'ombre d'un pilastre et vous retournez sans bruit vers la cuisine, attendant que les herbes produisent leur effet. Moins d'une minute plus tard, les Barbares des Glaces s'effondrent sur le sol. La voie est libre et vous pouvez vous diriger vers la salle du Trône du Brumalmarc en toute sécurité. Vous êtes alors ravi de constater que l'une des grandes portes incrustées de pierreries n'est pas fermée à clé.",
  choix: [
    { texte: "Vous tenant prêt à combattre, vous l'entrebâillez doucement et vous pénétrez dans le repaire de Vonotar", vers: "173" }
  ]
  },
  {
  id: "348",
  texte: "Votre Discipline Kaï vous révèle qu'il existe, à moins de 200 mètres en direction du sud, un réseau de grottes et de souterrains.",
  choix: [
    { texte: "Vous abandonnez alors votre traîneau et vous partez vers le sud pour essayer de découvrir quelque chose", vers: "314" }
  ]
  },
  {
  id: "349",
  texte: "Avez-vous découvert et conservé, au cours de votre aventure, une Pierre Rayonnante ?",
  choix: [
    { texte: "Si vous êtes en possession de cet objet", vers: "139" },
    { texte: "Sinon", vers: "97" }
  ]
  },
  {
  id: "350",
  texte: "La multitude de couleurs s'estompe et vous ressentez soudain une soudaine chute de température. Vous vous trouvez à présent sur la banquise de Liouk, à moins de 800 mètres de l'endroit où le Cardonal est ancré. Loi-Kymar et Vonotar sont auprès de vous et tous deux frissonnent dans la fraîcheur de l'air du matin. Quelques minutes plus tard, l'homme de vigie du Cardonal vous aperçoit et une chaloupe est immédiatement mise à la mer pour venir vous chercher. Le capitaine vous accueille à bord du navire en vous félicitant pour votre courage et votre habileté, tandis que Vonotar le Traître est hissé sans ménagement sur le pont et aussitôt enfermé à fond de cale. « Mais comment avez-vous fait pour revenir si vite ? demande le capitaine incrédule, nous ne vous attendions que dans dix jours. » « Disons, intervient LoiKymar, que la sagesse d'un Seigneur Kaï et le savoir d'un magicien de la Guilde peuvent parfois vaincre le temps luimême. » Une expression perplexe apparaît sur le visage du capitaine, mais elle laisse place peu à peu à un sourire : il semble qu'il ait compris à demi-mot ce que le magicien voulait dire. Votre voyage de retour à Anskavern se déroule sans encombre, mais vous êtes quelque peu attristé, cependant, par le souvenir de vos guides courageux que vous avez dû laisser derrière vous. Votre arrivée dans le port de la côte sommerlundaise est attendue par une foule anxieuse de savoir ce qui s'est passé. On craint en effet que votre retour si prompt ne soit un signe que votre mission a échoué. Mais, lorsque la nouvelle se répand que Vonotar le Traître a été capturé, il vous faut à nouveau montrer tous vos talents de guerrier. Et cette fois, ironie du destin, c'est Vonotar lui-même que vous devez défendre contre la foule déchaînée qui monte à l'assaut de la prison d'Anskavern pour lyncher l'infâme bossu. Vous parvenez malgré tout à protéger le prisonnier et à l'amener à Toran où l'attend son procès. A l'aube de la fête de Maesmarn, Vonotar le Traître est jugé par ses anciens compagnons, rassemblés dans les sous-sols du temple qui abrite la Guilde de l'Etoile de Cristal ; à l'issue des débats, il est reconnu coupable de tous les terribles crimes qu'il a commis. On le conduit alors en silence dans une salle du temple située loin dans ses profondeurs et où se trouve l'Aveugloir : il s'agit d'un point de passage vers d'infinies ténèbres, le seuil d'une prison éternelle de laquelle il est impossible de s'échapper. Vous êtes le vengeur de ses crimes et c'est à vous que revient la tâche de précipiter le traître abject dans les limbes de l'Aveugloir. Votre mission est désormais accomplie. Vous avez survécu aux Grottes de Kalte et libéré le Sommerlund de la menace que Vonotar faisait peser sur lui. Mais le feu des batailles et le défi d'une nouvelle quête tout aussi désespérée vous attendent maintenant dans le quatrième volume de la série du Loup Solitaire intitulé : LE GOUFFRE MAUDIT",
  fin: "victoire",
  nomFin: "Victoire — Les Grottes de Kalte"
  }
];
