import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { codeFamily, wp } from "./theme";

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 91.7 + 47.3) * 24634.6345;
  return value - Math.floor(value);
};

const DOTS = new Array(38).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 3) * 100,
  top: pseudoRandom(i + 53) * 100,
  size: 1.2 + pseudoRandom(i + 103) * 2,
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
    top: "9%",
    left: "3%",
    rotate: -6,
    drift: 0,
  },
  {
    fn: "wp_enqueue_style",
    args: "",
    top: "82%",
    left: "5%",
    rotate: 4,
    drift: 1.4,
  },
  {
    fn: "get_template_part",
    args: "'hero'",
    top: "12%",
    right: "3.5%",
    rotate: 5,
    drift: 2.2,
  },
  {
    fn: "wc_get_products",
    args: "",
    top: "84%",
    right: "6%",
    rotate: -4,
    drift: 0.7,
  },
  {
    fn: "the_content",
    args: "",
    top: "89%",
    left: "43%",
    rotate: -2,
    drift: 1.9,
  },
];

export const MufaqarBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const sway = (amount: number, speed: number, offset = 0) =>
    Math.sin(seconds * speed + offset) * amount;

  return (
    <AbsoluteFill style={{ backgroundColor: wp.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(155deg, ${wp.bg} 0%, ${wp.bgAlt} 55%, #050d1c 100%)`,
        }}
      />

      {/* Aurora glows */}
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          left: -380 + sway(60, 0.26),
          top: -520 + sway(44, 0.2, 1.2),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${wp.cyan}4a 0%, ${wp.cyan}14 44%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: -320 + sway(54, 0.31, 2.4),
          bottom: -440 + sway(38, 0.24, 0.8),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${wp.indigo}42 0%, ${wp.indigo}12 46%, transparent 72%)`,
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          left: 620 + sway(40, 0.35, 3.1),
          top: -280 + sway(36, 0.28, 1.7),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${wp.blue}33 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Diagonal light beams */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 1500,
            height: 220,
            left: -320 + i * 560 + sway(30, 0.18, i),
            top: 120 + i * 300 + sway(24, 0.22, i * 1.5),
            transform: `rotate(-24deg)`,
            background: `linear-gradient(90deg, transparent 0%, ${
              i % 2 === 0 ? wp.cyan : wp.indigo
            }12 45%, transparent 100%)`,
            filter: "blur(26px)",
          }}
        />
      ))}

      {/* Dot matrix */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(125,195,255,0.55) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: `${(frame * 0.22) % 32}px ${(frame * 0.4) % 32}px`,
          opacity: 0.16,
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 78%)",
        }}
      />

      {/* Floating code chips */}
      {CHIPS.map((chip, i) => (
        <div
          key={chip.fn}
          style={{
            position: "absolute",
            top: chip.top,
            left: chip.left,
            right: chip.right,
            padding: "14px 20px",
            borderRadius: 12,
            border: "1px solid rgba(125,195,255,0.16)",
            background:
              "linear-gradient(180deg, rgba(14,38,66,0.55), rgba(8,20,38,0.4))",
            fontFamily: codeFamily,
            fontSize: 17,
            letterSpacing: 0.4,
            color: "#9fd8f2",
            opacity: 0.34,
            transform: `rotate(${chip.rotate}deg) translateY(${sway(
              9,
              0.55,
              chip.drift,
            )}px)`,
            whiteSpace: "nowrap",
            boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
          }}
        >
          <span style={{ color: wp.cyan, opacity: 0.9 }}>{chip.fn}</span>
          <span>
            ({chip.args});
          </span>
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

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 32%, rgba(2,5,12,0.5) 76%, rgba(2,5,12,0.88) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
