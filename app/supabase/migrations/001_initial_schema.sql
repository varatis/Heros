-- ================================================================
-- HeroBook - Migration initiale complète
-- Version: 001
-- ================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- ENUMS
-- ================================================================

CREATE TYPE story_genre AS ENUM (
  'fantasy', 'adventure', 'mystery', 'scifi', 'horror', 'romance'
);

CREATE TYPE story_status AS ENUM (
  'draft', 'published', 'archived'
);

CREATE TYPE item_type AS ENUM (
  'weapon', 'potion', 'armor', 'artifact', 'avatar_skin', 'chapter_unlock', 'ending_unlock'
);

CREATE TYPE item_rarity AS ENUM (
  'common', 'uncommon', 'rare', 'epic', 'legendary'
);

CREATE TYPE transaction_type AS ENUM (
  'gem_purchase', 'gem_spend', 'gem_reward', 'story_purchase', 'item_purchase'
);

CREATE TYPE transaction_status AS ENUM (
  'pending', 'completed', 'failed', 'refunded'
);

CREATE TYPE choice_effect_type AS ENUM (
  'stat_modifier', 'inventory_add', 'inventory_require', 'flag_set', 'flag_require'
);

-- ================================================================
-- TABLES
-- ================================================================

-- Profil utilisateur (extension de auth.users)
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL,
  avatar_url      TEXT,
  avatar_skin_id  UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  last_login_at   TIMESTAMPTZ,
  is_premium      BOOLEAN DEFAULT FALSE,
  preferred_lang  TEXT DEFAULT 'fr',
  dark_mode       BOOLEAN DEFAULT TRUE,
  streak_days     INTEGER DEFAULT 0,
  streak_last_at  DATE
);

-- Wallet virtuel
CREATE TABLE public.wallets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gems            INTEGER NOT NULL DEFAULT 0 CHECK (gems >= 0),
  coins           INTEGER NOT NULL DEFAULT 0 CHECK (coins >= 0),
  lifetime_gems   INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Histoires
CREATE TABLE public.stories (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                    TEXT UNIQUE NOT NULL,
  title                   TEXT NOT NULL,
  tagline                 TEXT,
  description             TEXT,
  cover_image_url         TEXT,
  genre                   story_genre NOT NULL,
  status                  story_status DEFAULT 'draft',
  is_free                 BOOLEAN DEFAULT FALSE,
  price_gems              INTEGER,
  price_usd               NUMERIC(6,2),
  revenuecat_product_id   TEXT,
  estimated_playtime_min  INTEGER,
  min_age                 INTEGER DEFAULT 7,
  author_note             TEXT,
  total_nodes             INTEGER DEFAULT 0,
  total_endings           INTEGER DEFAULT 0,
  difficulty              SMALLINT DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  tags                    TEXT[] DEFAULT '{}',
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  published_at            TIMESTAMPTZ
);

-- Noeuds narratifs
CREATE TABLE public.story_nodes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id          UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  node_key          TEXT NOT NULL,
  title             TEXT,
  content           TEXT NOT NULL,
  illustration_url  TEXT,
  is_start          BOOLEAN DEFAULT FALSE,
  is_ending         BOOLEAN DEFAULT FALSE,
  ending_type       TEXT,
  background_music  TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(story_id, node_key)
);

-- Choix entre noeuds
CREATE TABLE public.story_choices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id         UUID NOT NULL REFERENCES public.story_nodes(id) ON DELETE CASCADE,
  target_node_id  UUID REFERENCES public.story_nodes(id),
  display_order   SMALLINT DEFAULT 0,
  text            TEXT NOT NULL,
  flavor_text     TEXT,
  is_premium      BOOLEAN DEFAULT FALSE,
  price_gems      INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Effets des choix
CREATE TABLE public.choice_effects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  choice_id   UUID NOT NULL REFERENCES public.story_choices(id) ON DELETE CASCADE,
  effect_type choice_effect_type NOT NULL,
  stat_key    TEXT,
  stat_value  INTEGER,
  item_id     UUID,
  flag_key    TEXT,
  flag_value  BOOLEAN DEFAULT TRUE
);

