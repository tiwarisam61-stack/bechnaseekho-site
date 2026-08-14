import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  User,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  Languages,
  Wrench,
  BadgeCheck,
  Target,
} from "lucide-react";
import type { AtsProfile } from "@/lib/ats.schema";

function Chips({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">Not detected</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s, i) => (
        <li
          key={`${s}-${i}`}

          className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ParsedProfile({ profile }: { profile: AtsProfile }) {
  const contact = [
    { icon: User, label: "Full name", value: profile.fullName },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: MapPin, label: "Location", value: profile.location },
    { icon: Linkedin, label: "LinkedIn", value: profile.linkedin },
    { icon: Globe, label: "Portfolio", value: profile.portfolio },
    { icon: Github, label: "GitHub", value: profile.github },
    { icon: Target, label: "Job role", value: profile.jobRole },
    { icon: Briefcase, label: "Industry", value: profile.industry },
  ];

  return (
    <section aria-labelledby="parsed-heading" className="surface-card p-6 sm:p-8">
      <header className="mb-6">
        <h2 id="parsed-heading" className="text-xl font-bold text-foreground sm:text-2xl">
          What our AI read from your resume
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything below was extracted automatically. Blank fields simply weren&apos;t found — we
          never invent information.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contact.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-3 transition-colors hover:border-primary/40"
          >
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                {value || <span className="font-normal text-muted-foreground">Not detected</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {profile.summary && (
        <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4">
          <h3 className="mb-2 text-sm font-bold text-foreground">Professional summary</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{profile.summary}</p>
        </div>
      )}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Block icon={BadgeCheck} title="Skills">
          <Chips items={profile.skills} />
        </Block>
        <Block icon={Wrench} title="Technical skills & tools">
          <Chips items={[...profile.technicalSkills, ...profile.tools]} />
        </Block>
        <Block icon={User} title="Soft skills">
          <Chips items={profile.softSkills} />
        </Block>
        <Block icon={Target} title="Detected keywords">
          <Chips items={profile.keywords.slice(0, 30)} />
        </Block>

        <Block icon={Briefcase} title="Experience">
          {profile.experience.length ? (
            <ul className="space-y-3">
              {profile.experience.map((e, i) => (
                <li key={`${e.role}-${i}`} className="border-l-2 border-primary/30 pl-3">
                  <p className="text-sm font-bold text-foreground">{e.role}</p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {[e.company, e.period].filter(Boolean).join(" · ")}
                  </p>
                  {e.highlights.length > 0 && (
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                      {e.highlights.map((h, j) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Not detected</p>
          )}
        </Block>

        <div className="space-y-3">
          <Block icon={GraduationCap} title="Education">
            {profile.education.length ? (
              <ul className="space-y-2">
                {profile.education.map((e, i) => (
                  <li key={i}>
                    <p className="text-sm font-bold text-foreground">{e.degree}</p>
                    <p className="text-xs text-muted-foreground">
                      {[e.institution, e.period].filter(Boolean).join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Not detected</p>
            )}
          </Block>
          <Block icon={FolderKanban} title="Projects">
            {profile.projects.length ? (
              <ul className="space-y-2">
                {profile.projects.map((p, i) => (
                  <li key={i}>
                    <p className="text-sm font-bold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Not detected</p>
            )}
          </Block>
        </div>

        <Block icon={Award} title="Certifications, awards & achievements">
          <Chips
            items={[...profile.certifications, ...profile.awards, ...profile.achievements]}
          />
        </Block>
        <Block icon={Languages} title="Languages">
          <Chips items={profile.languages} />
        </Block>
      </div>
    </section>
  );
}
