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
section = next(s for s in sections if s["line"] == "2022 OECD data")
text = api(
    {"action": "parse", "page": page, "prop": "wikitext", "section": section["index"]}
)["parse"]["wikitext"]

rows = re.findall(
    r"\|\{\{Flag\|([^}]+)\}\}\s*\n\|([0-9.]+)", text
)
parsed = [(name.strip(), float(value)) for name, value in rows]
parsed.sort(key=lambda item: item[1], reverse=True)
print("total rows:", len(parsed))
for rank, (name, value) in enumerate(parsed, 1):
    print(f"{rank:2d}. {name:24s} {value:.2f}")
print("\nTop 10 after excluding aggregates:")
top = [row for row in parsed if row[0] not in {"OECD average", "EU", "European Union"}][:10]
for rank, (name, value) in enumerate(top, 1):
    print(f"#{11-rank:02d} {name:24s} {value:.2f}")
print("OECD avg row:", next((v for n, v in parsed if n == "OECD average"), None))
print("EU row:", next((v for n, v in parsed if n == "EU"), None))
print("\nLines mentioning average:")
lines = text.splitlines()
for i, line in enumerate(lines):
    if "average" in line.lower() or "oecd" in line.lower():
        print(" ", line[:400])
        if "OECD average" in line:
            print("  CONTEXT:", lines[i + 1 : i + 5])
