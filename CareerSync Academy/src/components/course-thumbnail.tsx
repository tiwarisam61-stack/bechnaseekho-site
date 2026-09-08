import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import b2bSales from "@/assets/courses/b2b-sales.jpg";
import closingTechniques from "@/assets/courses/closing-techniques.jpg";
import coldCalling from "@/assets/courses/cold-calling.jpg";
import communicationSkills from "@/assets/courses/communication-skills.jpg";
import customerHandling from "@/assets/courses/customer-handling.jpg";
import insuranceSales from "@/assets/courses/insurance-sales.jpg";
import interviewPreparation from "@/assets/courses/interview-preparation.jpg";
import negotiationSkills from "@/assets/courses/negotiation-skills.jpg";
import rentalSales from "@/assets/courses/rental-sales.jpg";
import salesFundamentals from "@/assets/courses/sales-fundamentals.jpg";

export function CourseIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = ((Icons as unknown as Record<string, LucideIcon>)[name] ??
    Icons.BookOpen) as LucideIcon;
  return <Cmp className={className} />;
}

const covers: Record<string, string> = {
  "sales-fundamentals": salesFundamentals,
  "insurance-sales": insuranceSales,
  "b2b-sales": b2bSales,
  "rental-sales": rentalSales,
  "cold-calling": coldCalling,
  "communication-skills": communicationSkills,
  "closing-techniques": closingTechniques,
  "customer-handling": customerHandling,
  "interview-preparation": interviewPreparation,
  "negotiation-skills": negotiationSkills,
};

export function CourseThumbnail({
  courseId,
  category,
  icon,
  title,
  className = "",
  showCategory = true,
}: {
  courseId?: string;
  category: string;
  icon: string;
  title: string;
  className?: string;
  showCategory?: boolean;
}) {
  const cover = (courseId && covers[courseId]) || salesFundamentals;
  return (
    <div className={`group/thumb relative overflow-hidden rounded-2xl bg-primary ${className}`}>
      <img
        src={cover}
        alt={`${title} course cover`}
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/thumb:scale-105 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-5">
        {showCategory ? (
          <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
            {category}
          </span>
        ) : (
          <span aria-hidden />
        )}
        <div className="flex items-end justify-between gap-3">
          <p className="max-w-[70%] text-lg font-extrabold leading-tight text-white drop-shadow-md">
            {title}
          </p>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/30 bg-white/15 text-white backdrop-blur-md">
            <CourseIcon name={icon} className="h-7 w-7" />
          </span>
        </div>
      </div>
    </div>
  );
}
