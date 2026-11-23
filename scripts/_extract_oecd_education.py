import json
import re
import sys
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
page = "List of countries by tertiary education attainment"


def api(params: dict):
    params = {**params, "format": "json", "formatversion": "2"}
    req = urllib.request.Request(
        "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params),
        headers=headers,
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


sections = api({"action": "parse", "page": page, "prop": "sections"})["parse"]["sections"]
for section in sections:
    print(section["index"], section["line"])

print("\n===== 2022 OECD SECTION WIKITEXT =====")
for section in sections:
    if "2022" in section["line"] and "OECD" in section["line"]:
        text = api(
            {"action": "parse", "page": page, "prop": "wikitext", "section": section["index"]}
        )["parse"]["wikitext"]
        print(text[:14000])
        break
