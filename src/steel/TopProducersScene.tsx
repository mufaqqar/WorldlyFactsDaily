import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { formatMt, MAX_VALUE, PRODUCERS } from "./data";
import {
  codeFamily,
  displayFamily,
  palette,
  steelGradient,
} from "./theme";

const rankColor = (rank: number) => {
  if (rank === 1) return palette.molten;
  if (rank === 2) return palette.silver;
  if (rank === 3) return palette.ember;
  return "#7d8ea6";
};

const barColor = (rank: number) => {
  if (rank === 1) return "linear-gradient(90deg, #b8451a 0%, #ff6b2c 58%, #ffb347 100%)";
  if (rank <= 3) return "linear-gradient(90deg, #6b7c8f 0%, #dbe4ee 100%)";
  return "linear-gradient(90deg, #4a5a6b 0%, #9fb3c8 100%)";
};

export const TopProducersScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: durationInFrames - 18,
    durationInFrames: 18,
    config: { damping: 200 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 24,
    config: { damping: 200 },
  });

  const titleIn = spring({
    frame,
    fps,
    delay: 4,
    durationInFrames: 36,
    config: { damping: 15, stiffness: 110 },
  });

  const stagger = Math.round(
    Math.min(32, Math.max(20, (durationInFrames - 170) / 9)),
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
        paddingBottom: 34,
        opacity: 1 - exit,
        translate: interpolate(exit, [0, 1], ["0px 0px", "0px -40px"]),
      }}
    >
      <div style={{ width: "100%" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div
            style={{
              fontFamily: codeFamily,
              fontSize: 19,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: palette.molten,
              opacity: kickerIn * 0.9,
            }}
          >
            Crude steel · 2024
          </div>

          <div
            style={{
              marginTop: 2,
              fontFamily: displayFamily,
              fontSize: 128,
              fontWeight: 700,
              letterSpacing: -5,
              lineHeight: 1,
              background: steelGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 16px 44px rgba(219,228,238,0.18))",
              opacity: titleIn,
              scale: interpolate(titleIn, [0, 1], [0.92, 1]),
            }}
          >
            TOP 10
          </div>

          <div
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 22,
              fontFamily: codeFamily,
              fontSize: 18,
              letterSpacing: 2.6,
              color: palette.muted,
              opacity: titleIn * 0.85,
            }}
          >
            <span>million tonnes</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>% of world</span>
          </div>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {PRODUCERS.map((entry, i) => {
            const rank = i + 1;
            const delay = 14 + i * stagger;

            const enter = spring({
              frame,
              fps,
              delay,
              durationInFrames: 36,
              config: { damping: 18, stiffness: 120 },
            });

            const barPct = Math.max(2.4, (entry.value / MAX_VALUE) * 100);
            const bar = interpolate(frame, [delay + 4, delay + 46], [0, barPct], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            return (
              <div
                key={entry.code}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  height: 100,
                  padding: "0 22px",
                  borderRadius: 14,
                  border: `1px solid ${
                    rank === 1 ? "rgba(255,107,44,0.34)" : "rgba(159,179,200,0.12)"
                  }`,
                  background:
                    rank === 1
                      ? "linear-gradient(90deg, rgba(255,107,44,0.14) 0%, rgba(255,255,255,0.02) 72%)"
                      : "linear-gradient(90deg, rgba(159,179,200,0.075) 0%, rgba(255,255,255,0.015) 70%)",
                  boxShadow:
                    rank === 1
                      ? "0 20px 50px rgba(0,0,0,0.4), 0 0 40px rgba(255,107,44,0.12)"
                      : "0 18px 44px rgba(0,0,0,0.32)",
                  overflow: "hidden",
                  opacity: enter,
                  translate: interpolate(enter, [0, 1], ["0px 42px", "0px 0px"]),
                  scale: interpolate(enter, [0, 1], [0.97, 1]),
                }}
              >
                <div
                  style={{
                    width: 44,
                    textAlign: "center",
                    fontFamily: codeFamily,
                    fontSize: 25,
                    color: rankColor(rank),
                    opacity: 0.95,
                  }}
                >
                  {String(rank).padStart(2, "0")}
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      fontFamily: displayFamily,
                      fontSize: 34,
                      fontWeight: 500,
                      letterSpacing: -0.6,
                      color: palette.ink,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.name}
                  </div>
                  <div
                    style={{
                      fontFamily: codeFamily,
                      fontSize: 13,
                      letterSpacing: 2.4,
                      color: palette.muted,
                      opacity: 0.7,
                    }}
                  >
                    {entry.code}
                  </div>
                </div>

                <div
                  style={{
                    minWidth: 146,
                    textAlign: "right",
                    fontFamily: codeFamily,
                    fontSize: 29,
                    color: rank <= 3 ? palette.hot : "#d5e2f2",
                  }}
                >
                  {formatMt(entry.value)}
                </div>

                <div
                  style={{
                    minWidth: 82,
                    textAlign: "right",
                    fontFamily: codeFamily,
                    fontSize: 18,
                    color: palette.muted,
                  }}
                >
                  {entry.share.toFixed(1)}%
                </div>

                {/* Bar track */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 4,
                    backgroundColor: "rgba(159,179,200,0.08)",
                  }}
                />

                {/* Value bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 4,
                    width: `${bar}%`,
                    background: barColor(rank),
                    boxShadow:
                      rank === 1
                        ? `0 0 18px ${palette.molten}99`
                        : "0 0 12px rgba(219,228,238,0.25)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
