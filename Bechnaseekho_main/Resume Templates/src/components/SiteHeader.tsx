import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/", exact: true },
  { label: "How it works", to: "/how-it-works", exact: false },
  { label: "What you get", to: "/what-you-get", exact: false },
  { label: "Reviews", to: "/reviews", exact: false },
] as const;



export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[auto_1fr_auto]">
        {/* Brand */}
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/favicon.png"
            alt="BechnaSeekho logo"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain"
            draggable={false}
          />
          <span className="min-w-0">
            <span className="block truncate text-xl font-extrabold tracking-tight text-ink">
              Career<span className="text-primary">Sync</span>
            </span>
            <span className="block truncate text-[11px] font-medium text-muted-foreground">
              By BechnaSeekho
            </span>
          </span>
        </Link>

        {/* Pill nav (desktop) */}
        <nav className="hidden justify-center lg:flex">
          <ul className="flex items-center gap-1 rounded-full border border-border/70 bg-secondary/70 p-1.5 shadow-soft backdrop-blur">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.exact ?? false }}
                  activeProps={{ className: "bg-card text-foreground shadow-soft" }}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-full px-4 text-sm font-semibold transition-all duration-200",
                    "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}

          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary sm:inline-flex"
          >
            <User className="size-4" /> Log in
          </button>
          <Button
            className="group hidden rounded-full bg-gradient-to-r from-primary to-brass px-5 shadow-lift sm:inline-flex"
            size="lg"
          >
            Sign up
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 shrink-0 place-items-center rounded-full border bg-card text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.exact }}
                  activeProps={{ className: "bg-secondary" }}
                  className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" className="min-h-11 flex-1 rounded-full">
              Log in
            </Button>
            <Button className="min-h-11 flex-1 rounded-full bg-gradient-to-r from-primary to-brass">
              Sign up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
