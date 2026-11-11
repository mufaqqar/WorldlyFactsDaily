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
import { DominanceScene } from "./DominanceScene";
import { IntroScene } from "./IntroScene";
import { MomentumScene } from "./MomentumScene";
import { OutroScene } from "./OutroScene";
import { SteelBackground } from "./SteelBackground";
import { SteelHud } from "./SteelHud";
import { TopProducersScene } from "./TopProducersScene";

export type SteelProps = {
  sceneFrames: number[];
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const AUDIO_FILES = [
  "01-intro.mp3",
  "02-top10.mp3",
  "03-dominance.mp3",
  "04-momentum.mp3",
  "05-outro.mp3",
];

const FALLBACK_FRAMES = [295, 443, 294, 390, 318];

export const calculateMetadata: CalculateMetadataFunction<
  SteelProps
> = async () => {
  const durations = await Promise.all(
    AUDIO_FILES.map((file) =>
      getAudioDuration(staticFile(`voiceover/steel/${file}`)),
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

export const SteelProducers: React.FC<SteelProps> = ({ sceneFrames }) => {
  const frames = sceneFrames.length === 5 ? sceneFrames : FALLBACK_FRAMES;
  const [intro, top10, dominance, momentum, outro] = frames;

  const offsets = [
    0,
    intro,
    intro + top10,
    intro + top10 + dominance,
    intro + top10 + dominance + momentum,
  ];

  const total = frames.reduce((sum, value) => sum + value, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: "#07090c" }}>
      <SteelBackground />

      <Sequence durationInFrames={intro} name="01 · Intro">
        <Audio src={staticFile("voiceover/steel/01-intro.mp3")} />
        <IntroScene durationInFrames={intro} />
      </Sequence>

      <Sequence from={offsets[1]} durationInFrames={top10} name="02 · Top 10">
        <Audio src={staticFile("voiceover/steel/02-top10.mp3")} />
        <TopProducersScene durationInFrames={top10} />
      </Sequence>

      <Sequence
        from={offsets[2]}
        durationInFrames={dominance}
        name="03 · The outlier"
      >
        <Audio src={staticFile("voiceover/steel/03-dominance.mp3")} />
        <DominanceScene durationInFrames={dominance} />
      </Sequence>

      <Sequence
        from={offsets[3]}
        durationInFrames={momentum}
        name="04 · Momentum"
      >
        <Audio src={staticFile("voiceover/steel/04-momentum.mp3")} />
        <MomentumScene durationInFrames={momentum} />
      </Sequence>

      <Sequence from={offsets[4]} durationInFrames={outro} name="05 · Outro">
        <Audio src={staticFile("voiceover/steel/05-outro.mp3")} />
        <OutroScene durationInFrames={outro} />
      </Sequence>

      <SteelHud sceneFrames={frames} />
      <GlobalFade total={total} />
    </AbsoluteFill>
  );
};
