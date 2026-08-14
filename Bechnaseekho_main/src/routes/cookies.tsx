import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cookie,
  Zap,
  Settings,
  BarChart2,
  Megaphone,
  HelpCircle,
  Globe,
  SlidersHorizontal,
  MousePointerClick,
  ShieldCheck,
  RefreshCw,
  Mail,
  ChevronDown,
  ArrowLeft,
  Check,
  Clock,
  Scale,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — BechnaSeekho" },
      {
        name: "description",
        content:
          "Learn how BechnaSeekho and CareerSync use cookies and tracking technologies to improve your experience.",
      },
    ],
  }),
  component: CookiesPage,
});

const LAST_UPDATED = "July 2026";

const COOKIE_TYPES = [
  {
    name: "Essential Cookies",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    desc: "Required for the website to function properly.",
    examples: [
      "User Login",
      "Account Authentication",
      "Security Verification",
      "Resume Upload Sessions",
      "Form Submission",
      "Platform Navigation",
    ],
  },
  {
    name: "Performance Cookies",
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    desc: "Help us understand how visitors interact with the website.",
    examples: [
      "Website Performance",
      "Traffic Analysis",
      "Error Monitoring",
      "Loading Speed Optimization",
      "User Journey Analysis",
    ],
  },
  {
    name: "Functional Cookies",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    desc: "Remember your preferences to improve your experience.",
    examples: [
      "Language Preference",
      "Theme Preference",
      "Saved Search Filters",
      "Job Preferences",
      "Recently Viewed Jobs",
      "Login Preferences",
    ],
  },
  {
    name: "Analytics Cookies",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    desc: "Collect anonymous information about website usage.",
    examples: [
      "Page Views",
      "Visitor Statistics",
      "Device Information",
      "Browser Information",
      "Feature Usage",
      "Session Duration",
    ],
  },
  {
    name: "Marketing Cookies",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    desc: "Used to display relevant advertisements and measure campaign effectiveness.",
    examples: [
      "Advertising Preferences",
      "Campaign Tracking",
      "Referral Tracking",
      "Marketing Analytics",
    ],
  },
];

