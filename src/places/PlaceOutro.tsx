import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  displayFamily,
  goldGradient,
  interFamily,
  palette,
  textGlow,
} from "./theme";

/** Scene 12 — recap, save prompt and the engagement question. */
export const PlaceOutro: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ring = spring({ frame, fps, durationInFrames: 40, config: { damping: 20 } });
  const head = spring({ frame, fps, delay: 8, durationInFrames: 30, config: { damping: 17 } });
  const sub = spring({ frame, fps, delay: 22, durationInFrames: 28, config: { damping: 18 } });
  const cta = spring({ frame, fps, delay: 38, durationInFrames: 26, config: { damping: 18 } });

  const spin = interpolate(frame, [0, durationInFrames], [0, 26]);
  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "0 76px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        opacity: exit,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 240,
          height: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 34,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${palette.line}`,
            borderTopColor: palette.gold,
            transform: `rotate(${spin}deg) scale(${interpolate(ring, [0, 1], [0.7, 1])})`,
            opacity: ring,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 34,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 34% 28%, rgba(255,233,138,0.30) 0%, rgba(59,130,246,0.14) 48%, rgba(4,7,15,0) 74%)",
          }}
        />
        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 74,
            fontWeight: 700,
            letterSpacing: -2,
            background: goldGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: ring,
          }}
        >
          10
        </div>
      </div>

      <div
        style={{
          fontFamily: displayFamily,
          fontSize: 92,
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: -2.6,
          color: palette.ink,
          textShadow: textGlow,
          opacity: head,
          transform: `translateY(${interpolate(head, [0, 1], [30, 0])}px)`,
        }}
      >
        10 places.
        <br />
        One planet.
      </div>

      <div
        style={{
          marginTop: 34,
          width: 190,
          height: 3,
          background: goldGradient,
          opacity: sub * 0.85,
        }}
      />

      <div
        style={{
          marginTop: 34,
          fontFamily: interFamily,
          fontSize: 30,
          fontWeight: 500,
          lineHeight: 1.45,
          color: palette.muted,
          opacity: sub,
        }}
      >
        Save this for your next trip.
      </div>

      <div
        style={{
          marginTop: 30,
          padding: "18px 30px",
          borderRadius: 999,
          border: `1px solid ${palette.line}`,
          background: "rgba(8,13,27,0.66)",
          fontFamily: displayFamily,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: 0.2,
          color: palette.goldPale,
          opacity: cta,
          transform: `translateY(${interpolate(cta, [0, 1], [22, 0])}px)`,
        }}
      >
        Which one would you go to first?
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: interFamily,
          fontSize: 17,
          lineHeight: 1.5,
          color: palette.mutedDeep,
          opacity: cta * 0.9,
        }}
      >
        Curated editorial selection · no official ranking · figures from UNESCO,
        <br />
        park records and published counts
      </div>
    </div>
  );
};
