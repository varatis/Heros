import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 03 — Les Grottes de Kalte
 * Paragraphes 180 à 269. Généré par ls03-importer.cjs
 */
export const SECTIONS_180_269: StorySection[] = [
  {
  id: "180",
  texte: "Dans l'obscurité balayée de neige, vous distinguez deux petits points rouges et brillants qui grandissent peu à peu. Puis soudain, une forme se dessine dans l'ombre : vous voyez alors apparaître une grande et hideuse créature quadrupède qui bondit sur vous. Elle a les yeux étincelants et ouvre une gueule hérissée de dents, exhibant en même temps une énorme langue couverte de poils rêches qu'elle pointe en direction de votre visage. « Argh ! Un Languabarb ! » s'écrie Fenor. Il se précipite aussitôt à votre côté en brandissant une épée dont il essaie de frapper la langue de la créature. L'animal, cependant, est déjà sur vous et il vous faut le combattre. Indifférente à l'attaque de Fenor, la bête monstrueuse ne semble s'intéresser qu'à vous. Fenor lui porte ses coups par-derrière et ne sera donc pas blessé. En revanche, il fera perdre 3 points supplémentaires d'ENDURANCE à votre adversaire, et cela à chaque Assaut, en raison des blessures qu'il lui inflige.",
  choix: [
    { texte: "LANGUABARB HABILETÉ: 11 ENDURANCE: 35 Si vous tuez la créature sans perdre aucun point d'ENDURANCE", vers: "70" },
    { texte: "Si vous perdez des points d'ENDURANCE au cours du combat", vers: "129" }
  ],
  combat: { nom: "Languabarb", habilete: 11, endurance: 35 }
  },
  {
  id: "181",
  texte: "Les Pièces d'Or tombent sur le sol dans un tintement, mais elles ne produisent pas l'effet escompté. Le Barbare des Glaces, en effet, reste à son poste sans prêter la moindre attention aux Pièces d'Or qui se trouvent à quelques mètres de lui.",
  choix: [
    { texte: "Si vous souhaitez faire une nouvelle tentative en lançant d'autres Pièces d'Or", vers: "152" },
    { texte: "Si vous n'avez plus de Pièces d'Or, ou si vous ne voulez pas recommencer, vous pouvez attaquer le garde", vers: "208" },
    { texte: "Enfin, si vous préférez revenir sur vos pas le long du couloir, retourner au croisement et emprunter le tunnel orienté à l'ouest", vers: "189" }
  ]
  },
  {
  id: "182",
  texte: "Vous découvrez un étroit passage qui mène à une caverne hérissée de stalagmites. Deux tunnels s'ouvrent dans la paroi opposée, tous deux s'enfonçant dans l'obscurité. Des traces étranges et nombreuses sont visibles dans la neige, à l'entrée de chaque tunnel.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "75" },
    { texte: "Si vous souhaitez explorer le tunnel de droite", vers: "114" },
    { texte: "Si vous préférez emprunter celui de gauche", vers: "235" }
  ]
  },
  {
  id: "183",
  texte: "Vous courez vers le couloir orienté au nord aussi vite que votre cheville tordue vous le permet. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, ajoutez 2 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "89", texte: "Si le total obtenu est de 0 à 3," },
        "4-11": { vers: "215", texte: "Si ce total est de 4 à 11," }
      }
      }
  },
  {
  id: "184",
  texte: "Ce tunnel n'est pas très long et vous arrivez bientôt dans une petite caverne. Deux cadavres humains sont étendus sur le sol et, en dépit de la température glaciale qui règne en ces lieux, leur état de décomposition est déjà bien avancé. De toute évidence, il y a très longtemps que ces hommes sont morts. Tous deux sont vêtus de fourrure et l'un d'eux tient encore à la main un poignard en silex. A en juger par la position des corps, il semblerait que ces deux hommes se soient entre-tués au cours d'un combat particulièrement acharné.",
  choix: [
    { texte: "Si vous souhaitez fouiller ces cadavres", vers: "298" },
    { texte: "Si vous préférez poursuivre votre chemin, vous pouvez quitter cette caverne en empruntant un tunnel qui s'ouvre dans le mur du fond", vers: "315" },
    { texte: "Enfin, s'il vous semble plus judicieux de revenir sur vos pas et d'emprunter l'autre tunnel", vers: "125" }
  ]
  },
  {
  id: "185",
  texte: "Vous concentrez votre énergie sur la serrure, mais il vous est difficile de vous en représenter le mécanisme interne. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Sixième Sens, vous pourrez ajouter 2 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "22", texte: "Si vous obtenez un total de 0 à 4," },
        "5-11": { vers: "326", texte: "Si votre total est de 5 à 11," }
      }
      }
  },
  {
  id: "186",
  texte: "Le fils du Barbare mort s'agenouille devant le cadavre de son père et pose sur vous un regard brillant de haine. Pendant ce temps, les autres éclaireurs Barbares s'approchent de vous et il vous faut agir vite si vous voulez leur échapper.",
  choix: [
    { texte: "Vous décidez alors de prendre l'enfant en otage, mais il se débat comme un animal sauvage : il mord, griffe et donne des coups de pied pour essayer de se dégager", vers: "320" }
  ]
  },
  {
  id: "187",
  texte: "Dès que vous avez refermé le Bracelet autour de votre poignet, une terrible douleur vous déchire la tête. Vous êtes attaqué par une puissante Force Mentale qui essaie d'annihiler en vous toute volonté.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Bouclier Psychique", vers: "258", requis: {"discipline":"bouclier-psychique"} },
    { texte: "Sinon", vers: "93" }
  ]
  },
  {
  id: "188",
  texte: "Le lendemain d'épais nuages de neige se sont amoncelés audessus de la banquise de Liouk et un faible vent s'est levé. A mesure que vous approchez du bord du glacier de Viad, le terrain devient plus accidenté. Des blocs de glace se dressent çà et là, formant des obstacles difficiles à franchir. Vous êtes contraint de descendre des traîneaux et de les manœuvrer à la main parmi toutes ces aspérités pour pouvoir atteindre les pentes plus lisses du lointain glacier. Vous avez parcouru environ 800 mètres lorsque vous apercevez soudain devant vous une grande crevasse. Elle ne fait pas plus d'une soixantaine de centimètres de large mais elle s'étend sur plus d'un kilomètre et demi en travers de votre chemin. Par mesure de sécurité, vos guides et vous-même décidez de vous encorder pour la franchir. Ainsi, s'il arrivait que l'un de vous tombe dans ce gouffre, les autres pourraient le hisser à la surface sans trop de difficulté. Vous n'avez aucun mal à enjamber la crevasse. Hélas ! il y en a d'autres un peu plus loin, et en si grand nombre qu'elles forment un véritable réseau. De fines couches de neige les dissimulent parfois à la vue et vous ne parvenez à les repérer qu'en tâtant le sol à l'aide de votre arme. Vous avancez ainsi pendant encore 800 mètres, puis vous arrivez devant une nouvelle crevasse qui fait, cette fois, environ 2,50 mètres de large. Vous jetez un coup d'œil dans ses profondeurs, mais il n'y a pas la moindre lueur dans ce vide béant. Vos traîneaux sont longs de 3 mètres et ils pourraient vous servir de ponts pour franchir le gouffre, mais s'il arrivait que ses bords cèdent sous leur poids, vous risqueriez alors de perdre d'un seul coup tout votre matériel.",
  choix: [
    { texte: "Si vous souhaitez décharger les traîneaux et les utiliser comme passerelles", vers: "232" },
    { texte: "Si vous préférez sauter pardessus la crevasse avec les chiens Kanu et, ensuite, tirer les traîneaux pour les amener à leur tour de l'autre côté", vers: "346" }
  ]
  },
  {
  id: "189",
  texte: "Vous avancez le long du couloir pendant un quart d'heure environ, puis vous arrivez devant une immense porte de pierre haute de 6 mètres. Vous y collez l'oreille et vous remarquez alors qu'elle dégage une douce tiédeur. Vous sentez une vibration parcourir la pierre et vous entendez un faible grondement. Tout comme les autres portes d'Ikaya, celle-ci est actionnée par un levier fixé au mur.",
  choix: [
    { texte: "Si vous souhaitez tirer ce levier et franchir la porte", vers: "292" },
    { texte: "Si vous préférez vous en abstenir, vous pouvez retourner à la bifurcation et emprunter le passage orienté à l'est", vers: "97" }
  ]
  },
  {
  id: "190",
  texte: "Vous ne relâchez l'enfant qu'au dernier moment, juste avant d'empoigner les fouets et d'en cingler l'échiné des chiens qui s'élancent aussitôt, de toute la puissance de leurs muscles. Des volées de flèches vous sifflent aux oreilles et plusieurs d'entre elles viennent se ficher avec un bruit mat dans l'armature de bois du traîneau. Deux éclaireurs Barbares vous donnent la chasse, mais vos chiens ont à présent atteint leur pleine vitesse et vous avez tôt fait de distancer vos poursuivants en restant désormais hors de portée de leurs flèches. A la nuit tombée, vous arrivez au pied des monts de Viad. Cette immense chaîne de granité dresse au-dessus de la glace ses flancs escarpés, gigantesque barrière de roc qu'il est inutile d'espérer franchir par cette nuit sans lune. Bientôt, le vent se lève à l'ouest, annonçant une tempête nocturne et il vous faut à tout prix trouver un endroit où vous abriter, sinon, vous ne survivrez pas au blizzard.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation ou celle du Sixième Sens", vers: "348", requis: {"discipline":"sixieme-sens"} },
    { texte: "Si vous ne possédez aucune de ces deux Disciplines, vous pouvez chercher un abri en marchant vers le nord", vers: "27" },
    { texte: "Si vous préférez prendre la direction du sud pour essayer de trouver cet abri", vers: "314" }
  ]
  },
  {
  id: "191",
  texte: "Tremblant de fatigue, vous parvenez enfin au fond du défilé alors que la nuit tombe. Un peu plus loin, vous apercevez une grotte située sous une chute d'eau gelée. Le vent souffle beaucoup plus fort à présent et vous décidez de vous abriter dans cette grotte. Lorsque vous y pénétrez, vous êtes surpris de distinguer, dans la paroi du fond, un rayon de lumière qui filtre à travers une fissure.",
  choix: [
    { texte: "Vous vous approchez prudemment de cette étrange lueur mais hélas ! vous ne remarquez pas une crevasse dissimulée par une couche de neige et vous y tombez dans une avalanche de glace brisée", vers: "40" }
  ]
  },
  {
  id: "192",
  texte: "Si vous possédez une Pierre Rayonnante, rendez-vous au 267. Sinon, rendez-vous au 44.",
  choix: [
    { texte: "Si vous possédez une Pierre Rayonnante", vers: "267" },
    { texte: "Sinon", vers: "44" }
  ]
  },
  {
  id: "193",
  texte: "Vous avez les jambes couvertes d'écorchures et de bleus. Par surcroît, vous vous êtes cogné contre une stalactite et vous saignez du nez. Vous perdez 2 points d'ENDURANCE, mais vous pouvez vous estimer heureux : vous avez en effet échappé de peu à une chute au fond d'une crevasse que vous aviez failli ne pas voir dans l'obscurité.",
  choix: [
    { texte: "Mettez à jour votre Feuille d'Aventure, et", vers: "235" }
  ]
  },
  {
  id: "194",
  texte: "Votre habileté et votre patience sont finalement récompensées. Vous entendez en effet un très léger cliquetis qui vous indique que vous avez réussi. Vous ôtez alors votre lame de la serrure et le grand couvercle de pierre se soulève lentement pour laisser voir un magnifique Casque d'Argent.",
  choix: [
    { texte: "Si vous souhaitez vous coiffer de ce Casque", vers: "308" },
    { texte: "Si vous préférez le laisser au fond de son coffre, vous poursuivrez votre chemin en montant l'escalier", vers: "323" }
  ]
  },
  {
  id: "195",
  texte: "Au moment où vous bondissez vers l'autre bord, la glace se met à trembler et la crevasse s'élargit soudain. Vous glissez et vous vous cognez la tête contre le bord du gouffre béant dans lequel vous tombez.",
  choix: [
    { texte: "Le lien qui attache votre ceinture à la corde de sécurité se rompt sous le choc et vous êtes précipité dans les ténèbres", vers: "21" }
  ]
  },
  {
  id: "196",
  texte: "Votre lutte est désespérée, mais c'est précisément dans ce désespoir que vous trouvez la force de survivre. Votre arme (ou vos armes) vous a (ont) été arrachée (s) des mains par le cyclone et le bombardement de glace et de pierres que vous avez dû subir vous fait perdre 2 points d'ENDURANCE. Faites les modifications nécessaires sur votre Feuille d'Aventure. Vous parvenez cependant à atteindre péniblement l'arcade située au nord.",
  choix: [
    { texte: "Vous avez perdu votre (vos) arme (s), mais vous êtes vivant", vers: "306" }
  ]
  },
  {
  id: "197",
  texte: "Vous apercevez un autre passage qui permet de quitter la caverne en prenant la direction du nord.",
  choix: [
    { texte: "Si vous souhaitez passer sans bruit devant les créatures endormies pour atteindre ce tunnel", vers: "125" },
    { texte: "Si vous préférez ne pas prendre le risque de les réveiller, vous pouvez retourner sur vos pas et emprunter l'autre tunnel", vers: "235" },
    { texte: "Enfin, si vous désirez attaquer les créatures endormies, vous pouvez le faire", vers: "109" }
  ]
  },
  {
  id: "198",
  texte: "Le couloir aboutit à une grande porte de pierre. A la différence des autres, cette porte n'est pas actionnée par un levier; en revanche, vous découvrez, juste à côté, une fente creusée dans le mur. Vous êtes en train d'examiner cette fente lorsque, soudain, une meute hurlante de Barbares des Glaces mutants se précipite sur vous le long du couloir. Vous vous préparez à vous défendre, mais ils sont trop nombreux et, bien que vous les affrontiez avec courage, ils finissent par avoir raison de vous. Inutile d'attendre d'eux la moindre pitié : quelques instants plus tard, vous mourez sous leurs coups. Votre mission s'achève donc ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §198"
  },
  {
  id: "199",
  texte: "Au bout d'un kilomètre et demi environ, le tunnel aux murs de glace aboutit à une grotte magnifique. De la neige fondue coule en cascade sur des rocs argentés, projetant alentour des reflets éblouissants. Sous la cascade s'ouvre une petite grotte qui disparaît dans la paroi rocheuse aux éclats d'argent. Il ne semble pas qu'il y ait d'autre chemin pour quitter cette caverne.",
  choix: [
    { texte: "Si vous souhaitez pénétrer dans la petite grotte", vers: "82" },
    { texte: "Si vous préférez revenir sur vos pas et prendre l'autre tunnel", vers: "284" }
  ]
  },
  {
  id: "200",
  texte: "L'effroyable monstre aux longs tentacules surgit du fossé et vous attaque. Il vous faut le combattre jusqu'à la mort de l'un de vous. AKRANION OR HABILETÉ: 22 ENDURANCE: 50 Au cours du combat, vous apercevez parfois Vonotar qui brandit son bâton noir de magicien en gardant les yeux fixés sur LoiKymar. Il est en train d'attaquer le vieil homme à l'aide de sa puissante Force Mentale. Et si Loi-Kymar succombe, il emportera dans la mort le secret de la Crosse de la Guilde.",
  choix: [
    { texte: "Si vous remportez la victoire en 7 Assauts ou moins", vers: "272" },
    { texte: "S'il vous faut livrer plus de 7 Assauts pour gagner le combat", vers: "324" }
  ],
  combat: { nom: "Akranion Or", habilete: 22, endurance: 50 }
  },
  {
  id: "201",
  texte: "La coupe grince au bout des chaînes qui la retiennent et des débris de pierre tombent du plafond, tandis que vous vous élancez au-dessus de la crevasse ; vous avez de la chance cependant, car la Corde tient bon et vous parvenez sans encombre de l'autre côté. D'un bref mouvement du poignet, vous détachez la Corde que vous récupérez et vous poursuivez votre chemin le long du passage. Quelques mètres plus loin, vous apercevez sur votre droite une porte de pierre en arcade sur laquelle ont été sculptés d'étranges motifs. Ils représentent des centaines de squelettes accrochés par groupes de trois ou quatre à des blocs de pierre aux faces lisses. A côté de la porte se trouve un levier fixé au mur.",
  choix: [
    { texte: "Si vous souhaitez tirer sur ce levier pour ouvrir la porte", vers: "110" },
    { texte: "Si vous préférez poursuivre votre chemin le long du passage", vers: "63" }
  ]
  },
  {
  id: "202",
  texte: "Soudain, les rugissements des Languabarbs cessent. Ils ont senti l'odeur d'huile de Bakanal dont votre peau est imprégnée et ils se précipitent aussitôt sur vous.",
  choix: [
    { texte: "Si vous souhaitez les combattre", vers: "263" },
    { texte: "Si vous préférez prendre la fuite", vers: "277" }
  ]
  },
  {
  id: "203",
  texte: "Un petit judas a été aménagé au centre de la porte. Vous y jetez un coup d'œil prudent et vous apercevez alors le vieil homme vêtu d'une toge bleue que vous aviez déjà vu par l'ouverture pratiquée au-dessus de sa cellule.",
  choix: [
    { texte: "Si vous souhaitez ouvrir cette porte, tirez le levier fixé au mur et", vers: "56" },
    { texte: "Si vous préférez ne pas vous préoccuper du vieil homme, poursuivez votre chemin le long du couloir jusqu'à la bifurcation", vers: "276" }
  ]
  },
  {
  id: "204",
  texte: "Les Bakanals sont des créatures féroces et dangereuses qui n'ont peur que d'une chose : le feu. Saisissant alors une torche, vous l'allumez et vous sortez de la tente. Le vent souffle beaucoup plus fort qu'au moment où vous avez installé votre camp et la neige poudreuse est soulevée en petits tourbillons qui vous picotent les yeux. Une ombre mouvante à votre droite trahit la présence du Bakanal qui s'avance vers vous à grands bonds. Mais au moment où il s'apprête à vous sauter dessus, il aperçoit la flamme vacillante de votre torche et pousse un hurlement de terreur. Quelques secondes plus tard, il a disparu dans l'obscurité. Vous constatez bientôt que tous les chiens Kanu sont sains et saufs, bien qu'un peu nerveux, ce qui n'a rien d'étonnant.",
  choix: [
    { texte: "Pour être sûr que le Bakanal n'attaquera plus, vous prenez des tours de garde en tenant à portée de main armes et torches", vers: "134" }
  ]
  },
  {
  id: "205",
  texte: "La nuit durant, un violent blizzard fait rage, enterrant votre abri de fortune sous une couche de neige de 3,50 mètres d'épaisseur. Le froid vous engourdit les mains et les pieds et, peu à peu, votre corps se vide de toute son énergie. Vous glissez alors dans un sommeil dont vous ne vous éveillerez jamais: vous étouffez en effet sous les neiges de Kalte. Votre mission s'achève donc ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §205"
  },
  {
  id: "206",
  texte: "Retenant à la fois votre souffle et votre matériel, vous essayez d'atterrir le plus silencieusement possible sur le sol poussiéreux du couloir. Malheureusement, vous vous tordez la cheville en tombant et vous laissez échapper un cri de douleur. Vous perdez 1 point d'ENDURANCE. Vous apercevez alors avec horreur un Barbare des Glaces assis à une dizaine de mètres de vous, sur votre gauche. Il tourne lentement la tête dans votre direction mais, en jetant un bref coup d'œil vers la droite, vous découvrez un autre couloir orienté au nord, à moins de 5 mètres de l'endroit où vous êtes agenouillé.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Camouflage", vers: "74", requis: {"discipline":"camouflage"} },
    { texte: "Sinon, vous pouvez essayer de courir en direction du couloir orienté au nord, en priant le ciel que le Barbare des Glaces ne vous voie pas", vers: "183" },
    { texte: "Enfin, si vous préférez attaquer le Barbare pour tenter de le neutraliser avant qu'il ait pu donner l'alerte", vers: "161" }
  ]
  },
  {
  id: "207",
  texte: "Vous distinguez la sombre silhouette de la créature qui fonce le long du tunnel dans votre direction. Elle est assoiffée de sang et frémissante de rage, prête à vous mettre en pièces. Vous songez alors que, si vous sautez de côté lorsque la créature surgira du tunnel, il se peut qu'elle vous rate et que, emportée par son élan, elle tombe tête la première sur la mince couche de glace qui recouvre le lac.",
  choix: [
    { texte: "Si vous souhaitez tenter ce saut de côté lorsque le Languabarb bondira hors du tunnel", vers: "80" },
    { texte: "Si vous préférez rester où vous êtes et combattre le monstre quand il sera devant vous", vers: "253" }
  ]
  },
  {
  id: "208",
  texte: "Le Barbare des Glaces vous voit approcher et tire aussitôt son épée en os, puis il se poste devant l'escalier pour vous empêcher de passer. Il vous faut l'affronter.",
  choix: [
    { texte: "BARBARE DES GLACES HABILETÉ : 17 ENDURANCE : 30 Si vous remportez la victoire en 4 Assauts ou moins", vers: "4" },
    { texte: "Si vous gagnez le combat en plus de 4 Assauts", vers: "81" }
  ],
  combat: { nom: "Barbare des Glaces", habilete: 17, endurance: 30 }
  },
  {
  id: "209",
  texte: "Vous vous cramponnez à la paroi rocheuse pendant toute la nuit. Le vent glacial vous cingle le visage et vous êtes saisi de tremblements incontrôlables, luttant de toutes vos forces pour ne pas vous évanouir. Vous perdez 2 points d'ENDURANCE.",
  choix: [
    { texte: "L'huile de Bakanal vous permet cependant de conserver suffisamment de chaleur dans votre corps pour arriver à survivre : sans elle, le froid aurait eu raison de vous", vers: "155" }
  ]
  },
  {
  id: "210",
  texte: "Vous pouvez prendre l'arme du Barbare si vous le souhaitez : il s'agit d'une épée en os incrustée de dents. En examinant son cadavre, vous découvrez un Bracelet d'Or passé à son poignet droit.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "316", requis: {"discipline":"sixieme-sens"} },
    { texte: "Si vous souhaitez vous emparer du Bracelet d'Or, après l'avoir inscrit sur votre Feuille d'Aventure dans la case Objets Spéciaux", vers: "236" },
    { texte: "Si vous ne souhaitez pas prendre le Bracelet, hâtez-vous de repartir le long du couloir en direction d'un croisement situé un peu plus loin", vers: "215" }
  ]
  },
  {
  id: "211",
  texte: "Le cyclone est si violent qu'il en déchire presque vos vêtements tout en vous bombardant de pierres et de morceaux de glace. Vous serrez les dents et vous essayez de courir, mais le froid annihile vos forces et vous devez avancer pas à pas en vous cramponnant au mur pour ne pas être aspiré par le tourbillon déchaîné. Utilisez la Table de Hasard pour obtenir un chiffre. Si votre total actuel d'ENDURANCE est inférieur à 10, ôtez 3 points du chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "3-3": { vers: "95", texte: "Si le total obtenu est de - 3 à 3," },
        "4-9": { vers: "196", texte: "S'il est de 4 à 9," }
      }
      }
  },
  {
  id: "212",
  texte: "Lorsque vous revenez sous la tente, Dyce prépare un délicieux Repas qui vient à point pour vous remplir l'estomac et vous redonner courage. Vous avez parcouru à présent une distance appréciable et, en dépit des épreuves physiques que vous avez dû supporter, vous vous sentez confiant et impatient de continuer. Irian va chercher les Couvertures de Fourrure dans le traîneau et vous vous préparez tous à passer une bonne nuit de sommeil. La nuit, vous gardez toujours vos vêtements pour vous protéger du froid et vous n'enlevez que vos bottes. Les quelques jours que vous avez passés sur ces terres désolées ont suffi à vous en apprendre long sur les techniques de survie. Lorsque vous vous déchaussez, vous prenez garde à ce que vos bottes conservent bien la forme de vos pieds : par ces températures glaciales, en effet, elles ont tôt fait de geler et de devenir dures comme la pierre ; vous avez alors toutes les peines du monde à les chausser à nouveau si elles se sont déformées. Pour dénouer vos lacets, vous devez ôter vos gants, mais il vous faut interrompre l'opération à plusieurs reprises pour remettre vos moufles dès que vous sentez la morsure du gel vous engourdir les doigts.",
  choix: [
    { texte: "Lorsque vous êtes enfin pelotonné sous vos fourrures, vous claquez encore des dents pendant quelques instants avant de sombrer dans un profond sommeil, tandis que le vent mugit au dehors", vers: "238" }
  ]
  },
  {
  id: "213",
  texte: "Vous dirigez la pointe du Glaive de Sommer vers la baguette de cristal de Vonotar et, un instant plus tard, le cône de givre, détourné de sa trajectoire, vient se fracasser contre la lame d'or.",
  choix: [
    { texte: "Le Glaive de Sommer vous a une fois encore protégé de la magie destructive de Vonotar et vous entendez le sorcier pousser un juron rageur", vers: "252", requis: {"special":"glaive-sommer"} }
  ]
  },
  {
  id: "214",
  texte: "Malheureusement, le Languabarb a décelé votre odeur et se précipite vers votre cachette. Il vous donne un coup de son énorme patte et ses griffes déchirent la manche de votre tunique. Vous perdez 2 points d'ENDURANCE. Pour fuir le Languabarb, il ne vous reste plus à présent qu'un seul moyen : traverser le lac en courant.",
  choix: [
    { texte: "Si vous souhaitez tenter cette fuite à travers le lac", vers: "322" },
    { texte: "Si vous préférez combattre le Languabarb", vers: "123" }
  ]
  },
  {
  id: "215",
  texte: "Le couloir forme un angle et vous vous hâtez de tourner le coin. Derrière vous, tout semble silencieux et vous poussez un soupir de soulagement. Vous remarquez alors que le grondement entendu précédemment est devenu plus intense dans ce tunnel. A quelques mètres sur votre gauche, un petit passage mène à une porte de pierre qui est fermée.",
  choix: [
    { texte: "Si vous souhaitez examiner cette porte", vers: "13" },
    { texte: "Si vous préférez poursuivre votre chemin le long du couloir en direction du nord", vers: "254" }
  ]
  },
  {
  id: "216",
  texte: "Vous avez parcouru 1,5 kilomètre environ lorsque vous apercevez les premiers éclaireurs Barbares. Ils sont à skis et se trouvent au nord. Tout d'abord vous ne voyez que deux de ces redoutables guerriers, mais trois de leurs camarades les rejoignent bientôt. Grands, la carrure particulièrement impressionnante, ils portent des vêtements de fourrure. Quelques-uns d'entre eux sont également équipés d'une armure en os. En dépit de leur taille, ils glissent sur la neige avec une grâce et une rapidité presque félines. Chacun d'eux s'est attaché dans le dos une longue baguette à l'extrémité de laquelle flotte un petit drapeau. Soudain, une flèche à la pointe d'os vous frôle le genou et vient se ficher dans l'armature de bois du traîneau. Un instant plus tard, un éclaireur Barbare passe à moins de 10 mètres de vous en filant sur ses skis et vous avez le temps d'apercevoir son visage aux pommettes saillantes et aux yeux bridés. Puis, tout à coup, vous vous rendez compte que le Barbare porte un enfant sur le dos. En fait, chacun des éclaireurs porte ainsi un enfant blotti dans un sac à dos : c'est la raison pour laquelle leur carrure vous semblait, de loin, si impressionnante. Ces enfants sont armés de petits arcs en os et ils décochent des flèches en un tir nourri, tandis que leurs pères se rapprochent de vous en glissant sur leurs skis. Brusquement, Irian s'écroule, une flèche plantée dans le dos. Dyce s'élance à son secours, mais il a à peine fait dix pas qu'une autre flèche l'atteint à son tour. Fenor aussi est touché, une flèche lui transperce la gorge. D'un pas chancelant, il essaie courageusement de se maintenir debout pendant quelques instants avant de s'effondrer dans la neige. Vous êtes seul, à présent, tous vos guides sont morts. Un éclaireur Barbare passe alors à votre gauche puis après un virage en épingle à cheveux, il se met à foncer sur vous en pointant une longue lance à hauteur de votre poitrine.",
  choix: [
    { texte: "Si vous souhaitez combattre l'éclaireur Barbare", vers: "158" },
    { texte: "Si vous préférez tenter de vous enfuir", vers: "149" }
  ]
  },
  {
  id: "217",
  texte: "Le monolithe explose soudain, projetant en tous sens des centaines d'éclats tranchants comme des rasoirs. Vous êtes criblé par les fragments de pierre et la seule force de l'explosion vous précipite sur le sol. Vous perdez 10 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous êtes toujours vivant", vers: "154" }
  ]
  },
  {
  id: "218",
  texte: "La boîte en os contient un magnifique Diamant. Même dans la pénombre des lieux, ses multiples facettes étincellent. Dans le royaume du Sommerlund, une pierre de cette taille et de cette qualité vaudrait des milliers de Couronnes d'Or. Si vous souhaitez conserver ce Diamant, glissez-le dans votre poche et inscrivez-le sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Vous pouvez à présent examiner la porte de la forteresse", vers: "52" }
  ]
  },
  {
  id: "219",
  texte: "Vous sentez que le sourd grondement qui résonne dans cette partie de la forteresse est beaucoup plus intense dans le couloir orienté à l'ouest que dans celui orienté à l'est. Ce bruit a quelque chose d'insolite qui vous met mal à l'aise.",
  choix: [
    { texte: "Vous décidez donc d'éviter le couloir de l'ouest et d'emprunter celui de l'est", vers: "349" }
  ]
  },
  {
  id: "220",
  texte: "Le lendemain, il règne un froid polaire. Un fort vent d'ouest souffle sans relâche tandis que vous conduisez votre traîneau en direction de la plaine de Hrod. Vous avez de la neige dans les yeux et vos lèvres gercées saignent. Vers midi cependant, vous atteignez la bordure de la plaine. Le traîneau de Dyce et d'Irian arrive le premier devant le mur de glace, et ils vous encouragent à les rejoindre le plus vite possible. Mais soudain, sans que rien ne l'ait laissé prévoir, une grande fissure apparaît entre les deux traîneaux, accompagnée d'un craquement terrifiant : quelques instants plus tard, une immense crevasse aux profondeurs obscures s'est formée devant vous. Vous tirez frénétiquement sur les rênes, mais il est trop tard : les chiens Kanu n'ont pas le temps de s'arrêter et disparaissent dans le vide. Votre traîneau reste en équilibre au bord de la crevasse, tandis que les chiens hurlent, suspendus dans le gouffre, retenus par leur harnais. Avec d'infinies précautions, vous vous risquez à jeter un coup d'œil dans la crevasse. Le harnais des deux premiers chiens a cédé et les deux malheureux animaux se sont écrasés 50 mètres plus bas, sur une surface glacée. L'un d'eux semble mort. L'autre est gravement blessé et gémit à côté du corps immobile de son congénère. Tout d'un coup, le traîneau se met à basculer un peu plus, dans une brusque secousse et vous êtes saisi d'épouvante.",
  choix: [
    { texte: "Si vous souhaitez vous glisser précautionneusement vers l'arrière du traîneau, en compagnie de Fenor", vers: "146" },
    { texte: "Si vous préférez sauter hors du traîneau, sur la glace fissurée", vers: "29" }
  ]
  },
  {
  id: "221",
  texte: "Le couloir dans lequel vous vous trouvez maintenant bénéficie d'une température beaucoup plus clémente que la caverne glacée. Pour la première fois depuis longtemps, vous pouvez abaisser le capuchon de votre cape et enlever vos moufles sans risquer la morsure du gel. Vous remarquez que ce passage monte vers une sorte de palier où un autre couloir bifurque en direction de l'est. Des coupes de M'iare sont suspendues à la voûte, à intervalles réguliers, éclairant d'une lumière insolite les murs ornés de motifs sculptés. Lorsque vous approchez du palier, vous apercevez une arcade qui ouvre sur une petite pièce. Vous découvrez alors un étrange spectacle. Le sol de cette pièce, en effet, est encombré de fourrures en lambeaux, d'éclats de poterie et de toutes sortes de débris qui semblent avoir été amassés là depuis des siècles. Un grand levier est fixé au mur, juste à côté de l'arcade.",
  choix: [
    { texte: "Si vous souhaitez entrer dans cette pièce pour examiner les débris qu'elle contient", vers: "38" },
    { texte: "Si vous souhaitez tirer le levier", vers: "163" },
    { texte: "Enfin, si vous préférez poursuivre votre chemin vers l'est, le long du couloir", vers: "237" }
  ]
  },
  {
  id: "222",
  texte: "Mettant en pratique votre Discipline Kaï, vous vous dissimulez dans l'ombre projetée par un pilier. Les Barbares des Glaces passent à 15 centimètres de vous, mais ils ne s'aperçoivent pas de votre présence.",
  choix: [
    { texte: "Lorsque vous êtes sûr qu'ils se sont suffisamment éloignés, vous sortez de l'ombre et vous poursuivez votre chemin le long du couloir", vers: "330" }
  ]
  },
  {
  id: "223",
  texte: "Le traîneau contient le matériel détaillé ci-dessous. Vous pouvez prendre n'importe lequel de ces objets et le ranger dans votre Sac à Dos, mais n'oubliez pas que vous n'avez pas le droit d'y transporter plus de huit objets: des provisions équivalentes à 5 Repas (chaque Repas compte pour un objet ; vous pouvez en emporter autant que vous le désirez, de 1 à 5, dans la limite bien sûr de la place dont vous disposez) ; une Tente (elle compte pour 3 objets) ; des Couvertures de Fourrure (elles comptent pour 2 objets) ; une Longue Corde (elle compte pour 2 objets). Dyce se porte volontaire pour retourner avec le traîneau et les chiens à l'endroit où est ancré le vaisseau Cardonal, tandis que vos deux autres guides et vous-même poursuivrez votre chemin en direction d'Ikaya, la Forteresse des Glaces. Ikaya a été taillée dans la chaîne de Hrod en des temps très anciens, par une race de créatures qui a depuis longtemps disparu. Des milliers d'années ont passé avant que les Barbares des Glaces, émigrant des Étendues Inexplorées, ne viennent s'approprier la forteresse. Depuis cette époque leurs chefs, que l'on appelle les «Brumalmarc», exercent leur pouvoir sur les terres de Kalte à l'abri des murs de glace d'Ikaya. Vous avez parcouru environ 8 kilomètres lorsqu'Irian pointe soudain l'index en direction de l'ouest. « Là, là-bas, dit-il, j'ai vu quelque chose, j'en suis sûr ! » Vous vous arrêtez et vous essayez d'apercevoir ce qui a pu lui apparaître inhabituel dans ce paysage monotone de glace et de neige. « Regardez là-bas ! » s'écrie alors Fenor, en montrant une hauteur située à 1,5 kilomètre environ. Vous distinguez alors deux guerriers vêtus de fourrure qui se tiennent debout sur un gros bloc de glace. Les deux guerriers vous observent. « Des Barbares des Glaces, murmure Irian, la voix tremblante de peur. Si jamais ils arrivent avant nous à Ikaya et signalent notre présence, autant dire que nous sommes morts. »Vous avez encore une quinzaine de kilomètres à parcourir pour atteindre la forteresse et il ne reste que deux heures de jour.",
  choix: [
    { texte: "Si vous souhaitez ne pas prêter attention à ces Barbares et poursuivre votre chemin vers Ikaya", vers: "327" },
    { texte: "Si vous préférez les attaquer pour essayer de les empêcher de donner l'alerte", vers: "307" }
  ]
  },
  {
  id: "224",
  texte: "A 6 mètres au-dessous environ, vous apercevez un homme vêtu d'une cape sombre. Il est agenouillé au milieu d'un grand pentagramme dessiné à la craie sur le sol d'une cellule sale et obscure.",
  choix: [
    { texte: "Si vous souhaitez appeler cet homme", vers: "67" },
    { texte: "Si vous préférez rester silencieux et poursuivre votre chemin le long du couloir en direction de l'escalier", vers: "166" }
  ]
  },
  {
  id: "225",
  texte: "Le bouchon est scellé avec de la cire. Si vous voulez briser la cire, sachez que vous prenez le risque de casser le verre peu épais de la fiole.",
  choix: [
    { texte: "Pour essayer de briser la cire qui scelle le bouchon", vers: "54" },
    { texte: "Si le contenu de cette fiole ne vous inspire pas confiance et que vous ne souhaitiez pas risquer de la casser, abandonnez-la et pour faire un nouveau choix", vers: "10" }
  ]
  },
  {
  id: "226",
  texte: "Vous agitez frénétiquement le pied et vous parvenez à vous libérer au moment précis où le traîneau bascule dans la crevasse. Fenor se précipite alors vers vous et vous tire en arrière pour vous éloigner du bord instable. Ensuite, vous sautez tous deux par-dessus l'ouverture béante que vous franchissez sans encombre, et vous rejoignez les autres. Vous avez perdu votre traîneau, vos chiens et la plus grande partie de vos vivres, mais vous êtes vivant. Bien que cette perte doive inévitablement entraîner des épreuves supplémentaires dans la suite de votre voyage, vos guides acceptent de poursuivre la mission. Au loin, vous apercevez un étroit défilé, à la jonction de la banquise et de la plaine de Hrod. A la nuit tombée, vous atteignez l'abri de ce défilé et vous décidez d'y établir votre campement. En faisant alors l'inventaire des vivres qui vous restent, vous vous apercevez qu'il faudra diminuer les rations de moitié d'ici à Ikaya.",
  choix: [
    { texte: "Dans l'immédiat, le maigre Repas qui vous tient lieu de dîner vous fait perdre 1 point d'ENDURANCE", vers: "325" }
  ]
  },
  {
  id: "227",
  texte: "Les boutons de pierre dépassent d'environ 2 centimètres de la surface lisse de l'autel. Vous remarquez que d'étranges hiéroglyphes sont tracés tout autour, mais le temps les a presque effacés et il est difficile de les distinguer clairement. Il vous faut à présent décider dans quel ordre vous allez appuyer sur les boutons. Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière, vous pourrez les enfoncer sans avoir besoin de les toucher.",
  choix: [
    { texte: "Si vous décidez d'appuyer sur le bouton de gauche, puis sur celui de droite", vers: "102" },
    { texte: "Si vous préférez appuyer d'abord sur le bouton de droite et ensuite sur celui de gauche", vers: "334" },
    { texte: "Enfin, si vous décidez d'appuyer sur les deux boutons en même temps", vers: "299" }
  ]
  },
  {
  id: "228",
  texte: "Vous faites appel à tous vos pouvoirs de concentration pour élever le bol d'herbes fumantes et le faire avancer dans le couloir, suspendu dans les airs. Enfin, vous le posez à distance à l'ombre d'un pilastre et vous observez avec une grande curiosité les effets produits par la mixture. Moins d'une minute plus tard, les Barbares des Glaces se sont effondrés sur le sol. «Allons-y à présent», murmure Loi-Kymar en vous faisant sortir de la cuisine. Vous vous approchez ensuite de la salle du Trône du Brumalmarc et vous découvrez alors que l'une des magnifiques portes incrustées de pierreries n'est pas fermée à clé.",
  choix: [
    { texte: "Tirant aussitôt votre épée, vous entrebâillez doucement la porte et vous pénétrez dans le repaire de Vonotar", vers: "173" }
  ]
  },
  {
  id: "229",
  texte: "Vous reconnaissez ce serpent : c'est un Javek, un serpent des glaces à deux têtes, et au venin mortel. Tandis qu'il ondule vers vous, vous voyez s'ouvrir la gueule de sa seconde tête et vous distinguez nettement ses crochets jaunes à l'extrémité desquels perle une goutte de venin. La créature se déplace très rapidement et vous avez parfaitement conscience que vous ne pourrez pas la distancer sur cette corniche étroite.",
  choix: [
    { texte: "Si vous possédez une Sphère de Feu", vers: "46" },
    { texte: "Sinon, il faut vous préparer au combat et", vers: "88" }
  ]
  },
  {
  id: "230",
  texte: "Le Monstre d'Enfer se consume et se décompose à vos pieds, un gaz vert et nauséabond s'échappant de ses vêtements. Tandis que vous contemplez avec horreur sa répugnante dépouille, vous songez que cette créature a dû être envoyée ici pour tuer Vonotar ; les Maîtres des Ténèbres, en effet, voulaient ainsi faire payer au mage félon sa défaite dans la bataille du golfe de Holm. Vonotar a sans doute découvert la présence du Monstre d'Enfer dans la forteresse et l'a emprisonné dans un pentagramme en attendant de trouver le moyen de s'en débarrasser définitivement. Vous tâtez avec précaution votre gorge blessée en remerciant les dieux d'avoir pu brandir le Glaive de Sommer : son pouvoir, une fois de plus, vous a sauvé la vie.",
  choix: [
    { texte: "Enfin, vous abandonnez les restes nauséabonds du Monstre d'Enfer, et vous vous hâtez de descendre l'escalier", vers: "166" }
  ]
  },
  {
  id: "231",
  texte: "Vous sentez qu'il y a là quelque chose d'anormal. Les terres de Kalte, en effet, sont dépourvues de mines et, par conséquent, tous les métaux, et pas seulement l'or, y sont considérés comme un bien rare et précieux. Le seul moyen qu'ont les Barbares des Glaces de se procurer du métal, c'est de l'échanger chaque été contre des fourrures sur le marché de Liouk ; mais seul l'acier les intéresse. Aussi en déduisez-vous que ces Bracelets sont portés par obligation plutôt que par souci de coquetterie.",
  choix: [
    { texte: "Si vous souhaitez passer l'un de ces Bracelets d'Or à votre poignet, inscrivez-le sur votre Feuille d'Aventure dans la case Objets Spéciaux et", vers: "187" },
    { texte: "Si vous préférez laisser ces Bracelets là où ils sont et poursuivre votre exploration d'Ikaya", vers: "63" }
  ]
  },
  {
  id: "232",
  texte: "Après avoir réussi à francnir la crevasse, vous poursuivez votre chemin pendant presque une heure avant d'arriver enfin devant le glacier de Viad. Son ascension est une entreprise redoutable : il présente en effet un mur de glace lisse en à-pic qui s'élève à plus de 30 mètres de hauteur. Il vous faut décharger les traîneaux puis hisser le matériel au sommet avant de le recharger à nouveau. Les chiens Kanu passent leur temps à se battre entre eux tandis que vous menez à bien cette tâche fastidieuse et épuisante. Lorsque tout le matériel se trouve enfin sur le glacier, vous vous apercevez que vos provisions, singulièrement malmenées par ce transport, ne sont plus qu'une bouillie peu appétissante ; il faut cependant vous en contenter en guise de dîner. Vous dressez la tente au sommet du mur de glace, au creux d'une cuvette naturelle et vous vous installez pour profiter d'une nuit de repos bien méritée. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "85", texte: "Si vous tirez un chiffre de 0 à 6," },
        "7-9": { vers: "300", texte: "Si vous tirez 7, 8 ou 9," }
      }
      }
  },
  {
  id: "233",
  texte: "Vous reconnaissez ce liquide : c'est une décoction de Laumspur, une herbe aux propriétés curatives particulièrement efficace. Cette Potion concentrée permet à celui qui la boit de récupérer 5 points d'ENDURANCE. Si vous souhaitez conserver la fiole, inscrivez-la sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  suite: "10",
  choix: [
    { texte: "Pour faire un autre choix", vers: "10" }
  ],
  effets: { objets: [{"id":"potion-laumspur","quantity":1}] }
  },
  {
  id: "234",
  texte: "L'homme hésite un instant, puis vous donne sa réponse : « C'est l'auberge de l'Ancre Rouillée, bien entendu. »",
  choix: [
    { texte: "Si vous souhaitez à présent effacer une partie du pentagramme pour libérer le prisonnier", vers: "170" },
    { texte: "Si vous préférez le laisser dans sa prison magique, refermez la porte de la cellule et retournez dans le couloir principal", vers: "254" }
  ]
  },
  {
  id: "235",
  texte: "Après avoir parcouru une courte distance, vous arrivez dans une vaste grotte remplie de stalactites et de stalagmites. Le sol est couvert de traces d'animaux et d'ossements, mais l'endroit semble désert et tranquille. Vous remarquez que le mur situé au nord présente une surface lisse constituée de blocs de granité s'élevant jusqu'à un plafond de glace, à plus de 30 mètres de hauteur. Soudain, vous comprenez que vous êtes en train de contempler les fondations de pierre d'Ikaya : vous avez donc enfin réussi à atteindre la Forteresse de Glace. Vous distinguez alors, à demi cachée par un entassement de cristal, une rampe qui mène à une grande porte de pierre aménagée dans le mur de la forteresse. Cette découverte vous donne un regain d'espoir : si vous parvenez, en effet, à pénétrer dans la forteresse et à capturer rapidement Vonotar, vous aurez encore le temps de revenir à l'endroit où est ancré le Cardonal avant que les glaces d'hiver ne se forment sur la mer.",
  choix: [
    { texte: "Si vous souhaitez traverser la caverne pour aller examiner la porte de pierre", vers: "52" },
    { texte: "Si vous préférez examiner les ossements répandus sur le sol", vers: "115" }
  ]
  },
  {
  id: "236",
  texte: "Dès que le Bracelet d'Or se referme autour de votre poignet, une douleur fulgurante vous déchire la tête. Vous êtes soumis à l'attaque d'une puissante Force Mentale qui essaie d'annihiler votre volonté.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Bouclier Psychique", vers: "345", requis: {"discipline":"bouclier-psychique"} },
    { texte: "Sinon", vers: "9" }
  ]
  },
  {
  id: "237",
  texte: "Vous arrivez bientôt au pied d'un large escalier de pierre qui monte en direction du nord vers un palier situé à une dizaine de mètres au-dessus de vous. Chaque marche a été légèrement creusée en son milieu par les pieds des innombrables créatures qui ont jadis habité les étages inférieurs de la forteresse. Tandis que vous escaladez ces mêmes marches, vous vous demandez pendant combien de temps encore vous pourrez éviter que votre présence ne soit découverte. Jusqu'à présent vous n'avez pas rencontré âme qui vive dans ces couloirs déserts. Pour l'instant, vous bénéficiez de l'effet de surprise et vous priez le ciel que Vonotar ne soupçonne pas la présence d'un intrus dans les profondeurs de sa propre forteresse. Vous arrivez bientôt sur le palier, puis vous traversez une grotte vide en vous dirigeant vers une arcade plongée dans la pénombre. Là, le couloir bifurque : un passage part vers l'est, un autre vers l'ouest. Vous êtes affamé et il vous faut à présent prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous souhaitez emprunter le passage orienté à l'est", vers: "92" },
    { texte: "Si vous préférez vous engager dans le passage orienté à l'ouest", vers: "297" }
  ]
  },
  {
  id: "238",
  texte: "Les deux jours qui suivent sont un véritable enfer. Des blocs de glace se dressent continuellement sur votre chemin, vous forçant à descendre des traîneaux et à les manœuvrer à la main pour parvenir à passer. Vous avancez lentement et les chiens Kanu sont nerveux, prenant peur à la moindre occasion. Souvent, les traîneaux se renversent, répandant leur chargement sur le sol. Un brouillard de neige fine réduit la visibilité, provoquant par deux fois la chute de Fenor et d'Irian dans des crevasses ; heureusement, la corde de sécurité permet de les ramener sans dommage à la surface. C'est ensuite au tour de votre traîneau de disparaître dans une crevasse. Dyce se porte volontaire pour descendre dans le gouffre à l'aide d'une corde afin de décharger le traîneau : ainsi allégé, il sera possible de le hisser et de le récupérer. Après deux heures d'efforts harassants, vous parvenez enfin à remonter le traîneau mais vous vous apercevez alors qu'il a subi des dégâts irréparables et qu'il ne reste plus qu'à l'abandonner. Une tempête se lève bientôt à l'ouest et souffle si violemment que vous avez du mal à vous maintenir debout. En quelques minutes, les conditions météorologiques sont devenues trop mauvaises pour continuer. Vous dressez donc la tente et vous attendez que la tempête se calme. Des heures durant, la toile de la tente claque sans répit sous le souffle impitoyable du vent. Et, tandis que vous laissez le sommeil vous gagner peu à peu, vous vous demandez quelles autres épreuves vous attendent le lendemain.",
  choix: [
    { texte: "Vous n'avez alors aucune idée de l'étonnant spectacle qui s'offrira à vos yeux dès votre réveil", vers: "117" }
  ]
  },
  {
  id: "239",
  texte: "Vous perdez très vite conscience. Vous venez en effet de succomber au pouvoir terrifiant d'une ancienne Pierre Maudite, un pouvoir auquel nul être vivant ne peut survivre. La mort est inévitable et ne tardera plus. Peut-être éprouverez-vous malgré tout quelque consolation à apprendre que votre cadavre sera bientôt découvert par un Barbare des Glaces qui l'amènera devant Vonotar (en même temps que la Pierre Maudite). Le traître éprouvera alors tant de joie à vous voir mort qu'il ordonnera que votre corps soit conservé dans un bloc de glace et exposé dans sa salle du Trône, comme un trophée. Mais les radiations de la Pierre Maudite, restée dans votre poche, atteindront le sorcier maléfique en dépit de la couche de glace et Vonotar devra subir de longues souffrances avant de mourir à son tour. Bien entendu, votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §239"
  },
  {
  id: "240",
  texte: "Vous faites une chute de plus de 10 mètres et vous atterrissez sur le dos au fond de la crevasse, au milieu d'un tas de neige poudreuse. Vous êtes entouré de stalagmites et de pointes de glace qui hérissent les parois, mais par miracle vous êtes indemne. Quelque peu secoué par le choc, mais reconnaissant d'être toujours en vie, vous vous relevez en vous accrochant à une stalagmite. Vous vous rendez compte alors que vous voyez à peu près clairement autour de vous : une faible lumière filtre en effet à travers une ouverture située à votre gauche. La curiosité l'emporte sur votre prudence naturelle et vous vous approchez de cette lueur d'un pas chancelant.",
  choix: [
    { texte: "Vous découvrez là une grotte dans laquelle vous pénétrez", vers: "284" }
  ]
  },
  {
  id: "241",
  texte: "Le Barbare des Glaces n'a pas eu le temps de se relever lorsque vous l'attaquez; il est encore à genoux et incapable de réagir pendant les deux premiers Assauts. En conséquence, vous ne perdrez aucun point d'ENDURANCE au cours de ces deux premiers Assauts, quelles que soient les indications données par la Table des Coups Portés. Votre adversaire, en revanche, perdra tous les points d'ENDURANCE indiqués par cette même Table.",
  suite: "186",
  combat: { nom: "Barbare des Glaces", habilete: 18, endurance: 28 }
  },
  {
  id: "242",
  texte: "La porte de pierre est parfaitement lisse. Impossible de découvrir ni gonds, ni serrure, ni poignée de ce côté-ci du mur.",
  choix: [
    { texte: "Si vous disposez du Glaive de Sommer", vers: "42", requis: {"special":"glaive-sommer"} },
    { texte: "Dans le cas contraire, il ne vous sera possible de quitter les lieux qu'en empruntant le passage qui se trouve dans le mur du nord", vers: "145" }
  ]
  },
  {
  id: "243",
  texte: "Vous bénéficiez d'une chance exceptionnelle. Vous avez en effet évité de justesse une crevasse profonde que l'obscurité vous cachait.",
  choix: [
    { texte: "Vous poursuivez donc votre chemin en direction de la lueur sans vous préoccuper des bleus et contusions qui se multiplient sur vos tibias et vos genoux à mesure que vous vous cognes contre les blocs de glace dressés sur votre passage", vers: "235" }
  ]
  },
  {
  id: "244",
  texte: "Vous vous approchez de l'autel à pas prudents. La Statue est froide et apparemment inanimée, mais vous sentez que quelqu'un, ou quelque chose, est enfermé à l'intérieur. Vous avez même l'impression d'entendre des cris désespérés qui implorent la liberté.",
  choix: [
    { texte: "Si vous souhaitez fracasser la Statue à l'aide d'une arme", vers: "150" },
    { texte: "Si vous n'avez pas d'arme ou si vous préférez quitter le temple à l'instant et vous diriger vers l'arcade située au nord", vers: "306" }
  ]
  },
  {
  id: "245",
  texte: "La bête, avant de mourir, pousse un dernier cri d'agonie et une odeur pestilentielle vous frappe aussitôt les narines. Même les chiens Kanu froncent le museau en signe de dégoût et se détournent pour essayer d'échapper à l'effroyable puanteur. Irian s'approche alors du cadavre avec un couteau à la main et entreprend de dépecer la créature. Vous faites une grimace en le voyant découper la peau de l'animal, de la gorge au ventre pour l'arracher ensuite de sa chair. Mais vous n'êtes pas au bout de votre écœurement : Irian, en effet, plonge les mains dans la carcasse béante et en retire une graisse épaisse dont il s'enduit le visage et le corps. « C'est de l'huile de Bakanal, s'écrie-t-il avec enthousiasme, elle protège du froid et de l'humidité ; c'est encore mieux que la fourrure pour se préserver des glaces de Kalte. » En même temps, il tend vers vous une main pleine de graisse immonde dont il vous invite à vous enduire la peau à votre tour.",
  choix: [
    { texte: "Si vous acceptez de l'imiter en vous appliquant de l'huile de Bakanal sur le corps", vers: "91" },
    { texte: "Si, en revanche, l'idée de sentir à peu près aussi bon qu'une cuve remplie de roquefort rance ne vous séduit guère", vers: "172" }
  ]
  },
  {
  id: "246",
  texte: "Vous abaissez le levier et la porte de pierre coulisse latéralement, révélant une vaste grotte froide, sale et vide, à l'exception d'un coffre de granité posé contre le mur situé à l'est.",
  choix: [
    { texte: "Si vous souhaitez examiner ce coffre", vers: "45" },
    { texte: "Si vous préférez ne pas prêter attention à cette grotte et poursuivre votre chemin en montant l'escalier", vers: "323" }
  ]
  },
  {
  id: "247",
  texte: "Le vieil homme relève lentement la tête. 11 a les yeux fatigués et meurtris, et sa longue barbe grise est tachée de sang caillé. Avec difficulté, il se remet sur pied et scrute l'obscurité au-dessus de lui. « Qui se cache là-haut ? Est-ce toi, Vonotar ? Montre-toi, misérable ver de terre ou alors, va-t-en. Je n'ai pas peur de toi et sache que tu m'inspires le plus profond dégoût. Jamais tu ne parviendras à me briser, traître infâme ! » crie-t-il en brandissant un poing décharné. Son accent vous est familier : c'est en effet le même que le vôtre. Cet homme est l'un de vos compatriotes, un citoyen du Sommerlund originaire du port de Toran.",
  choix: [
    { texte: "Si vous disposez d'une Corde, vous pouvez la dérouler et la jeter au vieil homme afin de le tirer de sa prison", vers: "118" },
    { texte: "Si vous n'avez pas de Corde, ou si vous ne souhaitez pas porter secours au prisonnier, vous pouvez poursuivre votre chemin le long du passage", vers: "30" }
  ]
  },
  {
  id: "248",
  texte: "Vous êtes arrivé à une centaine de mètres du défilé lorsqu'un vertige vous saisit et vous fait perdre l'équilibre. Vous essayez désespérément de vous accrocher à la paroi rocheuse, mais vous avez les mains engourdies par le froid et vous tombez dans la vallée. Votre corps, parfaitement conservé dans la glace, sera découvert par une équipe d'explorateurs dans environ deux mille ans, à quelques années près. Il va sans dire que votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §248"
  },
  {
  id: "249",
  texte: "Vous sentez qu'une patrouille de soldats s'approche, venant du sud.",
  choix: [
    { texte: "Vous empruntez donc le couloir orienté au nord", vers: "104" }
  ]
  },
  {
  id: "250",
  texte: "La fiole se fracasse entre vos mains et le liquide noir se répand sur la table de pierre. Maudissant votre malchance, vous reniflez prudemment quelques gouttes de la potion qui sont restées dans un fragment de verre incurvé. Sinon, l'odeur âcre de ce liquide ne vous inspire guère confiance et vous vous débarrassez de la fiole brisée. Revenez ensuite au 10 pour faire un nouveau choix.",
  choix: [
    { texte: "Si vous avez déjà eu l'occasion de traverser le Cimetière des Anciens", vers: "77" }
  ]
  },
  {
  id: "251",
  texte: "Dans l'après-midi, votre voyage en direction du glacier devient peu à peu de plus en plus pénible. Les vaisseaux sanguins de vos yeux se mettent à enfler et bientôt vous avez l'impression qu'on vous pique les globes oculaires à l'aide d'aiguilles chauffées au rouge ou que vos paupières sont couvertes de sable sur leur face intérieure. Fenor est le premier à s'apercevoir de ce qui vous arrive et il fait arrêter les traîneaux. « Cécité des neiges dit-il en déchirant un vieux chiffon pour en faire un bandeau. Si vous continuez ainsi, la douleur vous aura rendu fou avant que le soleil ne soit couché. » Vous perdez 2 points d'ENDURANCE. Fenor bande vos yeux irrités et vous installe à l'arrière du traîneau. Vous êtes à présent allongé à côté du chargement tandis que l'expédition repart.",
  choix: [
    { texte: "A la nuit tombée, vous atteignez enfin le glacier de Viad", vers: "62" }
  ]
  },
  {
  id: "252",
  texte: "« Ton heure est venue ! » crie une voix, mais c'est celle de LoiKymar et non celle de Vonotar. Une touffe d'herbes jetée dans les airs vient frapper le mage félon en pleine poitrine. Un instant plus tard, l'infâme traître bossu se trouve empêtré dans un enchevêtrement de plantes qui l'emprisonnent de la tête aux pieds. Loi-Kymar parvient à son tour à franchir le fossé et vous rejoint sur la plate-forme. « Prenez soin de lui ôter ses bagues et ses amulettes, recommande-t-il tout en cherchant sa Crosse de la Guilde, car c'est un maître en matière de fourberie, et ce serait dommage qu'il manque la petite fête de bienvenue que le Sommerlund lui réserve pour son retour. Le sang-froid du vieil homme vous émerveille : ce terrible affrontement, en effet, ne lui a pas fait perdre son calme. « Ah ! la voici ! » annonce-t-il d'un ton triomphal en trouvant sous le Trône du Brumalmarc sa Crosse de la Guilde. Vous lui montrez alors votre carte de Kalte en lui indiquant l'endroit où est ancré le Cardonal. « Je n'ai pas besoin de cela, répond-il avec une nuance de mépris, les cartes sont toujours fausses et je préfère m'en remettre à mon propre sens de l'orientation. » Le vieux magicien lève alors sa Crosse et un rayon aveuglant jaillit aussitôt de son extrémité.",
  choix: [
    { texte: "Il décrit ensuite trois larges cercles dans les airs et la salle du Trône du Brumalmarc se transforme instantanément en un kaléidoscope aux multiples couleurs", vers: "350" }
  ]
  },
  {
  id: "253",
  texte: "Le Languabarb vous heurte avec tant de force que vous êtes violemment projeté en arrière, sur la mince couche de glace qui recouvre le lac. Assommé pour le compte, vous ne sentez même pas que des dents pointues s'enfoncent dans votre chair. Qui vous a dévoré 1 Le Languabarb, ou la créature du lac dont vous aviez aperçu la silhouette 1 Vous ne le saurez jamais. La seule chose certaine, c'est que votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §253"
  },
  {
  id: "254",
  texte: "Vous découvrez une autre porte de pierre dans le mur ouest du couloir. A travers un judas aménagé en son centre, vous apercevez, de l'autre côté, une cellule. Un vieil homme est recroquevillé dans un coin de la prison, les cheveux et le visage souillés de sang et de crasse. Sa toge bleue est si sale qu'on ne voit presque plus les croissants de lune et les étoiles dont l'étoffe est brodée.",
  choix: [
    { texte: "Si vous souhaitez ouvrir la porte de cette cellule", vers: "56" },
    { texte: "Si vous préférez ne pas prêter attention au vieil homme et poursuivre votre chemin le long du couloir", vers: "276" }
  ]
  },
  {
  id: "255",
  texte: "La mise en pratique de la Discipline Kaï de l'Orientation vous permet de savoir que le tunnel de gauche est orienté au nord tandis que celui de droite mène vers l'est. Or, Ikaya se trouve à environ 80 kilomètres en direction du nord.",
  choix: [
    { texte: "Si vous souhaitez prendre le tunnel de gauche", vers: "125" },
    { texte: "Si vous préférez emprunter celui de droite", vers: "184" }
  ]
  },
  {
  id: "256",
  texte: "La porte claque dans votre dos, vous interdisant désormais de revenir dans le couloir. Peu à peu, vous sentez le sol vibrer, mais cette trépidation n'est que de courte durée : dès qu'elle a cessé, vous entendez un faible déclic et vous voyez aussitôt une fissure apparaître sur le monolithe noir. La fissure est visible tout autour du bloc de pierre et elle s'élargit de plus en plus.",
  choix: [
    { texte: "Si vous souhaitez vous préparer au combat", vers: "217" },
    { texte: "Si vous préférez vous abriter dans un coin en vous couvrant de votre cape", vers: "7" }
  ]
  },
  {
  id: "257",
  texte: "Un frisson vous parcourt l'échiné tandis que les cris de Dyce s'évanouissent à mesure qu'il tombe dans la gorge. Vous scrutez encore l'obscurité du gouffre lorsqu'Irian s'écrie soudain: « Là !... là-bas ! Je suis sûr que j'ai vu quelque chose. » Vous vous tournez vers lui pour constater qu'il pointe l'index non pas vers le fond de la gorge, mais en direction de l'ouest. « Regardez ! Là-bas ! » dit à son tour Fenor qui montre une lointaine hauteur. Vous apercevez alors deux guerriers vêtus de fourrure, debout au sommet d'un gros bloc de glace. Ils regardent dans votre direction, alertés sans nul doute par les hurlements de Dyce. « Ce sont des Barbares des Glaces, murmure Irian, la voix tremblante de peur. S'ils atteignent Ikaya avant nous, ils avertiront les autres de notre présence et nous pourrons alors nous considérer comme morts. » Il reste encore 25 kilomètres à parcourir pour atteindre la Forteresse de Glace et, dans trois heures, la nuit sera tombée.",
  choix: [
    { texte: "Si vous souhaitez poursuivre votre chemin vers Ikaya en espérant arriver là-bas avant les Barbares", vers: "327" },
    { texte: "Si vous préférez les attaquer pour les empêcher de donner l'alerte", vers: "307" }
  ]
  },
  {
  id: "258",
  texte: "La sueur perle à votre front tandis que vous vous concentrez pour essayer de vous protéger contre cette attaque psychique. Votre agresseur, quel qu'il soit, est un adversaire redoutable et vous êtes conscient qu'il va falloir vous débarrasser du Bracelet si vous voulez survivre à l'épreuve de ce combat mental. Mais, pour pouvoir ôter le Bracelet d'Or de votre poignet, vous allez devoir pendant un instant relâcher votre concentration. Votre Bouclier Psychique, dès lors, ne vous protégera plus. Utilisez la Table de Hasard pour obtenir un chiffre (en considérant exceptionnellement que 0 = 10). Si vous maîtrisez la Discipline Kaï de la Chasse ou celle du Sixième Sens, vous aurez le droit d’oter 2 au chiffre que la Table vous aura donné. Le total obtenu vous indiquera le nombre de points d'ENDURANCE que vous aurez perdu avant d'avoir réussi à vous débarrasser du Bracelet maudit.",
  choix: [
    { texte: "Si vous êtes toujours vivant, mettez votre Feuille d'Aventure à jour et", vers: "63" }
  ]
  },
  {
  id: "259",
  texte: "Soudain, Fenor se relève d'un bond et saisit son épée. « C'est un Languabarb ! s'écrie-t-il. Vite ! prenez vos armes ou nous sommes perdus. » Les autres se hâtent d'empoigner leurs armes tandis que Fenor disparaît au-dehors. Presque immédiatement, un hurlement de douleur retentit et quelque chose se trouve violemment projeté contre la toile de la tente qui s'écroule aussitôt sous le choc. Vous vous retrouvez alors couché côte à côte avec le cadavre mutilé de Fenor. Saisi de panique, vous vous dépêtrez de la toile de tente et vous tirez votre arme. A ce moment, un énorme monstre quadrupède vous saute dessus. Ses yeux rouges brillent comme deux charbons ardents et sa gueule ouverte, hérissée de dents pointues, laisse apparaître une langue couverte d'un poil rêche. La bête est sur vous et il vous faut la combattre.",
  choix: [
    { texte: "LANGUABARB HABILETÉ: 11 ENDURANCE: 35 Si vous perdez des points d'ENDURANCE au cours de ce combat", vers: "129" },
    { texte: "Si vous parvenez à tuer la créature sans perdre un seul point d'ENDURANCE", vers: "151" }
  ],
  combat: { nom: "Languabarb", habilete: 11, endurance: 35 }
  },
  {
  id: "260",
  texte: "La surprise de votre attaque vous permet de frapper par deux fois le Barbare des Glaces avant qu'il ait eu le temps de réagir. Vous ne perdrez donc aucun point d'ENDURANCE au cours des deux premiers Assauts de ce combat, quelles que soient les indications qui vous seront données par la Table des Coups Portés. Le Barbare, en revanche, perdra les points d'ENDURANCE indiqués par cette même Table. Si, lors du troisième Assaut, votre adversaire est toujours vivant, il dégainera une épée en os et vous attaquera à son tour. Le combat se déroulera alors à la manière habituelle. Ce Barbare, notez-le, est invulnérable à la Discipline Kaï de la Puissance Psychique.",
  suite: "210",
  combat: { nom: "Barbare des Glaces", habilete: 17, endurance: 29 }
  },
  {
  id: "261",
  texte: "Lorsque vous arrivez au bas des marches, vous trébuchez et vous tombez en vous écorchant le genou. Étalé de toul votre long sur le sol de pierre, vous remarquez alors une ouverture dans le mur de gauche : il s'agit d'une porto habilement dissimulée parmi les sculptures contournées qui ornent la paroi.",
  choix: [
    { texte: "En y regardant de plus près, vous découvrez un petit levier que vous tirez aussitôt", vers: "290" }
  ]
  },
  {
  id: "262",
  texte: "L'enfant vous donne des coups de pied et vous mord libres en se débattant comme un animal sauvage. Utilisez la Table de Hasard pour obtenir un chiffre qui vous indiquera si vous allez parvenir à le maîtriser.",
  choix: [
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "71", requis: {"discipline":"sixieme-sens"} }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "320", texte: "SI vous tirez un chiffre entre 0 et 6," },
        "7-9": { vers: "140", texte: "Si vous tirez le 7, le 8 ou le 9," }
      }
      }
  },
  {
  id: "263",
  texte: "Le passage étant étroit, il vous faut combattre I Languabarbs un par un. Leurs langues venimeus. pointées sur vous, ils s'apprêtent à vous piquer. HABILETÉ ENDURANCE Premier LANGUABARB 11 35 Deuxième LANGUABARB 10 32 Troisième LANGUABARB 8 30",
  suite: "263-b",
  choix: [
    { texte: "Si vous avez perdu des points d'ENDURANCE (même en fuyant)", vers: "66" },
    { texte: "Si vous avez remporté le combat sans perdre d'ENDURANCE", vers: "25" },
    { texte: "Prendre la fuite", vers: "277" }
  ],
  combat: { nom: "Languabarb", habilete: 11, endurance: 35 }
  },
  {
  id: "264",
  texte: "Vous entrez dans une grande salle mal éclairée où règne un froid glacial : c'est un temple secret construit là par les Anciens. Le sol est recouvert de dalles de quartz et de granité; des pierres et des morceaux de glace sont répandus çà et là. Délimitée par deux rangées de hauts piliers, une allée mène à un autel sacrificatoire aménagé dans une alcôve du mur situé au nord. Sur cet autel repose une étrange statue qui semble avoir été sculptée clans de la pierre blanche et lisse. A la tête et aux pieds de la statue, se dressent des piliers noirs encastrés dans la pierre de l'autel. A la gauche de la statue, un escalier monte vers une arcade plongée dans l'ombre.",
  choix: [
    { texte: "Si vous souhaitez traverser le temple en direction de l'escalier", vers: "60" },
    { texte: "Si vous voulez traverser le temple en ne marchant que sur les dalles de quartz", vers: "168" },
    { texte: "Si vous préférez traverser le temple en ne marchani que sur les dalles de granité", vers: "244" }
  ]
  },
  {
  id: "265",
  texte: "Cette étrange créature est un Serpent de Cristal, un nécrophage se nourrissant des restes d'animaux qui ont eu l'imprudence d'entrer dans sa caverne. Sa peau tri s dure est presque transparente et l'on voit ses organe» palpiter à l'intérieur de son corps. Le monstre ouvre sa gueule de cristal, laissant apparaître deux rangées île dents acérées. Le dos plaqué contre la porte de pieric, vous n'avez aucune possibilité de fuite et il vous faut combattre la créature jusqu'à la mort. Le Serpent ilo Cristal est invulnérable à la Discipline Kaï de l.i Puissance Psychique.",
  suite: "3",
  combat: { nom: "Serpent de Cristal", habilete: 15, endurance: 30 }
  },
  {
  id: "266",
  texte: "Vous essayez désespérément de vous libérer le pied, m,m le traîneau bascule déjà dans le vide.",
  choix: [
    { texte: "Dans un dcrnln effort, vous parvenez enfin à vous dégager, mais il eil trop tard et vous tombez dans la crevasse en entendant les cris horrifiés de vos guides", vers: "21" }
  ]
  },
  {
  id: "267",
  texte: "Loi-Kymar montre soudain la poche dans laquelle vous avez rangé la Pierre Rayonnante. « Pourquoi donc conservez-vous une pierre maudite, Seigneur Kaï ? Ignorez-vous les dangers qu'elle présente ?» Vous retirez aussitôt la Pierre de votre poche et vous la montrez au magicien. « Argh ! s'écrie-t-il comme si le simple fait de la regarder lui causait une intense douleur. Jetez-la au plus vite, avant que nous ne succombions au terrible mal. C'est une pierre maudite des Anciens, elle ne peut apporter que maladie et mort à quiconque d'entre les mortels convoite sa beauté. » A contrecœur, vous obéissez à Loi-Kymar et vous vous débarrassez de la Pierre.",
  choix: [
    { texte: "Rayez-la de votre Feuille d'Aventure", vers: "44" }
  ]
  },
  {
  id: "268",
  texte: "Vous parvenez à briser la cire sans casser la fiole. Il ne vous reste plus qu'à déboucher celle-ci: le liquide noir dégage alors une odeur forte et âcre. Cette odeur en effet vous donne la nausée et vous ne souhaitez pas conserver ce liquide douteux. Retourne,-au 10 et faites un nouveau choix.",
  choix: [
    { texte: "Si vous êtes déjà allé dans le Cimetière des Anciens, Sinon, vous vous hâtez de reboucher la fiole", vers: "177" }
  ]
  },
  {
  id: "269",
  texte: "Vous découvrez un tunnel, de l'autre côté du gouffre, et vous le suivez sur des kilomètres. Vous arrivez en! m dans une immense caverne dont la voûte s'élève à 150 mètres au-dessus de votre tête. Un vent glacial, s'infiltrant à travers les nombreuses fissures de cette voûte, souffle dans la caverne.",
  choix: [
    { texte: "Si vous voulez essayer de grimper jusqu'à la voûte pour tenter de vous glissez par l'une de ces fissures et sortir ainsi à l'air libre", vers: "335" },
    { texte: "Si vous préférez poursuivre votre chemin en essayant de trouver un autre tunnel au fond de la caverne", vers: "182" }
  ]
  }
];
