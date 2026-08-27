import {
  Trophy,
  Rocket,
  GraduationCap,
  Layers,
  Target,
  Briefcase,
  Building2,
  Star,
  TrendingUp,
  Video,
  PlayCircle,
  NotebookPen,
  ClipboardCheck,
  BadgeCheck,
  Infinity as InfinityIcon,
  Timer,
  MessagesSquare,
  Bot,
  Compass,
  FileText,
  Linkedin,
  HandshakeIcon,
  ArrowRight,
  Sparkles,
  Quote,
} from "lucide-react";
import { Reveal, CountUp } from "./reveal";

/* ------------------------------- Roadmap -------------------------------- */

const roadmap = [
  { title: "Beginner", desc: "Fundamentals, mindset and core vocabulary", icon: Sparkles, weeks: "Week 1", outcome: "Core foundation" },
  { title: "Intermediate", desc: "Frameworks, live drills and role-plays", icon: Layers, weeks: "Week 2–3", outcome: "Applied skills" },
  { title: "Advanced", desc: "Complex deals, negotiation and strategy", icon: Target, weeks: "Week 4", outcome: "Deal mastery" },
  { title: "Projects", desc: "Real client scenarios and portfolio work", icon: Rocket, weeks: "Week 5", outcome: "Live portfolio" },
  { title: "Certification", desc: "Timed assessment and verified certificate", icon: BadgeCheck, weeks: "Week 6", outcome: "Verified badge" },
  { title: "Interview", desc: "Mock interviews with senior mentors", icon: MessagesSquare, weeks: "Week 7", outcome: "Interview ready" },
  { title: "Placement", desc: "Referrals to 100+ hiring partners", icon: Trophy, weeks: "Week 8", outcome: "Offer letter" },
];

