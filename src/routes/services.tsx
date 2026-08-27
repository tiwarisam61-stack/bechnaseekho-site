import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Users, Building2, GraduationCap, Sparkles, ShieldCheck } from "lucide-react";
import { PageShell, CardGrid, FeatureCard } from "@/components/pages/page-shell";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — BechnaSeekho" },
      { name: "description", content: "Everything BechnaSeekho offers for candidates, learners and companies." },
      { property: "og:title", content: "Services — BechnaSeekho" },
      { property: "og:description", content: "One AI ecosystem for careers, hiring and professional growth." },
    ],
  }),
});

function ServicesPage() {
  return (
    <PageShell
      eyebrow="🛠️ Services"
      title="One ecosystem,"
      highlight="every service you need."
      subtitle="From your first resume to your next hire — every tool, product and program built into a single, cohesive experience."
    >
      <CardGrid>
        <FeatureCard icon={<Briefcase className="h-5 w-5" />} title="For Candidates" description="Resume builder, verified jobs, mock interviews and career mentorship." />
        <FeatureCard icon={<GraduationCap className="h-5 w-5" />} title="For Learners" description="Live cohorts, on-demand courses and certified programs." accent="brand-2" />
        <FeatureCard icon={<Building2 className="h-5 w-5" />} title="For Companies" description="Recruiter dashboard, candidate tracking and hiring analytics." accent="cyan" />
        <FeatureCard icon={<Users className="h-5 w-5" />} title="Employer Branding" description="Company pages, culture stories and employer campaigns." accent="amber" />
        <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Enterprise" description="SSO, custom hiring flows and dedicated success managers." accent="emerald" />
        <FeatureCard icon={<Sparkles className="h-5 w-5" />} title="AI Services" description="Custom AI copilots for hiring teams, universities and academies." />
      </CardGrid>
    </PageShell>
  );
}
