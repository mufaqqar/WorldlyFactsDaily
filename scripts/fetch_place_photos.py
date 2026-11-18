"""Fetch one licensed photograph per place from the Openverse API.

Openverse indexes Creative-Commons / public-domain images from Flickr,
Wikimedia Commons and other sources. Results are ranked by relevance; this
script narrows to tall, high-resolution images under permissive licences
(CC0 / public domain / CC BY / CC BY-SA), downloads the best candidate and
resizes it for the 880x1050 postcard in the 9:16 video.

Selection is deliberately conservative because Wikimedia's upload host is
blocked from this machine: candidates are tried in relevance order, direct
downloads are preferred, and the Openverse thumbnail proxy is the fallback.

Writes:
  public/places/<rank>-<slug>.jpg   one photo per place
  public/places/photos.json         attribution for every selected photo

Run:  python scripts/fetch_place_photos.py
"""

import io
import json
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "places"
API = "https://api.openverse.org/v1/images/"
UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
}

# Only licences that allow use in a video with attribution.
LICENSES = "cc0,pdm,by,by-sa"
LICENSE_RANK = {"cc0": 0, "pdm": 0, "by": 1, "by-sa": 2}

TARGET_WIDTH = 1200
MIN_WIDTH = 600
MIN_HEIGHT = 800

# Wikimedia's upload host returns 429 and its Openverse proxy returns 424 from
# this machine, so only candidates with another source are usable.
BLOCKED_SOURCES = {"wikimedia"}

# Relevance keywords for the title. A candidate must match at least one, and
# any negative keyword disqualifies it (maps, diagrams and "painting" shots
# rank highly but do not read as a photograph of the place).
KEYWORDS = {
    "10-ubud": (["rice", "terrace", "tegallalang", "ubud", "bali"], []),
    "09-cappadocia": (["cappadocia", "balloon", "kapadokya", "turkey"], []),
    "08-serengeti": (
        ["serengeti", "wildebeest", "migration", "mara", "tanzania", "safari"],
        [],
    ),
    "07-banff": (
        ["moraine", "banff", "lake", "rocky", "alberta"],
        ["painting", "students", "poster", "map"],
    ),
    "06-bora-bora": (
        ["bora", "otemanu", "lagoon", "tahiti", "polynesia"],
        ["st. regis", "hotel", "resort", "pool", "holiday"],
    ),
    "05-santorini": (["santorini", "oia", "blue dome", "greece", "cyclades"], []),
    "04-iguazu": (["iguazu", "iguacu", "falls", "argentina", "brazil"], []),
    "03-ha-long": (
        ["ha long", "halong", "vietnam", "karst"],
        ["cave", "caving"],
    ),
    "02-machu-picchu": (
        ["machu", "picchu", "inca", "peru"],
        ["trail", "backpacking", "postcard"],
    ),
    "01-jokulsarlon": (
        ["jokulsarlon", "jökulsárlón", "glacier", "iceberg", "iceland"],
        [],
    ),
}

PLACES = [
    ("10-ubud", ["Tegallalang rice terrace Bali", "Ubud Bali rice terrace", "Ubud"]),
    ("09-cappadocia", ["Cappadocia hot air balloons", "Cappadocia balloons sunrise"]),
    ("08-serengeti", ["Serengeti wildebeest migration", "Serengeti National Park"]),
    ("07-banff", ["Moraine Lake Banff", "Moraine Lake", "Banff National Park"]),
    ("06-bora-bora", ["Bora Bora lagoon Otemanu", "Bora Bora", "Mount Otemanu"]),
    ("05-santorini", ["Santorini Oia", "Oia Santorini sunset"]),
    ("04-iguazu", ["Iguazu falls Argentina", "Iguazu Falls"]),
    ("03-ha-long", ["Ha Long Bay Vietnam", "Halong Bay"]),
    ("02-machu-picchu", ["Machu Picchu", "Machu Picchu Peru"]),
    ("01-jokulsarlon", ["Jokulsarlon glacier lagoon", "Jokulsarlon Iceland"]),
]


