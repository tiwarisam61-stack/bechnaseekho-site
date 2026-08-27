import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { WhatYouGetSection } from "@/components/marketing/MarketingSections";

export const Route = createFileRoute("/what-you-get")({
  head: () => ({
    meta: [
      { title: "What You Get — CareerSync Resume Studio" },
      {
        name: "description",
        content:
          "Live ATS scoring, 30 premium templates, an AI writing assistant, version history and PDF plus editable Word export.",
      },
      { property: "og:title", content: "What You Get — CareerSync Resume Studio" },
      {
        property: "og:description",
        content: "Every feature included in the CareerSync resume studio, in one place.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/what-you-get" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/what-you-get" }],
  }),
  component: WhatYouGetPage,
});

function WhatYouGetPage() {
  return (
    <main className="min-h-screen bg-background">
      <WhatYouGetSection />
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4 pb-16 sm:px-5">
        <Button asChild className="min-h-11">
          <Link to="/builder" search={{ t: "blue-corporate" }}>
            Try it free
          </Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link to="/how-it-works">See how it works</Link>
        </Button>
      </div>
    </main>
  );
}
