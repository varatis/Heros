#!/usr/bin/env python3
"""T-015 — similarité de texte PDF ↔ base (difflib.SequenceMatcher).

Entrée (stdin JSON) : {"sections": {"1": "texte pdf…"}, "contents": {"1": "contenu base…"}}
Sortie (stdout JSON) : {"ratio_moyen": …, "ratio_min": …, "faibles": [[section, ratio]…]}
Même mesure que l'audit (chapitre 3, T-015 : LR ≥ 0,97).
"""
import json
import re
import sys
from difflib import SequenceMatcher


def norm(s: str) -> str:
    s = s.replace("’", "'").replace("‘", "'").replace("`", "'")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def main() -> None:
    data = json.load(sys.stdin)
    ratios = []
    faibles = []
    for n, pdf_text in data["sections"].items():
        base = data["contents"].get(n, "")
        a, b = norm(pdf_text), norm(base)
        r = SequenceMatcher(None, a, b).ratio()
        ratios.append(r)
        if r < 0.97:
            faibles.append([int(n), round(r, 4)])
    ratios.sort()
    print(
        json.dumps(
            {
                "ratio_moyen": round(sum(ratios) / len(ratios), 4),
                "ratio_min": round(ratios[0], 4),
                "faibles": faibles,
            }
        )
    )


if __name__ == "__main__":
    main()
