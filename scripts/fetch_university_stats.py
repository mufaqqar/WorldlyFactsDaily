"""Fetch student / staff numbers for the QS 2027 top 10 from TopUniversities.

The QS ranking table itself is rendered client-side, so the individual
university pages are used instead. Only the "Students & Staff" figures are
pulled out; everything is printed as compact JSON for `src/universities/data.ts`.

Run: python scripts/fetch_university_stats.py
"""

import json
import re
import urllib.request

SLUGS = [
    "massachusetts-institute-technology-mit",
    "imperial-college-london",
    "stanford-university",
    "university-oxford",
    "harvard-university",
    "university-cambridge",
    "california-institute-technology-caltech",
    "eth-zurich-swiss-federal-institute-technology",
    "ucl",
    "national-university-singapore-nus",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
}


def fetch(slug: str) -> str:
    request = urllib.request.Request(
        f"https://www.topuniversities.com/universities/{slug}",
        headers=HEADERS,
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", "replace")


def text_of(html: str) -> str:
    html = re.sub(r"<script.*?</script>", " ", html, flags=re.S)
    html = re.sub(r"<style.*?</style>", " ", html, flags=re.S)
    return re.sub(r"<[^>]+>", " ", html)


def numbers(body: str, label: str) -> list[str]:
    match = re.search(
        rf"{label}\s*([\d,]+)", body, flags=re.I
    )
    return match.group(1) if match else ""


def main() -> None:
    rows = []
    for slug in SLUGS:
        body = " ".join(text_of(fetch(slug)).split())

        stats = re.search(r"Students & Staff(.*?)(Student life|Scholarships)", body)
        stats = stats.group(1) if stats else body

        rank = re.search(r"ranked\s*#\s*(\d+)\s*in QS World University Rankings\s*(\d{4})", body)
        total = numbers(stats, "Total students")
        international = numbers(stats, "International students")
        faculty = numbers(stats, "Total faculty staff")

        rows.append(
            {
                "slug": slug,
                "rank": int(rank.group(1)) if rank else None,
                "edition": rank.group(2) if rank else None,
                "students": int(total.replace(",", "")) if total else None,
                "international": int(international.replace(",", "")) if international else None,
                "faculty": int(faculty.replace(",", "")) if faculty else None,
            }
        )
        print(f"  {slug}: {rows[-1]}", flush=True)

    print(json.dumps(rows, indent=2))


if __name__ == "__main__":
    main()
