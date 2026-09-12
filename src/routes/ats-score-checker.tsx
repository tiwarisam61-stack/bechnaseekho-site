import { useCallback, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { Toaster, toast } from "sonner";
import {
    Lock,
    Sparkles,
    ShieldCheck,
    RefreshCw,
    ArrowUpRight,
    UploadCloud,
    Check,
    FileCheck2,
    Download,
    ArrowLeft,
} from "lucide-react";

import { analyzeResume, optimizeResume, applySuggestions } from "@/lib/ats.functions";
import { extractResumeText, ResumeError } from "@/lib/resume-extract";
import { scoreRating, type AtsAnalysis, type AtsOptimization } from "@/lib/ats.schema";

import { TrustSection } from "@/components/ats/TrustSection";
import { AmbientScene } from "@/components/ats/AmbientScene";
import { HeroDashboard } from "@/components/ats/HeroDashboard";
import { HowItWorks } from "@/components/ats/HowItWorks";
import { FeatureBento } from "@/components/ats/FeatureBento";
import { StatsBand } from "@/components/ats/StatsBand";
import { Testimonials } from "@/components/ats/Testimonials";
import { FinalCta } from "@/components/ats/FinalCta";
import { AnalyticsCharts } from "@/components/ats/AnalyticsCharts";
import { UploadCard } from "@/components/ats/UploadCard";
import { ScanTimeline } from "@/components/ats/ScanTimeline";
import { ScoreGauge } from "@/components/ats/ScoreGauge";
import { ParsedProfile } from "@/components/ats/ParsedProfile";
import { MetricsReport } from "@/components/ats/MetricsReport";
import { RecruiterFeedback } from "@/components/ats/RecruiterFeedback";
import { Suggestions } from "@/components/ats/Suggestions";
import { AppliedChanges, type AppliedChange } from "@/components/ats/AppliedChanges";
import { OptimizerPanel } from "@/components/ats/OptimizerPanel";
import { DownloadCenter } from "@/components/ats/DownloadCenter";
import { Confetti } from "@/components/ats/Confetti";
import { BackToTop } from "@/components/ats/BackToTop";
import { StickyScore } from "@/components/ats/StickyScore";
import { generateReport } from "@/lib/pdf-report";
import { getSharedResumeUploadUserId, uploadSharedCareerSyncResume } from "@/lib/careersync-jobs-api";

export const Route = createFileRoute("/ats-score-checker")({
    head: () => ({
        meta: [
            { title: "ATS Score Checker | CareerSync by BechnaSeekho" },
            {
                name: "description",
                content:
                    "Upload your resume for an instant AI ATS score, recruiter insights, keyword analysis and one-click AI optimization. Free, secure and private.",
            },
            { property: "og:title", content: "ATS Score Checker | CareerSync" },
            {
                property: "og:description",
                content:
                    "Instant AI-powered ATS resume analysis: score, formatting review, keyword optimization and downloadable PDF reports.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
        ],
    }),
    component: AtsScoreCheckerPage,
});

type Stage = "idle" | "reading" | "analyzing" | "ready";

const HERO_PROOF = ["Trusted by professionals", "AI powered", "ATS optimized", "Instant report"];

function AtsScoreCheckerPage() {
    const navigate = useNavigate();
    const analyze = useServerFn(analyzeResume);
    const optimize = useServerFn(optimizeResume);
    const applyFix = useServerFn(applySuggestions);

    const [stage, setStage] = useState<Stage>("idle");
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<{ message: string; hint: string } | null>(null);
    const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
    const [optimization, setOptimization] = useState<AtsOptimization | null>(null);
    const [optimizedAnalysis, setOptimizedAnalysis] = useState<AtsAnalysis | null>(null);
    const [optimizing, setOptimizing] = useState(false);
    const [applyingTitle, setApplyingTitle] = useState<string | null>(null);
    const [appliedTitles, setAppliedTitles] = useState<string[]>([]);
    const [appliedChanges, setAppliedChanges] = useState<AppliedChange[]>([]);
    const [liveResume, setLiveResume] = useState("");
    const [celebrate, setCelebrate] = useState(false);
    const [applying, setApplying] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [history, setHistory] = useState<
        {
            resumeText: string;
            analysis: AtsAnalysis | null;
            optimization: AtsOptimization | null;
            appliedTitles: string[];
            appliedChanges: AppliedChange[];
            liveResume: string;
        }[]
    >([]);
    const resumeText = useRef<string>("");

    const busy = stage === "reading" || stage === "analyzing";
    const current = optimizedAnalysis ?? analysis;

    const failure = (message: string, hint: string) => {
        setError({ message, hint });
        setStage("idle");
    };

    const runAnalysis = useCallback(
        async (text: string) => {
            setStage("analyzing");
            try {
                const result = await analyze({ data: { resumeText: text } });
                setAnalysis(result);
                setStage("ready");
                if (result.overallScore > 90) setCelebrate(true);
                toast.success("Analysis complete", {
                    description: `Your ATS score is ${Math.round(result.overallScore)}/100 — ${scoreRating(result.overallScore).label}.`,
                });
            } catch (e) {
                const msg = e instanceof Error ? e.message : "";
                failure(
                    "The AI analysis didn't finish",
                    /fetch|network|Failed/i.test(msg)
                        ? "Your connection dropped or the request timed out. Your resume is still loaded — just press Try again."
                        : "Something went wrong on our side. Press Try again — your uploaded resume was kept.",
                );
            }
        },
        [analyze],
    );

    const reset = useCallback(() => {
        setError(null);
        setAnalysis(null);
        setOptimization(null);
        setOptimizedAnalysis(null);
        setAppliedTitles([]);
        setAppliedChanges([]);
        setLiveResume("");
        setCelebrate(false);
    }, []);

    const handleFile = useCallback(
        async (file: File) => {
            reset();
            setFileName(file.name);
            setStage("reading");
            try {
                await uploadSharedCareerSyncResume({
                    userId: getSharedResumeUploadUserId("ats-score-checker"),
                    file,
                });
                const text = await extractResumeText(file);
                resumeText.current = text;
                await runAnalysis(text);
            } catch (e) {
                if (e instanceof ResumeError) failure(e.message, e.hint);
                else
                    failure(
                        "We couldn't read that resume",
                        "Please upload a text-based PDF, DOC or DOCX file under 5 MB and try again.",
                    );
            }
        },
        [reset, runAnalysis],
    );

    const openPicker = useRef<(() => void) | null>(null);
    const registerOpen = useCallback((open: () => void) => {
        openPicker.current = open;
    }, []);

    const retry = useCallback(() => {
        setError(null);
        if (resumeText.current) void runAnalysis(resumeText.current);
    }, [runAnalysis]);

    const handleOptimize = useCallback(async () => {
        if (!analysis || !resumeText.current) return;
        setOptimizing(true);
        setError(null);
        try {
            const focus = [
                ...analysis.suggestions.map((s) => s.title),
                ...analysis.recruiter.weaknesses,
                ...analysis.recruiter.missingKeywords.slice(0, 8),
            ].slice(0, 25);
            const opt = await optimize({ data: { resumeText: resumeText.current, focus } });
            setOptimization(opt);
            const reAnalysis = await analyze({ data: { resumeText: opt.optimizedResume } });
            setOptimizedAnalysis(reAnalysis);
            if (reAnalysis.overallScore > 90) setCelebrate(true);
            toast.success("Resume optimized and re-analyzed", {
                description: `New ATS score: ${Math.round(reAnalysis.overallScore)}/100.`,
            });
        } catch {
            failure(
                "The AI optimizer didn't finish",
                "Nothing was lost — your original analysis is still here. Press Optimize Resume with AI to try again.",
            );
            setStage("ready");
        } finally {
            setOptimizing(false);
        }
    }, [analysis, analyze, optimize]);

    const commitResume = useCallback(
        async (
            text: string,
            titles: string[],
            improvements: { area: string; change: string }[],
            nextOptimization?: AtsOptimization,
        ) => {
            const prevScore = Math.round((optimizedAnalysis ?? analysis)?.overallScore ?? 0);
            const reAnalysis = await analyze({ data: { resumeText: text } });
            const newScore = Math.round(reAnalysis.overallScore);
            setHistory((h) => [
                ...h,
                {
                    resumeText: resumeText.current,
                    analysis: optimizedAnalysis,
                    optimization,
                    appliedTitles,
                    appliedChanges,
                    liveResume,
                },
            ]);
            resumeText.current = text;
            setLiveResume(text);
            setOptimization(
                nextOptimization ?? { optimizedResume: text, improvements, recommendedAdditions: [] },
            );
            setOptimizedAnalysis(reAnalysis);
            setAppliedTitles((prev) => [...prev, ...titles]);
            setAppliedChanges((prev) => [
                ...prev,
                ...improvements.slice(0, 4).map((imp, idx) => ({
                    title: titles[0] ?? "AI improvement",
                    area: imp.area,
                    change: imp.change,
                    delta: idx === 0 ? newScore - prevScore : 0,
                    score: newScore,
                })),
            ]);
            if (newScore > prevScore) {
                setCelebrate(true);
                window.setTimeout(() => setCelebrate(false), 2600);
            }
            toast.success(`Applied: ${titles[0] ?? "improvements"}`, {
                description: `Your ATS score is now ${newScore}/100 (${newScore - prevScore >= 0 ? "+" : ""}${newScore - prevScore}).`,
            });
        },
        [analysis, analyze, appliedChanges, appliedTitles, liveResume, optimization, optimizedAnalysis],
    );

    const handleApplySuggestion = useCallback(
        async (s: AtsAnalysis["suggestions"][number]) => {
            if (!resumeText.current || applyingTitle) return;
            setApplyingTitle(s.title);
            setError(null);
            const toastId = toast.loading(`Applying "${s.title}"`, {
                description: "Rewriting your resume, then running a fresh ATS check…",
            });
            try {
                const opt = await applyFix({
                    data: { resumeText: resumeText.current, suggestions: [{ title: s.title, how: s.how }] },
                });
                await commitResume(opt.optimizedResume, [s.title], opt.improvements ?? [], opt);
                toast.dismiss(toastId);
            } catch {
                toast.error("That fix couldn't be applied", {
                    id: toastId,
                    description: "Your resume and score were not changed. Please try again.",
                });
            } finally {
                setApplyingTitle(null);
            }
        },
        [applyFix, applyingTitle, commitResume],
    );

    const undoLast = useCallback(() => {
        setHistory((h) => {
            const last = h[h.length - 1];
            if (!last) return h;
            resumeText.current = last.resumeText;
            setOptimizedAnalysis(last.analysis);
            setOptimization(last.optimization);
            setAppliedTitles(last.appliedTitles);
            setAppliedChanges(last.appliedChanges);
            setLiveResume(last.liveResume);
            toast.info("Change undone", { description: "Your resume and ATS score were restored." });
            return h.slice(0, -1);
        });
    }, []);

    const applyAll = useCallback(async () => {
        const remaining = (current?.suggestions ?? []).filter((s) => !appliedTitles.includes(s.title));
        if (!remaining.length || !resumeText.current) return;
        setApplying(true);
        try {
            const opt = await applyFix({
                data: {
                    resumeText: resumeText.current,
                    suggestions: remaining.map((s) => ({ title: s.title, how: s.how })),
                },
            });
            await commitResume(
                opt.optimizedResume,
                remaining.map((s) => s.title),
                opt.improvements ?? [],
                opt,
            );
        } catch {
            toast.error("We couldn't apply every fix", { description: "Your resume is unchanged." });
        } finally {
            setApplying(false);
        }
    }, [appliedTitles, applyFix, commitResume, current?.suggestions]);

    const downloadReport = useCallback(async () => {
        if (!analysis) return;
        setDownloading(true);
        try {
            await generateReport("complete", { analysis, optimization, optimizedAnalysis });
            toast.success("Your report is downloading", {
                description: "2-page executive report, print-ready.",
            });
        } catch {
            toast.error("We couldn't create that PDF", { description: "Please try the download again." });
        } finally {
            setDownloading(false);
        }
    }, [analysis, optimization, optimizedAnalysis]);

    const showMarketing = !analysis && !busy;
    const uploadNow = () => openPicker.current?.();

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-center" richColors />
            <Confetti active={celebrate} />
            <BackToTop />
            {analysis && current && !busy && (
                <StickyScore
                    score={current.overallScore}
                    delta={current.overallScore - analysis.overallScore}
                    busy={downloading}
                    onDownload={downloadReport}
                />
            )}

            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => navigate({ to: "/careersync" })}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted"
                            aria-label="Back to CareerSync"
                        >
                            <ArrowLeft className="size-5" aria-hidden="true" />
                        </button>
                        <a href="#top" className="flex min-w-0 items-center gap-3">
                            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"><RefreshCw className="size-5" aria-hidden="true" /></span>
                            <span className="leading-tight"><span className="block text-lg font-extrabold tracking-tight text-foreground">Career<span className="text-primary">Sync</span></span><span className="block text-xs font-medium text-muted-foreground">By BechnaSeekho</span></span>
                        </a>
                    </div>

                    <nav
                        aria-label="Sections"
                        className="hidden items-center gap-1 rounded-full bg-muted/60 p-1.5 text-sm font-medium text-muted-foreground lg:flex"
                    >
                        <a
                            href="#top"
                            className="rounded-full bg-background px-5 py-2 font-semibold text-foreground shadow-sm"
                        >
                            Home
                        </a>
                        <a href="#how" className="rounded-full px-5 py-2 transition-colors hover:text-foreground">
                            How it works
                        </a>
                        <a href="#features" className="rounded-full px-5 py-2 transition-colors hover:text-foreground">
                            What you get
                        </a>
                        <a href="#reviews" className="rounded-full px-5 py-2 transition-colors hover:text-foreground">
                            Reviews
                        </a>
                    </nav>

                    <button
                        type="button"
                        onClick={analysis && !busy ? downloadReport : uploadNow}
                        disabled={busy || optimizing || downloading}
                        className="ripple inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-[1.04] disabled:opacity-60 sm:px-5 sm:text-sm"
                    >
                        {analysis && !busy ? (
                            <>
                                <Download className="size-4" aria-hidden="true" />
                                Download report
                            </>
                        ) : (
                            <>
                                <UploadCloud className="size-4" aria-hidden="true" />
                                Upload resume
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main id="top" className="relative overflow-x-clip">
                <AmbientScene />

                <section className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pb-16 sm:pt-24">
                    <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
                        <div className="text-center lg:text-left">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-bold text-primary backdrop-blur-md"
                            >
                                <Sparkles className="size-3.5" aria-hidden="true" />
                                AI ATS engine · 20 checks · 8 second scan
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                                className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl"
                            >
                                Analyze your resume
                                <span className="mt-1 block text-gradient">like top recruiters</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                                className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
                            >
                                Upload your resume and instantly receive an AI-powered ATS score, keyword analysis,
                                recruiter insights, formatting checks, missing skills and personalized
                                recommendations — then apply every fix in one click.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
                            >
                                <button
                                    type="button"
                                    onClick={uploadNow}
                                    disabled={busy || optimizing}
                                    className="ripple inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-[1.04] active:scale-95 disabled:opacity-60 sm:text-base"
                                >
                                    <UploadCloud className="size-5" aria-hidden="true" />
                                    Upload Resume
                                </button>
                            </motion.div>

                            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs font-semibold text-muted-foreground lg:justify-start sm:text-sm">
                                {HERO_PROOF.map((p) => (
                                    <li key={p} className="inline-flex items-center gap-1.5">
                                        <Check className="size-4 text-success" aria-hidden="true" />
                                        {p}
                                    </li>
                                ))}
                            </ul>

                            <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                <FileCheck2 className="size-3.5" aria-hidden="true" />
                                PDF &amp; DOCX · max 5 MB · no account needed
                            </p>
                        </div>

                        <div className="relative px-2 py-6">
                            <HeroDashboard />
                        </div>
                    </div>
                </section>

                <div className="relative z-10 mx-auto max-w-7xl space-y-20 px-4 pb-20 sm:space-y-28 sm:px-6 sm:pb-28">
                    <section id="upload" className="mx-auto max-w-3xl scroll-mt-24">
                        <div className="mb-7 text-center">
                            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                Start with your current resume
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                One upload runs the full analysis. Nothing is saved, nothing is shared, and you never
                                create an account.
                            </p>
                        </div>
                        <UploadCard
                            onFile={handleFile}
                            registerOpen={registerOpen}
                            busy={busy || optimizing}
                            fileName={fileName}
                            uploaded={Boolean(fileName) && !error}
                            error={error}
                            onRetry={retry}
                        />

                        <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground">
                            <Lock className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
                            Your resume is securely processed using encrypted AI analysis. CareerSync never shares
                            or sells your personal information.
                        </p>
                    </section>

                    {busy && (
                        <div className="mx-auto max-w-5xl">
                            <ScanTimeline
                                finished={false}
                                label={stage === "reading" ? "Reading your resume" : "Running intelligent ATS analysis"}
                            />
                        </div>
                    )}

                    {optimizing && (
                        <div className="mx-auto max-w-5xl">
                            <ScanTimeline finished={false} label="Optimizing and re-analyzing your resume" />
                        </div>
                    )}

                    {analysis && current && !busy && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-10"
                        >
                            <section aria-labelledby="score-heading" className="surface-card p-6 sm:p-10">
                                <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
                                    <div className="flex justify-center">
                                        <ScoreGauge score={current.overallScore} />
                                    </div>
                                    <div>
                                        <h2 id="score-heading" className="text-2xl font-extrabold text-foreground sm:text-3xl">
                                            Your ATS score is {Math.round(current.overallScore)} / 100
                                        </h2>
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                            {current.scoreMeaning}
                                        </p>
                                        <p className="mt-4 rounded-2xl bg-primary-soft p-4 text-sm leading-relaxed text-foreground">
                                            {current.executiveSummary}
                                        </p>
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-bold text-success-foreground">
                                                <ShieldCheck className="size-3.5" aria-hidden="true" />
                                                {scoreRating(current.overallScore).label} rating
                                            </span>
                                            {optimizedAnalysis && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent-foreground">
                                                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                                                    +{Math.max(0, Math.round(optimizedAnalysis.overallScore - analysis.overallScore))}{" "}
                                                    points after AI optimization
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <AnalyticsCharts analysis={current} />
                            <ParsedProfile profile={current.profile} />
                            <MetricsReport metrics={current.metrics} />
                            <RecruiterFeedback analysis={current} />
                            <Suggestions
                                suggestions={current.suggestions}
                                appliedTitles={appliedTitles}
                                applyingTitle={applyingTitle}
                                onApply={handleApplySuggestion}
                            />
                            <AppliedChanges changes={appliedChanges} resumeText={liveResume} />

                            <OptimizerPanel
                                before={analysis}
                                after={optimizedAnalysis}
                                optimization={optimization}
                                busy={optimizing}
                                onOptimize={handleOptimize}
                            />

                            <DownloadCenter data={{ analysis, optimization, optimizedAnalysis }} />

                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStage("idle");
                                        reset();
                                        setFileName(null);
                                        resumeText.current = "";
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="ripple inline-flex items-center gap-2 rounded-full border border-border bg-background px-7 py-4 text-sm font-bold text-foreground shadow-sm transition-transform duration-200 hover:scale-[1.04] active:scale-95 sm:text-base"
                                >
                                    <UploadCloud className="size-5" aria-hidden="true" />
                                    Analyze Another Resume
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {showMarketing && (
                        <>
                            <TrustSection />
                            <HowItWorks />
                            <FeatureBento />
                            <StatsBand />
                            <Testimonials />
                            <FinalCta onUpload={uploadNow} />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
