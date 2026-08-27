import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, LayoutDashboard, Library, Sparkles } from "lucide-react";

const navLinkClass =
  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6">
        {/* Brand pill */}
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 rounded-2xl bg-card px-4 py-2.5 soft-shadow"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient text-primary-foreground">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="min-w-0 truncate text-lg font-extrabold tracking-tight">
              Bechnaseekho
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Academy
            </span>
          </div>
        </Link>

        {/* Center nav pill */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-2xl bg-card px-2 py-2 soft-shadow md:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-primary-soft text-primary" }}
            className={navLinkClass}
          >
            <Library className="h-4 w-4" />
            Courses
          </Link>
          <Link
            to="/downloads"
            activeProps={{ className: "bg-primary-soft text-primary" }}
            className={navLinkClass}
          >
            <Download className="h-4 w-4" />
            Download
          </Link>
          <Link
            to="/dashboard"
            activeProps={{ className: "bg-primary-soft text-primary" }}
            className={navLinkClass}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>

        {/* Mobile nav (compact) */}
        <nav className="flex items-center gap-1 rounded-2xl bg-card px-2 py-2 soft-shadow md:hidden">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-primary-soft text-primary" }}
            className={navLinkClass}
          >
            <Library className="h-4 w-4" />
          </Link>
          <Link
            to="/downloads"
            aria-label="Download centre"
            activeProps={{ className: "bg-primary-soft text-primary" }}
            className={navLinkClass}
          >
            <Download className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard"
            activeProps={{ className: "bg-primary-soft text-primary" }}
            className={navLinkClass}
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        </nav>

        {/* Auth pill */}
        <div className="flex items-center gap-1 rounded-2xl bg-card px-2 py-2 soft-shadow">
          <button
            type="button"
            className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Sign in
          </button>
          <button
            type="button"
            className="btn-glow inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Sign up <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </header>
  );
}
