import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MOMENTUM } from "./data";
import { codeFamily, displayFamily, interFamily, palette } from "./theme";

const MAX_ABS = Math.max(...MOMENTUM.map((entry) => Math.abs(entry.yoy)));
const HALF_TRACK = 46;

export const MomentumScene: React.FC<{ durationInFrames: number }> = ({
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
    durationInFrames: 22,
    config: { damping: 200 },
  });

  const headingIn = spring({
    frame,
    fps,
    delay: 5,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  const stagger = Math.round(
    Math.min(28, Math.max(14, (durationInFrames - 160) / 9)),
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 58px",
        paddingBottom: 24,
        opacity: 1 - exit,
        translate: interpolate(exit, [0, 1], ["0px 0px", "0px -40px"]),
      }}
    >
      <div style={{ width: "100%" }}>
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
              color: palette.molten,
              opacity: kickerIn * 0.9,
            }}
          >
            2023 → 2024
          </div>

          <div
            style={{
              marginTop: 12,
              fontFamily: displayFamily,
              fontSize: 74,
              fontWeight: 600,
              letterSpacing: -2.6,
              lineHeight: 1.05,
              color: palette.ink,
              textAlign: "center",
              opacity: headingIn,
              translate: interpolate(headingIn, [0, 1], ["0px 30px", "0px 0px"]),
            }}
          >
            Who is speeding up?
          </div>

          <div
            style={{
              marginTop: 12,
              fontFamily: codeFamily,
              fontSize: 18,
              letterSpacing: 2.6,
              color: palette.muted,
              opacity: headingIn * 0.85,
            }}
          >
            Change in crude steel output
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOMENTUM.map((entry, i) => {
            const delay = 16 + i * stagger;
            const positive = entry.yoy > 0;
            const color = positive ? palette.green : palette.red;

            const enter = spring({
              frame,
              fps,
              delay,
              durationInFrames: 30,
              config: { damping: 200 },
            });

            const width = interpolate(
              frame,
              [delay + 6, delay + 46],
              [0, (Math.abs(entry.yoy) / MAX_ABS) * HALF_TRACK],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              },
            );

            return (
              <div
                key={entry.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  height: 84,
                  padding: "0 22px",
                  borderRadius: 14,
                  border: "1px solid rgba(159,179,200,0.1)",
                  background:
                    "linear-gradient(90deg, rgba(159,179,200,0.055) 0%, rgba(255,255,255,0.012) 70%)",
                  opacity: enter,
                  translate: interpolate(enter, [0, 1], ["0px 26px", "0px 0px"]),
                }}
              >
                <div
                  style={{
                    width: 252,
                    fontFamily: displayFamily,
                    fontSize: 30,
                    fontWeight: 500,
                    letterSpacing: -0.4,
                    color: "#e6ecf3",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {entry.name}
                </div>

                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    height: 30,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 5,
                      height: 20,
                      borderRadius: 5,
                      backgroundColor: "rgba(159,179,200,0.06)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: -6,
                      bottom: -6,
                      width: 1,
                      backgroundColor: "rgba(219,228,238,0.18)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 5,
                      height: 20,
                      borderRadius: 5,
                      ...(positive
                        ? { left: "50%", width: `${width}%` }
                        : { right: "50%", width: `${width}%` }),
                      background: positive
                        ? "linear-gradient(90deg, rgba(52,211,153,0.55), #34d399)"
                        : "linear-gradient(270deg, rgba(240,85,63,0.55), #f0553f)",
                      boxShadow: `0 0 14px ${color}55`,
                    }}
                  />
                </div>

                <div
                  style={{
                    width: 116,
                    textAlign: "right",
                    fontFamily: codeFamily,
                    fontSize: 27,
                    color,
                  }}
                >
                  {positive ? "+" : "−"}
                  {Math.abs(entry.yoy).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 30,
            textAlign: "center",
            fontFamily: interFamily,
            fontSize: 22,
            lineHeight: 1.4,
            color: palette.muted,
            opacity: spring({
              frame,
              fps,
              delay: durationInFrames - 96,
              durationInFrames: 26,
              config: { damping: 200 },
            }),
          }}
        >
          Emerging producers are gaining ground while the giants cool off.
        </div>
      </div>
    </AbsoluteFill>
  );
};
