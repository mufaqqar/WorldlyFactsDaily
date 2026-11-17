import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { Place } from "./data";
import { terrainTheme } from "./theme";
import type { Terrain } from "./theme";

/**
 * Landform silhouettes, back → front. Every terrain shares the same three
 * ridges so the parallax reads consistently; the palettes and motifs differ.
 */
const RIDGES: Record<Terrain, [string, string, string]> = {
  island: [
    "polygon(0 62%, 14% 55%, 30% 60%, 46% 52%, 62% 59%, 78% 54%, 92% 60%, 100% 56%, 100% 100%, 0 100%)",
    "polygon(0 74%, 18% 68%, 36% 73%, 54% 66%, 72% 72%, 88% 67%, 100% 72%, 100% 100%, 0 100%)",
    "polygon(0 88%, 22% 84%, 44% 88%, 66% 83%, 86% 87%, 100% 84%, 100% 100%, 0 100%)",
  ],
  desert: [
    "polygon(0 66%, 10% 56%, 18% 62%, 27% 50%, 34% 61%, 45% 48%, 54% 60%, 64% 51%, 74% 62%, 84% 52%, 93% 61%, 100% 55%, 100% 100%, 0 100%)",
    "polygon(0 78%, 12% 70%, 24% 77%, 38% 68%, 52% 76%, 66% 69%, 80% 77%, 92% 70%, 100% 76%, 100% 100%, 0 100%)",
    "polygon(0 90%, 20% 86%, 40% 91%, 60% 85%, 80% 90%, 100% 86%, 100% 100%, 0 100%)",
  ],
  savanna: [
    "polygon(0 70%, 22% 68%, 46% 70%, 70% 67%, 100% 69%, 100% 100%, 0 100%)",
    "polygon(0 80%, 26% 78%, 52% 80%, 78% 78%, 100% 80%, 100% 100%, 0 100%)",
    "polygon(0 92%, 30% 91%, 62% 92%, 100% 91%, 100% 100%, 0 100%)",
  ],
  mountain: [
    "polygon(0 72%, 12% 50%, 20% 60%, 32% 32%, 42% 58%, 52% 44%, 63% 20%, 74% 56%, 84% 42%, 94% 62%, 100% 54%, 100% 100%, 0 100%)",
    "polygon(0 82%, 14% 66%, 26% 76%, 40% 58%, 54% 74%, 68% 60%, 82% 76%, 100% 66%, 100% 100%, 0 100%)",
    "polygon(0 92%, 24% 88%, 48% 93%, 72% 88%, 100% 92%, 100% 100%, 0 100%)",
  ],
  lagoon: [
    "polygon(0 58%, 26% 54%, 52% 57%, 78% 53%, 100% 56%, 100% 100%, 0 100%)",
    "polygon(0 72%, 20% 69%, 46% 72%, 72% 68%, 100% 71%, 100% 100%, 0 100%)",
    "polygon(0 88%, 28% 85%, 58% 89%, 100% 86%, 100% 100%, 0 100%)",
  ],
  coast: [
    "polygon(0 64%, 16% 58%, 34% 63%, 52% 55%, 70% 61%, 86% 56%, 100% 62%, 100% 100%, 0 100%)",
    "polygon(0 76%, 20% 71%, 42% 77%, 64% 70%, 84% 76%, 100% 71%, 100% 100%, 0 100%)",
    "polygon(0 90%, 26% 87%, 54% 91%, 78% 86%, 100% 90%, 100% 100%, 0 100%)",
  ],
  falls: [
    "polygon(0 60%, 18% 56%, 36% 61%, 54% 55%, 72% 60%, 88% 55%, 100% 60%, 100% 100%, 0 100%)",
    "polygon(0 74%, 22% 70%, 44% 75%, 66% 69%, 86% 74%, 100% 70%, 100% 100%, 0 100%)",
    "polygon(0 90%, 30% 87%, 60% 91%, 100% 87%, 100% 100%, 0 100%)",
  ],
};

