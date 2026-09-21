import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 03 — Les Grottes de Kalte
 * Paragraphes 090 à 179. Généré par ls03-importer.cjs
 */
export const SECTIONS_090_179: StorySection[] = [
  {
  id: "90",
  texte: "Après avoir essuyé le bouchon de la fiole, vous le dévissez et vous reniflez avec prudence le liquide rouge. Dans le cas contraire, vous vous méfiez des effets peut-être nocifs de ce liquide et vous vous en débarrassez.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "233", requis: {"discipline":"guerison"} },
    { texte: "Pour faire un nouveau choix", vers: "10" }
  ]
  },
  {
  id: "91",
  texte: "Vous retenez votre respiration tandis que vous vous enduisez le torse de cette graisse gluante. A mesure que l'huile imprègne votre peau, cependant, vous sentez une bienfaisante chaleur rayonner dans tout votre corps, comme si vous vous trouviez près d'un feu. Et plus vous appliquez de graisse, plus vous avez chaud. Vous remarquez également que l'épouvantable odeur s'est dissipée. « Lorsque l'huile pénètre dans la peau, on perd l'odorat», dit Irian. Il recommande aux autres de se frictionner à leur tour avec l'huile de Bakanal ; cette substance apporte une protection particulièrement efficace contre les températures glaciales de Kalte, et elle pourrait bien se révéler particulièrement utile dans un proche avenir.",
  choix: [
    { texte: "Lorsque vous revenez sous votre tente, les chiens Kanu ne semblent pas apprécier l'odeur que vous dégagez: quand vous passez près d'eux, ils se mettent à gémir et enfouissent leur museau dans la neige", vers: "134" }
  ]
  },
  {
  id: "92",
  texte: "Vous suivez le passage pendant quelques minutes jusqu'à ce qu'il tourne vers la gauche ; à votre grande consternation, vous constatez alors qu'au-delà de cette courbe une fissure s'est ouverte, provoquant l'écroulement du sol et des murs. Un large trou noir béant s'ouvre devant vous.",
  choix: [
    { texte: "Si vous avez une Corde", vers: "133" },
    { texte: "Dans le cas contraire, vous n'aurez plus qu'à rebrousser chemin pour aller explorer l'autre tunnel", vers: "297" }
  ]
  },
  {
  id: "93",
  texte: "Vous luttez pendant presque cinq minutes qui vous semblent interminables tant la douleur que vous éprouvez est intense. Peu à peu, toute volonté vous quitte, vous ne pouvez plus résister à la domination psychique de Vonotar et vous vous jetez sur la lame du Glaive de Sommer, ainsi qu'il vous l'ordonne. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Glacé — §93"
  },
  {
  id: "94",
  texte: "Vous avez glissé et vous êtes tombé dans l'eau glacée, vous hurlez de douleur tandis que le froid vous saisit jusqu'à la moelle des os. Vous luttez de toutes vos forces pour essayer de regagner la rive, mais c'est une entreprise désespérée. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 6, vous avez de la chance : vous parvenez en effet à vous hisser hors de l'eau glacée et vous vous écroulez épuisé sur la rive. Si vous tirez un chiffre entre 7 et 9, l'eau glacée a tôt fait de vous paralyser les bras et quelques minutes plus tard vous vous êtes noyé. Votre mission s'achève donc ici.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Eau glacée",
        texte: "Vous luttez pour regagner la rive.",
        branches: {
        "0-6": { vers: "176", texte: "Vous vous hissez hors de l'eau, épuisé", endurance: -3 },
        "7-9": { texte: "Noyade dans l'eau glacée", mort: true }
      }
      }
  },
  {
  id: "95",
  texte: "11' froid intense et les assauts incessants du cyclone épuisent très vite vos réserves d'énergie. Un engourdissement inexorable vous envahit tandis que le Démon de Glace prend possession de votre corps, impatient de commencer une nouvelle existence au cours de laquelle il exercera ses redoutables pouvoirs. Pour les créatures d'Ikaya et bientôt du pays de Kalte tout entier, l'aube vient de se lever sur un âge de tyrannie, une tyrannie terrifiante et implacable dont vous ne verrez cependant jamais les effets, car votre vie s'achève ici, en même temps, bien entendu, que votre mission.",
  fin: "mort",
  nomFin: "Démon de Glace — §95"
  },
  {
  id: "96",
  texte: "Vous vous enveloppez dans votre cape blanche et vous vous cachez derrière une stalagmite, à quelques mètres de la rive du lac. Retenant votre souffle, le corps parfaitement immobile, vous entendez les pas et les grognements du Languabarb s'approcher de plus en plus près. Pour savoir si la mise en pratique de votre Discipline Kaï vous a permis de passer inaperçu, utilisez la Table de Hasard. Si vous vous êtes enduit le torse d'huile de Bakanal, vous ajouterez 2 au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-8": { vers: "59", texte: "Si le total se situe entre 0 et 8," },
        "9-11": { vers: "214", texte: "Si ce total se situe entre 9 et 11," }
      }
      }
  },
  {
  id: "97",
  texte: "Tout au long de ce couloir se dressent des pilastres de pierre disposés à intervalles réguliers. Ils ont plusieurs dizaines de centimètres d'épaisseur et vous permettent donc de vous cacher en cas de besoin. A une vingtaine de mètres devant vous, vous apercevez un Barbare des Glaces qui monte la garde au pied d'un large escalier de pierre. Vous vous dissimulez aussitôt derrière un des piliers, réfléchissant à un moyen de vous débarrasser de ce gêneur. Il n'en existe que deux : distraire son attention, ou le faire taire à tout jamais.",
  choix: [
    { texte: "Si vous possédez un Diamant", vers: "24" },
    { texte: "Si vous souhaitez distraire l'attention du garde à l'aide de quelques Pièces d'Or", vers: "152" },
    { texte: "Enfin, si vous jugez préférable de l'attaquer", vers: "208" }
  ]
  },
  {
  id: "98",
  texte: "Vous sentez que quelqu'un, homme ou animal, se cache derrière cette fissure, sans pouvoir deviner si l'être en question est animé d'intentions bienveillantes ou au contraire agressives.",
  choix: [
    { texte: "Si vous souhaitez examiner la fissure de plus près", vers: "49" },
    { texte: "Si vous préférez retourner sous votre tente", vers: "212" }
  ]
  },
  {
  id: "99",
  texte: "Lorsque vous tirez de son fourreau le puissant Glaive de Sommer, un flamboiement doré illumine l'obscurité du passage. Le Monstre d'Enfer recule d'un pas en poussant un hurlement, ses yeux rouges brillant de haine et de terreur. Il a reconnu en effet l'arme que vous brandissez et il sait que son pouvoir peut le détruire à jamais. Dans une tentative désespérée, le Monstre d'Enfer vous attaque en faisant usage de sa terrible Puissance Psychique. A moins que vous ne maîtrisiez la Discipline Kaï du Bouclier Psychique, vous perdrez 2 points d'ENDURANCE supplémentaires à chaque Assaut (si, lors d'un Assaut, la Table des Coups Portés vous indique que vous ne subissez pas de perte d'ENDURANCE, il vous faudra malgré tout retrancher ces 2 points). Votre adversaire, lui, est insensible à la Puissance Psychique d'autrui mais en revanche, en tant que mort vivant, il est particulièrement vulnérable aux coups du Glaive de Sommer. Aussi aurez-vous le droit de doubler tous les points d'ENDURANCE perdus par la créature au cours de ce combat.",
  suite: "230",
  combat: { nom: "Monstre d'Enfer", habilete: 22, endurance: 30, immunisePsychique: true }
  },
  {
  id: "100",
  texte: "Le traître bossu laisse échapper un cri de surprise en vous voyant soudain apparaître devant lui, mais il se reprend bientôt et se précipite vers une porte aménagée dans le mur du fond. Les Barbares des Glaces tirent leur épée ; leurs mouvements, cependant, sont lents et incertains. Vous parvenez à les repousser avant qu'ils n'aient pu vous porter le moindre coup, et vous vous lancez à la poursuite du mage qui s'enfuit. La porte par laquelle il s'est éclipsé ouvre sur un palier d'où partent deux escaliers. A votre droite, un escalier en colimaçon descend vers des étages inférieurs à votre gauche, une volée de marches monte vers une arcade. Il n'y a aucune trace de Vonotar alentour.",
  choix: [
    { texte: "Si vous souhaitez descendre l'escalier en colimaçon", vers: "148" },
    { texte: "Si vous préférez monter les marches qui mènent à l'arcade", vers: "61" }
  ]
  },
  {
  id: "101",
  texte: "Vous avez de la chance, car les Bakanals ont pour particularité de dormir profondément et longtemps, parfois trois jours de suite lorsqu'ils ont fait un bon repas. Aussi n'avez-vous eu aucune difficulté à plonger la créature dans un sommeil éternel : le coup que vous lui avez porté l'a tuée sans qu'elle se rende compte de rien.",
  choix: [
    { texte: "Vous pouvez à présent quitter les lieux", vers: "235" }
  ]
  },
  {
  id: "102",
  texte: "Un petit panneau à la base du pilier de gauche vient de coulisser, révélant un compartiment secret. A l'intérieur, vous découvrez une petite statuette : il s'agit d'une Effigie de pierre qui représente une étrange créature dotée de tentacules. Si vous souhaitez conserver cette Effigie, glissez-la dans votre poche et inscrivez-la sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Si vous souhaitez essayer à nouveau d'appuyer sur les boutons", vers: "65" },
    { texte: "Si vous préférez quitter le temple", vers: "306" }
  ]
  },
  {
  id: "103",
  texte: "Le lendemain, un fort vent se lève en provenance du nord. Des heures durant, il vous souffle au visage sans un instant de répit. La banquise de Liouk se transforme peu à peu, au fur et à mesure de votre avance, en une masse de blocs de glace déchiquetés qui pointent leurs arêtes vers le ciel. Vous ne parvenez à progresser que lentement et avec difficulté. Vers midi, vous tremblez de froid, vos lèvres gercées saignent et les rafales de vent glacé vous ont recouvert des pieds à la tête d'une fine pellicule de neige. Vous dirigez votre traîneau vers un étroit passage qui marque la jonction entre la banquise et la plaine de Hrod. Ce défilé vous protège du vent et, pour la première fois de la journée, vous bénéficiez d'une bonne visibilité. Soudain, des cris au-dessus de votre tête vous indiquent que vous n'êtes pas, vos guides et vousmême, les seules créatures à avoir choisi cet endroit pour vous abriter. Quelques secondes plus tard, en effet, trois gros Bakanals sautant du mur de glace se jettent sur vos traîneaux et y atterrissent dans un grand fracas. Votre compagnon de traîneau, Irian, est projeté sur la glace et tombe assommé. Un Bakanal affamé vous empêche de lui porter secours et il est inutile de tenter d'échapper à la créature Carnivore : il vous faut la combattre jusqu'à la mort de l'un de vous deux.",
  suite: "305",
  combat: { nom: "Bakanal", habilete: 19, endurance: 30 }
  },
  {
  id: "104",
  texte: "Vous arrivez enfin devant une grande porte de pierre. A la différence des autres, celle-ci n'est pas actionnée par un levier mais vous remarquez en revanche une petite fente creusée dans le mur, juste à côté de la porte.",
  choix: [
    { texte: "Si vous possédez un Disque de Pierre Bleue", vers: "135" },
    { texte: "Dans le cas contraire, il vous faudra rebrousser chemin le long du couloir et p", vers: "330" }
  ]
  },
  {
  id: "105",
  texte: "Vous faites une chute d'une cinquantaine de mètres et vous tombez sur un énorme tas de neige poudreuse. Vous êtes secoué et vous avez le souffle coupé, mais vous n'êtes pas blessé. Il vous faut presque une demi-heure pour vous dégager de cette masse de neige et quand enfin vous en émergez, le spectacle qui s'offre à vos yeux vous laisse bouche bée. Une immense caverne s'étend devant vous ; de gigantesques stalactites de cristal pendent d'une voûte de glace et la neige fondante qui s'en égoutte peu à peu emplit l'espace d'une étrange musique. Vous êtes en train de contempler un monde inconnu que peu de Sommerlundois ont eu l'occasion de voir : vous venez en effet de tomber dans les Grottes de Kalte. Cette caverne est une toute petite partie d'un immense labyrinthe souterrain bâti par les Anciens des siècles plus tôt, à une époque où les Sommerlundois, pas plus que les Maîtres des Ténèbres, n'avaient encore mis le pied sur les terres de Magnamund. Ses vastes tunnels, ses temples et ses salles ont abrité jadis une race de créatures pour qui la glace était un environnement naturel ; sous ces voûtes résonnaient leurs pas et l'écho de leurs paroles. Des coupes de M'iare pendent encore au plafond, baignant la caverne d'une lumière éternelle. Vous appelez à grands cris, la tête levée vers la cheminée par laquelle vous êtes tombé, mais personne ne vous répond. Irian et Fenor sont persuadés que vous n'avez pas survécu et ils ont déjà entrepris de rejoindre le vaisseau Cardonal. Les parois de la caverne sont raides et lisses : il vous serait impossible de les escalader pour remonter à la surface. Au loin, en direction du nord, vous apercevez un tunnel grossièrement creusé dans la pierre. Il existe un tunnel semblable à l'ouest.",
  choix: [
    { texte: "Si vous souhaitez explorer le tunnel situé au nord", vers: "321" },
    { texte: "Si vous préférez explorer le tunnel qui se trouve à l'ouest", vers: "275" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "64", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "106",
  texte: "Lorsque vous franchissez l'ouverture pratiquée dans la porte, vous voyez trois Barbares des Glaces qui avancent vers vous le long du couloir. Ce sont des guerriers vêtus de fourrure et armés d'épées en os qui sont chacune incrustée de dents pointues sur toute la longueur de la lame. En dépit de la rapidité de leur attaque, vous avez le temps de remarquer un étrange détail : leurs yeux sont complètement blancs et dépourvus de pupilles. Ils vous attaquent comme un seul homme, portant leurs coups et évitant les vôtres d'un même mouvement. Il vous faut les combattre comme s'il s'agissait d'un seul et même adversaire. Ces j trois Barbares sont insensibles à la Discipline Kaï de la Puissance Psychique.",
  choix: [
    { texte: "BARBARES DES GLACES HABILETÉ : 19 ENDURANCE : 36 Vous pouvez prendre la fuite à tout moment en vous glissant à nouveau dans la salle que vous venez de quitter pour vous échapper ensuite par le passade orienté au nord", vers: "145" },
    { texte: "Si vous sortez vainqueur du combat", vers: "338" }
  ],
  combat: { nom: "Barbares Des Glaces", habilete: 19, endurance: 36 }
  },
  {
  id: "107",
  texte: "Lorsque vous jetez un regard dans la vaste caverne de glace, un peu plus loin, vous apercevez avec horreur trois grosses créatures à l'aspect repoussant qui sont en train de se battre en échangeant des coups de griffes, Elles se disputent une carcasse déchirée, étalée sur le sol. Ces créatures sont des Languabarbs, de sauvages 1 prédateurs du pays de Kalte.",
  choix: [
    { texte: "Si vous vous êtes enduit la peau d'huile de Bakanal", vers: "202" },
    { texte: "Si vous n'êtes pas imprégné d'huile de Bakanal, vous pouvez éviter les Languabarbs en revenant sur vos pas, en direction de l'autre tunnel", vers: "284" },
    { texte: "Si enfin vous souhaitez attaquer les trois créatures", vers: "138" }
  ]
  },
  {
  id: "108",
  texte: "Vous voyez passer la patrouille devant vous et vous attendez que le bruit de pas se soit éloigné pour monter l'escalier. Mais soudain, un cri retentit, vous faites volte-l.ice et vous apercevez la silhouette d'un Barbare des Glaces qui vient d'apparaître dans l'obscurité. Il se précipite sur vous en brandissant une lance à la pointe d'os. BARBARE DES GLACES HABILETÉ : 16 ENDURANCE : 24 Vous avez le droit de fuir après le premier Assaut en montant l'escalier quatre à quatre.",
  choix: [
    { texte: "Dans ce cas, si vous souhaitez prendre à droite la direction du sud", vers: "330" },
    { texte: "Si vous combattez jusqu'au bout et que sortez vainqueur", vers: "282" }
  ],
  combat: { nom: "Barbare des Glaces", habilete: 16, endurance: 24, fuite: [{ texte: "Prendre la fuite", vers: "198" }] }
  },
  {
  id: "109",
  texte: "Votre attaque est rapide et mortelle, et les Languabarbs ne s'éveilleront jamais de leur sommeil. Vous fouillez rapidement les lieux, mais vous ne trouvez rien d'intéressant.",
  choix: [
    { texte: "Un rugissement lointain retentit alors et vous estimez préférable de partir au plus vite en empruntant le tunnel orienté au nord", vers: "235" }
  ]
  },
  {
  id: "110",
  texte: "I a porte de pierre s'ouvre en grinçant sur une petite salle faiblement éclairée. Un monolithe noir de 2,50 mètres environ se dresse devant vous. Il est couvert d'étranges symboles gravés à sa surface. Vous vous en approchez pour l'examiner de plus près lorsque, soudain, la porte commence à se refermer derrière vous. Or, il n'y a pas de levier de ce côté-ci du mur.",
  choix: [
    { texte: "Si vous souhaitez vous ruer sur la porte pour tenter de passer par l'entrebâillement", vers: "283" },
    { texte: "Si vous préférez rester où vous êtes", vers: "256" }
  ]
  },
  {
  id: "111",
  texte: "La porte glisse latéralement et révèle un large couloir bien éclairé orienté nord-sud. Le sourd grondement que vous aviez perçu auparavant semble plus intense ici que dans l'obscurité du passage situé derrière vous. A votre gauche, vous remarquez une porte et, au loin, un croisement.",
  choix: [
    { texte: "Si vous souhaitez vous diriger vers ce croisement", vers: "254" },
    { texte: "Si vous préférez refermer la porte secrète et poursuivre votre exploration du passage obscur", vers: "336" }
  ]
  },
  {
  id: "112",
  texte: "Avant que vous ne vous installiez pour la nuit dans la tiédeur de vos Couvertures de Fourrure, Fenor prépare un solide Repas constitué de viande séchée marinée dans du Wanlo, un alcool fort. Bientôt, vous sombrez dans un profond sommeil tandis que la toile de la tente claque sous la puissance du vent.",
  choix: [
    { texte: "Votre nuit, cependant, est peuplée de cauchemars dans lesquels Vonotar le Traître vous apparaît en une succession d'images terrifiantes", vers: "291" }
  ]
  },
  {
  id: "113",
  texte: "La rapidité de vos réflexes vous a évité d'être écrasé par la porte.",
  choix: [
    { texte: "Vous remettez un peu d'ordre dans votre tenue quelque peu dérangée par votre bond acrobatique et vous poursuivez votre chemin le long du couloir", vers: "63" }
  ]
  },
  {
  id: "114",
  texte: "Après avoir parcouru une cinquantaine de mètres environ, vous arrivez dans une autre caverne. Un Bakanal, féroce créature Carnivore des terres de Kalte, est étendu sur un gros bloc de glace, au beau milieu de cet espace glacial. Il semble profondément endormi, sans doute après avoir fait un copieux repas à en juger par les ossements répandus autour de lui. Un autre tunnel s'ouvre dans le mur du fond.",
  choix: [
    { texte: "Si vous souhaitez passer sans bruit devant le Bakanal pour pouvoir emprunter le tunnel", vers: "23" },
    { texte: "Si vous préférez attaquer la créature", vers: "101" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de la Chasse", vers: "279", requis: {"discipline":"chasse"} }
  ]
  },
  {
  id: "115",
  texte: "Vous vous apercevez qu'un grand nombre de ces os répandus parmi les stalagmites ont appartenu à des squelettes humains. Des crânes fracassés, des phalanges, des morceaux de thorax sont ainsi à demi ensevelis dans la glace. Vous êtes sur le point d'abandonner vos investigations lorsqu'une petite boîte en os gravé attire votre attention.",
  choix: [
    { texte: "Si vous souhaitez ouvrir cette boîte", vers: "218" },
    { texte: "Si vous préférez ne pas y toucher, vous pouvez à présent examiner la porte de la forteresse", vers: "52" }
  ]
  },
  {
  id: "116",
  texte: "Vous versez la potion sur votre peau irritée et meurtrie, et vous ressentez immédiatement les effets bienfaisants du liquide. La douleur disparaît peu à peu et l'enflure se résorbe. La Pierre Rayonnante est une roche maudite qui émet une énergie mortelle à laquelle tous les êtres vivants sont sensibles. Si vous n'aviez pas eu la Potion de Laumspur en votre possession, la pierre maléfique vous aurait certainement tué. Vous jetez la Pierre Rayonnante ainsi que la fiole à présent vide, puis vous mettez votre Feuille d'Aventure à jour.",
  choix: [
    { texte: "Vous poursuivrez ensuite votre chemin le long du couloir", vers: "97" }
  ]
  },
  {
  id: "117",
  texte: "Le vent se calme au cours de la nuit et le jour se lève en une aube paisible. Loin au nord, se dessinant à l'horizon, vous apercevez Ikaya, la forteresse de glace. L'immense citadelle aux tours de cristal offre un spectacle fascinant, rendu plus magnifique encore par un étrange phénomène : la forteresse semble en effet avoir été retournée et suspendue dans les airs, au-dessus d'un gros nuage. « C'est un mirage, comme il y en a parfois dans les terres de Kalte, vous explique Dyce ; ici, l'air est tout à fait pur, sans la moindre poussière et la terre se reflète dans les nuages. C'est bien Ikaya que vous voyez là-bas, mais la forteresse elle-même se trouve au-delà de l'horizon. Elle doit être à une soixantaine de kilomètres, environ. » Dyce saisit une pelle et entreprend de dégager les chiens Kanu enterrés sous la neige. Vous réveillez les autres, et tout le monde prend son petit déjeuner avant de repartir. Vers midi, vous atteignez le bord d'une gorge profonde. Elle est large d'une douzaine de mètres et, apparemment, il n'existe aucun moyen de la traverser. Vous êtes donc contraint de suivre le bord du précipice en direction de l'est. Après avoir parcouru ainsi plus de quatre kilomètres, vous découvrez un étroit pont de glace. Il semble malheureusement fort mince, et il est peu probable qu'il puisse supporter le poids d'un traîneau chargé. A présent, vous distinguez à l'horizon la forteresse d'Ikaya mais, cette fois, ce n'est pas un mirage.",
  choix: [
    { texte: "Si vous souhaitez prendre le risque de traverser le pont avec votre traîneau", vers: "73" },
    { texte: "Si vous préférez décharger le traîneau et transporter votre équipement de l'autre côté à raison d'un objet à la fois", vers: "162" },
    { texte: "Si enfin vous jugez plus sage d'abandonner votre traîneau et de continuer à pied", vers: "223" }
  ]
  },
  {
  id: "118",
  texte: "Le vieil homme est beaucoup trop faible pour grimper tout seul. Vous lui conseillez alors d'attacher la Corde autour de sa taille pour que vous puissiez ainsi le hisser hors de sa prison. Avec des gestes lents, il suit vos instructions et, lorsqu'il est enfin prêt, vous avez la surprise de constater, en le soulevant, qu'il ne pèse pas plus lourd qu'un enfant. Quelques minutes plus tard, vous avez réussi à le tirer hors de son cachot et il se retrouve en face de vous, dans le couloir.",
  choix: [
    { texte: "Il vous faut à présent découvrir qui il est", vers: "56" }
  ]
  },
  {
  id: "119",
  texte: "De gros morceaux de glace se détachent du pont et une large fissure apparaît. Vous parvenez malgré tout à maintenir le traîneau sur sa trajectoire et vous atteignez le bord opposé de la gorge. Malheureusement, vous avez tôt fait de constater que l'un des patins est cassé et irréparable. Vous êtes donc contraint d'abandonner le traîneau et de continuer à pied. Il contient toujours, cependant, du matériel fort utile. Vous pouvez emporter une partie de ce matériel en le rangeant dans votre Sac à Dos (mais souvenez-vous que vous n'avez pas le droit de transporter plus de 8 objets). Voici le choix qui vous est offert : - Des vivres équivalents à 5 Repas (chaque Repas compte pour un objet et vous pouvez en prendre un ou plusieurs selon vos besoins). - Des Couvertures de Fourrure (elles comptent pour 2 objets). -Une Tente (elle compte pour 3 objets). - Une Corde (elle compte pour 2 objets). Fenor, Irian et Dyce se hâtent de vous rejoindre, mais lorsqu'ils sont parvenus au milieu du pont, une catastrophe se produit. Dyce, en effet, se prend le pied dans une fissure et tombe. Horrifié, vous le voyez glisser dans le vide ; au dernier moment, cependant, il parvient à s'accrocher au bord du pont et reste ainsi suspendu, les doigts crispés sur la glace. « Au secours ! Aidezmoi ! » hurle-t-il, tandis que ses mains glissent peu à peu.",
  choix: [
    { texte: "Si vous souhaitez venir en aide à Dyce", vers: "19" },
    { texte: "Si vous estimez qu'il est trop dangereux de lui porter secours", vers: "257" }
  ]
  },
  {
  id: "120",
  texte: "Le cyclone souffle avec tant de rage qu'il en déchire presque vos vêtements en vous bombardant sans cesse d'éclats de pierre ou de glace, pointus comme des aiguilles. Lorsque vous levez le Glaive de Sommer, un mugissement sonore retentit à vos oreilles. C'est un hurlement d'horreur et de désespoir. Vous portez alors un coup de votre arme redoutable, fendant le tourbillon, transperçant la substance impalpable du Démon. Un instant plus tard, le cyclone a disparu et les effroyables gémissements se sont tus. Il ne reste plus, éparpillés sur le sol, que les débris fracassés d'une statue creuse.",
  choix: [
    { texte: "Si vous souhaitez examiner l'autel", vers: "274" },
    { texte: "Si vous préférez quitter le temple, vous pouvez partir en franchissant l'arcade située au nord", vers: "306" }
  ]
  },
  {
  id: "121",
  texte: "Vous êtes sur le point de perdre votre concentration lorsque enfin la corde enroulée autour de votre pied se relâche et vous libère. Vous sautez alors du traîneau une seconde à peine avant qu'il ne tombe dans la crevasse et vous entendez les hurlements terrifiants des chiens Kanu qui sont précipités dans l'obscurité du gouffre. Fenor vient aussitôt vous secourir et vous tire en arrière pour vous éloigner du bord instable dont la glace commence à céder sous votre poids. Vous avez perdu vos chiens, votre traîneau et la plus grande partie de vos provisions, mais au moins vous êtes vivant. Fenor et vous-même sautez d'un bond pardessus la crevasse et vous rejoignez les autres. Après une longue discussion, vos guides acceptent de poursuivre la mission, bien que les épreuves qui vous attendent promettent d'être deux fois plus pénibles en raison de la perte de votre équipement. Au loin, vous apercevez un passage étroit qui marque la jonction entre la banquise et la plaine de Hrod. A la nuit tombée, vous avez atteint l'abri de ce défilé et vous y installez votre campement. En faisant l'inventaire des vivres qui vous restent, vous vous apercevez qu'il faudra diviser les rations par deux si vous voulez que l'expédition puisse atteindre Ikaya.",
  choix: [
    { texte: "Le maigre Repas que vous prenez en guise de dîner vous fait perdre 1 point d'ENDURANCE", vers: "325" }
  ]
  },
  {
  id: "122",
  texte: "Loi-Kymar vous tend quelques lambeaux d'étoffe pour vous boucher les narines. Vous prenez une profonde inspiration, vous saisissez le bol d'herbes fumantes et vous quittez la cuisine. Mettant en pratique la Discipline Kaï du Camouflage, vous vous fondez parmi les ombres du couloir et vous vous approchez de plus en plus près des Barbares qui ne se doutent de rien. Vous posez alors le bol derrière un pilastre et vous retournez dans la cuisine en attendant que les vapeurs fassent leur effet. Moins d'une minute plus tard, les Barbares des Glaces tombent évanouis et vous vous dirigez vers la salle du Trône du Brumalmarc sans avoir été repéré. A votre grande satisfaction, vous constatez que l'une des portes incrustées de pierreries n'est pas fermée à clé.",
  choix: [
    { texte: "En vous préparant à passer à l'attaque, vous entrebâillez doucement la porte et vous entrez dans le repaire de Vonotar", vers: "173" }
  ]
  },
  {
  id: "123",
  texte: "La bête est sur vous, pointant sa langue recouverte d'un poil rêche et venimeux. Il vous faut combattre la créature.",
  choix: [
    { texte: "Si vous avez perdu des points d'ENDURANCE au cours du combat", vers: "66" },
    { texte: "Si vous avez remporté le combat sans perdre de points d'ENDURANCE", vers: "174" }
  ],
  combat: { nom: "Languabarb", habilete: 11, endurance: 30 }
  },
  {
  id: "124",
  texte: "Vous sentez une présence de l'autre côté de l'arcade. Vous vous concentrez de toutes vos forces, mais sans parvenir à deviner s'il s'agit d'un être animé de bonnes ou de mauvaises intentions. Vous insistez en déployant toutes les ressources de votre pouvoir mental, mais rien n'y fait, il vous est impossible d'en savoir davantage.",
  choix: [
    { texte: "Votre Discipline Kaï vous a au moins averti que quelqu'un se trouvait là et vous franchissez donc avec prudence l'arcade envahie de brume", vers: "264" }
  ]
  },
  {
  id: "125",
  texte: "Vous avez marché pendant deux heures environ le long du passage qui descend en pente douce et régulière sur toute sa longueur ; d'après vos estimations, vous vous trouvez à présent à peu près 60 mètres plus bas qu'au début de votre exploration et vous atteignez enfin une vaste caverne de glace au centre de laquelle s'étend un lac. Il est recouvert d'une fine couche de glace, et l'eau au-dessous semble obscure et profonde. Vous vous agenouillez sur la rive pour scruter ces mystérieuses profondeurs et vous distinguez alors une grande forme noire qui glisse près de la surface. Il y a donc un être vivant sous cette couche de glace, et un être d'une taille gigantesque. Soudain, vous entendez des grognements derrière vous : ce sont ceux d'un Languabarb. Les bruits viennent du tunnel. Il n'existe qu'une seule issue qui permette de quitter la caverne : c'est un autre tunnel qui s'ouvre dans la paroi opposée, de l'autre côté du lac.",
  choix: [
    { texte: "Si vous souhaitez traverser le lac en courant sur sa surface gelée", vers: "322" },
    { texte: "Si vous préférez attendre le Languabarb et le combattre", vers: "207" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Camouflage", vers: "96", requis: {"discipline":"camouflage"} }
  ]
  },
  {
  id: "126",
  texte: "Vous remarquez que les murs et le plafond du couloir sont couverts d'étranges sculptures. Elles semblent représenter de petits cyclones ou des tornades qui changent peu à peu de forme pour prendre une apparence presque humaine. Bien que ces hiéroglyphes vous intriguent, vous ne vous attardez pas à les examiner et vous poursuivez votre chemin. Un peu plus loin, le tunnel tourne brusquement vers la droite. Vous apercevez alors une autre porte de pierre aménagée dans le mur nord. Le levier qui la commande est relevé et la porte fermée. Au bout du couloir, après la porte, un escalier monte vers de mystérieuses ténèbres.",
  choix: [
    { texte: "Si vous souhaitez examiner cette porte", vers: "246" },
    { texte: "Si vous préférez continuer tout droit et monter l'escalier", vers: "323" }
  ]
  },
  {
  id: "127",
  texte: "Vous sentez que ce Casque est doté d'un pouvoir magique qui pourrait se révéler utile lors de vos futurs combats. Vous ne décelez aucune onde maléfique provenant de cet objet ni du coffre de pierre dans lequel il est conservé.",
  choix: [
    { texte: "Si vous souhaitez prendre ce Casque et vous en coiffer", vers: "308" },
    { texte: "Si vous continuez malgré tout à vous méfier des effets nocifs qu'il pourrait produire, n'y touchez pas et dirigez-vous plutôt vers l'escalier pour voir où il mène", vers: "323" }
  ]
  },
  {
  id: "128",
  texte: "Lorsque la porte de pierre s'ouvre en grinçant, l'homme, dans une réaction de surprise, rejette la tête en arrière. « Qui est là ?» murmure-t-il d'une voix fluette et étranglée. Ses yeux brillent dans l'ombre de son capuchon en lambeaux. Puis soudain, il semble vous reconnaître et se relève d'un bond. « Un Seigneur Kaï ! s'exclame-t-il, les dieux soient loués ! Je m'appelle Tygon et je suis un marchand de Ragadorn. Les Barbares des Glaces m'ont capturé à Liouk et amené ici. J'attends à présent d'être reçu en audience par leur nouveau Brumalmarc, le sorcier du Sommerlund qu'ils appellent Vonotar. Il semble que ce soit lui qui doive décider de mon sort. Mais si vous me délivrez de ce pentagramme magique, je ferai de mon mieux pour vous aider. » Ce pentagramme ne vous est pas inconnu : il s'agit en effet d'un cercle de claustration, une prison magique qui ne peut être détruite que de l'extérieur. Pour libérer cet homme, il vous suffit d'effacer une partie du cercle tracé sur le sol.",
  choix: [
    { texte: "Si vous souhaitez le libérer", vers: "170" },
    { texte: "S'il vous est arrivé de vous rendre à Ragadorn, vous voudrez peut-être lui poser quelques questions sur cette ville afin de dissiper les soupçons que vous pourriez avoir quant à son identité véritable", vers: "11" },
    { texte: "Enfin, si vous préférez refermer la porte de la cellule et retourner dans le couloir principal", vers: "254" }
  ]
  },
  {
  id: "129",
  texte: "Les poils rêches qui couvrent la langue du Languabarb sont imprégnés d'un puissant venin grâce auquel la créature paralyse ses victimes avant de les dévorer. En moins de cinq secondes, le poison fait son effet, et vous perdez connaissance avant même que votre tête n'ait heurté la neige. Lorsque vous reprenez conscience, vous sentez un poids vous peser lourdement sur la poitrine. C'est le cadavre d'Irian. Et tandis que vous essayez tant bien que mal de vous relever, une vision désolante s'offre à vous dans la brume du petit matin. Tous vos guides, en effet, sont morts et ce qui reste de votre équipement est dispersé alentour. Les cadavres des deux Languabarbs sont étendus dans la neige tachée de sang : tous deux ont été tués à coups d'épée. Engourdi par le froid et le choc que vous venez de recevoir, vous cherchez pendant une heure votre Sac à Dos, parcourant d'un pas chancelant l'étendue glacée, lorsque vous vous apercevez enfin qu'il est toujours accroché à vos épaules. Bien que vous soyez toujours dans un état second, vous parvenez malgré tout à découvrir un chemin escarpé qui vous permet de poursuivre votre route.",
  choix: [
    { texte: "Un vent glacial souffle sur ces montagnes hostiles et si vous ne vous êtes pas enduit le corps d'huile de Bakanal, vous perdez 3 points d'ENDURANCE", vers: "155" }
  ]
  },
  {
  id: "130",
  texte: "Vous revenez sur vos pas en courant, vous arrivez au croisement et vous prenez le couloir orienté à l'est. Un Barbare des Glaces vous bloque le passage, mais vous vous ruez sur lui. D'un violent coup d'épaule qui vous ébranle de la tête aux pieds, vous le repoussez contre le mur et vous continuez à courir jusqu'à un escalier dont vous montez les marches quatre à quatre. Vous êtes parvenu à mi-hauteur lorsque vous entendez les hurlements sinistres de vos monstrueux poursuivants. Au sommet de l'escalier, vous découvrez un couloir orienté nord-sud.",
  choix: [
    { texte: "Si vous souhaitez prendre la direction du nord", vers: "198" },
    { texte: "Si vous préférez aller au sud", vers: "69" }
  ]
  },
  {
  id: "131",
  texte: "Vous sentez que ces boutons commandent quelque ancien mécanisme et que, si on appuie dessus dans le bon ordre, une quelconque cachette, coffre ou compartiment secret, sera dévoilée. Mais il se peut aussi qu'en appuyant dessus dans le mauvais ordre ils déclenchent un piège.",
  choix: [
    { texte: "Si vous souhaitez appuyer sur ces boutons", vers: "227" },
    { texte: "Si vous ne voulez pas prendre le risque d'actionner un piège, vous pouvez quitter le temple", vers: "306" }
  ]
  },
  {
  id: "132",
  texte: "A moins que vous ne veniez de prendre un Repas, vous perdez 3 points d'ENDURANCE, tant vous êtes affamé. Vous poursuivez votre chemin le long du tunnel pendant encore plus d'un kilomètre, mais bientôt, vous êtes fatigué et vous vous arrêtez pour dormir. Lorsque vous vous réveillez, vous vous sentez mieux ; vous n'avez cependant aucune idée du temps qu'a duré votre sommeil, car la lumière qui éclaire ces grottes ne change jamais, qu'il fasse jour ou nuit. Vous reprenez votre marche en continuant tout droit pendant des kilomètres. Vous traversez plusieurs grottes immenses où se dressent d'imposants piliers de cristal. Dans l'une de ces vastes cavernes, vous êtes fasciné par une magnifique voûte de glace étincelante. Mais un peu plus loin, un spectacle encore plus impressionnant vous attend. Un étroit passage conduit en effet à une corniche qui longe le bord d'un gouffre gigantesque de près d'un kilomètre de largeur. Vous contournez ce vide terrifiant en essayant de ne pas baisser le regard vers ses profondeurs agitées par les vents, à plusieurs kilomètres au-dessous. Vous marchez sur la corniche depuis seulement quelques minutes lorsqu'un bruit dans votre dos attire votre attention. Vous jetez un coup d'œil en arrière et vous vous apercevez alors avec horreur qu'un monstrueux serpent à deux têtes vous suit à quelques mètres.",
  choix: [
    { texte: "Si vous maîtrisez les Disciplines Kaï de l'Orientation ou de la Communication Animale", vers: "229" },
    { texte: "Dans le cas contraire", vers: "88" }
  ]
  },
  {
  id: "133",
  texte: "Une coupe de M'iare est suspendue au plafond, juste au-dessus de la crevasse.",
  choix: [
    { texte: "Si vous voulez essayer d'attacher votre Corde à cette coupe pour vous élancer ensuite de l'autre côté", vers: "201" },
    { texte: "Si vous ne voulez pas prendre le risque de tomber dans la crevasse, vous devrez revenir sur vos pas et emprunter un autre chemin", vers: "297" }
  ]
  },
  {
  id: "134",
  texte: "Le lendemain à l'aube, lorsque vous vous réveillez, Fenor est en train de préparer le petit déjeuner. Il vous tend alors un bol fumant et vous ne vous faites guère prier pour en avaler le contenu. Vous chargez ensuite le matériel sur les traîneaux avant de reprendre votre chemin. C'est une belle matinée. Le vent est tombé et l'air est frais et limpide. Les chiens Kanu, débordant d'énergie, sont impatients de repartir. Pendant la plus grande partie de votre trajet, la glace est lisse et vous avancez sans difficulté. A la nuit tombée, vous avez atteint l'île de Syem, un pic de granité qui s'élève à 120 mètres au-dessus de la banquise. Vous établissez votre campement du côté sous le vent pour essayer de vous protéger le mieux possible d'éventuelles tempêtes nocturnes. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-3": { vers: "57", texte: "Si vous tirez un chiffre entre 0 et 3," },
        "4-6": { vers: "188", texte: "Entre 4 et 6," },
        "7-9": { vers: "331", texte: "Entre 7 et 9," }
      }
      }
  },
  {
  id: "135",
  texte: "Vous glissez le Disque dans la fente ; il s'y adapte exactement et la porte s'ouvre. Dès que vous l'avez franchie, cependant, elle se referme derrière vous. Vous vous retrouvez dans un petit couloir qui mène à une arcade masquée par des rideaux. Vous les écartez avec précaution et vous découvrez alors une vaste salle. Vous avez été bien avisé d'être si prudent : à moins de 3 mètres de vous, en effet, se tient Vonotar le Traître. Deux Barbares des Glaces sont debout devant lui et il est en train de leur passer au poignet des bracelets d'or. A présent que la porte s'est refermée dans votre dos, il ne vous reste plus qu'à attaquer Vonotar par surprise pour essayer de le capturer.",
  choix: [
    { texte: "Vous armant de courage, vous vous précipitez donc en avant", vers: "100" }
  ]
  },
  {
  id: "136",
  texte: "Soudain, vous êtes projeté en arrière tandis que le pont de glace commence à se disloquer. Pendant quelques secondes, le traîneau reste en équilibre instable sur le bord, comme une balançoire, et vous entendez les cris d'horreur de vos guides impuissants à vous venir en aide. C'est d'ailleurs là le dernier son que vous entendrez jamais, car le pont s'effondre et vous précipite dans le gouffre. Vous faites une chute de 600 mètres au terme de laquelle vous êtes, bien entendu, tué sur le coup. Votre mission s'achève donc ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Pont de glace — §136"
  },
  {
  id: "137",
  texte: "La porte s'ouvre en grinçant et vous la franchissez, prêt à l'attaque. Vous parvenez à tuer deux des créatures endormies avant que les Barbares des Glaces et le troisième Loup Maudit n'aient eu le temps de réagir. Ils bondissent alors sur vous d'un même élan et il vous faut les combattre en les considérant comme un seul et même adversaire. Ils sont partiellement insensibles à la Puissance Psychique, et si vous maîtrisez cette Discipline Kaï, vous n'aurez le droit d'ajouter qu'un seul point à votre total d'HABILETÉ pendant toute la durée de ce combat.",
  suite: "28",
  combat: { nom: "Barbare Des Glaces Et Loup Maudit", habilete: 30, endurance: 30 }
  },
  {
  id: "138",
  texte: "Vous avez pris les Languabarbs par surprise et vous parvenez à tuer l'un d'eux avant que les autres n'aient le temps de réagir. Les deux créatures vous attaquent l'une après l'autre en essayant de vous piquer avec les poils rêches qui leur couvrent la langue.",
  suite: "138-b",
  choix: [
    { texte: "Si vous avez perdu des points d'ENDURANCE (même en fuyant)", vers: "66" },
    { texte: "Si vous avez remporté le combat sans perdre d'ENDURANCE", vers: "25" },
    { texte: "Prendre la fuite", vers: "277" }
  ],
  combat: { nom: "Languabarb", habilete: 11, endurance: 35 }
  },
  {
  id: "139",
  texte: "Vous ressentez soudain une douleur sourde et lancinante au côté. Sous la poche dans laquelle vous avez rangé la Pierre Rayonnante, votre peau est devenue rouge et enflée. Vous êtes pris de vertige et de nausées et vous éprouvez de grandes difficultés à vous maintenir debout.",
  choix: [
    { texte: "Si vous possédez une Potion rouge de Laumspur", vers: "116" },
    { texte: "Dans le cas contraire", vers: "239" }
  ]
  },
  {
  id: "140",
  texte: "L'enfant saisit soudain un couteau en os qu'il cachait dans sa botte et vous enfonce la lame dans le dos de la main. Vous perdez 2 points d'ENDURANCE et vous lâchez le jeune garçon.",
  choix: [
    { texte: "Il court aussitôt vers son père qui, à présent, a repris ses esprits et dégaine une épée également en os dont la lame est incrustée de dents redoutables", vers: "68" }
  ]
  },
  {
  id: "141",
  texte: "L'homme observe un instant de silence, puis il donne sa réponse : « Killean le Suzerain. »",
  choix: [
    { texte: "Si vous souhaitez à présent effacer le pentagramme pour le libérer", vers: "170" },
    { texte: "Si vous ne voulez pas le libérer, refermez la porte de sa cellule et retournez dans le couloir principal", vers: "254" }
  ]
  },
  {
  id: "142",
  texte: "Lorsque vous abattez votre arme sur le rocher, des centaines d'échardes argentées jaillissent sous le coup et le bloc commence à se fissurer, mais les Languabarbs sont déjà sur vous. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 5, le bloc s'effondre et obstrue l'entrée de la grotte.",
  choix: [
    { texte: "Vous pouvez dès lors retourner dans l'autre tunnel", vers: "284" },
    { texte: "Si vous tirez un chiffre entre 6 et 9, le bloc ne tombe pas et il vous faut combattre les Languabarbs", vers: "32" }
  ]
  },
  {
  id: "143",
  texte: "Le cône de givre s'enfonce dans le feuillage des plantes en les gelant instantanément. Tiges et feuilles deviennent alors cassantes et commencent à céder sous votre poids. Vous essayez de bondir sur la plateforme où se tient Vonotar, mais il est trop tard, le pont s'effondre et vous êtes précipité dans le fossé tête la première. La dernière vision que vous emporterez de ce monde sera celle d'un Vonotar ricanant qui pointe sur votre tête sa baguette de cristal. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §143"
  },
  {
  id: "144",
  texte: "Vous êtes précipité dans les ténèbres et vous vous écrasez contre une corniche de glace après une chute de plus de 30 mètres. Votre corps disloqué rebondit pour tomber plus bas encore, mais votre colonne vertébrale a été fracassée sous le choc et vous êtes donc déjà mort lorsque vous atterrissez enfin sur la neige molle qui tapisse le fond de la crevasse. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §144"
  },
  {
  id: "145",
  texte: "Ce couloir n'est pas très long et vous arrivez bientôt dans une autre salle aux murs de pierre. Un peu plus loin un escalier mène à une arcade plongée dans l'ombre, à bonne distance au-dessus du sol. Au pied de cet escalier, vous distinguez le squelette d'un ancien gardien de tombes, encore vêtu de son armure et toujours debout. Ses phalanges nues tiennent une grande épée noire.",
  choix: [
    { texte: "Si vous souhaitez monter l'escalier sans prêter attention au squelette", vers: "36" },
    { texte: "Si vous préférez attaquer le squelette", vers: "278" }
  ]
  },
  {
  id: "146",
  texte: "Centimètre par centimètre vous vous glissez vers l'arrière du traîneau mais, tout à coup, vous entendez la glace craquer: la crevasse est en train de s'élargir. « Sautez ! » hurle Fenor tandis que le traîneau bascule dans le vide. Vous vous préparez à bondir, mais votre pied se prend dans les cordes qui maintiennent le matériel. Si vous ne possédez ni l'un ni l'autre, utilisez la Table de Hasard pour obtenir un chiffre.",
  choix: [
    { texte: "Si vous disposez du Glaive de Sommer", vers: "43", requis: {"special":"glaive-sommer"} },
    { texte: "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière", vers: "121", requis: {"discipline":"maitrise-matiere"} }
  ],
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "1-4": { vers: "226", texte: "Si vous tirez un chiffre entre 1 et 4," },
        "5-9": { vers: "266", texte: "Entre 5 et 9," },
        "0-0": { vers: "312", texte: "Enfin, si vous tirez le 0," }
      }
      }
  },
  {
  id: "147",
  texte: "Vous inspectez chaque centimètre carré de la porte et des murs qui l'encadrent, mais vous ne trouvez strictement rien qui puisse permettre de l'ouvrir. Vous examinez alors la rampe de pierre lorsqu'un rugissement retentit soudain derrière vous avec tant de force que votre sang se glace. Vous faites volte-face et vous voyez alors une créature bondir sur vous : ses mâchoires grandes ouvertes laissent apercevoir une langue couverte de poils rêches. Il vous est impossible d'échapper à ce Languabarb et il vous faut le combattre jusqu'à la mort de l'un de vous deux.",
  choix: [
    { texte: "LANGUABARB HABILETÉ: 10 ENDURANCE: 28 Si vous perdez des points d'ENDURANCE au cours de l'affrontement", vers: "66" },
    { texte: "Si vous remportez la victoire sans perdre un seul point d'ENDURANCE", vers: "84" }
  ],
  combat: { nom: "Languabarb", habilete: 10, endurance: 28 }
  },
  {
  id: "148",
  texte: "Vous avez descendu la moitié des marches lorsque vous vous heurtez à une patrouille de Barbares des Glaces. Vous essayez de les repousser pour pouvoir continuer votre chemin, mais ils sont puissamment armés, disposant à la fois d'épées et de lances. Vous vous battez avec fureur et vous en tuez un bon nombre, mais les autres parviennent à vous encercler et à vous porter le coup de grâce. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §148"
  },
  {
  id: "149",
  texte: "Vous faites habilement un pas de côté pour essayer d'éviter le coup que le Barbare des Glaces vous porte avec sa lance à la pointe d'os. Utilisez la Table de Hasard pour obtenir un chiffre qui vous indiquera si vous avez réussi à esquiver. Si vous maîtrisez la Discipline Kaï de l'Orientation, celle de la Chasse ou celle du Sixième Sens, vous aurez le droit d'ajouter 2 au chiffre donné par la Table.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "286", texte: "Si le total obtenu est de 0 à 4," },
        "5-11": { vers: "333", texte: "S'il est de 5 à 11," }
      }
      }
  },
  {
  id: "150",
  texte: "Le coup que vous assénez fracasse la surface lisse et blanche de la Statue. Aussitôt une rafale de vent glacé s'échappe en sifflant de l'ouverture et, quelques secondes plus tard, tous les murs de la salle sont recouverts d'une couche de glace étincelante. La chute soudaine de la température vous fait perdre 2 points d'ENDURANCE, à moins que votre peau ne soit protégée par de l'huile de Bakanal. Vous constatez alors avec un sentiment d'horreur que la rafale de vent prend peu à peu la forme d'un petit cyclone qui attire dans son œil tous les morceaux de pierre et de glace traînant alentour. Vous venez de libérer un Démon de Glace et cette terrifiante créature a l'intention de vous anéantir.",
  choix: [
    { texte: "Si vous disposez du Glaive de Sommer", vers: "120", requis: {"special":"glaive-sommer"} },
    { texte: "Si vous souhaitez attaquer le cyclone avec une arme normale", vers: "18" },
    { texte: "Si vous préférez essayer de vous enfuir en courant vers l'arcade", vers: "211" },
    { texte: "Enfin, si vous possédez une Sphère de Feu", vers: "310" }
  ]
  },
  {
  id: "151",
  texte: "La bête hideuse meurt à vos pieds tandis que Dyce vous crie : « Vite, il faut partir d'ici, les Languabarbs ne chassent jamais seuls et d'autres ne vont pas tarder à arriver. » Vous ramassez alors votre Sac à Dos et vous suivez Dyce et Irian le long d'un chemin escarpé qui grimpe à flanc de montagne. Mais à peine avez-vous parcouru une cinquantaine de mètres qu'une catastrophe se produit. Aveuglé par l'obscurité et le vent glacial, Dyce ne s'aperçoit pas que le chemin aboutit brusquement à un précipice. Saisi d'horreur, vous entendez vos guides pousser des hurlements qui s'évanouissent peu à peu, au fur et à mesure de leur longue chute dans les ténèbres. La mort vous menace de tous côtés et vous vous accrochez désespérément à la paroi rocheuse pour essayer de survivre.",
  choix: [
    { texte: "Si vous vous êtes enduit le corps d'huile de Bakanal", vers: "209" },
    { texte: "Dans le cas contraire", vers: "339" }
  ]
  },
  {
  id: "152",
  texte: "Vous décidez d'essayer de distraire son attention en jetant quelques Pièces d'Or dans un renfoncement du mur situé en face de lui. Tout d'abord, déterminez le nombre de Pièces d'Or que vous allez lancer et notez ce chiffre. Utilisez ensuite la Table de Hasard pour obtenir un autre chiffre (exceptionnellement, vous considérez que 0 = 10).",
  choix: [
    { texte: "Si le chiffre que la Table vous donne est égal ou inférieur au nombre de Pièces que vous avez décidé de jeter", vers: "319" },
    { texte: "Si le chiffre donné par la Table est supérieur au nombre de Pièces", vers: "181" }
  ]
  },
  {
  id: "153",
  texte: "Vous avez presque réussi à traverser le lac lorsqu'une catastrophe survient. Votre pied droit, en effet, passe à travers la glace et vous êtes coincé à hauteur du genou. Vous essayez désespérément de vous libérer, mais il n'y a rien à faire, vous êtes pris au piège. Quelques secondes plus tard, la couche de glace qui recouvre le lac se fracasse dans un terrible craquement : le monstre des profondeurs dont vous aviez auparavant aperçu la silhouette vient ainsi de faire son apparition à la surface. Paralysé d'horreur, vous voyez alors la gueule noire et visqueuse de la créature s'ouvrir pour exhiber deux rangées de dents tranchantes comme des rasoirs. Le monstre venu du fond des âges se précipite sur vous et cette gueule béante sera la dernière vision que vous emporterez de ce monde, avant que la bête ne vous avale. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §153"
  },
  {
  id: "154",
  texte: "Votre jambe droite est blessée ; la plaie saigne abondamment, et il semble que l'hémorragie ne s'arrêtera pas d'elle-même ; vous posez donc un garrot de fortune autour de votre cuisse, puis vous vous relevez tant bien que mal et vous jetez un coup d'œil alentour. Ce monolithe, de toute évidence, avait pour fonction d'empêcher les intrus de passer, ou de les prendre au piège. C'est sans doute un mage qui, jadis, l'a ainsi doté d'un puissant pouvoir d'explosion. Vous remarquez alors qu'un panneau s'est ouvert dans le mur nord, découvrant un passage obscur qui permet de quitter cette salle.",
  choix: [
    { texte: "Si vous souhaitez explorer ce nouveau couloir", vers: "145" },
    { texte: "Si vous préférez essayer d'ouvrir à nouveau la porte par laquelle vous êtes entré", vers: "242" }
  ]
  },
  {
  id: "155",
  texte: "Le vent glacé de la montagne à tôt fait de dissiper les brumes de l'aube. Epuisé, transi jusqu'à la moelle et encore sous le choc des récents événements, vous escaladez l'impitoyable paroi de roc jusqu'à ce que vous parveniez enfin sur une large corniche où vous vous sentez plus en sécurité. Vous êtes affamé, et il vous faut prendre un Repas avant de continuer, sinon, vous perdrez 3 points d'ENDURANCE. N'oubliez pas de rayer ce Repas de votre Feuille d'Aventure. La corniche en rejoint une autre que vous avez beaucoup de mal à parcourir. Lorsque, enfin, vous arrivez au bout, vous vous trouvez au sommet d'une paroi impressionnante. Pour descendre dans l'étroit défilé que vous apercevez à 300 mètres au-dessous, il vous faudra emprunter un escalier particulièrement raide et dangereux dont les marches sont taillées dans la glace. Utilisez la Table de Hasard pour obtenir un chiffre. Si votre total d'ENDURANCE actuel est inférieur à 10, vous ôterez 2 au chiffre obtenu. Si ce total est supérieur à 20, vous ajouterez 1 au chiffre donné par la Table.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "2-2": { vers: "248", texte: "Si le total obtenu se situe entre -2 et 2," },
        "3-10": { vers: "191", texte: "S'il est de 3 à 10," }
      }
      }
  },
  {
  id: "156",
  texte: "Vous reconnaissez l'odeur d'un concentré de Brosse à Potences, ou « Dent de Sommeil » comme on l'appelle plus communément au Sommerlund. Il s'agit d'un buisson épineux dont vos Maîtres Kaï se servaient pour endormir les chevaux malades ou blessés, le concentré préparé à l'aide de cette plante constituant une puissante Potion somnifère. Si vous souhaitez la conserver, inscrivez-la sur votre Feuille d'Aventure, dans la case des objets contenus dans votre Sac à Dos.",
  suite: "10",
  choix: [
    { texte: "Pour faire un nouveau choix", vers: "10" }
  ],
  effets: { objets: [{"id":"potion-sommeil","quantity":1}] }
  },
  {
  id: "157",
  texte: "Vous prenez la Potion dans votre Sac à Dos et vous entrebâillez prudemment la porte, juste assez pour pouvoir vider la fiole dans le chaudron bouillonnant. Quelques minutes plus tard, les Barbares des Glaces tombent dans un profond sommeil juste après avoir achevé leur repas. Vous pouvez à présent inspecter les lieux. La cuisine est petite et elle contient une étonnante provision d'herbes. « Ces herbes viennent du comptoir de Liouk», assure Loi-Kymar en examinant attentivement les étiquettes qui indiquent ce que les bocaux contiennent. Il remplit ses poches de plusieurs de ces bocaux, puis il en ouvre deux autres et mélange les herbes qu'ils renferment. Il vous tend ensuite cette mixture : « Voici qui vous donnera des forces, Loup Solitaire», dit-il. Vous mangez les feuilles séchées et, aussitôt, une chaleur bienfaisante se répand dans tout votre corps.",
  choix: [
    { texte: "Vous récupérez 6 points d'ENDURANCE et vous vous", vers: "301" }
  ]
  },
  {
  id: "158",
  texte: "L'éclaireur Barbare étant à skis, vous ne pourrez livrer contre lui qu'un seul Assaut ; emporté par son élan, en effet, il passera devant vous sans s'arrêter, en essayant de vous porter un coup. Vous devrez alors tenter de le blesser au moment où il arrivera à votre hauteur.",
  choix: [
    { texte: "ÉCLAIREUR BARBARE HABILETÉ: 20 ENDURANCE: 28 Si vous subissez une perte de points d'ENDURANCE supérieure à celle de votre adversaire au cours de cet unique Assaut", vers: "165" },
    { texte: "Si, en revanche, c'est le Barbare qui perd plus de points d'ENDURANCE que vous", vers: "271" },
    { texte: "Enfin, si vous perdez tous deux le même nombre de points d'ENDURANCE", vers: "337" }
  ],
  combat: { nom: "Éclaireur Barbare", habilete: 20, endurance: 28 }
  },
  {
  id: "159",
  texte: "L'homme vous regarde droit dans les yeux et répond : « Le Ragad. »",
  choix: [
    { texte: "Si vous souhaitez à présent effacer le pentagramme afin de le libérer", vers: "170" },
    { texte: "Si vous préférez vous en abstenir, refermez la porte de sa cellule et retournez dans le couloir principal", vers: "254" }
  ]
  },
  {
  id: "160",
  texte: "Votre matériel de transport est constitué de deux traîneaux tirés chacun par un attelage de chiens Kanu. Cette race vigoureuse est uniquement élevée à Kalte et on ne trouve pas meilleurs chiens de traîneau. Leur épaisse fourrure fauve, leur poitrail puissant, leur robustesse et leur ardeur qui ne faiblit jamais, même dans les climats les plus froids, les rendent particulièrement aptes à accomplir la tâche qui les attend. Chaque traîneau contient suffisamment de vivres et de matériel pour mener à bien votre mission. Quant à vos trois guides, Irian, Fenor et Dyce, ce sont des trappeurs expérimentés pour qui les techniques de survie dans les régions polaires n'ont pas de secrets. De plus, ils connaissent bien les périls cachés qui abondent dans les terres de Kalte. Dès que les chiens sont attelés, vous prenez place sur l'un des traîneaux en compagnie de Dyce, tandis que les autres ouvrent la voie sur l'autre traîneau. En contemplant l'étendue glacée de la banquise de Liouk, vous apercevez une lueur blanche à l'horizon : c'est le glacier de Viad dont la coulée de glace vient se jeter sur la banquise. L'air vif et limpide de Kalte donne une fausse impression des distances : on dirait que le glacier se trouve à une dizaine de kilomètres, alors qu'en fait il est distant d'au moins 100 kilomètres. La première journée de votre voyage se passe bien et vous parcourez un bon nombre de kilomètres. Lorsque, enfin, le soleil se couche, vous décidez d'établir votre campement pour la nuit. Vous vous arrêtez au milieu d'un cercle formé par des piliers de glace qui se sont dressés sous la pression de la banquise sans cesse en mouvement. Les traîneaux sont rangés côte à côte et la tente installée juste devant. On trouve ensuite un abri où les chiens pourront passer la nuit, puis l'heure vient de préparer le dîner. Vous êtes tous rassemblés sous la tente lorsqu'un terrible rugissement retentit soudain au-dehors. « Par tous les dieux ! s'écrie Irian, un Bakanal ! » Les Bakanals sont de grandes créatures carnivores qui vivent à proximité des côtes de Kalte. Ils se nourrissent habituellement de gaillelots ou de petites ostrelles qui abondent au bord de la mer. Ce Bakanal, cependant, a été attiré par l'odeur des chiens et il s'apprête à les attaquer, bien décidé à en dévorer plusieurs d'un coup.",
  choix: [
    { texte: "Si vous souhaitez sortir de la tente pour vous lancer à l'attaque du Bakanal", vers: "78" },
    { texte: "Si vous maîtrisez la Discipline Kaï de la Chasse", vers: "204", requis: {"discipline":"chasse"} },
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "318", requis: {"discipline":"communication-animale"} }
  ]
  },
  {
  id: "161",
  texte: "Le Barbare des Glaces s'avance lentement et ses yeux blancs dépourvus de pupilles vous donnent la chair de poule. Dans sa main droite, il tient un cimeterre en os, mais, bien qu'il soit prêt à frapper, ses gestes sont raides et incertains, comme s'il vous attaquait contre sa volonté. Le Barbare est insensible à la Discipline Kaï de la Puissance Psychique.",
  suite: "210",
  combat: { nom: "Barbare des Glaces", habilete: 17, endurance: 29, immunisePsychique: true }
  },
  {
  id: "162",
  texte: "Le traîneau est déchargé et le matériel qu'il contenait transporté de l'autre côté de la gorge à raison d'un objet par voyage. Tout se passe comme prévu, et il ne reste plus qu'à franchir une dernière fois le pont avec le traîneau lui-même. C'est Dyce qui le conduit en le maintenant à grand-peine au milieu du pont étroit. Mais soudain les deux chiens de tête glissent et tombent dans la gorge. Ils restent suspendus par leur harnais et poussent de longs gémissements en se débattant inutilement dans le vide. Dyce tire frénétiquement sur les rênes pour essayer d'empêcher les autres chiens de tomber à leur tour, mais ses efforts restent vains : un par un, en effet, les quatre autres chiens de l'attelage sont attirés dans le précipice par le poids grandissant de ceux qui sont déjà tombés. « Saute, Dyce, saute ! » hurle Irian tandis que le dernier chien disparaît dans le vide. Dyce bondit juste à temps, avant que le traîneau ne bascule dans la gorge, mais il atterrit à l'endroit où le pont est le plus étroit et perd l'équilibre. Dans un geste désespéré, il parvient à s'agripper au rebord de glace, mais ses mains glissent inexorablement. « Au secours ! Aidez-moi ! » s'écrie-t-il.",
  choix: [
    { texte: "Si vous souhaitez essayer de sauver Dyce", vers: "19" },
    { texte: "Si vous pensez qu'il n'y a aucun moyen de lui venir en aide", vers: "257" }
  ]
  },
  {
  id: "163",
  texte: "Lorsque vous abaissez le levier, une porte de pierre coulisse latéralement et ferme ainsi la pièce encombrée de débris. Lorsque vous soulevez le levier, la porte de pierre s'ouvre à nouveau.",
  choix: [
    { texte: "Si vous souhaitez entrer dans cette pièce pour examiner ce qu'elle contient", vers: "38" },
    { texte: "Si vous préférez poursuivre votre chemin le long du passage orienté à l'est", vers: "237" }
  ]
  },
  {
  id: "164",
  texte: "Le monstre aux tentacules se hisse hors du fossé et vous attaque. En même temps, vous remarquez que Vonotar lève sa Crosse noire en fixant les yeux sur Loi-Kymar. Il est en train d'attaquer le magicien à l'aide de sa Puissance Psychique. Vous vous rendez compte alors que si Loi-Kymar est tué, il emportera dans la mort le secret de la Crosse de la Guilde. Mais avant tout, il vous faut combattre le monstre. Cette créature est un Akranionor qui appartient au monde des morts vivants. Vous pourrez donc multiplier par deux tous les points d'ENDURANCE que votre adversaire perdra au cours du combat, en raison de la puissance du Glaive de Sommer.",
  choix: [
    { texte: "AKRANIONOR HABILETÉ: 23 ENDURANCE: 50 Si vous remportez la victoire en 5 Assauts ou moins", vers: "272" },
    { texte: "Si le combat se prolonge au-delà de 5 Assauts", vers: "324" }
  ],
  combat: { nom: "Akranionor", habilete: 23, endurance: 50, vulnerableGlaiveSommer: true }
  },
  {
  id: "165",
  texte: "Le choc de son attaque vous a projeté à terre.",
  choix: [
    { texte: "Lorsque vous vous relevez, vous le voyez s'arrêter un peu plus loin et déchausser ses skis", vers: "68" }
  ]
  },
  {
  id: "166",
  texte: "Au pied de l'escalier, vous découvrez un autre tunnel orienté au nord. Vous vous apprêtez à l'emprunter lorsque votre main entre soudain en contact avec un levier qui dépasse du mur, à votre droite. En regardant de plus près, vous constatez l'existence d'une porte secrète.",
  choix: [
    { texte: "Si vous souhaitez ouvrir cette porte", vers: "111" },
    { texte: "Si vous préférez poursuivre votre chemin le long du nouveau tunnel", vers: "336" }
  ]
  },
  {
  id: "167",
  texte: "Le vent tombe peu à peu, l'atmosphère s'éclaircit et le Glacier de Viad se révèle alors dans toute sa splendeur. La surface lisse de la glace ressemble à un tapis de neige étincelante incrustée de pierres de toutes les couleurs : jaunes, violettes, bleues, vertes, orange, cramoisies; et les cristaux de glace brillent d'un tel éclat que le plus somptueux bijou paraîtrait terne par comparaison. Le mur de glace s'élève à 250 mètres de hauteur et ne présente pas d'obstacle à l'escalade, bien qu'il soit très escarpé. Le temps est beau, mais il vous faut presque une journée entière pour grimper au sommet de la paroi de glace. Tout le matériel a été déchargé et monté là-haut où on l'arrime à nouveau sur les traîneaux. Les chiens Kanu jouent entre eux en se battant, et vos provisions sont à tel point secouées par l'escalade qu'elles se sont transformées à la fin de la journée en une infâme bouillie. Lorsque tout est enfin terminé, vous êtes épuisé. La nuit tombe et vous décidez donc d'établir votre campement dans l'abri que vous offre une cuvette naturelle creusée dans la glace. Vous avez sans nul doute bien mérité une bonne nuit de repos. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "85", texte: "Si vous tirez un chiffre de 0 à 6," },
        "7-9": { vers: "300", texte: "De 7 à 9," }
      }
      }
  },
  {
  id: "168",
  texte: "Lorsque vous marchez sur le quartz, vous sentez une vibration vous parcourir les jambes, de la plante des pieds jusqu'aux genoux. Vous remarquez alors une faible lumière qui brille à l'intérieur de la dalle et vous entendez un bourdonnement en provenance de l'autel.",
  choix: [
    { texte: "Le cœur battant, vous vous préparez à une attaque et vous avancez à pas prudents", vers: "60" }
  ]
  },
  {
  id: "169",
  texte: "Lorsque vous arrivez devant la porte massive, vous essayez désespérément de trouver un moyen de l'ouvrir, mais elle est parfaitement lisse et ne comporte ni poignée, ni serrure, ni trou de serrure. La créature aura bientôt atteint le sommet de la rampe et vous êtes sur le point de pousser un cri de désespoir lorsque vous apercevez un bloc de granité encastré dans le mur. Un petit triangle est gravé dans la pierre.",
  choix: [
    { texte: "Si vous possédez un Triangle de Pierre Bleue", vers: "41" },
    { texte: "Sinon", vers: "265" }
  ]
  },
  {
  id: "170",
  texte: "A l'aide d'un pan de votre cape, vous effacez une partie du pentagramme, traçant ainsi un chemin suffisamment large pour que l'homme puisse s'en échapper. Vous êtes alors frappé par sa maigreur impressionnante et vous constatez qu'il a du mal à se maintenir debout. « Soyez remercié, Seigneur Kaï, dit-il, si jamais nous parvenons à nous enfuir d'Ikaya, je m'efforcerai de payer la dette de reconnaissance que j'ai désormais envers vous ; il vaut mieux que vous passiez devant, ajoute-t-il, car j'ai quant à moi trop mal aux yeux pour voir clairement: j'ai été atteint, en effet, de cécité des neiges et j'en subis encore les séquelles. » Vous ouvrez donc la marche le long du passage et vous vous apprêtez à emprunter le couloir principal en direction du nord lorsque deux mains aux doigts d'acier vous attrapent soudain par-derrière et se referment autour de votre cou. Un terrible hurlement trahit alors la véritable identité du marchand : c'est en fait un Monstre d'Enfer, un redoutable serviteur des Maîtres des Ténèbres, un mort vivant doué de la faculté de changer d'apparence à sa guise. Il vous a menti pour que vous le libériez du pentagramme et, à présent qu'il n'a plus besoin de vous, il tente de vous tuer. Vous vous efforcez désespérément de reprendre votre respiration tandis que les doigts squelettiques de votre agresseur vous brûlent sous leur étreinte en essayant de vous déchirer la gorge. Vous perdez aussitôt 6 points d'ENDURANCE. Si vous êtes toujours vivant, vous parvenez enfin à vous dégager, mais il vous faut à présent affronter la créature dans un combat à mort. Compte tenu de la brusquerie de l'attaque, vous n'avez pas le temps d'avaler quelque potion que ce soit avant d'engager le combat.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "304", requis: {"special":"glaive-sommer"} },
    { texte: "Dans le cas contraire", vers: "175" }
  ]
  },
  {
  id: "171",
  texte: "Le bouchon est coincé dans la fiole et il vous faut l'ôter avec précaution pour ne pas prendre le risque de briser le verre. Peu à peu, le bouchon glisse et vous parvenez enfin à l'enlever ; vous reniflez alors le liquide orange. Si vous ne maîtrisez aucune de ces deux Disciplines, cette potion ne vous inspire guère confiance et vous décidez de vous en débarrasser.",
  choix: [
    { texte: "Si vous possédez laDiscipline Kaï du Sixième Sens ou celle de la Maîtrise des Armes", vers: "311", requis: {"discipline":"sixieme-sens"} },
    { texte: "Faites un nouveau choix", vers: "10" }
  ]
  },
  {
  id: "172",
  texte: "Vous refusez l'huile de Bakanal que vous propose Irian et vous retournez sous la tente. Les autres, cependant, après vous avoir félicité de votre victoire sur la créature, sortent à leur tour de la tente et vont rejoindre Irian. Stupéfait, vous les voyez alors plonger eux aussi les mains dans la graisse de Bakanal et s'en enduire le corps sous leurs vêtements. Un peu plus tard dans la soirée, vous finissez par vous endormir, non sans avoir pris la précaution de vous boucher les narines avec du coton.",
  choix: [
    { texte: "Les autres, pour leur part, ne semblent pas le moins du monde incommodés par l'épouvantable odeur", vers: "134" }
  ]
  },
  {
  id: "173",
  texte: "La salle du Trône du Brumalmarc est une vaste pièce dans laquelle se dresse une sorte de plateau central constitué de blocs de glace disposés les uns sur les autres. Sur cette plate-forme se trouve le Trône du Brumalmarc, un trône aussi vieux qu'Ikaya elle-même. Vonotar y est assis, entouré de gros volumes et d'étranges accessoires de nécromancien. Il est absorbé dans son étude et ne vous voit pas entrer. Il reste ainsi quelques instants sans soupçonner votre présence lorsque, soudain, Loi-Kymar éternue. « Qui ose me déranger ? » siffle alors Vonotar en se levant du Trône du Brumalmarc et en cherchant l'intrus du regard. Lorsqu'il vous voit, il a une sorte de hoquet et une expression horrifiée transforme son visage. Aussitôt, sa main cherche hâtivement à saisir une longue Crosse noire : c'est là son bâton de magicien. Il a l'air d'un assassin que l'on vient de surprendre en train de commettre un crime particulièrement abominable. Vous vous hâtez de dégainer votre arme et vous commencez à escalader la pyramide de cristal. Vous êtes parfaitement conscient qu'il va falloir faire vite si vous voulez parvenir à le maîtriser et à le capturer vivant. Lorsque vous atteignez le bord de la plateforme, vous voyez un large cercle de blocs de cristal s'enfoncer dans le sol, autour du Trône. Un profond fossé se forme ainsi entre Vonotar et vous. S'élevant alors de cette tranchée, vous entendez une série de cris et de grognements terrifiants qui n'ont rien d'humain. Vous vous préparez à combattre mais vous ne vous attendiez certainement pas à voir surgir l'épouvantable créature qui vient d'apparaître sous vos yeux. Un monstre énorme, verdâtre, répugnant, rampe en effet hors de l'ombre. Sa tête informe est une gigantesque masse de tentacules et de ventouses qui laissent suinter une mucosité gluante, noire et putride. Au centre de cet amas tremblotant palpite un œil jaune et hideux. Ce monstre est entièrement soumis à Vonotar qui lui ordonne de s'avancer vers vous.",
  choix: [
    { texte: "Si vous possédez une Effigie", vers: "34" },
    { texte: "Si vous n'en avez pas, mais si vous disposez en revanche du Glaive de Sommer", vers: "164", requis: {"special":"glaive-sommer"} },
    { texte: "Si vous n'avez ni l'un ni l'autre", vers: "200" }
  ]
  },
  {
  id: "174",
  texte: "Le Languabarb est mort, mais l'écho de ses grognements semble toujours résonner dans la caverne. Soudain, vous voyez une autre créature semblable surgir du tunnel et foncer sur vous. C'est la femelle du Languabarb : saisie de rage, elle veut à tout prix venger son compagnon.",
  choix: [
    { texte: "Vous n'avez plus à présent qu'un seul moyen de vous enfuir : traverser le lac", vers: "322" }
  ]
  },
  {
  id: "175",
  texte: "Vous faites un pas de côté pour esquiver la créature et vous lui portez à la tête un coup qui aurait mis hors de combat n'importe quel mortel. Mais, à votre grand dam, le Monstre d'Enfer est indemne et se lance à nouveau à l'attaque. C'est un mort vivant aux pouvoirs redoutables, invulnérable aux armes normales. Les Maîtres des Ténèbres l'ont envoyé ici en mission pour tuer Vonotar et le punir ainsi de sa défaite dans la bataille du golfe de Holm. A présent qu'il est libéré du pentagramme qui l'emprisonnait, le Monstre d'Enfer peut accomplir sa mission et retourner chez lui pour y recevoir de ses maîtres récompenses et honneurs. Vous hurlez de terreur lorsque les doigts de la créature s'enfoncent dans les chairs de votre cou, mais vos hurlements ne sont entendus de personne dans ce sombre couloir et seule la mort mettra un terme à l'insupportable douleur qui vous étreint la gorge. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Mort — §175"
  },
  {
  id: "176",
  texte: "Vous parvenez finalement à atteindre l'autre rive et vous courez vers l'entrée du tunnel en laissant la rivière derrière vous. Le tunnel mène en direction du nord, et vous y marchez des heures durant. Il vous est impossible de deviner l'heure qu'il est, car la perpétuelle clarté qui règne dans les Grottes de Kalte ne varie jamais, qu'il fasse jour ou nuit. A travers des fissures dans les parois du tunnel, vous parvenez à apercevoir des salles et des grottes, et la taille gigantesque de ce labyrinthe vous émerveille. Vous vous endormez presque debout lorsque vous sentez soudain une odeur de viande rôtie. Elle vient d'une grotte située à votre droite, quelques mètres plus loin. Vous avez très faim et il va être bientôt temps pour vous de prendre un Repas.",
  choix: [
    { texte: "Si vous souhaitez aller voir ce qui se passe dans cette grotte", vers: "5" },
    { texte: "Si vous préférez ne pas vous en occuper et poursuivre votre chemin", vers: "132" }
  ]
  },
  {
  id: "177",
  texte: "Vous reconnaissez aussitôt l'odeur âcre de Ronces des Cimetières distillées. Cette décoction de couleur noire est un poison puissant et vous rebouchez aussitôt la fiole pour empêcher les vapeurs nocives de s'en échapper. Si vous souhaitez conserver cette Potion, inscrivez-la sur votre Feuille d'Aventure dans la case des objets contenus dans votre Sac à Dos.",
  suite: "10",
  choix: [
    { texte: "Pour faire un nouveau choix", vers: "10" }
  ],
  effets: { objets: [{"id":"potion-poison","quantity":1}] }
  },
  {
  id: "178",
  texte: "Vous suivez les éclaireurs Barbares depuis presque deux heures lorsqu'un vent furieux et glacé se lève à l'ouest. Le terrain devient très accidenté, et des amas de neige dissimulent des arêtes de glace tranchantes comme des rasoirs ainsi que les inégalités du sol qui risquent à tout moment de vous faire tomber. Grâce à leurs skis (fabriqués à partir de côtes de mammouths de Kalte), les éclaireurs Barbares n'ont aucune difficulté à parcourir cette surface semée d'embûches. La traverser à pied représente cependant une douloureuse épreuve. Le vent mordant balaie le glacier et apporte avec lui des nuages déversant une neige fine qui réduit sensiblement la visibilité. Vous prenez très vite conscience du danger qu'il y aurait à être pris au milieu d'un blizzard sur une étendue dépourvue de tout abri et vous faites donc signe à vos compagnons d'abandonner la poursuite.",
  choix: [
    { texte: "Vous vous dirigez vers eux lorsque, soudain, la glace se dérobe sous vos pas, vous précipitant en de mystérieuses profondeurs", vers: "105" }
  ]
  },
  {
  id: "179",
  texte: "Vous imaginez un plan particulièrement audacieux. En vous faisant passer pour un Barbare des Glaces, vous pourriez en effet poser le bol près des gardes ; dans la pénombre du couloir, il leur serait difficile d'apercevoir la fumée. Loi-Kymar approuve votre plan et prépare un mélange d'herbes destiné à vous protéger vous-même contre les vapeurs nocives. Vêtu des fourrures d'un Barbare des Glaces, vous avancez bientôt dans le couloir, le bol caché sous vos vêtements. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "39", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "296", texte: "Entre 5 et 9," }
      }
      }
  }
];
