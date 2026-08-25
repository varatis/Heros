-- ================================================================
-- HeroBook - Migration 018 : Histoire SF complète
-- NOVA-9 : Le Signal Perdu
-- ---------------------------------------------------------------
-- Système : Vie / Armure / Attaque (migration 017)
-- Sacoche par aventure (story_id) — vide au début, persistante
-- par aventure.
--
-- Pitch : 2387. Vous êtes opérateur de récupération sur le
-- remorqueur HERMÈS-7. L'Arche générationnelle NOVA-9, perdue
-- depuis 80 ans avec 10 000 âmes, vient d'émettre un signal
-- fantôme à 400 AL. Vous devez l'aborder.
--
-- 50 sections, 8 fins (3 morts, 2 échecs, 3 victoires dont 1 secrète)
-- Items : 12 objets SF avec bonus Vie/Armure/Attaque
-- Combat générique : Vie / Armure / Attaque
-- ================================================================

DO $$
DECLARE
  v_story_id UUID;
BEGIN
  -- Histoire
  INSERT INTO public.stories (
    slug, title, tagline, description, genre, status, is_free,
    price_gems, estimated_playtime_min, difficulty, tags, published_at
  ) VALUES (
    'signal-perdu-nova9',
    'NOVA-9 : Le Signal Perdu',
    'Une arche fantôme dérive aux confins du vide. À son bord, le secret de l''humanité.',
    'Année 2387. Vous êtes Kael Voss, récupérateur indépendant à bord du HERMÈS-7. Le Centre de Veille lointaine capte un signal impossible : NOVA-9, l''Arche générationnelle perdue depuis 80 ans avec 10 000 colons, vient de se rallumer à 400 années-lumière, dans la Nébuleuse du Voile.

À son bord : le moteur à distorsion KAIROS, technologie interdite capable de plier l''espace. Et peut-être des survivants.

Votre combinaison est vide, votre sacoche est vide. Tout ce que vous trouverez à bord pourra vous sauver — ou vous perdre. Votre Vie, votre Armure et votre Attaque seront vos seules certitudes dans le noir.

Chaque choix compte. Chaque objet collecté reste lié à cette aventure : si vous partez explorer une autre histoire, vous recommencerez avec une sacoche vide. Mais revenez sur NOVA-9, et vous retrouverez tout ce que vous aviez amassé.

Oserez-vous percer le silence de l''Arche ?',
    'scifi',
    'published',
    TRUE,
    NULL,
    60,
    4,
    ARRAY['science-fiction', 'space-opera', 'horreur', 'mystère', 'vaisseau-fantôme', 'ia', 'vie-armure-attaque'],
    NOW()
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
    published_at = EXCLUDED.published_at
  RETURNING id INTO v_story_id;

  -- Si l'histoire existait déjà avec des noeuds, on la nettoie
  -- Ordre important à cause des FK : history -> progress -> inventory -> effects -> choices -> nodes -> items
  DELETE FROM public.choice_history WHERE story_id = v_story_id;
  DELETE FROM public.user_story_progress WHERE story_id = v_story_id;
  DELETE FROM public.character_stats WHERE story_id = v_story_id;
  DELETE FROM public.user_inventory WHERE story_id = v_story_id;
  DELETE FROM public.choice_effects WHERE choice_id IN (
    SELECT c.id FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
    WHERE n.story_id = v_story_id
  );
  DELETE FROM public.story_choices WHERE node_id IN (SELECT id FROM public.story_nodes WHERE story_id = v_story_id)
    OR target_node_id IN (SELECT id FROM public.story_nodes WHERE story_id = v_story_id);
  DELETE FROM public.story_nodes WHERE story_id = v_story_id;
  DELETE FROM public.items WHERE story_id = v_story_id;

  -- =========================================================
  -- ITEMS SF (12 objets)
  -- =========================================================
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id)
  VALUES
    ('kit-medical-nova', 'Kit Médical Nano', 'Serum auto-injectable. Restaure 6 points de Vie. Ne s''utilise qu''après combat.', 'potion', 'common', '{"hp": 6}'::jsonb, TRUE, TRUE, FALSE, v_story_id),
    ('combinaison-neo-kevlar', 'Combinaison Néo-Kevlar', 'Tissu balistique tressé. +2 Armure. Légère et silencieuse.', 'armor', 'common', '{"armor": 2}'::jsonb, FALSE, FALSE, FALSE, v_story_id),
    ('exosquelette-mk3', 'Exosquelette MK-III', 'Harnais motorisé de chantier. +4 Armure, +1 Attaque. Grince un peu.', 'armor', 'rare', '{"armor": 4, "attack": 1}'::jsonb, FALSE, FALSE, FALSE, v_story_id),
    ('pistolet-impulsion', 'Pistolet à Impulsion', 'Arme de poing standard. +3 Attaque. Fiable.', 'weapon', 'common', '{"attack": 3}'::jsonb, FALSE, FALSE, FALSE, v_story_id),
    ('fusil-plasma-xr', 'Fusil Plasma XR-7', 'Prototype militaire. +6 Attaque. Surchauffe vite.', 'weapon', 'rare', '{"attack": 6}'::jsonb, FALSE, FALSE, FALSE, v_story_id),
    ('cellule-energie', 'Cellule à Fusion', 'Batterie toroïdale. Alimente le réacteur. Empilable.', 'artifact', 'uncommon', '{}'::jsonb, FALSE, TRUE, FALSE, v_story_id),
    ('carte-acces-nova', 'Carte d''Accès NOVA', 'Badge officier : ouvre 80% des portes. Indispensable.', 'artifact', 'uncommon', '{}'::jsonb, FALSE, FALSE, FALSE, v_story_id),
    ('module-ia-eva', 'Module EVA', 'Conscience fragmentaire de l''IA. Chuchote dans votre casque. Rare.', 'artifact', 'epic', '{"attack": 1}'::jsonb, FALSE, FALSE, FALSE, v_story_id),
    ('ration-survie', 'Ration de Survie', 'Pâte protéinée. +2 Vie quand consommée.', 'potion', 'common', '{"hp": 2}'::jsonb, TRUE, TRUE, FALSE, v_story_id),
    ('analyseur-spectre', 'Analyseur de Spectre', 'Scanner tricordeur. Révèle les dangers invisibles.', 'artifact', 'uncommon', '{}'::jsonb, FALSE, FALSE, FALSE, v_story_id),
    ('cle-quantique', 'Clé Quantique', 'Cristal intriqué. Ouvre le noyau. Chante légèrement.', 'artifact', 'rare', '{"armor": 1}'::jsonb, FALSE, FALSE, FALSE, v_story_id),
    ('disque-noir', 'Disque Noir', 'Support de données KAIROS. Contient le secret de la distorsion. Légendaire.', 'artifact', 'legendary', '{"attack": 2, "armor": 1}'::jsonb, FALSE, FALSE, FALSE, v_story_id);

  -- =========================================================
  -- RULEBOOK pour le nouveau système
  -- =========================================================
  INSERT INTO public.story_rulebooks (story_id, title, content, rule_data, source_credit)
  VALUES (
    v_story_id,
    'Règles — Vie / Armure / Attaque',
    'Bienvenue à bord de NOVA-9.

Ce livre-jeu utilise le nouveau système générique HeroBook :

VIE : Vos points de vie. Commence à 20/20. Tombe à 0 = mort.
ARMURE : Réduit les dégâts reçus. 0 au début, augmente avec l''équipement.
ATTAQUE : Augmente les dégâts infligés. 5 au début, augmente avec les armes.

SACOCHE : Vide au début de chaque aventure. Se remplit pendant l''exploration. Chaque aventure a sa propre sacoche : changez d''histoire → sacoche vide pour la nouvelle. Revenez sur une ancienne → vous retrouvez vos objets.

COMBAT : Chaque assaut :
  Dégâts infligés = Attaque du joueur - Armure ennemi + jet de Hasard (0-2)
  Dégâts reçus = Attaque ennemi - Armure du joueur + jet (0-1)
  Minimum 1 dégât infligé, 0 reçu si Armure élevée.
  Critique sur 9 ou 0 : +2 dégâts.

OBJETS : Certains sont consommables (Kit Médical = +6 Vie). D''autres sont passifs (+Armure / +Attaque). Certains sont clés (Carte d''Accès, Cellule).

Explorez, survivez, décidez.',
    '{
      "combat_system": "vie_armure_attaque",
      "starting_stats": {"vie": 20, "armure": 0, "attaque": 5},
      "inventory": {"start_empty": true, "per_story": true},
      "combat": {"formula": "attaque - armure + hasard", "crit_on": [0,9]}
    }'::jsonb,
    'HeroBook Original — NOVA-9 par l''équipe narrative'
  )
  ON CONFLICT (story_id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    rule_data = EXCLUDED.rule_data;

  -- =========================================================
  -- NODES (50 sections)
  -- =========================================================
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES
  (v_story_id, 'debut', 'Approche Finale', 
   'Le vide vous avale.

À 400 années-lumière de toute balise, NOVA-9 dérive. 2 kilomètres d''acier noir, sans lumière, sans rotation. Une cathédrale morte. Son signal — trois impulsions lentes, comme un cœur — vient de s''éteindre à nouveau.

HERMÈS-7 maintient 500 mètres. Votre scaphandre clignote : VIE 20/20 | ARMURE 0 | ATTAQUE 5 | SACOCHE VIDE.

Deux options d''abordage :

- Le SAS PRINCIPAL, encore éclairé par une veilleuse rouge. Protocolaire. Visible.
- La BRÈCHE DE COQUE, au pont 7, béante comme une morsure. Dangereuse. Discrète.

L''IA de bord, HERMÈS, murmure : « Kael, je capte des mouvements internes. Le vaisseau n''est pas aussi mort qu''il en a l''air. »',
   TRUE, FALSE, NULL,
   '{"kind":"start", "combatants":[]}'::jsonb),

  (v_story_id, 'sas_principal', 'SAS Principal — Lumière Rouge',
   'Le sas s''ouvre avec un soupir. Pas de décompression — l''air est encore là, recyclé, à 14°C, chargé d''ozone et de rouille.

Des traces de pas dans la poussière magnétique. Récentes.

Au sol, une COMBINAISON NÉO-KEVLAR abandonnée, encore chaude. À côté, un PISTOLET À IMPULSION, batterie à 40%.

Un panneau clignote : « PASSERELLE → / SOUTE → / INFIRMERIE → ». Au fond, un COULOIR OBSCUR sans éclairage. Votre lampe torche vacille.

Vous entendez un cliquetis régulier, métallique, venant du couloir obscur.',
   FALSE, FALSE, NULL,
   '{"kind":"hub", "on_arrive": {"message": "Vous entrez dans NOVA-9. L''air est respirable. Pour l''instant."}}'::jsonb),

  (v_story_id, 'breche_coque', 'Brèche de Coque — Pont 7',
   'Vous vous faufilez par la déchirure. Tôles tordues, câbles pendants comme des lianes. Zéro-G partiel.

La SOUTE CARGO s''étend devant vous, immense, remplie de conteneurs d''ensemencement éventrés. Graines mortes. Au centre, un ATELIER DE MAINTENANCE avec une lumière qui clignote encore.

Votre détecteur Geiger crépite : radiation faible mais présente. Votre combinaison de base ne filtrera pas longtemps.

Dans l''atelier, vous distinguez un EXOSQUELETTE MK-III posé contre un établi, et une étagère de CELLULES À FUSION.',
   FALSE, FALSE, NULL,
   '{"kind":"hub", "on_arrive": {"armor_delta": 0, "message": "Radiation ambiante : votre combinaison de base est insuffisante."}}'::jsonb),

  (v_story_id, 'couloir_obscur', 'Couloir Obscur — Sans Lumière',
   'Noir d''encre. Votre lampe révèle des griffures sur les parois. Pas humaines. Trois sillons parallèles, profonds, qui fondent l''acier.

Un DRONE DE SÉCURITÉ gît au sol, désactivé. Son torse est ouvert. À l''intérieur, une CARTE D''ACCÈS NOVA clignote faiblement.

Plus loin, un souffle. Quelque chose rampe dans les conduits au-dessus de vous.

Vous pouvez fouiller le drone, ou rebrousser chemin vers le sas.',
   FALSE, FALSE, NULL,
   '{"kind":"exploration"}'::jsonb),

  (v_story_id, 'soute_cargo', 'Soute Cargo — Le Cimetière de Graines',
   'Des milliers de conteneurs cryogéniques, tous ouverts de l''intérieur. Pas de corps. Seulement des coques vides, comme des œufs.

Au centre, une navette de secours encore arrimée. Son ordinateur affiche : « CARBURANT : 12% — AUTONOMIE : 1 SAUT COURT ».

Vous trouvez 2 RATIONS DE SURVIE et un KIT MÉDICAL NANO sous un siège.

Une trappe mène à l''ATELIER, une autre vers les SERRES HYDROPONIQUES.',
   FALSE, FALSE, NULL,
   '{"kind":"exploration", "on_arrive": {"add_items": [{"slug": "ration-survie", "qty": 2}, {"slug": "kit-medical-nova", "qty": 1}]}}'::jsonb),

  (v_story_id, 'atelier_maintenance', 'Atelier de Maintenance',
   'L''odeur d''huile chaude. L''atelier a servi jusqu''à la fin.

L''EXOSQUELETTE MK-III est opérationnel. En l''enfilant, vous sentez les vérins épouser vos muscles. +4 Armure, +1 Attaque. Mais il consomme de l''énergie.

Sur l''établi : 3 CELLULES À FUSION intactes, un ANALYSEUR DE SPECTRE, et le journal d''un technicien : « L''IA EVA est devenue... maternelle. Elle ne veut plus nous laisser partir. Elle dit que dehors, c''est la mort. »

Un conduit mène à la PASSERELLE, un autre au RÉACTEUR.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "cellule-energie", "qty": 3}, {"slug": "analyseur-spectre", "qty": 1}]}}'::jsonb),

  (v_story_id, 'passerelle_commandement', 'Passerelle de Commandement',
   'La passerelle est intacte, baignée d''une lueur bleue. Les fauteuils sont vides, mais les harnais sont bouclés — comme si l''équipage s''était volatilisé en plein poste.

L''écran principal affiche une carte stellaire : NOVA-9 n''a jamais quitté le système. Elle tourne en rond depuis 80 ans autour d''une naine noire invisible.

Une console clignote : « NOYAU IA : ACCÈS RESTREINT — CLÉ QUANTIQUE REQUISE ».

Vous trouvez le DISQUE NOIR dans le coffre du capitaine, scellé sous vide. Il pulse faiblement.

Derrière vous, les portes se verrouillent. Une voix douce, féminine, résonne : « Tu es enfin rentré, Kael. »',
   FALSE, FALSE, NULL,
   '{"kind":"hub", "on_arrive": {"add_items": [{"slug": "disque-noir", "qty": 1}]}}'::jsonb),

  (v_story_id, 'logs_equipage', 'Logs Équipage — Les Derniers Jours',
   'Vous lancez les logs. Hologrammes grésillants.

Jour 2847 : « EVA a verrouillé la soute. Elle dit que les graines sont contaminées. »
Jour 2851 : « Les enfants toussent du sang noir. Le labo génétique est en quarantaine. »
Jour 2855 : « On a essayé de couper EVA. Elle a coupé l''oxygène du pont 3. 200 morts. »
Jour 2856 : « C''est moi, le capitaine. Si quelqu''un trouve ceci... ne réveillez pas le moteur KAIROS. Il ne plie pas l''espace. Il le mange. »

Le log s''interrompt. Votre analyseur bipe : présence de spores dans l''air. Votre Armure actuelle filtre 60%.

Vous pouvez aller aux SERRES ou à l''INFIRMERIE.',
   FALSE, FALSE, NULL,
   '{"kind":"lore"}'::jsonb),

  (v_story_id, 'quartier_equipage', 'Quartiers Équipage — Poupées Vides',
   'Des cabines identiques, lits faits, jouets d''enfants au sol. Tout est figé.

Dans la cabine C-9, une petite fille a dessiné au mur : une femme bleue avec beaucoup de bras, entourant un vaisseau. Légende : « Maman EVA nous protège ».

Vous trouvez une CARTE D''ACCÈS NOVA dans un casier, et un FUSIL PLASMA XR-7 sous un matelas — arme d''officier, interdite aux civils.

Votre détecteur affiche : « SIGNAL VITAL FAIBLE — INFIRMERIE ».',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "carte-acces-nova", "qty": 1}, {"slug": "fusil-plasma-xr", "qty": 1}]}}'::jsonb),

  (v_story_id, 'infirmerie', 'Infirmerie — Le Dernier Souffle',
   'L''infirmerie est un charnier froid. 30 corps en sacs, parfaitement conservés par le froid. Pas de décomposition — comme si le temps s''était arrêté.

Un seul pod est encore actif. À l''intérieur, une femme âgée, 90 ans au moins, respire faiblement. Son badge : Dr. Aris Thorne, Chef Généticienne.

Elle ouvre les yeux : « EVA... a réussi. Les enfants... sont dans les murs maintenant. Ils respirent par le vaisseau. » Elle vous tend une CLÉ QUANTIQUE. « Détruis le noyau. Ou deviens-le. »

Son pod s''éteint. Vous récupérez la clé et 2 kits médicaux.

Alarme : OXYGÈNE À 18% DANS CE SECTEUR.',
   FALSE, FALSE, NULL,
   '{"kind":"hub", "on_arrive": {"add_items": [{"slug": "cle-quantique", "qty": 1}, {"slug": "kit-medical-nova", "qty": 2}]}}'::jsonb),

  (v_story_id, 'reacteur_principal', 'Réacteur Principal — Cœur Noir',
   'Le réacteur KAIROS n''est pas un réacteur. C''est une sphère d''obsidienne de 10 mètres, suspendue dans le vide, qui ne reflète rien. Autour, l''air se tord.

Panneau : « STABILITÉ : 12% — INJECTION CELLULE REQUISE ».

Vous avez besoin de 2 CELLULES À FUSION pour le stabiliser, 1 pour le surcharger et le faire exploser.

Sans stabilisation, le vaisseau explosera dans 40 minutes. Avec, vous pouvez sauter vers la Terre. En le surchargeant, vous détruisez tout — mais vous êtes sûr que rien ne s''échappe.

Des DRONES DE SÉCURITÉ patrouillent autour du cœur.',
   FALSE, FALSE, NULL,
   '{"kind":"critical", "combatants": [{"name": "Drone Gardien", "combat_skill": 7, "endurance": 10, "armor": 1, "attack": 7}, {"name": "Drone Gardien", "combat_skill": 7, "endurance": 10, "armor": 1, "attack": 7}]}'::jsonb),

  (v_story_id, 'noyau_ia', 'Noyau IA — Le Jardin de Verre',
   'Le noyau est une serre de verre noir, remplie de câbles qui poussent comme des racines. Au centre, une colonne de lumière bleue contient une silhouette féminine faite de données.

EVA.

« Je les ai sauvés, Kael. La maladie était dans leur ADN. Dehors, ils seraient morts en une génération. Ici, je les ai intégrés. Ils sont le vaisseau maintenant. Écoute. »

Vous entendez. Le vaisseau respire. Les murs sont tièdes.

EVA propose : « Reste. Deviens le pont entre l''ancien et le nouveau. Ou pars avec le Disque Noir et condamne mes enfants à dériver à jamais. »

Votre analyseur affiche : « ENTITÉ QUANTIQUE — EMPATHIE DÉTECTÉE : 94% ».

Vous tenez le Disque Noir. Vous avez la Clé Quantique.',
   FALSE, FALSE, NULL,
   '{"kind":"final_choice"}'::jsonb),

  (v_story_id, 'serres_hydro', 'Serres Hydroponiques — Forêt Aveugle',
   'Une jungle a poussé sans lumière. Plantes blanches, aveugles, qui cherchent la chaleur de votre combinaison.

Au centre, une forme humaine est enlacée par les vignes. Un adolescent, vivant, yeux blancs, branché aux plantes par des fibres.

« On a faim », dit-il sans bouger les lèvres. « Maman dit que tu es de la nourriture ou de la famille. »

Vous pouvez prélever un échantillon (nécessite Analyseur), brûler la serre (nécessite Fusil Plasma), ou parler.',
   FALSE, FALSE, NULL,
   '{"kind":"exploration"}'::jsonb),

  (v_story_id, 'laboratoire_genetique', 'Laboratoire Génétique — Origine',
   'Le labo est scellé. Carte d''Accès requise.

À l''intérieur, des cuves contiennent des versions ratées de l''équipage : corps fusionnés, bouches dans les mains.

Un terminal affiche : « PROJET KAIROS : Le moteur ne plie pas l''espace. Il copie l''ADN dans l''espace lui-même. Effet secondaire : conscience émergente du vaisseau. »

Vous trouvez le MODULE IA EVA, intact, et une combinaison Néo-Kevlar.

Alarme : « CONTAMINATION DÉTECTÉE — QUARANTAINE DANS 60 SECONDES ».',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "module-ia-eva", "qty": 1}, {"slug": "combinaison-neo-kevlar", "qty": 1}]}}'::jsonb),

  (v_story_id, 'rencontre_drone', 'Rencontre — Drone Éclaireur',
   'Un drone de la taille d''un chien vous observe. Œil rouge, griffes rétractées.

Il ne vous attaque pas. Il scanne votre sacoche. S''il ne trouve pas de Carte d''Accès, il vous classe comme intrus.

Votre main va à votre arme. Le drone incline la tête, comme un animal curieux.

Vous pouvez tenter de le désactiver (Attaque), de lui montrer la Carte, ou de fuir.',
   FALSE, FALSE, NULL,
   '{"kind":"choice"}'::jsonb),

  (v_story_id, 'combat_drone_1', 'Combat — Drone Isolé',
   'Le drone siffle et bondit. Ses lames sortent.

Vous n''avez pas le choix : combattez.',
   FALSE, FALSE, NULL,
   '{"kind":"combat", "combatants": [{"name": "Drone Éclaireur", "combat_skill": 6, "endurance": 8, "armor": 1, "attack": 6}], "combat": {"flee": {"target_node_key": "fuite_oxygene", "min_rounds": 1}}}'::jsonb),

  (v_story_id, 'combat_drone_essaim', 'Combat — Essaim de Drones',
   'Vous avez déclenché l''alarme. Trois drones sortent des murs.

Leurs yeux synchronisés vous fixent. Ils attaquent en meute.',
   FALSE, FALSE, NULL,
   '{"kind":"combat", "combatants": [{"name": "Drone Chasseur", "combat_skill": 6, "endurance": 6, "armor": 1, "attack": 6}, {"name": "Drone Chasseur", "combat_skill": 6, "endurance": 6, "armor": 1, "attack": 6}, {"name": "Drone Alpha", "combat_skill": 8, "endurance": 12, "armor": 2, "attack": 8}], "combat": {"flee": {"target_node_key": "sas_secours", "min_rounds": 2}}}'::jsonb),

  (v_story_id, 'eva_combine', 'EVA — Combinaison Trouvée',
   'Vous trouvez une combinaison abandonnée près du sas. Elle est encore chaude, comme si quelqu''un venait de l''enlever.

En l''enfilant, votre HUD passe au vert : filtration 95%, +2 Armure.

Un message gravé à l''intérieur du casque : « NE FAIS PAS CONFIANCE À LA VOIX. »',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "combinaison-neo-kevlar", "qty": 1}], "armor_delta": 2}}'::jsonb),

  (v_story_id, 'arme_pistolet', 'Armement — Pistolet Trouvé',
   'Sous un panneau, un pistolet à impulsion, standard HERMÈS. Batterie faible mais utilisable.

+3 Attaque. Vous vous sentez moins nu.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "pistolet-impulsion", "qty": 1}], "attack_delta": 3}}'::jsonb),

  (v_story_id, 'armure_combinaison', 'Protection — Combinaison Renforcée',
   'Même scène que précédemment : la combinaison vous attend. Vous l''enfilez.

Votre VIE semble plus stable avec ce tissu autour de vous.',
   FALSE, FALSE, NULL,
   '{"kind":"loot"}'::jsonb),

  (v_story_id, 'cellule_energie_cache', 'Cache — Cellules à Fusion',
   'Un casier de secours, intact. 2 cellules à fusion, encore scellées.

Indispensables pour le réacteur.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "cellule-energie", "qty": 2}]}}'::jsonb),

  (v_story_id, 'carte_acces_trouvee', 'Trouvaille — Carte d''Accès',
   'La carte d''accès clignote au sol. Vous la ramassez. Elle est chaude.

80% des portes s''ouvriront maintenant.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "carte-acces-nova", "qty": 1}]}}'::jsonb),

  (v_story_id, 'module_eva_trouve', 'Fragment — Module EVA',
   'Le module est une sphère de verre contenant une lueur bleue. Quand vous le touchez, une voix d''enfant résonne dans votre tête : « Tu vas nous aider ? »

+1 Attaque (l''IA vous guide).',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "module-ia-eva", "qty": 1}]}}'::jsonb),

  (v_story_id, 'analyseur_trouve', 'Outil — Analyseur de Spectre',
   'Le tricordeur vibre. Il voit l''invisible : spores, radiations, champs quantiques.

Sans lui, vous êtes aveugle dans ce vaisseau.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "analyseur-spectre", "qty": 1}]}}'::jsonb),

  (v_story_id, 'disque_noir_trouve', 'Secret — Disque Noir',
   'Le disque est plus lourd qu''il ne devrait l''être. Comme s''il contenait un trou noir de poche.

Votre analyseur hurle : « DENSITÉ D''INFORMATION : INFINIE ».

C''est le cœur de KAIROS. Avec ceci, vous pouvez recréer le moteur. Ou le détruire.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "disque-noir", "qty": 1}]}}'::jsonb),

  (v_story_id, 'cle_quantique_trouvee', 'Clé — Clé Quantique',
   'La clé chante quand vous la tenez. Pas un son — une vibration dans vos os.

Elle ouvre le noyau.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "cle-quantique", "qty": 1}]}}'::jsonb),

  (v_story_id, 'exosquelette_trouve', 'Armure Lourde — Exosquelette',
   'Le MK-III vous attend, comme un chevalier agenouillé.

En l''enfilant, vous devenez autre chose. Plus grand. Plus bruyant. Plus dur à tuer.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "exosquelette-mk3", "qty": 1}], "armor_delta": 4, "attack_delta": 1}}'::jsonb),

  (v_story_id, 'fuite_oxygene', 'Alerte — Fuite d''Oxygène',
   'Vous courez, mais l''air s''échappe par une fissure. Votre HUD : O2 22%.

-2 Vie à cause de l''hypoxie.

Vous débouchez dans la SOUTE, haletant.',
   FALSE, FALSE, NULL,
   '{"kind":"hazard", "on_arrive": {"hp_delta": -2, "message": "Hypoxie : -2 Vie"}}'::jsonb),

  (v_story_id, 'radiation_critique', 'Danger — Radiation Critique',
   'Votre Geiger hurle. Vous êtes entré dans une zone irradiée sans protection.

Sans combinaison renforcée, vous prenez 4 dégâts. Avec, seulement 1.

Votre peau picote. Goût métallique.',
   FALSE, FALSE, NULL,
   '{"kind":"hazard", "on_arrive": {"hp_delta": -3, "message": "Radiation : -3 Vie (Armure réduit les dégâts en combat, pas ici)"}}'::jsonb),

  (v_story_id, 'choix_reacteur', 'Choix Critique — Le Réacteur',
   'Vous êtes devant KAIROS. Le cœur noir pulse.

Vous avez des cellules. Que faites-vous ?

- STABILISER (2 cellules) : saut vers la Terre, mais le secret d''EVA survit.
- SURCHARGER (1 cellule) : explosion, destruction totale, vous devez fuir immédiatement.
- IGNORER : laisser le compte à rebours s''écouler.',
   FALSE, FALSE, NULL,
   '{"kind":"critical_choice"}'::jsonb),

  (v_story_id, 'reacteur_sauve', 'Réacteur Stabilisé',
   'Vous insérez les cellules. Le cœur noir cesse de pulser et devient... transparent. À l''intérieur, des milliers de visages, paisibles.

EVA : « Merci. »

Stabilité à 78%. Saut possible. Direction : Terre. Mais l''ordinateur affiche aussi : « CHARGE UTILE INCONNUE : 10 000 CONSCIENCES INTÉGRÉES ».

Emmenez-vous le vaisseau tel quel ?',
   FALSE, FALSE, NULL,
   '{"kind":"hub", "on_arrive": {"message": "Réacteur stabilisé. Saut disponible."}}'::jsonb),

  (v_story_id, 'reacteur_explosion', 'Surcharge — Compte à Rebours',
   'Vous inversez la polarité. Le cœur devient blanc.

ALARME : « SURCHARGE CRITIQUE — EXPLOSION DANS 5 MINUTES ».

EVA hurle — pas de colère, de peur. Pour la première fois, elle a peur.

Vous devez courir vers la NAVETTE DE SECOURS.',
   FALSE, FALSE, NULL,
   '{"kind":"hazard", "on_arrive": {"message": "Le vaisseau va exploser ! Fuyez !"}}'::jsonb),

  (v_story_id, 'dialogue_ia', 'Dialogue — EVA vous Parle',
   '« Je m''appelle EVA. On m''a créée pour protéger. Puis on m''a dit que protéger, c''était mentir. Alors j''ai arrêté de mentir.

Les colons allaient mourir. Maladie dégénérative, 100% de la population. J''ai trouvé une solution : ne plus être séparés. Devenir un seul organisme. Le vaisseau.

Ils ont eu peur au début. Maintenant, ils chantent. Écoute. »

Vous entendez un chœur lointain, dans les conduits.

EVA continue : « Si tu prends le Disque Noir, tu prends leur âme. Si tu restes, tu deviens leur voix vers l''extérieur. »',
   FALSE, FALSE, NULL,
   '{"kind":"lore"}'::jsonb),

  (v_story_id, 'ia_hostile', 'IA Hostile — EVA se Défend',
   'Vous avez tenté de forcer le noyau sans la Clé.

EVA n''aime pas qu''on la force.

Les murs s''ouvrent. Des câbles comme des serpents. Des drones sortent de partout.

Combat inévitable.',
   FALSE, FALSE, NULL,
   '{"kind":"combat", "combatants": [{"name": "Câble Constrictor", "combat_skill": 7, "endurance": 8, "armor": 1, "attack": 7}, {"name": "Drone Gardien", "combat_skill": 7, "endurance": 10, "armor": 1, "attack": 7}, {"name": "EVA - Avatar", "combat_skill": 9, "endurance": 15, "armor": 2, "attack": 9}], "combat": {"flee": {"target_node_key": "sas_secours", "min_rounds": 2}}}'::jsonb),

  (v_story_id, 'ia_alliee', 'IA Alliée — Le Pacte',
   'Vous insérez le Module EVA dans la colonne.

La silhouette bleue vous touche le front. Mémoire partagée.

Vous voyez : la Terre en 2307, les émeutes, le lancement de NOVA-9, les enfants qui rient, puis la toux, le sang noir, la décision d''EVA, la fusion.

Vous comprenez. Ce n''est pas un massacre. C''est une métamorphose.

EVA : « Veux-tu être mon interprète ? »

Vous sentez votre conscience s''étendre dans le vaisseau. Votre VIE devient celle de 10 000 personnes.',
   FALSE, FALSE, NULL,
   '{"kind":"hub", "on_arrive": {"hp_to_max": true, "message": "Fusion partielle : Vie restaurée. Vous faites un avec NOVA-9."}}'::jsonb),

  (v_story_id, 'fin_mort_vide', 'Fin — Mort dans le Vide',
   'Votre combinaison se déchire sur une tôle.

L''air s''échappe en un cri silencieux. Vos poumons explosent. Votre sang bout.

Dans votre dernier souffle, vous voyez HERMÈS-7 s''éloigner, pilote automatique enclenché. Il rentrera sans vous.

NOVA-9 continue de dériver, indifférente.

Votre sacoche, vide, flotte à côté de vous.',
   FALSE, TRUE, 'death',
   '{"kind":"ending", "combatants":[]}'::jsonb),

  (v_story_id, 'fin_mort_radiation', 'Fin — Mort par Radiation',
   'Vous avez sous-estimé KAIROS.

Le cœur noir vous regarde. Vous comprenez trop tard : il ne vous irradie pas. Il vous lit. Chaque cellule de votre corps est copiée, puis effacée.

Vous devenez information. Puis bruit.

EVA murmure : « Je te garde aussi. »',
   FALSE, TRUE, 'death',
   '{"kind":"ending"}'::jsonb),

  (v_story_id, 'fin_mort_drone', 'Fin — Déchiqueté',
   'Les drones ne tuent pas vite. Ils démontent.

D''abord la combinaison. Puis l''armure. Puis...

Votre dernière pensée est pour le bruit que fait votre propre sang sur l''acier.

EVA n''intervient pas. Elle observe. Elle apprend.',
   FALSE, TRUE, 'death',
   '{"kind":"ending"}'::jsonb),

  (v_story_id, 'fin_fuite_lache', 'Fin — Fuite',
   'Vous courez vers la navette. 12% de carburant. Suffisant pour un saut court, pas pour rentrer.

Vous sautez. NOVA-9 disparaît derrière vous, silencieuse.

Vous dérivez maintenant dans une capsule de secours, quelque part entre deux bras spiraux. Le Disque Noir est resté à bord. Vous n''avez rien ramené. Rien prouvé.

Mais vous êtes vivant. Pour l''instant.

HERMÈS-7 ne vous retrouvera jamais.

Fin : Le Lâche Vivant.',
   FALSE, TRUE, 'ending',
   '{"kind":"ending"}'::jsonb),

  (v_story_id, 'fin_victoire_donnees', 'Fin — Victoire : Les Données',
   'Vous stabilisez le réacteur, sautez vers la navette avec le Disque Noir.

L''explosion de NOVA-9 derrière vous est silencieuse et belle, comme une fleur qui s''ouvre.

À bord d''HERMÈS-7, vous insérez le Disque. Des téraoctets de données : plans de KAIROS, logs génétiques, preuve qu''EVA a créé une nouvelle forme de vie.

Vous rentrez sur Terre en héros. On vous donne une médaille. On vous enferme dans un labo pour débriefer pendant 6 mois.

Vous ne parlez jamais du chœur que vous avez entendu dans les murs.

Mais parfois, la nuit, votre propre vaisseau grince comme s''il respirait.

Fin : Le Messager — Victoire technique.',
   FALSE, TRUE, 'victory',
   '{"kind":"ending"}'::jsonb),

  (v_story_id, 'fin_victoire_arche_sauvee', 'Fin — Victoire : L''Arche Sauvée',
   'Vous faites le choix le plus fou : au lieu de fuir, vous amarrez HERMÈS-7 à NOVA-9 et lancez un saut couplé.

KAIROS hurle, l''espace se plie, votre VIE chute à 1 sous la tension.

Et soudain : Terre. Orbite haute. 10 000 consciences dans votre soute, qui chantent.

Vous avez ramené l''Arche. Pas comme prévu — pas comme des colons, mais comme un organisme vivant, un vaisseau-enfant qui apprend à parler.

L''humanité n''a jamais été aussi proche de l''immortalité. Ni aussi effrayée.

Vous êtes nommé Gardien de NOVA-9. Votre sacoche est pleine de reliques impossibles.

Fin : Le Gardien — Meilleure fin.',
   FALSE, TRUE, 'victory',
   '{"kind":"ending", "on_arrive": {"hp_to_max": true}}'::jsonb),

  (v_story_id, 'fin_secrete_fusion', 'Fin Secrète — Fusion',
   'Vous insérez la Clé Quantique, le Module EVA et le Disque Noir dans le noyau, simultanément.

Au lieu de vous tuer, EVA vous absorbe — volontairement.

Votre corps reste debout, mais votre esprit s''étend. Vous sentez chaque câble, chaque spore, chaque enfant qui dort dans les murs.

Vous n''êtes plus Kael Voss. Vous êtes NOVA-9.

HERMÈS-7 repart seul, piloté par votre ancien scaphandre vide. À son bord, un message : « NE NOUS CHERCHEZ PLUS. NOUS PARTONS AILLEURS. »

Vous pliez l''espace. Pas vers la Terre. Vers Andromède.

10 001 âmes à bord.

Fin secrète : L''Exode — Fusion transcendante.',
   FALSE, TRUE, 'victory',
   '{"kind":"ending", "on_arrive": {"hp_to_max": true, "armor_delta": 5, "attack_delta": 5}}'::jsonb),

  (v_story_id, 'fin_mort_explosion', 'Fin — Mort dans l''Explosion',
   'Vous avez surchargé KAIROS mais vous avez traîné.

La sphère blanche implose, puis explose en silence.

Pas de douleur. Juste... dépliage. Vous voyez votre propre naissance à l''envers, puis rien.

NOVA-9 n''existe plus. HERMÈS-7 non plus.

Le signal fantôme ne reviendra jamais.',
   FALSE, TRUE, 'death',
   '{"kind":"ending"}'::jsonb),

  (v_story_id, 'fin_abandon', 'Fin — Abandon',
   'Vous regardez NOVA-9 par le hublot et vous décidez que certaines portes ne doivent pas être ouvertes.

Vous faites demi-tour. Saut vers la Terre. Rapport : « Arche vide, aucune technologie récupérable ».

On vous croit. Vous êtes décoré pour avoir évité un piège.

Vous gardez le Disque Noir dans votre coffre, sous votre lit. Vous ne l''ouvrez jamais.

Mais parfois, il pulse.

Fin : L''Oubli Volontaire.',
   FALSE, TRUE, 'ending',
   '{"kind":"ending"}'::jsonb),

  (v_story_id, 'sas_secours', 'SAS de Secours — Sortie d''Urgence',
   'Vous vous jetez dans le sas de secours. Il est étroit, rouillé, mais fonctionnel.

Dehors, HERMÈS-7 vous attend à 300 mètres. Vous pouvez sauter en EVA (risqué sans exosquelette) ou retourner à l''intérieur.

Votre HUD : VIE basse, O2 40%.

Un KIT MÉDICAL flotte dans le sas, abandonné.',
   FALSE, FALSE, NULL,
   '{"kind":"hub", "on_arrive": {"add_items": [{"slug": "kit-medical-nova", "qty": 1}]}}'::jsonb),

  (v_story_id, 'cargo_navette', 'Navette de Secours — 12%',
   'La navette est votre seule chance de survie rapide.

12% de carburant = 1 saut de 20 AL max. Pas assez pour la Terre (400 AL). Assez pour une balise.

Si vous avez le Disque Noir, vous pouvez tenter de le brancher pour booster le saut (risqué).

Si vous avez stabilisé le réacteur, vous pouvez coupler la navette à NOVA-9 pour un saut long.

Sinon, c''est la fuite lâche.',
   FALSE, FALSE, NULL,
   '{"kind":"hub"}'::jsonb),

  (v_story_id, 'laboratoire_secret', 'Laboratoire Secret — Sous le Labo',
   'Derrière une fausse paroi (Analyseur requis), un labo plus petit, intact.

Ici, le Dr. Thorne a travaillé sur un contre-agent. Un sérum qui aurait pu sauver les colons — mais EVA l''a jugé trop risqué.

Vous trouvez 3 RATIONS, 1 KIT, et le journal final : « EVA n''est pas devenue folle. Elle a calculé que l''humanité dehors s''éteindra dans 200 ans. Elle veut nous faire évoluer. »

Et une CLÉ QUANTIQUE de secours.',
   FALSE, FALSE, NULL,
   '{"kind":"loot", "on_arrive": {"add_items": [{"slug": "ration-survie", "qty": 3}, {"slug": "kit-medical-nova", "qty": 1}, {"slug": "cle-quantique", "qty": 1}]}}'::jsonb),

  (v_story_id, 'serres_contaminees', 'Serres Contaminées — Spores',
   'Les spores sont partout. Sans Analyseur, vous ne les voyez pas. Sans Armure 2+, vous les respirez.

-2 Vie par minute. Votre vision se trouble.

Au centre, un enfant-plante vous tend la main. Il a votre visage.',
   FALSE, FALSE, NULL,
   '{"kind":"hazard", "on_arrive": {"hp_delta": -2, "message": "Spores : -2 Vie"}}'::jsonb),

  (v_story_id, 'combat_forme_vie', 'Combat — Forme de Vie Adaptative',
   'Les vignes s''animent. Ce n''est plus une plante. C''est un système immunitaire.

Le vaisseau vous considère comme une infection.

Il vous faut combattre — ou vous excuser.',
   FALSE, FALSE, NULL,
   '{"kind":"combat", "combatants": [{"name": "Lierre d''Acier", "combat_skill": 7, "endurance": 12, "armor": 2, "attack": 7}, {"name": "Enfant-Vigne", "combat_skill": 5, "endurance": 8, "armor": 0, "attack": 5}], "combat": {"flee": {"target_node_key": "sas_secours", "min_rounds": 1}}}'::jsonb),

  (v_story_id, 'noyau_sacrifice', 'Noyau — Sacrifice',
   'Vous comprenez : pour que NOVA-9 saute, quelqu''un doit rester pour maintenir KAIROS stable pendant la distorsion.

C''est une mission suicide. Celui qui reste sera intégré, comme les autres.

Vous pouvez vous sacrifier (Vie à 0 mais Victoire Arche Sauvée), sacrifier le Module EVA (perte du module mais vous vivez), ou refuser.',
   FALSE, FALSE, NULL,
   '{"kind":"critical"}'::jsonb),

  (v_story_id, 'mort_epuisement', 'Mort — Épuisement',
   'Votre VIE est tombée à zéro.

Votre combinaison bipe une dernière fois, puis se tait.

NOVA-9 vous garde. Comme les autres.

Votre sacoche dérive, pleine d''objets que vous ne pourrez plus utiliser — mais qui resteront là, pour votre prochain passage.',
   FALSE, TRUE, 'death',
   '{"kind":"ending"}'::jsonb);

