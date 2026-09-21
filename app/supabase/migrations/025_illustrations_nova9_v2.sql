-- ================================================================
-- HeroBook — Migration 025 : Illustrations pour NOVA-9 S1 (v2) et S2 (v2)
-- Les numéros de section de l'ancienne S2 ont changé lors de la
-- réécriture complète (migrations 023 et 024). On rebranche les
-- illustrations sur les nouvelles clés.
-- ================================================================

DO $$
DECLARE v_s1 UUID; v_s2 UUID;
BEGIN
  SELECT id INTO v_s1 FROM public.stories WHERE slug='signal-perdu-nova9';
  SELECT id INTO v_s2 FROM public.stories WHERE slug='nova9-andromede';

  -- ---------- S1 ----------
  IF v_s1 IS NOT NULL THEN
    UPDATE public.story_nodes SET illustration_url='/illustrations/signal-perdu-nova9/passerelle.jpg'
      WHERE story_id=v_s1 AND node_key IN ('debut','sas_principal');
    UPDATE public.story_nodes SET illustration_url='/illustrations/signal-perdu-nova9/reacteur.jpg'
      WHERE story_id=v_s1 AND node_key IN ('reacteur','controle_reacteur','reacteur_stabilise','reacteur_surcharge');
    UPDATE public.story_nodes SET illustration_url='/illustrations/signal-perdu-nova9/noyau_ia.jpg'
      WHERE story_id=v_s1 AND node_key IN ('noyau_ia','pacte_eva','force_noyau','assaut_eva','dialogue_eva');
    UPDATE public.story_nodes SET illustration_url='/illustrations/signal-perdu-nova9/cicatrice.jpg'
      WHERE story_id=v_s1 AND node_key IN ('serres','combat_serre','brule_serre');
    UPDATE public.story_nodes SET illustration_url='/illustrations/ui/victory.jpg'
      WHERE story_id=v_s1 AND is_ending AND ending_type='victory';
    UPDATE public.story_nodes SET illustration_url='/illustrations/ui/defeat.jpg'
      WHERE story_id=v_s1 AND is_ending AND ending_type='death';
  END IF;

  -- ---------- S2 ----------
  IF v_s2 IS NOT NULL THEN
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/passerelle.jpg'
      WHERE story_id=v_s2 AND node_key IN ('s001','s003','s005');
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/cicatrice.jpg'
      WHERE story_id=v_s2 AND node_key IN ('s040','s041','s042','s043','s045');
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/nova7_bone.jpg'
      WHERE story_id=v_s2 AND node_key IN ('s014','s021','s022','s030','s050');
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/faction.jpg'
      WHERE story_id=v_s2 AND node_key IN ('s020','s023','s024','s025');
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/nova0_dyson.jpg'
      WHERE story_id=v_s2 AND node_key IN ('s060','s061','s062','s063','s066','s080');
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/reacteur.jpg'
      WHERE story_id=v_s2 AND node_key IN ('s090','s091','s071');
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/noyau_ia.jpg'
      WHERE story_id=v_s2 AND node_key IN ('s100','s101','s110');
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/jardinier.jpg'
      WHERE story_id=v_s2 AND node_key IN ('fin_jardinier','fin_exode');
    UPDATE public.story_nodes SET illustration_url='/illustrations/nova9-andromede/singularite.jpg'
      WHERE story_id=v_s2 AND node_key IN ('fin_singularite','fin_sacrifice');
    UPDATE public.story_nodes SET illustration_url='/illustrations/ui/victory.jpg'
      WHERE story_id=v_s2 AND is_ending AND ending_type='victory';
    UPDATE public.story_nodes SET illustration_url='/illustrations/ui/defeat.jpg'
      WHERE story_id=v_s2 AND is_ending AND ending_type='death';
  END IF;
END $$;
