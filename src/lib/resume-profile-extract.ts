export type ResumeProfileExtract = {
  phone: string | null;
  email: string | null;
  name: string | null;
  city: string | null;
  totalExperience: string | null;
  lastRole: string | null;
  companies: string[];
  skills: string[];
  education: string[];
  noticePeriod: string | null;
  currentCtc: string | null;
  expectedCtc: string | null;
  languages: string[];
  summary?: string | null;
  jobGaps?: string[];
  roleFit?: string[];
  recruiterRecommendation?: string;
  confidence?: number;
  source?: "ai" | "fallback";
};

const PHONE_RE = /(?:\+?91[\s-]?)?(?:0[\s-]?)?([6-9]\d(?:[\s-]?\d){8})\b/g;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const EMAIL_LINE_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_LINE_RE = /(?:\+?91[\s-]?)?(?:0[\s-]?)?([6-9]\d(?:[\s-]?\d){8})\b/i;

const KNOWN_CITIES = [
  "Delhi", "New Delhi", "Gurgaon", "Gurugram", "Noida", "Greater Noida", "Faridabad", "Ghaziabad",
  "Mumbai", "Navi Mumbai", "Pune", "Bengaluru", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Mohali", "Indore", "Bhopal", "Patna",
  "Meerut", "Agra", "Kanpur", "Varanasi", "Ludhiana", "Amritsar", "Jalandhar", "Panchkula",
  "Rohtak", "Sonipat", "Panipat", "Hisar", "Karnal", "Dehradun", "Haridwar", "Ranchi",
  "Bhubaneswar", "Surat", "Vadodara", "Rajkot", "Nagpur", "Nashik", "Coimbatore", "Kochi",
  "Thiruvananthapuram", "Visakhapatnam", "Vijayawada", "Guwahati", "Raipur",
];

const COMMON_SKILLS = [
  "Recruitment", "Sourcing", "Screening", "Interviewing", "Onboarding", "Employee Relations", "Payroll",
  "HRMS", "ATS", "Naukri", "LinkedIn", "Excel", "MS Excel", "Google Sheets", "CRM", "Salesforce",
  "Calling", "Cold Calling", "Telecalling", "Customer Support", "Customer Service", "BPO", "Telesales",
  "Lead Generation", "Inside Sales", "Field Sales", "Counselling", "Career Counselling", "Relationship Management",
  "Communication", "Hindi", "English", "Hinglish", "Negotiation", "Objection Handling", "Data Entry",
  "WhatsApp Sales", "Retail Sales", "CASA", "Loan Sales", "Banking Sales", "Insurance Sales",
  "Real Estate Sales", "EdTech Sales", "Collections", "Chat Support", "Email Support", "Voice Process",
  "Non Voice Process", "Inbound Calling", "Outbound Calling", "Lead Qualification", "Closing", "Follow-up",
  "Relationship Manager", "Customer Retention", "KYC", "Loan Processing", "Cross Selling", "Upselling",
];

const ROLE_PATTERNS = [
  /(?:current|last|recent)\s+(?:role|designation|position)\s*[:\-]\s*([^\n|]+)/i,
  /(?:designation|position|role)\s*[:\-]\s*([^\n|]+)/i,
  /\b(HR Recruiter|Recruiter|Talent Acquisition|Telecaller|Customer Support Executive|Sales Executive|Relationship Manager|Career Counsellor|Business Development Executive|BPO Executive)\b/i,
];

const EXPERIENCE_PATTERNS = [
  /(?:total|overall|professional|relevant)\s+experience\s*[:\-]?\s*(fresher|\d{1,2}(?:\.\d)?\+?\s*(?:years?|yrs?|yr|months?|mos?))/i,
  /(fresher|fresh graduate|entry level)\b/i,
  /(\d{1,2}(?:\.\d)?\+?)\s*(?:years?|yrs?|yr)\s+(?:of\s+)?(?:total\s+|overall\s+|professional\s+|relevant\s+)?experience\b/i,
  /experience\s+(?:of\s+)?(\d{1,2}(?:\.\d)?\+?)\s*(?:years?|yrs?|yr)\b/i,
];

