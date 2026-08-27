import { useState } from "react";
import { Monitor, Printer, Smartphone, ZoomIn, ZoomOut, ArrowLeft, ShieldCheck, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResumeDocument } from "./ResumeDocument";
import type { ResumeTemplate } from "@/lib/templates";
import type { ResumeDoc } from "@/lib/resume-types";
import { cn } from "@/lib/utils";

type Device = "desktop" | "mobile" | "print";

export function TemplatePreviewModal({
  template,
  sample,
  open,
  onOpenChange,
  onUse,
}: {
  template: ResumeTemplate | null;
  sample: ResumeDoc | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUse: () => void;
}) {
  const [zoom, setZoom] = useState(0.72);
  const [device, setDevice] = useState<Device>("desktop");

  if (!template || !sample) return null;

  const deviceScale = device === "mobile" ? 0.42 : device === "print" ? 0.62 : zoom;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-[92vh] max-w-[min(1200px,96vw)] flex-col gap-0 overflow-hidden p-0 sm:rounded-3xl"
      >
        <DialogTitle className="sr-only">{template.name} template preview</DialogTitle>

        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b bg-card/80 px-4 py-3 backdrop-blur sm:flex sm:flex-wrap sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Back to gallery">
              <ArrowLeft className="size-4" />
            </Button>
            <div className="min-w-0">
              <h2 className="truncate text-xl leading-tight">{template.name}</h2>
              <p className="truncate text-xs text-muted-foreground">
                {template.category} · {template.blurb}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge className="gap-1 bg-success/12 text-success hover:bg-success/12">
              <ShieldCheck className="size-3" /> ATS {template.atsScore}%
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Eye className="size-3" /> Readability {template.readability}%
            </Badge>
            <Button onClick={onUse}>Use this template</Button>
          </div>
        </header>

        <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-1 rounded-full border bg-card p-1">
            {(
              [
                ["desktop", Monitor, "Desktop"],
                ["mobile", Smartphone, "Mobile"],
                ["print", Printer, "Print"],
              ] as const
            ).map(([id, Icon, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                  device === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-3.5" /> {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Zoom out"
              disabled={device !== "desktop"}
              onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))}
            >
              <ZoomOut className="size-4" />
            </Button>
            <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">
              {Math.round(deviceScale * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Zoom in"
              disabled={device !== "desktop"}
              onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))}
            >
              <ZoomIn className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[oklch(0.93_0.01_85)] p-6 dark:bg-[oklch(0.14_0.02_258)]">
          <div className="mx-auto flex w-fit flex-col items-center gap-8">
            {[0, 1].map((page) => (
              <div
                key={page}
                style={{
                  width: 794 * deviceScale,
                  height: 1123 * deviceScale,
                  position: "relative",
                }}
              >
                <div style={{ transform: `scale(${deviceScale})`, transformOrigin: "top left", position: "absolute" }}>
                  <ResumeDocument doc={page === 0 ? sample : { ...sample, sections: sample.sections.slice(4) }} />
                </div>
              </div>
            ))}
            <p className="pb-4 text-xs text-muted-foreground">Page 2 preview uses continuation content</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
