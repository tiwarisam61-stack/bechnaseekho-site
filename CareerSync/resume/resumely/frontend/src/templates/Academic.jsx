import React from "react";

export default function Academic({ data }) {
  const { personal, experience, education, skills, projects, certifications, languages } = data;
  return (
    <div className="a4-page p-14 font-serif-editorial text-[13px] text-zinc-800 leading-relaxed">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-zinc-900">{personal.fullName || "Your Name"}</h1>
        <p className="text-zinc-600 italic mt-1">{personal.title}</p>
        <div className="mt-3 text-[12px] text-zinc-700">
          {[personal.email, personal.phone, personal.location, personal.website, personal.linkedin].filter(Boolean).join(" | ")}
        </div>
      </header>

      {personal.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-2 border-b border-zinc-300 pb-1">Research Statement</h2>
          <p className="text-zinc-700">{personal.summary}</p>
        </section>
      )}

      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-2 border-b border-zinc-300 pb-1">Education</h2>
          {education.map((ed, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <div className="font-semibold text-zinc-900">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</div>
                <div className="text-zinc-600 text-[12px]">{ed.startDate} - {ed.endDate}</div>
              </div>
              <div className="italic text-zinc-700">{ed.school}{ed.location ? `, ${ed.location}` : ""}</div>
              {ed.notes && <div className="text-zinc-700 text-[12.5px]">{ed.notes}</div>}
            </div>
          ))}
        </section>
      )}

      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-2 border-b border-zinc-300 pb-1">Academic & Professional Appointments</h2>
          <div className="space-y-3">
            {experience.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <div><span className="font-semibold text-zinc-900">{e.role}</span>, <span className="italic">{e.company}</span></div>
                  <div className="text-zinc-600 text-[12px]">{e.startDate} - {e.endDate}</div>
                </div>
                {e.bullets?.length > 0 && (
                  <ul className="list-disc ml-6 mt-1 space-y-1 text-zinc-700">
                    {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-2 border-b border-zinc-300 pb-1">Publications & Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-2 text-zinc-700">
              <span className="text-zinc-900">{p.name}.</span> {p.description} {p.link && <span className="italic">- {p.link}</span>}
            </div>
          ))}
        </section>
      )}

      {certifications?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-2 border-b border-zinc-300 pb-1">Awards & Honors</h2>
          {certifications.map((c, i) => (
            <div key={i} className="flex justify-between text-zinc-700">
              <span>{c.name}, <span className="italic">{c.issuer}</span></span>
              <span className="text-[12px] text-zinc-600">{c.date}</span>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {skills?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-2 border-b border-zinc-300 pb-1">Research Skills</h2>
            <p className="text-zinc-700">{skills.join(", ")}</p>
          </section>
        )}
        {languages?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-2 border-b border-zinc-300 pb-1">Languages</h2>
            <p className="text-zinc-700">{languages.map((l) => `${l.name} (${l.level})`).join(", ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}

