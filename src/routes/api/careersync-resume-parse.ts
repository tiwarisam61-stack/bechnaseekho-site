import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { extractResumeProfile, type ResumeProfileExtract } from "@/lib/resume-profile-extract";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";
const OPENAI_GATEWAY = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

const requestSchema = z.object({
  text: z.string().min(80).max(60000),
  fileName: z.string().max(200).optional(),
});

type AiResumeExtract = ResumeProfileExtract & {
  summary: string | null;
  jobGaps: string[];
  roleFit: string[];
  recruiterRecommendation: "Call now" | "Needs training" | "Good for BPO" | "Good for sales" | "Good for counselling" | "Not ready";
  confidence: number;
  source: "ai" | "fallback";
};

export const Route = createFileRoute("/api/careersync-resume-parse")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const input = requestSchema.parse(await request.json());
          const fallback = buildFallbackExtract(input.text);
          const openAiKey = process.env.OPENAI_API_KEY;
          const lovableKey = process.env.LOVABLE_API_KEY;
          const ai = openAiKey
            ? await parseWithOpenAi(input.text, input.fileName, openAiKey)
            : lovableKey
              ? await parseWithLovable(input.text, input.fileName, lovableKey)
              : null;

          return Response.json({ resume: ai ? mergeAiWithFallback(fallback, ai) : fallback });
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "Could not parse resume." },
            { status: 400 },
          );
        }
      },
    },
  },
});

async function parseWithOpenAi(text: string, fileName: string | undefined, key: string) {
  const response = await fetch(OPENAI_GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_RESUME_PARSE_MODEL ?? OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: buildMessages(text, fileName),
    }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return normalizeAiExtract(data.choices?.[0]?.message?.content);
}

async function parseWithLovable(text: string, fileName: string | undefined, key: string) {
  const response = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: buildMessages(text, fileName),
    }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return normalizeAiExtract(data.choices?.[0]?.message?.content);
}

function buildMessages(text: string, fileName: string | undefined) {
  return [
    {
      role: "system",
      content:
        "You are CareerSync's resume parser for Indian hiring. Extract only facts present in the resume. Never invent companies, salary, dates, experience, phone, email, or education. Prefer Indian mobile numbers, Indian city names, explicit total experience, current/expected CTC, notice period, languages, and practical hiring skills for sales, BPO, support, HR, relationship manager, and counselling roles. Return strict JSON only.",
    },
    {
      role: "user",
      content: JSON.stringify({
        fileName,
        schema: {
          name: "",
          email: "",
          phone: "",
          city: "",
          totalExperience: "",
          lastRole: "",
          companies: [""],
          skills: [""],
          education: [""],
          noticePeriod: "",
          currentCtc: "",
          expectedCtc: "",
          languages: [""],
          summary: "",
          jobGaps: [""],
          roleFit: [""],
          recruiterRecommendation:
            "Call now | Needs training | Good for BPO | Good for sales | Good for counselling | Not ready",
          confidence: 0,
        },
        allowedRoleFit: ["Sales", "BPO / Customer support", "Relationship manager", "Career counselling", "HR recruitment"],
        resumeText: text.slice(0, 40000),
      }),
    },
  ];
}

function buildFallbackExtract(text: string): AiResumeExtract {
  const parsed = extractResumeProfile(text);
  return {
    ...parsed,
    summary: parsed.summary ?? null,
    jobGaps: parsed.jobGaps ?? [],
    roleFit: parsed.roleFit?.length ? parsed.roleFit : inferRoleFit(parsed.skills),
    recruiterRecommendation: parsed.recruiterRecommendation ? recommendation(parsed.recruiterRecommendation) : inferRecommendation(parsed.skills, parsed.totalExperience),
    confidence: parsed.confidence ?? (parsed.phone || parsed.email || parsed.skills.length ? 62 : 35),
    source: "fallback",
  };
}

