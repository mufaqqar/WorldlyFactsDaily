import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { getAudioDuration } from "@remotion/media-utils";
import { CitiesBackground } from "./CitiesBackground";
import { CityHud } from "./CityHud";
import { CityIntro } from "./CityIntro";
import { CityOutro } from "./CityOutro";
import { CityProfile } from "./CityProfile";
import { CITIES } from "./data";

export type CitiesProps = {
  sceneFrames: number[];
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const INTRO_AUDIO = "voiceover/cities/01-intro.mp3";
const OUTRO_AUDIO = "voiceover/cities/12-outro.mp3";
const MUSIC = "audio/music-cities.wav";
const WHOOSH = "audio/sfx-whoosh.wav";
const IMPACT = "audio/sfx-impact.wav";
const SHIMMER = "audio/sfx-shimmer.wav";
const TICK = "audio/sfx-tick.wav";

const AUDIO_FILES = [INTRO_AUDIO, ...CITIES.map((c) => c.audio), OUTRO_AUDIO];

// Sized from the generated narration at 30 fps with 0.2 s of breathing room.
export const FALLBACK_FRAMES = [
  172, 144, 151, 120, 141, 140, 159, 162, 137, 199, 213, 89,
];

export const calculateMetadata: CalculateMetadataFunction<CitiesProps> = async () => {
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

const GlobalFade: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();

  const fade = Math.min(
    interpolate(frame, [0, 14], [1, 0], { extrapolateRight: "clamp" }),
    interpolate(frame, [total - 22, total], [0, 1], {
      extrapolateLeft: "clamp",
    }),
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#02040A", opacity: fade, pointerEvents: "none" }}
    />
  );
};

/**
 * The score is generated slightly longer than the narration and looped so it
 * always covers the last word. It sits well under the voice.
 */
const MusicBed: React.FC<{ total: number }> = ({ total }) => {
  return (
    <Audio
      src={staticFile(MUSIC)}
      loop
      volume={(f) => {
        const fadeIn = interpolate(f, [0, 30], [0, 0.32], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(f, [total - 70, total - 6], [0.32, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return Math.min(fadeIn, fadeOut);
      }}
    />
  );
};

export const MostExpensiveCities: React.FC<CitiesProps> = ({ sceneFrames }) => {
  const frames = sceneFrames.length === 12 ? sceneFrames : FALLBACK_FRAMES;
  const intro = frames[0];
  const outro = frames[11];
  const total = frames.reduce((sum, value) => sum + value, 0);

  // Slices for intro, the ten ranked cities (10 → 1), and the outro.
  const profiles = frames.slice(1, 11);

  const offsets = frames.reduce<number[]>((acc, value, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + frames[index - 1]);
    return acc;
  }, []);

  const outroOffset = offsets[11];
  const finaleOffset = offsets[10];

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080F" }}>
      <CitiesBackground />

      <Sequence durationInFrames={intro} name="01 · Intro">
        <Audio src={staticFile(INTRO_AUDIO)} />
        <CityIntro durationInFrames={intro} />
      </Sequence>

      {CITIES.map((city, index) => (
        <Sequence
          key={city.rank}
          from={offsets[index + 1]}
          durationInFrames={profiles[index]}
          name={`${String(index + 2).padStart(2, "0")} · #${city.rank} ${city.name}`}
        >
          <Audio src={staticFile(city.audio)} />
          <CityProfile
            city={city}
            durationInFrames={profiles[index]}
            variant={index}
            isFinale={city.rank === 1}
          />
        </Sequence>
      ))}

      <Sequence
        from={outroOffset}
        durationInFrames={outro}
        name="12 · Outro"
      >
        <Audio src={staticFile(OUTRO_AUDIO)} />
        <CityOutro durationInFrames={outro} />
      </Sequence>

      <MusicBed total={total} />

      {/* transition whooshes on every profile and the outro */}
      {offsets.slice(1).map((offset) => (
        <Sequence
          key={`whoosh-${offset}`}
          from={offset}
          durationInFrames={22}
          name={`SFX · whoosh ${offset}`}
        >
          <Audio src={staticFile(WHOOSH)} volume={0.28} />
        </Sequence>
      ))}

      {/* quiet ticks land with each rank card */}
      {offsets.slice(1, 11).map((offset) => (
        <Sequence
          key={`tick-${offset}`}
          from={offset + 5}
          durationInFrames={16}
          name={`SFX · tick ${offset}`}
        >
          <Audio src={staticFile(TICK)} volume={0.16} />
        </Sequence>
      ))}

      {/* opening hit and the number-one reveal */}
      <Sequence durationInFrames={30} name="SFX · opening impact">
        <Audio src={staticFile(IMPACT)} volume={0.42} />
      </Sequence>
      <Sequence
        from={finaleOffset}
        durationInFrames={60}
        name="SFX · finale impact"
      >
        <Audio src={staticFile(IMPACT)} volume={0.5} />
      </Sequence>
      <Sequence
        from={finaleOffset + 18}
        durationInFrames={130}
        name="SFX · finale shimmer"
      >
        <Audio src={staticFile(SHIMMER)} volume={0.24} />
      </Sequence>

      <CityHud sceneFrames={frames} />
      <GlobalFade total={total} />
    </AbsoluteFill>
  );
};
