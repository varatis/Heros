-- ================================================================
-- HeroBook - Migration 010 : FIDÉLITÉ LIVRE - Les Maîtres des Ténèbres
-- ---------------------------------------------------------------
-- Correctifs issus de l'audit croisé PDF (350 sections) vs données.
--  1) 25 sections faussement marquées 'mort' sont dé-flaguées
--  2) ~40 renvois manquants du livre sont recréés
--  3) Les sections à Table de Hasard reçoivent de vraies règles
--     (metadata.hazard_consequences) ; les anciens « choix libres »
--     de hasard sont supprimés (conformité avec le livre)
--  4) 7 combats multi-ennemis absents sont recréés (metadata.combatants)
--  5) Fuites de combat + victoires rapides (metadata.combat)
--  6) Conditions corrigées : §105 (inversée), §334 (doublée),
--     §173 (Clé d'Argent), §231/§339 (victoire rapide)
--  7) Mort à Endurance 0 : noeud générique 'mort_epuisement'
--  8) Chaîne de jets de Hasard de la section 21 (bourbier)
-- NB : les lignes choice_history référençant les choix de hasard
--      supprimés sont retirées au préalable (contrainte FK NO ACTION).
-- ================================================================

DO $$
DECLARE
  v_story_id UUID;
  v_choice_id UUID;
  v_next_order INT;
  v_item_id UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'les-maitres-des-tenebres';
  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire les-maitres-des-tenebres absente - migration 010 ignoree';
    RETURN;
  END IF;

  -- ---------------------------------------------------------
  -- 1) Dé-flaguer les 25 fausses fins (le livre continue)
  -- ---------------------------------------------------------
  UPDATE public.story_nodes
     SET is_ending = FALSE, ending_type = NULL
   WHERE story_id = v_story_id AND node_key IN ('section_020', 'section_036', 'section_039', 'section_047', 'section_056', 'section_109', 'section_112', 'section_124', 'section_150', 'section_160', 'section_164', 'section_199', 'section_208', 'section_225', 'section_229', 'section_237', 'section_243', 'section_263', 'section_276', 'section_300', 'section_301', 'section_336', 'section_343', 'section_345', 'section_348');

  -- ---------------------------------------------------------
  -- 2) Noeuds système : mort à END 0 + chaîne de hasard du §21
  -- ---------------------------------------------------------
  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata)
  VALUES (v_story_id, 'mort_epuisement', 'Mort par blessures',
    'Vos blessures ont finalement eu raison de vous: votre Endurance est tombée à zéro. Vous vous effondrez, vaincu, et les ténèbres envahissent votre champ de vision. Votre mission s''achève ici, en même temps que votre vie.',
    FALSE, TRUE, 'death', '{"kind":"system_death","references":[],"combatants":[]}'::jsonb)
  ON CONFLICT (story_id, node_key) DO UPDATE SET
    content = EXCLUDED.content, is_ending = TRUE, ending_type = 'death', metadata = EXCLUDED.metadata;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata)
  VALUES (v_story_id, 'section_021_enlisement', 'Section 21 - Enlisement',
    'Votre cheval s''est enfoncé jusqu''au ventre dans une boue épaisse. Tirez un nouveau chiffre à la Table de Hasard: de 0 à 7, vous vous enfoncez jusqu''aux aisselles tandis que votre monture disparaît dans la vase; à 8 ou 9, vous réussissez à vous hisser sur un sol plus ferme.',
    FALSE, FALSE, NULL,
    '{"kind":"hazard_step","references":["section_021_derniere_chance","section_189"],"combatants":[],"hazard_consequences":[{"min":0,"max":7,"target_node_key":"section_021_derniere_chance","message":"Vous vous enfoncez jusqu''aux aisselles !"},{"min":8,"max":9,"target_node_key":"section_189","message":"Vous vous hissez sur un sol plus ferme."}]}'::jsonb)
  ON CONFLICT (story_id, node_key) DO UPDATE SET
    content = EXCLUDED.content, metadata = EXCLUDED.metadata;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata)
  VALUES (v_story_id, 'section_021_derniere_chance', 'Section 21 - Dernière chance',
    'Vous êtes enlisé jusqu''aux aisselles et votre cheval a disparu dans la vase. Voici votre dernière chance! Tirez un chiffre à la Table de Hasard: si vous faites 9, vous échappez au marécage; avec tout autre chiffre, il vous engloutit définitivement.',
    FALSE, FALSE, NULL,
    '{"kind":"hazard_step","references":["section_021_mort","section_312"],"combatants":[],"hazard_consequences":[{"min":0,"max":8,"target_node_key":"section_021_mort","message":"Le marécage vous engloutit..."},{"min":9,"max":9,"target_node_key":"section_312","message":"In extremis, vous échappez au marécage !"}]}'::jsonb)
  ON CONFLICT (story_id, node_key) DO UPDATE SET
    content = EXCLUDED.content, metadata = EXCLUDED.metadata;

  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata)
  VALUES (v_story_id, 'section_021_mort', 'Section 21 - Englouti',
    'Le marécage se referme sur vous et vos forces vous abandonnent. Votre mission s''achève ici, en même temps que votre vie.',
    FALSE, TRUE, 'death', '{"kind":"hazard_step","references":[],"combatants":[]}'::jsonb)
  ON CONFLICT (story_id, node_key) DO UPDATE SET
    content = EXCLUDED.content, is_ending = TRUE, ending_type = 'death', metadata = EXCLUDED.metadata;


  -- ---------------------------------------------------------
  -- 3) Règles de la Table de Hasard (metadata.hazard_consequences)
  -- ---------------------------------------------------------
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_343", "hp_delta": -2, "message": "Vous tombez dans les branches basses : -2 END."}, {"min": 5, "max": 9, "target_node_key": "section_276", "hp_delta": -1, "message": "Traversée éprouvante : -1 END."}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_002';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 2, "target_node_key": "section_108", "message": "Vous vous écrasez sur le toit d''en face !"}, {"min": 3, "max": 9, "target_node_key": "section_025", "message": "Vous atterrissez sain et sauf."}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_007';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 0, "target_node_key": "section_053"}, {"min": 1, "max": 2, "target_node_key": "section_274"}, {"min": 3, "max": 9, "target_node_key": "section_331"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_017';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_021_enlisement", "message": "Votre cheval s''enfonce dans une boue épaisse !"}, {"min": 5, "max": 9, "target_node_key": "section_189", "message": "Vous échappez au bourbier."}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_021';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_181"}, {"min": 5, "max": 9, "target_node_key": "section_145"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_022';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_140", "hp_delta": -2, "message": "Vous tombez : -2 END."}, {"min": 5, "max": 9, "target_node_key": "section_323", "message": "Vous ne tombez pas."}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_036';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_277"}, {"min": 5, "max": 9, "target_node_key": "section_338"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_044';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_339"}, {"min": 5, "max": 9, "target_node_key": "section_060"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_049';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 1, "target_node_key": "section_053"}, {"min": 2, "max": 4, "target_node_key": "section_274"}, {"min": 5, "max": 9, "target_node_key": "section_316"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_089';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 5, "target_node_key": "section_106", "message": "L''éclair vous rate et explose contre le mur."}, {"min": 6, "max": 9, "target_node_key": "section_106", "hp_delta": -4, "message": "L''éclair vous frappe dans le dos : -4 END."}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_158';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_286", "message": "Vous avez été repéré !"}, {"min": 5, "max": 9, "target_node_key": "section_010", "message": "Ils ne vous ont pas vu."}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_160';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 6, "target_node_key": "section_303", "message": "Le Kraan déchire la toile de votre Sac à Dos."}, {"min": 7, "max": 9, "target_node_key": "section_303", "hp_delta": -3, "message": "Blessé aux deux bras : -3 END."}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_188';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_181"}, {"min": 5, "max": 9, "target_node_key": "section_145"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_205';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_277"}, {"min": 5, "max": 9, "target_node_key": "section_338"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_226';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_265", "message": "Personne ne vous découvre."}, {"min": 5, "max": 9, "target_node_key": "section_072", "message": "L''un de vos ennemis vous a trouvé !"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_237';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_345"}, {"min": 5, "max": 9, "target_node_key": "section_074"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_275';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 6, "target_node_key": "section_112"}, {"min": 7, "max": 9, "target_node_key": "section_096"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_279';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 2, "target_node_key": "section_230"}, {"min": 3, "max": 6, "target_node_key": "section_190"}, {"min": 7, "max": 9, "target_node_key": "section_321"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_294';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 2, "target_node_key": "section_110"}, {"min": 3, "max": 9, "target_node_key": "section_285"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_302';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 6, "target_node_key": "section_341"}, {"min": 7, "max": 9, "target_node_key": "section_098"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_314';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"hazard_consequences": [{"min": 0, "max": 4, "target_node_key": "section_219"}, {"min": 5, "max": 9, "target_node_key": "section_317"}]}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_337';

  -- ---------------------------------------------------------
  -- 4) Combats multi-ennemis absents (metadata.combatants)
  -- ---------------------------------------------------------
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}', '[{"name": "GLOK", "combat_skill": 13, "endurance": 10}, {"name": "GLOK", "combat_skill": 12, "endurance": 10}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_112';
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}', '[{"name": "GLOK", "combat_skill": 13, "endurance": 10}, {"name": "GLOK", "combat_skill": 12, "endurance": 10}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_136';
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}', '[{"name": "GLOK", "combat_skill": 13, "endurance": 10}, {"name": "GLOK", "combat_skill": 12, "endurance": 10}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_138';
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}', '[{"name": "CHEF DES SOLDATS", "combat_skill": 15, "endurance": 22}, {"name": "SOLDAT", "combat_skill": 13, "endurance": 20}, {"name": "SOLDAT", "combat_skill": 12, "endurance": 20}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_180';
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}', '[{"name": "LOUP MAUDIT", "combat_skill": 13, "endurance": 24}, {"name": "LOUP MAUDIT", "combat_skill": 14, "endurance": 23}, {"name": "LOUP MAUDIT", "combat_skill": 14, "endurance": 22}, {"name": "LOUP MAUDIT", "combat_skill": 15, "endurance": 21}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_253';
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}', '[{"name": "GLOK", "combat_skill": 11, "endurance": 18}, {"name": "GLOK", "combat_skill": 12, "endurance": 17}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_260';
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}', '[{"name": "GLOK", "combat_skill": 14, "endurance": 11}, {"name": "GLOK", "combat_skill": 13, "endurance": 11}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_336';

  -- ---------------------------------------------------------
  -- 5) Fuites de combat et victoires rapides (metadata.combat)
  -- ---------------------------------------------------------
  UPDATE public.story_nodes
     SET metadata = metadata || '{"combat": {"flee": {"target_node_key": "section_023", "min_rounds": 1}}}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_169';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"combat": {"flee": {"target_node_key": "section_022", "min_rounds": 0}}}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_180';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"combat": {"flee": {"target_node_key": "section_234", "min_rounds": 0}}}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_191';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"combat": {"flee": {"target_node_key": "section_234", "min_rounds": 0}}}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_220';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"combat": {"flee": {"target_node_key": "section_007", "min_rounds": 2}, "victory_rules": {"max_rounds": 4, "flag_key": "combat_rapide_231"}}}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_231';
  UPDATE public.story_nodes
     SET metadata = metadata || '{"combat": {"flee": {"target_node_key": "section_007", "min_rounds": 0}, "victory_rules": {"max_rounds": 4, "flag_key": "combat_rapide_339"}}}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_339';


  -- ---------------------------------------------------------
  -- 6) Suppression des « choix libres » remplacés par le Hasard
  --    (history nettoyé d'abord : FK choice_history NO ACTION)
  -- ---------------------------------------------------------
  DELETE FROM public.choice_history
   WHERE choice_id IN (
     SELECT c.id FROM public.story_choices c
     JOIN public.story_nodes sn ON sn.id = c.node_id
     JOIN public.story_nodes tn ON tn.id = c.target_node_id
     WHERE sn.story_id = v_story_id
       AND (sn.node_key, tn.node_key) IN (('section_002', 'section_343'), ('section_002', 'section_276'), ('section_007', 'section_108'), ('section_007', 'section_025'), ('section_017', 'section_053'), ('section_017', 'section_274'), ('section_017', 'section_331'), ('section_021', 'section_312'), ('section_022', 'section_181'), ('section_022', 'section_145'), ('section_044', 'section_277'), ('section_044', 'section_338'), ('section_049', 'section_339'), ('section_049', 'section_060'), ('section_089', 'section_053'), ('section_089', 'section_274'), ('section_089', 'section_316'), ('section_158', 'section_106'), ('section_188', 'section_303'), ('section_205', 'section_181'), ('section_205', 'section_145'), ('section_226', 'section_277'), ('section_226', 'section_338'), ('section_275', 'section_345'), ('section_275', 'section_074'), ('section_279', 'section_112'), ('section_279', 'section_096'), ('section_294', 'section_230'), ('section_294', 'section_190'), ('section_294', 'section_321'), ('section_302', 'section_110'), ('section_302', 'section_285'), ('section_314', 'section_341'), ('section_314', 'section_098'), ('section_337', 'section_219'), ('section_337', 'section_317')));
  DELETE FROM public.story_choices c
   USING public.story_nodes sn, public.story_nodes tn
   WHERE c.node_id = sn.id AND c.target_node_id = tn.id
     AND sn.story_id = v_story_id
     AND (sn.node_key, tn.node_key) IN (('section_002', 'section_343'), ('section_002', 'section_276'), ('section_007', 'section_108'), ('section_007', 'section_025'), ('section_017', 'section_053'), ('section_017', 'section_274'), ('section_017', 'section_331'), ('section_021', 'section_312'), ('section_022', 'section_181'), ('section_022', 'section_145'), ('section_044', 'section_277'), ('section_044', 'section_338'), ('section_049', 'section_339'), ('section_049', 'section_060'), ('section_089', 'section_053'), ('section_089', 'section_274'), ('section_089', 'section_316'), ('section_158', 'section_106'), ('section_188', 'section_303'), ('section_205', 'section_181'), ('section_205', 'section_145'), ('section_226', 'section_277'), ('section_226', 'section_338'), ('section_275', 'section_345'), ('section_275', 'section_074'), ('section_279', 'section_112'), ('section_279', 'section_096'), ('section_294', 'section_230'), ('section_294', 'section_190'), ('section_294', 'section_321'), ('section_302', 'section_110'), ('section_302', 'section_285'), ('section_314', 'section_341'), ('section_314', 'section_098'), ('section_337', 'section_219'), ('section_337', 'section_317'));


  -- ---------------------------------------------------------
  -- 7) Corrections de conditions sur choix existants
  -- ---------------------------------------------------------
  DELETE FROM public.choice_effects ce
   USING public.story_choices c, public.story_nodes sn, public.story_nodes tn
   WHERE ce.choice_id = c.id AND c.node_id = sn.id AND c.target_node_id = tn.id
     AND sn.story_id = v_story_id
     AND sn.node_key = 'section_105' AND tn.node_key = 'section_335'
     AND ce.effect_type = 'flag_require' AND ce.flag_key = 'discipline_communication_animale';
  DELETE FROM public.choice_effects ce
   USING public.story_choices c, public.story_nodes sn, public.story_nodes tn
   WHERE ce.choice_id = c.id AND c.node_id = sn.id AND c.target_node_id = tn.id
     AND sn.story_id = v_story_id
     AND sn.node_key = 'section_334' AND tn.node_key = 'section_048'
     AND ce.effect_type = 'flag_require' AND ce.flag_key = 'discipline_camouflage';

  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
  SELECT c.id, 'flag_require', 'combat_rapide_231', TRUE
    FROM public.story_choices c
    JOIN public.story_nodes sn ON sn.id = c.node_id
    JOIN public.story_nodes tn ON tn.id = c.target_node_id
   WHERE sn.story_id = v_story_id
     AND sn.node_key = 'section_231' AND tn.node_key = 'section_094'
     AND NOT EXISTS (
       SELECT 1 FROM public.choice_effects ce
       WHERE ce.choice_id = c.id AND ce.effect_type = 'flag_require' AND ce.flag_key = 'combat_rapide_231');
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
  SELECT c.id, 'flag_require', 'combat_rapide_231', FALSE
    FROM public.story_choices c
    JOIN public.story_nodes sn ON sn.id = c.node_id
    JOIN public.story_nodes tn ON tn.id = c.target_node_id
   WHERE sn.story_id = v_story_id
     AND sn.node_key = 'section_231' AND tn.node_key = 'section_203'
     AND NOT EXISTS (
       SELECT 1 FROM public.choice_effects ce
       WHERE ce.choice_id = c.id AND ce.effect_type = 'flag_require' AND ce.flag_key = 'combat_rapide_231');
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
  SELECT c.id, 'flag_require', 'combat_rapide_339', TRUE
    FROM public.story_choices c
    JOIN public.story_nodes sn ON sn.id = c.node_id
    JOIN public.story_nodes tn ON tn.id = c.target_node_id
   WHERE sn.story_id = v_story_id
     AND sn.node_key = 'section_339' AND tn.node_key = 'section_094'
     AND NOT EXISTS (
       SELECT 1 FROM public.choice_effects ce
       WHERE ce.choice_id = c.id AND ce.effect_type = 'flag_require' AND ce.flag_key = 'combat_rapide_339');
  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
  SELECT c.id, 'flag_require', 'combat_rapide_339', FALSE
    FROM public.story_choices c
    JOIN public.story_nodes sn ON sn.id = c.node_id
    JOIN public.story_nodes tn ON tn.id = c.target_node_id
   WHERE sn.story_id = v_story_id
     AND sn.node_key = 'section_339' AND tn.node_key = 'section_203'
     AND NOT EXISTS (
       SELECT 1 FROM public.choice_effects ce
       WHERE ce.choice_id = c.id AND ce.effect_type = 'flag_require' AND ce.flag_key = 'combat_rapide_339');

  -- §173 : préciser le libellé de la branche « sans la Clé »
  UPDATE public.story_choices c
     SET flavor_text = 'Si vous n''avez pas la Clé d''Argent.'
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE c.node_id = sn.id AND c.target_node_id = tn.id
     AND sn.story_id = v_story_id
     AND sn.node_key = 'section_173' AND tn.node_key = 'section_259';

  -- ---------------------------------------------------------
  -- 8) Recréation des renvois manquants du livre
  -- ---------------------------------------------------------
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_019';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 272', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_019'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_272'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_019';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 119', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_019'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_119'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_020';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 272', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_020'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_272'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_039';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 228', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_039'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_228'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_047';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 136', 'Affronter les Gloks en position haute.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_047'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_136'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_047';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 322', 'Poursuivre l''escalade jusqu''au sommet.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_047'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_322'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_050';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 243', 'Éviter la bataille.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_050'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_243'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_052';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 250', 'Monter sur le tronc de l''arbre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_052'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_250'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_056';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 222', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_056'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_222'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_105';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 298', 'Condition : Communication Animale.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_105'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_298'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  IF v_choice_id IS NOT NULL THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_require', 'discipline_communication_animale', TRUE);
  END IF;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_109';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 164', 'Examiner les bouteilles.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_109'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_164'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_109';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 308', 'Inspecter l''écurie.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_109'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_308'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_112';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 33', 'Explorer la grotte plus avant (vainqueur).', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_112'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_033'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_112';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 248', 'Quitter les lieux (vainqueur).', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_112'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_248'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_119';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 38', 'Marcher le long du bord de la pente.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_119'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_038'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_124';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 211', 'Continuer à explorer le tunnel — Clé d''Argent conservée.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_124'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_211'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  IF v_choice_id IS NOT NULL THEN
    SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-argent';
    IF v_item_id IS NOT NULL THEN
      INSERT INTO public.choice_effects (choice_id, effect_type, item_id)
      VALUES (v_choice_id, 'inventory_add', v_item_id);
    END IF;
  END IF;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_124';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 106', 'Descendre le flanc de la colline — Clé d''Argent conservée.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_124'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_106'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  IF v_choice_id IS NOT NULL THEN
    SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-argent';
    IF v_item_id IS NOT NULL THEN
      INSERT INTO public.choice_effects (choice_id, effect_type, item_id)
      VALUES (v_choice_id, 'inventory_add', v_item_id);
    END IF;
  END IF;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_128';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 336', 'Attaquer les Gloks pour sauver le soldat.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_128'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_336'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_130';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 28', 'Quitter la clairière par le sud.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_130'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_028'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_148';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 320', 'Courir vous réfugier dans la forêt.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_148'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_320'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_150';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 83', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_150'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_083'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_164';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 308', 'Inspecter l''écurie.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_164'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_308'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_173';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 158', 'Condition : posséder la Clé d''Argent.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_173'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_158'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  IF v_choice_id IS NOT NULL THEN
    SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-argent';
    IF v_item_id IS NOT NULL THEN
      INSERT INTO public.choice_effects (choice_id, effect_type, item_id)
      VALUES (v_choice_id, 'inventory_require', v_item_id);
    END IF;
  END IF;
  IF v_choice_id IS NOT NULL THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value)
    VALUES (v_choice_id, 'stat_modifier', 'hp_current', -6);
  END IF;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_196';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 144', 'Quitter les lieux et retourner dans la rue.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_196'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_144'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_199';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 81', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_199'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_081'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_200';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 168', 'Condition : Camouflage — vous dissimuler sur le toit.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_200'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_168'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  IF v_choice_id IS NOT NULL THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_require', 'discipline_camouflage', TRUE);
  END IF;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_208';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 148', 'Vous réfugier dans la ferme (vainqueur).', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_208'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_148'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_208';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 320', 'Retourner dans la forêt (vainqueur).', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_208'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_320'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_210';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 37', 'Quitter les lieux et retourner au-dehors.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_210'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_037'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_225';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 187', '« N''ayez pas peur, je viens en ami. »', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_225'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_187'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_225';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 39', '« Je suis un Seigneur Kaï… »', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_225'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_039'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_229';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 125', 'Poursuivre votre chemin vers l''est.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_229'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_125'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_229';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 267', 'Fouiller le sillon de la créature.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_229'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_267'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_243';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 97', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_243'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_097'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_262';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 234', 'Éviter l''affrontement : sauter de la roulotte.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_262'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_234'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_263';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 70', 'Continuer le long du cours d''eau.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_263'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_070'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_263';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 157', 'Prendre la direction du sud.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_263'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_157'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_272';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 305', 'Vous approcher silencieusement des huttes.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_272'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_305'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_276';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 213', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_276'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_213'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_300';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 13', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_300'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_013'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_301';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 27', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_301'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_027'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_308';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 233', 'Vous lancer à la poursuite du cheval.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_308'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_233'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_334';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 73', 'Condition : Camouflage — vous cacher.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_334'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_073'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  IF v_choice_id IS NOT NULL THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_require', 'discipline_camouflage', TRUE);
  END IF;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_336';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 117', 'Libérer le soldat (vainqueur).', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_336'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_117'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_343';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 213', 'Renvoi du livre.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_343'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_213'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_345';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 272', 'Revenir sur le sentier.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_345'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_272'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_345';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 19', 'Poursuivre parmi les arbres de la forêt.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_345'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_019'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;
  SELECT COALESCE(MAX(display_order), -1) + 1 INTO v_next_order
    FROM public.story_choices c
    JOIN public.story_nodes n ON n.id = c.node_id
   WHERE n.story_id = v_story_id AND n.node_key = 'section_348';
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text, is_premium, price_gems)
  SELECT sn.id, tn.id, v_next_order, 'Rendez-vous au 95', 'Revenir sur un terrain plus ferme.', FALSE, NULL
    FROM public.story_nodes sn, public.story_nodes tn
   WHERE sn.story_id = v_story_id AND sn.node_key = 'section_348'
     AND tn.story_id = v_story_id AND tn.node_key = 'section_095'
     AND NOT EXISTS (
       SELECT 1 FROM public.story_choices c
       WHERE c.node_id = sn.id AND c.target_node_id = tn.id)
  RETURNING id INTO v_choice_id;
  v_choice_id := NULL;

  -- ---------------------------------------------------------
  -- 9) Compteurs de l'histoire
  -- ---------------------------------------------------------
  UPDATE public.stories s
     SET total_endings = (
       SELECT COUNT(*) FROM public.story_nodes n
       WHERE n.story_id = s.id AND n.is_ending)
   WHERE s.id = v_story_id;

  RAISE NOTICE 'Migration 010 appliquee sur Les Maitres des Tenebres';
END $$;
