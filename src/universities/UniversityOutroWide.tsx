import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { UniversityEmblem } from "./UniversityProfile";
import {
  DATA_EDITION,
  DATA_SOURCE,
  TOTAL_STUDENTS,
  UNIVERSITIES,
} from "./data";
import { displayFamily, goldGradient, interFamily, palette } from "./theme";

const CTA = ["FOLLOW", "FOR", "MORE"];

const compact = (value: number) =>
  value >= 1_000
    ? `${(value / 1_000).toFixed(1)}K`
    : `${value}`;

/** Landscape (1920×1080) closer: closing statement left, recap right. */
export const UniversityOutroWide: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: durationInFrames - 10,
    durationInFrames: 10,
    config: { damping: 200 },
  });

  const pinIn = spring({
    frame,
    fps,
    delay: 2,
    durationInFrames: 24,
    config: { damping: 9, stiffness: 140 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 6,
    durationInFrames: 20,
    config: { damping: 200 },
  });

  const lineOneIn = spring({
    frame,
    fps,
    delay: 9,
    durationInFrames: 22,
    config: { damping: 17, stiffness: 120 },
  });

  const lineTwoIn = spring({
    frame,
    fps,
    delay: 14,
    durationInFrames: 24,
    config: { damping: 16, stiffness: 130 },
  });

  const ctaIn = spring({
    frame,
    fps,
    delay: 24,
    durationInFrames: 22,
    config: { damping: 12, stiffness: 150 },
  });

  const footIn = spring({
    frame,
    fps,
    delay: 33,
    durationInFrames: 20,
    config: { damping: 200 },
  });

  const recapIn = spring({
    frame,
    fps,
    delay: 18,
    durationInFrames: 24,
    config: { damping: 16, stiffness: 130 },
  });

  const combined = (TOTAL_STUDENTS / 1000).toFixed(1);
  const top = UNIVERSITIES.slice(-3).reverse();

  const glowPulse =
    0.72 + Math.sin((frame / fps) * 2.4) * 0.18 + (1 - pinIn) * 0.4;

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: 1 + exit * 0.02,
        translate: `0px ${-22 * exit}px`,
      }}
    >
      {/* golden reveal bloom */}
      <div
        style={{
          position: "absolute",
          left: -180,
          right: -180,
          top: 40,
          height: 1000,
          background:
            "radial-gradient(ellipse 48% 44% at 36% 40%, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.05) 46%, transparent 74%)",
          filter: "blur(34px)",
          opacity: glowPulse,
        }}
      />

      {/* left: closing statement */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 0,
          width: 900,
          height: 1080,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 118,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: pinIn,
            scale: interpolate(pinIn, [0, 1], [0.55, 1]),
            rotate: `${interpolate(pinIn, [0, 1], [-8, 0])}deg`,
            filter: "drop-shadow(0 24px 44px rgba(255,215,0,0.4))",
          }}
        >
          <UniversityEmblem size={124} />
        </div>

        <div
          style={{
            position: "absolute",
            top: 268,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: kickerIn,
              translate: `0px ${(1 - kickerIn) * 14}px`,
            }}
          >
            <span
              style={{ width: 44, height: 1, background: "rgba(255,215,0,0.6)" }}
            />
            <span
              style={{
                fontFamily: displayFamily,
                fontSize: 13,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: palette.goldSoft,
                whiteSpace: "nowrap",
              }}
            >
              The countdown ends
            </span>
            <span
              style={{ width: 44, height: 1, background: "rgba(255,215,0,0.6)" }}
            />
          </div>

          <div style={{ marginTop: 22, overflow: "hidden", paddingBottom: 6 }}>
            <div
              style={{
                fontFamily: displayFamily,
                fontWeight: 700,
                fontSize: 50,
                lineHeight: 1,
                letterSpacing: -1,
                color: palette.ink,
                opacity: lineOneIn,
                translate: `0px ${(1 - lineOneIn) * 64}px`,
                textShadow: "0 18px 50px rgba(0,0,0,0.6)",
                whiteSpace: "nowrap",
              }}
            >
              TOGETHER, THEY TEACH
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              fontFamily: displayFamily,
              fontWeight: 700,
              fontSize: 90,
              lineHeight: 0.98,
              letterSpacing: -3,
              background: goldGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: lineTwoIn,
              scale: interpolate(lineTwoIn, [0, 1], [0.86, 1]),
              filter: "drop-shadow(0 20px 50px rgba(255,215,0,0.28))",
              whiteSpace: "nowrap",
            }}
          >
            {combined}K STUDENTS
          </div>

          <div
            style={{
              marginTop: 6,
              fontFamily: displayFamily,
              fontWeight: 600,
              fontSize: 32,
              lineHeight: 1,
              letterSpacing: 6,
              color: palette.ink,
              opacity: lineTwoIn,
              textShadow: "0 18px 50px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            ACROSS TEN UNIVERSITIES
          </div>

          <div
            style={{
              marginTop: 26,
              width: 240,
              height: 2,
              background: goldGradient,
              boxShadow: "0 0 18px rgba(255,215,0,0.55)",
              opacity: ctaIn,
            }}
          />

          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 32px",
              borderRadius: 999,
              border: "1px solid rgba(255,215,0,0.5)",
              background:
                "linear-gradient(180deg, rgba(255,215,0,0.16), rgba(255,215,0,0.04))",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.45), 0 0 40px rgba(255,215,0,0.18)",
              opacity: ctaIn,
              scale: interpolate(ctaIn, [0, 1], [0.9, 1]),
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 99,
                border: "1.5px solid rgba(255,215,0,0.75)",
                color: palette.gold,
                fontFamily: interFamily,
                fontSize: 23,
                fontWeight: 600,
                lineHeight: 1,
                paddingBottom: 2,
              }}
            >
              +
            </span>
            <span
              style={{
                display: "flex",
                gap: 9,
                fontFamily: displayFamily,
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: 4.6,
                color: palette.goldSoft,
              }}
            >
              {CTA.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </span>
          </div>

          <div
            style={{
              marginTop: 20,
              fontFamily: interFamily,
              fontSize: 18,
              letterSpacing: 0.4,
              color: palette.muted,
              opacity: footIn * 0.9,
            }}
          >
            More rankings and data stories every week.
          </div>
        </div>
      </div>

      {/* right: top-of-the-table recap */}
      <div
        style={{
          position: "absolute",
          left: 1032,
          top: 118,
          width: 800,
          height: 616,
          borderRadius: 34,
          border: "1px solid rgba(255,255,255,0.09)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))",
          boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
          padding: "36px 40px",
          opacity: recapIn,
          translate: `0px ${(1 - recapIn) * 26}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{ width: 46, height: 1, background: "rgba(255,215,0,0.45)" }}
          />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 11,
              letterSpacing: 4.2,
              textTransform: "uppercase",
              color: palette.goldSoft,
            }}
          >
            The top of the table
          </span>
          <span
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(255,215,0,0.32), transparent)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {top.map((university) => (
            <div
              key={university.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "22px 0",
                borderTop: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 122,
                  fontFamily: displayFamily,
                  fontSize: 54,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: -2,
                  fontVariantNumeric: "tabular-nums",
                  background: goldGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {university.joint ? "=" : ""}
                {university.qsRank}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: displayFamily,
                    fontSize: 30,
                    fontWeight: 700,
                    letterSpacing: -0.4,
                    color: palette.ink,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {university.name.toUpperCase()}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: displayFamily,
                    fontSize: 11,
                    letterSpacing: 2.6,
                    textTransform: "uppercase",
                    color: palette.muted,
                  }}
                >
                  {university.country} · {compact(university.students)} students
                </div>
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 99,
                  backgroundColor: university.accent,
                  boxShadow: `0 0 12px ${university.accent}`,
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            paddingTop: 22,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: palette.mutedDeep,
            }}
          >
            Combined student body
          </span>
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 26,
              fontVariantNumeric: "tabular-nums",
              color: palette.goldSoft,
            }}
          >
            {TOTAL_STUDENTS.toLocaleString("en-US")}
          </span>
        </div>

        <div
          style={{
            marginTop: 12,
            fontFamily: interFamily,
            fontSize: 13,
            letterSpacing: 0.3,
            color: palette.mutedDeep,
          }}
        >
          Source: {DATA_SOURCE} · {DATA_EDITION}
        </div>
      </div>
    </AbsoluteFill>
  );
};
