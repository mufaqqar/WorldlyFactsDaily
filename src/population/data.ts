export type Country = {
  rank: number;
  name: string;
  /** Three-letter code shown on the flag plate. */
  code: string;
  /** UN estimate for 2026. */
  population: number;
  /** Share of the world population, in percent. */
  share: number;
  /** Yearly change, in percent. */
  growth: number;
  /** People per square kilometre. */
  density: number;
  medianAge: number;
  region: string;
  tagline: string;
  descriptor: string;
  countryCode: string;
  accent: string;
  audio: string;
  /** Optional flag override, relative to `public/`. */
  flag?: string;
};

/**
 * Worldometer's 2026 country table, which is based on the latest United Nations
 * Population Division estimates.
 * https://www.worldometers.info/world-population/population-by-country/
 *
 * Values are a 2026 snapshot and are not live counters.
 */
export const COUNTRIES: Country[] = [
  {
    rank: 10,
    name: "Ethiopia",
    code: "ETH",
    population: 138_902_185,
    share: 1.7,
    growth: 2.53,
    density: 127,
    medianAge: 19.3,
    region: "Horn of Africa",
    tagline: "Africa's second most populous country",
    descriptor:
      "A median age of nineteen, and one of the fastest-growing populations on Earth.",
    countryCode: "et",
    accent: "#F59E0B",
    audio: "voiceover/population/10-ethiopia.mp3",
  },
  {
    rank: 9,
    name: "Russia",
    code: "RUS",
    population: 143_394_458,
    share: 1.7,
    growth: -0.42,
    density: 9,
    medianAge: 40.7,
    region: "Eastern Europe · North Asia",
    tagline: "The largest country on Earth",
    descriptor:
      "Eleven time zones, and fewer people than Bangladesh. The population is shrinking every year.",
    countryCode: "ru",
    accent: "#60A5FA",
    audio: "voiceover/population/09-russia.mp3",
  },
  {
    rank: 8,
    name: "Bangladesh",
    code: "BGD",
    population: 177_818_044,
    share: 2.1,
    growth: 1.21,
    density: 1_366,
    medianAge: 26.3,
    region: "South Asia · Ganges Delta",
    tagline: "The densest large country on Earth",
    descriptor:
      "One hundred seventy-eight million people on a delta roughly the size of Iowa.",
    countryCode: "bd",
    accent: "#10B981",
    audio: "voiceover/population/08-bangladesh.mp3",
  },
  {
    rank: 7,
    name: "Brazil",
    code: "BRA",
    population: 213_562_666,
    share: 2.6,
    growth: 0.35,
    density: 26,
    medianAge: 35.2,
    region: "South America",
    tagline: "South America's giant",
    descriptor:
      "The largest population in Latin America, across a country bigger than the continental United States.",
    countryCode: "br",
    accent: "#FBBF24",
    audio: "voiceover/population/07-brazil.mp3",
  },
  {
    rank: 6,
    name: "Nigeria",
    code: "NGA",
    population: 242_431_832,
    share: 2.9,
    growth: 2.06,
    density: 266,
    medianAge: 18.3,
    region: "West Africa",
    tagline: "Africa's most populous country",
    descriptor:
      "A median age of eighteen, and a population still growing by two percent every year.",
    countryCode: "ng",
    accent: "#22C55E",
    audio: "voiceover/population/06-nigeria.mp3",
  },
  {
    rank: 5,
    name: "Pakistan",
    code: "PAK",
    population: 259_299_792,
    share: 3.1,
    growth: 1.6,
    density: 303,
    medianAge: 20.8,
    region: "South Asia · Indus Valley",
    tagline: "South Asia's second giant",
    descriptor:
      "Two hundred fifty-nine million people, growing faster than every country above it except Nigeria.",
    countryCode: "pk",
    accent: "#34D399",
    audio: "voiceover/population/05-pakistan.mp3",
  },
  {
    rank: 4,
    name: "Indonesia",
    code: "IDN",
    population: 287_886_782,
    share: 3.5,
    growth: 0.76,
    density: 159,
    medianAge: 30.7,
    region: "Southeast Asia",
    tagline: "The world's largest archipelago",
    descriptor:
      "Seventeen thousand islands, with more than half of the population concentrated on Java.",
    countryCode: "id",
    accent: "#F43F5E",
    audio: "voiceover/population/04-indonesia.mp3",
  },
  {
    rank: 3,
    name: "United States",
    code: "USA",
    population: 349_035_494,
    share: 4.2,
    growth: 0.51,
    density: 38,
    medianAge: 38.7,
    region: "North America",
    tagline: "The only high-income country in the top ten",
    descriptor:
      "Adding one person roughly every eighteen seconds, driven mostly by migration.",
    countryCode: "us",
    accent: "#3B82F6",
    audio: "voiceover/population/03-united-states.mp3",
    flag: "flags/us-hd.png",
  },
  {
    rank: 2,
    name: "China",
    code: "CHN",
    population: 1_412_914_089,
    share: 17.0,
    growth: -0.22,
    density: 151,
    medianAge: 40.6,
    region: "East Asia",
    tagline: "The former number one",
    descriptor:
      "For decades the most populous country on Earth — now losing people every year.",
    countryCode: "cn",
    accent: "#EF4444",
    audio: "voiceover/population/02-china.mp3",
  },
  {
    rank: 1,
    name: "India",
    code: "IND",
    population: 1_476_625_576,
    share: 17.8,
    growth: 0.87,
    density: 497,
    medianAge: 29.2,
    region: "South Asia",
    tagline: "Nearly one in five humans",
    descriptor:
      "One point four eight billion people, and still growing by thirteen million a year.",
    countryCode: "in",
    accent: "#FF9933",
    audio: "voiceover/population/01-india.mp3",
  },
];

export const TOP_SHARE = Math.max(...COUNTRIES.map((country) => country.share));

export const WORLD_POPULATION = 8_290_000_000;

export const DATA_SOURCE = "UN World Population Prospects";
export const DATA_EDITION = "2026 estimate";
export const DATA_DATE = "2026";
export const DATA_NOTE = "World total ≈ 8.29 billion";
