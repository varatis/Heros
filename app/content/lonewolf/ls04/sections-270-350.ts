import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 04 — Le Gouffre Maudit
 * Paragraphes 270 à 350. Fichier GÉNÉRÉ par
 * scripts/ls04-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls04-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_270_350: StorySection[] = [
  {
  id: "270",
  texte: "La pluie et l'obscurité dissimulent votre approche, vous permettant d'atteindre les marches de marbre sans être vu. L'escalier est envahi de mauvaises herbes et de moisissures, mais un chemin y a été tracé qui permet de descendre dans les ténèbres d'une vaste cave voûtée.",
  choix: [
    { texte: "Si vous possédez une Torche dans votre Sac à Dos", vers: "29" },
    { texte: "Si vous possédez une Sphère de Feu", vers: "168" },
    { texte: "Si vous n'avez ni l'une ni l'autre, vous pouvez poursuivre votre chemin dans l'obscurité", vers: "246" },
    { texte: "Il vous est également possible de quitter la cave pour essayer d'entrer dans le temple par la porte de la crypte", vers: "183" }
  ]
  },
  {
  id: "271",
  texte: "Vous êtes parvenu au milieu du pont lorsque l'un des Gardes tire sur la corde suspendue au plafond. En jetant un coup d'œil pardessus votre épaule, vous constatez avec horreur que la corde passe dans une série d'anneaux de métal pour aboutir à deux broches de fixation qui maintiennent la passerelle accrochée au bord du puits. Lorsque la corde se tend, les broches de fixation se détachent. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse, vous ajouterez 2 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "9", texte: "Si vous obtenez un total de 0 à 6," },
        "7-11": { vers: "104", texte: "De 7 à 11," }
      }
      }
  },
  {
  id: "272",
  texte: "Vous heurtez un gros rocher qui émerge de la rivière. Fort heureusement, ce sont vos pieds (et non votre tête) qui ont encaissé le choc. Vous êtes submergé cependant par l'eau bouillonnante qui vous remplit le nez et les oreilles. Les rapides vous emportent, vous êtes roulé en tous sens, les yeux vous piquent et la douleur que le choc a provoquée dans vos jambes se répand dans tout votre corps. L'arête pointue d'un rocher déchire la manche de votre tunique et vous meurtrit le bras. Votre arme vous échappe des mains. Vous êtes ensuite projeté dans une sorte de torrent aux berges en forme de V et vous plongez cul par-dessus tête dans les profondeurs d'une vaste étendue d'eau. Tandis que vous vous enfoncez dans les flots sombres et agités de remous, vous perdez rapidement connaissance, sombrant dans un engourdissement aveugle et silencieux. Lorsque vous ouvrez à nouveau les yeux, le soleil est en train de se coucher. Vous êtes échoué sur une berge de la rivière près d'un sentier forestier au tracé sinueux. Les contours de la chaîne de Maaken se dessinent à l'est et vous en concluez que vous avez dû être emporté par le courant sur plusieurs kilomètres. Vous venez de survivre à une terrible épreuve qui aurait eu raison sans nul doute d'un mortel ordinaire. Vous avez perdu 5 points d'ENDURANCE en raison des blessures infligées à vos jambes et à votre tête. Vous avez également perdu une arme. En revanche, tous vos Objets Spéciaux, les objets contenus dans votre Sac à Dos et vos Pièces d'Or, sont intacts.",
  choix: [
    { texte: "Apportez les modifications nécessaires à votre Feuille d'Aventure, puis", vers: "79" }
  ]
  },
  {
  id: "273",
  texte: "Vous avez parcouru moins de 8 kilomètres lorsque vous apercevez, un peu plus loin sur la grand-route, un convoi de roulottes, peintes de couleurs voyantes et tirées par des bœufs. Une immense bannière ornée de glands flotte sur le toit de la roulotte de tête. On peut y lire ces mots : « Le célèbre groupe Asajir, troubadours aux Cours Impériales de Magnamund».",
  choix: [
    { texte: "Si vous souhaitez faire signe à ces troubadours de s'arrêter pour leur poser des questions", vers: "37" },
    { texte: "Si vous préférez ne pas leur prêter attention et les laisser passer", vers: "126" }
  ]
  },
  {
  id: "274",
  texte: "Barraka dégaine son cimeterre à la lame étincelante et tranchante comme un rasoir, puis il s'avance sur vous avec une souplesse terrifiante qui en dit long sur sa puissance de guerrier et son parfait sang-froid.",
  choix: [
    { texte: "Vous allez devoir engager contre lui un rude combat qu'il faudra poursuivre jusqu'à la mort de l'un de vous deux", vers: "122" }
  ]
  },
  {
  id: "275",
  texte: "D'un seul coup de votre épée d'or, vous brisez le pilier de bois. Un tremblement agite le sol et, dans un grondement assourdissant, un déluge de terre et de pierres se déverse dans le tunnel, bloquant complètement le passage. Vous êtes aussitôt enveloppé d'un nuage de fumée. Toutes les Torches se sont éteintes et, sous la violence du choc, vous avez été projeté à terre dans une chute qui vous fait perdre 1 point d'ENDURANCE.",
  choix: [
    { texte: "Vous vous relevez à grand-peine et vous vous mettez à courir le long du tunnel envahi de poussière, en direction d'une lointaine clarté diffusée par des Torches que le choc de l'éboulement n'a pas soufflées", vers: "335" }
  ]
  },
  {
  id: "276",
  texte: "Un grognement terrifiant retentit bientôt. Vos hommes et vousmême vous immobilisez en voyant le mur du fond s'avancer soudain vers vous. Une crevasse apparaît qui s'élargit en révélant deux rangées de dents tranchantes comme des rasoirs. Vous avez réveillé un Ver de Pierre affamé qui a l'intention de vous inscrire au menu de son prochain repas. Vos patrouilleurs dégainent leurs épées et se préparent au combat. Il est trop tard pour qu'ils puissent prendre la fuite.",
  choix: [
    { texte: "Si vous souhaitez combattre le Ver de Pierre", vers: "88" },
    { texte: "Contrairement à vos hommes qui se trouvent devant, vous pouvez peut-être essayer de fuir en retournant vers l'échelle", vers: "26" }
  ]
  },
  {
  id: "277",
  texte: "D'un coup de pied, vous repoussez le cadavre du Chien de Guerre et vous vous préparez à un nouveau combat. Trois autres molosses grognant et grondant s'apprêtent à vous bondir dessus et vous devrez les affronter en les considérant comme un seul et même ennemi.",
  suite: "155",
  combat: { nom: "Chiens de Guerre", habilete: 22, endurance: 35 }
  },
  {
  id: "278",
  texte: "La promptitude de vos réflexes vous a sauvé d'une mort certaine. Le disque mortel vous rate en effet et vient se loger dans une roue. Vous éloignant du chariot, vous courez à toutes jambes le long d'un étroit sentier qui mène à un bosquet d'arbres au feuillage touffu. Vous plongez parmi les branchages pour vous mettre à couvert, tandis que retentissent derrière vous les cris des brigands.",
  choix: [
    { texte: "Si vous souhaitez poursuivre votre chemin tout droit en direction du sud, parmi les arbres de la forêt", vers: "123" },
    { texte: "Si vous préférez aller vers l'ouest", vers: "169" }
  ]
  },
  {
  id: "279",
  texte: "Tandis que vous déroulez le parchemin dont vous commencez à lire la sinistre prophétie, le baron se lève avec difficulté et répète mot pour mot chaque vers de la terrible strophe, sa voix s'élevant comme un écho de la vôtre : Au soir de pleine lune, en un temple profond Sacrifice viendra à jamais réveiller Les légions d'un seigneur trop longtemps oublié. Quand mourra sur l'autel la vierge aux cheveux blonds, Des gorges de Maaken les morts se lèveront Pour exiger enfin la rançon des guerriers. « Il faut que vous la sauviez, Loup Solitaire, dit le baron d'une voix tremblante d'émotion ; il faut que vous empêchiez le sacrifice ». « Sauver qui ? Qui doit-il sauver ? » interroge le capitaine Gayal tout en essayant de calmer le baron en émoi. « Ma fille Madelon, répond ce dernier. Barraka a découvert le Poignard de Vashna et il projette de sacrifier ma fille sur l'autel du temple pour libérer les morts des gorges de Maaken. » Le baron explique alors qu'au temps de la Lune Noire le roi Ulnar du Sommerlund tua Vashna, le plus puissant des Maîtres des Ténèbres à l'aide du Glaive de Sommer, l'Épée du Soleil. Le corps du chef ennemi ainsi que les cadavres de tous ses soldats furent précipités dans les abîmes sans fond des gorges de Maaken. « Barraka veut réveiller ces légions, poursuit le baron, et les amener à la victoire en conquérant tout d'abord le Sommerlund, puis l'ensemble des Fins de Terre. » Vous observez le baron dans un silence impressionnant. Si Barraka parvient à accomplir le sacrifice, tout sera perdu. Quelle armée de mortels pourrait en effet résister aux légions des morts ? Le capitaine Gayal vous entraîne ensuite hors de la pièce, dont il referme la porte derrière lui. « Je craignais qu'il ne soit fou, dit-il, mais votre parchemin vient hélas ! confirmer mon pire cauchemar ; il dit bien la vérité. » Tandis que vous repensez à l'effroyable signification de ces quelques vers, votre sombre méditation est soudain interrompue par le son aigu d'une corne de guerre. Le capitaine Gayal s'approche d'une meurtrière et scrute la plaine. Lorsqu'il se tourne à nouveau vers vous, il a le teint gris comme la cendre. « Les brigands, murmure-t-il, ils lancent une attaque. »",
  choix: [
    { texte: "Si vous possédez l'Épée du capitaine Gayal", vers: "327" },
    { texte: "Sinon", vers: "289" }
  ]
  },
  {
  id: "280",
  texte: "Vous retournez le cadavre et vous le fouillez rapidement. Vous découvrez alors les objets suivants : - 3 Pièces d'Or, - des provisions équivalant à 1 Repas. -1 Epée. Vous pouvez prendre un ou plusieurs de ces objets avant de franchir le pont. N'oubliez pas de les noter sur votre Feuille d'Aventure. Lorsque vous parvenez de l'autre côté de la passerelle, vous entendez des bruits de pas lointains et précipités.",
  suite: "348",
  choix: [
    { texte: "Vous estimez préférable de ne pas vous attarder plus longtemps et vous quittez les lieux en empruntant le tunnel qui s'ouvre dans le mur ouest", vers: "348" }
  ],
  effets: { or: 3, objets: [{"id":"repas"},{"id":"epee"}] }
  },
  {
  id: "281",
  texte: "La créature disparaît et vous vous retrouvez allongé par terre dans le tunnel. Vous avez le souffle court, votre cœur bat avec force et une sueur froide ruisselle sur votre corps. Vous comprenez alors ce qui vous est arrivé. Les spores des champignons ont provoqué en vous une hallucination. Le Démon des Tunnels n'existait que dans votre esprit. Malheureusement, bien qu'il ne se soit agi là que d'une illusion, vous avez bel et bien perdu les points d'ENDURANCE que vous a coûtés ce combat imaginaire. Vous vous êtes en effet infligé des blessures à vousmême en vous jetant contre les murs aux aspérités pointues. Tandis que les effets de ces spores malfaisantes disparaissent peu à peu, une fatigue irrépressible vous submerge et vous perdez conscience. Vous ne vous réveillez qu'au bout de plusieurs heures, la gorge et la tête douloureuses.",
  choix: [
    { texte: "Vous allumez à nouveau votre Torche et vous reprenez votre chemin le long du tunnel", vers: "185" }
  ]
  },
  {
  id: "282",
  texte: "La serrure est rouillée et grippée, mais elle finit par céder et la porte s'ouvre. Vous pénétrez alors dans un étroit passage qui descend vers une autre porte située 15 mètres plus loin. Vous donnez l'ordre à vos hommes de partir en avant tandis que vous refermez la porte. Vous éprouvez de grandes difficultés à actionner à nouveau la serrure pour verrouiller le panneau. Lorsque vous entendez enfin cliqueter le mécanisme, un autre cliquetis, beaucoup plus sonore, retentit comme un écho : une trappe vient de s'ouvrir dans le sol au beau milieu du passage. Tous vos hommes, hurlant de terreur, sont alors précipités dans un gouffre profond. La gorge nouée par la peur, vous vous approchez du bord du gouffre et vous scrutez ses profondeurs obscures. Les parois de la fosse sont verticales et vous ne parvenez pas à en distinguer le fond. Un courant d'air froid et le sifflement sinistre d'un vent lointain montent du gouffre. Il n'y a plus rien à faire, il ne vous reste plus qu'à adresser un adieu silencieux à vos hommes perdus à jamais.",
  choix: [
    { texte: "Le cœur lourd, vous contournez le gouffre et vous vous dirigez vers l'autre porte, au bout du passage", vers: "257" }
  ]
  },
  {
  id: "283",
  texte: "Vous empoignez le flacon d'Eau Bénite, vous visez soigneusement et vous le jetez de toutes vos forces. Barraka s'immobilise, bouche bée, tandis que le flacon vient se fracasser contre la lame d'acier noir du poignard de Vashna. Une immense flamme blanche jaillit alors dans un bruit d'explosion. Une bouffée de chaleur intense vous brûle presque le visage et vous êtes projeté à terre. Vous perdez 3 points d'ENDURANCE. Horrifié, vous voyez ensuite Barraka le bras déchiqueté par l'explosion chanceler en arrière à travers le temple. Il a été aveuglé par les flammes et sa main valide est crispée sur ses yeux morts. Dans un silence impressionnant, il trébuche et tombe dans l'ouverture béante des portes noires aux têtes de morts.",
  suite: "200",
  choix: [
    { texte: "Il est aussitôt précipité au fond des gorges de Maaken et englouti par le gouffre maudit", vers: "350" }
  ],
  effets: { endurance: -3 }
  },
  {
  id: "284",
  texte: "Vous ordonnez à vos hommes de se déployer sur une seule ligne et d'avancer vers les brigands. Lorsqu'ils ne sont plus qu'à une centaine de mètres de l'ennemi, vous donnez le signal de l'attaque. Le vent vous cingle le visage en vous portant l'écho des cris de guerre qui retentissent dans la plaine. Les adversaires, se précipitant à la rencontre les uns des autres, se heurtent avec une formidable violence. Vous êtes vous-même à demi assommé par le choc lorsque votre cheval vient frapper de plein fouet le flanc d'une monture ennemie. L'animal et son cavalier sont projetés à terre. Quant à vous, vous vacillez sur votre selle, et vous ne parvenez pas à éviter un coup de lance qui ouvre une blessure dans votre cuisse. Vous perdez aussitôt 3 points d'ENDURANCE avant de vous tourner vers votre agresseur pour le combattre.",
  choix: [
    { texte: "GUERRIER PILLARD HABILETÉ: 16 ENDURANCE: 25 Vous avez le droit de prendre la fuite à tout moment", vers: "89" },
    { texte: "Si vous remportez la victoire", vers: "7" }
  ],
  combat: { nom: "Guerrier Pillard", habilete: 16, endurance: 25 }
  },
  {
  id: "285",
  texte: "Vous vous précipitez en haut des marches pour attaquer les Gardes. Ces derniers tirent aussitôt une volée de carreaux d'arbalètes et l'une des flèches à la pointe de métal transperce le capuchon de votre cape. Par miracle, vous n'êtes pas touché. Vous levez alors votre arme et vous frappez, fracassant le crâne du garde qui a tiré sur vous. A peine s'est-il effondré dans l'escalier que l'un de ses compagnons s'avance pour vous combattre. Il vous est impossible de vous enfuir et vous devrez affronter ce nouvel adversaire jusqu'à la mort de l'un de vous deux.",
  suite: "71",
  combat: { nom: "Garde", habilete: 16, endurance: 28 }
  },
  {
  id: "286",
  texte: "Vous attendez en retenant votre souffle. Bientôt, une rangée d'hommes au visage hagard passe devant vous, encadrés par des brigands qui frappent ceux qui hésitent ou s'écartent de la file. Chacun de ces hommes reçoit l'ordre de pousser un chariot le long du tunnel. Quelques instants plus tard, ils sont hors de vue. Vous attendez encore, puis, lorsque vous estimez qu'il n'y a plus de danger, vous reprenez votre chemin dans le tunnel en prenant soin de vous dissimuler dans l'ombre. Enfin, vous arrivez au bout du souterrain et vous émergez dans la lumière du jour. Un peu plus loin sur votre gauche, vous apercevez une forêt touffue. La voie ferrée mène à un portique dressé au-dessus d'un entassement de minerai. C'est là que se trouvent à présent les hommes et les Gardes que vous avez vus passer. Vous vous précipitez en direction des arbres que vous parvenez à atteindre sans avoir été repéré.",
  choix: [
    { texte: "Vous vous arrêtez un instant pour reprendre votre souffle, puis vous poursuivez votre route dans la forêt en direction de Ruanon", vers: "200" }
  ]
  },
  {
  id: "287",
  texte: "A peine avez-vous fait une dizaine de pas, que la vieille femme se laisse tomber sur le sol. « Une embuscade ! » s'écrie aussitôt l'un des patrouilleurs. C'est le dernier mot qu'il prononcera jamais. Un disque de métal aux bords acérés, jeté d'un balcon, vient en effet de s'enfoncer profondément dans sa poitrine. Soudain, la taverne est envahie de brigands qui font irruption par les portes et les fenêtres. Poussant des cris de guerre aux accents barbares, trois brigands se précipitent sur vous. Vous dégainez votre arme et vous frappez, tranchant d'un seul coup la tête de deux des brigands à la peau sombre. Le troisième est sur vous avant même que les corps de ses camarades se soient effondrés sur le sol. Il vous faut combattre ce Guerrier Pillard.",
  suite: "75",
  combat: { nom: "Guerrier Pillard", habilete: 17, endurance: 27 }
  },
  {
  id: "288",
  texte: "Vous postez trois hommes en sentinelle pour garder les chevaux et vous pénétrez dans la mine en compagnie de quatre patrouilleurs. Il règne une obscurité totale dans la galerie, mais vous remarquez bientôt que des Torches éteintes sont accrochées aux murs humides, à intervalles réguliers, et vous prenez chacun une torche que vous allumez avant de poursuivre votre chemin. Les traces de pas sont clairement visibles sur le sol boueux. Elles mènent à un endroit où le tunnel s'est éboulé. Un amas de terre se dresse sur le chemin, laissant apparaître une étroite ouverture entre son sommet et le plafond. Les traces de pas montent le long de ce tas de terre.",
  choix: [
    { texte: "Si vous souhaitez escalader à votre tour le monticule et vous glisser par l'étroite ouverture ménagée entre son sommet et le plafond", vers: "254" },
    { texte: "Si vous préférez interrompre les recherches et retourner à l'entrée du tunnel", vers: "187" }
  ]
  },
  {
  id: "289",
  texte: "Vous suivez le capitaine Gayal qui descend quatre à quatre le large escalier de la tour de guet, puis se précipite vers la barricade. Un grondement sonore, comme un lointain tonnerre, retentit alentour. La cavalerie ennemie envahit la plaine de tous côtés et se prépare à l'attaque. Des colonnes de soldats à pied, revêtus d'armures écarlates, avancent parmi les chevaux en poussant devant eux une foule de civils terrifiés. « Ce sont des habitants de Ruanon ! s'écrie le capitaine Gayal, la main en visière au-dessus des yeux. Ce chien de Barraka s'en sert comme boucliers ! Autour de vous, les hommes du capitaine Gayal ont tendu leurs arcs, attendant le signal de tirer. Le capitaine cependant n'ose pas en donner l'ordre. Soudain, une catapulte projette dans les airs un énorme rocher noir en direction de la barricade. Horrifié, vous le voyez prendre feu et se désintégrer en déversant une pluie d'huile enflammée sur les soldats du Sommerlund. Ces derniers ne peuvent s'enfuir et nombre d'entre eux sont gravement brûlés avant qu'on ait pu éteindre les flammes. Un cri de guerre retentit alors dans les rangs ennemis. C'est le signal de l'attaque. Les habitants de Ruanon sont écartés et piétinés par les hordes de Guerriers écarlates qui se portent à l'assaut de la barricade. La pluie d'huile enflammée a dispersé les hommes du capitaine Gayal, et la barricade n'est plus que sommairement défendue. Un instant plus tard, vous entendez le capitaine crier votre nom. Sa cape et sa tunique sont en feu et il vous appelle au secours.",
  choix: [
    { texte: "Si vous souhaitez aider le capitaine", vers: "5" },
    { texte: "Si vous préférez rassembler les soldats avant que l'ennemi ait atteint la barricade", vers: "86" },
    { texte: "Enfin, si vous avez atteint le rang Kaï de Guerrier (ce qui signifie que vous maîtrisez huit Disciplines Kaï)", vers: "255" }
  ]
  },
  {
  id: "290",
  texte: "Les ruines sont envahies de racines et de mauvaises herbes, mais vous parvenez cependant à distinguer les contours du sanctuaire qui constitue le centre du temple. L'immense dôme de marbre est toujours intact et vous offrira un excellent abri. Tandis que vous attachez votre cheval à un arbre rabougri, vous apercevez deux hommes vêtus de longues capes noires, cachés sous le dôme. Vous leur donnez aussitôt l'ordre de sortir du sanctuaire et de décliner leur identité, mais ni l'un ni l'autre ne vous répond ni ne bouge.",
  choix: [
    { texte: "Si vous souhaitez faire signe à vos hommes d'attaquer ces deux étrangers", vers: "44" },
    { texte: "Si vous préférez essayer de les capturer vivants", vers: "102" },
    { texte: "Enfin, si vous décidez plutôt de remettre votre arme au fourreau et de vous approcher d'eux la main tendue en signe d'amitié", vers: "78" }
  ]
  },
  {
  id: "291",
  texte: "Le passage mène à une porte cloutée de fer. Collant votre oreille contre le panneau de bois brut, vous percevez des voix de l'autre côté.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Camouflage", vers: "172", requis: {"discipline":"camouflage"} },
    { texte: "Sinon, vous pouvez dégainer votre arme, ouvrir la porte et", vers: "93" },
    { texte: "Vous avez également la possibilité de revenir sur vos pas dans la galerie pour suivre la voie ferrée dans le tunnel orientée à l'ouest", vers: "55" }
  ]
  },
  {
  id: "292",
  texte: "Vous dégainez votre arme juste à temps pour éviter la catastrophe. Le disque mortel vient en effet frapper de plein fouet le tranchant du Glaive d'Or et se brise en deux moitiés qui vous frôlent les joues dans un sifflement terrifiant. Vous vous éloignez ensuite du chariot en courant le long d'un sentier étroit qui mène à une forêt dense. Lorsque vous atteignez les arbres, vous entendez les cris des brigands derrière vous.",
  choix: [
    { texte: "Si vous souhaitez courir tout droit en direction du sud", vers: "123" },
    { texte: "Si vous préférez changer de direction et aller vers l'ouest", vers: "169" }
  ]
  },
  {
  id: "293",
  texte: "Vous suivez le chemin qui s'enfonce dans les collines boisées. Bientôt vous découvrez des traces de sabots parfaitement visibles dans la terre meuble du sentier.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "18", requis: {"discipline":"orientation"} },
    { texte: "Sinon", vers: "150" }
  ]
  },
  {
  id: "294",
  texte: "Le chariot s'arrête sous un portique et les hommes au visage hagard sont reconduits dans le tunnel. Il vous faut attendre une heure avant que l'entrée du souterrain soit à nouveau libre. Vous vous glissez alors hors du chariot, et vous courez le long de la voie ferrée. Vous apercevez d'un côté une forêt touffue et de l'autre une profonde excavation aux parois abruptes. Vous vous précipitez vers l'abri des arbres en comprenant à ce moment que l'étranger au visage ruisselant de sueur avait essayé de vous aider à fuir.",
  choix: [
    { texte: "Vous lui adressez de silencieux remerciements, et vous poursuivez votre chemin en direction de Ruanon", vers: "200" }
  ]
  },
  {
  id: "295",
  texte: "Le Guerrier Pillard est étendu mort à vos pieds. « Vive le Sommerlund ! » vous écriez-vous, tandis que le mur de boucliers ennemis vacille et s'effondre. Vos hommes reprennent en chœur ce cri de guerre et s'élancent sur les brigands. Les épées gémissent en s'entrechoquant comme si le métal criait de douleur à l'instar des hommes qui le brandissent. Le combat est bref et sans merci. Les brigands jettent bientôt à terre leurs boucliers et s'enfuient de la taverne en se fondant dans l'obscurité humide de pluie. Vous rassemblez vos patrouilleurs et vous vous précipitez vers les écuries ; votre cœur se met alors à battre plus vite en constatant que les portes en sont grandes ouvertes.",
  choix: [
    { texte: "Vous craignez le pire", vers: "345" }
  ]
  },
  {
  id: "296",
  texte: "Si vous possédez le Glaive de Sommer, rendez-vous au 325. Si vous disposez d'un flacon d'Eau Bénite, rendez-vous au 283. Si vous n'avez ni l'un ni l'autre, rendez-vous au 274.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "325" },
    { texte: "Si vous disposez d'un flacon d'Eau Bénite", vers: "283" },
    { texte: "Si vous n'avez ni l'un ni l'autre", vers: "274" }
  ]
  },
  {
  id: "297",
  texte: "Vers midi, vous êtes forcé de vous arrêter. Vous avez en effet atteint le sommet d'une colline à partir de laquelle la grand-route descend peu à peu en direction d'un large pont de bois. C'est le pont de Ruanon. Vous reconnaissez ses gros piliers noirs et les eaux sombres de la rivière Xane qui coule au-dessous. De l'autre côté du pont se dessinent les ruines noircies par le feu d'une auberge et les silhouettes caractéristiques de brigands à cheval. A l'entrée du pont, un poteau de signalisation blanc indique : « Ruanon 20 kilomètres ». Vous êtes conscient qu'il serait suicidaire d'essayer de franchir le pont. Les brigands disposent en effet de lourdes arbalètes accrochées à leur selle.",
  choix: [
    { texte: "Si vous souhaitez traverser la rivière en amont, c'est-à-dire vers l'ouest", vers: "113" },
    { texte: "Si vous préférez essayer de traverser cette rivière en aval, c'est-à-dire vers l'est", vers: "252" }
  ]
  },
  {
  id: "298",
  texte: "Les Démons des Tunnels qui poussent de grands cris en se recroquevillant sous vos coups disparaissent peu à peu. Incrédule, vous secouez la tête et vous vous frottez les yeux avant de vous rendre à l'évidence : il ne reste plus la moindre trace de ces créatures, pas le moindre cadavre, en dépit des coups mortels que vous leur avez portés. Vous comprenez alors ce qui s'est passé. Les spores lâchées par les champignons ont provoqué en vous une hallucination. Vos adversaires n'existaient que dans votre tête. Malheureusement, tous les points d'ENDURANCE que vous avez perdus au cours de ce combat imaginaire doivent bel et bien être retranchés de votre total. En vous débattant avec frénésie, vous vous êtes en effet heurté à plusieurs reprises contre les aspérités pointues des parois du tunnel, vous infligeant ainsi de véritables blessures.",
  choix: [
    { texte: "Vous rengainez à présent votre arme et vous vous remettez en chemin d'un pas chancelant, en vous éloignant le plus vite possible de ces champignons maléfiques", vers: "185" }
  ]
  },
  {
  id: "299",
  texte: "Vous disposez vos hommes côte à côte devant l'entrée de la mine. Leurs boucliers forment un mur de bois et d'acier qui détourne les flèches tirées par vos ennemis. Les brigands sautent bientôt des arbres et abandonnent leurs arcs pour dégainer leurs longues épées à la lame recourbée. Plusieurs d'entre eux trébuchent et tombent à terre, mais leur chef les pousse en avant en leur donnant de grands coups dans le dos du plat de sa hache de guerre. L'homme est une brute repoussante vêtue d'une lourde cotte de mailles en cuivre. Les premiers brigands se jettent sur le mur de boucliers, en poussant des cris de guerre assourdissants. Un déluge de coups s'abat sur vos hommes qui tiennent bon, cependant, se défendant vaillamment contre l'ennemi qui tente de les anéantir. La première vague de brigands recule en chancelant. Ils ont les mains crispées sur leurs blessures, tandis qu'une douzaine de leurs camarades restent étendus morts à vos pieds. Aucun de vos hommes n'est tombé. Quant à vous, à peine avez-vous pris le temps d'essuyer votre front éclaboussé de sang que le chef ennemi se rue sur vous en brandissant sa hache de guerre. A grands coups de son arme redoutable, il écarte les boucliers de vos hommes et vous attaque. Il vous est impossible de prendre la fuite. Vous devrez le combattre jusqu'à la mort de l'un de vous deux.",
  suite: "121",
  combat: { nom: "Chef Brigand", habilete: 19, endurance: 29 }
  },
  {
  id: "300",
  texte: "Un hurlement d'épouvante et de douleur retentit. Le tireur isolé s'abat sur le sol, sous le poids d'un Chien de Guerre qui vient de lui sauter à la gorge. D'autres molosses attirés par ses cris terrifiants se précipitent à leur tour, et l'homme est bientôt déchiqueté par les crocs puissants des créatures sanguinaires. Levant le regard, vous voyez un homme surgir de la barricade et courir vers vous. Il porte un bouclier dans une main et un arc dans l'autre. Vous le reconnaissez aussitôt : c'est le capitaine Gayal. Hors d'haleine, il parvient jusqu'à vous et tire une flèche de son carquois. Les Chiens de Guerre, lassés de leur victime, cherchent à présent une autre proie et se dirigent vers vous. Le capitaine vise et tire, puis prend une autre flèche dès qu'il a relâché la corde de son arc. Les Chiens de Guerre s'effondrent sur le sol, tout autour de vous, transpercés par les projectiles mortels du capitaine Gayal. Ce dernier vous empoigne par le bras et vous hisse sur son épaule d'un geste bref. Il vous emporte ensuite vers la barricade. Des soldats du Sommerlund courent vers lui pour l'aider, mais les archers ennemis sont maintenant à portée de tir et vos compatriotes sont contraints de battre en retraite sous une pluie de flèches. Les projectiles écarlates sifflent de tous côtés. Finalement, vous atteignez la barricade. Des soldats écartent un chariot, et le capitaine Gayal franchit la brèche en vous portant toujours sur son épaule.",
  choix: [
    { texte: "Proche de l'épuisement, il chancelle, et ses hommes se précipitent sur lui pour le soutenir avant qu'il ne s'effondre sur le sol", vers: "341" }
  ]
  },
  {
  id: "301",
  texte: "Vous passez bientôt devant des écuries bâties au milieu d'un vaste enclos. De nombreux chevaux sont rassemblés là et chacun d'eux est sellé.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "106", requis: {"discipline":"communication-animale"} },
    { texte: "Dans le cas contraire", vers: "236" }
  ]
  },
  {
  id: "302",
  texte: "Le coffre n'est pas fermé à clé. Ce qui vient d'arriver à vos hommes vous rend cependant très prudent, et vous décidez de ne pas prendre de risques. Vous tenant à l'écart du coffre, vous soulevez le couvercle de la pointe de votre arme et vous le rabattez d'un coup sec. Vous attendez un instant en retenant votre souffle, mais rien ne se produit. Le propriétaire du coffre estime sans doute que le piège aménagé dans le passage suffit à le protéger des voleurs. Le coffre contient nombre d'objets de valeur: des assiettes et des coupes d'or incrustées de pierreries, des colliers de turquoise, des perles, des statuettes de jade et une pierre précieuse d'un grand prix. Vous contemplez ces richesses avec émerveillement, mais vous décidez de n'en emporter aucune. Elles seraient trop lourdes, en effet, et inutiles à votre mission. Vous remarquez alors, sous les assiettes d'or, un sac de cuir. Vous le retirez du coffre et vous reconnaissez aussitôt sa forme caractéristique ; il s'agit d'un sac d'herboriste qui contient les objets suivants : — 2 flacons de Potion de Laumspur : chaque dose vous permet de regagner 4 points d'ENDURANCE ; — 1 fiole de Potion d'Aléther : elle vous permet d'augmenter de 2 points votre HABILETÉ au cours d'un combat (et un seul) ; - 1 flacon d'Eau Bénite. Si vous souhaitez conserver l'un ou l'autre de ces objets, inscrivez-les sur votre Feuille d'Aventure.",
  suite: "131",
  choix: [
    { texte: "Dirigez-vous à présent vers la porte située de l'autre côté", vers: "131" }
  ],
  effets: { objets: [{"id":"potion-laumspur","quantity":2},{"id":"potion-alether"},{"id":"eau-benite"}] }
  },
  {
  id: "303",
  texte: "Le pont s'écrase contre la paroi. Vos genoux et les jointures de vos doigts sont douloureusement meurtris, mais vous êtes toujours vivant et restez agrippé à une planche de la passerelle. Le choc vous a fait perdre 2 points d'ENDURANCE. Les planches du pont constituent une excellente échelle que vous vous hâtez d'escalader pour sortir du puits de mine. Vos ennemis poussent alors une série de jurons retentissants : ils sont en effet bloqués de l'autre côté du puits et incapables désormais de vous poursuivre.",
  choix: [
    { texte: "Avec un sourire ironique, vous leur faites de la main un signe d'adieu puis vous pénétrez dans le tunnel orienté à l'ouest", vers: "348" }
  ]
  },
  {
  id: "304",
  texte: "Un seul coup de votre arme suffit à sectionner le tentacule qui emprisonne le pied du patrouilleur. L'homme vous remercie avec chaleur, puis tranche à son tour l'extrémité d'un autre tentacule gluant qui émerge de l'eau boueuse. Soudain, un craquement terrifiant retentit. Un troisième tentacule vient de fracasser le fond du bateau en projetant l'embarcation dans les airs. Vous êtes alors précipité dans l'eau glacée. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "47", texte: "Si vous tirez un chiffre de 0 à 4," },
        "5-9": { vers: "234", texte: "Si vous tirez un chiffre de 5 à 9," }
      }
      }
  },
  {
  id: "305",
  texte: "Un plan audacieux vous vient à l'esprit. Vous prenez dans votre poche le Médaillon d'Onyx et vous avancez d'un pas résolu vers les brigands. Ils sont si occupés à bavarder qu'ils ne vous remarquent même pas. Lorsque soudain vous apparaissez devant eux, ils sursautent. Jouant alors votre rôle à la perfection, vous les rappelez sèchement à l'ordre, vous déclarant scandalisé par la désinvolture de leur tenue et de leur démarche. Vous les menacez de faire un rapport à Barraka lui-même pour lui signaler leur comportement. Dès qu'ils aperçoivent le Médaillon d'Onyx, ils se redressent comme un seul homme et s'alignent au garde-à-vous, prêts à obéir à vos ordres. D'un ton de commandement sans réplique, vous les envoyez alors en direction de la forêt en leur ordonnant de marcher au pas cadencé.",
  choix: [
    { texte: "Tandis qu'ils s'éloignent, vous courez dans l'autre direction pour mettre le plus de distance possible entre eux et vous, avant qu'ils ne s'aperçoivent de la supercherie", vers: "204" }
  ]
  },
  {
  id: "306",
  texte: "Vos hommes poussent la porte à l'aide de leurs épées ci entrent aussitôt. Vous entendez alors des bruits de voix étouffées et un patrouilleur réapparaît à l'entrée.",
  choix: [
    { texte: "« Il n'y a aucun danger, Seigneur Kaï », dit-il en s'écartant pour vous permettre de pénétrer à votre tour dans la masure", vers: "84" }
  ]
  },
  {
  id: "307",
  texte: "Des groupes de brigands sortent de la forêt, fouettés par des sergents furieux qu'ils vous aient laissé échapper. Cette vision vous incite à hâter le pas. Vous parcourez les cent premiers mètres sans difficulté. C'est alors que des flèches commencent à tomber autour de vous. Vous vous baissez aussitôt et vous courez en zigzag, constituant ainsi une cible difficile à atteindre. Peu à peu, le nombre de flèches diminue sans que vous ayez été touché une seule fois. Les vains efforts des archers vous font sourire, mais votre confiance en vous-même est bientôt ébranlée par un nouveau péril : une meute de Chiens de Guerre vient en effet de surgir de la forêt à votre droite. De toute évidence, ils sont assoiffés de sang et personne n'est là pour les retenir. Vous êtes à moins de 500 mètres de Ruanon, mais les molosses se rapprochent à une allure inquiétante.",
  choix: [
    { texte: "Si vous souhaitez essayer de courir plus vite dans l'espoir de les distancer", vers: "225" },
    { texte: "Si vous préférez vous arrêter et les combattre", vers: "36" }
  ]
  },
  {
  id: "308",
  texte: "Vous tournez la clé dans la serrure et vous poussez la porte de fer. Aussitôt, un sifflement sonore retentit comme un jet de vapeur s'échappant d'un geyser. Dur créature aux allures de chat surgit alors de l'obs» tir Me i bondit sur vous en vous projetant à terre. Les yeux de l'animal brillent d'une lueur verte et son haleine fétide vous brûle le visage : c'est un Elix ! Tandis que vous essayez de repousser la créature à la gueule hérissée de dents pointues, plusieurs autres de ses congénères sautent sur vos hommes. Vous ne pouvez pas prendre la fuite et il vous faut combattre l'animal jusqu'à la mort de l'un de vous deux.",
  suite: "127",
  combat: { nom: "Élix", habilete: 17, endurance: 30 }
  },
  {
  id: "309",
  texte: "Vous suivez le tunnel pendant plus de trois heures avant d'arriver dans une vaste salle, où aboutissent plusieurs autres souterrains situés à différents niveaux. De larges rampes de pierre relient chaque tunnel à celui qui se trouve immédiatement au-dessus ou au-dessous. Quatre étages plus bas, des équipes de mineurs poussent des chariots chargés de minerai. Des Gardes vêtus d'armures écarlates les surveillent en les incitant à travailler plus vite à grands coups de fouet et en hurlant des jurons. Le tunnel dans lequel vous vous trouvez est situé au niveau le plus élevé, et vous ne pouvez poursuivre votre chemin qu'en descendant une rampe menant à un tunnel inférieur. Mais, à votre grande consternation, vous constatez que chacune des rampes est gardée par des hommes en armes. Avançant avec d'infinies précautions vous jetez un coup d'œil par-dessus la rampe. Deux Gardes sont assis au sommet d'une autre rampe devant l'entrée du tunnel qui se trouve juste au-dessous. Ils éclatent de rire en se donnant de grandes tapes dans le dos et en montrant du doigt une bouteille de vin vide posée à leurs pieds. Après les avoir observés pendant quelques minutes, ils vous semblent trop ivres pour faire attention à vous. Vous décidez donc de tenter votre chance en vous précipitant vers le tunnel dans l'espoir qu'ils ne vous verront pas. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Camouflage, vous ajouterez 4 à ce chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-7": { vers: "138", texte: "Si vous obtenez un total de 0 à 7," },
        "8-13": { vers: "244", texte: "de 8 à 13," }
      }
      }
  },
  {
  id: "310",
  texte: "Vous êtes à moins de 10 mètres de la tour de guet lorsque la pointe d'une lance vous projette à terre. Vous roulez de côté juste à temps pour éviter un coup mortel, puis vous vous relevez d'un bond face à votre agresseur. C'est un Guerrier au visage dur, les yeux noirs comme du charbon, son armure éclaboussée par le sang de son cheval mort. Il lève à nouveau sa lance et s'apprête à vous frapper en pleine poitrine. Vous n'avez aucune possibilité de fuir, et il vous faut combattre cet adversaire jusqu'à la mort de l'un de vous deux.",
  suite: "24",
  combat: { nom: "Guerrier Vassagonien", habilete: 18, endurance: 25 }
  },
  {
  id: "311",
  texte: "Trois soldats du Sommerlund se précipitent pour vous venir en aide. Abattant leurs épées sur les Chiens de Guerre, ils parviennent à tuer en quelques instants les monstrueuses créatures. Vous vous relevez tant bien que mal en essayant de faire le point de la situation, tandis que la bataille fait rage autour de vous. Les soldats du Sommerlund contrôlent toujours la barricade, se rassemblant en groupes devant les brèches pour empêcher l'ennemi de s'infiltrer. Des lances et des flèches volent en tous sens, s'enfonçant dans le métal, le bois, et dans la chair des combattants. Des hommes tombent de leurs chevaux : leurs montures hennissent et s'emballent ; le sol est jonché de cadavres et de soldats blessés. Les Chiens de Guerre ont été repoussés vers leurs maîtres armés de lances qui s'approchent à présent.derrière un mur de boucliers. A votre droite, un brigand essaie de sauter la barricade à cheval. Mais l'animal est blessé et à l'agonie : il lui est impossible de bondir. Son cavalier est projeté en avant et tombe derrière vous.",
  choix: [
    { texte: "Si vous souhaitez attaquer ce Guerrier Pillard", vers: "90" },
    { texte: "Si vous préférez rassembler les soldats du Sommerlund pour repousser l'avance des lanciers", vers: "3" }
  ]
  },
  {
  id: "312",
  texte: "Tout autour de vous, les ruines résonnent du fracas des armes et des cris de guerre. Ces cavaliers vêtus d'armures ne sont pas des brigands ordinaires ; ils combattent avec une discipline et une habileté dont ne sont pas coutumiers les hors-la-loi du Pays Sauvage. Vous enjambez le cadavre du Guerrier et vous rassemblez vos hommes. L'ennemi a encerclé vos chevaux et il vous faut agir vite si vous voulez l'empêcher de vous les voler. Vous menez une charge parmi les ruines, et vous repoussez vos agresseurs qui s'enfuient en déroute dans l'obscurité. Cependant, lorsque vous atteignez l'extrémité du temple, vous vous apercevez qu'il ne vous reste plus que onze chevaux. Les autres ont disparu. Après avoir mûrement réfléchi, vous décidez de prendre dix patrouilleurs avec vous pour continuer votre expédition et de renvoyer les autres à Holmgard avec mission de rapporter au roi ce qui s'est passé. Tandis que la faible lueur de l'aube se répand peu à peu dans le ciel, vos dix compagnons et vous-même adressez un triste adieu à ceux qui vont devoir retourner à pied dans la capitale pour avertir le monarque. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-2": { vers: "120", texte: "Si vous tirez un chiffre de 0 à 2" },
        "3-9": { vers: "51", texte: "de 3 à 9," }
      }
      }
  },
  {
  id: "313",
  texte: "Vous posez les mains sur le bras du patrouilleur blessé en vous efforçant de remettre en place ses os fracassés. Vous le pansez ensuite à l'aide de lambeaux d'étoffe arrachés à sa tunique. Pendant ce temps, l'autre patrouilleur a réussi à se libérer et à trancher deux autres tentacules gluants accrochés à la coque brisée du bateau. Il saisit maintenant les avirons et rame frénétiquement en direction de la rive opposée.",
  choix: [
    { texte: "A peine, cependant, a-t-il plongé les rames dans l'eau qu'un craquement terrifiant retentit", vers: "96" }
  ]
  },
  {
  id: "314",
  texte: "Des groupes de brigands patrouillent dans la forêt, mais sans manifester de zèle excessif dans l'accomplissement de leur tâche, et vous parvenez à les éviter sans difficulté. Vous découvrez alors, par hasard, une petite cabane en rondins cachée au fond des bois. La flamme d'une chandelle vacille à la fenêtre et la porte est entrouverte.",
  choix: [
    { texte: "Si vous souhaitez entrer dans la cabane", vers: "53" },
    { texte: "Si vous préférez vous en abstenir, vous poursuivrez votre chemin", vers: "258" }
  ]
  },
  {
  id: "315",
  texte: "A la lueur vacillante de votre Torche, vous remarquez que le tunnel est étayé par des piliers et des poutres. Les murs suintent d'humidité, et une étroite rigole d'eau teintée par le minerai coule sur le sol. Vous parvenez bientôt à une bifurcation.",
  choix: [
    { texte: "Si vous souhaitez aller à gauche", vers: "269" },
    { texte: "Si vous préférez aller à droite", vers: "145" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "48", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "316",
  texte: "Vous êtes arrivé à mi-chemin, lorsqu'un de vos hommes glisse soudain et se trouve emporté par le courant torrentiel de la rivière. Ses cris désespérés alertent les brigands et, tout à coup, un Guerrier Pillard surgit au sommet du gros rocher derrière lequel vous vous cachiez. Il pousse un hurlement et vous porte un coup de lance. Pendant toute la durée de ce combat, vous devrez réduire de 2 points votre total d'HABILETÉ en raison de votre position désavantagée. Le brigand se trouve en effet au-dessus de vous, et vous vous tenez sur un sol humide et glissant.",
  choix: [
    { texte: "Si vous remportez la victoire", vers: "146" },
    { texte: "Prendre la fuite en plongeant dans la rivière Xane", vers: "31" }
  ],
  combat: { nom: "Guerrier Pillard", habilete: 16, endurance: 26, bonusJoueur: -2, description: "Position désavantageuse : -2 Habileté pendant tout le combat." }
  },
  {
  id: "317",
  texte: "Vous concentrez vos pouvoirs sur une saillie d'argile qui surplombe le puits, de l'autre côté de la salle. Quelques secondes plus tard, le bloc se détache dans un craquement et tombe au fond du trou béant. Surpris par ce bruit soudain, le Garde quitte son poste pour aller voir de quoi il retourne.",
  choix: [
    { texte: "Sans hésiter un instant, vous vous précipitez vers le pont qui n'est plus surveillé et vous le franchissez, disparaissant dans le tunnel situé de l'autre côté", vers: "348" }
  ]
  },
  {
  id: "318",
  texte: "Oren Vanalund est le quinzième baron de Ruanon. C'est un noble guerrier de lignée royale, cinquième dans l'ordre de succession au trône du Sommerlund. Ce Seigneur de la Guerre, vaillant et orgueilleux d'ordinaire, est à présent prostré sur le sol de pierre froide de cette salle, l'œil rouge et la voix gémissante. On dirait un chien peureux. « Il a tout perdu, dit le capitaine Gayal à voix basse. Barraka a détruit son château, saccagé ses terres et sa ville, massacré sa famille. Ses fils sont morts et sa fille unique est retenue prisonnière par Barraka lui-même. J'ai bien peur que ces terribles épreuves ne lui aient fait perdre la raison. » L'homme pitoyable affalé devant vous lève alors son visage baigné de larmes et marmonnée d'une faible voix deux étranges vers : Quand mourra sur l'autel la vierge aux cheveux blonds, Des gorges de Maaken les morts se lèveront.",
  choix: [
    { texte: "Si vous possédez un rouleau de parchemin", vers: "279" },
    { texte: "Sinon", vers: "57" }
  ]
  },
  {
  id: "319",
  texte: "Le Repas est délicieux. Vous mangez votre content, puis vous vous préparez à une bonne nuit de sommeil. Lorsque l'aube se lève, vos hommes et vous-même faites vos adieux aux troubadours, et vous poursuivez votre voyage en direction de Ruanon. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "25", texte: "Si vous tirez un chiffre de 0 à 4," },
        "5-9": { vers: "171", texte: "de 5 à 9," }
      }
      }
  },
  {
  id: "320",
  texte: "Votre attaque prend les deux Gardes complètement au dépourvu. Ils ont à peine eu le temps de tirer leur épée que vos hommes les projettent tous deux à terre, leurs armes levées au-dessus de leur tête. « Faut-il les exécuter à l'instant, Seigneur Kaï ? » demande un patrouilleur en appuyant la pointe de son épée sur la gorge de l'un des gardes. « Non, répondez-vous, attachez-les plutôt, ils peuvent peut-être nous être utiles. »",
  choix: [
    { texte: "Si vous souhaitez fouiller les Gardes", vers: "268" },
    { texte: "Si vous préférez les interroger", vers: "76" }
  ]
  },
  {
  id: "321",
  texte: "La répugnante créature laisse échapper un hurlement de terreur et meurt devant vous, mais son énorme corps gluant tremble et se convulsé pendant encore plusieurs minutes. Vous attendez un bon moment avant de vous risquer à vous glisser vers le tunnel situé derrière le gigantesque cadavre. Il ne reste plus trace de vos hommes. Leurs corps déjà à demi digérés reposent dans les entrailles du Ver de Pierre.",
  choix: [
    { texte: "Saisi de nausée, vous vous hâtez de fuir ces lieux maléfiques", vers: "309" }
  ]
  },
  {
  id: "322",
  texte: "Vous éteignez votre Torche et vous vous pelotonnez sur le sol, sombrant très vite dans un profond sommeil. Lorsque vous vous réveillez, plusieurs heures plus tard, vous vous sentez tout à fait reposé et vous regagnez 2 points d'ENDURANCE. Vous rallumez votre Torche et vous constatez alors que la petite cabane bâtie contre le mur est remplie d'outils. Des Pioches, des Pelles et des brouettes sont entassées au fond. Si vous souhaitez prendre une Pioche ou une Pelle, notez-la sur votre Feuille d'Aventure dans la case objets contenus dans votre Sac à Dos. Étant donné la taille de ces outils, ils occupent chacun la place de deux objets normaux. Deux tunnels permettent de sortir de la salle, l'un orienté à l'ouest, l'autre au sud.",
  choix: [
    { texte: "Si vous souhaitez emprunter le tunnel qui mène vers l'ouest", vers: "54" },
    { texte: "Si vous préférez prendre celui orienté au sud", vers: "129" }
  ]
  },
  {
  id: "323",
  texte: "Vous lâchez la corde de votre arc ; la flèche siffle et vient s'enfoncer profondément dans l'épaule du chef des brigands. Vous l'entendez hurler de douleur mais, bien qu'il soit gravement blessé, il tente malgré tout de rassembler ses hommes. Vous vous penchez pour ramasser une autre flèche, mais vous constatez avec horreur que le carquois du soldat mort est vide. Relevant la tête, vous apercevez deux Guerriers vassagoniens qui ont mis pied à terre et escaladent la barricade en se dirigeant vers vous. Vous jetez votre arc et vous courez vers un grand tonneau d'eau défendu par un robuste sergent du Sommerlund. Autour de lui, le sol est jonché de cadavres ennemis. « Tirez sur le chef ! » ordonnez-vous en montrant l'officier blessé. Le sergent vise et tire aussitôt une flèche. Celle-ci décrit une courbe dans un ciel envahi de fumée et transperce le plastron étincelant du chef des brigands.",
  choix: [
    { texte: "Ses yeux cruels se brouillent et se ferment, puis il glisse à bas de son cheval, la flèche plantée dans le cœur", vers: "148" }
  ]
  },
  {
  id: "324",
  texte: "Vous avez faim et il vous faut prendre un Repas avant de vous endormir, sinon vous perdrez 3 points d'ENDURANCE. Vous dormez depuis environ deux heures, lorsque le son d'une cloche vous réveille brusquement. « Des brigands ! s'écrie le tenancier de la taverne. Ils sont entrés dans les écuries ! » Il vous faut réagir immédiatement, sinon vos ennemis vous voleront vos chevaux. Le tenancier vous indique qu'il existe deux moyens d'accéder aux écuries. Vous pouvez soit sortir par la porte et courir à l'extrémité du bâtiment, soit monter l'escalier jusqu'à un balcon du premier étage d'où vous pourrez sauter sur le toit de l'écurie.",
  choix: [
    { texte: "Si vous souhaitez passer par la porte", vers: "114" },
    { texte: "Si vous préférez sauter du balcon du premier étage", vers: "196" }
  ],
  effets: { repasObligatoire: true }
  },
  {
  id: "325",
  texte: "Lorsque vous dégainez le Glaive de Sommer, la plainte du vent retentit avec plus de force, comme animée d'une soudaine fureur. En voyant étinceler la lame d'or qui tua Vashna, Maître des Ténèbres, Barraka a un bref mouvement de recul. Il se reprend aussitôt, mais la menace de l'arme magique a quelque peu ébranlé la puissance de sa volonté et il ne pourra pas utiliser contre vous sa redoutable force mentale au cours du combat. Il reste cependant invulnérable à la Discipline Kaï de la Puissance Psychique. Il vous faut à présent affronter l'aristocrate renégat, armé de son cimeterre, en un combat sans merci qui ne s'achèvera que par la mort de l'un de vous deux.",
  suite: "350",
  combat: { nom: "Barraka", habilete: 25, endurance: 29, immunisePsychique: true }
  },
  {
  id: "326",
  texte: "Vous comprenez soudain que vous venez d'entrer dans un lointain secteur des mines de Maaken, en passant par une galerie désaffectée creusée dans les contreforts des montagnes. Pendant des centaines d'années, les filons qui abondent dans les profondeurs de la chaîne de Maaken ont représenté tout à la fois une bénédiction et un fléau pour des milliers d'hommes venus ici chercher fortune. Des prospecteurs y ont trouvé parfois des richesses qui dépassaient leurs espérances les plus insensées, tandis que d'autres ont péri sans laisser de traces dans un labyrinthe de souterrains glacés et humides. Si vous parveniez à rejoindre une partie de la mine encore en exploitation, vous pourriez atteindre Ruanon à travers son réseau de tunnels.",
  choix: [
    { texte: "Ruanon se trouvant au sud, vous décidez par conséquent d'emprunter le souterrain orienté au sud", vers: "101" }
  ]
  },
  {
  id: "327",
  texte: "Vous tirez l'épée de votre ceinture et vous l'offrez au capitaine. Une expression de surprise et de contentement apparaît sur son visage tandis qu'il examine la lame. «Je n'espérais plus jamais revoir ma fidèle épée, dit-il. C'est un bon présage pour la bataille qui nous attend. »",
  choix: [
    { texte: "Après vous avoir remercié, le capitaine remet son épée dans son fourreau qui, jusqu'alors, pendait vide à son côté", vers: "289" }
  ]
  },
  {
  id: "328",
  texte: "Lorsque vous parvenez au sommet du monticule, un spectacle sinistre s'offre à vos yeux. Des cadavres d'hommes et de chevaux jonchent une vallée peu profonde qui s'étend devant vous. Les corbeaux sont en train de déchiqueter leurs restes, ne laissant plus que des ossements nus. Vos patrouilleurs ne peuvent retenir des exclamations horrifiées lorsqu'ils reconnaissent les armures et les uniformes en lambeaux dont sont encore vêtus certains de ces squelettes. Ces hommes, en effet, étaient des soldats de la cavalerie royale du Sommerlund. Sans doute sont-ils morts en livrant bataille, car des cadavres de Guerriers Pillards sont également étendus à leurs côtés. Quarante vaillants soldats, c'està-dire presque la moitié de l'escadron qui a quitté Holmgard il y a un mois, reposent ainsi devant vous. Le cœur lourd, vos patrouilleurs entreprennent alors la triste tâche de leur offrir une sépulture décente.",
  choix: [
    { texte: "Une fois cette besogne accomplie, vous quittez cette vallée de la mort en n'éprouvant qu'un seul réconfort : le capitaine Gayal ne faisait pas partie des cadavres que vous avez enterrés", vers: "120" }
  ]
  },
  {
  id: "329",
  titre: "Mort — §329",
  texte: "L'eau de la rivière vous emplit les oreilles, les yeux, le nez. Dans votre quête désespérée d'une bouffée d'oxygène, vous êtes pris d'une quinte de toux incontrôlable. Aveuglé, vous ne voyez pas l'énorme rocher qui se dresse devant vous. Avec un craquement sinistre, votre crâne vient se fracasser contre la surface de pierre et vous sombrez à jamais dans les eaux torrentielles. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §329"
  },
  {
  id: "330",
  texte: "Aux premières lueurs de l'aube, vous vous préparez à pénétrer dans la vallée. La grand-route est enveloppée de brume, et bientôt la forêt de Ruanon s'épaissit de part et d'autre. Un enchevêtrement d'arbres aux troncs gris, de toutes formes et de toutes tailles borde les bas-côtés. Après avoir chevauché quelques minutes, vous découvrez, au bord de la route, la carcasse d'un chariot calciné. Derrière, un sentier s'enfonce dans les collines en direction de l'est.",
  choix: [
    { texte: "Si vous souhaitez examiner les débris du chariot", vers: "38" },
    { texte: "Si vous préférez ne pas y prêter attention et poursuivre votre chemin le long de la grandroute", vers: "175" },
    { texte: "Enfin, s'il vous semble plus opportun d'explorer le sentier qui monte dans les collines", vers: "293" }
  ]
  },
  {
  id: "331",
  texte: "Vous découvrez bientôt un puits de mine qui descend verticalement dans le flanc de la colline. L'entrée en est partiellement dissimulée par des buissons d'épines que vos hommes se hâtent de dégager. Vous remarquez alors une échelle fixée à la paroi du puits. Il s'agit là sans doute d'une issue de secours des mines de Maaken qui sillonnent les profondeurs des contreforts de la chaîne. Si vous parveniez à découvrir l'une des galeries principales de ces mines, il vous serait alors possible de rejoindre Ruanon par les souterrains. Vous vous penchez au bord du puits et vous scrutez l'obscurité au-dessous. Une telle odeur d'humidité et de pourriture s'échappe du trou que vous décidez d'envoyer le plus léger de vos hommes essayer l'échelle pour vérifier si elle est encore solide. Tout semble aller pour le mieux : votre éclaireur, en effet, atteint bientôt l'entrée d'un tunnel situé au fond du puits et vous crie de le suivre. Ce tunnel mène à une salle de forme ovale grossièrement taillée dans la roche. Un étrange liquide gluant brille sur le sol.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "41", requis: {"discipline":"communication-animale"} },
    { texte: "Sinon, vous chercherez une issue", vers: "276" }
  ]
  },
  {
  id: "332",
  texte: "Bien que les roulottes soient plongées dans l'obscurité, vos sens aigus de Seigneur Kaï vous révèlent la cachette de l'acteur.",
  choix: [
    { texte: "Vous montez alors les quelques marches qui mènent à la porte arrière d'une grande roulotte, vous poussez le panneau à l'aide de votre arme et vous entrez", vers: "222" }
  ]
  },
  {
  id: "333",
  texte: "Le cavalier se précipite sur vous au galop. Vous ne pourrez livrer qu'un seul Assaut car, dans son élan, il sera emporté à plusieurs mètres de distance après avoir essayé de vous frapper.",
  choix: [
    { texte: "Si vous perdez plus de points d'ENDURANCE que votre adversaire", vers: "209" },
    { texte: "Si votre ennemi perd plus de points d'ENDURANCE que vous", vers: "220" },
    { texte: "Si vous perdez tous deux le même nombre de points d'ENDURANCE", vers: "344" }
  ],
  combat: { nom: "Cavalier Vassagonien", habilete: 20, endurance: 28, description: "Un seul Assaut : comparez les pertes d'Endurance." }
  },
  {
  id: "334",
  titre: "Mort — §334",
  texte: "Lorsque vous heurtez la surface de l'eau, votre arme vous échappe. Saisi de panique, vous sentez alors des tentacules gluants s'enrouler autour de votre corps. Vous vous débattez pour essayer de vous dégager, mais vous êtes bientôt étouffé. Quelques bulles éclatant à la surface et une cape déchirée sont les derniers signes qui trahissent votre présence au fond de cette tombe aquatique. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §334"
  },
  {
  id: "335",
  texte: "Le tunnel aboutit bientôt à une vaste salle séparée en deux par un profond puits de mine. Une passerelle permet de le franchir, mais elle est gardée par un soldat vêtu d'une armure de cuir quelque peu fatiguée. Il est en train de tailler un bloc de bois et grommelle en se plaignant d'avoir sans cesse à accomplir de basses besognes. De l'autre côté de la salle, un tunnel s'ouvre dans le mur ouest. Pour l'atteindre il vous faudra franchir le pont.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Camouflage", vers: "35", requis: {"discipline":"camouflage"} },
    { texte: "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière", vers: "317", requis: {"discipline":"maitrise-matiere"} },
    { texte: "Si vous ne maîtrisez aucune de ces deux Disciplines, il vous faudra attaquer le Garde par surprise", vers: "147" }
  ]
  },
  {
  id: "336",
  texte: "La flèche siffle droit vers le brigand mais elle ricoche sur son plastron d'acier. Sans être le moins du monde ému par le choc, l'homme lance son javelot, transperçant le malheureux soldat. Vous vous apprêtez à tirer une autre flèche, lorsqu'une forme noire et menaçante apparaît soudain dans le ciel. Cette silhouette fond sur la tour au sommet de laquelle elle atterrit.",
  choix: [
    { texte: "Vous jetez alors votre arc, vous dégainez votre arme et vous montez les marches quatre à quatre pour aller voir de quoi il retourne", vers: "223" }
  ]
  },
  {
  id: "337",
  texte: "Bien que le feu ait complètement détruit toute inscription qui aurait pu se trouver sur le chariot, vous parvenez malgré tout à l'identifier: c'est l'un des chariots de la cavalerie du Sommerlund que le capitaine Gayal et ses hommes ont escorté il y a un mois. Il transportait un chargement de vivres dont il ne reste à présent que des tas de cendres.",
  choix: [
    { texte: "Après avoir examiné soigneusement les débris, vous remontez en selle et vous menez vos hommes en direction du sud, le long de la grand-route", vers: "297" }
  ]
  },
  {
  id: "338",
  texte: "Votre stratagème a réussi. En entendant le mot de passe, les Gardes vous laissent entrer dans la crypte.",
  choix: [
    { texte: "Ils referment ensuite la porte de pierre derrière vous et vous vous retrouvez dans un large couloir éclairé par des Torches et orienté à l'est", vers: "235" }
  ]
  },
  {
  id: "339",
  texte: "Bien que les deux étrangers semblent inoffensifs, vous préférez ne pas prendre de risques et vous décidez d'établir des tours de garde. Vous avez faim et il vous faut prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Après avoir mangé, vous vous préparez à passer une bonne nuit de sommeil", vers: "233" }
  ],
  effets: { repasObligatoire: true }
  },
  {
  id: "340",
  texte: "La tête commence à vous tourner et vos jambes deviennent lourdes en raison du manque d'oxygène.",
  suite: "32",
  choix: [
    { texte: "Vous perdez 2 points d'ENDURANCE", vers: "32" }
  ],
  effets: { endurance: -2 }
  },
  {
  id: "341",
  texte: "Un cercle de visages qui n'ont pas été rasés depuis plusieurs jours vous entoure. Un soldat vous soulève doucement la jambe, tandis qu'un autre arrache la flèche enfoncée dans votre cuisse. Son geste a été si rapide que vous n'avez pas même eu le temps de pousser un cri de douleur. « Vous avez eu de la chance, Seigneur Kaï, dit le soldat en appliquant des herbes de Laumspur sur votre membre blessé. La blessure est propre et elle n'a pas beaucoup saigné. » Vous perdez 4 points d'ENDURANCE, mais l'action rapide de cet homme vous a évité d'avoir la jambe infectée.",
  suite: "200",
  choix: [
    { texte: "Les soldats vous portent ensuite, le capitaine Gayal et vous-même, dans la tour de guet", vers: "116" }
  ],
  effets: { endurance: -4 }
  },
  {
  id: "342",
  texte: "Vous plongez tête la première dans les ténèbres. Le vent vous siffle aux oreilles. Serrant les dents, vous essayez de ne pas penser au choc terrible qui vous attend lorsque vous heurterez de plein fouet le fond rocheux du gouffre. Par chance cependant, une rivière souterraine coule au-dessous, et vous tombez dedans en vous enfonçant profondément dans l'eau glacée. Vous éprouvez un tel soulagement à être encore en vie que vous oubliez où vous vous trouvez. Vous prenez alors une profonde inspiration et l'eau pénètre aussitôt dans vos poumons. Essayant de surmonter la douleur qui vous déchire à présent la poitrine, vous vous apercevez que votre Sac à Dos vous entraîne vers le fond. Il faut vous en débarrasser à l'instant, sinon vous serez noyé. Lorsque vous remontez enfin à la surface, vous nagez tant bien que mal vers une rive de graviers sur laquelle vous vous échouez, toussant et haletant. Vous avez perdu votre Sac à Dos et tout ce qu'il contenait, mais vous êtes vivant et vous n'avez pas trop souffert.",
  suite: "219",
  choix: [
    { texte: "Apportez les modifications nécessaires à votre Feuille d'Aventure, puis", vers: "219" }
  ],
  effets: { perdreArme: "sac" }
  },
  {
  id: "343",
  texte: "Vous vous trouvez au milieu de la rivière souterraine lorsque l'eau noire se met soudain à frémir et à bouillonner. Vous vous cramponnez au bord du bateau en ordonnant à vos hommes de ramer de toutes leurs forces ; les remous menacent en effet de vous faire chavirer. Soudain, un tentacule verdâtre et répugnant jaillit à la surface. Il s'abat sur l'embarcation comme la lanière d'un fouet, fracassant le bois de la coque, et s'enroule autour de deux de vos hommes. Avant même que vous n'ayez pu dégainer votre arme, les deux malheureux sont emportés dans les profondeurs bouillonnantes. Un autre tentacule surgit aussitôt. Cette fois il ondule dans votre direction et essaie de vous frapper pour vous jeter par-dessus bord. Utilisez la Table de Hasard pour obtenir un chiffre. Si votre total actuel d'ENDURANCE est supérieur à 20, vous ajouterez 3 au chiffre que vous aurez tiré. Si votre total d'ENDURANCE est actuellement égal ou inférieur à 12, vous devrez ôter 2 points au chiffre donné par la Table.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Tentacule",
        texte: "Endurance >20 → +3, ≤12 → -2. 0-6 → 194, 7-12 → 61",
        branches: {
        "0-6": { vers: "194" },
        "7-12": { vers: "61" }
      }
      }
  },
  {
  id: "344",
  texte: "Votre coup a fait voler en éclats la lance du cavalier. Il tire alors sur ses rênes, se débarrasse de son arme brisée et dégaine un cimeterre. Avec un sourire diabolique qui découvre deux rangées de dents noires et pointues, il lance un cri de guerre en éperonnant son cheval qui se précipite à nouveau sur vous.",
  choix: [
    { texte: "Si vous avez atteint le rang Kaï d'Aspirant (ou un rang supérieur)", vers: "111", requis: {"drapeau":"rang_aspirant"} },
    { texte: "Sinon", vers: "43" }
  ]
  },
  {
  id: "345",
  texte: "En vérifiant les stalles de l'écurie, vous découvrez qu'il ne vous reste plus que onze chevaux ; les autres ont été volés par les brigands. Après avoir mûrement réfléchi, vous décidez de prendre dix hommes avec vous pour continuer votre mission et de renvoyer les autres patrouilleurs à Holmgard dès l'aube, pour faire un rapport détaillé de la situation. Lorsque le jour se lève, ils partent à pied en direction du nord et vous les regardez s'éloigner ; puis, lorsqu'ils ont disparu, vous vous tournez dans la direction opposée et vous poursuivez votre chemin en compagnie des dix patrouilleurs. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "51", texte: "Si vous tirez un chiffre de 0 à 6," },
        "7-9": { vers: "120", texte: "De 7 à 9," }
      }
      }
  },
  {
  id: "346",
  texte: "Vous montez l'escalier en colimaçon pendant plus de cinq minutes, avant d'atteindre un niveau supérieur où vous découvrez un tunnel orienté au sud. Vous avez parcouru moins de 100 mètres dans ce passage humide, lorsque vous apercevez un levier fixé dans le mur de gauche. Soudain, vous entendez des bruits de pas lointains : une patrouille de Gardes marche dans votre direction. Sans hésiter un instant, vous tirez le levier et un panneau de pierre s'ouvre aussitôt dans la paroi, révélant un passage secret. Vous vous hâtez d'y pénétrer pour éviter les Gardes. Dès qu'ils sont passés, vous essayez de ressortir, mais vous vous rendez compte alors qu'il est impossible de rouvrir le panneau de pierre de l'intérieur.",
  choix: [
    { texte: "Un sentiment de désespoir vous envahit, mais vous n'en poursuivez pas moins votre chemin, le long de ce tunnel caché", vers: "335" }
  ]
  },
  {
  id: "347",
  titre: "Mort — §347",
  texte: "Vous êtes arrivé au fond de la cave, lorsque la trappe se referme soudain. Vous entendez qu'on la verrouille, et vous vous mettez à frapper le panneau à coups redoublés, essayant désespérément de vous échapper. Ceux qui vous ont ainsi enfermé condamnent la trappe à l'aide d'un énorme tonneau. Des Gardes restent dans la cabane pour surveiller votre prison. Quatre jours se passent avant que la trappe ne s'ouvre à nouveau. C'est alors la main décharnée d'un squelette qui rabat le panneau de bois. Les morts de Maaken se sont réveillés. Votre mission a échoué.",
  fin: "mort",
  nomFin: "Fin tragique — §347"
  },
  {
  id: "348",
  texte: "Moins de 50 mètres plus loin, vohs apercevez un levier fixé à la paroi du tunnel. Votre instinct de Seigneur Kaï vous incite à la méfiance et, soupçonnant un traquenard, vous examinez soigneusement le sol pour essayer d'y découvrir un piège éventuel. Vous ne trouvez rien, cependant. Mais en levant les yeux, vous remarquez, entre deux poutres, la partie inférieure d'une large herse. Vous tirez le levier et la herse s'abat aussitôt, bloquant le tunnel derrière vous.",
  choix: [
    { texte: "Pour être certain que personne ne pourra vous suivre, vous brisez le levier à l'aide d'une grosse pierre avant de continuer votre chemin le long du souterrain", vers: "185" }
  ]
  },
  {
  id: "349",
  texte: "A en juger par l'usure du sol et des chariots de minerai, il semble que cette galerie desserve l'un des secteurs principaux de la mine. Un courant d'air frais souffle du tunnel orienté à l'ouest et vous sentez que vous ne devez plus être loin de la surface. Ruanon se trouve à l'ouest, dans la direction où mène le tunnel.",
  choix: [
    { texte: "Vous prenez alors une profonde inspiration, puis, émergeant de l'ombre, vous traversez silencieusement la galerie pour suivre la voie ferrée", vers: "55" }
  ]
  },
  {
  id: "350",
  titre: "Victoire — Le Gouffre Maudit refermé",
  texte: "Tandis que meurt Barraka, le vent se met à souffler plus fort et son mugissement s'intensifie, emplissant le temple d'une longue plainte désespérée. Vous sentez l'esprit maléfique et glacé de Vashna, Maître des Ténèbres, vous envelopper dans une ultime étreinte, mais il ne peut rien contre vous, le sacrifice a été empêché, et il est désormais condamné à se lamenter, en rêvant d'une victoire qui ne viendra jamais. Le Poignard de Vashna repose sur le sol noir du temple. Vous le ramassez et vous le glissez dans votre ceinture (inscrivez-le sur votre Feuille d'Aventure dans la case Objets Spéciaux.) La diabolique flamme bleue s'est éteinte et, aussi longtemps que vous resterez en possession de cette arme maudite, Vashna, Maître des Ténèbres, et ses légions de guerriers morts, demeureront prisonniers du gouffre maudit. Vous libérez la blonde Madelon, attachée sur l'autel, et vous la portez à l'air libre à travers les couloirs du temple. Lorsque vous émergez parmi les ruines que baigne la clarté de la pleine lune, un spectacle extraordinaire s'offre à vos yeux. Les Guerriers de Barraka fuient en tous sens la cité fantôme, poursuivis par une armée de cavaliers. Les flammes de leurs Torches et le clair de lune illuminent le soleil qui orne leurs tuniques. C'est l'armée du Sommerlund commandée par le roi Ulnar en personne qui leur donne ainsi la chasse. Vos compatriotes lancent des cris enthousiastes pour saluer votre courage, et leurs acclamations étouffent les longs gémissements qui s'élèvent des profondeurs du gouffre maudit. Une fois de plus, vous vous êtes révélé comme un authentique héros de votre patrie. Lorsque vous déposez Madelon dans les bras de son père, l'intensité de son bonheur vous donne le sentiment d'avoir pleinement accompli votre mission. En vérité, vous êtes plus que tout autre digne du titre de Seigneur Kaï. Vous avez triomphé à l'issue d'une quête périlleuse, mais vos exploits ne s'arrêteront pas ici. L'épopée du Loup Solitaire, dernier des Seigneurs Kaï, est loin en effet d'être terminée car un nouveau défi, tout aussi implacable que les précédents, vous attend à présent dans le cinquième volume de la série.",
  fin: "victoire",
  nomFin: "Le Poignard de Vashna et la libération de Madelon"
  }
];
