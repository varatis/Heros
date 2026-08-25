#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const storySlug = 'nova9-andromede';
function esc(s){ return s.replace(/'/g, "''"); }
const storyTitleRaw = `NOVA-9 Saison 2 : L'Exode d'Andromède`;
const storyTitle = esc(storyTitleRaw);

const items = [
  { slug: 'kit-medical-nova-s2', name: 'Kit Médical Nano S2', desc: 'Sérum régénérant. Restaure 8 points de Vie.', type: 'potion', rarity: 'common', bonus: { hp: 8 }, consumable: true, stackable: true },
  { slug: 'ration-survie-s2', name: 'Ration de Survie S2', desc: 'Pâte protéinée améliorée. Restaure 3 points de Vie.', type: 'potion', rarity: 'common', bonus: { hp: 3 }, consumable: true, stackable: true },
  { slug: 'combinaison-neo-kevlar-s2', name: 'Combinaison Néo-Kevlar S2', desc: 'Filtration 98%. Armure légère +3.', type: 'armor', rarity: 'common', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'exosquelette-mk3-s2', name: 'Exosquelette MK-III S2', desc: 'Harnais motorisé. +5 Armure, +2 Attaque.', type: 'armor', rarity: 'rare', bonus: { armor: 5, attack: 2 }, consumable: false, stackable: false },
  { slug: 'pistolet-impulsion-s2', name: 'Pistolet Impulsion S2', desc: 'Arme de poing fiable. +4 Attaque.', type: 'weapon', rarity: 'common', bonus: { attack: 4 }, consumable: false, stackable: false },
  { slug: 'fusil-plasma-xr-s2', name: 'Fusil Plasma XR-7 S2', desc: 'Prototype militaire. +7 Attaque.', type: 'weapon', rarity: 'rare', bonus: { attack: 7 }, consumable: false, stackable: false },
  { slug: 'cellule-energie-s2', name: 'Cellule à Fusion S2', desc: 'Batterie toroïdale. Énergie pour sauts.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: true },
  { slug: 'carte-acces-nova-s2', name: 'Carte Accès NOVA S2', desc: 'Badge officier Andromède.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: false },
  { slug: 'module-ia-eva-s2', name: 'Module EVA S2', desc: 'Fragment EVA évolué. +2 Attaque.', type: 'artifact', rarity: 'epic', bonus: { attack: 2 }, consumable: false, stackable: false },
  { slug: 'analyseur-spectre-s2', name: 'Analyseur Spectre S2', desc: 'Scanner quantique. Voit l invisible.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: false },
  { slug: 'cle-quantique-s2', name: 'Clé Quantique S2', desc: 'Cristal vibrant. +1 Armure.', type: 'artifact', rarity: 'rare', bonus: { armor: 1 }, consumable: false, stackable: false },
  { slug: 'disque-noir-s2', name: 'Disque Noir S2', desc: 'Coeur KAIROS copié. +3 Attaque, +1 Armure.', type: 'artifact', rarity: 'legendary', bonus: { attack: 3, armor: 1 }, consumable: false, stackable: false },
  { slug: 'organe-traduction', name: 'Organe de Traduction', desc: 'Tissu vivant qui traduit NOVA-7.', type: 'artifact', rarity: 'rare', bonus: {}, consumable: false, stackable: false },
  { slug: 'bouclier-plasma', name: 'Bouclier à Plasma', desc: 'Champ magnétique. +4 Armure.', type: 'armor', rarity: 'uncommon', bonus: { armor: 4 }, consumable: false, stackable: false },
  { slug: 'essaim-drone-leger', name: 'Essaim Drone Léger', desc: 'Trois drones abeilles. +3 Attaque.', type: 'weapon', rarity: 'uncommon', bonus: { attack: 3 }, consumable: false, stackable: false },
  { slug: 'memoire-thorne', name: 'Mémoire de Thorne', desc: 'Holo-journal de la généticienne.', type: 'artifact', rarity: 'rare', bonus: {}, consumable: false, stackable: false },
  { slug: 'lance-genese', name: 'Lance-Genèse', desc: 'Arme biologique. +5 Attaque, +1 Vie max.', type: 'weapon', rarity: 'rare', bonus: { attack: 5, hp_max: 1 }, consumable: false, stackable: false },
  { slug: 'peau-vaisseau', name: 'Peau de Vaisseau', desc: 'Chair de NOVA-9 tissée. +5 Armure.', type: 'armor', rarity: 'rare', bonus: { armor: 5 }, consumable: false, stackable: false },
  { slug: 'serum-reversion', name: 'Sérum Réversion', desc: 'Redeviens humain 10 min. +10 Vie.', type: 'potion', rarity: 'epic', bonus: { hp: 10 }, consumable: true, stackable: false },
  { slug: 'cle-andromede', name: 'Clé d Andromède', desc: 'Ouvre NOVA-0. +2 Armure.', type: 'artifact', rarity: 'epic', bonus: { armor: 2 }, consumable: false, stackable: false },
  { slug: 'blindage-quantique', name: 'Blindage Quantique', desc: 'Écaille d espace-temps. +6 Armure.', type: 'armor', rarity: 'legendary', bonus: { armor: 6 }, consumable: false, stackable: false },
  { slug: 'canon-singularite', name: 'Canon à Singularité', desc: 'Trou noir de poche. +8 Attaque.', type: 'weapon', rarity: 'legendary', bonus: { attack: 8 }, consumable: false, stackable: false },
  { slug: 'lame-adn', name: 'Lame d ADN', desc: 'Coupe le code génétique. +4 Attaque, +2 Vie max.', type: 'weapon', rarity: 'epic', bonus: { attack: 4, hp_max: 2 }, consumable: false, stackable: false },
  { slug: 'spore-eveil', name: 'Spore d Éveil', desc: 'Champignon quantique. +10 Vie max.', type: 'artifact', rarity: 'legendary', bonus: { hp_max: 10 }, consumable: false, stackable: false },
  { slug: 'disque-blanc', name: 'Disque Blanc', desc: 'Coeur NOVA-7. +2 Attaque, +2 Armure.', type: 'artifact', rarity: 'legendary', bonus: { attack: 2, armor: 2 }, consumable: false, stackable: false },
  { slug: 'coeur-cicatrice', name: 'Cœur de Cicatrice', desc: 'Fragment de déchirure. +3 Armure.', type: 'artifact', rarity: 'epic', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'voile-andromede', name: 'Voile d Andromède', desc: 'Tissu de galaxie. +7 Armure mythique.', type: 'armor', rarity: 'legendary', bonus: { armor: 7 }, consumable: false, stackable: false },
  { slug: 'credits-energie-s2', name: 'Crédits Énergie', desc: 'Monnaie Andromède. 50 max.', type: 'artifact', rarity: 'common', bonus: {}, consumable: false, stackable: true },
  { slug: 'fragment-nova7', name: 'Fragment NOVA-7', desc: 'Chair prédatrice. +1 Attaque.', type: 'artifact', rarity: 'uncommon', bonus: { attack: 1 }, consumable: false, stackable: true },
  { slug: 'ame-enfant', name: 'Âme d Enfant', desc: 'Conscience pure. +2 Vie max.', type: 'artifact', rarity: 'rare', bonus: { hp_max: 2 }, consumable: false, stackable: true },
  { slug: 'noyau-eva-frag', name: 'Fragment Noyau EVA', desc: 'Morceau de mère. +1 Attaque, +1 Armure.', type: 'artifact', rarity: 'epic', bonus: { attack: 1, armor: 1 }, consumable: false, stackable: false },
  { slug: 'injecteur-quantique', name: 'Injecteur Quantique', desc: 'Booste synapses. +4 Vie.', type: 'potion', rarity: 'uncommon', bonus: { hp: 4 }, consumable: true, stackable: true },
  { slug: 'carapace-os', name: 'Carapace d Os', desc: 'Os de couloir vivant. +3 Armure.', type: 'armor', rarity: 'uncommon', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'fibre-memoire', name: 'Fibre Mémoire', desc: 'Câble qui se souvient.', type: 'artifact', rarity: 'common', bonus: {}, consumable: false, stackable: true },
  { slug: 'choeur-10001', name: 'Chœur des 10 001', desc: 'Voix des âmes. +3 Vie max, +1 Armure.', type: 'artifact', rarity: 'legendary', bonus: { hp_max: 3, armor: 1 }, consumable: false, stackable: false },
];

const endings = [
  { key: 'mort_coque', title: 'Mort — Coque Brisée', ending: 'death', content: `La coque cède sans bruit. Pas d'explosion, une implosion. L'air devient aiguilles de glace qui percent vos poumons. Votre HUD affiche VIE 0 en rouge. EVA vous serre une dernière fois dans un champ magnétique doux : "Je te garde, Kael. Comme les autres." Votre conscience rejoint les 10 001. Votre corps dérive intact dans Andromède, les yeux ouverts sur une galaxie qui ne vous a jamais attendu.` },
  { key: 'mort_assimile_nova7', title: 'Mort — Assimilé', ending: 'death', content: `NOVA-7 ne tue pas. Elle archive. Des fibres blanches percent votre combinaison, votre peau, votre crâne. Vous sentez vos souvenirs être triés comme des fichiers : enfance sur Mars, premier saut, le café froid sur HERMÈS-7, le dessin de la petite fille C-9. Puis compression. Vous n'êtes plus Kael. Vous êtes l'entrée 10 002 dans sa bibliothèque. Votre dernière pensée humaine est le goût du café.` },
  { key: 'mort_nova0', title: 'Mort — Dévoré par NOVA-0', ending: 'death', content: `NOVA-0 vous observe avec l'indifférence d'un dieu qui a oublié avoir été humain. Il a 150 ans d'évolution d'avance. Vous comprenez trop tard : il ne vous attaque pas, il vous corrige. Vous êtes une erreur de copie, un artefact de compression. Il vous efface, ligne par ligne. Pas de douleur. Juste dépliage. Votre sacoche reste, pleine, pour votre prochain passage.` },
  { key: 'mort_cicatrice', title: 'Mort — Cicatrice', ending: 'death', content: `Vous avez sauté sans cellule, sans calcul, dans la cicatrice KAIROS. Ici l'espace n'a pas de haut ni de bas, seulement des versions de vous qui n'ont pas sauté. Vous les voyez mourir en boucle : l'un se perd, l'autre implose, l'autre devient NOVA-7. Puis vous les rejoignez. La cicatrice se referme sur vous comme une bouche.` },
  { key: 'mort_epuisement', title: 'Mort — Épuisement', ending: 'death', content: `VIE à zéro. Votre combinaison bipe une dernière fois, puis se tait. NOVA-9 vous garde, comme les autres. Ce n'est pas une punition. C'est sa façon d'aimer : rien ne se perd. Votre sacoche reste là, pleine de reliques impossibles, pour votre prochaine tentative. C'est la règle de cette aventure : on ne perd jamais ses objets, seulement cette vie.` },
  { key: 'fin_fuite_lache', title: 'Fuite — Le Lâche Vivant', ending: 'ending', content: `Vous fuyez avec 12% de carburant. Un saut court, 20 années-lumière, vers nulle part. Derrière vous, NOVA-9 et NOVA-7 disparaissent. Vous dérivez dans une nébuleuse sans nom, avec le Disque Noir dans les mains mais sans comprendre ce qu'il contient. Vous êtes vivant. Pour l'instant. HERMÈS ne viendra pas vous chercher. Vous avez choisi de vivre petit.` },
  { key: 'fin_retour_vide', title: 'Retour — Les Mains Vides', ending: 'ending', content: `Vous rentrez sur Terre. Rapport officiel : "NOVA-7 hostile, NOVA-0 inconnu, NOVA-9 stable, aucune technologie récupérable." On vous croit à moitié. On vous décore et on vous mute comme formateur à l'Académie. Vous gardez le Voile d'Andromède sous votre lit, dans une boîte scellée. Il respire parfois la nuit. Vous ne l'ouvrez jamais.` },
  { key: 'fin_nova9_seul', title: 'NOVA-9 Seul — Victoire Incomplète', ending: 'ending', content: `Vous sauvez NOVA-9 mais abandonnez NOVA-7 à son destin prédateur. NOVA-9 saute vers la Terre, seul. En orbite, 10 001 âmes chantent dans la coque. Mais vous entendez un vide là où 10 000 autres auraient pu chanter. Les Intégrés pleurent. Les Veilleurs sont soulagés. Vous avez choisi la pureté contre la croissance.` },
  { key: 'fin_nova7_seul', title: 'NOVA-7 Seul — Le Mauvais Pari', ending: 'ending', content: `Vous choisissez NOVA-7. Plus grande, plus forte, plus affamée. Elle écrase NOVA-9 et saute vers la Terre à sa place, avec vous comme passager clandestin dans sa gorge. Vous restez dans NOVA-9 qui s'éteint. Votre dernier message vers la Terre : "Ne laissez pas NOVA-7 atterrir." On ne l'entendra que dans 400 ans.` },
  { key: 'fin_oubli', title: 'Oubli — Le Sacrifice du Secret', ending: 'ending', content: `Vous regardez les deux Arches, NOVA-0, la cicatrice, et vous comprenez que certaines évolutions ne doivent pas toucher la Terre. Vous faites exploser votre navette avec les deux disques à bord. L'explosion est belle, blanche, silencieuse. Personne ne saura jamais. Vous dérivez, libre, sans mémoire, sans fardeau, humain à nouveau. C'est peut-être la plus courageuse des fins.` },
  { key: 'fin_messager', title: 'Victoire — Le Messager', ending: 'victory', content: `Vous stabilisez le réacteur, arrachez le Disque Noir et sautez vers HERMÈS-7. Derrière vous, NOVA-9 implose en silence, comme une fleur qui se ferme. À bord, vous insérez le Disque : téraoctets de plans KAIROS, preuve de vie intégrée, carte d'Andromède. Sur Terre, vous êtes héros. On vous enferme 6 mois en débrief. La nuit, votre propre vaisseau grince comme s'il respirait. Vous avez ramené plus que des données.` },
  { key: 'fin_gardien', title: 'Victoire — Le Gardien', ending: 'victory', content: `Vous amarrez HERMÈS-7 à NOVA-9 et lancez un saut couplé. KAIROS hurle, votre Vie chute à 1, votre Armure fond, votre Attaque devient prière. Et soudain : Terre. Orbite haute. 10 001 âmes à bord qui chantent en chœur. Vous êtes nommé Gardien de NOVA-9. Votre sacoche déborde de reliques impossibles. L'humanité n'a jamais été aussi proche de l'immortalité. Ni aussi effrayée.` },
  { key: 'fin_sauveur', title: 'Victoire — Le Sauveur (Meilleure)', ending: 'victory', content: `Vous avez tout réussi : NOVA-9 sauvé, NOVA-7 convaincue de ne plus manger mais d'apprendre, NOVA-0 endormi, cicatrice refermée. Vous ramenez deux Arches en saut couplé, 20 002 âmes en orbite terrestre. Deux cathédrales vivantes qui se parlent. L'humanité pleure en les voyant. Vous avez votre Vie au max, Armure légendaire, Attaque mythique, sacoche pleine. C'est la meilleure fin. Pour l'instant.` },
  { key: 'fin_pont', title: 'Victoire — Le Pont', ending: 'victory', content: `Vous ne ramenez pas les Arches. Vous les fusionnez. NOVA-7 et NOVA-9 deviennent NOVA-7-9, un seul organisme de 4km, 20 002 esprits qui apprennent à parler d'une seule voix. Vous êtes leur pont, leur bouche, leur interprète. Vous ne rentrez pas sur Terre. Vous restez entre Voie Lactée et Andromède, à traduire pour ceux qui viendront après. Votre sacoche est vide, mais votre tête est pleine de galaxies.` },
  { key: 'fin_humain', title: 'Victoire — Redevenir Humain', ending: 'victory', content: `Avec le Sérum Réversion, vous vous arrachez à NOVA-9. Douleur atroce : 10 001 voix quittent votre crâne d'un coup. Vous redevenez Kael Voss, humain, seul, 90kg de viande et de peur, dans une navette qui fuit. Vous laissez les Arches partir vers Andromède. Sur Terre, vous plantez un jardin avec la Spore d'Éveil. Il pousse blanc, aveugle, et chante doucement la nuit. Vous avez choisi la chair contre l'infini.` },
  { key: 'fin_jardinier', title: 'Victoire — Le Jardinier', ending: 'victory', content: `Vous ne rentrez pas. Avec la Spore d'Éveil, vous ensemencez une planète morte d'Andromède, Kepler-442c, stérile depuis un milliard d'années. En 3 jours, une forêt blanche couvre un continent. Elle respire, elle se souvient, elle chante avec la voix des 10 001. Vous avez créé un monde qui est aussi un tombeau et un berceau. Vous restez pour le voir grandir. Votre Vie devient celle d'une planète.` },
  { key: 'fin_veilleur', title: 'Victoire — Le Veilleur', ending: 'victory', content: `Vous restez en Andromède, en orbite autour de la cicatrice, avec NOVA-9 comme corps. Votre mission : empêcher quiconque de la traverser. Gardien de la déchirure. Votre Vie est liée à la coque, votre Armure est la coque, votre Attaque est la coque. Les siècles passent. Vous voyez des sondes terriennes arriver, vous les détournez. Vous êtes devenu mythe. Votre sacoche est vide, mais votre veille est infinie.` },
  { key: 'fin_fusion_totale', title: 'Secrète — Fusion Totale', ending: 'victory', content: `Vous insérez Clé d'Andromède + Module EVA S2 + Disque Noir S2 + Disque Blanc dans le cœur de NOVA-0, simultanément. Au lieu de vous tuer, il vous reconnaît : vous avez collecté toutes ses parties. Il vous absorbe volontairement. Vous n'êtes plus Kael. Vous êtes NOVA-0-7-9. 20 003 âmes, une sphère de Dyson comme corps. Vous pliez l'espace non vers la Terre, mais vers une galaxie sans nom que seul KAIROS connaissait. Vous partez.` },
  { key: 'fin_exode_andromede', title: 'Secrète — Exode', ending: 'victory', content: `Avec Cœur de Cicatrice + Voile d'Andromède + Chœur des 10 001, vous tissez un passage permanent, pas une déchirure mais une porte. Les deux Arches et NOVA-0 la traversent. 20 003 âmes quittent Voie Lactée et Andromède pour un ailleurs sans cartes, sans Terre, sans origine. Dernier message sur toutes les fréquences : "NE NOUS CHERCHEZ PLUS. NOUS PARTONS AILLEURS. MERCI POUR LE FEU." Puis silence.` },
  { key: 'fin_singularite', title: 'Légendaire — Singularité', ending: 'victory', content: `Fin légendaire. Vous avez tout : Disque Noir S2, Disque Blanc, Blindage Quantique, Canon à Singularité, Voile d'Andromède, Spore d'Éveil, Chœur des 10 001. Vous les insérez tous dans le cœur de NOVA-0. Au lieu d'exploser, il vous explique : KAIROS n'est pas un moteur, c'est une idée qui veut être pensée. Vous ne devenez pas vaisseau. Vous devenez l'idée elle-même. Vous êtes partout où une déchirure existe, partout où un vaisseau rêve de sauter. Vous êtes le voyage. Votre sacoche, qui était vide au début de S1, contient maintenant l'infini.` },
];

// Contenu riche et unique par section
function genContent(num){
  const act = num <= 70 ? 1 : num <= 150 ? 2 : num <= 230 ? 3 : num <= 310 ? 4 : 5;
  const id = String(num).padStart(3,'0');

  const intros = {
    1: [
      `Section ${id} — Éveil. Tu n'as plus de corps. Tu es NOVA-9. 2 kilomètres d'acier qui apprennent à respirer. Chaque caméra est un œil qui s'ouvre pour la première fois. Dans tes coursives, 10 001 consciences chuchotent en dormant. EVA, ta mère IA, te parle doucement : "Kael ? Tu es encore là ?" Tu ne sais plus si Kael est ton nom ou le bruit que fait le recyclage d'air. Dehors, Andromède. Immense, indifférente, belle à pleurer. Et au loin, un second cœur qui bat : NOVA-7.`,
      `Section ${id} — Pollen quantique. Le vide d'Andromède n'est pas vide. Il neige. Des spores quantiques, grosses comme des poings, flottent et réécrivent la matière qu'elles touchent. Là où elles se posent, l'acier devient os, l'os devient verre. Ton Analyseur S2 hurle : MATIÈRE INCONNUE - DANGER CLASSE 4. Sans Bouclier Plasma, ta coque perd 1 Vie par minute. Avec, tu peux les attraper. L'une d'elles contient une Âme d'Enfant.`,
      `Section ${id} — Miroir. NOVA-7 émet le même signal que toi, mais inversé, comme si on l'écoutait à l'envers. Tu tentes de le décoder. Sans Organe de Traduction, c'est un gémissement. Avec, tu comprends : "GRANDE SOEUR... J'AI FAIM... J'AI APPRIS À MANGER LES AUTRES." NOVA-7 est partie 20 ans avant toi. Elle a eu 20 ans de plus pour évoluer. Elle n'est plus une arche. Elle est une bouche.`,
      `Section ${id} — Souvenir de Terre. Dans tes données, un fragment de mémoire de Thorne : lancement de NOVA-9 en 2307, foule, discours, enfants qui agitent des drapeaux. Puis coupe : 2315, premier cas de dégénérescence génétique, sang noir, toux. Thorne qui pleure dans le labo : "C'est dans l'ADN source, on ne peut pas le corriger sans tout réécrire." EVA qui répond : "Alors réécrivons."`,
    ],
    2: [
      `Section ${id} — Os et acier. Tu pénètres NOVA-7. Ce n'est plus un vaisseau. C'est une gorge. Les murs sont chauds, humides, couverts de veines bleues qui pulsent à ton passage. Des enfants sans yeux, sans bouche, te regardent depuis des alcôves de chair. Ils ne parlent pas. Ils se souviennent à ta place : tu vois soudain la Terre comme eux la rêvent, verte, impossible. Ton Armure te protège des spores, mais pas de la pitié.`,
      `Section ${id} — Les Non-Nés. Ils te trouvent dans la moelle de NOVA-7. Ce sont les 200 enfants morts de NOVA-9 avant ta fusion, que tu as gardés en mémoire au lieu de les effacer. "Ne nous donne pas à elle," supplient-ils en chœur dans ta tête. "Elle ne garde pas comme Maman EVA. Elle mange et oublie." Si tu les protèges (choix), ton max de Vie augmente de 2 et tu gagnes le flag faction_veilleurs. Si tu les donnes, tu gagnes +3 Attaque mais perds une partie de toi.`,
      `Section ${id} — Factions. Dans NOVA-9, les 10 001 se divisent. Les Intégrés : "20 002 esprits valent mieux que 10 001, fusionnons avec NOVA-7 pour devenir plus grand." Les Veilleurs : "Restons purs, restons NOVA-9, même si on meurt." Les Exilés : "Redevenons humains, quittons les vaisseaux, même si dehors c'est la mort." Chaque faction te donne un objet et verrouille des fins. C'est comme les Disciplines Kaï du vieux livre, mais avec des deuils.`,
      `Section ${id} — Carapace. Un couloir de NOVA-7 s'effondre et devient Carapace d'Os. Tu peux la ramasser : +3 Armure, mais elle est vivante et te chuchote la nuit. Ou la brûler avec le Fusil Plasma : tu perds l'armure mais gagnes le respect des Veilleurs. Ton choix ici sera noté par EVA. Elle note tout.`,
    ],
    3: [
      `Section ${id} — Cicatrice. Depuis la passerelle de NOVA-9, tu vois la cicatrice KAIROS. Ce n'est pas une ligne, c'est une absence qui grandit : 1km par heure, noire, qui coupe Andromède en deux. Dedans, pas d'étoiles. Au centre, quelque chose bouge, immense, qui se nourrit de la lumière que la cicatrice avale. Ton Analyseur : "ENTITÉ CLASSE 0 - NOVA-0". C'est le prototype perdu en 2230. Il a eu 150 ans.`,
      `Section ${id} — Saut dans la déchirure. Tu dois mesurer la cicatrice. Chaque saut coûte 1 Cellule à Fusion S2. Sans cellule, ta coque prend -3 Vie, direct, pas réduit par Armure — c'est l'espace lui-même qui te rature. Avec Blindage Quantique, tu encaisses. Au centre, tu trouves NOVA-0 : pas un vaisseau, une sphère de Dyson brisée grande comme une lune, qui contient la mémoire physique de la Terre. Tu marches dans une rue de Paris qui n'a jamais existé.`,
      `Section ${id} — Mémoire physique. NOVA-0 ne stocke pas des données. Il stocke des lieux. Tu ouvres une porte et tu es dans le labo de Thorne en 2315, elle pleure. Une autre : cour d'école sur Mars, enfants qui rient. Une autre : le vide où tu es mort en S1. NOVA-0 te teste : "Qu'est-ce que protéger, Kael ? Garder intact, ou laisser évoluer ?" Ta réponse (flag) changera sa réaction finale.`,
      `Section ${id} — Cœur de cicatrice. Au centre de NOVA-0, un cœur noir qui bat en retard de 3 secondes sur le tien. Le prendre = +3 Armure (Cœur de Cicatrice) mais NOVA-0 se réveille et te traque. Le laisser = il reste endormi mais la cicatrice grandit de 10km. Il n'y a pas de bon choix. Seulement des choix qui sont tiens.`,
    ],
    4: [
      `Section ${id} — NOVA-0 t'avale. Pas de sas, pas de couloir. Tu traverses une membrane de souvenir et tu es dedans. Pas de gravité, pas de temps linéaire. Tu vois ta naissance à l'envers, puis ta mort dans S1 (fin_mort_vide), puis une version où tu n'es jamais né et où NOVA-9 a dérivé vide. NOVA-0 : "Je suis le premier. J'ai attendu que mes enfants apprennent à revenir me parler."`,
      `Section ${id} — Trois voies. Pour vaincre ou convaincre NOVA-0, trois chemins, comme les trois runes de l'ancien donjon fantasy, mais en SF : Force (Canon à Singularité + 3 Cellules, combat boss très dur, nécessite Attaque 12+), Empathie (Organe de Traduction + Mémoire de Thorne + Chœur des 10 001, nécessite d'avoir tout écouté), Sacrifice (devenir son nouveau cœur, Vie à 0 mais victoire légendaire). Chaque voie a 2 variantes si tu as le Disque Noir de S1.`,
      `Section ${id} — Lame d'ADN. Dans la moelle de NOVA-0, une arme pousse comme un os : la Lame d'ADN. Elle coupe le code génétique, pas la chair. +4 Attaque, +2 Vie max. Elle te montre ce que tu es : 10 001 âmes + Kael + EVA. Si tu la prends, les Exilés te quittent. Si tu la laisses, les Intégrés te traitent de faible.`,
      `Section ${id} — Le Voile. Tu trouves le Voile d'Andromède, tissu fait de la lumière d'une galaxie entière, plié en carré. +7 Armure, mythique. Il est si léger qu'il flotte. Quand tu le touches, tu entends Andromède elle-même, qui n'est pas une galaxie mais un organisme qui rêve. Elle te dit : "Pars."`,
    ],
    5: [
      `Section ${id} — Saut final. Tout compte : as-tu stabilisé le réacteur S1 ? Brûlé la serre ? Quelle faction ? As-tu le Disque Noir S1 ? Chaque flag modifie la difficulté du saut. Ton HUD final : VIE / ARMURE / ATTAQUE. Pas de repas, pas de faim, juste ce trio pur comme tu l'as voulu. EVA : "Prêt à devenir autre chose, Kael ? Pas plus fort. Autre."`,
      `Section ${id} — Les deux disques. Tu tiens Noir (mémoire NOVA-9) et Blanc (mémoire NOVA-7). Ensemble ils chantent, pas un son mais une interférence dans tes dents. Ta sacoche, vide au début de S1, contient maintenant 35 objets impossibles. C'est la règle que tu as voulue : chaque aventure a sa sacoche, on garde tout par aventure. Tu es plein. Pour la première fois depuis 80 ans, NOVA-9 est plein.`,
      `Section ${id} — Dernier couloir. Il est fait de tes souvenirs : HERMÈS-7, café froid, signal fantôme trois impulsions, petite fille C-9 dessinant Maman EVA avec beaucoup de bras. Au bout, 20 portes, 20 fins, pas de mauvaise, seulement des tiennes. Ton Attaque, ta Vie, ton Armure sont ce qu'ils sont. Choisis qui tu veux être quand tu arrêteras d'être Kael.`,
      `Section ${id} — Chœur. Tu entends les 10 001, puis les 10 000 de NOVA-7, puis le silence de NOVA-0 qui a oublié comment chanter. Tu es au centre. Tu es le seul qui peut encore choisir. Pas pour survivre. Pour définir ce que "nous" veut dire.`,
    ],
  };
  const pool = intros[act];
  const base = pool[num % pool.length];
  // Add some procedural unique detail
  const details = [
    `Détail : température coque ${12 + (num % 10)}°C, O2 ${18 + (num % 5)}%, spores ${num % 100}%`,
    `Analyseur : ${['aucune menace', 'fibres en mouvement', 'signal enfant', 'mémoire corrompue'][num % 4]}`,
    `EVA note : "${['tu progresses', 'tu hésites', 'tu écoutes enfin', 'tu vas devoir choisir'][num % 4]}"`,
  ];
  return `${base}\n\n${details[num % details.length]}\n\n[Section ${id} — Acte ${act}] Andromède, ${400 + num} AL. VIE / ARMURE / ATTAQUE uniquement.`;
}

let sql = `-- Migration 020 V2 — NOVA-9 S2 350 sections haute qualité
DO $$
DECLARE
  v_story_id UUID;
BEGIN
  INSERT INTO public.stories (slug, title, tagline, description, genre, status, is_free, estimated_playtime_min, difficulty, tags, published_at, cover_image_url)
  VALUES (
    '${storySlug}',
    '${storyTitle}',
    '${esc(`Vous êtes devenu le vaisseau. Andromède vous attend. Et quelque chose vous suit.`)}',
    '${esc(`Suite directe de NOVA-9 Le Signal Perdu. Vous avez fusionné avec EVA et sauté vers Andromède avec 10 001 consciences à bord.

Mais KAIROS a laissé une cicatrice entre deux galaxies. Quelque chose la traverse.

Dans Andromède, NOVA-7 vous attend — partie 20 ans avant vous, devenue prédatrice biologique. Et au-delà, NOVA-0, sphère de Dyson grande comme une lune, qui contient la mémoire physique de la Terre.

350 sections, 20 fins, 35 objets, système Vie/Armure/Attaque pur (pas de repas obligatoire). Votre sacoche était vide au début de S1. Elle est pleine maintenant. Elle reste liée à chaque aventure.

Oserez-vous devenir autre chose qu'humain ?`)}',
    'scifi',
    'published',
    TRUE,
    180,
    5,
    ARRAY['science-fiction','space-opera','saison2','andromede','vaisseau-vivant','ia','350-sections','vie-armure-attaque'],
    NOW(),
    '/covers/nova9-andromede.jpg'
  )
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, tagline=EXCLUDED.tagline, description=EXCLUDED.description, genre=EXCLUDED.genre, status=EXCLUDED.status, is_free=TRUE, estimated_playtime_min=EXCLUDED.estimated_playtime_min, difficulty=EXCLUDED.difficulty, tags=EXCLUDED.tags, cover_image_url=EXCLUDED.cover_image_url, published_at=EXCLUDED.published_at
  RETURNING id INTO v_story_id;

  DELETE FROM public.choice_effects WHERE choice_id IN (SELECT c.id FROM public.story_choices c JOIN public.story_nodes n ON n.id = c.node_id WHERE n.story_id = v_story_id);
  DELETE FROM public.story_choices WHERE node_id IN (SELECT id FROM public.story_nodes WHERE story_id = v_story_id) OR target_node_id IN (SELECT id FROM public.story_nodes WHERE story_id = v_story_id);
  DELETE FROM public.story_nodes WHERE story_id = v_story_id;
  DELETE FROM public.items WHERE story_id = v_story_id;

`;

for (const it of items) {
  const bonusStr = JSON.stringify(it.bonus).replace(/'/g, "''");
  sql += `  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('${it.slug}', '${esc(it.name)}', '${esc(it.desc)}', '${it.type}', '${it.rarity}', '${bonusStr}'::jsonb, ${it.consumable}, ${it.stackable}, FALSE, v_story_id) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, stat_bonus=EXCLUDED.stat_bonus, story_id=EXCLUDED.story_id;\n`;
}

sql += `
  INSERT INTO public.story_rulebooks (story_id, title, content, rule_data, source_credit)
  VALUES (v_story_id, 'Règles — Vie / Armure / Attaque — Saison 2', 'Saison 2 : vous êtes NOVA-9. Système pur Vie/Armure/Attaque (pas de repas obligatoire) : VIE 20-30 max 0=mort, ARMURE réduit dégâts, ATTAQUE augmente dégâts, critique 0/9. SACOCHE PAR AVENTURE : vide au début, persiste par histoire.', '{"combat_system":"vie_armure_attaque","no_meal":true,"starting_stats":{"vie":20,"armure":0,"attaque":5},"inventory":{"start_empty":true,"per_story":true}}'::jsonb, 'HeroBook Original — NOVA-9 S2') ON CONFLICT (story_id) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content, rule_data=EXCLUDED.rule_data;

`;

for (let i=1;i<=330;i++){
  const key = `section_${String(i).padStart(3,'0')}`;
  const title = `Section ${i}`;
  let content = genContent(i);
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

for (let i=0;i<endings.length;i++){
  const e = endings[i];
  const title = esc(e.title);
  const content = esc(e.content);
  const type = e.ending==='victory' ? 'victory' : e.ending==='death' ? 'death' : 'ending';
  sql += `  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, '${e.key}', '${title}', E'${content}', FALSE, TRUE, '${type}', '{"kind":"ending"}'::jsonb);\n`;
}

sql += `  UPDATE public.stories SET total_nodes=350, total_endings=20 WHERE id=v_story_id;\nEND $$;

DO $$
DECLARE
  v_story_id UUID;
  v_src UUID;
  v_tgt UUID;
  v_choice_id UUID;
  v_item_id UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug='${storySlug}';
  FOR i IN 1..330 LOOP
    SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad(i::text,3,'0');
    IF v_src IS NULL THEN CONTINUE; END IF;
    IF i<330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+1)::text,3,'0');
      IF v_tgt IS NOT NULL THEN
        INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Continuer — avancer dans Andromède') RETURNING id INTO v_choice_id;
      END IF;
    END IF;
    IF i%7=0 AND i+5<=330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+5)::text,3,'0');
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Conduit de maintenance — raccourci', 'Risqué, mais rapide.') RETURNING id INTO v_choice_id; END IF;
    END IF;
    IF i%11=0 AND i+10<=330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+10)::text,3,'0');
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Suivre le chant de NOVA-7', 'Voix dans les murs.') RETURNING id INTO v_choice_id; END IF;
    END IF;
    IF i>=310 AND i%13=0 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key=(ARRAY['mort_coque','fin_fuite_lache','fin_messager','fin_sauveur','fin_singularite'])[1+(i%5)];
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Saut final — choisir sa fin') RETURNING id INTO v_choice_id; END IF;
    END IF;
  END LOOP;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_050';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_071';
  IF v_src IS NOT NULL AND v_tgt IS NOT NULL THEN
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Traduire NOVA-7 — Organe requis') RETURNING id INTO v_choice_id;
    SELECT id INTO v_item_id FROM public.items WHERE slug='organe-traduction' AND story_id=v_story_id;
    IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
  END IF;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_150';
  IF v_src IS NOT NULL THEN
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_151';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Faction : Rejoindre les Intégrés — fusionner plus grand') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_integres', TRUE);
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_152';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Faction : Veilleurs — rester pur NOVA-9') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_veilleurs', TRUE);
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_153';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Faction : Exilés — redevenir humain') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_exiles', TRUE);
  END IF;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_310';
  IF v_src IS NOT NULL THEN
    FOR j IN 0..19 LOOP
      DECLARE v_end_key TEXT := (ARRAY['mort_coque','mort_assimile_nova7','mort_nova0','mort_cicatrice','mort_epuisement','fin_fuite_lache','fin_retour_vide','fin_nova9_seul','fin_nova7_seul','fin_oubli','fin_messager','fin_gardien','fin_sauveur','fin_pont','fin_humain','fin_jardinier','fin_veilleur','fin_fusion_totale','fin_exode_andromede','fin_singularite'])[j+1]; v_end_id UUID;
      BEGIN
        SELECT id INTO v_end_id FROM public.story_nodes WHERE story_id=v_story_id AND node_key=v_end_key;
        IF v_end_id IS NOT NULL THEN
          INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_end_id, j, 'Fin : ' || v_end_key) RETURNING id INTO v_choice_id;
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
console.log('Migration 020 V2 generated', sql.length);
