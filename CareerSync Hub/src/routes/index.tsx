import { createFileRoute } from "@tanstack/react-router";
import { CareerSyncShowcase } from "@/components/careersync/CareerSyncShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerSync — Connecting Talent with Opportunities" },
      {
        name: "description",
        content:
          "CareerSync connects recruiters and candidates: live hiring pipelines on one side, instant AI job matches on the other.",
      },
      { property: "og:title", content: "CareerSync — Connecting Talent with Opportunities" },
      {
        property: "og:description",
        content:
          "Live hiring pipelines for recruiters and instant AI matches for candidates, in one connected section.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      <h1 className="sr-only">CareerSync — connecting talent with opportunities</h1>
      <CareerSyncShowcase />
    </main>
  );
}
