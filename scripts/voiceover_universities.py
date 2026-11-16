"""Generate the long-form voiceover for "The 10 Best Universities on Earth".

Primary engine: ElevenLabs (professional documentary narrator).
Fallback: edge-tts (free Microsoft neural voice, no API key).

Each scene gets its own MP3 so `calculateMetadata` can size the composition to
the narration. Run:  python scripts/voiceover_universities.py
"""

import asyncio
import json
import pathlib
import time
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "voiceover" / "universities"

# ElevenLabs — Adam, a deep, natural American documentary voice.
ELEVEN_MODEL = "eleven_multilingual_v2"
ELEVEN_VOICE = "pNInz6obpgDQGcFmaJgB"
VOICE_SETTINGS = {
    "stability": 0.4,
    "similarity_boost": 0.85,
    "style": 0.25,
    "use_speaker_boost": True,
    "speed": 1.08,
}

# Fallback voice.
EDGE_VOICE = "en-US-GuyNeural"
EDGE_RATE = "+6%"

# Order matters: intro, countdown 10 → 1, outro. Roughly 4 minutes of narration.
SCENES = [
    (
        "01-intro",
        "Ten universities. One ranking. The QS World University Rankings 2027 "
        "assessed more than fifteen hundred institutions on research, teaching, "
        "employability, and international outlook. These ten finished on top. "
        "Some are almost a thousand years old. One teaches fewer than "
        "twenty-five hundred students. Together, they enrol more than two "
        "hundred and twenty-eight thousand people. This is the countdown, from "
        "number ten to number one.",
    ),
    (
        "10-nus",
        "Number ten: the National University of Singapore. Thirty-seven "
        "thousand, eight hundred and sixty-five students, and the highest QS "
        "position in Asia. NUS began in 1905 as a medical school, and took its "
        "present name in 1980. The Kent Ridge campus now holds seventeen "
        "faculties and schools, from law and medicine to design and computing.",
    ),
    (
        "09-ucl",
        "Number nine: University College London, tied for eighth. Founded in "
        "1826, UCL opened to students of any religion when Oxford and Cambridge "
        "would not. It was also the first university in England to admit women "
        "on equal terms, in 1878. With forty-eight thousand students, nearly "
        "thirty thousand from outside the UK, it has the largest international "
        "student body here.",
    ),
    (
        "08-eth-zurich",
        "Number eight: ETH Zurich, also tied for eighth. Continental Europe's "
        "highest-ranked university began in 1855 as the Swiss Federal "
        "Polytechnic. Albert Einstein studied physics here, graduated in 1900, "
        "and returned as a professor in 1912. Roughly forty-four percent of its "
        "twenty-three thousand students come from outside Switzerland.",
    ),
    (
        "07-caltech",
        "Number seven: Caltech. Two thousand, four hundred and thirty students. "
        "That is not a misprint. From a student body smaller than most high "
        "schools, Caltech has produced forty-six Nobel laureates. It manages "
        "NASA's Jet Propulsion Laboratory, the lab that builds and flies the "
        "Mars rovers. And its nine hundred and fourteen faculty teach fewer "
        "than three students each.",
    ),
    (
        "06-cambridge",
        "Number six: the University of Cambridge. Teaching has continued here "
        "since 1209, when scholars left Oxford after a dispute with the "
        "townspeople. It is a federation of thirty-one colleges, each with its "
        "own halls and traditions. Newton wrote the Principia here. Darwin "
        "studied here. Turing studied here. Eight centuries of breakthroughs in "
        "one small English town.",
    ),
    (
        "05-harvard",
        "Number five: Harvard. Founded in 1636, sixteen years after the "
        "Mayflower, it is the oldest university in the United States. It also "
        "holds the largest university endowment on Earth, worth more than fifty "
        "billion dollars. Its library is the biggest academic library in the "
        "world, with over twenty million volumes. And eight American presidents "
        "studied here.",
    ),
    (
        "04-oxford",
        "Number four: the University of Oxford. Teaching is recorded here as "
        "early as 1096 — nine centuries of continuous instruction, and the "
        "oldest university in the English-speaking world. Its tutorial system "
        "still pairs one or two students with a specialist every week. The "
        "Bodleian Library holds more than thirteen million printed items.",
    ),
    (
        "03-stanford",
        "Number three: Stanford, tied for second in the world. Leland and Jane "
        "Stanford founded it in 1885, in memory of their son, who died at "
        "fifteen. Its eighty-one-hundred-acre campus is one of the largest in "
        "America. And its alumni and staff founded Google, Hewlett-Packard, "
        "Netflix, and dozens of the companies that built Silicon Valley.",
    ),
    (
        "02-imperial",
        "Number two: Imperial College London, also tied for second. It was "
        "formed in 1907 by merging the Royal College of Science, the Royal "
        "School of Mines, and City and Guilds College. Its South Kensington "
        "campus sits beside the Natural History Museum. And more than half its "
        "twenty thousand students come from outside the UK.",
    ),
    (
        "01-mit",
        "And number one: the Massachusetts Institute of Technology. Eleven "
        "thousand, six hundred and ninety-four students. Three thousand, one "
        "hundred and twelve faculty. MIT has held the top spot in the QS "
        "ranking every year since 2012. Its alumni have launched more than "
        "thirty thousand companies, generating an estimated one point nine "
        "trillion dollars a year. Its motto: Mens et Manus. Mind and hand.",
    ),
    (
        "12-outro",
        "Ten universities. Two hundred and twenty-eight thousand students. Four "
        "countries. Oxford, Cambridge, Imperial, and UCL for Britain. Harvard, "
        "Stanford, Caltech, and MIT for America. ETH Zurich for Switzerland, and "
        "NUS for Singapore. That is the table for 2027. Follow for more "
        "rankings.",
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
    with urllib.request.urlopen(request, timeout=240) as response:
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
            # The API occasionally returns a spurious 401; retry before
            # dropping to the fallback voice so the series keeps one narrator.
            for attempt in range(5):
                try:
                    data = eleven_bytes(text, key)
                    break
                except Exception as error:  # noqa: BLE001
                    print(f"  ElevenLabs attempt {attempt + 1} failed for {name}: {error}")
                    time.sleep(2.5 * (attempt + 1))
            if data is None:
                print(f"  falling back to edge-tts for {name}")
        if data is None:
            data = await edge_bytes(text)
        target.write_bytes(data)
        print(f"wrote {target.relative_to(ROOT)} ({len(data) / 1024:.0f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
