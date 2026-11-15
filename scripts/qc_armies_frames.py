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
    "intro": 170,
    "Italy": 390,
    "Turkiye": 663,
    "UnitedKingdom": 911,
    "Japan": 1137,
    "France": 1323,
    "SouthKorea": 1543,
    "India": 1800,
    "China": 2050,
    "Russia": 2275,
    "UnitedStates": 2533,
    "outro": 2696,
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
    "Italy": "Italy",
    "Turkiye": "Türkiye",
    "UnitedKingdom": "UnitedKingdom",
    "Japan": "Japan",
    "France": "France",
    "SouthKorea": "SouthKorea",
    "India": "India",
    "China": "China",
    "Russia": "Russia",
    "UnitedStates": "UnitedStates",
}


def flatten(value: str) -> str:
    return re.sub(r"[\s,]", "", value)


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
        country = COUNTRY[name]
        index_ok = index in blob
        active_ok = active in flatten(blob)
        country_ok = flatten(country) in blob
        misses += 0 if (index_ok and active_ok and country_ok) else 1
        print(
            f"{name:14s} frame {frame:4d}  "
            f"pwr {index:6s} {'OK  ' if index_ok else 'MISS'}  "
            f"active {active:8s} {'OK  ' if active_ok else 'MISS'}  "
            f"country {country:14s} {'OK' if country_ok else 'MISS'}"
        )

    cap.release()
    print("\nOCR:", "PASS" if misses == 0 else f"{misses} mismatch(es)")


if __name__ == "__main__":
    main()
