-- ================================================================
-- HeroBook - Migration 006 : Les Maîtres des Ténèbres
-- ---------------------------------------------------------------
-- Aventure originale de type livre-jeu, inspirée de l'arc narratif
-- de Flight from the Dark / Les Maîtres des Ténèbres. Aucun texte
-- d'une traduction publiée n'est reproduit ici. Hommage à Joe Dever.
-- ================================================================

INSERT INTO public.stories (
  slug, title, tagline, description, author_note, genre, status,
  is_free, price_gems, price_usd, estimated_playtime_min, min_age,
  difficulty, tags, published_at
) VALUES (
  'les-maitres-des-tenebres',
  'Les Maîtres des Ténèbres',
  'Le dernier Kai doit atteindre Holmgard avant l''armée noire.',
  'Le monastère Kaï est tombé sous l''assaut des Maîtres des Ténèbres. Seul survivant, vous devez traverser Sommerlund, déjouer les Giaks et leurs Kraan, puis prévenir le roi de Holmgard avant que l''invasion ne referme ses griffes. Une aventure originale longue, à embranchements, où chaque détour laisse une trace.',
  'Aventure originale HeroBook inspirée de l''esprit de Flight from the Dark / Les Maîtres des Ténèbres de Joe Dever. Le texte de cette adaptation est inédit et ne reproduit pas la traduction française d''une édition commerciale.',
  'adventure', 'published', TRUE, NULL, NULL, 75, 12, 4,
  ARRAY['livre-jeu', 'kai', 'sommerlund', 'holmgard', 'giaks', 'kraan', 'survie'], NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  author_note = EXCLUDED.author_note,
  genre = EXCLUDED.genre,
  status = EXCLUDED.status,
  is_free = EXCLUDED.is_free,
  price_gems = EXCLUDED.price_gems,
  price_usd = EXCLUDED.price_usd,
  estimated_playtime_min = EXCLUDED.estimated_playtime_min,
  min_age = EXCLUDED.min_age,
  difficulty = EXCLUDED.difficulty,
  tags = EXCLUDED.tags,
  published_at = EXCLUDED.published_at;

DO $$
DECLARE
  v_story_id UUID;
  v_choice_id UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'les-maitres-des-tenebres';

  -- Objets de survie liés à l'aventure. Ils restent lisibles dans la sacoche
  -- et peuvent aussi être obtenus dans la boutique pour tester le système.
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('epee-kai', 'Épée courte des Kai', 'Une lame sobre, équilibrée pour les chemins étroits. Elle rappelle que survivre est aussi une discipline.', 'weapon', 'rare', '{"strength": 1}'::jsonb, FALSE, FALSE, 40, TRUE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, item_type = EXCLUDED.item_type,
    rarity = EXCLUDED.rarity, stat_bonus = EXCLUDED.stat_bonus, is_consumable = EXCLUDED.is_consumable,
    is_stackable = EXCLUDED.is_stackable, price_gems = EXCLUDED.price_gems, is_available = TRUE,
    story_id = EXCLUDED.story_id;

  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('manteau-voyage', 'Manteau de voyage de Sommerlund', 'Une cape épaisse offerte par les habitants d''un village. Elle protège du froid et des longues marches.', 'armor', 'uncommon', '{"hp_max": 2}'::jsonb, FALSE, FALSE, 35, TRUE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, item_type = EXCLUDED.item_type,
    rarity = EXCLUDED.rarity, stat_bonus = EXCLUDED.stat_bonus, is_consumable = EXCLUDED.is_consumable,
    is_stackable = EXCLUDED.is_stackable, price_gems = EXCLUDED.price_gems, is_available = TRUE,
    story_id = EXCLUDED.story_id;

  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('baume-kai', 'Baume de soin Kai', 'Un onguent de voyage qui rend jusqu''à cinq points de vie lorsqu''il est utilisé dans la sacoche.', 'potion', 'uncommon', '{"hp": 5}'::jsonb, TRUE, TRUE, 15, TRUE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, item_type = EXCLUDED.item_type,
    rarity = EXCLUDED.rarity, stat_bonus = EXCLUDED.stat_bonus, is_consumable = EXCLUDED.is_consumable,
    is_stackable = EXCLUDED.is_stackable, price_gems = EXCLUDED.price_gems, is_available = TRUE,
    story_id = EXCLUDED.story_id;

  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('ration-sommelun', 'Ration de Sommerlund', 'Pain sec, fruits et sel. Peu élégant, mais précieux quand une route se ferme.', 'artifact', 'common', '{}'::jsonb, FALSE, TRUE, 5, TRUE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, item_type = EXCLUDED.item_type,
    rarity = EXCLUDED.rarity, stat_bonus = EXCLUDED.stat_bonus, is_consumable = EXCLUDED.is_consumable,
    is_stackable = EXCLUDED.is_stackable, price_gems = EXCLUDED.price_gems, is_available = TRUE,
    story_id = EXCLUDED.story_id;

  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('carte-chemins-noirs', 'Carte des chemins noirs', 'Une carte incomplète des anciennes routes de Sommerlund. Ses repères rendent l''itinéraire moins incertain.', 'artifact', 'rare', '{"luck": 1}'::jsonb, FALSE, FALSE, 25, TRUE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, item_type = EXCLUDED.item_type,
    rarity = EXCLUDED.rarity, stat_bonus = EXCLUDED.stat_bonus, is_consumable = EXCLUDED.is_consumable,
    is_stackable = EXCLUDED.is_stackable, price_gems = EXCLUDED.price_gems, is_available = TRUE,
    story_id = EXCLUDED.story_id;

  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('sceau-royaume', 'Sceau de la garnison royale', 'Un fragment de métal portant un ancien emblème de Sommerlund. Il transforme un récit en preuve officielle.', 'artifact', 'epic', '{}'::jsonb, FALSE, FALSE, 50, TRUE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, item_type = EXCLUDED.item_type,
    rarity = EXCLUDED.rarity, stat_bonus = EXCLUDED.stat_bonus, is_consumable = EXCLUDED.is_consumable,
    is_stackable = EXCLUDED.is_stackable, price_gems = EXCLUDED.price_gems, is_available = TRUE,
    story_id = EXCLUDED.story_id;

  -- Cette migration est un seed versionné. Le nettoyage permet de la rejouer
  -- sur une base de test vierge avant toute progression utilisateur.
  DELETE FROM public.story_nodes WHERE story_id = v_story_id;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'monastere_cendres', 'Les cendres du monastère', 'Le jour se lève sur un silence qui n''appartient pas au monde des vivants. Là où les tours du monastère Kaï découpaient autrefois le ciel, il ne reste que des murs fendus, des poutres noircies et la neige souillée par des traces de griffes. Vous êtes le dernier disciple debout.

Au-delà des collines, l''armée des Maîtres des Ténèbres marche vers le cœur de Sommerlund. Holmgard doit être prévenue avant que les routes ne se ferment. Trois directions s''offrent à vous, et chacune vous éloigne des morts que vous voudriez encore sauver.', TRUE, FALSE, NULL),
    (v_story_id, 'maitre_sanglant', 'La dernière leçon', 'Dans l''aile des maîtres, une poutre a épargné un ancien instructeur. Son souffle est court, mais son regard reste clair. Il vous reconnaît et serre votre poignet avec une force surprenante.

Il ne vous demande pas de venger le monastère. Il vous demande de courir, de gagner Holmgard et de faire comprendre au roi que l''ennemi ne vient pas pour un simple raid.', FALSE, FALSE, NULL),
    (v_story_id, 'salle_armes', 'La salle des armes', 'Les râteliers ont été renversés par le combat. Des lames sont brisées, les boucliers portent les marques d''une force qui n''est pas humaine. Parmi les débris, quelques objets ont résisté : une épée courte aux gravures sobres, une ration enveloppée de toile huilée et une carte incomplète des chemins de Sommerlund.', FALSE, FALSE, NULL),
    (v_story_id, 'crypte_souvenirs', 'Sous la pierre des anciens', 'La crypte mémorielle est froide et presque intacte. Les noms des maîtres reposent sur des plaques de schiste, éclairés par une lumière grise qui tombe d''une fissure. Vous y trouvez un herbier de voyage et un registre de sentiers oubliés.

Chaque minute passée sous terre donne aux envahisseurs le temps de resserrer leur étau.', FALSE, FALSE, NULL),
    (v_story_id, 'archives_brulees', 'Les archives en flammes', 'Les rouleaux du monastère se consument dans une pluie d''étincelles. Au milieu des cendres, une plaque de métal porte encore le sceau des Kai. Elle rappelle une ancienne voie de service qui descend sous les fondations et ressort au nord.

Dehors, les appels rauques des Giaks se rapprochent. Le temps de la contemplation est fini.', FALSE, FALSE, NULL),
    (v_story_id, 'sentier_fumee', 'La poterne noyée de fumée', 'Vous gagnez une poterne secondaire tandis que les incendies avalent les toits. Deux éclaireurs Giaks fouillent les ruines, guidés par une créature ailée qui tourne très haut dans le ciel. Leur conversation gutturale ne laisse aucun doute : ils savent qu''un survivant a échappé au massacre.', FALSE, FALSE, NULL),
    (v_story_id, 'cache_neige', 'Sous le manteau blanc', 'Vous vous aplatissez dans un creux où le vent a accumulé la neige. La patrouille passe si près que vous distinguez la rouille sur ses casques. Plus loin, une forme remue sous une couverture : un jeune novice Kaï, blessé mais vivant, vous a suivi jusqu''ici.', FALSE, FALSE, NULL),
    (v_story_id, 'dernier_message', 'Le message du novice', 'Le novice tremble de froid. Il a entendu les maîtres parler d''une colonne ennemie qui a pris la route du sud et d''un signal que les sentinelles de Holmgard attendent. Il vous confie un fragment de tissu frappé du signe Kaï.

Il n''a pas la force de vous accompagner. Son seul espoir est que vous transformiez sa dernière information en avertissement.', FALSE, FALSE, NULL),
    (v_story_id, 'combat_giak', 'La patrouille des crocs', 'Un Giak vous aperçoit au moment où vous franchissez la palissade. Le cri qu''il pousse alerte ses compagnons. Le chef porte une sacoche scellée, probablement un relevé des routes ; les autres referment déjà le cercle.

Vous n''avez pas besoin de vaincre une armée. Vous devez seulement gagner assez de temps pour disparaître.', FALSE, FALSE, NULL),
    (v_story_id, 'tunnel_ancien', 'Le tunnel sous les cendres', 'La galerie sent la terre mouillée et le fer ancien. Des marques gravées par les premiers Kai indiquent plusieurs sorties, mais une porte de pierre s''est affaissée dans le passage principal. Au loin, des pas résonnent : les assaillants fouillent maintenant les salles que vous venez de quitter.', FALSE, FALSE, NULL),
    (v_story_id, 'source_baume', 'La source des herboristes', 'Le tunnel débouche dans une petite chambre où coule une source claire. Les herboristes y conservaient des baumes de voyage, destinés aux disciples envoyés loin du monastère. Une sacoche intacte pend encore à un crochet.

Le remède ne rendra pas les morts à la vie, mais il pourrait vous permettre de franchir les routes de guerre.', FALSE, FALSE, NULL),
    (v_story_id, 'route_depart', 'Le dernier regard en arrière', 'Vous sortez enfin des ruines. Le monastère Kaï n''est plus qu''une lueur rouge derrière vous. Le vent porte une odeur de résine brûlée et, par instants, le battement sourd d''ailes immenses.

Holmgard se trouve loin au sud. Entre vous et la capitale : les forêts, les rivières, les patrouilles et une armée qui croit déjà avoir gagné.', FALSE, FALSE, NULL),
    (v_story_id, 'mort_monastere', 'Le monastère vous ensevelit', 'Vous retournez vers les tours en flammes, attiré par un appel qui pourrait être celui d''un survivant. Ce n''est qu''un leurre : une escouade ennemie surgit des décombres. La fumée vous aveugle, le plafond s''effondre et les cendres recouvrent le dernier disciple des Kai.

L''avertissement n''atteindra jamais Holmgard.', FALSE, TRUE, 'death'),
    (v_story_id, 'mort_giak', 'Sous les lances des Giaks', 'Vous choisissez l''affrontement frontal. Votre courage ne suffit pas contre la meute qui vous encercle. Une lance vous fait tomber dans la neige et le chef arrache le fragment de tissu Kaï à votre tunique.

La colonne reprend sa marche sans savoir qu''elle vient de laisser passer sa plus grande chance d''être démasquée.', FALSE, TRUE, 'death'),
    (v_story_id, 'col_du_vent', 'Le col du Vent Gris', 'Après une journée de marche, vous atteignez un col battu par les bourrasques. Au sud, la route royale dessine une cicatrice claire dans la vallée. À l''ouest, une forêt de pins noirs masque un ancien sentier. Une troisième piste, à peine visible, suit les repères de la carte vers une gorge encaissée.', FALSE, FALSE, NULL),
    (v_story_id, 'route_du_roi', 'La route royale', 'La chaussée est large, mais les traces de roues sont trop nombreuses pour être celles de simples voyageurs. Des chariots abandonnés ont été poussés sur le bas-côté. La route mène vite vers les terres habitées, à condition de ne pas être aperçu par les éclaireurs qui la surveillent.', FALSE, FALSE, NULL),
    (v_story_id, 'foret_kai', 'La forêt des pins noirs', 'Sous les branches, le vent de la plaine disparaît. Des cairns de pierres marqués d''un trait ancien jalonnent le sous-bois. Par endroits, des empreintes fraîches croisent celles de bêtes de bât. La forêt peut vous cacher, mais elle peut aussi cacher ceux qui vous cherchent.', FALSE, FALSE, NULL),
    (v_story_id, 'pont_suspendu', 'Le pont au-dessus du vide', 'Un vieux pont de cordes relie deux parois au-dessus d''un torrent gonflé par la fonte des neiges. Chaque planche se balance indépendamment des autres. Une poutre porte encore le symbole d''une ancienne garnison, preuve que le passage était autrefois entretenu.', FALSE, FALSE, NULL),
    (v_story_id, 'rive_storn', 'La rive du Storn', 'Le fleuve Storn roule une eau sombre entre des berges couvertes de roseaux. Le courant emporte des débris et, parmi eux, une caisse frappée d''un sigle de ravitaillement royal. Quelqu''un a récemment traversé ici : les traces vont vers une cabane isolée ou disparaissent sous les galets.', FALSE, FALSE, NULL),
    (v_story_id, 'cabane_sage', 'La cabane du cartographe', 'Un vieil homme vous ouvre avant même que vous frappiez. Des cartes couvrent ses murs ; il comprend votre silence et ne pose pas de question sur le monastère. Il sait que les routes ordinaires sont observées et qu''un ancien alignement de pierres peut conduire jusqu''aux plaines de l''est.', FALSE, FALSE, NULL),
    (v_story_id, 'carte_pierres', 'Les pierres qui se souviennent', 'Les pierres levées forment un arc presque invisible depuis la rivière. Lorsque la lumière les frappe, des signes apparaissent dans la mousse : une direction, une distance et le dessin d''une gorge. Le chemin est plus long, mais il évite les postes où l''armée noire rassemble ses prisonniers.', FALSE, FALSE, NULL),
    (v_story_id, 'patrouille_giak', 'Les casques dans la brume', 'Une patrouille de Giaks avance entre les arbres, menée par un officier qui tient un bâton de signal. Ils ne sont pas nombreux, mais un seul cri suffirait à attirer un Kraan. Vous devez décider si vous les laissez passer, les détournez ou tentez de leur arracher un signe d''identification.', FALSE, FALSE, NULL),
    (v_story_id, 'cache_rochers', 'Le repli des rochers', 'Vous trouvez un abri derrière une coulée de pierres. Le jour décline. Au-delà de la pente, une route rejoint un village marqué par la fumée ; plus loin, des bruits sourds annoncent un campement. Un cri d''enfant monte soudain du ravin et se brise contre les parois.', FALSE, FALSE, NULL),
    (v_story_id, 'village_cendre', 'Le village des tuiles noires', 'Le village n''est pas encore abandonné, mais chaque maison porte les traces du passage de l''armée. Les habitants parlent bas. Ils ont caché leurs réserves et redoutent autant les soldats ennemis que les recruteurs désespérés du royaume. Une grange offre un abri, si vous acceptez de ne pas attirer l''attention.', FALSE, FALSE, NULL),
    (v_story_id, 'enfant_ruines', 'Une voix sous les poutres', 'Le cri venait d''une maison effondrée. Un enfant est coincé sous une poutre, tandis qu''une femme tente de dégager les pierres à mains nues. Dans la rue, des silhouettes surveillent les maisons. Vous n''avez que quelques instants avant qu''une patrouille ne revienne.', FALSE, FALSE, NULL),
    (v_story_id, 'grange_cache', 'La grange aux charrettes', 'Une charrette renversée cache une réserve de grains et un paquet enveloppé dans une toile militaire. Les villageois vous observent par une fente de la porte. Au-dehors, les Giaks interrogent un prisonnier et cherchent quelqu''un qui aurait porté le signe des Kai.', FALSE, FALSE, NULL),
    (v_story_id, 'gorge_ombres', 'La gorge des Ombres', 'La piste étroite descend entre deux murailles de roche. L''eau y coule par filets glacés et les parois répercutent le moindre bruit. Une corniche permet de remonter vers la plaine, mais un sentier plus bas suit les empreintes d''une colonne qui transporte des cages.', FALSE, FALSE, NULL),
    (v_story_id, 'campement_nuit', 'Une nuit sans feu', 'Vous installez votre camp sous des racines tordues. La nuit est assez claire pour distinguer les patrouilles qui se déplacent au loin. Votre corps réclame du repos, votre ventre se serre et chaque branche cassée pourrait annoncer une attaque.

Au-dessus des nuages, une ombre ailée traverse parfois les étoiles.', FALSE, FALSE, NULL),
    (v_story_id, 'attaque_nuit', 'Les lames dans l''obscurité', 'Les ennemis frappent après minuit. Ils ont trouvé votre piste, mais pas votre position exacte. Des cris éclatent autour du camp ; derrière vous, des voyageurs surpris cherchent à fuir. Votre instinct vous dit de courir. Votre conscience vous rappelle pourquoi les Kai existaient.', FALSE, FALSE, NULL),
    (v_story_id, 'route_plaine', 'Vers la plaine cendreuse', 'L''aube vous retrouve au-delà des forêts. Les reliefs s''abaissent et la terre devient grise sous une fine poussière. Devant vous, la route de Holmgard traverse une vaste plaine où les armées peuvent manœuvrer sans être vues. Vous apercevez une file de chariots, puis le reflet d''ailes dans le ciel.', FALSE, FALSE, NULL),
    (v_story_id, 'mort_pont', 'Le torrent vous emporte', 'Vous vous élancez sur le pont sans attendre. Une corde cède au milieu du passage et le tablier se retourne sous vos pieds. Le torrent vous arrache à la montagne avant même que vous puissiez saisir la rive.

Les eaux du Storn emportent avec elles le dernier espoir du monastère Kaï.', FALSE, TRUE, 'death'),
    (v_story_id, 'plaine_cendreuse', 'La plaine sous les ailes', 'La plaine est striée de pistes parallèles. Les chariots que vous avez vus transportent des prisonniers vers le nord, loin de Holmgard. Plus haut, un Kraan décrit des cercles. Le détour par les marais est possible, mais il vous ferait perdre une journée précieuse.', FALSE, FALSE, NULL),
    (v_story_id, 'kraan_ciel', 'Le vol du Kraan', 'La bête ailée descend assez bas pour que vous voyiez son cavalier. Un fanion noir flotte à sa lance. Le Kraan ne vous a peut-être pas repéré, mais sa trajectoire coupe votre route. Une erreur attirerait sur vous toute la colonne.', FALSE, FALSE, NULL),
    (v_story_id, 'charrette_prisonniers', 'Les cages de la colonne', 'Vous atteignez les chariots pendant une halte. Des villageois, des éclaireurs royaux et deux soldats du sud sont enfermés derrière des barreaux de bois. Les gardes se disputent autour d''un tonneau. Le verrou de la première cage est vieux, mais l''ouverture demanderait du bruit et du courage.', FALSE, FALSE, NULL),
    (v_story_id, 'liberation_prisonniers', 'La brèche dans la colonne', 'La serrure saute. Les prisonniers se répandent derrière les chariots et la panique gagne les bêtes. Parmi eux se trouve un messager qui connaît un passage vers un fortin allié. Il peut vous guider, mais ralentira votre marche et les Giaks ne tarderont pas à comprendre ce qui s''est passé.', FALSE, FALSE, NULL),
    (v_story_id, 'convoi_giak', 'Au cœur du convoi', 'La colonne reprend sa progression. Les Giaks chantent pour couvrir le bruit des roues. Une bannière porte l''emblème d''un seigneur des Ténèbres et une carte est clouée sur la caisse du conducteur. Si vous pouviez vous en approcher, vous sauriez quelle route l''ennemi compte fermer en premier.', FALSE, FALSE, NULL),
    (v_story_id, 'camp_giak', 'Le camp aux feux verts', 'Le campement ennemi s''étend derrière une palissade basse. Des feux verdâtres éclairent les cages et les réserves. Vous distinguez un forgeron prisonnier qui travaille sur des armes étrangères. Les sentinelles changent bientôt de poste ; votre fenêtre d''action se referme.', FALSE, FALSE, NULL),
    (v_story_id, 'masque_giak', 'Le visage emprunté', 'Un masque de cuir abandonné près d''une tente vous permet de vous approcher des gardes. Il sent la sueur et la fumée, mais dans la pénombre il suffit à tromper les plus inattentifs. Un seul mot dans la mauvaise langue et l''alarme sera donnée.', FALSE, FALSE, NULL),
    (v_story_id, 'forgeron_captif', 'Le forgeron du sud', 'Le captif lève les yeux lorsque vous approchez. Il reconnaît les gravures d''une lame Kaï et comprend que vous allez vers Holmgard. Il peut renforcer votre arme ou façonner un outil simple capable d''ouvrir les vieilles grilles des fortins.', FALSE, FALSE, NULL),
    (v_story_id, 'forge_kai', 'Le fer et la mémoire', 'Le forgeron travaille sans allumer la grande forge. Chaque coup est étouffé par une couverture. Il ne peut pas vous accompagner, mais il vous offre le fruit de son savoir et vous indique une colline d''où l''on aperçoit la route du fortin allié.', FALSE, FALSE, NULL),
    (v_story_id, 'colline_guet', 'La colline du guet', 'Du sommet, vous voyez la colonne noire serpenter vers le nord et, plus à l''est, les feux faibles d''un hameau. Le fortin allié se trouve au-delà des marais. Des prisonniers libérés se cachent peut-être encore dans les ravins ; un signal bien choisi pourrait les guider, mais révélerait aussi votre position.', FALSE, FALSE, NULL),
    (v_story_id, 'signal_feu', 'Le feu entre trois pierres', 'Vous allumez un feu bref, protégé par trois pierres plates. Une première lueur répond dans les collines, puis une seconde. Les captifs ont compris. Des silhouettes se mettent en mouvement avant que la brume ne retombe. Il reste à décider si vous les escortez ou si vous profitez de la confusion pour gagner le fortin.', FALSE, FALSE, NULL),
    (v_story_id, 'marais_gris', 'Les marais gris', 'Les marais s''étendent comme une mer immobile. Des îlots d''herbe dure émergent d''une boue qui aspire les bottes. Des feux follets flottent près d''une digue romaine. Une silhouette portant un bâton surveille le passage depuis une plate-forme de bois.', FALSE, FALSE, NULL),
    (v_story_id, 'gardien_marais', 'Le gardien de la digue', 'Le gardien n''est ni Giak ni soldat. C''est un passeur des marais, méfiant envers tous ceux qui portent une arme. Il connaît les zones de fond meuble et les anciennes dalles qui conduisent au-delà de la tourbière. Il vous demande ce que vous êtes prêt à laisser derrière vous pour passer.', FALSE, FALSE, NULL),
    (v_story_id, 'digue_ancienne', 'La digue des légions', 'Les dalles romaines affleurent sous l''eau. À chaque pas, l''équilibre est incertain, mais le chemin évite le cœur des marais. Au loin, une route pavée remonte vers un hameau dont les cheminées fument encore. Le fortin allié n''est plus très loin.', FALSE, FALSE, NULL),
    (v_story_id, 'mort_marais', 'Le marais sans fond', 'Vous avancez sans écouter les signes. La vase cède jusqu''à vos genoux, puis jusqu''à votre poitrine. Les cris du gardien se perdent derrière la brume. Lorsque la nuit tombe, le marais referme son eau noire sur le dernier disciple des Kai.', FALSE, TRUE, 'death'),
    (v_story_id, 'hameau_brise', 'Le hameau brisé', 'Le hameau a été frappé avant votre arrivée. Une charrette renversée brûle encore ; près d''elle, un messager royal tente de se relever. Il porte les couleurs de Holmgard mais une flèche lui a traversé l''épaule. Ses nouvelles peuvent valoir plus qu''une journée de repos.', FALSE, FALSE, NULL),
    (v_story_id, 'messager_holmgard', 'Le messager de Holmgard', 'Le messager connaît le fortin du sud et les portes de la capitale. Il a entendu parler d''un signal attendu des Kai, mais il ignore que le monastère est tombé. Sa monture est morte ; il vous propose de porter votre parole si vous l''aidez à atteindre un relais.

Vous sentez que l''ennemi a déjà commencé à couper les communications.', FALSE, FALSE, NULL),
    (v_story_id, 'route_fortin', 'La chaussée du fortin', 'La route traverse des champs abandonnés. Au bout d''une levée de terre, des palissades alliées apparaissent, mais leurs bannières pendent sans vent. Un poste de guet brûle sur la gauche. Le fortin n''est peut-être plus sûr, pourtant il demeure le dernier endroit où un message peut changer le cours de la guerre.', FALSE, FALSE, NULL),
    (v_story_id, 'fortin_sud', 'Le fortin du Sud', 'Le fortin est silencieux. Des défenseurs se déplacent derrière les meurtrières et un corbeau tourne au-dessus de la cour. La porte principale est fermée, un tunnel d''évacuation descend vers les fossés, et une tour de guet offre une vue sur la route de Holmgard. Chaque entrée possède son propre danger.', FALSE, FALSE, NULL),
    (v_story_id, 'porte_fortin', 'Devant la herse', 'Les soldats du fortin vous tiennent en joue. Ils ne reconnaissent pas les signes Kaï et leurs visages sont tirés par la peur. Un laissez-passer volé, un récit précis ou la patience pourraient vous faire franchir la herse ; une hésitation serait interprétée comme une trahison.', FALSE, FALSE, NULL),
    (v_story_id, 'bataille_fortin', 'La herse sous l''assaut', 'Les Giaks attaquent au moment où vous atteignez la cour. Les défenseurs se battent pour chaque marche. Une herse est bloquée à mi-hauteur et une réserve de torches menace d''enflammer le rempart. Vous pouvez profiter de la mêlée, secourir les hommes ou vous laisser engloutir par le chaos.', FALSE, FALSE, NULL),
    (v_story_id, 'tunnel_fortin', 'Les conduits d''évacuation', 'Le tunnel est si étroit que vos épaules frottent la pierre. De l''eau monte depuis les fossés et des voix ennemies résonnent derrière la grille. Un outil de forgeron ouvrirait le mécanisme, mais une autre galerie mène directement vers les cellules du fortin.', FALSE, FALSE, NULL),
    (v_story_id, 'captif_fortin', 'La cellule sans fenêtre', 'Vous êtes capturé, mais les gardes ne savent pas encore qui vous êtes. Dans la cellule voisine, un officier du fortin garde une clé entre ses doigts. Il attend un moment où la relève détournera les yeux. L''air sent l''huile, la pierre humide et le sang séché.', FALSE, FALSE, NULL),
    (v_story_id, 'fuite_fortin', 'La sortie sous la tour', 'La serrure cède et la cour s''ouvre devant vous. Des chevaux paniqués frappent les portes des écuries. Au-dessus, une tour porte une lanterne qui pourrait guider les défenseurs du prochain relais. Il vous faut choisir entre la vitesse d''une monture et la discrétion d''un départ à pied.', FALSE, FALSE, NULL),
    (v_story_id, 'tour_sentinelle', 'La tour des signaux', 'Les marches de la tour sont couvertes de cendre. Depuis la plateforme, la route de Holmgard paraît interminable, mais une ligne de collines permettrait de masquer votre progression. Le fortin possède un ancien signal Kaï, inutilisé depuis des années. La cloche, elle, alerterait tout le monde — y compris l''ennemi.', FALSE, FALSE, NULL),
    (v_story_id, 'signal_kai', 'La lanterne des Kai', 'Vous trouvez dans un coffre une lanterne à verre bleu. Son motif est connu des anciennes garnisons : trois éclats, une pause, puis deux. Allumée au bon moment, elle peut faire comprendre aux sentinelles que le monastère est tombé et qu''un survivant porte l''avertissement.', FALSE, FALSE, NULL),
    (v_story_id, 'ecuries', 'Les écuries en panique', 'Les chevaux sentent la fumée et tirent sur leurs longes. Un palefrenier vous montre une monture encore sellée, mais la route sera dangereuse. Les registres du fortin brûlent dans un coffre ouvert ; ils contiennent les positions des troupes alliées et ne doivent pas tomber aux mains de l''ennemi.', FALSE, FALSE, NULL),
    (v_story_id, 'chevaux_fugitifs', 'La chevauchée sous la pluie', 'Vous quittez le fortin au moment où la pluie commence. Les sabots couvrent vos traces, mais un cavalier seul se détache facilement sur la route. À l''est, des haies offrent un itinéraire plus lent. Au loin, les tours de Holmgard commencent à se dessiner dans la brume.', FALSE, FALSE, NULL),
    (v_story_id, 'plaine_holmgard', 'Les plaines de la capitale', 'Les fermes se rapprochent et les cloches des villages sonnent sans rythme. Des familles fuient vers le sud ; elles parlent d''une armée qui avance derrière elles. Holmgard est encore debout, mais ses portes vont bientôt se fermer. Vous devez choisir entre la route la plus directe et un dernier détour par un village où l''on peut trouver un guide.', FALSE, FALSE, NULL),
    (v_story_id, 'village_dernier', 'Le dernier village', 'Il ne reste presque personne dans le village. Une famille vous offre un abri sous un plancher, tandis qu''un passeur attend près du fleuve avec une barque légère. La capitale se trouve de l''autre côté, mais la traversée de nuit est risquée. Les habitants possèdent peu de nourriture et moins encore de confiance.', FALSE, FALSE, NULL),
    (v_story_id, 'passeur', 'Le passeur du fleuve', 'Le passeur connaît les courants et les barrages de branches. Il vous demande ce que vous transportez et pourquoi vous voulez entrer à Holmgard. Votre carte, votre sceau ou votre seule parole peuvent suffire ; la mauvaise réponse vous condamnerait à prendre le large sous les yeux des guetteurs ennemis.', FALSE, FALSE, NULL),
    (v_story_id, 'passage_riviere', 'La traversée avant l''aube', 'La barque progresse dans le noir. Les tours de la capitale se reflètent par fragments dans l''eau. Un cri retentit sur la rive et une flèche frappe le plat-bord. Le passeur vous indique une corde qui mène à un débarcadère caché, mais le courant tire déjà la barque vers les rapides.', FALSE, FALSE, NULL),
    (v_story_id, 'mort_fortin', 'Le fortin tombe', 'Vous déclenchez l''alarme au mauvais moment. Les portes s''ouvrent sur l''armée noire et les défenseurs perdent leur dernière ligne. Pris entre les flammes et les lances, vous comprenez que le fortin ne sera jamais le relais espéré. Holmgard attend toujours son avertissement.', FALSE, TRUE, 'death'),
    (v_story_id, 'mort_riviere', 'La rivière sans retour', 'La barque heurte une souche et se disloque. Vous vous accrochez quelques instants au paquet de preuves, puis le courant vous entraîne sous les arches de pierre. Les lumières de Holmgard s''éloignent dans la pluie.

À l''aube, personne ne saura que le dernier Kai était si proche de la capitale.', FALSE, TRUE, 'death'),
    (v_story_id, 'porte_holmgard', 'Les portes de Holmgard', 'Les murailles de Holmgard dominent le fleuve. Des réfugiés se pressent devant la porte des voyageurs tandis que des archers surveillent la rive. Vous avez atteint la capitale, mais une porte fermée peut être aussi infranchissable qu''une montagne. Une poterne oubliée et les catacombes sous le palais offrent des solutions moins visibles.', FALSE, FALSE, NULL),
    (v_story_id, 'garde_mefiant', 'Le garde qui ne croit plus aux légendes', 'Le garde vous examine longtemps. Votre tenue est couverte de boue et de cendre ; votre histoire paraît impossible. Il réclame un signe officiel, une preuve du massacre ou un témoin. Derrière lui, un homme à la cape grise écoute avec trop d''attention.', FALSE, FALSE, NULL),
    (v_story_id, 'sceau_royaume', 'Le sceau de la garnison', 'Un ancien sceau de garnison vous permet de franchir le premier contrôle. Les gardes comprennent enfin que vous ne venez pas d''une simple patrouille. Ils veulent savoir si vous avez un message pour le roi ou si vous cherchez seulement un refuge.', FALSE, FALSE, NULL),
    (v_story_id, 'preuve_cendres', 'Les preuves du monastère', 'Vous déposez sur la table un morceau de bannière, de métal et de tissu noirci. Ces fragments ne racontent pas tout, mais leur odeur de fumée est encore celle du monastère Kaï. Le garde pâlit et appelle un officier. Dans la foule, la cape grise a disparu.', FALSE, FALSE, NULL),
    (v_story_id, 'taverne_cachette', 'L''auberge aux volets clos', 'L''aubergiste vous cache derrière un cellier. Les clients chuchotent que des espions ont été vus près du palais. Un homme demande le chemin des anciennes galeries et laisse sur le comptoir une pièce frappée d''un symbole étranger. Vous pouvez écouter, suivre une piste ou dormir — mais le temps joue contre vous.', FALSE, FALSE, NULL),
    (v_story_id, 'espion', 'La cape grise', 'L''homme quitte l''auberge sans se retourner. Il connaît les ruelles, évite les gardes et porte sous son manteau un tube à messages. S''il travaille pour l''armée noire, son rapport pourrait annoncer que le monastère a un survivant. S''il est un agent royal, le suivre pourrait vous conduire jusqu''au conseil.', FALSE, FALSE, NULL),
    (v_story_id, 'chasse_espion', 'Dans les ruelles du palais', 'La poursuite vous mène sous des arcades puis dans une cour de service. L''espion comprend qu''il est suivi. Il tire une lame fine et cherche une sortie vers les escaliers. Des soldats sont proches, mais ils n''ont pas encore compris qui est la proie.', FALSE, FALSE, NULL),
    (v_story_id, 'catacombes_holmgard', 'Les catacombes sous le palais', 'Les souterrains de Holmgard sont plus anciens que la capitale. Des marques ressemblant à celles des cairns indiquent une galerie de messagers. L''air y est frais et la pierre garde les bruits de la ville. Une porte mène vers une salle du conseil ; une autre conduit vers une sortie secrète.', FALSE, FALSE, NULL),
    (v_story_id, 'sortie_secret', 'La galerie des messagers', 'La galerie débouche derrière les salles royales. Des serviteurs passent sans vous voir. Un escalier monte vers le conseil, tandis qu''une coursive mène à une tour de signaux. Depuis cette tour, vous pourriez avertir toute la ville même si les dignitaires refusent de vous entendre.', FALSE, FALSE, NULL),
    (v_story_id, 'duel_assassin', 'La lame sous la cape', 'L''espion attaque au pied de l''escalier. Sa lame est enduite d''un poison sombre, mais son regard trahit un homme qui n''a pas prévu de combattre un disciple Kaï. La victoire ne suffira pas : il faut empêcher son message de quitter la ville.', FALSE, FALSE, NULL),
    (v_story_id, 'conseil_royal', 'La salle du conseil', 'Les conseillers parlent de frontières et de renforts lorsque vous entrez. Certains vous prennent pour un messager fou ; d''autres ont vu les mêmes signes dans les villages du nord. Au fond de la salle, le roi attend sans dire un mot. Vous n''aurez qu''une occasion de transformer votre fuite en avertissement.', FALSE, FALSE, NULL),
    (v_story_id, 'message_roi', 'La parole du dernier Kai', 'Vous racontez la chute du monastère, les bannières ennemies, les prisonniers et les routes menacées. Le nom de Zagarna tombe dans la salle comme une pierre dans l''eau. Le roi vous demande si les Maîtres des Ténèbres marchent déjà sur Sommerlund ou s''ils ne font que tester ses défenses.', FALSE, FALSE, NULL),
    (v_story_id, 'alerte_generale', 'Les cloches de l''alerte', 'Le roi vous croit. Les cloches de Holmgard sonnent et les messagers partent vers les garnisons. Les portes se ferment, les forges rallument leurs feux et les cartes sont déployées avant que l''armée noire n''atteigne la plaine.

Vous êtes le dernier des Kai, mais votre ordre n''est pas mort tant que son avertissement est entendu. La guerre ne fait que commencer — et Sommerlund a maintenant une chance.', FALSE, TRUE, 'victory'),
    (v_story_id, 'victoire_sans_preuve', 'Une vérité trop tardive', 'Vous n''avez pas les fragments attendus, seulement votre voix et la mémoire des cendres. Le conseil hésite, puis le roi reconnaît dans votre récit les signes d''une menace qu''il redoutait déjà. Les éclaireurs sont envoyés vers le nord.

Votre avertissement est moins éclatant qu''une preuve, mais il arrive avant la fermeture des routes. Holmgard se prépare.', FALSE, TRUE, 'victory'),
    (v_story_id, 'siege_holmgard', 'Le plan des murailles', 'Votre carte et les renseignements recueillis permettent au roi d''anticiper l''axe d''approche de l''armée noire. Les portes secondaires sont renforcées, les réserves déplacées et les signaux allumés sur les collines. Les Maîtres des Ténèbres trouveront une capitale éveillée au lieu d''une cité surprise.', FALSE, TRUE, 'victory'),
    (v_story_id, 'fin_veilleur', 'Le veilleur de la tour', 'Vous gagnez la tour des signaux avant le conseil. Trois éclats bleus traversent la nuit, puis deux. De proche en proche, les garnisons répondent. Même sans entendre votre récit, Holmgard comprend que le nord est tombé et que l''invasion a commencé.

Au lever du jour, vous descendez de la tour pour remettre votre parole au roi. Pour la première fois depuis l''incendie, vous n''êtes plus seul.', FALSE, TRUE, 'victory'),
    (v_story_id, 'arrivee_trop_tard', 'La ville endormie', 'Vous choisissez le repos et laissez passer les heures les plus précieuses. Lorsque vous atteignez le palais, les portes sont déjà closes et les messagers du nord ont été interceptés. Les cloches sonnent, mais elles annoncent l''armée ennemie à l''horizon, non la menace à venir.

Vous avez atteint Holmgard trop tard pour lui donner l''avantage de la surprise.', FALSE, TRUE, 'death'),
    (v_story_id, 'mort_assassin', 'Le poison des Ténèbres', 'Vous poursuivez l''espion sans appeler à l''aide. Sa lame trouve une ouverture et le poison ralentit vos mouvements. Vous parvenez à saisir son message, mais pas à franchir les dernières marches.

Le parchemin brûle dans votre main avant que la garde ne vous retrouve.', FALSE, TRUE, 'death');

  -- Les choix sont insérés après les noeuds afin de relier les embranchements
  -- par node_key sans exposer d'UUID éditorial dans le contenu.

  -- Choix 001: monastere_cendres -> maitre_sanglant
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'monastere_cendres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'maitre_sanglant'),
    0, 'Rejoindre l''aile des maîtres — Discipline de l''Esprit Kai', 'Une dernière leçon peut sauver des milliers de vies.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'discipline_esprit', TRUE);

  -- Choix 002: monastere_cendres -> salle_armes
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'monastere_cendres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'salle_armes'),
    1, 'Fouiller la salle des armes', 'Un Kai ne part jamais sans se préparer.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 003: monastere_cendres -> crypte_souvenirs
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'monastere_cendres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'crypte_souvenirs'),
    2, 'Descendre vers la crypte mémorielle', 'Les anciens ont peut-être laissé une voie de fuite.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 004: monastere_cendres -> mort_monastere
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'monastere_cendres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_monastere'),
    3, 'Rester pour chercher d''autres survivants', 'Le feu ne vous laissera pas le temps.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 005: maitre_sanglant -> archives_brulees
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'maitre_sanglant'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'archives_brulees'),
    0, 'Écouter les dernières consignes', 'Porter le message avant de porter la vengeance.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'message_kai', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', 1);

  -- Choix 006: maitre_sanglant -> sentier_fumee
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'maitre_sanglant'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sentier_fumee'),
    1, 'Porter le maître vers la poterne', 'Chaque pas vous coûte du temps et du sang.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'maitre_escorte', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);

  -- Choix 007: maitre_sanglant -> salle_armes
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'maitre_sanglant'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'salle_armes'),
    2, 'Prendre son anneau et partir', 'Le silence du maître vous suivra.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'anneau_maitre', TRUE);

  -- Choix 008: salle_armes -> archives_brulees
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'salle_armes'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'archives_brulees'),
    0, 'Choisir l''épée courte — Maîtrise des Armes Kai', 'Une arme simple, forgée pour tenir dans un passage étroit.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'epee-kai'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'discipline_maitrise', TRUE);

  -- Choix 009: salle_armes -> archives_brulees
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'salle_armes'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'archives_brulees'),
    1, 'Prendre une ration et une carte incomplète', 'La route réclame autant de mémoire que de courage.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'ration-sommelun'));
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'possede_carte', TRUE);

  -- Choix 010: salle_armes -> sentier_fumee
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'salle_armes'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sentier_fumee'),
    2, 'Partir sans s''attarder', 'Votre vitesse sera votre première armure.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'agility', 1);

  -- Choix 011: crypte_souvenirs -> source_baume
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'crypte_souvenirs'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'source_baume'),
    0, 'Ouvrir l''herbier — Science des Herbes Kai', 'Un remède pour la route vaut mieux qu''un souvenir intact.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'baume-kai'));

  -- Choix 012: crypte_souvenirs -> archives_brulees
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'crypte_souvenirs'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'archives_brulees'),
    1, 'Chercher le registre des routes', 'Les pierres connaissent des chemins que les armées ignorent.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'possede_carte', TRUE);

  -- Choix 013: crypte_souvenirs -> sentier_fumee
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'crypte_souvenirs'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sentier_fumee'),
    2, 'S''agenouiller auprès des morts puis partir', 'La mémoire vous donne du courage, pas du temps.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', 1);

  -- Choix 014: archives_brulees -> sentier_fumee
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'archives_brulees'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sentier_fumee'),
    0, 'Suivre la fumée vers la poterne nord', 'Le grand air est proche.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 015: archives_brulees -> tunnel_ancien
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'archives_brulees'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_ancien'),
    1, 'Emprunter le tunnel scellé sous les archives', 'Une voie oubliée vaut mieux qu''une porte surveillée.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'connaît_tunnel', TRUE);

  -- Choix 016: sentier_fumee -> cache_neige
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sentier_fumee'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cache_neige'),
    0, 'Observer les éclaireurs avant de bouger', 'La patience est une discipline Kaï.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_vu_eclaireurs', TRUE);

  -- Choix 017: sentier_fumee -> combat_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sentier_fumee'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_giak'),
    1, 'Frapper avant qu''ils donnent l''alerte', 'Une ouverture, une seule.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_vu_eclaireurs', TRUE);

  -- Choix 018: sentier_fumee -> tunnel_ancien
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sentier_fumee'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_ancien'),
    2, 'Traverser les flammes', 'La chaleur mord vos poumons.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -3);

  -- Choix 019: cache_neige -> dernier_message
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cache_neige'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'dernier_message'),
    0, 'Secourir le novice blessé', 'Un survivant mérite de ne pas être oublié.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'novice_secours', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 020: cache_neige -> route_depart
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cache_neige'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    1, 'Rester invisible et poursuivre seul', 'Vous ne pouvez pas sauver tout le monde.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'agility', 1);

  -- Choix 021: dernier_message -> route_depart
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'dernier_message'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    0, 'Promettre de porter l''avertissement', 'Le signe Kaï rejoindra Holmgard.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'message_kai', TRUE);

  -- Choix 022: dernier_message -> route_depart
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'dernier_message'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    1, 'Lui donner votre dernière ration', 'La faim peut attendre ; la promesse, non.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'ration-sommelun'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'novice_sauve', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', 1);

  -- Choix 023: combat_giak -> route_depart
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    0, 'Viser l''officier qui porte la carte', 'Le chef tombe, mais votre épaule saigne.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'possede_carte', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 024: combat_giak -> route_depart
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    1, 'Rompre le contact et fuir', 'Une victoire modeste vaut mieux qu''une tombe.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);

  -- Choix 025: combat_giak -> mort_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_giak'),
    2, 'Affronter toute la patrouille', 'Le courage ne remplace pas une armée.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 026: tunnel_ancien -> source_baume
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_ancien'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'source_baume'),
    0, 'Forcer la porte de pierre', 'Le mécanisme vous blesse, mais la chambre existe encore.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);

  -- Choix 027: tunnel_ancien -> route_depart
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_ancien'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    1, 'Suivre les marques de l''ancien sentier', 'Le tunnel débouche au nord du monastère.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'possede_carte', TRUE);

  -- Choix 028: tunnel_ancien -> combat_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_ancien'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combat_giak'),
    2, 'Allumer la torche dans la galerie', 'La lumière attire ceux que vous vouliez éviter.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 029: source_baume -> route_depart
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'source_baume'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    0, 'Glisser le baume dans la sacoche', 'Un peu de soin pour une longue fuite.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'baume-kai'));
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', 1);

  -- Choix 030: source_baume -> route_depart
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'source_baume'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    1, 'Prendre aussi les rations de secours', 'Vous pourrez tenir une nuit de plus.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'ration-sommelun'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'ration_secours', TRUE);

  -- Choix 031: route_depart -> col_du_vent
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'col_du_vent'),
    0, 'Quitter les ruines par le nord', 'Holmgard est encore loin.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 032: route_depart -> mort_monastere
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_monastere'),
    1, 'Revenir une dernière fois vers les tours', 'Le passé vous retient par la manche.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 033: route_depart -> col_du_vent
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_depart'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'col_du_vent'),
    2, 'Prendre le sentier bas indiqué par la carte', 'Les repères sont presque effacés.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'itineraire_noir', TRUE);

  -- Choix 034: col_du_vent -> route_du_roi
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'col_du_vent'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_du_roi'),
    0, 'Suivre la route royale', 'Rapide, mais exposée.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 035: col_du_vent -> foret_kai
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'col_du_vent'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'foret_kai'),
    1, 'Couper par la forêt de pins noirs', 'Les branches peuvent cacher un fugitif.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 036: col_du_vent -> gorge_ombres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'col_du_vent'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gorge_ombres'),
    2, 'Lire la carte et gagner la gorge', 'Un chemin plus lent peut être le plus sûr.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'itineraire_noir', TRUE);

  -- Choix 037: route_du_roi -> patrouille_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_du_roi'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'patrouille_giak'),
    0, 'Marcher au grand jour', 'La route n''appartient plus à Sommerlund.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 038: route_du_roi -> village_cendre
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_du_roi'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_cendre'),
    1, 'Se cacher parmi les convois', 'Les réfugiés vous couvriront peut-être.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'parmi_refugies', TRUE);

  -- Choix 039: foret_kai -> cabane_sage
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'foret_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cabane_sage'),
    0, 'Suivre les cairns anciens', 'Les pierres gardent une direction.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_vu_cairns', TRUE);

  -- Choix 040: foret_kai -> pont_suspendu
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'foret_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'pont_suspendu'),
    1, 'Prendre le chemin le plus court', 'Un pont de corde apparaît entre les pins.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 041: foret_kai -> rive_storn
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'foret_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'rive_storn'),
    2, 'Écouter la forêt avant d''avancer', 'Un détour peut éviter les hommes.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'agility', 1);

  -- Choix 042: pont_suspendu -> rive_storn
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'pont_suspendu'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'rive_storn'),
    0, 'Tester chaque planche', 'Le vide attend sous vos pieds.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 043: pont_suspendu -> mort_pont
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'pont_suspendu'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_pont'),
    1, 'Courir avant que le vent ne tourne', 'La vitesse n''empêche pas les cordes de vieillir.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 044: pont_suspendu -> rive_storn
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'pont_suspendu'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'rive_storn'),
    2, 'Couper les cordes derrière vous', 'La patrouille ne vous suivra pas.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'pont_coupe', TRUE);

  -- Choix 045: rive_storn -> cabane_sage
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'rive_storn'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cabane_sage'),
    0, 'Chercher un passage à gué', 'L''eau glacée ralentit vos jambes.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 046: rive_storn -> carte_pierres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'rive_storn'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_pierres'),
    1, 'Longer la rive vers l''ancien embarcadère', 'Les galets portent des marques humaines.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 047: rive_storn -> patrouille_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'rive_storn'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'patrouille_giak'),
    2, 'Suivre les empreintes de bottes', 'Vous n''êtes pas le premier à chercher un passage.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 048: cabane_sage -> carte_pierres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cabane_sage'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_pierres'),
    0, 'Entrer et demander conseil', 'Le cartographe connaît la route des pierres.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'confiance_cartographe', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', 1);

  -- Choix 049: cabane_sage -> carte_pierres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cabane_sage'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_pierres'),
    1, 'Prendre le paquet de vivres', 'Votre silence sera votre paiement.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'ration-sommelun'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'dette_cartographe', TRUE);

  -- Choix 050: cabane_sage -> gorge_ombres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cabane_sage'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gorge_ombres'),
    2, 'Contourner la cabane', 'Vous n''avez pas le temps de faire confiance.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 051: carte_pierres -> gorge_ombres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_pierres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gorge_ombres'),
    0, 'Déchiffrer les pierres levées', 'La gorge évite les postes ennemis.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'ancien_chemin', TRUE);

  -- Choix 052: carte_pierres -> patrouille_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_pierres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'patrouille_giak'),
    1, 'Allumer un feu de signal', 'Quelqu''un d''autre pourrait le voir.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'signal_imprudent', TRUE);

  -- Choix 053: carte_pierres -> village_cendre
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'carte_pierres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_cendre'),
    2, 'Suivre la sente qui descend', 'Une fumée de cheminée apparaît entre les arbres.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 054: patrouille_giak -> cache_rochers
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'patrouille_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cache_rochers'),
    0, 'Se fondre dans les buissons', 'Leurs yeux glissent sur les feuilles.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'agility', 1);

  -- Choix 055: patrouille_giak -> gorge_ombres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'patrouille_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gorge_ombres'),
    1, 'Attirer la patrouille vers les marais', 'Une pierre bien lancée peut changer une route.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'patrouille_detournee', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', -1);

  -- Choix 056: patrouille_giak -> village_cendre
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'patrouille_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_cendre'),
    2, 'Frapper le chef et prendre son laissez-passer', 'Vous aurez quelques heures avant qu''il soit reconnu.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'laissez_passer_giak', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 057: cache_rochers -> campement_nuit
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cache_rochers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'campement_nuit'),
    0, 'Attendre la nuit', 'La pierre vous protégera jusqu''au crépuscule.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 058: cache_rochers -> village_cendre
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cache_rochers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_cendre'),
    1, 'Ramper jusqu''à la route', 'Le village offre peut-être une couverture.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 059: cache_rochers -> enfant_ruines
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'cache_rochers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'enfant_ruines'),
    2, 'Suivre un cri derrière les rochers', 'Vous ne pouvez pas ignorer cette voix.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_entendu_enfant', TRUE);

  -- Choix 060: village_cendre -> enfant_ruines
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_cendre'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'enfant_ruines'),
    0, 'Aider les habitants à dégager une maison', 'Un héros se reconnaît à ce qu''il protège.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'manteau-voyage'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'aide_village', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'charisma', 1);

  -- Choix 061: village_cendre -> grange_cache
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_cendre'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'grange_cache'),
    1, 'Passer pour un voyageur ordinaire', 'Baisser les yeux et garder le silence.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 062: village_cendre -> grange_cache
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_cendre'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'grange_cache'),
    2, 'Dénoncer la présence des Giaks', 'Le village saura au moins d''où vient le danger.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'village_alerte', TRUE);

  -- Choix 063: enfant_ruines -> grange_cache
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'enfant_ruines'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'grange_cache'),
    0, 'Récupérer l''enfant sous la poutre', 'La poutre vous entaille l''épaule.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'enfant_sauve', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);

  -- Choix 064: enfant_ruines -> grange_cache
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'enfant_ruines'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'grange_cache'),
    1, 'Lui demander le chemin vers la grange', 'Vous ne pouvez pas tous les sortir.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'enfant_guide', TRUE);

  -- Choix 065: enfant_ruines -> campement_nuit
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'enfant_ruines'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'campement_nuit'),
    2, 'Poursuivre votre route', 'Les Giaks reviennent dans la rue.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', -1);

  -- Choix 066: grange_cache -> campement_nuit
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'grange_cache'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'campement_nuit'),
    0, 'Partager le pain et écouter les rumeurs', 'Le ventre plein, les mots viennent plus facilement.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'ration-sommelun'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'confiance_village', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', 1);

  -- Choix 067: grange_cache -> gorge_ombres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'grange_cache'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gorge_ombres'),
    1, 'Fouiller la charrette abandonnée', 'Un paquet militaire est coincé sous une roue.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'possede_carte', TRUE);

  -- Choix 068: grange_cache -> campement_nuit
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'grange_cache'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'campement_nuit'),
    2, 'Dormir sans allumer de feu', 'Le silence est votre meilleure couverture.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 069: gorge_ombres -> campement_nuit
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gorge_ombres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'campement_nuit'),
    0, 'Descendre dans le ravin', 'La roche vous protège des regards.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 070: gorge_ombres -> route_plaine
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gorge_ombres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_plaine'),
    1, 'Escalader la corniche', 'Vous perdez du temps, mais gagnez la hauteur.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'agility', 1);

  -- Choix 071: gorge_ombres -> route_plaine
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gorge_ombres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_plaine'),
    2, 'Suivre la piste des bêtes de somme', 'Les cages ont laissé des marques profondes.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'piste_convoi', TRUE);

  -- Choix 072: campement_nuit -> route_plaine
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'campement_nuit'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_plaine'),
    0, 'Manger une ration et dormir à l''abri', 'Le repos ne sera pas long.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'ration-sommelun'));
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', 2);

  -- Choix 073: campement_nuit -> attaque_nuit
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'campement_nuit'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'attaque_nuit'),
    1, 'Veiller jusqu''à l''aube', 'Vos yeux brûlent, mais vous entendez les pas.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'vigilant', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', 1);

  -- Choix 074: campement_nuit -> route_plaine
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'campement_nuit'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_plaine'),
    2, 'Éteindre le feu et repartir immédiatement', 'Vous marcherez avec la fatigue pour seule compagne.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 075: attaque_nuit -> route_plaine
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'attaque_nuit'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_plaine'),
    0, 'Répondre par une embuscade', 'Les rôles s''inversent dans les ténèbres.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'contre_embuscade', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'strength', 1);

  -- Choix 076: attaque_nuit -> route_plaine
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'attaque_nuit'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_plaine'),
    1, 'Fuir dans l''obscurité', 'Vous survivez, mais une lame vous atteint.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);

  -- Choix 077: attaque_nuit -> route_plaine
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'attaque_nuit'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_plaine'),
    2, 'Protéger les voyageurs endormis', 'Leur fuite fera du bruit, la vôtre aussi.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'protege_voyageurs', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'charisma', 1);

  -- Choix 078: route_plaine -> plaine_cendreuse
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_plaine'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_cendreuse'),
    0, 'Rejoindre la plaine avant le lever du soleil', 'Les bois sont derrière vous.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 079: plaine_cendreuse -> kraan_ciel
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_cendreuse'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'kraan_ciel'),
    0, 'Observer les silhouettes au loin', 'Le ciel révèle ce que la plaine dissimule.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_vu_kraan', TRUE);

  -- Choix 080: plaine_cendreuse -> charrette_prisonniers
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_cendreuse'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'charrette_prisonniers'),
    1, 'Courir vers une charrette', 'Les cages portent les couleurs du royaume.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 081: plaine_cendreuse -> marais_gris
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_cendreuse'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'marais_gris'),
    2, 'Contourner la plaine par les marais', 'Vous perdez du temps pour éviter les ailes.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 082: kraan_ciel -> charrette_prisonniers
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'kraan_ciel'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'charrette_prisonniers'),
    0, 'Se dissimuler sous les ajoncs', 'Le Kraan passe sans vous voir.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 083: kraan_ciel -> convoi_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'kraan_ciel'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'convoi_giak'),
    1, 'Lancer une pierre pour détourner son vol', 'Le cavalier descend vers le bruit.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', -1);

  -- Choix 084: kraan_ciel -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'kraan_ciel'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    2, 'Suivre l''ombre portée par le Kraan', 'Vous saurez où la colonne s''arrête.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_suivi_kraan', TRUE);

  -- Choix 085: charrette_prisonniers -> liberation_prisonniers
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'charrette_prisonniers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'liberation_prisonniers'),
    0, 'Libérer les captifs pendant l''arrêt', 'Le verrou résiste, puis cède.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'prisonniers_liberes', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 086: charrette_prisonniers -> convoi_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'charrette_prisonniers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'convoi_giak'),
    1, 'Vous cacher sous la bâche', 'Les roues vous emportent au milieu de l''ennemi.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'infiltre_convoi', TRUE);

  -- Choix 087: charrette_prisonniers -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'charrette_prisonniers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    2, 'Vous éloigner de la route', 'Le convoi n''est pas votre combat aujourd''hui.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 088: liberation_prisonniers -> convoi_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'liberation_prisonniers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'convoi_giak'),
    0, 'Mener les captifs vers les collines', 'Le messager connaît un passage sûr.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'prisonniers_liberes', TRUE);

  -- Choix 089: liberation_prisonniers -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'liberation_prisonniers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    1, 'Prendre la piste du convoi', 'La fuite des captifs vous couvre.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'prisonniers_liberes', TRUE);

  -- Choix 090: liberation_prisonniers -> convoi_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'liberation_prisonniers'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'convoi_giak'),
    2, 'Rester en arrière pour retarder les Giaks', 'Vous gagnerez du temps au prix d''une blessure.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'retarde_giaks', TRUE);

  -- Choix 091: convoi_giak -> camp_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'convoi_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'camp_giak'),
    0, 'Suivre les chariots jusqu''au camp', 'Les renseignements se trouvent derrière la palissade.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 092: convoi_giak -> masque_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'convoi_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'masque_giak'),
    1, 'Attaquer le conducteur et prendre son masque', 'La colonne ne s''arrêtera pas longtemps.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'masque_giak', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 093: convoi_giak -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'convoi_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    2, 'Vous éloigner avant d''être repéré', 'L''information attendra un autre chemin.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 094: camp_giak -> masque_giak
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'camp_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'masque_giak'),
    0, 'Observer les sentinelles et prendre un masque', 'Le cuir sent la fumée.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'masque_giak', TRUE);

  -- Choix 095: camp_giak -> forgeron_captif
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'camp_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forgeron_captif'),
    1, 'Libérer le forgeron prisonnier', 'Le bruit de la forge couvre vos pas.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'forgeron_secours', TRUE);

  -- Choix 096: camp_giak -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'camp_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    2, 'Mettre le feu aux provisions', 'La fumée vous cachera, mais elle alertera la plaine.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'provisions_brulees', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 097: masque_giak -> forgeron_captif
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'masque_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forgeron_captif'),
    0, 'Passer devant les gardes masqué', 'Un pas, puis un autre.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'masque_giak', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'infiltration_reussie', TRUE);

  -- Choix 098: masque_giak -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'masque_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    1, 'Abandonner le masque et courir', 'Le déguisement vous a donné l''avance nécessaire.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 099: masque_giak -> forgeron_captif
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'masque_giak'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forgeron_captif'),
    2, 'Chercher la bannière de l''armée noire', 'Le symbole du maître ennemi vaut un avertissement.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_vu_banniere', TRUE);

  -- Choix 100: forgeron_captif -> forge_kai
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forgeron_captif'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forge_kai'),
    0, 'Lui demander de réparer l''arme Kaï', 'Le vieux fer peut encore servir.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'epee-kai'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'arme_renforcee', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'strength', 1);

  -- Choix 101: forgeron_captif -> forge_kai
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forgeron_captif'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forge_kai'),
    1, 'Lui demander un outil pour les portes', 'Un crochet de fer sera plus discret qu''une hache.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'outil_forge', TRUE);

  -- Choix 102: forgeron_captif -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forgeron_captif'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    2, 'Le laisser et partir', 'Vous ne pouvez pas sauver chaque captif.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 103: forge_kai -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forge_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    0, 'Emporter le fer travaillé', 'Votre arme retrouve un peu de son tranchant.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'epee-kai'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'arme_renforcee', TRUE);

  -- Choix 104: forge_kai -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forge_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    1, 'Cacher la route du forgeron', 'L''ennemi ne doit pas revenir vers lui.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'forgeron_protege', TRUE);

  -- Choix 105: forge_kai -> colline_guet
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'forge_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    2, 'Fuir avant le changement de garde', 'Vous partez avec une brûlure au bras.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 106: colline_guet -> signal_feu
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'signal_feu'),
    0, 'Allumer un feu bref pour guider les captifs', 'Le signal ne doit être vu que des collines.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'prisonniers_liberes', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'signal_captifs', TRUE);

  -- Choix 107: colline_guet -> hameau_brise
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'hameau_brise'),
    1, 'Observer la route de Holmgard', 'Un messager pourrait encore circuler.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_vu_route_holmgard', TRUE);

  -- Choix 108: colline_guet -> marais_gris
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'colline_guet'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'marais_gris'),
    2, 'Rejoindre le gué des marais', 'Le fortin du Sud est de l''autre côté.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 109: signal_feu -> hameau_brise
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'signal_feu'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'hameau_brise'),
    0, 'Rester jusqu''à voir les captifs partir', 'Ils disparaissent dans la brume.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'prisonniers_saufs', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 110: signal_feu -> route_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'signal_feu'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    1, 'Partir avant le changement de vent', 'Vous avez fait ce que vous pouviez.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 111: signal_feu -> mort_marais
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'signal_feu'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_marais'),
    2, 'Répondre à une flèche enflammée', 'Le signal a attiré plus que des alliés.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 112: marais_gris -> gardien_marais
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'marais_gris'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gardien_marais'),
    0, 'Poser des pierres pour franchir la boue', 'La digue apparaît entre les roseaux.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'agility', 1);

  -- Choix 113: marais_gris -> digue_ancienne
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'marais_gris'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'digue_ancienne'),
    1, 'Suivre les feux follets', 'La lumière tremble au-dessus d''un chemin dur.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', -1);

  -- Choix 114: marais_gris -> route_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'marais_gris'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    2, 'Revenir vers la chaussée', 'Le détour vous coûtera des forces.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 115: gardien_marais -> digue_ancienne
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gardien_marais'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'digue_ancienne'),
    0, 'Épargner le gardien et demander un passage', 'Vous n''êtes pas venu conquérir le marais.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'guide_marais', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'charisma', 1);

  -- Choix 116: gardien_marais -> mort_marais
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gardien_marais'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_marais'),
    1, 'Forcer le passage', 'La boue réclame son dû.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 117: gardien_marais -> digue_ancienne
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'gardien_marais'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'digue_ancienne'),
    2, 'Offrir une ration au gardien', 'Le partage ouvre parfois une route.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'ration-sommelun'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'guide_marais', TRUE);

  -- Choix 118: digue_ancienne -> route_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'digue_ancienne'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    0, 'Marcher sur les dalles encore fermes', 'La chaussée réapparaît sous la brume.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 119: digue_ancienne -> hameau_brise
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'digue_ancienne'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'hameau_brise'),
    1, 'Descendre sous la digue', 'Un passage sec rejoint les maisons.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 120: digue_ancienne -> route_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'digue_ancienne'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    2, 'Suivre les marques de bottes', 'Elles viennent du fortin allié.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'a_suivi_piste', TRUE);

  -- Choix 121: hameau_brise -> messager_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'hameau_brise'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'messager_holmgard'),
    0, 'Aider le messager à se relever', 'Il vous donnera les nouvelles qu''il peut encore porter.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'aide_messager', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 122: hameau_brise -> messager_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'hameau_brise'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'messager_holmgard'),
    1, 'Lui demander des nouvelles de Holmgard', 'Chaque mot compte désormais.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 123: hameau_brise -> route_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'hameau_brise'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    2, 'Poursuivre seul vers le fortin', 'Vous ne pouvez pas perdre la route.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 124: messager_holmgard -> route_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'messager_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    0, 'Confier le message des Kai au messager', 'Il le répétera au premier officier.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'message_kai', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'message_transmis', TRUE);

  -- Choix 125: messager_holmgard -> route_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'messager_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    1, 'Lui laisser la mission et partir', 'Votre destination reste Holmgard.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 126: messager_holmgard -> route_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'messager_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    2, 'L''accompagner jusqu''au relais', 'Deux messagers valent mieux qu''un.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'escorte_messager', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 127: route_fortin -> fortin_sud
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'route_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fortin_sud'),
    0, 'Gagner le fortin allié', 'Dernier relais avant la capitale.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 128: fortin_sud -> porte_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fortin_sud'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_fortin'),
    0, 'Entrer par la porte principale', 'Les défenseurs doivent savoir qui arrive.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 129: fortin_sud -> tunnel_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fortin_sud'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_fortin'),
    1, 'Rejoindre un tunnel de drainage', 'La pierre sera moins méfiante que les hommes.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 130: fortin_sud -> tour_sentinelle
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fortin_sud'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tour_sentinelle'),
    2, 'Observer les bannières depuis la colline', 'La hauteur révèle la faiblesse du fortin.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 131: porte_fortin -> bataille_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'bataille_fortin'),
    0, 'Présenter le laissez-passer volé', 'Le papier tremble entre vos doigts.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'laissez_passer_giak', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'porte_ouverte', TRUE);

  -- Choix 132: porte_fortin -> captif_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'captif_fortin'),
    1, 'Dire la vérité au commandant', 'Il vous prend pour un espion.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'reconnu_danger', TRUE);

  -- Choix 133: porte_fortin -> tunnel_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_fortin'),
    2, 'Attendre la relève dans les fossés', 'La patience évite parfois une cellule.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 134: bataille_fortin -> tunnel_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'bataille_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_fortin'),
    0, 'Saisir la herse pendant la confusion', 'Le passage s''ouvre juste assez pour vous.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'herse_ouverte', TRUE);

  -- Choix 135: bataille_fortin -> tour_sentinelle
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'bataille_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tour_sentinelle'),
    1, 'Secourir les soldats du Sud', 'La cour n''est pas encore perdue.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'soldats_sauves', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);

  -- Choix 136: bataille_fortin -> captif_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'bataille_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'captif_fortin'),
    2, 'Fuir le combat', 'Le geôlier vous attend dans l''ombre.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 137: tunnel_fortin -> captif_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'captif_fortin'),
    0, 'Ramper dans les conduits', 'La galerie débouche derrière les cellules.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 138: tunnel_fortin -> fuite_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fuite_fortin'),
    1, 'Ouvrir la grille avec l''outil', 'Le crochet de fer trouve le mécanisme.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'outil_forge', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'grille_ouverte', TRUE);

  -- Choix 139: tunnel_fortin -> mort_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tunnel_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_fortin'),
    2, 'Suivre l''odeur de fumée', 'Le tunnel mène sous le dépôt de torches.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 140: captif_fortin -> fuite_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'captif_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fuite_fortin'),
    0, 'Feindre la soumission jusqu''à la relève', 'Un instant de faiblesse suffit.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'feinte_reussie', TRUE);

  -- Choix 141: captif_fortin -> mort_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'captif_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_fortin'),
    1, 'Défier le geôlier', 'La cellule est trop étroite pour ce combat.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 142: captif_fortin -> tour_sentinelle
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'captif_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tour_sentinelle'),
    2, 'Attendre un moment de faiblesse', 'La relève oublie parfois de fermer une porte.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', 1);

  -- Choix 143: fuite_fortin -> ecuries
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fuite_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ecuries'),
    0, 'Libérer les chevaux', 'La panique couvrira votre passage.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'chevaux_prets', TRUE);

  -- Choix 144: fuite_fortin -> tour_sentinelle
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fuite_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tour_sentinelle'),
    1, 'Grimper jusqu''à la tour', 'Le signal peut encore servir.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 145: fuite_fortin -> ecuries
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fuite_fortin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ecuries'),
    2, 'Franchir la poterne avec les prisonniers', 'Ils connaissent les chemins du sud.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'soldats_rejoins', TRUE);

  -- Choix 146: tour_sentinelle -> signal_kai
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tour_sentinelle'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'signal_kai'),
    0, 'Observer la route de l''est', 'Une vieille lanterne brille dans un coffre.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'route_est', TRUE);

  -- Choix 147: tour_sentinelle -> mort_fortin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tour_sentinelle'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_fortin'),
    1, 'Faire retentir la cloche d''alarme', 'Le son attire l''armée noire avant les renforts.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 148: tour_sentinelle -> ecuries
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'tour_sentinelle'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ecuries'),
    2, 'Chercher une corde vers les écuries', 'La descente sera plus rapide que l''escalier.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 149: signal_kai -> ecuries
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'signal_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ecuries'),
    0, 'Répondre au signal par le signe Kai', 'Trois éclats bleus, puis deux.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'signal_kai', TRUE);

  -- Choix 150: signal_kai -> chevaux_fugitifs
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'signal_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chevaux_fugitifs'),
    1, 'Ignorer le signal et continuer', 'Vous ne savez pas qui vous observe.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 151: signal_kai -> ecuries
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'signal_kai'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ecuries'),
    2, 'Allumer la lanterne du fortin', 'Les sentinelles comprennent qu''un avertissement est en route.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'route_sure', TRUE);

  -- Choix 152: ecuries -> chevaux_fugitifs
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ecuries'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chevaux_fugitifs'),
    0, 'Prendre un cheval sans selle', 'La vitesse réclame un prix.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'cheval', TRUE);

  -- Choix 153: ecuries -> chevaux_fugitifs
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ecuries'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chevaux_fugitifs'),
    1, 'Suivre les palefreniers vers la sortie', 'Ils connaissent une porte moins surveillée.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 154: ecuries -> chevaux_fugitifs
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'ecuries'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chevaux_fugitifs'),
    2, 'Rester à pied et brûler les registres', 'L''ennemi ne doit pas lire les positions alliées.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'registres_detruits', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'luck', 1);

  -- Choix 155: chevaux_fugitifs -> plaine_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chevaux_fugitifs'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_holmgard'),
    0, 'Galoper sur la route royale', 'Les tours de la capitale se rapprochent.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 156: chevaux_fugitifs -> village_dernier
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chevaux_fugitifs'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_dernier'),
    1, 'Laisser les montures repartir et longer les haies', 'La discrétion remplace la vitesse.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 157: chevaux_fugitifs -> plaine_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chevaux_fugitifs'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_holmgard'),
    2, 'Changer de cheval au relais', 'Vous brûlez la dernière réserve du fortin.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'monture_relais', TRUE);

  -- Choix 158: plaine_holmgard -> village_dernier
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_dernier'),
    0, 'Prendre une route secondaire', 'Un guide local connaît peut-être un passage.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 159: plaine_holmgard -> porte_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_holmgard'),
    1, 'Suivre les fumées de la capitale', 'Chaque détour coûte une heure.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 160: plaine_holmgard -> village_dernier
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'plaine_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_dernier'),
    2, 'Montrer le signe Kaï aux fermiers', 'Ils vous indiquent le fleuve.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'signe_reconnu', TRUE);

  -- Choix 161: village_dernier -> passeur
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_dernier'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passeur'),
    0, 'Accepter l''abri d''une famille', 'La confiance se paie en silence.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'abri_famille', TRUE);

  -- Choix 162: village_dernier -> passeur
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_dernier'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passeur'),
    1, 'Chercher un passeur sur le fleuve', 'La nuit tombe déjà.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 163: village_dernier -> passeur
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'village_dernier'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passeur'),
    2, 'Partager la dernière ration', 'Vous ne traverserez pas seul dans votre esprit.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'ration-sommelun'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'confiance_famille', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'charisma', 1);

  -- Choix 164: passeur -> passage_riviere
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passeur'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passage_riviere'),
    0, 'Montrer la carte des chemins noirs', 'Le passeur reconnaît le vieux tracé.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'passage_fiable', TRUE);

  -- Choix 165: passeur -> passage_riviere
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passeur'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passage_riviere'),
    1, 'Traverser de nuit sans poser de question', 'Le courant décide pour vous.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 166: passeur -> mort_riviere
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passeur'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_riviere'),
    2, 'Prendre la barque malgré le courant', 'Vous refusez d''attendre l''aube.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 167: passage_riviere -> porte_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passage_riviere'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_holmgard'),
    0, 'Tenir la corde du bac', 'La rive de Holmgard est à portée de main.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -2);

  -- Choix 168: passage_riviere -> mort_riviere
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passage_riviere'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_riviere'),
    1, 'Nager avec le paquet de preuves', 'Le fleuve n''épargne pas les messagers.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 169: passage_riviere -> porte_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'passage_riviere'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_holmgard'),
    2, 'Suivre le passeur jusqu''à l''autre rive', 'Vous abandonnez la barque aux rapides.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 170: porte_holmgard -> garde_mefiant
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'garde_mefiant'),
    0, 'Entrer par la porte des voyageurs', 'La capitale ne vous attend pas.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 171: porte_holmgard -> catacombes_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'catacombes_holmgard'),
    1, 'Chercher une poterne oubliée', 'La carte parle d''une galerie sous les murailles.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'entree_secrete', TRUE);

  -- Choix 172: porte_holmgard -> garde_mefiant
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'porte_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'garde_mefiant'),
    2, 'Faire porter un message aux gardes', 'Le signe Kaï doit franchir la herse.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'message_porte', TRUE);

  -- Choix 173: garde_mefiant -> sceau_royaume
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'garde_mefiant'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sceau_royaume'),
    0, 'Présenter la carte et les insignes Kaï', 'Les gardes reconnaissent enfin la route du nord.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'possede_carte', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'confiance_gardes', TRUE);

  -- Choix 174: garde_mefiant -> preuve_cendres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'garde_mefiant'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'preuve_cendres'),
    1, 'Raconter ce qui s''est passé', 'Votre voix porte l''odeur des flammes.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'temoignage', TRUE);

  -- Choix 175: garde_mefiant -> taverne_cachette
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'garde_mefiant'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'taverne_cachette'),
    2, 'Se glisser dans la foule', 'Le palais est plus facile à atteindre par ses marges.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 176: sceau_royaume -> preuve_cendres
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sceau_royaume'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'preuve_cendres'),
    0, 'Demander audience au conseil', 'Le sceau ouvre les portes, pas les esprits.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'audience_officielle', TRUE);

  -- Choix 177: sceau_royaume -> espion
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sceau_royaume'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'espion'),
    1, 'Retrouver les hommes qui ont pris le relais', 'Un rapport a peut-être été intercepté.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'cherche_rapport', TRUE);

  -- Choix 178: sceau_royaume -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sceau_royaume'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    2, 'Monter directement vers la salle du conseil', 'Vous n''avez plus de temps à perdre.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 179: preuve_cendres -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'preuve_cendres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    0, 'Présenter le fragment de bannière ennemie', 'Le symbole du maître noir est encore visible.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'a_vu_banniere', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'sceau-royaume'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'preuve_complete', TRUE);

  -- Choix 180: preuve_cendres -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'preuve_cendres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    1, 'Expliquer la chute du monastère', 'Votre parole devra remplacer les preuves manquantes.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'temoignage', TRUE);

  -- Choix 181: preuve_cendres -> taverne_cachette
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'preuve_cendres'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'taverne_cachette'),
    2, 'Chercher d''abord un lit et du silence', 'Une heure de repos peut sauver votre voix.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 182: taverne_cachette -> espion
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'taverne_cachette'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'espion'),
    0, 'Écouter les rumeurs près de l''âtre', 'Le tube à messages n''est peut-être pas loin.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 183: taverne_cachette -> catacombes_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'taverne_cachette'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'catacombes_holmgard'),
    1, 'Demander à l''aubergiste un chemin sûr', 'Il connaît les souterrains sous le palais.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'guide_auberge', TRUE);

  -- Choix 184: taverne_cachette -> arrivee_trop_tard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'taverne_cachette'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'arrivee_trop_tard'),
    2, 'Dormir jusqu''à l''aube', 'Vous n''aurez plus le bénéfice du doute.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 185: espion -> chasse_espion
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'espion'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chasse_espion'),
    0, 'Suivre l''homme à la cape grise', 'Il se dirige vers le palais.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'espion_suivi', TRUE);

  -- Choix 186: espion -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'espion'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    1, 'Prévenir discrètement un garde', 'Le danger est peut-être déjà dans la salle.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'alerte_espion', TRUE);

  -- Choix 187: espion -> arrivee_trop_tard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'espion'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'arrivee_trop_tard'),
    2, 'Feindre de ne rien voir', 'Le rapport quittera la ville avant vous.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 188: chasse_espion -> catacombes_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chasse_espion'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'catacombes_holmgard'),
    0, 'Le suivre dans les escaliers', 'Il cherche une sortie sous le palais.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 189: chasse_espion -> duel_assassin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chasse_espion'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'duel_assassin'),
    1, 'L''interpeller dans la cour', 'Vous lui coupez la retraite.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 190: chasse_espion -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chasse_espion'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    2, 'Attendre qu''il révèle son maître', 'Le moindre mot confirmera votre récit.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'identite_espion', TRUE);

  -- Choix 191: catacombes_holmgard -> sortie_secret
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'catacombes_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sortie_secret'),
    0, 'Suivre les marques Kaï sur la pierre', 'Elles n''ont pas été tracées par hasard.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'route_secrete', TRUE);

  -- Choix 192: catacombes_holmgard -> duel_assassin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'catacombes_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'duel_assassin'),
    1, 'Forcer la porte sous le palais', 'Une présence vous attend derrière.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 193: catacombes_holmgard -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'catacombes_holmgard'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    2, 'Remonter avant d''être pris', 'Le conseil est au-dessus de vous.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 194: sortie_secret -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sortie_secret'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    0, 'Sortir derrière la salle du conseil', 'Vous arrivez avec la pierre sous les ongles.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 195: sortie_secret -> fin_veilleur
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sortie_secret'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fin_veilleur'),
    1, 'Rejoindre la tour des signaux', 'Même un roi lent à croire entend une ville en alerte.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'signaux_allumes', TRUE);

  -- Choix 196: sortie_secret -> alerte_generale
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'sortie_secret'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'alerte_generale'),
    2, 'Avertir les gardes de la poterne', 'L''alerte se propage avant votre audience.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'alerte_portes', TRUE);

  -- Choix 197: duel_assassin -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'duel_assassin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    0, 'Désarmer l''assassin', 'Sa lame tombe avant son message.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'assassin_vaincu', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'hp_current', -1);

  -- Choix 198: duel_assassin -> mort_assassin
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'duel_assassin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'mort_assassin'),
    1, 'Poursuivre sans appeler la garde', 'Le poison vous attend au bout de la lame.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 199: duel_assassin -> conseil_royal
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'duel_assassin'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    2, 'Appeler la garde', 'Le combat s''achève dans le bruit des bottes.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'assassin_capture', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice_id, 'stat_modifier', 'charisma', 1);

  -- Choix 200: conseil_royal -> message_roi
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'message_roi'),
    0, 'Parler immédiatement au roi', 'Le récit doit précéder la peur.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;

  -- Choix 201: conseil_royal -> message_roi
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'message_roi'),
    1, 'Montrer le sceau et la carte', 'Les routes confirmeront votre parole.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_require', (SELECT id FROM public.items WHERE slug = 'carte-chemins-noirs'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'message_kai', TRUE);
  INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice_id, 'inventory_add', (SELECT id FROM public.items WHERE slug = 'sceau-royaume'));
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'preuve_complete', TRUE);

  -- Choix 202: conseil_royal -> siege_holmgard
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'conseil_royal'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'siege_holmgard'),
    2, 'Demander un plan secret pour les murailles', 'Un raccourci soutenu par les gemmes du grimoire.', TRUE, 15
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'plan_secret', TRUE);

  -- Choix 203: message_roi -> alerte_generale
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'message_roi'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'alerte_generale'),
    0, 'Décrire l''attaque et nommer Zagarna', 'Le nom du maître noir donne un visage à la menace.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'message_kai', TRUE);

  -- Choix 204: message_roi -> alerte_generale
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'message_roi'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'alerte_generale'),
    1, 'Présenter les preuves recueillies', 'La bannière, la carte et les survivants parlent pour vous.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'preuves_recitees', TRUE);

  -- Choix 205: message_roi -> victoire_sans_preuve
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  VALUES (
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'message_roi'),
    (SELECT id FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'victoire_sans_preuve'),
    2, 'Admettre que vous n''avez que votre parole', 'La vérité n''attend pas toujours un témoin.', FALSE, NULL
  ) RETURNING id INTO v_choice_id;
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_set', 'parole_seule', TRUE);

  UPDATE public.stories
     SET total_nodes = 83, total_endings = 12
   WHERE id = v_story_id;
END;
$$;

-- Les statistiques de contenu restent cohérentes même si le seed est relu.
UPDATE public.stories s
   SET total_nodes = (SELECT COUNT(*) FROM public.story_nodes n WHERE n.story_id = s.id),
       total_endings = (SELECT COUNT(*) FROM public.story_nodes n WHERE n.story_id = s.id AND n.is_ending)
 WHERE s.slug = 'les-maitres-des-tenebres';

-- Contenu éditorial : 83 noeuds, 205 choix, 12 fins.
