import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 04 — Le Tyran du Désert
 * Paragraphes 201 à 300. Fichier GÉNÉRÉ par
 * scripts/ls05-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls05-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_201_300: StorySection[] = [
  {
  id: "201",
  texte: "Tout à coup, vous apercevez deux guerriers qui s'avancent lentement vers vous le long d'un passage à votre droite. Ils portent des armures noires, des habits écirlates et vous reconnaissez leur hideux masque à tête de mort: ce sont des guerriers Drakkars. Les Drakkars sont des hommes, certes, mais des hommes extrêmement cruels, aussi méchants et féroces que les Seigneurs des Ténèbres qu'ils servent. L'un d'eux tient en laisse un Akataz aux crocs acérés. Le Drakkar siffle, et aussitôt, le redoutable chien de guerre vous saute à la gorge.",
  choix: [
    { texte: "Si vous désirez vous battre avec cette créature", vers: "273" },
    { texte: "Si vous préférez tenter d'échapper à cette attaque et vous enfuir", vers: "285" }
  ]
  },
  {
  id: "202",
  texte: "Vous passez sous un porche voûté flanqué de deux tours coniques dont les toits en cuivre brillent comme de l'or. Puis vous arrivez sur une grande place noire de monde où se tient un marché. De nombreux commerçants haranguent la foule et les marchandages vont bon train. On peut acheter ici toutes sortes d'objets colorés, des tapis exotiques et une grande variété de produits agricoles. La partie nord du marché est consacrée à la vente aux enchères de Douggas, des animaux du désert au poil lisse, et très bruyants. Ceux-ci ont été parqués dans un enclos attenant aux écuries près duquel se pressent les futurs acheteurs. Juste derrière les écuries, une rue disparaît dans le quartier des fabricants de tapis d'Ikaresh.",
  choix: [
    { texte: "Si vous souhaitez entrer dans les écuries", vers: "309" },
    { texte: "Si vous voulez demander à l'un des marchands où se trouve Tipasa", vers: "248" },
    { texte: "Si vous préférez quitter le marché, traversez la place et", vers: "386" }
  ]
  },
  {
  id: "203",
  texte: "Un flot de sang vert s'écoule de l'habit rouge du Vordak en dégageant une odeur acide et écœurante. La créature pousse un cri, bascule, et son corps mutilé tombe en vrille dans les airs. Vous rengainez votre arme, puis vous saisissez les rênes et vous tentez de reprendre le contrôle de votre monture blessée. Vous avez tué le Vordak, mais la bataille n'est pas encore gagnée car l'Itikar perd beaucoup de sang et peut sombrer dans l'inconscience à tout moment en vous laissant choir comme une pierre vers le lac Inrahim.",
  choix: [
    { texte: "Tout à coup, vous apercevez quelque chose au loin, quelque chose qui vous redonne foi dans les miracles", vers: "221" }
  ]
  },
  {
  id: "204",
  texte: "Vous sentez que la pierre émet des radiations extrêmement dangereuses et maléfiques. Si vous pouviez seulement retourner le pouvoir de cette pierre contre le Seigneur des Ténèbres, celuici serait dépossédé de sa force. Bien que la pierre ne puisse pas tuer Haakon, elle pourrait au moins l'exiler en un lieu où il ne pourrait plus rien faire pour vous nuire.",
  choix: [
    { texte: "Si vous souhaitez essayer de vous emparer de la pierre pour la tourner contre votre ennemi", vers: "268" },
    { texte: "Si vous préférez laisser la pierre et attaquer le Seigneur des Ténèbres avec votre arme", vers: "390" }
  ]
  },
  {
  id: "205",
  texte: "Le vent qui siffle à vos oreilles colporte les hurlements d'allégresse des Drakkars qui vous regardent aller à une mort certaine. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "234", texte: "Si le chiffre que vous avez tiré est compris entre 0 et 4," },
        "5-9": { vers: "293", texte: "Si le chiffre que vous avez tiré est compris entre 5 et 9," }
      }
      }
  },
  {
  id: "206",
  texte: "Vous frappez mais vous n'obtenez aucune réponse. Vous vous apprêtez à frapper une nouvelle fois, lorsque la porte s'entrouvre de quelques centimètres. Vous apercevez les yeux rougeoyants d'une vielle femme qui brillent dans les ténèbres. « Banedon ! s'écrit-elle, d'une voix chevrotante et enrouée. Grâce à Dieu, c'est vous. » Elle vous introduit tous deux dans la maison et verrouille la porte. La pièce est presque vide et les quelques meubles qui s'y trouvent sont cassés ou en mauvais état. « Ils l'ont pris, Banedon. Les hommes au visage de mort ont pris mon mari. Il y a dix jours... Ils sont venus comme des ombres dans la nuit. » Tout à coup, elle s'effondre, son corps maigre secoué par les sanglots. Banedon la réconforte du mieux qu'il peut, mais vous sentez qu'il partage également sa douleur. Les Drakkars se sont emparés de Tipasa, il n'y a pas de doute et, à l'heure actuelle, ils ont déjà dû lui faire dire tout ce qu'il savait au sujet du Tombeau du Majhan. « Nous le trouverons, je vous le promets dit Banedon en essuyant les larmes qui ruissellent sur le visage de la vieille femme. Mais vous devez essayer de nous aider si vous le pouvez. Nous savons que Tipasa gardait toujours un journal de ses voyages. Est-il toujours en votre possession ? » Une étincelle d'espoir se met à luire dans les yeux de la vieille femme. « Oui, il est ici. Il m'a dit de le cacher quand ces brutes sont venues le chercher. » Elle s'agenouille devant la cheminée, déloge une brique descellée dans l'âtre, puis en retire un livre relié de cuir. Elle le tend à Banedon qui en étudie très attentivement les pages jaunies. En regardant par-dessus son épaule, vous remarquez que le livre est rempli de symboles secrets, de chiffres et de mystérieux pictogrammes. « Toutes ces figures représentent les différentes positions des étoiles, dit Banedon en suivant du doigt les lignes de la carte astronomique. Je suis sûr qu'elles recèlent le secret que nous cherchons, mais sans ma carte du ciel, nous ne réussirons pas à trouver le Tombeau du Majhan. Dès les premières lueurs de l'aube, nous retournerons à la Nef du ciel.",
  choix: [
    { texte: "Une fois à bordvje devrais pouvoir comprendre l'énigme de ce livre. »", vers: "331" }
  ]
  },
  {
  id: "207",
  texte: "Vos découvertes ne présentent que peu d'intérêt : 8 Pièces d'Or et 1 Sifflet de Cuivre attaché à une chaîne que le Garde porte autour du cou. Vous pouvez prendre ces objets si vous le désirez, mais n'oubliez pas de les noter sur votre Feuille d'Aventure. Soudain, des bruits de pas vous signalent l'arrivée d'individus peu désirables : des Drakkars ! Ceux-ci se pressent sur le sentier pavé qui mène aux enclos.",
  choix: [
    { texte: "Sans hésiter une seule seconde, vous pénétrez dans l'enclos de l'Itikar", vers: "224" }
  ]
  },
  {
  id: "208",
  texte: "« Par tous les Dieux ! crie Banedon, un lépreux ! » Le visage du vieil homme n'est plus qu'un horrible masque couvert de pustules verdâtres et purulentes. Ses pupilles ont viré au jaune et ses lèvres ne sont plus que des lambeaux de chair grisâtre qui pendent lamentablement. Banedon vous écarte du pauvre malade puis vous dit à l'oreille : « Il a la lèpre, Loup Solitaire ; une maladie terrible, extrêmement contagieuse, qui pourrit la peau. Nos vies sont en danger. »",
  choix: [
    { texte: "Si vous possédez un peu d'herbe d'Oede, vous pouvez en donner au malheureux lépreux", vers: "321" },
    { texte: "Si vous n'en possédez pas, ou si vous ne souhaitez pas en donner au malade, fuyez la caverne avec Banedon et", vers: "270" }
  ]
  },
  {
  id: "209",
  texte: "Au moment où vous atteignez le palier, vous voyez trois Drakkars pénétrer dans la tour. Tandis qu'ils commencent à gravir les marches, des rires maniaques et lugubres s'élèvent des masques à tête de mort qui recouvrent leur visage. Bientôt, d'autres guerriers Drakkars arrivent en grand nombre sur le pont pour leur prêter main-forte. Quelques-uns possèdent des arbalètes et vous vous rendez compte qu'il serait suicidaire de passer à l'attaque.",
  choix: [
    { texte: "Sans perdre un instant, vous continuez à grimper les marches quatre à quatre", vers: "322" }
  ]
  },
  {
  id: "210",
  texte: "Vous vous jetez au sol et votre connaissance Kaï vous fait échapper à la hache qui arrive en tournoyant sur la plate-forme. Soudain, une explosion assourdissante retentit et le Drakkar est violemment projeté en arrière, la cuirasse déchirée par le tir du Nain, puis il disparaît dans les ténèbres qui entourent la Nef du ciel en lâchant un dernier cri. Comme en réponse au tir, un coup de tonnerre menaçant roule dans le ciel au-dessus de la plaine assombrie de Barrakeesh et vous avez l'impression que la ville entière maudit votre fuite. Très inquiet, Banedon surgit à vos côtés. Il vous tend une main tremblante pour vous aider à vous relever et vous remarquez que le pansement de fortune qui protège sa blessure est tout trempé de sang. Son visage est blême et vous avez l'impression qu'il va s'évanouir d'une seconde à l'autre.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "377", requis: {"discipline":"guerison"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "339" }
  ]
  },
  {
  id: "211",
  texte: "Malgré vos craintes, le vin vert s'avère délicieux. Une douce chaleur monte lentement en vous, vous remplissant d'une agréable sensation de bien-être. Vous gagnez 2 points d'ENDURANCE. L'homme a l'air ravi de votre réaction et il vous propose de vous en vendre une bouteille pour 5 Pièces d'Or. Si vous voulez acheter une bouteille de Kourshah, payez les 5 Pièces d'Or et faites les modifications nécessaires sur votre Feuille d'Aventure. (Il y a suffisamment de Kourshah dans la bouteille pour vous* faire regagner 4 points d'ENDURANCE).",
  choix: [
    { texte: "Si vous voulez à présent le questionner sur Tipasa le Vagabond", vers: "318" },
    { texte: "Si vous préférez poursuivre votre route vers Ikaresh, sans rien lui demander", vers: "272" }
  ]
  },
  {
  id: "212",
  texte: "A travers l'épais rideau d'arbres, vous apercevez des ombres fugitives : ce sont les Drakkars qui tentent de vous encercler. Soudain, une forme rouge surgit du feuillage et une masse d'armes vous frôle la tête. La puissance du coup vous envoie rouler au sol comme si la masse vous avait touché. Le Vordak éclate d'un rire maléfique et se précipite sur vous, en brandissant son arme noire pour vous fracasser le crâne.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "349" },
    { texte: "Si vous ne possédez pas cet Objet Spécial", vers: "355" }
  ]
  },
  {
  id: "213",
  texte: "Le Drakkar tombe à genoux et vous entendez d'horribles grincements métalliques tandis qu'il essaie, en vain, d'arracher son masque à tête de mort. Son heaume a, dans un premier temps, amorti vos coups mais ensuite le métal s'est enfoncé et lui a fracturé le crâne. Vous lui donnez un violent coup de pied qui l'envoie basculer par-dessus bord. Son corps tombe en tournoyant vers le lac Inrahim où il va rejoindre le Nain qu'il vient de tuer. Tout à coup, vous apercevez une jambe retenue prisonnière dans les cordages du bastingage : le Nain n'est pas mort et encore moins en compagnie du Drakkar, plusieurs dizaines de mètres plus bas ! Il est là, accroché aux cordages ; vous le saisissez par la jambe et vous le hissez à bord avant de reprendre le combat. La plate-forme a l'air déserte ; aucune tête ne dépasse du parapet blindé, mais vous sentez qu'il se passe quelque chose d'anormal.",
  choix: [
    { texte: "Instinctivement, vous sautez du pont arrière, et vous vous dirigez vers la plate-forme en brandissant votre arme, prêt à frapper", vers: "361" }
  ]
  },
  {
  id: "214",
  texte: "Vous concentrez votre pouvoir sur une pelle posée dans une brouette non loin de vous, afin de détourner l'attention de la sentinelle. Sous votre influence, l'outil se met à s'agiter et le Drakkar, entendant le bruit, quitte aussitôt son poste.",
  choix: [
    { texte: "Le temps qu'il retourne à sa place après cette fausse alerte, vous êtes déjà dans le Tombeau du Majhan", vers: "395" }
  ]
  },
  {
  id: "215",
  texte: "En bas des marches, une porte en bois consolidée par des barres de fer donne accès au jardin parfumé. Vous tournez rageusement la poignée, mais la porte est verrouillée de l'intérieur. Pendant ce temps, plusieurs Gardes ont surgi sur le pont au-dessus de vous et, dès qu'ils vous aperçoivent, ils prennent en main leurs lourdes arbalètes.",
  choix: [
    { texte: "Si vous possédez une Clé de Cuivre", vers: "246", requis: {"objet":"cle-cuivre"} },
    { texte: "Si vous ne possédez pas cet Objet Spécial, vous pouvez essayer d'escalader la porte", vers: "301" },
    { texte: "Sinon, vous pouvez remonter l'escalier et courir vers les Gardes le plus rapidement possible avant qu'ils n'aient le temps de charger leurs armes", vers: "375" }
  ]
  },
  {
  id: "216",
  texte: "Vous arrivez bientôt dans un jardin public où se trouve rassemblée une petite foule autour d'une fontaine en ruine. Les membres de l'auditoire écoutent le discours passionné d'un homme vêtu de rouge des pieds à la tête. Ils portent tous un foulard de la même couleur qui leur recouvre le bas du visage. « Ce sont des Adu-Kaw, les voilés, dit Banedon nerveusement. Il semble qu'ils soient en train de déclarer la guerre à leurs ennemis de toujours : les hommes de Tefa. » Puis Badenon et vous allez vous mettre à l'ombre d'un Toab, où vous pourrez écouter discrètement la suite du discours. L'orateur dénonce à présent les abus des Tefarims, qui réclament des droits de passage exorbitants pour pouvoir traverser leur ville sans incident et emprunter la grande voie menant à Kara Kala. Peu à peu, les discours de l'homme amènent les spectateurs au paroxysme de leur agitation. Soudain, l'homme vêtu de rouge montre du doigt l'endroit où vous vous trouvez et s'écrie: « Regardez : des espions Tefarims ! »",
  choix: [
    { texte: "Si vous voulez tenter de raisonner cette bande de fanatiques qui s'avance vers vous, l'arme au poing", vers: "284" },
    { texte: "Si vous préférez suivre l'exemple de Banedon et vous enfuir à toutes jambes", vers: "340" }
  ]
  },
  {
  id: "217",
  texte: "L'Itikar vous fixe d'un œil noir et froid, mais sans hostilité. Au moment où vous vous installez sur la large selle, vous apercevez les Drakkars se ruant sur la passerelle.",
  choix: [
    { texte: "Vous dénouez alors rapidement la longue laisse qui retenait l'oiseau attaché, puis vous empoignez les lourdes rênes de cuir", vers: "343" }
  ]
  },
  {
  id: "218",
  texte: "Les Nains poursuivent leur repas, s'arrêtant uniquement de temps en temps pour allumer de grandes pipes à couvercle. A travers les volutes de fumée bleue qui s'élèvent dans la petite cabine, vous remarquez qu'ils vous jettent des regards inquiets, comme si vous alliez vous écrouler d'un instant à l'autre. Au bout de cinq minutes, Nolrim lève sa chope pour porter un toast : « A Loup Solitaire, un homme parmi les Nains ! » Les Nains rient grassement aux paroles ironiques de Nolrim, puis à leur tour ils lèvent leurs chopes pour saluer votre courage et votre vaillance.",
  choix: [
    { texte: "La bière de Bor a délié leur langue et ils sont tous impatients de vous raconter leurs anciens faits d'armes", vers: "291" }
  ]
  },
  {
  id: "219",
  texte: "N'écoutant que votre instinct, vous plongez au sol puis vous effectuez un roulé-boulé. La flamme bleue passe en sifflant audessus de votre tête et va exploser contre le mur en faisant un trou de plusieurs dizaines de centimètres de profondeur dans les pierres dures de la paroi. Vous vous relevez rapidement, puis vous courez vous cacher derrière une énorme colonne quand, tout à coup, retentit le rire sinistre d'Haakon, le Seigneur des Ténèbres. Peu à peu, le ricanement s'amplifie, et vous ressentez une violente douleur à la tête, comme si vous aviez le crâne pris dans un étau.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Bouclier Psychique", vers: "253", requis: {"discipline":"bouclier-psychique"} },
    { texte: "Si vous ne possédez pas cette Discipline", vers: "369" }
  ]
  },
  {
  id: "220",
  texte: "Votre maîtrise Kaï de l'Orientation vous indique que le sentier sinueux mène directement à l'Arboretum du Zakhan : sa cathédrale de verdure. Derrière le petit portail se trouve une chambre secrète située dans le Palais supérieur, mais votre sens Kaï ne vous en dit pas plus.",
  choix: [
    { texte: "Si vous désirez suivre le sentier", vers: "391" },
    { texte: "Si vous préférez grimpez les marches qui mènent au petit portail", vers: "352" }
  ]
  },
  {
  id: "221",
  texte: "Emergeant d'un banc de nuages, vous apercevez un vaisseau volant : c'est une petite embarcation, pas plus grande qu'une péniche de la rivière Unoram, avec deux voiles triangulaires qui claquent au vent de chaque côté de la proue incurvée. Dans la lumière décroissante du crépuscule, vous voyez un long étendard flottant en haut du mât et un vrombissement sourd parvient jusqu'à vos oreilles. Vous regardez, incrédule, ce spectacle insolite : êtes-vous victime d'une hallucination trompeuse créée par les Seigneurs des Ténèbres, ou bien est-ce un mirage dû à un jeu de lumières ? Mais tandis que l'embarcation se rapproche, force vous est de constater qu'il s'agit bel et bien d'un vaisseau volant.",
  choix: [
    { texte: "Si vous possédez le Pendentif à l'Etoile de Cristal", vers: "336" },
    { texte: "Si vous ne possédez pas cet Objet Spécial", vers: "275" }
  ]
  },
  {
  id: "222",
  texte: "Vous devez agir rapidement, si vous voulez éviter d'être repéré, car la créature rouge est un Vordak, un des puissants morts vivants qui sont au service des Seigneurs des Ténèbres. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "1-2": { vers: "378", texte: "Si vous avez tiré 0, 1 ou 2," },
        "3-9": { vers: "262", texte: "Si vous avez tiré un chiffre entre 3 et 9," }
      }
      }
  },
  {
  id: "223",
  texte: "Brusquement, la douleur cesse mais le combat ne fait que commencer. Un nuage noir comme la mort s'échappe de la bouche de Haakon, descend le long de son bras et vient se nicher dans le creux de sa main. Un tourbillon très sombre se forme lentement et bientôt des ailes et des tentacules se déploient de toutes parts.",
  suite: "353",
  combat: { nom: "Créature de la crypte", habilete: 24, endurance: 40 }
  },
  {
  id: "224",
  texte: "Le grand oiseau noir fait battre ses puissantes ailes en poussant des croassements rauques. Ses yeux noirs et féroces vous fixent agressivement tandis que vous approchez de son perchoir. Vous essayez de monter sur la selle en vous accrochant au pommeau mais, vif comme l'éclair, l'oiseau tente de vous désarçonner d'un grand coup de patte. Instinctivement, vous vous protégez le visage tandis qu'à quelques centimètres de votre tête, l'Itikar fouette l'air de son bec courbe où se reflète la lumière jaune du soleil. Si vous ne répondez à aucune de ces conditions, utilisez la Table de Hasard pour obtenir un chiffre. Si vous avez atteint le titre d'Aspirant Kaï ou bien un titre plus élevé, ajoutez 2 au chiffre obtenu.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "308", requis: {"discipline":"communication-animale"} },
    { texte: "Si vous possédez un Médaillon d'Onyx", vers: "319" }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "8-11": { vers: "287", texte: "Si votre total est compris entre 8 et 11," },
        "4-7": { vers: "240", texte: "Si votre total est compris entre 4 et 7," },
        "1-3": { vers: "370", texte: "Si votre total est compris entre 1 et 3," },
        "0-0": { vers: "257", texte: "Si enfin, vous avez tiré un 0," }
      }
      }
  },
  {
  id: "225",
  texte: "L'homme est de petite stature, mais large d'épaules et solidement bâti, selon les caractéristiques physiques communes au rudes montagnards de Vassagonie. Il débouche une bouteille de vin vert clair puis il en verse trois grandes rasades dans les coupes en terre. « Kourshah ! » s'écrie-t-il, puis il vide sa coupe d'un trait.",
  choix: [
    { texte: "Si vous désirez l'imiter et boire ce vin mystérieux", vers: "211" },
    { texte: "Si vous ne voulez pas en boire, demandez-lui où vous pouvez trouvez Tipasa et", vers: "318" }
  ]
  },
  {
  id: "226",
  texte: "Vous êtes le premier à vous ressaisir après cette brusque rencontre. Si vous désirez attaquer les Gardes, rendez-vous au 334. (En ce cas, les blessures que vous pourriez recevoir durant les 2 premiers Assauts ne vous coûteront aucun point d'ENDURANCE.) Si vous ne souhaitez pas vous battre, vous pouvez fuir en remontant l'escalier avant que les Gardes ne passent à l'attaque. Rendez-vous au 209.",
  choix: [
    { texte: "Si vous désirez attaquer les Gardes, . (En ce cas, les blessures que vous pourriez recevoir durant les 2 premiers Assauts ne vous coûteront aucun point d'ENDURANCE.) Si vous ne souhaitez pas vous battre, vous pouvez fuir en remontant l'escalier avant que les Gardes ne passent à l'attaque", vers: "334" },
    { texte: "Vous êtes le premier à vous ressaisir après cette brusque rencontre", vers: "209" }
  ]
  },
  {
  id: "227",
  texte: "Tandis que vous vous approchez d'une allée plongée dans l'obscurité, vous entendez la voix d'une vieille femme qui mendie dans l'ombre. « Ayez pitié jeunes gens ! Ayez pitié d'une pauvre veuve ! » Une vieille femme décrépite apparaît à la lumière, le visage tout ridé et les yeux hagards. Elle répète sa complainte, les traits crispés. « A vot'bon cœur, M'sieurs-dames, pour une pauvre veuve dans l'besoin. »",
  choix: [
    { texte: "Si vous désirez vous arrêter pour la questionner", vers: "265" },
    { texte: "Si vous préférez passer votre chemin, sans vous soucier de la vieille femme", vers: "388" }
  ]
  },
  {
  id: "228",
  texte: "Vous courez tête baissée à travers un enchevêtrement d'arbres et de racines et vous parvenez à semer vos impitoyables ennemis. Vous arrivez à une petite tonnelle en bois, de forme arrondie, à moitié dissimulée par un rideau de plantes grimpantes. Scrutant le feuillage épais, vous remarquez que les plantes montent jusqu'à un balcon en fer forgé qui mène droit à un portail en pierre.",
  choix: [
    { texte: "Si vous souhaitez vous hisser sur le balcon en vous accrochant au lierre, et vous enfuir ensuite par la porte en pierre", vers: "352" },
    { texte: "Si vous préférez essayer de sortir de l'Arboretum en trouvant une issue au niveau du sol", vers: "332" }
  ]
  },
  {
  id: "229",
  texte: "Alors que le vaisseau apparaît dans la lumière du soleil, un terrible bruit retentit : le vrombissement strident des Kraans qui se laissent tomber en piqué de leurs pitons rocheux. Avant l'aube, leurs cavaliers connaissaient déjà votre cachette avec certitude et ils ont attendu patiemment sur leur perchoir que vous passiez avant de tendre leur embuscade. Le Cube de Cristal noir leur a permis de suivre votre évasion à travers les monts du Dahir comme si votre route était éclairée par des flambeaux. Comprenant que ce Cube vous a trahi, vous le sortez rapidement de votre poche, mais avant même que vous n'ayez pu le jeter au loin, celui-ci explose dans votre main. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Sixième Sens, ajoutez 3 au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "385", texte: "Si votre total est compris entre 0 et 6," },
        "7-12": { vers: "251", texte: "Si votre total est compris entre 7 et 12," }
      }
      }
  },
  {
  id: "230",
  texte: "Une autre explosion vient frapper la base du pilier derrière lequel vous aviez trouvé refuge et l'énorme colonne s'écroule en quelques secondes. Votre corps déchiqueté est enseveli sous des tonnes de sable et de pierres. Votre vie et les espoirs du Sommerlund s'achèvent ici.",
  fin: "mort",
  nomFin: "Fin tragique — §230"
  },
  {
  id: "231",
  texte: "Les Drakkars se précipitent dans la salle des Gardes en mugissant comme des Mammouths de Kalte et en battant l'air de leurs terrifiantes épées noires. Leur chef avance vers vous, une longue mèche de cheveux d'un noir de jais s'échappant de son heaume, l'épée prête à vous donner le coup qui vous étripera. Mais vous faites un pas de côté et vous lui assénez un violent coup en pleine poitrine. Votre arme enfonce le métal noir de sa cuirasse, lui écrasant les côtes et le tuant sur le coup ; mais avant même qu'il ne s'écroule au sol, deux autres Drakkars sont sur vous. Vous ne pouvez pas éviter le combat et vous devez les combattre jusqu'à ce que mort s'ensuive.",
  suite: "290",
  combat: { nom: "Drakkars", habilete: 18, endurance: 34 }
  },
  {
  id: "232",
  titre: "Mort — §232",
  texte: "Vous essayez de vous écarter de la trajectoire de la lame mortelle mais, dans l'obscurité, vous ne pouvez pas voir distinctement la direction qu'elle a prise. Le coup vous atteint à la poitrine et sa violence chasse l'air de vos poumons. Vous voyez trente-six chandelles, puis une explosion vous brise les tympans. Vous tombez à genoux et une sensation d'engourdissement se répand dans votre corps. A travers les brumes tourbillonnantes, vous voyez le Drakkar basculer en arrière, la cuirasse déchirée par la balle qu'un Nain vient de tirer. Banedon apparaît, le visage décomposé, couleur de cendres. Ses lèvres remuent, mais vous ne pouvez pas comprendre les paroles qu'elles prononcent. Des images du Sommerlund flottent devant vos yeux, puis disparaissent peu à peu tandis que vous sombrez dans l'inconscience. Votre vie et les derniers espoirs pour le Sommerlund prennent fin ici.",
  fin: "mort",
  nomFin: "Fin tragique — §232 (abattu par un Drakkar)"
  },
  {
  id: "233",
  texte: "En plaçant le Prisme au centre du rayon, vous dirigez la lumière vers le trou creusé dans le sol. Vous entendez les dalles de pierre frotter l'une contre l'autre, puis vous voyez la porte s'ouvrir lentement sur une grande pièce. Cette pièce est faiblement éclairée, mais vous voyez se dessiner, dans la poussière qui recouvre le sol de marbre, d'innombrables traces de pas. Tandis que vous entrez, vous apercevez tout à coup un trône en pierre brute qui fait face au mur du fond de la pièce.",
  choix: [
    { texte: "Derrière vous, la porte se referme silencieusement à une vitesse déconcertante", vers: "289" }
  ]
  },
  {
  id: "234",
  texte: "Dans une hébétude totale, vous tombez en tournoyant sans même savoir si c'est la tête la première ou les pieds en avant. L'air chaud qui vous cingle le visage souffle si fort qu'il vous maintient les yeux grands ouverts et vous desserre les mâchoires. Vous respirez avec difficulté et vous continuez à tomber en hurlant de terreur jusqu'à ce que vous heurtiez les branches supérieures d'un Toab ; quelques secondes après, vous tombez à l'eau. Vous refaites rapidement surface et vous commencez instinctivement à faire des battements de jambes. Vous n'avez aucune idée de la direction où vous allez, mais en quelques brasses vous vous retrouvez près du bord d'un bassin d'eau claire. Encore sous le choc, vous tremblez de tous vos membres mais vous parvenez néanmoins à vous hisser sur le rebord couvert de mousse. Par miracle, vous n'avez pas été blessé lors de votre chute, mais votre épreuve est loin d'être terminée, car les Drakkars et les Gardes du Palais vous ont vu tomber et ils sont déjà en train de dévaler l'escalier de la tour. A présent, ils traversent le pont en courant, vers les jardins du Palais. Un peu plus loin, derrière une colonnade bordée d'arbres, un escalier grimpe jusqu'à un petit portail donnant accès au Palais supérieur. A votre droite, un étroit sentier s'enfonce dans l'épais feuillage des arbres et des arbustes.",
  choix: [
    { texte: "Si vous désirez gravir les marches qui mènent au petit portail", vers: "352" },
    { texte: "Si vous préférez suivre le sentier sinueux", vers: "391" },
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "220", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "235",
  texte: "Des rangées de stalactites, semblables aux défenses de quelque monstre fantastique, pendent du plafond de la grotte. Des profondeurs insondables vous parviennent les bruits inquiétants des remous d'un geyser. Vous commencez à explorer les lieux et, finalement, vous parvenez à un endroit où un pont naturel en pierre enjambe un cours d'eau. Des fumées s'élèvent lentement des eaux rougies par le minerai de cuivre. Soudain, vous apercevez la silhouette décharnée et pitoyable d'un homme blotti sous le pont. Il est enveloppé dans une couverture déchirée qui cache son visage et il tient dans ses mains maigres une canne à pêche rudimentaire. Il a déjà attrapé quelques crabes des laves qui gisent au bord de l'eau, les pinces secouées par les dernières convulsions de leur lente agonie. Alors que vous vous approchez de lui, il redresse lentement la tête pour vous examiner : c'est un homme, mais la vue de son visage vous glace d'effroi.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "344", requis: {"discipline":"guerison"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "208" }
  ]
  },
  {
  id: "236",
  texte: "Emporté par votre élan, vous traversez rapidement la passerelle sans être repéré. Lorsque vous portez votre coup, le Garde est toujours à genoux, en train de ramasser son or éparpillé sur le sol. Votre attaque est silencieuse et mortelle.",
  choix: [
    { texte: "Si vous souhaitez fouiller le corps du Garde", vers: "207" },
    { texte: "Si la dépouille ne vous intéresse pas, hâtez-vous de gagner l'enclos de l'Itikar et", vers: "224" }
  ]
  },
  {
  id: "237",
  texte: "Le Jala est aussi bon qu'il en a l'air, et après votre expédition à travers les collines poussiéreuses, ce vin est une véritable bénédiction pour votre gorge irritée et desséchée. Vous gagnez 1 point d'ENDURANCE. « Savez-vous où nous pourrions trouver un homme appelé Tipasa le Vagabond », demande Banedon en parvenant à dissimuler son accent des Contrées du Nord grâce à sa maîtrise parfaite du dialecte Ikareshi. « Désolé, l'ami, mais je n'ai jamais entendu parler de lui », réplique l'un des hommes. «Vous devriez demander à la veuve Soushilla, interrompt l'autre. Elle est au courant de tout ce qui se passe à Ikaresh. » « Où peuton la trouver ? » leur demandez-vous encore. « A la taverne, bien sûr ! » répondent-ils en chœur. Traversez la place de l'Aigle, et vous la trouverez sur le chemin du marché aux Douggas. Vous remerciez l'Ikareshi et vous quittez l'auberge.",
  choix: [
    { texte: "En revenant sur vos pas, vers la place, vous prenez le chemin du marché aux Douggas et vous partez à la recherche de la veuve Soushilla", vers: "376" }
  ]
  },
  {
  id: "238",
  texte: "Vous fuyez le lieu du combat et vous courez vers le passage opposé, mais vos ennemis vous donnent la chasse et le bruit de leurs bottes ferrées résonne à vos oreilles. Vous dévalez l'escalier, passez sous un porche d'argent et longez un balcon surplombant le Palais inférieur. Dans le hall, au-dessous de vous, vous apercevez la silhouette de Haakon brandissant le poing. Un Drakkar, surgissant de nulle part, se jette sur vous, son épée levée au-dessus de son heaume en forme de tête de mort. Soudain, il se produit un craquement assourdissant ; une gerbe d'étincelles bleues jaillit d'une pierre que le Seigneur des Ténèbres tient à la main et dirige droit vers vous. Le Drakkar se précipite sur vous et vous blesse au bras (vous perdez 1 point d'ENDURANCE), mais il se trouve maintenant sur la trajectoire du rayon de Haakon. Après un éclair aveuglant, il ne reste plus de lui qu'un tas de cendres et une âcre odeur de chair roussie. Au bout du balcon, vous apercevez un autre porche et un escalier.",
  choix: [
    { texte: "Si vous souhaitez vous enfuir par le porche", vers: "381" },
    { texte: "Si vous souhaitez fuir par l'escalier", vers: "317" }
  ]
  },
  {
  id: "239",
  texte: "Si vous voulez pénétrer dans le Tombeau, vous devez obligatoirement distraire la sentinelle ou bien la réduire au silence. Si vous ne possédez pas cet Objet Spécial, vous devrez arriver silencieusement à la hauteur du Garde, puis le neutraliser le plus rapidement et le plus silencieusement possible. A cette fin, utilisez la Table de Hasard, pour obtenir un chiffre. Si vous maîtrisez les Disciplines Kaï de la Chasse, de l'Orientation et du Camouflage, ajoutez 2 points au chiffre que vous avez tiré. Si vous avez le titre de Gardien Kaï, ajoutez 3 points au chiffre obtenu.",
  choix: [
    { texte: "Si vous possédez une Teinture de Ronces des cimetières", vers: "260" }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "324", texte: "Si votre total est maintenant compris entre 0 et 4," },
        "5-9": { vers: "303", texte: "S'il est de 5 ou plus," }
      }
      }
  },
  {
  id: "240",
  texte: "Les Itikars sont des créatures sauvages et rusées de nature. Le dressage de ces animaux peut prendre plusieurs années, mais une fois apprivoisés, ces oiseaux noirs géants se montrent des serviteurs fidèles et dévoués. Alors que vous avancez, l'Itikar sent que vous n'êtes pas son maître et il vous attaque furieusement avec son redoutable bec et ses serres acérées. ITIKAR HABILETÉ: 17 ENDURANCE: 30 Menez ce combat de façon normale, mais multipliez par deux tous les points d'ENDURANCE perdus par l'oiseau géant. Lorsque son total d'ENDURANCE sera tombé à 0, vous l'aurez suffisamment maîtrisé pour pouvoir monter en selle et le tenir en main. Tous les points d'ENDURANCE que vous perdez durant ce combat compteront pour de véritables blessures et devront par conséquent être déduits de votre total d'ENDURANCE.",
  suite: "217",
  combat: { nom: "Itikar", habilete: 17, endurance: 30 }
  },
  {
  id: "241",
  texte: "Une fois hors de la grotte, Banedon et vous partez en direction d'Ikaresh sans perdre une minute. Lorsque vous arrivez près des faubourgs de la ville, vous passez devant une petite hutte ronde où une chèvre est attachée à une mangeoire près de la porte. Un homme apparaît dans l'encadrement et vous souhaite la bienvenue. Il porte sa main à son front en signe d'amitié, puis vous invite à entrer dans son humble demeure.",
  choix: [
    { texte: "Si vous souhaitez accepter son invitation", vers: "225" },
    { texte: "Si vous préférez décliner son offre et poursuivre votre route vers Ikaresh", vers: "272" },
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "365", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "242",
  texte: "Vous reconnaissez la créature vêtue de rouge : il s'agit d'un Vordak, l'un des puissants morts vivants au service des Seigneurs des Ténèbres. Les Vordaks possèdent un pouvoir psychique très important et vous vous rendez compte qu'il cherche à vous maîtriser grâce à cette force psychique. Si vous voulez échapper à ces malfaisants Vordaks, vous devez non seulement protéger votre corps mais aussi votre esprit. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Camouflage, ajoutez 2 points au chiffre que vous avez tiré. Si vous maîtrisez la Discipline Kaï du Bouclier Psychique, ajoutez 3 points à ce chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "262", texte: "Si le total obtenu est compris entre 0 et 6," },
        "7-7": { vers: "378", texte: "Si le total obtenu est supérieur à 7," }
      }
      }
  },
  {
  id: "243",
  texte: "Vous portez un coup mortel au Drakkar qui bascule par-dessus le bastingage blindé puis tombe comme une pierre dans la vallée, faisant une chute de plusieurs centaines de mètres. Rendez-vous au 306.",
  choix: [
    { texte: "Vous portez un coup mortel au Drakkar qui bascule par-dessus le bastingage blindé puis tombe comme une pierre dans la vallée, faisant une chute de plusieurs centaines de mètres", vers: "306" }
  ]
  },
  {
  id: "244",
  texte: "Vous distinguez très nettement la route principale qui relie Chula à la capitale. Elle franchit la longue plaine salée du lac Inrahim par un viaduc haut de dix mètres. Ce viaduc est un excellent point de repère grâce auquel vous pouvez vous orienter. La route est bordée par des hameaux de petites maisons en pierre, aux toits en terre battue. Au fur et à mesure que vous approchez de la ville, leur nombre augmente et vous n'êtes plus qu'à sept kilomètres de Chula lorsqu'un nuage sombre apparaît au-dessus d'un de ces petits villages. C'est un nuage de Kraans ; et ceux-ci font route pour vous intercepter. Brusquement, l'Itikar hurle de douleur tandis qu'un paquet de plumes arrachées tombe en tourbillonnant. Un des Kraans s'est approché et il se trouve maintenant à moins de 100 mètres derrière vous. Son cavalier Drakkar est en train de ranger une arbalète en bronze dans son carquois et de tirer une longue épée noire. La flèche qu'il vient de tirer a transpercé l'aile de votre monture et il s'apprête maintenant à frapper avec son épée, alors que l'Itikar perd de la hauteur et de la vitesse. DRAKKAR HABILETÉ: 20 ENDURANCE: 28 Le Kraan et son cavalier foncent sur vous ; le combat ne durera qu'un seul Assaut car, emporté par son élan, le Drakkar ne restera à votre niveau qu'un court instant.",
  choix: [
    { texte: "Si vous perdez plus de points d'ENDURANCE que votre adversaire au cours de cet unique Assaut", vers: "347" },
    { texte: "Si votre adversaire perd plus de points d'ENDURANCE que vous", vers: "327" },
    { texte: "Si le nombre de points perdus est le même pour vous deux", vers: "271" }
  ],
  combat: { nom: "Drakkar", habilete: 20, endurance: 28 }
  },
  {
  id: "245",
  texte: "Vous enlevez le Triangle de Pierre Bleue de votre cou et vous le placez dans l'empreinte creusée dans le mur. Le Triangle en épouse parfaitement la forme et la porte de pierre s'ouvre aussitôt dans un grincement lugubre. Vous pénétrez alors dans une pièce faiblement éclairée et vous apercevez de nombreuses empreintes de pas dessinées dans l'épaisse couche de poussière qui recouvre le sol de marbre. Au fond de la pièce se trouve un trône en pierre brute, tourné vers le mur du fond.",
  choix: [
    { texte: "Derrière vous, la porte se referme brusquement", vers: "289" }
  ]
  },
  {
  id: "246",
  texte: "Vous ouvrez la porte avec la Clé de Cuivre et vous vous précipitez dans le jardin. A peine avez-vous refermé la porte que vous entendez le bruit des flèches qui viennent rebondir sur les barres de fer. Des buissons et des arbres exotiques aux parfums délicats bordent un joli bassin rempli d'eau bleue. C'est un spectacle ravissant, mais vous n'osez pas vous arrêter pour en jouir tranquillement. En effet, les Drakkars et les Gardes du Palais savent que vous êtes dans ce jardin et vous devez impérativement reprendre votre course si vous voulez avoir une chance de leur échapper. Derrière une colonnade, une volée de marches grimpe jusqu'à un petit portail encastré dans le mur du Palais supérieur. A votre droite, une allée s'enfonce dans l'épais feuillage des arbres et des arbustes.",
  choix: [
    { texte: "Si vous souhaitez gravir les marches qui mènent au petit portail", vers: "352" },
    { texte: "Si vous préférez suivre le sentier sinueux", vers: "391" },
    { texte: "Si vous possédez la Discipline Kaï de l'Orientation", vers: "220", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "247",
  texte: "Le voyage que vous effectuez à travers les Foos est absolument extraordinaire. La Nef du ciel se faufile en planant entre de hautes colonnes de pierre qui s'élèvent de la vallée. Ces pitons rocheux forment un paysage fantastique d'une grandeur surnaturelle. Très loin en dessous, au fond de la vallée, des bulles d'eau sulfureuse montent lentement des fissures du sol orangé et des flots de lave incandescente creusent en grondant des canaux circulaires qui rougeoient tel des douves remplies de feu liquide. Vous observez le ciel, mais il n'y a aucun signe d'une présence ennemie. « Ikaresh, le \"Repaire de l'Aigle\", dit pensivement Banedon, c'est là que nous trouverons Tipasa le Vagabond, car Ikaresh est sa ville natale et toute sa famille y demeure. Bien qu'il passe la majeure partie de son temps à errer dans la Mer de la Sécheresse, il finit toujours par retourner chez les siens. » Après avoir traversé les Foos, vous atteignez, en fin d'après-midi, les collines qui dominent la ville d'Ikaresh. Banedon pose la Nef du ciel au sommet d'un rocher, puis il lance une échelle de corde au sol. Il a été convenu que Banedon et vous irez à pied jusqu'à Ikaresh, afin de rechercher Tipasa, tandis que Nolrim et l'équipage attendront votre retour en cachant la Nef dans les environs. En effet, la vue de la Nef du ciel survolant la ville risquerait de donner à votre arrivée une publicité quelque peu gênante. Avec Banedon, vous préparez votre expédition en vous enduisant le visage avec une pâte brune tirée des baies de copalla et en revêtant les habits gris et blancs communément portés par les montagnards de cette région. Ainsi déguisés, vous dites adieu à Nolrim et vous partez à travers les collines nues et désolées. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-2": { vers: "337", texte: "Si le chiffre que vous avez tiré est compris entre 0 et 2," },
        "3-9": { vers: "383", texte: "Si ce chiffre est compris entre 3 et 9," }
      }
      }
  },
  {
  id: "248",
  texte: "Un petit marchand est en train de haranguer la foule derrière une charrette située près du porche voûté. Ses petits yeux de fouine brillent sous un turban ridicule, beaucoup trop grand pour lui. A peine êtes-vous arrivé près de son étalage qu'il se jette sur vous et essaie désespérément, par un flot de paroles plus ou moins convaincantes, de vous vendre une marchandise qui a l'air de bien piètre qualité. Il semble surpris lorsque vous l'interrompez par votre question. « Tipasa ? reprend-il. Oui, je sais où il se trouve. » Puis, il vous tend un paletot criard taillé dans une toile grossière, à rayures roses et orange. « Voilà qui fera un beau cadeau pour votre cher ami, dit-il, les yeux fixés en permanence sur la bourse accrochée à votre ceinture. Et cela pour la modique somme de 5 Pièces d'Or, Seigneur ! » Vous comprenez que vous allez devoir acheter ce vêtement ridicule avant que le marchand se décide à vous dire où demeure Tipasa.",
  choix: [
    { texte: "Si vous désirez acheter le paletot, payez les 5 Pièces d'Or, puis", vers: "328" },
    { texte: "Si vous ne voulez pas acheter le paletot ou si vous n'en avez pas les moyens", vers: "274" }
  ]
  },
  {
  id: "249",
  texte: "Tandis que le Vordak se meurt, son corps se dissout petit à petit en un liquide verdâtre et bouillonnant qui dessèche immédiatement les plantes qui se trouvent à proximité. Soudain, le sifflement d'une épée vous signale la présence des Drakkars qui se rapprochent maintenant de leur défunt chef.",
  choix: [
    { texte: "Sans hésitation, vous rengainez votre arme et vous courez vous mettre à l'abri dans le bosquet", vers: "228" }
  ]
  },
  {
  id: "250",
  texte: "Tandis que vous regardez les Kraans et leurs cavaliers disparaître dans le ciel obscurci, un grondement de tonnerre retentit audessus de Barrakeesh et roule à travers la plaine. Ce bruit inquiétant est lourd de menace, comme si la ville elle-même maudissait votre fuite. Vous vous détournez et vous concentrez votre attention sur Banedon, votre sauveur inattendu. Celui-ci est livide et le pansement de fortune qui entoure sa blessure est trempé de sang.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "377", requis: {"discipline":"guerison"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "339" }
  ]
  },
  {
  id: "251",
  texte: "Vous avez la chance de ne pas être déchiqueté par l'explosion mais cependant, la flamme bleue vous blesse à la main et au bras, puis vous projette au sol. Vous perdez 6 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous êtes toujours vivant", vers: "316" }
  ]
  },
  {
  id: "252",
  texte: "Vous écartez rapidement vos pieds de la trajectoire du métal brillant et vous manquez de peu d'être blessé par la hache qui s'enfonce de plusieurs centimètres dans le sol de pierre polie. Cependant, avant que le Garde puisse frapper à nouveau, vous vous précipitez sur lui et, d'un violent coup, vous faites tomber son arme de ses mains. L'homme pousse un cri en portant ses doigts brisés à la poitrine. Puis vous faites demi-tour et vous courez vers une porte ouverte. L'air résonne du bruit des pas lourds des Gardes du Palais qui sont désormais tous en alerte. Unis aux Drakkars, ils sont décidés à vous trouver puis à vous tuer le plus rapidement possible. Derrière la porte, un pont enjambe un jardin clos, reliant cette partie du Palais à une tour de marbre blanc, effilée comme une lance. A l'entrée du pont, un escalier étroit descend vers le jardin en contrebas.",
  choix: [
    { texte: "Si vous désirez traverser le pont pour entrer dans la tour", vers: "396" },
    { texte: "Si vous préférez descendre l'escalier pour pénétrer dans le jardin", vers: "215" }
  ]
  },
  {
  id: "253",
  texte: "Tout à coup, la douleur disparaît mais un nouveau spectacle effrayant s'offre à vos yeux : semblant surgir des ténèbres, un tourbillon de vapeurs vertes se forme lentement et, petit à petit, prend la forme d'un monstre scintillant ressemblant étrangement à un serpent. Un brouillard gris sort tout droit de la bouche du Seigneur des Ténèbres et entoure le cœur de l'horrible créature, lui insufflant son pouvoir mortel. Le serpent se tord de douleur et est secoué de convulsions au fur et à mesure que le nuage gris emplit son corps. Ce qui n'était qu'illusion il y a quelques secondes, devient à présent cauchemar vivant ! Deux petits points cramoisis brillent dans les yeux du monstre tandis qu'il ondule vers vous. DHORGAAN HABILETÉ: 20 ENDURANCE: 40 Si vous possédez une Masse d'Armes incrustée de pierreries, vous pouvez ajouter 5 points à votre total d'HABILETÉ pour toute la durée du combat, car c'est une arme magique, particulièrement efficace contre ce genre de créatures.",
  suite: "335",
  combat: { nom: "Dhorgaan", habilete: 20, endurance: 40 }
  },
  {
  id: "254",
  texte: "L'air frais vous fouette le visage tandis que vous tombez vers le lac Inrahim. Les Kraans et leurs cavaliers, le vaisseau du ciel et l'horizon lointain se mêlent pour former un véritable kaléidoscope de couleurs et vous redoutez que ce soient là les dernières images qu'il vous sera donné de voir. Vous vous êtes déjà préparé à mourir et vous vous sentez calme et paisible. Mais soudain, vous sentez que votre corps est retenu par une masse de fibres collantes, puis une secousse terrible vous coupe le souffle et vous engourdit. L'impossible se réalise : vous perdez 2 points d'ENDURANCE mais vous n'êtes plus en train de tomber, vous remontez dans les airs ! Vous avez été pris dans un filet aux cordes poisseuses, comme une mouche dans une toile d'araignée. Vous voilà soulevé dans le ciel vers le vaisseau volant aussi rapidement que vous tombiez auparavant. Soudain trois Nains barbus, vêtus de pourpoints de guerre chatoyants vous hissent sur la passerelle qui fait le tour de la coque. Mais vous n'avez guère le temps de leur témoigner votre reconnaissance car le petit vaisseau est sous le feu de l'attaque des Drakkars chevauchant les Kraans. Au bout de la passerelle, un Nain se bat à mains nues contre un Drakkar qui pousse de terribles cris. Le Nain est en train de perdre la bataille et, tandis que vous approchez pour lui prêter main-forte, un autre de ces cruels guerriers atterrit au milieu du vaisseau, en haut de la plate-forme fortifiée.",
  choix: [
    { texte: "Si vous souhaitez aider le Nain", vers: "280" },
    { texte: "Si vous préférez sauter de la passerelle sur la plateforme fortifiée", vers: "361" }
  ]
  },
  {
  id: "255",
  texte: "Tandis que le Drakkar s'effondre au sol, un Cube en Cristal noir tombe de sa poche. Si vous souhaitez prendre cet objet, placez-le dans votre poche et inscrivez-le sur votre Feuille d'Aventure dans la case des Objets Spéciaux. Soudain le cri aigu des Vordaks vous éloigne du cadavre.",
  choix: [
    { texte: "Ce cri hideux vous perce les tympans et se rapproche dangereusement", vers: "228" }
  ]
  },
  {
  id: "256",
  texte: "« Tenez, voilà ! dit Banedon en jetant une Pièce d'Or dans la sébile vide. Maintenant, êtes-vous décidée à nous aider en retour ? » La vieille porte la pièce à sa bouche puis mord dedans à pleines dents ; une fois rassurée sur l'authenticité de la pièce, elle opine du chef.",
  choix: [
    { texte: "Si vous souhaitez lui demander si elle est bien Soushilla", vers: "307" },
    { texte: "Si vous souhaitez plutôt lui demander où se trouve Tipasa le Vagabond", vers: "314" }
  ]
  },
  {
  id: "257",
  texte: "La créature vous lacère de ses griffes acérées puis vous plante son bec dans le dos. Vous vous sentez soulevé en l'air avant d'être projeté contre le mur par l'oiseau géant. Votre crâne se fracasse contre le marbre et la mort est instantanée, vous épargnant d'horribles souffrances. Votre vie et les espoirs du Sommerlund prennent fin ici.",
  fin: "mort",
  nomFin: "Fin tragique — §257"
  },
  {
  id: "258",
  texte: "Le Glaive de Sommer vibre de puissance lorsque vous le pointez vers la flamme qui s'approche rapidement en émettant un sifflement si fort qu'il couvre le bruit de la bataille. Vous vous arc-boutez en attendant l'impact. La flamme heurte le Glaive de Sommer dans un bruit de tonnerre et se fixe au bout de la lame magique en formant une boule de feu rougeoyante. Instinctivement, vous faites tourner le Glaive au-dessus de votre tête et vous lancez la boule de feu vers le ciel.",
  choix: [
    { texte: "Le Vordak hurle de terreur, mais il est trop tard et son destin est fixé : la boule de feu embrase le Zlan et son cavalier dans une gigantesque explosion, brillante comme la lumière du soleil", vers: "267" }
  ]
  },
  {
  id: "259",
  texte: "Deux flèches fendent l'air en sifflant et viennent vous frapper dans le dos. Alors qu'une douleur insupportable vous vrille le corps, vous vous évanouissez et vous tombez sur les pointes empoisonnées. Tandis que votre sang s'écoule à flots, le dernier bruit que vous entendez est le rire hideux et sarcastique du Seigneur des Ténèbres Haakon s'élevant au-dessus des hurlements macabres de ses cruels guerriers Drakkars. Votre vie s'achève ici et tous les espoirs pour la survie du Sommerlund sont désormais anéantis.",
  fin: "mort",
  nomFin: "Fin tragique — §259"
  },
  {
  id: "260",
  texte: "Après avoir rassemblé et revêtu les divers éléments de l'équipement spécial pour les fouilles, vous avancez discrètement vers la sentinelle et vous videz la Teinture dans la cruche d'eau placée à ses pieds. Quelques instants plus tard, l'homme se penche pour saisir la cruche puis en avale quelques gorgées. L'effet ne se fait pas attendre : le Garde se sent tout à coup très mal.",
  choix: [
    { texte: "Tandis qu'il titube en arrière, vous vous glissez dans le Tombeau sans être repéré", vers: "395" }
  ]
  },
  {
  id: "261",
  texte: "Vous tombez en avant, la vue troublée par une myriade de couleurs. Les Kraans et leurs cavaliers, le vaisseau de l'espace et l'horizon lointain se mélangent pour former un véritable kaléiodoscope. Voici les dernières images qu'il vous est donné de voir avant que vous ne vous écrasiez sur la terre nue et desséchée du lac Inrahim. Votre vie se termine ici et tous les espoirs pour le Sommerlund aussi.",
  fin: "mort",
  nomFin: "Fin tragique — §261"
  },
  {
  id: "262",
  texte: "Vous avez été repéré ; le Vordak pousse un cri horrible et suraigu, puis pointe un doigt osseux en direction de votre cachette. Les Drakkars se jettent dans les broussailles, se frayant un chemin à l'aide de leurs épées noires.",
  choix: [
    { texte: "Si vous souhaitez tirer votre arme et vous préparer à les affronter", vers: "212" },
    { texte: "Si vous préférez les fuir", vers: "393" }
  ]
  },
  {
  id: "263",
  texte: "La vieille décrépite s'enfonce en clopinant dans l'allée sombre tandis que Banedon et vous rebroussez chemin vers le monolithe de l'aigle en haut duquel se trouve une flèche pointée vers l'ouest et tournée vers la place principale.",
  choix: [
    { texte: "Les ombres crépusculaires s'allongent alors que vous quittez le monolithe de l'aigle à nouveau", vers: "216" }
  ]
  },
  {
  id: "264",
  texte: "Tout à coup, un son suraigu éclate au-dessus du mugissement du vent, vous faisant terriblement souffrir de la tête. Vous êtes attaqué par une puissante force psychique. A moins que vous ne maîtrisez la Discipline Kaï du Bouclier Psychique, diminuez de 2 points votre total actuel d'ENDURANCE. L'Itikar frissonne, puis secoue frénétiquement la tête de gauche à droite lorsque le bruit strident retentit à nouveau : le grand oiseau agonise, détruit par l'explosion psychique. Tandis que vous regardez par-dessus votre épaule, vous apercevez, l'estomac noué par la peur, un Kraan qui fond sur vous pour vous attaquer. Il porte sur son dos un adversaire de taille : un Vordak, un des redoutables morts vivants dont les Seigneurs des Ténèbres ont fait leurs lieutenants. Au moment où le Kraan se précipite sur vous, le Vordak étend ses bras revêtus de rouge puis saute de la selle. Il atterrit juste derrière vous, sur le dos de l'Itikar, ses doigts de squelette profondément enfoncés dans la chair hérissée de plumes de votre monture. Le choc vous projette en avant et vous contraint à lâcher ses rênes. L'oiseau géant, horrifié, hurle de douleur et de peur lorsque la prise du Vordak lui paralyse la colonne vertébrale. Vous devez réagir rapidement, car l'Itikar tombe comme une pierre vers la plaine salée du lac Inrahim.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "315" },
    { texte: "Si vous ne possédez pas cet Objet Spécial", vers: "299" }
  ]
  },
  {
  id: "265",
  texte: "Elle refuse de prononcer le moindre mot avant que vous n'ayez déposé un peu d'argent dans sa sébile.",
  choix: [
    { texte: "Si vous désirez lui faire l'aumône d'une Pièce d'Or, notez-le sur votre Feuille d'Aventure, et", vers: "397" },
    { texte: "Si vous ne souhaitez pas, ou si vous ne pouvez pas lui donner une Pièce d'Or", vers: "256" }
  ]
  },
  {
  id: "266",
  texte: "Votre maîtrise Kaï vous avertit que deux Gardes du Palais sont en train de gravir rapidement les marches de l'escalier en colimaçon qui part de la salle de Garde située au pied de la tour.",
  choix: [
    { texte: "Rapidement, vous grimpez l'escalier avant que les Drakkars n'entrent et ne voient dans quelle direction vous êtes parti", vers: "322" }
  ]
  },
  {
  id: "267",
  texte: "Les Drakkars chancellent, aveuglés par l'éclair. Norlim profite de l'occasion pour pousser ses compagnons à résister aux envahisseurs, menant l'attaque de sa puissante hache de guerre, affûtée comme un rasoir. La hache fend l'air en sifflant et vient frapper les armures noires de l'ennemi en faisant jaillir des gerbes d'étincelles, causant des ravages dans leurs rangs clairsemés, comme une faux coupant des blés mûrs. Vous regrimpez sur la plate-forme et vous voyez un Drakkar sur le point de frapper Banedon. Loin d'être impressionné par le guerrier mugissant qui menace de le décapiter avec son épée noire à double tranchant, le jeune magicien pointe son doigt vers le Drakkar prêt à frapper.",
  choix: [
    { texte: "Si vous souhaitez attaquer le Drakkar avant qu'il ne touche Banedon à la tête", vers: "330" },
    { texte: "Si vous ne souhaitez pas intervenir", vers: "394" }
  ]
  },
  {
  id: "268",
  texte: "Tel un tigre, vous vous élancez et vous saisissez la pierre étincelante une fraction de seconde avant que le poing clouté de Haakon ne frappe le sol à l'endroit où se trouve le bijou. Vous vous retournez pour faire face à votre ennemi, la gemme brandie dans votre main, son rayon bleu brillant jaillissant vers l'armure noire du Seigneur des Ténèbres. Celui-ci se plie en deux, sous l'effet du rayon, puis il tombe à genoux alors qu'un horrible bruit d'aspiration s'élève de son heaume. Peu à peu, Haakon se recroqueville et disparaît à vos yeux. Un craquement soudain vous met en alerte, mais vous n'êtes plus en danger : la gemme éclatante a disparu de votre main ; comme son maître, elle a quitté cette dimension pour ne plus jamais y revenir.",
  choix: [
    { texte: "A présent", vers: "400" }
  ]
  },
  {
  id: "269",
  texte: "Vous fixez le verrou dans l'intention de le faire bouger derrière vous un bruit de pas pressés vous fait parcourir un frisson dans le dos car vous réalisez que les Drakkars sont en train de se ruer dans l'escalier. C'est alors que le verrou comme à bouger lentement.",
  choix: [
    { texte: "Dès qu'il se trouve suffisamment tiré, vous ouvrez le portail de pierre et vous vous élancez, inconscient des dangers qui vous attendent derrière", vers: "352" }
  ]
  },
  {
  id: "270",
  texte: "Vous courez dans la grotte dont le sol est recouvert de cailloux, impatient de vous éloigner au plus vite du vieillard contaminé. Les terribles histoires que vous avez entendues au sujet de la lèpre vous font fuir sans aucune prudence et vous perdez deux objets de votre Sac à Dos dans votre course folle.",
  choix: [
    { texte: "Choisissez-en deux que vous rayerez ensuite de votre Feuille d'Aventure. (Si vous n'avez pas d'objets dans votre Sac à Dos, vous perdez, à la place, une Arme et un Objet Spécial.)", vers: "241" }
  ]
  },
  {
  id: "271",
  texte: "Le cavalier du Kraan passe en criant sur votre gauche, mais vous réussissez à le dévier de sa trajectoire par une rapide contreattaque. Votre adversaire est à présent à plusieurs mètres en dessous de vous, mais il fait effectuer à son Kraan un rapide demi-tour pour passer de nouveau à l'attaque. Vous tournez vers le sud pour éviter d'être pris entre les deux escadrons de Kraans qui convergent vers vous. Votre brusque changement de direction a augmenté la distance entre vous et vos poursuivants, mais l'Itikar est grièvement blessé et, de plus, terrifié par les cris stridents des Kraans. Vous perdez pratiquement tout espoir, car votre monture perd beaucoup de sang et elle peut, d'un instant à l'autre, sombrer dans l'inconscience et vous laisser tomber comme une pierre dans le ciel obscurci.",
  choix: [
    { texte: "Soudain, vous apercevez quelque chose dans le lointain : une vision qui vous fait croire aux miracles", vers: "221" }
  ]
  },
  {
  id: "272",
  texte: "Vous suivez un sentier qui longe le lit, maintenant asséché, d'une vieille rivière qui jadis coulait à travers les montagnes. Une brise soulève des tourbillons de poussière rouge le long des rives de terre aride et stérile. Les bâtisses aux murs blancs d'Ikaresh apparaissent soudain et, tandis que la poussière retombe lentement, vous vous retrouvez sur une place près du porche grand ouvert de la porte est de la ville. Sur un grand monolithe en basalte, planté au milieu de la place, se trouve un aigle en bronze, emblème de cette ville de montagne. Dans son bec, le rapace tient trois flèches indiquant chacune une direction différente pour sortir de la place.",
  choix: [
    { texte: "Si vous souhaitez aller au nord vers le marché aux Douggas", vers: "376" },
    { texte: "Si vous préférez aller à l'ouest, vers la place principale", vers: "216" },
    { texte: "Si vous souhaitez aller vers le sud en prenant l'avenue des Aigles", vers: "342" }
  ]
  },
  {
  id: "273",
  texte: "L'Akataz vous saute au visage et, sous la violence du choc, vous tombez à la renverse. Vous essayez de vous relever, mais le chien vous mord à l'épaule et vous avez le souffle coupé pendant quelques instants. (Vous perdez 1 point d'ENDURANCE.) Finalement, vous parvenez, par un puissant coup de pied, à l'envoyer rouler au bas des marches. Il s'écrase en hurlant sur le sol de marbre du Palais inférieur. Vous sautez sur vos pieds et vous tirez votre arme car les Drakkars courent à présent vers vous. Un terrible hurlement de haine et de rage emplit le hall : « Tuez-le ! » Les Drakkars dégainent leurs épées noires, impatients d'obéir à l'ordre de leur maître. Ils vous attaquent tous ensemble. DRAKKARS HABILETÉ: 18 ENDURANCE: 35 Vous pouvez interrompre le combat à tout moment en courant vers le passage voisin.",
  choix: [
    { texte: "Si vous souhaitez fuir la bataille", vers: "238" },
    { texte: "Si vous remportez le combat", vers: "345" }
  ],
  combat: { nom: "Drakkars", habilete: 18, endurance: 35 }
  },
  {
  id: "274",
  texte: "Banedon brandit un anneau en argent étincelant sous le nez du marchand, en lui disant : « Il est à vous, mon ami, si vous me dîtes où l'on peut trouver Tipasa. » Le marchand s'empare de l'anneau puis répond en bredouillant : « Prenez la première allée après le marché ; Tipasa habite la maison à la porte bleue. » Vous traversez rapidement la place du marché, pleine de monde à cette heure-ci, puis vous vous engagez dans la ruelle que l'on vient de vous indiquer. Soudain, vous entendez un grand cri de dépit s'élever au-dessus du vacarme de la foule : c'est le marchand qui manifeste sa déception, car après avoir placé l'anneau à son doigt, ce dernier s'est littéralement volatilisé !",
  choix: [
    { texte: "Au bout de l'allée, vous apercevez la maison à la porte bleue", vers: "206" }
  ]
  },
  {
  id: "275",
  texte: "Vous reconnaissez le drapeau qui flotte au-dessus d'une plateforme fortifiée, située au centre de cet étrange vaisseau. 11 s'agit de la bannière de la guilde des Magiciens de Toran, une ville du nord du Som-merlund, portant comme emblème un croissant et une étoile de cristal. Le vaisseau de l'espace est commandé par un magicien Sommerlundois, un de vos compatriotes. Il a de longs cheveux blonds et est vêtu d'un habit bleu foncé. Vous êtes tellement frappé par cette extraordinaire apparition, que vous ne voyez même pas le sang qui coule de la bouche de votre Itikar. En effet, la créature est toute proche de la mort et pousse soudain un long croassement qui vous fend le cœur. Puis ses ailes se raidissent et sa tête tombe mollement en avant tandis que le dernier souffle de vie s'échappe de son corps meurtri. Vous êtes violemment projeté à bas de la selle et vous tombez comme une pierre, l'estomac noué, vers le lac Inrahim. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "374", texte: "Si vous avez tiré un chiffre entre 0 et 4," },
        "5-8": { vers: "254", texte: "Si vous avez tiré un chiffre entre 5 et 8," },
        "9-9": { vers: "261", texte: "Si vous avez tiré un 9," }
      }
      }
  },
  {
  id: "276",
  texte: "« Pourquoi me demandez-vous cela ? rétorque-t-elle d'une voix soupçonneuse tout en clignant des yeux pour sécher ses larmes. Quel genre d'affaires voulez-vous traiter avec le vieux Tipasa ? » « C'est un ami », répond Banedon en posant une Pièce d'Or sur le comptoir de la taverne. Aussitôt, la vieille femme recouvre la pièce de sa main avec un expression de malice et de convoitise. « Soushilla est vieille, sa mémoire n'est plus très bonne », dit-elle en fixant du regard la bourse de Banedon. Celui-ci tire sur les cordons pour sortir une autre pièce mais sa bourse a été vidée par un habile pickpocket et elle ne contient plus la moindre pièce ! Banedon devient rouge comme une pivoine et, tout penaud, évite votre regard narquois. «Cinq Pièces d'Or pourraient me rafraîchir la mémoire », reprend la vieille en s'adressant à vous cette fois-ci.",
  choix: [
    { texte: "Si vous souhaitez lui donner les 5 Pièces d'Or qu'elle réclame, déduisez-les sur votre Feuille d'Aventure puis", vers: "326" },
    { texte: "Si vous n'avez pas les moyens de la payer ou si vous ne le souhaitez pas, quittez la taverne et", vers: "202" }
  ]
  },
  {
  id: "277",
  texte: "Vous vous accroupissez le plus possible en attendant que la chance vous sourie pour vous précipiter sur la porte. Des flèches, de plus en plus nombreuses, viennent rebondir sur le mur et le parapet. Les Drakkars se ruent dans l'escalier et le bruit de leurs bottes ferrées vous glace d'effroi. C'est le moment ou jamais : vous vous relevez rapidement, puis vous courez vers la porte en tirant le gros verrou en fer d'une main tremblante. Un projectile à pointe d'acier fait éclater une pierre à quelques centimètres de votre main et une flèche, après avoir rebondi sur le mur, vous fait une entaille juste au-dessus de l'œil.",
  choix: [
    { texte: "Une fois le verrou tiré vous poussez la porte en pierre et vous vous précipitez, inconscient des dangers qui vous attendent derrière", vers: "352" }
  ]
  },
  {
  id: "278",
  texte: "Vous courez, courbé en deux, vers votre Glaive que vous saisissez par la garde, puis vous vous élancez rapidement pour vous mettre à l'abri derrière un autre pilier. Soudain, un éclair jaillit du poing du Seigneur des Ténèbres et vient exploser à la base de la colonne derrière laquelle vous êtes caché. Le pilier s'effondre dans un fracas assourdissant et la violence de la déflagration vous projette en arrière. Le rire cruel d'Haakon s'élève au-dessus du bruit des pierres qui s'écrasent au sol et une douleur atroce vous vrille le crâne.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Bouclier Psychique", vers: "223", requis: {"discipline":"bouclier-psychique"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "379" }
  ]
  },
  {
  id: "279",
  texte: "Un étroit couloir s'ouvre devant vous, éclairé par la lumière orangée du soleil couchant qui pénètre dans les lieux par de petites fenêtres ouvertes situées en haut des parois ornementées. L'air résonne de bruits de pas hâtifs, car le grand Palais est en alerte générale. Les Gardes du Palais et les sauvages Drakkars sont tous à votre recherche et ils sont bien déterminés à vous trouver puis à vous tuer, car leur propre vie sera menacée en cas d'échec. Vous arrivez à une porte qui s'ouvre sur un balcon extérieur. Des marches descendent vers un pont qui relie le Palais principal à une haute tour de marbre blanc. L'escalier luimême continue au-delà du pont, puis disparaît vers les jardins du Palais situés en contrebas. Vous n'apercevez aucun soldat sur le pont ni dans les jardins.",
  choix: [
    { texte: "Si vous souhaitez descendre sur le pont puis entrer dans la tour de marbre", vers: "396" },
    { texte: "Si vous souhaitez passer le pont puis descendre l'escalier vers les jardins du Palais", vers: "215" }
  ]
  },
  {
  id: "280",
  texte: "Le Drakkar est en train d'étrangler le Nain. Lorsqu'il vous aperçoit, il relâche sa prise, puis écrase son poing ganté de fer sur la figure du Nain qui s'écroule au sol. Ce meurtre de sang-froid vous fait bouillonner d'indignation et de rage ! Vous tirez votre arme et vous passez aussitôt à l'attaque : DRAKKAR HABILETÉ: 18 ENDURANCE: 25 La rapidité de votre attaque vous permet de ne déduire aucun point d'ENDURANCE pendant le premier Assaut.",
  suite: "213",
  combat: { nom: "Drakkar", habilete: 18, endurance: 25 }
  },
  {
  id: "281",
  texte: "Alors que vous vous apprêtez à partir, le lépreux vous fait signe d'attendre ; d'un vieux tas de chiffons qui se trouve sous le pont, il extrait une massue incrustée de pierreries. L'arme est en argent massif et son manche est orné d'émeraudes et de diamants. « Prenez cela, je vous en conjure, en signe de ma reconnaissance éternelle. » Si vous souhaitez accepter ce présent, notez cette Masse d'Armes incrustée sur votre Feuille d'Aventure dans la case des Objets Spéciaux. Vous la porterez accrochée à votre ceinture avant de quitter la grotte.",
  choix: [
    { texte: "Puis", vers: "241" }
  ]
  },
  {
  id: "282",
  texte: "Vous quittez le beffroi et vous descendez vers la sentinelle. Il vous est tout d'abord facile de progresser, tout en restant caché, en passant de tourelle en tourelle, mais pour les trente derniers mètres vous serez à découvert, car la plate-forme d'atterrissage et le toit du Palais sont reliés par une passerelle exposée à la vue de tout le monde. Si vous décidez de neutraliser la sentinelle, vous devrez traverser la passerelle sans vous faire remarquer. Si vous ne possédez pas cette Discipline, utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Camouflage, ou bien la Discipline Kaï de la Chasse, ajoutez 2 points au chiffre que vous avez tiré. Si vous avez le titre de Guerrier Kaï (ou un rang plus élevé), ajoutez 3 points au chiffre que vous avez tiré.",
  choix: [
    { texte: "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière", vers: "295", requis: {"discipline":"maitrise-matiere"} }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "357", texte: "Si le résultat obtenu est compris entre 0 et 4," },
        "5-5": { vers: "389", texte: "Si ce même résultat est supérieur ou égal à 5," }
      }
      }
  },
  {
  id: "283",
  texte: "Les Nains ne s'offusquent pas de votre refus car ils ont déjà vu des hommes rendus fous furieux, ou même tomber en syncope, après avoir bu une chope de bière de Bor. Nolrim saisit la chope, la vide d'un trait puis, du revers de la main, il essuie la mousse qui est restée accrochée aux poils de sa barbe rousse.",
  choix: [
    { texte: "Si vous désirez demander aux Nains comment ils se sont retrouvés sous le commandement de Banedon", vers: "291" },
    { texte: "Si vous préférez prendre congé d'eux en leur souhaitant bonne nuit", vers: "359" }
  ]
  },
  {
  id: "284",
  texte: "Vous leur criez d'arrêter, mais votre accent vous trahit et confirme leurs soupçons : vous devez en effet être un espion. Vous recevez une pierre jetée à toute volée en plein front. Vous perdez 3 points d'ENDURANCE. « Cours, Loup Solitaire ! crie Banedon, sinon ils vont te mettre en pièces ! » Peu à peu, les hommes se rapprochent et vous comprenez à la lueur de férocité qui brille dans leurs yeux que ce serait folie de rester sur place.",
  choix: [
    { texte: "Vous vous retournez donc et vous détalez le plus vite possible", vers: "340" }
  ]
  },
  {
  id: "285",
  texte: "Tandis que vous fuyez à toutes jambes, un mugissement de haine et de rage emplit le hall. « Tuez-le ! » En jetant un bref coup d'ceil par-dessus votre épaule, vous voyez que les Drakkars sont en train de dégainer leurs noires épées, impatients d'exécuter les ordres de leur maître. Vous dévalez alors rapidement les quelques marches qui descendent sous un porche, puis vous longez un balcon qui surplombe le Palais inférieur. L'Akataz vous a presque rejoint et vous pouvez sentir son haleine fétide sur vos jambes. Mais, à l'instant même où il se jette sur vous, vous faites instinctivement un saut de côté et l'animal va s'écraser la gueule la première sur un pilier de marbre. Vous bondissez pour lui donner le coup de grâce et l'Akataz laisse échapper un long râle de douleur : il n'attaquera plus jamais. C'est alors que vous apercevez la silhouette inquiétante du Seigneur des Ténèbres Haakon dans le hall du bas, brandissant son poing clouté. Par ailleurs, semblant surgir de nulle part, un Drakkar s'avance en levant son épée au-dessus de son heaume à tête de mort. Soudain, dans un sifflement assourdissant, un éclair bleu jaillit d'une petite pierre que le Seigneur des Ténèbres tient à la main. Son rayon se dirige droit sur vous. Simultanément, le Drakkar s'élance et parvient à vous blesser au bras (vous perdez 2 points d'ENDURANCE). Mais il se trouve maintenant sur la trajectoire du rayon. En un éclair, le Drakkar disparaît, ne laissant de lui que des cendres et une odeur âcre de chair brûlée. Au bout du balcon se trouvent une autre arche et un escalier.",
  choix: [
    { texte: "Si vous souhaitez vous évader par l'arche", vers: "381" },
    { texte: "Si vous préférez vous échapper par l'escalier", vers: "317" }
  ]
  },
  {
  id: "286",
  texte: "Alors que la nuit tombe, vous entamez votre mission désespérée. Les Giaks ne posent pratiquement pas de problème que vous ne puissiez résoudre grâce à vos qualités de Guerrier, car ils sont épuisés. Seuls les Drakkars montrent quelques signes de vigilance mais, là encore, ils sont moins d'une douzaine à patrouiller dans tout le cratère. Ce n'est donc pas avant d'avoir atteint l'entrée principale du Tombeau que vous rencontrerez de réelles difficultés. Non loin de vous, un Drakkar monte la garde ; ses yeux cruels brillent derrière son masque à tête de mort en fer mais, de temps à autre, il relâche son attention pour aller prendre un peu d'eau dans une cruche.",
  choix: [
    { texte: "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière", vers: "214", requis: {"discipline":"maitrise-matiere"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "239" }
  ]
  },
  {
  id: "287",
  texte: "Les Itikars sont par nature des créatures farouches et malicieuses, et un cavalier peut mettre des années à apprivoiser et dresser l'un de ces gigantesques oiseaux. Mais une fois domptés, ceux-ci se révèlent des créatures douces et fidèles. L'Itikar sent que vous n'êtes pas son maître et tente de vous repousser d'un violent coup de bec. Vous perdez 1 point d'ENDURANCE. Néanmoins, grâce à la seule force de votre volonté, vous parvenez à grimper sur la selle et à soumettre la créature qui tourne la tête et vous fixe l'oeil noir et froid, mais dénué à présent de toute hostilité.",
  choix: [
    { texte: "Soudain, vous voyez les Drakkars courir sur la passerelle et vous vous penchez en avant pour détacher la corde accrochée au pommeau de la selle avant de saisir les épaisses rênes de cuir", vers: "343" }
  ]
  },
  {
  id: "288",
  texte: "Le Drakkar vous maudit en exhalant son dernier souffle, puis il tombe de la plate-forme, son douloureux cri d'agonie se perdant dans l'espace. Vous vous précipitez pour aider votre compatriote blessé, mais la bataille n'est pas encore terminée. Un cavalier sur sa monture Kraan fond sur vous, une arbalète pointée vers votre tête. Il vous décoche un carreau qui file droit vers votre visage mais, tout à coup, un bruit aigu et métallique résonne à vos oreilles, tandis que la flèche rebondit au loin comme par miracle après avoir ricoché sur un bouclier invisible.",
  choix: [
    { texte: "Si vous possédez le Pendentif à l'Étoile de Cristal", vers: "399" },
    { texte: "Si vous ne possédez pas cet Objet Spécial", vers: "294" }
  ]
  },
  {
  id: "289",
  texte: "Le trône commence à tourner. Un terrible hurlement parvient à vos oreilles puis se change presque instantanément en une série de grognements rauques évoquant une langue dure et gutturale que vous n'avez jamais entendue auparavant. Des mots et des bruits, tels qu'une bouche humaine jamais n'articula, roulent à travers la pièce comme des éclats de tonnerre. C'est le langage noir parlé par Haakon, Seigneur d'Aarnak et Seigneur des Ténèbres d'Helgedad. Tandis qu'il se lève lentement du trône, la voix sépulcrale, surnaturelle, sortant de sa bouche, continue à retentir. Il tient au creux de sa main gantée une pierre étincelante. Une petite flamme bleue est retenue en son cœur. Brusquement, le langage d'Haakon se transforme et vous pouvez entendre une langue qui vous est familière : le langage du Sommerlund! «Ton heure est venue, Seigneur Kaï ! » Soudain, un craquement assourdissant retentit: une redoutable puissance est en train de naître! En effet, quelques secondes plus tard, un tourbillon de flammes bleues se dirige vers votre tête.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "311" },
    { texte: "Si vous ne possédez pas cet Objet Spécial", vers: "219" }
  ]
  },
  {
  id: "290",
  texte: "Vous fouillez le corps du chef des Drakkars, et vous découvrez dans sa poche un Cube en Cristal noir. Si vous souhaitez garder ce Cube en Cristal noir, mettez-le dans votre poche, et notez-le sur votre Feuille d'Aventure dans la case des Objets Spéciaux.",
  choix: [
    { texte: "Le bruit d'autres Drakkars descendant l'escalier de la tour vient interrompre vos recherches et vous vous précipitez vers la porte en bois", vers: "246" }
  ]
  },
  {
  id: "291",
  texte: "Vous apprenez que les Nains formaient jadis l'équipage d'un vaisseau beaucoup plus conventionnel appartenant à un riche armateur dont les bateaux sillonnaient les Tentarias, du sud du Magnamund. Les Tentarias regroupent des milliers de lacs et d'archipels qui forment une sorte de canal étendu sur plusieurs milliers de kilomètres. Ils furent formés, ainsi que le Rymerift de Durenor, par un gigantesque glissement de terrain. Il y a trois ans, le précédent capitaine des Nains, un Nain appelé Quan, perdit son bateau, son chargement et son équipage en jouant aux cartes. Il semble que l'infortuné capitaine n'ait été au courant de la véritable profession de Banedon que bien trop tard ! C'est ainsi que Banedon devint le capitaine des Nains, et depuis ils ont vécu ensemble de nombreuses aventures sous les cieux du sud du Magnamund. La Nef du ciel, quant à elle, fut donnée à Banedon par les magiciens de Dessi en récompense de son aide précieuse qui contribua largement à la défaite du Gagadoth, une créature monstrueuse qui terrorisait leur pays et que leur propre sorcellerie ne parvenait pas à maîtriser. La Nef du ciel faisait route de Dessi à Barrakeesh lorsque vous fîtes votre apparition.",
  choix: [
    { texte: "Les Nains n'ont pas perdu un mot de votre conversation avec Banedon et ils sont tout excités à l'idée d'une nouvelle aventure, apparemment inconscients des dangers qui les attendent", vers: "359" }
  ]
  },
  {
  id: "292",
  texte: "Vos connaissances Kaï vous indiquent que la maison située au bout de l'allée est la demeure de Tipasa.",
  choix: [
    { texte: "Vous faites signe à Banedon de vous suivre, tandis que vous approchez de la porte bleue", vers: "206" }
  ]
  },
  {
  id: "293",
  titre: "Mort — §293",
  texte: "Pendant un instant, vous avez l'impression d'être en état d'apesanteur : vous tombez et tournoyez dans le vide, totalement inconscient des mouvements de votre corps. Vous essayez bien de crier, mais vos cris sont emportés au loin par le vent. Soudain, vous heurtez les plus hautes branches d'un arbre. Vous êtes assommé par la violence du choc et votre corps se paralyse. Vous êtes passé de vie à trépas avant même que les Drakkars ne découvrent votre corps disloqué. Vous perdez la vie ici, et le Somerlund perd, lui, tout espoir de paix.",
  fin: "mort",
  nomFin: "Fin tragique — §293 (chute du ciel)"
  },
  {
  id: "294",
  texte: "Vous apercevez le jeune magicien qui abaisse son bâton, un pâle sourire éclairant son visage marqué par la douleur. « Hélas, je n'ai pas été assez vif pour me protéger également », dit-il d'une voix lasse tandis que vous vous agenouillez à côté de lui et que vous arrachez la lance qui le cloue au sol. La blessure est sérieuse et vous vous empressez de la panser avec des bouts de tissu arrachés à son habit bleu foncé. C'est alors que le sorcier se présente. «Je m'appelle Banedon, chef d'expédition de la guilde de l'Étoile de Cristal, dit-il d'une voix faible et tremblante. Quant à vous, vous n'avez pas besoin de vous présenter, Loup Solitaire, car vous êtes le seul à pouvoir attirer de telles créatures si loin de chez elles. » Puis il regarde, tout autour du vaisseau du ciel, les cavaliers qui chevauchent les Kraans. « Aidez-moi à me relever. Nous devons fuir avant qu'ils ne nous forcent à atterrir. » Vous soulevez le sorcier qui s'empare aussitôt du gouvernail du bateau: une sphère de cristal étincelante aux multiples facettes, plantée au bout d'une mince baguette d'argent.",
  choix: [
    { texte: "A peine sa main a-t-elle effleuré le cristal qu'il se produit une immense explosion", vers: "323" }
  ]
  },
  {
  id: "295",
  texte: "Concentrant toute votre volonté sur la bourse qui est accrochée à la ceinture de la sentinelle, vous essayez d'en dénouer les cordons de cuir. Quelques secondes plus tard, la bourse tombe sur le sol en répandant tout son contenu. Le Garde pousse un cri en voyant son or rouler par-dessus le bord de la plate-forme et se met précipitamment à genoux pour ramasser le peu qui reste.",
  choix: [
    { texte: "Tandis qu'il vous tourne le dos, vous vous élancez à découvert pour traverser la passerelle", vers: "236" }
  ]
  },
  {
  id: "296",
  texte: "A l'intérieur, l'auberge est pleine d'autochtones assis à de petites tables de pierre. Des narguilés finement ouvragés ajoutent à l'atmosphère colorée des lieux, tandis que les fumeurs discutent à bâtons rompus de toutes sortes de sujets. Un trio bruyant se lamente de la mort du vieux Zakhan, tandis que d'autres font des reproches au nouveau souverain, le traitant de bœuf, de brute, et autres qualificatifs peu flatteurs. A votre avis, ils expriment trop fort leurs opinions... Deux Ikareshis à la mine sévère vous font un signe de bienvenue puis vous invitent à partager leurs pipes.",
  choix: [
    { texte: "Si vous souhaitez accepter leur offre", vers: "362" },
    { texte: "Si vous préférez la décliner, vous pouvez quitter l'auberge et continuer à remonter l'avenue 3", vers: "388" }
  ]
  },
  {
  id: "297",
  texte: "Les Gardes sont les premiers à se remettre de la surprise de cette rencontre. Ils passent à l'attaque, vous blessant grièvement à la poitrine. Vous perdez 4 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous êtes toujours en vie et si vous souhaitez vous battre avec les Gardes", vers: "334" },
    { texte: "Si vous voulez tenter de vous échapper en remontant rapidement l'escalier", vers: "209" }
  ]
  },
  {
  id: "298",
  texte: "Vous vous demandez si vous devez forcer la porte, lorsque vous entendez soudain les pierres frotter lentement l'une contre l'autre. La porte coulisse lentement et vous pénétrez dans une grande pièce faiblement éclairée. Derrière vous, la porte se referme à une vitesse déconcertante ! Malgré l'obscurité, vous distinguez de nombreuses empreintes de pas dans l'épaisse couche de poussière qui recouvre le sol de marbre.",
  choix: [
    { texte: "Vous remarquez en entrant qu'un trône en pierre se dresse au centre de la pièce, face au mur du fond", vers: "289" }
  ]
  },
  {
  id: "299",
  texte: "Le Vordak retire ses doigts osseux, dégoulinants de sang, du dos de l'Itikar puis il saisit la masse d'armes de métal noir accrochée à sa ceinture. Il lève l'arme au-dessus de sa tête, prêt à vous l'écraser violemment sur le crâne. Vous ne pouvez éviter son attaque et vous devez combattre la créature jusqu'à ce que mort s'ensuive. VORDAK HABILETÉ: 17 ENDURANCE: 25 A moins que vous ne maîtrisiez la Discipline du Bouclier Psychique, réduisez de 2 points votre total d'HABILETÉ, car le Vordak est en train d'utiliser son pouvoir psychique. En revanche, il est insensible à la puissance psychique dont vous pourriez vous servir contre lui.",
  suite: "203",
  combat: { nom: "Vordak", habilete: 17, endurance: 25, immunisePsychique: true }
  },
  {
  id: "300",
  texte: "Vous êtes réveillé peu après le lever du soleil par les ronflements des Nains et le bourdonnement grave qu'émet la Nef du ciel. Vous rassemblez votre équipement, puis vous grimpez sur le pont. Tout est plongé dans l'obscurité car la Nef du ciel est en train de planer juste en dessous d'un énorme rocher de grès qui s'avance en saillie du flanc de la montagne, à des centaines de mètres au-dessus de la vallée. Banedon est toujours à la barre, mais il n'est plus en transes. « Des Kraans ! crie-t-il tout à coup, en pointant l'index vers la vallée écrasée de soleil, par-delà l'ombre projetée par le rocher. Ils arrivent avec l'aube. » Vous contemplez cet étrange paysage, un plateau montagneux fantastique, profondément encaissé, d'où s'élèvent d'énormes rochers qui forment de véritables colonnes rocheuses dont l'équilibre semble très précaire. Les Vassagoniens appellent cet endroit les Foos, c'est-à-dire les Aiguilles. Ces colonnes de pierre s'élancent si haut que vous avez l'impression qu'elles vont s'écrouler d'une minute à l'autre. Perchés sur ces cheminées de pierre, vous apercevez des Kraans et, debout à côté d'eux, des Drakkars qui scrutent la vallée avec des longues-vues. Ils restent ainsi plus d'une heure, puis ils s'envolent dans les airs et disparaissent. « Hissez la grand-voile ! » ordonne Banedon d'une voix tout juste audible dans le vacarme assourdissant que fait la Nef du ciel en vrombissant. « Nous devons fuir rapidement et une longue course nous attend. »",
  choix: [
    { texte: "Si vous possédez un Cube de Cristal noir", vers: "229" },
    { texte: "Si vous ne possédez pas cet Objet Spécial", vers: "247" }
  ]
  }
];
