import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COUNTRIES, DATA_EDITION, WORLD_POPULATION } from "./data";
import { displayFamily, goldGradient, interFamily, palette } from "./theme";

const NAMES = COUNTRIES.map((country) => country.name.toUpperCase());

export const PopulationIntro: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: durationInFrames - 12,
    durationInFrames: 12,
    config: { damping: 200 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 22,
    config: { damping: 200 },
  });

  const worldIn = spring({
    frame,
    fps,
    delay: 4,
    durationInFrames: 28,
    config: { damping: 18, stiffness: 120 },
  });

  const numberIn = spring({
    frame,
    fps,
    delay: 6,
    durationInFrames: 30,
    config: { damping: 13, stiffness: 130 },
  });

  const mostIn = spring({
    frame,
    fps,
    delay: 11,
    durationInFrames: 28,
    config: { damping: 18, stiffness: 120 },
  });

  const countriesIn = spring({
    frame,
    fps,
    delay: 18,
    durationInFrames: 26,
    config: { damping: 200 },
  });

  const pillIn = spring({
    frame,
    fps,
    delay: 26,
    durationInFrames: 26,
    config: { damping: 15, stiffness: 120 },
  });

  const count = Math.min(
    10,
    Math.max(
      1,
      Math.round(
        interpolate(frame, [8, 30], [1, 10], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      ),
    ),
  );

  const settle = spring({
    frame,
    fps,
    delay: 30,
    durationInFrames: 18,
    config: { damping: 10, stiffness: 180 },
  });

  const zoom = interpolate(frame, [0, 36], [1.13, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const ticker = (frame * 1.3) % 760;

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: zoom * (1 + exit * 0.05),
      }}
    >
      {/* opening flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 46%, rgba(255,248,214,0.5) 0%, rgba(255,215,0,0.16) 16%, transparent 52%)",
          opacity: interpolate(frame, [0, 4, 22], [0.9, 0.55, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* big watermark numeral */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: displayFamily,
          fontSize: 900,
          fontWeight: 700,
          lineHeight: 0.8,
          letterSpacing: -60,
          color: "transparent",
          WebkitTextStroke: "2px rgba(255,215,0,0.11)",
          opacity: 0.5 * numberIn,
          scale: interpolate(numberIn, [0, 1], [1.25, 1]),
        }}
      >
        10
      </div>

      <div
        style={{
          position: "absolute",
          top: 470,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 50px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: kickerIn,
            translate: `0px ${(1 - kickerIn) * 16}px`,
          }}
        >
          <span
            style={{
              width: 40,
              height: 1,
              background: "rgba(255,215,0,0.6)",
            }}
          />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 14,
              letterSpacing: 4.2,
              textTransform: "uppercase",
              color: palette.goldSoft,
              whiteSpace: "nowrap",
            }}
          >
            UN World Population Prospects
          </span>
          <span
            style={{
              width: 40,
              height: 1,
              background: "rgba(255,215,0,0.6)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 30,
            fontFamily: displayFamily,
            fontSize: 44,
            letterSpacing: 13,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
            opacity: worldIn,
            translate: `0px ${(1 - worldIn) * 22}px`,
          }}
        >
          The World&apos;s
        </div>

        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 330,
            fontWeight: 700,
            lineHeight: 0.94,
            letterSpacing: -18,
            fontVariantNumeric: "tabular-nums",
            background: goldGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: numberIn,
            scale: interpolate(numberIn, [0, 1], [0.62, 1]) * (1 + settle * 0.03),
            filter:
              "drop-shadow(0 24px 60px rgba(255,215,0,0.26)) drop-shadow(0 0 40px rgba(255,215,0,0.2))",
          }}
        >
          {count}
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 8 }}>
          <div
            style={{
              fontFamily: displayFamily,
              fontSize: 86,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -1.4,
              color: palette.ink,
              opacity: mostIn,
              translate: `0px ${(1 - mostIn) * 110}px`,
              textShadow: "0 20px 60px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            MOST POPULOUS
          </div>
        </div>

        <div
          style={{
            marginTop: 6,
            fontFamily: displayFamily,
            fontSize: 44,
            letterSpacing: 15,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.82)",
            opacity: countriesIn,
            translate: `0px ${(1 - countriesIn) * 20}px`,
            whiteSpace: "nowrap",
          }}
        >
          Countries
        </div>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            alignItems: "center",
            gap: 15,
            padding: "14px 28px",
            borderRadius: 999,
            border: "1px solid rgba(255,215,0,0.3)",
            background:
              "linear-gradient(180deg, rgba(255,215,0,0.12), rgba(255,215,0,0.02))",
            boxShadow: "0 24px 60px rgba(0,0,0,0.42)",
            opacity: pillIn,
            scale: interpolate(pillIn, [0, 1], [0.92, 1]),
          }}
        >
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 16,
              letterSpacing: 3.4,
              textTransform: "uppercase",
              color: palette.goldSoft,
              whiteSpace: "nowrap",
            }}
          >
            {DATA_EDITION}
          </span>
          <span
            style={{
              width: 1,
              height: 18,
              backgroundColor: "rgba(255,215,0,0.32)",
            }}
          />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 16,
              letterSpacing: 3.4,
              color: palette.ink,
              whiteSpace: "nowrap",
            }}
          >
            {(WORLD_POPULATION / 1_000_000_000).toFixed(2)} billion people
          </span>
        </div>

        <div
          style={{
            marginTop: 20,
            fontFamily: interFamily,
            fontSize: 16,
            letterSpacing: 1.2,
            color: palette.muted,
            opacity: pillIn * 0.8,
            textAlign: "center",
          }}
        >
          #10 → #01 · Based on United Nations estimates
        </div>
      </div>

      {/* bottom ticker */}
      <div
        style={{
          position: "absolute",
          top: 1540,
          left: 0,
          right: 0,
          overflow: "hidden",
          opacity: pillIn * 0.36,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 52,
            whiteSpace: "nowrap",
            transform: `translateX(${-ticker}px)`,
            fontFamily: displayFamily,
            fontSize: 13,
            letterSpacing: 4.2,
            color: palette.goldSoft,
          }}
        >
          {[...NAMES, ...NAMES, ...NAMES].map((name, i) => (
            <span key={i}>
              {name}
              <span style={{ color: palette.blue, marginLeft: 52 }}>/</span>
            </span>
          ))}
        </div>
      </div>

      {/* edge framing */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 54,
          width: 44,
          height: 1,
          backgroundColor: "rgba(255,215,0,0.45)",
          opacity: kickerIn,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 54,
          width: 1,
          height: 44,
          backgroundColor: "rgba(255,215,0,0.45)",
          opacity: kickerIn,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 250,
          right: 54,
          width: 44,
          height: 1,
          backgroundColor: "rgba(255,215,0,0.45)",
          opacity: kickerIn,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 250,
          right: 54,
          width: 1,
          height: 44,
          backgroundColor: "rgba(255,215,0,0.45)",
          opacity: kickerIn,
        }}
      />
    </AbsoluteFill>
  );
};
