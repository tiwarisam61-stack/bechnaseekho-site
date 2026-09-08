import type { ResumeDoc, ResumeItem, ResumeSection } from "./resume-types";
import { emptySections, uid } from "./resume-types";

interface Parsed {
  profile?: Record<string, string>;
  summary?: string;
  experience?: { title?: string; company?: string; dates?: string; location?: string; bullets?: string[] }[];
  education?: { degree?: string; school?: string; dates?: string; bullets?: string[] }[];
  projects?: { name?: string; context?: string; dates?: string; bullets?: string[] }[];
  internships?: { title?: string; company?: string; dates?: string; bullets?: string[] }[];
  certifications?: { name?: string; issuer?: string; dates?: string }[];
  technicalSkills?: string[];
  softSkills?: string[];
  achievements?: string[];
  awards?: string[];
  languages?: string[];
  interests?: string[];
  references?: string;
  confidence?: Record<string, number>;
}

export interface ImportResult {
  doc: ResumeDoc;
  confidence: { label: string; value: number; found: boolean }[];
}

const toItem = (title = "", subtitle = "", meta = "", bullets: string[] = [], location = ""): ResumeItem => ({
  id: uid(),
  title,
  subtitle,
  meta,
  location,
  bullets: bullets.filter(Boolean),
});

export function applyParsedResume(base: ResumeDoc, raw: string): ImportResult {
  const parsed = JSON.parse(raw) as Parsed;
  const p = parsed.profile ?? {};
  const sections: ResumeSection[] = emptySections();

  const set = (kind: string, patch: Partial<ResumeSection>) => {
    const idx = sections.findIndex((s) => s.kind === kind);
    if (idx >= 0) sections[idx] = { ...sections[idx], ...patch };
  };

  const enabled = (v: unknown) => Array.isArray(v) ? v.length > 0 : Boolean(v && String(v).trim());

  set("summary", { text: parsed.summary ?? "", enabled: enabled(parsed.summary) });
  set("experience", {
    enabled: enabled(parsed.experience),
    items: (parsed.experience ?? []).map((e) =>
      toItem(e.title, e.company, e.dates, e.bullets ?? [], e.location),
    ),
  });
  set("education", {
    enabled: enabled(parsed.education),
    items: (parsed.education ?? []).map((e) => toItem(e.degree, e.school, e.dates, e.bullets ?? [])),
  });
  set("projects", {
    enabled: enabled(parsed.projects),
    items: (parsed.projects ?? []).map((e) => toItem(e.name, e.context, e.dates, e.bullets ?? [])),
  });
  set("internships", {
    enabled: enabled(parsed.internships),
    items: (parsed.internships ?? []).map((e) => toItem(e.title, e.company, e.dates, e.bullets ?? [])),
  });
  set("certifications", {
    enabled: enabled(parsed.certifications),
    items: (parsed.certifications ?? []).map((c) => toItem(c.name, c.issuer, c.dates, [])),
  });
  set("technicalSkills", {
    enabled: enabled(parsed.technicalSkills),
    tags: parsed.technicalSkills ?? [],
  });
  set("softSkills", { enabled: enabled(parsed.softSkills), tags: parsed.softSkills ?? [] });
  set("achievements", {
    enabled: enabled(parsed.achievements),
    items: (parsed.achievements ?? []).map((a) => toItem(a, "", "", [])),
  });
  set("awards", {
    enabled: enabled(parsed.awards),
    items: (parsed.awards ?? []).map((a) => toItem(a, "", "", [])),
  });
  set("languages", { enabled: enabled(parsed.languages), tags: parsed.languages ?? [] });
  set("interests", { enabled: enabled(parsed.interests), tags: parsed.interests ?? [] });
  set("references", { enabled: enabled(parsed.references), text: parsed.references ?? "" });

  const doc: ResumeDoc = {
    ...base,
    name: p.fullName ? `${p.fullName} — Resume` : base.name,
    profile: {
      photo: base.profile.photo,
      fullName: p.fullName ?? "",
      headline: p.headline ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      location: p.location ?? "",
      linkedin: p.linkedin ?? "",
      portfolio: p.portfolio ?? "",
    },
    sections,
    updatedAt: Date.now(),
  };

  const c = parsed.confidence ?? {};
  const confidence = [
    { label: "Contact details", value: c.profile ?? 0, found: Boolean(p.fullName) },
    { label: "Summary", value: c.summary ?? 0, found: enabled(parsed.summary) },
    { label: "Experience", value: c.experience ?? 0, found: enabled(parsed.experience) },
    { label: "Education", value: c.education ?? 0, found: enabled(parsed.education) },
    { label: "Skills", value: c.skills ?? 0, found: enabled(parsed.technicalSkills) },
    { label: "Projects", value: c.projects ?? 0, found: enabled(parsed.projects) },
    { label: "Certifications", value: c.certifications ?? 0, found: enabled(parsed.certifications) },
  ];

  return { doc, confidence };
}
