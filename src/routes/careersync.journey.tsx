import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Sparkles,
  Target,
  MessageSquare,
  Rocket,
  Trophy,
} from "lucide-react";

export const Route = createFileRoute("/careersync/journey")({
  head: () => ({
    meta: [
      { title: "Your 6-Step Journey · CareerSync" },
      {
        name: "description",
        content:
          "From uploading your resume to signing the offer letter — how CareerSync walks you through hiring in six guided steps.",
      },
      { property: "og:title", content: "Your 6-Step Journey · CareerSync" },
      { property: "og:description", content: "Six steps. One outcome. You, hired." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyPage,
});

const STEPS = [
  { icon: Upload, title: "Upload or Build Your Resume", desc: "Drag-and-drop your CV or use our resume builder.", color: "from-blue-500 to-cyan-500" },
  { icon: Sparkles, title: "Skill & Gap Analysis", desc: "Benchmark your profile against 10,000+ real job descriptions.", color: "from-cyan-500 to-teal-500" },
  { icon: Target, title: "Smart Job Matching", desc: "Live feed of jobs ranked by match score. Apply where you fit.", color: "from-teal-500 to-emerald-500" },
  { icon: MessageSquare, title: "Mock Interviews", desc: "Practice role-specific questions with instant feedback.", color: "from-emerald-500 to-lime-500" },
  { icon: Rocket, title: "One-Click Apply", desc: "Auto-fill applications across 500+ hiring partners.", color: "from-amber-500 to-orange-500" },
  { icon: Trophy, title: "Get the Offer", desc: "From negotiation to offer-letter — we walk the final mile.", color: "from-orange-500 to-pink-500" },
];

function JourneyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <TopBar />

      <div className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">
            The Journey
          </p>
          <h1
            className="mt-3 text-4xl font-black tracking-tight text-[#0F172A] sm:text-5xl"
            style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
          >
            6 steps. One outcome.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              You, hired.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Every step assisted by AI. Every step reviewed by real career mentors.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative rounded-3xl bg-white p-6 ring-1 ring-blue-100/60 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.2)] hover:-translate-y-1 hover:shadow-[0_28px_50px_-20px_rgba(37,99,235,0.35)] transition-all"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-blue-600">Step {i + 1}</div>
                <h4 className="mt-1 text-lg font-black tracking-tight text-[#0F172A]">{s.title}</h4>
                <p className="mt-2 text-sm text-gray-500">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Link
            to="/signup"
            search={{ role: "candidate" }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(37,99,235,0.6)] transition hover:bg-blue-700"
          >
            Start your journey
          </Link>
          <a
            href="/careersync/jobs"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] ring-1 ring-blue-100 transition hover:bg-blue-50"
          >
            Explore open jobs
          </a>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/careersync"
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to CareerSync
        </Link>
        <div className="text-sm font-bold text-slate-900">Your Journey</div>
        <a
          href="/careersync/jobs"
          target="_blank"
          rel="noopener"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1.5 text-xs font-bold text-white shadow-md"
        >
          Explore Jobs
        </a>
      </div>
    </motion.header>
  );
}
