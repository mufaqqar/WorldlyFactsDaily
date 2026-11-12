"""Synthesise original, royalty-free music and SFX for the billionaires video.

Everything here is generated from scratch with numpy — no samples, no licensing
concerns. The bed is a modern documentary cue in D minor: sub drone, warm pad,
eighth-note arpeggio, soft kick and hats, a riser into the number-one reveal and
a brighter final section.

Run:  python scripts/audio_billionaires.py
"""

import math
import pathlib
import wave

import numpy as np

SR = 44_100
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
BPM = 92
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = 62.0


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


def pad_chord(midis: list[float], seconds: float, bright: float = 1.0) -> np.ndarray:
    t = t_axis(seconds)
    out = np.zeros_like(t)
    for midi in midis:
        f = note_hz(midi)
        for detune, amp in [(-0.004, 0.5), (0.0, 1.0), (0.004, 0.5)]:
            phase = 2 * np.pi * f * (1 + detune) * t
            out += amp * (
                np.sin(phase)
                + 0.32 * bright * np.sin(2 * phase)
                + 0.13 * bright * np.sin(3 * phase)
                + 0.05 * bright * np.sin(4 * phase)
            )
    env = adsr(len(t), 1.6, 1.2, 0.62, 1.8)
    return (out / (len(midis) * 1.9)) * env


def pluck(midi: float, seconds: float = 1.1, bright: float = 1.0) -> np.ndarray:
    t = t_axis(seconds)
    f = note_hz(midi)
    env = np.exp(-t * 4.2)
    body = (
        np.sin(2 * np.pi * f * t)
        + 0.5 * bright * np.sin(2 * np.pi * f * 2 * t)
        + 0.22 * bright * np.sin(2 * np.pi * f * 3.01 * t)
        + 0.08 * np.sin(2 * np.pi * f * 4.02 * t)
    )
    attack = np.clip(t / 0.004, 0, 1)
    return body * env * attack * 0.5


def kick(seconds: float = 0.5) -> np.ndarray:
    t = t_axis(seconds)
    f = 52 + 70 * np.exp(-t * 28)
    env = np.exp(-t * 9)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env * 0.9


def hat(seconds: float = 0.09) -> np.ndarray:
    t = t_axis(seconds)
    rng = np.random.default_rng(7)
    noise = rng.standard_normal(len(t))
    # crude high-pass: difference of the noise
    noise = np.diff(noise, prepend=0.0)
    return noise * np.exp(-t * 55) * 0.18


def low_noise(seconds: float) -> np.ndarray:
    t = t_axis(seconds)
    rng = np.random.default_rng(11)
    noise = rng.standard_normal(len(t))
    smooth = np.convolve(noise, np.ones(24) / 24, mode="same")
    return smooth * adsr(len(t), 0.3, 0.5, 0.5, 0.8)


