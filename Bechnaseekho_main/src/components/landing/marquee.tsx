import { motion } from "framer-motion";

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro",
  "Flipkart", "Uber", "Meesho", "PhonePe", "Razorpay", "CRED",
  "Byju's", "Adobe", "Deloitte", "Accenture", "IBM", "Capgemini",
];

export function Marquee() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-10">
      {/* Curved wave top */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mq-wave" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#EFF4FF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#EFF4FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C240,120 480,0 720,40 C960,80 1200,20 1440,60 L1440,0 L0,0 Z"
          fill="url(#mq-wave)"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(239,244,255,0.45),transparent_60%,rgba(243,238,255,0.35))]" />

      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Trusted by <span className="text-gradient-brand">Top Hiring Companies</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
            Our learners are working at India's leading startups and global enterprises.
          </p>
        </motion.div>
      </div>

      <div className="group relative mt-8 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex shrink-0 items-center gap-4 pr-4 sm:gap-5 sm:pr-5">
          {[...COMPANIES, ...COMPANIES].map((company, i) => (
            <div
              key={i}
              className="group/pill relative flex h-16 min-w-[9.5rem] shrink-0 items-center justify-center rounded-2xl bg-white/70 px-6 ring-1 ring-line backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:ring-brand/40 hover:shadow-[0_18px_40px_-18px_oklch(0.55_0.22_264/0.4)]"
            >
              <span className="font-display text-sm font-bold tracking-tight text-ink/80 transition-transform duration-300 group-hover/pill:scale-105">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-track {
          animation: marquee-scroll 55s linear infinite;
          width: max-content;
        }
        .group:hover .marquee-track { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
