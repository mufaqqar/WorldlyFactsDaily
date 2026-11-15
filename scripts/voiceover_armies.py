"""Generate the voiceover for "The 10 Most Dangerous Armies".

Primary engine: ElevenLabs (professional American documentary narrator).
Fallback: edge-tts (free Microsoft neural voice, no API key).

Each scene gets its own MP3 so `calculateMetadata` can size the composition to
the narration. Run:  python scripts/voiceover_armies.py
"""

import asyncio
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "armies"

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

# Order matters: intro, countdown 10 → 1, outro. The copy is deliberately
# terse so the finished video stays under one minute with 0.2 s of air per scene.
SCENES = [
    (
        "01-intro",
        "Ten armies. The most dangerous fighting forces on Earth, twenty "
        "twenty-six.",
    ),
    (
        "10-italy",
        "Number ten, Italy. Two carriers, and the Mediterranean's largest navy.",
    ),
    (
        "09-turkiye",
        "Number nine, Turkey. Half a million troops, over two thousand tanks.",
    ),
    (
        "08-united-kingdom",
        "Number eight, the UK. Two carriers and a nuclear deterrent at sea.",
    ),
    (
        "07-japan",
        "Number seven, Japan. Asia's most modern fleet, twenty-three submarines.",
    ),
    (
        "06-france",
        "Number six, France. Europe's only nuclear-powered aircraft carrier.",
    ),
    (
        "05-south-korea",
        "Number five, South Korea. Three million reservists on standby.",
    ),
    (
        "04-india",
        "Number four, India. One point four million troops, and two carriers.",
    ),
    (
        "03-china",
        "Number three, China. The largest navy on Earth, by hull count.",
    ),
    (
        "02-russia",
        "Number two, Russia. The largest tank fleet on Earth.",
    ),
    (
        "01-united-states",
        "And number one, the United States. Eleven carriers, and a budget "
        "bigger than the next four combined.",
    ),
    (
        "12-outro",
        "Ten armies. Follow for more military rankings.",
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
