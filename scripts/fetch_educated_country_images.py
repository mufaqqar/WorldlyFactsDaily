"""Fetch city/skyline photos and missing flags for the Top Educated Countries video.

Run: python scripts/fetch_educated_country_images.py

Photos come from the Wikipedia pageimages API and are normalised to stable JPG
filenames referenced by src/educated-countries/data.ts. Missing flags are
fetched from flagcdn.com; tiny palette PNGs are valid for simple flags.
"""

import io
import json
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
PHOTO_DIR = ROOT / "public" / "portraits" / "educated-countries"
FLAG_DIR = ROOT / "public" / "flags"
PHOTO_DIR.mkdir(parents=True, exist_ok=True)
FLAG_DIR.mkdir(parents=True, exist_ok=True)

# (stable filename, [Wikipedia title candidates in priority order])
COUNTRIES = [
    ("01-canada", ["Toronto"]),
    ("02-ireland", ["Dublin"]),
    ("03-south-korea", ["Seoul"]),
    ("04-australia", ["Sydney"]),
    ("05-luxembourg", ["Luxembourg City"]),
    ("06-united-kingdom", ["London"]),
    ("07-israel", ["Tel Aviv"]),
    ("08-united-states", ["New York City"]),
    ("09-sweden", ["Stockholm"]),
    ("10-norway", ["Oslo"]),
]

NEEDED_FLAGS = ["ie", "lu", "il"]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Referer": "https://en.wikipedia.org/",
}


def fetch_bytes(url: str, min_size: int = 700) -> bytes:
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=90) as response:
                data = response.read()
            if len(data) < min_size:
                raise RuntimeError(f"suspiciously small response ({len(data)} bytes)")
            return data
        except urllib.error.HTTPError as error:
            last_error = error
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(4 * (attempt + 1))
        except Exception as error:  # noqa: BLE001 - retry transient network issues
            last_error = error
            if attempt == 4:
                raise
            time.sleep(2 * (attempt + 1))
    raise RuntimeError(f"download failed: {last_error}")


def fetch_json(url: str):
    data = fetch_bytes(url, min_size=2)
    return json.loads(data.decode("utf-8"))


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


def save_jpg(data: bytes, dest: pathlib.Path) -> None:
    with Image.open(io.BytesIO(data)) as image:
        image = ImageOps.exif_transpose(image)
        if image.mode in ("RGBA", "LA", "P"):
            rgba = image.convert("RGBA")
            background = Image.new("RGBA", rgba.size, (11, 20, 32, 255))
            background.alpha_composite(rgba)
            image = background.convert("RGB")
        else:
            image = image.convert("RGB")
        image.save(dest, "JPEG", quality=90, optimize=True)


manifest: dict[str, str | None] = {}
for fname, candidates in COUNTRIES:
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
    dest = PHOTO_DIR / f"{fname}.jpg"
    try:
        save_jpg(fetch_bytes(thumb), dest)
        print("OK", dest.name, dest.stat().st_size, "via", used)
        manifest[fname] = dest.name
    except Exception as error:  # noqa: BLE001
        print("DOWNLOAD FAILED", fname, thumb, error)
        manifest[fname] = None
    time.sleep(1.5)

(PHOTO_DIR / "manifest.json").write_text(
    json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
)

for code in NEEDED_FLAGS:
    dest = FLAG_DIR / f"{code}.png"
    if dest.exists() and dest.stat().st_size >= 80:
        print("FLAG EXISTS", dest.name, dest.stat().st_size)
        continue
    for size in ("w160", "w320"):
        try:
            data = fetch_bytes(f"https://flagcdn.com/{size}/{code}.png", min_size=80)
            dest.write_bytes(data)
            print("FLAG OK", dest.name, len(data), size)
            break
        except Exception as error:  # noqa: BLE001 - try the larger variant
            print("FLAG RETRY", code, size, error)
    time.sleep(1)

print("\nFinal photos:")
for fname in manifest:
    path = PHOTO_DIR / f"{fname}.jpg"
    print(f"  {path.name}: {path.exists()} {path.stat().st_size if path.exists() else 0}")
print("\nFinal flags:")
for code in ["ca", "ie", "kr", "au", "lu", "gb", "il", "us", "se", "no"]:
    path = FLAG_DIR / f"{code}.png"
    print(f"  {code}: {path.exists()} {path.stat().st_size if path.exists() else 0}")
