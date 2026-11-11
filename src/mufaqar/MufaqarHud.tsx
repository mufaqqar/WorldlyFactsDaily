import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { codeFamily, wp } from "./theme";

export const MufaqarHud: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

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
          left: 64,
          bottom: 50,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 16,
          letterSpacing: 4,
          textTransform: "lowercase",
          color: "#bcd9ee",
          opacity: 0.7,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            backgroundColor: wp.cyan,
            boxShadow: `0 0 14px ${wp.cyan}`,
          }}
        />
        mufaqar.com
      </div>

      <div
        style={{
          position: "absolute",
          right: 64,
          bottom: 50,
          fontSize: 15,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#bcd9ee",
          opacity: 0.55,
        }}
      >
        WordPress Developer
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 3,
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${wp.cyan}, ${wp.sky}, ${wp.indigo})`,
          boxShadow: `0 0 18px ${wp.cyan}80`,
        }}
      />
    </div>
  );
};
