"""Generate the voiceover for "Top 10 Football Players in the World 2026".

Primary engine: ElevenLabs (if key available in .env).
Fallback: edge-tts (free Microsoft neural voice, no API key).

Each scene gets its own MP3 so `calculateMetadata` can size the composition to
the narration. Run:  python scripts/voiceover_football_players.py
"""

import asyncio
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "football-players"

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
        "Who are the top ten football players in the world in twenty twenty-six? "
        "From unstoppable scorers to magical playmakers, here is our countdown.",
    ),
    (
        "10-pedri",
        "Number ten: Pedri. Barcelona's midfield maestro, dictating play with vision, "
        "control, and effortless class.",
    ),
    (
        "09-raphinha",
        "Number nine: Raphinha. Relentless energy, decisive goals, and creativity "
        "driving Barcelona from the front.",
    ),
    (
        "08-mohamed-salah",
        "Number eight: Mohamed Salah. Liverpool's Egyptian king, still delivering "
        "world-class finishing and big moments.",
    ),
    (
        "07-harry-kane",
        "Number seven: Harry Kane. Bayern Munich's complete striker, combining elite "
        "scoring with brilliant link-up play.",
    ),
    (
        "06-vinicius-junior",
        "Number six: Vinícius Júnior. Real Madrid's electric winger, terrifying "
        "defenders with pace, flair, and end product.",
    ),
    (
        "05-jude-bellingham",
        "Number five: Jude Bellingham. A powerhouse midfielder for Real Madrid, "
        "dominating matches with drive, goals, and leadership.",
    ),
    (
        "04-lamine-yamal",
        "Number four: Lamine Yamal. Barcelona's teenage phenomenon, dazzling the world "
        "with fearless skill beyond his years.",
    ),
    (
        "03-ousmane-dembele",
        "Number three: Ousmane Dembélé. Paris Saint-Germain's Ballon d'Or winner, "
        "unplayable with speed, balance, and precision.",
    ),
    (
        "02-kylian-mbappe",
        "Number two: Kylian Mbappé. Real Madrid's superstar forward, blending "
        "explosive pace with ruthless finishing.",
    ),
    (
        "01-erling-haaland",
        "And number one: Erling Haaland. Manchester City's goal machine, the most "
        "dominant striker in world football.",
    ),
    (
        "12-outro",
        "Who will top the list next year? Follow for more football rankings.",
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
