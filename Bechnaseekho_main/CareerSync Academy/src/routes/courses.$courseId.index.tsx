import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Flame,
  Lock,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { getCourse } from "@/lib/courses";
import { useCourseStats, useProgress } from "@/lib/progress";
import { ProgressBar, ProgressRing } from "@/components/progress-visuals";
import { Confetti } from "@/components/confetti";

export const Route = createFileRoute("/courses/$courseId/")({
  component: CourseOverview,
});

function CourseOverview() {
  const { courseId } = Route.useParams();
  const course = getCourse(courseId)!;
  const stats = useCourseStats(course);
  const { store, reset } = useProgress();

  return (
    <div className="space-y-6">
      <Confetti fire={stats.percent === 100} />

      <section className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-extrabold tracking-tight">About this course</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl brand-gradient text-lg font-black text-primary-foreground">
              {course.instructor.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-extrabold">{course.instructor.name}</p>
              <p className="truncate text-xs font-semibold text-muted-foreground">
                {course.instructor.role}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              ["Level", course.level],
              ["Duration", course.duration],
              ["Chapters", `${stats.totalChapters}`],
              ["Updated", course.updated],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {k}
                </p>
                <p className="font-extrabold">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Learning objectives
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {course.objectives.map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm font-medium">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              {o}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          {stats.nextUnit ? (
            <Link
              to="/courses/$courseId/$unitId"
              params={{ courseId, unitId: stats.nextUnit.id }}
              className="btn-glow inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              <PlayCircle className="h-4 w-4" />
              {stats.started ? "Continue learning" : "Start course"}
            </Link>
          ) : null}
          {stats.started ? (
            <button
              onClick={() => reset(courseId)}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold transition-colors hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Reset progress
            </button>
          ) : null}
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-extrabold tracking-tight">Progress tracker</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="justify-self-center">
            <ProgressRing value={stats.percent} sublabel="Course complete" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Completed chapters",
                value: `${stats.completedChapters} / ${stats.totalChapters}`,
                pct: (stats.completedChapters / stats.totalChapters) * 100,
              },
              {
                label: "Pending chapters",
                value: `${stats.totalChapters - stats.completedChapters}`,
                pct:
                  ((stats.totalChapters - stats.completedChapters) / stats.totalChapters) * 100,
              },
              {
                label: "Exercises completed",
                value: `${stats.exercisesDone} / ${stats.totalExercises}`,
                pct: (stats.exercisesDone / stats.totalExercises) * 100,
              },
              {
                label: "Practice tests completed",
                value: `${stats.testsDone} / ${stats.totalTests}`,
                pct: (stats.testsDone / stats.totalTests) * 100,
              },
            ].map((row) => (
              <div key={row.label} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span>{row.value}</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={Math.round(row.pct)} />
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-border p-4 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold">
                <span className="text-muted-foreground">Final assessment status</span>
                <span className={stats.finalDone ? "text-accent" : "text-primary"}>
                  {stats.finalDone
                    ? `Passed · ${stats.finalScore ?? 0}%`
                    : stats.isUnlocked("final-assessment")
                      ? "Unlocked — ready to attempt"
                      : "Locked"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`rounded-3xl border p-6 ${
          stats.certificateUnlocked
            ? "animate-pop border-accent/50 bg-accent-soft"
            : "border-dashed border-border bg-card/70"
        }`}
      >
        <div className="flex flex-wrap items-start gap-4">
          <span
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${
              stats.certificateUnlocked
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {stats.certificateUnlocked ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <Lock className="h-6 w-6" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold tracking-tight">
              {stats.certificateUnlocked ? "✅ Certificate Unlocked" : "🔒 Certificate Locked"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {stats.certificateUnlocked
                ? "Congratulations — you have completed every chapter, exercise, practice test and the final assessment. Your course completion certificate will be available here shortly."
                : "Complete all chapters, exercises, practice tests, and the final assessment to unlock your course completion certificate."}
            </p>
            <div className="mt-3 max-w-md">
              <ProgressBar
                value={stats.percent}
                tone={stats.certificateUnlocked ? "accent" : "brand"}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-extrabold tracking-tight">Achievements</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: Trophy,
              label: "Completion badge",
              value: stats.certificateUnlocked ? "Earned" : "Locked",
              done: stats.certificateUnlocked,
            },
            { icon: Flame, label: "Course streak", value: `${store.streak} day`, done: true },
            { icon: Zap, label: "Learning points", value: `${store.xp} XP`, done: true },
            {
              icon: Award,
              label: "Top performer",
              value: "Placeholder",
              done: false,
            },
          ].map((a) => (
            <div
              key={a.label}
              className={`rounded-2xl border p-4 ${
                a.done ? "border-accent/40 bg-accent-soft" : "border-border"
              }`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary">
                <a.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-lg font-black">{a.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {a.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-accent" /> Completion status:{" "}
          {stats.percent === 100 ? "Course completed" : `${stats.percent}% complete`}
        </p>
      </section>
    </div>
  );
}
