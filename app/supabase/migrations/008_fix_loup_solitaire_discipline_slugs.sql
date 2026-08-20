-- ============================================================
-- HeroBook - Migration 008 : Correction des slugs des Disciplines Kaï
-- ------------------------------------------------------------
-- Cette migration corrige les slugs mal orthographiés dans les données
-- de "Les Maîtres des Ténèbres" pour une cohérence parfaite.
--
-- Slug corrigé :
--   "six_cieme_sens" → "sixieme_sens"
-- ============================================================

DO $$
DECLARE
  v_story_id UUID;
  v_rule_data JSONB;
  v_updated_disciplines JSONB;
BEGIN
  -- Récupérer l'ID de l'histoire
  SELECT id INTO v_story_id
  FROM public.stories
  WHERE slug = 'les-maitres-des-tenebres';

  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire les-maitres-des-tenebres non trouvée — migration ignorée';
    RETURN;
  END IF;

  -- 1. Corriger les slugs dans story_rulebooks.rule_data.disciplines
  SELECT rule_data INTO v_rule_data
  FROM public.story_rulebooks
  WHERE story_id = v_story_id;

  IF v_rule_data IS NOT NULL THEN
    -- Remplacer le slug erroné dans le tableau des disciplines
    v_updated_disciplines := (
      SELECT jsonb_agg(
        CASE 
          WHEN elem->>'slug' = 'six_cieme_sens' THEN 
            jsonb_set(elem, '{slug}', '"sixieme_sens"')
          ELSE elem 
        END
      )
      FROM jsonb_array_elements(v_rule_data->'disciplines') AS elem
    );

    -- Mettre à jour le rule_data
    UPDATE public.story_rulebooks
    SET rule_data = jsonb_set(
      v_rule_data, 
      '{disciplines}', 
      v_updated_disciplines
    )
    WHERE story_id = v_story_id;

    RAISE NOTICE 'Slugs des Disciplines Kaï corrigés dans story_rulebooks';
  END IF;

  -- 2. Migrer les narrative_flags des joueurs existants
  --    (remplace "six_cieme_sens" par "sixieme_sens" si présent)
  UPDATE public.character_stats
  SET narrative_flags = (
    SELECT jsonb_object_agg(
      CASE 
        WHEN key = 'six_cieme_sens' THEN 'sixieme_sens' 
        ELSE key 
      END, 
      value
    )
    FROM jsonb_each(narrative_flags)
  )
  WHERE story_id = v_story_id
    AND narrative_flags ? 'six_cieme_sens';

  RAISE NOTICE 'narrative_flags des joueurs mis à jour (si nécessaire)';

  -- 3. Vérification finale
  RAISE NOTICE 'Migration 008 terminée avec succès pour Les Maîtres des Ténèbres';
END $$;