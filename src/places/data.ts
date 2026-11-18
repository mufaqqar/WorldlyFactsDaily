import type { Terrain } from "./theme";

export type PlaceStat = {
  label: string;
  value: string;
};

export type Place = {
  /** Countdown slot, 10 → 1. */
  rank: number;
  name: string;
  /** Location line under the name. */
  location: string;
  /** ISO-3166 alpha-2 code for the flag plate. */
  code: string;
  terrain: Terrain;
  tagline: string;
  blurb: string;
  statA: PlaceStat;
  statB: PlaceStat;
  accent: string;
  /** Overrides the terrain label on the card chip. */
  chip?: string;
  /** Narration clip, relative to `public/`. */
  audio: string;
  /** Optional photo, relative to `public/`. Falls back to terrain art. */
  image?: string;
};

/**
 * A curated, editorial selection — there is no official ranking of the
 * world's most beautiful places, so the order is presentation only.
 *
 * Facts are limited to figures that are stable and easy to verify:
 * UNESCO inscriptions, park establishment dates, altitudes, and the
 * published counts for Iguazú (275 falls) and Ha Long Bay (~2,000 islets).
 * Attribution and the per-place notes live in `public/places/sources.json`.
 */
export const PLACES: Place[] = [
  {
    rank: 10,
    name: "Ubud",
    location: "Bali · Indonesia",
    code: "id",
    terrain: "island",
    tagline: "The cultural heart of Bali",
    blurb:
      "Temple courtyards, jungle ravines and the stepped rice terraces of Tegallalang, an hour inland from the surf.",
    statA: { label: "Signature", value: "Tegallalang terraces" },
    statB: { label: "Elevation", value: "600 m" },
    accent: "#5EEAD4",
    audio: "voiceover/places/10-ubud.mp3",
    image: "places/10-ubud.jpg",
  },
  {
    rank: 9,
    name: "Cappadocia",
    location: "Anatolia · Türkiye",
    code: "tr",
    terrain: "desert",
    tagline: "Where the balloons rise",
    blurb:
      "Ash from ancient volcanoes, eroded into fairy chimneys and valleys that glow at first light.",
    statA: { label: "Signature", value: "Sunrise balloons" },
    statB: { label: "Rock", value: "Volcanic tuff" },
    accent: "#FB923C",
    audio: "voiceover/places/09-cappadocia.mp3",
    image: "places/09-cappadocia.jpg",
  },
  {
    rank: 8,
    name: "Serengeti",
    location: "Tanzania · East Africa",
    code: "tz",
    terrain: "savanna",
    tagline: "The great migration",
    blurb:
      "Thirty thousand square kilometres of grassland where the herds follow the rains in a loop that never ends.",
    statA: { label: "Area", value: "30,000 km²" },
    statB: { label: "Migration", value: "~1.5M wildebeest" },
    accent: "#FDE047",
    audio: "voiceover/places/08-serengeti.mp3",
    image: "places/08-serengeti.jpg",
  },
  {
    rank: 7,
    name: "Banff",
    location: "Alberta · Canada",
    code: "ca",
    terrain: "mountain",
    tagline: "Turquoise under ten peaks",
    blurb:
      "Canada's first national park, where glacier-fed lakes sit below the jagged wall of the Valley of the Ten Peaks.",
    statA: { label: "Established", value: "1885" },
    statB: { label: "Lake", value: "Moraine" },
    accent: "#93C5FD",
    audio: "voiceover/places/07-banff.mp3",
    image: "places/07-banff.jpg",
  },
  {
    rank: 6,
    name: "Bora Bora",
    location: "Society Islands · French Polynesia",
    code: "pf",
    terrain: "lagoon",
    tagline: "A lagoon in every blue",
    blurb:
      "A ring of motus around a lagoon that fades from jade to cobalt, under the basalt spire of Mount Otemanu.",
    statA: { label: "Peak", value: "Otemanu · 727 m" },
    statB: { label: "Setting", value: "Barrier reef" },
    accent: "#67E8F9",
    audio: "voiceover/places/06-bora-bora.mp3",
    image: "places/06-bora-bora.jpg",
  },
  {
    rank: 5,
    name: "Santorini",
    location: "Cyclades · Greece",
    code: "gr",
    terrain: "coast",
    tagline: "The caldera at sunset",
    blurb:
      "White villages hang on the rim of a drowned volcano, above water that turns copper as the sun drops.",
    statA: { label: "Sunset", value: "Oia" },
    statB: { label: "Island group", value: "Cyclades" },
    accent: "#BFDBFE",
    audio: "voiceover/places/05-santorini.mp3",
    image: "places/05-santorini.jpg",
  },
  {
    rank: 4,
    name: "Iguazú Falls",
    location: "Misiones · Argentina & Brazil",
    code: "ar",
    terrain: "falls",
    tagline: "275 falls, one roar",
    blurb:
      "A basalt curtain split into hundreds of cascades, with the Devil's Throat throwing spray into the rainforest.",
    statA: { label: "Falls", value: "275" },
    statB: { label: "Border", value: "Argentina · Brazil" },
    accent: "#6EE7B7",
    audio: "voiceover/places/04-iguazu.mp3",
    image: "places/04-iguazu.jpg",
  },
  {
    rank: 3,
    name: "Ha Long Bay",
    location: "Quảng Ninh · Vietnam",
    code: "vn",
    terrain: "coast",
    tagline: "Karsts out of the sea",
    blurb:
      "Almost two thousand limestone islands and islets rising from the Gulf of Tonkin, riddled with caves.",
    statA: { label: "Islets", value: "~2,000" },
    statB: { label: "UNESCO", value: "1994" },
    accent: "#A5F3FC",
    chip: "Karst bay",
    audio: "voiceover/places/03-ha-long.mp3",
    image: "places/03-ha-long.jpg",
  },
  {
    rank: 2,
    name: "Machu Picchu",
    location: "Cusco · Peru",
    code: "pe",
    terrain: "mountain",
    tagline: "The city in the clouds",
    blurb:
      "An Inca citadel on a ridge at 2,430 metres, wrapped in cloud forest above the Urubamba valley.",
    statA: { label: "Built", value: "~1450" },
    statB: { label: "Altitude", value: "2,430 m" },
    accent: "#FDBA74",
    chip: "Cloud forest",
    audio: "voiceover/places/02-machu-picchu.mp3",
    image: "places/02-machu-picchu.jpg",
  },
  {
    rank: 1,
    name: "Jökulsárlón",
    location: "Vatnajökull · Iceland",
    code: "is",
    terrain: "falls",
    tagline: "Where icebergs meet the sea",
    blurb:
      "Ice calved from Breiðamerkurjökull drifts across a glacial lagoon and washes up on a black sand shore.",
    statA: { label: "Glacier", value: "Breiðamerkurjökull" },
    statB: { label: "Park", value: "Vatnajökull" },
    accent: "#BAE6FD",
    chip: "Glacier lagoon",
    audio: "voiceover/places/01-jokulsarlon.mp3",
    image: "places/01-jokulsarlon.jpg",
  },
];
