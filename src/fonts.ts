import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const display = loadSpaceGrotesk("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

export const interFamily = inter.fontFamily;
export const displayFamily = display.fontFamily;

export const monoFamily =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

export const colors = {
  bg: "#05060f",
  bgAlt: "#0b1024",
  ink: "#f5f7ff",
  muted: "#9aa4c7",
  violet: "#8b5cf6",
  blue: "#38bdf8",
  pink: "#f472b6",
  mint: "#34d399",
  amber: "#fbbf24",
};
