"""OCR QA for the TopBillionaireMansions stills (stills live in an OS temp folder).

Usage: python scripts/qc_billionaire_mansions_stills.py [path/to/still.png ...]
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

QA_DIR = pathlib.Path(r"C:\Users\mufaq_\AppData\Local\Temp\opencode")

DEFAULT = {
    "qa-mansions-intro.png": [
        "BILLIONAIRE",
        "MANSIONS",
        "WORLD'S",
        "PRIVATE PALACES",
        "COUNTDOWN",
    ],
    "qa-mansions-mid.png": [
        "RUTLAND GATE",
        "260M",
        "KNIGHTSBRIDGE",
        "REPORTED FIGURE",
    ],
    "qa-mansions-witanhurst.png": [
        "WITANHURST",
        "450M",
        "LONDON",
        "REPORTED FIGURE",
    ],
    "qa-mansions-finale.png": [
        "ANTILIA",
        "$4.6B",
        "MUMBAI",
        "SNOW ROOM",
    ],
    "qa-mansions-fallback.png": [
        "BILLIONAIRE",
        "BEL AIR",
        "94M",
        "REPORTED FIGURE",
    ],
    "qa-mansions-outro.png": [
        "BE NEXT",
        "FOLLOW",
        "SOURCE",
        "ANTILIA",
    ],
}


def flatten(text: str) -> str:
    return re.sub(r"[\s,·•—-]", "", text).upper()


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    args = [pathlib.Path(p) for p in sys.argv[1:]]
    if not args:
        args = [QA_DIR / name for name in DEFAULT]

    ocr = RapidOCR()
    misses = 0
    for path in args:
        img = cv2.imread(str(path))
        if img is None:
            print(f"{path.name}: unreadable")
            misses += 1
            continue
        result, _ = ocr(img)
        rows = []
        for box, text, score in result or []:
            y0 = min(point[1] for point in box)
            y1 = max(point[1] for point in box)
            x0 = min(point[0] for point in box)
            x1 = max(point[0] for point in box)
            rows.append((y0, y1, x0, x1, text, score))
        rows.sort()
        texts = [row[4] for row in rows]
        blob = flatten(" ".join(texts))
        expected = DEFAULT.get(path.name, [])
        bad = [token for token in expected if flatten(token) not in blob]
        misses += len(bad)
        print(f"\n{path.name}: {'PASS' if not bad else 'MISS ' + ', '.join(bad)}")
        for y0, y1, x0, x1, text, score in rows:
            edge = " EDGE" if x0 < 40 or x1 > 1040 or y0 < 30 or y1 > 1890 else ""
            print(
                f"  y={int(y0):4d}-{int(y1):4d} x={int(x0):4d}-{int(x1):4d} "
                f"score={score} {text}{edge}"
            )

    print(f"\nOCR: {'PASS' if misses == 0 else f'{misses} mismatch(es)'}")
    raise SystemExit(0 if misses == 0 else 1)


if __name__ == "__main__":
    main()
