"""Generate the voiceover for "The 10 Most Populous Countries".

Primary engine: ElevenLabs (professional American documentary narrator).
Fallback: edge-tts (free Microsoft neural voice, no API key).

Each scene gets its own MP3 so `calculateMetadata` can size the composition to
the narration. Run:  python scripts/voiceover_population.py
"""

import asyncio
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "population"

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
        "Two countries hold more than a third of humanity. Here are the ten "
        "most populous countries on Earth, in twenty twenty-six.",
    ),
    (
        "10-ethiopia",
        "Number ten, Ethiopia. One hundred thirty-nine million people, and one "
        "of the fastest growing populations on the planet.",
    ),
    (
        "09-russia",
        "Number nine, Russia. The largest country on Earth, but just one hundred "
        "forty-three million people. And shrinking.",
    ),
    (
        "08-bangladesh",
        "Number eight, Bangladesh. One hundred seventy-eight million people, "
        "packed into a delta about the size of Iowa.",
    ),
    (
        "07-brazil",
        "Number seven, Brazil. Two hundred thirteen million, the largest "
        "population in Latin America.",
    ),
    (
        "06-nigeria",
        "Number six, Nigeria. Two hundred forty-two million people, and a median "
        "age of just eighteen.",
    ),
    (
        "05-pakistan",
        "Number five, Pakistan. Two hundred fifty-nine million, growing one "
        "point six percent a year.",
    ),
    (
        "04-indonesia",
        "Number four, Indonesia. Two hundred eighty-eight million people, "
        "spread across seventeen thousand islands.",
    ),
    (
        "03-united-states",
        "Number three, the United States. Three hundred forty-nine million. The "
        "only wealthy nation in the top ten.",
    ),
    (
        "02-china",
        "Number two, China. One point four billion people, and shrinking for the "
        "first time in decades.",
    ),
    (
        "01-india",
        "And number one, India. One point four eight billion people. Nearly one "
        "in five humans alive today.",
    ),
    (
        "12-outro",
        "India and China together: thirty-five percent of humanity. Follow for "
        "more data stories.",
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
