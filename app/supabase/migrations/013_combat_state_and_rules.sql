-- ============================================================
-- HeroBook — Migration 013 : état de combat serveur + règles du livre
-- ------------------------------------------------------------
-- Corrige les bugs bloquants de l'audit « passe 3 » :
--
--  B1 : l'ENDURANCE de l'ennemi n'était jamais décrémentée entre les
--       assauts (le client renvoyait l'END initiale à chaque round et
--       la Edge Function était sans état) => AUCUN combat n'était
--       gagnable. On persiste désormais l'état du combat côté serveur
--       dans `character_stats.combat_state`, seule source de vérité.
--
--  B2 : la « Table des coups portés » stockée dans le rulebook était un
--       placeholder MVP (enemy loss = 0 partout). On installe la vraie
--       table du livre (13 bandes de Quotient × 10 chiffres, E/LS, T).
--
--  B6 : métadonnée `references` du §21 incohérente (312 listé alors
--       qu'il est atteint via la chaîne d'enlisement).
--
--  B7 : discipline Guérison (+1 END par section sans combat) —
--       activation par métadonnée sur le rulebook.
-- ============================================================

-- ------------------------------------------------------------
-- 1. État de combat persistant (B1)
-- ------------------------------------------------------------
-- Forme : {
--   "node_key": "section_112",
--   "enemies": [{"name":"...","combat_skill":13,"endurance":10}, ...],
--   "enemy_index": 0,
--   "round": 3,
--   "hp_at_start": 24,
--   "flee_rounds": 0
-- }
ALTER TABLE public.character_stats
  ADD COLUMN IF NOT EXISTS combat_state JSONB;

COMMENT ON COLUMN public.character_stats.combat_state IS
  'État serveur du combat en cours (END courante des ennemis, index, '
  'nombre d''assauts). Source de vérité : le client ne peut pas '
  'falsifier l''ENDURANCE des ennemis.';

-- ------------------------------------------------------------
-- 2. La vraie Table des coups portés (B2)
-- ------------------------------------------------------------
DO $$
DECLARE
  v_story_id UUID;
  v_table JSONB;
BEGIN
  SELECT id INTO v_story_id
  FROM public.stories
  WHERE slug = 'les-maitres-des-tenebres';

  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire les-maitres-des-tenebres absente — migration 013 ignorée';
    RETURN;
  END IF;

  -- Table transcrite depuis la table imprimée à la fin du livre.
  -- Colonnes (13) = bandes de Quotient d'Attaque, dans l'ordre :
  --   <=-11, -10/-9, -8/-7, -6/-5, -4/-3, -2/-1, 0, +1/+2,
  --   +3/+4, +5/+6, +7/+8, +9/+10, >=+11
  -- Lignes = chiffre de la Table de Hasard. Chaque cellule = [E, LS],
  -- "K" = « T » du livre (tué sur le coup).
  v_table := '{
    "1": [[0,"K"],[0,"K"],[0,8],[0,6],[1,6],[2,5],[3,5],[4,5],[5,4],[6,4],[7,4],[8,3],[9,3]],
    "2": [[0,"K"],[0,8],[0,7],[1,6],[2,5],[3,5],[4,4],[5,4],[6,3],[7,3],[8,3],[9,3],[10,2]],
    "3": [[0,8],[0,7],[1,6],[2,5],[3,5],[4,4],[5,4],[6,3],[7,3],[8,3],[9,2],[10,2],[11,2]],
    "4": [[0,8],[1,7],[2,6],[3,5],[4,4],[5,4],[6,3],[7,3],[8,2],[9,2],[10,2],[11,2],[12,2]],
    "5": [[1,7],[2,6],[3,5],[4,4],[5,4],[6,3],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[14,1]],
    "6": [[2,6],[3,6],[4,5],[5,4],[6,3],[7,2],[8,2],[9,2],[10,2],[11,1],[12,1],[14,1],[16,1]],
    "7": [[3,5],[4,5],[5,4],[6,3],[7,2],[8,2],[9,1],[10,1],[11,1],[12,0],[14,0],[16,0],[18,0]],
    "8": [[4,4],[5,4],[6,3],[7,2],[8,1],[9,1],[10,0],[11,0],[12,0],[14,0],[16,0],[18,0],["K",0]],
    "9": [[5,3],[6,3],[7,2],[8,0],[9,0],[10,0],[11,0],[12,0],[14,0],[16,0],[18,0],["K",0],["K",0]],
    "0": [[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[14,0],[16,0],[18,0],["K",0],["K",0],["K",0]]
  }'::jsonb;

  UPDATE public.story_rulebooks
  SET rule_data = rule_data || jsonb_build_object(
    'combat_table',
    jsonb_build_object(
      'name', 'Table des coups portés',
      'description', 'Table officielle du livre (Joe Dever) — E = Ennemi, LS = Loup Solitaire, K = Tué sur le coup',
      'source', 'Loup Solitaire — Les Maîtres des Ténèbres (table de fin d''ouvrage)',
      'layout', 'bandes de Quotient d''Attaque × chiffre de la Table de Hasard',
      'quotient_bands', jsonb_build_array(
        '-11 ou inférieur', '-10/-9', '-8/-7', '-6/-5', '-4/-3', '-2/-1',
        '0/0', '+1/+2', '+3/+4', '+5/+6', '+7/+8', '+9/+10', '+11 ou supérieur'
      ),
      'hazard_rolls', jsonb_build_array(1,2,3,4,5,6,7,8,9,0),
      'instant_kill_token', 'K',
      'cells', v_table
    )
  )
  WHERE story_id = v_story_id;

  UPDATE public.combat_tables
  SET data = jsonb_build_object(
        'name', 'Table des coups portés',
        'description', 'Table officielle du livre (Joe Dever)',
        'quotient_bands', jsonb_build_array(
          '-11 ou inférieur', '-10/-9', '-8/-7', '-6/-5', '-4/-3', '-2/-1',
          '0/0', '+1/+2', '+3/+4', '+5/+6', '+7/+8', '+9/+10', '+11 ou supérieur'
        ),
        'hazard_rolls', jsonb_build_array(1,2,3,4,5,6,7,8,9,0),
        'instant_kill_token', 'K',
        'cells', v_table
      ),
      version = '2.0'
  WHERE story_id = v_story_id
    AND name = 'Table des Coups Portés';

  RAISE NOTICE 'Table des coups portés officielle installée';
