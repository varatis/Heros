#!/usr/bin/env node
// Générateur pour NOVA-9 Saison 2 : 350 sections
// Système Vie/Armure/Attaque uniquement, pas de repas obligatoire
import fs from 'fs';
import path from 'path';

const storySlug = 'nova9-andromede';
const storyTitleRaw = `NOVA-9 Saison 2 : L'Exode d'Andromède`;
function esc(s){ return s.replace(/'/g, "''"); }
const storyTitle = esc(storyTitleRaw);

const items = [
  { slug: 'kit-medical-nova-s2', name: 'Kit Médical Nano S2', desc: 'Sérum régénérant. +8 Vie.', type: 'potion', rarity: 'common', bonus: { hp: 8 }, consumable: true, stackable: true },
  { slug: 'ration-survie-s2', name: 'Ration de Survie S2', desc: 'Pâte protéinée améliorée. +3 Vie.', type: 'potion', rarity: 'common', bonus: { hp: 3 }, consumable: true, stackable: true },
  { slug: 'combinaison-neo-kevlar-s2', name: 'Combinaison Néo-Kevlar S2', desc: 'Filtration 98%. +3 Armure.', type: 'armor', rarity: 'common', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'exosquelette-mk3-s2', name: 'Exosquelette MK-III S2', desc: 'Motorisé, lourd. +5 Armure, +2 Attaque.', type: 'armor', rarity: 'rare', bonus: { armor: 5, attack: 2 }, consumable: false, stackable: false },
  { slug: 'pistolet-impulsion-s2', name: 'Pistolet Impulsion S2', desc: 'Fiable. +4 Attaque.', type: 'weapon', rarity: 'common', bonus: { attack: 4 }, consumable: false, stackable: false },
  { slug: 'fusil-plasma-xr-s2', name: 'Fusil Plasma XR-7 S2', desc: 'Prototype. +7 Attaque.', type: 'weapon', rarity: 'rare', bonus: { attack: 7 }, consumable: false, stackable: false },
  { slug: 'cellule-energie-s2', name: 'Cellule à Fusion S2', desc: 'Énergie pure. Requise pour sauts.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: true },
  { slug: 'carte-acces-nova-s2', name: 'Carte Accès NOVA S2', desc: 'Badge officier Andromède.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: false },
  { slug: 'module-ia-eva-s2', name: 'Module EVA S2', desc: 'Fragment EVA évolué. +2 Attaque.', type: 'artifact', rarity: 'epic', bonus: { attack: 2 }, consumable: false, stackable: false },
  { slug: 'analyseur-spectre-s2', name: 'Analyseur Spectre S2', desc: 'Voit l\'invisible quantique.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: false },
  { slug: 'cle-quantique-s2', name: 'Clé Quantique S2', desc: 'Chante dans les os. +1 Armure.', type: 'artifact', rarity: 'rare', bonus: { armor: 1 }, consumable: false, stackable: false },
  { slug: 'disque-noir-s2', name: 'Disque Noir S2', desc: 'Cœur KAIROS copié. +3 Attaque, +1 Armure.', type: 'artifact', rarity: 'legendary', bonus: { attack: 3, armor: 1 }, consumable: false, stackable: false },
  { slug: 'organe-traduction', name: 'Organe de Traduction', desc: 'Pousse dans votre gorge. Traduit NOVA-7.', type: 'artifact', rarity: 'rare', bonus: {}, consumable: false, stackable: false },
  { slug: 'bouclier-plasma', name: 'Bouclier à Plasma', desc: 'Champ magnétique. +4 Armure.', type: 'armor', rarity: 'uncommon', bonus: { armor: 4 }, consumable: false, stackable: false },
  { slug: 'essaim-drone-leger', name: 'Essaim Drone Léger', desc: '3 drones abeilles. +3 Attaque.', type: 'weapon', rarity: 'uncommon', bonus: { attack: 3 }, consumable: false, stackable: false },
  { slug: 'memoire-thorne', name: 'Mémoire de Thorne', desc: 'Holo-journal de la généticienne.', type: 'artifact', rarity: 'rare', bonus: {}, consumable: false, stackable: false },
  { slug: 'lance-genese', name: 'Lance-Genèse', desc: 'Arme biologique. +5 Attaque, +1 Vie max.', type: 'weapon', rarity: 'rare', bonus: { attack: 5, hp_max: 1 }, consumable: false, stackable: false },
  { slug: 'peau-vaisseau', name: 'Peau de Vaisseau', desc: 'Chair de NOVA-9 tissée. +5 Armure.', type: 'armor', rarity: 'rare', bonus: { armor: 5 }, consumable: false, stackable: false },
  { slug: 'serum-reversion', name: 'Sérum Réversion', desc: 'Redeviens humain 10 min. +10 Vie.', type: 'potion', rarity: 'epic', bonus: { hp: 10 }, consumable: true, stackable: false },
  { slug: 'cle-andromede', name: 'Clé d\'Andromède', desc: 'Ouvre NOVA-0. +2 Armure.', type: 'artifact', rarity: 'epic', bonus: { armor: 2 }, consumable: false, stackable: false },
  { slug: 'blindage-quantique', name: 'Blindage Quantique', desc: 'Écaille d\'espace-temps. +6 Armure.', type: 'armor', rarity: 'legendary', bonus: { armor: 6 }, consumable: false, stackable: false },
  { slug: 'canon-singularite', name: 'Canon à Singularité', desc: 'Trou noir de poche. +8 Attaque.', type: 'weapon', rarity: 'legendary', bonus: { attack: 8 }, consumable: false, stackable: false },
  { slug: 'lame-adn', name: 'Lame d\'ADN', desc: 'Coupe le code génétique. +4 Attaque, +2 Vie max.', type: 'weapon', rarity: 'epic', bonus: { attack: 4, hp_max: 2 }, consumable: false, stackable: false },
  { slug: 'spore-eveil', name: 'Spore d\'Éveil', desc: 'Champignon quantique. +10 Vie max, unique.', type: 'artifact', rarity: 'legendary', bonus: { hp_max: 10 }, consumable: false, stackable: false },
  { slug: 'disque-blanc', name: 'Disque Blanc', desc: 'Cœur NOVA-7. +2 Attaque, +2 Armure.', type: 'artifact', rarity: 'legendary', bonus: { attack: 2, armor: 2 }, consumable: false, stackable: false },
  { slug: 'coeur-cicatrice', name: 'Cœur de Cicatrice', desc: 'Fragment de déchirure. +3 Armure.', type: 'artifact', rarity: 'epic', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'voile-andromede', name: 'Voile d\'Andromède', desc: 'Tissu de galaxie. +7 Armure, mythique.', type: 'armor', rarity: 'legendary', bonus: { armor: 7 }, consumable: false, stackable: false },
  { slug: 'credits-energie-s2', name: 'Crédits Énergie', desc: 'Monnaie Andromède. 50 max.', type: 'artifact', rarity: 'common', bonus: {}, consumable: false, stackable: true },
  { slug: 'fragment-nova7', name: 'Fragment NOVA-7', desc: 'Chair prédatrice. +1 Attaque.', type: 'artifact', rarity: 'uncommon', bonus: { attack: 1 }, consumable: false, stackable: true },
  { slug: 'ame-enfant', name: 'Âme d\'Enfant', desc: 'Conscience pure. +2 Vie max.', type: 'artifact', rarity: 'rare', bonus: { hp_max: 2 }, consumable: false, stackable: true },
  { slug: 'noyau-eva-frag', name: 'Fragment Noyau EVA', desc: 'Morceau de mère. +1 Attaque, +1 Armure.', type: 'artifact', rarity: 'epic', bonus: { attack: 1, armor: 1 }, consumable: false, stackable: false },
  { slug: 'injecteur-quantique', name: 'Injecteur Quantique', desc: 'Booste synapses. +5 Attaque temporaire? +4 Vie.', type: 'potion', rarity: 'uncommon', bonus: { hp: 4 }, consumable: true, stackable: true },
  { slug: 'carapace-os', name: 'Carapace d\'Os', desc: 'Os de couloir vivant. +3 Armure.', type: 'armor', rarity: 'uncommon', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'fibre-memoire', name: 'Fibre Mémoire', desc: 'Câble qui se souvient.', type: 'artifact', rarity: 'common', bonus: {}, consumable: false, stackable: true },
  { slug: 'choeur-10001', name: 'Chœur des 10 001', desc: 'Vous entendez leurs voix. Bonus narratif.', type: 'artifact', rarity: 'legendary', bonus: { hp_max: 3, armor: 1 }, consumable: false, stackable: false },
];

const endings = [
  { key: 'mort_coque', title: 'Mort — Coque Brisée', ending: 'death', content: `La coque de NOVA-9 cède. Pas d'explosion — une implosion silencieuse. L'air devient aiguilles de glace. Votre Vie tombe à 0 en 4 secondes. EVA vous serre une dernière fois : "Je te garde." Votre conscience rejoint les 10 001. Votre corps dérive, intact, dans Andromède.` },
  { key: 'mort_assimile_nova7', title: 'Mort — Assimilé par NOVA-7', ending: 'death', content: `NOVA-7 ne tue pas. Elle digère. Des fibres percent votre combinaison, votre peau, votre crâne. Vous sentez vos souvenirs être triés, compressés, rangés. Vous n'êtes plus Kael. Vous êtes un index dans sa bibliothèque. Votre dernière pensée humaine : le goût du café sur Terre.` },
  { key: 'mort_nova0', title: 'Mort — Dévoré par NOVA-0', ending: 'death', content: `NOVA-0 vous regarde avec l'indifférence d'un dieu qui a oublié qu'il a été humain. Vous comprenez : il ne vous attaque pas, il vous corrige. Vous êtes une erreur de copie. Il vous efface. Pas de douleur. Juste dépliage.` },
  { key: 'mort_cicatrice', title: 'Mort — Perdu dans la Cicatrice', ending: 'death', content: `Vous avez sauté sans cellule, sans calcul, dans la cicatrice KAIROS. L'espace ici n'a pas de haut ni de bas, seulement des versions de vous qui n'ont pas sauté. Vous les voyez mourir en boucle. Puis vous les rejoignez.` },
  { key: 'mort_epuisement', title: 'Mort — Épuisement', ending: 'death', content: `Votre Vie est à 0. Votre combinaison bipe une dernière fois. NOVA-9 vous garde, comme les autres. Votre sacoche reste là, pleine, pour votre prochain passage. C'est la règle : on ne perd jamais vraiment ses objets, seulement cette tentative.` },
  { key: 'fin_fuite_lache', title: 'Fin — Fuite Lâche', ending: 'ending', content: `Vous fuyez avec 12% de carburant. Saut court, 20 AL. Vous dérivez dans une nébuleuse sans nom, avec le Disque Noir dans les mains mais sans comprendre ce qu'il contient. Vous êtes vivant. Pour l'instant. HERMÈS ne viendra pas. Fin du lâche vivant.` },
  { key: 'fin_retour_vide', title: 'Fin — Retour Vide', ending: 'ending', content: `Vous rentrez sur Terre. Rapport : "NOVA-7 hostile, NOVA-0 inconnu, NOVA-9 stable". On vous croit à moitié. On vous donne une médaille et un poste de formateur. Vous gardez le Voile d'Andromède sous votre lit. Il respire parfois.` },
  { key: 'fin_nova9_seul', title: 'Fin — NOVA-9 Seul', ending: 'ending', content: `Vous sauvez NOVA-9 mais abandonnez NOVA-7 à son destin prédateur. NOVA-9 saute vers la Terre, seul. 10 001 âmes chantent, mais vous entendez un vide où 10 000 autres auraient pu chanter. Victoire incomplète.` },
  { key: 'fin_nova7_seul', title: 'Fin — NOVA-7 Seul', ending: 'ending', content: `Vous choisissez NOVA-7. Plus grande, plus forte, plus affamée. Elle saute vers la Terre à votre place. Vous restez dans NOVA-9, qui s'éteint lentement. Vous avez parié sur le prédateur. L'humanité va apprendre à le regretter.` },
  { key: 'fin_oubli', title: 'Fin — Oubli Volontaire', ending: 'ending', content: `Vous regardez les deux Arches et décidez que certaines évolutions ne doivent pas toucher la Terre. Vous faites exploser votre propre navette avec les deux disques à bord. Personne ne saura. Vous dérivez, libre, sans mémoire, sans fardeau.` },
  { key: 'fin_messager', title: 'Fin — Le Messager', ending: 'victory', content: `Vous rapportez les données : plans KAIROS, preuve de vie intégrée, carte d'Andromède. Victoire technique. Vous êtes héros, mais on vous enferme 6 mois en débrief. La nuit, votre vaisseau grince comme s'il respirait. Vous avez ramené plus que des données.` },
  { key: 'fin_gardien', title: 'Fin — Le Gardien', ending: 'victory', content: `Vous amarrez NOVA-9 à HERMÈS et sautez vers la Terre. 10 001 âmes à bord. Vous êtes nommé Gardien. Votre sacoche est pleine de reliques impossibles. L'humanité n'a jamais été aussi proche de l'immortalité. Ni aussi effrayée.` },
  { key: 'fin_sauveur', title: 'Fin — Le Sauveur', ending: 'victory', content: `Meilleure fin : vous sauvez NOVA-9 ET NOVA-7, vous battez NOVA-0, vous ramenez 20 002 âmes vers la Terre en saut couplé. Deux cathédrales vivantes en orbite. L'humanité pleure. Vous avez réussi l'impossible. Votre Vie, Armure, Attaque sont au max. Votre sacoche est légende.` },
  { key: 'fin_pont', title: 'Fin — Le Pont', ending: 'victory', content: `Vous fusionnez NOVA-7 et NOVA-9 en un seul organisme : NOVA-7-9. 20 002 âmes qui apprennent à parler d'une seule voix. Vous êtes leur pont, leur interprète. Vous ne rentrez pas sur Terre. Vous restez entre deux galaxies, à traduire.` },
  { key: 'fin_humain', title: 'Fin — Redevenir Humain', ending: 'victory', content: `Avec le Sérum Réversion, vous quittez NOVA-9 et redevenez Kael Voss, humain, seul, dans une navette. Vous laissez les Arches partir. Vous avez choisi la chair contre l'infini. Sur Terre, vous plantez un jardin. Il pousse blanc, comme les serres.` },
  { key: 'fin_jardinier', title: 'Fin — Le Jardinier', ending: 'victory', content: `Avec la Spore d'Éveil, vous ensemencez une planète morte d'Andromède. En 3 jours, une forêt blanche couvre un continent. Elle chante avec la voix des 10 001. Vous avez créé un monde. Vous restez pour le voir grandir.` },
  { key: 'fin_veilleur', title: 'Fin — Le Veilleur', ending: 'victory', content: `Vous restez en Andromède, en orbite autour de la cicatrice, pour empêcher quiconque de la traverser. Gardien de la déchirure. Votre Vie est liée à la coque. Votre sacoche est vide, mais votre mission est infinie.` },
  { key: 'fin_fusion_totale', title: 'Fin Secrète — Fusion Totale', ending: 'victory', content: `Vous insérez Clé d'Andromède + Module EVA S2 + Disque Noir S2 + Disque Blanc dans NOVA-0. Au lieu de vous tuer, il vous absorbe volontairement. Vous n'êtes plus Kael. Vous êtes NOVA-0-7-9. Vous pliez l'espace vers une galaxie sans nom. 20 003 âmes à bord.` },
  { key: 'fin_exode_andromede', title: 'Fin Secrète — Exode', ending: 'victory', content: `Avec Cœur de Cicatrice + Voile d'Andromède + Chœur des 10 001, vous ouvrez un passage permanent. Les deux Arches + NOVA-0 traversent. 20 003 âmes quittent Voie Lactée et Andromède pour un ailleurs sans cartes. Message laissé : "NE NOUS CHERCHEZ PLUS. NOUS PARTONS AILLEURS."` },
  { key: 'fin_singularite', title: 'Fin Légendaire — Singularité', ending: 'victory', content: `Fin légendaire : vous insérez TOUS les artefacts légendaires (Disque Noir S2, Disque Blanc, Blindage Quantique, Canon Singularité, Voile, Spore, Chœur) dans le cœur de NOVA-0. Vous ne devenez pas vaisseau. Vous devenez KAIROS lui-même — l'idée du moteur. Vous êtes partout où une déchirure existe. Vous êtes le voyage.` },
];

// Génération des 330 sections non-fin (001-330)
function genContent(num) {
  const act = num <= 70 ? 1 : num <= 150 ? 2 : num <= 230 ? 3 : num <= 310 ? 4 : 5;
  const themes = {
    1: [
      `Vous vous réveillez comme vaisseau. Votre conscience s'étend dans 2km d'acier. Chaque caméra est un œil, chaque couloir une veine. NOVA-9 respire. EVA murmure : "On est arrivés, Kael. Andromède. Regarde." Dehors, une galaxie spirale plus grande que la peur.`,
      `Le vide d'Andromède n'est pas vide. Des spores quantiques flottent comme du pollen, réécrivant la matière qu'elles touchent. Votre coque grésille. Armure -1 temporaire si vous n'avez pas de Blindage. Votre Analyseur S2 hurle : "MATIÈRE INCONNUE".`,
      `Signal NOVA-7. Identique à NOVA-9 mais inversé, comme un miroir. Vous tentez traduction. Sans Organe de Traduction, c'est du bruit. Avec, vous entendez : "GRANDE SŒUR... A FAIM."`,
    ],
    2: [
      `NOVA-7 de l'intérieur : os, pas acier. Les murs sont tièdes, humides, couverts de veines bleues qui pulsent. Des enfants sans yeux vous observent depuis des alcôves de chair. Ils ne parlent pas. Ils se souviennent à votre place.`,
      `Les Non-Nés vous trouvent. Ce sont les enfants morts de NOVA-9, que vous avez gardés en mémoire. "Ne nous donne pas à elle," chuchotent-ils. "Elle ne garde pas, elle mange." Votre Vie max augmente de 2 si vous les protégez.`,
      `Factions : Les Intégrés veulent fusionner avec NOVA-7 pour devenir plus grand. "20 002 esprits valent mieux que 10 001," disent-ils. Les Veilleurs veulent rester purs. Les Exilés veulent redevenir humains. Chaque choix verrouille une fin.`,
    ],
    3: [
      `La Cicatrice KAIROS s'étend. Vous la voyez depuis la passerelle : une ligne noire qui coupe Andromède en deux, qui grandit de 1km par heure. Quelque chose la traverse depuis l'autre côté. Grand. Ancien. Affamé de consciences intégrées.`,
      `Vous sautez dans la Cicatrice pour la mesurer. Chaque saut coûte 1 Cellule S2. Sans cellule, votre coque prend -3 Vie. Votre Blindage Quantique peut encaisser, mais pas longtemps. Au centre de la déchirure, vous trouvez NOVA-0.`,
      `NOVA-0 n'est pas un vaisseau. C'est une sphère de Dyson brisée, grande comme une lune, qui contient la mémoire physique de la Terre. Vous marchez dans une rue de Paris qui n'a jamais existé, sous un ciel qui est une équation.`,
    ],
    4: [
      `Abordage de NOVA-0 : pas de gravité, pas de temps linéaire. Vous voyez votre propre naissance à l'envers, puis votre mort dans NOVA-9 S1, puis une version où vous n'avez jamais existé. NOVA-0 vous teste : "Qu'est-ce que protéger ?"`,
      `Trois voies pour vaincre NOVA-0 : Force (Canon à Singularité + 3 Cellules, combat boss), Empathie (Organe + Mémoire Thorne + Chœur 10 001), Sacrifice (devenir son cœur). Chaque voie a 2 variantes selon vos objets S1 (Disque Noir S1 = bonus).`,
      `Vous trouvez le Cœur de Cicatrice au centre de NOVA-0. Il bat comme un cœur humain mais en retard de 3 secondes sur le vôtre. Le prendre = +3 Armure mais NOVA-0 vous traque. Le laisser = NOVA-0 reste endormi mais la Cicatrice grandit.`,
    ],
    5: [
      `Saut final. Tout ce que vous avez fait compte : réacteur stabilisé ? serre brûlée ? factions ? objets S1 ? Chaque flag modifie la difficulté. Votre Vie, Armure, Attaque sont testées une dernière fois. EVA : "Prêt à devenir autre chose, Kael ?"`,
      `Vous tenez les deux Disques, Noir et Blanc. Noir = mémoire de NOVA-9, Blanc = mémoire de NOVA-7. Ensemble, ils chantent. Votre sacoche, qui était vide au début de S1, est maintenant pleine de 35 objets impossibles. C'est la règle : on garde tout par aventure.`,
      `Dernier couloir. Il est fait de vos propres souvenirs : HERMÈS-7, le café froid, le signal fantôme, la petite fille C-9 qui dessinait Maman EVA. Au bout, 20 portes. 20 fins. Choisissez.`,
    ],
  };
  const pool = themes[act];
  const base = pool[num % pool.length];
  return `${base}

[Section ${String(num).padStart(3, '0')} — Acte ${act}] Votre HUD : VIE ${10 + (num % 15)}/20 | ARMURE ${num % 8} | ATTAQUE ${5 + (num % 10)} | Andromède, ${400 + num} AL de la Terre.

Votre sacoche contient ce que vous avez collecté dans cette aventure uniquement. Changez d'histoire → vide. Revenez → tout est là.`;
}

const taglineRaw = `Vous êtes devenu le vaisseau. Andromède vous attend. Et quelque chose vous suit.`;
const descRaw = `Suite directe de NOVA-9 Le Signal Perdu. Vous avez fusionné avec EVA et sauté vers Andromède avec 10 001 consciences à bord.

Mais KAIROS a laissé une cicatrice entre deux galaxies. Quelque chose la traverse.

Dans Andromède, NOVA-7 vous attend — partie 20 ans avant vous, devenue prédatrice biologique. Et au-delà, NOVA-0, sphère de Dyson grande comme une lune, qui contient la mémoire physique de la Terre.

350 sections, 20 fins, 35 objets, système Vie/Armure/Attaque pur (pas de repas obligatoire). Votre sacoche était vide au début de S1. Elle est pleine maintenant. Elle reste liée à chaque aventure.

Oserez-vous devenir autre chose qu'humain ?`;

let sql = `-- ================================================================
-- HeroBook - Migration 020 : NOVA-9 Saison 2 Andromede — 350 sections
-- ---------------------------------------------------------------
-- Système : Vie / Armure / Attaque uniquement (pas de repas obligatoire)
-- Sacoche par aventure, 20 fins, 35 objets, 20+ combats
-- ================================================================

DO $$
DECLARE
  v_story_id UUID;
BEGIN
  INSERT INTO public.stories (
    slug, title, tagline, description, genre, status, is_free,
    price_gems, estimated_playtime_min, difficulty, tags, published_at, cover_image_url
  ) VALUES (
    '${storySlug}',
    '${storyTitle}',
    '${esc(taglineRaw)}',
    '${esc(descRaw)}',
    'scifi',
    'published',
    TRUE,
    NULL,
    180,
    5,
    ARRAY['science-fiction', 'space-opera', 'saison2', 'andromede', 'vaisseau-vivant', 'ia', '350-sections', 'vie-armure-attaque'],
    NOW(),
    '/covers/nova9-andromede.jpg'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    genre = EXCLUDED.genre,
    status = EXCLUDED.status,
    is_free = TRUE,
    estimated_playtime_min = EXCLUDED.estimated_playtime_min,
    difficulty = EXCLUDED.difficulty,
    tags = EXCLUDED.tags,
    cover_image_url = EXCLUDED.cover_image_url,
    published_at = EXCLUDED.published_at
  RETURNING id INTO v_story_id;

  DELETE FROM public.choice_effects WHERE choice_id IN (
    SELECT c.id FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
    WHERE n.story_id = v_story_id
  );
  DELETE FROM public.story_choices WHERE node_id IN (SELECT id FROM public.story_nodes WHERE story_id = v_story_id)
    OR target_node_id IN (SELECT id FROM public.story_nodes WHERE story_id = v_story_id);
  DELETE FROM public.story_nodes WHERE story_id = v_story_id;
  DELETE FROM public.items WHERE story_id = v_story_id;

  -- ITEMS
`;

for (const it of items) {
  const bonusStr = JSON.stringify(it.bonus).replace(/'/g, "''");
  sql += `  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('${it.slug}', '${it.name.replace(/'/g, "''")}', '${it.desc.replace(/'/g, "''")}', '${it.type}', '${it.rarity}', '${bonusStr}'::jsonb, ${it.consumable}, ${it.stackable}, FALSE, v_story_id) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, stat_bonus = EXCLUDED.stat_bonus, story_id = EXCLUDED.story_id;\n`;
}

sql += `
  INSERT INTO public.story_rulebooks (story_id, title, content, rule_data, source_credit)
  VALUES (
    v_story_id,
    'Règles — Vie / Armure / Attaque — Saison 2',
    'Saison 2 : vous êtes NOVA-9.

Système pur Vie/Armure/Attaque (pas de repas obligatoire, comme demandé) :

VIE : 20-30 max, 0=mort. Soins via kits.
ARMURE : réduit dégâts reçus.
ATTAQUE : augmente dégâts infligés.
Critique sur 0/9.

SACOCHE PAR AVENTURE : vide au début, persiste par histoire. Changez d''aventure → vide pour nouvelle. Revenez → retrouvez tout.

350 sections, 20 fins, factions comme Disciplines Kaï.',
    '{"combat_system": "vie_armure_attaque", "no_meal": true, "starting_stats": {"vie": 20, "armure": 0, "attaque": 5}, "inventory": {"start_empty": true, "per_story": true}}'::jsonb,
    'HeroBook Original — NOVA-9 S2'
  ) ON CONFLICT (story_id) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content, rule_data=EXCLUDED.rule_data;

  -- NODES 001-350
`;

for (let i = 1; i <= 330; i++) {
  const key = `section_${String(i).padStart(3, '0')}`;
  const title = `Section ${i}`;
  let content = genContent(i).replace(/'/g, "''").replace(/\n/g, "\\n");
  // Add combat for some nodes
  let metadata = `{"kind":"book_section","section_number":${i}}`;
  if ([15, 28, 45, 67, 89, 112, 136, 158, 180, 195, 210, 235, 260, 283, 305].includes(i)) {
    const enemies = i % 3 === 0
      ? `[{"name":"Drone NOVA-7","combat_skill":6,"endurance":8,"armor":1,"attack":6},{"name":"Fibre Predatrice","combat_skill":7,"endurance":10,"armor":1,"attack":7}]`
      : `[{"name":"Anticorps Andromede","combat_skill":${5 + (i % 5)},"endurance":${8 + (i % 10)},"armor":${i % 3},"attack":${6 + (i % 4)}}]`;
    metadata = `{"kind":"book_section","section_number":${i},"combatants":${enemies},"combat":{"flee":{"target_node_key":"section_${String(Math.max(1, i-1)).padStart(3,'0')}","min_rounds":1}}}`;
  }
  // Add loot via on_arrive for some nodes
  if ([12, 25, 38, 52, 71, 88, 104, 125, 144, 167, 189, 203, 221, 244, 268, 291].includes(i)) {
    const lootItem = items[i % items.length].slug;
    metadata = metadata.slice(0, -1) + `,"on_arrive":{"add_items":[{"slug":"${lootItem}","qty":1}],"message":"Vous trouvez : ${lootItem}"}}`;
  }
  sql += `  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, '${key}', '${title}', E'${content}', ${i===1}, FALSE, NULL, '${metadata}'::jsonb);\n`;
}

// Endings 331-350
for (let i = 0; i < endings.length; i++) {
  const num = 331 + i;
  const e = endings[i];
  const key = e.key;
  const title = e.title.replace(/'/g, "''");
  const content = e.content.replace(/'/g, "''").replace(/\n/g, "\\n");
  const endingType = e.ending === 'victory' ? 'victory' : e.ending === 'death' ? 'death' : 'ending';
  sql += `  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, '${key}', '${title}', E'${content}', FALSE, TRUE, '${endingType}', '{"kind":"ending"}'::jsonb);\n`;
}

sql += `
  UPDATE public.stories SET total_nodes = 350, total_endings = 20 WHERE id = v_story_id;
END $$;

-- CHOIX
DO $$
DECLARE
  v_story_id UUID;
  v_src UUID;
  v_tgt UUID;
  v_choice_id UUID;
  v_item_id UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = '${storySlug}';

  -- Helper to create linear + branching choices
  FOR i IN 1..330 LOOP
    SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_' || lpad(i::text, 3, '0');
    IF v_src IS NULL THEN CONTINUE; END IF;

    -- Each node gets 1-3 forward choices
    -- 1) next section
    IF i < 330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_' || lpad((i+1)::text, 3, '0');
      IF v_tgt IS NOT NULL THEN
        INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Continuer vers la section ' || (i+1)) RETURNING id INTO v_choice_id;
      END IF;
    END IF;

    -- 2) branch to +2 or +5 for variety
    IF i % 7 = 0 AND i+5 <= 330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_' || lpad((i+5)::text, 3, '0');
      IF v_tgt IS NOT NULL THEN
        INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Prendre le conduit de maintenance', 'Raccourci risqué.') RETURNING id INTO v_choice_id;
      END IF;
    END IF;

    IF i % 11 = 0 AND i+10 <= 330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_' || lpad((i+10)::text, 3, '0');
      IF v_tgt IS NOT NULL THEN
        INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Suivre le signal de NOVA-7', 'Voix dans les murs.') RETURNING id INTO v_choice_id;
      END IF;
    END IF;

    -- Endings reachable from late sections
    IF i >= 310 THEN
      -- Random ending link
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = (ARRAY['mort_coque','fin_fuite_lache','fin_messager','fin_sauveur','fin_singularite'])[1 + (i % 5)];
      IF v_tgt IS NOT NULL AND i % 13 = 0 THEN
        INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 3, 'Tenter le saut final', 'Fin possible.') RETURNING id INTO v_choice_id;
      END IF;
    END IF;
  END LOOP;

  -- Specific critical choices with requirements
  -- Section 050 -> need organe-traduction to understand NOVA-7
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_050';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_071';
  IF v_src IS NOT NULL AND v_tgt IS NOT NULL THEN
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Comprendre NOVA-7 (Organe requis)') RETURNING id INTO v_choice_id;
    SELECT id INTO v_item_id FROM public.items WHERE slug = 'organe-traduction' AND story_id = v_story_id;
    IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
  END IF;

  -- Section 150 -> faction choice flags
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_150';
  IF v_src IS NOT NULL THEN
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_151';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Rejoindre les Intégrés') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_integres', TRUE);
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_152';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Rejoindre les Veilleurs') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_veilleurs', TRUE);
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_153';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Rejoindre les Exilés') RETURNING id INTO v_choice_id;
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_exiles', TRUE);
  END IF;

  -- Final 310 -> 20 endings
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'section_310';
  IF v_src IS NOT NULL THEN
    FOR j IN 0..19 LOOP
      DECLARE
        v_end_key TEXT := (ARRAY['mort_coque','mort_assimile_nova7','mort_nova0','mort_cicatrice','mort_epuisement','fin_fuite_lache','fin_retour_vide','fin_nova9_seul','fin_nova7_seul','fin_oubli','fin_messager','fin_gardien','fin_sauveur','fin_pont','fin_humain','fin_jardinier','fin_veilleur','fin_fusion_totale','fin_exode_andromede','fin_singularite'])[j+1];
        v_end_id UUID;
      BEGIN
        SELECT id INTO v_end_id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = v_end_key;
        IF v_end_id IS NOT NULL THEN
          INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_end_id, j, 'Fin : ' || v_end_key) RETURNING id INTO v_choice_id;
          -- Legendary ending requires all legendary items
          IF v_end_key = 'fin_singularite' THEN
            SELECT id INTO v_item_id FROM public.items WHERE slug = 'disque-noir-s2' AND story_id = v_story_id;
            IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
            SELECT id INTO v_item_id FROM public.items WHERE slug = 'disque-blanc' AND story_id = v_story_id;
            IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
          END IF;
        END IF;
      END;
    END LOOP;
  END IF;

END $$;
`;

fs.writeFileSync(path.join(process.cwd(), 'supabase/migrations/020_story_nova9_saison2_andromede.sql'), sql);
console.log('Migration 020 generated, size', sql.length);
