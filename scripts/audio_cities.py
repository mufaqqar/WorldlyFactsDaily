"""Synthesise the original, royalty-free score for the cities video.

A different cue from the billionaires bed: E minor, 96 BPM, a warmer
documentary pulse — marimba-like plucks, a soft four-on-the-floor, airy
strings and a slow lift in the final third. Everything is generated from
scratch with numpy, so there are no licensing concerns at all.

Run:  python scripts/audio_cities.py
"""

import pathlib
import wave

import numpy as np

SR = 44_100
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = 68.0


def t_axis(seconds: float, sr: int = SR) -> np.ndarray:
    return np.arange(int(seconds * sr), dtype=np.float64) / sr


def adsr(
    n: int,
    attack: float,
    decay: float,
    sustain: float,
    release: float,
    sr: int = SR,
) -> np.ndarray:
    a = max(1, int(attack * sr))
    d = max(1, int(decay * sr))
    r = max(1, int(release * sr))
    s = max(1, n - a - d - r)
    env = np.concatenate(
        [
            np.linspace(0, 1, a, endpoint=False),
            np.linspace(1, sustain, d, endpoint=False),
            np.full(s, sustain),
            np.linspace(sustain, 0, r),
        ]
    )
    if len(env) < n:
        env = np.pad(env, (0, n - len(env)))
    return env[:n]


def note_hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def place(track: np.ndarray, sound: np.ndarray, start: float, gain: float = 1.0):
    start_i = int(start * SR)
    if start_i >= len(track):
        return
    end_i = min(len(track), start_i + len(sound))
    track[start_i:end_i] += sound[: end_i - start_i] * gain


def strings(midis: list[float], seconds: float, bright: float = 1.0) -> np.ndarray:
    """Slow, wide string pad built from detuned sine partials."""
    t = t_axis(seconds)
    out = np.zeros_like(t)
    for midi in midis:
        f = note_hz(midi)
        for detune, amp in [(-0.005, 0.45), (-0.0015, 0.9), (0.002, 0.55), (0.006, 0.3)]:
            phase = 2 * np.pi * f * (1 + detune) * t
            out += amp * (
                np.sin(phase)
                + 0.26 * bright * np.sin(2 * phase)
                + 0.1 * bright * np.sin(3 * phase)
            )
    env = adsr(len(t), 1.9, 1.4, 0.66, 2.2)
    return (out / (len(midis) * 2.2)) * env


def marimba(midi: float, seconds: float = 0.9, bright: float = 1.0) -> np.ndarray:
    """Soft mallet tone — rounded attack, quick decay, woody overtone."""
    t = t_axis(seconds)
    f = note_hz(midi)
    body = (
        np.sin(2 * np.pi * f * t)
        + 0.42 * bright * np.sin(2 * np.pi * f * 3.98 * t)
        + 0.16 * bright * np.sin(2 * np.pi * f * 9.1 * t)
    )
    env = np.exp(-t * 3.4) * np.clip(t / 0.008, 0, 1)
    return body * env * 0.42


def bell(midi: float, seconds: float = 2.4) -> np.ndarray:
    t = t_axis(seconds)
    f = note_hz(midi)
    tone = (
        np.sin(2 * np.pi * f * t)
        + 0.3 * np.sin(2 * np.pi * f * 2.01 * t)
        + 0.12 * np.sin(2 * np.pi * f * 3.02 * t)
    )
    return tone * np.exp(-t * 1.5) * np.clip(t / 0.01, 0, 1) * 0.22


def kick(seconds: float = 0.5) -> np.ndarray:
    t = t_axis(seconds)
    f = 48 + 74 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9.5) * 0.85


def hat(seconds: float = 0.08) -> np.ndarray:
    t = t_axis(seconds)
    rng = np.random.default_rng(71)
    noise = rng.standard_normal(len(t))
    noise = np.diff(noise, prepend=0.0)
    return noise * np.exp(-t * 62) * 0.15


def air(seconds: float) -> np.ndarray:
    t = t_axis(seconds)
    rng = np.random.default_rng(43)
    noise = rng.standard_normal(len(t))
    smooth = np.convolve(noise, np.ones(30) / 30, mode="same")
    return smooth * adsr(len(t), 0.6, 0.8, 0.5, 1.2)


