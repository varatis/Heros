-- ================================================================
-- HeroBook - Migration 012 : FIDÉLITÉ LIVRE PASSE 2
--                        Les Maîtres des Ténèbres (Loup Solitaire 01)
-- ---------------------------------------------------------------
-- Seconde passe d'audit croisé avec le PDF officiel :
--  1) Ancres de règles d'arrivée (metadata.on_arrive) : blessures
--     narratives, repas obligatoires (-3 END ou discipline Chasse),
--     soin complet (§212), perte d'HABILETÉ permanente (§236) ;
--  2) Économie du livre : Couronnes (+28/+15/+40/+6, achats §12/§46),
--     Repas et butins distribués (§20, §62, §113, §124, §184, §291,
--     §347) ; nouvel effet 'inventory_remove' (quantité = stat_value) ;
--  3) Sac à Dos déchiré au §188 (perte du contenu du sac) ;
--  4) Règles de combat fidèles : pénalités psychiques des Vordaks
--     (§29, §34, §283, §342), immunité à la Puissance Psychique
--     (§133, §170, §255, §342), combat dans le noir sans torche
--     (§170, -3 HAB), surprise du §283 (+2 au 1er assaut), Kraan §17
--     (-1 HAB durant le combat), Vipère §227 sans blessure (flag) ;
--  5) CORRECTIFS DE VERROUS INVERSÉS (bloquaient l'aventure sans la
--     discipline/objet, à l'inverse du livre) :
--       §9→292 (exigeait la Pierre de Vordak au lieu du « sinon »),
--       §133→266 (exigeait la Puissance Psychique... insensible !),
--       §283→123 / §342→123 (exigeaient le Bouclier Psychique),
--       §255→82  (exigeait la Puissance Psychique... insensible !) ;
--  6) La Pierre Précieuse / Pierre de Vordak est enfin distribuée
--     (§76, §304) ce qui rend le §9/§236 jouable ; elle est détruite
--     au §236 comme dans le livre.
-- ================================================================

