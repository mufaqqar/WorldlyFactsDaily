import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OUTRO_FRAMES } from "./timeline";
import { codeFamily, ctaGradient, displayFamily, interFamily, wp } from "../mufaqar/theme";

const Line: React.FC<{
  children: React.ReactNode;
  delay: number;
  gradient?: string;
}> = ({ children, delay, gradient }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay,
    durationInFrames: 44,
    config: { damping: 20, stiffness: 110 },
  });

  return (
    <div style={{ overflow: "hidden", paddingBottom: 12 }}>
      <div
        style={{
          translate: interpolate(enter, [0, 1], ["0px 110%", "0px 0%"]),
          opacity: Math.min(1, enter * 2),
          ...(gradient
            ? {
                background: gradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }
            : { color: wp.ink }),
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: OUTRO_FRAMES - 16,
    durationInFrames: 16,
    config: { damping: 200 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 24,
    config: { damping: 200 },
  });

  const pillIn = spring({
    frame,
    fps,
    delay: 46,
    durationInFrames: 34,
    config: { damping: 16, stiffness: 120 },
  });

  const noteIn = spring({
    frame,
    fps,
    delay: 58,
    durationInFrames: 28,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        paddingBottom: 20,
        opacity: 1 - exit,
        scale: interpolate(exit, [0, 1], [1, 1.03]),
      }}
    >
      {/* Rotating conic halo */}
      <div
        style={{
          position: "absolute",
          width: 1040,
          height: 1040,
          borderRadius: "50%",
          rotate: `${frame * 0.55}deg`,
          scale: interpolate(frame, [0, 60], [0.82, 1], {
            extrapolateRight: "clamp",
          }),
          background: `conic-gradient(from 0deg, transparent 0deg, ${wp.cyan}33 70deg, transparent 150deg, ${wp.indigo}2e 240deg, transparent 320deg)`,
          maskImage:
            "radial-gradient(circle, transparent 58%, black 59%, black 61%, transparent 62%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 58%, black 59%, black 61%, transparent 62%)",
          opacity: 0.95,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: codeFamily,
            fontSize: 20,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: wp.cyan,
            opacity: kickerIn,
            translate: interpolate(kickerIn, [0, 1], ["0px 14px", "0px 0px"]),
            marginBottom: 32,
          }}
        >
          Let's work together
        </div>

        <div
          style={{
            fontFamily: displayFamily,
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1.04,
          }}
        >
          <Line delay={8}>Let's build</Line>
          <Line delay={16} gradient={ctaGradient}>
            something fast.
          </Line>
        </div>

        {/* Call to action pill */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 38px 18px 24px",
            borderRadius: 999,
            border: "1px solid rgba(165,243,252,0.24)",
            background:
              "linear-gradient(180deg, rgba(120,210,255,0.14), rgba(120,210,255,0.03))",
            boxShadow: `0 26px 70px rgba(0,0,0,0.5), 0 0 50px ${wp.cyan}1f`,
            opacity: pillIn,
            translate: interpolate(pillIn, [0, 1], ["0px 50px", "0px 0px"]),
            scale: interpolate(pillIn, [0, 1], [0.9, 1]),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${wp.cyan}, ${wp.indigo})`,
              boxShadow: `0 0 26px ${wp.cyan}70`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke="#04121c"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: interFamily,
              fontSize: 38,
              fontWeight: 600,
              color: wp.ink,
              letterSpacing: 0.2,
            }}
          >
            mufaqar.com
          </span>
        </div>

        {/* Contact lines */}
        <div
          style={{
            marginTop: 34,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            fontFamily: codeFamily,
            fontSize: 24,
            letterSpacing: 1.2,
            color: "#cfe6f7",
            opacity: noteIn,
            translate: interpolate(noteIn, [0, 1], ["0px 16px", "0px 0px"]),
          }}
        >
          <span>info@mufaqar.com</span>
          <span style={{ color: "#8fa6c2", fontSize: 21 }}>
            +92 302 6006 280
          </span>
        </div>

        <div
          style={{
            marginTop: 28,
            maxWidth: 780,
            fontFamily: interFamily,
            fontSize: 22,
            lineHeight: 1.5,
            color: wp.muted,
            opacity: noteIn * 0.8,
          }}
        >
          Replies within 24 hours · Fixed scope · No obligation
        </div>
      </div>
    </AbsoluteFill>
  );
};
