-- ============================================================================
-- HEROS — RESET propre pour Loup Solitaire 01 & 02
-- À exécuter DANS Supabase SQL Editor, APRÈS avoir vérifié que vous êtes
-- bien sur la bonne base (prod / dev).
--
-- Objectif : repartir d'une base propre après les 25 migrations sales
-- (doublons 004/005/007/008, purge commentée, deux moteurs stories vs lw_*).
--
-- Ce script NE supprime PAS les tables, seulement les données des 2 livres.
-- Il est idempotent et sûr à rejouer.
-- ============================================================================

BEGIN;

-- 1. Nouveau moteur lw_* (celui utilisé par app/lib/library.ts)

-- Sauvegardes de partie (si existantes)
DELETE FROM public.lw_sauvegardes
WHERE livre_slug IN ('loup-solitaire-01', 'loup-solitaire-02');

-- Fins débloquées
DELETE FROM public.lw_fins
WHERE livre_slug IN ('loup-solitaire-01', 'loup-solitaire-02');

-- Bibliothèque utilisateur (achats)
DELETE FROM public.lw_livres_utilisateur
WHERE livre_slug IN ('loup-solitaire-01', 'loup-solitaire-02');

-- Contenu paragraphes
DELETE FROM public.lw_sections
WHERE livre_slug IN ('loup-solitaire-01', 'loup-solitaire-02');

-- Catalogue livres (sera recréé par 01 et 02)
DELETE FROM public.lw_livres
WHERE slug IN ('loup-solitaire-01', 'loup-solitaire-02');

-- 2. Ancien moteur stories/story_nodes (si encore présent)
-- Ce moteur contenait Les Maîtres des Ténèbres en 350 sections
-- avec 25 fausses fins documentées dans AUDIT_MAITRES_DES_TENEBRES.md

DO $$
DECLARE
  v_story_id UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'les-maitres-des-tenebres';
  IF v_story_id IS NOT NULL THEN
    DELETE FROM public.story_nodes WHERE story_id = v_story_id;
    DELETE FROM public.user_story_progress WHERE story_id = v_story_id;
    DELETE FROM public.stories WHERE id = v_story_id;
    RAISE NOTICE 'Ancien moteur les-maitres-des-tenebres purgé';
  END IF;
END $$;

COMMIT;

-- Vérif
-- SELECT slug, titre, nb_paragraphes FROM public.lw_livres ORDER BY numero;
-- SELECT livre_slug, COUNT(*) FROM public.lw_sections GROUP BY livre_slug;
