import React from "react";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

const Section = ({ title, children }) => (
  <section className="mb-7">
    <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-900 mb-3 pb-1 border-b border-zinc-200">
      {title}
    </h2>
    {children}
  </section>
);

export default function ModernMinimal({ data }) {
  const { personal, experience, education, skills, projects, certifications, languages } = data;
  return (
    <div className="a4-page p-14 font-body text-[13px] text-zinc-800 leading-relaxed">
      <header className="mb-8">
        <h1 className="font-heading text-4xl font-black tracking-tight text-zinc-900">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="text-zinc-600 mt-1 text-sm">{personal.title || "Your Title"}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-zinc-700">
          {personal.email && <span className="inline-flex items-center gap-1.5"><Mail size={12} strokeWidth={1.5} />{personal.email}</span>}
          {personal.phone && <span className="inline-flex items-center gap-1.5"><Phone size={12} strokeWidth={1.5} />{personal.phone}</span>}
          {personal.location && <span className="inline-flex items-center gap-1.5"><MapPin size={12} strokeWidth={1.5} />{personal.location}</span>}
          {personal.website && <span className="inline-flex items-center gap-1.5"><Globe size={12} strokeWidth={1.5} />{personal.website}</span>}
          {personal.linkedin && <span className="inline-flex items-center gap-1.5"><Linkedin size={12} strokeWidth={1.5} />{personal.linkedin}</span>}
        </div>
      </header>

      {personal.summary && (
        <Section title="Summary">
          <p className="text-zinc-700">{personal.summary}</p>
        </Section>
      )}

      {experience?.length > 0 && (
        <Section title="Experience">
          <div className="space-y-4">
            {experience.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="font-semibold text-zinc-900">{e.role}</div>
                    <div className="text-zinc-700">{e.company}{e.location ? ` | ${e.location}` : ""}</div>
                  </div>
                  <div className="text-[12px] text-zinc-500 whitespace-nowrap">{e.startDate} - {e.endDate}</div>
                </div>
                {e.bullets?.length > 0 && (
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-zinc-700">
                    {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education?.length > 0 && (
        <Section title="Education">
          {education.map((ed, i) => (
            <div key={i} className="flex justify-between items-baseline mb-2">
              <div>
                <div className="font-semibold text-zinc-900">{ed.school}</div>
                <div className="text-zinc-700">{ed.degree}{ed.field ? `, ${ed.field}` : ""}{ed.notes ? ` - ${ed.notes}` : ""}</div>
              </div>
              <div className="text-[12px] text-zinc-500">{ed.startDate} - {ed.endDate}</div>
            </div>
          ))}
        </Section>
      )}

      {skills?.length > 0 && (
        <Section title="Skills">
          <p className="text-zinc-700">{skills.join(" | ")}</p>
        </Section>
      )}

      {projects?.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} className="mb-2">
              <div className="font-semibold text-zinc-900">{p.name} {p.link && <span className="text-zinc-500 font-normal">- {p.link}</span>}</div>
              <div className="text-zinc-700">{p.description}</div>
            </div>
          ))}
        </Section>
      )}

      {certifications?.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} className="flex justify-between text-zinc-700">
              <span>{c.name}{c.issuer ? ` - ${c.issuer}` : ""}</span>
              <span className="text-[12px] text-zinc-500">{c.date}</span>
            </div>
          ))}
        </Section>
      )}

      {languages?.length > 0 && (
        <Section title="Languages">
          <p className="text-zinc-700">{languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join(" | ")}</p>
        </Section>
      )}
    </div>
  );
}

