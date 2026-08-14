import { HelpCircle, Wrench, TrendingUp, Check, Loader2, Wand2, Flame } from "lucide-react";
import type { AtsAnalysis } from "@/lib/ats.schema";

type Props = {
  suggestions: AtsAnalysis["suggestions"];
  appliedTitles?: string[];
  applyingTitle?: string | null;
  onApply?: (suggestion: AtsAnalysis["suggestions"][number]) => void;
};

/** Derives a display-only priority + estimated gain from the AI's impact text. */
function priorityOf(impact: string, index: number) {
  const nums = (impact.match(/\d+/g) ?? []).map(Number);
  const gain = nums.length ? Math.max(...nums) : Math.max(3, 12 - index * 2);
  if (gain >= 10) return { level: "High", gain, chip: "bg-danger-soft text-danger" };
  if (gain >= 5) return { level: "Medium", gain, chip: "bg-warning-soft text-warning-foreground" };
  return { level: "Low", gain, chip: "bg-primary-soft text-primary" };
}

export function Suggestions({ suggestions, appliedTitles = [], applyingTitle, onApply }: Props) {
  if (!suggestions?.length) return null;

  return (
    <section aria-labelledby="suggestions-heading">
      <header className="mb-5">
        <h2 id="suggestions-heading" className="text-xl font-bold text-foreground sm:text-2xl">
          AI improvement panel
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalized to your resume only — if a fix looks right for your profile, hit{" "}
          <span className="font-semibold text-foreground">Apply</span> and we rewrite that part
          instantly, then re-score your resume in real time.
        </p>
      </header>

      <ol className="grid gap-4 lg:grid-cols-2 [perspective:1200px]">
        {suggestions.map((s, i) => {
          const applied = appliedTitles.includes(s.title);
          const applying = applyingTitle === s.title;
          const p = priorityOf(s.impact ?? "", i);
          return (
            <li
              key={i}
              className={`tilt-3d surface-card flex flex-col p-5 ${applied ? "ring-2 ring-success/40" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-accent text-sm font-extrabold text-accent-foreground shadow-[var(--shadow-soft)]">
                  {i + 1}
                </span>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${p.chip}`}
                >
                  <Flame className="size-3" aria-hidden="true" />
                  {p.level} priority
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-extrabold text-success-foreground">
                  <TrendingUp className="size-3" aria-hidden="true" />
                  Est. +{p.gain}%
                </span>
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex gap-2">
                  <dt className="sr-only">Why it matters</dt>
                  <HelpCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <dd className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Why it matters: </span>
                    {s.why}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="sr-only">How to improve</dt>
                  <Wrench className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                  <dd className="text-muted-foreground">
                    <span className="font-semibold text-foreground">How to fix it: </span>
                    {s.how}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="sr-only">Expected impact</dt>
                  <TrendingUp className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  <dd className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Expected ATS impact: </span>
                    {s.impact}
                  </dd>
                </div>
              </dl>

              {onApply && (
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    {applied
                      ? "Applied to your resume — score updated."
                      : "Looks right for your profile?"}
                  </p>
                  <button
                    type="button"
                    onClick={() => onApply(s)}
                    disabled={applied || Boolean(applyingTitle)}
                    className={
                      applied
                        ? "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-soft px-4 py-2 text-xs font-bold text-success-foreground"
                        : "ripple inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-[1.04] active:scale-95 disabled:opacity-60"
                    }
                  >
                    {applied ? (
                      <>
                        <Check className="size-3.5" aria-hidden="true" />
                        Applied
                      </>
                    ) : applying ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                        Applying…
                      </>
                    ) : (
                      <>
                        <Wand2 className="size-3.5" aria-hidden="true" />
                        Apply this fix
                      </>
                    )}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
