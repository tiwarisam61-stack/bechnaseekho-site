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
    ArrowLeft,
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

export const Route = createFileRoute("/resume-templates")({
    head: () => ({
        meta: [
            { title: "Resume Templates — CareerSync by BechnaSeekho" },
            {
                name: "description",
                content:
                    "Browse premium ATS-friendly resume templates, upload your existing resume for AI auto-fill, and export a recruiter-ready PDF or Word file in minutes.",
            },
        ],
    }),
    component: ResumeTemplatesPage,
});

const TRUST = [
    { icon: Users, label: "50,000+ Resumes Created" },
    { icon: BadgeCheck, label: "ATS Friendly" },
    { icon: Star, label: "Recruiter Approved" },
    { icon: Bot, label: "AI Powered" },
    { icon: FileDown, label: "Instant PDF & DOCX Export" },
    { icon: MousePointerClick, label: "Easy Editing" },
];

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
        <div className={cn("overflow-hidden rounded-xl border bg-card shadow-lg", className)}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", height: 1123 * scale, width: 794 * scale }}>
                <div style={{ width: 794 }}>
                    <ResumeDocument doc={doc} watermark={false} />
                </div>
            </div>
        </div>
    );
}

function ResumeTemplatesPage() {
    const [category, setCategory] = useState<"All" | TemplateCategory>("All");
    const [query, setQuery] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [previewId, setPreviewId] = useState<string | null>(null);
    const [startId, setStartId] = useState<string | null>(null);
    const [startOpen, setStartOpen] = useState(false);
    const [autoImport, setAutoImport] = useState(false);
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

    const openImport = () => {
        setStartId(null);
        setPreviewId(null);
        setAutoImport(true);
        setStartOpen(true);
    };

    const scrollToGallery = () =>
        galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
                    <Link to="/careersync" className="flex items-center gap-2.5 group">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-blue-700 transition-colors"><ArrowLeft className="h-4 w-4" /></span>
                        <span className="text-sm font-semibold text-muted-foreground group-hover:text-blue-600 transition-colors">
                            Back to CareerSync
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/favicon.png" alt="BechnaSeekho" className="h-7 w-7 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        <span className="text-sm font-bold text-foreground">
                            Bechna<span className="text-blue-600">Seekho</span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="min-h-screen">
                {/* Hero */}
                <section className="border-b bg-gradient-to-br from-blue-50/60 to-indigo-50/40 px-4 py-14 sm:px-6 sm:py-20">
                    <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-blue-600 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5" />
                                CareerSync by BechnaSeekho
                            </span>
                            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
                                Create a Resume That{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                                    Gets Interviews
                                </span>
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Build ATS-optimized resumes, upload your existing resume, and land more interviews with CareerSync.
                            </p>
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Button size="lg" className="min-h-12 w-full sm:w-auto" onClick={() => openStart(null)}>
                                    Create Resume
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                                <Button size="lg" variant="outline" className="min-h-12 w-full sm:w-auto" onClick={openImport}>
                                    Upload Existing Resume
                                </Button>
                            </div>
                            <ul className="mt-8 flex flex-wrap gap-2">
                                {TRUST.map(({ icon: Icon, label }) => (
                                    <li key={label} className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1.5 text-xs font-medium backdrop-blur">
                                        <Icon className="h-3.5 w-3.5 text-blue-600" />
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Floating resume previews */}
                        <div className="relative mx-auto h-[300px] w-full max-w-[320px] sm:h-[380px] sm:max-w-md lg:h-[440px]">
                            <FloatingResume id="elegant-minimal" samples={samples} className="absolute left-0 top-14 w-[200px] rotate-[-8deg]" scale={0.25} />
                            <FloatingResume id="executive-suite" samples={samples} className="absolute right-0 top-4 w-[200px] rotate-[7deg]" scale={0.25} />
                            <FloatingResume id="software-engineer" samples={samples} className="absolute left-1/2 top-10 w-[250px] -translate-x-1/2 shadow-xl" scale={0.31} />
                            <div className="absolute -right-2 bottom-4 rounded-2xl border bg-card/90 px-3 py-2 shadow-lg backdrop-blur">
                                <p className="flex items-center gap-1.5 text-xs font-medium">
                                    <BadgeCheck className="h-3.5 w-3.5 text-blue-600" /> Recruiter approved
                                </p>
                            </div>
                            <div className="absolute -left-4 bottom-14 rounded-2xl border bg-card/90 p-3 shadow-lg backdrop-blur">
                                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <TrendingUp className="h-3.5 w-3.5 text-green-600" /> ATS score
                                </p>
                                <p className="text-xl font-bold text-green-600">96%</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery */}
                <section ref={galleryRef} id="templates" className="mx-auto max-w-7xl scroll-mt-6 px-4 py-12 sm:px-5 sm:py-16">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="text-2xl font-bold sm:text-4xl">Premium resume gallery</h2>
                            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                                {TEMPLATES.length} recruiter-tested layouts. Every one parses cleanly in Workday, Greenhouse and Taleo.
                            </p>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates or roles" className="pl-9" aria-label="Search templates" />
                        </div>
                    </div>

                    <div className="-mx-4 mt-6 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setCategory(c)}
                                className={cn(
                                    "min-h-10 shrink-0 snap-start rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5",
                                    category === c ? "border-transparent bg-blue-600 text-white shadow" : "bg-card text-muted-foreground hover:border-blue-400/40 hover:text-foreground",
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
                            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-foreground">
                                <Search className="h-7 w-7" />
                            </div>
                            <p className="text-lg font-semibold">No templates match that search.</p>
                            <div className="mt-2 flex gap-2">
                                <Button variant="outline" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button>
                                <Button onClick={() => openStart(null)}>Start from scratch</Button>
                            </div>
                        </div>
                    )}
                </section>

                <section className="border-t bg-muted/30">
                    <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-12 text-center sm:px-5 sm:py-16">
                        <h2 className="text-3xl font-bold">Already have a resume?</h2>
                        <p className="max-w-lg text-sm text-muted-foreground">
                            Upload a PDF or DOCX and AI fills your name, contact details, experience, skills and certifications automatically.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button className="min-h-11" onClick={openImport}>Upload &amp; auto-fill</Button>
                        </div>
                    </div>
                </section>
            </main>

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
        </div>
    );
}
