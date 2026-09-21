#!/usr/bin/env python3
"""Anti-hallucination — source de vérité : le PDF de LS01.

Extraction `pypdf` du PDF (175 pages) puis découpage en 350 sections
numérotées (le Word 2007 imprime chaque section sous la forme d'un numéro
seul sur une ligne, dans l'ordre strict 1→350).

Sorties (toujours régénérées depuis le PDF, jamais mémorisées) :
  scripts/_ls01_pdf.txt        — texte brut des 175 pages
  scripts/_ls01_sections.json  — {"1": "texte…", …, "350": "…"}

Usage : python3 scripts/ls01_pdf_sections.py
Les tests Node (`test-attestations-ls01.mjs`) lancent ce script si besoin.
"""
import json
import re
from pathlib import Path

from pypdf import PdfReader

HERE = Path(__file__).resolve().parent
PDF = HERE.parents[1] / "content" / "stories" / "source-pdfs" / (
    "Loup Solitaire 01 - Les Maitres des Tenebres.pdf"
)
OUT_TEXT = HERE / "_ls01_pdf.txt"
OUT_SECTIONS = HERE / "_ls01_sections.json"

NUM_LINE = re.compile(r"(?m)^\s*(\d{1,3})\s*$")


def extract_text() -> str:
    reader = PdfReader(str(PDF))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def split_sections(text: str) -> dict[str, str]:
    positions: list[tuple[int, int]] = []
    want = 1
    for m in NUM_LINE.finditer(text):
        if int(m.group(1)) == want:
            positions.append((m.start(), want))
            want += 1
            if want == 351:
                break
    if want != 351:
        raise SystemExit(f"Découpage incomplet : sections trouvées 1..{want - 1}")
    out: dict[str, str] = {}
    for i, (pos, n) in enumerate(positions):
        start = text.find("\n", pos) + 1
        end = positions[i + 1][0] if i + 1 < len(positions) else len(text)
        out[str(n)] = text[start:end].strip()
    return out


def main() -> None:
    text = extract_text()
    OUT_TEXT.write_text(text, encoding="utf-8")
    sections = split_sections(text)
    OUT_SECTIONS.write_text(
        json.dumps(sections, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print(f"pages=175 octets={len(text)} sections={len(sections)} -> {OUT_SECTIONS}")


if __name__ == "__main__":
    main()
