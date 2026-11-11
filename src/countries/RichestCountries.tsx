import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  HtmlInCanvas,
} from "remotion";
import { getAudioDuration } from "@remotion/media-utils";
import { CountryBackground } from "./CountryBackground";
import { CountryHud } from "./CountryHud";
import { IntroScene } from "./IntroScene";
import { ListScene } from "./ListScene";
import { OutroScene } from "./OutroScene";
import { ShiftsScene } from "./ShiftsScene";
import { LIST_1960, LIST_2024, MAX_1960, MAX_2024 } from "./data";

export type RichestProps = {
  sceneFrames: number[];
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const AUDIO_FILES = [
  "01-intro.mp3",
  "02-1960.mp3",
  "03-2024.mp3",
  "04-shifts.mp3",
  "05-outro.mp3",
];

const FALLBACK_FRAMES = [356, 465, 535, 597, 327];

export const calculateMetadata: CalculateMetadataFunction<
  RichestProps
> = async () => {
  const durations = await Promise.all(
    AUDIO_FILES.map((file) =>
      getAudioDuration(staticFile(`voiceover/countries/${file}`)),
    ),
  );

  const sceneFrames = durations.map((seconds) =>
    Math.ceil((seconds + 0.7) * FPS),
  );

  return {
    durationInFrames: sceneFrames.reduce((sum, frames) => sum + frames, 0),
    props: { sceneFrames },
  };
};

const GlobalFade: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();

  const fade = Math.min(
    interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp" }),
    interpolate(frame, [total - 20, total], [0, 1], {
      extrapolateLeft: "clamp",
    }),
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#000", opacity: fade, pointerEvents: "none" }}
    />
  );
};

export const RichestCountries: React.FC<RichestProps> = ({ sceneFrames }) => {
  const frames = sceneFrames.length === 5 ? sceneFrames : FALLBACK_FRAMES;
  const [intro, y1960, y2024, shifts, outro] = frames;

  const offsets = [
    0,
    intro,
    intro + y1960,
    intro + y1960 + y2024,
    intro + y1960 + y2024 + shifts,
  ];

  const total = frames.reduce((sum, value) => sum + value, 0);

  return (
    <HtmlInCanvas
      width={1080}
      height={1920}
      from={0}
      durationInFrames={2281}
      trimBefore={0}
    >
      <AbsoluteFill style={{ backgroundColor: "#05080f" }}>
        <CountryBackground />

        <Sequence durationInFrames={intro} name="01 · Intro">
          <Audio src={staticFile("voiceover/countries/01-intro.mp3")} />
          <IntroScene durationInFrames={intro} />
        </Sequence>

        <Sequence
          from={offsets[1]}
          durationInFrames={y1960}
          name="02 · 1960"
        >
          <Audio src={staticFile("voiceover/countries/02-1960.mp3")} />
          <ListScene
            durationInFrames={y1960}
            year="1960"
            entries={LIST_1960}
            max={MAX_1960}
            stagger={20}
            showChange={false}
          />
        </Sequence>

        <Sequence
          from={offsets[2]}
          durationInFrames={y2024}
          name="03 · 2024"
        >
          <Audio src={staticFile("voiceover/countries/03-2024.mp3")} />
          <ListScene
            durationInFrames={y2024}
            year="2024"
            entries={LIST_2024}
            max={MAX_2024}
            stagger={22}
            showChange
          />
        </Sequence>

        <Sequence
          from={offsets[3]}
          durationInFrames={shifts}
          name="04 · What changed"
        >
          <Audio src={staticFile("voiceover/countries/04-shifts.mp3")} />
          <ShiftsScene durationInFrames={shifts} />
        </Sequence>

        <Sequence
          from={offsets[4]}
          durationInFrames={outro}
          name="05 · Outro"
        >
          <Audio src={staticFile("voiceover/countries/05-outro.mp3")} />
          <OutroScene durationInFrames={outro} />
        </Sequence>

        <CountryHud sceneFrames={frames} />
        <GlobalFade total={total} />
      </AbsoluteFill>
    </HtmlInCanvas>
  );
};
