import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Users, Award, PlayCircle, BookOpen, Rocket } from "lucide-react";
import { PageShell, CardGrid, FeatureCard } from "@/components/pages/page-shell";
import { BechnaseekhoCoursesSection } from "@/components/pages/bechnaseekho-courses-section";

export const Route = createFileRoute("/bechnaseekho")({
  component: BechnaSeekhoPage,
  head: () => ({
    meta: [
      { title: "BechnaSeekho Learning — Sales & career skills" },
      { name: "description", content: "Live cohorts, sales training, certifications and mentorship from India's top practitioners." },
      { property: "og:title", content: "BechnaSeekho Learning" },
      { property: "og:description", content: "Learn sales, tech and career skills that actually move your career forward." },
    ],
  }),
});

function BechnaSeekhoPage() {
  return (
    <PageShell
      eyebrow="🎓 BechnaSeekho Learning"
      title="Learn skills that"
      highlight="move your career."
      subtitle="Live cohorts, on-demand courses and 1:1 mentorship — all designed with hiring partners so what you learn is what companies actually pay for."
    >
      <CardGrid>
        <FeatureCard icon={<BookOpen className="h-5 w-5" />} title="200+ Courses" description="Sales, product, design, data and AI — taught by builders who ship." />
        <FeatureCard icon={<Users className="h-5 w-5" />} title="Live Cohorts" description="Small-group programs with weekly assignments and cohort-based support." accent="brand-2" />
        <FeatureCard icon={<Award className="h-5 w-5" />} title="Certifications" description="Industry-recognized certificates that hiring partners actually respect." accent="amber" />
        <FeatureCard icon={<PlayCircle className="h-5 w-5" />} title="Workshops" description="Hands-on weekend workshops on high-leverage skills like AI prompting." accent="cyan" />
        <FeatureCard icon={<GraduationCap className="h-5 w-5" />} title="1:1 Mentorship" description="Book time with mentors from Google, Razorpay, Deloitte and more." accent="emerald" />
        <FeatureCard icon={<Rocket className="h-5 w-5" />} title="Placement Support" description="Cohort graduates get direct access to our verified hiring partner network." />
      </CardGrid>

      <div className="mt-9 rounded-3xl bg-white p-8 ring-1 ring-line sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Start learning free this week</h2>
            <p className="mt-1 text-sm text-ink-soft">Full library preview. No credit card required.</p>
          </div>
          <Link to="/signup" className="btn-primary">
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <BechnaseekhoCoursesSection />
    </PageShell>
  );
}
