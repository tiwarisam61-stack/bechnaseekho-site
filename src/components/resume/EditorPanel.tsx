import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import type { ResumeDoc, ResumeSection } from "@/lib/resume-types";
import { uid } from "@/lib/resume-types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AiMenu } from "./AiMenu";
import { extractResumeText, RESUME_ACCEPT, RESUME_FILE_ERROR } from "@/lib/file-text";
import { applyParsedResume } from "@/lib/resume-import";
import { aiParseResume } from "@/lib/ai.functions";
import { getSharedResumeUploadUserId, uploadSharedCareerSyncResume } from "@/lib/careersync-jobs-api";
import { cn } from "@/lib/utils";


type Setter = (updater: (d: ResumeDoc) => ResumeDoc) => void;

const updateSection = (doc: ResumeDoc, id: string, patch: Partial<ResumeSection>): ResumeDoc => ({
  ...doc,
  sections: doc.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
});

function Field({
  label,
  value,
  onChange,
  placeholder,
  context,
  multiline,
  rows = 3,
  type = "text",
  inputMode,
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  context?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex min-h-8 items-center justify-between gap-2">
        <Label className="text-xs text-muted-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        {context && <AiMenu value={value} context={context} onApply={onChange} />}
      </div>
      {multiline ? (
        <Textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="text-base sm:text-sm"
        />
      ) : (
        <Input
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" })}
          className="min-h-11 text-base sm:text-sm"
        />
      )}
    </div>
  );
}


