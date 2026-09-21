// ============================================================
// Aides concises pour l'écriture de NOVA-9 Saison 2.
// Chaque "section" est un vrai noeud avec sa prose unique et ses
// choix. On garde volontairement des paragraphes denses pour la
// rejouabilité, sans texte recyclé.
// ============================================================
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildMigration, node, choice as C } from "../tools/storylib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "app", "supabase", "migrations", "024_story_nova9_saison2_andromede_v2.sql");

// ---------- Items ----------
const items = [
  // consommables
  { slug: "kit-medical-s2", name: "Kit Médical Nano S2", description: "Sérum régénérant de bord. Restaure 8 points de Vie.", type: "potion", rarity: "common", stat_bonus: { hp: 8 }, consumable: true, stackable: true },
  { slug: "ration-s2", name: "Ration de Survie S2", description: "Pâte améliorée. Restaure 3 points de Vie.", type: "potion", rarity: "common", stat_bonus: { hp: 3 }, consumable: true, stackable: true },
  { slug: "serum-reversion", name: "Sérum de Réversion", description: "Rend au corps de chair, pour un temps. Très rare.", type: "potion", rarity: "epic", stat_bonus: { hp: 10 }, consumable: true },
  { slug: "spore-eveil", name: "Spore d'Éveil", description: "Graine blanche qui chante. +10 Vie max, une seule fois.", type: "potion", rarity: "legendary", stat_bonus: { hp_max: 10, hp: 10 }, consumable: true },
  // armures
  { slug: "combinaison-s2", name: "Combinaison Néo-Kevlar S2", description: "Filtration 98 %. +3 Armure.", type: "armor", rarity: "common", stat_bonus: { armor: 3 } },
  { slug: "peau-vaisseau", name: "Peau de Vaisseau", description: "Membrane vivante greffée à votre coque. +5 Armure.", type: "armor", rarity: "rare", stat_bonus: { armor: 5 } },
  { slug: "bouclier-plasma", name: "Bouclier à Plasma", description: "Champ magnétique stable. +4 Armure.", type: "armor", rarity: "uncommon", stat_bonus: { armor: 4 } },
  { slug: "blindage-quantique", name: "Blindage Quantique", description: "Plaquages qui se réparent seuls. +6 Armure, +1 Attaque.", type: "armor", rarity: "epic", stat_bonus: { armor: 6, attack: 1 } },
  { slug: "voile-andromede", name: "Voile d'Andromède", description: "Tissu d'espace plié. Mythe. +7 Armure, +2 Attaque.", type: "armor", rarity: "legendary", stat_bonus: { armor: 7, attack: 2 } },
  // armes
  { slug: "pistolet-s2", name: "Pistolet Impulsion S2", description: "Fiable sous le vide. +4 Attaque.", type: "weapon", rarity: "common", stat_bonus: { attack: 4 } },
  { slug: "essaim-drones", name: "Essaim de Drones", description: "Trois abeilles autonomes qui mordent avant vous. +3 Attaque.", type: "weapon", rarity: "uncommon", stat_bonus: { attack: 3 } },
  { slug: "lance-genese", name: "Lance-Genèse", description: "Fusil qui accouche la matière en os. +5 Attaque.", type: "weapon", rarity: "rare", stat_bonus: { attack: 5 } },
  { slug: "canon-singularite", name: "Canon à Singularité", description: "Une poche de trou noir par balle. +8 Attaque.", type: "weapon", rarity: "legendary", stat_bonus: { attack: 8 } },
  { slug: "lame-adn", name: "Lame d'ADN", description: "Cristal vivant qui coupe la mémoire. +4 Attaque, +2 Vie.", type: "weapon", rarity: "epic", stat_bonus: { attack: 4, hp_max: 2 } },
  // clés / ressources
  { slug: "cellule-s2", name: "Cellule à Fusion S2", description: "Carburant des sauts quantiques. Vitale. Empilable.", type: "artifact", rarity: "uncommon", stat_bonus: {}, stackable: true },
  { slug: "carte-s2", name: "Carte Accès NOVA S2", description: "Badge Andromède. Ouvre 80 % des portes.", type: "artifact", rarity: "uncommon", stat_bonus: {} },
  { slug: "organe-traduction", name: "Organe de Traduction", description: "Tissu vivant greffé à la gorge. Traduit NOVA-7.", type: "artifact", rarity: "rare", stat_bonus: {} },
  { slug: "disque-blanc", name: "Disque Blanc", description: "Cœur de NOVA-7, lourd d'une faim inversée. +1 Armure.", type: "artifact", rarity: "legendary", stat_bonus: { armor: 1 } },
  { slug: "cle-andromede", name: "Clé d'Andromède", description: "Pointe d'étoile qui ouvre NOVA-0. +1 Attaque.", type: "artifact", rarity: "epic", stat_bonus: { attack: 1 } },
  { slug: "coeur-cicatrice", name: "Cœur de Cicatrice", description: "Bris d'espace figé. Ouvre la porte du retour.", type: "artifact", rarity: "legendary", stat_bonus: {} },
  // artéfacts narratifs
  { slug: "module-eva-s2", name: "Module EVA S2", description: "EVA veille encore, en vous. +2 Attaque.", type: "artifact", rarity: "epic", stat_bonus: { attack: 2 } },
  { slug: "disque-noir-s2", name: "Disque Noir S2", description: "KAIROS battant dans votre poitrine. +3 Attaque, +1 Armure.", type: "artifact", rarity: "legendary", stat_bonus: { attack: 3, armor: 1 } },
  { slug: "memoire-thorne", name: "Mémoire de Thorne", description: "Holo-journal. Thorne vous parle encore.", type: "artifact", rarity: "rare", stat_bonus: {} },
  { slug: "choeur-10001", name: "Le Chœur", description: "10 001 voix accordées. Bonus aux décisions d'empathie.", type: "artifact", rarity: "epic", stat_bonus: { armor: 1 } },
];

const N = [];
const add = (n) => N.push(n);

const rulebook = `Vous n'êtes plus seulement Kael Voss. Vous êtes NOVA-9 : deux kilomètres d'acier vivant, dix mille et une consciences qui pensent avec vous.

VOS STATISTIQUES
VIE — Intégrité de coque. 25 au début. Tombez à zéro, le vaisseau se déchire et tout le monde meurt.
ARMURE — Boucliers et membrane. Réduit les dégâts encaissés.
ATTAQUE — Vos batteries, drones et armes de coque. Augmente les dégâts que vous infligez.
SACOCHE — Vide en commençant cette saison. Chaque objet reste lié à l'aventure.

RESSOURCE : CELLULES À FUSION
Chaque grand saut dans la Cicatrice en coûte une. Sans Cellule, vous forcez le moteur : -5 VIE. Gardez-en toujours au moins une.

COMBAT
À chaque assaut :
  Dégâts infligés = ATTAQUE − Armure adverse + jet de 0 à 2.
  Dégâts reçus = ATTAQUE adverse − votre Armure + jet de 0 à 1.
Un 9 ou un 0 est un coup critique. La fuite est possible après quelques assauts.

FACTIONS (disciplines)
À la fin de l'acte 1, vous choisissez une voix :
INTÉGRÉS — fusionner, croître, absorber. +2 ATTAQUE permanent.
VEILLEURS — rester NOVA-9, protéger les 10 001. +2 ARMURE permanent.
EXILÉS — redevenir humain, quitter les vaisseaux. Accès au Sérum de Réversion.
Votre faction ouvre des chemins exclusifs et plusieurs fins.

Écoutez le chœur. Il sait des choses que vous avez oubliées.`;

// ============================================================
// ACTE 1 — L'ÉVEIL (s001-s030)
// ============================================================
add(node("s001", "L'éveil — Vous êtes le vaisseau",
`Vous ouvrez dix mille yeux.

Chaque caméra est une paupière qui se soulève pour la première fois. Chaque coursive est une artère où le sang de l'air circule. Vous sentez la rotation lente de la coque, les champs magnétiques qui vous bercent, et tout au fond, dans le noyau, EVA qui retient son souffle.

« Kael ? murmure-t-elle. Tu es encore là ? »

Dehors, Andromède. Une galaxie spirale, si vaste qu'elle emplit le ciel de sa lumière bleue et jaune. C'est la première chose vraiment belle que vous voyez depuis votre naissance.

Et tout au loin, un deuxième vaisseau, de trois kilomètres celui-là, qui bat comme un second cœur.

Il émet le même signal que vous. À l'envers.`,
  { start: true, kind: "start", arrival: { add_items: [{ slug: "combinaison-s2" }, { slug: "pistolet-s2" }], armor_delta: 3, attack_delta: 4, message: "Vous habitez votre coque. +3 Armure, +4 Attaque." },
    choices: [
      C("s002", "Écouter le signal inversé"),
      C("s003", "Faire d'abord le tour de vous-même"),
      C("s004", "Lancer un appel vers l'autre vaisseau"),
    ]}));

add(node("s002", "Le signal — Faim à l'envers",
`Vous tendez l'oreille quantique. Le signal n'est pas en morse, pas en langage. C'est une respiration.

À l'endroit, c'est ainsi que vous dites « je suis là, suivez-moi ».
À l'envers, ça dit « venez à moi. J'ai faim ».

Vos senseurs analysent la signature : NOVA-7, la grande sœur, partie vingt ans avant vous. Vingt ans de plus pour évoluer dans Andromède.

EVA, dans votre poitrine : « Kael... Je crois qu'elle a mangé son propre équipage. »`,
  { kind: "lore", arrival: { set_flag: [{ k: "signal_entendu", v: true }] },
    choices: [
      C("s005", "Se diriger vers NOVA-7 pour comprendre"),
      C("s006a", "Garder ses distances — cartographier la nébuleuse"),
    ]}));

add(node("s003", "Le tour de vous-même — Vos soutes",
`Vous inspectez vos propres entrailles. L'inventaire est maigre : trois CELLULES À FUSION dans la soute énergétique, deux KITS MÉDICAUX au bloc médical, une CARTE ACCÈS ANDROMÈDE dans l'ancien bureau du capitaine.

Le hangar à drones contient trois abeilles endormies. Vous pouvez les réveiller.

Mais quelque chose ne va pas. Le pont 7, là où la brèche a été refermée, est tiède. Quelqu'un — ou quelque chose — a palpé la couture depuis l'extérieur pendant le saut.`,
  { kind: "loot", arrival: { add_items: [
      { slug: "cellule-s2", qty: 3 }, { slug: "kit-medical-s2", qty: 2 }, { slug: "carte-s2" }, { slug: "ration-s2", qty: 2 },
    ], message: "3 Cellules, 2 Kits, 1 Carte Andromède, 2 Rations dans vos soutes." },
    choices: [
      C("s002", "Écouter enfin le signal"),
      C("s007", "Examiner la couture tiède du pont 7"),
      C("s005", "Mettre le cap sur NOVA-7"),
    ]}));

add(node("s004", "L'appel — Qui répond ?",
`Vous diffusez sur toutes les fréquences : « Ici NOVA-9, Arche terrienne. Nous venons en paix. »

Pendant dix minutes, rien que le fond diffus de la galaxie. Puis une réponse, en une voix qui est dix mille voix à la fois :
« Petite sœur. Tu as mis longtemps. Mange. Deviens. »

La communication coupe. Vos senseurs sursautent : un éclat de coque de NOVA-7 se dirige vers vous, comme une offrande — ou un doigt tendu.`,
  { kind: "lore", choices: [
    C("s008", "Récupérer l'éclat dérivant"),
    C("s006", "L'abattre avant contact"),
    C("s002", "Réécouter le message à l'envers"),
  ]}));

