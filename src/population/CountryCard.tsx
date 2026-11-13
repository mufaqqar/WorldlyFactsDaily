import { Img, staticFile } from "remotion";
import type { Country } from "./data";
import { displayFamily, goldGradient, palette } from "./theme";

type Props = {
  country: Country;
  enter: number;
  shine: number;
  flagIn: number;
  frame: number;
  rankPulse: number;
  isFinale?: boolean;
};

const Corner: React.FC<{ top?: boolean; left?: boolean }> = ({ top, left }) => (
  <div
    style={{
      position: "absolute",
      [top ? "top" : "bottom"]: 16,
      [left ? "left" : "right"]: 16,
      width: 34,
      height: 34,
      borderTop: top ? "2px solid rgba(255,215,0,0.75)" : "none",
      borderBottom: top ? "none" : "2px solid rgba(255,215,0,0.75)",
      borderLeft: left ? "2px solid rgba(255,215,0,0.75)" : "none",
      borderRight: left ? "none" : "2px solid rgba(255,215,0,0.75)",
      borderTopLeftRadius: top && left ? 8 : 0,
      borderBottomRightRadius: !top && !left ? 8 : 0,
      opacity: 0.72,
      zIndex: 5,
    }}
  />
);

/**
 * A museum-style flag plate: the flag sits sharp on top of a blurred copy of
 * itself, so every aspect ratio from 2:1 to 4:3 fills the frame without cropping.
 */
export const CountryCard: React.FC<Props> = ({
  country,
  enter,
  shine,
  flagIn,
  frame,
  rankPulse,
  isFinale = false,
}) => {
  const translateX = (country.rank % 4 === 0
    ? -110
    : country.rank % 4 === 2
      ? 110
      : 0) * (1 - enter);
  const translateY =
    (country.rank % 4 === 3 ? -90 : country.rank % 4 === 1 ? 110 : 0) * (1 - enter);

  const flagSrc = staticFile(
    country.flag ?? `flags/${country.countryCode}.png`,
  );

  return (
    <div
      style={{
        position: "relative",
        width: 800,
        height: 592,
        padding: 5,
        borderRadius: 40,
        background:
          "linear-gradient(160deg, rgba(255,230,150,0.85) 0%, rgba(255,215,0,0.25) 22%, rgba(255,255,255,0.06) 48%, rgba(59,130,246,0.38) 100%)",
        boxShadow: `0 50px 120px rgba(0,0,0,0.65), 0 0 80px ${country.accent}22`,
        opacity: enter,
        scale: 0.93 + 0.07 * enter,
        translate: `${translateX}px ${translateY}px`,
        rotate: `${(1 - enter) * (country.rank % 2 === 0 ? -1.6 : 1.6)}deg`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 35,
          overflow: "hidden",
          backgroundColor: "#0A1020",
        }}
      >
        {/* blurred flag backdrop */}
        <Img
          src={flagSrc}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: 1.3,
            filter: "blur(38px) saturate(1.25) brightness(0.55)",
            opacity: 0.85,
          }}
        />

        {/* sharp flag, letterboxed */}
        <div style={{ position: "absolute", inset: 26 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow:
                "0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.18)",
            }}
          >
            <Img
              src={flagSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* cinematic grade + scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,13,27,0.34) 0%, transparent 24%, transparent 70%, rgba(8,13,27,0.72) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 86% 60% at 50% 40%, ${country.accent}1f 0%, transparent 66%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        {/* film grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.55) 0.6px, transparent 0.7px)",
            backgroundSize: "7px 7px",
            backgroundPosition: `${(frame * 0.35) % 7}px ${(frame * 0.6) % 7}px`,
            pointerEvents: "none",
          }}
        />

        {/* rank chip */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 18px 10px 14px",
            borderRadius: 999,
            background: "rgba(8,13,27,0.66)",
            border: "1px solid rgba(255,215,0,0.38)",
            backdropFilter: "blur(12px)",
            scale: 1 + rankPulse * 0.06,
            zIndex: 4,
          }}
        >
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1,
              background: goldGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {String(country.rank).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 11,
              letterSpacing: 2.6,
              color: "rgba(255,255,255,0.66)",
            }}
          >
            RANK
          </span>
        </div>

        {/* country code chip */}
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 16px",
            borderRadius: 999,
            background: "rgba(8,13,27,0.66)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)",
            opacity: flagIn,
            translate: `0px ${(1 - flagIn) * 18}px`,
            zIndex: 4,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              backgroundColor: country.accent,
              boxShadow: `0 0 10px ${country.accent}`,
            }}
          />
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 14,
              letterSpacing: 3.4,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {country.code}
          </span>
        </div>

        {/* tagline chip */}
        <div
          style={{
            position: "absolute",
            right: 22,
            bottom: 24,
            maxWidth: 500,
            textAlign: "right",
            fontFamily: displayFamily,
            fontSize: 12,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.72)",
            opacity: flagIn * 0.92,
            translate: `0px ${(1 - flagIn) * 14}px`,
            zIndex: 4,
          }}
        >
          {country.tagline}
        </div>

        <Corner top left />
        <Corner />

        {/* moving light sweep */}
        <div
          style={{
            position: "absolute",
            top: -140,
            bottom: -140,
            left: -320 + shine * 1220,
            width: 150,
            rotate: "16deg",
            background:
              "linear-gradient(90deg, transparent, rgba(255,248,214,0.22), transparent)",
            filter: "blur(12px)",
            mixBlendMode: "screen",
            opacity: 0.85,
            pointerEvents: "none",
          }}
        />

        {/* slow scanline */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${(frame * 1.4) % 110}%`,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)",
            opacity: 0.22,
            pointerEvents: "none",
          }}
        />

        {isFinale ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 35,
              boxShadow: `inset 0 0 90px ${palette.gold}33`,
              pointerEvents: "none",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
