import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Crown, GoldRule } from "./BillionaireProfile";
import { DATA_SOURCE, PEOPLE } from "./data";
import {
  displayFamily,
  goldGradient,
  interFamily,
  palette,
} from "./theme";

const CTA = ["FOLLOW", "FOR", "MORE"];

export const OutroScene: React.FC<{ durationInFrames: number }> = ({
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

  const crownIn = spring({
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
    delay: 30,
    durationInFrames: 22,
    config: { damping: 16, stiffness: 130 },
  });

  const champion = PEOPLE[PEOPLE.length - 1];

  const glowPulse =
    0.72 + Math.sin((frame / fps) * 2.4) * 0.18 + (1 - crownIn) * 0.4;

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: 1 + exit * 0.02,
        translate: `0px ${-24 * exit}px`,
      }}
    >
      {/* golden reveal bloom */}
      <div
        style={{
          position: "absolute",
          left: -180,
          right: -180,
          top: 300,
          height: 1080,
          background:
            "radial-gradient(ellipse 52% 42% at 50% 38%, rgba(255,215,0,0.22) 0%, rgba(255,215,0,0.06) 44%, transparent 74%)",
          filter: "blur(30px)",
          opacity: glowPulse,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: crownIn,
          scale: interpolate(crownIn, [0, 1], [0.55, 1]),
          rotate: `${interpolate(crownIn, [0, 1], [-8, 0])}deg`,
          filter: "drop-shadow(0 24px 44px rgba(255,215,0,0.4))",
        }}
      >
        <Crown size={186} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 566,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 64px",
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
            style={{
              width: 44,
              height: 1,
              background: "rgba(255,215,0,0.6)",
            }}
          />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 14,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: palette.goldSoft,
            }}
          >
            The countdown ends
          </span>
          <span
            style={{
              width: 44,
              height: 1,
              background: "rgba(255,215,0,0.6)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 30,
            overflow: "hidden",
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              fontFamily: displayFamily,
              fontWeight: 700,
              fontSize: 72,
              lineHeight: 1,
              letterSpacing: -2,
              color: palette.ink,
              opacity: lineOneIn,
              translate: `0px ${(1 - lineOneIn) * 70}px`,
              textShadow: "0 18px 50px rgba(0,0,0,0.6)",
            }}
          >
            WHO WILL TAKE
          </div>
        </div>

        <div
          style={{
            marginTop: 8,
            fontFamily: displayFamily,
            fontWeight: 700,
            fontSize: 118,
            lineHeight: 0.98,
            letterSpacing: -4,
            background: goldGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: lineTwoIn,
            scale: interpolate(lineTwoIn, [0, 1], [0.86, 1]),
            filter: "drop-shadow(0 20px 50px rgba(255,215,0,0.28))",
          }}
        >
          THE CROWN
        </div>

        <div
          style={{
            marginTop: 4,
            fontFamily: displayFamily,
            fontWeight: 700,
            fontSize: 72,
            lineHeight: 1,
            letterSpacing: -2,
            color: palette.ink,
            opacity: lineTwoIn,
            textShadow: "0 18px 50px rgba(0,0,0,0.6)",
          }}
        >
          NEXT YEAR?
        </div>

        <div style={{ marginTop: 38, opacity: ctaIn }}>
          <GoldRule width={260} />
        </div>

        <div
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 34px",
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
              fontSize: 22,
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
            marginTop: 28,
            fontFamily: interFamily,
            fontSize: 20,
            letterSpacing: 0.4,
            color: palette.muted,
            opacity: footIn * 0.9,
          }}
        >
          More rankings, fortunes and market stories every week.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1190,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: recapIn,
          translate: `0px ${(1 - recapIn) * 22}px`,
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
            style={{
              width: 60,
              height: 1,
              background: "rgba(255,215,0,0.45)",
            }}
          />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 11,
              letterSpacing: 4.4,
              textTransform: "uppercase",
              color: palette.goldSoft,
            }}
          >
            The 2026 champion
          </span>
          <span
            style={{
              width: 60,
              height: 1,
              background: "rgba(255,215,0,0.45)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            fontFamily: displayFamily,
            fontWeight: 700,
            fontSize: 38,
            letterSpacing: -0.4,
            color: palette.ink,
          }}
        >
          <span>{champion.name.toUpperCase()}</span>
          <span
            style={{
              fontSize: 30,
              background: goldGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            ${champion.netWorth}B
          </span>
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: interFamily,
            fontSize: 14,
            letterSpacing: 0.3,
            color: palette.mutedDeep,
          }}
        >
          Source: {DATA_SOURCE} · 40th annual edition
        </div>
      </div>
    </AbsoluteFill>
  );
};
