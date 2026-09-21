#!/usr/bin/env python3
"""Extract embedded images, not rendered pages; record duplicate occurrences.
Requires PyMuPDF and Pillow: python3 -m pip install PyMuPDF Pillow
Run coloriser-pdf.py and preparer-portraits.cjs again after re-extraction.
"""
from pathlib import Path
from io import BytesIO
import json
import shutil
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'content/stories/illustrations/ls01'
PUBLIC = ROOT / 'app/public/lonewolf/pdf'
PDF = ROOT / 'content/stories/source-pdfs/Loup Solitaire 01 - Les Maitres des Tenebres.pdf'
(SOURCE / 'originals').mkdir(parents=True, exist_ok=True)
(PUBLIC / 'originals').mkdir(parents=True, exist_ok=True)
entries = {}
with pymupdf.open(PDF) as document:
    for page_number, page in enumerate(document, 1):
        for image in page.get_images(full=True):
            xref = image[0]
            if xref in entries:
                if page_number not in entries[xref]['pages']:
                    entries[xref]['pages'].append(page_number)
                continue
            data = document.extract_image(xref)
            decoded = Image.open(BytesIO(data['image'])).convert('RGB')
            filename = f'p{page_number:03d}-x{xref}.png'
            decoded.save(SOURCE / 'originals' / filename)
            shutil.copyfile(SOURCE / 'originals' / filename, PUBLIC / 'originals' / filename)
            entries[xref] = dict(file=filename, pages=[page_number], xref=xref, width=decoded.width, height=decoded.height)
    print(f'{len(document)} pages, {len(entries)} unique embedded images')
serialized = json.dumps(list(entries.values()), ensure_ascii=False, indent=2) + '\n'
(SOURCE / 'extractions.json').write_text(serialized)
(ROOT / 'app/content/lonewolf/ls01/pdf-extractions.json').write_text(serialized)
with Image.open(SOURCE / 'originals/p143-x833.png') as cemetery:
    cemetery.crop((0, 0, cemetery.width, 770)).save(PUBLIC / 'cimetiere.png')
