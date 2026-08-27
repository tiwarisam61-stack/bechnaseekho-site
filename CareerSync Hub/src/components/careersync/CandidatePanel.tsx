import { Bookmark, CheckCircle2, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import candidateArt from "@/assets/candidate-3d.png";
import { useInView } from "@/hooks/use-reveal";

const checklist = [
  "Create your profile",
  "AI analyzes your resume",
  "Get matched instantly",
  "Apply with one click",
];

const candidates = [
  {
    name: "Riya Sharma",
    role: "Product Designer",
    experience: "5+ yrs",
    location: "Bengaluru",
    match: 95,
    initials: "RS",
  },
  {
    name: "Kabir Mehta",
    role: "Software Engineer",
    experience: "4+ yrs",
    location: "Remote",
    match: 92,
    initials: "KM",
  },
  {
    name: "Ananya Rao",
    role: "Data Analyst",
    experience: "3+ yrs",
    location: "Pune",
    match: 90,
    initials: "AR",
  },
  {
    name: "Ishaan Patel",
    role: "UI/UX Designer",
    experience: "6+ yrs",
    location: "Mumbai",
    match: 88,
    initials: "IP",
  },
];


export function CandidatePanel() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  return (
    <div ref={ref} className="panel panel-lift relative flex h-full flex-col overflow-hidden p-6 sm:p-8">
      <img
        src={candidateArt}
        alt="Candidate discovering matched jobs"
        loading="lazy"
        width={768}
        height={1024}
        className="float-slow pointer-events-none absolute top-1 right-1 hidden w-24 opacity-95 sm:block lg:w-28 xl:w-32"
      />

      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-muted-foreground">
        FOR CANDIDATES
      </span>
      <h3 className="mt-4 max-w-[15ch] pr-0 text-2xl font-extrabold tracking-tight sm:max-w-[16ch] sm:pr-24 sm:text-[28px]">
        Get discovered and hired.
      </h3>


      <div className="mt-6 space-y-6">
        <ul className="grid gap-3.5">
          {checklist.map((item, i) => (
            <li
              key={item}
              data-visible={inView}
              style={{ transitionDelay: `${i * 90}ms` }}
              className="reveal flex items-center gap-3 text-sm font-semibold"
            >
              <CheckCircle2 className="size-5 shrink-0 text-brand" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>

        <div className="min-w-0">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-1.5 pl-4 shadow-[var(--shadow-soft)]">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search jobs, companies or skills"
              placeholder="Search jobs, companies or skills…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              className="bg-gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.04]"
            >
              <Sparkles className="size-3.5" />
              AI Match
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {candidates.map((c, i) => (
              <article
                key={c.name}
                data-visible={inView}
                style={{ transitionDelay: `${200 + i * 120}ms` }}
                className="reveal grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-all duration-400 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="bg-gradient-brand grid size-11 shrink-0 place-items-center rounded-full text-sm font-extrabold text-primary-foreground">
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {c.experience} • {c.location}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-lg bg-emerald-tint px-2 py-1 text-[11px] font-extrabold text-emerald">
                    {c.match}% Match
                  </span>
                  <Bookmark className="size-4 text-muted-foreground transition-colors hover:text-brand" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-2">
          <Users className="size-5 shrink-0 text-brand" />
          <p className="min-w-0 text-sm">
            <span className="font-extrabold">52K+</span>{" "}
            <span className="text-muted-foreground">Learners Hired</span>
          </p>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <TrendingUp className="size-5 shrink-0 text-violet" />
          <p className="min-w-0 text-sm">
            <span className="font-extrabold">92%</span>{" "}
            <span className="text-muted-foreground">Placement Rate</span>
          </p>
        </div>
      </div>
    </div>
  );
}
