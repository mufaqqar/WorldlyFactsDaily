"""OCR settled frames from the rendered TopWarplanes MP4.

Usage: python scripts/qc_warplanes_frames.py [out/top-warplanes-2026.mp4]
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent

# frame -> (label, expected text tokens)
FRAMES = {
    160: ("intro", ["AVIATION", "PLANES", "STEALTH", "SPEED", "SUPREMACY", "10", "01"]),
    650: ("#10 J-10C", [["J10C", "J1OC"], "4.5", "GEN", "2006", "CHINA"]),
    1000: ("#9 Su-35S", ["SU35S", "4.5", "GEN", "2014", "RUSSIA"]),
    1360: ("#8 F-15EX", ["F15EX", "4", "GEN", "2024", "UNITEDSTATES"]),
    1740: ("#7 Typhoon", ["TYPHOON", "4.5", "GEN", "2003"]),
    2140: ("#6 Rafale", ["RAFALE", "4.5", "GEN", "2001", "FRANCE"]),
    2500: ("#5 Su-57", ["SU57", "5TH", "GEN", "2020", "RUSSIA"]),
    2870: ("#4 J-35", ["J35", "5TH", "GEN", "2025", "CHINA"]),
    3250: ("#3 J-20", ["J20", "5TH", "GEN", "2017", "CHINA"]),
    3620: ("#2 F-22", ["F22", "5TH", "GEN", "2005", "UNITEDSTATES"]),
    4000: ("#1 F-35", ["F35", "5TH", "GEN", "2015", "UNITEDSTATES", "NUMBER", "ONE"]),
    4280: ("outro", ["WHICH", "ONE", "WOULD", "YOU", "FLY", "FOLLOW", "MORE", "F35"]),
}


def flatten(value: str) -> str:
    return re.sub(r"[\s,·•—\-]", "", value).upper()


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    video = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (
        ROOT / "out" / "top-warplanes-2026.mp4"
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
        bad = []
        for token in expected:
            aliases = token if isinstance(token, (list, tuple)) else [token]
            if not any(flatten(alias) in blob for alias in aliases):
                bad.append("/".join(aliases))
        misses += len(bad)
        print(f"\n{label:16s} frame {frame_no:4d}: {'PASS' if not bad else 'MISS ' + ', '.join(bad)}")
        print(" | ".join(texts)[:700])

    cap.release()
    print(f"\nOCR: {'PASS' if misses == 0 else f'{misses} mismatch(es)'}")
    raise SystemExit(0 if misses == 0 else 1)


if __name__ == "__main__":
    main()
