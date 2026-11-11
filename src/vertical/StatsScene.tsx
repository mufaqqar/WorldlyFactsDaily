import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { STATS_FRAMES } from "./timeline";
import { codeFamily, displayFamily, wp } from "../mufaqar/theme";

type Stat = {
  value: number;
  label: string;
  accent: string;
};

const STATS: Stat[] = [
  { value: 15, label: "Years in production", accent: wp.cyan },
  { value: 880, label: "Projects delivered", accent: wp.sky },
  { value: 200, label: "Clients served", accent: wp.indigo },
];

const StatRow: React.FC<{ stat: Stat; index: number }> = ({ stat, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay: 20 + index * 10,
    durationInFrames: 42,
    config: { damping: 18, stiffness: 110 },
  });

  const count = Math.round(
    interpolate(frame, [26 + index * 10, 66 + index * 10], [0, stat.value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: enter,
        translate: interpolate(enter, [0, 1], ["0px 60px", "0px 0px"]),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          fontFamily: displayFamily,
          fontWeight: 700,
          fontSize: 164,
          letterSpacing: -6,
          lineHeight: 1,
          background: `linear-gradient(180deg, #ffffff 0%, #d8f4ff 38%, ${stat.accent} 105%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: `drop-shadow(0 16px 44px ${stat.accent}30)`,
        }}
      >
        {count}
        <span
          style={{
            fontSize: 96,
            marginTop: 12,
            marginLeft: 4,
            color: stat.accent,
            WebkitTextFillColor: stat.accent,
          }}
        >
          +
        </span>
      </div>

      <div
        style={{
          marginTop: 6,
          fontFamily: codeFamily,
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: wp.muted,
          opacity: 0.9,
        }}
      >
        {stat.label}
      </div>

      <div
        style={{
          marginTop: 34,
          height: 1,
          width: 640,
          background: `linear-gradient(90deg, transparent, ${stat.accent}77, transparent)`,
          scale: `${enter} 1`,
        }}
      />
    </div>
  );
};

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: STATS_FRAMES - 20,
    durationInFrames: 20,
    config: { damping: 200 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 24,
    config: { damping: 200 },
  });

  const headingIn = spring({
    frame,
    fps,
    delay: 5,
    durationInFrames: 32,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        paddingBottom: 40,
        opacity: 1 - exit,
        translate: interpolate(exit, [0, 1], ["0px 0px", "0px -50px"]),
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
            letterSpacing: 5,
            textTransform: "uppercase",
            color: wp.cyan,
            opacity: kickerIn * 0.9,
            translate: interpolate(kickerIn, [0, 1], ["0px 14px", "0px 0px"]),
          }}
        >
          Track record
        </div>

        <div
          style={{
            marginTop: 20,
            marginBottom: 26,
            fontFamily: displayFamily,
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: -2.4,
            color: wp.ink,
            opacity: headingIn,
            translate: interpolate(headingIn, [0, 1], ["0px 30px", "0px 0px"]),
            textAlign: "center",
          }}
        >
          Proof, not promises.
        </div>

        {STATS.map((stat, i) => (
          <StatRow key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