-- Progression par histoire
CREATE TABLE public.user_story_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  story_id        UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  current_node_id UUID REFERENCES public.story_nodes(id),
  is_completed    BOOLEAN DEFAULT FALSE,
  is_purchased    BOOLEAN DEFAULT FALSE,
  completion_pct  SMALLINT DEFAULT 0 CHECK (completion_pct BETWEEN 0 AND 100),
  endings_found   TEXT[] DEFAULT '{}',
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  last_played_at  TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  time_spent_sec  INTEGER DEFAULT 0,
  UNIQUE(user_id, story_id)
);

-- Stats du personnage (par run)
CREATE TABLE public.character_stats (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  story_id        UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  hp_current      INTEGER DEFAULT 10,
  hp_max          INTEGER DEFAULT 10,
  strength        INTEGER DEFAULT 5,
  agility         INTEGER DEFAULT 5,
  luck            INTEGER DEFAULT 5,
  charisma        INTEGER DEFAULT 5,
  narrative_flags JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, story_id)
);

-- Historique des choix
CREATE TABLE public.choice_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  story_id    UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  node_id     UUID NOT NULL REFERENCES public.story_nodes(id),
  choice_id   UUID NOT NULL REFERENCES public.story_choices(id),
  chosen_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Items catalogue
CREATE TABLE public.items (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                    TEXT UNIQUE NOT NULL,
  name                    TEXT NOT NULL,
  description             TEXT,
  icon_url                TEXT,
  item_type               item_type NOT NULL,
  rarity                  item_rarity DEFAULT 'common',
  stat_bonus              JSONB DEFAULT '{}',
  is_consumable           BOOLEAN DEFAULT FALSE,
  is_stackable            BOOLEAN DEFAULT FALSE,
  price_gems              INTEGER,
  price_usd               NUMERIC(6,2),
  revenuecat_product_id   TEXT,
  is_available            BOOLEAN DEFAULT TRUE,
  story_id                UUID REFERENCES public.stories(id),
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Inventaire utilisateur
CREATE TABLE public.user_inventory (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id     UUID NOT NULL REFERENCES public.items(id),
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  is_equipped BOOLEAN DEFAULT FALSE,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Transactions
CREATE TABLE public.transactions (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type                        transaction_type NOT NULL,
  status                      transaction_status DEFAULT 'pending',
  amount_usd                  NUMERIC(8,2),
  currency                    TEXT DEFAULT 'USD',
  gems_delta                  INTEGER DEFAULT 0,
  coins_delta                 INTEGER DEFAULT 0,
  revenuecat_transaction_id   TEXT UNIQUE,
  store_product_id            TEXT,
  platform                    TEXT,
  item_id                     UUID REFERENCES public.items(id),
  story_id                    UUID REFERENCES public.stories(id),
  metadata                    JSONB DEFAULT '{}',
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- Packs de gemmes (catalogue boutique)
CREATE TABLE public.gem_packs (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    TEXT NOT NULL,
  gems_amount             INTEGER NOT NULL,
  bonus_gems              INTEGER DEFAULT 0,
  price_usd               NUMERIC(6,2) NOT NULL,
  revenuecat_product_id   TEXT UNIQUE NOT NULL,
  icon_url                TEXT,
  is_featured             BOOLEAN DEFAULT FALSE,
  is_available            BOOLEAN DEFAULT TRUE,
  sort_order              SMALLINT DEFAULT 0,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Succès
CREATE TABLE public.achievements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  icon_url        TEXT,
  reward_gems     INTEGER DEFAULT 0,
  reward_coins    INTEGER DEFAULT 0,
  condition_type  TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_achievements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES public.achievements(id),
  unlocked_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ================================================================
-- INDEX
-- ================================================================

CREATE INDEX idx_story_nodes_story    ON public.story_nodes(story_id);
CREATE INDEX idx_story_choices_node   ON public.story_choices(node_id);
CREATE INDEX idx_user_progress_user   ON public.user_story_progress(user_id);
CREATE INDEX idx_user_progress_story  ON public.user_story_progress(story_id);
CREATE INDEX idx_ch_user_story        ON public.choice_history(user_id, story_id);
CREATE INDEX idx_transactions_user    ON public.transactions(user_id);
CREATE INDEX idx_inventory_user       ON public.user_inventory(user_id);
CREATE INDEX idx_stories_status       ON public.stories(status);
CREATE INDEX idx_stories_genre        ON public.stories(genre);

-- ================================================================
-- TRIGGERS — auto-update updated_at
-- ================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_character_stats_updated_at
  BEFORE UPDATE ON public.character_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- TRIGGER — création automatique profil + wallet à l'inscription
-- ================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_username TEXT;
BEGIN
  -- Génère un username par défaut (modifiable dans l'onboarding)
  generated_username := 'Héros_' || substring(NEW.id::text, 1, 6);

  INSERT INTO public.profiles (id, username, preferred_lang)
  VALUES (
    NEW.id,
    generated_username,
    COALESCE(NEW.raw_user_meta_data->>'lang', 'fr')
  );

  INSERT INTO public.wallets (user_id, gems, coins)
  VALUES (NEW.id, 50, 0); -- 50 gemmes de bienvenue !

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallets_select_own" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- Stories (lecture publique si publiée)
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stories_public_read" ON public.stories FOR SELECT USING (status = 'published');

-- Story nodes (accès si histoire gratuite OU achetée)
ALTER TABLE public.story_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nodes_access_control" ON public.story_nodes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.stories s
    WHERE s.id = story_id
      AND s.status = 'published'
      AND (
        s.is_free = TRUE
        OR EXISTS (
          SELECT 1 FROM public.user_story_progress usp
          WHERE usp.story_id = s.id
            AND usp.user_id = auth.uid()
            AND usp.is_purchased = TRUE
        )
      )
  )
);

-- Choices (même logique que nodes)
ALTER TABLE public.story_choices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "choices_access_control" ON public.story_choices FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.story_nodes n
    JOIN public.stories s ON s.id = n.story_id
    WHERE n.id = node_id
      AND s.status = 'published'
      AND (
        s.is_free = TRUE
        OR EXISTS (
          SELECT 1 FROM public.user_story_progress usp
          WHERE usp.story_id = s.id
            AND usp.user_id = auth.uid()
            AND usp.is_purchased = TRUE
        )
      )
  )
);

ALTER TABLE public.choice_effects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "effects_access_control" ON public.choice_effects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.story_choices sc
    JOIN public.story_nodes n ON n.id = sc.node_id
    JOIN public.stories s ON s.id = n.story_id
    WHERE sc.id = choice_id AND s.status = 'published'
  )
);

