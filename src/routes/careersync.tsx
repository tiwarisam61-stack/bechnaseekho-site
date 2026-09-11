import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  FileText,
  Users,
  Star,
  BarChart2,
  Calculator,
  GraduationCap,
  ArrowRight,
  User,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  UserCircle2,
  LogOut,
  Upload,
  CheckCircle2,
  X as CloseIcon,
  BookOpen,
  Bot,
} from "lucide-react";
import { type ChangeEvent, type DragEvent } from "react";
import { CareerSyncLoginPopup } from "@/components/careersync/login-popup";
import { CareerSyncCompaniesMarquee } from "@/components/careersync/companies-marquee";
import { CareerSyncJobsSection } from "@/components/careersync/jobs-section";
import { CareerPassportComingSoon } from "@/components/careersync/career-passport-coming-soon";
import { MockInterviewAnnouncementCard } from "@/components/careersync/mock-interview-announcement-card";
import { CareerSyncDashboard } from "@/components/careersync/dashboard";
import { NotificationBell } from "@/components/careersync/notification-bell";
import { CareerSyncWorkspaceShell } from "@/components/careersync/workspace-shell";
import { AuthRoleDropdown } from "@/components/auth/auth-role-dropdown";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { WhatsAppFab } from "@/components/landing/whatsapp-fab";

import { BLOGS } from "@/lib/blogs";
import { submitToGoogleSheet } from "@/lib/google-sheet-submit";

import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { signOut } from "@/services/platform/auth-service";

