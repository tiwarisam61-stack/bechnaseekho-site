import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { CandidatePanel } from "./CandidatePanel";
import { RecruiterPanel } from "./RecruiterPanel";
import { SyncHub } from "./SyncHub";
import { Reveal } from "./Reveal";

export function CareerSyncShowcase() {
    return (
        <section
            id="careersync-showcase"
            aria-labelledby="careersync-heading"
            className="relative overflow-hidden py-12 sm:py-16"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-16 -z-10 h-[460px] w-[880px] -translate-x-1/2 rounded-full bg-brand-tint blur-3xl"
            />

            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                <Reveal className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-brand">
                        CAREERSYNC
                    </span>
                    <h2 id="careersync-heading" className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        One platform, <span className="text-gradient-brand">two sides of hiring</span>
                    </h2>
                    <p className="mt-3 text-base text-muted-foreground">
                        Recruiters post. Candidates apply. CareerSync sits in the middle and matches both in real time.
                    </p>
                </Reveal>

                <div className="relative mt-10 grid items-center gap-8 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_300px_minmax(0,1fr)] lg:gap-6 xl:gap-10">
                    <Reveal className="relative z-10 h-full">
                        <RecruiterPanel />
                    </Reveal>

                    {/* Center hub: connectors render behind, card floats above */}
                    <div className="relative">
                        <Reveal delay={120} className="h-full">
                            <SyncHub />
                        </Reveal>
                    </div>

                    <Reveal delay={220} className="relative z-10 h-full">
                        <CandidatePanel />
                    </Reveal>
                </div>

                <Reveal delay={120} className="mt-10 flex justify-center">
                    <Link
                        to="/careersync"
                        className="group inline-flex items-center gap-3 rounded-2xl border border-border bg-surface px-8 py-4 text-lg font-extrabold text-brand shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                    >
                        Open CareerSync
                        <ExternalLink className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
