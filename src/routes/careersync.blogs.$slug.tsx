import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, Info, Lightbulb, MessageCircle, Send, Star, Trash2, User as UserIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BLOGS, getBlog, type Blog, type BlogBlock } from "@/lib/blogs";
import { CareerSyncLogo } from "@/components/careersync/logo";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/careersync/blogs/$slug")({
  loader: ({ params }) => {
    const blog = getBlog(params.slug);
    if (!blog) throw notFound();
    return { blog };
  },
  component: BlogDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Blog not found</h1>
        <p className="mt-2 text-slate-600">This story may have been moved or does not exist.</p>
        <Link to="/careersync/blogs" className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white px-5 py-2.5 font-semibold hover:bg-indigo-700">
          <ArrowLeft className="h-4 w-4" /> Back to blogs
        </Link>
      </div>
    </div>
  ),
  head: ({ loaderData }) => {
    const b = loaderData?.blog as Blog | undefined;
    if (!b) return { meta: [{ title: "Blog — CareerSync" }] };
    return {
      meta: [
        { title: `${b.title} — CareerSync Blog` },
        { name: "description", content: b.excerpt },
        { name: "keywords", content: [b.category, ...b.tags].join(", ") },
        { property: "og:title", content: b.title },
        { property: "og:description", content: b.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:image", content: b.cover },
        { property: "og:url", content: `/careersync/blogs/${b.slug}` },
        { property: "article:published_time", content: b.publishedAt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: b.cover },
      ],
    };
  },
});

