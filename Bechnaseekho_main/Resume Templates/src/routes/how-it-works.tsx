import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HowItWorksSection } from "@/components/marketing/MarketingSections";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — CareerSync Resume Studio" },
      {
        name: "description",
        content:
          "Pick a template, let AI fill in your experience, then export a recruiter-ready PDF or Word resume in under five minutes.",
      },
      { property: "og:title", content: "How It Works — CareerSync Resume Studio" },
      {
        property: "og:description",
        content: "Three simple steps to a polished, ATS-friendly resume with CareerSync.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/how-it-works" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <HowItWorksSection />
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4 pb-16 sm:px-5">
        <Button asChild className="min-h-11">
          <Link to="/builder" search={{ t: "blue-corporate" }}>
            Start building
          </Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link to="/">Browse templates</Link>
        </Button>
      </div>
    </main>
  );
}
