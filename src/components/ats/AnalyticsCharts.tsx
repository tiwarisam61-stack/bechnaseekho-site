import { motion } from "motion/react";
import { Radar, BarChart3 } from "lucide-react";

import type { AtsAnalysis } from "@/lib/ats.schema";

/** Real analytics derived from the AI analysis — no fake data. */

const RADAR_LABELS = [
  { key: "Recruiter Readability", short: "Readability" },
  { key: "Soft Skills", short: "Communication" },
  { key: "Technical Skills", short: "Technical" },
  { key: "Resume Formatting", short: "Formatting" },
  { key: "ATS Compatibility", short: "ATS" },
  { key: "Keyword Match", short: "Keywords" },
];

function scoreFor(analysis: AtsAnalysis, label: string) {
  const m = analysis.metrics.find((x) => x.label.toLowerCase() === label.toLowerCase());
  return Math.max(0, Math.min(100, Math.round(m?.score ?? analysis.overallScore)));
}

export function AnalyticsCharts({ analysis }: { analysis: AtsAnalysis }) {
  const size = 260;
  const c = size / 2;
  const r = 96;

  const points = RADAR_LABELS.map((l, i) => {
    const angle = (Math.PI * 2 * i) / RADAR_LABELS.length - Math.PI / 2;
    const value = scoreFor(analysis, l.key) / 100;
    return {
      ...l,
      value: Math.round(value * 100),
      x: c + Math.cos(angle) * r * value,
      y: c + Math.sin(angle) * r * value,
      lx: c + Math.cos(angle) * (r + 22),
      ly: c + Math.sin(angle) * (r + 22),
      ax: c + Math.cos(angle) * r,
      ay: c + Math.sin(angle) * r,
    };
  });

  const polygon = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const bars = [
    { label: "Matched keywords", value: analysis.profile.keywords.length, tone: "bg-gradient-primary" },
    { label: "Technical skills found", value: analysis.profile.technicalSkills.length, tone: "bg-primary/70" },
    { label: "Missing keywords", value: analysis.recruiter.missingKeywords.length, tone: "bg-gradient-accent" },
    { label: "Formatting issues", value: analysis.recruiter.formattingIssues.length, tone: "bg-danger/70" },
  ];
  const max = Math.max(1, ...bars.map((b) => b.value));

  return (
    <section aria-labelledby="charts-heading" className="grid gap-6 lg:grid-cols-2">
      <h2 id="charts-heading" className="sr-only">
        Resume analytics
      </h2>

      <div className="surface-card p-6 sm:p-8">
        <p className="flex items-center gap-2 text-sm font-extrabold text-foreground">
          <Radar className="size-4 text-primary" aria-hidden="true" />
          Strength profile
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Six dimensions recruiters and parsers weigh most.
        </p>
        <div className="mt-4 flex justify-center">
          <svg width={size} height={size} viewBox={`-30 -14 ${size + 60} ${size + 28}`} role="img" aria-label="Radar chart of resume strengths">
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <polygon
                key={f}
                points={RADAR_LABELS.map((_, i) => {
                  const a = (Math.PI * 2 * i) / RADAR_LABELS.length - Math.PI / 2;
                  return `${(c + Math.cos(a) * r * f).toFixed(1)},${(c + Math.sin(a) * r * f).toFixed(1)}`;
                }).join(" ")}
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}
            {points.map((p) => (
              <line key={p.key} x1={c} y1={c} x2={p.ax} y2={p.ay} stroke="var(--border)" strokeWidth="1" />
            ))}
            <motion.polygon
              points={polygon}
              fill="oklch(0.574 0.195 257.9 / 0.18)"
              stroke="var(--primary)"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${c}px ${c}px` }}
            />
            {points.map((p) => (
              <circle key={`d-${p.key}`} cx={p.x} cy={p.y} r="3.5" fill="var(--primary)" />
            ))}
            {points.map((p) => (
              <text
                key={`t-${p.key}`}
                x={p.lx}
                y={p.ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight="700"
                fill="var(--muted-foreground)"
              >
                {p.short} {p.value}
              </text>
            ))}
          </svg>
        </div>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <p className="flex items-center gap-2 text-sm font-extrabold text-foreground">
          <BarChart3 className="size-4 text-primary" aria-hidden="true" />
          Keyword &amp; formatting breakdown
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Counted from your actual resume text.
        </p>
        <ul className="mt-6 space-y-5">
          {bars.map((b, i) => (
            <li key={b.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-foreground">{b.label}</span>
                <span className="text-sm font-extrabold text-foreground">{b.value}</span>
              </div>
              <span className="mt-2 block h-2.5 overflow-hidden rounded-full bg-muted">
                <motion.span
                  className={`block h-full rounded-full ${b.tone}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(4, (b.value / max) * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                />
              </span>
            </li>
          ))}
        </ul>
        {analysis.recruiter.missingKeywords.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Add these keywords
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {analysis.recruiter.missingKeywords.slice(0, 12).map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent-foreground"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
