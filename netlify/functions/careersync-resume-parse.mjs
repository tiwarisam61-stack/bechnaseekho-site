const PHONE_RE = /(?:\+?91[\s-]?)?(?:0[\s-]?)?([6-9]\d(?:[\s-]?\d){8})\b/g;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const CITIES = [
  "Delhi", "New Delhi", "Gurgaon", "Gurugram", "Noida", "Greater Noida", "Faridabad", "Ghaziabad",
  "Mumbai", "Navi Mumbai", "Pune", "Bengaluru", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Mohali", "Indore", "Bhopal", "Patna",
  "Meerut", "Agra", "Kanpur", "Varanasi", "Ludhiana", "Amritsar", "Jalandhar", "Panchkula",
  "Rohtak", "Sonipat", "Panipat", "Hisar", "Karnal", "Dehradun", "Haridwar", "Ranchi",
  "Bhubaneswar", "Surat", "Vadodara", "Rajkot", "Nagpur", "Nashik", "Coimbatore", "Kochi",
  "Thiruvananthapuram", "Visakhapatnam", "Vijayawada", "Guwahati", "Raipur",
];

const SKILLS = [
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

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const input = JSON.parse(event.body || "{}");
    const text = String(input.text || "");
    if (text.length < 80) return json({ error: "Resume text is too short." }, 400);
    return json({ resume: parseResume(text) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not parse resume." }, 400);
  }
};

function parseResume(text) {
  const lines = text.replace(/\r/g, "\n").split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const phone = extractPhone(text);
  const email = Array.from(text.matchAll(EMAIL_RE)).map((match) => match[0].toLowerCase())[0] || null;
  const name = lines.slice(0, 8).find((line) => !EMAIL_RE.test(line) && !PHONE_RE.test(line) && /^[A-Za-z][A-Za-z .'-]{2,60}$/.test(line)) || null;
  const city = extractCity(text);
  const totalExperience = extractExperience(text);
  const lastRole = extractLastRole(text);
  const skills = unique(SKILLS.filter((skill) => new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i").test(text))).slice(0, 16);
  const education = unique(lines.filter((line) => /\b(10th|12th|graduate|graduation|b\.?a\.?|b\.?com|b\.?sc|b\.?tech|m\.?a\.?|m\.?com|m\.?sc|mba|pgdm|diploma|degree|university|college|school)\b/i.test(line)).map((line) => line.slice(0, 90))).slice(0, 5);
  const roleFit = inferRoleFit(skills);
  const companies = extractCompanies(lines);
  const resume = {
    phone,
    email,
    name,
    city,
    totalExperience,
    lastRole,
    companies,
    skills,
    education,
    noticePeriod: extractLineValue(text, /notice\s+period\s*[:\-]?\s*([^\n|]+)/i),
    currentCtc: extractLineValue(text, /(?:current\s+ctc|current\s+salary)\s*[:\-]?\s*([^\n|]+)/i),
    expectedCtc: extractLineValue(text, /(?:expected\s+ctc|expected\s+salary)\s*[:\-]?\s*([^\n|]+)/i),
    languages: ["Hindi", "English", "Punjabi", "Bengali", "Marathi", "Tamil", "Telugu", "Kannada", "Gujarati", "Hinglish"].filter((language) => new RegExp(`\\b${language}\\b`, "i").test(text)),
    summary: buildSummary({ name, city, totalExperience, lastRole, companies, skills }),
    jobGaps: extractJobGaps(text),
    roleFit,
    recruiterRecommendation: inferRecommendation(skills, totalExperience),
    confidence: scoreConfidence({ phone, email, name, city, totalExperience, lastRole, skills, education }),
    source: "fallback",
  };
  return resume;
}

function extractPhone(text) {
  const raw = Array.from(text.matchAll(PHONE_RE)).map((match) => match[0].replace(/[^\d+]/g, ""))[0];
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  const phone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  return phone.length === 10 && /^[6-9]/.test(phone) ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : null;
}

function extractCity(text) {
  return CITIES.map((city) => ({ city, index: text.search(new RegExp(`\\b${escapeRegExp(city)}\\b`, "i")) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index || b.city.length - a.city.length)[0]?.city || null;
}

function extractExperience(text) {
  const normalized = text.replace(/\s+/g, " ");
  const patterns = [
    /(?:total|overall|professional|relevant)\s+experience\s*[:\-]?\s*(fresher|\d{1,2}(?:\.\d)?\+?\s*(?:years?|yrs?|yr|months?|mos?))/i,
    /(fresher|fresh graduate|entry level)\b/i,
    /(\d{1,2}(?:\.\d)?\+?)\s*(?:years?|yrs?|yr)\s+(?:of\s+)?(?:total\s+|overall\s+|professional\s+|relevant\s+)?experience\b/i,
  ];
  for (const pattern of patterns) {
    const raw = normalized.match(pattern)?.[1];
    if (/fresh|entry level/i.test(raw || "")) return "Fresher";
    const amount = raw?.match(/\d{1,2}(?:\.\d)?\+?/);
    if (amount) return `${amount[0]} ${/mo|month/i.test(raw) ? "months" : "years"}`;
  }
  return null;
}

function extractLastRole(text) {
  const match = text.match(/(?:current|last|recent)\s+(?:role|designation|position)\s*[:\-]\s*([^\n|]+)/i) || text.match(/\b(HR Recruiter|Recruiter|Talent Acquisition|Telecaller|Customer Support Executive|Sales Executive|Relationship Manager|Career Counsellor|Business Development Executive|BPO Executive)\b/i);
  return match?.[1]?.trim().slice(0, 60) || null;
}

function extractCompanies(lines) {
  return unique(lines.filter((line) => /\b(pvt|private|ltd|limited|company|solutions|services|technologies|enterprises|consultants|agency|infosys|wipro|tcs|concentrix|teleperformance|genpact|hdfc|icici|axis)\b/i.test(line) && !/email|phone|address|objective|skills?|education|summary|profile|language|hobbies/i.test(line)).map((line) => line.replace(/\s*[-|].*$/, "").trim().slice(0, 70))).slice(0, 6);
}

function extractJobGaps(text) {
  const normalized = text.replace(/\s+/g, " ");
  return unique(Array.from(normalized.matchAll(/\b(?:career\s+break|employment\s+gap|job\s+gap|gap|break)\b[^.|\n]{0,80}/gi)).map((match) => titleCase(match[0].trim()))).slice(0, 4);
}

function inferRoleFit(skills) {
  const joined = skills.join(" ").toLowerCase();
  return [
    /bpo|telecall|calling|voice process|customer|chat support|email support/.test(joined) ? "BPO / Customer support" : "",
    /sales|lead generation|negotiation|closing|loan|insurance|real estate|edtech|field sales|inside sales/.test(joined) ? "Sales" : "",
    /relationship|customer retention|cross selling|upselling|banking|casa/.test(joined) ? "Relationship manager" : "",
    /counselling|counsel/.test(joined) ? "Career counselling" : "",
    /recruit|hr|onboarding|ats|naukri|screening/.test(joined) ? "HR recruitment" : "",
  ].filter(Boolean);
}

function inferRecommendation(skills, totalExperience) {
  const joined = skills.join(" ").toLowerCase();
  if (/sales|lead generation|negotiation|closing|field sales|inside sales|loan|insurance/.test(joined)) return "Good for sales";
  if (/bpo|telecall|calling|voice process|customer|chat support|email support/.test(joined)) return "Good for BPO";
  if (/counselling|counsel/.test(joined)) return "Good for counselling";
  if (/recruit|hr|onboarding|ats|naukri/.test(joined)) return "Call now";
  if (totalExperience && !/fresher/i.test(totalExperience)) return "Call now";
  return "Needs training";
}

function buildSummary(input) {
  const parts = [input.name || "Candidate", input.totalExperience ? `has ${input.totalExperience} experience` : "", input.lastRole ? `as ${input.lastRole}` : "", input.city ? `based in ${input.city}` : "", input.skills.length ? `and skills in ${input.skills.slice(0, 4).join(", ")}` : ""].filter(Boolean);
  return parts.length > 1 ? `${parts.join(" ")}.` : null;
}

function scoreConfidence(input) {
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

function extractLineValue(text, pattern) {
  const value = text.match(pattern)?.[1]?.trim();
  return value ? value.replace(/\s+/g, " ").slice(0, 80) : null;
}

function unique(items) {
  const seen = new Set();
  return items.filter((item) => {
    const normalized = String(item).toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return Boolean(item);
  });
}

function titleCase(value) {
  return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function json(body, statusCode = 200) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
