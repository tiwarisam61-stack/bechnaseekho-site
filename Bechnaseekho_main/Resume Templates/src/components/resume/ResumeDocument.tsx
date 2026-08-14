import { forwardRef } from "react";
import type { ResumeDoc, ResumeSection } from "@/lib/resume-types";
import { getTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";

const PAGE = {
  A4: { w: 794, h: 1123 },
  Letter: { w: 816, h: 1056 },
};

const fontStack = {
  sans: "'Plus Jakarta Sans', Arial, Helvetica, sans-serif",
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function SectionHeading({
  label,
  accent,
  uppercase,
  rule,
  serif,
}: {
  label: string;
  accent: string;
  uppercase: boolean;
  rule: "line" | "band" | "none";
  serif: boolean;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontFamily: serif ? fontStack.serif : fontStack.sans,
          fontSize: rule === "band" ? "0.72rem" : "0.78rem",
          fontWeight: 700,
          letterSpacing: uppercase ? "0.14em" : "0.01em",
          textTransform: uppercase ? "uppercase" : "none",
          color: rule === "band" ? "#fff" : accent,
          background: rule === "band" ? accent : "transparent",
          padding: rule === "band" ? "4px 10px" : 0,
          borderRadius: rule === "band" ? 3 : 0,
          display: rule === "band" ? "inline-block" : "block",
        }}
      >
        {label}
      </div>
      {rule === "line" && (
        <div style={{ height: 1.5, background: accent, opacity: 0.35, marginTop: 5 }} />
      )}
    </div>
  );
}

function Bullets({ bullets }: { bullets: string[] }) {
  if (!bullets.filter(Boolean).length) return null;
  return (
    <ul style={{ margin: "4px 0 0", paddingLeft: 16, listStyleType: "disc" }}>
      {bullets.filter(Boolean).map((b, i) => (
        <li key={i} style={{ marginBottom: 2 }}>
          {b}
        </li>
      ))}
    </ul>
  );
}