END $$;

-- ------------------------------------------------------------
-- 3. §21 : cohérence de la métadonnée `references` (B6)
-- ------------------------------------------------------------
-- Le §21 n'a pas de renvoi direct : sa chaîne de hasard mène à 189
-- (échappée) ou à l'enlisement, et le 312 n'est atteint que depuis
-- `section_021_derniere_chance`. On aligne la métadonnée sur la réalité
-- du graphe pour que les contrôles de complétude soient exacts.
UPDATE public.story_nodes
SET metadata = jsonb_set(
      metadata,
      '{references}',
      '["section_021_enlisement", "section_189"]'::jsonb
    )
WHERE node_key = 'section_021'
  AND story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres');

-- ------------------------------------------------------------
-- 4. Discipline Guérison : +1 END par section sans combat (B7)
-- ------------------------------------------------------------
DO $$
DECLARE
  v_story_id UUID;
BEGIN
  SELECT id INTO v_story_id
  FROM public.stories WHERE slug = 'les-maitres-des-tenebres';
  IF v_story_id IS NULL THEN RETURN; END IF;

  UPDATE public.story_rulebooks
  SET rule_data = rule_data || jsonb_build_object(
    'healing_rule',
    jsonb_build_object(
      'discipline_flag', 'discipline_guerison',
      'hp_per_section', 1,
      'skip_when_combat', true,
      'description',
        'Le Loup Solitaire qui maîtrise la Guérison regagne 1 point '
        'd''ENDURANCE à chaque section traversée sans combat '
        '(jamais au-dessus de son total initial).'
    )
  )
  WHERE story_id = v_story_id;
END $$;

-- ------------------------------------------------------------
-- 5. §17 : combat PUIS jet de Hasard sur le même nœud (B5)
-- ------------------------------------------------------------
-- Le livre : on combat le Kraan, puis on tire pour savoir où l'on
-- redescend (0 → 53, 1-2 → 274, 3-9 → 331). On marque explicitement le
-- jet comme « après combat » pour que l'UI n'affiche le dé qu'une fois
-- l'ennemi vaincu, au lieu de laisser la section sans issue.
UPDATE public.story_nodes
SET metadata = jsonb_set(metadata, '{hazard_after_combat}', 'true'::jsonb)
WHERE node_key = 'section_017'
  AND story_id = (SELECT id FROM public.stories WHERE slug = 'les-maitres-des-tenebres');
