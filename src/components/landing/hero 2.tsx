import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Play,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroCharacter from "@/assets/hero-character.png";

const ROTATE_WORDS = ["Growth.", "Success.", "Future.", "Story."];

const HERO_AVATARS = [
  { bg: "linear-gradient(135deg,#F59E0B,#EF4444)", seed: "Rahul26" },
  { bg: "linear-gradient(135deg,#2563EB,#7C3AED)", seed: "Priya26" },
  { bg: "linear-gradient(135deg,#06B6D4,#22C55E)", seed: "Arjun26" },
  { bg: "linear-gradient(135deg,#EC4899,#F59E0B)", seed: "Sneha26" },
];

function useTypewriter(words: string[], typeSpeed = 90, pauseMs = 1400) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((v) => (v + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? typeSpeed / 2 : typeSpeed,
    );
    return () => clearTimeout(t);
  }, [text, deleting, i, words, typeSpeed, pauseMs]);

  return text;
}

export function Hero() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spotlightX = useTransform(mx, (v) => `${v * 100}%`);
  const spotlightY = useTransform(my, (v) => `${v * 100}%`);
  const typed = useTypewriter(ROTATE_WORDS);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      animate(mx, e.clientX / window.innerWidth, { duration: 0.6 });
      animate(my, e.clientY / window.innerHeight, { duration: 0.6 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section id="home" className="relative overflow-hidden pt-24 pb-4 sm:pt-28 sm:pb-8">
      <div className="aurora" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[oklch(0.98_0.02_255)] via-[oklch(0.99_0.015_270)] to-background" />
      {/* Cursor-follow spotlight */}
      <motion.div
        aria-hidden
        style={{
          background: `radial-gradient(600px circle at ${spotlightX.get()} ${spotlightY.get()}, oklch(0.7 0.2 265 / 0.18), transparent 60%)`,
        }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          className="h-full w-full"
          style={{
            background: `radial-gradient(500px circle at var(--x) var(--y), oklch(0.7 0.22 264 / 0.22), transparent 55%)`,
            // @ts-expect-error CSS var
            "--x": spotlightX,
            "--y": spotlightY,
          }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 xl:pl-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1.15fr]">
          {/* LEFT: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-ink shadow-sm ring-1 ring-line sm:text-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
              </span>
              All-in-One Platform for Career & Learners Growth
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl xl:text-[4.5rem]"
            >
              Your Career.<br />
              Your{" "}
              <span className="relative inline-block text-brand">
                <span className="inline-block min-w-[1ch]">{typed}</span>
                <span className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-1 animate-pulse bg-brand-2 align-middle" />
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 8 Q 50 2, 100 6 T 198 4" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              <br />
              <motion.span
                animate={{ color: ["#0B1220", "#2563EB", "#0B1220", "#7C3AED", "#0B1220"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                Our Platform.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
            >
              Find jobs. Build skills. Learn sales. Get hired.<br />
              All in one intelligent ecosystem — designed for India's next generation of talent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/signup" className="btn-primary">
                Explore Bechnaseekho Academy <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/careersync-academy"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink ring-1 ring-line transition-all hover:bg-surface"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand/10 text-brand transition-transform group-hover:scale-110">
                  <Play className="h-3 w-3 fill-current" />
                </span>
                Courses
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {HERO_AVATARS.map(({ bg, seed }, i) => (
                  <div
                    key={i}
                    className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-background"
                    style={{ background: bg }}
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=transparent`}
                      alt=""
                      aria-hidden
                      className="absolute -top-[5%] left-1/2 h-[140%] w-[140%] -translate-x-1/2 object-contain"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-ink-soft">
                Trusted by <span className="font-semibold text-ink font-numeric">5,000+</span> users across India
              </p>
            </motion.div>
          </div>

          {/* RIGHT: Illustration + dashboard */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
      className="relative mx-auto aspect-square w-full max-w-[620px]"
    >
      {/* Big soft blue blob behind dashboard */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[4%] h-[62%] w-[62%] rounded-full bg-gradient-to-br from-[oklch(0.88_0.1_260)] via-[oklch(0.82_0.15_265)] to-[oklch(0.72_0.19_275)] opacity-80"
      />
      <div className="absolute left-[8%] top-[3%] h-[64%] w-[64%] rounded-full bg-gradient-to-br from-white/40 to-transparent blur-md" />

      <div className="absolute left-[52%] top-[58%] h-2 w-2 rounded-full bg-pink-400" />
      <div className="absolute left-[6%] top-[36%] h-1.5 w-1.5 rounded-full bg-brand" />

      {/* Paper plane */}
      <motion.svg
        animate={{ y: [0, -6, 0], rotate: [-12, -8, -12] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[6%] top-[10%] h-16 w-16"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path d="M60 4 L4 28 L26 34 L34 60 Z" fill="url(#pp)" />
        <defs>
          <linearGradient id="pp" x1="0" x2="64" y1="0" y2="64">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Character */}
      <img
        src={heroCharacter}
        alt="BechnaSeekho user"
        width={1024}
        height={1024}
        decoding="async"
        fetchPriority="high"
        className="pointer-events-none absolute -bottom-4 right-[-6%] z-20 h-[78%] w-auto object-contain drop-shadow-2xl"
      />

      {/* Main dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="absolute left-[6%] top-[14%] w-[62%] rounded-2xl bg-white p-4 shadow-[0_30px_60px_-20px_rgba(37,99,235,0.35)] ring-1 ring-white"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-display text-sm font-semibold text-ink">Hey, Vashu 👋</p>
            <p className="text-[10px] text-ink-soft">Let's achieve your dream job today!</p>
          </div>
          <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand to-brand-2 ring-2 ring-white">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Ankit26&backgroundColor=transparent"
              alt=""
              aria-hidden
              className="absolute -top-[5%] left-1/2 h-[140%] w-[140%] -translate-x-1/2 object-contain"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface px-2.5 py-1.5 ring-1 ring-line">
          <div className="h-3 w-3 rounded-full border border-ink-soft/40" />
          <span className="text-[10px] text-ink-soft">Search jobs, skills or companies…</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <div className="rounded-xl bg-surface p-3 ring-1 ring-line">
            <p className="text-[9px] font-medium text-ink-soft">Resume Score</p>
            <div className="mt-1.5 flex justify-center">
              <ScoreRing value={92} />
            </div>
            <p className="mt-1 text-center text-[9px] font-semibold text-emerald">Excellent</p>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold text-ink">Top Matches</p>
            <ul className="space-y-1.5">
              {[
                { r: "UI/UX Designer", c: "TechNova", tint: "bg-brand/15 text-brand" },
                { r: "Business Analyst", c: "Deloitte", tint: "bg-brand-2/15 text-brand-2" },
                { r: "Sales Executive", c: "Byju's", tint: "bg-amber/15 text-amber" },
              ].map((j) => (
                <li key={j.r} className="flex items-center gap-2 rounded-lg bg-white px-1.5 py-1 ring-1 ring-line">
                  <div className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${j.tint}`}>
                    <Briefcase className="h-2.5 w-2.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[9px] font-semibold text-ink leading-tight">{j.r}</p>
                    <p className="truncate text-[8px] text-ink-soft leading-tight">{j.c}</p>
                  </div>
                  <span className="text-[8px] font-semibold text-brand">View</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-around rounded-xl bg-surface p-1.5 ring-1 ring-line">
          {["Jobs", "Resume", "Interview", "Courses", "More"].map((t, i) => (
            <div key={t} className={`flex flex-col items-center gap-0.5 px-1.5 py-0.5 ${i === 0 ? "text-brand" : "text-ink-soft"}`}>
              <div className={`h-3 w-3 rounded-sm ${i === 0 ? "bg-brand" : "bg-ink-soft/40"}`} />
              <span className="text-[8px] font-medium">{t}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating: Interview Prep */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-2%] top-[8%] w-40 rounded-2xl bg-white p-3 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.35)] ring-1 ring-white sm:right-[2%]"
      >
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-2/15 text-brand-2">
            <GraduationCap className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-semibold text-ink">Interview Preparation</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="relative h-10 w-10">
            <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
              <circle cx="20" cy="20" r="15" stroke="oklch(0.93 0.01 260)" strokeWidth="4" fill="none" />
              <circle
                cx="20"
                cy="20"
                r="15"
                stroke="#2563EB"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(75 / 100) * 2 * Math.PI * 15} 999`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[9px] font-bold font-numeric">75%</div>
          </div>
          <p className="text-[9px] text-ink-soft">Completed</p>
        </div>
      </motion.div>

      {/* Floating: Applications */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute right-[-4%] top-[42%] w-44 rounded-2xl bg-white p-3 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.35)] ring-1 ring-white sm:right-[0%]"
      >
        <div className="flex items-center justify-between">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald/15 text-emerald">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="rounded-full bg-emerald/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald font-numeric">↑ 18%</span>
        </div>
        <p className="mt-2 text-[10px] font-semibold text-ink">Applications</p>
        <div className="flex items-baseline justify-between">
          <p className="font-numeric text-2xl font-bold text-ink">24</p>
          <p className="text-[9px] text-ink-soft">This Week</p>
        </div>
        <svg viewBox="0 0 100 24" className="mt-1 h-6 w-full">
          <path d="M0 20 L15 16 L30 18 L45 10 L60 12 L75 6 L100 4" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative h-14 w-14">
      <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
        <circle cx="30" cy="30" r={r} stroke="oklch(0.93 0.01 260)" strokeWidth="5" fill="none" />
        <circle
          cx="30"
          cy="30"
          r={r}
          stroke="url(#hring)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
        <defs>
          <linearGradient id="hring" x1="0" x2="60">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="font-numeric text-sm font-bold leading-none text-ink">{value}</p>
          <p className="text-[7px] text-ink-soft">/100</p>
        </div>
      </div>
    </div>
  );
}
