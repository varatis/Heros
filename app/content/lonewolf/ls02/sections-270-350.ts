import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 02 — La Traversée Infernale
 * Paragraphes 270 à 350. Fichier GÉNÉRÉ par
 * scripts/ls02-importer.cjs — ne pas éditer à la main : corriger
 * scripts/ls02-overrides.json puis relancer l'import.
 *
 * Texte : édition Gallimard Jeunesse (Folio Junior), traduction Camille Fabien.
 * © Joe Dever / Gary Chalk. Usage privé : les droits commerciaux restent à
 * confirmer (voir content/stories/source-pdfs/README.md).
 */
export const SECTIONS_270_350: StorySection[] = [
  {
  id: "270",
  texte: "GANON bondit de sa chaise et tire son épée. Un instant plus tard, son frère DORIER est à son côté. Il vous faut les combattre tous deux en les considérant comme un seul et même ennemi. La soudaineté de votre attaque vous permet d'ajouter 2 points à votre total d'HABILETÉ, mais lors du premier assaut seulement. Sachez également qu'en raison de la force exceptionnelle de leur volonté, ils sont insensibles à la Discipline Kaï de la Puissance Psychique.",
  suite: "33",
  combat: { nom: "Dorier et Ganon", habilete: 28, endurance: 30, immunisePsychique: true, bonusPremierAssaut: 2 }
  },
  {
  id: "271",
  texte: "Vous entrez dans la tour et vous montez un escalier de pierre ; soudain, un garde vêtu d'une armure surgit devant vous. Il est coiffé d'un heaume et il porte un écusson gravé d'un vaisseau noir et d'une crête rouge. Il s'avance vers vous et tire son épée.",
  choix: [
    { texte: "« Halte-là ! lance-t-il, donnez le mot de passe ! » Si vous maîtrisez la Discipline Kaï du Camouflage", vers: "151", requis: {"discipline":"camouflage"} },
    { texte: "Si vous souhaitez l'attaquer", vers: "157" },
    { texte: "Si vous préférez prendre la fuite en vous précipitant hors de la tour", vers: "65" }
  ]
  },
  {
  id: "272",
  texte: "Quelqu'un ou quelque chose s'approche de la porte de la cale, de l'autre côté du panneau. Si vous essayez de vous hisser sur le pont délabré, vos jambes seront exposées et vous serez vulnérable à toute attaque venant du fond de la cale. Il n'y a cependant pas d'autre issue. Compte tenu de la situation, la meilleure chose à faire est de dégainer le Glaive de Sommer et de vous préparer à combattre la créature malfaisante et redoutable dont vous percevez la présence.",
  choix: [
    { texte: "", vers: "5" }
  ]
  },
  {
  id: "273",
  texte: "Vous vous apprêtez à frapper, mais votre adversaire s'écrie: «Je suis Ronan, my lord, et je ne vous veux aucun mal ! » Vous détournez votre coup de justesse et votre arme s'abat dans le vide. La sueur qui perle sur le visage du marin semble confirmer qu'il dit bien la vérité.",
  choix: [
    { texte: "Rengainez votre arme et", vers: "160" }
  ]
  },
  {
  id: "274",
  texte: "En fouillant rapidement les corps, vous trouvez une Épée, 6 Pièces d'Or et une Masse d'Armes. Emportez ce que vous voulez le cas échéant, sans oublier de modifier en conséquence votre Feuille d'Aventure. Avant que vous ayez eu le temps de sortir par la porte de devant, d'autres villageois furieux ont réussi à pénétrer dans la boutique et vous devez à présent vous enfuir par la fenêtre du premier étage.",
  choix: [
    { texte: "Emporter l'Épée, la Masse d'Armes et 6 PO", vers: "132", effets: { or: 6, objets: [{"id":"epee"},{"id":"masse"}] } },
    { texte: "Ne rien emporter", vers: "132" }
  ]
  },
  {
  id: "275",
  titre: "Le poison a eu raison de vous",
  texte: "Vous vous sentez de plus en plus faible et la mort bientôt vous est un soulagement. Votre assassin a parfaitement rempli sa mission. Quant à la vôtre, elle s'achève ici.",
  fin: "mort",
  nomFin: "Le poison de la taverne de Ragadorn"
  },
  {
  id: "276",
  titre: "Le bras de fer de la taverne",
  texte: "Un MARIN à la mine patibulaire défie quiconque veut l'entendre d'engager avec lui une partie de bras de fer. Il a une telle confiance dans sa force qu'il se déclare prêt à payer 5 Pièces d'Or à celui qui réussira à le vaincre. Lorsque vous vous approchez de sa table, une servante vous glisse quelques mots à l'oreille. « Méfiez-vous, étranger, dit-elle, cet homme est dangereux, il casse le bras de tous ceux qui perdent contre lui et il tue ceux qui parviennent à le battre. » Et tandis que vous vous asseyez à la table, face au marin, les autres clients de la taverne prennent les paris sur l'issue de la partie. Dans le cas contraire, menez cette partie de bras de fer comme s'il s'agissait d'un combat. Le premier dont le total d'ENDURANCE sera descendu à zéro aura perdu.",
  choix: [
    { texte: "Écraser le marin grâce à la Puissance Psychique", vers: "14", requis: {"discipline":"puissance-psychique"} },
    { texte: "Relever le défi du bras de fer", vers: "276-a" }
  ],
  combat: { nom: "Marin patibulaire", habilete: 18, endurance: 25 }
  },
  {
  id: "276-a",
  titre: "Bras de fer",
  texte: "Vous saisissez la main du marin. Autour de vous, les paris volent. Menez cette lutte comme un combat : le premier dont l'Endurance tombe à zéro a perdu.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Le bras de fer",
        texte: "La lutte fait rage, les paris volent. Table de Hasard : de 0 à 4, le marin l'emporte (vous récupérez vos points d'Endurance). De 5 à 9, vous gagnez les 5 Pièces d'Or promises.",
        ton: "mystere",
        branches: {
        "0-4": { vers: "192", texte: "Le marin gagne le bras de fer, mais la serveuse écarte ses complices à coups de massue." },
        "5-9": { vers: "276-b", texte: "Vous écrasez le bras du marin sur la table : la foule exulte." }
      }
      }
  },
  {
  id: "276-b",
  titre: "Les 5 Pièces promises",
  texte: "Le marin s'écroule, le bras écrasé sur la table. La foule exulte et vous ramassez les 5 Pièces d'Or promises, sous l'œil furieux de ses complices.",
  suite: "305",
  effets: { or: 5 }
  },
  {
  id: "277",
  texte: "Tandis que Rhygar et ses hommes se rapprochent des cavaliers, l'un d'eux tire de sous sa cape un bâton noir. Une flamme bleue étincelante jaillit alors de son extrémité et vient frapper le cheval du Lieutenant Général qui est aussitôt projeté à bas de sa monture et tombe cul pardessus tête dans l'épaisseur des broussailles. Les hommes de Rhygar se lancent à l'attaque, leurs épées brandies, et pourfendent les cavaliers aux longues capes. Mais les lames d'acier n'ont aucun effet sur l'ennemi, car ce ne sont pas des hommes que vous avez devant vous, ce sont des Monstres d'Enfer, les féroces serviteurs des Maîtres des Ténèbres. Ces créatures redoutables ont la faculté d'adopter l'apparence des hommes, mais restent invulnérables aux armes ordinaires. L'être au bâton noir éclate alors d'un rire terrifiant et une douleur fulgurante vous déchire la tête. Il vient d'utiliser contre vous sa formidable Puissance Psychique ; la situation est inquiétante : vous êtes en effet dominé par un ennemi supérieur en nombre et il va falloir agir vite si vous voulez survivre à cette attaque. Souhaitez-vous abandonner votre cheval et plonger dans les broussailles pour vous y cacher?",
  choix: [
    { texte: "", vers: "311" },
    { texte: "Si vous préférez prêter main forte aux hommes de Rhygar", vers: "59" }
  ]
  },
  {
  id: "278",
  texte: "Vous agitez désespérément votre cape au-dessus de vous jusqu'à ce que vous soyez au bord de l'épuisement. Utilisez la Table de Hasard pour obtenir un chiffre qui vous indiquera si vos efforts ont été couronnés de succès.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-6": { vers: "41", texte: "Si vous tirez un chiffre entre 0 et 6," },
        "7-9": { vers: "180", texte: "Si vous obtenez 7, 8 ou 9," }
      }
      }
  },
  {
  id: "279",
  texte: "Cette créature est un Noudic. Les Noudics sont des êtres doués d'intelligence qui vivent dans un dédale de puits et de couloirs creusés au sein des Monts d'Hammardal. De tempérament malicieux, ils subsistent en volant de la nourriture dans les chariots des marchands qui empruntent le tunnel de Tarnalin. Les Noudics pourraient peut-être vous renseigner sur la présence éventuelle de Monstres d'Enfer cachés dans le tunnel.",
  choix: [
    { texte: "Si vous souhaitez suivre cet animal", vers: "23" },
    { texte: "Si vous préférez le laisser filer et poursuivre votre chemin", vers: "340" }
  ]
  },
  {
  id: "280",
  texte: "Vous dormez profondément jusqu'à l'aube sans être dérangé. A votre réveil, vous ramassez vos affaires et vous allez rejoindre les autres à bord de la diligence. Pendant deux jours, la diligence file sur la route qui traverse les étendues plates et désolées du Pays Sauvage, en ne faisant halte, de temps à autre, que pour permettre au cocher de prendre quelque repos. Vous êtes arrivé au matin du 9e jour de votre quête lorsqu'un malheureux accident se produit. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "2", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "108", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "281",
  texte: "Vous demandez avec insistance au capitaine de recueillir les malheureux naufragés, mais il reste indifférent à vos prières et ordonne aux hommes d'équipage de poursuivre leurs tâches comme si de rien n'était. Vous voyez le canot disparaître à l'horizon et vous avez alors la prémonition qu'un sort semblable vous attend. Troublé par cette pensée, vous descendez au pont inférieur pour vous retirer dans votre cabine.",
  choix: [
    { texte: "", vers: "240" }
  ]
  },
  {
  id: "282-b",
  titre: "Second soldat du pont",
  texte: "Le premier soldat bascule par-dessus le parapet du pont ; le second tourne sa lance vers vous.",
  suite: "187",
  combat: { nom: "Soldat du pont", habilete: 16, endurance: 22 }
  },
  {
  id: "282",
  titre: "Les soldats du pont de Ryner",
  texte: "De la pointe de leurs lances, les SOLDATS essaient de vous repousser. Et tandis que vous levez votre arme sur l'un d'eux, l'autre vous contourne pour vous attaquer par-derrière. Il vous est impossible de prendre la fuite et vous allez devoir les combattre à tour de rôle jusqu'à la mort.",
  suite: "282-b",
  choix: [
    { texte: "1er SOLDAT DU PONT HABILETÉ : 16 ENDURANCE : 24 2e SOLDAT DU PONT HABILETÉ : 16 ENDURANCE : 22 Si vous êtes vainqueur", vers: "187" }
  ],
  combat: { nom: "Soldat du pont", habilete: 16, endurance: 24 }
  },
  {
  id: "283",
  texte: "Vous êtes impressionné par l'abondance et la diversité des marchandises exposées : il y a là des soies et des épices en provenance des bazars de Vassagonia, des pierres précieuses des mines de Bor, les plus belles armes et cuirasses forgées par les armuriers de Durenor, des fourrures de Kalte, des étoffes de Cloeasia et sur toutes les tables les mets et les boissons les plus variés qui s'offrent à l'appétit des visiteurs. Au centre du magasin, les prix de toutes les marchandises sont indiqués sur de grandes peaux de chèvre suspendues au plafond. L'une de ces listes attire tout particulièrement votre attention : en voici le détail : EPEES 4 Couronnes pièce POIGNARDS 2 Couronnes pièce GLAIVES 6 Couronnes pièce LANCES 5 Couronnes pièce METS DÉLICATS 2 Couronnes par Repas ANNEAUX D'OR 8 Couronnes pièce COUVERTURES DE FOURRURE 3 Couronnes pièce SACS A DOS 1 Couronne pièce Si vous avez suffisamment d'argent pour cela, vous pourrez acheter ce qui vous plaira dans la liste ci-dessus.",
  choix: [
    { texte: "Consacrer votre attention aux marchandises exposées", vers: "283-a" },
    { texte: "Quitter le magasin par la porte latérale", vers: "245" }
  ]
  },
  {
  id: "283-a",
  titre: "Les prix du grand magasin",
  texte: "La liste suspendue au plafond affiche : ÉPÉES 4 Couronnes · POIGNARDS 2 · GLAIVES 6 · LANCES 5 · METS DÉLICATS 2 le Repas.",
  choix: [
    { texte: "Acheter une Épée (4 PO)", vers: "283-a", requis: {"or":4}, effets: { or: -4, objets: [{"id":"epee"}] } },
    { texte: "Acheter un Poignard (2 PO)", vers: "283-a", requis: {"or":2}, effets: { or: -2, objets: [{"id":"poignard"}] } },
    { texte: "Acheter un Glaive (6 PO)", vers: "283-a", requis: {"or":6}, effets: { or: -6, objets: [{"id":"glaive"}] } },
    { texte: "Acheter une Lance (5 PO)", vers: "283-a", requis: {"or":5}, effets: { or: -5, objets: [{"id":"lance"}] } },
    { texte: "Acheter un Repas (2 PO)", vers: "283-a", requis: {"or":2}, effets: { or: -2, objets: [{"id":"repas"}] } },
    { texte: "Quitter le magasin par la porte latérale", vers: "245" }
  ]
  },
  {
  id: "284",
  titre: "Le barrage de la forêt de Durenor",
  image: "/lonewolf/ls02/p158-x834.webp",
  texte: "Les soldats vous encerclent et confisquent votre Sac à Dos et vos armes ; puis le chevalier s'avance vers vous et lève la visière de son heaume. « Qui êtes-vous ? Que venez vous faire à Tarnalin ? » demande-t-il d'une voix rude. Vous lui répondez que vous êtes un Seigneur Kaï du Sommerlund porteur d'un message urgent destiné au roi Alin. Il ne semble pas très convaincu jusqu'au moment où vous lui montrez le Sceau d'Hammardal. Dès lors, sans la moindre hésitation, il ordonne à ses hommes de vous rendre votre bien et il vous fait franchir le barrage de chariots. Derrière, un carrosse est stationné, au milieu du tunnel encombré. «A Hammardal, et vite ! » ordonne-t-il au cocher en vous entraînant à l'intérieur. Vous avez à peine eu le temps de vous asseoir que les chevaux s'élancent au grand galop. Le chevalier vous apprend bientôt qu'il se nomme Lord Axim de Ryner et qu'il est le commandant de la garde personnelle du roi. Il se rendait à Port Bax lorsque les Monstres d'Enfer ont envahi le tunnel. La terrible bataille qui s'est ensuivie n'a laissé dans ses rangs que onze rescapés : lui-même et dix de ses soldats. La faim vous tenaille tandis que vous filez dans le tunnel de Tarnalin et il vous faut prendre aussitôt un Repas, sinon, vous perdrez 3 points d'ENDURANCE. Le voyage jusqu'à la capitale durera cinq heures et Lord Axim vous conseille de vous reposer quelque peu d'ici à votre arrivée. Vous vous laissez alors gagner par le sommeil et dans un songe vous vous voyez revenir triomphalement à Holmgard en brandissant le Glaive de Sommer ; la suite du rêve vous montre la défaite cuisante des Maîtres des Ténèbres. Peut-être s'agit-il d'une vision prémonitoire ?",
  choix: [
    { texte: "", vers: "9" }
  ],
  effets: { repasObligatoire: true }
  },
  {
  id: "285",
  texte: "Vous sentez les crochets du serpent s'enfoncer dans la manche de votre tunique, mais rien de plus. Vous avez de la chance : seul votre vêtement a souffert de la morsure. Le serpent s'enfuit aussitôt et disparaît dans l'herbe haute ; vous vous hâtez alors de grimper à l'arbre pour passer le reste de la nuit à l'abri de son feuillage, à bonne distance du sol.",
  choix: [
    { texte: "", vers: "312" }
  ]
  },
  {
  id: "286",
  texte: "Vous tombez à la mer et vous nagez sous l'eau pendant plus d'une minute pour éviter de recevoir sur la tête les brandons qui jaillissent des navires enflammés ou les cadavres qu'on précipite par-dessus bord. Lorsque le manque d'air vous oblige enfin à refaire surface, la vision qui s'offre à vous fait renaître l'espoir d'une issue favorable.",
  choix: [
    { texte: "", vers: "109" }
  ]
  },
  {
  id: "287",
  texte: "Vous concentrez toute votre énergie de Seigneur Kaï sur la petite serrure de cuivre et, quelques instants plus tard, un déclic à l'intérieur du coffret vous indique que le pêne vient de sortir de sa gâche ; vous soulevez alors le couvercle de la boîte et vous y découvrez un parchemin frappé du Sceau Royal du Sommerlund. Le document contient des instructions confidentielles concernant votre mission. En remettant ensuite le coffret à sa place, vous vous apercevez qu'un mécanisme secret a été aménagé dans le couvercle pour faire échec aux espions : sans le secours de votre Discipline Kaï, une aiguille empoisonnée aurait jailli de la boîte et se serait enfoncée dans votre épiderme, provoquant une mort instantanée. Vous refermez les tiroirs et vous prenez bien soin d'effacer toute trace de votre fouille avant d'aller rejoindre le capitaine sur le pont du navire.",
  choix: [
    { texte: "", vers: "175" }
  ]
  },
  {
  id: "288",
  texte: "Sans prononcer un mot, le chevalier vous montre du doigt la forêt qui s'étend derrière vous et rentre à l'intérieur de la tour, dont il referme la porte à clé. C'est une forêt touffue où s'enchevêtrent parmi les arbres de hautes herbes et des buissons d'épines. Il est inutile d'essayer de la traverser à cheval et il ne vous reste donc plus qu'à abandonner votre monture pour continuer votre chemin à pied.",
  choix: [
    { texte: "", vers: "244" }
  ]
  },
  {
  id: "289",
  texte: "Vous êtes accueilli par une vieille femme vêtue de blanc des pieds à la tête. Elle vous sourit et vous offre une tasse de délicieux Jala. Mais les mésaventures que vous avez vécues à Ragadorn vous ont rendu méfiant et vous refusez poliment de boire le liquide sombre contenu dans la tasse qu'elle vous tend. Vous avez fait un geste de la main pour décliner son offre et elle a vu alors le Sceau d'Hammardal passé à votre doigt. « Quelle bague magnifique ! Est-elle à vendre ? » demande-t-elle le regard brillant de convoitise. Vous lui répliquez d'un ton ferme qu'il n'en est rien mais elle ne se contente pas de cette réponse. Elle vous propose, en échange de l'anneau, l'une des centaines de potions qui remplissent les vitrines alignées derrière le comptoir. Vous haussez les épaules sans même prendre la peine de répondre et vous vous tournez vers la porte avec la ferme intention de quitter aussitôt la boutique. A ce moment, elle vous offre 40 Pièces d'Or pour prix de l'anneau. Allezvous cette fois, accepter le marché ?",
  choix: [
    { texte: "", vers: "165" },
    { texte: "Si cette proposition ne vous fait pas changer d'avis, sortez de la boutique et", vers: "186" }
  ]
  },
  {
  id: "290",
  texte: "Ce repas sent délicieusement bon et vous vous apprêtez à le dévorer lorsque vous remarquez soudain, sur le bord de l'assiette, trois gouttes d'un liquide clair qui vous semble tout d'abord être de l'eau. Mais, lorsque vous touchez l'une de ces gouttes du bout des doigts, vous vous apercevez que le liquide est collant et vous reconnaissez aussitôt la consistance de la sève de gandum, un poison mortel, inodore et incolore, qui a la faveur des assassins de tout poil. Une fureur soudaine vous saisit alors et vous vous ruez hors de la chambre avec la ferme intention de découvrir quel est celui ou celle qui a ainsi tenté de vous supprimer.",
  choix: [
    { texte: "", vers: "200" }
  ]
  },
  {
  id: "291",
  texte: "C'est une forêt très touffue où s'enchevêtrent parmi les arbres de hautes herbes et des buissons d'épines. Vous longez la lisière du bois pour essayer de découvrir un sentier, mais sans succès ; il vous sera impossible de traverser cette forêt à cheval et vous allez devoir abandonner votre monture pour continuer votre chemin à pied.",
  choix: [
    { texte: "", vers: "244" }
  ]
  },
  {
  id: "292",
  texte: "Vous marchez sous la pluie depuis trois bonnes heures lorsque vous rencontrez soudain sept hommes à cheval qui vous barrent le passage. Ce sont des mercenaires au service du Suzerain de Ragadorn dont ils arborent l'emblème gravé sur leurs écussons : un vaisseau noir surmonté d'une crête rouge. Ils vous ordonnent de leur donner tout votre or, sinon, ils vous tueront sur place ; et lorsqu'ils s'aperçoivent que vous n'avez plus la moindre Couronne dans votre bourse, vous avez beau essayer de prendre la fuite, ils ont tôt fait de vous rattraper et de vous tailler en pièces. Alors, tandis que vous agonisez sur le bord de la route, les contours de Ragadorn se dessinent au loin : c'est la dernière vision que vous emporterez de ce monde car, un instant plus tard, vos yeux se ferment à jamais. Votre mission s'achève donc ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §292"
  },
  {
  id: "293",
  texte: "Cette route mène à une cabane abandonnée. L'intérieur en est garni de meubles recouverts d'une bonne couche de poussière. De toute évidence, il y a plusieurs mois que personne n'y est entré. La route ne va pas plus loin, c'est un cul-de-sac et vous vous rendez compte à cet instant que vous venez de perdre un temps précieux. Il ne vous reste plus qu'à rebrousser chemin jusqu'à la bifurcation et à prendre la voie de gauche.",
  choix: [
    { texte: "Hâtez-vous de", vers: "155" }
  ]
  },
  {
  id: "294",
  texte: "Vous enveloppez l'homme blessé dans une couverture, mais il a déjà sombré dans un sommeil dont il ne s'éveillera jamais plus. Vous retournez alori sur le pont où l'on a rassemblé les corps des mariiifi. Le capitaine Kelman s'approche de vous et von» montre une épée dont la seule vue donne le frisson» « Cette épée n'est pas celle d'un pirate, Loup Solitaire, déclare le capitaine, elle a été fabriquée dans les forges d'Helgedad : c'est une arme de Maître des Ténèbres. » Il jette à la mer l'épée maléfique qui disparaît dans les vagues et vous revenez tous deux à bord du Sceptre Vert. L'équipage hisse aussitôt les voiles et le navire reprend sa route vers l'est tandis que, debout sur le pont, vous contemplez avec tristesse le bateau de Durenor qui s'enfonce à jamais dans les flots.",
  choix: [
    { texte: "", vers: "240" }
  ]
  },
  {
  id: "295",
  texte: "L'une des créatures, plus grande que les autres et vêtue d'une magnifique robe de soie en patchwork, crie un ordre dans son étrange dialecte. Tous ses congénères saisissent alors des lances et des épées qui semblent avoir été taillées dans les rayons d'une roue de chariot ou dans des manches à balai. Puis ils se précipitent sur vous en poussant de curieux cris de guerre, quelque chose comme « Gashiss, Nashiss». Vous n'avez cependant pas le temps de vous intéresser à leur langage, car bientôt vous serez piétiné à mort par une véritable armée de ces petits êtres hargneux, si vous ne prenez pas immédiatement la fuite. Vous faites donc volte-face et vous courez à perdre haleine le long d'un i ouloir étroit, jusqu'à ce que leurs cris ne soient plus derrière vous qu'une faible rumeur. Quelques instants plus tard, vous parvenez au bout du passage qui débouche sur le tunnel principal. Vous pouvez l'lèsent continuer votre chemin à une allure plus tranquille.",
  choix: [
    { texte: "", vers: "340" }
  ]
  },
  {
  id: "296",
  image: "/lonewolf/ls02/p173-x905.webp",
  texte: "Les clients fuient la taverne lorsque les GARDES passent à l'attaque.",
  choix: [
    { texte: "HABILETÉ ENDURANCE Sergent de la GARDE 13 22 Caporal de la GARDE 12 20 1er GARDE 11 19 2e GARDE 11 9 3e GARDE 10 18 4e GARDE 10 17 Vous pouvez prendre la fuite à tout moment en sortant par la porte de derrière", vers: "88" },
    { texte: "Si vous parvenez à tuer tous les gardes", vers: "221" }
  ]
  },
  {
  id: "297",
  texte: "A mi-chemin de la rue, vous apercevez sur la gauche une grande écurie et un relais de diligence. Il fait complètement nuit à présent et vous décidez d'y entrer par une échelle extérieure. Vous allez pouvoir passer la nuit en toute sécurité, caché dans le grenier à foin du relais.",
  choix: [
    { texte: "", vers: "32" }
  ]
  },
  {
  id: "298",
  texte: "Vous entendez derrière vous leurs pas se précipiter et vous faites brusquement volte-face, au moment même où ils dégainent chacun un poignard pour vous attaquer. Si vous n'avez pas d'armes, vous devrez déduire 4 points de votre total d'ENDURANCE et les combattre à mains nues. Vous les affronterez un par un.",
  choix: [
    { texte: "HABILETÉ ENDURANCE Chef des VOLEURS 15 23 1er VOLEUR 13 21 2e VOLEUR 13 20 Vous avez le droit de prendre la fuite à tout moment", vers: "121" },
    { texte: "Si vous parvenez à tuer les trois voleurs", vers: "301" }
  ]
  },
  {
  id: "299",
  texte: "Vous courez pendant six heures sans vous arrêter. Les Monstres d'Enfer vous attendent sur le grand chemin et il vous faut les éviter en passant par les forêts escarpées qui s'étendent au flanc des collines. Souvent, vous vous sentez si fatigué, vos jambes vous font si mal que vous avez la tentation de tout abandonner. Mais chaque fois que vous faiblissez, le Lieutenant Général Rhygar parvient à vous redonner courage. Son endurance vous émerveille car ce n'est plus un jeune homme et il porte par surcroît la lourde armure des chevaliers du Sommerlund. A la nuit tombée, vous arrivez à l'entrée du tunnel de Tarnalin qui traverse les monts d'Hammardal. Il y a en tout trois tunnels qui mènent à la capitale de Durenor. Tous trois ont été creusés au temps de la Lune Noire et chacun d'eux fait plus de 60 kilomètres de long. Ils constituent les seules voies d'accès à la ville qui est entièrement encerclée par les montagnes. Vous pouvez à présent faire une courte halte et le Lieutenant Général Rhygard s'assied à côté de vous en prenant dans son sac du pain et des viandes. « Mangez, Loup Solitaire, dit-il alors en vous tendant cette nourriture, car vous allez avoir besoin de forces ; il vous faudra en effet parcourir seul ce tunnel qui mène à Hammardal, tandis que je resterai ici pour contenir l'ennemi aussi longtemps que je pourrai combattre. Et ne protestez pas, le succès de votre mission est la seule chose qui compte. » Mais si Rhygard veut arrêter les Monstres d'Enfer, il lui faudra une arme magique car sa propre épée ne lui servira à rien contre ces créatures.",
  choix: [
    { texte: "Si vous souhaitez lui donner votre Lance Magique pour qu'il puisse défendre l'entrée du tunnel", vers: "102" },
    { texte: "Si vous ne possédez pas cette Lance Magique ou si vous ne voulez pas vous en séparer", vers: "118" }
  ]
  },
  {
  id: "300",
  titre: "À l'abordage !",
  texte: "En arrivant à proximité du bateau, vous constatez que l'échelle de coupée a été relevée. Un marin à la mine peu engageante est accoudé au bastingage et vous lance des injures. De toute évidence, il croit que vous êtes un réfugié qui essaie de monter à bord comme passager clandestin. Mais lorsque vous lui criez que vous êtes le Loup Solitaire et que vous venez d'être trompé par un imposteur, l'échelle est à nouveau baissée. En prenant pied sur le pont, vous êtes accueilli par un homme de haute taille vêtu d'un uniforme passementé d'or. Son visage est presque entièrement caché par une abondante tignasse de cheveux roux et une grande barbe également rousse. « Levez l'ancre ! » ordonne-t-il d'une voix tonitruante. Les hommes d'équipage se précipitent aussitôt à leurs postes comme si leur vie en dépendait et se mettent au travail. Le capitaine vous conduit ensuite à sa cabine et vous offre un verre de Wanlo, l'un des alcools les plus forts qu'on puisse boire dans cette région. Vous lui faites alors le récit de ce qui vient d'arriver et vous remarquez que son visage prend une expression soucieuse. « Tout cela sent la trahison, dit-il d'un air sombre, il est clair que l'ennemi a déjà dressé des plans pour faire échouer votre mission. Il ne faut plus compter sur l'effet de surprise et, quant à moi, j'ai perdu un courageux second. Espérons au moins que la traversée jusqu'au royaume de Durenor sera sans histoire... » Vous le quittez quelques instants plus tard et vous remontez sur le pont juste à temps pour voir disparaître à l'horizon les tours de la capitale ; vous descendez ensuite dans votre propre cabine en éprouvant un sentiment mêlé d'orgueil et d'appréhension. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-1": { vers: "224", texte: "Si vous tirez 0 ou 1," },
        "2-3": { vers: "316", texte: "Avec 2 ou 3," },
        "4-5": { vers: "81", texte: "4 ou 5," },
        "6-7": { vers: "22", texte: "6 ou 7," },
        "8-9": { vers: "99", texte: "8 ou 9," }
      }
      }
  },
  {
  id: "301",
  texte: "En fouillant les cadavres, vous trouvez 3 Pièces d'Or, 3 Poignards et 1 Sabre. Si vous souhaitez emporter l'un ou l'autre de ces objets, modifiez en conséquence votre Feuille d'Aventure.",
  choix: [
    { texte: "Emporter le Sabre, un Poignard et 3 PO", vers: "20", effets: { or: 3, objets: [{"id":"sabre"},{"id":"poignard"}] } },
    { texte: "Ne rien emporter", vers: "20" }
  ]
  },
  {
  id: "302",
  texte: "Vous enjambez le corps puis vous montez l'escalier pour fouiller la tour. Au cours d'une perquisition en règle, vous trouvez les objets suivants : Masse d'Armes, Glaive, Bâton, Potion de Guérison (une dose qui vous redonne 3 points d'ENDURANCE si vous la buvez après un combat), une quantité de nourriture équivalant à 3 Repas, un Sac à Dos, 12 Pièces d'Or. Prenez ce dont vous avez besoin, modifiez en conséquence votre Feuille d'Aventure et hâtez-vous de quitter la tour de peur que quelqu'un ne découvre votre présence. La forêt qu'il vous faut traverser est très dense et vous allez devoir abandonner votre cheval pour continuer votre chemin à pied.",
  choix: [
    { texte: "Prendre le nécessaire (Masse, Glaive, Bâton, Potion, 3 Repas, 12 PO)", vers: "244", effets: { or: 12, objets: [{"id":"masse"},{"id":"glaive"},{"id":"baton"},{"id":"potion-guerison"},{"id":"repas","quantity":3}] } },
    { texte: "Ne prendre rien", vers: "244" }
  ]
  },
  {
  id: "303",
  texte: "Des amas d'ordures pourrissantes ont été déversés sur cette partie du quai et l'odeur qui s'en dégage est si pestilentielle que vous vous couvrez la bouche et le nez d'un pan de votre cape. Un peu plus loin sur votre gauche, vous apercevez la lueur d'une torche qui filtre par une porte ouverte.",
  choix: [
    { texte: "Une enseigne est accrochée au-dessus de la porte et porte cette inscription : Si vous souhaitez entrer dans le magasin", vers: "173" },
    { texte: "Si vous préférez poursuivre en direction du sud", vers: "18" }
  ]
  },
  {
  id: "304",
  texte: "Vous éprouverez peut-être quelque consolation en apprenant que votre mort a été quasiment instantanée. En quelques secondes, les doigts du Monstre d'Enfer vous ont déchiré la gorge et le Sceau d'Hammardal ne tardera pas à parvenir à Helgedad, la ville des Maîtres des Ténèbres. Votre mission s'achève ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §304"
  },
  {
  id: "305",
  texte: "Un silence pesant s'installe dans la taverne, il en faut davantage cependant pour vous impressionner et c'est avec le plus grand calme que vous ramassez les 5 Pièces d'Or posées sur la table. Vous vous dirigez ensuite vers la porte, mais, au moment où vous allez sortir, un marin d'une laideur repoussante vous bloque le passage en brandissant une épée. Un instant plus tard, alors que vous vous demandez ce qu'il convient de faire, un coup sourd résonne dans le silence de la salle et l'homme tombe à genoux sur le plancher. Vous avez la surprise de reconnaître, debout derrière lui, la servante qui tient fermement des deux mains une grosse massue de bois. Vous la remerciez d'un sourire complice, mais le temps n'est pas aux effusions et vous vous hâtez de disparaître dans l'ombre de la rue, tandis qu'à l'intérieur de la taverne des voix s'élèvent pour vous maudire. Après avoir couru pendant dix minutes dans le noir, vous apercevez un peu plus loin une grande écurie et un relais de diligence ; derrière vous retentissent des cris de marins furieux qui vous poursuivent dans la rue : pour leur échapper, vous montez quatre à quatre une échelle extérieure qui mène à un grenier. Là, vous pourrez passer la nuit en toute sécurité, blotti parmi des bottes de foin.",
  choix: [
    { texte: "", vers: "32" }
  ]
  },
  {
  id: "306",
  titre: "Le poste frontière",
  texte: "Le soldat vous donne un coup de lance en visant votre poitrine, mais vous faites un pas de côté et le fer vous écorche à peine le bras. Le GARDE est décidé à se battre ; or, vous ne voulez pas le tuer, simplement essayer de l'assommer. Menez ce combat à la manière habituelle, mais en multipliant par 2 les points d'ENDURANCE perdus par votre adversaire. Lorsque son total d'ENDURANCE sera descendu à zéro, vous aurez réussi à le mettre hors de combat. En ce qui vous concerne, tous les points d'ENDURANCE que vous perdrez lors de cet affrontement seront normalement déduits de votre total.",
  suite: "35",
  combat: { nom: "Garde Frontalier", habilete: 16, endurance: 24 }
  },
  {
  id: "307",
  texte: "Les soldats se montrent menaçants et prêts à attaquer. Il vous faut prendre une décision rapide.",
  choix: [
    { texte: "Tenter de les corrompre (5 PO)", vers: "57", requis: {"or":5}, effets: { or: -5 } },
    { texte: "Leur montrer le Sceau d'Hammardal", vers: "140", requis: {"special":"sceau-hammardal"} },
    { texte: "Dégainer votre arme et les combattre", vers: "282" }
  ]
  },
  {
  id: "308",
  titre: "Le jeu de Hublot",
  texte: "Un marin du nom de Sprogg s'est assis à côté de vous et vous explique les règles du jeu de « Hublot». Il vous montre d'abord une paire de dés en forme de diamant, taillés dans du verre rouge. Chaque dé possède dix faces numérotées de 0 à 9 ; les joueurs doivent lancer les deux dés et ajouter les chiffres obtenus. Celui qui tire deux 0 crie « Hublot » ! et gagne automatiquement. Chaque joueur mise 3 Couronnes à chaque lancer de dés. Il y a trois joueurs en tout, et chacun dépose ses Pièces d'Or dans un chapeau avant que les dés soient jetés. Utilisez la Table de Hasard pour obtenir deux chiffres. Faites ainsi deux tirages de deux chiffres qui correspondront aux scores obtenus par chacun des deux autres joueurs, puis notez le résultat de ces deux tirages consécutifs. Ensuite, la Table de Hasard vous donnera votre propre score (vous tirerez également deux chiffres pour vousmême). Si le total que vous obtenez est supérieur à celui de chacun des deux autres joueurs vous gagnerez 6 Couronnes. Si l'un des deux autres joueurs, a fait un tirage supérieur au vôtre, vous perdrez 3 Couronnes. En cas d'égalité entre deux joueurs, la partie est annulée et vous recommencez le tirage depuis le début. Vous pouvez jouer autant que vous voudrez, sans dépasser un gain maximum de 40 Couronnes. Vous avez également le droit de quitter la table de jeu quand bon vous semblera et vous êtes bien entendu obligé d'abandonner la partie si vous perdez toutes vos Pièces d'Or.",
  choix: [
    { texte: "Relancer une partie", vers: "308" },
    { texte: "Quitter la table et aller dormir", vers: "197" }
  ],
  evenement: {
        type: "jet-hasard-table",
        titre: "Le jeu de Hublot",
        texte: "Deux dés à dix faces : lancez votre score. De 0 à 5, un adversaire l'emporte (-3 PO). De 6 à 9, vous l'emportez (+6 PO). Vous pouvez relancer ou quitter la table.",
        ton: "mystere",
        branches: {
        "0-5": { texte: "Un des deux joueurs fait mieux que vous : vous perdez 3 Pièces d'Or.", or: -3 },
        "6-9": { texte: "Votre total est le plus élevé : vous gagnez 6 Pièces d'Or.", or: 6 }
      }
      }
  },
  {
  id: "309",
  texte: "Lorsque vous avancez sur le pont, les hideuses créatures font volte-face et s'enfuient devant la clarté d'or de votre Glaive. Ce vaisseau fantôme vous semble alors étrange, il vous rappelle quelque chose de familier, mais vous ne savez pas quoi exactement. Puis soudain, une voix sépulcrale retentit derrière vous en vous appelant par votre nom. Vous vous retournez en brandissant le Glaive de Sommer et une vision terrifiante vous glace alors le sang.",
  choix: [
    { texte: "", vers: "26" }
  ]
  },
  {
  id: "310",
  texte: "Vous arrivez bientôt au bout de la rue du Col Vert ; une autre rue orientée nord-sud la croise à cet endroit, mais il fait si noir à présent que vous êtes bien incapable de lire le nom qu'elle porte. Il est temps de trouver un abri pour la nuit et vous apercevez alors, un peu plus loin, une enseigne éclairée qui indique : ÉCURIES DE RAGADORN RELAIS DE DILIGENCE Profitant de l'obscurité, vous montez quatre à quatre une échelle extérieure qui vous mène à un grenier : c'est l'endroit idéal pour passer la nuit, blotti parmi des bottes de foin.",
  choix: [
    { texte: "", vers: "32" }
  ]
  },
  {
  id: "311",
  texte: "Vous tombez à plat ventre dans un enchevêtrement d'épaisses fougères tandis que résonnent à vos oreilles le cliquetis des épées et les cris terrifiants des Monstres d'Enfer. Vous êtes à moitié assommé et vous ne pouvez plus faire un geste. Enfin, une main vous saisit le bras et vous remet debout d'un geste vigoureux. C'est le Lieutenant Général Rhygar, le visage ensanglanté, son armure bosselée et noircie. Il faut fuir ces démons ! s'exclame-t-il, la force de nos épées ne peut rien contre eux. » Vous apercevez alors les silhouettes de six Monstres d'Enfer occupés à anéantir par leur seule Puissance Psychique les malheureux soldats du Lieutenant Général. Or, tandis qu'ils se concentrent ainsi, vous parvenez à vous échapper, Rhygar et vous, en vous glissant dans les broussailles pour atteindre l'abri de la forêt.",
  choix: [
    { texte: "", vers: "299" }
  ]
  },
  {
  id: "312",
  texte: "Lorsque l'aube se lève, il fait froid et la pluie tombe à verse ; votre cape de Seigneur Kaï et l'abri du feuillage vous ont cependant protégé en vous tenant au chaud et au sec la nuit durant. Vous jetez un coup d'œil à la route qui longe la côte et vous apercevez au loin une diligence qui avance dans votre direction.",
  choix: [
    { texte: "Si vous souhaitez descendre de l'arbre et faire signe au conducteur de l'attelage", vers: "117" },
    { texte: "Si vous préférez essayer de sauter sur le toit de la diligence lorsqu'elle passera sous les branches de l'arbre", vers: "89" }
  ]
  },
  {
  id: "313",
  texte: "Les cris terrifiants des Monstres d'Enfer s'évanouissent enfin derrière vous et vous pouvez vous arrêter quelques instants pour reprendre votre souffle. Vous grimacez alors de douleur, car les doigts de l'épouvantable créature vous ont brûlé la gorge, vous infligeant des blessures cuisantes qui vous coûtent 4 points d'ENDURANCE. Vous déchirez un pan de votre tunique pour en faire un bandage, puis vous poursuivez votre route le long du tunnel de Tarnalin.",
  choix: [
    { texte: "", vers: "349" }
  ]
  },
  {
  id: "314",
  texte: "L'aubergiste est un vieil homme maigre, sec et borgne. Il vous tend une clé et vous désigne du doigt un escalier qui mène à une galerie. « Chambre 2, c'est la porte rouge», dit-il. Les autres voyageurs paient chacun leur Couronne, prennent la clé de leur chambre puis traversent la salle bondée de la taverne en direction de l'escalier. « Il nous faut établir un programme pour demain, dit alors Dorier. Je suggère que nous nous retrouvions au bar dans une heure pour décider de ce qu'il convient de faire. » Tous les autres approuvent d'un signe de tête. Lorsque vous refermez la porte de votre chambre, les paroles du capitaine Kelman vous reviennent soudain en mémoire : « Tout cela sent la trahison, avait-il dit d'un air sombre, il est clair que l'ennemi a déjà dressé des plans pour faire échouer votre mission. » Il s'est écoulé presque une heure lorsque des coups frappés à la porte viennent interrompre le fil de vos pensées. C'est l'aubergiste qui vous apporte un repas chaud. « Avec les compliments d'un de vos amis», dit-il en déposant un plateau devant vous. Puis il quitte la chambre avant que vous ayez pu lui demander le nom de ce mystérieux ami. Le plat qu'il vous a apporté est fort appétissant et d'ailleurs vous n'avez pas mangé de la journée. Il est donc temps de prendre un Repas, sinon, vous perdrez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Si vous souhaitez manger ce que l'aubergiste vous a apporté", vers: "36" },
    { texte: "Si vous ne voulez pas toucher à cette nourriture", vers: "178" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de la Chasse", vers: "290", requis: {"discipline":"chasse"} }
  ]
  },
  {
  id: "315",
  texte: "Tout en gardant un œil sur la porte, vous fouillez rapidement les tiroirs et les papiers disposés sur une table ouvragée mais vous ne trouvez rien de suspect. Il n'y a là que des cartes maritimes et des instruments de navigation. Vous êtes sur le point d'abandonner vos recherches lorsque vous découvrez un petit levier dissimulé sous la table. Vous l'actionnez et un panneau glisse aussitôt, révélant une cachette dans laquelle un petit coffret à la serrure de cuivre a été déposé.",
  choix: [
    { texte: "Si vous voulez forcer la serrure de cette boîte", vers: "190" },
    { texte: "Si vous préférez remettre le coffret à sa place et rejoindre le capitaine sur le pont avant qu'il ne soupçonne quelque chose", vers: "175" },
    { texte: "Enfin, si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière", vers: "287", requis: {"discipline":"maitrise-matiere"} }
  ]
  },
  {
  id: "316",
  texte: "Le lendemain matin, vous êtes réveillé par les cris de la vigie postée dans le nid-de-pie. « Navire en vue par tribord avant ! » annonce-t-il. Vous montez aussitôt sur le pont en affrontant vaillamment la fraîcheur de la brise marine. A l'horizon, on aperçoit les rivages boisés qui s'étendent à l'est du Sommerlund et à mi-chemin, un navire marchand qui semble sérieusement endommagé. Un seul de ses mâts reste encore intact et il est de toute évidence en train de sombrer. Le navire bat pavillon de Durenor, mais le drapeau a été hissé à l'envers en signe de détresse. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "107", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "94", texte: "Entre 5 et 9," }
      }
      }
  },
  {
  id: "317",
  texte: "Au cri de détresse du Squall à l'agonie répond bientôt le vôtre car deux carreaux d'arbalète viennent de se planter dans votre dos. Votre mission s'achève ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Fin tragique — §317"
  },
  {
  id: "318",
  texte: "Vous vous trouvez dans un vaste hall entièrement désert. Face à vous, vous apercevez deux portes sur lesquelles sont fixées des plaques de cuivre.",
  choix: [
    { texte: "Si vous voulez franchir la porte dont la plaque indique « laissezpasser blancs »", vers: "75" },
    { texte: "Si vous préférez pousser la porte dont la plaque indique «laissez-passer rouges»", vers: "62" },
    { texte: "Enfin, si vous préférez ressortir et vous approcher des gardes postés au bout de la rue", vers: "246" }
  ]
  },
  {
  id: "319",
  texte: "La rue aboutit soudain à une grande tour de guet aux murs de pierre.",
  choix: [
    { texte: "Si vous souhaitez entrer dans la tour", vers: "271" },
    { texte: "Si vous préférez retourner dans la taverne", vers: "177" }
  ]
  },
  {
  id: "320",
  texte: "En ouvrant son sac, vous y découvrez avec horreur un parchemin en peau humaine sur lequel un message a été tracé dans une étrange écriture runique. Le seul mot que vous parvenez à reconnaître est « Kaï ». Vous trouvez également dans le sac un poignard à la lame noire dont la seule vue vous fait frissonner, ainsi qu'un bloc d'obsidienne. Ces objets portent la marque des Maîtres des Ténèbres, et il n'est pas étonnant que vous vous sentiez soudain fort inquiet. Vous jetez le sac à terre comme s'il s'agissait d'un charbon ardent et vous vous hâtez de rejoindre votre cheval. Hélas, le malheur veut qu'il ait disparu: sans doute les Squalls l'ont-ils volé. Vous poussez alors un soupir de découragement et vous vous résignez à poursuivre votre route à pied.",
  choix: [
    { texte: "", vers: "138" }
  ]
  },
  {
  id: "321",
  texte: "Le repas frugal est composé de restes de la veille qui n'ont rien d'appétissant. A la fin de ce piètre souper, le capitaine vous fait quelques confidences qui confirment vos craintes. « Je dois vous avouer quelque chose, Seigneur Kaï, dit-il : le feu a détruit tous nos vivres et il ne restait plus dans la cambuse que de quoi préparer ce maigre repas. D'ici à Port Bax, il faudra nous contenter du poisson que nous pourrons pêcher... » A moins qu'il ne vous reste de quoi manger dans votre Sac à Dos, ce détestable dîner vous laisse sur votre faim et vous perdez 2 points d'ENDURANCE. Plus tard dans la soirée, le capitaine vous propose une partie de Samor ; c'est un jeu semblable aux échecs qui demande beaucoup d'ingéniosité et d'audace. Pour ajouter à l'intérêt de la partie, le capitaine vous invite à miser un peu d'or.",
  choix: [
    { texte: "Si vous acceptez son offre", vers: "12" },
    { texte: "Si en revanche vous n'avez pas envie de jouer, souhaitez une bonne nuit au capitaine et rentrez dormir dans votre cabine", vers: "197" }
  ],
  effets: { endurance: -2 }
  },
  {
  id: "322",
  texte: "Ces cavaliers vêtus de capes sont entourés d'une aura maléfique et votre Sixième Sens vous avertit qu'il serait imprudent de suivre Rhygar et ses hommes. Vous leur criez de revenir immédiatement, mais il est trop tard : leurs propres cris de guerre et le galop de leurs montures couvrent votre voix.",
  choix: [
    { texte: "", vers: "277" }
  ]
  },
  {
  id: "323",
  texte: "Vous longez cette rue sordide qui, bientôt, tourne brusquement vers l'est pour aboutir dans la rue de la Vigie. Au loin, vous apercevez les eaux du Fleuve Dorn qui sépare les parties Est et Ouest de Ragadorn. Vous poursuivez votre chemin sous la pluie battante lorsque trois hommes d'allure louche surgissent soudain d'une ruelle et vous emboîtent le pas.",
  choix: [
    { texte: "Si vous souhaitez interrompre votre marche et affronter ces trois individus", vers: "131" },
    { texte: "Si vous préférez continuer à marcher", vers: "298" },
    { texte: "Enfin, si vous estimez plus judicieux de courir en direction du fleuve", vers: "121" }
  ]
  },
  {
  id: "324",
  texte: "Qu'allez-vous faire ? Dire que vous vous êtes perdu et demander un abri pour la nuit ? Vous faire passer pour un paysan qui cherche du travail ? Demander votre chemin pour rejoindre Port Bax ?",
  choix: [
    { texte: "", vers: "135" },
    { texte: "", vers: "174" },
    { texte: "", vers: "288" }
  ]
  },
  {
  id: "325",
  texte: "Votre Sens de l'Orientation vous indique que le couloir de gauche est le chemin le plus court pour Hammardal ; vous gagnerez environ 3 kilomètres en l'empruntant. Un peu avant la bifurcation, une grande flaque d'eau s'est formée au milieu de la chaussée et les traces de pas de deux hommes qui ont marché dans la flaque sont visibles sur le sol. Chacun d'eux a pris un chemin différent ; l'un a suivi le tunnel de gauche, l'autre celui de droite. Les traces sont encore humides et il est probable que les deux hommes sont passés là il y a moins de vingt minutes.",
  choix: [
    { texte: "Si vous souhaitez suivre les traces qui mènent dans le couloir de gauche", vers: "64" },
    { texte: "Si vous préférez suivre les traces qui conduisent au couloir de droite", vers: "164" }
  ]
  },
  {
  id: "326",
  titre: "Le pirate Drakkarim",
  image: "/lonewolf/ls02/p178-x940.webp",
  texte: "Le capitaine ordonne à l'équipage de hisser toutes les voiles pour essayer d'échapper aux pirates, mais le vaisseau de ces derniers est rapide et ils s'efforcent de couper la route du Sceptre Vert. La collision semble inévitable. « Attention à l'abordage ! » s'écrie le capitaine, alors que le flanc du navire aux voiles rouges se dresse soudain devant vous. Dans un fracas impressionnant, la proue du Sceptre Vert déchire le flanc du bateau pirate. Des éclats de bois volent en tous sens et vous êtes projeté à plat ventre sur le pont sous la violence du choc. Les pirates montent immédiatement à l'assaut et vous apercevez avec horreur, au milieu de cette horde vociférante, la silhouette vêtue de noir d'un GUERRIER DRAKKARIM. Il vous a aussitôt repéré et s'avance vers vous, son glaive impressionnant levé au-dessus de sa tête.",
  suite: "184",
  combat: { nom: "Guerrier Drakkarim", habilete: 15, endurance: 25 }
  },
  {
  id: "327",
  texte: "Vous rebroussez chemin le long de la rue pavée en vous demandant ce qu'il convient de faire lorsqu'un jeune garçon s'approche de vous. «Je peux vous faire entrer dans le port, dit-il, mais il faudra payer. » Il vous montre alors une enveloppe remplie de papiers officiels ou qui semblent tels. « Grâce à ces papiers, poursuit-il, vous obtiendrez un laissez-passer rouge au poste de garde du port. Ils sont à vous pour 6 Couronnes seulement. » Si vous souhaitez acheter ces documents, payez-les 6 Couronnes. Si vous refusez, le garçon vous laisse là et disparaît bientôt. Lorsque vous aurez pris une décision, vous retournerez à la tour. Si vous préférez emprunter l'avenue bordée d'arbres pour retourner à l'hôtel de ville et y demander comment faire pour vous rendre au Consulat du Sommerlund, allez dans ce cas au 84.",
  choix: [
    { texte: "Acheter les documents du garnement (6 PO)", vers: "318", requis: {"or":6}, effets: { or: -6, objets: [{"id":"laissez-passer-blanc","message":"Des papiers officiels… ou qui leur ressemblent."}], drapeau: "documents-faux" } },
    { texte: "Refuser et retourner à la tour", vers: "318" },
    { texte: "Aller à l'hôtel de ville demander le Consulat du Sommerlund", vers: "84" }
  ]
  },
  {
  id: "328",
  texte: "Deux Zombies essaient de vous interdire le passage, mais vous leur tranchez le corps à tous deux d'un seul coup du Glaive de Sommer. Vous vous trouvez à présent au pied de la tour et vous apercevez au-dessus de vous la silhouette d'un homme bossu, vêtu d'une robe écarlate et coiffé d'un tokmor, un turban de magicien, sur lequel l'image d'un serpent a été brodée. L'homme tient un bâton noir dans sa main droite.",
  choix: [
    { texte: "Si vous possédez un Pendentif avec une Etoile de Cristal", vers: "113" },
    { texte: "Si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "204", requis: {"discipline":"orientation"} },
    { texte: "Si vous souhaitez monter en haut de la tour pour attaquer le bossu", vers: "73" },
    { texte: "Si vous préférez vous enfuir de ce vaisseau en sautant par-dessus bord", vers: "267" }
  ]
  },
  {
  id: "329",
  texte: "« Félicitations, Loup Solitaire, dit bientôt le capitaine en essuyant la sueur qui perle à son front, vous êtes un joueur de première force et vous avez gagné. » Il fouille dans une poche de son gilet et vous tend une bourse contenant 10 Pièces d'Or. Vous le remerciez d'avoir joué avec vous et vous lui proposez de prendre sa revanche le lendemain soir. Avec un sourire quelque peu amer, il accepte votre offre et vous souhaite bonne nuit.",
  choix: [
    { texte: "Rentrez dormir dans votre cabine, à présent", vers: "197" }
  ]
  },
  {
  id: "330",
  texte: "Quelques secondes plus tard, vous vous sentez très mal et vous sombrez dans l'inconscience. Il s'est écoulé presque une heure lorsque vous vous réveillez. Vous êtes encore terriblement malade, mais vous avez survécu aux effets du poison. Vous perdez 5 points d'ENDURANCE, cependant. Puis, tandis que vos forces reviennent peu à peu, la fureur vous envahit : vous ramassez vos affaires et vous quittez aussitôt la chambre d'un pas chancelant, bien décidé à démasquer celui ou celle qui a tenté de vous assassiner.",
  choix: [
    { texte: "", vers: "200" }
  ],
  effets: { endurance: -5 }
  },
  {
  id: "331",
  texte: "En fouillant le cadavre du soldat, vous découvrez une Epée, un Poignard et 3 Pièces d'Or. Vous pouvez garder l'une ou l'autre de ces trouvailles en modifiant en conséquence votre Feuille d'Aventure. Puis soudain, vous entendez le bruit de semelles cloutées qui descendent les marches de pierre de l'escalier. Vous levez alors la tête et vous apercevez un autre soldat à l'étage au-dessus. Vous vous précipitez aussitôt hors de la tour et vous prenez vos jambes à votre cou, tandis que le soldat vous abreuve d'injures.",
  choix: [
    { texte: "", vers: "65" }
  ]
  },
  {
  id: "332",
  titre: "Le gardien du tunnel",
  texte: "Il vous faut à présent combattre le MONSTRE D'ENFER. Il vous attaque en faisant usage de sa Puissance Psychique et si vous ne maîtrisez pas la Discipline Kaï du Bouclier Psychique, vous perdrez 2 points d'ENDURANCE supplémentaire au cours de chaque assaut.",
  suite: "92",
  combat: { nom: "Monstre d'Enfer", habilete: 21, endurance: 30, malusPsychique: 2, fuite: [{ texte: "Prendre la fuite", vers: "183" }] }
  },
  {
  id: "333",
  texte: "Le marin qui se faisait passer pour Ronan semble avoir pris la fuite au cours du combat. Vous fouillez rapidement les cadavres des autres brigands, mais vous ne découvrez rien d'intéressant. Vous remarquez cependant que chacun des malfaiteurs porte au poignet gauche un tatouage représentant un serpent. Il est clair que celui qui leur a donné l'ordre de vous tuer, quel qu'il soit, connaît déjà la nature de votre mission. Vous quittez la taverne par la porte latérale et vous découvrez en passant devant un escalier le cadavre d'un marin dissimulé sous les marches. Cousue à l'intérieur du col de sa veste tachée de sang, une étiquette porte ce nom : Ronan. Voilà donc celui avec qui vous aviez rendez-vous et que vos ennemis ont assassiné pour prendre sa place. Vous couvrez son corps et vous sortez de la taverne en prenant la direction du port dans lequel est ancré le Sceptre Vert, à quelque 300 mètres du quai.",
  choix: [
    { texte: "Si vous souhaitez rejoindre le navire en empruntant l'un des canots qui sont amarrés le long du quai", vers: "300" },
    { texte: "Si vous préférez essayer de retrouver l'imposteur qui s'est fait passer pour Ronan", vers: "67" }
  ]
  },
  {
  id: "334",
  texte: "Quelques kilomètres plus loin, le sentier est recouvert de broussailles et disparaît complètement sous les herbes et les buissons d'épines. Il devient difficile d'avancer car les marécages et les fondrières abondent sur la lande. Il vous faut plusieurs heures d'un parcours malaisé pour atteindre enfin la lisière de la forêt de Durenor. Vous distinguez alors la silhouette d'une haute tour dressée parmi les fougères. Des volutes de fumée s'élèvent paresseusement d'une cheminée.",
  choix: [
    { texte: "Si vous souhaitez entrer dans cette tour", vers: "115" },
    { texte: "Si vous préférez chercher un chemin qui traverse la forêt", vers: "291" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "98", requis: {"discipline":"orientation"} }
  ]
  },
  {
  id: "335",
  texte: "Vous remarquez une enseigne accrochée à la façade d'une petite boutique : Si vous souhaitez entrer dans cette boutique et y demander votre chemin pour Durenor, rendez-vous au 161. Si vous préférez continuer tout droit, rendez-vous au 61.",
  choix: [
    { texte: "Vous remarquez une enseigne accrochée à la façade d'une petite boutique : Si vous souhaitez entrer dans cette boutique et y demander votre chemin pour Durenor", vers: "161" },
    { texte: "Si vous préférez continuer tout droit", vers: "61" }
  ]
  },
  {
  id: "336",
  texte: "En une fraction de seconde, l'éclair change de direction, attiré par le Glaive de Sommer qui en absorbe aussitôt l'énergie aussi facilement qu'une éponge absorbe une goutte d'eau. C'est là un des pouvoirs du Glaive, comme vous l'avez appris au cours de votre entraînement : il vous protège de toute magie et vient ainsi de vous épargner une mort certaine. Le sorcier lance alors un juron, arrache une pierre précieuse de son turban richement orné et la jette à vos pieds. Une flamme en jaillit instantanément et un nuage vert s'élève vers vous : c'est un gaz puissant dont l'odeur acide vous fait suffoquer. Pour échapper à ce gaz délétère, vous êtes contraint de sauter sur le pont et le sorcier profite de cette diversion pour s'enfuir du vaisseau fantôme à bord d'un canot dont il actionne les rames avec une véritable frénésie.",
  choix: [
    { texte: "Si vous souhaitez vous aussi quitter le vaisseau fantôme en plongeant dans la mer", vers: "109" },
    { texte: "Si vous préférez essayer de rejoindre un navire de la flotte de Durenor au prix de quelques combats", vers: "185" }
  ]
  },
  {
  id: "337",
  titre: "Le naufrage",
  texte: "Lorsque vous n'êtes plus qu'à une cinquantaine de mètres du rivage, vous vous laissez glisser dans l'eau et vous nagez vers la terre ferme. Bientôt, vous atteignez enfin la plage ; vous êtes épuisé et vous vous traînez sur le sable jusqu'aux dunes qui s'élèvent un peu plus loin et à l'abri desquelles vous pouvez reprendre haleine. En plus de la fatigue, la faim vous tenaille mais il vous faut d'abord faire l'inventaire de ce qui vous reste. Vous avez réussi à conserver vos Pièces d'Or, votre Sac à Dos et les Objets Spéciaux dont vous n'avez pas été contraint de vous séparer au cours de la tempête. Vos armes en revanche sont perdues. Modifiez votre Feuille d'Aventure en conséquence et prenez quelques minutes de repos. Vous vous relevez ensuite et vous parcourez à pied quelques centaines de mètres. Là, vous trouvez de petits arbres aux branches contournées qui portent des fruits violets.",
  choix: [
    { texte: "Si vous souhaitez manger ces fruits", vers: "228" },
    { texte: "Si vous préférez ne pas les manger, vous perdrez 3 points d'ENDURANCE avant de", vers: "171" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de la Chasse", vers: "139", requis: {"discipline":"chasse"} }
  ]
  },
  {
  id: "338",
  texte: "Vous empoignez la lance et vous la levez au-dessus de votre tête en visant le Monstre d'Enfer qui se met à hurler de terreur : il sait en effet que le fer de votre lance lui sera fatal. Sous le choc, vous tombez tous deux sur la chaussée en contrebas. La chute est rude et vous coûte 2 points d'ENDURANCE. Quant au Monstre d'Enfer, il s'écrase sur la lance plantée dans sa poitrine et le fer lui transperce instantanément le cœur.",
  choix: [
    { texte: "Si vous souhaitez arracher votre lance du corps de la créature", vers: "269" },
    { texte: "Si vous préférez abandonner la lance et prendre la fuite aussi vite que possible", vers: "349" }
  ]
  },
  {
  id: "339",
  texte: "Une demi-heure plus tard, la diligence est arrêtée par des cavaliers en armes. Ils portent l'emblème de Lachelan, le Suzerain de Ragadorn : un vaisseau noir surmonté d'une crête rouge. Ils exigent de l'or en paiement de ce qu'ils appellent une « taxe de sortie » : il en coûtera 1 Couronne à chaque passager. Vos compagnons de voyage déposent chacun 1 Pièce d'Or sur une assiette qu'ils vous tendent ensuite.",
  choix: [
    { texte: "Si vous avez les moyens de payer cette taxe, déposez à votre tour 1 Couronne sur l'assiette ; la diligence alors pourra repartir et vous", vers: "249" },
    { texte: "Si vous n'avez plus d'or", vers: "50" }
  ]
  },
  {
  id: "340",
  texte: "Vous continuez de marcher pendant encore une demi-heure le long du tunnel avant d'arriver à une bifurcation.",
  choix: [
    { texte: "Si vous souhaitez prendre la voie de gauche", vers: "64" },
    { texte: "Si vous préférez emprunter la voie de droite", vers: "164" }
  ]
  },
  {
  id: "341",
  texte: "Il ne reste plus du malheureux navire qu'une coque fracassée et les lambeaux de voiles. Vous insistez auprès du capitaine pour qu'il fasse rechercher d'éventuels survivants, mais il ignore votre demande et ordonne à ses hommes d'équipage de poursuivre leur tâche. Alors, tandis que vous vous éloignez de l'épave, un sentiment d'appréhension vous envahit peu à peu : et si un sort semblable vous attendait, vous aussi ? La gorge sèche, vous descendez sur le pont inférieur pour rejoindre votre cabine en prenant bien soin d'en fermer la porte à clé.",
  choix: [
    { texte: "", vers: "240" }
  ]
  },
  {
  id: "342",
  titre: "Le relais de diligence",
  image: "/lonewolf/ls02/p185-x990.webp",
  texte: "C'est une véritable montagne humaine, le crâne complètement chauve et les oreilles ornées de gros anneaux d'or. Il vous regarde d'un air soupçonneux avant de vous adresser enfin la parole : « Une bière coûte 1 Pièce d'Or, une chambre 2 Pièces.",
  choix: [
    { texte: "Qu'est-ce que vous choisissez ? » Si vous souhaitez prendre une bière, payez une Pièce d'Or et", vers: "72" },
    { texte: "Si vous préférez louer une chambre pour la nuit, payez 2 Pièces d'Or à l'aubergiste et", vers: "56" },
    { texte: "Si vous n'avez besoin ni de l'une ni de l'autre, vous pouvez demander plutôt à cet homme de vous parler de Ragadorn", vers: "226" }
  ]
  },
  {
  id: "343",
  texte: "Vous avez soudain la certitude que la victime désignée de ce prétendu accident n'était autre que vous-même. L'un de vos compagnons de voyage a l'intention de vous tuer !",
  choix: [
    { texte: "", vers: "168" }
  ]
  },
  {
  id: "344",
  texte: "Votre Sixième Sens vous révèle que ces étrangers sont des Monstres d'Enfer, les féroces serviteurs des Maîtres des Ténèbres, et qu'ils ont pour mission de vous assassiner. Ces immondes créatures ont le pouvoir de prendre à leur guise une apparence humaine et sont par ailleurs invulnérables aux armes habituelles tout autant qu'à la Puissance Psychique. Vous criez à Rhygar et à ses hommes de prendre garde à ces monstres, puis vous vous enfuyez vers la forêt.",
  choix: [
    { texte: "", vers: "183" }
  ]
  },
  {
  id: "345",
  texte: "Une bataille féroce s'est engagée sur le navire tandis que les Gloks s'efforcent de prendre le contrôle du Sceptre Vert. Perchés en haut des mâts, les Kraans sont en train de déchirer les voiles avec leurs serres et leurs dents tranchantes comme des rasoirs ; pendant ce temps, les Bêtalzans retournent vers la Pointe des Naufragés pour aller remplir leurs filets d'autres Gloks avides de participer aux combats. Bientôt, une silhouette menaçante apparaît sur le pont jonché de cadavres. C'est un DRAKKARIM, un cruel guerrier à la solde des Maîtres des Ténèbres. Il taille en pièces quiconque se trouve sur son chemin, marin ou Glok, et s'avance vers vous en brandissant un glaive d'un noir de jais. Parvenu devant vous, il se lance à l'attaque et il vous faut le combattre jusqu'à la mort de l'un de vous deux.",
  suite: "243",
  combat: { nom: "Drakkarim", habilete: 16, endurance: 24 }
  },
  {
  id: "346",
  texte: "Le cocher hoche la tête et vous rend le billet. L'auberge est bien chauffée, mais pauvrement meublée. Vous allez devoir prendre ici un repas qui vous coûtera 1 Couronne, à moins que vous n'ayez de quoi manger dans votre Sac à Dos. Si vous ne possédez ni or ni nourriture, vous perdez 3 points d'ENDURANCE. Si vous maîtrisez la Discipline Kaï de la Chasse, vous ne pourrez pas vous en servir tant que vous traverserez le Pays Sauvage, car c'est un désert entièrement aride où ne vivent que des Squalls, des créatures chétives et couardes apparentées aux Gloks et tout à fait impropres à la consommation.",
  choix: [
    { texte: "Si vous avez les moyens de vous offrir une chambre au prix de 1 Couronne", vers: "280" },
    { texte: "Si vous n'avez pas d'argent", vers: "205" }
  ],
  effets: { repasObligatoire: true, repasChassePossible: false }
  },
  {
  id: "347",
  texte: "Au bout de cette rue se trouve une grande écurie. A votre droite, la populace déchaînée est en train de fouiller les boutiques et les maisons pour essayer de vous retrouver. Soudain, un homme vous aperçoit et donne l'alerte. « Il est là ! s'écrie-t-il, c'est lui, c'est l'assassin ! » Vous n'avez pas le temps de réfléchir : vous vous précipitez à l'intérieur de l'écurie et vous détachez un cheval ; vous bondissez aussitôt sur sa croupe et vous filez au galop. Quelqu'un vous lance alors une hache qui vous atteint à l'épaule en n'occasionnant cependant qu'une simple égratignure. Vous perdez malgré tout 1 point d'ENDURANCE et vous disparaissez dans la nuit, loin de vos poursuivants.",
  choix: [
    { texte: "", vers: "150" }
  ]
  },
  {
  id: "348",
  texte: "L'homme cesse de sourire et une expression de mépris apparaît sur son visage. D'un mouvement rapide, il s'éloigne de la table. « Peut-être que ni vous ni moi ne sommes celui que nous prétendons être, mais qu'importe, vous ne vivrez pas assez longtemps pour découvrir qui je suis ! » lance-t-il avec hargne. Vous entendez alors une porte s'ouvrir à la volée derrière vous. Vous faites aussitôt volte-face et vous voyez trois BRIGANDS s'avancer dans votre direction. Chacun d'eux est armé d'un cimeterre et vous allez devoir les combattre en les considérant comme un seul et même adversaire.",
  suite: "333",
  combat: { nom: "Brigands", habilete: 16, endurance: 25, fuite: [{ texte: "Prendre la fuite", vers: "125" }] }
  },
  {
  id: "349",
  texte: "Vous avez parcouru environ 5 km lorsque vous apercevez au loin une rangée de chariots. Ils ont été placés en travers de la chaussée pour interdire le passage, et des soldats en uniforme rouge ont pris position sur les toits de chaque véhicule. Une foule considérable est rassemblée derrière ce barrage et vous entendez la rumeur de conversations animées, répercutées en écho le long du tunnel. Tandis que vous vous approchez, le silence se fait soudain et tous les regards se tournent dans votre direction. Un détachement d'une dizaine de soldats mené par un chevalier qui porte un écusson frappé aux armes du royaume de Durenor s'avance alors vers vous.",
  choix: [
    { texte: "Si vous souhaitez attaquer ces soldats", vers: "87" },
    { texte: "Si vous préférez lever les mains en continuant de vous approcher d'eux", vers: "284" }
  ]
  },
  {
  id: "350",
  titre: "La bataille de Holmgard",
  image: "/lonewolf/ls02/p001-x5.webp",
  texte: "La ville de Holmgard a beaucoup souffert depuis votre départ. Le long des quais, nombre de maisons et de boutiques ne sont plus que cendres désormais. L'armée maléfique des Maîtres des Ténèbres encercle les murailles et leurs effroyables machines de guerre maintiennent la cité sous un déluge de feu qui déchire la nuit sans relâche. Les habitants épuisés et affamés combattent du mieux qu'ils peuvent les incendies qui se déclarent un peu partout dans la ville sous l'effet des projectiles enflammés. Lorsqu'elle entre dans le port, la flotte durenoraise est tout d'abord accueillie par des cris de désespoir; les assiégés ont cru en effet qu'il s'agissait là de vaisseaux ennemis venus en renfort. Mais, lorsque les premiers soldats descendent sur le quai en déployant l'étendard de Durenor, la nouvelle a tôt fait de se répandre de l'arrivée des alliés. Les cris de désespoir se changent alors en hurlements de joie. « Le Seigneur Kaï est de retour ! » s'exclame-t-on bientôt dans toute la capitale. Vous vous tenez debout au sommet d'une haute tour, qui défend la plus grande porte de la ville lorsque les premières lueurs de l'aube naissent à l'horizon. Des milliers et des milliers d'ennemis aux uniformes noirs sont massés autour des murs de la cité, grouillant comme des cancrelats le long des tranchées qui sillonnent la plaine Au milieu de cette horde, une tente rouge a été dressée qui porte l'emblème de Zagarna, Seigneur de Kaag, l'un des Maîtres des Ténèbres, venu d'Heldegad. L'emblème représente un crâne fracassé. Zagarna a pour ambition de détruire Holmgard et il souhaite plus que tout conduire son armée à la victoire sur la Maison d'Ulnar pour se proclamer ensuite roi du Sommerlund. Mais la victoire ne sera pas pour aujourd'hui, car bientôt vous levez au-dessus de votre tête le Glaive de Sommer : au même instant, un rayon de soleil vient se refléter sur la pointe de l'épée d'or et un jaillissement de flammes blanches et aveuglantes parcourt toute la longueur de sa lame. La puissance du Glaive vous emplit d'une fantastique énergie. Tout votre corps s'anime, vous vous sentez frémir de la tête au pied et d'un geste ample vous abaissez l'Arme fantastique en pointant sa lame sur la tente de Zagarna. Dans un formidable roulement de tonnerre, un rayon blanc jaillit alors de l'épée magique et vient frapper la tente qui explose dans une tempête de feu, un champignon enflammé s'élevant jusqu'au ciel. Un épouvantable hurlement retentit aussitôt dont l'écho semble déchirer les nuées: c'est Zagarna, le Maître des Ténèbres, qui vient de succomber sous la vengeance du Glaive. Saisis de terreur, les soldats aux uniformes noirs se lèvent des tranchées et se précipitent en déroute loin des murs de Holmgard. L'impossible est survenu : leur chef invincible a été terrassé. Le Glaive de Sommer est revenu chasser l'envahisseur, et l'armée du Sommerlund aidée de ses alliés de Durenor se lance sans attendre à la poursuite des ennemis défaits qui courent aveuglément en direction des Monts Durncrag ; le triomphe est total : Holmgard est libérée et vos frères Kaï vengés. Votre vie d'aventures, cependant, ne fait que commencer, car un nouveau défi vous attend, vous et le Glaive de Sommer, dans le troisième volume de la série du Loup Solitaire : LES GROTTES DE KALTE",
  fin: "victoire",
  nomFin: "Holmgard délivrée par la flotte de Durenor"
  }
];
