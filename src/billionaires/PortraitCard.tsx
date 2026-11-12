import { Img, staticFile } from "remotion";
import type { Person } from "./data";
import { displayFamily, goldGradient, palette } from "./theme";

type Props = {
  person: Person;
  enter: number;
  kenBurns: number;
  shine: number;
  flagIn: number;
  frame: number;
  rankPulse: number;
};

const Corner: React.FC<{ top?: boolean; left?: boolean }> = ({ top, left }) => (
  <div
    style={{
      position: "absolute",
      [top ? "top" : "bottom"]: 20,
      [left ? "left" : "right"]: 20,
      width: 34,
      height: 34,
      borderTop: top ? "2px solid rgba(255,215,0,0.75)" : "none",
      borderBottom: top ? "none" : "2px solid rgba(255,215,0,0.75)",
      borderLeft: left ? "2px solid rgba(255,215,0,0.75)" : "none",
      borderRight: left ? "none" : "2px solid rgba(255,215,0,0.75)",
      borderTopLeftRadius: top && left ? 8 : 0,
      borderBottomRightRadius: !top && !left ? 8 : 0,
      opacity: 0.7,
      zIndex: 4,
    }}
  />
);

export const PortraitCard: React.FC<Props> = ({
  person,
  enter,
  kenBurns,
  shine,
  flagIn,
  frame,
  rankPulse,
}) => {
  const translateX = (person.rank % 4 === 0
    ? -110
    : person.rank % 4 === 2
      ? 110
      : 0) * (1 - enter);
  const translateY = (person.rank % 4 === 3 ? -90 : person.rank % 4 === 1 ? 110 : 0) * (1 - enter);

  return (
    <div
      style={{
        position: "relative",
        width: 690,
        height: 790,
        padding: 5,
        borderRadius: 42,
        background:
          "linear-gradient(160deg, rgba(255,230,150,0.85) 0%, rgba(255,215,0,0.25) 22%, rgba(255,255,255,0.06) 48%, rgba(59,130,246,0.38) 100%)",
        boxShadow: `0 50px 120px rgba(0,0,0,0.65), 0 0 80px ${person.accent}22`,
        opacity: enter,
        scale: interpolateScale(enter, 0.93, 1),
        translate: `${translateX}px ${translateY}px`,
        rotate: `${(1 - enter) * (person.rank % 2 === 0 ? -2 : 2)}deg`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 37,
          overflow: "hidden",
          backgroundColor: "#0A1020",
        }}
      >
        <Img
          src={staticFile(person.portrait)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: person.objectPosition ?? "50% 16%",
            scale: kenBurns,
            filter: "contrast(1.06) saturate(0.92) brightness(0.96)",
          }}
        />

        {/* cinematic grade + scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,13,27,0.08) 0%, transparent 32%, rgba(8,13,27,0.34) 68%, rgba(8,13,27,0.94) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 80% 50% at 50% 18%, ${person.accent}18 0%, transparent 62%)`,
            mixBlendMode: "screen",
          }}
        />

        {/* film grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.13,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.55) 0.6px, transparent 0.7px)",
            backgroundSize: "7px 7px",
            backgroundPosition: `${(frame * 0.35) % 7}px ${(frame * 0.6) % 7}px`,
          }}
        />

        {/* rank chip */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 18px 10px 14px",
            borderRadius: 999,
            background: "rgba(8,13,27,0.7)",
            border: "1px solid rgba(255,215,0,0.38)",
            backdropFilter: "blur(12px)",
            scale: 1 + rankPulse * 0.06,
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
            {String(person.rank).padStart(2, "0")}
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

        {/* country flag chip */}
        <div
          style={{
            position: "absolute",
            left: 24,
            bottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "9px 16px 9px 10px",
            borderRadius: 999,
            background: "rgba(8,13,27,0.72)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)",
            opacity: flagIn,
            translate: `0px ${(1 - flagIn) * 18}px`,
          }}
        >
          <span
            style={{
              display: "flex",
              gap: 4,
              borderRadius: 99,
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
            }}
          >
            <Img
              src={staticFile(`flags/${person.countryCode}.png`)}
              style={{
                width: 42,
                height: 28,
                objectFit: "cover",
                display: "block",
              }}
            />
            {person.secondaryCode ? (
              <Img
                src={staticFile(`flags/${person.secondaryCode}.png`)}
                style={{
                  width: 42,
                  height: 28,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : null}
          </span>
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 16,
              letterSpacing: 0.6,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            {person.country}
          </span>
        </div>

        <Corner top left />
        <Corner />

        {/* moving light sweep */}
        <div
          style={{
            position: "absolute",
            top: -140,
            bottom: -140,
            left: -320 + shine * 1160,
            width: 150,
            rotate: "16deg",
            background:
              "linear-gradient(90deg, transparent, rgba(255,248,214,0.24), transparent)",
            filter: "blur(12px)",
            mixBlendMode: "screen",
            opacity: 0.85,
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
          }}
        />
      </div>
    </div>
  );
};

const interpolateScale = (value: number, from: number, to: number) =>
  from + (to - from) * value;
