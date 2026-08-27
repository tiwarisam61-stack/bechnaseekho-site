import { motion } from "motion/react";
import { UploadCloud, ScanSearch, DatabaseZap, UserCheck } from "lucide-react";

const STEPS = [
  {
    icon: UploadCloud,
    title: "You upload your resume",
    body: "PDF, DOC or DOCX. We read the raw text exactly the way employer software does.",
  },
  {
    icon: ScanSearch,
    title: "The AI reads it like an ATS",
    body: "20 checks run across formatting, sections, keywords, grammar and readability.",
  },
  {
    icon: DatabaseZap,
    title: "Fields get extracted",
    body: "Name, contact, skills, dates, titles. If a real ATS would lose it, you see it here.",
  },
  {
    icon: UserCheck,
    title: "A recruiter sees a clean resume",
    body: "Apply each fix in one click and your score updates live before you send it out.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          How ATS screening works
        </span>
        <h2
          id="how-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          75% of resumes are read by software first
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Applicant Tracking Systems parse your file into database fields before a human opens it. If
          the parse fails, you get rejected without ever being read. Here is the exact path your
          resume takes.
        </p>
      </div>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <motion.li
            key={title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="tilt-3d surface-card relative p-6"
          >
            <span className="absolute right-5 top-5 text-3xl font-extrabold text-primary/10">
              0{i + 1}
            </span>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-base font-extrabold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
