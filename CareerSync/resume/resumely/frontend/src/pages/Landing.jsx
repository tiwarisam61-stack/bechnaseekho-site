import React from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import { TEMPLATES } from "@/data/templates";
import { sampleResume } from "@/data/sampleResume";
import TemplateThumbnail from "@/components/TemplateThumbnail";
import { renderTemplate } from "@/templates/registry";
import { ArrowRight, Zap, FileDown, Share2, Layers } from "lucide-react";

const featTiles = [
  { icon: Layers, title: "8 professional templates", desc: "Editorial, technical, corporate, creative - a template for every story." },
  { icon: Zap, title: "Live preview", desc: "Type on the left, see it typeset on the right. No refresh. No lag." },
  { icon: FileDown, title: "Print-ready PDF", desc: "Perfect A4 export. Every kern, every rule respected." },
  { icon: Share2, title: "Shareable link", desc: "One URL to send recruiters. No login required to view." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(91,61,245,0.12),_transparent_45%),linear-gradient(135deg,_#f8faff_0%,_#ffffff_100%)]">
      <Nav />

      {/* HERO */}
      <section className="border-b border-violet-100/80">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <div className="brand-pill inline-flex items-center gap-2" data-testid="hero-overline">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
              CareerSync Resume Builder
            </div>
            <h1 className="mt-5 font-heading text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-zinc-900" data-testid="hero-title">
              Build a resume<br />that gets<br />
              <span className="text-violet-600">noticed.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-zinc-600 leading-relaxed" data-testid="hero-subtitle">
              Pick a polished template, fill your details once, and export a print-ready PDF or share a live link. Everything is designed to feel like part of CareerSync.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/templates"
                data-testid="hero-cta-primary"
                className="inline-flex items-center bg-[linear-gradient(135deg,_#5B3DF5,_#7B61FF)] text-white px-6 py-3 text-sm font-semibold rounded-full shadow-[0_12px_30px_rgba(91,61,245,0.22)] hover:translate-y-[-1px] transition-all group"
              >
                Browse templates
                <ArrowRight size={16} strokeWidth={1.5} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/editor"
                data-testid="hero-cta-secondary"
                className="inline-flex items-center border border-violet-200 bg-white/80 px-6 py-3 text-sm font-semibold rounded-full hover:bg-violet-50 transition-colors"
              >
                Start blank
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-zinc-500">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> No login required</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> ATS-friendly layouts</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Free forever</div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-32 w-32 -z-0 rounded-[2rem] border border-violet-200 bg-violet-50" />
              <div className="absolute -bottom-6 -right-6 h-24 w-24 -z-0 rounded-full bg-[linear-gradient(135deg,_#5B3DF5,_#7B61FF)]" />
              <div className="relative z-10 origin-top-left rounded-[2rem] border border-violet-100 bg-white/90 p-3 shadow-[0_20px_60px_rgba(91,61,245,0.12)]" style={{ transform: "scale(0.42) rotate(-2deg)", transformOrigin: "top right", height: 480 }}>
                {renderTemplate("editorial", sampleResume)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="how" className="border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
          <div className="mb-14 max-w-2xl">
            <p className="overline text-zinc-500">How it works</p>
            <h2 className="mt-3 font-heading text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900">
              Four steps.<br />No excuses.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featTiles.map((f, i) => (
              <div key={i} data-testid={`feature-tile-${i}`} className="border border-zinc-200 p-6 hover:border-zinc-900 transition-colors group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-zinc-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                    <f.icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="font-space-mono text-xs text-zinc-400">0{i + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-zinc-900">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATE PREVIEW STRIP */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="overline text-zinc-500">The library</p>
              <h2 className="mt-3 font-heading text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900">Eight distinct voices.</h2>
            </div>
            <Link to="/templates" data-testid="landing-see-all-templates" className="hidden sm:inline-flex items-center text-sm font-semibold hover:underline">
              See all templates <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.slice(0, 4).map((t) => (
              <Link
                key={t.id}
                to={`/editor?template=${t.id}`}
                data-testid={`landing-template-card-${t.id}`}
                className="group flex flex-col items-start gap-3"
              >
                <TemplateThumbnail scale={0.32}>{renderTemplate(t.id, sampleResume)}</TemplateThumbnail>
                <div>
                  <div className="font-heading font-bold text-zinc-900">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.vibe}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-heading text-4xl lg:text-6xl font-black tracking-tighter leading-[0.95]">
              Your next role<br />starts with one <br /><span className="italic font-serif-editorial font-medium">good page.</span>
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <Link to="/templates" data-testid="footer-cta-btn" className="inline-flex items-center bg-white text-black px-8 py-4 text-base font-semibold rounded-sm hover:bg-zinc-200 transition-colors">
              Choose your template
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <p className="mt-4 text-sm text-zinc-400">Takes 3 minutes. No account. No credit card.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 bg-black text-zinc-500 text-xs">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex justify-between">
          <span>(c) {new Date().getFullYear()} CareerSync Resume Builder</span>
          <span>v1.0</span>
        </div>
      </footer>
    </div>
  );
}

