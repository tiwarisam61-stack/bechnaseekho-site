import { useState } from "react";
import { FileText, FileCheck2, FileBarChart2, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { generateReport, type ReportKind, type ReportData } from "@/lib/pdf-report";

const OPTIONS: {
  kind: ReportKind;
  title: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    kind: "ats",
    title: "Download ATS Report",
    description: "2-page executive report: score, breakdown, strengths and action plan.",
    icon: FileBarChart2,
  },
  {
    kind: "resume",
    title: "Download Optimized Resume",
    description: "AI-rewritten, ATS-safe resume ready to submit.",
    icon: FileCheck2,
  },
  {
    kind: "complete",
    title: "Download Complete Analysis",
    description: "Executive report with keyword intelligence and potential score.",
    icon: FileText,
  },
];

export function DownloadCenter({ data }: { data: ReportData }) {
  const [pending, setPending] = useState<ReportKind | null>(null);

  const handle = async (kind: ReportKind) => {
    if (kind === "resume" && !data.optimization) {
      toast.info("Apply a fix or optimize your resume first", {
        description: "Your updated resume will be ready to download after the new ATS check finishes.",
      });
      return;
    }
    setPending(kind);
    try {
      await generateReport(kind, data);
      toast.success("Your PDF is downloading", { description: "Executive-grade, print-ready and under 2 MB." });
    } catch {
      toast.error("We couldn't create that PDF", { description: "Please try the download again." });
    } finally {
      setPending(null);
    }
  };

  return (
    <section aria-labelledby="download-heading" className="surface-card p-6 sm:p-8">
      <header className="mb-6">
        <h2 id="download-heading" className="text-xl font-bold text-foreground sm:text-2xl">
          Download center
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every export is a designed CareerSync by BechnaSeekho report — concise, A4 print-ready and shareable.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        {OPTIONS.map(({ kind, title, description, icon: Icon }) => (
          <button
            key={kind}
            type="button"
            onClick={() => handle(kind)}
            disabled={pending !== null}
            className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-border bg-background/60 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] disabled:opacity-70"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
              {pending === kind ? (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <Icon className="size-5" aria-hidden="true" />
              )}
            </span>
            <span className="text-base font-bold text-foreground">{title}</span>
            <span className="text-sm text-muted-foreground">{description}</span>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-primary">
              <Download className="size-4" aria-hidden="true" />
              PDF download
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