-- User progress
ALTER TABLE public.user_story_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_own" ON public.user_story_progress USING (auth.uid() = user_id);

-- Character stats
ALTER TABLE public.character_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stats_own" ON public.character_stats USING (auth.uid() = user_id);

-- Choice history
ALTER TABLE public.choice_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history_own" ON public.choice_history USING (auth.uid() = user_id);

-- Items (lecture publique)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "items_public_read" ON public.items FOR SELECT USING (is_available = TRUE);

-- User inventory
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_own" ON public.user_inventory USING (auth.uid() = user_id);

-- Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transactions_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Gem packs (lecture publique)
ALTER TABLE public.gem_packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gem_packs_public_read" ON public.gem_packs FOR SELECT USING (is_available = TRUE);

-- Achievements (lecture publique)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements_public_read" ON public.achievements FOR SELECT USING (TRUE);

-- User achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_achievements_own" ON public.user_achievements USING (auth.uid() = user_id);

-- ================================================================
-- DONNÉES INITIALES — Histoire gratuite de démo
-- ================================================================

INSERT INTO public.stories (slug, title, tagline, description, genre, status, is_free, estimated_playtime_min, difficulty, tags, published_at)
VALUES (
  'la-foret-des-ombres',
  'La Forêt des Ombres',
  'Une quête périlleuse vous attend…',
  'Vous vous réveillez à l''orée d''une forêt mystérieuse. Des murmures anciens vous appellent vers les profondeurs. Chaque choix peut être votre dernier.',
  'fantasy',
  'published',
  TRUE,
  20,
  2,
  ARRAY['fantasy', 'aventure', 'forêt', 'magie'],
  NOW()
);

