import { Link } from "@tanstack/react-router";
import {
  Clock,
  Star,
  Users,
  ArrowRight,
  Globe,
  BadgeCheck,
  Briefcase,
  Radio,
  Infinity as InfinityIcon,
  FileDown,
  Flame,
  UserRound,
} from "lucide-react";
import { CourseThumbnail } from "./course-thumbnail";
import { ProgressBar } from "./progress-visuals";
import type { Course } from "@/lib/courses";
import { courseMeta, inr, badgeTone } from "@/lib/course-meta";

const levelTone: Record<string, string> = {
  Beginner: "bg-accent-soft text-accent-foreground",
  Intermediate: "bg-primary-soft text-primary",
  Advanced: "bg-[color-mix(in_oklab,var(--gold)_26%,transparent)] text-foreground",
};

function Perk({ icon: Icon, label }: { icon: typeof Clock; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/70 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-secondary" /> {label}
    </span>
  );
}

export function CourseCard({
  course,
  percent,
  chapters,
  index = 0,
  onDetails,
  onSyllabus,
}: {
  course: Course;
  percent: number;
  chapters: number;
  index?: number;
  onDetails?: (course: Course) => void;
  onSyllabus?: (course: Course) => void;
}) {
  const meta = courseMeta(course);

  return (
    <article
      className="group card-3d gradient-frame glass-card animate-fade-up relative flex flex-col overflow-hidden rounded-[28px] p-2.5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--secondary)]/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-[22px]">
        <CourseThumbnail
          courseId={course.id}
          category={course.category}
          icon={course.icon}
          title={course.title}
          showCategory={false}
          className="h-44 w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] soft-shadow ${badgeTone[meta.badge]}`}
        >
          {meta.badge}
        </span>
        {percent === 100 ? (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-accent-foreground">
            Completed
          </span>
        ) : (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-foreground/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-background backdrop-blur">
            <Flame className="h-3 w-3" /> {meta.seatsLeft} seats left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${levelTone[course.level] ?? levelTone["Beginner"]}`}
          >
            {course.level}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {course.duration}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Globe className="h-3.5 w-3.5" /> {meta.language}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {course.category}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-extrabold tracking-tight transition-colors duration-300 group-hover:text-secondary">
            {course.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {course.tagline}
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full brand-gradient text-[11px] font-black text-primary-foreground">
            {course.instructor.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-bold">{course.instructor.name}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {course.instructor.role}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Perk icon={Briefcase} label={`${meta.projects} projects`} />
          <Perk icon={BadgeCheck} label="Certificate" />
          {meta.liveSessions ? <Perk icon={Radio} label="Live sessions" /> : null}
          <Perk icon={UserRound} label="Placement support" />
          <Perk icon={InfinityIcon} label="Lifetime access" />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="flex" aria-label={`Rated ${course.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(course.rating)
                      ? "fill-[var(--gold)] text-[var(--gold)]"
                      : "text-muted-foreground/40"
                  }`}
                />
              ))}
            </span>
            <span className="text-foreground">{course.rating.toFixed(1)}</span>
            <span>({meta.reviews.toLocaleString("en-IN")})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {course.students.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-2 rounded-2xl bg-muted/60 px-3 py-2.5">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-accent">{inr(meta.price)}</span>
              {meta.price === 0 ? null : (
                <span className="text-xs font-semibold text-muted-foreground line-through">
                  {inr(meta.originalPrice)}
                </span>
              )}
            </div>
            {meta.price === 0 ? (
              <p className="text-[11px] font-semibold text-muted-foreground">
                Lifetime access included
              </p>
            ) : (
              <p className="text-[11px] font-semibold text-muted-foreground">
                EMI from {inr(meta.emi)}/mo
              </p>
            )}
          </div>
          {meta.price === 0 ? (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-black text-accent-foreground">
              Free
            </span>
          ) : (
            <span className="rounded-full gold-gradient px-2.5 py-1 text-[11px] font-black text-[oklch(0.24_0.05_80)]">
              {meta.discount}% OFF
            </span>
          )}
        </div>

        {percent > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">
                Your progress · {chapters} chapters
              </span>
              <span className={percent === 100 ? "text-accent" : "text-secondary"}>{percent}%</span>
            </div>
            <ProgressBar value={percent} tone={percent === 100 ? "accent" : "brand"} />
          </div>
        ) : null}

        <div className="mt-auto grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDetails?.(course)}
              className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-bold transition-colors hover:border-secondary hover:text-secondary"
            >
              View Details
            </button>
            <Link
              to="/courses/$courseId"
              params={{ courseId: course.id }}
              className="btn-glow ripple inline-flex items-center justify-center gap-2 rounded-xl brand-gradient px-3 py-2.5 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              {percent > 0 ? "Continue" : "Enroll Now"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => onSyllabus?.(course)}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-secondary"
          >
            <FileDown className="h-3.5 w-3.5" /> Download Syllabus (PDF)
          </button>
        </div>
      </div>
    </article>
  );
}
