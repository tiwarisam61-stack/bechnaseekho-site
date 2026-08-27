import {
  BadgeCheck,
  Bot,
  FileDown,
  MousePointerClick,
  Search,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl">How it works</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Three steps from blank page to a recruiter-ready resume — usually under five minutes.
          </p>
        </div>
        <ol className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: MousePointerClick,
              title: "Pick a template",
              body: "Choose from 30 ATS-safe layouts built for your role and experience level.",
            },
            {
              icon: Bot,
              title: "Let AI fill it in",
              body: "Upload an old resume or write with the AI assistant — bullet points, summary and skills.",
            },
            {
              icon: FileDown,
              title: "Export and apply",
              body: "Download a pixel-perfect PDF or editable Word file, named and formatted for recruiters.",
            },
          ].map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border bg-card p-6 shadow-soft transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-brass text-primary-foreground">
                <step.icon className="size-5" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Step {i + 1}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhatYouGetSection() {
  return (
    <section id="what-you-get" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl">What you get</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything in one studio — no plugins, no subscriptions to read your own file.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: BadgeCheck, title: "Live ATS scoring", body: "Real-time score with plain-English fixes for keywords, formatting and impact." },
            { icon: Sparkles, title: "30 premium templates", body: "Profession-specific designs, photo and no-photo variants, all one-page friendly." },
            { icon: Bot, title: "AI writing assistant", body: "Rewrite, shorten, quantify or tune the tone of any bullet in one tap." },
            { icon: FileDown, title: "PDF & Word export", body: "WYSIWYG PDF plus a fully editable DOCX, auto-named for each application." },
            { icon: TrendingUp, title: "Version history", body: "Save snapshots and roll back instantly while tailoring to different jobs." },
            { icon: Search, title: "Instant resume import", body: "Upload a PDF or DOCX and every field is parsed and mapped automatically." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-soft">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <f.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-foreground">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl">Reviews</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Real notes from graduates, career switchers and senior hires who built their resume here.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Ayesha K.", role: "Software Engineer, Lahore", stars: 5, quote: "Honestly I only wanted a nicer layout. Then it rewrote my bullets and the score went 61 → 94. Three callbacks that same week, one of them Systems Ltd." },
            { name: "Daniyal R.", role: "Marketing Lead", stars: 5, quote: "I never understood why recruiters ignored my CV. The live score literally told me in plain words: no numbers, too many buzzwords. Fixed both in 20 minutes." },
            { name: "Sana M.", role: "Product Designer", stars: 5, quote: "The photo template cropped my headshot better than I did in Photoshop, and the PDF came out exactly like the preview. That never happens." },
            { name: "Hamza T.", role: "Final year student, FAST", stars: 5, quote: "First resume of my life. I had zero experience and still ended up with something that didn't look empty. Took me maybe 15 minutes between classes." },
            { name: "Fatima N.", role: "HR Generalist → Recruiter", stars: 4, quote: "I screen resumes for a living, so I was ready to be picky. Formatting is genuinely ATS-safe. Only thing I'd want is more section templates for HR-specific roles." },
            { name: "Bilal A.", role: "Data Analyst", stars: 5, quote: "The 'quantify this' button is unfair. It kept nudging me until every bullet had a number in it. My old resume had exactly one." },
            { name: "Mehak S.", role: "Career switcher, teacher → UX", stars: 5, quote: "Switching fields is brutal because nothing on your CV matches. The AI helped me reframe classroom work as research and user testing. Got my first interview after two years of trying." },
            { name: "Usman Q.", role: "Engineering Manager", stars: 5, quote: "Used it to tailor one base resume into four versions for four job posts. Version history meant I never lost the good one. Word export opened cleanly for the recruiter too." },
            { name: "Zara H.", role: "Content Writer", stars: 4, quote: "Love it. Wrote my whole summary in one go. Small thing — I wish the mobile editor remembered my scroll position, but the wizard on phone is smooth otherwise." },
            { name: "Ali Raza", role: "Mechanical Engineer", stars: 5, quote: "My old CV was a Word file from 2019 with a table in it. Uploaded it, everything got pulled out correctly, and it warned me the table was breaking ATS parsing." },
            { name: "Nimra J.", role: "Fresh graduate, BBA", stars: 5, quote: "I was applying with a Canva resume and getting nothing back. Same content, different template here, and suddenly companies started replying. That says enough." },
            { name: "Faisal M.", role: "Sales Manager, 12 yrs", stars: 5, quote: "At my level everyone tells you to keep it one page. It actually showed me what to cut instead of just saying it. Downloaded, applied, done in under an hour." },
          ].map((r) => (
            <figure key={r.name} className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-soft transition-shadow hover:shadow-lg">
              <div className="flex gap-0.5 text-brass">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={i < r.stars ? "size-4 fill-current" : "size-4 text-muted-foreground/30"} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">“{r.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-brass text-sm font-bold text-primary-foreground">
                  {r.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">{r.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}

        </div>
      </div>
    </section>
  );
}
