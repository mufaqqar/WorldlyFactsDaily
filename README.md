# Remotion videos

Six motion graphics built with [Remotion](https://remotion.dev): two landscape
1920×1080 intros and four vertical 1080×1920 videos, three of them data stories
with voiceover.

| Composition | Output | What it is |
|---|---|---|
| `RichestPeople` | `out/richest-people.mp4` | 58s vertical (9:16) data story with voiceover + original score — the world's 10 richest people, Forbes 2026 |
| `SteelProducers` | `out/steel-producers.mp4` | 58s vertical (9:16) data story with voiceover — the largest steel producers in the world, 2024 |
| `RichestCountries` | `out/richest-countries-1960-2024.mp4` | 76s vertical (9:16) data story with voiceover — top 10 richest countries, 1960 vs 2024 |
| `MufaqarVertical` | `out/mufaqar-vertical.mp4` | 24s vertical (9:16) personal intro — hero, track record, services, stack, contact |
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

## SteelProducers (9:16, with voiceover)

**Output:** `out/steel-producers.mp4` — 1080×1920, 58s, 30fps, H.264 + AAC voiceover.
Poster: `out/steel-producers-poster.png` (frame 950).

Top 10 crude steel producers in 2024, from World Steel Association (worldsteel)
figures in million tonnes.

| Rank | Country | Mt | % of world | YoY |
|---|---|---|---|---|
| 1 | China | 1,005.1 | 53.3% | −2.3% |
| 2 | India | 149.4 | 7.9% | +6.1% |
| 3 | Japan | 84.0 | 4.5% | −3.4% |
| 4 | United States | 79.5 | 4.2% | −2.3% |
| 5 | Russia | 71.0 | 3.8% | −6.6% |
| 6 | South Korea | 63.6 | 3.4% | −4.7% |
| 7 | Germany | 37.3 | 2.0% | +5.4% |
| 8 | Türkiye | 36.9 | 2.0% | +9.5% |
| 9 | Brazil | 33.9 | 1.8% | +5.9% |
| 10 | Iran | 31.4 | 1.7% | +2.3% |

World total: **1,886.3 Mt** in 2024, down 0.9% from 1,904.1 Mt in 2023.

| # | Scene | Narration |
|---|-------|-----------|
| 01 | Title — STEEL · The largest producers · 1,886.3 Mt · 2024 | "Nearly two billion tonnes of steel are poured every year…" |
| 02 | Animated top-10 bar chart with country codes, Mt and % of world | "China alone produced just over one billion tonnes…" |
| 03 | The outlier — 53.3% of world output, China vs the next nine (1.7×) | "That is fifty-three percent of all steel made on Earth…" |
| 04 | Momentum — 2023 → 2024 change, Türkiye +9.5% to Russia −6.6% | "But the momentum is shifting…" |
| 05 | One country. Half the steel. + source credit | "Which producer surprised you the most?" |

Scene lengths are **computed from the audio** in `calculateMetadata`
(`getAudioDuration`), so re-generating the voiceover re-times the whole video.

### Regenerating the voiceover

```bash
python scripts/voiceover_steel.py
```

- Voice: `en-US-GuyNeural` at `+6%` — change `VOICE` / `RATE` in the script.
- Narration text: the `SCENES` list in `scripts/voiceover_steel.py`.
- Audio lands in `public/voiceover/steel/*.mp3`.

### Editing the data

- **Producers / values / YoY / shares** — `src/steel/data.ts`
- **Narration** — `scripts/voiceover_steel.py`
- **Scenes** — `src/steel/*.tsx` (`IntroScene`, `TopProducersScene`, `DominanceScene`, `MomentumScene`, `OutroScene`)
- **Palette** — `src/steel/theme.ts` (gunmetal, molten orange, steel)

## RichestPeople (9:16, with voiceover + original score)

**Output:** `out/richest-people.mp4` — 1080×1920, 58.18s, 30fps, H.264 + AAC
voiceover and music.
Thumbnail: `out/richest-people-thumbnail.png` (frame 1630).
Publish copy: `out/richest-people-metadata.md`.

The top 10 from **Forbes World's Billionaires 2026** — the 40th annual list,
published **March 10, 2026**. Net worths are USD billions and are a snapshot at
publication; they are not live values.

| Rank | Person | Net worth | Company | Country |
|---|---|---|---|---|
| 1 | Elon Musk | $839B | Tesla · SpaceX | United States |
| 2 | Larry Page | $257B | Google · Alphabet | United States |
| 3 | Sergey Brin | $237B | Google · Alphabet | United States |
| 4 | Jeff Bezos | $224B | Amazon | United States |
| 5 | Mark Zuckerberg | $222B | Meta Platforms | United States |
| 6 | Larry Ellison | $190B | Oracle | United States |
| 7 | Bernard Arnault & family | $171B | LVMH | France |
| 8 | Jensen Huang | $154B | Nvidia | Taiwan · U.S. |
| 9 | Warren Buffett | $149B | Berkshire Hathaway | United States |
| 10 | Amancio Ortega | $148B | Inditex · Zara | Spain |

The wealth rail on every profile compares that fortune with Musk's $839B, so the
scale of the #1 position is visible at a glance (Ortega is 18%, Musk is 100%).

| # | Scene | Content |
|---|-------|---------|
| 01 | Intro | Count-up to 10, title, countdown pill, Forbes date |
| 02–11 | Ranks 10 → 1 | Portrait, flag, animated rank numeral, gold net-worth counter, company, descriptor, wealth rail |
| 12 | Outro | Crown question, follow CTA, 2026 champion recap, source |

Scene lengths are **computed from the audio** in `calculateMetadata`
(`getAudioDuration`) plus 0.2s of breathing room per scene. The final narration
is 56.0s and the composition is 1,745 frames.

### Regenerating the voiceover

```bash
python scripts/voiceover_billionaires.py
```

- Primary engine: ElevenLabs **Adam** (`pNInz6obpgDQGcFmaJgB`), model
  `eleven_multilingual_v2`, speed 1.18, stability 0.42, similarity 0.82,
  style 0.28, speaker boost on.
- The script reads any key containing `ELEVEN` from `.env`.
- If ElevenLabs is unavailable it falls back to edge-tts `en-US-GuyNeural` at
  `+8%`; the video is never silent.
- Narration text: the `SCENES` list in `scripts/voiceover_billionaires.py`.
- Audio lands in `public/voiceover/billionaires/*.mp3`.

### Regenerating the music + SFX

```bash
python scripts/audio_billionaires.py
```

Everything is synthesised from scratch with numpy — no samples and no licensing
obligations. Outputs in `public/audio/`:

- `music-billionaires.wav` — 62s D-minor documentary cue (drone, pad, arpeggio,
  soft kick/hats, riser into the #1 reveal)
- `sfx-whoosh.wav`, `sfx-tick.wav`, `sfx-impact.wav`, `sfx-shimmer.wav`

The music is looped and sits at roughly 0.34 volume under the narration; the
whoosh is 0.30, impacts 0.42–0.50, and the shimmer 0.24.

### Editing the data and visuals

- **People, net worths, companies, flags, portraits** — `src/billionaires/data.ts`
- **Narration** — `scripts/voiceover_billionaires.py`
- **Composition, scenes, audio mix** — `src/billionaires/MainVideo.tsx`
- **Palette / gradients** — `src/billionaires/theme.ts`
- **Reusable components** — `WealthCounter`, `AnimatedProgressBar`,
  `RankingBadge`, `PortraitCard`, `BillionaireProfile`, `BillionairesBackground`,
  `BillionairesHud`, `IntroScene`, `OutroScene`

### Asset credits

- Portraits: Wikimedia Commons contributors; per-file URLs and dimensions are
  listed in `portrait-sources.json`. Licenses vary by file; check the original
  file page before commercial reuse. `10-amancio-ortega.webp` is the only freely
  available portrait (Malen Perez, CC BY-SA 4.0) and is intentionally treated
  with grain and a heavier grade.
- Flags: [flagcdn.com](https://flagcdn.com) PNGs.
- Music and SFX: original synthesis by `scripts/audio_billionaires.py`.

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
npm run build:steel      # render out/steel-producers.mp4 (9:16 + voice)
npm run build:billionaires # render out/richest-people.mp4 (9:16 + voice + score)

npm run still            # out/mufaqar-poster.png (frame 60)
npm run still:showcase   # out/poster.png (frame 60)
npm run still:vertical   # out/mufaqar-vertical-poster.png (frame 140)
npm run still:countries  # out/richest-countries-poster.png (frame 1330)
npm run still:steel      # out/steel-producers-poster.png (frame 950)
npm run still:billionaires # out/richest-people-thumbnail.png (frame 1630)
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
  steel/                    vertical steel data story with voiceover
    data.ts                 worldsteel 2024 values, shares, YoY moves
    theme.ts                gunmetal / molten orange / steel palette
    SteelProducers.tsx      audio-driven scene timing + composition
    SteelBackground.tsx     furnace glow, roller lines, sparks, I-beams
    SteelHud.tsx            progress rail, label chip, source line
    IntroScene.tsx          scene 01 — title card
    TopProducersScene.tsx   scene 02 — animated top-10 bar chart
    DominanceScene.tsx      scene 03 — 53.3% world share + comparison
    MomentumScene.tsx       scene 04 — diverging YoY change bars
    OutroScene.tsx          scene 05 — closing card
  billionaires/             vertical Forbes 2026 data story + score
    data.ts                 top 10 people, net worths, portraits, flags, audio
    theme.ts                navy / gold / electric-blue palette
    MainVideo.tsx           audio-driven scenes, music bed, SFX, global fade
    BillionairesBackground.tsx aurora, grid, ticker, market line, gold dust
    BillionairesHud.tsx     progress bar, countdown rail, source line
    IntroScene.tsx          scene 01 — 1 → 10 count and title
    BillionaireProfile.tsx  scenes 02–11 — portrait, name, counter, wealth rail
    PortraitCard.tsx        framed portrait, flag chips, grain, light sweep
    WealthCounter.tsx       gold count-up net worth
    AnimatedProgressBar.tsx wealth vs. world #1
    RankingBadge.tsx        oversized rank numeral + 10-step rail
    OutroScene.tsx          scene 12 — crown question + follow CTA
scripts/
  voiceover_countries.py    edge-tts narration generator (countries)
  voiceover_steel.py        edge-tts narration generator (steel)
  voiceover_billionaires.py ElevenLabs/edge-tts narration generator (billionaires)
  audio_billionaires.py     original numpy music + SFX synthesis
public/voiceover/countries/ scene-by-scene MP3 narration
public/voiceover/steel/     scene-by-scene MP3 narration
public/voiceover/billionaires/ scene-by-scene MP3 narration
public/audio/               original music and SFX for the billionaire video
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
- `MufaqarIntro`, `ShowcaseIntro` and `MufaqarVertical` are silent. The data
  stories carry a voiceover; `RichestPeople` also has an original, royalty-free
  music bed and SFX synthesised by `scripts/audio_billionaires.py`.
- `TOTAL_FRAMES` in `src/timeline.ts` is 360 (12s at 30fps). If you change scene
  offsets, update the composition `durationInFrames` in `src/Root.tsx` to match.
