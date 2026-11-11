import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { STACK_FRAMES } from "./timeline";
import { codeFamily, displayFamily, interFamily, wp } from "../mufaqar/theme";

const ROW_A = [
  "WordPress",
  "WooCommerce",
  "PHP",
  "MySQL",
  "Laravel",
  "Shopify",
  "CodeIgniter",
];

const ROW_B = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "REST APIs",
  "Vercel",
];

const PILL_WIDTH = 300;
const PILL_GAP = 18;
const SET_WIDTH = ROW_A.length * (PILL_WIDTH + PILL_GAP);

const Row: React.FC<{
  items: string[];
  accent: string;
  offset: number;
  direction: 1 | -1;
}> = ({ items, accent, offset, direction }) => {
  const frame = useCurrentFrame();

  const travel = (frame * 3.6 + offset) % SET_WIDTH;
  const translate = direction === 1 ? -travel : travel - SET_WIDTH;

  return (
    <div
      style={{
        display: "flex",
        gap: PILL_GAP,
        width: "100%",
        overflow: "hidden",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: PILL_GAP,
          translate: `${translate}px 0px`,
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((set) =>
          items.map((item) => (
            <div
              key={`${set}-${item}`}
              style={{
                width: PILL_WIDTH,
                flexShrink: 0,
                height: 82,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: "1px solid rgba(160,215,255,0.14)",
                background:
                  "linear-gradient(180deg, rgba(120,190,255,0.1), rgba(120,190,255,0.02))",
                boxShadow:
                  "0 14px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(190,230,255,0.1)",
                fontFamily: interFamily,
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: 0.2,
                color: "#dbeaf8",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  marginRight: 12,
                  backgroundColor: accent,
                  boxShadow: `0 0 12px ${accent}`,
                  opacity: 0.85,
                }}
              />
              {item}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export const StackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame,
    fps,
    delay: STACK_FRAMES - 18,
    durationInFrames: 18,
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

  const noteIn = spring({
    frame,
    fps,
    delay: 40,
    durationInFrames: 26,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exit,
        translate: interpolate(exit, [0, 1], ["0px 0px", "0px -40px"]),
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
          Tech stack
        </div>

        <div
          style={{
            marginTop: 18,
            marginBottom: 54,
            fontFamily: displayFamily,
            fontSize: 68,
            fontWeight: 600,
            letterSpacing: -2.2,
            color: wp.ink,
            opacity: headingIn,
            translate: interpolate(headingIn, [0, 1], ["0px 30px", "0px 0px"]),
          }}
        >
          Tools I use daily
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: "100%",
          }}
        >
          <Row items={ROW_A} accent={wp.cyan} offset={0} direction={1} />
          <Row items={ROW_B} accent={wp.indigo} offset={900} direction={-1} />
        </div>

        <div
          style={{
            marginTop: 46,
            fontFamily: codeFamily,
            fontSize: 21,
            letterSpacing: 2,
            color: wp.muted,
            opacity: noteIn * 0.8,
            translate: interpolate(noteIn, [0, 1], ["0px 12px", "0px 0px"]),
          }}
        >
          …and whatever the project needs.
        </div>
      </div>
    </AbsoluteFill>
  );
};
