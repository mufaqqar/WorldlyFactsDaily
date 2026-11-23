"""OCR QA stills for the TopEducatedCountries composition.

Usage: python scripts/qc_educated_countries_stills.py [path/to/still.png ...]
If no paths are supplied, the standard QA stills are checked.
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent

DEFAULT = {
    "educated-intro.png": [
        "EDUCATION",
        "2022",
        "MOST",
        "EDUCATED",
        "COUNTRIES",
        "DEGREES",
        "ADULTS",
        "ATTAINMENT",
        "10",
    ],
    "educated-norway.png": [
        "NORWAY",
        "48.10",
        "7.66",
        "OECD",
        "EUROPE",
        "RANK",
    ],
    "educated-luxembourg.png": [
        "LUXEMBOURG",
        "51.49",
        "11.05",
        "OECD",
        "EUROPE",
    ],
    "educated-ireland.png": [
        "IRELAND",
        "54.39",
        "8.35",
        "OECD",
        "EUROPE",
    ],
    "educated-canada.png": [
        "CANADA",
        "62.74",
        "22.30",
        "NUMBER",
        "ONE",
        "TOP",
    ],
    "educated-outro.png": [
        "WHO",
        "IS",
        "NUMBER",
        "ONE",
        "FOLLOW",
        "FOR",
        "MORE",
        "CANADA",
        "62.74",
    ],
}


def flatten(text: str) -> str:
    # RapidOCR occasionally reads "NUMBER" in the gold finale badge as "NOMBER".
    text = text.replace("NOMBER", "NUMBER")
    return re.sub(r"[\s,·•—\-→]", "", text).upper()


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    args = [pathlib.Path(p) for p in sys.argv[1:]]
    if not args:
        args = [ROOT / "out" / "qa" / name for name in DEFAULT]

    ocr = RapidOCR()
    misses = 0
    for path in args:
        img = cv2.imread(str(path))
        if img is None:
            print(f"{path.name}: unreadable")
            misses += 1
            continue
        result, _ = ocr(img)
        texts = [text for _, text, _ in (result or [])]
        blob = flatten(" ".join(texts))
        expected = DEFAULT.get(path.name, [])
        bad = [token for token in expected if flatten(token) not in blob]
        misses += len(bad)
        print(f"\n{path.name}: {'PASS' if not bad else 'MISS ' + ', '.join(bad)}")
        print(" | ".join(texts)[:900])

    print(f"\nOCR: {'PASS' if misses == 0 else f'{misses} mismatch(es)'}")
    raise SystemExit(0 if misses == 0 else 1)


if __name__ == "__main__":
    main()
