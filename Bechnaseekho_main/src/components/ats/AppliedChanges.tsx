import { motion, AnimatePresence } from "motion/react";
import { Check, TrendingUp, FileText } from "lucide-react";

export type AppliedChange = {
  title: string;
  area: string;
  change: string;
  delta: number;
  score: number;
};

type Props = { changes: AppliedChange[]; resumeText: string };

export function AppliedChanges({ changes, resumeText }: Props) {
  if (!changes.length) return null;

  return (
    <section aria-labelledby="applied-heading" className="grid gap-4 lg:grid-cols-2">
      <article className="surface-card p-6">
        <h2 id="applied-heading" className="flex items-center gap-2 text-base font-bold text-foreground">
          <Check className="size-4 text-success" aria-hidden="true" />
          Changes applied live
        </h2>
        <ol className="mt-4 space-y-3">
          <AnimatePresence initial={false}>
            {changes.map((c, i) => (
              <motion.li
                key={`${c.title}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl bg-muted p-4 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-foreground">{c.area || c.title}</span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success-foreground">
                    <TrendingUp className="size-3" aria-hidden="true" />
                    {c.delta > 0 ? `+${c.delta}` : c.delta} → {c.score}
                  </span>
                </div>
                <p className="mt-1.5 text-muted-foreground">{c.change}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </article>

      <article className="surface-card p-6">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
          <FileText className="size-4 text-primary" aria-hidden="true" />
          Your updated resume (live)
        </h3>
        <div className="mt-4 max-h-72 overflow-auto rounded-2xl bg-muted p-4">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground">
            {resumeText}
          </pre>
        </div>
      </article>
    </section>
  );
}
