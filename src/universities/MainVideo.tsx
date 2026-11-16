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
import { UniversityBackground } from "./UniversityBackground";
import { UniversityHud } from "./UniversityHud";
import { UniversityHudWide } from "./UniversityHudWide";
import { UniversityIntro } from "./UniversityIntro";
import { UniversityIntroWide } from "./UniversityIntroWide";
import { UniversityOutro } from "./UniversityOutro";
import { UniversityOutroWide } from "./UniversityOutroWide";
import { UniversityProfile } from "./UniversityProfile";
import { UniversityProfileWide } from "./UniversityProfileWide";
import { UNIVERSITIES } from "./data";

export type UniversityFormat = "portrait" | "landscape";

export type UniversityProps = {
  sceneFrames: number[];
  format?: UniversityFormat;
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const WIDE_WIDTH = 1920;
export const WIDE_HEIGHT = 1080;

const INTRO_AUDIO = "voiceover/universities/01-intro.mp3";
const OUTRO_AUDIO = "voiceover/universities/12-outro.mp3";
const MUSIC = "audio/music-armies.wav";
const WHOOSH = "audio/sfx-whoosh.wav";
const IMPACT = "audio/sfx-impact.wav";
const SHIMMER = "audio/sfx-shimmer.wav";
const TICK = "audio/sfx-tick.wav";

const AUDIO_FILES = [
  INTRO_AUDIO,
  ...UNIVERSITIES.map((university) => university.audio),
  OUTRO_AUDIO,
];

// Studio fallback only: roughly the measured narration lengths at 30 fps with
// 0.2 s of air per scene. calculateMetadata replaces these.
export const FALLBACK_FRAMES = [
  840, 700, 740, 720, 760, 720, 720, 700, 700, 700, 740, 520,
];

export const calculateMetadata: CalculateMetadataFunction<UniversityProps> =
  async ({ props }) => {
    const durations = await Promise.all(
      AUDIO_FILES.map((file) => getAudioDuration(staticFile(file))),
    );

    const sceneFrames = durations.map((seconds) =>
      Math.max(60, Math.ceil((seconds + 0.2) * FPS)),
    );

    return {
      durationInFrames: sceneFrames.reduce((sum, frames) => sum + frames, 0),
      props: { ...props, sceneFrames },
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

/** The score runs under the narration and is looped to cover the last word. */
const MusicBed: React.FC<{ total: number }> = ({ total }) => {
  return (
    <Audio
      src={staticFile(MUSIC)}
      loop
      volume={(f) => {
        const fadeIn = interpolate(f, [0, 30], [0, 0.3], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(f, [total - 70, total - 6], [0.3, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return Math.min(fadeIn, fadeOut);
      }}
    />
  );
};

export const TopUniversities: React.FC<UniversityProps> = ({
  sceneFrames,
  format = "portrait",
}) => {
  const frames = sceneFrames.length === 12 ? sceneFrames : FALLBACK_FRAMES;
  const intro = frames[0];
  const outro = frames[11];
  const total = frames.reduce((sum, value) => sum + value, 0);

  // Slices for intro, the ten ranked universities (10 → 1), and the outro.
  const profiles = frames.slice(1, 11);

  const offsets = frames.reduce<number[]>((acc, value, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + frames[index - 1]);
    return acc;
  }, []);

  const outroOffset = offsets[11];
  const finaleOffset = offsets[10];
  const wide = format === "landscape";

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080F" }}>
      <UniversityBackground />

      <Sequence durationInFrames={intro} name="01 · Intro">
        <Audio src={staticFile(INTRO_AUDIO)} />
        {wide ? (
          <UniversityIntroWide durationInFrames={intro} />
        ) : (
          <UniversityIntro durationInFrames={intro} />
        )}
      </Sequence>

      {UNIVERSITIES.map((university, index) => (
        <Sequence
          key={university.rank}
          from={offsets[index + 1]}
          durationInFrames={profiles[index]}
          name={`${String(index + 2).padStart(2, "0")} · #${university.rank} ${university.name}`}
        >
          <Audio src={staticFile(university.audio)} />
          {wide ? (
            <UniversityProfileWide
              university={university}
              durationInFrames={profiles[index]}
              variant={index}
              isFinale={university.rank === 1}
            />
          ) : (
            <UniversityProfile
              university={university}
              durationInFrames={profiles[index]}
              variant={index}
              isFinale={university.rank === 1}
            />
          )}
        </Sequence>
      ))}

      <Sequence
        from={outroOffset}
        durationInFrames={outro}
        name="12 · Outro"
      >
        <Audio src={staticFile(OUTRO_AUDIO)} />
        {wide ? (
          <UniversityOutroWide durationInFrames={outro} />
        ) : (
          <UniversityOutro durationInFrames={outro} />
        )}
      </Sequence>

      <MusicBed total={total} />

      {/* transition whooshes on every chapter and the outro */}
      {offsets.slice(1).map((offset) => (
        <Sequence
          key={`whoosh-${offset}`}
          from={offset}
          durationInFrames={22}
          name={`SFX · whoosh ${offset}`}
        >
          <Audio src={staticFile(WHOOSH)} volume={0.26} />
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
          <Audio src={staticFile(TICK)} volume={0.15} />
        </Sequence>
      ))}

      {/* opening hit and the number-one reveal */}
      <Sequence durationInFrames={30} name="SFX · opening impact">
        <Audio src={staticFile(IMPACT)} volume={0.4} />
      </Sequence>
      <Sequence
        from={finaleOffset}
        durationInFrames={60}
        name="SFX · finale impact"
      >
        <Audio src={staticFile(IMPACT)} volume={0.48} />
      </Sequence>
      <Sequence
        from={finaleOffset + 18}
        durationInFrames={160}
        name="SFX · finale shimmer"
      >
        <Audio src={staticFile(SHIMMER)} volume={0.22} />
      </Sequence>

      {wide ? (
        <UniversityHudWide sceneFrames={frames} />
      ) : (
        <UniversityHud sceneFrames={frames} />
      )}
      <GlobalFade total={total} />
    </AbsoluteFill>
  );
};
