import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedProgressBar } from "./AnimatedProgressBar";
import { PortraitCard } from "./PortraitCard";
import type { Person } from "./data";
import { TOP_WEALTH } from "./data";
import { RankingBadge } from "./RankingBadge";
import { WealthCounter } from "./WealthCounter";
import { displayFamily, goldGradient, interFamily, palette } from "./theme";

export const Crown: React.FC<{ size: number; style?: React.CSSProperties }> = ({
  size,
  style,
}) => (
  <svg
    width={size}
    height={size * 0.8}
    viewBox="0 0 100 80"
    fill="none"
    style={style}
  >
    <path
      d="M10 62 6 24l22 14L50 10l22 28 22-14-4 38H10Z"
      fill="url(#crownFill)"
      stroke="#5C3A05"
      strokeWidth="1.5"
    />
    <rect x="12" y="64" width="76" height="10" rx="3" fill="url(#crownFill)" />
    <circle cx="50" cy="32" r="4" fill="#FFFBEA" />
    <circle cx="20" cy="30" r="2.6" fill="#FFFBEA" />
    <circle cx="80" cy="30" r="2.6" fill="#FFFBEA" />
    <defs>
      <linearGradient id="crownFill" x1="50" y1="8" x2="50" y2="76">
        <stop stopColor="#FFF9D8" />
        <stop offset="0.42" stopColor="#FFD700" />
        <stop offset="1" stopColor="#B8860B" />
      </linearGradient>
    </defs>
  </svg>
);

const GOLD_DUST = new Array(22).fill(true).map((_, i) => ({
  left: 70 + ((i * 137) % 940),
  delay: (i % 11) * 2,
  size: 2 + ((i * 7) % 4),
  drift: ((i * 53) % 80) - 40,
  speed: 0.5 + ((i * 17) % 10) / 10,
}));

export const BillionaireProfile: React.FC<{
  person: Person;
  durationInFrames: number;
  variant: number;
  isFinale?: boolean;
}> = ({ person, durationInFrames, variant, isFinale = false }) => {
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
  const accentX = variant % 2 === 0 ? "50%" : "50%";

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: 1 + exit * 0.012,
        translate: `0px ${-28 * exit}px`,
      }}
    >
      {/* per-person accent bloom */}
      <div
        style={{
          position: "absolute",
          left: -160,
          right: -160,
          top: 90,
          height: 1080,
          background: `radial-gradient(ellipse 55% 46% at ${accentX} 34%, ${person.accent}2b 0%, ${person.accent}0a 42%, transparent 72%)`,
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

      <RankingBadge rank={person.rank} variant={variant} />

      <div
        style={{
          position: "absolute",
          top: 126,
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
          Countdown · Rank {String(person.rank).padStart(2, "0")} / 10
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: isFinale ? 168 : 192,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PortraitCard
          person={person}
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
              top: 94,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: enter,
              translate: `0px ${interpolate(enter, [0, 1], [-24, 0])}px`,
              filter: "drop-shadow(0 14px 30px rgba(255,215,0,0.35))",
            }}
          >
            <Crown size={92} />
          </div>
          {GOLD_DUST.map((dust, index) => {
            const travel =
              ((frame * dust.speed + dust.delay * 14) % 900) / 900;
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: dust.left + Math.sin(travel * 6 + index) * 22,
                  top: 930 - travel * 780,
                  width: dust.size,
                  height: dust.size,
                  borderRadius: 99,
                  backgroundColor: palette.goldSoft,
                  opacity: Math.sin(travel * Math.PI) * 0.65,
                  boxShadow: "0 0 12px rgba(255,215,0,0.85)",
                }}
              />
            );
          })}
        </>
      ) : null}

      {/* name */}
      <div
        style={{
          position: "absolute",
          top: isFinale ? 1000 : 1002,
          left: 56,
          right: 56,
          textAlign: "center",
          opacity: exit > 0 ? 1 : 1,
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
          {isFinale ? "The richest person on Earth" : person.industry}
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 14, marginTop: 6 }}>
          <div
            style={{
              fontFamily: displayFamily,
              fontWeight: 700,
              fontSize: person.name.length > 14 ? 68 : 78,
              lineHeight: 1.02,
              letterSpacing: -2.8,
              color: palette.ink,
              opacity: nameIn,
              translate: `0px ${(1 - nameIn) * 78}px`,
              textShadow: "0 18px 50px rgba(0,0,0,0.6)",
            }}
          >
            {person.name}
            {person.nameSuffix ? (
              <span
                style={{
                  display: "block",
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: 3,
                  color: palette.gold,
                  marginTop: 2,
                }}
              >
                {person.nameSuffix}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* net worth */}
      <div
        style={{
          position: "absolute",
          top: isFinale ? 1138 : 1128,
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
            marginBottom: 0,
            opacity: 0.85,
          }}
        >
          Estimated net worth
        </div>
        <WealthCounter
          value={person.netWorth}
          fontSize={isFinale ? 162 : 146}
          startFrame={counterStart}
          durationInFrames={counterDuration}
          delay={12}
        />
      </div>

      {/* company pill */}
      <div
        style={{
          position: "absolute",
          top: isFinale ? 1352 : 1342,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: metaIn,
          translate: `0px ${(1 - metaIn) * 18}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 24px",
            borderRadius: 999,
            border: `1px solid ${person.accent}55`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))",
            boxShadow: "0 16px 40px rgba(0,0,0,0.32)",
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 99,
              backgroundColor: person.accent,
              boxShadow: `0 0 14px ${person.accent}`,
            }}
          />
          <span
            style={{
              fontFamily: interFamily,
              fontSize: 23,
              fontWeight: 600,
              color: palette.ink,
              letterSpacing: 0.2,
            }}
          >
            {person.company}
          </span>
          <span
            style={{
              width: 1,
              height: 22,
              backgroundColor: "rgba(255,255,255,0.16)",
            }}
          />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: palette.muted,
            }}
          >
            {person.industry}
          </span>
        </div>
      </div>

      {/* wealth scale */}
      <div
        style={{
          position: "absolute",
          top: isFinale ? 1428 : 1418,
          left: 76,
          right: 76,
        }}
      >
        <AnimatedProgressBar
          value={person.netWorth}
          max={TOP_WEALTH}
          delay={isFinale ? 28 : 22}
        />
      </div>

      {/* descriptor */}
      <div
        style={{
          position: "absolute",
          top: isFinale ? 1552 : 1540,
          left: 110,
          right: 110,
          textAlign: "center",
          fontFamily: interFamily,
          fontSize: 24,
          lineHeight: 1.46,
          color: "#B9C6D8",
          opacity: metaIn * 0.9,
          translate: `0px ${(1 - metaIn) * 16}px`,
        }}
      >
        {person.descriptor}
      </div>

      {isFinale ? (
        <div
          style={{
            position: "absolute",
            top: 1618,
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
            Number one · Forbes 2026
            <span style={{ color: palette.gold }}>★</span>
          </div>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,215,0,0.035) 0%, transparent 24%, transparent 74%, ${person.accent}0a 100%)`,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

export const FinaleGlow: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse 70% 45% at 50% 44%, rgba(255,215,0,0.18) 0%, transparent 70%)`,
      pointerEvents: "none",
    }}
  />
);

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
