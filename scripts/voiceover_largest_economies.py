"""Generate the voiceover for "World's Largest Economies" (2026).

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Also writes durations.json (seconds + 30 fps scene frames) for
the composition's fallback timing. Run: python scripts/voiceover_largest_economies.py
"""

import asyncio
import json
import math
import pathlib
import subprocess
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "largest-economies"
FPS = 30
NARRATION_RATE = 1.22

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
        "From the United States to Brazil, these are the ten largest economies in the world. This ranking uses International Monetary Fund projections for nominal G D P in twenty twenty-six, measured in US dollars at market exchange rates.",
    ),
    (
        "10-brazil",
        "Number ten: Brazil. The largest economy in South America is projected at two point six five trillion dollars, around two percent of total world output.",
    ),
    (
        "09-italy",
        "Number nine: Italy. At two point seven zero trillion dollars, Italy stays just ahead of Brazil, supported by manufacturing, design and a large services sector.",
    ),
    (
        "08-russia",
        "Number eight: Russia. Its economy is projected at two point eight six trillion dollars. Energy exports still shape its output, and the dollar figure moves with commodity prices and exchange rates.",
    ),
    (
        "07-france",
        "Number seven: France. Three point five five trillion dollars, with aerospace, luxury goods and tourism among its strongest exports.",
    ),
    (
        "06-india",
        "Number six: India. Four point zero six trillion dollars, closing the gap on the United Kingdom and Japan as its services and manufacturing base expand.",
    ),
    (
        "05-united-kingdom",
        "Number five: the United Kingdom. Four point two seven trillion dollars, with London's financial services and a broad services economy anchoring the total.",
    ),
    (
        "04-japan",
        "Number four: Japan. Four point three four trillion dollars, just ahead of the United Kingdom. The gap between them is under two percent.",
    ),
    (
        "03-germany",
        "Number three: Germany. Five point four seven trillion dollars. It is Europe's largest economy and the export backbone of the euro area.",
    ),
    (
        "02-china",
        "Number two: China. Twenty-one point five five trillion dollars. That is about two thirds of United States output, and more than Germany, Japan, India and the United Kingdom combined.",
    ),
    (
        "01-united-states",
        "And number one: the United States. Thirty-two point six four trillion dollars, roughly one quarter of all world G D P, and about one and a half times the size of China's economy.",
    ),
    (
        "12-outro",
        "That's the world's ten largest economies of twenty twenty-six, ranked by nominal G D P from the International Monetary Fund. Follow for more data-driven rankings.",
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
