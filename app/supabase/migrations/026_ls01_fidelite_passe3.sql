-- ================================================================
-- HeroBook — Migration 026 : FIDÉLITÉ LIVRE PASSE 3
--                        Les Maîtres des Ténèbres (Loup Solitaire 01)
-- ----------------------------------------------------------------
-- Correctifs C1 à C13 de l'audit « AUDIT_LS01_PARCOURS_COMPLETS.md ».
-- À exécuter APRÈS les migrations 010, 011 et 012.
--
--   C1  §340  combat GLOK + LOUP MAUDIT 14/24 recréé
--   C2  §55   +4 HAB pendant tout le combat (surprise)
--   C3  §136  +1 HAB (position élevée)
--   C4  §229  -1 HAB (poussière)
--   C5  §260  -4 HAB (combat à mains nues)
--   C6  §43   fuite assujettie à 3 assauts obligatoires
--   C7  §2    perte d'ENDURANCE retirée du jet (conservée sur §343/§276)
--   C8  verrous de Discipline : 3 retirés, 1 discipline retirée, 1 ajouté
--   C9  §161  Clé d'Or attribuée (+ verrou de sortie §161→§209)
--   C10 butins et argent automatiques du livre (règle R1)
--   C11 metadata.references régénéré depuis les renvois réels
--   C13 messages d'effet : phrase littérale du livre
--   C12 offres facultatives (R2), choix exclusif §291 (R3),
--       échange §307 (R4, sous condition de capacité), pertes au
--       choix du joueur §144/§277 (R5)
--
-- Les messages affichés reprennent les phrases du livre, jamais des
-- paraphrases. Aucune valeur de jeu n'est inventée.
--
-- Deltas documentés par rapport au bloc audité (§4.8) — 20 septembre 2026 :
--   * v_echange_arme_actif := TRUE : la capacité `arme_au_choix`
--     (désignation de l'arme laissée) est implémentée dans make-choice,
--     l'échange du §307 est donc jouable, comme le livre l'écrit ;
--   * branche R4 durcie : idempotence, offert une seule fois (drapeau
--     `echange_307`, mécanisme R2), et traçabilité du livre conservée
--     dans metadata.special_actions dans les deux cas ;
--   * make-choice exige la désignation (422 designation_required sinon)
--     et refuse l'échange sans Arme en main (condition du texte).
-- ================================================================

DO $$
DECLARE
  v_story_id  UUID;
  v_node_id   UUID;
  v_choice_id UUID;
  v_item_id   UUID;
  v_rec       RECORD;
  v_offer     RECORD;
  v_meta      JSONB;
  -- Capacité d'exécution « désigner l'arme laissée » (R4) : implémentée
  -- dans `make-choice` (designation_required + refus sans Arme). L'échange
  -- du §307 est donc jouable ; traçabilité dans metadata.special_actions.
  v_echange_arme_actif BOOLEAN := TRUE;
  v_target_id  UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'les-maitres-des-tenebres';
  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire les-maitres-des-tenebres absente - migration 026 ignoree';
    RETURN;
  END IF;

  -- =============================================================
  -- C1 · §340 : combat GLOK + LOUP MAUDIT 14/24
  --      (le libellé du livre porte « HABELETE. », le parseur
  --       d'import a échoué et laissé combatants vide)
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           '[{"name":"GLOK + LOUP MAUDIT","combat_skill":14,"endurance":24}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_340';

  -- =============================================================
  -- C2 à C5 · Modificateurs d'HABILETÉ propres à un combat
  --      player_skill_penalty est déjà lu par resolve-combat-round.
  --      player_skill_bonus demande 3 lignes dans cette fonction
  --      (voir 4.6 du rapport) : sans elles, §55 et §136 restent
  --      sans bonus, les deux autres corrections sont opérantes.
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           (SELECT jsonb_agg(e || '{"player_skill_bonus": 4}')
              FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_055'
     AND metadata ? 'combatants';

  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           (SELECT jsonb_agg(e || '{"player_skill_bonus": 1}')
              FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_136'
     AND metadata ? 'combatants';

  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           (SELECT jsonb_agg(e || '{"player_skill_penalty": 1}')
              FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_229'
     AND metadata ? 'combatants';

  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           (SELECT jsonb_agg(e || '{"player_skill_penalty": 4}')
              FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_260'
     AND metadata ? 'combatants';

  -- =============================================================
  -- C6 · §43 : fuite après 3 assauts obligatoires → §106
  --      (« Si vous souhaitez vous échapper après avoir livré ces
  --        trois assauts obligatoires, rendez-vous au 106. »)
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combat}',
           COALESCE(metadata->'combat', '{}'::jsonb)
           || '{"flee":{"target_node_key":"section_106","min_rounds":3}}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_043';

  -- Nettoyage de l'historique avant suppression du choix (FK NO ACTION)
  DELETE FROM public.choice_history h
   USING public.story_choices c, public.story_nodes s, public.story_nodes t
   WHERE h.choice_id = c.id
     AND c.node_id = s.id AND c.target_node_id = t.id
     AND s.story_id = v_story_id
     AND s.node_key = 'section_043' AND t.node_key = 'section_106';

  DELETE FROM public.story_choices c
   USING public.story_nodes s, public.story_nodes t
   WHERE c.node_id = s.id AND c.target_node_id = t.id
     AND s.story_id = v_story_id
     AND s.node_key = 'section_043' AND t.node_key = 'section_106';

  -- =============================================================
  -- C7 · §2 : la perte d'ENDURANCE n'est portée que par les sections
  --      d'arrivée (§343 : -2, §276 : -1), comme dans le livre.
  --      Le §2 ne décrit que le jet : aucune perte, aucun texte
  --      inventé — la seule phrase du livre est reprise telle quelle.
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{hazard_consequences}',
           '[{"min":0,"max":4,"target_node_key":"section_343",
              "message":"Vous trébuchez soudain en tombant tête la première dans un enchevêtrement de branches basses."},
             {"min":5,"max":9,"target_node_key":"section_276"}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_002';

  -- =============================================================
  -- C8 · Verrous de Discipline
  --      a) retraits : §18→§29, §172→§29, §211→§106
  --      b) §23→§326 : retirer la Discipline, garder la Clé d'Or
  --      c) ajout    : §222→§67 (Orientation)
  --      NB : le verrou de §23→§151 (Maîtrise Psychique de la Matière)
  --      est déjà conforme — vérifié, aucune action.
  -- =============================================================
  DELETE FROM public.choice_effects e
   USING public.story_choices c, public.story_nodes s, public.story_nodes t
   WHERE e.choice_id = c.id
     AND c.node_id = s.id AND c.target_node_id = t.id
     AND s.story_id = v_story_id AND e.effect_type = 'flag_require'
     AND ( (s.node_key, t.node_key) IN
             (('section_018','section_029'),
              ('section_172','section_029'),
              ('section_211','section_106'))
        OR (s.node_key = 'section_023' AND t.node_key = 'section_326'
            AND e.flag_key = 'discipline_maitrise_psychique_matiere') );

  SELECT c.id INTO v_choice_id
    FROM public.story_choices c
    JOIN public.story_nodes s ON s.id = c.node_id
    JOIN public.story_nodes t ON t.id = c.target_node_id
   WHERE s.story_id = v_story_id
     AND s.node_key = 'section_222' AND t.node_key = 'section_067';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (
       SELECT 1 FROM public.choice_effects e
        WHERE e.choice_id = v_choice_id
          AND e.effect_type = 'flag_require'
          AND e.flag_key = 'discipline_orientation') THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_require', 'discipline_orientation', TRUE);
  END IF;

  -- =============================================================
  -- C9 · §161 : la Clé d'Or tombe dans les mains du héros
  --      (« Vous prenez la Clé (notez-la sur votre Feuille
  --         d'Aventure dans la case Objets Spéciaux) »)
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{on_arrive}',
           COALESCE(metadata->'on_arrive', '{}'::jsonb)
           || '{"message":"Vous prenez la Clé.","add_items":[{"slug":"cle-or","qty":1}]}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_161';

  SELECT c.id INTO v_choice_id
    FROM public.story_choices c
    JOIN public.story_nodes s ON s.id = c.node_id
    JOIN public.story_nodes t ON t.id = c.target_node_id
   WHERE s.story_id = v_story_id
     AND s.node_key = 'section_161' AND t.node_key = 'section_209';
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-or';
  IF v_choice_id IS NOT NULL AND v_item_id IS NOT NULL AND NOT EXISTS (
       SELECT 1 FROM public.choice_effects e
        WHERE e.choice_id = v_choice_id AND e.effect_type = 'inventory_require') THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id)
    VALUES (v_choice_id, 'inventory_require', 1, v_item_id);
  END IF;

  -- =============================================================
  -- C10 · Butins et argent du livre — gains automatiques (R1)
  --       « vous les empochez », « Notez-le », « Vous prenez la Clé »,
  --       « il vous la donne » : le livre ordonne l'inscription.
  -- =============================================================
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('parchemin', 'Parchemin', 'Rouleau de Parchemin récupéré sur un Glok.', 'artifact', 'rare', '{}'::jsonb, FALSE, TRUE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO NOTHING;
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('message', 'Message', 'Message écrit sur une peau d''animal.', 'artifact', 'rare', '{}'::jsonb, FALSE, TRUE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO NOTHING;
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('savon-parfume', 'Savon Parfumé', 'Morceau de Savon Parfumé trouvé dans un Sac de Velours.', 'artifact', 'common', '{}'::jsonb, FALSE, TRUE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO NOTHING;

  -- Normalisation : les butins facultatifs aujourd'hui attribués d'office
  -- par un choix sont retirés (ils seront reposés soit en gain automatique,
  -- soit en offre facultative, selon ce que dit le livre).
  DELETE FROM public.choice_effects e
   USING public.story_choices c, public.story_nodes s
   WHERE e.choice_id = c.id AND c.node_id = s.id
     AND s.story_id = v_story_id
     AND e.effect_type IN ('inventory_add', 'inventory_remove')
     AND c.target_node_id <> c.node_id          -- préserve les choix-offres C12
     AND s.node_key IN ('section_020', 'section_062', 'section_113',
                        'section_124', 'section_184', 'section_347');

  -- §184 : l'or et les repas sont des trouvailles FACULTATIVES
  -- (« Si vous souhaitez conserver l'une ou l'autre de ces trouvailles ») :
  -- ils passent en offres (§C12). Le Repas obligatoire reste.
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{on_arrive}',
           (metadata->'on_arrive') - 'add_items')
   WHERE story_id = v_story_id AND node_key = 'section_184'
     AND metadata->'on_arrive' ? 'add_items';

  FOR v_rec IN
    SELECT * FROM (VALUES
      ('section_033', 'couronnes',      3),
      ('section_062', 'couronnes',     28),
      ('section_062', 'repas',          3),
      ('section_094', 'couronnes',     16),
      ('section_113', 'laumspur',       2),
      ('section_124', 'couronnes',     15),
      ('section_137', 'pierre-vordak', 20),
      ('section_199', 'repas',          1),
      ('section_269', 'couronnes',     10),
      ('section_307', 'repas',          1),
      ('section_349', 'etoile-cristal', 1)
    ) AS t(node_key, slug, qty)
  LOOP
    SELECT n.id, n.metadata INTO v_node_id, v_meta
      FROM public.story_nodes n
     WHERE n.story_id = v_story_id AND n.node_key = v_rec.node_key;
    SELECT i.id INTO v_item_id FROM public.items i WHERE i.slug = v_rec.slug;
    IF v_node_id IS NULL OR v_item_id IS NULL THEN
      RAISE NOTICE 'C10 : % / % introuvable', v_rec.node_key, v_rec.slug;
      CONTINUE;
    END IF;
    -- idempotence : un seul enregistrement par (section, objet)
    IF COALESCE(v_meta->'on_arrive'->'add_items', '[]'::jsonb)
         @> jsonb_build_array(jsonb_build_object('slug', v_rec.slug)) THEN
      CONTINUE;
    END IF;
    UPDATE public.story_nodes
       SET metadata = jsonb_set(
             metadata, '{on_arrive}',
             COALESCE(metadata->'on_arrive', '{}'::jsonb)
             || jsonb_build_object(
                  'add_items',
                  COALESCE(metadata->'on_arrive'->'add_items', '[]'::jsonb)
                  || jsonb_build_array(jsonb_build_object('slug', v_rec.slug, 'qty', v_rec.qty))))
     WHERE id = v_node_id;
  END LOOP;

  -- =============================================================
  -- C12 · Ce que le joueur décide (R2 à R5)
  --       Une offre = un choix qui ramène sur la section (auto-boucle).
  --       Le choix est visible tant que l'objet n'a pas été pris
  --       (flag_require à FALSE, lu par make-choice) puis disparaît.
  --       Plusieurs objets offerts ensemble = UN seul choix qui les
  --       donne tous ; « au choix » = DEUX choix exclusifs.
  -- =============================================================
  FOR v_offer IN
    SELECT * FROM (VALUES
      ('section_015', 'Prendre l''Épée',                                 'pris_15',  '[{"slug":"epee","qty":1}]'::jsonb),
      ('section_020', 'Prendre le Sac à Dos',                            'pris_20a', '[{"slug":"sac-a-dos","qty":1}]'::jsonb),
      ('section_020', 'Prendre les 2 Repas',                             'pris_20b', '[{"slug":"repas","qty":2}]'::jsonb),
      ('section_020', 'Prendre le Poignard',                             'pris_20c', '[{"slug":"poignard","qty":1}]'::jsonb),
      ('section_062', 'Emporter une des trois Épées',                    'pris_62',  '[{"slug":"epee","qty":1}]'::jsonb),
      ('section_124', 'Conserver la Clé d''Argent',                      'pris_124', '[{"slug":"cle-argent","qty":1}]'::jsonb),
      ('section_148', 'Prendre le Marteau de Guerre',                    'pris_148', '[{"slug":"marteau-guerre","qty":1}]'::jsonb),
      ('section_164', 'Conserver l''Essence d''Alether',                 'pris_164', '[{"slug":"relique-potion-alether","qty":1}]'::jsonb),
      ('section_184', 'Conserver les 40 Pièces d''Or',                   'pris_184a','[{"slug":"couronnes","qty":40}]'::jsonb),
      ('section_184', 'Conserver l''Épée',                               'pris_184b','[{"slug":"epee","qty":1}]'::jsonb),
      ('section_184', 'Conserver les 4 Repas',                           'pris_184c','[{"slug":"repas","qty":4}]'::jsonb),
      ('section_193', 'Prendre le Parchemin',                            'pris_193', '[{"slug":"parchemin","qty":1}]'::jsonb),
      ('section_197', 'Prendre le Sabre et les 6 Pièces d''Or',          'pris_197', '[{"slug":"sabre","qty":1},{"slug":"couronnes","qty":6}]'::jsonb),
      ('section_243', 'Prendre la Masse d''Armes',                       'pris_243', '[{"slug":"masse-armes","qty":1}]'::jsonb),
      ('section_255', 'Ramasser l''Épée du Prince',                      'pris_255', '[{"slug":"epee","qty":1}]'::jsonb),
      ('section_263', 'Prendre les 3 Pièces d''Or',                      'pris_263', '[{"slug":"couronnes","qty":3}]'::jsonb),
      ('section_267', 'Conserver le Message et le Poignard',             'pris_267', '[{"slug":"message","qty":1},{"slug":"poignard","qty":1}]'::jsonb),
      ('section_290', 'Prendre le Bâton',                                'pris_290', '[{"slug":"baton","qty":1}]'::jsonb),
      ('section_305', 'Prendre la Lance de Glok',                        'pris_305', '[{"slug":"lance","qty":1}]'::jsonb),
      ('section_315', 'Prendre le Savon Parfumé et l''Or',               'pris_315', '[{"slug":"savon-parfume","qty":1},{"slug":"couronnes","qty":6}]'::jsonb),
      ('section_319', 'Prendre la Bourse et le Poignard',                'pris_319', '[{"slug":"couronnes","qty":20},{"slug":"poignard","qty":1}]'::jsonb),
      ('section_346', 'Prendre la Lance',                                'pris_346', '[{"slug":"lance","qty":1}]'::jsonb),
      ('section_347', 'Prendre le Sabre, le Briquet et une Torche',      'pris_347', '[{"slug":"sabre","qty":1},{"slug":"briquet-amadou","qty":1},{"slug":"torches","qty":1}]'::jsonb)
    ) AS t(node_key, libelle, drapeau, objets)
  LOOP
    SELECT n.id INTO v_node_id FROM public.story_nodes n
     WHERE n.story_id = v_story_id AND n.node_key = v_offer.node_key;
    IF v_node_id IS NULL THEN
      RAISE NOTICE 'C12 : % introuvable', v_offer.node_key;
      CONTINUE;
    END IF;
    -- idempotence : ne pas recréer l'offre si elle est déjà là
    IF EXISTS (SELECT 1 FROM public.story_choices c
                WHERE c.node_id = v_node_id
                  AND c.target_node_id = v_node_id
                  AND c.text = v_offer.libelle) THEN
      CONTINUE;
    END IF;
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
    VALUES (v_node_id, v_node_id, 90, v_offer.libelle)
    RETURNING id INTO v_choice_id;

    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_require', v_offer.drapeau, FALSE);

    FOR v_rec IN SELECT value FROM jsonb_array_elements(v_offer.objets) AS e(value)
    LOOP
      SELECT i.id INTO v_item_id FROM public.items i WHERE i.slug = v_rec.value->>'slug';
      IF v_item_id IS NULL THEN
        RAISE NOTICE 'C12 : objet % introuvable (§%)', v_rec.value->>'slug', v_offer.node_key;
        CONTINUE;
      END IF;
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id)
      VALUES (v_choice_id, 'inventory_add',
              COALESCE((v_rec.value->>'qty')::int, 1), v_item_id);
    END LOOP;

    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_set', v_offer.drapeau, TRUE);
  END LOOP;

  -- R3 · §291 : « Vous pouvez garder l'Or et prendre au choix le
  --      Poignard ou l'une des Lances. » Les 6 Couronnes sont
  --      conservées automatiquement (déjà encodées) : deux choix
  --      concurrents, exclusifs l'un de l'autre.
  SELECT n.id INTO v_node_id FROM public.story_nodes n
   WHERE n.story_id = v_story_id AND n.node_key = 'section_291';
  IF v_node_id IS NOT NULL THEN
    FOR v_offer IN
      SELECT * FROM (VALUES
        ('Prendre le Poignard des Gloks', 'pris_291', 'poignard'),
        ('Prendre une Lance des Gloks',   'pris_291', 'lance')
      ) AS t(libelle, drapeau, slug)
    LOOP
      IF EXISTS (SELECT 1 FROM public.story_choices c
                  WHERE c.node_id = v_node_id AND c.target_node_id = v_node_id
                    AND c.text = v_offer.libelle) THEN
        CONTINUE;
      END IF;
      SELECT i.id INTO v_item_id FROM public.items i WHERE i.slug = v_offer.slug;
      INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
      VALUES (v_node_id, v_node_id, 90, v_offer.libelle)
      RETURNING id INTO v_choice_id;
      INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
      VALUES (v_choice_id, 'flag_require', v_offer.drapeau, FALSE);
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id)
      VALUES (v_choice_id, 'inventory_add', 1, v_item_id);
      INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
      VALUES (v_choice_id, 'flag_set', v_offer.drapeau, TRUE);
    END LOOP;
  END IF;

  -- R4 · §307 : « Vous n'aurez le droit de prendre ce Marteau de Guerre
  --      qu'à la condition de l'échanger contre une autre Arme que vous
  --      possédez déjà. » Le joueur désigne l'arme laissée (make-choice,
  --      stat_key 'arme_au_choix') ; l'offre n'est visible qu'une fois.
  --      Traçabilité du livre conservée dans metadata.special_actions.
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{special_actions}',
           '{"echange_arme":{"objet":"marteau-guerre","contre":"arme_au_choix",
              "condition":"échanger contre une autre Arme que vous possédez déjà",
              "statut":"jouable — désignation de l''arme laissée exigée par make-choice"}}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_307';

  IF v_echange_arme_actif THEN
    SELECT n.id INTO v_node_id FROM public.story_nodes n
     WHERE n.story_id = v_story_id AND n.node_key = 'section_307';
    SELECT t.id INTO v_target_id FROM public.story_nodes t
     WHERE t.story_id = v_story_id AND t.node_key = 'section_213';
    SELECT i.id INTO v_item_id FROM public.items i WHERE i.slug = 'marteau-guerre';
    IF v_node_id IS NOT NULL AND v_target_id IS NOT NULL AND v_item_id IS NOT NULL
       AND NOT EXISTS (
         SELECT 1 FROM public.story_choices c
          WHERE c.node_id = v_node_id
            AND c.text = 'Échanger une Arme contre le Marteau de Guerre') THEN
      INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
      VALUES (v_node_id, v_target_id, 90, 'Échanger une Arme contre le Marteau de Guerre')
      RETURNING id INTO v_choice_id;
      INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
      VALUES (v_choice_id, 'flag_require', 'echange_307', FALSE);
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_key)
      VALUES (v_choice_id, 'inventory_remove', 'arme_au_choix');
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id)
      VALUES (v_choice_id, 'inventory_add', 1, v_item_id);
      INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
      VALUES (v_choice_id, 'flag_set', 'echange_307', TRUE);
    END IF;
  END IF;

  -- R5 · Pertes désignées par le joueur
  --      §144 « c'est vous qui choisissez ce qu'on vous a volé »
  --      §277 « vous pouvez choisir laquelle » (arme brisée)
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{on_arrive}',
           COALESCE(metadata->'on_arrive', '{}'::jsonb)
           || '{"choose_loss":{"kind":"backpack_item","fallback":"weapon"}}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_144';
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{on_arrive}',
           COALESCE(metadata->'on_arrive', '{}'::jsonb)
           || '{"choose_loss":{"kind":"weapon","optional":true}}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_277';

  -- =============================================================
  -- C13 · Messages d'effet : phrase littérale du livre
  --       Les migrations 010-012 avaient laissé 15 messages
  --       reformulés par l'import (« Votre jambe meurtrie vous
  --       coûte 1 point … ») : les valeurs de jeu sont justes,
  --       mais le texte affiché n'est pas celui du livre. Chaque
  --       message redevient la phrase du paragraphe concerné.
  -- =============================================================
  FOR v_rec IN
    SELECT * FROM (VALUES
      ('section_119', 'Les plaies occasionnées par les Brosses à Potence vous coûtent 2 points d''ENDURANCE.'),
      ('section_144', 'Dans la bousculade, quelqu''un vous vole l''un des objets contenus dans votre Sac à Dos. Vous êtes à moitié assommé et vous perdez 2 points d''ENDURANCE.'),
      ('section_146', 'Vous perdez 3 points d''ENDURANCE.'),
      ('section_162', 'Ils vous prennent votre Sac à Dos et vos Armes, mais ils ne fouillent pas les poches de votre cape et ne trouvent pas vos Pièces d''Or.'),
      ('section_166', 'Vous perdez 4 points d''ENDURANCE.'),
      ('section_203', 'Vous perdez 10 points d''ENDURANCE.'),
      ('section_212', 'Vous récupérez tous les points d''ENDURANCE dont vous disposiez au départ de votre mission.'),
      ('section_236', 'Vous avez, en effet, perdu 6 points d''ENDURANCE et votre total d''HABILETÉ se trouve réduit de 1 point pour le reste de vos jours.'),
      ('section_276', 'Vous perdez 1 point d''ENDURANCE.'),
      ('section_304', 'Vous perdez aussitôt 2 points d''ENDURANCE.'),
      ('section_308', 'Vous perdez 1 point d''ENDURANCE.'),
      ('section_313', 'Ces chutes répétées occasionnent des écorchures et des contusions qui vous coûtent 1 point d''ENDURANCE.'),
      ('section_320', 'Vous parvenez à pénétrer dans la forêt, mais vous avez perdu 2 points d''ENDURANCE.'),
      ('section_343', 'Vous perdez 2 points d''ENDURANCE.'),
      ('section_076', 'Vous perdez 2 points d''ENDURANCE.')
    ) AS t(node_key, message)
  LOOP
    UPDATE public.story_nodes
       SET metadata = jsonb_set(metadata, '{on_arrive,message}',
             to_jsonb(v_rec.message))
     WHERE story_id = v_story_id AND node_key = v_rec.node_key
       AND metadata->'on_arrive' ? 'message';
  END LOOP;

  -- =============================================================
  -- C11 · metadata.references : régénéré depuis les renvois réels
  --       (choix, Tables de Hasard, fuites), hors auto-boucles.
  --       Champ documentaire : aucun code de l'application ne le lit.
  -- =============================================================
  UPDATE public.story_nodes n
     SET metadata = jsonb_set(n.metadata, '{references}',
           COALESCE((
             SELECT jsonb_agg(DISTINCT k ORDER BY k)
               FROM (
                 SELECT t.node_key AS k
                   FROM public.story_choices c
                   JOIN public.story_nodes t ON t.id = c.target_node_id
                  WHERE c.node_id = n.id AND t.node_key <> n.node_key
                 UNION
                 SELECT h->>'target_node_key'
                   FROM jsonb_array_elements(COALESCE(n.metadata->'hazard_consequences', '[]'::jsonb)) h
                  WHERE h ? 'target_node_key' AND h->>'target_node_key' <> n.node_key
                 UNION
                 SELECT n.metadata->'combat'->'flee'->>'target_node_key'
                  WHERE n.metadata->'combat'->'flee' ? 'target_node_key'
                    AND n.metadata->'combat'->'flee'->>'target_node_key' <> n.node_key
               ) x
              WHERE k IS NOT NULL AND k <> ''
           ), '[]'::jsonb))
   WHERE n.story_id = v_story_id;

  RAISE NOTICE 'Migration 026 : correctifs C1-C13 appliqués (fidélité LS01 passe 3)';
