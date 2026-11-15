export type Army = {
  rank: number;
  name: string;
  /** Flag plate / country code. */
  code: string;
  /** Global Firepower Power Index — lower is stronger. */
  pwrIndex: number;
  /** Active military personnel. */
  active: number;
  reserve: number;
  /** Active + reserve + paramilitary, GFP estimate. */
  total: number;
  aircraft: number;
  fighters: number;
  tanks: number;
  /** Total naval hulls. */
  naval: number;
  carriers: number;
  subs: number;
  /** Annual defence budget in USD. */
  budget: number;
  region: string;
  tagline: string;
  descriptor: string;
  armyCode: string;
  accent: string;
  audio: string;
  /** Optional flag override, relative to `public/`. */
  flag?: string;
};

/**
 * Global Firepower's 2026 Military Strength Ranking.
 * https://www.globalfirepower.com/countries-listing.php
 *
 * 145 nations are assessed across 60+ factors; the Power Index runs from a
 * theoretically perfect 0.0000 upward, so a lower score means a stronger army.
 */
export const ARMIES: Army[] = [
  {
    rank: 10,
    name: "Italy",
    code: "ITA",
    pwrIndex: 0.2211,
    active: 165_500,
    reserve: 18_300,
    total: 288_800,
    aircraft: 714,
    fighters: 88,
    tanks: 203,
    naval: 285,
    carriers: 2,
    subs: 8,
    budget: 37_325_165_000,
    region: "Southern Europe · Mediterranean",
    tagline: "Two carriers, one Mediterranean cornerstone",
    descriptor:
      "Rome fields two aircraft carriers and 285 hulls — the largest navy in the Mediterranean.",
    armyCode: "it",
    accent: "#22C55E",
    audio: "voiceover/armies/10-italy.mp3",
  },
  {
    rank: 9,
    name: "Türkiye",
    code: "TUR",
    pwrIndex: 0.1975,
    active: 481_000,
    reserve: 380_000,
    total: 1_011_000,
    aircraft: 1_101,
    fighters: 201,
    tanks: 2_284,
    naval: 192,
    carriers: 0,
    subs: 14,
    budget: 51_400_000_000,
    region: "Anatolia · Eastern Mediterranean",
    tagline: "NATO's second-largest standing army",
    descriptor:
      "Nearly half a million active troops, 2,284 tanks and one of the world's fastest-growing drone industries.",
    armyCode: "tr",
    accent: "#EF4444",
    audio: "voiceover/armies/09-turkiye.mp3",
  },
  {
    rank: 8,
    name: "United Kingdom",
    code: "UKD",
    pwrIndex: 0.1881,
    active: 141_330,
    reserve: 31_940,
    total: 173_270,
    aircraft: 625,
    fighters: 103,
    tanks: 288,
    naval: 116,
    carriers: 2,
    subs: 10,
    budget: 88_526_529_585,
    region: "Western Europe · North Atlantic",
    tagline: "Two carriers and a nuclear deterrent",
    descriptor:
      "A blue-water navy, two aircraft carriers and a ballistic-missile submarine on patrol at all times.",
    armyCode: "gb",
    accent: "#3B82F6",
    audio: "voiceover/armies/08-united-kingdom.mp3",
  },
  {
    rank: 7,
    name: "Japan",
    code: "JPN",
    pwrIndex: 0.1876,
    active: 251_500,
    reserve: 56_000,
    total: 332_500,
    aircraft: 1_429,
    fighters: 217,
    tanks: 734,
    naval: 158,
    carriers: 0,
    subs: 23,
    budget: 58_000_000_000,
    region: "East Asia · Western Pacific",
    tagline: "Asia's most modern fleet",
    descriptor:
      "158 hulls, 23 submarines and 1,429 aircraft — a force built for the Pacific and edging away from pacifism.",
    armyCode: "jp",
    accent: "#F43F5E",
    audio: "voiceover/armies/07-japan.mp3",
  },
  {
    rank: 6,
    name: "France",
    code: "FRA",
    pwrIndex: 0.1798,
    active: 264_000,
    reserve: 43_444,
    total: 457_444,
    aircraft: 974,
    fighters: 223,
    tanks: 427,
    naval: 166,
    carriers: 1,
    subs: 9,
    budget: 67_232_395_000,
    region: "Western Europe · Global reach",
    tagline: "Europe's only nuclear carrier fleet",
    descriptor:
      "The Charles de Gaulle is the only nuclear-powered aircraft carrier outside the United States Navy.",
    armyCode: "fr",
    accent: "#60A5FA",
    audio: "voiceover/armies/06-france.mp3",
  },
  {
    rank: 5,
    name: "South Korea",
    code: "SKO",
    pwrIndex: 0.1642,
    active: 450_000,
    reserve: 3_100_000,
    total: 3_670_000,
    aircraft: 1_540,
    fighters: 242,
    tanks: 1_831,
    naval: 215,
    carriers: 0,
    subs: 22,
    budget: 44_800_000_000,
    region: "East Asia · Korean Peninsula",
    tagline: "Three million reservists on standby",
    descriptor:
      "A conscript army backed by 3.1 million reservists, 1,831 tanks and a 242-jet air force.",
    armyCode: "kr",
    accent: "#38BDF8",
    audio: "voiceover/armies/05-south-korea.mp3",
  },
  {
    rank: 4,
    name: "India",
    code: "IND",
    pwrIndex: 0.1346,
    active: 1_431_000,
    reserve: 1_000_000,
    total: 4_958_000,
    aircraft: 2_183,
    fighters: 476,
    tanks: 3_913,
    naval: 343,
    carriers: 2,
    subs: 18,
    budget: 109_000_000_000,
    region: "South Asia · Indian Ocean",
    tagline: "Two carriers. A million reservists.",
    descriptor:
      "The world's second-largest active force — 4.96 million personnel in uniform and two aircraft carriers.",
    armyCode: "in",
    accent: "#F59E0B",
    audio: "voiceover/armies/04-india.mp3",
  },
  {
    rank: 3,
    name: "China",
    code: "CHN",
    pwrIndex: 0.0919,
    active: 2_035_000,
    reserve: 510_000,
    total: 3_170_000,
    aircraft: 3_529,
    fighters: 1_443,
    tanks: 5_870,
    naval: 841,
    carriers: 3,
    subs: 61,
    budget: 303_000_000_000,
    region: "East Asia · Pacific",
    tagline: "The largest navy on Earth, by hull count",
    descriptor:
      "841 warships and 5,870 tanks — the biggest fighting force Asia has ever fielded.",
    armyCode: "cn",
    accent: "#DC2626",
    audio: "voiceover/armies/03-china.mp3",
  },
  {
    rank: 2,
    name: "Russia",
    code: "RUS",
    pwrIndex: 0.0791,
    active: 1_320_000,
    reserve: 2_000_000,
    total: 3_570_000,
    aircraft: 4_237,
    fighters: 861,
    tanks: 5_630,
    naval: 747,
    carriers: 1,
    subs: 66,
    budget: 212_638_272_000,
    region: "Eastern Europe · North Asia",
    tagline: "The largest tank fleet on Earth",
    descriptor:
      "5,630 tanks, 66 submarines and two million reservists behind a full war economy.",
    armyCode: "ru",
    accent: "#94A3B8",
    audio: "voiceover/armies/02-russia.mp3",
  },
  {
    rank: 1,
    name: "United States",
    code: "USA",
    pwrIndex: 0.0741,
    active: 1_333_030,
    reserve: 799_500,
    total: 2_132_530,
    aircraft: 13_032,
    fighters: 1_791,
    tanks: 4_666,
    naval: 465,
    carriers: 11,
    subs: 66,
    budget: 831_500_000_000,
    region: "North America · Global power projection",
    tagline: "Eleven carriers. Global reach.",
    descriptor:
      "Thirteen thousand aircraft, 11 carriers and a defence budget bigger than the next four combined.",
    armyCode: "us",
    accent: "#3B82F6",
    audio: "voiceover/armies/01-united-states.mp3",
    flag: "flags/us-hd.png",
  },
];

export const TOP_ACTIVE = Math.max(...ARMIES.map((army) => army.active));

export const WORLD_ACTIVE = 27_500_000;

export const DATA_SOURCE = "Global Firepower";
export const DATA_EDITION = "2026 edition";
export const DATA_DATE = "2026";
export const DATA_NOTE = "145 nations assessed";
