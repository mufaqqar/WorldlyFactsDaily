import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "portraits" / "football"
OUT.mkdir(parents=True, exist_ok=True)

PLAYERS = [
    ("01-erling-haaland", "Erling Haaland"),
    ("02-kylian-mbappe", "Kylian Mbappé"),
    ("03-ousmane-dembele", "Ousmane Dembélé"),
    ("04-lamine-yamal", "Lamine Yamal"),
    ("05-jude-bellingham", "Jude Bellingham"),
    ("06-harry-kane", "Harry Kane"),
    ("07-vinicius-junior", "Vinícius Júnior"),
    ("08-mohamed-salah", "Mohamed Salah"),
    ("09-raphinha", "Raphinha"),
    ("10-pedri", "Pedri"),
]

HEADERS = {
    "User-Agent": "RemotionVideoBot/1.0 (local educational project; contact: local@example.com)",
}

def fetch_json(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))

def download(url: str, dest: Path):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())

for fname, title in PLAYERS:
    params = urllib.parse.urlencode({
        "action": "query",
        "titles": title,
        "prop": "pageimages",
        "format": "json",
        "pithumbsize": "800",
        "redirects": "1",
    })
    url = "https://en.wikipedia.org/w/api.php?" + params
    try:
        data = fetch_json(url)
        pages = data.get("query", {}).get("pages", {})
        thumb = None
        for p in pages.values():
            thumb = (p.get("thumbnail") or {}).get("source")
        if not thumb:
            print("no thumb", fname, title)
            continue
        ext = Path(urllib.parse.urlparse(thumb).path).suffix.lower() or ".jpg"
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            ext = ".jpg"
        dest = OUT / f"{fname}{ext}"
        download(thumb, dest)
        print("ok", dest.name, dest.stat().st_size)
    except Exception as e:
        print("fail", fname, e)
    time.sleep(0.3)
