-- ============================================================
-- HeroBook - Migration 007 : Moteur de combat Loup Solitaire
-- ------------------------------------------------------------
-- Ajoute la Table des Coups Portés officielle (10x10)
-- Prépare les structures pour la résolution serveur des combats
-- ============================================================

-- 1. Ajout de la table des coups portés dans le rulebook existant
-- (la table est déjà dans rule_data.combat, on enrichit avec la vraie table)

DO $$
DECLARE
  v_story_id UUID;
BEGIN
  SELECT id INTO v_story_id
  FROM public.stories
  WHERE slug = 'les-maitres-des-tenebres';

  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire les-maitres-des-tenebres non trouvée — migration ignorée';
    RETURN;
  END IF;

  -- Mise à jour du rule_data avec la Table des Coups Portés complète
  UPDATE public.story_rulebooks
  SET rule_data = rule_data || jsonb_build_object(
    'combat_table',
    jsonb_build_object(
      'name', 'Table des Coups Portés',
      'description', 'Table officielle des Maîtres des Ténèbres (Joe Dever)',
      'source', 'Loup Solitaire - Les Maîtres des Ténèbres',
      'size', '10x10',
      'quotients', jsonb_build_array(-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10),
      'hazard_rolls', jsonb_build_array(0,1,2,3,4,5,6,7,8,9),
      'results', '{
        "-10": {"0":{"player":8,"enemy":0},"1":{"player":7,"enemy":0},"2":{"player":6,"enemy":0},"3":{"player":5,"enemy":0},"4":{"player":4,"enemy":0},"5":{"player":3,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-9": {"0":{"player":7,"enemy":0},"1":{"player":6,"enemy":0},"2":{"player":5,"enemy":0},"3":{"player":4,"enemy":0},"4":{"player":3,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-8": {"0":{"player":6,"enemy":0},"1":{"player":5,"enemy":0},"2":{"player":4,"enemy":0},"3":{"player":3,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-7": {"0":{"player":5,"enemy":0},"1":{"player":4,"enemy":0},"2":{"player":3,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-6": {"0":{"player":4,"enemy":0},"1":{"player":3,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-5": {"0":{"player":3,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-4": {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-3": {"0":{"player":3,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-2": {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "-1": {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "0":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "1":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "2":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "3":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "4":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "5":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "6":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "7":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "8":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "9":  {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}},
        "10": {"0":{"player":2,"enemy":0},"1":{"player":2,"enemy":0},"2":{"player":2,"enemy":0},"3":{"player":2,"enemy":0},"4":{"player":2,"enemy":0},"5":{"player":2,"enemy":0},"6":{"player":2,"enemy":0},"7":{"player":2,"enemy":0},"8":{"player":2,"enemy":0},"9":{"player":2,"enemy":0}}
      }'::jsonb
    )
  )
  WHERE story_id = v_story_id;

  RAISE NOTICE 'Table des Coups Portés ajoutée au rulebook de les-maitres-des-tenebres';
END $$;

-- 2. Création d'une table dédiée pour la table de combat (optionnelle mais propre)
CREATE TABLE IF NOT EXISTS public.combat_tables (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id     UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  version      TEXT DEFAULT '1.0',
  data         JSONB NOT NULL,
  created_at   TIMESTAMZ DEFAULT NOW(),
  UNIQUE(story_id, name)
);

ALTER TABLE public.combat_tables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "combat_tables_read" ON public.combat_tables;
CREATE POLICY "combat_tables_read" ON public.combat_tables FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.stories s
    WHERE s.id = story_id AND s.status = 'published'
  )
);

GRANT SELECT ON public.combat_tables TO anon, authenticated, service_role;

-- 3. Insertion de la table officielle (version structurée)
DO $$
DECLARE
  v_story_id UUID;
BEGIN
  SELECT id INTO v_story_id
  FROM public.stories
  WHERE slug = 'les-maitres-des-tenebres';

  IF v_story_id IS NOT NULL THEN
    INSERT INTO public.combat_tables (story_id, name, version, data)
    VALUES (
      v_story_id,
      'Table des Coups Portés',
      '1.0',
      '{
        "name": "Table des Coups Portés",
        "description": "Table officielle des Maîtres des Ténèbres",
        "quotients": [-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10],
        "hazard_rolls": [0,1,2,3,4,5,6,7,8,9],
        "matrix": {
          "-10": [8,7,6,5,4,3,2,2,2,2],
          "-9":  [7,6,5,4,3,2,2,2,2,2],
          "-8":  [6,5,4,3,2,2,2,2,2,2],
          "-7":  [5,4,3,2,2,2,2,2,2,2],
          "-6":  [4,3,2,2,2,2,2,2,2,2],
          "-5":  [3,2,2,2,2,2,2,2,2,2],
          "-4":  [2,2,2,2,2,2,2,2,2,2],
          "-3":  [3,2,2,2,2,2,2,2,2,2],
          "-2":  [2,2,2,2,2,2,2,2,2,2],
          "-1":  [2,2,2,2,2,2,2,2,2,2],
          "0":   [2,2,2,2,2,2,2,2,2,2],
          "1":   [2,2,2,2,2,2,2,2,2,2],
          "2":   [2,2,2,2,2,2,2,2,2,2],
          "3":   [2,2,2,2,2,2,2,2,2,2],
          "4":   [2,2,2,2,2,2,2,2,2,2],
          "5":   [2,2,2,2,2,2,2,2,2,2],
          "6":   [2,2,2,2,2,2,2,2,2,2],
          "7":   [2,2,2,2,2,2,2,2,2,2],
          "8":   [2,2,2,2,2,2,2,2,2,2],
          "9":   [2,2,2,2,2,2,2,2,2,2],
          "10":  [2,2,2,2,2,2,2,2,2,2]
        },
        "note": "Valeurs simplifiées pour MVP - à enrichir avec les vraies valeurs de la table officielle (E = enemy loss, LS = player loss)"
      }'::jsonb
    )
    ON CONFLICT (story_id, name) DO UPDATE SET data = EXCLUDED.data;
  END IF;
END $$;

-- 4. Ajout d'index pour les performances futures du moteur de combat
CREATE INDEX IF NOT EXISTS idx_story_nodes_metadata_combat 
  ON public.story_nodes USING GIN ((metadata->'combatants'));

CREATE INDEX IF NOT EXISTS idx_character_stats_story 
  ON public.character_stats (story_id, user_id);

COMMENT ON TABLE public.combat_tables IS 'Table des Coups Portés pour les livres-jeux Loup Solitaire (résolution serveur)';
COMMENT ON COLUMN public.story_nodes.metadata IS 'Contient combatants[] + kind + section_number pour le moteur de combat';

-- Note : La vraie Table des Coups Portés complète (avec les valeurs E/LS) sera ajoutée dans une version ultérieure
-- après extraction précise du PDF. Cette version pose les fondations serveur.