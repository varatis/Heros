-- ================================================================
-- HeroBook — Migration 016 : auto-réparation des comptes + purge des invités
-- ------------------------------------------------------------
-- Problème : certains comptes (surtout d'anciens invités anonymes)
-- existent dans auth.users SANS lignes dans public.profiles /
-- public.wallets (trigger absent à l'époque de leur création, ou
-- lignes purgées à la main). Les pages rendaient alors un « héros
-- fabriqué » (valeurs par défaut) et l'onboarding échouait
-- silencieusement (UPDATE sur une ligne inexistante).
--
-- Solution :
--   1. ensure_profile_and_wallet() — RPC SECURITY DEFINER idempotente
--      qui (re)crée profil + wallet de l'appelant s'ils manquent.
--      Appelée côté serveur sur chaque page du layout principal.
--   2. purge_anonymous_user() — RPC SECURITY DEFINER qui supprime
--      l'utilisateur APPELANT s'il est anonyme (is_anonymous = true).
--      Appelée à la déconnexion d'un invité pour que le « compte
--      fantôme » disparaisse de la base (FK ON DELETE CASCADE).
--      Ne peut JAMAIS supprimer un compte permanent.
-- ================================================================

CREATE OR REPLACE FUNCTION public.ensure_profile_and_wallet()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id          uuid := auth.uid();
  v_username         text;
  v_profile_created  boolean := false;
  v_wallet_created   boolean := false;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Profil manquant → (re)création, même logique que le trigger
  -- handle_new_user (migration 001).
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) THEN
    v_username := 'Héros_' || substring(v_user_id::text, 1, 6);
    INSERT INTO public.profiles (id, username, preferred_lang)
    VALUES (v_user_id, v_username, 'fr');
    v_profile_created := true;
  END IF;

  -- Wallet manquant → (re)création avec les 50 gemmes de bienvenue.
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = v_user_id) THEN
    INSERT INTO public.wallets (user_id, gems, coins, lifetime_gems)
    VALUES (v_user_id, 50, 0, 50);
    v_wallet_created := true;
  END IF;

  RETURN jsonb_build_object(
    'user_id',         v_user_id,
    'profile_created', v_profile_created,
    'wallet_created',  v_wallet_created
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.purge_anonymous_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id      uuid := auth.uid();
  v_is_anonymous boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT is_anonymous INTO v_is_anonymous
  FROM auth.users
  WHERE id = v_user_id;

  -- Garde-fou : on ne supprime JAMAIS un compte permanent par cette voie.
  IF v_is_anonymous IS NOT TRUE THEN
    RETURN false;
  END IF;

  -- Les FK ON DELETE CASCADE purgent profil, wallet, inventaire,
  -- progression, succès et transactions de l'invité.
  DELETE FROM auth.users WHERE id = v_user_id;
  RETURN true;
END;
$$;

-- Client authentifié uniquement (l'anonyme ne doit pas pouvoir appeler
-- ces fonctions sans être connecté).
REVOKE EXECUTE ON FUNCTION public.ensure_profile_and_wallet() FROM anon;
REVOKE EXECUTE ON FUNCTION public.purge_anonymous_user() FROM anon;
GRANT EXECUTE ON FUNCTION public.ensure_profile_and_wallet() TO authenticated;
GRANT EXECUTE ON FUNCTION public.purge_anonymous_user() TO authenticated;
