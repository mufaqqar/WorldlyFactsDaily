import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Place } from "./data";
import { PlaceCard } from "./PlaceCard";
import { displayFamily, interFamily, palette } from "./theme";

const StatBox: React.FC<{
  label: string;
  value: string;
  accent: string;
  progress: number;
}> = ({ label, value, accent, progress }) => (
  <div
    style={{
      flex: 1,
      padding: "26px 26px",
      borderRadius: 20,
      background:
        "linear-gradient(150deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 100%)",
      border: "1px solid rgba(148,163,184,0.18)",
      borderTop: `2px solid ${accent}`,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [22, 0])}px)`,
    }}
  >
    <div
      style={{
        fontFamily: displayFamily,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: 3.2,
        textTransform: "uppercase",
        color: palette.mutedDeep,
      }}
    >
      {label}
    </div>
    <div
      style={{
        marginTop: 8,
        fontFamily: interFamily,
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: -0.4,
        color: palette.ink,
      }}
    >
      {value}
    </div>
  </div>
);

/** Scenes 02–11 — one place per scene, ranked 10 → 1. */
export const PlaceProfile: React.FC<{
  place: Place;
  durationInFrames: number;
  variant: number;
}> = ({ place, durationInFrames, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({
    frame,
    fps,
    durationInFrames: 30,
    config: { damping: 16, stiffness: 100 },
  });
  const nameIn = spring({
    frame,
    fps,
    delay: 10,
    durationInFrames: 26,
    config: { damping: 18 },
  });
  const blurbIn = spring({
    frame,
    fps,
    delay: 20,
    durationInFrames: 26,
    config: { damping: 18 },
  });
  const statsIn = spring({
    frame,
    fps,
    delay: 28,
    durationInFrames: 26,
    config: { damping: 18 },
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ position: "absolute", inset: 0, opacity: exit }}>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [64, 0])}px) scale(${interpolate(cardIn, [0, 1], [0.94, 1])}) rotate(${interpolate(cardIn, [0, 1], [variant % 2 === 0 ? -1.6 : 1.6, 0])}deg)`,
        }}
      >
        <PlaceCard
          place={place}
          durationInFrames={durationInFrames}
          width={880}
          height={1050}
        />
      </div>

      <div style={{ position: "absolute", top: 1210, left: 72, right: 72 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: nameIn,
            transform: `translateY(${interpolate(nameIn, [0, 1], [26, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3.4,
              color: place.accent,
            }}
          >
            {String(place.rank).padStart(2, "0")}
          </span>
          <span style={{ width: 34, height: 2, background: place.accent, opacity: 0.6 }} />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 3.2,
              textTransform: "uppercase",
              color: palette.mutedDeep,
            }}
          >
            {place.tagline}
          </span>
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: displayFamily,
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 0.96,
            letterSpacing: -3,
            color: palette.ink,
            opacity: nameIn,
            transform: `translateY(${interpolate(nameIn, [0, 1], [30, 0])}px)`,
          }}
        >
          {place.name}
        </div>

        <div
          style={{
            marginTop: 14,
            fontFamily: interFamily,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: 0.2,
            color: palette.goldSoft,
            opacity: nameIn,
          }}
        >
          {place.location}
        </div>

        <div
          style={{
            marginTop: 24,
            fontFamily: interFamily,
            fontSize: 28,
            lineHeight: 1.46,
            color: palette.muted,
            opacity: blurbIn,
            transform: `translateY(${interpolate(blurbIn, [0, 1], [20, 0])}px)`,
          }}
        >
          {place.blurb}
        </div>

        <div style={{ marginTop: 34, display: "flex", gap: 18 }}>
          <StatBox
            label={place.statA.label}
            value={place.statA.value}
            accent={place.accent}
            progress={statsIn}
          />
          <StatBox
            label={place.statB.label}
            value={place.statB.value}
            accent={place.accent}
            progress={statsIn}
          />
        </div>
      </div>
    </div>
  );
};
