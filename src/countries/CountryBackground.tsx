import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { palette } from "./theme";

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 91.7 + 47.3) * 24634.6345;
  return value - Math.floor(value);
};

const DOTS = new Array(44).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 3) * 100,
  top: pseudoRandom(i + 53) * 100,
  size: 1.2 + pseudoRandom(i + 103) * 2,
  phase: pseudoRandom(i + 153) * Math.PI * 2,
}));

const Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const R = 300;
  const C = 380;

  return (
    <svg
      width={760}
      height={760}
      viewBox="0 0 760 760"
      style={{ opacity: 0.16, overflow: "visible" }}
    >
      <g stroke={palette.gold} fill="none" strokeWidth="1.1">
        <circle cx={C} cy={C} r={R} opacity="0.9" />
        <circle cx={C} cy={C} r={R * 0.66} opacity="0.35" strokeDasharray="2 8" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const rx = Math.abs(Math.sin(t * 0.28 + (i * Math.PI) / 6)) * R;
          return <ellipse key={i} cx={C} cy={C} rx={rx} ry={R} />;
        })}
        {[-0.72, -0.42, 0, 0.42, 0.72].map((k, i) => {
          const rx = R * Math.sqrt(1 - k * k);
          return (
            <ellipse
              key={i}
              cx={C}
              cy={C + k * R}
              rx={rx}
              ry={rx * 0.2}
              opacity="0.7"
            />
          );
        })}
      </g>
    </svg>
  );
};

export const CountryBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const sway = (amount: number, speed: number, offset = 0) =>
    Math.sin(seconds * speed + offset) * amount;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(170deg, ${palette.bg} 0%, ${palette.bgAlt} 52%, #04070d 100%)`,
        }}
      />

      {/* Gold aurora */}
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -420 + sway(46, 0.22),
          top: -400 + sway(38, 0.19, 1.2),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.gold}33 0%, ${palette.gold}0d 46%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Teal aurora */}
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: -420 + sway(42, 0.27, 2.4),
          bottom: -360 + sway(32, 0.21, 0.8),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.teal}2e 0%, ${palette.teal}0a 46%, transparent 72%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Wireframe globe */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 560,
          rotate: `${Math.sin(seconds * 0.1) * 3}deg`,
        }}
      >
        <Globe />
      </div>

      {/* Dot matrix */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(246,196,83,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: `${(frame * 0.16) % 32}px ${(frame * 0.3) % 32}px`,
          opacity: 0.12,
          maskImage:
            "radial-gradient(ellipse 72% 56% at 50% 46%, black 8%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 56% at 50% 46%, black 8%, transparent 78%)",
        }}
      />

      {/* Twinkling dots */}
      {DOTS.map((dot, i) => {
        const twinkle =
          0.1 + 0.45 * (0.5 + 0.5 * Math.sin(dot.phase + frame * 0.055));
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
              backgroundColor: i % 3 === 0 ? palette.gold : "#dbeafe",
              opacity: twinkle,
              boxShadow:
                i % 3 === 0
                  ? `0 0 12px ${palette.gold}99`
                  : "0 0 8px #dbeafe55",
            }}
          />
        );
      })}

      {/* Scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 6px)",
          opacity: 0.25,
          mixBlendMode: "overlay",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 78% 62% at 50% 45%, transparent 30%, rgba(2,4,9,0.45) 74%, rgba(2,4,9,0.9) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
