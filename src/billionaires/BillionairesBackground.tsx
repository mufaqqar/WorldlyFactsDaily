import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, palette } from "./theme";

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const DOLLARS = new Array(16).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 5) * 104 - 2,
  top: pseudoRandom(i + 61) * 100,
  size: 34 + pseudoRandom(i + 113) * 120,
  speed: 0.22 + pseudoRandom(i + 167) * 0.6,
  phase: pseudoRandom(i + 211) * 6.28,
  rotate: (pseudoRandom(i + 257) - 0.5) * 30,
}));

const DUST = new Array(44).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 13) * 100,
  size: 1.2 + pseudoRandom(i + 73) * 2.4,
  speed: 0.35 + pseudoRandom(i + 127) * 1.25,
  phase: pseudoRandom(i + 181) * 100,
  drift: (pseudoRandom(i + 233) - 0.5) * 60,
  blue: i % 4 === 0,
}));

const TICKER = [
  "TESLA",
  "SPACEX",
  "AMAZON",
  "GOOGLE",
  "META",
  "ORACLE",
  "LVMH",
  "NVIDIA",
  "INDITEX",
  "BERKSHIRE",
];

const MARKET_PATH =
  "M0 520 L54 486 L108 498 L162 452 L216 468 L270 410 L324 430 L378 366 L432 392 L486 338 L540 356 L594 296 L648 320 L702 264 L756 292 L810 238 L864 268 L918 214 L972 240 L1026 186 L1080 208";

export const BillionairesBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const sway = (amount: number, speed: number, offset = 0) =>
    Math.sin(seconds * speed + offset) * amount;

  const chartProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tickerOffset = (frame * 1.15) % 720;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(168deg, ${palette.bg} 0%, ${palette.bgAlt} 58%, ${palette.bgDeep} 100%)`,
        }}
      />

      {/* gold aurora */}
      <div
        style={{
          position: "absolute",
          width: 1260,
          height: 1260,
          left: -520 + sway(46, 0.18),
          top: -640 + sway(34, 0.14, 1.2),
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,215,0,0.18) 0%, rgba(255,215,0,0.05) 44%, transparent 70%)`,
          filter: "blur(72px)",
        }}
      />

      {/* electric blue aurora */}
      <div
        style={{
          position: "absolute",
          width: 1180,
          height: 1180,
          right: -560 + sway(40, 0.22, 2.4),
          bottom: -600 + sway(30, 0.17, 0.5),
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.06) 46%, transparent 72%)`,
          filter: "blur(76px)",
        }}
      />

      {/* rotating halo behind the portrait */}
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          left: -210,
          top: 70,
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.12) 18deg, transparent 42deg, transparent 180deg, rgba(59,130,246,0.12) 200deg, transparent 226deg)",
          filter: "blur(2px)",
          opacity: 0.26,
          rotate: `${seconds * 4.2}deg`,
          maskImage:
            "radial-gradient(circle, transparent 42%, black 52%, black 68%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 42%, black 52%, black 68%, transparent 78%)",
        }}
      />

      {/* fine grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "108px 108px",
          backgroundPosition: `${(frame * 0.12) % 108}px ${(frame * 0.2) % 108}px`,
          maskImage:
            "radial-gradient(ellipse 82% 66% at 50% 44%, black 12%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 82% 66% at 50% 44%, black 12%, transparent 80%)",
          opacity: 0.52,
        }}
      />

      {/* market line */}
      <svg
        viewBox="0 0 1080 600"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 70,
          width: 1080,
          height: 600,
          opacity: 0.1,
        }}
      >
        <defs>
          <linearGradient id="marketFill" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#FFD700" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${MARKET_PATH} L1080 600 L0 600 Z`}
          fill="url(#marketFill)"
          opacity={chartProgress * 0.5}
        />
        <path
          d={MARKET_PATH}
          fill="none"
          stroke="#FFD700"
          strokeWidth="2.2"
          strokeLinejoin="round"
          pathLength={1000}
          strokeDasharray={1000}
          strokeDashoffset={1000 - chartProgress * 1000}
        />
      </svg>

      {/* floating dollar signs */}
      {DOLLARS.map((dollar, i) => {
        const travel = (dollar.top + frame * dollar.speed * 0.06) % 120;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${dollar.left}%`,
              top: `${travel - 10}%`,
              fontFamily: displayFamily,
              fontSize: dollar.size,
              fontWeight: 700,
              color: "rgba(255,215,0,0.055)",
              rotate: `${dollar.rotate + sway(3, 0.2, dollar.phase)}deg`,
              textShadow: "0 0 30px rgba(255,215,0,0.08)",
            }}
          >
            $
          </div>
        );
      })}

      {/* rising gold dust */}
      {DUST.map((dust, i) => {
        const travel = ((frame * dust.speed + dust.phase * 9) % 1250) / 1250;
        const y = 106 - travel * 112;
        const x = dust.left + Math.sin(travel * 5 + i) * (dust.drift / 100);
        const fade =
          Math.sin(Math.min(1, travel * 1.1) * Math.PI) *
          (0.3 + 0.7 * pseudoRandom(i + 313));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: dust.size,
              height: dust.size,
              borderRadius: "50%",
              backgroundColor: dust.blue ? palette.blueSoft : palette.goldSoft,
              opacity: fade * 0.55,
              boxShadow: dust.blue
                ? "0 0 12px rgba(96,165,250,0.7)"
                : "0 0 14px rgba(255,215,0,0.75)",
            }}
          />
        );
      })}

      {/* subtle diagonal texture */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(120deg, rgba(255,255,255,0.024) 0px, rgba(255,255,255,0.024) 1px, transparent 1px, transparent 18px)",
          opacity: 0.35,
          mixBlendMode: "overlay",
        }}
      />

      {/* ticker strip */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          left: 0,
          right: 0,
          display: "flex",
          gap: 46,
          whiteSpace: "nowrap",
          transform: `translateX(${-tickerOffset}px)`,
          opacity: 0.16,
          fontFamily: displayFamily,
          fontSize: 13,
          letterSpacing: 4,
          color: palette.goldSoft,
        }}
      >
        {[...TICKER, ...TICKER, ...TICKER].map((item, i) => (
          <span key={i}>
            {item}
            <span style={{ color: palette.blue, marginLeft: 46 }}>+</span>
          </span>
        ))}
      </div>

      {/* readability scrims */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,7,15,0.82) 0%, transparent 17%, transparent 72%, rgba(4,7,15,0.78) 92%, rgba(4,7,15,0.96) 100%)",
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 82% 66% at 50% 44%, transparent 26%, rgba(4,7,15,0.42) 72%, rgba(4,7,15,0.9) 100%)",
        }}
      />

      {/* scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, transparent 1px, transparent 6px)",
          opacity: 0.18,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
