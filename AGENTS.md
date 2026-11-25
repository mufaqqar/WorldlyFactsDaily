# START HERE — daily video factory

This is the canonical instruction file for this repository. **Read this file first
on every new task.** The user gives only a topic; all research, scripting, assets,
voiceover, composition, QA, rendering and reporting are done autonomously.

_Last updated: 2026-11-23_

---

## 1. Standing rules (apply every time)

| Rule | Detail |
| --- | --- |
| Input | User supplies **only a topic**. Never ask for the same instructions again. |
| Queue | `todo.md` at the repo root is the single source of truth. Read it **first** on every task; never build a topic marked `DONE`, and confirm any `REVIEW` topic before starting. |
| Go-ahead | **Do not start a new video until the user explicitly says "go ahead".** Inspecting and arranging the queue is fine; building is not. |
| Default format | **Mobile / vertical short video**: `1080 × 1920`, `30 fps`, ~60–150 s. |
| Long format | Only when the user explicitly says "long", "detailed", "documentary", or gives a duration. Default is still vertical unless they explicitly ask for landscape. |
| Voice | **ElevenLabs** first. Key lives in `.env`; any variable name containing `ELEVEN` is accepted (current name: `ELEVENLAB`). Read it, never print it. Voice `pNInz6obpgDQGcFmaJgB` (Adam), model `eleven_multilingual_v2`. |
| If ElevenLabs fails | `401 Invalid API key` etc. → fall back to Google Translate TTS (`translate.google.com/translate_tts?client=tw-ob`), then edge-tts. **Still finish the video**, then report the fallback clearly. |
| Facts | Use real, checkable data and cite the source + date in the video and in the data file. Never invent statistics. If a source is unavailable, say so in the final report. |
| User work | Preserve existing files and uncommitted edits (notably `package.json`, `src/Root.tsx`, `src/luxury-cars/`, `scripts/fetch_luxury_car_images.py`, `scripts/voiceover_luxury_cars.py`). Add, don't overwrite. |
| Design | Follow the installed `remotion-skills`: video-first layout, safe areas, `useCurrentFrame()`/`interpolate()`/`spring()` only (no CSS animations), `staticFile()` for all assets. |
| Preview | Start `npx remotion studio --no-open` **before** editing compositions; keep it running. QA with `remotion still` frames before the final render. |
| Assets | Reuse existing shared assets (`public/audio/*`, `public/flags/*`, fonts) from older videos. Only add topic-specific assets; never regenerate shared ones. |
| Output | `out/` gets **only** the final video `out/<slug>.mp4` and the SEO copy `out/<slug>-metadata.txt`. **No thumbnails and no QA PNGs in `out/`** — write QA stills to an OS temp folder outside the repo. Report both exact paths. |

---

## 2. Workflow — follow these steps in order

1. **Read this file and `todo.md`** (first), and check `git status --short` for
   user changes. Wait for the user's go-ahead before building anything.
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
8. **Register** it in `src/Root.tsx` and add a `build:<slug>` script to
   `package.json` (no `still:*` script — QA stills are temporary).
9. **QA** — render 3–4 still frames (intro, mid, finale, outro) into an OS temp
   folder outside the repo, read the PNGs, fix overlaps/typos/contrast, then
   check Studio is error-free. Never write QA stills into `out/`.
10. **Render** the MP4 with `npx remotion render <CompositionId> out/<slug>.mp4`
    and write the SEO copy to `out/<slug>-metadata.txt`.
11. **Report** the two output paths, voice engine actually used, data source,
    and any caveats. If the topic came from `todo.md`, mark that entry `DONE`
    with the output path when delivered.

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
npx remotion still <CompositionId> <os-temp-dir>/qa-<slug>-160.png --frame=160  # QA only, outside out/
npx remotion render <CompositionId> out/<slug>.mp4
```

Bundled ffmpeg/ffprobe:
`node_modules/@remotion/compositor-win32-x64-msvc/{ffmpeg,ffprobe}.exe`

No standalone JS render scripts exist; npm `build:*` scripts wrap the CLI.

---

## 5. Video queue — `todo.md`

`todo.md` at the repo root is the authoritative list of requested topics,
grouped by theme with a `PENDING` / `REVIEW` / `DONE` status for each item.
Read it before every task, skip `DONE` items, confirm `REVIEW` items, and work
only on the next `PENDING` topic after the user says "go ahead". On delivery,
flip that item to `DONE` with its output path. No other status log is kept.
