import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  FileDown,
  MousePointerClick,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TEMPLATES, CATEGORIES, type TemplateCategory } from "@/lib/templates";
import { createResume, type ResumeDoc } from "@/lib/resume-types";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { TemplateCard } from "@/components/resume/TemplateCard";
import { TemplatePreviewModal } from "@/components/resume/TemplatePreviewModal";
import { StartMethodDialog } from "@/components/resume/StartMethodDialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resume Templates — CareerSync by Bechna Seekho" },
      {
        name: "description",
        content:
          "Browse 30 premium ATS-friendly resume templates, upload your existing resume for AI auto-fill, and export a recruiter-ready PDF or Word file in under 5 minutes.",
      },
      { property: "og:title", content: "Premium ATS Resume Templates — CareerSync" },
      {
        property: "og:description",
        content:
          "An AI-powered resume design studio: premium templates, live ATS scoring, instant PDF and Word export.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TemplatesPage,
});

const TRUST = [
  { icon: Users, label: "50,000+ Resumes Created" },
  { icon: BadgeCheck, label: "ATS Friendly" },
  { icon: Star, label: "Recruiter Approved" },
  { icon: Bot, label: "AI Powered" },
  { icon: FileDown, label: "Instant PDF & DOCX Export" },
  { icon: MousePointerClick, label: "Easy Editing" },
];

