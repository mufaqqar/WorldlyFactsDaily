export type City = {
  rank: number;
  name: string;
  /** Numbeo Cost of Living Index, New York City = 100. */
  index: number;
  rent: number;
  groceries: number;
  dining: number;
  country: string;
  countryCode: string;
  region: string;
  tagline: string;
  descriptor: string;
  image: string;
  audio: string;
  accent: string;
  objectPosition?: string;
};

/**
 * Numbeo Cost of Living Index 2026 Mid-Year — the periodically published
 * historical snapshot (New York City = 100). Figures are copied from
 * https://www.numbeo.com/cost-of-living/rankings.jsp
 *
 * Note: St. Gallen, Lausanne and Bern all publish as 108.7 and are ordered
 * exactly as the source table lists them (7th, 8th, 9th).
 */
export const CITIES: City[] = [
  {
    rank: 10,
    name: "Honolulu",
    index: 105.4,
    rent: 63.9,
    groceries: 128.3,
    dining: 107.8,
    country: "United States",
    countryCode: "us",
    region: "Hawaii · Pacific",
    tagline: "America's island capital",
    descriptor:
      "Groceries here run 28% above New York, before the cost of shipping anything to the middle of the Pacific.",
    image: "cities/10-honolulu.jpg",
    audio: "voiceover/cities/10-honolulu.mp3",
    accent: "#22C55E",
    objectPosition: "50% 52%",
  },
  {
    rank: 9,
    name: "Bern",
    index: 108.7,
    rent: 44.5,
    groceries: 105.7,
    dining: 108.3,
    country: "Switzerland",
    countryCode: "ch",
    region: "Canton of Bern · Europe",
    tagline: "Switzerland's federal capital",
    descriptor:
      "A medieval old town, a strong franc, and some of the tightest housing stock in Europe.",
    image: "cities/09-bern.jpg",
    audio: "voiceover/cities/09-bern.mp3",
    accent: "#F59E0B",
    objectPosition: "50% 50%",
  },
  {
    rank: 8,
    name: "Lausanne",
    index: 108.7,
    rent: 53.2,
    groceries: 107.5,
    dining: 109.2,
    country: "Switzerland",
    countryCode: "ch",
    region: "Vaud · Lake Geneva",
    tagline: "Home of the IOC",
    descriptor:
      "Olympic headquarters sit above Lake Geneva, where lakeside rents carry a steep Swiss premium.",
    image: "cities/08-lausanne.jpg",
    audio: "voiceover/cities/08-lausanne.mp3",
    accent: "#60A5FA",
    objectPosition: "50% 50%",
  },
  {
    rank: 7,
    name: "St. Gallen",
    index: 108.7,
    rent: 41.1,
    groceries: 104.2,
    dining: 113.5,
    country: "Switzerland",
    countryCode: "ch",
    region: "Eastern Switzerland",
    tagline: "A university town near Lake Constance",
    descriptor:
      "Even everyday basics carry the Swiss premium in this compact city between the Alps and Lake Constance.",
    image: "cities/07-st-gallen.jpg",
    audio: "voiceover/cities/07-st-gallen.mp3",
    accent: "#A78BFA",
    objectPosition: "50% 52%",
  },
  {
    rank: 6,
    name: "Lugano",
    index: 110.4,
    rent: 43.4,
    groceries: 107.3,
    dining: 130.7,
    country: "Switzerland",
    countryCode: "ch",
    region: "Ticino · Italian-speaking",
    tagline: "Switzerland's Mediterranean corner",
    descriptor:
      "Dining out scores higher here than anywhere else in the top ten — 31% above New York.",
    image: "cities/06-lugano.jpg",
    audio: "voiceover/cities/06-lugano.mp3",
    accent: "#2DD4BF",
    objectPosition: "50% 52%",
  },
  {
    rank: 5,
    name: "Geneva",
    index: 111.3,
    rent: 64.3,
    groceries: 107.3,
    dining: 114.5,
    country: "Switzerland",
    countryCode: "ch",
    region: "Lake Geneva · Europe",
    tagline: "Diplomacy and private banking",
    descriptor:
      "Home to the United Nations and global private banking, Geneva charges world-capital prices.",
    image: "cities/05-geneva.jpg",
    audio: "voiceover/cities/05-geneva.mp3",
    accent: "#38BDF8",
    objectPosition: "50% 50%",
  },
  {
    rank: 4,
    name: "Basel",
    index: 111.9,
    rent: 48.0,
    groceries: 108.5,
    dining: 110.6,
    country: "Switzerland",
    countryCode: "ch",
    region: "Rhine · Three-border region",
    tagline: "Europe's pharmaceutical hub",
    descriptor:
      "A pharma and art city on the Rhine, where Switzerland, France and Germany meet.",
    image: "cities/04-basel.jpg",
    audio: "voiceover/cities/04-basel.mp3",
    accent: "#F472B6",
    objectPosition: "50% 55%",
  },
  {
    rank: 3,
    name: "Lucerne",
    index: 112.7,
    rent: 48.6,
    groceries: 106.5,
    dining: 123.0,
    country: "Switzerland",
    countryCode: "ch",
    region: "Central Switzerland",
    tagline: "A tourism magnet on the lake",
    descriptor:
      "One of Europe's most visited small cities, where restaurants charge a premium for the view.",
    image: "cities/03-lucerne.jpg",
    audio: "voiceover/cities/03-lucerne.mp3",
    accent: "#93C5FD",
    objectPosition: "50% 50%",
  },
  {
    rank: 2,
    name: "George Town",
    index: 116.5,
    rent: 77.1,
    groceries: 129.8,
    dining: 100.7,
    country: "Cayman Islands",
    countryCode: "ky",
    region: "Grand Cayman · Caribbean",
    tagline: "Offshore finance, island prices",
    descriptor:
      "The Cayman Islands' capital imports almost everything — groceries land 30% above New York.",
    image: "cities/02-george-town.jpg",
    audio: "voiceover/cities/02-george-town.mp3",
    accent: "#FBBF24",
    objectPosition: "50% 50%",
  },
  {
    rank: 1,
    name: "Zurich",
    index: 123.1,
    rent: 74.5,
    groceries: 125.0,
    dining: 121.7,
    country: "Switzerland",
    countryCode: "ch",
    region: "Switzerland · Europe",
    tagline: "The most expensive city on Earth",
    descriptor:
      "Switzerland's largest city tops the index — everyday life costs 23% more than in New York.",
    image: "cities/01-zurich.jpg",
    audio: "voiceover/cities/01-zurich.mp3",
    accent: "#FFD700",
    objectPosition: "50% 46%",
  },
];

export const TOP_INDEX = Math.max(...CITIES.map((city) => city.index));

export const DATA_SOURCE = "Numbeo Cost of Living Index 2026";
export const DATA_EDITION = "2026 Mid-Year";
export const DATA_DATE = "Mid-2026";
export const DATA_NOTE = "New York City = 100";
