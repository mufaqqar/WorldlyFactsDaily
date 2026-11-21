"""Download car images for the Top Luxury Cars video.

Uses Wikipedia's pageimages API to fetch representative thumbnails, then saves
them into public/cars/ with the filenames expected by src/luxury-cars/data.ts.

Run:  python scripts/fetch_luxury_car_images.py
"""

import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "cars"

# (output filename, Wikipedia page title)
CARS = [
    ("10-bentley-continental-gt.jpg", "Bentley Continental GT"),
    ("09-aston-martin-db12.jpg", "Aston Martin DB12"),
    ("08-porsche-911-turbo-s.jpg", "Porsche 911 (992)"),
    ("07-mercedes-maybach-s680.jpg", "Mercedes-Maybach S-Class"),
    ("06-mclaren-750s.jpg", "McLaren 750S"),
    ("05-lamborghini-revuelto.jpg", "Lamborghini Revuelto"),
    ("04-ferrari-sf90-stradale.jpg", "Ferrari SF90 Stradale"),
    ("03-pagani-huayra.jpg", "Pagani Huayra"),
    ("02-bugatti-chiron-super-sport.jpg", "Bugatti Chiron"),
    ("01-rolls-royce-phantom.jpg", "Rolls-Royce Phantom VIII"),
]

API = "https://en.wikipedia.org/w/api.php"
HEADERS = {
    "User-Agent": "remotion-luxury-cars/1.0 (local project image fetch)",
}


def fetch_json(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download(url: str, dest: pathlib.Path) -> None:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=120) as resp:
        dest.write_bytes(resp.read())


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for filename, title in CARS:
        params = urllib.parse.urlencode(
            {
                "action": "query",
                "titles": title,
                "prop": "pageimages",
                "format": "json",
                "pithumbsize": "1200",
                "redirects": "1",
            }
        )
        data = fetch_json(f"{API}?{params}")
        pages = data.get("query", {}).get("pages", {})
        image_url = None
        for page in pages.values():
            thumb = page.get("thumbnail", {})
            image_url = thumb.get("source")
            if image_url:
                break

        dest = OUT_DIR / filename
        if not image_url:
            print(f"WARN: no image found for {title}")
            continue

        try:
            download(image_url, dest)
            print(f"wrote {dest.relative_to(ROOT)} <- {image_url}")
        except Exception as e:  # noqa: BLE001
            print(f"ERROR downloading {title}: {e}")


if __name__ == "__main__":
    main()
