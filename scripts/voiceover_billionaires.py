"""Generate the voiceover for "The World's 10 Richest People".

Primary engine: ElevenLabs (professional American documentary narrator).
Fallback: edge-tts (free Microsoft neural voice, no API key).

Each scene gets its own MP3 so `calculateMetadata` can size the composition to
the narration. Run:  python scripts/voiceover_billionaires.py
"""

import asyncio
import json
import pathlib
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "billionaires"

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

SCENES = [
    (
        "01-intro",
        "Who are the ten richest people on Earth? From tech titans to retail "
        "empires, let's count them down.",
    ),
    (
        "10-amancio-ortega",
        "Number ten: Amancio Ortega, Zara's founder, one hundred forty-eight "
        "billion.",
    ),
    (
        "09-warren-buffett",
        "Number nine: Warren Buffett, one hundred forty-nine billion.",
    ),
    (
        "08-jensen-huang",
        "Number eight: Jensen Huang, Nvidia's C-E-O, one hundred fifty-four "
        "billion.",
    ),
    (
        "07-bernard-arnault",
        "Number seven: Bernard Arnault, one hundred seventy-one billion.",
    ),
    (
        "06-larry-ellison",
        "Number six: Larry Ellison, one hundred ninety billion.",
    ),
    (
        "05-mark-zuckerberg",
        "Number five: Mark Zuckerberg, two hundred twenty-two billion.",
    ),
    (
        "04-jeff-bezos",
        "Number four: Jeff Bezos, Amazon's founder, two hundred twenty-four "
        "billion.",
    ),
    (
        "03-sergey-brin",
        "Number three: Sergey Brin, two hundred thirty-seven billion.",
    ),
    (
        "02-larry-page",
        "Number two: Larry Page, two hundred fifty-seven billion.",
    ),
    (
        "01-elon-musk",
        "And number one, the richest person on Earth: Elon Musk, eight hundred "
        "thirty-nine billion dollars.",
    ),
    (
        "12-outro",
        "Who will take the crown next year? Follow for more.",
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
