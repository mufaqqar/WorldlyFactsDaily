"""OCR settled frames from the rendered TopLargestCompanies MP4.

Usage: python scripts/qc_largest_companies_frames.py [out/top-largest-companies-2026.mp4]
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent

# frame -> (label, expected text tokens)
FRAMES = {
    160: ("intro", ["BUSINESS", "LARGEST", "COMPANIES", "REVENUE", "SCALE", "POWER", "10"]),
    700: ("#10 CNPC", ["CHINANATIONALPETROLEUM", "401.93", "PROFIT", "EMPLOYEES", "CHINA"]),
    1000: ("#9 CVS Health", ["CVSHEALTH", "402.07", "PROFIT", "EMPLOYEES"]),
    1350: ("#8 Alphabet", ["ALPHABET", "402.84", "PROFIT", "132.0"]),
    1750: ("#7 McKesson", ["MCKESSON", "403.43", "REFERENCECARD", "MCK"]),
    2100: ("#6 Apple", ["APPLE", "416.16", "112.0", "EMPLOYEES"]),
    2500: ("#5 Saudi Aramco", ["SAUDIARAMCO", "445.53", "92.8", "SAUDIARABIA"]),
    2900: ("#4 UnitedHealth", ["UNITEDHEALTHGROUP", "447.57", "REFERENCECARD", "UNH"]),
    3250: ("#3 State Grid", ["STATEGRID", "555.37", "CHINA"]),
    3620: ("#2 Walmart", ["WALMART", "713.16", "PROFIT"]),
    4000: ("#1 Amazon", ["AMAZON", "716.92", "NUMBER", "ONE"]),
    4300: ("outro", ["WHO", "IS", "NUMBER", "ONE", "FOLLOW", "FOR", "MORE", "AMAZON", "716.92"]),
}


def flatten(value: str) -> str:
    return re.sub(r"[\s,·•—\-]", "", value).upper()


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    video = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (
        ROOT / "out" / "top-largest-companies-2026.mp4"
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
