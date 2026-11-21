"""Generate the voiceover for "Top 10 Luxury Bikes of 2026".

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Run: python scripts/voiceover_luxury_bikes.py
"""

import asyncio
import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "luxury-bikes"

# ElevenLabs — Adam, a deep, natural documentary voice.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.82,
    "style": 0.28,
    "use_speaker_boost": True,
    "speed": 1.16,
}

EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+6%"

SCENES = [
    (
        "01-intro",
        "From limited-edition hyperbikes to luxury tourers, these are the ten most expensive motorcycles on the 2026 India price list. Ranked by approximate ex-showroom price, using the upper end when a range is published.",
    ),
    (
        "10-indian-challenger-dark-horse",
        "Number ten: Indian Challenger Dark Horse. A performance-focused luxury bagger with a liquid-cooled PowerPlus engine, priced at approximately thirty-seven lakh rupees.",
    ),
    (
        "09-honda-gold-wing-tour",
        "Number nine: Honda Gold Wing Tour. The flat-six touring icon, with navigation and premium audio, costs around forty-two lakh rupees in India.",
    ),
    (
        "08-bmw-m-1000-xr",
        "Number eight: B M W M one thousand X R. Superbike performance in an upright touring package, from approximately forty-five lakh rupees.",
    ),
    (
        "07-indian-pursuit-dark-horse",
        "Number seven: Indian Pursuit Dark Horse. A fully dressed PowerPlus tourer with ride modes and cruise control, around forty-seven lakh rupees.",
    ),
    (
        "06-bmw-m-1000-rr",
        "Number six: B M W M one thousand R R. Aerodynamic winglets and around two hundred and twelve horsepower, priced at about fifty-five lakh rupees.",
    ),
    (
        "05-harley-davidson-cvo-road-glide",
        "Number five: Harley-Davidson C V O Road Glide. Factory-custom touring with exclusive paint and a Milwaukee-Eight V-twin, around sixty-seven lakh rupees.",
    ),
    (
        "04-indian-roadmaster-elite",
        "Number four: Indian Roadmaster Elite. Hand-painted finishes, heated seats and a torquey Thunderstroke engine, from about seventy-two lakh rupees.",
    ),
    (
        "03-kawasaki-ninja-h2r",
        "Number three: Kawasaki Ninja H two R. A supercharged, track-only hypersport with over three hundred horsepower, at nearly eighty lakh rupees.",
    ),
    (
        "02-ducati-panigale-v4-r",
        "Number two: Ducati Panigale V four R. World Superbike homologation engineering and a screaming nine hundred and ninety-eight cubic centimetre V-four, around eighty-five lakh rupees.",
    ),
    (
        "01-ducati-superleggera-v4",
        "And number one: Ducati Superleggera V four. Extensive carbon fibre, limited production and around two hundred and twenty-four horsepower, at an estimated one crore thirty-three lakh rupees — the most expensive bike on this 2026 list.",
    ),
    (
        "12-outro",
        "That's the top ten. Which one would you ride? Follow for more data-driven rankings.",
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


def google_bytes(text: str) -> bytes:
    """Free Google TTS fallback. Long text is split into word-boundary chunks."""
    chunks: list[str] = []
    current = ""
    for word in text.split():
        candidate = f"{current} {word}".strip()
        if len(candidate) > 170 and current:
            chunks.append(current)
            current = word
        else:
            current = candidate
    if current:
        chunks.append(current)

    audio = bytearray()
    for chunk in chunks:
        url = (
            "https://translate.google.com/translate_tts?ie=UTF-8"
            "&client=tw-ob&tl=en&q=" + urllib.parse.quote(chunk)
        )
        request = urllib.request.Request(
            url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            audio.extend(response.read())
    return bytes(audio)


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
    print(f"engine: {'ElevenLabs attempt first' if key else 'Google TTS'}")

    for name, text in SCENES:
        target = OUT_DIR / f"{name}.mp3"
        data: bytes | None = None
        if key:
            try:
                data = eleven_bytes(text, key)
            except Exception as error:  # noqa: BLE001 - try the free fallback
                print(f"  ElevenLabs failed for {name}: {error}; using Google TTS")
        if data is None:
            try:
                data = google_bytes(text)
            except Exception as error:  # noqa: BLE001 - last resort
                print(f"  Google TTS failed for {name}: {error}; using edge-tts")
                data = await edge_bytes(text)
        target.write_bytes(data)
        print(f"wrote {target.relative_to(ROOT)} ({len(data) / 1024:.0f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
