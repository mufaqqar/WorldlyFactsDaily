"""Generate the voiceover for "The 10 Most Beautiful Places on Earth".

Primary engine: ElevenLabs (same narrator as the other data stories).
Fallback: edge-tts (free Microsoft neural voice, no API key).

Each scene gets its own MP3 so `calculateMetadata` can size the composition to
the narration. Durations are also written to `public/voiceover/places/durations.json`
so the OCR QA script can derive the same frame numbers without ffmpeg.

Run:  python scripts/voiceover_places.py
"""

import asyncio
import json
import math
import pathlib
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "places"

# ElevenLabs — Adam, the narrator used by the other rankings.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.4,
    "similarity_boost": 0.85,
    "style": 0.25,
    "use_speaker_boost": True,
    "speed": 1.1,
}

# Fallback voice.
EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+8%"

FPS = 30
BREATHING_ROOM = 0.2
MIN_FRAMES = 60

# Order matters: intro, countdown 10 → 1, outro. Matches `PLACES` in data.ts.
#
# "Igwa-zoo" and "Yoh-kul-sar-lon" are deliberate phonetic spellings: the
# narrator mispronounces the native spellings of Iguazú and Jökulsárlón.
SCENES = [
    (
        "01-intro",
        "Ten places. One planet. From rice terraces to glacial lagoons, these "
        "are the most beautiful places on Earth.",
    ),
    (
        "10-ubud",
        "Number ten: Ubud, on the island of Bali. Rice terraces, jungle "
        "ravines, and the cultural heart of Indonesia.",
    ),
    (
        "09-cappadocia",
        "Number nine: Cappadocia, in Türkiye. Volcanic valleys carved into "
        "fairy chimneys, and balloons at first light.",
    ),
    (
        "08-serengeti",
        "Number eight: the Serengeti. Thirty thousand square kilometres of "
        "grassland, where the herds follow the rains.",
    ),
    (
        "07-banff",
        "Number seven: Banff, in the Canadian Rockies. Glacier-fed lakes "
        "beneath the Valley of the Ten Peaks.",
    ),
    (
        "06-bora-bora",
        "Number six: Bora Bora. A lagoon in every shade of blue, beneath the "
        "peak of Mount Otemanu.",
    ),
    (
        "05-santorini",
        "Number five: Santorini. White villages on the rim of a drowned "
        "volcano, above the Aegean.",
    ),
    (
        "04-iguazu",
        "Number four: Igwa-zoo Falls. Two hundred and seventy-five cascades "
        "between Argentina and Brazil.",
    ),
    (
        "03-ha-long",
        "Number three: Ha Long Bay, Vietnam. Almost two thousand limestone "
        "islands rising out of the sea.",
    ),
    (
        "02-machu-picchu",
        "Number two: Machu Picchu. An Inca citadel at two thousand four "
        "hundred and thirty metres, above the clouds.",
    ),
    (
        "01-jokulsarlon",
        "And number one: Yoh-kul-sar-lon, in Iceland. Icebergs drifting from "
        "the glacier, onto a black sand shore.",
    ),
    (
        "12-outro",
        "Ten places. One planet. So which one would you go to first?",
    ),
]


class ElevenError(RuntimeError):
    """An ElevenLabs HTTP failure, with the response body preserved."""

    def __init__(self, code: int, detail: str) -> None:
        self.code = code
        super().__init__(f"HTTP {code}: {detail}")


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
    try:
        with urllib.request.urlopen(request, timeout=240) as response:
            return response.read()
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", "replace").strip()
        raise ElevenError(error.code, detail[:400]) from error


async def edge_bytes(text: str) -> bytes:
    import edge_tts

    communicate = edge_tts.Communicate(text, EDGE_VOICE, rate=EDGE_RATE)
    chunks: list[bytes] = []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            chunks.append(chunk["data"])
    return b"".join(chunks)


# --- dependency-free MP3 duration -------------------------------------------
# ElevenLabs returns MPEG-1 Layer III. Walking the frame headers gives an
# exact sample count without ffmpeg or mutagen being installed.

