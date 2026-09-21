-- ============================================================================
--  HEROBOOK — Migration 004 (Loup Solitaire)
--  Installe les tables du catalogue « Loup Solitaire » (lw_*). La purge
--  destructive initialement prévue (section 1) a été abandonnée et
--  neutralisée : voir son commentaire.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PURGE DES ANCIENNES HISTOIRES — ABANDONNÉE (no-op)
--
--    Cette migration visait à l'origine un « pivot » destructif : dropper
--    stories / story_nodes / story_choices / choice_effects /
--    user_story_progress / character_stats / choice_history, retirer
--    items.story_id et transactions.story_id, et vider les succès.
--
--    Ce pivot n'a JAMAIS été appliqué en production : toutes les migrations
--    ultérieures (005 → 026) réutilisent ces tables et la colonne
--    items.story_id. Exécuter les instructions d'origine détruirait les
--    données en ligne et casserait la chaîne de migrations (ex. le REVOKE
--    sur user_story_progress de 005_secure_monetization échouerait).
--
--    La section est donc neutralisée : seule la création du schéma
--    Loup Solitaire (lw_*) ci-dessous est conservée, car elle est requise
--    par 009_bibliotheque_utilisateur.sql et 011_couverture_pdf_ls01.sql.
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- 2. CATALOGUE DES LIVRES LOUP SOLITAIRE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lw_livres (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  numero          SMALLINT NOT NULL,
  titre           TEXT NOT NULL,
  sous_titre      TEXT,
  resume          TEXT,
  auteur          TEXT DEFAULT 'Joe Dever',
  illustration    TEXT,
  arme_depart     TEXT,
  or_depart_min   SMALLINT DEFAULT 1,
  or_depart_max   SMALLINT DEFAULT 10,
  nb_paragraphes  INTEGER DEFAULT 0,
  is_free         BOOLEAN DEFAULT TRUE,
  price_gems      INTEGER,
  status          TEXT DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.lw_livres IS
  'Catalogue des livres Loup Solitaire jouables dans HeroBook.';

-- ----------------------------------------------------------------------------
-- 3. CONTENU DES PARAGRAPHES (optionnel)
--    Le contenu est embarqué dans l'application pour fonctionner hors-ligne ;
--    cette table permet de servir les paragraphes depuis la base si tu
--    préfères (voir supabase/seed/001_loup_solitaire_01_adaptation_50.sql).
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lw_sections (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  livre_slug    TEXT NOT NULL REFERENCES public.lw_livres(slug) ON DELETE CASCADE,
  numero        TEXT NOT NULL,            -- numéro du paragraphe, ex. « 213 »
  titre         TEXT,
  image         TEXT,
  texte         TEXT NOT NULL,
  suite         TEXT,
  choix         JSONB DEFAULT '[]'::jsonb,
  combat        JSONB,
  evenement     JSONB,
  effets        JSONB,
  fin           TEXT,
  nom_fin       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (livre_slug, numero)
);

CREATE INDEX IF NOT EXISTS idx_lw_sections_livre ON public.lw_sections (livre_slug);

-- ----------------------------------------------------------------------------
-- 4. SAUVEGARDES DE PARTIE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lw_sauvegardes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  livre_slug    TEXT NOT NULL,
  etat          JSONB NOT NULL,           -- AdventureState complet
  paragraphe    TEXT,
  habilete      SMALLINT,
  endurance     SMALLINT,
  endurance_max SMALLINT,
  disciplines   TEXT[] DEFAULT '{}',
  paragraphes_visites INTEGER DEFAULT 0,
  termine       BOOLEAN DEFAULT FALSE,
  temps_jeu_sec INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, livre_slug)
);

COMMENT ON TABLE public.lw_sauvegardes IS
  'Feuille d''Aventure sauvegardée : une ligne par joueur et par livre.';