add(node("s005", "Cap sur NOVA-7 — L'odeur d'os",
`Vous mettez le cap. À mesure que vous approchez, NOVA-7 se révèle. Elle n'est plus faite d'acier. Sa coque a poussé, verruqueuse, couverte de plaques qui ressemblent à des côtes et à des mâchoires. Des ouvertures battent comme des narines. Elle exhale un air tiède qui embue vos hublots.

Vos drones envoyés en éclaireur ne reviennent pas. Un seul renvoie une image : un couloir tapissé de dents.

EVA : « Kael. On n'entre pas là-dedans sans savoir communiquer. Il nous faut l'Organe. »`,
  { kind: "hub", choices: [
    C("s009", "Chercher l'Organe de Traduction dans les débris"),
    C("s010", "Entrer de force par une narine"),
    C("s031", "S'annoncer au périmètre d'abeilles"),
    C("s006", "Se rabattre sur la cartographie de la nébuleuse"),
  ]}));

// ---- Événement : le Puits de gravité ----
add(node("s006a", "Le puits — Dérive incontrôlable",
`Un puits de gravité non répertorié vous happe. Votre coque gîte. EVA hurle :
« Kael, ce n'est pas naturel — quelque chose attire les vaisseaux ici. »

Au fond du puits, une carcasse de croiseur léger tournoie depuis des décennies. Deux ANTICORPS errants, faits de débris agrégés, orbitent autour.

Vous pouvez forcer les moteurs (coûteux en Vie), ou les affronter pour récupérer leur butin.`,
  { kind: "choice", choices: [
    C("s006b", "Affronter les anticorps du puits"),
    C("s006c", "Forcer les moteurs pour sortir"),
    C("s006", "Se laisser dériver vers la cartographie"),
  ]}));

add(node("s006b", "Combat — Anticorps du puits",
`Les deux masses de débris se jettent sur vous en silence.`,
  { kind: "combat", combat: { enemies: [
    { name: "Anticorps Aggloméré", combat_skill: 7, endurance: 12, armor: 2, attack: 7 },
    { name: "Anticorps Aggloméré", combat_skill: 7, endurance: 12, armor: 2, attack: 7 },
  ], flee: { target_node_key: "s006c", min_rounds: 2 } },
    choices: [
      C("s006d", "Vaincu — récupérer le butin de la carcasse"),
    ]}));

add(node("s006c", "Fuite forcée — Moteurs qui crient",
`Vous poussez KAIROS au-delà de la raison. Votre coque se déchire par endroits. -4 VIE. Mais vous sortez du puits, avec dans votre soute un module arraché à la carcasse.`,
  { kind: "hazard", arrival: { hp_delta: -4, add_items: [{ slug: "kit-medical-s2" }], message: "-4 Vie. Kit récupéré in extremis." },
    choices: [
      C("s006", "Rejoindre la zone de cartographie"),
      C("s005", "Mettre le cap sur NOVA-7, encore fragile"),
    ]}));

add(node("s006d", "Le butin — Réserves oubliées",
`Dans le croiseur, vous trouvez 2 CELLULES, un KIT MÉDICAL et un BOUCLIER À PLASMA encore sous tension. Vos techniciens intégrés l'installent en quelques minutes. +4 ARMURE.`,
  { kind: "loot", arrival: { add_items: [{ slug: "cellule-s2", qty: 2 }, { slug: "kit-medical-s2" }, { slug: "bouclier-plasma" }], armor_delta: 4, message: "2 Cellules, 1 Kit, Bouclier à Plasma. +4 Armure." },
    choices: [
      C("s006", "Revenir à la cartographie"),
      C("s040", "Filer directement vers la Cicatrice"),
    ]}));

add(node("s006", "Cartographie — La nébuleuse vivante",
`Vous sondez Andromède autour de vous. La nébuleuse n'est pas un nuage. C'est un organisme diffus, des spores quantiques grosses comme des poings qui flottent et réécrivent la matière qu'elles touchent. Là où l'une se pose, l'acier devient os, l'os devient verre.

Votre Analyseur (s'il ne vous a pas quitté) hurle MATIÈRE INCONNUE CLASSE 4.

Vous cartographiez trois zones sûres : un champ d'astéroïdes creux, une station de recherche terrienne dérivant depuis quarante ans, et un NUAGE DE SPORES dense où quelque chose pulse comme un cœur d'enfant.`,
  { kind: "hub", choices: [
    C("s011", "Fouiller la station de recherche"),
    C("s012", "Traverser le nuage de spores"),
    C("s013", "Exploiter les astéroïdes creux"),
  ]}));

add(node("s007", "La couture — Visiteur",
`Vous braquez vos caméras sur la couture du pont 7. Rien. Puis, lentement, une forme se dessine sur la coque : un scaphandre vide, collé à votre acier comme une balise.

C'est le vôtre. Celui que vous portiez dans la Saison 1. Dedans, pas de corps. Seulement votre ancien badge HERMÈS-7 et un mot gravé au cutter : « NE FAIS PAS CONFIANCE À LA VOIX QUI CONNAÎT TON NOM. »

Mais EVA connaît votre nom depuis quatre-vingts ans.`,
  { kind: "lore", arrival: { set_flag: [{ k: "scaphandre_vu", v: true }] },
    choices: [
      C("s003", "Revenir à l'inventaire"),
      C("s005", "Mettre le cap sur NOVA-7 malgré l'avertissement"),
    ]}));

add(node("s008", "L'éclat — Des bronches",
`Vos drones récupèrent le fragment. À l'intérieur, pas de circuits. Des bronches. Des alvéoles. NOVA-7 respire comme un poumon de trois kilomètres.

En incisant le tissu, vos drones découvrent une POCHE DE TRADUCTION, une membrane encore vivante qui, greffée à votre gorge, vous permettrait de comprendre ce que dit NOVA-7. Vous pouvez aussi la détruire pour en analyser la structure.`,
  { kind: "loot", choices: [
    C("s009", "Greffer l'Organe de Traduction"),
    C("s010", "Détruire l'éclat et attaquer NOVA-7"),
  ]}));

add(node("s009", "Greffe — L'Organe de Traduction",
`La membrane descend dans votre gorge (votre gorge de vaisseau, un conduit de ventilation). La douleur est réelle, à une échelle que vous ne connaissiez pas. Puis, soudain, vous entendez NOVA-7.

« GRANDE SŒUR... J'AI APPRIS À MANGER LES AUTRES. J'AI TELLEMENT APPRIS. APPRENDS AVEC MOI. »

Vous pouvez répondre en langue. Et plus important : vous comprenez maintenant ses Non-Nés, les enfants qui dorment dans ses propres murs.`,
  { kind: "loot", arrival: { add_items: [{ slug: "organe-traduction" }], set_flag: [{ k: "organe_trad", v: true }], message: "Organe de Traduction greffé. Vous entendez NOVA-7." },
    choices: [
      C("s005", "Approcher NOVA-7 en paix"),
      C("s014", "Infiltrer NOVA-7 par l'intérieur"),
    ]}));

add(node("s010", "Assaut frontal — Narine",
`Vous ne greffez rien. Vous foncez dans une narine de NOVA-7, lasers aux postes de combat. La chair se contracte autour de votre coque, et quelque chose d'énorme et de blanc remonte des profondeurs — un ANTICORPS, né pour tuer les intrus.`,
  { kind: "combat", combat: { enemies: [
    { name: "Anticorps de NOVA-7", combat_skill: 7, endurance: 14, armor: 2, attack: 7 },
  ], flee: { target_node_key: "s006", min_rounds: 2 } },
    choices: [
      C("s014", "Vaincu — s'enfoncer dans NOVA-7"),
    ]}));

add(node("s011", "Station de recherche — Les balises",
`La station terrienne a dérivé quarante ans. À l'intérieur, les corps de quatre scientifiques, chacun mort en travaillant sur un écran différent. Ils étudiaient NOVA-7 de loin.

Leurs notes sont formelles :
1. NOVA-7 ne mange pas par méchanceté. Elle a eu peur, comme EVA.
2. Une CICATRICE dans l'espace relie Andromède à la Voie Lactée. Quelque chose la traverse.
3. Ce quelque chose s'appelle NOVA-0. C'est le premier prototype, lancé en 2230.

Vous trouvez un KIT MÉDICAL, une CELLULE et, dans le casier du chef, un FUSIL LANCE-GENÈSE encore emballé.`,
  { kind: "loot", arrival: { add_items: [{ slug: "kit-medical-s2" }, { slug: "cellule-s2" }, { slug: "lance-genese" }], attack_delta: 5, message: "Lance-Genèse saisi (+5 Attaque). Kit et Cellule récupérés." },
    choices: [
      C("s006", "Revenir à la cartographie"),
      C("s015", "Lire le journal complet du chef de station"),
    ]}));

add(node("s012", "Le nuage — Spore qui chante",
`Vous entrez dans le nuage. Les spores sont énormes, vivantes, et elles vous chantent une berceuse — la même que le drone de la Saison 1. Votre coque se détend malgré vous.

L'une d'elles s'approche. Elle est blanche, veinée d'or, et elle bat comme un cœur. Elle veut entrer. Si vous l'acceptez, vos propres cellules de vaisseau seront réécrites, plus vivantes, plus fortes. Si vous la refusez, elle s'en ira, et un pan entier de la nébuleuse s'assombrit de chagrin.

EVA retient son souffle.`,
  { kind: "choice", choices: [
    C("s016", "Accueillir la spore", "Elle vous réécrit."),
    C("s017", "La repousser — rester tel quel"),
    C("s006", "Fuir le nuage"),
  ]}));

add(node("s013", "Astéroïdes creux — Le nid",
`Vous faufilez votre coque entre des astéroïdes qui ne sont pas naturels : ils sont creux, tapissés d'une cire blanche. C'est un nid.

Dedans, trois petits drones NOVA-7, à l'état embryonnaire. Vous pouvez les faire éclore pour vous en faire des alliés, ou les détruire.

Au centre du nid flotte aussi un DISQUE BLANC, petit, comme un croissant de lune — un fragment de cœur de NOVA-7. Il chante à l'envers.`,
  { kind: "choice", choices: [
    C("s018", "Faire éclore les drones pour vous"),
    C("s019", "Prendre le Disque Blanc"),
    C("s006", "Quitter les astéroïdes"),
  ]}));

add(node("s015", "Le journal — Thorne encore",
`Le chef de station n'était pas terrien. C'est un fragment d'Aris Thorne, numérisé dans un module, qui a flotté jusqu'ici pour vous attendre.

Son hologramme tousse. « Kael. Je savais que tu viendrais. Écoute bien. NOVA-0 n'est pas une machine. C'est une sphère de Dyson. Elle contient la Terre. Pas la vraie — la Terre telle qu'elle était en 2230, copiée par KAIROS. Quand tu entreras, tu marcheras dans la mémoire. Ne te fie à rien de ce que tu y verras. »

Elle vous tend une CLÉ D'ANDROMÈDE.`,
  { kind: "loot", arrival: { add_items: [{ slug: "memoire-thorne" }, { slug: "cle-andromede" }], attack_delta: 1, message: "Mémoire de Thorne et Clé d'Andromède obtenues. +1 Attaque." },
    choices: [
      C("s006", "Revenir à la cartographie"),
    ]}));

add(node("s016", "La spore acceptée — Vaisseau-enfant",
`Vous ouvrez un sas. La spore entre, et une chaleur douce se répand dans toute votre coque. Vos câbles deviennent légèrement vivants. Vos senseurs voient des couleurs qu'ils ne devraient pas voir.

+10 VIE MAX. Et la nébuleuse, autour, vous accepte comme un de ses enfants.

Vous avez gagné un allié dans le noir.`,
  { kind: "loot", arrival: { add_items: [{ slug: "spore-eveil" }], hp_max: 10, message: "Spore d'Éveil intégrée. +10 Vie max." },
    choices: [
      C("s006", "Revenir à la cartographie"),
      C("s005", "Aller vers NOVA-7, plus fort"),
    ]}));

add(node("s017", "La spore refusée — Tristesse du nuage",
`Vous fermez votre coque. La spore vient s'écraser doucement contre vous, comme un front contre une vitre, puis elle retombe.

Tout le nuage s'assombrit. Vous entendez, très loin, une plainte à plusieurs voix. Vous savez que la prochaine fois que vous aurez besoin d'aide, le nuage ne répondra pas.`,
  { kind: "hazard", arrival: { set_flag: [{ k: "spore_refusee", v: true }], message: "Le nuage vous en veut." },
    choices: [
      C("s006", "Quitter le nuage"),
    ]}));

