// Source: World Bank, GDP per capita (current US$) — NY.GDP.PCAP.CD
// Ranked across sovereign states (aggregates and dependent territories excluded).
// Values are for 1960 and 2024 as reported by the World Bank.

export type Change = "up" | "down" | "new" | null;

export type Entry = {
  code: string;
  name: string;
  value: number;
  rank: number;
  change: Change;
  delta?: number;
};

export const MAX_1960 = 3000;
export const MAX_2024 = 288002;

export const LIST_1960: Entry[] = [
  { code: "USA", name: "United States", value: 3000, rank: 1, change: null },
  { code: "NZL", name: "New Zealand", value: 2334, rank: 2, change: null },
  { code: "CAN", name: "Canada", value: 2265, rank: 3, change: null },
  { code: "LUX", name: "Luxembourg", value: 2261, rank: 4, change: null },
  { code: "SWE", name: "Sweden", value: 2128, rank: 5, change: null },
  { code: "CHE", name: "Switzerland", value: 1984, rank: 6, change: null },
  { code: "AUS", name: "Australia", value: 1813, rank: 7, change: null },
  { code: "ISL", name: "Iceland", value: 1486, rank: 8, change: null },
  { code: "BHS", name: "Bahamas", value: 1459, rank: 9, change: null },
  { code: "ISR", name: "Israel", value: 1452, rank: 10, change: null },
];

export const LIST_2024: Entry[] = [
  { code: "MCO", name: "Monaco", value: 288002, rank: 1, change: "new" },
  { code: "LIE", name: "Liechtenstein", value: 220167, rank: 2, change: "new" },
  { code: "LUX", name: "Luxembourg", value: 137782, rank: 3, change: "up", delta: 1 },
  { code: "IRL", name: "Ireland", value: 112895, rank: 4, change: "new" },
  { code: "CHE", name: "Switzerland", value: 107702, rank: 5, change: "up", delta: 1 },
  { code: "SGP", name: "Singapore", value: 94897, rank: 6, change: "new" },
  { code: "NOR", name: "Norway", value: 89889, rank: 7, change: "new" },
  { code: "USA", name: "United States", value: 86170, rank: 8, change: "down", delta: 7 },
  { code: "ISL", name: "Iceland", value: 85863, rank: 9, change: "down", delta: 1 },
  { code: "QAT", name: "Qatar", value: 75685, rank: 10, change: "new" },
];

export const formatUsd = (value: number) =>
  `$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;

export const formatCompact = (value: number) => {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `$${thousands >= 100 ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
  }
  return `$${value}`;
};
