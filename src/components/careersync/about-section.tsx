import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Upload, Sparkles, Target, MessageSquare, Rocket, Trophy } from "lucide-react";
import heroHired from "@/assets/careersync-hired.png";

const STEPS = [
  { icon: Upload, title: "Upload or Build Your Resume", desc: "Drag-and-drop your CV or use our resume builder.", color: "from-blue-500 to-cyan-500" },
  { icon: Sparkles, title: "AI Skill & Gap Analysis", desc: "Benchmark your profile against 10,000+ real job descriptions.", color: "from-cyan-500 to-teal-500" },
  { icon: Target, title: "Smart Job Matching", desc: "Live feed of jobs ranked by match score. Apply where you fit.", color: "from-teal-500 to-emerald-500" },
  { icon: MessageSquare, title: "Mock Interviews", desc: "Practice role-specific questions with instant feedback.", color: "from-emerald-500 to-lime-500" },
  { icon: Rocket, title: "One-Click Apply", desc: "Auto-fill applications across 500+ hiring partners.", color: "from-amber-500 to-orange-500" },
  { icon: Trophy, title: "Get the Offer", desc: "From negotiation to offer-letter — we walk the final mile.", color: "from-orange-500 to-pink-500" },
];

export function CareerSyncAboutSection() {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-24 scroll-mt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 left-[8%] h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-[6%] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* HERO ROW */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600"
            >
              About CareerSync
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="mt-3 text-4xl font-black tracking-tight text-[#0F172A] sm:text-5xl"
              style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
            >
              From <span className="text-blue-600">signup</span> to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">signed offer</span> — powered by AI.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="mt-5 max-w-xl text-lg text-gray-600"
            >
              CareerSync is your personal career coach, resume writer, interview trainer and job hunter — all in one place.
              We use AI to remove every guessing game between you and your dream job.
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" search={{ role: "candidate" }}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(37,99,235,0.6)] transition hover:bg-blue-700">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#jobs"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] ring-1 ring-blue-100 transition hover:bg-blue-50">
                Explore Jobs
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500">
              {["50,000+ users", "500+ hiring partners", "smart, human-approved"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* 3D Hired character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute inset-8 -z-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 blur-2xl" />

            {[
              { l: "10%", t: "18%", c: "bg-amber-400" },
              { l: "82%", t: "12%", c: "bg-pink-500" },
              { l: "88%", t: "48%", c: "bg-cyan-500" },
              { l: "6%", t: "60%", c: "bg-emerald-500" },
              { l: "72%", t: "82%", c: "bg-blue-600" },
              { l: "22%", t: "88%", c: "bg-purple-500" },
            ].map((p, i) => (
              <motion.span
                key={i}
                className={`absolute h-2.5 w-2.5 rounded-full ${p.c}`}
                style={{ left: p.l, top: p.t }}
                animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6], scale: [1, 1.4, 1] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}

            <motion.img
              src={heroHired}
              alt="Candidate celebrating a job offer"
              width={520}
              height={520}
              loading="lazy"
              decoding="async"
              className="relative z-10 mx-auto w-full drop-shadow-[0_30px_50px_rgba(37,99,235,0.35)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="absolute -top-2 -left-4 z-20 rotate-[-8deg] rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_30px_-10px_rgba(16,185,129,0.6)]">
              🎉 Hired!
            </div>

            <div className="absolute -right-2 top-1/2 z-20 w-44 rotate-6 rounded-2xl bg-white p-3 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.25)] ring-1 ring-blue-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Offer Letter</div>
              <div className="mt-1 text-sm font-black text-[#0F172A]">Senior Developer</div>
              <div className="mt-0.5 text-xs text-gray-500">₹28 LPA · Remote</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <motion.div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }} whileInView={{ width: "92%" }} viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.4 }} />
              </div>
              <div className="mt-1 text-right text-[10px] font-bold text-blue-600">92% match</div>
            </div>
          </motion.div>
        </div>

        {/* STEPS */}
        <div className="mt-24 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">The Journey</p>
          <h3 className="mt-3 text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl"
            style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}>
            6 steps. One outcome.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">You, hired.</span>
          </h3>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </section>
  );
}
