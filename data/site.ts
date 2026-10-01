import projects from "../public/data/projects.json"

export const RESUME_URL =
  "https://drive.google.com/file/d/1k2zxRTrVIFK9JSo1tg6REfruVdYWQcDE/view?usp=sharing"
export const EMAIL = "contact@muhammadsiddiq.com"
export const SOCIALS = [
  { name: "GitHub", href: "https://github.com/muhammadsiddiq" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/muhammadsiddiq/" },
  { name: "Stack Overflow", href: "https://stackoverflow.com" },
]

export type Market = {
  id: string
  country: string
  city: string
  tz: string
  coords: [number, number]
}

export const MARKETS: Record<string, Market> = {
  pk: { id: "pk", country: "Pakistan", city: "Karachi", tz: "Asia/Karachi", coords: [24.86, 67.0] },
  ae: { id: "ae", country: "UAE", city: "Dubai", tz: "Asia/Dubai", coords: [25.2, 55.27] },
  sa: { id: "sa", country: "Saudi Arabia", city: "Riyadh", tz: "Asia/Riyadh", coords: [24.71, 46.68] },
  jp: { id: "jp", country: "Japan", city: "Osaka", tz: "Asia/Tokyo", coords: [34.69, 135.5] },
  sg: { id: "sg", country: "Singapore", city: "Singapore", tz: "Asia/Singapore", coords: [1.35, 103.82] },
  it: { id: "it", country: "Italy", city: "Milan", tz: "Europe/Rome", coords: [45.46, 9.19] },
  mt: { id: "mt", country: "Malta", city: "Valletta", tz: "Europe/Malta", coords: [35.9, 14.51] },
  pl: { id: "pl", country: "Poland", city: "Warsaw", tz: "Europe/Warsaw", coords: [52.23, 21.01] },
  ca: { id: "ca", country: "Canada", city: "Montréal", tz: "America/Toronto", coords: [45.5, -73.57] },
  au: { id: "au", country: "Australia", city: "Sydney", tz: "Australia/Sydney", coords: [-33.87, 151.21] },
  us: { id: "us", country: "United States", city: "New York", tz: "America/New_York", coords: [40.71, -74.0] },
}

/** Which market each project ships to. "global" = worldwide store listing. */
const PROJECT_MARKET: Record<string, string> = {
  Juice: "us",
  Oraan: "pk",
  "FH Personal": "ae",
  "Finance House Biz": "ae",
  Walaplus: "sa",
  Wroom: "us",
  Schoolify: "us",
  "Awrad App": "us",
  "Tennis Tournament": "us",
  "eZRX Mobile": "sg",
  "Dubai Smart Travel": "ae",
  Slyde: "mt",
  Snapex: "ca",
  Mobility: "it",
  Scanability: "us",
  "Peach-e": "jp",
  Golfer: "au",
  "My Pitch": "ca",
  Pabel: "pl",
}

export type Project = {
  id: string
  name: string
  about: string
  sector: string
  summary: string
  market?: Market
  playStoreLink?: string
  appStoreLink?: string
  contribution: string[]
  builtWith: string[]
}

export const ALL_PROJECTS: Project[] = projects.map((p, i) => {
  const [summary, ...rest] = p.about.split(". ")
  return {
    id: `P_${String(i + 1).padStart(2, "0")}`,
    name: p.name,
    about: p.about,
    summary: summary.replace(/\.$/, ""),
    sector: rest.join(". ").replace(/\.$/, "") || "Product",
    market: MARKETS[PROJECT_MARKET[p.name]],
    playStoreLink: p.playStoreLink || undefined,
    appStoreLink: p.appStoreLink || undefined,
    contribution: p.contribution,
    builtWith: p.builtWith,
  }
})

export type ScreenKind =
  | "savings"
  | "bank"
  | "dashboard"
  | "rewards"
  | "boarding"
  | "orders"
  | "transit"
  | "scan"

export type Featured = {
  name: string
  headline: string
  kind: ScreenKind
  accent: string
  stack: string[]
}

/** The eight apps in the pinned "selected work" reel. */
export const FEATURED: (Featured & Project)[] = (
  [
    {
      name: "Oraan",
      headline: "Saving together, the way families always have, now in a pocket.",
      kind: "savings",
      accent: "#7C5CFF",
      stack: ["Flutter", "Fintech", "Payments", "iOS · Android"],
    },
    {
      name: "FH Personal",
      headline: "Salaries, bills and transfers for the UAE, in one calm app.",
      kind: "bank",
      accent: "#0EA5A4",
      stack: ["Kotlin", "Swift", "Banking", "Security"],
    },
    {
      name: "Finance House Biz",
      headline: "Cash position for a whole business, readable at a glance.",
      kind: "dashboard",
      accent: "#2563EB",
      stack: ["Corporate banking", "Dashboards", "iOS · Android"],
    },
    {
      name: "Walaplus",
      headline: "Rewards that make employees actually want to open the app.",
      kind: "rewards",
      accent: "#E11D74",
      stack: ["HR Tech", "Loyalty", "Arabic & English"],
    },
    {
      name: "Peach-e",
      headline: "Check-in and boarding passes for travellers across Japan.",
      kind: "boarding",
      accent: "#F2559B",
      stack: ["Airline", "Booking", "Check-in"],
    },
    {
      name: "eZRX Mobile",
      headline: "Pharmacies restock medicine in a few taps, across Asia.",
      kind: "orders",
      accent: "#16A34A",
      stack: ["B2B", "Healthcare", "Supply chain"],
    },
    {
      name: "Dubai Smart Travel",
      headline: "Every route through Dubai, planned before you leave the door.",
      kind: "transit",
      accent: "#F59E0B",
      stack: ["Travel Tech", "Maps", "Real-time"],
    },
    {
      name: "Wroom",
      headline: "Point the camera at a car. Know exactly what it is.",
      kind: "scan",
      accent: "#FF5426",
      stack: ["AI / ML", "Computer vision", "Camera"],
    },
  ] as Featured[]
).map((f) => ({ ...ALL_PROJECTS.find((p) => p.name === f.name)!, ...f }))

export const MARKET_LIST = Object.values(MARKETS).map((m) => ({
  ...m,
  apps: ALL_PROJECTS.filter((p) => p.market?.id === m.id).map((p) => p.name),
}))

export const STATS = [
  { value: ALL_PROJECTS.length, suffix: "", label: "apps shipped to production" },
  { value: Object.keys(MARKETS).length, suffix: "", label: "countries with my code in pockets" },
  { value: 2, suffix: "", label: "stores · App Store & Google Play" },
  { value: 100, suffix: "%", label: "remote, any time zone" },
]

export const TECH_LOGOS = [
  "flutter",
  "dart",
  "kotlin",
  "java",
  "android",
  "react-native",
  "react",
  "nextjs",
  "typescript",
  "javascript",
  "nodejs",
  "nestjs",
  "graphql",
  "firebase",
  "postgresql",
  "mongodb",
  "redis",
  "sqlite",
  "tailwindcss",
  "figma",
  "git",
  "github",
]

export const SYSTEMS = [
  {
    id: "SYS_01",
    title: "Native-feeling mobile",
    body: "One codebase or two, the app should feel at home on both iPhone and Android.",
    tags: ["Flutter", "Dart", "Kotlin", "Swift", "React Native", "Java"],
  },
  {
    id: "SYS_02",
    title: "Money & trust",
    body: "Banking, savings and payments, where a wrong number is not an option.",
    tags: ["Fintech", "Payments", "Secure storage", "Biometrics"],
  },
  {
    id: "SYS_03",
    title: "Backends that keep up",
    body: "APIs, sync and notifications that quietly work behind every tap.",
    tags: ["Node.js", "NestJS", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "Firebase"],
  },
  {
    id: "SYS_04",
    title: "Web & dashboards",
    body: "Admin panels and sites for the people running the product.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind", "React Query"],
  },
]

