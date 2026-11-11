import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { INTRO_FRAMES } from "../timeline";
import { codeFamily, displayFamily, interFamily, nameGradient, wp } from "./theme";

const NAME = "Mufaqar";

export const MufaqarIntroScene: React.FC = () => {
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

  const ruleIn = spring({
    frame,
    fps,
    delay: 46,
    durationInFrames: 34,
    config: { damping: 200 },
  });

  const roleIn = spring({
    frame,
    fps,
    delay: 52,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  const siteIn = spring({
    frame,
    fps,
    delay: 62,
    durationInFrames: 28,
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
        {/* Availability badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 22px",
            borderRadius: 999,
            border: "1px solid rgba(52,211,153,0.35)",
            backgroundColor: "rgba(52,211,153,0.1)",
            fontFamily: codeFamily,
            fontSize: 17,
            letterSpacing: 3.5,
            textTransform: "uppercase",
            color: "#c7f5e4",
            opacity: badgeIn,
            transform: `translateY(${interpolate(badgeIn, [0, 1], [18, 0])}px)`,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              backgroundColor: wp.mint,
              boxShadow: `0 0 12px ${wp.mint}`,
            }}
          />
          Available for freelance
        </div>

        {/* Name */}
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontFamily: displayFamily,
            fontSize: 218,
            fontWeight: 700,
            letterSpacing: -9,
            lineHeight: 1,
          }}
        >
          {NAME.split("").map((letter, i) => {
            const enter = spring({
              frame,
              fps,
              delay: 6 + i * 2.6,
              durationInFrames: 34,
              config: { damping: 16, stiffness: 130 },
            });

            return (
              <span
                key={`${letter}-${i}`}
                style={{
                  display: "inline-block",
                  opacity: Math.min(1, enter * 1.6),
                  transform: `translateY(${interpolate(enter, [0, 1], [130, 0])}px) rotate(${interpolate(
                    enter,
                    [0, 1],
                    [5, 0],
                  )}deg)`,
                  background: nameGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 20px 50px rgba(34,211,238,0.35))",
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
            marginTop: 10,
            height: 5,
            width: 460,
            borderRadius: 99,
            transform: `scaleX(${ruleIn})`,
            background: `linear-gradient(90deg, transparent, ${wp.cyan}, ${wp.sky}, ${wp.indigo}, transparent)`,
            boxShadow: `0 0 30px ${wp.cyan}66`,
          }}
        />

        {/* Role */}
        <div
          style={{
            marginTop: 32,
            fontFamily: interFamily,
            fontSize: 46,
            fontWeight: 400,
            letterSpacing: 0.4,
            color: wp.muted,
            opacity: roleIn,
            transform: `translateY(${interpolate(roleIn, [0, 1], [22, 0])}px)`,
          }}
        >
          WordPress{" "}
          <span style={{ color: wp.ink, fontWeight: 600 }}>Developer</span>
        </div>

        {/* Site */}
        <div
          style={{
            marginTop: 22,
            fontFamily: codeFamily,
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "lowercase",
            color: wp.cyan,
            opacity: siteIn * 0.9,
            transform: `translateY(${interpolate(siteIn, [0, 1], [16, 0])}px)`,
          }}
        >
          mufaqar.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
