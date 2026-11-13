"""Generate the voiceover for "The 10 Most Expensive Cities in the World".

Primary engine: ElevenLabs (professional American documentary narrator).
Fallback: edge-tts (free Microsoft neural voice, no API key).

Each scene gets its own MP3 so `calculateMetadata` can size the composition to
the narration. Run:  python scripts/voiceover_cities.py
"""

import asyncio
import json
import pathlib
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "cities"

# ElevenLabs — Adam, a deep, natural American documentary voice.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.82,
    "style": 0.28,
    "use_speaker_boost": True,
    "speed": 1.18,
}

# Fallback voice.
EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+8%"

# Order matters: intro, countdown 10 → 1, outro.
SCENES = [
    (
        "01-intro",
        "Which city costs the most to live in? Numbeo's 2026 index. Here are "
        "the top ten.",
    ),
    (
        "10-honolulu",
        "Number ten, Honolulu. Groceries run twenty-eight percent above New "
        "York.",
    ),
    (
        "09-bern",
        "Number nine, Bern. A medieval capital with some of Europe's tightest "
        "housing.",
    ),
    (
        "08-lausanne",
        "Number eight, Lausanne. Olympic headquarters, with lakefront rents to "
        "match.",
    ),
    (
        "07-st-gallen",
        "Number seven, St. Gallen. Even the basics carry a Swiss premium.",
    ),
    (
        "06-lugano",
        "Number six, Lugano. Dining out runs thirty-one percent above New "
        "York.",
    ),
    (
        "05-geneva",
        "Number five, Geneva. The U.N. and private banking, at world capital "
        "prices.",
    ),
    (
        "04-basel",
        "Number four, Basel. A pharma hub where Switzerland, France and "
        "Germany meet.",
    ),
    (
        "03-lucerne",
        "Number three, Lucerne. Tourists love it. So do restaurant prices.",
    ),
    (
        "02-george-town",
        "Number two, George Town. Offshore finance, island prices: groceries "
        "thirty percent above New York.",
    ),
    (
        "01-zurich",
        "And number one, Zurich, at one hundred twenty-three point one. "
        "Twenty-three percent above New York.",
    ),
    (
        "12-outro",
        "Eight of the ten are Swiss. Follow for more rankings.",
    ),
]


def read_key() -> str | None:
    env = ROOT / ".env"
    if not env.exists():
        return None
    for line in env.read_text(encoding="utf-8").splitlines():
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        if "ELEVEN" in key.upper():
            return value.strip().strip('"').strip("'")
    return None


def eleven_bytes(text: str, key: str) -> bytes:
    request = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE}",
        data=json.dumps(
            {
                "text": text,
                "model_id": ELEVEN_MODEL,
                "voice_settings": VOICE_SETTINGS,
            }
        ).encode("utf-8"),
        headers={
            "xi-api-key": key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
    )
    with urllib.request.urlopen(request, timeout=180) as response:
        return response.read()


async def edge_bytes(text: str) -> bytes:
    import edge_tts

    communicate = edge_tts.Communicate(text, EDGE_VOICE, rate=EDGE_RATE)
    chunks: list[bytes] = []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            chunks.append(chunk["data"])
    return b"".join(chunks)


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    key = read_key()
    engine = "ElevenLabs" if key else "edge-tts"
    print(f"engine: {engine}")

    for name, text in SCENES:
        target = OUT_DIR / f"{name}.mp3"
        data: bytes | None = None
        if key:
            try:
                data = eleven_bytes(text, key)
            except Exception as error:  # noqa: BLE001 - fall back to edge-tts
                print(f"  ElevenLabs failed for {name}: {error}; falling back")
        if data is None:
            if not key:
                raise SystemExit(
                    "No ElevenLabs key found in .env — refusing to ship a "
                    "fallback voice for the final render."
                )
            data = await edge_bytes(text)
        target.write_bytes(data)
        print(f"wrote {target.relative_to(ROOT)} ({len(data) / 1024:.0f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
