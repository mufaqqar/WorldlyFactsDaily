"""Fetch city photos and flags for the Beautiful Capitals video.

Run: python scripts/fetch_capital_images.py
Writes JPG files to public/portraits/capitals/ using the Wikipedia pageimages
API, and any missing country flags to public/flags/ via flagcdn.
"""

import json
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "portraits" / "capitals"
OUT.mkdir(parents=True, exist_ok=True)
FLAGS = ROOT / "public" / "flags"
FLAGS.mkdir(parents=True, exist_ok=True)

# (stable filename, [Wikipedia title candidates in priority order], flag ISO)
CAPITALS = [
    ("01-paris", ["Paris"], "fr"),
    ("02-prague", ["Prague"], "cz"),
    ("03-rome", ["Rome"], "it"),
    ("04-vienna", ["Vienna"], "at"),
    ("05-budapest", ["Budapest"], "hu"),
    ("06-amsterdam", ["Amsterdam"], "nl"),
    ("07-lisbon", ["Lisbon"], "pt"),
    ("08-ljubljana", ["Ljubljana"], "si"),
    ("09-stockholm", ["Stockholm"], "se"),
    ("10-copenhagen", ["Copenhagen"], "dk"),
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Referer": "https://en.wikipedia.org/",
}


def fetch_bytes(url: str, referer: str = "https://en.wikipedia.org/") -> bytes:
    headers = dict(HEADERS)
    headers["Referer"] = referer
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=90) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(4 * (attempt + 1))


def fetch_json(url: str):
    return json.loads(fetch_bytes(url).decode("utf-8"))


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
for fname, candidates, iso in CAPITALS:
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
    else:
        # Wikipedia appends tracking parameters that Wikimedia's upload host 403s.
        parsed = urllib.parse.urlparse(thumb)
        thumb = urllib.parse.urlunparse(
            (parsed.scheme, parsed.netloc, parsed.path, "", "", "")
        )
        suffix = pathlib.Path(parsed.path).suffix.lower()
        if suffix not in (".jpg", ".jpeg", ".png", ".webp"):
            suffix = ".jpg"
        dest = OUT / f"{fname}{suffix}"
        try:
            data = fetch_bytes(thumb)
            if len(data) < 700:
                raise RuntimeError(f"suspiciously small image ({len(data)} bytes)")
            dest.write_bytes(data)
            print("OK", dest.name, dest.stat().st_size, "via", used)
            manifest[fname] = dest.name
        except Exception as error:  # noqa: BLE001
            print("DOWNLOAD FAILED", fname, thumb, error)
            manifest[fname] = None
        time.sleep(1.5)

    flag = FLAGS / f"{iso}.png"
    if not flag.exists():
        try:
            data = fetch_bytes(
                f"https://flagcdn.com/w160/{iso}.png",
                referer="https://flagcdn.com/",
            )
            if len(data) < 80:
                raise RuntimeError(f"suspiciously small flag ({len(data)} bytes)")
            flag.write_bytes(data)
            print("OK flag", flag.name, flag.stat().st_size)
        except Exception as error:  # noqa: BLE001
            print("FLAG FAILED", iso, error)

(OUT / "manifest.json").write_text(
    json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
)
