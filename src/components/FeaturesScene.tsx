import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, displayFamily, interFamily, monoFamily } from "../fonts";
import { FEATURES_FRAMES } from "../timeline";

type Feature = {
  title: string;
  body: string;
  accent: string;
  icon: React.FC<{ color: string }>;
};

const Brackets: React.FC<{ color: string }> = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path
      d="M8 5 3 12l5 7M16 5l5 7-5 7"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Typed: React.FC<{ color: string }> = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 4c-2.2 0-3.5 1.2-3.5 3.4v2.2c0 1.5-.8 2.4-2.5 2.4 1.7 0 2.5.9 2.5 2.4v2.2C5.5 18.8 6.8 20 9 20M15 4c2.2 0 3.5 1.2 3.5 3.4v2.2c0 1.5.8 2.4 2.5 2.4-1.7 0-2.5.9-2.5 2.4v2.2c0 2.2-1.3 3.4-3.5 3.4"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

const Layers: React.FC<{ color: string }> = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path
      d="m12 3 9 5-9 5-9-5 9-5Z"
      stroke={color}
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path
      d="m3 13 9 5 9-5"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.7"
    />
  </svg>
);

const FEATURES: Feature[] = [
  {
    title: "React",
    body: "Compose every frame with JSX and the web skills you already have.",
    accent: colors.blue,
    icon: Brackets,
  },
  {
    title: "TypeScript",
    body: "Typed props, schemas and timelines that catch mistakes before render.",
    accent: colors.violet,
    icon: Typed,
  },
  {
    title: "Programmatic",
    body: "Render on demand, at any scale, straight from a function call.",
    accent: colors.pink,
    icon: Layers,
  },
];

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: FEATURES_FRAMES - 22,
    durationInFrames: 22,
    config: { damping: 200 },
  });

  const headingIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 22,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exit,
        transform: `translateY(${interpolate(exit, [0, 1], [0, -40])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 1500,
        }}
      >
        <div
          style={{
            fontFamily: monoFamily,
            fontSize: 17,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: colors.blue,
            opacity: kickerIn * 0.9,
            transform: `translateY(${interpolate(kickerIn, [0, 1], [14, 0])}px)`,
          }}
        >
          The API
        </div>

        <div
          style={{
            marginTop: 16,
            fontFamily: displayFamily,
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: -2,
            color: colors.ink,
            opacity: headingIn,
            transform: `translateY(${interpolate(headingIn, [0, 1], [30, 0])}px)`,
          }}
        >
          Everything is a component
        </div>

        <div
          style={{
            marginTop: 64,
            display: "flex",
            gap: 36,
          }}
        >
          {FEATURES.map((feature, i) => {
            const enter = spring({
              frame,
              fps,
              delay: 12 + i * 7,
              durationInFrames: 40,
              config: { damping: 18, stiffness: 120 },
            });

            const float = Math.sin((frame / fps) * 1.4 + i * 1.1) * 7;

            return (
              <div
                key={feature.title}
                style={{
                  position: "relative",
                  width: 460,
                  height: 300,
                  padding: "38px 36px",
                  borderRadius: 28,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.018) 100%)",
                  boxShadow: `0 34px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [90, 0]) + float}px) scale(${interpolate(
                    enter,
                    [0, 1],
                    [0.94, 1],
                  )})`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
                    opacity: 0.85,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 260,
                    height: 260,
                    right: -110,
                    top: -120,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${feature.accent}33 0%, transparent 70%)`,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 76,
                    height: 76,
                    borderRadius: 20,
                    border: `1px solid ${feature.accent}55`,
                    backgroundColor: `${feature.accent}14`,
                    boxShadow: `0 0 34px ${feature.accent}26`,
                  }}
                >
                  <feature.icon color={feature.accent} />
                </div>

                <div
                  style={{
                    marginTop: 30,
                    fontFamily: displayFamily,
                    fontSize: 40,
                    fontWeight: 600,
                    letterSpacing: -0.5,
                    color: colors.ink,
                  }}
                >
                  {feature.title}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    fontFamily: interFamily,
                    fontSize: 22,
                    lineHeight: 1.45,
                    color: colors.muted,
                  }}
                >
                  {feature.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
