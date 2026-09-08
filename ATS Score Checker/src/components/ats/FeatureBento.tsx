import { motion } from "motion/react";
import {
  BrainCircuit,
  ScanLine,
  Target,
  Braces,
  GitCompareArrows,
  LayoutTemplate,
  FileText,
  MessageSquareQuote,
  SpellCheck,
} from "lucide-react";

/** Bento grid of what the report actually contains — answers "what do I get?". */

const CARDS = [
  {
    icon: BrainCircuit,
    title: "AI resume review",
    body: "A senior-recruiter read of every line, written in plain language — not generic advice.",
    span: "lg:col-span-2 lg:row-span-2",
    feature: true,
  },
  { icon: ScanLine, title: "ATS simulation", body: "Parsed exactly like enterprise screening software." },
  { icon: Target, title: "Job match", body: "How closely your resume reads for your target role." },
  { icon: Braces, title: "Keyword suggestions", body: "The exact terms recruiters filter on." },
  { icon: GitCompareArrows, title: "Skill gap analysis", body: "What's missing versus your level." },
  { icon: LayoutTemplate, title: "Formatting check", body: "Tables, columns and glyphs that break parsers." },
  { icon: FileText, title: "AI summary rewrite", body: "A tighter professional summary from your own facts." },
  { icon: MessageSquareQuote, title: "Recruiter tips", body: "First impression, in 6 seconds." },
  { icon: SpellCheck, title: "Grammar check", body: "Tense, tone and weak verb fixes." },
];

export function FeatureBento() {
  return (
    <section aria-labelledby="features-heading" className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Inside your report
        </span>
        <h2
          id="features-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          Everything you get, before you pay anything
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Nine analyses run on a single upload. Every finding points at a specific line of your
          resume, and every fix can be applied in one click.
        </p>
      </div>

      <div className="mt-12 grid auto-rows-[minmax(120px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ icon: Icon, title, body, span, feature }, i) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "bento-card group relative flex flex-col justify-between overflow-hidden p-6",
              span ?? "",
            ].join(" ")}
          >
            <span className="bento-glow" aria-hidden="true" />
            <span
              className={[
                "relative flex items-center justify-center rounded-2xl transition-transform duration-500 group-hover:-translate-y-1",
                feature
                  ? "size-14 bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "size-11 bg-primary-soft text-primary",
              ].join(" ")}
            >
              <Icon className={feature ? "size-6" : "size-5"} aria-hidden="true" />
            </span>
            <div className="relative mt-6">
              <h3
                className={[
                  "font-extrabold text-foreground",
                  feature ? "text-xl sm:text-2xl" : "text-sm",
                ].join(" ")}
              >
                {title}
              </h3>
              <p
                className={[
                  "mt-2 leading-relaxed text-muted-foreground",
                  feature ? "text-sm sm:text-base" : "text-xs",
                ].join(" ")}
              >
                {body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
