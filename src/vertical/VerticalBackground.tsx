import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { codeFamily, wp } from "../mufaqar/theme";

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 91.7 + 47.3) * 24634.6345;
  return value - Math.floor(value);
};

const DOTS = new Array(46).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 3) * 100,
  top: pseudoRandom(i + 53) * 100,
  size: 1.2 + pseudoRandom(i + 103) * 2.2,
  phase: pseudoRandom(i + 153) * Math.PI * 2,
}));

type Chip = {
  fn: string;
  args: string;
  top: string;
  left?: string;
  right?: string;
  rotate: number;
  drift: number;
};

const CHIPS: Chip[] = [
  {
    fn: "add_action",
    args: "'init'",
    top: "14%",
    left: "-6%",
    rotate: -7,
    drift: 0,
  },
  {
    fn: "wp_enqueue_style",
    args: "",
    top: "29%",
    right: "-10%",
    rotate: 6,
    drift: 1.4,
  },
  {
    fn: "use client",
    args: "",
    top: "47%",
    left: "-8%",
    rotate: 4,
    drift: 2.2,
  },
  {
    fn: "getServerSideProps",
    args: "",
    top: "64%",
    right: "-14%",
    rotate: -5,
    drift: 0.7,
  },
  {
    fn: "wc_get_products",
    args: "",
    top: "81%",
    left: "-9%",
    rotate: -3,
    drift: 1.9,
  },
  {
    fn: "the_content",
    args: "",
    top: "91%",
    right: "-4%",
    rotate: 3,
    drift: 1.1,
  },
];

export const VerticalBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const sway = (amount: number, speed: number, offset = 0) =>
    Math.sin(seconds * speed + offset) * amount;

  return (
    <AbsoluteFill style={{ backgroundColor: wp.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(170deg, ${wp.bg} 0%, ${wp.bgAlt} 48%, #040a16 100%)`,
        }}
      />

      {/* Aurora glows */}
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -420 + sway(50, 0.26),
          top: -420 + sway(40, 0.2, 1.2),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${wp.cyan}4a 0%, ${wp.cyan}12 45%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: -420 + sway(46, 0.31, 2.4),
          bottom: -340 + sway(34, 0.24, 0.8),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${wp.indigo}44 0%, ${wp.indigo}12 46%, transparent 72%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 820,
          left: 240 + sway(36, 0.35, 3.1),
          top: 620 + sway(30, 0.28, 1.7),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${wp.blue}2e 0%, transparent 70%)`,
          filter: "blur(70px)",
        }}
      />

      {/* Vertical light column */}
      <div
        style={{
          position: "absolute",
          left: 300 + sway(24, 0.18, 0.4),
          top: -260,
          width: 520,
          height: 2600,
          transform: "rotate(14deg)",
          background: `linear-gradient(180deg, transparent 0%, ${wp.cyan}14 35%, ${wp.indigo}0f 62%, transparent 100%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Dot matrix */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(125,195,255,0.55) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          backgroundPosition: `${(frame * 0.18) % 30}px ${(frame * 0.34) % 30}px`,
          opacity: 0.14,
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 46%, black 10%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 55% at 50% 46%, black 10%, transparent 80%)",
        }}
      />

      {/* Floating code chips */}
      {CHIPS.map((chip) => (
        <div
          key={chip.fn}
          style={{
            position: "absolute",
            top: chip.top,
            left: chip.left,
            right: chip.right,
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid rgba(125,195,255,0.14)",
            background:
              "linear-gradient(180deg, rgba(14,38,66,0.5), rgba(8,20,38,0.34))",
            fontFamily: codeFamily,
            fontSize: 16,
            letterSpacing: 0.4,
            color: "#9fd8f2",
            opacity: 0.26,
            rotate: `${chip.rotate}deg`,
            translate: `0px ${sway(10, 0.55, chip.drift)}px`,
            whiteSpace: "nowrap",
            boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
          }}
        >
          <span style={{ color: wp.cyan, opacity: 0.9 }}>{chip.fn}</span>
          <span>({chip.args});</span>
        </div>
      ))}

      {/* Twinkling dots */}
      {DOTS.map((dot, i) => {
        const twinkle =
          0.12 + 0.5 * (0.5 + 0.5 * Math.sin(dot.phase + frame * 0.06));
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
              backgroundColor: i % 3 === 0 ? wp.cyan : "#dbeafe",
              opacity: twinkle,
              boxShadow:
                i % 3 === 0 ? `0 0 12px ${wp.cyan}99` : "0 0 8px #dbeafe66",
            }}
          />
        );
      })}

      {/* Fine scanlines for texture */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 6px)",
          opacity: 0.28,
          mixBlendMode: "overlay",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 78% 62% at 50% 45%, transparent 30%, rgba(2,5,12,0.45) 74%, rgba(2,5,12,0.9) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
