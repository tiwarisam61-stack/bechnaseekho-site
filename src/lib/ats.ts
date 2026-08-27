import type { ResumeDoc, ResumeSection } from "./resume-types";

export interface AtsReport {
  overall: number;
  keywords: number;
  formatting: number;
  content: number;
  readability: number;
  completion: number;
  words: number;
  readingTime: string;
  missing: string[];
  suggestions: string[];
}

const ACTION_VERBS = [
  "led",
  "built",
  "shipped",
  "designed",
  "launched",
  "improved",
  "reduced",
  "increased",
  "owned",
  "drove",
  "delivered",
  "scaled",
  "mentored",
  "automated",
  "optimised",
  "optimized",
];

const sectionText = (s: ResumeSection) =>
  [s.text ?? "", ...(s.tags ?? []), ...(s.items ?? []).flatMap((i) => [i.title, i.subtitle ?? "", i.meta ?? "", ...i.bullets])]
    .join(" ")
    .trim();

const hasContent = (s: ResumeSection) => s.enabled && sectionText(s).length > 0;

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function analyzeResume(doc: ResumeDoc): AtsReport {
  const enabled = doc.sections.filter(hasContent);
  const allText = [
    doc.profile.fullName,
    doc.profile.headline,
    ...enabled.map(sectionText),
  ].join(" ");
  const words = allText.split(/\s+/).filter(Boolean).length;
  const bullets = doc.sections.flatMap((s) => s.items ?? []).flatMap((i) => i.bullets);

  const missing: string[] = [];
  const required: [string, string][] = [
    ["summary", "Professional Summary"],
    ["experience", "Experience"],
    ["education", "Education"],
    ["technicalSkills", "Technical Skills"],
  ];
  for (const [kind, label] of required) {
    if (!enabled.some((s) => s.kind === kind)) missing.push(label);
  }

  const contactFields = [
    doc.profile.fullName,
    doc.profile.email,
    doc.profile.phone,
    doc.profile.location,
    doc.profile.linkedin,
  ].filter((v) => v.trim().length > 0).length;

  const quantified = bullets.filter((b) => /\d/.test(b)).length;
  const actioned = bullets.filter((b) =>
    ACTION_VERBS.some((v) => b.toLowerCase().startsWith(v) || b.toLowerCase().includes(` ${v} `)),
  ).length;

  const skillCount = enabled
    .filter((s) => s.kind === "technicalSkills" || s.kind === "softSkills" || s.kind === "skills")
    .reduce((n, s) => n + (s.tags?.length ?? 0), 0);

  const keywords = clamp(28 + skillCount * 5 + Math.min(bullets.length, 12) * 2.4);
  const formatting = clamp(
    52 + contactFields * 6 + (missing.length === 0 ? 14 : -missing.length * 6) + (words > 120 ? 6 : 0),
  );
  const content = clamp(
    24 +
      (bullets.length ? (quantified / bullets.length) * 38 : 0) +
      (bullets.length ? (actioned / bullets.length) * 24 : 0) +
      Math.min(words / 12, 22),
  );
  const readability = clamp(
    58 +
      (words > 200 && words < 750 ? 22 : 6) +
      (bullets.every((b) => b.length < 220) ? 12 : 0) +
      (enabled.length >= 5 ? 8 : 0),
  );

  const totalTrackable = doc.sections.length + 6;
  const filled =
    enabled.length +
    contactFields +
    (doc.profile.headline ? 1 : 0);
  const completion = clamp((filled / totalTrackable) * 100);

  const overall = clamp(keywords * 0.3 + formatting * 0.25 + content * 0.28 + readability * 0.17);

  const suggestions: string[] = [];
  if (quantified < bullets.length * 0.5)
    suggestions.push("Add measurable outcomes (%, ₹/$, time saved) to more bullet points.");
  if (skillCount < 8) suggestions.push("List at least 8 role-specific technical skills.");
  if (!doc.profile.linkedin) suggestions.push("Add a LinkedIn URL — recruiters check it 80% of the time.");
  if (words < 220) suggestions.push("Your resume is light on detail; aim for 350–650 words.");
  if (words > 800) suggestions.push("Trim to under 800 words so recruiters can scan in 30 seconds.");
  if (bullets.some((b) => b.length > 220)) suggestions.push("Shorten long bullets to one or two lines each.");
  if (missing.length) suggestions.push(`Add the missing section${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);
  if (!suggestions.length) suggestions.push("Looking strong. Tailor keywords to each job description before applying.");

  const minutes = Math.max(1, Math.round(words / 220));
  return {
    overall,
    keywords,
    formatting,
    content,
    readability,
    completion,
    words,
    readingTime: `${minutes} min read`,
    missing,
    suggestions,
  };
}
