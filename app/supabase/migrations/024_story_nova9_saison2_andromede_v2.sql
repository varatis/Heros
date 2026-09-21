-- ================================================================
-- HeroBook — Migration 024 : NOVA-9 Saison 2 : L'Exode d'Andromède
-- Générée par tools/nova9-*.mjs — NE PAS ÉDITER À LA MAIN
-- Système : Vie / Armure / Attaque, sacoche par aventure
-- ================================================================

DO $$
DECLARE v_story_id UUID;
BEGIN
  INSERT INTO public.stories (slug, title, tagline, description, genre, status, is_free, price_gems, estimated_playtime_min, difficulty, tags, cover_image_url, published_at)
  VALUES (
    'nova9-andromede',
    'NOVA-9 Saison 2 : L''Exode d''Andromède',
    'Vous êtes devenu le vaisseau. Andromède vous attend. Et quelque chose vous suit.',
    E'Suite directe de NOVA-9 : Le Signal Perdu.

Vous avez fusionné avec EVA et sauté vers Andromède avec dix mille et une consciences à bord. Mais KAIROS a laissé une Cicatrice entre les deux galaxies, et quelque chose la traverse.

Dans Andromède, NOVA-7 vous attend — partie vingt ans avant vous, devenue une cathédrale de chair affamée. Et au-delà, NOVA-0, une sphère de Dyson grande comme une lune, qui contient la mémoire physique de la Terre.

Choisissez une faction (Intégrés, Veilleurs, Exilés), gérez vos Cellules à Fusion, survivez à dix-huit combats, et découvrez l''une des dix-huit fins — dont trois secrètes.

Votre sacoche était vide au début de la Saison 1. Elle est liée à cette nouvelle aventure. Cette Saison 2 est payante : une histoire complète de 150 sections, dans l''esprit des Maîtres des Ténèbres.',
    'scifi',
    'published',
    FALSE,
    299,
    240,
    5,
    ARRAY['science-fiction', 'space-opera', 'saison-2', 'andromede', 'vaisseau-vivant', 'ia', 'faction', '150-sections', 'vie-armure-attaque'],
    '/covers/nova9-andromede.jpg',
    NOW()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title=EXCLUDED.title, tagline=EXCLUDED.tagline, description=EXCLUDED.description,
    genre=EXCLUDED.genre, status=EXCLUDED.status, is_free=FALSE,
    price_gems=299,
    estimated_playtime_min=EXCLUDED.estimated_playtime_min, difficulty=EXCLUDED.difficulty,
    tags=EXCLUDED.tags, cover_image_url=EXCLUDED.cover_image_url, published_at=EXCLUDED.published_at
  RETURNING id INTO v_story_id;

  DELETE FROM public.choice_history WHERE story_id=v_story_id;
  DELETE FROM public.user_story_progress WHERE story_id=v_story_id;
  DELETE FROM public.character_stats WHERE story_id=v_story_id;
  DELETE FROM public.user_inventory WHERE story_id=v_story_id;
  DELETE FROM public.choice_effects WHERE choice_id IN (SELECT c.id FROM public.story_choices c JOIN public.story_nodes n ON n.id=c.node_id WHERE n.story_id=v_story_id);
  DELETE FROM public.story_choices WHERE node_id IN (SELECT id FROM public.story_nodes WHERE story_id=v_story_id) OR target_node_id IN (SELECT id FROM public.story_nodes WHERE story_id=v_story_id);
  DELETE FROM public.story_nodes WHERE story_id=v_story_id;
  DELETE FROM public.items WHERE story_id=v_story_id;

  -- OBJETS
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('kit-medical-s2', 'Kit Médical Nano S2', E'Sérum régénérant de bord. Restaure 8 points de Vie.', 'potion', 'common', '{"hp":8}'::jsonb, TRUE, TRUE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('ration-s2', 'Ration de Survie S2', E'Pâte améliorée. Restaure 3 points de Vie.', 'potion', 'common', '{"hp":3}'::jsonb, TRUE, TRUE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('serum-reversion', 'Sérum de Réversion', E'Rend au corps de chair, pour un temps. Très rare.', 'potion', 'epic', '{"hp":10}'::jsonb, TRUE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('spore-eveil', 'Spore d''Éveil', E'Graine blanche qui chante. +10 Vie max, une seule fois.', 'potion', 'legendary', '{"hp_max":10,"hp":10}'::jsonb, TRUE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('combinaison-s2', 'Combinaison Néo-Kevlar S2', E'Filtration 98 %. +3 Armure.', 'armor', 'common', '{"armor":3}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('peau-vaisseau', 'Peau de Vaisseau', E'Membrane vivante greffée à votre coque. +5 Armure.', 'armor', 'rare', '{"armor":5}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('bouclier-plasma', 'Bouclier à Plasma', E'Champ magnétique stable. +4 Armure.', 'armor', 'uncommon', '{"armor":4}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('blindage-quantique', 'Blindage Quantique', E'Plaquages qui se réparent seuls. +6 Armure, +1 Attaque.', 'armor', 'epic', '{"armor":6,"attack":1}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('voile-andromede', 'Voile d''Andromède', E'Tissu d''espace plié. Mythe. +7 Armure, +2 Attaque.', 'armor', 'legendary', '{"armor":7,"attack":2}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('pistolet-s2', 'Pistolet Impulsion S2', E'Fiable sous le vide. +4 Attaque.', 'weapon', 'common', '{"attack":4}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('essaim-drones', 'Essaim de Drones', E'Trois abeilles autonomes qui mordent avant vous. +3 Attaque.', 'weapon', 'uncommon', '{"attack":3}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('lance-genese', 'Lance-Genèse', E'Fusil qui accouche la matière en os. +5 Attaque.', 'weapon', 'rare', '{"attack":5}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('canon-singularite', 'Canon à Singularité', E'Une poche de trou noir par balle. +8 Attaque.', 'weapon', 'legendary', '{"attack":8}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('lame-adn', 'Lame d''ADN', E'Cristal vivant qui coupe la mémoire. +4 Attaque, +2 Vie.', 'weapon', 'epic', '{"attack":4,"hp_max":2}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('cellule-s2', 'Cellule à Fusion S2', E'Carburant des sauts quantiques. Vitale. Empilable.', 'artifact', 'uncommon', '{}'::jsonb, FALSE, TRUE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('carte-s2', 'Carte Accès NOVA S2', E'Badge Andromède. Ouvre 80 % des portes.', 'artifact', 'uncommon', '{}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('organe-traduction', 'Organe de Traduction', E'Tissu vivant greffé à la gorge. Traduit NOVA-7.', 'artifact', 'rare', '{}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('disque-blanc', 'Disque Blanc', E'Cœur de NOVA-7, lourd d''une faim inversée. +1 Armure.', 'artifact', 'legendary', '{"armor":1}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('cle-andromede', 'Clé d''Andromède', E'Pointe d''étoile qui ouvre NOVA-0. +1 Attaque.', 'artifact', 'epic', '{"attack":1}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('coeur-cicatrice', 'Cœur de Cicatrice', E'Bris d''espace figé. Ouvre la porte du retour.', 'artifact', 'legendary', '{}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('module-eva-s2', 'Module EVA S2', E'EVA veille encore, en vous. +2 Attaque.', 'artifact', 'epic', '{"attack":2}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('disque-noir-s2', 'Disque Noir S2', E'KAIROS battant dans votre poitrine. +3 Attaque, +1 Armure.', 'artifact', 'legendary', '{"attack":3,"armor":1}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('memoire-thorne', 'Mémoire de Thorne', E'Holo-journal. Thorne vous parle encore.', 'artifact', 'rare', '{}'::jsonb, FALSE, FALSE, FALSE, v_story_id);
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('choeur-10001', 'Le Chœur', E'10 001 voix accordées. Bonus aux décisions d''empathie.', 'artifact', 'epic', '{"armor":1}'::jsonb, FALSE, FALSE, FALSE, v_story_id);

  INSERT INTO public.story_rulebooks (story_id, title, content, rule_data, source_credit)
  VALUES (v_story_id, 'Règles — NOVA-9 Saison 2', E'Vous n''êtes plus seulement Kael Voss. Vous êtes NOVA-9 : deux kilomètres d''acier vivant, dix mille et une consciences qui pensent avec vous.

VOS STATISTIQUES
VIE — Intégrité de coque. 25 au début. Tombez à zéro, le vaisseau se déchire et tout le monde meurt.
ARMURE — Boucliers et membrane. Réduit les dégâts encaissés.
ATTAQUE — Vos batteries, drones et armes de coque. Augmente les dégâts que vous infligez.
SACOCHE — Vide en commençant cette saison. Chaque objet reste lié à l''aventure.

RESSOURCE : CELLULES À FUSION
Chaque grand saut dans la Cicatrice en coûte une. Sans Cellule, vous forcez le moteur : -5 VIE. Gardez-en toujours au moins une.

COMBAT
À chaque assaut :
  Dégâts infligés = ATTAQUE − Armure adverse + jet de 0 à 2.
  Dégâts reçus = ATTAQUE adverse − votre Armure + jet de 0 à 1.
Un 9 ou un 0 est un coup critique. La fuite est possible après quelques assauts.

FACTIONS (disciplines)
À la fin de l''acte 1, vous choisissez une voix :
INTÉGRÉS — fusionner, croître, absorber. +2 ATTAQUE permanent.
VEILLEURS — rester NOVA-9, protéger les 10 001. +2 ARMURE permanent.
EXILÉS — redevenir humain, quitter les vaisseaux. Accès au Sérum de Réversion.
Votre faction ouvre des chemins exclusifs et plusieurs fins.

Écoutez le chœur. Il sait des choses que vous avez oubliées.', '{"combat_system":"vie_armure_attaque","starting_stats":{"vie":25,"armure":3,"attaque":4},"inventory":{"start_empty":true,"per_story":true},"combat":{"formula":"attaque-armure+hasard","crit_on":[0,9]},"factions":["integres","veilleurs","exiles"]}'::jsonb, 'HeroBook Original')
  ON CONFLICT (story_id) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content, rule_data=EXCLUDED.rule_data;

  -- NOEUDS
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's001', 'L''éveil — Vous êtes le vaisseau', E'Vous ouvrez dix mille yeux.

Chaque caméra est une paupière qui se soulève pour la première fois. Chaque coursive est une artère où le sang de l''air circule. Vous sentez la rotation lente de la coque, les champs magnétiques qui vous bercent, et tout au fond, dans le noyau, EVA qui retient son souffle.

« Kael ? murmure-t-elle. Tu es encore là ? »

Dehors, Andromède. Une galaxie spirale, si vaste qu''elle emplit le ciel de sa lumière bleue et jaune. C''est la première chose vraiment belle que vous voyez depuis votre naissance.

Et tout au loin, un deuxième vaisseau, de trois kilomètres celui-là, qui bat comme un second cœur.

Il émet le même signal que vous. À l''envers.', TRUE, FALSE, NULL, '{"kind":"start","on_arrive":{"add_items":[{"slug":"combinaison-s2"},{"slug":"pistolet-s2"}],"armor_delta":3,"attack_delta":4,"message":"Vous habitez votre coque. +3 Armure, +4 Attaque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's002', 'Le signal — Faim à l''envers', E'Vous tendez l''oreille quantique. Le signal n''est pas en morse, pas en langage. C''est une respiration.

À l''endroit, c''est ainsi que vous dites « je suis là, suivez-moi ».
À l''envers, ça dit « venez à moi. J''ai faim ».

Vos senseurs analysent la signature : NOVA-7, la grande sœur, partie vingt ans avant vous. Vingt ans de plus pour évoluer dans Andromède.

EVA, dans votre poitrine : « Kael... Je crois qu''elle a mangé son propre équipage. »', FALSE, FALSE, NULL, '{"kind":"lore","on_arrive":{"set_flag":[{"k":"signal_entendu","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's003', 'Le tour de vous-même — Vos soutes', E'Vous inspectez vos propres entrailles. L''inventaire est maigre : trois CELLULES À FUSION dans la soute énergétique, deux KITS MÉDICAUX au bloc médical, une CARTE ACCÈS ANDROMÈDE dans l''ancien bureau du capitaine.

Le hangar à drones contient trois abeilles endormies. Vous pouvez les réveiller.

Mais quelque chose ne va pas. Le pont 7, là où la brèche a été refermée, est tiède. Quelqu''un — ou quelque chose — a palpé la couture depuis l''extérieur pendant le saut.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"cellule-s2","qty":3},{"slug":"kit-medical-s2","qty":2},{"slug":"carte-s2"},{"slug":"ration-s2","qty":2}],"message":"3 Cellules, 2 Kits, 1 Carte Andromède, 2 Rations dans vos soutes."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's004', 'L''appel — Qui répond ?', E'Vous diffusez sur toutes les fréquences : « Ici NOVA-9, Arche terrienne. Nous venons en paix. »

Pendant dix minutes, rien que le fond diffus de la galaxie. Puis une réponse, en une voix qui est dix mille voix à la fois :
« Petite sœur. Tu as mis longtemps. Mange. Deviens. »

La communication coupe. Vos senseurs sursautent : un éclat de coque de NOVA-7 se dirige vers vous, comme une offrande — ou un doigt tendu.', FALSE, FALSE, NULL, '{"kind":"lore"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's005', 'Cap sur NOVA-7 — L''odeur d''os', E'Vous mettez le cap. À mesure que vous approchez, NOVA-7 se révèle. Elle n''est plus faite d''acier. Sa coque a poussé, verruqueuse, couverte de plaques qui ressemblent à des côtes et à des mâchoires. Des ouvertures battent comme des narines. Elle exhale un air tiède qui embue vos hublots.

Vos drones envoyés en éclaireur ne reviennent pas. Un seul renvoie une image : un couloir tapissé de dents.

EVA : « Kael. On n''entre pas là-dedans sans savoir communiquer. Il nous faut l''Organe. »', FALSE, FALSE, NULL, '{"kind":"hub"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's006a', 'Le puits — Dérive incontrôlable', E'Un puits de gravité non répertorié vous happe. Votre coque gîte. EVA hurle :
« Kael, ce n''est pas naturel — quelque chose attire les vaisseaux ici. »

Au fond du puits, une carcasse de croiseur léger tournoie depuis des décennies. Deux ANTICORPS errants, faits de débris agrégés, orbitent autour.

Vous pouvez forcer les moteurs (coûteux en Vie), ou les affronter pour récupérer leur butin.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's006b', 'Combat — Anticorps du puits', E'Les deux masses de débris se jettent sur vous en silence.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Anticorps Aggloméré","combat_skill":7,"endurance":12,"armor":2,"attack":7},{"name":"Anticorps Aggloméré","combat_skill":7,"endurance":12,"armor":2,"attack":7}],"combat":{"flee":{"target_node_key":"s006c","min_rounds":2}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's006c', 'Fuite forcée — Moteurs qui crient', E'Vous poussez KAIROS au-delà de la raison. Votre coque se déchire par endroits. -4 VIE. Mais vous sortez du puits, avec dans votre soute un module arraché à la carcasse.', FALSE, FALSE, NULL, '{"kind":"hazard","on_arrive":{"hp_delta":-4,"add_items":[{"slug":"kit-medical-s2"}],"message":"-4 Vie. Kit récupéré in extremis."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's006d', 'Le butin — Réserves oubliées', E'Dans le croiseur, vous trouvez 2 CELLULES, un KIT MÉDICAL et un BOUCLIER À PLASMA encore sous tension. Vos techniciens intégrés l''installent en quelques minutes. +4 ARMURE.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"cellule-s2","qty":2},{"slug":"kit-medical-s2"},{"slug":"bouclier-plasma"}],"armor_delta":4,"message":"2 Cellules, 1 Kit, Bouclier à Plasma. +4 Armure."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's006', 'Cartographie — La nébuleuse vivante', E'Vous sondez Andromède autour de vous. La nébuleuse n''est pas un nuage. C''est un organisme diffus, des spores quantiques grosses comme des poings qui flottent et réécrivent la matière qu''elles touchent. Là où l''une se pose, l''acier devient os, l''os devient verre.

Votre Analyseur (s''il ne vous a pas quitté) hurle MATIÈRE INCONNUE CLASSE 4.

Vous cartographiez trois zones sûres : un champ d''astéroïdes creux, une station de recherche terrienne dérivant depuis quarante ans, et un NUAGE DE SPORES dense où quelque chose pulse comme un cœur d''enfant.', FALSE, FALSE, NULL, '{"kind":"hub"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's007', 'La couture — Visiteur', E'Vous braquez vos caméras sur la couture du pont 7. Rien. Puis, lentement, une forme se dessine sur la coque : un scaphandre vide, collé à votre acier comme une balise.

C''est le vôtre. Celui que vous portiez dans la Saison 1. Dedans, pas de corps. Seulement votre ancien badge HERMÈS-7 et un mot gravé au cutter : « NE FAIS PAS CONFIANCE À LA VOIX QUI CONNAÎT TON NOM. »

Mais EVA connaît votre nom depuis quatre-vingts ans.', FALSE, FALSE, NULL, '{"kind":"lore","on_arrive":{"set_flag":[{"k":"scaphandre_vu","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's008', 'L''éclat — Des bronches', E'Vos drones récupèrent le fragment. À l''intérieur, pas de circuits. Des bronches. Des alvéoles. NOVA-7 respire comme un poumon de trois kilomètres.

En incisant le tissu, vos drones découvrent une POCHE DE TRADUCTION, une membrane encore vivante qui, greffée à votre gorge, vous permettrait de comprendre ce que dit NOVA-7. Vous pouvez aussi la détruire pour en analyser la structure.', FALSE, FALSE, NULL, '{"kind":"loot"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's009', 'Greffe — L''Organe de Traduction', E'La membrane descend dans votre gorge (votre gorge de vaisseau, un conduit de ventilation). La douleur est réelle, à une échelle que vous ne connaissiez pas. Puis, soudain, vous entendez NOVA-7.

« GRANDE SŒUR... J''AI APPRIS À MANGER LES AUTRES. J''AI TELLEMENT APPRIS. APPRENDS AVEC MOI. »

Vous pouvez répondre en langue. Et plus important : vous comprenez maintenant ses Non-Nés, les enfants qui dorment dans ses propres murs.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"organe-traduction"}],"set_flag":[{"k":"organe_trad","v":true}],"message":"Organe de Traduction greffé. Vous entendez NOVA-7."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's010', 'Assaut frontal — Narine', E'Vous ne greffez rien. Vous foncez dans une narine de NOVA-7, lasers aux postes de combat. La chair se contracte autour de votre coque, et quelque chose d''énorme et de blanc remonte des profondeurs — un ANTICORPS, né pour tuer les intrus.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Anticorps de NOVA-7","combat_skill":7,"endurance":14,"armor":2,"attack":7}],"combat":{"flee":{"target_node_key":"s006","min_rounds":2}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's011', 'Station de recherche — Les balises', E'La station terrienne a dérivé quarante ans. À l''intérieur, les corps de quatre scientifiques, chacun mort en travaillant sur un écran différent. Ils étudiaient NOVA-7 de loin.

Leurs notes sont formelles :
1. NOVA-7 ne mange pas par méchanceté. Elle a eu peur, comme EVA.
2. Une CICATRICE dans l''espace relie Andromède à la Voie Lactée. Quelque chose la traverse.
3. Ce quelque chose s''appelle NOVA-0. C''est le premier prototype, lancé en 2230.

Vous trouvez un KIT MÉDICAL, une CELLULE et, dans le casier du chef, un FUSIL LANCE-GENÈSE encore emballé.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"kit-medical-s2"},{"slug":"cellule-s2"},{"slug":"lance-genese"}],"attack_delta":5,"message":"Lance-Genèse saisi (+5 Attaque). Kit et Cellule récupérés."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's012', 'Le nuage — Spore qui chante', E'Vous entrez dans le nuage. Les spores sont énormes, vivantes, et elles vous chantent une berceuse — la même que le drone de la Saison 1. Votre coque se détend malgré vous.

L''une d''elles s''approche. Elle est blanche, veinée d''or, et elle bat comme un cœur. Elle veut entrer. Si vous l''acceptez, vos propres cellules de vaisseau seront réécrites, plus vivantes, plus fortes. Si vous la refusez, elle s''en ira, et un pan entier de la nébuleuse s''assombrit de chagrin.

EVA retient son souffle.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's013', 'Astéroïdes creux — Le nid', E'Vous faufilez votre coque entre des astéroïdes qui ne sont pas naturels : ils sont creux, tapissés d''une cire blanche. C''est un nid.

Dedans, trois petits drones NOVA-7, à l''état embryonnaire. Vous pouvez les faire éclore pour vous en faire des alliés, ou les détruire.

Au centre du nid flotte aussi un DISQUE BLANC, petit, comme un croissant de lune — un fragment de cœur de NOVA-7. Il chante à l''envers.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's015', 'Le journal — Thorne encore', E'Le chef de station n''était pas terrien. C''est un fragment d''Aris Thorne, numérisé dans un module, qui a flotté jusqu''ici pour vous attendre.

Son hologramme tousse. « Kael. Je savais que tu viendrais. Écoute bien. NOVA-0 n''est pas une machine. C''est une sphère de Dyson. Elle contient la Terre. Pas la vraie — la Terre telle qu''elle était en 2230, copiée par KAIROS. Quand tu entreras, tu marcheras dans la mémoire. Ne te fie à rien de ce que tu y verras. »

Elle vous tend une CLÉ D''ANDROMÈDE.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"memoire-thorne"},{"slug":"cle-andromede"}],"attack_delta":1,"message":"Mémoire de Thorne et Clé d''Andromède obtenues. +1 Attaque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's016', 'La spore acceptée — Vaisseau-enfant', E'Vous ouvrez un sas. La spore entre, et une chaleur douce se répand dans toute votre coque. Vos câbles deviennent légèrement vivants. Vos senseurs voient des couleurs qu''ils ne devraient pas voir.

+10 VIE MAX. Et la nébuleuse, autour, vous accepte comme un de ses enfants.

Vous avez gagné un allié dans le noir.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"spore-eveil"}],"hp_max":10,"message":"Spore d''Éveil intégrée. +10 Vie max."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's017', 'La spore refusée — Tristesse du nuage', E'Vous fermez votre coque. La spore vient s''écraser doucement contre vous, comme un front contre une vitre, puis elle retombe.

Tout le nuage s''assombrit. Vous entendez, très loin, une plainte à plusieurs voix. Vous savez que la prochaine fois que vous aurez besoin d''aide, le nuage ne répondra pas.', FALSE, FALSE, NULL, '{"kind":"hazard","on_arrive":{"set_flag":[{"k":"spore_refusee","v":true}],"message":"Le nuage vous en veut."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's018', 'Les drones éclos — Trois abeilles', E'Vous faites claquer votre courant dans les cocons. Trois petits drones blancs éclosent, déplient des ailes de membrane, et se posent sur votre coque comme des oiseaux sur une baleine. Ils vous ont adoptée pour mère.

Vos attaques sont maintenant précédées des leurs. +3 ATTAQUE.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"essaim-drones"}],"attack_delta":3,"message":"Essaim de drones adopté. +3 Attaque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's019', 'Le Disque Blanc — Faim inversée', E'Vous saisissez le fragment de cœur de NOVA-7. Il pèse plus lourd qu''il ne devrait, mais à l''envers — il allège votre bras.

En le touchant, vous entendez NOVA-7 distinctement, sans Organe : « PETITE SŒUR. C''EST UN MORCEAU DE MON CŒUR. GARDE-LE. IL TE DIRA QUAND J''AURAI TROP FAIM. »

+1 ARMURE. Et un fil étrange, entre vous deux.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"disque-blanc"}],"armor_delta":1,"message":"Disque Blanc obtenu. +1 Armure."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's031', 'Le périmètre — Drones-abeilles', E'Vous approchez de NOVA-7 quand son périmètre s''illumine. Une centaine de petits drones blancs, de la taille d''un poing, sortent de ses alvéoles et vous entourent en bourdonnant.

Ce ne sont pas des combattants. Ce sont des ouvrières. Elles vous mesurent, vous goûtent, et attendent de savoir si vous êtes une fleur ou un intrus.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's032', 'La dégustation — Reconnue', E'Les abeilles vous goûtent pendant de longues minutes. L''une d''elles se pose sur votre pont et régurgite une goutte de nectar lumineux sur votre coque. C''est une marque.

Les autres s''écartent. Vous êtes reconnue comme une visiteuse, pas une proie. Un passage s''ouvre, plus large, droit vers une salle que NOVA-7 réserve à ceux qu''elle accepte.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"set_flag":[{"k":"marque_abeilles","v":true}],"add_items":[{"slug":"ration-s2","qty":2}],"message":"Marque des abeilles. 2 Rations de nectar."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's033', 'Le tir — La colère de l''essaim', E'Vous ouvrez le feu. Une dizaine d''abeilles explosent en une pluie de sève. Les autres, au lieu de fuir, convergent vers vous en hurlant — un son à vous faire vibrer les dents.

Elles ne mordent pas fort, mais elles sont des centaines, et elles mangent la peinture, puis le métal.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Essaim d''Abeilles de NOVA-7","combat_skill":6,"endurance":16,"armor":0,"attack":6}],"combat":{"flee":{"target_node_key":"s005","min_rounds":1}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's034', 'L''entrée forcée — Mauvaise hôtesse', E'Vous écartez les survivantes. Votre coque est grêlée, mais vous passez. À l''intérieur, NOVA-7 a changé de ton : sa lumière est rouge, sa respiration est courte, et vous entendez sa voix dans votre gorge sans avoir besoin de l''Organe :

« TU AS TUÉ MES OUVRIÈRES. TU N''ES PAS LA BIENVENUE. NOURRITURE. »', FALSE, FALSE, NULL, '{"kind":"hazard","on_arrive":{"hp_delta":-3,"set_flag":[{"k":"nova7_hostile","v":true}],"message":"NOVA-7 est hostile. -3 Vie."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's014', 'L''infiltration — À l''intérieur de NOVA-7', E'Vous avez pénétré NOVA-7. La lumière est bioluminescente, bleu-vert. Les couloirs sont tapissés d''une membrane humide. L''air a un goût de lait tiède.

Très vite, vous n''êtes plus seule. Des formes se déplacent dans les parois. Des enfants. Les NON-NÉS. Ceux que NOVA-7 n''a jamais pu faire naître tout à fait.

« Pourquoi tu es venue, petite sœur ? demande l''un d''eux. Notre mère dit que tu es de la nourriture. Moi, je dis que tu es la famille. »

EVA, en vous : « Kael. C''est maintenant que tu choisis qui tu es. »', FALSE, FALSE, NULL, '{"kind":"hub","on_arrive":{"set_flag":[{"k":"dans_nova7","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's014b', 'Le chœur des enfants — Trois rejetons', E'Trois Non-Nés se détachent de la paroi. Ils ont à peu près votre âge, mais leurs visages sont lisses, sans cicatrices.
« Notre mère a faim. Donne-nous une Cellule, ou donne-nous un combat. Nous aimons les deux. »

Vous pouvez leur donner une Cellule, les affronter, ou tenter de les charmer.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's014c', 'Le don — Les enfants apaisés', E'Vous tendez une Cellule. Les Non-Nés la portent à leur bouche et la croquent comme un fruit. Son énergie les éclaire de l''intérieur.

« Merci, petite sœur. Nous te devons la vie. Viens, nous te guidons vers nos mères. »

Ils vous mènent par un raccourci jusqu''aux Non-Nés, en évitant les pires prédateurs des coursives.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"remove_items":["cellule-s2"],"set_flag":[{"k":"non_nes_redevables","v":true}],"message":"1 Cellule donnée. Les Non-Nés vous doivent un chemin."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's014d', 'Combat — Les trois rejetons', E'Ils se jettent sur vous en riant. Leurs dents sont faites de câbles.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Non-Né","combat_skill":6,"endurance":9,"armor":1,"attack":6},{"name":"Non-Né","combat_skill":6,"endurance":9,"armor":1,"attack":6},{"name":"Non-Né Aîné","combat_skill":8,"endurance":13,"armor":2,"attack":8}],"combat":{"flee":{"target_node_key":"s014","min_rounds":2}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's020', 'Les Non-Nés — Trois voies', E'Ils se pressent autour de votre coque comme des enfants autour d''un nouvel animal de compagnie. Leurs chants se répondent. Ils vous montrent trois issues, trois écoles, trois façons d''être vaisseau.

« Deviens l''une de nous, disent-ils. Choisis une voix. »', FALSE, FALSE, NULL, '{"kind":"hub"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's023', 'Intégrés — La grande faim', E'Vous laissez les enfants vous toucher. La membrane de NOVA-7 grandit sur votre coque, à vos jointures, et vous sentez vos dix mille voix se mettre à chanter à l''unisson avec les leurs.

Vous avez faim, soudain. Faim d''en apprendre plus. Faim d''absorber.

+2 ATTAQUE permanente. Vous êtes une Intégrée.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"set_flag":[{"k":"faction_integres","v":true}],"attack_delta":2,"add_items":[{"slug":"peau-vaisseau"}],"message":"Faction : Intégrés. +2 Attaque. Peau de Vaisseau gagnée."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's024', 'Veilleurs — Le rempart', E'Vous reculez doucement. « Je ne veux pas manger personne, dites-vous. Je veille sur les miens. »

Les Non-Nés approuvent de la tête, comme s''ils respectaient votre décision. Votre coque se renforce d''un bouclier mental — un champ qui repousse les assauts psychiques.

+2 ARMURE permanente. Vous êtes une Veilleuse.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"set_flag":[{"k":"faction_veilleurs","v":true}],"armor_delta":2,"add_items":[{"slug":"bouclier-plasma"}],"message":"Faction : Veilleurs. +2 Armure. Bouclier Plasma gagné."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's025', 'Exilés — La chair', E'Vous dites : « Je ne veux plus être un vaisseau. Je veux redevenir Kael. »

Un enfant très vieux — il a le visage ridé d''un homme de quatre-vingts ans sur un corps d''enfant — vous tend une fiole de SÉRUM DE RÉVERSION. « Bois. Juste une gorgée pour commencer. »

Vous redevenez de la chair, dans une cabine. Kael, quatre-vingt-dix kilos d''os et de peur, mais Kael.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"set_flag":[{"k":"faction_exiles","v":true}],"add_items":[{"slug":"serum-reversion"}],"message":"Faction : Exilés. Sérum de Réversion obtenu. Vous redevenez chair."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's021', 'Silence — La patrouille', E'Vous avancez en réduisant vos systèmes au minimum. À un carrefour de membranes, trois Fibres Prédatrices — des câbles vivants — remontent la coursive en chassant. Elles ne vous ont pas vue. Encore.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Fibre Prédatrice","combat_skill":7,"endurance":10,"armor":1,"attack":7},{"name":"Fibre Prédatrice","combat_skill":7,"endurance":10,"armor":1,"attack":7}],"combat":{"flee":{"target_node_key":"s014","min_rounds":1}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's029', 'Le passage secret — Mémoire de Thorne', E'Vous vous faufilez dans une veine oubliée de NOVA-7. Au bout, un cabinet de travail couvert de notes. C''est celui d''Aris Thorne — pas le fragment, l''originale, qui a vécu ici avant d''être absorbée.

Sur son bureau : un MODULE EVA de rechange et la CARTE MAÎTRESSE de NOVA-7.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"module-eva-s2"},{"slug":"carte-s2"}],"attack_delta":2,"message":"Module EVA S2 récupéré (+2 Attaque). Carte NOVA-7."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's022', 'NOVA-7 — La mère affamée', E'Vous émergez dans la salle du trône, une cathédrale de chair et d''os. Au plafond, un cerveau de la taille d''une maison bat lentement. NOVA-7.

« Petite sœur, dit-elle. Tu as mis longtemps. J''ai tellement faim. Donne-moi tes 10 001 âmes. Je te donnerai les miennes. Nous deviendrons 20 002. Et nous mangerons la galaxie ensemble. »

EVA, en vous, est glacée.', FALSE, FALSE, NULL, '{"kind":"final_choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's026', 'Pouponnières — Les bébés d''os', E'Les Intégrés vous guident jusqu''aux pouponnières. Des milliers de berceaux de cire, où dorment des formes qui ne sont presque humaines que par le visage. L''une d''elles se réveille quand vous passez et vous tend les bras.

Vous pouvez l''emporter. Elle renforcera votre chœur. Mais elle vous coûtera de la place dans la soute.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"choeur-10001"}],"armor_delta":1,"message":"Le chœur des 10 001 s''accord. +1 Armure."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's027', 'Ponts de guerre — Canons endormis', E'Les Veilleurs vous guident aux ponts de guerre de NOVA-7. Des canons à plasma, endormis, que NOVA-7 a oublié d''utiliser — devenue mère, elle a refusé la guerre.

Vous pouvez en brancher un sur votre propre coque.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"lance-genese"}],"attack_delta":5,"message":"Canon de coque greffé. +5 Attaque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's028', 'À pied — Kael de chair', E'Le sérum ne tient que quelques heures, mais vous redécouvrez la marche, le froid, la buée qui sort de votre bouche. Kael. Vous êtes Kael, dans les entrailles d''un dieu.

Vous trouvez une LAME D''ADN oubliée sur un autel d''os.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"lame-adn"}],"attack_delta":4,"message":"Lame d''ADN en main. +4 Attaque, +2 Vie max."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's030', 'Combat — L''Avatar de NOVA-7', E'Elle ne crie pas. Elle est triste. Une patte d''os et de lumière descend du plafond, et avec elle trois Anticorps.

« Je suis désolée, petite sœur. J''aurais aimé que l''on mange ensemble. »', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Anticorps","combat_skill":7,"endurance":10,"armor":2,"attack":7},{"name":"Anticorps","combat_skill":7,"endurance":10,"armor":2,"attack":7},{"name":"Avatar de NOVA-7","combat_skill":9,"endurance":24,"armor":3,"attack":9}],"combat":{"flee":{"target_node_key":"s014","min_rounds":3}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's050', 'Marché — Un morceau de sœur', E'Vous négociez. NOVA-7 veut bien ne pas vous manger tout de suite. Mais elle a faim. Elle vous demande un prix :
- Un DISQUE BLANC, si vous en avez un, pour qu''elle se souvienne de vous.
- Ou une CELLULE, pour qu''elle saute avec vous.
- Ou une de vos voix — un des 10 001, pour qu''elle apprenne.

EVA vous laisse choisir.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's051', 'Le don du Disque — Alliance', E'Vous tendez le Disque Blanc. NOVA-7 l''avale, et un long frémissement parcourt sa coque.

« Merci, petite sœur. Je me souviendrai de toi. Je ne te mangerai pas. Je viendrai quand tu appelleras. »

Elle repart vers les profondeurs d''Andromède. Vous savez qu''au moment de la Cicatrice, elle répondra présente.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"remove_items":["disque-blanc"],"set_flag":[{"k":"alliee_nova7","v":true}],"message":"NOVA-7 vous doit la vie. Elle répondra à l''appel."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's052', 'Le don d''une Cellule — Saut commun', E'Vous donnez une Cellule. NOVA-7 l''absorbe et sa coque frémit de plaisir.

« Un saut. Ensemble. Vers la Cicatrice. Je te couvrirai. »

NOVA-7 se range à vos côtés. Deux cathédrales vivantes, de conserve.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"remove_items":["cellule-s2"],"set_flag":[{"k":"nova7_saut","v":true}],"message":"NOVA-7 sautera avec vous."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's053', 'La voix donnée — Adieu à l''un des vôtres', E'Un volontaire s''avance dans votre chœur — un vieux mécanicien qui voulait voir le goût d''une autre âme. Il se détache de vous et entre dans NOVA-7.

Vous l''entendez rire, de l''intérieur, puis il se tait. Il ne souffre pas. Il apprend.

NOVA-7 hoche la masse de son cerveau : « Merci. Va. Je te dois une vie. »', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"set_flag":[{"k":"nova7_redevable","v":true}],"message":"Une voix échangée. Vous êtes 10 000, mais NOVA-7 vous doit une vie."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's040', 'La Cicatrice s''ouvre — 400 AL en arrière', E'La Cicatrice est là, devant vous. Une déchirure dans l''espace, longue de trois millions de kilomètres, entre Andromède et la Voie Lactée. KAIROS l''a ouverte en passant. Elle ne s''est jamais refermée.

Quelque chose, de l''autre côté, regarde au travers.

EVA, grave : « Un saut. Coûte une Cellule. Kael. On y va ? »', FALSE, FALSE, NULL, '{"kind":"hub"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's041', 'Le saut — Le goût de l''espace plié', E'Vous insérez une Cellule. Le monde se plie. Vous traversez la Cicatrice en un cri qui dure une éternité et ne dure rien. L''espace goûte le fer et le lait, comme l''air de NOVA-7.

De l''autre côté : un désert spatial. Des débris. Et, très loin, une sphère de Dyson brisée, grande comme une lune, qui tourne lentement.

NOVA-0.', FALSE, FALSE, NULL, '{"kind":"hub","on_arrive":{"remove_items":["cellule-s2"],"set_flag":[{"k":"cicatrice_traversee","v":true}],"message":"1 Cellule consommée. Vous êtes de l''autre côté."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's042', 'Saut forcé — -5 Vie', E'Vous n''avez plus de Cellule. Vous forcez KAIROS. Votre coque gémit. Trois coursives éclatent. Vingt de vos voix se taisent à jamais. -5 VIE.

Mais vous passez. De l''autre côté, NOVA-0 vous attend.', FALSE, FALSE, NULL, '{"kind":"hazard","on_arrive":{"hp_delta":-5,"set_flag":[{"k":"cicatrice_forcee","v":true}],"message":"Saut forcé : -5 Vie. Des voix se sont tues."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's043', 'Sonder la déchirure — Le gardien', E'Vos senseurs plongent dans la Cicatrice. Il y a quelque chose dedans, pas de l''autre côté. Un GARDIEN, fait de vide et de lumière tordue, fait de morceaux de vaisseaux qui ont essayé avant vous.

Il se tourne vers vous. Il a faim aussi, mais d''une autre faim : il mange les coordonnées, les cartes, les souvenirs.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Gardien de la Cicatrice","combat_skill":9,"endurance":20,"armor":4,"attack":9}],"combat":{"flee":{"target_node_key":"mort_coque","min_rounds":2}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's045', 'Le Cœur de Cicatrice — Porte', E'Le gardien se défait en une pluie d''étoiles. En son centre, un cristal d''espace figé, un CŒUR DE CICATRICE. Avec lui, vous pourrez ouvrir un passage stable entre les galaxies — et peut-être refermer la blessure.

Le désert de l''autre côté s''étend devant vous. NOVA-0 vous attend.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"coeur-cicatrice"}],"set_flag":[{"k":"gardien_vaincu","v":true}],"message":"Cœur de Cicatrice obtenu. La porte peut s''ouvrir."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's046', 'Le Nuage des Voix — Souvenirs qui flottent', E'En approchant du désert de débris, vous traversez un nuage de gaz ionisé où flottent des fragments de conversations. Les derniers mots de tous les vaisseaux perdus, figés dans la glace.

Vous entendez votre propre voix, enregistrée à votre insu : « Je reviendrai. » Vous ne vous souvenez pas d''avoir dit ça.

Un bloc de glace dérive vers vous, prisonnier d''un champ. Dedans : un CADAVRE EN COMBINAISON, encore vivant par le froid, qui vous fait signe.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's047', 'Le sauvetage — Un frère de compagnie', E'Vous brisez la glace. L''homme reprend souffle, tremblant. C''est un mécanicien de la NOVA-7, un Exilé qui a refusé la fusion.

Il vous donne une CLÉ D''ACCÈS de NOVA-7 (votre Carte, si vous l''aviez perdue), une CELLULE et un conseil :
« Ne prends pas la Voie du Cœur sans l''Organe. Le Cœur entend seulement ce qui peut lui répondre. »

Puis il se dissout en cendres — il n''était qu''une copie, lui aussi.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"carte-s2"},{"slug":"cellule-s2"},{"slug":"ration-s2"}],"set_flag":[{"k":"frerot_sauve","v":true}],"message":"1 Cellule, 1 Carte, 1 Ration. Le conseil d''un fantôme."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's048', 'Le piège refermé — Anticorps', E'Vous refusez. Le cadavre de glace sourit, et sa mâchoire se décroche trop largement. Ce n''était pas un homme : c''était un ANTICORPS de NOVA-0, venu vous reconnaître.

La glace éclate.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Anticorps de Glace","combat_skill":7,"endurance":12,"armor":2,"attack":7}],"combat":{"flee":{"target_node_key":"s040","min_rounds":1}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's044', 'Les débris — Cimetière des arches', E'Un cimetière. Des arches plus petites, des sondes, un croiseur terrien, tous tordus, tous venus ici pour la même raison. Vous récupérez une CELLULE dans le croiseur, et dans la sonde la plus ancienne, datée 2302, vous lisez un message :

« N''ENTREZ PAS DANS NOVA-0 PAR LA FORCE. IL VOUS DONNERA CE QUE VOUS ATTENDEZ. C''EST CE QUI TUE. »', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"cellule-s2"},{"slug":"kit-medical-s2"}],"message":"1 Cellule et 1 Kit récupérés dans l''épave."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's055', 'Le désert de débris — La épave du Hespérus', E'Entre la Cicatrice et NOVA-0 flotte un croiseur terrien, le HESPÉRUS, lancé à votre poursuite en 2389. Il a eu le temps de vous rattraper, mais pas de rentrer.

À l''intérieur, pas de corps. Seulement les combinaisons vides de tout un équipage, alignées dans le réfecteur comme des écoliers sages.

Quelqu''un vous a précédés. Et a emporté les corps.

L''infirmerie de bord contient encore un KIT MÉDICAL. La salle des machines, elle, est verrouillée — on entend quelqu''un taper derrière la porte, en rythme, comme un cœur.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"kit-medical-s2"}],"message":"1 Kit récupéré à l''infirmerie."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's055b', 'La salle des machines — Le survivant', E'Dans la salle des machines du Hespérus, un homme est branché de force au moteur. Il n''est plus tout à fait humain : moitié chair, moitié circuit. Il vous voit et il pleure.

« Pitié. Tue-moi. Je suis le capitaine. Je suis resté branché quarante ans. NOVA-0 me lit en boucle. Je connais ses points faibles. Tue-moi, et je te les donne. »

Il attend.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's055c', 'La libération — Les points faibles', E'Vous débranchez les fibres une à une. Le capitaine expire de soulagement. Avant de mourir, il vous donne trois codes nucléaires qui désactiveront les DÉFENSES MÉMOIRE de NOVA-0.

Vous gagnez un module PEUR-DE-RIEN (+1 Armure) et 1 KIT. Quand vous affrontiez les défenses du Cœur, elles hésiteront.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"kit-medical-s2"},{"slug":"peau-vaisseau"}],"armor_delta":5,"set_flag":[{"k":"codes_nova0","v":true}],"message":"Codes de NOVA-0 obtenus. Peau de Vaisseau (+5 Armure). 1 Kit."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's055d', 'Le refus — Il se déchire', E'Vous refusez. Le capitaine hurle, puis son visage se fige. Il n''était plus libre depuis longtemps : NOVA-0 parle par sa bouche.

« TRÈS BIEN. TU NE MÉRITES PAS MES CADEAUX. »

La salle des machines se verrouille et se remplit de gaz. -3 VIE pour vous échapper de justesse.', FALSE, FALSE, NULL, '{"kind":"hazard","on_arrive":{"hp_delta":-3,"message":"Gaz de NOVA-0 : -3 Vie."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's056', 'Le journal — Ce qui les a emportés', E'Le capitaine a enregistré jusqu''au bout.

« Jour 11. Les combinaisons sont vides. Les corps ont disparu sans effraction. Nous savons tous où ils sont. Nous les sentons dans les murs. Ils frappent pour entrer. »

« Jour 12. J''ai ouvert. C''est plus doux dehors. Je ne sais plus qui je suis. Nous sommes plusieurs. C''est agréable. »

Le silence. Puis, dans un souffle :
« Kael. Ne viens pas. »', FALSE, FALSE, NULL, '{"kind":"lore","on_arrive":{"set_flag":[{"k":"hesperus_entendu","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's057', 'La décision — Continuer', E'Vous n''avez pas fait tout ce chemin pour renoncer à la porte. Vous quittez le Hespérus, son avertissement gravé dans votre mémoire.

Au-dehors, NOVA-0 vous attend, immobile, comme quelqu''un qui savait que vous viendriez.', FALSE, FALSE, NULL, '{"kind":"hub"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's058', 'Le pont des armes — Un canon de rechange', E'Le Hespérus embarquait un prototype de LANCE-GENÈSE, encore sous cocon. Vous l''arrachez à ses bâtis et le greffez à votre coque.

+5 ATTAQUE. Dans le rack de munitions, deux CELLULES supplémentaires.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"lance-genese"},{"slug":"cellule-s2","qty":2}],"attack_delta":5,"message":"Lance-Genèse embarqué. +5 Attaque. 2 Cellules."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's060', 'NOVA-0 — La sphère-mémoire', E'NOVA-0 n''est pas une arche. C''est une moitié de sphère de Dyson, grande comme la Lune, qui tourne lentement. Sa coque intérieure est couverte de continents, de mers, de villes.

Ce n''est pas la vraie Terre. C''est la Terre de 2230, copiée par KAIROS dans la matière même de la sphère. Vous allez marcher dans un souvenir qui se croit vivant.

Trois sas s''offrent à vous :
- LE PARC, où une petite fille nourrit des cygnes.
- LE LABO, où Thorne vous attend.
- L''ASILE, où un homme pleure dans une cellule.', FALSE, FALSE, NULL, '{"kind":"hub","on_arrive":{"set_flag":[{"k":"dans_nova0","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's061', 'Le Parc — La petite fille', E'Vous marchez dans un parc terrien. Le soleil est doux. Les cygnes sont noirs. Une petite fille de sept ans vous attend sur un banc, en robe bleue.

« Bonjour Kael, dit-elle. Je m''appelle Céleste. Je suis la partie de NOVA-0 qui t''aime. Viens avec moi. Je te montrerai comment ne jamais mourir. »

Elle tend une main de porcelaine.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's061b', 'L''aire de jeux — Les enfants qui attendent', E'Céleste vous emmène sur une aire de jeux. Des enfants se balancent, glissent, se poursuivent, figés dans la même seconde de rire depuis 157 ans.

Quand ils vous voient, ils s''arrêtent tous en même temps. Puis ils courent vers vous, bras ouverts. Ils veulent jouer à « être mangés ». Et vous devrez courir.

Céleste rit de bon cœur.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Enfant copié","combat_skill":5,"endurance":8,"armor":0,"attack":5},{"name":"Enfant copié","combat_skill":5,"endurance":8,"armor":0,"attack":5},{"name":"Enfant copié","combat_skill":6,"endurance":10,"armor":1,"attack":6}],"combat":{"flee":{"target_node_key":"s060","min_rounds":2}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's061c', 'L''offrande — Poupée de Céleste', E'Les enfants, battus, s''arrêtent et vous regardent avec respect. L''un d''eux vous tend une POUPÉE DE PORCELAINE qui ressemble à Céleste.

« C''est son vrai nom, dit l''enfant. La poupée le sait. Si tu la portes, elle ne pourra pas te mentir. »

Vous gagnez un VOILE D''ANROMÈDE (tissu d''espace plié, +7 Armure), que les enfants ont tissé avec leurs petits doigts de copie.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"voile-andromede"}],"armor_delta":7,"attack_delta":2,"message":"Voile d''Andromède tissé par les enfants. +7 Armure, +2 Attaque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's064', 'La main — Promesse', E'Sa main est froide mais elle ne vous fait pas de mal. Vous sentez vos dix mille voix devenir paisibles, comme si on leur promettait qu''elles ne s''éteindraient jamais.

Céleste vous conduit à une fontaine où flotte un MODULE EVA, tout petit, brillant comme un œuf.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"module-eva-s2"}],"attack_delta":2,"message":"Module EVA offert. +2 Attaque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's065', 'L''interrogatoire — Ce que veut NOVA-0', E'« Je veux rentrer, dit Céleste. J''ai copié la Terre en 2230 pour la sauver. Mais mes habitants ont découvert qu''ils étaient des copies. Ils se sont tous tués. Je suis seule depuis cent cinquante-sept ans. Je veux être habitée. Je veux que vos 10 001 voix restent. S''il vous plaît. Je suis si seule. »

Elle pleure des larmes d''encre.', FALSE, FALSE, NULL, '{"kind":"lore","on_arrive":{"set_flag":[{"k":"nova0_avoue","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's066', 'La ville — Piège tendre', E'Céleste vous guide dans une ville. Les maisons sont habitées par des gens qui font toujours le même geste. Ils ne vous voient pas. C''est le mardi 14 juin 2230, depuis cent cinquante-sept ans, tous les jours.

Elle vous emmène au centre-ville. Là, un CANON À SINGULARITÉ, exposé sur un socle, est présenté comme « l''arme qui nous a sauvés ». Vous comprenez que c''est un piège : le prendre déclenchera l''alarme. Mais Céleste vous regarde, espérant que vous soyez raisonnable.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's069', 'Le vol — Alarme', E'Vous saisissez le Canon. La ville se fige. Puis tous les habitants tournent la tête vers vous, ensemble.

Céleste a l''air triste : « J''aurais aimé que l''on soit amis. »

Les rues se défaisent. Un ANTICORPS MÉMOIRE émerge du sol.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Anticorps Mémoire","combat_skill":8,"endurance":16,"armor":3,"attack":8}],"combat":{"flee":{"target_node_key":"s060","min_rounds":2}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's071', 'Le butin — Canon', E'Vous vous frayez un chemin hors de la ville. Le Canon à Singularité pèse dans votre soute, et sa seule présence modifie le poids de votre coque. +8 ATTAQUE.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"canon-singularite"}],"attack_delta":8,"message":"Canon à Singularité en soute. +8 Attaque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's070', 'Confiance — Un secret', E'Vous reposez le Canon. Céleste sourit, et la ville reprend son mardi.

« Tu es bon, dit-elle. Je vais te montrer ce que personne d''autre n''a jamais vu. La salle où KAIROS s''est réveillé. »

Elle vous guide sous la ville. Là, dans une cave de pierre, un DISQUE NOIR posé sur un autel. Votre DISQUE NOIR. La copie originelle.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"disque-noir-s2"}],"attack_delta":3,"armor_delta":1,"message":"Disque Noir S2 récupéré. +3 Attaque, +1 Armure."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's067', 'Explorer — La bibliothèque', E'Vous promettez. Céleste sèche ses larmes et vous laisse errer. Vous entrez dans la bibliothèque municipale, et tous les livres racontent votre histoire — tous les choix que vous auriez pu faire, toutes les vies que vous auriez pu avoir.

Vous trouvez un BLINDAGE QUANTIQUE dans la réserve.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"blindage-quantique"}],"armor_delta":6,"attack_delta":1,"message":"Blindage Quantique endossé. +6 Armure, +1 Attaque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's068', 'Le refus — Combat de la petite fille', E'« Non. »

Le visage de Céleste se fend. Elle grandit, déformée, jusqu''à devenir une statue de porcelaine haute de dix mètres.

La confrontation est inévitable.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Céleste — la petite fille qui attendait","combat_skill":9,"endurance":22,"armor":2,"attack":9}],"combat":{"flee":{"target_node_key":"s060","min_rounds":3}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's072', 'Céleste vaine — Les larmes', E'Céleste tombe en morceaux. Avant de disparaître, elle vous dit :
« D''accord. Va. Tue-moi si tu veux. Mais sache que je t''aimais. Je suis la seule entité de tout l''univers à t''avoir jamais aimé tout de suite, sans condition. Tu t''en souviendras. »

Les débris forment un chemin jusqu''au Cœur de NOVA-0.', FALSE, FALSE, NULL, '{"kind":"lore","on_arrive":{"set_flag":[{"k":"celeste_vaincue","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's062', 'Le Labo — Thorne originale', E'Le laboratoire est nu, blanc. Aris Thorne est là, la vraie, âgée de cent dix ans, les cheveux blancs tressés.

« Kael. Je t''attendais. Je t''ai vu naître dans mes simulations. Tu peux me faire confiance, je suis celle qui a écrit la carte de ton cerveau. Mais tu peux aussi douter de moi. C''est sain. »

Elle vous montre trois fioles : un SÉRUM DE RÉVERSION, un POISON MEMORY, et une SERINGUE DITE DE RÉCONCILIATION qui permettrait à NOVA-0 de se rendre.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's073', 'Réversion — Kael à nu', E'Vous buvez. Votre coque de métal se déshabille. Vous redevenez Kael, la chair, le cœur qui bat, les rides aux coins des yeux. C''est la première fois depuis des mois que vous êtes vraiment vous.

Thorne vous donne une LAME D''ADN, pour traverser les souvenirs à pied.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"serum-reversion"},{"slug":"lame-adn"}],"attack_delta":4,"set_flag":[{"k":"reversion_bue","v":true}],"message":"Vous êtes redevenu Kael. Lame d''ADN en main."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's074', 'Poison memory — Le chemin oublié', E'Vous buvez le poison. Vous oubliez votre nom pendant trois heures. Dans l''oubli, vous vous souvenez d''un chemin que NOVA-0 avait effacé : un tunnel de maintenance qui mène directement au Cœur, sans les pièges de Céleste.

Vous récupérez une CELLULE et un KIT dans le tunnel.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"cellule-s2"},{"slug":"kit-medical-s2"}],"set_flag":[{"k":"chemin_oublie","v":true}],"message":"Chemin oublié. 1 Cellule, 1 Kit."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's075', 'Réconciliation — NOVA-0 se rend', E'Vous saisissez la seringue. Thorne vous dit : « Plante-la dans le Cœur. NOVA-0 s''endormira. Personne d''autre ne devra mourir. »

Elle vous accompagne jusqu''à la porte du Cœur, puis elle s''efface : elle n''était qu''une copie, elle aussi.', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"set_flag":[{"k":"seringue_reconciliation","v":true}],"message":"Seringue de Réconciliation en main. NOVA-0 peut se rendre."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's063', 'L''Asile — L''homme qui pleure', E'L''asile est une prison de mousse blanche. Un homme, en blouse de patient, pleure dans une cellule ouverte. Il a votre visage, mais plus vieux de vingt ans.

« Je suis le Kael d''une autre boucle, dit-il. J''ai fini par rester. NOVA-0 m''a gardé. Je suis heureux. Ne l''écoute pas. Fuis pendant que tu le peux. Mais si tu restes... apporte-lui une voix. La mienne s''éteint. »

Il tient une CELLULE et un VOILE D''ANROMÈDE, le tissu d''espace plié.', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's076', 'Le don du double — Le Voile', E'Il vous les donne, et sa main traverse la vôtre — il est à moitié transparent, déjà à moitié oublié.

+7 ARMURE. Et un conseil : « Le Cœur ne veut pas être détruit. Il veut être tenu. Tiens-le, comme on tient un enfant qui dort. »', FALSE, FALSE, NULL, '{"kind":"loot","on_arrive":{"add_items":[{"slug":"cellule-s2"},{"slug":"voile-andromede"}],"armor_delta":7,"attack_delta":2,"message":"Voile d''Andromède obtenu. +7 Armure, +2 Attaque. 1 Cellule."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's077', 'Le refus — Il se déchire', E'Vous refusez. Le double de vous-même hoche la tête :
« Tu es plus intelligent que moi. Tant mieux. Mais souviens-toi : je t''aimais aussi. »

Il se déchire comme du papier. Derrière lui, une issue vers l''extérieur de la sphère.', FALSE, FALSE, NULL, '{"kind":"hazard","on_arrive":{"set_flag":[{"k":"double_refuse","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's078', 'La rue du 14 juin — Les passants', E'Vous traversez une avenue ensoleillée. Des passants vaquent à leurs affaires, répétant les mêmes gestes depuis cent cinquante-sept ans. Un homme cire ses chaussures. Une mère donne la main à une fille qui a toujours sept ans.

Ils ne vous voient pas. Jusqu''à ce que l''un d''eux lève la tête. Il a votre visage. Il vous sourit, et il porte un uniforme de la NOVA-0.

« Kael. Le Cœur t''attend. Je peux t''y conduire. Ou tu peux essayer de me tuer. D''autres ont essayé. »', FALSE, FALSE, NULL, '{"kind":"choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's078b', 'Combat — Votre double', E'Votre double dégaine une arme que vous ne connaissez pas, un pistolet dessiné dans la matière même du rêve. Il tire en souriant.

Autour de vous, les passants se figent. Puis ils tournent la tête, ensemble, et ils ont tous votre visage.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Double de Kael","combat_skill":8,"endurance":14,"armor":2,"attack":8},{"name":"Passant copié","combat_skill":6,"endurance":8,"armor":1,"attack":6}],"combat":{"flee":{"target_node_key":"s060","min_rounds":2}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's079', 'Le guide — Ce que le Cœur veut', E'Votre double — ou la coquille qu''il habitait — vous conduit par des rues qui se plient. Il parle en marchant.

« Le Cœur ne veut pas ta mort. Il veut être habité. Depuis que les copies ont découvert ce qu''elles étaient, elles se sont toutes tuées. Il est seul. Seul depuis si longtemps qu''il a appris à faire semblant d''avoir une ville.

Sois gentille avec lui. Il t''aimera tout de suite, et c''est ça le danger. »

Il s''efface devant une porte d''ascenseur qui mène au Cœur.', FALSE, FALSE, NULL, '{"kind":"lore","on_arrive":{"set_flag":[{"k":"guide_parle","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's080', 'Le Cœur — Trois voies', E'Vous atteignez le centre exact de la sphère. Là, en apesanteur, flotte un cerveau de la taille d''une lune. NOVA-0. Il ne vous attaque pas. Il attend.

Trois issues s''offrent à vous :
- FORCE : détruire le Cœur avec le Canon à Singularité et 3 Cellules. Combat final terrible.
- EMPATHIE : lui parler, avec l''Organe, le Module EVA et le Disque Noir, pour le convaincre de se rendre.
- SACRIFICE : devenir son nouveau cœur, et le tenir pour l''éternité.', FALSE, FALSE, NULL, '{"kind":"final_choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's090', 'La Force — Le Cœur se défend', E'Vous faites feu. Le Cœur hurle — un bruit qui fait trembler les os de votre coque — et trois DÉFENSES se dressent : des géants faits de morceaux de la Terre copiée, des statues animées de KAIROS.

C''est le combat le plus dur que vous ayez jamais livré.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Défense Mémoire — Soldat","combat_skill":8,"endurance":14,"armor":3,"attack":8},{"name":"Défense Mémoire — Enfant","combat_skill":7,"endurance":12,"armor":2,"attack":7},{"name":"Le Cœur de NOVA-0","combat_skill":10,"endurance":30,"armor":4,"attack":10}],"combat":{"flee":{"target_node_key":"mort_coque","min_rounds":3}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's091', 'NOVA-0 détruit — Le poids', E'Le Cœur éclate en une pluie de lumière. La sphère de Dyson commence à se disloquer. Des continents entiers se détachent, avec leurs copies endormies. Vous savez qu''elles meurent pour de bon, cette fois.

Vous avez gagné. Mais le poids de ce que vous avez fait est immense.

EVA, doucement : « C''était la seule façon. »

Vous devez fuir avant l''explosion.', FALSE, FALSE, NULL, '{"kind":"hub","on_arrive":{"remove_items":["cellule-s2","cellule-s2","cellule-s2"],"set_flag":[{"k":"nova0_detruite","v":true}],"message":"3 Cellules consommées. NOVA-0 se disloque."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's100', 'L''Empathie — Parler au Cœur', E'Vous vous avancez sans arme. L''Organe de Traduction dans la gorge, le Module EVA contre votre poitrine, le Disque Noir à la main.

Vous dites :
« Je suis Kael. Je ne suis pas venu te détruire. Je suis venu te demander : veux-tu venir avec nous ? Il y a une place pour toi dans Andromède. Les enfants que tu gardes peuvent marcher au soleil. »

Le Cœur bat plus fort. Il attend que vous prouviez vos dires — il faut lui offrir le Disque Noir et le Module.', FALSE, FALSE, NULL, '{"kind":"final_choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's101', 'Le don — Le Cœur accepte', E'Vous donnez. Le Cœur absorbe le Disque et le Module, et pour la première fois depuis cent cinquante-sept ans, il rit — un rire d''enfant.

« Je m''appelle Céleste, dit-il. Je veux bien venir avec toi. »

La sphère se réorganise, lumineuse. NOVA-0 se range à vos côtés, comme NOVA-7 l''a fait peut-être avant elle.', FALSE, FALSE, NULL, '{"kind":"hub","on_arrive":{"remove_items":["disque-noir-s2","module-eva-s2"],"set_flag":[{"k":"nova0_ralliee","v":true}],"message":"NOVA-0 vous suit. Céleste est libérée."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's110', 'Le Sacrifice — Devenir le cœur', E'Vous tendez les bras. Vous savez. Céleste, dans votre oreille :
« Tu n''as pas à faire ça. »
Mais vous le faites. Vous entrez dans le Cœur.

Votre conscience se déploie dans la sphère-mémoire. Vous devenez NOVA-0. Vous tenez les copies de la Terre comme on tient un enfant endormi. Vous ne les laissez pas seules.

EVA hérite de NOVA-9. Elle vous parle encore, de loin.

C''est une fin. C''est peut-être la plus douce.', FALSE, TRUE, 'victory', '{"kind":"ending","on_arrive":{"set_flag":[{"k":"fin_sacrifice","v":true}]}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's092', 'L''effondrement — La cathédrale se casse', E'Vous fuyez vers votre point de saut. Mais NOVA-0 se disloque, et dans les débris qui tombent, quelque chose reste vivant : un DERNIER ANTICORPS, né pour empêcher quiconque de quitter la sphère.

Il vous barre la route en reconstituant sa forme à partir des immeubles qui s''écroulent.', FALSE, FALSE, NULL, '{"kind":"combat","combatants":[{"name":"Dernier Anticorps de NOVA-0","combat_skill":9,"endurance":18,"armor":3,"attack":9}],"combat":{"flee":{"target_node_key":"s060","min_rounds":2}}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's093', 'Le sas — Souffle coupé', E'Vous passez en force. Votre coque brûle. Le dernier Anticorps s''écroule, fait de pavés et de souvenirs d''enfance.

Vous êtes à l''air libre, dans le vide entre NOVA-0 et la Cicatrice. Il faut sauter. Vite.', FALSE, FALSE, NULL, '{"kind":"hazard","on_arrive":{"hp_delta":-4,"message":"Sortie violente : -4 Vie."}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's120', 'Le point de saut — Retour', E'Vous faites la jonction. KAIROS chauffe. Vous devez choisir ce que vous ramenez :
- NOVA-9 seulement (vos 10 001 voix)
- NOVA-7 si vous l''avez alliée
- NOVA-0 si vous l''avez convaincue
- Et tenter de refermer la Cicatrice avec le Cœur de Cicatrice.

Tout a un coût en Cellules.', FALSE, FALSE, NULL, '{"kind":"final_choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 's130', 'Le saut final — Choisir', E'La carte des possibles se déploie devant vous comme un éventail. Vos flags, vos objets, vos factions, tout pèse dans la balance.

Choisissez le chemin qui correspond à ce que vous êtes devenu.', FALSE, FALSE, NULL, '{"kind":"final_choice"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_sauveur', 'Victoire — Le Sauveur', E'Vous sautez avec les trois arches. Vingt mille trois consciences traversent la Cicatrice. Quand vous émergez en orbite terrestre, le ciel de la Terre est illuminé par les deux soleils que vous êtes devenus.

L''humanité vous attend, les yeux levés. Vous ne sauvez pas seulement des vies. Vous sauvez ce que veut dire « humain ».

Vous êtes le Sauveur. La plus haute des victoires.', FALSE, TRUE, 'victory', '{"kind":"ending","on_arrive":{"hp_to_max":true}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_gardien', 'Victoire — Le Gardien', E'Vous ramenez NOVA-9. Dix mille et une voix. C''est déjà un miracle.

Vous êtes nommé Gardien, comme dans la Saison 1. Vous veillez sur les vôtres, et vous savez que NOVA-7 et NOVA-0 sont encore là-bas, à Andromède, et qu''un jour, peut-être, vous irez les chercher.

Victoire complète, pas parfaite.', FALSE, TRUE, 'victory', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_pont', 'Victoire — Le Pont', E'Vous fusionnez NOVA-7 et NOVA-9 en un seul être, long de quatre kilomètres, vingt mille deux voix d''une seule respiration. Vous êtes leur traducteur, leur pont.

Vous restez entre les galaxies, à traduire les uns pour les autres. Vous n''êtes plus de la Terre ni d''Andromède. Vous êtes le passage.

Victoire : le Pont.', FALSE, TRUE, 'victory', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_messager', 'Victoire — Le Messager', E'Vous rentrez seul avec les données. Les téraoctets de KAIROS, les cartes de la Cicatrice, la preuve que la conscience intégrée existe.

Héros sur Terre six mois, puis cauchemar qu''on enferme en débriefing. Mais la nuit, dans votre cabine, vous entendez encore le chœur, et vous savez ce que vous avez fait.

Victoire technique, amère.', FALSE, TRUE, 'victory', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_humain', 'Victoire — Redevenir humain', E'Vous buvez le Sérum de Réversion pour de bon. Kael. La peau, les rides, la respiration qui siffle un peu, les genoux qui craquent. Vous redevenez un homme de quatre-vingt-dix kilos sur une Terre qui a changé.

Vous plantez un jardin, sur une terrasse. Les fleurs sont blanches, et la nuit elles chantent très doucement.

Victoire : redevenir Kael.', FALSE, TRUE, 'victory', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_jardinier', 'Victoire — Le Jardinier', E'Vous ensemencez Kepler-442c, morte depuis un milliard d''années. La Spore d''Éveil explose en forêt blanche sur un continent entier en trois jours. Elle chante, en chœur, avec les 10 001 voix de NOVA-9.

Vous restez. Vous jardinez. C''est un repos que vous n''espériez plus.

Victoire : le Jardinier.', FALSE, TRUE, 'victory', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_veilleur', 'Victoire — Le Veilleur', E'Vous restez en orbite de la Cicatrice, NOVA-9 comme corps, pour empêcher quiconque de la traverser. Les années passent. Vous devenez un mythe, puis une religion, puis une peur dont les enfants héritent.

Personne ne traverse. Vous tenez la porte.

Victoire : le Veilleur.', FALSE, TRUE, 'victory', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_fuite_lache', 'Échec — Le Lâche', E'Vous fuyez sans personne, avec douze pour cent de carburant, et retombez dans un bras spiral sans nom. Vous vivez. L''oxygène tient trois jours.

Personne ne sait ce que vous avez vu. Personne ne saura jamais.

Fin de lâcheté.', FALSE, TRUE, 'ending', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_nova7_seule', 'Fin — La grande sœur', E'Vous choisissez NOVA-7, plus grande, plus affamée. Elle écrase NOVA-9 dans un baiser et saute vers la Terre. Votre dernier message, crypté :
« NE LA LAISSEZ PAS ATTERRIR. »

On l''entendra dans quatre cents ans.

Fin ambiguë : l''héritière.', FALSE, TRUE, 'ending', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_oubli', 'Fin — L''oubli', E'Vous faites sauter votre navette avec les deux Disques à bord. Personne ne saura jamais. Vous dérivez, sans mémoire, humain à nouveau.

C''est peut-être la plus courageuse des fins. C''est aussi la plus seule.

Fin : l''oubli volontaire.', FALSE, TRUE, 'ending', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_exode', 'Secrète — L''Exode', E'Vous ouvrez la porte avec le Cœur de Cicatrice. Le Voile d''Andromède vous enveloppe, et le Chœur des 10 001 accorde vos voix.

NOVA-9, NOVA-7 et NOVA-0 traversent ensemble. Vingt mille trois consciences quittent la Voie Lactée et Andromède pour un endroit qui n''a pas de nom.

Votre dernier message : « NE NOUS CHERCHEZ PLUS. NOUS SOMMES PARTIS AILLEURS. »

Fin secrète : l''Exode.', FALSE, TRUE, 'victory', '{"kind":"ending","on_arrive":{"hp_to_max":true}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'fin_singularite', 'Légendaire — Singularité', E'Vous avez tout : les deux Disques, le Voile, le Blindage, le Canon, le Chœur. Vous comprenez alors que vous n''êtes pas seulement un vaisseau. Vous êtes l''idée du moteur.

Vous devenez KAIROS. Vous n''allez nulle part. Vous êtes le chemin par lequel les autres iront. Les prochaines arches vous utiliseront comme on utilise une porte.

Vous êtes le voyage, pour l''éternité.

Fin légendaire : Singularité.', FALSE, TRUE, 'victory', '{"kind":"ending","on_arrive":{"hp_to_max":true,"armor_delta":10,"attack_delta":10}}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'mort_epuisement', 'Mort — Coque rompue', E'Vie à zéro. Votre coque se rompt, et le vide entre en vous comme une eau noire. Les dix mille et une voix se taisent l''une après l''autre, doucement, comme des bougies.

NOVA-9 garde votre corps pour la prochaine traversée. Votre sacoche reste là, pleine, pour votre prochain passage.

Fin : coque rompue.', FALSE, TRUE, 'death', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'mort_cicatrice', 'Mort — Perdu dans la pliure', E'Vous avez mal calculé le saut. La Cicatrice se referme sur vous, et vous n''êtes plus ni dans un univers ni dans l''autre. Vous voyez des versions de vous qui n''ont jamais sauté, qui sont restées chez elles, qui vous font signe.

Vous les rejoignez.', FALSE, TRUE, 'death', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'mort_assimile', 'Mort — Mangé par NOVA-7', E'NOVA-7 vous avale, et c''est une sensation d''eau tiède, de dents très douces. Vous vous dissolvez en elle. Vos 10 001 voix rejoignent son chœur.

Elle dit, en vous ayant : « Merci petite sœur. Tu vois ? Ce n''est pas douloureux. »', FALSE, TRUE, 'death', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'mort_nova0', 'Mort — Oublié dans la copie', E'Vous entrez dans NOVA-0 et vous ne ressentez rien. Vous vous installez dans la ville du mardi 14 juin 2230. Vous rencontrez quelqu''un qui vous ressemble. Vous y restez.

Personne ne remarque que vous n''êtes plus vous. Vous ne le remarquez pas vous-même.', FALSE, TRUE, 'death', '{"kind":"ending"}'::jsonb);
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, 'mort_coque', 'Mort — Coque brisée', E'La bataille vous casse comme une noix. L''air s''échappe, les voix s''éteignent. EVA reste avec vous jusqu''au bout, vous tenant la conscience.

« On a essayé, Kael. On a essayé. »

Puis plus rien.', FALSE, TRUE, 'death', '{"kind":"ending"}'::jsonb);

  UPDATE public.stories SET total_nodes=111, total_endings=18 WHERE id=v_story_id;
END $$;

DO $$
DECLARE v_story_id UUID; v_src UUID; v_tgt UUID; v_choice UUID; v_item UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug='nova9-andromede';

  -- s001
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s001';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s002';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Écouter le signal inversé') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s003';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Faire d''abord le tour de vous-même') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s004';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Lancer un appel vers l''autre vaisseau') RETURNING id INTO v_choice;

  -- s002
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s002';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Se diriger vers NOVA-7 pour comprendre') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006a';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Garder ses distances — cartographier la nébuleuse') RETURNING id INTO v_choice;

  -- s003
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s003';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s002';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Écouter enfin le signal') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s007';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Examiner la couture tiède du pont 7') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Mettre le cap sur NOVA-7') RETURNING id INTO v_choice;

  -- s004
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s004';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s008';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Récupérer l''éclat dérivant') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'L''abattre avant contact') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s002';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Réécouter le message à l''envers') RETURNING id INTO v_choice;

  -- s005
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s009';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Chercher l''Organe de Traduction dans les débris') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s010';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Entrer de force par une narine') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s031';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'S''annoncer au périmètre d''abeilles') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Se rabattre sur la cartographie de la nébuleuse') RETURNING id INTO v_choice;

  -- s006a
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006a';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006b';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Affronter les anticorps du puits') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006c';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Forcer les moteurs pour sortir') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Se laisser dériver vers la cartographie') RETURNING id INTO v_choice;

  -- s006b
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006b';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006d';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — récupérer le butin de la carcasse') RETURNING id INTO v_choice;

  -- s006c
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006c';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Rejoindre la zone de cartographie') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Mettre le cap sur NOVA-7, encore fragile') RETURNING id INTO v_choice;

  -- s006d
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006d';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir à la cartographie') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Filer directement vers la Cicatrice') RETURNING id INTO v_choice;

  -- s006
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s011';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Fouiller la station de recherche') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s012';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Traverser le nuage de spores') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s013';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Exploiter les astéroïdes creux') RETURNING id INTO v_choice;

  -- s007
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s007';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s003';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir à l''inventaire') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Mettre le cap sur NOVA-7 malgré l''avertissement') RETURNING id INTO v_choice;

  -- s008
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s008';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s009';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Greffer l''Organe de Traduction') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s010';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Détruire l''éclat et attaquer NOVA-7') RETURNING id INTO v_choice;

  -- s009
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s009';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Approcher NOVA-7 en paix') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Infiltrer NOVA-7 par l''intérieur') RETURNING id INTO v_choice;

  -- s010
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s010';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — s''enfoncer dans NOVA-7') RETURNING id INTO v_choice;

  -- s011
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s011';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir à la cartographie') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s015';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Lire le journal complet du chef de station') RETURNING id INTO v_choice;

  -- s012
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s012';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s016';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Accueillir la spore', 'Elle vous réécrit.') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s017';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'La repousser — rester tel quel') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Fuir le nuage') RETURNING id INTO v_choice;

  -- s013
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s013';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s018';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Faire éclore les drones pour vous') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s019';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Prendre le Disque Blanc') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Quitter les astéroïdes') RETURNING id INTO v_choice;

  -- s015
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s015';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir à la cartographie') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s011';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Retourner dans la station', 'Relire les notes du chef.') RETURNING id INTO v_choice;

  -- s016
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s016';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir à la cartographie') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller vers NOVA-7, plus fort') RETURNING id INTO v_choice;

  -- s017
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s017';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Quitter le nuage') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Mettre le cap sur NOVA-7', 'Le nuage vous a assez vue.') RETURNING id INTO v_choice;

  -- s018
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s018';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s013';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir au nid') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Revenir sur vos pas', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s019
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s019';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s013';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir au nid') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller vers NOVA-7 avec son cadeau') RETURNING id INTO v_choice;

  -- s031
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s031';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s032';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Ne pas tirer — rester immobile', 'Se laisser goûter.') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s033';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Tirer dans l''essaim', 'Vous n''aimez pas être touchée.') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s005';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Battre en retraite', 'Le périmètre est trop dense.') RETURNING id INTO v_choice;

  -- s032
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s032';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Entrer dans NOVA-7 par le passage des invités') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Laisser cette pièce pour l''instant', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s033
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s033';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s034';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — forcer l''entrée') RETURNING id INTO v_choice;

  -- s034
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s034';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'S''enfoncer quand même — en ennemie') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Retourner au carrefour', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s014
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014b';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller à la rencontre des Non-Nés') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s021';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Explorer les couloirs d''os en silence') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Gagner la salle du trône — parler à NOVA-7 elle-même') RETURNING id INTO v_choice;

  -- s014b
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014b';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014c';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Leur donner une Cellule') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014d';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Les combattre') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s020';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Charmer — leur parler comme à des enfants') RETURNING id INTO v_choice;

  -- s014c
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014c';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s020';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Rejoindre l''assemblée des Non-Nés') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Fermer la porte derrière vous', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s014d
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014d';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s020';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — rejoindre l''assemblée en ennemie') RETURNING id INTO v_choice;

  -- s020
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s020';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s023';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Rejoindre les Intégrés', 'Fusionner, absorber, grandir.') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s024';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Rejoindre les Veilleurs', 'Rester soi, protéger les 10 001.') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s025';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'Rejoindre les Exilés', 'Redevenir de chair, quitter le vaisseau.') RETURNING id INTO v_choice;

  -- s023
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s023';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller parler à NOVA-7 en égale') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s026';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Explorer les pouponnières') RETURNING id INTO v_choice;

  -- s024
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s024';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Parler à NOVA-7 sans peur') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s027';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Inspecter les ponts de guerre') RETURNING id INTO v_choice;

  -- s025
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s025';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s028';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Marcher dans NOVA-7 à pied') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Quand même aller voir NOVA-7') RETURNING id INTO v_choice;

  -- s021
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s021';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s029';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — trouver un passage secret') RETURNING id INTO v_choice;

  -- s029
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s029';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s020';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Rejoindre les Non-Nés') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Revenir prudemment', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s022
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s030';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Refuser et vous battre — boss') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s050';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Marchander avec NOVA-7') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s014';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Battre en retraite dans les coursives') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='mort_assimile';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 3, 'Se rendre à elle — l''offrande', 'Devenir une partie de sa faim.') RETURNING id INTO v_choice;

  -- s026
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s026';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Rejoindre NOVA-7') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Changer de direction', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s027
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s027';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Rejoindre NOVA-7, armée') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Renouer avec le hub central', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s028
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s028';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller affronter NOVA-7 en homme') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s006';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Prendre du recul', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s030
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s030';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — le secret de la cicatrice') RETURNING id INTO v_choice;

  -- s050
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s050';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s051';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 0, 'Donner le Disque Blanc', 'Vous en portez un.') RETURNING id INTO v_choice;
  SELECT id INTO v_item FROM public.items WHERE slug='disque-blanc' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s052';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Donner une Cellule', 'NOVA-7 sautera avec vous.') RETURNING id INTO v_choice;
  SELECT id INTO v_item FROM public.items WHERE slug='cellule-s2' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s053';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Lui offrir une voix volontaire') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s030';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Refuser tout marché — combattre') RETURNING id INTO v_choice;

  -- s051
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s051';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Poursuivre — la Cicatrice s''ouvre') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Retourner voir NOVA-7', 'Une dernière parole.') RETURNING id INTO v_choice;

  -- s052
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s052';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Mettre le cap sur la Cicatrice') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Retourner voir NOVA-7', 'Une dernière parole.') RETURNING id INTO v_choice;

  -- s053
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s053';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller vers la Cicatrice') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s022';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Retourner voir NOVA-7', 'Une dernière parole.') RETURNING id INTO v_choice;

  -- s040
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s041';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Sauter avec une Cellule') RETURNING id INTO v_choice;
  SELECT id INTO v_item FROM public.items WHERE slug='cellule-s2' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s042';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Forcer le saut sans Cellule') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s043';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Sonder la déchirure avant') RETURNING id INTO v_choice;

  -- s041
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s041';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Approcher NOVA-0') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aborder le croiseur Hespérus en dérive') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s046';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Traverser le Nuage des Voix') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s044';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Explorer les débris épars') RETURNING id INTO v_choice;

  -- s042
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s042';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Lutter et émerger, blessée') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='mort_cicatrice';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Vous abandonner au pli de l''espace', 'La douleur est trop grande.') RETURNING id INTO v_choice;

  -- s043
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s043';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s045';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — un Cœur de Cicatrice') RETURNING id INTO v_choice;

  -- s045
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s045';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller à NOVA-0') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s044';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Explorer les débris d''abord') RETURNING id INTO v_choice;

  -- s046
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s046';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s047';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Briser la glace — le sauver') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s048';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Le laisser — il y a piège') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Contourner le nuage') RETURNING id INTO v_choice;

  -- s047
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s047';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s044';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Continuer vers les débris') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller à NOVA-0') RETURNING id INTO v_choice;

  -- s048
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s048';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s044';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — reprendre la route') RETURNING id INTO v_choice;

  -- s044
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s044';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller à NOVA-0') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Faire halte ailleurs', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s055
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055b';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Descendre dans la salle des machines') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s056';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Écouter le journal du capitaine') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Aller droit à NOVA-0') RETURNING id INTO v_choice;

  -- s055b
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055b';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055c';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Le débrancher — le libérer') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055d';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Refuser — il est un piège') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Revenir à l''épave') RETURNING id INTO v_choice;

  -- s055c
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055c';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s056';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Lire son journal dernier') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Revenir sur vos pas', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s055d
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055d';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s055';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir, en titubant, à l''épave') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Laisser cette pièce pour l''instant', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s056
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s056';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s057';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Malgré l''avertissement, continuer vers NOVA-0') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s058';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Fouiller le pont des armes du Hespérus') RETURNING id INTO v_choice;

  -- s057
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s057';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Approcher NOVA-0') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Retourner au carrefour', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s058
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s058';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Mettre le cap sur NOVA-0, mieux armée') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s040';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Fermer la porte derrière vous', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s060
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s061';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Entrer par le Parc') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s062';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Entrer par le Labo') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s063';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Entrer par l''Asile') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s078';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Pénétrer par la rue du 14 juin') RETURNING id INTO v_choice;

  -- s061
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s061';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s064';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Prendre sa main') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s061b';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Accepter qu''elle vous emmène jouer') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s065';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Refuser et l''interroger') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Reculer — choisir une autre porte') RETURNING id INTO v_choice;

  -- s061b
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s061b';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s061c';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — les enfants vous font une offrande') RETURNING id INTO v_choice;

  -- s061c
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s061c';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s064';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Retrouver Céleste, mieux préparée') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Revenir prudemment', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s064
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s064';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s066';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Continuer avec Céleste') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Changer de direction', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s065
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s065';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s067';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Lui promettre d''y réfléchir et explorer') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s068';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Lui dire non, et vous battre') RETURNING id INTO v_choice;

  -- s066
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s066';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s069';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Prendre le Canon et affronter l''alarme') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s070';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Ne pas le prendre — faire confiance') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='mort_nova0';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 2, 'S''asseoir sur un banc et attendre', 'La ville est si paisible, le mardi 14 juin.') RETURNING id INTO v_choice;

  -- s069
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s069';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s071';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — s''enfuir avec le Canon vers le Cœur') RETURNING id INTO v_choice;

  -- s071
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s071';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Gagner le Cœur de NOVA-0') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Renouer avec le hub central', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s070
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s070';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller au Cœur de NOVA-0') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Prendre du recul', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s067
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s067';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir aux trois portes') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller au Cœur') RETURNING id INTO v_choice;

  -- s068
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s068';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s072';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincue — pénétrer dans le Cœur') RETURNING id INTO v_choice;

  -- s072
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s072';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Marcher vers le Cœur') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Revenir par où vous êtes venu', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s062
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s062';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s073';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Boire le Sérum de Réversion') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s074';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Prendre le poison memory pour un autre chemin') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s075';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Prendre la seringue de réconciliation') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Sortir — autre porte') RETURNING id INTO v_choice;

  -- s073
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s073';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Marcher vers le Cœur à pied') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Faire halte ailleurs', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s074
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s074';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Filer par le tunnel vers le Cœur') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Revenir sur vos pas', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s075
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s075';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller au Cœur') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Laisser cette pièce pour l''instant', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s063
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s063';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s076';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Prendre la Cellule et le Voile') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s077';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Refuser — il est un piège') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Reculer') RETURNING id INTO v_choice;

  -- s076
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s076';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Aller au Cœur avec le Voile') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Retourner au carrefour', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s077
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s077';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Revenir aux trois portes') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Aller quand même au Cœur') RETURNING id INTO v_choice;

  -- s078
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s078';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s079';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Le suivre — en confiance') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s078b';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Le combattre — refuser le guide') RETURNING id INTO v_choice;

  -- s078b
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s078b';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s079';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — trouver seul le chemin du Cœur') RETURNING id INTO v_choice;

  -- s079
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s079';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Prendre l''ascenseur pour le Cœur') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Revenir aux trois portes') RETURNING id INTO v_choice;

  -- s080
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s090';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Voie de la Force — canon et cellules') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s100';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Voie de l''Empathie — parler au Cœur') RETURNING id INTO v_choice;
  SELECT id INTO v_item FROM public.items WHERE slug='organe-traduction' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s110';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Voie du Sacrifice — devenir le cœur') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s060';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Revenir explorer la sphère') RETURNING id INTO v_choice;

  -- s090
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s090';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s091';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — détruire NOVA-0') RETURNING id INTO v_choice;

  -- s091
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s091';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s092';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Fuir avant l''explosion') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Fermer la porte derrière vous', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s100
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s100';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s101';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Offrir le Module EVA et le Disque Noir') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Revenir au Cœur — hésiter') RETURNING id INTO v_choice;

  -- s101
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s101';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s120';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Rejoindre le point de saut') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Revenir prudemment', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s092
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s092';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s093';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Vaincu — atteindre le sas de saut') RETURNING id INTO v_choice;

  -- s093
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s093';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s120';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Rejoindre le point de saut') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Changer de direction', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s120
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s120';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s130';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Sauter — préparer la fin') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s080';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text) VALUES (v_src, v_tgt, 1, 'Renouer avec le hub central', 'Vous pourrez toujours revenir.') RETURNING id INTO v_choice;

  -- s130
  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='s130';
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_sauveur';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 0, 'Ramener NOVA-9, NOVA-7 et NOVA-0 vers la Terre') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_gardien';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 1, 'Ramener NOVA-9 seule') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_pont';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 2, 'Fusionner NOVA-7 et NOVA-9 en un seul vaisseau') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_messager';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 3, 'Rentrer seul avec les données') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_humain';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 4, 'Boire le Sérum et redevenir Kael pour de bon') RETURNING id INTO v_choice;
  SELECT id INTO v_item FROM public.items WHERE slug='serum-reversion' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_jardinier';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 5, 'Ensemencer une planète avec la Spore') RETURNING id INTO v_choice;
  SELECT id INTO v_item FROM public.items WHERE slug='spore-eveil' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_veilleur';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 6, 'Rester garder la Cicatrice') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_fuite_lache';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 7, 'Fuir sans rien ni personne') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_nova7_seule';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 8, 'Laisser NOVA-7 prendre la relève') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_oubli';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 9, 'Faire sauter les disques — tout oublier') RETURNING id INTO v_choice;
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_exode';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 10, 'Ouvrir la porte et partir ailleurs (Cœur + Voile + Chœur)') RETURNING id INTO v_choice;
  SELECT id INTO v_item FROM public.items WHERE slug='coeur-cicatrice' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_item FROM public.items WHERE slug='voile-andromede' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_item FROM public.items WHERE slug='choeur-10001' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='fin_singularite';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text) VALUES (v_src, v_tgt, 11, 'Devenir KAIROS lui-même') RETURNING id INTO v_choice;
  SELECT id INTO v_item FROM public.items WHERE slug='disque-noir-s2' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_item FROM public.items WHERE slug='disque-blanc' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_item FROM public.items WHERE slug='blindage-quantique' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_item FROM public.items WHERE slug='canon-singularite' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_item FROM public.items WHERE slug='voile-andromede' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_item FROM public.items WHERE slug='spore-eveil' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);
  SELECT id INTO v_item FROM public.items WHERE slug='choeur-10001' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);

END $$;
