-- ================================================================
-- HeroBook - Migration 002 : Correction des Politiques RLS & Ajout d'Items
-- ================================================================

-- 1. Autoriser UPDATE sur les wallets
DROP POLICY IF EXISTS "wallets_select_own" ON public.wallets;
CREATE POLICY "wallets_all_own" ON public.wallets
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Autoriser INSERT & UPDATE sur user_story_progress
DROP POLICY IF EXISTS "progress_own" ON public.user_story_progress;
CREATE POLICY "progress_all_own" ON public.user_story_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Autoriser INSERT & UPDATE sur character_stats
DROP POLICY IF EXISTS "stats_own" ON public.character_stats;
CREATE POLICY "stats_all_own" ON public.character_stats
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Autoriser INSERT sur choice_history
DROP POLICY IF EXISTS "history_own" ON public.choice_history;
CREATE POLICY "history_all_own" ON public.choice_history
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Autoriser INSERT & UPDATE sur user_inventory
DROP POLICY IF EXISTS "inventory_own" ON public.user_inventory;
CREATE POLICY "inventory_all_own" ON public.user_inventory
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Autoriser INSERT sur transactions
DROP POLICY IF EXISTS "transactions_own" ON public.transactions;
CREATE POLICY "transactions_all_own" ON public.transactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Autoriser INSERT sur user_achievements
DROP POLICY IF EXISTS "user_achievements_own" ON public.user_achievements;
CREATE POLICY "user_achievements_all_own" ON public.user_achievements
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- Insérer les items de la boutique dans la table items
-- ================================================================

INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, price_gems, is_available)
VALUES
  ('potion-vitalite', 'Potion de Vitalité', 'Restaure instantanément 5 points de vie lors d''un passage difficile.', 'potion', 'common', '{"hp": 5}', TRUE, 30, TRUE),
  ('dague-ombre', 'Dague d''Ombre', 'Une lame acérée qui accorde un bonus de +3 en Force.', 'weapon', 'rare', '{"strength": 3}', FALSE, 80, TRUE),
  ('amulette-chance', 'Amulette de Chance', 'Un bijou étincelant qui confère +4 en Chance pour trouver des passages secrets.', 'artifact', 'rare', '{"luck": 4}', FALSE, 120, TRUE),
  ('bouclier-gardien', 'Bouclier du Gardien', 'Une protection robuste réduisant les dégâts subis (+5 PV Max).', 'armor', 'epic', '{"hp_max": 5}', FALSE, 150, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Corriger les drapeaux is_start et is_ending pour les noeuds de l'histoire démo
UPDATE public.story_nodes SET is_start = FALSE, is_ending = TRUE, ending_type = 'victory' WHERE node_key = 'victoire';
UPDATE public.story_nodes SET is_start = FALSE, is_ending = TRUE, ending_type = 'death' WHERE node_key = 'game_over';
UPDATE public.story_nodes SET is_start = TRUE, is_ending = FALSE WHERE node_key = 'debut';
