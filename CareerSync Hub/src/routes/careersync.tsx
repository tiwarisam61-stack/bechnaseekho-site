import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CareerSyncShowcase } from "@/components/careersync/CareerSyncShowcase";

export const Route = createFileRoute("/careersync")({
  head: () => ({
    meta: [
      { title: "CareerSync — Live Hiring Pipelines & AI Job Matching" },
      {
        name: "description",
        content:
          "CareerSync connects recruiters and candidates: track applications end to end, and get AI-matched to roles in one click.",
      },
      { property: "og:title", content: "CareerSync — Live Hiring Pipelines & AI Job Matching" },
      {
        property: "og:description",
        content:
          "Track hiring from application to signed offer, and let AI match candidates to roles instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareerSyncPage,
});

function CareerSyncPage() {
  return (
    <main className="pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" />
          Back to BechnaSeekho
        </Link>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
          CareerSync
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          The hiring engine behind BechnaSeekho — a live pipeline for recruiters, instant matches for
          candidates.
        </p>
      </div>
      <CareerSyncShowcase />
    </main>
  );
}
