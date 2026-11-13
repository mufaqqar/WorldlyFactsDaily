import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, goldGradient, palette } from "./theme";

const formatIndex = (value: number) => value.toFixed(1);

type Props = {
  value: number;
  startFrame?: number;
  durationInFrames?: number;
  fontSize?: number;
  delay?: number;
};

/**
 * Gold cost-of-living index that counts up from zero. A decimal is part of the
 * identity here, so the value keeps one place throughout the animation.
 */
export const IndexCounter: React.FC<Props> = ({
  value,
  startFrame = 10,
  durationInFrames = 44,
  fontSize = 150,
  delay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay,
    durationInFrames: 24,
    config: { damping: 16, stiffness: 120 },
  });

  const count = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, value],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const settled = frame >= startFrame + durationInFrames;
  const bump = settled
    ? spring({
        frame,
        fps,
        delay: startFrame + durationInFrames,
        durationInFrames: 16,
        config: { damping: 12, stiffness: 200 },
      })
    : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        fontFamily: displayFamily,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: -fontSize * 0.045,
        lineHeight: 0.95,
        opacity: enter,
        scale: interpolate(enter, [0, 1], [0.82, 1]) * (1 + bump * 0.035),
        translate: interpolate(enter, [0, 1], ["0px 28px", "0px 0px"]),
        filter: `drop-shadow(0 18px 50px rgba(0,0,0,0.55)) drop-shadow(0 0 ${28 + bump * 22}px rgba(255,215,0,${0.22 + bump * 0.18}))`,
      }}
    >
      <span
        style={{
          fontSize,
          background: goldGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {formatIndex(count)}
      </span>
      <span
        style={{
          fontSize: fontSize * 0.155,
          fontFamily: displayFamily,
          fontWeight: 500,
          letterSpacing: 1.2,
          color: palette.muted,
          marginLeft: fontSize * 0.12,
          translate: "0 -0.55em",
          opacity: 0.9,
          textShadow: "none",
          whiteSpace: "nowrap",
        }}
      >
        vs. New York
      </span>
    </div>
  );
};
