-- ================================================================
-- HeroBook - Migration 005 : Achat d'histoires payantes
-- ------------------------------------------------------------
-- Objectif : permettre l'achat d'une histoire avec des gemmes et son
-- déverrouillage (`user_story_progress.is_purchased = TRUE`), de façon
-- non trichable. Conformément à la règle d'or de la migration 004 :
--   * le prix est relu en base (jamais depuis le client)
--   * le débit de gemmes passe par process_wallet_transaction (atomique)
--   * l'écriture de la colonne sensible is_purchased est faite par le
--     serveur (SECURITY DEFINER) — le client n'y a pas accès en écriture
--   * le type de transaction est 'story_purchase' (enum déjà présent en 001)
-- ================================================================

-- ---------------------------------------------------------------
-- purchase_story : achat d'une histoire avec des gemmes + unlock.
--   -> authenticated (logique 100% serveur, non trichable)
-- Retourne : {
--   already_owned, story_id, title, price_gems, gems, coins
-- }
-- Erreurs  : story_not_found / story_not_published / story_is_free
--            story_not_purchasable / insufficient_funds
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purchase_story(p_story_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user  uuid := auth.uid();
  v_story stories%ROWTYPE;
  v_gems  integer;
  v_coins integer;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Prix & disponibilité relus en base (jamais depuis le client)
  SELECT * INTO v_story FROM stories
   WHERE id = p_story_id
   FOR SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'story_not_found';
  END IF;
  IF v_story.status <> 'published' THEN
    RAISE EXCEPTION 'story_not_published';
  END IF;
  IF v_story.is_free THEN
    RAISE EXCEPTION 'story_is_free';
  END IF;
  IF v_story.price_gems IS NULL OR v_story.price_gems <= 0 THEN
    RAISE EXCEPTION 'story_not_purchasable';
  END IF;

  -- Déjà possédée -> idempotent (aucun re-débit)
  IF EXISTS (
    SELECT 1 FROM user_story_progress
    WHERE user_id = v_user AND story_id = p_story_id AND is_purchased
  ) THEN
    SELECT w.gems, w.coins INTO v_gems, v_coins
      FROM wallets w WHERE w.user_id = v_user;
    RETURN jsonb_build_object(
      'already_owned', TRUE,
      'story_id',      p_story_id,
      'title',         v_story.title,
      'gems',          v_gems,
      'coins',         v_coins
    );
  END IF;

  -- Débit atomique + transaction financière (type story_purchase)
  SELECT t.gems, t.coins INTO v_gems, v_coins
    FROM public.process_wallet_transaction(
      v_user, 'story_purchase', -v_story.price_gems, 0,
      NULL, NULL, p_story_id, NULL, NULL, NULL,
      jsonb_build_object('source', 'story_purchase', 'story_slug', v_story.slug)
    ) t;

  -- Déverrouillage (upsert : crée la ligne de progression si absente)
  INSERT INTO user_story_progress (user_id, story_id, is_purchased)
  VALUES (v_user, p_story_id, TRUE)
  ON CONFLICT (user_id, story_id)
  DO UPDATE SET is_purchased = TRUE;

  RETURN jsonb_build_object(
    'already_owned', FALSE,
    'story_id',      p_story_id,
    'title',         v_story.title,
    'price_gems',    v_story.price_gems,
    'gems',          v_gems,
    'coins',         v_coins
  );
END;
$$;

-- ---------------------------------------------------------------
-- Privilèges d'exécution : accessible au client authentifié
-- (logique serveur non trichable) et au service_role.
-- ---------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.purchase_story(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.purchase_story(uuid) TO authenticated, service_role;
