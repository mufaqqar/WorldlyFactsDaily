import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  displayFamily,
  goldGradient,
  interFamily,
  palette,
  textGlow,
} from "./theme";

/**
 * Scene 01 — "TOP 10 / MOST BEAUTIFUL PLACES ON EARTH", with the count-up
 * 1 → 10 that the rest of the series uses.
 */
export const PlaceIntro: React.FC<{
  durationInFrames: number;
  totalSeconds?: number;
}> = ({ durationInFrames, totalSeconds = 88 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kicker = spring({ frame, fps, delay: 4, durationInFrames: 26, config: { damping: 18 } });
  const top = spring({ frame, fps, delay: 10, durationInFrames: 30, config: { damping: 16 } });
  const bottom = spring({ frame, fps, delay: 20, durationInFrames: 30, config: { damping: 16 } });
  const chip = spring({ frame, fps, delay: 40, durationInFrames: 26, config: { damping: 18 } });

  const count = Math.round(
    interpolate(frame, [12, 62], [1, 10], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const exit = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "0 72px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: exit,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: kicker,
          transform: `translateY(${interpolate(kicker, [0, 1], [18, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: displayFamily,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 7,
            color: palette.goldSoft,
            textTransform: "uppercase",
          }}
        >
          A curated countdown
        </span>
        <span style={{ width: 120, height: 2, background: goldGradient, opacity: 0.7 }} />
      </div>

      <div
        style={{
          marginTop: 28,
          fontFamily: displayFamily,
          fontSize: 250,
          fontWeight: 700,
          lineHeight: 0.82,
          letterSpacing: -14,
          background: goldGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          transform: `translateY(${interpolate(top, [0, 1], [44, 0])}px) scale(${interpolate(top, [0, 1], [0.94, 1])})`,
          opacity: top,
          filter: "drop-shadow(0 22px 60px rgba(0,0,0,0.55))",
        }}
      >
        TOP {count}
      </div>

      <div
        style={{
          marginTop: 6,
          fontFamily: displayFamily,
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: -2.4,
          color: palette.ink,
          textShadow: textGlow,
          opacity: bottom,
          transform: `translateY(${interpolate(bottom, [0, 1], [34, 0])}px)`,
        }}
      >
        Most beautiful
        <br />
        places on Earth
      </div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: chip,
          transform: `translateY(${interpolate(chip, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            padding: "14px 24px",
            borderRadius: 999,
            border: `1px solid ${palette.line}`,
            background: "rgba(8,13,27,0.66)",
            fontFamily: interFamily,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 0.4,
            color: palette.goldPale,
          }}
        >
          10 → 1 · {totalSeconds} seconds
        </div>
        <div
          style={{
            padding: "14px 22px",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.28)",
            fontFamily: interFamily,
            fontSize: 19,
            fontWeight: 500,
            color: palette.muted,
          }}
        >
          Editorial selection · no official ranking
        </div>
      </div>
    </div>
  );
};
