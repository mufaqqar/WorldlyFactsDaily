import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WORLD_2024, formatMt } from "./data";
import {
  codeFamily,
  displayFamily,
  interFamily,
  moltenGradient,
  palette,
} from "./theme";

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
    delay: 10,
    durationInFrames: 42,
    config: { damping: 20, stiffness: 110 },
  });

  const lineTwo = spring({
    frame,
    fps,
    delay: 30,
    durationInFrames: 42,
    config: { damping: 20, stiffness: 110 },
  });

  const noteIn = spring({
    frame,
    fps,
    delay: 78,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  const creditIn = spring({
    frame,
    fps,
    delay: 140,
    durationInFrames: 30,
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
            color: palette.molten,
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
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1.06,
            color: palette.ink,
            opacity: lineOne,
            translate: interpolate(lineOne, [0, 1], ["0px 60px", "0px 0px"]),
          }}
        >
          One country.
        </div>

        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1.06,
            background: moltenGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 18px 50px rgba(255,107,44,0.26))",
            opacity: lineTwo,
            translate: interpolate(lineTwo, [0, 1], ["0px 60px", "0px 0px"]),
          }}
        >
          Half the steel.
        </div>

        <div
          style={{
            marginTop: 46,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 28px",
            borderRadius: 999,
            border: "1px solid rgba(255,107,44,0.3)",
            background: "rgba(255,107,44,0.07)",
            fontFamily: codeFamily,
            fontSize: 22,
            letterSpacing: 1.6,
            color: palette.hot,
            opacity: noteIn,
            scale: interpolate(noteIn, [0, 1], [0.92, 1]),
          }}
        >
          World Steel Association · 2024
        </div>

        <div
          style={{
            marginTop: 32,
            maxWidth: 760,
            fontFamily: interFamily,
            fontSize: 28,
            lineHeight: 1.45,
            color: palette.muted,
            opacity: noteIn * 0.9,
            translate: interpolate(noteIn, [0, 1], ["0px 16px", "0px 0px"]),
          }}
        >
          {formatMt(WORLD_2024)} million tonnes of crude steel, and one
          country poured more than half of it.
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: interFamily,
            fontSize: 28,
            lineHeight: 1.4,
            color: "#c3cedb",
            opacity: noteIn * 0.85,
          }}
        >
          Which producer surprised you the most?
        </div>

        <div
          style={{
            marginTop: 52,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: codeFamily,
            fontSize: 21,
            letterSpacing: 3,
            color: palette.molten,
            opacity: creditIn * 0.9,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              backgroundColor: palette.molten,
              boxShadow: `0 0 14px ${palette.molten}`,
            }}
          />
          mufaqar.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
