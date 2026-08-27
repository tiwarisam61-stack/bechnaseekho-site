// Pure filter/parser helpers for the CareerSync Jobs section.
// Kept side-effect-free so both the landing section and the full /careersync/jobs
// page share the same logic.

export type SalaryBucket = "any" | "0-5" | "5-10" | "10-20" | "20+";
export type ExperienceBucket = "" | "Fresher" | "1-3 years" | "3-5 years" | "5+ years";

export interface FilterableJob {
  id: string;
  role: string;
  company: string;
  location: string | null;
  experience: string | null;
  salary: string | null;
  employment_type: string | null;
  description: string | null;
  tags: string[] | null;
  industry?: string | null;
  required_skills?: string[] | null;
  preferred_skills?: string[] | null;
}

export interface Filters {
  query: string;
  location: string;
  employmentType: string;
  experience: ExperienceBucket;
  salary: SalaryBucket;
  quickTag: string;
}

/* ---------- Location normalization ---------- */
const CITY_ALIASES: Record<string, string[]> = {
  delhi: ["delhi", "new delhi", "delhi ncr", "ncr"],
  gurugram: ["gurugram", "gurgaon"],
  noida: ["noida", "greater noida"],
  bengaluru: ["bengaluru", "bangalore", "blr"],
  mumbai: ["mumbai", "bombay"],
  hyderabad: ["hyderabad", "hyd"],
  chennai: ["chennai", "madras"],
  kolkata: ["kolkata", "calcutta"],
  pune: ["pune"],
  remote: ["remote", "work from home", "wfh", "anywhere"],
};

function normalizeCity(input: string): string[] {
  const q = input.trim().toLowerCase();
  if (!q) return [];
  const hits = new Set<string>([q]);
  for (const aliases of Object.values(CITY_ALIASES)) {
    if (aliases.some((a) => a === q || q.includes(a) || a.includes(q))) {
      aliases.forEach((a) => hits.add(a));
    }
  }
  return [...hits];
}

function matchesLocation(jobLocation: string | null, filter: string): boolean {
  if (!filter.trim()) return true;
  if (!jobLocation) return false;
  const jl = jobLocation.toLowerCase();
  return normalizeCity(filter).some((alias) => jl.includes(alias));
}

/* ---------- Salary parsing (in monthly INR) ---------- */
// Returns [min, max] in monthly rupees. LPA converts to /12.
export function parseSalaryToMonthlyINR(raw: string | null | undefined): [number, number] | null {
  if (!raw) return null;
  const s = raw.toLowerCase().replace(/[,₹]/g, " ").replace(/\s+/g, " ").trim();

  const isLPA = /lpa|per\s*annum|\/year|per\s*year|annum/.test(s);
  const isK = /\bk\b/.test(s);

  // Extract all numbers (supports decimals like 5.5)
  const nums = (s.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
  if (nums.length === 0) return null;

  let min = nums[0];
  let max = nums.length > 1 ? nums[1] : nums[0];

  // "Up to 5.5" → treat as 0..max
  if (/\bup to\b|\bmax\b|\bmaximum\b/.test(s)) {
    max = nums[0];
    min = 0;
  }

  // Apply units
  const toMonthly = (n: number) => {
    if (isLPA) return (n * 100000) / 12; // lakhs per annum → monthly
    if (isK) return n * 1000;
    // Bare numbers >=1000 → treat as already monthly INR (e.g. 15100/month)
    // Bare numbers <100 → assume LPA (e.g. "5 - 8")
    if (n >= 1000) return n;
    if (n <= 100) return (n * 100000) / 12;
    return n * 1000;
  };

  const a = toMonthly(min);
  const b = toMonthly(max);
  return [Math.min(a, b), Math.max(a, b)];
}

// Convert bucket to monthly INR range
function bucketToMonthly(bucket: SalaryBucket): [number, number] | null {
  const lpa: Record<SalaryBucket, [number, number] | null> = {
    any: null,
    "0-5": [0, 5],
    "5-10": [5, 10],
    "10-20": [10, 20],
    "20+": [20, Number.POSITIVE_INFINITY],
  };
  const range = lpa[bucket];
  if (!range) return null;
  const [lo, hi] = range;
  return [(lo * 100000) / 12, hi === Number.POSITIVE_INFINITY ? hi : (hi * 100000) / 12];
}

function matchesSalary(jobSalary: string | null, bucket: SalaryBucket): boolean {
  const target = bucketToMonthly(bucket);
  if (!target) return true; // "any"
  const parsed = parseSalaryToMonthlyINR(jobSalary);
  if (!parsed) return true; // don't hide jobs with unparseable salary
  const [jobMin, jobMax] = parsed;
  const [wantMin, wantMax] = target;
  // Overlap check
  return jobMax >= wantMin && jobMin <= wantMax;
}

/* ---------- Experience parsing ---------- */
export function parseExperienceYears(raw: string | null | undefined): [number, number] | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (/fresher|entry|0\s*year|no experience/.test(s) && !/\d/.test(s.replace(/0/g, ""))) {
    return [0, 0];
  }
  const nums = (s.match(/\d+/g) ?? []).map(Number);
  if (nums.length === 0) return null;
  if (nums.length === 1) {
    if (/\+/.test(s)) return [nums[0], 99];
    return [0, nums[0]];
  }
  return [Math.min(nums[0], nums[1]), Math.max(nums[0], nums[1])];
}

