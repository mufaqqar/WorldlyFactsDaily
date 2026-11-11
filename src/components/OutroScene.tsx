import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, displayFamily, interFamily, monoFamily } from "../fonts";

const Line: React.FC<{
  children: React.ReactNode;
  delay: number;
  gradient?: string;
}> = ({ children, delay, gradient }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay,
    durationInFrames: 44,
    config: { damping: 20, stiffness: 110 },
  });

  return (
    <div style={{ overflow: "hidden", paddingBottom: 10 }}>
      <div
        style={{
          transform: `translateY(${interpolate(enter, [0, 1], [110, 0])}%)`,
          opacity: Math.min(1, enter * 2),
          ...(gradient
            ? {
                background: gradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }
            : { color: colors.ink }),
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 24,
    config: { damping: 200 },
  });

  const pillIn = spring({
    frame,
    fps,
    delay: 44,
    durationInFrames: 34,
    config: { damping: 16, stiffness: 120 },
  });

  const noteIn = spring({
    frame,
    fps,
    delay: 56,
    durationInFrames: 28,
    config: { damping: 200 },
  });

  const ringRotation = frame * 0.6;
  const ringScale = interpolate(frame, [0, 60], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      {/* Rotating conic halo */}
      <div
        style={{
          position: "absolute",
          width: 980,
          height: 980,
          borderRadius: "50%",
          transform: `rotate(${ringRotation}deg) scale(${ringScale})`,
          background: `conic-gradient(from 0deg, transparent 0deg, ${colors.violet}30 70deg, transparent 150deg, ${colors.blue}26 240deg, transparent 320deg)`,
          maskImage:
            "radial-gradient(circle, transparent 58%, black 59%, black 61%, transparent 62%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 58%, black 59%, black 61%, transparent 62%)",
          opacity: 0.9,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: monoFamily,
            fontSize: 17,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: colors.violet,
            opacity: kickerIn,
            transform: `translateY(${interpolate(kickerIn, [0, 1], [14, 0])}px)`,
            marginBottom: 34,
          }}
        >
          Ship your first render
        </div>

        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 118,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1.06,
          }}
        >
          <Line delay={8}>Build videos</Line>
          <Line
            delay={16}
            gradient={`linear-gradient(100deg, #ffffff 0%, ${colors.blue} 45%, ${colors.violet} 78%, ${colors.pink} 100%)`}
          >
            like you build UIs.
          </Line>
        </div>

        {/* Call to action pill */}
        <div
          style={{
            marginTop: 62,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 34px 20px 26px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.16)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))",
            boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
            opacity: pillIn,
            transform: `translateY(${interpolate(pillIn, [0, 1], [50, 0])}px) scale(${interpolate(
              pillIn,
              [0, 1],
              [0.9, 1],
            )})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${colors.violet}, ${colors.blue})`,
              boxShadow: `0 0 26px ${colors.violet}80`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: interFamily,
              fontSize: 30,
              fontWeight: 600,
              color: colors.ink,
              letterSpacing: 0.2,
            }}
          >
            remotion.dev
          </span>
        </div>

        <div
          style={{
            marginTop: 28,
            fontFamily: monoFamily,
            fontSize: 19,
            letterSpacing: 1.5,
            color: colors.muted,
            opacity: noteIn * 0.85,
            transform: `translateY(${interpolate(noteIn, [0, 1], [12, 0])}px)`,
          }}
        >
          npm i remotion @remotion/cli
        </div>
      </div>
    </AbsoluteFill>
  );
};
