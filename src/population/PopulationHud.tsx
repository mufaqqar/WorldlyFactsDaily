import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  COUNTRIES,
  DATA_DATE,
  DATA_EDITION,
  DATA_SOURCE,
  WORLD_POPULATION,
} from "./data";
import { displayFamily, palette } from "./theme";

export const PopulationHud: React.FC<{ sceneFrames: number[] }> = ({
  sceneFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const offsets = sceneFrames.reduce<number[]>((acc, frames, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + sceneFrames[i - 1]);
    return acc;
  }, []);

  let activeScene = 0;
  for (let i = 0; i < offsets.length; i++) {
    if (frame >= offsets[i]) activeScene = i;
  }

  const activeRank =
    activeScene >= 1 && activeScene <= 10 ? 11 - activeScene : null;
  const outro = activeScene === 11;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: displayFamily,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: "rgba(255,215,0,0.1)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, #8A5A12, #FFD700 40%, #FFF8D6 62%, #22D3EE 100%)",
            boxShadow: "0 0 20px rgba(255,215,0,0.7)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 54,
          left: 54,
          display: "flex",
          alignItems: "center",
          gap: 11,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            backgroundColor: palette.gold,
            boxShadow: "0 0 14px rgba(255,215,0,0.95)",
            opacity: 0.6 + Math.sin(frame / 14) * 0.4,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: 4.4,
              color: palette.goldSoft,
              textTransform: "uppercase",
            }}
          >
            World Population
          </div>
          <div
            style={{
              marginTop: 3,
              fontSize: 10,
              letterSpacing: 2.6,
              color: palette.muted,
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            UN estimates · {DATA_EDITION}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 56,
          right: 54,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2.8,
            color: palette.muted,
            textTransform: "uppercase",
          }}
        >
          {(WORLD_POPULATION / 1_000_000_000).toFixed(2)} billion people
        </div>
        <div
          style={{
            marginTop: 3,
            fontSize: 10,
            letterSpacing: 2.4,
            color: palette.mutedDeep,
            textTransform: "uppercase",
          }}
        >
          Snapshot · {DATA_DATE}
        </div>
      </div>

      {/* countdown rail */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 170,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 18,
            height: 34,
          }}
        >
          {COUNTRIES.map((country) => {
            const done = outro || (activeRank !== null && country.rank > activeRank);
            const active = activeRank === country.rank;
            return (
              <div
                key={country.rank}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <div
                  style={{
                    width: active ? 6 : done ? 3 : 2,
                    height: active ? 30 : done ? 15 : 9,
                    borderRadius: 99,
                    background: active
                      ? "linear-gradient(180deg, #FFF8D6, #FFD700 55%, #B8860B)"
                      : done
                        ? "rgba(34,211,238,0.75)"
                        : "rgba(148,163,184,0.28)",
                    boxShadow: active
                      ? "0 0 18px rgba(255,215,0,0.85)"
                      : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: 0.4,
                    color: active
                      ? palette.gold
                      : done
                        ? "#67E8F9"
                        : palette.mutedDeep,
                    opacity: active ? 1 : 0.62,
                  }}
                >
                  {String(country.rank).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 3.2,
            color: palette.mutedDeep,
            textTransform: "uppercase",
          }}
        >
          Countdown 10 → 01
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 92,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 10,
          letterSpacing: 1.8,
          color: palette.muted,
          opacity: 0.48,
        }}
      >
        Source: {DATA_SOURCE} · {DATA_EDITION}
      </div>
    </div>
  );
};