export function RoadmapSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <Reveal className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
          <Compass className="h-3.5 w-3.5" /> Learning roadmap
        </span>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          A guided path from first lesson to first offer
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Every learner follows the same proven seven-stage journey, with milestones unlocking
          sequentially so nothing is skipped.
        </p>
      </Reveal>

      <ol className="relative mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <span
          className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-secondary/60 via-secondary/20 to-transparent md:block"
          aria-hidden
        />
        {roadmap.map((r, i) => (
          <Reveal as="li" key={r.title} delay={i * 80}>
            <div className="glass-card gradient-frame hover-lift relative h-full rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl brand-gradient text-primary-foreground soft-shadow">
                  <r.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                    Stage {i + 1}
                  </span>
                  <span className="block text-[11px] font-bold text-secondary">{r.weeks}</span>
                </span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-accent">
                <BadgeCheck className="h-3 w-3" /> {r.outcome}
              </span>
              <span className="mt-4 block h-1 w-full overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full brand-gradient transition-[width] duration-1000"
                  style={{ width: `${((i + 1) / roadmap.length) * 100}%` }}
                />
              </span>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={120}>
        <div className="glass-card gradient-frame mt-8 grid gap-4 rounded-3xl p-6 sm:grid-cols-3">
          {[
            ["8 weeks", "Average time to job-ready"],
            ["1:1 mentor", "Assigned from day one"],
            ["100% tracked", "Sequential unlocks, nothing skipped"],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <p className="text-xl font-black tracking-tight text-secondary">{k}</p>
              <p className="text-sm font-semibold text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------ Categories ------------------------------ */

const cats: [string, string][] = [
  ["Sales", "12 modules"], ["HR", "8 modules"], ["Digital Marketing", "10 modules"],
  ["Business Development", "9 modules"], ["Cold Calling", "6 modules"],
  ["Communication", "11 modules"], ["Interview Preparation", "7 modules"],
  ["Resume Building", "5 modules"], ["AI Tools", "9 modules"], ["Excel", "8 modules"],
  ["Leadership", "10 modules"], ["Customer Support", "6 modules"],
  ["Soft Skills", "12 modules"], ["Corporate Training", "7 modules"],
];

export function CategoriesSection({ onPick }: { onPick?: (c: string) => void }) {
  return (
    <section className="border-y border-border/60 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
            <Layers className="h-3.5 w-3.5" /> Explore by category
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Fourteen career tracks, one platform
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Pick a track and we will filter the catalogue instantly — every track includes projects,
            assessments and placement support.
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {cats.map(([c, count], i) => (
            <Reveal key={c} delay={i * 40}>
              <button
                type="button"
                onClick={() => onPick?.(c)}
                className="group glass-card gradient-frame hover-lift flex w-full items-center gap-3 rounded-2xl p-4 text-left"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:brand-gradient group-hover:text-primary-foreground">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{c}</span>
                  <span className="block text-[11px] font-semibold text-muted-foreground">{count}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-secondary group-hover:opacity-100" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Premium features --------------------------- */

const features: { icon: typeof Video; label: string; desc: string }[] = [
  { icon: Video, label: "Live Classes", desc: "Weekly sessions with senior mentors" },
  { icon: PlayCircle, label: "Recorded Classes", desc: "Rewatch anything, anytime" },
  { icon: NotebookPen, label: "Download Notes", desc: "Chapter notes and cheat sheets" },
  { icon: ClipboardCheck, label: "Assignments", desc: "Graded practice after each unit" },
  { icon: BadgeCheck, label: "Certificates", desc: "Verified at 100% completion" },
  { icon: InfinityIcon, label: "Lifetime Access", desc: "Including all future updates" },
  { icon: Timer, label: "Practice Tests", desc: "Timed 20-question drills" },
  { icon: MessagesSquare, label: "Mock Interviews", desc: "Real panels, honest feedback" },
  { icon: Bot, label: "AI Mentor", desc: "Instant answers while you learn" },
  { icon: Compass, label: "Career Guidance", desc: "Personalised role mapping" },
  { icon: FileText, label: "Resume Review", desc: "ATS-optimised rewrite" },
  { icon: Linkedin, label: "LinkedIn Optimization", desc: "Profile built for recruiters" },
  { icon: HandshakeIcon, label: "Placement Assistance", desc: "Referrals to 100+ partners" },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden deep-gradient">
      <div className="absolute inset-0 grid-noise opacity-20" />
      <div className="animate-float absolute -left-24 top-16 h-72 w-72 rounded-full bg-[var(--secondary)]/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full glass-dark px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Everything included
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Premium features in every programme
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            One enrolment unlocks the full CareerSync ecosystem — no upsells, no add-ons.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.label} delay={i * 40}>
              <div className="glass-dark hover-lift flex h-full items-start gap-3 rounded-2xl p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient text-primary-foreground">
                  <f.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-foreground">{f.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{f.desc}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Testimonials ----------------------------- */

const testimonials = [
  {
    name: "Aarav Mehta", role: "SDR → Enterprise AE", company: "Freshworks",
    initials: "AM", stars: 5, before: "₹4.2 LPA", after: "₹11.5 LPA",
    text: "The objection-handling and discovery modules rebuilt how I sell. I cleared three rounds and doubled my package within five months.",
  },
  {
    name: "Priya Nair", role: "Insurance Advisor", company: "HDFC Life",
    initials: "PN", stars: 5, before: "₹3.6 LPA", after: "₹8.4 LPA",
    text: "Mock interviews were brutal in the best way. By the real interview nothing surprised me.",
  },
  {
    name: "Rahul Verma", role: "Business Development Manager", company: "Deloitte",
    initials: "RV", stars: 5, before: "₹5.0 LPA", after: "₹14.0 LPA",
    text: "The negotiation track paid for itself in one conversation. Genuinely premium teaching.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <Reveal className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
          <Star className="h-3.5 w-3.5" /> Success stories
        </span>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Careers transformed, not just courses completed
        </h2>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black">
            <Star className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" /> 4.9 / 5 average rating
          </span>
          <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black">
            <TrendingUp className="h-3.5 w-3.5 text-accent" /> 2.4x average salary jump
          </span>
          <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black">
            <Trophy className="h-3.5 w-3.5 text-secondary" /> 1,000+ verified reviews
          </span>
        </div>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 100}>
            <figure className="glass-card gradient-frame hover-lift flex h-full flex-col rounded-3xl p-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl brand-gradient text-sm font-black text-primary-foreground">
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                </div>
                <span className="ml-auto shrink-0 rounded-lg bg-muted px-2 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {t.company}
                </span>
              </div>
              <div className="mt-4 flex gap-0.5" aria-label={`${t.stars} star review`}>
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>
              <Quote className="mt-4 h-5 w-5 text-secondary" />
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {t.text}
              </blockquote>
              <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl bg-muted/70 p-3 text-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Before</p>
                  <p className="text-sm font-bold">{t.before}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">After</p>
                  <p className="text-sm font-black text-accent">{t.after}</p>
                </div>
              </div>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Hiring companies --------------------------- */

const companies = [
  "Google", "Microsoft", "Amazon", "Accenture", "Infosys", "Wipro", "TCS",
  "Deloitte", "EY", "KPMG", "HCL", "Capgemini", "IBM", "Tech Mahindra", "Cognizant",
];

export function CompaniesSection() {
  return (
    <section className="border-y border-border/60 bg-card/50 py-14">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Our learners get hired at
          </p>
        </Reveal>
      </div>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-4">
          {[...companies, ...companies].map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="glass-card flex h-14 shrink-0 items-center rounded-2xl px-7 text-base font-black tracking-tight text-muted-foreground transition-colors hover:text-secondary"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Placement ------------------------------ */

export function PlacementSection() {
  const stats = [
    { value: 8400, suffix: "+", label: "Students Placed", icon: GraduationCap },
    { value: 100, suffix: "+", label: "Hiring Partners", icon: Building2 },
    { value: 6.8, suffix: " LPA", label: "Average Salary", icon: TrendingUp, decimals: 1 },
    { value: 24, suffix: " LPA", label: "Highest Package", icon: Trophy },
  ];
  const timeline = [
    ["Week 1–4", "Skill foundation & assessments"],
    ["Week 5–8", "Live projects & portfolio"],
    ["Week 9–10", "Resume, LinkedIn & mock interviews"],
    ["Week 11+", "Partner referrals & offer negotiation"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-accent-foreground">
              <Briefcase className="h-3.5 w-3.5" /> Placement performance
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Outcomes we are measured on
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="glass-card gradient-frame hover-lift rounded-3xl p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-3xl font-black tracking-tight">
                    <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </p>
                  <p className="text-sm font-bold text-muted-foreground">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="glass-card gradient-frame h-full rounded-3xl p-6">
            <h3 className="text-lg font-extrabold tracking-tight">Placement timeline</h3>
            <ol className="mt-5 space-y-5">
              {timeline.map(([w, d], i) => (
                <li key={w} className="relative flex gap-4 pl-1">
                  <span className="relative flex flex-col items-center">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full brand-gradient text-[11px] font-black text-primary-foreground">
                      {i + 1}
                    </span>
                    {i < timeline.length - 1 ? (
                      <span className="mt-1 w-px flex-1 bg-border" />
                    ) : null}
                  </span>
                  <span className="min-w-0 pb-1">
                    <span className="block text-xs font-black uppercase tracking-wider text-secondary">{w}</span>
                    <span className="block text-sm font-semibold text-muted-foreground">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- CTA --------------------------------- */

export function CtaSection() {
  const assurances = [
    { icon: BadgeCheck, label: "Industry-recognised certificate" },
    { icon: HandshakeIcon, label: "100+ hiring partners" },
    { icon: Timer, label: "Lifetime access to updates" },
    { icon: MessagesSquare, label: "1:1 mentor from day one" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[36px] deep-gradient px-6 py-14 sm:px-12 sm:py-16">
          <div className="absolute inset-0 grid-noise opacity-20" />
          <div className="animate-glow-pulse absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--gold)]/25 blur-3xl" />
          <div className="animate-float absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-[var(--secondary)]/25 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full glass-dark px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-secondary" /> Admissions open
              </span>
              <h2 className="mt-5 text-3xl font-black leading-[1.06] tracking-tight text-foreground sm:text-5xl">
                Ready to Start Your Career?
                <span className="block accent-text">Your seat is waiting.</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Join 1,000+ learners building successful careers with industry-focused programmes,
                live projects, interview prep and dedicated placement support.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#courses"
                  className="btn-glow ripple inline-flex items-center gap-2 rounded-xl gold-gradient px-6 py-3.5 text-sm font-black text-[oklch(0.24_0.05_80)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Enroll Today <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="mailto:hello@bechnaseekho.com"
                  className="inline-flex items-center gap-2 rounded-xl glass-dark px-6 py-3.5 text-sm font-bold text-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Talk to Counselor
                </a>
              </div>

              <p className="mt-5 text-xs font-semibold text-muted-foreground">
                No-cost EMI available · Seats filling for this batch
              </p>
            </div>

            {/* Assurance panel */}
            <div className="glass-dark rounded-[28px] p-6 sm:p-7">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                What you get on day one
              </p>
              <ul className="mt-4 space-y-3">
                {assurances.map((a) => (
                  <li key={a.label} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient text-primary-foreground">
                      <a.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-bold text-foreground">{a.label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border/60 pt-5 text-center">
                {[
                  { value: 95, suffix: "%", label: "Placement" },
                  { value: 4.9, suffix: "", label: "Rating", decimals: 1 },
                  { value: 10, suffix: "", label: "Programmes" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-black tracking-tight text-foreground">
                      <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

