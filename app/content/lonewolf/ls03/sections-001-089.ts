import type { StorySection } from "../../../lib/lonewolf/types";

/**
 * Loup Solitaire 03 — Les Grottes de Kalte
 * Paragraphes 001 à 89. Généré par ls03-importer.cjs
 */
export const SECTIONS_001_89: StorySection[] = [
  {
  id: "1",
  texte: "Avant même que vous n'ayez accepté la mission de ramener Vonotar devant la justice de votre pays, les préparatifs de votre voyage à Kalte ont été entrepris. Le commandant du vaisseau de guerre Cardonal, de retour d'une patrouille dans la mer de Kalte, a reçu l'ordre d'attendre votre arrivée au port d'Anskaven où le bâtiment est ancré. Au cours de la nuit, on a amené à bord les vivres, les équipements polaires et les meutes de chiens Kanudes chiens de traîneau-qui vous seront nécessaires dans votre quête. La nature de votre mission est restée secrète et seuls les officiers supérieurs en ont été informés. Le commandant a reçu pour instruction de vous amener jusqu'au promontoire de Halle, de jeter l'ancre et d'attendre là votre retour. Une équipe de guides triés sur le volet vous conduira du promontoire jusqu'à Ikaya. Dès que vous serez entré dans la Forteresse de Glace, vous devrez alors chercher Vonotar, le capturer, puis revenir au vaisseau, toujours en compagnie de vos guides. Il ne vous est accordé que trente jours pour accomplir votre mission car l'hiver approche et, au-delà de ce délai, le Cardonal serait irrémédiablement pris dans des glaces dont il ne pourrait plus se dégager. Aussi le commandant sera-t-il contraint de regagner le Sommerlund sans vous si vous ne revenez pas à temps. Pendant six jours, le Cardonal fait voile dans la mer de Kalte sans traverser une seule tempête ; chaque jour, cependant, la température descend et, bientôt, une couche de givre recouvre les ponts du bateau. Au matin du septième jour, l'île de Tola, ensevelie sous la neige, est en vue. Peu après, un léger vent se lève, en provenance de l'ouest. Tout d'abord, il ne semble pas très inquiétant, mais une demi-heure plus tard, un violent blizzard se met à souffler et les côtes qui se dessinaient au loin ont tôt fait de disparaître dans la tourmente. La terrible tempête fait rage toute la journée. Des vents redoutables écrêtent les gigantesques vagues grises en projetant des paquets de mer sur les ponts, les mâts et les gréements du navire ; l'eau gèle instantanément et les flancs du Cardonal sont recouverts d'une couche de glace de plusieurs dizaines de centimètres d'épaisseur. C'est seulement en début de soirée que le ciel s'éclaircit et que la tempête cesse de souffler bien que le vent reste fort. Il ne vous faut pas longtemps pour vous rendre compte que la tempête vous a fait dévier de votre route d'environ 50 kilomètres, le long de la banquise de Liouk. Vous n'ignorez pas qu'en voulant retourner au promontoire de Halle, vous perdriez une journée entière, et vous décidez donc d'aborder sur la banquise pour y entreprendre votre mission. Tandis que l'on débarque les derniers chiens Kanu, vos guides vous expliquent que, de l'endroit où vous êtes, il existe deux itinéraires possibles pour vous rendre à Ikaya. Le premier représente une marche de 200 kilomètres environ qui vous mènera au mont des Brumes. De là, vous aurez encore à parcourir 150 autres kilomètres sur le glacier de Viad avant d'arriver à la Forteresse de Glace. Vos guides vous précisent que cette expédition sur le glacier sera difficile. L'autre itinéraire est plus long, il vous oblige tout d'abord à couvrir une distance de presque 300 kilomètres dans la plaine de Hrod; ensuite, vous devrez traverser le défilé de la Tempête, long de 150 kilomètres. Même si le temps et la chance vous sont favorables, l'un et l'autre itinéraires vous contraindront à une marche pénible d'au moins dix jours pour atteindre votre objectif. Avant de prendre une décision, il serait sage de consulter la carte de Kalte qui figure en tête de ce livre.",
  choix: [
    { texte: "Si vous souhaitez prendre l'itinéraire le plus court, mais le plus difficile, celui qui passe par le glacier de Viad", vers: "160" },
    { texte: "Si vous préférez essayer l'itinéraire le plus long, mais le plus facile, celui qui traverse la plaine de Hrod et le défilé de la Tempête", vers: "273" }
  ]
  },
  {
  id: "2",
  texte: "Vous découvrez à votre droite une porte de pierre habilement dissimulée dans les sculptures contournées qui couvrent le mur. En examinant de près ces sculptures, vous apercevez un levier.",
  choix: [
    { texte: "Si vous souhaitez tirer ce levier", vers: "290" },
    { texte: "Sinon, vous pouvez continuer à monter l'escalier", vers: "76" }
  ]
  },
  {
  id: "3",
  texte: "Vous regardez les morceaux fracassés de la créature se dissoudre dans la glace avec un mélange de répulsion et de fascination. Bientôt, il ne reste plus du Serpent de Cristal que les reliefs de nourriture qui n'avaient pas encore été digérés par son estomac. A votre grand étonnement, vous apercevez, dans cette bouillie fétide de chair et d'os, la tige d'une Clé d'Argent.",
  choix: [
    { texte: "Si vous souhaitez prendre cette Clé", vers: "280" },
    { texte: "Si vous préférez ne pas y faire attention et essayer de trouver le moyen d'ouvrir la porte de la forteresse", vers: "344" }
  ]
  },
  {
  id: "4",
  texte: "Vous cachez le cadavre sous l'escalier et vous vous hâtez de le fouiller. Vous y découvrez une Épée d'Os et un Disque de Pierre Bleue. Si vous souhaitez conserver l'un ou l'autre de ces objets (ou les deux), inscrivez-les sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Vous abandonnez ensuite le cadavre et vous montez l'escalier quatre à quatre", vers: "332" }
  ]
  },
  {
  id: "5",
  texte: "Vous voyez deux hommes vêtus de haillons, assis devant un feu qui semble brûler à l'intérieur d'une petite boule de métal. Audessus des flammes, la carcasse dépecée d'un petit animal est en train de cuire à la broche. Les deux hommes sont vieux et édentés, et une étrange lueur de folie brille dans leurs yeux en amande.",
  choix: [
    { texte: "Si vous souhaitez vous approcher d'eux pour leur demander de partager avec vous leur repas", vers: "295" },
    { texte: "Si vous voulez les attaquer", vers: "14" },
    { texte: "Si vous préférez ne leur accorder aucune attention et poursuivre votre chemin", vers: "132" }
  ]
  },
  {
  id: "6",
  texte: "Vous progressez dans l'obscurité en tenant votre arme en avant, au cas où un obstacle se dresserait sur votre chemin. Le couloir se prolonge en direction du nord sur une certaine distance, puis il tourne brusquement vers la droite. A quelques mètres devant vous, vous apercevez à présent une lumière provenant d'une autre ouverture. Au-delà de cette source de lumière, un peu plus loin dans le tunnel, un escalier s'enfonce dans les ténèbres.",
  choix: [
    { texte: "Si vous souhaitez jeter un coup d'œil à travers cette ouverture", vers: "224" },
    { texte: "Si vous préférez descendre l'escalier", vers: "166" }
  ]
  },
  {
  id: "7",
  texte: "Soudain, le bloc noir explose en centaines d'éclats de pierre tranchants comme des rasoirs. Vous avez le dos quelque peu écorché, et les oreilles vous tintent mais, en dehors de ces menus désagréments, vous êtes indemne. En vous réfugiant dans le coin de la salle, vous avez échappé à des blessures qui auraient pu être graves. Il est clair à présent que le monolithe avait pour fonction d'interdire l'entrée aux intrus ou de les prendre au piège. Un ancien mage l'avait sans doute doté de pouvoirs de protection. Tandis que la poussière noire retombe lentement, vous remarquez qu'un panneau s'est ouvert dans le mur du nord, révélant un obscur passage qui permet de quitter la salle.",
  choix: [
    { texte: "Si vous souhaitez essayer de sortir par là", vers: "145" },
    { texte: "Si vous préférez essayer d'ouvrir à nouveau la porte par laquelle vous êtes entré", vers: "242" }
  ]
  },
  {
  id: "8",
  texte: "L'odeur est infecte et vous essayez désespérément de retenir votre respiration tandis que vous vous enduisez le torse de cette graisse visqueuse ; lorsque l'huile vous pénètre dans la peau, vous sentez se diffuser à l'intérieur de votre corps une chaleur rayonnante, comme si vous vous trouviez près d'un feu. Et, plus vous étalez de graisse, plus la chaleur augmente. Vous remarquez également que l'épouvantable odeur se dissipe peu à peu. « Lorsque l'huile imprègne votre peau, vous perdez l'odorat», explique Fenor. «Tant mieux, assure Dyce, sinon, je ne pourrais plus supporter ma propre compagnie ! » L'huile de Bakanal offre une excellente protection contre le froid mordant qui règne dans les terres de Kalte et elle vous épargnera peut-être la perte de précieux points d'ENDURANCE dans un proche avenir. Irian reprend bientôt connaissance et plonge les mains dans la carcasse du Bakanal pour bénéficier à son tour de l'huile bienfaisante. Le jour décline rapidement et vous décidez donc d'établir votre campement dans cet étroit passage.",
  choix: [
    { texte: "Vous préparez un Repas, puis vous montez la garde à tour de rôle, au cas où les Bakanals décideraient de revenir", vers: "325" }
  ]
  },
  {
  id: "9",
  texte: "Vous essayez désespérément de lutter contre l'atroce douleur, mais elle est si intense que vous perdez bientôt conscience. Dans quelques minutes, vous serez complètement vidé de votre énergie et vous deviendrez l'esclave docile de Vonotar, incapable de résister au pouvoir de sa force psychique ; il vous ordonnera alors de ramasser l'épée du Barbare des Glaces et de vous en servir pour vous trancher la gorge. Vous obéirez sans murmure et vous vous tuerez vous-même d'un simple geste du poignet. Votre mission s'achèvera donc ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Chute mortelle — §9"
  },
  {
  id: "10",
  texte: "Le sac contient quatre fioles de verre ouvragé. Elles sont remplies de liquides rouge, orange, vert et noir. Lequel souhaitez-vous examiner ?",
  choix: [
    { texte: "Examiner la fiole rouge", vers: "90" },
    { texte: "Examiner la fiole orange", vers: "171" },
    { texte: "Examiner la fiole verte", vers: "289" },
    { texte: "Examiner la fiole noire", vers: "225" },
    { texte: "Quitter les lieux et poursuivre vers le nord", vers: "126" }
  ]
  },
  {
  id: "11",
  texte: "Si vous souhaitez demander qui est l'actuel chef de Ragadorn, rendez-vous au 141. Si vous préférez lui demander le nom du fleuve qui partage Ragadorn en deux, rendez-vous au 159. Enfin, si vous désirez lui demander le nom de la taverne qui se trouve dans la rue de la Bernicle, rendez-vous au 234.",
  choix: [
    { texte: "Si vous souhaitez demander qui est l'actuel chef de Ragadorn", vers: "141" },
    { texte: "Si vous préférez lui demander le nom du fleuve qui partage Ragadorn en deux", vers: "159" },
    { texte: "Enfin, si vous désirez lui demander le nom de la taverne qui se trouve dans la rue de la Bernicle", vers: "234" }
  ]
  },
  {
  id: "12",
  texte: "Le matériel et les vivres sont rapidement déballés et répartis entre vous. Vous recevez des provisions qui représentent l'équivalent de 3 Repas, des Couvertures en Fourrure et une Corde. Inscrivez tous ces éléments sur votre Feuille d'Aventure en sachant que les Couvertures en Fourrure prennent dans votre Sac à Dos la place de deux objets normaux. Il vous est impossible d'emmener les chiens Kanu dans les montagnes et vous êtes donc contraint de les abandonner ici, de même que les traîneaux. Vous vous encordez avec vos guides, et vous vous mettez en route en direction d'un étroit passage qui s'enfonce entre les pics sombres et sinistres. Tout d'abord, l'escalade ne présente pas de difficultés bientôt mais , la pente de glace lisse devient abrupte et votre progression est beaucoup plus malaisée. Un vent se lève qui forme des tas de neige poudreuse contre les blocs de glace et la visibilité est alors réduite à quelques mètres. Les tas de neige sont trompeurs et parfois profonds. A deux reprises, vous vous y enfoncez jusqu'à la poitrine et les autres doivent venir vous dégager. Cette nuit-là, vous dressez votre tente sur une surface de granité recouverte de glace qui surplombe un profond ravin. Vous êtes épuisé et vous vous endormez presque au cours du Repas (n'oubliez pas de rayer ce Repas de votre Feuille d'Aventure). «Est-ce que vous parlez un peu la langue des Barbares des Glaces ? demande Dyce qui essaie d'entretenir la conversation. Pour ma part, je ne connais que quelques mots, Myjavik, par exemple. » Lorsque vous lui demandez ce que ce mot signifie, il observe un instant de silence puis vous répond: « Terreur... Myjavik signifie terreur. » Soudain, un bruit impressionnant retentit à l'extérieur de la tente. On dirait le rugissement d'un gros animal.",
  choix: [
    { texte: "Si vous souhaitez tirer votre épée et aller voir de quoi il s'agit", vers: "180" },
    { texte: "Si vous préférez retenir votre souffle en restant aussi immobile que possible", vers: "259" }
  ]
  },
  {
  id: "13",
  texte: "Il y a un levier dans le mur et un judas au milieu de la porte. En jetant un coup d'œil à travers le judas, vous découvrez un étrange spectacle : un homme vêtu d'une toge sombre est agenouillé au centre d'un pentacle dessiné à la craie sur le sol d'une cellule. Il a la tête penchée et semble en transe.",
  choix: [
    { texte: "Si vous souhaitez tirer le levier et ouvrir la porte", vers: "128" },
    { texte: "Si vous préférez laisser cet homme où il est et poursuivre votre exploration du couloir principal", vers: "254" }
  ]
  },
  {
  id: "14",
  texte: "Les deux hommes vous regardent d'un air horrifié et se hâtent de dégainer leur arme. Vous parvenez à tuer l'un d'eux avant que l'autre ne soit prêt à vous attaquer. Ce dernier est désespéré et se jette sur vous avec une intense fureur. Il vous faudra le combattre jusqu'à la mort de l'un de vous deux.",
  suite: "309",
  combat: { nom: "Barbare des Glaces", habilete: 15, endurance: 14 }
  },
  {
  id: "15",
  texte: "Vous examinez attentivement la serrure pour estimer vos possibilités de la forcer.",
  choix: [
    { texte: "Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière", vers: "185", requis: {"discipline":"maitrise-matiere"} },
    { texte: "Si vous disposez d'un Poignard ou d'une Epée d'Os", vers: "86" },
    { texte: "Si vous ne maîtrisez pas la Discipline indiquée et que vous n'ayez pas les armes requises, il vous faut quitter la salle et monter l'escalier", vers: "323" }
  ]
  },
  {
  id: "16",
  texte: "Vous parvenez tout juste à vous faufiler par l'entrebâillement avant que la porte de pierre ne claque derrière vous. Malheureusement, si vous portez un Sac à Dos sur les épaules, la porte, en se fermant, a cassé deux des objets que vous transportiez. Ils vous faut donc les rayer de votre Feuille d'Aventure (choisissez vous-même les objets ainsi perdus).",
  choix: [
    { texte: "Vous poursuivrez ensuite votre chemin le long du passage", vers: "63" }
  ]
  },
  {
  id: "17",
  texte: "Vous vous rendez compte que vous souffrez des premiers effets de la cécité des neiges. A moins de réagir immédiatement, d'autres symptômes plus douloureux de ce mal ne vont pas tarder à se manifester.",
  choix: [
    { texte: "Si vous souhaitez vous protéger les yeux par un bandeau que vous garderez au moins jusqu'au moment d'établir votre camp, plus tard dans la journée", vers: "62" },
    { texte: "Si vous n'aimez pas avoir un bandeau sur les yeux et que vous préfériez risquer la cécité des neiges", vers: "251" }
  ]
  },
  {
  id: "18",
  texte: "Lorsque votre épée s'enfonce dans le vent tourbillonnant, une soudaine douleur provoquée par un froid intense vous parcourt le bras. Vous perdez 3 points d'ENDURANCE et vous reculez d'un pas chancelant en tenant votre bras meurtri par le froid contre votre poitrine. Vous avez perdu votre arme et le cyclone devient de plus en plus puissant, vous forçant à vous réfugier dans un coin du temple.",
  choix: [
    { texte: "Si vous souhaitez essayer de vous enfuir vers l'arcade qui se trouve au-delà du tourbillon", vers: "211" },
    { texte: "Si vous préférez rester dans le coin du temple en espérant que vous y serez à l'abri", vers: "95" }
  ]
  },
  {
  id: "19",
  texte: "Vous courez le long du pont de glace et vous plongez pour attraper la main de Dyce, mais il est trop tard. Une seconde à peine avant que vous ne l'ayez atteint, il lâche prise et tombe en arrière dans le vide béant. Un frisson vous parcourt l'échiné tandis que vous entendez son hurlement disparaître dans les profondeurs obscures. Vous scrutez le fond du précipice sans pouvoir rien faire, lorsqu'Irian pousse soudain un cri : « Là, làbas ! s'exclame-t-il, je suis sûr que j'ai vu quelque chose ! » Vous regardez avec attention dans l'espoir de voir quelque chose à votre tour, mais la gorge est aussi noire qu'une nuit sans lune. Vous vous tournez alors vers Irian qui vous désigne non pas le précipice, mais l'horizon en direction de l'ouest. « Regardez làbas ! » dit-il en montrant une hauteur qui se dessine au loin. Deux guerriers vêtus de fourrure se tiennent debout au sommet d'une vaste étendue de glace. Ils regardent vers vous, alertés sans aucun doute par le cri désespéré de Dyce. « Des Barbares des Glaces, avertit Fenor, la voix tremblante de peur, s'ils atteignent Ikaya avant nous, c'est comme si nous étions déjà morts ! » Vous êtes à présent à 25 kilomètres de la forteresse et il reste moins de trois heures de jour.",
  choix: [
    { texte: "Si vous souhaitez poursuivre votre chemin en espérant que vous arriverez avant les Barbares", vers: "327" },
    { texte: "Si vous préférez les attaquer pour les empêcher de donner l'alerte", vers: "307" }
  ]
  },
  {
  id: "20",
  texte: "Le corps du Monstre d'Enfer bouillonne et se dissout à vos pieds, un gaz vert et fétide s'échappant de ses vêtements. Tandis que vous contemplez avec dégoût la décomposition du cadavre, vous comprenez soudain que l'immonde créature a probablement été envoyée pour tuer Vonotar; il ne peut y avoir d'autre raison plausible à sa présence ici. Les Maîtres des Ténèbres de I lelgedad veulent à tout prix la mort de Vonotar pour lui faire payer sa défaite dans la bataille du golfe de L’olm, et sans doute ont-ils appris où il se trouvait à présent. Le mage, après avoir découvert le Monstre de l'Enfer, l'a vraisemblablement enfermé dans un pentacle en attendant de mettre au point un moyen de le détruire à tout jamais. Vous tâtez prudemment votre gorge blessée et vous remerciez les dieux d'avoir en votre possession le Glaive de Sommer : une fois de plus, ses pouvoirs vous ont sauvé la vie.",
  choix: [
    { texte: "Empruntant le couloir principal, vous vous hâtez de vous éloigner de ces restes fumants", vers: "254" }
  ]
  },
  {
  id: "21",
  texte: "Vous tombez dans un sifflement glacé et vous il terrissez brutalement sur une surface gelée, près de 10 mètres plus bas. Vous avez le souffle coupé et vous êtes durement secoué, mais vous gardez conscience. Les cris îles guides se transforment bientôt en hurlements de (oie et de surprise lorsqu'ils vous voient vous relever tant bien que mal. Vous levez les yeux et vous voyez I mor qui saute sans encombre par-dessus la crevasse. Quelques secondes plus tard, on vous descend une corde et vous êtes ramené sain et sauf à la surface. Vous avez perdu vos chiens Kanu, votre traîneau avec les provisions qu'il contenait et 2 points d'ENDURANCE. Après s'être concertés avec vous, vos guides sont d'accord pour poursuivre la mission, bien qu'ils sachent que, désormais, les épreuves qui les attendent seront deux fois plus pénibles. En scrutant l'horizon, Irian repère alors un passage étroit au bord de la banquise à l'endroit où elle jouxte la plaine de Hrod. Vous vous remettez en chemin et, lorsque le soir tombe, vous avez atteint l'abri de ce passage où vous décidez d'installer votre campement. En faisant l'inventaire des provisions qui vous restent, vous vous apercevez qu'il faudra diminuer les rations de moitié si vous voulez arriver tous à Ikaya.",
  choix: [
    { texte: "La frugalité de votre dîner vous fait perdre 1 autre point d'ENDURANCE", vers: "325" }
  ]
  },
  {
  id: "22",
  texte: "Un pouvoir magique d'une grande puissance empêche votre esprit d'agir sur la serrure. Vous vous concentrez jusqu'à ce que la sueur perle à votre front, mais vous êtes incapable d'obtenir le moindre résultat.",
  choix: [
    { texte: "Plutôt que d'essayer d'ouvrir le coffre par la force, vous décidez à regret de l'abandonner et vous montez plutôt l'escalier", vers: "323" }
  ]
  },
  {
  id: "23",
  texte: "Vous avez de la chance. Les Bakanals sont réputés pour leur extraordinaire aptitude au sommeil ; ils peuvent en effet dormir jusqu'à trois jours de suite à n'importe quelle occasion, principalement après avoir fait un copieux repas. Ce Bakanal va dormir encore heures au moins.",
  choix: [
    { texte: "Vous pouvez donc passer devant lui sans encombre et quitter la salle", vers: "235" }
  ]
  },
  {
  id: "24",
  texte: "Vous visez soigneusement et vous lancez le Diamant dans le couloir. Il rebondit juste devant le Barbare des Glaces et finit sa course derrière l'escalier. Le Barbare, intrigué par le bruit et par l'éclat du Diamant, quitte son poste pour aller voir de quoi il retourne.",
  choix: [
    { texte: "Vous saisissez cette occasion pour grimper l'escalier sans vous faire remarquer", vers: "332" }
  ]
  },
  {
  id: "25",
  texte: "Vous remarquez que l'une des créatures porte au cou un Triangle de Pierre Bleue attaché à une chaîne. Vous pouvez le prendre si vous le souhaitez et le passer à votre propre cou. Vous l'inscrirez alors sur votre Feuille d'Aventure dans la case Objets Spéciaux.",
  choix: [
    { texte: "Vous essuyez ensuite votre arme et vous vous hâtez de poursuivre votre chemin, de peur qu'un autre Languabarb ne se montre", vers: "284" }
  ]
  },
  {
  id: "26",
  texte: "En dehors des épées d'os, vous trouvez également un poignard et une masse d'armes, tous deux taillés également dans de l'os. Les Barbares portent aussi à leur poignet gauche de curieux Bracelets. Ils sont tout à fait lisses, sans aucune marque ni inscription et semblent en or massif.",
  choix: [
    { texte: "Si vous souhaitez prendre l'un de ces Bracelets, passez-le à votre poignet et notez-le sur votre Feuille d'Aventure dans la case Objets Spéciaux", vers: "187" },
    { texte: "Si vous ne souhaitez pas prendre de Bracelet, vous pouvez poursuivre vos investigations", vers: "63" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "231", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "27",
  texte: "Vous avancez avec difficulté le long des sinistres montagnes pendant presque une heure, sans trouver d'abri pour échapper au vent glacé. A moins que vous ne vous soyez enduit le torse d'huile de Bakanal, vous perdrez 2 points d'ENDURANCE en raison du froid extrême.",
  choix: [
    { texte: "Si vous souhaitez poursuivre votre chemin pour essayer de trouver un abri", vers: "314" },
    { texte: "Si vous préférez creuser à la main un trou dans la neige pour y passer la nuit", vers: "205" }
  ]
  },
  {
  id: "28",
  texte: "Essuyant le sang qui vous a éclaboussé le visage, vous sortez de la cellule d'un pas chancelant et vous pénétrez dans le couloir. Au loin, vous apercevez une bifurcation.",
  choix: [
    { texte: "Si vous souhaitez fouiller le cadavre du Barbare des Glaces, il va falloir le traîner dans la lumière du couloir", vers: "210" },
    { texte: "Si vous préférez poursuivre votre mission aussi rapidement que possible, refermez la porte de la cellule et avancez le long du couloir jusqu'à la bifurcation", vers: "215" }
  ]
  },
  {
  id: "29",
  texte: "La crevasse s'élargit de plus en plus. Vous voyez Fenor sauter et atterrir sans dommage au bord du gouffre. Vous vous apprêtez à bondir à votre tour lorsque vous vous apercevez avec horreur que votre pied gauche se trouve pris dans les cordages du traîneau. Si vous n'avez ni l'un ni l'autre, utilisez la Table de Hasard pour obtenir un chiffre.",
  choix: [
    { texte: "Si vous possédez le Glaive de Sommer", vers: "43", requis: {"special":"glaive-sommer"} },
    { texte: "Si vous possédez la Maîtrise de la Matière", vers: "121", requis: {"discipline":"maitrise-matiere"} }
  ],
  evenement: {
        type: "jet-hasard-table",
        titre: "Crevasse — pied pris",
        branches: {
        "1-4": { vers: "226", texte: "Vous tombez" },
        "5-9": { vers: "266", texte: "Vous vous libérez" },
        "0-0": { vers: "312", texte: "Chute mortelle" }
      }
      }
  },
  {
  id: "30",
  texte: "Le passage se prolonge tout droit pendant quelques mètres, puis il tourne brusquement vers l'est. Un peu plus loin, vous apercevez une lueur qui filtre à travers une fente dans le mur. En y regardant de plus près, vous découvrez une porte secrète et un petit levier de pierre. Vous tirez sur le levier et la porte s'ouvre aussitôt en glissant latéralement, révélant un large couloir bien éclairé. A votre gauche, à moins de 10 mètres, vous remarquez un croisement. A votre droite, vous voyez une porte de pierre fermée.",
  choix: [
    { texte: "Si vous souhaitez examiner cette porte", vers: "203" },
    { texte: "Si vous préférez vous diriger vers le croisement", vers: "276" }
  ]
  },
  {
  id: "31",
  texte: "La statue se dresse lentement sur l'autel et s'avance vers vous. Tandis qu'elle s'approche, vous sentez un froid intense rayonner de sa surface de pierre lisse. Ses mouvements, cependant, sont raides et imprécis ; il ne vous serait pas difficile d'éviter ses bras tendus.",
  choix: [
    { texte: "Si vous souhaitez attaquer cette étrange statue", vers: "150" },
    { texte: "Si vous préférez la contourner et courir vers l'arcade qui se trouve derrière elle", vers: "306" }
  ]
  },
  {
  id: "32",
  texte: "Les créatures surgissent de la chute d'eau et bondissent sur vous ; il vous faut les combattre une par une.",
  suite: "32-b",
  choix: [
    { texte: "Si vous avez perdu des points d'ENDURANCE", vers: "66" },
    { texte: "Si vous n'avez perdu aucun point d'ENDURANCE", vers: "25" }
  ],
  combat: { nom: "Languabarb", habilete: 11, endurance: 35 }
  },
  {
  id: "33",
  texte: "Vous jetez le jeune garçon sur le traîneau, vous agrippez votre fouet et vous cinglez l'échiné des chiens Kanu qui se mettent à courir de toutes leurs forces. Les Barbares des Glaces vous donnent immédiatement la chasse, criant quelque chose à l'enfant dans leur étrange langage. Vous avez parcouru moins d'une centaine de mètres lorsque le garçon saute soudain du traîneau pour atterrir sur un grand tas de neige. Au même instant, une volée de flèches aux pointes d'os vous sifflent aux oreilles et l'une d'elles vous écorche l'épaule, vous faisant perdre 1 point d'ENDURANCE. Bien que l'enfant soit libre, à présent, deux des Barbares continuent de vous poursuivre ; mais vos chiens sont rapides et vous avez tôt fait de les distancer, eux et leurs flèches. A la nuit tombée, vous arrivez en bordure des monts de Viad. Ces impressionnantes montagnes de granité dressent leurs parois verticales au-dessus de la neige et de la glace et il vous sera impossible de les franchir par cette nuit froide et sans lune. En outre, un vent venant de l'ouest annonce du blizzard pour les heures qui viennent. Il vous faut trouver un abri, ou vous mourrez de froid.",
  choix: [
    { texte: "Si vous souhaitez vous diriger vers le nord pour chercher cet abri", vers: "27" },
    { texte: "Si vous préférez aller au sud", vers: "314" },
    { texte: "Si vous maîtrisez les Disciplines Kaï de l'Orientation ou du Sixième Sens", vers: "348" }
  ],
  fin: "mort",
  nomFin: "Pris par les Barbares — §33"
  },
  {
  id: "34",
  texte: "Vous vous souvenez tout à coup que vous possédez une Effigie de cette hideuse créature. Vous la sortez aussitôt de votre poche et vous la tenez devant vous. Elle se met alors à diffuser une étrange lueur qui semble hypnotiser le monstre. Vonotar n'a plus le contrôle de la créature qui, désormais, vous obéit. Le mage, se rendant compte qu'il a perdu, s'éloigne du fossé. Loi-Kymar vous rejoint peu après. Il essaie de vous dire quelque chose, mais il est hors d'haleine. « Servez-vous de lui, Loup Solitaire... Envoyezle... contre Vonotar!» Vous ordonnez au monstre de s'emparer de Vonotar et de l'immobiliser, et il vous obéit aussitôt. Le traître hurle de terreur et s'évanouit lorsque les tentacules gluants se referment autour de lui. Vous remarquez que, pendant ce temps, Loi-Kymar a jeté une poignée d'herbes pilées dans le fossé. Quelques secondes plus tard, des vignes vierges et toutes sortes de plantes grimpantes se mettent à pousser, formant un pont qui vous permet de franchir le fossé pour atteindre le Trône du Brumalmarc. Dès que vous êtes parvenu de l'autre côté, vous ordonnez à la créature de relâcher Vonotar et de retourner dans le fossé. Obéissante, elle se glisse dans l'obscurité et les blocs de cristal s'élèvent lentement pour se remettre en place. « Ligotezle, Loup Solitaire ! crie Loi-Kymar tandis qu'il cherche la Crosse de la Guilde, et prenez soin de lui ôter ses bagues et ses amulettes. C'est un maître en matière de fourberie et il ne faudrait surtout pas qu'il manque la petite fête que le Sommerlund lui réserve pour son retour. » Vous suivez les recommandations de Loi-Kymar et vous vous assurez que Vonotar est bien attaché. « Ah ! la voici », s'écrie enfin le magicien d'un ton triomphal. Il vient de découvrir la Crosse de la Guilde parmi les feuilles de vignes vierges enchevêtrées au pied du Trône. Il a hâte de s'en aller et vous le remerciez de son aide en lui donnant votre carte de Kalte sur laquelle vous lui montrez la position exacte du Cardonal. « Je n'en aurai pas besoin, assure-t-il, les cartes sont toujours fausses et je préfère m'en remettre à mon propre sens de l'orientation. » Loi-Kymar lève alors sa Crosse de la Guilde et un rayon de lumière aveuglante jaillit aussitôt de son extrémité.",
  choix: [
    { texte: "Le magicien décrit trois larges cercles dans les airs, tenant la Crosse à bout de bras, et la salle du Trône du Brumalmarc se transforme instantanément en un kaléidoscope multicolore", vers: "350" }
  ]
  },
  {
  id: "35",
  texte: "Vous éprouvez le sentiment désagréable que quelqu'un vous observe. Vous sortez de la tente et vous scrutez la nuit pour essayer de déceler une présence, mais la neige et l'obscurité ne laissent rien voir.",
  choix: [
    { texte: "A contrecœur, vous revenez à l'intérieur de la tente et vous vous couchez, en gardant votre arme à portée de main pour pouvoir faire face à toute attaque par surprise", vers: "291" }
  ]
  },
  {
  id: "36",
  texte: "Vous montez plus de cinquante marches avant d'atteindre l'arcade. Tandis que vous reprenez votre souffle, vous remarquez que des volutes de brume virevoltant et serpentant dans les airs dissimulent l'ouverture et ce qui se trouve derrière. Vous vous apercevez également que la température est beaucoup plus fraîche aux environs de cette porte voûtée.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens et si vous avez le titre Kaï de Gardien (ce qui signifie que vous maîtrisez 7 Disciplines Kaï)", vers: "341", requis: {"discipline":"sixieme-sens"} },
    { texte: "Si vous maîtrisez la Discipline Kaï du Sixième Sens sans avoir le rang de Gardien", vers: "124", requis: {"discipline":"sixieme-sens"} },
    { texte: "Enfin, si vous ne maîtrisez pas la Discipline Kaï du Sixième Sens, préparez-vous à passer à l'attaque et franchissez l'arcade", vers: "264", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "37",
  texte: "Dans l'obscurité, vous n'avez pas vu une étroite et profonde crevasse qui se dissimulait dans le sol de glace. Vous tombez dedans, vous faites une chute de plus de 15 mètres, et vous atterrissez sur des rochers pointus en vous cassant les deux jambes. Vous êtes immobilisé et il n'y a personne pour venir à votre secours. Votre mission s'achève donc ici en même temps que votre vie.",
  fin: "mort",
  nomFin: "Piège mortel — §37"
  },
  {
  id: "38",
  texte: "Au bout de dix minutes passées à fouiller la pièce, vous découvrez un Sac à Dos en fourrure et un long rouleau de Corde. Vous n'avez le droit de prendre le Sac à Dos que si vous n'en avez pas vous-même. La Corde, quant à elle, compte tenu de son volume, occupera la place de deux objets normaux dans votre Sac à Dos, si toutefois vous décidez de l'emporter.",
  choix: [
    { texte: "Voyant qu'il n'y a plus rien à trouver dans cette pièce encombrée de bric-à-brac, vous repartez et vous poursuivez votre exploration le long du passage orienté à l'est", vers: "237" }
  ]
  },
  {
  id: "39",
  texte: "Jusqu'à présent, tout va bien. Les gardes ne semblent pas vous prêter la moindre attention. Vous faites semblant de renouer les lacets de vos bottes et vous cachez la coupe derrière un pilastre. Vous retournez alors dans la cuisine et vous attendez que les vapeurs fassent leur effet. Moins d'une minute plus tard, les gardes s'écroulent sur le sol et vous pouvez vous approcher sans encombre de la salle du Trône. Vous êtes enchanté de découvrir que l'une des magnifiques portes incrustées de pierreries n'est pas fermée à clé.",
  choix: [
    { texte: "Vous préparant à passer à l'attaque, vous entrebâillez doucement la porte et vous entrez dans le repaire de Vonotar", vers: "173" }
  ]
  },
  {
  id: "40",
  texte: "Vous avez fait une chute de plus de 15 mètres, mais vous avez atterri sans dommage sur un tas de neige. Essuyant vos yeux couverts de neige glacée, vous restez bouche bée devant le spectacle qui s'offre à vous. Une vaste caverne s'étend aussi loin que porte votre regard; d'immenses stalactites de cristal pendent d'un plafond de glace et la neige fondue qui s'égoutte sans cesse emplit les lieux d'une étrange musique. Vous êtes en train de contempler un monde inconnu que fort peu de Sommelundois ont jamais vu: ce sont en effet les Grottes de Kalte qui s'ouvrent ainsi devant vous. Cet immense labyrinthe souterrain a été bâti par les Anciens, bien avant que les Sommerlundois, ou même les Maîtres des Ténèbres, ne viennent s'installer sur les terres de Magnamund. Ses larges galeries, ses temples et ses vastes salles ont abrité jadis une race de créatures pour qui la glace était un environnement naturel, des créatures dont les pas et les voix ont empli de leur écho ces espaces polaires. Des coupes de M'iare sont toujours suspendues au plafond, répandant une lumière inquiétante et éternelle. Vous suivez un large canal de neige fondue qui, au bout de 3 kilomètres, disparaît sous un mur de glace miroitante. Un pont de glace mène alors à un tunnel qui aboutit bientôt à une bifurcation.",
  choix: [
    { texte: "Si vous souhaitez prendre l'embranchement de gauche", vers: "125" },
    { texte: "Si vous préférez emprunter celui de droite", vers: "184" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "255" }
  ]
  },
  {
  id: "41",
  texte: "Vous ôtez le Triangle de Pierre Bleue de votre cou et vous l'appliquez contre le mur de granité : il s'adapte parfaitement au triangle gravé. Aussitôt, vous sentez trembler le rebord sur lequel vous vous tenez et vous entendez le grincement de pierres qui frottent les unes contre les autres. La porte s'ouvre mais, après s'être entrebâillée d'un mètre environ, elle commence déjà à se refermer.",
  choix: [
    { texte: "Sans hésiter un instant, vous plongez à l'intérieur de la forteresse et la porte claque derrière vous dans un grand bruit", vers: "221" }
  ]
  },
  {
  id: "42",
  texte: "Vous tirez le Glaive magnifique de son fourreau et vous en frappez la porte à coups redoublés. A chaque fois que le Glaive de Sommer ébrèche l'antique pierre, une gerbe d'étincelles illumine la pièce. La lame de l'épée rayonne d'un intense flamboiement d'or tandis que vous l'abattez avec force. Le Glaive de Sommer parviendra sans nul doute à détruire la pierre, mais il vous faudra plusieurs heures pour pratiquer une ouverture qui vous permette de vous enfuir.",
  choix: [
    { texte: "Si vous souhaitez continuer à marteler la porte à l'aide du Glaive de Sommer", vers: "294", requis: {"special":"glaive-sommer"} },
    { texte: "Si vous préférez abandonner, vous pouvez quitter la pièce par le passage secret aménagé dans le mur nord", vers: "145" }
  ]
  },
  {
  id: "43",
  texte: "Vous tirez le Glaive d'Or hors de son fourreau et, d'un geste, vous tranchez les cordes qui vous retiennent. Votre pied est à présent libéré et vous sautez du traîneau quelques secondes avant qu'il ne disparaisse dans le gouffre. Fenor se précipite vers vous et vous tire en arrière, loin du bord instable de la crevasse. Vous avez perdu vos chiens Kanu, votre traîneau et vos provisions, mais vous êtes en vie. Vous sautez tous deux par-dessus la crevasse, Fenor et vous, puis vous rejoignez les autres. Bien que vous ayez perdu votre équipement, les guides sont d'accord pour continuer la mission, tout en sachant que les épreuves qui vous attendent désormais seront encore plus pénibles qu'auparavant. Au loin, vous apercevez un étroit passage, au bord de la banquise, là où elle jouxte la plaine de Hrod. A la nuit tombée, vous atteignez l'abri de ce défilé et vous y installez votre campement. En faisant l'inventaire des provisions qui vous restent, vous vous rendez compte qu'il vous faudra diminuer les rations de moitié si vous voulez que toute l'expédition puisse atteindre la forteresse d'Ikaya.",
  choix: [
    { texte: "Le maigre Repas qui vous tient lieu de dîner vous fait perdre 1 point d'ENDURANCE", vers: "325" }
  ]
  },
  {
  id: "44",
  texte: "« Suivez-moi, dit Loi-Kymar, j'ai écouté attentivement tous les bruits de la forteresse pendant plus d'un an et je connais à présent toutes les portes dérobées, tous les passages cachés. Du fond de ma cellule, j'en ai appris davantage sur ces couloirs que Vonotar lui-même avec toute sa ruse. » Vous suivez alors le magicien à travers un réseau de tunnels et de passages secrets, d'escaliers et de salles froides et obscures. Au sommet d'un escalier particulièrement raide, vous arrivez devant une porte de pierre. Une odeur étrange et écœurante filtre à travers un petit judas. « Ce sont les cuisines », murmure Loi-Kymar en faisant une grimace éloquente pour exprimer tout le dégoût que lui inspire la pitance servie dans la forteresse. Cette porte secrète est située juste à côté d'une cheminée dans laquelle brûle un feu d'enfer. Un grand chaudron de pierre rempli de gruau est suspendu au-dessus du feu. Deux Barbares des Glaces sont assis à une table proche, devant des bols vides.",
  choix: [
    { texte: "Si vous avez une Potion Noire de Ronces des Cimetières", vers: "79" },
    { texte: "Si vous avez une Potion Verte de Brosse à Potences", vers: "157" },
    { texte: "Si vous ne possédez aucune de ces deux potions, il vous reste à ouvrir la porte pour attaquer par surprise les Barbares désarmés", vers: "270" }
  ]
  },
  {
  id: "45",
  texte: "Le coffre est décoré de têtes de créatures grotesques et grimaçantes. Leur expression obscène et leur aspect monstrueux vous font frissonner de dégoût. Au milieu du couvercle, un gros bloc de pierre sculptée représente un visage hideux dont la bouche est constituée par un trou de serrure.",
  choix: [
    { texte: "Si vous possédez une Clé d'Argent", vers: "303", requis: {"special":"cle-argent"} },
    { texte: "Dans le cas contraire", vers: "15" }
  ]
  },
  {
  id: "46",
  texte: "Vous prenez la Sphère de Feu rangée dans votre tunique et vous en séparez aussitôt les deux moitiés que vous posez derrière vous, sur l'étroite corniche. Le Javek siffle avec force, pointant ses deux têtes aux yeux brillants de fureur. Il éprouve de toute évidence l'envie irrésistible de vous attaquer, mais il n'ose pas s'approcher de la Sphère de Feu. Il essaie alors de contourner les flammes, mais la corniche est très étroite : elle ne fait guère plus d'une trentaine de centimètres de large. Il lui est donc impossible de passer sans se brûler. Finalement, furieux mais impuissant, l'étrange reptile se résigne à abandonner la partie, disparaissant dans une cavité située au bout de la corniche.",
  choix: [
    { texte: "Vous pouvez à présent récupérer votre Sphère de Feu et poursuivre votre exploration", vers: "269" }
  ]
  },
  {
  id: "47",
  texte: "Vous essayez pendant une demi-heure de forcer la serrure, mais vous êtes finalement obligé de renoncer. Vous avez tout essayé sans succès: elle refuse de s'ouvrir.",
  choix: [
    { texte: "A contrecœur, vous remettez donc votre arme au fourreau et vous quittez la salle pour monter l'escalier", vers: "323" }
  ]
  },
  {
  id: "48",
  texte: "Le Barbare des Glaces passe à une quinzaine de centimètres de votre cachette. Il s'arrête un instant, puis revient sur ses pas le long du couloir. Vous poussez alors un soupir de soulagement: il ne vous a pas découvert.",
  choix: [
    { texte: "Si vous souhaitez vous enfuir sur la pointe des pieds par le couloir orienté au nord", vers: "215" },
    { texte: "Si vous préférez attaquer le Barbare des Glaces par derrière", vers: "260" }
  ]
  },
  {
  id: "49",
  texte: "Vous escaladez la paroi rocheuse sur une distance de 5 mètres environ et vous atteignez une corniche de glace mince. De là, vous voyez clairement la fissure. Il vous semble avoir aperçu une silhouette lorsque, soudain, la glace se dérobe sous vos pieds et vous précipite tête la première dans un éboulement de granité et de neige. Vous vous attendez à faire une chute de quelques mètres, et vous vous préparez à vous recevoir le moins brutalement possible, mais en fait vous tombez droit dans une crevasse cachée sous une couche de neige poudreuse. Vous atterrissez enfin quelque 30 mètres plus bas sur un énorme tas de neige. Aveuglé, étourdi et suffoquant à moitié, vous vous efforcez de vous dégager de cet amas et, lorsque vous y parvenez enfin, le spectacle qui s'offre à vos yeux vous laisse bouche bée. Un immense tunnel s'étend devant vous, aussi loin que votre regard peut porter. De gigantesques stalactites de cristal pendent du plafond de glace et la neige fondante qui tombe goutte à goutte emplit la caverne d'une étrange musique. Vous appelez au secours à grands cris jusqu'à ce que vous ayez la gorge sèche et douloureuse ; vos guides, cependant, ne vous entendent pas. Vous avez toujours votre arme (ou vos armes) avec vous, ainsi que vos Pièces d'Or et vos Objets Spéciaux, mais vous n'avez plus votre Sac à Dos qui est resté sous la tente. En levant les yeux, vous vous apercevez que le trou dans lequel vous êtes tombé n'est plus qu'un point minuscule sur la voûte du souterrain. La lumière qui éclaire la caverne semble provenir de grandes coupes de pierre suspendues au plafond. Ce sont des coupes de M'iare, une source de lumière éternelle, découverte il y a des siècles par les Anciens. Vous vous rendez bientôt compte que vos guides ne découvriront probablement jamais l'endroit où vous avez atterri et vous décidez donc d'avancer le long du vaste tunnel dans l'espoir de trouver une sortie. Au bout de deux heures de marche, vous arrivez à une bifurcation.",
  choix: [
    { texte: "Si vous souhaitez emprunter le passage de gauche", vers: "284" },
    { texte: "Si vous préférez suivre celui de droite", vers: "199" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï de l'Orientation", vers: "342" }
  ]
  },
  {
  id: "50",
  texte: "Avez-vous découvert l’Ancien Temple d'Ikaya et emporté avec vous une Pierre Rayonnante ?",
  choix: [
    { texte: "Si vous possédez cet Objet Spécial", vers: "139" },
    { texte: "Dans le cas contraire", vers: "189" }
  ]
  },
  {
  id: "51",
  texte: "Vous sentez que les Loups Maudits sont profondément endormis. Vous avez une chance de pouvoir passer devant eux, de maîtriser le Barbare des Glaces et de refermer la porte de la cellule avant qu'ils ne s'éveillent. Vous savez cependant que vous courez là un grand risque et que vos chances de réussite sont faibles.",
  choix: [
    { texte: "Si vous êtes suffisamment courageux pour entrer dans une cellule remplie de Loups Maudits", vers: "285" },
    { texte: "Si vous préférez ne pas prendre ce risque, il vous faut quitter les lieux et descendre l'escalier", vers: "261" }
  ]
  },
  {
  id: "52",
  texte: "Tandis que vous escaladez la rampe glissante, un craquement derrière vous vous fait faire volte-face. L'entassement de cristaux, au pied de la rampe, commence à bouger. Les cristaux sont vivants ! D'un air incrédule, vous les voyez se transformer en une masse d'anneaux translucides qui se déploient peu à peu, révélant la forme d'une créature de glace. Le monstre glisse vers vous en ondulant.",
  choix: [
    { texte: "Si vous souhaitez fuir cette créature en courant vers la porte de pierre", vers: "169" },
    { texte: "Si vous préférez la combattre", vers: "265" }
  ]
  },
  {
  id: "53",
  texte: "Malheureusement, vous avez mal calculé votre élan et la porte se referme en vous broyant les jambes. Dans quelques minutes, vous vous serez vidé de votre sang. Votre mission s'achève donc ici, en même temps que votre vie.",
  fin: "mort",
  nomFin: "Écrasé par la porte — §53"
  },
  {
  id: "54",
  texte: "Le verre est très fin et vous avez besoin de toute votre concentration et de toute votre habileté pour éviter de le casser. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière ou celle de la Puissance Psychique, ajoutez 3 au chiffre que vous aurez tiré.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Briser la cire",
        texte: "Si vous possédez la Maîtrise Psychique de la Matière ou la Puissance Psychique, ajoutez 3.",
        branches: {
        "0-4": { vers: "250", texte: "Verre brisé, poison" },
        "5-12": { vers: "268", texte: "Cire brisée sans casse" }
      }
      }
  },
  {
  id: "55",
  texte: "Vous êtes à moins de 30 mètres du sommet lorsque vos mains cessent peu à peu de vous faire mal. Bientôt, vous ne sentez plus rien du tout : le gel vous a rendu insensible des avant-bras à l'extrémité des doigts. Dans un dernier effort, vous atteignez un étroit rebord de glace sur lequel vous pouvez vous agenouiller et vous reposer un peu. Quelques instants plus tard, cependant, vous vous rendez compte qu'il vous est impossible de grimper plus haut. En effet, vous vous trouvez face à des parois de glace abruptes dont la surface lisse n'offre aucune prise. Il vous faut donc redescendre. Vous ne retrouvez la sensibilité de vos mains que plus de quatre heures après, et la morsure du gel vous fait perdre 5 points d'ENDURANCE. En outre, vous perdez également 2 point d'HABILETÉ à déduire de votre total de départ. Cette perte est définitive et durera jusqu'à la fin de votre vie. Cinq heures vous sont nécessaires pour revenir au pied de la montagne.",
  choix: [
    { texte: "Epuisé et rongé par la douleur, vous vous armez de courage pour essayer de trouver un autre moyen d'échapper à ce gouffre infernal", vers: "182" }
  ]
  },
  {
  id: "56",
  texte: "« Par ma foi ! Un Seigneur Kaï ! s'exclame-t-il, les yeux ronds de stupeur. J'ai tant désiré retrouver ma liberté, tant attendu qu'on vienne me délivrer de cette infernale prison ! Mais, bien que l'espoir ne m'ait jamais quitté, je n'aurais pu penser que mon sauveur serait un personnage aussi illustre ! » Au plus fort de son exaltation, le vieil homme est soudain pris d'une quinte de toux ; lorsqu'enfin il peut reprendre son souffle, il est pâle, épuisé, et ne peut à nouveau parler que quelques minutes plus tard. « Je m'appelle Loi-Kymar, dit-il, je suis l'un des Anciens de la Guilde des Magiciens de Toran. » Il vous montre alors, sous sa toge en lambeaux, un pendentif en Étoile de Cristal, le symbole de la guilde. La guilde est connue sous le nom de la Confrérie de l'Étoile de Cristal et le magicien vous donne ainsi la preuve tangible de son identité. Vous lui demandez ensuite comment il se fait qu'il soit emprisonné ici, à Ikaya, à plusieurs centaines de kilomètres de sa ville natale de Toran. « C'est Vonotar, ce traître abject qui est responsable de mon tourment. Avant l'invasion du Sommerlund par les Maîtres des Ténèbres, il a trahi les Maîtres Kaï pour gagner de nouveaux pouvoirs, les sombres pouvoirs de la mort et de l'obscurité. Il ne parvint pas, cependant, à remplir le rôle qui lui avait été attribué dans la stratégie guerrière de ses maîtres maléfiques. Or, les Maîtres des Ténèbres ne peuvent tolérer une telle faiblesse, leur esprit monstrueux ignore la pitié. Dans l'amertume de la défaite, ils ont cherché à tuer Vonotar pour le punir du crime d'avoir échoué. Vonotar, quant à lui, savait que le moyen d'échapper à leur vengeance se trouvait en ma possession : ma Crosse de la Guilde a en effet le pouvoir de transporter instantanément d'un lieu à un autre une personne ou un objet. Il essaya donc de me la voler pour s'enfuir ainsi à Ikaya où il serait en sûreté. Il apprit bien vite, cependant, que les pouvoirs de la Crosse magique ne sont pas à la portée du premier venu ; je suis le seul, en effet, à connaître son secret. Furieux, il menaça de tuer toute ma famille si je refusais de l'amener jusqu'ici à l'aide de la Crosse. Je n'avais donc pas d'autre choix que d'accepter. Depuis ce temps, je suis resté prisonnier dans cette cellule. Mais, en dépit des tortures physiques et mentales que Vonotar m'a fait subir, je ne lui ai jamais révélé le secret de la Crosse de la Guilde qu'il conserve, je le sais, dans la salle du Trône du Brumalmarc. Si je lui disais ce secret, ma vie ne vaudrait plus très cher. » Vous expliquez alors à Loi-Kymar la nature de votre mission et vous lui racontez la suite d'événements qui vous a amené à le rencontrer. Il vous propose aussitôt de vous montrer le chemin qui mène à la salle du Trône du Brumalmarc, où Vonotar exerce ses pouvoirs de chef suprême. Et si vous parvenez à retrouver la Crosse de la Guilde, il vous promet de vous transporter instantanément jusqu'au point de la côte où se trouve ancré le Cardonal. Vous pourrez ainsi rejoindre le navire à temps.",
  choix: [
    { texte: "Pour la première fois depuis que vous êtes tombé dans les Grottes de Kalte, vous avez le sentiment que votre mission est sur la voie du succès", vers: "192" }
  ]
  },
  {
  id: "57",
  texte: "Le lendemain, un froid vif règne alentour et un vent violent venant du nord souffle sans relâche. Le visage fouetté par les rafales, vos lèvres bientôt se dessèchent, gercent et saignent. Votre nez commence à couler mais le mucus gèle instantanément. Le soleil est caché par une neige épaisse qui tombe en flocons serrés et obscurcit la lumière du jour. Les tas de neige compacte et les trous dans la glace disparaissent sous la poudreuse et souvent un traîneau verse ou s'enlise, obligeant l'expédition à interrompre son avance. Il vous faut sans cesse scruter le sol pour essayer d'apercevoir les obstacles de glace qui peuvent se dresser sur votre chemin, et le scintillement de la neige met vos yeux à rude épreuve ; vers midi, votre vision devient floue.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Guérison", vers: "17", requis: {"discipline":"guerison"} },
    { texte: "Sinon", vers: "251" }
  ]
  },
  {
  id: "58",
  texte: "Le cône de givre s'enfonce dans le feuillage des plantes et les gèle instantanément. Tiges et feuilles deviennent alors cassantes et se brisent sous votre poids. Sans un instant d'hésitation, vous vous précipitez vers l'extrémité du pont végétal et vous parvenez à bondir sur la plate-forme où se tient Vonotar juste avant que les plantes ne se soient complètement désagrégées.",
  choix: [
    { texte: "Vous avez réussi à traverser le fossé, mais à présent, vous êtes étendu aux pieds de Vonotar qui se met à ricaner en pointant sa baguette de cristal sur votre tête", vers: "252" }
  ]
  },
  {
  id: "59",
  texte: "Emporté par son élan, le Languabarb continue de charger sur la mince couche de glace qui cède sous son poids. Sous la surface gelée, une ombre file alors vers la créature qui se débat furieusement dans l'eau glacée et l'emporte soudain dans les profondeurs. Tout devient aussitôt étrangement immobile, tandis qu'une nappe d'eau rougie s'étale lentement sous la glace. Vous vous hâtez en direction du tunnel dont les contours déchiquetés se dessinent de l'autre côté du lac. Lorsque vous prenez pied sur la glace épaisse de la rive, vous remarquez un objet à terre. C'est un petit Triangle de Pierre Bleue attaché à une chaînette. Si vous souhaitez conserver ce Triangle de Pierre Bleue, passez la chaîne autour de votre cou, et inscrivez l'objet sur votre Feuille d'Aventure, dans la case Objets Spéciaux.",
  choix: [
    { texte: "Entrez ensuite dans le tunnel", vers: "235" }
  ]
  },
  {
  id: "60",
  texte: "Vous avez à peine monté une douzaine de marches qu'un éclair aveuglant jaillit entre les deux piliers. Vous voyez alors la Statue remuer, comme animée par une soudaine énergie.",
  choix: [
    { texte: "Si vous souhaitez attaquer cette créature avant qu'elle ne se dresse sur l'autel", vers: "150" },
    { texte: "Si vous préférez rester parfaitement immobile et vous préparer à combattre", vers: "31" },
    { texte: "Enfin, si vous estimez plus sage de vous précipiter vers l'arcade obscure", vers: "306" }
  ]
  },
  {
  id: "61",
  texte: "Vous pénétrez dans une galerie couverte qui entoure une cour intérieure. Soudain, vous entendez le tintement sourd d'une cloche de pierre que l'on sonne dans une tour de guet située audessus de la forteresse ; c'est une cloche d'alarme. La galerie et la cour intérieure sont complètement vides ; vous n'apercevez qu'un traîneau à voile rangé près de l'entrée. Vous décidez alors de prendre le risque d'aller voir et vous descendez l'escalier qui mène dans la cour. Quelques instants plus tard, vous découvrez que le traîneau est chargé de vivres et de matériel en provenance de Liouk. Toute la forteresse est à présent alertée de votre arrivée et il ne vous est donc plus possible d'accomplir votre mission. La seule chose qui vous reste à faire, c'est de vous enfuir sur le traîneau à voile pendant qu'il en est encore temps. Dans dix jours, vous aurez rejoint le navire Cardonal et vous n'aurez plus qu'à reconnaître l'échec de votre mission.",
  fin: "neutre",
  nomFin: "Fuite et échec — §61"
  },
  {
  id: "62",
  texte: "Tandis que la lumière du jour décline peu à peu, le blizzard se met à souffler sur la banquise en faisant claquer sans relâche la toile de votre tente. Ce bruit lancinant s'ajoutant à la douleur de vos doigts et de vos orteils vous met les nerfs à vif et vous commencez à souhaiter n'avoir jamais mis les pieds dans cet enfer glacé. Puis, au beau milieu de la nuit, le vent déchire le bord de la toile et la force de la rafale disperse vos vivres et votre équipement. Vous êtes contraint de passer le reste de la nuit à plat ventre, appuyé sur les coudes, vos doigts gelés crispés sur la toile pour l'empêcher de s'envoler. Une gadoue à moitié gelée se glisse sous vos Couvertures de Fourrure et lorsque l'aube se lève, vos vêtements, gelés à leur tour, sont devenus tout raides. Vous perdez 3 points d'ENDURANCE.",
  choix: [
    { texte: "Modifiez votre Feuille d'Aventure en conséquence, et", vers: "167" }
  ]
  },
  {
  id: "63",
  texte: "Vous suivez le passage qui se prolonge vers le nord puis tourne brusquement vers l'ouest. Un peu plus loin, un escalier de pierre mène à une arcade située à une dizaine de mètres plus haut. De l'autre côté de l'escalier, vous remarquez une autre porte de pierre à côté de laquelle se trouve un levier fixé au mur. Le levier est relevé et la porte fermée.",
  choix: [
    { texte: "Si vous souhaitez monter l'escalier", vers: "323" },
    { texte: "Si vous préférez examiner la porte", vers: "246" }
  ]
  },
  {
  id: "64",
  texte: "Vous avez le sentiment désagréable qu'un danger vous guette dans l'un et l'autre tunnels. Le tunnel orienté au nord est le plus dangereux, vous le sentez, mais vous êtes également convaincu que c'est le plus court chemin pour gagner Ikaya.",
  choix: [
    { texte: "Si vous souhaitez entrer dans le tunnel nord", vers: "235" },
    { texte: "Si vous préférez le tunnel ouest", vers: "275" }
  ]
  },
  {
  id: "65",
  texte: "Les boutons sont à présent coincés : malgré tous vos efforts, vous ne parvenez pas à les faire bouger.",
  choix: [
    { texte: "Il ne vous reste donc plus, à présent, qu'à abandonner l'autel et à quitter le temple par l'arcade située au nord", vers: "306" }
  ]
  },
  {
  id: "66",
  texte: "Le crin qui recouvre la langue des Languabarbs contient un puissant venin grâce auquel la créature paralyse ses victimes avant de les dévorer. Le venin agit en quelques secondes ; or, malheureusement pour vous, le poil rêche de la langue du monstre vous a inoculé le poison et vous perdez très vite conscience. Jamais vous ne vous réveillerez de ce sommeil qui met fin à votre mission en même temps qu'à votre vie.",
  fin: "mort",
  nomFin: "Venin des Languabarbs — §66"
  },
  {
  id: "67",
  texte: "L'homme rejette soudain la tête en arrière comme si on venait de l'éveiller brusquement d'une transe. « Qui est là ? murmure-t-il en scrutant l'obscurité de ses yeux profondément enfoncés dans leurs orbites. Y a-t-il quelqu'un ici ou est-ce la folie qui me visite ?» Vous tendez alors la main à travers l'ouverture et vous lui faites un signe pour montrer où vous êtes. « Loués soient les dieux ! s'écrit l'homme en se levant d'un bond. Je m'appelle Tygon et je suis un marchand de Radagorn. Les Barbares des Glaces m'ont capturé, ils ont volé ma marchandise et m'ont amené ici. J'attends maintenant d'être reçu par leur nouveau Brumalmarc, le mage Vonotar du Sommerlund. C'est lui, semble-t-il, qui doit décider de mon sort. Si vous me libérez, je ferai tout ce qui sera en mon pouvoir pour vous aider. »",
  choix: [
    { texte: "Si vous disposez d'une Corde, vous pouvez la descendre à travers l'ouverture et aider l'homme à sortir de sa cellule", vers: "328" },
    { texte: "Si vous n'avez pas de Corde, ou si vous ne souhaitez pas aider cet homme, vous reprendrez votre chemin le long du tunnel en direction de l'escalier", vers: "166" }
  ]
  },
  {
  id: "68",
  texte: "Le Barbare des Glaces s'approche et soudain, il pousse un cri à vous figer le sang, puis se précipite sur vous.",
  suite: "186",
  combat: { nom: "Barbare des Glaces", habilete: 18, endurance: 28 }
  },
  {
  id: "69",
  texte: "Vous avez parcouru moins d'une vingtaine de mètres lorsque vous voyez soudain apparaître une patrouille de six Barbares des Glaces qui marchent dans votre direction, le long du couloir. Vous remarquez alors, sur votre gauche, un petit escalier qui descend dans une salle obscure.",
  choix: [
    { texte: "Si vous souhaitez courir au bas de ces marches pour vous cacher de la patrouille", vers: "108" },
    { texte: "Si vous souhaitez battre en retraite vers le palier et prendre le couloir orienté au nord", vers: "198" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Camouflage", vers: "222", requis: {"discipline":"camouflage"} }
  ]
  },
  {
  id: "70",
  texte: "« Vite ! il faut remballer nos affaires et partir immédiatement ! s'écrie Fenor, tandis que le mugissement du vent emporte ses paroles dans la nuit noire. Les Languabarbs ne chassent jamais seuls ; il y en a sûrement d'autres à proximité et ils sentent l'odeur du sang à des kilomètres à la ronde. » Vous démontez la tente et vous vous hâtez de partir, Dyce ouvrant la marche, vousmême surveillant les arrières. Mais à peine avez-vous parcouru une cinquantaine de mètres qu'une catastrophe survient. Aveuglé à la fois par le vent et l'obscurité, Dyce ne remarque pas que le chemin s'arrête brusquement, tout au bord d'un précipice. Votre sang se glace d'horreur lorsque vous entendez les cris de vos deux guides retentir dans les ténèbres, puis décroître tout au long de leur chute. La mort vous menace de tous côtés et vous vous cramponnez désespérément à la paroi glacée.",
  choix: [
    { texte: "Si vous vous êtes enduit le corps d'huile de Bakanal", vers: "209" },
    { texte: "Dans le cas contraire", vers: "339" }
  ]
  },
  {
  id: "71",
  texte: "Vous sentez que l'enfant Barbare cache un poignard en os dans l'une de ses bottes. Il essaie de s'en saisir pour vous attaquer.",
  choix: [
    { texte: "A présent que votre Sixième Sens vous a averti du danger", vers: "320" }
  ]
  },
  {
  id: "72",
  texte: "Vous examinez soigneusement l'autel ainsi que les deux piliers noirs qui se dressent à sa surface. Le cyclone continue de mugir mais, tant que vous tiendrez la Sphère de Feu dans vos mains, il ne s'approchera pas de l'autel.",
  choix: [
    { texte: "Vous remarquez bientôt qu'à l'endroit où reposait la statue deux boutons de pierre sont apparus", vers: "227" }
  ]
  },
  {
  id: "73",
  texte: "Les guides vous regardent comme si vous étiez fou et refusent de vous accompagner. Tout d'abord, les chiens Kanu sont réticents lorsque vous approchez de la gorge, mais en les encourageant à l'aide de quelques bons coups de fouet, vous parvenez à les faire changer d'avis. Il y a moins de 15 centimètres de glace de chaque côté des patins de votre traîneau et vous avez besoin de toute votre concentration pour vous maintenir au centre de ce pont gelé. Vous êtes parvenu à moins de 5 mètres du bord opposé quand soudain un terrible craquement retentit. Le traîneau est alors violemment secoué. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-7": { vers: "119", texte: "Si vous tirez un chiffre entre 0 et 7," },
        "8-9": { vers: "136", texte: "Si vous tirez le 8 ou le 9," }
      }
      }
  },
  {
  id: "74",
  texte: "Les murs de pierre du couloir sont couverts d'étranges sculptures qui projettent de grandes ombres. Vous vous servez de ces ombres pour vous y dissimuler avec l'agilité qui vous est coutumière. Le Barbare des Glaces avance lentement dans votre direction, les muscles tendus, la démarche hésitante. Vous avez alors la chair de poule en remarquant pour la première fois que ses yeux blancs sont dépourvus de pupilles. Retenant votre souffle, vous faites des prières pour qu'il ne vous ait pas vu. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-4": { vers: "48", texte: "Si vous tirez un chiffre entre 0 et 4," },
        "5-9": { vers: "287", texte: "Si vous tirez entre 5 et 9," }
      }
      }
  },
  {
  id: "75",
  texte: "Ces traces ont été laissées par de redoutables créatures carnivores que l'on appelle des Bakanals. Si vous veniez à les rencontrer dans l'espace étroit et sombre d'un tunnel, vos chances de survie seraient fort minces en vérité. Bien que votre Discipline Kaï vous ait permis d'identifier ces traces, il vous est impossible cependant de deviner dans quel tunnel les Bakanals se trouvent à présent.",
  choix: [
    { texte: "Si vous souhaitez emprunter le tunnel de gauche", vers: "235" },
    { texte: "Si vous préférez le tunnel de droite", vers: "114" }
  ]
  },
  {
  id: "76",
  texte: "Vous continuez à monter des marches jusqu'à ce que vous arriviez devant une étroite porte de pierre. Comme toutes les autres portes que vous avez vues jusqu'à présent, celle-ci est également actionnée par un levier fixé au mur. Un petit judas a été aménagé au milieu de la porte. Avec prudence, vous collez un œil contre cette minuscule ouverture et vous jetez un regard dans la petite pièce située derrière. Vous apercevez alors trois Loups Maudits endormis sur le sol de cette cellule. La porte d'une autre cellule s'ouvre dans le mur nord et vous apercevez, se découpant dans l'embrasure, la silhouette d'un Barbare des Glaces qui vous tourne le dos.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Chasse ou celle de la Communication Animale", vers: "51", requis: {"discipline":"chasse"} },
    { texte: "Si vous ne possédez aucune de ces deux Disciplines, vous pouvez ouvrir la porte et attaquer les Loups Maudits", vers: "137" },
    { texte: "Si vous préférez vous éloigner de la porte de cette cellule, redescendez l'escalier", vers: "261" }
  ]
  },
  {
  id: "77",
  texte: "Vous reconnaissez l'odeur âcre de Ronces des Cimetières que l'on a distillées. C'est là un poison violent et les simples vapeurs qui s'en dégagent sont suffisantes pour vous faire tourner la tête et vous troubler la vue. Vous vous hâtez de vous débarrasser du verre cassé et vous vous couvrez le nez avec la manche de votre tunique. Les vapeurs empoisonnées vous font perdre 1 point d'ENDURANCE.",
  suite: "10",
  choix: [
    { texte: "Pour faire un autre choix", vers: "10" }
  ],
  effets: { endurance: -1 }
  },
  {
  id: "78",
  texte: "Vous vous préparez en hâte et vous sortez de la tente. Le vent s'est intensifié et il emporte la neige poudreuse en petits tourbillons qui réduisent considérablement la visibilité. Une ombre sur votre droite trahit la présence du Bakanal qui bondit sur vous. Vous n'avez plus le temps d'éviter son Assaut, et il vous faut le combattre jusqu'à la mort.",
  suite: "245",
  combat: { nom: "Bakanal", habilete: 19, endurance: 30 }
  },
  {
  id: "79",
  texte: "Vous entrouvrez la porte, juste assez pour pouvoir verser la fiole de Ronces des Cimetières dans le gruau bouillonnant. Vous n'avez pas à attendre très longtemps : bientôt, les Barbares des Glaces ont absorbé leur dernier dîner, et dès que leurs cadavres sont étendus sur le sol, vous commencez à inspecter la cuisine en toute tranquillité. C'est une petite cuisine qui comporte des réserves d'herbes étonnamment abondantes. « Elles viennent sans doute des comptoirs de Liouk », dit Loi-Kymar en regardant le contenu des bocaux et des pots rangés sur des étagères. Il prend plusieurs bocaux d'herbes et les entasse dans les vastes poches de sa toge. Vous avez hâte, pour votre part, de quitter les lieux, de peur que d'autres gardes n'arrivent, mais le vieux magicien semble complètement absorbé par ses découvertes. Il ouvre deux petits bocaux et en mélange le contenu en insistant pour que vous partagiez avec lui cette mixture. « Elle vous donnera des forces, Loup Solitaire », assure-t-il. Tandis que vous mangez les feuilles séchées qu'il vous offre, vous sentez tout votre corps rayonner de chaleur.",
  choix: [
    { texte: "Vous gagnez 6 points d'ENDURANCE à ajouter à votre total actuel", vers: "301" }
  ]
  },
  {
  id: "80",
  texte: "Lorsque le Languabarb surexcité surgit du tunnel, vous attendez le dernier moment pour faire un bond de côté. Utilisez la Table de Hasard pour obtenir un chiffre.",
  evenement: {
        type: "jet-hasard-table",
        branches: {
        "0-1": { vers: "123", texte: "Si vous tirez le 0 ou le 1," },
        "2-9": { vers: "59", texte: "Si vous tirez entre 2 et 9," }
      }
      }
  },
  {
  id: "81",
  texte: "Vous vous apprêtez à cacher le cadavre sous l'escalier lorsque vous entendez soudain d'étranges cris et des hurlements rauques qui viennent du couloir. Un groupe de Barbares des Glaces s'avance vers vous. La vue de ces guerriers vous laisse un instant bouche bée : ce sont en effet de hideux mutants. Rempli de crainte et de dégoût, vous montez l'escalier quatre à quatre jusqu'à un vaste palier où vous trouvez un couloir orienté nordsud.",
  choix: [
    { texte: "Si vous souhaitez courir en direction du nord", vers: "198" },
    { texte: "Si vous préférez aller vers le sud", vers: "69" }
  ]
  },
  {
  id: "82",
  texte: "La grotte est sombre et le sol descend en pente raide dans l'obscurité. Vous parcourez une soixantaine de mètres avant de distinguer une lueur un peu plus loin. Lorsque vous vous approchez, vous entendez des bruits, des bruits produits par un animal.",
  choix: [
    { texte: "Si vous maîtrisez la Discipline Kaï de la Communication Animale", vers: "329", requis: {"discipline":"communication-animale"} },
    { texte: "Si vous préférez dégainer votre arme et partir à l'attaque", vers: "138" },
    { texte: "Enfin, si vous jugez plus sage de vous approcher sans bruit pour essayer de voir de quoi il retourne", vers: "107" }
  ]
  },
  {
  id: "83",
  texte: "Les Barbares des Glaces mutants semblent contrôlés par une hideuse créature qui se cache dans l'ombre d'une porte, un peu plus loin. Ce monstre est doté d'une grosse tête humaine qui repose sur deux pieds. Il n'a ni torse ni membres, mais il est doté en revanche d'une longue queue de reptile qui lui permet de conserver son équilibre. Les Barbares des Glaces mutants vous attaquent simultanément et vous devrez les combattre comme s'il s'agissait d'une seule et même créature. Ils sont insensibles à la Puissance Psychique, mais l'être étrange auquel ils obéissent est doué, quant à lui, d'une redoutable Force Mentale qui vous fait perdre 2 points d'ENDURANCE, à moins que vous ne maîtrisiez la Discipline Kaï du Bouclier Psychique.",
  suite: "313",
  combat: { nom: "Barbares Des Glaces Mutants", habilete: 18, endurance: 24 }
  },
  {
  id: "84",
  texte: "Vous remarquez que le Languabarb porte au cou un Triangle de Pierre Bleue accroché à une chaînette et vous comprenez tout à coup à quoi sert cette amulette. Vous vous en emparez, vous vous précipitez vers la porte de la forteresse et vous appliquez l'objet sur le triangle gravé dans le mur. L'amulette s'y encastre exactement. Le rebord sur lequel vous vous tenez se met alors à vibrer et vous entendez le grincement de pierres qui frottent l'une contre l'autre. La porte s'ouvre, mais à peine s'est-elle entrebâillée d'un mètre qu'un craquement retentit : elle commence alors à se refermer.",
  choix: [
    { texte: "Sans hésiter une seconde, vous plongez à l'intérieur de la forteresse ; un instant plus tard, la lourde porte claque derrière vous", vers: "221" }
  ]
  },
  {
  id: "85",
  texte: "Pendant trois jours et trois nuits, vous avancez à grand-peine sur le glacier au tracé sinueux. Les chutes, les bleus, les tibias écorchés, les crevasses, les blocs de glace coupants comme des rasoirs et le vent mordant qui souffle sans cesse se conjuguent pour épuiser vos forces. Vous avez cependant la chance d'échapper à un blizzard et vous parvenez enfin, après une marche harassante, à atteindre l'abri du mont des Brumes au pied duquel vous décidez d'établir votre campement. Cette immense montagne de près de 4 000 mètres d'altitude a la forme d'un gigantesque aileron de requin. Lorsque les vents d'ouest soufflent à son sommet, ils entraînent de longs panaches de brume à travers le glacier de Viad ; c'est cet étrange phénomène qui a donné son nom à la montagne. Vous trouvez bientôt l'endroit idéal pour dresser votre tente, sur un sol couvert de rocaille. En quelques instants, tout est installé et vous voilà à nouveau dans votre abri de toile. Avant de vous endormir, vous sortez quelques minutes pour satisfaire une exigence de la nature ; c'est alors que, par un pur hasard, vous apercevez une faible lueur qui filtre à travers une fissure de la paroi rocheuse, audessus de vous.",
  choix: [
    { texte: "Si vous souhaitez aller voir de plus près cette lueur insolite", vers: "49" },
    { texte: "Si vous préférez ne pas y prêter attention et retourner sous votre tente", vers: "212" },
    { texte: "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens", vers: "98", requis: {"discipline":"sixieme-sens"} }
  ]
  },
  {
  id: "86",
  texte: "Vous introduisez l'extrémité de votre lame dans le trou de la serrure en essayant d'actionner le mécanisme d'ouverture. La gorge de la serrure est cependant très profonde et il vous est difficile de parvenir à vos fins. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous possédez la Discipline Kaï de la Maîtrise des Armes et qu'elle s'applique précisément à l'arme que vous êtes en train d'utiliser, vous aurez le droit d'ajouter 3 au chiffre obtenu.",
  evenement: {
        type: "jet-hasard-table",
        titre: "Crocheter la serrure",
        texte: "Si Maîtrise des Armes avec l'arme utilisée, +3",
        branches: {
        "0-7": { vers: "47" },
        "8-12": { vers: "194" }
      }
      }
  },
  {
  id: "87",
  texte: "Vous vous précipitez vers l'endroit où se trouvait la créature lorsque vous l'avez aperçue, mais vous ne découvrez rien, sinon que le couloir tourne brusquement vers l'ouest. Quelques mètres plus loin, un escalier mène à une arcade plongée dans l'ombre, à une dizaine de mètres au-dessus du sol. Au-delà de l'escalier, le couloir se prolonge jusqu'à une autre porte de pierre à côté de laquelle un levier est fixé dans le mur. Ce levier a été relevé et la porte est fermée. Il n'y a plus trace de l'étrange créature.",
  choix: [
    { texte: "Si vous souhaitez monter l'escalier", vers: "323" },
    { texte: "Si vous préférez ouvrir la porte pour examiner la pièce qui se trouve derrière", vers: "246" }
  ]
  },
  {
  id: "88",
  texte: "Tandis que le serpent à deux têtes rampe vers vous le long de la corniche, vous le voyez ouvrir les mâchoires de sa seconde tête, laissant apparaître deux crochets jaunes au bout desquels perle une goutte de venin. Vous ôtez aussitôt votre épaisse tunique que vous enroulez autour de votre bras. Vous pourrez ainsi vous protéger contre l'une des têtes pendant que vous combattrez l'autre. Il est à noter que cette créature est insensible à la Discipline Kaï de la Puissance Psychique. Si vous perdez des points d'ENDURANCE au cours de ce combat, ne les soustrayez pas de votre total. Utilisez d'abord la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre de 0 à 8, le Javek aura enfoncé ses crochets dans la tunique qui protège votre bras et vous n'aurez alors perdu aucun point d'ENDURANCE. Si en revanche, vous tirez le 9, les crochets vous auront atteint. Or, le venin du Javek est le poison le plus puissant qui existe dans toutes les terres de Magnamund. Votre cœur s'arrêtera donc de battre quelques secondes plus tard et votre cadavre tombera dans le précipice. Dans cette hypothèse, il va sans dire que votre mission serait brutalement interrompue.",
  suite: "269",
  combat: { nom: "Javek", habilete: 15, endurance: 15, immunisePsychique: true }
  },
  {
  id: "89",
  texte: "Le Barbare des Glaces se met à hurler dans votre dos, en prononçant des paroles incompréhensibles. Vous avez été découvert. Maudissant votre malchance, vous dégainez aussitôt votre arme. En vous retournant, vous voyez le Barbare tirer sur un levier fixé au mur du fond. Trois Loups Maudits apparaissent alors dans l'encadrement d'une porte secrète qui vient de s'ouvrir. Les trois créatures se précipitent sur vous et vous allez devoir les combattre jusqu'à la mort, chacune à son tour.",
  suite: "89-b",
  choix: [
    { texte: "HABILETÉ ENDURANCE Premier LOUP MAUDIT 15 24 Deuxième LOUP MAUDIT 14 23 Troisième LOUP MAUDIT 14 20 Si vous sortez vainqueur de ce combat", vers: "161" }
  ],
  combat: { nom: "Loup Maudit", habilete: 15, endurance: 24 }
  }
];
