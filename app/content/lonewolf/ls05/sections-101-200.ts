import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 04 — Le Tyran du Désert
 * Paragraphes 101 à 200. Fichier GÉNÉRÉ par
 * scripts/ls05-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls05-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_101_200: StorySection[] = [
  {
  id: "101",
  texte: "L'homme pousse un cri puis s'effondre sur le sol en gémissant avant d'exhaler son dernier souffle. Pendant ce temps, l'autre Garde s'est enfui précipitamment en oubliant son arme. Vous vous lancez aussitôt à sa poursuite, vous arrêtant seulement pour ramasser le trident. Vous devez absolument l'arrêter avant qu'il ne prévienne les autres sentinelles. Vous levez le trident audessus de votre tête puis vous le lancez dans sa direction. L'arme l'atteint en plein milieu du dos, le projetant en avant. Il meurt avant même d'avoir touché le sol. En fouillant les cadavres vous découvrez les objets suivants : 4 Pièces d'Or, 1 Poignard, 1 Epée et 1 Potion d'Alether (qui augmente de deux points votre total d'HABILETÉ pour la durée d'un combat). Vous pouvez également prendre la Sarbacane et les Fléchettes de Sommeil qui n'ont pas été utilisées. Si vous désirez prendre l'un ou l'autre de ces objets, n'oubliez pas de le noter sur votre Feuille d'Aventure dans la case Sac à Dos. Dans les vêtements de l'homme à la Sarbacane, vous trouvez un petit morceau de parchemin sur lequel sont inscrits la date du jour et le chiffre 67. Un sourire illumine votre visage lorsque vous comprenez qu'il s'agit du chiffre qui vous permettra d'ouvrir la porte de bronze.",
  choix: [
    { texte: "Vous retenez votre respiration puis vous composez le numéro", vers: "67" }
  ]
  },
  {
  id: "102",
  texte: "Après une fouille minutieuse des corps, vous trouvez les objets suivants : 1 Epée, 1 Poignard, 1 Marteau de Guerre, 6 Pièces d'Or et les Clés du Geôlier (Objet Spécial). Vous pouvez prendre les objets que vous voulez, mais n'oubliez pas de les noter sur votre Feuille d'Aventure. Si vous prenez les Clés du Geôlier, portez-les accrochées à votre ceinture.",
  choix: [
    { texte: "Après avoir verrouillé la porte de la cellule, vous vous hâtez le long du couloir", vers: "150" }
  ]
  },
  {
  id: "103",
  texte: "Vos muscles commencent à se détendre. L'huile soulage vos douleurs et, bientôt, vous ne sentez plus les contusions et les coupures qui recouvrent votre corps. Vous regagnez 2 points d'ENDURANCE.",
  choix: [
    { texte: "Notez votre nouveau total sur votre Feuille d'Aventure, puis", vers: "71" }
  ]
  },
  {
  id: "104",
  texte: "« Prenez-le ! hurle Maouk, mais prenez-le vivant ! » Vous courez vers la galère le plus rapidement possible. Les membres de l'équipage, qui n'étaient pas présents lors du meurtre de l'envoyé, ignorent que vous êtes dans une situation désespérée et ne savent pas que vous courez de graves dangers. Avant même que vous ne puissiez les appeler à l'aide, un cavalier se met en travers de votre chemin, vous interdisant l'accès du bateau.",
  choix: [
    { texte: "Si vous souhaitez attaquer le cavalier", vers: "20" },
    { texte: "Si vous préférez prendre la fuite en plongeant dans la mer", vers: "142" },
    { texte: "Enfin, si vous préférez", vers: "176" }
  ]
  },
  {
  id: "105",
  texte: "Parmi les nombreuses sculptures situées dans les niches du mur orienté au sud, votre attention est attirée par un buste en marbre. En l'examinant de plus près, vous apercevez une charnière à la base du cou. Vous faites basculer la tête en arrière et vous notez la présence d'un petit levier.",
  choix: [
    { texte: "Si vous souhaitez tirer le levier", vers: "171" },
    { texte: "Si vous préférez remettre la tête en place et continuer à longer la galerie", vers: "158" }
  ]
  },
  {
  id: "106",
  texte: "Vous vous laissez tomber lourdement sur le cavalier puis vous l'entraînez au sol, mais votre réception est maladroite et vous devez le relâcher. Le Messager est le premier à se remettre sur pieds ; il dégaine son épée et attaque avant même que vous n'ayez eu le temps de vous relever. MESSAGER HABILETÉ: 16 ENDURANCE: 23 Ôtez 2 points à votre total d'HABILETÉ pour les 3 premiers Assauts car vous êtes toujours au sol. Vous n'avez aucune possibilité de fuite et vous devez combattre le Messager jusqu'à la mort.",
  suite: "189",
  combat: { nom: "Messager", habilete: 16, endurance: 23 }
  },
  {
  id: "107",
  texte: "Vous concentrez votre pouvoir de guérison pour soigner vos poumons atteints. Graduellement, la douleur que vous ressentez à la poitrine disparaît et vous sentez qu'une douce chaleur bienfaisante se répand dans vos membres. Votre Discipline Kaï a guéri la blessure, mais vous êtes toujours très affaibli par la perte de sang.",
  choix: [
    { texte: "Si vous souhaitez fouiller le corps des Gardes", vers: "102" },
    { texte: "Si vous préférez laisser les corps et vous enfuir par le couloir", vers: "150" }
  ]
  },
  {
  id: "108",
  texte: "Quelques mètres plus loin dans le tunnel, d'autres canalisations déversent leurs eaux verdâtres en cascades vers le collecteur principal. Les vapeurs qui s'en dégagent sont âcres, suffocantes, et vous irritent les poumons et la gorge. Vous parvenez néanmoins à franchir les cascades mais les gaz corrosifs vous font perdre 2 points d'ENDURANCE.",
  choix: [
    { texte: "Apportez les modifications nécessaires à votre Feuille d'Aventure puis", vers: "112" }
  ]
  },
  {
  id: "109",
  texte: "Vous sautez dans la rue en contrebas, puis vous traversez en courant la place du Marché vers le bâtiment à l'intérieur duquel sont regroupés des centaines d'habitants en prières. Vous apercevez une avenue à votre droite qui se termine par un porche voûté sous lequel ne peut s'engager qu'un seul cheval. A votre gauche, une autre allée descend vers le port.",
  choix: [
    { texte: "Si vous souhaitez entrer dans le bâtiment", vers: "32" },
    { texte: "Si vous voulez tourner à droite et atteindre le porche", vers: "169" },
    { texte: "Si vous décidez de retourner au port", vers: "129" }
  ]
  },
  {
  id: "110",
  texte: "Un reptile gigantesque s'est accroché au plafond à l'aide de ses longues griffes recourbées. Ses énormes yeux ovales roulent en tous sens à la vue de chair fraîche, votre propre chair ! Il prépare son attaque et vous n'avez pas la possibilité de fuir. Menez le combat : KWARAZ HABILETÉ: 19 ENDURANCE: 30 Cet immense reptile est très sensible au pouvoir psychique, si vous maîtrisez la Discipline Kaï de la Puissance Psychique ; ajoutez 4 points d'HABILETÉ au lieu des 2 points habituels.",
  suite: "40",
  combat: { nom: "Kwaraz", habilete: 19, endurance: 30 }
  },
  {
  id: "111",
  texte: "La chaleur et la fatigue du combat vous ont sensiblement affaibli mais vous venez de vaincre un ennemi si redoutable qu'une ardeur nouvelle vous remplit le cœur. Vous fouillez le corps de l'Armurier et vous trouvez 3 Pièces d'Or et une Clé de Cuivre. Si vous souhaitez garder la Clé, notez-la sur votre feuille d'Aventure dans la case des Objets Spéciaux.",
  choix: [
    { texte: "Si vous souhaitez quitter la forge par la porte nord", vers: "167" },
    { texte: "Si vous préférez quitter les lieux par la porte ouest", vers: "44" },
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "74", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "112",
  texte: "Vous arrivez bientôt dans une section du tunnel où le plafond est beaucoup plus haut. A gauche, le long du mur, se trouve une espèce de trottoir en pierre d'où partent, à intervalles réguliers, des escaliers. Vous vous hissez sur le trottoir et vous commencez à enlever la vase qui recouvre vos jambes.",
  choix: [
    { texte: "Si vous désirez continuer à avancer en suivant le trottoir", vers: "64" },
    { texte: "Si vous préférez grimper les marches d'un des escaliers à votre gauche", vers: "116" },
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "133", requis: {"discipline":"communication-animale"} }
  ]
  },
  {
  id: "113",
  texte: "Avec votre teint clair, votre manteau Kaï et votre tunique, vous ne passez pas inaperçu au milieu de la foule et vous devez trouver un endroit pour vous dissimuler. La ruelle se termine par une place bordée d'arbres. A votre gauche, vous apercevez une petite demeure dont la curieuse enseigne de bois, accrochée au-dessus de la porte, évoque la forme d'un poisson. A votre droite, se trouve une taverne dont le nom inscrit sur l'enseigne semble étrangement approprié: LE SEIGNEUR POURCHASSÉ.",
  choix: [
    { texte: "Si vous souhaitez pénétrer dans la petite maison", vers: "157" },
    { texte: "Si vous préférez entrer dans la taverne", vers: "188" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de la Guérison", vers: "53", requis: {"discipline":"guerison"} }
  ]
  },
  {
  id: "114",
  texte: "Le conduit de la cheminée s'incline de plus en plus pour devenir totalement horizontal et, il mène désormais vers le sud. Bien que la chaleur soit accablante, la vapeur s'est dissipée. Votre corps est devenu extrêmement sensible et vous progressez avec beaucoup de difficultés le long du boyau. Tout espoir concernant la signature du traité de paix avec le nouveau Zakhan s'est évanoui. Il ne vous reste plus maintenant qu'à essayer de sortir de cet égout d'enfer et trouver un moyen quelconque afin de retourner au Sommerlund le plus vite possible. Mais soudain vous apercevez, à quelques mètres, une grille d'aération de forme carrée. La plaque est très rouillée et vous devez vous allonger sur le dos et la soulever avec vos deux pieds pour la déplacer. Cet effort violent épuise vos dernières forces mais vous parvenez à vos fins. De plus, par un hasard extraordinaire, vous vous retrouvez dans le bâtiment de Barrakeesh que vous aviez le plus besoin de visiter: les Bains Publics.",
  choix: [
    { texte: "Un séjour dans cet établissement s'avère en effet indispensable !", vers: "90" }
  ]
  },
  {
  id: "115",
  texte: "L'oreille collée au trou de la serrure, vous entendez d'horribles bruits : des cris d'agonie mêlés à des rires hystériques et des sanglots à fendre le cœur. Le claquement sec d'un fouet et les grincements d'un chevalet vous confirment bien qu'il y a une salle de tortures derrière cette porte.",
  choix: [
    { texte: "Ces bruits effrayants vous font tressaillir et vous prenez la fuite le plus rapidement possible par le couloir nord", vers: "132" }
  ]
  },
  {
  id: "116",
  texte: "Vous gravissez l'escalier en pierre et vous arrivez à une petite pièce au-dessus du tunnel. L'air y est sec, même si les gaz pestilentiels de l'égout pénètrent les moindres recoins du souterrain. Vous suivez un étroit passage qui s'enfonce vers l'ouest puis tourne brusquement sur la gauche vers le sud. Votre cœur défaille lorsque vous réalisez que le boyau est sans issue !",
  choix: [
    { texte: "Si vous désirez examiner les lieux afin de trouver une sortie dérobée", vers: "33" },
    { texte: "Si vous préfère retourner sur vos pas et rejoindre le trottoir", vers: "64" }
  ]
  },
  {
  id: "117",
  texte: "L'allée tortueuse aboutit dans un petit jardin, bordé sur trois côtés par des maisons aux toits en forme de coupole. Toutes ces demeures possèdent des portes et des fenêtres ornées de grilles en fer forgé ainsi que de grands balcons au premier étage. Vous grimpez à un solide treillis en bois qui monte jusqu'à un de ces balcons mais, au moment où vous allez enjamber la balustrade, les hommes de Maouk font irruption sur la place. De nombreux soldats sont armés de lourdes arbalètes en bronze. « Rendez-vous, Loup Solitaire, crie Maouk, ou mes hommes vont vous clouer au mur ! » La situation est désespérée car, à cette distance, les Sharnazims ne peuvent pas vous manquer. Maudissant votre infortune, vous vous laissez tomber par terre, aux pieds de Maouk.",
  choix: [
    { texte: "« Vous êtes courageux, Seigneur Kaï, dit-il férocement, mais votre bravoure ne saurait vous sauver maintenant ! »", vers: "176" }
  ]
  },
  {
  id: "118",
  texte: "Le Garde porte la sarbacane à ses lèvres. Ses joues se gonflent et un sifflement aigu vous avertit qu'une autre fléchette empoisonnée se dirige rapidement vers votre tête. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous avez atteint le rang de Guerrier Kaï (ou un rang plus élevé), ajoutez 1 au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "89", texte: "Si votre total est compris entre 0 et 3," },
        "4-12": { vers: "21", texte: "S'il est compris entre 4 et 12," }
      }
      }
  },
  {
  id: "119",
  texte: "Les deux Gardes sont totalement pris au dépourvu par votre attaque. La férocité et l'effet de surprise de celle-ci vous permettent de ne pas déduire les points d'ENDURANCE que vous pourriez perdre pendant les 3 premiers Assauts. Combattez les deux Gardes comme s'il s'agissait d'un seul et même ennemi.",
  suite: "137",
  combat: { nom: "Gardes du palais", habilete: 16, endurance: 30 }
  },
  {
  id: "120",
  texte: "Le poignard fend l'air en sifflant et vient se planter au milieu de votre poitrine. Le souffle coupé par la douleur fulgurante, vous tentez de retirer la lame de votre chair mais, dans votre hâte, vos mains se mettent à trembler. Tandis que vous trébuchez en arrière, le Garde se précipite vers vous, son visage hideux parcouru par un sourire de triomphe.",
  choix: [
    { texte: "Finalement, vous parvenez à retirer la lame et vous levez le poignard au-dessus de votre tête en le pointant vers le Garde ; celui-ci voit le danger et plonge sur vous, mais il est déjà trop tard: la lame lui a transpercé le cœur", vers: "22" }
  ]
  },
  {
  id: "121",
  texte: "Trois Sharnazims surgissent des ténèbres. Le fil tranchant de leurs épées brille dans l'obscurité : des lames assoiffées de sang, votre sang !",
  choix: [
    { texte: "Si vous désirez attaquer les guerriers", vers: "60" },
    { texte: "Si vous préférez les fuir, vous devez faire demi-tour et traverser l'égout à la nage", vers: "84" }
  ]
  },
  {
  id: "122",
  texte: "La lourde porte de bois est renforcée par des barres de fer maintenues par d'énormes clous de bronze. Vous tournez la poignée, mais la porte est fermée à clé.",
  choix: [
    { texte: "Si vous possédez les Clés du Geôlier", vers: "136" },
    { texte: "Si vous n'avez pas cet Objet Spécial", vers: "26" }
  ]
  },
  {
  id: "123",
  texte: "Le bruit s'amplifie. Soudain, le loquet de la porte grince et une voix bourrue s'élève au-dessus du vacarme : « Enfoncez la porte ! » Une hache à double tranchant transperce les planches, des morceaux de bois et des barres de fer tordues sont violemment projetés dans la cave. Finalement, la porte sort de ses gonds et vos poursuivants font irruption dans la pièce en se bousculant, gênés par l'enchevêtrement des planches brisées qui jonchent le sol. Aussitôt, vous vous jetez en avant dans la mêlée en donnant des coups à gauche et à droite. Vous étendez à terre deux hommes avant même qu'ils ne vous aient aperçu. L'Officier, un grand guerrier au cou de taureau et au nez écrasé, se fraie un chemin à coups de coude parmi les hommes, puis il passe à l'attaque. Vous frappez le premier et, d'un coup bien placé à son poignet, vous le dépossédez de son cimeterre. Mais il passe de nouveau à l'attaque. Il tient maintenant dans sa main valide un grand poignard et il se jette sur vous en soufflant comme un bœuf. OFFICIER SHARNAZIM HABILETÉ: 18 ENDURANCE: 28 Vous pouvez prendre la fuite à tout moment en vous échappant par la trappe.",
  choix: [
    { texte: "Dans ce cas", vers: "51" },
    { texte: "Si vous remportez le combat", vers: "198" }
  ],
  combat: { nom: "Officier sharnazim", habilete: 18, endurance: 28 }
  },
  {
  id: "124",
  texte: "Vous sautez du rebord de la fenêtre et vous tombez violemment, les pieds en avant, sur les Gardes qui vont rouler au sol sans comprendre ce qui leur arrive. Avant qu'ils se relèvent, vous passez rapidement à l'attaque et vous en tuez trois. Mais les bruits de la bataille parviennent jusqu'à la cantine une douzaine de soldats du Zakhan accourent à la rescousse et vous succombez rapidement sous le nombre. C'est uniquement par respect pour votre courage que vos adversaires vous laissent la vie sauve.",
  choix: [
    { texte: "Ils vous désarment, puis vous conduisent de force dans un cachot où l'on vous laisse jusqu'à ce que le Zakhan veuille bien vous recevoir", vers: "18" }
  ]
  },
  {
  id: "125",
  texte: "Le cheval parcourt quelques mètres puis trébuche sur le quai et tombe à la mer avec le cadavre de son cavalier. L'équipage a retiré la passerelle, vous obligeant ainsi à sauter pour franchir le vide qui vous sépare désormais du navire. Vous sautez un peu court et vous atterrissez sur la rangée d'avirons qui bordent les flancs de la galère. Le bois est mouillé et glissant, et vous devez faire de grands efforts pour pouvoir conserver votre équilibre. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, ajoutez 2 au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "50", texte: "Si votre total est compris entre 0 et 3," },
        "4-9": { vers: "191", texte: "S'il est de 4 ou plus," }
      }
      }
  },
  {
  id: "126",
  texte: "A la faveur de l'ombre prodiguée par la tombe, vous avancez vers la porte nord où devraient normalement se trouver une vingtaine de soldats montant la garde. Par bonheur, il n'y en a que deux. Soudain, le portail s'ouvre et un cavalier tend un parchemin à l'un des Gardes avant de franchir l'entrée au galop. Le Garde jette un coup d'œil au laissez-passer et oublie de refermer la porte.",
  choix: [
    { texte: "Si vous souhaitez soudoyer les Gardes", vers: "19" },
    { texte: "Si vous préférez les attaquer", vers: "119" },
    { texte: "Si vous maîtrisez les Disciplines Kaï du Camouflage et de la Chasse", vers: "170" }
  ]
  },
  {
  id: "127",
  texte: "Vous retournez sur vos pas jusqu'au croisement afin d'avoir suffisamment d'élan. Si vous heurtez la porte au bon endroit et à une vitesse suffisante, vous parviendrez peut-être à faire sauter le verrou. Utilisez la Table de Hasard pour savoir si l'opération réussit ou non. Ajoutez 10 au chiffre que vous avez obtenu. Si votre total est supérieur à votre total d'HABILETÉ, la serrure ne cédera pas et vous subirez à l'épaule une blessure qui vous coûtera 1 point d'ENDURANCE.",
  choix: [
    { texte: "Si votre total est égal ou inférieur à vos points d'HABILETÉ, le mur se fendille et la serrure cède", vers: "159" },
    { texte: "Vous devez alors prendre l'autre passage conduisant à l'escalier et", vers: "93" }
  ]
  },
  {
  id: "128",
  texte: "Soudain, le tunnel s'élargit et l'égout passe sous une pièce au plafond élevé en forme de voûte d'où jaillit une cascade qui vient grossir les eaux graisseuses de l'égout. A l'endroit où la cascade se déverse dans l'égout flotte une masse de restes de repas et de vieux morceaux de viande avariée qui dégagent une odeur nauséabonde. Vous vous apprêtez à pénétrer sous la voûte lorsque vous sentez que le sol de l'égout se dérobe sous vos pieds. Vous vous raidissez juste à temps afin d'éviter de sombrer dans les eaux profondes. Le tunnel continue au-delà de la voûte mais plusieurs mètres d'eau boueuse et putride vous en séparent encore. Les clapotements qui vous parviennent au loin vous rappellent que les Sharnazims vous suivent toujours.",
  choix: [
    { texte: "Si vous possédez une Corde, vous pouvez essayer de l'enrouler autour d'une barre en fer qui dépasse de la cascade, puis vous hisser hors de l'eau et vous lancer de l'autre côté de la voûte", vers: "29" },
    { texte: "Si vous voulez essayer de rejoindre l'autre partie du tunnel en nageant", vers: "84" },
    { texte: "Si vous souhaitez plutôt faire demi-tour et retourner au croisement", vers: "121" }
  ]
  },
  {
  id: "129",
  texte: "Dissimulé dans l'ombre d'un porche, vous observez le port. La place est envahie par les soldats de Maouk et il serait vraiment trop dangereux de vous y risquer. Vous devez trouver un autre endroit pour vous cacher jusqu'à ce que les quais se vident. Des groupes de soldats fouillent les maisons qui bordent la place et vous êtes obligé de quitter votre abri et de remonter l'allée en courant. Au moment où vous arrivez à nouveau sur la place du Marché, vous tombez nez à nez avec une douzaine de guerriers Sharnazims conduits par Maouk en personne.",
  choix: [
    { texte: "Si vous souhaitez les combattre", vers: "36" },
    { texte: "Si vous préférez", vers: "176" }
  ]
  },
  {
  id: "130",
  texte: "Vous arrachez le Masque d'Herbes du visage du guerrier mort (inscrivez-le sur votre Feuille d'Aventure dans la case Objets Spéciaux) et vous placez ce petit masque à l'odeur agréable sur votre bouche. Les herbes filtrent l'air vicié, facilitant ainsi votre respiration. Vous gagnez 1 point d'ENDURANCE. Laissant le cadavre derrière vous, vous continuez votre progression lorsque vous entendez soudain d'autres Sharnazims patauger derrière vous dans le tunnel. Il vous est impossible de les distancer et vous devez vous cacher rapidement.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Camouflage", vers: "151", requis: {"discipline":"camouflage"} },
    { texte: "Si vous ne possédez pas cette Discipline", vers: "15" }
  ]
  },
  {
  id: "131",
  texte: "Vous examinez les nombreux objets disposés sur la grande table, faisant le tri entre ceux qui pourraient vous être utiles et les autres. Voici la liste des objets : un Peigne d'Argent, 1 Sablier, 1 Poignard, 1 Potion de Laumspur (qui vous redonnera 4 points d'ENDURANCE si vous en avalez une dose après un combat), 1 Prisme et suffisamment de provisions pour 3 Repas (chaque Repas équivaut à un objet que vous inscrirez dans la case Sac à Dos de votre Feuille d'Aventure).",
  choix: [
    { texte: "Faites les modifications nécessaires sur votre Feuille d'Aventure avant de quitter la pièce et", vers: "58" }
  ]
  },
  {
  id: "132",
  texte: "Vous avancez rapidement et sans difficulté dans la galerie nord et vous arrivez bientôt à un autre passage voûté qui va vers l'ouest. Vous apercevez une lueur qui brille au loin et vous entendez le bruit caractéristique du métal chauffé à blanc que l'on plonge dans l'eau et les coups violents d'un marteau sur une enclume. Il s'agit sans aucun doute d'une forge.",
  choix: [
    { texte: "Si vous souhaitez approcher de la forge", vers: "195" },
    { texte: "Si vous préférez continuer vers le nord", vers: "30" }
  ]
  },
  {
  id: "133",
  texte: "Vous reconnaissez les empreintes de Kwaraz dans la boue visqueuse du trottoir. Les Kwaraz sont de gigantesques reptiles carnivores et la taille très variée des empreintes signifie que le tunnel abrite sûrement toute une colonie de ces répugnantes créatures. Vous jugez qu'il serait bien trop dangereux de poursuivre dans cette direction, et vous préférez grimper les marches d'un escalier étroit qui mène à une pièce située audessus du tunnel. L'air au moins y est sec, bien que les gaz méphitiques se répandent partout. Vous suivez un étroit passage tout d'abord vers l'ouest, puis vers le sud mais votre cœur se serre lorsque vous distinguez dans l'obscurité un mur qui bouche le tunnel.",
  choix: [
    { texte: "Si vous désirez chercher une issue cachée", vers: "33" },
    { texte: "Si vous préférez faire demi-tour et redescendre vers le trottoir", vers: "64" }
  ]
  },
  {
  id: "134",
  texte: "Vous utilisez votre Discipline Kaï pour contraindre la créature à la fuite. La Sangsue géante change brusquement de direction puis se précipite sur un calmar qui a trouvé refuge dans une amphore en cuivre.",
  choix: [
    { texte: "Vous continuez à nager tout en surveillant la Sangsue qui vient de dévorer le pauvre calmar après l'avoir étouffé", vers: "95" }
  ]
  },
  {
  id: "135",
  texte: "L'air du nouveau tunnel est chaud et humide. Vous continuez votre progression mais les gaz délétères vous donnent de plus en plus la nausée et vous êtes bientôt obligé de vous arrêter. Les vapeurs vous brûlent la gorge et vous donnent des crampes d'estomac. Soudain, vous entendez derrière vous un bruit qui vous fait aussitôt oublier vos maux. Vous vous retournez et vous apercevez, surgissant de l'ombre, un des hommes de Maouk, le visage protégé par un Masque d'Herbes. GUERRIER SHARN AZIM HABILETÉ : 17 ENDURANCE : 22 Réduisez votre total d'HABILETÉ de 2 points à cause des fumées nocives.",
  choix: [
    { texte: "Si vous perdez ce combat", vers: "161" },
    { texte: "Si vous le gagnez", vers: "130" }
  ],
  combat: { nom: "Guerrier sharn azim", habilete: 17, endurance: 22 }
  },
  {
  id: "136",
  texte: "Une fois le verrou tiré, vous tournez la poignée, puis vous entrouvrez la porte de quelques centimètres. Vous apercevez un escalier qui descend vers une petite pièce où une sentinelle monte la garde devant une grille en fer. A travers les barreaux, vous voyez des rangées d'armes et des armures posées sur des râteliers. Une enseigne est fixée aux barreaux de la grille: ARMURERIE DU GRAND PALAIS.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Camouflage", vers: "186", requis: {"discipline":"camouflage"} },
    { texte: "Si vous voulez attaquer le Garde", vers: "178" },
    { texte: "Si vous préférez fermer la porte et suivre l'autre passage", vers: "93" }
  ]
  },
  {
  id: "137",
  texte: "Vous n'avez pas mangé depuis longtemps et vous devez prendre un Repas tout de suite ou perdre 3 points d'ENDURANCE. Vous vous faufilez sans être vu à travers les plantes exotiques qui poussent partout en abondance, puis vous suivez une allée de gravier qui passe à travers une étrange pelouse où pousse une herbe violette. Au bout de cette allée, se trouve une magnifique fontaine. Un jet d'eau d'un bleu clair accroche la lumière du soleil qui s'y réfracte et crée un arc-en-ciel aux couleurs éclatantes. Vous regardez, par-delà la fontaine, les tours du Palais s'élancer dans le ciel et vous notez de manière précise les positions des portes et fenêtres. Côté jardin, il y a deux entrées vers le Grand Palais. Vous avez la possibilité d'entrer soit par la porte des cuisines, soit par le Vizu-Diar: la galerie des Trophées du Zakhan. Mais cependant, une seule de ces entrées vous mènera à l'Herboristerie Impériale où se trouve la précieuse herbe d'Oede.",
  choix: [
    { texte: "Si vous voulez entrer dans le Palais par les cuisines", vers: "66" },
    { texte: "Si vous préférez passer par le Vizu-Diar", vers: "149" },
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation ou celle du Sixième Sens", vers: "37", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "138",
  texte: "Les Gardes ouvrent la porte et vous entrez aussitôt en action. Votre poing atteint le premier homme sous la mâchoire. La violence du coup le soulève du sol, et son épée tombe à vos pieds avec un cliquetis métallique.",
  choix: [
    { texte: "Si vous désirez ramasser l'épée", vers: "4" },
    { texte: "Si vous préférez vous battre avec vos seuls poings", vers: "91" }
  ]
  },
  {
  id: "139",
  texte: "Gêné par la véritable couverture d'insectes qui grouillent sur votre peau, vos ne voyez même pas le poteau en fer rouillé qui sort de l'eau. Mais lorsque vous perdez brusquement pied, vous essayez instinctivement de vous y agripper. Hélas !",
  choix: [
    { texte: "Comme tout ce qui se trouve dans ces égouts, il est recouvert d'une vase visqueuse aussi glissante que la glace de Kalte elle-même", vers: "94" }
  ]
  },
  {
  id: "140",
  texte: "Les grilles de fer de l'Armurerie ne sont pas verrouillées. Vous poussez le battant gauche et la porte tourne sur ses gonds avec un grincement aigu qui vous fait tressaillir. Vous pénétrez à l'intérieur ; au fond de la pièce se trouve un établi recouvert de toutes sortes de pièces d'armurerie : fers de lance, gardes d'épées... Au beau milieu de cet enchevêtrement, vous apercevez un grand livre noir relié en cuir.",
  choix: [
    { texte: "Si vous souhaitez ouvrir ce livre", vers: "83" },
    { texte: "Si vous préférez laisser le livre et partir à la recherche de l'équipement que l'on vous a confisqué", vers: "181" }
  ]
  },
  {
  id: "141",
  texte: "Vous faites un bond de côté, évitant de justesse la flèche qui passe en sifflant tout près de votre poitrine. « Emparez-vous de lui, hurle Maouk, et ne le laissez pas s'enfuir, cette fois ! » Vous êtes maintenant allongé sur le sol, à moins de 2 mètres de la trappe.",
  choix: [
    { texte: "Si vous désirez la soulever pour vous enfuir", vers: "51" },
    { texte: "Si vous préférez", vers: "10" }
  ]
  },
  {
  id: "142",
  texte: "Vous plongez, puis vous nagez sous l'eau jusqu'à ce que la pression dans vos poumons devienne insupportable et vous contraigne à refaire surface. Les Sharnazims courent dans toutes les directions, essayant de cerner le quai afin de prévenir toute tentative de fuite de votre part. Vous aspirez une grande bouffée d'air, puis vous plongez à nouveau et vous nagez immergé vers une flottille de petits bateaux situés à moins de 50 mètres. A travers l'eau bleue et limpide, vous voyez clairement les débris et autres détritus qui jonchent le lit du port. Ce sont les témoignages des nombreux navires marchands qui ont mouillé le long de ces quais par le passé. Tout à coup, vous apercevez, accrochée à une vieille ancre, une étrange masse gélatineuse d'où sort une multitude de petits tubes et dont la partie inférieure est prolongée par un rostre en forme d'hameçon. Sans que rien ne le laisse présager, la créature se précipite vers vous, propulsée par ses innombrables tubes respiratoires. Vous comprenez avec effroi qu'il s'agit d'une Sangsue géante affamée qui a besoin de votre sang !",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "134", requis: {"discipline":"communication-animale"} },
    { texte: "Si vous désirez vous battre avec la créature", vers: "12" },
    { texte: "Si vous préférez la fuir au plus vite", vers: "95" }
  ]
  },
  {
  id: "143",
  texte: "Vous allumez une torche enduite de goudron puis vous la jetez dans la bouche d'égout. L'explosion se produit aussitôt: un énorme grondement accompagne un éclair aveuglant et les immondices enflammés jaillissent des profondeurs du BagaDarooz. La foule affolée s'enfuit en hurlant dans la rue en essayant d'éviter les matières en flamme qui pleuvent sur leurs têtes. En effet, la torche a provoqué une réaction en chaîne dans le Baga-Darooz. Les gaz des égouts, très inflammables, ont pris brusquement feu, semant partout la panique et la confusion. Vous courez dans la rue semée d'immondices et vous suivez la foule jusqu'à une place où se tient un marché très animé, hors d'atteinte de la pollution créée par l'explosion. Votre regard est attiré par une enseigne suspendue au-dessus de la porte latérale d'un grand bâtiment. Vous pouvez y lire : BAINS PUBLICS DE BARRAKEESH.",
  choix: [
    { texte: "Vous poussez la porte et vous vous glissez à l'intérieur du bâtiment", vers: "90" }
  ]
  },
  {
  id: "144",
  texte: "Vous êtes tout à coup en proie à un sombre pressentiment. Votre maîtrise Kaï vous avertit qu'un sort affreux et inévitable vous attend si vous restez dans cette cellule.",
  choix: [
    { texte: "N'écoutant que votre instinct, vous passez à l'attaque", vers: "174" }
  ]
  },
  {
  id: "145",
  texte: "Vous avancez en pataugeant dans une eau épaissie par une mousse sale et vous essayez de ne pas respirer par le nez. La fange visqueuse est remplie d'immondices verdâtres et noirs et, à chaque pas que vous faites, vous remuez toute cette boue qui laisse échapper des gaz délétères. Vous placez votre manteau Kaï sur la bouche mais, malgré cela, la puanteur épouvantable vous suffoque et vous donne des haut-de-cœur. Un fort éclaboussement vous avertit que les hommes de Maouk ne sont plus très loin et vous pressez le pas. A intervalles réguliers, des canalisations déversent leurs eaux sales qui tombent en cascade du plafond. De nombreuses cascades sont colorées en jaune vif ou en brun rougeâtre. Cette section du Baga-Darooz se trouve en effet sous le quartier de la confection de Barrakeesh où la Guilde des Tisseurs de Lin fait marcher ses nombreux ateliers de foulons. Les teintures usées sont jetées directement dans l'égout, colorant ainsi les eaux graisseuses du collecteur principal. Tout à coup, vous apercevez à quelques mètres des remous qui s'approchent de vous et vous comprenez, horrifié, qu'il s'agit du sillage caractéristique d'une créature des égouts. Instinctivement, vous vous collez au mur lorsque vous commencez à sentir des remous tournoyer autour de votre taille. Votre sang se fige et vous êtes incapable de faire le moindre mouvement mais, au bout de quelques secondes qui vous semblent une éternité, vous voyez avec un grand soulagement le tourbillon s'éloigner. Un cri terrifiant éclate brusquement dans les ténèbres : Maouk vient de perdre un de ses hommes. Le hurlement affreux du Sharnazim vous fait frémir des pieds à la tête, mais votre instinct vous dit de vous hâter tant que vous le pouvez encore. Le tunnel arrive bientôt à un croisement d'où part un autre tunnel vers l'ouest.",
  choix: [
    { texte: "Si vous souhaitez suivre ce tunnel", vers: "108" },
    { texte: "Si vous préférez continuer vers le nord", vers: "70" }
  ]
  },
  {
  id: "146",
  texte: "Pendant quelques minutes, vous regardez l'homme travailler à son enclume, au cas où lui aussi déciderait de quitter la pièce. Mais il continue à forger, apparemment peu affecté par la chaleur torride qui règne dans ces lieux. Pour atteindre la porte ouest sans être vu, vous devez traverser prudemment la forge en passant d'un pilier à un autre. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Camouflage ou de la Chasse, ôtez 2 au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "2-2": { vers: "44", texte: "Si votre total est inférieur à 2," },
        "3-3": { vers: "190", texte: "Si votre total est égal ou supérieur à 3," }
      }
      }
  },
  {
  id: "147",
  texte: "Votre sens Kaï vous dit de vous méfier de l'homme qui vous a aidé. Il a l'intention de vous trahir pour une bourse d'argent.",
  choix: [
    { texte: "Si vous souhaitez rester dans sa maison", vers: "61" },
    { texte: "Si vous préférez vous enfuir par la fenêtre", vers: "109" }
  ]
  },
  {
  id: "148",
  texte: "Dès que vous pénétrez dans la pièce, la porte se referme derrière vous et vous êtes plongé dans l'obscurité. Vous avancez craintivement, la main devant votre visage pour écarter les toiles d'araignées qui pendent du plafond en longues guirlandes.",
  choix: [
    { texte: "La pièce semble être sans issue lorsque, soudain, vous marchez sur une planche qui commande l'ouverture d'une porte qui coulisse lentement vous donnant ainsi accès à une petite pièce", vers: "14" }
  ]
  },
  {
  id: "149",
  texte: "Vous atteignez la porte donnant accès au Vizu-Diar sans être vu, mais celle-ci est solidement verrouillée de l'intérieur. Vous alliez maudire votre sort lorsque vous remarquez, au-dessus de la porte, une fenêtre au cadre finement sculpté et dont les persiennes de fer sont grandes ouvertes. Malgré votre bras blessé, vous parvenez à atteindre le rebord de la fenêtre en vous hissant grâce aux montants cloutés de la porte et vous sautez dans la Salle des Trophées où règne un inquiétant silence. Une étrange collection de têtes empaillées borde les murs de cet endroit très secret. La plupart de ces têtes sont celles de créatures reptiliennes du désert, souvenir des chasses impériales dans la Mer de la Sécheresse. Mais, beaucoup plus terrifiantes que ces trophées de chasse, au milieu des têtes de serpents, se trouvent des têtes humaines ! Trophées macabres des victoires des Zakhans, ce sont les têtes des chefs ennemis tués au combat lors des innombrables guerres menées par la Vassagonie. Vous quittez rapidement le Vizu-Diar par un long couloir aux murs de marbre incrusté d'or et de perles qui mène à un grand hall où vont et viennent les Gardes du Palais et des courtisans aux riches habits colorés. Dissimulé derrière une rangée de statues, vous parvenez à atteindre l'escalier qui se trouve au bout du hall sans être vu. Furtivement, vous grimpez les marches et vous arrivez à un palier d'où partent deux couloirs ; l'un vers l'est, l'autre vers l'ouest. Au bout de chaque couloir se trouve une porte au-dessus de laquelle est gravé un symbole. Au-dessus de la porte est, le symbole représente un mortier et un pilon. Le symbole de la porte ouest est un livre ouvert.",
  choix: [
    { texte: "Si vous souhaitez ouvrir la porte est", vers: "57" },
    { texte: "Si vous préférez ouvrir la porte ouest", vers: "100" }
  ]
  },
  {
  id: "150",
  texte: "Le couloir va vers le nord, mais il aboutit bientôt à un croisement d'où part un autre passage orienté est-ouest. Prudemment, vous regardez à droite et à gauche mais vous ne voyez aucune sentinelle. A l'est, vous distinguez un escalier qui descend à perte de vue. A l'ouest, vous apercevez une porte fermée.",
  choix: [
    { texte: "Si vous souhaitez aller vers l'est, vers cet escalier", vers: "93" },
    { texte: "Si vous préférez aller vers l'ouest, en direction de la porte", vers: "122" }
  ]
  },
  {
  id: "151",
  texte: "Votre regard, auquel rien n'échappe, tombe sur une étroite anfractuosité dans le mur du tunnel. Le trou est pratiquement au niveau de la limite des eaux écumeuses et est à peine visible dans l'obscurité. Vous vous glissez à l'intérieur, vous faisant le plus petit possible, tandis que l'eau viciée monte jusqu'à votre menton. Les Sharnazims passent à quelques centimètres de votre cachette et vous avez du mal à retenir un vomissement de dégoût, lorsqu'une éclaboussure vient vous arroser la figure. « Il a pris le tunnel sud, dit une des voix. Vite, ne perdons pas notre temps ici ! » Vous avez l'impression que les Sharnazims n'en finiront jamais de rebrousser chemin le long du tunnel.",
  choix: [
    { texte: "Avec un soupir de soulagement, vous vous extirpez de votre niche, mais vous vous emmêlez les pieds dans quelque chose qui est enfoui dans la vase du tunnel et vous perdez l'équilibre", vers: "94" }
  ]
  },
  {
  id: "152",
  texte: "Vous vous collez aux pierres du mur en essayant d'éviter de regarder les cours et les jardins du Palais à plusieurs dizaines de mètres en contrebas. Vous vous mordez nerveusement les lèvres en attendant que les Gardes s'éloignent, mais ils n'en font rien. La nuit va bientôt tomber et ils viennent fermer les grilles des fenêtres du Palais. Vous pouvez entendre le cliquetis des clés dans les serrures et les grilles grincer sur leurs gonds. Tous ces bruits vous font frémir et vous comprenez que vous êtes enfermé, à l'extérieur ! A votre gauche, la corniche fait le tour d'un dôme. Sous ce dôme se trouve la cantine. Si seulement vous pouviez parvenir à longer la corniche centimètre par centimètre, vous pourriez peut-être trouver une fenêtre ouverte de l'autre côté. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, ajoutez 2 au chiffre obtenu. Si vous avez le titre de Savant Kaï, ajoutez 2 autres points. Si votre total est compris entre 0 et 2, vous chutez dans le tar-sorkh. Si votre total est compris entre 3 et 8, rendez-vous au 38. Si votre total est compris entre 9 et 13, rendez-vous au 87.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-2": { vers: "77", texte: "Si votre total est compris entre 0 et 2, vous chutez dans le tar-sorkh" },
        "3-8": { vers: "38", texte: "Si votre total est compris entre 3 et 8," },
        "9-13": { vers: "87", texte: "Si votre total est compris entre 9 et 13," }
      }
      }
  },
  {
  id: "153",
  texte: "Maouk ordonne à ses troupes de fouiller les lieux tout en les menaçant de mort si vous réussissez à vous échapper. Vous serrez les dents et vous attendez qu'un heureux hasard se produise. Vous passez d'un bateau à l'autre en rampant et vous arrivez bientôt devant un escalier en pierre. Vous grimpez les marches et vous apercevez une petite place pavée au bout de laquelle s'étend un véritable dédale de ruelles tortueuses qui disparaissent dans l'obscurité du Quartier des Voleurs. Vous avez presque traversé la place lorsqu'un cri retentit du quai : « Le voilà ! >» Vous vous engagez en courant dans une rue déserte, puis vous grimpez les marches d'un escalier qui donne sur une petite cour. Le bruit des sabots claquant sur les pavés en contrebas vous fait accélérer l'allure. Vous avez trois issues possibles : une porte cloutée à votre gauche, une allée à votre droite et, devant vous, une ruelle pavée qui mène droit à un porche. Les hommes de Maouk sont sur vos talons et vous devez prendre une décision rapide.",
  choix: [
    { texte: "Si vous désirez ouvrir la porte", vers: "75" },
    { texte: "Si vous voulez suivre l'allée", vers: "117" },
    { texte: "Si vous décidez de prendre la ruelle pavée vers le porche", vers: "169" },
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "42", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "154",
  texte: "Vous écartez le rideau de perles et vous pénétrez dans une pièce fraîche plongée dans une semi-obscurité. Les fenêtres sont masquées par toutes sortes d'herbes et de plantes qui tamisent la lumière. Vous examinez une curieuse rangée de bocaux colorés lorsqu'une femme apparaît. Elle a des yeux verts perçants et ses cheveux roux sont relevés en arrière, maintenus par des anneaux de jade. Elle vous adresse la parole d'une voix douce : « Bienvenue, Homme du Nord, je suppose que vous êtes un guerrier, ou est-ce que je me trompe ? » Alors que vous hésitez à répondre, elle hausse les épaules puis elle fouille dans une pile de parchemins posés sur un tonneau de vin. Elle souffle la poussière d'une feuille jaunie, puis vous la tend : c'est une liste de marchandises, rédigée en sommerlundais. Vous lisez : Potion d'Alether (qui augmente le total d'HABILETÉ de 4 points pour la durée d'un combat) : 4 Pièces d'Or. Potion de l'herbe à Potence (chaque dose procure un sommeil d'une ou deux heures) : 2 Pièces d'Or. Potion de Laumspur (chaque dose fait gagner 4 points d'ENDURANCE) : 5 Pièces d'Or. Fiole d'huile de Larnuma (chaque dose donne 2 points d'ENDURANCE) : 3 Pièces d'Or. Teinture de chiendent des Cimetières (1 dose rend malade et fait perdre 2 points d'ENDURANCE) : 1 Pièce d'Or. Teinture de Calacena (1 dose produit de terribles hallucinations pendant une heure ou deux) : 2 Pièces d'Or. Vous pouvez acheter ce que vous désirez dans la liste ci-dessus ; inscrivez les potions, fioles, teintures que vous prenez sur votre feuille d'Aventure dans la case Sac à Dos.",
  choix: [
    { texte: "Vous pouvez ensuite quitter la boutique et continuer à avancer dans la rue", vers: "179" }
  ]
  },
  {
  id: "155",
  texte: "La vue qui s'offre à vous vous indique que la fenêtre doit être située très haut dans le mur sud du Grand Palais. Très loin en bas, vous apercevez les bâtiments de la capitale : des maisons en miniature, regroupées à l'intérieur de la muraille blanche de la cité. Au sud-est s'étend le lac Inrahim : une immense plaine d'eau salée actuellement à sec et complètement craquelée. Au nord, une route dont la chaussée surélevée conduit jusqu'à la ville de Chula que vous distinguez à peine à l'horizon. Au sudouest, vous voyez le massif montagneux du Dahir aux cimes désolées et écrasées de soleil. Au-delà du Dahir s'étend l'immense océan de dunes de sable, connu sous le nom de Mer de la Sécheresse. Les barreaux de la fenêtre sont passablement rouillés et vous devriez pouvoir les desceller sans difficulté, mais cependant, vous vous rendez compte qu'une chute de cette hauteur serait mortelle et vous descendez de la table.",
  choix: [
    { texte: "Vous revenez rapidement sur vos pas", vers: "182" }
  ]
  },
  {
  id: "156",
  texte: "Après vous être concentré sur la serrure pendant plusieurs minutes, vous vous rendez compte qu'elle est reliée à une alarme. Si vous faites un mauvais numéro, l'alarme se déclenchera, alertant tous les Gardes du Palais.",
  choix: [
    { texte: "Si vous possédez les Disciplines Kaï de la Puissance Psychique et du Sixième Sens", vers: "8" },
    { texte: "Si vous ne possédez pas ces deux disciplines", vers: "98" }
  ]
  },
  {
  id: "157",
  texte: "Une forte odeur d'encens brûlé remplit la maison. Vous entrez dans un couloir bordé de chaises et vous avancez lentement le long de l'allée centrale vers une fontaine flanquée de deux colonnes rouge orangé. Un homme vêtu de noir des pieds à la tête apparaît derrière la colonne de gauche et s'avance vers vous. Soudain, vous entendez les hommes de Maouk arriver sur la place et jeter des regards inquiets vers la porte ouverte. L'homme voit que vous êtes nerveux et indique silencieusement la porte d'une cave.",
  choix: [
    { texte: "Si vous souhaitez vous cacher dans la cave", vers: "16" },
    { texte: "Si vous préférez quitter les lieux, retournez à la Grand-Place", vers: "99" }
  ]
  },
  {
  id: "158",
  texte: "Vous entrez dans une galerie qui abrite une magnifique mosaïque. Des milliers de minuscules fragments de perles et d'or brillent dans le soleil couchant, irisant les hauts murs de marbre. Un groupe de courtisans déambule dans la galerie et vous devez vous dissimuler derrière un énorme pilier. Vous attendez que le bruit de leurs pas s'éloigne avant de ressortir en pleine lumière. Depuis longtemps, tout espoir de signer un traité de paix a disparu et il ne vous reste plus maintenant qu'à vous enfuir du Palais et à retourner au Sommerlund le plus vite possible d'une manière ou d'une autre.",
  choix: [
    { texte: "Vous quittez rapidement la galerie en suivant un couloir vers l'ouest et vous arrivez bientôt à un croisement où le couloir tourne brusquement vers le nord", vers: "58" }
  ]
  },
  {
  id: "159",
  texte: "Vous parvenez à enfoncer la porte mais, emporté par votre élan, vous ne pouvez pas vous arrêter. Vous dégringolez les marches la tête la première, et vous atterrissez en boule sur le sol de marbre d'une antichambre, à quelques centimètres d'un soldat armé qui garde les portes de l'Armurerie du Palais. (Vous perdez 2 points d'ENDURANCE.) Il est surpris par votre entrée originale, mais il retrouve rapidement tous ses esprits et passe à l'attaque. GARDE DE L'ARMURERIE HABILETÉ : 16 ENDURANCE : 22 Ôtez 2 points à votre total d'HABILETÉ pour les 3 premiers Assauts, car vous êtes allongé sur le sol. Vous n'avez pas la possibilité de fuir et vous devez combattre le Garde jusqu'à la mort.",
  suite: "52",
  combat: { nom: "Garde de l'armurerie", habilete: 16, endurance: 22 }
  },
  {
  id: "160",
  texte: "La peur de perdre votre bras est plus grande que le désir que vous avez de quitter cette ville hostile. Vous devez impérativement vous procurer de l'herbe d'Oede, même si cela signifie que vous allez devoir vous rendre à l'endroit que vous redoutez le plus : le Grand Palais. Vous suivez l'allée sinueuse à travers le Mikarum et vous arrivez au Horm-tas-Lallaim : la Sépulture des Princesses. Derrière le tombeau se dresse le Grand Palais, tel un imposant panthéon blanc. Vous vous rappelez tout à coup une vieille légende que vous racontait votre maître Kaï, il y a bien longtemps : La vengeance du Zakhan noir. Le Zakhan noir était un tyran brutal, le plus cruel d'une lignée sanguinaire qui régna jadis sur le Désert. La barbarie de ce règne est restée gravée à jamais dans la mémoire des habitants des régions des Fins de Terre. Ce Zakhan fit construire le Grand Palais par son armée d'esclaves faits prisonniers dans les pays qu'il conquit à la pointe de l'épée. Le Palais devint son obsession ; il dirigeait luimême les travaux et punissait personnellement les ouvriers lorsque les travaux prenaient le moindre retard. Il massacrait ses sujets sans discrimination et de la manière la plus terrifiante. Le mode d'exécution qu'il appréciait le plus consistait à scier la pauvre victime en deux des pieds à la tête jusqu'à ce que les deux parties du corps tombent au sol. Mais c'est surtout après l'exécution massive des esclaves qui avaient construit le Grand Palais qu'il est devenu aux yeux de tous le plus grand criminel de son temps. Il supprima en effet tous les esclaves afin que ses ennemis ne puissent jamais connaître l'existence des chambres secrètes renfermant les trésors. Parmi les victimes se trouvaient ses deux filles, Kebilla et Sousse, qui s'étaient opposées ouvertement à la cruauté de leur père et avaient essayé d'empêcher ce massacre. Dans une rage aveugle, il ordonna qu'elles fussent les premières à mourir. Il aurait mieux valu pour le Zakhan et pour la Vassagonie qu'il mourût ce jour-là. Il vécut encore deux ans, mais rongé par le remords, il se prit en horreur et sombra dans le désespoir. Dans le Grand Palais, le silence de la nuit était souvent rompu par les cris et les gémissements du Zakhan qui errait tel un spectre dans les pièces du Palais à la recherche de ses filles. Lorsqu'il mourut, il fut enterré à leurs côtés, dans la Sépulture des Princesses. D'où vous êtes, vous pouvez voir deux entrées qui donnent accès au Grand Palais : une porte hérissée de pointes dans la muraille nord et une arcade dans la muraille ouest, fermée par une herse. Le Palais est habituellement très bien gardé, mais il y a peu de sentinelles aujourd'hui, car la plupart sont parties à votre recherche dans la ville.",
  choix: [
    { texte: "Si vous désirez approcher par la porte nord", vers: "126" },
    { texte: "Si vous préférez vous approcher de la porte ouest", vers: "79" },
    { texte: "Enfin, si vous préférez trouver un autre moyen de pénétrer dans le Palais", vers: "49" }
  ]
  },
  {
  id: "161",
  texte: "Heureusement pour vous, votre ennemi avait juste l'intention de vous assommer et vous retrouvez la moitié des points d'ENDURANCE que vous aviez perdus au cours de la bataille. Rendez-vous au 69.",
  choix: [
    { texte: "Heureusement pour vous, votre ennemi avait juste l'intention de vous assommer et vous retrouvez la moitié des points d'ENDURANCE que vous aviez perdus au cours de la bataille", vers: "69" }
  ]
  },
  {
  id: "162",
  texte: "Vous vous glissez dans le conduit de la cheminée de gauche et vous faites une pause pour retrouver votre souffle. Les vapeurs bouillantes vous brûlent les poumons et le moindre mouvement vous demande d'énormes efforts, car vos mains enflées et votre visage tuméfié vous font atrocement souffrir. Déduisez 1 point d'ENDURANCE avant de reprendre votre escalade. Vous remarquez une fissure dans le mur du conduit enfumé. Vous l'utilisez comme prise et vous essayez de vous hisser le long de la cheminée mais, soudain, effrayé à la vue de répugnants insectes qui rampent sur vos bras, vous lâchez votre prise. Vous avez dérangé un nid d'Araignées monstrueuses ! ARAIGNÉES DES VAPEURS HABILETÉ : 10 ENDURANCE : 35 Ces créatures sont insensibles à la Puissance Psychique. Si vous avez perdu l'usage d'un de vos bras, vous ne pouvez combattre ces affreuses bestioles, sinon vous tomberiez immanquablement dans le tar-sorkh. Dans ce cas, utilisez la Table de Hasard pour obtenir un chiffre. Le chiffre obtenu représente le nombre de points d'ENDURANCE que vous perdez au contact des Araignées (un 0 correspond à une perte de 10 points).",
  suite: "114",
  combat: { nom: "Araignées des vapeurs", habilete: 10, endurance: 35, immunisePsychique: true }
  },
  {
  id: "163",
  texte: "Tandis que vous attendez avec anxiété le retour du Garde, l'autre brute se moque de vous et vous décrit avec délectation les tortures atroces qui vous attendent. Il est très déçu lorsque l'autre Garde revient les mains vides. « Le Zakhan ne veut pas que l'on maltraite notre ami du Nord. Il lui réserve quelque chose de spécial pour ce soir », grogne-t-il. Puis ils font demi-tour et s'apprêtent à quitter la cellule, le visage déformé par des grimaces de haine. A présent, les deux Gardes ont le dos tourné.",
  choix: [
    { texte: "Si vous souhaitez les attaquer", vers: "174" },
    { texte: "Si vous préférez rester dans la cellule", vers: "18" },
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "144", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "164",
  texte: "L'eau est de plus en plus épaisse et la puanteur qui se dégage des gaz délétères devient de plus en plus nauséabonde. Brusquement, l'air est envahi par des milliers de mouches et chaque fois que vous reprenez votre respiration, vous sentez au fond de la gorge une bouillie épaisse d'insectes agglutinés. La croûte noire et gluante qui recouvre vos yeux, vos narines et votre bouche ainsi qu'un goût âcre et infect dans la gorge vous soulèvent le cœur. Vous perdez 1 Point d'ENDURANCE. Comme en réponse à vos prières, une échelle de fer se détache de l'obscurité. Elle est fixée à la paroi du tunnel et monte jusqu'à une plaque ronde en pierre encastrée dans le plafond.",
  choix: [
    { texte: "Si vous souhaitez grimper à l'échelle", vers: "31" },
    { texte: "Si vous préférez continuer à avancer dans le tunnel envahi par les insectes", vers: "139" }
  ]
  },
  {
  id: "165",
  texte: "Le Garde porte la main à sa blessure puis tombe au sol, inanimé. Vous apercevez l'autre Garde qui, remis de votre coup, vient de saisir la poignée de la porte pour essayer de se lever.",
  choix: [
    { texte: "Si vous voulez attaquer le Garde", vers: "78" },
    { texte: "Si vous souhaitez seulement le neutraliser pour le prendre vivant", vers: "199" }
  ]
  },
  {
  id: "166",
  texte: "Vous massez votre bras endolori dans l'espoir de lui redonner un peu de vie, mais tout effort est inutile : il est complètement paralysé. Votre seule consolation vient du fait que ce n'est pas le bras qui manie les armes, mais celui qui tient le bouclier. Étant donné que vous ne pouvez plus vous protéger, ôtez 3 points à votre total d'HABILETÉ. Ces points pourront être récupérés ultérieurement si vous retrouvez l'usage de votre bras. Vous examinez attentivement les environs afin de trouver un moyen quelconque de fuir cet égout cauchemardesque. Le souterrain qui s'ouvre devant vous tourne et vire comme un gigantesque serpent et un vent chaud et humide d'air vicié souffle dans votre direction.",
  choix: [
    { texte: "Vous avez semé vos poursuivants, mais il vous reste à résoudre le problème de votre bras", vers: "55" }
  ]
  },
  {
  id: "167",
  texte: "Vous passez la porte et vous vous hâtez vers la fraîcheur accueillante qui règne dans la pièce. Vous remarquez une grande barre de fer au-dessus de la porte que vous baissez instinctivement afin de retarder d'éventuels poursuivants. La pièce est vide, excepté quelques vêtements posés sur le dossier d'une chaise en fer forgé. A en juger par leur coupe et leur taille, ces habits doivent probablement appartenir à l'Armurier. Vous entendez des bruits en provenance d'un couloir allant vers l'est : vous distinguez le tintement caractéristique d'assiettes qui s'entrechoquent puis les voix de Gardes affamés. Vous grimpez un large escalier et vous suivez un réseau de couloirs allant vers l'ouest. Ils sont bordés de nombreuses niches contenant des bustes en marbre et de belles tapisseries représentant un ancien Zakhan ou une bataille oubliée depuis longtemps.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "105", requis: {"discipline":"sixieme-sens"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "158" }
  ]
  },
  {
  id: "168",
  texte: "Tel un tigre, vous sautez au milieu des Gardes pris au dépourvu. Une des sentinelles s'apprête à lever sa sarbacane, mais un coup de poing bien ajusté au visage l'en empêche. Il tombe en arrière et sa tête va heurter le mur avec un bruit sourd et effrayant. Le deuxième Garde veut vous planter son trident dans la poitrine, mais vous esquivez son coup d'un saut de côté et, de votre main libre, vous saisissez son arme que vous tirez violemment. Le Garde perd l'équilibre et tombe la tête la première. Vous vous retournez juste à temps pour affronter le troisième Garde qui s'apprête à vous lancer son trident.",
  choix: [
    { texte: "GARDE DU VESTIBULE HABILETÉ : 15 ENDURANCE : 23 Si vous remportez ce combat en 3 Assauts ou moins", vers: "101" },
    { texte: "Si le combat dure plus de 3 Assauts", vers: "46" }
  ],
  combat: { nom: "Garde du vestibule", habilete: 15, endurance: 23 }
  },
  {
  id: "169",
  texte: "Vous débouchez sur une large rue où des vendeurs se battent pour un morceau de trottoir afin d'installer leurs tréteaux. La foule se presse au marché ; chacun porte un brassard noir en signe de deuil mais ici, contrairement au reste de Barrakeesh, les affaires continuent normalement. Vous passez devant une charrette remplie de brassards noirs au prix de 2 Pièces d'Or l'unité. Si vous souhaitez en acheter un, payez le vendeur et inscrivez votre nouvelle acquisition sur votre Feuille d'Aventure dans la case des Objets Spéciaux. Placez ce brassard autour du bras. Vous vous éloignez rapidement de la charrette et vous disparaissez dans une étroite ruelle bordée de nombreuses tavernes et auberges. L'air est rempli d'odeurs de cuisine et de vin aigre, et tout le passage résonne des cris et des bavardages de la population. Votre attention est attirée par une affiche placardée récemment sur le mur d'une taverne. Vous lisez la première ligne écrite en gros caractères: LE ZAKHAN EST MORT - VIVE LE ZAKHAN !",
  choix: [
    { texte: "Si vous souhaitez poursuivre la lecture de l'affiche", vers: "88" },
    { texte: "Si vous préférez continuer à avancer dans la ruelle", vers: "113" }
  ]
  },
  {
  id: "170",
  texte: "La maîtrise de ces Disciplines Kaï vous permet de vous glisser devant les Gardes sans être remarqué.",
  choix: [
    { texte: "Le temps qu'ils reprennent leur faction, vous êtes entré sans problème dans les jardins du Grand Palais", vers: "137" }
  ]
  },
  {
  id: "171",
  texte: "Un panneau, situé derrière la statue, glisse sur le côté et révèle l'existence d'un passage secret, étroit et obscur. Vous pouvez quand même voir nettement deux empreintes de pas dans la poussière qui recouvre le sol.",
  choix: [
    { texte: "Si vous souhaitez suivre le passage secret", vers: "148" },
    { texte: "Sinon, refermez le panneau et continuez à avancer dans la galerie", vers: "158" }
  ]
  },
  {
  id: "172",
  texte: "« Entrez, étranger. Bienvenue dans mon humble taverne, dit d'une voix accueillante la propriétaire rondelette de l'auberge. Nous avons du vin et de la nourriture à volonté, et des chambres à louer. » Elle a à peine terminé sa phrase que vous entendez les hommes de Maouk faire irruption sur la Place. Ils jettent des regards inquisiteurs vers la porte qui est restée ouverte. La tenancière se rend compte de votre nervosité et vous montre du doigt l'escalier de la cave. « Ne vous inquiétez pas, chuchote-telle, nous partageons votre crainte du nouveau Zakhan, il n'y a pas une seconde à perdre, descendez vous cacher ! »",
  choix: [
    { texte: "Vous n'avez pas le choix, car les hommes de Maouk s'approchent déjà de la taverne", vers: "16" }
  ]
  },
  {
  id: "173",
  texte: "A en juger par la direction du courant, le canal droit semble couler vers le nord. Le flot important des eaux usées, chargées des immondices du Baga-Darooz, coule vers la côte, jusqu'à ce qu'il émerge à Chivas, un village situé au nord-ouest de la capitale. Le déversement des eaux de l'égout dans la mer rend la vie des pauvres pêcheurs du village difficile et désagréable (particulièrement pendant les mois d'été). Si vous suivez le canal nord, vous atteindrez donc la côte. Le canal de gauche coule vers le sud et passe au cœur de la ville. Dans le dédale de canaux qui sillonnent le Baga-Darooz, vous devriez pouvoir trouver au moins une sortie vers les rues du centre. Droit devant vous, le canal du milieu va vers l'ouest. C'est de loin le moins pollué et le moins fétide des trois. Vous vous rappelez qu'au cours de vos voyages, l'homme surnommé le putois vous avait parlé du Grand Madani, un aqueduc long de plus de 70 kilomètres qui draine l'eau fraîche de la rivière Da vers la cité. Les citoyens de Barrakeesh, contrairement à ceux des autres villes de Vassagonie, jouissent donc d'un approvisionnement d'eau pure presque illimité. Le canal ouest devrait vous conduire à la source de la rivière Da.",
  choix: [
    { texte: "Si vous souhaitez suivre le canal nord", vers: "145" },
    { texte: "Si vous souhaitez suivre le canal sud", vers: "96" },
    { texte: "Si vous souhaitez suivre le canal ouest", vers: "13" }
  ]
  },
  {
  id: "174",
  texte: "Vous vous jetez en avant et vous donnez un violent coup de poing au plus grand des Gardes. Votre coup l'atteint à la nuque. La sentinelle tombe à genoux en poussant un hurlement de douleur et lâche son épée qui tombe à vos pieds avec un bruit métallique.",
  choix: [
    { texte: "Si vous voulez ramasser l'épée", vers: "4" },
    { texte: "Si vous préférez laisser l'épée, et vous battre à mains nues", vers: "91" }
  ]
  },
  {
  id: "175",
  texte: "Avant que vous ne trouviez une cachette adéquate, trois Sharnazims surgissent : « Laissez-le-moi, bande d'imbéciles ! » hurle une voix rauque. Les Gardes s'écartent pour laisser passer Maouk, qui surgit de l'ombre en brandissant une fléchette.",
  choix: [
    { texte: "Il laisse échapper un juron puis lance sa flèche en visant votre poitrine", vers: "25" }
  ]
  },
  {
  id: "176",
  texte: "Vous êtes dépossédé de votre Sac à Dos, puis on prend vos armes, votre Or, et tous vos Objets Spéciaux. Les mains liées dans le dos, vous êtes poussé sans ménagement, la tête la première, dans la voiture de Maouk. « Retournez au Palais ! » ordonne celui-ci au cocher en grimpant à l'intérieur. Il claque la portière puis reprend: « Le Zakhan attend son prisonnier ». Vous luttez pour essayer de dénouer la corde qui vous ligote mais Maouk ne tarde pas à s'en apercevoir. Il saisit votre bras et vous enfonce une aiguille dans la peau. Le rire sarcastique et cruel de Maouk vous semble de plus en plus lointain et vous plongez bientôt dans un profond sommeil.",
  choix: [
    { texte: "Mettez votre Feuille d'Aventure à jour et faites une liste de tous les objets que l'on vous a confisqués sur une feuille séparée qui vous servira d'aidemémoire au cas où vous les trouveriez plus tard au cours de votre aventure", vers: "69" }
  ]
  },
  {
  id: "177",
  texte: "Tandis que vous assénez un coup mortel au Kwaraz, trois Sharnazims émergent avec difficulté des eaux sombres de l'égout. Ils ont enlevé leur tunique noire et ils arborent sur leur torse musclé un tatouage bleu représentant les serres d'un aigle. Une fois hors de l'eau, ils dégainent leur cimeterre à la lame tranchante comme un rasoir tout en vous fixant d'un œil mauvais.",
  choix: [
    { texte: "Si vous souhaitez attaquer les Sharnazims", vers: "60" },
    { texte: "Si vous préférez fuir par l'étroit escalier de pierre", vers: "43" }
  ]
  },
  {
  id: "178",
  texte: "Vous avez descendu la moitié des marches lorsque le Garde se rend compte de votre manœuvre. Il dégaine son épée puis se lance à l'attaque. Vous ne pouvez pas prendre la fuite, et vous devez vous battre jusqu'à ce que mort s'ensuive.",
  choix: [
    { texte: "GARDE DE L'ARMURERIE HABILETÉ : 16 ENDURANCE : 22 Si vous remportez le combat, vous pouvez fouiller son cadavre", vers: "52" },
    { texte: "Si vous préférez entrer dans l'Armurerie, sans fouiller le corps", vers: "140" }
  ],
  combat: { nom: "Garde de l'armurerie", habilete: 16, endurance: 22 }
  },
  {
  id: "179",
  texte: "Les vitrines du magasin regorgent d'huiles, de potions, de médicaments et d'étranges plantes exotiques de toutes sortes. L'air est empli des effluves enivrantes des herbes médicinales. Tout à coup, la foule s'agite au bout de la rue avant de disparaître en un clin d'œil dans les magasins. Un homme se tient devant vous : son visage est ruisselant de sueur et ses habits en lambeaux sont recouverts de boue. C'est Maouk ! Il a survécu à l'enfer du Baga-Darooz. « S'il n'y avait pas le Zakhan, je vous aurais tué tout de suite, siffle-t-il entre ses dents avec un rictus de haine. Mais je n'ai pas l'intention de perdre la tête pour un lâche de votre espèce. » Vous pâlissez sous l'insulte, mais vous parvenez à contenir votre colère. En effet, vous sentez qu'il ne doit pas être seul et vous avez l'impression que des yeux vous observent derrière chaque fenêtre.",
  choix: [
    { texte: "Si vous voulez attaquer Maouk", vers: "197" },
    { texte: "Si vous préférez faire demi-tour et remonter la rue en courant", vers: "92" }
  ]
  },
  {
  id: "180",
  texte: "Alors que le deuxième Garde s'effondre à vos pieds, vous remarquez que le premier Garde s'est remis de votre coup. Il extrait un poignard de sa botte et, levant le bras, il s'apprête à vous le lancer. Si vous ne maîtrisez pas cette Discipline, utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez la Discipline Kaï du Sixième Sens, ou celle de la Chasse, ajoutez 3 au chiffre obtenu.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Puissance Psychique", vers: "45", requis: {"discipline":"puissance-psychique"} }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-5": { vers: "120", texte: "Si le résultat obtenu est compris entre 0 et 5," },
        "6-12": { vers: "193", texte: "S'il est compris entre 6 et 12," }
      }
      }
  },
  {
  id: "181",
  texte: "Vous fouillez tous les tiroirs, forçant les serrures lorsque cela est nécessaire mais, très déçu, vous ne retrouvez pas votre équipement. Tout espoir de signer un traité de paix avec le nouveau Zakhan a disparu. Vous n'avez plus qu'à continuer à rechercher votre équipement puis fuir le Grand Palais le plus rapidement possible afin de pouvoir retourner au Sommerlund. Vous écartez une cloison mobile faite de lattes de bois et vous pénétrez dans une petite pièce. D'étroites marches de pierre mènent à une porte ouverte, dans le mur nord. Devant la porte se trouve un coffre en bois.",
  choix: [
    { texte: "Si vous désirez gravir les marches et franchir la porte", vers: "14" },
    { texte: "Si vous préférez ouvrir le coffre", vers: "97" }
  ]
  },
  {
  id: "182",
  texte: "Vous arrivez dans une pièce au haut plafond voûté. Dans le mur sud, il y a une grande porte renforcée par de gros clous près de laquelle se trouve un râtelier où sont suspendus un Javelot et une Épée. Si vous le désirez, vous pouvez prendre l'une de ces armes (ou bien les deux). Au nord, sous un porche en forme de fer à cheval, joliment décoré, un autre passage conduit hors de la pièce.",
  choix: [
    { texte: "Si vous souhaitez suivre ce passage", vers: "132" },
    { texte: "Si vous préférez écouter à la porte", vers: "115" }
  ]
  },
  {
  id: "183",
  texte: "La tête du guerrier émerge tout à coup de la bouche d'égout. Il s'attaque violemment à votre jambe, vous tailladant méchamment le mollet. Vous perdez 2 points d'ENDURANCE. Fou de colère et de douleur, vous levez la jambe et, de toutes vos forces, vous décochez au Garde un coup de pied en pleine figure. Il pousse un cri et tombe en arrière dans l'égout avec un plouf sonore et sinistre. Vous replacez la dalle de pierre puis vous tirez une lourde barre que vous placez en travers avant de reprendre votre chemin à travers le dédale des rues de la ville. Puisque vous n'avez plus aucune chance de pouvoir signer le traité de paix avec le nouveau Zakhan, vous n'avez plus rien à faire à Barrakeesh et vous devez maintenant trouver un moyen quelconque pour rentrer au Sommerlund le plus vite possible. Finalement, vous arrivez à une place animée où se tient un marché. Votre regard est attiré par une enseigne accrochée audessus de l'entrée d'une grande bâtisse : BAINS PUBLICS DE BARRAKEESH. A ce moment, l'odeur de vos vêtements vous rend passablement malade.",
  choix: [
    { texte: "Vous ouvrez la porte sans hésitation et vous vous glissez à l'intérieur", vers: "90" }
  ]
  },
  {
  id: "184",
  texte: "Vous scrutez l'horizon et vous apercevez au fond du port un entrepôt au toit blanc en forme de dôme. Le dernier étage du bâtiment est prolongé par une plateforme qui surplombe le pont d'un bateau de commerce ancré près des quais, quelques mètres plus bas. Sur cette plate-forme se trouvent de grosses amphores en terre cuite, remplies d'épices, qui doivent être chargées à bord du navire pour être livrées aux comptoirs commerciaux de Ragadorn. Vous fixez votre attention sur une amphore puis vous essayez, à l'aide de votre Discipline Kaï, de la faire bouger. Ce violent effort de concentration vous fait suer abondamment et des gouttes commencent à perler sur votre front.",
  choix: [
    { texte: "Quelques secondes plus tard, vous entendez un choc au loin : vous avez réussi; l'amphore a oscillé, puis est tombée sur le pont du navire", vers: "153" }
  ]
  },
  {
  id: "185",
  texte: "Les bruits des pas se font de plus en plus forts puis cessent brusquement. Vous entendez des voix chuchoter et soudain, la silhouette de Maouk, une fléchette à la main, se détache de l'obscurité. Ses hommes de main le rejoignent rapidement et il vous dit en ricanant : « Fait comme un rat ! »",
  choix: [
    { texte: "Il vous lance sa flèche en visant la poitrine", vers: "25" }
  ]
  },
  {
  id: "186",
  texte: "Vous utilisez votre Discipline Kaï pour dissimuler votre accent du Sommerlund et vous criez au Garde : « Vite ! à l'aide, l'Homme du Nord est en train de s'échapper ! » Aussitôt, le Garde se met en mouvement et monte l'escalier quatre à quatre vers la porte. Vous attendez qu'il arrive à la dernière marche avant d'attaquer. Un coup au genou l'envoie rouler au pied des marches. Vous descendez dans la pièce, prêt à frapper de nouveau au cas où le Garde reprendrait connaissance. Précaution inutile car le Garde est, cette fois-ci, bel et bien mort. Dans sa chute, il s'est brisé la nuque.",
  choix: [
    { texte: "Si vous désirez fouiller son cadavre", vers: "52" },
    { texte: "Si vous préférez laisser le corps et inspecter l'Armurerie", vers: "140" }
  ]
  },
  {
  id: "187",
  texte: "Vous reconnaissez la créature : il s'agit d'un Kwaraz. Ce sont de gigantesques reptiles originaires des marais de Maaken situés à des centaines de kilomètres à l'ouest de la Vassagonie. Les Kwaraz peuvent vivre dans n'importe quel environnement pourvu qu'il y fasse chaud et que l'air soit humide et fétide. Vous comprenez tout à coup que le Baga-Darooz réunit toutes les conditions permettant à ces dangereuses créatures de proliférer. Le Kwaraz se déplace au plafond en s'agrippant à la pierre à l'aide de ses longues griffes recourbées, ses yeux globuleux de plus en plus écarquillés... Les Kwaraz sont très sensibles au pouvoir psychique. En utilisant votre Discipline Kaï de la Communication Animale, vous le persuadez que votre chair n'est pas aussi tendre qu'elle en a l'air et, bientôt, vous n'offrez plus aucun intérêt à ses yeux. Vous le regardez disparaître le long du tunnel avec un sentiment de crainte mêlé de fascination. Soudain, un cri terrifiant retentit dans les ténèbres : Maouk vient de perdre un de ses hommes.",
  choix: [
    { texte: "Un frisson glacial vous parcourt l'échine mais votre instinct vous dit de continuer d'avancer rapidement pendant qu'il en est encore temps", vers: "17" }
  ]
  },
  {
  id: "188",
  texte: "La taverne est bondée. Les consommateurs sont accoudés à un long comptoir de pierre incrusté de fragments de marbre aux couleurs variées. De grandes jarres en terre cuite remplies de divers plats épicés sont posées sur le comptoir et des serveuses vont et viennent, tâchant de satisfaire les clients impatients.",
  choix: [
    { texte: "Si vous portez un Brassard noir", vers: "172" },
    { texte: "Si vous n'en possédez pas", vers: "72" }
  ]
  },
  {
  id: "189",
  texte: "Le Messager tombe en criant, mais il est déjà mort lorsqu'il heurte les pavés. Vous tirez rapidement son cadavre dans l'ombre, puis vous revêtez son ample habit et vous rabattez le capuchon pour cacher votre visage. Dans la poche de l'habit, vous trouvez un parchemin : le saufconduit indispensable pour pénétrer dans le Grand Palais. Le cheval du messager, effarouché, s'est enfui, mais le fait que vous arriviez à pied à la porte du Palais ne semble cependant pas éveiller de soupçon.",
  choix: [
    { texte: "Les Gardes examinent le laissez-passer avec indifférence puis vous autorisent à entrer dans les jardins du Palais", vers: "137" }
  ]
  },
  {
  id: "190",
  texte: "Vous avez à peine fait une douzaine de pas que le forgeron vous aperçoit. L'Armurier géant brandit son lourd marteau et s'avance vers vous en laissant échapper un grognement sanguinaire. Vous vous apprêtez à vous défendre, mais vous restez figé sur place un instant lorsque vous réalisez avec stupeur que son marteau est le prolongement de son bras droit. Sa main est, en fait, un énorme poing d'acier. L'Armurier pousse son cri de guerre et vous évitez de justesse son redoutable bras qui s'écrase violemment contre le mur en faisant éclater une pierre. Le coup est passé à quelques centimètres de votre scalp ! POING D'ACIER L'ARMURIER HABILETÉ: 18 ENDURANCE: 30 Réduisez de 2 points votre total d'HABILETÉ pour la durée du combat à cause de la chaleur terrible qui règne dans la forge.",
  suite: "111",
  combat: { nom: "Poing d'acier l'armurier", habilete: 18, endurance: 30 }
  },
  {
  id: "191",
  texte: "Vous réussissez à grimper lentement sur les avirons et, une fois parvenu au bastingage, des mains vous saisissent fermement par le col de votre manteau et vous hissent par-dessus bord. «Livrezmoi Loup Solitaire, hurle Maouk depuis le quai. C'est un ordre du Zakhan ! » Les membres de l'équipage se dévisagent, déçus et peinés. Ils savent que les menaces de Maouk ne sont pas de vaines paroles et vous ne pouvez pas exiger de ces hommes qu'ils sacrifient leur vie et celle de leur famille pour vous sauver. Vous devez adopter une nouvelle tactique.",
  choix: [
    { texte: "Si vous décidez de", vers: "176" },
    { texte: "Si vous préférez plonger par-dessus bord pour échapper à Maouk", vers: "142" }
  ]
  },
  {
  id: "192",
  texte: "La chaleur devient de plus en plus accablante. Par trois fois, vous glissez et vous manquez de perdre l'équilibre, mais grâce à vos bons réflexes, vous échappez à une mort cruelle dans le tarsorkh. Vous réussissez à grimper quelques mètres, mais à quel prix ! Vos doigts et vos genoux, qui sont écorchés à vif, saignent abondamment et vos jambes vous font très mal.",
  choix: [
    { texte: "Vous perdez 2 points d'ENDURANCE", vers: "114" }
  ]
  },
  {
  id: "193",
  texte: "Vous faites un saut de côté, juste à temps pour éviter le poignard qui passe à quelques centimètres de votre gorge. Le Garde n'en croit pas ses yeux, et vous regarde stupéfait, la bouche grande ouverte. Il est à présent désarmé.",
  choix: [
    { texte: "Si vous désirez l'attaquer", vers: "78" },
    { texte: "Si vous souhaitez juste le neutraliser pour le capturer vivant", vers: "199" }
  ]
  },
  {
  id: "194",
  texte: "Le Yas est un serpent constricteur. Il tue ses proies en les étouffant grâce aux anneaux puissants de son long corps. Ses yeux endormis sont maintenant grands ouverts, les pupilles sont verticales et l'iris d'un rouge vif. Il vous fixe d'un regard envoûtant et vous comprenez avec horreur qu'il essaie de vous hypnotiser. A moins que vous ne maîtrisiez la Discipline Kaï du Bouclier Psychique, déduisez 3 points de votre total d'HABILETÉ pour toute la durée du combat.",
  suite: "35",
  combat: { nom: "Yas", habilete: 14, endurance: 28 }
  },
  {
  id: "195",
  texte: "Au centre d'une grande pièce circulaire, on a construit une forge dont la cheminée s'enfonce en plein milieu du plafond. La chaleur était déjà accablante, mais en pénétrant dans cette pièce, vous avez réellement l'impression d'entrer dans un fourneau en pleine activité. Deux hommes, torse nu, un pagne autour des reins, manient un soufflet qui active la forge. Des gouttes de sueur ruissellent sur leur peau et ils s'arrêtent fréquemment pour boire de grandes rasades d'eau fraîche qu'ils tirent à l'aide d'une louche d'un puits creusé sur le sol. Un Armurier au physique impressionnant martèle une barre de fer chauffée à blanc posée sur une enclume. Il a d'énormes épaules musclées et sa poitrine est aussi large que les deux autres hommes réunis ! Soudain, les hommes qui actionnaient le soufflet quittent la pièce, l'un par la porte du mur nord, l'autre par la porte du mur ouest. Le grand Armurier quant à lui, continue à battre le fer.",
  choix: [
    { texte: "Si vous souhaitez suivre l'homme qui est sorti par la porte nord", vers: "11" },
    { texte: "Si vous préférez suivre celui qui a quitté la pièce par la porte ouest", vers: "146" },
    { texte: "Si vous désirez attaquer l'Armurier", vers: "190" },
    { texte: "Enfin, si vous voulez quitter la pièce et revenir sur vos pas pour emprunter l'autre couloir", vers: "30" }
  ]
  },
  {
  id: "196",
  texte: "Une grande table, sur laquelle on a disposé des plats de viande, du vin et des miches de pain toutes chaudes, occupe le centre de la pièce.",
  choix: [
    { texte: "Si vous désirez goûter à un plat qui vous semble particulièrement appétissant", vers: "61" },
    { texte: "Si vous préférez quitter la pièce par la fenêtre", vers: "109" }
  ]
  },
  {
  id: "197",
  texte: "Maouk extrait de son habit une petite flèche qu'il tient serrée dans son poing puissant. Il lève le bras puis lance la fléchette en visant votre poitrine. Vous êtes à bout portant et vous ne pouvez rien faire pour éviter le projectile.",
  choix: [
    { texte: "La flèche vous atteint en pleine poitrine, vous coupant le souffle", vers: "25" }
  ]
  },
  {
  id: "198",
  texte: "Tandis que le corps inerte de l'Officier heurte violemment la porte défoncée de la cave, les Sharnazims reculent et laissent passer Maouk qui apparaît dans l'encadrement de la porte en brandissant une fléchette. « Je vous tiens maintenant ! », dit-il d'une voix sifflante en lançant la flèche vers votre poitrine. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, ajoutez 3 au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "25", texte: "Si le résultat obtenu est compris entre 0 et 6," },
        "7-9": { vers: "141", texte: "Si le résultat obtenu est compris entre 7 et 9," }
      }
      }
  },
  {
  id: "199",
  texte: "Vous neutralisez le Garde par une clé à la tête et vous menacez de lui rompre le cou s'il ne répond pas à vos questions. Il vous promet immédiatement de vous révéler tout ce qu'il sait. « Le Zakhan a peur que vous ne soyez un assassin, envoyé par ses ennemis de l'ouest pour le tuer, dit-il d'une voix apeurée. Moi aussi je déteste le Zakhan, mais je ne suis qu'un simple geôlier et je ne sais rien de plus. »",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "39", requis: {"discipline":"sixieme-sens"} },
    { texte: "Dans le cas contraire", vers: "9" }
  ]
  },
  {
  id: "200",
  texte: "L'empereur de Vassagonie, le Zakhan Kimah, trône sur une estrade recouverte de fourrure écarlate. Il est vêtu d'un habit brodé d'or mais dépourvu de tout ornement. Il tient dans la main un objet de métal noir et ses yeux froids et cruels vous glacent le sang. Le Zakhan est un homme à la prestance impressionnante, mais il fait pâle figure à côté de son compagnon qui est la véritable cause de votre terreur. Celui-ci se tient devant le Zakhan ; un heaume noir comme la mort dissimule son visage mais une odeur de décomposition et une horrible voix sépulcrale trahissent son identité. « Amenez-moi Loup Solitaire ! » hurle la voix cruelle, que vous connaissez bien : celle d'un Seigneur des Ténèbres d'Helgedad, vos ennemis mortels. Le Zakhan se lève et, en observant attentivement son visage, vous décelez une lueur de doute - ou peut-être de crainte - dans ses yeux durs, mais ils reprennent vite leur expression normale. « Il vous sera amené, au coucher du soleil, en échange de l'Orbe de la Mort, comme convenu », dit le Zakhan. « Mais vous l'avez cet Orbe ! rétorque la terrible voix, amenez-moi ce blanc-bec de Loup Solitaire- » Le Zakhan parvient à dissimuler sa peur mais le temps joue contre lui. La partie de bluff qu'il a engagée est très dangereuse. Cependant, il n'a pas encore été percé à jour et c'est une preuve de la force de la volonté car le Seigneur des Ténèbres fait de grands efforts pour essayer de connaître le fond de sa pensée. « Vous aurez votre Homme du Nord, Seigneur Haakon, répond sèchement le Zakhan, mais puisque vous prétendez n'avoir aucun besoin d'or ni de bijoux, alors pourquoi vos hommes ont-ils pillé les tombes de nos ancêtres et profané la sépulture du Majhan ? » Un silence de mort règne dans la salle, troublé seulement par le sifflement de la respiration du Seigneur des Ténèbres. « Ce pays, dit-il, cet insignifiant lopin de sable recèle deux échardes enfoncées douloureusement dans notre chair et nous voulons nous en débarrasser une bonne fois pour toutes. Loup Solitaire est l'une d'elles ; à cause de lui, nous n'avons aucun pouvoir au Sommerlund. La tombe du Majhan cache l'autre épine qui nous menace : ce maudit Livre du Magnakaï. » Votre cœur bat à tout rompre lorsque ces mots résonnent à vos oreilles : le Livre du Magnakaï ! La raison pour laquelle vous avez été entraîné dans ce piège mortel devient alors claire et la sinistre vérité vous apparaît subitement. Le Livre du Magnakaï est un recueil des plus vieilles légendes du Sommerlund. L'Aigle du Soleil, le premier Grand Maître Kaï, a pu, grâce à la sagesse et au savoir qu'enseigne le Magnakaï, instruire les guerriers de la maison d'Ulnar. Votre roi est issu de cette lignée de guerriers qui avaient pour mission de défendre votre pays contre les attaques et les dévastations perpétrées par les Seigneurs des Ténèbres. Le Livre du Magnakaï a été perdu il y a des centaines d'années, mais sa sagesse est parvenue vivante jusqu'à maintenant, transmise oralement de génération en génération par les guerriers du Sommerlund. C'est ainsi qu'ils ont pu faire face et résister à leurs ennemis de toujours : les Seigneurs des Ténèbres d'Helgedad. Si ces derniers découvrent le Livre de Magnakaï, ils le détruiront ; ses secrets seront perdus à jamais et, à votre mort, le Kaï s'éteindra. En revanche, si vous trouvez le Livre avant les Seigneurs des Ténèbres, toute la sagesse du Magnakaï vous sera révélée et, grâce à ce savoir, vous deviendrez fort, suffisamment fort pour arriver à la consécration pour un guerrier du Sommerlund : devenir Grand Maître Kaï. Cette glorieuse quête et ses grands périls vous font oublier que des dangers plus immédiats vous menacent. Deuxième partie",
  choix: [
    { texte: "Pour connaître ces dangers et commencer la quête du Livre du Magnakaï", vers: "201" }
  ]
  }
];
