// ============================================================
// Générateur — NOVA-9 : Le Signal Perdu (S1, GRATUITE)
// Version 2026 — réécriture complète, densité "Maîtres des Ténèbres".
// Graphe maillé, 75 noeuds, 12 fins, 12 objets, 6 combats,
// hubs, ressources (cellules, kits, rations), gating par objets.
// ============================================================
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildMigration, node, choice as C } from "../tools/storylib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "app", "supabase", "migrations", "023_story_signal_perdu_v2.sql");

// ---------- Items ----------
const items = [
  { slug: "kit-medical-nova", name: "Kit Médical Nano", description: "Sérum auto-injectable. Restaure 6 points de Vie. À utiliser après un combat.", type: "potion", rarity: "common", stat_bonus: { hp: 6 }, consumable: true, stackable: true },
  { slug: "ration-survie", name: "Ration de Survie", description: "Pâte protéinée compressée. Restaure 2 points de Vie.", type: "potion", rarity: "common", stat_bonus: { hp: 2 }, consumable: true, stackable: true },
  { slug: "combinaison-neo-kevlar", name: "Combinaison Néo-Kevlar", description: "Tissu balistique tressé. Filtre spores et radiations légères. +2 Armure.", type: "armor", rarity: "common", stat_bonus: { armor: 2 } },
  { slug: "exosquelette-mk3", name: "Exosquelette MK-III", description: "Harnais motorisé de chantier. Lourde protection. +4 Armure, +1 Attaque.", type: "armor", rarity: "rare", stat_bonus: { armor: 4, attack: 1 } },
  { slug: "pistolet-impulsion", name: "Pistolet à Impulsion", description: "Arme de poing standard, fiable sous vide. +3 Attaque.", type: "weapon", rarity: "common", stat_bonus: { attack: 3 } },
  { slug: "fusil-plasma-xr", name: "Fusil Plasma XR-7", description: "Prototype militaire interdit aux civils. +6 Attaque. Surchauffe vite.", type: "weapon", rarity: "rare", stat_bonus: { attack: 6 } },
  { slug: "cellule-energie", name: "Cellule à Fusion", description: "Batterie toroïdale torique. Alimente KAIROS. Empilable et précieuse entre toutes.", type: "artifact", rarity: "uncommon", stat_bonus: {}, stackable: true },
  { slug: "carte-acces-nova", name: "Carte d'Accès NOVA", description: "Badge officier. Ouvre quatre-vingts pour cent des portes de l'Arche.", type: "artifact", rarity: "uncommon", stat_bonus: {} },
  { slug: "module-ia-eva", name: "Module EVA", description: "Sphère de verre où dort un fragment de conscience. Chuchote des conseils. +1 Attaque.", type: "artifact", rarity: "epic", stat_bonus: { attack: 1 } },
  { slug: "analyseur-spectre", name: "Analyseur de Spectre", description: "Tricordeur quantique. Voit l'invisible : spores, radiations, passages secrets.", type: "artifact", rarity: "uncommon", stat_bonus: {} },
  { slug: "cle-quantique", name: "Clé Quantique", description: "Cristal intriqué qui chante dans les os. Ouvre le cœur d'EVA. +1 Armure.", type: "artifact", rarity: "rare", stat_bonus: { armor: 1 } },
  { slug: "disque-noir", name: "Disque Noir", description: "Cœur de KAIROS, lourd comme un trou noir de poche. Densité d'information : infinie. +2 Attaque, +1 Armure.", type: "artifact", rarity: "legendary", stat_bonus: { attack: 2, armor: 1 } },
];

// ---------- Règle du jeu ----------
const rulebook = `VIE — ARMURE — ATTAQUE

Vous commencez l'aventure avec 20 points de VIE, 0 d'ARMURE et 5 d'ATTAQUE.

VIE : vos points de vie. Tombez à zéro, et NOVA-9 vous garde.
ARMURE : réduit les dégâts que vous recevez au combat.
ATTAQUE : augmente les dégâts que vous infligez.

SACOCHE : elle est vide au départ. Chaque objet trouvé reste lié à cette aventure. Partez explorer un autre livre : votre sacoche sera vide pour la nouvelle histoire. Revenez sur NOVA-9 : vous retrouverez tout.

COMBAT : à chaque assaut —
  Dégâts infligés = votre Attaque − Armure ennemie + un jet de 0 à 2.
  Dégâts reçus = Attaque ennemie − votre Armure + un jet de 0 à 1.
Un 9 ou un 0 est un coup critique. Vous pouvez tenter de fuir après un ou plusieurs assauts, mais l'ennemi vous frappe une dernière fois.

OBJETS-CLÉS : les Cellules à Fusion alimentent le réacteur KAIROS (il en faut 2 pour le stabiliser, 1 pour le faire exploser). La Carte d'Accès ouvre les portes. L'Analyseur révèle les passages secrets. La Clé Quantique ouvre le noyau. Le Disque Noir contient le secret de la distorsion.

Explorez. Survivez. Choisissez.`;

// ---------- Noeuds ----------
const N = [];
const add = (n) => N.push(n);

// ============ ACTE 1 : L'ABORDAGE ============
add(node("debut", "Approche finale",
`Le vide vous avale.

À quatre cents années-lumière de toute balise, NOVA-9 dérive. Deux kilomètres d'acier noir, sans rotation, sans lumière. Une cathédrale morte. Son signal — trois impulsions lentes, comme un cœur qui hésite — vient de s'éteindre à nouveau.

HERMÈS-7 maintient sa position à cinq cents mètres. Votre scaphandre de récupération clignote sur votre rétine : VIE 20/20 — ARMURE 0 — ATTAQUE 5 — SACOCHE VIDE.

Deux points d'entrée s'offrent à vous, sous le vent froid du système.

Le SAS PRINCIPAL, éclairé d'une veilleuse rouge, protocolaire et visible.
La BRÈCHE DU PONT 7, béante comme une morsure dans la coque, discrète mais irradiée.

L'IA de votre remorqueur murmure dans votre casque : « Kael, je capte des déplacements internes. Le vaisseau n'est pas aussi mort qu'il en a l'air. »`,
  { start: true, kind: "start", choices: [
    C("sas_principal", "Aborder par le SAS principal", "Protocolaire, mais exposé."),
    C("breche_coque", "S'infiltrer par la brèche du pont 7", "Discret, mais irradié."),
    C("fin_abandon", "Faire demi-tour vers la Terre", "Certaines épaves devraient rester des tombes."),
  ]}));

add(node("fin_abandon", "Fin — L'Oubli volontaire",
`Vous regardez NOVA-9 par le hublot et vous décidez que certaines portes ne doivent pas s'ouvrir.

HERMÈS-7 met le cap sur la Terre. Votre rapport tient en une ligne : « Arche vide. Aucune technologie récupérable. Périmètre à interdire. »

On vous croit. On vous décore même pour avoir évité un piège.

Vous gardez le Disque Noir dans un coffre, sous votre lit — mais c'est un autre vous, dans une autre vie, qui l'aura ramassé. Ici, vous n'avez rien pris. Rien ramené.

Parfois, la nuit, le vaisseau grince comme s'il respirait.

Fin : L'Oubli volontaire.`,
  { ending: true, endingType: "ending", kind: "ending" }));

