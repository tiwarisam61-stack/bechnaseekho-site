import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
function saveAs(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

import type { ResumeDoc, ResumeSection } from "./resume-types";

/** FirstName_LastName_Phone — used for both PDF and DOCX downloads. */
export function resumeFileBase(doc: ResumeDoc) {
  const clean = (v: string) => v.replace(/[^A-Za-z0-9]+/g, "");
  const parts = (doc.profile.fullName || "My Resume").trim().split(/\s+/);
  const first = clean(parts[0] || "Resume") || "Resume";
  const last = clean(parts.slice(1).join("")) || "Candidate";
  const phone = clean(doc.profile.phone || "") || "Resume";
  return [first, last, phone].join("_");
}

const hasBody = (s: ResumeSection) =>
  s.enabled && Boolean(s.text?.trim() || s.tags?.filter(Boolean).length || s.items?.length);

export async function exportDocx(doc: ResumeDoc) {
  const accent = (doc.settings.accent || "#1f3352").replace("#", "").toUpperCase();
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: doc.profile.fullName || "Your Name", bold: true, size: 40 })],
      spacing: { after: 60 },
    }),
  );
  if (doc.profile.headline) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: doc.profile.headline, size: 24, color: accent })],
        spacing: { after: 60 },
      }),
    );
  }
  const contacts = [
    doc.profile.email,
    doc.profile.phone,
    doc.profile.location,
    doc.profile.linkedin,
    doc.profile.github,
    doc.profile.portfolio,
  ]
    .filter(Boolean)
    .join("  |  ");
  if (contacts) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contacts, size: 19 })],
        spacing: { after: 180 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accent, space: 6 } },
      }),
    );
  }

  for (const section of doc.sections.filter(hasBody)) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 220, after: 80 },
        children: [
          new TextRun({
            text: section.label.toUpperCase(),
            bold: true,
            size: 22,
            color: accent,
          }),
        ],
      }),
    );

    if (section.text?.trim()) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: section.text, size: 21 })], spacing: { after: 60 } }),
      );
    }
    if (section.tags?.filter(Boolean).length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: section.tags.filter(Boolean).join("  •  "), size: 21 })],
          spacing: { after: 60 },
        }),
      );
    }
    for (const item of section.items ?? []) {
      children.push(
        new Paragraph({
          spacing: { before: 90 },
          children: [
            new TextRun({ text: item.title, bold: true, size: 22 }),
            item.meta ? new TextRun({ text: `   ${item.meta}`, size: 19, italics: true }) : new TextRun(""),
          ],
        }),
      );
      const sub = [item.subtitle, item.location].filter(Boolean).join(" · ");
      if (sub) {
        children.push(
          new Paragraph({ children: [new TextRun({ text: sub, size: 20, color: accent })] }),
        );
      }
      for (const bullet of item.bullets.filter(Boolean)) {
        children.push(
          new Paragraph({
            numbering: { reference: "cs-bullets", level: 0 },
            children: [new TextRun({ text: bullet, size: 21 })],
          }),
        );
      }
    }
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 320 },
      children: [
        new TextRun({ text: "CareerSync by Bechna Seekho", size: 14, color: "BBBBBB" }),
      ],
    }),
  );

  const document = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 21 } } } },
    numbering: {
      config: [
        {
          reference: "cs-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 460, hanging: 260 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size:
              doc.settings.pageSize === "Letter"
                ? { width: 12240, height: 15840 }
                : { width: 11906, height: 16838 },
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(document);
  saveAs(blob, `${resumeFileBase(doc)}.docx`);
}

/**
 * WYSIWYG PDF: the browser print dialog renders the unscaled #print-root node,
 * so the PDF is a pixel-exact replica of the live preview.
 * The document title drives the suggested filename in Chrome/Edge.
 */
export function exportPdf(doc: ResumeDoc) {
  const previous = document.title;
  document.title = resumeFileBase(doc);

  const source = document.getElementById("print-root");
  let portal: HTMLDivElement | null = null;
  if (source) {
    portal = document.createElement("div");
    portal.id = "print-portal";
    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute("id");
    clone.style.transform = "none";
    clone.style.boxShadow = "none";
    clone.style.margin = "0";
    clone.style.minHeight = "0";
    clone.style.height = "auto";
    clone.style.overflow = "visible";
    portal.appendChild(clone);
    document.body.appendChild(portal);
    document.body.classList.add("printing");
  }

  const restore = () => {
    document.title = previous;
    document.body.classList.remove("printing");
    portal?.remove();
    portal = null;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.print();
  setTimeout(restore, 4000);
}

