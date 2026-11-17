// The places story keeps the premium documentary system used by the other
// rankings, with a terrain palette layered on top of the shared navy / gold.
export {
  blueGradient,
  displayFamily,
  goldGradient,
  goldHorizontal,
  interFamily,
  monoFamily,
  palette,
  panelGradient,
  textGlow,
} from "../billionaires/theme";

/** Silhouette family drawn behind each place card. */
export type Terrain =
  | "island"
  | "desert"
  | "savanna"
  | "mountain"
  | "lagoon"
  | "coast"
  | "falls";

type TerrainTheme = {
  /** Human label used on the card chip. */
  label: string;
  skyTop: string;
  skyBottom: string;
  /** Radial glow behind the horizon. */
  glow: string;
  /** Back → mid → front silhouette fills. */
  layers: [string, string, string];
  accent: string;
};

export const terrainTheme: Record<Terrain, TerrainTheme> = {
  island: {
    label: "Rice terraces",
    skyTop: "#0B2A38",
    skyBottom: "#125B63",
    glow: "rgba(94,234,212,0.34)",
    layers: ["#0F4A54", "#0C3A43", "#08303A"],
    accent: "#5EEAD4",
  },
  desert: {
    label: "Volcanic tuff",
    skyTop: "#2A1220",
    skyBottom: "#7A3B2E",
    glow: "rgba(251,146,60,0.34)",
    layers: ["#5C2A24", "#42201F", "#2B1517"],
    accent: "#FB923C",
  },
  savanna: {
    label: "Open plains",
    skyTop: "#241A08",
    skyBottom: "#7C5A18",
    glow: "rgba(253,224,71,0.34)",
    layers: ["#6B4E14", "#4A3610", "#2E220A"],
    accent: "#FDE047",
  },
  mountain: {
    label: "Alpine",
    skyTop: "#0B1730",
    skyBottom: "#334B7A",
    glow: "rgba(147,197,253,0.30)",
    layers: ["#2C4370", "#1E3054", "#12203A"],
    accent: "#93C5FD",
  },
  lagoon: {
    label: "Lagoon",
    skyTop: "#04222E",
    skyBottom: "#0E7490",
    glow: "rgba(103,232,249,0.34)",
    layers: ["#0E6A80", "#0A5062", "#073845"],
    accent: "#67E8F9",
  },
  coast: {
    label: "Caldera coast",
    skyTop: "#0D1B33",
    skyBottom: "#2B5EA8",
    glow: "rgba(191,219,254,0.30)",
    layers: ["#24508F", "#183A6B", "#102848"],
    accent: "#BFDBFE",
  },
  falls: {
    label: "Rainforest falls",
    skyTop: "#071F1A",
    skyBottom: "#146B52",
    glow: "rgba(110,231,183,0.32)",
    layers: ["#125E48", "#0C4636", "#083327"],
    accent: "#6EE7B7",
  },
};
