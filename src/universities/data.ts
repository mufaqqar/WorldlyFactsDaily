export type University = {
  /** Countdown slot, 10 → 1. */
  rank: number;
  /** Official QS World University Rankings 2027 position. */
  qsRank: number;
  /** True when QS lists the position as a tie (=2, =8). */
  joint?: boolean;
  name: string;
  fullName: string;
  city: string;
  country: string;
  /** ISO-3166 alpha-2 code used for the flag plate. */
  code: string;
  /** Latin motto shown on the card chip. */
  motto: string;
  founded: number;
  students: number;
  international: number;
  faculty: number;
  region: string;
  tagline: string;
  /** Headline sentence, shown first in the long-form chapter. */
  descriptor: string;
  /** Supporting facts that cycle through the chapter. */
  facts: string[];
  accent: string;
  audio: string;
  /** Optional flag override, relative to `public/`. */
  flag?: string;
};

/**
 * QS World University Rankings 2027 (published 18 June 2026).
 * https://www.topuniversities.com/world-university-rankings
 *
 * Student and staff counts are taken from each university's QS profile.
 * Imperial College London and Stanford share second place; ETH Zurich and
 * UCL share eighth.
 */
export const UNIVERSITIES: University[] = [
  {
    rank: 10,
    qsRank: 10,
    name: "NUS",
    fullName: "National University of Singapore",
    city: "Singapore",
    country: "Singapore",
    code: "SGP",
    motto: "LEADING FROM ASIA",
    founded: 1905,
    students: 37_865,
    international: 15_641,
    faculty: 5_276,
    region: "Singapore · Southeast Asia",
    tagline: "Asia's highest-ranked university",
    descriptor:
      "Singapore's flagship campus: 37,865 students, and the highest QS position in Asia.",
    facts: [
      "It began in 1905 as a medical school, and became the National University of Singapore in 1980.",
      "The Kent Ridge campus is home to 17 faculties and schools, from law and medicine to design.",
      "NUS is the highest-ranked university in Asia in the 2027 QS table.",
    ],
    accent: "#F59E0B",
    audio: "voiceover/universities/10-nus.mp3",
    flag: "flags/sg.png",
  },
  {
    rank: 9,
    qsRank: 8,
    joint: true,
    name: "UCL",
    fullName: "University College London",
    city: "London",
    country: "United Kingdom",
    code: "GBR",
    motto: "LONDON'S GLOBAL UNIVERSITY",
    founded: 1826,
    students: 48_014,
    international: 29_881,
    faculty: 6_837,
    region: "London · United Kingdom",
    tagline: "London's original university",
    descriptor:
      "48,014 students from more than 150 countries — the largest student body on this list.",
    facts: [
      "Founded in 1826, UCL opened to students of any religion at a time when Oxford and Cambridge did not.",
      "It was the first university in England to admit women on equal terms with men, in 1878.",
      "Nearly 30,000 of its students come from outside the UK — more than any other university here.",
    ],
    accent: "#8B5CF6",
    audio: "voiceover/universities/09-ucl.mp3",
    flag: "flags/gb.png",
  },
  {
    rank: 8,
    qsRank: 8,
    joint: true,
    name: "ETH Zurich",
    fullName: "ETH Zurich",
    city: "Zurich",
    country: "Switzerland",
    code: "CHE",
    motto: "EIDGENÖSSISCHE TECHNISCHE HOCHSCHULE",
    founded: 1855,
    students: 23_198,
    international: 10_286,
    faculty: 2_928,
    region: "Zurich · Switzerland",
    tagline: "Einstein's alma mater",
    descriptor:
      "Continental Europe's top-ranked university, and the school where Einstein studied physics.",
    facts: [
      "Founded in 1855 as the Swiss Federal Polytechnic, it became ETH Zurich in 1911.",
      "Albert Einstein studied here, graduated in 1900, and returned as a professor in 1912.",
      "Roughly 44 percent of its 23,198 students come from outside Switzerland.",
    ],
    accent: "#60A5FA",
    audio: "voiceover/universities/08-eth-zurich.mp3",
    flag: "flags/ch.png",
  },
  {
    rank: 7,
    qsRank: 7,
    name: "Caltech",
    fullName: "California Institute of Technology",
    city: "Pasadena",
    country: "United States",
    code: "USA",
    motto: "THE TRUTH SHALL MAKE YOU FREE",
    founded: 1891,
    students: 2_430,
    international: 810,
    faculty: 914,
    region: "Pasadena · United States",
    tagline: "Small campus, enormous science",
    descriptor:
      "Just 2,430 students — and 46 Nobel laureates among its alumni, faculty and researchers.",
    facts: [
      "It was founded in 1891 as Throop University, and took the Caltech name in 1920.",
      "Caltech manages NASA's Jet Propulsion Laboratory, which built and flies the Mars rovers.",
      "Its 914 faculty teach only 2,430 students — a ratio of fewer than three students per academic.",
    ],
    accent: "#FB923C",
    audio: "voiceover/universities/07-caltech.mp3",
    flag: "flags/us.png",
  },
  {
    rank: 6,
    qsRank: 6,
    name: "Cambridge",
    fullName: "University of Cambridge",
    city: "Cambridge",
    country: "United Kingdom",
    code: "GBR",
    motto: "HINC LUCEM ET POCULA SACRA",
    founded: 1209,
    students: 21_180,
    international: 7_973,
    faculty: 5_502,
    region: "Cambridge · United Kingdom",
    tagline: "Eight centuries of breakthroughs",
    descriptor:
      "Newton, Darwin and Turing studied here. Teaching has continued since 1209.",
    facts: [
      "Cambridge began in 1209, when scholars left Oxford after a dispute with the townspeople.",
      "It is a federation of 31 colleges, each with its own halls, tutors and traditions.",
      "Newton wrote the Principia here, and the Cavendish Laboratory has hosted decades of Nobel-winning physics.",
    ],
    accent: "#38BDF8",
    audio: "voiceover/universities/06-cambridge.mp3",
    flag: "flags/gb.png",
  },
  {
    rank: 5,
    qsRank: 5,
    name: "Harvard",
    fullName: "Harvard University",
    city: "Cambridge",
    country: "United States",
    code: "USA",
    motto: "VERITAS",
    founded: 1636,
    students: 23_937,
    international: 6_021,
    faculty: 4_456,
    region: "Cambridge · United States",
    tagline: "The largest endowment in academia",
    descriptor:
      "Founded in 1636, Harvard holds the biggest university endowment on Earth — over $50 billion.",
    facts: [
      "Harvard is the oldest university in the United States, founded just sixteen years after the Mayflower.",
      "Its library system is the largest academic library in the world, with more than 20 million volumes.",
      "Eight U.S. presidents studied here, from John Adams to Barack Obama.",
    ],
    accent: "#D11F3C",
    audio: "voiceover/universities/05-harvard.mp3",
    flag: "flags/us.png",
  },
  {
    rank: 4,
    qsRank: 4,
    name: "Oxford",
    fullName: "University of Oxford",
    city: "Oxford",
    country: "United Kingdom",
    code: "GBR",
    motto: "DOMINUS ILLUMINATIO MEA",
    founded: 1096,
    students: 22_152,
    international: 9_087,
    faculty: 6_598,
    region: "Oxford · United Kingdom",
    tagline: "The oldest university on this list",
    descriptor:
      "Teaching since 1096. The oldest university in the English-speaking world, and fourth overall.",
    facts: [
      "Teaching at Oxford is recorded as early as 1096 — a full nine centuries of continuous instruction.",
      "Its tutorial system still pairs one or two students with a specialist academic every week.",
      "The Bodleian Library holds more than 13 million printed items across its reading rooms.",
    ],
    accent: "#2563EB",
    audio: "voiceover/universities/04-oxford.mp3",
    flag: "flags/gb.png",
  },
  {
    rank: 3,
    qsRank: 2,
    joint: true,
    name: "Stanford",
    fullName: "Stanford University",
    city: "Stanford",
    country: "United States",
    code: "USA",
    motto: "DIE LUFT DER FREIHEIT WEHT",
    founded: 1885,
    students: 17_580,
    international: 3_538,
    faculty: 5_055,
    region: "Stanford · United States",
    tagline: "Silicon Valley's founding campus",
    descriptor:
      "The campus that seeded Silicon Valley, now tied for second in the world.",
    facts: [
      "Leland and Jane Stanford founded the university in 1885 in memory of their son, who died at fifteen.",
      "Its 8,180-acre campus is one of the largest in the United States.",
      "Stanford alumni and staff went on to found Google, HP, Netflix and dozens of other technology companies.",
    ],
    accent: "#B91C1C",
    audio: "voiceover/universities/03-stanford.mp3",
    flag: "flags/us.png",
  },
  {
    rank: 2,
    qsRank: 2,
    joint: true,
    name: "Imperial",
    fullName: "Imperial College London",
    city: "London",
    country: "United Kingdom",
    code: "GBR",
    motto: "SCIENTIA IMPERII DECUS ET TUTAMEN",
    founded: 1907,
    students: 20_360,
    international: 10_802,
    faculty: 4_082,
    region: "London · United Kingdom",
    tagline: "Science and medicine, South Kensington",
    descriptor:
      "Half of Imperial's 20,360 students come from outside the UK. Tied for second on the planet.",
    facts: [
      "Imperial was formed in 1907 by merging the Royal College of Science, the Royal School of Mines and City & Guilds College.",
      "Its South Kensington campus sits beside the Natural History Museum and the Science Museum.",
      "More than half its students are international — one of the highest shares in the world.",
    ],
    accent: "#3B82F6",
    audio: "voiceover/universities/02-imperial.mp3",
    flag: "flags/gb.png",
  },
  {
    rank: 1,
    qsRank: 1,
    name: "MIT",
    fullName: "Massachusetts Institute of Technology",
    city: "Cambridge",
    country: "United States",
    code: "USA",
    motto: "MENS ET MANUS · MIND AND HAND",
    founded: 1861,
    students: 11_694,
    international: 3_808,
    faculty: 3_112,
    region: "Cambridge · United States",
    tagline: "Mind and hand",
    descriptor:
      "The world's most relentless engineering school — and, once again, the best university on Earth.",
    facts: [
      "MIT has held the top spot in the QS ranking every year since 2012.",
      "Alumni have launched more than 30,000 active companies, generating an estimated $1.9 trillion a year.",
      "Its motto, Mens et Manus, means mind and hand — theory and making, in equal measure.",
    ],
    accent: "#E11D48",
    audio: "voiceover/universities/01-mit.mp3",
    flag: "flags/us-hd.png",
  },
];

export const TOP_STUDENTS = Math.max(
  ...UNIVERSITIES.map((university) => university.students),
);

export const TOP_FACULTY = Math.max(
  ...UNIVERSITIES.map((university) => university.faculty),
);

export const TOTAL_STUDENTS = UNIVERSITIES.reduce(
  (sum, university) => sum + university.students,
  0,
);

export const COUNTRIES = new Set(
  UNIVERSITIES.map((university) => university.country),
).size;

export const DATA_SOURCE = "QS World University Rankings";
export const DATA_EDITION = "2027 edition";
export const DATA_DATE = "2027";
export const DATA_NOTE = "1,500+ universities assessed";
