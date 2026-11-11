import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, displayFamily, interFamily, monoFamily } from "../fonts";
import { INTRO_FRAMES } from "../timeline";

const TITLE = "Remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: INTRO_FRAMES - 26,
    durationInFrames: 26,
    config: { damping: 200 },
  });

  const badgeIn = spring({
    frame,
    fps,
    delay: 2,
    durationInFrames: 26,
    config: { damping: 200 },
  });

  const underline = spring({
    frame,
    fps,
    delay: 46,
    durationInFrames: 34,
    config: { damping: 200 },
  });

  const subtitleIn = spring({
    frame,
    fps,
    delay: 54,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exit,
        transform: `scale(${interpolate(exit, [0, 1], [1, 1.06])})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 20px",
            borderRadius: 999,
            border: "1px solid rgba(139,92,246,0.45)",
            backgroundColor: "rgba(139,92,246,0.12)",
            fontFamily: monoFamily,
            fontSize: 17,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#cfd8ff",
            opacity: badgeIn,
            transform: `translateY(${interpolate(badgeIn, [0, 1], [18, 0])}px)`,
            boxShadow: "0 0 40px rgba(139,92,246,0.25)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              backgroundColor: colors.mint,
              boxShadow: `0 0 10px ${colors.mint}`,
            }}
          />
          React video engine
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontFamily: displayFamily,
            fontSize: 196,
            fontWeight: 700,
            letterSpacing: -8,
            lineHeight: 1,
          }}
        >
          {TITLE.split("").map((letter, i) => {
            const enter = spring({
              frame,
              fps,
              delay: 6 + i * 2.4,
              durationInFrames: 34,
              config: { damping: 16, stiffness: 130 },
            });

            return (
              <span
                key={`${letter}-${i}`}
                style={{
                  display: "inline-block",
                  opacity: Math.min(1, enter * 1.6),
                  transform: `translateY(${interpolate(enter, [0, 1], [120, 0])}px) rotate(${interpolate(
                    enter,
                    [0, 1],
                    [6, 0],
                  )}deg)`,
                  background: `linear-gradient(180deg, #ffffff 0%, #dcd9ff 46%, ${colors.violet} 120%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 18px 46px rgba(139,92,246,0.45))",
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>

        {/* Accent rule */}
        <div
          style={{
            marginTop: 14,
            height: 5,
            width: 520,
            borderRadius: 99,
            transform: `scaleX(${underline})`,
            background: `linear-gradient(90deg, transparent, ${colors.blue}, ${colors.violet}, ${colors.pink}, transparent)`,
            boxShadow: `0 0 30px ${colors.violet}66`,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            marginTop: 34,
            fontFamily: interFamily,
            fontSize: 42,
            fontWeight: 400,
            letterSpacing: 0.5,
            color: colors.muted,
            opacity: subtitleIn,
            transform: `translateY(${interpolate(subtitleIn, [0, 1], [22, 0])}px)`,
          }}
        >
          Video creation{" "}
          <span style={{ color: colors.ink, fontWeight: 600 }}>
            in React
          </span>
          .
        </div>
      </div>
    </AbsoluteFill>
  );
};
