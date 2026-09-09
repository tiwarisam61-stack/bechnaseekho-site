import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { NotificationBell } from "@/components/careersync/notification-bell";
import { AuthRoleDropdown } from "@/components/auth/auth-role-dropdown";
import { signOut } from "@/services/platform/auth-service";
import {
  Menu,
  X,
  ArrowRight,
  User,
  ChevronDown,
  FileText,
  Target,
  Map,
  Award,
  UserCheck,
  Star,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

type SubItem = {
  label: string;
  desc: string;
  to: string;
  hash?: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavLink = {
  label: string;
  to?:
    | "/"
    | "/bechnaseekho"
    | "/careersync"
    | "/careersync-academy"
    | "/ai-arena"
    | "/ats-score-checker"
    | "/services"
    | "/resources"
    | "/about";
  href?: string;
  hash?: string;
  isNew?: boolean;
  newTab?: boolean;
  children?: SubItem[];
  featured?: { title: string; desc: string; cta: string; to: string };
};

const links: NavLink[] = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "CareerSync",
    to: "/careersync",
    newTab: true,
  },
  {
    label: "AI Arena",
    href: "/interview-practice.html",
  },
  {
    label: "BechnaSeekho Academy",
    to: "/careersync-academy",
    isNew: true,
  },
  {
    label: "About",
    to: "/about",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [coursesInView, setCoursesInView] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isBechnaSeekhoPage = pathname.startsWith("/bechnaseekho");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const { isAuthed, user } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const el = document.getElementById("courses");
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setCoursesInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Close dropdown on outside click, Esc, and route change
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) setActive(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    setActive(null);
  }, [pathname]);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 160);
  };
  const toggleMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive((cur) => (cur === label ? null : label));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto max-w-[1400px]">
        <div
          className={`relative flex items-center justify-between rounded-full pl-2 pr-2 py-3 transition-all duration-500 ${
            scrolled
              ? "bg-white/60 backdrop-blur-2xl ring-1 ring-white/60 shadow-[0_24px_70px_-24px_oklch(0.55_0.22_264/0.4)]"
              : "bg-white/50 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_12px_44px_-22px_oklch(0.55_0.22_264/0.25)]"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 rounded-full opacity-70 [background:linear-gradient(120deg,transparent,color-mix(in_oklab,var(--brand)_10%,transparent),transparent)]" />

          {/* Logo */}
          <Link
            to={isBechnaSeekhoPage ? "/bechnaseekho" : "/"}
            className="relative flex items-center gap-3 pl-2 pr-3 shrink-0 group"
            aria-label="BechnaSeekho home"
          >
            <motion.img
              src="/favicon.png"
              alt="BechnaSeekho logo"
              width={44}
              height={44}
              whileHover={{ rotate: 6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain select-none"
              draggable={false}
            />
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Bechna<span className="text-gradient-brand">Seekho</span>
            </span>
          </Link>

          {/* Center nav */}
          <nav
            ref={navRef}
            className="relative hidden items-center gap-0.5 rounded-full bg-surface/60 p-1 ring-1 ring-line/60 lg:flex"
            onMouseLeave={scheduleClose}
          >
            {links.map((l) => {
              const targetPath = l.href ?? l.to;
              const isActive = l.hash ? coursesInView : pathname === targetPath || (l.label === "AI Arena" && pathname === "/ai-arena");
              const isOpen = active === l.label;
              const hasMenu = !!l.children?.length;

              const pill = (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_6px_16px_-6px_oklch(0.55_0.22_264/0.35)] ring-1 ring-line/70"
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                  {l.isNew && (
                    <span className="relative z-10 ml-1 rounded-full bg-gradient-to-r from-brand to-brand-2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm">
                      New
                    </span>
                  )}
                  {hasMenu && (
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </motion.span>
                  )}
                </>
              );

              const baseCls = `relative flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                isActive ? "text-ink" : "text-ink-soft hover:text-ink"
              }`;

              return (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasMenu) openMenu(l.label);
                    else setActive(null);
                  }}
                >
                  {hasMenu ? (
                    <button
                      type="button"
                      onClick={() => toggleMenu(l.label)}
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      className={baseCls}
                    >
                      {pill}
                    </button>
                  ) : l.href ? (
                    <a href={l.href} className={baseCls} onClick={() => setActive(null)}>
                      {pill}
                    </a>
                  ) : l.hash ? (
                    <a
                      href={l.hash}
                      className={baseCls}
                      onClick={(e) => {
                        e.preventDefault();
                        document.querySelector(l.hash!)?.scrollIntoView({ behavior: "smooth" });
                        setActive(null);
                      }}
                    >
                      {pill}
                    </a>
                  ) : l.newTab ? (
                    <a
                      href={l.to!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={baseCls}
                      onClick={() => setActive(null)}
                    >
                      {pill}
                    </a>
                  ) : (
                    <Link to={l.to!} className={baseCls} onClick={() => setActive(null)}>
                      {pill}
                    </Link>
                  )}
                </div>
              );
            })}

            <AnimatePresence>
              {active && (
                <MegaMenu
                  link={links.find((l) => l.label === active)!}
                  parentTo={links.find((l) => l.label === active)!.to!}
                  onEnter={() => openMenu(active)}
                  onLeave={scheduleClose}
                  onClose={() => setActive(null)}
                />
              )}
            </AnimatePresence>
          </nav>

          {/* Right */}
          <div className="hidden items-center gap-2 pr-1 lg:flex">
            {isAuthed ? (
              <>
                <NotificationBell />
                <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink ring-1 ring-line">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-[10px] font-bold text-white">
                    {(user?.email?.[0] ?? "U").toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-ink ring-1 ring-line hover:bg-surface"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <>
                <AuthRoleDropdown
                  label="Log in"
                  icon={<User className="h-4 w-4" />}
                  buttonClassName="group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-surface"
                  route="/login"
                />
                <AuthRoleDropdown
                  label="Sign Up"
                  icon={<ArrowRight className="h-3.5 w-3.5" />}
                  buttonClassName="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-brand via-brand-2 to-brand bg-[length:200%_100%] px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-8px_oklch(0.55_0.22_264/0.6)] transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-[0_16px_36px_-8px_oklch(0.55_0.22_264/0.7)]"
                  route="/signup"
                  iconPosition="right"
                />
              </>
            )}
          </div>

          <button
            className="mr-1 grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-line lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-3 mt-2 max-h-[80vh] overflow-y-auto rounded-3xl glass-strong p-3 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <MobileLink
                  key={l.label}
                  link={l}
                  onClose={() => setMobileOpen(false)}
                  active={l.hash ? coursesInView : pathname === (l.href ?? l.to)}
                />
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line"
                >
                  <User className="h-3.5 w-3.5" /> Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary justify-center !py-2.5 !text-sm"
                >
                  Sign up <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MegaMenu({
  link,
  parentTo,
  onEnter,
  onLeave,
  onClose,
}: {
  link: NavLink;
  parentTo: NonNullable<NavLink["to"]>;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  if (!link.children?.length) return null;
  const hasFeature = !!link.featured;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`absolute left-1/2 top-[calc(100%+10px)] z-50 -translate-x-1/2 ${hasFeature ? "w-[640px]" : "w-[420px]"}`}
    >
      <div className="absolute -top-3 left-0 right-0 h-3" />
      <div className="overflow-hidden rounded-3xl bg-white/95 p-3 shadow-[0_30px_70px_-20px_oklch(0.55_0.22_264/0.35)] ring-1 ring-line backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between px-2 pt-1">
          <Link
            to={parentTo}
            onClick={onClose}
            className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft hover:text-brand"
          >
            {link.label} overview →
          </Link>
        </div>
        <div className={`grid gap-3 ${hasFeature ? "grid-cols-[1fr_220px]" : ""}`}>
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.03 } } }}
            className="grid grid-cols-2 gap-1"
          >
            {link.children.map((c) => (
              <motion.li
                key={c.label}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to={c.to}
                  onClick={onClose}
                  className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-surface"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/10 to-brand-2/10 text-brand transition-transform group-hover:scale-105 group-hover:from-brand group-hover:to-brand-2 group-hover:text-white">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{c.label}</p>
                    <p className="mt-0.5 text-xs leading-snug text-ink-soft">{c.desc}</p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
          {hasFeature && (
            <Link
              to={link.featured!.to as "/signup"}
              onClick={onClose}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-brand-2 to-cyan p-4 text-white"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <p className="font-display text-base font-bold leading-tight">
                  {link.featured!.title}
                </p>
                <p className="mt-1.5 text-xs text-white/85">{link.featured!.desc}</p>
              </div>
              <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                {link.featured!.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MobileLink({
  link,
  active,
  onClose,
}: {
  link: NavLink;
  active: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!link.children?.length;
  return (
    <div className="rounded-2xl">
      {hasChildren ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium hover:bg-surface ${
            active ? "bg-white text-brand ring-1 ring-line" : "text-ink"
          }`}
        >
          <span className="flex items-center gap-2">
            {link.label}
            {link.isNew && (
              <span className="rounded-full bg-gradient-to-r from-brand to-brand-2 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                NEW
              </span>
            )}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      ) : link.hash ? (
        <a
          href={link.hash}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(link.hash!)?.scrollIntoView({ behavior: "smooth" });
            onClose();
          }}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium hover:bg-surface ${
            active ? "bg-white text-brand ring-1 ring-line" : "text-ink"
          }`}
        >
          <span className="flex items-center gap-2">{link.label}</span>
        </a>
      ) : link.href ? (
        <a
          href={link.href}
          onClick={onClose}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium hover:bg-surface ${
            active ? "bg-white text-brand ring-1 ring-line" : "text-ink"
          }`}
        >
          <span className="flex items-center gap-2">
            {link.label}
            {link.isNew && (
              <span className="rounded-full bg-gradient-to-r from-brand to-brand-2 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                NEW
              </span>
            )}
          </span>
        </a>
      ) : link.newTab ? (
        <a
          href={link.to!}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium hover:bg-surface ${
            active ? "bg-white text-brand ring-1 ring-line" : "text-ink"
          }`}
        >
          <span className="flex items-center gap-2">{link.label}</span>
        </a>
      ) : (
        <Link
          to={link.to!}
          onClick={onClose}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium hover:bg-surface ${
            active ? "bg-white text-brand ring-1 ring-line" : "text-ink"
          }`}
        >
          <span className="flex items-center gap-2">
            {link.label}
            {link.isNew && (
              <span className="rounded-full bg-gradient-to-r from-brand to-brand-2 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                NEW
              </span>
            )}
          </span>
        </Link>
      )}

      <AnimatePresence>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden pl-3"
          >
            <div className="my-1 space-y-0.5 border-l border-line pl-2">
              <Link
                to={link.to!}
                onClick={onClose}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand hover:bg-surface"
              >
                {link.label} overview →
              </Link>
              {link.children!.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-surface hover:text-ink"
                >
                  <c.icon className="h-3.5 w-3.5 text-brand" />
                  <span>{c.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
