import { motion } from "framer-motion";
import { type ComponentType } from "react";
import {
  GraduationCap,
  Users2,
  BadgeCheck,
  Radio,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Clock3,
  BarChart3,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MagneticButton } from "../magnetic-button";

const cohortAvatars = [
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=32",
  "https://i.pravatar.cc/80?img=15",
  "https://i.pravatar.cc/80?img=47",
];

const mentorAvatar = "https://i.pravatar.cc/96?img=12";

const features = [
  { icon: GraduationCap, t: "Courses", d: "Sales, business, AI & career skills." },
  { icon: Users2, t: "Mentorship", d: "1:1 sessions with industry pros." },
  { icon: BadgeCheck, t: "Certifications", d: "Recognised, shareable credentials." },
  { icon: Radio, t: "Live workshops", d: "Hands-on cohorts every week." },
];

export function LearningShowcase() {
  return (
    <section id="learning" className="relative overflow-hidden py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.985_0.02_270)] to-background" />
        <div className="absolute left-1/2 top-8 h-64 w-[44rem] -translate-x-1/2 rounded-full bg-brand/8 blur-3xl" />
        <div className="absolute -left-16 bottom-8 h-56 w-56 rounded-full bg-brand-2/10 blur-3xl" />
        <div className="absolute -right-16 top-16 h-56 w-56 rounded-full bg-cyan/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <LearningPreview />
          <div className="order-first lg:order-last">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-ink-soft ring-1 ring-line backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              BechnaSeekho Learning
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Learn to sell.<br />
              <span className="text-gradient-brand">Grow your business.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base text-ink-soft">
              A learning platform designed for sales professionals, founders, and career switchers -
              powered by AI tutors and a growing community.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <InfoPill icon={Clock3} text="Live + Self paced" />
              <InfoPill icon={BarChart3} text="Practical projects" />
              <InfoPill icon={BadgeCheck} text="Certificate tracks" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <motion.div
                  key={f.t}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                  className="group rounded-2xl bg-white/80 p-4 ring-1 ring-line backdrop-blur transition-all duration-300 hover:shadow-[0_16px_32px_-18px_oklch(0.55_0.22_264/0.42)] hover:ring-brand/35"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand/12 to-brand-2/14 text-brand-2 transition-transform duration-300 group-hover:scale-105">
                    <f.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="mt-3 font-display text-[15px] font-semibold text-ink">{f.t}</p>
                  <p className="text-xs text-ink-soft">{f.d}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/careersync-academy"
                className="btn-primary"
              >
                Browse Courses <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LearningPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="group relative overflow-hidden rounded-3xl bg-white/78 p-5 ring-1 ring-line/80 shadow-[0_34px_70px_-34px_oklch(0.55_0.22_264/0.35)] backdrop-blur-xl"
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/15 blur-3xl" />
      <span className="pointer-events-none absolute -left-8 bottom-6 h-32 w-32 rounded-full bg-brand-2/12 blur-3xl" />

      {/* Featured cohort */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-brand-2 to-[#a855f7] p-6 text-white">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
        <p className="text-[10px] font-medium uppercase tracking-widest opacity-80">Featured cohort</p>
        <p className="mt-1 font-display text-xl font-bold">Modern B2B Sales - Weekend cohort</p>
        <p className="mt-1 text-xs opacity-85">6 weeks - Live + AI mentor - Certificate</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {cohortAvatars.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Cohort member ${i + 1}`}
                className="h-7 w-7 rounded-full border-2 border-white object-cover"
                loading="lazy"
              />
            ))}
            <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-white/20 text-[10px] font-semibold">
              +82
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur transition-all duration-300 hover:bg-white/30">
            <PlayCircle className="h-4 w-4" /> Preview
          </button>
        </div>
      </div>

      {/* Course list */}
      <div className="mt-4 space-y-2.5">
        {[
          { t: "Prospecting & lead qualification", d: "12 lessons · 1h 24m", p: 78 },
          { t: "Objection handling with AI role-play", d: "9 lessons · 58m", p: 42 },
          { t: "Negotiation & closing playbooks", d: "14 lessons · 2h 10m", p: 0 },
        ].map((c) => (
          <div key={c.t} className="rounded-xl bg-white/90 p-3 ring-1 ring-line transition-all duration-300 hover:ring-brand/30">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink">{c.t}</p>
                <p className="truncate text-[10px] text-ink-soft">{c.d}</p>
              </div>
              <span className="ml-3 shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand font-numeric">
                {c.p}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2"
                style={{ width: `${c.p}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mentor */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line">
        <img
          src={mentorAvatar}
          alt="Mentor Sandeep Kumar"
          className="h-10 w-10 rounded-full border border-line object-cover"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-ink">Mentor · Sandeep Kumar</p>
          <p className="truncate text-[10px] text-ink-soft">Ex-Salesforce - 04+ years</p>
        </div>
        <button className="rounded-full bg-gradient-to-r from-brand to-brand-2 px-3 py-1.5 text-[10px] font-semibold text-white transition-all duration-300 hover:shadow-[0_10px_24px_-10px_oklch(0.55_0.22_264/0.7)]">
          Book 1:1
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatPill label="Learners" value="52K+" />
        <StatPill label="Tracks" value="40+" />
        <StatPill label="Completion" value="92%" />
      </div>
    </motion.div>
  );
}

function InfoPill({ icon: Icon, text }: { icon: ComponentType<{ className?: string }>; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-line backdrop-blur">
      <Icon className="h-3.5 w-3.5 text-brand" />
      {text}
    </span>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/90 px-3 py-2 text-center ring-1 ring-line">
      <p className="font-numeric text-sm font-extrabold text-ink">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
    </div>
  );
}
