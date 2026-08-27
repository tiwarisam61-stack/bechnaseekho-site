import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Users,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Sparkles,
  Star,
  Zap,
  Shield,
  CheckCircle2,
} from "lucide-react";

const STATS = [
  {
    icon: Users,
    label: "Active Learners",
    value: 52000,
    suffix: "+",
    tint: "from-brand to-brand-2",
    bg: "from-brand/8 to-brand-2/8",
    ring: "ring-brand/15",
    glow: "oklch(0.55 0.22 264 / 0.3)",
    growth: "+24% this month",
    bar: 85,
  },
  {
    icon: Briefcase,
    label: "Verified Jobs",
    value: 1200,
    suffix: "+",
    tint: "from-emerald to-cyan",
    bg: "from-emerald/8 to-cyan/8",
    ring: "ring-emerald/15",
    glow: "oklch(0.72 0.19 150 / 0.3)",
    growth: "+38 new this week",
    bar: 68,
  },
  {
    icon: GraduationCap,
    label: "Courses Available",
    value: 200,
    suffix: "+",
    tint: "from-amber to-brand-2",
    bg: "from-amber/8 to-brand-2/8",
    ring: "ring-amber/15",
    glow: "oklch(0.79 0.16 70 / 0.3)",
    growth: "10 new courses added",
    bar: 55,
  },
  {
    icon: TrendingUp,
    label: "Placement Rate",
    value: 92,
    suffix: "%",
    tint: "from-brand-2 to-cyan",
    bg: "from-brand-2/8 to-cyan/8",
    ring: "ring-brand-2/15",
    glow: "oklch(0.53 0.26 293 / 0.3)",
    growth: "Industry-leading avg",
    bar: 92,
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: "ISO Certified" },
  { icon: Star, label: "4.9 / 5 Rating" },
  { icon: Zap, label: "Instant Access" },
  { icon: CheckCircle2, label: "Verified Placements" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString("en-IN"));

  useEffect(() => {
    if (!inView) return;
    const c = animate(count, to, { duration: 1.8, ease: "easeOut" });
    return c.stop;
  }, [inView, count, to]);

  return (
    <span ref={ref} className="font-numeric text-[2.65rem] font-black leading-none tracking-tight text-ink sm:text-[3.35rem]">
      <motion.span>{rounded}</motion.span>
      <span className="text-gradient-brand ml-0.5">{suffix}</span>
    </span>
  );
}

export function CounterStats() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Rich layered background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.985_0.012_255)] via-background to-[oklch(0.985_0.012_265)]" />
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
        <div className="absolute left-1/2 bottom-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-2/20 to-transparent" />
        <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/6 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/3 h-[350px] w-[350px] translate-x-1/2 translate-y-1/2 rounded-full bg-brand-2/6 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/5 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-gradient-to-r from-brand/8 to-brand-2/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Impact & Trust
          </span>

          <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-[3.25rem]">
            Results that{" "}
            <span className="relative inline-block">
              <span className="text-gradient-brand">speak for</span>
            </span>
            <br />
            <span className="text-gradient-brand">themselves</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Helping learners and recruiters succeed through practical, proven career solutions — trusted by thousands across India.
          </p>

          {/* Trust badges */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-soft shadow-sm ring-1 ring-line"
              >
                <Icon className="h-3.5 w-3.5 text-brand" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
              className={`group relative overflow-hidden rounded-[28px] bg-gradient-to-br ${s.bg} p-6 ring-1 ${s.ring} backdrop-blur-xl transition-all duration-300`}
              style={{
                boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 32px -16px rgba(0,0,0,0.08)",
              }}
            >
              {/* Glow on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: `0 0 0 1px ${s.glow}, 0 24px 60px -20px ${s.glow}` }}
              />

              {/* Decorative circle */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                style={{ background: `linear-gradient(135deg, var(--brand), var(--brand-2))` }}
              />

              {/* Icon */}
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${s.tint} shadow-lg`}>
                <s.icon className="h-5.5 w-5.5 h-5 w-5 text-white" />
              </div>

              {/* Number */}
              <Counter to={s.value} suffix={s.suffix} />

              {/* Label */}
              <p className="mt-2 text-[1.92rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2.05rem]">{s.label}</p>

              {/* Growth tag */}
              <p className="mt-2 text-base font-semibold text-ink-soft/95">{s.growth}</p>

              {/* Progress bar */}
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${s.tint}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.bar}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: i * 0.1 + 0.3, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
