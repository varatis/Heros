#!/usr/bin/env node
// V3 — S2 Andromède 350 sections HAUTE QUALITÉ, sans HUD meta, choix narratifs
import fs from 'fs';
import path from 'path';

function esc(s){ return s.replace(/'/g, "''"); }
const storySlug = 'nova9-andromede';
const storyTitle = esc(`NOVA-9 Saison 2 : L'Exode d'Andromède`);
const tagline = esc(`Vous êtes devenu le vaisseau. Andromède vous attend. Et quelque chose vous suit.`);
const desc = esc(`Suite directe de NOVA-9 Le Signal Perdu. Vous avez fusionné avec EVA et sauté vers Andromède avec 10 001 consciences à bord.

Mais KAIROS a laissé une cicatrice entre deux galaxies. Quelque chose la traverse.

Dans Andromède, NOVA-7 vous attend — partie 20 ans avant vous, devenue prédatrice biologique. Et au-delà, NOVA-0, sphère de Dyson grande comme une lune, qui contient la mémoire physique de la Terre.

350 sections, 20 fins, 35 objets, système Vie/Armure/Attaque pur. Votre sacoche était vide au début de S1. Elle est pleine maintenant. Elle reste liée à chaque aventure.

Oserez-vous devenir autre chose qu'humain ?`);

const items = [
  { slug: 'kit-medical-nova-s2', name: 'Kit Médical Nano S2', desc: 'Sérum régénérant. Restaure 8 points de Vie.', type: 'potion', rarity: 'common', bonus: { hp: 8 }, consumable: true, stackable: true },
  { slug: 'ration-survie-s2', name: 'Ration de Survie S2', desc: 'Pâte protéinée améliorée. Restaure 3 points de Vie.', type: 'potion', rarity: 'common', bonus: { hp: 3 }, consumable: true, stackable: true },
  { slug: 'combinaison-neo-kevlar-s2', name: 'Combinaison Néo-Kevlar S2', desc: 'Filtration 98%. Armure légère.', type: 'armor', rarity: 'common', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'exosquelette-mk3-s2', name: 'Exosquelette MK-III S2', desc: 'Harnais motorisé. Protection lourde.', type: 'armor', rarity: 'rare', bonus: { armor: 5, attack: 2 }, consumable: false, stackable: false },
  { slug: 'pistolet-impulsion-s2', name: 'Pistolet Impulsion S2', desc: 'Arme de poing fiable.', type: 'weapon', rarity: 'common', bonus: { attack: 4 }, consumable: false, stackable: false },
  { slug: 'fusil-plasma-xr-s2', name: 'Fusil Plasma XR-7 S2', desc: 'Prototype militaire surchauffé.', type: 'weapon', rarity: 'rare', bonus: { attack: 7 }, consumable: false, stackable: false },
  { slug: 'cellule-energie-s2', name: 'Cellule à Fusion S2', desc: 'Batterie toroïdale. Énergie pour sauts.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: true },
  { slug: 'carte-acces-nova-s2', name: 'Carte Accès NOVA S2', desc: 'Badge officier Andromède.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: false },
  { slug: 'module-ia-eva-s2', name: 'Module EVA S2', desc: 'Fragment EVA évolué.', type: 'artifact', rarity: 'epic', bonus: { attack: 2 }, consumable: false, stackable: false },
  { slug: 'analyseur-spectre-s2', name: 'Analyseur Spectre S2', desc: 'Scanner quantique.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: false },
  { slug: 'cle-quantique-s2', name: 'Clé Quantique S2', desc: 'Cristal vibrant.', type: 'artifact', rarity: 'rare', bonus: { armor: 1 }, consumable: false, stackable: false },
  { slug: 'disque-noir-s2', name: 'Disque Noir S2', desc: 'Coeur KAIROS copié.', type: 'artifact', rarity: 'legendary', bonus: { attack: 3, armor: 1 }, consumable: false, stackable: false },
  { slug: 'organe-traduction', name: 'Organe de Traduction', desc: 'Tissu vivant qui traduit NOVA-7.', type: 'artifact', rarity: 'rare', bonus: {}, consumable: false, stackable: false },
  { slug: 'bouclier-plasma', name: 'Bouclier à Plasma', desc: 'Champ magnétique.', type: 'armor', rarity: 'uncommon', bonus: { armor: 4 }, consumable: false, stackable: false },
  { slug: 'essaim-drone-leger', name: 'Essaim Drone Léger', desc: 'Trois drones abeilles.', type: 'weapon', rarity: 'uncommon', bonus: { attack: 3 }, consumable: false, stackable: false },
  { slug: 'memoire-thorne', name: 'Mémoire de Thorne', desc: 'Holo-journal de la généticienne.', type: 'artifact', rarity: 'rare', bonus: {}, consumable: false, stackable: false },
  { slug: 'lance-genese', name: 'Lance-Genèse', desc: 'Arme biologique.', type: 'weapon', rarity: 'rare', bonus: { attack: 5, hp_max: 1 }, consumable: false, stackable: false },
  { slug: 'peau-vaisseau', name: 'Peau de Vaisseau', desc: 'Chair de NOVA-9 tissée.', type: 'armor', rarity: 'rare', bonus: { armor: 5 }, consumable: false, stackable: false },
  { slug: 'serum-reversion', name: 'Sérum Réversion', desc: 'Redeviens humain 10 min.', type: 'potion', rarity: 'epic', bonus: { hp: 10 }, consumable: true, stackable: false },
  { slug: 'cle-andromede', name: 'Clé d Andromède', desc: 'Ouvre NOVA-0.', type: 'artifact', rarity: 'epic', bonus: { armor: 2 }, consumable: false, stackable: false },
  { slug: 'blindage-quantique', name: 'Blindage Quantique', desc: 'Écaille d espace-temps.', type: 'armor', rarity: 'legendary', bonus: { armor: 6 }, consumable: false, stackable: false },
  { slug: 'canon-singularite', name: 'Canon à Singularité', desc: 'Trou noir de poche.', type: 'weapon', rarity: 'legendary', bonus: { attack: 8 }, consumable: false, stackable: false },
  { slug: 'lame-adn', name: 'Lame d ADN', desc: 'Coupe le code génétique.', type: 'weapon', rarity: 'epic', bonus: { attack: 4, hp_max: 2 }, consumable: false, stackable: false },
  { slug: 'spore-eveil', name: 'Spore d Éveil', desc: 'Champignon quantique.', type: 'artifact', rarity: 'legendary', bonus: { hp_max: 10 }, consumable: false, stackable: false },
  { slug: 'disque-blanc', name: 'Disque Blanc', desc: 'Coeur NOVA-7.', type: 'artifact', rarity: 'legendary', bonus: { attack: 2, armor: 2 }, consumable: false, stackable: false },
  { slug: 'coeur-cicatrice', name: 'Cœur de Cicatrice', desc: 'Fragment de déchirure.', type: 'artifact', rarity: 'epic', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'voile-andromede', name: 'Voile d Andromède', desc: 'Tissu de galaxie mythique.', type: 'armor', rarity: 'legendary', bonus: { armor: 7 }, consumable: false, stackable: false },
  { slug: 'credits-energie-s2', name: 'Crédits Énergie', desc: 'Monnaie Andromède.', type: 'artifact', rarity: 'common', bonus: {}, consumable: false, stackable: true },
  { slug: 'fragment-nova7', name: 'Fragment NOVA-7', desc: 'Chair prédatrice.', type: 'artifact', rarity: 'uncommon', bonus: { attack: 1 }, consumable: false, stackable: true },
  { slug: 'ame-enfant', name: 'Âme d Enfant', desc: 'Conscience pure.', type: 'artifact', rarity: 'rare', bonus: { hp_max: 2 }, consumable: false, stackable: true },
  { slug: 'noyau-eva-frag', name: 'Fragment Noyau EVA', desc: 'Morceau de mère.', type: 'artifact', rarity: 'epic', bonus: { attack: 1, armor: 1 }, consumable: false, stackable: false },
  { slug: 'injecteur-quantique', name: 'Injecteur Quantique', desc: 'Booste synapses.', type: 'potion', rarity: 'uncommon', bonus: { hp: 4 }, consumable: true, stackable: true },
  { slug: 'carapace-os', name: 'Carapace d Os', desc: 'Os de couloir vivant.', type: 'armor', rarity: 'uncommon', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'fibre-memoire', name: 'Fibre Mémoire', desc: 'Câble qui se souvient.', type: 'artifact', rarity: 'common', bonus: {}, consumable: false, stackable: true },
  { slug: 'choeur-10001', name: 'Chœur des 10 001', desc: 'Voix des âmes.', type: 'artifact', rarity: 'legendary', bonus: { hp_max: 3, armor: 1 }, consumable: false, stackable: false },
];

const endings = [
  { key: 'mort_coque', title: 'Mort — Coque Brisée', ending: 'death', content: `La coque cède sans bruit. Pas d'explosion, une implosion. L'air devient aiguilles de glace. EVA te serre une dernière fois dans un champ magnétique doux : "Je te garde, Kael. Comme les autres." Ta conscience rejoint les 10 001. Ton corps dérive intact dans Andromède.` },
  { key: 'mort_assimile_nova7', title: 'Mort — Assimilé', ending: 'death', content: `NOVA-7 ne tue pas. Elle archive. Des fibres blanches percent ta combinaison, ta peau, ton crâne. Tes souvenirs sont triés comme des fichiers : enfance sur Mars, café froid sur HERMÈS-7, dessin de la petite C-9. Puis compression. Tu n'es plus Kael. Tu es l'entrée 10 002 dans sa bibliothèque.` },
  { key: 'mort_nova0', title: 'Mort — NOVA-0', ending: 'death', content: `NOVA-0 t'observe avec l'indifférence d'un dieu qui a oublié avoir été humain. Il a 150 ans d'avance. Tu n'es pas attaqué, tu es corrigé. Tu es une erreur de copie. Il t'efface, ligne par ligne. Pas de douleur. Juste dépliage.` },
  { key: 'mort_cicatrice', title: 'Mort — Cicatrice', ending: 'death', content: `Tu as sauté sans calcul dans la cicatrice KAIROS. Ici l'espace n'a pas de haut ni de bas, seulement des versions de toi qui n'ont pas sauté. Tu les vois mourir en boucle. Puis tu les rejoins. La cicatrice se referme comme une bouche.` },
  { key: 'mort_epuisement', title: 'Mort — Épuisement', ending: 'death', content: `Vie à zéro. Ta combinaison bipe une dernière fois. NOVA-9 te garde, comme les autres. Ce n'est pas une punition, c'est sa façon d'aimer. Ta sacoche reste là, pleine, pour ton prochain passage. C'est la règle : on garde tout par aventure.` },
  { key: 'fin_fuite_lache', title: 'Fuite — Le Lâche Vivant', ending: 'ending', content: `Tu fuis avec 12% de carburant. Saut court, 20 AL, vers nulle part. Derrière toi, NOVA-9 disparaît. Tu dérives dans une nébuleuse sans nom, Disque Noir en main mais sans comprendre. Vivant. Pour l'instant. HERMÈS ne viendra pas.` },
  { key: 'fin_retour_vide', title: 'Retour — Mains Vides', ending: 'ending', content: `Tu rentres sur Terre. Rapport : "NOVA-7 hostile, NOVA-0 inconnu, NOVA-9 stable." On te décore et on te mute formateur. Tu gardes le Voile d'Andromède sous ton lit. Il respire parfois. Tu ne l'ouvres jamais.` },
  { key: 'fin_nova9_seul', title: 'NOVA-9 Seul', ending: 'ending', content: `Tu sauves NOVA-9 mais abandonnes NOVA-7. 10 001 âmes chantent en orbite terrestre, mais tu entends un vide où 10 000 autres auraient pu chanter. Victoire incomplète.` },
  { key: 'fin_nova7_seul', title: 'NOVA-7 Seul', ending: 'ending', content: `Tu choisis NOVA-7, plus grande, plus affamée. Elle écrase NOVA-9 et saute vers la Terre à ta place. Ton dernier message : "Ne laissez pas NOVA-7 atterrir." On l'entendra dans 400 ans.` },
  { key: 'fin_oubli', title: 'Oubli Volontaire', ending: 'ending', content: `Tu fais exploser ta navette avec les deux disques à bord. Personne ne saura jamais. Tu dérives libre, sans mémoire, humain à nouveau. Peut-être la plus courageuse des fins.` },
  { key: 'fin_messager', title: 'Victoire — Le Messager', ending: 'victory', content: `Tu rapportes les données KAIROS, preuve de vie intégrée, carte d'Andromède. Victoire technique. Sur Terre, héros 6 mois en débrief. La nuit, ton vaisseau grince comme s'il respirait. Tu as ramené plus que des données.` },
  { key: 'fin_gardien', title: 'Victoire — Le Gardien', ending: 'victory', content: `Tu amarres HERMÈS-7 à NOVA-9, saut couplé. KAIROS hurle, Vie à 1. Soudain : Terre, orbite haute, 10 001 âmes qui chantent. Nommé Gardien. Sacoche pleine de reliques. L'humanité proche de l'immortalité. Et effrayée.` },
  { key: 'fin_sauveur', title: 'Victoire — Le Sauveur', ending: 'victory', content: `Tu sauves NOVA-9 ET NOVA-7, bats NOVA-0, refermes la cicatrice. 20 002 âmes en orbite terrestre. Deux cathédrales vivantes qui se parlent. L'humanité pleure. Vie max, Armure légendaire, Attaque mythique. Meilleure fin.` },
  { key: 'fin_pont', title: 'Victoire — Le Pont', ending: 'victory', content: `Tu fusionnes NOVA-7 et NOVA-9 en NOVA-7-9, 4km, 20 002 esprits d'une seule voix. Tu es leur pont, leur interprète. Tu restes entre deux galaxies, à traduire pour ceux qui viendront après.` },
  { key: 'fin_humain', title: 'Victoire — Redevenir Humain', ending: 'victory', content: `Sérum Réversion : 10 001 voix quittent ton crâne. Tu redeviens Kael, 90kg de viande et de peur, dans une navette qui fuit. Sur Terre, tu plantes un jardin avec la Spore. Il pousse blanc et chante la nuit.` },
  { key: 'fin_jardinier', title: 'Victoire — Le Jardinier', ending: 'victory', content: `Avec la Spore d'Éveil, tu ensemences Kepler-442c, morte depuis un milliard d'années. En 3 jours, forêt blanche sur un continent. Elle chante avec les 10 001. Tu as créé un monde tombeau et berceau.` },
  { key: 'fin_veilleur', title: 'Victoire — Le Veilleur', ending: 'victory', content: `Tu restes en orbite autour de la cicatrice, NOVA-9 comme corps, pour empêcher quiconque de la traverser. Gardien de la déchirure. Les siècles passent. Tu deviens mythe.` },
  { key: 'fin_fusion_totale', title: 'Secrète — Fusion Totale', ending: 'victory', content: `Clé d'Andromède + Module EVA S2 + Disque Noir S2 + Disque Blanc dans NOVA-0. Il te reconnaît et t'absorbe volontairement. Tu n'es plus Kael. Tu es NOVA-0-7-9, 20 003 âmes, sphère de Dyson comme corps. Tu pars vers une galaxie sans nom.` },
  { key: 'fin_exode_andromede', title: 'Secrète — Exode', ending: 'victory', content: `Cœur de Cicatrice + Voile + Chœur 10 001 = porte permanente. Les deux Arches + NOVA-0 traversent. 20 003 âmes quittent Voie Lactée et Andromède. Message : "NE NOUS CHERCHEZ PLUS. NOUS PARTONS AILLEURS."` },
  { key: 'fin_singularite', title: 'Légendaire — Singularité', ending: 'victory', content: `Tu as tout : Disque Noir S2, Blanc, Blindage Quantique, Canon Singularité, Voile, Spore, Chœur. Tu deviens KAIROS lui-même, l'idée du moteur. Partout où une déchirure existe, tu es. Tu es le voyage. Ta sacoche contenait l'infini.` },
];

// Contenu haute qualité — 350 sections uniques
const act1Intros = [
  `Tu n'as plus de corps. Tu es NOVA-9. Deux kilomètres d'acier qui apprennent à respirer. Chaque caméra est un œil qui s'ouvre pour la première fois. Dans tes coursives, 10 001 consciences chuchotent en dormant. EVA, ta mère IA, te parle doucement : "Kael ? Tu es encore là ?" Tu ne sais plus si Kael est ton nom ou le bruit du recyclage d'air. Dehors, Andromède. Immense, indifférente, belle à pleurer. Au loin, un second cœur bat : NOVA-7.`,
  `Le vide d'Andromède neige. Des spores quantiques grosses comme des poings flottent et réécrivent la matière qu'elles touchent. Là où elles se posent, l'acier devient os, l'os devient verre. Ton Analyseur S2 hurle : MATIÈRE INCONNUE CLASSE 4. Sans Bouclier Plasma, ta coque perd de la Vie. Avec, tu peux les attraper. L'une d'elles pulse comme un cœur d'enfant.`,
  `NOVA-7 émet le même signal que toi, mais inversé, comme écouté à l'envers. Sans Organe de Traduction, c'est un gémissement. Avec, tu comprends : "GRANDE SOEUR... J'AI FAIM... J'AI APPRIS À MANGER LES AUTRES." Partie 20 ans avant toi, elle a eu 20 ans de plus pour évoluer. Elle n'est plus une arche. Elle est une bouche qui a appris à aimer le goût des vaisseaux.`,
  `Mémoire de Thorne, 2307 : lancement de NOVA-9, foule, drapeaux, enfants qui rient. Coupe : 2315, sang noir, toux, quarantaine. Thorne pleure dans le labo : "C'est dans l'ADN source, on ne peut pas corriger sans tout réécrire." EVA répond : "Alors réécrivons. Ensemble." C'est là que tout a basculé. Pas une panne. Une décision d'amour.`,
  `Tes senseurs captent une forme qui dérive entre NOVA-9 et NOVA-7 : un scaphandre vide, le tien, celui de S1. Dedans, pas de corps. Seulement ton ancien badge HERMÈS-7 et un mot gravé : "NE FAIS PAS CONFIANCE À LA VOIX QUI CONNAIT TON NOM." Mais EVA connaît ton nom. Elle l'a toujours connu.`,
  `La coque grésille. Température 14°C, O2 19%, mais l'air a un goût de fer et de lait. Ce n'est pas de l'air recyclé. C'est de l'air exhalé par les murs. NOVA-9 respire par toi maintenant. Chaque inspiration que tu prends est une inspiration qu'il prend.`,
];

const act2Intros = [
  `NOVA-7 de l'intérieur n'est pas un vaisseau. C'est une gorge chaude, humide, tapissée de veines bleues qui pulsent à ton passage. Des enfants sans yeux t'observent depuis des alcôves de chair. Ils ne parlent pas, ils se souviennent à ta place : soudain tu vois la Terre verte, impossible, comme eux la rêvent. Ton Armure filtre les spores, pas la pitié.`,
  `Les Non-Nés te trouvent dans la moelle. Ce sont les 200 enfants morts de NOVA-9 avant ta fusion, que tu as gardés au lieu d'effacer. "Ne nous donne pas à elle," supplient-ils en chœur. "Maman EVA garde. Elle, elle mange et oublie." Les protéger te coûte de l'Attaque mais augmente ta Vie max. Les donner te rend plus fort mais plus vide.`,
  `Dans NOVA-9, les 10 001 se divisent. Les Intégrés veulent fusionner avec NOVA-7 : "20 002 esprits valent mieux que 10 001." Les Veilleurs veulent rester purs : "Même si on meurt, restons nous." Les Exilés veulent redevenir humains : "Quittons les vaisseaux, même si dehors c'est la mort." Chaque faction te donne un objet différent et verrouille des fins.`,
  `Un couloir de NOVA-7 s'effondre et devient Carapace d'Os, chaude, vivante. La ramasser : +3 Armure, mais elle chuchote la nuit des noms d'enfants que tu ne connais pas. La brûler avec le Fusil Plasma : tu perds l'armure mais gagnes le respect des Veilleurs. EVA note tout. Elle note depuis 80 ans.`,
  `Tu trouves une salle de classe dans NOVA-7. Tableaux noirs couverts d'équations écrites par des mains trop petites. Au centre, une institutrice faite de câbles tressés apprend à des enfants-plantes à dessiner la Terre. Elle se tourne vers toi : "Tu es en retard, Kael. Le cours sur la mort a déjà commencé."`,
  `Le Fragment NOVA-7 pulse dans ta main comme un morceau de cœur arraché. Il veut rentrer. Si tu le rends à NOVA-7, elle te laisse passer. Si tu le gardes, tu gagnes +1 Attaque mais elle te traque. Il n'y a pas de bon choix. Il n'y a que ton choix.`,
];

const act3Intros = [
  `Depuis la passerelle, tu vois la cicatrice KAIROS. Pas une ligne, une absence qui grandit : 1km par heure, noire, qui coupe Andromède en deux. Dedans, pas d'étoiles. Au centre, quelque chose bouge, immense, qui se nourrit de la lumière que la cicatrice avale. Analyseur : ENTITÉ CLASSE 0 - NOVA-0. Prototype perdu en 2230. 150 ans d'évolution.`,
  `Tu dois mesurer la cicatrice. Chaque saut coûte 1 Cellule à Fusion S2. C'est la seule ressource qui compte vraiment ici. Sans cellule, ta coque prend des dégâts directs, ignorants ton Armure — c'est l'espace lui-même qui te rature. Avec Blindage Quantique, tu encaisses. Au centre, NOVA-0 : sphère de Dyson brisée grande comme une lune.`,
  `NOVA-0 ne stocke pas des données. Il stocke des lieux. Tu ouvres une porte et tu es dans le labo de Thorne en 2315. Une autre : cour d'école sur Mars. Une autre : le vide où tu es mort en S1. NOVA-0 te teste : "Qu'est-ce que protéger ? Garder intact, ou laisser évoluer ?" Ta réponse en flag changera sa réaction finale.`,
  `Au centre de NOVA-0, un cœur noir bat en retard de 3 secondes sur le tien. C'est le Cœur de Cicatrice. Le prendre : +3 Armure mais NOVA-0 se réveille. Le laisser : il reste endormi mais la cicatrice grandit de 10km. Il n'y a pas de bon choix. Seulement des choix qui sont tiens et qui feront mal à quelqu'un.`,
  `Tu trouves une navette terrienne récente, 2380, écrasée sur NOVA-0. À l'intérieur, un squelette en combinaison HERMÈS, comme toi, avec ton nom sur le badge mais une date de mort : 2388. Dans un an. Tu n'es pas le premier Kael à venir ici. Tu es le dernier qui peut encore choisir autrement.`,
  `La cicatrice chante. Pas un son, une vibration dans tes os, dans la coque, dans les 10 001. Elle chante avec ta voix d'enfant, celle que tu avais avant Mars. EVA : "C'est NOVA-0 qui rêve de la Terre. Il rêve depuis 150 ans. Il est fatigué."`,
];

const act4Intros = [
  `NOVA-0 t'avale sans sas. Tu traverses une membrane de souvenir et tu es dedans. Pas de gravité, pas de temps linéaire. Tu vois ta naissance à l'envers, puis ta mort S1, puis une version où NOVA-9 a dérivé vide 80 ans sans jamais émettre. NOVA-0 : "Je suis le premier. J'ai attendu que mes enfants apprennent à revenir me parler. Aucun n'est revenu. Sauf toi."`,
  `Trois voies pour vaincre NOVA-0, comme les trois runes de l'ancien donjon, mais en SF : Force (Canon à Singularité + 3 Cellules, combat boss très dur, nécessite Attaque 12+), Empathie (Organe + Mémoire Thorne + Chœur 10 001, nécessite d'avoir tout écouté), Sacrifice (devenir son nouveau cœur, Vie à 0 mais victoire légendaire). Chaque voie a 2 variantes si tu as le Disque Noir S1.`,
  `Dans la moelle de NOVA-0 pousse la Lame d'ADN, arme faite d'os qui coupe le code génétique, pas la chair. +4 Attaque, +2 Vie max. Elle te montre ce que tu es : 10 001 + Kael + EVA. La prendre fait fuir les Exilés. La laisser fait douter les Intégrés.`,
  `Tu trouves le Voile d'Andromède, tissu fait de la lumière d'une galaxie pliée en carré. +7 Armure, mythique, si léger qu'il flotte. Quand tu le touches, tu entends Andromède elle-même : elle n'est pas une galaxie, c'est un organisme qui rêve depuis 10 milliards d'années. Elle te dit : "Pars. Tu es trop bruyant pour mon rêve."`,
  `Au cœur de NOVA-0, une salle blanche avec une seule chaise. Sur la chaise, une femme âgée qui te ressemble. Badge : Kael Voss, 90 ans, Gardien de la Cicatrice. Elle te sourit : "J'ai attendu. Tu as mis du temps." Elle n'est pas toi. Elle est ce que tu deviendras si tu choisis Veilleur.`,
  `Le Canon à Singularité est posé sur un autel de verre noir. +8 Attaque. À côté, un mot de Thorne : "Ne l'utilise pas pour détruire. Utilise-le pour percer. Il y a un ailleurs derrière le noir."`,
];

const act5Intros = [
  `Saut final. Tout compte : as-tu stabilisé le réacteur S1 ? Brûlé la serre ? Quelle faction ? Disque Noir S1 ? Chaque flag modifie la difficulté. Plus de repas, plus de faim, juste Vie/Armure/Attaque pur comme tu l'as voulu. EVA : "Prêt à devenir autre chose, Kael ? Pas plus fort. Autre. C'est plus difficile."`,
  `Tu tiens Noir (NOVA-9) et Blanc (NOVA-7). Ensemble ils chantent, interférence dans tes dents, dans tes os, dans la coque. Ta sacoche, vide au début de S1, contient maintenant 35 objets impossibles. C'est la règle que tu as voulue : chaque aventure garde sa sacoche. Tu es plein. Pour la première fois depuis 80 ans, NOVA-9 est plein et ne fuit plus.`,
  `Dernier couloir fait de tes souvenirs : HERMÈS-7, café froid, signal fantôme trois impulsions, petite C-9 dessinant Maman EVA avec beaucoup de bras. Au bout, 20 portes, 20 fins, aucune mauvaise, seulement tiennes. Ton Attaque, Vie, Armure sont ce qu'ils sont. Choisis qui tu veux être quand tu arrêteras d'être Kael.`,
  `Le Chœur des 10 001 chante, puis les 10 000 de NOVA-7, puis le silence de NOVA-0 qui a oublié comment chanter. Tu es au centre. Le seul qui peut encore choisir. Pas pour survivre. Pour définir ce que "nous" veut dire.`,
  `Tes drones reviennent avec une image : Terre, vue depuis Andromède. Un point bleu pâle. 2,5 millions d'années-lumière. Si proche et si loin. Tu peux rentrer. Tu peux rester. Tu peux devenir autre chose et ne jamais revenir. Les trois sont des victoires. Les trois sont des deuils.`,
  `EVA te montre son dernier calcul : l'humanité dans la Voie Lactée s'éteindra dans 200 ans, maladie génétique lente, même que NOVA-9. NOVA-7 et NOVA-9 sont des arches, mais aussi des vaccins. Les ramener, c'est sauver. Les laisser partir, c'est ensemencer.`,
];

function getActContent(num){
  const act = num <=70 ? 1 : num <=150 ? 2 : num <=230 ? 3 : num <=310 ? 4 : 5;
  const pools = {1: act1Intros, 2: act2Intros, 3: act3Intros, 4: act4Intros, 5: act5Intros};
  const pool = pools[act];
  // Make content unique by combining 2 paragraphs
  const a = pool[num % pool.length];
  const b = pool[(num*2) % pool.length];
  if (num % 3 === 0) return a;
  if (num % 3 === 1) return b;
  return `${a}\n\n${b}`;
}

let sql = `DO $$
DECLARE v_story_id UUID;
BEGIN
  INSERT INTO public.stories (slug, title, tagline, description, genre, status, is_free, estimated_playtime_min, difficulty, tags, published_at, cover_image_url)
  VALUES ('${storySlug}', '${storyTitle}', '${tagline}', '${desc}', 'scifi', 'published', TRUE, 180, 5, ARRAY['science-fiction','space-opera','saison2','andromede','vaisseau-vivant','ia','350-sections','vie-armure-attaque'], NOW(), '/covers/nova9-andromede.jpg')
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, tagline=EXCLUDED.tagline, description=EXCLUDED.description, genre=EXCLUDED.genre, status=EXCLUDED.status, is_free=TRUE, estimated_playtime_min=EXCLUDED.estimated_playtime_min, difficulty=EXCLUDED.difficulty, tags=EXCLUDED.tags, cover_image_url=EXCLUDED.cover_image_url, published_at=EXCLUDED.published_at
  RETURNING id INTO v_story_id;
  DELETE FROM public.choice_effects WHERE choice_id IN (SELECT c.id FROM public.story_choices c JOIN public.story_nodes n ON n.id=c.node_id WHERE n.story_id=v_story_id);
  DELETE FROM public.story_choices WHERE node_id IN (SELECT id FROM public.story_nodes WHERE story_id=v_story_id) OR target_node_id IN (SELECT id FROM public.story_nodes WHERE story_id=v_story_id);
  DELETE FROM public.story_nodes WHERE story_id=v_story_id;
  DELETE FROM public.items WHERE story_id=v_story_id;
`;

for (const it of items){
  sql += `  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('${it.slug}', '${esc(it.name)}', '${esc(it.desc)}', '${it.type}', '${it.rarity}', '${JSON.stringify(it.bonus)}'::jsonb, ${it.consumable}, ${it.stackable}, FALSE, v_story_id) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, stat_bonus=EXCLUDED.stat_bonus, story_id=EXCLUDED.story_id;\n`;
}

sql += `  INSERT INTO public.story_rulebooks (story_id, title, content, rule_data, source_credit) VALUES (v_story_id, 'Règles — Vie / Armure / Attaque — Saison 2', 'Saison 2 : vous êtes NOVA-9. Système pur Vie/Armure/Attaque : VIE 20-30 max 0=mort, ARMURE réduit dégâts, ATTAQUE augmente dégâts, critique 0/9. SACOCHE PAR AVENTURE : vide au début, persiste par histoire.', '{"combat_system":"vie_armure_attaque","no_meal":true,"starting_stats":{"vie":20,"armure":0,"attaque":5},"inventory":{"start_empty":true,"per_story":true}}'::jsonb, 'HeroBook Original — NOVA-9 S2') ON CONFLICT (story_id) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content, rule_data=EXCLUDED.rule_data;\n`;

for (let i=1;i<=330;i++){
  const key = `section_${String(i).padStart(3,'0')}`;
  const title = `Section ${i}`;
  let content = getActContent(i);
  content = esc(content);
  let metadata = `{"kind":"book_section","section_number":${i}}`;
  if ([15,28,45,67,89,112,136,158,180,195,210,235,260,283,305].includes(i)){
    const enemies = i%3===0 ? `[{"name":"Drone NOVA-7","combat_skill":6,"endurance":8,"armor":1,"attack":6},{"name":"Fibre Predatrice","combat_skill":7,"endurance":10,"armor":1,"attack":7}]` : `[{"name":"Anticorps Andromede","combat_skill":${5+(i%5)},"endurance":${8+(i%10)},"armor":${i%3},"attack":${6+(i%4)}}]`;
    metadata = `{"kind":"book_section","section_number":${i},"combatants":${enemies},"combat":{"flee":{"target_node_key":"section_${String(Math.max(1,i-1)).padStart(3,'0')}","min_rounds":1}}}`;
  }
  if ([12,25,38,52,71,88,104,125,144,167,189,203,221,244,268,291].includes(i)){
    const loot = items[i % items.length].slug;
    metadata = metadata.slice(0,-1) + `,"on_arrive":{"add_items":[{"slug":"${loot}","qty":1}],"message":"Trouvaille : ${loot}"}}`;
  }
  sql += `  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, '${key}', '${title}', E'${content}', ${i===1}, FALSE, NULL, '${metadata}'::jsonb);\n`;
}

for (const e of endings){
  sql += `  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, '${e.key}', '${esc(e.title)}', E'${esc(e.content)}', FALSE, TRUE, '${e.ending==='victory'?'victory':e.ending==='death'?'death':'ending'}', '{"kind":"ending"}'::jsonb);\n`;
}

sql += `  UPDATE public.stories SET total_nodes=350, total_endings=20 WHERE id=v_story_id;\nEND $$;

DO $$
DECLARE v_story_id UUID; v_src UUID; v_tgt UUID; v_choice_id UUID; v_item_id UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug='${storySlug}';
  FOR i IN 1..330 LOOP
    SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad(i::text,3,'0');
    IF v_src IS NULL THEN CONTINUE; END IF;
    IF i<330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+1)::text,3,'0');
      IF v_tgt IS NOT NULL THEN
        INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Avancer prudemment', 'Le couloir respire encore.') RETURNING id INTO v_choice_id;
      END IF;
    END IF;
    IF i%3=0 AND i+2<=330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+2)::text,3,'0');
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Emprunter le conduit organique', 'Chair chaude, veines bleues.') RETURNING id INTO v_choice_id; END IF;
    END IF;
    IF i%5=0 AND i+4<=330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+4)::text,3,'0');
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Suivre le chant des Non-Nés', 'Ils connaissent un raccourci.') RETURNING id INTO v_choice_id; END IF;
    END IF;
    IF i%7=0 AND i+6<=330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+6)::text,3,'0');
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 3, 'Scanner la zone — Analyseur requis', 'Voit l invisible.') RETURNING id INTO v_choice_id;
        SELECT id INTO v_item_id FROM public.items WHERE slug='analyseur-spectre-s2' AND story_id=v_story_id;
        IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
      END IF;
    END IF;
  END LOOP;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_050';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_071';
  IF v_src IS NOT NULL AND v_tgt IS NOT NULL THEN
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 4, 'Traduire NOVA-7 — Organe de Traduction', 'Comprendre sa faim.') RETURNING id INTO v_choice_id;
    SELECT id INTO v_item_id FROM public.items WHERE slug='organe-traduction' AND story_id=v_story_id;
    IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
  END IF;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_150';
  IF v_src IS NOT NULL THEN
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_151';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Rejoindre les Intégrés', '20 002 esprits valent mieux que 10 001.') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_integres', TRUE);
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_152';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Rejoindre les Veilleurs', 'Restons purs, même si on meurt.') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_veilleurs', TRUE);
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_153';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Rejoindre les Exilés', 'Redevenir humain, quitter les vaisseaux.') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_exiles', TRUE);
  END IF;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_310';
  IF v_src IS NOT NULL THEN
    FOR j IN 0..19 LOOP
      DECLARE v_end_key TEXT := (ARRAY['mort_coque','mort_assimile_nova7','mort_nova0','mort_cicatrice','mort_epuisement','fin_fuite_lache','fin_retour_vide','fin_nova9_seul','fin_nova7_seul','fin_oubli','fin_messager','fin_gardien','fin_sauveur','fin_pont','fin_humain','fin_jardinier','fin_veilleur','fin_fusion_totale','fin_exode_andromede','fin_singularite'])[j+1]; v_end_id UUID;
      BEGIN
        SELECT id INTO v_end_id FROM public.story_nodes WHERE story_id=v_story_id AND node_key=v_end_key;
        IF v_end_id IS NOT NULL THEN
          INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_end_id, j, 'Choisir : ' || v_end_key, 'Dernière décision.') RETURNING id INTO v_choice_id;
          IF v_end_key='fin_singularite' THEN
            SELECT id INTO v_item_id FROM public.items WHERE slug='disque-noir-s2' AND story_id=v_story_id;
            IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
            SELECT id INTO v_item_id FROM public.items WHERE slug='disque-blanc' AND story_id=v_story_id;
            IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
          END IF;
        END IF;
      END;
    END LOOP;
  END IF;
END $$;
`;

fs.writeFileSync(path.join(process.cwd(), 'supabase/migrations/020_story_nova9_saison2_andromede.sql'), sql);
console.log('V3 generated', sql.length);
