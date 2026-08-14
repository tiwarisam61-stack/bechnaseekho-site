import { Link2, ArrowDown, ArrowUp } from "lucide-react";

/**
 * Connector layer. A wide 900x340 canvas centred on the hub so the curves
 * visually leave the recruiter card, arrive at the hub, and continue out to
 * the candidate card — matching the reference artwork.
 *
 * Timing: each lane runs a 4s loop; particles are offset by a quarter of the
 * loop so there is always exactly one packet travelling recruiter -> hub ->
 * candidate, and one returning candidate -> hub.
 */
const LOOP = 4;

const lanes = [
  // recruiter card -> hub (upper inbound)
  { d: "M 8 96 C 68 92, 128 126, 184 152", grad: "flowIn", marker: "arrowIn", dot: "var(--brand)", begin: "0s" },
  // hub -> candidate card (upper outbound)
  { d: "M 436 152 C 492 126, 552 92, 612 88", grad: "flowOut", marker: "arrowOut", dot: "var(--violet)", begin: "1s" },
  // candidate -> hub (lower return)
  { d: "M 612 252 C 552 248, 492 214, 436 188", grad: "flowBack", marker: "arrowIn", dot: "var(--brand)", begin: "2s" },
  // hub -> recruiter (lower return)
  { d: "M 184 188 C 128 214, 68 248, 8 252", grad: "flowBackLeft", marker: "arrowOut", dot: "var(--violet)", begin: "3s" },
] as const;

export function SyncHub() {
  return (
    <div className="relative flex h-full items-center justify-center py-6 lg:py-0">
      {/* wide connector canvas, sits behind both panels */}
      <svg
        viewBox="0 0 620 340"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[340px] w-[620px] -translate-x-1/2 -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="flowIn" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0" />
            <stop offset="40%" stopColor="var(--brand)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="flowOut" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--violet)" stopOpacity="1" />
            <stop offset="60%" stopColor="var(--violet)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="flowBack" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.15" />
            <stop offset="60%" stopColor="var(--brand)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="flowBackLeft" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--violet)" stopOpacity="1" />
            <stop offset="60%" stopColor="var(--violet)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.1" />
          </linearGradient>
          <marker id="arrowIn" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--brand)" />
          </marker>
          <marker id="arrowOut" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--violet)" />
          </marker>
        </defs>

        {/* orbit rings behind the hub */}
        <g className="orbit-spin" style={{ transformOrigin: "310px 170px" }}>
          <circle cx="310" cy="170" r="146" fill="none" stroke="var(--border)" strokeDasharray="4 12" />
        </g>
        <circle cx="310" cy="170" r="112" fill="none" stroke="var(--border)" strokeDasharray="3 10" />

        {lanes.map((lane, i) => (
          <g key={lane.d}>
            {/* faint rail */}
            <path d={lane.d} fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            {/* drawn-in gradient stroke with arrow head */}
            <path
              d={lane.d}
              fill="none"
              stroke={`url(#${lane.grad})`}
              strokeWidth="2.25"
              strokeLinecap="round"
              markerEnd={`url(#${lane.marker})`}
              className="draw-line"
              style={{ animationDelay: `${i * 0.22}s` }}
            />
            {/* travelling packet: glow + core, identical timing per lane */}
            <circle r="9" fill={lane.dot} opacity="0.18">
              <animateMotion dur={`${LOOP}s`} repeatCount="indefinite" path={lane.d} begin={lane.begin} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
            </circle>
            <circle r="4" fill={lane.dot}>
              <animateMotion dur={`${LOOP}s`} repeatCount="indefinite" path={lane.d} begin={lane.begin} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur={`${LOOP}s`} repeatCount="indefinite" begin={lane.begin} />
            </circle>
          </g>
        ))}
      </svg>

      {/* mobile vertical flow */}
      <div className="absolute inset-x-0 top-0 z-0 flex justify-center gap-10 lg:hidden" aria-hidden="true">
        <ArrowDown className="size-5 animate-bounce text-brand" />
        <ArrowUp className="size-5 animate-bounce text-violet" style={{ animationDelay: "0.6s" }} />
      </div>

      <div className="glass-card float-slow relative z-10 mt-8 w-full max-w-[220px] rounded-3xl px-6 py-9 text-center lg:mt-0">
        <div className="relative mx-auto size-16">
          <span className="pulse-ring absolute inset-0 rounded-2xl bg-brand/30" aria-hidden="true" />
          <div className="bg-gradient-brand relative grid size-16 place-items-center rounded-2xl text-primary-foreground shadow-[var(--shadow-glow)]">
            <Link2 className="size-8" />
          </div>
        </div>
        <p className="mt-5 text-xl font-extrabold tracking-tight">CareerSync</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Connecting Talent
          <br />
          with Opportunities
        </p>
        <div className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3 py-1.5 text-[11px] font-bold text-emerald">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald" />
          Live matching
        </div>
      </div>

      <span className="pointer-events-none absolute left-0 top-[16%] hidden -translate-x-[135%] whitespace-nowrap rounded-full bg-surface px-3 py-1 text-[11px] font-extrabold tracking-wide text-foreground shadow-[var(--shadow-soft)] xl:block">
        Recruiters
      </span>
      <span className="pointer-events-none absolute right-0 top-[16%] hidden translate-x-[135%] whitespace-nowrap rounded-full bg-surface px-3 py-1 text-[11px] font-extrabold tracking-wide text-foreground shadow-[var(--shadow-soft)] xl:block">
        Candidates
      </span>
    </div>
  );
}
