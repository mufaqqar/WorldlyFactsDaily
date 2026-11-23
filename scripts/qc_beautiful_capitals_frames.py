"""OCR settled frames from the rendered TopBeautifulCapitals MP4.

Usage: python scripts/qc_beautiful_capitals_frames.py [out/top-beautiful-capitals-2026.mp4]
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent

# frame -> (label, expected text tokens)
FRAMES = {
    160: ("intro", ["TOP 10", "BEAUTIFUL", "CAPITALS", "EARTH", "CURATED COUNTDOWN"]),
    600: ("#10 Copenhagen", ["COPENHAGEN", "NYHAVN", "SIGNATURE", "SETTLED"]),
    950: ("#9 Stockholm", ["STOCKHOLM", "1252", "FOURTEEN", "GAMLA STAN"]),
    1350: ("#8 Ljubljana", ["LJUBLJANA", "LJUBLJANICA", "2016", "GREEN CAPITAL"]),
    1700: ("#7 Lisbon", ["LISBON", "TAGUS", "ALFAMA", "RIVER"]),
    2050: ("#6 Amsterdam", ["AMSTERDAM", "2010", "VENICE OF THE NORTH", "UNESCO"]),
    2400: ("#5 Budapest", ["BUDAPEST", "DANUBE", "CHAIN BRIDGE", "LANDMARK"]),
    2730: ("#4 Vienna", ["VIENNA", "DANUBE", "RIVER", "PALACE"]),
    3050: ("#3 Rome", ["ROME", "COLOSSEUM", "SEVEN HILLS", "ETERNAL CITY"]),
    3450: ("#2 Prague", ["PRAGUE", "1992", "VLTAVA", "UNESCO"]),
    3850: ("#1 Paris", ["PARIS", "SEINE", "CITY OF LIGHT", "NICKNAME"]),
    4150: ("outro", ["10 CAPITALS", "ONE WORLD", "WHICH ONE WOULD YOU VISIT FIRST", "WIKIPEDIA", "NO OFFICIAL RANKING"]),
}


def flatten(value: str) -> str:
    value = value.upper().replace("VITAVA", "VLTAVA").replace("RANKJNG", "RANKING")
    return re.sub(r"[\s,·•—\-→]", "", value)


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    video = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (
        ROOT / "out" / "top-beautiful-capitals-2026.mp4"
    )
    if not video.exists():
        raise SystemExit(f"missing render: {video}")

    ocr = RapidOCR()
    cap = cv2.VideoCapture(str(video))
    misses = 0

    for frame_no, (label, expected) in FRAMES.items():
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
        ok, img = cap.read()
        if not ok:
            print(f"{label:16s} frame {frame_no:4d}: unreadable")
            misses += 1
            continue
        result, _ = ocr(img)
        texts = [text for _, text, _ in (result or [])]
        blob = flatten(" ".join(texts))
        bad = [token for token in expected if flatten(token) not in blob]
        misses += len(bad)
        print(f"\n{label:16s} frame {frame_no:4d}: {'PASS' if not bad else 'MISS ' + ', '.join(bad)}")
        print(" | ".join(texts)[:700])

    cap.release()
    print(f"\nOCR: {'PASS' if misses == 0 else f'{misses} mismatch(es)'}")
    raise SystemExit(0 if misses == 0 else 1)


if __name__ == "__main__":
    main()
