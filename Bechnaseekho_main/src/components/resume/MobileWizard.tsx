import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Download,
  Eye,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MobileField } from "./MobileField";
import { ResumeDocument } from "./ResumeDocument";
import type { AtsReport } from "@/lib/ats";
import type { ResumeDoc, ResumeSection, SectionKind } from "@/lib/resume-types";
import { uid } from "@/lib/resume-types";
import { completionPercent, findSection, plainAtsAdvice, resumeChecklist } from "@/lib/resume-progress";
import { cn } from "@/lib/utils";

type Setter = (updater: (d: ResumeDoc) => ResumeDoc) => void;

export const WIZARD_STEPS = [
  { id: "personal", title: "Personal information", blurb: "How employers will contact you." },
  { id: "summary", title: "Professional summary", blurb: "A short intro at the top of your resume." },
  { id: "experience", title: "Work experience", blurb: "Your jobs, internships and roles." },
  { id: "education", title: "Education", blurb: "Your degrees and qualifications." },
  { id: "skills", title: "Skills", blurb: "The tools and strengths you bring." },
  { id: "projects", title: "Projects", blurb: "Work you have built or delivered." },
  { id: "certifications", title: "Certifications", blurb: "Courses and credentials you earned." },
  { id: "preview", title: "Preview resume", blurb: "See exactly how it will print." },
  { id: "ats", title: "ATS score", blurb: "Simple ways to get shortlisted." },
  { id: "download", title: "Download resume", blurb: "Save it as PDF or Word." },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

const LABELS: Record<string, { label: string; kind: SectionKind }> = {
  summary: { label: "Professional Summary", kind: "summary" },
  experience: { label: "Experience", kind: "experience" },
  education: { label: "Education", kind: "education" },
  projects: { label: "Projects", kind: "projects" },
  certifications: { label: "Certifications", kind: "certifications" },
};

const ITEM_COPY: Record<string, { title: string; subtitle: string; meta: string; bullets: string; help: string }> = {
  experience: {
    title: "Job title — e.g. Python Developer",
    subtitle: "Company name — e.g. Infosys",
    meta: "Jan 2022 — Present",
    bullets:
      "Built REST APIs used by 40,000 users\nAutomated reports and saved 10 hours every week",
    help: "Write one point per line. Start with an action word and add a number where you can.",
  },
  education: {
    title: "Degree — e.g. B.Tech Computer Science",
    subtitle: "College or university name",
    meta: "2018 — 2022",
    bullets: "CGPA 8.4/10\nCore subjects: Data Structures, DBMS",
    help: "Add your marks or key subjects if they are strong.",
  },
  projects: {
    title: "Project name — e.g. Expense Tracker App",
    subtitle: "Personal project / College project",
    meta: "2024",
    bullets:
      "Built with React and Node.js for 500+ users\nAdded charts that reduced manual tracking time by 60%",
    help: "Explain what you made, the tools you used and the result.",
  },
  certifications: {
    title: "Certificate name — e.g. AWS Cloud Practitioner",
    subtitle: "Issued by — e.g. Amazon Web Services",
    meta: "2024",
    bullets: "",
    help: "Add the certificate name, who issued it and the year.",
  },
};

function ensureSection(doc: ResumeDoc, key: string): { doc: ResumeDoc; section: ResumeSection } {
  const meta = LABELS[key];
  const existing = findSection(doc, meta.kind);
  if (existing) return { doc, section: existing };
  const section: ResumeSection = {
    id: uid(),
    kind: meta.kind,
    label: meta.label,
    enabled: true,
    ...(meta.kind === "summary" ? { text: "" } : { items: [] }),
  };
  return { doc: { ...doc, sections: [...doc.sections, section] }, section };
}

function StepShell({
  index,
  total,
  title,
  blurb,
  children,
}: {
  index: number;
  total: number;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brass">
          Step {index + 1} of {total}
        </p>
        <h2 className="mt-1 text-2xl leading-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
      </div>
      {children}
    </section>
  );
}

export function MobileWizard({
  doc,
  setDoc,
  report,
  step,
  setStep,
  onPreview,
  onDownloadPdf,
  onDownloadDocx,
  exporting,
}: {
  doc: ResumeDoc;
  setDoc: Setter;
  report: AtsReport;
  step: WizardStepId;
  setStep: (s: WizardStepId) => void;
  onPreview: () => void;
  onDownloadPdf: () => void;
  onDownloadDocx: () => void;
  exporting: boolean;
}) {
  const index = Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === step));
  const current = WIZARD_STEPS[index];
  const checklist = useMemo(() => resumeChecklist(doc), [doc]);
  const percent = completionPercent(checklist);
  const advice = useMemo(() => plainAtsAdvice(doc, report), [doc, report]);

  const setProfile = (patch: Partial<ResumeDoc["profile"]>) =>
    setDoc((d) => ({ ...d, profile: { ...d.profile, ...patch } }));

  const patchSection = (key: string, patch: (s: ResumeSection) => Partial<ResumeSection>) =>
    setDoc((d) => {
      const { doc: next, section } = ensureSection(d, key);
      return {
        ...next,
        sections: next.sections.map((s) =>
          s.id === section.id ? { ...s, enabled: true, ...patch(s) } : s,
        ),
      };
    });

  const listStep = (key: "experience" | "education" | "projects" | "certifications") => {
    const section = findSection(doc, LABELS[key].kind);
    const items = section?.items ?? [];
    const copy = ITEM_COPY[key];
    return (
      <div className="space-y-4">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-card p-5 text-center">
            <FileText className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Nothing added yet</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy.help}</p>
          </div>
        )}
        {items.map((item, i) => (
          <div key={item.id} className="space-y-3 rounded-2xl border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Entry {i + 1}</p>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-9 text-destructive"
                onClick={() =>
                  patchSection(key, (s) => ({ items: (s.items ?? []).filter((x) => x.id !== item.id) }))
                }
              >
                <Trash2 className="size-4" /> Remove
              </Button>
            </div>
            <MobileField
              label="Title"
              required
              value={item.title}
              placeholder={copy.title}
              onChange={(v) =>
                patchSection(key, (s) => ({
                  items: (s.items ?? []).map((x) => (x.id === item.id ? { ...x, title: v } : x)),
                }))
              }
            />
            <MobileField
              label="Organisation"
              value={item.subtitle ?? ""}
              placeholder={copy.subtitle}
              onChange={(v) =>
                patchSection(key, (s) => ({
                  items: (s.items ?? []).map((x) => (x.id === item.id ? { ...x, subtitle: v } : x)),
                }))
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <MobileField
                label="Dates"
                value={item.meta ?? ""}
                placeholder={copy.meta}
                onChange={(v) =>
                  patchSection(key, (s) => ({
                    items: (s.items ?? []).map((x) => (x.id === item.id ? { ...x, meta: v } : x)),
                  }))
                }
              />
              <MobileField
                label="Location"
                value={item.location ?? ""}
                placeholder="City, Country"
                onChange={(v) =>
                  patchSection(key, (s) => ({
                    items: (s.items ?? []).map((x) => (x.id === item.id ? { ...x, location: v } : x)),
                  }))
                }
              />
            </div>
            {key !== "certifications" && (
              <MobileField
                label="What you did"
                multiline
                rows={5}
                helper={copy.help}
                placeholder={copy.bullets}
                aiContext={`${LABELS[key].label} bullet points`}
                value={item.bullets.join("\n")}
                onChange={(v) =>
                  patchSection(key, (s) => ({
                    items: (s.items ?? []).map((x) =>
                      x.id === item.id
                        ? { ...x, bullets: v.split("\n").map((b) => b.replace(/^[-•]\s*/, "")) }
                        : x,
                    ),
                  }))
                }
              />
            )}
          </div>
        ))}
        <Button
          variant="outline"
          className="min-h-12 w-full"
          onClick={() =>
            patchSection(key, (s) => ({
              items: [
                ...(s.items ?? []),
                { id: uid(), title: "", subtitle: "", meta: "", location: "", bullets: [""] },
              ],
            }))
          }
        >
          <Plus className="size-4" /> Add {items.length ? "another" : ""} entry
        </Button>
      </div>
    );
  };

  const tagStep = (kind: SectionKind, label: string, placeholder: string, helper: string) => {
    const section = doc.sections.find((s) => s.kind === kind);
    return (
      <MobileField
        label={label}
        multiline
        rows={3}
        helper={helper}
        placeholder={placeholder}
        aiContext={label}
        value={(section?.tags ?? []).join(", ")}
        onChange={(v) =>
          setDoc((d) => {
            const tags = v.split(",").map((t) => t.trim()).filter(Boolean);
            const exists = d.sections.some((s) => s.kind === kind);
            return exists
              ? {
                  ...d,
                  sections: d.sections.map((s) => (s.kind === kind ? { ...s, enabled: true, tags } : s)),
                }
              : {
                  ...d,
                  sections: [...d.sections, { id: uid(), kind, label, enabled: true, tags }],
                };
          })
        }
      />
    );
  };

  const body = () => {
    switch (step) {
      case "personal":
        return (
          <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-soft">
            <MobileField
              label="Full name"
              required
              autoComplete="name"
              value={doc.profile.fullName}
              placeholder="Aarav Sharma"
              helper="Use the same name that appears on your ID."
              onChange={(v) => setProfile({ fullName: v })}
            />
            <MobileField
              label="Job title"
              required
              value={doc.profile.headline}
              placeholder="Python Developer"
              helper="The role you are applying for, not your current one."
              aiContext="resume headline"
              onChange={(v) => setProfile({ headline: v })}
            />
            <MobileField
              label="Phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={doc.profile.phone}
              placeholder="+91 98765 43210"
              helper="Add your country code so recruiters can call you."
              onChange={(v) => setProfile({ phone: v })}
            />
            <MobileField
              label="Email"
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              value={doc.profile.email}
              placeholder="aarav.sharma@gmail.com"
              helper="Use a simple, professional email address."
              onChange={(v) => setProfile({ email: v })}
            />
            <MobileField
              label="Address"
              autoComplete="address-level2"
              value={doc.profile.location}
              placeholder="Pune, India"
              helper="City and country is enough — no full address needed."
              onChange={(v) => setProfile({ location: v })}
            />
            <MobileField
              label="LinkedIn"
              type="url"
              inputMode="url"
              value={doc.profile.linkedin}
              placeholder="linkedin.com/in/aaravsharma"
              helper="Optional, but recruiters check it often."
              onChange={(v) => setProfile({ linkedin: v })}
            />
          </div>
        );
      case "summary":
        return (
          <div className="rounded-2xl border bg-card p-4 shadow-soft">
            <MobileField
              label="Professional summary"
              multiline
              rows={6}
              aiContext="professional summary"
              helper="2–3 lines: your role, years of experience and your biggest strength. Tap AI to write it for you."
              placeholder="Python Developer with 3 years of experience in automation testing and REST APIs. Built tools that cut manual work by 40% and supported 50,000+ users."
              value={findSection(doc, "summary")?.text ?? ""}
              onChange={(v) => patchSection("summary", () => ({ text: v }))}
            />
          </div>
        );
      case "experience":
      case "education":
      case "projects":
      case "certifications":
        return listStep(step);
      case "skills":
        return (
          <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-soft">
            {tagStep(
              "technicalSkills",
              "Technical skills",
              "Python, SQL, Django, REST APIs, Git, AWS, Pandas, Docker",
              "Separate each skill with a comma. Add at least 8 for a strong ATS score.",
            )}
            {tagStep(
              "softSkills",
              "Soft skills",
              "Communication, Teamwork, Problem solving, Time management",
              "Choose 3–5 that match the job description.",
            )}
            {tagStep(
              "languages",
              "Languages",
              "English (Fluent), Hindi (Native)",
              "Optional — useful for customer-facing roles.",
            )}
          </div>
        );
      case "preview":
        return (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border bg-card p-3 shadow-soft">
              <div className="mx-auto w-full max-w-[340px] origin-top overflow-hidden">
                <div style={{ transform: "scale(0.42)", transformOrigin: "top left", width: 794, height: 500 }}>
                  <ResumeDocument doc={doc} />
                </div>
              </div>
            </div>
            <Button className="min-h-12 w-full text-base" onClick={onPreview}>
              <Eye className="size-5" /> Open full screen preview
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Pinch to zoom and scroll through every page, exactly like the final PDF.
            </p>
          </div>
        );
      case "ats":
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-5 text-center shadow-soft">
              <p className="text-5xl font-semibold tabular-nums">{report.overall}</p>
              <p className="mt-1 text-sm text-muted-foreground">out of 100 — how well recruiters' software reads your resume</p>
              <Progress value={report.overall} className="mt-3 h-2" />
            </div>
            <div className="space-y-2">
              {advice.map((tip) => (
                <div
                  key={tip.text}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-sm",
                    tip.done ? "border-success/30 bg-success/5" : "border-destructive/25 bg-destructive/5",
                  )}
                >
                  {tip.done ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Your score improves automatically as you complete the sections above.
            </p>
          </div>
        );
      case "download":
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-4 shadow-soft">
              <p className="text-sm font-semibold">Almost done</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your resume is {percent}% complete with an ATS score of {report.overall}. You can download it now and
                come back to edit any time.
              </p>
            </div>
            <Button className="min-h-14 w-full text-base" disabled={exporting} onClick={onDownloadPdf}>
              {exporting ? <Loader2 className="size-5 animate-spin" /> : <Download className="size-5" />}
              Download PDF
            </Button>
            <Button variant="outline" className="min-h-14 w-full text-base" disabled={exporting} onClick={onDownloadDocx}>
              <Download className="size-5" /> Download Word (.docx)
            </Button>
            <Button variant="ghost" className="min-h-12 w-full" onClick={onPreview}>
              <Eye className="size-4" /> Check the preview one more time
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Live progress */}
      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Resume completion</p>
          <span className="text-sm font-semibold tabular-nums">{percent}%</span>
        </div>
        <Progress value={percent} className="mt-2 h-2" />
        <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {checklist.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2 text-xs">
              {entry.done ? (
                <Check className="size-3.5 shrink-0 text-success" />
              ) : (
                <CircleAlert className="size-3.5 shrink-0 text-brass" />
              )}
              <span className={entry.done ? "text-muted-foreground" : "font-medium"}>
                {entry.label}
                {!entry.done && " — missing"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Step dots */}
      <div className="flex gap-1" aria-hidden>
        {WIZARD_STEPS.map((s, i) => (
          <span
            key={s.id}
            className={cn("h-1 flex-1 rounded-full", i <= index ? "bg-primary" : "bg-muted")}
          />
        ))}
      </div>

      <StepShell index={index} total={WIZARD_STEPS.length} title={current.title} blurb={current.blurb}>
        {body()}
      </StepShell>

      {/* Step navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="min-h-12 flex-1"
          disabled={index === 0}
          onClick={() => setStep(WIZARD_STEPS[Math.max(0, index - 1)].id)}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        {index < WIZARD_STEPS.length - 1 && (
          <Button
            className="min-h-12 flex-[1.4]"
            onClick={() => setStep(WIZARD_STEPS[index + 1].id)}
          >
            Continue <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
