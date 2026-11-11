import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { codeFamily, displayFamily, interFamily, palette } from "./theme";

type Card = {
  tag: string;
  metric: string;
  note: string;
  accent: string;
  delay: number;
};

const CARDS: Card[] = [
  {
    tag: "Ireland",
    metric: "$707 → $112,895",
    note: "From low income to a tech and pharma hub.",
    accent: palette.gold,
    delay: 16,
  },
  {
    tag: "Singapore",
    metric: "$428 → $94,897",
    note: "A trading port turned global finance centre.",
    accent: palette.teal,
    delay: 104,
  },
  {
    tag: "Norway & Qatar",
    metric: "New top 10",
    note: "Energy exporters riding oil and gas to the top.",
    accent: palette.sky,
    delay: 196,
  },
  {
    tag: "6 of 1960's top 10",
    metric: "Slipped out",
    note: "New Zealand · Canada · Sweden · Australia · Bahamas · Israel",
    accent: palette.red,
    delay: 300,
  },
];

export const ShiftsScene: React.FC<{ durationInFrames: number }> = ({
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

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 64px",
        paddingBottom: 30,
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
            marginBottom: 44,
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
            The big shifts
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: displayFamily,
              fontSize: 82,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 1.06,
              color: palette.ink,
              opacity: headingIn,
              translate: interpolate(headingIn, [0, 1], ["0px 30px", "0px 0px"]),
            }}
          >
            What changed?
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {CARDS.map((card) => {
            const enter = spring({
              frame,
              fps,
              delay: card.delay,
              durationInFrames: 40,
              config: { damping: 18, stiffness: 120 },
            });

            return (
              <div
                key={card.tag}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  padding: "26px 30px",
                  borderRadius: 22,
                  border: "1px solid rgba(246,196,83,0.12)",
                  background:
                    "linear-gradient(120deg, rgba(246,196,83,0.085) 0%, rgba(255,255,255,0.015) 100%)",
                  boxShadow: "0 22px 60px rgba(0,0,0,0.42)",
                  overflow: "hidden",
                  opacity: enter,
                  translate: interpolate(enter, [0, 1], ["0px 54px", "0px 0px"]),
                  scale: interpolate(enter, [0, 1], [0.97, 1]),
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: `linear-gradient(180deg, transparent, ${card.accent}, transparent)`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: interFamily,
                      fontSize: 34,
                      fontWeight: 600,
                      color: palette.ink,
                    }}
                  >
                    {card.tag}
                  </span>
                  <span
                    style={{
                      fontFamily: codeFamily,
                      fontSize: 26,
                      color: card.accent,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {card.metric}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: interFamily,
                    fontSize: 23,
                    lineHeight: 1.42,
                    color: palette.muted,
                  }}
                >
                  {card.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
