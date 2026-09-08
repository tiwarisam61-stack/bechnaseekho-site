import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Clock3, Lock, PlayCircle, ShieldCheck, Zap } from "lucide-react";
import { useAllStats, useProgress } from "@/lib/progress";
import { ProgressBar, ProgressRing } from "@/components/progress-visuals";
import { CourseIcon } from "@/components/course-thumbnail";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Learning Dashboard — CareerSync by BechnaSeekho" },
      {
        name: "description",
        content:
          "Track enrolled courses, completed courses, certificates, current progress and recently viewed lessons.",
      },
      { property: "og:title", content: "My Learning Dashboard — CareerSync" },
      {
        property: "og:description",
        content: "Your enrolled courses, progress, certificates and continue-learning shortcuts.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const all = useAllStats();
  const { store } = useProgress();

  const enrolled = all.filter((a) => a.stats.started);
  const completed = all.filter((a) => a.stats.percent === 100);
  const overall = Math.round(all.reduce((s, a) => s + a.stats.percent, 0) / all.length);
  const recent = [...enrolled].sort(
    (a, b) =>
      (store.courses[b.course.id]?.updatedAt ?? 0) - (store.courses[a.course.id]?.updatedAt ?? 0),
  );
  const continueCourse = recent[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-black tracking-tight sm:text-4xl">
            My Learning Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Progress, certificates and everything you have started.
          </p>
        </div>
        <span className="shrink-0 rounded-2xl bg-primary-soft px-4 py-2 text-sm font-black text-primary">
          {store.xp} XP
        </span>
      </header>

      <section className="mt-8 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="glass-card flex flex-col items-center gap-4 rounded-3xl p-6">
          <ProgressRing value={overall} sublabel="Overall progress" />
          <div className="grid w-full grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-muted p-3">
              <p className="text-xl font-black">{enrolled.length}</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Enrolled
              </p>
            </div>
            <div className="rounded-2xl bg-accent-soft p-3">
              <p className="text-xl font-black">{completed.length}</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Completed
              </p>
            </div>
          </div>
          {continueCourse ? (
            <Link
              to="/courses/$courseId"
              params={{ courseId: continueCourse.course.id }}
              className="btn-glow inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient px-4 py-3 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              <PlayCircle className="h-4 w-4" /> Continue Learning
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-bold"
            >
              Browse courses
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: BookOpen,
              label: "Chapters completed",
              value: all.reduce((s, a) => s + a.stats.completedChapters, 0),
            },
            {
              icon: CheckCircle2,
              label: "Exercises completed",
              value: all.reduce((s, a) => s + a.stats.exercisesDone, 0),
            },
            {
              icon: Zap,
              label: "Tests completed",
              value: all.reduce((s, a) => s + a.stats.testsDone, 0),
            },
            {
              icon: ShieldCheck,
              label: "Certificates earned",
              value: completed.length,
            },
          ].map((s) => (
            <div key={s.label} className="glass-card gradient-frame rounded-3xl p-5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-3xl font-black tracking-tight">{s.value}</p>
              <p className="text-sm font-semibold text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold tracking-tight">Enrolled courses</h2>
        {enrolled.length === 0 ? (
          <p className="mt-4 rounded-3xl border border-dashed border-border p-10 text-center text-sm font-semibold text-muted-foreground">
            You haven't started a course yet. Pick one from the catalog to begin.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {enrolled.map(({ course, stats }) => (
              <Link
                key={course.id}
                to="/courses/$courseId"
                params={{ courseId: course.id }}
                className="glass-card hover-lift grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-3xl p-4 sm:flex"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl brand-gradient text-primary-foreground">
                  <CourseIcon name={course.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-extrabold">{course.title}</p>
                    <span className="shrink-0 text-sm font-black text-primary">
                      {stats.percent}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={stats.percent} tone={stats.percent === 100 ? "accent" : "brand"} />
                  </div>
                  <p className="mt-2 truncate text-xs font-semibold text-muted-foreground">
                    {stats.certificateUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-accent">
                        <ShieldCheck className="h-3.5 w-3.5" /> Certificate unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" /> Certificate locked · next up:{" "}
                        {stats.nextUnit?.title}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold tracking-tight">Recently viewed lessons</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recent.slice(0, 6).map(({ course, stats }) => {
            const lastId = store.courses[course.id]?.lastUnit;
            const unit = stats.units.find((u) => u.id === lastId) ?? stats.units[0]!;
            return (
              <Link
                key={course.id}
                to="/courses/$courseId/$unitId"
                params={{ courseId: course.id, unitId: unit.id }}
                className="glass-card hover-lift rounded-3xl p-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {course.title}
                </p>
                <p className="mt-1 font-extrabold leading-snug">{unit.title}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  <Clock3 className="h-3.5 w-3.5" /> Resume this lesson
                </p>
              </Link>
            );
          })}
          {recent.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border p-8 text-sm font-semibold text-muted-foreground sm:col-span-2 lg:col-span-3">
              Nothing viewed yet.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
