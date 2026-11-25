"""Generate the voiceover for "Top 10 Billionaire Mansions That Look Unreal".

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Run: python scripts/voiceover_billionaire_mansions.py
"""

import asyncio
import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "billionaire-mansions"

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
        "The world's most expensive billionaire mansions. Ten private residences ranked by one headline figure: a sale, an agreed deal, or a published valuation, in nominal US dollars.",
    ),
    (
        "10-billionaire",
        "Number ten: Billionaire, in Bel Air. Bruce Makowsky listed it for two hundred fifty million dollars in twenty seventeen, with twelve bedrooms and a bowling alley. It sold for ninety four million in twenty nineteen.",
    ),
    (
        "09-casa-encantada",
        "Number nine: Casa Encantada. This nineteen thirty eight Bel Air estate set American sale records twice. Peter Thiel bought it for one hundred thirty million dollars at a foreclosure auction in July twenty twenty six.",
    ),
    (
        "08-capital-hill-residence",
        "Number eight: Capital Hill Residence outside Moscow. The only private house designed by Zaha Hadid, built for Vladislav Doronin. The four floor villa is estimated to have cost one hundred forty million dollars.",
    ),
    (
        "07-the-one",
        "Number seven: The One, in Bel Air. Nile Niami asked five hundred million for this hundred and five thousand square foot compound, with twenty one bedrooms and five pools. Bankruptcy brought a one hundred forty one million dollar auction in twenty twenty two.",
    ),
    (
        "06-the-holme",
        "Number six: The Holme, by Regent's Park in London. Emirati developer Abbas Sajwani paid about one hundred ninety million pounds, roughly two hundred fifty million dollars, in June twenty twenty six, eighteen months after its last sale.",
    ),
    (
        "05-rutland-gate",
        "Number five: two to eight A Rutland Gate in Knightsbridge. Two hundred ten million pounds, about two hundred sixty million dollars, in twenty twenty: the most expensive house ever sold in the UK. Forty five bedrooms, empty since twenty fifteen.",
    ),
    (
        "04-witanhurst",
        "Number four: Witanhurst in North London. Bought by Andrey Guryev's family in two thousand eight, then given a vast basement. London's second largest private home, reported worth four hundred fifty million dollars.",
    ),
    (
        "03-fair-field",
        "Number three: Fair Field in Sagaponack, New York. Ira Rennert's hundred and ten thousand square foot estate has twenty nine bedrooms, and a tax valuation reported as high as five hundred million dollars.",
    ),
    (
        "02-villa-leopolda",
        "Number two: Villa La Léopolda on the French Riviera. In two thousand eight, Lily Safra agreed to sell it to Mikhail Prokhorov for three hundred seventy million euros plus furniture. The deal collapsed, but roughly six hundred million dollars.",
    ),
    (
        "01-antilia",
        "And number one: Antilia, in Mumbai. Mukesh Ambani's twenty seven storey home cost nearly two billion dollars to build. Valued at four point six billion in twenty twenty three, it has a garage for a hundred and sixty eight cars and a snow room.",
    ),
    (
        "12-outro",
        "From a Bel Air listing to a Mumbai tower, these are the wildest price tags on private homes. Which one falls next? Follow for more data driven rankings.",
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
    print(f"engine: {'ElevenLabs' if key else 'Google TTS (fallback)'}")

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