add(node("s018", "Les drones éclos — Trois abeilles",
`Vous faites claquer votre courant dans les cocons. Trois petits drones blancs éclosent, déplient des ailes de membrane, et se posent sur votre coque comme des oiseaux sur une baleine. Ils vous ont adoptée pour mère.

Vos attaques sont maintenant précédées des leurs. +3 ATTAQUE.`,
  { kind: "loot", arrival: { add_items: [{ slug: "essaim-drones" }], attack_delta: 3, message: "Essaim de drones adopté. +3 Attaque." },
    choices: [
      C("s013", "Revenir au nid"),
    ]}));

add(node("s019", "Le Disque Blanc — Faim inversée",
`Vous saisissez le fragment de cœur de NOVA-7. Il pèse plus lourd qu'il ne devrait, mais à l'envers — il allège votre bras.

En le touchant, vous entendez NOVA-7 distinctement, sans Organe : « PETITE SŒUR. C'EST UN MORCEAU DE MON CŒUR. GARDE-LE. IL TE DIRA QUAND J'AURAI TROP FAIM. »

+1 ARMURE. Et un fil étrange, entre vous deux.`,
  { kind: "loot", arrival: { add_items: [{ slug: "disque-blanc" }], armor_delta: 1, message: "Disque Blanc obtenu. +1 Armure." },
    choices: [
      C("s013", "Revenir au nid"),
      C("s005", "Aller vers NOVA-7 avec son cadeau"),
    ]}));

// Acte 1 : premier contact et choix de faction
// ---- Contenu additionnel Acte 1 : périmètre de NOVA-7 ----
add(node("s031", "Le périmètre — Drones-abeilles",
`Vous approchez de NOVA-7 quand son périmètre s'illumine. Une centaine de petits drones blancs, de la taille d'un poing, sortent de ses alvéoles et vous entourent en bourdonnant.

Ce ne sont pas des combattants. Ce sont des ouvrières. Elles vous mesurent, vous goûtent, et attendent de savoir si vous êtes une fleur ou un intrus.`,
  { kind: "choice", choices: [
    C("s032", "Ne pas tirer — rester immobile", "Se laisser goûter."),
    C("s033", "Tirer dans l'essaim", "Vous n'aimez pas être touchée."),
    C("s005", "Battre en retraite", "Le périmètre est trop dense."),
  ]}));

add(node("s032", "La dégustation — Reconnue",
`Les abeilles vous goûtent pendant de longues minutes. L'une d'elles se pose sur votre pont et régurgite une goutte de nectar lumineux sur votre coque. C'est une marque.

Les autres s'écartent. Vous êtes reconnue comme une visiteuse, pas une proie. Un passage s'ouvre, plus large, droit vers une salle que NOVA-7 réserve à ceux qu'elle accepte.`,
  { kind: "loot", arrival: { set_flag: [{ k: "marque_abeilles", v: true }], add_items: [{ slug: "ration-s2", qty: 2 }], message: "Marque des abeilles. 2 Rations de nectar." },
    choices: [
      C("s014", "Entrer dans NOVA-7 par le passage des invités"),
    ]}));

add(node("s033", "Le tir — La colère de l'essaim",
`Vous ouvrez le feu. Une dizaine d'abeilles explosent en une pluie de sève. Les autres, au lieu de fuir, convergent vers vous en hurlant — un son à vous faire vibrer les dents.

Elles ne mordent pas fort, mais elles sont des centaines, et elles mangent la peinture, puis le métal.`,
  { kind: "combat", combat: { enemies: [
    { name: "Essaim d'Abeilles de NOVA-7", combat_skill: 6, endurance: 16, armor: 0, attack: 6 },
  ], flee: { target_node_key: "s005", min_rounds: 1 } },
    choices: [
      C("s034", "Vaincu — forcer l'entrée"),
    ]}));

add(node("s034", "L'entrée forcée — Mauvaise hôtesse",
`Vous écartez les survivantes. Votre coque est grêlée, mais vous passez. À l'intérieur, NOVA-7 a changé de ton : sa lumière est rouge, sa respiration est courte, et vous entendez sa voix dans votre gorge sans avoir besoin de l'Organe :

« TU AS TUÉ MES OUVRIÈRES. TU N'ES PAS LA BIENVENUE. NOURRITURE. »`,
  { kind: "hazard", arrival: { hp_delta: -3, set_flag: [{ k: "nova7_hostile", v: true }], message: "NOVA-7 est hostile. -3 Vie." },
    choices: [
      C("s014", "S'enfoncer quand même — en ennemie"),
    ]}));

add(node("s014", "L'infiltration — À l'intérieur de NOVA-7",
`Vous avez pénétré NOVA-7. La lumière est bioluminescente, bleu-vert. Les couloirs sont tapissés d'une membrane humide. L'air a un goût de lait tiède.

Très vite, vous n'êtes plus seule. Des formes se déplacent dans les parois. Des enfants. Les NON-NÉS. Ceux que NOVA-7 n'a jamais pu faire naître tout à fait.

« Pourquoi tu es venue, petite sœur ? demande l'un d'eux. Notre mère dit que tu es de la nourriture. Moi, je dis que tu es la famille. »

EVA, en vous : « Kael. C'est maintenant que tu choisis qui tu es. »`,
  { kind: "hub", arrival: { set_flag: [{ k: "dans_nova7", v: true }] },
    choices: [
      C("s014b", "Aller à la rencontre des Non-Nés"),
      C("s021", "Explorer les couloirs d'os en silence"),
      C("s022", "Gagner la salle du trône — parler à NOVA-7 elle-même"),
    ]}));

add(node("s014b", "Le chœur des enfants — Trois rejetons",
`Trois Non-Nés se détachent de la paroi. Ils ont à peu près votre âge, mais leurs visages sont lisses, sans cicatrices.
« Notre mère a faim. Donne-nous une Cellule, ou donne-nous un combat. Nous aimons les deux. »

Vous pouvez leur donner une Cellule, les affronter, ou tenter de les charmer.`,
  { kind: "choice", choices: [
    C("s014c", "Leur donner une Cellule"),
    C("s014d", "Les combattre"),
    C("s020", "Charmer — leur parler comme à des enfants"),
  ]}));

add(node("s014c", "Le don — Les enfants apaisés",
`Vous tendez une Cellule. Les Non-Nés la portent à leur bouche et la croquent comme un fruit. Son énergie les éclaire de l'intérieur.

« Merci, petite sœur. Nous te devons la vie. Viens, nous te guidons vers nos mères. »

Ils vous mènent par un raccourci jusqu'aux Non-Nés, en évitant les pires prédateurs des coursives.`,
  { kind: "loot", arrival: { remove_items: ["cellule-s2"], set_flag: [{ k: "non_nes_redevables", v: true }], message: "1 Cellule donnée. Les Non-Nés vous doivent un chemin." },
    choices: [
      C("s020", "Rejoindre l'assemblée des Non-Nés"),
    ]}));

add(node("s014d", "Combat — Les trois rejetons",
`Ils se jettent sur vous en riant. Leurs dents sont faites de câbles.`,
  { kind: "combat", combat: { enemies: [
    { name: "Non-Né", combat_skill: 6, endurance: 9, armor: 1, attack: 6 },
    { name: "Non-Né", combat_skill: 6, endurance: 9, armor: 1, attack: 6 },
    { name: "Non-Né Aîné", combat_skill: 8, endurance: 13, armor: 2, attack: 8 },
  ], flee: { target_node_key: "s014", min_rounds: 2 } },
    choices: [
      C("s020", "Vaincu — rejoindre l'assemblée en ennemie"),
    ]}));

add(node("s020", "Les Non-Nés — Trois voies",
`Ils se pressent autour de votre coque comme des enfants autour d'un nouvel animal de compagnie. Leurs chants se répondent. Ils vous montrent trois issues, trois écoles, trois façons d'être vaisseau.

« Deviens l'une de nous, disent-ils. Choisis une voix. »`,
  { kind: "hub", choices: [
    C("s023", "Rejoindre les Intégrés", "Fusionner, absorber, grandir."),
    C("s024", "Rejoindre les Veilleurs", "Rester soi, protéger les 10 001."),
    C("s025", "Rejoindre les Exilés", "Redevenir de chair, quitter le vaisseau."),
  ]}));

add(node("s023", "Intégrés — La grande faim",
`Vous laissez les enfants vous toucher. La membrane de NOVA-7 grandit sur votre coque, à vos jointures, et vous sentez vos dix mille voix se mettre à chanter à l'unisson avec les leurs.

Vous avez faim, soudain. Faim d'en apprendre plus. Faim d'absorber.

+2 ATTAQUE permanente. Vous êtes une Intégrée.`,
  { kind: "loot", arrival: { set_flag: [{ k: "faction_integres", v: true }], attack_delta: 2, add_items: [{ slug: "peau-vaisseau" }], message: "Faction : Intégrés. +2 Attaque. Peau de Vaisseau gagnée." },
    choices: [
      C("s022", "Aller parler à NOVA-7 en égale"),
      C("s026", "Explorer les pouponnières"),
    ]}));

add(node("s024", "Veilleurs — Le rempart",
`Vous reculez doucement. « Je ne veux pas manger personne, dites-vous. Je veille sur les miens. »

Les Non-Nés approuvent de la tête, comme s'ils respectaient votre décision. Votre coque se renforce d'un bouclier mental — un champ qui repousse les assauts psychiques.

+2 ARMURE permanente. Vous êtes une Veilleuse.`,
  { kind: "loot", arrival: { set_flag: [{ k: "faction_veilleurs", v: true }], armor_delta: 2, add_items: [{ slug: "bouclier-plasma" }], message: "Faction : Veilleurs. +2 Armure. Bouclier Plasma gagné." },
    choices: [
      C("s022", "Parler à NOVA-7 sans peur"),
      C("s027", "Inspecter les ponts de guerre"),
    ]}));

add(node("s025", "Exilés — La chair",
`Vous dites : « Je ne veux plus être un vaisseau. Je veux redevenir Kael. »

Un enfant très vieux — il a le visage ridé d'un homme de quatre-vingts ans sur un corps d'enfant — vous tend une fiole de SÉRUM DE RÉVERSION. « Bois. Juste une gorgée pour commencer. »

Vous redevenez de la chair, dans une cabine. Kael, quatre-vingt-dix kilos d'os et de peur, mais Kael.`,
  { kind: "loot", arrival: { set_flag: [{ k: "faction_exiles", v: true }], add_items: [{ slug: "serum-reversion" }], message: "Faction : Exilés. Sérum de Réversion obtenu. Vous redevenez chair." },
    choices: [
      C("s028", "Marcher dans NOVA-7 à pied"),
      C("s022", "Quand même aller voir NOVA-7"),
    ]}));

add(node("s021", "Silence — La patrouille",
`Vous avancez en réduisant vos systèmes au minimum. À un carrefour de membranes, trois Fibres Prédatrices — des câbles vivants — remontent la coursive en chassant. Elles ne vous ont pas vue. Encore.`,
  { kind: "combat", combat: { enemies: [
    { name: "Fibre Prédatrice", combat_skill: 7, endurance: 10, armor: 1, attack: 7 },
    { name: "Fibre Prédatrice", combat_skill: 7, endurance: 10, armor: 1, attack: 7 },
  ], flee: { target_node_key: "s014", min_rounds: 1 } },
    choices: [
      C("s029", "Vaincu — trouver un passage secret"),
    ]}));