def fetch(url: str, timeout: int = 60) -> bytes:
    request = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def search(query: str, tall: bool = True) -> list[dict]:
    """Search with retries — the API intermittently returns 504."""
    query_params = {
        "q": query,
        "page_size": 20,
        "license": LICENSES,
        "mature": "false",
    }
    if tall:
        query_params["aspect_ratio"] = "tall"
    params = urllib.parse.urlencode(query_params)
    for attempt in range(3):
        try:
            data = json.loads(fetch(API + "?" + params, timeout=60))
            return data.get("results", [])
        except urllib.error.HTTPError as error:
            if error.code not in (500, 502, 503, 504) or attempt == 2:
                print(f"    search HTTP {error.code}")
                return []
            time.sleep(2 * (attempt + 1))
        except Exception as error:  # noqa: BLE001
            print(f"    search ERR {type(error).__name__}")
            return []
    return []


def try_image(item: dict) -> pathlib.Path | None:
    """Download one candidate and normalise it; None if unusable."""
    urls = [url for url in (item.get("url"), item.get("thumbnail")) if url]
    for url in urls:
        try:
            raw = fetch(url)
            image = Image.open(io.BytesIO(raw)).convert("RGB")
            width, height = image.size
            if width < MIN_WIDTH or height < MIN_HEIGHT:
                continue

            if width > TARGET_WIDTH:
                new_height = round(height * TARGET_WIDTH / width)
                image = image.resize((TARGET_WIDTH, new_height), Image.LANCZOS)
            return image
        except Exception:  # noqa: BLE001 — try the next URL / candidate
            continue
    return None


def relevance(slug: str, item: dict) -> int:
    """Score a candidate by how well its title describes the place."""
    positive, negative = KEYWORDS[slug]
    title = (item.get("title") or "").lower()
    if any(word in title for word in negative):
        return 0
    score = sum(1 for word in positive if word in title)
    # Short, exact titles ("Machu Picchu", "Jokulsarlon Glacier Lagoon")
    # usually mean a clean shot of the subject rather than a generic album.
    if len(title.strip()) <= 32:
        score += 2
    return score


def pick(slug: str, queries: list[str]) -> tuple[Image.Image, dict] | None:
    seen: set[str] = set()
    # First pass prefers tall images; the fallback pass accepts any aspect
    # ratio for places where tall results are scarce (e.g. Bora Bora).
    for tall in (True, False):
        for query in queries:
            results = search(query, tall=tall)
            if not results:
                continue
            print(f"    query {query!r} (tall={tall}): {len(results)} candidates")

            usable = [
                item
                for item in results
                if (item.get("source") or "").lower() not in BLOCKED_SOURCES
                and relevance(slug, item) > 0
            ]
            # Strongest title match first, then licence, then resolution.
            ranked = sorted(
                usable,
                key=lambda item: (
                    -relevance(slug, item),
                    LICENSE_RANK.get(item.get("license", ""), 9),
                    -(item.get("width") or 0),
                ),
            )
            for item in ranked:
                identifier = item.get("id") or item.get("url")
                if identifier in seen:
                    continue
                seen.add(identifier)

                image = try_image(item)
                if image is None:
                    continue
                return image, item
    return None


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    credits: dict[str, dict] = {}

    for slug, queries in PLACES:
        print(f"\n{slug}")
        chosen = pick(slug, queries)
        if chosen is None:
            print("  NO USABLE IMAGE — leaving the terrain-art fallback in place")
            continue

        image, item = chosen
        target = OUT / f"{slug}.jpg"
        image.save(target, "JPEG", quality=85, optimize=True)

        credit = {
            "file": f"public/places/{slug}.jpg",
            "title": item.get("title") or "",
            "creator": item.get("creator") or "",
            "license": item.get("license") or "",
            "license_version": item.get("license_version") or "",
            "source": item.get("source") or "",
            "source_url": item.get("url") or "",
            "detail_url": item.get("foreign_landing_url") or "",
            "width": image.width,
            "height": image.height,
        }
        credits[slug] = credit
        print(f"  saved {target.name} ({image.width}x{image.height}) — "
              f"{credit['license']} · {credit['creator'][:40]} · {credit['title'][:50]}")

    (OUT / "photos.json").write_text(
        json.dumps(
            {
                "provider": "Openverse (https://openverse.org)",
                "note": "One photo per place. Attribution and source links below; "
                        "replace any file and update data.ts to customise.",
                "photos": credits,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"\n{len(credits)}/{len(PLACES)} photos saved; attribution in photos.json")


if __name__ == "__main__":
    main()
