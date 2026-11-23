"""OCR settled frames from the rendered TopEducatedCountries MP4.

Usage: python scripts/qc_educated_countries_frames.py [out/top-educated-countries-2026.mp4]
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent

# frame -> (label, expected text tokens)
FRAMES = {
    160: ("intro", ["MOST", "EDUCATED", "COUNTRIES", "DEGREES", "ATTAINMENT", "10"]),
    800: ("#10 Norway", ["NORWAY", "48.10", "7.66", "EUROPE"]),
    1227: ("#9 Sweden", ["SWEDEN", "48.53", "8.09", "EUROPE"]),
    1529: ("#8 United States", ["UNITEDSTATES", "50.02", "9.58"]),
    1825: ("#7 Israel", ["ISRAEL", "50.62", "10.18"]),
    2110: ("#6 United Kingdom", ["UNITEDKINGDOM", "51.32", "10.88"]),
    2402: ("#5 Luxembourg", ["LUXEMBOURG", "51.49", "11.05"]),
    2770: ("#4 Australia", ["AUSTRALIA", "51.50", "11.06"]),
    3035: ("#3 South Korea", ["SOUTHKOREA", "52.80", "12.36"]),
    3338: ("#2 Ireland", ["IRELAND", "54.39", "13.95"]),
    3692: ("#1 Canada", ["CANADA", "62.74", "22.30", "NUMBER", "ONE"]),
    4180: ("outro", ["WHO", "IS", "NUMBER", "ONE", "FOLLOW", "FOR", "MORE", "CANADA", "62.74"]),
}


def flatten(value: str) -> str:
    value = value.upper().replace("NOMBER", "NUMBER")
    return re.sub(r"[\s,·•—\-→]", "", value)


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    video = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (
        ROOT / "out" / "top-educated-countries-2026.mp4"
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
            print(f"{label:20s} frame {frame_no:4d}: unreadable")
            misses += 1
            continue
        result, _ = ocr(img)
        texts = [text for _, text, _ in (result or [])]
        blob = flatten(" ".join(texts))
        bad = [token for token in expected if flatten(token) not in blob]
        misses += len(bad)
        print(f"\n{label:20s} frame {frame_no:4d}: {'PASS' if not bad else 'MISS ' + ', '.join(bad)}")
        print(" | ".join(texts)[:700])

    cap.release()
    print(f"\nOCR: {'PASS' if misses == 0 else f'{misses} mismatch(es)'}")
    raise SystemExit(0 if misses == 0 else 1)


if __name__ == "__main__":
    main()
