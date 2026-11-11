import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { palette } from "./theme";

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const SPARKS = new Array(46).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 7) * 100,
  size: 1.4 + pseudoRandom(i + 71) * 2.6,
  speed: 0.45 + pseudoRandom(i + 131) * 1.5,
  phase: pseudoRandom(i + 197) * 100,
  drift: (pseudoRandom(i + 251) - 0.5) * 26,
  hot: i % 3 !== 0,
}));

const IBeam: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 100 160" style={style} fill="none">
    <path
      d="M8 6h84v14H64v120h28v14H8v-14h28V20H8z"
      stroke={palette.steel}
      strokeWidth="1.6"
      opacity="0.5"
    />
  </svg>
);

export const SteelBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const sway = (amount: number, speed: number, offset = 0) =>
    Math.sin(seconds * speed + offset) * amount;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(168deg, ${palette.bg} 0%, ${palette.bgAlt} 54%, ${palette.bgDeep} 100%)`,
        }}
      />

      {/* Molten furnace glow */}
      <div
        style={{
          position: "absolute",
          width: 1180,
          height: 1180,
          left: -480 + sway(38, 0.21),
          bottom: -560 + sway(26, 0.17, 1.4),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.molten}2e 0%, ${palette.molten}0d 46%, transparent 70%)`,
          filter: "blur(70px)",
        }}
      />

      {/* Cold steel glow */}
      <div
        style={{
          position: "absolute",
          width: 1050,
          height: 1050,
          right: -460 + sway(34, 0.26, 2.2),
          top: -420 + sway(30, 0.19, 0.6),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.blue}26 0%, ${palette.blue}08 48%, transparent 72%)`,
          filter: "blur(70px)",
        }}
      />

      {/* Roller mill verticals */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(219,228,238,0.055) 0px, rgba(219,228,238,0.055) 1px, transparent 1px, transparent 96px)",
          backgroundPosition: `${(frame * 0.22) % 96}px 0px`,
          opacity: 0.55,
          maskImage:
            "linear-gradient(180deg, transparent 6%, black 42%, black 82%, transparent 98%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 6%, black 42%, black 82%, transparent 98%)",
        }}
      />

      {/* Hazard hatch, top band */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 150,
          height: 200,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,107,44,0.16) 0px, rgba(255,107,44,0.16) 2px, transparent 2px, transparent 22px)",
          opacity: 0.35,
          maskImage:
            "linear-gradient(180deg, transparent, black 45%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, black 45%, transparent)",
        }}
      />

      {/* I-beam silhouettes */}
      <IBeam
        style={{
          position: "absolute",
          left: 34,
          top: 620,
          width: 210,
          height: 336,
          opacity: 0.16,
          rotate: `${Math.sin(seconds * 0.12) * 1.6}deg`,
        }}
      />
      <IBeam
        style={{
          position: "absolute",
          right: 22,
          top: 1180,
          width: 170,
          height: 272,
          opacity: 0.1,
          rotate: `${-6 + Math.sin(seconds * 0.1 + 1) * 1.4}deg`,
        }}
      />

      {/* Rising sparks */}
      {SPARKS.map((spark, i) => {
        const travel =
          ((frame * spark.speed + spark.phase * 10) % 1250) / 1250;
        const y = 100 - travel * 108;
        const x = spark.left + Math.sin(travel * 5 + i) * (spark.drift / 100);
        const fade =
          Math.sin(Math.min(1, travel * 1.15) * Math.PI) *
          (0.35 + 0.65 * pseudoRandom(i + 313));

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: spark.size,
              height: spark.size,
              borderRadius: "50%",
              backgroundColor: spark.hot ? palette.ember : palette.steel,
              opacity: fade * 0.85,
              boxShadow: spark.hot
                ? `0 0 14px ${palette.ember}cc`
                : "0 0 10px #dbe4ee77",
            }}
          />
        );
      })}

      {/* Fine grit */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(219,228,238,0.5) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          backgroundPosition: `${(frame * 0.1) % 34}px ${(frame * 0.18) % 34}px`,
          opacity: 0.07,
          maskImage:
            "radial-gradient(ellipse 74% 58% at 50% 48%, black 10%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 74% 58% at 50% 48%, black 10%, transparent 80%)",
        }}
      />

      {/* Scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 6px)",
          opacity: 0.22,
          mixBlendMode: "overlay",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 78% 62% at 50% 46%, transparent 28%, rgba(2,4,7,0.5) 74%, rgba(2,4,7,0.92) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