function TemplatesPage() {
  const [category, setCategory] = useState<"All" | TemplateCategory>("All");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [startId, setStartId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [autoImport, setAutoImport] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const galleryRef = useRef<HTMLElement>(null);

  const samples = useMemo(
    () =>
      Object.fromEntries(
        TEMPLATES.map((t) => [
          t.id,
          { ...createResume(t.id), settings: { ...createResume(t.id).settings, accent: t.accent } },
        ]),
      ),
    [],
  );

  const filtered = TEMPLATES.filter(
    (t) =>
      (category === "All" ||
        t.category === category ||
        (category === "Photo" && Boolean(t.withPhoto)) ||
        (category === "Experienced" && (t.experienceLevel === "Senior" || t.experienceLevel === "Executive"))) &&
      (t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.blurb.toLowerCase().includes(query.toLowerCase()) ||
        t.roles.some((r) => r.toLowerCase().includes(query.toLowerCase()))),
  );

  const previewTemplate = TEMPLATES.find((t) => t.id === previewId) ?? null;

  const openStart = (id: string | null) => {
    setStartId(id);
    setPreviewId(null);
    setAutoImport(false);
    setStartOpen(true);
  };

  /** Upload Existing Resume — skips template selection and opens the file picker. */
  const openImport = () => {
    setStartId(null);
    setPreviewId(null);
    setAutoImport(true);
    setStartOpen(true);
  };

  const scrollToGallery = () =>
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-screen">
      {/* ---------------- Hero ---------------- */}
      <section
        className="relative isolate overflow-hidden border-b"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({
            x: ((e.clientX - r.left) / r.width - 0.5) * 2,
            y: ((e.clientY - r.top) / r.height - 0.5) * 2,
          });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        {/* animated gradient wash */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 animate-aurora bg-hero-aurora" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[520px] rounded-full bg-primary/15 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 -left-24 -z-10 size-[440px] rounded-full bg-brass/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-5 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-28">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium">
              <Sparkles className="size-3.5 text-brass" /> CareerSync by Bechna Seekho
            </span>
            <h1 className="mt-5 text-balance-tight text-[clamp(2rem,9vw,3rem)] font-semibold leading-[1.05] tracking-tight sm:mt-6 sm:text-6xl lg:text-[4.25rem]">
              Create a Professional Resume That{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-brass bg-clip-text text-transparent">
                Gets Interviews
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
              Build ATS-optimized resumes, improve your ATS score, upload your existing resume, and land
              more interviews with CareerSync.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" className="group min-h-12 w-full shadow-lift sm:w-auto" onClick={() => openStart(null)}>
                Create Resume
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button size="lg" variant="outline" className="min-h-12 w-full sm:w-auto" onClick={openImport}>
                Upload Existing Resume
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {TRUST.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <Icon className="size-3.5 text-primary" /> {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Animated showcase */}
          <div className="relative mx-auto h-[300px] w-full max-w-[320px] sm:h-[380px] sm:max-w-md lg:h-[460px]">
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out [transform-style:preserve-3d]"
              style={{ transform: `rotateY(${tilt.x * 6}deg) rotateX(${-tilt.y * 5}deg)` }}
            >
              <FloatingResume
                id="elegant-minimal"
                samples={samples}
                className="absolute left-0 top-14 w-[230px] rotate-[-8deg] animate-float-slow"
                scale={0.29}
              />
              <FloatingResume
                id="executive-suite"
                samples={samples}
                className="absolute right-0 top-4 w-[230px] rotate-[7deg] animate-float-slower"
                scale={0.29}
              />
              <FloatingResume
                id="software-engineer"
                samples={samples}
                className="absolute left-1/2 top-10 w-[286px] -translate-x-1/2 shadow-lift"
                scale={0.36}
              />

              <div className="absolute -left-4 bottom-14 animate-float-slower rounded-2xl border bg-card/85 p-3 shadow-lift backdrop-blur">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <TrendingUp className="size-3.5 text-success" /> ATS score
                </p>
                <p className="text-2xl font-semibold tabular-nums text-success">96%</p>
              </div>
              <div className="absolute -right-2 bottom-4 animate-float-slow rounded-2xl border bg-card/85 px-3 py-2 shadow-lift backdrop-blur">
                <p className="flex items-center gap-1.5 text-[11px] font-medium">
                  <BadgeCheck className="size-3.5 text-primary" /> Recruiter approved
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Gallery ---------------- */}
      <section ref={galleryRef} id="templates" className="mx-auto max-w-7xl scroll-mt-6 px-4 py-12 sm:px-5 sm:py-16">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-4xl">Premium resume gallery</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {TEMPLATES.length} recruiter-tested layouts. Every one parses cleanly in Workday, Greenhouse
              and Taleo.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates or roles"
              className="pl-9"
              aria-label="Search templates"
            />
          </div>
        </div>

        <div className="-mx-4 mt-6 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "min-h-10 shrink-0 snap-start rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5",
                category === c
                  ? "border-transparent bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              sample={samples[t.id]}
              favorite={favorites.includes(t.id)}
              onToggleFavorite={() =>
                setFavorites((f) => (f.includes(t.id) ? f.filter((x) => x !== t.id) : [...f, t.id]))
              }
              onPreview={() => setPreviewId(t.id)}
              onUse={() => openStart(t.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <Search className="size-7" />
            </div>
            <p className="text-lg">No templates match that search.</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Choose a premium template or start from scratch — you can switch templates any time inside
              the editor.
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Clear filters
              </Button>
              <Button onClick={() => openStart(null)}>Start from scratch</Button>
            </div>
          </div>
        )}
      </section>



      <section className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-12 text-center sm:px-5 sm:py-16">
          <h2 className="text-3xl">Already have a resume?</h2>
          <p className="max-w-lg text-sm text-muted-foreground">
            Upload a PDF or DOCX and AI fills your name, contact details, experience, skills, projects
            and certifications automatically — with a confidence score beside every field.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="min-h-11" onClick={openImport}>Upload &amp; auto-fill</Button>
            <Button variant="outline" className="min-h-11" asChild>
              <Link to="/builder" search={{ t: "blue-corporate" }}>
                Open the editor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <TemplatePreviewModal
        template={previewTemplate}
        sample={previewTemplate ? samples[previewTemplate.id] : null}
        open={Boolean(previewId)}
        onOpenChange={(v) => !v && setPreviewId(null)}
        onUse={() => previewTemplate && openStart(previewTemplate.id)}
      />
      <StartMethodDialog
        templateId={startId}
        open={startOpen}
        onOpenChange={setStartOpen}
        autoImport={autoImport}
        onBrowseTemplates={scrollToGallery}
      />
    </main>
  );
}

function FloatingResume({
  id,
  samples,
  className,
  scale,
}: {
  id: string;
  samples: Record<string, ResumeDoc>;
  className?: string;
  scale: number;
}) {
  const doc = samples[id];
  if (!doc) return null;
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-lift", className)}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", height: 1123 * scale, width: 794 * scale }}>
        <div style={{ width: 794 }}>
          <ResumeDocument doc={doc} watermark={false} />
        </div>
      </div>
    </div>
  );
}
