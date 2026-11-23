"""OCR QA stills for the TopLargestEconomies composition.

Usage: python scripts/qc_largest_economies_stills.py [path/to/still.png ...]
If no paths are supplied, the standard QA stills are checked.
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent

DEFAULT = {
    "economies-intro.png": [
        "ECONOMY",
        "2026",
        "LARGEST",
        "ECONOMIES",
        "OUTPUT",
        "SCALE",
        "POWER",
        "10",
        "01",
    ],
    "economies-brazil.png": [
        "BRAZIL",
        "2.65",
        "WORLD",
        "SHARE",
        "SOUTH AMERICA",
        "RANK",
    ],
    "economies-france.png": [
        "FRANCE",
        "3.55",
        "WORLD",
        "SHARE",
        "EUROPE",
        "RANK",
    ],
    "economies-united-states.png": [
        "UNITED STATES",
        "32.64",
        "NUMBER",
        "ONE",
        "2026",
        "WORLD",
        "SHARE",
    ],
    "economies-outro.png": [
        "WHO",
        "IS",
        "NUMBER",
        "ONE",
        "FOLLOW",
        "FOR",
        "MORE",
        "UNITED STATES",
        "32.64",
    ],
}


def flatten(text: str) -> str:
    # RapidOCR occasionally reads the word "NUMBER" in the gold finale badge
    # as "NOMBER"; normalise that known misread before matching.
    text = text.replace("NOMBER", "NUMBER")
    return re.sub(r"[\s,·•—-]", "", text).upper()


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
