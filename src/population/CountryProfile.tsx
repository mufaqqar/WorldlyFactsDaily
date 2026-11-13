import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Country } from "./data";
import { CountryCard } from "./CountryCard";
import { PopulationCounter } from "./PopulationCounter";
import { RankWatermark } from "./RankWatermark";
import { ShareBar } from "./ShareBar";
import { displayFamily, goldGradient, interFamily, palette } from "./theme";

export const GlobeIcon: React.FC<{ size: number; style?: React.CSSProperties }> = ({
  size,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    style={style}
  >
    <defs>
      <linearGradient id="globeFill" x1="50" y1="4" x2="50" y2="96">
        <stop stopColor="#FFF9D8" />
        <stop offset="0.42" stopColor="#FFD700" />
        <stop offset="1" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="44" stroke="url(#globeFill)" strokeWidth="3" />
    <ellipse cx="50" cy="50" rx="20" ry="44" stroke="url(#globeFill)" strokeWidth="2" opacity="0.8" />
    <ellipse cx="50" cy="50" rx="37" ry="44" stroke="url(#globeFill)" strokeWidth="1.4" opacity="0.45" />
    <path d="M8 34h84M6 50h88M8 66h84" stroke="url(#globeFill)" strokeWidth="2" opacity="0.75" />
    <circle cx="50" cy="50" r="5" fill="url(#globeFill)" />
  </svg>
);

const GOLD_DUST = new Array(18).fill(true).map((_, i) => ({
  left: 90 + ((i * 137) % 900),
  delay: (i % 9) * 2,
  size: 2 + ((i * 7) % 4),
  speed: 0.5 + ((i * 17) % 10) / 10,
}));

const StatBox: React.FC<{
  label: string;
  value: string;
  accent: string;
  progress: number;
  positive?: boolean;
}> = ({ label, value, accent, progress, positive = true }) => {
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
        padding: "14px 16px 13px",
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
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: palette.muted,
            whiteSpace: "nowrap",
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
            flexShrink: 0,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: displayFamily,
          fontSize: 29,
          fontWeight: 700,
          letterSpacing: -0.8,
          fontVariantNumeric: "tabular-nums",
          color: positive ? palette.ink : "#FCA5A5",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          height: 3,
          borderRadius: 99,
          backgroundColor: "rgba(148,163,184,0.16)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, progress) * 100}%`,
            borderRadius: 99,
            background: positive ? goldGradient : "linear-gradient(90deg,#7F1D1D,#EF4444)",
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
};

export const CountryProfile: React.FC<{
  country: Country;
  durationInFrames: number;
  variant: number;
  isFinale?: boolean;
}> = ({ country, durationInFrames, variant, isFinale = false }) => {
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

  const shine = interpolate(
    frame,
    [isFinale ? 30 : 14, isFinale ? 78 : 54],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const rankPulse = Math.sin((frame / fps) * 2.6) * 0.5 + 0.5;

  const counterStart = isFinale ? 40 : 10;
  const counterDuration = isFinale ? 66 : Math.min(46, durationInFrames - 34);

  const billion = (country.population / 1_000_000_000).toFixed(2);
  const growthPositive = country.growth >= 0;

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: 1 + exit * 0.012,
        translate: `0px ${-28 * exit}px`,
      }}
    >
      {/* per-country accent bloom */}
      <div
        style={{
          position: "absolute",
          left: -160,
          right: -160,
          top: 90,
          height: 1080,
          background: `radial-gradient(ellipse 55% 46% at 50% 34%, ${country.accent}2b 0%, ${country.accent}0a 42%, transparent 72%)`,
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

      <RankWatermark rank={country.rank} variant={variant} />

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
          Countdown · Rank {String(country.rank).padStart(2, "0")} / 10
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
        <CountryCard
          country={country}
          enter={enter}
          shine={shine}
          flagIn={flagIn}
          frame={frame}
          rankPulse={rankPulse}
          isFinale={isFinale}
        />
      </div>

      {isFinale ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 112,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: enter,
              translate: `0px ${interpolate(enter, [0, 1], [-24, 0])}px`,
              filter: "drop-shadow(0 14px 30px rgba(255,215,0,0.35))",
            }}
          >
            <GlobeIcon size={76} />
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

      {/* country name */}
      <div
        style={{
          position: "absolute",
          top: 858,
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
          {country.region}
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 12, marginTop: 6 }}>
          <div
            style={{
              fontFamily: displayFamily,
              fontWeight: 700,
              fontSize: country.name.length > 12 ? 76 : 88,
              lineHeight: 1.02,
              letterSpacing: -2.8,
              color: palette.ink,
              opacity: nameIn,
              translate: `0px ${(1 - nameIn) * 78}px`,
              textShadow: "0 18px 50px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            {country.name}
          </div>
        </div>
      </div>

      {/* population */}
      <div
        style={{
          position: "absolute",
          top: 966,
          left: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: worthIn,
        }}
      >
        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 12,
            letterSpacing: 4.6,
            textTransform: "uppercase",
            color: palette.muted,
            opacity: 0.85,
          }}
        >
          Population · 2026
        </div>
        <PopulationCounter
          value={country.population}
          fontSize={isFinale ? 98 : 92}
          startFrame={counterStart}
          durationInFrames={counterDuration}
          delay={12}
        />
        <div
          style={{
            marginTop: 6,
            fontFamily: interFamily,
            fontSize: 17,
            letterSpacing: 0.6,
            color: palette.muted,
            opacity: 0.86,
          }}
        >
          ≈ {billion} billion people · {country.density.toLocaleString("en-US")} per km²
        </div>
      </div>

      {/* world-share rail */}
      <div
        style={{
          position: "absolute",
          top: 1176,
          left: 92,
          right: 92,
        }}
      >
        <ShareBar value={country.share} delay={isFinale ? 30 : 22} />
      </div>

      {/* key stats */}
      <div
        style={{
          position: "absolute",
          top: 1272,
          left: 78,
          right: 78,
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
          The numbers behind {country.name}
        </div>
        <div style={{ display: "flex", gap: 12, opacity: metaIn }}>
          <StatBox
            label="World share"
            value={`${country.share.toFixed(1)}%`}
            accent={country.accent}
            progress={country.share / 17.8}
          />
          <StatBox
            label="Yearly change"
            value={`${growthPositive ? "+" : ""}${country.growth.toFixed(2)}%`}
            accent={growthPositive ? palette.green : palette.red}
            progress={Math.min(1, Math.abs(country.growth) / 2.6)}
            positive={growthPositive}
          />
          <StatBox
            label="Median age"
            value={country.medianAge.toFixed(1)}
            accent={palette.blueSoft}
            progress={country.medianAge / 50}
          />
        </div>
      </div>

      {/* descriptor */}
      <div
        style={{
          position: "absolute",
          top: 1448,
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
        {country.descriptor}
      </div>

      {isFinale ? (
        <div
          style={{
            position: "absolute",
            top: 1572,
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
            The most populous country on Earth
            <span style={{ color: palette.gold }}>★</span>
          </div>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,215,0,0.035) 0%, transparent 24%, transparent 74%, ${country.accent}0a 100%)`,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};
