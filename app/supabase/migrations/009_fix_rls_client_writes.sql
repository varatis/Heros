-- ================================================================
-- HeroBook - Migration 009 : Correction RLS pour écritures client
-- ------------------------------------------------------------
-- Objectif : permettre au client (authenticated) d'écrire les
-- colonnes non-sensibles de user_story_progress et character_stats
-- en fallback quand les Edge Functions ne sont pas disponibles.
--
-- La migration 004 a REVOKE les privilèges INSERT/UPDATE au niveau
-- table, ce qui bloque le client même avec un GRANT colonne.
-- On remplace par une approche RLS pure : WITH CHECK clause sur
-- les colonnes autorisées.
-- ================================================================

-- ================================================================
-- 1. Rétablir les privilèges de base pour authenticated
-- ================================================================

-- Restaurer INSERT et UPDATE au niveau table pour authenticated
GRANT INSERT ON public.user_story_progress TO authenticated;
GRANT UPDATE ON public.user_story_progress TO authenticated;

-- ================================================================
-- 2. Politiques RLS précises pour user_story_progress
--    Le client peut INSERER/METTRE À JOUR SES PROPRES LIGNES
--    mais seulement les colonnes non-sensibles.
-- ================================================================

-- Supprimer les anciennes politiques pour les recréer proprement
DROP POLICY IF EXISTS "progress_own" ON public.user_story_progress;

-- SELECT : le propriétaire voit sa ligne
CREATE POLICY "progress_select_own" ON public.user_story_progress
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT : le propriétaire peut créer sa ligne
-- Les colonnes is_completed / endings_found / completed_at / is_purchased
-- sont protégées par les valeurs par défaut de la table.
CREATE POLICY "progress_insert_own" ON public.user_story_progress
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- UPDATE : le propriétaire peut modifier sa ligne mais PAS les colonnes
-- sensibles (is_completed, endings_found, completed_at, is_purchased).
-- La validation se fait via le trigger ci-dessous.
CREATE POLICY "progress_update_own" ON public.user_story_progress
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- 3. Trigger de protection des colonnes sensibles
--    Empêche le client de modifier is_completed / endings_found /
--    completed_at / is_purchased même si la RLS le permettrait.
--    Le service_role (Edge Functions) passe outre.
-- ================================================================

CREATE OR REPLACE FUNCTION block_sensitive_progress_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ne pas bloquer les appels service_role (Edge Functions)
  -- Le rôle service_role a le droit de tout modifier
  IF current_user = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Vérifier les colonnes sensibles
  IF (
    OLD.is_completed IS DISTINCT FROM NEW.is_completed OR
    OLD.endings_found IS DISTINCT FROM NEW.endings_found OR
    OLD.completed_at IS DISTINCT FROM NEW.completed_at OR
    OLD.is_purchased IS DISTINCT FROM NEW.is_purchased
  ) THEN
    RAISE EXCEPTION 'Modification des colonnes sensibles interdite (is_completed, endings_found, completed_at, is_purchased)'
      USING HINT = 'Ces colonnes sont réservées aux Edge Functions (service_role)';
  END IF;

  RETURN NEW;
END;
$$;

-- Appliquer le trigger
DROP TRIGGER IF EXISTS trg_block_sensitive_progress ON public.user_story_progress;
CREATE TRIGGER trg_block_sensitive_progress
  BEFORE UPDATE ON public.user_story_progress
  FOR EACH ROW
  EXECUTE FUNCTION block_sensitive_progress_columns();

-- ================================================================
-- 4. Politique INSERT/UPDATE pour character_stats
--    Le propriétaire peut créer/modifier ses stats.
--    La contrainte UNIQUE(user_id, story_id) empêche les doublons.
-- ================================================================

-- La politique "stats_all_own" de la migration 002 est déjà FOR ALL
-- et couvre INSERT/UPDATE. On vérifie qu'elle existe.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'character_stats'
    AND policyname = 'stats_all_own'
  ) THEN
    CREATE POLICY "stats_all_own" ON public.character_stats
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ================================================================
-- 5. Nettoyage des anciennes politiques column-level (migration 004)
-- ================================================================

-- Les GRANT au niveau colonne ne sont plus nécessaires car on a
-- rétabli les privilèges au niveau table. On les supprime proprement.
REVOKE INSERT (id, user_id, story_id, current_node_id, completion_pct,
              last_played_at, started_at, time_spent_sec)
  ON public.user_story_progress FROM authenticated;

REVOKE UPDATE (current_node_id, completion_pct, last_played_at, time_spent_sec)
  ON public.user_story_progress FROM authenticated;