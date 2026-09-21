-- ============================================================================
--  HEROBOOK — Migration 006
--  Données de départ Loup Solitaire : catalogue des livres, succès et
--  récompenses. À exécuter APRÈS la migration 004.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CATALOGUE DES LIVRES
-- ----------------------------------------------------------------------------

INSERT INTO public.lw_livres
  (slug, numero, titre, sous_titre, resume, auteur, illustration, arme_depart,
   or_depart_min, or_depart_max, nb_paragraphes, is_free, status)
VALUES
  (
    'loup-solitaire-01',
    1,
    'Les Maîtres des Ténèbres',
    'Loup Solitaire — Livre 1',
    'Le monastère Kaï a été anéanti durant la nuit. Vous êtes le dernier des Seigneurs Kaï du Sommerlund : trois cents kilomètres de forêts, de routes encombrées de réfugiés et de terres conquises vous séparent du Roi, à Holmgard.',
    'Joe Dever',
    '/lonewolf/couverture.jpg',
    'hache',
    1,
    10,
    50,
    TRUE,
    'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  titre          = EXCLUDED.titre,
  sous_titre     = EXCLUDED.sous_titre,
  resume         = EXCLUDED.resume,
  illustration   = EXCLUDED.illustration,
  nb_paragraphes = EXCLUDED.nb_paragraphes,
  updated_at     = NOW();

-- ----------------------------------------------------------------------------
-- 2. SUCCÈS LOUP SOLITAIRE
--    condition_type : paragraphes_visites | fins | victoires | objets_speciaux
--                     | repas_manges | sans_combat | gemme_vordak | crystal_star
-- ----------------------------------------------------------------------------

INSERT INTO public.lw_succes (slug, nom, description, emoji, gemmes, condition_type, condition_value)
VALUES
  ('premier-pas',      'Premier Pas',              'Lire votre premier paragraphe de l''aventure.',                        '🐾', 5,  'paragraphes_visites', 1),
  ('rescape-du-monastere', 'Rescapé du monastère', 'Échapper au massacre du monastère Kaï.',                              '🔥', 10, 'paragraphe_atteint', 131),
  ('etoile-de-cristal','L''Étoile de Cristal',     'Recevoir le pendentif de Banedon, Maître de l''Étoile de Cristal.',   '⭐', 15, 'objet_special', 1),
  ('chasseur-de-gourgaz','Tueur de Gourgaz',       'Abattre le Gourgaz de la route de Toran, la pire créature du livre.', '🦎', 30, 'combat_gagne', 1),
  ('tombeau-du-roi',   'Le Tombeau du Premier Roi','Rapporter la Clé d''Or du Cimetière des Anciens.',                    '🗝️', 20, 'objet_special', 2),
  ('survivant',        'Survivant',                'Atteindre Holmgard vivant, avec au moins 1 point d''Endurance.',      '🛡️', 15, 'victoires', 1),
  ('serment',          'Le Serment de Sommerlund', 'Découvrir la fin principale de l''aventure.',                        '🏆', 25, 'victoires', 1),
  ('etoile-et-cle',    'L''Étoile et la Clé',      'Découvrir la fin remarquable en rapportant l''Étoile et la Clé.',     '🌟', 50, 'fins', 4),
  ('explorateur',      'Explorateur de Magnamund', 'Découvrir au moins 40 paragraphes différents en une partie.',         '🧭', 30, 'paragraphes_visites', 40),
  ('sans-une-egratignure', 'Sans une égratignure','Terminer l''aventure sans jamais boire de potion.',                   '💎', 40, 'sans_potion', 1),
  ('tete-de-loup',     'Tête de Loup',             'Gagner au moins 10 combats dans une même partie.',                    '🐺', 20, 'combats_gagnes', 10),
  ('mains-nues',       'Brave jusqu''au bout',     'Remporter un combat sans aucune arme en main.',                       '✊', 35, 'combat_mains_nues', 1)
ON CONFLICT (slug) DO UPDATE SET
  nom        = EXCLUDED.nom,
  description= EXCLUDED.description,
  emoji      = EXCLUDED.emoji,
  gemmes     = EXCLUDED.gemmes,
  condition_type  = EXCLUDED.condition_type,
  condition_value = EXCLUDED.condition_value;

-- ----------------------------------------------------------------------------
-- 3. OBJETS DE BOUTIQUE ADAPTÉS À LOUP SOLITAIRE
--    (facultatif : ce que le joueur peut acheter avec des gemmes)
-- ----------------------------------------------------------------------------

INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, price_gems, is_available)
VALUES
  ('relique-potion-laumspur', 'Potion de Laumspur', 'Offerte au départ : +4 Endurance, à boire après un combat. Une seule dose.', 'potion', 'common', '{"endurance":4}'::jsonb, TRUE, 40, TRUE),
  ('relique-cotte-mailles', 'Cotte de Mailles', 'Ajoute 4 points d''Endurance à votre total de départ.', 'armor', 'uncommon', '{"endurance":4}'::jsonb, FALSE, 120, TRUE),
  ('relique-casque', 'Casque', 'Ajoute 2 points d''Endurance à votre total de départ.', 'armor', 'common', '{"endurance":2}'::jsonb, FALSE, 80, TRUE),
  ('relique-bouclier', 'Bouclier', 'Ajoute 2 points d''Habileté lorsque vous l''utilisez en combat.', 'armor', 'rare', '{"habilete":2}'::jsonb, FALSE, 200, TRUE),
  ('relique-potion-alether', 'Potion d''Alether', 'Ajoute 2 points d''Habileté pendant un seul combat.', 'potion', 'rare', '{"habilete":2}'::jsonb, TRUE, 150, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  stat_bonus  = EXCLUDED.stat_bonus,
  price_gems  = EXCLUDED.price_gems;

-- ----------------------------------------------------------------------------
-- 4. CONTRÔLE
-- ----------------------------------------------------------------------------

DO $$
DECLARE
  v_livres   INTEGER;
  v_succes   INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_livres FROM public.lw_livres;
  SELECT COUNT(*) INTO v_succes FROM public.lw_succes;
  RAISE NOTICE 'Loup Solitaire installé : % livre(s), % succès.', v_livres, v_succes;
END;
$$;
