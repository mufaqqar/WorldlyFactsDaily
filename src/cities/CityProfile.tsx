import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { City } from "./data";
import { TOP_INDEX } from "./data";
import { CityCard } from "./CityCard";
import { CityProgressBar } from "./CityProgressBar";
import { CityRankWatermark } from "./CityRankWatermark";
import { IndexCounter } from "./IndexCounter";
import { displayFamily, goldGradient, interFamily, palette } from "./theme";

export const GoldPin: React.FC<{ size: number; style?: React.CSSProperties }> = ({
  size,
  style,
}) => (
  <svg
    width={size}
    height={size * 1.2}
    viewBox="0 0 100 120"
    fill="none"
    style={style}
  >
    <path
      d="M50 6C28.5 6 11 23.5 11 45c0 27.8 39 69 39 69s39-41.2 39-69C89 23.5 71.5 6 50 6Z"
      fill="url(#pinFill)"
      stroke="#5C3A05"
      strokeWidth="1.6"
    />
    <circle cx="50" cy="45" r="17" fill="#0B1120" />
    <circle cx="50" cy="45" r="11" fill="url(#pinFill)" />
    <defs>
      <linearGradient id="pinFill" x1="50" y1="6" x2="50" y2="114">
        <stop stopColor="#FFF9D8" />
        <stop offset="0.42" stopColor="#FFD700" />
        <stop offset="1" stopColor="#B8860B" />
      </linearGradient>
    </defs>
  </svg>
);

const GOLD_DUST = new Array(20).fill(true).map((_, i) => ({
  left: 90 + ((i * 137) % 900),
  delay: (i % 10) * 2,
  size: 2 + ((i * 7) % 4),
  speed: 0.5 + ((i * 17) % 10) / 10,
}));

const StatBox: React.FC<{
  label: string;
  value: number;
  accent: string;
  max: number;
}> = ({ label, value, accent, max }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    delay: 26,
    durationInFrames: 22,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        flex: 1,
        padding: "14px 18px 13px",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.085)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.012))",
        boxShadow: "0 16px 34px rgba(0,0,0,0.28)",
        opacity: enter,
        translate: `0px ${(1 - enter) * 18}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: displayFamily,
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: 2.8,
            textTransform: "uppercase",
            color: palette.muted,
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            backgroundColor: accent,
            boxShadow: `0 0 10px ${accent}`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: displayFamily,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -0.8,
          fontVariantNumeric: "tabular-nums",
          color: palette.ink,
        }}
      >
        {value.toFixed(1)}
      </div>
      <div
        style={{
          marginTop: 7,
          height: 3,
          borderRadius: 99,
          backgroundColor: "rgba(148,163,184,0.16)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, (value / max) * 100)}%`,
            borderRadius: 99,
            background: goldGradient,
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
};

