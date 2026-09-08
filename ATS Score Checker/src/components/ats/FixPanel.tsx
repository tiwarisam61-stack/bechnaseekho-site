import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Wand2,
  Undo2,
  SkipForward,
  Loader2,
  Sparkles,
  TrendingUp,
  Flame,
  Clock,
  Gauge,
} from "lucide-react";
import type { AtsAnalysis } from "@/lib/ats.schema";
import { collapseDiff, diffLines, diffStats } from "@/lib/diff";

export type FixPreview = {
  suggestion: AtsAnalysis["suggestions"][number];
  before: string;
  after: string;
  improvements: { area: string; change: string }[];
  priority: string;
  gain: number;
};

type Props = {
  preview: FixPreview | null;
  loading: boolean;
  loadingTitle: string | null;
  applying: boolean;
  canUndo: boolean;
  onClose: () => void;
  onApply: () => void;
  onUndo: () => void;
  onApplyAll: () => void;
  remaining: number;
};

export function FixPanel({
  preview,
  loading,
  loadingTitle,
  applying,
  canUndo,
  onClose,
  onApply,
  onUndo,
  onApplyAll,
  remaining,
}: Props) {
  const open = loading || Boolean(preview);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const rows = useMemo(() => {
    if (!preview) return [];
    return collapseDiff(diffLines(preview.before, preview.after));
  }, [preview]);

  const stats = useMemo(
    () => (preview ? diffStats(diffLines(preview.before, preview.after)) : { added: 0, removed: 0 }),
    [preview],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="fix-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            key="fix-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Review suggested resume change"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-border bg-card shadow-2xl sm:w-[min(36rem,94vw)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Suggested rewrite
                </p>
                <h2 className="mt-1.5 text-lg font-extrabold leading-snug text-foreground">
                  {preview?.suggestion.title ?? loadingTitle ?? "Preparing your fix"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close review panel"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5">
              {loading || !preview ? (
                <div className="space-y-4" aria-live="polite">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
                    AI is rewriting this section of your resume…
                  </p>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-4 animate-pulse rounded-full bg-muted"
                      style={{ width: `${92 - i * 9}%` }}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-extrabold text-danger">
                      <Flame className="size-3" aria-hidden="true" />
                      {preview.priority} priority
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-extrabold text-success-foreground">
                      <TrendingUp className="size-3" aria-hidden="true" />
                      Est. +{preview.gain}% ATS
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-extrabold text-primary">
                      <Clock className="size-3" aria-hidden="true" />
                      Applies in seconds
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-extrabold text-muted-foreground">
                      <Gauge className="size-3" aria-hidden="true" />
                      {stats.added} added · {stats.removed} replaced
                    </span>
                  </div>

                  <div className="rounded-2xl bg-primary-soft p-4 text-sm leading-relaxed text-foreground">
                    <span className="font-bold">Why this matters: </span>
                    {preview.suggestion.why}
                  </div>

                  <section>
                    <h3 className="mb-2 text-sm font-bold text-foreground">
                      Changes to your resume
                    </h3>
                    <div className="overflow-hidden rounded-2xl border border-border bg-background/70">
                      <div className="max-h-[38vh] overflow-y-auto p-3 font-mono text-[11.5px] leading-relaxed">
                        {rows.map((row, idx) =>
                          row.type === "gap" ? (
                            <p
                              key={`gap-${idx}`}
                              className="my-1.5 select-none border-y border-dashed border-border py-1 text-center text-[10px] font-sans font-semibold text-muted-foreground"
                            >
                              {row.count} unchanged lines
                            </p>
                          ) : (
                            <p
                              key={`${row.type}-${idx}`}
                              className={
                                row.type === "add"
                                  ? "rounded bg-success-soft px-2 py-0.5 text-success-foreground"
                                  : row.type === "remove"
                                    ? "rounded bg-danger-soft px-2 py-0.5 text-danger line-through decoration-danger/40"
                                    : "px-2 py-0.5 text-muted-foreground"
                              }
                            >
                              <span className="mr-2 opacity-50" aria-hidden="true">
                                {row.type === "add" ? "+" : row.type === "remove" ? "−" : " "}
                              </span>
                              {row.text || "\u00A0"}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  </section>

                  {preview.improvements.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-sm font-bold text-foreground">What the AI changed</h3>
                      <ul className="space-y-2">
                        {preview.improvements.map((imp, i) => (
                          <li
                            key={`${imp.area}-${i}`}
                            className="rounded-xl border border-border bg-background/60 p-3 text-sm"
                          >
                            <span className="font-semibold text-foreground">{imp.area}: </span>
                            <span className="text-muted-foreground">{imp.change}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}
            </div>

            <footer className="space-y-3 border-t border-border bg-background/70 p-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={onApply}
                  disabled={!preview || applying}
                  className="ripple inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                >
                  {applying ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Wand2 className="size-4" aria-hidden="true" />
                  )}
                  {applying ? "Applying & re-scoring…" : "Apply this change"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={applying}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                >
                  <SkipForward className="size-4" aria-hidden="true" />
                  Skip
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={onUndo}
                  disabled={!canUndo || applying}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  <Undo2 className="size-3.5" aria-hidden="true" />
                  Undo last change
                </button>
                <button
                  type="button"
                  onClick={onApplyAll}
                  disabled={applying || remaining === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2.5 text-xs font-bold text-accent-foreground transition-transform hover:scale-[1.03] disabled:opacity-50"
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Apply all {remaining} fixes
                </button>
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
