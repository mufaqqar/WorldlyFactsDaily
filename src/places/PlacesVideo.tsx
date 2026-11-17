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
import { PLACES } from "./data";
import { PlaceBackground } from "./PlaceBackground";
import { PlaceIntro } from "./PlaceIntro";
import { PlaceOutro } from "./PlaceOutro";
import { PlaceProfile } from "./PlaceProfile";
import { PlacesHud } from "./PlacesHud";

export type PlacesProps = {
  sceneFrames: number[];
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const INTRO_AUDIO = "voiceover/places/01-intro.mp3";
const OUTRO_AUDIO = "voiceover/places/12-outro.mp3";

const AUDIO_FILES = [INTRO_AUDIO, ...PLACES.map((place) => place.audio), OUTRO_AUDIO];

// Studio fallback: the measured narration lengths at 30 fps with 0.2 s of air
// per scene (see public/voiceover/places/durations.json). calculateMetadata
// replaces these with the real decoded audio durations at render time.
export const FALLBACK_FRAMES = [
  255, 244, 234, 225, 214, 208, 207, 218, 215, 223, 225, 181,
];

export const calculateMetadata: CalculateMetadataFunction<PlacesProps> = async ({
  props,
}) => {
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

const LABELS = [
  "The countdown",
  ...PLACES.map((place) => place.name),
  "That was the top 10",
];

const MUSIC = "audio/music-cities.wav";
const WHOOSH = "audio/sfx-whoosh.wav";
const TICK = "audio/sfx-tick.wav";
const IMPACT = "audio/sfx-impact.wav";
const SHIMMER = "audio/sfx-shimmer.wav";

/** Sits well under the narration, ducking in and out around the whole story. */
const MusicBed: React.FC<{ total: number }> = ({ total }) => (
  <Audio
    src={staticFile(MUSIC)}
    loop
    volume={(f) => {
      const fadeIn = interpolate(f, [0, 40], [0, 0.16], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const fadeOut = interpolate(f, [total - 90, total - 6], [0.16, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return Math.min(fadeIn, fadeOut);
    }}
  />
);

const GlobalFade: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(
    interpolate(frame, [0, 14], [1, 0], { extrapolateRight: "clamp" }),
    interpolate(frame, [total - 20, total], [0, 1], { extrapolateLeft: "clamp" }),
  );
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#02040A", opacity: fade, pointerEvents: "none" }}
    />
  );
};

export const BeautifulPlaces: React.FC<PlacesProps> = ({ sceneFrames }) => {
  const frames =
    sceneFrames && sceneFrames.length === 12 ? sceneFrames : FALLBACK_FRAMES;

  const intro = frames[0];
  const outro = frames[11];
  const profiles = frames.slice(1, 11);
  const total = frames.reduce((sum, value) => sum + value, 0);

  const offsets = frames.reduce<number[]>((acc, value, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + frames[index - 1]);
    return acc;
  }, []);

  const finaleOffset = offsets[10];
  const totalSeconds = Math.round(total / FPS);

  return (
    <AbsoluteFill style={{ backgroundColor: "#04070F" }}>
      <PlaceBackground durationInFrames={total} />

      <Sequence durationInFrames={intro} name="01 · Intro">
        <Audio src={staticFile(INTRO_AUDIO)} />
        <PlaceIntro durationInFrames={intro} totalSeconds={totalSeconds} />
      </Sequence>

      {PLACES.map((place, index) => (
        <Sequence
          key={place.rank}
          from={offsets[index + 1]}
          durationInFrames={profiles[index]}
          name={`${String(index + 2).padStart(2, "0")} · #${place.rank} ${place.name}`}
        >
          <Audio src={staticFile(place.audio)} />
          <PlaceProfile
            place={place}
            durationInFrames={profiles[index]}
            variant={index}
          />
        </Sequence>
      ))}

      <Sequence from={offsets[11]} durationInFrames={outro} name="12 · Outro">
        <Audio src={staticFile(OUTRO_AUDIO)} />
        <PlaceOutro durationInFrames={outro} />
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
          <Audio src={staticFile(WHOOSH)} volume={0.16} />
        </Sequence>
      ))}

      {/* quiet ticks land with each rank card */}
      {offsets.slice(1, 11).map((offset) => (
        <Sequence
          key={`tick-${offset}`}
          from={offset + 6}
          durationInFrames={14}
          name={`SFX · tick ${offset}`}
        >
          <Audio src={staticFile(TICK)} volume={0.1} />
        </Sequence>
      ))}

      <Sequence durationInFrames={26} name="SFX · opening impact">
        <Audio src={staticFile(IMPACT)} volume={0.26} />
      </Sequence>
      <Sequence
        from={finaleOffset}
        durationInFrames={54}
        name="SFX · finale impact"
      >
        <Audio src={staticFile(IMPACT)} volume={0.3} />
      </Sequence>
      <Sequence
        from={finaleOffset + 16}
        durationInFrames={150}
        name="SFX · finale shimmer"
      >
        <Audio src={staticFile(SHIMMER)} volume={0.14} />
      </Sequence>

      <PlacesHud sceneFrames={frames} labels={LABELS} />
      <GlobalFade total={total} />
    </AbsoluteFill>
  );
};