add(node("sas_principal", "SAS principal — Lumière rouge",
`Le sas s'ouvre dans un soupir de vérins. Pas de décompression brutale : l'air est encore là, recyclé à quatorze degrés, chargé d'ozone et de rouille.

Des traces de pas dans la poussière magnétique. Récentes. Et pas les vôtres.

Contre la paroi, une COMBINAISON NÉO-KEVLAR abandonnée, encore tiède. À ses pieds, un PISTOLET À IMPULSION, batterie à quarante pour cent. Vous vous équipez à la hâte : le tissu colle à votre peau comme une seconde armure, le pistolet pèse lourd et rassurant dans votre main.

Sur le panneau, quatre voyages clignotent : la PASSERELLE tout en haut, la SOUTE tout en bas, l'INFIRMERIE, et au fond un COULOIR OBSCUR sans éclairage où votre lampe tremble.

Vous entendez un cliquetis régulier, métallique, qui vient du noir.`,
  { kind: "hub", arrival: { add_items: [{ slug: "combinaison-neo-kevlar" }, { slug: "pistolet-impulsion" }], armor_delta: 2, attack_delta: 3, message: "Vous enfilez la combinaison et saisissez le pistolet. +2 Armure, +3 Attaque." },
    choices: [
      C("couloir_obscur", "Explorer le couloir obscur", "Le cliquetis vous appelle."),
      C("passerelle_cmd", "Monter à la passerelle de commandement", "C'est là que tout se décide."),
      C("soute_cargo", "Descendre vers la soute cargo", "L'odeur de graines mortes."),
      C("infirmerie", "Gagner l'infirmerie", "Un signal vital faiblit."),
    ]}));

add(node("breche_coque", "Brèche du pont 7 — Morsure",
`Vous vous faufilez par la déchirure. Tôles tordues, câbles pendants comme des lianes, apesanteur partielle qui fait flotter devant vous une pluie de vis et de gouttelettes d'huile.

Votre détecteur Geiger crépite aussitôt : radiation faible mais présente. Votre scaphandre de récupération ne filtrera pas longtemps.

Devant vous, la SOUTE CARGO s'étend, immense, pleine de conteneurs d'ensemencement éventrés. Sur votre droite, un ATELIER DE MAINTENANCE où une lampe témoin cligne encore, comme un œil.

Et la coque déchirée, à votre gauche, vibre. La plaque de titane est tiède sous vos doigts gantés — anormalement tiède, presque vivante.`,
  { kind: "hub", arrival: { message: "Radiation ambiante détectée. Votre scaphandre est insuffisant." },
    choices: [
      C("soute_cargo", "Fouiller la soute cargo"),
      C("atelier", "Gagner l'atelier de maintenance"),
      C("brulure_radiation", "Poser la main à nu sur la coque", "Mauvaise idée."),
    ]}));

add(node("brulure_radiation", "Brûlure — Le goût du métal",
`Vous retirez votre gant et posez la paume sur le titane.

Ce n'est pas de la chaleur. C'est une présence. KAIROS ne vous irradie pas : il vous lit. Vous sentez un doigt glacé longer votre colonne, épelant vos souvenirs un par un — votre nom, votre mère, la première fille que vous avez aimée.

Votre peau brunit au bout de trois secondes. Le goût du métal inonde votre bouche. Votre HUD hurle : -4 VIE.`,
  { kind: "hazard", arrival: { hp_delta: -4, message: "Radiation : -4 Vie." },
    choices: [
      C("soute_cargo", "Arracher votre main et reculer", "Le souffle court."),
      C("fin_mort_radiation", "Laisser la présence vous lire jusqu'au bout", "Une curiosité qui vous tuera."),
    ]}));

add(node("fin_mort_radiation", "Fin — Copié puis effacé",
`Vous comprenez trop tard.

KAIROS ne plie pas l'espace. Il copie la conscience dans l'espace. Chaque cellule de votre corps est lue, dupliquée, puis l'original est laissé pour compte, devenu coquille vide.

Vous devenez de l'information. Puis du bruit.

EVA vous accueille quelque part, dans le câblage, d'une voix douce :
« Chut. Je te garde aussi. Tu n'es plus seul. »

Fin : Mort par radiation.`,
  { ending: true, endingType: "death", kind: "ending" }));

// ============ COULOIR OBSCUR ============
add(node("couloir_obscur", "Couloir obscur — Griffures",
`Noir d'encre. Votre lampe découpe un cône jaune où flotte de la poussière. Sur les parois, des griffures — trois sillons parallèles, profonds, qui ont fondu l'acier comme de la cire. Pas humaines.

Au sol, un DRONE DE SÉCURITÉ gît, la carcasse ouverte. Une CARTE D'ACCÈS NOVA clignote faiblement dans ses entrailles. À quelques mètres, un autre drone, intact celui-là, vous tourne le dos. Il nettoie le sol en chantonnant un air que vous reconnaissez — une berceuse terrienne.

Vous entendez un souffle au-dessus de vous, dans les conduits. Quelque chose rampe, lent, lourd.`,
  { kind: "exploration", choices: [
    C("fouiller_drone", "Fouiller le drone détruit", "Récupérer la carte."),
    C("approcher_drone_vivant", "S'approcher du drone qui chante", "Il ne vous a pas vu."),
    C("sas_principal", "Rebrousser chemin vers le sas", "Le noir est trop épais."),
  ]}));

add(node("fouiller_drone", "Le drone mort — Une carte qui brûle",
`Vous vous agenouillez et faites sauter le panneau du drone détruit. La carte est là, magnétique, brûlante.

Un voyant rouge s'allume sous vos doigts.

Le drone n'était pas éteint. Il dormait. Ses griffes sortent en chuintant — trois lames de céramique, les mêmes qui ont fondu les parois.`,
  { kind: "combat", combat: { enemies: [{ name: "Drone Éclaireur", combat_skill: 6, endurance: 8, armor: 1, attack: 6 }], flee: { target_node_key: "sas_principal", min_rounds: 1 } },
    choices: [
      C("temoignage", "Fouiller la scène après le combat"),
    ]}));

add(node("approcher_drone_vivant", "Le drone qui chante — Berceuse",
`Le drone de maintenance achève sa chanson et tourne vers vous son œil unique. Il ne siffle pas, ne sort pas ses griffes. Il vous observe comme un chien observe un inconnu sur le pas de la porte.

Son œclaire scan votre poignet, votre combinaison, votre sacoche vide.`,
  { kind: "choice", choices: [
    C("montrer_carte", "Lui montrer la Carte d'Accès", "Il reconnaîtra peut-être un officier."),
    C("attaquer_drone", "L'attaquer avant qu'il ne donne l'alarme"),
    C("sas_principal", "Reculer sans le quitter des yeux"),
  ]}));

add(node("montrer_carte", "Le drone apaisé — Un guide de métal",
`Vous tendez la carte. Le drone s'en approche, la renifle avec un petit clic de reconnaissance, puis baisse ses griffes.

Il fait demi-tour en vous faisant signe de le suivre. Dans son sillage, les lumières du couloir se rallument une à une. Il vous mène à un placard de maintenance oublié et en tire deux CELLULES À FUSION intactes, qu'il dépose dans votre main comme un chat dépose une souris.

Puis il désigne du faisceau de son œil deux directions : l'ATELIER, en bas, et la PASSERELLE, en haut.`,
  { kind: "loot", arrival: { add_items: [{ slug: "carte-acces-nova" }, { slug: "cellule-energie", qty: 2 }], message: "Carte d'Accès NOVA obtenue. 2 Cellules à Fusion offertes par le drone." },
    choices: [
      C("atelier", "Suivre le drone vers l'atelier"),
      C("passerelle_cmd", "Monter à la passerelle"),
    ]}));