export function EditorPanel({ doc, setDoc }: { doc: ResumeDoc; setDoc: Setter }) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const parseResume = useServerFn(aiParseResume);

  const setProfile = (patch: Partial<ResumeDoc["profile"]>) =>
    setDoc((d) => ({ ...d, profile: { ...d.profile, ...patch } }));

  const importResume = async (file: File) => {
    if (!/\.(pdf|docx?|txt)$/i.test(file.name)) {
      toast.error(RESUME_FILE_ERROR);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is larger than 5 MB. Please upload a smaller resume.");
      return;
    }
    setImporting(true);
    try {
      await uploadSharedCareerSyncResume({
        userId: getSharedResumeUploadUserId("resume-template-editor"),
        file,
      });
      const text = await extractResumeText(file);
      if (text.trim().length < 40) throw new Error("We couldn't find selectable text in that file.");
      const res = await parseResume({ data: { text, fileName: file.name } });
      const imported = applyParsedResume(doc, res.json);
      setDoc(() => imported.doc);
      toast.success("Resume imported — your details now fill the editor.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't read that resume. Please try again.");
    } finally {
      setImporting(false);
    }
  };


  const move = (id: string, delta: number) =>
    setDoc((d) => {
      const list = [...d.sections];
      const from = list.findIndex((s) => s.id === id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= list.length) return d;
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      return { ...d, sections: list };
    });

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setDoc((d) => {
      const list = [...d.sections];
      const from = list.findIndex((s) => s.id === dragId);
      const to = list.findIndex((s) => s.id === targetId);
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      return { ...d, sections: list };
    });
    setDragId(null);
  };

  const addSection = () =>
    setDoc((d) => ({
      ...d,
      sections: [
        ...d.sections,
        {
          id: uid(),
          kind: "custom",
          label: "Custom Section",
          enabled: true,
          text: "",
        },
      ],
    }));

  return (
    <div className="space-y-4">
      {/* Profile */}
      <section className="rounded-2xl border bg-card p-4 shadow-soft">
        <h3 className="text-lg">Personal details</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Full name" required value={doc.profile.fullName} autoComplete="name" onChange={(v) => setProfile({ fullName: v })} placeholder="Aarav Sharma" />
          <Field label="Headline" required value={doc.profile.headline} context="resume headline" onChange={(v) => setProfile({ headline: v })} placeholder="Senior Frontend Engineer" />
          <Field label="Email" required type="email" inputMode="email" autoComplete="email" value={doc.profile.email} onChange={(v) => setProfile({ email: v })} placeholder="you@email.com" />
          <Field label="Phone" required type="tel" inputMode="tel" autoComplete="tel" value={doc.profile.phone} onChange={(v) => setProfile({ phone: v })} placeholder="+91 98765 43210" />
          <Field label="Location" value={doc.profile.location} autoComplete="address-level2" onChange={(v) => setProfile({ location: v })} placeholder="City, Country" />
          <Field label="LinkedIn" type="url" inputMode="url" value={doc.profile.linkedin} onChange={(v) => setProfile({ linkedin: v })} placeholder="linkedin.com/in/you" />
          <Field label="GitHub" type="url" inputMode="url" value={doc.profile.github ?? ""} onChange={(v) => setProfile({ github: v })} placeholder="github.com/you" />
          <Field label="Portfolio" type="url" inputMode="url" value={doc.profile.portfolio} onChange={(v) => setProfile({ portfolio: v })} placeholder="yoursite.com" />


          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Profile photo (JPG, PNG, WEBP)</Label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                if (!/\.(jpe?g|png|webp)$/i.test(file.name)) {
                  toast.error("Only JPG, JPEG, PNG and WEBP images are supported.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () =>
                  setDoc((d) => ({
                    ...d,
                    profile: { ...d.profile, photo: String(reader.result) },
                    settings: { ...d.settings, showPhoto: true },
                  }));
                reader.readAsDataURL(file);
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Upload existing resume (PDF, DOC, DOCX)
            </Label>
            <Input
              type="file"
              accept={RESUME_ACCEPT}
              disabled={importing}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) void importResume(file);
              }}
            />
            <p className="text-[11px] text-muted-foreground">
              {importing ? "Reading and extracting your details…" : "AI fills the editor from your file."}
            </p>
          </div>

        </div>
      </section>

      {/* Sections */}
      {doc.sections.map((section) => (
        <section
          key={section.id}
          draggable
          onDragStart={() => setDragId(section.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(section.id)}
          className={cn(
            "rounded-2xl border bg-card shadow-soft transition",
            dragId === section.id && "opacity-50",
            !section.enabled && "opacity-70",
          )}
        >
          <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 p-2.5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-3">
            <div className="flex shrink-0 items-center">
              <GripVertical className="hidden size-4 cursor-grab text-muted-foreground lg:block" />
              <div className="flex lg:hidden">
                <Button variant="ghost" size="icon" className="size-9" aria-label="Move section up" onClick={() => move(section.id, -1)}>
                  <ChevronUp className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-9" aria-label="Move section down" onClick={() => move(section.id, 1)}>
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>
            <input
              value={section.label}
              onChange={(e) => setDoc((d) => updateSection(d, section.id, { label: e.target.value }))}
              className="min-w-0 truncate bg-transparent text-base font-semibold outline-none focus:underline"
              aria-label="Section title"
            />
            <div className="col-span-2 flex shrink-0 items-center justify-end gap-0.5 sm:col-span-1">

              <Button
                variant="ghost"
                size="icon"
                className="size-9 sm:size-9"
                aria-label={section.enabled ? "Hide section" : "Show section"}
                onClick={() => setDoc((d) => updateSection(d, section.id, { enabled: !section.enabled }))}
              >
                {section.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 sm:size-9"
                aria-label="Duplicate section"
                onClick={() =>
                  setDoc((d) => {
                    const idx = d.sections.findIndex((s) => s.id === section.id);
                    const copy = {
                      ...section,
                      id: uid(),
                      label: `${section.label} (copy)`,
                      items: section.items?.map((i) => ({ ...i, id: uid() })),
                    };
                    const list = [...d.sections];
                    list.splice(idx + 1, 0, copy);
                    return { ...d, sections: list };
                  })
                }
              >
                <Copy className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-destructive"
                aria-label="Delete section"
                onClick={() => setDoc((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== section.id) }))}
              >
                <Trash2 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 sm:size-9"
                aria-label="Expand or collapse"
                onClick={() => setDoc((d) => updateSection(d, section.id, { collapsed: !section.collapsed }))}
              >
                <ChevronDown className={cn("size-4 transition-transform", section.collapsed && "-rotate-90")} />
              </Button>
            </div>
          </header>

          {!section.collapsed && (
            <div className="space-y-3 border-t p-4">
              {section.tags !== undefined ? (
                <Field
                  label="Comma separated list"
                  multiline
                  rows={2}
                  context={section.label}
                  value={(section.tags ?? []).join(", ")}
                  onChange={(v) =>
                    setDoc((d) =>
                      updateSection(d, section.id, {
                        tags: v.split(",").map((t) => t.trim()).filter(Boolean),
                      }),
                    )
                  }
                  placeholder="React, TypeScript, AWS"
                />
              ) : section.items !== undefined ? (
                <>
                  {(section.items ?? []).map((item, index) => (
                    <div key={item.id} className="rounded-xl border bg-muted/30 p-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field
                          label="Title"
                          value={item.title}
                          context={`${section.label} entry title`}
                          onChange={(v) =>
                            setDoc((d) =>
                              updateSection(d, section.id, {
                                items: section.items!.map((i, n) => (n === index ? { ...i, title: v } : i)),
                              }),
                            )
                          }
                        />
                        <Field
                          label="Organisation"
                          value={item.subtitle ?? ""}
                          onChange={(v) =>
                            setDoc((d) =>
                              updateSection(d, section.id, {
                                items: section.items!.map((i, n) => (n === index ? { ...i, subtitle: v } : i)),
                              }),
                            )
                          }
                        />
                        <Field
                          label="Dates"
                          value={item.meta ?? ""}
                          onChange={(v) =>
                            setDoc((d) =>
                              updateSection(d, section.id, {
                                items: section.items!.map((i, n) => (n === index ? { ...i, meta: v } : i)),
                              }),
                            )
                          }
                          placeholder="2022 — Present"
                        />
                        <Field
                          label="Location"
                          value={item.location ?? ""}
                          onChange={(v) =>
                            setDoc((d) =>
                              updateSection(d, section.id, {
                                items: section.items!.map((i, n) => (n === index ? { ...i, location: v } : i)),
                              }),
                            )
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <Field
                          label="Bullet points (one per line)"
                          multiline
                          rows={4}
                          context={`${section.label} bullet points`}
                          value={item.bullets.join("\n")}
                          onChange={(v) =>
                            setDoc((d) =>
                              updateSection(d, section.id, {
                                items: section.items!.map((i, n) =>
                                  n === index ? { ...i, bullets: v.split("\n").map((b) => b.replace(/^[-•]\s*/, "")) } : i,
                                ),
                              }),
                            )
                          }
                        />
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() =>
                            setDoc((d) =>
                              updateSection(d, section.id, {
                                items: section.items!.filter((_, n) => n !== index),
                              }),
                            )
                          }
                        >
                          <Trash2 className="size-3.5" /> Remove entry
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDoc((d) =>
                        updateSection(d, section.id, {
                          enabled: true,
                          items: [
                            ...(section.items ?? []),
                            { id: uid(), title: "", subtitle: "", meta: "", location: "", bullets: [""] },
                          ],
                        }),
                      )
                    }
                  >
                    <Plus className="size-3.5" /> Add entry
                  </Button>
                </>
              ) : (
                <Field
                  label="Content"
                  multiline
                  rows={5}
                  context={section.label}
                  value={section.text ?? ""}
                  onChange={(v) => setDoc((d) => updateSection(d, section.id, { text: v }))}
                  placeholder="Write here, or let AI generate it for you."
                />
              )}
            </div>
          )}
        </section>
      ))}

      <Button variant="outline" className="w-full" onClick={addSection}>
        <Plus className="size-4" /> Add new section
      </Button>
    </div>
  );
}