export const CityProfile: React.FC<{
  city: City;
  durationInFrames: number;
  variant: number;
  isFinale?: boolean;
}> = ({ city, durationInFrames, variant, isFinale = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitDelay = durationInFrames - (isFinale ? 15 : 11);
  const exit = spring({
    frame,
    fps,
    delay: exitDelay,
    durationInFrames: isFinale ? 15 : 11,
    config: { damping: 200 },
  });

  const enter = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 24,
    config: { damping: 17, stiffness: 115 },
  });

  const nameIn = spring({
    frame,
    fps,
    delay: 6,
    durationInFrames: 26,
    config: { damping: 18, stiffness: 120 },
  });

  const worthIn = spring({
    frame,
    fps,
    delay: 12,
    durationInFrames: 26,
    config: { damping: 18, stiffness: 120 },
  });

  const metaIn = spring({
    frame,
    fps,
    delay: 19,
    durationInFrames: 24,
    config: { damping: 200 },
  });

  const flagIn = spring({
    frame,
    fps,
    delay: 23,
    durationInFrames: 24,
    config: { damping: 15, stiffness: 130 },
  });

  const hasSweep = variant % 2 === 0;
  const sweep = interpolate(frame, [2, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const kenBurns = 1.025 + (frame / Math.max(1, durationInFrames)) * 0.075;
  const shine = interpolate(
    frame,
    [isFinale ? 30 : 14, isFinale ? 78 : 54],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const rankPulse = Math.sin((frame / fps) * 2.6) * 0.5 + 0.5;

  const counterStart = isFinale ? 40 : 10;
  const counterDuration = isFinale ? 64 : Math.min(42, durationInFrames - 34);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: 1 + exit * 0.012,
        translate: `0px ${-28 * exit}px`,
      }}
    >
      {/* per-city accent bloom */}
      <div
        style={{
          position: "absolute",
          left: -160,
          right: -160,
          top: 90,
          height: 1080,
          background: `radial-gradient(ellipse 55% 46% at 50% 34%, ${city.accent}2b 0%, ${city.accent}0a 42%, transparent 72%)`,
          filter: "blur(28px)",
          opacity: 0.9,
        }}
      />

      {/* opening transition sweep */}
      {hasSweep ? (
        <div
          style={{
            position: "absolute",
            top: -260,
            bottom: -260,
            left: -760 + sweep * 2500,
            width: 280,
            rotate: "17deg",
            background:
              "linear-gradient(90deg, transparent, rgba(255,248,214,0.16), rgba(59,130,246,0.12), transparent)",
            filter: "blur(26px)",
            mixBlendMode: "screen",
          }}
        />
      ) : null}

      <CityRankWatermark rank={city.rank} variant={variant} />

      <div
        style={{
          position: "absolute",
          top: 128,
          left: 66,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: enter * 0.92,
          translate: `0px ${(1 - enter) * 14}px`,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            backgroundColor: palette.gold,
            boxShadow: "0 0 14px rgba(255,215,0,0.9)",
          }}
        />
        <span
          style={{
            fontFamily: displayFamily,
            fontSize: 15,
            letterSpacing: 4.2,
            textTransform: "uppercase",
            color: palette.goldSoft,
          }}
        >
          Countdown · Rank {String(city.rank).padStart(2, "0")} / 10
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: isFinale ? 206 : 196,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CityCard
          city={city}
          enter={enter}
          kenBurns={kenBurns}
          shine={shine}
          flagIn={flagIn}
          frame={frame}
          rankPulse={rankPulse}
        />
      </div>

      {isFinale ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 118,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: enter,
              translate: `0px ${interpolate(enter, [0, 1], [-24, 0])}px`,
              filter: "drop-shadow(0 14px 30px rgba(255,215,0,0.35))",
            }}
          >
            <GoldPin size={78} />
          </div>
          {GOLD_DUST.map((dust, index) => {
            const travel = ((frame * dust.speed + dust.delay * 14) % 900) / 900;
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: dust.left + Math.sin(travel * 6 + index) * 22,
                  top: 900 - travel * 760,
                  width: dust.size,
                  height: dust.size,
                  borderRadius: 99,
                  backgroundColor: palette.goldSoft,
                  opacity: Math.sin(travel * Math.PI) * 0.6,
                  boxShadow: "0 0 12px rgba(255,215,0,0.85)",
                }}
              />
            );
          })}
        </>
      ) : null}

      {/* city name */}
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 56,
          right: 56,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 14,
            letterSpacing: 5.4,
            textTransform: "uppercase",
            color: isFinale ? palette.gold : palette.blueSoft,
            opacity: metaIn * 0.95,
            translate: `0px ${(1 - metaIn) * 14}px`,
          }}
        >
          {isFinale ? "No. 1 · Switzerland" : city.region}
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 12, marginTop: 6 }}>
          <div
            style={{
              fontFamily: displayFamily,
              fontWeight: 700,
              fontSize: city.name.length > 10 ? 74 : 86,
              lineHeight: 1.02,
              letterSpacing: -2.8,
              color: palette.ink,
              opacity: nameIn,
              translate: `0px ${(1 - nameIn) * 78}px`,
              textShadow: "0 18px 50px rgba(0,0,0,0.6)",
            }}
          >
            {city.name}
          </div>
        </div>
      </div>

      {/* cost index */}
      <div
        style={{
          position: "absolute",
          top: 968,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: worthIn,
        }}
      >
        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: palette.muted,
            opacity: 0.85,
          }}
        >
          Cost of living index
        </div>
        <IndexCounter
          value={city.index}
          fontSize={isFinale ? 156 : 146}
          startFrame={counterStart}
          durationInFrames={counterDuration}
          delay={12}
        />
      </div>

      {/* comparison rail */}
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 92,
          right: 92,
        }}
      >
        <CityProgressBar
          value={city.index}
          max={TOP_INDEX}
          delay={isFinale ? 28 : 22}
        />
      </div>

      {/* sub-indices */}
      <div
        style={{
          position: "absolute",
          top: 1272,
          left: 92,
          right: 92,
        }}
      >
        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 10,
            letterSpacing: 3.2,
            textTransform: "uppercase",
            color: palette.mutedDeep,
            marginBottom: 10,
            opacity: metaIn,
          }}
        >
          Sub-indices · New York = 100
        </div>
        <div style={{ display: "flex", gap: 14, opacity: metaIn }}>
          <StatBox
            label="Rent"
            value={city.rent}
            accent={city.accent}
            max={140}
          />
          <StatBox
            label="Groceries"
            value={city.groceries}
            accent={city.accent}
            max={140}
          />
          <StatBox
            label="Dining"
            value={city.dining}
            accent={city.accent}
            max={140}
          />
        </div>
      </div>

      {/* descriptor */}
      <div
        style={{
          position: "absolute",
          top: 1442,
          left: 110,
          right: 110,
          textAlign: "center",
          fontFamily: interFamily,
          fontSize: 23,
          lineHeight: 1.46,
          color: "#B9C6D8",
          opacity: metaIn * 0.9,
          translate: `0px ${(1 - metaIn) * 16}px`,
        }}
      >
        {city.descriptor}
      </div>

      {isFinale ? (
        <div
          style={{
            position: "absolute",
            top: 1568,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: metaIn,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: displayFamily,
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: palette.goldSoft,
            }}
          >
            <span style={{ color: palette.gold }}>★</span>
            The most expensive city on Earth
            <span style={{ color: palette.gold }}>★</span>
          </div>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,215,0,0.035) 0%, transparent 24%, transparent 74%, ${city.accent}0a 100%)`,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

export const GoldRule: React.FC<{ width?: number }> = ({ width = 220 }) => (
  <div
    style={{
      width,
      height: 2,
      background: goldGradient,
      boxShadow: "0 0 18px rgba(255,215,0,0.55)",
    }}
  />
);
