import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Database,
  Settings,
  FileText,
  Share2,
  Cookie,
  ShieldCheck,
  Clock,
  UserCheck,
  Globe,
  Baby,
  RefreshCw,
  Mail,
  ChevronDown,
  ArrowLeft,
  Check,
  X,
  Lock,
  Eye,
  Scale,
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BechnaSeekho" },
      { name: "description", content: "Learn how BechnaSeekho and CareerSync collect, use, and protect your personal information." },
    ],
  }),
  component: PrivacyPage,
});

const LAST_UPDATED = "July 2026";

const SECTIONS = [
  {
    id: "collect",
    title: "Information We Collect",
    icon: Database,
    color: "bg-blue-50 text-blue-600",
    accent: "blue",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">We may collect the following information:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "Full Name",
            "Email Address",
            "Mobile Number",
            "Resume / CV",
            "Educational Details",
            "Work Experience",
            "Skills & Certifications",
            "Profile Photo (optional)",
            "Login Information",
            "Company Preferences",
            "Referral Preferences",
            "Device Information",
            "Browser Information",
            "IP Address",
            "Cookies and Usage Data",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "use",
    title: "How We Use Your Information",
    icon: Settings,
    color: "bg-indigo-50 text-indigo-600",
    accent: "indigo",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">We use your information to:</p>
        <ul className="space-y-2">
          {[
            "Create and manage your account",
            "Review and store your resume",
            "Connect you with recruiters",
            "Provide company referrals",
            "Recommend relevant job opportunities",
            "Improve our services",
            "Send important notifications",
            "Respond to support requests",
            "Prevent fraud and misuse",
            "Enhance website performance",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <Check className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "resume",
    title: "Resume & Career Data",
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
    accent: "purple",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">When you upload your resume:</p>
        <ul className="space-y-3">
          {[
            "Your resume is securely stored.",
            "Your resume may be shared only with recruiters or hiring companies for recruitment purposes.",
            "Uploading a resume does not guarantee interviews, referrals, or employment.",
            "You remain the owner of your resume and career information.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <ShieldCheck className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Information Sharing",
    icon: Share2,
    color: "bg-cyan-50 text-cyan-600",
    accent: "cyan",
    content: (
      <>
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700 flex items-center gap-2">
          <Lock className="h-4 w-4 shrink-0" />
          We do not sell your personal information.
        </div>
        <p className="mb-3 text-sm text-gray-600 leading-relaxed">Your information may only be shared with:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Hiring Companies",
            "Recruiters",
            "Referral Partners",
            "Service Providers",
            "Payment Partners (if applicable)",
            "Government Authorities when legally required",
          ].map((item) => (
            <span
              key={item}
              className="text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Tracking Technologies",
    icon: Cookie,
    color: "bg-amber-50 text-amber-600",
    accent: "amber",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">Our website uses cookies to:</p>
        <ul className="space-y-2 mb-4">
          {[
            "Improve user experience",
            "Remember login sessions",
            "Analyze website traffic",
            "Personalize content",
            "Enhance platform security",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <Cookie className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          Users can disable cookies through their browser settings.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Data Security",
    icon: ShieldCheck,
    color: "bg-green-50 text-green-600",
    accent: "green",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">
          We implement appropriate technical and organizational security measures to protect your personal
          information against:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            "Unauthorized access",
            "Data theft",
            "Loss of information",
            "Misuse",
            "Alteration",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <X className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 italic">
          While we strive to protect your information, no online platform can guarantee 100% security.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: Clock,
    color: "bg-teal-50 text-teal-600",
    accent: "teal",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        We retain your information only for as long as necessary to provide our services, comply with legal
        obligations, resolve disputes, and improve our platform. Users may request deletion of their account and
        personal data, subject to applicable legal requirements.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: UserCheck,
    color: "bg-blue-50 text-blue-600",
    accent: "blue",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">Users have the right to:</p>
        <ul className="space-y-2">
          {[
            "Access their personal information",
            "Update profile details",
            "Correct inaccurate information",
            "Request account deletion",
            "Request deletion of uploaded resume",
            "Withdraw consent where applicable",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
              <Eye className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    icon: Globe,
    color: "bg-orange-50 text-orange-600",
    accent: "orange",
    content: (
      <>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">
          Our website may integrate with trusted third-party platforms such as:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["LinkedIn", "Google", "Microsoft", "Payment Gateways", "Analytics Services"].map((item) => (
            <span
              key={item}
              className="text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          These services maintain their own privacy policies, and we encourage users to review them separately.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    icon: Baby,
    color: "bg-pink-50 text-pink-600",
    accent: "pink",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        Our services are not intended for children under the age required by applicable law. We do not knowingly
        collect personal information from children. If we become aware that a child has provided us with personal
        information, we will take steps to delete such information promptly.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this Privacy Policy",
    icon: RefreshCw,
    color: "bg-indigo-50 text-indigo-600",
    accent: "indigo",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        We may update this Privacy Policy periodically. Any changes will become effective immediately upon
        publication on this page. Users are encouraged to review this page regularly to stay informed about how
        we protect your information.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: Mail,
    color: "bg-green-50 text-green-600",
    accent: "green",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        If you have any questions regarding this Privacy Policy or your personal information, please contact us
        through our official Contact Page or Support Email. We aim to respond to all inquiries within 3–5 business
        days.
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
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="border-t border-gray-100 px-6 py-5 pl-20">{section.content}</div>
      </div>
    </div>
  );
}

function PrivacyPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["collect"]));

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
          </div>
        </aside>

        {/* Main content */}
        <div>
          {/* Hero header */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
            <div className="mb-3 flex items-center gap-2">
              <Scale className="h-6 w-6 opacity-80" />
              <span className="text-sm font-semibold opacity-80">Legal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 max-w-xl text-blue-100 text-sm leading-relaxed">
              At CareerSync by BechnaSeekho, we respect your privacy and are committed to protecting your personal
              information. This Privacy Policy explains how we collect, use, store, protect, and share your
              information when you use our website and career services.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium">
                <Clock className="h-3.5 w-3.5" />
                Last Updated: {LAST_UPDATED}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium">
                <Lock className="h-3.5 w-3.5" />
                Data Protected & Secure
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

          {/* Footer links */}
          <div className="mt-10 border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-400">© 2026 CareerSync by BechnaSeekho. All Rights Reserved.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-5 text-xs text-gray-400">
              <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms &amp; Conditions</Link>
              <a href="#" className="hover:text-blue-600 transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
