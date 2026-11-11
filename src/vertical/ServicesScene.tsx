import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SERVICES_FRAMES } from "./timeline";
import { codeFamily, displayFamily, interFamily, wp } from "../mufaqar/theme";

type Service = {
  kicker: string;
  title: string;
  body: string;
  accent: string;
  icon: React.FC<{ color: string }>;
};

const CmsIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" />
    <path
      d="M3.4 9.4h17.2M3.4 14.6h17.2M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"
      stroke={color}
      strokeWidth="1.4"
      opacity="0.75"
    />
  </svg>
);

const AtomIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
    <ellipse
      cx="12"
      cy="12"
      rx="9.4"
      ry="4"
      stroke={color}
      strokeWidth="1.6"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="9.4"
      ry="4"
      stroke={color}
      strokeWidth="1.6"
      transform="rotate(60 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="9.4"
      ry="4"
      stroke={color}
      strokeWidth="1.6"
      transform="rotate(120 12 12)"
    />
    <circle cx="12" cy="12" r="1.7" fill={color} />
  </svg>
);

const CartIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
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

const SERVICES: Service[] = [
  {
    kicker: "wordpress",
    title: "Custom WordPress",
    body: "Themes, plugins, migrations and maintenance — built to stay fast under real traffic.",
    accent: wp.cyan,
    icon: CmsIcon,
  },
  {
    kicker: "react · next.js",
    title: "React & Next.js Apps",
    body: "Headless CMS, REST APIs, TypeScript and Tailwind. Ship a product, not a brochure.",
    accent: wp.sky,
    icon: AtomIcon,
  },
  {
    kicker: "e-commerce",
    title: "WooCommerce Stores",
    body: "Product pages, checkout and Core Web Vitals tuned for conversion and search.",
    accent: wp.mint,
    icon: CartIcon,
  },
];

export const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: SERVICES_FRAMES - 20,
    durationInFrames: 20,
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
    delay: 5,
    durationInFrames: 30,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 70px",
        paddingBottom: 30,
        opacity: 1 - exit,
        translate: interpolate(exit, [0, 1], ["0px 0px", "0px -50px"]),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            opacity: kickerIn * 0.9,
            translate: interpolate(kickerIn, [0, 1], ["0px 14px", "0px 0px"]),
          }}
        >
          What I build
        </div>

        <div
          style={{
            marginTop: 18,
            marginBottom: 34,
            maxWidth: 900,
            fontFamily: displayFamily,
            fontSize: 66,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -2.2,
            color: wp.ink,
            textAlign: "center",
            opacity: headingIn,
            translate: interpolate(headingIn, [0, 1], ["0px 30px", "0px 0px"]),
          }}
        >
          One developer.
          <br />
          <span style={{ color: "#8fdcf3" }}>The whole stack.</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            width: "100%",
            maxWidth: 940,
          }}
        >
          {SERVICES.map((service, i) => {
            const enter = spring({
              frame,
              fps,
              delay: 14 + i * 9,
              durationInFrames: 44,
              config: { damping: 18, stiffness: 110 },
            });

            return (
              <div
                key={service.title}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "30px 32px",
                  borderRadius: 26,
                  border: "1px solid rgba(160,215,255,0.12)",
                  background:
                    "linear-gradient(120deg, rgba(120,190,255,0.09) 0%, rgba(120,190,255,0.02) 100%)",
                  boxShadow:
                    "0 28px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(190,230,255,0.09)",
                  overflow: "hidden",
                  opacity: enter,
                  translate: interpolate(enter, [0, 1], ["70px 0px", "0px 0px"]),
                  scale: interpolate(enter, [0, 1], [0.96, 1]),
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: `linear-gradient(180deg, transparent, ${service.accent}, transparent)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    right: -140,
                    top: -140,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${service.accent}26 0%, transparent 70%)`,
                  }}
                />

                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 92,
                    height: 92,
                    borderRadius: 24,
                    border: `1px solid ${service.accent}55`,
                    backgroundColor: `${service.accent}14`,
                    boxShadow: `0 0 34px ${service.accent}22`,
                  }}
                >
                  <service.icon color={service.accent} />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontFamily: codeFamily,
                      fontSize: 17,
                      letterSpacing: 3.4,
                      textTransform: "uppercase",
                      color: service.accent,
                      opacity: 0.9,
                    }}
                  >
                    {service.kicker}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: displayFamily,
                      fontSize: 42,
                      fontWeight: 600,
                      letterSpacing: -0.8,
                      color: wp.ink,
                    }}
                  >
                    {service.title}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: interFamily,
                      fontSize: 24,
                      lineHeight: 1.45,
                      color: wp.muted,
                    }}
                  >
                    {service.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