def build_music() -> np.ndarray:
    n = int(DURATION * SR)
    mix = np.zeros(n)

    # E minor — Cmaj7 — G — D. Two bars each, twice through.
    progression = [
        ([40, 52, 55, 59], 40),  # Em
        ([36, 48, 52, 55], 36),  # Cmaj7
        ([43, 55, 59, 62], 43),  # G
        ([38, 50, 54, 57], 38),  # D
    ]
    arp = [12, 19, 24, 19, 15, 24, 19, 12]

    bar_index = 0
    time = 0.0
    while time < DURATION - 0.2:
        chord, root = progression[bar_index % len(progression)]
        # Lift the arrangement in the last third.
        epic = time >= DURATION * 0.62

        pad = strings(chord, BAR * 2, bright=1.15 if epic else 0.85)
        if epic:
            pad += strings([m + 12 for m in chord], BAR * 2, bright=1.2) * 0.4
        place(mix, pad, time, 0.24 if not epic else 0.31)

        # Low root drone, gently rising in the second half.
        tsub = t_axis(BAR * 2)
        sub = np.sin(2 * np.pi * note_hz(root - 12) * tsub)
        sub *= adsr(len(sub), 0.6, 0.5, 0.8, 1.0)
        place(mix, sub, time, 0.2 if not epic else 0.27)

        # Mallet pattern on eighths; sparse for the first four bars.
        for step in range(8):
            at = time + step * (BEAT / 2)
            if at >= DURATION - 0.3:
                break
            if time < 4.4 and step % 2 == 1:
                continue
            midi = chord[1] + arp[step % len(arp)]
            if epic:
                midi += 12
            place(mix, marimba(midi, bright=1.15 if epic else 0.9), at, 0.2)

        # A single high bell at the top of every second bar.
        if bar_index % 2 == 0 and time > 3.0:
            place(mix, bell(chord[2] + 24), time, 0.5)

        # Soft four-on-the-floor, hats on the offbeats.
        for beat in range(4):
            at = time + beat * BEAT
            if at >= DURATION - 0.3:
                break
            if time > 1.6:
                place(mix, kick(), at, 0.34 if not epic else 0.44)
            place(mix, hat(), at + BEAT / 2, 0.46 if not epic else 0.62)

        if bar_index % 4 == 3:
            place(mix, air(BAR * 0.9), time + BAR * 0.3, 0.08)

        time += BAR * 2
        bar_index += 1

    # Slow bloom into the final third.
    bloom_start = DURATION * 0.55
    bloom_len = 4.0
    tr = t_axis(bloom_len)
    rise = np.linspace(0, 1, len(tr))
    rng = np.random.default_rng(59)
    noise = rng.standard_normal(len(tr))
    noise = np.convolve(noise, np.ones(8) / 8, mode="same")
    tone = np.sin(2 * np.pi * np.cumsum(220 + 520 * rise**2) / SR)
    bloom = (noise * 0.7 + tone * 0.45) * rise**2.2
    bloom *= np.clip((bloom_len - tr) / 0.3, 0, 1)
    place(mix, bloom, bloom_start, 0.16)

    # Opening swell.
    place(mix, bell(64, 3.2), 0.15, 0.9)
    place(mix, bell(71, 3.2), 0.45, 0.5)

    # Fade in / out.
    t_all = np.arange(n) / SR
    fade_in = np.clip(t_all / 1.6, 0, 1)
    fade_out = np.clip((DURATION - 0.3 - t_all) / 3.0, 0, 1)
    mix *= fade_in * fade_out

    # Gentle stereo width.
    delay = int(0.013 * SR)
    left = mix.copy()
    right = mix.copy()
    right[delay:] += mix[:-delay] * 0.2
    left[:-delay] += mix[delay:] * 0.11
    return np.stack([left, right], axis=1)


def normalise(data: np.ndarray, peak: float = 0.89) -> np.ndarray:
    max_val = np.max(np.abs(data))
    if max_val == 0:
        return data
    return data / max_val * peak


def write_wav(path: pathlib.Path, data: np.ndarray):
    path.parent.mkdir(parents=True, exist_ok=True)
    if data.ndim == 1:
        data = np.stack([data, data], axis=1)
    pcm = np.clip(data, -1, 1)
    pcm = (pcm * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as fh:
        fh.setnchannels(2)
        fh.setsampwidth(2)
        fh.setframerate(SR)
        fh.writeframes(pcm.tobytes())


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    music = build_music()
    target = OUT / "music-cities.wav"
    write_wav(target, normalise(music, 0.82))
    print(f"wrote {target} ({DURATION:.0f}s)")

    # SFX are shared with the billionaires video, but regenerate if missing.
    needed = ["sfx-whoosh.wav", "sfx-tick.wav", "sfx-impact.wav", "sfx-shimmer.wav"]
    if not all((OUT / name).exists() for name in needed):
        print("shared SFX missing — regenerating via audio_billionaires.build_sfx()")
        import audio_billionaires

        audio_billionaires.OUT = OUT
        audio_billionaires.build_sfx()


if __name__ == "__main__":
    main()
