-- ============================================================
-- 014 — Illustrations « Les Maîtres des Ténèbres »
-- ============================================================
-- Les 20 planches pleine page du livre source ont été restaurées
-- (nettoyage du scan, recadrage de la légende) puis colorisées en
-- aquarelle numérique, dans le respect du trait original.
-- Les fichiers sont servis statiquement depuis
--   app/public/illustrations/les-maitres-des-tenebres/<node_key>.jpg
-- Le client masque automatiquement l'image si le fichier est absent
-- (onError), la migration est donc sûre même si un fichier manque.
-- ============================================================

DO $$
DECLARE
  v_story_id UUID;
BEGIN
  SELECT id INTO v_story_id
  FROM public.stories
  WHERE slug = 'les-maitres-des-tenebres';

  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire les-maitres-des-tenebres absente : migration 014 ignorée.';
    RETURN;
  END IF;

  UPDATE public.story_nodes
  SET illustration_url =
    '/illustrations/les-maitres-des-tenebres/' || node_key || '.jpg'
  WHERE story_id = v_story_id
    AND node_key IN (
      -- Planches légendées du livre (légende -> section correspondante)
      'section_007', -- Les hauts murs de pierre de la citadelle
      'section_023', -- Une broche sculptée ferme le panneau de la porte
      'section_034', -- Une créature montée sur un Kraan fond sur vous
      'section_041', -- Le chef des Gloks ordonne de vous tirer dessus
      'section_051', -- Le mur de rondins s'est écroulé
      'section_063', -- Le vieil homme fou vous insulte à grands cris
      'section_097', -- Un énorme Gourgaz brandit une Hache Noire
      'section_121', -- Le corbeau noir perché sur le bras de l'homme en rouge
      'section_131', -- Un Théurgiste tient tête aux créatures déchaînées
      'section_152', -- L'herboriste vous offre tout un choix de potions
      'section_170', -- Un Gluâtre des Profondeurs essaye de vous étrangler
      'section_200', -- Une roulotte tirée par six chevaux
      'section_212', -- Un homme, une coupe remplie d'herbes entre les mains
      'section_246', -- L'homme rejette son capuchon : un terrible Drakkarim
      'section_267', -- Un Message écrit sur une peau d'animal
      'section_284', -- Des vapeurs pestilentielles s'exhalent des cryptes
      'section_307', -- Un ermite recroquevillé dans un coin de la pièce
      'section_334', -- Quatre soldats et leur officier de l'Armée Royale
      'section_341', -- Les soldats refusent de vous laisser entrer
      'section_350'  -- Les visages du Roi et de ses conseillers (fin)
    );
END $$;
