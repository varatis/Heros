import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 02 — La Traversée Infernale
 * Paragraphes 180 à 269. Fichier GÉNÉRÉ par
 * scripts/ls02-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls02-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_180_269: StorySection[] = [
  {
  id: "180",
  texte: "Vous arrivez à la conclusion que les marins du bateau sont aveugles ou qu'ils n'ont pas la moindre intention de vous porter secours. En effet, le bateau de pêche poursuit sa course et disparaît bientôt à l'horizon sans s'occuper de vous.",
  choix: [
    { texte: "En désespoir de cause, vous arrachez une planche du panneau d'écoutille et vous vous en servez comme d'une rame pour pagayer en direction de la côte", vers: "337" }
  ]
  },
  {
  id: "181",
  texte: "Cette rue est encore plus sale et nauséabonde que celle que vous venez de quitter. Bientôt, cependant, la vitrine en désordre d'une boutique attire votre attention; vous y découvrez en effet plusieurs objets qui pourraient vous être fort utiles ; chacun de ces objets porte une étiquette qui indique son prix. Epée 4 Couronnes Poignard 2 Couronnes Sabre 3 Couronnes Marteau de guerre 6 Couronnes Lance 5 Couronnes Masse d'Armes 4 Couronnes Couverture de fourrure 3 Couronnes Sac à Dos 1 Couronne Vous pouvez entrer dans cette boutique et acheter ce qui vous plaira. N'oubliez pas d'inscrire vos achats éventuels sur votre Feuille d'Aventure et de déduire de votre capital le prix que vous aurez payé. Lorsque vous avez terminé vos emplettes, vous poursuivez votre chemin le long de la rue du Sage en direction du pont de Ragadorn. Ce pont est le seul point de passage entre les parties Est et Ouest de la ville ; il est toujours bondé et il vous faut jouer des coudes pour parvenir à le traverser parmi la foule qui s'y presse.",
  choix: [
    { texte: "Faire des emplettes dans cette boutique", vers: "181-a" },
    { texte: "Poursuivre votre chemin sans rien acheter", vers: "186" }
  ]
  },
  {
  id: "181-a",
  titre: "La boutique de la rue du Sage",
  texte: "L'étiquette de chaque objet indique son prix : Épée 4 Couronnes · Poignard 2 Couronnes · Sabre 3 Couronnes · Marteau de guerre 6 Couronnes · Lance 5 Couronnes · Masse d'Armes 4 Couronnes · Couverture de fourrure 3 Couronnes · Sac à Dos 1 Couronne. N'oubliez pas d'inscrire vos achats éventuels sur votre Feuille d'Aventure et de déduire de votre capital le prix que vous aurez payé.",
  choix: [
    { texte: "Acheter une Épée (4 PO)", vers: "181-a", requis: {"or":4}, effets: { or: -4, objets: [{"id":"epee"}] } },
    { texte: "Acheter un Poignard (2 PO)", vers: "181-a", requis: {"or":2}, effets: { or: -2, objets: [{"id":"poignard"}] } },
    { texte: "Acheter un Sabre (3 PO)", vers: "181-a", requis: {"or":3}, effets: { or: -3, objets: [{"id":"sabre"}] } },
    { texte: "Acheter un Marteau de Guerre (6 PO)", vers: "181-a", requis: {"or":6}, effets: { or: -6, objets: [{"id":"marteau-de-guerre"}] } },
    { texte: "Acheter une Lance (5 PO)", vers: "181-a", requis: {"or":5}, effets: { or: -5, objets: [{"id":"lance"}] } },
    { texte: "Acheter une Masse d'Armes (4 PO)", vers: "181-a", requis: {"or":4}, effets: { or: -4, objets: [{"id":"masse"}] } },
    { texte: "Acheter une Couverture de fourrure (3 PO)", vers: "181-a", requis: {"or":3}, effets: { or: -3, objets: [{"id":"couverture"}] } },
    { texte: "Acheter un Sac à Dos de rechange (1 PO)", vers: "181-a", requis: {"or":1}, effets: { or: -1 } },
    { texte: "Quitter la boutique", vers: "186" }
  ]
  },
  {
  id: "182",
  texte: "Il vous faut trouver un refuge pour la nuit, sinon vous risquez d'être arrêté par les gardes de la ville. Votre Discipline Kaï vous indique clairement qu'il vous faut retourner à la taverne pour y demander une chambre.",
  choix: [
    { texte: "En y passant une bonne nuit, vous serez d'attaque demain matin pour établir un plan qui vous permettra d'atteindre au plus vite le royaume de Durenor", vers: "177" }
  ]
  },
  {
  id: "183",
  texte: "Au bord du terrain où vous avez établi votre camp, la forêt descend en pente raide ; dans votre hâte, vous trébuchez et vous tombez tête la première parmi les arbres. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-8": { vers: "311", texte: "Si vous tirez un chiffre entre 0 et 8," },
        "9-9": { vers: "159", texte: "Si le chiffre obtenu est un 9," }
      }
      }
  },
  {
  id: "184",
  texte: "Le Drakkarim rend l'âme à vos pieds et les pirates saisis de panique s'enfuient à bord de leur bateau en train de sombrer ; voir un aussi puissant guerrier ainsi terrassé leur a fait perdre tout courage. Le capitaine Kelman rassemble aussitôt ses hommes et les lance à la poursuite de l'ennemi en déroute. Les pirates sont jetés par-dessus bord par les marins déchaînés. Le Sceptre Vert s'éloigne ensuite du vaisseau pirate qui donne de la bande sur tribord. « Merci au nom de tout l'équipage, Seigneur Kaï ! s'écrie alors le capitaine en vous serrant la main. Nous sommes fiers et reconnaissants de vous avoir parmi nous. » Une longue ovation retentit sur le pont : l'équipage tout entier vous rend hommage en même temps que le capitaine. Vous aidez ensuite à soigner les blessés tandis que l'on répare les dégâts subis à l'avant du navire.",
  choix: [
    { texte: "Une heure plus tard, le vent enfle à nouveau les voiles : vous êtes reparti vers le royaume de Durenor", vers: "240" }
  ]
  },
  {
  id: "185-b",
  titre: "Second guerrier Drakkarim",
  texte: "Le premier Drakkarim s'effondre sur le pont jonché de cadavres ; le second bondit à son tour.",
  suite: "120",
  combat: { nom: "Guerrier Drakkarim", habilete: 16, endurance: 26, fuite: [{ texte: "Plonger par-dessus bord", vers: "286" }] }
  },
  {
  id: "185",
  titre: "Les Drakkarim du Sceptre Vert",
  texte: "Tandis que vous courez sur le pont jonché de cadavres, deux guerriers DRAKKARIM apparaissent soudain et vous attaquent par surprise. Il vous faut les combattre l'un après l'autre.",
  suite: "185-b",
  choix: [
    { texte: "Si vous tuez vos deux adversaires au cours du combat, vous pourrez ensuite sauter sur le pont d'un navire de Durenor qui passe à proximité", vers: "120" }
  ],
  combat: { nom: "Guerrier Drakkarim", habilete: 17, endurance: 25, fuite: [{ texte: "Plonger par-dessus bord", vers: "286" }] }
  },
  {
  id: "186",
  texte: "Vous arrivez bientôt devant un grand bâtiment qui porte cette inscription sur sa façade : ÉCURIES DE RAGADORN RELAIS DE DILIGENCE Un cocher vêtu d'un uniforme vert est assis près d'un tableau d'affichage qui indique : Port Bax Durée du voyage : 7 jours.",
  choix: [
    { texte: "Si vous souhaitez demander au cocher un billet pour Port Bax", vers: "136" },
    { texte: "Si vous n'avez pas d'argent", vers: "238" }
  ]
  },
  {
  id: "187",
  texte: "En fouillant rapidement leurs cadavres, vous découvrez les objets suivants : 2 Lances, 2 Epées, 6 Pièces d'Or. Si vous décidez d'emporter l'un ou l'autre de ces objets, n'oubliez pas de modifier votre Feuille d'Aventure en conséquence. Vous précipitez ensuite les corps des soldats dans les eaux du chenal et vous vous hâtez de franchir le pont, de peur que quelqu'un n'ait été témoin de la scène.",
  choix: [
    { texte: "Emporter une Lance, une Épée et 6 PO", vers: "265", effets: { or: 6, objets: [{"id":"lance"},{"id":"epee"}] } },
    { texte: "Ne rien emporter", vers: "265" }
  ]
  },
  {
  id: "188",
  texte: "Votre présence d'esprit et votre adresse vous ont épargné une morsure fatale.",
  choix: [
    { texte: "Tandis que le serpent disparaît dans les hautes herbes de l'autre côté de la route, vous ramassez vos affaires et vous grimpez à l'arbre dans le feuillage duquel vous passerez la nuit en toute sécurité", vers: "312" }
  ]
  },
  {
  id: "189",
  texte: "« Vous êtes un imposteur ! » s'écrie-t-il en dégainant son arme. Avant que vous n'ayez pu réagir, la lame de son épée vous écorche le bras et vous perdez 2 points d'ENDURANCE. L'homme s'est précipité sur vous ; sous le choc, vous franchissez la porte ouverte à reculons, vous trébuchez et vous tombez tous deux tête la première au bas des escaliers, dans un échange de jurons retentissants. Vous vous relevez ensuite en titubant mais le chevalier, lui, est déjà debout et a ramassé son épée.",
  choix: [
    { texte: "Si vous souhaitez le combattre", vers: "162" },
    { texte: "Si vous préférez vous enfuir dans la forêt en abandonnant votre cheval", vers: "244" }
  ],
  effets: { endurance: -2 }
  },
  {
  id: "190",
  texte: "Vous vous servez d'une règle de fer comme d'un levier pour forcer la serrure et vous ressentez soudain une douleur cuisante dans la poitrine. Le coffret comportait un piège : une petite aiguille enduite de poison qui vient de se planter dans votre chair tandis que vous tentiez de faire sauter la serrure. Cette minuscule fléchette vous est fatale et vous mourez sur le coup. Votre mission s'achève ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §190"
  },
  {
  id: "191",
  texte: "Un peu plus loin, la rue pavée tourne brusquement vers la droite. Vous vous trouvez alors devant un bâtiment de pierre blanche qui porte cette plaque fixée au-dessus de la porte : La rue pavée aboutit à un haut mur de pierre dans lequel est aménagée une grande porte rouge gardée par deux soldats. Au-delà de cette porte, on distingue les mâts des navires ancrés dans le port.",
  choix: [
    { texte: "Si vous souhaitez entrer dans la tour de guet", vers: "318" },
    { texte: "Si vous préférez vous approcher de la porte rouge", vers: "246" }
  ]
  },
  {
  id: "192",
  texte: "Les marins ivres poussent des grognements satisfaits, et l'argent change de mains tandis qu'on prend les paris. Vous remarquez alors que votre adversaire adresse un clin d'œil à deux de ses compagnons qui s'avancent aussitôt vers vous. Sans hésiter une seconde, vous vous levez d'un bond et vous frappez le marin d'un coup de poing au visage. Le choc est si rude qu'il est projeté en arrière et s'écroule dans les bras de ses deux complices, les entraînant dans sa chute. Vous les laissez se débattre et vous vous dirigez vers la sortie. Mais, lorsque vous atteignez la porte, un autre marin au visage repoussant tire son épée et vous bloque le passage. Avant que vous n'ayez eu le temps de réagir, cependant vous entendez un bruit sourd et l'homme tombe à genoux. Derrière lui se tient la serveuse, une grosse massue de bois à la main. Elle vous sourit et vous la remerciez en lui adressant un clin d'oeil mais ce n'est pas le moment de vous attarder et vous filez par la porte dans la rue obscure recouverte de pavés. Vous courez quelques minutes dans le noir et vous apercevez alors une écurie et un relais de diligence dont les contours se dessinent dans l'ombre.",
  choix: [
    { texte: "Les hurlements furieux des marins retentissent à vos oreilles tandis que vous courez vers le bâtiment ; par chance une échelle extérieure vous permet de grimper dans un grenier à foin où vous vous réfugiez pour la nuit sans risque d'être découvert", vers: "32" }
  ]
  },
  {
  id: "193",
  texte: "Le voyage de retour au royaume du Sommerlund se déroule sous de mauvais auspices. De gros nuages noirs s'amoncellent à l'horizon et un vent violent agite la mer sans relâche. A la nuit tombée, de grands éclairs aveuglants déchirent l'obscurité, suivis par des roulements de tonnerre si fracassants que le navire amiral en est tout ébranlé depuis l'extrémité de sa quille jusqu'à la pointe de ses mâts. La plupart des soldats qui voyagent à bord de la flotte sont des montagnards qui n'ont aucune expérience de la mer et au bout du troisième jour, une bonne moitié d'entre eux sont cloués au lit, incapables de se lever. Lord Axim semble au bord du désespoir. « Puisse cette tempête se calmer, dit-il, car même si la flotte arrivait intacte au bout du voyage, nos hommes seraient trop faibles pour pouvoir combattre, après avoir subi une telle épreuve. » Et le lendemain, comme si sa prière avait été entendue, l'aube se lève dans un ciel apaisé qui annonce la fin de la tourmente.",
  choix: [
    { texte: "Mais les eaux calmes à présent où navigue la flotte cachent un péril plus redoutable encore que la tempête des jours passés", vers: "100" }
  ]
  },
  {
  id: "194",
  titre: "Pillés à Ragadorn",
  texte: "Lorsque vous vous réveillez, vous avez la désagréable surprise de vous retrouver étendu sous une jetée en bois, dans une puanteur insupportable qui monte des eaux environnantes. Vous vous relevez avec une douleur lancinante dans la tête, comme si on vous avait assommé. C'est d'ailleurs très exactement ce qui vous est arrivé ; mais, plus grave encore, les pêcheurs vous ont tout volé : Or, Sac à Dos, Armes, ainsi que tous vos Objets Spéciaux, y compris, hélas, le Sceau d'Hammardal. Avec un gémissement désespéré, vous vous arrachez à la puanteur des eaux croupies et vous vous hissez sur la jetée. En levant les yeux, vous apercevez alors un écriteau délavé qui porte ces mots : BIENVENUE À RAGADORN Pour votre malheur, toutes les rumeurs qui circulent au sujet de cette ville maudite se sont révélées exactes ; il fait presque noir, à présent, et la pluie s'est mise à tomber. Dans l'immédiat, il vous faut à tout prix retrouver le Sceau d'Hammardal si vous voulez convaincre le Roi de Durenor de vous confier le Glaive de Sommer. Vous jetez un coup d'œil autour de vous et vous apercevez une place sur laquelle est installé un marché. Au centre de cette place, un poteau indicateur en pierre signale diverses rues qui mènent dans toutes les directions.",
  choix: [
    { texte: "Si vous voulez aller vers l'est le long de la rue de la Bernicle", vers: "215" },
    { texte: "Si vous voulez aller au sud, le long du Dock de la rive Ouest", vers: "303" },
    { texte: "Si vous voulez aller au nord, en empruntant la rue du Butin", vers: "129" },
    { texte: "Si enfin vous préférez retourner vers la jetée, en direction de l'ouest, et chercher le bateau de pêche", vers: "86" }
  ],
  effets: { perdreArme: "tout" }
  },
  {
  id: "195",
  texte: "Au bout d'une heure de voyage, le cocher annonce « Pont à péage, une Couronne par personne. » Vous jetez un coup d'œil par la portière : la pluie tombe à verse mais vous parvenez malgré tout à distinguer au loin un pont de bois et une cabane en rondins. Un peu plus tard, le cocher arrête la diligence devant la cabane et une créature repoussante apparaît à la porte. C'est un Squall à la peau couverte de verrues. Les Squalls appartiennent à la famille des Gloks mais ce sont des êtres peureux et inoffensifs. Ils habitaient le Pays Sauvage au temps de la Lune Noire, lorsque des milliers d'entre eux émigrèrent, abandonnant les Monts Durncrag, pour échapper à la tyrannie de Vashna, le plus puissant des Maîtres des Ténèbres. Le Squall demande à chaque passager de la diligence de payer une Couronne le droit de franchir le pont. Vos compagnons de voyage déposent chacun une Couronne sur une petite assiette qu'ils vous tendent ensuite.",
  choix: [
    { texte: "Payer le péage (1 PO)", vers: "249", requis: {"or":1}, effets: { or: -1 } },
    { texte: "N'avoir pas d'argent", vers: "50", montreToujours: true }
  ]
  },
  {
  id: "196",
  titre: "Le don du roi Alin IV",
  image: "/lonewolf/ls02/p063-x290.webp",
  texte: "Le roi Alin IV est assis, seul, dans sa tour surmontée d'un dôme et contemple les montagnes à travers une haute fenêtre aux vitres de couleur. Un huissier vous annonce, Lord Axim et vous-même, puis vous pénétrez dans la Chambre Royale en vous inclinant respectueusement devant Sa Majesté. Lord Axim retire alors le Sceau d'Hammardal de votre doigt et s'approche du roi. Tous deux s'entretiennent pendant presque une heure, leur visage soucieux exprimant toute la gravité de la situation. Enfin, après un bref silence, le roi Alin se lève soudain de son trône et, pour la première fois, vous adresse la parole. « Hélas, dit-il, les Maîtres des Ténèbres se sont levés à nouveau et, à nouveau, le Royaume du Sommerlund vient demander notre aide. J'ai longtemps prié le ciel que mon règne soit placé sous le signe de la paix et de l'harmonie, mais au fond de mon cœur, j'avais malheureusement la certitude qu'il en serait autrement. » Le roi tire alors d'une poche de sa pelisse blanche une clé d'or qu'il introduit dans la serrure d'un coffre de marbre posé sur une estrade au centre de la pièce. Un faible bourdonnement s'élève aussitôt, tandis que le couvercle du coffre glisse latéralement, laissant apparaître le pommeau d'une épée en or massif. « Prends ce glaive, Loup Solitaire, commande le roi, car il est dit que seul un vrai fils du Sommerlund saura révéler la puissance qui se cache dans sa lame. » Lorsque vous empoignez le pommeau étincelant, un frémissement vous parcourt le bras puis se répand dans tout votre corps.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "79", requis: {"discipline":"sixieme-sens"} },
    { texte: "Dans le cas contraire", vers: "123" }
  ],
  effets: { objets: [{"id":"glaive-sommer","message":"Le Glaive de Sommer, forgé par une race de dieux, est vôtre !"}] }
  },
  {
  id: "197",
  texte: "Lorsque l'aube paraît, une terrible tempête se lève sur la mer et vous êtes réveillé par le violent roulis du navire. Le plancher de votre cabine est inondé cm li s hurlements du vent laissent à peine percevoir de temps à autre les cris de l'équipage. Vous vous habillez en hâte, vous rassemblez vos affaires et vous montez sur le pont. Le capitaine vous rejoint bientôt ; il vous prend par le bras et vous donne l'ordre de retourner dans votre cabine. Vous revenez donc sur vos pas, mais soudain un craquement effroyable retentit ; vous levez la tête : la partie supérieure du grand mât vient de se rompre dans la tourmente et tombe droit sur vous. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "1-4": { vers: "78", texte: "Si vous tirez un chiffre entre 1 et 4," },
        "5-9": { vers: "141", texte: "Entre 5 et 9," },
        "0-0": { vers: "247", texte: "Enfin, si vous tirez le 0," }
      }
      }
  },
  {
  id: "198",
  texte: "Vous avez à peine parcouru une vingtaine de mètres lorsque votre cheval se cabre soudain et s'emballe. Vous êtes projeté à terre et vous perdez 1 point d'ENDURANCE. Vous vous relevez en époussetant votre cape et vous lancez un juron à votre monture qui disparaît au loin.",
  choix: [
    { texte: "Il ne vous reste plus qu'à poursuivre votre chemin à pied", vers: "138" }
  ],
  effets: { endurance: -1 }
  },
  {
  id: "199",
  texte: "« C'est très simple, dit alors l'aubergiste d'une voix moqueuse en empochant la Pièce d'Or, il vous suffit de mettre un pied devant l'autre. Comme ça ! » ajoute-t-il avec un rire sonore en se dirigeant vers la cuisine dans laquelle il disparaît bientôt.",
  choix: [
    { texte: "Vous maudissez la canaille et vous quittez aussitôt l'auberge en prenant le temps toutefois de renverser d'un coup de pied le seau d'eau sale", vers: "143" }
  ]
  },
  {
  id: "200",
  titre: "L'assassin présumé",
  texte: "Lorsque vous arrivez au bar, tous les autres sont déjà assis à une grande table et vous attendent. Vous vous approchez d'eux et, soudain, la vérité vous apparaît clairement : vous savez à présent qui a tenté de vous assassiner et vous décidez d'attaquer cet ennemi par surprise, sans le laisser soupçonner que vous avez vu clair dans son jeu. Pendant quelques instants, vous examinez attentivement le visage de vos compagnons de voyage et vous avez alors la certitude d'avoir deviné juste. Il ne vous reste plus qu'à passer à l'attaque. Mais qui est donc, selon vous, cet assassin présumé sur lequel vous allez vous précipiter à la seconde même ?",
  choix: [
    { texte: "Le Chevalier de la Montagne Blanche qui répond au nom de Dorier ?", vers: "7" },
    { texte: "Le marchand nommé Halvorc ?", vers: "60" },
    { texte: "Viveka l'aventurière ?", vers: "85" },
    { texte: "Le moine nommé Parsion ?", vers: "158" },
    { texte: "Le Chevalier de la Montagne Blanche qui se nomme Ganon ?", vers: "270" }
  ]
  },
  {
  id: "201",
  texte: "Lorsque vous bondissez sur vos pieds, le serpent siffle et tente de vous mordre au bras. Vous faites un pas de côté pour l'éviter mais avez-vous été suffisamment rapide pour échapper à ses crochets mortels ? Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "285", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "70", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "202",
  texte: "Le soldat vous salue et vous laisse franchir la porte rouge. Vous arrivez alors sur une place éclairée par les lumières du port. A votre grand soulagement, vous apercevez un drapeau familier qui flotte au vent frais de la nuit : un soleil surmonté d'une couronne; c'est l'étendard du Sommerlund, et ces colonnes de marbre qui se dressent devant vous marquent l'entrée du consulat. Lorsque vous montez les marches de pierre qui mènent à la porte du bâtiment, les gardes sommerlundois en faction vous reconnaissent aussitôt. Ils disparaissent à l'intérieur et reviennent peu après en compagnie d'un homme de haute taille, aux cheveux grisonnants : c'est un fonctionnaire du consulat. L'expression inquiète de son visage se métamorphose en un sourire épanoui lorsqu'il aperçoit votre cape et votre tunique de Seigneur Kaï. « Dieu soit loué, vous êtes vivant, Seigneur Kaï. Les rares nouvelles qui sont parvenues jusqu'ici nous ont plongés dans l'angoisse. »",
  choix: [
    { texte: "Vous êtes immédiatement conduit à l'intérieur du bâtiment et introduit dans le bureau occupé par le représentant du Sommerlund, le Lieutenant Général Rhygar", vers: "31" }
  ]
  },
  {
  id: "203",
  texte: "« Vous avez faim ! Voulez-vous un peu de fromage ? » Vous avez posé cette question au marin après avoir jeté un coup d'œil aux deux souris qui s'affairent à l'autre bout de la salle.",
  choix: [
    { texte: "Utilisant alors la Discipline Kaï de la Communication Animale, vous ordonnez aux deux rongeurs de vous apporter leur fromage et, un instant plus tard, l'homme constate avec stupéfaction que les souris viennent effectivement déposer le fromage à vos pieds avant de disparaître en toute hâte", vers: "268", requis: {"discipline":"communication-animale"} }
  ]
  },
  {
  id: "204",
  texte: "L'exceptionnelle acuité visuelle que vous avez acquise au cours de votre entraînement à la Discipline de l'Orientation vous permet de distinguer nettement le talisman fixé à l'extrémité du bâton noir. C'est l'emblème de la Guilde des Magiciens de Toran : un croissant et une étoile de cristal. Cet homme est un renégat qui a trahi tout à la fois la Guilde et votre patrie.",
  choix: [
    { texte: "Si vous souhaitez monter en haut de cette tour pour attaquer le magicien félon", vers: "73" },
    { texte: "Si vous ne voulez pas risquer votre vie en affrontant ce puissant sorcier, sautez par-dessus bord et", vers: "267" }
  ]
  },
  {
  id: "205",
  texte: "L'aubergiste fronce les sourcils et vous montre du doigt une porte latérale. « Si vous ne pouvez pas vous payer une chambre, dit-il, allez donc dormir dans l'écurie. » En vous dirigeant vers la sortie, vous sentez dans votre dos le regard des autres passagers de la diligence.",
  choix: [
    { texte: "La porte claque sur vos talons et vous vous retrouvez seul dans la nuit froide, le corps parcouru de frissons", vers: "213" }
  ]
  },
  {
  id: "206",
  texte: "Au cours de la nuit vous êtes réveillé par des loups qui hurlent au loin.",
  choix: [
    { texte: "Vous préférez ne pas prendre le risque d'être dévoré pendant votre sommeil et vous montez donc dans l'arbre pour passer le reste de la nuit à l'abri de son feuillage, à bonne distance du sol", vers: "312" }
  ]
  },
  {
  id: "207",
  texte: "Moins de 100 mètres plus loin, le sentier s'arrête au bord d'un précipice. Les eaux du chenal de Ryner coulent au-dessous et il est impossible d'aller plus loin.",
  choix: [
    { texte: "Il ne vous reste donc plus qu'à rebrousser chemin et à prendre le pont qui traverse le chenal", vers: "47" }
  ]
  },
  {
  id: "208",
  texte: "Vous passez devant le chariot et vous entendez soudain un bruit, juste derrière vous.",
  choix: [
    { texte: "Vous faites volte-face en observant attentivement les parois du tunnel, mais il fait trop sombre pour distinguer quoi que ce soit", vers: "134" }
  ]
  },
  {
  id: "209",
  texte: "Vous entendez bientôt des murmures parmi les hommes d'équipage. Parfois, quelques mots prononcés distinctement vous parviennent aux oreilles : ils parlent de « vaisseaux fantômes » et de « malédiction », mais les rumeurs s'évanouissent brusquement lorsque la voix tonnante du capitaine appelle tout le monde sur le pont. Et lorsque le capitaine Kelman monte lui-même sur le pont arrière pour venir parler à l'équipage, on n'entend plus alors que le craquement des mâts du navire qui gémissent sous le vent. « Nous sommes à trois jours de Port Bax, dit le capitaine. Le feu a dévoré nos provisions et nous n'avons plus d'eau potable. Il nous faut donc mettre le cap sur Ragadorn où nous pourrons faire réparer le navire et reconstituer nos vivres. C'est tout. » Les hommes d'équipage semblent satisfaits de cette décision et ils se remettent au travail avec une vigueur renouvelée. Le capitaine se tourne alors vers vous. « Nous aurons rallié le port de Ragadorn dans huit heures environ, dit-il. J'ai reçu pour instructions de vous amener sain et sauf à Port Bax et de vous confier à la garde du Consul du Sommerlund, le Lieutenant Général Rhygar. Mais le temps est contre nous et j'ai bien peur qu'il faille une bonne huitaine de jours pour réparer le navire. Lorsque nous aurons jeté l'ancre, vous devrez alors décider si vous souhaitez poursuivre votre voyage à Durenor par la mer en restant avec nous ou par la route en allant là-bas par vos propres moyens. » Tandis que vous retournez dans votre cabine, les paroles du roi vous reviennent en mémoire : « Quarante jours, Loup Solitaire, tu n'as que quarante jours pour rapporter le Glaive. Nous aurons la force de résister à l'ennemi pendant ces quarante jours. Après... il sera trop tard... »",
  choix: [
    { texte: "Non, décidément, il ne vous reste guère de temps pour accomplir votre périlleuse mission", vers: "197" }
  ]
  },
  {
  id: "210",
  texte: "Vous posez les deux mains sur votre estomac et vous vous concentrez de toute la force que vous donne la Discipline Kaï pour tenter de vaincre la douleur. Votre pouvoir de guérison vous soulage bientôt, mais le poison est puissant et vous n'êtes pas au bout de vos peines. Utilisez la Table de Hasard pour obtenir un chiffre. Puisse la clémence des dieux guider votre main, car votre vie dépend désormais du chiffre que vous aurez tiré !",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "275", texte: "Puisse la clémence des dieux guider votre main, car votre vie dépend désormais du chiffre que vous aurez tiré ! Si la table vous donne entre 0 et 4," },
        "5-9": { vers: "330", texte: "Si elle vous donne entre 5 et 9," }
      }
      }
  },
  {
  id: "211",
  texte: "« Le consulat du Sommerlund ? » demande-t-il d'un air surpris, visiblement déconcerté par votre soudaine apparition. Puis, se reprenant : « Oh mais bien sûr ! s'exclame-t-il, c'est sur la place Alin, près du port. Prenez à droite en sortant et encore à droite au bout de l'avenue. Vous arriverez alors à la porte Rouge. Il vous faudra un laissez-passer rouge pour entrer, car le consulat se trouve à l'intérieur du quartier maritime et la circulation y est réglementée. » Vous demandez à l'homme ce qu'il convient de faire pour obtenir un laissez-passer rouge. « On voit que vous êtes étranger, répond-il, tout le monde sait à Port Bax qu'il faut demander cela au capitaine de la tour du guet. La tour se trouve au bout de la rue, vous ne pouvez pas la manquer, vous tomberez dessus dès que vous aurez tourné le coin. »",
  choix: [
    { texte: "Vous remerciez le vieil homme et vous quittez l'hôtel de ville", vers: "191" }
  ]
  },
  {
  id: "212",
  texte: "Le malheur veut que vous n'ayez pas d'armes et qu'il soit lui-même un redoutable bretteur. Le combat est désespéré et fort bref. Il vous transperce d'un coup d'épée et vous jette à bas du chariot d'un simple coup de pied. Mais rassurez-vous, votre chute ne sera pas trop douloureuse car vous êtes déjà mort lorsque vous arrivez en bas. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §212"
  },
  {
  id: "213",
  texte: "Vous grimpez au sommet d'une meule de foin et vous vous emmitouflez dans votre cape de Seigneur Kaï pour vous protéger du vent frisquet. Vous vous endormez alors sans vous douter le moins du monde que vous ne vous réveillerez plus jamais. En effet, l'un de vos compagnons de voyage est un agent des Maîtres des Ténèbres et, dans la fraîcheur de la nuit, il vient silencieusement vous assassiner sans même que vous vous en rendiez compte. Votre quête s'achève donc ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §213"
  },
  {
  id: "214",
  texte: "Dès que vous êtes entré, vous vous apercevez qu'il ne s'agit pas du tout d'une boutique. Vous vous trouvez dans une pièce nue et froide qui ne comporte pour seul ameublement qu'une grande table placée en son centre. Aux quatre coins de l'endroit, pendent des paires de menottes dont l'aspect sinistre vous glace le sang. Vous venez en fait de pénétrer dans le Quartier Général de la Fraternité du Silence, la célèbre police secrète de Lachelan. Avec un sentiment d'horreur, le récit d'un autre Seigneur Kaï vous revient alors en mémoire : il vous avait raconté comment on l'avait arrêté et accusé d’espionnage puis comment il avait réussi à s'évader après avoir été torturé pendant trois jours et trois nuits. Hélas, vous n'aurez pas, quant à vous, la chance de pouvoir vous échapper, car la porte donnant sur la rue vient de se verrouiller automatiquement et bientôt les Frères du Silence, qui vous observent pour l'instant derrière des judas aménagés dans les murs, viendront s'occuper de vous. Vous serez peut-être fier d'apprendre qu'après avoir passé une longue semaine dans la prison du chef inquisiteur, vous n'avez pas révélé le moindre secret de la communauté des Seigneurs Kaï. C'est un record qui n'est pas près d'être égalé, mais qui vous a coûté la vie. Une vie qui s'achève donc dans ces geôles sinistres en interrompant brutalement votre mission.",
  fin: "mort",
  nomFin: "Fin tragique — §214"
  },
  {
  id: "215",
  texte: "Une trentaine de mètres plus loin, du côté gauche de la rue, des cris joyeux et des chants filtrent à travers la façade d'une grande bâtisse délabrée. Une enseigne rouillée grince au-dessus de la porte.",
  choix: [
    { texte: "Si vous voulez entrer dans la taverne", vers: "4" },
    { texte: "Si vous préférez continuer de marcher le long de la rue de la Bernicle", vers: "83" }
  ]
  },
  {
  id: "216",
  texte: "Pendant trois jours et trois nuits, la puissante flotte du royaume de Durenor file à bonne allure en direction du golfe de Holm ; un fort vent gonfle les voiles des vaisseaux et il se pourrait bien que le voyage soit plus court que prévu. Pourtant, le moral des soldats n'est pas au plus haut ; il semble que leur confiance en eux-mêmes et leur hâte de combattre se soient peu à peu évanouies, comme si quelque vampire invisible les avait mystérieusement vidés de leur force. Lord Axim en éprouve une grande contrariété. « Cette humeur sombre qui hante nos navires est l'œuvre des Maîtres des Ténèbres, assure-t-il. Je connais l'étendue de leur pouvoir lorsqu'il s'agit d'influencer l'esprit des hommes, mais la malédiction qu'ils font peser sur nous est bien pire encore, il est impossible de conjurer une telle sorcellerie. Je prie le ciel que cette malédiction soit bientôt levée, car sinon, même si nous arrivons à destination, nous n'aurons plus suffisamment de volonté pour affronter l'ennemi. » Le lendemain à l'aube, la prière de Lord Axim semble avoir été entendue. Le moral des hommes remonte en effet, et la malédiction paraît avoir pris fin.",
  choix: [
    { texte: "Mais c'est désormais une autre menace qui pèse sur la flotte de Durenor, une menace encore plus mortelle dont vous connaîtrez la nature", vers: "100" }
  ]
  },
  {
  id: "217",
  texte: "L'homme vous regarde et vous répond d'une voix bourrue: «La diligente... il faut prendre la diligence qui part cet après-midi pour Port Bax. Si vous me donnez 1 Couronne, je vous dirai comment vous rendre au relais. »",
  choix: [
    { texte: "Si vous acceptez de payer, déduisez la Couronne de votre capital et", vers: "199", requis: {"or":1}, effets: { or: -1 } },
    { texte: "Si vous préférez quitter l'auberge sans lui donner la Pièce d'Or qu'il demande", vers: "143", montreToujours: true }
  ]
  },
  {
  id: "218",
  texte: "Le capitaine Zombie est mort, mais vous vous trouvez encerclé par les visages macabres des membres de l'équipage ; ils sont au nombre de vingt, armés de coutelas et de haches.",
  choix: [
    { texte: "Si vous voulez les combattre", vers: "43" },
    { texte: "Si vous préférez vous enfuir en saisissant une corde qui pend à proximité et en l'utilisant pour vous élancer sur le pont d'un navire de Durenor", vers: "105" }
  ]
  },
  {
  id: "219",
  texte: "Le venin commence à faire son effet. Votre bras mordu s'engourdit et une sueur froide perle à votre front. Vous ôtez aussitôt de votre cou le pendentif que Banedon vous a donné dans les Ruines de Raumas et à l'aide d'une des pointes de l'étoile de cristal, vous incisez la peau de votre bras à l'endroit de la morsure. Vous posez ensuite vos lèvres sur la plaie et vous aspirez le venin. Le porte-bonheur se révèle efficace et la chance est avec vous, car vous survivez à la morsure, bien que vous perdiez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Vous décidez ensuite de grimper dans l'arbre et de passer le reste de la nuit à l'abri de son feuillage, à bonne distance du sol", vers: "312" }
  ],
  effets: { endurance: -3 }
  },
  {
  id: "220",
  texte: "En fouillant son cadavre, vous découvrez des preuves accablantes : aucun doute, c'est bien lui qui a tenté de vous tuer. Dans l'une de ses poches, vous trouvez une fiole à moitié vide de sève de gandurn, le poison mortel qu'il avait versé dans vos aliments. Vous tombez ensuite sur un parchemin écrit en langue Glok et dans lequel sont indiqués tous les détails de votre voyage à Port Bax. C'est à Ragadorn qu'il a dû vous repérer et c'est là également qu'il a élaboré ses plans pour vous tuer. Vous remarquez aussi que son arme est une épée de Maître des Ténèbres, à la lame d'acier noir forgée dans le feu d'Helgedad, la cité infernale située au-delà des monts Durncrag. C'est le seul endroit, sur toutes les terres de Magnamund, où l'on peut fabriquer de l'acier noir. Mais la preuve irréfutable de son identité, vous la découvrez sur son poignet gauche : c'est un tatouage qui représente un serpent. Les brigands qui avaient essayé de vous tuer avant même que vous quittiez Holmgard portaient exactement la même marque.",
  choix: [
    { texte: "La bourse du moine contient 23 Pièces d'Or que vous pouvez conserver sans oublier de les inscrire sur votre Feuille d'Aventure", vers: "33" }
  ],
  effets: { or: 23 }
  },
  {
  id: "221",
  texte: "Le sol de la taverne est couvert de sang et jonché des cadavres de vos adversaires. Dehors, de la grande rue, vous parviennent les clameurs d'une foule. Les habitants du lieu sont persuadés que vous êtes un tueur fou et ils ont la très ferme intention de vous écharper.",
  choix: [
    { texte: "Vous vous enfuyez en toute hâte par la porte de derrière tandis que les hurlements de la populace se rapprochent", vers: "88" }
  ]
  },
  {
  id: "222",
  image: "/lonewolf/ls02/p127-x659.webp",
  texte: "Après avoir soigneusement refermé la porte de sa cabine, le capitaine ouvre son mystérieux paquet et en répand le contenu sur une table. 11 s'agit d'une cruche de faïence noircie et de lambeaux d'étoffe calcinés qui dégagent une étrange odeur d'huile. « Cet incendie n'est pas un accident, déclare le capitaine Kelman d'une voix solennelle, c'est un acte de sabotage. Cette cruche d'huile et ces chiffons que j'ai trouvés sur le plancher de la cale n'avaient rien à y faire ; quelqu'un à bord de ce navire est prêt à risquer sa vie pour nous empêcher d'atteindre Durenor. » Vous contemplez tous deux les chiffons brûlés, comme s'ils pouvaient répondre aux questions que vous vous posez. Et soudain un cri retentit au-dessus de vos têtes, brisant le silence qui règne dans la cabine. « Navire en vue ! Navire en vue sur bâbord avant ! » Le capitaine saisit aussitôt sa lunette d'approche et se hâte de monter sur le pont par une échelle d'écoutille.",
  choix: [
    { texte: "Si vous désirez le suivre", vers: "175" },
    { texte: "Si vous préférez fouiller rapidement sa cabine", vers: "315" }
  ]
  },
  {
  id: "223",
  texte: "Le garde contemple avec une stupeur mêlée de respect le magnifique anneau que vous lui montrez. Les habitants de Durenor connaissent bien la légende du Sceau d'Hammardal et l'on dit que de tous les trésors perdus du royaume, le Sceau est celui dont personne ne souhaite le retour. Le visage inquiet du soldat montre qu'il sait parfaitement ce que signifie le retour du Sceau d'Hammardal : c'est la guerre qu'il annonce. « Je ne peux malheureusement rien faire pour vous aider, dit le garde, si ce n'est vous indiquer la route pour Port Bax. Suivez ce chemin forestier et vous arriverez à une bifurcation, à proximité d'un petit chêne. Prenez alors le sentier de gauche, c'est un raccourci. » Vous remerciez ce loyal soldat et vous repartez dans la forêt. Deux kilomètres plus loin environ, vous arrivez à la bifurcation et vous prenez le sentier de gauche. Il vous amène à un pont de pierre qui traverse le chenal de Ryner. Les eaux du chenal font plus de 1500 m de profondeur et plus de 3 kilomètres dans leur plus grande largeur. Près du pont un poteau indicateur précise : PORT BAX 5 km.",
  choix: [
    { texte: "Vous poussez un soupir de soulagement car dans moins d'une heure, vous devriez être rendu", vers: "265" }
  ]
  },
  {
  id: "224",
  texte: "Le lendemain matin, vous êtes réveillé par les cris des goélands qui tournoient au-dessus du clipper. Un fort vent enfle les voiles. Quelques instants plus tard, vous prenez votre petit déjeuner en compagnie du capitaine Kelman qui semble plus optimiste que la veille. Il vous annonce que le Sceptre Vert vogue à bonne allure et que vous devriez arriver dans une semaine à Port Bax, le port principal du royaume de Durenor. Puis soudain, un cri retentit dans le nid-de-pie. « Terre par bâbord avant ! hurle la vigie, terre par bâbord ! » Le capitaine et vousmême montez alors sur le pont, affrontant la froideur de la brise. « C'est Mannon, l'île la plus au sud de l'archipel des Kirlundin, dit le capitaine en montrant une côte rocheuse et accidentée qui se dessine au loin, les marchands l'appellent la \"Pointe des Naufragés\" ; nombreux sont les navires qui ont fini leur carrière sur ces rochers de granit. » Le capitaine vous tend une lunette d'approche pour vous permettre de mieux observer l'île. Les rocs pointus de son rivage sont parsemés d'épaves : ce sont les carcasses fracassées des navires qui s'y sont échoués ou que la tempête y a précipités. Vous êtes fasciné par le spectacle de ces coques déchirées et vous imaginez les scènes terrifiantes qui ont dû se dérouler lors de chacun de ces naufrages. Puis, brusquement, vous apercevez une ombre noire suspendue au-dessus des pointes rocheuses de Mannon ; on dirait un petit nuage qui semble se déplacer dans votre direction. Mais un instant plus tard, vous comprenez de quoi est fait ce «nuage». Il s'agit en fait d'une nuée de Bêtalzans auxquels se sont probablement mêlés des Kraans. Aussitôt, l'alerte est donnée. « Parez au combat ! »",
  choix: [
    { texte: "Si vous souhaitez rester sur le pont, préparez votre arme et", vers: "146" },
    { texte: "Si vous préférez retourner dans votre cabine", vers: "34" }
  ]
  },
  {
  id: "225",
  titre: "Le retour de la flotte",
  texte: "Soixante-dix navires de guerre de la flotte de Durenor avaient quitté Port Bax mais ils ne sont plus que cinquante à entrer dans le golfe de Holm. La bataille a coûté la vie à nombre de vaillants soldats, parmi lesquels l'amiral Calfen en personne qui fut tué à bord du Durenor, le premier navire à avoir sombré au cours des combats. Mais en dépit des lourdes pertes, une grande victoire a été remportée, une victoire qui a donné aux soldats une vigueur nouvelle. La double épreuve du voyage et de la bataille a été oubliée à présent ; la même détermination, le même optimisme qu'ils avaient manifestés à leur départ de Port Bax les animent à nouveau et tous ont hâte de gagner Holmgard pour défaire l'ennemi. Au 37e jour de votre quête, à la tombée de la nuit, les tours de Holmgard apparaissent enfin à l'horizon. La ville continue de résister à l'armée des Maîtres des Ténèbres bien que le siège ait été constamment maintenu. Les lumières de la capitale luisent dans l'obscurité tandis que, debout à la proue du navire, vous contemplez les rivages du royaume. Un Lord Axim confiant dans l'issue de la bataille vient vous rejoindre. « Cette nuit sans lune va nous avantager, assure-t-il, l'ennemi ne nous verra pas entrer dans le port et, dès l'aube, mes hommes balaieront ces misérables comme des feuilles mortes emportées par le vent. »",
  choix: [
    { texte: "Lorsque votre navire entre dans le port de Holmgard, à la tête de la flotte de Durenor, vous tirez de son fourreau le Glaive de Sommer, prêt à accomplir votre destinée", vers: "350" }
  ]
  },
  {
  id: "226",
  texte: "L'aubergiste s'exprime avec l'accent rocailleux des natifs de Ragadorn. Il vous raconte que la ville est gouvernée par Lachelan, le fils de Killean le Suzerain qui a été emporté trois ans plus tôt par la peste rouge. Votre interlocuteur ne semble pas tenir Lachelan en grande estime, il le surnomme en effet le « Prince des Voleurs ». « Lui et ses hommes saignent le peuple à blanc en levant de lourds impôts, vous explique-t-il, et si vous avez le malheur de vous en plaindre, vous êtes sûr de finir dans les eaux du port avec un poignard planté entre les deux épaules. » L'homme hoche la tête d'un air sombre et sert une autre tournée de bière aux marins ivres.",
  choix: [
    { texte: "Si vous souhaitez louer une chambre pour la nuit, donnez 2 Pièces d'Or à l'aubergiste et", vers: "56", requis: {"or":2}, effets: { or: -2 } },
    { texte: "Si vous préférez essayer de gagner un peu d'or en engageant une partie de bras de fer", vers: "276" }
  ]
  },
  {
  id: "227",
  texte: "Quatre gardes de la ville, armés de pied en cap, marchent au milieu de la rue. Vous ne voulez pas courir le risque d'être interpellé et vous vous réfugiez dans une ruelle à votre gauche. Mais les soldats s'immobilisent juste à l'entrée du passage et il suffirait que l'un d'eux tourne la tête pour que vous soyez immédiatement repéré. Derrière vous, une petite fenêtre ouverte vous permet de distinguer l'intérieur d'une taverne bondée.",
  choix: [
    { texte: "Sans la moindre hésitation, vous enjambez aussitôt le rebord de la fenêtre et vous entrez à l'intérieur", vers: "4" }
  ]
  },
  {
  id: "228",
  texte: "Ce sont des Larnumiers, des arbres dont les fruits juteux et sucrés sont très nourrissants. Après avoir avalé quelques-uns de ces fruits, vous vous sentez tout revigoré et vous en cueillez l'équivalent de 2 Repas que vous rangez dans votre Sac à Dos pour les manger plus tard. Audelà des arbres, une large route longe la côte en s'étendant des deux côtés de l'horizon, à droite et à gauche. Il n'y a pas de poteau indicateur et vous devez choisir quelle direction prendre.",
  choix: [
    { texte: "Si vous souhaitez aller à gauche", vers: "27" },
    { texte: "Si vous préférez aller à droite", vers: "114" }
  ]
  },
  {
  id: "229",
  texte: "Votre Sixième Sens vous indique que ce chariot dissimule une créature malfaisante.",
  choix: [
    { texte: "Si vous souhaitez aller voir de quoi il retourne, montez dans le chariot", vers: "134" },
    { texte: "Si vous préférez prendre vos jambes à votre cou pour vous enfuir le plus vite possible", vers: "208" },
    { texte: "Enfin, si vous choisissez de rebrousser chemin jusqu'à la bifurcation pour prendre cette fois le tunnel de droite, vous pouvez le faire", vers: "164" }
  ]
  },
  {
  id: "230",
  texte: "Vous marchez le long de la voie qui tourne brusquement à l'est pour aboutir à la rue du Mendiant. Cette artère est d'ailleurs bien nommée car des dizaines d'hommes, de femmes et d'enfants, tous vêtus de haillons, s'y rassemblent par groupes, à l'abri des portes cochères, en tendant des sébiles aux passants. Et tandis que vous suivez l'avenue en direction d'un croisement, vous êtes assailli de tous côtés par des miséreux qui vous demandent de l'or.",
  choix: [
    { texte: "Si vous souhaitez leur faire l'aumône", vers: "93" },
    { texte: "Si vous préférez les repousser et poursuivre votre chemin", vers: "137" }
  ]
  },
  {
  id: "231",
  titre: "Le voleur et le Sceau",
  texte: "La porte de derrière ouvre sur une petite place au centre de laquelle se dresse une haute sépulture. Les pêcheurs ont disparu dans les rues sombres, sauf un qui est tombé en glissant sur le pavé mouillé et s'est assommé dans sa chute. Il est étendu dans le caniveau, le visage dans une flaque d'eau. Vous le retournez du bout du pied et vous le fouillez. Dans ses poches, vous trouvez 5 Pièces d'Or et 1 Poignard, mais mieux que tout, vous découvrez, passé à son doigt, le Sceau d'Hammardal; vous poussez un long soupir de soulagement et vous inscrivez sur votre Feuille d'Aventure toutes ces trouvailles.",
  choix: [
    { texte: "Si vous souhaitez à présent retourner dans la taverne", vers: "177" },
    { texte: "Si vous préférez examiner la sépulture", vers: "24" },
    { texte: "S'il vous semble plus judicieux de suivre la rue du Tombeau en direction de l'ouest", vers: "253" },
    { texte: "Vous pouvez également aller vers l'est en empruntant la rue de la Tour de Guet", vers: "319" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "182", requis: {"discipline":"orientation"} }
  ],
  effets: { or: 5, objets: [{"id":"poignard"},{"id":"sceau-hammardal","message":"Vous récupérez le Sceau d'Hammardal, passé au doigt du voleur assommé !"}] }
  },
  {
  id: "232",
  texte: "Vous êtes parvenu à moins d'une vingtaine de mètres de la tour lorsque le garde fait un pas en avant et vous demande ce que vous venez faire par ici. Vous remarquez que le soldat porte la vareuse rouge de l'uniforme des armées durenoraises, ce qui signifie que vous avez atteint la frontière du royaume. 11 vous faut à présent trouver le moyen de passer.",
  choix: [
    { texte: "Si vous souhaitez prétendre que vous êtes un marchand en route pour Port Bax", vers: "250" },
    { texte: "Si vous voulez essayer de le corrompre en lui donnant de l'or", vers: "68" },
    { texte: "Si vous pensez qu'il est préférable de lui montrer le Sceau d'Hammardal (en admettant qu'il soit toujours en votre possession)", vers: "223", requis: {"special":"sceau-hammardal"} },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "149", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "233",
  texte: "« Nous allons à Ragadorn, nous devrions arriver là-bas vers midi, dit-il, le visage presque entièrement dissimulé sous son chapeau à larges bords, le billet coûte 3 Couronnes, mais si vous voulez voyager sur le toit, vous n'aurez qu'une seule couronne à payer. »",
  choix: [
    { texte: "Si vous souhaitez faire le voyage à l'intérieur de la diligence, donnez 3 Couronnes au cocher et", vers: "37", requis: {"or":3}, effets: { or: -3 } },
    { texte: "Si vous préférez faire le trajet sur le toit, donnez-lui 1 Couronne et", vers: "148", requis: {"or":1}, effets: { or: -1 } },
    { texte: "Si vous n'avez pas les moyens de payer, il ne vous reste plus qu'à repartir à pied", vers: "292", montreToujours: true }
  ]
  },
  {
  id: "234",
  texte: "Avant que vous ayez pu esquisser un geste pour vous défendre, le Monstre d'Enfer s'est jeté sur vous et vous tombez tous deux sur la chaussée en contrebas. Vous éprouverez peut-être quelque consolation en apprenant que votre mort a été soudaine et indolore. Vous vous êtes rompu le cou dans votre chute et vous n'aurez donc pas le désagrément de sentir les doigts décharnés du Monstre d'Enfer s'enfoncer dans votre gorge en vous déchirant la peau de leurs griffes pointues. Le Sceau d'Hammardal retournera désormais à Holmgard et la ville tombera aux mains des Maîtres des Ténèbres. Votre mission s'achète donc ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §234"
  },
  {
  id: "235",
  texte: "Lorsque vous atteignez le palier de l'étage suivant, la porte cède dans un grand fracas et la populace déchaînée entre en force. En haut des marches, un Sabre est accroché à côté d'une cheminée. Vous pouvez vous emparer de cette arme si vous le désirez. En jetant ensuite un coup d'œil autour de vous, vous vous apercevez qu'il n'y a qu'un seul moyen de sortir d'ici : sauter par la fenêtre pour atterrir sur la chaussée en contrebas.",
  choix: [
    { texte: "Saisir le sabre puis sauter par la fenêtre", vers: "132", effets: { objets: [{"id":"sabre"}] } },
    { texte: "Sauter par la fenêtre", vers: "132" },
    { texte: "Affronter la populace qui monte l'escalier", vers: "90" }
  ]
  },
  {
  id: "236",
  texte: "La panique s'empare du navire. Saisis d'une véritable frénésie, les marins rassemblent tous les seaux et les couvertures qu'ils peuvent trouver pour combattre l'incendie. Les flammes jaillissent de l'écoutille et il faut plus d'une heure pour maîtriser le feu. Les dégâts sont considérables. Les vivres et les provisions d'eau douce ont été anéantis et la structure centrale du navire gravement endommagée. Le capitaine émerge alors de la cale enfumée et s'approche de vous, le visage noir de suie. Il porte un paquet sous son bras. «Je dois vous parler en privé, my Lord », dit-il à voix basse.",
  choix: [
    { texte: "Sans rien répondre, vous le suivez aussitôt dans sa cabine", vers: "222" }
  ]
  },
  {
  id: "237",
  texte: "Les Zombies morts sont étendus à vos pieds. A présent, la peur que les soldats éprouvaient devant les morts vivants a fait place à la haine. Un chœur de cris de guerre retentit sur le pont et vous montez à l'abordage du vaisseau fantôme, suivis par les centaines de soldats ivres de rage. Les Zombies sont fauchés sous l'assaut comme des épis de blé par une faux. Puis soudain, une silhouette drapée dans une longue cape vous interdit le passage, brandissant dans sa main squelettique une épée à la lame recourbée. C'est un MONSTRE D'ENFER et il vous faut le combattre jusqu'à la mort de l'un d'entre vous. C'est un mort vivant et vous avez donc le droit, en vertu de la puissance du Glaive de Sommer, de multiplier par 2 tous les points d'ENDURANCE qu'il perdra au combat. Mais rappelez-vous qu'il est insensible à la Discipline Kaï de la Puissance Psychique.",
  suite: "309",
  combat: { nom: "Monstre d'Enfer", habilete: 23, endurance: 30, immunisePsychique: true, vulnerableGlaiveSommer: true }
  },
  {
  id: "238",
  titre: "La Roue du Carrosse",
  image: "/lonewolf/ls02/p136-x711.webp",
  texte: "Face au relais de diligence, une rue étroite mène à une maison de jeu sur la façade de laquelle est placardé cet avis : LES ARMES SONT INTERDITES A L'INTÉRIEUR DE CET ÉTABLISSEMENT. La perspective de pouvoir gagner un peu d'or vous décide à y entrer sans attendre. Si vous avez des armes, vous devrez les déposer au vestiaire ; vous aurez le droit de les reprendre en quittant les lieux. En échange d'une Pièce d'Or, on vous donne un jeton d'argent qui vous permet d'entrer dans l'établissement. Le hall mène à une vaste salle où se pratiquent toutes sortes de jeux de hasard. L'un d'eux vous semble particulièrement intéressant : on l'appelle la « Roue du Carrosse ». Au bout d'une longue table, une jeune femme fort séduisante fait tourner une sorte de disque noir qui a été divisé en dix tranches égales numérotées de 0 à 9. Lorsque le disque tourne, elle y laisse tomber une petite boule d'argent qui finit par s'immobiliser sur l'une des tranches numérotées. Pour jouer, il vous faut d'abord choisir le numéro sur lequel vous voulez miser, puis décider combien de Couronnes d'Or vous allez mettre en jeu. Utilisez la Table de Hasard : si elle donne votre numéro, vous empochez 8 fois votre mise ; si elle donne un numéro voisin du vôtre, vous empochez 5 fois votre mise ; sinon, vous perdez votre mise. Vos gains sont limités à 40 Pièces d'Or au total.",
  choix: [
    { texte: "Miser 1 Couronne sur la Roue du Carrosse", vers: "238-a-1", requis: {"or":1} },
    { texte: "Miser 2 Couronnes sur la Roue du Carrosse", vers: "238-a-2", requis: {"or":2} },
    { texte: "Miser 3 Couronnes sur la Roue du Carrosse", vers: "238-a", requis: {"or":3} },
    { texte: "Si vous n'avez plus une seule Pièce d'Or", vers: "169", montreToujours: true },
    { texte: "Partir sans jouer, quittez la maison de jeu et", vers: "186" }
  ]
  },
  {
  id: "238-a-1",
  titre: "La boule s'immobilise",
  texte: "Vous déposez votre mise d'une Couronne et regardez la petite boule d'argent tourner autour du disque noir.",
  evenement: {
        type: "jet-hasard-table",
        titre: "La Roue du Carrosse",
        texte: "Table de Hasard : sur 0, vous touchez le plein (8 fois la mise). Sur 1 ou 2, vous touchez un numéro voisin (5 fois la mise). De 3 à 9, la boule s'arrête ailleurs et vous perdez votre mise.",
        ton: "mystere",
        branches: {
        "0-0": { vers: "238-b", texte: "La boule s'immobilise exactement sur votre numéro ! Vous empochez 8 Pièces d'Or.", or: 7 },
        "1-2": { vers: "238-b", texte: "La boule s'arrête sur un numéro voisin du vôtre : vous empochez 5 Pièces d'Or.", or: 4 },
        "3-9": { vers: "238-b", texte: "La boule s'immobilise loin de votre numéro : vous perdez votre mise d'une Couronne.", or: -1 }
      }
      }
  },
  {
  id: "238-a-2",
  titre: "La boule s'immobilise",
  texte: "Vous déposez votre mise de deux Couronnes et regardez la petite boule d'argent tourner autour du disque noir.",
  evenement: {
        type: "jet-hasard-table",
        titre: "La Roue du Carrosse",
        texte: "Table de Hasard : sur 0, vous touchez le plein (8 fois la mise). Sur 1 ou 2, vous touchez un numéro voisin (5 fois la mise). De 3 à 9, la boule s'arrête ailleurs et vous perdez votre mise.",
        ton: "mystere",
        branches: {
        "0-0": { vers: "238-b", texte: "La boule s'immobilise exactement sur votre numéro ! Vous empochez 16 Pièces d'Or.", or: 14 },
        "1-2": { vers: "238-b", texte: "La boule s'arrête sur un numéro voisin du vôtre : vous empochez 10 Pièces d'Or.", or: 8 },
        "3-9": { vers: "238-b", texte: "La boule s'immobilise loin de votre numéro : vous perdez votre mise de 2 Couronnes.", or: -2 }
      }
      }
  },
  {
  id: "238-a",
  titre: "La boule s'immobilise",
  texte: "Vous déposez votre mise de trois Couronnes et regardez la petite boule d'argent tourner autour du disque noir.",
  evenement: {
        type: "jet-hasard-table",
        titre: "La Roue du Carrosse",
        texte: "Table de Hasard : sur 0, vous touchez le plein (8 fois la mise). Sur 1 ou 2, vous touchez un numéro voisin (5 fois la mise). De 3 à 9, la boule s'arrête ailleurs et vous perdez votre mise.",
        ton: "mystere",
        branches: {
        "0-0": { vers: "238-b", texte: "La boule s'immobilise exactement sur votre numéro ! Vous empochez 24 Pièces d'Or.", or: 21 },
        "1-2": { vers: "238-b", texte: "La boule s'arrête sur un numéro voisin du vôtre : vous empochez 15 Pièces d'Or.", or: 12 },
        "3-9": { vers: "238-b", texte: "La boule s'immobilise loin de votre numéro : vous perdez votre mise de 3 Couronnes.", or: -3 }
      }
      }
  },
  {
  id: "238-b",
  titre: "Rejouer ou partir",
  texte: "La jeune femme relance déjà le disque pour la prochaine partie. Vous pouvez continuer à jouer, tant que vos gains ne dépassent pas 40 Pièces d'Or, ou quitter la table avec ce qu'il vous reste.",
  choix: [
    { texte: "Miser encore 1 Couronne", vers: "238-a-1", requis: {"or":1} },
    { texte: "Miser encore 2 Couronnes", vers: "238-a-2", requis: {"or":2} },
    { texte: "Miser encore 3 Couronnes", vers: "238-a", requis: {"or":3} },
    { texte: "Si vous avez perdu tout votre or", vers: "169", montreToujours: true },
    { texte: "Partir avec vos gains ou l'or qui vous reste, quitter la maison de jeu et", vers: "186" }
  ]
  },
  {
  id: "239",
  texte: "Vous essayez d'appliquer la paume de vos mains sur la poitrine de l'homme blessé, mais les Squalls tirent sur les pans de votre cape pour vous éloigner de lui.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Camouflage", vers: "77", requis: {"discipline":"camouflage"} },
    { texte: "Sinon, il vous faudra attaquer les Squalls pour pouvoir ensuite vous occuper du blessé", vers: "28" }
  ]
  },
  {
  id: "240",
  texte: "Après trois jours en mer durant lesquels il ne s'est rien passé, vous commencez à trouver le temps long. Dans l'après-midi du quatrième jour, vous êtes sur le pont du navire en train de bavarder avec un homme d'équipage lorsqu'une odeur de brûlé se dégage soudain d'une des cales.",
  choix: [
    { texte: "Si vous souhaitez descendre dans cette cale", vers: "29" },
    { texte: "Si vous pensez qu'il est préférable de crier « Au feu ! »", vers: "236" },
    { texte: "Enfin, si vous décidez plutôt d'aller prévenir le capitaine", vers: "101" }
  ],
  effets: { guerisonReposSiDiscipline: { discipline: "guerison" } }
  },
  {
  id: "241",
  texte: "Le silence se fait dans la taverne lorsque l'homme que vous venez d'accuser se tourne vers vous. « Tu as la langue un peu trop prompte, étranger, dit-il d'un air menaçant, il serait temps de la couper avant qu'elle ne t'attire d'autres ennuis. » Il dégaine alors un Poignard à la lame recourbée et se jette sur vous. La foule des clients forme aussitôt un cercle autour de vous et il vous est désormais impossible de prendre la fuite. Il vous faut combattre cet homme jusqu'à la mort de l'un d'entre vous.",
  suite: "21",
  combat: { nom: "Tricheur", habilete: 17, endurance: 25 }
  },
  {
  id: "242",
  texte: "Pendant la plus grande partie de votre séjour à Hammardal, vous vous entraînez à manier le Glaive de Sommer. Jour après jour, votre habileté s'accroît et, à mesure que vous progressez, vous en apprenez davantage sur les vertus de cette arme fabuleuse. Chaque fois que vous utiliserez le glaive dans un combat, votre total d'HABILETÉ sera augmenté de 8 points (de 10 points si vous avez choisi la Discipline Kaï de la Maîtrise des Armes et que le sort vous a donné cette maîtrise à l'épée). Le glaive a en outre la propriété d'annuler les effets de toute pratique magique exercée contre vous par un adversaire ; il vous permettra aussi de multiplier par 2 tous les points d'ENDURANCE perdus par des morts vivants (les Monstres d'Enfer, par exemple) au cours des combats qu'il vous faudra peut-être livrer contre eux.",
  choix: [
    { texte: "Enfin, vous avez pleinement conscience que le Glaive de Sommer est la seule et unique arme, sur toutes les terres de Magnamund, qui ait le pouvoir d'ôter la vie à un Maître des Ténèbres ; il n'est donc pas étonnant que ces derniers aient résolu de vous tuer à tout prix", vers: "152" }
  ]
  },
  {
  id: "243",
  texte: "Voyant que leur maître est mort, les Gloks désemparés battent en retraite vers la poupe du navire. Le capitaine Kelman rassemble alors ses hommes et se lance à l'attaque, repoussant les immondes créatures qui, dans un concert de grognements rageurs, sont contraintes de sauter par-dessus bord pour éviter d'être taillées en pièces. Constatant qu'il ont perdu la bataille, les Kraans s'envolent des mâts et s'enfuient en direction de la côte qu'on aperçoit à l'horizon. « Merci, Seigneur Kaï, dit le capitaine en vous serrant la main, nous sommes fiers et reconnaissants de vous avoir avec nous. » Une longue ovation retentit sur le pont du navire : ce sont les marins qui vous rendent hommage en même temps que leur capitaine.",
  choix: [
    { texte: "Vous aidez ensuite à soigner les blessés tandis qu'on répare la mâture endommagée ; et deux heures plus tard, le navire est prêt à repartir, les voiles gonflées de vent : vous voici à nouveau en route pour Durenor", vers: "240" }
  ]
  },
  {
  id: "244",
  texte: "Vous marchez dans la forêt touffue pendant près de trois heures avant de découvrir un sentier orienté au nord et parallèle au chenal de Ryner dont les flots bouillonnants ont plus de 1500 m de profondeur. Au loin, vous apercevez un pont qui enjambe les eaux sombres, là où le chenal se rétrécit. Une petite cabane au toit plat se dresse à l'entrée du pont ; deux soldats se tiennent debout au sommet de l'édifice. Un panneau orienté vers l'autre extrémité du pont indique : PORT BAX.",
  choix: [
    { texte: "Si vous souhaitez traverser ce pont", vers: "47" },
    { texte: "Si vous préférez l'éviter et poursuivre le long du sentier", vers: "207" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "147", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "245",
  texte: "Vous prenez la direction de l'est en longeant la rue du Col Vert et vous remarquez bientôt, à votre gauche, une enseigne accrochée au-dessus de la porte d'une petite boutique ; elle porte ces mots : MEKI MAJENOR MAÎTRE ARMURIER",
  choix: [
    { texte: "Entrer dans cette boutique", vers: "266" },
    { texte: "Poursuivre votre chemin vers l'est", vers: "310" }
  ]
  },
  {
  id: "246",
  texte: "L'un des gardes s'avance vers vous et demande à voir votre laissezpasser.",
  choix: [
    { texte: "Montrer le laissez-passer blanc", vers: "170", requis: {"special":"laissez-passer-blanc"} },
    { texte: "Montrer le laissez-passer rouge", vers: "202", requis: {"special":"laissez-passer-rouge"} },
    { texte: "Ne pas avoir de laissez-passer", vers: "327", montreToujours: true }
  ]
  },
  {
  id: "247",
  texte: "Vous êtes comme hypnotisé par ce mât qui tombe sur vous et vous n'avez même plus la force de faire un geste. Le capitaine et ses hommes d'équipage, impuissants à vous porter secours, voient avec horreur l'énorme masse de bois s'écraser sur vous. La mort est instantanée. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §247"
  },
  {
  id: "248",
  texte: "Lorsque vous posez le Glaive d'Or sur le pont, le capitaine zombie se rue sur vous et vous projette à terre. Il est animé d'une force surnaturelle, impossible d'échapper à son étreinte ; il vous plonge alors un poignard dans la gorge en éclatant d'un rire terrifiant. Votre quête s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §248"
  },
  {
  id: "249",
  texte: "Au cours de l'après-midi, vous bavardez avec vos compagnons de voyage tandis que la diligence file bon train. Au bout de quelques heures, vous avez appris beaucoup de choses à leur sujet. Les deux hommes assis face à vous sont frères. Ils se nomment Ganon et Dorier et ce sont des Chevaliers de l'Ordre de la Montagne Blanche, des guerriers du Royaume de Durenor, qui ont fait serment de protéger leur patrie contre les brigands du Pays Sauvage. Ils possèdent un château et des terres près de Port Bax. A côté d'eux est assis un certain Halvorc, marchand de son état. Il a le nez enflé et le visage couvert de bleus. Ce sont les gardes de Lachelan, le Suzerain de Ragadorn, qui l'ont mis dans cet état. A la suite d'un léger malentendu avec les autorités de la ville à propos de taxes portuaires, toute sa marchandise et la plus grande partie de son or lui ont été confisqués. Près de la portière opposée est assis un moine du nom de Parsion, un compatriote du Sommerlund qui a traversé le Pays Sauvage en diligence pour se rendre à Port Bax. La jeune femme assise à côté de vous a pour nom Viveka. C'est une aventurière mercenaire qui gagne son or les armes à la main en vendant ses services au plus offrant. Elle retourne à Port Bax avec en poche le prix de ses derniers exploits, accomplis victorieusement dans la ville de Ragadorn. Quant à vous, vous n'avez nullement l'intention de révéler votre véritable identité et vous vous êtes fait passer pour un simple paysan.",
  choix: [
    { texte: "Les passagers de la diligence semblent tout ignorer de la guerre qui ravage le Royaume du Sommerlund", vers: "39" }
  ]
  },
  {
  id: "250",
  texte: "Le soldat vous regarde d'un air incrédule. « Où sont vos marchandises ? s'étonne-t-il, où est votre cheval ? Et votre chariot ? Les marchands ne viennent jamais à Port Bax à pied. Vous, un marchand ? Laissez-moi rire ! J'ai plutôt l'impression que vous êtes un brigand qui essaie de fuir les lieux de quelque inavouable forfait. Retournez donc d'où vous venez, misérable canaille, nous n'avons pas besoin ici du genre de commerce que vous pratiquez. » Si vous voulez passer vivant cette frontière, il vous faudra trouver autre chose. Qu'allez-vous faire ? Essayer de corrompre le garde ?",
  choix: [
    { texte: "Prétendre être un marchand", vers: "244" },
    { texte: "Montrer le Sceau d'Hammardal", vers: "223", requis: {"special":"sceau-hammardal"} },
    { texte: "Tenter votre chance", vers: "68" }
  ]
  },
  {
  id: "251",
  texte: "Il fait presque nuit lorsque le petit bateau de pêche entre dans le port de Ragadorn. Vous n'avez toujours pas rencontré le moindre survivant au naufrage et le pire est à craindre. Vous remarquez bientôt que trois des pêcheurs ont un comportement suspect. Ils se parlent à l'oreille et jettent de fréquents regards à votre bourse. Et tandis que le bateau vogue dans l'estuaire du fleuve Dorn, ils vous encerclent soudain et vous ordonnent de leur donner votre or. Vous vous apprêtez à passer à l'attaque lorsque quelqu'un vous pousse par-derrière en vous projetant à plat ventre sur le pont.",
  choix: [
    { texte: "L'un des marins lève alors le pied et un instant plus tard, tout devient noir dans votre tête", vers: "194" }
  ]
  },
  {
  id: "252",
  texte: "Vous essayez de vous rappeler certains récits que vous a faits il y a quelque temps un Maître Kaï surnommé «Faucon Raisonnable». Pendant des années, il avait occupé un poste de diplomate à Port Bax et il en était arrivé à connaître et à aimer la ville tout autant qu'un natif de l'endroit. Vous vous souvenez de ce qu'il vous avait dit : le consulat du Sommerlund se trouve sur la place Alin, à l'intérieur du quartier maritime. Or, un panneau indicateur, à votre gauche, signale : QUARTIER MARITIME 800 mètres.",
  choix: [
    { texte: "Certain d'être dans la bonne direction, vous marchez d'un pas confiant le long de l'avenue bordée d'arbres", vers: "191" }
  ]
  },
  {
  id: "253",
  texte: "La rue longe le mur du port en direction du fleuve Dorn ; au bord du fleuve, elle tourne brusquement vers le sud et aboutit à la rue du Butin. Vous passez devant les entrepôts alignés le long du quai et vous reconnaissez un peu plus loin le poteau de pierre planté au milieu de la place.",
  choix: [
    { texte: "Si vous souhaitez poursuivre en direction du sud", vers: "303" },
    { texte: "Si vous préférez prendre la rue de la Bernicle et retourner à la taverne", vers: "177" }
  ]
  },
  {
  id: "254",
  texte: "Pendant trois jours et trois nuits, vous avez suivi la route parallèle au fleuve Durenon, en direction de la capitale. La vallée où coule la rivière est une vaste région de riches terres cultivées adossées au flanc des Monts d'Hammardal, l'une des chaînes de montagnes les plus hautes de tout Magnamund. L'aube s'est levée sur le quatorzième jour de votre quête lorsque six hommes vêtus de capes apparaissent en bordure de votre camp. Le Lieutenant Général Rhygar est le premier à tirer son épée. D'une voix forte, il demande à ces hommes ce qu'ils viennent faire ici. Pour toute réponse, les six inconnus dégainent chacun une épée noire. Rhygar alors appelle ses hommes au combat tandis que les six étrangers vêtus de capes s'avancent vers nous.",
  choix: [
    { texte: "Si vous souhaitez à votre tour dégainer votre arme et vous préparer à combattre", vers: "69" },
    { texte: "Si vous ne voulez pas vous battre, vous pouvez prendre la fuite en courant vers la forêt", vers: "183" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "344", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "255",
  texte: "Vous empoignez votre arme et vous faites une brillante démonstration de vos talents. Vos maîtres Kaï vous ont enseigné la vitesse et le sens de l'équilibre, les deux éléments essentiels de la technique du combat. Et lorsque vous faites tournoyer et virevolter votre arme autour de votre tête et de votre corps, vos mains bougent avec une telle rapidité qu'on ne parvient plus à distinguer leurs mouvements : elles se déplacent dans une sorte de tourbillon indistinct qui semble presque surnaturel. Pour achever de donner la preuve de votre maîtrise, vous frappez soudain le bord d'une assiette d'étain que vous envoyez tourbillonner à travers la salle avec une telle force qu'elle vient se ficher profondément dans la porte de la cave.",
  choix: [
    { texte: "L'homme a assisté à tout ce spectacle avec des yeux ronds de stupeur", vers: "268" }
  ]
  },
  {
  id: "256",
  texte: "Vous passez devant les marches de pierre et vous poursuivez votre chemin. Vous venez de dépasser la plate-forme lorsque vous entendez un bruit au-dessus de votre tête.",
  choix: [
    { texte: "Vous vous immobilisez et vous levez les yeux, mais vous ne pouvez rien voir dans l'obscurité du tunnel", vers: "134" }
  ]
  },
  {
  id: "257",
  texte: "Cette rue aux pavés jonchés d'ordures est bordée de taudis, de masures aux façades moisies et de boutiques délabrées. Les quelques passants que vous croisez ont la mine sombre, les traits tirés et les yeux hagards. Ils avancent dans le noir en traînant les pieds, le dos voûté sous la pluie qui tombe à verse et le regard fixé sur le pavé. Vous arrivez bientôt à un croisement ; là, la rue de la Hache s'oriente vers le nord et une autre rue part vers l'est.",
  choix: [
    { texte: "Si vous souhaitez aller vers le nord et prendre la rue du Chevalier Noir", vers: "335" },
    { texte: "Si vous préférez prendre la direction de l'est en empruntant la rue du Sage", vers: "181" }
  ]
  },
  {
  id: "258",
  texte: "La puanteur que dégage le navire vous étouffe à demi. Vous perdez 1 point d'ENDURANCE et il vous faut à tout prix vous échapper de cette cale répugnante où vous finirez par succomber à la pestilence.",
  choix: [
    { texte: "Si vous voulez essayer de vous hisser sur le pont", vers: "17" },
    { texte: "Si vous préférez quitter la cale par la porte aménagée dans la cloison opposée", vers: "5" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "272", requis: {"discipline":"sixieme-sens"} }
  ],
  effets: { endurance: -1 }
  },
  {
  id: "259",
  texte: "A travers la pluie qui tombe à verse, vous parvenez à distinguer la silhouette d'un groupe de soldats qui s'avancent dans votre direction.",
  choix: [
    { texte: "Vous ne voulez pas prendre le risque d'être interpellé et peut-être arrêté, vous décidez donc de vous réfugier dans une boutique proche", vers: "161" }
  ]
  },
  {
  id: "260",
  texte: "Le capitaine ordonne qu'on mette le cap sur les trois hommes et qu'on les hisse à bord. Ce sont des pêcheurs de Tyso, un port du Sommerlund. Leur bateau a été attaqué par des pirates la nuit précédente et ils sont les seuls survivants. Vous leur donnez à manger et des vêtements chauds ; les trois hommes alors retiennent leurs larmes à grand peine et l'un d'eux vous fait présent d'une magnifique Epée en témoignage de sa reconnaissance.",
  choix: [
    { texte: "Si vous souhaitez accepter ce cadeau, n'oubliez pas de l'inscrire sur votre Feuille d'Aventure", vers: "240" }
  ]
  },
  {
  id: "261",
  texte: "Sur un bon nombre de kilomètres, la route longe une hauteur verdoyante, où abonde l'herbe grasse, avant de tourner enfin vers le nord, en direction de la côte. Vous arrivez dans un village dont les maisons sont bâties en cercle autour d'un étang et lorsque vous le traversez, un groupe d'enfants squalls se précipite vers vous en hurlant et en vous lançant des pierres. Vous descendez ensuite dans la profonde vallée qui s'étend au-delà et, peu à peu, la lande laisse place à des terres plus riches qui ont été défrichées et cultivées. La colline qui se dresse de l'autre côté est couverte de forêts ; vous n'êtes plus loin de la côte à présent, et vous apercevez déjà ses hautes falaises et la couleur des rocs qui surplombent la mer. Un peu plus tard, vous êtes en train de franchir un taillis lorsque des appels à l'aide retentissent à votre droite.",
  choix: [
    { texte: "Si vous souhaitez vous porter au secours de la personne qui crie ainsi", vers: "95" },
    { texte: "Si vous préférez ne pas prêter attention à ces hurlements désespérés, continuez de chevaucher le long de la route", vers: "198" }
  ]
  },
  {
  id: "262",
  titre: "La poste de garde",
  texte: "Le garde vous écarte d'une bourrade et se met à courir en direction de la rue du Tombeau. En haut de l'escalier se trouve une petite pièce que vous décidez de fouiller avant le retour du soldat. Vous y découvrez les objets suivants : Épée, Masse d'Armes, Bâton, 1 Repas complet, 6 Pièces d'Or, une fiole d'un liquide orange. Si l'un ou l'autre de ces objets vous intéresse, il vous suffit de les inscrire sur votre Feuille d'Aventure pour qu'ils vous appartiennent désormais.",
  choix: [
    { texte: "Saisir l'Épée, le Bâton, un Repas et 6 PO", vers: "65", effets: { or: 6, objets: [{"id":"epee"},{"id":"baton"},{"id":"repas"}] } },
    { texte: "Ne rien prendre et prendre la fuite", vers: "65" }
  ]
  },
  {
  id: "263",
  titre: "La Tour de Guet",
  texte: "L'homme contemple le Sceau avec une stupeur mêlée de crainte. Sans dire un mot, il se lève alors de son fauteuil et vous fait signe de le suivre en haut d'un escalier qui mène à une pièce en forme de dôme. Vous y rencontrez le capitaine de la Tour de Guet qui vous écoute attentivement tandis que vous lui faites le récit des événements qui sont survenus au royaume du Sommerlund. Vous lui révélez également le but de votre mission. « Donnez immédiatement à cet homme un laissez-passer rouge ! Priorité absolue ! » ordonne-t-il aussitôt.",
  choix: [
    { texte: "Vous prenez votre laissez-passer, vous quittez la tour et vous vous hâtez en direction du poste de garde", vers: "246" }
  ],
  effets: { objets: [{"id":"laissez-passer-rouge","message":"« Donnez immédiatement à cet homme un laissez-passer rouge ! Priorité absolue ! »"}] }
  },
  {
  id: "264",
  texte: "Vous concentrez toute l'énergie de votre pouvoir sur le reptile et vous lui ordonnez de partir à l'instant en quête d'une proie. Lentement, votre puissance de suggestion fait son effet et le serpent s'éloigne enfin, puis disparaît dans les hautes herbes.",
  choix: [
    { texte: "Vous poussez un soupir de soulagement et, pour plus de sûreté, vous grimpez à l'arbre où vous passerez le reste de la nuit à l'abri du feuillage et à bonne distance du sol", vers: "312" }
  ]
  },
  {
  id: "265",
  texte: "Le soleil se couche sur le dixième jour de votre quête lorsque vous apercevez pour la première fois la magnifique cité de Port Bax. Les tours de la ville luisent dans la pâle clarté d'un croissant de lune comme autant de diamants nichés au creux du rivage. Au nord se trouve le port lui-même où sont rassemblés les vaisseaux de la puissante flotte de guerre du royaume de Durenor. A l'est, au-delà des murs de la cité couverts de mousse, s'étend la forêt. Enfin, au sommet d'une colline se dresse un château de fière apparence, une haute citadelle qui donne à la ville le plus glorieux fleuron de sa couronne. Vous pénétrez dans Port Bax en franchissant l'une des portes aménagées dans les murs de la cité. Il n'y a aucun garde en faction et vous passez sans difficulté. Dans la nuit tombante, les rues qui mènent au port s'obscurcissent peu à peu. Vous empruntez une avenue bordée d'arbres et vous remarquez bientôt un bâtiment au toit en forme de dôme. Un large escalier de pierre donne accès à la porte de l'édifice. Vous vous approchez et vous lisez cette inscription gravée sur une plaque de cuivre : HÔTEL DE VILLE En dépit de l'heure tardive, la porte principale est toujours ouverte.",
  choix: [
    { texte: "Si vous souhaitez entrer dans l'hôtel de ville", vers: "84" },
    { texte: "Si vous préférez poursuivre votre chemin en direction du port", vers: "191" },
    { texte: "Enfin, si vous maîtrisez la Discipline de l'Orientation", vers: "252", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "266",
  titre: "L'armurerie de Meki Majenor",
  image: "/lonewolf/ls02/p034-x126.webp",
  texte: "A votre entrée, une cloche retentit et un petit homme vêtu d'une veste de cuir matelassée vous souhaite la bienvenue. Il est occupé à frotter une armure rouillée à l'aide d'un tampon de paille de fer. Un petit tableau de bois posé sur le comptoir indique le prix de chacune des armes exposées : ÉPÉES 4 Couronnes pièce POIGNARDS 2 Couronnes pièce GLAIVES 7 Couronnes pièce SABRES 3 Couronnes pièce MARTEAUX DE GUERRE 6 Couronnes pièce LANCES 5 Couronnes pièce MASSES D'ARMES 4 Couronnes pièce HACHES BÂTONS 3 Couronnes pièce Si vous possédez l'argent nécessaire, vous pouvez acheter l'une ou l'autre de ces armes; et si vous souhaitez vendre une arme dont vous voulez vous séparer, l'armurier vous l'achètera au prix indiqué sur son tableau, moins 1 Couronne. Si vous désirez lui vendre une Masse d'Armes par exemple, il vous en donnera 4-1 = 3 Couronnes. Apportez à votre Feuille d'Aventure toutes les modifications nécessaires en fonction de vos transactions, puis quittez la boutique après avoir souhaité une bonne nuit au petit homme. Au bout de la rue du Col Vert se trouvent à votre droite une grande écurie et un relais de diligence. Il fait noir à présent et il vous faut un abri pour la nuit.",
  choix: [
    { texte: "Faire des emplettes chez l'armurier", vers: "266-a" },
    { texte: "Grimper au grenier à foin pour dormir", vers: "32" }
  ]
  },
  {
  id: "266-a",
  titre: "Le tableau des prix",
  texte: "Le petit tableau de bois affiche : ÉPÉES 4 Couronnes · POIGNARDS 2 · GLAIVES 7 · SABRES 3 · MARTEAUX DE GUERRE 6 · LANCES 5 · MASSES D'ARMES 4. L'armurier rachète aussi les armes au prix moins une Couronne (revente non simulée dans l'app).",
  choix: [
    { texte: "Acheter une Épée (4 PO)", vers: "266-a", requis: {"or":4}, effets: { or: -4, objets: [{"id":"epee"}] } },
    { texte: "Acheter un Poignard (2 PO)", vers: "266-a", requis: {"or":2}, effets: { or: -2, objets: [{"id":"poignard"}] } },
    { texte: "Acheter un Glaive (7 PO)", vers: "266-a", requis: {"or":7}, effets: { or: -7, objets: [{"id":"glaive"}] } },
    { texte: "Acheter un Sabre (3 PO)", vers: "266-a", requis: {"or":3}, effets: { or: -3, objets: [{"id":"sabre"}] } },
    { texte: "Acheter un Marteau de Guerre (6 PO)", vers: "266-a", requis: {"or":6}, effets: { or: -6, objets: [{"id":"marteau-de-guerre"}] } },
    { texte: "Acheter une Lance (5 PO)", vers: "266-a", requis: {"or":5}, effets: { or: -5, objets: [{"id":"lance"}] } },
    { texte: "Acheter une Masse d'Armes (4 PO)", vers: "266-a", requis: {"or":4}, effets: { or: -4, objets: [{"id":"masse"}] } },
    { texte: "Quitter la boutique", vers: "32" }
  ]
  },
  {
  id: "267",
  texte: "Lorsque vous refaites surface, vous constatez que la bataille fait rage tout autour de vous. Nombre de cadavres de soldats tués au combat ou jetés par-dessus bord et noyés flottent sur la mer. Vous parcourez à la nage une trentaine de mètres environ, puis vous vous hissez sur le pont d'un navire de la flotte de Durenor. Une rude bataille s'y livre car un vaisseau fantôme vient de l'aborder et d'y déverser une armée de Zombies qui massacrent à tour de bras les soldats durenorais frappés de terreur.",
  choix: [
    { texte: "Si vous estimez opportun de dégainer le Glaive de Sommer et de vous lancer à l'attaque", vers: "128" },
    { texte: "Si vous préférez sauter sur le pont du vaisseau fantôme", vers: "309" }
  ]
  },
  {
  id: "268",
  image: "/lonewolf/ls02/p151-x797.webp",
  texte: "«Vous êtes sans nul doute un Seigneur Kaï», dit l'homme, mais l'expression stupéfaite de son visage se transforme bientôt en un ricanement méprisant. « Ou plutôt, reprend-il d'une voix ironique, vous étiez un Seigneur Kaï ! » A peine a-t-il prononcé ces mots qu'une porte s'ouvre à la volée juste derrière vous. Vous faites volte-face et vous vous retrouvez face à trois BRIGANDS qui s'avancent dans votre direction. Chacun d'eux est armé d'un cimeterre et vous devez les combattre en les considérant comme un seul et même ennemi.",
  suite: "333",
  combat: { nom: "Brigands", habilete: 16, endurance: 25, fuite: [{ texte: "Prendre la fuite", vers: "125" }] }
  },
  {
  id: "269",
  texte: "La vision répugnante de la créature qui se tortille sur le sol vous remplit de dégoût pour les Maîtres des Ténèbres et leurs immondes séides. Lorsque enfin le Monstre d'Enfer s'est entièrement décomposé et que vous êtes sûr de l'avoir anéanti à tout jamais, vous arrachez de ses restes la Lance Magique dont vous essuyez le fer sur l'étoffe fumante de ses vêtements.",
  choix: [
    { texte: "Vous avez hâte de quitter cet endroit et vous courez le long du tunnel aussi vite que possible", vers: "349" }
  ]
  }
];
