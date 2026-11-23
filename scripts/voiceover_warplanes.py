"""Generate the voiceover for "Top 10 Warplanes of 2026".

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Also writes durations.json (seconds + 30 fps scene frames) for
the composition's fallback timing. Run: python scripts/voiceover_warplanes.py
"""

import asyncio
import json
import math
import pathlib
import subprocess
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "warplanes"
FPS = 30
NARRATION_RATE = 1.32

# ElevenLabs — Adam, a deep, natural documentary voice.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.82,
    "style": 0.24,
    "use_speaker_boost": True,
    "speed": 1.16,
}

EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+8%"

SCENES = [
    (
        "01-intro",
        "From stealth fighters to multirole icons, these are the ten most advanced warplanes in operational service in 2026. This editorial ranking weighs stealth, sensor fusion, multirole reach, fleet impact and combat role.",
    ),
    (
        "10-chengdu-j-10c",
        "Number ten: Chengdu J ten C. China's lightweight, canard-delta multirole fighter became operational in 2006, and the family now serves China, Pakistan and Uzbekistan in large numbers.",
    ),
    (
        "09-sukhoi-su-35s",
        "Number nine: Sukhoi Su thirty five S. Russia's supermaneuverable, four-and-a-half generation air superiority fighter entered service in 2014 and reached full operational capability in 2018.",
    ),
    (
        "08-boeing-f-15ex",
        "Number eight: Boeing F fifteen E X Eagle Two. The latest Advanced Eagle entered operational service in July 2024, pairing a proven airframe with modern avionics and electronic warfare protection.",
    ),
    (
        "07-eurofighter-typhoon",
        "Number seven: Eurofighter Typhoon. A multinational European multirole fighter, operational since 2003 and flown by air forces from the United Kingdom to Saudi Arabia and Qatar.",
    ),
    (
        "06-dassault-rafale",
        "Number six: Dassault Rafale. France's omnirole fighter, introduced in 2001, combines air superiority, deep strike, reconnaissance and nuclear deterrence in one highly adaptable aircraft.",
    ),
    (
        "05-sukhoi-su-57",
        "Number five: Sukhoi Su fifty seven. Russia's first operational stealth fighter entered service in December 2020, combining low observability, supercruise and supermaneuverability.",
    ),
    (
        "04-shenyang-j-35",
        "Number four: Shenyang J thirty five. China's new twin-engine stealth fighter entered service in 2025, and became the first fifth-generation fighter launched from an aircraft carrier by electromagnetic catapult.",
    ),
    (
        "03-chengdu-j-20",
        "Number three: Chengdu J twenty. China's all-weather stealth air superiority fighter entered service in March 2017, making China the second nation to field an operational stealth fighter.",
    ),
    (
        "02-lockheed-martin-f-22",
        "Number two: Lockheed Martin F twenty two Raptor. In service since December 2005, this stealth air superiority fighter brought supercruise, thrust vectoring and advanced sensor fusion to the skies.",
    ),
    (
        "01-lockheed-martin-f-35",
        "And number one: Lockheed Martin F thirty five Lightning Two. In service since 2015, it is the world's most numerous stealth aircraft, with three variants and sensor fusion that gives its pilot a complete battlefield picture.",
    ),
    (
        "12-outro",
        "That's the top ten warplanes of 2026. Which one would you choose? Follow for more data-driven rankings.",
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


def ffprobe() -> str:
    bundled = (
        ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc" / "ffprobe.exe"
    )
    return str(bundled) if bundled.exists() else "ffprobe"


def duration_of(path: pathlib.Path) -> float:
    output = subprocess.check_output(
        [ffprobe(), "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        text=True,
    ).strip()
    return float(output)


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    key = read_key()
    print(f"engine: {'ElevenLabs attempt first' if key else 'Google TTS'}")
    engines: dict[str, int] = {}

    for name, text in SCENES:
        target = OUT_DIR / f"{name}.mp3"
        data: bytes | None = None
        if key:
            try:
                data = eleven_bytes(text, key)
                engines["ElevenLabs"] = engines.get("ElevenLabs", 0) + 1
            except Exception as error:  # noqa: BLE001 - try the free fallback
                print(f"  ElevenLabs failed for {name}: {error}; using Google TTS")
        if data is None:
            try:
                data = google_bytes(text)
                engines["Google TTS"] = engines.get("Google TTS", 0) + 1
            except Exception as error:  # noqa: BLE001 - last resort
                print(f"  Google TTS failed for {name}: {error}; using edge-tts")
                data = await edge_bytes(text)
                engines["edge-tts"] = engines.get("edge-tts", 0) + 1
        target.write_bytes(data)
        print(f"wrote {target.relative_to(ROOT)} ({len(data) / 1024:.0f} KB)")

    durations: dict[str, float] = {}
    frames: list[int] = []
    for name, _ in SCENES:
        seconds = duration_of(OUT_DIR / f"{name}.mp3")
        durations[name] = round(seconds, 3)
        frames.append(max(60, math.ceil((seconds / NARRATION_RATE + 0.2) * FPS)))
    (OUT_DIR / "durations.json").write_text(
        json.dumps(
            {
                "narrationRate": NARRATION_RATE,
                "fps": FPS,
                "durations": durations,
                "sceneFrames": frames,
                "engines": engines,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print("scene frames:", frames, "total:", sum(frames))
    print("engines:", engines)


if __name__ == "__main__":
    asyncio.run(main())
