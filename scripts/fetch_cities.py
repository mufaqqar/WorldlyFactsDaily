"""Download city lead images + country flags for the cost-of-living video.

Run:  python scripts/fetch_cities.py
Writes public/cities/*.jpg and public/flags/{ch,ky,us}.png plus
public/cities/sources.json with the resolved Wikimedia file page.
"""

import json
import pathlib
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


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def summary(title: str) -> dict:
    query = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": title,
            "prop": "pageimages|info",
            "piprop": "thumbnail|name|original",
            "pithumbsize": "1280",
            "inprop": "url",
            "format": "json",
            "formatversion": "2",
        }
    )
    data = json.loads(get("https://en.wikipedia.org/w/api.php?" + query))
    page = data["query"]["pages"][0]
    thumb = page.get("thumbnail") or {}
    return {
        "title": page.get("title"),
        "thumbnail": thumb,
        "originalimage": page.get("original") or {},
        "pageimage": page.get("pageimage"),
        "content_urls": {"desktop": {"page": page.get("fullurl")}},
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    FLAGS.mkdir(parents=True, exist_ok=True)
    sources = {}

    for slug, title in CITIES:
        data = summary(title)
        original = data.get("originalimage") or {}
        thumb = data.get("thumbnail") or {}
        src = thumb.get("source") or original.get("source")
        if not src:
            raise SystemExit(f"no image for {title}")
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

    for code in FLAG_CODES:
        target = FLAGS / f"{code}.png"
        target.write_bytes(get(f"https://flagcdn.com/w320/{code}.png"))
        print(f"flag {code}: {target.stat().st_size / 1024:.0f} KB")

    (OUT / "sources.json").write_text(
        json.dumps(sources, indent=2, ensure_ascii=False), encoding="utf-8"
    )


if __name__ == "__main__":
    main()
