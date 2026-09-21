#!/usr/bin/env python3
"""Oracle indépendant : lecture directe du PDF, sans importer les overrides/TS/SQL.
Usage: python scripts/ls02-extract-source.py [--check]
Dépendance : PyMuPDF==1.28.2 (voir requirements-ls02.txt).
Les textes sont conservés, y compris les coquilles du document fourni.
"""
import hashlib
import json
import re
import sys
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / 'content/stories/source-pdfs/Loup Solitaire 02 - La Traversee Infernale.pdf'
OUT = ROOT / 'content/stories/ls02-source-verifiee.json'
SHA = '922d25f0fc7292d9c9d9bdafb020524eb97de5d01e522064543a1b434d1c6908'
assert hashlib.sha256(PDF.read_bytes()).hexdigest() == SHA, 'PDF modifié : relecture requise'
doc = pymupdf.open(PDF)
sections = {}
current = 0
pages = []
for page_no, page in enumerate(doc, 1):
    text = page.get_text()
    pages.append({'page': page_no, 'sha256Texte': hashlib.sha256(text.encode()).hexdigest(),
                  'images': len(page.get_images()), 'caracteres': len(text)})
    for line in text.splitlines():
        line = line.strip()
        if current < 350 and line == str(current + 1):
            current += 1
            sections[str(current)] = {'pages': [page_no], 'texte': ''}
            continue
        if current and line:
            s = sections[str(current)]
            if page_no not in s['pages']: s['pages'].append(page_no)
            s['texte'] += line + ' '
assert len(sections) == 350
for section in sections.values():
    section['texte'] = re.sub(r'\s+', ' ', section['texte']).strip()
    # Tous les renvois imprimés sont de la forme « au N » ; ni les statistiques,
    # ni les dates ordinales (37e jour), ni les numéros de page ne correspondent.
    section['renvois'] = re.findall(r'\bau\s+(\d{1,3})\b', section['texte'])
    assert all(1 <= int(n) <= 350 for n in section['renvois'])
transcriptions = json.loads((ROOT / 'content/stories/ls02-transcriptions-images.json').read_text())
for numero, ajout in transcriptions.items():
    section = sections[numero]
    assert ajout['page'] in section['pages']
    assert section['texte'].count(ajout['apres']) == 1
    section['texteExtrait'] = section['texte']
    section['texte'] = section['texte'].replace(ajout['apres'], ajout['apres'] + ' ' + ajout['texte'])
    section['transcriptionImage'] = ajout
result = {'pdf': str(PDF.relative_to(ROOT)), 'sha256': SHA, 'nombrePages': len(doc),
          'pages': pages, 'preliminaires': '\n'.join(p.get_text() for p in doc[:25]),
          'annexesImages': [190, 191], 'sections': sections}
data = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
if '--check' in sys.argv:
    assert OUT.read_text() == data, 'Oracle désynchronisé du PDF'
else:
    OUT.write_text(data)
print(f'PDF : {len(doc)} pages ; {len(sections)} paragraphes ; '
      f'{sum(len(s["renvois"]) for s in sections.values())} renvois ; SHA-256 vérifié.')
