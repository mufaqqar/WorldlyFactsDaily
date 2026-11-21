"""Fetch Wikipedia photos for the Top 10 Luxury Bikes of 2026 video.

Run: python scripts/fetch_luxury_bike_images.py
Writes JPG/WEBP/PNG files to public/portraits/bikes/ using the Wikipedia
pageimages API. Filenames are stable so src/luxury-bikes/data.ts can refer
to them with staticFile(). Models without a dedicated free photo are left to
the monogram fallback in BikeCard.tsx.
"""

import json
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "portraits" / "bikes"
OUT.mkdir(parents=True, exist_ok=True)

# (stable filename, [Wikipedia title candidates in priority order])
BIKES = [
    ("01-ducati-superleggera-v4", ["Ducati Superleggera V4"]),
    ("02-ducati-panigale-v4-r", ["Ducati Panigale V4"]),
    ("03-kawasaki-ninja-h2r", ["Kawasaki Ninja H2R"]),
    ("04-indian-roadmaster-elite", ["Indian Roadmaster"]),
    ("05-harley-davidson-cvo-road-glide", ["Harley-Davidson Road Glide"]),
    ("06-bmw-m-1000-rr", ["BMW M 1000 RR", "BMW S1000RR"]),
    ("07-indian-pursuit-dark-horse", ["Indian Pursuit"]),
    ("08-bmw-m-1000-xr", ["BMW S 1000 XR"]),
    ("09-honda-gold-wing-tour", ["Honda Gold Wing"]),
    ("10-indian-challenger-dark-horse", ["Indian Challenger"]),
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
            "pithumbsize": "1000",
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
for fname, candidates in BIKES:
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
        manifest[fname] = dest.name
    except Exception as error:  # noqa: BLE001
        print("DOWNLOAD FAILED", fname, thumb, error)
        manifest[fname] = None
    time.sleep(1.5)

(OUT / "manifest.json").write_text(
    json.dumps(manifest, indent=2), encoding="utf-8"
)
