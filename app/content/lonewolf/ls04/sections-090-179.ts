import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 04 — Le Gouffre Maudit
 * Paragraphes 090 à 179. Fichier GÉNÉRÉ par
 * scripts/ls04-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls04-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_090_179: StorySection[] = [
  {
  id: "90-b",
  titre: "Cavalier Pillard",
  texte: "Cavalier vassagonien sans monture.",
  suite: "249",
  combat: { nom: "Cavalier Pillard", habilete: 17, endurance: 24 }
  },
  {
  id: "90",
  titre: "Ver de Pierre et Cavalier",
  texte: "Votre adversaire est un cavalier vassagonien privé pour l'instant de sa monture. Il vous est impossible de vous enfuir et vous devrez le combattre jusqu'à la mort de l'un de vous deux.",
  suite: "90-b",
  choix: [
    { texte: "VER DE PIERRE HABILETÉ : 15 ENDURANCE : 38 CAVALIER PILLARD HABILETÉ: 17 ENDURANCE: 24 Si vous êtes vainqueur", vers: "249" }
  ],
  combat: { nom: "Ver de Pierre", habilete: 15, endurance: 38, immunisePsychique: true }
  },
  {
  id: "91",
  texte: "Il est impossible de pénétrer à cheval dans la mine et vous êtes donc contraints d'abandonner vos montures à l'extérieur. Les galeries sont totalement obscures mais vous remarquez bientôt que des Torches éteintes sont fixées aux murs à intervalles réguliers. Vos hommes et vous-même prenez chacun une Torche que vous allumez avant de poursuivre votre chemin. Dans la faible clarté qu'elles diffusent vous découvrez des traces de pas menant vers un endroit où le tunnel s'est éboulé. Les traces se poursuivent jusqu'au sommet d'un énorme tas de terre qui atteint presque le plafond, ne laissant qu'une petite ouverture entre les deux.",
  choix: [
    { texte: "Si vous souhaitez escalader ce tas de terre et vous glisser dans l'ouverture", vers: "254" },
    { texte: "Si vous préférez renoncer à cette exploration, vous pouvez ressortir, reprendre vos chevaux et descendre le sentier de la colline", vers: "191" }
  ]
  },
  {
  id: "92",
  texte: "Le lendemain à midi, vous parvenez aux abords d'Eshnar. Au sud, les collines boisées montent en pente douce vers les magnifiques sommets enneigés de la chaîne de Maaken. C'est un spectacle extraordinaire qui contraste singulièrement avec la laideur d'Eshnar et l'aspect lugubre du Pays Sauvage qui s'étend au nord. Vous chevauchez le long de l'unique rue de cette ville délabrée et vous arrivez enfin devant une grande taverne : « La Pioche et la Pelle ». Vos hommes sont épuisés et ont grand besoin de manger et de se reposer.",
  choix: [
    { texte: "Si vous souhaitez entrer dans cette taverne", vers: "132" },
    { texte: "Si vous préférez continuer le long de la rue", vers: "301" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "210", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "93",
  texte: "Quatre brigands au visage couvert de verrues sont assis autour d'une table ronde sur laquelle est étalé un plan des mines de Maaken. Votre attaque est si fulgurante qu'ils n'ont pas même le temps de manifester une réaction de surprise. Trois d'entre eux tombent morts avant même d'avoir pu dégainer leur arme. Le quatrième s'écarte de ses compagnons et tire son épée. Il se précipite alors sur vous, et vous pouvez lire dans son regard brûlant une ardente soif de vengeance.",
  suite: "2",
  combat: { nom: "Guerrier Pillard", habilete: 15, endurance: 26 }
  },
  {
  id: "94",
  texte: "Soudain, le bateau bascule en avant et vous êtes projeté en l'air. Vous tombez pendant ce qui vous semble être une éternité, avant de heurter la surface de l'eau avec une telle violence que vous plongez à plus de 6 mètres de profondeur. L'eau glacée vous assomme à moitié et brise vos forces. Vous cherchez désespérément à respirer un peu d'air en vous débattant pour tenter de remonter à la surface. Votre Sac à Dos, cependant, vous entraîne au fond et vous devez vous en débarrasser pour ne pas vous noyer. Lorsqu'enfin vous parvenez à l'air libre, le courant vous entraîne en vous éloignant de la chute d'eau. Vous vous échouez bientôt sur une rive de graviers au fond d'un ravin escarpé. Vous avez perdu votre Sac à Dos avec tout ce qu'il contenait ainsi que votre bateau et vos hommes mais, en dépit du désastre, vous êtes toujours vivant et à peu près indemne.",
  choix: [
    { texte: "Mettez à jour votre Feuille d'Aventure avant de", vers: "219" }
  ]
  },
  {
  id: "95",
  texte: "« Quelle preuve avons-nous que vous n'êtes pas des brigands revêtus d'uniformes volés ? »",
  choix: [
    { texte: "Qu'allez-vous faire ou dire qui puisse les convaincre que vous ne mentez pas 1 Si vous souhaitez leur expliquer que vous êtes un Seigneur Kaï et que vos hommes sont des patrouilleurs frontaliers du Sommerlund", vers: "259" },
    { texte: "Si vous préférez leur montrer l'insigne qui témoigne de votre rang", vers: "195" }
  ]
  },
  {
  id: "96",
  texte: "Un tentacule fracasse le fond du bateau avec tant de force que vous êtes projeté en l'air et que vous retombez tête la première dans l'eau glacée de la rivière. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "47", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-8": { vers: "234", texte: "Entre 5 et 8," },
        "9-9": { vers: "334", texte: "Enfin, si vous tirez le 9," }
      }
      }
  },
  {
  id: "97",
  texte: "Dès que vous sortez du tunnel, vous apercevez les silhouettes de Gardes qui s'approchent et vous vous maudissez pour avoir pris le mauvais chemin. Vous vous êtes en effet dirigé droit vers une patrouille.",
  choix: [
    { texte: "Avant que les Gardes ne vous attrapent, vous avez cependant le temps d'essayer de vous enfuir", vers: "199" }
  ]
  },
  {
  id: "98",
  texte: "Le cimeterre du Guerrier siffle à quelques centimètres au-dessus de votre tête alors que vous vous laissez tomber dans l'ouverture de la trappe. Il essaie de vous suivre, mais les coups que vous lui portez le forcent à reculer. Vous parvenez à refermer la trappe et à tirer le verrou, empêchant désormais votre adversaire de pénétrer à l'intérieur de la tour de guet.",
  choix: [
    { texte: "Essayant de chasser de votre esprit les images sanglantes de la bataille, vous descendez quatre à quatre les marches de l'escalier et vous sortez de la tour de guet", vers: "59" }
  ]
  },
  {
  id: "99",
  titre: "Mort — §99",
  texte: "En raison de l'obscurité, vous ne remarquez pas un grand trou dans les planches du pont. Vous passez au travers et vous tombez tête la première, vous fracassant le crâne après une chute de plus de 30 mètres. Votre mission s'achève ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §99"
  },
  {
  id: "100",
  texte: "Un sentiment de répulsion vous envahit, tandis que vous contemplez l'autel et le sanctuaire du temple souterrain. Votre sensibilité de Seigneur Kaï semble s'enflammer comme si chaque nerf de votre corps vous incitait à fuir ces lieux maléfiques. D'immenses braseros de métal fondu entourent un autel noir sur lequel est étendue la blonde Madelon, fille du baron Vanalund. Elle paraît plongée dans une transe profonde ; sa respiration est lente et brève. De l'autre côté de l'autel, vous apercevez deux portes massives de pierre noire ; chacune est gravée d'une gigantesque tête de mort. Dans un autre coin du temple, hors de vue pour l'instant, une troisième porte s'ouvre et une procession de prêtres vêtus de capes rouges fait son entrée. Ils ont la tête encapuchonnée et chacun porte dans ses mains tendues d'étranges Amulettes. Ils défilent devant l'autel, déposent leurs Amulettes en cercle autour du corps de la jeune fille puis s'éloignent dans un silence total. Quelques instants plus tard, vous entendez le son d'un battement de tambour dont l'intensité augmente régulièrement. Des bruits de pas cadencés produits par des bottes aux semelles ferrées résonnent à sa suite.",
  choix: [
    { texte: "Barraka s'approche", vers: "215" }
  ]
  },
  {
  id: "101",
  texte: "Vous suivez le tunnel pendant plus de deux heures avant d'arriver dans une immense caverne. Cette grotte obscure est séparée en deux par une rivière souterraine qui disparaît au-delà d'une large arcade aménagée dans la paroi sud. Sur la berge opposée vous parvenez à distinguer l'entrée d'un autre tunnel orienté vers l'ouest. Un bateau à rames est amarré de votre côté de la rivière et vous découvrez deux paires de rames derrière un rocher couvert de mousse.",
  choix: [
    { texte: "Si vous souhaitez utiliser ce bateau pour traverser la rivière et emprunter le tunnel orienté à l'ouest", vers: "343" },
    { texte: "Si vous préférez utiliser ce bateau pour suivre le cours de la rivière en direction du sud", vers: "115" }
  ]
  },
  {
  id: "102",
  texte: "Vos hommes tirent leurs épées et s'approchent des étrangers. Les deux personnages encapuchonnés lèvent immédiatement les mains et sortent du dôme de marbre. L'un d'eux laisse tomber un petit flacon de terre cuite rempli d'un liquide clair ; le flacon se brise sur le sol de pierre. En fouillant les deux hommes, vous trouvez 12 Couronnes d'Or et des vivres équivalents à 2 Repas. Inscrivez-les sur votre Feuille d'Aventure si vous souhaitez les conserver. Les deux étrangers portent autour du cou des Amulettes de bois représentant un petit poisson.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "19", requis: {"discipline":"guerison"} },
    { texte: "Sinon", vers: "339", montreToujours: true }
  ],
  effets: { or: 12, objets: [{"id":"repas","quantity":2}] }
  },
  {
  id: "103",
  texte: "Vous arrivez à fuir le Guerrier, mais il a eu le temps de vous infliger une blessure à l'aide de son cimeterre et vous perdez aussitôt 4 points d'ENDURANCE. Vous étouffez un cri de douleur, puis vous parvenez tant bien que mal à refermer la trappe et à tirer le verrou.",
  choix: [
    { texte: "Vous descendez ensuite l'escalier d'un pas chancelant et vous sortez de la tour de guet", vers: "59" }
  ]
  },
  {
  id: "104",
  texte: "Rassemblant toutes vos ressources musculaires et nerveuses, vous vous précipitez de l'autre côté du pont. Le sang vous bat aux oreilles et vous faites des prières pour que les broches de fixation tiennent encore quelques instants. Vous êtes à peine à 3 mètres du but lorsque le pont se détache soudain.",
  choix: [
    { texte: "Si vous voulez vous accrocher aux planches du pont", vers: "303" },
    { texte: "Si vous préférez sauter du pont et vous laisser tomber dans les profondeurs inconnues du puits de mine", vers: "342" }
  ]
  },
  {
  id: "105",
  texte: "Un groupe de Gardes en armes apparaît soudain en haut de l'escalier et leur chef vous ordonne de vous arrêter. En vous voyant hésiter, les Gardes saisissent les arbalètes qu'ils portent en bandoulière.",
  choix: [
    { texte: "Si vous souhaitez attaquer ces Gardes", vers: "285" },
    { texte: "Si vous préférez lever les mains et vous rendre", vers: "267" }
  ]
  },
  {
  id: "106",
  texte: "Ces petits chevaux trapus appartiennent à une race connue sous le nom de Kucheks. Ils ont été baptisés ainsi d'après le nom d'une ville et d'une province situées en Vassagonie, à plusieurs centaines de kilomètres à l'est. Les brigands que vous avez rencontrés sur la voie de Ruanon chevauchaient précisément des Kucheks.",
  choix: [
    { texte: "Si vous souhaitez quitter Eshnar le plus vite possible", vers: "67" },
    { texte: "Si vous préférez fouiller les écuries", vers: "236" }
  ]
  },
  {
  id: "107",
  texte: "Le bandit à cheval vous poursuit, sa lance se rapprochant de votre dos à une allure inquiétante. Vous courez à toutes jambes en direction d'un soldat du Sommerlund qui se trouve juste sur votre chemin, son arc tendu, prêt à tirer. « Plongez ! » vous crie l'archer. Instinctivement, vous obéissez à son ordre. Presque en même temps, il lâche la corde de son arc. Le bandit à cheval n'est plus qu'à quelques mètres de vous, lorsque la pointe d'acier de la flèche s'enfonce dans sa visière et ressort à l'arrière de son heaume comme une broche transperçant une pomme. Son cheval trébuche et tombe à terre, projetant le cadavre du cavalier à vos côtés. Vous vous apprêtez à remercier le soldat qui vient de vous sauver, mais celui-ci court déjà vers la barricade.",
  choix: [
    { texte: "Si vous souhaitez le suivre", vers: "59" },
    { texte: "Si vous préférez continuer en direction de la tour de guet", vers: "310" }
  ]
  },
  {
  id: "108",
  texte: "Le chef des Gardes des Tunnels lance un ordre à ses hommes, qui s'immobilisent aussitôt. De toute évidence, il vient de leur ordonner de ne pas se mêler d'un combat qu'il se réserve pour lui-même. L'officier porte un grand heaume empanaché ainsi qu'une écharpe d'un rouge vif en travers de la poitrine. D'un bref mouvement, il pointe sa hallebarde en direction de votre tête et passe à l'attaque.",
  choix: [
    { texte: "OFFICIER DES GARDES HABILETÉ : 20 ENDURANCE : 30 Vous pouvez prendre la fuite à tout moment en vous précipitant de l'autre côté du pont", vers: "271" },
    { texte: "Si vous sortez vainqueur du combat", vers: "28" }
  ],
  combat: { nom: "Officier des Gardes", habilete: 20, endurance: 30 }
  },
  {
  id: "109",
  texte: "D'un coup de pied vous retournez le cadavre du bandit puis vous le fouillez. Vous découvrez alors les objets suivants : - 3 Pièces d'Or, -1 Poignard, -1 Epée, Vous pouvez prendre l'un ou l'autre de ces objets, en n'oubliant pas de les inscrire sur votre Feuille d'Aventure. Vous vous apprêtez à repartir, lorsque vous remarquez une trappe dans le plancher. En l'ouvrant, vous découvrez un escalier qui descend dans la cave de la cabane.",
  suite: "200",
  choix: [
    { texte: "Si vous souhaitez fouiller la cave", vers: "347" },
    { texte: "Si vous préférez quitter la cabane", vers: "258" }
  ],
  effets: { or: 3, objets: [{"id":"poignard"},{"id":"epee"}] }
  },
  {
  id: "110",
  texte: "Vous ouvrez d'un coup de pied la porte de la roulotte et vous vous précipitez à l'intérieur. Malheureusement, vous n'y trouvez pas l'acteur, mais une jeune femme en train de prendre son bain. Après quelques secondes d'un silence stupéfait, la femme se met à hurler à pleins poumons, ne s'interrompant que pour vous jeter à la tête tout ce qui lui tombe sous la main. Sous une pluie de brosses, de miroirs, de peignes et de jurons, vous êtes expulsé de la roulotte dont la porte se referme brutalement sur vous. Audehors, vous vous retrouvez face à un petit groupe de gens que le vacarme a attirés. Aucune des personnes présentes ne parlant ou ne comprenant le sommerlundais, vous êtes dans l'impossibilité d'expliquer votre innocente erreur.",
  choix: [
    { texte: "Considérant les regards hostiles qui sont fixés sur vous, vous estimez préférable de renoncer à chercher l'acteur en fuite", vers: "165" }
  ]
  },
  {
  id: "111",
  texte: "Vous vous mettez en position et vous vous concentrez pour choisir le meilleur moment où frapper. Tous vos sens de Guerrier Kaï en éveil, vous lancez une attaque éclair. Plongeant sous le cimeterre qui siffle au-dessus de votre tête, vous tranchez la sangle de selle de votre adversaire. La selle bascule sur le côté et le cavalier tombe à bas de son cheval, s'écrasant à terre dans un nuage de poussière et de cendre. Vous avancez vers lui pour l'achever, mais il est prompt à réagir et se relève d'un bond. Il vous fait face à présent.",
  choix: [
    { texte: "Si vous souhaitez le combattre", vers: "90" },
    { texte: "Si vous préférez prendre la fuite", vers: "163" }
  ]
  },
  {
  id: "112",
  texte: "Le pont s'écrase contre la paroi rocheuse dans un grand fracas. Utilisez la Table de Hasard pour obtenir un chiffre. Si votre total actuel d'ENDURANCE est inférieur à 10, vous devrez déduire 3 points du chiffre que vous aurez tiré. Si, en revanche, votre total actuel d'ENDURANCE est supérieur à 20, vous ajouterez 3 points au chiffre donné par la Table.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Chute du pont",
        texte: "Endurance <10 → -3, >20 → +3. 0-4 → 42, 5-12 → 303 (couverture complète).",
        branches: {
        "0-4": { vers: "42" },
        "5-12": { vers: "303" }
      }
      }
  },
  {
  id: "113",
  texte: "Vous pénétrez dans la forêt et vous descendez le flanc de la colline en direction de la rivière Xane. Au bout de quelques mètres, la végétation devient trop dense pour que vous puissiez continuer à cheval. A contrecœur, vous faites donc signe à vos hommes de descendre de selle pour poursuivre votre chemin à pied. Vous parvenez bientôt au bord de la rivière dont vous remontez le courant parsemé d'écume. Vous escaladez ainsi plusieurs terrasses rocheuses dont la surface a été rendue parfaitement lisse par la force du torrent. Vous parvenez ensuite à un endroit où de petits cours d'eau se jettent dans la rivière. Vous apercevez alors six brigands qui donnent des coups de lance dans l'eau bouillonnante le long de la berge. Sur la rive opposée, des poissons gris sont entassés à côté d'un chariot attelé. Vous reconnaissez aussitôt ce chariot : il appartient à la cavalerie du Sommerlund.",
  choix: [
    { texte: "Si vous avez atteint le rang Kaï de Guerrier", vers: "166" },
    { texte: "Sinon, vous pouvez lancez une attaque surprise contre les bandits", vers: "14" },
    { texte: "Si vous préférez essayer de traverser la rivière à l'abri des rochers", vers: "316" },
    { texte: "Enfin, si vous pensez qu'il serait imprudent de traverser à cet endroit, vous pouvez rebrousser chemin", vers: "232" }
  ]
  },
  {
  id: "114",
  texte: "Vous ordonnez à vos hommes de se préparer au combat et vous faites signe à l'un des fils du tenancier de la taverne d'ouvrir la porte. A peine a-t-il fait glisser la barre de fer qui la verrouille que la porte s'ouvre à la volée. Une douzaine de brigands, trempés par la pluie, font alors irruption dans la taverne, leurs boucliers en avant, alignés bord contre bord. Vos hommes se précipitent pour tenter de les repousser ; frappant en tous sens en direction des têtes et des bras qui émergent parfois de derrière les boucliers ; quelques instants plus tard cependant, d'autres bandits envahissent à leur tour la taverne et vos soldats sont contraints de battre en retraite. Soudain, un Guerrier de haute taille vêtu d'une armure écarlate franchit le mur de boucliers et se précipite vers vous en brandissant son épée. Il vous est impossible de prendre la fuite et vous devrez combattre ce Guerrier Pillard jusqu'à la mort de l'un de vous deux.",
  suite: "295",
  combat: { nom: "Guerrier Pillard", habilete: 16, endurance: 25 }
  },
  {
  id: "115",
  texte: "Tandis que le bateau franchit l'arcade aménagée dans le mur situé au sud, vous ramenez votre cape de Seigneur Kaï autour de vos épaules en relevant le capuchon. Vous venez en effet de pénétrer dans un tunnel dont le plafond laisse échapper des gouttes d'eau couleur de rouille qui tachent les cheveux et les tuniques de vos hommes. Vous ramez pendant un kilomètre et demi environ avant d'arriver dans une petite caverne. Un escalier émergeant de la rivière mène à une autre arcade s'ouvrant dans la paroi rocheuse.",
  choix: [
    { texte: "Si vous souhaitez aborder au pied de cet escalier pour explorer le tunnel au-delà de l'arcade", vers: "8" },
    { texte: "Si vous préférez continuer à descendre la rivière en direction du sud", vers: "240" }
  ]
  },
  {
  id: "116",
  texte: "« J'espérais bien que le roi enverrait un détachement pour partir à notre recherche, dit le capitaine Gayal qui a retrouvé à présent toutes ses forces. Je commençais à être fatigué de cette ville. Vous vous redressez sur votre paillasse et vous remerciez le capitaine. En agissant avec courage et au moment opportun, il vous a sauvé d'une mort certaine. « Ce n'est rien, comparé à vos exploits, Loup Solitaire, répond-il. Votre vaillance est légendaire et votre présence ici vaut celle de cent hommes. » Il vous demande de lui parler de votre mission et vous lui racontez les événements qui vous ont conduit à le retrouver : votre marche vers le sud, la perte de vos hommes, la traversée des mines de Maaken et les brigands. « Oui, les brigands, les hommes d'un certain Barraka, dit le capitaine Gayal d'une voix qui exprime tout le mépris qu'il leur porte, à eux et à leur chef. Nous avons eu tous deux à souffrir des méfaits de Barraka. Il y a un mois, il m'a tendu une embuscade sur la voie de Ruanon en compagnie de ses renégats vassagoniens. Nous étions largement surpassés en nombre et le combat fut acharné, mais finalement nous avons réussi à leur échapper et à nous réfugier ici à Ruanon. Depuis ce temps, nous avons été assiégés sans relâche en espérant qu'on nous enverrait de l'aide. Nous avons suffisamment d'armes pour leur résister, mais nous commençons à manquer de vivres et d'eau. » Vous lui demandez ensuite ce qu'il est advenu des habitants de Ruanon. « La plupart sont devenus des esclaves de Barraka qui les a emmenés dans les mines pour lui servir de main d'œuvre, répond-il. En dehors de vous, un seul homme a pu s'échapper des mines et survivre aux attaques des Chiens de Guerre et des patrouilles de brigands. Cet homme est le baron Oren Vanalund. Venez, je vais vous conduire auprès de lui. » Le capitaine Gayal vous mène à la plus haute salle de la tour de guet et pousse une porte ornée de ferrures.",
  choix: [
    { texte: "La vision qui s'offre alors à vous vous remplit de chagrin et de pitié", vers: "318" }
  ]
  },
  {
  id: "117",
  texte: "Vous arrivez bientôt à un endroit du tunnel où des travaux sont en cours. Le sol s'est effondré et une passerelle de bois vermoulu enjambe un trou béant. Vous êtes fatigué et vous ne remarquez pas que votre Torche est sur le point de s'éteindre. Vous vous trouvez au milieu de la passerelle lorsque la flamme vacille puis meurt. Vous êtes alors plongé dans les ténèbres. Si vous n'avez pas de Torche de secours, vous devrez avancer sur le pont dans une totale obscurité. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez les Disciplines Kaï du Sixième Sens ou de l'Orientation, ajoutez 3 au chiffre que vous aurez tiré.",
  choix: [
    { texte: "Si vous disposez d'une autre Torche", vers: "22" }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "99", texte: "Si votre total est de 0 à 6," },
        "7-12": { vers: "256", texte: "De 7 à 12," }
      }
      }
  },
  {
  id: "118",
  texte: "La porte de fer est fermée à clé. Elle comporte une grosse poignée à laquelle est suspendu un Fouet. Si vous voulez prendre ce Fouet, inscrivez-le sur votre Feuille d'Aventure dans la case des objets contenus dans votre Sac à Dos. Si vous ne possédez pas cette Clé, ou si vous ne souhaitez pas ouvrir la porte, vous pouvez quitter les lieux en empruntant un escalier en colimaçon.",
  choix: [
    { texte: "Si vous possédez une Clé de Fer, vous pouvez ouvrir la porte", vers: "308", requis: {"objet":"cle-fer"} },
    { texte: "Pour monter cet escalier", vers: "170" },
    { texte: "Si vous préférez descendre les marches", vers: "228" }
  ]
  },
  {
  id: "119",
  texte: "« Plus un geste, Barraka ! Sa vie ne t'appartient pas ! » Vos paroles ont résonné en dominant le mugissement du vent. Le renégat se tourne pour vous faire face en éclatant d'un rire aussi sonore que votre ordre. Il s'avance alors vers vous en serrant dans son poing le poignard à la lame enflammée. Vous dégainez votre arme et vous entrez dans le temple.",
  choix: [
    { texte: "Si vous souhaitez engager le combat avec ce Seigneur de la Guerre", vers: "296" },
    { texte: "Si vous préférez essayer de libérer Madelon", vers: "73" }
  ]
  },
  {
  id: "120",
  texte: "Après avoir chevauché pendant plusieurs heures, vous arrivez à un croisement. Un grand panneau de signalisation indique deux directions : Ruanon au sud, distante de 95 km ; Eshnar à l'est, à 65 km.",
  choix: [
    { texte: "Si vous souhaitez prendre la direction du sud", vers: "33" },
    { texte: "Si vous préférez aller à l'est", vers: "92" }
  ]
  },
  {
  id: "121",
  texte: "A peine votre adversaire s'est-il effondré à vos pieds qu'une autre vague d'attaquants se rue en avant. Vos hommes sont courageux et inflexibles, mais l'ennemi les surpasse en nombre et vous ne pourrez pas le contenir indéfiniment. « Dans la mine ! » hurlezvous alors, tandis que les agresseurs se préparent à lancer une nouvelle charge. Mais quatre de vos hommes seulement parviennent jusqu'à la mine.",
  choix: [
    { texte: "Les autres ont été tués et leurs corps restent étendus sur le champ de bataille, sous leurs boucliers", vers: "248" }
  ]
  },
  {
  id: "122",
  titre: "Barraka",
  texte: "Vous dégainez votre arme et la plainte du vent retentit aussitôt avec plus de force, comme animée d'une brusque colère. Il semble s'infiltrer en vous, faisant naître dans votre esprit de terribles images d'horreur et de mort. Barraka vous voit hésiter et vous porte un coup qui vous blesse à la joue. Vous perdez aussitôt 1 point d'ENDURANCE. Cette soudaine douleur, cependant, vous ramène à la réalité et le combat s'engage avec votre cruel ennemi. BARRAKA HABILETÉ: 25 ENDURANCE: 29 II vous attaque en même temps à l'aide d'une redoutable Puissance Psychique, qui réduira de 4 points votre total d'HABILETÉ pendant toute la durée de l'affrontement, si vous ne maîtrisez pas la Discipline Kaï du Bouclier Psychique. La force exceptionnelle de sa volonté le rend en revanche invulnérable à la Discipline Kaï de la Puissance Psychique.",
  suite: "350",
  effets: { endurance: -1 },
  combat: { nom: "Barraka", habilete: 25, endurance: 29, immunisePsychique: true, malusPsychique: 4, description: "Barraka vous attaque avec Puissance Psychique : -4 Habileté si vous n'avez pas Bouclier Psychique. Immunisé à Puissance Psychique." }
  },
  {
  id: "123",
  texte: "Vous escaladez la colline boisée. Vous avez la gorge sèche et votre cœur bat avec force comme s'il était près d'éclater, mais vous ne voulez pas prendre le risque de ralentir votre allure. Quatre heures passent avant que vous ne soyez certain d'avoir distancé l'ennemi. La nuit est presque tombée lorsque vous découvrez par hasard un étroit passage aux flancs escarpés, creusé dans la colline pour donner accès à une galerie de mines. Pendant des centaines d'années, les filons de la chaîne de Maaken ont représenté tout à la fois une bénédiction et un fléau pour ceux qui venaient ici chercher fortune. Des hommes, en effet, y ont trouvé des richesses qui dépassaient leurs espérances les plus insensées, tandis que d'autres ont péri sans laisser de traces dans un labyrinthe de tunnels sombres et glacés. Vous examinez l'entrée de la mine. Si vous parvenez à trouver l'un des tunnels principaux, vous devriez pouvoir atteindre Ruanon par ces souterrains. Quelques mètres plus loin, vous découvrez une caisse de bois contenant 6 Torches et 1 Briquet d'Amadou. Les galeries de mines sont obscures et vous aurez besoin d'au moins une Torche pour vous éclairer. Vous avez cependant le droit d'en prendre davantage si vous le désirez, mais rappelez-vous que chaque Torche compte pour un objet dans votre Sac à Dos.",
  choix: [
    { texte: "Faites les modifications nécessaires sur votre Feuille d'Aventure avant d'entrer dans les mines", vers: "315" }
  ]
  },
  {
  id: "124",
  texte: "Un bouclier mobile muni de roues avance lentement sur le champ de bataille semé de cadavres. Il s'approche de la barricade et des flèches bientôt se fichent dans l'épaisseur de son panneau de bois : ce sont les hommes du capitaine Gayal qui tirent sans relâche pour essayer d'atteindre les attaquants dissimulés derrière le bouclier. Soudain, une silhouette vêtue d'une toge surgit en brandissant une baguette noire pointée vers la barricade. L'homme est aussitôt abattu par une flèche, mais il a eu le temps de faire jaillir de sa baguette une gigantesque boule de feu qui traverse la plaine puis vient exploser dans un fracas terrifiant sur la barricade. Des corps sont projetés en tous sens et la barricade elle-même vole en éclats. A travers un nuage de fumée et de cendres, vous distinguez bientôt une ligne de cavaliers qui lancent une charge en galopant dans la plaine. Les soldats sont coiffés de grands heaumes empanachés et protégés par des plastrons d'acier d'un rouge écarlate. Dans le sillage de la boule de feu, ils submergent les restes de la barricade en menant une attaque sans merci. L'un des cavaliers se précipite sur vous, la lance pointée sur votre poitrine.",
  choix: [
    { texte: "Si vous souhaitez combattre cet adversaire", vers: "333" },
    { texte: "Si vous préférez courir vers la tour de guet", vers: "107" }
  ]
  },
  {
  id: "125",
  texte: "Vous esquissez un sourire en tirant sur la corde de toutes vos forces puis vous vous tournez alors vers vos poursuivants en étant convaincu qu'ils vont être précipités dans le puits de mine. Malheureusement, ce n'est pas le pont qui s'abat, mais une lourde herse qui bloque instantanément l'entrée du tunnel. Vos ennemis éclatent d'un rire sardonique et dégainent leurs armes en se lançant à l'attaque. Il vous est impossible de prendre la fuite et il vous faut les combattre un par un à mesure qu'ils franchissent le pont.",
  choix: [
    { texte: "HABILETÉ ENDURANCE CHEF DES GARDES 20 30 1er GARDE DES TUNNELS 18 26 2< GARDE DES TUNNELS 16 24 Si vous êtes vainqueur", vers: "261" }
  ]
  },
  {
  id: "126",
  texte: "L'obscurité de la nuit descend bientôt sur la Voie de Ruanon et vous êtes contraints de vous arrêter pour établir votre campement. Vos hommes allument un grand feu et des sentinelles montent la garde pour prévenir toute attaquesurprise au cours de la nuit. Il vous faut à présent prendre un Repas, sinon vous perdrez trois points d'ENDURANCE. La nuit se passe sans incident et vous levez le camp à l'aube en poursuivant votre chemin à travers la Contrée des Pillards. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "25", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "171", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "127",
  texte: "Tandis que vous repoussez le corps de l'Élix qui vient de tomber mort, une bataille désespérée continue de faire rage autour de vous. Deux de vos hommes sont étendus sur le sol, la gorge déchirée par les féroces créatures. Le cadavre d'un autre Elix transpercé par une épée s'est effondré sur un troisième patrouilleur qui reste coincé sous le monstre mort. Le quatrième patrouilleur a atteint l'escalier et porte des coups désespérés à la tête d'une des créatures qui lui a enfoncé les dents dans le pied. Les Gardes ne donnent plus signe de vie. Ils ont été précipités au fond du puits de mine dans les profondeurs d'une rivière souterraine.",
  choix: [
    { texte: "Si vous souhaitez porter secours au patrouilleur coincé sous le cadavre de l'Élix", vers: "178" },
    { texte: "Si vous préférez prêter main-forte à celui qui se bat au pied de l'escalier", vers: "245" }
  ]
  },
  {
  id: "128",
  texte: "Vous vous précipitez vers la trappe mais le Guerrier tente d'empêcher votre fuite. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, vous ajouterez 3 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "103", texte: "Si le total obtenu est de 0 à 4," },
        "5-12": { vers: "98", texte: "De 5 à 12," }
      }
      }
  },
  {
  id: "129",
  texte: "Vous arrivez bientôt à un endroit du tunnel où le sol s'est effondré. Une profonde crevasse s'est formée que l'on peut traverser grâce à une passerelle de fortune. Cette passerelle ellemême est trouée en plusieurs endroits, mais vous parvenez malgré tout à la franchir. Vous avez faim à présent et il vous faut prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Faites les modifications nécessaires sur votre Feuille d'Aventure, puis", vers: "309" }
  ],
  effets: { repasObligatoire: true }
  },
  {
  id: "130",
  texte: "Pendant plus d'une heure vous suivez la berge de la rivière qui s'enfonce dans les contreforts de la chaîne de Maaken. La rivière Xane est large et son cours rapide. Vous n'apercevez ni pont ni gué dans la direction où vous allez.",
  choix: [
    { texte: "Si vous souhaitez retourner au hangar à bateaux", vers: "68" },
    { texte: "Si vous préférez continuer à longer la rivière en direction de l'est", vers: "331" }
  ]
  },
  {
  id: "131",
  texte: "La porte n'est pas fermée à clé. Vous l'ouvrez et vous pénétrez dans un tunnel plongé dans la pénombre. Cette partie de la mine semble avoir été creusée récemment. Les étais sont neufs en effet, et le sol n'a pas encore été égalisé par le passage répété des mineurs et des chariots. Ce tunnel mène vers le sud sur 1 kilomètre et demi.",
  choix: [
    { texte: "Soudain, il tourne brusquement vers l'ouest", vers: "185" }
  ]
  },
  {
  id: "132",
  texte: "Vos hommes attachent leurs chevaux puis vous suivent à l'intérieur de la taverne. Une vieille femme se tient derrière le bar. Elle a le visage tendu et creusé de rides, comme si elle souffrait. Elle porte des vêtements d'homme : une chemise et un pantalon à carreaux. La salle est vide, mais les tables sont encombrées de chopes de bière encore à moitié pleines.",
  choix: [
    { texte: "Si cette taverne vous met mal à l'aise", vers: "67" },
    { texte: "Si vous souhaitez poser des questions à la vieille femme", vers: "287" }
  ]
  },
  {
  id: "133",
  texte: "Les brigands vous cernent et s'avancent vers vous bien décidés à vous tuer. Ils vous attaquent simultanément et vous devrez les combattre en les considérant comme un seul et même adversaire. PATROUILLE DE BRIGANDS HABILETÉ: 18 ENDURANCE: 35 Vous avez le droit de prendre la fuite à tout moment, en courant vers Ruanon.",
  choix: [
    { texte: "Si vous perdez des points d'ENDURANCE au cours de ce combat", vers: "17" },
    { texte: "Si vous remportez la victoire sans perdre un seul point d'ENDURANCE", vers: "265" }
  ],
  combat: { nom: "Patrouille de Brigands", habilete: 18, endurance: 35, fuite: [{ texte: "Prendre la fuite vers Ruanon", vers: "307" }] }
  },
  {
  id: "134",
  texte: "Vous arrivez bientôt à l'entrée d'une galerie de mine. Deux rangées d'empreintes de pas s'enfoncent dans l'obscurité du tunnel. A en juger par leur forme et leur taille, elles ont été laissées par deux de vos éclaireurs disparus. Vous criez dans la galerie, mais personne ne vous répond.",
  choix: [
    { texte: "Si vous souhaitez entrer dans cette mine", vers: "91" },
    { texte: "Si vous préférez abandonner vos recherches, revenez le long du sentier de la colline", vers: "191" }
  ]
  },
  {
  id: "135",
  texte: "Les étendues plates et désolées du Pays Sauvage n'offrent aucun abri pour vous dissimuler aux yeux des hordes de brigands. Ces derniers sont quatre fois plus nombreux que vous et la vie ou la mort de toute votre troupe dépend à présent de la décision que vous prendrez.",
  choix: [
    { texte: "Si vous souhaitez partir à l'attaque des brigands dans l'espoir qu'une action audacieuse saura les effrayer", vers: "284" },
    { texte: "Si vous préférez séparer vos hommes en deux groupes, vous partirez d'un côté avec dix patrouilleurs, tandis que les autres prendront la direction de l'ouest pour essayer d'attirer les bandits vers les monts Durncrag", vers: "211" },
    { texte: "Enfin, si vous estimez plus judicieux de galoper vers le sud pour essayer d'atteindre la forêt de Ruanon avant que les bandits n'aient pu vous rattraper", vers: "30" }
  ]
  },
  {
  id: "136",
  texte: "L'homme blessé est en état de choc. Son bras gauche est complètement écrasé au-dessus et au-dessous du coude, et il a plusieurs côtes cassées.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "313", requis: {"discipline":"guerison"} },
    { texte: "Sinon", vers: "216" }
  ]
  },
  {
  id: "137",
  titre: "Victoire à la barricade",
  texte: "Tout autour de la barricade, les ennemis refluent en désordre. Les cornes de guerre des brigands sonnent la retraite, exhortant les Guerriers vaincus à fuir le champ de bataille. Jubilant, le capitaine Gayal émerge de la fumée les yeux brillants comme des joyaux sous les bords de son casque cabossé. «Nous avons triomphé, Loup solitaire, s'exclame-t-il, l'ennemi est vaincu ! » Les hommes du capitaine ont entrepris de rebâtir la barricade et de soigner leurs camarades blessés. La vue des soldats sommerlundais morts dans la bataille vous attriste, mais vous vous consolez en songeant que les pertes de vos agresseurs sont infiniment plus lourdes. Le capitaine vous emmène à la tour de guet où l'on soigne vos blessures à l'aide d'herbes de Laumspur. Vous regagnez aussitôt 6 points d'ENDURANCE. « Nous avons vaincu ces brigands, mais je crains bien qu'il ne s'agisse là que d'un bref répit, dit le capitaine dont le visage à présent a pris une expression grave et sombre. Le sacrifice de la fille du baron Vanalund doit être empêché à tout prix si nous voulons éviter la catastrophe. Nous n'aurions pas la force en effet de nous opposer aux légions des morts ressuscités de leur tombe. » Les vers de la prophétie vous reviennent aussitôt en mémoire et un frisson vous parcourt l'échiné quand vous repensez à la menace qu'ils font peser. Dans trois jours, lorsque la lune sera pleine, Barraka sacrifiera la fille du baron dans le temple souterrain et ce sacrifice libérera les morts des gorges de Maaken, le gouffre maudit.",
  suite: "12",
  choix: [
    { texte: "Il vous faut à tout prix empêcher ce sacrifice", vers: "12" }
  ],
  effets: { endurance: 6 }
  },
  {
  id: "138",
  texte: "Vous êtes arrivé au milieu de la rampe lorsqu'un Garde se tourne pour vous faire face. Il bat des paupières et frotte ses yeux injectés de sang d'un air incrédule. Profitant de l'effet de surprise, vous vous précipitez sur lui en espérant pouvoir le frapper avant qu'il n'ait pleinement réalisé la situation. Alors qu'il s'apprête à pousser un cri, vous lui portez un coup qui le précipite par-dessus le bord de la rampe. L'autre Garde tire son épée et se relève tant bien que mal. De toute évidence il est ivre et rendu fou furieux par votre attaque. Il se rue alors sur vous comme un chien enragé.",
  choix: [
    { texte: "GARDE IVRE HABILETÉ : 13 ENDURANCE : 29 Vous pouvez prendre la fuite à tout moment en courant dans le tunnel situé à ce niveau", vers: "81" },
    { texte: "Si vous remportez la victoire", vers: "152" }
  ],
  combat: { nom: "Garde Ivre", habilete: 13, endurance: 29 }
  },
  {
  id: "139",
  texte: "Vous envoyez trois de vos hommes dans la vallée avec ordre de reconnaître la grand-route et d'inspecter la forêt qui la borde pour y découvrir la présence d'éventuels brigands. Vous donnez pour consigne à vos éclaireurs de revenir faire leur rapport dans deux heures. Vous avez faim à présent et il vous faut prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE. En dépit de la fatigue, vos patrouilleurs, tous leurs sens en alerte, sont prêts à l'action. En effet, il y a maintenant plus de trois heures que vos éclaireurs sont partis et aucun d'entre eux n'a encore donné signe de vie.",
  choix: [
    { texte: "Si vous souhaitez envoyer trois autres éclaireurs dans la vallée", vers: "206" },
    { texte: "Si vous préférez attendre l'aube pour partir à leur recherche", vers: "330" },
    { texte: "Enfin, si vous estimez qu'il est beaucoup trop dangereux de rester ici, vous pouvez repartir vers l'est en direction de la ville d'Eshnar", vers: "92" }
  ],
  effets: { repasObligatoire: true }
  },
  {
  id: "140",
  texte: "L'obscurité du crépuscule enveloppe l'avant-poste assiégé de Ruanon et vous profitez de la nuit pour traverser la plaine jonchée de cadavres en direction du sud. Une ancienne route mène à Maaken, mais elle est contrôlée par les Guerriers vassagoniens. Ils y sont rassemblés par groupes, soignant leurs blessés et ruminant leur défaite. Bien qu'ils soient abattus et démoralisés, ils n'en restent pas moins des ennemis mortels et il serait trop dangereux d'essayer de franchir leurs lignes ; il vous faut donc passer par la forêt pour pouvoir vous cacher.",
  choix: [
    { texte: "Si vous souhaitez pénétrer dans la forêt à droite de la route", vers: "70" },
    { texte: "Si vous préférez traverser la forêt du côté gauche", vers: "314" }
  ]
  },
  {
  id: "141",
  texte: "Vous n'êtes pas allé bien loin, lorsque soudain éclate un orage qui déverse sur vos têtes une pluie torrentielle. En quelques minutes, la route sèche et poussiéreuse se transforme en marécage. Il vous sera impossible d'établir votre campement sous cette pluie battante et vous décidez donc de poursuivre votre chemin toute la nuit en espérant que l'orage cessera bientôt. Au cours de cette nuit passée à cheval, il vous faudra prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Au matin, la pluie a cessé, mais cette épreuve vous a épuisés, vous et vos hommes", vers: "253" }
  ]
  },
  {
  id: "142",
  texte: "L'aube arrive, sinistre et pluvieuse. Un voile de bruine enveloppe la cité fantôme et les gémissements lugubres des vents qui soufflent au fond des gorges de Maaken vous mettent mal à l'aise. Vous contemplez longuement les ruines, votre cape de Seigneur Kaï serrée autour de vos épaules pour vous protéger du froid et de l'humidité. C'est ici même, au temps de la lune noire, que le roi Ulnar du Sommerlund tua le Seigneur Vashna, le plus puissant des Maîtres des Ténèbres. A l'issue d'un mortel combat livré au bord même de cet abîme, le redoutable Maître des Ténèbres fut tué par le Glaive de Sommer. On dit que son cri de mort, lorsqu'il tomba dans le gouffre, résonnera dans ces profondeurs jusqu'au jour où Vashna se relèvera pour mener sa vengeance contre le Sommerlund et la maison d'Ulnar. Vous sentez votre estomac se contracter à la pensée que ce jour est peut-être venu. Cinq heures durant, vous observez la ville morte en notant le moindre détail. Le premier vers de l'étrange prophétie tourne sans cesse dans votre tête : « Au soir de pleine lune, en un temple profond... » Ce temple, de toute évidence, se trouve quelque part sous terre et il doit exister un moyen d'y accéder. Mais par où peut-on y entrer ? Vous étudiez chaque fissure du terrain accidenté et vous arrivez à la conclusion que seuls deux chemins peuvent y mener. Il faut soit franchir la porte d'une crypte, gardée par deux Guerriers vassagoniens, soit descendre un escalier de marbre qui s'enfonce sous terre entre deux colonnes en ruines.",
  choix: [
    { texte: "Si vous souhaitez essayer de pénétrer dans le temple par la porte de la crypte que surveillent les Gardes", vers: "183" },
    { texte: "Si vous préférez descendre l'escalier de marbre qui, lui, n'est pas gardé", vers: "270" }
  ]
  },
  {
  id: "143",
  texte: "Quels que soient vos efforts, l'étai refuse de bouger. Soudain, vos poursuivants émergent des tunnels obscurs et vous attaquent. Ils ne sont que deux, mais d'autres les suivent un peu plus loin. Le combat est inévitable, et vous allez devoir les affronter un par un.",
  choix: [
    { texte: "HABILETÉ ENDURANCE 1e GARDE DES TUNNELS 16 22 2e GARDE DES TUNNELS 15 21 Si vous parvenez à tuer le premier Garde, vous aurez le droit de p", vers: "87" },
    { texte: "Si vous tuez les deux Gardes", vers: "230" }
  ]
  },
  {
  id: "144",
  titre: "Mort — §144",
  texte: "Vous sautez du chariot et vous courez à toutes jambes sans vous douter de ce qui vous attend. Une profonde excavation s'ouvre en effet à quelques mètres et vous y tombez tête la première. Avant de disparaître dans ce gouffre d'une trentaine de mètres de profondeur, vous avez le temps d'apercevoir l'expression horrifiée de votre ami anonyme. Quelques instants plus tard, vous vous fracassez le crâne. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §144"
  },
  {
  id: "145",
  texte: "Le tunnel descend sur des kilomètres, s'enfonçant dans la roche. De temps à autre, vous sursautez en voyant surgir des essaims de mouches luisantes ou des chauves-souris qui volettent autour de vous dans l'obscurité, attirées par la chaleur de votre corps. Vous atteignez enfin une salle dans laquelle une petite cabane de bois a été construite contre le mur. Vous êtes épuisé et quelques heures de sommeil vous seraient nécessaires.",
  choix: [
    { texte: "Si vous souhaitez entrer dans la cabane pour vous y reposer", vers: "322" },
    { texte: "Si vous préférez poursuivre votre chemin en ignorant votre fatigue", vers: "162" }
  ]
  },
  {
  id: "146",
  texte: "Le brigand tombe dans l'eau et son cadavre disparaît. Vous sautez d'une pierre à l'autre à la poursuite des deux Pillards qui ont survécu à l'embuscade et qui essaient à présent de rejoindre la rive opposée pour donner l'alerte à leurs camarades, restés dans le chariot. Les brigands surgissent bientôt du véhicule et vous constatez alors avec horreur qu'ils sont tous armés d'arcs. Ils les tendent aussitôt en visant vos patrouilleurs.",
  choix: [
    { texte: "Vous hurlez pour avertir vos hommes, mais à cet instant une flèche à la pointe d'acier vous effleure le sommet du crâne en vous précipitant dans les eaux sombres et bouillonnantes de la rivière Xane", vers: "272" }
  ]
  },
  {
  id: "147",
  texte: "Le Garde vous entend approcher et fait aussitôt volte-face. Il vous regarde d'un air stupéfait puis tire son épée. La surprise de votre attaque vous donne un avantage au cours du premier Assaut. De ce fait, vous ne perdrez aucun point d'ENDURANCE, quelles que soient les indications données par la Table des Coups Portés. A partir du deuxième Assaut, le combat se poursuivra normalement.",
  suite: "280",
  combat: { nom: "Garde du Pont", habilete: 14, endurance: 23, sansDefenseAssauts: 1, description: "Surprise : vous ne perdez aucun point d'Endurance au premier Assaut." }
  },
  {
  id: "148",
  texte: "« Rassemblement ! lance la voix du capitaine Gayal dominant le fracas de la bataille. Rassemblez-vous autour de moi, soldats du Sommerlund ! » Le courageux capitaine regroupe ses soldats protégés par des boucliers et charge le flanc des cavaliers ennemis qui vacillent et reculent. Le capitaine et sa troupe parviennent à semer la panique dans les rangs adverses et, bientôt, un héraut vassagonien, son armure écarlate cabossée et le visage éclaboussé de sang, s'éloigne de la bataille pour sonner la retraite. Vous voyez alors les brigands survivants lancer leurs montures au galop, cherchant désespérément à s'échapper par la brèche ouverte dans la barricade. Submergés par la peur et la fatigue, ils s'élancent sur leur propre troupe d'infanterie qui s'avançait en renfort. Les soldats à pied sont ainsi renversés et écrasés par la cavalerie qui les piétine. Le capitaine Gayal mène ses hommes jusqu'à la barricade et une volée de flèches mortelles s'abat alors sur l'ennemi en déroute. Pour les Vassagoniens c'est le coup fatal. Ils jettent leurs armes et s'enfuient à toutes jambes pour essayer d'échapper à la pluie de flèches qui tombe d'un ciel envahi de fumée.",
  choix: [
    { texte: "Un cri de guerre fier et strident les poursuit à travers la plaine : « Vive le Sommerlund ! »", vers: "137" }
  ]
  },
  {
  id: "149",
  texte: "Un terrible sentiment de culpabilité vous envahit lorsque vous reconnaissez ces Amulettes. Ce sont en effet les symboles d'un ordre de moines qu'on appelle « les Rédempteurs » ; il s'agit de pèlerins dont la vie est consacrée à la prière et à la guérison.",
  choix: [
    { texte: "Vous vous maudissez d'avoir agi si hâtivement et vous rattachez soigneusement ces colliers autour du cou des deux moines", vers: "188" }
  ]
  },
  {
  id: "150",
  texte: "Le sentier mène à l'entrée d'une galerie de mine à moitié masquée par des feuillages. Vous jetez un coup d'oeil dans ce passage obscur et vous constatez que plusieurs poutres et étais se sont effondrés. Des monticules de terre couverts de mousse parsèment le sol du tunnel et une rigole d'eau teintée par le minerai serpente parmi eux. Les traces de sabots s'interrompent devant l'entrée, mais deux rangées d'empreintes de pas s'enfoncent à l'intérieur de la mine.",
  choix: [
    { texte: "Si vous souhaitez envoyer vos hommes à la recherche des chevaux disparus", vers: "164" },
    { texte: "Si vous préférez suivre les traces de pas à l'intérieur de la galerie", vers: "288" },
    { texte: "Enfin, si vous préférez interrompre les recherches, vous pouvez revenir sur vos pas le long du sentier de la colline", vers: "6" }
  ]
  },
  {
  id: "151",
  texte: "Le sol du tunnel est couvert de restes décomposés de rongeurs. Le bruit des os qui craquent sous les pas de vos hommes, à mesure qu'ils avancent parmi ces débris pestilentiels, vous fait grimacer de dégoût. Vous arrivez bientôt à un endroit où le tunnel tourne brusquement vers l'est. La lumière d'une Torche se reflète sur les murs de pierre brute. En jetant un coup d'œil à l'angle du tunnel, vos soupçons se trouvent confirmés : deux Guerriers vêtus d'armures montent en effet la garde devant un puits qui s'enfonce dans le sol d'une salle éclairée par des Torches.",
  choix: [
    { texte: "Si vous souhaitez faire signe à vos hommes d'attaquer les Gardes", vers: "320" },
    { texte: "Si vous préférez attirer les Gardes dans le tunnel afin de les capturer vivants", vers: "197" }
  ]
  },
  {
  id: "152",
  texte: "En fouillant le cadavre du Garde, vous trouvez les objets suivants : -1 Epée, - 6 Pièces d'Or, - des vivres équivalants à deux Repas -1 Clé de Cuivre. Vous pouvez prendre un ou plusieurs de ces objets à condition de les noter sur votre Feuille d'Aventure. Au moment où vous vous apprêtez à pénétrer dans le tunnel, un autre Garde apparaît au pied de la rampe. Il vous voit et donne aussitôt l'alerte en soufflant dans la corne de guerre qu'il porte autour du cou.",
  suite: "200",
  choix: [
    { texte: "Vous ne perdez pas de temps à attendre de voir ce qui va se passer et vous vous hâtez de fuir à toutes jambes dans le tunnel, tandis que les échos de la corne retentissent encore à vos oreilles", vers: "81" }
  ],
  effets: { or: 6, objets: [{"id":"epee"},{"id":"repas"}] }
  },
  {
  id: "153",
  texte: "Vous tirez votre flèche qui siffle en direction du chef des bandits, mais celui-ci la voit et lève son bouclier d'acier. Votre flèche ricoche sur le métal et vient se fracasser contre le mur de la tour de guet. Avant que vous n'ayez pu tirer à nouveau, votre arc vous saute des mains ; c'est un Guerrier en armure qui, d'un violent coup de pied, vous a ainsi désarmé. Il se tient au-dessus de vous, debout sur la barricade, et vous ne pouvez éviter son attaque. GUERRIER VASSAGONIEN HABILETÉ: 17 ENDURANCE: 26 Vous aviez remis votre arme au fourreau pour pouvoir faire usage de votre arc. Malheureusement, le Guerrier bondit sur vous avant que vous n'ayez pu dégainer à nouveau. Vous n'avez donc plus d'arme et vous devrez combattre à mains nues pendant les deux premiers Assauts. De ce fait, vous réduirez de 4 points votre total d'HABILETÉ. Si lors du troisième Assaut vous êtes toujours en vie, vous parviendrez à tirer votre arme et votre total d'HABILETÉ retrouvera son niveau habituel.",
  suite: "174",
  combat: { nom: "Guerrier Vassagonien", habilete: 17, endurance: 26, description: "Vous combattez à mains nues pendant les 2 premiers Assauts : -4 Habileté." }
  },
  {
  id: "154",
  texte: "Lorsque vous êtes certain que les bandits ne vous poursuivent plus, vous vous arrêtez pour rassembler vos soldats épuisés. Dix hommes seulement ont échappé à la bataille, les autres ont été soit capturés, soit tués avant d'avoir pu s'enfuir. A présent que la route qui mène au Sommerlund est coupée par les bandits, vous n'avez d'autre choix que de continuer vers le sud. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-2": { vers: "120", texte: "Si vous tirez le 0, le 1 ou le 2," },
        "3-9": { vers: "51", texte: "Si vous tirez un chiffre entre 3 et 9," }
      }
      }
  },
  {
  id: "155",
  texte: "Derrière la meute des Chiens de Guerre, vous apercevez une douzaine de brigands, armés d'arcs et de flèches, qui se rapprochent. Même si vous parveniez à survivre à l'attaque des Chiens de Guerre, ces archers auraient bientôt raison de vous.",
  choix: [
    { texte: "Il ne vous reste donc plus qu'à prendre la fuite et vous vous mettez à courir à toutes jambes en direction de Ruanon", vers: "225" }
  ]
  },
  {
  id: "156",
  texte: "Le tunnel aboutit bientôt au fond d'un puits de mine à la paroi duquel est fixée une échelle qui mène à un autre tunnel situé à une centaine de mètres au-dessus. L'entrée de ce tunnel se trouve dans le mur ouest. Il n'y a pas d'autre issue au puits.",
  choix: [
    { texte: "Si vous souhaitez monter l'échelle", vers: "212" },
    { texte: "Si vous préférez rebrousser chemin pour prendre le tunnel orienté au sud", vers: "101" }
  ]
  },
  {
  id: "157",
  texte: "Vous êtes à présent si fatigué qu'il vous faut à tout prix vous arrêter et dormir. Plusieurs heures de sommeil vous permettent de retrouver vos forces.",
  choix: [
    { texte: "Vous gagnez un point d'ENDURANCE et vous poursuivez votre exploration du tunnel", vers: "309" }
  ]
  },
  {
  id: "158",
  texte: "Votre estomac se retourne lorsque le bateau plonge en avant. Vous tombez pendant ce qui vous semble une éternité, avant de heurter tête la première la surface de l'eau. Le choc est tel que vous êtes assommé sur le coup. Vous perdez aussitôt 3 points d'ENDURANCE. Lorsque vous reprenez connaissance, vous êtes étendu à plat ventre sur un sol de boue et de gravier. Le sang vous bat aux tempes et vous avez l'impression que vos poumons sont en feu. Vous avez perdu votre Sac à Dos et tout ce qu'il contenait. Bien que votre vision soit encore trouble, vous vous apercevez très vite que vous êtes seul. Il n'y a plus trace autour de vous ni de vos hommes ni du bateau.",
  choix: [
    { texte: "Apportez les modifications nécessaires à votre Feuille d'Aventure, puis", vers: "219" }
  ]
  },
  {
  id: "159",
  texte: "Vous vous étendez parmi les blés et vous retenez votre souffle, les nerfs tendus comme des cordes de violon, en attendant que la patrouille soit passée. Des centaines de créatures minuscules grouillent le long des tiges jaunes. Votre corps tout entier commence à vous démanger. De toute évidence, ces insectes se sont introduits sous vos vêtements. La sueur ruisselle sur vos joues et les démangeaisons deviennent si insupportables que vous êtes sur le point de laisser échapper un cri. Vous vous retenez cependant tandis que les brigands passent à quelques centimètres de votre cachette sans remarquer le moins du monde votre présence. Lorsque vous êtes sûr qu'ils se sont suffisamment éloignés, vous vous relevez d'un bond et vous vous grattez frénétiquement. Vous découvrez alors avec horreur que vos jambes sont couvertes d'insectes qui se repaissent de votre sang. Vous vous débarrassez en hâte de vos vêtements, vous videz vos bottes de ces créatures et vous les arrachez de votre peau, avant de vous rhabiller et de poursuivre votre chemin le long du sentier.",
  choix: [
    { texte: "Les insectes vous ont fait perdre 2 points d'ENDURANCE en suçant votre sang", vers: "204" }
  ]
  },
  {
  id: "160",
  texte: "Une escorte de cinq patrouilleurs vous accompagne le long du sentier sinueux qui mène à la maison. Il s'agit d'une masure dont les murs de pierre brute sont recouverts d'une mousse humide. Elle est dépourvue de fenêtres et l'on y entre par une étrange porte ovale. Vous avez mis pied à terre et vous vous approchez de cette porte lorsqu'une voix d'homme à l'intérieur de la masure lance soudain : « Entrez, Loup Solitaire ! Je vous attendais. »",
  choix: [
    { texte: "Si vous souhaitez pousser la porte et entrer", vers: "84" },
    { texte: "Si vous préférez dégainer votre arme et ouvrir la porte d'un coup de pied", vers: "205" },
    { texte: "Enfin, s'il vous semble plus judicieux d'envoyer quelques-uns de vos hommes dans la maison", vers: "306" }
  ]
  },
  {
  id: "161",
  texte: "Vous relevez le capuchon de votre cape de Seigneur Kaï et vous vous accroupissez au fond du chariot vide en retenant votre souffle. Par un interstice entre deux planches, vous apercevez une procession d'hommes au visage hagard qui avancent vers vous en traînant les pieds. Des Guerriers Pillards les escortent en frappant ceux qui chancellent ou s'écartent des rangs. Une soudaine secousse vous indique que le chariot est à présent poussé le long du tunnel. En levant les yeux vous apercevez le visage ruisselant de sueur d'un homme qui se penche vers vous. « Fuyez à gauche quand je vous dirai : Allez-y ! » murmure l'homme. Il relève alors la tête et vous ne pouvez plus voir son visage. Lorsque le chariot émerge du tunnel, vous êtes ébloui par la lumière du soleil. A travers l'interstice vous parvenez à voir l'endroit vers lequel on pousse votre chariot. Il s'agit d'un portique sous lequel s'arrête la voie ferrée, à quelque 15 mètres au-dessus d'un énorme entassement de minerai. Vous n'avez pas l'occasion cependant de poursuivre longtemps votre contemplation : un ordre bref vous interrompt en effet : « Allez-y ! » murmure l'homme au visage ruisselant de sueur.",
  choix: [
    { texte: "Si vous souhaitez sauter du chariot en courant vers la gauche", vers: "27" },
    { texte: "Si vous préférez sauter du chariot en courant vers la droite", vers: "144" },
    { texte: "Enfin, si vous estimez plus sage de ne pas tenir compte de ce conseil et de rester où vous êtes", vers: "294" }
  ]
  },
  {
  id: "162",
  texte: "Deux tunnels mènent hors de la salle, l'un est orienté à l'ouest, l'autre au sud.",
  choix: [
    { texte: "Si vous souhaitez aller à l'ouest", vers: "214" },
    { texte: "Si vous préférez vous diriger vers le sud", vers: "117" }
  ]
  },
  {
  id: "163",
  texte: "Vous faites volte-face et vous vous enfuyez en courant, mais vous trébuchez contre une roue de chariot brisée et vous tombez à terre. Vous entendez alors le rire sardonique du Guerrier vassagonien qui lève son cimeterre pour vous frapper. Son rire cependant se transforme soudain en un hurlement de douleur. Un instant plus tard, il s'effondre sur le sol, une flèche profondément enfoncée dans la nuque.",
  choix: [
    { texte: "C'est un soldat du Sommerlund qui vient de vous sauver", vers: "249" }
  ]
  },
  {
  id: "164",
  texte: "Soudain, le son aigu d'une come de guerre vous glace le sang. Des Guerriers Pillards vêtus d'habits écarlates sautent alors des feuillages et se précipitent sur vos hommes. Ils sont trois fois plus nombreux que vous et il se pourrait bien qu'il soit impossible d'échapper à cette mortelle embuscade.",
  choix: [
    { texte: "Si vous souhaitez rassembler vos hommes pour engager le combat", vers: "299" },
    { texte: "Si vous préférez leur ordonner de battre immédiatement en retraite et de se réfugier dans la mine", vers: "52" }
  ]
  },
  {
  id: "165",
  texte: "Vous revenez auprès des troubadours au moment où ils s'apprêtent à servir le dîner. Le bouillon qui fume dans la marmite, vous semble fort appétissant. Si vous préférez vous en abstenir, vous devrez manger vos propres provisions ou perdre 3 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous souhaitez partager leur repas", vers: "319" },
    { texte: "Pour prendre votre propre Repas en assistant au spectacle donné par les musiciens", vers: "13" }
  ]
  },
  {
  id: "166",
  texte: "Vous sentez que le chariot abrite plusieurs bandits endormis. S'ils se réveillent avant que vous n'ayez pu traverser la rivière ou avant que vous ne vous soyez débarrassé des six brigands en train de pêcher, vous aurez beaucoup de mal, vos hommes et vous-même, à leur échapper.",
  choix: [
    { texte: "Vous estimez donc qu'il est trop dangereux d'essayer de traverser la rivière à cet endroit et vous faites signe à vos patrouilleurs de vous suivre en direction de l'est", vers: "232" }
  ]
  },
  {
  id: "167",
  texte: "Vous avez la satisfaction de découvrir au fond du chariot de mine un Sac à Dos de mineur et une Pelle. A l'intérieur du Sac à Dos, vous trouvez des provisions équivalant à un Repas. Vous ajustez le Sac à Dos sur vos épaules puis vous montez la pente raide du tunnel.",
  choix: [
    { texte: "Apportez à votre Feuille d'Aventure les modifications nécessaires avant de", vers: "185" }
  ]
  },
  {
  id: "168",
  texte: "Vous séparez les deux moitiés de votre Sphère de Feu et vous les tenez au-dessus de votre tête en reprenant votre marche. Vous êtes alors saisi d'horreur en apercevant une hideuse créature à la peau noire perchée sur une poutre, près du plafond. Son regard diabolique suit chacun de vos mouvements et sa gueule s'ouvre et se ferme comme si elle proférait de silencieuses malédictions. Soudain, le monstre s'élance de son perchoir et vous attaque.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "34" },
    { texte: "Sinon", vers: "85" }
  ]
  },
  {
  id: "169",
  texte: "Tandis que vous écartez les feuillages, vous tombez soudain au bas d'un à-pic dissimulé sous les broussailles. Vous atterrissez sur un large sentier forestier à moins de 3 mètres d'un brigand agenouillé qui examine le sabot de son cheval. L'homme est en train de dégager un éclat de pierre qui s'est glissé sous le fer de l'animal à l'aide d'un poignard à la lame recourbée. Le bruit de votre chute le fait sursauter et il se retourne aussitôt en brandissant son arme. Il vous faut le combattre. GUERRIER PILLARD HABILETÉ: 16 ENDURANCE: 24 Si vous remportez la victoire, vous apercevrez un groupe de brigands qui s'approche en provenance du nord.",
  suite: "123",
  combat: { nom: "Guerrier Pillard", habilete: 16, endurance: 24 }
  },
  {
  id: "170",
  texte: "Vous montez les marches de l'escalier en colimaçon pendant plus de cinq minutes, puis vous arrivez enfin à un palier. Là, un tunnel mène en direction du sud. Vous le suivez jusqu'à un endroit où il tourne brusquement vers l'ouest. Un peu plus loin, sur votre droite, un escalier descend vers un niveau inférieur.",
  choix: [
    { texte: "Si vous souhaitez emprunter cet escalier", vers: "228" },
    { texte: "Si vous préférez continuer le long du tunnel", vers: "221" }
  ]
  },
  {
  id: "171",
  texte: "Vous parcourez des kilomètres dans le paysage désolé qui borde la Voie de Ruanon. Cependant, en dépit de ce morne spectacle, vos hommes semblent d'humeur joyeuse. Ils chantent des chansons de marche pour essayer de rompre la monotonie du voyage et oublier quelque peu les dangers qui les attendent. Au cours de l'après-midi, des nuages d'orage s'amoncellent au sommet des monts Durncrag, à l'ouest, et un lointain grondement de tonnerre annonce une pluie imminente. A la fin de l'après-midi, vos éclaireurs repèrent un relais de diligence, un peu plus loin sur la route. C'est un grand bâtiment de pierre, aux murs fortifiés, qui abrite une taverne.",
  choix: [
    { texte: "Si vous souhaitez vous arrêter dans cette taverne pour la nuit", vers: "63" },
    { texte: "Si vous préférez affronter un éventuel orage et poursuivre votre chemin en direction du sud", vers: "141" }
  ]
  },
  {
  id: "172",
  texte: "Vous reconnaissez l'accent de l'est. Ce sont des Guerriers Pillards vassagoniens qui se trouvent de l'autre côté de cette porte. Ils sont quatre et ils parlent d'un intrus qu'on a repéré dans les galeries de la mine. Vous estimez qu'en l'occurrence la discrétion est préférable et vous revenez donc dans le passage.",
  choix: [
    { texte: "Vous vous assurez que vous n'êtes pas suivi, puis vous entrez dans le tunnel orienté à l'ouest et le long duquel sont alignés les chariots", vers: "55" }
  ]
  },
  {
  id: "173",
  texte: "Le pilier de bois est épais et solide. Pour l'abattre, il faudra le frapper avec force. Sinon, utilisez la Table de Hasard pour obtenir un chiffre. Si vous disposez d'une Pioche ou d'une Pelle, vous ajouterez 2 au chiffre que vous aurez tiré.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "275" }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "143", texte: "Si vous obtenez un total de 0 à 6," },
        "7-11": { vers: "179", texte: "De 7 à 11," }
      }
      }
  },
  {
  id: "174",
  texte: "D'autres Guerriers ennemis avancent parmi les débris de la barricade en se dirigeant vers vous. Vous vous précipitez alors vers un grand tonneau d'eau défendu par un robuste sergent du Sommerlund. Autour du tonneau, le sol est jonché de cadavres ennemis. « Tuez leur chef ! » ordonnez-vous en montrant du doigt l'officier qui commande les brigands. D'un geste rapide, le sergent tend son arc, vise et tire. La flèche décrit une courbe dans le ciel noirci de fumée et transperce le plastron étincelant de l'officier.",
  choix: [
    { texte: "Ses yeux cruels se brouillent, puis se ferment et il glisse de sa selle, la flèche profondément enfoncée dans le cœur", vers: "148" }
  ]
  },
  {
  id: "175",
  texte: "Vous avez parcouru un peu plus d'un kilomètre, lorsqu'une catastrophe se produit : devant vous, un patrouilleur pousse soudain un cri perçant ; un disque d'acier aux bords acérés s'est enfoncé dans sa poitrine. D'autres disques mortels sifflent aussitôt en tous sens. Pour éviter que tous vos hommes soient abattus par vos agresseurs invisibles, vous les menez au galop dans une fuite éperdue. Lorsque vous tirez enfin sur les rênes de votre cheval aux flancs ruisselants d'écume, vous êtes à plus de 3 kilomètres de l'endroit où l'embuscade a été tendue. Il ne vous reste hélas que quatre hommes. Tous les autres ont été tués par des disques d'acier. Vous ne pouvez vous arrêter très longtemps car l'ennemi s'est peut-être déjà lancé à votre poursuite. Vous repartez donc vers le sud, le long de la grande route, en compagnie de vos patrouilleurs rescapés.",
  choix: [
    { texte: "Et, tandis que vous chevauchez, le sifflement terrifiant des disques mortels résonne encore à vos oreilles, tel un écho lointain", vers: "297" }
  ]
  },
  {
  id: "176",
  texte: "Dans un grand fracas, votre cheval heurte violemment le flanc de l'étalon d'un des brigands et vous êtes projeté à terre. A moitié assommé par le choc, vous ne parvenez pas à esquiver le coup que vous porte l'un des Guerriers ennemis. Une lame vous blesse à l'épaule et vous perdez 3 points d'ENDURANCE. Vous vous relevez aussitôt pour affronter votre agresseur; il vous est impossible de prendre la fuite et il vous faut combattre jusqu'à la mort.",
  suite: "7",
  effets: { endurance: -3 },
  combat: { nom: "Guerrier Pillard", habilete: 17, endurance: 25 }
  },
  {
  id: "177",
  titre: "Mort — §177",
  texte: "Vous n'avez fait qu'un pas à l'intérieur de la caverne, lorsqu'un coup porté par-derrière vous assomme net. Deux Gardes vous avaient vu au croisement et vous ont tendu cette embuscade. Votre équipement est confisqué et vous êtes jeté sans connaissance dans une cellule par les hommes de Barraka. Il vous sera désormais impossible d'empêcher le sacrifice et, lorsque la porte de votre prison s'ouvrira à nouveau, c'est la main décharnée d'un squelette qui aura tourné la clé dans la serrure. Votre mission s'achève ici.",
  fin: "mort",
  nomFin: "Fin tragique — §177"
  },
  {
  id: "178",
  texte: "Vous repoussez le cadavre de la répugnante créature pour dégager le patrouilleur. Hélas ! l'homme est mort. L'Elix lui a planté ses dents pointues dans le cœur. Empoignant votre arme, vous vous précipitez aussitôt vers l'autre patrouilleur qui est à présent attaqué par deux de ces Chats de Guerre géants.",
  choix: [
    { texte: "Un troisième Elix bondit sur vous, mais vous lui portez un coup avant qu'il ait eu le temps de vous atteindre et vous le précipitez dans le puits", vers: "245" }
  ]
  },
  {
  id: "179",
  texte: "Le pilier de bois ploie peu à peu sous vos coups puis se casse soudain. Un tremblement secoue alors le tunnel ; vous trébuchez et vous tombez à terre. Vous vous relevez aussitôt et, tandis que vous courez vous mettre à l'abri, un déluge de terre et de pierres se déverse dans le souterrain. Une onde de choc vous frappe de plein fouet dans le dos et vous projette sur le sol ; un nuage de poussière se répand dans l'air.",
  choix: [
    { texte: "Vous vous relevez tant bien que mal et vous poursuivez votre chemin d'un pas chancelant, mais il vous faut marcher une demi-heure avant d'arriver à un endroit du tunnel où l'air redevient respirable et où les Torches fixées aux parois continuent de brûler", vers: "335" }
  ]
  }
];