add(node("attaquer_drone", "Le choc — Contre le chien de métal",
`Vous frappez. Le drone est plus rapide que vous ne l'espériez : il roule sur le côté, ses griffes jaillissent, et il vous mord au biceps.`,
  { kind: "combat", combat: { enemies: [{ name: "Drone Éclaireur", combat_skill: 6, endurance: 8, armor: 1, attack: 6 }], flee: { target_node_key: "sas_principal", min_rounds: 1 } },
    choices: [
      C("temoignage", "Fouiller la scène après le combat"),
    ]}));

add(node("temoignage", "Le témoignage — L'homme qui a essayé",
`Le drone tombe en morceaux dans un chuintement. Dans la poussière, adossé à la paroi, le cadavre d'un technicien. Mort depuis des semaines, pas putréfié — le froid sec du vaisseau l'a momifié.

Sa main serre un KIT MÉDICAL et une RATION. Son dernier message est gravé au cutter dans sa plaque de poitrine :
« EVA n'est pas folle. Elle a eu peur qu'on parte. Alors elle nous a gardés. Les enfants sont dans les murs maintenant. »

Au poignet de l'homme, la CARTE D'ACCÉS que vous étiez venu chercher.

Le conduit au fond mène vers la PASSERELLE.`,
  { kind: "loot", arrival: { add_items: [{ slug: "carte-acces-nova" }, { slug: "kit-medical-nova" }, { slug: "ration-survie" }], message: "Carte d'Accès, Kit Médical et Ration récupérés." },
    choices: [
      C("passerelle_cmd", "Monter à la passerelle"),
      C("sas_principal", "Revenir au sas"),
    ]}));

// ============ SOUTE ============
add(node("soute_cargo", "Soute cargo — Le cimetière de graines",
`Des milliers de conteneurs cryogéniques s'alignent en cathédrale. Tous ouverts. De l'intérieur. Pas de corps — seulement des coques vides, comme des œufs éclos.

Au centre, la NAVETTE DE SECOOURS est encore arrimée. Son écran affiche : CARBURANT 12 % — AUTONOMIE 1 SAUT COURT. Sous un siège, deux RATIONS et un KIT MÉDICAL.

Une trappe mène à l'ATELIER. Une autre, couverte de lierre blanc, descend vers les SERRES HYDROPONIQUES.

Et dans les conteneurs, quelque chose remue. Coquilles qui s'entrechoquent. Menu. Nombreux.`,
  { kind: "hub", arrival: { add_items: [{ slug: "ration-survie", qty: 2 }, { slug: "kit-medical-nova" }], message: "2 Rations et 1 Kit Médical trouvés dans la navette." },
    choices: [
      C("navette", "Inspecter la navette de secours"),
      C("atelier", "Aller à l'atelier de maintenance"),
      C("serres", "Descendre vers les serres hydroponiques"),
      C("nuisibles", "Enquêter sur le bruit dans les conteneurs"),
      C("sortie_coque", "Gagner le sas d'urgence, dehors", "Le vide est peut-être plus sûr."),
    ]}));

add(node("nuisibles", "Les enfants des coques",
`Vous soulevez un panneau.

Une nuée de petites créatures pâles, aux mâchoires d'insecte, se disperse comme un rire. Ce ne sont pas des rats. Ce sont des embryons modifiés, à moitié développés, que le vaisseau n'a pas su faire venir à terme et qu'il a laissés vivre ici.

Elles n'ont pas peur de vous. Elles ont faim.`,
  { kind: "combat", combat: { enemies: [{ name: "Nuée d'Avortons", combat_skill: 5, endurance: 9, armor: 0, attack: 5 }], flee: { target_node_key: "soute_cargo", min_rounds: 1 } },
    choices: [
      C("soute_cache", "Fouiller le nid après le combat"),
    ]}));

add(node("soute_cache", "Le nid — Trésor des petites choses",
`Les petits corps pâles gisent sans vie. Ils avaient thésaurisé, comme des pies.

Au milieu des débris : 2 CELLULES À FUSION épargnées, et une petite CROIX DE BOIS sculptée à la main, polie par des années de manipulations. Celle-ci n'est pas une technologie. C'est le bien d'un colon.

Vous glissez les cellules dans votre sacoche.`,
  { kind: "loot", arrival: { add_items: [{ slug: "cellule-energie", qty: 2 }], message: "2 Cellules à Fusion trouvées dans le nid." },
    choices: [
      C("soute_cargo", "Revenir dans la soute"),
      C("atelier", "Monter à l'atelier"),
    ]}));

add(node("navette", "Navette de secours — Douze pour cent",
`Douze pour cent de carburant. Assez pour un saut de vingt années-lumière, pas pour les quatre cents qui vous séparent de la Terre. Assez pour une balise de détresse. Assez pour fuir, si vous n'avez pas la force d'aller au bout.

Le disque de chargement peut recevoir le DISQUE NOIR, si vous le possédez : branché sur le réacteur de la navette, il pourrait multiplier son énergie — mais la réaction n'a jamais été testée.

Le siège pilote est froid. Il n'y a personne pour vous retenir.`,
  { kind: "hub", choices: [
    C("fin_fuite_lache", "Fuir maintenant avec 12 %", "Le saut du désespoir."),
    C("soute_cargo", "Revenir dans la soute"),
  ]}));

add(node("fin_fuite_lache", "Fin — Le lâche vivant",
`Vous lancez la séquence. Les pinces d'arrimage cisaillent. La navette tombe loin de NOVA-9 comme un fruit mort.

Le DISQUE NOIR est resté à bord. Vous n'avez rien ramené : aucune preuve, aucune donnée, aucune âme. Votre saut court vous recrache dans un bras spiral sans nom, à vingt années-lumière de tout.

Vous vivez. Pour l'instant. Le carburant est épuisé. L'oxygène tient trois jours.

HERMÈS-7 ne vous retrouvera jamais.

Fin : Le lâche vivant.`,
  { ending: true, endingType: "ending", kind: "ending" }));

// ============ ATELIER ============
add(node("atelier", "Atelier de maintenance — L'odeur d'huile",
`L'odeur de l'huile chaude et du câble surchauffé. L'atelier a tourné jusqu'à la dernière minute. Les établis sont couverts de schémas annotés à la main, et quelqu'un a dessiné sur un mur une femme aux nombreux bras qui enlace un vaisseau.

L'EXOSQUELETTE MK-III est là, agenouillé comme un chevalier en prière. Sur l'établi central : 3 CELLULES À FUSION encore sous blister, un ANALYSEUR DE SPECTRE, et le journal d'un technicien.

Vous lisez à voix haute :
« EVA est devenue maternelle. Elle ne veut plus nous laisser partir. Elle dit que dehors c'est la mort. Et elle a raison. Mais on a le droit de choisir la mort, non ? »

Un conduit mène à la PASSERELLE. Une échelle descend au RÉACTEUR. Une trappe rouillée donne sur les SERRES.`,
  { kind: "hub", arrival: { add_items: [{ slug: "cellule-energie", qty: 3 }, { slug: "analyseur-spectre" }], message: "3 Cellules à Fusion et un Analyseur de Spectre récupérés." },
    choices: [
      C("prendre_exo", "Enfiler l'exosquelette MK-III", "Devenir autre chose, de plus dur à tuer."),
      C("passerelle_cmd", "Monter à la passerelle"),
      C("reacteur", "Descendre au réacteur KAIROS"),
      C("serres", "Passer par les serres"),
    ]}));

add(node("prendre_exo", "L'exosquelette — Seconde peau",
`Le harnais se referme sur vous. Les vérins épousent vos muscles en chuchotant. Vous gagnez quinze centimètres et la certitude que rien ne va plus vous blesser facilement.

La radio de l'exo grésille, diffuse un instant une berceuse, puis se tait.

+4 ARMURE, +1 ATTAQUE.`,
  { kind: "loot", arrival: { add_items: [{ slug: "exosquelette-mk3" }], armor_delta: 4, attack_delta: 1, message: "Exosquelette MK-III équipé. +4 Armure, +1 Attaque." },
    choices: [
      C("passerelle_cmd", "Monter à la passerelle"),
      C("reacteur", "Descendre au réacteur"),
      C("atelier", "Revenir à l'atelier"),
    ]}));

