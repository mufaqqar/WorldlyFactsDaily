"""Generate the voiceover for "Top 10 Most Expensive Things in the World".

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Run: python scripts/voiceover_expensive_things.py
"""

import asyncio
import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "expensive-things"

# ElevenLabs — Adam, a deep, natural documentary voice.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.82,
    "style": 0.28,
    "use_speaker_boost": True,
    "speed": 1.1,
}

EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+5%"

SCENES = [
    (
        "01-intro",
        "The most expensive things in the world. Ten record holders, one for each category, ranked by the highest price ever reported for a single object. Nominal dollars, real sales, no estimates.",
    ),
    (
        "10-british-guiana-stamp",
        "Number ten: the British Guiana one cent Magenta. Issued in eighteen fifty six, it is the only copy known to exist. Collector Stuart Weitzman paid nine point four eight million dollars in twenty fourteen.",
    ),
    (
        "09-le-violon-dingres",
        "Number nine: Le Violon d'Ingres. Man Ray's nineteen twenty four photograph of Kiki de Montparnasse set the auction record for a photograph at twelve point four million dollars in New York in twenty twenty two.",
    ),
    (
        "08-lady-blunt",
        "Number eight: the Lady Blunt Stradivarius. Built by Antonio Stradivari in seventeen twenty one, this near pristine violin raised fifteen point nine million dollars for Japan's tsunami relief fund in twenty eleven.",
    ),
    (
        "07-1933-double-eagle",
        "Number seven: the nineteen thirty three double eagle. Struck but never circulated, the only privately owned example brought eighteen point eight seven million dollars at Sotheby's in June twenty twenty one.",
    ),
    (
        "06-babe-ruth-jersey",
        "Number six: Babe Ruth's called shot jersey. The uniform linked to his famous nineteen thirty two World Series moment sold for twenty four point one two million dollars in twenty twenty four, a record for sports memorabilia.",
    ),
    (
        "05-codex-leicester",
        "Number five: the Codex Leicester. Leonardo da Vinci's scientific notebook, written in his own hand, was bought by Bill Gates for thirty point eight million dollars in November nineteen ninety four.",
    ),
    (
        "04-grandmaster-chime",
        "Number four: the Patek Philippe Grandmaster Chime six three zero zero A. It fetched thirty one point one nine million dollars at Christie's Only Watch charity auction in Geneva in twenty nineteen.",
    ),
    (
        "03-pink-star",
        "Number three: the Pink Star. A fifty nine point six zero carat fancy vivid pink diamond mined in South Africa, bought by Chow Tai Fook for seventy one point two million dollars in Hong Kong in twenty seventeen.",
    ),
    (
        "02-mercedes-300-slr",
        "Number two: the Mercedes three hundred S L R Uhlenhaut. Mercedes Benz sold one of only two coupes ever built for one hundred thirty five million euros, roughly one hundred forty three million dollars, at its museum in May twenty twenty two.",
    ),
    (
        "01-salvator-mundi",
        "And number one: Salvator Mundi. Attributed to Leonardo da Vinci, though disputed by some scholars, this painting sold through Christie's for four hundred fifty point three million dollars in twenty seventeen. The most expensive object ever sold.",
    ),
    (
        "12-outro",
        "That is the list. From a stamp to a painting, these are the prices at the very top. Which record will fall next? Follow for more data driven rankings.",
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
    print(f"engine: {'ElevenLabs' if key else 'edge-tts'}")

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
