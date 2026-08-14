import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useLenis } from "@/hooks/use-lenis";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { PageTransition } from "@/components/page-transition";
import heroCharacter from "@/assets/hero-character.png";

// Below-the-fold sections — lazy chunked so the hero paints fast.
const CounterStats = lazy(() =>
  import("@/components/landing/counter-stats").then((m) => ({ default: m.CounterStats })),
);
const CareerSyncShowcase = lazy(() =>
  import("@/components/careersync/CareerSyncShowcase").then((m) => ({ default: m.CareerSyncShowcase })),
);
const LearningShowcase = lazy(() =>
  import("@/components/landing/learning").then((m) => ({ default: m.LearningShowcase })),
);
const Testimonials = lazy(() =>
  import("@/components/landing/testimonials").then((m) => ({ default: m.Testimonials })),
);
const FAQ = lazy(() =>
  import("@/components/landing/faq").then((m) => ({ default: m.FAQ })),
);
const Footer = lazy(() =>
  import("@/components/landing/footer").then((m) => ({ default: m.Footer })),
);
const WhatsAppFab = lazy(() =>
  import("@/components/landing/whatsapp-fab").then((m) => ({ default: m.WhatsAppFab })),
);
const SectionFallback = () => <div className="min-h-[120px]" aria-hidden="true" />;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BechnaSeekho | One Job Platform" },
      {
        name: "description",
        content:
          "BechnaSeekho is a job platform that helps candidates build resumes, find verified jobs, prepare for interviews, upskill, and connect with recruiters through CareerSync.",
      },
      { property: "og:title", content: "BechnaSeekho | One Job Platform" },
      {
        property: "og:description",
        content:
          "Job platform for resumes, verified jobs, mock interviews, upskilling and recruiter connections via CareerSync.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroCharacter, fetchPriority: "high" },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-ink">
      <Navbar />
      <PageTransition>
        <main>
          <Hero />
          <Marquee />
          <Suspense fallback={<SectionFallback />}>
            <CareerSyncShowcase />
            <CounterStats />

            <LearningShowcase />
            <Testimonials />
            <FAQ />
          </Suspense>
        </main>
      </PageTransition>
      <Suspense fallback={null}>
        <Footer />
        <WhatsAppFab />
      </Suspense>
    </div>
  );
}
