-- ================================================================
-- HeroBook — Migration 022 : FK CASCADE pour choice_history
-- ---------------------------------------------------------------
-- Problème remonté : DELETE FROM story_choices violait FK
-- choice_history_choice_id_fkey car history référence encore les choix.
-- Les migrations 018 et 020 nettoyaient les noeuds sans purger history
-- d'abord (corrigé en V3/V4), mais en prod une histoire rejouée peut
-- déjà avoir de l'historique.
--
-- Solution : passer les FK de choice_history en ON DELETE CASCADE / SET NULL
-- pour que la suppression d'une histoire ou d'un noeud/choix ne bloque plus.
-- Idem pour user_story_progress.current_node_id (SET NULL) et
-- user_inventory.story_id (CASCADE déjà présent depuis 017).
-- ================================================================

DO $$
DECLARE
  v_constraint TEXT;
BEGIN
  -- choice_history : story_id
  SELECT conname INTO v_constraint FROM pg_constraint WHERE conrelid='public.choice_history'::regclass AND contype='f' AND conkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid='public.choice_history'::regclass AND attname='story_id')];
  IF v_constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.choice_history DROP CONSTRAINT %I', v_constraint);
  END IF;
  ALTER TABLE public.choice_history ADD CONSTRAINT choice_history_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;

  -- choice_history : node_id
  SELECT conname INTO v_constraint FROM pg_constraint WHERE conrelid='public.choice_history'::regclass AND contype='f' AND conkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid='public.choice_history'::regclass AND attname='node_id')];
  IF v_constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.choice_history DROP CONSTRAINT %I', v_constraint);
  END IF;
  ALTER TABLE public.choice_history ADD CONSTRAINT choice_history_node_id_fkey FOREIGN KEY (node_id) REFERENCES public.story_nodes(id) ON DELETE SET NULL;

  -- choice_history : choice_id
  SELECT conname INTO v_constraint FROM pg_constraint WHERE conrelid='public.choice_history'::regclass AND contype='f' AND conkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid='public.choice_history'::regclass AND attname='choice_id')];
  IF v_constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.choice_history DROP CONSTRAINT %I', v_constraint);
  END IF;
  ALTER TABLE public.choice_history ADD CONSTRAINT choice_history_choice_id_fkey FOREIGN KEY (choice_id) REFERENCES public.story_choices(id) ON DELETE SET NULL;

  -- user_story_progress : current_node_id -> SET NULL pour permettre suppression noeuds
  SELECT conname INTO v_constraint FROM pg_constraint WHERE conrelid='public.user_story_progress'::regclass AND contype='f' AND conkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid='public.user_story_progress'::regclass AND attname='current_node_id')];
  IF v_constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.user_story_progress DROP CONSTRAINT %I', v_constraint);
  END IF;
  ALTER TABLE public.user_story_progress ADD CONSTRAINT user_story_progress_current_node_id_fkey FOREIGN KEY (current_node_id) REFERENCES public.story_nodes(id) ON DELETE SET NULL;

  -- character_stats : story_id déjà CASCADE depuis 001, mais on s'assure
  -- user_inventory : story_id déjà CASCADE depuis 017
END $$;

-- Nettoyage orphelin au cas où des lignes history pointent vers des choix/noeuds supprimés
DELETE FROM public.choice_history WHERE choice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.story_choices WHERE id = choice_history.choice_id);
DELETE FROM public.choice_history WHERE node_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.story_nodes WHERE id = choice_history.node_id);