DO $$
DECLARE
  v_story_id UUID;
  v_choice_id UUID;
  v_src UUID;
  v_tgt UUID;
  v_item UUID;
  v_item2 UUID;
  v_item3 UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'les-maitres-des-tenebres';
  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire les-maitres-des-tenebres absente - migration 011 ignoree';
    RETURN;
  END IF;

  -- =========================================================
  -- 0) Objets supplémentaires du livre
  -- =========================================================
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('couronnes', 'Couronnes (Pièces d''Or)', 'Monnaie de Sommerlund. 50 pièces maximum dans la bourse.', 'artifact', 'common', '{}'::jsonb, FALSE, TRUE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, is_stackable = TRUE;

  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('laumspur', 'Laumspur', 'Herbe curative : une dose rend 3 points d''ENDURANCE.', 'potion', 'uncommon', '{"hp": 3}'::jsonb, TRUE, TRUE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, is_stackable = TRUE;

  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('sac-a-dos', 'Sac à Dos', 'Contient les Repas et les objets courants (8 emplacements).', 'artifact', 'common', '{}'::jsonb, FALSE, FALSE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description;

  -- La « Pierre Précieuse » trouvée sur les dépouilles de Vordaks est
  -- LA Pierre de Vordak attendue au §9 (même objet : cf. §236 qui la
  -- nomme des deux façons). On réutilise l'objet existant.
  UPDATE public.items
     SET description = 'Pierre Précieuse d''une valeur inestimable, récupérée sur la dépouille d''un Vordak. (Dans le livre, c''est la « Pierre de Vordak » attendue par la section 9 ; elle est détruite en 236.)'
   WHERE slug = 'pierre-vordak';

  -- =========================================================
  -- 1) VERROUS INVERSÉS : suppression des conditions aberrantes
  --    (après combat ou « sinon », elles coupaient l'aventure)
  -- =========================================================
  -- §9 : le « sinon » →292 exigeait la Pierre de Vordak (inversion)
  DELETE FROM public.choice_effects
   WHERE effect_type = 'inventory_require'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       JOIN public.story_nodes t ON t.id = c.target_node_id
       WHERE s.story_id = v_story_id AND s.node_key = 'section_009'
         AND t.node_key = 'section_292');

  -- §133 : victoire sur le Serpent Ailé exigeait la Puissance Psychique
  DELETE FROM public.choice_effects
   WHERE effect_type = 'flag_require' AND flag_key = 'discipline_puissance_psychique'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       WHERE s.story_id = v_story_id AND s.node_key = 'section_133');

  -- §283 / §342 : victoire sur le Vordak exigeait le Bouclier Psychique
  DELETE FROM public.choice_effects
   WHERE effect_type = 'flag_require' AND flag_key = 'discipline_bouclier_psychique'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       WHERE s.story_id = v_story_id AND s.node_key IN ('section_283', 'section_342'));

  -- §255 : victoire sur le Gourgaz exigeait la Puissance Psychique
  DELETE FROM public.choice_effects
   WHERE effect_type = 'flag_require' AND flag_key = 'discipline_puissance_psychique'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       WHERE s.story_id = v_story_id AND s.node_key = 'section_255');

  -- §29 → 270 / §34 → 328 : victoire sur le Vordak exigeait le Bouclier
  -- Psychique (même inversion : le livre ne pose aucune condition)
  DELETE FROM public.choice_effects
   WHERE effect_type = 'flag_require' AND flag_key = 'discipline_bouclier_psychique'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       WHERE s.story_id = v_story_id AND s.node_key IN ('section_029', 'section_034'));

  -- §88 : le « sinon » → 31 exigeait la Guérison (livre : → 216 si
  -- Guérison, → 31 sinon)
  DELETE FROM public.choice_effects
   WHERE effect_type = 'flag_require' AND flag_key = 'discipline_guerison'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       JOIN public.story_nodes t ON t.id = c.target_node_id
       WHERE s.story_id = v_story_id AND s.node_key = 'section_088'
         AND t.node_key = 'section_031');

  -- §162 : le « sinon » → 127 exigeait la Maîtrise Psychique de la Matière
  DELETE FROM public.choice_effects
   WHERE effect_type = 'flag_require' AND flag_key = 'discipline_maitrise_psychique_matiere'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       JOIN public.story_nodes t ON t.id = c.target_node_id
       WHERE s.story_id = v_story_id AND s.node_key = 'section_162'
         AND t.node_key = 'section_127');

  -- §242 : le « sinon » → 9 exigeait le Bouclier Psychique
  DELETE FROM public.choice_effects
   WHERE effect_type = 'flag_require' AND flag_key = 'discipline_bouclier_psychique'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       JOIN public.story_nodes t ON t.id = c.target_node_id
       WHERE s.story_id = v_story_id AND s.node_key = 'section_242'
         AND t.node_key = 'section_009');

  -- §303 : le « sinon » → 72 exigeait le Camouflage
  DELETE FROM public.choice_effects
   WHERE effect_type = 'flag_require' AND flag_key = 'discipline_camouflage'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       JOIN public.story_nodes t ON t.id = c.target_node_id
       WHERE s.story_id = v_story_id AND s.node_key = 'section_303'
         AND t.node_key = 'section_072');

  -- §173 : le « sinon » → 259 exigeait la Clé d'Argent (sans clé, le
  -- livre envoie mourir au 259 — mais sans condition !)
  DELETE FROM public.choice_effects
   WHERE effect_type = 'inventory_require'
     AND choice_id IN (
       SELECT c.id FROM public.story_choices c
       JOIN public.story_nodes s ON s.id = c.node_id
       JOIN public.story_nodes t ON t.id = c.target_node_id
       WHERE s.story_id = v_story_id AND s.node_key = 'section_173'
         AND t.node_key = 'section_259');

  -- =========================================================
  -- 2) Butins : or, repas, objets du livre
  --    (stat_value = quantité ; défaut 1 si NULL)
  -- =========================================================

  -- --- §20 → 272 : 2 Repas + un Poignard (le Sac à Dos, on en a déjà un)
  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_020' AND t.node_key = 'section_272';
  SELECT id INTO v_item FROM public.items WHERE slug = 'repas';
  SELECT id INTO v_item2 FROM public.items WHERE slug = 'poignard';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 2, v_item);
  END IF;
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item2) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 1, v_item2);
  END IF;

  -- --- §62 → 288 : 28 Couronnes + 3 Repas
  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_062' AND t.node_key = 'section_288';
  SELECT id INTO v_item FROM public.items WHERE slug = 'couronnes';
  SELECT id INTO v_item2 FROM public.items WHERE slug = 'repas';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 28, v_item);
  END IF;
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item2) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 3, v_item2);
  END IF;

  -- --- §113 → 347 / 295 : 2 doses de Laumspur (cueillies avant le choix)
  SELECT id INTO v_item FROM public.items WHERE slug = 'laumspur';
  FOR v_choice_id IN
    SELECT c.id FROM public.story_choices c
    JOIN public.story_nodes s ON s.id = c.node_id
    WHERE s.story_id = v_story_id AND s.node_key = 'section_113'
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item) THEN
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 2, v_item);
    END IF;
  END LOOP;

  -- --- §124 → 211 / 106 : 15 Couronnes (la Clé d'Argent est déjà gérée)
  SELECT id INTO v_item FROM public.items WHERE slug = 'couronnes';
  FOR v_choice_id IN
    SELECT c.id FROM public.story_choices c
    JOIN public.story_nodes s ON s.id = c.node_id
    WHERE s.story_id = v_story_id AND s.node_key = 'section_124'
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item) THEN
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 15, v_item);
    END IF;
  END LOOP;

  -- --- §184 : le butin (40 Couronnes + 4 Repas) est attribué À
  --     L'ARRIVÉE via metadata.on_arrive.add_items (§6 ci-dessous) :
  --     dans le livre, on fouille la roulotte PUIS on prend un Repas.

  -- --- §291 → 272 : 6 Couronnes
  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_291' AND t.node_key = 'section_272';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 6, v_item);
  END IF;

  -- --- §347 → 103 : 1 Torche + le Briquet à Amadou + le Sabre
  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_347' AND t.node_key = 'section_103';
  SELECT id INTO v_item FROM public.items WHERE slug = 'torches';
  SELECT id INTO v_item2 FROM public.items WHERE slug = 'briquet-amadou';
  SELECT id INTO v_item3 FROM public.items WHERE slug = 'sabre';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 1, v_item);
  END IF;
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item2) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 1, v_item2);
  END IF;
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item3) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 1, v_item3);
  END IF;

  -- --- §76 → 118 : la Pierre (Précieuse) de Vordak
  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_076' AND t.node_key = 'section_118';
  SELECT id INTO v_item FROM public.items WHERE slug = 'pierre-vordak';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 1, v_item);
  END IF;

  -- --- §304 → 2 : la grosse Pierre Précieuse de Vordak
  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_304' AND t.node_key = 'section_002';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_add' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_add', 1, v_item);
  END IF;

  -- =========================================================
  -- 3) Achats en Couronnes
  -- =========================================================

  -- --- §12 → 262 : payer 10 Couronnes au marchand (l'or est pris)
  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_012' AND t.node_key = 'section_262';
  SELECT id INTO v_item FROM public.items WHERE slug = 'couronnes';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_require' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_require', 10, v_item);
  END IF;
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_remove' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_remove', 10, v_item);
  END IF;

  -- --- §46 → 246 : payer 2 Couronnes au passeur du lac
  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_046' AND t.node_key = 'section_246';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_require' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_require', 2, v_item);
  END IF;
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'inventory_remove' AND item_id = v_item) THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id) VALUES (v_choice_id, 'inventory_remove', 2, v_item);
  END IF;

  -- =========================================================
  -- 4) Vipère §227 : « sans perdre aucun point d'ENDURANCE »
  --    flag posé par le moteur de combat, conditions :
  --      → 348 si victoire sans blessure, → 271 sinon.
  -- =========================================================
  UPDATE public.story_nodes
     SET metadata = metadata || '{"combat":{"flag_flawless":"combat_sans_degats_227"}}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_227';

  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_227' AND t.node_key = 'section_348';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'flag_require' AND flag_key = 'combat_sans_degats_227') THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'combat_sans_degats_227', TRUE);
  END IF;

  SELECT c.id INTO v_choice_id FROM public.story_choices c
  JOIN public.story_nodes s ON s.id = c.node_id
  JOIN public.story_nodes t ON t.id = c.target_node_id
  WHERE s.story_id = v_story_id AND s.node_key = 'section_227' AND t.node_key = 'section_271';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.choice_effects WHERE choice_id = v_choice_id AND effect_type = 'flag_require' AND flag_key = 'combat_sans_degats_227') THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice_id, 'flag_require', 'combat_sans_degats_227', FALSE);
  END IF;

  -- =========================================================
  -- 5) Règles d'arrivée (metadata.on_arrive) - blessures du livre
  -- =========================================================
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-2,"message":"La Pierre brûlante vous coûte 2 points d''ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_076';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-2,"message":"Les plaies des Brosses à Potence vous coûtent 2 points d''ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_119';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-2,"message":"Le choc contre la porte cochère vous coûte 2 points d''ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_144';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-3,"message":"La flèche qui vous écorche le front vous coûte 3 points d''ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_146';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-4,"message":"Le calvaire mental vous coûte 4 points d''ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_166';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-10,"message":"La charge explosive du Sage vous coûte 10 points d''ENDURANCE !"}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_203';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-6,"skill_delta":-1,"remove_items":["pierre-vordak"],"message":"L''explosion détruit la Pierre de Vordak : -6 END et -1 HABILETÉ de façon permanente."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_236';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-1,"message":"Votre jambe meurtrie vous coûte 1 point d''ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_276';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-2,"message":"La Pierre brûlante vous coûte 2 points d''ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_304';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-1,"message":"Le cheval affolé vous projette à terre : -1 END."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_308';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-1,"message":"Écorchures et contusions : -1 END."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_313';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-2,"message":"Vous pénétrez dans la forêt avec 2 points d''ENDURANCE en moins."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_320';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_delta":-2,"message":"Votre bras écorché vous coûte 2 points d''ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_343';
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"hp_to_max":true,"message":"Vous récupérez la totalité de votre ENDURANCE."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_212';
  -- §162 : capturé par les Drakkarims — ils prennent Sac à Dos et Armes
  -- (non restitués, cf. §258), mais pas les Pièces d''Or.
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"lose_backpack":true,"lose_weapons":true,"message":"Les Drakkarims vous prennent votre Sac à Dos et vos Armes (mais pas vos Pièces d''Or)."}}'::jsonb WHERE story_id = v_story_id AND node_key = 'section_162';

  -- =========================================================
  -- 6) Repas obligatoires (-3 END si rien à manger, sauf Chasse)
  --    §184 : le butin de la roulotte précède le repas (livre).
  -- =========================================================
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"meal_required":true}}'::jsonb
   WHERE story_id = v_story_id AND node_key IN ('section_037', 'section_130', 'section_147', 'section_168', 'section_235', 'section_300');
  UPDATE public.story_nodes SET metadata = metadata || '{"on_arrive":{"add_items":[{"slug":"couronnes","qty":40},{"slug":"repas","qty":4}],"meal_required":true}}'::jsonb
   WHERE story_id = v_story_id AND node_key = 'section_184';

  -- =========================================================
  -- 7) §188 : le Kraan déchire le Sac à Dos (perte du contenu)
  -- =========================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{hazard_consequences}',
       (SELECT jsonb_agg(
          CASE WHEN (r->>'min')::int = 0
               THEN r || '{"lose_backpack": true, "message": "Le Kraan déchire votre Sac à Dos : tout son contenu (Repas, Torches...) est perdu !"}'::jsonb
               ELSE r END)
          FROM jsonb_array_elements(metadata->'hazard_consequences') r))
   WHERE story_id = v_story_id AND node_key = 'section_188'
     AND metadata ? 'hazard_consequences';

  -- =========================================================
  -- 8) Règles de combat fidèles (par ennemi, dans combatants)
  -- =========================================================
  -- §17 : gêné par les ailes du Kraan : -1 HABILETÉ pendant le combat
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
       (SELECT jsonb_agg(e || '{"player_skill_penalty": 1}') FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_017' AND metadata ? 'combatants';

  -- §29 / §34 : Puissance Psychique du Vordak (-2 HAB sans Bouclier)
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
       (SELECT jsonb_agg(e || '{"psychic_assault": true}') FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key IN ('section_029', 'section_034') AND metadata ? 'combatants';

  -- §283 : surprise +2 au 1er assaut, puis -2 sans Bouclier dès le 2e
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
       (SELECT jsonb_agg(e || '{"psychic_assault": true, "psychic_assault_from_round": 2, "surprise_bonus_round_1": 2}') FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_283' AND metadata ? 'combatants';

  -- §342 : -2 sans Bouclier, et invulnérable à VOTRE Puissance Psychique
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
       (SELECT jsonb_agg(e || '{"psychic_assault": true, "mindblast_immune": true}') FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_342' AND metadata ? 'combatants';

  -- §133 (Serpent Ailé), §255 (Gourgaz) : insensibles à la Puissance Psychique
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
       (SELECT jsonb_agg(e || '{"mindblast_immune": true}') FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key IN ('section_133', 'section_255') AND metadata ? 'combatants';

  -- §170 : insensible à la Puissance Psychique ET -3 HAB sans torche
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
       (SELECT jsonb_agg(e || '{"mindblast_immune": true, "no_torch_penalty": 3}') FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_170' AND metadata ? 'combatants';

END $$;