export function extractResumeProfile(text: string): ResumeProfileExtract {
  const lines = cleanLines(text);
  const phone = extractResumePhone(text);
  const email = extractEmail(text);
  const name = extractName(lines);
  const city = extractCity(text);
  const totalExperience = extractResumeExperience(text);
  const lastRole = extractLastRole(text);
  const companies = extractCompanies(lines);
  const skills = extractSkills(text);
  const education = extractEducation(lines);
  const noticePeriod = extractLineValue(text, /notice\s+period\s*[:\-]?\s*([^\n|]+)/i);
  const currentCtc = extractLineValue(text, /(?:current\s+ctc|current\s+salary)\s*[:\-]?\s*([^\n|]+)/i);
  const expectedCtc = extractLineValue(text, /(?:expected\s+ctc|expected\s+salary)\s*[:\-]?\s*([^\n|]+)/i);
  const languages = extractLanguages(text);
  const roleFit = inferFallbackRoleFit(skills);
  return {
    phone,
    email,
    name,
    city,
    totalExperience,
    lastRole,
    companies,
    skills,
    education,
    noticePeriod,
    currentCtc,
    expectedCtc,
    languages,
    summary: buildFallbackSummary({ name, city, totalExperience, lastRole, companies, skills }),
    jobGaps: extractJobGaps(text),
    roleFit,
    recruiterRecommendation: inferFallbackRecommendation(skills, totalExperience),
    confidence: scoreFallbackConfidence({ phone, email, name, city, totalExperience, lastRole, skills, education }),
    source: "fallback",
  };
}