const SECTIONS = [
  {
    id: "what",
    title: "What Are Cookies?",
    icon: HelpCircle,
    color: "bg-blue-50 text-blue-600",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        Cookies are small text files stored on your device when you visit our website. They help remember your
        preferences, improve website functionality, analyze traffic, and provide a better browsing experience.
        Cookies are widely used across the internet and are an important part of how modern websites work.
      </p>
    ),
  },
  {
    id: "types",
    title: "Types of Cookies We Use",
    icon: Cookie,
    color: "bg-amber-50 text-amber-600",
    content: (
      <div className="space-y-4">
        {COOKIE_TYPES.map((ct) => (
          <div key={ct.name} className={`rounded-xl border px-4 py-4 ${ct.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`h-2 w-2 rounded-full ${ct.dot}`} />
              <span className="text-sm font-bold">{ct.name}</span>
            </div>
            <p className="text-xs mb-3 opacity-80">{ct.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {ct.examples.map((ex) => (
                <span key={ex} className="text-xs bg-white/70 border border-current/20 px-2.5 py-1 rounded-full font-medium opacity-90">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "why",
    title: "Why We Use Cookies",
    icon: Zap,
    color: "bg-yellow-50 text-yellow-600",
    content: (
      <ul className="space-y-2">
        {[
          "Keep users securely logged in",
          "Improve website speed",
          "Remember user preferences",
          "Analyze website performance",
          "Improve job recommendations",
          "Enhance resume management",
          "Maintain platform security",
          "Detect suspicious activities",
          "Deliver a better user experience",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
            <Check className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Cookies",
    icon: Globe,
    color: "bg-orange-50 text-orange-600",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">
          Some cookies may be placed by trusted third-party services including:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "Google Analytics",
            "Google reCAPTCHA",
            "LinkedIn",
            "Microsoft",
            "Payment Gateway Providers",
            "Embedded Videos",
            "Cloud Hosting Services",
          ].map((item) => (
            <span
              key={item}
              className="text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
          These third-party providers have their own privacy and cookie policies.
        </p>
      </>
    ),
  },
  {
    id: "managing",
    title: "Managing Cookies",
    icon: SlidersHorizontal,
    color: "bg-teal-50 text-teal-600",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">Users may:</p>
        <ul className="space-y-2 mb-4">
          {[
            "Accept all cookies",
            "Reject non-essential cookies",
            "Delete existing cookies",
            "Configure browser settings",
            "Withdraw cookie consent at any time",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <Settings className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          Please note that disabling certain cookies may affect website functionality.
        </p>
      </>
    ),
  },
  {
    id: "consent",
    title: "Cookie Consent",
    icon: MousePointerClick,
    color: "bg-indigo-50 text-indigo-600",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">
          When visiting our website for the first time, users will see a cookie consent banner allowing them to:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: "Accept All Cookies", color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Reject Non-Essential Cookies", color: "bg-red-50 border-red-200 text-red-700" },
            { label: "Customize Cookie Preferences", color: "bg-blue-50 border-blue-200 text-blue-700" },
          ].map((opt) => (
            <div key={opt.label} className={`rounded-xl border px-4 py-3 text-xs font-semibold text-center ${opt.color}`}>
              {opt.label}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Consent can be changed at any time through the Cookie Settings page.
        </p>
      </>
    ),
  },
  {
    id: "protection",
    title: "Data Protection",
    icon: ShieldCheck,
    color: "bg-green-50 text-green-600",
    content: (
      <>
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
          <Lock className="h-4 w-4 shrink-0" />
          Cookies do not directly store sensitive personal information such as passwords or payment credentials.
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          All collected information is processed in accordance with our Privacy Policy. We follow industry-standard
          security practices to ensure your data is handled responsibly.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Cookie Policy",
    icon: RefreshCw,
    color: "bg-blue-50 text-blue-600",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        We may update this Cookie Policy from time to time to reflect legal, technical, or operational changes.
        Any updates will become effective immediately after publication on this page. We recommend reviewing this
        page regularly to stay informed.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: Mail,
    color: "bg-purple-50 text-purple-600",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        If you have any questions about our Cookie Policy or your cookie preferences, please contact us through
        our official Contact Page or Support Email. We aim to respond to all inquiries within 3–5 business days.
      </p>
    ),
  },
];

function AccordionItem({
  section,
  index,
  isOpen,
  onToggle,
}: {
  section: (typeof SECTIONS)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = section.icon;
  return (
    <div
      id={section.id}
      className={`rounded-2xl border bg-white transition-all duration-200 ${isOpen
          ? "border-blue-200 shadow-md shadow-blue-50"
          : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
        }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${section.color}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="text-base font-bold text-gray-900 leading-tight">{section.title}</h2>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-blue-500" : ""
            }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="border-t border-gray-100 px-6 py-5 pl-20">{section.content}</div>
      </div>
    </div>
  );
}

function CookiesPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["what"]));

  const toggle = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(SECTIONS.map((s) => s.id)));
  const collapseAll = () => setOpenSections(new Set());

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpenSections((prev) => new Set([...prev, id]));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      {/* Sticky navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              Back to Home
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <img
              src="/favicon.png"
              alt="BechnaSeekho"
              className="h-7 w-7 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-sm font-bold text-gray-900">
              Bechna<span className="text-blue-600">Seekho</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-10 lg:py-14">
        {/* Sticky Table of Contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Contents</p>
            <nav className="space-y-0.5">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollTo(section.id)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-700 group"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 group-hover:text-blue-600" />
                    <span className="leading-tight">{section.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* Cookie type legend */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Cookie Types</p>
              <div className="space-y-1.5">
                {COOKIE_TYPES.map((ct) => (
                  <div key={ct.name} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${ct.dot}`} />
                    {ct.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div>
          {/* Hero header */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white">
            <div className="mb-3 flex items-center gap-2">
              <Cookie className="h-6 w-6 opacity-80" />
              <span className="text-sm font-semibold opacity-80">Legal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Cookie Policy</h1>
            <p className="mt-3 max-w-xl text-blue-100 text-sm leading-relaxed">
              CareerSync by BechnaSeekho uses cookies and similar technologies to improve user experience, enhance
              website performance, provide personalized services, and maintain platform security. This Cookie Policy
              explains what cookies are, how we use them, and how users can manage their preferences.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium">
                <Clock className="h-3.5 w-3.5" />
                Last Updated: {LAST_UPDATED}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                GDPR Aligned
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium">
                <Scale className="h-3.5 w-3.5" />
                Governed by Laws of India
              </span>
            </div>
          </div>

          {/* Cookie types overview strip */}
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {COOKIE_TYPES.map((ct) => (
              <button
                key={ct.name}
                type="button"
                onClick={() => scrollTo("types")}
                className={`rounded-xl border px-3 py-2.5 text-center transition hover:scale-[1.02] ${ct.color}`}
              >
                <span className={`mx-auto mb-1 block h-2 w-2 rounded-full ${ct.dot}`} />
                <span className="text-xs font-semibold leading-tight block">{ct.name.replace(" Cookies", "")}</span>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{SECTIONS.length} sections</span> — click any to expand
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Expand all
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Collapse all
              </button>
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {SECTIONS.map((section, index) => (
              <AccordionItem
                key={section.id}
                section={section}
                index={index}
                isOpen={openSections.has(section.id)}
                onToggle={() => toggle(section.id)}
              />
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-10 border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-400">© 2026 CareerSync by BechnaSeekho. All Rights Reserved.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-5 text-xs text-gray-400">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms &amp; Conditions</Link>
              <a href="#" className="hover:text-blue-600 transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
