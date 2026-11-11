"""Generate the voiceover for "The Largest Steel Producers" vertical.

Uses edge-tts (free Microsoft neural voices, no API key). Each scene gets its
own MP3 so `calculateMetadata` can size the composition to the narration.

Run:  python scripts/voiceover_steel.py
"""

import asyncio
import pathlib

import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+6%"

OUT_DIR = pathlib.Path(__file__).resolve().parent.parent / "public" / "voiceover" / "steel"

SCENES = [
    (
        "01-intro",
        "Nearly two billion tonnes of steel are poured every year. These are the "
        "world's largest steel producers, ranked by crude steel output in twenty "
        "twenty-four.",
    ),
    (
        "02-top10",
        "China alone produced just over one billion tonnes. India followed with one "
        "hundred and forty-nine million, then Japan, the United States and Russia. "
        "South Korea, Germany, Turkey, Brazil and Iran complete the top ten.",
    ),
    (
        "03-dominance",
        "That is fifty-three percent of all steel made on Earth. In fact, China "
        "produces more steel than the next nine countries combined, almost twice "
        "as much.",
    ),
    (
        "04-momentum",
        "But the momentum is shifting. Turkey grew almost ten percent in twenty "
        "twenty-four, India six, Brazil and Germany five. Meanwhile Russia, South "
        "Korea, Japan and China all slowed down.",
    ),
    (
        "05-outro",
        "Half the world's steel comes from one country. Data from the World Steel "
        "Association, twenty twenty-four. Which producer surprised you the most?",
    ),
]


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, text in SCENES:
        target = OUT_DIR / f"{name}.mp3"
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        await communicate.save(str(target))
        print(f"wrote {target.relative_to(OUT_DIR.parent.parent.parent)}")


if __name__ == "__main__":
    asyncio.run(main())