function matchesExperience(jobExp: string | null, bucket: ExperienceBucket): boolean {
  if (!bucket) return true;
  const parsed = parseExperienceYears(jobExp);
  if (!parsed) return true;
  const [jMin, jMax] = parsed;
  const ranges: Record<Exclude<ExperienceBucket, "">, [number, number]> = {
    Fresher: [0, 1],
    "1-3 years": [1, 3],
    "3-5 years": [3, 5],
    "5+ years": [5, 99],
  };
  const [wMin, wMax] = ranges[bucket];
  return jMax >= wMin && jMin <= wMax;
}

/* ---------- Text search ---------- */
function matchesQuery(job: FilterableJob, q: string): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    job.role,
    job.company,
    job.industry ?? "",
    job.description ?? "",
    ...(job.tags ?? []),
    ...(job.required_skills ?? []),
    ...(job.preferred_skills ?? []),
  ]
    .join(" ")
    .toLowerCase();
  // Every whitespace-separated token must be present
  return query.split(/\s+/).every((tok) => haystack.includes(tok));
}

/* ---------- Employment type ---------- */
function matchesEmploymentType(jobType: string | null, want: string): boolean {
  if (!want) return true;
  if (!jobType) return false;
  return jobType.toLowerCase().includes(want.toLowerCase());
}

/* ---------- Quick tag ---------- */
function matchesQuickTag(job: FilterableJob, tag: string): boolean {
  if (!tag) return true;
  const t = tag.toLowerCase();
  const pool = [
    job.role,
    job.industry ?? "",
    ...(job.tags ?? []),
    ...(job.required_skills ?? []),
    ...(job.preferred_skills ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return pool.includes(t);
}

/* ---------- Public API ---------- */
export function applyFilters<T extends FilterableJob>(jobs: T[], f: Filters): T[] {
  return jobs.filter(
    (j) =>
      matchesQuery(j, f.query) &&
      matchesLocation(j.location, f.location) &&
      matchesEmploymentType(j.employment_type, f.employmentType) &&
      matchesExperience(j.experience, f.experience) &&
      matchesSalary(j.salary, f.salary) &&
      matchesQuickTag(j, f.quickTag),
  );
}

export function hasAnyFilter(f: Filters): boolean {
  return !!(
    f.query.trim() ||
    f.location.trim() ||
    f.employmentType ||
    f.experience ||
    (f.salary && f.salary !== "any") ||
    f.quickTag
  );
}
