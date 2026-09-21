-- ============================================================================
-- HEROS — RESET COMPLET DU SCHÉMA PUBLIC
--
-- À exécuter uniquement dans le projet Supabase que vous voulez reconstruire.
-- Ce script supprime toutes les tables, fonctions, types, policies et données
-- du schéma public, puis le recrée vide.
--
-- Il ne supprime PAS les utilisateurs Supabase Auth (schéma auth), ni les
-- fichiers Storage. Faites une sauvegarde avant toute exécution.
--
-- Après ce reset, rejouer :
--   1. app/supabase/migrations/*.sql (ordre lexical ; préfixes retirés absents)
--   2. app/supabase/seed/*.sql       (ordre lexical 001 → 005)
--
-- Alternative recommandée pour un projet de dev/staging :
--   supabase db reset --linked
-- (la commande rejoue automatiquement les migrations et les seeds configurés).
-- ============================================================================

BEGIN;

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Rétablir les droits attendus par Supabase/PostgREST.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Les migrations créent ensuite les objets dans public. Ces droits par défaut
-- évitent de reproduire un problème de permissions après le reset manuel.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;

COMMIT;
