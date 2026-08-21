-- ================================================================
-- HeroBook — Migration 015 : RPC `use_consumable`
-- ------------------------------------------------------------
-- Problème : les potions étaient inutilisables quand l'Edge Function
-- `apply-item-effect` n'était pas déployée/joignable. La RLS de
-- `user_inventory` est en lecture seule côté client (migration 004),
-- donc aucun fallback client direct n'est possible.
--
-- Solution : exposer la MÊME logique atomique et non-trichable
-- (`apply_item_effect` : possession vérifiée, is_consumable exigé,
-- soin plafonné à hp_max, décrément d'inventaire) via une RPC
-- appelable par le client authentifié. L'utilisateur ne peut agir
-- que sur SON inventaire et SES stats : auth.uid() est imposé côté
-- SQL, aucun paramètre user_id n'est accepté.
-- ================================================================

CREATE OR REPLACE FUNCTION public.use_consumable(
  p_item_id  uuid,
  p_story_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Réutilise la fonction atomique sécurisée de la migration 004 :
  -- l'identité est TOUJOURS celle du JWT (pas de paramètre user_id).
  RETURN public.apply_item_effect(auth.uid(), p_item_id, p_story_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.use_consumable(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.use_consumable(uuid, uuid) TO authenticated, service_role;