export const PROCESS = [
  {
    code: "01 · DISCOVER",
    title: "A first call, free",
    body: "We talk through the idea: who it is for, what it must do on day one, and what can wait.",
  },
  {
    code: "02 · PLAN",
    title: "Scope, milestones, a clear price",
    body: "You get a written plan: features, platforms, milestones and an estimate. No surprises later.",
  },
  {
    code: "03 · BUILD",
    title: "Weekly builds in your hands",
    body: "Design, development and testing, with a build you can install on your own phone every week.",
  },
  {
    code: "04 · SHIP",
    title: "Store release, and after",
    body: "App Store and Google Play submission, then monitoring, fixes and updates once real users arrive.",
  },
]

export const GREETINGS = ["Hello", "Salam", "مرحبا", "こんにちは", "Ciao", "Cześć", "Bonjour", "Hello"]

/** Where Siddiq works from — shown in the hero clock and contact section. */
export const HOME = {
  label: "Pakistan · GMT+5",
  tz: "Asia/Karachi",
  city: "Karachi",
  code: "KHI",
  /** Hours (local to HOME) Siddiq is usually available for calls. */
  hours: [10, 20] as [number, number],
}

export function timeIn(tz: string, date = new Date(), seconds = false) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: seconds ? "2-digit" : undefined,
    hour12: false,
    timeZone: tz,
  }).format(date)
}

/** Minutes a time zone is ahead of UTC at `date`. */
export function tzOffset(tz: string, date = new Date()) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date)
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value)
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"))
  return Math.round((asUTC - date.getTime()) / 60000)
}