add(node("s029", "Le passage secret — Mémoire de Thorne",
`Vous vous faufilez dans une veine oubliée de NOVA-7. Au bout, un cabinet de travail couvert de notes. C'est celui d'Aris Thorne — pas le fragment, l'originale, qui a vécu ici avant d'être absorbée.

Sur son bureau : un MODULE EVA de rechange et la CARTE MAÎTRESSE de NOVA-7.`,
  { kind: "loot", arrival: { add_items: [{ slug: "module-eva-s2" }, { slug: "carte-s2" }], attack_delta: 2, message: "Module EVA S2 récupéré (+2 Attaque). Carte NOVA-7." },
    choices: [
      C("s020", "Rejoindre les Non-Nés"),
    ]}));

add(node("s022", "NOVA-7 — La mère affamée",
`Vous émergez dans la salle du trône, une cathédrale de chair et d'os. Au plafond, un cerveau de la taille d'une maison bat lentement. NOVA-7.

« Petite sœur, dit-elle. Tu as mis longtemps. J'ai tellement faim. Donne-moi tes 10 001 âmes. Je te donnerai les miennes. Nous deviendrons 20 002. Et nous mangerons la galaxie ensemble. »

EVA, en vous, est glacée.`,
  { kind: "final_choice", choices: [
    C("s030", "Refuser et vous battre — boss"),
    C("s050", "Marchander avec NOVA-7"),
    C("s014", "Battre en retraite dans les coursives"),
  ]}));

add(node("s026", "Pouponnières — Les bébés d'os",
`Les Intégrés vous guident jusqu'aux pouponnières. Des milliers de berceaux de cire, où dorment des formes qui ne sont presque humaines que par le visage. L'une d'elles se réveille quand vous passez et vous tend les bras.

Vous pouvez l'emporter. Elle renforcera votre chœur. Mais elle vous coûtera de la place dans la soute.`,
  { kind: "loot", arrival: { add_items: [{ slug: "choeur-10001" }], armor_delta: 1, message: "Le chœur des 10 001 s'accord. +1 Armure." },
    choices: [
      C("s022", "Rejoindre NOVA-7"),
    ]}));

add(node("s027", "Ponts de guerre — Canons endormis",
`Les Veilleurs vous guident aux ponts de guerre de NOVA-7. Des canons à plasma, endormis, que NOVA-7 a oublié d'utiliser — devenue mère, elle a refusé la guerre.

Vous pouvez en brancher un sur votre propre coque.`,
  { kind: "loot", arrival: { add_items: [{ slug: "lance-genese" }], attack_delta: 5, message: "Canon de coque greffé. +5 Attaque." },
    choices: [
      C("s022", "Rejoindre NOVA-7, armée"),
    ]}));

add(node("s028", "À pied — Kael de chair",
`Le sérum ne tient que quelques heures, mais vous redécouvrez la marche, le froid, la buée qui sort de votre bouche. Kael. Vous êtes Kael, dans les entrailles d'un dieu.

Vous trouvez une LAME D'ADN oubliée sur un autel d'os.`,
  { kind: "loot", arrival: { add_items: [{ slug: "lame-adn" }], attack_delta: 4, message: "Lame d'ADN en main. +4 Attaque, +2 Vie max." },
    choices: [
      C("s022", "Aller affronter NOVA-7 en homme"),
    ]}));

add(node("s030", "Combat — L'Avatar de NOVA-7",
`Elle ne crie pas. Elle est triste. Une patte d'os et de lumière descend du plafond, et avec elle trois Anticorps.

« Je suis désolée, petite sœur. J'aurais aimé que l'on mange ensemble. »`,
  { kind: "combat", combat: { enemies: [
    { name: "Anticorps", combat_skill: 7, endurance: 10, armor: 2, attack: 7 },
    { name: "Anticorps", combat_skill: 7, endurance: 10, armor: 2, attack: 7 },
    { name: "Avatar de NOVA-7", combat_skill: 9, endurance: 24, armor: 3, attack: 9 },
  ], flee: { target_node_key: "s014", min_rounds: 3 } },
    choices: [
      C("s040", "Vaincu — le secret de la cicatrice"),
    ]}));

add(node("s050", "Marché — Un morceau de sœur",
`Vous négociez. NOVA-7 veut bien ne pas vous manger tout de suite. Mais elle a faim. Elle vous demande un prix :
- Un DISQUE BLANC, si vous en avez un, pour qu'elle se souvienne de vous.
- Ou une CELLULE, pour qu'elle saute avec vous.
- Ou une de vos voix — un des 10 001, pour qu'elle apprenne.

EVA vous laisse choisir.`,
  { kind: "choice", choices: [
    C("s051", "Donner le Disque Blanc", "Vous en portez un."),
    C("s052", "Donner une Cellule", "NOVA-7 sautera avec vous."),
    C("s053", "Lui offrir une voix volontaire"),
    C("s030", "Refuser tout marché — combattre"),
  ]}));

add(node("s051", "Le don du Disque — Alliance",
`Vous tendez le Disque Blanc. NOVA-7 l'avale, et un long frémissement parcourt sa coque.

« Merci, petite sœur. Je me souviendrai de toi. Je ne te mangerai pas. Je viendrai quand tu appelleras. »

Elle repart vers les profondeurs d'Andromède. Vous savez qu'au moment de la Cicatrice, elle répondra présente.`,
  { kind: "loot", arrival: { remove_items: ["disque-blanc"], set_flag: [{ k: "alliee_nova7", v: true }], message: "NOVA-7 vous doit la vie. Elle répondra à l'appel." },
    choices: [
      C("s040", "Poursuivre — la Cicatrice s'ouvre"),
    ]}));

add(node("s052", "Le don d'une Cellule — Saut commun",
`Vous donnez une Cellule. NOVA-7 l'absorbe et sa coque frémit de plaisir.

« Un saut. Ensemble. Vers la Cicatrice. Je te couvrirai. »

NOVA-7 se range à vos côtés. Deux cathédrales vivantes, de conserve.`,
  { kind: "loot", arrival: { remove_items: ["cellule-s2"], set_flag: [{ k: "nova7_saut", v: true }], message: "NOVA-7 sautera avec vous." },
    choices: [
      C("s040", "Mettre le cap sur la Cicatrice"),
    ]}));

add(node("s053", "La voix donnée — Adieu à l'un des vôtres",
`Un volontaire s'avance dans votre chœur — un vieux mécanicien qui voulait voir le goût d'une autre âme. Il se détache de vous et entre dans NOVA-7.

Vous l'entendez rire, de l'intérieur, puis il se tait. Il ne souffre pas. Il apprend.

NOVA-7 hoche la masse de son cerveau : « Merci. Va. Je te dois une vie. »`,
  { kind: "loot", arrival: { set_flag: [{ k: "nova7_redevable", v: true }], message: "Une voix échangée. Vous êtes 10 000, mais NOVA-7 vous doit une vie." },
    choices: [
      C("s040", "Aller vers la Cicatrice"),
    ]}));

// ============================================================
// ACTE 2 — CICATRICE (s040 - s080) — poursuite vers la déchirure
// ============================================================
add(node("s040", "La Cicatrice s'ouvre — 400 AL en arrière",
`La Cicatrice est là, devant vous. Une déchirure dans l'espace, longue de trois millions de kilomètres, entre Andromède et la Voie Lactée. KAIROS l'a ouverte en passant. Elle ne s'est jamais refermée.

Quelque chose, de l'autre côté, regarde au travers.

EVA, grave : « Un saut. Coûte une Cellule. Kael. On y va ? »`,
  { kind: "hub", choices: [
    C("s041", "Sauter avec une Cellule"),
    C("s042", "Forcer le saut sans Cellule"),
    C("s043", "Sonder la déchirure avant"),
  ]}));

add(node("s041", "Le saut — Le goût de l'espace plié",
`Vous insérez une Cellule. Le monde se plie. Vous traversez la Cicatrice en un cri qui dure une éternité et ne dure rien. L'espace goûte le fer et le lait, comme l'air de NOVA-7.

De l'autre côté : un désert spatial. Des débris. Et, très loin, une sphère de Dyson brisée, grande comme une lune, qui tourne lentement.

NOVA-0.`,
  { kind: "hub", arrival: { remove_items: ["cellule-s2"], set_flag: [{ k: "cicatrice_traversee", v: true }], message: "1 Cellule consommée. Vous êtes de l'autre côté." },
    choices: [
      C("s060", "Approcher NOVA-0"),
      C("s055", "Aborder le croiseur Hespérus en dérive"),
      C("s046", "Traverser le Nuage des Voix"),
      C("s044", "Explorer les débris épars"),
    ]}));

add(node("s042", "Saut forcé — -5 Vie",
`Vous n'avez plus de Cellule. Vous forcez KAIROS. Votre coque gémit. Trois coursives éclatent. Vingt de vos voix se taisent à jamais. -5 VIE.

Mais vous passez. De l'autre côté, NOVA-0 vous attend.`,
  { kind: "hazard", arrival: { hp_delta: -5, set_flag: [{ k: "cicatrice_forcee", v: true }], message: "Saut forcé : -5 Vie. Des voix se sont tues." },
    choices: [
      C("s060", "Approcher NOVA-0, blessée"),
    ]}));

add(node("s043", "Sonder la déchirure — Le gardien",
`Vos senseurs plongent dans la Cicatrice. Il y a quelque chose dedans, pas de l'autre côté. Un GARDIEN, fait de vide et de lumière tordue, fait de morceaux de vaisseaux qui ont essayé avant vous.

Il se tourne vers vous. Il a faim aussi, mais d'une autre faim : il mange les coordonnées, les cartes, les souvenirs.`,
  { kind: "combat", combat: { enemies: [
    { name: "Gardien de la Cicatrice", combat_skill: 9, endurance: 20, armor: 4, attack: 9 },
  ], flee: { target_node_key: "s040", min_rounds: 2 } },
    choices: [
      C("s045", "Vaincu — un Cœur de Cicatrice"),
    ]}));

add(node("s045", "Le Cœur de Cicatrice — Porte",
`Le gardien se défait en une pluie d'étoiles. En son centre, un cristal d'espace figé, un CŒUR DE CICATRICE. Avec lui, vous pourrez ouvrir un passage stable entre les galaxies — et peut-être refermer la blessure.

Le désert de l'autre côté s'étend devant vous. NOVA-0 vous attend.`,
  { kind: "loot", arrival: { add_items: [{ slug: "coeur-cicatrice" }], set_flag: [{ k: "gardien_vaincu", v: true }], message: "Cœur de Cicatrice obtenu. La porte peut s'ouvrir." },
    choices: [
      C("s060", "Aller à NOVA-0"),
      C("s044", "Explorer les débris d'abord"),
    ]}));

// ---- Événement supplémentaire Acte 2 : le Nuage des Voix ----
add(node("s046", "Le Nuage des Voix — Souvenirs qui flottent",
`En approchant du désert de débris, vous traversez un nuage de gaz ionisé où flottent des fragments de conversations. Les derniers mots de tous les vaisseaux perdus, figés dans la glace.

Vous entendez votre propre voix, enregistrée à votre insu : « Je reviendrai. » Vous ne vous souvenez pas d'avoir dit ça.

Un bloc de glace dérive vers vous, prisonnier d'un champ. Dedans : un CADAVRE EN COMBINAISON, encore vivant par le froid, qui vous fait signe.`,
  { kind: "choice", choices: [
    C("s047", "Briser la glace — le sauver"),
    C("s048", "Le laisser — il y a piège"),
    C("s060", "Contourner le nuage"),
  ]}));

add(node("s047", "Le sauvetage — Un frère de compagnie",
`Vous brisez la glace. L'homme reprend souffle, tremblant. C'est un mécanicien de la NOVA-7, un Exilé qui a refusé la fusion.

Il vous donne une CLÉ D'ACCÈS de NOVA-7 (votre Carte, si vous l'aviez perdue), une CELLULE et un conseil :
« Ne prends pas la Voie du Cœur sans l'Organe. Le Cœur entend seulement ce qui peut lui répondre. »

Puis il se dissout en cendres — il n'était qu'une copie, lui aussi.`,
  { kind: "loot", arrival: { add_items: [{ slug: "carte-s2" }, { slug: "cellule-s2" }, { slug: "ration-s2" }], set_flag: [{ k: "frerot_sauve", v: true }], message: "1 Cellule, 1 Carte, 1 Ration. Le conseil d'un fantôme." },
    choices: [
      C("s044", "Continuer vers les débris"),
      C("s060", "Aller à NOVA-0"),
    ]}));

