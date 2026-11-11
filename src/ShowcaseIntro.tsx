import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./components/Background";
import { FeaturesScene } from "./components/FeaturesScene";
import { Hud } from "./components/Hud";
import { IntroScene } from "./components/IntroScene";
import { OutroScene } from "./components/OutroScene";
import {
  FEATURES_FROM,
  FEATURES_FRAMES,
  INTRO_FRAMES,
  OUTRO_FROM,
  OUTRO_FRAMES,
} from "./timeline";

export const ShowcaseIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence durationInFrames={INTRO_FRAMES} name="01 · Wordmark">
        <IntroScene />
      </Sequence>

      <Sequence
        from={FEATURES_FROM}
        durationInFrames={FEATURES_FRAMES}
        name="02 · Features"
      >
        <FeaturesScene />
      </Sequence>

      <Sequence
        from={OUTRO_FROM}
        durationInFrames={OUTRO_FRAMES}
        name="03 · Outro"
      >
        <OutroScene />
      </Sequence>

      <Hud />
    </AbsoluteFill>
  );
};
