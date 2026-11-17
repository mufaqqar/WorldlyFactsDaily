import pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "flags"
UA = {"User-Agent": "Mozilla/5.0 (remotion-showcase build)"}
CODES = ["tz", "ca", "pf", "gr", "ar", "vn", "pe", "is"]

for code in CODES:
    target = OUT / f"{code}.png"
    if target.exists():
        print(f"{code}: exists ({target.stat().st_size} bytes)")
        continue
    url = f"https://flagcdn.com/w1280/{code}.png"
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        target.write_bytes(r.read())
    print(f"{code}: downloaded {target.stat().st_size} bytes")