function SectionBody({ section, accent }: { section: ResumeSection; accent: string }) {
  if (section.tags?.length) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 6px" }}>
        {section.tags.filter(Boolean).map((t, i) => (
          <span
            key={i}
            style={{
              border: `1px solid ${accent}44`,
              color: "#22252b",
              borderRadius: 3,
              padding: "2px 7px",
              fontSize: "0.86em",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    );
  }
  if (section.items?.length) {
    return (
      <div style={{ display: "grid", gap: 9 }}>
        {section.items.map((item) => (
          <div key={item.id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <strong style={{ fontWeight: 700 }}>{item.title}</strong>
              {item.meta && (
                <span style={{ whiteSpace: "nowrap", opacity: 0.75, fontSize: "0.9em" }}>
                  {item.meta}
                </span>
              )}
            </div>
            {(item.subtitle || item.location) && (
              <div style={{ color: accent, fontSize: "0.92em" }}>
                {[item.subtitle, item.location].filter(Boolean).join(" · ")}
              </div>
            )}
            <Bullets bullets={item.bullets} />
          </div>
        ))}
      </div>
    );
  }
  if (section.text) return <p style={{ margin: 0 }}>{section.text}</p>;
  return null;
}

const hasBody = (s: ResumeSection) =>
  s.enabled && Boolean(s.text?.trim() || s.tags?.filter(Boolean).length || s.items?.length);

export interface ResumeDocumentProps {
  doc: ResumeDoc;
  /** rendering scale, 1 = 100% */
  scale?: number;
  watermark?: boolean;
  /** marks this node as the printable root (only one per page) */
  printRoot?: boolean;
  className?: string;
}

export const ResumeDocument = forwardRef<HTMLDivElement, ResumeDocumentProps>(
  function ResumeDocument({ doc, scale = 1, watermark = true, printRoot = false, className }, ref) {
    const tpl = getTemplate(doc.settings.templateId);
    const accent = doc.settings.accent || tpl.accent;
    const page = PAGE[doc.settings.pageSize];
    const s = doc.settings;
    const base = 10.6 * s.fontScale;

    const visible = doc.sections.filter(hasBody);
    const sidebarKinds = ["technicalSkills", "softSkills", "skills", "languages", "certifications", "interests"];
    const usesSidebar = tpl.layout === "sidebar-left" || tpl.layout === "sidebar-right";
    const sideSections = usesSidebar ? visible.filter((v) => sidebarKinds.includes(v.kind)) : [];
    const mainSections = usesSidebar ? visible.filter((v) => !sidebarKinds.includes(v.kind)) : visible;

    const heading = (section: ResumeSection) => (
      <SectionHeading
        label={section.label}
        accent={accent}
        uppercase={tpl.uppercaseHeadings}
        rule={tpl.rule}
        serif={tpl.headingFont === "serif"}
      />
    );

    const contacts = [
      doc.profile.email,
      doc.profile.phone,
      doc.profile.location,
      doc.profile.linkedin,
      doc.profile.github,
      doc.profile.portfolio,
    ].filter(Boolean);

    const header =
      tpl.layout === "header-band" ? (
        <div
          style={{
            background: accent,
            color: "#fff",
            margin: `-${s.margin}px -${s.margin}px ${s.margin * 0.5}px`,
            padding: `${s.margin * 0.62}px ${s.margin}px`,
          }}
        >
          <div
            style={{
              fontFamily: tpl.headingFont === "serif" ? fontStack.serif : fontStack.sans,
              fontSize: "2.05em",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {doc.profile.fullName || "Your Name"}
          </div>
          <div style={{ opacity: 0.9, marginTop: 2 }}>{doc.profile.headline}</div>
          <div style={{ opacity: 0.85, marginTop: 6, fontSize: "0.9em" }}>
            {contacts.join("  ·  ")}
          </div>
        </div>
      ) : (
        <div
          style={{
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderBottom: tpl.rule === "none" ? "none" : `2px solid ${accent}`,
            paddingBottom: 10,
          }}
        >
          {s.showPhoto && doc.profile.photo && (
            <img
              src={doc.profile.photo}
              alt=""
              style={{ width: 62, height: 62, borderRadius: 999, objectFit: "cover" }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: tpl.headingFont === "serif" ? fontStack.serif : fontStack.sans,
                fontSize: "2.05em",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#14161b",
              }}
            >
              {doc.profile.fullName || "Your Name"}
            </div>
            {doc.profile.headline && (
              <div style={{ color: accent, fontWeight: 600, marginTop: 2 }}>
                {doc.profile.headline}
              </div>
            )}
            <div style={{ marginTop: 5, fontSize: "0.9em", opacity: 0.8 }}>
              {contacts.join("  ·  ")}
            </div>
          </div>
        </div>
      );

    const renderList = (list: ResumeSection[], timeline = false) => (
      <div style={{ display: "grid", gap: 14 }}>
        {list.map((section) => (
          <section key={section.id} style={timeline ? { borderLeft: `2px solid ${accent}33`, paddingLeft: 12 } : undefined}>
            {heading(section)}
            <SectionBody section={section} accent={accent} />
          </section>
        ))}
      </div>
    );

    const body =
      usesSidebar && sideSections.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: tpl.layout === "sidebar-left" ? "31% 1fr" : "1fr 31%",
            gap: 20,
          }}
        >
          {tpl.layout === "sidebar-left" && <aside>{renderList(sideSections)}</aside>}
          <div>{renderList(mainSections)}</div>
          {tpl.layout === "sidebar-right" && <aside>{renderList(sideSections)}</aside>}
        </div>
      ) : tpl.layout === "two-column" ? (
        <div style={{ columnCount: 1 }}>{renderList(visible)}</div>
      ) : (
        renderList(visible, tpl.layout === "timeline")
      );

    return (
      <div
        ref={ref}
        id={printRoot ? "print-root" : undefined}
        className={cn("resume-page resume-paper", className)}
        style={{
          width: page.w,
          minHeight: page.h,
          padding: s.margin,
          fontFamily: fontStack[s.fontFamily],
          fontSize: base,
          lineHeight: s.lineSpacing,
          color: "#16181d",
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: "top center",
          boxShadow: "var(--shadow-page)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {watermark && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%) rotate(180deg)",
              writingMode: "vertical-rl",
              opacity: 0.07,
              color: "#0f172a",
              zIndex: 0,
              pointerEvents: "none",
              fontFamily: fontStack.sans,
              letterSpacing: "0.32em",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700 }}>CareerSync</div>
            <div style={{ fontSize: 8 }}>by Bechna Seekho</div>
          </div>
        )}
        <div style={{ position: "relative", zIndex: 1 }}>
          {header}
          {body}
        </div>
      </div>
    );
  },
);

export const PAGE_SIZES = PAGE;
