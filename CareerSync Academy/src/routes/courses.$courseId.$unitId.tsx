import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Lightbulb,
  ListChecks,
  Lock,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { buildUnits, getCourse } from "@/lib/courses";
import { useCourseStats, useProgress } from "@/lib/progress";
import { QuizRunner } from "@/components/quiz-runner";
import { Confetti } from "@/components/confetti";
import { ProgressBar } from "@/components/progress-visuals";

export const Route = createFileRoute("/courses/$courseId/$unitId")({
  loader: ({ params }) => {
    const course = getCourse(params.courseId);
    if (!course) throw notFound();
    const unit = buildUnits(course).find((u) => u.id === params.unitId);
    if (!unit) throw notFound();
    return { title: unit.title, courseTitle: course.title };
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.title} — ${loaderData.courseTitle} | CareerSync`
      : "Lesson — CareerSync";
    const description = loaderData
      ? `${loaderData.title}, part of the ${loaderData.courseTitle} course on CareerSync by BechnaSeekho.`
      : "CareerSync lesson.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: UnitPage,
});

function UnitPage() {
  const { courseId, unitId } = Route.useParams();
  const course = getCourse(courseId)!;
  const stats = useCourseStats(course);
  const { complete, touch } = useProgress();
  const navigate = useNavigate();
  const [celebrate, setCelebrate] = useState(false);

  const index = stats.units.findIndex((u) => u.id === unitId);
  const unit = stats.units[index]!;
  const prev = index > 0 ? stats.units[index - 1] : undefined;
  const next = stats.units[index + 1];
  const done = stats.completed.includes(unit.id);
  const unlocked = stats.isUnlocked(unit.id);

  useEffect(() => {
    touch(courseId, unitId);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, [courseId, unitId, touch]);

  const [practicePassed, setPracticePassed] = useState(false);
  useEffect(() => setPracticePassed(false), [unitId]);

  const canMarkComplete = useMemo(() => {
    if (unit.kind === "lesson") return practicePassed || done;
    return done;
  }, [unit.kind, practicePassed, done]);

  const finish = (score?: number) => {
    const wasLast = stats.percent >= 90;
    complete(courseId, unit.id, score);
    if (wasLast) setCelebrate(true);
    toast.success(`${unit.label} completed`, { description: "+50 XP earned" });
  };

  if (!unlocked) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <Lock className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-black tracking-tight">This unit is locked</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Complete the previous lesson, its practice and any required test to unlock{" "}
          <span className="font-bold text-foreground">{unit.title}</span>.
        </p>
        {stats.nextUnit ? (
          <Link
            to="/courses/$courseId/$unitId"
            params={{ courseId, unitId: stats.nextUnit.id }}
            className="btn-glow mt-6 inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Go to {stats.nextUnit.label} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <article className="animate-fade-up space-y-6">
      <Confetti fire={celebrate && stats.percent === 100} />

      <header className="glass-card rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-primary">
            {unit.label}
          </span>
          {unit.kind === "lesson" ? (
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" /> {unit.lesson.readingTime}
            </span>
          ) : null}
          {done ? (
            <span className="inline-flex items-center gap-1 text-accent">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          {unit.title}
        </h1>
        <div className="mt-4">
          <ProgressBar value={stats.percent} tone={stats.percent === 100 ? "accent" : "brand"} />
        </div>
      </header>

      {unit.kind === "lesson" ? (
        <>
          <Section icon={BookOpenCheck} title="Professional notes">
            <p className="text-sm font-semibold text-secondary">{unit.lesson.focus}</p>
            {unit.lesson.notes.map((n) => (
              <p key={n} className="text-[15px] leading-relaxed text-muted-foreground">
                {n}
              </p>
            ))}
          </Section>

          <Section icon={Sparkles} title="Key concepts">
            <div className="grid gap-3 sm:grid-cols-3">
              {unit.lesson.concepts.map((c, i) => (
                <div
                  key={c.name}
                  className="gradient-frame rounded-2xl border border-border bg-background p-4"
                >
                  <span className="text-[11px] font-black text-secondary">0{i + 1}</span>
                  <p className="mt-1 font-extrabold leading-snug">{c.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={ListChecks} title="Important points">
            <ul className="space-y-2">
              {unit.lesson.importantPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[15px] font-medium">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {p}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Quote} title="Real-life example">
            <div className="rounded-2xl border-l-4 border-secondary bg-primary-soft/50 p-4 text-[15px] leading-relaxed">
              {unit.lesson.example}
            </div>
            <div className="mt-4 flex gap-4 rounded-2xl bg-muted p-4">
              <IllustrationBars />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Illustration
                </p>
                <p className="text-sm font-medium leading-relaxed">
                  Skill compounding: consistent application of this chapter typically shows
                  measurable improvement by week four.
                </p>
              </div>
            </div>
          </Section>

          <Section icon={ClipboardList} title="Case study">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {unit.lesson.caseStudy}
            </p>
          </Section>

          <Section icon={Lightbulb} title="Tips & tricks">
            <div className="grid gap-3 sm:grid-cols-3">
              {unit.lesson.tips.map((t) => (
                <div key={t} className="rounded-2xl bg-accent-soft p-4 text-sm font-semibold">
                  {t}
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Star} title="Quick summary & key takeaways">
            <ul className="space-y-2">
              {unit.lesson.summary.map((s) => (
                <li key={s} className="flex items-start gap-2 text-[15px] font-medium">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warning)]" />
                  {s}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={ListChecks} title="Practice questions">
            <p className="text-sm text-muted-foreground">
              Answer correctly (70%+) to enable "Mark as complete" and unlock the next unit.
            </p>
            <div className="mt-4">
              <QuizRunner
                questions={unit.lesson.practice}
                passMark={70}
                compact
                submitLabel="Check my answers"
                onPassed={() => setPracticePassed(true)}
              />
            </div>
          </Section>
        </>
      ) : null}

      {unit.kind === "exercise" ? (
        <>
          <Section icon={ClipboardList} title="About this exercise">
            <p className="text-[15px] leading-relaxed text-muted-foreground">{unit.intro}</p>
          </Section>
          <Section icon={Sparkles} title="Activities">
            <div className="grid gap-3 sm:grid-cols-2">
              {unit.activities.map((a) => (
                <div key={a.title} className="rounded-2xl border border-border p-4">
                  <p className="font-extrabold">{a.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section icon={ListChecks} title="Exercise questions">
            <QuizRunner
              questions={unit.questions}
              passMark={70}
              submitLabel="Submit exercise"
              onPassed={(r) => {
                if (!done) finish(r.score);
              }}
            />
          </Section>
        </>
      ) : null}

      {unit.kind === "test" ? (
        <>
          <Section icon={ClipboardList} title={unit.final ? "Final assessment" : "Practice test"}>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{unit.intro}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
              <span className="rounded-full bg-muted px-3 py-1.5">
                {unit.questions.length} questions
              </span>
              <span className="rounded-full bg-muted px-3 py-1.5">{unit.minutes} minutes</span>
              <span className="rounded-full bg-muted px-3 py-1.5">
                Pass mark {unit.passMark}%
              </span>
              {stats.scores[unit.id] !== undefined ? (
                <span className="rounded-full bg-accent-soft px-3 py-1.5">
                  Best score {stats.scores[unit.id]}%
                </span>
              ) : null}
            </div>
          </Section>
          <QuizRunner
            questions={unit.questions}
            passMark={unit.passMark}
            minutes={unit.minutes}
            submitLabel={unit.final ? "Submit final assessment" : "Submit test"}
            onPassed={(r) => {
              if (!done) finish(r.score);
            }}
          />
        </>
      ) : null}

      {unit.kind === "completion" ? (
        <section className="glass-card rounded-3xl p-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl brand-gradient text-primary-foreground">
            <Trophy className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight">
            {stats.percent === 100 ? "Course completed!" : "Finish the remaining units"}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {stats.percent === 100
              ? `You have completed ${course.title} — every chapter, exercise, practice test and the final assessment.`
              : "Complete every chapter, exercise, practice test and the final assessment to finish the course."}
          </p>
          <div className="mx-auto mt-5 max-w-sm">
            <ProgressBar value={stats.percent} tone={stats.percent === 100 ? "accent" : "brand"} />
          </div>
          <div
            className={`mx-auto mt-6 flex max-w-lg items-start gap-3 rounded-2xl border p-4 text-left ${
              stats.certificateUnlocked
                ? "border-accent/50 bg-accent-soft"
                : "border-dashed border-border"
            }`}
          >
            {stats.certificateUnlocked ? (
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            ) : (
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <p className="text-sm">
              <span className="font-extrabold">
                {stats.certificateUnlocked ? "✅ Certificate Unlocked" : "🔒 Certificate Locked"}
              </span>
              <br />
              <span className="text-muted-foreground">
                {stats.certificateUnlocked
                  ? "Your certificate page will be available here soon."
                  : "Complete all chapters, exercises, practice tests, and the final assessment to unlock your course completion certificate."}
              </span>
            </p>
          </div>
        </section>
      ) : null}

      <nav className="glass-card grid gap-3 rounded-3xl p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        {prev ? (
          <Link
            to="/courses/$courseId/$unitId"
            params={{ courseId, unitId: prev.id }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-bold transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Link>
        ) : (
          <span />
        )}

        {unit.kind === "lesson" || unit.kind === "completion" ? (
          <button
            onClick={() => {
              if (done) return;
              finish();
              if (next && stats.isUnlocked(next.id)) {
                setTimeout(
                  () =>
                    navigate({
                      to: "/courses/$courseId/$unitId",
                      params: { courseId, unitId: next.id },
                    }),
                  700,
                );
              }
            }}
            disabled={
              done || (unit.kind === "lesson" && !canMarkComplete) ||
              (unit.kind === "completion" && stats.percent < 90)
            }
            className="btn-glow inline-flex items-center justify-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {done
              ? "Completed"
              : unit.kind === "lesson" && !canMarkComplete
                ? "Pass the practice questions first"
                : "Mark as complete"}
          </button>
        ) : (
          <p className="text-center text-xs font-semibold text-muted-foreground">
            {done ? "Unit passed — you can continue." : "Score 70%+ to complete this unit."}
          </p>
        )}

        {next ? (
          <Link
            to="/courses/$courseId/$unitId"
            params={{ courseId, unitId: next.id }}
            disabled={!stats.isUnlocked(next.id)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
              stats.isUnlocked(next.id)
                ? "border border-border hover:bg-muted"
                : "pointer-events-none border border-dashed border-border text-muted-foreground/60"
            }`}
          >
            {stats.isUnlocked(next.id) ? "Next lesson" : "Next locked"}
            {stats.isUnlocked(next.id) ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </Link>
        ) : (
          <Link
            to="/courses/$courseId"
            params={{ courseId }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-bold hover:bg-muted"
          >
            Course overview
          </Link>
        )}
      </nav>
    </article>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof BookOpenCheck;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card space-y-3 rounded-3xl p-6">
      <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-4.5 w-4.5" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function IllustrationBars() {
  return (
    <div className="flex h-20 shrink-0 items-end gap-1.5" aria-hidden>
      {[30, 48, 62, 78, 96].map((h, i) => (
        <span
          key={h}
          className="w-4 rounded-t-md brand-gradient"
          style={{ height: `${h}%`, opacity: 0.5 + i * 0.12 }}
        />
      ))}
    </div>
  );
}