-- ----------------------------------------------------------------------------
-- 5. FINS DÉCOUVERTES & SUCCÈS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lw_fins (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  livre_slug   TEXT NOT NULL,
  fin_key      TEXT NOT NULL,
  nom          TEXT,
  type         TEXT CHECK (type IN ('victoire','mort','neutre')),
  paragraphe   TEXT,
  atteinte_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, livre_slug, fin_key)
);

CREATE TABLE IF NOT EXISTS public.lw_succes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT UNIQUE NOT NULL,
  nom          TEXT NOT NULL,
  description  TEXT,
  emoji        TEXT DEFAULT '🏅',
  gemmes       INTEGER DEFAULT 0,
  condition_type TEXT NOT NULL,   -- paragraphes_visites | fins | victoires | objets | sans_combat…
  condition_value INTEGER DEFAULT 1,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lw_succes_utilisateur (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  succes_slug  TEXT NOT NULL REFERENCES public.lw_succes(slug) ON DELETE CASCADE,
  unlocked_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, succes_slug)
);

-- ----------------------------------------------------------------------------
-- 6. STATISTIQUES DE LECTURE (facultatif, pour les tableaux de bord)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lw_stats (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  livre_slug   TEXT NOT NULL,
  paragraphe   TEXT,
  action       TEXT,               -- lecture | combat | choix | mort | fin
  detail       JSONB DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. TRIGGERS updated_at
-- ----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_lw_livres_updated_at ON public.lw_livres;
CREATE TRIGGER trg_lw_livres_updated_at
  BEFORE UPDATE ON public.lw_livres
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_lw_sauvegardes_updated_at ON public.lw_sauvegardes;
CREATE TRIGGER trg_lw_sauvegardes_updated_at
  BEFORE UPDATE ON public.lw_sauvegardes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------------------
-- 8. SÉCURITÉ (RLS)
-- ----------------------------------------------------------------------------

ALTER TABLE public.lw_livres              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lw_sections            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lw_sauvegardes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lw_fins                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lw_succes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lw_succes_utilisateur  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lw_stats               ENABLE ROW LEVEL SECURITY;

-- Catalogue et contenu : lecture publique, écriture côté service uniquement.
DROP POLICY IF EXISTS "lw_livres_read" ON public.lw_livres;
CREATE POLICY "lw_livres_read" ON public.lw_livres
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "lw_sections_read" ON public.lw_sections;
CREATE POLICY "lw_sections_read" ON public.lw_sections
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "lw_succes_read" ON public.lw_succes;
CREATE POLICY "lw_succes_read" ON public.lw_succes
  FOR SELECT USING (TRUE);

-- Données personnelles : chacun ne voit que les siennes.
DROP POLICY IF EXISTS "lw_sauvegardes_own" ON public.lw_sauvegardes;
CREATE POLICY "lw_sauvegardes_own" ON public.lw_sauvegardes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lw_fins_own" ON public.lw_fins;
CREATE POLICY "lw_fins_own" ON public.lw_fins
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lw_succes_utilisateur_own" ON public.lw_succes_utilisateur;
CREATE POLICY "lw_succes_utilisateur_own" ON public.lw_succes_utilisateur
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lw_stats_own" ON public.lw_stats;
CREATE POLICY "lw_stats_own" ON public.lw_stats
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 9. VUE PRATIQUE : progression par livre
-- ----------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.lw_progression AS
SELECT
  s.user_id,
  s.livre_slug,
  s.paragraphe,
  s.habilete,
  s.endurance,
  s.endurance_max,
  s.disciplines,
  s.paragraphes_visites,
  s.termine,
  (SELECT COUNT(*) FROM public.lw_fins f
     WHERE f.user_id = s.user_id AND f.livre_slug = s.livre_slug) AS fins_decouvertes,
  (SELECT COUNT(*) FROM public.lw_fins f
     WHERE f.user_id = s.user_id AND f.livre_slug = s.livre_slug AND f.type = 'victoire') AS victoires
FROM public.lw_sauvegardes s;

COMMENT ON VIEW public.lw_progression IS
  'Vue de progression Loup Solitaire : à utiliser dans le tableau de bord joueur.';
