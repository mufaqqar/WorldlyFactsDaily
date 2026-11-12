import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, goldGradient, palette, textGlow } from "./theme";

export const formatBillions = (value: number) =>
  Math.round(value).toLocaleString("en-US");

type Props = {
  value: number;
  startFrame?: number;
  durationInFrames?: number;
  fontSize?: number;
  delay?: number;
  compact?: boolean;
};

/**
 * Gold net-worth figure that counts from zero. The "$" and "B" are sized
 * relative to the number so the whole lockup stays optically balanced.
 */
export const WealthCounter: React.FC<Props> = ({
  value,
  startFrame = 10,
  durationInFrames = 44,
  fontSize = 150,
  delay = 8,
  compact = false,
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
          fontSize: fontSize * 0.52,
          marginRight: fontSize * 0.015,
          background: goldGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "none",
          translate: "0 -0.12em",
        }}
      >
        $
      </span>
      <span
        style={{
          fontSize,
          background: goldGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {formatBillions(count)}
      </span>
      <span
        style={{
          fontSize: fontSize * 0.46,
          marginLeft: fontSize * 0.035,
          background: `linear-gradient(180deg, ${palette.goldPale}, ${palette.gold}, ${palette.goldDeep})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          letterSpacing: -2,
        }}
      >
        B
      </span>
      {compact ? null : (
        <span
          style={{
            fontSize: 15,
            fontFamily: displayFamily,
            letterSpacing: 4,
            color: palette.muted,
            marginLeft: 16,
            translate: "0 -0.35em",
            opacity: 0.7,
            textShadow: "none",
          }}
        >
          USD
        </span>
      )}
    </div>
  );
};

export const WealthCounterShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      padding: "20px 30px",
      borderRadius: 24,
      background:
        "linear-gradient(160deg, rgba(255,215,0,0.07), rgba(255,255,255,0.01) 56%, rgba(59,130,246,0.05))",
      border: "1px solid rgba(255,215,0,0.14)",
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.35)`,
      textShadow: textGlow,
    }}
  >
    {children}
  </div>
);
