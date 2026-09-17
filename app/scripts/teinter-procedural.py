#!/usr/bin/env python3
"""Couche de couleur procédurale par matériau, pour les vignettes d'objets.

Principe : on ne touche jamais au trait. Pour chaque objet listé ici, le
script fabrique une couche de couleur (même format que `color-layers/`) où
chaque zone de l'objet reçoit une teinte matérielle (acier, bois, cuir, or,
toile…) modulée par la luminance du scan — les hachures et le volume restent
donc lisibles — le fond papier demeurant blanc cassé. `coloriser-pdf.py`
compose ensuite cette couche sur le scan en verrouillant l'encrage
(luminance <= 150) : le résultat est une teinte « à la main », cohérente
entre toutes les icônes d'inventaire, sans aucun trait ajouté ni déplacé.

Les régions matérielles sont définies par fractions de boîte englobante,
vérifiées visuellement sur les extractions du PDF. Les planches narratives
à pointillisme dense ne passent pas par ici : une teinte procédurale ne
peut pas y remplacer le grain sans effacer l'encrage ; elles attendent une
couche de couleur alignée sur le scan (voir `colorisation en cours` du
tester) ou une couche IA du même nom déposée dans `color-layers/`.
"""
from pathlib import Path
import json
from PIL import Image
import numpy as np
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'content/stories/illustrations/ls01'
LAYERS = SOURCE / 'color-layers'

PAPER = (250, 249, 245)
STEEL = (104, 118, 138)
STEEL_CLAIR = (148, 158, 172)
BOIS = (138, 100, 64)
CHENE = (146, 112, 74)
CUIR = (118, 82, 50)
OR = (170, 134, 62)
MAILLES = (116, 128, 144)
PAIN = (198, 158, 100)
FROMAGE = (216, 180, 88)
TOILE = (230, 224, 208)
VIANDE = (152, 86, 58)

REGIONS_OBJETS = {
    "lance": [(lambda x, y, g: x < 0.70, BOIS), (lambda x, y, g: x >= 0.70, STEEL)],
    "masse": [(lambda x, y, g: x < 0.16, CUIR), (lambda x, y, g: x < 0.55, BOIS),
              (lambda x, y, g: x >= 0.55, STEEL)],
    "sabre": [(lambda x, y, g: (y > 0.55) | ((x > 0.78) & (y < 0.45)), CUIR),
              (lambda x, y, g: True, STEEL)],
    "marteau-de-guerre": [(lambda x, y, g: x < 0.60, BOIS),
                          (lambda x, y, g: x >= 0.60, STEEL)],
    "epee": [(lambda x, y, g: x < 0.72, STEEL), (lambda x, y, g: x < 0.93, CUIR),
             (lambda x, y, g: x >= 0.93, OR)],
    "hache": [(lambda x, y, g: x < 0.62, BOIS), (lambda x, y, g: x >= 0.62, STEEL)],
    "baton": [(lambda x, y, g: True, CHENE)],
    "glaive": [(lambda x, y, g: x < 0.68, STEEL), (lambda x, y, g: x < 0.86, CUIR),
               (lambda x, y, g: x >= 0.86, OR)],
    "casque": [(lambda x, y, g: True, STEEL_CLAIR)],
    "repas": [(lambda x, y, g: y > 0.74, TOILE), (lambda x, y, g: x < 0.55, PAIN),
              (lambda x, y, g: x < 0.80, FROMAGE), (lambda x, y, g: x >= 0.80, VIANDE)],
    "cotte-mailles": [(lambda x, y, g: True, MAILLES)],
}


def objet_masque(gray: np.ndarray, seuil=212):
    """Masque de l'objet : plus grande composante sombre, trous remplis."""
    sombre = gray < seuil
    masque = ndimage.binary_fill_holes(sombre)
    etiquettes, n = ndimage.label(masque)
    if n > 1:
        tailles = ndimage.sum(masque, etiquettes, range(1, n + 1))
        masque = etiquettes == (np.argmax(tailles) + 1)
    return masque


def teinte(gray: np.ndarray, masque: np.ndarray, regions):
    """regions : liste de (prédicat(x_frac, y_frac, gray) -> bool, couleur)."""
    h, w = gray.shape
    ys, xs = np.mgrid[0:h, 0:w]
    xf = xs / max(w - 1, 1)
    yf = ys / max(h - 1, 1)
    layer = np.empty((h, w, 3), dtype=np.float64)
    layer[:] = PAPER
    shade = np.clip(gray / 235.0, 0.22, 1.08) ** 0.9
    for predicate, color in regions:
        deja = ~np.all(layer == PAPER, axis=-1)
        zone = masque & predicate(xf, yf, gray) & ~deja
        for c in range(3):
            layer[..., c][zone] = color[c] * shade[zone]
    return np.clip(layer, 0, 255).astype(np.uint8)


def main():
    entries = {e["id"]: e for e in
               json.loads((SOURCE / 'colorization.json').read_text())}
    for id_, regions in REGIONS_OBJETS.items():
        entry = entries[id_]
        scan = Image.open(SOURCE / 'originals' / entry['original']).convert('L')
        scan = scan.crop(tuple(entry['crop']))
        gray = np.asarray(scan, dtype=np.float64)
        layer = teinte(gray, objet_masque(gray), regions)
        Image.fromarray(layer).save(LAYERS / f'{id_}.png', optimize=True)
        print(f'{id_}: couche procédurale écrite')


if __name__ == '__main__':
    main()
