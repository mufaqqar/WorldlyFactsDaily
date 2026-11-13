"""Replace two city images with better skyline/landmark shots."""

import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "cities"
UA = "RemotionCityRanking/1.0 (educational video)"

WANTED = {
    "03-lucerne": ("Lucerne", "Luzern am Vierwaldstättersee Luftaufnahme 2012 10"),
    "02-george-town": ("George Town, Cayman Islands", "Camana Bay skyline"),
}


def media(title: str):
    url = (
        "https://en.wikipedia.org/api/rest_v1/page/media-list/"
        + urllib.parse.quote(title.replace(" ", "_"), safe="")
    )
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=40) as response:
        return json.loads(response.read()).get("items", [])


def pick(items, needle: str):
    needle = needle.lower().replace(" ", "_")
    for item in items:
        if item.get("type") != "image":
            continue
        title = item.get("title", "").replace("File:", "").replace(" ", "_").lower()
        if needle in title:
            srcset = item.get("srcset", [])
            best = max(srcset, key=lambda entry: entry.get("desiredWidth", 0))
            src = best["src"]
            if src.startswith("//"):
                src = "https:" + src
            return item["title"], src
    raise SystemExit(f"not found: {needle}")


def main():
    sources_path = OUT / "sources.json"
    sources = json.loads(sources_path.read_text(encoding="utf-8"))
    for slug, (page, needle) in WANTED.items():
        title, src = pick(media(page), needle)
        src = src.replace("/500px-", "/1280px-")
        request = urllib.request.Request(src, headers={"User-Agent": UA})
        with urllib.request.urlopen(request, timeout=60) as response:
            blob = response.read()
        target = OUT / f"{slug}.jpg"
        target.write_bytes(blob)
        sources[slug] = {
            "title": title,
            "file": f"cities/{target.name}",
            "image": src,
            "page": "https://en.wikipedia.org/wiki/"
            + urllib.parse.quote(page.replace(" ", "_")),
            "bytes": len(blob),
        }
        print(f"{slug}: {title} {len(blob) / 1024:.0f} KB")
    sources_path.write_text(
        json.dumps(sources, indent=2, ensure_ascii=False), encoding="utf-8"
    )


if __name__ == "__main__":
    main()
