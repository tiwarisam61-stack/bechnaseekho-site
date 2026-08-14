import { Twitter, Linkedin, Instagram, Youtube, Facebook } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CareerSyncLogo } from "@/components/careersync/logo";

const SOCIAL_LINKS = [
  { Icon: Linkedin, href: "https://www.linkedin.com/groups/18017028/", label: "LinkedIn" },
  { Icon: Instagram, href: "https://www.instagram.com/bechnaseekho_", label: "Instagram" },
  { Icon: Facebook, href: "https://www.facebook.com/people/bechnaseekhocom/61560843980655/", label: "Facebook" },
  { Icon: Youtube, href: "https://www.youtube.com/@bechnaseekho", label: "YouTube" },
  { Icon: Twitter, href: "https://x.com/bechnaseekho", label: "X (Twitter)" },
];

const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/EcIgO3PoX0k4VLt1tkUtdw?s=cl&p=a&ilr=1";
const WHATSAPP_WORKSHOPS_URL = "https://chat.whatsapp.com/KrHZjh22QrJGXc35aNvMe6?s=cl&p=a&ilr=1";

// Default "Company" column links for the BechnaSeekho website.
const BECHNASEEKHO_COMPANY_LINKS = [
  { label: "About", to: "/about" as const },
  { label: "Careers", to: null },
  { label: "Blog", to: null },
  { label: "Contact", to: "/contact" as const },
  { label: "Privacy", to: "/privacy" as const },
  { label: "Terms", to: "/terms" as const },
  { label: "Cookies", to: "/cookies" as const },
];

// "Company" column links used on the CareerSync website — point at CareerSync's own routes.
const CAREERSYNC_COMPANY_LINKS_MAIN = [
  { label: "About", to: "/careersync/about" as const },
  { label: "Careers", to: null },
  { label: "Blog", to: "/careersync/blogs" as const },
  { label: "Contact", to: "/contact" as const },
  { label: "Privacy", to: "/privacy" as const },
  { label: "Terms", to: "/terms" as const },
  { label: "Cookies", to: "/cookies" as const },
];

// CareerSync-only additions to the "For companies" footer column.
const CAREERSYNC_COMPANY_LINKS = [
  { label: "Post a Job", to: "/post-job" as const },
  { label: "Partner Links", to: "/partners" as const },
  { label: "Contact Sales", to: "/contact" as const },
];

const columns = [
  {
    title: "CareerSync",
    links: ["Find jobs", "Resume", "ATS Score", "Mock interview"],
    isCompany: false,
  },
  {
    title: "Learning",
    links: ["Courses", "Certifications", "Community", "Workshops"],
    isCompany: false,
  },
  {
    title: "For companies",
    links: ["Recruiter dashboard", "Candidates dashboard", "Employer dashboard"],
    isCompany: false,
  },
  {
    title: "Company",
    links: [],
    isCompany: true,
  },
];

export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isBechnaSeekhoPage = pathname.startsWith("/bechnaseekho");
  const isCareerSyncPage = pathname.startsWith("/careersync");
  const companyLinks = isCareerSyncPage ? CAREERSYNC_COMPANY_LINKS_MAIN : BECHNASEEKHO_COMPANY_LINKS;

  return (
    <footer className="relative border-t border-line bg-surface/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr]">
          <div>
            {isCareerSyncPage ? (
              <Link to="/careersync" className="flex items-center gap-3" aria-label="CareerSync home">
                <CareerSyncLogo variant="icon" size={44} />
                <span className="leading-tight">
                  <span className="block font-display text-xl font-bold tracking-tight">Career<span className="text-gradient-brand">Sync</span></span>
                  <span className="block text-xs font-medium text-ink-soft">By BechnaSeekho</span>
                </span>
              </Link>
            ) : (
              <Link
                to={isBechnaSeekhoPage ? "/bechnaseekho" : "/"}
                className="flex items-center gap-3"
                aria-label="BechnaSeekho home"
              >
                <img
                  src="/favicon.png"
                  alt="BechnaSeekho logo"
                  width={44}
                  height={44}
                  loading="lazy"
                  className="h-11 w-11 object-contain select-none"
                  draggable={false}
                />
                <span className="font-display text-xl font-bold tracking-tight">
                  Bechna<span className="text-gradient-brand">Seekho</span> Academy
                </span>
              </Link>
            )}
            <p className="mt-4 max-w-sm text-sm text-ink-soft">
              {isCareerSyncPage
                ? "The career platform from BechnaSeekho — verified jobs, resume tools and hiring, made human again."
                : "One AI ecosystem for careers, hiring and professional growth — built with care in India, for the world."}
            </p>
            <p className="mt-4 text-base font-semibold text-ink">Let’s get social :</p>
            <div className="mt-6 flex gap-2">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-line text-ink-soft transition-colors hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-display text-sm font-semibold text-ink">{col.title}</p>
                <ul className="mt-3 space-y-2">
                  {col.isCompany
                    ? companyLinks.map((item) => (
                      <li key={item.label}>
                        {item.to ? (
                          <Link to={item.to} className="text-sm text-ink-soft transition-colors hover:text-ink">
                            {item.label}
                          </Link>
                        ) : (
                          <a href="#" className="text-sm text-ink-soft transition-colors hover:text-ink">
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))
                    : col.links.map((l) => (
                      <li key={l}>
                        {l === "Find jobs" ? (
                          <Link to="/find-jobs" className="text-sm text-ink-soft transition-colors hover:text-ink">
                            {l}
                          </Link>
                        ) : (
                          <a
                            href={l === "Community" ? WHATSAPP_COMMUNITY_URL : l === "Workshops" ? WHATSAPP_WORKSHOPS_URL : "#"}
                            target={l === "Community" || l === "Workshops" ? "_blank" : undefined}
                            rel={l === "Community" || l === "Workshops" ? "noopener noreferrer" : undefined}
                            className="text-sm text-ink-soft transition-colors hover:text-ink"
                          >
                            {l}
                          </a>
                        )}
                      </li>
                    ))}
                  {col.title === "For companies" && isCareerSyncPage && CAREERSYNC_COMPANY_LINKS.map((item) => (
                    <li key={item.label}>
                      <Link to={item.to} className="text-sm text-ink-soft transition-colors hover:text-ink">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center">
          <p className="text-xs text-ink-soft">
            © {new Date().getFullYear()} {isCareerSyncPage ? "CareerSync" : "BechnaSeekho Academy"}. All Rights Reserved. Designed &amp; Developed ❤️ By Vashu Tyagi
          </p>
        </div>
      </div>
    </footer>
  );
}
