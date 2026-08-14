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
import { getCourse } from "@/lib/academy-courses";
import { useAcademyCourseStats } from "@/lib/academy-progress";
import { CourseIcon, CourseThumbnail } from "@/components/academy/course-thumbnail";
import { ProgressBar } from "@/components/academy/progress-visuals";
import { AcademyProgressProvider } from "@/lib/academy-progress";

export const Route = createFileRoute("/careersync-academy/courses/$courseId")({
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
  component: CourseShell,
});

function CourseShell() {
  return (
    <AcademyProgressProvider>
      <div className="academy-theme">
        <CourseLayout />
      </div>
    </AcademyProgressProvider>
  );
}

function CourseLayout() {
  const { courseId } = Route.useParams();
  const course = getCourse(courseId)!;
  const stats = useAcademyCourseStats(course);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div>
      <section className="relative overflow-hidden deep-gradient">
        <div className="absolute inset-0 grid-noise opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <Link
            to="/careersync-academy"
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
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span>Course progress</span>
                <span className={stats.percent === 100 ? "text-accent" : "text-secondary"}>
                  {stats.percent}%
                </span>
              </div>
              <ProgressBar
                value={stats.percent}
                className="mt-2"
                tone={stats.percent === 100 ? "accent" : "brand"}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {stats.completedChapters}/{stats.totalChapters} chapters
              </p>
            </div>

            <nav className="space-y-1">
              {stats.units.map((unit) => {
                const done = stats.completed.includes(unit.id);
                const active = pathname.endsWith(`/${unit.id}`);
                const locked = !stats.isUnlocked(unit.id);
                return (
                  <Link
                    key={unit.id}
                    to="/careersync-academy/courses/$courseId/$unitId"
                    params={{ courseId, unitId: unit.id }}
                    disabled={locked}
                    className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-primary-soft font-bold text-primary"
                        : locked
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-muted"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    ) : locked ? (
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 truncate">{unit.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
