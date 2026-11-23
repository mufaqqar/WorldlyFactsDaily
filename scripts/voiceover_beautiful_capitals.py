"""Generate the voiceover for "Top 10 Beautiful Capitals in the World".

Engine order:
  1. ElevenLabs (key read from .env — any variable containing ELEVEN)
  2. Google Translate TTS (free, no key) when ElevenLabs is unavailable
  3. edge-tts (only if Google TTS is also unreachable)

Each scene gets its own MP3 so calculateMetadata can size the composition to
the narration. Also writes durations.json (seconds + 30 fps scene frames) for
the composition's fallback timing. Run: python scripts/voiceover_beautiful_capitals.py
"""

import asyncio
import json
import math
import pathlib
import subprocess
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "beautiful-capitals"
FPS = 30
# Narration is played back slightly faster to keep the finished short under 150 s.
NARRATION_RATE = 1.28

# ElevenLabs — Adam, a deep, natural documentary voice.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.42,
    "similarity_boost": 0.82,
    "style": 0.24,
    "use_speaker_boost": True,
}

EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+4%"

SCENES = [
    (
        "01-intro",
        "Beauty is subjective, but some cities turn everyday life into a postcard. This is a curated countdown of ten beautiful national capitals, chosen for architecture, historic streetscapes, waterfronts and overall visual character.",
    ),
    (
        "10-copenhagen",
        "Number ten: Copenhagen, Denmark. Colourful seventeenth-century houses line the Nyhavn canal, while Tivoli Gardens and a waterfront built for cycling give the city its easy charm.",
    ),
    (
        "09-stockholm",
        "Number nine: Stockholm, Sweden. Founded in twelve fifty-two, it stretches across fourteen islands where Lake Mälaren meets the Baltic. Gamla Stan, the old town, is a maze of narrow cobbled streets.",
    ),
    (
        "08-ljubljana",
        "Number eight: Ljubljana, Slovenia. A castle above the river, dragon bridges and riverside cafés fill the old town. It won the European Green Capital award for twenty sixteen.",
    ),
    (
        "07-lisbon",
        "Number seven: Lisbon, Portugal. One of Europe's oldest capitals, it climbs steep hills above the Tagus, with tiled facades, yellow trams and the winding alleys of Alfama.",
    ),
    (
        "06-amsterdam",
        "Number six: Amsterdam, the Netherlands. Gabled houses lean over a canal belt added to the UNESCO World Heritage List in two thousand ten. It's no wonder they call it the Venice of the North.",
    ),
    (
        "05-budapest",
        "Number five: Budapest, Hungary. The Danube separates hilly Buda from flat Pest, joined by the Chain Bridge. The Parliament building and thermal baths make this the Pearl of the Danube.",
    ),
    (
        "04-vienna",
        "Number four: Vienna, Austria. Imperial palaces, the Ringstrasse boulevard and the grandeur of Schönbrunn recall the Habsburg empire, while coffee houses slow the pace.",
    ),
    (
        "03-rome",
        "Number three: Rome, Italy. The Eternal City layers ancient forums and the Colosseum beneath Baroque piazzas. Its historic centre is a UNESCO World Heritage Site.",
    ),
    (
        "02-prague",
        "Number two: Prague, Czech Republic. Red roofs, Charles Bridge and the astronomical clock in Old Town Square give this Gothic and Baroque capital a fairy-tale skyline. Its historic centre has been UNESCO-listed since nineteen ninety-two.",
    ),
    (
        "01-paris",
        "And number one: Paris, France. The City of Light pairs Haussmann boulevards and ironwork with the Eiffel Tower, the Seine and a century of art. Few capitals feel so instantly recognisable.",
    ),
    (
        "12-outro",
        "That's our editorial top ten beautiful capitals. Beauty is subjective, so tell us which one you would visit first, and follow for more rankings.",
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
        [
            ffprobe(),
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
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
