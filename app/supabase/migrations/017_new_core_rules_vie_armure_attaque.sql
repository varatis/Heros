-- ================================================================
-- HeroBook — Migration 017 : Nouvelles règles génériques
-- Vie / Armure / Attaque + sacoche par aventure
-- ---------------------------------------------------------------
-- Objectifs demandés par le produit :
--  1) Simplifier les règles globales à 3 stats : Vie, Armure, Attaque
--     (le livre Loup Solitaire garde ses règles spécifiques via son
--     rulebook et character_stats.combat_state)
--  2) Sacoche vide au début de chaque aventure, remplie pendant
--     l'aventure. Si on change d'aventure → sacoche vide, mais si on
--     revient sur une ancienne aventure → on récupère ses items.
--
-- Implémentation :
--  - character_stats : ajout armor / attack_power (Vie = hp_current/max)
--    strength = Attaque (compat) et agility = Armure (compat) restent
--    pour Loup Solitaire. Les nouvelles histoires utilisent armor &
--    attack_power en priorité, avec fallback sur agility/strength.
--  - user_inventory : ajout story_id pour cloisonner par aventure.
--    UNIQUE(user_id, item_id) → 2 index partiels :
--      * (user_id, story_id, item_id) WHERE story_id IS NOT NULL
--      * (user_id, item_id) WHERE story_id IS NULL (shop global)
--  - Migration des lignes existantes : story_id = items.story_id
--  - apply_item_effect & purchase_item mis à jour pour story_id
-- ================================================================

-- ------------------------------------------------------------
-- 1. Nouvelles colonnes de stats génériques
-- ------------------------------------------------------------
ALTER TABLE public.character_stats
  ADD COLUMN IF NOT EXISTS armor INTEGER NOT NULL DEFAULT 0 CHECK (armor >= 0),
  ADD COLUMN IF NOT EXISTS attack_power INTEGER NOT NULL DEFAULT 5 CHECK (attack_power >= 0);

-- Synchroniser les nouvelles colonnes depuis les anciennes pour les
-- parties existantes (strength → attack, agility → armor) si elles
-- n'ont jamais été initialisées (armor=0 & attack=5 par défaut).
UPDATE public.character_stats
   SET armor = GREATEST(armor, agility),
       attack_power = GREATEST(attack_power, strength)
 WHERE (armor = 0 AND agility > 0) OR (attack_power = 5 AND strength != 5);

COMMENT ON COLUMN public.character_stats.armor IS 'Armure générique (réduit les dégâts reçus) — nouveau système Vie/Armure/Attaque';
COMMENT ON COLUMN public.character_stats.attack_power IS 'Attaque générique (augmente les dégâts infligés) — nouveau système Vie/Armure/Attaque';

-- ------------------------------------------------------------
-- 2. Inventaire par aventure (sacoche par story)
-- ------------------------------------------------------------
ALTER TABLE public.user_inventory
  ADD COLUMN IF NOT EXISTS story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE;

