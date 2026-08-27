import { CountUp } from "./CountUp";

const STATS = [
  { to: 99, suffix: "%", label: "ATS parse accuracy", note: "Benchmarked against real parsers" },
  { to: 250, suffix: "K+", label: "Resumes analyzed", note: "Students to senior hires" },
  { to: 500, suffix: "+", label: "Companies supported", note: "Screening rules modelled" },
  { to: 8, suffix: "s", label: "Average scan time", note: "20 checks, one upload" },
];

export function StatsBand() {
  return (
    <section aria-labelledby="stats-heading" className="mx-auto max-w-6xl">
      <h2 id="stats-heading" className="sr-only">
        CareerSync in numbers
      </h2>
      <div className="surface-glass grid gap-6 p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
        {STATS.map(({ to, suffix, label, note }) => (
          <div key={label} className="text-center lg:text-left">
            <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              <span className="text-gradient">
                <CountUp to={to} suffix={suffix} duration={1.6} />
              </span>
            </p>
            <p className="mt-2 text-sm font-bold text-foreground">{label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
