import React from "react";

export default function TechCompact({ data }) {
  const { personal, experience, education, skills, projects, certifications, languages } = data;
  return (
    <div className="a4-page p-10 font-mono-body text-[12px] text-zinc-800 leading-snug">
      <header className="mb-5 pb-3 border-b border-dashed border-zinc-400">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-space-mono text-2xl font-bold text-zinc-900">// {personal.fullName || "your_name"}</h1>
            <div className="text-[11px] text-zinc-600 mt-1">{personal.title}</div>
          </div>
          <div className="text-right text-[10.5px] text-zinc-600 space-y-0.5">
            {personal.email && <div>{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.location && <div>{personal.location}</div>}
            {personal.website && <div>{personal.website}</div>}
            {personal.linkedin && <div>{personal.linkedin}</div>}
          </div>
        </div>
      </header>

      {personal.summary && (
        <section className="mb-4">
          <h2 className="font-space-mono text-[11px] text-emerald-700 mb-1">$ whoami</h2>
          <p className="text-zinc-700">{personal.summary}</p>
        </section>
      )}

      {skills?.length > 0 && (
        <section className="mb-4">
          <h2 className="font-space-mono text-[11px] text-emerald-700 mb-1">$ ls skills/</h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((s, i) => (
              <span key={i} className="bg-zinc-100 border border-zinc-300 px-1.5 py-0.5 text-[11px]">{s}</span>
            ))}
          </div>
        </section>
      )}

      {experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="font-space-mono text-[11px] text-emerald-700 mb-2">$ cat experience.log</h2>
          <div className="space-y-3">
            {experience.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <div className="text-zinc-900 font-bold">{e.role} @ {e.company}</div>
                  <div className="text-zinc-500 text-[11px]">[{e.startDate}{" -> "}{e.endDate}]</div>
                </div>
                {e.location && <div className="text-zinc-500 text-[11px]">// {e.location}</div>}
                {e.bullets?.length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-zinc-700">
                    {e.bullets.map((b, j) => <li key={j}>{"> "}{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="font-space-mono text-[11px] text-emerald-700 mb-2">$ ls projects/</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-1">
              <span className="font-bold text-zinc-900">{p.name}</span>
              {p.link && <span className="text-zinc-500"> ({p.link})</span>}
              <div className="text-zinc-700">{p.description}</div>
            </div>
          ))}
        </section>
      )}

      {education?.length > 0 && (
        <section className="mb-4">
          <h2 className="font-space-mono text-[11px] text-emerald-700 mb-2">$ cat education</h2>
          {education.map((ed, i) => (
            <div key={i} className="flex justify-between">
              <span><span className="font-bold text-zinc-900">{ed.school}</span> - {ed.degree}{ed.field ? `, ${ed.field}` : ""}</span>
              <span className="text-zinc-500 text-[11px]">[{ed.startDate}{" -> "}{ed.endDate}]</span>
            </div>
          ))}
        </section>
      )}

      {(certifications?.length > 0 || languages?.length > 0) && (
        <section className="grid grid-cols-2 gap-4">
          {certifications?.length > 0 && (
            <div>
              <h2 className="font-space-mono text-[11px] text-emerald-700 mb-1">$ certs</h2>
              {certifications.map((c, i) => <div key={i} className="text-zinc-700">- {c.name} ({c.date})</div>)}
            </div>
          )}
          {languages?.length > 0 && (
            <div>
              <h2 className="font-space-mono text-[11px] text-emerald-700 mb-1">$ locale</h2>
              {languages.map((l, i) => <div key={i} className="text-zinc-700">- {l.name}: {l.level}</div>)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

