"""Generate the voiceover for "Top 10 Famous Luxury Cars".

Primary engine: ElevenLabs (if key available in .env).
Fallback: edge-tts (free Microsoft neural voice, no API key).

Each scene gets its own MP3 so `calculateMetadata` can size the composition to
the narration. Run:  python scripts/voiceover_luxury_cars.py
"""

import asyncio
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "luxury-cars"

# ElevenLabs — Adam, a deep, natural American documentary voice.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.82,
    "style": 0.28,
    "use_speaker_boost": True,
    "speed": 1.16,
}

# Fallback voice.
EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+6%"

SCENES = [
    (
        "01-intro",
        "From handcrafted grand tourers to million-dollar hypercars, these are the top ten most famous luxury cars in the world.",
    ),
    (
        "10-bentley-continental-gt",
        "Number ten: the Bentley Continental G T. British craftsmanship and effortless power, built for crossing continents in style.",
    ),
    (
        "09-aston-martin-db12",
        "Number nine: the Aston Martin D B twelve. A super tourer with movie-star charisma, a roaring V eight, and timeless design.",
    ),
    (
        "08-porsche-911-turbo-s",
        "Number eight: the Porsche nine eleven Turbo S. The everyday supercar icon, delivering blistering speed with surgical precision.",
    ),
    (
        "07-mercedes-maybach-s680",
        "Number seven: the Mercedes-Maybach S six eighty. A first-class V twelve sanctuary, where silence and comfort are the ultimate luxuries.",
    ),
    (
        "06-mclaren-750s",
        "Number six: the McLaren seven fifty S. A lightweight carbon-fiber weapon, engineered for pure, uncompromising performance.",
    ),
    (
        "05-lamborghini-revuelto",
        "Number five: the Lamborghini Revuelto. A thousand-horsepower V twelve hybrid, and pure Italian theatre on wheels.",
    ),
    (
        "04-ferrari-sf90-stradale",
        "Number four: the Ferrari S F ninety Stradale. Formula One technology unleashed on the road, with electrified speed and iconic flair.",
    ),
    (
        "03-pagani-huayra",
        "Number three: the Pagani Huayra. A hand-built hypercar masterpiece, where every detail is crafted like fine art.",
    ),
    (
        "02-bugatti-chiron-super-sport",
        "Number two: the Bugatti Chiron Super Sport. A quad-turbo W sixteen legend, built to conquer speed itself.",
    ),
    (
        "01-rolls-royce-phantom",
        "And number one: the Rolls-Royce Phantom. The world's most famous symbol of automotive luxury, silent, bespoke, and utterly unmatched.",
    ),
    (
        "12-outro",
        "Which of these luxury legends is your dream car? Follow for more iconic rankings.",
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
            data = await edge_bytes(text)
        target.write_bytes(data)
        print(f"wrote {target.relative_to(ROOT)} ({len(data) / 1024:.0f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