export const Route = createFileRoute("/careersync")({
  head: () => ({
    meta: [
      { title: "CareerSync — Find Jobs, Build Skills | BechnaSeekho" },
      {
        name: "description",
        content:
          "CareerSync by BechnaSeekho: discover jobs, build skills with resume tools and mock interviews, and land your dream role.",
      },
      { property: "og:title", content: "CareerSync — Find Jobs, Build Skills" },
      {
        property: "og:description",
        content: "Career platform. Jobs, resume builder, interview prep — all in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareerSyncRouteShell,
});

function CareerSyncRouteShell() {
  const pathname = typeof window === "undefined" ? "/careersync" : window.location.pathname;
  if (pathname === "/careersync" || pathname === "/careersync/") {
    return <CareerSyncPage />;
  }
  return <Outlet />;
}

type NavLink = {
  label: string;
  href?: string;
  to?:
    | "/careersync"
    | "/careersync/about"
    | "/careersync/blogs"
    | "/careersync/verified-recruiters"
    | "/resources"
    | "/pricing"
    | "/ats-score-checker"
    | "/resume-templates"
    | "/careersync-academy"
    | "/ai-arena";
  newTab?: boolean;
  children?: {
    label: string;
    desc: string;
    to?: "/resources" | "/pricing" | "/ats-score-checker" | "/resume-templates" | "/ai-arena";
    upcoming?: boolean;
  }[];
};
const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Bechnaseekho Academy", href: "/" },
  { label: "Jobs", href: "#jobs" },
  {
    label: "AI Arena",
    children: [
      {
        label: "AI Interview Practice",
        desc: "Practice role-specific interviews and get a scorecard",
        to: "/ai-arena",
      },
      {
        label: "ATS Score Checker",
        desc: "Check and improve your resume match score",
        to: "/ats-score-checker",
      },
      {
        label: "Resume Templates",
        desc: "ATS-friendly resume templates for every role",
        to: "/resume-templates",
      },
      {
        label: "Salary Calculator",
        desc: "Estimate your salary by role, experience and location",
        upcoming: true,
      },
    ],
  },
  { label: "Verified Recruiters", to: "/careersync/verified-recruiters" },
  { label: "About", to: "/careersync/about", newTab: true },
];

export function CareerSyncNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("Home");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [pathname, setPathname] = useState("");
  const { user: navUser } = useAuth();
  const isAuthenticated = Boolean(navUser);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setPathname(window.location.pathname);
    const current = NAV_LINKS.find((link) => link.to === pathname);
    if (current) setActive(current.label);
  }, [pathname]);

  return (
    <motion.header
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <div className="mx-auto max-w-[1400px]">
        <div
          className={`relative flex items-center justify-between rounded-full pl-2 pr-2 py-3 transition-all duration-500 ${
            scrolled
              ? "bg-white/60 backdrop-blur-2xl ring-1 ring-white/60 shadow-[0_24px_70px_-24px_rgba(37,99,235,0.4)]"
              : "bg-white/50 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_12px_44px_-22px_rgba(37,99,235,0.25)]"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 rounded-full opacity-70 [background:linear-gradient(120deg,transparent,rgba(59,130,246,0.10),transparent)]" />

          {/* Logo */}
          <Link
            to="/"
            className="relative flex items-center gap-2.5 pl-2 pr-3 shrink-0 group"
            aria-label="Back to BechnaSeekho home"
          >
            <motion.img
              src="/favicon.png"
              alt="BechnaSeekho logo"
              width={40}
              height={40}
              whileHover={{ rotate: 4, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-10 w-10 object-contain drop-shadow-[0_8px_20px_rgba(37,99,235,0.35)]"
              draggable={false}
            />
            <div className="leading-tight">
              <div
                className="font-extrabold text-[19px] tracking-tight"
                style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
              >
                <span style={{ color: "#0F172A" }}>Career</span>
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg,#2563EB 0%,#3B82F6 55%,#06B6D4 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Sync
                </span>
              </div>
              <div className="text-gray-400 text-[10px] font-medium -mt-0.5">By BechnaSeekho</div>
            </div>
          </Link>

          {/* Center nav */}
          <nav
            className={`relative hidden min-w-0 items-center rounded-full bg-white/60 p-1 ring-1 ring-blue-100/70 lg:flex ${isAuthenticated ? "gap-0" : "gap-0.5"}`}
          >
            {NAV_LINKS.map((l) => {
              const isActive = active === l.label;
              const hasMenu = !!l.children?.length;
              const isOpen = openMenu === l.label;
              const cls = `relative flex items-center gap-1 whitespace-nowrap rounded-full py-2 transition-colors ${isAuthenticated ? "px-3 text-sm font-medium" : "px-4 text-[15px] font-semibold"} ${
                isActive ? "text-[#1a2a4a]" : "text-gray-500 hover:text-[#1a2a4a]"
              }`;
              const inner = (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="cs-nav-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_6px_16px_-6px_rgba(37,99,235,0.35)] ring-1 ring-blue-100"
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                  {hasMenu && (
                    <ChevronDown
                      className={`relative z-10 h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </>
              );
              if (hasMenu) {
                return (
                  <div
                    key={l.label}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(l.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMenu((cur) => (cur === l.label ? null : l.label))}
                      className={cls}
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                    >
                      {inner}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.08 }}
                          className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3"
                        >
                          <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
                            {l.children!.map((item) => {
                              const isUpcoming = item.upcoming || !item.to;
                              const iconWrapClass = isUpcoming
                                ? "bg-amber-50"
                                : item.to === "/ats-score-checker"
                                  ? "bg-indigo-50"
                                  : item.label === "Salary Calculator"
                                    ? "bg-emerald-50"
                                    : "bg-blue-50";

                              const iconNode = isUpcoming ? (
                                <Bot className="h-5 w-5 text-amber-600" />
                              ) : item.to === "/ats-score-checker" ? (
                                <BarChart2 className="h-5 w-5 text-indigo-600" />
                              ) : item.label === "Salary Calculator" ? (
                                <Calculator className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <FileText className="h-5 w-5 text-blue-600" />
                              );

                              const content = (
                                <>
                                  <div
                                    className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ${iconWrapClass}`}
                                  >
                                    {iconNode}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-[#1a2a4a]">
                                      <span>{item.label}</span>
                                      {isUpcoming && (
                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                                          Coming Soon
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">{item.desc}</div>
                                  </div>
                                </>
                              );

                              if (isUpcoming) {
                                return (
                                  <div
                                    key={item.label}
                                    className="flex cursor-not-allowed items-start gap-3 rounded-xl px-3 py-2.5 text-left"
                                  >
                                    {content}
                                  </div>
                                );
                              }

                              return (
                                <Link
                                  key={item.label}
                                  to={item.to!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => {
                                    setActive(l.label);
                                    setOpenMenu(null);
                                  }}
                                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50/70"
                                >
                                  {content}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return l.to ? (
                <Link
                  key={l.label}
                  to={l.to}
                  target={l.newTab ? "_blank" : undefined}
                  rel={l.newTab ? "noopener noreferrer" : undefined}
                  onClick={() => setActive(l.label)}
                  className={cls}
                >
                  {inner}
                </Link>
              ) : (
                <a key={l.label} href={l.href} onClick={() => setActive(l.label)} className={cls}>
                  {inner}
                </a>
              );
            })}
          </nav>

          {/* Right */}
          <div className="hidden items-center gap-2 pr-1 lg:flex">
            <PostJobNavButton />
            <AuthArea />
          </div>

          <button
            className="mr-1 grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-blue-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-3 mt-2 rounded-3xl bg-white/90 backdrop-blur-xl ring-1 ring-blue-100 shadow-xl p-3 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => {
                const hasMenu = !!l.children?.length;
                const cls = `rounded-2xl px-4 py-3 text-sm font-semibold ${
                  active === l.label
                    ? "bg-blue-50 text-blue-600"
                    : "text-[#1a2a4a] hover:bg-blue-50/60"
                }`;
                if (hasMenu) {
                  return (
                    <div key={l.label} className="rounded-2xl bg-white/70 ring-1 ring-blue-100">
                      <div className={cls} onClick={() => setActive(l.label)}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between text-left"
                          onClick={() => setActive(l.label)}
                        >
                          <span>{l.label}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="px-2 pb-2">
                        {l.children!.map((item) => {
                          const isUpcoming = item.upcoming || !item.to;
                          const iconWrapClass = isUpcoming
                            ? "bg-amber-50"
                            : item.to === "/ats-score-checker"
                              ? "bg-indigo-50"
                              : item.label === "Salary Calculator"
                                ? "bg-emerald-50"
                                : "bg-blue-50";

                          const iconNode = isUpcoming ? (
                            <Bot className="h-4 w-4 text-amber-600" />
                          ) : item.to === "/ats-score-checker" ? (
                            <BarChart2 className="h-4 w-4 text-indigo-600" />
                          ) : item.label === "Salary Calculator" ? (
                            <Calculator className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <FileText className="h-4 w-4 text-blue-600" />
                          );

                          const content = (
                            <>
                              <div
                                className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${iconWrapClass}`}
                              >
                                {iconNode}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 text-sm font-bold text-[#1a2a4a]">
                                  <span>{item.label}</span>
                                  {isUpcoming && (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                                      Coming Soon
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">{item.desc}</div>
                              </div>
                            </>
                          );

                          if (isUpcoming) {
                            return (
                              <div
                                key={item.label}
                                className="mt-1 flex cursor-not-allowed items-start gap-3 rounded-xl px-3 py-2.5 text-left"
                              >
                                {content}
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={item.label}
                              to={item.to!}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                setActive(l.label);
                                setMobileOpen(false);
                              }}
                              className="mt-1 flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50/70"
                            >
                              {content}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return l.to ? (
                  <Link
                    key={l.label}
                    to={l.to}
                    target={l.newTab ? "_blank" : undefined}
                    rel={l.newTab ? "noopener noreferrer" : undefined}
                    onClick={() => {
                      setActive(l.label);
                      setMobileOpen(false);
                    }}
                    className={cls}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => {
                      setActive(l.label);
                      setMobileOpen(false);
                    }}
                    className={cls}
                  >
                    {l.label}
                  </a>
                );
              })}

              <MobileAuthArea onClose={() => setMobileOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* -------------------------------------------------------------
   Post a Job — always visible; /post-job itself enforces
   login + company/admin-only access and shows the right prompts.
   ------------------------------------------------------------- */
function PostJobNavButton() {
  const { user } = useAuth();

  return (
    <Link
      to="/post-job"
      className={`inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white text-[#1a2a4a] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md ${user ? "px-3 py-1.5 text-[13px] font-medium" : "px-4 py-2 text-sm font-semibold"}`}
    >
      <Briefcase className={user ? "h-3 w-3 text-blue-600" : "h-3.5 w-3.5 text-blue-600"} /> Post a
      Job
    </Link>
  );
}

/* -------------------------------------------------------------
   Auth area with hover dropdowns for Candidate / Recruiter
   ------------------------------------------------------------- */
function AuthArea() {
  const { user, loading } = useAuth();
  const { role } = useRole();

  if (loading) return <div className="h-10 w-40 animate-pulse rounded-full bg-blue-50" />;

  if (user) {
    const displayName =
      (user.user_metadata?.full_name as string | undefined)?.trim() ||
      user.email?.split("@")[0] ||
      "CareerSync user";
    const roleLabel = role?.toUpperCase();

    return (
      <>
        <a
          href="/careersync?workspace=1"
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-2 text-[13px] font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <BarChart2 className="h-3.5 w-3.5" />
          Dashboard
        </a>
        <NotificationBell compact className="hidden lg:block" />
        <div
          className="inline-flex min-w-0 max-w-[170px] items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-[13px] font-semibold text-[#1a2a4a]"
          title={displayName}
        >
          <UserCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
          <span className="min-w-0 truncate">{displayName}</span>
          {roleLabel && (
            <span className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600 ring-1 ring-blue-100">
              {roleLabel}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            void signOut();
          }}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 hover:text-[#1a2a4a]"
          title="Log out"
          aria-label="Log out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </>
    );
  }

  return (
    <>
      <AuthRoleDropdown
        label="Log in"
        icon={<User className="h-3.5 w-3.5" />}
        buttonClassName="group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[15px] font-semibold text-[#1a2a4a] transition-colors hover:bg-blue-50"
        route="/login"
      />
      <AuthRoleDropdown
        label="Sign up"
        icon={<ArrowRight className="h-3.5 w-3.5" />}
        buttonClassName="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] transition-all duration-500 hover:bg-[position:100%_0]"
        route="/signup"
        iconPosition="right"
      />
    </>
  );
}

function MobileAuthArea({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { role } = useRole();

  const postJobButton = (
    <Link
      to="/post-job"
      onClick={onClose}
      className="flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#1a2a4a] ring-1 ring-blue-200"
    >
      <Briefcase className="h-4 w-4 text-blue-600" /> Post a Job
    </Link>
  );

  if (user) {
    const displayName =
      (user.user_metadata?.full_name as string | undefined)?.trim() ||
      user.email?.split("@")[0] ||
      "CareerSync user";
    const roleLabel = role?.toUpperCase();

    return (
      <div className="mt-2 space-y-2">
        <a
          href="/careersync?workspace=1"
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-3 text-sm font-bold text-white"
        >
          <BarChart2 className="h-4 w-4" /> Open Dashboard
        </a>
        {postJobButton}
        <div className="flex justify-end">
          <NotificationBell />
        </div>
        <div className="flex items-center justify-between rounded-full bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[#1a2a4a]">
          <span className="min-w-0 truncate">
            {displayName}
            {roleLabel ? ` · ${roleLabel}` : ""}
          </span>
          <button
            onClick={() => {
              void signOut();
              onClose();
            }}
            className="text-gray-500 hover:text-[#1a2a4a]"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-2 space-y-2">
      {postJobButton}
      <div className="grid grid-cols-2 gap-2">
        <Link
          to="/login"
          search={{ role: "candidate" }}
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 text-xs font-semibold text-[#1a2a4a] ring-1 ring-blue-100"
        >
          Login · Candidate
        </Link>
        <Link
          to="/login"
          search={{ role: "company" }}
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 text-xs font-semibold text-[#1a2a4a] ring-1 ring-emerald-100"
        >
          Login · Company
        </Link>
        <Link
          to="/login"
          search={{ role: "employee" }}
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 text-xs font-semibold text-[#1a2a4a] ring-1 ring-amber-100"
        >
          Login · Employee
        </Link>
        <Link
          to="/signup"
          search={{ role: "candidate" }}
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2.5 text-xs font-semibold text-white shadow-md"
        >
          Signup · Candidate
        </Link>
        <Link
          to="/signup"
          search={{ role: "company" }}
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2.5 text-xs font-semibold text-white shadow-md"
        >
          Signup · Company
        </Link>
        <Link
          to="/signup"
          search={{ role: "employee" }}
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2.5 text-xs font-semibold text-white shadow-md"
        >
          Signup · Employee
        </Link>
      </div>
    </div>
  );
}

function CareerSyncPage() {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("workspace") === "1";
  });

  useEffect(() => {
    if (user && role === "admin") {
      setShowWorkspace(true);
    }
  }, [role, user]);

  if (showWorkspace && user && role) {
    return <CareerSyncWorkspaceShell />;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <CareerSyncLoginPopup />
      <ResumeUploadModal open={showResumeModal} onClose={() => setShowResumeModal(false)} />
      <CareerSyncNavbar />
      {/* spacer for fixed navbar */}
      <div className="h-24" />

      {user && role && (
        <section className="mx-auto max-w-7xl px-6 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                Signed in as {role}
              </p>
              <p className="text-sm text-slate-700">
                You are on the public CareerSync landing page. Open your workspace when you are
                ready.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowWorkspace(true)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
            >
              Open Workspace <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* HERO */}
      <section
        id="home"
        className="max-w-7xl mx-auto px-6 pt-10 pb-4 grid lg:grid-cols-2 gap-10 items-center min-h-[82vh] scroll-mt-24"
      >
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full w-fit">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Career Platform
          </div>

          <div className="space-y-1">
            <h1 className="text-5xl xl:text-6xl font-black text-[#1a2a4a] leading-tight">
              Find Jobs.
            </h1>
            <h1 className="text-5xl xl:text-6xl font-black text-[#1a2a4a] leading-tight">
              Build Skills.
            </h1>
            <h1 className="text-5xl xl:text-6xl font-black leading-tight">
              <span className="text-blue-600">Grow</span>
              <span className="text-[#1a2a4a]"> Your Future.</span>
            </h1>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            Discover the right opportunities, enhance your skills,
            <br className="hidden sm:block" />
            and land your dream job with CareerSync.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/careersync/jobs"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Explore Jobs
              <ArrowRight className="w-5 h-5" />
            </a>
            {user && role && (
              <button
                type="button"
                onClick={() => setShowWorkspace(true)}
                className="group flex items-center gap-2 px-7 py-4 border border-blue-200 bg-white text-[#1a2a4a] font-bold text-base rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
              >
                Open Workspace
                <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowResumeModal(true)}
              className="group flex items-center gap-2 px-7 py-4 border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 text-[#1a2a4a] font-bold text-base rounded-xl shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
            >
              <Upload className="h-5 w-5 text-blue-600 transition-transform group-hover:scale-110" />{" "}
              Upload Resume
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            {[
              {
                icon: <Briefcase className="w-5 h-5 text-blue-600" />,
                label: "10K+",
                sub: "Active Jobs",
              },
              {
                icon: <FileText className="w-5 h-5 text-blue-600" />,
                label: "Resume",
                sub: "Builder",
              },
              {
                icon: <Star className="w-5 h-5 text-blue-600" />,
                label: "Mock",
                sub: "Interviews",
              },
              {
                icon: <Users className="w-5 h-5 text-blue-600" />,
                label: "Expert",
                sub: "Guidance",
              },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="text-[#1a2a4a] font-bold text-sm leading-tight">{label}</div>
                  <div className="text-gray-400 text-xs">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:flex items-center justify-center h-[560px]">
          <div
            className="absolute inset-0 rounded-full bg-blue-50"
            style={{ borderRadius: "60% 40% 55% 45% / 50% 50% 50% 50%", transform: "scale(0.92)" }}
          />

          <img
            src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Professional using laptop"
            loading="eager"
            className="relative z-10 w-72 object-cover object-top rounded-b-full"
            style={{ height: "420px", objectPosition: "top center" }}
          />

          <div className="absolute top-6 right-6 grid grid-cols-5 gap-1.5 opacity-30">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
            ))}
          </div>

          <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-xl p-4 w-52 z-20 border border-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-[#1a2a4a] font-bold text-sm">Recommended Jobs</span>
            </div>
            <div className="space-y-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3 h-3 text-pink-500" />
                </div>
                <div>
                  <div className="text-[#1a2a4a] font-semibold text-xs">Product Designer</div>
                  <div className="text-gray-400 text-xs">Bangladesh • Full-time</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart2 className="w-3 h-3 text-green-500" />
                </div>
                <div>
                  <div className="text-[#1a2a4a] font-semibold text-xs">Business Analyst</div>
                  <div className="text-gray-400 text-xs">Remote • Full-time</div>
                </div>
              </div>
            </div>
            <button className="w-full text-center text-xs font-semibold text-blue-600 py-1.5 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
              View all
            </button>
          </div>

          <div className="absolute left-6 top-1/2 -translate-y-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>

          <div className="absolute right-20 top-28 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20">
            <BarChart2 className="w-6 h-6 text-blue-600" />
          </div>

          <div className="absolute top-8 right-0 bg-white rounded-2xl shadow-xl p-4 w-40 z-20 border border-gray-50 text-center">
            <div className="text-[#1a2a4a] font-bold text-sm mb-3">Resume Score</div>
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f0f9ff" strokeWidth="8" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32 * 0.92} ${2 * Math.PI * 32}`}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-[#1a2a4a]">92</span>
                <span className="text-gray-400 text-xs">/100</span>
              </div>
            </div>
            <div className="text-green-500 font-bold text-sm">Excellent</div>
          </div>

          <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl p-4 w-48 z-20 border border-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-[#1a2a4a] font-bold text-sm">Interview Prep</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#1a2a4a] font-bold text-xs">Mock Interviews</div>
                <div className="text-gray-400 text-xs">Practice & Improve</div>
              </div>
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED COMPANIES */}
      {/* <CareerSyncDashboard /> — dashboard hidden; re-enable when needed */}
      <CareerSyncCompaniesMarquee />

      {/* CAREER PASSPORT — COMING SOON */}
      <CareerPassportComingSoon />

      {/* AVAILABLE JOBS */}
      <CareerSyncJobsSection />

      <CareerCategoriesSection />

      {/* MOCK INTERVIEW ANNOUNCEMENT */}
      <MockInterviewAnnouncementCard />

      <BlogsPreviewSection />
      <Testimonials />
      <FAQ />
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function CareerCategoriesSection() {
  const categories = [
    { title: "Tech & Product", desc: "Software, product, and data roles.", jobs: "1,200+" },
    { title: "Sales & Business", desc: "Inside sales, field sales, and growth.", jobs: "900+" },
    { title: "Design & Creative", desc: "UI/UX, motion, visual, and content.", jobs: "420+" },
    { title: "Operations & Support", desc: "Customer success, ops, and support.", jobs: "610+" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
          Career Categories
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
          Explore roles by domain
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-sm font-black text-[#0F172A]">{c.title}</div>
            <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
            <div className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {c.jobs} jobs
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlogsPreviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
            Blogs Preview
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Learn from expert playbooks
          </h2>
        </div>
        <Link
          to="/careersync/blogs"
          className="text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          View all blogs
        </Link>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {BLOGS.slice(0, 3).map((blog) => (
          <Link
            key={blog.slug}
            to="/careersync/blogs/$slug"
            params={{ slug: blog.slug }}
            className="group rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={blog.cover}
              alt={blog.title}
              loading="lazy"
              className="aspect-[16/10] w-full rounded-xl object-cover"
            />
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-blue-600">
              {blog.category}
            </p>
            <h3 className="mt-1 text-base font-bold text-[#0F172A] group-hover:text-blue-700 line-clamp-2">
              {blog.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{blog.excerpt}</p>
            <div className="mt-3 text-xs text-slate-500">
              <span>{blog.author}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

type ResumeFormData = {
  fullName: string;
  email: string;
  phone: string;
  resume: File | null;
};

const RESUME_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

function ResumeUploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<ResumeFormData>({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
  });
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ResumeFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({ fullName: "", email: "", phone: "", resume: null });
      setErrors({});
      setSubmitting(false);
      setShowSuccess(false);
    }
  }, [open]);

  const setField = <K extends keyof ResumeFormData>(key: K, value: ResumeFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateResume = (file: File | null): string | null => {
    if (!file) return "Resume is required.";
    const hasAllowedExt = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!RESUME_ALLOWED_TYPES.includes(file.type) && !hasAllowedExt) {
      return "Only PDF, DOC, and DOCX files are allowed.";
    }
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      return "Resume must be 5 MB or smaller.";
    }
    return null;
  };

  const validateForm = () => {
    const next: Partial<Record<keyof ResumeFormData, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    const onlyDigits = form.phone.replace(/\D/g, "");
    if (onlyDigits.length < 8 || onlyDigits.length > 15) next.phone = "Enter a valid phone number.";
    const resumeError = validateResume(form.resume);
    if (resumeError) next.resume = resumeError;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onFilePick = (file: File | null) => {
    setField("resume", file);
    const resumeError = validateResume(file);
    if (resumeError) setErrors((prev) => ({ ...prev, resume: resumeError }));
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    onFilePick(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await submitToGoogleSheet({
        type: "resume",
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        resumeName: form.resume?.name || "",
        resumeType: form.resume?.type || "",
        resumeSize: form.resume?.size || 0,
      });
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1300);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        resume: error instanceof Error ? error.message : "Could not submit resume.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">Upload Resume</h2>
            <p className="mt-1 text-sm text-slate-600">
              Share your profile and we will review it for suitable opportunities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {showSuccess ? (
          <div className="grid place-items-center py-10 text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"
            >
              <CheckCircle2 className="h-8 w-8" />
            </motion.div>
            <p className="mt-4 text-lg font-bold text-slate-900">Resume submitted successfully.</p>
            <p className="mt-1 text-sm text-slate-600">
              Thank you. Our team will review your profile.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full Name
                </label>
                <input
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="+91 9876543210"
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-5 transition ${dragging ? "border-blue-400 bg-blue-50" : "border-blue-200 bg-blue-50/40 hover:border-blue-300"}`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {form.resume ? form.resume.name : "Drag & drop your resume here"}
                  </p>
                  <p className="text-xs text-slate-500">PDF, DOC, DOCX · max 5 MB</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onFilePick(e.target.files?.[0] ?? null)
                  }
                />
              </label>
              {errors.resume && <p className="mt-1 text-xs text-rose-600">{errors.resume}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Resume"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
