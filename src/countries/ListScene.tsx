import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Entry } from "./data";
import { formatUsd } from "./data";
import { codeFamily, displayFamily, palette, yearGradient } from "./theme";

const rankColor = (rank: number) => {
  if (rank === 1) return palette.gold;
  if (rank === 2) return palette.silver;
  if (rank === 3) return palette.bronze;
  return "#7d8ea6";
};

const ChangeBadge: React.FC<{ entry: Entry }> = ({ entry }) => {
  if (entry.change === null) {
    return <div style={{ width: 72 }} />;
  }

  const isNew = entry.change === "new";
  const isUp = entry.change === "up";
  const color = isNew ? palette.gold : isUp ? palette.teal : palette.red;

  return (
    <div
      style={{
        width: 72,
        display: "flex",
        justifyContent: "flex-end",
        fontFamily: codeFamily,
        fontSize: isNew ? 15 : 18,
        letterSpacing: isNew ? 1.6 : 0.5,
        color,
        opacity: 0.95,
      }}
    >
      {isNew ? (
        <span
          style={{
            padding: "4px 9px",
            borderRadius: 6,
            border: `1px solid ${color}55`,
            backgroundColor: `${color}14`,
          }}
        >
          NEW
        </span>
      ) : (
        <span>
          {isUp ? "▲" : "▼"}
          {entry.delta}
        </span>
      )}
    </div>
  );
};

export const ListScene: React.FC<{
  durationInFrames: number;
  year: string;
  entries: Entry[];
  max: number;
  stagger: number;
  showChange: boolean;
}> = ({ durationInFrames, year, entries, max, stagger, showChange }) => {
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

  const yearIn = spring({
    frame,
    fps,
    delay: 4,
    durationInFrames: 36,
    config: { damping: 15, stiffness: 110 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        paddingBottom: 40,
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
            marginBottom: 34,
          }}
        >
          <div
            style={{
              fontFamily: codeFamily,
              fontSize: 19,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: palette.gold,
              opacity: kickerIn * 0.85,
            }}
          >
            Richest countries
          </div>

          <div
            style={{
              marginTop: 2,
              fontFamily: displayFamily,
              fontSize: 142,
              fontWeight: 700,
              letterSpacing: -6,
              lineHeight: 1,
              background: yearGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 16px 44px rgba(246,196,83,0.24))",
              opacity: yearIn,
              scale: interpolate(yearIn, [0, 1], [0.9, 1]),
            }}
          >
            {year}
          </div>

          <div
            style={{
              marginTop: 6,
              fontFamily: codeFamily,
              fontSize: 20,
              letterSpacing: 2.4,
              color: palette.muted,
              opacity: yearIn * 0.85,
            }}
          >
            GDP per capita · current US$
          </div>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {entries.map((entry, i) => {
            const delay = 14 + i * stagger;

            const enter = spring({
              frame,
              fps,
              delay,
              durationInFrames: 36,
              config: { damping: 18, stiffness: 120 },
            });

            const barPct = Math.max(1.6, (entry.value / max) * 100);
            const bar = interpolate(frame, [delay + 4, delay + 44], [0, barPct], {
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
                  gap: 16,
                  height: 104,
                  padding: "0 22px",
                  borderRadius: 16,
                  border: "1px solid rgba(246,196,83,0.1)",
                  background:
                    "linear-gradient(90deg, rgba(246,196,83,0.075) 0%, rgba(255,255,255,0.018) 70%)",
                  boxShadow: "0 18px 44px rgba(0,0,0,0.32)",
                  overflow: "hidden",
                  opacity: enter,
                  translate: interpolate(enter, [0, 1], ["0px 42px", "0px 0px"]),
                  scale: interpolate(enter, [0, 1], [0.97, 1]),
                }}
              >
                <div
                  style={{
                    width: 46,
                    textAlign: "center",
                    fontFamily: codeFamily,
                    fontSize: 28,
                    color: rankColor(entry.rank),
                    opacity: 0.9,
                  }}
                >
                  {entry.rank}
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontFamily: displayFamily,
                    fontSize: 35,
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

                {showChange ? <ChangeBadge entry={entry} /> : null}

                <div
                  style={{
                    minWidth: 152,
                    textAlign: "right",
                    fontFamily: codeFamily,
                    fontSize: 28,
                    color: entry.rank <= 3 ? palette.goldSoft : "#d5e2f2",
                  }}
                >
                  {formatUsd(entry.value)}
                </div>

                {/* Value bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 4,
                    width: `${bar}%`,
                    background:
                      "linear-gradient(90deg, rgba(246,196,83,0.35), #f6c453 65%, #ffe9b0)",
                    boxShadow: `0 0 16px ${palette.gold}80`,
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
