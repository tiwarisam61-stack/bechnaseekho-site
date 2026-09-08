import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/pages/page-shell";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — BechnaSeekho" },
      { name: "description", content: "Simple, transparent pricing for candidates, learners and companies." },
      { property: "og:title", content: "Pricing — BechnaSeekho" },
      { property: "og:description", content: "Start free. Upgrade only when you're ready." },
    ],
  }),
});

const plans = [
  {
    name: "Starter",
    price: "Free",
    tag: "Forever",
    desc: "For anyone starting their career journey.",
    features: ["Resume Builder (3 resumes)", "Access to verified jobs", "Basic mock interviews", "Career roadmap"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    tag: "per month",
    desc: "For serious job seekers who want an edge.",
    features: ["Unlimited resumes", "Priority job matches", "Mock interviews with feedback", "ATS score checker", "Salary negotiation tools"],
    cta: "Start Pro trial",
    highlight: true,
  },
  {
    name: "Company",
    price: "Custom",
    tag: "Talk to us",
    desc: "For teams hiring at scale.",
    features: ["Recruiter dashboard", "Candidate tracking", "Hiring analytics", "Employer branding", "SSO & SLA"],
    cta: "Contact sales",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <PageShell
      eyebrow="💎 Pricing"
      title="Simple pricing."
      highlight="Real results."
      subtitle="Start free, upgrade when it makes sense. No hidden fees, cancel anytime."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`relative overflow-hidden rounded-3xl p-8 ring-1 ${p.highlight
                ? "bg-gradient-to-br from-brand to-brand-2 text-white ring-transparent shadow-[0_30px_60px_-20px_oklch(0.55_0.22_264/0.5)]"
                : "bg-white text-ink ring-line"
              }`}
          >
            {p.highlight && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
                <Sparkles className="h-3 w-3" /> Most popular
              </span>
            )}
            <h3 className="font-display text-lg font-semibold">{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold">{p.price}</span>
              <span className={`text-sm ${p.highlight ? "text-white/80" : "text-ink-soft"}`}>/ {p.tag}</span>
            </div>
            <p className={`mt-2 text-sm ${p.highlight ? "text-white/85" : "text-ink-soft"}`}>{p.desc}</p>

            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlight ? "text-white" : "text-brand"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/signup"
              className={`mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold transition ${p.highlight
                  ? "bg-white text-brand hover:bg-white/95"
                  : "bg-ink text-white hover:opacity-90"
                }`}
            >
              {p.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
