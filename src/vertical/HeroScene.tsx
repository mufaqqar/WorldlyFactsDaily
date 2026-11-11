import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HERO_FRAMES } from "./timeline";
import { codeFamily, displayFamily, interFamily, nameGradient, wp } from "../mufaqar/theme";

const NAME_LINES = ["Mufaqar", "Islam"];

const Monogram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay: 2,
    durationInFrames: 34,
    config: { damping: 16, stiffness: 120 },
  });

  const pulse = 0.5 + 0.5 * Math.sin(frame / 18);

  return (
    <div
      style={{
        position: "relative",
        width: 208,
        height: 208,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        scale: interpolate(enter, [0, 1], [0.72, 1]),
      }}
    >
      {/* Rotating dashed ring */}
      <svg
        width={208}
        height={208}
        viewBox="0 0 208 208"
        style={{ position: "absolute", inset: 0, rotate: `${frame * 0.5}deg` }}
      >
        <circle
          cx="104"
          cy="104"
          r="96"
          fill="none"
          stroke={`${wp.cyan}55`}
          strokeWidth="1.4"
          strokeDasharray="3 11"
        />
      </svg>

      {/* Halo */}
      <div
        style={{
          position: "absolute",
          width: 190,
          height: 190,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${wp.cyan}30 0%, transparent 68%)`,
          filter: "blur(14px)",
          opacity: 0.5 + pulse * 0.5,
        }}
      />

      {/* Medallion */}
      <div
        style={{
          width: 136,
          height: 136,
          borderRadius: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(165,243,252,0.3)",
          background:
            "linear-gradient(160deg, rgba(120,210,255,0.22), rgba(99,102,241,0.14))",
          boxShadow: `0 26px 70px rgba(0,0,0,0.55), 0 0 60px ${wp.cyan}30, inset 0 1px 0 rgba(220,245,255,0.28)`,
        }}
      >
        <span
          style={{
            fontFamily: displayFamily,
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: -2,
            background: nameGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          MI
        </span>
      </div>
    </div>
  );
};

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: HERO_FRAMES - 20,
    durationInFrames: 20,
    config: { damping: 200 },
  });

  const ruleIn = spring({
    frame,
    fps,
    delay: 40,
    durationInFrames: 34,
    config: { damping: 200 },
  });

  const roleIn = spring({
    frame,
    fps,
    delay: 48,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  const placeIn = spring({
    frame,
    fps,
    delay: 58,
    durationInFrames: 28,
    config: { damping: 200 },
  });

  const badgeIn = spring({
    frame,
    fps,
    delay: 70,
    durationInFrames: 30,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        paddingBottom: 80,
        opacity: 1 - exit,
        scale: interpolate(exit, [0, 1], [1, 1.05]),
        translate: interpolate(exit, [0, 1], ["0px 0px", "0px -40px"]),
      }}
    >
      <Monogram />

      {/* Name */}
      <div
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {NAME_LINES.map((line, lineIndex) => (
          <div
            key={line}
            style={{
              display: "flex",
              fontFamily: displayFamily,
              fontSize: 152,
              fontWeight: 700,
              letterSpacing: -7,
              lineHeight: 0.96,
            }}
          >
            {line.split("").map((letter, i) => {
              const enter = spring({
                frame,
                fps,
                delay: 8 + lineIndex * 8 + i * 2.6,
                durationInFrames: 34,
                config: { damping: 16, stiffness: 130 },
              });

              return (
                <span
                  key={`${letter}-${i}`}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(1, enter * 1.6),
                    translate: interpolate(enter, [0, 1], ["0px 120px", "0px 0px"]),
                    rotate: interpolate(enter, [0, 1], ["6deg", "0deg"]),
                    background: nameGradient,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    filter: "drop-shadow(0 18px 44px rgba(34,211,238,0.32))",
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Accent rule */}
      <div
        style={{
          marginTop: 26,
          height: 5,
          width: 420,
          borderRadius: 99,
          scale: `${ruleIn} 1`,
          background: `linear-gradient(90deg, transparent, ${wp.cyan}, ${wp.sky}, ${wp.indigo}, transparent)`,
          boxShadow: `0 0 30px ${wp.cyan}66`,
        }}
      />

      {/* Role */}
      <div
        style={{
          marginTop: 34,
          fontFamily: codeFamily,
          fontSize: 26,
          letterSpacing: 3.4,
          textTransform: "uppercase",
          color: "#c8e8fa",
          opacity: roleIn * 0.95,
          translate: interpolate(roleIn, [0, 1], ["0px 20px", "0px 0px"]),
          textAlign: "center",
        }}
      >
        WordPress <span style={{ color: wp.cyan }}>·</span> React{" "}
        <span style={{ color: wp.cyan }}>·</span> Next.js{" "}
        <span style={{ color: wp.cyan }}>·</span> PHP
      </div>

      {/* Location */}
      <div
        style={{
          marginTop: 26,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: interFamily,
          fontSize: 30,
          color: wp.muted,
          opacity: placeIn,
          translate: interpolate(placeIn, [0, 1], ["0px 16px", "0px 0px"]),
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
            stroke={wp.cyan}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="2.6" stroke={wp.cyan} strokeWidth="1.8" />
        </svg>
        Lahore, Pakistan
        <span style={{ opacity: 0.5 }}>·</span>
        <span style={{ fontSize: 26, color: "#8fa6c2" }}>worldwide</span>
      </div>

      {/* Availability badge */}
      <div
        style={{
          marginTop: 44,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 26px",
          borderRadius: 999,
          border: "1px solid rgba(52,211,153,0.35)",
          backgroundColor: "rgba(52,211,153,0.1)",
          fontFamily: codeFamily,
          fontSize: 20,
          letterSpacing: 3.4,
          textTransform: "uppercase",
          color: "#c7f5e4",
          opacity: badgeIn,
          scale: interpolate(badgeIn, [0, 1], [0.9, 1]),
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            backgroundColor: wp.mint,
            boxShadow: `0 0 14px ${wp.mint}`,
          }}
        />
        Available for freelance
      </div>
    </AbsoluteFill>
  );
};
