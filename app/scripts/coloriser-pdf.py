#!/usr/bin/env python3
"""Apply chroma only to original PDF pixels; never publish a redrawn AI image.

Requires Pillow (pip install Pillow). Run from any directory.
The model-generated layers are just color suggestions: geometry and luminance
come from the extracted scan. Every dark pixel (luminance <= 150) is locked to
its original RGB value, verified before writing the lossless PNG.
"""
from pathlib import Path
import json
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'content/stories/illustrations/ls01'
OUTPUT = ROOT / 'app/public/lonewolf/pdf/colored'
OUTPUT.mkdir(parents=True, exist_ok=True)

for entry in json.loads((SOURCE / 'colorization.json').read_text()):
    original = Image.open(SOURCE / 'originals' / entry['original']).convert('RGB')
    original = original.crop(tuple(entry['crop']))
    layer = Image.open(SOURCE / 'color-layers' / f"{entry['id']}.png").convert('RGB')
    layer = layer.resize(original.size, Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(2))
    base_pixels = list(original.getdata())
    luminance = list(original.convert('L').getdata())
    result = []
    locked = 0
    for base, gray, color in zip(base_pixels, luminance, layer.getdata()):
        if gray <= 150:
            result.append(base)
            locked += 1
            continue
        maximum = max(max(color), 1)
        opacity = 0.85 * (gray - 150) / 105
        # Chroma only, not the generated linework, shadows, texture or geometry.
        result.append(tuple(round(b * (1 - opacity + opacity * c / maximum)) for b, c in zip(base, color)))
    assert all(a == b for a, b, gray in zip(base_pixels, result, luminance) if gray <= 150)
    out = Image.new('RGB', original.size)
    out.putdata(result)
    out.save(OUTPUT / f"{entry['id']}.png", optimize=True)
    print(f"{entry['id']}: {locked} ink pixels unchanged; {original.width} × {original.height}")
