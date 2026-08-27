import {
  ThumbsUp,
  ThumbsDown,
  LayoutPanelTop,
  MessageSquareX,
  KeyRound,
  Ruler,
  SpellCheck,
  Rows3,
  Eye,
  UserCheck,
  CalendarCheck,
} from "lucide-react";
import type { AtsAnalysis } from "@/lib/ats.schema";

function List({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
  tone: "success" | "danger" | "warning" | "primary";
}) {
  const toneClass = {
    success: "text-success bg-success-soft",
    danger: "text-danger bg-danger-soft",
    warning: "text-warning-foreground bg-warning-soft",
    primary: "text-primary bg-primary-soft",
  }[tone];

  return (
    <article className="surface-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
        <span className={`flex size-8 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        {title}
      </h3>
      {items?.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Nothing flagged here — nice work.</p>
      )}
    </article>
  );
}

export function RecruiterFeedback({ analysis }: { analysis: AtsAnalysis }) {
  const r = analysis.recruiter;
  return (
    <section aria-labelledby="recruiter-heading">
      <header className="mb-5">
        <h2 id="recruiter-heading" className="text-xl font-bold text-foreground sm:text-2xl">
          AI recruiter feedback
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Exactly what a hiring manager notices in the first 30 seconds of reading your resume.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="surface-card bg-gradient-primary p-6 text-primary-foreground">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <UserCheck className="size-4" aria-hidden="true" />
            Recruiter impression
          </h3>
          <p className="mt-2 text-sm leading-relaxed opacity-95">{r.recruiterImpression}</p>
        </article>
        <article className="surface-card p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <CalendarCheck className="size-4 text-success" aria-hidden="true" />
            Interview readiness
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.interviewReadiness}</p>
        </article>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <List icon={ThumbsUp} title="Strengths" items={r.strengths} tone="success" />
        <List icon={ThumbsDown} title="Weaknesses" items={r.weaknesses} tone="danger" />
        <List icon={LayoutPanelTop} title="Missing sections" items={r.missingSections} tone="warning" />
        <List icon={MessageSquareX} title="Weak bullet points" items={r.weakBulletPoints} tone="danger" />
        <List icon={KeyRound} title="Missing keywords" items={r.missingKeywords} tone="primary" />
        <List icon={Ruler} title="Formatting issues" items={r.formattingIssues} tone="warning" />
        <List icon={SpellCheck} title="Grammar issues" items={r.grammarIssues} tone="danger" />
        <List icon={Rows3} title="Layout problems" items={r.layoutProblems} tone="warning" />
        <List icon={Eye} title="Readability problems" items={r.readabilityProblems} tone="primary" />
      </div>
    </section>
  );
}
