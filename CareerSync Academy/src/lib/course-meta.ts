import type { Course } from "./courses";

export type CourseBadge =
  | "Most Popular"
  | "Best Seller"
  | "Trending"
  | "New"
  | "AI Powered"
  | "Live"
  | "Premium";

export type CourseMeta = {
  badge: CourseBadge;
  language: string;
  projects: number;
  reviews: number;
  seatsLeft: number;
  originalPrice: number;
  price: number;
  discount: number;
  emi: number;
  certificate: boolean;
  liveSessions: boolean;
  placement: boolean;
  resume: boolean;
  interview: boolean;
  lifetime: boolean;
};

const badges: CourseBadge[] = [
  "Most Popular",
  "Best Seller",
  "Trending",
  "Premium",
  "AI Powered",
  "Live",
  "New",
];

const languages = ["English", "English + Hindi", "Hindi", "English + Hindi"];

/** Deterministic hash so marketing metadata is stable across renders and SSR. */
function hash(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const levelPrice: Record<string, number> = {
  Beginner: 7999,
  Intermediate: 11999,
  Advanced: 15999,
};

export function courseMeta(course: Course): CourseMeta {
  const h = hash(course.id);
  const original = levelPrice[course.level] ?? 9999;
  return {
    badge: badges[h % badges.length]!,
    language: languages[h % languages.length]!,
    projects: 3 + (h % 4),
    reviews: 400 + (h % 9) * 137,
    seatsLeft: 6 + (h % 12),
    originalPrice: original,
    price: 0,
    discount: 0,
    emi: 0,
    certificate: true,
    liveSessions: h % 3 !== 0,
    placement: true,
    resume: h % 2 === 0,
    interview: true,
    lifetime: true,
  };
}

export const inr = (n: number) => (n === 0 ? "Free" : `₹${n.toLocaleString("en-IN")}`);

export const badgeTone: Record<CourseBadge, string> = {
  "Most Popular": "gold-gradient text-[oklch(0.24_0.05_80)]",
  "Best Seller": "gold-gradient text-[oklch(0.24_0.05_80)]",
  Trending: "brand-gradient text-primary-foreground",
  New: "bg-accent text-accent-foreground",
  "AI Powered": "brand-gradient text-primary-foreground",
  Live: "bg-destructive text-destructive-foreground",
  Premium: "bg-foreground text-background",
};
