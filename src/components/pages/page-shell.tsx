import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { WhatsAppFab } from "@/components/landing/whatsapp-fab";

export function PageShell({
  eyebrow,
  title,
  highlight,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-ink">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section className="relative">
          <div className="aurora" />
          <div className="absolute inset-0 grid-hero-bg opacity-60" />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-brand ring-1 ring-line backdrop-blur">
                {eyebrow}
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
                {title}
                {highlight && (
                  <>
                    {" "}
                    <span className="text-gradient-brand">{highlight}</span>
                  </>
                )}
              </h1>
              <p className="mt-5 max-w-2xl text-base text-ink-soft sm:text-lg">{subtitle}</p>
            </motion.div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">{children}</section>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function FeatureCard({
  icon,
  title,
  description,
  accent = "brand",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: "brand" | "brand-2" | "cyan" | "amber" | "emerald";
}) {
  const bg: Record<string, string> = {
    brand: "bg-brand/10 text-brand",
    "brand-2": "bg-brand-2/10 text-brand-2",
    cyan: "bg-cyan/10 text-cyan",
    amber: "bg-amber/15 text-amber",
    emerald: "bg-emerald/10 text-emerald",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-line transition-shadow hover:shadow-[0_20px_40px_-20px_oklch(0.55_0.22_264/0.25)]"
    >
      <div className={`grid h-11 w-11 place-items-center rounded-2xl ${bg[accent]}`}>{icon}</div>
      <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br from-brand/0 to-brand-2/10 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
