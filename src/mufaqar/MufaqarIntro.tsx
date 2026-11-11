import { AbsoluteFill, Sequence } from "remotion";
import {
  FEATURES_FROM,
  FEATURES_FRAMES,
  INTRO_FRAMES,
  OUTRO_FROM,
  OUTRO_FRAMES,
} from "../timeline";
import { MufaqarBackground } from "./MufaqarBackground";
import { MufaqarHud } from "./MufaqarHud";
import { MufaqarIntroScene } from "./MufaqarIntroScene";
import { MufaqarOutroScene } from "./MufaqarOutroScene";
import { MufaqarServicesScene } from "./MufaqarServicesScene";

export const MufaqarIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <MufaqarBackground />

      <Sequence durationInFrames={INTRO_FRAMES} name="01 · Mufaqar">
        <MufaqarIntroScene />
      </Sequence>

      <Sequence
        from={FEATURES_FROM}
        durationInFrames={FEATURES_FRAMES}
        name="02 · Services"
      >
        <MufaqarServicesScene />
      </Sequence>

      <Sequence
        from={OUTRO_FROM}
        durationInFrames={OUTRO_FRAMES}
        name="03 · Contact"
      >
        <MufaqarOutroScene />
      </Sequence>

      <MufaqarHud />
    </AbsoluteFill>
  );
};
