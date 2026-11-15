"""OCR every settled army frame in the rendered MP4 and compare to data.ts.

Picks one frame late in each scene, after the troop counter has settled, then
checks the Power Index, the country name and the active-personnel figure.

Run:  python scripts/qc_armies_frames.py [out/most-dangerous-armies.mp4]
"""

import pathlib
import re
import sys

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent

FRAMES = {
    "intro": 75,
    "Italy": 199,
    "Turkiye": 381,
    "UnitedKingdom": 508,
    "Japan": 640,
    "France": 793,
    "SouthKorea": 939,
    "India": 1076,
    "China": 1194,
    "Russia": 1301,
    "UnitedStates": 1486,
    "outro": 1598,
}

# name -> (power index, active personnel as digits only)
EXPECT = {
    "Italy": ("0.2211", "165500"),
    "Turkiye": ("0.1975", "481000"),
    "UnitedKingdom": ("0.1881", "141330"),
    "Japan": ("0.1876", "251500"),
    "France": ("0.1798", "264000"),
    "SouthKorea": ("0.1642", "450000"),
    "India": ("0.1346", "1431000"),
    "China": ("0.0919", "2035000"),
    "Russia": ("0.0791", "1320000"),
    "UnitedStates": ("0.0741", "1333030"),
}

COUNTRY = {
    "Italy": ["Italy"],
    "Turkiye": ["rkiye"],  # OCR mangles the ü
    "UnitedKingdom": ["UnitedKingdom"],
    "Japan": ["Japan"],
    "France": ["France"],
    "SouthKorea": ["SouthKorea"],
    "India": ["India"],
    "China": ["China"],
    "Russia": ["Russia"],
    "UnitedStates": ["UnitedStates"],
}


def flatten(value: str) -> str:
    return re.sub(r"[\s,]", "", value)


def digits(value: str) -> str:
    return re.sub(r"\D", "", value)


def main() -> None:
    video = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (
        ROOT / "out" / "most-dangerous-armies.mp4"
    )
    if not video.exists():
        raise SystemExit(f"missing render: {video}")

    ocr = RapidOCR()
    cap = cv2.VideoCapture(str(video))
    misses = 0

    for name, frame in FRAMES.items():
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame)
        ok, img = cap.read()
        if not ok:
            print(f"{name:14s} frame {frame:4d}: unreadable")
            misses += 1
            continue
        result, _ = ocr(img)
        texts = [t.replace(" ", "") for _, t, _ in (result or [])]
        blob = flatten(" ".join(texts))

        if name not in EXPECT:
            print(f"{name:14s} frame {frame:4d}  {' | '.join(texts)[:110]}")
            continue

        index, active = EXPECT[name]
        aliases = COUNTRY[name]
        index_ok = index in blob
        # OCR sometimes reads the thousands comma as a period, so compare digits.
        active_ok = active in digits(blob)
        country_ok = any(flatten(alias) in blob for alias in aliases)
        misses += 0 if (index_ok and active_ok and country_ok) else 1
        print(
            f"{name:14s} frame {frame:4d}  "
            f"pwr {index:6s} {'OK  ' if index_ok else 'MISS'}  "
            f"active {active:8s} {'OK  ' if active_ok else 'MISS'}  "
            f"country {'/'.join(aliases):14s} {'OK' if country_ok else 'MISS'}"
        )

    cap.release()
    print("\nOCR:", "PASS" if misses == 0 else f"{misses} mismatch(es)")


if __name__ == "__main__":
    main()
