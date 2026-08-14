import { Home, BarChart3, Briefcase, GraduationCap, Compass, Heart } from "lucide-react";

const items = [
  { icon: Home, label: "Home", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: Briefcase, label: "Jobs" },
  { icon: GraduationCap, label: "Learning" },
  { icon: Compass, label: "Roadmap" },
  { icon: Heart, label: "Saved" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="flex flex-col items-center gap-1 rounded-3xl bg-white p-2 shadow-[0_20px_50px_-20px_rgba(37,99,235,0.25)] ring-1 ring-line">
        {items.map((it) => (
          <button
            key={it.label}
            aria-label={it.label}
            className={`relative grid h-11 w-11 place-items-center rounded-2xl transition-colors ${
              it.active
                ? "bg-brand/10 text-brand"
                : "text-ink-soft hover:bg-surface hover:text-ink"
            }`}
          >
            <it.icon className="h-5 w-5" />
            {it.active && (
              <span className="absolute -bottom-0.5 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-brand" />
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
