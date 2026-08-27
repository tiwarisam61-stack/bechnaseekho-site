import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Rocket,
  Heart,
  Shield,
  Users,
  BookOpen,
  Globe,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Building2,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { WhatsAppFab } from "@/components/landing/whatsapp-fab";
import { useCountUp } from "@/hooks/use-count-up";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — BechnaSeekho" },
      { name: "description", content: "The story, mission, vision and values behind BechnaSeekho — one AI ecosystem for careers, hiring and professional growth." },
      { property: "og:title", content: "About — BechnaSeekho" },
      { property: "og:description", content: "Built in India, for the world — an AI ecosystem for careers and growth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const STATS = [
  { k: 50, suffix: "K+", v: "Active users" },
  { k: 1000, suffix: "+", v: "Hiring partners" },
  { k: 200, suffix: "+", v: "Courses" },
  { k: 95, suffix: "%", v: "Success rate" },
];

const VALUES = [
  { icon: Heart, title: "Careers are personal", desc: "We build for humans, not funnels. Every recommendation is grounded in you.", color: "from-rose-500 to-pink-500" },
  { icon: Target, title: "Outcomes over vanity", desc: "We optimise for offers, promotions and real income growth — not clicks.", color: "from-blue-500 to-cyan-500" },
  { icon: Globe, title: "India-first, global-ready", desc: "Designed for the Indian job market, built to scale worldwide.", color: "from-cyan-500 to-teal-500" },
  { icon: Rocket, title: "Move fast, ship value", desc: "We ship every week. Feedback from users drives the roadmap.", color: "from-amber-500 to-orange-500" },
  { icon: Shield, title: "Trust", desc: "Your data is yours. Always private, never sold.", color: "from-emerald-500 to-teal-500" },
  { icon: Users, title: "Community", desc: "Built with candidates, learners and recruiters — not just for them.", color: "from-violet-500 to-purple-500" },
];

const FEATURES = [
  { icon: Briefcase, title: "For Candidates", desc: "Resume builder, verified jobs, mock interviews and career mentorship.", accent: "brand" },
  { icon: GraduationCap, title: "For Learners", desc: "Live cohorts, on-demand courses and certified programs via BechnaSeekho Academy.", accent: "brand-2" },
  { icon: Building2, title: "For Companies", desc: "Recruiter dashboards, candidate tracking and hiring analytics.", accent: "cyan" },
  { icon: MessageSquare, title: "1:1 Counselling", desc: "Talk to a real career coach whenever you're stuck.", accent: "amber" },
];

const ACCENT_BG: Record<string, string> = {
  brand: "bg-brand/10 text-brand",
  "brand-2": "bg-brand-2/10 text-brand-2",
  cyan: "bg-cyan/10 text-cyan",
  amber: "bg-amber/15 text-amber",
};

function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-ink">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <Hero />
        <Story />
        <MissionVision />
        <Values />
        <Features />
        <Stats />
        <CTA />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="aurora" />
      <div className="absolute inset-0 grid-hero-bg opacity-60" />
      <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-brand ring-1 ring-line backdrop-blur"
        >
          🌏 About us
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl"
        >
          Built in India. <span className="text-gradient-brand">For the world.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-base text-ink-soft sm:text-lg"
        >
          BechnaSeekho is on a mission to give every professional an unfair advantage — powered
          by AI, guided by real practitioners, and built around one goal: getting you hired.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/careersync" className="btn-primary">
            Explore CareerSync <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/signup" className="btn-ghost">
            Create free account
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Our story</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            One ecosystem, built from real hiring problems.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
            BechnaSeekho started with a simple observation: capable people were being missed by
            broken hiring processes, and job seekers had none of the tools recruiters use every
            day. So we built them — resume intelligence, verified jobs, interview practice and
            upskilling — and put them in one place, for free.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Cut resume-to-interview time from weeks to days.",
              "Give every candidate real feedback — not silence.",
              "Show honest salary and role expectations upfront.",
              "Use AI to save time, never to replace judgement.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[15px] text-ink">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald/10 text-emerald">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-brand/10 via-cyan/10 to-emerald/10 opacity-70 blur-2xl" />
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "CareerSync", v: "Jobs, resumes & mock interviews", c: "from-blue-500 to-cyan-500" },
              { k: "Academy", v: "Live cohorts & certifications", c: "from-violet-500 to-purple-500" },
              { k: "ATS Score", v: "Instant resume scoring", c: "from-emerald-500 to-teal-500" },
              { k: "Resources", v: "Guides, tools & FAQs", c: "from-orange-500 to-amber-500" },
            ].map((s) => (
              <div key={s.k} className="relative overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-line shadow-[0_18px_40px_-24px_oklch(0.55_0.22_264/0.2)]">
                <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${s.c} opacity-10 blur-xl`} />
                <div className={`bg-gradient-to-r ${s.c} bg-clip-text text-lg font-black text-transparent`}>{s.k}</div>
                <div className="mt-1 text-xs font-medium text-ink-soft">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MissionVision() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.35),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(6,182,212,0.3),transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Our mission</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Make hiring feel <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">human</span> again.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              Job seekers spend weeks tuning resumes for bots. Recruiters drown in unfit
              applications. BechnaSeekho exists because both sides deserve better tools and clearer signal.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Our vision</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              A career OS that grows with you — <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">for life.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              We're building the operating system for careers in India — resume, interview,
              learning, salary intelligence and coaching, all in one ecosystem.
            </p>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              className="rounded-2xl bg-white/5 p-6 text-left backdrop-blur ring-1 ring-white/10 transition hover:bg-white/10"
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
  );
}

function Values() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand">Our values</p>
      <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        What we won't compromise on.
      </h2>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-line shadow-[0_14px_36px_-22px_oklch(0.55_0.22_264/0.2)] transition-shadow hover:shadow-[0_24px_50px_-24px_oklch(0.55_0.22_264/0.3)]"
          >
            <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />
            <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="mt-5 font-display text-lg font-bold text-ink">{title}</div>
            <div className="mt-1.5 text-sm leading-relaxed text-ink-soft">{desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand">What we offer</p>
      <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        One ecosystem, every service you need.
      </h2>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc, accent }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-line transition-shadow hover:shadow-[0_20px_40px_-20px_oklch(0.55_0.22_264/0.25)]"
          >
            <div className={`grid h-11 w-11 place-items-center rounded-2xl ${ACCENT_BG[accent]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{desc}</p>
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br from-brand/0 to-brand-2/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="text-center">
      <p ref={ref} className="font-display font-numeric text-3xl font-extrabold text-ink sm:text-4xl">
        {Math.round(value)}
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium text-ink-soft sm:text-sm">{label}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-line sm:grid-cols-4 sm:p-10">
        {STATS.map((s) => (
          <StatCard key={s.v} target={s.k} suffix={s.suffix} label={s.v} />
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand-2 to-cyan px-6 py-14 text-center shadow-[0_30px_80px_-30px_oklch(0.55_0.22_264/0.5)] sm:px-12 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.25),transparent_45%)]" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to get an unfair advantage in your career?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Join thousands of professionals using BechnaSeekho to build resumes, land verified
            jobs and grow faster with CareerSync.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lg transition hover:-translate-y-0.5"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/careersync"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
            >
              Explore CareerSync
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
