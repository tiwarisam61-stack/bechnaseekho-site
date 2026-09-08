import type { DemoApplicationRecord, DemoJobRecord } from "@/lib/careersync-demo";

export type CareerSyncMatchLevel = "high" | "medium" | "low";
export type CareerSyncMatchSource = "ai" | "fallback";

export type CareerSyncMatchResult = {
  fitScore: number;
  matchLevel: CareerSyncMatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  aiReason: string;
  source: CareerSyncMatchSource;
  scoredAt: string;
};

export type CareerSyncMatchInput = {
  job: Pick<DemoJobRecord, "role" | "company" | "location" | "experience" | "employment_type" | "description" | "tags" | "required_skills" | "preferred_skills">;
  candidate: Pick<DemoApplicationRecord, "full_name" | "email" | "phone" | "cover_letter" | "resume_path" | "resume_url"> & {
    resumeName?: string | null;
    resumeText?: string | null;
  };
};

const STOP_WORDS = new Set([
  "and", "for", "the", "with", "from", "this", "that", "your", "you", "are", "job", "role", "work", "will", "have", "has",
  "candidate", "company", "team", "good", "basic", "skills", "experience", "year", "years", "full", "time",
]);

export async function scoreCareerSyncMatch(input: CareerSyncMatchInput): Promise<CareerSyncMatchResult> {
  for (const endpoint of ["/.netlify/functions/careersync-match", "/api/careersync-match"]) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (response.ok) {
        const data = (await response.json()) as Partial<CareerSyncMatchResult> & { fit_score?: number };
        return normalizeMatchResult(data, input, data.source === "fallback" ? "fallback" : "ai");
      }
    } catch {
      // Offline/dev mode keeps using the deterministic matcher below.
    }
  }
  return fallbackCareerSyncMatch(input);
}

export function fallbackCareerSyncMatch(input: CareerSyncMatchInput): CareerSyncMatchResult {
  const requiredSkills = normalizeSkills([
    ...(input.job.required_skills ?? []),
    ...(input.job.tags ?? []),
  ]);
  const preferredSkills = normalizeSkills(input.job.preferred_skills ?? []);
  const candidateText = [
    input.candidate.full_name,
    input.candidate.email,
    input.candidate.phone,
    input.candidate.cover_letter,
    input.candidate.resumeName,
    input.candidate.resume_path,
    input.candidate.resumeText,
  ].filter(Boolean).join(" ");
  const candidateKeywords = new Set(keywords(candidateText));
  const jobKeywords = new Set(keywords([
    input.job.role,
    input.job.description,
    input.job.experience,
    input.job.employment_type,
    input.job.location,
    ...(input.job.tags ?? []),
    ...(input.job.required_skills ?? []),
    ...(input.job.preferred_skills ?? []),
  ].filter(Boolean).join(" ")));

  const matchedSkills = [...new Set([...requiredSkills, ...preferredSkills].filter((skill) => hasSkill(candidateText, skill)))].slice(0, 8);
  const missingSkills = requiredSkills.filter((skill) => !hasSkill(candidateText, skill)).slice(0, 6);
  const keywordMatches = [...jobKeywords].filter((word) => candidateKeywords.has(word)).length;
  const keywordScore = jobKeywords.size ? Math.round((keywordMatches / jobKeywords.size) * 35) : 15;
  const requiredScore = requiredSkills.length ? Math.round((matchedSkills.filter((skill) => requiredSkills.includes(skill)).length / requiredSkills.length) * 45) : 25;
  const coverLetterScore = input.candidate.cover_letter && input.candidate.cover_letter.trim().length > 80 ? 10 : 0;
  const resumeScore = input.candidate.resume_url || input.candidate.resume_path ? 10 : 0;
  const fitScore = clamp(20 + keywordScore + requiredScore + coverLetterScore + resumeScore, 0, 96);

  return {
    fitScore,
    matchLevel: toMatchLevel(fitScore),
    matchedSkills,
    missingSkills,
    aiReason: buildFallbackReason(input, fitScore, matchedSkills, missingSkills),
    source: "fallback",
    scoredAt: new Date().toISOString(),
  };
}

function normalizeMatchResult(data: Partial<CareerSyncMatchResult> & { fit_score?: number }, input: CareerSyncMatchInput, source: CareerSyncMatchSource): CareerSyncMatchResult {
  const fitScore = clamp(Number(data.fitScore ?? data.fit_score ?? fallbackCareerSyncMatch(input).fitScore), 0, 100);
  return {
    fitScore,
    matchLevel: data.matchLevel === "high" || data.matchLevel === "medium" || data.matchLevel === "low" ? data.matchLevel : toMatchLevel(fitScore),
    matchedSkills: Array.isArray(data.matchedSkills) ? data.matchedSkills.map(String).slice(0, 10) : [],
    missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills.map(String).slice(0, 10) : [],
    aiReason: typeof data.aiReason === "string" && data.aiReason.trim() ? data.aiReason.trim().slice(0, 500) : buildFallbackReason(input, fitScore, [], []),
    source,
    scoredAt: new Date().toISOString(),
  };
}

function normalizeSkills(skills: string[]) {
  return [...new Set(skills.map((skill) => skill.trim()).filter(Boolean))];
}

function keywords(text: string) {
  return text.toLowerCase().match(/[a-z0-9+#.]{3,}/g)?.filter((word) => !STOP_WORDS.has(word)) ?? [];
}

function hasSkill(text: string, skill: string) {
  return text.toLowerCase().includes(skill.toLowerCase());
}

function toMatchLevel(score: number): CareerSyncMatchLevel {
  if (score >= 80) return "high";
  if (score >= 62) return "medium";
  return "low";
}

function buildFallbackReason(input: CareerSyncMatchInput, score: number, matchedSkills: string[], missingSkills: string[]) {
  const fit = toMatchLevel(score);
  const matched = matchedSkills.length ? `Matched signals: ${matchedSkills.slice(0, 4).join(", ")}.` : "Few explicit skill matches were found in the available candidate details.";
  const missing = missingSkills.length ? ` Missing: ${missingSkills.slice(0, 3).join(", ")}.` : "";
  return `${input.candidate.full_name} is a ${fit} fit for ${input.job.role} at ${input.job.company}. ${matched}${missing}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(Number.isFinite(value) ? value : min)));
}
