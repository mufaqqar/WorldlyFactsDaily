import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CITIES } from "./data";
import { displayFamily, palette } from "./theme";

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const NUMBERS = CITIES.map((city, i) => ({
  label: city.index.toFixed(1),
  left: pseudoRandom(i + 5) * 96 + 1,
  top: pseudoRandom(i + 61) * 100,
  size: 30 + pseudoRandom(i + 113) * 96,
  speed: 0.22 + pseudoRandom(i + 167) * 0.6,
  phase: pseudoRandom(i + 211) * 6.28,
  rotate: (pseudoRandom(i + 257) - 0.5) * 24,
}));

const DUST = new Array(44).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 13) * 100,
  size: 1.2 + pseudoRandom(i + 73) * 2.4,
  speed: 0.35 + pseudoRandom(i + 127) * 1.25,
  phase: pseudoRandom(i + 181) * 100,
  drift: (pseudoRandom(i + 233) - 0.5) * 60,
  blue: i % 4 === 0,
}));

const SKYLINE =
  "M0 600 L0 470 L40 470 L40 430 L90 430 L90 480 L130 480 L130 390 L170 390 L170 450 L210 450 L210 360 L250 360 L250 420 L300 420 L300 330 L340 330 L340 400 L380 400 L380 300 L420 300 L420 380 L460 380 L460 340 L500 340 L500 410 L545 410 L545 320 L585 320 L585 290 L620 290 L620 370 L660 370 L660 310 L700 310 L700 400 L745 400 L745 350 L790 350 L790 420 L830 420 L830 370 L870 370 L870 450 L910 450 L910 400 L950 400 L950 460 L1000 460 L1000 430 L1040 430 L1040 480 L1080 480 L1080 600 Z";

const TICKER = CITIES.map((city) => city.name.toUpperCase());

export const CitiesBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const sway = (amount: number, speed: number, offset = 0) =>
    Math.sin(seconds * speed + offset) * amount;

  const skylineProgress = interpolate(frame, [0, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tickerOffset = (frame * 1.15) % 760;

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

      {/* rotating halo behind the card */}
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

      {/* city skyline silhouette */}
      <svg
        viewBox="0 0 1080 600"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 40,
          width: 1080,
          height: 600,
          opacity: 0.16,
        }}
      >
        <defs>
          <linearGradient id="skylineFill" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#FFD700" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={SKYLINE}
          fill="url(#skylineFill)"
          opacity={skylineProgress * 0.55}
        />
        <path
          d={SKYLINE.replace(/ L1080 600 Z$/, "")}
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          strokeLinejoin="round"
          pathLength={1000}
          strokeDasharray={1000}
          strokeDashoffset={1000 - skylineProgress * 1000}
          opacity={0.7}
        />
      </svg>

      {/* floating index values */}
      {NUMBERS.map((number, i) => {
        const travel = (number.top + frame * number.speed * 0.06) % 120;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${number.left}%`,
              top: `${travel - 10}%`,
              fontFamily: displayFamily,
              fontSize: number.size,
              fontWeight: 700,
              color: "rgba(255,215,0,0.05)",
              rotate: `${number.rotate + sway(3, 0.2, number.phase)}deg`,
              textShadow: "0 0 30px rgba(255,215,0,0.08)",
            }}
          >
            {number.label}
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
