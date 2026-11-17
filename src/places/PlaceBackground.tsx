import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { palette } from "./theme";

/** Cheap deterministic noise so frames render identically every time. */
const hash = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const DUST = Array.from({ length: 64 }, (_, i) => ({
  x: hash(i + 1) * 100,
  y: hash(i + 41) * 100,
  size: 1 + hash(i + 91) * 2.6,
  speed: 0.12 + hash(i + 13) * 0.34,
  phase: hash(i + 71) * Math.PI * 2,
}));

/**
 * Deep navy field with two slow aurora blooms, a hairline grid, drifting dust
 * and a vignette. Shared by every scene in the places story.
 */
export const PlaceBackground: React.FC<{ durationInFrames?: number }> = ({
  durationInFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bgDeep, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 18% ${16 + t * 6}%, rgba(59,130,246,0.20) 0%, rgba(59,130,246,0) 62%),
            radial-gradient(100% 70% at 86% ${78 - t * 8}%, rgba(255,215,0,0.10) 0%, rgba(255,215,0,0) 60%),
            linear-gradient(180deg, ${palette.bg} 0%, ${palette.bgDeep} 68%, #02040A 100%)`,
        }}
      />

      {/* hairline grid */}
      <AbsoluteFill
        style={{
          opacity: 0.16,
          backgroundImage:
            "linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(0deg, rgba(148,163,184,0.10) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          transform: `translateY(${interpolate(t, [0, 1], [0, -26])}px)`,
          maskImage:
            "radial-gradient(80% 62% at 50% 40%, #000 0%, rgba(0,0,0,0.35) 62%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 62% at 50% 40%, #000 0%, rgba(0,0,0,0.35) 62%, transparent 100%)",
        }}
      />

      {DUST.map((d, i) => {
        const y = (d.y - t * d.speed * 34 + 100) % 100;
        const twinkle = 0.22 + 0.5 * Math.abs(Math.sin(d.phase + t * 3.4));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${d.x}%`,
              top: `${y}%`,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: i % 5 === 0 ? palette.goldSoft : "#CBD5E1",
              opacity: twinkle,
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(74% 58% at 50% 44%, rgba(2,4,10,0) 0%, rgba(2,4,10,0.42) 74%, rgba(2,4,10,0.86) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
