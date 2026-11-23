"""Generate the voiceover for "Top 10 Most Educated Countries" (2026).

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Also writes durations.json (seconds + 30 fps scene frames) for
the composition's fallback timing. Run: python scripts/voiceover_educated_countries.py
"""

import asyncio
import json
import math
import pathlib
import subprocess
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "educated-countries"
FPS = 30
NARRATION_RATE = 1.28

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
        "These are the ten most educated countries in the world, measured by the share of adults aged twenty-five to sixty-four who have completed tertiary education. The figures come from the O E C D two thousand twenty-two data table, mirrored on Wikipedia and accessed on the twenty-third of November, two thousand twenty-six. This measures degrees held, not school quality.",
    ),
    (
        "10-norway",
        "Number ten: Norway. Forty-eight point one zero percent of adults have completed tertiary education. That is seven point six six percentage points above the O E C D average, but fourteen point six four points behind Canada.",
    ),
    (
        "09-sweden",
        "Number nine: Sweden. Forty-eight point five three percent. Sweden is just ahead of Norway, and sits eight point zero nine points above the O E C D average.",
    ),
    (
        "08-united-states",
        "Number eight: the United States. Fifty point zero two percent, just over half of adults. That is nine point five eight points above the O E C D average.",
    ),
    (
        "07-israel",
        "Number seven: Israel. Fifty point six two percent. Israel moves past the halfway mark, ten point one eight points above the O E C D average.",
    ),
    (
        "06-united-kingdom",
        "Number six: the United Kingdom. Fifty-one point three two percent of adults have a tertiary qualification, ten point eight eight points above the O E C D average.",
    ),
    (
        "05-luxembourg",
        "Number five: Luxembourg. Fifty-one point four nine percent. Despite its small population, Luxembourg ranks fifth in this table, eleven point zero five points above the average.",
    ),
    (
        "04-australia",
        "Number four: Australia. Fifty-one point five zero percent. Australia edges Luxembourg by just one hundredth of a percentage point.",
    ),
    (
        "03-south-korea",
        "Number three: South Korea. Fifty-two point eight zero percent. That is twelve point three six points above the O E C D average, and the highest figure in East Asia.",
    ),
    (
        "02-ireland",
        "Number two: Ireland. Fifty-four point three nine percent. Ireland is eight point three five points behind Canada, but still thirteen point nine five points above the O E C D average.",
    ),
    (
        "01-canada",
        "And number one: Canada. Sixty-two point seven four percent of adults have completed tertiary education. That is twenty-two point three zero points above the O E C D average, and the highest figure in the table.",
    ),
    (
        "12-outro",
        "That's the top ten most educated countries by tertiary attainment, using O E C D two thousand twenty-two data. It is a snapshot of adults aged twenty-five to sixty-four, not a ranking of school quality. Follow for more data-driven rankings.",
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
