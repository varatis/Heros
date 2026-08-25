-- ================================================================
-- HeroBook — Migration 021 : Illustrations pour NOVA-9 Saison 2
-- ---------------------------------------------------------------
-- Système Vie/Armure/Attaque uniquement, pas de repas
-- ================================================================

DO $$
DECLARE
  v_story_id UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'nova9-andromede';
  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire nova9-andromede absente — migration 021 ignorée';
    RETURN;
  END IF;

  -- Acte 1
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/passerelle.jpg'
   WHERE story_id = v_story_id AND node_key = 'section_001';
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/cicatrice.jpg'
   WHERE story_id = v_story_id AND node_key IN ('section_030', 'section_151', 'section_181');

  -- Acte 2 : NOVA-7
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/nova7_bone.jpg'
   WHERE story_id = v_story_id AND node_key IN ('section_071', 'section_072', 'section_089', 'section_101');
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/faction.jpg'
   WHERE story_id = v_story_id AND node_key IN ('section_121', 'section_150');

  -- Acte 3-4 : NOVA-0
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/nova0_dyson.jpg'
   WHERE story_id = v_story_id AND node_key IN ('section_231', 'section_260', 'section_283');
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/reacteur.jpg'
   WHERE story_id = v_story_id AND node_key IN ('section_195', 'section_210');
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/noyau_ia.jpg'
   WHERE story_id = v_story_id AND node_key IN ('section_260', 'section_291');

  -- Fins
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/jardinier.jpg'
   WHERE story_id = v_story_id AND node_key = 'fin_jardinier';
  UPDATE public.story_nodes SET illustration_url = '/illustrations/nova9-andromede/singularite.jpg'
   WHERE story_id = v_story_id AND node_key IN ('fin_singularite', 'fin_fusion_totale', 'fin_exode_andromede');
  UPDATE public.story_nodes SET illustration_url = '/illustrations/ui/victory.jpg'
   WHERE story_id = v_story_id AND node_key IN ('fin_sauveur', 'fin_pont', 'fin_gardien', 'fin_messager', 'fin_humain', 'fin_veilleur');
  UPDATE public.story_nodes SET illustration_url = '/illustrations/ui/defeat.jpg'
   WHERE story_id = v_story_id AND node_key LIKE 'mort_%';

  RAISE NOTICE 'Illustrations NOVA-9 S2 ajoutées';
END $$;
