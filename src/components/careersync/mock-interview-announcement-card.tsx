import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mic, UserRound, Headphones } from "lucide-react";

const UPDATES = [
  "Resume templates updated",
  "Premium verified jobs added",
  "New CareerSync features released",
];

/** Announcement card shown directly below the Career Category section on the CareerSync homepage. */
export function MockInterviewAnnouncementCard() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[28px] border border-emerald-100 shadow-[0_24px_60px_-32px_rgba(16,185,129,0.35)]"
        style={{
          background: "linear-gradient(120deg,#F3FBF7 0%,#EAF9F1 55%,#F3FEFA 100%)",
        }}
      >
        {/* Subtle waveform pattern */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="mi-wave" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M0 32 Q 16 8, 32 32 T 64 32" fill="none" stroke="#059669" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mi-wave)" />
        </svg>
        <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-teal-300/15 blur-3xl" />

        <div className="relative flex flex-col gap-8 p-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
          {/* Content */}
          <div className="flex flex-1 flex-col gap-3.5 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-600 shadow-sm ring-1 ring-emerald-200">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                What's New
              </span>
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-white/70">
                Just launched
              </span>
            </div>

            <h2
              className="text-2xl font-black tracking-tight text-[#0F172A] sm:text-[2rem]"
              style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
            >
              Mock Interviews are now live
            </h2>

            <ul className="flex flex-col items-center gap-2 lg:items-start lg:flex-row lg:flex-wrap lg:gap-x-5 lg:gap-y-2">
              {UPDATES.map((u) => (
                <li key={u} className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/80 ring-1 ring-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </div>

          {/* Illustration */}
          <div className="relative mx-auto h-28 w-28 shrink-0 sm:h-32 sm:w-32">
            <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 shadow-inner">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white shadow-md ring-1 ring-emerald-100 sm:h-24 sm:w-24">
                <UserRound className="h-10 w-10 text-emerald-600" aria-hidden="true" />
              </div>
            </div>
            <span className="absolute -top-1 right-1 grid h-9 w-9 place-items-center rounded-full bg-white shadow ring-1 ring-emerald-100">
              <Headphones className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            </span>
            <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-emerald-600 shadow ring-2 ring-white">
              <Mic className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            </span>
          </div>

          {/* CTA */}
          <div className="flex justify-center lg:justify-end">
            <a
              href="/mock-interview-practice"
              className="group/cta inline-flex shrink-0 items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/30 shadow-[0_14px_35px_-12px_rgba(16,185,129,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_-10px_rgba(16,185,129,0.7)]"
            >
              Explore Mock Interview
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
