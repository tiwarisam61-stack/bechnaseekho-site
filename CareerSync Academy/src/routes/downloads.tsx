import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Download,
  FileDown,
  PlayCircle,
  FileSpreadsheet,
  Loader2,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { courses } from "@/lib/courses";
import type { BrochureKind } from "@/lib/brochure";
import { CourseThumbnail } from "@/components/course-thumbnail";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Download Centre — Brochures, Videos & Resources | CareerSync" },
      {
        name: "description",
        content:
          "Download CareerSync brochures, course syllabi, placement reports, training calendars and watch free preview lessons — all resources in one premium hub.",
      },
      { property: "og:title", content: "CareerSync Download Centre" },
      {
        property: "og:description",
        content: "Premium PDFs, free preview videos and career templates in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DownloadsPage,
});

const pdfs: { kind: BrochureKind; title: string; desc: string; pages: string }[] = [
  { kind: "catalog", title: "Course Catalog 2026", desc: "All 10 programmes, fees and outcomes", pages: "A4 · 3 pages" },
  { kind: "company", title: "Company Profile", desc: "Who we are, mentors and methodology", pages: "A4 · 3 pages" },
  { kind: "placement", title: "Placement Report", desc: "Salary data, partners and success rates", pages: "A4 · 3 pages" },
  { kind: "calendar", title: "Training Calendar", desc: "Upcoming batches and live schedules", pages: "A4 · 3 pages" },
  { kind: "pricing", title: "Pricing Guide", desc: "Fee structure, EMI plans and offers", pages: "A4 · 3 pages" },
];

const tabs = ["All resources", "Brochures & PDFs", "Preview videos", "Syllabus library"] as const;
type Tab = (typeof tabs)[number];

function DownloadsPage() {
  const [tab, setTab] = useState<Tab>("All resources");
  const [busy, setBusy] = useState<string | null>(null);

  const videoCourses = useMemo(() => courses.slice(0, 6), []);

  const download = async (kind: BrochureKind, courseId?: string) => {
    const key = kind + (courseId ?? "");
    setBusy(key);
    try {
      const { generatePdf } = await import("@/lib/brochure");
      const course = courseId ? courses.find((c) => c.id === courseId) : undefined;
      await generatePdf(kind, courses, course);
      toast.success("Your premium PDF is downloading");
    } catch {
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const show = (t: Tab) => tab === "All resources" || tab === t;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden deep-gradient">
        <div className="absolute inset-0 grid-noise opacity-20" />
        <div className="animate-float absolute -right-20 top-4 h-72 w-72 rounded-full bg-[var(--secondary)]/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-foreground">
              <Download className="h-3.5 w-3.5 text-secondary" /> Download centre
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.06] tracking-tight text-foreground sm:text-5xl">
              Every resource you need,
              <span className="block accent-text">one click away.</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Premium print-ready brochures, per-course syllabi, free preview lessons and career
              templates — generated live, always up to date.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={`rounded-full px-4 py-2.5 text-xs font-black transition-all duration-200 ${
                    tab === t
                      ? "brand-gradient text-primary-foreground soft-shadow"
                      : "glass-dark text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PDFs */}
      {show("Brochures & PDFs") ? (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              <FileDown className="h-3.5 w-3.5" /> Brochures & PDFs
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Print-ready corporate documents
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Each PDF ships with a premium cover, contents page, curriculum tables, placement data
              and a scannable QR code.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pdfs.map((b, i) => (
              <Reveal key={b.kind} delay={i * 70}>
                <div className="glass-card gradient-frame hover-lift flex h-full flex-col overflow-hidden rounded-3xl p-2.5">
                  <div className="relative overflow-hidden rounded-2xl deep-gradient p-5">
                    <div className="absolute inset-0 grid-noise opacity-25" />
                    <div className="relative flex h-32 flex-col justify-between">
                      <span className="inline-flex w-fit rounded-full gold-gradient px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[oklch(0.24_0.05_80)]">
                        Premium PDF
                      </span>
                      <div>
                        <p className="text-lg font-black leading-tight text-foreground">{b.title}</p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {b.pages}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                    <button
                      type="button"
                      onClick={() => download(b.kind)}
                      disabled={busy === b.kind}
                      className="btn-glow ripple mt-auto inline-flex items-center justify-center gap-2 rounded-xl brand-gradient px-4 py-3 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-70"
                    >
                      {busy === b.kind ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileDown className="h-4 w-4" />
                      )}
                      Download PDF
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Videos */}
      {show("Preview videos") ? (
        <section className="border-y border-border/60 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <Reveal className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
                <PlayCircle className="h-3.5 w-3.5" /> Preview videos
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Watch a free lesson before you enrol
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Opening lessons from six flagship programmes — full video walkthrough, notes and a
                practice drill included.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videoCourses.map((c, i) => (
                <Reveal key={c.id} delay={i * 70}>
                  <Link
                    to="/courses/$courseId"
                    params={{ courseId: c.id }}
                    className="group glass-card gradient-frame hover-lift flex h-full flex-col overflow-hidden rounded-3xl p-2.5"
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <CourseThumbnail
                        courseId={c.id}
                        category={c.category}
                        icon={c.icon}
                        title={c.title}
                        showCategory={false}
                        className="h-40 w-full"
                      />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-background/85 text-primary backdrop-blur transition-transform duration-300 group-hover:scale-110">
                          <PlayCircle className="h-7 w-7" />
                        </span>
                      </span>
                      <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-foreground/60 px-2 py-1 text-[10px] font-black text-background">
                        <Clock className="h-3 w-3" /> {c.duration}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                        {c.category} · Lesson 1
                      </p>
                      <p className="text-base font-extrabold leading-snug tracking-tight">
                        {c.chapters[0]?.title ?? c.title}
                      </p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{c.tagline}</p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-2 text-xs font-black text-primary">
                        Watch preview <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Syllabus library */}
      {show("Syllabus library") ? (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Syllabus library
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Detailed syllabus for every programme
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Chapter breakdown, projects, assessment structure and certification criteria.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-3 md:grid-cols-2">
            {courses.map((c, i) => (
              <Reveal key={c.id} delay={i * 40}>
                <div className="glass-card gradient-frame flex items-center gap-4 rounded-2xl p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                    <FileDown className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold">{c.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {c.chapters.length} chapters · {c.level} · {c.duration}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => download("course", c.id)}
                    disabled={busy === "course" + c.id}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-xs font-bold transition-colors hover:border-secondary hover:text-secondary disabled:opacity-70"
                  >
                    {busy === "course" + c.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    Syllabus
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <Reveal>
          <div className="glass-card gradient-frame flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
            <p className="inline-flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="h-4 w-4 text-accent" /> All documents are generated live — no
              email or sign-up required.
            </p>
            <Link
              to="/"
              className="btn-glow inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-black text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" /> Browse courses
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
