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
import { getCourse } from "@/lib/academy-courses";
import { useAcademyCourseStats, useAcademyProgress } from "@/lib/academy-progress";
import { ProgressBar, ProgressRing } from "@/components/academy/progress-visuals";
import { Confetti } from "@/components/academy/confetti";

export const Route = createFileRoute("/careersync-academy/courses/$courseId/")({
  component: CourseOverview,
});

function CourseOverview() {
  const { courseId } = Route.useParams();
  const course = getCourse(courseId)!;
  const stats = useAcademyCourseStats(course);
  const { store, reset } = useAcademyProgress();

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
              to="/careersync-academy/courses/$courseId/$unitId"
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

      {stats.started ? (
        <section className="glass-card rounded-3xl p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Your progress</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
            <ProgressRing
              value={stats.percent}
              sublabel="Complete"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { icon: CheckCircle2, label: "Chapters done", value: `${stats.completedChapters}/${stats.totalChapters}` },
                { icon: Flame, label: "Exercises done", value: `${stats.exercisesDone}/${stats.totalExercises}` },
                { icon: Trophy, label: "Tests done", value: `${stats.testsDone}/${stats.totalTests}` },
                { icon: Zap, label: "XP earned", value: `${store.xp} XP` },
                { icon: Award, label: "Certificate", value: stats.certificateUnlocked ? "Unlocked" : "Locked" },
                { icon: ShieldCheck, label: "Final assessment", value: stats.finalDone ? `${stats.finalScore}%` : "Not taken" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-border p-3">
                  <Icon className="h-4 w-4 text-secondary" />
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-extrabold">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <ProgressBar value={stats.percent} tone={stats.percent === 100 ? "accent" : "brand"} />
          </div>
        </section>
      ) : null}

      <section className="glass-card rounded-3xl p-6">
        <h2 className="text-lg font-extrabold tracking-tight">Curriculum</h2>
        <ul className="mt-4 space-y-2">
          {stats.units.map((unit) => {
            const done = stats.completed.includes(unit.id);
            const locked = !stats.isUnlocked(unit.id);
            return (
              <li key={unit.id}>
                <Link
                  to="/careersync-academy/courses/$courseId/$unitId"
                  params={{ courseId, unitId: unit.id }}
                  disabled={locked}
                  className={`flex items-center gap-3 rounded-2xl border border-border p-4 text-sm transition-colors ${
                    locked ? "cursor-not-allowed opacity-50" : "hover:bg-muted"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  ) : locked ? (
                    <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <PlayCircle className="h-5 w-5 shrink-0 text-secondary" />
                  )}
                  <span className="flex-1 font-medium">{unit.title}</span>
                  {done ? (
                    <span className="text-xs font-bold text-accent">Done</span>
                  ) : locked ? (
                    <span className="text-xs font-bold text-muted-foreground">Locked</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
