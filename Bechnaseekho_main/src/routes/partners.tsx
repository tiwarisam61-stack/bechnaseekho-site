import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Building2, Globe2, Rocket } from "lucide-react";
import { PageShell, CardGrid, FeatureCard } from "@/components/pages/page-shell";

export const Route = createFileRoute("/partners")({
  component: PartnersPage,
  head: () => ({
    meta: [
      { title: "Partner Links — CareerSync" },
      { name: "description", content: "Partner with CareerSync by BechnaSeekho — for organizations exploring collaboration and partnership opportunities." },
    ],
  }),
});

function PartnersPage() {
  return (
    <PageShell
      eyebrow="🤝 Partnerships"
      title="Let's build the"
      highlight="future of hiring together."
      subtitle="CareerSync partners with hiring platforms, universities, staffing agencies and technology providers to help more candidates get hired."
    >
      <CardGrid>
        <FeatureCard icon={<Building2 className="h-5 w-5" />} title="Hiring Partners" description="Integrate your job listings and hiring pipeline with CareerSync's candidate network." />
        <FeatureCard icon={<Globe2 className="h-5 w-5" />} title="Education Partners" description="Universities and bootcamps offering placement support to their learners." accent="brand-2" />
        <FeatureCard icon={<Rocket className="h-5 w-5" />} title="Technology Partners" description="API and integration partnerships across ATS, HR tech and career tooling." accent="cyan" />
        <FeatureCard icon={<Handshake className="h-5 w-5" />} title="Get in touch" description="Reach out to our partnerships team via the Contact page to start a conversation." accent="amber" />
      </CardGrid>
    </PageShell>
  );
}
