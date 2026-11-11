import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, monoFamily } from "../fonts";

const pad = (value: number) => String(Math.floor(value)).padStart(2, "0");

export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const seconds = frame / fps;
  const total = durationInFrames / fps;
  const timecode = `${pad(seconds / 60)}:${pad(seconds % 60)}:${pad(
    (seconds % 1) * fps,
  )}`;

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: monoFamily,
        color: "#c8d2f5",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 52,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 15,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: 0.72,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            backgroundColor: colors.mint,
            boxShadow: `0 0 14px ${colors.mint}`,
          }}
        />
        <span>rec</span>
        <span style={{ opacity: 0.45 }}>|</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          {timecode} / 00:{pad(total)}:00
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          right: 64,
          bottom: 52,
          fontSize: 15,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: 0.6,
        }}
      >
        frame {String(frame).padStart(4, "0")}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 3,
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${colors.violet}, ${colors.blue}, ${colors.pink})`,
          boxShadow: `0 0 18px ${colors.blue}88`,
        }}
      />
    </div>
  );
};
