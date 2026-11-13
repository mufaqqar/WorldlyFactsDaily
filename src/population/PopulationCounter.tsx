import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, goldGradient, palette } from "./theme";

const format = (value: number) => Math.round(value).toLocaleString("en-US");

type Props = {
  value: number;
  startFrame?: number;
  durationInFrames?: number;
  fontSize?: number;
  delay?: number;
};

/**
 * The population figure counts up from zero and settles on the exact UN
 * estimate, with thousands separators so the scale of the number reads at a
 * glance.
 */
export const PopulationCounter: React.FC<Props> = ({
  value,
  startFrame = 10,
  durationInFrames = 46,
  fontSize = 92,
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
        letterSpacing: -fontSize * 0.035,
        lineHeight: 0.95,
        opacity: enter,
        scale: interpolate(enter, [0, 1], [0.86, 1]) * (1 + bump * 0.03),
        translate: interpolate(enter, [0, 1], ["0px 26px", "0px 0px"]),
        filter: `drop-shadow(0 18px 50px rgba(0,0,0,0.55)) drop-shadow(0 0 ${28 + bump * 22}px rgba(255,215,0,${0.2 + bump * 0.16}))`,
      }}
    >
      <span
        style={{
          fontSize,
          background: goldGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          whiteSpace: "nowrap",
        }}
      >
        {format(count)}
      </span>
      <span
        style={{
          fontSize: fontSize * 0.15,
          fontFamily: displayFamily,
          fontWeight: 500,
          letterSpacing: 2.2,
          textTransform: "uppercase",
          color: palette.muted,
          marginLeft: fontSize * 0.12,
          translate: "0 -0.6em",
          opacity: 0.9,
          whiteSpace: "nowrap",
        }}
      >
        people
      </span>
    </div>
  );
};
