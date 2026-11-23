import json
import sys
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

queries = [
    "list of countries by education",
    "educational attainment by country",
    "tertiary education by country",
    "mean years of schooling by country",
    "Education Index countries",
    "Human Development Index",
]

for query in queries:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": "8",
            "format": "json",
        }
    )
    req = urllib.request.Request(
        "https://en.wikipedia.org/w/api.php?" + params, headers=headers
    )
    with urllib.request.urlopen(req, timeout=45) as response:
        data = json.loads(response.read().decode("utf-8"))
    print("=== " + query + " ===")
    for item in data.get("query", {}).get("search", []):
        print("  -", item["title"])
    print()
