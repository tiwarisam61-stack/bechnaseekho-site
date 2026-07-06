import React from "react";
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus, Trash2, X } from "lucide-react";

const FieldRow = ({ label, children, testid }) => (
  <div className="grid gap-1.5">
    <Label className="text-[11px] uppercase tracking-wider text-zinc-600" data-testid={`label-${testid}`}>{label}</Label>
    {children}
  </div>
);

export default function EditorForm() {
  const { resume, update, updateField, addItem, removeItem } = useResume();

  const setPersonal = (key, value) =>
    update((r) => ({ personal: { ...r.personal, [key]: value } }));

  return (
    <div className="p-6 lg:p-8 thin-scroll overflow-y-auto h-full bg-[#FAFAFA]">
      <div className="mb-6">
        <p className="overline text-zinc-500">Editor</p>
        <h2 className="font-heading text-2xl font-black tracking-tight text-zinc-900">Fill your details</h2>
        <p className="text-sm text-zinc-600 mt-1">Everything you type appears live on the right.</p>
      </div>

      <Accordion type="multiple" defaultValue={["personal", "experience"]} className="space-y-3">
        {/* PERSONAL */}
        <AccordionItem value="personal" className="border border-zinc-200 rounded-sm bg-white">
          <AccordionTrigger data-testid="section-personal-toggle" className="px-4 hover:no-underline">
            <span className="font-heading font-bold">Personal Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid gap-3">
              <FieldRow label="Full name" testid="fullName">
                <Input data-testid="input-fullName" value={resume.personal.fullName} onChange={(e) => setPersonal("fullName", e.target.value)} />
              </FieldRow>
              <FieldRow label="Title / Role" testid="title">
                <Input data-testid="input-title" value={resume.personal.title} onChange={(e) => setPersonal("title", e.target.value)} />
              </FieldRow>
              <div className="grid grid-cols-2 gap-3">
                <FieldRow label="Email" testid="email">
                  <Input data-testid="input-email" value={resume.personal.email} onChange={(e) => setPersonal("email", e.target.value)} />
                </FieldRow>
                <FieldRow label="Phone" testid="phone">
                  <Input data-testid="input-phone" value={resume.personal.phone} onChange={(e) => setPersonal("phone", e.target.value)} />
                </FieldRow>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FieldRow label="Location" testid="location">
                  <Input data-testid="input-location" value={resume.personal.location} onChange={(e) => setPersonal("location", e.target.value)} />
                </FieldRow>
                <FieldRow label="Website" testid="website">
                  <Input data-testid="input-website" value={resume.personal.website} onChange={(e) => setPersonal("website", e.target.value)} />
                </FieldRow>
              </div>
              <FieldRow label="LinkedIn" testid="linkedin">
                <Input data-testid="input-linkedin" value={resume.personal.linkedin} onChange={(e) => setPersonal("linkedin", e.target.value)} />
              </FieldRow>
              <FieldRow label="Summary" testid="summary">
                <Textarea data-testid="input-summary" rows={4} value={resume.personal.summary} onChange={(e) => setPersonal("summary", e.target.value)} />
              </FieldRow>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* EXPERIENCE */}
        <AccordionItem value="experience" className="border border-zinc-200 rounded-sm bg-white">
          <AccordionTrigger data-testid="section-experience-toggle" className="px-4 hover:no-underline">
            <span className="font-heading font-bold">Experience</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {resume.experience.map((e, i) => (
                <div key={i} className="border border-zinc-200 p-3 rounded-sm bg-zinc-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500">Item #{i + 1}</span>
                    <Button data-testid={`btn-remove-experience-${i}`} size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeItem("experience", i)}>
                      <Trash2 size={14} strokeWidth={1.5} />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input data-testid={`input-experience-role-${i}`} placeholder="Role" value={e.role} onChange={(ev) => updateField("experience", i, "role", ev.target.value)} />
                      <Input data-testid={`input-experience-company-${i}`} placeholder="Company" value={e.company} onChange={(ev) => updateField("experience", i, "company", ev.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input data-testid={`input-experience-start-${i}`} placeholder="Start" value={e.startDate} onChange={(ev) => updateField("experience", i, "startDate", ev.target.value)} />
                      <Input data-testid={`input-experience-end-${i}`} placeholder="End" value={e.endDate} onChange={(ev) => updateField("experience", i, "endDate", ev.target.value)} />
                      <Input data-testid={`input-experience-location-${i}`} placeholder="Location" value={e.location} onChange={(ev) => updateField("experience", i, "location", ev.target.value)} />
                    </div>
                    <Textarea
                      data-testid={`input-experience-bullets-${i}`}
                      placeholder="One bullet per line"
                      rows={3}
                      value={(e.bullets || []).join("\n")}
                      onChange={(ev) => updateField("experience", i, "bullets", ev.target.value.split("\n").filter((s) => s !== ""))}
                    />
                  </div>
                </div>
              ))}
              <Button
                data-testid="btn-add-experience"
                variant="outline"
                className="w-full rounded-sm"
                onClick={() => addItem("experience", { company: "", role: "", startDate: "", endDate: "", location: "", bullets: [] })}
              >
                <Plus size={14} className="mr-1" /> Add experience
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* EDUCATION */}
        <AccordionItem value="education" className="border border-zinc-200 rounded-sm bg-white">
          <AccordionTrigger data-testid="section-education-toggle" className="px-4 hover:no-underline">
            <span className="font-heading font-bold">Education</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {resume.education.map((ed, i) => (
                <div key={i} className="border border-zinc-200 p-3 rounded-sm bg-zinc-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500">Item #{i + 1}</span>
                    <Button data-testid={`btn-remove-education-${i}`} size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeItem("education", i)}>
                      <Trash2 size={14} strokeWidth={1.5} />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input data-testid={`input-education-school-${i}`} placeholder="School" value={ed.school} onChange={(ev) => updateField("education", i, "school", ev.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input data-testid={`input-education-degree-${i}`} placeholder="Degree" value={ed.degree} onChange={(ev) => updateField("education", i, "degree", ev.target.value)} />
                      <Input data-testid={`input-education-field-${i}`} placeholder="Field" value={ed.field} onChange={(ev) => updateField("education", i, "field", ev.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input data-testid={`input-education-start-${i}`} placeholder="Start" value={ed.startDate} onChange={(ev) => updateField("education", i, "startDate", ev.target.value)} />
                      <Input data-testid={`input-education-end-${i}`} placeholder="End" value={ed.endDate} onChange={(ev) => updateField("education", i, "endDate", ev.target.value)} />
                    </div>
                    <Input data-testid={`input-education-notes-${i}`} placeholder="Notes (optional)" value={ed.notes} onChange={(ev) => updateField("education", i, "notes", ev.target.value)} />
                  </div>
                </div>
              ))}
              <Button
                data-testid="btn-add-education"
                variant="outline"
                className="w-full rounded-sm"
                onClick={() => addItem("education", { school: "", degree: "", field: "", startDate: "", endDate: "", location: "", notes: "" })}
              >
                <Plus size={14} className="mr-1" /> Add education
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SKILLS */}
        <AccordionItem value="skills" className="border border-zinc-200 rounded-sm bg-white">
          <AccordionTrigger data-testid="section-skills-toggle" className="px-4 hover:no-underline">
            <span className="font-heading font-bold">Skills</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {resume.skills.map((s, i) => (
                <span key={i} data-testid={`chip-skill-${i}`} className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[12px] rounded-sm">
                  {s}
                  <button data-testid={`btn-remove-skill-${i}`} onClick={() => update((r) => ({ skills: r.skills.filter((_, j) => j !== i) }))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <Input
              data-testid="input-add-skill"
              placeholder="Type a skill and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const val = e.currentTarget.value.trim();
                  update((r) => ({ skills: [...r.skills, val] }));
                  e.currentTarget.value = "";
                }
              }}
            />
          </AccordionContent>
        </AccordionItem>

        {/* PROJECTS */}
        <AccordionItem value="projects" className="border border-zinc-200 rounded-sm bg-white">
          <AccordionTrigger data-testid="section-projects-toggle" className="px-4 hover:no-underline">
            <span className="font-heading font-bold">Projects</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {resume.projects.map((p, i) => (
                <div key={i} className="border border-zinc-200 p-3 rounded-sm bg-zinc-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500">Item #{i + 1}</span>
                    <Button data-testid={`btn-remove-project-${i}`} size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeItem("projects", i)}>
                      <Trash2 size={14} strokeWidth={1.5} />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input data-testid={`input-project-name-${i}`} placeholder="Project name" value={p.name} onChange={(ev) => updateField("projects", i, "name", ev.target.value)} />
                    <Input data-testid={`input-project-link-${i}`} placeholder="Link" value={p.link} onChange={(ev) => updateField("projects", i, "link", ev.target.value)} />
                    <Textarea data-testid={`input-project-desc-${i}`} rows={2} placeholder="Description" value={p.description} onChange={(ev) => updateField("projects", i, "description", ev.target.value)} />
                  </div>
                </div>
              ))}
              <Button
                data-testid="btn-add-project"
                variant="outline"
                className="w-full rounded-sm"
                onClick={() => addItem("projects", { name: "", link: "", description: "", tech: "" })}
              >
                <Plus size={14} className="mr-1" /> Add project
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* CERTIFICATIONS */}
        <AccordionItem value="certifications" className="border border-zinc-200 rounded-sm bg-white">
          <AccordionTrigger data-testid="section-certifications-toggle" className="px-4 hover:no-underline">
            <span className="font-heading font-bold">Certifications</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {resume.certifications.map((c, i) => (
                <div key={i} className="border border-zinc-200 p-3 rounded-sm bg-zinc-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500">Item #{i + 1}</span>
                    <Button data-testid={`btn-remove-cert-${i}`} size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeItem("certifications", i)}>
                      <Trash2 size={14} strokeWidth={1.5} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input data-testid={`input-cert-name-${i}`} placeholder="Name" value={c.name} onChange={(ev) => updateField("certifications", i, "name", ev.target.value)} />
                    <Input data-testid={`input-cert-issuer-${i}`} placeholder="Issuer" value={c.issuer} onChange={(ev) => updateField("certifications", i, "issuer", ev.target.value)} />
                    <Input data-testid={`input-cert-date-${i}`} placeholder="Date" value={c.date} onChange={(ev) => updateField("certifications", i, "date", ev.target.value)} />
                  </div>
                </div>
              ))}
              <Button
                data-testid="btn-add-cert"
                variant="outline"
                className="w-full rounded-sm"
                onClick={() => addItem("certifications", { name: "", issuer: "", date: "" })}
              >
                <Plus size={14} className="mr-1" /> Add certification
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* LANGUAGES */}
        <AccordionItem value="languages" className="border border-zinc-200 rounded-sm bg-white">
          <AccordionTrigger data-testid="section-languages-toggle" className="px-4 hover:no-underline">
            <span className="font-heading font-bold">Languages</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {resume.languages.map((l, i) => (
                <div key={i} className="border border-zinc-200 p-3 rounded-sm bg-zinc-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500">Item #{i + 1}</span>
                    <Button data-testid={`btn-remove-lang-${i}`} size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeItem("languages", i)}>
                      <Trash2 size={14} strokeWidth={1.5} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input data-testid={`input-lang-name-${i}`} placeholder="Language" value={l.name} onChange={(ev) => updateField("languages", i, "name", ev.target.value)} />
                    <Input data-testid={`input-lang-level-${i}`} placeholder="Level" value={l.level} onChange={(ev) => updateField("languages", i, "level", ev.target.value)} />
                  </div>
                </div>
              ))}
              <Button
                data-testid="btn-add-lang"
                variant="outline"
                className="w-full rounded-sm"
                onClick={() => addItem("languages", { name: "", level: "" })}
              >
                <Plus size={14} className="mr-1" /> Add language
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

