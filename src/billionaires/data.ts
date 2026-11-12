export type Person = {
  rank: number;
  name: string;
  nameSuffix?: string;
  netWorth: number; // USD billions
  company: string;
  industry: string;
  country: string;
  countryCode: string;
  secondaryCountry?: string;
  secondaryCode?: string;
  portrait: string;
  audio: string;
  accent: string;
  descriptor: string;
  objectPosition?: string;
};

/**
 * Forbes World's Billionaires 2026 — the 40th annual list, published
 * March 10, 2026. Figures are USD billions and are a snapshot from that
 * publication date. Source: https://www.forbes.com/billionaires/
 */
export const PEOPLE: Person[] = [
  {
    rank: 10,
    name: "Amancio Ortega",
    netWorth: 148,
    company: "Inditex · Zara",
    industry: "Fashion retail",
    country: "Spain",
    countryCode: "es",
    portrait: "portraits/10-amancio-ortega.webp",
    audio: "voiceover/billionaires/10-amancio-ortega.mp3",
    accent: "#F59E0B",
    descriptor: "Founder of Inditex, the fashion group behind Zara.",
    objectPosition: "50% 16%",
  },
  {
    rank: 9,
    name: "Warren Buffett",
    netWorth: 149,
    company: "Berkshire Hathaway",
    industry: "Investing",
    country: "United States",
    countryCode: "us",
    portrait: "portraits/09-warren-buffett.jpg",
    audio: "voiceover/billionaires/09-warren-buffett.mp3",
    accent: "#22C55E",
    descriptor: "Chairman of Berkshire Hathaway since 1970.",
    objectPosition: "50% 14%",
  },
  {
    rank: 8,
    name: "Jensen Huang",
    netWorth: 154,
    company: "Nvidia",
    industry: "AI chips",
    country: "Taiwan · U.S.",
    countryCode: "tw",
    secondaryCountry: "United States",
    secondaryCode: "us",
    portrait: "portraits/08-jensen-huang.jpg",
    audio: "voiceover/billionaires/08-jensen-huang.mp3",
    accent: "#76B900",
    descriptor: "Co-founder and CEO of Nvidia, the AI chip giant.",
    objectPosition: "50% 14%",
  },
  {
    rank: 7,
    name: "Bernard Arnault",
    nameSuffix: "& family",
    netWorth: 171,
    company: "LVMH",
    industry: "Luxury goods",
    country: "France",
    countryCode: "fr",
    portrait: "portraits/07-bernard-arnault.jpg",
    audio: "voiceover/billionaires/07-bernard-arnault.mp3",
    accent: "#E8C97A",
    descriptor: "Chairman and CEO of the luxury empire LVMH.",
    objectPosition: "50% 16%",
  },
  {
    rank: 6,
    name: "Larry Ellison",
    netWorth: 190,
    company: "Oracle",
    industry: "Enterprise software",
    country: "United States",
    countryCode: "us",
    portrait: "portraits/06-larry-ellison.png",
    audio: "voiceover/billionaires/06-larry-ellison.mp3",
    accent: "#F97316",
    descriptor: "Co-founder of Oracle, the enterprise software pioneer.",
    objectPosition: "50% 14%",
  },
  {
    rank: 5,
    name: "Mark Zuckerberg",
    netWorth: 222,
    company: "Meta Platforms",
    industry: "Social media · AI",
    country: "United States",
    countryCode: "us",
    portrait: "portraits/05-mark-zuckerberg.jpg",
    audio: "voiceover/billionaires/05-mark-zuckerberg.mp3",
    accent: "#3B82F6",
    descriptor: "Founder and CEO of Meta, the company behind Facebook.",
    objectPosition: "50% 16%",
  },
  {
    rank: 4,
    name: "Jeff Bezos",
    netWorth: 224,
    company: "Amazon",
    industry: "E-commerce · Cloud",
    country: "United States",
    countryCode: "us",
    portrait: "portraits/04-jeff-bezos.jpg",
    audio: "voiceover/billionaires/04-jeff-bezos.mp3",
    accent: "#FF9900",
    descriptor: "Founder of Amazon, the e-commerce and cloud giant.",
    objectPosition: "50% 14%",
  },
  {
    rank: 3,
    name: "Sergey Brin",
    netWorth: 237,
    company: "Google · Alphabet",
    industry: "Search · AI",
    country: "United States",
    countryCode: "us",
    portrait: "portraits/03-sergey-brin.jpg",
    audio: "voiceover/billionaires/03-sergey-brin.mp3",
    accent: "#60A5FA",
    descriptor: "Co-founder of Google, now part of Alphabet.",
    objectPosition: "50% 16%",
  },
  {
    rank: 2,
    name: "Larry Page",
    netWorth: 257,
    company: "Google · Alphabet",
    industry: "Search · AI",
    country: "United States",
    countryCode: "us",
    portrait: "portraits/02-larry-page.jpg",
    audio: "voiceover/billionaires/02-larry-page.mp3",
    accent: "#2563EB",
    descriptor: "Co-founder of Google, now part of Alphabet.",
    objectPosition: "50% 16%",
  },
  {
    rank: 1,
    name: "Elon Musk",
    netWorth: 839,
    company: "Tesla · SpaceX",
    industry: "EVs · Space · AI",
    country: "United States",
    countryCode: "us",
    portrait: "portraits/01-elon-musk.jpg",
    audio: "voiceover/billionaires/01-elon-musk.mp3",
    accent: "#FFD700",
    descriptor: "CEO of Tesla and SpaceX — the richest person on Earth.",
    objectPosition: "50% 16%",
  },
];

export const TOP_WEALTH = Math.max(...PEOPLE.map((person) => person.netWorth));

export const DATA_SOURCE = "Forbes World's Billionaires 2026";
export const DATA_DATE = "March 10, 2026";
export const DATA_NOTE = "Net worth snapshot at publication";
