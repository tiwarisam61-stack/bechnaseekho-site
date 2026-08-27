import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, ArrowUpRight, Loader2 } from "lucide-react";
import { scoreRating } from "@/lib/ats.schema";

type Props = {
  score: number;
  delta: number;
  busy?: boolean;
  onDownload: () => void;
};

/** Desktop-only sticky summary so the ATS score stays visible while scrolling. */
export function StickyScore({ score, delta, busy, onDownload }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rating = scoreRating(score);
  const tone =
    score >= 85 ? "text-success" : score >= 70 ? "text-warning-foreground" : "text-danger";

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          aria-label="ATS score summary"
          className="fixed bottom-6 right-6 z-40 hidden items-center gap-4 rounded-2xl border border-border bg-card/90 p-3 pr-4 shadow-[var(--shadow-soft)] backdrop-blur-xl lg:flex"
        >
          <div className="text-center">
            <p className={`text-2xl font-extrabold leading-none ${tone}`}>{Math.round(score)}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              ATS score
            </p>
          </div>
          <div className="border-l border-border pl-4">
            <p className="text-xs font-bold text-foreground">{rating.label}</p>
            {delta > 0 ? (
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-success">
                <ArrowUpRight className="size-3" aria-hidden="true" />+{Math.round(delta)} since
                start
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                Apply fixes to raise it
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onDownload}
            disabled={busy}
            className="ripple inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="size-3.5" aria-hidden="true" />
            )}
            Report
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
