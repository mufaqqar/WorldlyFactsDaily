// Source: World Steel Association (worldsteel), crude steel production 2024.
// Figures in million metric tonnes (Mt). Year-on-year change vs 2023.

export type Producer = {
  code: string;
  name: string;
  value: number;
  yoy: number;
  share: number;
};

export const WORLD_2024 = 1886.3;
export const WORLD_2023 = 1904.1;
export const CHINA_VALUE = 1005.1;
export const TOP10_TOTAL = 1592.1;
export const NEXT_NINE_TOTAL = TOP10_TOTAL - CHINA_VALUE;

export const PRODUCERS: Producer[] = [
  { code: "CHN", name: "China", value: 1005.1, yoy: -2.3, share: 53.3 },
  { code: "IND", name: "India", value: 149.4, yoy: 6.1, share: 7.9 },
  { code: "JPN", name: "Japan", value: 84.0, yoy: -3.4, share: 4.5 },
  { code: "USA", name: "United States", value: 79.5, yoy: -2.3, share: 4.2 },
  { code: "RUS", name: "Russia", value: 71.0, yoy: -6.6, share: 3.8 },
  { code: "KOR", name: "South Korea", value: 63.6, yoy: -4.7, share: 3.4 },
  { code: "DEU", name: "Germany", value: 37.3, yoy: 5.4, share: 2.0 },
  { code: "TUR", name: "Türkiye", value: 36.9, yoy: 9.5, share: 2.0 },
  { code: "BRA", name: "Brazil", value: 33.9, yoy: 5.9, share: 1.8 },
  { code: "IRN", name: "Iran", value: 31.4, yoy: 2.3, share: 1.7 },
];

export const MAX_VALUE = PRODUCERS[0].value;

export const MOMENTUM = [
  { name: "Türkiye", yoy: 9.5 },
  { name: "India", yoy: 6.1 },
  { name: "Brazil", yoy: 5.9 },
  { name: "Germany", yoy: 5.4 },
  { name: "Iran", yoy: 2.3 },
  { name: "China", yoy: -2.3 },
  { name: "Japan", yoy: -3.4 },
  { name: "South Korea", yoy: -4.7 },
  { name: "Russia", yoy: -6.6 },
];

export const formatMt = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

export const formatSigned = (value: number) =>
  `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}%`;
