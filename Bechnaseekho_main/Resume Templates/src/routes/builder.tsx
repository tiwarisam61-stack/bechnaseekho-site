import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  FileText,
  Gauge,
  History,
  Home,
  Loader2,
  Maximize,
  Menu,
  PanelsTopLeft,
  Redo2,
  Save,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditorPanel } from "@/components/resume/EditorPanel";
import { AtsPanel } from "@/components/resume/AtsPanel";
import { ResumeDocument, PAGE_SIZES } from "@/components/resume/ResumeDocument";
import { MobileWizard, WIZARD_STEPS, type WizardStepId } from "@/components/resume/MobileWizard";
import { MobilePreviewSheet } from "@/components/resume/MobilePreviewSheet";
import { MobileOnboarding } from "@/components/resume/MobileOnboarding";
import { DownloadProgressDialog } from "@/components/resume/DownloadProgressDialog";
import { analyzeResume } from "@/lib/ats";
import { ACCENTS, createResume, type ResumeDoc } from "@/lib/resume-types";
import { ensureResume, pushVersion, loadVersions, useResumeState, type VersionSnapshot } from "@/lib/resume-store";
import { exportDocx, exportPdf, resumeFileBase } from "@/lib/resume-export";
import { DownloadSuccessDialog } from "@/components/resume/DownloadSuccessDialog";
import { TEMPLATES } from "@/lib/templates";
import { useIsCompact } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/builder")({
  validateSearch: z.object({ t: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Resume Editor — CareerSync by Bechna Seekho" },
      {
        name: "description",
        content:
          "Edit your resume with live preview, AI writing assistance and real-time ATS scoring, then export a perfect PDF or Word file.",
      },
      { property: "og:title", content: "AI Resume Editor — CareerSync" },
      {
        property: "og:description",
        content: "Live preview, AI writing assistance and real-time ATS scoring in one studio.",
      },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  const { t } = Route.useSearch();
  const [ready, setReady] = useState(false);
  const [initial, setInitial] = useState<ResumeDoc>(() => createResume(t ?? "meridian", true));

  useEffect(() => {
    setInitial(ensureResume(t));
    setReady(true);
  }, [t]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <Builder key={initial.id} initial={initial} />;
}

type MobileTab = "content" | "design" | "advanced";

function Builder({ initial }: { initial: ResumeDoc }) {
  const { doc, setDoc, replaceDoc, undo, redo, savedAt } = useResumeState(initial);
  const [zoom, setZoom] = useState(0.68);
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();
  const [celebrated, setCelebrated] = useState(false);
  const [success, setSuccess] = useState<"PDF" | "Word" | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("content");
  const [wizardStep, setWizardStep] = useState<WizardStepId>("personal");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pending, setPending] = useState<"PDF" | "Word" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const autoFitRef = useRef(true);
  const compact = useIsCompact();

  useEffect(() => setVersions(loadVersions()), []);

  const report = useMemo(() => analyzeResume(doc), [doc]);
  const page = PAGE_SIZES[doc.settings.pageSize];
  const docHeight = previewRef.current?.scrollHeight ?? page.h;
  const pageCount = Math.max(1, Math.ceil(docHeight / page.h));

  useEffect(() => {
    if (report.completion >= 100 && !celebrated) {
      setCelebrated(true);
      toast.success("🎉 Your resume is 100% complete — time to apply!");
    }
  }, [report.completion, celebrated]);

  const fitWidth = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const avail = el.clientWidth - 16;
    if (avail > 0) setZoom(Math.min(1.2, Math.max(0.2, +(avail / page.w).toFixed(3))));
  }, [page.w]);

  const fitPage = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const avail = Math.min((el.clientWidth - 16) / page.w, (el.clientHeight - 16) / page.h);
    if (avail > 0) setZoom(Math.min(1.2, Math.max(0.2, +avail.toFixed(3))));
  }, [page.w, page.h]);

  /* Auto fit-to-width on small screens (and on resize/rotate) so nothing overflows. */
  const attachViewport = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      observerRef.current?.disconnect();
      if (!node || !compact) return;
      const ro = new ResizeObserver(() => {
        if (autoFitRef.current) fitWidth();
      });
      ro.observe(node);
      observerRef.current = ro;
      fitWidth();
    },
    [compact, fitWidth],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  useEffect(() => {
    if (compact) {
      autoFitRef.current = true;
      fitWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact, mobileTab, doc.settings.pageSize]);


  const set = (patch: Partial<ResumeDoc["settings"]>) =>
    setDoc((d) => ({ ...d, settings: { ...d.settings, ...patch } }));

  const handleDocx = async () => {
    setExporting(true);
    try {
      await exportDocx(doc);
      setSuccess("Word");
    } catch {
      toast.error("Word export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handlePdf = () => {
    exportPdf(doc);
    window.setTimeout(() => setSuccess("PDF"), 900);
  };

  /** Mobile download with staged, reassuring feedback. */
  const startDownload = (format: "PDF" | "Word") => {
    setPreviewOpen(false);
    setPending(format);
  };

  const runPending = useCallback(() => {
    const format = pending;
    setPending(null);
    if (format === "Word") void handleDocx();
    else if (format === "PDF") handlePdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, doc]);



  const saveVersion = () => {
    setVersions(pushVersion(doc, `${doc.name} · ${new Date().toLocaleString()}`));
    toast.success("Version saved");
  };

  /* ------------------------------ shared panes ------------------------------ */

  const designPane = (
    <div className="space-y-5 rounded-2xl border bg-card p-4 shadow-soft">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Template</Label>
        <Select value={doc.settings.templateId} onValueChange={(v) => set({ templateId: v })}>
          <SelectTrigger className="min-h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATES.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name} · {t.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Accent colour</Label>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-label={a.label}
              aria-pressed={doc.settings.accent === a.value}
              onClick={() => set({ accent: a.value })}
              className={cn(
                "grid size-11 place-items-center rounded-full transition hover:scale-110",
                doc.settings.accent === a.value ? "ring-2 ring-foreground ring-offset-2" : "",
              )}
            >
              <span style={{ background: a.value }} className="block size-7 rounded-full border" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Font</Label>
          <Select
            value={doc.settings.fontFamily}
            onValueChange={(v) => set({ fontFamily: v as "sans" | "serif" | "mono" })}
          >
            <SelectTrigger className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans (Jakarta)</SelectItem>
              <SelectItem value="serif">Serif (Instrument)</SelectItem>
              <SelectItem value="mono">Mono</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Page size</Label>
          <Select value={doc.settings.pageSize} onValueChange={(v) => set({ pageSize: v as "A4" | "Letter" })}>
            <SelectTrigger className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="Letter">Letter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SliderRow label="Font size" value={doc.settings.fontScale} min={0.85} max={1.2} step={0.01} onChange={(v) => set({ fontScale: v })} />
      <SliderRow label="Line spacing" value={doc.settings.lineSpacing} min={1.2} max={1.8} step={0.05} onChange={(v) => set({ lineSpacing: v })} />
      <SliderRow label="Margins" value={doc.settings.margin} min={24} max={72} step={2} onChange={(v) => set({ margin: v })} suffix="px" />

      <div className="flex min-h-11 items-center justify-between gap-3">
        <Label className="text-xs text-muted-foreground">Dark preview surface</Label>
        <Switch checked={doc.settings.darkPreview} onCheckedChange={(v) => set({ darkPreview: v })} />
      </div>
      <div className="flex min-h-11 items-center justify-between gap-3">
        <Label className="text-xs text-muted-foreground">Show photo</Label>
        <Switch checked={doc.settings.showPhoto} onCheckedChange={(v) => set({ showPhoto: v })} />
      </div>
    </div>
  );

  const previewPane = (
    <div
      className={cn(
        "rounded-2xl border p-2.5 transition-colors sm:rounded-3xl sm:p-4",
        doc.settings.darkPreview ? "bg-[oklch(0.18_0.02_258)]" : "bg-card",
      )}
    >
      <div className="no-print mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
        <p className={cn("truncate text-[11px] sm:text-xs", doc.settings.darkPreview ? "text-white/60" : "text-muted-foreground")}>
          {pageCount} page{pageCount > 1 ? "s" : ""} · {doc.settings.pageSize} · {report.readingTime}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-9 sm:size-9"
            aria-label="Zoom out"
            onClick={() => { autoFitRef.current = false; setZoom((z) => Math.max(0.2, +(z - 0.08).toFixed(2))); }}
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="w-11 text-center text-xs tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            aria-label="Zoom in"
            onClick={() => { autoFitRef.current = false; setZoom((z) => Math.min(1.2, +(z + 0.08).toFixed(2))); }}
          >
            <ZoomIn className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="size-9" aria-label="Fit to width" onClick={() => { autoFitRef.current = true; fitWidth(); }}>
            <PanelsTopLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="size-9" aria-label="Fit whole page" onClick={() => { autoFitRef.current = false; fitPage(); }}>
            <Maximize className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={attachViewport}
        onDoubleClick={() => { autoFitRef.current = false; setZoom((z) => (z > 0.85 ? 0.5 : 1)); }}
        className="max-h-[70vh] overflow-auto overscroll-contain rounded-2xl [touch-action:pan-x_pan-y_pinch-zoom] lg:max-h-[calc(100vh-11rem)]"
      >
        <div style={{ width: page.w * zoom, height: docHeight * zoom, margin: "0 auto" }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
            <ResumeDocument ref={previewRef} doc={doc} />
          </div>
        </div>
      </div>
    </div>
  );

  const exportMenu = (align: "end" | "center", full = false) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={exporting} className={cn("min-h-11", full && "w-full flex-col gap-0.5 px-1 text-[11px]")}>
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={full ? "top" : "bottom"}>
        <DropdownMenuItem onSelect={() => handlePdf()}>Download PDF</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void handleDocx()}>Download Word (.docx)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const versionsMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="min-h-11">
          <History className="size-4" /> Versions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs">Version history</DropdownMenuLabel>
        {versions.length === 0 && (
          <DropdownMenuItem disabled className="text-xs">
            No saved versions yet
          </DropdownMenuItem>
        )}
        {versions.map((v) => (
          <DropdownMenuItem key={v.id} onSelect={() => replaceDoc(v.doc)}>
            <span className="truncate">{v.name}</span>
            <span className="ml-auto text-[10px] text-muted-foreground">{new Date(v.at).toLocaleTimeString()}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={saveVersion}>
          <Save className="size-3.5" /> Save current version
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            replaceDoc({ ...doc, id: Math.random().toString(36).slice(2, 10), name: `${doc.name} (copy)` });
            toast.success("Resume duplicated");
          }}
        >
          Duplicate resume
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  /* ---------------------------------- view ---------------------------------- */

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="no-print sticky top-0 z-40 border-b glass">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
          <Button variant="ghost" size="icon" className="size-11 shrink-0" asChild aria-label="Back to templates">
            <Link to="/">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <FileText className="hidden size-4 shrink-0 text-brass sm:block" />
          <Input
            value={doc.name}
            onChange={(e) => setDoc((d) => ({ ...d, name: e.target.value }))}
            aria-label="Resume name"
            className="h-10 min-w-0 flex-1 border-transparent bg-transparent px-1 text-sm font-semibold shadow-none focus-visible:border-input lg:max-w-56"
          />
          <span className="hidden items-center gap-1 text-xs text-muted-foreground xl:inline-flex">
            {savedAt ? (
              <>
                <Check className="size-3 text-success" /> Saved
              </>
            ) : (
              "Autosaving…"
            )}
          </span>

          {/* Desktop actions */}
          <div className="ml-auto hidden flex-wrap items-center justify-end gap-1.5 lg:flex">
            <Button variant="ghost" size="icon" className="size-11" onClick={undo} aria-label="Undo">
              <Undo2 className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-11" onClick={redo} aria-label="Redo">
              <Redo2 className="size-4" />
            </Button>
            {versionsMenu}
            {exportMenu("end")}
          </div>

          {/* Mobile hamburger */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto size-11 shrink-0 lg:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm">
              <SheetHeader>
                <SheetTitle>Resume actions</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2 px-4 pb-6">
                <p className="text-xs text-muted-foreground">
                  {savedAt ? "All changes saved automatically." : "Autosaving…"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="min-h-11" onClick={undo}>
                    <Undo2 className="size-4" /> Undo
                  </Button>
                  <Button variant="outline" className="min-h-11" onClick={redo}>
                    <Redo2 className="size-4" /> Redo
                  </Button>
                </div>
                <Button variant="outline" className="min-h-11 justify-start" onClick={() => { saveVersion(); setMenuOpen(false); }}>
                  <Save className="size-4" /> Save version
                </Button>
                <Button
                  variant="outline"
                  className="min-h-11 justify-start"
                  onClick={() => { setMobileTab("design"); setMenuOpen(false); }}
                >
                  <PanelsTopLeft className="size-4" /> Template &amp; design
                </Button>
                <Button
                  variant="outline"
                  className="min-h-11 justify-start"
                  onClick={() => { setMobileTab("advanced"); setMenuOpen(false); }}
                >
                  <FileText className="size-4" /> Advanced editor (all sections)
                </Button>

                <Button
                  variant="outline"
                  className="min-h-11 justify-start"
                  onClick={() => {
                    replaceDoc({ ...doc, id: Math.random().toString(36).slice(2, 10), name: `${doc.name} (copy)` });
                    setMenuOpen(false);
                    toast.success("Resume duplicated");
                  }}
                >
                  Duplicate resume
                </Button>
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Version history</p>
                  {versions.length === 0 && <p className="text-xs text-muted-foreground">No saved versions yet.</p>}
                  {versions.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        replaceDoc(v.doc);
                        setMenuOpen(false);
                      }}
                      className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 text-left text-xs"
                    >
                      <span className="truncate">{v.name}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {new Date(v.at).toLocaleTimeString()}
                      </span>
                    </button>
                  ))}
                </div>
                <Button className="mt-2 min-h-11" onClick={() => { setMenuOpen(false); handlePdf(); }}>
                  <Download className="size-4" /> Download PDF
                </Button>
                <Button variant="outline" className="min-h-11" disabled={exporting} onClick={() => { setMenuOpen(false); void handleDocx(); }}>
                  <Download className="size-4" /> Download Word (.docx)
                </Button>
                <Button variant="ghost" className="min-h-11" asChild>
                  <Link to="/">Back to templates</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {compact ? (
        /* ------------------------------- Mobile / tablet ------------------------------- */
        <div className="px-3 pb-32 pt-4 sm:px-5">
          {mobileTab === "design" ? (
            <div className="space-y-4">
              <Button variant="ghost" className="min-h-11 px-0" onClick={() => setMobileTab("content")}>
                <ArrowLeft className="size-4" /> Back to my resume
              </Button>
              {designPane}
            </div>
          ) : mobileTab === "advanced" ? (
            <div className="space-y-4">
              <Button variant="ghost" className="min-h-11 px-0" onClick={() => setMobileTab("content")}>
                <ArrowLeft className="size-4" /> Back to guided steps
              </Button>
              <EditorPanel doc={doc} setDoc={setDoc} />
            </div>
          ) : (
            <MobileWizard
              doc={doc}
              setDoc={setDoc}
              report={report}
              step={wizardStep}
              setStep={setWizardStep}
              onPreview={() => setPreviewOpen(true)}
              onDownloadPdf={() => startDownload("PDF")}
              onDownloadDocx={() => startDownload("Word")}
              exporting={exporting}
            />
          )}
        </div>

      ) : (
        /* --------------------------------- Desktop --------------------------------- */
        <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)_minmax(0,290px)] xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)_minmax(0,300px)]">
          <div className="no-print order-2 lg:order-1">
            <Tabs defaultValue="content">
              <TabsList className="w-full">
                <TabsTrigger value="content" className="flex-1">
                  Content
                </TabsTrigger>
                <TabsTrigger value="design" className="flex-1">
                  Design
                </TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <EditorPanel doc={doc} setDoc={setDoc} />
              </TabsContent>
              <TabsContent value="design" className="mt-4">
                {designPane}
              </TabsContent>
            </Tabs>
          </div>

          <div className="order-1 lg:order-2">
            <div className="sticky top-20">{previewPane}</div>
          </div>

          <aside className="no-print order-3">
            <div className="sticky top-20">
              <AtsPanel report={report} />
            </div>
          </aside>
        </div>
      )}

      {/* Print-only, unscaled replica so the PDF matches the preview exactly */}
      <div className="print-only" aria-hidden>
        <ResumeDocument doc={doc} printRoot />
      </div>

      {/* Floating preview button — always reachable while editing */}
      {compact && !previewOpen && mobileTab === "content" && (
        <Button
          className="no-print fixed bottom-24 right-4 z-40 min-h-12 rounded-full px-5 shadow-lg"
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="size-5" /> Preview resume
        </Button>
      )}

      {/* Bottom navigation */}
      {compact && (
        <nav
          aria-label="Main navigation"
          className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t glass px-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5"
        >
          <Button variant="ghost" className="min-h-12 w-full flex-col gap-0.5 px-1 text-[10px]" asChild>
            <Link to="/">
              <Home className="size-5" /> Home
            </Link>
          </Button>
          <Button
            variant={mobileTab === "content" && wizardStep !== "ats" && wizardStep !== "download" ? "secondary" : "ghost"}
            className="min-h-12 w-full flex-col gap-0.5 px-1 text-[10px]"
            onClick={() => {
              setMobileTab("content");
              if (wizardStep === "ats" || wizardStep === "download" || wizardStep === "preview")
                setWizardStep("personal");
            }}
          >
            <FileText className="size-5" /> Resume
          </Button>
          <Button
            variant="ghost"
            className="min-h-12 w-full flex-col gap-0.5 px-1 text-[10px]"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="size-5" /> Preview
          </Button>
          <Button
            variant={mobileTab === "content" && wizardStep === "ats" ? "secondary" : "ghost"}
            className="min-h-12 w-full flex-col gap-0.5 px-1 text-[10px]"
            onClick={() => {
              setMobileTab("content");
              setWizardStep("ats");
            }}
          >
            <Gauge className="size-5" /> ATS {report.overall}
          </Button>
          <Button
            variant={mobileTab === "content" && wizardStep === "download" ? "secondary" : "ghost"}
            className="min-h-12 w-full flex-col gap-0.5 px-1 text-[10px]"
            onClick={() => {
              setMobileTab("content");
              setWizardStep("download");
            }}
          >
            <Download className="size-5" /> Export
          </Button>
        </nav>
      )}

      {compact && (
        <>
          <MobileOnboarding onStart={() => setWizardStep("personal")} />
          <MobilePreviewSheet
            open={previewOpen}
            doc={doc}
            exporting={exporting}
            onClose={() => setPreviewOpen(false)}
            onDownload={() => startDownload("PDF")}
          />
          <DownloadProgressDialog open={pending !== null} format={pending ?? "PDF"} onDone={runPending} />
        </>
      )}


      <DownloadSuccessDialog
        open={success !== null}
        onOpenChange={(v) => !v && setSuccess(null)}
        fileName={`${resumeFileBase(doc)}.${success === "Word" ? "docx" : "pdf"}`}
        format={success ?? "PDF"}
        onDownloadAgain={() => {
          const format = success;
          setSuccess(null);
          if (format === "Word") void handleDocx();
          else handlePdf();
        }}
        onGoHome={() => navigate({ to: "/" })}
      />
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} className="py-2" />
    </div>
  );
}
