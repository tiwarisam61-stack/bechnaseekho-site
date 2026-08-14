import { z } from "zod";

/** Shared schemas + types for resume parsing and ATS analysis (client-safe). */

export const profileSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  linkedin: z.string(),
  portfolio: z.string(),
  github: z.string(),
  summary: z.string(),
  industry: z.string(),
  jobRole: z.string(),
  skills: z.array(z.string()),
  technicalSkills: z.array(z.string()),
  softSkills: z.array(z.string()),
  tools: z.array(z.string()),
  languages: z.array(z.string()),
  keywords: z.array(z.string()),
  certifications: z.array(z.string()),
  awards: z.array(z.string()),
  achievements: z.array(z.string()),
  education: z.array(
    z.object({ degree: z.string(), institution: z.string(), period: z.string() }),
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      period: z.string(),
      highlights: z.array(z.string()),
    }),
  ),
  projects: z.array(z.object({ name: z.string(), description: z.string() })),
});

export const metricSchema = z.object({
  label: z.string(),
  score: z.number(),
  status: z.enum(["excellent", "good", "fair", "poor"]),
  explanation: z.string(),
  suggestion: z.string(),
});

export const recruiterSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingSections: z.array(z.string()),
  weakBulletPoints: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  formattingIssues: z.array(z.string()),
  grammarIssues: z.array(z.string()),
  layoutProblems: z.array(z.string()),
  readabilityProblems: z.array(z.string()),
  recruiterImpression: z.string(),
  interviewReadiness: z.string(),
});

export const suggestionSchema = z.object({
  title: z.string(),
  why: z.string(),
  how: z.string(),
  impact: z.string(),
});

export const analysisSchema = z.object({
  overallScore: z.number(),
  executiveSummary: z.string(),
  scoreMeaning: z.string(),
  profile: profileSchema,
  metrics: z.array(metricSchema),
  recruiter: recruiterSchema,
  suggestions: z.array(suggestionSchema),
});

export const optimizationSchema = z.object({
  optimizedResume: z.string(),
  improvements: z.array(z.object({ area: z.string(), change: z.string() })),
  recommendedAdditions: z.array(z.string()),
});

export type AtsProfile = z.infer<typeof profileSchema>;
export type AtsMetric = z.infer<typeof metricSchema>;
export type AtsAnalysis = z.infer<typeof analysisSchema>;
export type AtsOptimization = z.infer<typeof optimizationSchema>;

export const METRIC_LABELS = [
  "Resume Formatting",
  "Keyword Match",
  "Skills Match",
  "Experience Quality",
  "Education Quality",
  "Projects",
  "Achievements",
  "Grammar",
  "Readability",
  "Resume Length",
  "Section Structure",
  "ATS Compatibility",
  "Action Verbs",
  "Technical Skills",
  "Soft Skills",
  "Keyword Density",
  "Recruiter Readability",
  "Professional Summary",
  "Consistency",
  "Contact Information",
] as const;

export function scoreRating(score: number) {
  if (score >= 95) return { stars: 5, label: "Outstanding", tone: "success" as const };
  if (score >= 90) return { stars: 4.5, label: "Excellent", tone: "success" as const };
  if (score >= 80) return { stars: 4, label: "Good", tone: "primary" as const };
  if (score >= 70) return { stars: 3, label: "Fair", tone: "warning" as const };
  if (score >= 60) return { stars: 2, label: "Needs Improvement", tone: "warning" as const };
  return { stars: 1, label: "Poor", tone: "danger" as const };
}
