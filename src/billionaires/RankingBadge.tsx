import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, goldGradient, palette } from "./theme";

type Props = {
  rank: number;
  total?: number;
  variant?: number;
};

/**
 * Oversized editorial rank numeral plus a 10-step ranking rail. The rail fills
 * as the countdown progresses, giving every profile an animated ranking cue.
 */
export const RankingBadge: React.FC<Props> = ({ rank, total = 10, variant = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 24,
    config: { damping: 15, stiffness: 110 },
  });

  const direction = variant % 2 === 0 ? -1 : 1;

  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        right: 22,
        width: 640,
        height: 660,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pointerEvents: "none",
        opacity: enter * 0.9,
      }}
    >
      <div
        style={{
          fontFamily: displayFamily,
          fontSize: 560,
          fontWeight: 700,
          lineHeight: 0.78,
          letterSpacing: -34,
          color: "rgba(255,215,0,0.035)",
          WebkitTextStroke: "2px rgba(255,215,0,0.17)",
          transform: `translateX(${interpolate(enter, [0, 1], [direction * 90, 0])}px) scale(${interpolate(enter, [0, 1], [1.28, 1])}) rotate(${interpolate(enter, [0, 1], [direction * 4, 0])}deg)`,
          transformOrigin: "right top",
        }}
      >
        {String(rank).padStart(2, "0")}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 7,
          marginTop: 8,
          marginRight: 18,
          opacity: interpolate(enter, [0.35, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {Array.from({ length: total }).map((_, index) => {
          const step = total - index;
          const active = step === rank;
          const done = step > rank;
          const stepIn = spring({
            frame,
            fps,
            delay: 4 + index * 1.6,
            durationInFrames: 16,
            config: { damping: 200 },
          });

          return (
            <div
              key={step}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: stepIn,
                translate: `${interpolate(stepIn, [0, 1], [24, 0])}px 0px`,
              }}
            >
              <span
                style={{
                  fontFamily: displayFamily,
                  fontSize: 13,
                  letterSpacing: 1,
                  color: active
                    ? palette.gold
                    : done
                      ? palette.blueSoft
                      : palette.mutedDeep,
                  opacity: active ? 1 : 0.65,
                }}
              >
                {String(step).padStart(2, "0")}
              </span>
              <span
                style={{
                  display: "block",
                  width: active ? 58 : done ? 34 : 20,
                  height: active ? 5 : 2,
                  borderRadius: 99,
                  background: active
                    ? goldGradient
                    : done
                      ? "rgba(96,165,250,0.65)"
                      : "rgba(148,163,184,0.25)",
                  boxShadow: active ? "0 0 16px rgba(255,215,0,0.7)" : "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
