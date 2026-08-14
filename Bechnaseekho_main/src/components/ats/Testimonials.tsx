import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Aditi Sharma",
    role: "Product Analyst · hired at a fintech",
    quote:
      "My resume was silently failing the parser. CareerSync showed me the exact two columns that broke it. Three interviews the following week.",
    initials: "AS",
  },
  {
    name: "Rahul Verma",
    role: "Final-year student · campus placement",
    quote:
      "It read like a recruiter, not a robot. The one-click fixes took my score from 61 to 89 in about four minutes.",
    initials: "RV",
  },
  {
    name: "Meera Iyer",
    role: "Engineering Manager",
    quote:
      "I screen resumes for a living and the keyword findings matched what our ATS actually surfaces. Genuinely useful.",
    initials: "MI",
  },
  {
    name: "Daniel Okafor",
    role: "Data Scientist",
    quote:
      "The recruiter-impression section was uncomfortably accurate. Rewrote my summary using its suggestions and got a callback.",
    initials: "DO",
  },
  {
    name: "Sana Qureshi",
    role: "UX Designer",
    quote:
      "Every other checker gave me a number. This one told me why, where, and fixed it while I watched.",
    initials: "SQ",
  },
];

function Card({ r, delayMs }: { r: (typeof REVIEWS)[number]; delayMs: number }) {
  return (
    <figure
      className="surface-card animate-fade-up flex h-full flex-col p-6"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex gap-0.5" aria-label="5 out of 5 stars">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="size-3.5 fill-accent text-accent" aria-hidden="true" />
        ))}
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-foreground">“{r.quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-xs font-extrabold text-primary">
          {r.initials}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-bold text-foreground">{r.name}</span>
          <span className="block text-xs text-muted-foreground">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="reviews-heading" className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Trusted by job seekers
        </span>
        <h2
          id="reviews-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          What people say after their first scan
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <Card key={r.name} r={r} delayMs={(i % 3) * 90} />
        ))}
      </div>
    </section>
  );
}