function cleanLines(text: string) {
  return text
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function extractResumePhone(text: string) {
  const matches = Array.from(text.matchAll(PHONE_RE))
    .map((match) => match[0])
    .map((phone) => phone.replace(/[^\d+]/g, ""))
    .map((phone) => normalizeIndianPhone(phone))
    .filter(Boolean);

  return matches[0] ?? null;
}

function extractEmail(text: string) {
  return Array.from(text.matchAll(EMAIL_RE)).map((match) => match[0].toLowerCase())[0] ?? null;
}

function extractName(lines: string[]) {
  const firstUsefulLine = lines
    .slice(0, 8)
    .find((line) => {
      if (EMAIL_LINE_RE.test(line) || PHONE_LINE_RE.test(line)) return false;
      if (/resume|curriculum vitae|profile|address|linkedin|github/i.test(line)) return false;
      return /^[A-Za-z][A-Za-z .'-]{2,60}$/.test(line);
    });
  return firstUsefulLine ?? null;
}

function normalizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 11 && digits.startsWith("0") && /^[6-9]/.test(digits.slice(1))) {
    const phone = digits.slice(1);
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91") && /^[6-9]/.test(digits.slice(2))) {
    const phone = digits.slice(2);
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return null;
}

function extractCity(text: string) {
  const explicit = extractLineValue(text, /(?:current\s+city|city|location|address)\s*[:\-]\s*([^\n|]+)/i);
  if (explicit) {
    const city = KNOWN_CITIES.find((item) => new RegExp(`\\b${escapeRegExp(item)}\\b`, "i").test(explicit));
    return city ?? explicit.split(",")[0].trim().slice(0, 40);
  }
  return KNOWN_CITIES
    .map((city) => ({ city, index: text.search(new RegExp(`\\b${escapeRegExp(city)}\\b`, "i")) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index || b.city.length - a.city.length)[0]?.city ?? null;
}

function extractResumeExperience(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  for (const pattern of EXPERIENCE_PATTERNS) {
    const match = normalized.match(pattern);
    const raw = match?.[1] ?? match?.[0];
    const formatted = raw ? formatExperience(raw) : null;
    if (formatted) return formatted;
  }
  return inferExperienceFromDateRanges(normalized);
}

function formatExperience(value: string) {
  const raw = value.trim().toLowerCase();
  if (/fresh|entry level/.test(raw)) return "Fresher";

  const amount = raw.match(/\d{1,2}(?:\.\d)?\+?/);
  if (!amount) return null;
  const unit = /mo|month/.test(raw) ? "months" : "years";
  return `${amount[0]} ${unit}`;
}

function inferExperienceFromDateRanges(text: string) {
  const currentYear = new Date().getFullYear();
  const spans = Array.from(text.matchAll(/\b((?:19|20)\d{2})\s*(?:-|–|—|to)\s*(present|current|now|(?:19|20)\d{2})\b/gi))
    .map((match) => {
      const start = Number(match[1]);
      const endRaw = match[2].toLowerCase();
      const end = /present|current|now/.test(endRaw) ? currentYear : Number(endRaw);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0;
      return Math.min(45, end - start);
    })
    .filter((years) => years > 0);

  const maxYears = Math.max(0, ...spans);
  if (!maxYears) return null;
  return `${maxYears}+ years`;
}

function extractLastRole(text: string) {
  for (const pattern of ROLE_PATTERNS) {
    const match = text.match(pattern);
    const value = match?.[1]?.trim();
    if (value) return titleCase(value.replace(/\s{2,}/g, " ").slice(0, 60));
  }
  return null;
}

function extractSkills(text: string) {
  const found = COMMON_SKILLS.filter((skill) => new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i").test(text));
  const explicit = extractSectionItems(text, /(skills?|core competencies|technical skills|key skills)\s*[:\n]/i, [
    /education\s*[:\n]/i,
    /experience\s*[:\n]/i,
    /employment\s*[:\n]/i,
    /projects?\s*[:\n]/i,
  ]).filter((item) => item.length <= 35);
  return unique([...found, ...explicit]).slice(0, 12);
}

function extractEducation(lines: string[]) {
  const educationWords = /\b(10th|12th|graduate|graduation|b\.?a\.?|b\.?com|b\.?sc|b\.?tech|m\.?a\.?|m\.?com|m\.?sc|mba|pgdm|diploma|degree|university|college|school)\b/i;
  return unique(lines.filter((line) => educationWords.test(line)).map((line) => line.slice(0, 90))).slice(0, 4);
}

function extractCompanies(lines: string[]) {
  const companyWords = /\b(pvt|private|ltd|limited|company|solutions|services|technologies|enterprises|consultants|agency|bechnaseekho|infosys|wipro|tcs|concentrix|teleperformance|genpact|hdfc|icici|axis)\b/i;
  return unique(
    lines
      .filter((line) => companyWords.test(line) && !/email|phone|address|objective|skills?|education|summary|profile|language|hobbies/i.test(line))
      .map((line) => line.replace(/\s*[-|].*$/, "").trim().slice(0, 70))
      .filter((line) => line.length > 2),
  ).slice(0, 5);
}

function extractJobGaps(text: string) {
  const normalized = text.replace(/\s+/g, " ");
  const explicit = Array.from(normalized.matchAll(/\b(?:career\s+break|employment\s+gap|job\s+gap|gap|break)\b[^.|\n]{0,80}/gi))
    .map((match) => titleCase(match[0].trim()))
    .filter((item) => item.length >= 8);
  const duration = Array.from(normalized.matchAll(/\b(?:break|gap)\s+(?:of\s+)?(\d{1,2})\s*(months?|years?|yrs?)\b/gi))
    .map((match) => `Career gap of ${match[1]} ${match[2]}`);
  return unique([...explicit, ...duration]).slice(0, 4);
}

function inferFallbackRoleFit(skills: string[]) {
  const joined = skills.join(" ").toLowerCase();
  return [
    /bpo|telecall|calling|voice process|customer|chat support|email support/.test(joined) ? "BPO / Customer support" : "",
    /sales|lead generation|negotiation|closing|loan|insurance|real estate|edtech|field sales|inside sales/.test(joined) ? "Sales" : "",
    /relationship|customer retention|cross selling|upselling|banking|casa/.test(joined) ? "Relationship manager" : "",
    /counselling|counsel/.test(joined) ? "Career counselling" : "",
    /recruit|hr|onboarding|ats|naukri|screening/.test(joined) ? "HR recruitment" : "",
  ].filter(Boolean);
}

function inferFallbackRecommendation(skills: string[], totalExperience: string | null) {
  const joined = skills.join(" ").toLowerCase();
  if (/sales|lead generation|negotiation|closing|field sales|inside sales|loan|insurance/.test(joined)) return "Good for sales";
  if (/bpo|telecall|calling|voice process|customer|chat support|email support/.test(joined)) return "Good for BPO";
  if (/counselling|counsel/.test(joined)) return "Good for counselling";
  if (/recruit|hr|onboarding|ats|naukri/.test(joined)) return "Call now";
  if (totalExperience && !/fresher/i.test(totalExperience)) return "Call now";
  return "Needs training";
}

function buildFallbackSummary(input: {
  name: string | null;
  city: string | null;
  totalExperience: string | null;
  lastRole: string | null;
  companies: string[];
  skills: string[];
}) {
  const parts = [
    input.name ? input.name : "Candidate",
    input.totalExperience ? `has ${input.totalExperience} experience` : "",
    input.lastRole ? `as ${input.lastRole}` : "",
    input.city ? `based in ${input.city}` : "",
    input.companies.length ? `with ${input.companies[0]}` : "",
    input.skills.length ? `and skills in ${input.skills.slice(0, 4).join(", ")}` : "",
  ].filter(Boolean);
  return parts.length > 1 ? `${parts.join(" ")}.`.replace(/\s+\./, ".") : null;
}

function scoreFallbackConfidence(input: {
  phone: string | null;
  email: string | null;
  name: string | null;
  city: string | null;
  totalExperience: string | null;
  lastRole: string | null;
  skills: string[];
  education: string[];
}) {
  let score = 30;
  if (input.phone) score += 14;
  if (input.email) score += 14;
  if (input.name) score += 10;
  if (input.city) score += 8;
  if (input.totalExperience) score += 10;
  if (input.lastRole) score += 8;
  score += Math.min(12, input.skills.length * 2);
  score += Math.min(6, input.education.length * 2);
  return Math.max(30, Math.min(92, score));
}

function extractLanguages(text: string) {
  const explicit = extractSectionItems(text, /languages?\s*[:\n]/i, [/skills?\s*[:\n]/i, /education\s*[:\n]/i, /experience\s*[:\n]/i]);
  const common = ["Hindi", "English", "Punjabi", "Bengali", "Marathi", "Tamil", "Telugu", "Kannada", "Gujarati", "Hinglish"]
    .filter((language) => new RegExp(`\\b${language}\\b`, "i").test(text));
  return unique([...explicit, ...common]).slice(0, 6);
}

function extractLineValue(text: string, pattern: RegExp) {
  const value = text.match(pattern)?.[1]?.trim();
  if (!value) return null;
  return value.replace(/\s+/g, " ").slice(0, 80);
}

function extractSectionItems(text: string, start: RegExp, stopPatterns: RegExp[]) {
  const match = start.exec(text);
  if (!match) return [];
  const after = text.slice(match.index + match[0].length);
  const stopAt = stopPatterns
    .map((pattern) => {
      const stop = pattern.exec(after);
      return stop?.index ?? -1;
    })
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const section = after.slice(0, stopAt ?? 600).slice(0, 600);
  return section
    .split(/[,;•\n]/)
    .map((item) => item.replace(/^[-–—*]\s*/, "").trim())
    .filter((item) => item.length >= 2 && item.length <= 50);
}

function unique(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const normalized = item.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function titleCase(value: string) {
  return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
