import { motion } from "motion/react";
import { Sparkles, Loader2, ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";
import type { AtsAnalysis, AtsOptimization } from "@/lib/ats.schema";
import { scoreRating } from "@/lib/ats.schema";
import { ScoreGauge } from "./ScoreGauge";

type Props = {
  before: AtsAnalysis;
  optimization: AtsOptimization | null;
  after: AtsAnalysis | null;
  busy: boolean;
  onOptimize: () => void;
};

export function OptimizerPanel({ before, optimization, after, busy, onOptimize }: Props) {
  if (!after) {
    return (
      <section aria-labelledby="optimize-heading" className="surface-card relative overflow-hidden p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" />
            One click, fully automatic
          </span>
          <h2 id="optimize-heading" className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">
            Let AI fix your resume for you
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Our AI rewrites weak wording, strengthens action verbs, places missing keywords naturally,
            fixes grammar and rebuilds your formatting for ATS parsing — using only the real
            information already in your resume.
          </p>
          <button
            type="button"
            onClick={onOptimize}
            disabled={busy}
            className="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:cursor-progress disabled:opacity-80"
          >
            {busy ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                Optimizing your resume…
              </>
            ) : (
              <>
                <Sparkles className="size-5" aria-hidden="true" />
                Optimize Resume with AI
              </>
            )}
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Nothing is invented — if something important is missing, we tell you to add it instead.
          </p>
        </div>
      </section>
    );
  }

  const gain = Math.max(0, Math.round(after.overallScore - before.overallScore));

  return (
    <section aria-labelledby="optimized-heading" className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card overflow-hidden p-6 sm:p-8"
      >
        <header className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-success-foreground">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Re-analysis complete
          </span>
          <h2 id="optimized-heading" className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
            Your resume improved by{" "}
            <span className="text-gradient">+{gain} points</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Your resume is now significantly more ATS-friendly and has a better chance of passing
            automated recruiter screening.
          </p>
        </header>

        <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col items-center opacity-70">
            <ScoreGauge score={before.overallScore} size={170} label="Previous ATS Score" />
          </div>
          <div className="flex justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <ArrowRight className="size-5 sm:rotate-0" aria-hidden="true" />
            </span>
          </div>
          <div className="flex flex-col items-center">
            <ScoreGauge score={after.overallScore} size={200} label="Optimized ATS Score" />
            <span className="mt-2 rounded-full bg-success-soft px-3 py-1 text-sm font-bold text-success-foreground">
              {scoreRating(after.overallScore).label}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="surface-card p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            What the AI improved
          </h3>
          <ul className="mt-4 space-y-3">
            {optimization?.improvements.map((imp, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{imp.area}: </span>
                  {imp.change}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="surface-card p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
            <ClipboardList className="size-4 text-accent" aria-hidden="true" />
            Add these yourself (we never invent facts)
          </h3>
          {optimization?.recommendedAdditions.length ? (
            <ul className="mt-4 space-y-3">
              {optimization.recommendedAdditions.map((rec, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Nothing critical is missing from your resume.
            </p>
          )}
          <div className="mt-5 max-h-64 overflow-auto rounded-2xl bg-muted p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Optimized resume preview
            </h4>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground">
              {optimization?.optimizedResume}
            </pre>
          </div>
        </article>
      </div>
    </section>
  );
}
