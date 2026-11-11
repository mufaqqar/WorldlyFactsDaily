import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../fonts";

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

const DOTS = new Array(46).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 1) * 100,
  top: pseudoRandom(i + 51) * 100,
  size: 1 + pseudoRandom(i + 101) * 2.4,
  phase: pseudoRandom(i + 151) * Math.PI * 2,
  speed: 0.03 + pseudoRandom(i + 201) * 0.05,
}));

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const sway = (amount: number, speed: number, offset = 0) =>
    Math.sin(seconds * speed + offset) * amount;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(155deg, ${colors.bg} 0%, ${colors.bgAlt} 52%, #070a18 100%)`,
        }}
      />

      {/* Slow moving colour glows */}
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -320 + sway(70, 0.31),
          top: -420 + sway(50, 0.24, 1.4),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.violet}55 0%, ${colors.violet}18 42%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          right: -260 + sway(60, 0.27, 2.1),
          bottom: -380 + sway(40, 0.35, 0.6),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.blue}4d 0%, ${colors.blue}14 45%, transparent 72%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 640,
          height: 640,
          left: 1180 + sway(50, 0.4, 3.4),
          top: 120 + sway(46, 0.3, 2.7),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.pink}40 0%, ${colors.pink}10 48%, transparent 74%)`,
          filter: "blur(50px)",
        }}
      />

      {/* Perspective grid */}
      <AbsoluteFill
        style={{
          perspective: 1200,
          opacity: 0.55,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-25%",
            right: "-25%",
            bottom: "-18%",
            height: "72%",
            transform: "rotateX(64deg)",
            transformOrigin: "50% 100%",
            backgroundImage: `
              linear-gradient(to right, rgba(148,163,255,0.16) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148,163,255,0.16) 1px, transparent 1px)
            `,
            backgroundSize: "96px 96px",
            backgroundPosition: `0px ${(frame * 0.9) % 96}px`,
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, transparent 88%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, transparent 88%)",
          }}
        />
      </AbsoluteFill>

      {/* Twinkling dots */}
      {DOTS.map((dot, i) => {
        const twinkle =
          0.18 + 0.55 * (0.5 + 0.5 * Math.sin(dot.phase + frame * dot.speed));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              backgroundColor: i % 4 === 0 ? colors.blue : colors.ink,
              opacity: twinkle,
              boxShadow:
                i % 4 === 0 ? `0 0 12px ${colors.blue}99` : "0 0 8px #ffffff66",
            }}
          />
        );
      })}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(2,3,10,0.55) 78%, rgba(2,3,10,0.9) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