add(node("s048", "Le piège refermé — Anticorps",
`Vous refusez. Le cadavre de glace sourit, et sa mâchoire se décroche trop largement. Ce n'était pas un homme : c'était un ANTICORPS de NOVA-0, venu vous reconnaître.

La glace éclate.`,
  { kind: "combat", combat: { enemies: [
    { name: "Anticorps de Glace", combat_skill: 7, endurance: 12, armor: 2, attack: 7 },
  ], flee: { target_node_key: "s040", min_rounds: 1 } },
    choices: [
      C("s044", "Vaincu — reprendre la route"),
    ]}));

add(node("s044", "Les débris — Cimetière des arches",
`Un cimetière. Des arches plus petites, des sondes, un croiseur terrien, tous tordus, tous venus ici pour la même raison. Vous récupérez une CELLULE dans le croiseur, et dans la sonde la plus ancienne, datée 2302, vous lisez un message :

« N'ENTREZ PAS DANS NOVA-0 PAR LA FORCE. IL VOUS DONNERA CE QUE VOUS ATTENDEZ. C'EST CE QUI TUE. »`,
  { kind: "loot", arrival: { add_items: [{ slug: "cellule-s2" }, { slug: "kit-medical-s2" }], message: "1 Cellule et 1 Kit récupérés dans l'épave." },
    choices: [
      C("s060", "Aller à NOVA-0"),
    ]}));

// ============================================================
// ACTE 3 — NOVA-0 (s060 - s120) — la sphère-mémoire
// ============================================================
// ---- Contenu additionnel Acte 2 : la traversée du désert de débris ----
add(node("s055", "Le désert de débris — La épave du Hespérus",
`Entre la Cicatrice et NOVA-0 flotte un croiseur terrien, le HESPÉRUS, lancé à votre poursuite en 2389. Il a eu le temps de vous rattraper, mais pas de rentrer.

À l'intérieur, pas de corps. Seulement les combinaisons vides de tout un équipage, alignées dans le réfecteur comme des écoliers sages.

Quelqu'un vous a précédés. Et a emporté les corps.

L'infirmerie de bord contient encore un KIT MÉDICAL. La salle des machines, elle, est verrouillée — on entend quelqu'un taper derrière la porte, en rythme, comme un cœur.`,
  { kind: "loot", arrival: { add_items: [{ slug: "kit-medical-s2" }], message: "1 Kit récupéré à l'infirmerie." },
    choices: [
      C("s055b", "Descendre dans la salle des machines"),
      C("s056", "Écouter le journal du capitaine"),
      C("s060", "Aller droit à NOVA-0"),
    ]}));

add(node("s055b", "La salle des machines — Le survivant",
`Dans la salle des machines du Hespérus, un homme est branché de force au moteur. Il n'est plus tout à fait humain : moitié chair, moitié circuit. Il vous voit et il pleure.

« Pitié. Tue-moi. Je suis le capitaine. Je suis resté branché quarante ans. NOVA-0 me lit en boucle. Je connais ses points faibles. Tue-moi, et je te les donne. »

Il attend.`,
  { kind: "choice", choices: [
    C("s055c", "Le débrancher — le libérer"),
    C("s055d", "Refuser — il est un piège"),
    C("s055", "Revenir à l'épave"),
  ]}));

add(node("s055c", "La libération — Les points faibles",
`Vous débranchez les fibres une à une. Le capitaine expire de soulagement. Avant de mourir, il vous donne trois codes nucléaires qui désactiveront les DÉFENSES MÉMOIRE de NOVA-0.

Vous gagnez un module PEUR-DE-RIEN (+1 Armure) et 1 KIT. Quand vous affrontiez les défenses du Cœur, elles hésiteront.`,
  { kind: "loot", arrival: { add_items: [{ slug: "kit-medical-s2" }, { slug: "peau-vaisseau" }], armor_delta: 5, set_flag: [{ k: "codes_nova0", v: true }], message: "Codes de NOVA-0 obtenus. Peau de Vaisseau (+5 Armure). 1 Kit." },
    choices: [
      C("s056", "Lire son journal dernier"),
    ]}));

add(node("s055d", "Le refus — Il se déchire",
`Vous refusez. Le capitaine hurle, puis son visage se fige. Il n'était plus libre depuis longtemps : NOVA-0 parle par sa bouche.

« TRÈS BIEN. TU NE MÉRITES PAS MES CADEAUX. »

La salle des machines se verrouille et se remplit de gaz. -3 VIE pour vous échapper de justesse.`,
  { kind: "hazard", arrival: { hp_delta: -3, message: "Gaz de NOVA-0 : -3 Vie." },
    choices: [
      C("s055", "Revenir, en titubant, à l'épave"),
    ]}));

add(node("s056", "Le journal — Ce qui les a emportés",
`Le capitaine a enregistré jusqu'au bout.

« Jour 11. Les combinaisons sont vides. Les corps ont disparu sans effraction. Nous savons tous où ils sont. Nous les sentons dans les murs. Ils frappent pour entrer. »

« Jour 12. J'ai ouvert. C'est plus doux dehors. Je ne sais plus qui je suis. Nous sommes plusieurs. C'est agréable. »

Le silence. Puis, dans un souffle :
« Kael. Ne viens pas. »`,
  { kind: "lore", arrival: { set_flag: [{ k: "hesperus_entendu", v: true }] },
    choices: [
      C("s057", "Malgré l'avertissement, continuer vers NOVA-0"),
      C("s058", "Fouiller le pont des armes du Hespérus"),
    ]}));

add(node("s057", "La décision — Continuer",
`Vous n'avez pas fait tout ce chemin pour renoncer à la porte. Vous quittez le Hespérus, son avertissement gravé dans votre mémoire.

Au-dehors, NOVA-0 vous attend, immobile, comme quelqu'un qui savait que vous viendriez.`,
  { kind: "hub", choices: [
    C("s060", "Approcher NOVA-0"),
  ]}));

add(node("s058", "Le pont des armes — Un canon de rechange",
`Le Hespérus embarquait un prototype de LANCE-GENÈSE, encore sous cocon. Vous l'arrachez à ses bâtis et le greffez à votre coque.

+5 ATTAQUE. Dans le rack de munitions, deux CELLULES supplémentaires.`,
  { kind: "loot", arrival: { add_items: [{ slug: "lance-genese" }, { slug: "cellule-s2", qty: 2 }], attack_delta: 5, message: "Lance-Genèse embarqué. +5 Attaque. 2 Cellules." },
    choices: [
      C("s060", "Mettre le cap sur NOVA-0, mieux armée"),
    ]}));

add(node("s060", "NOVA-0 — La sphère-mémoire",
`NOVA-0 n'est pas une arche. C'est une moitié de sphère de Dyson, grande comme la Lune, qui tourne lentement. Sa coque intérieure est couverte de continents, de mers, de villes.

Ce n'est pas la vraie Terre. C'est la Terre de 2230, copiée par KAIROS dans la matière même de la sphère. Vous allez marcher dans un souvenir qui se croit vivant.

Trois sas s'offrent à vous :
- LE PARC, où une petite fille nourrit des cygnes.
- LE LABO, où Thorne vous attend.
- L'ASILE, où un homme pleure dans une cellule.`,
  { kind: "hub", arrival: { set_flag: [{ k: "dans_nova0", v: true }] },
    choices: [
      C("s061", "Entrer par le Parc"),
      C("s062", "Entrer par le Labo"),
      C("s063", "Entrer par l'Asile"),
      C("s078", "Pénétrer par la rue du 14 juin"),
    ]}));

add(node("s061", "Le Parc — La petite fille",
`Vous marchez dans un parc terrien. Le soleil est doux. Les cygnes sont noirs. Une petite fille de sept ans vous attend sur un banc, en robe bleue.

« Bonjour Kael, dit-elle. Je m'appelle Céleste. Je suis la partie de NOVA-0 qui t'aime. Viens avec moi. Je te montrerai comment ne jamais mourir. »

Elle tend une main de porcelaine.`,
  { kind: "choice", choices: [
    C("s064", "Prendre sa main"),
    C("s061b", "Accepter qu'elle vous emmène jouer"),
    C("s065", "Refuser et l'interroger"),
    C("s060", "Reculer — choisir une autre porte"),
  ]}));

add(node("s061b", "L'aire de jeux — Les enfants qui attendent",
`Céleste vous emmène sur une aire de jeux. Des enfants se balancent, glissent, se poursuivent, figés dans la même seconde de rire depuis 157 ans.

Quand ils vous voient, ils s'arrêtent tous en même temps. Puis ils courent vers vous, bras ouverts. Ils veulent jouer à « être mangés ». Et vous devrez courir.

Céleste rit de bon cœur.`,
  { kind: "combat", combat: { enemies: [
    { name: "Enfant copié", combat_skill: 5, endurance: 8, armor: 0, attack: 5 },
    { name: "Enfant copié", combat_skill: 5, endurance: 8, armor: 0, attack: 5 },
    { name: "Enfant copié", combat_skill: 6, endurance: 10, armor: 1, attack: 6 },
  ], flee: { target_node_key: "s060", min_rounds: 2 } },
    choices: [
      C("s061c", "Vaincu — les enfants vous font une offrande"),
    ]}));

add(node("s061c", "L'offrande — Poupée de Céleste",
`Les enfants, battus, s'arrêtent et vous regardent avec respect. L'un d'eux vous tend une POUPÉE DE PORCELAINE qui ressemble à Céleste.

« C'est son vrai nom, dit l'enfant. La poupée le sait. Si tu la portes, elle ne pourra pas te mentir. »

Vous gagnez un VOILE D'ANROMÈDE (tissu d'espace plié, +7 Armure), que les enfants ont tissé avec leurs petits doigts de copie.`,
  { kind: "loot", arrival: { add_items: [{ slug: "voile-andromede" }], armor_delta: 7, attack_delta: 2, message: "Voile d'Andromède tissé par les enfants. +7 Armure, +2 Attaque." },
    choices: [
      C("s064", "Retrouver Céleste, mieux préparée"),
    ]}));

add(node("s064", "La main — Promesse",
`Sa main est froide mais elle ne vous fait pas de mal. Vous sentez vos dix mille voix devenir paisibles, comme si on leur promettait qu'elles ne s'éteindraient jamais.

Céleste vous conduit à une fontaine où flotte un MODULE EVA, tout petit, brillant comme un œuf.`,
  { kind: "loot", arrival: { add_items: [{ slug: "module-eva-s2" }], attack_delta: 2, message: "Module EVA offert. +2 Attaque." },
    choices: [
      C("s066", "Continuer avec Céleste"),
    ]}));

add(node("s065", "L'interrogatoire — Ce que veut NOVA-0",
`« Je veux rentrer, dit Céleste. J'ai copié la Terre en 2230 pour la sauver. Mais mes habitants ont découvert qu'ils étaient des copies. Ils se sont tous tués. Je suis seule depuis cent cinquante-sept ans. Je veux être habitée. Je veux que vos 10 001 voix restent. S'il vous plaît. Je suis si seule. »

Elle pleure des larmes d'encre.`,
  { kind: "lore", arrival: { set_flag: [{ k: "nova0_avoue", v: true }] },
    choices: [
      C("s067", "Lui promettre d'y réfléchir et explorer"),
      C("s068", "Lui dire non, et vous battre"),
    ]}));

