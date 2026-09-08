import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@tanstack/react-router";
import {
  Star,
  Clock,
  Globe,
  BadgeCheck,
  FileDown,
  CheckCircle2,
  Quote,
  ArrowRight,
} from "lucide-react";
import type { Course } from "@/lib/courses";
import { courseMeta, inr, badgeTone } from "@/lib/course-meta";
import { CourseThumbnail } from "./course-thumbnail";

const faqs = [
  ["Do I need prior experience?", "No. Every programme starts from fundamentals and builds up to advanced, job-ready practice."],
  ["Is the certificate recognised?", "Yes. You unlock an industry-recognised CareerSync certificate at 100% completion."],
  ["What if I miss a live session?", "All live sessions are recorded and added to your lifetime library within 24 hours."],
  ["Is placement assistance included?", "Yes — resume review, LinkedIn optimisation, mock interviews and referrals to 500+ hiring partners."],
];

const reviews = [
  { name: "Aarav Mehta", role: "SDR, SaaS", text: "The objection-handling module alone doubled my meeting rate in six weeks.", stars: 5 },
  { name: "Priya Nair", role: "Insurance Advisor", text: "Practical, structured and genuinely premium. The mock interviews were brutal in the best way.", stars: 5 },
];

export function CourseDetailModal({
  course,
  open,
  onOpenChange,
  onSyllabus,
}: {
  course: Course | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSyllabus?: (course: Course) => void;
}) {
  if (!course) return null;
  const meta = courseMeta(course);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[28px] p-0 sm:max-w-3xl">
        <div className="relative">
          <CourseThumbnail
            courseId={course.id}
            category={course.category}
            icon={course.icon}
            title={course.title}
            className="h-40 w-full rounded-none sm:h-48"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <span
            className={`absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${badgeTone[meta.badge]}`}
          >
            {meta.badge}
          </span>
        </div>

        <div className="p-5 sm:p-7">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-black tracking-tight">{course.title}</DialogTitle>
            <DialogDescription className="text-sm">{course.tagline}</DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground">
              <Star className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" />
              {course.rating.toFixed(1)}
              <span className="text-muted-foreground">({meta.reviews.toLocaleString("en-IN")} reviews)</span>
            </span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {meta.language}</span>
            <span className="flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5" /> Certificate included</span>
          </div>

          <Tabs defaultValue="overview" className="mt-5">
            <TabsList className="flex w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted p-1">
              {["overview", "curriculum", "outcomes", "reviews", "faqs"].map((t) => (
                <TabsTrigger key={t} value={t} className="rounded-xl text-xs font-bold capitalize">
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{course.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Instructor", `${course.instructor.name} — ${course.instructor.role}`],
                  ["Projects", `${meta.projects} guided live projects`],
                  ["Requirements", "A laptop, internet and 4 focused hours per week"],
                  ["Placement support", "Resume, LinkedIn, mock interviews, referrals"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">{k}</p>
                    <p className="mt-1 text-sm font-semibold">{v}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-4 space-y-2">
              {course.chapters.map((ch, i) => (
                <div key={ch.title} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-black text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{ch.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{ch.focus}</p>
                      <p className="mt-1.5 text-[11px] font-semibold text-secondary">
                        {ch.concepts.length} concepts · case study · quiz
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-dashed border-border p-4 text-xs font-semibold text-muted-foreground">
                Plus: assignments, practice exercises, a 20-question timed test and a final assessment.
              </div>
            </TabsContent>

            <TabsContent value="outcomes" className="mt-4 space-y-2">
              {course.objectives.map((o) => (
                <p key={o} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {o}
                </p>
              ))}
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 grid gap-3 sm:grid-cols-2">
              {reviews.map((r) => (
                <figure key={r.name} className="glass-card rounded-2xl p-4">
                  <Quote className="h-4 w-4 text-secondary" />
                  <blockquote className="mt-2 text-sm text-muted-foreground">{r.text}</blockquote>
                  <figcaption className="mt-3 text-xs font-bold">
                    {r.name} <span className="font-medium text-muted-foreground">· {r.role}</span>
                  </figcaption>
                </figure>
              ))}
            </TabsContent>

            <TabsContent value="faqs" className="mt-4">
              <Accordion type="single" collapsible>
                {faqs.map(([q, a]) => (
                  <AccordionItem key={q} value={q!}>
                    <AccordionTrigger className="text-sm font-bold">{q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>

          <div className="mt-6 grid gap-3 rounded-2xl bg-muted/70 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-accent">{inr(meta.price)}</span>
                {meta.price === 0 ? null : (
                  <span className="text-sm font-semibold text-muted-foreground line-through">
                    {inr(meta.originalPrice)}
                  </span>
                )}
                {meta.price === 0 ? null : (
                  <span className="rounded-full gold-gradient px-2 py-0.5 text-[11px] font-black text-[oklch(0.24_0.05_80)]">
                    {meta.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                {meta.price === 0
                  ? "Lifetime access included"
                  : `EMI from ${inr(meta.emi)}/mo`}
                · {meta.seatsLeft} seats left in this batch
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSyllabus?.(course)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold transition-colors hover:border-secondary hover:text-secondary"
              >
                <FileDown className="h-4 w-4" /> Syllabus
              </button>
              <Link
                to="/courses/$courseId"
                params={{ courseId: course.id }}
                onClick={() => onOpenChange(false)}
                className="btn-glow ripple inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-bold text-primary-foreground"
              >
                Enroll Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
