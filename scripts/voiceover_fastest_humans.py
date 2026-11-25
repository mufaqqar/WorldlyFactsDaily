"""Generate the voiceover for "Top 10 Fastest Humans in History".

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Run: python scripts/voiceover_fastest_humans.py
"""

import asyncio
import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "fastest-humans"

# ElevenLabs — Adam, a deep, natural documentary voice.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.82,
    "style": 0.28,
    "use_speaker_boost": True,
    "speed": 1.12,
}

EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+6%"

SCENES = [
    (
        "01-intro",
        "The fastest humans ever timed. Ten quickest wind legal hundred metre times, one per athlete, from the World Athletics all time list. Can anyone beat Usain Bolt?",
    ),
    (
        "10-ferdinand-omanyala",
        "Number ten: Ferdinand Omanyala. The Kenyan sprint star ran nine point seven seven in Nairobi in twenty twenty one, the African record and the fastest time ever recorded on the continent.",
    ),
    (
        "09-fred-kerley",
        "Number nine: Fred Kerley. An Olympic hundred metre silver medallist from Tokyo, Kerley clocked nine point seven six in Eugene in twenty twenty two.",
    ),
    (
        "08-trayvon-bromell",
        "Number eight: Trayvon Bromell. The American blazed nine point seven six in Nairobi in twenty twenty one, a mark set at altitude that still sits among the quickest in history.",
    ),
    (
        "07-christian-coleman",
        "Number seven: Christian Coleman. The twenty nineteen world champion ran nine point seven six in Doha, and also holds the sixty metre world record of six point three four.",
    ),
    (
        "06-kishane-thompson",
        "Number six: Kishane Thompson. The Jamaican took Olympic silver in Paris, then ran nine point seven five in Kingston in twenty twenty five to move into the top six of all time.",
    ),
    (
        "05-justin-gatlin",
        "Number five: Justin Gatlin. At thirty three years old, the American ran nine point seven four in Doha in twenty fifteen, and became world champion two years later.",
    ),
    (
        "04-asafa-powell",
        "Number four: Asafa Powell. The Jamaican former world record holder lowered his best to nine point seven two in Lausanne in two thousand eight.",
    ),
    (
        "03-yohan-blake",
        "Number three: Yohan Blake. In Lausanne in twenty twelve, the Jamaican ran nine point six nine, matching the second fastest time in history.",
    ),
    (
        "02-tyson-gay",
        "Number two: Tyson Gay. In Shanghai in two thousand nine, the American ran nine point six nine, still the fastest time ever by an athlete from the United States.",
    ),
    (
        "01-usain-bolt",
        "And number one: Usain Bolt, the Lightning Bolt. Nine point five eight at the two thousand nine World Championships in Berlin, a world record that has stood for seventeen years.",
    ),
    (
        "12-outro",
        "That is the list. Bolt's nine point five eight still stands. Can anyone break it? Follow for more data driven rankings.",
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
