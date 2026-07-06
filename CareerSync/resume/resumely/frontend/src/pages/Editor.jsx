import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import { ResumeProvider, useResume } from "@/context/ResumeContext";
import EditorForm from "@/components/EditorForm";
import { sampleResume } from "@/data/sampleResume";
import { renderTemplate } from "@/templates/registry";
import { TEMPLATES } from "@/data/templates";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createResume, updateResume } from "@/lib/api";
import { Download, Share2, ChevronDown, Check, Layers } from "lucide-react";

function EditorInner() {
  const { resume, update, shareId, setShareId } = useResume();
  const [saving, setSaving] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.75);
  const wrapRef = useRef(null);

  // Fit preview to available width responsively
  useEffect(() => {
    const compute = () => {
      const w = wrapRef.current?.clientWidth || 800;
      const s = Math.min(0.85, Math.max(0.4, (w - 48) / 794));
      setPreviewScale(s);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const handleSelectTemplate = (id) => {
    update({ templateId: id });
    toast.success(`Switched to ${TEMPLATES.find((t) => t.id === id)?.name}`);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      setSaving(true);
      let id = shareId;
      if (!id) {
        const created = await createResume(resume);
        id = created.share_id;
        setShareId(id);
      } else {
        await updateResume(id, resume);
      }
      const url = `${window.location.origin}/r/${id}`;
      await navigator.clipboard.writeText(url).catch(() => { });
      toast.success("Shareable link copied", { description: url });
    } catch (e) {
      toast.error("Failed to create share link");
    } finally {
      setSaving(false);
    }
  };

  const currentTemplate = TEMPLATES.find((t) => t.id === resume.templateId) || TEMPLATES[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav
        right={
          <div className="flex items-center gap-2 no-print">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button data-testid="template-switcher-btn" variant="outline" className="rounded-sm text-sm">
                  <Layers size={14} className="mr-1.5" strokeWidth={1.5} /> {currentTemplate.name}
                  <ChevronDown size={14} className="ml-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Switch template</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TEMPLATES.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    data-testid={`template-switch-${t.id}`}
                    onClick={() => handleSelectTemplate(t.id)}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-zinc-500">{t.vibe}</div>
                    </div>
                    {t.id === resume.templateId && <Check size={14} />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button data-testid="btn-share" variant="outline" className="rounded-sm text-sm" onClick={handleShare} disabled={saving}>
              <Share2 size={14} className="mr-1.5" strokeWidth={1.5} /> {saving ? "Saving..." : "Share"}
            </Button>
            <Button data-testid="btn-download-pdf" className="rounded-sm text-sm bg-black text-white hover:bg-zinc-800" onClick={handleDownloadPDF}>
              <Download size={14} className="mr-1.5" strokeWidth={1.5} /> PDF
            </Button>
          </div>
        }
      />

      <div className="flex-1 grid lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] h-[calc(100vh-4rem)] overflow-hidden">
        {/* FORM */}
        <div className="border-r border-zinc-200 h-full overflow-hidden no-print">
          <EditorForm />
        </div>

        {/* PREVIEW */}
        <div ref={wrapRef} className="preview-pane bg-zinc-100 h-full overflow-y-auto thin-scroll flex justify-center py-8 px-6">
          <div
            className="preview-scale-wrapper"
            style={{ transform: `scale(${previewScale})`, transformOrigin: "top center", height: 1123 * previewScale + 20 }}
          >
            <div className="print-target">{renderTemplate(resume.templateId, resume)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Editor() {
  const [params] = useSearchParams();
  const templateId = params.get("template") || "modern-minimal";

  return (
    <ResumeProvider initial={{ ...sampleResume, templateId }}>
      <EditorInner />
    </ResumeProvider>
  );
}

