import { GraduationCap, Users, ScanLine, ShieldCheck, DatabaseZap, Lock } from "lucide-react";

const ITEMS = [
  { icon: GraduationCap, title: "Trusted by students", note: "Freshers and campus placements" },
  { icon: Users, title: "Trusted by recruiters", note: "Built on real screening rules" },
  { icon: ScanLine, title: "ATS compatible", note: "Parsed like enterprise ATS software" },
  { icon: ShieldCheck, title: "Secure processing", note: "Encrypted analysis, in and out" },
  { icon: DatabaseZap, title: "No resume stored", note: "Nothing kept after your session" },
  { icon: Lock, title: "Privacy protected", note: "Never shared, never sold" },
];

export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Why you can trust this
        </span>
        <h2
          id="trust-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          Built to be trusted with your career
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Your resume is read once, in memory, then discarded. No account, no storage, no resale of
          your data — ever.
        </p>
      </div>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {ITEMS.map(({ icon: Icon, title, note }) => (
          <li
            key={title}
            className="surface-card flex items-center gap-3 p-4 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-foreground">{title}</span>
              <span className="block text-xs text-muted-foreground">{note}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
