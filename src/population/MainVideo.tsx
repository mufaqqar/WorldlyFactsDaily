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
import { PopulationBackground } from "./PopulationBackground";
import { PopulationHud } from "./PopulationHud";
import { PopulationIntro } from "./PopulationIntro";
import { PopulationOutro } from "./PopulationOutro";
import { CountryProfile } from "./CountryProfile";
import { COUNTRIES } from "./data";

export type PopulationProps = {
  sceneFrames: number[];
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const INTRO_AUDIO = "voiceover/population/01-intro.mp3";
const OUTRO_AUDIO = "voiceover/population/12-outro.mp3";
const MUSIC = "audio/music-population.wav";
const WHOOSH = "audio/sfx-whoosh.wav";
const IMPACT = "audio/sfx-impact.wav";
const SHIMMER = "audio/sfx-shimmer.wav";
const TICK = "audio/sfx-tick.wav";

const AUDIO_FILES = [INTRO_AUDIO, ...COUNTRIES.map((c) => c.audio), OUTRO_AUDIO];

// Mirrors the measured narration durations at 30 fps with 0.2 s of breathing
// room; only used for the Studio default before calculateMetadata runs.
export const FALLBACK_FRAMES = [
  200, 220, 218, 162, 214, 195, 179, 193, 204, 195, 206, 157,
];

export const calculateMetadata: CalculateMetadataFunction<PopulationProps> =
  async () => {
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

export const MostPopulousCountries: React.FC<PopulationProps> = ({
  sceneFrames,
}) => {
  const frames = sceneFrames.length === 12 ? sceneFrames : FALLBACK_FRAMES;
  const intro = frames[0];
  const outro = frames[11];
  const total = frames.reduce((sum, value) => sum + value, 0);

  // Slices for intro, the ten ranked countries (10 → 1), and the outro.
  const profiles = frames.slice(1, 11);

  const offsets = frames.reduce<number[]>((acc, value, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + frames[index - 1]);
    return acc;
  }, []);

  const outroOffset = offsets[11];
  const finaleOffset = offsets[10];

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080F" }}>
      <PopulationBackground />

      <Sequence durationInFrames={intro} name="01 · Intro">
        <Audio src={staticFile(INTRO_AUDIO)} />
        <PopulationIntro durationInFrames={intro} />
      </Sequence>

      {COUNTRIES.map((country, index) => (
        <Sequence
          key={country.rank}
          from={offsets[index + 1]}
          durationInFrames={profiles[index]}
          name={`${String(index + 2).padStart(2, "0")} · #${country.rank} ${country.name}`}
        >
          <Audio src={staticFile(country.audio)} />
          <CountryProfile
            country={country}
            durationInFrames={profiles[index]}
            variant={index}
            isFinale={country.rank === 1}
          />
        </Sequence>
      ))}

      <Sequence
        from={outroOffset}
        durationInFrames={outro}
        name="12 · Outro"
      >
        <Audio src={staticFile(OUTRO_AUDIO)} />
        <PopulationOutro durationInFrames={outro} />
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

      <PopulationHud sceneFrames={frames} />
      <GlobalFade total={total} />
    </AbsoluteFill>
  );
};
