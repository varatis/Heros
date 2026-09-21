import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 04 — Le Gouffre Maudit
 * Paragraphes 001 à 89. Fichier GÉNÉRÉ par
 * scripts/ls04-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls04-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_001_89: StorySection[] = [
  {
  id: "1",
  texte: "Pendant trois jours vous menez votre détachement de patrouilleurs à travers les plaines fertiles situées au sud du Sommerlund. C'est là la première étape de votre voyage. Les champs qui vous entourent sont entièrement dépourvus d'arbres et vous n'apercevez que de vastes surfaces de blé qui semblent s'étendre à l'infini. Bien que vous soyez à cheval, les épis de blé vous arrivent au-dessus du genou et vos montures paraissent nager dans un immense océan d'un jaune éclatant où apparaissent parfois un sentier ou un groupe de fermes isolées. Les habitants de la région vous accueillent avec chaleur, mais vous ne faites que de brèves haltes pour vous restaurer et vous reposer. Vous ne voulez pas, en effet, abuser de l'hospitalité des paysans ni les inquiéter en leur laissant deviner la nature de votre mission. Le quatrième jour vers midi, vous atteignez la passe de Moytura. Là, les plaines font place aux contreforts déchiquetés des monts Durncrag. Bientôt vous arrivez sur une grande route orientée au sud et dont la surface est creusée d'ornières et de nids-de-poule. C'est la célèbre voie de Ruanon. Au sud de la passe, la voie de Ruanon traverse sur 150 km environ un territoire à découvert qu'on appelle la Contrée des Pillards. Des bandes de brigands venues du Pays Sauvage et des hordes de Gloks descendues des montagnes de l'ouest tendent fréquemment des embuscades aux voyageurs qui empruntent la grande route. A plusieurs reprises, les chargements d'or et de pierres précieuses en provenance des mines de Ruanon ont ainsi offert de riches butins à ces voleurs impitoyables. « Éclaireurs, en position ! » C'est vous qui venez de donner cet ordre ; aussitôt trois groupes de patrouilleurs s'écartent de la colonne et lancent leurs chevaux au galop. Vous regardez avec fierté ces habiles cavaliers prendre position pour reconnaître le terrain en avant et sur les flancs de la troupe en marche. A la fin de l'après-midi, l'un des éclaireurs revenant de l'ouest vient vous montrer une sorte de cratère rocheux d'où s'élève un filet de fumée : de toute évidence il y a là une maison dissimulée à l'abri des rocs en surplomb.",
  choix: [
    { texte: "Si vous souhaitez examiner cette maison", vers: "160" },
    { texte: "Si vous préférez ne pas y prêter attention et poursuivre votre chemin le long de la voie de Ruanon", vers: "273" }
  ]
  },
  {
  id: "2",
  titre: "Le butin des brigands",
  texte: "En fouillant les cadavres des brigands, vous découvrez les objets suivants : -1 Épée, -1 Masse d'Armes, -1 Poignard, - 1 Marteau de Guerre, -12 Pièces d'Or, -1 Sac à Dos, - des vivres équivalants à 2 Repas. Vous pouvez prendre un ou plusieurs de ces objets en n'oubliant pas de les noter sur votre Feuille d'Aventure. Vous ramassez ensuite la carte posée sur la table tachée de sang et vous remarquez alors que la pièce dans laquelle vous vous trouvez a été entourée à l'encre noire. Ce plan vous indique qu'une porte aménagée dans le mur du fond ouvre sur une galerie qui mène directement à la surface. Impatient de quitter ce lieu où règne la mort, vous franchissez la porte et vous courez le long du passage en direction d'un lointain rayon de soleil. Il vous faut plusieurs secondes pour habituer vos yeux à la lumière du jour, mais peu à peu vous réalisez enfin que vous avez réussi à vous échapper des mines de Maaken ; vous êtes à présent dans les contreforts de l'est à moins de 3 kilomètres de la ville de Ruanon elle-même. Vous apercevez cependant un groupe de Guerriers Pillards qui inspectent l'une des entrées de la mine, juste au-dessous de la corniche rocheuse sur laquelle vous êtes à présent accroupi. Si vous voulez atteindre Ruanon vivant, vous devez à tout prix éviter ces brigands. Vous attendez donc que le groupe de Pillards soit hors de vue puis vous descendez un sentier escarpé qui mène à une forêt touffue.",
  suite: "200",
  choix: [
    
  ],
  effets: { or: 12, objets: [{"id":"epee"},{"id":"masse"},{"id":"poignard"},{"id":"marteau-de-guerre"},{"id":"repas","quantity":2}] }
  },
  {
  id: "3",
  texte: "Vous montez sur la barricade et vous lancez un ordre : « Tendez les arcs ! » puis, tandis que le mur de boucliers de l'ennemi s'avance en une course mortelle, vous ordonnez à vos archers de tirer. Les boucliers de bois et de peau de vos ennemis ne suffisent pas à les protéger de cette pluie de flèches qui s'abat sur eux. Ils s'immobilisent et semblent vaciller, de larges brèches s'ouvrant dans leurs rangs, tandis que les lanciers s'effondrent par dizaines sur le sol. Rares sont ceux qui n'ont pas été blessés. Vous sentez alors que le vent de la bataille a tourné. Les soldats ennemis battent en retraite, portant leurs blessés à dos d'homme ou sur leur bouclier retourné. Vous sautez à bas de la barricade et vous vous précipitez vers la tour de guet où le capitaine Gayal, dans un combat acharné, est toujours aux prises avec des brigands à cheval. Vous vous apprêtez à enjamber le corps d'un des bandits, apparemment mort, lorsque celui-ci se relève à cet instant et vous porte un coup aux jambes à l'aide d'une masse d'armes.",
  choix: [
    { texte: "Cette attaque surprise vous projette à terre et vous fait perdre 1 point d'ENDURANCE", vers: "62" }
  ]
  },
  {
  id: "4",
  texte: "Vous reconnaissez aussitôt ces champignons : ce sont des Calacena. Leurs spores sont très recherchées par les illusionnistes et les magiciens, bien qu'elles causent, dit-on, de terribles hallucinations qui peuvent même conduire à la folie. Vous avancez donc avec précaution en prenant bien soin de ne pas marcher sur les champignons chargés de spores.",
  choix: [
    { texte: "Le tunnel se prolonge sur plusieurs kilomètres puis aboutit enfin à une longue galerie déserte", vers: "40" }
  ]
  },
  {
  id: "5",
  texte: "Vous le projetez à terre et, à l'aide de votre cape de Seigneur Kaï, vous étouffez le feu qui le dévore. Les flammes s'éteignent bientôt et vous vous hâtez d'enlever votre cape pour voir si le capitaine est blessé. La promptitude de vos réflexes lui a sauvé la vie : il est indemne ; en effet, seul son uniforme est brûlé et déchiré. « C'est à mon tour de vous remercier, Loup Solitaire, cette fois c'est vous qui m'avez sauvé d'une mort certaine. » Vous aidez le capitaine à se relever et vous vous précipitez vers la barricade. L'ennemi a maintenant atteint le périmètre en ruines de Ruanon et s'avance peu à peu à l'abri des murs encore debout. Vous montez sur un chariot retourné et vous ordonnez aux soldats du Sommerlund de revenir sur les barricades.",
  choix: [
    { texte: "Est-il encore temps de repousser l'attaque ?", vers: "186" }
  ]
  },
  {
  id: "6",
  texte: "Vous arrivez bientôt au croisement où le sentier aboutit à la grand-route. Vous apercevez à nouveau le chariot brûlé, abandonné sur le bas-côté.",
  choix: [
    { texte: "Si vous n'avez pas encore examiné ce chariot, vous pouvez le faire", vers: "80" },
    { texte: "Si vous préférez ne pas y prêter attention et poursuivre votre chemin le long de la grand-route en direction du sud", vers: "175" }
  ]
  },
  {
  id: "7",
  texte: "Votre adversaire tombe de selle, le pied coincé dans l'un des étriers, et son corps est entraîné par le cheval qui part au galop. Le vacarme de la bataille fait rage autour de vous. Vous vous rendez compte alors que ces cavaliers en armure ne sont pas des brigands ordinaires. Ils combattent en effet avec une discipline et une habileté dont ne sont guère coutumiers les hors-la-loi du Pays Sauvage. Un cheval passe à côté de vous, portant le cadavre d'un patrouilleur encore en selle. Vous saisissez les rênes de l'animal et vous récupérez une corne de guerre, accrochée au cou de l'homme mort. Si vous voulez éviter un désastre complet, vous savez en effet qu'il vous faut au plus vite sonner la retraite. Vous tournez votre monture en direction du sud et vous lancez au galop le cheval éclaboussé de sang.",
  choix: [
    { texte: "Les rescapés de votre troupe vous suivent de près, tandis que résonnent à vos oreilles les cris de victoire de l'ennemi", vers: "154" }
  ]
  },
  {
  id: "8",
  texte: "Vos hommes amarrent le bateau à un anneau de fer rouillé puis vous suivent dans l'escalier qui mène à l'arcade. Lorsque vous arrivez sur un étroit palier, au sommet des marches de granit, vous entendez d'étranges sons provenant de l'obscurité : on dirait le sifflement d'un jet de vapeur. Le bruit dure quelques secondes, puis il est interrompu brusquement par un claquement de fouet et la voix d'un homme poussant des jurons.",
  choix: [
    { texte: "Si vous souhaitez entrer dans le tunnel qui s'ouvre devant vous", vers: "151" },
    { texte: "Si vous préférez ne pas pénétrer dans ce souterrain, vous pouvez retourner sur le bateau et continuer le long de la rivière souterraine", vers: "240" }
  ]
  },
  {
  id: "9",
  texte: "Vous êtes saisi de panique en sentant le pont se dérober sous vos pieds. Vous plongez en avant et vous parvenez à attraper de justesse l'une des planches de la passerelle. Vous êtes loin cependant d'être tiré d'affaire. Vous sentez en effet vos mains glisser de leur prise et, par ailleurs, le pont qui s'effondre va venir s'écraser dans quelques instants contre le mur d'en face.",
  choix: [
    { texte: "Si vous souhaitez vous cramponner à la passerelle et vous préparer au choc qui vous attend", vers: "112" },
    { texte: "Si vous préférez lâcher prise et sauter dans les profondeurs inconnues du puits de mine", vers: "342" }
  ]
  },
  {
  id: "10",
  texte: "Le Guerrier recule en vacillant puis bascule par-dessus les remparts, tombant parmi les combattants engagés dans la bataille qui fait rage. Sa monture emplumée s'envole en poussant un hideux croassement dans le ciel d'orage. Vous trouvez alors sur le sol taché de sang un magnifique Médaillon d'Onyx arraché à l'armure du Guerrier au moment de sa chute. Si vous souhaitez conserver ce Médaillon d'Onyx, glissez-le dans votre poche et inscrivez-le sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  suite: "59",
  choix: [
    { texte: "Quittez à présent la tour de guet", vers: "59" }
  ],
  effets: { objets: [{"id":"medaillon-onyx"}] }
  },
  {
  id: "11",
  texte: "Vous avez parcouru une vingtaine de mètres environ lorsque vous arrivez soudain devant une paroi rocheuse. Vous vous trouvez dans un cul-de-sac. Ce tunnel a été creusé récemment et vous ne pouvez pas aller plus loin dans cette direction. Il ne vous reste donc plus qu'à retourner au croisement. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "97", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "190", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "12",
  titre: "Les offres du capitaine Gayal",
  texte: "A 80 kilomètres au sud de Ruanon, la cité en ruines de Maaken se dresse tout au bord des gorges du même nom. Vous sentez soudain une sueur froide perler à votre front. Vous venez en effet de vous rendre compte que, pour atteindre votre but, il vous faudra parcourir 80 kilomètres de terrain entièrement contrôlé par l'ennemi. Il vous reste cependant une lueur d'espoir. Vos chances de succès devraient être à présent plus grandes qu'avant la bataille compte tenu de la déroute des armées adverses. Avant que vous ne vous mettiez en chemin, le capitaine Gayal vous offre les objets suivants, parmi lesquels vous pourrez faire votre choix : - des vivres équivalant à 3 Repas, -1 Corde, -1 Potion de Laumspur qui vous permettra de reprendre 4 points d'ENDURANCE lorsque vous la boirez après un combat, -1 Epée, -1 Lance.",
  choix: [
    { texte: "Prendre 3 Repas", vers: "140", effets: { objets: [{"id":"repas","quantity":3}] } },
    { texte: "Prendre une Corde", vers: "140", effets: { objets: [{"id":"corde"}] } },
    { texte: "Prendre une Potion de Laumspur", vers: "140", effets: { objets: [{"id":"potion-laumspur"}] } },
    { texte: "Prendre une Épée", vers: "140", effets: { objets: [{"id":"epee"}] } },
    { texte: "Prendre une Lance", vers: "140", effets: { objets: [{"id":"lance"}] } }
  ]
  },
  {
  id: "13",
  texte: "Le spectacle se termine et vous vous préparez à une nuit de sommeil. A l'aube du lendemain, vos hommes et vous-même prenez congé des troubadours avant de poursuivre votre chemin en direction de Ruanon. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "171", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "25", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "14",
  texte: "Vos patrouilleurs se déploient et avancent sans bruit à l'abri de gros rochers. Lorsque vous êtes arrivé à proximité de l'ennemi, vous lancez un sifflement perçant : c'est le signal de l'attaque ! Immédiatement vos soldats se précipitent sur les brigands. Deux de ces derniers meurent sur le coup, le crâne fracassé par les épées des patrouilleurs. Un troisième fait volte-face pour s'enfuir, mais il est tué à son tour et précipité dans l'eau parsemée d'écume. Votre propre adversaire est un redoutable Guerrier: d'énormes bracelets d'acier lui protègent les poignets et les avant-bras, et un sinistre collier composé de têtes réduites orne sa poitrine. Vous portez le premier coup, mais ses réflexes sont vifs comme l'éclair. Il esquive en effet et contre-attaque à l'aide de sa lance.",
  choix: [
    { texte: "GUERRIER PILLARD HABILITÉ: 17 ENDURANCE: 28 Vous pouvez prendre la fuite à tout moment en plongeant dans la rivière Xane", vers: "31" },
    { texte: "Si vous combattez et sortez vainqueur", vers: "146" }
  ]
  },
  {
  id: "15",
  texte: "Vous avez parcouru moins de 100 mètres, lorsque vous remarquez des traces fraîches de sabots sur la poussière du sentier.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "264", requis: {"discipline":"orientation"} },
    { texte: "Sinon", vers: "134" }
  ]
  },
  {
  id: "16",
  texte: "Vous atteignez la porte que vous vous hâtez de franchir. A l'extérieur de la taverne, le terrain est escarpé et couvert d'une forêt dense. Deux de vos hommes vous suivent, mais ils sont tous deux grièvement blessés et ne parviennent pas à courir aussi vite que vous. Vous vous retournez pour les encourager de la voix, mais ils sont alors brutalement frappés dans le dos et s'effondrent morts sur le sol. Les brigands qui les ont tués essuient leurs armes et se lancent à votre poursuite.",
  choix: [
    { texte: "Si vous souhaitez vous enfuir tout droit dans la forêt", vers: "123" },
    { texte: "Si vous préférez changer de direction dès que les arbres vous cacheront aux yeux de vos poursuivants", vers: "169" }
  ]
  },
  {
  id: "17",
  titre: "Mort — §17",
  texte: "La pointe d'une lance vous a écorché l'avant-bras. Il ne s'agit que d'une simple égratignure et pourtant votre bras s'est soudain engourdi au point que vous ne pouvez plus le remuer. Vous frappez votre agresseur, mais votre coup est trop faible et mal porté pour se révéler efficace. Votre vue se trouble, vous ne parvenez plus à coordonner vos mouvements. Une terreur aveugle vous envahit lorsque vous vous rendez compte soudain que ces bandits utilisent des armes empoisonnées. Une autre lance vous atteint à nouveau au bras et une autre encore s'enfonce dans votre poitrine. Vous sombrez peu à peu dans l'obscurité en emportant de ce monde une dernière vision: celle du rictus triomphant de vos assassins en train de vous achever. Votre mission se termine ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §17"
  },
  {
  id: "18",
  texte: "Vous reconnaissez ces traces de sabots. Ce sont celles d'un cheval de la cavalerie du Sommerlund. Il y a deux rangées de traces et vous avez la conviction qu'elles ont été laissées par deux de vos éclaireurs disparus.",
  choix: [
    { texte: "Vous décidez donc de les suivre en direction de l'est dans l'espoir de retrouver vos hommes", vers: "150" }
  ]
  },
  {
  id: "19",
  texte: "Vous reconnaissez aussitôt ces amulettes. Elles sont le symbole du « Saint Ordre des Rédempteurs », une communauté de pèlerins contemplatifs dont la vie est consacrée à la prière et à la guérison. Vous présentez vos excuses pour avoir réagi d'une manière trop hâtive et les deux hommes hochent leur tête rasée en signe de pardon. Vos soldats ont établi le campement à l'abri du dôme de marbre et tout le monde se prépare à une bonne nuit de sommeil.",
  choix: [
    { texte: "Vous avez faim à présent et il vous faut prendre un Repas sinon vous perdrez 3 points d'ENDURANCE", vers: "233" }
  ],
  effets: { repasObligatoire: true }
  },
  {
  id: "20",
  texte: "Une flèche siffle au-dessus de votre tête et un cri de douleur retentit aussitôt. L'arc glisse des mains de l'archer qui s'affaisse sur les genoux, une flèche enfoncée entre ses deux yeux stupéfaits. Des halètements et des bruits de pas feutrés vous indiquent que les Chiens de Guerre se rapprochent. En levant le regard, vous voyez un homme courir vers vous en provenance de la barricade. Il porte un bouclier dans une main et un arc dans l'autre. C'est le capitaine Gayal. Il vous rejoint, le souffle court, et saisit une flèche dans son carquois. Puis il vise et tire, prenant une autre flèche dès que la première a été lâchée. Autour de vous, les Chiens de Guerre trébuchent et s'effondrent sur le sol, transpercés par les flèches mortelles du capitaine Gayal. Dix cadavres restent ainsi étendus sur le terrain avant que son carquois ne soit vide. Le capitaine vous saisit alors par le bras puis, vous hissant sur son épaule d'un seul geste rapide, il vous ramène en direction de la barricade. D'autres soldats se précipitent pour vous aider, mais les brigands se sont rapprochés et vos compatriotes se trouvent contraints de reculer sous une pluie de flèches. Les projectiles rouges de l'ennemi sifflent de tous côtés. Vous atteignez la barricade, l'un des chariots est repoussé et vous franchissez ainsi la ligne de défense, toujours porté par le capitaine Gayal proche de l'épuisement.",
  choix: [
    { texte: "Il titube et ses soldats se ruent sur lui pour le retenir au moment où il s'effondre sur le sol", vers: "341" }
  ]
  },
  {
  id: "21",
  texte: "Au bout d'une demi-heure, l'un de vos hommes déclare avoir repéré un sentier un peu plus loin. Ce chemin étroit et couvert de poussière est orienté est-ouest.",
  choix: [
    { texte: "Si vous souhaitez le suivre en direction de l'est", vers: "134" },
    { texte: "Si vous préférez l'emprunter en direction de l'ouest", vers: "191" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "264", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "22",
  texte: "En fouillant dans votre Sac à Dos pour y prendre une Torche, vous faites tomber dans le vide un autre des objets qu'il contient (si vous n'aviez qu'une Torche dans votre Sac à Dos, à l'exclusion de tout autre objet, c'est une Arme que vous aurez perdue ; vous choisirez vous-même l'objet tombé). Vous parvenez enfin à allumer la nouvelle Torche et vous traversez le pont sans encombre.",
  choix: [
    { texte: "Poursuivez votre chemin le long du tunnel", vers: "157" }
  ]
  },
  {
  id: "23",
  titre: "Porte fermée à clé",
  texte: "Lorsque vous atteignez la porte, vous vous apercevez qu'elle est fermée à clé.",
  choix: [
    { texte: "Si vous possédez une Clé de Cuivre", vers: "282", requis: {"objet":"cle-cuivre"} },
    { texte: "Si vous ne possédez pas la Clé de Cuivre", vers: "105", montreToujours: true }
  ]
  },
  {
  id: "24",
  texte: "Vous sautez par-dessus le corps du Guerrier mort et vous pénétrez dans la tour de guet. Montant quatre à quatre le large escalier de pierre, vous atteignez un palier au premier étage où deux soldats tirent des flèches à travers des meurtrières. Soudain, l'un d'eux pousse un cri de douleur et recule en chancelant, une flèche enfoncée dans la poitrine.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison, vous pouvez venir en aide à ce soldat blessé", vers: "238", requis: {"discipline":"guerison"} },
    { texte: "Si vous souhaitez continuer à monter les marches jusqu'au sommet de la tour", vers: "223" },
    { texte: "Si vous préférez ramasser l'arc du soldat blessé et prendre sa place derrière la meurtrière", vers: "207" }
  ]
  },
  {
  id: "25",
  texte: "Après avoir traversé les riches champs de blé situés au sud du Sommerlund, le spectacle qui s'offre à présent à vos yeux vous paraît singulièrement morne et sinistre. Un paysage plat et désolé, parsemé çà et là de fougères rabougries et de tertres rocheux, s'étend devant vous. Au cours de l'après-midi, des nuages d'orage s'amoncellent au sommet des monts Durncrag, à l'ouest, et un lointain grondement de tonnerre annonce l'arrivée imminente de la pluie. En début de soirée, vos éclai-reurs vous annoncent qu'ils ont découvert les ruines d'un ancien temple à moins d'un kilomètre et demi de la grand-route.",
  choix: [
    { texte: "Si vous souhaitez établir votre campement à l'abri de ces ruines", vers: "290" },
    { texte: "Si vous préférez éviter ce temple et poursuivre votre chemin", vers: "141" }
  ]
  },
  {
  id: "26",
  texte: "Tandis que vous courez vers l'échelle, vous entendez les cris épouvantables de vos hommes en train de mourir dévorés vivants. Vous vous immobilisez et vous jetez un coup d'œil derrière vous, dans le tunnel. Le Ver de Pierre est maintenant à 5 mètres environ et ondule dans votre direction à une allure terrifiante. Il est clair que vous n'atteindrez pas l'échelle à temps. Il ne vous reste donc plus qu'à combattre;'. La créature est invulnérable à la Discipline Kaï de la Puissance Psychique.",
  suite: "321",
  combat: { nom: "Ver de Pierre", habilete: 15, endurance: 38, immunisePsychique: true }
  },
  {
  id: "27",
  texte: "Vous sautez à bas du chariot et vous vous précipitez vers une forêt touffue dont la lisière se trouve à moins de 20 mètres de la voie ferrée. La chance est avec vous : les bandits en effet n'ont pas remarqué votre fuite audacieuse et les chariots poursuivent leur chemin en direction du portique.",
  choix: [
    { texte: "Vous faites une brève halte pour reprendre votre souffle, adressant des remerciements silencieux à l'étranger qui vous a aidé, puis vous poursuivez votre marche parmi les arbres", vers: "200" }
  ]
  },
  {
  id: "28",
  texte: "Le Guerrier laisse échapper un dernier cri de douleur avant de basculer dans le puits de mine et de disparaître dans les ténèbres. Ses hommes semblent terrifiés par vos prouesses de combattant et se bousculent les uns les autres dans leur hâte d'échapper à un sort semblable.",
  choix: [
    { texte: "Tandis que les échos de leurs pas précipités s'évanouissent dans le tunnel, vous traversez le pont et vous quittez les lieux en empruntant un souterrain qui s'ouvre dans le mur situé à l'ouest", vers: "348" }
  ]
  },
  {
  id: "29",
  texte: "La Torche projette une lueur ardente qui, quelques secondes plus tard, vacille et s'éteint. Vous essayez de la rallumer, mais vos efforts restent vains. Si vous avez d'autres Torches dans votre Sac à Dos, vous vous apercevrez que, pour quelque mystérieuse raison, il vous sera également impossible de les allumer.",
  choix: [
    { texte: "Si vous disposez d'une Sphère de Feu", vers: "168" },
    { texte: "Si vous souhaitez poursuivre votre chemin dans l'obscurité", vers: "246" },
    { texte: "Si vous préférez quitter l'endroit et essayer d'entrer par la porte de la crypte que surveillent les Gardes", vers: "183" }
  ]
  },
  {
  id: "30",
  texte: "Cette longue marche de nuit et le manque de sommeil commencent à produire leurs effets sur vos hommes et leurs chevaux. Quels que soient vos efforts pour essayer d'accélérer l'allure de votre troupe, vous ne parvenez pas à distancer la horde des brigands. Soudain, un groupe nombreux de cavaliers vêtus d'armures surgit de derrière une éminence de terre, à votre gauche. Ces soldats essaient de vous couper la route pour vous empêcher d'avancer.",
  choix: [
    { texte: "Lancés les uns contre les autres, vous n'allez pas tarder à les heurter avec violence et vous vous préparez au choc", vers: "176" }
  ]
  },
  {
  id: "31",
  texte: "L'eau est sombre, très froide et son courant tumultueux vous emporte irrésistiblement vers un nouveau danger que vous n'aviez pas prévu : des rapides. Le fracas de l'eau bouillonnante est si intense qu'il en devient assourdissant. Vous aspirez une grande bouffée d'air en vous préparant à affronter les remous torrentiels qui menacent de vous engloutir. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "272", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "329", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "32",
  texte: "La hideuse créature vous lâche les jambes et sombre au fond de l'eau. Votre victoire vous réjouit, mais vous avez l'impression que vos poumons sont en feu. Vous vous débattez pour remonter à la surface et vous parvenez enfin à respirer à nouveau, toussant et haletant. Il ne reste du bateau et de vos hommes qu'une rame fracassée qui flotte à la surface de la sombre et terrifiante rivière. Vous vous accrochez à ce débris et vous vous laissez emporter par le courant en direction de la rive opposée sur laquelle vous vous hissez. En vérifiant le contenu de votre Sac à Dos et de vos poches, vous constatez que vous n'avez rien perdu au cours de votre lutte dans l'eau, mais c'est là une mince consolation au regard de la catastrophe que représente la mort de vos hommes. Vous refusez cependant de perdre courage et vous décidez de poursuivre votre chemin vers Ruanon pour tenter de percer le mystère qui pèse sur la province.",
  choix: [
    { texte: "Avant d'entrer dans le tunnel orienté à l'est, vous jetez un dernier regard à la rivière aux eaux noires puis vous vous", vers: "309" }
  ]
  },
  {
  id: "33",
  texte: "La nuit est presque tombée lorsque vous atteignez une vallée envahie d'une forêt touffue. La grand-route disparaît au loin parmi les arbres et vous apercevez un panneau indicateur montrant la direction du sud. Vous n'êtes plus à présent qu'à 60 km de Ruanon, mais vos hommes sont fatigués et ont besoin de manger et de se reposer.",
  choix: [
    { texte: "Si vous souhaitez établir votre campement en lisière de la forêt", vers: "74" },
    { texte: "Si vous préférez envoyer des éclaireurs dans la vallée pour repérer d'éventuels brigands", vers: "139" },
    { texte: "Enfin, si vous décidez de poursuivre votre chemin vers Ruanon sans manger ni dormir", vers: "251" }
  ]
  },
  {
  id: "34",
  texte: "La créature est éblouie par la clarté d'or du Glaive de Sommer. Une expression de terreur apparaît sur son visage de vampire et elle s'élance dans les airs pour éviter votre coup. Vous vous préparez à frapper à nouveau, mais en vain : votre adversaire silencieux vient de s'enfuir par une fente du plafond. Vous remettez votre Glaive au fourreau et vous poursuivez votre chemin. Vous remarquez alors une ouverture dans le mur, audelà de laquelle s'étend un couloir long et étroit.",
  choix: [
    { texte: "Si vous souhaitez emprunter ce couloir", vers: "235" },
    { texte: "Si vous préférez quitter les lieux et essayer d'entrer dans le temple par la porte de la crypte que surveillent les gardes", vers: "183" }
  ]
  },
  {
  id: "35",
  texte: "Mettant en pratique votre Discipline Kaï, vous vous dissimulez dans les ombres qui se projettent contre les murs et vous avancez prudemment en direction du pont. Soudain, le Garde pose son morceau de bois et vous tourne le dos. Il est en train de fouiller dans son sac à dos pour y chercher quelque nourriture. C'est là l'occasion ou jamais de vous précipiter vers le pont en brandissant votre arme dont vous frapperez le Garde par surprise. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï de la Chasse ou si vous avez atteint le rang Kaï de Gardien (ou un rang supérieur), vous ajouterez 3 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-7": { vers: "147", texte: "Si vous obtenez un total de 0 à 7," },
        "8-12": { vers: "231", texte: "De 8 à 12," }
      }
      }
  },
  {
  id: "36",
  titre: "Le Chien de Guerre",
  texte: "Les Chiens de Guerre se précipitent dans votre direction à une vitesse décourageante. Vous distinguez nettement leurs énormes mâchoires aux babines rouges et vous entendez leurs crocs s'entrechoquer. Vous vous efforcez de contrôler votre respiration et vous faites appel à toutes vos ressources d'habile guerrier : il vous faut en effet vous débarrasser de ces Chiens de Guerre sans commettre la moindre erreur, sinon vous serez littéralement déchiqueté. Deux molosses plus rapides que leurs congénères se détachent de la meute et se ruent sur vous. Ils bondissent en même temps, leurs mâchoires grandes ouvertes dégoulinant de bave. Vous plongez à terre et vous roulez sur vous-même en les frappant au ventre à l'instant précis où ils s'élancent au-dessus de vous. Les deux créatures poussent un hurlement de rage et de douleur puis s'effondrent sans vie sur le sol. Vous vous relevez aussitôt, juste à temps pour affronter un nouveau Chien de Guerre.",
  choix: [
    { texte: "Si vous gagnez le combat en 3 Assauts ou moins", vers: "155" },
    { texte: "S'il vous faut plus de 3 Assauts pour remporter la victoire", vers: "277" }
  ],
  combat: { nom: "Chien de Guerre", habilete: 17, endurance: 25 }
  },
  {
  id: "37",
  texte: "Vous faites signe au conducteur de la roulotte de tête de s'arrêter. La caravane s'immobilise bientôt et un petit homme au visage lunaire, vêtu d'une tunique rose vif ouvre à la volée la porte arrière de la roulotte. Descendant du véhicule, il se met à hurler en injuriant le conducteur et ne consent à s'interrompre que pour rajuster la large ceinture qui entoure son énorme ventre. Puis, voyant vos hommes, il laisse alors échapper un cri étranglé et, d'un geste précipité, saisit la poignée d'un sabre qui pend à sa ceinture. « Des brigands ! des voleurs ! » s'écrie-t-il en s'efforçant d'arracher le sabre à son fourreau ouvragé. Des visages inquiets apparaissent aux fenêtres de la roulotte, mais leur expression se change bientôt en un sourire. Les voyageurs ont reconnu les uniformes du Sommerlund. « Calme-toi, Yesu, crie une vieille femme, ce sont des patrouilleurs sommerlundais. Ils ne te voleront pas ton or. » Des éclats de rire retentissent dans toutes les roulottes lorsque le petit homme gras dégaine soudain son sabre avec tant de force qu'il tourne sur lui-même, puis trébuche et tombe sur le sol. « Il faut pardonner à Yesu, vous dit la vieille femme, il ne vous veut aucun mal, c'est la Contrée des Pillards qui le rend aussi nerveux. » Vous demandez à la vieille femme d'où ils viennent et où ils se rendent. Elle vous apprend alors que la caravane transporte une troupe de musiciens et d'acteurs qui ont voyagé longtemps, quittant leur terre natale de Clœasia à l'est pour donner une série de représentations. Leur dernier spectacle s'est déroulé à Eshnar, mais il fut décevant : la ville en effet semblait aussi silencieuse qu'un tombeau et les habitants venus les entendre avaient l'air triste et découragé. Les musiciens se rendent à présent à Holmgard en espérant y trouver un public plus enthousiaste. « La nuit tombe, fait remarquer la vieille femme, peut-être accepterez-vous de camper avec nous en compagnie de vos hommes ? Ce serait pour nous un honneur et nous serions heureux de vous distraire en vous proposant des chants, des danses et du théâtre. » Vous remarquez aussitôt une lueur d'espoir dans le regard de vos hommes qui attendent avec impatience votre décision.",
  choix: [
    { texte: "Si vous souhaitez camper avec les troubadours", vers: "182" },
    { texte: "Si vous préférez continuer en direction de Ruanon", vers: "247" }
  ]
  },
  {
  id: "38",
  texte: "Il ne reste plus rien dans la carcasse calcinée du chariot. Le bois est entièrement noirci et les garnitures de métal se sont déformées sous l'effet de la chaleur. Ces débris, cependant, confirment vos soupçons. C'est là ce qui reste d'un chariot de la cavalerie du Sommerlund, l'un des trois qui ont quitté Ruanon il y a plus d'un mois, escortés par les hommes du capitaine Gayal. Tandis que vous vous trouvez devant le chariot, essuyant les cendres de vos mains, l'un de vos patrouilleurs pousse soudain un hurlement de douleur. Jetant un coup d'œil dans sa direction, vous le voyez tomber de son cheval, un disque d'acier acéré enfoncé dans la poitrine. « Une embuscade ! Tout le monde à l'abri ! » Alors que vous donnez cet ordre, d'autres disques mortels sont lancés des arbres, traversant l'air en sifflant. Les chevaux, pris de panique, s'enfuient en tous sens, vos hommes s'accrochant désespérément aux rênes. Vos agresseurs cachés disparaissent aussi vite qu'ils sont venus, mais trois de vos soldats ont été tués. Après avoir enterré les morts, il vous faut à présent prendre une décision. Il ne reste en effet que quatre hommes à vos côtés et l'ennemi peut revenir à tout moment pour achever sa sinistre besogne.",
  choix: [
    { texte: "Si vous souhaitez poursuivre votre chemin le long de la grand-route en galopant vers Ruanon", vers: "297" },
    { texte: "Si vous préférez éviter la route principale et continuer en empruntant le chemin orienté à l'est", vers: "15" }
  ]
  },
  {
  id: "39",
  texte: "La flèche décrit une courbe dans le ciel envahi de fumée et transperce le plastron étincelant de l'officier. Vous entendez son cri de douleur dominer le vacarme de la bataille et vous voyez ses yeux cruels se brouiller puis se fermer.",
  choix: [
    { texte: "Il s'effondre et glisse de sa selle, votre flèche profondément enfoncée dans le cœur", vers: "148" }
  ]
  },
  {
  id: "40",
  texte: "Des chariots de mine vides sont alignés sur une voie ferrée, le long d'un tunnel qui s'ouvre dans le mur ouest de cette galerie. Au-dessus de l'entrée du tunnel, un escalier de bois mène à un couloir plus étroit éclairé par la flamme vacillante d'une torche. Vous restez caché dans l'ombre en observant la galerie pendant une demi-heure. Vous estimez alors que vous pouvez y pénétrer sans risque.",
  choix: [
    { texte: "Si vous souhaitez suivre la voie ferrée en direction de l'ouest", vers: "55" },
    { texte: "Si vous préférez monter l'escalier pour explorer le passage auquel il mène", vers: "291" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation et si vous avez le rang Kaï d'Aspirant (ou un rang supérieur)", vers: "349", requis: {"drapeau":"rang_aspirant"} }
  ]
  },
  {
  id: "41",
  texte: "Vous reconnaissez cette sécrétion gluante : c'est la trace caractéristique d'un Ver de Pierre, un prédateur souterrain particulièrement redoutable.",
  choix: [
    { texte: "Vous recommandez à vos hommes de ne pas marcher dans ce liquide qui est extrêmement acide, mais à peine avez-vous prononcé ces mots qu'un bruit terrifiant retentit soudain", vers: "276" }
  ]
  },
  {
  id: "42",
  titre: "Mort — §42",
  texte: "Vos genoux se fracassent contre la paroi et vous tombez comme une pierre dans l'obscurité du puits ; mais bientôt la douleur provoquée par le choc disparaît : vous venez de perdre connaissance. Quelques dizaines de mètres plus bas, vous tombez dans l'eau d'une rivière souterraine et, incapable de refaire surface, vous mourez noyé en quelques instants. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §42"
  },
  {
  id: "43",
  texte: "Si vous voulez survivre à cette attaque, vous devrez faire preuve de rapidité et de précision. Vous brandissez votre arme, prêt à frapper. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière ou celle de la Maîtrise des Armes, vous ajouterez 1 au chiffre tiré. Si vous maîtrisez la Discipline Kaï de la Chasse ou du Sixième Sens, vous ajouterez 2 au chiffre donné par la Table.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "262", texte: "Si vous obtenez un total de 0 à 6," },
        "7-9": { vers: "111", texte: "Si ce total est de 7 ou plus," }
      }
      }
  },
  {
  id: "44",
  texte: "Tandis que les patrouilleurs encerclent les ruines, les étrangers tentent de s'enfuir en direction de la grand-route. Vos hommes se lancent alors à leur poursuite et ont tôt fait de les tuer à coups d'épée. L'un des étrangers fracasse un petit flacon en tombant. Vous fouillez les cadavres et vous trouvez 12 Pièces d'Or et une quantité de nourriture représentant 2 Repas. Vous remarquez ensuite que les deux hommes portent autour du cou des Amulettes attachées à des chaînettes. Ces Amulettes sont en bois et représentent un poisson. Si vous souhaitez conserver une ou plusieurs de ces trouvailles, modifiez en conséquence votre Feuille d'Aventure.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "149", requis: {"discipline":"guerison"} },
    { texte: "Sinon", vers: "188", montreToujours: true }
  ],
  effets: { or: 12, objets: [{"id":"repas","quantity":2},{"id":"amulette","quantity":2}] }
  },
  {
  id: "45",
  texte: "La pointe de leurs lances est enduite de sève de Gandum. Il s'agit là d'un poison mortel et vous ne voulez pas prendre le risque d'engager le combat avec ces brigands : en effet, une simple écorchure provoquée par ces armes empoisonnées pourrait vous être fatale.",
  choix: [
    { texte: "Vous vous relevez alors d'un bond et vous courez à toutes jambes en direction de Ruanon, laissant la forêt derrière vous", vers: "307" }
  ]
  },
  {
  id: "46",
  texte: "Vous avez à peine fait une dizaine de pas qu'une vision effrayante s'offre soudain à vos yeux. Le tunnel, en effet, est bloqué un peu plus loin par une créature énorme et gluante dont la peau est couverte de verrues qui brillent d'une lueur verdâtre. Vous dégainez votre arme tandis que le monstre avance par bonds sur ses pattes crochues. Soudain, deux ailes surgissent sur son dos, et il s'élance dans l'air. Sa gueule ouverte découvre une rangée de dents tranchantes comme des rasoirs. La créature fond sur vous et il vous faut la combattre.",
  suite: "281",
  combat: { nom: "Démondes Souterrains", habilete: 20, endurance: 10 }
  },
  {
  id: "47",
  titre: "Le Mégacalmar",
  texte: "Vous parvenez à aspirer une bouffée d'air avant que l'eau sombre ne se referme sur vous. Un tentacule vous effleure le pied et vous lui portez un coup, l'empêchant ainsi de s'enrouler autour de votre jambe. La créature est à présent gravement blessée, ce qui la rend d'autant plus acharnée à vous faire payer de votre vie la douleur que vous lui avez infligée.",
  choix: [
    { texte: "Si le combat dure plus de 5 Assauts", vers: "340" },
    { texte: "Si vous remportez la victoire en 5 Assauts ou moins", vers: "32" }
  ],
  combat: { nom: "Mégacalmar", habilete: 16, endurance: 37 }
  },
  {
  id: "48",
  texte: "Vous sentez que le tunnel de gauche s'éloigne de Ruanon.",
  choix: [
    { texte: "Sans hésiter un instant, vous empruntez donc celui de droite", vers: "145" }
  ]
  },
  {
  id: "49",
  texte: "Vous vous glissez parmi les épis de blé en prenant soin de les écarter tout d'abord de vos mains tendues. Puis vous vous accroupissez tandis que les tiges de blé se remettent en place. Il est désormais impossible de vous voir. Retenant votre souffle, vous entendez les brigands passer à quelques dizaines de centimètres de vous sans remarquer votre présence.",
  choix: [
    { texte: "Lorsque vous êtes sûr qu'ils se sont suffisamment éloignés, vous sortez de votre cachette et vous vous hâtez de poursuivre votre chemin", vers: "204" }
  ]
  },
  {
  id: "50",
  texte: "Les grandes portes s'ouvrent pour livrer passage à une patrouille de six Gardes des Tunnels. Chacun d'eux est armé d'une arbalète. En vous voyant sur le pont, ils réagissent instantanément. « Chargez ! » Vous venez de lancer cet ordre en espérant que vos hommes pourront maîtriser les Gardes avant qu'ils n'aient le temps d'actionner leurs armes mortelles. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "184", texte: "Si vous tirez un chiffre entre 0 et 6," },
        "7-9": { vers: "267", texte: "Si vous tirez le 7, le 8 ou le 9," }
      }
      }
  },
  {
  id: "51",
  texte: "Vous avez chevauché pendant plus de quatre heures, lorsque vous apercevez soudain de gros oiseaux noirs qui tournoient au sommet d'une éminence de terre, un peu plus loin.",
  choix: [
    { texte: "Si vous souhaitez monter sur cette éminence pour l'examiner", vers: "328" },
    { texte: "Si vous préférez ne pas prêter attention à ces oiseaux et poursuivre votre chemin", vers: "120" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "227", requis: {"discipline":"communication-animale"} }
  ]
  },
  {
  id: "52",
  texte: "Une pluie de flèches empennées s'abat sur vous et trois de vos hommes ont été touchés lorsque vous atteignez la mine. Une autre flèche passe si près de votre tête qu'elle vous érafle l'œil droit. Vous êtes aveuglé et vous perdez 1 point d'ENDURANCE.",
  suite: "200",
  choix: [
    { texte: "Protégeant de la main votre œil blessé, vous approchez en chancelant de l'entrée du tunnel", vers: "248" }
  ],
  effets: { endurance: -1 }
  },
  {
  id: "53",
  texte: "Dès que vous êtes entré, la porte se referme dans votre dos en claquant. Vous faites aussitôt volte-face au moment où un Bandit émergeant de l'ombre, se précipite sur vous. Il a la tête enveloppée de pansements tachés de sang, ce qui ne l'empêche pas d'être armé et bien décidé à vous combattre. BANDIT BLESSÉ HABILETÉ : 13 ENDURANCE : 16 Il vous affronte le dos contre la porte et vous n'avez donc pas la possibilité de fuir.",
  suite: "109",
  combat: { nom: "Bandit Blessé", habilete: 13, endurance: 16 }
  },
  {
  id: "54",
  texte: "Tandis que vous avancez le long du tunnel en pente, vous sentez un courant d'air froid et humide vous frapper le visage. Les parois du souterrain sont veinées de minerai étincelant qui reflète la flamme de votre Torche en de multiples couleurs. En contemplant ces lueurs dansantes, vous remarquez soudain que le sol est couvert de petits champignons roses.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison et si vous avez le titre Kaï de Guerrier", vers: "4", requis: {"discipline":"guerison"} },
    { texte: "Si vous ne maîtrisez pas cette Discipline ou si vous n'avez pas encore atteint ce rang, vous pouvez poursuivre votre chemin sur ce sol envahi de champignons", vers: "65" },
    { texte: "Il vous est également possible, si vous le souhaitez, de manger quelques-uns de ces champignons", vers: "201" }
  ]
  },
  {
  id: "55",
  texte: "La voie ferrée suit un tunnel éclairé par des Torches. Vous passez devant des chariots de mine qui portent tous la même marque sur leurs flancs de bois : une croix ancrée surmontant les initiales O.V. Il s'agit là du sceau d'Oren Vanalund, baron de Ruanon. Cette découverte vous confirme que vous avez pris la bonne direction. Soudain, des bruits de pas retentissent dans le tunnel, s'approchant de vous. Ils deviennent de plus en plus sonores et s'accompagnent de cris et de claquements de fouet.",
  choix: [
    { texte: "Si vous souhaitez vous cacher dans l'un des chariots vides", vers: "161" },
    { texte: "Si vous préférez vous dissimuler dans l'ombre des murs du tunnel", vers: "286" }
  ]
  },
  {
  id: "56",
  texte: "Vous frappez le Garde, lui infligeant une profonde blessure au cou. Il pousse un hurlement et se tourne pour vous faire face, un sabre à la main.",
  choix: [
    { texte: "Si vous gagnez le combat en 3 Assauts ou moins", vers: "69" },
    { texte: "S'il vous faut plus de 3 Assauts pour l'emporter", vers: "203" }
  ],
  combat: { nom: "Garde Blessé", habilete: 12, endurance: 18 }
  },
  {
  id: "57",
  texte: "« Il faut que vous la sauviez, Loup Solitaire, s'écrie le baron d'une voix brisée par l'émotion. Il faut à tout prix empêcher ce sacrifice. » « Sauvez qui ? Qui donc doit-il sauver ? » interroge le capitaine Gayal en essayant de calmer le baron. « Ma fille Madelon, bien entendu», répond ce dernier. Ses yeux rougis sont baignés de larmes et il se tord les mains en un geste nerveux. Il récite alors cette sinistre prophétie : Au soir de pleine lune, en un temple profond, Sacrifice viendra à jamais réveiller Les légions d'un Seigneur trop longtemps oublié. Quand mourra sur l'autel la vierge aux cheveux blonds, Des gorges de Maaken, les morts se lèveront Pour exiger enfin la rançon des guerriers. « Vous ne comprenez donc pas ? poursuit le baron. Barraka a trouvé le poignard de Vashna et il s'apprête à sacrifier ma fille sur l'autel du Temple pour libérer les morts des gorges de Maaken, le gouffre maudit. Au temps de la lune noire, explique-til, le roi Ulnar du Sommerlund tua Vashna, le plus puissant des Maîtres des Ténèbres, à l'aide du Glaive de Sommer, l'épée du soleil. Le corps de Vashna et les cadavres de tous ses soldats furent ensuite jetés dans l'abîme sans fond des gorges de Maaken. Barraka veut à présent mener les morts à la victoire en conquérant d'abord le Sommerlund, puis l'ensemble des Fins de Terre. » Dans un silence terrifié vous observez le baron dont le regard exprime toute la détresse. Si Barraka accomplit le sacrifice, tout est perdu. Que pourrait faire une armée de mortels face aux légions des morts ? Le capitaine Gayal vous emmène hors de la pièce et referme la porte derrière lui. « Je craignais qu'il ne soit fou, dit-il, et j'ai refusé de l'écouter, mais les événements de ces derniers jours confirment mon pire cauchemar. Il dit la vérité. » Un frisson vous parcourt l'échiné tandis que vous repensez à l'épouvantable prophétie, mais bientôt vous êtes arraché à votre sombre méditation par le son aigu d'une corne de guerre. Le capitaine Gayal s'approche aussitôt d'une meurtrière à travers laquelle il scrute la plaine désolée. Il se tourne ensuite vers vous, le visage d'un gris de cendre. « Les brigands, dit-il, ils nous attaquent. »",
  choix: [
    { texte: "Si vous possédez l'Épée du capitaine Gayal", vers: "327" },
    { texte: "Sinon", vers: "289" }
  ]
  },
  {
  id: "58",
  texte: "Scrutant l'obscurité qui s'étend autour du campement, vous concluez que l'acteur n'a pu se réfugier que dans deux endroits : une grande roulotte à votre gauche, ou une plus petite à votre droite. Vous remarquez un mouchoir oublié par terre devant la porte de la petite roulotte.",
  choix: [
    { texte: "Si vous souhaitez entrer dans la plus grande des deux roulottes", vers: "222" },
    { texte: "Si vous préférez inspecter la plus petite", vers: "110" }
  ]
  },
  {
  id: "59",
  texte: "Le capitaine Gayal et ses hommes sont engagés dans un combat sans merci contre l'ennemi à cheval. Ils sont surpassés en nombre par des adversaires impitoyables dont les chevaux sont équipés de fers hérissés de pointes. Leur technique consiste à projeter leurs victimes à terre puis à les faire piétiner par leurs montures. Lorsque vous atteignez la barricade, une autre vague d'attaquants s'approche. Des maîtres chiens vêtus d'armures se déploient devant une troupe d'infanterie armée de lances. Ils tiennent en laisse des meutes de Chiens de Guerre. A une cinquantaine de mètres de la barricade, les hommes en armure s'immobilisent et se penchent pour lâcher leurs molosses. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "193", texte: "Si vous tirez un chiffre de 0 à 4," },
        "5-9": { vers: "260", texte: "De 5 à 9," }
      }
      }
  },
  {
  id: "60",
  texte: "La mise en pratique de votre Discipline Kaï vous permet de deviner que le tunnel de droite aboutit à un cul-de-sac.",
  choix: [
    { texte: "Vous y seriez pris au piège par vos poursuivants et vous décidez donc de vous enfuir par le tunnel de gauche", vers: "199" }
  ]
  },
  {
  id: "61",
  texte: "La promptitude de vos réflexes vous a permis de ne pas tomber dans la rivière. Vous avez en effet évité le tentacule en faisant un pas de côté et vous lui portez aussitôt un coup. Sous le choc, une profonde blessure apparaît laissant échapper un jet de sang vert qui se répand au fond du bateau. Il n'y a plus que deux rescapés parmi vos hommes. L'un est en train de frapper de son arme un autre tentacule qui s'est enroulé autour de son pied, le second est étendu sans connaissance, le bras cassé à hauteur du coude.",
  choix: [
    { texte: "Si vous souhaitez frapper à votre tour le tentacule enroulé autour du pied du patrouilleur", vers: "304" },
    { texte: "Si vous préférez porter secours au patrouilleur évanoui", vers: "136" },
    { texte: "Enfin, si vous estimez plus judicieux d'empoigner les rames et d'essayer de gagner la rive", vers: "189" }
  ]
  },
  {
  id: "62",
  texte: "Le brigand se lève d'un bond et vous attaque avec sa masse d'armes. Vous êtes toujours à terre et vous devrez, de ce fait, réduire de deux points votre total d'HABILETÉ au cours des trois premiers Assauts. A partir du quatrième Assaut, vous pouvez vous relever et retrouver votre total normal d'HABILETÉ. Il vous est impossible de prendre la fuite et il vous faut combattre ce Guerrier Pillard jusqu'à la mort de l'un de vous deux.",
  suite: "148",
  combat: { nom: "Guerrier Pillard", habilete: 17, endurance: 24, description: "Vous êtes à terre : -2 Habileté pendant les 3 premiers Assauts.", malusPremiersAssauts: {"tours":3,"malus":2} }
  },
  {
  id: "63",
  texte: "Le son d'un glas retentit dans le paysage désolé. Les volets des fenêtres se ferment en claquant, mais des regards continuent de vous observer à travers des meurtrières aménagées dans le mur. Vous faites arrêter vos hommes devant les larges portes de la taverne. « Nous sommes des soldats du Sommerlund, annoncezvous, nous cherchons un abri pour la nuit et du fourrage pour nos montures. » Après un long moment de silence, une voix vous répond enfin. Pour savoir ce qu'elle vous dit, tirez un chiffre à l'aide de la Table de Hasard.",
  choix: [
    { texte: "Si ce chiffre est de 0 à 4", vers: "259" },
    { texte: "De 5 à 9", vers: "95" }
  ]
  },
  {
  id: "64",
  texte: "En dehors du puits et du tunnel par lequel vous êtes entré, il existe une troisième issue qui vous permet de quitter cette salle: c'est un escalier en colimaçon aménagé devant le mur nord.",
  choix: [
    { texte: "Si vous souhaitez monter les marches de cet escalier", vers: "170" },
    { texte: "Si vous préférez descendre l'escalier", vers: "228" }
  ]
  },
  {
  id: "65",
  texte: "Lorsque vous marchez dessus, les champignons roses éclatent en laissant échapper des nuages de spores dans le tunnel. Les spores vous piquent les yeux et vous empêchent de respirer. Vous continuez d'avancer à l'aveuglette d'un pas chancelant, mais à peine avez-vous émergé de ce nuage qu'un autre danger vous menace. Une nuée de reptiles hideux dotés d'ailes de chauvesouris volent dans votre direction. Leurs pattes couvertes d'écaillés enserrent des morceaux pointus de stalagmites. Il vous est impossible d'échapper au combat et vous devrez affronter ces créatures en les considérant comme un seul et même ennemi.",
  suite: "298",
  combat: { nom: "Démons des Souterrains", habilete: 20, endurance: 10 }
  },
  {
  id: "66",
  texte: "Vous atterrissez sur le sol en roulant sur vous-même. Le Vassagonien bondit à votre suite, espérant vous porter un coup mortel avant que vous n'ayez pu vous relever. Mais il ne semble pas se rendre compte qu'il a affaire à un Seigneur Kaï. Vous le frappez, en effet, alors qu'il n'a pas encore touché terre et il s'effondre à côté de vous, tué sur le coup. Le capitaine Gayal passe en courant à votre gauche. Il mène une contre-offensive à la tête de ses meilleurs combattants et repousse l'ennemi vers la barricade. Bientôt les lignes adverses sont anéanties et les attaquants qui ont survécu aux coups portés par les soldats du capitaine sont abattus par ses archers, tandis qu'ils tentent de s'enfuir dans la plaine.",
  choix: [
    { texte: "À peine le cri de victoire des soldats du Sommerlund a-t-il retenti qu'il vous faut faire face à une nouvelle et redoutable attaque", vers: "124" }
  ]
  },
  {
  id: "67",
  texte: "Vos hommes sont affamés et épuisés, mais leur confiance dans l'infaillibilité de votre intuition de Seigneur Kaï reste inébranlable. Vous donnez donc le signal du départ. Lorsque vous arrivez à la sortie de la ville, cependant, vous entendez un sifflement. Un patrouilleur à côté de vous pousse alors un hurlement de douleur : un disque d'acier aux bords acérés vient de s'enfoncer dans sa poitrine. Plusieurs autres disques sont aussitôt lancés depuis les toits. L'un d'eux vous écorche le dos de la main avant de se loger dans l'encolure de votre cheval. Vous êtes projeté à terre et vous perdez 1 point d'ENDURANCE. Vous vous relevez et vous vous mettez à courir en direction d'un chariot pour vous y abriter. Deux de vos hommes sont étendus sur le sol, tués par les disques d'acier, mais les autres ont pu fuir l'embuscade et s'éloignent de la ville au galop, cachés par des nuages de poussière. Soudain, vous apercevez un Guerrier Pillard qui se tient debout sur un balcon proche. Il a la peau sombre, des cheveux et une barbe d'un noir huileux. A cet instant, il fait un geste de la main et un disque mortel jaillit dans votre direction. Sinon, utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez la Discipline Kaï de la Chasse ou celle de la Maîtrise Psychique de la Matière, ajoutez 2 au chiffre que vous aurez tiré.",
  suite: "62",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "292" }
  ],
  effets: { endurance: -1 },
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "242", texte: "Si le total obtenu est de 0 à 4," },
        "5-8": { vers: "263", texte: "De 5 à 8," },
        "9-11": { vers: "278", texte: "De 9 à 11," }
      }
      }
  },
  {
  id: "68",
  texte: "Il vous suffit de frapper la serrure d'un coup sec de la main pour forcer la porte du hangar à bateaux. Vous apercevez alors un bateau à rames retourné sur des tréteaux. Un seau de poix est posé au-dessous. A en juger par la couche de poussière qui couvre la coque du bateau, il semble qu'il soit resté là pendant plusieurs mois.",
  choix: [
    { texte: "Si vous souhaitez mettre ce bateau à l'eau", vers: "180" },
    { texte: "Si vous préférez fouiller le hangar dans l'espoir d'y trouver des objets utiles", vers: "213" }
  ]
  },
  {
  id: "69",
  texte: "Vous enjambez le cadavre du Garde et vous constatez alors que la corde qui pend du plafond est reliée à des broches de fixation grâce auxquelles le pont reste attaché au bord du puits. Si le Garde avait tiré sur la corde, la passerelle se serait immédiatement décrochée et vous auriez été bloqué de ce côté de la salle. Vous vous hâtez de franchir le pont au moment où vos poursuivants font leur apparition. De l'autre côté de la passerelle, vous trouvez une corde semblable également pendue au plafond, à côté de l'entrée du tunnel aménagée dans le mur ouest. Vos poursuivants sont à présent au beau milieu du pont.",
  choix: [
    { texte: "Si vous souhaitez tirer sur la corde", vers: "125" },
    { texte: "Si vous préférez vous en abstenir et vous enfuir dans le tunnel", vers: "348" }
  ]
  },
  {
  id: "70",
  texte: "Les feux de camp allumés le long de la grand-route vous permettent de repérer votre chemin dans la forêt. Les Guerriers Pillards sont rassemblés autour des flammes cherchant quelque réconfort dans leur chaleur. De toute évidence ils négligent leur tour de garde et vous n'avez aucune difficulté à éviter leurs patrouilles. Au matin, vous avez atteint la lisière de la forêt. Devant vous s'étendent des champs de blé; vous apercevez audelà un petit village niché au fond d'une vallée peu profonde. Quelques sentiers étroits traversent les champs et vous distinguez des essaims d'insectes qui volettent çà et là. Vous marchez le long d'un de ces sentiers, lorsque vous apercevez soudain des brigands qui se dirigent vers vous, leurs lances jetées sur l'épaule. Ils avancent d'un pas insouciant, comme s'ils se promenaient.",
  choix: [
    { texte: "Si vous possédez un Médaillon d'Onyx", vers: "305" },
    { texte: "Si vous souhaitez vous cacher parmi les épis de blé", vers: "159" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Camouflage et que vous ayez atteint le rang Kaï de Gardien (ou un rang supérieur)", vers: "49", requis: {"discipline":"camouflage"} }
  ]
  },
  {
  id: "71",
  texte: "Tandis que le Guerrier tombe mort à vos pieds, vous vous retournez vers vos hommes. Vous constatez alors avec horreur que trois d'entre eux sont étendus sur les marches, tués par des carreaux d'arbalète. Le quatrième est blessé et cerné par l'ennemi. D'autres Gardes arrivent à ce moment. « Fuyez, Seigneur Kaï, fuyez pendant qu'il en est encore temps ! » vous crie le patrouilleur. A peine l'écho de ces paroles a-t-il retenti qu'une épée lui transperce le cœur. Vous vous précipitez aussitôt en direction d'un tunnel orienté au nord. Une porte est ouverte à l'entrée de ce tunnel ; vous la claquez derrière vous dès que vous l'avez franchie et vous tirez le verrou.",
  choix: [
    { texte: "Vous courez ensuite le long du souterrain au sol couvert de poussière en priant le ciel que la porte tienne et garde vos poursuivants à distance", vers: "348" }
  ]
  },
  {
  id: "72",
  texte: "Les plates étendues du Pays Sauvage n'offrent aucun abri pour vous cacher des brigands. Pour essayer d'éviter un combat contre un ennemi qui vous surpasse largement en nombre, il vous faut séparer votre troupe en deux et prendre la fuite en espérant pouvoir distancer vos poursuivants. Vous prenez dix hommes avec vous et vous envoyez les autres en direction de l'ouest, dans l'espoir qu'ils attireront les brigands vers les monts Durncrag.",
  choix: [
    { texte: "Vous jetez un dernier regard à l'ennemi, puis vous partez au galop menant vos dix patrouilleurs le long de la voie de Ruanon", vers: "211" }
  ]
  },
  {
  id: "73",
  texte: "Vous vous approchez de l'autel dans un mouvement tournant en restant hors de portée du poignard à la lame enflammée. De son autre main, Barraka dégaine alors son cimeterre et tente de vous frapper de sa lame brillante comme un miroir. Il vous rate cependant.",
  choix: [
    { texte: "Si vous possédez un flacon d'Eau Bénite", vers: "283" },
    { texte: "Si vous possédez le Glaive de Sommer", vers: "325" },
    { texte: "Si vous ne possédez ni l'un ni l'autre", vers: "122" }
  ]
  },
  {
  id: "74",
  texte: "La nuit se déroule sans incident et vous vous sentez bien reposé après ces heures de sommeil. Vous gagnez aussitôt 1 point d'ENDURANCE. Vous levez le camp, puis vous pénétrez dans la forêt qui s'étend sur les versants de la vallée. Votre instinct de guerrier vous avertit que la grand-route constitue un lieu idéal pour une embuscade. Les arbres au feuillage dense qui la bordent offrent en effet une excellente cachette pour d'éventuels agresseurs. Afin de prévenir une attaque surprise, vous envoyez trois de vos hommes en reconnaissance avec ordre de signaler tout élément suspect. Après avoir parcouru une certaine distance, vous découvrez la carcasse d'un chariot calciné abandonné sur le bas-côté de la route. Derrière, un sentier s'éloigne vers l'est en remontant les collines. Vos éclaireurs, qui auraient dû vous informer de l'existence du chariot, n'ont pas donné signe de vie.",
  choix: [
    { texte: "Si vous souhaitez examiner les débris du chariot", vers: "38" },
    { texte: "Si vous préférez ne pas y prêter attention et poursuivre votre chemin le long de la route", vers: "175" },
    { texte: "Enfin, si vous souhaitez explorer le sentier qui mène dans les collines", vers: "293" }
  ]
  },
  {
  id: "75",
  texte: "A peine le Guerrier s'est-il effondré sur le sol qu'un autre vous attaque par le flanc. Au moment où vous vous tournez pour lui faire face, la pointe de sa lance vous atteint au bras gauche et vous perdez 2 points d'ENDURANCE. Vous vous recroquevillez sous l'effet de la douleur puis, poussé par d'autres combattants, vous glissez et vous tombez sur le sol déjà couvert de cadavres. Vous apercevez alors une porte ouverte et vous rampez dans cette direction. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous maîtrisez la Discipline Kaï du Camouflage, ajoutez 3 au chiffre que vous aurez tiré.",
  suite: "200",
  effets: { endurance: -2 },
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-5": { vers: "192", texte: "Si vous obtenez un total de 0 à 5," },
        "6-12": { vers: "16", texte: "De 6 à 12," }
      }
      }
  },
  {
  id: "76",
  texte: "Les Gardes refusent de répondre à vos questions. Le châtiment que leur ferait subir leur chef s'ils le trahissaient semble leur faire beaucoup plus peur que d'éventuelles tortures infligées par vos hommes. Tout ce que vous pouvez conclure en observant leurs uniformes et leur comportement, c'est qu'ils appartiennent à la même horde de brigands que celle qui vous a attaqué auparavant.",
  choix: [
    { texte: "Si vous souhaitez les fouiller", vers: "268" },
    { texte: "Si vous préférez quitter les lieux", vers: "64" }
  ]
  },
  {
  id: "77",
  texte: "Un rictus cruel déforme son visage repoussant. Vous l'entendez parler dans votre tête, bien que ses lèvres restent immobiles: ce Guerrier est doté d'une puissante force mentale. Si vous ne maîtrisez pas la Discipline Kaï du Bouclier Psychique, vous perdrez 1 point d'ENDURANCE supplémentaire à chaque Assaut au cours du combat que vous livrerez contre lui. Votre adversaire est invulnérable à votre propre Puissance Psychique.",
  choix: [
    { texte: "CAPITAINE VASSAGONIEN HABILITÉ: 22 ENDURANCE: 28 Vous aurez le droit de prendre la fuite après avoir mené au moins 2 Assauts", vers: "98" },
    { texte: "Si vous sortez vainqueur du combat", vers: "10" }
  ]
  },
  {
  id: "78",
  texte: "Lorsque vous vous approchez, ils font glisser leur capuchon de leur tête, laissant apparaître des visages souriants. Ils semblent soulagés de pouvoir établir un contact amical dans ces terres inhospitalières. Ni l'un ni l'autre ne prononcent le moindre mot, mais tous deux ôtent de leur cou des Amulettes accrochées à des chaînettes. Ils vous donnent ainsi un moyen de les identifier. En effet, les petits poissons de bois qu'ils vous montrent sont les symboles d'un Ordre Saint dont les membres sont appelés « les Rédempteurs ». Il s'agit d'une communauté de pèlerins contemplatifs qui consacrent leur vie à la prière et à l'étude de l'art de la Guérison. L'un des pèlerins vous offre un petit flacon de terre cuite rempli d'Eau Bénite. Si vous souhaitez conserver ce flacon, inscrivez-le sur votre Feuille d'Aventure, dans la case Objets Spéciaux. Vos hommes établissent le campement sous le dôme de marbre et vous vous préparez tous à une bonne nuit de sommeil.",
  suite: "233",
  choix: [
    { texte: "Vous êtes affamé et il vous faut à présent prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE", vers: "233" }
  ],
  effets: { objets: [{"id":"eau-benite"}], repasObligatoire: true }
  },
  {
  id: "79",
  texte: "Vous parvenez tant bien que mal à vous relever et vous avancez d'un pas chancelant le long du sentier forestier qui monte vers les contreforts de la chaîne de Maaken. Soudain, le sentier s'arrête à l'entrée d'une galerie de mines à moitié dissimulée par des feuillages. Il s'agit là sans aucun doute d'un tunnel désaffecté qui donne accès aux mines de Maaken dont le réseau souterrain sillonne les profondeurs des montagnes de la région. Si vous parvenez à découvrir l'un des principaux puits de la mine, vous devriez pouvoir atteindre Ruanon en passant par ces galeries souterraines. Dès que vous avez pénétré dans le tunnel, vous trouvez une caisse brisée qui contient 5 Torches et 1 Briquet d'Amadou. Il règne une totale obscurité dans cette galerie et vous aurez besoin d'au moins 1 Torche pour vous éclairer. Vous pouvez cependant prendre autant de Torches que vous le souhaiterez, chacune d'elles comptant pour un objet dans votre Sac à Dos. Le tunnel est glacial et peu accueillant. Vous le parcourez pendant plus d'un kilomètre et demi avant d'arriver à un croisement. Là, un autre tunnel bifurque en direction du sud.",
  suite: "117",
  choix: [
    { texte: "Il semble avoir été creusé plus récemment et vous l'empruntez dans l'espoir de découvrir l'un des puits principaux de la mine", vers: "117" }
  ],
  effets: { objets: [{"id":"torche","quantity":5},{"id":"briquet"}] }
  },
  {
  id: "80",
  texte: "Bien que le feu ait complètement détruit tout signe distinctif qui aurait pu l'identifier, vous parvenez à reconnaître dans ces débris calcinés un chariot militaire ayant appartenu à la cavalerie du Sommerlund. C'est l'un des trois véhicules que le capitaine Gayal et ses hommes escortaient au moment de leur disparition. Ce chariot transportait des vivres et du matériel à son départ de Holmgard, il y a un mois, mais il ne reste plus de son chargement que des tas de cendres.",
  choix: [
    { texte: "Après vous être assuré qu'aucun indice pouvant vous renseigner sur le sort du capitaine Gayal ne vous a échappé, vous remontez en selle et vous menez vos hommes en direction du sud le long de la grand-route", vers: "175" }
  ]
  },
  {
  id: "81",
  texte: "Les cris rauques du Garde retentissent dans le tunnel. Vous parvenez bientôt à une bifurcation où des travaux sont en cours. Au milieu du tunnel, un étai soutient une poutre affaissée. Si vous réussissiez à dégager cet étai, vous pourriez provoquer un éboulement qui bloquerait le passage derrière vous. Vous entendez à présent des bruits de pas précipités vous indiquant que plusieurs Gardes courent dans votre direction.",
  choix: [
    { texte: "Si vous souhaitez essayer d'abattre l'étai", vers: "173" },
    { texte: "Si vous préférez vous en abstenir et continuer à fuir le long du tunnel", vers: "224" }
  ]
  },
  {
  id: "82",
  texte: "Vous avez parcouru un kilomètre et demi environ, lorsque vous découvrez la carcasse d'un chariot brûlé abandonné au bord de la route. Derrière l'épave, un sentier disparaît vers l'est en montant dans les collines.",
  choix: [
    { texte: "Si vous souhaitez examiner le chariot", vers: "337" },
    { texte: "Si vous préférez ne pas y prêter attention et poursuivre votre chemin", vers: "297" },
    { texte: "Enfin, s'il vous semble opportun d'explorer le sentier montant dans les collines", vers: "15" }
  ]
  },
  {
  id: "83",
  texte: "L'escalier mène à un niveau inférieur où un passage vous permet de vous diriger vers le sud. Vous venez juste de pénétrer dans ce tunnel, lorsqu'une patrouille de Gardes surgit soudain, franchissant une porte dissimulée dans la paroi, un peu plus loin. Vous vous ruez parmi eux en les bousculant de tous côtés et vous parvenez à vous enfuir avant qu'ils n'aient eu le temps de dégainer leurs armes.",
  choix: [
    { texte: "Leurs cris de fureur retentissent à vos oreilles tandis que vous courez à toutes jambes en direction d'une faible lueur aperçue au loin", vers: "199" }
  ]
  },
  {
  id: "84",
  texte: "Dans la faible lumière qui règne à l'intérieur, vous apercevez un vieil homme assis à une table. Seules les flammes vacillantes d'un feu de bois éclairent ce taudis malodorant. Elles répandent cependant suffisamment de clarté pour vous permettre de distinguer les tas de parchemins et d'instruments étranges qui encombrent les lieux. L'homme détache lentement son regard d'une grande sphère de cristal et vous invite à vous asseoir en face de lui. « Comment se fait-il que vous connaissiez mon nom ? » lui demandez-vous avec méfiance. « Notre rencontre était depuis longtemps écrite dans les étoiles, Loup Solitaire, répliquet-il en effleurant la sphère de ses mains ridées. Mais ne vous alarmez pas, je ne souhaite que vous aider. » Il sort alors d'une poche de sa toge un rouleau de parchemin qu'il vous tend. Sur ce parchemin sont écrits ces quelques vers: Au soir de pleine lune, en un temple profond, Sacrifice viendra à jamais réveiller Les légions d'un Seigneur trop longtemps oublié, Quand mourra sur l'autel h vierge aux cheveux blonds, Des gorges de Maaken les morts se lèveront Pour exiger enfin la rançon des guerriers. Vous demandez la signification de cette étrange strophe, mais le vieil homme ne vous répond pas. Il semble être entré dans une transe profonde. Vous vous penchez pardessus la table encombrée pour essayer de le réveiller et vous êtes alors stupéfait de constater que votre main passe à travers son corps. Peu à peu, son image s'estompe et, quelques secondes plus tard, il a complètement disparu.",
  choix: [
    { texte: "Vous glissez le Parchemin dans votre poche (inscrivez-le sur votre Feuille d'Aventure dans la case Objets Spéciaux), puis vous vous hâtez de quitter la masure en essuyant la sueur froide qui perle à votre front", vers: "273" }
  ]
  },
  {
  id: "85",
  titre: "Mort — §85",
  texte: "Vous essayez de dégainer votre arme, mais cette créature est trop rapide pour vous. Ses crocs s'enfoncent dans votre colonne vertébrale et bientôt vous sentez le sang se retirer de votre corps qui reste paralysé. Vous entendez votre arme tomber sur le sol, puis vous vous effondrez face contre terre, votre visage heurtant la pierre dure. Vous ne ressentez cependant aucune douleur: toute sensibilité vous a en effet quitté et, quelques instants plus tard, vous poussez votre dernier soupir. Votre mission s'achève ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §85"
  },
  {
  id: "86",
  texte: "Vous bondissez sur un chariot renversé et vous apercevez en même temps deux soldats qui, à l'aide de leurs tuniques, étouffent les flammes des vêtements du capitaine Gayal. Vous adressez des prières au ciel pour qu'il survive à ses brûlures et qu'il soit encore temps de rassembler ses hommes dispersés. L'ennemi a atteint le périmètre en ruines de Ruanon et poursuit maintenant son avancée à l'abri des pans de murs encore debout. Vous lancez des ordres aux hommes du capitaine Gayal pour qu'ils reviennent en hâte vers la barricade. Vos adversaires cependant ne sont plus qu'à une centaine de mètres.",
  choix: [
    { texte: "Est-il trop tard pour repousser leur attaque ?", vers: "186" }
  ]
  },
  {
  id: "87",
  texte: "Le garde est bientôt rejoint par plusieurs de ses compagnons qui se lancent à votre poursuite. Vous entendez derrière vous leurs pas précipités et leur respiration haletante. Soudain, le tunnel se rétrécit et bifurque.",
  choix: [
    { texte: "Si vous souhaitez prendre à gauche", vers: "199" },
    { texte: "Si vous préférez aller à droite", vers: "208" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens ou de l'Orientation", vers: "60", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "88",
  texte: "Une odeur fétide vous monte aux narines en vous donnant des haut-le-cœur et en vous étouffant à moitié. Vous vous protégez la bouche et le nez, puis vous faites un pas en arrière en brandissant votre arme, prêt à frapper la créature qui ondule vers vous à une allure impressionnante. Vos hommes portent des coups d'épée à ses mâchoires grandes ouvertes, mais leurs lames ne font qu'égratigner la peau grise et luisante du monstre avant que celui-ci les avale vivants. Le Ver de Pierre poursuit inexorablement son avance et il est bientôt sur vous : impossible de vous échapper, vous devrez le combattre jusqu'à la mort de l'un de vous deux. Cette créature est invulnérable à la Discipline Kaï de la Puissance Psychique.",
  choix: [
    { texte: "Si vous remportez la victoire", vers: "321" }
  ]
  },
  {
  id: "89",
  texte: "Vous vous frayez un chemin en portant des coups de tous côtés aux bandits qui vous encerclent, guidant votre cheval par la simple pression de vos genoux. Vous apercevez un peu plus loin une éminence de terre boueuse vers laquelle vous vous précipitez dans l'espoir de pouvoir rassembler vos hommes. Vous approchez du sommet de l'éminence lorsqu'un Guerrier vêtu d'une armure vous attaque par le flanc, sa lance pointée vers votre gorge. Il vous est impossible de fuir, vous devrez le combattre jusqu'à la mort de l'un de vous deux.",
  suite: "7",
  combat: { nom: "Guerrier Pillard", habilete: 17, endurance: 26 }
  }
];
