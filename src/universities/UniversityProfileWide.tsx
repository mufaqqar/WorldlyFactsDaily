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
import { StudentShareBar } from "./StudentShareBar";
import { StatBox } from "./StatBox";
import { FactCycle } from "./FactCycle";
import { displayFamily, interFamily, palette } from "./theme";

const GOLD_DUST = new Array(22).fill(true).map((_, i) => ({
  left: 120 + ((i * 271) % 1600),
  delay: (i % 11) * 2,
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
  if (name.length >= 16) return 78;
  if (name.length >= 12) return 92;
  if (name.length >= 9) return 104;
  return 118;
};

/**
 * Landscape (1920×1080) chapter. The flag plate takes the left third and the
 * data column runs down the right, with the rotating facts beneath the card.
 */
export const UniversityProfileWide: React.FC<{
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
        translate: `0px ${-24 * exit}px`,
      }}
    >
      {/* per-university accent bloom */}
      <div
        style={{
          position: "absolute",
          left: -260,
          right: -260,
          top: -60,
          height: 900,
          background: `radial-gradient(ellipse 55% 50% at 50% 34%, ${university.accent}26 0%, ${university.accent}09 44%, transparent 72%)`,
          opacity: 0.9,
        }}
      />

      {/* opening transition sweep */}
      {hasSweep ? (
        <div
          style={{
            position: "absolute",
            top: -240,
            bottom: -240,
            left: -620 + sweep * 2900,
            width: 300,
            rotate: "15deg",
            background:
              "linear-gradient(90deg, transparent, rgba(255,248,214,0.14), rgba(59,130,246,0.1), transparent)",
            mixBlendMode: "screen",
          }}
        />
      ) : null}

      {/* oversized rank numeral behind the flag plate */}
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 92,
          width: 940,
          height: 660,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          pointerEvents: "none",
          opacity: enter * 0.95,
        }}
      >
        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 540,
            fontWeight: 700,
            lineHeight: 0.76,
            letterSpacing: -38,
            color: "rgba(255,215,0,0.03)",
            WebkitTextStroke: "2px rgba(255,215,0,0.15)",
            transform: `translateX(${interpolate(enter, [0, 1], [-90, 0])}px) scale(${interpolate(enter, [0, 1], [1.18, 1])})`,
            transformOrigin: "left top",
          }}
        >
          {String(university.rank).padStart(2, "0")}
        </div>
      </div>

      {/* chapter kicker */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 84,
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
            fontSize: 14,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: palette.goldSoft,
          }}
        >
          Countdown · Rank {String(university.rank).padStart(2, "0")} / 10
        </span>
      </div>

      {/* flag plate */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 176,
          width: 800,
          height: 592,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            scale: 1 + (frame / durationInFrames) * 0.045,
            transformOrigin: "center center",
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

      {/* rotating facts beneath the card */}
      <div style={{ opacity: metaIn }}>
        <FactCycle
          facts={[university.descriptor, ...university.facts]}
          durationInFrames={durationInFrames}
          top={800}
          left={84}
          right={1036}
          fontSize={21}
        />
      </div>

      {/* right data column */}
      <div
        style={{
          position: "absolute",
          left: 948,
          top: 146,
          width: 900,
        }}
      >
        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: isFinale ? palette.gold : palette.blueSoft,
            opacity: metaIn * 0.95,
            translate: `0px ${(1 - metaIn) * 14}px`,
          }}
        >
          {university.region}
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 8, marginTop: 4 }}>
          <div
            style={{
              fontFamily: displayFamily,
              fontWeight: 700,
              fontSize: nameSize(university.name),
              lineHeight: 1.02,
              letterSpacing: -3.4,
              color: palette.ink,
              opacity: nameIn,
              translate: `0px ${(1 - nameIn) * 76}px`,
              textShadow: "0 18px 50px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            {university.name}
          </div>
        </div>

        <div
          style={{
            marginTop: 2,
            fontFamily: interFamily,
            fontSize: 20,
            letterSpacing: 0.4,
            color: palette.muted,
            opacity: metaIn * 0.92,
          }}
        >
          {university.tagline} · {university.fullName}
        </div>

        <div style={{ marginTop: 22, opacity: worthIn }}>
          <div
            style={{
              fontFamily: displayFamily,
              fontSize: 11,
              letterSpacing: 4.2,
              textTransform: "uppercase",
              color: palette.muted,
              opacity: 0.85,
            }}
          >
            Total students · 2027
          </div>
          <div style={{ width: "fit-content", marginTop: 2 }}>
            <StudentCounter
              value={university.students}
              fontSize={isFinale ? 88 : 82}
              startFrame={counterStart}
              durationInFrames={counterDuration}
              delay={12}
            />
          </div>
          <div
            style={{
              marginTop: 4,
              fontFamily: interFamily,
              fontSize: 16,
              letterSpacing: 0.5,
              color: palette.muted,
              opacity: 0.86,
            }}
          >
            {compact(university.international)} from abroad ·{" "}
            {compact(university.faculty)} faculty
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <StudentShareBar share={intlShare} delay={isFinale ? 30 : 22} />
        </div>

        <div style={{ marginTop: 20 }}>
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
      </div>

      {isFinale ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 790,
              left: 948,
              width: 900,
              opacity: metaIn,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: displayFamily,
                fontSize: 13,
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
          {GOLD_DUST.map((dust, index) => {
            const travel = ((frame * dust.speed + dust.delay * 14) % 900) / 900;
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: dust.left + Math.sin(travel * 6 + index) * 26,
                  top: 820 - travel * 640,
                  width: dust.size,
                  height: dust.size,
                  borderRadius: 99,
                  backgroundColor: palette.goldSoft,
                  opacity: Math.sin(travel * Math.PI) * 0.5,
                  boxShadow: "0 0 12px rgba(255,215,0,0.85)",
                }}
              />
            );
          })}
        </>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,215,0,0.03) 0%, transparent 22%, transparent 76%, ${university.accent}0a 100%)`,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};
