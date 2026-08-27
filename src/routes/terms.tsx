import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Briefcase,
  UserCheck,
  ClipboardList,
  Award,
  ShieldCheck,
  CreditCard,
  Lock,
  Globe,
  AlertTriangle,
  Ban,
  RefreshCw,
  Scale,
  Mail,
  ChevronDown,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — BechnaSeekho" },
      { name: "description", content: "Read the Terms & Conditions for using BechnaSeekho and CareerSync services." },
    ],
  }),
  component: TermsPage,
});

const LAST_UPDATED = "July 28, 2026";

const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        By accessing or using this website, you agree to comply with these Terms &amp; Conditions. If you do not
        agree with any part of these Terms, please discontinue using our services immediately. Your continued use
        of any part of the platform constitutes full acceptance of these Terms.
      </p>
    ),
  },
  {
    id: "services",
    title: "Services Provided",
    icon: Briefcase,
    color: "bg-indigo-50 text-indigo-600",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-4">
          Our platform provides career-related services including but not limited to:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {[
            "Resume Building",
            "Resume Reviews",
            "Resume Upload & Storage",
            "Job Listings",
            "Company Referrals",
            "Career Guidance",
            "Mock Interviews",
            "Skill Development Resources",
            "Hiring Assistance",
            "Career Resources",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-500 text-sm italic">
          We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
        </p>
      </>
    ),
  },
  {
    id: "responsibilities",
    title: "User Responsibilities",
    icon: UserCheck,
    color: "bg-green-50 text-green-600",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-4">Users agree to:</p>
        <ul className="space-y-2 mb-4">
          {[
            "Provide accurate and genuine information.",
            "Maintain confidentiality of their account credentials.",
            "Not upload false, misleading, or illegal content.",
            "Not misuse the platform.",
            "Not attempt unauthorized access.",
            "Follow all applicable laws while using the website.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-500 text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          Users are solely responsible for all activities performed through their accounts.
        </p>
      </>
    ),
  },
  {
    id: "resume",
    title: "Resume & Profile Information",
    icon: ClipboardList,
    color: "bg-purple-50 text-purple-600",
    content: (
      <ul className="space-y-3">
        {[
          "Users are responsible for the accuracy of the information provided in resumes and profiles.",
          "We are not responsible for employment decisions made by employers or recruiters.",
          "Uploading a resume does not guarantee interviews, referrals, or job placement.",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "referrals",
    title: "Job Referrals Disclaimer",
    icon: Award,
    color: "bg-yellow-50 text-yellow-600",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-4">
          Our platform may assist users by referring resumes to hiring companies. However:
        </p>
        <ul className="space-y-2">
          {[
            "Referrals do not guarantee interviews.",
            "Referrals do not guarantee selection.",
            "Final hiring decisions are made solely by the employer.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "ip",
    title: "Intellectual Property",
    icon: ShieldCheck,
    color: "bg-cyan-50 text-cyan-600",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-4">
          All website content including the following remain the exclusive property of the company:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Logo", "Branding", "Design", "Graphics", "Text", "Software", "Icons", "Images", "Documents"].map(
            (item) => (
              <span
                key={item}
                className="text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1 rounded-full"
              >
                {item}
              </span>
            ),
          )}
        </div>
        <p className="text-gray-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          No content may be copied, reproduced, modified, distributed, or used commercially without written permission.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments & Refunds",
    icon: CreditCard,
    color: "bg-rose-50 text-rose-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Payments made for premium services, resume services, consultations, or subscriptions are generally
        non-refundable unless explicitly mentioned in our Refund Policy. Refund requests will be evaluated
        according to our official Refund Policy.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    icon: Lock,
    color: "bg-teal-50 text-teal-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Your personal information is handled according to our Privacy Policy. We implement reasonable security
        measures to protect user information, but no online platform can guarantee absolute security. By using
        our services, you acknowledge this inherent limitation.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    icon: Globe,
    color: "bg-orange-50 text-orange-600",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-4">
          Our website may contain links or integrations with third-party platforms including:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["LinkedIn", "Google", "Microsoft", "Payment Gateways", "Employers"].map((item) => (
            <span
              key={item}
              className="text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="text-gray-500 text-sm">
          We are not responsible for third-party content, services, or privacy practices.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: AlertTriangle,
    color: "bg-red-50 text-red-600",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-4">The company shall not be liable for:</p>
        <ul className="space-y-2">
          {[
            "Job losses",
            "Missed opportunities",
            "Technical interruptions",
            "Data loss",
            "Employer decisions",
            "Indirect or consequential damages arising from use of the platform.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <X className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "termination",
    title: "Suspension or Termination",
    icon: Ban,
    color: "bg-gray-100 text-gray-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        We reserve the right to suspend or terminate any user account that violates these Terms &amp; Conditions
        without prior notice. Accounts found engaging in fraudulent, abusive, or harmful behavior will be
        permanently removed at our sole discretion.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to Terms",
    icon: RefreshCw,
    color: "bg-blue-50 text-blue-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        We reserve the right to update or modify these Terms &amp; Conditions at any time. Continued use of the
        website after updates constitutes acceptance of the revised Terms. We recommend reviewing this page
        periodically for any changes.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing Law",
    icon: Scale,
    color: "bg-indigo-50 text-indigo-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        These Terms &amp; Conditions shall be governed by the laws of India. Any disputes arising from these Terms
        shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Mail,
    color: "bg-green-50 text-green-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        For any questions regarding these Terms &amp; Conditions, users may contact us through our official Contact
        Page or email support. We aim to respond to all inquiries within 3–5 business days.
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
      className={`rounded-2xl border bg-white transition-all duration-200 ${isOpen ? "border-blue-200 shadow-md shadow-blue-50" : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"}`}
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
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-blue-500" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-gray-100 px-6 py-5 pl-20">{section.content}</div>
      </div>
    </div>
  );
}

function TermsPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["acceptance"]));
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-gray-50" ref={topRef} style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      {/* Nav bar */}
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
            <img src="/favicon.png" alt="BechnaSeekho" className="h-7 w-7 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
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
          </div>
        </aside>

        {/* Main content */}
        <div>
          {/* Hero header */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
            <div className="mb-3 flex items-center gap-2">
              <Scale className="h-6 w-6 opacity-80" />
              <span className="text-sm font-semibold opacity-80">Legal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Terms &amp; Conditions</h1>
            <p className="mt-3 max-w-xl text-blue-100 text-sm leading-relaxed">
              Please read these terms carefully before using BechnaSeekho and CareerSync services. By using our
              platform, you agree to be bound by the following terms.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium">
                <FileText className="h-3.5 w-3.5" />
                Last Updated: {LAST_UPDATED}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium">
                <Scale className="h-3.5 w-3.5" />
                Governed by Laws of India
              </span>
            </div>
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

          {/* Accept / Decline */}
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Do you accept these Terms?</h3>
            <p className="mt-1 text-sm text-gray-500">
              By accepting, you confirm you have read and agree to our Terms &amp; Conditions.
            </p>
            {accepted === null ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setAccepted(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAccepted(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                  Decline
                </button>
              </div>
            ) : accepted ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
                <Check className="h-5 w-5" />
                You have accepted the Terms &amp; Conditions. Thank you!
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
                <X className="h-5 w-5 mt-0.5 shrink-0" />
                <span>
                  You have declined. You may not be able to use certain features.{" "}
                  <button onClick={() => setAccepted(null)} className="underline hover:no-underline">
                    Review again
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Footer links */}
          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-400">© 2026 BechnaSeekho. All Rights Reserved.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-5 text-xs text-gray-400">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link to="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link>
              <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
