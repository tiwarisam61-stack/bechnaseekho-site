import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeDocument, PAGE_SIZES } from "./ResumeDocument";
import type { ResumeDoc } from "@/lib/resume-types";

/** Distraction-free, PDF-like full screen preview with pinch-to-zoom. */
export function MobilePreviewSheet({
  open,
  doc,
  onClose,
  onDownload,
  exporting,
}: {
  open: boolean;
  doc: ResumeDoc;
  onClose: () => void;
  onDownload: () => void;
  exporting?: boolean;
}) {
  const page = PAGE_SIZES[doc.settings.pageSize];
  const [zoom, setZoom] = useState(0.5);
  const docRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);
  const [height, setHeight] = useState(page.h);

  const fit = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const avail = el.clientWidth - 24;
    if (avail > 0) setZoom(Math.min(1.4, Math.max(0.2, +(avail / page.w).toFixed(3))));
  }, [page.w]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      fit();
      setHeight(docRef.current?.scrollHeight ?? page.h);
    }, 40);
    window.addEventListener("resize", fit);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", fit);
    };
  }, [open, fit, page.h, doc]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const pages = Math.max(1, Math.ceil(height / page.h));

  return (
    <div className="no-print fixed inset-0 z-50 flex flex-col bg-muted">
      <header className="flex items-center gap-2 border-b bg-background px-2 py-2">
        <Button variant="ghost" size="icon" className="size-11" aria-label="Back to editor" onClick={onClose}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{doc.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {pages} page{pages > 1 ? "s" : ""} · {doc.settings.pageSize}
          </p>
        </div>
        <Button variant="outline" size="icon" className="size-10" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.2, +(z - 0.1).toFixed(2)))}>
          <ZoomOut className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="size-10" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))}>
          <ZoomIn className="size-4" />
        </Button>
      </header>

      <div
        ref={viewportRef}
        className="flex-1 overflow-auto overscroll-contain p-3 [touch-action:pan-x_pan-y_pinch-zoom]"
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            const [a, b] = [e.touches[0], e.touches[1]];
            pinch.current = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), zoom };
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinch.current) {
            const [a, b] = [e.touches[0], e.touches[1]];
            const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
            setZoom(Math.min(1.6, Math.max(0.2, +(pinch.current.zoom * (d / pinch.current.dist)).toFixed(3))));
          }
        }}
        onTouchEnd={() => {
          pinch.current = null;
        }}
        onDoubleClick={() => (zoom > 0.75 ? fit() : setZoom(1))}
      >
        <div style={{ width: page.w * zoom, height: height * zoom, margin: "0 auto" }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
            <ResumeDocument ref={docRef} doc={doc} />
          </div>
        </div>
      </div>

      <div className="border-t bg-background px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <Button className="min-h-12 w-full text-base" disabled={exporting} onClick={onDownload}>
          {exporting ? <Loader2 className="size-5 animate-spin" /> : <Download className="size-5" />}
          Download resume
        </Button>
      </div>
    </div>
  );
}
