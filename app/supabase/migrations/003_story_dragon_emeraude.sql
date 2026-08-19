-- ================================================================
-- HeroBook - Migration 003 : Histoire Épique "La Crypte du Dragon d'Émeraude"
-- ================================================================

-- 1. Insertion de la nouvelle histoire
INSERT INTO public.stories (
  slug,
  title,
  tagline,
  description,
  genre,
  status,
  is_free,
  price_gems,
  price_usd,
  estimated_playtime_min,
  difficulty,
  tags,
  published_at
)
VALUES (
  'la-crypte-du-dragon-emeraude',
  'La Crypte du Dragon d''Émeraude',
  'Pénétrez dans l''antre ancestral de Kar-Dûr…',
  'Au sommet des Monts Brumeux, les ruines d''un sanctuaire oublié abritent le légendaire Dragon d''Émeraude et l''Orbe des Arcanes. Entre énigmes runiques, gardiens de pierre et pactes anciens, survivrez-vous au sanctuaire ?',
  'fantasy',
  'published',
  TRUE,
  NULL,
  NULL,
  35,
  3,
  ARRAY['fantasy', 'dragon', 'donjon', 'magie', 'boss', 'énigmes'],
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insertion des 16 noeuds narratifs
DO $$
DECLARE
  v_story_id UUID;
  v_porte UUID;
  v_salle_runes UUID;
  v_couloir_pieges UUID;
  v_enigme_reussie UUID;
  v_enigme_echec UUID;
  v_gardien_pierre UUID;
  v_fuite_pieges UUID;
  v_antre_dragon UUID;
  v_tresor_cache UUID;
  v_combat_dragon UUID;
  v_diplomatie_dragon UUID;
  v_vol_orbe UUID;
  v_fin_heros UUID;
  v_fin_diplomate UUID;
  v_fin_mort_dragon UUID;
  v_fin_mort_piege UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'la-crypte-du-dragon-emeraude';

  -- Supprimer les anciens noeuds éventuels si rejoué
  DELETE FROM public.story_nodes WHERE story_id = v_story_id;

  -- Création des Noeuds
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'porte_entree', 'Les Portes de Kar-Dûr',
     'Le vent glacial hurle contre les remparts cyclopéens. Devant vous se dressent les doubles portes de bronze scellées par des runes luminescentes. Une inscription gravée dans la roche proclame : « Seuls les cœurs vaillants et les esprits éclairés fouleront les dalles sacrées ». Deux passages s''offrent à vous : forcer le mécanisme runique ou chercher une brèche dans les catacombes inférieures.',
     TRUE, FALSE, NULL)
  RETURNING id INTO v_porte;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'salle_runes', 'La Salle des Trois Runes',
     'Vous pénétrez dans une vaste rotonde baignée d''une lueur bleutée. Trois piliers sculptés portent des glyphes anciens représentant l''Eau, le Feu et la Foudre. Un piédestal central exige de placer la paume sur le bon symbole pour ouvrir la voie sacrée sans déclencher le souffle des gargouilles.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_salle_runes;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'couloir_pieges', 'Le Couloir des Lames',
     'L''air devient lourd et sent la rouille. Le couloir est jonché de dalles à pression et de meurtrières dissimulées dans les murs. Le moindre faux pas pourrait déclencher une pluie de carreaux d''arbalète.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_couloir_pieges;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'enigme_reussie', 'La Voie des Sages',
     'Un déclic sonore résonne. Les runes s''embrasent d''une douce clarté dorée. La porte massive s''efface dans le sol, révélant un coffre runique orné d''une gemme étincelante avant d''accéder au grand vestibule.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_enigme_reussie;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'enigme_echec', 'Le Châtiment Arcanique',
     'Une décharge d''énergie crépitante jaillit du piédestal ! Vous êtes projeté contre la paroi rocheuse. Votre armure fume et vos membres sont endoloris (-4 PV), mais le passage finit par céder.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_enigme_echec;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'gardien_pierre', 'Le Golem de Granit',
     'Un colosse de pierre aux yeux de rubis s''anime lourdement au centre de la cour d''honneur ! Ses pas font trembler le plafond voûté. Il brandit une masse gigantesque capable de broyer le roc.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_gardien_pierre;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'fuite_pieges', 'Une Échappée de Justesse',
     'Vous glissez sous une herse descendante au prix d''une coupure cuisante. Vous atterrissez dans une crypte silencieuse menant aux appartements royaux du sanctuaire.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_fuite_pieges;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'antre_dragon', 'Le Nid d''Émeraude',
     'Une chaleur étouffante vous saisit. Au cœur d''une caverne gigantesque aux piliers cristallins, enroulé sur une montagne d''or et d''artefacts, repose Vermithrax, le Dragon d''Émeraude. Ses paupières reptiliennes s''ouvrent lentement. Deux orbes dorés transpercent votre âme. « Qui ose troubler mon millénaire de veille ? » gronde sa voix tellurique.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_antre_dragon;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'tresor_cache', 'L''Alcôve des Reliques',
     'Dans une salle dérobée, vous découvrez l''Armure d''Aethelgard et une réserve de potions intactes. Vos forces sont décuplées avant le grand affrontement.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_tresor_cache;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'combat_dragon', 'Le Choc des Titans',
     'Vous tirez votre arme et défiez le dragon ! Vermithrax déploie ses ailes majestueuses et crache un geyser de flammes émeraude. Le sol se fissure sous l''intensité du combat !',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_combat_dragon;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'diplomatie_dragon', 'Le Serment d''Astralys',
     'Vous rengainez votre acier et récitez l''ancienne formule des Gardiens. Le dragon penche son immense tête écailleuse, intrigué par votre noblesse d''esprit et votre sang-froid.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_diplomatie_dragon;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'vol_orbe', 'La Tentation de l''Orbe',
     'Profitant d''un instant d''inattention, vous tentez de subtiliser l''Orbe des Arcanes niché au sommet du trésor.',
     FALSE, FALSE, NULL)
  RETURNING id INTO v_vol_orbe;

  -- Noeuds de Fin
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'fin_heros', 'Le Tueur de Dragon (Fin Héroïque)',
     'D''un coup d''estoc légendaire guidé par les dieux, vous terrassez le grand dragon ! Les trésors de Kar-Dûr sont vôtres et votre nom sera chanté dans toutes les auberges du royaume pour les siècles à venir.',
     FALSE, TRUE, 'victory')
  RETURNING id INTO v_fin_heros;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'fin_diplomate', 'Le Pacte des Anciens (Fin Secrète)',
     'Vermithrax reconnaît votre valeur et vous offre une écaille d''émeraude ainsi que l''Orbe d''Astralys. Désormais, vous êtes le Protecteur assermenté du Sanctuaire, allié au plus puissant des dragons.',
     FALSE, TRUE, 'victory')
  RETURNING id INTO v_fin_diplomate;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'fin_mort_dragon', 'Cendres et Oubli (Fin Tragique)',
     'Le souffle flamboyant de Vermithrax vous submerge. Votre quête s''achève dans les braises ardentes de Kar-Dûr.',
     FALSE, TRUE, 'death')
  RETURNING id INTO v_fin_mort_dragon;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type)
  VALUES
    (v_story_id, 'fin_mort_piege', 'Faux Pas Fatal (Fin Tragique)',
     'Le mécanisme du donjon s''est refermé sur vous sans pitié. Le silence retombe sur les catacombes de Kar-Dûr.',
     FALSE, TRUE, 'death')
  RETURNING id INTO v_fin_mort_piege;

  -- ================================================================
  -- CHOIX MULTIPLES ET EMBRANCHEMENTS
  -- ================================================================

  -- Portes d'entrée
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text)
  VALUES
    (v_porte, v_salle_runes, 0, 'Déchiffrer les runes du portail', 'La voie de la sagesse arcanique.'),
    (v_porte, v_couloir_pieges, 1, 'Emprunter les catacombes dérobées', 'La voie de la furtivité et de l''agilité.');

  -- Salle des runes
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text)
  VALUES
    (v_salle_runes, v_enigme_reussie, 0, 'Toucher la Rune de l''Eau', 'L''eau apaise et révèle la vérité.'),
    (v_salle_runes, v_enigme_echec, 1, 'Toucher la Rune du Feu', 'Le feu détruit et consume.');

  -- Couloir des pièges
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text)
  VALUES
    (v_couloir_pieges, v_tresor_cache, 0, 'Avancer pas à pas avec prudence (Test d''Agilité)', 'Observer les dalles disjointes.'),
    (v_couloir_pieges, v_fuite_pieges, 1, 'Sprinter à pleine vitesse vers la sortie', 'La chance sourit aux audacieux.');

  -- Enigme réussie / Echec -> Gardien ou Trésor
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
  VALUES
    (v_enigme_reussie, v_tresor_cache, 0, 'Explorer l''alcôve cachée'),
    (v_enigme_reussie, v_gardien_pierre, 1, 'Franchir directement la grande arche'),
    (v_enigme_echec, v_gardien_pierre, 0, 'Panser vos plaies et continuer');

  -- Fuite / Trésor -> Gardien ou Antre
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
  VALUES
    (v_tresor_cache, v_antre_dragon, 0, 'Descendre dans les profondeurs de l''antre'),
    (v_fuite_pieges, v_gardien_pierre, 0, 'Pénétrer dans la cour d''honneur');

  -- Gardien de pierre
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text)
  VALUES
    (v_gardien_pierre, v_antre_dragon, 0, 'Attaquer les jointures du golem avec force', 'Frapper au point faible.'),
    (v_gardien_pierre, v_fin_mort_piege, 1, 'Tenter de bloquer son coup de masse frontalement', 'Un choix imprudent face à 10 tonnes de granit.');

  -- Antre du Dragon
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text)
  VALUES
    (v_antre_dragon, v_combat_dragon, 0, 'Défier le Dragon en duel singulier', 'Pour la gloire et l''or !'),
    (v_antre_dragon, v_diplomatie_dragon, 1, 'Parler au Dragon avec respect et sagesse', 'La parole est parfois plus puissante que l''épée.'),
    (v_antre_dragon, v_vol_orbe, 2, 'Tenter de dérober l''Orbe en douce', 'Une audace qui frôle la folie.');

  -- Issues finales depuis l'antre
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
  VALUES
    (v_combat_dragon, v_fin_heros, 0, 'Porter le coup de grâce au Dragon'),
    (v_combat_dragon, v_fin_mort_dragon, 1, 'Hésiter un instant face aux flammes'),
    (v_diplomatie_dragon, v_fin_diplomate, 0, 'Sceller le Pacte des Anciens'),
    (v_vol_orbe, v_fin_mort_dragon, 0, 'Fuir avec l''Orbe sous le regard furieux du dragon');

  -- Mettre à jour le nombre total de noeuds et de fins
  UPDATE public.stories
  SET total_nodes = 16, total_endings = 4
  WHERE id = v_story_id;

END;
$$;
