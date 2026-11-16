import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { displayFamily, goldGradient, palette } from "./theme";

export const StatBox: React.FC<{
  label: string;
  value: string;
  accent: string;
  progress: number;
  delay?: number;
}> = ({ label, value, accent, progress, delay = 26 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    delay,
    durationInFrames: 22,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        flex: 1,
        padding: "14px 16px 13px",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.085)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.012))",
        boxShadow: "0 16px 34px rgba(0,0,0,0.28)",
        opacity: enter,
        translate: `0px ${(1 - enter) * 18}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: displayFamily,
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: palette.muted,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            backgroundColor: accent,
            boxShadow: `0 0 10px ${accent}`,
            flexShrink: 0,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: displayFamily,
          fontSize: 29,
          fontWeight: 700,
          letterSpacing: -0.8,
          fontVariantNumeric: "tabular-nums",
          color: palette.ink,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          height: 3,
          borderRadius: 99,
          backgroundColor: "rgba(148,163,184,0.16)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(0, progress)) * 100}%`,
            borderRadius: 99,
            background: goldGradient,
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
};