function BlogDetailPage() {
  const { blog } = Route.useLoaderData() as { blog: Blog };
  const related = BLOGS.filter((b) => b.slug !== blog.slug).slice(0, 3);
  const toc = useMemo(() => {
    return blog.content
      .map((block, index) => {
        if (block.type !== "h2" && block.type !== "h3") return null;
        return {
          id: headingIdFromText(block.text, index),
          label: block.text,
          level: block.type,
        };
      })
      .filter((item): item is { id: string; label: string; level: "h2" | "h3" } => !!item);
  }, [blog]);
  const faqItems = useMemo(() => {
    return blog.content
      .filter((block): block is Extract<BlogBlock, { type: "qa" }> => block.type === "qa")
      .flatMap((block) => block.items)
      .slice(0, 8);
  }, [blog]);
  const keyTakeaways = useMemo(() => {
    const fromLists = blog.content
      .filter((block): block is Extract<BlogBlock, { type: "list" }> => block.type === "list")
      .flatMap((block) => block.items);
    const fromSteps = blog.content
      .filter((block): block is Extract<BlogBlock, { type: "steps" }> => block.type === "steps")
      .flatMap((block) => block.items.map((item) => `${item.title}: ${item.body}`));
    return [...fromLists, ...fromSteps].slice(0, 6);
  }, [blog]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Reading progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/70">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/careersync/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600">
            <ArrowLeft className="h-4 w-4" /> All blogs
          </Link>
          <Link to="/careersync" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600">
            <BookOpen className="h-4 w-4" /> CareerSync
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-24 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl" />
          <div className="absolute top-20 -right-24 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-14 pb-8 text-center">
          <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            {blog.category}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
          >
            {blog.title}
          </motion.h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">{blog.excerpt}</p>
          <div className="mt-6 flex items-center justify-center gap-5 text-sm text-slate-500 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><UserIcon className="h-4 w-4" /> {blog.author} · <span className="text-slate-400">{blog.authorRole}</span></span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-4xl px-4 sm:px-6"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
            <img src={blog.cover} alt={blog.title} className="w-full aspect-[16/8] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl bg-white ring-1 ring-slate-200 p-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Table of Contents</h2>
            <nav className="mt-3 space-y-1.5">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block rounded-lg px-2 py-1.5 text-sm transition hover:bg-indigo-50 hover:text-indigo-700 ${item.level === "h3" ? "pl-5 text-slate-500" : "text-slate-700 font-medium"}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="min-w-0">
          <div className="space-y-6">
            {blog.content.map((block, i) => (
              <RenderBlock key={i} block={block} index={i} />
            ))}
          </div>

          {keyTakeaways.length > 0 && (
            <section className="mt-12 rounded-3xl bg-gradient-to-br from-indigo-50 to-cyan-50 ring-1 ring-indigo-100 p-6 sm:p-7">
              <h2 className="font-display text-2xl font-bold text-slate-900">Key Takeaways</h2>
              <ul className="mt-4 space-y-3">
                {keyTakeaways.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                    <span className="mt-2 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {faqItems.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <div className="mt-4 space-y-3">
                {faqItems.map((item, i) => (
                  <QaItem key={`${item.q}-${i}`} q={item.q} a={item.a} index={i} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 flex flex-wrap gap-2">
            {blog.tags.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 text-slate-700 text-xs px-3 py-1.5 font-medium">
                #{t.replace(/\s+/g, "")}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/careersync/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back to blogs
            </Link>
          </div>
        </article>
      </section>

      {/* Rating + Comments */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 space-y-10">
        <ReviewsSection slug={blog.slug} />
      </section>

      {/* Related */}
      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h3 className="text-2xl font-display font-bold text-slate-900">Read next</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((b) => (
              <Link
                key={b.slug}
                to="/careersync/blogs/$slug"
                params={{ slug: b.slug }}
                className="group block rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-lg hover:ring-indigo-300 transition"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={b.cover} alt={b.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{b.category}</span>
                  <h4 className="mt-1 font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-700 transition">{b.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------- Blocks ------------------------------- */

function headingIdFromText(text: string, index: number): string {
  return `${text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}-${index}`;
}

function RenderBlock({ block, index }: { block: BlogBlock; index: number }) {
  switch (block.type) {
    case "p":
      return <p className="text-[17px] leading-[1.85] text-slate-700">{block.text}</p>;
    case "h2":
      return <h2 id={headingIdFromText(block.text, index)} className="scroll-mt-24 font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-8">{block.text}</h2>;
    case "h3":
      return <h3 id={headingIdFromText(block.text, index)} className="scroll-mt-24 font-display text-xl font-bold text-slate-900 mt-6">{block.text}</h3>;
    case "quote":
      return (
        <blockquote className="relative rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 border-l-4 border-indigo-500 p-6 my-4">
          <p className="text-lg font-medium text-slate-800 italic leading-relaxed">"{block.text}"</p>
          {block.by && <cite className="mt-3 block not-italic text-sm font-semibold text-indigo-700">— {block.by}</cite>}
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-3 pl-1">
          {block.items.map((it, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex gap-3 text-[16px] leading-relaxed text-slate-700"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]" />
              <span>{it}</span>
            </motion.li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <div className="grid sm:grid-cols-2 gap-4 my-2">
          {block.items.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-sm hover:shadow-lg hover:ring-indigo-300 transition"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-md">
                  {i + 1}
                </span>
                <h4 className="font-display font-bold text-slate-900">{s.title}</h4>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      );
    case "callout": {
      const map = {
        tip: { icon: Lightbulb, tone: "from-emerald-50 to-teal-50 border-emerald-400 text-emerald-900" },
        warn: { icon: Info, tone: "from-amber-50 to-orange-50 border-amber-400 text-amber-900" },
        info: { icon: Info, tone: "from-indigo-50 to-blue-50 border-indigo-400 text-indigo-900" },
      } as const;
      const cfg = map[block.tone];
      const Icon = cfg.icon;
      return (
        <div className={`flex gap-3 rounded-2xl border-l-4 bg-gradient-to-br p-5 ${cfg.tone}`}>
          <Icon className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-[15px]">{block.title}</div>
            <div className="mt-1 text-[15px] leading-relaxed opacity-90">{block.body}</div>
          </div>
        </div>
      );
    }
    case "qa":
      return (
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <QaItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      );
    case "image":
      return (
        <figure className="rounded-2xl overflow-hidden ring-1 ring-slate-200 my-4">
          <img src={block.src} alt={block.alt} className="w-full" loading="lazy" />
          {block.caption && <figcaption className="p-3 text-center text-sm text-slate-500 bg-slate-50">{block.caption}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
}

function QaItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition"
      >
        <span className="flex gap-3 items-start">
          <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0">Q{index + 1}</span>
          <span className="font-semibold text-slate-900">{q}</span>
        </span>
        <span className={`transition-transform text-slate-400 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 text-slate-700 leading-relaxed border-t border-slate-100">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------ Reviews ------------------------------ */

type Review = {
  id: string;
  blogSlug: string;
  authorName: string;
  userId: string | null;
  comment: string;
  rating: number;
  createdAt: string;
};

type ReviewSort = "recent" | "highest" | "lowest";

function ReviewsSection({ slug }: { slug: string }) {
  const { user, isAuthed } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(() => buildInitialReviews(slug));
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const displayName = useMemo(() => {
    if (!user) return "Reader";
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    return (
      (typeof meta.full_name === "string" && meta.full_name) ||
      (typeof meta.name === "string" && meta.name) ||
      (user.email ? user.email.split("@")[0] : "Reader")
    );
  }, [user]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    if (sort === "highest") {
      copy.sort((a, b) => b.rating - a.rating || +new Date(b.createdAt) - +new Date(a.createdAt));
      return copy;
    }
    if (sort === "lowest") {
      copy.sort((a, b) => a.rating - b.rating || +new Date(b.createdAt) - +new Date(a.createdAt));
      return copy;
    }
    copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return copy;
  }, [reviews, sort]);

  const requireAuth = useCallback(() => {
    if (!isAuthed || !user) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  }, [isAuthed, user]);

  const handleStarSelect = (value: number) => {
    if (!requireAuth()) return;
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    const trimmed = comment.trim();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating from 1 to 5 stars.");
      return;
    }
    if (trimmed.length < 2) {
      toast.error("Please add a short comment.");
      return;
    }

    setSubmitting(true);
    // TODO: Replace with backend API call to persist review + rating.
    await new Promise((resolve) => setTimeout(resolve, 250));

    setReviews((prev) => [
      {
        id: `${Date.now()}`,
        blogSlug: slug,
        authorName: displayName,
        userId: user?.id ?? null,
        comment: trimmed,
        rating,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setSubmitting(false);
    setComment("");
    setRating(0);
    setHover(0);
    toast.success("Review added.");
  };

  const removeReview = (id: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  return (
    <>
      <div className="rounded-3xl bg-white ring-1 ring-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">Ratings & Comments</h3>
            <p className="mt-1 text-sm text-slate-600">
              Overall rating: <span className="font-semibold text-slate-900">{averageRating.toFixed(1)}</span> / 5 from {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
          <label className="text-sm text-slate-600">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as ReviewSort)}
              className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onClick={() => handleStarSelect(n)}
                aria-label={`Select ${n} star${n > 1 ? "s" : ""}`}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star className={`h-7 w-7 ${(hover || rating) >= n ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            onFocus={() => {
              if (!isAuthed) setShowAuthModal(true);
            }}
            placeholder="Share your feedback about this article..."
            className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">{comment.length}/1000</span>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {submitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {sortedReviews.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No reviews yet. Be the first to share one.</p>
          ) : (
            sortedReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{review.authorName}</p>
                    <p className="text-[11px] text-slate-500">{new Date(review.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  {user?.id && review.userId === user.id && (
                    <button onClick={() => removeReview(review.id)} className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500" aria-label="Delete review">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={`h-4 w-4 ${idx < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.comment}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <LoginRequiredModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

function LoginRequiredModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-900/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-indigo-600" />
          <h4 className="text-lg font-bold text-slate-900">Login required</h4>
        </div>
        <p className="mt-2 text-sm text-slate-600">Please login or create an account to rate and comment on this blog.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/login" search={{ role: "candidate" }} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" onClick={onClose}>
            Login
          </Link>
          <Link to="/signup" search={{ role: "candidate" }} className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200" onClick={onClose}>
            Sign Up
          </Link>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function buildInitialReviews(slug: string): Review[] {
  const now = Date.now();
  return [
    {
      id: `${slug}-1`,
      blogSlug: slug,
      authorName: "Ananya S.",
      userId: null,
      rating: 5,
      comment: "Very practical examples. I applied the framework in my outreach this week.",
      createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: `${slug}-2`,
      blogSlug: slug,
      authorName: "Rohit K.",
      userId: null,
      rating: 4,
      comment: "Good article, especially the step-by-step section.",
      createdAt: new Date(now - 1000 * 60 * 60 * 27).toISOString(),
    },
  ];
}
