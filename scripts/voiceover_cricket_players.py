"""Generate the voiceover for "Top 10 Cricket Players of 2026".

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Run: python scripts/voiceover_cricket_players.py
"""

import asyncio
import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "cricket-players"

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
        "From the Test arena to the T20 stage, these are the ten highest-rated cricketers of 2026, ranked by their best current I C C rating across all three formats.",
    ),
    (
        "10-rashid-khan",
        "Number ten: Rashid Khan. The Afghan leg-spin wizard is number one in both O D I and T20 international bowling, with a best rating of seven sixty.",
    ),
    (
        "09-virat-kohli",
        "Number nine: Virat Kohli. Still one of the greatest chase masters in the game, the Indian legend sits third in the O D I batting charts at seven eighty-one.",
    ),
    (
        "08-travis-head",
        "Number eight: Travis Head. Australia's explosive left-hander is third in Test batting, with a rating of seven ninety-nine.",
    ),
    (
        "07-joe-root",
        "Number seven: Joe Root. England's record run-scorer and the world's number two Test batter, rated eight sixteen.",
    ),
    (
        "06-shubman-gill",
        "Number six: Shubman Gill. India's Test captain and the number one O D I batter in the world, on eight twenty-two.",
    ),
    (
        "05-harry-brook",
        "Number five: Harry Brook. The world's number one Test batter with eight sixty-one, and a match-winner in every format.",
    ),
    (
        "04-marco-jansen",
        "Number four: Marco Jansen. South Africa's giant all-rounder is the top-ranked Test all-rounder and second in Test bowling, at eight seventy-five.",
    ),
    (
        "03-mitchell-starc",
        "Number three: Mitchell Starc. Left-arm pace at its deadliest — the number one Test bowler in the world, rated eight eighty-one.",
    ),
    (
        "02-sahibzada-farhan",
        "Number two: Sahibzada Farhan. Pakistan's explosive opener is second in the world in T20 international batting, with eight eighty-three.",
    ),
    (
        "01-abhishek-sharma",
        "And number one: Abhishek Sharma. India's dynamic opener tops the T20 international batting rankings with eight eighty-nine — the highest-rated cricketer of 2026.",
    ),
    (
        "12-outro",
        "That's the top ten. Who is your number one? Follow for more data-driven sports rankings.",
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
