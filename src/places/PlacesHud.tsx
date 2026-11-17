import { interpolate, useCurrentFrame } from "remotion";
import { displayFamily, goldGradient, interFamily, palette } from "./theme";

/**
 * Persistent overlay: progress rail, series label and the scene counter.
 * Sized for a 1080-wide canvas with reel-safe side margins.
 */
export const PlacesHud: React.FC<{
  sceneFrames: number[];
  labels: string[];
}> = ({ sceneFrames, labels }) => {
  const frame = useCurrentFrame();
  const total = sceneFrames.reduce((sum, value) => sum + value, 0);
  const progress = Math.min(1, frame / Math.max(1, total));

  let scene = 0;
  let cursor = 0;
  for (let i = 0; i < sceneFrames.length; i += 1) {
    if (frame >= cursor) {
      scene = i;
    }
    cursor += sceneFrames[i];
  }

  const enter = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 62,
          left: 64,
          right: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: enter,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: palette.gold,
              boxShadow: "0 0 14px rgba(255,215,0,0.8)",
            }}
          />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3.6,
              textTransform: "uppercase",
              color: "rgba(226,232,240,0.86)",
            }}
          >
            Most beautiful places
          </span>
        </div>

        <span
          style={{
            fontFamily: displayFamily,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 2.8,
            color: palette.mutedDeep,
          }}
        >
          {String(Math.min(12, scene + 1)).padStart(2, "0")} / 12
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 92,
          left: 64,
          right: 64,
          height: 3,
          borderRadius: 2,
          background: "rgba(148,163,184,0.20)",
          overflow: "hidden",
          opacity: enter,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: goldGradient,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 101,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          opacity: enter * 0.85,
        }}
      >
        {sceneFrames.map((_, i) => (
          <span
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: i <= scene ? palette.goldSoft : "rgba(148,163,184,0.35)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 64,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: enter * 0.75,
        }}
      >
        <span
          style={{
            fontFamily: interFamily,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: palette.mutedDeep,
          }}
        >
          {labels[scene] ?? ""}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 56,
          right: 64,
          fontFamily: interFamily,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 1.2,
          color: "rgba(100,116,139,0.85)",
          opacity: enter * 0.75,
        }}
      >
        Curated selection
      </div>
    </div>
  );
};
