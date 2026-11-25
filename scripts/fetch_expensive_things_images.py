"""Fetch Wikipedia thumbnails for the Top 10 Most Expensive Things video.

Run: python scripts/fetch_expensive_things_images.py
Writes JPG/WEBP/PNG files to public/images/expensive-things/ using the
Wikipedia pageimages API. Filenames are stable so src/expensive-things/data.ts
can refer to them with staticFile(). Items with no suitable free image use a
typographic card instead; no unrelated photo is ever substituted.
"""

import json
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "expensive-things"
OUT.mkdir(parents=True, exist_ok=True)

# (stable filename, [Wikipedia title candidates in priority order])
THINGS = [
    ("10-british-guiana-stamp", ["British Guiana 1c magenta"]),
    ("09-le-violon-dingres", ["Le Violon d'Ingres"]),
    ("08-lady-blunt", ["Lady Blunt Stradivarius"]),
    ("07-1933-double-eagle", ["1933 double eagle"]),
    ("05-codex-leicester", ["Codex Leicester"]),
    ("02-mercedes-300-slr", ["Mercedes-Benz 300 SLR"]),
    ("01-salvator-mundi", ["Salvator Mundi (Leonardo)"]),
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Referer": "https://en.wikipedia.org/",
}


def fetch_json(url: str):
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 3:
                raise
            time.sleep(3 * (attempt + 1))
    raise RuntimeError("unreachable")


def download(url: str, dest: pathlib.Path) -> None:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as response:
        data = response.read()
    if len(data) < 4000:
        raise RuntimeError(f"suspiciously small image ({len(data)} bytes)")
    dest.write_bytes(data)


def thumbnail_for(title: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": title,
            "prop": "pageimages",
            "format": "json",
            "pithumbsize": "900",
            "redirects": "1",
        }
    )
    data = fetch_json("https://en.wikipedia.org/w/api.php?" + params)
    for page in data.get("query", {}).get("pages", {}).values():
        thumb = (page.get("thumbnail") or {}).get("source")
        if thumb:
            return thumb
    return None


for fname, candidates in THINGS:
    thumb = None
    used = None
    for candidate in candidates:
        try:
            thumb = thumbnail_for(candidate)
            if thumb:
                used = candidate
                break
        except Exception as error:  # noqa: BLE001 - try the next candidate
            print("  lookup failed", candidate, error)
        time.sleep(1.5)

    if not thumb:
        print("NO IMAGE", fname)
        continue

    # Wikipedia adds tracking query parameters that Wikimedia's upload host
    # rejects with 403. Keep only the scheme/host/path.
    parsed = urllib.parse.urlparse(thumb)
    thumb = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))

    suffix = pathlib.Path(parsed.path).suffix.lower()
    if suffix not in (".jpg", ".jpeg", ".png", ".webp"):
        suffix = ".jpg"
    dest = OUT / f"{fname}{suffix}"
    try:
        download(thumb, dest)
        print("OK", dest.name, dest.stat().st_size, "via", used)
    except Exception as error:  # noqa: BLE001
        print("DOWNLOAD FAILED", fname, thumb, error)
    time.sleep(1.5)
