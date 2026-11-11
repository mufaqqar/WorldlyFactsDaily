import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FEATURES_FRAMES } from "../timeline";
import { codeFamily, displayFamily, interFamily, wp } from "./theme";

type Service = {
  title: string;
  body: string;
  accent: string;
  icon: React.FC<{ color: string }>;
};

const BrowserIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4.5"
      width="18"
      height="15"
      rx="2.5"
      stroke={color}
      strokeWidth="1.8"
    />
    <path d="M3 9h18" stroke={color} strokeWidth="1.8" />
    <circle cx="6.2" cy="6.8" r="0.9" fill={color} />
    <circle cx="8.8" cy="6.8" r="0.9" fill={color} />
    <path
      d="M7 13h5M7 16h8"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

const CartIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 5h2l1.6 9.2a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 2-1.6L21 8H7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="19.2" r="1.4" fill={color} />
    <circle cx="18" cy="19.2" r="1.4" fill={color} />
  </svg>
);

const GaugeIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 17a8 8 0 1 1 16 0"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 17 16.2 10"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1.6" fill={color} />
  </svg>
);

const SERVICES: Service[] = [
  {
    title: "Custom Themes",
    body: "Hand-coded, lightweight themes built around your brand.",
    accent: wp.cyan,
    icon: BrowserIcon,
  },
  {
    title: "WooCommerce",
    body: "Stores that scale, from product page to checkout.",
    accent: wp.indigo,
    icon: CartIcon,
  },
  {
    title: "Speed & SEO",
    body: "Core Web Vitals, caching and clean markup that ranks.",
    accent: wp.mint,
    icon: GaugeIcon,
  },
];

export const MufaqarServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: FEATURES_FRAMES - 22,
    durationInFrames: 22,
    config: { damping: 200 },
  });

  const kickerIn = spring({
    frame,
    fps,
    delay: 0,
    durationInFrames: 22,
    config: { damping: 200 },
  });

  const headingIn = spring({
    frame,
    fps,
    delay: 4,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exit,
        transform: `translateY(${interpolate(exit, [0, 1], [0, -40])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 1500,
        }}
      >
        <div
          style={{
            fontFamily: codeFamily,
            fontSize: 17,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: wp.cyan,
            opacity: kickerIn * 0.9,
            transform: `translateY(${interpolate(kickerIn, [0, 1], [14, 0])}px)`,
          }}
        >
          What I build
        </div>

        <div
          style={{
            marginTop: 16,
            fontFamily: displayFamily,
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: -2,
            color: wp.ink,
            opacity: headingIn,
            transform: `translateY(${interpolate(headingIn, [0, 1], [30, 0])}px)`,
          }}
        >
          Fast, custom WordPress
        </div>

        <div
          style={{
            marginTop: 64,
            display: "flex",
            gap: 36,
          }}
        >
          {SERVICES.map((service, i) => {
            const enter = spring({
              frame,
              fps,
              delay: 12 + i * 7,
              durationInFrames: 40,
              config: { damping: 18, stiffness: 120 },
            });

            const float = Math.sin((frame / fps) * 1.4 + i * 1.1) * 7;

            return (
              <div
                key={service.title}
                style={{
                  position: "relative",
                  width: 460,
                  height: 312,
                  padding: "38px 36px",
                  borderRadius: 28,
                  border: "1px solid rgba(160,215,255,0.12)",
                  background:
                    "linear-gradient(180deg, rgba(120,190,255,0.085) 0%, rgba(120,190,255,0.02) 100%)",
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 34px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(190,230,255,0.1)`,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [90, 0]) + float}px) scale(${interpolate(
                    enter,
                    [0, 1],
                    [0.94, 1],
                  )})`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)`,
                    opacity: 0.9,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 260,
                    height: 260,
                    right: -110,
                    top: -120,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${service.accent}30 0%, transparent 70%)`,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 76,
                    height: 76,
                    borderRadius: 20,
                    border: `1px solid ${service.accent}55`,
                    backgroundColor: `${service.accent}14`,
                    boxShadow: `0 0 34px ${service.accent}26`,
                  }}
                >
                  <service.icon color={service.accent} />
                </div>

                <div
                  style={{
                    marginTop: 26,
                    fontFamily: displayFamily,
                    fontSize: 40,
                    fontWeight: 600,
                    letterSpacing: -0.5,
                    color: wp.ink,
                  }}
                >
                  {service.title}
                </div>

                <div
                  style={{
                    marginTop: 12,
                    fontFamily: interFamily,
                    fontSize: 21,
                    lineHeight: 1.5,
                    color: wp.muted,
                  }}
                >
                  {service.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
