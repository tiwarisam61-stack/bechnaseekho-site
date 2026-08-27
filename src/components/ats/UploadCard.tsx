import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

type Props = {
  onFile: (file: File) => void;
  busy: boolean;
  fileName?: string | null;
  uploaded: boolean;
  error?: { message: string; hint: string } | null;
  onRetry: () => void;
  /** Lets a parent CTA open the native file picker. */
  registerOpen?: (open: () => void) => void;
};

export function UploadCard({
  onFile,
  busy,
  fileName,
  uploaded,
  error,
  onRetry,
  registerOpen,
}: Props) {

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const pick = useCallback(() => inputRef.current?.click(), []);

  useEffect(() => {
    registerOpen?.(pick);
  }, [registerOpen, pick]);

  // Real-time read indicator: fills while the file is being parsed/analysed.
  useEffect(() => {
    if (!busy) {
      setProgress(uploaded ? 100 : 0);
      return;
    }
    setProgress(8);
    const id = window.setInterval(
      () => setProgress((p) => (p >= 96 ? 96 : p + Math.max(1, Math.round((100 - p) / 12)))),
      220,
    );
    return () => window.clearInterval(id);
  }, [busy, uploaded]);

  return (
    <section aria-labelledby="upload-heading" className="w-full">
      <h2 id="upload-heading" className="sr-only">
        Upload your resume
      </h2>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume. Drag and drop a PDF, DOC or DOCX file, or press Enter to browse files."
        aria-disabled={busy}
        onClick={() => !busy && pick()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) {
            e.preventDefault();
            pick();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && !busy) onFile(file);
        }}
        className={[
          "dropzone group relative overflow-hidden p-6 text-center transition-all duration-300 sm:p-10",
          busy ? "cursor-progress opacity-95" : "cursor-pointer hover:shadow-[var(--shadow-glow)]",
          dragging ? "dropzone-active" : "",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {[14, 32, 50, 68, 86].map((left, i) => (
            <span
              key={left}
              className="lab-particle"
              style={{
                left: `${left}%`,
                top: `${20 + ((i * 17) % 60)}%`,
                animationDelay: `${i * 1.1}s`,
                animationDuration: `${7 + (i % 3) * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-[var(--shadow-glow)] sm:size-20">
            {uploaded ? (
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              >
                <CheckCircle2 className="size-8 text-primary-foreground sm:size-10" aria-hidden="true" />
              </motion.span>
            ) : (
              <UploadCloud
                className="size-8 text-primary-foreground transition-transform duration-300 group-hover:-translate-y-1 sm:size-10"
                aria-hidden="true"
              />
            )}
          </div>

          {uploaded ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-lg font-bold text-foreground">
                {busy ? "Reading your resume…" : "Resume uploaded successfully"}
              </p>
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <FileText className="size-4" aria-hidden="true" />
                {fileName}
              </p>
            </motion.div>
          ) : (
            <>
              <p className="text-lg font-bold text-foreground sm:text-xl">
                Drag &amp; drop your resume here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse files from your device
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="ripple inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
                  <UploadCloud className="size-4" aria-hidden="true" />
                  Upload Resume
                </span>
              </div>

              <p className="mt-5 text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX · Maximum size 5 MB
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-success-foreground">
                <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
                Your resume never gets shared
              </p>
            </>
          )}

          {(busy || (uploaded && progress > 0)) && (
            <div
              className="mx-auto mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Resume processing progress"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-primary"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.35 }}
              />
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf"
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onFile(file);
          }}
        />
      </div>

      {error && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-foreground">{error.message}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{error.hint}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </button>
        </motion.div>
      )}
    </section>
  );
}
