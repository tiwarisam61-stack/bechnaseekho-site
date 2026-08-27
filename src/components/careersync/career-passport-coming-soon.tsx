import { motion } from "framer-motion";
import { Video, ShieldCheck, Building2 } from "lucide-react";

const FEATURES = [
  { icon: Video, title: "Record Anytime", sub: "You're in control" },
  { icon: ShieldCheck, title: "Verified by AI", sub: "Authentic & reliable" },
  { icon: Building2, title: "Share with Companies", sub: "Get discovered faster" },
];

/** Standalone announcement card for the upcoming "Career Passport" feature, shown above the Live Job Board section. */
export function CareerPassportComingSoon() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[26px] border border-blue-100/70 shadow-[0_18px_50px_-28px_rgba(37,99,235,0.3)]"
        style={{
          background: "linear-gradient(120deg,#F7FAFF 0%,#F1F6FE 55%,#EFFCFF 100%)",
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: "radial-gradient(rgba(37,99,235,0.16) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              maskImage: "radial-gradient(ellipse 60% 100% at 100% 0%, black 30%, transparent 75%)",
            }}
          />
          <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:gap-7 lg:p-6">
          {/* Left visual */}
          <div className="relative mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-inner sm:h-28 sm:w-28 lg:mx-0">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-md ring-1 ring-blue-100 sm:h-16 sm:w-16">
              <Video className="h-7 w-7 text-blue-600" aria-hidden="true" />
            </div>
            <span className="absolute -top-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-500 shadow ring-1 ring-red-100">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              REC
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-2 text-center lg:min-w-[210px] lg:max-w-xs lg:text-left">
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-600 shadow-sm ring-1 ring-blue-200">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
                Coming Soon
              </span>
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-blue-100">
                <Video className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              </span>
            </div>

            <h2
              className="text-lg font-extrabold tracking-tight text-[#0F172A] sm:text-xl"
              style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
            >
              Career Passport
            </h2>

            <p className="text-xs font-medium leading-snug text-gray-500 sm:text-sm">
              One interview. Unlimited opportunities.
              <br className="hidden sm:block" /> Let companies discover the real you.
            </p>
          </div>

          {/* Feature columns */}
          <div className="grid grid-cols-1 gap-4 divide-y divide-blue-100/80 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0 lg:flex-1">
            {FEATURES.map(({ icon: Icon, title, sub }, i) => (
              <div
                key={title}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 text-center sm:py-0 ${i > 0 ? "pt-4 sm:pt-0" : ""}`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white ring-1 ring-blue-100 shadow-sm">
                  <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </span>
                <p className="text-xs font-bold leading-tight text-[#0F172A] sm:text-[13px]">{title}</p>
                <p className="text-[11px] font-medium text-gray-400">{sub}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center lg:justify-end">
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Career Passport is not available yet"
              className="inline-flex w-full shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-sm font-bold text-gray-400 ring-1 ring-gray-200 sm:w-auto"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