END $$;

-- =====================================================================
-- 11. PASSE 3b — C13 ÉTENDU AUX MESSAGES DE JET DE HASARD (delta §4.9)
-- =====================================================================
-- Le test anti-hallucinations (scripts/test-attestations-ls01.mjs) a
-- détecté 10 paraphrases de passage affichées sur les jets de Hasard que
-- la passe 3 (§4.9) n'avait pas couvertes. Même règle que C13 : chaque
-- message affiché est une phrase LITTÉRALE du livre — sinon le message
-- est supprimé (la conséquence est narrée par la section d'arrivée).
-- Remplacements d'après le PDF :
--   §21   « Votre cheval s'est enfoncé jusqu'au ventre dans une boue épaisse. »
--   §21   « Vous parvenez à vous éloigner de ce bourbier. »
--   §21   « Vous vous enfoncez dans la boue jusqu'aux aisselles. »
--   §21   « Vous réussissez tant bien que mal à vous hisser sur un sol plus ferme. »
--   §21   « Le marécage vous engloutit définitivement. »
--   §36   « Vous perdez donc 2 points d'ENDURANCE. »
--   §158  « L'éclair vous rate et vient exploser contre le mur. »
--   §158  « L'éclair vous frappe dans le dos et vous perdez 4 points d'ENDURANCE supplémentaires. »
--   §188  « Le Kraan a déchiré de ses serres pointues la toile de votre Sac à Dos. »
--   §188  « Vous avez été blessé aux deux bras et vous perdez 3 points d'ENDURANCE. »
--   §237  « L'un de vos ennemis a tôt fait de vous trouver et de vous attaquer. »
-- Suppressions (aucune phrase de conséquence dans le livre) :
--   §7 (les deux issues) — narrées par les §108/§25 ;
--   §21, dernier sursaut → §312 (« Si en revanche vous tirez un 9… »).

CREATE OR REPLACE FUNCTION public.tmp_set_hazard_message(
  p_node_key text, p_min int, p_max int, p_message text
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.story_nodes sn
     SET metadata = jsonb_set(sn.metadata, '{hazard_consequences}',
           (SELECT jsonb_agg(
              CASE
                WHEN (h->>'min')::int = p_min AND (h->>'max')::int = p_max
                THEN CASE WHEN p_message IS NULL THEN h - 'message'
                          ELSE jsonb_set(h, '{message}', to_jsonb(p_message)) END
                ELSE h
              END
              ORDER BY (h->>'min')::int)
              FROM jsonb_array_elements(sn.metadata->'hazard_consequences') h))
   WHERE sn.node_key = p_node_key
     AND sn.story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres');
END $$;

SELECT public.tmp_set_hazard_message('section_021', 0, 4,
  'Votre cheval s''est enfoncé jusqu''au ventre dans une boue épaisse.');
SELECT public.tmp_set_hazard_message('section_021', 5, 9,
  'Vous parvenez à vous éloigner de ce bourbier.');
SELECT public.tmp_set_hazard_message('section_021_enlisement', 0, 7,
  'Vous vous enfoncez dans la boue jusqu''aux aisselles.');
SELECT public.tmp_set_hazard_message('section_021_enlisement', 8, 9,
  'Vous réussissez tant bien que mal à vous hisser sur un sol plus ferme.');
SELECT public.tmp_set_hazard_message('section_021_derniere_chance', 0, 8,
  'Le marécage vous engloutit définitivement.');
SELECT public.tmp_set_hazard_message('section_021_derniere_chance', 9, 9, NULL);
SELECT public.tmp_set_hazard_message('section_007', 0, 2, NULL);
SELECT public.tmp_set_hazard_message('section_007', 3, 9, NULL);
SELECT public.tmp_set_hazard_message('section_036', 0, 4,
  'Vous perdez donc 2 points d''ENDURANCE.');
SELECT public.tmp_set_hazard_message('section_158', 0, 5,
  'L''éclair vous rate et vient exploser contre le mur.');
SELECT public.tmp_set_hazard_message('section_158', 6, 9,
  'L''éclair vous frappe dans le dos et vous perdez 4 points d''ENDURANCE supplémentaires.');
SELECT public.tmp_set_hazard_message('section_188', 0, 6,
  'Le Kraan a déchiré de ses serres pointues la toile de votre Sac à Dos.');
SELECT public.tmp_set_hazard_message('section_188', 7, 9,
  'Vous avez été blessé aux deux bras et vous perdez 3 points d''ENDURANCE.');
SELECT public.tmp_set_hazard_message('section_237', 5, 9,
  'L''un de vos ennemis a tôt fait de vous trouver et de vous attaquer.');

DROP FUNCTION public.tmp_set_hazard_message(text, int, int, text);

-- =====================================================================
-- 12. PASSE 3c — T-023 : ordres d'affichage des offres multiples
-- =====================================================================
-- Les offres ajoutées par la passe 3 partageaient toutes display_order=90
-- (§20, §184, §291) : séquences non strictes. On réordonne dans l'ordre
-- du livre. Idempotent (affectations absolues).
UPDATE public.story_choices c
   SET display_order = v.ordre
  FROM (VALUES
    ('section_020', 'Prendre le Sac à Dos',            90),
    ('section_020', 'Prendre les 2 Repas',             91),
    ('section_020', 'Prendre le Poignard',             92),
    ('section_184', 'Conserver les 40 Pièces d''Or',   90),
    ('section_184', 'Conserver l''Épée',               91),
    ('section_184', 'Conserver les 4 Repas',           92),
    ('section_291', 'Prendre le Poignard des Gloks',   90),
    ('section_291', 'Prendre une Lance des Gloks',     91)
  ) AS v(node_key, txt, ordre)
  JOIN public.story_nodes n ON n.node_key = v.node_key
 WHERE c.node_id = n.id
   AND n.story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres')
   AND c.text = v.txt
   AND c.display_order <> v.ordre;

-- =====================================================================
-- 13. PASSE 3d — C10 complété d'après le PDF (§76, §291, §304)
-- =====================================================================
-- Les tests anti-hallucinations ont établi, phrases à l'appui :
--   §76  « vous la laissez tomber dans une poche de votre tunique »
--        → Pierre de Vordak AUTOMATIQUE (absente de la base : trouvée
--        sur aucune table avant cette passe) ;
--   §291 « vous découvrez dans leurs vêtements 6 Couronnes … Vous pouvez
--        garder l'Or » → 6 Couronnes AUTOMATIQUES (les armes restent au
--        choix exclusif) ;
--   §304 « vous la glissez dans votre Sac à Dos » → Pierre AUTOMATIQUE
--        (auparavant portée par des effets de choix : modèle C10).
-- Idempotence : ajouts protégés par NOT EXISTS, suppression idempotente.

UPDATE public.story_nodes
   SET metadata = jsonb_set(metadata, '{on_arrive}',
         COALESCE(metadata->'on_arrive', '{}'::jsonb)
         || jsonb_build_object('add_items',
              COALESCE(metadata->'on_arrive'->'add_items', '[]'::jsonb)
              || '[{"slug":"pierre-vordak","qty":1}]'::jsonb))
   WHERE story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres')
     AND node_key = 'section_076'
     AND NOT EXISTS (
       SELECT 1 FROM jsonb_array_elements(COALESCE(metadata->'on_arrive'->'add_items','[]'::jsonb)) x
        WHERE x.value->>'slug' = 'pierre-vordak');

UPDATE public.story_nodes
   SET metadata = jsonb_set(metadata, '{on_arrive}',
         COALESCE(metadata->'on_arrive', '{}'::jsonb)
         || jsonb_build_object('add_items',
              COALESCE(metadata->'on_arrive'->'add_items', '[]'::jsonb)
              || '[{"slug":"couronnes","qty":6}]'::jsonb))
   WHERE story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres')
     AND node_key = 'section_291'
     AND NOT EXISTS (
       SELECT 1 FROM jsonb_array_elements(COALESCE(metadata->'on_arrive'->'add_items','[]'::jsonb)) x
        WHERE x.value->>'slug' = 'couronnes');

UPDATE public.story_nodes
   SET metadata = jsonb_set(metadata, '{on_arrive}',
         COALESCE(metadata->'on_arrive', '{}'::jsonb)
         || jsonb_build_object('add_items',
              COALESCE(metadata->'on_arrive'->'add_items', '[]'::jsonb)
              || '[{"slug":"pierre-vordak","qty":1}]'::jsonb))
   WHERE story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres')
     AND node_key = 'section_304'
     AND NOT EXISTS (
       SELECT 1 FROM jsonb_array_elements(COALESCE(metadata->'on_arrive'->'add_items','[]'::jsonb)) x
        WHERE x.value->>'slug' = 'pierre-vordak');

DELETE FROM public.choice_effects ce
  USING public.story_choices c, public.story_nodes n, public.items i
 WHERE ce.choice_id = c.id
   AND c.node_id = n.id
   AND ce.item_id = i.id
   AND ce.effect_type = 'inventory_add'
   AND i.slug = 'pierre-vordak'
   AND n.node_key = 'section_304'
   AND n.story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres');
