import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { codeFamily, wp } from "../mufaqar/theme";

const LABELS = ["intro", "track record", "services", "stack", "contact"];

export const VerticalHud: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const active = Math.min(
    LABELS.length - 1,
    Math.floor((frame / durationInFrames) * LABELS.length),
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: codeFamily,
        pointerEvents: "none",
      }}
    >
      {/* Top progress rail */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: "rgba(125,195,255,0.1)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${wp.cyan}, ${wp.sky}, ${wp.indigo})`,
            boxShadow: `0 0 18px ${wp.cyan}99`,
          }}
        />
      </div>

      {/* Top left brand */}
      <div
        style={{
          position: "absolute",
          top: 62,
          left: 56,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 19,
          letterSpacing: 2.4,
          color: "#c3ddf0",
          opacity: 0.78,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            backgroundColor: wp.cyan,
            boxShadow: `0 0 14px ${wp.cyan}`,
          }}
        />
        mufaqar.com
      </div>

      {/* Top right scene label */}
      <div
        style={{
          position: "absolute",
          top: 62,
          right: 56,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 17,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#a9c6dd",
          opacity: 0.62,
        }}
      >
        <span style={{ color: wp.cyan }}>{String(active + 1).padStart(2, "0")}</span>
        <span style={{ opacity: 0.5 }}>/</span>
        <span>{LABELS[active]}</span>
      </div>

      {/* Bottom handle — kept above reel UI overlays */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontSize: 16,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "#9fbcd4",
          opacity: 0.42,
        }}
      >
        WordPress · React · Next.js
      </div>
    </div>
  );
};
