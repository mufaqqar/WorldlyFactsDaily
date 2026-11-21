# START HERE — daily video factory

This is the canonical instruction file for this repository. **Read this file first
on every new task.** The user gives only a topic; all research, scripting, assets,
voiceover, composition, QA, rendering and reporting are done autonomously.

_Last updated: 2026-11-20_

---

## 1. Standing rules (apply every time)

| Rule | Detail |
| --- | --- |
| Input | User supplies **only a topic**. Never ask for the same instructions again. |
| Default format | **Mobile / vertical short video**: `1080 × 1920`, `30 fps`, ~60–150 s. |
| Long format | Only when the user explicitly says "long", "detailed", "documentary", or gives a duration. Default is still vertical unless they explicitly ask for landscape. |
| Voice | **ElevenLabs** first. Key lives in `.env`; any variable name containing `ELEVEN` is accepted (current name: `ELEVENLAB`). Read it, never print it. Voice `pNInz6obpgDQGcFmaJgB` (Adam), model `eleven_multilingual_v2`. |
| If ElevenLabs fails | `401 Invalid API key` etc. → fall back to Google Translate TTS (`translate.google.com/translate_tts?client=tw-ob`), then edge-tts. **Still finish the video**, then report the fallback clearly. |
| Facts | Use real, checkable data and cite the source + date in the video and in the data file. Never invent statistics. If a source is unavailable, say so in the README/job log. |
| User work | Preserve existing files and uncommitted edits (notably `package.json`, `src/Root.tsx`, `src/luxury-cars/`, `scripts/fetch_luxury_car_images.py`, `scripts/voiceover_luxury_cars.py`). Add, don't overwrite. |
| Design | Follow the installed `remotion-skills`: video-first layout, safe areas, `useCurrentFrame()`/`interpolate()`/`spring()` only (no CSS animations), `staticFile()` for all assets. |
| Preview | Start `npx remotion studio --no-open` **before** editing compositions; keep it running. QA with `remotion still` frames before the final render. |
| Output | Render to `out/<slug>.mp4` (plus a thumbnail still) and report the exact path. |

---

## 2. Workflow — follow these steps in order

1. **Read this file** and check `git status --short` for user changes.
2. **Interpret the topic** as a countdown/ranking video unless told otherwise.
3. **Research** the topic. Prefer primary sources (ICC, FIFA, official rankings,
   reputable encyclopedias). Record the source URL and "as of" date.
