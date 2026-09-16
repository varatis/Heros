-- Personal library. Additive migration: preserves accounts, saves and catalogue.
-- Run after 001–005 (006 is an optional content seed, not a migration).
BEGIN;
CREATE TABLE IF NOT EXISTS public.lw_livres_utilisateur (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  livre_slug TEXT NOT NULL REFERENCES public.lw_livres(slug) ON DELETE CASCADE,
  origine TEXT NOT NULL DEFAULT 'attribution' CHECK (origine IN ('attribution', 'achat')),
  reference_achat TEXT UNIQUE,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, livre_slug)
);
ALTER TABLE public.lw_livres_utilisateur ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.lw_livres_utilisateur TO authenticated;
REVOKE ALL ON public.lw_livres_utilisateur FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.lw_livres_utilisateur FROM authenticated;
GRANT ALL ON public.lw_livres_utilisateur TO service_role;
DROP POLICY IF EXISTS "lw_bibliotheque_read_own" ON public.lw_livres_utilisateur;
CREATE POLICY "lw_bibliotheque_read_own" ON public.lw_livres_utilisateur
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

-- Only a trusted server / verified payment webhook can grant an entitlement.
-- No browser INSERT policy, nor self-service purchase RPC.
DROP POLICY IF EXISTS "lw_sections_read" ON public.lw_sections;
CREATE POLICY "lw_sections_read" ON public.lw_sections
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.lw_livres l
    WHERE l.slug = lw_sections.livre_slug AND l.status = 'published'
      AND (l.is_free OR EXISTS (
        SELECT 1 FROM public.lw_livres_utilisateur a
        WHERE a.livre_slug = l.slug AND a.user_id = (SELECT auth.uid())
      ))
  ));
COMMENT ON TABLE public.lw_livres_utilisateur IS
  'Server-managed book entitlements. Never grant an access from the client or an unverified payment.';
COMMIT;