function normalizeAiExtract(content: string | undefined): AiResumeExtract | null {
  const raw = content?.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      phone: stringOrNull(parsed.phone),
      email: stringOrNull(parsed.email),
      name: stringOrNull(parsed.name),
      city: stringOrNull(parsed.city),
      totalExperience: stringOrNull(parsed.totalExperience),
      lastRole: stringOrNull(parsed.lastRole),
      companies: stringList(parsed.companies, 6),
      skills: stringList(parsed.skills, 16),
      education: stringList(parsed.education, 5),
      noticePeriod: stringOrNull(parsed.noticePeriod),
      currentCtc: stringOrNull(parsed.currentCtc),
      expectedCtc: stringOrNull(parsed.expectedCtc),
      languages: stringList(parsed.languages, 8),
      summary: stringOrNull(parsed.summary),
      jobGaps: stringList(parsed.jobGaps, 5),
      roleFit: stringList(parsed.roleFit, 6),
      recruiterRecommendation: recommendation(parsed.recruiterRecommendation),
      confidence: clamp(parsed.confidence, 0, 100),
      source: "ai",
    };
  } catch {
    return null;
  }
}

function mergeAiWithFallback(fallback: AiResumeExtract, ai: AiResumeExtract): AiResumeExtract {
  const usefulAiFacts = Boolean(
    ai.phone ||
      ai.email ||
      ai.name ||
      ai.city ||
      ai.totalExperience ||
      ai.lastRole ||
      ai.skills.length ||
      ai.education.length,
  );
  return {
    phone: ai.phone ?? fallback.phone,
    email: ai.email ?? fallback.email,
    name: ai.name ?? fallback.name,
    city: ai.city ?? fallback.city,
    totalExperience: ai.totalExperience ?? fallback.totalExperience,
    lastRole: ai.lastRole ?? fallback.lastRole,
    companies: ai.companies.length ? ai.companies : fallback.companies,
    skills: ai.skills.length ? ai.skills : fallback.skills,
    education: ai.education.length ? ai.education : fallback.education,
    noticePeriod: ai.noticePeriod ?? fallback.noticePeriod,
    currentCtc: ai.currentCtc ?? fallback.currentCtc,
    expectedCtc: ai.expectedCtc ?? fallback.expectedCtc,
    languages: ai.languages.length ? ai.languages : fallback.languages,
    summary: ai.summary ?? fallback.summary,
    jobGaps: ai.jobGaps.length ? ai.jobGaps : fallback.jobGaps,
    roleFit: ai.roleFit.length ? ai.roleFit : fallback.roleFit,
    recruiterRecommendation: ai.recruiterRecommendation !== "Not ready"
      ? ai.recruiterRecommendation
      : fallback.recruiterRecommendation,
    confidence: Math.max(usefulAiFacts ? 0 : fallback.confidence, ai.confidence, fallback.confidence ?? 0),
    source: usefulAiFacts ? "ai" : "fallback",
  };
}

function stringOrNull(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? text.slice(0, 180) : null;
}

function stringList(value: unknown, max: number) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean).slice(0, max)
    : [];
}

function recommendation(value: unknown): AiResumeExtract["recruiterRecommendation"] {
  const text = typeof value === "string" ? value.toLowerCase() : "";
  if (text.includes("call")) return "Call now";
  if (text.includes("training")) return "Needs training";
  if (text.includes("bpo")) return "Good for BPO";
  if (text.includes("sales")) return "Good for sales";
  if (text.includes("counselling") || text.includes("counseling")) return "Good for counselling";
  return "Not ready";
}

function inferRoleFit(skills: string[]) {
  const joined = skills.join(" ").toLowerCase();
  return [
    /bpo|telecall|calling|customer/.test(joined) ? "BPO / Customer support" : "",
    /sales|lead generation|negotiation/.test(joined) ? "Sales" : "",
    /counselling|counsel/.test(joined) ? "Career counselling" : "",
    /recruit|hr|onboarding|ats/.test(joined) ? "HR recruitment" : "",
  ].filter(Boolean);
}

function inferRecommendation(skills: string[], totalExperience: string | null): AiResumeExtract["recruiterRecommendation"] {
  const joined = skills.join(" ").toLowerCase();
  if (/sales|lead generation|negotiation/.test(joined)) return "Good for sales";
  if (/bpo|telecall|calling|customer/.test(joined)) return "Good for BPO";
  if (/counselling|counsel/.test(joined)) return "Good for counselling";
  if (totalExperience && !/fresher/i.test(totalExperience)) return "Call now";
  return "Needs training";
}

function clamp(value: unknown, min: number, max: number) {
  const number = Number(value);
  return Math.max(min, Math.min(max, Math.round(Number.isFinite(number) ? number : min)));
}
