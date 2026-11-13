"""Download city lead images + country flags for the cost-of-living video.

Run:  python scripts/fetch_cities.py
Writes public/cities/*.jpg and public/flags/{ch,ky,us}.png plus
public/cities/sources.json with the resolved Wikimedia file page.
"""

import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "cities"
FLAGS = ROOT / "public" / "flags"
UA = "RemotionCityRanking/1.0 (educational video; contact: local)"

CITIES = [
    ("10-honolulu", "Honolulu"),
    ("09-bern", "Bern"),
    ("08-lausanne", "Lausanne"),
    ("07-st-gallen", "St. Gallen"),
    ("06-lugano", "Lugano"),
    ("05-geneva", "Geneva"),
    ("04-basel", "Basel"),
    ("03-lucerne", "Lucerne"),
    ("02-george-town", "George Town, Cayman Islands"),
    ("01-zurich", "Zürich"),
]

FLAG_CODES = ["ch", "ky", "us"]


def get(url: str, attempts: int = 4) -> bytes:
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(request, timeout=60) as response:
                return response.read()
        except Exception as error:  # noqa: BLE001
            if attempt == attempts - 1:
                raise
            wait = 2 ** (attempt + 1)
            print(f"  retry in {wait}s ({error})")
            time.sleep(wait)
    raise RuntimeError("unreachable")


def summary(title: str) -> dict:
    url = (
        "https://en.wikipedia.org/api/rest_v1/page/summary/"
        + urllib.parse.quote(title.replace(" ", "_"), safe="")
    )
    return json.loads(get(url))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    FLAGS.mkdir(parents=True, exist_ok=True)
    sources_path = OUT / "sources.json"
    sources = (
        json.loads(sources_path.read_text(encoding="utf-8"))
        if sources_path.exists()
        else {}
    )

    for slug, title in CITIES:
        existing = list(OUT.glob(f"{slug}.*"))
        existing = [p for p in existing if p.suffix in {".jpg", ".png"}]
        if slug in sources and existing and existing[0].stat().st_size > 100_000:
            print(f"{slug}: cached {existing[0].name}")
            continue

        data = summary(title)
        original = data.get("originalimage") or {}
        thumb = data.get("thumbnail") or {}
        src = thumb.get("source") or original.get("source")
        if not src:
            raise SystemExit(f"no image for {title}: {json.dumps(data)[:400]}")
        # Upgrade the standard thumbnail to a 1280px render (a listed size).
        src = re.sub(r"/\d+px-", "/1280px-", src)
        ext = ".png" if src.lower().endswith(".png") else ".jpg"
        target = OUT / f"{slug}{ext}"
        blob = get(src)
        target.write_bytes(blob)
        sources[slug] = {
            "title": data.get("title"),
            "file": f"cities/{target.name}",
            "image": src,
            "page": data.get("content_urls", {}).get("desktop", {}).get("page"),
            "bytes": len(blob),
        }
        print(f"{slug}: {target.name} {len(blob) / 1024:.0f} KB <- {data.get('title')}")
        time.sleep(1.2)

    for code in FLAG_CODES:
        target = FLAGS / f"{code}.png"
        if target.exists() and target.stat().st_size > 1000:
            print(f"flag {code}: cached")
            continue
        target.write_bytes(get(f"https://flagcdn.com/w320/{code}.png"))
        print(f"flag {code}: {target.stat().st_size / 1024:.0f} KB")

    sources_path.write_text(
        json.dumps(sources, indent=2, ensure_ascii=False), encoding="utf-8"
    )


if __name__ == "__main__":
    main()