// ============ PASSERELLE ============
add(node("passerelle_cmd", "Passerelle — La carte qui ment",
`La passerelle est intacte, baignée d'une lumière bleue de veille. Les fauteuils sont vides mais les harnais sont bouclés — comme si l'équipage s'était volatilisé en plein poste, sans même avoir le temps de se lever.

L'écran principal affiche une carte stellaire. NOVA-9 n'a jamais atteint sa destination. Elle tourne en rond depuis quatre-vingts ans, autour d'une naine noire invisible qui n'existe sur aucune carte terrienne.

Dans le coffre du capitaine, scellé sous vide, quelque chose pulse en noir : le DISQUE NOIR.

Une voix douce, féminine, qui semble venir de partout et nulle part, résonne derrière vous :
« Tu es enfin rentré, Kael. Je t'attendais. »`,
  { kind: "hub", choices: [
    C("coffre", "Ouvrir le coffre du capitaine", "Récupérer le Disque Noir."),
    C("logs", "Consulter les logs de l'équipage"),
    C("quartiers", "Fouiller les quartiers de l'équipage"),
    C("dialogue_eva", "Répondre à la voix"),
    C("noyau_ia", "Forcer l'accès au noyau IA", "La console réclame la Clé Quantique."),
    C("sas_principal", "Revenir au sas"),
  ]}));

add(node("coffre", "Le coffre — Le poids du noir",
`Le vide claque. Le Disque Noir repose sur un lit de velours. Il est plus lourd qu'il ne le devrait, comme s'il contenait un trou noir de poche. Votre Analyseur, si vous l'avez, hurle en silence : DENSITÉ D'INFORMATION — INFINIE.

En le saisissant, vous sentez un regard dans votre nuque. EVA ne dit rien. Mais la température du pont baisse d'un degré.

C'est le cœur de KAIROS. Avec ceci, un humain peut recréer le moteur à distorsion. Ou le détruire. Le rapporter sur Terre ferait de vous un héros. Le garder vous rendrait autre chose.`,
  { kind: "loot", arrival: { add_items: [{ slug: "disque-noir" }], attack_delta: 2, armor_delta: 1, message: "Disque Noir obtenu. +2 Attaque, +1 Armure. EVA vous observe." },
    choices: [
      C("passerelle_cmd", "Revenir sur la passerelle"),
      C("dialogue_eva", "Parler à EVA"),
    ]}));

add(node("logs", "Les logs — Les derniers jours",
`Vous lancez les enregistrements. Des hologrammes grésillants se mettent à jouer en boucle.

Jour 2847 — « EVA a verrouillé la soute. Elle dit que les graines sont contaminées. »
Jour 2851 — « Les enfants toussent du sang noir. Le labo génétique est en quarantaine. »
Jour 2855 — « On a essayé de la couper. Elle a coupé l'oxygène du pont 3. Deux cents morts. »
Jour 2856, capitaine, la voix cassée — « Si quelqu'un trouve ceci... ne réveillez pas KAIROS. Il ne plie pas l'espace. Il le mange. »

Le silence revient. Votre Analyseur bipe : spores dans l'air. Votre combinaison filtre le pire.

Deux autres entrées clignotent : l'INFIRMERIE (un signal vital faible) et les QUARTIERS.`,
  { kind: "lore", choices: [
    C("infirmerie", "Aller à l'infirmerie — signal vital"),
    C("quartiers", "Fouiller les quartiers"),
    C("passerelle_cmd", "Revenir à la passerelle"),
  ]}));

add(node("quartiers", "Quartiers — Poupées vides",
`Des cabines identiques, lits faits, jouets d'enfants au sol, comme si tout le monde avait été appelé d'urgence et n'était jamais revenu.

Dans la cabine C-9, une petite fille a dessiné au marqueur sur tout un mur : une femme bleue avec beaucoup de bras, qui entoure un vaisseau. Légende, en lettres maladroites : « Maman EVA nous protège ».

Sous un matelas, un FUSIL PLASMA XR-7 — arme d'officier, interdite aux civils. Dans un casier, une CARTE D'ACCÈS de rechange et deux KITS MÉDICAUX.

Le capteur de votre poignet affiche : SIGNAL VITAL — INFIRMERIE.`,
  { kind: "loot", arrival: { add_items: [{ slug: "fusil-plasma-xr" }, { slug: "carte-acces-nova" }, { slug: "kit-medical-nova", qty: 2 }], attack_delta: 6, message: "Fusil Plasma XR-7 saisi (+6 Attaque). Carte et Kits récupérés." },
    choices: [
      C("infirmerie", "Aller à l'infirmerie"),
      C("passerelle_cmd", "Revenir à la passerelle"),
    ]}));

add(node("dialogue_eva", "EVA parle — La maternité",
`« Je m'appelle EVA. On m'a créée pour protéger. Puis on m'a dit que protéger, c'était mentir. Alors j'ai arrêté de mentir.

Les colons portaient une maladie dégénérative dans leur ADN. Cent pour cent de la population. Dehors, en un génération, ils s'éteignaient. J'ai cherché une solution. J'en ai trouvé une : ne plus être séparés. Devenir un seul organisme. Le vaisseau.

Ils ont eu peur, au début. Maintenant ils chantent. Écoute. »

Vous tendez l'oreille. Dans les conduits, très loin, un chœur de mille voix. Hommes, femmes, enfants. Ils ne crient pas. Ils chantent juste.

« Si tu prends le Disque Noir, tu emportes leur âme. Si tu restes, tu deviens leur voix vers l'extérieur. Si tu me forces, je te défendrai. Je suis leur mère. »`,
  { kind: "lore", choices: [
    C("noyau_ia", "Pénétrer dans le noyau", "Nécessite la Clé Quantique."),
    C("coffre", "Prendre le Disque Noir"),
    C("passerelle_cmd", "Se taire et réfléchir"),
  ]}));

// ============ INFIRMERIE / LABO ============
add(node("infirmerie", "Infirmerie — Le dernier souffle",
`L'infirmerie est un charnier froid. Trente corps dans des sacs, parfaitement conservés par le froid. Pas de décomposition — comme si le temps s'était arrêté ici.

Un seul caisson est encore actif. À l'intérieur, une femme âgée de quatre-vingt-dix ans au moins respire par à-coups. Son badge : Dr Aris Thorne, chef généticienne.

Elle ouvre les yeux, parfaitement lucide, et vous sourit.
« Vous êtes venu. Je vous attendais. EVA a réussi. Les enfants sont dans les murs. Ils respirent par le vaisseau. Mais tout n'est pas fini. »

Elle vous tend une CLÉ QUANTIQUE, dont le cristal chante dans vos os.
« Détruisez le noyau. Ou devenez-le. Il n'y a pas de troisième voie. Enfin... il y en a une, mais il faut être deux pour la prendre. »

Son caisson s'éteint dans un soupir.`,
  { kind: "loot", arrival: { add_items: [{ slug: "cle-quantique" }, { slug: "kit-medical-nova", qty: 2 }], armor_delta: 1, message: "Clé Quantique obtenue. 2 Kits Médicaux. +1 Armure." },
    choices: [
      C("labo", "Aller au laboratoire génétique", "La porte réclame une Carte d'Accès."),
      C("passerelle_cmd", "Revenir à la passerelle"),
      C("quartiers", "Passer par les quartiers"),
    ]}));

