import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, goldGradient, palette } from "./theme";

type Props = {
  value: number;
  max: number;
  delay?: number;
  label?: string;
};

/**
 * Cost comparison rail: the faint track is the world's priciest city, the gold
 * fill is this city's index. New York (100) is marked on every rail.
 */
export const CityProgressBar: React.FC<Props> = ({
  value,
  max,
  delay = 20,
  label = "COST OF LIVING VS. WORLD #1",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const share = Math.min(1, value / max);

  const enter = spring({
    frame,
    fps,
    delay,
    durationInFrames: 26,
    config: { damping: 200 },
  });

  const fill = interpolate(frame, [delay, delay + 34], [0, share * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const percent = interpolate(frame, [delay + 8, delay + 38], [0, share * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const nycMark = (100 / max) * 100;

  return (
    <div
      style={{
        width: "100%",
        opacity: enter,
        translate: interpolate(enter, [0, 1], ["0px 26px", "0px 0px"]),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 12,
          fontFamily: displayFamily,
        }}
      >
        <span
          style={{
            fontSize: 13,
            letterSpacing: 3.4,
            color: palette.muted,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 17, letterSpacing: 0.6, color: palette.goldSoft }}>
          {Math.round(percent)}%
        </span>
      </div>

      <div
        style={{
          position: "relative",
          height: 18,
          borderRadius: 99,
          background: "rgba(148,163,184,0.11)",
          border: "1px solid rgba(255,255,255,0.055)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.11) 0px, rgba(255,255,255,0.11) 1px, transparent 1px, transparent 10%)",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            width: `${fill}%`,
            borderRadius: 99,
            background: goldGradient,
            boxShadow:
              "0 0 22px rgba(255,215,0,0.55), inset 0 1px 0 rgba(255,255,255,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -5,
            bottom: -5,
            left: `calc(${fill}% - 5px)`,
            width: 10,
            borderRadius: 99,
            backgroundColor: "#FFF8D6",
            boxShadow: "0 0 24px 6px rgba(255,215,0,0.65)",
            opacity: fill > 1 ? 1 : 0,
          }}
        />
        {/* New York baseline marker */}
        <div
          style={{
            position: "absolute",
            top: -3,
            bottom: -3,
            left: `${nycMark}%`,
            width: 2,
            backgroundColor: "rgba(96,165,250,0.9)",
            boxShadow: "0 0 10px rgba(96,165,250,0.9)",
            opacity: enter,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
          fontFamily: displayFamily,
          fontSize: 12,
          letterSpacing: 2,
          color: palette.mutedDeep,
        }}
      >
        <span>NEW YORK · 100.0</span>
        <span>WORLD #1 · {max.toFixed(1)}</span>
      </div>
    </div>
  );
};
