import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionTitle } from "./section-title";

const faqs = [
  {
    q: "How does BechnaSeekho combine CareerSync and Learning?",
    a: "They share one profile, one AI, and one dashboard. Your resume, applications, skills and courses all speak to each other so recommendations get sharper over time.",
  },
  {
    q: "Is the resume builder ATS-friendly?",
    a: "Every resume is scored against real ATS rules — keywords, formatting, quantifiable impact — and rewritten by AI to maximize match rates without losing your voice.",
  },
  {
    q: "Can recruiters and HR teams use this?",
    a: "Yes. CareerSync includes a full recruiter workspace with pipelines, AI candidate scoring, interview scheduling, and analytics on time-to-hire and quality of hire.",
  },
  {
    q: "Are the courses live or self-paced?",
    a: "Both. Weekly live cohorts run alongside on-demand tracks. Each cohort pairs you with a mentor and an AI role-play tutor for daily practice.",
  },
  {
    q: "Do I get a certificate?",
    a: "Every completed course and cohort issues a shareable, verifiable certificate you can add to LinkedIn or link inside your CareerSync profile.",
  },
  {
    q: "How much does it cost?",
    a: "Core features — profile, resume builder, verified jobs, mock interviews — are free forever. Learning cohorts and mentorship are available on flexible monthly plans.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-10 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="FAQ"
          title={<>Answers to the <span className="text-gradient-brand">big questions.</span></>}
        />

        <div className="mt-8 divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Item({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-base font-semibold text-ink sm:text-lg">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-brand ring-1 ring-line"
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft sm:text-base">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
