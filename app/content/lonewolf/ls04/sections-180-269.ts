import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 04 — Le Gouffre Maudit
 * Paragraphes 180 à 269. Fichier GÉNÉRÉ par
 * scripts/ls04-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls04-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_180_269: StorySection[] = [
  {
  id: "180",
  texte: "Au fond du hangar à bateaux, une cale étroite descend vers une porte à hauteur d'eau. L'un de vos hommes se précipite pour soulever la lourde barre qui la verrouille, tandis que les autres patrouilleurs portent le bateau vers la rampe. Vous poussez l'embarcation dans l'eau de la rivière puis vous montez à bord, émergeant du hangar dans une brusque secousse qui vous jette pêle-mêle les uns sur les autres. Lorsque vous parvenez enfin à vous relever, le courant de la rivière emporte le bateau. Vous empoignez un aviron et vous essayez de maintenir l'embarcation au milieu des eaux bouillonnantes qui s'enfoncent dans les contreforts de la chaîne de Maaken. Mais, à peine avez-vous pris le contrôle du bateau qu'un danger inattendu surgit devant vous : un peu plus loin, en effet, la rivière disparaît soudain dans la paroi rocheuse d'un énorme bloc de granité. Il est trop tard pour éviter d'être emporté dans les ténèbres de la grotte qui s'ouvre de l'autre côté de la paroi.",
  choix: [
    { texte: "Tandis que l'embarcation plonge dans l'obscurité, vous vous préparez à affronter les périls qui vous attendent peut-être", vers: "241" }
  ]
  },
  {
  id: "181",
  titre: "Mort — §181",
  texte: "Vous entendez le claquement de la corde de l'arc et le sifflement de la flèche. Ce sont les deux derniers bruits que vous percevrez en ce monde. La flèche, en effet, vous transperce le crâne et vous mourez sur le coup. Votre mission s'achève ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §181"
  },
  {
  id: "182",
  texte: "Les roulottes sont disposées en un cercle à l'intérieur duquel vous établissez votre campement. Un patrouilleur reçoit pour mission de surveiller les abords du camp. Les troubadours, quant à eux, construisent une petite scène sur laquelle bientôt s'avance Yesu. Il demande le silence puis annonce le titre de la pièce qui va être jouée : « Les Vaillants Guerriers du Sommerlund ». C'est là un programme qui provoque les cris d'enthousiasme de vos hommes. Au cours de la représentation, un détail étrange attire votre attention : l'un des acteurs utilise en effet une épée véritable. Or, ce genre d'épée n'appartient qu'aux officiers de la cavalerie du Sommerlund. A la fin de la pièce, vous vous approchez de l'homme pour l'interroger au sujet de cette arme. Il vous regarde alors d'un air inquiet puis s'enfuit dans l'obscurité qui règne autour du camp.",
  choix: [
    { texte: "Si vous souhaitez le poursuivre et que vous maîtrisiez les Disciplines Kaï de l'Orientation ou de la Chasse", vers: "332" },
    { texte: "Si ces Disciplines vous sont inconnues, mais que vous vouliez malgré tout poursuivre l'acteur", vers: "58" },
    { texte: "Si vous préférez le laisser s'enfuir, revenez auprès de vos hommes", vers: "165" }
  ]
  },
  {
  id: "183",
  titre: "La porte de la crypte",
  texte: "Vous vous approchez d'un enchevêtrement de buissons d'épines qui poussent à proximité de la porte de la crypte. De cette cachette, vous pouvez observer les Gardes vassagoniens sans être vu. D'autres soldats à cheval apparaissent alors. Ils viennent du nord et pénètrent dans les ruines de Maaken. Ils mettent ensuite pied à terre et s'avancent vers la porte. « Le mot de passe ! » s'écrie l'un des gardes. « Lohn ! » répondent les soldats. La porte s'ouvre aussitôt et ils sont autorisés à entrer. Maintenant que vous connaissez le mot de passe, vous décidez d'essayer d'entrer dans la crypte de la même manière. Dissimulé par le capuchon de votre cape, vous vous avancez d'un pas assuré vers les Gardes. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Camouflage, ajoutez 4 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Mot de passe",
        texte: "Camouflage +4. 0-6 → 198, 7-13 → 338",
        branches: {
        "0-6": { vers: "198" },
        "7-13": { vers: "338" }
      }
      }
  },
  {
  id: "184",
  texte: "Vous êtes à 10 mètres à peine des Gardes lorsqu'ils se mettent à tirer. Par miracle, vous n'êtes pas touché, mais il vous faudra désormais combattre seul. Trois de vos hommes viennent en effet d'être tués ; quant au quatrième, un carreau d'arbalète lui a fracassé le poignet et il est désormais hors de combat. Lorsque vous les attaquez, les féroces Guerriers se débarrassent de leurs arbalètes vides et tirent leurs épées. Vous êtes alors repoussé en direction du pont par six Gardes furieux.",
  choix: [
    { texte: "Si vous souhaitez les combattre", vers: "202" },
    { texte: "Si vous préférez vous enfuir en sautant pardessus le parapet du pont", vers: "342" }
  ]
  },
  {
  id: "185",
  texte: "Vous avez faim et il vous faut à présent prendre un Repas. Sinon, vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Vous poursuivez ensuite votre chemin le long du tunnel qui se prolonge sur plusieurs kilomètres avant d'aboutir enfin à une longue galerie déserte", vers: "40" }
  ],
  effets: { repasObligatoire: true }
  },
  {
  id: "186",
  texte: "Les brigands vassagoniens surgissent soudain des ruines et se lancent à l'attaque. Vous donnez aussitôt l'ordre de tirer. Une pluie de flèches s'abat alors sur les hommes en armure et les pointes d'acier transpercent leurs plastrons écarlates. La première vague d'attaquants s'effondre. La seconde hésite. Une autre volée de flèches oblige l'ennemi à battre en retraite parmi les ruines. Quelques groupes de brigands ont survécu à la grêle mortelle et sont parvenus à atteindre la barricade. D'autres sont tués au moment où ils tentent de franchir la ligne de défense. Les plus hardis d'entre eux réussissent cependant à passer la barricade à proximité de l'endroit où vous vous trouvez. Soudain, un Guerrier à la carrure impressionnante, aux longs cheveux noirs et huileux noués derrière sa tête couturée de cicatrices, bondit sur le chariot et vous attaque. Il vous faut le combattre.",
  choix: [
    { texte: "GUERRIER VASSAGONIEN HABILETÉ: 18 ENDURANCE: 25 Vous pouvez prendre la fuite à tout moment en sautant du chariot", vers: "66" },
    { texte: "Si vous remportez la victoire", vers: "243" }
  ],
  combat: { nom: "Guerrier Vassagonien", habilete: 18, endurance: 25 }
  },
  {
  id: "187",
  texte: "En émergeant du tunnel sous le soleil du matin, vous vous débarrassez de votre Torche et vous faites signe à vos patrouilleurs de se rassembler autour de vous. Du détachement qui vous accompagnait au début de votre mission, il ne reste plus que quelques hommes et il vous faut être particulièrement prudent dans les décisions que vous prendrez désormais.",
  choix: [
    { texte: "A peine cependant avez-vous commencé à leur parler que vous êtes brusquement interrompu", vers: "164" }
  ]
  },
  {
  id: "188",
  texte: "Vous donnez l'ordre à vos hommes de creuser des tombes pour y enterrer les deux corps, puis vous retournez à l'abri du dôme de marbre. Vous avez faim et il vous faut à présent prendre un Repas sinon vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Des sentinelles sont postées autour du temple en ruine et vous vous préparez à une nuit de sommeil dont vous avez grand besoin", vers: "233" }
  ],
  effets: { repasObligatoire: true }
  },
  {
  id: "189",
  texte: "Vous essayez à grands coups de rames d'amener ce qui reste du bateau sur la rive opposée, mais, alors que vous plongez vos avirons dans la rivière, ils vous sont arrachés des mains. Horrifié vous voyez l'un de vos patrouilleurs emporté dans l'eau noire par un énorme tentacule gluant. Un instant plus tard, un autre tentacule fracasse le fond du bateau avec une telle violence que l'embarcation est projetée en l'air. Vous retombez tête la première dans la rivière glacée. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "234", texte: "Si vous tirez un chiffre de 0 à 4," },
        "5-9": { vers: "47", texte: "5 à 9" }
      }
      }
  },
  {
  id: "190",
  texte: "Vous sortez du tunnel furieux d'avoir pris du retard et vous poursuivez votre chemin le long de l'autre passage en marchant aussi vite que possible. Rendez-vous au 335.",
  choix: [
    { texte: "Vous sortez du tunnel furieux d'avoir pris du retard et vous poursuivez votre chemin le long de l'autre passage en marchant aussi vite que possible", vers: "335" }
  ]
  },
  {
  id: "191",
  texte: "Vous arrivez bientôt à un croisement où le sentier aboutit à la grand-route. Vous apercevez alors un chariot calciné abandonné sur le bas-côté.",
  choix: [
    { texte: "Si vous souhaitez examiner ce chariot", vers: "337" },
    { texte: "Si vous préférez ne pas y prêter attention, vous poursuivrez votre chemin le long de la grand-route", vers: "297" }
  ]
  },
  {
  id: "192",
  titre: "Mort — §192",
  texte: "Vous êtes à moins de 2 mètres de la porte lorsqu'un brigand surgit soudain devant vous. Instinctivement, vous faites un écart mais vous n'êtes pas suffisamment rapide pour éviter le coup qu'il vous porte à l'aide de sa hallebarde. L'acier glacé s'enfonce dans votre poitrine et le sang ruisselle sur votre corps. Votre blessure est mortelle : vous rendez l'âme quelques instants plus tard. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §192"
  },
  {
  id: "193",
  texte: "Hurlant et grognant, les Chiens de Guerre bondissent sur la barricade, leurs yeux grands ouverts lançant des éclats écarlates dans le feu de la bataille. Piétinant les corps des morts et des mourants, ils se ruent sur les défenseurs sommerlundais. Tout autour de vous, des soldats sont projetés à terre par les molosses impitoyables. Vous faites un pas en arrière au moment où un Chien hurlant renverse la barrière de sacs et de tonneaux. Mais avant qu'il ait pu vous atteindre, vous lui fracassez la tête avec votre arme. Un autre Chien de Guerre vous attaque par-derrière et vous jette contre la barricade effondrée. Avant que vous n'ayez pu vous dégager, deux autres molosses plantent leurs crocs dans votre jambe. Il vous faut à présent livrer un combat sans merci.",
  suite: "311",
  combat: { nom: "Chiens de Guerre", habilete: 17, endurance: 30 }
  },
  {
  id: "194",
  texte: "Vous êtes projeté dans l'eau glacée par le tentacule qui vous frappe en pleine poitrine. Vous refaites rapidement surface mais vous avez à peine le temps de respirer une bouffée d'air qu'un autre tentacule s'enroule autour de vos jambes et vous attire vers le fond. Utilisez la Table de Hasard pour obtenir un chiffre et notez ce chiffre dans la marge de votre Feuille d'Aventure (exceptionnellement 0 = 10). Ce chiffre représente le nombre d'Assauts que vous pourrez livrer sous l'eau avant de perdre des points d'ENDURANCE supplémentaires en raison du manque d'oxygène. Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière, vous ajouterez 2 au chiffre donné par la Table. Affrontez à présent ce Mégacalmar. MÉGA CALMAR HABILETÉ : 16 ENDURANCE : 37 Vous engagerez ce combat à la manière habituelle. S'il comporte un nombre d'Assauts supérieur au chiffre que vous aurez tiré, vous perdrez 2 points d'ENDURANCE en plus à chaque Assaut supplémentaire. C'est ce que vous coûte le manque d'oxygène.",
  suite: "32",
  combat: { nom: "Mégacalmar", habilete: 16, endurance: 37 }
  },
  {
  id: "195",
  texte: "Quelqu'un déverrouille la porte qui, à en juger par le bruit, doit être fermée à l'aide d'une lourde barre de fer. Un homme d'aspect robuste, vêtu d'une tunique de cuir apparaît à l'entrée de la taverne. « Bienvenue dans ma modeste auberge, Seigneur Kaï, dit-il, pardonnez ma méfiance, mais la région est très dangereuse et la moindre erreur pourrait nous coûter la vie. » Vous faites signe à vos hommes d'emmener leurs chevaux à l'écurie et vous suivez le tenancier de la taverne. A l'intérieur, la salle ressemble davantage à une armurerie qu'à une auberge. Des carquois remplis d'arcs sont posés devant chaque fenêtre fermée par des volets cloutés de fer, et des lances sont alignées contre le mur du fond. Il n'y a dans la salle que trois hommes jeunes qui ont chacun un air de ressemblance très prononcé avec le tenancier. L'un de ces jeunes gens a la tête entourée de bandages. Vous demandez à l'homme qui vous a ouvert le prix qu'il vous en coûtera pour passer la nuit ici en compagnie de vos patrouilleurs. «Ce sera gratuit», répond-il à votre grande surprise. Il déplace alors les tables pour que vos soldats puissent s'installer sur le plancher. « Votre présence ici cette nuit, poursuit-il, a beaucoup plus de valeur pour nous que des Pièces d'Or. Nous subissons en effet des attaques incessantes de brigands depuis la dernière pleine lune. » Dès que le dernier de vos hommes est revenu des écuries, les portes sont à nouveau fermées et verrouillées. Il a commencé à pleuvoir et vos patrouilleurs semblent singulièrement soulagés de se trouver à l'abri, au chaud et au sec.",
  choix: [
    { texte: "Si vous souhaitez interroger le tenancier de la taverne au sujet des attaques de brigands", vers: "239" },
    { texte: "Si vous préférez lui demander s'il a eu des nouvelles en provenance de Ruanon, au cours du mois dernier", vers: "266" },
    { texte: "Enfin, si vous n'estimez pas nécessaire de poser d'autres questions à cet homme, préparez-vous à une nuit de sommeil", vers: "324" }
  ]
  },
  {
  id: "196",
  texte: "Un éclair déchire le ciel d'orage, illuminant les silhouettes des brigands qui se glissent dans les écuries. Accroupi sur le balcon, vous faites signe à vos hommes de se préparer. Vous sautez alors sur le toit de l'écurie mais les tuiles d'argile sont trop minces pour supporter votre poids et vous passez à travers et atterrissez dans une botte de foin. Par chance, vous êtes indemne et vous vous relevez aussitôt, mais un brigand se tient devant vous à moins d'un mètre, l'épée brandie, prête à s'abattre sur votre tête. Il faut vous défendre contre ce Guerrier Pillard. GUERRIER PILLARD HABILETÉ: 16 ENDURANCE: 23 Il vous est impossible de prendre la fuite et vous devrez donc affronter votre adversaire jusqu'à la mort de l'un de vous deux.",
  suite: "217",
  combat: { nom: "Guerrier Pillard", habilete: 16, endurance: 23 }
  },
  {
  id: "197",
  texte: "Vous lancez une pierre dans le tunnel pour attirer l'attention des Gardes. Votre tactique réussit : quelques secondes plus tard, vous entendez des pas s'approcher et vous vous lancez à l'attaque. Vos hommes surgissant de l'obscurité n'ont aucun mal à maîtriser leurs adversaires qu'ils désarment avant de leur lier les mains. Les Gardes sont ensuite ramenés dans la salle où se trouve le puits de mine.",
  choix: [
    { texte: "Si vous souhaitez fouiller ces hommes", vers: "268" },
    { texte: "Si vous préférez les interroger d'abord", vers: "76" },
    { texte: "Enfin, si vous estimez plus opportun de les abandonner là et de poursuivre votre chemin", vers: "64" }
  ]
  },
  {
  id: "198",
  titre: "Les Gardes de la Crypte",
  texte: "Les Gardes ne se laissent pas prendre à votre stratagème. Ils tirent aussitôt leur épée et se lancent à l'attaque. Il vous faut les combattre en les considérant comme un seul et même ennemi.",
  suite: "229",
  combat: { nom: "Gardes de la Crypte", habilete: 18, endurance: 30 }
  },
  {
  id: "199",
  texte: "Vous pénétrez bientôt dans une salle où un profond puits de mine est creusé dans le sol. Une passerelle de bois permet de le franchir, mais elle est gardée par un Guerrier. Les cris de vos poursuivants l'ont alerté et, dès qu'il vous voit, il se précipite vers une corde qui pend du plafond, laissant ainsi l'accès au pont entièrement libre. Les autres Gardes vous ont presque rattrapé.",
  choix: [
    { texte: "Si vous souhaitez franchir le pont en courant", vers: "271" },
    { texte: "Si vous préférez attaquer le Garde pour l'empêcher d'atteindre la corde", vers: "56" }
  ]
  },
  {
  id: "200",
  titre: "Ruanon en ruines",
  texte: "La forêt grouille de brigands, mais vos réflexes sont prompts et votre habileté de Seigneur Kaï vous permet de ne pas être repéré. Vous arrivez enfin de l'autre côté de la forêt touffue. Au-delà s'étendent des plaines dépourvues d'arbres qu'il faut traverser pour atteindre Ruanon. Le spectacle qui s'offre à vos yeux est singulièrement inquiétant. Une grande partie de la ville minière a été en effet incendiée. Les boutiques, les maisons, les tavernes qui s'alignaient le long des rues ne sont plus que des tas de cendres fumantes. Vous craignez GARDES DE LA CRYPTE HABILETÉ : 18 ENDURANCE : 30 alors que Ruanon n'ait été entièrement détruite. Une faible brise, cependant, dissipe bientôt les nuages de fumée qui masquent les ruines comme des rideaux gris, et vous apercevez une barricade dressée autour d'une tour de pierre. Une bannière en lambeaux flotte au sommet de la tour et une lueur d'espoir s'allume aussitôt en vous. Il s'agit là, en effet, du drapeau du Sommerlund. L'habituel soleil qui symbolise votre pays est ici bordé d'une soutache blanche indiquant que ce drapeau appartient à un régiment de la cavalerie royale. Soudain, un craquement retentit derrière vous. Vous faites aussitôt volte-face et vous apercevez trois brigands qui s'avancent dans votre direction. La pointe d'acier de leurs lances scintille. On dirait que ces armes ont été trempées dans un liquide clair et gluant.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Chasse ou si vous avez visité Crique-en-Gorn", vers: "45", requis: {"discipline":"chasse"} },
    { texte: "Affronter les brigands", vers: "133" },
    { texte: "Prendre la fuite vers Ruanon", vers: "307", montreToujours: true }
  ]
  },
  {
  id: "201",
  texte: "Les champignons sont mous, secs et leur goût est détestable. Ils se transforment dans votre bouche en une poudre sèche qui absorbe toute votre salive. Vous êtes pris de haut-le-cœur, vous toussez et une nausée vous saisit.",
  choix: [
    { texte: "Gagné par la panique, vous vous hâtez de recracher les champignons, puis vous poursuivez votre chemin le long du tunnel", vers: "65" }
  ]
  },
  {
  id: "202-b",
  titre: "2e Garde",
  texte: "Deuxième Garde.",
  suite: "202-c",
  combat: { nom: "2e Garde", habilete: 21, endurance: 25 }
  },
  {
  id: "202-c",
  titre: "3e Garde",
  texte: "Troisième Garde.",
  suite: "202-d",
  combat: { nom: "3e Garde", habilete: 24, endurance: 22 }
  },
  {
  id: "202-d",
  titre: "4e Garde",
  texte: "Quatrième Garde.",
  suite: "202-e",
  combat: { nom: "4e Garde", habilete: 18, endurance: 15 }
  },
  {
  id: "202-e",
  titre: "5e Garde",
  texte: "Cinquième Garde.",
  suite: "202-f",
  combat: { nom: "5e Garde", habilete: 15, endurance: 16 }
  },
  {
  id: "202-f",
  titre: "6e Garde",
  texte: "Sixième Garde.",
  suite: "237",
  combat: { nom: "6e Garde", habilete: 14, endurance: 14 }
  },
  {
  id: "202",
  titre: "Les six Gardes du pont",
  texte: "Vous allez devoir affronter un par un ces six Gardes lourdement armés.",
  suite: "202-b",
  choix: [
    { texte: "Si vous remportez la victoire", vers: "237" }
  ],
  combat: { nom: "1er Garde", habilete: 23, endurance: 24 }
  },
  {
  id: "203",
  texte: "Tandis que le Garde tombe mort à vos pieds, trois de vos poursuivants font leur apparition. Ils sont vêtus de lourdes armures et chacun d'eux est armé d'une hallebarde à l'aspect particulièrement redoutable.",
  choix: [
    { texte: "Si vous souhaitez engager le combat", vers: "108" },
    { texte: "Si vous préférez vous enfuir en franchissant le pont", vers: "271" }
  ]
  },
  {
  id: "204",
  texte: "Vous contournez un village aux maisonnettes de bois orange et vous traversez les champs en direction d'une éminence boisée. Au-delà de ce monticule, vous pénétrez dans une forêt dense et vous découvrez bientôt un ruisseau d'eau fraîche et bouillonnante. Vous vous désaltérez longuement et vous vous rendez compte alors que vous êtes affamé. Il vous faut prendre immédiatement un Repas sinon vous perdrez 3 points d'ENDURANCE. A la nuit tombée, vous parvenez dans la ville de Maaken. Les ruines sinistres et envahies de mauvaises herbes de cette cité fantôme s'étendent comme un vaste cimetière baigné de la clarté lugubre d'une lune bientôt pleine. Un long gémissement retentit comme la plainte d'âmes errantes et désespérées : c'est le cri des gorges de Maaken. Vous n'avez pas dormi depuis presque deux jours et la fatigue vous submerge. Ramenant votre cape de Guerrier Kaï autour de vos épaules, vous vous allongez donc pour prendre quelques heures de repos.",
  choix: [
    { texte: "Vous aurez besoin, en effet, de toutes vos forces pour mener à bien la tâche terrifiante qui vous attend", vers: "142" }
  ]
  },
  {
  id: "205",
  texte: "Sous le choc, la porte ovale s'ouvre à la volée et un nuage de poussière jaillit de la masure. « Je suis seul, dit une voix, vous n'avez rien à craindre. »",
  choix: [
    { texte: "La main serrée sur votre arme, vous pénétrez alors dans la maison", vers: "84" }
  ]
  },
  {
  id: "206",
  texte: "Tandis que les premières lueurs de l'aube éclairent l'horizon, vous scrutez la grand-route enveloppée de brume en essayant de repérer le moindre mouvement. Aucun de vos six éclaireurs n'est encore revenu et les quatre hommes qui vous restent sont aussi inquiets que vous. Votre marge de manœuvre est limitée: des hordes de brigands patrouillent en effet au nord ; à l'ouest se dressent des montagnes hostiles et, à l'est, la ville la plus proche se trouve à deux jours de cheval.",
  choix: [
    { texte: "Si vous souhaitez pénétrer dans la vallée en suivant la grand-route", vers: "82" },
    { texte: "Si vous préférez descendre dans cette vallée en restant à couvert des arbres de la forêt", vers: "226" }
  ]
  },
  {
  id: "207",
  texte: "Vous saisissez une flèche dans un carquois accroché au mur et vous tendez votre arc de toutes vos forces. Un des brigands à cheval galope dans la plaine en brandissant un javelot. Il vise un soldat blessé du Sommerlund qui est tombé de la barricade et reste étendu là, incapable de se défendre. Le brigand s'apprête à lancer son javelot lorsque vous tirez votre flèche. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez la Discipline Kaï de la Maîtrise des Armes (quelle que soit l'arme dont il s'agit), vous ajouterez 2 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "336", texte: "Si vous obtenez un total de 0 à 4," },
        "5-11": { vers: "218", texte: "De 5 à 11," }
      }
      }
  },
  {
  id: "208",
  texte: "Vous parcourez une vingtaine de mètres en courant et vous arrivez soudain devant une paroi verticale. Ce souterrain n'a été creusé que récemment et vous êtes dans un cul-de-sac. Entendant le bruit des pas de vos poursuivants, vous faites aussitôt volte-face. Votre seule chance de survie, désormais, consiste à combattre les Gardes pour essayer de vous enfuir de ce piège. Vous retournerez ensuite au croisement et vous prendrez le tunnel de gauche. Mais vous n'aurez le droit de poursuivre votre chemin qu'après avoir tué vos trois adversaires.",
  choix: [
    { texte: "HABILETÉ ENDURANCE Premier GARDE DES TUNNELS 25 24 2e GARDE 22 15 3e GARDE 15 14 Si vous remportez la victoire", vers: "199" }
  ]
  },
  {
  id: "209",
  texte: "D'un coup de lance, votre adversaire vous a projeté en arrière et vous tombez sur le dos. Tandis que vous vous relevez tant bien que mal, le cavalier jette sa lance qui vient de se briser et dégaine un cimeterre. Un sourire maléfique apparaît alors sur son visage sinistre, découvrant deux rangées de dents noires et pointues. Il laisse échapper un cri de guerre puis lance son cheval sur vous.",
  choix: [
    { texte: "Si vous avez atteint le rang Kaï d'Aspirant (ou un rang supérieur)", vers: "111", requis: {"drapeau":"rang_aspirant"} },
    { texte: "Dans le cas contraire", vers: "43" }
  ]
  },
  {
  id: "210",
  texte: "Cette ville vous inspire un sentiment de malaise. Jusqu'à présent, vous n'avez vu marcher dans la rue que des femmes et des enfants traînant les pieds. A aucun moment la silhouette d'un homme n'est apparue. Les habitants semblent nerveux et évitent votre regard. Votre instinct de Guerrier Kaï vous incite à quitter les lieux le plus vite possible.",
  choix: [
    { texte: "Si vous souhaitez obéir à cet instinct", vers: "67" },
    { texte: "Si vous préférez ne pas en tenir compte, vous pouvez entrer dans la taverne", vers: "132" },
    { texte: "Il vous est également possible de poursuivre votre chemin le long de la rue", vers: "301" }
  ]
  },
  {
  id: "211",
  texte: "Votre stratagème a porté ses fruits. Négligeant en effet votre petit groupe de cavaliers, les brigands poursuivent les autres patrouilleurs en direction de l'ouest. Lorsqu'ils auront atteint les contreforts boisés des monts Durncrag, vos hommes n'auront aucune difficulté à fuir l'ennemi en se dissimulant dans la végétation touffue. Dès que les brigands sont hors de vue, vous faites halte et vous accordez à vos hommes quelques moments de repos. Bien qu'ils ne soient plus qu'en petit nombre, vos hommes sont impatients de poursuivre leur mission. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "51", texte: "Si vous tirez un chiffre de 0 à 4," },
        "5-9": { vers: "120", texte: "De 5 à 9," }
      }
      }
  },
  {
  id: "212",
  texte: "Une odeur d'humidité et de pourriture baigne le puits de mine. Vous ordonnez à l'un de vos hommes de monter à l'échelle pour vérifier qu'elle est toujours solide. Le patrouilleur atteint bientôt le niveau supérieur et vous fait signe de le suivre. Vous vous retrouvez alors dans un tunnel qui mène à une petite salle de forme ovale creusée grossièrement dans la roche. Un étrange liquide gluant brille sur le sol.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "41", requis: {"discipline":"communication-animale"} },
    { texte: "Sinon, vous devrez chercher une issue à cette salle", vers: "276" }
  ]
  },
  {
  id: "213",
  texte: "Une fouille systématique vous permet de trouver les objets suivants : -1 Pioche, -1 Pelle, -1 Hache, -1 Torche, -1 Briquet à Amadou, -1 Sablier, Si vous souhaitez conserver un ou plusieurs de ces objets, notezles sur votre Feuille d'Aventure (la Pioche et la Pelle comptent chacune pour deux objets). Tous ces objets, si vous les prenez, doivent être inscrits dans la case Sac à Dos.",
  choix: [
    { texte: "Après avoir vérifié qu'il n'y a rien d'autre à découvrir dans le hangar, vous ordonnez à vos hommes de mettre à l'eau le bateau à rames", vers: "180" }
  ]
  },
  {
  id: "214",
  texte: "Tandis que vous avancez dans le tunnel, un courant d'air humide et froid vous frappe le visage. Les parois rocheuses sont sillonnées de couches de minerai qui reflètent la lueur de votre Torche en de multiples couleurs étincelantes. Vous commencez à ressentir les effets de la fatigue. En outre, les lumières dansantes qui vous entourent ont distrait votre attention. De ce fait, vous n'avez pas remarqué que vous étiez en train de marcher sur des champignons. Soudain, un nuage de spores roses s'élève. Aveuglé et à moitié suffoqué, vous devez prendre une décision rapide pour fuir cet endroit.",
  choix: [
    { texte: "Si vous souhaitez courir le long du tunnel", vers: "46" },
    { texte: "Si vous préférez rebrousser chemin jusqu'à la salle que vous venez de quitter, afin de prendre le tunnel orienté au sud", vers: "117" }
  ]
  },
  {
  id: "215",
  texte: "Une odeur de mort et de décomposition flotte autour de Barraka. Chaussé de bottes qui lui montent jusqu'aux genoux, un long cimeterre accroché à la ceinture, il pénètre dans le temple en claquant derrière lui une lourde porte de pierre, d'un geste désinvolte révélant une force hors du commun. Il reste un instant immobile puis ouvre les deux grandes portes noires gravées de têtes de morts. Soudain, une violente rafale de vent s'engouffre dans le temple et un terrible hurlement retentit à vos oreilles. Derrière les portes ouvertes, un surplomb rocheux projette sa silhouette dans l'abîme des gorges de Maaken : vous êtes en train de contempler le gouffre maudit. Barraka se détourne des portes et marche lentement vers l'autel. D'un fourreau caché sous ses vêtements, il tire alors un poignard noir à la lame ondulée. Il le brandit dans la lumière et une flamme bleue jaillit aussitôt le long de la lame d'acier. Les vents glacés des gorges de Maaken font vaciller la flamme maléfique. Le sacrifice est sur le point de s'accomplir.",
  choix: [
    { texte: "Si vous souhaitez attaquer Barraka", vers: "296" },
    { texte: "Si vous préférez distraire son attention sans l'attaquer", vers: "119" }
  ]
  },
  {
  id: "216",
  texte: "On ne peut plus faire grand-chose pour aider le patrouilleur blessé. Des tentacules entourent à présent le bateau de tous côtés et vous risquez à tout moment d'être précipité dans l'eau.",
  choix: [
    { texte: "Si vous souhaitez venir en aide à l'autre patrouilleur qu'un tentacule enroulé autour de son pied essaie d'attirer dans la rivière", vers: "304" },
    { texte: "Si vous préférez empoigner les rames et tenter d'amener le bateau jusqu'à la rive opposée", vers: "189" }
  ]
  },
  {
  id: "217",
  texte: "Un cri d'enthousiasme de vos hommes salue votre victoire. Ils sautent aussitôt dans l'écurie pour vous rejoindre.",
  choix: [
    { texte: "Une violente bataille s'ensuit, mais bientôt les brigands sont repoussés et s'enfuient dans la nuit orageuse", vers: "345" }
  ]
  },
  {
  id: "218",
  texte: "La flèche atteint le brigand sous son bras levé. L'homme pousse un hurlement et tombe en arrière, s'empalant sur son propre javelot. Vous vous apprêtez à tirer une nouvelle flèche, lorsqu'une forme noire et menaçante apparaît soudain dans le ciel. Elle descend alors vers la tour et se pose à son sommet.",
  choix: [
    { texte: "Vous jetez votre arc à terre et vous dégainez votre arme en montant l'escalier quatre à quatre, pour aller voir de quoi il retourne", vers: "223" }
  ]
  },
  {
  id: "219",
  texte: "Il vous faut une demi-heure pour reprendre vos esprits et localiser l'endroit où vous vous trouvez à présent. Vous vous apercevez bientôt que vous êtes au pied d'un énorme crassier qui émerge de la rivière souterraine. A moins de 6 mètres de son sommet, une faible lueur éclaire un long tunnel de pierre qui sert de plan incliné. Il vous est possible d'y grimper, bien que cette escalade soit difficile et périlleuse. Il vous faut une heure d'efforts pour arriver enfin au sommet du crassier. Vous pénétrez alors dans le petit tunnel désert où vous trouvez un chariot de mine près de l'entrée.",
  choix: [
    { texte: "Si vous souhaitez examiner ce chariot", vers: "167" },
    { texte: "Si vous préférez ne pas y prêter attention, vous monterez la pente escarpée de ce tunnel", vers: "185" }
  ]
  },
  {
  id: "220",
  texte: "Votre coup a désarçonné le brigand qui tombe lourdement sur le sol en brisant sa lance dans sa chute. Il se remet sur pied avec difficulté puis, relevant la visière de son heaume, il vous regarde avec un sourire sardonique qui découvre deux rangées de dents noires et pointues. Il laisse alors échapper son cri de guerre et se précipite sur vous en dégainant un cimeterre.",
  choix: [
    { texte: "Si vous souhaitez combattre ce guerrier", vers: "90" },
    { texte: "Si vous préférez prendre la fuite", vers: "163" }
  ]
  },
  {
  id: "221",
  texte: "Vous arrivez bientôt dans une salle séparée en deux par un large gouffre. Il règne ici un silence mortel et le moindre bruit résonne en écho contre les murs de pierre grise, comme un éclat de cymbales. Un pont en maçonnerie enjambe le gouffre et mène à deux portes massives également en pierre. Vous vous engagez sur le pont et, quelques instants plus tard, vous entendez un grondement assourdissant. Les portes sont en train de s'ouvrir.",
  choix: [
    { texte: "Si vous souhaitez dégainer votre arme et vous préparer à combattre", vers: "50" },
    { texte: "Si vous préférez fuir ce pont, rebrousser chemin le long du tunnel et descendre l'escalier", vers: "228" },
    { texte: "Enfin, si vous voulez prendre le risque de sauter par-dessus le parapet du pont, dans les profondeurs inconnues du gouffre", vers: "342" }
  ]
  },
  {
  id: "222",
  texte: "Dans l'intérieur douillet de la roulotte éclairée par des chandelles, vous trouvez l'acteur réfugié sous une couverture. Vous écartez la couverture et vous demandez à l'homme paralysé par la peur de vous expliquer où il a trouvé cette arme. «Je... je l'ai achetée à Eshnar, balbutie-t-il, le regard terrorisé. C'est le tenancier de la taverne du Pic et de la Pioche qui me l'a vendue. » Il saisit l'épée par la lame et vous la tend. « Si c'est votre épée que j'ai achetée sans le savoir, j'en suis sincèrement désolé. Tenez, prenez-la. » Vous empoignez le pommeau de cuivre et vous examinez l'arme avec attention. Aucun doute: il s'agit bien d'une épée de la cavalerie du Sommerlund. Elle porte même sur sa lame une inscription qui vous fait sursauter : « Capitaine Rinir Gayal, régiment de la Garde du Roi. »",
  choix: [
    { texte: "Si vous souhaitez conserver cette Epée, inscrivez-la sur votre Feuille d'Aventure dans la case Armes", vers: "165" }
  ]
  },
  {
  id: "223",
  texte: "Vous repoussez la trappe qui donne accès au sommet de la tour et vous vous hissez au-dehors. Un spectacle navrant s'offre alors à vos yeux. Des cadavres de soldats du Sommerlund sont en effet étendus çà et là, leurs armures tordues et fracassées. Tous ont été cruellement blessés. Un oiseau monstrueux tournoie au-dessus des cadavres. Ses ailes agitent la fumée répandue dans l'atmosphère et, de ses serres tranchantes comme des rasoirs, il déchire et mutile quiconque se trouve à sa portée. Un Guerrier vêtu d'une armure d'acier est assis à califourchon sur la créature et brandit un cimeterre taché du sang de vos compatriotes. Il glisse alors de sa selle incrustée de pierreries et se laisse tomber au sommet de la tour. Une voix résonne dans votre tête lorsque le Guerrier s'approche de vous : « Dis tes prières, homme du Sommerlund, murmure la voix, car ta fin est proche. »",
  choix: [
    { texte: "Si vous souhaitez combattre ce Guerrier", vers: "77" },
    { texte: "Si vous préférez essayer de fuir le combat", vers: "128" }
  ]
  },
  {
  id: "224",
  texte: "Vous entendez derrière vous le souffle rauque des Gardes. Soudain le tunnel se rétrécit et bifurque.",
  choix: [
    { texte: "Si vous souhaitez emprunter le passage de gauche", vers: "199" },
    { texte: "Si vous préférez prendre celui de droite", vers: "208" },
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation ou celle du Sixième Sens", vers: "60", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "225",
  texte: "Vous essayez de ne pas prêter attention aux douleurs que vous ressentez dans les jambes, ni à la peur qui vous noue l'estomac, et vous vous concentrez sur le drapeau du Sommerlund qui flotte au loin comme un ultime symbole d'espoir. Votre visage ruisselle de sueur et vous avez l'impression que vos poumons vont éclater. Vous ne ralentissez pas l'allure cependant. La pensée des Chiens de Guerre qui vous poursuivent pour vous dévorer suffit à vous stimuler. Vous n'êtes plus qu'à 400 mètres de la barricade et de la tour de guet. A cette distance, les visages que vous distinguez ne semblent que de petits points roses qui se détachent contre les murs. A 300 mètres de la barricade, le sol est jonché de cadavres de brigands dont la plupart ont été tués par des flèches. Nombre d'entre eux sont restés là pendant des semaines et une nuée de corbeaux croassant s'envole à votre approche. Saisi de dégoût, vous détournez la tête. Tout à coup, les échos de cris enthousiastes retentissent dans la plaine. Les soldats assiégés vous ont repéré et ont reconnu votre cape verte de Seigneur Kaï. Il ne vous reste plus que 200 mètres à parcourir. Vous venez de passer devant les ruines d'une maison incendiée lorsqu'une douleur intense vous déchire soudain la jambe. Une flèche vient de vous atteindre à la cuisse et vous tombez tête la première sur le sol boueux recouvert de cendre. Tapi dans les ruines de la maison, un brigand tend son arc et vise votre tête. Utilisez la Table de hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Course vers la barricade",
        branches: {
        "0-0": { vers: "181" },
        "1-5": { vers: "20" },
        "6-9": { vers: "300" }
      }
      }
  },
  {
  id: "226",
  texte: "La forêt de Ruanon est un enchevêtrement d'arbres aux troncs gris, de toutes formes et de toutes tailles. Il vous est très difficile de traverser cette végétation touffue et baignée de brume à dos de cheval ; vous êtes donc bientôt contraints de mettre pied à terre et de mener vos montures par la bride.",
  choix: [
    { texte: "Si vous souhaitez continuer à progresser lentement à travers la forêt", vers: "21" },
    { texte: "Si vous préférez abandonner cette végétation touffue pour revenir sur la grande-route", vers: "82" }
  ]
  },
  {
  id: "227",
  texte: "Ces oiseaux sont des corbeaux, communs dans le Pays Sauvage où ils se nourrissent de charognes. Lorsqu'une créature meurt, on peut être sûr de voir apparaître bientôt sur son cadavre ces répugnants nécrophages.",
  choix: [
    { texte: "Si vous souhaitez examiner de plus près les corps qu'ils sont en train de dévorer", vers: "328" },
    { texte: "Si vous préférez ne pas y prêter attention et poursuivre votre chemin", vers: "120" }
  ]
  },
  {
  id: "228",
  texte: "L'escalier mène à un niveau inférieur où un tunnel est orienté au sud. Vous suivez ce nouveau souterrain pendant presque un kilomètre et demi, et vous arrivez alors dans une grande salle. D'énormes tonneaux sont alignés contre le mur ouest et vous apercevez dans le mur du fond une porte aménagée sous un large escalier.",
  choix: [
    { texte: "Si vous souhaitez traverser cette salle en direction de la porte", vers: "23" },
    { texte: "Si vous préférez emprunter l'escalier", vers: "105" }
  ]
  },
  {
  id: "229",
  texte: "Vous cachez les cadavres des Gardes sous les buissons d'épines et vous franchissez la porte de la crypte.",
  choix: [
    { texte: "Une fois à l'intérieur, vous refermez la porte derrière vous et vous suivez un large couloir éclairé par des Torches et orienté à l'est", vers: "235" }
  ]
  },
  {
  id: "230",
  texte: "En fouillant les cadavres, vous trouvez les objets suivants : -1 Épée, -1 Poignard, - 9 Pièces d'Or, - des vivres équivalants à 2 Repas. Vous pouvez prendre un ou plusieurs de ces objets, sans oublier de les noter sur votre Feuille d'Aventure. Vous entendez alors des bruits de pas étouffés et vous jetez un coup d'œil inquiet dans le tunnel. Deux Gardes essaient de s'approcher de vous en se dissimulant parmi les ombres.",
  suite: "200",
  choix: [
    { texte: "Vous parvenez cependant à vous enfuir avant qu'ils puissent vous attaquer", vers: "224" }
  ],
  effets: { or: 9, objets: [{"id":"epee"},{"id":"poignard"},{"id":"repas","quantity":2}] }
  },
  {
  id: "231",
  texte: "Votre attaque est fulgurante et mortelle. Le Garde meurt avant même de s'être effondré sur le sol. En fouillant son cadavre vous trouvez les objets suivants : - 3 Pièces d'Or, -1 Épée, - des provisions équivalantes à 1 Repas. Vous pouvez prendre un ou plusieurs de ces objets avant de traverser le pont. N'oubliez pas de les noter sur votre Feuille d'Aventure. Lorsque vous arrivez de l'autre côté du pont, vous entendez des bruits de pas lointains et précipités.",
  suite: "200",
  choix: [
    { texte: "Il vous semble préférable de ne pas vous attarder plus longtemps et vous pénétrez aussitôt dans le tunnel orienté à l'ouest", vers: "348" }
  ],
  effets: { or: 3, objets: [{"id":"epee"},{"id":"repas"}] }
  },
  {
  id: "232",
  texte: "Vous remontez la berge de la rivière en direction du pont de Ruanon en prenant soin de vous dissimuler aux yeux des brigands à cheval qui, à présent, montent la garde devant le pont lui-même. Une centaine de mètres plus loin vous découvrez un sentier étroit qui mène à un hangar à bateaux passablement délabré. Si vous pouviez y trouver une embarcation, il vous serait possible de traverser la rivière sans difficulté.",
  choix: [
    { texte: "Si vous souhaitez inspecter le hangar à bateaux", vers: "68" },
    { texte: "Si vous préférez poursuivre votre chemin en cherchant un autre moyen de traverser la rivière", vers: "130" }
  ]
  },
  {
  id: "233",
  texte: "Vous êtes réveillé par des cris inquiets: «Debout! Debout ! On nous attaque ! » s'exclame la sentinelle. Rejetant aussitôt leurs couvertures, vos hommes se lèvent d'un bond, scrutant à travers le rideau de pluie les ruines parmi lesquelles apparaissent des silhouettes de cavaliers. Soudain, une flèche siffle dans l'obscurité. La sentinelle pousse un cri et s'effondre. Vous donnez aussitôt vos ordres : « Formez un cercle ! Restez à couvert ! » Les patrouilleurs rassemblent épées et boucliers et s'abritent sous le dôme de marbre. Des bruits de pas produits par des bottes aux semelles ferrées résonnent alors sur le sol de pierre. Vous faites volte-face. Une douzaine de Guerriers vêtus d'armures d'un rouge étincelant avancent parmi les colonnes en ruine. Deux patrouilleurs se précipitent à leur rencontre, mais ils tombent sous les coups du chef ennemi qui les transperce de son glaive. Le Guerrier vous aperçoit alors et hâte le pas, brandissant sa lame ensanglantée pour frapper à nouveau. Il vous est impossible de prendre la fuite et vous devrez combattre cet adversaire jusqu'à la mort de l'un de vous deux.",
  suite: "312",
  combat: { nom: "Guerrier Pillard", habilete: 17, endurance: 26 }
  },
  {
  id: "234",
  texte: "Vous avez à peine eu le temps de respirer une bouffée d'air qu'un tentacule s'enroule autour de vos jambes et vous attire vers le fond. Utilisez la Table de Hasard pour obtenir un chiffre et notez ce chiffre dans la marge de votre Feuille d'Aventure (exceptionnellement 0 = 10). Ce chiffre représente le nombre d'Assauts que vous pourrez livrer sous l'eau avant de perdre des points d'ENDURANCE supplémentaires en raison du manque d'oxygène. Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière, vous ajouterez 2 au chiffre que vous aurez tiré. Engagez à présent le combat avec le Mégacalmar. MÉGACALMAR HABILETÉ: 16 ENDURANCE: 37 Vous mènerez ce combat à la manière habituelle. Mais, s'il dure au-delà du nombre d'Assauts correspondant au chiffre que vous aurez tiré, vous perdrez 2 points d'ENDURANCE à chaque nouvel Assaut supplémentaires. C'est le prix que vous coûte le manque d'oxygène.",
  suite: "32",
  combat: { nom: "Mégacalmar", habilete: 16, endurance: 37, description: "Jet de Table de Hasard + bonus Maîtrise Matière détermine le nombre d'Assauts avant de perdre 2 Endurance par Assaut supplémentaire (manque d'oxygène)." },
  evenement: {
        type: "jet-hasard",
        titre: "Apnée",
        texte: "Notez le chiffre (0=10) = nombre d'Assauts avant malus d'oxygène. +2 si Maîtrise de la Matière."
      }
  },
  {
  id: "235",
  texte: "Le souterrain aboutit à un escalier qui s'enfonce à une trentaine de mètres de profondeur. Au bas des marches, un petit couloir mène à un croisement où vous découvrez un tunnel orienté nordsud. En direction du nord, vous apercevez une caverne éclairée par des Torches. Des meurtrières sont aménagées dans ses parois. Au sud, le tunnel aboutit à une sorte de balcon.",
  choix: [
    { texte: "Si vous souhaitez explorer la caverne", vers: "177" },
    { texte: "Si vous préférez vous diriger vers le balcon", vers: "100" }
  ]
  },
  {
  id: "236",
  texte: "Vous vous approchez des écuries et vous entendez à ce moment une voix étouffée. Soudain, la porte s'ouvre à la volée pour livrer passage à deux Guerriers Pillards qui tendent leurs arcs. Des flèches sifflent aussitôt et des patrouilleurs tombent de leurs chevaux. Dégainant votre arme, vous vous précipitez sur les attaquants, mais d'autres brigands surgissent de tous côtés et vos hommes sont pris sous un feu croisé particulièrement meurtrier. La rapidité de votre action a cependant semé la panique auprès des deux archers. Ils font volte-face pour s'enfuir, mais vous les abattez avant qu'ils aient pu disparaître. Un Guerrier à la peau sombre, aux cheveux noirs et huileux apparaît alors à une fenêtre. Il fait un geste de la main et un couteau s'enfonce dans votre bras. Vous perdez 4 points d'ENDURANCE. Serrant les dents, vous arrachez le poignard que vous lancez à votre tour en direction de votre agresseur. L'homme est tué sur le coup. La main crispée sur votre bras blessé, vous traversez les écuries en chancelant et vous vous échappez par la porte de derrière. Devant vous s'étend un terrain escarpé envahi d'une végétation touffue.",
  suite: "200",
  choix: [
    { texte: "Si vous souhaitez vous enfuir en courant tout droit dans cette forêt", vers: "123" },
    { texte: "Si vous préférez changer de direction dès que vous serez à couvert des arbres", vers: "169" }
  ],
  effets: { endurance: -4 }
  },
  {
  id: "237",
  texte: "Les cadavres de vos ennemis sont allongés pêle-mêle à vos pieds. Vous courez alors vers les portes de pierre ouvertes, soucieux de quitter les lieux avant que le massacre soit découvert.",
  choix: [
    { texte: "Au-delà des portes, une rampe descend en pente douce en direction d'un tunnel qui s'ouvre dans le mur ouest", vers: "348" }
  ]
  },
  {
  id: "238",
  texte: "Posant vos mains sur la poitrine de l'homme blessé, vous faites usage de vos pouvoirs de Guérison pour chasser la douleur avant d'enlever la flèche. L'homme a eu de la chance : le projectile n'a pas atteint d'organe vital. En quelques secondes, vous guérissez la plaie grâce à votre Discipline Kaï et vous aidez l'homme à se relever. Ce dernier vous contemple bouche bée, l'air stupéfait.",
  choix: [
    { texte: "Vous vous tournez alors vers l'escalier dont vous montez les marches en direction du sommet de la tour", vers: "223" }
  ]
  },
  {
  id: "239",
  texte: "« Il ne s'agit pas là de brigands ordinaires, vous répond le tenancier de la taverne. Ils appartiennent en fait à une armée privée. Leur chef est un aristocrate renégat de Vassagonie du nom de Barraka. Ses hommes, cependant, l'appellent le Tueur du Destin. Après avoir lancé leur première attaque, nous pensions que les brigands nous laisseraient tranquilles. Après tout, cette province n'est pas riche, même lorsque des convois en provenance des mines la traversent. Pourtant, le Tueur du Destin et ses hommes sont restés. On dirait... on dirait qu'ils ont décidé de nous tuer à tout prix. » Cette nuit-là, les trois jeunes gens, qui sont en fait les fils du tenancier, prennent des tours de garde, postés derrière les meurtrières aménagées dans les murs.",
  choix: [
    { texte: "Vos hommes et vous pourrez ainsi dormir pendant quelques heures", vers: "324" }
  ]
  },
  {
  id: "240",
  texte: "La rivière poursuit son cours en direction du sud sur plus de 15 kilomètres. Vous traversez plusieurs grottes, mais les berges rocheuses sont trop escarpées pour que vous puissiez aborder. Alors que vous ramez le long d'un tunnel particulièrement large, vous vous rendez compte soudain que le bateau avance de plus en plus vite. Au loin, vous entendez le faible grondement d'une eau bouillonnante. Le bruit augmente peu à peu d'intensité, et bientôt c'est un véritable vacarme qui retentit dans le tunnel. Vous vous préparez à traverser de forts remous, mais vous ne vous attendiez pas au spectacle qui s'offre soudain à vos yeux. A moins de 15 mètres en effet, la rivière disparaît dans les profondeurs d'une immense chute d'eau. Vos hommes tentent désespérément de ramer contre le courant pour essayer d'atteindre une paroi du tunnel. Leurs efforts restent vains cependant et le bateau est emporté jusqu'à la chute d'eau. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "94", texte: "Si vous tirez un chiffre de 0 à 4," },
        "5-9": { vers: "158", texte: "De 5 à 9," }
      }
      }
  },
  {
  id: "241",
  texte: "Le plafond de la grotte est si bas que vous êtes contraints de vous accroupir au fond du bateau pour éviter de vous cogner la tête. Pendant presque une heure, l'embarcation est emportée dans un labyrinthe de cours d'eau souterrains. Soudain, le bateau s'immobilise. Vous vous êtes échoués sur une rive de galets, dans un tunnel beaucoup plus haut que tous ceux traversés jusqu'à présent. Au sud, la rivière continue, s'enfonçant dans une paroi rocheuse à travers une arcade ; à l'est vous apercevez une autre rive de galets ainsi qu'un nouveau tunnel, mais au sol ferme cette fois-ci.",
  choix: [
    { texte: "Si vous souhaitez ramer en direction de cette autre rive, puis abandonner le bateau et continuer à pied le long du tunnel", vers: "309" },
    { texte: "Si vous préférez poursuivre votre chemin le long de la rivière", vers: "115" }
  ]
  },
  {
  id: "242",
  titre: "Mort — §242",
  texte: "Vous vous jetez de côté pour éviter le disque mortel, mais vos réflexes n'ont pas été suffisamment rapides pour vous sauver. L'arme tranchante comme un rasoir s'enfonce dans votre gorge en vous projetant en arrière sous la force du choc. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §242"
  },
  {
  id: "243",
  texte: "Le capitaine Gayal passe devant le chariot à la tête d'une douzaine de ses meilleurs soldats et lance une contre-offensive qui repousse l'ennemi jusqu'à la barricade. Il n'y a pas de survivants chez vos adversaires. Ceux qui ont réussi à échapper aux soldats du capitaine sont en effet abattus par les archers, tandis qu'ils s'enfuient dans la plaine pour tenter vainement de se réfugier parmi les ruines.",
  choix: [
    { texte: "Un cri de victoire s'élève sur le champ de bataille, mais à peine ses derniers échos se sont-ils envolés qu'un nouveau danger vous menace", vers: "124" }
  ]
  },
  {
  id: "244",
  texte: "Vous passez derrière les Gardes et vous pénétrez dans le tunnel sans avoir été repéré. Le souterrain est large et éclairé par des Torches fixées le long des murs. Leurs flammes penchées vacillent en crépitant avec bruit. Vous arrivez bientôt à un croisement où le tunnel se rétrécit avant de se séparer en deux.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens ou celle de l'Orientation", vers: "250", requis: {"discipline":"sixieme-sens"} },
    { texte: "Dans le cas contraire, vous pouvez prendre le passage de gauche", vers: "335" },
    { texte: "Si vous préférez emprunter le passage de droite", vers: "11" }
  ]
  },
  {
  id: "245",
  texte: "Deux coups bien ajustés suffisent à abattre les Elix. Le patrouilleur s'est effondré sur le sol; il a perdu beaucoup de sang et s'est presque évanoui. Son pied gauche est à demi sectionné à hauteur de la cheville. De toute évidence, il n'a plus que quelques minutes à vivre et vous ne pouvez rien faire pour l'aider. L'autre patrouilleur étant déjà mort, vous êtes seul désormais.",
  choix: [
    { texte: "Si vous souhaitez à présent vous enfuir en montant l'escalier", vers: "346" },
    { texte: "Si vous préférez quitter les lieux en descendant l'escalier", vers: "83" }
  ]
  },
  {
  id: "246",
  texte: "Vous avancez avec précaution dans l'obscurité en prenant soin de tâter le sol devant vous à l'aide de votre arme. Vous ignorez alors que deux yeux observent chacun de vos mouvements. Dans les ténèbres se cache en effet une créature satanique. Il s'agit d'un Démoniak, un vampire assoiffé de sang. Son attaque rapide et silencieuse est indolore, bien que redoutable. Avant de vous être aperçu que ce parasite s'est accroché dans votre dos, vous avez déjà perdu 8 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous êtes toujours vivant et que vous possédiez le Glaive de Sommer", vers: "34" },
    { texte: "Si vous êtes toujours vivant mais que vous ne disposiez pas de cette arme", vers: "85" }
  ]
  },
  {
  id: "247",
  texte: "Vos hommes semblent déçus par votre décision. Mais vous êtes leur chef et ce sont des soldats d'élite du Sommerlund. Ils obéissent donc sans discuter et sans manifester le moindre signe de mécontentement. Tandis que vous avancez en direction du sud, l'obscurité de la nuit enveloppe bientôt la grand-route et vous êtes contraints de vous arrêter et de dresser le camp sur le bas-côté. Les hommes rassemblent du bois pour faire du feu et une sentinelle reçoit pour mission de surveiller les chevaux. Vous avez faim, il vous faut donc prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE. La nuit se passe sans incident ; à l'aube vous levez le camp et vous poursuivez votre chemin à travers la Contrée des Pillards. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "171", texte: "Si vous tirez un chiffre de 0 à 4," },
        "5-9": { vers: "25", texte: "De 5 à 9," }
      }
      }
  },
  {
  id: "248",
  texte: "Vous pénétrez dans le tunnel; en jetant un coup d'œil par-dessus votre épaule, vous voyez se dessiner, à l'entrée de la galerie, les silhouettes d'une horde de Guerriers. Leur redoutable cri de guerre résonne dans les ténèbres humides. Bientôt, vous arrivez à un endroit où le tunnel s'est effondré. Un énorme amas de terre s'élève presque jusqu'au plafond. Vous escaladez tant bien que mal ce monticule et vous vous glissez par l'étroit passage qui s'ouvre à son sommet. Vous vous laissez tomber ensuite dans le tunnel, de l'autre côté. Là, vous découvrez un étai branlant. Lorsque tous vos hommes sont passés, vous donnez un coup d'épaule dans le pilier de bois qui se brise aussitôt. Un déluge de pierres et de terre se déverse dans le souterrain, bloquant complètement le passage. Lorsque le nuage de poussière se dissipe, vous scrutez l'obscurité qui s'étend devant vous. Vous distinguez alors des Torches éteintes fixées aux murs.",
  choix: [
    { texte: "Vos hommes les décrochent et les allument ; vous pouvez à présent éclairer votre chemin", vers: "254" }
  ]
  },
  {
  id: "249",
  texte: "Vous vous précipitez vers la barricade et vous arrachez un arc des mains d'un soldat mort. Vous avez repéré le chef de la cavalerie ennemie. C'est un Guerrier de haute taille, à la peau sombre et au nez droit et fin. Il est en train de rassembler ses hommes au pied de la tour de guet. Il vous faut absolument le tuer avant qu'il n'ait pu regrouper ses troupes sinon, le capitaine Gayal et ses soldats seront impitoyablement massacrés. Vous encochez une flèche et vous bandez votre arc. La corde tendue s'enfonce dans la chair de vos doigts, tandis que vous visez. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez la Discipline Kaï de la Maîtrise des Armes (quelle que soit l'arme dont il s'agit) vous ajouterez 2 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "153", texte: "Si vous obtenez un total de 0 à 3," },
        "4-7": { vers: "323", texte: "De 4 à 7," },
        "8-11": { vers: "39", texte: "De 8 à 11," }
      }
      }
  },
  {
  id: "250",
  texte: "Vous remarquez que le tunnel de droite a été creusé récemment et vous sentez qu'il n'est pas encore achevé.",
  choix: [
    { texte: "Vous ne voulez pas prendre le risque d'être coincé dans un cul-de-sac et vous décidez donc d'emprunter le tunnel de gauche", vers: "335" }
  ]
  },
  {
  id: "251",
  texte: "Vous êtes aidés par un ciel sans nuage qui permet à la lune d'éclairer la grand-route. Vous ordonnez à trois de vos hommes de partir devant en éclaireurs: vous connaissez en effet la sinistre réputation de cette route forestière sur laquelle les voyageurs sont fréquemment surpris par des embuscades de brigands. La forêt dense qui borde la voie pourrait dissimuler une armée entière de voleurs. Vos éclaireurs partent donc au galop avec pour consigne de signaler tout élément suspect qu'ils pourraient découvrir au cours de leur reconnaissance. Une heure plus tard, vous arrivez à un croisement où un sentier orienté à l'est s'écarte de la grand-route. Un chariot calciné a été abandonné sur le bascôté. Vous sentez qu'il se passe quelque chose d'anormal. Vos éclaireurs, en effet, auraient dû vous signaler la présence de ce chariot bien avant que vous ne le trouviez vous-même. De toute évidence, vos patrouilleurs sont inquiets : ils se demandent ce qui a bien pu arriver à leurs camarades. Vous ne voulez pas prendre le risque de continuer de peur de tomber dans une embuscade. Vous décidez donc de vous arrêter à ce croisement en attendant que vos éclaireurs reviennent. Six heures plus tard, alors que le soleil s'élève lentement au-dessus de la cime des arbres, vos hommes partis en reconnaissance n'ont toujours pas donné signe de vie.",
  choix: [
    { texte: "Si vous souhaitez poursuivre votre chemin sur la grand-route", vers: "175" },
    { texte: "Si vous préférez examiner les débris du chariot", vers: "38" },
    { texte: "Enfin, si vous estimez plus judicieux d'explorer le sentier orienté à l'est", vers: "293" }
  ]
  },
  {
  id: "252",
  texte: "Vous menez vos hommes en file indienne dans la forêt, mais moins d'une minute plus tard la végétation est devenue trop dense pour que vous puissiez continuer à cheval. Vous êtes contraints de mettre pied à terre et de cacher vos montures avant de poursuivre votre chemin. Un peu plus tard vous avez la chance de découvrir un étroit sentier qui mène à un hangar à bateaux délabré, au bord de la rivière Xane. S'il y a une embarcation dans ce hangar, vous devriez pouvoir traverser la rivière sans difficulté.",
  choix: [
    { texte: "Si vous souhaitez inspecter le hangar à bateaux", vers: "68" },
    { texte: "Si vous préférez longer la rivière dans le sens du courant en espérant trouver un autre moyen de la franchir", vers: "130" }
  ]
  },
  {
  id: "253",
  texte: "Vous vous apprêtez à donner l'ordre à vos hommes de dresser le camp, lorsqu'un éclaireur en provenance de l'est apparaît soudain, galopant vers vous. Il vous montre alors une rangée de cavaliers dont les silhouettes se dessinent à l'horizon. « Des brigands ! » s'écrie-t-il. Vous estimez leur nombre à 200 au moins. Les brigands chevauchent dans votre direction.",
  choix: [
    { texte: "Si vous avez atteint le rang Kaï de Guerrier (ce qui signifie que vous maîtrisez huit Disciplines)", vers: "72" },
    { texte: "Dans le cas contraire", vers: "135" }
  ]
  },
  {
  id: "254",
  texte: "Le tunnel descend sur plusieurs centaines de mètres. Vous arrivez alors dans une grande salle au sol recouvert d'un plancher. Deux rangées de traces de pas sont clairement visibles dans la boue qui recouvre les planches pourries. Vous constatez alors avec horreur qu'elles s'arrêtent au bord d'un trou béant. Vous vous approchez avec précaution et vous jetez un coup d'œil dans le trou. Vous apercevez aussitôt deux cadavres étendus au fond d'un puits de vase. Vous avez retrouvé vos éclaireurs, mais vous ne pouvez plus rien faire pour eux. Les planches de bois commencent à s'affaisser sous vos pieds et vous vous hâtez de vous éloigner du bord pour ne pas connaître un sort semblable. Au-delà du puits, deux passages permettent de quitter cette salle, l'un est orienté à l'est, l'autre au sud.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "326", requis: {"discipline":"orientation"} },
    { texte: "Dans le cas contraire, vous pouvez emprunter le tunnel orienté à l'est, il vous suffit pour cela de contourner le puits", vers: "156" },
    { texte: "Si vous préférez prendre le tunnel orienté au sud, contournez également le puits et", vers: "101" }
  ]
  },
  {
  id: "255",
  texte: "Il vous faut rassembler les défenseurs sommerlundais, sinon tout est perdu. Vous ordonnez à deux soldats de porter secours au capitaine, puis vous sautez sur un wagon retourné pour observer l'avance des ennemis. Ils ont déjà atteint le périmètre en ruine de Ruanon et poursuivent leur approche à l'abri des murs encore debout.",
  choix: [
    { texte: "Vous donnez l'ordre aux soldats du capitaine Gayal de défendre la barricade, mais les Guerriers ennemis ne sont plus qu'à une centaine de mètres et peut-être est-il déjà trop tard pour repousser leur attaque", vers: "186" }
  ]
  },
  {
  id: "256",
  texte: "Vous glissez à plusieurs reprises sur la passerelle branlante, mais vous parvenez finalement à la franchir. Vous apercevez alors la paroi de pierre brute du tunnel grâce à la faible lueur que projette un essaim de mouches phosphorescentes. Vous poursuivez votre chemin quelques instants mais vous êtes à présent si fatigué qu'il vous faut faire halte pour dormir.",
  choix: [
    { texte: "Vous vous réveillez plusieurs heures plus tard et vous continuez votre exploration", vers: "309" }
  ]
  },
  {
  id: "257",
  texte: "La porte n'est pas fermée à clé et elle ouvre sur une petite pièce au sol couvert de paille. Un gros coffre aux garnitures de fer est posé auprès d'un lit défait. De l'autre côté, vous apercevez une deuxième porte.",
  choix: [
    { texte: "Si vous souhaitez examiner le coffre", vers: "302" },
    { texte: "Si vous préférez ne pas y prêter attention et vous approcher de la porte", vers: "131" }
  ]
  },
  {
  id: "258",
  texte: "Vous vous éloignez de la cabane et vous poursuivez votre chemin parmi les arbres. Au matin, vous avez atteint la lisière de la forêt. Contemplant alors les champs de blé qui s'étendent au-delà, vous apercevez un petit village niché au creux d'une vallée peu profonde. Quelques sentiers étroits apparaissent parmi les blés et vous distinguez des essaims d'insectes qui volettent çà et là. Vous avancez le long d'un des sentiers lorsque des brigands apparaissent soudain un peu plus loin. La lance jetées sur l'épaule, ils marchent dans votre direction d'un pas insouciant, comme s'ils se promenaient.",
  choix: [
    { texte: "Si vous possédez un Médaillon d'Onyx", vers: "305" },
    { texte: "Si vous souhaitez vous cacher parmi les blés", vers: "159" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Camouflage et que vous ayez atteint le rang Kaï de Gardien (ou un rang supérieur)", vers: "49", requis: {"discipline":"camouflage"} }
  ]
  },
  {
  id: "259",
  texte: "«Allez-vous-en! crie une voix inquiète, c'est une taverne ici, pas une caserne ! » Vous essayez de convaincre les occupants des lieux de vos intentions pacifiques mais ils restent inflexibles et refusent de vous laisser entrer.",
  choix: [
    { texte: "Il ne vous reste donc plus qu'à poursuivre votre chemin le long de la grand-route", vers: "141" }
  ]
  },
  {
  id: "260",
  titre: "Les Chiens de Guerre",
  texte: "Les Chiens de Guerre s'élancent en direction de la barricade les yeux brillants de férocité. Cinq de ces molosses ouvrent une brèche dans la barrière en renversant sacs et tonneaux, et se jettent sur les soldats qui vous entourent. D'un seul coup de votre arme, vous tuez deux de ces Chiens répugnants mais, dans le feu de l'action, vous ne remarquez pas que d'autres molosses bondissent sur vous par-derrière. Sous le choc vous êtes précipité en avant sur les débris de la barricade effondrée. Avant que vous ayez pu vous relever, ils vous plantent les crocs dans les jambes. Vous devez à présent les combattre.",
  choix: [
    { texte: "Si vous êtes toujours vivant après 3 Assauts", vers: "311" },
    { texte: "Si vous remportez la victoire", vers: "311" }
  ],
  combat: { nom: "Chiens de Guerre Vassagoniens", habilete: 18, endurance: 30 }
  },
  {
  id: "261",
  texte: "Vous trouvez les objets suivants sur le premier cadavre que vous fouillez : 8 Pièces d'Or et des provisions équivalant à un Repas. Vous vous apprêtez à examiner les autres corps lorsque vous entendez des bruits de pas précipités qui s'approchent de l'autre côté de la salle. Vous tirez à nouveau sur la corde et, à votre grand soulagement, la herse se relève libérant l'entrée du tunnel.",
  suite: "348",
  choix: [
    { texte: "Vous vous précipitez sous la lourde grille de fer et vous vous enfuyez en courant le long du souterrain", vers: "348" }
  ],
  effets: { or: 8, objets: [{"id":"repas"}] }
  },
  {
  id: "262",
  titre: "Mort — §262",
  texte: "Vous vous ruez en avant pour frapper, mais le brigand cabre son cheval et esquive votre coup. Les sabots de l'étalon s'abattent sur votre tête, vous tombez à terre et vous êtes piétiné dans une mare de sang. Assommé et mortellement blessé, vous percevez à peine le ricanement maléfique du cavalier qui lève son arme pour vous porter le coup de grâce. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §262"
  },
  {
  id: "263",
  texte: "Vous vous penchez de côté pour essayer d'esquiver le projectile, mais le disque s'enfonce profondément dans votre épaule et vous perdez 4 points d'ENDURANCE. La main crispée sur votre bras blessé, vous courez le long d'un chemin étroit qui mène à un bosquet d'arbres au feuillage touffu. Lorsque vous l'atteignez, vous entendez derrière vous les cris des brigands.",
  suite: "200",
  choix: [
    { texte: "Si vous souhaitez poursuivre votre fuite à travers la forêt en direction du sud", vers: "123" },
    { texte: "Si vous préférez changer de direction et courir vers l'ouest", vers: "169" }
  ],
  effets: { endurance: -4 }
  },
  {
  id: "264",
  texte: "Votre sensibilité de Seigneur Kaï vous permet d'identifier les traces de sabots qui longent le sentier en direction de l'est. Elles ont été laissées par des chevaux de la cavalerie du Sommerlund.",
  choix: [
    { texte: "Si vous souhaitez suivre ces traces", vers: "134" },
    { texte: "Si vous préférez prendre la direction opposée", vers: "191" }
  ]
  },
  {
  id: "265",
  texte: "Vous n'avez pas le temps de fouiller les cadavres, d'autres patrouilles ont en effet été alertées par le fracas de la bataille et sont à présent en train de se frayer un chemin parmi les arbres pour essayer de vous rejoindre.",
  choix: [
    { texte: "Ecartant le feuillage taché de sang, vous vous élancez en direction de Ruanon", vers: "307" }
  ]
  },
  {
  id: "266",
  texte: "« Il y a presque un mois que nous n'avons plus de nouvelles, ditil en hochant sa tête barbue. Quelques cavaliers de votre pays sont passés par ici à cette époque mais, depuis, nous n'avons vu personne d'autre, à part une troupe de troubadours en provenance de Clœasia et, bien entendu, ces maudits brigands. »",
  choix: [
    { texte: "Les trois jeunes gens, qui se révèlent être les fils du tenancier, décident de prendre des tours de garde derrière les meurtrières aménagées dans les murs ; vos hommes et vous pourrez ainsi dormir quelques heures", vers: "324" }
  ]
  },
  {
  id: "267",
  titre: "Mort — §267",
  texte: "Une douleur fulgurante vous déchire la poitrine. Un carreau d'arbalète vous a projeté à terre et, les mains crispées sur la flèche, vous apercevez le visage d'un Garde qui lève son épée pour vous porter le coup de grâce. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §267"
  },
  {
  id: "268",
  texte: "En fouillant les Gardes, vous trouvez les objets suivants : - 4 Pièces d'Or, -1 Lance, -1 Glaive, -1 Clé de Fer, -1 Clé de Cuivre, - des vivres équivalant à 2 Repas -1 Flacon contenant un liquide rouge. Vous reconnaissez aussitôt ce liquide : c'est une Potion de Laumspur aux puissantes vertus curatives. Si vous la buvez après un combat, elle vous permettra de regagner 4 points d'ENDURANCE. Vous pouvez prendre un ou plusieurs de ces objets, à condition de les noter sur votre Feuille d'Aventure. Une grande porte de fer est aménagée dans le mur nord. A côté de la porte une arcade de pierre permet d'accéder à un escalier en colimaçon.",
  choix: [
    { texte: "Examiner la porte de fer", vers: "118" },
    { texte: "Monter l'escalier en colimaçon", vers: "170" },
    { texte: "Descendre l'escalier en colimaçon", vers: "228" }
  ],
  effets: { or: 4, objets: [{"id":"lance"},{"id":"glaive"},{"id":"cle-fer"},{"id":"cle-cuivre"},{"id":"repas","quantity":2},{"id":"potion-laumspur"}] }
  },
  {
  id: "269",
  texte: "Vous suivez le couloir pendant environ une heure avant d'arriver devant une paroi rocheuse. Des Pelles et des brouettes ont été abandonnées sur le sol comme si les hommes qui creusaient ce souterrain l'avaient fui en toute hâte. Vous pouvez prendre l'une des Pelles, si vous le souhaitez, mais sachez qu'elle occupera dans votre Sac à Dos la place de deux objets. Vous avez faim à présent et il vous faut prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE. Maudissant votre malchance, vous êtes contraint de rebrousser chemin jusqu'au croisement.",
  choix: [
    { texte: "Vous poursuivez ensuite votre exploration", vers: "145" }
  ],
  effets: { repasObligatoire: true }
  }
];
