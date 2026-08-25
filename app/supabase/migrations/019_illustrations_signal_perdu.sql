-- ================================================================
-- HeroBook — Migration 019 : Illustrations pour NOVA-9
-- ---------------------------------------------------------------
-- Ajoute les illustrations générées pour l'histoire SF
-- ================================================================

DO $$
DECLARE
  v_story_id UUID;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'signal-perdu-nova9';
  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire signal-perdu-nova9 absente — migration 019 ignorée';
    RETURN;
  END IF;

  UPDATE public.story_nodes SET illustration_url = '/illustrations/signal-perdu-nova9/passerelle.jpg'
   WHERE story_id = v_story_id AND node_key = 'passerelle_commandement';

  UPDATE public.story_nodes SET illustration_url = '/illustrations/signal-perdu-nova9/reacteur.jpg'
   WHERE story_id = v_story_id AND node_key = 'reacteur_principal';

  UPDATE public.story_nodes SET illustration_url = '/illustrations/signal-perdu-nova9/noyau_ia.jpg'
   WHERE story_id = v_story_id AND node_key = 'noyau_ia';

  -- Les fins avec les fresques UI existantes pour rester premium
  UPDATE public.story_nodes SET illustration_url = '/illustrations/ui/victory.jpg'
   WHERE story_id = v_story_id AND node_key IN ('fin_victoire_arche_sauvee', 'fin_secrete_fusion');

  UPDATE public.story_nodes SET illustration_url = '/illustrations/ui/defeat.jpg'
   WHERE story_id = v_story_id AND node_key IN ('fin_mort_vide', 'fin_mort_radiation', 'fin_mort_drone', 'fin_mort_explosion');

  RAISE NOTICE 'Illustrations NOVA-9 ajoutées';
END $$;
