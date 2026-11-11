import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { displayFamily, interFamily } from "../fonts";

const mono = loadJetBrainsMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const codeFamily = mono.fontFamily;
export { displayFamily, interFamily };

export const wp = {
  bg: "#04070f",
  bgAlt: "#081427",
  ink: "#f2f7ff",
  muted: "#93a4c4",
  cyan: "#22d3ee",
  sky: "#38bdf8",
  blue: "#2ea3d9",
  indigo: "#6366f1",
  mint: "#34d399",
};

export const nameGradient =
  "linear-gradient(180deg, #ffffff 0%, #d8f4ff 40%, #7fd8f5 78%, #2ea3d9 130%)";

export const ctaGradient =
  "linear-gradient(100deg, #ffffff 0%, #a5f3fc 38%, #38bdf8 70%, #6366f1 100%)";