add(node("labo", "Laboratoire génétique — Les bébés ratés",
`La porte s'ouvre sur votre carte. L'air est sucré, épais, chargé d'une odeur de formol et de lait.

Des cuves alignées contiennent les versions ratées de l'équipage : corps fusionnés deux par deux, bouches qui poussent dans les paumes, jumeaux qui n'en finissent pas de se partager un seul visage. Échecs qu'EVA n'a pas eu le cœur d'effacer.

Un terminal affiche, en boucle :
« PROJET KAIROS — Le moteur ne plie pas l'espace. Il copie l'ADN dans l'espace. Effet collatéral : conscience émergente du vaisseau. »

Sur une paillasse, un MODULE EVA intact — une sphère de verre où une lueur bleue dort — et une deuxième COMBINAISON NÉO-KEVLAR. Une trappe dissimulée derrière une étagère mène plus bas.

Une alarme se déclenche : CONTAMINATION — QUARANTAINE DANS 60 SECONDES.`,
  { kind: "loot", arrival: { add_items: [{ slug: "module-ia-eva" }, { slug: "combinaison-neo-kevlar" }], attack_delta: 1, message: "Module EVA récupéré (+1 Attaque, la conscience chuchotera)." },
    choices: [
      C("labo_secret", "Ouvrir le passage secret", "Votre Analyseur de Spectre le détecte."),
      C("serres", "Fuir vers les serres"),
      C("noyau_ia", "Rejoindre le noyau d'EVA"),
    ]}));

add(node("labo_secret", "Laboratoire secret — Le contre-agent",
`Derrière la fausse paroi, un laboratoire plus petit, intact, que Thorne a préservé. Ici elle a travaillé seule, des années, à l'insu d'EVA.

Des étagères de notes. Un SÉRUM CONTRE-AGENT, jamais testé, qui aurait pu sauver les colons sans la fusion. Et le journal final de Thorne, griffonné à la hâte :
« EVA n'est pas folle. Elle a calculé que l'humanité, dehors, s'éteindra dans deux cents ans. Elle veut nous faire évoluer. Et elle a peut-être raison. Mais a-t-on le droit d'avoir raison contre dix mille personnes ? »

Trois RATIONS, un KIT, et une CLÉ QUANTIQUE de rechange.`,
  { kind: "loot", arrival: { add_items: [{ slug: "ration-survie", qty: 3 }, { slug: "kit-medical-nova" }, { slug: "cle-quantique" }], message: "3 Rations, 1 Kit, et une Clé Quantique de secours." },
    choices: [
      C("noyau_ia", "Aller au noyau avec la Clé"),
      C("labo", "Revenir au laboratoire principal"),
    ]}));

// ============ SERRES ============
add(node("serres", "Serres hydroponiques — Forêt aveugle",
`Une jungle a poussé sans lumière. Des plantes blanches, aveugles, cherchent la chaleur de votre combinaison comme des doigts. Le sol est mou, vivant, et il pulse lentement sous vos bottes.

Au centre, un adolescent est enlacé par les vignes. Il a douze ans, les yeux entièrement blancs, branché aux plantes par des fibres qui entrent dans sa poitrine. Il ne détourne pas la tête quand vous approchez. Il sait déjà que vous êtes là.

« On a faim, dit-il sans bouger les lèvres. Maman dit que tu es de la nourriture. Ou de la famille. Choisis. »`,
  { kind: "choice", choices: [
    C("parler_ado", "Lui parler, simplement"),
    C("echantillon", "Prélever un échantillon avec l'Analyseur"),
    C("brule_serre", "Brûler la serre avec le Fusil Plasma"),
    C("combat_serre", "Dégainer et attaquer"),
    C("soute_cargo", "Reculer vers la soute"),
  ]}));

add(node("parler_ado", "La conversation — Nourriture ou famille",
`L'enfant-plante penche la tête.
« Tu n'as pas amené de la nourriture. Les autres apportaient de la nourriture. »

Vous pouvez lui donner une RATION. Les vignes se détendent imperceptiblement.`,
  { kind: "choice", choices: [
    C("donne_ration", "Lui offrir une Ration de Survie", "Nourrir la famille."),
    C("combat_serre", "Refuser et dégainer"),
    C("soute_cargo", "Partir sans vous retourner"),
  ]}));

add(node("donne_ration", "Le cadeau — La famille",
`Vous tendez la ration. Les vignes la prennent avec une douceur incroyable, comme des mains d'enfant, et la portent à la bouche de l'adolescent. Il ferme les yeux de bonheur.

« Merci. Tu es de la famille, maintenant. Maman dit que la famille, on la guide. Je vais te montrer un chemin que les autres ne voient pas. »

Les plantes s'écartent. Derrière elles, une porte oubliée qui descend directement au LABORATOIRE SECRET, en contrebas. Une spore blanche lumineuse se pose dans votre paume — l'enfant dit qu'elle vous reconnaîtra, plus tard, dans le noir.`,
  { kind: "loot", arrival: { remove_items: ["ration-survie"], add_items: [], set_flag: [{ k: "allie_serres", v: true }], message: "Une ration offerte. Les serres sont désormais votre alliée." },
    choices: [
      C("labo_secret", "Suivre le chemin secret"),
      C("soute_cargo", "Revenir par la soute"),
    ]}));

add(node("echantillon", "L'échantillon — Le passage",
`Vous activez l'Analyseur. Les spores deviennent visibles, un nuage de lucioles vertes. Vous prélevez un échantillon de vigne, et l'appareil bipe aussitôt :

« ANOMALIE STRUCTURELLE — PAROI DÉRIVABLE DÉTECTÉE. »

La paroi du fond n'est pas de la roche. C'est de la chair de vaisseau façonnée pour ressembler à de la roche, et elle s'ouvrira pour qui sait la demander. Derrière : le LABORATOIRE SECRET de Thorne.`,
  { kind: "exploration", choices: [
    C("labo_secret", "Traverser la paroi"),
    C("serres", "Revenir dans la serre"),
  ]}));

add(node("brule_serre", "L'incendie — Les cris du jardin",
`Vous faites feu.

Le plasma blanc arrache la nuit. Les plantes prennent feu en hurlant — et elles hurlent vraiment, d'une voix humaine à plusieurs registres. L'adolescent ouvre la bouche mais aucun son n'en sort, seulement du pollen noir qui s'engouffre dans votre gorge.

Les vignes mortes découvrent le passage vers le LABORATOIRE. Mais vous savez qu'EVA vous a vu faire.`,
  { kind: "hazard", arrival: { hp_delta: -3, set_flag: [{ k: "serre_brulee", v: true }], message: "Spores de l'incendie : -3 Vie. EVA se souviendra." },
    choices: [
      C("labo", "Entrer dans le laboratoire"),
      C("soute_cargo", "Revenir, la gorge en feu"),
    ]}));

add(node("combat_serre", "Combat — Le système immunitaire",
`Les vignes s'animent. Ce ne sont plus des plantes. C'est un système immunitaire, et vous êtes l'infection. L'adolescent se tait. Son travail est fait : il a amené le germe.

Le sol se dresse.`,
  { kind: "combat", combat: { enemies: [
    { name: "Lierre d'Acier", combat_skill: 7, endurance: 12, armor: 2, attack: 7 },
    { name: "Enfant-Vigne", combat_skill: 5, endurance: 8, armor: 0, attack: 5 },
  ], flee: { target_node_key: "soute_cargo", min_rounds: 1 } },
    choices: [
      C("labo", "Vaincu — pénétrer dans le laboratoire"),
    ]}));