-- Insertion des noeuds de la démo (référencé par UUID généré)
WITH story AS (SELECT id FROM public.stories WHERE slug = 'la-foret-des-ombres')
INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start)
VALUES
  ((SELECT id FROM story), 'debut', 'L''Éveil', 'Vous ouvrez les yeux. L''air sent la résine et la terre humide. Des arbres immenses vous entourent de toutes parts. Au loin, vous distinguez deux chemins : l''un éclairé par une lumière dorée, l''autre plongé dans une obscurité presque totale. Votre cœur bat fort.', TRUE),
  ((SELECT id FROM story), 'chemin_lumiere', 'Le Chemin Doré', 'Le sentier lumineux mène à une clairière magnifique. En son centre, une vieille femme est assise près d''un feu. Elle vous regarde avec des yeux remplis de sagesse. « Je t''attendais, Héros. Choisis : je peux t''enseigner un sort ou te donner une potion de soin. »', FALSE),
  ((SELECT id FROM story), 'chemin_ombre', 'Les Ténèbres', 'L''obscurité vous enveloppe rapidement. Vos yeux s''adaptent peu à peu. Vous entendez un bruissement — une créature vous observe. Soudain, un gobelin surgit ! Il tient une épée rouillée et grogne. Vous devez réagir vite.', FALSE),
  ((SELECT id FROM story), 'apprendre_sort', 'Magie Apprise', 'La vieille femme trace des runes dans l''air. Elles s''inscrivent dans votre mémoire. Vous avez appris le sort « Lumière des Anciens ». Avec ce pouvoir, même les ténèbres ne pourront vous arrêter.', FALSE),
  ((SELECT id FROM story), 'prendre_potion', 'Guérison', 'La vieille femme vous tend un flacon d''un rouge profond. Vous le buvez. Une chaleur apaisante se répand dans vos veines. Vos blessures guérissent. Vous vous sentez prêt à affronter n''importe quoi.', FALSE),
  ((SELECT id FROM story), 'fuir_gobelin', 'La Fuite', 'Vous faites volte-face et courez à perdre haleine. Le gobelin crie derrière vous, mais vous êtes plus rapide. Vous débouchez dans une grotte dont l''entrée est trop étroite pour votre poursuivant. Vous êtes en sécurité, pour l''instant.', FALSE),
  ((SELECT id FROM story), 'combattre_gobelin', 'Le Combat', 'Vous ramassez une branche solide et faites face au gobelin. Le combat est bref mais intense. Finalement, le gobelin s''enfuit en couinant. Il a laissé tomber une petite bourse de pièces d''or. Vous êtes blessé, mais victorieux.', FALSE),
  ((SELECT id FROM story), 'victoire', 'Héros de la Forêt', 'Vous avez traversé la Forêt des Ombres et survécu à ses épreuves. La forêt s''illumine autour de vous — comme si elle vous reconnaissait. Vous avez prouvé votre valeur. L''aventure ne fait que commencer…', TRUE),
  ((SELECT id FROM story), 'game_over', 'La Forêt Vous a Vaincu', 'Épuisé et désorienté, vous vous effondrez. La forêt reprend ses droits. Mais ne vous inquiétez pas — chaque héros a le droit de recommencer.', TRUE);

