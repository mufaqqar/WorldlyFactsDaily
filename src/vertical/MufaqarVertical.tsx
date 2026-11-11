import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import {
  HERO_FRAMES,
  OUTRO_FROM,
  OUTRO_FRAMES,
  SERVICES_FROM,
  SERVICES_FRAMES,
  STACK_FROM,
  STACK_FRAMES,
  STATS_FROM,
  STATS_FRAMES,
  V_TOTAL,
} from "./timeline";
import { HeroScene } from "./HeroScene";
import { OutroScene } from "./OutroScene";
import { ServicesScene } from "./ServicesScene";
import { StackScene } from "./StackScene";
import { StatsScene } from "./StatsScene";
import { VerticalBackground } from "./VerticalBackground";
import { VerticalHud } from "./VerticalHud";

const GlobalFade: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = Math.min(
    interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp" }),
    interpolate(frame, [V_TOTAL - 18, V_TOTAL], [0, 1], {
      extrapolateLeft: "clamp",
    }),
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#000", opacity: fade, pointerEvents: "none" }}
    />
  );
};

export const MufaqarVertical: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04070f" }}>
      <VerticalBackground />

      <Sequence durationInFrames={HERO_FRAMES} name="01 · Intro">
        <HeroScene />
      </Sequence>

      <Sequence
        from={STATS_FROM}
        durationInFrames={STATS_FRAMES}
        name="02 · Track record"
      >
        <StatsScene />
      </Sequence>

      <Sequence
        from={SERVICES_FROM}
        durationInFrames={SERVICES_FRAMES}
        name="03 · Services"
      >
        <ServicesScene />
      </Sequence>

      <Sequence
        from={STACK_FROM}
        durationInFrames={STACK_FRAMES}
        name="04 · Stack"
      >
        <StackScene />
      </Sequence>

      <Sequence
        from={OUTRO_FROM}
        durationInFrames={OUTRO_FRAMES}
        name="05 · Contact"
      >
        <OutroScene />
      </Sequence>

      <VerticalHud />
      <GlobalFade />
    </AbsoluteFill>
  );
};
