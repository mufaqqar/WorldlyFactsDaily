import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { University } from "./data";
import { TOP_FACULTY } from "./data";
import { UniversityCard } from "./UniversityCard";
import { StudentCounter } from "./StudentCounter";
import { RankWatermark } from "./RankWatermark";
import { StudentShareBar } from "./StudentShareBar";
import { StatBox } from "./StatBox";
import { FactCycle } from "./FactCycle";
import { displayFamily, interFamily, palette } from "./theme";

/**
 * An academic crest: a mortarboard and tassel inside a double ring, struck in
 * the same gold as the rest of the series.
 */
export const UniversityEmblem: React.FC<{
  size: number;
  style?: React.CSSProperties;
}> = ({ size, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    style={style}
  >
    <defs>
      <linearGradient id="crestFill" x1="50" y1="4" x2="50" y2="96">
        <stop stopColor="#FFF9D8" />
        <stop offset="0.42" stopColor="#FFD700" />
        <stop offset="1" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <circle
      cx="50"
      cy="50"
      r="42"
      stroke="url(#crestFill)"
      strokeWidth="2.6"
      fill="rgba(255,215,0,0.04)"
    />
    <circle
      cx="50"
      cy="50"
      r="36"
      stroke="url(#crestFill)"
      strokeWidth="1"
      opacity="0.5"
    />
    <path d="M50 30 L78 42 L50 54 L22 42 Z" fill="url(#crestFill)" />
    <path
      d="M32 48 V60 C32 66.5 68 66.5 68 60 V48"
      stroke="url(#crestFill)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M78 42 V58"
      stroke="url(#crestFill)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="78" cy="61" r="3.2" fill="url(#crestFill)" />
    <path
      d="M50 68 L50 74"
      stroke="url(#crestFill)"
      strokeWidth="1.6"
      opacity="0.65"
    />
  </svg>
);

const GOLD_DUST = new Array(18).fill(true).map((_, i) => ({
  left: 90 + ((i * 137) % 900),
  delay: (i % 9) * 2,
  size: 2 + ((i * 7) % 4),
  speed: 0.5 + ((i * 17) % 10) / 10,
}));

const compact = (value: number) =>
  value >= 1_000_000
    ? `${(value / 1_000_000).toFixed(2)}M`
    : value >= 1_000
      ? `${(value / 1_000).toFixed(1)}K`
      : `${value}`;

const ranked = (university: University) =>
  university.joint ? `=${university.qsRank}` : `${university.qsRank}`;

const nameSize = (name: string) => {
  if (name.length >= 16) return 56;
  if (name.length >= 12) return 68;
  if (name.length >= 9) return 78;
  return 90;
};

export const UniversityProfile: React.FC<{
  university: University;
  durationInFrames: number;
  variant: number;
  isFinale?: boolean;
}> = ({ university, durationInFrames, variant, isFinale = false }) => {
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

  const perFaculty = university.students / university.faculty;
  const intlShare = university.international / university.students;

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: 1 + exit * 0.012,
        translate: `0px ${-28 * exit}px`,
      }}
    >
      {/* per-university accent bloom */}
      <div
        style={{
          position: "absolute",
          left: -160,
          right: -160,
          top: 90,
          height: 1080,
          background: `radial-gradient(ellipse 55% 46% at 50% 34%, ${university.accent}2b 0%, ${university.accent}0a 42%, transparent 72%)`,
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

      <RankWatermark rank={university.rank} variant={variant} />

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
          Countdown · Rank {String(university.rank).padStart(2, "0")} / 10
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
        {/* slow push-in keeps long chapters alive without re-triggering motion */}
        <div
          style={{
            scale: 1 + (frame / durationInFrames) * 0.045,
            transformOrigin: "center top",
          }}
        >
          <UniversityCard
            university={university}
            enter={enter}
            shine={shine}
            flagIn={flagIn}
            frame={frame}
            rankPulse={rankPulse}
            isFinale={isFinale}
          />
        </div>
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
            <UniversityEmblem size={76} />
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

      {/* university name */}
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
          {university.region}
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 12, marginTop: 6 }}>
          <div
            style={{
              fontFamily: displayFamily,
              fontWeight: 700,
              fontSize: nameSize(university.name),
              lineHeight: 1.02,
              letterSpacing: -2.8,
              color: palette.ink,
              opacity: nameIn,
              translate: `0px ${(1 - nameIn) * 78}px`,
              textShadow: "0 18px 50px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            {university.name}
          </div>
        </div>
      </div>

      {/* students */}
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
          Total students · 2027
        </div>
        <StudentCounter
          value={university.students}
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
          {compact(university.international)} from abroad · {compact(university.faculty)} faculty
        </div>
      </div>

      {/* international share rail */}
      <div
        style={{
          position: "absolute",
          top: 1176,
          left: 92,
          right: 92,
        }}
      >
        <StudentShareBar share={intlShare} delay={isFinale ? 30 : 22} />
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
          The numbers behind {university.name}
        </div>
        <div style={{ display: "flex", gap: 12, opacity: metaIn }}>
          <StatBox
            label="QS 2027"
            value={ranked(university)}
            accent={university.accent}
            progress={(11 - university.qsRank) / 10}
          />
          <StatBox
            label="Founded"
            value={String(university.founded)}
            accent={palette.gold}
            progress={(2027 - university.founded) / 1000}
          />
          <StatBox
            label="Faculty"
            value={university.faculty.toLocaleString("en-US")}
            accent={palette.blueSoft}
            progress={university.faculty / TOP_FACULTY}
          />
          <StatBox
            label="Students / faculty"
            value={`${perFaculty.toFixed(1)} : 1`}
            accent={palette.green}
            progress={1 - perFaculty / 10}
          />
        </div>
      </div>

      {/* descriptor + rotating facts */}
      <div style={{ opacity: metaIn }}>
        <FactCycle
          facts={[university.descriptor, ...university.facts]}
          durationInFrames={durationInFrames}
          top={1448}
        />
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
            The best university on Earth
            <span style={{ color: palette.gold }}>★</span>
          </div>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,215,0,0.035) 0%, transparent 24%, transparent 74%, ${university.accent}0a 100%)`,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};
