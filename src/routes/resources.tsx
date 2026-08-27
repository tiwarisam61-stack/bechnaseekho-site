import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FileText, Video, Newspaper, HelpCircle, Download } from "lucide-react";
import { PageShell, CardGrid, FeatureCard } from "@/components/pages/page-shell";

export const Route = createFileRoute("/resources")({
  component: ResourcesPage,
  head: () => ({
    meta: [
      { title: "Resources — BechnaSeekho" },
      { name: "description", content: "Guides, templates, videos and reports to grow your career." },
      { property: "og:title", content: "Resources — BechnaSeekho" },
      { property: "og:description", content: "Free career and hiring resources from BechnaSeekho." },
    ],
  }),
});

function ResourcesPage() {
  return (
    <PageShell
      eyebrow="📚 Resources"
      title="Free guides to grow"
      highlight="every step of the way."
      subtitle="Handpicked templates, playbooks and reports — from resume templates to hiring benchmarks."
    >
      <CardGrid>
        <FeatureCard icon={<FileText className="h-5 w-5" />} title="Resume Templates" description="30+ ATS-optimized resume templates for every role and level." />
        <FeatureCard icon={<BookOpen className="h-5 w-5" />} title="Career Guides" description="Deep-dive guides on switching roles, negotiating and interviewing." accent="brand-2" />
        <FeatureCard icon={<Video className="h-5 w-5" />} title="Video Library" description="Mock interviews, workshop recordings and expert AMAs." accent="cyan" />
        <FeatureCard icon={<Newspaper className="h-5 w-5" />} title="Blog & Insights" description="Weekly essays on careers, hiring trends and India's job market." accent="amber" />
        <FeatureCard icon={<Download className="h-5 w-5" />} title="Free Downloads" description="Cover letter kits, salary sheets and interview cheat sheets." accent="emerald" />
        <FeatureCard icon={<HelpCircle className="h-5 w-5" />} title="Help Center" description="Answers, tutorials and step-by-step guides to every feature." />
      </CardGrid>
    </PageShell>
  );
}
