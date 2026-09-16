# LS01 — sources graphiques

Source fournie par l’utilisateur, récupérée depuis `varatis/Heros`, branche
`main`, le 16 septembre 2026 sans changer la branche de travail.

PDF : `content/stories/source-pdfs/Loup Solitaire 01 - Les Maitres des Tenebres.pdf`

SHA-256 : `e3609d9710ebcc89a936245d3574b414a2d34246808c13614cf8443036da6a78`

175 pages, 76 références d’images uniques (pas 76 scènes narratives).
Les extractions sont indexées dans `extractions.json`. Les légendes complètes
restent dans `originals/`. Les recadrages destinés à la colorisation sont
consignés dans `colorization.json`; `prepared/` contient les entrées recadrées
transmises au modèle et `color-layers/` les propositions de couleur non publiées.

Les couleurs seules sont reportées sur le scan par
`app/scripts/coloriser-pdf.py`. Les pixels d’encrage de luminance ≤150 sont
inchangés, vérifiés par `app/scripts/tester-illustrations.cjs`. Les sorties
finales sont dans `app/public/lonewolf/pdf/colored/`.

Audit, identités, références de paragraphes, crédits, reproduction et limites :
[`app/docs/illustrations-et-combats.md`](../../../../app/docs/illustrations-et-combats.md).

Illustrations © Gary Chalk, 1984. Couverture © Solar Wind Ltd, 1985, selon les
crédits du PDF. Les mises en couleur ne sont pas originales. L’extraction ne
confère aucun droit de diffusion commerciale ; respecter les autorisations
requises par le README des sources PDF.
