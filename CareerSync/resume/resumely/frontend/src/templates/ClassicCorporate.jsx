import React from "react";

export default function ClassicCorporate({ data }) {
  const { personal, experience, education, skills, projects, certifications, languages } = data;
  return (
    <div className="a4-page p-14 font-body text-[13px] text-zinc-800 leading-relaxed">
      <header className="text-center mb-6 pb-5 border-b-2 border-zinc-900">
        <h1 className="font-heading text-3xl font-bold tracking-wide text-zinc-900 uppercase">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="text-zinc-600 uppercase tracking-[0.2em] text-[11px] mt-1">{personal.title}</p>
        <div className="mt-3 text-[12px] text-zinc-700 flex justify-center flex-wrap gap-x-3 gap-y-1">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>| {personal.phone}</span>}
          {personal.location && <span>| {personal.location}</span>}
          {personal.website && <span>| {personal.website}</span>}
          {personal.linkedin && <span>| {personal.linkedin}</span>}
        </div>
      </header>

      {personal.summary && (
        <section className="mb-5">
          <h2 className="uppercase font-bold text-zinc-900 border-b border-zinc-300 mb-2 pb-1 text-[13px] tracking-wider">Professional Summary</h2>
          <p className="text-zinc-700">{personal.summary}</p>
        </section>
      )}

      {experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="uppercase font-bold text-zinc-900 border-b border-zinc-300 mb-2 pb-1 text-[13px] tracking-wider">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <div className="font-bold text-zinc-900">{e.company}</div>
                  <div className="text-zinc-600 text-[12px]">{e.startDate} - {e.endDate}</div>
                </div>
                <div className="italic text-zinc-700">{e.role}{e.location ? `, ${e.location}` : ""}</div>
                {e.bullets?.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 space-y-1 text-zinc-700">
                    {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education?.length > 0 && (
        <section className="mb-5">
          <h2 className="uppercase font-bold text-zinc-900 border-b border-zinc-300 mb-2 pb-1 text-[13px] tracking-wider">Education</h2>
          {education.map((ed, i) => (
            <div key={i} className="mb-1">
              <div className="flex justify-between">
                <div className="font-bold text-zinc-900">{ed.school}</div>
                <div className="text-zinc-600 text-[12px]">{ed.startDate} - {ed.endDate}</div>
              </div>
              <div className="italic text-zinc-700">{ed.degree}{ed.field ? `, ${ed.field}` : ""}{ed.location ? `, ${ed.location}` : ""}</div>
              {ed.notes && <div className="text-zinc-700 text-[12.5px]">{ed.notes}</div>}
            </div>
          ))}
        </section>
      )}

      {skills?.length > 0 && (
        <section className="mb-5">
          <h2 className="uppercase font-bold text-zinc-900 border-b border-zinc-300 mb-2 pb-1 text-[13px] tracking-wider">Skills</h2>
          <p className="text-zinc-700">{skills.join(" | ")}</p>
        </section>
      )}

      {projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="uppercase font-bold text-zinc-900 border-b border-zinc-300 mb-2 pb-1 text-[13px] tracking-wider">Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-1">
              <div className="font-bold text-zinc-900">{p.name}</div>
              <div className="text-zinc-700">{p.description}</div>
            </div>
          ))}
        </section>
      )}

      {certifications?.length > 0 && (
        <section className="mb-5">
          <h2 className="uppercase font-bold text-zinc-900 border-b border-zinc-300 mb-2 pb-1 text-[13px] tracking-wider">Certifications</h2>
          {certifications.map((c, i) => (
            <div key={i} className="text-zinc-700">{c.name}, {c.issuer} ({c.date})</div>
          ))}
        </section>
      )}

      {languages?.length > 0 && (
        <section>
          <h2 className="uppercase font-bold text-zinc-900 border-b border-zinc-300 mb-2 pb-1 text-[13px] tracking-wider">Languages</h2>
          <p className="text-zinc-700">{languages.map((l) => `${l.name} (${l.level})`).join(" | ")}</p>
        </section>
      )}
    </div>
  );
}

