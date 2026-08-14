import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import type { AtsMetric } from "@/lib/ats.schema";

const STATUS_STYLES: Record<AtsMetric["status"], { chip: string; bar: string }> = {
  excellent: { chip: "bg-success-soft text-success-foreground", bar: "bg-success" },
  good: { chip: "bg-primary-soft text-primary", bar: "bg-primary" },
  fair: { chip: "bg-warning-soft text-warning-foreground", bar: "bg-warning" },
  poor: { chip: "bg-danger-soft text-danger", bar: "bg-danger" },
};

function MetricCard({ metric, index }: { metric: AtsMetric; index: number }) {
  const [width, setWidth] = useState(0);
  const styles = STATUS_STYLES[metric.status] ?? STATUS_STYLES.good;

  useEffect(() => {
    const id = window.setTimeout(() => setWidth(Math.min(100, Math.max(0, metric.score))), 100 + index * 45);
    return () => window.clearTimeout(id);
  }, [metric.score, index]);

  return (
    <article className="surface-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-foreground">{metric.label}</h3>
        <span className="text-lg font-extrabold text-foreground">{Math.round(metric.score)}</span>
      </header>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={Math.round(metric.score)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${metric.label} score`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${styles.bar}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span
        className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold capitalize ${styles.chip}`}
      >
        {metric.status}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{metric.explanation}</p>
      {metric.suggestion && (
        <p className="mt-3 flex gap-2 rounded-xl bg-accent-soft p-3 text-sm text-accent-foreground">
          <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{metric.suggestion}</span>
        </p>
      )}
    </article>
  );
}

export function MetricsReport({ metrics }: { metrics: AtsMetric[] }) {
  return (
    <section aria-labelledby="report-heading">
      <header className="mb-5">
        <h2 id="report-heading" className="text-xl font-bold text-foreground sm:text-2xl">
          Complete ATS report
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every dimension recruiters and ATS software check — with a plain-English explanation and a
          fix for each one.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m, i) => (
          <MetricCard key={`${m.label}-${i}`} metric={m} index={i} />
        ))}
      </div>
    </section>
  );
}