_BITRATE_V1_L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
_BITRATE_V2_L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0]
_SAMPLE_RATE = {
    3: [44100, 48000, 32000, 0],  # MPEG 1
    2: [22050, 24000, 16000, 0],  # MPEG 2
    0: [11025, 12000, 8000, 0],  # MPEG 2.5
}


def mp3_seconds(path: pathlib.Path) -> float:
    data = path.read_bytes()
    offset = 0
    if data[:3] == b"ID3" and len(data) > 10:
        size = (
            (data[6] & 0x7F) << 21
            | (data[7] & 0x7F) << 14
            | (data[8] & 0x7F) << 7
            | (data[9] & 0x7F)
        )
        offset = 10 + size

    seconds = 0.0
    while offset + 4 <= len(data):
        if data[offset] != 0xFF or (data[offset + 1] & 0xE0) != 0xE0:
            offset += 1
            continue

        version = (data[offset + 1] >> 3) & 0x03
        layer = (data[offset + 1] >> 1) & 0x03
        if version == 1 or layer != 1:  # reserved version, or not Layer III
            offset += 1
            continue

        bitrate_index = (data[offset + 2] >> 4) & 0x0F
        rate_index = (data[offset + 2] >> 2) & 0x03
        padding = (data[offset + 2] >> 1) & 0x01

        table = _BITRATE_V1_L3 if version == 3 else _BITRATE_V2_L3
        bitrate = table[bitrate_index]
        sample_rate = _SAMPLE_RATE[version][rate_index]
        if bitrate == 0 or sample_rate == 0:
            offset += 1
            continue

        samples = 1152 if version == 3 else 576
        frame_length = int(samples / 8 * bitrate * 1000 / sample_rate) + padding
        if frame_length <= 4:
            offset += 1
            continue

        seconds += samples / sample_rate
        offset += frame_length

    return seconds


def frames_for(seconds: float) -> int:
    return max(MIN_FRAMES, math.ceil((seconds + BREATHING_ROOM) * FPS))


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    key = read_key()
    print(f"engine: {'ElevenLabs' if key else 'edge-tts'}")

    for name, text in SCENES:
        target = OUT_DIR / f"{name}.mp3"
        data: bytes | None = None

        if key:
            # Retry transient failures so a single narrator is kept, but bail
            # out immediately if the key genuinely lacks TTS permission.
            for attempt in range(5):
                try:
                    data = eleven_bytes(text, key)
                    break
                except ElevenError as error:
                    print(f"  ElevenLabs attempt {attempt + 1} failed for {name}: {error}")
                    body = str(error).lower()
                    if any(
                        marker in body
                        for marker in (
                            "missing_permissions",
                            "text_to_speech",
                            "quota_exceeded",
                        )
                    ):
                        print("  ElevenLabs key unusable — stopping retries")
                        break
                    time.sleep(2.5 * (attempt + 1))
                except Exception as error:  # noqa: BLE001
                    print(f"  ElevenLabs attempt {attempt + 1} failed for {name}: {error}")
                    time.sleep(2.5 * (attempt + 1))
            if data is None:
                print(f"  falling back to edge-tts for {name}")

        if data is None:
            data = await edge_bytes(text)

        target.write_bytes(data)
        print(f"wrote {target.relative_to(ROOT)} ({len(data) / 1024:.0f} KB)")

    manifest = {}
    for name, _ in SCENES:
        seconds = mp3_seconds(OUT_DIR / f"{name}.mp3")
        manifest[name] = {"seconds": round(seconds, 3), "frames": frames_for(seconds)}

    total = sum(entry["frames"] for entry in manifest.values())
    manifest["_totalFrames"] = total
    (OUT_DIR / "durations.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )

    print(f"\n{'scene':18s} {'seconds':>8s} {'frames':>7s}")
    for name, _ in SCENES:
        entry = manifest[name]
        print(f"{name:18s} {entry['seconds']:8.2f} {entry['frames']:7d}")
    print(f"{'TOTAL':18s} {sum(m['seconds'] for m in manifest.values() if isinstance(m, dict)):8.2f} {total:7d}")
    print(f"composition: {total / FPS:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
