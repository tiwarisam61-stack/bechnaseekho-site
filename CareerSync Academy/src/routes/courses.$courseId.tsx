import { createFileRoute, Link, Outlet, notFound, useRouterState } from "@tanstack/react-router";
import {
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  Star,
  Users,
  ChevronLeft,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { getCourse } from "@/lib/courses";
import { useCourseStats } from "@/lib/progress";
import { CourseIcon, CourseThumbnail } from "@/components/course-thumbnail";
import { ProgressBar } from "@/components/progress-visuals";

export const Route = createFileRoute("/courses/$courseId")({
  loader: ({ params }) => {
    const course = getCourse(params.courseId);
    if (!course) throw notFound();
    return { title: course.title, tagline: course.tagline };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — CareerSync Course` : "Course — CareerSync";
    const description = loaderData?.tagline ?? "Premium course learning on CareerSync.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CourseLayout,
});

function CourseLayout() {
  const { courseId } = Route.useParams();
  const course = getCourse(courseId)!;
  const stats = useCourseStats(course);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div>
      <section className="relative overflow-hidden deep-gradient">
        <div className="absolute inset-0 grid-noise opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> All courses
          </Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
                <CourseIcon name={course.icon} className="h-3.5 w-3.5" /> {course.category} ·{" "}
                {course.level}
              </span>
              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                {course.tagline}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> {stats.totalChapters} chapters
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {course.students.toLocaleString()} enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-[var(--warning)] text-[var(--warning)]" />{" "}
                  {course.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Updated {course.updated}
                </span>
              </div>
            </div>
            <CourseThumbnail
              courseId={course.id}
              category={course.category}
              icon={course.icon}
              title={course.title}
              className="h-44 w-full premium-shadow"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-[84px] lg:self-start">
          <div className="glass-card rounded-3xl p-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Course content</span>
              <span className="text-primary">{stats.percent}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar
                value={stats.percent}
                tone={stats.percent === 100 ? "accent" : "brand"}
              />
            </div>

            <nav className="mt-4 max-h-[60vh] space-y-1 overflow-y-auto pr-1">
              <Link
                to="/courses/$courseId"
                params={{ courseId }}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors ${
                  pathname === `/courses/${courseId}`
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Course overview
              </Link>
              {stats.units.map((unit) => {
                const done = stats.completed.includes(unit.id);
                const unlocked = stats.isUnlocked(unit.id);
                const active = pathname === `/courses/${courseId}/${unit.id}`;
                const base =
                  "flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-all duration-200";
                if (!unlocked) {
                  return (
                    <div
                      key={unit.id}
                      className={`${base} cursor-not-allowed text-muted-foreground/60`}
                      title="Complete the previous unit to unlock"
                    >
                      <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wider">
                          {unit.label}
                        </span>
                        <span className="block truncate font-semibold">{unit.title}</span>
                      </span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={unit.id}
                    to="/courses/$courseId/$unitId"
                    params={{ courseId, unitId: unit.id }}
                    className={`${base} animate-fade-up ${
                      active
                        ? "bg-primary-soft font-bold text-primary soft-shadow"
                        : "hover:bg-muted"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {unit.label}
                      </span>
                      <span className="block truncate font-semibold">{unit.title}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 rounded-2xl bg-muted p-3 text-xs font-semibold text-muted-foreground">
              {stats.nextUnit
                ? `Upcoming: ${stats.nextUnit.label} · ${stats.nextUnit.title}`
                : "All units completed 🎉"}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