def build_music() -> np.ndarray:
    n = int(DURATION * SR)
    mix = np.zeros(n)

    # D minor — Bb — F — C, two bars each, repeating.
    progression = [
        ([38, 50, 53, 57], 38),  # Dm
        ([34, 46, 50, 53], 34),  # Bb
        ([41, 53, 57, 60], 41),  # F
        ([36, 48, 52, 55], 36),  # C
    ]
    arp_offsets = [12, 19, 24, 19, 15, 19, 12, 19]

    section_start = 49.4  # number-one reveal (fixed by the generated voiceover)
    bar_index = 0
    time = 0.0
    rng = np.random.default_rng(3)

    while time < DURATION - 0.2:
        chord, root = progression[bar_index % len(progression)]
        epic = time >= section_start
        # Pad, two bars long
        pad_seconds = BAR * 2
        mix_pad = pad_chord(chord, pad_seconds, bright=1.25 if epic else 0.8)
        if epic:
            mix_pad += pad_chord([m + 12 for m in chord], pad_seconds, bright=1.35) * 0.45
        place(mix, mix_pad, time, 0.26 if not epic else 0.34)

        # Sub drone on the root
        tsub = t_axis(BAR * 2)
        sub = np.sin(2 * np.pi * note_hz(root - 12) * tsub)
        sub *= adsr(len(sub), 0.4, 0.4, 0.85, 0.8)
        place(mix, sub, time, 0.22 if not epic else 0.3)

        # Arpeggio, eighth notes, sparse in the intro
        for step in range(8):
            at = time + step * (BEAT / 2)
            if at >= DURATION - 0.3:
                break
            if time < 5.4 and step % 2 == 1:
                continue
            midi = chord[1] + arp_offsets[step % len(arp_offsets)]
            if epic:
                midi += 12
            place(
                mix,
                pluck(midi, bright=1.3 if epic else 0.9),
                at,
                0.16 if not epic else 0.2,
            )

        # Kick on each beat, hats on the offbeats
        for beat in range(4):
            at = time + beat * BEAT
            if at >= DURATION - 0.3:
                break
            if time > 2.0:
                place(mix, kick(), at, 0.38 if not epic else 0.5)
            place(mix, hat(), at + BEAT / 2, 0.5 if not epic else 0.7)

        # Noise swell every 4 bars
        if bar_index % 4 == 3:
            place(mix, low_noise(BAR * 0.9), time + BAR * 0.2, 0.09)

        time += BAR * 2
        bar_index += 1

    # Riser into the number-one reveal
    riser_len = 3.0
    tr = t_axis(riser_len)
    rise = np.linspace(0, 1, len(tr))
    rng2 = np.random.default_rng(19)
    noise = rng2.standard_normal(len(tr))
    noise = np.convolve(noise, np.ones(6) / 6, mode="same")
    tone = np.sin(2 * np.pi * np.cumsum(180 + 900 * rise**2) / SR)
    riser = (noise * 0.8 + tone * 0.5) * (rise**2.4)
    riser *= np.clip((riser_len - tr) / 0.25, 0, 1)
    place(mix, riser, section_start - riser_len, 0.22)

    # Impact at the reveal and a soft one at the intro title
    def impact(seconds=1.8):
        ti = t_axis(seconds)
        f = 44 + 26 * np.exp(-ti * 5)
        boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-ti * 2.2)
        rng3 = np.random.default_rng(23)
        burst = rng3.standard_normal(len(ti)) * np.exp(-ti * 18) * 0.25
        shimmer = (
            np.sin(2 * np.pi * 880 * ti) + np.sin(2 * np.pi * 1320 * ti)
        ) * np.exp(-ti * 3.5) * 0.06
        return (boom + burst + shimmer) * 0.9

    place(mix, impact(), section_start, 0.55)
    place(mix, impact(), 1.1, 0.28)

    # Final shimmer when the outro begins
    outro_start = 55.7
    place(mix, impact(1.4), outro_start, 0.28)

    # Fade in / out
    t_all = np.arange(n) / SR
    fade_in = np.clip(t_all / 1.4, 0, 1)
    fade_out = np.clip((DURATION - 0.3 - t_all) / 2.6, 0, 1)
    mix *= fade_in * fade_out

    # Gentle stereo width: pad/arp go wide via tiny delays.
    delay = int(0.012 * SR)
    left = mix.copy()
    right = mix.copy()
    right[delay:] += mix[:-delay] * 0.22
    left[:-delay] += mix[delay:] * 0.12
    stereo = np.stack([left, right], axis=1)
    return stereo


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


def build_sfx():
    # Whoosh — filtered noise sweep, used on every profile entrance.
    seconds = 0.55
    t = t_axis(seconds)
    rng = np.random.default_rng(31)
    noise = rng.standard_normal(len(t))
    smooth = np.convolve(noise, np.ones(3) / 3, mode="same")
    env = np.sin(np.clip(t / seconds, 0, 1) * np.pi) ** 2
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1600 * (t / seconds) ** 2) / SR)
    whoosh = (smooth * 0.85 + sweep * 0.25) * env
    write_wav(OUT / "sfx-whoosh.wav", normalise(np.stack([whoosh, whoosh], 1), 0.7))

    # Tick — short high transient for counters.
    seconds = 0.07
    t = t_axis(seconds)
    tick = np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 90) * 0.6
    tick += np.sin(2 * np.pi * 1250 * t) * np.exp(-t * 55) * 0.4
    write_wav(OUT / "sfx-tick.wav", normalise(np.stack([tick, tick], 1), 0.35))

    # Impact — used for the title and the number-one reveal.
    seconds = 1.9
    t = t_axis(seconds)
    f = 42 + 30 * np.exp(-t * 4)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.1)
    rng = np.random.default_rng(37)
    burst = rng.standard_normal(len(t)) * np.exp(-t * 26) * 0.35
    ring = np.sin(2 * np.pi * 660 * t) * np.exp(-t * 3.2) * 0.08
    impact_sound = boom + burst + ring
    write_wav(OUT / "sfx-impact.wav", normalise(np.stack([impact_sound, impact_sound], 1), 0.9))

    # Shimmer — outro sparkle.
    seconds = 1.6
    t = t_axis(seconds)
    shimmer = np.zeros_like(t)
    for freq, amp in [(1046.5, 0.3), (1568, 0.22), (2093, 0.16), (2637, 0.1)]:
        shimmer += np.sin(2 * np.pi * freq * t) * amp
    shimmer *= np.exp(-t * 2.4) * np.clip(t / 0.05, 0, 1)
    write_wav(OUT / "sfx-shimmer.wav", normalise(np.stack([shimmer, shimmer], 1), 0.55))


def main():
    music = build_music()
    write_wav(OUT / "music-billionaires.wav", normalise(music, 0.82))
    print(f"wrote {OUT / 'music-billionaires.wav'} ({DURATION:.0f}s)")
    build_sfx()
    print(f"wrote SFX in {OUT}")


if __name__ == "__main__":
    main()
