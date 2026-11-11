import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { codeFamily, displayFamily, goldGradient, palette } from "./theme";

export const IntroScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: durationInFrames - 20,
    durationInFrames: 20,
    config: { damping: 200 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 26,
    config: { damping: 200 },
  });

  const topIn = spring({
    frame,
    fps,
    delay: 6,
    durationInFrames: 40,
    config: { damping: 15, stiffness: 110 },
  });

  const titleIn = spring({
    frame,
    fps,
    delay: 18,
    durationInFrames: 40,
    config: { damping: 18, stiffness: 110 },
  });

  const pillIn = spring({
    frame,
    fps,
    delay: 34,
    durationInFrames: 34,
    config: { damping: 15, stiffness: 120 },
  });

  const noteIn = spring({
    frame,
    fps,
    delay: 44,
    durationInFrames: 28,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 70px",
        paddingBottom: 60,
        opacity: 1 - exit,
        scale: interpolate(exit, [0, 1], [1, 1.05]),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: codeFamily,
            fontSize: 21,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: palette.gold,
            opacity: kickerIn * 0.9,
            translate: interpolate(kickerIn, [0, 1], ["0px 14px", "0px 0px"]),
          }}
        >
          The data edit
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: displayFamily,
            fontSize: 178,
            fontWeight: 700,
            letterSpacing: -8,
            lineHeight: 0.98,
            background: goldGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 22px 60px rgba(246,196,83,0.28))",
            opacity: topIn,
            scale: interpolate(topIn, [0, 1], [0.82, 1]),
            translate: interpolate(topIn, [0, 1], ["0px 40px", "0px 0px"]),
          }}
        >
          TOP 10
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: displayFamily,
            fontSize: 94,
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 1.04,
            color: palette.ink,
            opacity: titleIn,
            translate: interpolate(titleIn, [0, 1], ["0px 44px", "0px 0px"]),
          }}
        >
          <span>Richest</span>
          <span style={{ color: "#dbe6f5" }}>Countries</span>
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "16px 34px",
            borderRadius: 999,
            border: "1px solid rgba(246,196,83,0.35)",
            background:
              "linear-gradient(180deg, rgba(246,196,83,0.14), rgba(246,196,83,0.03))",
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${palette.gold}1f`,
            opacity: pillIn,
            scale: interpolate(pillIn, [0, 1], [0.88, 1]),
          }}
        >
          <span
            style={{
              fontFamily: codeFamily,
              fontSize: 34,
              letterSpacing: 2,
              color: palette.goldSoft,
            }}
          >
            1960
          </span>
          <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
            <path
              d="M2 10h24M20 4l6 6-6 6"
              stroke={palette.gold}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: codeFamily,
              fontSize: 34,
              letterSpacing: 2,
              color: palette.goldSoft,
            }}
          >
            2024
          </span>
        </div>

        <div
          style={{
            marginTop: 34,
            fontFamily: codeFamily,
            fontSize: 23,
            letterSpacing: 2,
            color: palette.muted,
            opacity: noteIn * 0.85,
            translate: interpolate(noteIn, [0, 1], ["0px 14px", "0px 0px"]),
            textAlign: "center",
          }}
        >
          GDP per capita · current US$
        </div>

        <div
          style={{
            marginTop: 14,
            fontFamily: codeFamily,
            fontSize: 18,
            letterSpacing: 2,
            color: "#7d8ea6",
            opacity: noteIn * 0.6,
          }}
        >
          Sovereign states · World Bank
        </div>
      </div>
    </AbsoluteFill>
  );
};
