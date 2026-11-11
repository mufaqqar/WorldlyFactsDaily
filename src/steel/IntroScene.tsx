import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { codeFamily, displayFamily, palette, steelGradient } from "./theme";

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

  const steelIn = spring({
    frame,
    fps,
    delay: 5,
    durationInFrames: 42,
    config: { damping: 14, stiffness: 105 },
  });

  const ruleIn = spring({
    frame,
    fps,
    delay: 20,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  const titleIn = spring({
    frame,
    fps,
    delay: 24,
    durationInFrames: 40,
    config: { damping: 18, stiffness: 110 },
  });

  const pillIn = spring({
    frame,
    fps,
    delay: 42,
    durationInFrames: 34,
    config: { damping: 15, stiffness: 120 },
  });

  const noteIn = spring({
    frame,
    fps,
    delay: 54,
    durationInFrames: 28,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 70px",
        paddingBottom: 50,
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
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: palette.molten,
            opacity: kickerIn * 0.95,
            translate: interpolate(kickerIn, [0, 1], ["0px 14px", "0px 0px"]),
          }}
        >
          Global crude steel
        </div>

        <div
          style={{
            marginTop: 4,
            fontFamily: displayFamily,
            fontSize: 232,
            fontWeight: 700,
            letterSpacing: -8,
            lineHeight: 0.96,
            background: steelGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 24px 60px rgba(159,179,200,0.22))",
            opacity: steelIn,
            scale: interpolate(steelIn, [0, 1], [0.84, 1]),
            translate: interpolate(steelIn, [0, 1], ["0px 46px", "0px 0px"]),
          }}
        >
          STEEL
        </div>

        <div
          style={{
            marginTop: 18,
            width: 240,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${palette.molten}, transparent)`,
            opacity: ruleIn,
            scale: interpolate(ruleIn, [0, 1], [0.2, 1]),
            boxShadow: `0 0 18px ${palette.molten}66`,
          }}
        />

        <div
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: displayFamily,
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: -2.5,
            lineHeight: 1.08,
            color: palette.ink,
            opacity: titleIn,
            translate: interpolate(titleIn, [0, 1], ["0px 44px", "0px 0px"]),
          }}
        >
          <span>The largest</span>
          <span style={{ color: palette.silver }}>producers</span>
        </div>

        <div
          style={{
            marginTop: 16,
            fontFamily: codeFamily,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: palette.muted,
            opacity: titleIn * 0.9,
          }}
        >
          in the world
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 34px",
            borderRadius: 999,
            border: "1px solid rgba(255,107,44,0.35)",
            background:
              "linear-gradient(180deg, rgba(255,107,44,0.16), rgba(255,107,44,0.03))",
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${palette.molten}22`,
            opacity: pillIn,
            scale: interpolate(pillIn, [0, 1], [0.88, 1]),
          }}
        >
          <span
            style={{
              fontFamily: codeFamily,
              fontSize: 30,
              letterSpacing: 1,
              color: palette.hot,
            }}
          >
            1,886.3 Mt
          </span>
          <span
            style={{
              width: 1,
              height: 26,
              backgroundColor: "rgba(255,179,71,0.35)",
            }}
          />
          <span
            style={{
              fontFamily: codeFamily,
              fontSize: 30,
              letterSpacing: 1,
              color: palette.hot,
            }}
          >
            2024
          </span>
        </div>

        <div
          style={{
            marginTop: 34,
            fontFamily: codeFamily,
            fontSize: 21,
            letterSpacing: 2,
            color: palette.muted,
            opacity: noteIn * 0.85,
            translate: interpolate(noteIn, [0, 1], ["0px 14px", "0px 0px"]),
            textAlign: "center",
          }}
        >
          Top 10 countries · crude steel output
        </div>

        <div
          style={{
            marginTop: 12,
            fontFamily: codeFamily,
            fontSize: 17,
            letterSpacing: 2,
            color: "#6f7d8d",
            opacity: noteIn * 0.65,
          }}
        >
          World Steel Association
        </div>
      </div>
    </AbsoluteFill>
  );
};
