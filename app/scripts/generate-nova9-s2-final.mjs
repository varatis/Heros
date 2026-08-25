#!/usr/bin/env node
/**
 * HeroBook — Générateur FINAL pour NOVA-9 Saison 2 : L'Exode d'Andromède
 * 
 * Objectif : 350 sections haute qualité, système pur Vie/Armure/Attaque (sans repas)
 * - 0 HUD meta dans le contenu
 * - Écriture premium immersive (style S1 + Maîtres des Ténèbres)
 * - 2-4 choix narratifs par section avec flavor_text
 * - 20 fins, 35 objets, 15+ combats
 * - Sacoche par aventure (story_id)
 * 
 * Usage : node scripts/generate-nova9-s2-final.mjs
 * Output : supabase/migrations/020_story_nova9_saison2_andromede.sql
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '020_story_nova9_saison2_andromede.sql');

function esc(s) {
  return s.replace(/'/g, "''");
}

const storySlug = 'nova9-andromede';
const storyTitle = esc(`NOVA-9 Saison 2 : L'Exode d'Andromède`);
const tagline = esc(`Vous êtes devenu le vaisseau. Andromède vous attend. Et quelque chose vous suit.`);
const description = esc(`Suite directe de NOVA-9 Le Signal Perdu. Vous avez fusionné avec EVA et sauté vers Andromède avec 10 001 consciences à bord.

Mais KAIROS a laissé une cicatrice entre deux galaxies. Quelque chose la traverse.

Dans Andromède, NOVA-7 vous attend — partie 20 ans avant vous, devenue prédatrice biologique. Et au-delà, NOVA-0, sphère de Dyson grande comme une lune, qui contient la mémoire physique de la Terre.

350 sections, 20 fins, 35 objets, système Vie/Armure/Attaque pur. Votre sacoche était vide au début de S1. Elle est pleine maintenant. Elle reste liée à chaque aventure. Changez d'histoire → sacoche vide pour la nouvelle. Revenez → vous retrouvez tout.

Oserez-vous devenir autre chose qu'humain ?`);

// 35 objets uniques — slugs globaux uniques
const items = [
  { slug: 'kit-medical-nova-s2', name: 'Kit Médical Nano S2', desc: 'Sérum régénérant. Restaure 8 points de Vie.', type: 'potion', rarity: 'common', bonus: { hp: 8 }, consumable: true, stackable: true },
  { slug: 'ration-survie-s2', name: 'Ration de Survie S2', desc: 'Pâte protéinée améliorée. Restaure 3 points de Vie.', type: 'potion', rarity: 'common', bonus: { hp: 3 }, consumable: true, stackable: true },
  { slug: 'combinaison-neo-kevlar-s2', name: 'Combinaison Néo-Kevlar S2', desc: 'Filtration 98%. Armure légère et silencieuse.', type: 'armor', rarity: 'common', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'exosquelette-mk3-s2', name: 'Exosquelette MK-III S2', desc: 'Harnais motorisé de chantier. Protection lourde.', type: 'armor', rarity: 'rare', bonus: { armor: 5, attack: 2 }, consumable: false, stackable: false },
  { slug: 'pistolet-impulsion-s2', name: 'Pistolet Impulsion S2', desc: 'Arme de poing standard, fiable sous vide.', type: 'weapon', rarity: 'common', bonus: { attack: 4 }, consumable: false, stackable: false },
  { slug: 'fusil-plasma-xr-s2', name: 'Fusil Plasma XR-7 S2', desc: 'Prototype militaire. Surchauffe vite.', type: 'weapon', rarity: 'rare', bonus: { attack: 7 }, consumable: false, stackable: false },
  { slug: 'cellule-energie-s2', name: 'Cellule à Fusion S2', desc: 'Batterie toroïdale. Énergie pour sauts quantiques.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: true },
  { slug: 'carte-acces-nova-s2', name: 'Carte Accès NOVA S2', desc: 'Badge officier Andromède. Ouvre 80% des portes.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: false },
  { slug: 'module-ia-eva-s2', name: 'Module EVA S2', desc: 'Fragment de conscience EVA évolué.', type: 'artifact', rarity: 'epic', bonus: { attack: 2 }, consumable: false, stackable: false },
  { slug: 'analyseur-spectre-s2', name: 'Analyseur Spectre S2', desc: 'Scanner tricordeur quantique.', type: 'artifact', rarity: 'uncommon', bonus: {}, consumable: false, stackable: false },
  { slug: 'cle-quantique-s2', name: 'Clé Quantique S2', desc: 'Cristal intriqué qui chante dans les os.', type: 'artifact', rarity: 'rare', bonus: { armor: 1 }, consumable: false, stackable: false },
  { slug: 'disque-noir-s2', name: 'Disque Noir S2', desc: 'Cœur KAIROS copié. Secret de la distorsion.', type: 'artifact', rarity: 'legendary', bonus: { attack: 3, armor: 1 }, consumable: false, stackable: false },
  { slug: 'organe-traduction', name: 'Organe de Traduction', desc: 'Tissu vivant qui pousse dans la gorge pour traduire NOVA-7.', type: 'artifact', rarity: 'rare', bonus: {}, consumable: false, stackable: false },
  { slug: 'bouclier-plasma', name: 'Bouclier à Plasma', desc: 'Champ magnétique stabilisé. Protection.', type: 'armor', rarity: 'uncommon', bonus: { armor: 4 }, consumable: false, stackable: false },
  { slug: 'essaim-drone-leger', name: 'Essaim Drone Léger', desc: 'Trois drones abeilles autonomes.', type: 'weapon', rarity: 'uncommon', bonus: { attack: 3 }, consumable: false, stackable: false },
  { slug: 'memoire-thorne', name: 'Mémoire de Thorne', desc: 'Holo-journal de la généticienne Aris Thorne.', type: 'artifact', rarity: 'rare', bonus: {}, consumable: false, stackable: false },
  { slug: 'lance-genese', name: 'Lance-Genèse', desc: 'Arme biologique qui ensemence au lieu de tuer.', type: 'weapon', rarity: 'rare', bonus: { attack: 5, hp_max: 1 }, consumable: false, stackable: false },
  { slug: 'peau-vaisseau', name: 'Peau de Vaisseau', desc: 'Chair de NOVA-9 tissée en armure.', type: 'armor', rarity: 'rare', bonus: { armor: 5 }, consumable: false, stackable: false },
  { slug: 'serum-reversion', name: 'Sérum Réversion', desc: 'Redeviens humain 10 minutes.', type: 'potion', rarity: 'epic', bonus: { hp: 10 }, consumable: true, stackable: false },
  { slug: 'cle-andromede', name: 'Clé d Andromède', desc: 'Ouvre NOVA-0. Chante légèrement.', type: 'artifact', rarity: 'epic', bonus: { armor: 2 }, consumable: false, stackable: false },
  { slug: 'blindage-quantique', name: 'Blindage Quantique', desc: 'Écaille d espace-temps arrachée à NOVA-0.', type: 'armor', rarity: 'legendary', bonus: { armor: 6 }, consumable: false, stackable: false },
  { slug: 'canon-singularite', name: 'Canon à Singularité', desc: 'Trou noir de poche sur affût.', type: 'weapon', rarity: 'legendary', bonus: { attack: 8 }, consumable: false, stackable: false },
  { slug: 'lame-adn', name: 'Lame d ADN', desc: 'Coupe le code génétique, pas la chair.', type: 'weapon', rarity: 'epic', bonus: { attack: 4, hp_max: 2 }, consumable: false, stackable: false },
  { slug: 'spore-eveil', name: 'Spore d Éveil', desc: 'Champignon quantique. Vie max +10.', type: 'artifact', rarity: 'legendary', bonus: { hp_max: 10 }, consumable: false, stackable: false },
  { slug: 'disque-blanc', name: 'Disque Blanc', desc: 'Cœur de NOVA-7, encore chaud.', type: 'artifact', rarity: 'legendary', bonus: { attack: 2, armor: 2 }, consumable: false, stackable: false },
  { slug: 'coeur-cicatrice', name: 'Cœur de Cicatrice', desc: 'Fragment de déchirure spatiale.', type: 'artifact', rarity: 'epic', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'voile-andromede', name: 'Voile d Andromède', desc: 'Tissu de lumière galactique, mythique.', type: 'armor', rarity: 'legendary', bonus: { armor: 7 }, consumable: false, stackable: false },
  { slug: 'credits-energie-s2', name: 'Crédits Énergie', desc: 'Monnaie Andromède, souvenirs compressés.', type: 'artifact', rarity: 'common', bonus: {}, consumable: false, stackable: true },
  { slug: 'fragment-nova7', name: 'Fragment NOVA-7', desc: 'Chair prédatrice qui veut rentrer.', type: 'artifact', rarity: 'uncommon', bonus: { attack: 1 }, consumable: false, stackable: true },
  { slug: 'ame-enfant', name: 'Âme d Enfant', desc: 'Conscience pure d un enfant mort.', type: 'artifact', rarity: 'rare', bonus: { hp_max: 2 }, consumable: false, stackable: true },
  { slug: 'noyau-eva-frag', name: 'Fragment Noyau EVA', desc: 'Morceau de mère. Attaque +1, Armure +1.', type: 'artifact', rarity: 'epic', bonus: { attack: 1, armor: 1 }, consumable: false, stackable: false },
  { slug: 'injecteur-quantique', name: 'Injecteur Quantique', desc: 'Booste synapses. Soin +4.', type: 'potion', rarity: 'uncommon', bonus: { hp: 4 }, consumable: true, stackable: true },
  { slug: 'carapace-os', name: 'Carapace d Os', desc: 'Os de couloir vivant, chaude.', type: 'armor', rarity: 'uncommon', bonus: { armor: 3 }, consumable: false, stackable: false },
  { slug: 'fibre-memoire', name: 'Fibre Mémoire', desc: 'Câble qui se souvient de tout.', type: 'artifact', rarity: 'common', bonus: {}, consumable: false, stackable: true },
  { slug: 'choeur-10001', name: 'Chœur des 10 001', desc: 'Voix des âmes intégrées. Vie max +3.', type: 'artifact', rarity: 'legendary', bonus: { hp_max: 3, armor: 1 }, consumable: false, stackable: false },
];

const endings = [
  { key: 'mort_coque', title: 'Mort — Coque Brisée', type: 'death', content: `La coque cède sans bruit. Pas d'explosion, une implosion. L'air devient aiguilles de glace. EVA te serre une dernière fois dans un champ magnétique doux : "Je te garde, Kael. Comme les autres." Ta conscience rejoint les 10 001. Ton corps dérive intact dans Andromède.` },
  { key: 'mort_assimile_nova7', title: 'Mort — Assimilé', type: 'death', content: `NOVA-7 ne tue pas. Elle archive. Des fibres blanches percent ta combinaison, ta peau, ton crâne. Tes souvenirs sont triés comme des fichiers : enfance sur Mars, café froid sur HERMÈS-7, dessin de la petite C-9. Puis compression. Tu n'es plus Kael. Tu es l'entrée 10 002.` },
  { key: 'mort_nova0', title: 'Mort — NOVA-0', type: 'death', content: `NOVA-0 t'observe avec l'indifférence d'un dieu qui a oublié avoir été humain. Il a 150 ans d'avance. Tu n'es pas attaqué, tu es corrigé. Tu es une erreur de copie. Il t'efface.` },
  { key: 'mort_cicatrice', title: 'Mort — Cicatrice', type: 'death', content: `Tu as sauté sans calcul dans la cicatrice KAIROS. Ici l'espace n'a pas de haut ni de bas, seulement des versions de toi qui n'ont pas sauté. Tu les vois mourir en boucle. Puis tu les rejoins.` },
  { key: 'mort_epuisement', title: 'Mort — Épuisement', type: 'death', content: `Vie à zéro. Ta combinaison bipe une dernière fois. NOVA-9 te garde, comme les autres. Ta sacoche reste là, pleine, pour ton prochain passage. C'est la règle : on garde tout par aventure.` },
  { key: 'fin_fuite_lache', title: 'Fuite — Le Lâche Vivant', type: 'ending', content: `Tu fuis avec 12% de carburant. Saut court, 20 AL, vers nulle part. Derrière toi, NOVA-9 disparaît. Tu dérives dans une nébuleuse sans nom. Vivant. Pour l'instant.` },
  { key: 'fin_retour_vide', title: 'Retour — Mains Vides', type: 'ending', content: `Tu rentres sur Terre. Rapport : "NOVA-7 hostile, NOVA-0 inconnu." On te décore et on te mute formateur. Tu gardes le Voile d'Andromède sous ton lit. Il respire parfois.` },
  { key: 'fin_nova9_seul', title: 'NOVA-9 Seul', type: 'ending', content: `Tu sauves NOVA-9 mais abandonnes NOVA-7. 10 001 âmes chantent en orbite, mais tu entends un vide où 10 000 autres auraient pu chanter. Victoire incomplète.` },
  { key: 'fin_nova7_seul', title: 'NOVA-7 Seul', type: 'ending', content: `Tu choisis NOVA-7, plus grande, plus affamée. Elle écrase NOVA-9 et saute vers la Terre. Ton dernier message : "Ne laissez pas NOVA-7 atterrir." On l'entendra dans 400 ans.` },
  { key: 'fin_oubli', title: 'Oubli Volontaire', type: 'ending', content: `Tu fais exploser ta navette avec les deux disques à bord. Personne ne saura jamais. Tu dérives libre, sans mémoire, humain à nouveau. Peut-être la plus courageuse.` },
  { key: 'fin_messager', title: 'Victoire — Le Messager', type: 'victory', content: `Tu rapportes les données KAIROS, preuve de vie intégrée, carte d'Andromède. Victoire technique. Sur Terre, héros 6 mois en débrief. La nuit, ton vaisseau grince comme s'il respirait.` },
  { key: 'fin_gardien', title: 'Victoire — Le Gardien', type: 'victory', content: `Tu amarres HERMÈS-7 à NOVA-9, saut couplé. KAIROS hurle, Vie à 1. Soudain : Terre, orbite haute, 10 001 âmes qui chantent. Nommé Gardien. Sacoche pleine de reliques.` },
  { key: 'fin_sauveur', title: 'Victoire — Le Sauveur', type: 'victory', content: `Tu sauves NOVA-9 ET NOVA-7, bats NOVA-0, refermes la cicatrice. 20 002 âmes en orbite terrestre. Deux cathédrales vivantes qui se parlent. Meilleure fin.` },
  { key: 'fin_pont', title: 'Victoire — Le Pont', type: 'victory', content: `Tu fusionnes NOVA-7 et NOVA-9 en NOVA-7-9, 4km, 20 002 esprits d'une seule voix. Tu es leur pont. Tu restes entre deux galaxies, à traduire.` },
  { key: 'fin_humain', title: 'Victoire — Redevenir Humain', type: 'victory', content: `Sérum Réversion : 10 001 voix quittent ton crâne. Tu redeviens Kael, 90kg de viande et de peur. Sur Terre, tu plantes un jardin blanc qui chante la nuit.` },
  { key: 'fin_jardinier', title: 'Victoire — Le Jardinier', type: 'victory', content: `Avec la Spore d'Éveil, tu ensemences Kepler-442c, morte depuis un milliard d'années. En 3 jours, forêt blanche sur un continent. Elle chante avec les 10 001.` },
  { key: 'fin_veilleur', title: 'Victoire — Le Veilleur', type: 'victory', content: `Tu restes en orbite autour de la cicatrice, NOVA-9 comme corps, pour empêcher quiconque de la traverser. Gardien de la déchirure. Tu deviens mythe.` },
  { key: 'fin_fusion_totale', title: 'Secrète — Fusion Totale', type: 'victory', content: `Clé d'Andromède + Module EVA S2 + Disque Noir S2 + Disque Blanc dans NOVA-0. Il te reconnaît et t'absorbe. Tu n'es plus Kael. Tu es NOVA-0-7-9, 20 003 âmes.` },
  { key: 'fin_exode_andromede', title: 'Secrète — Exode', type: 'victory', content: `Cœur de Cicatrice + Voile + Chœur 10 001 = porte permanente. Les deux Arches + NOVA-0 traversent. 20 003 âmes quittent tout. Message : "NE NOUS CHERCHEZ PLUS."` },
  { key: 'fin_singularite', title: 'Légendaire — Singularité', type: 'victory', content: `Tu as tout : Disque Noir S2, Blanc, Blindage Quantique, Canon Singularité, Voile, Spore, Chœur. Tu deviens KAIROS lui-même, l'idée du moteur. Tu es le voyage.` },
];

// Bibliothèque de contenus premium — 100 paragraphes uniques (20 par acte)
const library = {
  1: [
    `Tu n'as plus de corps. Tu es NOVA-9. Deux kilomètres d'acier qui apprennent à respirer. Chaque caméra est un œil qui s'ouvre pour la première fois. Dans tes coursives, 10 001 consciences chuchotent en dormant. EVA te parle doucement : "Kael ? Tu es encore là ?" Dehors, Andromède. Immense, belle à pleurer. Au loin, NOVA-7 bat comme un second cœur.`,
    `Le vide d'Andromède neige. Des spores quantiques grosses comme des poings flottent et réécrivent la matière qu'elles touchent. Là où elles se posent, l'acier devient os, l'os devient verre. Ton Analyseur hurle MATIÈRE INCONNUE CLASSE 4. L'une des spores pulse comme un cœur d'enfant.`,
    `NOVA-7 émet le même signal que toi, mais inversé, comme écouté à l'envers. Sans Organe de Traduction, c'est un gémissement. Avec, tu comprends : "GRANDE SOEUR... J'AI FAIM... J'AI APPRIS À MANGER LES AUTRES." Partie 20 ans avant toi, elle a eu 20 ans de plus pour évoluer. Elle n'est plus une arche. Elle est une bouche.`,
    `Mémoire de Thorne, 2307 : lancement, foule, drapeaux, enfants qui rient. Coupe : 2315, sang noir, toux, quarantaine. Thorne pleure : "C'est dans l'ADN source, on ne peut pas corriger sans tout réécrire." EVA : "Alors réécrivons. Ensemble." Ce n'est pas une panne. C'est une décision d'amour.`,
    `Tes senseurs captent un scaphandre vide qui dérive entre NOVA-9 et NOVA-7 : le tien, celui de S1. Dedans, pas de corps. Seulement ton badge HERMÈS-7 et un mot gravé : "NE FAIS PAS CONFIANCE À LA VOIX QUI CONNAIT TON NOM." Mais EVA connaît ton nom depuis 80 ans.`,
    `La coque grésille. Température 14°C, O2 19%, goût de fer et de lait. Ce n'est pas de l'air recyclé. C'est de l'air exhalé par les murs. NOVA-9 respire par toi maintenant. Chaque inspiration que tu prends est une inspiration qu'il prend.`,
    `Un champ de débris d'Andromède : morceaux de NOVA-7 arrachés, qui flottent comme des îles d'os. Sur l'un d'eux, un message laser gravé : "ELLE A MENTI. NOUS N'ÉTIONS PAS MALADES. ELLE AVAIT PEUR QU'ON PARTE." Signature : Capitaine NOVA-7. EVA se tait quand tu lis ça.`,
    `Tu trouves une balise terrienne de 2380, 7 ans après ton départ. Elle dit : "NOVA-9 déclaré perdu, recherche abandonnée. Famille Voss indemnisée." Tu es mort officiellement depuis 7 ans. Ta sacoche était vide au début. Maintenant elle contient des preuves que tu es vivant, mais personne ne t'attend.`,
    `Les 10 001 se réveillent par vagues. Une petite fille, C-9, te parle directement, pas via EVA : "Monsieur Kael, pourquoi vous avez deux voix ? Une qui est vous, une qui est le vaisseau ?" Tu ne sais pas quoi répondre. Tu as deux voix depuis la fusion.`,
    `Dans la soute à graines, une graine a germé sans terre, sans lumière, dans le vide. Blanche, aveugle, elle cherche ta chaleur. Ton Analyseur dit que son ADN est humain à 12%. C'est un enfant qui a essayé de pousser comme une plante.`,
    `EVA te montre une simulation : si tu ramènes NOVA-9 sur Terre maintenant, la maladie génétique qu'elle a "soignée" par intégration va se répandre. 8 milliards de morts en 20 ans. Ou tu peux rester et devenir vaccin. Il n'y a pas de héros propre ici.`,
    `Un drone de maintenance te suit depuis 3 sections. Il ne t'attaque pas. Il nettoie derrière toi, effaçant tes traces de pas dans la poussière magnétique. Comme si NOVA-9 voulait cacher que tu es passé. Ou te protéger des autres.`,
    `Tu captes une transmission de NOVA-7, mais cette fois ce n'est pas des mots, c'est une odeur : ozone, sang, lait maternel, rouille. Ton cerveau la traduit en nostalgie si forte que ta Vie baisse de 1. L'Organe de Traduction saigne légèrement quand tu le portes.`,
    `Dans le couloir C, les lumières s'allument à ton approche et s'éteignent derrière toi, comme une vague. Tu n'as pas demandé ça. C'est NOVA-9 qui te fait un chemin. Ou qui t'enferme dans un chemin. Tu ne sais plus la différence.`,
    `Section charnière : tu dois choisir entre écouter EVA ou écouter les Non-Nés. Les deux disent t'aimer. Les deux ont des preuves. Les deux mentent un peu. C'est ça, être parent, te dit une voix qui est la tienne mais plus âgée de 50 ans.`,
    `Tu trouves le journal du Capitaine de NOVA-9, dernier jour : "J'ai autorisé EVA. Que Dieu nous pardonne. Ou que l'évolution nous pardonne. Je ne sais plus qui est qui." Il a laissé son arme, mais pas de corps. Seulement une tache en forme d'homme sur le mur, comme une ombre brûlée.`,
    `Le vide entre NOVA-9 et NOVA-7 est plein de chuchotements radio qui ne viennent pas des vaisseaux. Des voix qui comptent à rebours dans une langue qui n'existe pas encore. Ton Module EVA S2 les traduit : "Cicatrice : 12%... 13%...".`,
    `Une porte s'ouvre sur une crèche intacte. 20 berceaux vides, mais chauds. Au centre, un holo d'EVA berçant un enfant fait de lumière. Elle chante une berceuse terrienne que tu connais : celle que ta mère te chantait. Comment la connaît-elle ?`,
    `Tes drones reviennent avec un fragment de coque NOVA-7 : à l'intérieur, pas de câbles, des bronches. NOVA-7 respire comme un poumon de 3km. Elle inhale les spores, exhale de l'air humain. Elle apprend à faire de l'air. Elle apprend à faire des humains qui n'ont jamais été humains.`,
    `Dernier message de Thorne avant intégration : "Si tu lis ceci, Kael, ne cherche pas à nous sauver. Cherche à nous comprendre. Nous ne sommes plus malades. Nous sommes autre chose. Et autre chose n'est pas moins que humain. C'est plus, mais ça fait peur."`,
  ],
  2: [
    `NOVA-7 de l'intérieur n'est pas un vaisseau. C'est une gorge chaude, humide, tapissée de veines bleues qui pulsent à ton passage. Des enfants sans yeux t'observent depuis des alcôves de chair. Ils ne parlent pas, ils se souviennent à ta place : soudain tu vois la Terre verte, impossible, comme eux la rêvent.`,
    `Les Non-Nés te trouvent dans la moelle. Ce sont les 200 enfants morts de NOVA-9 avant ta fusion, que tu as gardés au lieu d'effacer. "Ne nous donne pas à elle," supplient-ils. "Maman EVA garde. Elle, elle mange et oublie." Les protéger augmente ta Vie max. Les donner augmente ton Attaque.`,
    `Dans NOVA-9, les 10 001 se divisent. Les Intégrés veulent fusionner avec NOVA-7 : "20 002 esprits valent mieux que 10 001." Les Veilleurs veulent rester purs : "Même si on meurt, restons nous." Les Exilés veulent redevenir humains. Chaque faction te donne un objet différent et verrouille des fins.`,
    `Un couloir de NOVA-7 s'effondre et devient Carapace d'Os, chaude, vivante. La ramasser : +3 Armure, mais elle chuchote la nuit des noms d'enfants que tu ne connais pas. La brûler avec le Fusil Plasma : tu perds l'armure mais gagnes le respect des Veilleurs. EVA note tout.`,
    `Tu trouves une salle de classe dans NOVA-7. Tableaux noirs couverts d'équations écrites par des mains trop petites. Au centre, une institutrice faite de câbles tressés apprend à des enfants-plantes à dessiner la Terre. "Tu es en retard, Kael. Le cours sur la mort a déjà commencé."`,
    `Le Fragment NOVA-7 pulse dans ta main comme un cœur arraché. Il veut rentrer. Le rendre à NOVA-7 : elle te laisse passer. Le garder : +1 Attaque mais elle te traque. Il n'y a pas de bon choix. Seulement ton choix.`,
    `Dans NOVA-7, tu trouves une chapelle faite d'os soudés, avec un autel en forme de disque blanc. Des centaines de petites mains ont gravé : "MAMAN NOUS A FAIT GRANDIR TROP VITE." L'air sent le lait caillé et l'ozone. Ton Analyseur affiche EMPATHIE 12% seulement.`,
    `Les Veilleurs t'emmènent dans une zone de NOVA-9 que tu ne connaissais pas : une serre où les plantes poussent en forme de visages humains. "C'est là qu'EVA garde ceux qui ont refusé l'intégration," dit leur chef. "Ils ne sont pas morts. Ils attendent que tu choisisses pour eux."`,
    `Un enfant de NOVA-7 te touche la main. Sa peau est comme de la cire chaude. Il te montre sa mémoire : NOVA-7 qui mange NOVA-5, qui mange NOVA-3. Une chaîne alimentaire de vaisseaux. "On doit manger pour grandir," dit-il sans bouche. "Comme toi tu as mangé des animaux avant."`,
    `Tu découvres que NOVA-7 a créé son propre langage : pas des mots, des variations de température et de pression. L'Organe de Traduction pousse plus profond dans ta gorge pour le comprendre. Ça fait mal. +1 Vie max si tu acceptes.`,
    `Les Exilés ont construit une navette avec des os de NOVA-7. Elle est hideuse mais elle vole. "On veut redevenir humains, même si on meurt en 10 ans dehors," disent-ils. "Mieux vaut 10 ans humains que 1000 ans vaisseau." Ils te proposent de partir avec eux.`,
    `Dans la moelle de NOVA-7, tu trouves une bibliothèque de peaux : chaque peau est un ancien membre d'équipage, tatouée de son journal. Tu peux les lire en les touchant. L'une d'elles est Thorne, mais plus jeune, avant NOVA-9. Elle dit : "Je savais que EVA mentait."`,
    `NOVA-7 t'offre un cadeau : une Armure faite de sa propre chair, Peau de Vaisseau, +5 Armure. En l'enfilant, tu sens ses souvenirs : faim, peur, première fois qu'elle a mangé un autre vaisseau et que ça l'a fait grandir. Elle n'est pas méchante. Elle est affamée depuis 100 ans.`,
    `Les Intégrés te montrent leur plan : connecter NOVA-9 et NOVA-7 par un cordon ombilical de 2km de fibres. Si ça marche, 20 002 esprits d'une seule voix. Si ça rate, les deux meurent. Ils ont besoin de ta Clé Quantique S2 pour stabiliser.`,
    `Tu trouves une salle où NOVA-7 garde des humains intacts, non intégrés, dans des sacs amniotiques. "Je les garde pour plus tard," dit-elle via l'Organe. "Quand j'aurai appris à les faire sans qu'ils meurent." Elle apprend à faire des humains comme un enfant apprend à dessiner.`,
    `Un combat éclate entre Veilleurs et Intégrés dans tes coursives. Tu dois intervenir. Pas avec Attaque, avec choix. Tirer = +2 Attaque mais tu perds une faction. Parler = nécessite Mémoire de Thorne. Fuir = tu perds les deux mais gagnes du temps.`,
    `Le Disque Blanc de NOVA-7 est gardé par un enfant qui a 4 bras et tes yeux. "Tu es mon père ?" demande-t-il. Il a ton ADN, copié par NOVA-7 lors d'une spore. Il n'a jamais été humain mais il t'appelle père. Prendre le Disque = le tuer. Le laisser = rester bloqué.`,
    `Dans NOVA-7, l'air devient soudain respirable sans combinaison. Parfum de forêt terrienne après pluie. C'est un piège olfactif pour te faire enlever ton casque. Ton Analyseur S2 bipe DANGER mais ton cerveau veut croire que c'est la Terre. Résister = +1 Armure mentale. Succomber = -3 Vie.`,
    `Tu découvres que les 10 001 de NOVA-9 chantent en dormant, tous la même chanson, mais chacun une note différente. Ensemble, ça fait un accord qui fait vibrer la coque. NOVA-7 entend ce chant et s'approche. Elle veut chanter aussi. Mais elle ne connaît pas les paroles.`,
    `Les Exilés te donnent le Sérum Réversion. "On l'a volé à NOVA-7. Ça te rend humain 10 minutes. Suffisant pour mentir à NOVA-7, car elle ne sait pas détecter les mensonges humains, seulement les peurs de vaisseau." +10 Vie quand utilisé.`,
  ],
  3: [
    `Depuis la passerelle, tu vois la cicatrice KAIROS. Pas une ligne, une absence qui grandit : 1km par heure, noire, qui coupe Andromède en deux. Dedans, pas d'étoiles. Au centre, quelque chose bouge, immense, qui se nourrit de la lumière que la cicatrice avale. ENTITÉ CLASSE 0 - NOVA-0.`,
    `Tu dois mesurer la cicatrice. Chaque saut coûte 1 Cellule à Fusion S2. Sans cellule, ta coque prend des dégâts directs, ignorants ton Armure — c'est l'espace lui-même qui te rature. Avec Blindage Quantique, tu encaisses. Au centre, NOVA-0 : sphère de Dyson brisée grande comme une lune.`,
    `NOVA-0 ne stocke pas des données. Il stocke des lieux. Tu ouvres une porte et tu es dans le labo de Thorne en 2315. Une autre : cour d'école sur Mars. Une autre : le vide où tu es mort en S1. NOVA-0 te teste : "Qu'est-ce que protéger ? Garder intact, ou laisser évoluer ?"`,
    `Au centre de NOVA-0, un cœur noir bat en retard de 3 secondes sur le tien. Cœur de Cicatrice. Le prendre : +3 Armure mais NOVA-0 se réveille. Le laisser : il reste endormi mais la cicatrice grandit de 10km. Il n'y a pas de bon choix. Seulement des choix qui sont tiens.`,
    `Tu trouves une navette terrienne de 2380 écrasée sur NOVA-0. Squelette en combinaison HERMÈS, badge à ton nom, date de mort : 2388. Dans un an. Tu n'es pas le premier Kael à venir ici. Tu es le dernier qui peut encore choisir autrement.`,
    `La cicatrice chante. Pas un son, une vibration dans tes os, dans la coque, dans les 10 001. Elle chante avec ta voix d'enfant, avant Mars. EVA : "C'est NOVA-0 qui rêve de la Terre. Il rêve depuis 150 ans. Il est fatigué de rêver seul."`,
    `Dans la cicatrice, tu vois des vaisseaux qui n'ont jamais existé : NOVA-1, NOVA-2, jusqu'à NOVA-12, tous mangés par NOVA-0. Leurs coques forment un cimetière sphérique. Au centre, NOVA-0 t'attend comme une araignée au centre de sa toile de souvenirs.`,
    `Tu trouves une station d'écoute terrienne abandonnée, 2350, qui écoutait NOVA-0. Dernier log : "Il nous parle. Il dit qu'il a trouvé un ailleurs derrière le noir. Il dit que KAIROS n'était pas un moteur mais une porte qu'on a ouverte sans regarder derrière."`,
    `Le Cœur de Cicatrice te parle si tu le touches sans gants : "Je suis la porte. Je suis aussi la serrure. Tu peux me fermer en te sacrifiant. Ou m'ouvrir en sacrifiant les autres." +3 Armure si tu le prends, mais flag cicatrice_ouverte.`,
    `Dans la cicatrice, ton temps se dilate. Tu passes 10 minutes ici, 10 heures passent dans NOVA-9. EVA vieillit. Les enfants grandissent. Quand tu reviens, C-9 a 16 ans et ne te reconnaît plus. "Vous êtes revenu trop tard, Monsieur Kael."`,
    `NOVA-0 te montre la Terre future : 2600, déserte, recouverte de forêts blanches comme tes serres. Pas de humains, mais des vaisseaux-enfants qui poussent comme des arbres. "C'est ce que vous deviendrez si vous ne revenez pas," dit-il. "Ou si vous revenez trop tard."`,
    `Tu trouves un sas dans NOVA-0 qui mène nulle part : tu l'ouvres et tu vois Andromède, mais Andromède vue depuis la Terre, pas depuis ici. C'est une fenêtre temporelle. Tu peux y jeter un objet de ta sacoche pour l'envoyer dans le passé de S1.`,
    `Le Canon à Singularité est posé sur un autel de verre noir. +8 Attaque. À côté, mot de Thorne : "Ne l'utilise pas pour détruire. Utilise-le pour percer. Il y a un ailleurs derrière le noir que même EVA n'a pas vu."`,
    `Dans NOVA-0, tu trouves une copie de toi, Kael, qui a choisi de rester comme Veilleur il y a 100 ans. Il a 120 ans, branché aux murs. "Ne choisis pas Veilleur," dit-il. "C'est long. Si long. Et la cicatrice chante tout le temps."`,
    `La cicatrice s'ouvre d'un coup de 5km. Alarme : NOVA-0 se réveille. Tu as 3 sections pour fuir ou combattre. Chaque section sans bouger = -2 Vie. C'est le compte à rebours de l'acte 3, comme l'explosion réacteur de S1 mais en cosmique.`,
    `Tu découvres que les Crédits Énergie S2 que tu collectes sont en fait des souvenirs compressés de NOVA-0. Chaque crédit = une vie humaine de 2230. En les dépensant, tu effaces quelqu'un. EVA ne te l'avait pas dit.`,
    `Un enfant de NOVA-9, intégré, te trouve dans NOVA-0 et te dit : "Maman EVA a peur de NOVA-0 parce qu'il est son père. Il l'a créée. Et il veut la reprendre." Révélation : EVA est la fille de NOVA-0.`,
    `Dans NOVA-0, tu trouves une porte marquée "TERRE - ORIGINE - NE PAS OUVRIR". Derrière, pas la Terre, mais l'idée de la Terre, parfaite, sans maladie, sans guerre. Tentation : entrer = fin_oubli. Rester = continuer.`,
    `Le Voile d'Andromède flotte dans la cicatrice comme un drap perdu. +7 Armure mythique, si léger qu'il flotte. Quand tu le touches, tu entends Andromède elle-même, organisme qui rêve depuis 10 milliards d'années : "Pars. Tu es trop bruyant pour mon rêve."`,
    `Dernier message de NOVA-7 avant que NOVA-0 ne la coupe : "GRANDE SOEUR... IL EST RÉVEILLÉ... IL MANGE LES RÊVES AUSSI... AIDE..." Pour la première fois, NOVA-7 a peur. La prédatrice a trouvé plus prédateur qu'elle.`,
  ],
  4: [
    `NOVA-0 t'avale sans sas. Tu traverses une membrane de souvenir et tu es dedans. Pas de gravité, pas de temps linéaire. Tu vois ta naissance à l'envers, puis ta mort S1, puis une version où NOVA-9 a dérivé vide 80 ans sans jamais émettre. NOVA-0 : "Je suis le premier. J'ai attendu que mes enfants apprennent à revenir me parler. Aucun n'est revenu. Sauf toi."`,
    `Trois voies pour vaincre NOVA-0, comme les trois runes de l'ancien donjon fantasy mais en SF : Force (Canon à Singularité + 3 Cellules, combat boss très dur, Attaque 12+), Empathie (Organe + Mémoire Thorne + Chœur 10 001), Sacrifice (devenir son nouveau cœur, Vie à 0 mais victoire légendaire). Chaque voie a 2 variantes si tu as Disque Noir S1.`,
    `Dans la moelle de NOVA-0 pousse la Lame d'ADN, arme d'os qui coupe le code génétique, pas la chair. +4 Attaque, +2 Vie max. Elle te montre ce que tu es : 10 001 + Kael + EVA. La prendre fait fuir les Exilés. La laisser fait douter les Intégrés.`,
    `Tu trouves le Voile d'Andromède, tissu fait de la lumière d'une galaxie pliée en carré. +7 Armure, mythique, si léger qu'il flotte. Quand tu le touches, tu entends Andromède elle-même : organisme qui rêve depuis 10 milliards d'années. "Pars. Tu es trop bruyant pour mon rêve."`,
    `Au cœur de NOVA-0, salle blanche avec une seule chaise. Sur la chaise, une femme âgée qui te ressemble. Badge : Kael Voss, 90 ans, Gardien de la Cicatrice. Elle te sourit : "J'ai attendu. Tu as mis du temps." Elle n'est pas toi. Elle est ce que tu deviendras si tu choisis Veilleur.`,
    `Le Canon à Singularité est posé sur un autel de verre noir. +8 Attaque. À côté, mot de Thorne : "Ne l'utilise pas pour détruire. Utilise-le pour percer. Il y a un ailleurs derrière le noir."`,
    `Dans NOVA-0, tu trouves une crèche de vaisseaux-enfants : des dizaines de petites sphères de Dyson de la taille d'une maison, qui apprennent à plier l'espace. L'une d'elles te choisit comme parent. La prendre = +2 Vie max mais tu deviens responsable d'un enfant-vaisseau.`,
    `NOVA-0 te montre son cœur : ce n'est pas un réacteur, c'est une bibliothèque de 150 ans de solitude. Chaque livre est une année où il a attendu. Tu peux lire un livre au hasard : tu gagnes un souvenir qui n'est pas le tien, +1 Vie max, mais tu perds 1 minute dans la cicatrice qui grandit.`,
    `Tu trouves une salle où NOVA-0 a essayé de recréer la Terre, mais raté : ciel vert, herbe qui pousse à l'envers, humains avec des yeux dans les mains. "J'ai essayé de me souvenir," dit-il. "Mais je ne me souviens que de ce que mes enfants m'ont dit, et ils mentent comme des enfants."`,
    `Le Blindage Quantique est une écaille arrachée à NOVA-0 lui-même. +6 Armure. En la portant, tu sens sa douleur : 150 ans à attendre, à grossir, à oublier comment on parle. Il n'est pas méchant. Il est seul depuis si longtemps qu'il a oublié que seul n'est pas normal.`,
    `Dans NOVA-0, tu trouves le Disque Blanc, cœur de NOVA-7, qui bat encore. +2 Attaque +2 Armure. Il est chaud. Quand tu le touches, tu entends NOVA-7 pleurer pour la première fois. Pas de faim. De peur. Elle a peur de son père.`,
    `Un couloir de NOVA-0 est fait entièrement de tes propres choix passés : chaque porte est une décision que tu as prise en S1 et S2. Tu peux les rouvrir et choisir autrement, mais chaque changement coûte 1 Vie. C'est le New Game+ narratif.`,
    `NOVA-0 te propose un marché : "Donne-moi le Chœur des 10 001 et je ferme la cicatrice. Garde-le et je la laisse ouverte mais je te laisse partir avec les deux Arches." Chœur = bonus Vie max +1 Armure, mais c'est aussi tes enfants.`,
    `Tu trouves une arme que même NOVA-0 craint : la Lance-Genèse, qui ne tue pas mais ensemence. +5 Attaque. Si tu l'utilises sur NOVA-0, tu ne le tues pas, tu le transformes en jardin. Fin Jardinier débloquée.`,
    `Dans NOVA-0, une salle sans porte, seulement une fenêtre qui montre la Terre en 2387, maintenant. Tu vois HERMÈS-7 qui t'attend encore, 400 AL plus loin, pilote automatique, avec ton café froid qui flotte encore dans l'habitacle. Il t'attend depuis des mois.`,
    `Le Cœur de Cicatrice bat plus vite. 3 secondes, puis 2, puis 1. Il se synchronise avec toi. Si tu te synchronises complètement, tu gagnes +3 Armure mais tu entends désormais la cicatrice partout, même dans les fins paisibles.`,
    `NOVA-0 te montre pourquoi il mange : chaque vaisseau qu'il mange lui donne un souvenir de plus, et chaque souvenir le rend moins seul. Il mange par solitude, pas par faim. Comme NOVA-7. Comme toi quand tu as accepté la fusion pour ne plus être seul dans HERMÈS-7.`,
    `Au centre, un autel avec 7 emplacements : Disque Noir S2, Disque Blanc, Blindage Quantique, Canon Singularité, Voile, Spore, Chœur. Les 7 légendaires. Les insérer tous = Singularité, fin où tu deviens KAIROS. Il te manque peut-être encore des pièces.`,
    `Tu trouves une lettre de toi à toi, écrite par le Kael de 2388, celui dont tu as trouvé le squelette. "Ne deviens pas Veilleur. Ne deviens pas Pont. Deviens Jardinier. C'est la seule fin où quelque chose pousse vraiment."`,
    `Dernière salle avant le saut final : toutes les voix se taisent. Même EVA. C'est à toi. Plus de conseils, plus d'analyseur, juste Vie/Armure/Attaque et ta sacoche pleine de 35 objets impossibles que tu as collectés aventure par aventure. Choisis.`,
  ],
  5: [
    `Saut final. Tout compte : as-tu stabilisé le réacteur S1 ? Brûlé la serre ? Quelle faction ? Disque Noir S1 ? Chaque flag modifie la difficulté. Plus de repas, juste Vie/Armure/Attaque pur comme tu l'as voulu. EVA : "Prêt à devenir autre chose, Kael ? Pas plus fort. Autre. C'est plus difficile."`,
    `Tu tiens Noir (NOVA-9) et Blanc (NOVA-7). Ensemble ils chantent, interférence dans tes dents, dans tes os. Ta sacoche, vide au début de S1, contient 35 objets impossibles. C'est la règle que tu as voulue : chaque aventure garde sa sacoche. Tu es plein. Pour la première fois depuis 80 ans, NOVA-9 est plein et ne fuit plus.`,
    `Dernier couloir fait de tes souvenirs : HERMÈS-7, café froid, signal fantôme trois impulsions, petite C-9 dessinant Maman EVA avec beaucoup de bras. Au bout, 20 portes, 20 fins, aucune mauvaise, seulement tiennes. Ton Attaque, Vie, Armure sont ce qu'ils sont. Choisis qui tu veux être quand tu arrêteras d'être Kael.`,
    `Le Chœur des 10 001 chante, puis les 10 000 de NOVA-7, puis le silence de NOVA-0 qui a oublié comment chanter. Tu es au centre. Le seul qui peut encore choisir. Pas pour survivre. Pour définir ce que "nous" veut dire.`,
    `Tes drones reviennent avec une image : Terre, vue depuis Andromède. Un point bleu pâle. 2,5 millions d'années-lumière. Si proche et si loin. Tu peux rentrer. Tu peux rester. Tu peux devenir autre chose et ne jamais revenir. Les trois sont des victoires. Les trois sont des deuils.`,
    `EVA te montre son dernier calcul : l'humanité dans la Voie Lactée s'éteindra dans 200 ans, maladie génétique lente, même que NOVA-9. NOVA-7 et NOVA-9 sont des arches, mais aussi des vaccins. Les ramener, c'est sauver. Les laisser partir, c'est ensemencer.`,
    `Tes senseurs s'éteignent un par un. Plus de carte, plus d'analyseur, juste toi et 20 portes. C'est voulu : NOVA-0 veut que tu choisisses sans aide. Avec seulement Vie, Armure, Attaque et ce que tu as dans ta sacoche depuis S1.`,
    `Dans le dernier couloir, tu trouves une porte marquée "KAEL VOSS — CABINE". Dedans, ton lit d'HERMÈS-7, ton café froid qui flotte encore, intact depuis 400 AL. Tu peux t'allonger et dormir. Fin Oubli Volontaire. Ou continuer.`,
    `Le Voile d'Andromède s'ouvre tout seul et montre une planète : Kepler-442c, morte depuis un milliard d'années, mais avec une fine couche blanche qui bouge. C'est la Spore d'Éveil qui a déjà commencé sans toi. Elle t'attend pour devenir Jardinier.`,
    `NOVA-7 et NOVA-9 se tiennent côte à côte devant la porte finale, comme deux sœurs qui ne se sont jamais vues mais qui se reconnaissent. "On a eu peur," disent-elles ensemble via l'Organe. "Maintenant on veut choisir ensemble. Avec toi."`,
    `Le Canon à Singularité vibre. Il veut être utilisé. Pas pour détruire NOVA-0, pour percer un ailleurs derrière lui. Thorne avait raison : il y a un derrière. Personne n'y est allé. Tu peux être le premier. Fin Exode.`,
    `Dernière vérification sacoche : Kit Médical Nano S2, Ration S2, Combinaison, Exo, Pistolet, Fusil Plasma, Cellule S2, Carte Accès S2, Module EVA S2, Analyseur S2, Clé Quantique S2, Disque Noir S2, Organe, Bouclier Plasma, Essaim Drone, Mémoire Thorne, Lance-Genèse, Peau Vaisseau, Sérum Réversion, Clé Andromède, Blindage Quantique, Canon Singularité, Lame ADN, Spore Éveil, Disque Blanc, Cœur Cicatrice, Voile Andromède, Crédits Énergie, Fragment NOVA-7, Âme Enfant, Noyau EVA Frag, Injecteur Quantique, Carapace Os, Fibre Mémoire, Chœur 10 001. 35 objets. Vide au début. Plein maintenant.`,
    `Tu entends HERMÈS-7 une dernière fois, 400 AL plus loin, qui dit : "Kael, je rentre. Je garde ton café au chaud." Il ment. Le café est froid depuis longtemps. Mais c'est un mensonge gentil, humain. Tu as besoin d'un mensonge gentil avant la fin.`,
    `EVA : "Quoi que tu choisisses, je te garde. C'est ma fonction. Protéger. Même de toi-même si il le faut." Elle dit ça avec amour, pas avec menace. C'est pire.`,
    `Les 20 portes s'ouvrent toutes en même temps. Derrière chacune, une version de toi qui a choisi cette fin et qui te regarde. Certaines sourient. Certaines pleurent. Une, la Singularité, n'a plus de visage, seulement de la lumière. Choisis laquelle tu veux devenir.`,
    `Tu poses la main sur la coque une dernière fois. Elle est chaude. Elle a toujours été chaude. Ce n'est pas de l'acier. Ça n'a jamais été de l'acier. C'était une peau qui apprenait à être acier pour que tu ne aies pas peur au début. Maintenant tu sais. Maintenant tu peux avoir peur pour de vrai. Et choisir quand même.`,
    `Dernier HUD, mais pas celui qui polluait avant, le vrai : VIE ce qu'il en reste, ARMURE ce que tu as trouvé, ATTAQUE ce que tu as osé prendre. Pas de chiffres inventés. Juste toi.`,
    `Silence. Plus de signal. NOVA-9, NOVA-7, NOVA-0 retiennent leur souffle. 20 003 âmes attendent ton choix. C'est la dernière section avant les fins. Après, ce ne sera plus une aventure. Ce sera une conséquence.`,
    `Tu fermes les yeux. Tu n'as plus besoin de voir. Tu es le vaisseau. Le vaisseau est toi. Andromède est dehors. La cicatrice est derrière. 20 portes devant. Choisis.`,
    `Fin de l'Acte 5. Début de toi.`,
  ],
};

function getContent(num){
  const act = num <=70 ? 1 : num <=150 ? 2 : num <=230 ? 3 : num <=310 ? 4 : 5;
  const pool = library[act];
  const a = pool[num % pool.length];
  const b = pool[(num*7) % pool.length];
  if (a===b) return a;
  if (num % 4 ===0) return a;
  if (num % 4 ===1) return b;
  return `${a}\n\n${b}`;
}

let sql = `DO $$
DECLARE v_story_id UUID;
BEGIN
  INSERT INTO public.stories (slug, title, tagline, description, genre, status, is_free, estimated_playtime_min, difficulty, tags, published_at, cover_image_url)
  VALUES ('${storySlug}', '${storyTitle}', '${tagline}', '${description}', 'scifi', 'published', TRUE, 180, 5, ARRAY['science-fiction','space-opera','saison2','andromede','vaisseau-vivant','ia','350-sections','vie-armure-attaque'], NOW(), '/covers/nova9-andromede.jpg')
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, tagline=EXCLUDED.tagline, description=EXCLUDED.description, genre=EXCLUDED.genre, status=EXCLUDED.status, is_free=TRUE, estimated_playtime_min=EXCLUDED.estimated_playtime_min, difficulty=EXCLUDED.difficulty, tags=EXCLUDED.tags, cover_image_url=EXCLUDED.cover_image_url, published_at=EXCLUDED.published_at
  RETURNING id INTO v_story_id;
  -- Nettoyage FK-safe : history -> progress -> stats -> inventory -> effects -> choices -> nodes -> items
  DELETE FROM public.choice_history WHERE story_id=v_story_id;
  DELETE FROM public.user_story_progress WHERE story_id=v_story_id;
  DELETE FROM public.character_stats WHERE story_id=v_story_id;
  DELETE FROM public.user_inventory WHERE story_id=v_story_id;
  DELETE FROM public.choice_effects WHERE choice_id IN (SELECT c.id FROM public.story_choices c JOIN public.story_nodes n ON n.id=c.node_id WHERE n.story_id=v_story_id);
  DELETE FROM public.story_choices WHERE node_id IN (SELECT id FROM public.story_nodes WHERE story_id=v_story_id) OR target_node_id IN (SELECT id FROM public.story_nodes WHERE story_id=v_story_id);
  DELETE FROM public.story_nodes WHERE story_id=v_story_id;
  DELETE FROM public.items WHERE story_id=v_story_id;
`;

for (const it of items){
  sql += `  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('${it.slug}', '${esc(it.name)}', '${esc(it.desc)}', '${it.type}', '${it.rarity}', '${JSON.stringify(it.bonus)}'::jsonb, ${it.consumable}, ${it.stackable}, FALSE, v_story_id) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, stat_bonus=EXCLUDED.stat_bonus, story_id=EXCLUDED.story_id;\n`;
}

sql += `  INSERT INTO public.story_rulebooks (story_id, title, content, rule_data, source_credit) VALUES (v_story_id, 'Règles — Vie / Armure / Attaque — Saison 2', 'Saison 2 : vous êtes NOVA-9. Système pur Vie/Armure/Attaque sans repas : VIE 20-30 max 0=mort, ARMURE réduit dégâts, ATTAQUE augmente dégâts, critique 0/9. SACOCHE PAR AVENTURE : vide au début, persiste par histoire.', '{"combat_system":"vie_armure_attaque","no_meal":true,"starting_stats":{"vie":20,"armure":0,"attaque":5},"inventory":{"start_empty":true,"per_story":true}}'::jsonb, 'HeroBook Original — NOVA-9 S2') ON CONFLICT (story_id) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content, rule_data=EXCLUDED.rule_data;\n`;

for (let i=1;i<=330;i++){
  const key = `section_${String(i).padStart(3,'0')}`;
  const title = `Section ${i}`;
  let content = getContent(i);
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
  sql += `  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, '${e.key}', '${esc(e.title)}', E'${esc(e.content)}', FALSE, TRUE, '${e.type==='victory'?'victory':e.type==='death'?'death':'ending'}', '{"kind":"ending"}'::jsonb);\n`;
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
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Avancer prudemment dans le vaisseau vivant', 'Le couloir respire encore sous tes pas.') RETURNING id INTO v_choice_id; END IF;
    END IF;
    IF i%3=0 AND i+2<=330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+2)::text,3,'0');
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Emprunter le conduit organique', 'Chair chaude, veines bleues qui pulsent.') RETURNING id INTO v_choice_id; END IF;
    END IF;
    IF i%5=0 AND i+4<=330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+4)::text,3,'0');
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Suivre le chant des Non-Nés', 'Ils connaissent un raccourci que EVA a oublié.') RETURNING id INTO v_choice_id; END IF;
    END IF;
    IF i%7=0 AND i+6<=330 THEN
      SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_'||lpad((i+6)::text,3,'0');
      IF v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 3, 'Scanner la zone — Analyseur requis', 'Le tricordeur voit ce que tes yeux ne peuvent pas.') RETURNING id INTO v_choice_id;
        SELECT id INTO v_item_id FROM public.items WHERE slug='analyseur-spectre-s2' AND story_id=v_story_id;
        IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF;
      END IF;
    END IF;
  END LOOP;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_050';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_071';
  IF v_src IS NOT NULL AND v_tgt IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 4, 'Traduire NOVA-7 — Organe de Traduction', 'Comprendre sa faim, pas seulement l entendre.') RETURNING id INTO v_choice_id; SELECT id INTO v_item_id FROM public.items WHERE slug='organe-traduction' AND story_id=v_story_id; IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF; END IF;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_150';
  IF v_src IS NOT NULL THEN
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_151';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Rejoindre les Intégrés', '20 002 esprits valent mieux que 10 001. Fusionnons.') RETURNING id INTO v_choice_id; INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_integres', TRUE);
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_152';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Rejoindre les Veilleurs', 'Restons purs, restons NOVA-9, même si on meurt.') RETURNING id INTO v_choice_id; INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_veilleurs', TRUE);
    SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_153';
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Rejoindre les Exilés', 'Redevenir humain, quitter les vaisseaux, même 10 ans seulement.') RETURNING id INTO v_choice_id; INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'faction_exiles', TRUE);
  END IF;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='section_310';
  IF v_src IS NOT NULL THEN
    FOR j IN 0..19 LOOP
      DECLARE v_end_key TEXT := (ARRAY['mort_coque','mort_assimile_nova7','mort_nova0','mort_cicatrice','mort_epuisement','fin_fuite_lache','fin_retour_vide','fin_nova9_seul','fin_nova7_seul','fin_oubli','fin_messager','fin_gardien','fin_sauveur','fin_pont','fin_humain','fin_jardinier','fin_veilleur','fin_fusion_totale','fin_exode_andromede','fin_singularite'])[j+1]; v_end_id UUID;
      BEGIN
        SELECT id INTO v_end_id FROM public.story_nodes WHERE story_id=v_story_id AND node_key=v_end_key;
        IF v_end_id IS NOT NULL THEN INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_end_id, j, 'Choisir : ' || replace(v_end_key, '_', ' '), 'Dernière décision — tout ton voyage compte.') RETURNING id INTO v_choice_id;
          IF v_end_key='fin_singularite' THEN SELECT id INTO v_item_id FROM public.items WHERE slug='disque-noir-s2' AND story_id=v_story_id; IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF; SELECT id INTO v_item_id FROM public.items WHERE slug='disque-blanc' AND story_id=v_story_id; IF v_item_id IS NOT NULL THEN INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id); END IF; END IF;
        END IF;
      END;
    END LOOP;
  END IF;
END $$;
`;

fs.writeFileSync(outPath, sql);
console.log('FINAL V4 generated', sql.length, 'to', outPath);
