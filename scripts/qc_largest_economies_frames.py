"""OCR settled frames from the rendered TopLargestEconomies MP4.

Usage: python scripts/qc_largest_economies_frames.py [out/top-largest-economies-2026.mp4]
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent

# frame -> (label, expected text tokens)
FRAMES = {
    160: ("intro", ["ECONOMY", "LARGEST", "ECONOMIES", "OUTPUT", "SCALE", "POWER", "10"]),
    600: ("#10 Brazil", ["BRAZIL", "2.65", "WORLD", "SHARE", "SOUTH AMERICA"]),
    900: ("#9 Italy", ["ITALY", "2.70", "WORLD", "SHARE"]),
    1250: ("#8 Russia", ["RUSSIA", "2.86", "WORLD", "SHARE"]),
    1550: ("#7 France", ["FRANCE", "3.55", "EUROPE"]),
    1850: ("#6 India", ["INDIA", "4.06", "ASIA"]),
    2140: ("#5 United Kingdom", ["UNITED KINGDOM", "4.27"]),
    2400: ("#4 Japan", ["JAPAN", "4.34"]),
    2670: ("#3 Germany", ["GERMANY", "5.47", "EUROPE"]),
    3000: ("#2 China", ["CHINA", "21.55", "WORLD", "SHARE"]),
    3400: ("#1 United States", ["UNITED STATES", "32.64", "NUMBER", "ONE"]),
    3700: ("outro", ["WHO", "IS", "NUMBER", "ONE", "FOLLOW", "FOR", "MORE", "UNITED STATES", "32.64"]),
}


def flatten(value: str) -> str:
    value = value.replace("NOMBER", "NUMBER")
    return re.sub(r"[\s,·•—\-]", "", value).upper()


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    video = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (
        ROOT / "out" / "top-largest-economies-2026.mp4"
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
