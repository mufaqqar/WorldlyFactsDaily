"""Generate the voiceover for the "Richest Countries 1960-2024" vertical.

Uses edge-tts (free Microsoft neural voices, no API key). Each scene gets its
own MP3 so `calculateMetadata` can size the composition to the narration.

Run:  python scripts/voiceover_countries.py
"""

import asyncio
import pathlib

import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+6%"

OUT_DIR = pathlib.Path(__file__).resolve().parent.parent / "public" / "voiceover" / "countries"

SCENES = [
    (
        "01-intro",
        "Which countries were the richest in nineteen sixty, and which ones rule "
        "the list today? This is the top ten, ranked by G D P per capita in current "
        "U S dollars, using World Bank data.",
    ),
    (
        "02-1960",
        "In nineteen sixty, the United States led the world at three thousand dollars "
        "per person. New Zealand, Canada, Luxembourg, Sweden and Switzerland followed. "
        "Much of Europe was still rebuilding after the war, and the Gulf was nowhere "
        "near the top.",
    ),
    (
        "03-2024",
        "By twenty twenty-four, the map had been rewritten. Monaco and Liechtenstein "
        "now sit on top, above two hundred thousand dollars per person. Luxembourg, "
        "Ireland and Switzerland follow. Singapore has jumped into the top ten, and "
        "the United States has fallen to eighth.",
    ),
    (
        "04-shifts",
        "So what changed? Ireland became a tech and pharma hub. Singapore turned into a "
        "global financial centre. Norway and Qatar rode energy exports into the top ten. "
        "And six of nineteen sixty's top ten, including New Zealand, Canada, Sweden and "
        "Australia, slipped out of it entirely.",
    ),
    (
        "05-outro",
        "Same planet. A completely different ranking. Data from the World Bank, twenty "
        "twenty-four. Which country surprised you the most?",
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
