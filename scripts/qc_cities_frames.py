"""OCR every settled city frame in the rendered MP4 and compare to data.ts."""

import cv2
from rapidocr_onnxruntime import RapidOCR

FRAMES = {
    "intro": 151,
    "Honolulu": 294,
    "Bern": 444,
    "Lausanne": 563,
    "StGallen": 703,
    "Lugano": 842,
    "Geneva": 1002,
    "Basel": 1161,
    "Lucerne": 1297,
    "GeorgeTown": 1494,
    "Zurich": 1705,
    "outro": 1792,
}

EXPECT = {
    "Honolulu": ("105.4", "UnitedStates"),
    "Bern": ("108.7", "Switzerland"),
    "Lausanne": ("108.7", "Switzerland"),
    "StGallen": ("108.7", "Switzerland"),
    "Lugano": ("110.4", "Switzerland"),
    "Geneva": ("111.3", "Switzerland"),
    "Basel": ("111.9", "Switzerland"),
    "Lucerne": ("112.7", "Switzerland"),
    "GeorgeTown": ("116.5", "CaymanIslands"),
    "Zurich": ("123.1", "Switzerland"),
}

ocr = RapidOCR()
cap = cv2.VideoCapture("out/most-expensive-cities.mp4")
misses = 0
for name, frame in FRAMES.items():
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame)
    ok, img = cap.read()
    if not ok:
        print(f"{name} frame {frame}: unreadable")
        misses += 1
        continue
    result, _ = ocr(img)
    texts = [t.replace(" ", "") for _, t, _ in (result or [])]
    blob = " ".join(texts)
    if name in EXPECT:
        index, country = EXPECT[name]
        index_ok = index in texts
        country_ok = country in blob
        misses += 0 if (index_ok and country_ok) else 1
        print(
            f"{name:11s} frame {frame:4d}  index {index:5s} "
            f"{'OK  ' if index_ok else 'MISS'}  country {country:15s} "
            f"{'OK' if country_ok else 'MISS'}"
        )
    else:
        print(f"{name:11s} frame {frame:4d}  {' | '.join(texts)[:110]}")
cap.release()
print("\nOCR:", "PASS" if misses == 0 else f"{misses} mismatch(es)")