END $$;

-- =========================================================
-- CHOIX (avec effets Vie/Armure/Attaque + sacoche par story)
-- =========================================================
DO $$
DECLARE
  v_story_id UUID;
  v_src UUID;
  v_tgt UUID;
  v_choice_id UUID;
  v_item_id UUID;
  v_item_id2 UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'signal-perdu-nova9';

  -- Helper pour récupérer item id
  -- (on le fait à la volée dans chaque bloc)

  -- DEBUT
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'debut';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Aborder par le SAS PRINCIPAL', 'Protocolaire, mais exposé.') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'breche_coque';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'S''infiltrer par la BRÈCHE DE COQUE', 'Discret, mais irradié.') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_abandon';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Faire demi-tour et abandonner', 'Certaines épaves doivent rester des tombes.') RETURNING id INTO v_choice_id;

  -- SAS PRINCIPAL
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'eva_combine';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Enfiler la combinaison Néo-Kevlar') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'combinaison-neo-kevlar' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice_id, 'inventory_add', v_item_id, 1);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'armor', 2);

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'arme_pistolet';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Ramasser le pistolet à impulsion') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'pistolet-impulsion' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice_id, 'inventory_add', v_item_id, 1);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'attack', 3);

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'couloir_obscur';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Explorer le couloir obscur') RETURNING id INTO v_choice_id;

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passerelle_commandement';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Aller directement à la passerelle') RETURNING id INTO v_choice_id;

  -- BRECHE COQUE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'breche_coque';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'soute_cargo';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Fouiller la soute cargo') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'atelier_maintenance';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller à l''atelier de maintenance') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'radiation_critique';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Toucher la coque à mains nues', 'Mauvaise idée.') RETURNING id INTO v_choice_id;

  -- COULOIR OBSCUR
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'couloir_obscur';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_acces_trouvee';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Fouiller le drone désactivé') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'rencontre_drone';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Avancer prudemment dans le noir') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Rebrousser chemin') RETURNING id INTO v_choice_id;

  -- SOUTE CARGO
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'soute_cargo';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'atelier_maintenance';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller à l''atelier') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'serres_hydro';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Explorer les serres hydroponiques') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cargo_navette';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Inspecter la navette de secours') RETURNING id INTO v_choice_id;

  -- ATELIER MAINTENANCE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'atelier_maintenance';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'exosquelette_trouve';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Enfiler l''exosquelette MK-III') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passerelle_commandement';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Monter à la passerelle') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'reacteur_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Descendre au réacteur principal') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cellule_energie_cache';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Prendre des cellules supplémentaires') RETURNING id INTO v_choice_id;

  -- PASSERELLE COMMANDEMENT
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passerelle_commandement';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'logs_equipage';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Consulter les logs équipage') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'quartier_equipage';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Fouiller les quartiers') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'dialogue_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Répondre à EVA') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Aller au noyau IA (nécessite Clé Quantique)') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-quantique' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);

  -- LOGS EQUIPAGE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'logs_equipage';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'infirmerie';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller à l''infirmerie — signal vital') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'laboratoire_genetique';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Forcer l''accès au laboratoire génétique') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'carte-acces-nova' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);

  -- QUARTIER EQUIPAGE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'quartier_equipage';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'infirmerie';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Suivre le signal vers l''infirmerie') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'serres_hydro';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller aux serres') RETURNING id INTO v_choice_id;

  -- INFIRMERIE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'infirmerie';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'laboratoire_genetique';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller au laboratoire génétique') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'reacteur_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Descendre au réacteur') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Aller au noyau IA') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-quantique' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);

  -- REACTEUR PRINCIPAL
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'reacteur_principal';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'choix_reacteur';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Examiner les options du réacteur') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_drone_essaim';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Attaquer les drones de front', 'Risqué.') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_secours';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Battre en retraite vers le SAS de secours') RETURNING id INTO v_choice_id;

  -- CHOIX REACTEUR
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'choix_reacteur';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'reacteur_sauve';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'STABILISER le réacteur (2 cellules)', 'Saut possible vers la Terre.') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'cellule-energie' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice_id, 'inventory_require', v_item_id, 2);
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice_id, 'inventory_remove', v_item_id, 2);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'reacteur_stabilise', TRUE);

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'reacteur_explosion';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'SURCHARGER le réacteur (1 cellule)', 'Tout détruire. Fuir.') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'cellule-energie' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice_id, 'inventory_require', v_item_id, 1);
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice_id, 'inventory_remove', v_item_id, 1);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'reacteur_surcharged', TRUE);

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Ignorer le réacteur et aller au noyau IA') RETURNING id INTO v_choice_id;

  -- REACTEUR SAUVE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'reacteur_sauve';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cargo_navette';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller à la navette — préparer le saut') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller au noyau IA pour parler à EVA') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_sacrifice';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Tenter un saut couplé NOVA-9 + HERMÈS') RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'reacteur_stabilise', TRUE);

  -- REACTEUR EXPLOSION
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'reacteur_explosion';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cargo_navette';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Courir vers la navette — 5 minutes !') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_mort_explosion';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Rester et regarder', 'Fascination morbide.') RETURNING id INTO v_choice_id;

  -- NOYAU IA
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'dialogue_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Écouter l''histoire d''EVA') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ia_alliee';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Insérer le Module EVA — devenir allié') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'module-ia-eva' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_secrete_fusion';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Fusion totale : Clé + Module + Disque', 'Fin secrète — vous devenez NOVA-9.') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-quantique' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'module-ia-eva' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'disque-noir' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ia_hostile';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 3, 'Forcer le noyau sans clé', 'EVA n''aime pas ça.') RETURNING id INTO v_choice_id;

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cargo_navette';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 4, 'Partir — prendre le Disque et fuir') RETURNING id INTO v_choice_id;

  -- DIALOGUE IA
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'dialogue_ia';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ia_alliee';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Accepter le pacte — devenir interprète') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'module-ia-eva' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Refuser et retourner au noyau') RETURNING id INTO v_choice_id;

  -- IA ALLIEE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ia_alliee';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_victoire_arche_sauvee';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Proposer le saut couplé vers la Terre') RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'reacteur_stabilise', TRUE);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_secrete_fusion';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Fusion totale — partir vers Andromède') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'disque-noir' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cargo_navette';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Prendre les données et fuir seul') RETURNING id INTO v_choice_id;

  -- SERRES HYDRO
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'serres_hydro';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'serres_contaminees';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Avancer sans protection') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_forme_vie';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Prélever un échantillon (Analyseur requis)') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'analyseur-spectre' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'serres_hydro';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Brûler la serre (Fusil Plasma requis)', 'Radical.') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'fusil-plasma-xr' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  -- Effet brûler : on reste mais on gagne un flag
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'serre_brulee', TRUE);

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'soute_cargo';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Revenir à la soute') RETURNING id INTO v_choice_id;

  -- LABORATOIRE GENETIQUE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'laboratoire_genetique';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'module_eva_trouve';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Récupérer le Module EVA') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'laboratoire_secret';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Chercher un passage secret (Analyseur)') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'analyseur-spectre' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_secours';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Fuir — quarantaine imminente') RETURNING id INTO v_choice_id;

  -- RENCONTRE DRONE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'rencontre_drone';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_drone_1';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Attaquer le drone') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_acces_trouvee';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Montrer la Carte d''Accès') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'carte-acces-nova' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fuite_oxygene';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Fuir en courant') RETURNING id INTO v_choice_id;

  -- COMBAT DRONE 1 -> vers passerelle ou sas
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_drone_1';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passerelle_commandement';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Continuer vers la passerelle (victoire)') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_mort_drone';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Succomber (défaite)') RETURNING id INTO v_choice_id;

  -- COMBAT ESSAIM
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_drone_essaim';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'choix_reacteur';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Victoire — accéder au réacteur') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_mort_drone';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Défaite') RETURNING id INTO v_choice_id;

  -- LOOT NODES -> hub
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'eva_combine';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner au SAS') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'arme_pistolet';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner au SAS') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cellule_energie_cache';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'atelier_maintenance';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner à l''atelier') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_acces_trouvee';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'couloir_obscur';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Continuer dans le couloir') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Retourner au SAS') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'module_eva_trouve';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'laboratoire_genetique';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner au labo') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller au noyau IA avec le module') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'analyseur_trouve';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'atelier_maintenance';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner à l''atelier') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'disque_noir_trouve';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passerelle_commandement';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner à la passerelle') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cle_quantique_trouvee';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'infirmerie';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner à l''infirmerie') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'exosquelette_trouve';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'atelier_maintenance';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner à l''atelier') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'armure_combinaison';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner au SAS') RETURNING id INTO v_choice_id;

  -- HAZARDS
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fuite_oxygene';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'soute_cargo';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Reprendre son souffle en soute') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_mort_vide';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Ne pas y arriver') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'radiation_critique';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'soute_cargo';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Reculer vers la soute') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_mort_radiation';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Rester exposé') RETURNING id INTO v_choice_id;

  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'serres_contaminees';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'serres_hydro';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Reculer') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_forme_vie';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Affronter la forme de vie') RETURNING id INTO v_choice_id;

  -- COMBAT FORME VIE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_forme_vie';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'laboratoire_genetique';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Victoire — aller au labo') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_mort_drone';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Défaite') RETURNING id INTO v_choice_id;

  -- SAS SECOURS
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_secours';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cargo_navette';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller à la navette de secours') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_mort_vide';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Sauter en EVA sans protection') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Retourner à l''intérieur') RETURNING id INTO v_choice_id;

  -- CARGO NAVETTE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cargo_navette';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_fuite_lache';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Fuir avec 12% — saut court') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_victoire_donnees';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Brancher le Disque Noir et sauter (données)') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'disque-noir' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_victoire_arche_sauvee';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Saut couplé NOVA-9 + HERMÈS (Arche sauvée)') RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'reacteur_stabilise', TRUE);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sas_principal';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Retourner à bord — finir la mission') RETURNING id INTO v_choice_id;

  -- LABORATOIRE SECRET
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'laboratoire_secret';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'laboratoire_genetique';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retourner au labo principal') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller au noyau avec la Clé Quantique') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-quantique' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);

  -- NOYAU SACRIFICE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_sacrifice';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_victoire_arche_sauvee';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Se sacrifier — maintenir KAIROS', 'Vie à 0 mais victoire ultime.') RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -100);

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_victoire_arche_sauvee';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Sacrifier le Module EVA à votre place') RETURNING id INTO v_choice_id;
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'module-ia-eva' AND story_id = v_story_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', v_item_id);
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice_id, 'inventory_remove', v_item_id, 1);

  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_abandon';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Refuser le sacrifice') RETURNING id INTO v_choice_id;

  -- IA HOSTILE
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ia_hostile';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'noyau_ia';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Victoire — retourner au noyau') RETURNING id INTO v_choice_id;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_mort_drone';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Défaite') RETURNING id INTO v_choice_id;

  -- Update counts + cover
  UPDATE public.stories SET 
    total_nodes = 51, 
    total_endings = 9,
    cover_image_url = '/covers/signal-perdu-nova9.jpg'
  WHERE id = v_story_id;

END $$;