-- Remplir story_id depuis items.story_id pour les lignes existantes
UPDATE public.user_inventory ui
   SET story_id = i.story_id
  FROM public.items i
 WHERE ui.item_id = i.id
   AND ui.story_id IS NULL
   AND i.story_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_inventory_story ON public.user_inventory(story_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_story ON public.user_inventory(user_id, story_id);

-- Supprimer l'ancienne contrainte UNIQUE(user_id, item_id) si elle existe
DO $$
DECLARE
  v_constraint TEXT;
BEGIN
  SELECT conname INTO v_constraint
  FROM pg_constraint
  WHERE conrelid = 'public.user_inventory'::regclass
    AND contype = 'u'
    AND array_length(conkey,1)=2;

  IF v_constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.user_inventory DROP CONSTRAINT %I', v_constraint);
  END IF;
END $$;

-- Supprimer l'ancien index unique s'il existe encore
DROP INDEX IF EXISTS public.user_inventory_user_id_item_id_key;

-- Nouveaux index uniques partiels : par aventure + global
CREATE UNIQUE INDEX IF NOT EXISTS user_inventory_user_story_item_unique
  ON public.user_inventory(user_id, story_id, item_id)
  WHERE story_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_inventory_user_item_unique_global
  ON public.user_inventory(user_id, item_id)
  WHERE story_id IS NULL;

-- ------------------------------------------------------------
-- 3. Mise à jour de apply_item_effect pour supporter armor/attack
--    et l'inventaire par story
-- ------------------------------------------------------------
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

  -- L'objet doit être dans l'inventaire de CETTE aventure (ou global si p_story_id NULL)
  -- On cherche d'abord avec story_id, puis fallback global pour compat shop
  SELECT i.id, i.quantity INTO v_inv_id, v_qty
  FROM user_inventory i
  WHERE i.user_id = p_user_id
    AND i.item_id = p_item_id
    AND i.quantity > 0
    AND (i.story_id = p_story_id OR (p_story_id IS NOT NULL AND i.story_id IS NULL) OR (p_story_id IS NULL AND i.story_id IS NULL))
  ORDER BY CASE WHEN i.story_id = p_story_id THEN 0 ELSE 1 END
  LIMIT 1
  FOR UPDATE;

  -- Fallback strict story
  IF NOT FOUND AND p_story_id IS NOT NULL THEN
    SELECT i.id, i.quantity INTO v_inv_id, v_qty
    FROM user_inventory i
    WHERE i.user_id = p_user_id AND i.item_id = p_item_id AND i.quantity > 0 AND i.story_id = p_story_id
    FOR UPDATE;
  END IF;

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

  -- Stats du run (créées au besoin)
  INSERT INTO character_stats (user_id, story_id)
  VALUES (p_user_id, p_story_id)
  ON CONFLICT (user_id, story_id) DO NOTHING;

  SELECT * INTO v_stats FROM character_stats
  WHERE user_id = p_user_id AND story_id = p_story_id
  FOR UPDATE;

  v_bonus := COALESCE(v_item.stat_bonus, '{}'::jsonb);
  v_hp_before := v_stats.hp_current;

  -- Soin plafonné
  IF (v_bonus ->> 'hp') IS NOT NULL THEN
    v_stats.hp_current := LEAST(
      v_stats.hp_current + (v_bonus ->> 'hp')::int,
      v_stats.hp_max
    );
    v_healed := v_stats.hp_current - v_hp_before;
  END IF;

  -- Nouveau système + ancien système (compat)
  IF (v_bonus ->> 'armor') IS NOT NULL THEN
    v_stats.armor := v_stats.armor + (v_bonus ->> 'armor')::int;
  END IF;
  IF (v_bonus ->> 'attack') IS NOT NULL OR (v_bonus ->> 'attack_power') IS NOT NULL THEN
    v_stats.attack_power := v_stats.attack_power + COALESCE((v_bonus ->> 'attack')::int, (v_bonus ->> 'attack_power')::int, 0);
  END IF;
  -- Compat Loup Solitaire
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
  IF (v_bonus ->> 'hp_max') IS NOT NULL THEN
    v_stats.hp_max := v_stats.hp_max + (v_bonus ->> 'hp_max')::int;
    v_stats.hp_current := v_stats.hp_current + (v_bonus ->> 'hp_max')::int;
  END IF;

  UPDATE character_stats
     SET hp_current = v_stats.hp_current,
         hp_max = v_stats.hp_max,
         strength   = v_stats.strength,
         agility    = v_stats.agility,
         luck       = v_stats.luck,
         charisma   = v_stats.charisma,
         armor = v_stats.armor,
         attack_power = v_stats.attack_power,
         updated_at = NOW()
   WHERE user_id = p_user_id AND story_id = p_story_id;

  -- Décrément
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
    'charisma',    v_stats.charisma,
    'armor',       v_stats.armor,
    'attack_power',v_stats.attack_power
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.apply_item_effect(uuid, uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_item_effect(uuid, uuid, uuid) TO service_role;

-- ------------------------------------------------------------
-- 4. purchase_item : achat boutique reste global (story_id NULL)
--    mais on autorise le conflit partiel
-- ------------------------------------------------------------
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

  SELECT t.gems, t.coins INTO v_gems, v_coins
    FROM public.process_wallet_transaction(
      v_user, 'item_purchase', -v_item.price_gems, 0,
      NULL, p_item_id, NULL, NULL, NULL, NULL,
      jsonb_build_object('source', 'shop', 'item_slug', v_item.slug)
    ) t;

  -- Boutique = global (story_id NULL)
  INSERT INTO user_inventory (user_id, item_id, quantity, story_id)
  VALUES (v_user, p_item_id, 1, NULL)
  ON CONFLICT (user_id, item_id) WHERE story_id IS NULL
  DO UPDATE SET quantity = user_inventory.quantity + 1
  RETURNING user_inventory.quantity INTO v_qty;

  -- Si l'index partiel n'existe pas (fallback), essayer l'upsert classique
  IF v_qty IS NULL THEN
    INSERT INTO user_inventory (user_id, item_id, quantity, story_id)
    VALUES (v_user, p_item_id, 1, NULL)
    ON CONFLICT (user_id, story_id, item_id) WHERE story_id IS NOT NULL
    DO UPDATE SET quantity = user_inventory.quantity + 1
    RETURNING user_inventory.quantity INTO v_qty;
  END IF;

  RETURN jsonb_build_object(
    'item_name',  v_item.name,
    'item_id',    p_item_id,
    'quantity',   COALESCE(v_qty,1),
    'price_gems', v_item.price_gems,
    'gems',       v_gems,
    'coins',      v_coins
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.purchase_item(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.purchase_item(uuid) TO authenticated, service_role;

-- ------------------------------------------------------------
-- 5. claim_achievements : compter l'inventaire par story OU global
-- ------------------------------------------------------------
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

REVOKE EXECUTE ON FUNCTION public.claim_achievements(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_achievements(uuid) TO authenticated, service_role;
