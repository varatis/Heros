import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 02 — La Traversée Infernale
 * Paragraphes 001 à 89. Fichier GÉNÉRÉ par
 * scripts/ls02-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls02-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_001_89: StorySection[] = [
  {
  id: "1",
  titre: "Holmgard, la ville assiégée",
  texte: "L'homme désigne un navire marchand qui mouille dans le port, près du quai d'embarquement. C'est une caravelle de belle apparence, soigneusement entretenue. « Le capitaine en second s'appelle Ronan, poursuit le conducteur, il vous attend de l'autre côté de la place, à l'auberge du Joyeux Drille. » Puis l'homme vous salue et disparaît dans la foule en se faufilant avec son chariot dans les rues étroites de la ville. Vous traversez la place mais lorsque vous parvenez devant l'auberge, vous constatez que la porte en est fermée à clé et que les volets des fenêtres sont clos. Tandis que vous vous demandez ce qu'il convient de faire, une main vous agrippe le bras et vous pousse dans un coin obscur.",
  choix: [
    { texte: "Si vous désirez dégainer votre arme et combattre l'inconnu qui vous a ainsi agressé", vers: "273" },
    { texte: "Si vous préférez essayer d'échapper à son emprise en vous débattant", vers: "160" }
  ]
  },
  {
  id: "2",
  texte: "Vous suivez une route étroite et sinueuse, le long de la côte. De hautes falaises en surplomb se dressent sur un côté du chemin. A quelque distance, un éboulement interdit le passage et il vous faut vous arrêter pour dégager la voie. Mais, alors que vous aidez le conducteur à soulever un énorme rocher en vous servant d'un levier, vous en entendez tomber un autre et, un instant plus tard, une gigantesque masse de pierre se fracasse sur la chaussée, écrasant le conducteur sous son poids. L'homme est tué sur le coup avant que vous ayez pu faire le moindre geste pour essayer de le sauver. Le rocher est tombé du haut de la falaise et vous avez bien failli vous-même le recevoir sur la tête, car le malheureux qui vient de périr ne se trouvait qu'à deux mètres de vous.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "42", requis: {"discipline":"sixieme-sens"} },
    { texte: "Dans le cas contraire", vers: "168" }
  ]
  },
  {
  id: "3",
  texte: "Vous sortez dans une petite ruelle, derrière la boutique et vous voyez, tout au bout, un cheval attaché à un piquet par une longe.",
  choix: [
    { texte: "Si vous souhaitez prendre ce cheval et fuir le village", vers: "150" },
    { texte: "Si le cheval ne vous intéresse pas, quittez la ruelle et", vers: "19" }
  ]
  },
  {
  id: "4",
  texte: "La taverne est remplie de brigands et d'ivrognes. Il y a là tous les bons à rien qui ont réussi à se faire engager dans les équipages des navires marchands amarrés dans le port. La plupart d'entre eux sont en train de boire et de chanter tandis que d'autres se mesurent au bras de fer. Tous sont si occupés que votre entrée passe inaperçue. Dans un coin, vous apercevez les pêcheurs qui vous ont volé. Ils sont assis autour d'une table encombrée de chopes de bière vides. Si vous voulez atteindre le Royaume de Durenor à temps, il vous faut à tout prix récupérer le Sceau d'Hammardal, ainsi que vos Pièces d'Or.",
  choix: [
    { texte: "Si vous souhaitez affronter les pêcheurs", vers: "104" },
    { texte: "Si vous jugez préférable de parler à l'aubergiste", vers: "342" },
    { texte: "Enfin, si vous voulez plutôt essayer de gagner quelques Pièces d'Or en engageant une partie de bras de fer", vers: "276" }
  ]
  },
  {
  id: "5",
  titre: "Le Monstre d'Enfer de la cale",
  texte: "La porte s'ouvre à la volée et un MONSTRE d'ENFER se rue sur vous en brandissant son épée. Vous frappez la créature dès qu'elle a pénétré dans la cale et sous l'effet du coup, une longue et profonde entaille apparaît sur sa poitrine. Le Monstre pousse un cri épouvantable, mais, malgré sa blessure, il a encore la force de bondir sur vous. Il vous faut engager un combat à mort. Le Monstre d'Enfer est un être de l'au-delà, un mort vivant, et la puissance du Glaive de Sommer vous permet de multiplier par deux tous les points d'ENDURANCE qu'il perdra au cours du combat. Il est cependant insensible à la Puissance Psychique. Si vous parvenez à tuer le Monstre, vous pourrez vous enfuir de la cale par l'écoutille.",
  suite: "166",
  combat: { nom: "Monstre d'Enfer blessé", habilete: 22, endurance: 20, immunisePsychique: true, vulnerableGlaiveSommer: true }
  },
  {
  id: "6",
  texte: "Le garçon a remarqué que vous le suiviez et dès qu'il est sorti, il tourne le coin du bâtiment et se met à courir en direction du sud. Vous vous lancez à sa poursuite, mais il a tôt fait de disparaître dans le dédale des allées qui longent les entrepôts du port. Vous vous dirigez vers l'est en empruntant la rue du Col Vert et vous passez devant une autre entrée du magasin. Un peu plus loin, vous remarquez une enseigne au-dessus de la porte d'une petite boutique.",
  choix: [
    { texte: "On peut y lire l'inscription suivante : MEKI MAJENOR MAÎTRE ARMURIER Si vous souhaitez entrer dans cette boutique", vers: "266" },
    { texte: "Si vous préférez poursuivre votre chemin en direction de l'est", vers: "310" }
  ]
  },
  {
  id: "7",
  titre: "Dorier et Ganon",
  texte: "DORIER s'écarte d'un bond de la table et tire son épée. Un instant plus tard, son frère GANON vient à sa rescousse. Il vous faut les combattre tous deux comme s'il s'agissait d'un seul adversaire. Votre attaque soudaine vous donne un avantage en raison de l'effet de surprise. Vous ajouterez de ce fait 2 points à votre total d'HABILETÉ, mais seulement lors du premier assaut. Au cours des assauts suivants, votre total d'HABILETÉ reviendra à son niveau antérieur. L'entraînement que les deux hommes ont suivi pour devenir Chevaliers leur a donné une force mentale qui les met à l'abri de la Puissance Psychique.",
  suite: "33",
  combat: { nom: "Dorier et Ganon", habilete: 28, endurance: 30, bonusPremierAssaut: 2 }
  },
  {
  id: "8",
  texte: "A la vérité, vous êtes plongé dans un sommeil si profond que vous ne vous réveillerez jamais plus car au cours de la nuit un Serpent des Sables vous a mordu et son venin mortel a eu raison de vous en quelques secondes. Votre mission s'achève ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §8"
  },
  {
  id: "9",
  titre: "Hammardal",
  image: "/lonewolf/ls02/p030-x101.webp",
  texte: "Vous êtes arrivé au quatorzième jour de votre quête. L'aube vient de se lever lorsque vous ouvrez les yeux ; vous contemplez alors un spectacle à vous couper le souffle : Hammardal, la cité des montagnes, se dresse devant vous. Contrairement aux autres villes des Fins de Terre, la capitale du royaume de Durenor n'a jamais eu besoin qu'on lui élève de fortifications. Les sommets montagneux qui l'entourent offrent une bien meilleure protection à ses habitants. Le carrosse qui vous emporte file parmi les riches terres des fermes environnantes en direction de la cité aux hautes tours et aux larges avenues. Au centre même d'Hammardal, la Tour du Roi s'élève sur une colline. C'est un magnifique édifice de pierre et de verre devant les portes duquel s'arrête votre attelage. Pour la première fois, vous prenez alors conscience que le privilège d'avoir brandi le Glaive de Sommer vous fera désormais entrer dans les plus anciennes légendes des Fins de Terre.",
  choix: [
    { texte: "", vers: "196" }
  ]
  },
  {
  id: "10",
  texte: "Vous empochez le billet (inscrivez-le sur votre Feuille d'Aventure dans la case d'Objets Spéciaux) et l'homme vous conduit à la diligence qui attend à proximité de la porte Est du port. La diligence est vide et vous vous asseyez près d'une des fenêtres de forme circulaire. Vous constatez avec soulagement que le siège est très confortable ; c'est un avantage que vous appréciez car il vous faudra voyager sept jours durant pour atteindre Port Bax. Vous rangez votre équipement sous la banquette, vous vous adossez confortablement et vous vous laissez gagner par le sommeil. Lorsque vous vous éveillez, cinq autres passagers ont pris place dans la diligence qui fait route en direction de Durenor. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "51", texte: "Si vous tirez 0,1, 2 ou 3," },
        "4-6": { vers: "195", texte: "4, 5 ou 6," },
        "7-9": { vers: "339", texte: "7, 8 ou 9," }
      }
      }
  },
  {
  id: "11",
  texte: "Vous vous cachez dans un grand tonneau en vous dissimulant sous votre cape de Seigneur Kaï. Mais votre tentative reste vaine car moins d'une minute plus tard la trappe s'ouvre à la volée et les villageois furieux sautent sur le sol de pierre en brandissant des torches et des épées. Ils vous arrachent à votre tonneau et vous font rouler à terre à grands coups de pied. Les cris de la foule étouffent vos supplications, inutile d'espérer la moindre pitié. Votre quête s'achève ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §11"
  },
  {
  id: "12",
  texte: "Le capitaine Kelman ouvre la porte d'une vitrine et en retire le damier d'un jeu de Samor. Les magnifiques figurines d'ivoire sculpté sont déjà disposées sur les cases lorsque le capitaine dépose avec précaution le damier sur la table. Vous acceptez, à contrecœur, de miser 10 Pièces d'Or et le jeu commence. Utilisez la Table de Hasard pour savoir qui va l'emporter. Si vous maîtrisez la Discipline Kaï du Sixième Sens, vous avez le droit d'ajouter 2 au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "58", texte: "Si le total est de 0,1, 2 ou 3," },
        "4-6": { vers: "167", texte: "4, 5 ou 6," },
        "7-9": { vers: "329", texte: "7, 8, 9,10 ou 11," }
      }
      }
  },
  {
  id: "13",
  texte: "Votre sens de l'orientation vous indique qu'il faut prendre le chemin de gauche pour parvenir au plus vite à Port Bax. Vous calez votre Sac à Dos sur vos épaules et vous vous remettez en route.",
  choix: [
    { texte: "", vers: "155" }
  ]
  },
  {
  id: "14",
  texte: "Dès que la lutte s'engage, vous vous servez du pouvoir que vous donne la Discipline Kaï pour affaiblir la concentration de votre adversaire. Vous voyez la sueur perler à son front et ses yeux se fermer tandis qu'il cède peu à peu sous l'effet de votre implacable Puissance Psychique. Enfin, moins d'une minute plus tard, il s'écroule sur le sol, sans connaissance.",
  choix: [
    { texte: "", vers: "305" }
  ]
  },
  {
  id: "15",
  titre: "Les cadeaux du garde",
  texte: "Il n'a plus l'air soupçonneux, à présent, mais surpris. «Je pensais que vous étiez un imposteur, Seigneur Kaï, dit-il, et je dois vous avouer que j'avais l'intention de vous donner une leçon que vous n'auriez jamais oubliée votre vie durant. Pardonnez-moi d'avoir douté de vous mais votre récit m'a paru si effrayant que je n'ai pu me résoudre à y croire, de peur qu'il ne fût vrai. J'ai fait le serment de défendre cette frontière et il m'est impossible de quitter la tour, mais si l'un quelconque des objets que je possède peut être utile à votre quête, sachez que je vous en fait volontiers don. » Il dispose alors sur une grande table de chêne les objets suivants et vous invite à choisir l'un d'eux : Glaive, Masse d'Armes, Bâton, Potion de Guérison (une dose qui vous redonne 3 points d'ENDURANCE), 3 Repas, 1 Sac à Dos, 12 Pièces d'Or. Vous faites votre choix et vous vous apprêtez à quitter la tour. L'homme vous indique du doigt la direction à prendre. « Lorsque vous serez parvenu au chenal de Ryner, suivez le chemin orienté au nord. Vous arriverez alors à un pont que gardent des soldats du roi. Quand ils vous demanderont le mot de passe, vous répondrez : \"Crépuscule.\" La route au-delà du pont mène à Port Bax. Que Dieu vous aide, Loup Solitaire. » Vous remerciez ce valeureux guerrier et vous vous mettez en chemin. Il vous faut cependant abandonner votre cheval car il vous serait impossible de franchir sur son dos la forêt dense qui s'étend devant vous.",
  choix: [
    { texte: "Prendre le Glaive", vers: "244", effets: { objets: [{"id":"glaive"}], drapeau: "crepuscule" } },
    { texte: "Prendre la Masse d'Armes", vers: "244", effets: { objets: [{"id":"masse"}], drapeau: "crepuscule" } },
    { texte: "Prendre le Bâton", vers: "244", effets: { objets: [{"id":"baton"}], drapeau: "crepuscule" } },
    { texte: "Prendre la Potion de Guérison (une dose : +3 Endurance)", vers: "244", effets: { objets: [{"id":"potion-guerison"}], drapeau: "crepuscule" } },
    { texte: "Prendre 3 Repas", vers: "244", effets: { objets: [{"id":"repas","quantity":3}], drapeau: "crepuscule" } },
    { texte: "Prendre les 12 Pièces d'Or", vers: "244", effets: { objets: [{"id":"couronnes-12"}], drapeau: "crepuscule" } }
  ]
  },
  {
  id: "16",
  texte: "Vous saisissez un verre de bière et vous le fracassez contre le bord de la table. L'éclat de verre que vous tenez à présent entre vos doigts est coupant comme un rasoir. Vous en passez le tranchant sur le dos de votre main gauche et une longue estafilade apparaît aussitôt d'où s'écoule un mince filet de sang. Vous pressez ensuite la paume de votre main droite contre la blessure et vous vous concentrez. Une douceur tiède se répand alors sur votre main blessée tandis que votre pouvoir guérit la plaie. Lorsque vous ôtez votre main droite, il ne reste plus trace de la coupure, pas même la plus petite cicatrice. Le marin vous observe d'un air stupéfait.",
  choix: [
    { texte: "", vers: "268" }
  ]
  },
  {
  id: "17",
  texte: "Vous avez réussi à vous hisser à mi-corps lorsque la porte de la cale, au-dessous de vous, s'ouvre à la volée. Un MONSTRE D'ENFER se précipite alors et vous blesse aux jambes d'un coup de son épée noire avant même que vous ayez pu tenter de vous enfuir. La blessure est sérieuse et vous perdez 5 points d'ENDURANCE. Vous tombez ensuite au fond de la cale, et il vous faut combattre la créature jusqu'à ce que mort s'ensuive. Il s'agit là d'un mort vivant et la puissance du Glaive de Sommer vous permet de multiplier par deux tous les points d'ENDURANCE que perdra la créature. Elle reste cependant insensible à la Puissance Psychique. Si vous parvenez à tuer le Monstre d'Enfer, vous pourrez quitter la cale par la porte ouverte.",
  suite: "166",
  combat: { nom: "Monstre d'Enfer", habilete: 22, endurance: 30, immunisePsychique: true, vulnerableGlaiveSommer: true }
  },
  {
  id: "18",
  texte: "Un peu plus loin, la rue est complètement bloquée par des chariots que l'on décharge pour transborder la marchandise sur un navire de commerce. Vous poursuivez votre chemin ; la rue tourne bientôt vers l'est pour aboutir à la rue du Col Vert. A votre gauche, vous remarquez une autre entrée par laquelle on peut pénétrer dans le magasin de Ragadorn.",
  choix: [
    { texte: "Au-delà se trouve une petite boutique avec cette enseigne accrochée au-dessus de la porte : Si vous souhaitez entrer dans le magasin de Ragadorn", vers: "173" },
    { texte: "Si vous préférez pénétrer dans la boutique de l'armurier", vers: "266" },
    { texte: "Si enfin vous décidez plutôt de poursuivre votre chemin en direction de l'est", vers: "310" }
  ]
  },
  {
  id: "19",
  texte: "A moins d'une vingtaine de mètres, un groupe d'hommes marche sur le pavé mouillé ; ils sont à votre recherche ; pour tenter de leur échapper, vous vous précipitez vers l'entrée sombre d'une petite boutique dans laquelle vous pénétrez aussitôt. Le cœur battant à vous rompre les côtes, vous priez le ciel qu'on ne vous ait pas repéré.",
  choix: [
    { texte: "", vers: "71" }
  ]
  },
  {
  id: "20",
  texte: "Cette rue infestée de rats descend en pente raide en direction des docks et des embarcadères du Fleuve Dorn. Lorsque vous parvenez sur le quai, vous apercevez le pont de Ragadorn, le seul et unique lieu de passage qui relie les rives est et ouest de ce port sordide. Vous vous frayez un chemin parmi la foule qui se presse sur le pont et vous empruntez une avenue au sol jonché d'ordures. Elle porte le nom de Boulevard du Commerce, section Est.",
  choix: [
    { texte: "", vers: "186" }
  ]
  },
  {
  id: "21",
  titre: "Le tricheur démasqué",
  texte: "Le tricheur est étendu raide mort à vos pieds. Vous retournez son cadavre, puis vous ôtez des manches de sa veste plusieurs cartes qu'il cachait là. Vous les jetez sur la table et bientôt la foule se disperse dans la taverne qui retrouve instantanément son vacarme et son agitation habituels. Les autres joueurs de cartes récupèrent leur or et vous laissent ce qui reste. Pour savoir quelle quantité d'or vous revient, utilisez la Table de Hasard en remplaçant exceptionnellement le zéro par le chiffre 10. Lorsque la Table vous aura donné un chiffre, vous le multiplierez par 3 ; le total obtenu représente le nombre de Pièces d'Or qui vous appartient désormais. Vous pouvez également prendre le Poignard si vous le désirez. N'oubliez pas d'inscrire toutes ces nouvelles acquisitions sur votre Feuille d'Aventure. Tandis qu'on enlève le cadavre du tricheur, vous vous approchez du bar et vous appelez l'aubergiste, puis vous lui glissez une Pièce d'Or dans le creux de la main en lui demandant une chambre pour la nuit.",
  choix: [
    { texte: "Prendre aussi le Poignard du tricheur", vers: "314", effets: { objets: [{"id":"poignard"}] } },
    { texte: "Laisser le poignard et demander votre chambre", vers: "314" }
  ],
  effets: { or: -1 },
  evenement: {
        type: "jet-hasard-table",
        titre: "Le partage du butin",
        texte: "La Table de Hasard (0 remplacé par 10) × 3 : voilà le nombre de Pièces d'Or qui vous revient.",
        ton: "joie",
        branches: {
        "0-0": { or: 30 },
        "1-1": { or: 3 },
        "2-2": { or: 6 },
        "3-3": { or: 9 },
        "4-4": { or: 12 },
        "5-5": { or: 15 },
        "6-6": { or: 18 },
        "7-7": { or: 21 },
        "8-8": { or: 24 },
        "9-9": { or: 27 }
      }
      }
  },
  {
  id: "22",
  texte: "Au matin, vous êtes réveillé par un cri de l'homme de quart : « Naufrage par tribord avant ! » Vous vous habillez en hâte et vous montez sur le pont pour rejoindre le capitaine qui se tient debout devant le bastingage de la proue. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "119", texte: "Si vous tirez 0,1,2,3 ou 4," },
        "5-9": { vers: "341", texte: "Si vous tirez 5, 6, 7, 8 ou 9," }
      }
      }
  },
  {
  id: "23",
  texte: "Pendant près de dix minutes, vous poursuivez la créature qui s'enfuit le long d'un passage étroit et sinueux. Vous êtes sur le point d'abandonner lorsque le passage s'ouvre soudain sur une immense caverne éclairée par des torches enflammées. Un spectacle saisissant s'offre alors à vous. L'endroit, en effet, abrite une colonie entière de ces étranges créatures, les Noudics, qui sont fort occupées à examiner et à trier toutes sortes d'objets insolites empilés les uns sur les autres au beau milieu de la caverne.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "144", requis: {"discipline":"communication-animale"} },
    { texte: "Dans le cas contraire", vers: "295" }
  ]
  },
  {
  id: "24",
  texte: "C'est le tombeau de Killean le Suzerain. Il était l'un des seigneurs de Ragadorn jusqu'au jour où, trois ans plus tôt, une épidémie de peste rouge l'emporta en même temps que nombre de ses compatriotes. Vous vous rappelez soudain les récits que vous a faits un certain Renard Agile qui occupait un emploi d'artisan au monastère Kaï. Cet homme s'était souvent rendu à Ragadorn et la peste rouge l'avait frappé tout comme elle avait frappé une bonne moitié de la population locale.",
  choix: [
    { texte: "Si vous souhaitez retourner dans la taverne", vers: "177" },
    { texte: "Si vous préférez poursuivre votre chemin le long de la rue du Tombeau", vers: "253" },
    { texte: "Si enfin vous désirez prendre la direction de l'est en empruntant la rue de la Tour de Guet", vers: "319" }
  ]
  },
  {
  id: "25",
  texte: "Vous parcourez du regard la taverne où s'entasse une foule de buveurs, et vous remarquez que de nombreux villageois jouent à des jeux de hasard. Près de l'entrée principale, un jeune personnage à l'allure louche est assis devant une table sur laquelle trois tasses d'argile sont retournées. Il les change sans cesse de place en mettant au défi qui veut l'entendre de deviner sous laquelle de ces trois tasses est cachée une bille de verre. Il promet de donner au gagnant le double de la somme que ce dernier aura misée.",
  choix: [
    { texte: "Si vous possédez les Disciplines Kaï du Sixième Sens ou de la Maîtrise Psychique de la Matière", vers: "116" },
    { texte: "Si ces deux Disciplines vous sont étrangères", vers: "153" }
  ]
  },
  {
  id: "26",
  titre: "Le cadavre ambulant",
  image: "/lonewolf/ls02/p037-x142.webp",
  texte: "Vous contemplez les orbites vides d'un cadavre ambulant. Mais quelque défiguré qu'il soit, vous reconnaissez le visage du capitaine Kelman. Vous vous trouvez en fait sur le pont du Sceptre Vert qui a sombré vingt-quatre jours plus tôt au cours de la tempête. Le matin même, l'épave du navire a été arrachée aux profondeurs obscures de la mer et sa carcasse ira rejoindre la flotte des bateaux fantômes.",
  choix: [
    { texte: "Le capitaine zombie tend vers vous une main aux doigts brisés et vous supplie, d'une voix d'outre-tombe, de déposer sur le pont du navire le Glaive de Sommer : « Déposez l'épée à vos pieds et mon âme alors échappera à son tourment. » Si vous souhaitez accéder à sa demande", vers: "248" },
    { texte: "Si vous préférez attaquer le capitaine", vers: "66" }
  ]
  },
  {
  id: "27",
  texte: "Vous marchez pendant plus de trois heures le long de la route déserte qui suit la côte. Lorsque enfin la nuit tombe, vous êtes épuisé et vous décidez de prendre quelque repos jusqu'à l'aube. Vous vous remettrez alors en chemin. Mais bientôt, certains récits que les Maîtres Kaï vous ont faits vous reviennent en mémoire : il y était question du Pays Sauvage qui s'étend entre le Sommerlund et Durenor ; la nuit, des hordes de chiens féroces parcourent ces terres désolées, en quête de nourriture. Le souvenir de ces contes vous incite à la prudence et vous décidez de passer la nuit à l'abri d'un grand arbre au feuillage touffu, planté au bord du chemin. Vous prenez là un repos réparateur qui vous rend 2 points d'ENDURANCE (si tant est que vous en ayez perdu).",
  choix: [
    { texte: "", vers: "312" }
  ]
  },
  {
  id: "28",
  texte: "Les Squalls se mettent à hurler de terreur et s'enfuient en tous sens pour éviter vos coups. En quelques instants, ils ont déserté la clairière et vous vous approchez du moribond pour lui porter secours. Il lui reste tout juste un souffle de vie et il est bien entendu beaucoup trop faible pour parler.",
  choix: [
    { texte: "Si vous voulez retirer avec précaution la lance de sa poitrine", vers: "106" },
    { texte: "Si vous préférez fouiller dans son sac dans l'espoir d'y trouver quelque objet qui pourrait se révéler utile", vers: "320" }
  ]
  },
  {
  id: "29",
  texte: "Vous soulevez le loquet et vous faites glisser le panneau de l'écoutille. L'ouverture provoque un brusque appel d'air et des flammes jaillissent aussitôt de la cale. Vous reculez en titubant et en tenant à deux mains votre visage brûlé par le feu. Vous perdez 2 points d'ENDURANCE. « Au feu ! Au feu ! » crie alors une voix. L'équipage saisi de panique s'efforce d'éteindre les flammes mais il faut plus d'une heure pour venir à bout de l'incendie. Les dégâts sont considérables : c'est en effet dans la cale qui a pris feu qu'étaient entreposées les réserves d'eau douce et les vivres ; il n'en reste plus rien désormais. Mais, peut-être plus grave encore, l'incendie a sérieusement endommagé la structure même du navire. Tandis que vous examinez les dégâts, le capitaine s'approche de vous, le visage noirci par la fumée. Il porte un paquet sous son bras. « Il faut que je vous parle en privé, my lord », dit-il à voix basse. Sans rien répondre, vous vous tournez vers lui et vous le suivez jusqu'à sa cabine.",
  choix: [
    { texte: "", vers: "222" }
  ]
  },
  {
  id: "30",
  texte: "Vous tombez sur les planches moisies du pont et vous passez au travers pour atterrir enfin au fond d'une cale. Vous êtes indemne, mais la puanteur dans laquelle baigne le navire est insupportable. Vous vous remettez sur pied et vous dégainez le Glaive de Sommer. Quatre ZOMBIES aux allures de fantômes sortent alors de l'ombre d'un pas chancelant en tendant vers votre gorge des mains noueuses et décharnées. Il vous faut les combattre en les considérant comme un seul et même ennemi. Ce sont des morts vivants, et la puissance du Glaive de Sommer vous permet de multiplier par deux tous les points d'ENDURANCE qu'ils perdront au cours du combat. Ils sont cependant insensibles à la Discipline Kaï de la Puissance Psychique.",
  suite: "258",
  combat: { nom: "Zombies", habilete: 13, endurance: 16, immunisePsychique: true, vulnerableGlaiveSommer: true }
  },
  {
  id: "31",
  texte: "Votre première rencontre avec le Lieutenant Général vous surprend. Vous vous attendiez sans doute à voir un vieil homme servile, semblable à ces émissaires des contrées méridionales qui viennent sans cesse encombrer le palais du roi. Mais l'homme qui se tient devant vous, vêtu d'une lourde cotte de mailles, n'est ni vieux ni servile. C'est même un personnage tout à fait exceptionnel comme vous n'allez pas tarder à le découvrir. Né d'un père sommerlundois et d'une mère durenoraise, le Lieutenant Général Rhygar est devenu dans cette ville une figure de légende. Au cours des dix dernières années, il a pris la tête d'une armée formée par l'Alliance des Nations et sous son commandement, les Barbares des Glaces venus du pays de Kalte ont été repoussés et taillés en pièces. Sage en temps de paix, implacable lorsque la guerre fait rage, c'est là le meilleur compagnon que vous puissiez souhaiter. Nul ne saurait mieux vous aider dans votre quête du Glaive de Sommer. Rhygar fait servir un somptueux repas ; jamais vous n'avez aussi bien mangé depuis que la guerre a commencé. Au cours du festin, vous repensez à tous les événements qui se sont déroulés entre votre départ du Sommerlund et votre arrivée à Port Bax. Vous songez également aux terribles périls qui vous attendent encore. A la fin du repas, Rhygar fait venir son médecin personnel qui s'empresse de soigner vos blessures. Les potions qu'il vous fait boire vous rendent 6 points d'ENDURANCE. Le praticien vous conseille ensuite de prendre une bonne nuit de repos car, au matin, vous partirez pour Hammardal en compagnie du Lieutenant Général. Le lendemain de bonne heure, on vous conduit dans un jardin clôturé, à l'arrière du consulat. Rhygar et trois de ses meilleurs soldats vous y attendent. Ils sont déjà montés sur leurs chevaux, prêts à vous accompagner jusqu'à Hammardal, la capitale de Durenor, distante de 370 kilomètres. Les rues de Port Bax s'éveillent à peine tandis que vous parcourez la ville à cheval. En passant la porte de pierre moussue qui marque la limite de la cité, vous vous sentez confiant dans le succès de votre mission : vous êtes quasiment sûr désormais de réussir. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "176", texte: "Si vous tirez 0,1, 2, 3 ou 4," },
        "5-9": { vers: "254", texte: "Si vous tirez 5, 6, 7, 8 ou 9," }
      }
      }
  },
  {
  id: "32",
  texte: "Le chant d'un coq vous réveille à l'aube. Les rues sinueuses de Ragadorn vous apparaissent alors derrière un voile de pluie, une pluie régulière et abondante qui martèle le pavé. Il y a six jours que vous avez quitté Holmgard et il vous reste 320 kilomètres à parcourir avant d'atteindre Port Bax. Vous êtes couché dans le grenier d'un vaste relais de diligence. Un groupe d'hommes vêtus d'uniformes verts vient d'arriver ; ils sont en train de nettoyer l'une des diligences. Vous entendez une voix dire que le prochain départ pour Port Bax aura lieu à une heure de l'après-midi et que le voyage durera sept jours. Vous avez faim et il vous faut prendre un Repas, sinon, vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Après avoir mangé, vous déciderez peut-être d'acheter un billet pour Port Bax aux employés de la diligence ; dans ce cas, vous", vers: "136" },
    { texte: "Mais vous pouvez également quitter le relais en empruntant l'échelle extérieure qui vous permettra de descendre directement dans la rue", vers: "238" }
  ]
  },
  {
  id: "33",
  texte: "Les autres voyageurs contemplent d'un air horrifié et incrédule le résultat du combat que vous venez de livrer. Et avant que vous ayez pu fournir la moindre explication, la porte de l'auberge s'ouvre brusquement dans un grand fracas. Six soldats revêtus d'armures se précipitent à l'intérieur, conduits par l'aubergiste en personne. Les soldats sont des gardes de la ville et le tenancier borgne les exhorte à vous arrêter en poussant de grands cris.",
  choix: [
    { texte: "Si vous souhaitez affronter les soldats", vers: "296" },
    { texte: "Si vous préférez vous enfuir par la porte de derrière", vers: "88" }
  ]
  },
  {
  id: "34",
  texte: "Tandis que vous fermez la porte de votre cabine, vous entendez les cris frénétiques de l'équipage qui se prépare à repousser les assaillants. Soudain, un bruit sourd ébranle le navire ; quelque chose vient de heurter le pont arrière ; retentissent alors des hurlements aigus que vous reconnaissez aussitôt : ce sont des GLOKS qui s'égosillent ainsi ! Les Bêtalzans ont déposé des Gloks sur le bateau et bientôt la porte de votre cabine s'ouvre à la volée. Trois de ces hideuses créatures à la peau grise vous font face, en brandissant leurs épées à la lame tranchante et ruisselante de sang. Il vous est impossible de prendre la fuite et vous allez devoir les combattre en les considérant comme un seul et même ennemi.",
  suite: "345",
  combat: { nom: "Gloks", habilete: 16, endurance: 14 }
  },
  {
  id: "35",
  texte: "Vous enjambez le soldat évanoui et vous vous hâtez de fuir la tour en direction de la forêt car si d'autres gardes apparaissent, il y a tout à parier qu'ils vous attaqueront avant de vous poser des questions. Vous avez marché pendant plus de deux heures lorsque vous parvenez à une bifurcation, à proximité d'un chêne rabougri.",
  choix: [
    { texte: "Si vous décidez d'aller à gauche", vers: "155" },
    { texte: "Si vous préférez aller à droite", vers: "293" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "13", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "36",
  texte: "Cette nourriture vous semble délicieuse et en quelques minutes, vous avez vidé votre assiette. Vous décidez alors de faire un petit somme avant d'aller rejoindre les autres au bar. Mais comme vous vous apprêtez à vous étendre, une terrible douleur vous tord soudain l'estomac. Vos jambes se dérobent et vous vous écroulez sur le sol, le corps saisi de tremblements. Vous avez l'impression qu'un feu vous brûle tout entier. Un mot vous revient sans cesse à l'esprit, tournant dans votre tête d'une manière lancinante: poison... poison... poison...",
  choix: [
    { texte: "Utiliser l'herbe de Laumspur", vers: "145", requis: {"objet":"potion-laumspur"}, effets: { retirerObjets: ["potion-laumspur"] } },
    { texte: "Lutter contre le poison grâce à la Guérison", vers: "210", requis: {"discipline":"guerison"} },
    { texte: "Ni l'un ni l'autre…", vers: "275", montreToujours: true }
  ]
  },
  {
  id: "37",
  image: "/lonewolf/ls02/p044-x180.webp",
  texte: "A l'intérieur de la diligence, il fait chaud et sec. Vous secouez votre cape de Seigneur Kaï pour la débarrasser des gouttes de pluie qui la recouvrent et vous remarquez alors la présence de trois autres passagers : deux femmes et un homme qui ronfle avec bruit. L'une des femmes lève les yeux vers vous et vous adresse un sourire. «Nous arriverons à Ragadorn dans six heures», dit-elle, puis elle dépose son panier sur le plancher pour que vous puissiez vous asseoir à côté d'elle. Elle vous apprend ensuite qu'elle habite Ragadorn et vous donne quelques renseignements sur sa ville. Depuis que Killean le Suzerain est mort il y a trois ans, raconte-t-elle, son fils Lachelan règne sur Ragadorn ; c'est un être malfaisant entouré de mercenaires qui sont en fait de purs et simples brigands. Ils saignent à blanc toute la population en levant de lourds impôts et si quelqu'un a le malheur de se plaindre, il a tôt fait de disparaître on ne sait où. La vie est bien dure là-bas et, si vous voulez mon avis, vous feriez bien de quitter Ragadorn le plus vite possible. Au cours de ce voyage, vous allez devoir prendre un Repas ; à défaut, vous perdrez 3 points d'ENDURANCE. Quelques heures plus tard, vous entendez au loin sonner une cloche. En jetant un coup d'œil par la fenêtre de la diligence, vous apercevez le mur d'enceinte de Ragadorn. L'attelage franchit bientôt la porte Ouest, puis s'arrête. Vous sautez à terre et la terrible puanteur qui baigne ce port sordide vous monte aussitôt aux narines. Une enseigne rouillée, clouée à un mur porte ces mots : Bienvenue à Ragadorn. La femme vous indique alors que vous pouvez prendre une autre diligence pour Port Bax au relais situé près de la porte Est de la ville.",
  choix: [
    { texte: "Si vous voulez marcher en direction du nord, le long de la rue de la porte Ouest", vers: "122" },
    { texte: "Si vous préférez aller vers le sud en empruntant la promenade du quai de l'Est", vers: "323" },
    { texte: "Enfin, si vous décidez plutôt de vous orienter vers l'est en prenant la rue de la Hache", vers: "257" }
  ]
  },
  {
  id: "38",
  texte: "Vous saisissez la hampe de la lance que vous enfoncez dans la cage thoracique du Monstre d'Enfer. Celui-ci se met à hurler de douleur et de rage en relâchant l'étreinte de ses doigts autour de votre cou. Vous roulez alors sur vous-même pour échapper au Monstre hideux que vous voyez se tordre sur le sol en essayant désespérément d'arracher la lance de sa poitrine.",
  choix: [
    { texte: "Si vous souhaitez empoigner la lance pour l'enfoncer plus profondément dans le corps du Monstre d'Enfer", vers: "269" },
    { texte: "Si vous préférez prendre la fuite le plus vite possible", vers: "313" }
  ]
  },
  {
  id: "39",
  texte: "A la tombée du jour, la diligence s'arrête devant une auberge sur la route qui longe la côte en direction de Port Bax. Le prix d'une chambre pour la nuit s'élève à 1 Couronne d'Or pour les passagers de la diligence et à 3 Couronnes pour les autres clients. Au moment où vous vous apprêtez à entrer, le conducteur de la diligence vous demande votre billet.",
  choix: [
    { texte: "Si vous avez un billet pour Port Bax", vers: "346" },
    { texte: "Si vous n'avez pas de billet", vers: "156" }
  ]
  },
  {
  id: "40",
  titre: "Quatorze jours à Hammardal",
  texte: "Il faut quatorze jours pour mobiliser l'armée et préparer la flotte de Durenor. Pendant tout ce temps, vous êtes l'hôte du roi, et vous demeurez à Hammardal, la capitale du royaume. Chaque jour qui passe accroît votre inquiétude : que deviennent vos compatriotes dans la ville assiégée de Holmgard ? Auront-ils la force de résister encore longtemps aux Maîtres des Ténèbres ? Puissent-ils tenir jusqu'à votre retour, c'est la prière que vous formulez sans cesse. Vous vivez cet exil à contrecœur en faisant chaque jour les exercices nécessaires pour vous maintenir en bonne condition physique ; vous vous adonnez également à la méditation. Un herboriste de Durenor, un certain Madin Rendalim est venu vous rendre visite. Sa science dans l'art de guérir est célèbre d'un bout à l'autre des Fins de Terre et il vous redonne tous vos points d'ENDURANCE ; vous disposez donc à présent du même total d'ENDURANCE qu'au tout début de votre mission. Madin Rendalim vous fait don par la même occasion d'une fiole de Laumspur: il s'agit d'une puissante potion de guérison qui vous permettra de récupérer 5 points d'ENDURANCE si vous la buvez après un combat. La fiole, cependant, ne contient qu'une seule dose (vous inscrivez cette potion sur votre Feuille d'Aventure dans la case Objets contenus dans votre Sac à Dos). Malheureusement, l'herboriste vous apporte également de mauvaises nouvelles: on a découvert le cadavre du Lieutenant Général Rhygar dans la forêt, près de l'entrée du tunnel de Tarnalin. Il a été tué par un Monstre d'Enfer.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "97", requis: {"discipline":"sixieme-sens"} },
    { texte: "Dans le cas contraire", vers: "242" }
  ],
  effets: { endurance: 99, objets: [{"id":"potion-laumspur","message":"Fiole de Laumspur offerte par Madin Rendalim"}] }
  },
  {
  id: "41",
  texte: "Vous avez de la chance car votre signal de détresse a été aperçu par l'équipage du bateau qui met à présent le cap dans votre direction. C'est un petit bateau de pêche en provenance du port de Ragadorn. Les pêcheurs qui sont à bord ont une mine plutôt patibulaire, mais ils se montrent amicaux avec vous ; ils vous donnent une couverture pour vous réchauffer et vous offrent de quoi manger. Le capitaine vous conseille de faire un somme pendant les trois heures que durera le voyage de retour à Ragadorn.",
  choix: [
    { texte: "Si vous décidez de suivre ce conseil, reprenez un point d'ENDURANCE et", vers: "194" },
    { texte: "Si vous préférez rester éveillé et scruter la mer dans l'espoir de retrouver d'autres survivants du naufrage", vers: "251" }
  ]
  },
  {
  id: "42",
  texte: "Vous devinez que quelqu'un se cache au sommet de la falaise, juste au-dessus de vous ; vous sentez également que vous étiez la victime désignée de cet attentat. On veut vous tuer, vous en avez la certitude !",
  choix: [
    { texte: "", vers: "168" }
  ]
  },
  {
  id: "43",
  texte: "Vous faites tournoyer le Glaive de Sommer d'un geste vigoureux et vous fauchez d'un coup quatre zombies, mais à peine leurs cadavres se sont-ils écroulés sur le pont que d'autres morts vivants viennent prendre leur place. Vous ne parviendrez jamais à les tuer tous et vous succomberez sous le nombre. Ils agrippent votre cape qu'ils commencent à déchirer et vous n'avez plus qu'à sauter par-dessus bord pour échapper à une mort certaine.",
  choix: [
    { texte: "", vers: "286" }
  ]
  },
  {
  id: "44",
  texte: "Le venin se répand dans votre sang, vos membres s'engourdissent et vous vous mettez à transpirer. Le clapotis des vagues et le cri des vautours au-dessus de votre tête sont les derniers bruits qui vous parviennent. Votre quête s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §44"
  },
  {
  id: "45",
  texte: "Vous galopez le long du chemin forestier en direction des cavaliers vêtus de capes ; soudain, l'un d'eux lève un épieu de couleur noire au-dessus de sa tête. A l'extrémité de l'épieu est fixé un cône d'acier, noir également, d'où s'échappe une flamme bleue étince-lante. Vous vous apprêtez à porter votre premier coup lorsqu'un éclair aveuglant jaillit du bâton maléfique et explose juste à côté de vous. La force de la déflagration est telle que vous êtes projeté à terre dans les broussailles. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-7": { vers: "311", texte: "Si vous tirez un chiffre de 0 à 7," },
        "8-9": { vers: "159", texte: "Si vous tirez un 8 ou un 9," }
      }
      }
  },
  {
  id: "46",
  texte: "Vous vous efforcez de vous rappeler la signification de cette porte orange, mais sans succès.",
  choix: [
    { texte: "Si vous décidez d'entrer dans la boutique", vers: "214" },
    { texte: "Si vous préférez poursuivre votre chemin", vers: "230" }
  ]
  },
  {
  id: "47",
  texte: "Les soldats se hâtent de descendre du toit et empoignent leurs lances ; puis ils s'avancent vers vous. « Le mot de passe, étranger ! » crie l'un d'eux.",
  choix: [
    { texte: "Répondre : « Crépuscule »", vers: "111", requis: {"drapeau":"crepuscule"} },
    { texte: "Ne pas connaître le mot de passe", vers: "307", montreToujours: true }
  ]
  },
  {
  id: "48",
  texte: "Vous désignez du doigt une chope de bière posée sur le bar et vous demandez au marin de l'observer attentivement. Vous fermez alors les yeux et vous vous concentrez jusqu'à ce que l'image de la chope se forme dans votre esprit. Sous l'effet de votre volonté, la chope s'élève bientôt dans les airs sous le regard médusé de votre interlocuteur.",
  choix: [
    { texte: "", vers: "268" }
  ]
  },
  {
  id: "49",
  texte: "Pendant trois jours et trois nuits, les navires de la flotte de Durenor font voile en direction du golfe de Holm. La traversée est rapide mais chacun des bateaux est malheureusement frappé par la malchance. Des voiles se déchirent, des cordages se dénouent mystérieusement et des voies d'eau se forment dans les coques. Les hommes entassés à bord se laissent gagner par l'énervement, des querelles éclatent, puis des bagarres, qui souvent se terminent par la mort d'un des adversaires. Au bout de la troisième nuit, Lord Axim est au bord du désespoir. «Je n'ai jamais subi une aussi mauvaise traversée, dit-il, nous n'avons croisé aucun ennemi, nous n'avons livré aucune bataille et pourtant, la moitié de mes hommes sont malades ou blessés et nous avons perdu deux de nos plus beaux navires. La lune nous est contraire, une malédiction pèse sur nous. Puisse-t-elle se dissiper bientôt car, même si nous arrivions à Holmgard cette nuit même, nous n'aurions pas la force de repousser l'ennemi qui assiège la ville. » Tandis qu'il prononce ces paroles, vous voyez l'aube se lever. Vous pensez que ce jour nouveau vous apportera peut-être quelque soulagement mais, hélas, les eaux calmes qui vous entourent sont trompeuses et cachent en fait une menace mortelle.",
  choix: [
    { texte: "", vers: "100" }
  ]
  },
  {
  id: "50",
  texte: "Le moine se penche soudain en avant et dépose une autre Couronne d'Or sur l'assiette ; la diligence est alors autorisée à poursuivre sa route. « Peut-être pourrez-vous rendre la pareille un jour, mon fils », dit le moine en reprenant place sur la banquette avant que vous ayez pu dire un mot. Vous remarquez alors que le capuchon de sa robe de bure maintient constamment son visage dans l'ombre : voilà qui est étrange... Bientôt, la diligence traverse la rivière en crue et le voyage se poursuit.",
  choix: [
    { texte: "", vers: "249" }
  ]
  },
  {
  id: "51",
  texte: "Environ une heure plus tard, la diligence s'arrête devant le sanctuaire de Kalanane. On dit que le sanctuaire a été édifié sur la tombe du roi Alin, le premier souverain de Durenor et que, tout autour, pousse de l'herbe de Laumspur.",
  choix: [
    { texte: "Si vous souhaitez cueillir un peu de cette herbe", vers: "103" },
    { texte: "Sinon, retournez dans la diligence", vers: "249" }
  ]
  },
  {
  id: "52",
  texte: "Soudain un cri à vous glacer le sang retentit dans l'obscurité, au-dessus de vous. Vous levez la tête et vous apercevez deux lueurs rougeâtres : ce sont les yeux d'un Monstre d'Enfer qui descend les marches quatre à quatre pour se jeter sur vous. Vous hurlez de terreur en cherchant frénétiquement une arme pour vous défendre.",
  choix: [
    { texte: "Si vous possédez une Lance Magique", vers: "338" },
    { texte: "Sinon", vers: "234" }
  ]
  },
  {
  id: "53",
  texte: "Vous entendez des murmures parmi l'équipage ; de temps à autre, vous percevez distinctement certains mots : les hommes parlent de « vaisseaux fantômes » et de « malédiction » mais les murmures cessent lorsque le capitaine appelle tout le monde sur le pont. Le silence alors s'installe à bord du Sceptre Vert tandis que le capitaine Kelman s'adresse à l'équipage d'une voix puissante : « Nous sommes à trois jours de mer de Port Bax, dit-il, mais avec un bon vent et du cœur au ventre, nous pourrons y jeter l'ancre et festoyer à terre dans moins de deux jours. Le feu a détruit la plupart de nos vivres et nous devrons par conséquent nous contenter d'un repas par jour. Un garde sera mis en faction devant le baril d'eau douce. Nous sommes forts cependant et nous supporterons l'épreuve mais sachez que quiconque sera surpris à voler recevra cent coups de fouet. C'est tout ce que j'avais à dire ». L'équipage ne semble pas très satisfait des décisions du capitaine, mais personne n'ose défier son autorité. Plus tard dans l'après-midi, l'équipage et le capitaine vous invitent chacun de son côté à prendre votre repas du soir en leur compagnie.",
  choix: [
    { texte: "Si vous souhaitez dîner avec le capitaine", vers: "321" },
    { texte: "Si vous préférez manger avec l'équipage", vers: "154" }
  ]
  },
  {
  id: "54",
  texte: "Au moment où vous franchissez la porte en courant, une lance s'enfonce dans votre poitrine avec une telle force que vous en êtes soulevé de terre. Le clair de lune s'estompe et la dernière vision que vous emporterez de ce monde n'a rien de réconfortant: les visages grimaçants de villageois réunis en cercle se penchent sur vous et des dizaines de mains vous poignardent à mort. Votre quête s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §54"
  },
  {
  id: "55",
  titre: "La boutique du forgeron",
  texte: "Un homme de haute taille vêtu d'un tablier de cuir est en train d'aiguiser un glaive de belle apparence. L'homme est assis devant une meule qui projette des gerbes d'étincelles chaque fois que la lame de l'épée entre en contact avec la pierre. Le forgeron vous souhaite le bonsoir et vous offre le glaive. « C'est une belle lame, dit-il, forgée dans un pur acier de Durenor. Pour douze Couronnes, elle est à vous. » Si vous souhaitez acheter ce glaive, inscrivez-le sur votre Feuille d'Aventure et soustrayez douze Couronnes de votre total de Pièces d'Or.",
  choix: [
    { texte: "Acheter le glaive (12 PO)", vers: "55-a", requis: {"or":12}, effets: { or: -12 } },
    { texte: "Sortir par la porte principale", vers: "347" },
    { texte: "Sortir par la porte de derrière", vers: "3" }
  ]
  },
  {
  id: "55-a",
  titre: "L'achat du glaive",
  texte: "Vous comptez douze Couronnes et le forgeron vous tend la belle lame d'acier de Durenor. Inscrivez-la sur votre Feuille d'Aventure, puis remerciez l'homme.",
  choix: [
    { texte: "Sortir par la porte principale", vers: "347" },
    { texte: "Sortir par la porte de derrière", vers: "3" }
  ]
  },
  {
  id: "56",
  texte: "L'aubergiste vous tend une clé. « Chambre 4, deuxième porte à gauche en haut de l'escalier», annonce-t-il. Il faudra libérer les lieux une heure après le lever du soleil. Votre chambre n'est meublée que d'un lit, d'une chaise et d'une petite table. Avant d'aller vous coucher, vous verrouillez la porte et vous coincez la chaise contre le panneau par mesure de sécurité. Dès demain, vous établirez un nouvel itinéraire pour rejoindre le royaume de Durenor.",
  choix: [
    { texte: "", vers: "127" }
  ]
  },
  {
  id: "57",
  texte: "Du dos de sa main gantée, l'un des gardes fait sauter de votre paume l'or que vous lui offrez et les pièces tombent dans les eaux sombres du chenal de Ryner. Utilisez la Table de Hasard pour savoir combien de pièces vous avez perdues, en remplaçant le zéro par un 10. «Nous n'allons pas vendre la sécurité de notre royaume à si vil prix, dit le garde, seul un brigand ou un imbécile songerait à corrompre un soldat de Durenor et j'ai bien l'impression que vous êtes les deux à la fois. » Vous avez eu le tort de porter atteinte à leur honneur et ils sont en train de vous donner une rude leçon.",
  choix: [
    { texte: "", vers: "282" }
  ]
  },
  {
  id: "58",
  texte: "« Pas de chance, Loup Solitaire, votre stratégie ne manquait pas d'audace, mais je crois bien que j'ai gagné à présent », déclare bientôt votre adversaire. Le capitaine avance alors une de ses pièces sculptées sur le damier et vous vous rendez compte que vous avez perdu. Vous le félicitez pour sa maîtrise du jeu de Samor et vous lui donnez 10 Pièces d'Or. « Peut-être voudrez-vous engager une autre partie demain soir ? demande-t-il, je suis homme à vous offrir une deuxième chance. » « Peut-être », répondez-vous sans vous avancer. Vous souhaitez bonne nuit au capitaine qui vous adresse un sourire et vous rejoignez votre cabine.",
  choix: [
    { texte: "", vers: "197" }
  ]
  },
  {
  id: "59",
  texte: "A coups d'éperons, vous lancez votre cheval en direction d'un Monstre d'Enfer qui s'apprête à frapper un soldat sans défense. Cette créature est insensible à la Discipline Kaï de la Puissance Psychique et ne peut être blessée que par une arme magique.",
  choix: [
    { texte: "Si vous possédez une Lance Magique", vers: "332" },
    { texte: "Dans le cas contraire, il vous faut prendre la fuite en plongeant dans les broussailles pour vous y cacher", vers: "311" }
  ]
  },
  {
  id: "60",
  titre: "Le bras de fer contre Halvorc",
  image: "/lonewolf/ls02/p141-halvorc.webp",
  texte: "HALVORC vous contemple d'un air stupéfait et incrédule. Il est incapable de se défendre au cours des deux premiers assauts en raison de l'effet de surprise de votre attaque. Vous ne perdrez donc aucun point d'ENDURANCE lors de ces deux assauts. Si votre adversaire est toujours en vie au moment du troisième assaut, il s'élancera sur vous armé d'un Poignard.",
  suite: "76",
  combat: { nom: "Halvorc", habilete: 8, endurance: 11, sansDefenseAssauts: 2, description: "Halvorc est incapable de se défendre pendant les deux premiers assauts (le bras de fer tourne à votre avantage)." }
  },
  {
  id: "61",
  texte: "La pluie tombe si dru qu'il vous est difficile de voir distinctement ; vous apercevez cependant les silhouettes sombres de gardes en patrouille qui s'avancent dans votre direction. S'ils vous arrêtaient pour vous demander ce que vous êtes venu faire à Ragadorn, vous pourriez bien finir dans l'une des nombreuses geôles de Lachelan le Suzerain. Il vaut mieux ne pas courir ce risque et vous décidez donc de battre en retraite le long de la rue du Chevalier Noir et de bifurquer le plus vite possible dans la rue du Sage ; votre tactique réussit et les gardes passent sans vous voir.",
  choix: [
    { texte: "", vers: "181" }
  ]
  },
  {
  id: "62",
  texte: "Vous entrez dans une vaste pièce remplie de classeurs et de livres de comptes. Face à vous, un homme revêtu d'un uniforme d'officier des forces navales de Durenor est assis à un grand bureau. Il tient devant lui un énorme livre posé debout sur le bureau. A votre entrée, l'homme lève les yeux de son livre et vous jette un regard inquisiteur. « Vous devez avoir des affaires bien urgentes à mener pour solliciter un laissez-passer rouge à une heure aussi tardive.",
  choix: [
    { texte: "Présenter les documents du jeune garçon", vers: "126", requis: {"drapeau":"documents-faux"} },
    { texte: "Lui montrer le Sceau d'Hammardal", vers: "263", requis: {"special":"sceau-hammardal"} },
    { texte: "Quitter la pièce et retourner dans le hall", vers: "318", montreToujours: true }
  ]
  },
  {
  id: "63",
  titre: "Le Serpent des Sables",
  texte: "Vous êtes réveillé au milieu de la nuit par un poids qui pèse soudain sur votre poitrine. Vous écartez lentement les pans de votre cape et vous découvrez avec horreur qu'un Serpent des Sables s'est niché dessous.",
  choix: [
    { texte: "Si vous voulez essayer d'attraper ce serpent au venin mortel juste derrière la tête et le jeter au loin", vers: "188" },
    { texte: "Si vous préférez vous lever d'un bond en essayant de faire tomber le serpent sur le sol", vers: "201" },
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "264", requis: {"discipline":"communication-animale"} }
  ]
  },
  {
  id: "64",
  texte: "Un peu plus loin, vous apercevrez une diligence semblable à celles qui transportent les voyageurs le long des côtes menant à Ragadorn. Les chevaux ont été dételés et le véhicule semble abandonné. Vous remarquez alors les corps de trois soldats étendus entre les roues. Leurs uniformes sont tachés de sang.",
  choix: [
    { texte: "Si vous souhaitez fouiller la diligence en espérant y trouver de la nourriture ou quelque objet utile", vers: "134" },
    { texte: "Si vous préférez poursuivre votre chemin sans vous attarder", vers: "208" },
    { texte: "Si enfin vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "229", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "65",
  texte: "Tandis que vous courez le long de la rue de la Tour de Guet, vous entendez derrière vous la voix du garde qui pousse des jurons. La voix s'évanouit bientôt et vous arrivez sur la place du Tombeau. Devant vous, dans la rue du même nom, quatre soldats marchent dans votre direction. Vous les évitez en courant vers le sud pendant dix minutes environ, le long d'une rue couverte de gros pavés. Enfin, vous apercevez une grande écurie et un relais de diligence dont les contours se dessinent dans l'obscurité, à quelque distance. Vous vous avancez dans l'ombre et vous parvenez à grimper sur une échelle extérieure qui mène dans un grenier à foin. Personne ne vous a vu et vous êtes en sécurité pour la nuit.",
  choix: [
    { texte: "", vers: "32" }
  ]
  },
  {
  id: "66",
  texte: "Lorsque vous levez la lame étincelante de votre glaive le CAPITAINE ZOMBIE tire de sa veste en lambeaux un poignard menaçant. Il vous faut le combattre jusqu'à la mort de l'un de vous deux. La puissance du Glaive de Sommer vous permet de multiplier par 2 tous les points d'ENDURANCE que le capitaine perdra au cours de l'affrontement, mais votre adversaire est insensible à la Discipline Kaï de la Puissance Psychique.",
  suite: "218",
  combat: { nom: "Capitaine Zombie", habilete: 15, endurance: 15, immunisePsychique: true }
  },
  {
  id: "67",
  texte: "Vous arrivez très vite à la conclusion que l'imposteur a dû s'enfuir par l'entrée principale de la taverne ; s'il est resté dans les environs, il doit probablement se trouver sur la place principale ou à proximité. Vous fouillez les ruelles et les maisons autour de la place, mais vous ne découvrez pas la moindre trace du fuyard. Plutôt que de perdre votre temps en vaines recherches, vous décidez alors de revenir sur le quai. Là, vous détachez l'amarre d'un canot et vous ramez en direction du Sceptre Vert en éprouvant un sentiment de malaise : vous ne vous attendiez pas à ce que vos ennemis se manifestent si tôt, dès les premières heures de votre mission.",
  choix: [
    { texte: "", vers: "300" }
  ]
  },
  {
  id: "68",
  texte: "Le garde vous jette un regard méprisant. « Je suis un soldat de Durenor, dit-il, et votre or ne vous sera d'aucun secours avec moi. » Vous avez eu le tort de porter atteinte à son honneur et il vous donne une rude leçon.",
  choix: [
    { texte: "", vers: "306" }
  ]
  },
  {
  id: "69",
  image: "/lonewolf/ls02/p057-x258.webp",
  texte: "L'un des étrangers sort de sous sa cape un épieu noir qu'il tend devant lui. D'un cône d'acier fixé à l'extrémité de l'épieu s'échappe soudain une flamme bleuâtre et un éclair jaillit dans votre direction. Un fracas assourdissant retentit lorsque l'éclair vient frapper le bouclier de Rhygar. « Pas de quartiers ! » crie alors le Lieutenant Général en se précipitant sur l'étranger à la lance de feu. L'épée de votre compagnon transperce la cape de son adversaire mais ce dernier reste indemne. Vous comprenez alors à qui vous avez affaire ; ces créatures vêtues de capes sont en effet des Monstres d'Enfer, des êtres cruels au service des Maîtres des Ténèbres dont ils sont les capitaines. Ils ont la faculté d'adopter une apparence humaine, mais ils restent invulnérables aux armes normales. Le Monstre d'Enfer que combat le Lieutenant Général pousse un cri terrifiant qui vous déchire la tête ; aveuglé par cette douleur fulgurante, vous trébuchez et vous tombez dans les broussailles épaisses qui recouvrent le flanc boisé de la colline. Si vous ne maîtrisez pas la Discipline Kaï du Bouclier Psychique, vous perdez 2 points d'ENDURANCE sous la violence de l'attaque mentale du Monstre.",
  choix: [
    { texte: "", vers: "311" }
  ]
  },
  {
  id: "70",
  texte: "Vous haletez de douleur lorsque le serpent plonge ses crochets dans votre bras. Vous saisissez le reptile juste derrière sa tête repoussante, vous l'arrachez à votre bras et vous le jetez dans l'herbe. Mais le serpent a eu le temps de vous infliger une profonde morsure et son venin commence à faire de l'effet.",
  choix: [
    { texte: "Présenter le Pendentif à l'Étoile de Cristal", vers: "219", requis: {"special":"cristal-etoile"} },
    { texte: "N'avoir rien pour conjurer le venin", vers: "44", montreToujours: true }
  ]
  },
  {
  id: "71",
  texte: "Vous claquez la porte derrière vous et vous poussez le verrou. La boutique est sombre, mais vous parvenez cependant à distinguer un escalier à votre droite, une trappe au milieu du plancher et une porte dans le mur du fond. Soudain, vous entendez le fracas d'une hache qui vient de briser un panneau de la porte d'entrée. On vous a vu entrer dans la boutique et la populace est en train de défoncer la porte.",
  choix: [
    { texte: "Si vous souhaitez ouvrir la trappe et vous cacher dans la cave", vers: "11" },
    { texte: "Si vous préférez quitter la boutique par la porte du fond", vers: "54" },
    { texte: "Enfin, si vous décidez plutôt de monter l'escalier", vers: "235" }
  ]
  },
  {
  id: "72",
  texte: "L'aubergiste prend votre Pièce d'Or et pose devant vous une chope de bière mousseuse. C'est une bière forte et revigorante qui vous redonne un point d'ENDURANCE.",
  choix: [
    { texte: "Si vous souhaitez parler à l'aubergiste", vers: "226" },
    { texte: "Si vous désirez prendre une chambre pour la nuit, il vous en coûtera 2 Pièces d'Or et vous", vers: "56" },
    { texte: "Si enfin vous souhaitez engager une partie de bras de fer", vers: "276" }
  ],
  effets: { endurance: 1, or: -1 }
  },
  {
  id: "73",
  texte: "L'escalade se révèle malaisée car vous n'avez qu'une seule main libre, l'autre tenant le pommeau du Glaive de Sommer. Finalement, vous parvenez quand même au sommet de la tour et vous vous hâtez d'enjamber le muret qui tient lieu de garde-fou. Vous vous apprêtez à sauter à l'intérieur de la tour et à passer à l'attaque lorsqu'une petite voix vous fige sur place : « Votre mort sera pour moi un spectacle tout à fait délectable, Loup Solitaire. » Vous apercevez alors le sorcier qui se tient dans le coin opposé de la tour, sa main gauche tendue vers vous. « Votre Mission a échoué, Loup Solitaire, dit-il ; à présent, il faut songer à mourir. » Un éclair s'échappe aussitôt de sa main et une flamme orange jaillit en direction de votre visage.",
  choix: [
    { texte: "", vers: "336" }
  ]
  },
  {
  id: "74",
  texte: "Vous posez vos mains sur sa poitrine et vous essayez de refermer sa blessure. Il a perdu beaucoup de sang et bien qu'il transpire abondamment, il a la peau froide. Ses yeux s'ouvrent alors et il prononce quelques mots à peine audibles. « Les pirates... Les pirates de Lakuri... Attention aux voiles rouges... Repoussez les pirates... » Le capitaine perd à nouveau connaissance. Vous l'enveloppez dans des couvertures et vous glissez un coussin sous sa tête, mais il a déjà plongé dans un sommeil dont il ne reviendra jamais. Pendant ce temps, les cadavres des membres de l'équipage ont été rassemblés sur le pont. Le capitaine Kelman s'approche de vous et vous tend un cimeterre noir qui semble particulièrement redoutable. « Ce n'est pas une épée de pirate, Loup Solitaire, dit-il, cette lame vient des forges de Helgedad. C'est une épée de Maître des Ténèbres. » On ne pouvait vous annoncer plus mauvaise nouvelle car, si les Maîtres des Ténèbres ont rallié les pirates de Lakuri à leur cause, le voyage jusqu'à Durenor sera plus périlleux encore que vous ne le pensiez. Vous jetez à l'eau le cimeterre noir et vous revenez à bord du Sceptre Vert. Et tandis que vous mettez le cap à l'est, le navire marchand de Durenor s'enfonce dans les profondeurs de la mer.",
  choix: [
    { texte: "", vers: "240" }
  ]
  },
  {
  id: "75",
  texte: "Vous pénétrez dans un bureau aux odeurs de moisi. Deux hommes y sont assis, penchés sur leurs tables qui ploient sous des piles de livres et de papiers. « Bonsoir, monsieur», dit l'un des hommes. Sa longue moustache soigneusement cirée tressaute quand il parle. « Monsieur désire-t-il un laissez-passer de marchand ? » demande-t-il. Avant même que vous ayez pu répondre, l'homme vous tend une poignée de formulaires incompréhensibles. « Si Monsieur veut bien se donner la peine de signer ici, je me ferai un plaisir de donner immédiatement à Monsieur son laissez-passer.",
  choix: [
    { texte: "Signer et acheter le laissez-passer blanc (10 PO)", vers: "142", requis: {"or":10}, effets: { or: -10, objets: [{"id":"laissez-passer-blanc","message":"Laissez-passer de marchand, valable sept jours"}] } },
    { texte: "Ne pas acheter le laissez-passer et retourner dans le hall", vers: "318", montreToujours: true }
  ]
  },
  {
  id: "76",
  texte: "En fouillant ses longs vêtements tachés de sang, vous vous rendez compte avec un sentiment de malaise qu'aucune preuve ne permet d'affirmer que cet homme était bien celui qui cherchait à vous tuer. Vous ne trouvez sur lui qu'un Poignard et 2 Pièces d'Or que vous pouvez vous approprier si vous le désirez.",
  choix: [
    { texte: "S'approprier le Poignard et les 2 Pièces d'Or", vers: "33", effets: { or: 2, objets: [{"id":"poignard"}] } },
    { texte: "Ne rien prendre", vers: "33" }
  ]
  },
  {
  id: "77",
  texte: "Au cours de votre entraînement au monastère Kaï, vos maîtres vous ont enseigné de nombreux langues et dialectes en usage dans les régions septentrionales de Magnamund. L'un de ces dialectes est le squall. Or, il se trouve précisément que les créatures rassemblées dans cette clairière sont des Squalls. A grands cris, ils vous expliquent que l'homme blessé n'a en réalité rien d'humain. C'est un Monstre d'Enfer, affirment-ils, un de ces êtres maléfiques qui ont le pouvoir de changer de forme à leur guise et qui comptent parmi les plus fidèles serviteurs des Maîtres des Ténèbres.",
  choix: [
    { texte: "Si vous pensez que les Squalls disent vrai, jetez un coup d'œil au contenu du sac de l'homme blessé", vers: "320" },
    { texte: "Si en revanche vous soupçonnez les Squalls de vous mentir pour vous dissuader d'intervenir dans leurs jeux répugnants, attaquez-les avec votre arme", vers: "28" }
  ]
  },
  {
  id: "78",
  texte: "Vous faites un bond en arrière, juste à temps pour éviter d'être écrasé par le mât qui s'abat sur le pont en passant au travers. Vous vous relevez en chancelant et vous examinez les débris de bois. Le corps sans vie du capitaine Kelman est coincé sous le mât brisé. Vous contemplez ce spectacle d'un regard horrifié lorsque soudain la tempête ouvre une large brèche dans la coque déjà endommagée du Sceptre Vert. Et tandis que le navire se disloque, vous êtes projeté par-dessus le bastingage et vous tombez dans les flots déchaînés. A moitié étouffé, vous parvenez tant bien que mal à remonter à la surface pour prendre une bouffée d'air, et votre tête heurte alors un panneau d'écoutille. Vous perdez un point d'ENDURANCE et vous vous hissez sur ce radeau de fortune. Si vous portez une cotte de mailles, il faut vous en débarrasser, sinon, vous risquez de périr noyé. Rayez-la de votre Feuille d'Aventure. Dans la lumière grise de la tourmente, vous contemplez la coque brisée du navire qui sombre dans la mer. Vous êtes alors pris de vertige, vous vous sentez mal et vous vous cramponnez de toutes vos forces au panneau d'écoutille, mais peu à peu votre corps faiblit et vous perdez conscience. Lorsque, enfin, vous vous réveillez, la tempête s'est calmée. Il ne reste plus du Sceptre Vert que le panneau d'écoutille sur lequel vous êtes toujours étendu. A en juger par la position du soleil, l'après-midi touche à sa fin. Au loin, vous apercevez un petit bateau de pêche et au-delà, la côte qui s'étend à l'horizon.",
  choix: [
    { texte: "Si vous voulez essayer de signaler votre présence au bateau de pêche en agitant votre cape", vers: "278" },
    { texte: "Si vous préférez ne pas vous occuper du bateau et tenter de rejoindre la côte en pagayant à l'aide de vos seules mains", vers: "337" }
  ],
  effets: { endurance: -1, retirerObjets: ["cotte-mailles"] }
  },
  {
  id: "79",
  image: "/lonewolf/ls02/p063-x290.webp",
  texte: "Une puissante énergie se répand dans votre corps avec une telle force que vous en oubliez tout ce qui vous entoure. Instinctivement, vous levez le Glaive au-dessus de votre tête ; un rayon de soleil vient alors frapper l'extrémité de sa lame et une lumière blanche, aveuglante, jaillit aussitôt dans toute la pièce. C'est à ce moment précis que le véritable pouvoir du Glaive de Sommer se révèle à vous dans toute son ampleur. Cette arme a été forgée bien avant que les Sommerlundois, les Durenorais et les Maîtres des Ténèbres se soient installés sur les territoires des Fins de Terre. Ceux qui ont fabriqué le Glaive appartiennent à une lignée que les hommes appelleraient des dieux et seul un Seigneur Kaï peut déployer la puissance de cette arme exceptionnelle : si quiconque d'autre s'en servait pour combattre, cette puissance faiblirait et finirait par disparaître à jamais. Lorsque vous en ferez usage lors d'un combat, le Glaive de Sommer ajoutera 8 points à votre total d'HABILETÉ et 10 points si vous avez choisi la Discipline Kaï de la Maîtrise des Armes (bien entendu, il faudra, dans ce cas, que la Table de Hasard vous ait donné cette maîtrise à l'épée). Le Glaive a le pouvoir de rendre nulle toute pratique magique exercée par un ennemi contre celui qui le brandit ; en outre, si vous devez affronter des créatures de l'au-delà, des Monstres d'Enfer par exemple, tous les points d'ENDURANCE perdus par vos adversaires au cours des combats seront multipliés par 2 : telle est la puissance du Glaive de Sommer. Enfin, c'est la seule arme, au nord de Magnamund, qui puisse tuer un Maître des Ténèbres et c'est pourquoi vos ennemis feront tout pour empêcher le succès de votre mission. Vous avez pleinement conscience, à présent, de tenir entre vos mains le salut de votre peuple car nul autre pouvoir que celui du Glaive ne parviendra à lui donner la victoire. Peu à peu, la lumière blanche et aveuglante s'évanouit et vous sentez alors peser sur votre épaule la main de Lord Axim. « Venez, Loup Solitaire, dit-il, car il y a maintenant beaucoup à faire pour préparer votre retour au Royaume du Sommerlund. » Vous rangez le Glaive dans son fourreau incrusté de pierreries et vous suivez Lord Axim qui sort de la chambre du roi. Apportez les modifications nécessaires à votre total d'HABILETÉ, en fonction des indications qui viennent de vous être données, et notez les pouvoirs que vous confère le glaive dans la case Objets Spéciaux de votre Feuille d'Aventure.",
  choix: [
    { texte: "", vers: "40" }
  ]
  },
  {
  id: "80",
  texte: "Le chevalier remet son épée au fourreau et vous conduit à l'intérieur de la tour. Vous le suivez le long d'un escalier de pierre qui mène à une vaste salle ; un feu de bois brûle dans une cheminée en répandant une agréable chaleur. « Si vous êtes vraiment celui que vous prétendez être, vous devez avoir en votre possession le Sceau d'Hammardal. Dans ce cas, montrez-le-moi », ordonne le chevalier.",
  choix: [
    { texte: "Si vous acceptez de lui montrer le Sceau", vers: "15" },
    { texte: "Si vous n'avez plus le Sceau ou si vous ne voulez pas le lui montrer", vers: "189" }
  ]
  },
  {
  id: "81",
  texte: "Le lendemain matin, vous êtes réveillé par la vigie postée dans le nid-de-pie : « Canot de sauvetage sur bâbord avant», annonce l'homme à grands cris. Vous montez sur le pont en affrontant la fraîcheur de la brise et vous y rencontrez le capitaine. A une cinquantaine de mètres sur bâbord avant, un canot endommagé dérive, ballotté par une forte houle. A bord, trois hommes serrés les uns contre les autres essaient de se protéger de la froideur du vent. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "260", texte: "Si vous tirez entre 0 et 4," },
        "5-9": { vers: "281", texte: "Si vous tirez entre 5 et 9," }
      }
      }
  },
  {
  id: "82",
  texte: "Lorsque vous êtes assuré que la populace s'est bel et bien éloignée, vous sautez de la meule et vous courez le long de la rue en vous dissimulant dans l'ombre et en prenant bien garde à ne pas faire de bruit. Bientôt, vous apercevez sur votre gauche une boutique qui porte cette enseigne : La vitrine de la boutique est éclairée et la porte ouverte.",
  choix: [
    { texte: "Si vous voulez entrer dans les lieux", vers: "55" },
    { texte: "Si vous préférez continuer à courir le long de la rue", vers: "347" }
  ]
  },
  {
  id: "83",
  texte: "Au bout de la rue de la Bernicle, vous arrivez à un croisement. Il fait déjà nuit à présent et il va bientôt falloir vous trouver un abri.",
  choix: [
    { texte: "Si vous souhaitez tourner à gauche, dans la rue du Tonnelier", vers: "227" },
    { texte: "Si vous préférez prendre à droite la rue de la Licorne", vers: "297" }
  ]
  },
  {
  id: "84",
  texte: "Dans l'entrée principale, un vieil homme est assis ; il arbore une longue barbe et semble fort aimable. Penché sur un lutrin, il est en train d'étudier un énorme livre à la reliure de cuir. Sa lecture l'absorbe tant qu'il n'a pas remarqué votre présence dans l'enceinte de l'hôtel de ville.",
  choix: [
    { texte: "Si vous souhaitez lui demander le chemin du consulat du Sommerlund", vers: "211" },
    { texte: "Si vous préférez repartir et trouver vous-même votre chemin", vers: "191" }
  ]
  },
  {
  id: "85",
  titre: "Viveka l'aventurière",
  image: "/lonewolf/ls02/p141-viveka.webp",
  texte: "VIVEKA renverse la table d'un coup de pied. Elle est rapide comme l'éclair et votre effet de surprise est complètement raté. Elle a déjà dégainé son épée et se jette sur vous.",
  suite: "124",
  combat: { nom: "Viveka", habilete: 24, endurance: 27, description: "L'aventurière est rapide comme l'éclair : votre effet de surprise est complètement raté." }
  },
  {
  id: "86",
  texte: "De ce côté du port, de nombreux navires sont amarrés ; il y a là des bateaux de toutes sortes qui battent pavillon de tous pays. Le fleuve Dom qui traverse la ville de Ragadorn connaît toujours une très grande activité : c'est la voie navigable la plus importante de la région. Vous êtes sur le point d'abandonner vos recherches lorsque vous repérez enfin le bateau de pêche de vos malandrins. Il n'y a personne à bord, mais une fouille en règle vous permet de découvrir une Masse d'Armes et trois Pièces d'Or dissimulées dans un hamac soigneusement plié. Une étiquette est cousue sur le hamac et porte ces mots : Taverne de l'Étoile du Nord rue de la Bernicle. Vous prenez la Masse d'Armes et les Pièces d'Or et vous retournez sur la place du Poteau de Pierre.",
  choix: [
    { texte: "Si vous souhaitez aller vers l'est, le long de la rue de la Bernicle", vers: "215" },
    { texte: "Si vous préférez aller au sud, en suivant le Dock de la rive Ouest", vers: "303" },
    { texte: "Enfin, si vous choisissez plutôt de prendre la direction du nord en empruntant la rue du Butin", vers: "129" }
  ],
  effets: { or: 3, objets: [{"id":"masse"}] }
  },
  {
  id: "87",
  texte: "Lorsque vous levez votre arme pour en frapper le chevalier, vous vous rendez compte trop tard que vous avez commis une erreur fatale, car l'homme est un escrimeur de toute première force et les soldats appartiennent au régiment d'élite de la garde du roi Alin IV. Pensant que vous êtes un Monstre d'Enfer, ils vous encerclent et vous taillent en pièces. Votre mission s'achève tragiquement en même temps que votre vie, ici, à Tarnalin.",
  fin: "mort",
  nomFin: "Fin tragique — §87"
  },
  {
  id: "88",
  texte: "Bien que la nuit soit tombée, la pleine lune projette une brillante clarté sur tout le village. Derrière la taverne, vous apercevez la petite boutique d'un charron ; deux chevaux sont attelés à une charrette à foin stationnée juste devant la porte.",
  choix: [
    { texte: "Si vous souhaitez prendre l'un des chevaux pour vous enfuir au galop", vers: "150" },
    { texte: "Si vous préférez vous cacher dans la boutique du charron", vers: "71" },
    { texte: "Si enfin vous maîtrisez la Discipline Kaï du Camouflage", vers: "179", requis: {"discipline":"camouflage"} }
  ]
  },
  {
  id: "89",
  texte: "Au moment où vous sautez, le conducteur vous aperçoit et arrête aussitôt la diligence. Puis il se tourne vers vous, une épée à la main.",
  choix: [
    { texte: "Si vous souhaitez lui payer le prix d'un billet", vers: "233" },
    { texte: "Si vous préférez l'attaquer", vers: "212" }
  ]
  }
];