4. **Decide the list** (usually 10 entries, ranked #10 → #1) and write a one-line
   methodology that can be spoken in the intro.
5. **Assets**
   - Portraits/photos: adapt `scripts/fetch_cricket_portraits.py` (Wikipedia
     `pageimages` API). Strip tracking query params from upload URLs or they
     403; use a browser User-Agent; retry 429s with backoff.
   - Flags: `public/flags/<iso>.png` (flagcdn.com `w160` works here).
   - Missing photos: render a monogram/flag fallback — **never** substitute a
     photo of a different person.
6. **Voiceover** — adapt `scripts/voiceover_cricket_players.py`. One MP3 per
   scene: `01-intro`, `10-…` … `01-…`, `12-outro` under
   `public/voiceover/<slug>/`. Verify each with the bundled ffprobe:
   `node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe`.
7. **Build the composition** using the conventions in §3.
8. **Register** it in `src/Root.tsx` and add `build:<slug>` / `still:<slug>`
   scripts to `package.json`.
9. **QA** — render 3–4 still frames (intro, mid, finale, outro), read the PNGs,
   fix overlaps/typos/contrast, then check Studio is error-free.
10. **Render** the MP4 with `npx remotion render <CompositionId> out/<slug>.mp4`.
11. **Report** the output paths, voice engine actually used, data source, and any
    caveats. Update the job log in §6 of this file.

---

## 3. Code conventions

One folder per video: `src/<slug>/`

| File | Purpose |
| --- | --- |
| `data.ts` | Typed entry array (rank 10 → 1), `image`, `audio`, `accent`, source constants. |
| `theme.ts` | Re-export `displayFamily`/`interFamily` from `../fonts`; palette + gradients. |
| `MainVideo.tsx` | Exports `FPS`, `WIDTH`, `HEIGHT`, `FALLBACK_FRAMES`, `calculateMetadata`, main component. |
| `Background.tsx`, `Hud.tsx` | Persistent layers. |
| `IntroScene.tsx`, `<X>Profile.tsx`, `OutroScene.tsx` | One component per substantial scene. |
| small helpers | `AnimatedProgressBar`, `RatingCounter`, `RankingBadge`, etc. |

Timing pattern (copy from `src/luxury-cars/MainVideo.tsx`):

```tsx
const AUDIO_FILES = [INTRO_AUDIO, ...ITEMS.map((item) => item.audio), OUTRO_AUDIO];

export const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const durations = await Promise.all(
    AUDIO_FILES.map((file) => getAudioDuration(staticFile(file))),
  );
  const sceneFrames = durations.map((seconds) =>
    Math.max(60, Math.ceil((seconds + 0.2) * FPS)),
  );
  return {
    durationInFrames: sceneFrames.reduce((sum, frames) => sum + frames, 0),
    props: { sceneFrames },
  };
};
```

Use named `<Sequence>`s with cumulative offsets, one `<Audio>` per scene, a
looping music bed, SFX at scene changes, a HUD and a global fade. Render
`calculateMetadata` will size the composition to the narration automatically.

Reusable audio beds: `public/audio/music-*.wav`, and
`sfx-{whoosh,tick,impact,shimmer}.wav`.

---

## 4. Quick commands

```bash
npx remotion studio --no-open                      # preview (keep running)
python scripts/voiceover_<slug>.py                 # generate narration
python scripts/fetch_<slug>_portraits.py           # fetch images
npx remotion still <CompositionId> out/<slug>-thumb.png --frame=160
npx remotion render <CompositionId> out/<slug>.mp4
```

Bundled ffmpeg/ffprobe:
`node_modules/@remotion/compositor-win32-x64-msvc/{ffmpeg,ffprobe}.exe`

No standalone JS render scripts exist; npm `build:*` scripts wrap the CLI.

---

## 5. Composition register

| Composition id | Topic | Format | Notes |
| --- | --- | --- | --- |
| `TopLuxuryCars` | Famous luxury cars | 1080×1920 | user WIP — do not overwrite |
| `TopFootballPlayers` | Football players 2026 | 1080×1920 | audio-driven, 12 scenes |
| `BeautifulPlaces` | Beautiful places | 1080×1920 | audio-driven |
| `MostDangerousArmies` | Armies | 1080×1920 | audio-driven |
| `TopUniversities` | Universities | 1080×1920 / landscape variant | `format` prop |
| `MostPopulousCountries`, `MostExpensiveCities`, `RichestPeople`, `SteelProducers`, `RichestCountries` | older rankings | 1080×1920 | some hardcode duration |
| `MufaqarVertical`, `MufaqarIntro`, `ShowcaseIntro` | branding | mixed | silent |
| **`TopCricketPlayers`** | Cricket players 2026 | 1080×1920 | added 2026-11-20 |
| **`TopLuxuryBikes`** | Most expensive bikes in India 2026 | 1080×1920 | added 2026-11-20 |

---

## 6. Job log

### 2026-11-20 — Top 10 Cricket Players of 2026

- **Status:** ✅ **DONE (2026-11-20)** — rendered and QA'd.
  - Video: `out/top-cricket-players-2026.mp4` — 1080×1920, 30 fps, 127.4 s,
    39.6 MB, H.264 + AAC stereo.
  - Thumbnail: `out/top-cricket-players-2026-thumbnail.png` (frame 160).
  - Publishing copy: `out/top-cricket-players-2026-metadata.txt`.
  - QA: TypeScript clean; Studio clean; 6 still/OCR checks across intro,
    mid, finale and outro; final MP4 OCR re-checked at 4 frames.
- **Method:** ranked by each player's **highest current ICC rating** across
  Test / ODI / T20I; source: `ICC Men's Player Rankings` (Wikipedia mirror of
  ICC rankings, Test & ODI as of 10 Nov 2026, T20I as of 3 Nov 2026).
- **Assets:** 8 Wikipedia portraits; monogram fallback for Abhishek Sharma and
  Sahibzada Farhan (no free licensed photos available). Flags `in`, `pk`, `au`,
  `za`, `gb`, `af` present.
- **Voice:** ElevenLabs attempted first — `.env` key `ELEVENLAB` returned
  **401 Invalid API key**. Google TTS fallback used for all 12 clips. Ask the
  user to replace the key to get the ElevenLabs voice on future videos.
- **Files:** `scripts/fetch_cricket_portraits.py`,
  `scripts/voiceover_cricket_players.py`, `src/cricket-players/*`,
  `public/voiceover/cricket-players/*` (including `durations.json`, 3822 frames).
- **Render note:** the first full render hit a transient 404 for
  `audio/sfx-whoosh.wav` inside Remotion's temp public bundle at the first SFX
  frame. A short re-render of the same range succeeded; the full render was
  retried with `--concurrency=8`. If it recurs, verify the file in
  `public/audio/` and clear stale `remotion-webpack-bundle-*` temp folders.

### 2026-11-21 — Top 10 Most Expensive Luxury Bikes in India 2026

- **Status:** ✅ **DONE (2026-11-21)** — rendered and QA'd.
  - Video: `out/top-luxury-bikes-2026.mp4` — 1080×1920, 30 fps, 136.3 s,
    58.9 MB (56.2 MiB), H.264 + AAC stereo.
  - Thumbnail: `out/top-luxury-bikes-2026-thumbnail.png` (frame 160).
  - Publishing copy: `out/top-luxury-bikes-2026-metadata.txt`.
  - QA: TypeScript clean; Studio clean; still/OCR checks across intro, photo
    and monogram ranks, finale and outro; final MP4 OCR re-checked at 4
    frames. Audio stream and 1080×1920/30fps verified with bundled ffprobe.
- **Method:** ranked by **approximate ex-showroom price in India**; source:
  `Business APAC — The 10 Most Expensive Bikes in India [Updated 2026]`,
  accessed 20 Nov 2026. Where a price range is published, the upper end is
  used for the comparison bar.
- **Assets:** 4 Wikipedia photos (Panigale V4 R, Ninja H2R, M 1000 RR via the
  BMW S1000RR page image, Gold Wing Tour); labelled monogram/flag fallback
  cards for the 6 bikes without a free exact-model photo. Flags `us`, `jp`,
  `de`, `it` present.
- **Voice:** ElevenLabs attempted first — `.env` key containing `ELEVEN`
  returned **401 Invalid API key**. Google Translate TTS generated 10 clips;
  edge-tts generated #10 Indian Challenger Dark Horse and #8 BMW M 1000 XR
  after Google timeouts. Narration plays at `1.12×` to keep the runtime near
  136 s. Ask the user to replace the key to get the ElevenLabs voice on future
  videos.
- **Files:** `scripts/fetch_luxury_bike_images.py`,
  `scripts/voiceover_luxury_bikes.py`, `src/luxury-bikes/*`,
  `public/voiceover/luxury-bikes/*` (including `durations.json`, 4088 frames),
  `public/portraits/bikes/*`.
- **Render note:** the first render timed out under the foreground tool limit;
  the second was killed when the server restarted at ~2107/4088 frames. Removed
  expensive full-screen blur, backdrop-filter, mask-image and blend-mode
  effects, cleared stale Chrome/node processes, then rendered successfully with
  `npx remotion render TopLuxuryBikes out/top-luxury-bikes-2026.mp4 --concurrency=3`
  (default image format).

### 2026-11-21 — Top 10 Most Famous Luxury Cars in the World 2026

- **Status:** ✅ **DONE (2026-11-21)** — rendered and QA'd.
  - Video: `out/top-luxury-cars-2026.mp4` — 1080×1920, 30 fps, 100.075 s,
    50.6 MB (48.3 MiB), H.264 + AAC stereo.
  - Thumbnail (separate folder, as requested): `out/images/top-luxury-cars-2026-thumbnail.png`
    (frame 160). QA stills in `out/qa/cars-*.png`.
  - Publishing copy: `out/top-luxury-cars-2026-seo-meta.txt` (title, description,
    tags, keywords, chapters).
  - QA: TypeScript clean; Studio clean; 4 composition stills + 4 frames extracted
    from the final MP4, all OCR-checked with expected text verified. Decoding of
    all sample frames succeeded; ffprobe confirmed 1080×1920 / 30 fps / stereo.
- **Method:** curated editorial ranking by **fame, prestige and cultural impact**
  (not by price alone); 10 icons from the Bentley Continental GT (#10) to the
  Rolls-Royce Phantom (#1). Source: `Editorial luxury car ranking`, "2026 edition".
- **Assets:** 10 Wikipedia car photos in `public/cars/` (one per model, no
  fallbacks needed); flags `gb`, `de`, `it`, `fr` present.
- **Voice:** ElevenLabs attempted first via `scripts/voiceover_luxury_cars.py`;
  the `.env` key was rejected, so all 12 clips were generated with edge-tts
  (48 kbps MP3 confirmed with ffprobe). Ask the user to replace the key to get
  the ElevenLabs voice on future videos.
- **Files:** `scripts/fetch_luxury_car_images.py`,
  `scripts/voiceover_luxury_cars.py`, `src/luxury-cars/*`,
  `public/voiceover/luxury-cars/*`.
- **Render note:** rendered on the first attempt with
  `npx remotion render TopLuxuryCars out/top-luxury-cars-2026.mp4 --concurrency=8`.
  The bundled ffmpeg has no `null` muxer, so frame-extraction was used instead of
  `-f null -` for the decode check.