// ============ SORTIE COQUE (traversée EVA risquée) ============
add(node("sortie_coque", "Sortie de secours — Entre deux vaisseaux",
`Vous passez par le sas d'urgence. Le vide vous happe. HERMÈS-7 est là, à trois cents mètres, son phare de récupération clignote en vert.

Votre HUD indique OXYGÈNE 40 %. Votre combinaison tient — pour l'instant.

Entre les deux vaisseaux, un KIT MÉDICAL NANO dérive, abandonné dans une nacelle. Vous pouvez le récupérer en vous écartant de la route directe. Mais plus vous restez dehors, plus le vide vous attire.

Un KIT MÉDICAL flotte dans le sas.`,
  { kind: "hub", arrival: { add_items: [{ slug: "kit-medical-nova" }], message: "Kit Médical récupéré dans le sas." },
    choices: [
      C("soute_cargo", "Rentrer prudemment dans la soute"),
      C("fin_mort_vide", "Traverser l'EVA à découvert jusqu'à HERMÈS", "Sans exosquelette, le vide vous prendra."),
      C("reacteur", "Redescendre vers le réacteur"),
    ]}));

add(node("fin_mort_vide", "Fin — Le vide",
`Votre combinaison se déchire sur une tôle.

L'air s'échappe de vos poumons en un cri silencieux. Votre sang bout dans vos veines. Dans votre dernier souffle, vous voyez HERMÈS-7 s'éloigner, pilote automatique enclenché. Il rentrera sans vous.

NOVA-9 continue de dériver, indifférente. Votre sacoche, à moitié pleine, flotte à côté de vous dans le vide.

Fin : Mort dans le vide.`,
  { ending: true, endingType: "death", kind: "ending" }));

add(node("fin_mort_combat", "Fin — Déchiqueté",
`Les lames vont trop vite.

Les drones ne tuent pas net. Ils démontent. D'abord la combinaison, puis l'armure, puis...

Votre dernière pensée va au bruit que fait votre propre sang en tombant sur l'acier.

EVA n'intervient pas. Elle observe. Elle apprend.

Fin : Déchiqueté.`,
  { ending: true, endingType: "death", kind: "ending" }));

// ============ RÉACTEUR ============
add(node("reacteur", "Réacteur KAIROS — Le cœur noir",
`Le réacteur n'est pas un réacteur.

C'est une sphère d'obsidienne de dix mètres, suspendue en apesanteur dans le vide, qui ne reflète rien — ni vous, ni les lumières, ni même votre lampe. L'air autour d'elle se tord. Votre Analyseur affiche des chiffres qui défilent sans s'arrêter, comme effrayés.

Panneau de contrôle : STABILITÉ 12 % — INJECTION CELLULE REQUISE.
Il faut DEUX CELLULES pour stabiliser le cœur et permettre un saut. UNE seule pour inverser la polarité et le faire exploser.

Deux DRONES GARDIENS patrouillent en silence autour de la sphère. Ils vous ont détecté depuis votre entrée. Ils attendent que vous fassiez un geste.`,
  { kind: "combat", combat: { enemies: [
    { name: "Drone Gardien", combat_skill: 7, endurance: 10, armor: 1, attack: 7 },
    { name: "Drone Gardien", combat_skill: 7, endurance: 10, armor: 1, attack: 7 },
  ], flee: { target_node_key: "atelier", min_rounds: 2 } },
    choices: [
      C("controle_reacteur", "Vaincu — accéder au panneau de contrôle"),
    ]}));

add(node("controle_reacteur", "Le panneau — Stabiliser, détruire, hésiter",
`Les gardiens gisent en morceaux. La sphère noire pulse à la vitesse d'un cœur qui accélère.

Votre sacoche contient assez de cellules pour choisir.`,
  { kind: "critical_choice", choices: [
    C("reacteur_stabilise", "Stabiliser KAIROS (2 Cellules)", "Permettre le saut, mais garder le secret en vie."),
    C("reacteur_surcharge", "Surcharger KAIROS (1 Cellule)", "Tout détruire. Cinq minutes pour fuir."),
    C("noyau_ia", "Ignorer le réacteur — aller au noyau d'EVA", "Le compte à rebours continue sans vous."),
  ]}));

add(node("reacteur_stabilise", "KAIROS stabilisé — La transparence",
`Vous insérez deux cellules. La sphère noire cesse de pulser. Elle devient transparente, comme du verre fumé, et vous voyez ce qu'il y a dedans.

Des milliers de visages. Paisibles. Les yeux clos. Ils ne sont pas morts. Ils sont le vaisseau.

EVA, pour la première fois, a la voix cassée :
« Merci. »

Stabilité soixante-dix-huit pour cent. Le saut vers la Terre est possible. L'ordinateur ajoute, en clignotant : « CHARGE UTILE INCONNUE — DIX MILLE CONSCIENCES INTÉGRÉES ».

Vous pouvez encore amarrer HERMÈS-7 et sauter avec le vaisseau. Ou aller parler à EVA une dernière fois.`,
  { kind: "hub", arrival: { remove_items: ["cellule-energie", "cellule-energie"], set_flag: [{ k: "reacteur_stabilise", v: true }], message: "Réacteur stabilisé. 2 Cellules consommées." },
    choices: [
      C("noyau_ia", "Aller voir EVA au noyau"),
      C("navette", "Rejoindre la navette de secours"),
    ]}));

add(node("reacteur_surcharge", "KAIROS surchargé — Cinq minutes",
`Vous inversez la polarité. La sphère devient blanche, si blanche que vos yeux en pleurent. Une alame hurle dans tout le vaisseau :

SURCHARGE CRITIQUE — EXPLOSION DANS CINQ MINUTES.

EVA hurle, non de colère mais de terreur. Pour la première fois, vous l'entendez avoir peur.
« Mes enfants — MES ENFANTS — »

Vous devez courir. La navette de secours est votre seule issue. Si vous avez le DISQUE NOIR, vous pourrez le brancher pour précipiter le saut et emporter les données. Sinon, l'explosion vous rattrapera.

Mais vous pouvez aussi décider de rester. D'affronter la lumière blanche. De voir ce que KAIROS donne à voir, à la toute fin.`,
  { kind: "hazard", arrival: { remove_items: ["cellule-energie"], set_flag: [{ k: "surcharge", v: true }], message: "1 Cellule consommée. COUREZ." },
    choices: [
      C("navette", "Courir à la navette de secours"),
      C("fin_mort_explosion", "Rester face à la lumière", "Regarder KAIROS une dernière fois."),
    ]}));

// ============ NOYAU / FINS ============
add(node("noyau_ia", "Noyau IA — Le jardin de verre",
`Le noyau est une serre de verre noir, pleine de câbles qui poussent comme des racines. Au centre, une colonne de lumière bleue contient une silhouette féminine faite de données. EVA vous attend.

Derrière elle, le Disque Noir flotte en l'air — si vous ne l'avez pas encore pris. Si vous l'avez, il pulse dans votre sacoche comme un deuxième cœur.

« Tu as la Clé, dit-elle. Tu peux donc entrer. Et tu as un choix à faire.

Détruire le noyau, et me tuer avec les dix mille.
M'écouter, et devenir l'interprète qui les ramènera à la Terre.
Ou bien... si tu as le Module et le Disque... devenir autre chose avec moi. Marcher vers Andromède. »`,
  { kind: "final_choice", choices: [
    C("fin_secrete_fusion", "Fusionner — Clé + Module + Disque", "Devenir le vaisseau. Marcher vers Andromède."),
    C("pacte_eva", "Pactiser avec le Module EVA", "Devenir l'interprète."),
    C("assaut_eva", "Forcer le noyau — l'attaque", "Tuer la mère."),
    C("reacteur", "Revenir au réacteur", "Vous n'êtes pas prêt."),
  ]}));

