import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Linkedin,
  Mail,
  Sparkles,
  Target,
  Rocket,
  Heart,
  Shield,
  Users,
  Zap,
  TrendingUp,
  BookOpen,
  Twitter,
  MapPin,
  Phone,
} from "lucide-react";
import { CareerSyncLogo } from "@/components/careersync/logo";

export const Route = createFileRoute("/careersync/about")({
  head: () => ({
    meta: [
      { title: "About CareerSync — Meet the Founders | BechnaSeekho" },
      {
        name: "description",
        content:
          "Meet the Founder and Co-Founder behind CareerSync by BechnaSeekho — the career platform helping India get hired faster.",
      },
      { property: "og:title", content: "About CareerSync — Meet the Founders" },
      { property: "og:description", content: "The vision and the people behind CareerSync." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const LEADERS = [
  {
    name: "Shyam Tiwari",
    role: "Founder",
    initials: "ST",
    color: "from-blue-600 to-cyan-500",
    story:
      "Shyam has spent years working at the intersection of hiring, candidate outcomes, and digital product execution. After repeatedly seeing strong candidates missed by traditional screening processes, he focused on building a platform that makes hiring more transparent and skill-first.",
    why: "He founded CareerSync to improve hiring quality by combining practical workflows with AI-assisted evaluation.",
    vision: "Every capable candidate in India, matched to the right role in under a week.",
    mission: "Give job seekers the same tooling top-tier recruiters have — resume intelligence, interview prep, and real-time market signal — for free.",
    quote: "Hiring is broken because signal gets lost. CareerSync rebuilds that signal, one candidate at a time.",
    tags: ["Product", "Growth", "AI Strategy"],
  },
  {
    name: "Sandeep Kumar",
    role: "Co-Founder",
    initials: "K",
    color: "from-cyan-500 to-emerald-500",
    story:
      "Sandeep Kumar brings execution-focused product and operations experience, helping translate CareerSync's vision into scalable day-to-day systems for candidates and hiring teams.",
    why: "He joined to help build a more practical and outcomes-driven hiring ecosystem for Indian talent.",
    vision: "A hiring stack where the best candidate wins, not the loudest resume.",
    mission: "Own the platform, the matching quality, and the reliability — so hundreds of thousands of monthly users can trust CareerSync with their careers.",
    quote: "We optimise for outcomes, not vanity metrics. If a candidate gets hired this week, we did our job.",
    tags: ["Engineering", "ML", "Platform"],
  },
];

const VALUES = [
  { icon: Sparkles, title: "Innovation", desc: "Thoughtfully applied workflows.", color: "from-blue-500 to-cyan-500" },
  { icon: Shield, title: "Trust", desc: "Your data is yours. Always private, never sold.", color: "from-emerald-500 to-teal-500" },
  { icon: Heart, title: "Transparency", desc: "Clear salaries, clear timelines, clear feedback.", color: "from-rose-500 to-pink-500" },
  { icon: TrendingUp, title: "Growth", desc: "We ship weekly and measure ourselves on hires.", color: "from-orange-500 to-amber-500" },
  { icon: Users, title: "Community", desc: "Built with candidates and recruiters, not for them.", color: "from-violet-500 to-purple-500" },
  { icon: BookOpen, title: "Learning", desc: "Every rejection becomes a signal to improve.", color: "from-indigo-500 to-blue-500" },
];

const FOOTER_SOCIAL_LINKS = [
  { Icon: Linkedin, href: "https://www.linkedin.com/groups/18017028/", label: "LinkedIn" },
  { Icon: Twitter, href: "https://x.com/bechnaseekho", label: "X" },
  { Icon: Mail, href: "mailto:hello@bechnaseekho.com", label: "Email" },
];

const TIMELINE = [
  {
    year: "2023",
    title: "The idea",
    desc: "Shyam writes the first spec after deep recruiter and candidate interviews across major Indian hiring hubs.",
    icon: Sparkles,
    label: "Research",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    year: "2024 · Q1",
    title: "First prototype",
    desc: "Sandeep Kumar joins as co-founder. The first matching engine ships with 200 alpha candidates.",
    icon: Rocket,
    label: "Prototype",
    accent: "from-cyan-500 to-emerald-500",
  },
  {
    year: "2024 · Q3",
    title: "BechnaSeekho launches",
    desc: "Public launch of the marketplace with resume builder and job board.",
    icon: Zap,
    label: "Launch",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    year: "2025 · Q1",
    title: "CareerSync goes live",
    desc: "Resume scoring, mock interviews and 1-click apply ship together.",
    icon: Target,
    label: "Product",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    year: "2025 · Q4",
    title: "50,000+ users",
    desc: "Verified jobs from 500+ companies. First real-time interview coach launches.",
    icon: TrendingUp,
    label: "Growth",
    accent: "from-orange-500 to-amber-500",
  },
  {
    year: "2026 →",
    title: "What's next",
    desc: "Full career OS — learning paths, salary intelligence, and an AI career coach that never sleeps.",
    icon: Users,
    label: "Roadmap",
    accent: "from-emerald-500 to-teal-500",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <TopBar />

      <Hero />

      {/* Founders */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <SectionEyebrow>The team</SectionEyebrow>
        <SectionTitle>
          Meet the founders behind{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">CareerSync</span>.
        </SectionTitle>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          A small team obsessed with one question — how do we help great candidates get hired
          without the noise, the ghosting and the guesswork?
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {LEADERS.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-blue-100/60 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.25)] hover:shadow-[0_28px_70px_-24px_rgba(37,99,235,0.35)] transition-shadow"
            >
              <div className={`pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br ${p.color} opacity-10 blur-2xl`} />

              <div className="flex items-center gap-4">
                <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${p.color} text-xl font-black text-white shadow-lg`}>
                  {p.initials}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#0F172A]">{p.name}</h2>
                  <div className="mt-0.5 text-sm font-semibold text-blue-600">{p.role}</div>
                </div>
              </div>

              <p className="mt-5 text-[15px] leading-relaxed text-gray-600">{p.story}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MiniBlock label="Why CareerSync" text={p.why} />
                <MiniBlock label="Vision" text={p.vision} />
              </div>
              <MiniBlock label="Mission" text={p.mission} className="mt-3" />

              <blockquote className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm italic text-slate-700 ring-1 ring-slate-100">
                "{p.quote}"
              </blockquote>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-600 ring-1 ring-blue-100">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2">
                <a href="https://www.linkedin.com/groups/18017028/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:text-blue-600 hover:ring-blue-200 transition">
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
                <a href="mailto:hello@bechnaseekho.com" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:text-blue-600 hover:ring-blue-200 transition">
                  <Mail className="h-3.5 w-3.5" /> Reach out
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <SectionEyebrow left>Our mission</SectionEyebrow>
            <h2 className="mt-3 text-4xl font-black text-[#0F172A]" style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}>
              Make hiring feel <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">human</span> again.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Job seekers spend weeks tuning resumes for bots. Recruiters drown in unfit
              applications. CareerSync exists because both sides deserve better.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Cut resume-to-interview time from weeks to days.",
                "Give every candidate real feedback — not silence.",
                "Show honest salary and role expectations upfront.",
                "Use AI to save time, never to replace judgement.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] text-slate-700">
                  <div className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Zap className="h-3 w-3" />
                  </div>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-blue-100 via-cyan-100 to-emerald-100 opacity-70 blur-2xl" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "50K+", v: "Candidates", c: "from-blue-500 to-cyan-500" },
                { k: "500+", v: "Companies", c: "from-emerald-500 to-teal-500" },
                { k: "3.2×", v: "Faster hires", c: "from-violet-500 to-purple-500" },
                { k: "92%", v: "Match accuracy", c: "from-orange-500 to-amber-500" },
              ].map((s) => (
                <div key={s.v} className="relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.2)]">
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${s.c} opacity-10 blur-xl`} />
                  <div className={`bg-gradient-to-r ${s.c} bg-clip-text text-4xl font-black text-transparent`}>{s.k}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-500">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.35),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(6,182,212,0.3),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
          <SectionEyebrow tone="dark">Our vision</SectionEyebrow>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black text-white sm:text-5xl" style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}>
            A career OS that grows with you —{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">for life.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            CareerSync is just the beginning. We're building the operating system for careers in India — resume, interview, learning, salary intelligence, and coaching, all in one place.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Resume", desc: "Rewrites your resume for every role.", icon: Sparkles },
              { title: "Interview Coach", desc: "Real-time feedback during mocks.", icon: Target },
              { title: "Learning Paths", desc: "Skill up for the role you want next.", icon: BookOpen },
              { title: "Career Growth", desc: "Salary and role forecasts, honest.", icon: TrendingUp },
            ].map(({ title, desc, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl bg-white/5 p-6 text-left backdrop-blur ring-1 ring-white/10 hover:bg-white/10 transition"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-base font-bold text-white">{title}</div>
                <div className="mt-1 text-sm text-slate-300">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionEyebrow>Our values</SectionEyebrow>
        <SectionTitle>What we won't compromise on.</SectionTitle>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-slate-100 shadow-[0_14px_36px_-22px_rgba(15,23,42,0.2)] transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(37,99,235,0.3)]"
            >
              <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
              <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-5 text-lg font-black text-[#0F172A]">{title}</div>
              <div className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
        <SectionEyebrow>Our journey</SectionEyebrow>
        <SectionTitle>From an idea to a platform.</SectionTitle>

        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-slate-500 sm:text-base">
          The CareerSync story has been built in milestones: real recruiter research, practical product shipping, and a steady focus on outcomes that help candidates get hired faster.
        </p>

        <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-blue-100/70 bg-white/90 px-4 py-8 shadow-[0_24px_80px_-40px_rgba(37,99,235,0.28)] backdrop-blur sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_65%)]" />
          <div className="pointer-events-none absolute -right-12 top-8 h-28 w-28 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 bottom-8 h-28 w-28 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50/90 px-4 py-3 ring-1 ring-slate-200/80">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">Founded on research</div>
              <div className="mt-1 text-sm font-semibold text-slate-700">Built from direct recruiter and candidate interviews.</div>
            </div>
            <div className="rounded-2xl bg-slate-50/90 px-4 py-3 ring-1 ring-slate-200/80">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">Shipped in public</div>
              <div className="mt-1 text-sm font-semibold text-slate-700">Each release tightened product quality and hiring signal.</div>
            </div>
            <div className="rounded-2xl bg-slate-50/90 px-4 py-3 ring-1 ring-slate-200/80">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">Outcome obsessed</div>
              <div className="mt-1 text-sm font-semibold text-slate-700">The roadmap stays anchored to candidate success, not vanity metrics.</div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-blue-500 via-cyan-400 to-emerald-500 sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-6 sm:space-y-7">
              {TIMELINE.map((t, i) => {
                const left = i % 2 === 0;
                const Icon = t.icon;
                return (
                  <motion.div
                    key={t.year}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="relative pl-14 pr-1 sm:grid sm:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] sm:items-start sm:gap-0 sm:pl-0 sm:pr-0"
                  >
                    <div className="absolute left-0 top-5 grid h-10 w-10 place-items-center rounded-full bg-white ring-4 ring-blue-500/90 shadow-[0_10px_28px_-14px_rgba(37,99,235,0.55)] sm:left-1/2 sm:-translate-x-1/2">
                      <div className={`grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br ${t.accent} text-white`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className={`min-w-0 ${left ? "sm:col-start-1 sm:pr-10 sm:text-right" : "sm:col-start-3 sm:pl-10"}`}>
                      <div className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.18)] transition-shadow hover:shadow-[0_24px_54px_-28px_rgba(37,99,235,0.28)]`}>
                        <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.accent}`} />
                        <div className={`pointer-events-none absolute ${left ? "-left-10" : "-right-10"} top-0 h-24 w-24 rounded-full bg-gradient-to-br ${t.accent} opacity-10 blur-2xl`} />
                        <div className={`flex flex-wrap items-center gap-2 ${left ? "sm:justify-end" : ""}`}>
                          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-600 ring-1 ring-blue-100">
                            {t.year}
                          </span>
                          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 ring-1 ring-slate-200">
                            {t.label}
                          </span>
                        </div>
                        <div className="mt-3 text-xl font-black text-[#0F172A] sm:text-[1.7rem]">{t.title}</div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-[15px]">{t.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* -------------------- small helpers -------------------- */

function SectionEyebrow({ children, tone = "light", left = false }: { children: React.ReactNode; tone?: "light" | "dark"; left?: boolean }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.25em] ${tone === "dark" ? "text-cyan-300" : "text-blue-600"} ${left ? "" : "text-center"}`}>
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mx-auto mt-3 max-w-3xl text-center text-4xl font-black tracking-tight text-[#0F172A] sm:text-5xl"
      style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
    >
      {children}
    </h2>
  );
}

function MiniBlock({ label, text, className = "" }: { label: string; text: string; className?: string }) {
  return (
    <div className={`rounded-xl bg-blue-50/50 p-3 ring-1 ring-blue-100/70 ${className}`}>
      <div className="text-[10px] font-black uppercase tracking-wider text-blue-600">{label}</div>
      <div className="mt-1 text-[13px] leading-snug text-slate-700">{text}</div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(6,182,212,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute -left-10 top-40 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-600 ring-1 ring-blue-100 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" /> About CareerSync
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-5 text-5xl font-black tracking-tight text-[#0F172A] sm:text-6xl"
          style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
        >
          We're building the{" "}
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">career OS</span>{" "}
          India deserves.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-gray-600"
        >
          CareerSync is the career platform from BechnaSeekho. We help candidates get hired
          faster and help companies find the right people — without the noise.
        </motion.p>
      </div>
    </section>
  );
}

function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/careersync" className="inline-flex items-center gap-2">
          <CareerSyncLogo variant="icon" size={32} />
          <span className="text-sm font-black text-slate-900">CareerSync</span>
        </Link>
        <div className="hidden text-sm font-bold text-slate-900 sm:block">About</div>
        <Link
          to="/careersync"
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <CareerSyncLogo variant="icon" size={32} />
            <span className="text-lg font-black text-white">CareerSync</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            The career platform from BechnaSeekho — hiring made human again.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {FOOTER_SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Company" links={[["About", "/careersync/about"], ["Blogs", "/careersync/blogs"], ["Careers", "/careersync/jobs"]]} />
        <FooterCol title="Product" links={[["CareerSync", "/careersync"], ["Jobs", "/careersync/jobs"], ["Resume Templates", "/resume-templates"], ["Mock Interview", "/careersync/journey"]]} />

        <div>
          <div className="text-sm font-black uppercase tracking-wider text-white">Contact</div>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /> hello@bechnaseekho.com</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /> +91 · Coming soon</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /> Bengaluru, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} BechnaSeekho. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
            <Link to="/contact" className="hover:text-white transition">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-black uppercase tracking-wider text-white">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-slate-400">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="hover:text-white transition">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
