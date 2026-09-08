import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Route as RouteIcon,
  ShieldCheck,
  Award,
  Users,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { courses, type Course } from "@/lib/courses";
import { courseMeta } from "@/lib/course-meta";
import { useAllStats, useProgress } from "@/lib/progress";
import { CourseCard } from "@/components/course-card";
import { CourseGridSkeleton } from "@/components/course-skeleton";
import { CourseDetailModal } from "@/components/course-detail-modal";
import { Reveal, CountUp } from "@/components/reveal";
import {
  RoadmapSection,
  CategoriesSection,
  FeaturesSection,
  TestimonialsSection,
  CompaniesSection,
  PlacementSection,
  CtaSection,
} from "@/components/landing-sections";
import type { BrochureKind } from "@/lib/brochure";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium Career Courses — Build Job-Ready Skills | CareerSync" },
      {
        name: "description",
        content:
          "Master industry-ready skills with CareerSync by BechnaSeekho — live projects, certification, mock interviews and placement assistance with 100+ hiring partners.",
      },
      { property: "og:title", content: "CareerSync — Build Job-Ready Skills. Get Hired Faster." },
      {
        property: "og:description",
        content:
          "Premium ed-tech learning: 10 career programmes, live projects, certification, interview prep and placement support.",
      },
    ],
  }),
  component: Catalog,
});

const categoryOptions = [
  "All",
  "Sales",
  "Communication",
  "Interview",
  "Negotiation",
  "Insurance",
  "Business",
];
const levelOptions = ["All", "Beginner", "Intermediate", "Advanced"];
const durationOptions = ["All", "Under 6h", "6–8h", "8h+"];
const languageOptions = ["All", "English", "English + Hindi", "Hindi"];
const certOptions = ["All", "Certificate", "Live Sessions"];
const priceOptions = ["All", "Free"];
const sortOptions = ["Most Popular", "Highest Rated", "Price: Low to High", "Price: High to Low", "Newest"];

