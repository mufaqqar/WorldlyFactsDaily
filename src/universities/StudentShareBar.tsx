import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, goldGradient, palette } from "./theme";

type Props = {
  /** Share of the student body that comes from outside the country, 0–1. */
  share: number;
  delay?: number;
};

/**
 * International-student rail. The gold fill is the share of the student body
 * from outside the country; the track runs from 0% to 100%.
 */
export const StudentShareBar: React.FC<Props> = ({ share, delay = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamped = Math.min(1, Math.max(0, share));

  const enter = spring({
    frame,
    fps,
    delay,
    durationInFrames: 26,
    config: { damping: 200 },
  });

  const fill = interpolate(frame, [delay, delay + 34], [0, clamped * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const percent = interpolate(frame, [delay + 6, delay + 34], [0, clamped * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

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
            fontSize: 12,
            letterSpacing: 3.2,
            color: palette.muted,
            textTransform: "uppercase",
          }}
        >
          International students
        </span>
        <span style={{ fontSize: 18, letterSpacing: 0.4, color: palette.goldSoft }}>
          {percent.toFixed(0)}%
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
        {[0.25, 0.5, 0.75].map((step) => (
          <div
            key={step}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${step * 100}%`,
              width: 1,
              backgroundColor: "rgba(255,255,255,0.22)",
            }}
          />
        ))}
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
      </div>

      <div
        style={{
          position: "relative",
          marginTop: 10,
          height: 16,
          fontFamily: displayFamily,
          fontSize: 11,
          letterSpacing: 2,
          color: palette.mutedDeep,
        }}
      >
        <span style={{ position: "absolute", left: 0 }}>0%</span>
        <span
          style={{
            position: "absolute",
            left: "50%",
            translate: "-50% 0",
            color: "rgba(96,165,250,0.85)",
            whiteSpace: "nowrap",
          }}
        >
          50% FROM ABROAD
        </span>
        <span style={{ position: "absolute", right: 0 }}>100%</span>
      </div>
    </div>
  );
};
