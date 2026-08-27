import { generateText, Output } from "ai";

import {
  analysisSchema,
  optimizationSchema,
  METRIC_LABELS,
  type AtsAnalysis,
  type AtsOptimization,
} from "./ats.schema";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.6-flash";
const NEVER_FABRICATE =
  "Absolute rule: never invent, guess or embellish facts. If a field or detail is not present in the resume text, leave the string empty or the array empty. Never create fake companies, dates, degrees, certifications, projects, metrics or achievements.";

function gatewayModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
  return createLovableAiGatewayProvider(key)(MODEL);
}

export async function analyzeResumeWithAi(resumeText: string): Promise<AtsAnalysis> {
  const { output } = await generateText({
    model: gatewayModel(),
    output: Output.object({ schema: analysisSchema }),
    system: [
      "You are a senior ATS (Applicant Tracking System) engine combined with a veteran technical recruiter.",
      "You parse resumes, score them against real ATS parsing rules, and explain everything in plain, beginner-friendly language (no jargon).",
      NEVER_FABRICATE,
      `Return exactly one metric object for each of these labels, in this order: ${METRIC_LABELS.join(", ")}.`,
      "Each metric score is 0-100 and must be justified by the actual resume content. status: excellent (>=90), good (80-89), fair (65-79), poor (<65).",
      "overallScore (0-100) must be a weighted, realistic reflection of the metrics — do not inflate it.",
      "scoreMeaning explains in 2-3 sentences what this score means for automated recruiter screening.",
      "suggestions: 4-8 concrete, resume-specific improvements. Each has why it matters, how to fix it, and the expected ATS impact (e.g. '+4 to +7 points').",
      "Every explanation, suggestion and recruiter note must reference specifics from THIS resume, never generic filler.",
    ].join("\n"),
    prompt: `Parse and analyse this resume.\n\n--- RESUME TEXT START ---\n${resumeText}\n--- RESUME TEXT END ---`,
  });
  return output;
}

export async function optimizeResumeWithAi(resumeText: string, focus?: string[]): Promise<AtsOptimization> {
  const { output } = await generateText({
    model: gatewayModel(),
    output: Output.object({ schema: optimizationSchema }),
    system: [
      "You are an expert ATS resume writer. You rewrite resumes so they parse perfectly in ATS software and impress human recruiters.",
      NEVER_FABRICATE,
      "You MAY rephrase, restructure, strengthen action verbs, improve grammar, tighten wording, reorder sections and surface keywords that are already implied by the candidate's real experience.",
      "You MAY NOT add new employers, titles, dates, degrees, certifications, tools the candidate never mentioned, or invented metrics.",
      "Output optimizedResume as clean ATS-safe plain text: standard section headings in CAPS (PROFESSIONAL SUMMARY, SKILLS, EXPERIENCE, EDUCATION, PROJECTS, CERTIFICATIONS), simple '-' bullets, no tables, no columns, no emojis, no graphics.",
      "improvements: 6-12 entries describing what you changed and where. recommendedAdditions: things the candidate should add themselves because the data is genuinely missing.",
    ].join("\n"),
    prompt: [
      focus?.length ? `Priority fixes identified by the ATS scan:\n- ${focus.join("\n- ")}` : "",
      `--- RESUME TEXT START ---\n${resumeText}\n--- RESUME TEXT END ---`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  });
  return output;
}

export async function applySuggestionsWithAi(
  resumeText: string,
  suggestions: { title: string; how: string }[],
): Promise<AtsOptimization> {
  const { output } = await generateText({
    model: gatewayModel(),
    output: Output.object({ schema: optimizationSchema }),
    system: [
      "You are an expert ATS resume writer applying specific, user-approved improvements to a resume.",
      NEVER_FABRICATE,
      "Apply ONLY the requested suggestion(s). Keep every other part of the resume exactly as it is.",
      "When a suggestion asks for facts the resume does not contain, improve the wording and structure only; put the missing fact in recommendedAdditions instead of inventing it.",
      "Output optimizedResume as the FULL resume in clean ATS-safe plain text: section headings in CAPS, simple '-' bullets, no tables, columns, emojis or graphics.",
      "improvements: 1-5 entries describing precisely what changed. recommendedAdditions: only real data the candidate must supply themselves.",
    ].join("\n"),
    prompt: [
      `Apply these approved suggestions:\n${suggestions.map((s, i) => `${i + 1}. ${s.title} — ${s.how}`).join("\n")}`,
      `--- RESUME TEXT START ---\n${resumeText}\n--- RESUME TEXT END ---`,
    ].join("\n\n"),
  });
  return output;
}