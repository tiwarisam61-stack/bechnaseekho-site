import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Loader2, ScanLine } from "lucide-react";

export const SCAN_STEPS = [
  "Reading Resume",
  "Detecting Sections",
  "Extracting Skills",
  "Matching Keywords",
  "ATS Compatibility Check",
  "Recruiter Readability Check",
  "Formatting Review",
  "Grammar Review",
  "Professional Tone Analysis",
  "Experience Analysis",
  "Education Analysis",
  "Skills Match",
  "Keyword Density",
  "Action Verbs Analysis",
  "Resume Completeness",
  "Industry Benchmark Comparison",
  "Final Score Calculation",
];

type Props = { finished: boolean; label?: string };

export function ScanTimeline({ finished, label = "Analyzing your resume" }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (finished) {
      setStep(SCAN_STEPS.length);
      return;
    }
    const id = window.setInterval(() => {
      setStep((s) => (s >= SCAN_STEPS.length - 1 ? SCAN_STEPS.length - 1 : s + 1));
    }, 260);
    return () => window.clearInterval(id);
  }, [finished]);

  const pct = Math.round((Math.min(step, SCAN_STEPS.length) / SCAN_STEPS.length) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      aria-live="polite"
      aria-label={label}
      className="surface-card relative overflow-hidden p-6 sm:p-8"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-primary opacity-[0.18] blur-2xl"
        style={{ animation: "var(--animate-sweep)" }}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft">
          <ScanLine className="size-5 animate-pulse text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">{label}</h2>
          <p className="text-sm text-muted-foreground">
            Our AI is running a full 17-point ATS inspection — this takes just a few seconds.
          </p>
        </div>
        <span className="ml-auto hidden text-2xl font-extrabold text-primary sm:block">{pct}%</span>
      </div>

      <div className="relative mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-primary"
          animate={{ width: `${pct}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      <ol className="relative mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {SCAN_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={s}
              className={[
                "flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm transition-colors duration-300",
                done ? "text-foreground" : active ? "bg-primary-soft text-primary" : "text-muted-foreground/60",
              ].join(" ")}
            >
              {done ? (
                <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
              ) : active ? (
                <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
              ) : (
                <span className="size-4 shrink-0 rounded-full border border-border" aria-hidden="true" />
              )}
              <span className="truncate font-medium">{s}</span>
            </li>
          );
        })}
      </ol>
    </motion.section>
  );
}
