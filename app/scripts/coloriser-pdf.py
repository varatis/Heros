#!/usr/bin/env python3
"""Composite the aligned colour layers over the extracted scans.

Requires Pillow (pip install Pillow). Run from any directory.

Contract (verified by app/scripts/tester-illustrations.cjs):
- every ink pixel of the scan (luminance <= 150) is copied verbatim, so the
  original pen-and-ink drawing — Gary Chalk's linework, hatching and stipple —
  is published exactly as printed;
- above that threshold the pixel fades into the colour layer over a 30-level
  ramp, so anti-aliased line edges stay anchored to the scan while the paper
  areas take the full harmonious colouring;
- the colour layers are colourizations *of the scan itself* (same composition,
  same crop): the model adds pigment, never new geometry, characters or text.

Entries of colorization.json without a layer yet are skipped with a warning so
the pipeline can run while colourization is still in progress.
"""
from pathlib import Path
import json
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'content/stories/illustrations/ls01'
OUTPUT = ROOT / 'app/public/lonewolf/pdf/colored'
OUTPUT.mkdir(parents=True, exist_ok=True)

INK = 150          # luminance at and below which the scan is locked verbatim
RAMP = 30.0        # luminance band over which the layer fades in
BLUR = 0.8         # slight blur of the layer to hide sub-pixel misregistration

for entry in json.loads((SOURCE / 'colorization.json').read_text()):
    layer_path = SOURCE / 'color-layers' / f"{entry['id']}.png"
    if not layer_path.exists():
        print(f"{entry['id']}: couche de couleur absente, ignoré")
        continue
    original = Image.open(SOURCE / 'originals' / entry['original']).convert('RGB')
    original = original.crop(tuple(entry['crop']))
    layer = Image.open(layer_path).convert('RGB')
    layer = layer.resize(original.size, Image.Resampling.LANCZOS)
    layer = layer.filter(ImageFilter.GaussianBlur(BLUR))
    base_pixels = list(original.getdata())
    luminance = list(original.convert('L').getdata())
    layer_pixels = list(layer.getdata())
    result = []
    locked = 0
    for base, gray, color in zip(base_pixels, luminance, layer_pixels):
        if gray <= INK:
            result.append(base)
            locked += 1
            continue
        weight = min(1.0, (gray - INK) / RAMP)
        result.append(tuple(round(gray_channel * (1 - weight) + channel * weight)
                            for gray_channel, channel in zip(base, color)))
    assert all(a == b for a, b, gray in zip(base_pixels, result, luminance)
               if gray <= INK)
    out = Image.new('RGB', original.size)
    out.putdata(result)
    out.save(OUTPUT / f"{entry['id']}.png", optimize=True)
    print(f"{entry['id']}: {locked} pixels d'encrage inchangés; "
          f"{original.width} × {original.height}")
