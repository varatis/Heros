import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 04 — Le Tyran du Désert
 * Paragraphes 301 à 400. Fichier GÉNÉRÉ par
 * scripts/ls05-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls05-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_301_400: StorySection[] = [
  {
  id: "301",
  texte: "Utilisant les barres de fer comme les barreaux d'une échelle, vous escaladez la porte dont le haut est hérissé de longues piques en bois enduites d'une sorte de goudron huileux. Au moment précis où vous enjambez précautionneusement l'obstacle, les Gardes tirent sur vous à l'aide de leurs arbalètes. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez le titre de Gardien Kai (ou un titre supérieur), déduisez 2 points du chiffre que vous avez tiré. Si vous maîtrisez la Discipline Kaï de la Chasse, déduisez 1 point de ce même chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "4-4": { vers: "363", texte: "Si le résultat obtenu est inférieur à 4," },
        "5-9": { vers: "259", texte: "Si le résultat obtenu est compris entre 5 et 9," }
      }
      }
  },
  {
  id: "302",
  texte: "Banedon prend la barre tandis que son extraordinaire vaisseau, la Nef du ciel, ainsi que le nomment les Nains, fait route à travers les ténèbres grandissant vers le passage du Dahir. La visibilité diminue de minute en minute jusqu'à ce que vous ne puissiez plus rien distinguer au-delà de la passerelle qui borde le vaisseau. Vous vous sentez plutôt mal à l'aise, car si la Nef du ciel dévie de sa route, ne serait-ce que d'un pouce, vous irez vous écraser contre les parois abruptes de la montagne. « Ne vous inquiétez pas, Loup Solitaire, dit Nolrim, le Nain à la sacoche de velours, le capitaine s'en sortira ! » Banedon, quant à lui, se tient debout, la main délicatement posée sur le cristal étincelant, et l'air absent, comme s'il était en transes. Ses yeux sont fermés et une série de pulsations nerveuses tracent de fugitifs sillons sur son front et ses tempes. Le Nain vous conduit à une cabine située à l'arrière du vaisseau où les membres de l'équipage se racontent avec grande excitation leur victoire sur les Kraans et leurs cavaliers. Ils sont tous assis autour d'une table jonchée d'assiettes fumantes et de bocks de bière mousseuse. L'odeur alléchante des plats épicés et de la bière de Bor vous chatouille les narines et vous fait soudain réaliser que mourez de faim. Vous dévorez en un clin d'œil la viande à la moelle que l'on vous sert. Ce copieux repas vous fait gagner 3 points d'ENDURANCE. Cependant, vous hésitez avant d'accepter un bock de bière, car la bière de Bor est une boisson si forte qu'elle a été proscrite dans maintes villes du Magnamund en raison des ravages qu'elle peut occasionner.",
  choix: [
    { texte: "Si vous voulez boire un peu de cette bière de terrible réputation", vers: "392" },
    { texte: "Si vous préférez décliner l'offre et vous en abstenir", vers: "283" }
  ]
  },
  {
  id: "303",
  texte: "Vous vous approchez furtivement de la sentinelle par-derrière et vous la réduisez définitivement au silence en lui tordant le cou.",
  choix: [
    { texte: "Vous traînez ensuite le corps un peu plus loin et vous le cachez sous une brouette avant d'entrer dans le Tombeau", vers: "395" }
  ]
  },
  {
  id: "304",
  texte: "Le Vordak s'écroule à vos pieds mais, avant même que vous ne puissiez vous échapper, vous êtes encerclé par les Drakkars. Un silence de mort s'abat sur l'Arbo-retum. Vous vous apprêtez à fuir en vous élançant à travers vos adversaires, mais d'autres guerriers font leur apparition et un frisson vous parcourt l'échiné : les Drakkars qui viennent d'arriver en renfort sont tous armés d'une arbalète. Tandis que vous poussez votre cri de guerre « Pour le Sommerlund ! », une volée de flèches empoisonnées vous transperce le corps de part en part et vous vous effondrez sur le sol. Alors que votre sang s'écoule à flots dans la terre molle de la serre, le dernier son qui parvient à vos oreilles est le rire odieux et moqueur du Seigneur de Ténèbres Haakon qui s'élève audessus des hurlements macabres des Drakkars. Votre vie s'achève ici et les espoirs du Sommerlund aussi.",
  fin: "mort",
  nomFin: "Fin tragique — §304"
  },
  {
  id: "305",
  texte: "Après avoir attaché une extrémité de la corde à la rambarde du parapet, vous lancez l'autre bout dans le vide et vous vous laissez glisser le long de la tour. Vous êtes parvenu à mi-hauteur lorsque vous voyez soudain, au-dessus de vous, deux Drakkars en train de couper le nœud que vous aviez fait. La corde casse avec un claquement sec et vous tombez comme une pierre. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-2": { vers: "293", texte: "Si le chiffre que vous avez tiré est compris entre 0 et 2," },
        "3-9": { vers: "234", texte: "Si ce chiffre est compris entre 3 et 9," }
      }
      }
  },
  {
  id: "306",
  texte: "« Tenez-vous bien, Loup Solitaire ! » crie Banedon en reprenant le contrôle de sa barre de cristal. Vous lui obéissez et vous saisissez le garde-fou tout en bloquant vos pieds contre le bas du bastingage pour plus de sûreté, car vous avez deviné la manœuvre que le jeune sorcier à l'intention d'effectuer. « Attention : coup du pirate ! » crie alors Banedon à ses Nains qui sont toujours en train de livrer bataille. Puis il tourne brusquement la barre à gauche. La Nef du ciel réagit immédiatement à son geste et bascule jusqu'à ce que le pont se retrouve presque à la verticale. Les Nains obéissent à l'ordre donné et se jettent à plat ventre sur le pont, s'agrippant aux planches comme des patelles sur la quille d'un galion. Les Drakkars, eux, perdent l'équilibre, culbutent sur le pont et la passerelle, puis ils tombent dans le vide en hurlant de terreur. Banedon redresse alors le vaisseau et des cris de victoire retentissent tandis que la Nef du ciel file à vive allure vers les Foos.",
  choix: [
    { texte: "« Œil pour œil, dent pour dent ! » clament les Nains à l'unisson", vers: "247" }
  ]
  },
  {
  id: "307",
  texte: "« Oui, oui, je suis bien Soushilla », réplique-t-elle. « Savez-vous où nous pourrions trouver Tipasa le Vagabond ? » demande alors Banedon.",
  choix: [
    { texte: "Sans dire un mot, la petite vieille tend sa sébile et attend que votre compagnon lui donne encore une Pièce d'Or avant de se décider à répondre", vers: "314" }
  ]
  },
  {
  id: "308",
  texte: "Il faut de nombreuses années à un cavalier pour apprivoiser un Itikar, car ces créatures sont sauvages et rusées de nature. Vous concentrez tout votre pouvoir Kaï afin de communiquer avec l'oiseau géant et lui faire comprendre que vous ne lui voulez aucun mal. Celui-ci vous fixe d'un regard noir et dur, mais vous sentez qu'il ne vous est plus hostile. Alors que vous vous installez sur la large selle, vous apercevez les Drakkars qui commencent à traverser la passerelle en courant.",
  choix: [
    { texte: "Vous vous penchez rapidement et vous détachez la corde de l'anneau de la selle, puis vous saisissez les solides rênes de cuir", vers: "343" }
  ]
  },
  {
  id: "309",
  texte: "Alors que vous pénétrez dans les écuries, l'odeur forte des Douggas vous prend à la gorge et vous ne pouvez vous empêcher de vous boucher le nez tout en serrant les dents avec une grimace de dégoût. Un jeune garçon se met à rire de votre réaction et s'écrie : « Je donnerai ma main à couper que vous n'êtes pas d'Ikaresh, vous ! » Puis il se met à imiter votre moue, révélant dans sa mimique une rangée de dents abîmées. « Sais-tu où je pourrais trouver Tipasa le Vagabond ? » demande Banedon tout en brandissant un anneau d'argent. Une lueur de convoitise brille soudain dans les yeux du garçon à la vue du métal étincelant. « Mais oui, bien sûr ! réplique-t-il avec empressement. Remontez l'allée et prenez la première ruelle à votre gauche. Le vieux vagabond y habite la maison à la porte bleue. » D'une chiquenaude, Banedon lance l'anneau en l'air et le gamin s'en saisit au vol avec avidité. Vous quittez ensuite rapidement les lieux et vous commencez à chercher la ruelle que l'on vous a indiquée. Au moment même où vous l'atteignez, vous entendez le jeune garçon pousser un cri de déception : l'anneau vient de se volatiliser au creux de sa main !",
  choix: [
    { texte: "Sans y accorder plus d'attention, vous vous engagez dans la ruelle sombre et malpropre au bout de laquelle vous découvrez enfin la maison à la porte bleue", vers: "206" }
  ]
  },
  {
  id: "310",
  texte: "Tandis que vous enjambez les cadavres, vous remarquez une Clé de Cuivre accrochée au cou d'un homme par une fine chaîne. Vous prenez cette Clé, que vous glissez dans votre poche, puis vous descendez rapidement l'escalier au bas duquel brille une faible lueur. (N'oubliez pas d'inscrire la Clé de Cuivre dans la case des Objets Spéciaux de votre Feuille d'Aventure.) Un petit feu, où un poulet est en train de rôtir à la broche, éclaire la salle de Garde située en bas de la tour. Une gourde d'eau est accrochée au dossier d'une chaise en fer forgé et, posée sur le sol, juste à côté, se trouve une épée dont la lame est effilée comme un rasoir. Vous pouvez prendre l'un de ces deux objets, ou même les deux si vous le désirez. Dans ce cas, inscrivez-les sur votre Feuille d'Aventure (notez la gourde dans la case Sac à Dos). Tout à coup, vous entendez les Drakkars dévaler à grand bruit l'escalier de la tour. Ils ne tarderont pas à vous rejoindre et vous devez prendre une décision rapide.",
  choix: [
    { texte: "Si vous désirez sortir de la tour par la porte donnant au nord", vers: "246" },
    { texte: "Si vous préférez affronter les Drakkars, préparez-vous à combattre et", vers: "231" }
  ]
  },
  {
  id: "311",
  texte: "Vous levez votre Glaive d'or juste à temps pour parer la décharge d'énergie brute. Celle-ci crisse sur votre lame et va exploser contre le mur de la pièce, creusant dans le roc un trou de plusieurs dizaines de centimètres de profondeur tout en dégageant un épais nuage de poussière. Sous le choc, le Glaive de Sommer vous échappe des mains et fend l'air en décrivant un arc de cercle avant d'aller se planter avec force dans le sol. Roulant sur vous-même, vous vous abritez derrière une colonne tandis que Haakon vous crie ironiquement : « Ta dernière heure est arrivée, Seigneur Kai ! »",
  choix: [
    { texte: "Si vous désirez aller rechercher le Glaive de Sommer", vers: "278" },
    { texte: "Si vous préférez tenter de gagner un autre abri avant que la poussière ne soit retombée", vers: "350" },
    { texte: "Si vous jugez préférable de rester là où vous êtes", vers: "230" }
  ]
  },
  {
  id: "312",
  texte: "Les Nains sont à présent en train de nettoyer le pont de tous les débris de bataille. Un guerrier Drakkar mort gît sur le ventre, au sommet d'un empilement de caisses et de sacs regroupés sous la grand-voile. Alors que les Nains le tirent par les pieds pour le jeter pardessus bord, il revient subitement à la vie et les envoie culbuter. Le Drakkar hurle comme un fou tout en faisant tournoyer sa hache qui décrit autour de lui une courbe sanguinolente. Un juron de malédiction retentit depuis son masque à tête de mort, puis il lève le bras pour lancer sa hache. De toute évidence, c'est vous qu'il prend pour cible ! Si vous ne maîtrisez aucune de ces Disciplines, utilisez la Table de Hasard pour obtenir un chiffre.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Chasse ou celle du Sixième Sens", vers: "210", requis: {"discipline":"sixieme-sens"} }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "354", texte: "Si le chiffre que vous avez tiré est compris entre 0 et 4," },
        "5-8": { vers: "371", texte: "Si ce chiffre est compris entre 5 et 8," },
        "9-9": { vers: "232", texte: "Enfin, si vous avez tiré un 9," }
      }
      }
  },
  {
  id: "313",
  texte: "Au pied du clocher, vous remarquez un espace où sont alignés plusieurs enclos à Itikars possédant chacun une aire d'atterrissage personnelle. Les Itikars sont de grands oiseaux noirs qui nichent dans les plus hauts sommets du Dahir et des monts Vakar. Les Vassa-goniens ont depuis longtemps réussi à apprivoiser ces géants du ciel. Ils les utilisent couramment comme monture pour les déplacements des chefs militaires, des éclaireurs, des messagers et des envoyés spéciaux. Soudain, un cavalier monté sur un Itikar surgit du ciel rougeoyant et vient atterrir sur la plate-forme jouxtant le clocher. Des esclaves tendent une corde au cavalier qui l'attache à son tour à l'anneau de la selle avant de mettre pied à terre. L'Itikar croasse en faisant battre ses larges et puissantes ailes tandis qu'un treuil l'emporte de force vers son enclos. Le cavalier et les esclaves quittent la plate-forme et il ne reste plus à présent qu'une seule sentinelle à l'entrée de l'enclos. Si vous réussissez à la maîtriser, vous pourrez alors fuir sur le dos de l'oiseau géant.",
  choix: [
    { texte: "Si vous possédez une sarbacane et une Flèche de Sommeil", vers: "325" },
    { texte: "Si vous ne possédez pas ces objets", vers: "282" }
  ]
  },
  {
  id: "314",
  texte: "« Vous trouverez Tipasa sur la Grand-Place. Il y est toujours à cette heure-ci de la journée », dit la vieille femme en grimaçant un sourire forcé.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "358", requis: {"discipline":"sixieme-sens"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "263" }
  ]
  },
  {
  id: "315",
  texte: "Alors que vous tirez le Glaive de Sommer de son fourreau, un reflet d'or aveuglant court le long de sa lame. Le Vordak hurle d'effroi, ses doigts osseux maculés de sang s'agrippant à une lourde masse d'armes en métal noir qui pend à sa ceinture. Le Vordak lève son arme pour parer votre coup, mais l'épée du soleil fend le fer de votre adversaire en lançant une gerbe d'étincelles bleues. Vous frappez à nouveau en décrivant un grand cercle et la lame d'or transperce le corps monstrueux du Vordak, le coupant en deux de la tête à la taille. Une épouvantable odeur aigre vous prend à la gorge tandis qu'un flot de liquide verdâtre s'écoule à travers les vêtements rouges de la créature. Le Vordak vacille et se recroqueville sous vos yeux puis le cadavre en dissolution tombe en vrille vers le lac Inrahim en produisant un sifflement aigu. Après avoir rengainé votre arme, vous saisissez les rênes et vous vous efforcez de maîtriser les tressaillements de votre monture blessée. Bien que vous vous soyez débarrassé du Vordak, la victoire n'en est pas assurée pour autant, car l'Itikar perd toujours son sang en abondance et il risque à tout moment de sombrer dans l'inconscience et de vous laisser tomber comme une pierre. Soudain, vous apercevez quelque chose dans le lointain...",
  choix: [
    { texte: "Cette vision vous redonne envie de croire aux miracles !", vers: "221" }
  ]
  },
  {
  id: "316",
  texte: "Après vous être péniblement remis debout, vous constatez que la Nef du ciel est assaillie par les Drakkars. Ceux-ci ont en effet sauté à bas de leurs Kraans hurlants et s'abattent maintenant sur la passerelle et le pont, leurs noires épées déjà tirées de leur fourreau et prêtes à frapper. Les Nains sont momentanément pris de court, car toutes leurs armes ont été emmagasinées dans la soute, mais ils ne tardent pas à se reprendre et à combattre de toute leur énergie et de toute leur habileté. Une voix s'élève audessus du vacarme et vous entendez Nolrim lancer son fameux cri de guerre : « Œil pour œil, dent pour dent ! » Mais un coup inattendu vous atteint dans le dos et vous fait tomber de la plateforme sur le pont en contrebas. Vous commencez à vous redresser péniblement quand votre agresseur passe de nouveau à l'attaque. Vous ne pouvez pas lui échapper : DRAKKAR HABILETÉ : 18 ENDURANCE : 26 Étant donné la rapidité de l'attaque, réduisez votre total d'HABILETÉ de points durant les 3 premiers Assauts.",
  suite: "333",
  combat: { nom: "Drakkar", habilete: 18, endurance: 26 }
  },
  {
  id: "317",
  texte: "Votre cœur bat à tout rompre tandis que vous gravissez les marches de marbre. A une vingtaine de mètres devant vous, il y a un palier où se trouve une porte en pierre. Au-delà, l'escalier continue à monter vers un chemin de ronde muni d'un parapet au bout duquel se trouve une autre porte en pierre, identique à la première. Soudain, la porte du palier s'ouvre à la volée et un Garde surgit dans l'encadrement, face à vous. « Par le Majhan ! » s'écrie-t-il en portant la main à son épée.",
  choix: [
    { texte: "Si vous désirez attaquer le Garde avant qu'il ne dégaine son arme", vers: "338" },
    { texte: "Si vous préférez le bousculer et continuer à monter l'escalier en courant", vers: "372" }
  ]
  },
  {
  id: "318",
  texte: "« Ah ! Tipasa... réplique-t-il pensivement, il ne demeure pas loin du marché aux Douggas, mais je ne sais pas où exactement. De plus, cela fait des années que je n'ai vu le vieux Tipasa. Si toutefois vous le trouvez, rappelez-le au bon souvenir de Khamsin le chevrier ; il me doit toujours 20 Pièces d'Or et moi, je ne l'ai pas oublié ! »",
  choix: [
    { texte: "Après avoir remercié le vieux chevrier, vous prenez congé de lui et vous vous remettez en route pour Ikaresh", vers: "272" }
  ]
  },
  {
  id: "319",
  texte: "Le Médaillon d'Onyx commence à briller et à vibrer au fond de votre poche. Cet Objet Spécial, que vous avez arraché de l'armure d'un traître - un capitaine Vassagonien - lors de la bataille de Ruanon, va vous permettre d'entrer en communication avec l'Itikar. Vous faites comprendre à l'oiseau que vous ne lui voulez aucun mal. Les Itikars dont des créatures sauvages et rusées de nature mais, par son pouvoir, le Médaillon d'Onyx parvient à dominer cette instinctive méfiance et à obtenir la docilité des animaux envers celui qui le porte. Alors que vous vous installez sur la confortable selle, vous voyez soudain des Drakkars traverser la passerelle.",
  choix: [
    { texte: "Vous vous penchez pour délier la corde qui retient l'Itikar par l'anneau de la selle et vous saisissez les solides rênes de cuir", vers: "343" }
  ]
  },
  {
  id: "320",
  texte: "Le jour se lève derrière une colline basse semée d'arbustes touffus. La Nef du ciel a fait route rapidement à travers les ténèbres de la nuit et vous vous trouvez à présent dans les contreforts des monts Koneshi, dont les replis rocheux pourront dérober le vaisseau de l'espace aux regards indiscrets. A 25 km au nord, au-delà d'une étendue de pierrailles et de broussailles desséchées, se dresse le Tombeau du Majhan. Banedon et vous vous remettez en route, soucieux de ne pas perdre de temps tant que vous pouvez bénéficier de la protection de la nuit. A présent, tandis que le disque rougeoyant du soleil s'élève lentement à l'horizon, vous découvrez enfin le but de votre voyage. De gigantesques fouilles ont mis à nu le cœur de cette terre aride en creusant les alentours des tombeaux ancestraux. Des milliers de Giaks, les serviteurs malveillants et rusés des Seigneurs des Ténèbres, travaillent sans relâche sous les ordres des Drakkars pour dégager de cette énorme carrière des tonnes de pierres et de sable, portant péniblement leur lourd fardeau sur le dos jusqu'au sommet du cratère. Non loin du bord de la carrière, un campement de tentes noires entoure un grand dais voûté. A côté de cet édifice se trouve une énorme créature ailée : un Zlan impérial. Sa présence révèle clairement que le Seigneur des Ténèbres Haakon est déjà sur les lieux. A cette pensée, un frisson vous parcourt l'échiné, mais vous reprenez courage en observant les esclaves : le fait que ceux-ci continuent à travailler prouve que leur mission n'est pas encore accomplie. En d'autres termes, le Livre du Magnakaï n'a sûrement pas encore été découvert ! Il est cependant impossible d'approcher des fouilles sans être vu. Vous devrez attendre que la nuit soit tombée pour tenter de pénétrer dans le Tombeau. Pendant ces longues heures d'attente, il a été convenu que Banedon, de son côté, essaiera de trouver Tipasa. Il est fort probable, en effet, que ce dernier est retenu prisonnier à l'intérieur du campement, car les Seigneurs des Ténèbres ne le tueront certainement pas avant d'avoir découvert le trésor qu'ils cherchent avec tant d'acharnement. Au cours de cette journée, vous devrez obligatoirement prendre un Repas, sans quoi vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "N'oubliez pas de noter sur votre Feuille d'Aventure les modifications nécessaires et", vers: "286" }
  ]
  },
  {
  id: "321",
  texte: "Vous posez l'herbe d'Oede à l'entrée du pont de pierre et vous reculez. Tout d'abord, le lépreux reste méfiant et effrayé, car personne n'a osé entrer dans sa grotte depuis fort longtemps. Mais dès qu'il reconnaît les feuilles dorées de l'herbe d'Oede, il s'effondre en versant des larmes de joie. «Que le Majhan vous bénisse ! Puissiez-vous vivre en paix éternelle ! s'écrie-t-il, la voix brisée par l'émotion. Comment pourrai-je jamais vous remercier?»",
  choix: [
    { texte: "Si vous désirez interroger le lépreux au sujet de Tipasa le Vagabond", vers: "356" },
    { texte: "Si vous préférez quitter la grotte et vous remettre en route pour Ikaresh sans plus tarder", vers: "281" }
  ]
  },
  {
  id: "322",
  texte: "L'escalier est haut et abrupt. Vous êtes à bout de souffle mais vous continuez néanmoins à grimper sans faiblir, car les Drakkars ne sont qu'à une douzaine de marches derrière vous. En haut de la tour, un grand porche s'ouvre sur une plate-forme où se trouve un énorme tambour. Celui-ci sert au gardien de la tour pour envoyer des messages aux autres tours du Palais. Une peau tannée a été tendue sur la surface de l'instrument et un bâton en bois noir est accroché sur le côté.",
  choix: [
    { texte: "Si vous voulez faire basculer le tambour et le précipiter dans l'escalier", vers: "329" },
    { texte: "Si vous préférez ne pas vous soucier de l'instrument et vous enfuir par la plate-forme", vers: "387" }
  ]
  },
  {
  id: "323",
  texte: "L'explosion est suivie d'un énorme nuage de fumée qui envahit la cabine située à l'arrière du pont. Tandis que le bruit de la détonation retentit à travers la plaine de sel désolée, vous percevez le cri d'agonie d'un Kraan blessé qui tombe en tourbillonnant. L'une de ses ailes est percée d'un large trou. La fumée se disperse peu à peu et laisse apparaître le visage grimaçant d'un Nain au hublot de la cabine. Des traces de suie noircissent ses joues rubicondes et accentuent la blancheur de ses dents. Le Nain tient un tube de métal encore fumant, que vous prenez de prime abord pour un bâton magique. Puis vous remarquez que chaque membre de l'équipage est muni d'une arme identique. Les étranges tubes crachent feu et flammes en direction des Kraans et c'est alors que vous identifiez ces armes ainsi que leurs utilisateurs: ce sont les Nains du royaume montagneux de Bor. Ceux-ci sont célèbres à travers tout le Magnamund pour leurs ingénieuses inventions, et notamment pour ces redoutables armes, que vous voyez pour la première fois en action. Les Kraans sont affolés par le bruit et s'enfuient à tired'aile sans que les Drakkars puissent les retenir. L'ancêtre du fusil n'a fait qu'une seule victime, mais l'effet de dissuasion n'en est pas moins efficace ! La déroute des assaillants vient de sauver le vaisseau de l'espace de la catastrophe. Banedon reprend le gouvernail et redresse rapidement le vaisseau jusqu'à ce qu'il se trouve en face des cimes assombries des montagnes du sud et de la faille caractéristique marquant l'entrée du passage du Dahir. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-2": { vers: "250", texte: "Si le chiffre que vous avez tiré est compris entre 0 et 2," },
        "3-9": { vers: "312", texte: "Si ce chiffre est compris entre 3 et 9," }
      }
      }
  },
  {
  id: "324",
  texte: "Vous n'êtes plus qu'à quelques mètres de la sentinelle lorsque celle-ci sent soudain votre présence. Elle se retourne rapidement et vous fait face au moment où vous passez à l'attaque.",
  suite: "395",
  combat: { nom: "Sentinelle drakkar", habilete: 18, endurance: 25 }
  },
  {
  id: "325",
  texte: "Après avoir pris soin de recharger correctement la sarbacane, vous portez cette arme inhabituelle à votre bouche et vous visez : la sentinelle se tient debout, sans bouger, et constitue une cible idéale. Vous gonflez les joues et vous soufflez puissamment. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez la Discipline Kaï de la Maîtrise des Armes (quelle que soit l'arme), ajoutez 2 points au chiffre que vous avez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "384", texte: "Si le résultat obtenu est compris entre 0 et 3," },
        "4-4": { vers: "398", texte: "Si le résultat obtenu est supérieur ou égal à 4," }
      }
      }
  },
  {
  id: "326",
  texte: "« Remontez la rue jusqu'au marché aux Douggas, dit alors la vieille femme. Derrière les écuries, vous trouverez une ruelle : Tipasa y habite la maison à la porte bleue. »",
  choix: [
    { texte: "Tout en prenant garde à tenir les mains sur votre bourse de Pièces d'Or, vous vous frayez un chemin parmi les danseurs pour gagner la porte de la taverne, tandis que Banedon, confus et penaud, vous suit en maugréant dans sa barbe", vers: "202" }
  ]
  },
  {
  id: "327",
  texte: "Votre coup a transpercé le guerrier Drakkar ainsi que sa monture. Le Kraan tombe en tournoyant, larguant son cavalier dans sa chute. Alors que l'horrible cri de désespoir du Drakkar retentit à vos oreilles, vous obliquez vers le sud pour éviter d'être pris entre deux escadrons de Kraans qui convergent vers vous. Ce brusque changement de direction augmente la distance qui vous sépare de vos poursuivants, mais l'Itikar est grièvement blessé et vous n'avez plus tellement d'espoir de vous en sortir vivant. En effet, votre monture a perdu tellement de sang qu'elle peut défaillir à tout moment et vous précipiter dans le vide, vers le lac Inrahim.",
  choix: [
    { texte: "Soudain, vous apercevez quelque chose dans le lointain, et cette vision vous redonne envie de croire aux miracles !", vers: "221" }
  ]
  },
  {
  id: "328",
  texte: "Le visage du commerçant s'illumine de joie en empochant votre or (n'oubliez pas de déduire cette somme sur votre Feuille d'Aventure). « Prenez la première ruelle à gauche, après les écuries, dit-il, Tipasa habite la maison à la porte bleue. » Vous traversez rapidement la place du marché grouillante de monde, puis vous contournez les écuries et vous vous engagez dans la ruelle indiquée.",
  choix: [
    { texte: "Tout au bout de l'étroit passage sombre, vous apercevez la maison à la porte bleue", vers: "206" }
  ]
  },
  {
  id: "329",
  texte: "Le lourd tambour de cuivre bascule de son socle en bois et dévale l'escalier de la tour en roulant sur lui-même. Un grondement grandissant retentit dans les ténèbres au fur et à mesure qu'il poursuit sa course en direction de vos poursuivants. Au moment de la collision, les cris d'horreur qui s'élèvent ne sont que de courte durée, car les Drakkars sont littéralement écrasés au passage du gigantesque instrument. La rapidité de votre action vous a permis de vous débarrasser de vos ennemis, mais la victoire est amère : vous découvrez que vous êtes pris au piège, car il n'y a pas d'autre issue qui vous permette de vous évader de la plate-forme. Par ailleurs, vous ne bénéficiez que d'un court répit et vous devez à nouveau prendre une décision rapide.",
  choix: [
    { texte: "Si vous possédez une Corde, vous pouvez essayer de descendre le long de la tour, dans les jardins en contrebas", vers: "305" },
    { texte: "Si vous ne possédez pas de Corde", vers: "387" }
  ]
  },
  {
  id: "330",
  texte: "Vous réussissez à parer le coup et à repousser le guerrier Drakkar, mais ce dernier se reprend vite ; il vous fait face à nouveau et vous maudit en levant son épée : GUERRIER DRAKKAR HABILETE: 18 ENDURANCE: 23 Si vous gagnez le combat en 2 Assauts, ou moins, rendez-vous au 243. Si le combat dure plus de 2 Assauts, rendez-vous au 394.",
  choix: [
    { texte: "Vous réussissez à parer le coup et à repousser le guerrier Drakkar, mais ce dernier se reprend vite ; il vous fait face à nouveau et vous maudit en levant son épée : GUERRIER DRAKKAR HABILETE: 18 ENDURANCE: 23 Si vous gagnez le combat en 2 Assauts, ou moins", vers: "243" },
    { texte: "Si le combat dure plus de 2 Assauts", vers: "394" }
  ],
  combat: { nom: "Guerrier drakkar", habilete: 18, endurance: 23 }
  },
  {
  id: "331",
  texte: "Vous n'arrivez pas à trouver le sommeil tellement vous êtes préoccupé par l'issue prochaine de votre expédition et vous êtes hanté par la pensée que les Seigneurs des Ténèbres ont peut-être déjà trouvé le Livre du Magnakaï. Vous vous levez avant l'aube et vous prenez un petit déjeuner frugal, composé d'une galette de farine et de lait de brebis. Puis Banedon et vous vous remettez en route après avoir salué et remercié la femme de Tipasa. Le voyage de retour vers la Nef du ciel se passe sans incident et, à midi, vous atteignez la faille rocheuse où le vaisseau est ancré. Nolrim est le premier à vous accueillir, mais il ne peut cacher sa déception en constatant que vous revenez seuls. « Ne t'inquiète donc pas, la réponse se trouve là, dit Banedon en lui montrant le journal de Tipasa. Prépare-toi à hisser les voiles ! » Tandis que la Nef du ciel s'élève lentement dans le ciel azuré, Banedon passe la barre à Nolrim et vous demande de le suivre dans sa cabine, à la proue du vaisseau. Trois heures durant, il examine attentivement ses cartes, faisant de nombreux calculs et vérifiant les cotes données par ses instruments de mesure afin de trouver la situation exacte du Tombeau du Majhan. « Cela ne sert à rien, finit-il par dire, exténué et découragé. Je n'arrive pas à sonder le mystère de tous ces chiffres. » Alors que vous feuilletez à votre tour les pages du journal de Tipasa, vous comprenez subitement que celui-ci est rédigé en code. Ce que Banedon a supposé être la position des étoiles est en réalité un message codé à trois chiffres qui donne une localisation extrêmement précise du Tombeau. Consultez la carte qui figure au début du livre pour vous aider à découvrir le Tombeau du Majhan d'après les indications suivantes : le premier des trois chiffres est égal au nombre d'oasis qui se trouvent entre Ikaresh et Bir Adalou. Le deuxième de ces chiffres représente le nombre des cités de Vassagonie. Le troisième chiffre, quant à lui, est égal au nombre d'îles qui se trouvent au large des côtes de Cap Kabar. Lorsque vous aurez déchiffré le code, inscrivez les trois chiffres dans l'ordre donné. Vous obtiendrez alors le numéro du paragraphe où vous devez vous rendre à présent.",
  choix: [
    { texte: "Code 373 (3 oasis × 7 cités × 3 îles) — le Tombeau du Majhan", vers: "373" }
  ]
  },
  {
  id: "332",
  texte: "Quittant la tonnelle de verdure, vous vous précipitez vers le mur d'enceinte de l'Arboretum. Vous vous frayez difficilement un chemin à travers la végétation dense, mais vous finissez par découvrir une étroite porte voûtée donnant sur une pièce à ciel ouvert. De là, un escalier conduit à un chemin de ronde au bout duquel se trouve une porte en pierre. Vous avez gravi la moitié des marches lorsque, soudain, le bruit mat d'une arbalète que l'on arme vous glace le sang. Vous retourner maintenant serait un pur suicide ; aussi vous élancez-vous rapidement vers le haut de l'escalier en serrant les dents.",
  choix: [
    { texte: "A ce moment, une volée de flèches fend l'air dans votre direction", vers: "372" }
  ]
  },
  {
  id: "333",
  texte: "Vous apercevez Nolrim en train de se frayer un chemin parmi une foule de Drakkars tout habillés de rouge ; par trois fois il abat sa hache et fait mouche à chaque coup. Arrivé près de vous, il désigne de son arme sanguinolente une créature planant audessus de la Nef du ciel. Il s'agit d'un Zlan, un oiseau apparenté aux Kraans, mais de bien plus large envergure. Il sert de monture à un Vordak vêtu de rouge qui tient un long tube de fer noir dans sa main osseuse. Soudain, un éclair jaillit au bout de cette arme étrange, suivi d'une vive langue de feu bleuâtre.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "258" },
    { texte: "Si vous ne possédez pas cet Objet Spécial", vers: "348" }
  ]
  },
  {
  id: "334",
  texte: "Vous livrez bataille à deux guerriers au visage macabre. Ils bloquent l'escalier et vous devez les combattre comme s'ils ne faisaient qu'un.",
  choix: [
    { texte: "GARDES DE LA TOUR HABILETÉ : 17 ENDURANCE : 32 Si vous le désirez, vous pouvez abandonner le combat à tout instant en remontant en courant l'escalier en colimaçon", vers: "209" },
    { texte: "Si vous préférez continuer à vous battre, et si vous sortez vainqueur de l'affrontement", vers: "310" }
  ],
  combat: { nom: "Gardes de la tour", habilete: 17, endurance: 32 }
  },
  {
  id: "335",
  texte: "Au moment précis où vous assénez le coup fatal, le Dhorgaan disparaît sous vos yeux en un clin d'oeil. Le Seigneur des Ténèbres Haakon chancelle de stupeur en voyant s'anéantir sa créature. La pierre étincelante lui échappe des mains, roule à travers la pièce et s'arrête à mi-chemin entre vous deux.",
  choix: [
    { texte: "Si vous désirez tenter de vous emparer de la pierre", vers: "268" },
    { texte: "Si vous préférez ne pas vous soucier de cette pierre et attaquer Haakon sans perdre une seconde", vers: "390" },
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "204", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "336",
  texte: "Debout sur une plate-forme fortifiée située au centre de l'étrange vaisseau se tient un jeune homme blond aux yeux perçants. Vous le reconnaissez immédiatement : c'est Banedon, le jeune magicien Som-merlundois qui vous avait donné le Pendentif à l'Étoile de Cristal dans les ruines de Raumas, lorsque vous lui aviez vous-même sauvé la vie lors d'une embuscade dressée par des Giaks. Vous êtes tellement ébahi de le retrouver en cet endroit que vous ne remarquez pas qu'un filet de sang s'écoule du bec de votre Itikar. La créature est agonisante et pousse soudain un ultime et pitoyable gémissement. Ses ailes se raidissent et sa tête tombe mollement sur le côté après un dernier sursaut. Vous basculez dans le vide et votre estomac se tord tandis que vous tombez comme une pierre vers le lac Inrahim. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "374", texte: "Si le chiffre que vous avez tiré est compris entre 0 et 4," },
        "5-8": { vers: "254", texte: "Si ce chiffre est compris entre 5 et 8," },
        "9-9": { vers: "261", texte: "Enfin, si vous avez tiré un 9," }
      }
      }
  },
  {
  id: "337",
  texte: "Maintenant que la légère brise qui vous rafraîchissait à bord de la Nef du ciel ne souffle plus, la chaleur des montagnes s'avère presque insupportable. Vos pieds s'enfoncent profondément dans le sable rouge et vous avancez avec peine, vous protégeant le visage contre la poussière âcre que vous soulevez à chaque pas. La seule végétation qui parvient à pousser sur cette terre désolée est une herbe dure et tranchante comme l'acier, qui écorche le cuir de vos bottes et de vos jambières. Alors que vous atteignez les environs d'Ikaresh, vous passez à proximité d'une hutte ronde. Une chèvre est attachée à une mangeoire, près de la porte, et un homme surgit soudain dans l'encadrement. Il vous souhaite la bienvenue d'un geste amical puis vous invite à entrer dans son humble cabane.",
  choix: [
    { texte: "Si vous désirez accepter son invitation", vers: "225" },
    { texte: "Si vous préférez décliner poliment son offre et continuer votre route vers Ikaresh", vers: "272" },
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "365", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "338",
  texte: "Utilisant la technique de combat à mains nues que vous ont enseignée les Maîtres Kaï, vous saisissez le Garde à la gorge et vous le projetez violemment pardessus le muret de pierre qui borde le palier. L'homme tombe dans le vide en poussant un effroyable cri d'horreur avant de s'écraser sur les dalles de pierre en contrebas.",
  choix: [
    { texte: "Si vous voulez continuer à monter l'escalier jusqu'à la porte qui donne accès au chemin de ronde", vers: "372" },
    { texte: "Si vous préférez entrer par la porte d'où le Garde avait surgi", vers: "279" }
  ]
  },
  {
  id: "339",
  texte: "Deux Nains escaladent la plate-forme et se précipitent aux côtés de leur jeune capitaine. L'un d'eux ouvre une sacoche en velours accrochée en bandoulière autour de son torse musclé et en sort un flacon de verre ainsi qu'un bandage de tissu propre. Avec d'infinies précautions, les Nains soignent la blessure de Banedon. Celui-ci reprend peu à peu ses forces, puis il vous écoute attentivement raconter les circonstances terrifiantes qui ont abouti à vos retrouvailles. Alors que vous arrivez à la conclusion de cette triste histoire, Banedon prend soudain la parole avec une ferme détermination. « L'avenir du Sommerlund est entre nos mains, Loup Solitaire. Nous devons absolument empêcher le Seigneur des Ténèbres Haakon de détruire le Livre du Magnakaï ! Les nomades de la Mer de la Sécheresse m'ont parlé du Tombeau du Majhan. Ils disent que c'est un lieu terrifiant : un endroit où règne la mort et où nul ne saurait survivre. Le site se trouve au-delà du Dahir, à proximité de l'oasis de Bal-Loftan. C'est tout ce que je sais, car le Tombeau du Majhan fut construit dans le plus grand secret et les dernières traces qui en restaient ont été depuis longtemps recouvertes par les sables mouvants de la Mer de la Sécheresse. » A ces mots, vous ne pouvez cacher votre déception, mais Banedon ne semble pas y accorder d'attention et il reprend : « Cependant, tout espoir n'est pas perdu. Il existe un homme, un seul, qui peut nous conduire jusqu'au Tombeau du Majhan. Il s'appelle Tipasa Edarouk, c'està-dire Tipasa le Vagabond.",
  choix: [
    { texte: "C'est lui que nous devrons trouver, car c'est le seul homme ayant jamais pénétré dans le Tombeau du Majhan qui soit encore vivant pour en parler. »", vers: "302" }
  ]
  },
  {
  id: "340",
  texte: "Pendant une heure, vous courez à travers toute la ville d'Ikaresh avec les Adu-Kaws à vos trousses. Vous parvenez à leur faire perdre vos traces grâce à Banedon qui, par une formule magique, vous a transformés tous deux en Kalkoths. Heureusement, vos poursuivants n'ont pas cherché à comprendre pourquoi, brusquement, deux monstres des Grottes de Kalte parcouraient ainsi les rues de leur propre ville !",
  choix: [
    { texte: "Une fois remis de cette longue poursuite, vous quittez l'allée étroite où vous vous étiez cachés et vous vous remettez rapidement à la recherche de Tipasa le Vagabond", vers: "202" }
  ]
  },
  {
  id: "341",
  texte: "Tandis que vous enjambez les corps inanimés, vous remarquez qu'un des Gardes possède une Clé de Cuivre accrochée autour du cou par une chaîne. Vous prenez cette Clé, que vous glissez dans votre poche (n'oubliez pas d'inscrire cette nouvelle acquisition dans la case des Objets Spéciaux de votre Feuille d'Aventure). Vous dévalez ensuite l'escalier, mais une fois arrivé au pied de la tour, vous apercevez une armée de Drakkars et de Gardes du Palais en train de se précipiter sur le pont ; une mort certaine vous y attend si vous vous y engagez à votre tour. Vous décidez donc de continuer à descendre les marches vers le sous-sol. Là, une faible lueur éclaire une salle de Garde. Au dossier d'une chaise en fer forgé sont accrochées une épée et une gourde d'eau. Vous pouvez prendre un de ces objets, ou même les deux, si vous le désirez. Dans ce cas, notez-les sur votre Feuille d'Aventure dans la case Sac à Dos). Soudain, vous entendez vos adversaires se ruer dans l'escalier ; dans une minute, ils vous auront rejoint ! Toutefois, une lourde porte en bois encastrée dans le mur nord vous offre encore une chance de vous échapper.",
  choix: [
    { texte: "Si vous souhaitez fuir par cette porte", vers: "246" },
    { texte: "Si vous préférez vous préparer à combattre vos poursuivants", vers: "231" }
  ]
  },
  {
  id: "342",
  texte: "Une délicieuse odeur de vin de Jala fraîchement tiré parvient jusqu'à vous depuis une auberge située au milieu de l'avenue. Des bribes de conversations, mêlées à des tintements de verres qu'on entrechoque, ainsi que les cris d'un bébé affamé remplissent l'air.",
  choix: [
    { texte: "Si vous souhaitez entrer dans l'auberge", vers: "296" },
    { texte: "Si vous préférez continuer à marcher dans l'avenue", vers: "227" }
  ]
  },
  {
  id: "343",
  texte: "L'Itikar quitte son perchoir et vous êtes violemment rejeté en arrière de la selle. Le grand oiseau noir pousse des croassements aigus en battant des ailes dans un bruit de tonnerre. Au moment où il prend son envol depuis la tour, vous apercevez, tout en bas, quelques Drakkars éparpillés, pas plus grands que des poupées. Soudain, vous voyez en un éclair un guerrier Drakkar, dont le masque à tête de mort a été coupé en deux par les serres tranchantes de l'oiseau, tomber de la plateforme vers une mort certaine dans les jardins du Palais en contrebas. Les dômes dorés du Grand Palais deviennent de plus en plus petits au fur et à mesure que l'Itikar prend de l'altitude. Vous passez rapidement au-dessus des murailles de la ville et vous vous dirigez vers la grande plaine salée du lac Inrahim. A l'ouest, le soleil qui se couche derrière les montagnes du Dahir baigne le paysage d'une belle lumière orangée. Le cœur plein d'allégresse, vous rejetez la tête en arrière en poussant un cri de triomphe que le vent frais du soir emporte au loin. Mais comme en réponse à votre cri, un chœur de croassements stridents retentit dans le ciel. La peur s'empare de vous à nouveau lorsque vous apercevez une formation de Kraans, ces affreux oiseaux aux ailes dures comme du cuir, qui transportent chacun un guerrier Drakkar sur le dos. Ils sont à plus d'un kilomètre de vous pour l'instant, mais ils se rapprochent à vive allure. Dans une heure, la nuit sera tombée et si vous pouvez continuer à voler jusqu'à ce que l'obscurité soit totale, vous parviendrez à les semer. Vous êtes à présent juste audessus du centre du lac et vous devez choisir une direction. Avant de prendre une décision, consultez la carte qui figure au début de ce livre.",
  choix: [
    { texte: "Si vous désirez voler vers le sud, en empruntant le passage du Dahir", vers: "264" },
    { texte: "Si vous préférez aller vers l'est, vers la ville de Chula", vers: "244" }
  ]
  },
  {
  id: "344",
  texte: "Le visage du vieil homme n'est plus qu'un masque hideux couvert de pustules purulentes. Ses pupilles ont viré au jaune et ses lèvres grises pendent en lambeaux. Il est atteint de la lèpre, une maladie infectieuse qui pourrit la peau, attaque les nerfs et laisse le corps atrocement mutilé et déformé. L'homme a été rejeté de la communauté et exilé dans cette grotte où il finira ses jours dans la solitude et la misère.",
  choix: [
    { texte: "Si vous possédez un peu d'herbe d'Oede et si vous souhaitez en donner un peu au pauvre lépreux", vers: "321" },
    { texte: "Si vous n'en avez pas, ou si vous ne voulez pas en donner à ce malheureux malade, sortez de la grotte et", vers: "270" }
  ]
  },
  {
  id: "345",
  texte: "Dans le hall en dessous, vous entr'apercevez la silhouette du Seigneur des Ténèbres Haakon qui brandit son poing clouté dans votre direction. Un éclair bleu jaillit d'une pierre qu'il tient au creux de la main et se dirige sur vous dans un fracas assourdissant. Vous plongez à l'abri derrière le corps du guerrier Drakkar, mais celui-ci disparaît instantanément, ne laissant de lui qu'une odeur de chair brûlée et quelques cendres lorsque le rayon explose à son contact. Vous vous relevez rapidement et vous courez le long du passage. Un autre éclair jaillit et va heurter le plafond. Des éclats de marbre, tranchants comme des lames de rasoir, tombent en sifflant autour de vous et déchirent votre manteau et votre tunique. Vous descendez quelques marches sous un passage voûté puis vous longez un balcon qui surplombe la partie inférieure du Palais. C'est alors que vous entendez les cloches carillonner, puis le martèlement assourdissant de bottes ferrées : le Zakhan a sonné l'alarme et les Gardes se précipitent de tous côtés. Au bout du balcon, il y a une autre arche et un escalier ; tous deux semblent déserts.",
  choix: [
    { texte: "Si vous souhaitez vous échapper en passant sous l'arche", vers: "381" },
    { texte: "Si vous préférez grimper rapidement les marches", vers: "317" }
  ]
  },
  {
  id: "346",
  texte: "Sur le côté de la rue, un vieillard vend tout un assortiment de carpettes et de tapis, empilés à l'arrière d'une charrette. Banedon s'approche de lui et ils discutent tous deux pendant plusieurs minutes. Finalement, le jeune sorcier tend au vieil homme un anneau et le visage ridé du marchand s'illumine de joie tandis que Banedon revient vers vous, porteur de bonnes nouvelles. « Retournons vers la ruelle que nous avons croisée il y a quelque temps ; c'est là que demeure Tipasa, dans la maison à la porte bleue qui se trouve tout au bout. » Tandis que vous retournez sur vos pas et que vous pénétrez dans la ruelle sombre et malpropre, vous entendez le marchand pousser un cri de déception : l'anneau vient de se volatiliser à son doigt.",
  choix: [
    { texte: "Arrivés au bout de la ruelle, vous trouvez enfin la maison à la porte bleue", vers: "206" }
  ]
  },
  {
  id: "347",
  texte: "Tout en hurlant de douleur, vous tirez sur les rênes pour obliger l'Itikar à prendre de l'altitude. Le guerrier Drakkar se trouve à présent à plus de trente mètres au-dessus de vous, mais il est en train d'effectuer un demi-tour afin de passer de nouveau à l'attaque. Vous virez au sud pour éviter d'être pris entre deux formations de Kraans qui convergent vers vous. Votre brusque changement de direction augmente la distance qui vous sépare de vos poursuivants, mais votre monture emplumée est grièvement blessée et vous perdez pratiquement tout espoir de vous en sortir. L'Itikar perd en effet tellement de sang qu'il peut sombrer dans l'inconscience d'un moment à l'autre en vous laissant choir comme une pierre vers le lac Inrahim.",
  choix: [
    { texte: "Soudain, vous apercevez quelque chose dans le lointain; quelque chose qui vous fait croire à nouveau aux miracles", vers: "221" }
  ]
  },
  {
  id: "348",
  texte: "Tout à coup, vous apercevez Banedon, le bras levé au-dessus du parapet de la plate-forme blindée. Il tient à la main une mince baguette bleue d'où ruisselle un torrent d'eau qui forme dans le ciel un véritable rideau de pluie s'opposant au déluge de flammes. Lorsqu'ils entrent en contact, une formidable explosion se produit et un énorme tourbillon de flammes et d'eau mêlées se met à tourner et à onduler vers le Vordak. Celui-ci hurle de terreur, mais il est trop tard : son destin est scellé !",
  choix: [
    { texte: "Le tourbillon consume le Zlan et son cavalier dans un gigantesque brasier qui rougeoie comme le soleil", vers: "267" }
  ]
  },
  {
  id: "349",
  texte: "Un rayon d'énergie pure jaillit en sifflant le long de la lame effilée du glaive doré. Vous assénez un violent coup sur la tête du Vordak, lui fracturant le crâne jusqu'aux dents. Votre victime pousse un hurlement surnaturel de terreur, de douleur et d'agonie. Son squelette tombe et se transforme en un fluide vert et fumant qui désintègre aussitôt les plantes qui poussent aux alentours. Les Drakkars hésitent à la vue du Glaive de Sommer dont les rayons vifs se réfléchissent sur leurs masques à tête de mort. Vous en profitez pour passer à l'attaque, donnant des coups à droite et à gauche pour vous ouvrir le chemin. Un guerrier Drakkar lève alors son bouclier, mais votre lame transperce le bois recouvert d'acier et le blesse à l'épaule. L'instant suivant, vous faites volte-face et vous levez votre Glaive sur un autre Drakkar qui s'apprêtait à vous frapper. Vous déchirez son armure noire comme s'il s'agissait d'un morceau de parchemin.",
  choix: [
    { texte: "Le Drakkar pousse un cri d'agonie, mais vous disparaissez dans l'épais feuillage avant même que son corps inerte ne tombe à terre", vers: "228" }
  ]
  },
  {
  id: "350",
  texte: "Tandis que vous vous élancez à découvert, une autre décharge d'énergie jaillit du poing du Seigneur des Ténèbres. L'éclair explose à la base du pilier qui s'effondre, suivi bientôt par le plafond qui s'écroule dans un énorme grondement. L'onde de choc vous projette au sol, vous aplatissant violemment contre les dalles de marbre glacé. Vous perdez 3 points d'ENDURANCE. Vous percevez encore le rire de Haakon qui s'élève au-dessus du vacarme que font les blocs de pierre en tombant. Son rire se fait de plus en plus aigu et vous ressentez simultanément une horrible douleur à la tête.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kai du Bouclier Psychique", vers: "253", requis: {"discipline":"bouclier-psychique"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "369" }
  ]
  },
  {
  id: "351",
  texte: "Alors que vous vous approchez de la porte, Banedon vous donne un bon conseil : « Prends garde à ton or, Loup Solitaire ! Rien ne tente plus les Ikareshis qu'une bourse bien remplie. Tu peux avoir confiance en leur sens de l'honneur, mais si tu les crois honnêtes, ils te laisseront nu comme un ver ! » A l'intérieur de l'auberge règne une atmosphère de fête. Les tables ont été rapprochées pour former un grand demi-cercle devant lequel se trouve un homme large d'épaules, vêtu d'un somptueux costume brodé. Il porte au côté une épée incrustée d'or dans un fourreau de velours bleu vif, aussi éclatant que son pantalon de soie. L'homme enlace affectueusement ses compagnons, embrassant ses amis et les membres de sa famille qui ont parcouru de nombreux kilomètres pour assister à son mariage. Sa femme est assise à ses côtés, le visage dissimulé derrière un voile de perles étincelantes. Soudain, la musique emplit l'auberge et les invités se pressent au centre de la salle pour entamer la danse du mariage. A l'autre bout de la pièce, vous apercevez la propriétaire de l'auberge, une vieille femme corpulente habillée en noir. Les larmes aux yeux, elle regarde se dérouler les festivités.",
  choix: [
    { texte: "Si vous souhaitez l'approcher pour lui demander où se trouve Tipasa le Vagabond", vers: "276" },
    { texte: "Si vous préférez quitter la taverne et continuer votre chemin", vers: "202" }
  ]
  },
  {
  id: "352",
  texte: "Derrière le portail, un couloir voûté mène à un large escalier. Soudain, une douzaine de Drakkars se précipitent du palier du deuxième étage. Vif comme l'éclair, vous plongez derrière une statue du Zakhan Moudalla, mort récemment. Les soldats sont tellement pressés de mettre un terme à leur poursuite qu'ils ne découvrent même pas votre cachette et dégringolent les marches avec leurs lourdes armures en poussant des grognements rauques. Pendant ce temps, dissimulé dans l'ombre prodiguée par la statue, vous vous félicitez intérieurement de la grande taille du Zakhan Moudalla ! En haut des marches, vous apercevez une échelle donnant accès aux toits. Vous grimpez aux barreaux, puis vous suivez le chemin de tuiles blanchies par le soleil qui serpente entre les tourelles et les dômes avant d'arriver à un clocher. Vous êtes exténué et vous avez grand besoin de repos. Encore sous le choc de votre rencontre avec le Seigneur des Ténèbres Haakon, vous entendez résonner sans cesse à vos oreilles le son de sa terrible voix répétant : « Le Livre de Magnakaï ! »",
  choix: [
    { texte: "Découragé, vous regardez par une fenêtre grillagée du clocher et ce que vous voyez fait naître dans votre esprit un plan audacieux qui vous redonne confiance", vers: "313" }
  ]
  },
  {
  id: "353",
  texte: "Alors que vous tuez la dernière créature de la Crypte, Haakon recule en titubant, comme affaibli par la mort de ses monstres. Vous brandissez le Glaive de Sommer en espérant que jaillira de sa lame un éclair d'énergie brûlante qui consumera le malfaisant Seigneur des Ténèbres et le fera disparaître à tout jamais de la surface du Magnamund. La lame se met à briller d'une lumière de feu mais, cependant, aucun éclair ne jaillit de sa pointe ! Vous comprenez subitement ce qui se passe : vous êtes sous terre, et le Glaive ne peut donc pas capter l'énergie du soleil qui lui est indispensable. Haakon éclate alors d'un rire si puissant qu'il fait trembler le sol. Une flamme bleue surgit de la pierre qu'il tient au creux de la main, puis un éclair, vif et tranchant comme une lame effilée, jaillit en sifflant à travers la fumée et la poussière. Une odeur de décomposition et de mort parvient à vos narines au moment où le Seigneur des Ténèbres se prépare à attaquer. HAAKON HABILETÉ: 28 ENDURANCE: 45 A moins que vous ne maîtrisiez la Discipline Kaï du Bouclier Psychique, vous devrez déduire 2 points de votre total d'HABILETÉ pour toute la durée du combat.",
  suite: "400",
  combat: { nom: "Haakon", habilete: 28, endurance: 45 }
  },
  {
  id: "354",
  texte: "Vous vous élancez sur le pont, mais la hache vous entaille la cuisse, dessinant sur votre peau une longue estafilade violacée. Vous perdez 2 points d'ENDURANCE. Brusquement, une explosion assourdissante retentit et le guerrier Drakkar est projeté en arrière, la cuirasse déchirée par le tir d'un Nain. Puis il bascule dans les ténèbres environnantes en poussant un long cri d'agonie. Depuis Barrakeesh, un grondement de tonnerre roule, menaçant, à travers la plaine obscurcie. La ville elle-même semble maudire votre fuite ! Banedon surgit à vos côtés, très inquiet de votre sort. Il vous tend une main tremblante pour vous aider à vous mettre sur pieds et vous remarquez alors que le pansement de fortune qui entoure sa blessure est trempé de sang. Le jeune magicien est livide et semble au bord de l'évanouissement.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "377", requis: {"discipline":"guerison"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "339" }
  ]
  },
  {
  id: "355",
  texte: "Vous roulez sur le côté, une fraction de seconde avant que la masse ne s'écrase au sol, à l'endroit précis où se trouvait votre tête. A moins que vous ne maîtrisiez la Discipline Kaï du Bouclier Psychique, diminuez de 2 points votre total d'HABILETÉ pour toute la durée du combat, car le Vordak utilise sa force psychique contre vous. Lui, en revanche, est insensible à la puissance psychique.",
  choix: [
    { texte: "VORDAK HABILETÉ: 17 ENDURANCE: 26 Si vous remportez le combat en 4 Assauts, ou moins", vers: "249" },
    { texte: "Si le combat dure plus de 4 Assauts", vers: "304" }
  ],
  combat: { nom: "Vordak", habilete: 17, endurance: 26, immunisePsychique: true }
  },
  {
  id: "356",
  texte: "« J'ai bien connu Tipasa par le passé. A cette époque, j'étais encore jeune et vigoureux, comme vous... Nous avons combattu ensemble les pirates Lakuri à Samiz et navigué jusqu'à un lointain pays où la couche de neige et de glace est si épaisse que le soleil n'est jamais parvenu à la faire fondre ! Oui, j'ai connu Tipasa le Vagabond.... mais c'était il y a bien longtemps. Tout ce que je sais de lui maintenant, c'est qu'il habite à Ikaresh.",
  choix: [
    { texte: "Allez donc voir la veuve Soushilla : elle est au courant de tout ce qui se passe dans cette ville. »", vers: "281" }
  ]
  },
  {
  id: "357",
  texte: "La passerelle oscille dangereusement sous votre poids et vous devez ralentir, de peur de passer par-dessus la rambarde. Alertée par le bruit des planches qui craquent, la sentinelle fait volte-face et se précipite vers vous en brandissant un javelot pour contrer votre attaque. Vous ne pouvez pas éviter le combat et vous devrez vous battre jusqu'à ce que mort s'ensuive. Diminuez de 2 points votre total d'HABILETÉ pour toute la durée de ce combat, car il vous est difficile de garder l'équilibre sur ces planches instables.",
  choix: [
    { texte: "SENTINELLE DE LA PLATE-FORME HABILETÉ: 15 ENDURANCE: 23 Si, à un moment quelconque du combat, vous tirez un 1 dans la Table de Hasard, vous perdez l'équilibre et vous tombez", vers: "293" },
    { texte: "Si vous sortez vainqueur et que vous désiriez fouiller le corps de la sentinelle", vers: "207" },
    { texte: "Si vous êtes vainqueur, mais si vous préférez laisser le corps pour vous hâter vers l'enclos de l'Itikar", vers: "224" }
  ],
  combat: { nom: "Sentinelle de la plate-forme", habilete: 15, endurance: 23 }
  },
  {
  id: "358",
  texte: "Vous vous rendez compte que la vieille femme ment en prétendant être la veuve Soushilla. Elle vous a trompé dans l'intention de vous escroquer quelques Pièces d'Or. Alors que vous lui demandez des explications, elle tourne les talons et disparaît dans l'allée à la vitesse de l'éclair. « Laisse-la, dit Banedon, notre temps est bien plus précieux que l'or qu'elle nous a pris. »",
  choix: [
    { texte: "Si vous voulez continuer à remonter l'avenue des Aigles", vers: "388" },
    { texte: "Si vous préférez rebrousser chemin vers la place des Aigles, vous pouvez : soit aller vers le nord, en direction du marché aux Douggas (), soit aller vers l'ouest, en direction de la Grand-Place (rendez-vous alors au 216)", vers: "376" }
  ]
  },
  {
  id: "359",
  texte: "La fatigue finit par avoir raison de vous et vous ne parvenez même plus à garder les yeux ouverts. Nolrim vous indique une couchette dans la soute de la Nef du ciel. Reconnaissant, vous vous installez pour dormir, puis vous rabattez la couverture sur vos membres endoloris. Nolrim s'excuse de la petite taille de la couchette, mais vous ne l'entendez même pas, car vous êtes déjà plongé dans un profond sommeil.",
  choix: [
    { texte: "Ce repos bienfaisant vous fait gagner 2 points d'ENDURANCE", vers: "300" }
  ]
  },
  {
  id: "360",
  texte: "Deux Gardes en uniforme noir surgissent en bas des marches. Cette brusque rencontre les prend au dépourvu, mais vous-même êtes lent à réagir. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, ajoutez 1 point au chiffre obtenu. Maintenant, utilisez à nouveau la Table de Hasard pour obtenir un autre chiffre.",
  choix: [
    { texte: "Si ce second chiffre est inférieur au résultat que vous avez obtenu", vers: "226" },
    { texte: "S'il est supérieur à votre résultat", vers: "297" },
    { texte: "Si les chiffres sont égaux", vers: "334" }
  ]
  },
  {
  id: "361",
  texte: "Vous plongez sous la grand-voile puis vous grimpez sur la plateforme au moment où se déroule une lutte désespérée. Le magicien aux cheveux blonds est en effet cloué sur le pont par une lance qui lui a transpercé le bras gauche. De sa main droite armée d'un bâton, il tente de repousser son agresseur, mais celui-ci, un Drakkar, s'aperçoit de votre présence. Il se retourne brusquement et tire de son fourreau un cimeterre noir à lame recourbée.",
  choix: [
    { texte: "DRAKKAR HABILETÉ : 18 ENDURANCE : 25 Si vous remportez le combat en 3 Assauts, ou moins", vers: "288" },
    { texte: "Si la bataille se poursuit jusqu'à un 4e Assaut, cessez le combat et", vers: "382" }
  ],
  combat: { nom: "Drakkar", habilete: 18, endurance: 25 }
  },
  {
  id: "362",
  texte: "La fumée de la pipe est fraîche et parfumée. Malheureusement on ne peut pas en dire autant de vos hôtes ! Leurs longs manteaux en peau de Douggas dégagent une odeur musquée qui ne flatte guère les narines délicates d'un Sommerlundois. Une jeune fille apparaît en portant sur un plateau des tasses fumantes emplies de Jala. « Une Pièce d'Or la tasse », dit-elle en posant son plateau sur la table.",
  choix: [
    { texte: "Si vous souhaitez vous offrir une tasse de ce délicieux breuvage", vers: "237" },
    { texte: "Si vous n'en avez pas les moyens, ou si vous ne voulez pas acheter une tasse de Jala, prenez congé de vos hôtes et quittez l'auberge, puis", vers: "388" }
  ]
  },
  {
  id: "363",
  texte: "Vous plongez dans le jardin en contrebas; une fraction de seconde plus tard, vous étiez mort. Les flèches viennent ricocher sur les pointes empoisonnées qui surmontent la porte, puis rebondissent vers le ciel en sifflant. Le jardin clos est parfumé par les senteurs des plantes exotiques et des fleurs qui bordent un bassin sculpté rempli d'eau bleue. C'est un spectacle ravissant, mais vous n'avez pas le temps de vous y arrêter, car les Gardes du Palais sont à vos trousses et vous devez continuer à avancer. En face de vous, au-delà d'une colonnade bordée d'arbres, une volée de marches monte jusqu'à un petit portail encastré dans le mur du Palais supérieur. A votre droite, un sentier sinueux s'enfonce dans l'épais feuillage des arbustes et des arbres.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "220", requis: {"discipline":"orientation"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline, vous pouvez monter les marches vers le petit portail (), ou bien suivre le sentier sinueux (rendez-vous alors au 391)", vers: "352" }
  ]
  },
  {
  id: "364",
  texte: "La pièce commence à bouger, tout d'abord presque imperceptiblement, mais en l'espace de quelques secondes, les murs de la cabine et les Nains dansent sous vos yeux dans un brouillard de couleurs. Vous vous accrochez au rebord de la table pour essayer de surmonter cette atroce sensation de vertige et vous serrez la table jusqu'à ce que vos articulations deviennent complètement blanches. Tous les sons vous semblent lointains, comme s'ils vous parvenaient des profondeurs d'une cave.",
  choix: [
    { texte: "Soudain, la tête ne vous tourne plus, mais les ténèbres vous envahissent : vous venez de vous évanouir et vous gisez sur le sol, inconscient", vers: "380" }
  ]
  },
  {
  id: "365",
  texte: "Vous sentez que l'amitié que vous offre cet homme est sincère. Si vous acceptez son hospitalité, il pourra peut-être vous aider à trouver Tipasa le Vagabond.",
  choix: [
    { texte: "Si vous désirez entrer dans sa maison", vers: "225" },
    { texte: "Si vous préférez continuer votre chemin vers Ikaresh, sans vous arrêter", vers: "272" }
  ]
  },
  {
  id: "366",
  texte: "Vous attendez nerveusement que la chance vous sourie avant d'aller ouvrir la porte, mais malheureusement, la pluie de flèches qui rebondissent sur le mur et le parapet est de plus en plus dense. Tout à coup, des bruits de pas vous glacent le sang : les Drakkars sont en train de dévaler l'escalier. C'est maintenant ou jamais ! Vous vous relevez rapidement et vous courez vers la porte. Vous tirez le verrou avec des mains tremblantes mais, au moment où la porte va s'ouvrir, vous ressentez une douleur fulgurante dans le dos : vous êtes touché ! Une seconde flèche vient s'enfoncer profondément dans votre épaule et vous vous écrasez violemment contre la porte. Un voile noir tombe devant vos yeux, et vous ne voyez même pas les Drakkars qui se précipitent vers vous en brandissant leurs noires épées pour vous donner le coup de grâce. Les lames vous transpercent de part en part mais vous ne sentez rien. Vous êtes déjà mort. Votre vie ainsi que les espoirs du Sommerlund se terminent ici.",
  fin: "mort",
  nomFin: "Fin tragique — §366"
  },
  {
  id: "367",
  texte: "Vous suivez la rue silencieusement et vous commencez à désespérer. La ruelle est de plus en plus étroite et de plus en plus sale. Un chat malingre se met en travers de votre chemin, poursuivi par un gamin des rues aussi maigre que lui; le couteau qu'il tient à la main indique clairement qu'il est en train de courir après son dîner. Vous êtes sur le point d'abandonner et vous proposez à Banedon de revenir sur vos pas jusqu'au croisement, lorsque la rue fait un brusque coude sur la gauche. Une flèche dessinée sur le mur d'en face indique la direction du marché aux Douggas.",
  choix: [
    { texte: "Si vous souhaitez suivre la flèche", vers: "376" },
    { texte: "Si vous préférez retourner au croisement pour prendre l'autre rue", vers: "216" }
  ]
  },
  {
  id: "368",
  texte: "La hache vous entaille profondément le mollet, vous faisant hurler de douleur et de surprise. Vous perdez 3 points d'ENDURANCE. Malgré la douleur, vous attaquez le Garde avant qu'il ne passe de nouveau à l'attaque et vous réussissez à lui faire tomber la hache des mains. Le Garde hurle en portant ses doigts meurtris à la poitrine. Tout en serrant les dents, vous boitillez vers une porte ouverte. Le grand Palais est en alerte générale et les bruits de bottes des Gardes et des Drakkars résonnent de toutes parts. Derrière la porte, un pont enjambe un jardin clos et relie le Palais à une haute tour en marbre blanc. A l'entrée du pont, un escalier étroit descend jusqu'au jardin.",
  choix: [
    { texte: "Si vous souhaitez traverser le pont pour entrer dans la tour", vers: "396" },
    { texte: "Si vous préférez descendre les marches vers le jardin en contrebas", vers: "215" }
  ]
  },
  {
  id: "369",
  texte: "La terrible douleur contracte tous les muscles de votre corps qui est secoué par des spasmes incontrôlables. Vous priez pour que cesse cette agonie et vous perdez 6 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous êtes toujours vivant après cette épreuve psychique", vers: "253" }
  ]
  },
  {
  id: "370",
  texte: "Vous faites un saut de côté pour éviter les coups de bec mais l'oiseau vous griffe le dos avec ses puissantes serres et vous perdez 3 points d'ENDURANCE. Les Itikars sont des créatures sauvages et féroces de nature. Leur dressage peut prendre plusieurs années, mais cet effort est toujours largement récompensé car, une fois domptés, ils demeurent fidèles et dévoués à leurs maîtres à tout jamais. L'Itikar sent que vous êtes un étranger et il poursuit son attaque avec acharnement. ITIKAR HABILETÉ: 17 ENDURANCE: 30 Menez ce combat de la façon habituelle, mais multipliez par deux tous les points d'ENDURANCE perdus par l'oiseau. Lorsque son total d'ENDURANCE sera tombé à zéro, vous l'aurez suffisamment dompté pour pouvoir grimper sur la selle et le commander. Les blessures qui vous sont infligées vous coûtent le nombre habituel de points d'ENDURANCE.",
  suite: "217",
  combat: { nom: "Itikar", habilete: 17, endurance: 30 }
  },
  {
  id: "371",
  texte: "La hache siffle dans les ténèbres et vous faites un saut de côté, guidé uniquement par votre instinct car vous ne pouvez pas voir le projectile meurtrier qui se dirige vers vous. Le métal noir et tranchant s'enfonce dans votre flanc et une douleur fulgurante vous coupe le souffle. Vous portez la main à vos côtes et vous sentez un flot de sang chaud couler entre vos doigts. Vous perdez 4 points d'ENDURANCE. Soudain, un fracas assourdissant retentit et le Drakkar est projeté en arrière, la cuirasse déchirée par une balle tirée par l'un des Nains. Il bascule dans les ténèbres qui entourent la Nef du ciel en laissant échapper un dernier cri de douleur et d'effroi. Au loin, un roulement de tonnerre gronde depuis Barrakeesh et traverse la plaine obscurcie, plein de lourdes menaces, comme si la ville entière maudissait votre fuite. Banedon surgit à vos côtés, visiblement très inquiet. Tandis qu'il vous tend une main tremblante pour vous aider à vous relever, vous remarquez que le pansement de fortune qui recouvre sa blessure est plein de sang. Il est si pâle et semble tellement affaibli que vous avez l'impression qu'il va s'évanouir d'un moment à l'autre.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "377", requis: {"discipline":"guerison"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline", vers: "339" }
  ]
  },
  {
  id: "372",
  texte: "Une flèche vous atteint à l'épaule au moment où vous atteignez le chemin de ronde, ce qui vous oblige à plonger derrière le mur du parapet, pour vous mettre à l'abri. Vous perdez 1 point d'ENDURANCE. Deux autres flèches rebondissent sur le parapet, à quelques centimètres de votre tête. La porte en pierre est fermée par un verrou en fer, mais pour le faire glisser vous devrez vous exposer au tir des arbalètes car la serrure se trouve bien au-dessus du petit muret de protection. Si vous ne maîtrisez pas cette Discipline, utilisez la Table de Hasard pour obtenir un chiffre. Si vous avez le titre d'Aspirant Kaï ou un titre plus élevé, ajoutez 2 points au chiffre que vous avez tiré.",
  choix: [
    { texte: "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière", vers: "269", requis: {"discipline":"maitrise-matiere"} }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "366", texte: "Si le résultat obtenu est compris entre 0 et 3," },
        "4-4": { vers: "277", texte: "Si ce résultat est supérieur à 4," }
      }
      }
  },
  {
  id: "373",
  texte: "« J'ai trouvé ! s'écrie Banedon, en pointant l'index sur la carte de la Mer de la Sécheresse posée sur sa propre carte du ciel. Deux cents kilomètres à l'ouest de Bir Adalou et deux cents kilomètres au sud de l'oasis de Bal-Loftan. » Puis il prend une plume d'oie et inscrit : « Le Tombeau du Majhan ». Vous examinez la carte et vous essayez d'évaluer la distance qui vous sépare de votre but. Banedon remarque l'expression de doute qui se peint sur votre visage et tente de vous remonter le moral : « Ne t'en fais pas, Loup Solitaire, nous y serons avant l'aube. »",
  choix: [
    { texte: "Sa confiance vous fait sourire, mais c'est plus ce qui vous attend à l'arrivée au Tombeau que le voyage en lui-même qui vous inquiète", vers: "320" }
  ]
  },
  {
  id: "374",
  texte: "Tandis que vous tombez, les images de la Nef du ciel, des Kraans et de l'horizon défilent sous vos yeux en un mélange de formes et de couleurs, comme si vous regardiez à travers un kaléidoscope, et vous pensez que ces images sont les dernières qu'il vous sera permis de voir. Vous êtes désormais préparé à mourir et vous vous sentez calme et paisible. Mais, tout à coup, vous sentez que votre corps est retenu par des fibres invisibles et solides. Une terrible secousse vous coupe le souffle et vous laisse tout étourdi. Un miracle est en train de se produire : vous ne tombez plus, mais vous remontez ! Vous êtes pris dans une espèce de filet aux mailles serrées, comme une mouche dans une toile d'araignée. Vous êtes hissé vers la Nef du ciel aussi rapidement que vous tombiez et trois Nains barbus, vêtus de pourpoints de combat éclatants, vous aident à monter à bord. Cependant, vous n'avez même pas le temps de les remercier, car le petit vaisseau du ciel subit l'assaut redoublé des Kraans et de leurs cavaliers. Au bout du pont, un Nain est aux prises avec un Drakkar hargneux. Le petit homme semble en très mauvaise posture mais alors que vous vous précipitez pour lui venir en aide, un autre des cruels guerriers Drakkars vient atterrir au centre du vaisseau, sur la plateforme fortifiée.",
  choix: [
    { texte: "Si vous souhaitez aider le Nain", vers: "280" },
    { texte: "Si vous préférez enjamber le bastingage et vous élancer vers la plate-forme", vers: "361" }
  ]
  },
  {
  id: "375",
  texte: "Des gouttes de sueur perlent sur les visages des Gardes tandis qu'ils essaient de recharger fiévreusement leurs arbalètes. Votre attaque audacieuse les a quelque peu découragés et la peur les rend maladroits. Une fois en haut des marches, vous passez à l'attaque, tel un tigre se jetant sur sa proie. Votre premier coup fait tomber l'arbalète des mains tremblantes d'un des Gardes tandis que le second coup lui démet la mâchoire. L'homme tombe du pont en hurlant et va s'écraser dans les jardins en contrebas. Pendant ce temps, l'autre Garde a jeté son arbalète et a dégainé une lourde masse d'armes. Il se rue sur vous avec des éclairs de haine dans les yeux : le Garde que vous venez de tuer était son frère et il a soif de revanche ! La fureur qui l'anime le rend insensible à tout pouvoir psychique.",
  suite: "396",
  combat: { nom: "Garde de la tour", habilete: 17, endurance: 22 }
  },
  {
  id: "376",
  texte: "Vous suivez la rue pendant quelques mètres avant d'arriver devant une longue bâtisse aux murs blanchis à la chaux et percés de petites fenêtres étroites et sinistres. Un Garde, assis sur le trottoir, somnole au soleil couchant, sa lance entre les jambes. Quelques enfants lui lancent des fruits de larnumier pourris en visant l'extrémité de sa lance. En face du bâtiment, devant une taverne, sont alignés plusieurs Douggas sellés et attachés par leurs rênes à un poteau près de l'entrée. Les cris de ces chevaux du désert rivalisent avec les rumeurs joyeuses qui parviennent de l'intérieur de l'auberge.",
  choix: [
    { texte: "Si vous souhaitez entrer dans la taverne", vers: "351" },
    { texte: "Si vous préférez continuer vers le marché aux Douggas", vers: "202" }
  ]
  },
  {
  id: "377",
  texte: "Vous saisissez le bras blessé de Banedon et vous concentrez votre pouvoir de guérison sur l'os fracturé et les muscles déchirés. La chaleur bienfaisante que dégage votre influx atténue peu à peu sa douleur et vous réussissez à réduire la fracture avant de remplacer le vieux pansement ensanglanté. La blessure reste toujours ouverte, mais le bras de Banedon est sauvé. « Nous allons nous occuper de lui maintenant, Loup Solitaire », dit une voix étrange.",
  choix: [
    { texte: "Vous êtes surpris par cette intervention et vous vous retournez pour voir qui vient de faire cette déclaration", vers: "339" }
  ]
  },
  {
  id: "378",
  texte: "Vous vous aplatissez contre le sol humide en retenant votre respiration. Dissimulé ainsi, vous espérez que le Vordak passera sans vous voir mais celui-ci avance en écartant de ses bras osseux les broussailles qui bordent le sentier et vous sentez qu'il utilise sa force psychique pour vous repérer. Lorsqu'il arrive à votre hauteur, une onde de douleur vous parcourt le corps des pieds à la tête.",
  choix: [
    { texte: "Vous êtes sur le point de hurler, mais la douleur cesse brusquement tandis que le Vordak s'éloigne en poursuivant ses recherches le long du sentier", vers: "228" }
  ]
  },
  {
  id: "379",
  texte: "Une douleur atroce vous tenaille le corps et vous vous mettez à trembler de tous vos membres, secoué par de violents spasmes. Vous hurlez pour faire cesser cette douloureuse agonie. Vous perdez 6 points d'ENDU RANCE.",
  choix: [
    { texte: "Si vous êtes toujours vivant après cette terrible épreuve psychique", vers: "223" }
  ]
  },
  {
  id: "380",
  texte: "Vous vous réveillez le lendemain peu après l'aube avec un violent mal de tête. Parcourant la cabine des yeux, vous apercevez à travers un brouillard les Nains entassés sur leurs couchettes qui ronflent tranquillement. Le vrombissement grave et continu du vaisseau augmente encore un peu plus votre migraine qui, tel un démon, vous vrille les tempes. Vous devez serrer les dents pour ne pas hurler de douleur au moindre mouvement de vos membres raidis et endoloris. Cette atroce migraine vous fait perdre 2 points d'ENDURANCE. Vous rassemblez péniblement votre équipement et vous grimpez sur le pont. La Nef du ciel est plongée dans l'obscurité la plus totale car le vaisseau est en train de planer sous un gros rocher de grès qui jaillit en surplomb du flanc de la montagne. Banedon est toujours debout à la barre mais il n'est plus en transes. « Des Kraans ! » s'écrit-il, en pointant un doigt vers la vallée en contrebas, écrasée de soleil sous l'ombre immense prodiguée par le rocher. Vous regardez cette vallée hostile d'où s'élèvent d'innombrables piliers formés par l'amoncellement de blocs de pierre en équilibre précaire. Ces colonnes sont si hautes qu'une avalanche de pierres semble inévitable. Les Vassagoniens nomment cet endroit les Foos, c'està-dire les Aiguilles. Perchés sur deux de ces immenses colonnes de pierre, se trouvent des Kraans avec, à leurs côtés, des Drakkars qui scrutent la vallée à l'aide de longues-vues. Ils restent ainsi une heure, puis disparaissent dans les airs sur leurs montures. « Hisse la grand-voile, Nolrim ! ordonne Banedon, d'une voix à peine audible dans le vrombissement de la Nef du ciel. Nous avons une longue course à effectuer. »",
  choix: [
    { texte: "Si vous possédez un Cube de Cristal noir", vers: "229" },
    { texte: "Si vous ne possédez pas cet Objet Spécial", vers: "247" }
  ]
  },
  {
  id: "381",
  texte: "En courant sous l'arche, vous heurtez de plein fouet un Garde du Palais en habit noir. Vous avez les côtes enfoncées et la violence du choc vous fait perdre l'équilibre, mais vous parvenez à vous retenir au mur pour ne pas tomber. Le Garde, quant à lui, est étendu sur le sol de tout son long. Mais, à une vitesse incroyable, il sort une hache en acier brillant et vous attaque aux jambes. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, ajoutez 2 points au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "368", texte: "Si votre total est compris entre 0 et 4," },
        "5-11": { vers: "252", texte: "Si votre total est compris entre 5 et 11," }
      }
      }
  },
  {
  id: "382",
  texte: "Brusquement, le Drakkar se met à crier en agitant les bras, ses mains gantées s'ouvrant et se fermant convulsivement. Il est la proie de quelque pouvoir invisible qui est en train de le tuer au sein même de son armure. Vous reculez tandis que le bruit affreux des os qui se brisent s'élève au-dessus des cris stridents des Kraans qui fondent sur le vaisseau.",
  choix: [
    { texte: "Le Drakkar trébuche sur le pont puis bascule par-dessus le bord de la plate-forme", vers: "294" }
  ]
  },
  {
  id: "383",
  texte: "Vous avancez péniblement à travers les dunes de sable orange en vous couvrant le visage pour vous protéger de la poussière et de la chaleur brûlante. Le paysage est désolé et hostile; la seule chose qui semble pouvoir s'y acclimater est une herbe dure comme du chaume qui griffe vos bottes et vos jambières. Vous atteignez bientôt le lit d'une rivière asséchée qui mène à une grotte creusée dans le grès rouge de la colline. Une pancarte en bois est accrochée au-dessus de l'entrée de la caverne, mais vous êtes incapable de comprendre les mots étranges peints sur le bois durci par le soleil.",
  choix: [
    { texte: "Si vous souhaitez examiner la grotte", vers: "235" },
    { texte: "Si vous préférez continuer rapidement votre chemin vers Ikaresh", vers: "272" }
  ]
  },
  {
  id: "384",
  texte: "Malheureusement, vous avez mal apprécié la distance qui vous séparait de votre cible. Vous n'avez pas lancé la Flèche de Sommeil assez fort et celle-ci atteint une mouette qui s'était posée sur la plate-forme d'atterrissage. Le malheureux oiseau fait quelques pas en titubant puis tombe sur le dos, ses pattes raidies pointées vers le ciel. Le Garde s'avance vers l'oiseau puis, d'un coup de pied, l'envoie négligemment basculer par-dessus le rebord de la plate-forme.",
  choix: [
    { texte: "Il le regarde ensuite tournoyer vers les jardins en contrebas, sans se douter qu'il vient d'éviter lui-même une fin identique", vers: "282" }
  ]
  },
  {
  id: "385",
  texte: "La chaleur que dégage l'éclair de flamme bleue vous brûle aux bras et au visage. Vous êtes projeté à travers la plate-forme par l'explosion et votre corps est criblé d'éclats de cristal noir. Vous perdez 12 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous êtes toujours en vie", vers: "316" }
  ]
  },
  {
  id: "386",
  texte: "Quelques mètres au-delà de la place du marché, une ruelle étroite tourne sur la gauche. Tout au bout, vous apercevez une maison avec une porte bleu vif.",
  choix: [
    { texte: "Si vous souhaitez prendre cette ruelle et frapper à la porte bleue", vers: "206" },
    { texte: "Si vous désirez continuer le long de la rue où vous vous trouvez", vers: "346" },
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "292", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "387",
  texte: "Votre cœur défaille. 11 n'y a pas d'autres marches qui descendent de la plate-forme et vous voilà pris au piège ! Avant que vous ne pensiez à un moyen de vous en sortir, les Drakkars surgissent de l'arche et attaquent : DRAKKARS HABILETÉ: 17 ENDURANCE: 35 La seule façon d'échapper au combat est de vous laisser tomber de la tour vers les jardins, à quelque 30 mètres en contrebas.",
  choix: [
    { texte: "Si vous voulez sauter", vers: "205" },
    { texte: "Si vous gagnez le combat", vers: "341" }
  ],
  combat: { nom: "Drakkars", habilete: 17, endurance: 35 }
  },
  {
  id: "388",
  texte: "Vous suivez l'avenue qui s'enfonce en serpentant dans le quartier des armuriers d'ikaresh. Un camelot vend tout un assortiment d'épées et de poignards qui attirent votre attention : ils sont bien ouvragés, d'un équilibre parfait et très aiguisés. Une petite pancarte en bois annonce les prix : Épée: 5 Pièces d'Or Poignard : 5 Pièces d'Or Grande Épée : 9 Pièces d'Or Vous pouvez acheter les armes que vous voulez si vous en avez les moyens. Ensuite, vous continuez à remonter l'avenue et vous arrivez au marché des viandes. Des carcasses de bœufs sont pendues à des crochets, en plein air, et vous n'êtes pas surpris que les Ikareshis se promènent dans les rues avec des morceaux de coton dans les narines car l'odeur que dégage la viande est vraiment insupportable ! Finalement, vous arrivez à un croisement, mais il n'y a aucun panneau pour indiquer où mènent ces nouvelles rues.",
  choix: [
    { texte: "Si vous souhaitez prendre la rue de gauche", vers: "216" },
    { texte: "Si vous préférez prendre la rue de droite", vers: "367" }
  ]
  },
  {
  id: "389",
  texte: "Tandis que vous sautez de la passerelle sur la plateforme d'atterrissage, la sentinelle fait volte-face, et s'empare de sa lance. L'homme se tient maintenant entre vous et l'enclos de l'Itikar et le combat est inévitable.",
  choix: [
    { texte: "SENTINELLE DELA PLATE-FORME HABILETÉ: 15 ENDURANCE: 23 Si vous remportez le combat et si vous souhaitez fouiller le corps de la sentinelle", vers: "207" },
    { texte: "Si vous préférez laisser le cadavre et entrer rapidement dans l'enclos de l'Itikar", vers: "224" }
  ],
  combat: { nom: "Sentinelle dela plate-forme", habilete: 15, endurance: 23 }
  },
  {
  id: "390",
  texte: "Vous vous précipitez sur la silhouette chancelante du Seigneur des Ténèbres Haakon, prêt à lui donner le coup de grâce. Mais au moment où vous abaissez votre arme, son poing clouté vous frappe au bras. Du sang jaillit de votre poignet, vos doigts deviennent tout engourdis et vous lâchez votre arme. Haakon attaque à nouveau, vous portant à la poitrine un violent coup qui vous envoie valser en arrière à travers la pièce. Vous essayez de vous redresser, mais en vain, car la bataille est terminée. Haakon a retrouvé sa pierre étincelante ! La dernière chose que vous voyez avant d'être consumé par la brûlante flamme bleue est le rictus triomphant du Seigneur des Ténèbres. Votre vie et tous les espoirs du Sommerlund prennent fin ici.",
  fin: "mort",
  nomFin: "Fin tragique — §390"
  },
  {
  id: "391",
  texte: "Tandis que vous vous enfoncez dans l'Arboretum, des croassements aigus retentissent au-dessus du plafond de verdure que forment les plantes grimpantes et les branches basses des arbres. L'air est humide comme en pleine jungle. Vous essayez d'avancer le plus vite possible, mais votre progression est difficile car la couche d'humus qui recouvre le sol est molle et collante comme de la vase. Soudain, un léger bruit, à quelques mètres de vous, vous met en alerte. D'un bond, vous plongez dans les broussailles pour vous dissimuler au moment même où une poignée de Drakkars, menés par un personnage vêtu de rouge, arrivent dans votre direction.",
  choix: [
    { texte: "Si vous possédez le titre de Guerrier Kaï, ou un titre supérieur", vers: "242" },
    { texte: "Si vous ne possédez pas cette distinction Kaï", vers: "222" }
  ]
  },
  {
  id: "392",
  texte: "La bière épaisse et crémeuse a un goût de pomme verte. Vous videz la moitié de la chope et vous essuyez la mousse restée sur vos lèvres du revers de votre manche. Utilisez la Table de Hasard pour obtenir un chiffre. Si votre total d'ENDURANCE est inférieur à 15, ôtez 2 points au chiffre que vous avez tiré. Si votre total d'ENDURANCE est supérieur à 25, ajoutez 2 points au chiffre que vous avez tiré. Si vous possédez le titre de Savant Kaï, ajoutez 3 à ce chiffre.",
  choix: [
    { texte: "Si le résultat obtenu est inférieur à 7", vers: "364" },
    { texte: "Si ce résultat est supérieur à 7", vers: "218" }
  ]
  },
  {
  id: "393",
  texte: "Vous courez tête baissée à travers le feuillage, le cri perçant du Vordak résonnant à vos oreilles. A moins que vous ne maîtrisez la Discipline Kaï du Bouclier Psychique, vous perdez 2 points d'ENDURANCE. Brusquement, un Drakkar surgit des arbres devant vous, son épée noire levée haut au-dessus de sa tête et prêt à vous asséner un coup mortel. DRAKKAR HABILETÉ: 16 ENDURANCE: 25 Pour le premier Assaut, diminuez votre total d'HABILETÉ de 2 points en raison de l'effet de surprise provoqué par l'attaque du Drakkar. Vous pourrez fuir le combat après 3 Assauts.",
  choix: [
    { texte: "Si vous souhaitez fuir le combat", vers: "228" },
    { texte: "Si vous sortez vainqueur", vers: "255" }
  ],
  combat: { nom: "Drakkar", habilete: 16, endurance: 25 }
  },
  {
  id: "394",
  texte: "Le Drakkar pousse un cri d'horreur et laisse tomber son épée. Des milliers d'insectes grouillent sur sa peau qu'ils piquent et mordent férocement. Le guerrier porte la main à son masque à tête de mort et essaie fébrilement de relever la visière de son heaume en métal noir. Dès qu'il y parvient, une nuée bourdonnante d'insectes s'en échappe.",
  choix: [
    { texte: "Le Drakkar crie comme un forcené et, dans un mouvement de panique, bascule pardessus le parapet et va s'écraser au sol après une chute de plusieurs centaines de mètres", vers: "306" }
  ]
  },
  {
  id: "395",
  texte: "Vous apercevez, aussi loin que porte le regard, une longue galerie creusée dans le grès qui descend droit devant vous. Des torches fixées au mur éclairent en crépitant des pictogrammes gravés dans la pierre jaune. A intervalles réguliers, vous remarquez des dalles aux rebords rugueux scellées dans le sol. En vous baissant pour examiner l'une de ces dalles de plus près, vous comprenez avec effroi ce qui a dû se passer : lors de la construction du Tombeau, de nombreux pièges mortels avaient été creusés pour empêcher que les lieux ne soient profanés. Les Seigneurs des Ténèbres connaissaient leur existence et lorsqu'ils firent désensabler la galerie, au lieu d'avertir les Giaks de la présence de ces chausses-trappes, ils se servirent d'eux afin qu'ils les repèrent au prix de leur vie. Une fois le piège découvert, on recouvrait les corps des malheureux esclaves avec du sable puis, le trou ainsi comblé, on posait une dalle. Vous êtes rempli d'indignation en pensant à la barbarie de ces opérations. Vous suivez la galerie pendant un bon kilomètre avant d'arriver à une grande porte en pierre. Les montants de la porte sont finement ouvragés, mais la porte elle-même est faite d'un seul bloc. Par un trou creusé dans le plafond passe un faible rayon de lumière qui forme au sol une petite flaque claire. Juste à côté, vous remarquez un trou, identique à celui du plafond. Par ailleurs, dans le mur près de la porte, vous apercevez une empreinte creuse triangulaire, pas plus grande qu'une Pièce d'Or.",
  choix: [
    { texte: "Si vous possédez un Prisme", vers: "233" },
    { texte: "Si vous possédez un Triangle de Pierre Bleue", vers: "245" },
    { texte: "Si vous ne possédez aucun de ces objets", vers: "298" }
  ]
  },
  {
  id: "396",
  texte: "A l'intérieur de la tour de marbre, deux volées de marches se rejoignent à un palier. Vous entendez des bruits de pas qui courent au loin. Les bruits se rapprochent. Ils proviennent d'un des escaliers en colimaçon, mais duquel ? Brusquement, un groupe de guerriers Drakkars apparaît sur le pont qui mène à la tour. Vous devez vous échapper sans tarder.",
  choix: [
    { texte: "Si vous désirez monter les marches", vers: "322" },
    { texte: "Si vous préférez descendre", vers: "360" },
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "266", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "397",
  texte: "Avidement, elle saisit la pièce de sa sébile, puis mord dedans avec ses dents noircies. Rassurée sur l'authenticité de la pièce, elle opine du chef et attend vos questions.",
  choix: [
    { texte: "Si vous voulez lui demander si elle est bien Soushilla", vers: "307" },
    { texte: "Si vous préférez lui demander si elle sait où l'on peut trouver Tipasa le Vagabond", vers: "314" }
  ]
  },
  {
  id: "398",
  texte: "Le Garde lève le bras puis ôte la fléchette de sa nuque Mais avant qu'il n'ait le temps de comprendre ce qui lui arrive, il s'effondre au sol, inconscient, étalé de tout son long sur la plate-forme d'atterrissage. Vous entendez des bruits de pas qui retentissent par-delà les toits du Palais : les Drakkars sont à vos trousses. Vous devez agir rapidement si vous voulez leur échapper.",
  choix: [
    { texte: "Si vous souhaitez fouiller le corps du Garde endormi", vers: "207" },
    { texte: "Si vous préférez ne pas vous occuper du Garde et vous précipiter directement vers l'enclos de l'Itikar", vers: "224" }
  ]
  },
  {
  id: "399",
  texte: "Banedon baisse son bâton, un pâle sourire désabusé se dessinant sur son visage ravagé par la douleur. « Hélas, je n'ai pas été assez vif pour me protéger, Loup Solitaire », dit-il en regardant son bras. Vous posez un genou à terre et vous retirez la lance qui le cloue au plancher. La blessure est sérieuse et vous vous hâtez de déchirer son habit bleu sombre afin de confectionner un pansement de fortune. Vous reconnaissez cet habit, car il s'agit de celui des Maîtres de Voyage. Il semble que le jeune Banedon soit monté en grade dans l'ordre des Magiciens depuis la dernière fois où vous vous êtes rencontrés. « Décidément, nous sommes condamnés à nous rencontrer en leur compagnie, dit-il nerveusement tout en observant les Kraans et les Drakkars qui les montent. Aide-moi à me relever, nous devons fuir avant qu'ils ne nous obligent à gagner le sol. » Vous soutenez le magicien, tandis qu'il saisit la barre du vaisseau: une sphère de cristal aux mille facettes étincelantes, située à l'extrémité d'une mince tige en argent.",
  choix: [
    { texte: "A peine a-t-il effleuré le cristal qu'une énorme explosion retentit", vers: "323" }
  ]
  },
  {
  id: "400",
  titre: "Victoire — Le Livre du Magnakaï",
  texte: "Vous regardez le sol à l'endroit où Haakon est tombé, mais il n'y a plus aucune trace de son corps : il s'est littéralement volatilisé. L'atmosphère est devenue étrangement calme et paisible, comme si une ombre immense et malfaisante s'était dissipée. Vous retournez vers le trône où Haakon vous attendait. Devant ce trône se trouve un portail de pierre rouge sang où sont gravées d'anciennes inscriptions. A travers les signes, vous distinguez l'empreinte d'une main humaine sculptée dans la pierre. Instinctivement, vous posez la main sur l'empreinte ; les deux formes s'épousent parfaitement. Soudain, le portail coulisse silencieusement, vous mettant en présence de l'objet qui va changer votre destinée : le Livre du Magnakaï ! Le Livre, grand ouvert, est posé sur un piédestal et offre ses secrets à vos yeux émerveillés. Vous prenez le Livre dans vos mains et, soudain, toute l'énergie retenue au sein des pages dorées se libère en un flux de vibrations puissantes qui fait trembler les murs de la pièce. Le cœur battant à tout rompre, vous refermez le Livre et vous sortez du Tombeau en courant à perdre haleine. Une fois dehors, vous partez en direction des contreforts de Koneshi. Pendant ce temps, Banedon a, lui aussi, rempli sa mission avec succès et il vous attend avec Tipasa. Lorsqu'ils vous voient tous deux arriver avec le Livre du Magnakaï, ils ne peuvent retenir leur joie : « Cette nuit triomphale fera naître une aube pleine d'espoir pour le Sommerlund, dit Banedon avec jubilation. Le Kaï est ressuscité ! » Votre quête est maintenant achevée. Vous avez trouvé le Livre du Magnakaï et libéré le Magnamund de l'ombre menaçante du Seigneur des Ténèbres Haakon. Mais, pour vous, Loup Solitaire, l'aventure ne fait que commencer. Votre destinée, à présent, est de suivre la voie glorieuse tracée par les grands Maîtres Kaï. Pour apprendre leurs secrets et tenter la première quête passionnante du Magnakaï, partez pour de nouvelles aventures avec le sixième volume de la série Loup Solitaire.",
  fin: "victoire",
  nomFin: "Le Livre du Magnakaï — Loup Solitaire devient Grand Maître Kaï"
  }
];
