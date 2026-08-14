import type { AtsReport } from "./ats";
import type { ResumeDoc, ResumeSection, SectionKind } from "./resume-types";

export interface ChecklistEntry {
  id: string;
  label: string;
  done: boolean;
  hint: string;
}

const filled = (s?: ResumeSection) =>
  Boolean(
    s &&
      (s.text?.trim() ||
        (s.tags ?? []).filter(Boolean).length ||
        (s.items ?? []).some((i) => i.title.trim() || i.bullets.some((b) => b.trim()))),
  );

export const findSection = (doc: ResumeDoc, kind: SectionKind) =>
  doc.sections.find((s) => s.kind === kind);

/** Plain-language completion checklist used by the mobile wizard. */
export function resumeChecklist(doc: ResumeDoc): ChecklistEntry[] {
  const p = doc.profile;
  const skills = [
    findSection(doc, "technicalSkills"),
    findSection(doc, "skills"),
    findSection(doc, "softSkills"),
  ];
  return [
    {
      id: "personal",
      label: "Personal details",
      done: Boolean(p.fullName.trim() && p.phone.trim() && p.email.trim()),
      hint: "Add your name, phone number and email.",
    },
    {
      id: "summary",
      label: "Professional summary",
      done: filled(findSection(doc, "summary")),
      hint: "Write 2–3 lines about who you are.",
    },
    {
      id: "experience",
      label: "Work experience",
      done: filled(findSection(doc, "experience")),
      hint: "Add at least one job or internship.",
    },
    {
      id: "education",
      label: "Education",
      done: filled(findSection(doc, "education")),
      hint: "Add your degree and college.",
    },
    {
      id: "skills",
      label: "Skills",
      done: skills.some(filled),
      hint: "List the tools and skills you know.",
    },
    {
      id: "projects",
      label: "Projects",
      done: filled(findSection(doc, "projects")),
      hint: "Show 1–2 projects you have built.",
    },
    {
      id: "certifications",
      label: "Certifications",
      done: filled(findSection(doc, "certifications")),
      hint: "Optional, but it helps you stand out.",
    },
  ];
}

export function completionPercent(list: ChecklistEntry[]) {
  return Math.round((list.filter((e) => e.done).length / list.length) * 100);
}

/** Turns ATS analysis into simple advice with no jargon. */
export function plainAtsAdvice(doc: ResumeDoc, report: AtsReport): { done: boolean; text: string }[] {
  const tips: { done: boolean; text: string }[] = [];
  const skillCount = doc.sections
    .filter((s) => ["technicalSkills", "softSkills", "skills"].includes(s.kind) && s.enabled)
    .reduce((n, s) => n + (s.tags?.filter(Boolean).length ?? 0), 0);
  const bullets = doc.sections.flatMap((s) => s.items ?? []).flatMap((i) => i.bullets).filter(Boolean);
  const numbers = bullets.filter((b) => /\d/.test(b)).length;

  tips.push({
    done: skillCount >= 8,
    text: skillCount >= 8 ? "You have enough skills listed." : `Add ${Math.max(1, 8 - skillCount)} more skills.`,
  });
  tips.push({
    done: filled(findSection(doc, "summary")),
    text: filled(findSection(doc, "summary"))
      ? "Your summary is ready."
      : "Add a short professional summary.",
  });
  tips.push({
    done: bullets.length > 0 && numbers >= Math.ceil(bullets.length / 2),
    text:
      bullets.length > 0 && numbers >= Math.ceil(bullets.length / 2)
        ? "Your points include real numbers."
        : "Add numbers to your points, like “increased sales by 30%”.",
  });
  tips.push({
    done: Boolean(doc.profile.linkedin.trim()),
    text: doc.profile.linkedin.trim() ? "LinkedIn link added." : "Add your LinkedIn profile link.",
  });
  tips.push({
    done: report.words >= 220,
    text: report.words >= 220 ? "Your resume has enough detail." : "Write a little more — aim for one full page.",
  });
  return tips;
}
