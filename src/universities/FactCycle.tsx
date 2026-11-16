import { interpolate, useCurrentFrame } from "remotion";
import { displayFamily, interFamily, palette } from "./theme";

/**
 * Cycles through the chapter's supporting facts in step with the narration.
 * Each fact gets an equal slice of the scene, with a soft cross-fade.
 */
export const FactCycle: React.FC<{
  facts: string[];
  durationInFrames: number;
  top: number;
  left?: number;
  right?: number;
  fontSize?: number;
}> = ({ facts, durationInFrames, top, left = 110, right = 110, fontSize = 23 }) => {
  const frame = useCurrentFrame();
  const slot = Math.max(80, Math.floor((durationInFrames - 30) / facts.length));
  const index = Math.min(facts.length - 1, Math.max(0, Math.floor(frame / slot)));
  const local = frame - index * slot;

  const enter = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(local, [slot - 14, slot], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, index === facts.length - 1 ? 1 : exit);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: interFamily,
          fontSize,
          lineHeight: 1.46,
          color: "#B9C6D8",
          opacity: opacity * 0.92,
          translate: `0px ${(1 - enter) * 16}px`,
          minHeight: fontSize * 3.1,
        }}
      >
        {facts[index]}
      </div>
      <div
        style={{
          marginTop: 14,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        {facts.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === index ? 26 : 8,
              height: 3,
              borderRadius: 99,
              backgroundColor:
                i === index ? palette.gold : "rgba(148,163,184,0.32)",
              boxShadow:
                i === index ? "0 0 12px rgba(255,215,0,0.7)" : "none",
              opacity: i <= index ? 1 : 0.5,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 8,
            fontFamily: displayFamily,
            fontSize: 10,
            letterSpacing: 2.2,
            color: palette.mutedDeep,
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(facts.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};
