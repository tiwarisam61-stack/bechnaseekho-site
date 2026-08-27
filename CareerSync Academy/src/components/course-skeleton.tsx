export function CourseCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="glass-card gradient-frame overflow-hidden rounded-3xl"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-hidden="true"
    >
      <div className="skeleton h-40 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-5 w-4/5 rounded-lg" />
        <div className="skeleton h-3.5 w-full rounded-lg" />
        <div className="skeleton h-3.5 w-2/3 rounded-lg" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
        <div className="skeleton h-2 w-full rounded-full" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-label="Loading courses"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} index={i} />
      ))}
      <span className="sr-only">Loading courses…</span>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass-card gradient-frame rounded-3xl p-5" aria-hidden="true">
      <div className="skeleton h-11 w-11 rounded-2xl" />
      <div className="skeleton mt-3 h-7 w-24 rounded-lg" />
      <div className="skeleton mt-2 h-4 w-28 rounded-lg" />
      <div className="skeleton mt-2 h-3 w-32 rounded-lg" />
    </div>
  );
}
