import { useEffect, useRef, useState } from "react";
import { Lightbulb, TrendingUp } from "lucide-react";
import type { AtsReport } from "@/lib/ats";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function useAnimatedNumber(value: number) {
  const [shown, setShown] = useState(value);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = shown;
    const delta = value - start;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 600);
      setShown(Math.round(start + delta * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return shown;
}

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
    <Progress value={value} className="mt-1 h-1.5" />
  </div>
);

export function AtsPanel({ report }: { report: AtsReport }) {
  const score = useAnimatedNumber(report.overall);
  const tone =
    score >= 85 ? "text-success" : score >= 70 ? "text-brass" : "text-destructive";

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-soft">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <div className="relative grid size-20 shrink-0 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                className={tone}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 264} 264`}
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className={cn("text-xl font-semibold tabular-nums", tone)}>{score}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-lg leading-tight">ATS score</h3>
            <p className="text-xs text-muted-foreground">
              {report.words} words · {report.readingTime} · {report.completion}% complete
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-success">
              <TrendingUp className="size-3" /> Live scoring as you type
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <Metric label="Keyword match" value={report.keywords} />
          <Metric label="Formatting" value={report.formatting} />
          <Metric label="Content quality" value={report.content} />
          <Metric label="Recruiter readability" value={report.readability} />
        </div>
      </div>

      {report.missing.length > 0 && (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
          <h4 className="text-sm font-semibold text-destructive">Missing sections</h4>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {report.missing.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="size-4 text-brass" /> Recruiter tips
        </h4>
        <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
          {report.suggestions.map((s) => (
            <li key={s} className="rounded-lg bg-muted/60 p-2.5">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
