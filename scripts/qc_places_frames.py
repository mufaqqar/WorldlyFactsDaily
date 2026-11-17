"""OCR every settled place frame in the rendered MP4 and check it against data.ts.

Scene boundaries come from ``public/voiceover/places/durations.json`` — the
same measured narration lengths that ``calculateMetadata`` uses — so the QC
frames stay correct when the voiceover changes. Each sample lands well after
the card, name, blurb and stat boxes have settled and before the exit fade.

Run:  python scripts/qc_places_frames.py [out/most-beautiful-places.mp4]
"""

import json
import pathlib
import re
import sys
import unicodedata

import cv2
from rapidocr_onnxruntime import RapidOCR

ROOT = pathlib.Path(__file__).resolve().parent.parent
DURATIONS = ROOT / "public" / "voiceover" / "places" / "durations.json"

# scene name -> tokens that must appear on the settled frame
EXPECT = {
    "10-ubud": ["Ubud", "600m"],
    "09-cappadocia": ["Cappadocia", "balloons"],
    "08-serengeti": ["Serengeti", "30000"],
    "07-banff": ["Banff", "1885"],
    "06-bora-bora": ["BoraBora", "727"],
    "05-santorini": ["Santorini", "Oia"],
    "04-iguazu": ["Iguazu", "275"],
    "03-ha-long": ["HalongBay", "1994"],
    "02-machu-picchu": ["MachuPicchu", "2430"],
    "01-jokulsarlon": ["Jokulsarlon", "Vatnajokull"],
}


def plain(value: str) -> str:
    """Strip accents, spaces and punctuation so OCR survives ü / ç / ð."""
    decomposed = unicodedata.normalize("NFKD", value)
    ascii_only = "".join(c for c in decomposed if not unicodedata.combining(c))
    return re.sub(r"[\s,.:·'’|\-]", "", ascii_only).lower()


def scene_table() -> tuple[dict[str, tuple[int, int, int]], int]:
    """Return scene name -> (start frame, sample frame, scene length)."""
    manifest = json.loads(DURATIONS.read_text(encoding="utf-8"))
    names = [name for name in manifest if not name.startswith("_")]

    table: dict[str, tuple[int, int, int]] = {}
    cursor = 0
    for name in names:
        length = manifest[name]["frames"]
        settled = min(110, max(55, length // 2))
        table[name] = (cursor, cursor + settled, length)
        cursor += length
    return table, cursor


def main() -> None:
    video = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (
        ROOT / "out" / "most-beautiful-places.mp4"
    )
    if not video.exists():
        raise SystemExit(f"missing render: {video}")

    table, expected_total = scene_table()

    cap = cv2.VideoCapture(str(video))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"{video.name}: {total} frames (durations.json: {expected_total})\n")
    if total != expected_total:
        print(f"WARNING: frame count differs by {total - expected_total:+d}\n")

    ocr = RapidOCR()
    misses = 0

    for name, (start, frame, length) in table.items():
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame)
        ok, img = cap.read()
        if not ok:
            print(f"{name:18s} frame {frame:4d}: unreadable")
            misses += 1
            continue
        result, _ = ocr(img)
        blob = plain(" ".join(t for _, t, *_ in (result or [])))

        if name not in EXPECT:
            print(f"{name:18s} scene {start:4d}  {blob[:105]}")
            continue

        missing = [token for token in EXPECT[name] if plain(token) not in blob]
        misses += 0 if not missing else 1
        print(
            f"{name:18s} scene {start:4d}  sample {frame:4d}/{length:3d}  "
            f"{'OK  ' if not missing else 'MISS'} missing={missing or '-'}"
        )

    cap.release()
    print("\nOCR:", "PASS" if misses == 0 else f"{misses} mismatch(es)")


if __name__ == "__main__":
    main()