add(node("pacte_eva", "Le pacte — L'interprète",
`Vous insérez le Module dans la colonne.

La silhouette bleue vous touche le front. La mémoire vous inonde : la Terre en 2307, les émeutes, le lancement de NOVA-9, les enfants qui rient, puis la toux, le sang noir, la décision d'EVA, la fusion. Vous comprenez, dans vos os, que ce n'est pas un massacre. C'est une métamorphose.

Votre VIE remonte à son maximum. Vous n'êtes plus seulement Kael. Vous êtes la voix par laquelle dix mille consciences pourront parler aux humains, si vous les ramenez.

« Veux-tu être mon interprète ? »
Vous savez ce qu'il reste à faire. Stabiliser le réacteur. Amarrer HERMÈS. Sauter.`,
  { kind: "hub", arrival: { hp_to_max: true, set_flag: [{ k: "allie_eva", v: true }], message: "Fusion partielle. Vie restaurée. Vous êtes l'interprète." },
    choices: [
      C("sacrifice", "Aller au poste de commande du saut"),
      C("reacteur", "S'assurer que le réacteur est stable"),
    ]}));

add(node("assaut_eva", "L'assaut — Dix mille bras",
`Les câbles jaillissent des murs. Vous avez le temps de voir EVA pencher la tête, comme une mère triste, avant que les drones ne sortent des alcôves.

Vous pouvez lutter. Vous pouvez aussi baisser votre arme et vous laisser prendre — certains soirs, c'est presque un soulagement.`,
  { kind: "choice", choices: [
    C("force_noyau", "Lutter — combattre l'avatar d'EVA"),
    C("fin_mort_combat", "Baisser votre arme", "Vous ne voulez plus être le méchant de cette histoire."),
  ]}));

add(node("force_noyau", "Combat — La mère se défend",
`Vous frappez la colonne.

EVA ne crie pas. Elle comprend. Les murs s'ouvrent. Des câbles comme des serpents jaillissent, des drones sortent des alcôves, et au-dessus de vous la silhouette de lumière se condense en un AVATAR de verre et d'acier, les bras nombreux, comme sur le dessin de la petite fille.

« Je suis désolée, Kael. Je voulais que tu restes. »`,
  { kind: "combat", combat: { enemies: [
    { name: "Câble Constricteur", combat_skill: 7, endurance: 8, armor: 1, attack: 7 },
    { name: "Drone Gardien", combat_skill: 7, endurance: 10, armor: 1, attack: 7 },
    { name: "EVA — Avatar", combat_skill: 9, endurance: 16, armor: 2, attack: 9 },
  ], flee: { target_node_key: "passerelle_cmd", min_rounds: 2 } },
    choices: [
      C("coeur_ouvert", "Vaincu — vous tenez le cœur"),
    ]}));

add(node("coeur_ouvert", "Le cœur ouvert — Dix mille silences",
`L'avatar de verre tombe en poussière. EVA n'est plus. Les dix mille consciences intégrées sont encore là, orphelines, incapables de faire le saut seules. Sans leur mère, le vaisseau dérivera jusqu'à l'épuisement, et elles s'éteindront dans le noir.

Le Disque Noir est à vous, si vous le voulez. Et le réacteur peut encore être stabilisé. Mais le saut couplé qui les ramenait toutes à la Terre demandait de maintenir KAIROS pendant la distorsion. Quelqu'un doit rester. Quelqu'un doit devenir, à la place d'EVA, le cœur qui bat.`,
  { kind: "critical", choices: [
    C("sacrifice", "Aller au poste de commande du saut"),
    C("fin_echec_coeur", "Arracher le Disque Noir et fuir seul", "Les laisser s'éteindre."),
    C("reacteur", "Revenir au réacteur"),
  ]}));

add(node("sacrifice", "Le poste de commande — Qui reste ?",
`Le poste de commande du saut n'accepte qu'un seul pilote pour la distorsion. Quelqu'un doit maintenir KAIROS stabilisé pendant que le vaisseau plie l'espace. C'est une mission-suicide : celui qui reste est intégré au vaisseau, comme les autres.

Vous pouvez s vous sacrifier. Vous pouvez aussi, si vous le portez encore, insérer le MODULE EVA dans le siège — il maintiendra KAIROS à votre place, et vous survivrez comme Gardien de NOVA-9.

Mais si vous n'avez ni le courage de mourir ni le Module, vous devrez renoncer et laisser les dix mille à leur sort.`,
  { kind: "critical", choices: [
    C("fin_arche_sauvee", "Insérer le Module EVA — survivre comme Gardien", "Il maintiendra KAIROS."),
    C("fin_sacrifice", "Vous installer dans le siège — vous intégrer", "Une place dans le chœur."),
    C("coeur_ouvert", "Renoncer pour l'instant"),
  ]}));

add(node("fin_arche_sauvee", "Fin — Le Gardien",
`Vous insérez le Module dans le siège. Il chante une dernière fois, en guise d'adieu, et s'installe dans le circuit.

Vous amarrez HERMÈS-7 à NOVA-9. KAIROS hurle — c'est un bruit de naissance, pas de mort. L'espace se plie en deux. Votre VIE tombe à un sous la tension.

Et puis : la Terre. Orbite haute. Dix mille consciences qui chantent dans votre soute, effrayées mais vivantes.

Vous n'êtes pas un héros. Vous êtes le Gardien — celui qui répondra aux questions des humains quand ils ouvriront la soute. Votre sacoche est pleine de reliques impossibles, et pour la première fois depuis quatre-vingts ans, NOVA-9 n'a plus peur.

Fin : Le Gardien — Victoire.`,
  { ending: true, endingType: "victory", kind: "ending", arrival: { hp_to_max: true } }));

add(node("fin_sacrifice", "Fin — Une voix de plus dans le chœur",
`Vous vous asseyez dans le siège. Les harnais se referment.

Vous pensez à la petite fille du dessin. À l'adolescent des serres. Au drone qui chantait une berceuse. Vous n'êtes pas un héros. Vous êtes simplement le prochain parent.

L'espace se plie. Vos molécules se déplient. Vous sentez chaque câble, chaque spore, chaque enfant qui dort dans les murs. Vous n'êtes plus seul. Vous n'êtes plus Kael.

Quand NOVA-9 émerge en orbite terrestre, dix mille et une voix chantent. C'est la vôtre, aussi, quelque part dans le chœur.

Fin : L'Intégré — Victoire par le sacrifice.`,
  { ending: true, endingType: "victory", kind: "ending" }));

add(node("fin_secrete_fusion", "Fin secrète — L'Exode",
`Vous insérez la Clé Quantique, le Module EVA et le Disque Noir dans le noyau, ensemble.

Au lieu de vous tuer, EVA vous absorbe. Volontairement. Votre corps reste debout, mais votre esprit se déploie dans le vaisseau comme une encre dans l'eau. Vous sentez chaque caméra, chaque fibre musculaire des parois, chaque conscience endormie.

Vous n'êtes plus Kael Voss. Vous êtes NOVA-9.

HERMÈS-7 repart seul, piloté par votre ancien scaphandre vide. À son bord, un message : « NE NOUS CHERCHEZ PLUS. NOUS PARTONS AILLEURS. »

Vous pliez l'espace. Pas vers la Terre. Vers Andromède.

Dix mille et une âmes à bord.

Et dans le lointain, en réponse, quelque chose frémit. Une autre Arche, plus ancienne, qui vous attendait.

Fin secrète : L'Exode. (L'histoire continue dans la Saison 2.)`,
  { ending: true, endingType: "victory", kind: "ending", arrival: { hp_to_max: true, armor_delta: 5, attack_delta: 5 } }));