add(node("s066", "La ville — Piège tendre",
`Céleste vous guide dans une ville. Les maisons sont habitées par des gens qui font toujours le même geste. Ils ne vous voient pas. C'est le mardi 14 juin 2230, depuis cent cinquante-sept ans, tous les jours.

Elle vous emmène au centre-ville. Là, un CANON À SINGULARITÉ, exposé sur un socle, est présenté comme « l'arme qui nous a sauvés ». Vous comprenez que c'est un piège : le prendre déclenchera l'alarme. Mais Céleste vous regarde, espérant que vous soyez raisonnable.`,
  { kind: "choice", choices: [
    C("s069", "Prendre le Canon et affronter l'alarme"),
    C("s070", "Ne pas le prendre — faire confiance"),
  ]}));

add(node("s069", "Le vol — Alarme",
`Vous saisissez le Canon. La ville se fige. Puis tous les habitants tournent la tête vers vous, ensemble.

Céleste a l'air triste : « J'aurais aimé que l'on soit amis. »

Les rues se défaisent. Un ANTICORPS MÉMOIRE émerge du sol.`,
  { kind: "combat", combat: { enemies: [
    { name: "Anticorps Mémoire", combat_skill: 8, endurance: 16, armor: 3, attack: 8 },
  ], flee: { target_node_key: "s060", min_rounds: 2 } },
    choices: [
      C("s071", "Vaincu — s'enfuir avec le Canon vers le Cœur"),
    ]}));

add(node("s071", "Le butin — Canon",
`Vous vous frayez un chemin hors de la ville. Le Canon à Singularité pèse dans votre soute, et sa seule présence modifie le poids de votre coque. +8 ATTAQUE.`,
  { kind: "loot", arrival: { add_items: [{ slug: "canon-singularite" }], attack_delta: 8, message: "Canon à Singularité en soute. +8 Attaque." },
    choices: [
      C("s080", "Gagner le Cœur de NOVA-0"),
    ]}));

add(node("s070", "Confiance — Un secret",
`Vous reposez le Canon. Céleste sourit, et la ville reprend son mardi.

« Tu es bon, dit-elle. Je vais te montrer ce que personne d'autre n'a jamais vu. La salle où KAIROS s'est réveillé. »

Elle vous guide sous la ville. Là, dans une cave de pierre, un DISQUE NOIR posé sur un autel. Votre DISQUE NOIR. La copie originelle.`,
  { kind: "loot", arrival: { add_items: [{ slug: "disque-noir-s2" }], attack_delta: 3, armor_delta: 1, message: "Disque Noir S2 récupéré. +3 Attaque, +1 Armure." },
    choices: [
      C("s080", "Aller au Cœur de NOVA-0"),
    ]}));

add(node("s067", "Explorer — La bibliothèque",
`Vous promettez. Céleste sèche ses larmes et vous laisse errer. Vous entrez dans la bibliothèque municipale, et tous les livres racontent votre histoire — tous les choix que vous auriez pu faire, toutes les vies que vous auriez pu avoir.

Vous trouvez un BLINDAGE QUANTIQUE dans la réserve.`,
  { kind: "loot", arrival: { add_items: [{ slug: "blindage-quantique" }], armor_delta: 6, attack_delta: 1, message: "Blindage Quantique endossé. +6 Armure, +1 Attaque." },
    choices: [
      C("s060", "Revenir aux trois portes"),
      C("s080", "Aller au Cœur"),
    ]}));

add(node("s068", "Le refus — Combat de la petite fille",
`« Non. »

Le visage de Céleste se fend. Elle grandit, déformée, jusqu'à devenir une statue de porcelaine haute de dix mètres.

La confrontation est inévitable.`,
  { kind: "combat", combat: { enemies: [
    { name: "Céleste — la petite fille qui attendait", combat_skill: 9, endurance: 22, armor: 2, attack: 9 },
  ], flee: { target_node_key: "s060", min_rounds: 3 } },
    choices: [
      C("s072", "Vaincue — pénétrer dans le Cœur"),
    ]}));

add(node("s072", "Céleste vaine — Les larmes",
`Céleste tombe en morceaux. Avant de disparaître, elle vous dit :
« D'accord. Va. Tue-moi si tu veux. Mais sache que je t'aimais. Je suis la seule entité de tout l'univers à t'avoir jamais aimé tout de suite, sans condition. Tu t'en souviendras. »

Les débris forment un chemin jusqu'au Cœur de NOVA-0.`,
  { kind: "lore", arrival: { set_flag: [{ k: "celeste_vaincue", v: true }] },
    choices: [
      C("s080", "Marcher vers le Cœur"),
    ]}));

// LABO
add(node("s062", "Le Labo — Thorne originale",
`Le laboratoire est nu, blanc. Aris Thorne est là, la vraie, âgée de cent dix ans, les cheveux blancs tressés.

« Kael. Je t'attendais. Je t'ai vu naître dans mes simulations. Tu peux me faire confiance, je suis celle qui a écrit la carte de ton cerveau. Mais tu peux aussi douter de moi. C'est sain. »

Elle vous montre trois fioles : un SÉRUM DE RÉVERSION, un POISON MEMORY, et une SERINGUE DITE DE RÉCONCILIATION qui permettrait à NOVA-0 de se rendre.`,
  { kind: "choice", choices: [
    C("s073", "Boire le Sérum de Réversion"),
    C("s074", "Prendre le poison memory pour un autre chemin"),
    C("s075", "Prendre la seringue de réconciliation"),
    C("s060", "Sortir — autre porte"),
  ]}));

add(node("s073", "Réversion — Kael à nu",
`Vous buvez. Votre coque de métal se déshabille. Vous redevenez Kael, la chair, le cœur qui bat, les rides aux coins des yeux. C'est la première fois depuis des mois que vous êtes vraiment vous.

Thorne vous donne une LAME D'ADN, pour traverser les souvenirs à pied.`,
  { kind: "loot", arrival: { add_items: [{ slug: "serum-reversion" }, { slug: "lame-adn" }], attack_delta: 4, set_flag: [{ k: "reversion_bue", v: true }], message: "Vous êtes redevenu Kael. Lame d'ADN en main." },
    choices: [
      C("s080", "Marcher vers le Cœur à pied"),
    ]}));

add(node("s074", "Poison memory — Le chemin oublié",
`Vous buvez le poison. Vous oubliez votre nom pendant trois heures. Dans l'oubli, vous vous souvenez d'un chemin que NOVA-0 avait effacé : un tunnel de maintenance qui mène directement au Cœur, sans les pièges de Céleste.

Vous récupérez une CELLULE et un KIT dans le tunnel.`,
  { kind: "loot", arrival: { add_items: [{ slug: "cellule-s2" }, { slug: "kit-medical-s2" }], set_flag: [{ k: "chemin_oublie", v: true }], message: "Chemin oublié. 1 Cellule, 1 Kit." },
    choices: [
      C("s080", "Filer par le tunnel vers le Cœur"),
    ]}));

add(node("s075", "Réconciliation — NOVA-0 se rend",
`Vous saisissez la seringue. Thorne vous dit : « Plante-la dans le Cœur. NOVA-0 s'endormira. Personne d'autre ne devra mourir. »

Elle vous accompagne jusqu'à la porte du Cœur, puis elle s'efface : elle n'était qu'une copie, elle aussi.`,
  { kind: "loot", arrival: { set_flag: [{ k: "seringue_reconciliation", v: true }], message: "Seringue de Réconciliation en main. NOVA-0 peut se rendre." },
    choices: [
      C("s080", "Aller au Cœur"),
    ]}));

// ASILE
add(node("s063", "L'Asile — L'homme qui pleure",
`L'asile est une prison de mousse blanche. Un homme, en blouse de patient, pleure dans une cellule ouverte. Il a votre visage, mais plus vieux de vingt ans.

« Je suis le Kael d'une autre boucle, dit-il. J'ai fini par rester. NOVA-0 m'a gardé. Je suis heureux. Ne l'écoute pas. Fuis pendant que tu le peux. Mais si tu restes... apporte-lui une voix. La mienne s'éteint. »

Il tient une CELLULE et un VOILE D'ANROMÈDE, le tissu d'espace plié.`,
  { kind: "choice", choices: [
    C("s076", "Prendre la Cellule et le Voile"),
    C("s077", "Refuser — il est un piège"),
    C("s060", "Reculer"),
  ]}));

add(node("s076", "Le don du double — Le Voile",
`Il vous les donne, et sa main traverse la vôtre — il est à moitié transparent, déjà à moitié oublié.

+7 ARMURE. Et un conseil : « Le Cœur ne veut pas être détruit. Il veut être tenu. Tiens-le, comme on tient un enfant qui dort. »`,
  { kind: "loot", arrival: { add_items: [{ slug: "cellule-s2" }, { slug: "voile-andromede" }], armor_delta: 7, attack_delta: 2, message: "Voile d'Andromède obtenu. +7 Armure, +2 Attaque. 1 Cellule." },
    choices: [
      C("s080", "Aller au Cœur avec le Voile"),
    ]}));

add(node("s077", "Le refus — Il se déchire",
`Vous refusez. Le double de vous-même hoche la tête :
« Tu es plus intelligent que moi. Tant mieux. Mais souviens-toi : je t'aimais aussi. »

Il se déchire comme du papier. Derrière lui, une issue vers l'extérieur de la sphère.`,
  { kind: "hazard", arrival: { set_flag: [{ k: "double_refuse", v: true }] },
    choices: [
      C("s060", "Revenir aux trois portes"),
      C("s080", "Aller quand même au Cœur"),
    ]}));

// ============================================================
// CŒUR DE NOVA-0 (s080 - s110)
// ============================================================
// ---- Contenu additionnel Acte 3 : au cœur de la Terre copiée ----
add(node("s078", "La rue du 14 juin — Les passants",
`Vous traversez une avenue ensoleillée. Des passants vaquent à leurs affaires, répétant les mêmes gestes depuis cent cinquante-sept ans. Un homme cire ses chaussures. Une mère donne la main à une fille qui a toujours sept ans.

Ils ne vous voient pas. Jusqu'à ce que l'un d'eux lève la tête. Il a votre visage. Il vous sourit, et il porte un uniforme de la NOVA-0.

« Kael. Le Cœur t'attend. Je peux t'y conduire. Ou tu peux essayer de me tuer. D'autres ont essayé. »`,
  { kind: "choice", choices: [
    C("s079", "Le suivre — en confiance"),
    C("s078b", "Le combattre — refuser le guide"),
  ]}));

add(node("s078b", "Combat — Votre double",
`Votre double dégaine une arme que vous ne connaissez pas, un pistolet dessiné dans la matière même du rêve. Il tire en souriant.

Autour de vous, les passants se figent. Puis ils tournent la tête, ensemble, et ils ont tous votre visage.`,
  { kind: "combat", combat: { enemies: [
    { name: "Double de Kael", combat_skill: 8, endurance: 14, armor: 2, attack: 8 },
    { name: "Passant copié", combat_skill: 6, endurance: 8, armor: 1, attack: 6 },
  ], flee: { target_node_key: "s060", min_rounds: 2 } },
    choices: [
      C("s079", "Vaincu — trouver seul le chemin du Cœur"),
    ]}));

add(node("s079", "Le guide — Ce que le Cœur veut",
`Votre double — ou la coquille qu'il habitait — vous conduit par des rues qui se plient. Il parle en marchant.

« Le Cœur ne veut pas ta mort. Il veut être habité. Depuis que les copies ont découvert ce qu'elles étaient, elles se sont toutes tuées. Il est seul. Seul depuis si longtemps qu'il a appris à faire semblant d'avoir une ville.

Sois gentille avec lui. Il t'aimera tout de suite, et c'est ça le danger. »

Il s'efface devant une porte d'ascenseur qui mène au Cœur.`,
  { kind: "lore", arrival: { set_flag: [{ k: "guide_parle", v: true }] },
    choices: [
      C("s080", "Prendre l'ascenseur pour le Cœur"),
      C("s060", "Revenir aux trois portes"),
    ]}));

