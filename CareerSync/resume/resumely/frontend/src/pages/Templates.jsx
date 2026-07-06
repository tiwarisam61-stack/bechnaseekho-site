import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import { TEMPLATES } from "@/data/templates";
import { sampleResume } from "@/data/sampleResume";
import { renderTemplate } from "@/templates/registry";
import TemplateThumbnail from "@/components/TemplateThumbnail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight } from "lucide-react";

export default function Templates() {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <section className="border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
          <p className="overline text-zinc-500">Template library</p>
          <h1 className="mt-3 font-heading text-4xl lg:text-6xl font-black tracking-tighter text-zinc-900" data-testid="templates-title">
            Pick a template<br />with a point of view.
          </h1>
          <p className="mt-4 max-w-xl text-zinc-600">
            Preview any template, then click &ldquo;Use this template&rdquo; to start filling in your details. You can switch anytime - your data stays.
          </p>
        </div>
      </section>

      <section className="bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {TEMPLATES.map((t) => (
              <div
                key={t.id}
                data-testid={`template-card-${t.id}`}
                className="flex flex-col items-start gap-3 animate-fade-up"
              >
                <div className="group relative isolate">
                  <TemplateThumbnail scale={0.36}>{renderTemplate(t.id, sampleResume)}</TemplateThumbnail>
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 opacity-0 transition-[opacity,background-color] duration-200 pointer-events-none group-hover:bg-black/50 group-hover:opacity-100 group-hover:pointer-events-auto">
                    <div className="flex gap-2">
                      <Button
                        data-testid={`btn-preview-${t.id}`}
                        variant="secondary"
                        className="rounded-sm"
                        onClick={() => setPreview(t)}
                      >
                        <Eye size={14} className="mr-1.5" /> Preview
                      </Button>
                      <Button
                        data-testid={`btn-use-${t.id}`}
                        className="rounded-sm bg-white text-black hover:bg-zinc-200"
                        onClick={() => navigate(`/editor?template=${t.id}`)}
                      >
                        Use <ArrowRight size={14} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-start justify-between">
                  <div>
                    <div className="font-heading font-bold text-zinc-900">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.description}</div>
                  </div>
                  <span className="text-[10px] font-space-mono uppercase text-zinc-500 border border-zinc-300 px-1.5 py-0.5">{t.vibe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW DIALOG */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-hidden p-0 rounded-sm">
          <DialogHeader className="p-4 border-b border-zinc-200">
            <DialogTitle className="font-heading text-2xl font-black tracking-tight" data-testid="preview-dialog-title">
              {preview?.name}
            </DialogTitle>
            <p className="text-sm text-zinc-500">{preview?.description}</p>
          </DialogHeader>
          <div className="p-6 bg-zinc-100 max-h-[70vh] overflow-y-auto thin-scroll flex justify-center">
            {preview && (
              <div style={{ transform: "scale(0.7)", transformOrigin: "top center", height: 1123 * 0.7 }}>
                {renderTemplate(preview.id, sampleResume)}
              </div>
            )}
          </div>
          <div className="p-4 flex justify-end gap-2 border-t border-zinc-200">
            <Button variant="outline" onClick={() => setPreview(null)} data-testid="preview-close-btn" className="rounded-sm">
              Close
            </Button>
            <Button
              data-testid="preview-use-btn"
              className="rounded-sm bg-black text-white hover:bg-zinc-800"
              onClick={() => preview && navigate(`/editor?template=${preview.id}`)}
            >
              Use this template <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

