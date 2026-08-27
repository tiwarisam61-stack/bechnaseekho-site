import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/marketing/MarketingSections";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — CareerSync Resume Studio" },
      {
        name: "description",
        content:
          "Read what graduates, career switchers and senior hires say about building resumes with CareerSync.",
      },
      { property: "og:title", content: "Reviews — CareerSync Resume Studio" },
      {
        property: "og:description",
        content: "Real feedback from people who landed interviews with CareerSync resumes.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/reviews" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <ReviewsSection />
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4 pb-16 sm:px-5">
        <Button asChild className="min-h-11">
          <Link to="/builder" search={{ t: "blue-corporate" }}>
            Build my resume
          </Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link to="/what-you-get">See features</Link>
        </Button>
      </div>
    </main>
  );
}
