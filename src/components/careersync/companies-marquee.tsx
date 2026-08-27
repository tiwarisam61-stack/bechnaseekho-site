import { memo, useMemo, useState } from "react";

const COMPANIES: { name: string; domain: string }[] = [
  { name: "Google", domain: "google.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Meta", domain: "meta.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Netflix", domain: "netflix.com" },
  { name: "Adobe", domain: "adobe.com" },
  { name: "IBM", domain: "ibm.com" },
  { name: "Oracle", domain: "oracle.com" },
  { name: "Salesforce", domain: "salesforce.com" },
  { name: "TCS", domain: "tcs.com" },
  { name: "Infosys", domain: "infosys.com" },
  { name: "Wipro", domain: "wipro.com" },
  { name: "HCL", domain: "hcltech.com" },
  { name: "Tech Mahindra", domain: "techmahindra.com" },
  { name: "Accenture", domain: "accenture.com" },
  { name: "Capgemini", domain: "capgemini.com" },
  { name: "Deloitte", domain: "deloitte.com" },
  { name: "EY", domain: "ey.com" },
  { name: "PwC", domain: "pwc.com" },
  { name: "Tata", domain: "tata.com" },
  { name: "Reliance", domain: "ril.com" },
  { name: "ICICI Bank", domain: "icicibank.com" },
  { name: "Axis Bank", domain: "axisbank.com" },
  { name: "Uber", domain: "uber.com" },
  { name: "Ola", domain: "olacabs.com" },
  { name: "Zomato", domain: "zomato.com" },
  { name: "PhonePe", domain: "phonepe.com" },
  { name: "Paytm", domain: "paytm.com" },
  { name: "Razorpay", domain: "razorpay.com" },
  { name: "CRED", domain: "cred.club" },
  { name: "Byju's", domain: "byjus.com" },
  { name: "Unacademy", domain: "unacademy.com" },
  { name: "Nykaa", domain: "nykaa.com" },
  { name: "Zerodha", domain: "zerodha.com" },
  { name: "Freshworks", domain: "freshworks.com" },
  { name: "Zoho", domain: "zoho.com" },
];

function getLogoSources(domain: string): string[] {
  return [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://logo.clearbit.com/${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];
}

function getCompanyInitials(name: string): string {
  const parts = name
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "CO";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function CompanyLogo({ name, domain }: { name: string; domain: string }) {
  const sources = useMemo(() => getLogoSources(domain), [domain]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-[10px] font-extrabold text-slate-700 ring-1 ring-slate-200">
        {getCompanyInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={`${name} logo`}
      loading="lazy"
      width={28}
      height={28}
      className="h-7 w-7 object-contain grayscale transition-all duration-300 group-hover/logo:grayscale-0"
      onError={() => {
        const next = sourceIndex + 1;
        if (next < sources.length) {
          setSourceIndex(next);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

export const CareerSyncCompaniesMarquee = memo(function CareerSyncCompaniesMarquee() {
  const track = [...COMPANIES, ...COMPANIES];
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">
          Hiring Partners
        </p>
        <h2
          className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]"
          style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
        >
          Trusted by <span className="text-blue-600">50,000+</span> users and{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            500+ top companies
          </span>
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          From global giants to unicorn startups — real jobs from real employers.
        </p>
      </div>

      <div className="cs-mq-wrap group relative mt-10 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="cs-mq-track flex shrink-0 items-center gap-4 pr-4">
          {track.map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              className="group/logo relative flex h-16 shrink-0 items-center gap-3 rounded-2xl border border-blue-100/70 bg-white px-5 shadow-[0_4px_16px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/60 hover:shadow-[0_18px_40px_-14px_rgba(37,99,235,0.45)]"
            >
              <span className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-blue-500/0 blur-md transition-all duration-300 group-hover/logo:bg-blue-500/25" />
              <CompanyLogo name={c.name} domain={c.domain} />
              <span
                className="whitespace-nowrap text-[15px] font-bold tracking-tight text-[#0F172A]/85 transition-transform duration-300 group-hover/logo:scale-105"
                style={{ fontFamily: "'Sora','Inter',ui-sans-serif,system-ui" }}
              >
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes cs-marquee {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }
        .cs-mq-track {
          animation: cs-marquee 70s linear infinite;
          width: max-content;
        }
        .cs-mq-wrap:hover .cs-mq-track { animation-play-state: paused; }
      `}</style>
    </section>
  );
});
