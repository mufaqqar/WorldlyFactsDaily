import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, goldGradient, palette } from "./theme";

/**
 * Oversized editorial rank numeral that bleeds out from behind the city card.
 */
export const CityRankWatermark: React.FC<{ rank: number; variant?: number }> = ({
  rank,
  variant = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 26,
    config: { damping: 15, stiffness: 110 },
  });

  const direction = variant % 2 === 0 ? -1 : 1;

  return (
    <div
      style={{
        position: "absolute",
        top: 18,
        right: -14,
        width: 780,
        height: 640,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pointerEvents: "none",
        opacity: enter * 0.95,
      }}
    >
      <div
        style={{
          fontFamily: displayFamily,
          fontSize: 520,
          fontWeight: 700,
          lineHeight: 0.78,
          letterSpacing: -34,
          color: "rgba(255,215,0,0.03)",
          WebkitTextStroke: "2px rgba(255,215,0,0.16)",
          transform: `translateX(${interpolate(enter, [0, 1], [direction * 90, 0])}px) scale(${interpolate(enter, [0, 1], [1.24, 1])}) rotate(${interpolate(enter, [0, 1], [direction * 3, 0])}deg)`,
          transformOrigin: "right top",
        }}
      >
        {String(rank).padStart(2, "0")}
      </div>

      <div
        style={{
          marginTop: 2,
          marginRight: 34,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(enter, [0.4, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontFamily: displayFamily,
            fontSize: 10,
            letterSpacing: 3.6,
            color: palette.mutedDeep,
            textTransform: "uppercase",
          }}
        >
          of 10
        </span>
        <span
          style={{
            width: 44,
            height: 2,
            background: goldGradient,
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  );
};