/** Terrain-specific foreground detail: sun, meltwater, spray. */
const Motif: React.FC<{ terrain: Terrain; accent: string; frame: number }> = ({
  terrain,
  accent,
  frame,
}) => {
  const pulse = 0.72 + 0.28 * Math.sin(frame / 26);

  if (terrain === "falls") {
    return (
      <>
        {[28, 46, 63, 79].map((left, i) => (
          <div
            key={left}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${58 + i * 3}%`,
              width: 10 + (i % 2) * 8,
              height: "34%",
              borderRadius: 8,
              background: `linear-gradient(180deg, rgba(255,255,255,0.02), ${accent}, rgba(255,255,255,0.02))`,
              opacity: 0.32 + 0.12 * Math.sin(frame / 9 + i),
            }}
          />
        ))}
      </>
    );
  }

  if (terrain === "lagoon" || terrain === "island") {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "30%",
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${accent}22 40%, ${accent}44 100%)`,
          opacity: 0.9,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "56%",
        top: "26%",
        width: 210,
        height: 210,
        borderRadius: "50%",
        background: `radial-gradient(circle, #FFFFFF 0%, ${accent} 38%, rgba(0,0,0,0) 72%)`,
        opacity: 0.5 * pulse,
      }}
    />
  );
};

/**
 * The postcard: either the supplied photo (with a slow Ken Burns push) or the
 * generated terrain art. Both get the same flag plate, rank, scrim and grain.
 */
export const PlaceCard: React.FC<{
  place: Place;
  durationInFrames: number;
  width?: number;
  height?: number;
}> = ({ place, durationInFrames, width = 860, height = 1040 }) => {
  const frame = useCurrentFrame();
  const terrain = terrainTheme[place.terrain];
  const ridges = RIDGES[place.terrain];
  const push = interpolate(frame, [0, durationInFrames], [1.02, 1.1], {
    extrapolateRight: "clamp",
  });
  const sweep = interpolate(frame, [0, durationInFrames], [-40, 120], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 42,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${terrain.skyTop} 0%, ${terrain.skyBottom} 100%)`,
        boxShadow:
          "0 50px 120px rgba(0,0,0,0.62), 0 0 0 1px rgba(255,255,255,0.10) inset",
      }}
    >
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {place.image ? (
          <Img
            src={staticFile(place.image)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                left: "-20%",
                top: `${-10 + push * 4}%`,
                width: "70%",
                height: "70%",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${terrain.glow} 0%, rgba(0,0,0,0) 70%)`,
              }}
            />
            <Motif terrain={place.terrain} accent={terrain.accent} frame={frame} />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: terrain.layers[i],
                  clipPath: ridges[i],
                  transform: `translateX(${(frame / durationInFrames) * (6 + i * 7) * (i % 2 ? 1 : -1)}px) translateY(${i * 4}px)`,
                }}
              />
            ))}
            {/* horizon haze */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "52%",
                height: "26%",
                background: `linear-gradient(180deg, ${terrain.glow} 0%, rgba(0,0,0,0) 100%)`,
                opacity: 0.25,
              }}
            />
          </>
        )}
      </AbsoluteFill>

      {/* readability scrim */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,7,15,0.55) 0%, rgba(4,7,15,0.05) 34%, rgba(4,7,15,0.10) 58%, rgba(4,7,15,0.88) 100%)",
        }}
      />

      {/* light sweep */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: `${sweep}%`,
          width: 220,
          height: "160%",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 100%)",
          transform: "rotate(14deg)",
          opacity: 0.55,
        }}
      />

      {/* grain */}
      <AbsoluteFill
        style={{
          opacity: 0.14,
          backgroundImage:
            "repeating-radial-gradient(circle at 17% 23%, rgba(255,255,255,0.16) 0 1px, transparent 1px 3px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* flag plate */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 16px 8px 8px",
          borderRadius: 999,
          background: "rgba(4,7,15,0.55)",
          border: "1px solid rgba(255,255,255,0.16)",
        }}
      >
        <Img
          src={staticFile(`flags/${place.code}.png`)}
          style={{
            width: 54,
            height: 36,
            objectFit: "cover",
            borderRadius: 6,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.18)",
          }}
        />
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {place.code.toUpperCase()} · {place.chip ?? terrain.label}
        </span>
      </div>

      {/* rank numeral */}
      <div
        style={{
          position: "absolute",
          right: 26,
          bottom: 6,
          fontFamily: "Space Grotesk, Inter, sans-serif",
          fontSize: 250,
          fontWeight: 700,
          lineHeight: 0.8,
          letterSpacing: -12,
          color: "rgba(255,255,255,0.10)",
          WebkitTextStroke: `2px ${place.accent}55`,
        }}
      >
        {String(place.rank).padStart(2, "0")}
      </div>
    </div>
  );
};