-- Récupération des IDs pour les choix
DO $$
DECLARE
  v_story_id UUID;
  v_debut UUID;
  v_lumiere UUID;
  v_ombre UUID;
  v_sort UUID;
  v_potion UUID;
  v_fuite UUID;
  v_combat UUID;
  v_victoire UUID;
  v_game_over UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'la-foret-des-ombres';
  SELECT id INTO v_debut FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'debut';
  SELECT id INTO v_lumiere FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chemin_lumiere';
  SELECT id INTO v_ombre FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'chemin_ombre';
  SELECT id INTO v_sort FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'apprendre_sort';
  SELECT id INTO v_potion FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'prendre_potion';
  SELECT id INTO v_fuite FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'fuir_gobelin';
  SELECT id INTO v_combat FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'combattre_gobelin';
  SELECT id INTO v_victoire FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'victoire';
  SELECT id INTO v_game_over FROM public.story_nodes WHERE story_id = v_story_id AND node_key = 'game_over';

  -- Choix depuis le début
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text)
  VALUES
    (v_debut, v_lumiere, 0, 'Suivre la lumière dorée', 'La prudence est une vertu.'),
    (v_debut, v_ombre, 1, 'S''aventurer dans l''obscurité', 'Les plus grandes richesses se cachent dans les ténèbres.');

  -- Choix depuis le chemin de lumière
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text)
  VALUES
    (v_lumiere, v_sort, 0, 'Apprendre le sort magique', 'La connaissance est une arme.'),
    (v_lumiere, v_potion, 1, 'Prendre la potion de soin', 'Mieux vaut prévenir que guérir.');

  -- Choix depuis le chemin d''ombre (face au gobelin)
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text, flavor_text)
  VALUES
    (v_ombre, v_fuite, 0, 'Fuir aussi vite que possible', 'Il vaut mieux un lâche vivant qu''un héros mort.'),
    (v_ombre, v_combat, 1, 'Faire face au gobelin', 'Un héros ne recule pas.');

  -- Vers la victoire depuis sort ou potion ou combat
  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
  VALUES
    (v_sort, v_victoire, 0, 'Continuer vers la sortie de la forêt'),
    (v_potion, v_victoire, 0, 'Reprendre la route, revigoré'),
    (v_combat, v_victoire, 0, 'Ramasser les pièces et repartir'),
    (v_fuite, v_game_over, 0, 'Vous reposer… mais la fatigue vous terrasse');

  -- Compter les noeuds
  UPDATE public.stories SET total_nodes = 9, total_endings = 2 WHERE id = v_story_id;
END;
$$;

-- Succès initiaux
INSERT INTO public.achievements (slug, name, description, reward_gems, condition_type, condition_value)
VALUES
  ('first_story', 'Premier Pas', 'Terminez votre première histoire.', 10, 'stories_completed', 1),
  ('survivor', 'Survivant', 'Terminez une histoire sans mourir.', 15, 'victories', 1),
  ('explorer', 'Explorateur', 'Découvrez 5 fins différentes.', 25, 'endings_found', 5),
  ('bookworm', 'Lecteur Assidu', 'Complétez 5 histoires.', 50, 'stories_completed', 5),
  ('collector', 'Collectionneur', 'Possédez 10 items dans votre inventaire.', 20, 'items_owned', 10);

-- Packs de gemmes initiaux
INSERT INTO public.gem_packs (name, gems_amount, bonus_gems, price_usd, revenuecat_product_id, is_featured, sort_order)
VALUES
  ('Sachet de gemmes', 100, 0, 0.99, 'gems_100', FALSE, 1),
  ('Bourse d''aventurier', 500, 50, 3.99, 'gems_550', FALSE, 2),
  ('Coffre du héros', 1200, 200, 7.99, 'gems_1400', TRUE, 3),
  ('Trésor légendaire', 3000, 700, 17.99, 'gems_3700', FALSE, 4),
  ('Vault épique', 7000, 2000, 34.99, 'gems_9000', FALSE, 5);
