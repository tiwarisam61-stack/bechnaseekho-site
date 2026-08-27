import { motion, useReducedMotion } from "motion/react";
import { BadgeCheck, Braces, Gauge, LineChart, ShieldCheck, Sparkles } from "lucide-react";

import { CountUp } from "./CountUp";

/**
 * Floating 3D "live report" dashboard shown before upload — a real, readable
 * sample of exactly what the user receives. GPU-only transforms, no images.
 */

const TILES = [
  { label: "Keyword match", value: 85, display: "85%", icon: Braces, bar: 85 },
  { label: "Formatting", value: 96, display: "Perfect", icon: LineChart, bar: 96 },
  { label: "Skills", value: 90, display: "Strong", icon: Sparkles, bar: 90 },
  { label: "Recruiter readability", value: 94, display: "Excellent", icon: BadgeCheck, bar: 94 },
];

const RADIUS = 52;

export function HeroDashboard() {

  const reduce = useReducedMotion();
  const ring = 2 * Math.PI * RADIUS;
  const score = 92;

  return (
    <div className="scene-3d relative mx-auto w-full max-w-[560px]">
      <div className="card-3d relative">
        <motion.div
          initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="surface-glass sheet-3d relative overflow-hidden p-5 sm:p-7"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-primary text-[11px] font-extrabold text-primary-foreground shadow-[var(--shadow-glow)]">
              CV
            </span>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-foreground">Resume report</p>
              <p className="text-[11px] font-medium text-muted-foreground">
                Sample preview · this is what you get
              </p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[10px] font-bold text-success-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-success" />
              live
            </span>
          </div>

          <div className="mt-6 flex items-center gap-5">
            <div className="relative shrink-0">
              <svg width="124" height="124" viewBox="0 0 124 124" aria-hidden="true">
                <circle cx="62" cy="62" r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth="11" />
                <motion.circle
                  cx="62"
                  cy="62"
                  r={RADIUS}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={ring}
                  transform="rotate(-90 62 62)"
                  initial={{ strokeDashoffset: ring }}
                  animate={{ strokeDashoffset: ring - (ring * score) / 100 }}
                  transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  <CountUp to={score} duration={1.6} suffix="%" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  ATS score
                </span>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-extrabold text-primary">
                  <Gauge className="size-3" aria-hidden="true" />
                  Grade A+
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-extrabold text-accent-foreground">
                  3 missing keywords
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Passes automated screening at most large employers. Three role keywords are missing —
                each fix is one click away.
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.span
                    key={i}
                    className="h-6 flex-1 rounded-md bg-gradient-primary"
                    initial={{ scaleY: 0.15, opacity: 0.35, originY: 1 }}
                    animate={{ scaleY: [0.25, 0.55, 0.4, 0.85, 0.65, 1][i], opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "bottom" }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {TILES.map(({ label, display, icon: Icon, bar }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                className="rounded-2xl bg-card/85 p-3"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  <Icon className="size-3 text-primary" aria-hidden="true" />
                  {label}
                </span>
                <span className="mt-1 block text-sm font-extrabold text-foreground">{display}</span>
                <span className="mt-2 block h-1 overflow-hidden rounded-full bg-muted">
                  <motion.span
                    className="block h-full rounded-full bg-gradient-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${bar}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                  />
                </span>
              </motion.div>
            ))}
          </div>

        </motion.div>


        <div className="chip-3d chip-3d-a surface-glass flex items-center gap-2 px-3 py-2">
          <ShieldCheck className="size-4 text-success" aria-hidden="true" />
          <span className="leading-tight">
            <span className="block text-[11px] font-extrabold text-foreground">Nothing stored</span>
            <span className="block text-[9px] font-semibold text-muted-foreground">
              Deleted after your scan
            </span>
          </span>
        </div>

        <div className="chip-3d chip-3d-b surface-glass flex items-center gap-2 px-3 py-2">
          <span className="text-lg font-extrabold text-primary">
            <CountUp to={8} duration={1.2} suffix="s" />
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] font-extrabold text-foreground">Average scan</span>
            <span className="block text-[9px] font-semibold text-muted-foreground">20 checks run</span>
          </span>
        </div>
      </div>
    </div>
  );
}
