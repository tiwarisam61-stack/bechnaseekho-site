import React from "react";

export default function Timeline({ data }) {
  const { personal, experience, education, skills, projects, certifications, languages } = data;
  return (
    <div className="a4-page p-12 font-body text-[13px] text-zinc-800 leading-relaxed">
      <header className="mb-8 pb-6 border-b-2 border-zinc-900">
        <h1 className="font-heading text-5xl font-black tracking-tighter text-zinc-900">{personal.fullName || "Your Name"}</h1>
        <p className="text-zinc-600 mt-1">{personal.title}</p>
        <div className="mt-4 text-[12px] text-zinc-700 flex flex-wrap gap-x-4 gap-y-1">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>| {personal.phone}</span>}
          {personal.location && <span>| {personal.location}</span>}
          {personal.website && <span>| {personal.website}</span>}
          {personal.linkedin && <span>| {personal.linkedin}</span>}
        </div>
      </header>

      {personal.summary && (
        <section className="mb-8">
          <p className="text-zinc-700 italic">{personal.summary}</p>
        </section>
      )}

      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="overline mb-6">Experience</h2>
          <div className="relative pl-8">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-300" />
            {experience.map((e, i) => (
              <div key={i} className="relative mb-6 last:mb-0">
                <div className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-zinc-900 ring-4 ring-white" />
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
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {education?.length > 0 && (
          <section>
            <h2 className="overline mb-3">Education</h2>
            {education.map((ed, i) => (
              <div key={i} className="mb-2">
                <div className="font-semibold text-zinc-900">{ed.school}</div>
                <div className="text-zinc-700">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</div>
                <div className="text-[12px] text-zinc-500">{ed.startDate} - {ed.endDate}</div>
              </div>
            ))}
          </section>
        )}
        {skills?.length > 0 && (
          <section>
            <h2 className="overline mb-3">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} className="border border-zinc-300 px-2 py-0.5 text-[11.5px] text-zinc-700">{s}</span>
              ))}
            </div>
          </section>
        )}
      </div>

      {projects?.length > 0 && (
        <section className="mt-6">
          <h2 className="overline mb-3">Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-2">
              <div className="font-semibold text-zinc-900">{p.name}</div>
              <div className="text-zinc-700">{p.description}</div>
            </div>
          ))}
        </section>
      )}

      {(certifications?.length > 0 || languages?.length > 0) && (
        <section className="mt-6 grid grid-cols-2 gap-8">
          {certifications?.length > 0 && (
            <div>
              <h2 className="overline mb-3">Certifications</h2>
              {certifications.map((c, i) => (
                <div key={i} className="text-zinc-700 text-[12.5px]">{c.name} - <span className="text-zinc-500">{c.issuer}, {c.date}</span></div>
              ))}
            </div>
          )}
          {languages?.length > 0 && (
            <div>
              <h2 className="overline mb-3">Languages</h2>
              <div className="text-zinc-700 text-[12.5px]">{languages.map((l) => `${l.name} (${l.level})`).join(" | ")}</div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

