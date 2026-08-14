import { getTemplate, templateContentRole, templateDocTitle } from "./templates";
import { roleProfile, roleSections } from "./template-content";

export type SectionKind =

  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "technicalSkills"
  | "softSkills"
  | "certifications"
  | "achievements"
  | "awards"
  | "languages"
  | "internships"
  | "interests"
  | "references"
  | "custom";

export interface ResumeItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  location?: string;
  bullets: string[];
}

export interface ResumeSection {
  id: string;
  kind: SectionKind;
  label: string;
  enabled: boolean;
  collapsed?: boolean;
  /** free text for summary/custom */
  text?: string;
  /** comma-ish list for skills style sections */
  tags?: string[];
  items?: ResumeItem[];
}

export interface ResumeProfile {
  photo?: string;
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github?: string;
  portfolio: string;
}


export interface ResumeSettings {
  templateId: string;
  accent: string;
  fontFamily: "sans" | "serif" | "mono";
  fontScale: number;
  lineSpacing: number;
  margin: number;
  pageSize: "A4" | "Letter";
  showPhoto: boolean;
  darkPreview: boolean;
}

export interface ResumeDoc {
  id: string;
  name: string;
  updatedAt: number;
  profile: ResumeProfile;
  sections: ResumeSection[];
  settings: ResumeSettings;
}

export const ACCENTS = [
  { id: "brass", label: "Brass", value: "#b07d2b" },
  { id: "navy", label: "Navy", value: "#1f3352" },
  { id: "emerald", label: "Emerald", value: "#136b4f" },
  { id: "crimson", label: "Crimson", value: "#98282f" },
  { id: "slate", label: "Slate", value: "#3f4753" },
  { id: "teal", label: "Teal", value: "#12626b" },
];

export const uid = () => Math.random().toString(36).slice(2, 10);

const item = (
  title: string,
  subtitle: string,
  meta: string,
  bullets: string[],
  location = "",
): ResumeItem => ({ id: uid(), title, subtitle, meta, location, bullets });

export function starterSections(): ResumeSection[] {
  return [
    {
      id: uid(),
      kind: "summary",
      label: "Professional Summary",
      enabled: true,
      text: "Product-minded software engineer with 6+ years building high-scale web platforms. Led teams shipping revenue-critical features, improving conversion by 34% and cutting page load time in half.",
    },
    {
      id: uid(),
      kind: "experience",
      label: "Experience",
      enabled: true,
      items: [
        item(
          "Senior Frontend Engineer",
          "Northwind Technologies",
          "2022 — Present",
          [
            "Led the rebuild of the customer dashboard used by 120k monthly users, lifting task completion by 34%.",
            "Cut median page load from 3.1s to 1.4s by introducing route-level code splitting and image optimisation.",
            "Mentored 4 engineers and established the design-system review process adopted org-wide.",
          ],
          "Bengaluru, IN",
        ),
        item(
          "Frontend Engineer",
          "Lumen Labs",
          "2019 — 2022",
          [
            "Shipped 20+ production features across billing, onboarding and analytics surfaces.",
            "Built an experimentation framework that reduced A/B test setup time from days to hours.",
          ],
          "Remote",
        ),
      ],
    },
    {
      id: uid(),
      kind: "education",
      label: "Education",
      enabled: true,
      items: [
        item("B.Tech, Computer Science", "National Institute of Technology", "2015 — 2019", [
          "CGPA 8.7/10 · Dean's list for three consecutive semesters",
        ]),
      ],
    },
    {
      id: uid(),
      kind: "projects",
      label: "Projects",
      enabled: true,
      items: [
        item("CareerSync Insights", "Personal project", "2024", [
          "Analytics tool that scores resumes against job descriptions using keyword extraction.",
        ]),
      ],
    },
    {
      id: uid(),
      kind: "technicalSkills",
      label: "Technical Skills",
      enabled: true,
      tags: ["TypeScript", "React", "Next.js", "Node.js", "GraphQL", "PostgreSQL", "AWS", "Testing"],
    },
    {
      id: uid(),
      kind: "softSkills",
      label: "Soft Skills",
      enabled: true,
      tags: ["Leadership", "Communication", "Mentoring", "Stakeholder management"],
    },
    {
      id: uid(),
      kind: "certifications",
      label: "Certifications",
      enabled: true,
      items: [item("AWS Certified Developer — Associate", "Amazon Web Services", "2023", [])],
    },
    {
      id: uid(),
      kind: "achievements",
      label: "Achievements",
      enabled: false,
      items: [],
    },
    { id: uid(), kind: "awards", label: "Awards", enabled: false, items: [] },
    { id: uid(), kind: "internships", label: "Internships", enabled: false, items: [] },
    {
      id: uid(),
      kind: "languages",
      label: "Languages",
      enabled: true,
      tags: ["English (Fluent)", "Hindi (Native)"],
    },
    { id: uid(), kind: "interests", label: "Interests", enabled: false, tags: [] },
    { id: uid(), kind: "references", label: "References", enabled: false, text: "" },
  ];
}

export function emptySections(): ResumeSection[] {
  return starterSections().map((s) => ({
    ...s,
    text: "",
    tags: s.tags ? [] : undefined,
    items: s.items ? [] : undefined,
  }));
}

export function createResume(templateId: string, blank = false): ResumeDoc {
  const tpl = getTemplate(templateId);
  const role = templateContentRole(tpl);
  return {
    id: uid(),
    name: blank ? "My Resume" : templateDocTitle(tpl.id),
    updatedAt: Date.now(),
    profile: blank
      ? {
          fullName: "",
          headline: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          portfolio: "",
        }
      : roleProfile(role),
    sections: blank ? emptySections() : roleSections(role),
    settings: {
      templateId: tpl.id,
      accent: tpl.accent,
      fontFamily: "sans",
      fontScale: 1,
      lineSpacing: 1.45,
      margin: 44,
      pageSize: "A4",
      showPhoto: Boolean(tpl.withPhoto),
      darkPreview: false,
    },
  };
}

/** Required fields a resume must have before it is export-ready. */
export function requiredFieldIssues(doc: ResumeDoc): string[] {
  const issues: string[] = [];
  const p = doc.profile;
  if (!p.fullName.trim()) issues.push("Full name");
  if (!p.phone.trim()) issues.push("Phone number");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email.trim())) issues.push("Email");
  if (!p.location.trim()) issues.push("Current location");
  const hasSkills = doc.sections.some(
    (s) => (s.kind === "skills" || s.kind === "technicalSkills") && s.enabled && (s.tags?.length ?? 0) > 0,
  );
  if (!hasSkills) issues.push("Skills");
  return issues;
}


