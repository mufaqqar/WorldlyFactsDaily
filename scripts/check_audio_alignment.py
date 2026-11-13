"""Verify every narration clip lands in its scene inside the rendered mix.

Scene lengths follow the same rule `calculateMetadata` uses: decoded MP3 length
plus 0.2 s of breathing room, rounded up to whole frames at 30 fps. The mix is
the rendered MP4's audio track. Correlation runs on amplitude envelopes at
500 Hz, which is robust to the music bed underneath the voice.

Run:  python scripts/check_audio_alignment.py [out/most-expensive-cities.mp4]
"""

import pathlib
import shutil
import subprocess
import sys
import wave

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 30
ENV_SR = 500
TMP = ROOT / "out" / "qa-audio"
FILES = [
    "01-intro", "10-honolulu", "09-bern", "08-lausanne", "07-st-gallen",
    "06-lugano", "05-geneva", "04-basel", "03-lucerne", "02-george-town",
    "01-zurich", "12-outro",
]


def ffmpeg() -> str:
    bundled = (
        ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc"
        / "ffmpeg.exe"
    )
    return str(bundled) if bundled.exists() else "ffmpeg"


def to_wav(source: pathlib.Path, target: pathlib.Path, mono: bool = True) -> None:
    codec = ["-ac", "1"] if mono else ["-ac", "1"]
    subprocess.run(
        [ffmpeg(), "-y", "-v", "error", "-i", str(source), *codec,
         "-ar", "22050", str(target)],
        check=True,
    )


def read_wav(path: pathlib.Path) -> tuple[np.ndarray, int]:
    w = wave.open(str(path))
    data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return data.astype(np.float64) / 32768, w.getframerate()


def envelope(a: np.ndarray, hop: int) -> np.ndarray:
    usable = (len(a) // hop) * hop
    env = np.abs(a[:usable]).reshape(-1, hop).mean(axis=1)
    return env - env.mean()


def main() -> None:
    video = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (
        ROOT / "out" / "most-expensive-cities.mp4"
    )
    if not video.exists():
        raise SystemExit(f"missing render: {video}")

    TMP.mkdir(parents=True, exist_ok=True)
    try:
        mix_wav = TMP / "mix.wav"
        to_wav(video, mix_wav)
        mix, mix_sr = read_wav(mix_wav)
        mix_env = envelope(mix, mix_sr // ENV_SR)

        frame = 0
        prev_end = -1.0
        failures = 0
        for name in FILES:
            clip_wav = TMP / f"{name}.wav"
            to_wav(ROOT / "public" / "voiceover" / "cities" / f"{name}.mp3", clip_wav)
            clip, sr = read_wav(clip_wav)
            clip_s = len(clip) / sr
            clip_env = envelope(clip, sr // ENV_SR)
            scene_frames = max(60, int(np.ceil((clip_s + 0.2) * FPS)))

            expected = frame / FPS
            lag_lo = max(0, int((expected - 1.5) * ENV_SR))
            lag_hi = min(
                len(mix_env) - len(clip_env),
                int((expected + 1.5) * ENV_SR),
            )
            win = np.lib.stride_tricks.sliding_window_view(
                mix_env[lag_lo : lag_hi + len(clip_env)], len(clip_env)
            )
            ncc = (win @ clip_env) / (
                np.linalg.norm(win, axis=1) * np.linalg.norm(clip_env) + 1e-12
            )
            best = lag_lo + int(np.argmax(ncc))
            found = best / ENV_SR

            gap = expected - prev_end
            ok = abs(found - expected) < 0.35 and gap > 0.05
            failures += 0 if ok else 1
            print(
                f"{name:15s} clip={clip_s:5.2f}s  starts={expected:6.2f}s  "
                f"found={found:6.2f}s  d={found - expected:+5.2f}s  "
                f"prev_end={prev_end:6.2f}s  gap={gap:+5.2f}s  "
                f"ncc={ncc.max():.2f}  {'OK' if ok else 'CHECK'}"
            )
            prev_end = expected + clip_s
            frame += scene_frames

        print(
            f"\nscene frames: {frame} = {frame / FPS:.2f}s, "
            f"last clip ends at {prev_end:.2f}s "
            f"({frame / FPS - prev_end:.2f}s of tail)"
        )
        print("alignment:", "PASS" if failures == 0 else f"{failures} scene(s) to inspect")
    finally:
        shutil.rmtree(TMP, ignore_errors=True)


if __name__ == "__main__":
    main()
