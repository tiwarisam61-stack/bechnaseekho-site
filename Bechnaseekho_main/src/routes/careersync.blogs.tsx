import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Search, Sparkles, TrendingUp } from "lucide-react";
import { BLOGS, BLOG_CATEGORIES } from "@/lib/blogs";
import { CareerSyncLogo } from "@/components/careersync/logo";
import { useMemo, useState } from "react";


export const Route = createFileRoute("/careersync/blogs")({
  component: BlogsRouteShell,
  head: () => ({
    meta: [
      { title: "Sales Blogs — Learn, Grow, Get Hired | CareerSync" },
      {
        name: "description",
        content:
          "Expert sales blogs by CareerSync — fundamentals, interview questions and real-world sales problems solved by top industry mentors.",
      },
      { property: "og:title", content: "Sales Blogs — CareerSync by BechnaSeekho" },
      { property: "og:description", content: "Master sales fundamentals, ace interviews and solve everyday sales problems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function BlogsRouteShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/careersync/blogs" || pathname === "/careersync/blogs/") {
    return <BlogsListPage />;
  }
  return <Outlet />;
}

function BlogsListPage() {
  const [cat, setCat] = useState<(typeof BLOG_CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return BLOGS.filter((b) => {
      const inCat = cat === "All" || b.category === cat;
      if (!inCat) return false;
      if (!query) return true;
      return (
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query)) ||
        b.author.toLowerCase().includes(query)
      );
    });
  }, [cat, q]);
  const featured = BLOGS[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      {/* Simple top bar back to CareerSync */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/careersync"
            className="flex items-center gap-2 text-[15px] font-semibold text-slate-800 hover:text-indigo-600 transition"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-md"><BookOpen className="h-4 w-4" /></span>
            <span>CareerSync <span className="text-slate-400 font-normal">/ Blogs</span></span>
          </Link>
          <Link
            to="/careersync"
            className="text-sm text-slate-600 hover:text-indigo-600 transition"
          >
            ← Back to CareerSync
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm mb-5"
          >
            <Sparkles className="h-3.5 w-3.5" /> Expert Sales Content
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
            className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-slate-900"
          >
            Sales Blogs that <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">actually help you grow</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="mt-5 max-w-2xl mx-auto text-slate-600 text-lg leading-relaxed"
          >
            Master sales from scratch — fundamentals, interview prep, and battle-tested playbooks written by senior mentors of BechnaSeekho.
          </motion.p>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-10">
        <Link
          to="/careersync/blogs/$slug"
          params={{ slug: featured.slug }}
          className="group grid md:grid-cols-2 gap-6 rounded-3xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-xl hover:shadow-2xl hover:ring-indigo-300 transition"
        >
          <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
            <img
              src={featured.cover}
              alt={featured.title}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
              loading="eager"
            />
            <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 shadow">
              <TrendingUp className="h-3 w-3" /> Featured
            </div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">{featured.category}</span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-indigo-700 transition">
              {featured.title}
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{featured.excerpt}</p>
            <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
              <span>By {featured.author}</span>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm">
              Read the blog <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </span>
          </div>
        </Link>
      </section>

      {/* Search + Category filters */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-6 space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search blogs by title, tag, author…"
            className="w-full rounded-full bg-white/90 backdrop-blur ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ring-1 ${cat === c
                ? "bg-slate-900 text-white ring-slate-900 shadow-md"
                : "bg-white text-slate-700 ring-slate-200 hover:ring-indigo-400 hover:text-indigo-700"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>


      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b, i) => (
          <motion.div
            key={b.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to="/careersync/blogs/$slug"
              params={{ slug: b.slug }}
              className="group block rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:ring-indigo-300 transition duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={b.cover}
                  alt={b.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 shadow">
                  {b.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition line-clamp-2">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{b.excerpt}</p>
                <div className="mt-4 flex items-center text-xs text-slate-500">
                  <span>{b.author.split(" ")[0]}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
