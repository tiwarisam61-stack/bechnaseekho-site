import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowLeft, Loader2, SlidersHorizontal } from "lucide-react";
import { CareerSyncJobsSection } from "@/components/careersync/jobs-section";

const searchSchema = z.object({
  location: z.string().optional(),
  query: z.string().optional(),
});

export const Route = createFileRoute("/careersync/jobs")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All Open Jobs · CareerSync by BechnaSeekho" },
      {
        name: "description",
        content:
          "Browse every verified job on CareerSync. Filter by role, location, salary and experience. Apply in one click.",
      },
      { property: "og:title", content: "All Open Jobs · CareerSync" },
      { property: "og:description", content: "Verified openings from 500+ hiring partners." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AllJobsPage,
});

function AllJobsPage() {
  const { location, query } = useSearch({ from: "/careersync/jobs" });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <TopBar location={location} />
      <div className="pt-20">
        {ready ? (
          <CareerSyncJobsSection initialLocation={location ?? ""} initialQuery={query ?? ""} />
        ) : (
          <div className="grid min-h-[40vh] place-items-center text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

function TopBar({ location }: { location?: string }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/careersync"
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to CareerSync
        </Link>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          {location ? `Find jobs in ${location}` : "All open jobs"}
        </div>
        <Link
          to="/careersync"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1.5 text-xs font-bold text-white shadow-md"
        >
          CareerSync home
        </Link>
      </div>
    </motion.header>
  );
}