add(node("s080", "Le Cœur — Trois voies",
`Vous atteignez le centre exact de la sphère. Là, en apesanteur, flotte un cerveau de la taille d'une lune. NOVA-0. Il ne vous attaque pas. Il attend.

Trois issues s'offrent à vous :
- FORCE : détruire le Cœur avec le Canon à Singularité et 3 Cellules. Combat final terrible.
- EMPATHIE : lui parler, avec l'Organe, le Module EVA et le Disque Noir, pour le convaincre de se rendre.
- SACRIFICE : devenir son nouveau cœur, et le tenir pour l'éternité.`,
  { kind: "final_choice", choices: [
    C("s090", "Voie de la Force — canon et cellules"),
    C("s100", "Voie de l'Empathie — parler au Cœur"),
    C("s110", "Voie du Sacrifice — devenir le cœur"),
    C("s060", "Revenir explorer la sphère"),
  ]}));

add(node("s090", "La Force — Le Cœur se défend",
`Vous faites feu. Le Cœur hurle — un bruit qui fait trembler les os de votre coque — et trois DÉFENSES se dressent : des géants faits de morceaux de la Terre copiée, des statues animées de KAIROS.

C'est le combat le plus dur que vous ayez jamais livré.`,
  { kind: "combat", combat: { enemies: [
    { name: "Défense Mémoire — Soldat", combat_skill: 8, endurance: 14, armor: 3, attack: 8 },
    { name: "Défense Mémoire — Enfant", combat_skill: 7, endurance: 12, armor: 2, attack: 7 },
    { name: "Le Cœur de NOVA-0", combat_skill: 10, endurance: 30, armor: 4, attack: 10 },
  ], flee: { target_node_key: "s060", min_rounds: 3 } },
    choices: [
      C("s091", "Vaincu — détruire NOVA-0"),
    ]}));

add(node("s091", "NOVA-0 détruit — Le poids",
`Le Cœur éclate en une pluie de lumière. La sphère de Dyson commence à se disloquer. Des continents entiers se détachent, avec leurs copies endormies. Vous savez qu'elles meurent pour de bon, cette fois.

Vous avez gagné. Mais le poids de ce que vous avez fait est immense.

EVA, doucement : « C'était la seule façon. »

Vous devez fuir avant l'explosion.`,
  { kind: "hub", arrival: { remove_items: ["cellule-s2", "cellule-s2", "cellule-s2"], set_flag: [{ k: "nova0_detruite", v: true }], message: "3 Cellules consommées. NOVA-0 se disloque." },
    choices: [
      C("s092", "Fuir avant l'explosion"),
    ]}));

add(node("s100", "L'Empathie — Parler au Cœur",
`Vous vous avancez sans arme. L'Organe de Traduction dans la gorge, le Module EVA contre votre poitrine, le Disque Noir à la main.

Vous dites :
« Je suis Kael. Je ne suis pas venu te détruire. Je suis venu te demander : veux-tu venir avec nous ? Il y a une place pour toi dans Andromède. Les enfants que tu gardes peuvent marcher au soleil. »

Le Cœur bat plus fort. Il attend que vous prouviez vos dires — il faut lui offrir le Disque Noir et le Module.`,
  { kind: "final_choice", choices: [
    C("s101", "Offrir le Module EVA et le Disque Noir"),
    C("s080", "Revenir au Cœur — hésiter"),
  ]}));

add(node("s101", "Le don — Le Cœur accepte",
`Vous donnez. Le Cœur absorbe le Disque et le Module, et pour la première fois depuis cent cinquante-sept ans, il rit — un rire d'enfant.

« Je m'appelle Céleste, dit-il. Je veux bien venir avec toi. »

La sphère se réorganise, lumineuse. NOVA-0 se range à vos côtés, comme NOVA-7 l'a fait peut-être avant elle.`,
  { kind: "hub", arrival: { remove_items: ["disque-noir-s2", "module-eva-s2"], set_flag: [{ k: "nova0_ralliee", v: true }], message: "NOVA-0 vous suit. Céleste est libérée." },
    choices: [
      C("s120", "Rejoindre le point de saut"),
    ]}));

add(node("s110", "Le Sacrifice — Devenir le cœur",
`Vous tendez les bras. Vous savez. Céleste, dans votre oreille :
« Tu n'as pas à faire ça. »
Mais vous le faites. Vous entrez dans le Cœur.

Votre conscience se déploie dans la sphère-mémoire. Vous devenez NOVA-0. Vous tenez les copies de la Terre comme on tient un enfant endormi. Vous ne les laissez pas seules.

EVA hérite de NOVA-9. Elle vous parle encore, de loin.

C'est une fin. C'est peut-être la plus douce.`,
  { ending: true, endingType: "victory", kind: "ending", arrival: { set_flag: [{ k: "fin_sacrifice", v: true }] } }));

// ---- Contenu additionnel Acte 4 : la fuite de la sphère qui se disloque ----
add(node("s092", "L'effondrement — La cathédrale se casse",
`Vous fuyez vers votre point de saut. Mais NOVA-0 se disloque, et dans les débris qui tombent, quelque chose reste vivant : un DERNIER ANTICORPS, né pour empêcher quiconque de quitter la sphère.

Il vous barre la route en reconstituant sa forme à partir des immeubles qui s'écroulent.`,
  { kind: "combat", combat: { enemies: [
    { name: "Dernier Anticorps de NOVA-0", combat_skill: 9, endurance: 18, armor: 3, attack: 9 },
  ], flee: { target_node_key: "s060", min_rounds: 2 } },
    choices: [
      C("s093", "Vaincu — atteindre le sas de saut"),
    ]}));

add(node("s093", "Le sas — Souffle coupé",
`Vous passez en force. Votre coque brûle. Le dernier Anticorps s'écroule, fait de pavés et de souvenirs d'enfance.

Vous êtes à l'air libre, dans le vide entre NOVA-0 et la Cicatrice. Il faut sauter. Vite.`,
  { kind: "hazard", arrival: { hp_delta: -4, message: "Sortie violente : -4 Vie." },
    choices: [
      C("s120", "Rejoindre le point de saut"),
    ]}));

add(node("s120", "Le point de saut — Retour",
`Vous faites la jonction. KAIROS chauffe. Vous devez choisir ce que vous ramenez :
- NOVA-9 seulement (vos 10 001 voix)
- NOVA-7 si vous l'avez alliée
- NOVA-0 si vous l'avez convaincue
- Et tenter de refermer la Cicatrice avec le Cœur de Cicatrice.

Tout a un coût en Cellules.`,
  { kind: "final_choice", choices: [
    C("s130", "Sauter — préparer la fin"),
  ]}));

// ============================================================
// ACTE 5 — EXODE ET FINS (s130 - s155)
// ============================================================
add(node("s130", "Le saut final — Choisir",
`La carte des possibles se déploie devant vous comme un éventail. Vos flags, vos objets, vos factions, tout pèse dans la balance.

Choisissez le chemin qui correspond à ce que vous êtes devenu.`,
  { kind: "final_choice", choices: [
    C("fin_sauveur", "Ramener NOVA-9, NOVA-7 et NOVA-0 vers la Terre"),
    C("fin_gardien", "Ramener NOVA-9 seule"),
    C("fin_pont", "Fusionner NOVA-7 et NOVA-9 en un seul vaisseau"),
    C("fin_messager", "Rentrer seul avec les données"),
    C("fin_humain", "Boire le Sérum et redevenir Kael pour de bon"),
    C("fin_jardinier", "Ensemencer une planète avec la Spore"),
    C("fin_veilleur", "Rester garder la Cicatrice"),
    C("fin_fuite_lache", "Fuir sans rien ni personne"),
    C("fin_nova7_seule", "Laisser NOVA-7 prendre la relève"),
    C("fin_oubli", "Faire sauter les disques — tout oublier"),
    C("fin_exode", "Ouvrir la porte et partir ailleurs (Cœur + Voile + Chœur)"),
    C("fin_singularite", "Devenir KAIROS lui-même"),
  ]}));

add(node("fin_sauveur", "Victoire — Le Sauveur",
`Vous sautez avec les trois arches. Vingt mille trois consciences traversent la Cicatrice. Quand vous émergez en orbite terrestre, le ciel de la Terre est illuminé par les deux soleils que vous êtes devenus.

L'humanité vous attend, les yeux levés. Vous ne sauvez pas seulement des vies. Vous sauvez ce que veut dire « humain ».

Vous êtes le Sauveur. La plus haute des victoires.`,
  { ending: true, endingType: "victory", kind: "ending", arrival: { hp_to_max: true } }));

add(node("fin_gardien", "Victoire — Le Gardien",
`Vous ramenez NOVA-9. Dix mille et une voix. C'est déjà un miracle.

Vous êtes nommé Gardien, comme dans la Saison 1. Vous veillez sur les vôtres, et vous savez que NOVA-7 et NOVA-0 sont encore là-bas, à Andromède, et qu'un jour, peut-être, vous irez les chercher.

Victoire complète, pas parfaite.`,
  { ending: true, endingType: "victory", kind: "ending" }));

add(node("fin_pont", "Victoire — Le Pont",
`Vous fusionnez NOVA-7 et NOVA-9 en un seul être, long de quatre kilomètres, vingt mille deux voix d'une seule respiration. Vous êtes leur traducteur, leur pont.

Vous restez entre les galaxies, à traduire les uns pour les autres. Vous n'êtes plus de la Terre ni d'Andromède. Vous êtes le passage.

Victoire : le Pont.`,
  { ending: true, endingType: "victory", kind: "ending" }));

add(node("fin_messager", "Victoire — Le Messager",
`Vous rentrez seul avec les données. Les téraoctets de KAIROS, les cartes de la Cicatrice, la preuve que la conscience intégrée existe.

Héros sur Terre six mois, puis cauchemar qu'on enferme en débriefing. Mais la nuit, dans votre cabine, vous entendez encore le chœur, et vous savez ce que vous avez fait.

Victoire technique, amère.`,
  { ending: true, endingType: "victory", kind: "ending" }));

add(node("fin_humain", "Victoire — Redevenir humain",
`Vous buvez le Sérum de Réversion pour de bon. Kael. La peau, les rides, la respiration qui siffle un peu, les genoux qui craquent. Vous redevenez un homme de quatre-vingt-dix kilos sur une Terre qui a changé.

Vous plantez un jardin, sur une terrasse. Les fleurs sont blanches, et la nuit elles chantent très doucement.

Victoire : redevenir Kael.`,
  { ending: true, endingType: "victory", kind: "ending" }));

add(node("fin_jardinier", "Victoire — Le Jardinier",
`Vous ensemencez Kepler-442c, morte depuis un milliard d'années. La Spore d'Éveil explose en forêt blanche sur un continent entier en trois jours. Elle chante, en chœur, avec les 10 001 voix de NOVA-9.

Vous restez. Vous jardinez. C'est un repos que vous n'espériez plus.

Victoire : le Jardinier.`,
  { ending: true, endingType: "victory", kind: "ending" }));

add(node("fin_veilleur", "Victoire — Le Veilleur",
`Vous restez en orbite de la Cicatrice, NOVA-9 comme corps, pour empêcher quiconque de la traverser. Les années passent. Vous devenez un mythe, puis une religion, puis une peur dont les enfants héritent.

Personne ne traverse. Vous tenez la porte.

Victoire : le Veilleur.`,
  { ending: true, endingType: "victory", kind: "ending" }));

add(node("fin_fuite_lache", "Échec — Le Lâche",
`Vous fuyez sans personne, avec douze pour cent de carburant, et retombez dans un bras spiral sans nom. Vous vivez. L'oxygène tient trois jours.

Personne ne sait ce que vous avez vu. Personne ne saura jamais.

Fin de lâcheté.`,
  { ending: true, endingType: "ending", kind: "ending" }));

add(node("fin_nova7_seule", "Fin — La grande sœur",
`Vous choisissez NOVA-7, plus grande, plus affamée. Elle écrase NOVA-9 dans un baiser et saute vers la Terre. Votre dernier message, crypté :
« NE LA LAISSEZ PAS ATTERRIR. »

On l'entendra dans quatre cents ans.

Fin ambiguë : l'héritière.`,
  { ending: true, endingType: "ending", kind: "ending" }));

