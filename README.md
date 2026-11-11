# Remotion videos

Four motion graphics built with [Remotion](https://remotion.dev): two landscape 1920×1080 intros and two vertical 1080×1920 videos (one with voiceover).

| Composition | Output | What it is |
|---|---|---|
| `MufaqarVertical` | `out/mufaqar-vertical.mp4` | 24s vertical (9:16) personal intro — hero, track record, services, stack, contact |
| `RichestCountries` | `out/richest-countries-1960-2024.mp4` | 76s vertical (9:16) data story with voiceover — top 10 richest countries, 1960 vs 2024 |
| `MufaqarIntro` | `out/mufaqar-intro.mp4` | Personal brand intro — Mufaqar · WordPress Developer · mufaqar.com |
| `ShowcaseIntro` | `out/showcase-intro.mp4` | Generic Remotion showcase intro |

## MufaqarVertical (9:16)

**Output:** `out/mufaqar-vertical.mp4` — 1080×1920, H.264, 24s, 30fps, silent.
Poster: `out/mufaqar-vertical-poster.png` (frame 140).

| # | Frames | Scene |
|---|--------|-------|
| 01 | 0–168 | Monogram + "Mufaqar Islam" letter-by-letter, role line, Lahore, availability badge |
| 02 | 156–312 | Track record: count-up 15+ years · 880+ projects · 200+ clients |
| 03 | 300–468 | What I build: Custom WordPress, React & Next.js Apps, WooCommerce Stores |
| 04 | 456–582 | Tech stack marquee: WordPress / PHP / React / Next.js / Tailwind / Vercel |
| 05 | 570–720 | "Let's build something fast." + `mufaqar.com`, email, phone |

Designed with reel-safe framing: key content stays above the bottom third and
inside ~80px side margins.

### Editing the vertical

- **Name / role / location** — `src/vertical/HeroScene.tsx`
- **Stats** — the `STATS` array in `src/vertical/StatsScene.tsx`
- **Services** — the `SERVICES` array in `src/vertical/ServicesScene.tsx`
- **Stack pills** — `ROW_A` / `ROW_B` in `src/vertical/StackScene.tsx`
- **CTA + contact** — `src/vertical/OutroScene.tsx`
- **Scene timing** — `src/vertical/timeline.ts`

## RichestCountries (9:16, with voiceover)

**Output:** `out/richest-countries-1960-2024.mp4` — 1080×1920, 76s, 30fps, H.264 + AAC voiceover.
Poster: `out/richest-countries-poster.png` (frame 1330).

Top 10 richest countries by GDP per capita (current US$) in 1960 and 2024,
from World Bank indicator `NY.GDP.PCAP.CD`, ranked across sovereign states.

| # | Scene | Narration |
|---|-------|-----------|
| 01 | Title — TOP 10 · Richest Countries · 1960 → 2024 | intro + methodology |
| 02 | 1960 list — US #1 at $3,000, then NZ, Canada, Luxembourg, Sweden, Switzerland | "In 1960, the United States led the world…" |
| 03 | 2024 list — Monaco, Liechtenstein, Luxembourg, Ireland, Switzerland, Singapore, Norway, US (#8), Iceland, Qatar | "By 2024, the map had been rewritten…" |
| 04 | What changed — Ireland, Singapore, Norway & Qatar, 6 drop-outs | "So what changed?…" |
| 05 | Same planet. New ranking. | "Which country surprised you the most?" |

Scene lengths are **computed from the audio** in `calculateMetadata`
(`getAudioDuration`), so re-generating the voiceover re-times the whole video.

### Regenerating the voiceover

```bash
pip install edge-tts          # free Microsoft neural voices, no API key
python scripts/voiceover_countries.py
```

- Voice: `en-US-GuyNeural` at `+6%` — change `VOICE` / `RATE` in the script.
- Narration text: the `SCENES` list in `scripts/voiceover_countries.py`.
- Audio lands in `public/voiceover/countries/*.mp3`.
- To use ElevenLabs instead, swap the request in that script for
  `POST https://api.elevenlabs.io/v1/text-to-speech/{voiceId}` with
  `ELEVENLABS_API_KEY`; the Remotion side needs no changes.

### Editing the data

- **Country rows / values / rank moves** — `src/countries/data.ts`
- **Narration** — `scripts/voiceover_countries.py`
- **Scenes** — `src/countries/*.tsx` (`IntroScene`, `ListScene`, `ShiftsScene`, `OutroScene`)

## MufaqarIntro

**Output:** `out/mufaqar-intro.mp4` — H.264, ~3.9 MB, 12s, silent.

| # | Frames | Scene |
|---|--------|-------|
| 01 | 0–130 | "Mufaqar" springs in letter by letter, over an aurora + dot-matrix background with floating PHP snippets (`add_action`, `wp_enqueue_style`, `wc_get_products`). Role and `mufaqar.com` follow. |
| 02 | 112–234 | "Fast, custom WordPress" with three glass service cards: Custom Themes, WooCommerce, Speed & SEO. |
| 03 | 226–360 | "Let's build something fast." inside a rotating halo, ending on the `mufaqar.com` CTA pill. |

The corner HUD carries `mufaqar.com`, the role, and a render progress bar.

### Editing the content

- **Name / role / site** — `src/mufaqar/MufaqarIntroScene.tsx` (`NAME`, the role line, the site line).
- **Services** — the `SERVICES` array in `src/mufaqar/MufaqarServicesScene.tsx`.
- **Tagline + CTA** — `src/mufaqar/MufaqarOutroScene.tsx`.
- **Palette** — `src/mufaqar/theme.ts` (`wp.*`, `nameGradient`, `ctaGradient`).
- **Scene timing** — `src/timeline.ts` (shared by both compositions).

## ShowcaseIntro

Generic demo: wordmark reveal → "Everything is a component" feature cards → "Build videos like you build UIs."

## Commands

```bash
npm install              # install dependencies
npm run dev              # Remotion Studio — preview all compositions

npm run build            # render out/mufaqar-intro.mp4
npm run build:showcase   # render out/showcase-intro.mp4
npm run build:vertical   # render out/mufaqar-vertical.mp4 (9:16)
npm run build:countries  # render out/richest-countries-1960-2024.mp4 (9:16 + voice)

npm run still            # out/mufaqar-poster.png (frame 60)
npm run still:showcase   # out/poster.png (frame 60)
npm run still:vertical   # out/mufaqar-vertical-poster.png (frame 140)
npm run still:countries  # out/richest-countries-poster.png (frame 1330)
```

Render any single frame:

```bash
npx remotion still MufaqarIntro out/frame.png --frame=175
```

## Project layout

```
src/
  index.ts                  registerRoot entry point
  Root.tsx                  all <Composition> definitions
  timeline.ts               frame counts + scene offsets
  fonts.ts                  shared Google Fonts + palette
  ShowcaseIntro.tsx         demo composition
  components/               demo scenes (Background, Intro, Features, Outro, Hud)
  mufaqar/
    theme.ts                WordPress palette + JetBrains Mono for code chips
    MufaqarIntro.tsx        composes background, scenes, HUD
    MufaqarBackground.tsx   aurora, light beams, dot matrix, floating code chips
    MufaqarHud.tsx          site / role / progress bar
    MufaqarIntroScene.tsx   scene 01 — name reveal
    MufaqarServicesScene.tsx scene 02 — services
    MufaqarOutroScene.tsx   scene 03 — CTA
  vertical/                 vertical 9:16 reel (1080×1920)
    timeline.ts             vertical frame counts + scene offsets
    MufaqarVertical.tsx     composes background, 5 scenes, HUD, global fade
    VerticalBackground.tsx  mobile-tuned aurora, dots, code chips
    VerticalHud.tsx         progress rail, brand, scene counter
    HeroScene.tsx           scene 01 — name / role / location
    StatsScene.tsx          scene 02 — count-up track record
    ServicesScene.tsx       scene 03 — service cards
    StackScene.tsx          scene 04 — tech marquee
    OutroScene.tsx          scene 05 — CTA + contact
  countries/                vertical data story with voiceover
    data.ts                 World Bank values, ranks and rank moves
    theme.ts                gold / teal palette
    RichestCountries.tsx    audio-driven scene timing + composition
    CountryBackground.tsx   wireframe globe + gold aurora
    CountryHud.tsx          progress rail, year chip, source line
    IntroScene.tsx          scene 01 — title card
    ListScene.tsx           scenes 02/03 — animated top-10 lists
    ShiftsScene.tsx         scene 04 — biggest changes
    OutroScene.tsx          scene 05 — closing card
scripts/
  voiceover_countries.py    edge-tts narration generator
public/voiceover/countries/ scene-by-scene MP3 narration
```

## Skills

The `remotion-best-practices` skill is installed at project level in
`.agents/skills/remotion-best-practices` (tracked by `skills-lock.json`), so any
agent working here gets Remotion-specific guidance.

```bash
npx skills add remotion-dev/skills --skill remotion-best-practices --agent opencode --copy
npx skills update
```

## Notes

- All animation is driven by `useCurrentFrame()` / `spring()` / `interpolate()` —
  no CSS animations or transitions, per Remotion rendering rules.
- Both videos are silent. For music, drop a file in `public/` and add
  `<Audio src={staticFile("track.mp3")} />` to the composition.
- `TOTAL_FRAMES` in `src/timeline.ts` is 360 (12s at 30fps). If you change scene
  offsets, update the composition `durationInFrames` in `src/Root.tsx` to match.
#   W o r l d l y F a c t s D a i l y  
 