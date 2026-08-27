import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

const columns: { title: string; links: string[] }[] = [
  { title: "Quick Links", links: ["Courses", "Learning Paths", "Placement", "Pricing", "Dashboard"] },
  { title: "Career Resources", links: ["Resume Templates", "Interview Guides", "Salary Report", "Blog", "Events"] },
  { title: "Support", links: ["Help Centre", "Contact Us", "Talk to Counselor", "Batch Schedule", "FAQs"] },
  { title: "Policies", links: ["Privacy Policy", "Terms of Use", "Refund Policy", "Code of Conduct"] },
];

const socials = [Linkedin, Instagram, Youtube, Twitter];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden deep-gradient">
      <div className="absolute inset-0 grid-noise opacity-15" />
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="glass-dark grid gap-5 rounded-3xl p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Get career insights, free every week
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hiring trends, interview scripts and new batch alerts. No spam.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              aria-label="Email address"
              className="min-w-0 rounded-xl border border-border bg-primary/10 px-4 py-3 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/20"
            />
            <button className="ripple inline-flex shrink-0 items-center gap-2 rounded-xl gold-gradient px-5 py-3 text-sm font-black text-[oklch(0.24_0.05_80)]">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.4fr)]">
          <div className="min-w-0">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gold-gradient text-[oklch(0.24_0.05_80)]">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-black tracking-tight text-foreground">
                  CareerSync
                </span>
                <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  by BechnaSeekho
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A premium career acceleration platform — practical training, live projects,
              certification and placement assistance with 500+ hiring partners.
            </p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> hello@bechnaseekho.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91 90000 00000
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              {socials.map((S, i) => (
                <span
                  key={i}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-primary/10 text-foreground transition-colors hover:bg-primary/10"
                >
                  <S className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title} className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {col.links.map((l) => (
                    <li key={l}>
                      <span className="cursor-pointer transition-colors hover:text-[var(--gold)]">
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CareerSync by BechnaSeekho. All rights reserved.</p>
          <p>Professional learning for sales, communication and career growth.</p>
        </div>
      </div>
    </footer>
  );
}