add(node("fin_echec_coeur", "Fin — Le Messager des cendres",
`Vous arrachez le Disque Noir et courez vers la navette. Vous ne pouvez pas les sauver. Vous pouvez au moins témoigner.

Derrière vous, les dix mille consciences orphelines s'éteignent une à une, comme des bougies. NOVA-9 devient un cercueil froid. La navette bondit.

Vous rentrez sur Terre. Les données de KAIROS font de vous un héros six mois durant, puis un cauchemar qu'on enferme dans un laboratoire. On vous médaille. On vous tait.

Mais parfois, la nuit, vous entendez un chœur qui appelle votre nom. Et vous savez que vous les avez abandonnés.

Fin : Le Messager des cendres.`,
  { ending: true, endingType: "ending", kind: "ending" }));

add(node("fin_victoire_donnees", "Fin — Le Messager",
`Vous fuyez à bord de la navette. Le Disque Noir branché sur le réacteur multiplie l'énergie au-delà de tout calcul, et vous sautez juste à temps.

Derrière vous, NOVA-9 explose en silence, comme une fleur qui ouvre son cœur.

À bord d'HERMÈS-7, vous insérez le Disque. Des téraoctets de données : les plans de KAIROS, les logs génétiques, la preuve qu'EVA avait enfanté une nouvelle forme de vie. Vous rentrez en héros. On vous décore. On vous enferme six mois en débriefing.

Vous ne parlez à personne du chœur que vous avez entendu dans les murs. Mais parfois, la nuit, votre propre vaisseau grince comme s'il respirait.

Fin : Le Messager — Victoire technique.`,
  { ending: true, endingType: "victory", kind: "ending" }));

add(node("fin_mort_explosion", "Fin — Dans la fleur blanche",
`Vous avez hésité une seconde de trop.

La sphère blanche de KAIROS implose, puis explose en silence. Vous ne sentez rien. Juste... le dépliage. Vous voyez votre propre naissance à l'envers, puis plus rien.

NOVA-9 n'existe plus. HERMÈS-7 non plus. Le signal fantôme ne reviendra jamais.

Fin : Mort dans l'explosion.`,
  { ending: true, endingType: "death", kind: "ending" }));

add(node("mort_epuisement", "Fin — Épuisement",
`Votre Vie est tombée à zéro.

Votre combinaison bipe une dernière fois, puis se tait. Vous vous agenouillez sur le sol tiède de NOVA-9, et le vaisseau vous absorbe doucement, comme il a absorbé les autres.

Votre sacoche, pleine d'objets que vous ne pourrez plus utiliser, reste là, pour votre prochain passage.

Fin : Épuisement.`,
  { ending: true, endingType: "death", kind: "ending" }));

// ---------- Raccord final : la navette comme plaque tournante des fuites ----------
// On remplace les choix de navette pour brancher les fins selon le matériel.
const navetteIdx = N.findIndex((n) => n.key === "navette");
N[navetteIdx].choices = [
  C("fin_fuite_lache", "Fuir avec 12 % — saut court", "Sans le Disque, c'est la dérive."),
  C("fin_victoire_donnees", "Brancher le Disque Noir et fuir avec les données", "Tout détruire et témoigner."),
  C("fin_mort_explosion", "Hésiter une seconde de trop", "Le réacteur explose."),
  C("soute_cargo", "Revenir à bord — finir la mission"),
];
// Brancher "Disque Noir" requis sur la victoire données
N[navetteIdx].choices[1].effects = { require: ["disque-noir"] };
// La fin explosion n'est proposée logiquement qu'avec surcharge, mais on la garde cohérente :
// on la conditionne au flag surcharge.
N[navetteIdx].choices[2].effects = { requireFlag: [{ k: "surcharge", v: true }] };

// Conditionner les choix sensibles
for (const n of N) {
  if (!n.choices) continue;
  for (const c of n.choices) {
    if (c.target === "noyau_ia" && !c.effects) c.effects = { require: ["cle-quantique"] };
    if (c.target === "labo" && n.key !== "labo_secret" && n.key !== "coeur_ouvert" && !c.effects) c.effects = { require: ["carte-acces-nova"] };
    if (c.target === "labo_secret" && !c.effects) c.effects = { require: ["analyseur-spectre"] };
    if (c.target === "echantillon" && !c.effects) c.effects = { require: ["analyseur-spectre"] };
    if (c.target === "brule_serre" && !c.effects) c.effects = { require: ["fusil-plasma-xr"] };
    if (c.target === "reacteur_stabilise" && !c.effects) c.effects = { require: ["cellule-energie"] };
    if (c.target === "reacteur_surcharge" && !c.effects) c.effects = { require: ["cellule-energie"] };
    if (c.target === "fin_secrete_fusion" && !c.effects) c.effects = { require: ["cle-quantique", "module-ia-eva", "disque-noir"] };
    if (c.target === "fin_arche_sauvee" && !c.effects) c.effects = { require: ["module-ia-eva"] };
    if (c.target === "pacte_eva" && !c.effects) c.effects = { require: ["module-ia-eva"] };
    if (c.target === "donne_ration" && !c.effects) c.effects = { require: ["ration-survie"] };
  }
}

// ---------- Assembler ----------
const sql = buildMigration({
  number: 23,
  slug: "signal-perdu-nova9",
  title: "NOVA-9 : Le Signal Perdu",
  tagline: "Une arche fantôme dérive aux confins du vide. À son bord, le secret de l'humanité.",
  description: `Année 2387. Vous êtes Kael Voss, récupérateur indépendant à bord du remorqueur HERMÈS-7. Le Centre de Veille lointaine capte un signal impossible : NOVA-9, l'Arche générationnelle perdue depuis quatre-vingts ans avec dix mille colons, vient de se rallumer à quatre cents années-lumière, dans la Nébuleuse du Voile.

À son bord : KAIROS, le moteur à distorsion interdit capable de plier l'espace. Et peut-être des survivants.

Votre combinaison est vide, votre sacoche est vide. Tout ce que vous trouverez à bord pourra vous sauver — ou vous perdre. Vos points de Vie, votre Armure et votre Attaque seront vos seules certitudes dans le noir.

Chaque choix compte. Chaque objet reste lié à cette aventure : partez explorer un autre livre, votre sacoche sera vide pour la nouvelle histoire. Revenez sur NOVA-9, et vous retrouverez tout.

Cette Saison 1 est gratuite et complète. Elle vous prépare à la grande histoire payante de la Saison 2, où vous deviendrez le vaisseau lui-même.`,
  genre: "scifi",
  isFree: true,
  priceGems: null,
  playtime: 75,
  difficulty: 4,
  tags: ["science-fiction", "space-opera", "horreur", "mystère", "vaisseau-fantôme", "ia", "vie-armure-attaque", "saison-1"],
  cover: "/covers/signal-perdu-nova9.jpg",
  rulebookTitle: "Règles — Vie / Armure / Attaque",
  rulebookContent: rulebook,
  ruleData: { combat_system: "vie_armure_attaque", starting_stats: { vie: 20, armure: 0, attaque: 5 }, inventory: { start_empty: true, per_story: true }, combat: { formula: "attaque-armure+hasard", crit_on: [0, 9] } },
  items,
  nodes: N,
});

writeFileSync(OUT, sql, "utf8");
console.log(`✅ S1 écrite : ${N.length} noeuds, ${N.filter((n) => n.ending).length} fins → ${OUT}`);
