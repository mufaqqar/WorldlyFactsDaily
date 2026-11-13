import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COUNTRIES } from "./data";
import { displayFamily, palette } from "./theme";

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const compact = (population: number) =>
  `${(population / 1_000_000_000).toFixed(2)}B`;

const NUMBERS = COUNTRIES.map((country, i) => ({
  label: compact(country.population),
  left: pseudoRandom(i + 5) * 88 + 2,
  top: pseudoRandom(i + 61) * 100,
  size: 34 + pseudoRandom(i + 113) * 92,
  speed: 0.22 + pseudoRandom(i + 167) * 0.6,
  phase: pseudoRandom(i + 211) * 6.28,
  drift: (pseudoRandom(i + 257) - 0.5) * 24,
}));

const DUST = new Array(44).fill(true).map((_, i) => ({
  left: pseudoRandom(i + 13) * 100,
  size: 1.2 + pseudoRandom(i + 73) * 2.4,
  speed: 0.35 + pseudoRandom(i + 127) * 1.25,
  phase: pseudoRandom(i + 181) * 100,
  drift: (pseudoRandom(i + 233) - 0.5) * 60,
  blue: i % 4 === 0,
}));

// Latitude / longitude lattice for the wireframe globe.
const GLOBE_POINTS = (() => {
  const points: { lat: number; lon: number }[] = [];
  for (let lat = -80; lat <= 80; lat += 10) {
    for (let lon = 0; lon < 360; lon += 10) {
      points.push({ lat, lon });
    }
  }
  return points;
})();

const GLOBE_CX = 540;
const GLOBE_CY = 830;
const GLOBE_R = 520;

const TICKER = COUNTRIES.map((country) => country.name.toUpperCase());

export const PopulationBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const sway = (amount: number, speed: number, offset = 0) =>
    Math.sin(seconds * speed + offset) * amount;

  const tickerOffset = (frame * 1.15) % 760;
  const rotation = seconds * 0.16;

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
          background:
            "radial-gradient(circle, rgba(255,215,0,0.18) 0%, rgba(255,215,0,0.05) 44%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      {/* ocean-blue aurora */}
      <div
        style={{
          position: "absolute",
          width: 1180,
          height: 1180,
          right: -560 + sway(40, 0.22, 2.4),
          bottom: -600 + sway(30, 0.17, 0.5),
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(59,130,246,0.08) 46%, transparent 72%)",
          filter: "blur(76px)",
        }}
      />

      {/* planet glow behind the wireframe globe */}
      <div
        style={{
          position: "absolute",
          width: 1120,
          height: 1120,
          left: GLOBE_CX - 560,
          top: GLOBE_CY - 560,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.16) 0%, rgba(59,130,246,0.08) 42%, rgba(255,215,0,0.03) 62%, transparent 72%)",
          filter: "blur(40px)",
        }}
      />

      {/* wireframe globe */}
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          width: 1080,
          height: 1920,
          opacity: 0.62,
        }}
      >
        <defs>
          <linearGradient id="planetRim" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFD700" stopOpacity="0.5" />
            <stop offset="0.55" stopColor="#22D3EE" stopOpacity="0.38" />
            <stop offset="1" stopColor="#FFD700" stopOpacity="0.14" />
          </linearGradient>
        </defs>
        <circle
          cx={GLOBE_CX}
          cy={GLOBE_CY}
          r={GLOBE_R}
          fill="none"
          stroke="url(#planetRim)"
          strokeWidth="1.6"
        />
        {GLOBE_POINTS.map((point, index) => {
          const lat = (point.lat * Math.PI) / 180;
          const lon = (point.lon * Math.PI) / 180 + rotation;
          const x = Math.cos(lat) * Math.sin(lon);
          const y = Math.sin(lat);
          const z = Math.cos(lat) * Math.cos(lon);
          if (z <= 0.02) {
            return null;
          }
          const warm = index % 7 === 0;
          return (
            <circle
              key={index}
              cx={GLOBE_CX + GLOBE_R * x}
              cy={GLOBE_CY - GLOBE_R * y}
              r={1.1 + 1.7 * z}
              fill={warm ? "#FFE98A" : "#7DD3FC"}
              opacity={0.06 + 0.4 * z}
            />
          );
        })}
      </svg>

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
          opacity: 0.42,
        }}
      />

      {/* floating population values */}
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
              color: "rgba(125,211,252,0.05)",
              rotate: `${number.drift + sway(3, 0.2, number.phase)}deg`,
              textShadow: "0 0 30px rgba(34,211,238,0.08)",
            }}
          >
            {number.label}
          </div>
        );
      })}

      {/* rising dust */}
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
              opacity: fade * 0.5,
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
          opacity: 0.14,
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