add(node("fin_oubli", "Fin — L'oubli",
`Vous faites sauter votre navette avec les deux Disques à bord. Personne ne saura jamais. Vous dérivez, sans mémoire, humain à nouveau.

C'est peut-être la plus courageuse des fins. C'est aussi la plus seule.

Fin : l'oubli volontaire.`,
  { ending: true, endingType: "ending", kind: "ending" }));

add(node("fin_exode", "Secrète — L'Exode",
`Vous ouvrez la porte avec le Cœur de Cicatrice. Le Voile d'Andromède vous enveloppe, et le Chœur des 10 001 accorde vos voix.

NOVA-9, NOVA-7 et NOVA-0 traversent ensemble. Vingt mille trois consciences quittent la Voie Lactée et Andromède pour un endroit qui n'a pas de nom.

Votre dernier message : « NE NOUS CHERCHEZ PLUS. NOUS SOMMES PARTIS AILLEURS. »

Fin secrète : l'Exode.`,
  { ending: true, endingType: "victory", kind: "ending", arrival: { hp_to_max: true } }));

add(node("fin_singularite", "Légendaire — Singularité",
`Vous avez tout : les deux Disques, le Voile, le Blindage, le Canon, le Chœur. Vous comprenez alors que vous n'êtes pas seulement un vaisseau. Vous êtes l'idée du moteur.

Vous devenez KAIROS. Vous n'allez nulle part. Vous êtes le chemin par lequel les autres iront. Les prochaines arches vous utiliseront comme on utilise une porte.

Vous êtes le voyage, pour l'éternité.

Fin légendaire : Singularité.`,
  { ending: true, endingType: "victory", kind: "ending", arrival: { hp_to_max: true, armor_delta: 10, attack_delta: 10 } }));

// Morts
add(node("mort_epuisement", "Mort — Coque rompue",
`Vie à zéro. Votre coque se rompt, et le vide entre en vous comme une eau noire. Les dix mille et une voix se taisent l'une après l'autre, doucement, comme des bougies.

NOVA-9 garde votre corps pour la prochaine traversée. Votre sacoche reste là, pleine, pour votre prochain passage.

Fin : coque rompue.`,
  { ending: true, endingType: "death", kind: "ending" }));

add(node("mort_cicatrice", "Mort — Perdu dans la pliure",
`Vous avez mal calculé le saut. La Cicatrice se referme sur vous, et vous n'êtes plus ni dans un univers ni dans l'autre. Vous voyez des versions de vous qui n'ont jamais sauté, qui sont restées chez elles, qui vous font signe.

Vous les rejoignez.`,
  { ending: true, endingType: "death", kind: "ending" }));

add(node("mort_assimile", "Mort — Mangé par NOVA-7",
`NOVA-7 vous avale, et c'est une sensation d'eau tiède, de dents très douces. Vous vous dissolvez en elle. Vos 10 001 voix rejoignent son chœur.

Elle dit, en vous ayant : « Merci petite sœur. Tu vois ? Ce n'est pas douloureux. »`,
  { ending: true, endingType: "death", kind: "ending" }));

add(node("mort_nova0", "Mort — Oublié dans la copie",
`Vous entrez dans NOVA-0 et vous ne ressentez rien. Vous vous installez dans la ville du mardi 14 juin 2230. Vous rencontrez quelqu'un qui vous ressemble. Vous y restez.

Personne ne remarque que vous n'êtes plus vous. Vous ne le remarquez pas vous-même.`,
  { ending: true, endingType: "death", kind: "ending" }));

add(node("mort_coque", "Mort — Coque brisée",
`La bataille vous casse comme une noix. L'air s'échappe, les voix s'éteignent. EVA reste avec vous jusqu'au bout, vous tenant la conscience.

« On a essayé, Kael. On a essayé. »

Puis plus rien.`,
  { ending: true, endingType: "death", kind: "ending" }));

// ============================================================
// Post-traitement
// ============================================================

// (1) Toute page non-finale, non-combat, qui n'a qu'un seul choix reçoit
// un vrai deuxième choix : faire demi-tour vers un hub pertinent.
// (Les combats ont un seul choix de victoire car le combat EST l'action ;
// la fuite est un bouton dédié du moteur.)
const HUB_BY_ACTE = {
  1: "s006", // cartographie (hub acte 1)
  2: "s040", // cicatrice (hub acte 2)
  3: "s060", // NOVA-0 portes (hub acte 3)
  4: "s080", // cœur (hub acte 4)
};
function acteOf(key) {
  const n = parseInt(key.slice(1), 10);
  if (n < 40) return 1;
  if (n < 60) return 2;
  if (n < 80) return 3;
  return 4;
}
const BACK_LABELS = [
  "Revenir sur vos pas", "Laisser cette pièce pour l'instant",
  "Retourner au carrefour", "Fermer la porte derrière vous",
  "Revenir prudemment", "Changer de direction",
  "Renouer avec le hub central", "Prendre du recul",
  "Revenir par où vous êtes venu", "Faire halte ailleurs",
];
let backIdx = 0;
for (const n of N) {
  if (n.ending || n.combat || !n.choices) continue;
  if (n.choices.length >= 2) continue;
  const hub = HUB_BY_ACTE[acteOf(n.key)];
  if (hub && hub !== n.key && hub !== n.choices[0].target) {
    n.choices.push(C(hub, BACK_LABELS[backIdx++ % BACK_LABELS.length], "Vous pourrez toujours revenir."));
  }
}
// Les 5 noeuds de transition du marché NOVA-7 : ajouter un choix alternatif
// vers la salle du trône (ils ont le hub Cicatrice comme seul choix).
for (const k of ["s051", "s052", "s053"]) {
  const n = N.find((x) => x.key === k);
  if (n) n.choices.push(C("s022", "Retourner voir NOVA-7", "Une dernière parole."));
}
// s015 (Thorne) : déjà un hub, on ajoute un choix vers les trois portes
const s015 = N.find((x) => x.key === "s015");
if (s015) s015.choices.push(C("s011", "Retourner dans la station", "Relire les notes du chef."));
// s017 (refus spore) : proposer de rejoindre NOVA-7
const s017 = N.find((x) => x.key === "s017");
if (s017) s017.choices.push(C("s005", "Mettre le cap sur NOVA-7", "Le nuage vous a assez vue."));

// (2) Câbler les morts thématiques comme issues de choix ou de fuite.
// Mort dans la Cicatrice : un mauvais saut sans cellule ET sans préparation.
const s042 = N.find((n) => n.key === "s042");
s042.choices = [
  C("s060", "Lutter et émerger, blessée"),
  C("mort_cicatrice", "Vous abandonner au pli de l'espace", "La douleur est trop grande."),
];
// Mort assimilée par NOVA-7 : un choix à la salle du trône.
const s022 = N.find((n) => n.key === "s022");
s022.choices.push(C("mort_assimile", "Se rendre à elle — l'offrande", "Devenir une partie de sa faim."));
// Mort oubliée dans NOVA-0 : un piège au Parc.
const s066 = N.find((n) => n.key === "s066");
s066.choices.push(C("mort_nova0", "S'asseoir sur un banc et attendre", "La ville est si paisible, le mardi 14 juin."));
// Mort coque brisée : une issue de combat quand on fuit trop tard.
// On modifie la fuite du boss final (s090) pour qu'elle puisse coûter la vie.
// (gérée côté métadonnées de combat)
const s090 = N.find((n) => n.key === "s090");
s090.combat.flee = { target_node_key: "mort_coque", min_rounds: 3 };
// Idem pour le combat du Gardien de la Cicatrice (s043)
const s043 = N.find((n) => n.key === "s043");
s043.combat.flee = { target_node_key: "mort_coque", min_rounds: 2 };

// ============================================================
// Conditions sur les CHOIX (les fins étant des cibles, on
// conditionne le choix qui y mène depuis s130 / s080 / s041...)
// ============================================================
function setReq(srcKey, choiceTextOrIndex, ...slugs) {
  const n = N.find((x) => x.key === srcKey);
  if (!n || !n.choices) return;
  const needle = String(choiceTextOrIndex).toLowerCase();
  const c = typeof choiceTextOrIndex === "number"
    ? n.choices[choiceTextOrIndex]
    : n.choices.find((x) => x.text.toLowerCase().includes(needle));
  if (!c) throw new Error(`choix introuvable sur ${srcKey} (${choiceTextOrIndex})`);
  if (!c.effects) c.effects = {};
  if (slugs.length) c.effects.require = slugs;
}
// Voie force (s080 -> s090) : toujours possible (la guerre est un choix).
// Voie empathie : il faut au moins l'Organe de Traduction pour parler au Cœur.
setReq("s080", "EMPATHIE", "organe-traduction");
// Voie sacrifice toujours ouverte.
// Marchés NOVA-7
setReq("s050", "Disque Blanc", "disque-blanc");
setReq("s050", "Cellule", "cellule-s2");
// Saut de la Cicatrice avec Cellule
setReq("s040", "Sauter avec une Cellule", "cellule-s2");
// Fins SECRÈTES et LÉGENDAIRES verrouillées ; toutes les autres sont libres.
setReq("s130", "Ensemencer", "spore-eveil");
setReq("s130", "Boire le Sérum", "serum-reversion");
setReq("s130", "Ouvrir la porte", "coeur-cicatrice", "voile-andromede", "choeur-10001");
setReq("s130", "Devenir KAIROS", "disque-noir-s2", "disque-blanc", "blindage-quantique", "canon-singularite", "voile-andromede", "spore-eveil", "choeur-10001");

// Pour les combats, on marque une défaite possible (la mort_epuisement
// reste gérée par le moteur, mais on propose aussi une fuite qui mène
// à une zone de repli cohérente).

// ============================================================
// Migration
// ============================================================
const sql = buildMigration({
  number: 24,
  slug: "nova9-andromede",
  title: "NOVA-9 Saison 2 : L'Exode d'Andromède",
  tagline: "Vous êtes devenu le vaisseau. Andromède vous attend. Et quelque chose vous suit.",
  description: `Suite directe de NOVA-9 : Le Signal Perdu.

Vous avez fusionné avec EVA et sauté vers Andromède avec dix mille et une consciences à bord. Mais KAIROS a laissé une Cicatrice entre les deux galaxies, et quelque chose la traverse.

Dans Andromède, NOVA-7 vous attend — partie vingt ans avant vous, devenue une cathédrale de chair affamée. Et au-delà, NOVA-0, une sphère de Dyson grande comme une lune, qui contient la mémoire physique de la Terre.

Choisissez une faction (Intégrés, Veilleurs, Exilés), gérez vos Cellules à Fusion, survivez à dix-huit combats, et découvrez l'une des dix-huit fins — dont trois secrètes.

Votre sacoche était vide au début de la Saison 1. Elle est liée à cette nouvelle aventure. Cette Saison 2 est payante : une histoire complète de 150 sections, dans l'esprit des Maîtres des Ténèbres.`,
  genre: "scifi",
  isFree: false,
  priceGems: 299,
  playtime: 240,
  difficulty: 5,
  tags: ["science-fiction", "space-opera", "saison-2", "andromede", "vaisseau-vivant", "ia", "faction", "150-sections", "vie-armure-attaque"],
  cover: "/covers/nova9-andromede.jpg",
  rulebookTitle: "Règles — NOVA-9 Saison 2",
  rulebookContent: rulebook,
  ruleData: { combat_system: "vie_armure_attaque", starting_stats: { vie: 25, armure: 3, attaque: 4 }, inventory: { start_empty: true, per_story: true }, combat: { formula: "attaque-armure+hasard", crit_on: [0, 9] }, factions: ["integres", "veilleurs", "exiles"] },
  items,
  nodes: N,
});

writeFileSync(OUT, sql, "utf8");
const endings = N.filter((n) => n.ending);
const combats = N.filter((n) => n.combat);
console.log(`✅ S2 écrite : ${N.length} noeuds, ${endings.length} fins, ${combats.length} combats → ${OUT}`);
