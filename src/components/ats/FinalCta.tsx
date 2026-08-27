import { UploadCloud, ShieldCheck } from "lucide-react";

type Props = { onUpload: () => void; disabled?: boolean };

export function FinalCta({ onUpload, disabled }: Props) {
  return (
    <section aria-labelledby="cta-heading" className="mx-auto max-w-6xl">
      <div className="surface-glass relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
        <span className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />
        <span className="ambient-blob ambient-blob-a" aria-hidden="true" />

        <div className="relative mx-auto max-w-2xl">
          <h2
            id="cta-heading"
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            Ready to beat the ATS?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Upload your resume and get an enterprise-grade AI analysis in about eight seconds. No
            account, no card, nothing stored.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onUpload}
              disabled={disabled}
              className="ripple inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-[1.04] active:scale-95 disabled:opacity-60 sm:text-base"
            >
              <UploadCloud className="size-5" aria-hidden="true" />
              Upload Resume
            </button>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-success-foreground">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            Encrypted analysis · your resume is deleted after the scan
          </p>
        </div>
      </div>
    </section>
  );
}

