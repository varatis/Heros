-- Artwork metadata only: no change to authentication, ownership, access or prices.
-- The executable adaptation remains bundled in content/lonewolf/ls01.
UPDATE public.lw_livres
SET illustration = '/lonewolf/pdf/originals/p001-x4.png'
WHERE slug = 'loup-solitaire-01'
  AND illustration = '/lonewolf/couverture.jpg';
