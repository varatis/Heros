-- ================================================================
-- HeroBook - Migration 004 : Sécurisation de la monétisation
-- ------------------------------------------------------------
-- Objectif : le client ne peut PLUS écrire dans wallets, transactions,
-- user_inventory ni user_achievements. Toutes les mutations sensibles
-- passent par :
--   1. Des fonctions SQL SECURITY DEFINER atomiques (RPC)
--   2. Les Edge Functions (service_role) :
--        - make-choice        (choix premium, effets, récompenses de fin)
--        - apply-item-effect  (consommation d'objets)
--        - validate-purchase  (webhook RevenueCat -> crédit gemmes)
--        - grant-daily-reward (streak quotidien)
--
-- Menus fermés au client :
--   * wallets            : lecture seule (SELECT own)
--   * transactions       : lecture seule (SELECT own)
--   * user_inventory     : lecture seule (SELECT own)
--   * user_achievements  : lecture seule (SELECT own)
--   * user_story_progress: écriture partielle (colonnes non sensibles ;
--     is_completed / endings_found / completed_at réservés au serveur)
-- ================================================================

-- ================================================================
-- 1. VERROUILLAGE RLS — lecture seule pour tout ce qui vaut des gemmes
-- ================================================================

-- Wallets : le client ne peut plus créditer/débiter directement
DROP POLICY IF EXISTS "wallets_all_own" ON public.wallets;
CREATE POLICY "wallets_select_own" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

-- Transactions : historique financier serveur uniquement
DROP POLICY IF EXISTS "transactions_all_own" ON public.transactions;
CREATE POLICY "transactions_select_own" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Inventaire : les items sont accordés par le serveur (achat/effets)
DROP POLICY IF EXISTS "inventory_all_own" ON public.user_inventory;
CREATE POLICY "inventory_select_own" ON public.user_inventory
  FOR SELECT USING (auth.uid() = user_id);

-- Succès débloqués : accordés par le serveur (claim_achievements)
DROP POLICY IF EXISTS "user_achievements_all_own" ON public.user_achievements;
CREATE POLICY "user_achievements_select_own" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- ================================================================
-- 2. PRIVILÈGES COLONNES sur user_story_progress
--    is_completed / endings_found / completed_at conditionnent l'octroi
--    de gemmes (1ère victoire) et de succès -> réservés au serveur.
-- ================================================================

REVOKE INSERT, UPDATE ON public.user_story_progress FROM authenticated, anon;

-- Le client peut toujours créer/reprendre une partie et suivre la progression
GRANT INSERT (id, user_id, story_id, current_node_id, completion_pct,
              last_played_at, started_at, time_spent_sec)
  ON public.user_story_progress TO authenticated;
GRANT UPDATE (current_node_id, completion_pct, last_played_at, time_spent_sec)
  ON public.user_story_progress TO authenticated;

-- ================================================================
-- 3. RPC ATOMIQUES (SECURITY DEFINER)
--    Toutes : search_path épinglé + EXECUTE révoqué de PUBLIC/anon.
-- ================================================================

-- ---------------------------------------------------------------
-- 3a. process_wallet_transaction : LE point d'entrée unique des
--     mouvements de gemmes/pièces. Atomique (verrou de ligne),
--     insère la transaction, retourne les nouveaux soldes.
--     -> service_role uniquement (Edge Functions)
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.process_wallet_transaction(
  p_user_id        uuid,
  p_type           public.transaction_type,
  p_gems_delta     integer DEFAULT 0,
  p_coins_delta    integer DEFAULT 0,
  p_amount_usd     numeric     DEFAULT NULL,
  p_item_id        uuid        DEFAULT NULL,
  p_story_id       uuid        DEFAULT NULL,
  p_rc_txn_id      text        DEFAULT NULL,
  p_store_product_id text      DEFAULT NULL,
  p_platform       text        DEFAULT NULL,
  p_metadata       jsonb       DEFAULT '{}'::jsonb
)
RETURNS TABLE (gems integer, coins integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Vérifier que le wallet existe (évite un UPDATE silencieux à vide)
  IF NOT EXISTS (SELECT 1 FROM wallets WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'wallet_not_found';
  END IF;

  -- Idempotence RevenueCat : une rediffusion de webhook ne crédite pas 2 fois.
  -- (le RAISE annule toute la transaction SQL, débit inclus)
  IF p_rc_txn_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM transactions WHERE revenuecat_transaction_id = p_rc_txn_id
  ) THEN
    RAISE EXCEPTION 'duplicate_transaction';
  END IF;

  -- Débit atomique : la condition gems + delta >= 0 empêche tout solde négatif
  UPDATE wallets
     SET gems          = wallets.gems + p_gems_delta,
         coins         = wallets.coins + p_coins_delta,
         lifetime_gems = wallets.lifetime_gems + GREATEST(p_gems_delta, 0),
         updated_at    = NOW()
   WHERE user_id = p_user_id
     AND wallets.gems + p_gems_delta >= 0
     AND wallets.coins + p_coins_delta >= 0
  RETURNING wallets.gems, wallets.coins INTO gems, coins;

  IF gems IS NULL THEN
    RAISE EXCEPTION 'insufficient_funds';
  END IF;

  INSERT INTO transactions (
    user_id, type, status, amount_usd, gems_delta, coins_delta,
    revenuecat_transaction_id, store_product_id, platform,
    item_id, story_id, metadata
  ) VALUES (
    p_user_id, p_type, 'completed', p_amount_usd, p_gems_delta, p_coins_delta,
    p_rc_txn_id, p_store_product_id, p_platform,
    p_item_id, p_story_id, p_metadata
  );

  -- RETURNS TABLE : émettre la ligne (gems, coins)
  RETURN NEXT;
END;
$$;

-- ---------------------------------------------------------------
-- 3b. purchase_item : achat d'un objet de boutique avec des gemmes.
--     Prix & disponibilité relus côté serveur, débit atomique,
--     octroi d'inventaire + transaction, le tout dans UNE transaction SQL.
--     -> accordée à authenticated (logique 100% serveur, non trichable)
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purchase_item(p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user  uuid  := auth.uid();
  v_item  items%ROWTYPE;
  v_gems  integer;
  v_coins integer;
  v_qty   integer;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT * INTO v_item FROM items
   WHERE id = p_item_id AND is_available
   FOR SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'item_not_found';
  END IF;
  IF v_item.price_gems IS NULL OR v_item.price_gems <= 0 THEN
    RAISE EXCEPTION 'item_not_purchasable';
  END IF;

  -- Débit + transaction financière (RAISE insufficient_funds si solde bas)
  SELECT t.gems, t.coins INTO v_gems, v_coins
    FROM public.process_wallet_transaction(
      v_user, 'item_purchase', -v_item.price_gems, 0,
      NULL, p_item_id, NULL, NULL, NULL, NULL,
      jsonb_build_object('source', 'shop', 'item_slug', v_item.slug)
    ) t;

  -- Octroi de l'objet (avant la transaction DB du débit, même transaction)
  INSERT INTO user_inventory (user_id, item_id, quantity)
  VALUES (v_user, p_item_id, 1)
  ON CONFLICT (user_id, item_id)
  DO UPDATE SET quantity = user_inventory.quantity + 1
  RETURNING user_inventory.quantity INTO v_qty;

  RETURN jsonb_build_object(
    'item_name',  v_item.name,
    'item_id',    p_item_id,
    'quantity',   v_qty,
    'price_gems', v_item.price_gems,
    'gems',       v_gems,
    'coins',      v_coins
  );
END;
$$;

-- ---------------------------------------------------------------
-- 3c. claim_daily_reward : streak quotidien + récompense.
--     Formule : 10 gemmes + 2/jour de streak (plafond jour 8 = 24),
--     pièces : 5/jour (plafond jour 5 = 25).
--     -> service_role uniquement (Edge Function grant-daily-reward)
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_daily_reward(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_profile     profiles%ROWTYPE;
  v_today       date := current_date;
  v_streak      integer;
  v_reward_gems integer;
  v_reward_coins integer;
  v_gems        integer;
  v_coins       integer;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'profile_not_found';
  END IF;

  -- Déjà réclamé aujourd'hui -> idempotent
  IF v_profile.streak_last_at = v_today THEN
    SELECT w.gems, w.coins INTO v_gems, v_coins
      FROM wallets w WHERE w.user_id = p_user_id;
    RETURN jsonb_build_object(
      'already_claimed', TRUE,
      'streak_days',     v_profile.streak_days,
      'reward_gems',     0,
      'reward_coins',    0,
      'gems',            v_gems,
      'coins',           v_coins
    );
  END IF;

  -- Streak : +1 si dernier claim hier, sinon reset à 1
  IF v_profile.streak_last_at = v_today - 1 THEN
    v_streak := COALESCE(v_profile.streak_days, 0) + 1;
  ELSE
    v_streak := 1;
  END IF;

  v_reward_gems  := 10 + (LEAST(v_streak, 8) - 1) * 2;
  v_reward_coins := LEAST(v_streak, 5) * 5;

  UPDATE profiles
     SET streak_days    = v_streak,
         streak_last_at = v_today,
         updated_at     = NOW()
   WHERE id = p_user_id;

  SELECT t.gems, t.coins INTO v_gems, v_coins
    FROM public.process_wallet_transaction(
      p_user_id, 'gem_reward', v_reward_gems, v_reward_coins,
      NULL, NULL, NULL, NULL, NULL, NULL,
      jsonb_build_object('reason', 'daily_streak', 'streak_days', v_streak)
    ) t;

  RETURN jsonb_build_object(
    'already_claimed', FALSE,
    'streak_days',     v_streak,
    'reward_gems',     v_reward_gems,
    'reward_coins',    v_reward_coins,
    'gems',            v_gems,
    'coins',           v_coins
  );
END;
$$;

-- ---------------------------------------------------------------
-- 3d. claim_achievements : revalide TOUTES les conditions côté serveur,
--     débloque les nouveaux succès et crédite les récompenses.
--     -> authenticated (client) ET service_role (make-choice)
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_achievements(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user        uuid;
  v_completed   integer;
  v_endings     integer;
  v_items       integer;
  v_unlocked    jsonb := '[]'::jsonb;
  v_gems        integer := NULL;
  v_coins       integer := NULL;
  v_total_gems  integer := 0;
  v_total_coins integer := 0;
  v_ach         achievements%ROWTYPE;
  v_wallet      wallets%ROWTYPE;
BEGIN
  v_user := COALESCE(p_user_id, auth.uid());
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Compteurs recalculés côté serveur (jamais depuis le client)
  SELECT
    COUNT(*) FILTER (WHERE p.is_completed),
    COALESCE(SUM(array_length(p.endings_found, 1)), 0)
    INTO v_completed, v_endings
  FROM user_story_progress p
  WHERE p.user_id = v_user;

  SELECT COUNT(*) INTO v_items
  FROM user_inventory i
  WHERE i.user_id = v_user AND i.quantity > 0;

  FOR v_ach IN
    SELECT a.* FROM achievements a
    WHERE NOT EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.user_id = v_user AND ua.achievement_id = a.id
    )
    FOR SHARE
  LOOP
    IF NOT (
      (v_ach.condition_type = 'stories_completed' AND v_completed >= v_ach.condition_value)
      OR (v_ach.condition_type = 'victories'         AND v_completed >= v_ach.condition_value)
      OR (v_ach.condition_type = 'endings_found'     AND v_endings   >= v_ach.condition_value)
      OR (v_ach.condition_type = 'items_owned'       AND v_items     >= v_ach.condition_value)
    ) THEN
      CONTINUE;
    END IF;

    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (v_user, v_ach.id)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;

    IF v_ach.reward_gems > 0 OR v_ach.reward_coins > 0 THEN
      SELECT t.gems, t.coins INTO v_gems, v_coins
        FROM public.process_wallet_transaction(
          v_user, 'gem_reward', v_ach.reward_gems, v_ach.reward_coins,
          NULL, NULL, NULL, NULL, NULL, NULL,
          jsonb_build_object('reason', 'achievement', 'slug', v_ach.slug)
        ) t;
      v_total_gems  := v_total_gems  + v_ach.reward_gems;
      v_total_coins := v_total_coins + v_ach.reward_coins;
    END IF;

    v_unlocked := v_unlocked || jsonb_build_object(
      'name',        v_ach.name,
      'slug',        v_ach.slug,
      'reward_gems', v_ach.reward_gems
    );
  END LOOP;

  SELECT * INTO v_wallet FROM wallets WHERE user_id = v_user;

  RETURN jsonb_build_object(
    'unlocked',    v_unlocked,
    'gems',        v_wallet.gems,
    'coins',       v_wallet.coins,
    'gems_gained', v_total_gems,
    'coins_gained',v_total_coins
  );
END;
$$;

-- ---------------------------------------------------------------
-- 3e. apply_item_effect : consomme un objet de l'inventaire et applique
--     son effet sur character_stats (ex : potion soigne).
--     -> service_role uniquement (Edge Function apply-item-effect)
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.apply_item_effect(
  p_user_id  uuid,
  p_item_id  uuid,
  p_story_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_item      items%ROWTYPE;
  v_inv_id    uuid;
  v_qty       integer;
  v_bonus     jsonb;
  v_stats     character_stats%ROWTYPE;
  v_hp_before integer;
  v_healed    integer := 0;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- L'objet doit être dans l'inventaire avec quantité > 0
  SELECT i.id, i.quantity INTO v_inv_id, v_qty
  FROM user_inventory i
  WHERE i.user_id = p_user_id AND i.item_id = p_item_id AND i.quantity > 0
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'item_not_owned';
  END IF;

  SELECT * INTO v_item FROM items WHERE id = p_item_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'item_not_found';
  END IF;
  IF NOT v_item.is_consumable THEN
    RAISE EXCEPTION 'item_not_consumable';
  END IF;

  -- Stats du run (créées au besoin avec les valeurs par défaut)
  INSERT INTO character_stats (user_id, story_id)
  VALUES (p_user_id, p_story_id)
  ON CONFLICT (user_id, story_id) DO NOTHING;

  SELECT * INTO v_stats FROM character_stats
  WHERE user_id = p_user_id AND story_id = p_story_id
  FOR UPDATE;

  v_bonus := COALESCE(v_item.stat_bonus, '{}'::jsonb);
  v_hp_before := v_stats.hp_current;

  -- Soin plafonné au hp_max courant
  IF (v_bonus ->> 'hp') IS NOT NULL THEN
    v_stats.hp_current := LEAST(
      v_stats.hp_current + (v_bonus ->> 'hp')::int,
      v_stats.hp_max
    );
    v_healed := v_stats.hp_current - v_hp_before;
  END IF;

  -- Autres bonus éventuels (strength, agility, luck, charisma)
  IF (v_bonus ->> 'strength') IS NOT NULL THEN
    v_stats.strength := v_stats.strength + (v_bonus ->> 'strength')::int;
  END IF;
  IF (v_bonus ->> 'agility') IS NOT NULL THEN
    v_stats.agility := v_stats.agility + (v_bonus ->> 'agility')::int;
  END IF;
  IF (v_bonus ->> 'luck') IS NOT NULL THEN
    v_stats.luck := v_stats.luck + (v_bonus ->> 'luck')::int;
  END IF;
  IF (v_bonus ->> 'charisma') IS NOT NULL THEN
    v_stats.charisma := v_stats.charisma + (v_bonus ->> 'charisma')::int;
  END IF;

  UPDATE character_stats
     SET hp_current = v_stats.hp_current,
         strength   = v_stats.strength,
         agility    = v_stats.agility,
         luck       = v_stats.luck,
         charisma   = v_stats.charisma,
         updated_at = NOW()
   WHERE user_id = p_user_id AND story_id = p_story_id;

  -- Décrément (suppression si stock épuisé)
  v_qty := v_qty - 1;
  IF v_qty <= 0 THEN
    DELETE FROM user_inventory WHERE id = v_inv_id;
  ELSE
    UPDATE user_inventory SET quantity = v_qty WHERE id = v_inv_id;
  END IF;

  RETURN jsonb_build_object(
    'item_name',   v_item.name,
    'quantity',    GREATEST(v_qty, 0),
    'healed',      v_healed,
    'hp_current',  v_stats.hp_current,
    'hp_max',      v_stats.hp_max,
    'strength',    v_stats.strength,
    'agility',     v_stats.agility,
    'luck',        v_stats.luck,
    'charisma',    v_stats.charisma
  );
END;
$$;

-- ================================================================
-- 4. PRIVILÈGES D'EXÉCUTION
--    Par défaut PostgreSQL accorde EXECUTE à PUBLIC -> on révoque,
--    puis on accorde explicitement.
-- ================================================================

-- service_role uniquement (Edge Functions)
REVOKE EXECUTE ON FUNCTION public.process_wallet_transaction(uuid, public.transaction_type, integer, integer, numeric, uuid, uuid, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_wallet_transaction(uuid, public.transaction_type, integer, integer, numeric, uuid, uuid, text, text, text, jsonb) TO service_role;

REVOKE EXECUTE ON FUNCTION public.claim_daily_reward(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_daily_reward(uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.apply_item_effect(uuid, uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_item_effect(uuid, uuid, uuid) TO service_role;

-- accessibles au client (logique serveur non trichable)
REVOKE EXECUTE ON FUNCTION public.purchase_item(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.purchase_item(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.claim_achievements(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_achievements(uuid) TO authenticated, service_role;

-- ================================================================
-- 5. INDEX de performance pour les nouveaux chemins de requête
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_transactions_rc_txn
  ON public.transactions(revenuecat_transaction_id)
  WHERE revenuecat_transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_user_created
  ON public.transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallets_user
  ON public.wallets(user_id);
