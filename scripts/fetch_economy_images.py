"""Fetch city/skyline photos for the World's Largest Economies video.

Run: python scripts/fetch_economy_images.py
Writes JPG/PNG/WEBP files to public/portraits/economies/ using the Wikipedia
pageimages API. Stable filenames are referenced by src/largest-economies/data.ts.
All ten flags are already present in public/flags/.
"""

import json
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "portraits" / "economies"
OUT.mkdir(parents=True, exist_ok=True)

# (stable filename, [Wikipedia title candidates in priority order])
ECONOMIES = [
    ("01-united-states", ["New York City"]),
    ("02-china", ["Shanghai"]),
    ("03-germany", ["Berlin"]),
    ("04-japan", ["Tokyo"]),
    ("05-united-kingdom", ["London"]),
    ("06-india", ["Mumbai"]),
    ("07-france", ["Paris"]),
    ("08-russia", ["Moscow"]),
    ("09-italy", ["Rome"]),
    ("10-brazil", ["São Paulo"]),
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Referer": "https://en.wikipedia.org/",
}


def fetch_json(url: str):
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=45) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(4 * (attempt + 1))
    raise RuntimeError("unreachable")


def download(url: str, dest: pathlib.Path) -> None:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=90) as response:
        data = response.read()
    if len(data) < 700:
        raise RuntimeError(f"suspiciously small image ({len(data)} bytes)")
    dest.write_bytes(data)


def thumbnail_for(title: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": title,
            "prop": "pageimages",
            "format": "json",
            "pithumbsize": "1400",
            "redirects": "1",
        }
    )
    data = fetch_json("https://en.wikipedia.org/w/api.php?" + params)
    for page in data.get("query", {}).get("pages", {}).values():
        thumb = (page.get("thumbnail") or {}).get("source")
        if thumb:
            return thumb
    return None


manifest = {}
for fname, candidates in ECONOMIES:
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
        manifest[fname] = None
        continue

    # Wikipedia appends tracking parameters that Wikimedia's upload host 403s.
    parsed = urllib.parse.urlparse(thumb)
    thumb = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
    suffix = pathlib.Path(parsed.path).suffix.lower()
    if suffix not in (".jpg", ".jpeg", ".png", ".webp"):
        suffix = ".jpg"
    dest = OUT / f"{fname}{suffix}"
    try:
        download(thumb, dest)
        print("OK", dest.name, dest.stat().st_size, "via", used)
        manifest[fname] = dest.name
    except Exception as error:  # noqa: BLE001
        print("DOWNLOAD FAILED", fname, thumb, error)
        manifest[fname] = None
    time.sleep(1.5)

(OUT / "manifest.json").write_text(
    json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
)
