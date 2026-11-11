import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { codeFamily, palette } from "./theme";

const LABELS = ["intro", "top 10", "the outlier", "momentum", "outro"];

export const SteelHud: React.FC<{ sceneFrames: number[] }> = ({
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

  let active = 0;
  for (let i = 0; i < offsets.length; i++) {
    if (frame >= offsets[i]) active = i;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: codeFamily,
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
          backgroundColor: "rgba(255,107,44,0.12)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${palette.molten}, ${palette.ember}, ${palette.steel})`,
            boxShadow: `0 0 18px ${palette.molten}99`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 58,
          left: 52,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 19,
          letterSpacing: 3,
          color: palette.hot,
          opacity: 0.85,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            backgroundColor: palette.molten,
            boxShadow: `0 0 14px ${palette.molten}`,
          }}
        />
        CRUDE STEEL · 2024
      </div>

      <div
        style={{
          position: "absolute",
          top: 58,
          right: 52,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 17,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#b9c8dd",
          opacity: 0.65,
        }}
      >
        <span style={{ color: palette.molten }}>
          {String(active + 1).padStart(2, "0")}
        </span>
        <span style={{ opacity: 0.5 }}>/</span>
        <span>{LABELS[active]}</span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 118,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 16,
          letterSpacing: 2.6,
          color: "#9fb2c9",
          opacity: 0.5,
        }}
      >
        Source: World Steel Association · million tonnes
      </div>
    </div>
  );
};
