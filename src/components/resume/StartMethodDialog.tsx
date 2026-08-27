import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  FileUp,
  PenLine,
  LayoutGrid,
  Loader2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createResume, requiredFieldIssues } from "@/lib/resume-types";
import { saveResume } from "@/lib/resume-store";
import { extractResumeText, RESUME_ACCEPT } from "@/lib/file-text";
import { applyParsedResume, type ImportResult } from "@/lib/resume-import";
import { aiParseResume } from "@/lib/ai.functions";
import { analyzeResume } from "@/lib/ats";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;

const STEPS = ["Reading resume…", "Extracting information…", "Checking ATS score…", "Resume ready"];

export function StartMethodDialog({
  templateId,
  open,
  onOpenChange,
  onBrowseTemplates,
  autoImport = false,
}: {
  templateId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBrowseTemplates?: () => void;
  /** Skip the choice screen and open the file picker immediately. */
  autoImport?: boolean;
}) {
  const parse = useServerFn(aiParseResume);
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<"choose" | "working" | "review">("choose");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [ats, setAts] = useState<number | null>(null);

  const reset = () => {
    setStage("choose");
    setStep(0);
    setResult(null);
    setAts(null);
  };

  useEffect(() => {
    if (open && autoImport && stage === "choose") inputRef.current?.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoImport]);

  const showUnavailable = () => {
    toast.info("Resume editor is coming soon. Your selected resume setup was saved.");
  };

  const startBlank = () => {
    const doc = createResume(templateId ?? "blue-corporate", true);
    saveResume(doc);
    onOpenChange(false);
    reset();
    showUnavailable();
  };

  const startTemplate = () => {
    if (!templateId) {
      onOpenChange(false);
      reset();
      onBrowseTemplates?.();
      return;
    }
    const doc = createResume(templateId);
    saveResume(doc);
    onOpenChange(false);
    reset();
    showUnavailable();
  };

  const handleFile = async (file: File) => {
    if (file.size > MAX_BYTES) {
      toast.error("File is larger than 5 MB. Please upload a smaller resume.");
      return;
    }
    setStage("working");
    try {
      setStep(0);
      const text = await extractResumeText(file);
      if (text.trim().length < 40) throw new Error("We couldn't find selectable text in that file.");
      setStep(1);
      const res = await parse({ data: { text, fileName: file.name } });
      const imported = applyParsedResume(createResume(templateId ?? "blue-corporate", true), res.json);
      imported.doc.name = "Imported Resume";
      setStep(2);
      setAts(analyzeResume(imported.doc).overall);
      setResult(imported);
      setStep(3);
      setStage("review");
    } catch (error) {
      setStage("choose");
      toast.error(error instanceof Error ? error.message : "Import failed. Please try again.");
    }
  };

  const openEditor = () => {
    if (!result) return;
    saveResume(result.doc);
    onOpenChange(false);
    reset();
    showUnavailable();
  };

  const missing = result ? requiredFieldIssues(result.doc) : [];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-3xl sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {stage === "review"
              ? "Your resume is ready to edit"
              : autoImport
                ? "Import your existing resume"
                : "How would you like to start?"}
          </DialogTitle>
          <DialogDescription>
            {stage === "review"
              ? "Nothing is final — every extracted detail can be edited or removed in the editor."
              : autoImport
                ? "Choose a PDF, DOC or DOCX — we parse it, score it against ATS rules and open the editor."
                : "Three ways in. Every path lands in the same studio with live ATS scoring."}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={inputRef}
          type="file"
          accept={RESUME_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void handleFile(file);
          }}
        />

        {stage === "choose" &&
          (autoImport ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center gap-3 rounded-3xl border border-dashed p-10 text-center transition hover:border-primary/50 hover:bg-primary/[0.03]"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <FileUp className="size-6" />
              </span>
              <span className="text-lg font-medium">Select your resume file</span>
              <span className="text-sm text-muted-foreground">PDF, DOC or DOCX · up to 5 MB</span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Choose file <ArrowRight className="size-3.5" />
              </span>
            </button>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <StartCard
                icon={<LayoutGrid className="size-5" />}
                title="Browse Premium Templates"
                body="Browse professionally designed ATS-friendly resume templates."
                cta={templateId ? "Use this template" : "Browse Templates"}
                onClick={startTemplate}
                highlight
              />
              <StartCard
                icon={<PenLine className="size-5" />}
                title="Create Blank Resume"
                body="Start with a blank canvas and build your resume from scratch."
                cta="Create Resume"
                onClick={startBlank}
              />
              <StartCard
                icon={<FileUp className="size-5" />}
                title="Import Existing Resume"
                body="Already have a resume? Import your PDF or DOCX and continue editing."
                cta="Import Resume"
                onClick={() => inputRef.current?.click()}
              />
            </div>
          ))}


        {stage === "working" && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <span className="relative grid size-14 place-items-center rounded-full brass-surface">
                <Loader2 className="size-6 animate-spin" />
              </span>
            </div>
            <ol className="w-full max-w-sm space-y-2.5">
              {STEPS.map((label, i) => (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-all duration-300",
                    i < step && "border-success/40 bg-success/5 text-success",
                    i === step && "border-primary/50 bg-primary/5 font-medium",
                    i > step && "opacity-50",
                  )}
                >
                  {i < step ? (
                    <CheckCircle2 className="size-4 shrink-0" />
                  ) : i === step ? (
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                  ) : (
                    <span className="size-4 shrink-0 rounded-full border" />
                  )}
                  {label}
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground">Your file is processed securely and never shared.</p>
          </div>
        )}

        {stage === "review" && result && (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-2xl border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4 text-brass" />
                {result.doc.profile.fullName || "Imported Resume"}
              </div>
              <div className="mt-3 grid gap-2.5">
                {result.confidence.map((c) => (
                  <div key={c.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className={cn("truncate", !c.found && "text-muted-foreground")}>{c.label}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {c.found ? `${c.value}%` : "not found"}
                        </span>
                      </div>
                      <Progress value={c.found ? c.value : 0} className="mt-1 h-1.5" />
                    </div>
                    {c.found && c.value >= 90 ? (
                      <CheckCircle2 className="size-4 shrink-0 text-success" />
                    ) : (
                      <span className="size-4 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border bg-card p-4 text-center shadow-soft">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">ATS score</p>
                <p className="mt-1 text-4xl font-semibold tabular-nums">{ats ?? "—"}</p>
                <Progress value={ats ?? 0} className="mt-2 h-1.5" />
              </div>
              <div className="rounded-2xl border bg-card p-3 text-xs shadow-soft">
                <p className="font-semibold">Missing essentials</p>
                {missing.length === 0 ? (
                  <p className="mt-1 text-success">All required fields found.</p>
                ) : (
                  <ul className="mt-1 space-y-0.5 text-muted-foreground">
                    {missing.map((m) => (
                      <li key={m}>• {m}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" /> You control every field before export.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={reset}>
                  Upload a different file
                </Button>
                <Button onClick={openEditor}>
                  Open in editor <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StartCard({
  icon,
  title,
  body,
  cta,
  onClick,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-card p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift",
        highlight && "border-primary/40 bg-primary/[0.04]",
      )}
    >
      <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">{icon}</span>
      <h3 className="mt-4 text-lg leading-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        {cta} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
