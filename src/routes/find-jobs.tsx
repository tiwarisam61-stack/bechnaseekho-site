import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Headset,
  Building2,
  Users,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Phone,
} from "lucide-react";

export const Route = createFileRoute("/find-jobs")({
  head: () => ({
    meta: [
      { title: "Find Jobs by City & Category · CareerSync" },
      {
        name: "description",
        content:
          "Discover verified CareerSync job openings by city and popular job category — Noida, Delhi, Gurgaon, Meerut and more.",
      },
      { property: "og:title", content: "Find Jobs by City & Category · CareerSync" },
      { property: "og:description", content: "Explore popular job opportunities across top cities and high-demand career categories." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FindJobsPage,
});

const CITIES = [
  "Meerut",
  "Noida",
  "Ghaziabad",
  "Delhi",
  "Gurgaon",
  "Faridabad",
  "Lucknow",
  "Chandigarh",
  "Jaipur",
  "Agra",
];

const POPULAR_SEARCHES = [
  { label: "BPO Jobs for Freshers", sub: "Explore entry-level roles", icon: Headset, location: "", query: "BPO" },
  { label: "Telecaller Jobs in Noida", sub: "Explore available openings", icon: Phone, location: "Noida", query: "Telecaller" },
  { label: "Sales Jobs in Delhi NCR", sub: "Explore available openings", icon: TrendingUp, location: "Delhi NCR", query: "Sales" },
  { label: "Insurance Sales Jobs in Noida", sub: "Explore available openings", icon: ShieldCheck, location: "Noida", query: "Insurance" },
  { label: "Business Development Jobs in Delhi", sub: "Explore available openings", icon: Briefcase, location: "Delhi", query: "Business Development" },
  { label: "Customer Support Jobs in Gurgaon", sub: "Explore available openings", icon: Users, location: "Gurgaon", query: "Customer Support" },
  { label: "BPO Jobs in Delhi NCR", sub: "Explore entry-level roles", icon: Building2, location: "Delhi NCR", query: "BPO" },
  { label: "Sales Jobs in Noida", sub: "Explore available openings", icon: TrendingUp, location: "Noida", query: "Sales" },
];

function FindJobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <TopBar />

      <main className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 ring-1 ring-blue-100">
            <MapPin className="h-3.5 w-3.5" /> Job discovery
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0F172A] sm:text-5xl">
            Find Jobs by City &amp; Category
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg">
            Explore popular job opportunities across top cities and high-demand career categories.
          </p>
        </motion.div>

        {/* Top cities */}
        <section className="mt-14" aria-labelledby="top-cities-heading">
          <h2 id="top-cities-heading" className="text-center text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            Find Jobs by City
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CITIES.map((city, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
              >
                <Link
                  to="/careersync/jobs"
                  search={{ location: city }}
                  className="group flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-bold text-[#0F172A] ring-1 ring-blue-100 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    {city}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-blue-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular job searches */}
        <section className="mt-16" aria-labelledby="popular-searches-heading">
          <h2 id="popular-searches-heading" className="text-center text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            Popular Job Searches
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {POPULAR_SEARCHES.map(({ label, sub, icon: Icon, location, query }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link
                  to="/careersync/jobs"
                  search={{ location: location || undefined, query: query || undefined }}
                  className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-blue-100 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md sm:p-5"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-[#0F172A] sm:text-[15px]">{label}</span>
                      <span className="block text-xs text-gray-500">{sub}</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-blue-400 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function TopBar() {
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
          <MapPin className="h-4 w-4 text-blue-600" />
          Find Jobs
        </div>
        <Link
          to="/careersync/jobs"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1.5 text-xs font-bold text-white shadow-md"
        >
          Browse all jobs
        </Link>
      </div>
    </motion.header>
  );
}
