import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { codeFamily, displayFamily, interFamily, palette } from "./theme";

export const OutroScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: durationInFrames - 16,
    durationInFrames: 16,
    config: { damping: 200 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 24,
    config: { damping: 200 },
  });

  const lineOne = spring({
    frame,
    fps,
    delay: 8,
    durationInFrames: 40,
    config: { damping: 20, stiffness: 110 },
  });

  const lineTwo = spring({
    frame,
    fps,
    delay: 18,
    durationInFrames: 40,
    config: { damping: 20, stiffness: 110 },
  });

  const noteIn = spring({
    frame,
    fps,
    delay: 40,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  const creditIn = spring({
    frame,
    fps,
    delay: 56,
    durationInFrames: 28,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        paddingBottom: 40,
        opacity: 1 - exit,
        scale: interpolate(exit, [0, 1], [1, 1.03]),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: codeFamily,
            fontSize: 20,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: palette.gold,
            opacity: kickerIn,
            translate: interpolate(kickerIn, [0, 1], ["0px 14px", "0px 0px"]),
            marginBottom: 34,
          }}
        >
          The takeaway
        </div>

        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1.06,
            color: palette.ink,
            opacity: lineOne,
            translate: interpolate(lineOne, [0, 1], ["0px 60px", "0px 0px"]),
          }}
        >
          Same planet.
        </div>

        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1.06,
            background:
              "linear-gradient(100deg, #ffffff 0%, #ffe9b0 40%, #f6c453 74%, #2dd4bf 110%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: lineTwo,
            translate: interpolate(lineTwo, [0, 1], ["0px 60px", "0px 0px"]),
          }}
        >
          New ranking.
        </div>

        <div
          style={{
            marginTop: 46,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 28px",
            borderRadius: 999,
            border: "1px solid rgba(246,196,83,0.3)",
            background: "rgba(246,196,83,0.07)",
            fontFamily: codeFamily,
            fontSize: 22,
            letterSpacing: 1.6,
            color: palette.goldSoft,
            opacity: noteIn,
            scale: interpolate(noteIn, [0, 1], [0.92, 1]),
          }}
        >
          World Bank · 2024
        </div>

        <div
          style={{
            marginTop: 40,
            maxWidth: 760,
            fontFamily: interFamily,
            fontSize: 30,
            lineHeight: 1.4,
            color: palette.muted,
            opacity: noteIn * 0.9,
            translate: interpolate(noteIn, [0, 1], ["0px 16px", "0px 0px"]),
          }}
        >
          Which country surprised you the most?
        </div>

        <div
          style={{
            marginTop: 54,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: codeFamily,
            fontSize: 21,
            letterSpacing: 3,
            color: palette.gold,
            opacity: creditIn * 0.85,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              backgroundColor: palette.gold,
              boxShadow: `0 0 14px ${palette.gold}`,
            }}
          />
          mufaqar.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
