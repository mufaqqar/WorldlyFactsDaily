import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CHINA_VALUE,
  NEXT_NINE_TOTAL,
  WORLD_2024,
  formatMt,
} from "./data";
import {
  codeFamily,
  displayFamily,
  interFamily,
  moltenGradient,
  palette,
  steelBarGradient,
} from "./theme";

const CHINA_SHARE = (CHINA_VALUE / WORLD_2024) * 100;
const REST = WORLD_2024 - CHINA_VALUE;
const NEXT_RATIO = NEXT_NINE_TOTAL / CHINA_VALUE;

export const DominanceScene: React.FC<{ durationInFrames: number }> = ({
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

  const bigIn = spring({
    frame,
    fps,
    delay: 4,
    durationInFrames: 40,
    config: { damping: 15, stiffness: 105 },
  });

  const count = interpolate(frame, [8, 52], [0, CHINA_SHARE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const worldBar = interpolate(frame, [30, 78], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const compareIn = spring({
    frame,
    fps,
    delay: 62,
    durationInFrames: 36,
    config: { damping: 200 },
  });

  const chinaBar = interpolate(frame, [70, 108], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const nineBar = interpolate(frame, [82, 120], [0, NEXT_RATIO * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const ratioIn = spring({
    frame,
    fps,
    delay: 116,
    durationInFrames: 28,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 62px",
        paddingBottom: 26,
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
            textAlign: "center",
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
            The outlier
          </div>

          <div
            style={{
              marginTop: -8,
              fontFamily: displayFamily,
              fontSize: 224,
              fontWeight: 700,
              letterSpacing: -10,
              lineHeight: 1,
              background: moltenGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 20px 60px rgba(255,107,44,0.3))",
              opacity: bigIn,
              scale: interpolate(bigIn, [0, 1], [0.86, 1]),
            }}
          >
            {count.toFixed(1)}%
          </div>

          <div
            style={{
              marginTop: 2,
              maxWidth: 780,
              fontFamily: interFamily,
              fontSize: 33,
              lineHeight: 1.36,
              color: "#c3cedb",
              opacity: bigIn * 0.95,
            }}
          >
            of all steel made on Earth comes from{" "}
            <span style={{ color: palette.ink, fontWeight: 600 }}>China</span>.
          </div>
        </div>

        {/* World split bar */}
        <div
          style={{
            marginTop: 54,
            opacity: interpolate(worldBar, [0, 1], [0, 1]),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
              fontFamily: codeFamily,
              fontSize: 17,
              letterSpacing: 1.6,
            }}
          >
            <span style={{ color: palette.hot }}>
              CHINA · {formatMt(CHINA_VALUE)} Mt
            </span>
            <span style={{ color: palette.steel, opacity: 0.8 }}>
              REST OF WORLD · {formatMt(REST)} Mt
            </span>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              height: 62,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(159,179,200,0.16)",
              backgroundColor: "rgba(159,179,200,0.06)",
            }}
          >
            <div
              style={{
                width: `${(CHINA_SHARE * worldBar) / 100}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, #b8451a 0%, #ff6b2c 62%, #ffb347 100%)",
                boxShadow: `inset 0 0 30px rgba(255,179,71,0.35)`,
              }}
            />
            <div
              style={{
                flex: 1,
                height: "100%",
                background: steelBarGradient,
                opacity: 0.55,
              }}
            />
          </div>

          <div
            style={{
              marginTop: 12,
              textAlign: "center",
              fontFamily: codeFamily,
              fontSize: 16,
              letterSpacing: 2.4,
              color: palette.muted,
              opacity: 0.7,
            }}
          >
            WORLD TOTAL · {formatMt(WORLD_2024)} Mt
          </div>
        </div>

        {/* China vs next nine */}
        <div
          style={{
            marginTop: 58,
            padding: "30px 32px 32px",
            borderRadius: 20,
            border: "1px solid rgba(159,179,200,0.14)",
            background:
              "linear-gradient(140deg, rgba(255,107,44,0.07) 0%, rgba(255,255,255,0.015) 60%)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            opacity: compareIn,
            translate: interpolate(compareIn, [0, 1], ["0px 36px", "0px 0px"]),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 20,
              fontFamily: codeFamily,
              fontSize: 16,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: palette.muted,
            }}
          >
            <span>China vs the next nine</span>
            <span style={{ color: palette.hot }}>
              {NEXT_RATIO.toFixed(1)}×
            </span>
          </div>

          {[
            {
              label: "China",
              value: CHINA_VALUE,
              width: chinaBar,
              color: "linear-gradient(90deg, #b8451a, #ff6b2c 60%, #ffb347)",
              glow: `0 0 18px ${palette.molten}77`,
            },
            {
              label: "Next 9 combined",
              value: NEXT_NINE_TOTAL,
              width: nineBar,
              color: steelBarGradient,
              glow: "0 0 14px rgba(219,228,238,0.3)",
            },
          ].map((row) => (
            <div key={row.label} style={{ marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: interFamily,
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#dbe4ee",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: codeFamily,
                    fontSize: 24,
                    color: "#e8eef5",
                  }}
                >
                  {formatMt(row.value)} Mt
                </span>
              </div>
              <div
                style={{
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "rgba(159,179,200,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${row.width}%`,
                    borderRadius: 8,
                    background: row.color,
                    boxShadow: row.glow,
                  }}
                />
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 2,
              fontFamily: interFamily,
              fontSize: 22,
              lineHeight: 1.4,
              color: palette.muted,
              opacity: ratioIn,
            }}
          >
            One country out-produces nine industrial giants put together.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