const hours = (d: string) => {
  const m = /(\d+)h/.exec(d);
  const mm = /(\d+)m/.exec(d);
  return (m ? Number(m[1]) : 0) + (mm ? Number(mm[1]) / 60 : 0);
};

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
              value === opt
                ? "brand-gradient text-primary-foreground soft-shadow"
                : "bg-muted text-muted-foreground hover:bg-primary-soft hover:text-primary"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Catalog() {
  const all = useAllStats();
  const { store, hydrated } = useProgress();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [duration, setDuration] = useState("All");
  const [language, setLanguage] = useState("All");
  const [cert, setCert] = useState("All");
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState(sortOptions[0]!);
  const [showFilters, setShowFilters] = useState(false);
  const [detail, setDetail] = useState<Course | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const activeCount = [category, level, duration, language, cert, price].filter(
    (v) => v !== "All",
  ).length;

  const clearAll = () => {
    setCategory("All");
    setLevel("All");
    setDuration("All");
    setLanguage("All");
    setCert("All");
    setPrice("All");
    setQuery("");
  };

  const download = async (kind: BrochureKind, course?: Course) => {
    setBusy(kind + (course?.id ?? ""));
    try {
      const { generatePdf } = await import("@/lib/brochure");
      await generatePdf(kind, courses, course);
      toast.success("Your premium PDF is downloading");
    } catch {
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = all.filter(({ course }) => {
      const meta = courseMeta(course);
      const h = hours(course.duration);
      const matchesQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.tagline.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.chapters.some((ch) => ch.title.toLowerCase().includes(q));
      return (
        matchesQuery &&
        (category === "All" || course.category === category) &&
        (level === "All" || course.level === level) &&
        (duration === "All" ||
          (duration === "Under 6h" && h < 6) ||
          (duration === "6–8h" && h >= 6 && h <= 8) ||
          (duration === "8h+" && h > 8)) &&
        (language === "All" || meta.language === language) &&
        (cert === "All" ||
          (cert === "Certificate" && meta.certificate) ||
          (cert === "Live Sessions" && meta.liveSessions)) &&
        (price === "All" || (price === "Free" && meta.price === 0))
      );
    });

    const sorted = [...list];
    sorted.sort((a, b) => {
      const ma = courseMeta(a.course);
      const mb = courseMeta(b.course);
      switch (sort) {
        case "Highest Rated":
          return b.course.rating - a.course.rating;
        case "Price: Low to High":
          return ma.price - mb.price;
        case "Price: High to Low":
          return mb.price - ma.price;
        case "Newest":
          return b.course.students - a.course.students ? -1 : 1;
        default:
          return b.course.students - a.course.students;
      }
    });
    return sorted;
  }, [all, query, category, level, duration, language, cert, price, sort]);

  const heroStats: {
    value: number;
    suffix: string;
    label: string;
    decimals?: number;
    star?: boolean;
  }[] = [
    { value: 1000, suffix: "+", label: "Students" },
    { value: 100, suffix: "+", label: "Hiring Partners" },
    { value: 95, suffix: "%", label: "Placement Assistance" },
    { value: 4.9, suffix: "", label: "Student Rating", decimals: 1, star: true },
  ];


  return (
    <div>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="relative overflow-hidden deep-gradient">
        <div className="absolute inset-0 grid-noise opacity-20" />
        <div className="animate-float absolute -right-24 top-6 h-80 w-80 rounded-full bg-[var(--secondary)]/30 blur-3xl" />
        <div className="animate-glow-pulse absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[var(--gold)]/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-secondary" /> Premium career learning
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Build Job-Ready Skills.
              <span className="block accent-text">Get Hired Faster.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Master industry-ready skills through practical training, live projects, interview
              preparation, and certification designed by experts.
            </p>
          </Reveal>

          <Reveal delay={230}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#courses"
                className="btn-glow ripple inline-flex items-center gap-2 rounded-xl brand-gradient px-6 py-3.5 text-sm font-black text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Explore Courses <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#roadmap"
                className="inline-flex items-center gap-2 rounded-xl glass-dark px-6 py-3.5 text-sm font-bold text-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                <RouteIcon className="h-4 w-4" /> View Learning Paths
              </a>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {[
                { icon: ShieldCheck, text: "Placement assistance included" },
                { icon: Award, text: "Industry-recognised certificate" },
                { icon: Users, text: "1:1 mentor from day one" },
                { icon: Clock, text: "Lifetime access to updates" },
              ].map((t) => (
                <span
                  key={t.text}
                  className="glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold text-foreground"
                >
                  <t.icon className="h-3.5 w-3.5 text-secondary" /> {t.text}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((s, i) => (
              <Reveal key={s.label} delay={300 + i * 80}>
                <div className="glass-dark hover-lift rounded-2xl px-4 py-5">
                  <p className="text-3xl font-black tracking-tight text-foreground">
                    <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                    {s.star ? <span className="text-[var(--gold)]">★</span> : null}
                  </p>

                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- SEARCH ------------------------------ */}
      <section id="courses" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14">
        <div className="glass-card gradient-frame sticky top-[72px] z-30 rounded-[28px] p-4 sm:p-5">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <label className="group relative flex min-w-0 items-center">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-secondary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search course, skill or instructor…"
                aria-label="Search courses"
                className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all duration-300 focus:border-secondary focus:ring-4 focus:ring-ring/15"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort courses"
                className="rounded-2xl border border-border bg-background px-3 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-ring/15"
              >
                {sortOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-3 text-xs font-bold transition-colors hover:border-secondary hover:text-secondary"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                {activeCount > 0 ? (
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-black text-primary">
                    {activeCount}
                  </span>
                ) : null}
              </button>
              {activeCount > 0 || query ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-2xl px-3 py-3 text-[11px] font-bold text-muted-foreground transition-colors hover:text-secondary"
                >
                  Clear all
                </button>
              ) : null}
            </div>
          </div>

          <div
            className={`grid overflow-hidden transition-all duration-500 ${
              showFilters ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="grid gap-4 border-t border-border/70 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                <FilterGroup label="Category" options={categoryOptions} value={category} onChange={setCategory} />
                <FilterGroup label="Level" options={levelOptions} value={level} onChange={setLevel} />
                <FilterGroup label="Duration" options={durationOptions} value={duration} onChange={setDuration} />
                <FilterGroup label="Language" options={languageOptions} value={language} onChange={setLanguage} />
                <FilterGroup label="Certification" options={certOptions} value={cert} onChange={setCert} />
                <FilterGroup label="Price" options={priceOptions} value={price} onChange={setPrice} />
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------- COURSES ---------------------------- */}
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] items-end gap-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Featured courses
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Programmes built for real hiring outcomes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Chapters, live projects, timed tests, final assessment and a certificate that unlocks
              at 100% completion.
            </p>
          </div>
          <p className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground">
            {visible.length} of {all.length} courses
          </p>
        </div>

        {!hydrated ? (
          <CourseGridSkeleton count={6} />
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map(({ course, stats }, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  percent={stats.percent}
                  chapters={stats.totalChapters}
                  index={i}
                  onDetails={setDetail}
                  onSyllabus={(c) => download("course", c)}
                />
              ))}
            </div>
            {visible.length === 0 ? (
              <p className="mt-8 rounded-3xl border border-dashed border-border p-12 text-center text-sm font-semibold text-muted-foreground">
                No courses match your filters. Try clearing a few.
              </p>
            ) : null}
          </>
        )}

        {hydrated && store.xp > 0 ? (
          <Reveal className="mt-10">
            <div className="glass-card gradient-frame flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
              <p className="text-sm font-bold">
                You have earned <span className="text-secondary">{store.xp} XP</span> with a{" "}
                {store.streak}-day learning streak.
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2.5 text-xs font-bold text-primary-foreground"
              >
                Open dashboard <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>
        ) : null}
      </section>

      <div id="roadmap" className="scroll-mt-24">
        <RoadmapSection />
      </div>
      <CategoriesSection
        onPick={(c) => {
          setQuery(c);
          document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <FeaturesSection />
      <TestimonialsSection />
      <CompaniesSection />
      <PlacementSection />
      <CtaSection />

      <CourseDetailModal
        course={detail}
        open={detail !== null}
        onOpenChange={(v) => !v && setDetail(null)}
        onSyllabus={(c) => download("course", c)}
      />
    </div>
  );
}
