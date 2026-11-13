"""Search Wikimedia Commons for a better city image and download it."""

import json
import pathlib
import sys
import time
import urllib.parse
import urllib.request

UA = "RemotionCityRanking/1.0 (educational video)"
ROOT = pathlib.Path(__file__).resolve().parent.parent


def call(url: str, attempts: int = 4) -> dict:
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(request, timeout=40) as response:
                return json.loads(response.read())
        except Exception as error:  # noqa: BLE001
            if attempt == attempts - 1:
                raise
            time.sleep(2 * (attempt + 1))
    raise RuntimeError("unreachable")


def search(term: str, limit: int = 8):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": f"filetype:bitmap {term}",
            "gsrnamespace": "6",
            "gsrlimit": str(limit),
            "prop": "imageinfo",
            "iiprop": "url|size|extmetadata",
            "iiurlwidth": "1280",
            "format": "json",
            "formatversion": "2",
        }
    )
    data = call(url)
    rows = []
    for page in data.get("query", {}).get("pages", []):
        info = page["imageinfo"][0]
        rows.append(
            {
                "title": page["title"],
                "width": info["width"],
                "height": info["height"],
                "thumb": info.get("thumburl"),
                "url": info.get("url"),
                "artist": info.get("extmetadata", {})
                .get("Artist", {})
                .get("value", ""),
                "license": info.get("extmetadata", {})
                .get("LicenseShortName", {})
                .get("value", ""),
                "description": info.get("extmetadata", {})
                .get("ImageDescription", {})
                .get("value", ""),
            }
        )
    return rows


if __name__ == "__main__":
    for term in sys.argv[1:]:
        print(f"=== {term} ===")
        for row in search(term):
            print(
                f"{row['title']}  [{row['width']}x{row['height']}]  {row['license']}"
            )
