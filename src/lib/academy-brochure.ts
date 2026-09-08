import type { Course } from "./academy-courses";
import { courseMeta } from "./academy-course-meta";

/** Helvetica has no rupee glyph, so PDFs use the Rs. form. */
const inr = (n: number) => (n === 0 ? "Free" : `Rs. ${n.toLocaleString("en-IN")}`);

type Doc = import("jspdf").jsPDF;

const NAVY: [number, number, number] = [15, 23, 42];
const BLUE: [number, number, number] = [30, 58, 138];
const ACCENT: [number, number, number] = [37, 99, 235];
const GOLD: [number, number, number] = [251, 191, 36];
const GREEN: [number, number, number] = [16, 185, 129];
const SLATE: [number, number, number] = [100, 116, 139];
const LIGHT: [number, number, number] = [248, 250, 252];

const W = 210;
const H = 297;
const M = 16;

function gradientBand(doc: Doc, y: number, h: number) {
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = NAVY[0] + (ACCENT[0] - NAVY[0]) * t;
    const g = NAVY[1] + (ACCENT[1] - NAVY[1]) * t;
    const b = NAVY[2] + (ACCENT[2] - NAVY[2]) * t;
    doc.setFillColor(r, g, b);
    doc.rect(0, y + (h / steps) * i, W, h / steps + 0.4, "F");
  }
}

function heading(doc: Doc, text: string, y: number) {
  doc.setFillColor(...ACCENT);
  doc.rect(M, y - 4.2, 3, 6, "F");
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(text, M + 6, y);
  return y + 8;
}

function body(doc: Doc, text: string, y: number, size = 10) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(...SLATE);
  const lines = doc.splitTextToSize(text, W - M * 2);
  doc.text(lines, M, y);
  return y + lines.length * (size * 0.5) + 4;
}

function pageFooter(doc: Doc, page: number, title: string) {
  doc.setDrawColor(226, 232, 240);
  doc.line(M, H - 16, W - M, H - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  doc.text(`CareerSync by BechnaSeekho  â€¢  ${title}`, M, H - 11);
  doc.text(`Page ${page}`, W - M, H - 11, { align: "right" });
}

function progressBar(doc: Doc, x: number, y: number, w: number, pct: number) {
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(x, y, w, 3.4, 1.7, 1.7, "F");
  doc.setFillColor(...ACCENT);
  doc.roundedRect(x, y, (w * pct) / 100, 3.4, 1.7, 1.7, "F");
}

export type BrochureKind =
  | "course"
  | "catalog"
  | "company"
  | "placement"
  | "calendar"
  | "pricing";

export async function generatePdf(kind: BrochureKind, courses: Course[], course?: Course) {
  const [{ jsPDF }, QR] = await Promise.all([import("jspdf"), import("qrcode")]);
  const doc = new jsPDF({ unit: "mm", format: "a4" }) as Doc;

  const titles: Record<BrochureKind, string> = {
    course: course ? `${course.title} â€” Syllabus` : "Course Syllabus",
    catalog: "Course Catalog 2026",
    company: "Company Profile",
    placement: "Placement Report",
    calendar: "Training Calendar",
    pricing: "Pricing Guide",
  };
  const title = titles[kind];

  /* ---------------- Cover ---------------- */
  gradientBand(doc, 0, 150);
  doc.setFillColor(...LIGHT);
  doc.rect(0, 150, W, H - 150, "F");

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(M, 24, 13, 13, 3.5, 3.5, "F");
  doc.setTextColor(...BLUE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("CS", M + 6.5, 32.5, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text("CareerSync", M + 18, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text("BY BECHNASEEKHO", M + 18, 35);

  doc.setFillColor(...GOLD);
  doc.roundedRect(M, 60, 44, 8, 4, 4, "F");
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PREMIUM PROGRAMME", M + 22, 65.3, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  const coverLines = doc.splitTextToSize(title, W - M * 2 - 10);
  doc.text(coverLines, M, 84);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(219, 234, 254);
  doc.text(
    doc.splitTextToSize(
      course
        ? course.tagline
        : "Build job-ready skills. Get hired faster. Practical training, live projects, interview preparation and certification designed by industry experts.",
      W - M * 2 - 20,
    ),
    M,
    84 + coverLines.length * 11,
  );

  const coverStats: [string, string][] = [
    ["10,000+", "Students"],
    ["500+", "Hiring Partners"],
    ["95%", "Placement Support"],
    ["4.9", "Rating"],
  ];
  coverStats.forEach(([v, l], i) => {
    const x = M + i * 45;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, 118, 41, 20, 3, 3, "F");
    doc.setTextColor(...BLUE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(v, x + 20.5, 127, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text(l.toUpperCase(), x + 20.5, 132.5, { align: "center" });
  });

  const qr = await QR.toDataURL("https://careersync.bechnaseekho.com", {
    margin: 0,
    width: 240,
    color: { dark: "#0F172A", light: "#FFFFFF" },
  });
  doc.addImage(qr, "PNG", W - M - 28, 168, 28, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE);
  doc.text("Scan to enroll", W - M - 14, 200, { align: "center" });

  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Table of Contents", M, 172);
  const toc = course
    ? [
        "Course Overview",
        "Curriculum & Modules",
        "Skills & Learning Outcomes",
        "Instructor & Projects",
        "Certification & Placement",
        "Pricing & Contact",
      ]
    : [
        "About CareerSync",
        "Programme Portfolio",
        "Learning Roadmap",
        "Placement Performance",
        "Hiring Partners",
        "Pricing & Contact",
      ];
  toc.forEach((t, i) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...SLATE);
    doc.text(`${String(i + 1).padStart(2, "0")}   ${t}`, M, 181 + i * 6.5);
  });

  doc.setFillColor(...NAVY);
  doc.rect(0, H - 22, W, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text("careersync.bechnaseekho.com  â€¢  hello@bechnaseekho.com  â€¢  +91 90000 00000", M, H - 9);

  /* ---------------- Content page ---------------- */
  doc.addPage();
  let y = 24;
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CAREERSYNC  â€¢  " + title.toUpperCase(), M, 7.8);

  if (course) {
    const meta = courseMeta(course);
    y = heading(doc, "Course Overview", y);
    y = body(doc, course.description, y);

    const facts: [string, string][] = [
      ["Level", course.level],
      ["Duration", course.duration],
      ["Language", meta.language],
      ["Projects", `${meta.projects} live projects`],
      ["Rating", `${course.rating} / 5`],
      ["Students", course.students.toLocaleString("en-IN")],
    ];
    facts.forEach(([k, v], i) => {
      const x = M + (i % 3) * ((W - M * 2) / 3);
      const yy = y + Math.floor(i / 3) * 16;
      doc.setFillColor(...LIGHT);
      doc.roundedRect(x, yy, (W - M * 2) / 3 - 4, 13, 2.5, 2.5, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...SLATE);
      doc.text(k.toUpperCase(), x + 4, yy + 5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(v, x + 4, yy + 10.5);
    });
    y += 38;

    y = heading(doc, "Curriculum & Modules", y);
    doc.setFillColor(...NAVY);
    doc.rect(M, y - 5, W - M * 2, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("MODULE", M + 3, y);
    doc.text("FOCUS", M + 62, y);
    doc.text("DEPTH", W - M - 30, y);
    y += 8;
    course.chapters.forEach((ch, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(...LIGHT);
        doc.rect(M, y - 5, W - M * 2, 11, "F");
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...NAVY);
      doc.text(doc.splitTextToSize(`${i + 1}. ${ch.title}`, 55)[0] ?? "", M + 3, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SLATE);
      doc.text(doc.splitTextToSize(ch.focus, 72)[0] ?? "", M + 62, y);
      progressBar(doc, W - M - 30, y - 2.4, 27, 70 + i * 6);
      y += 11;
    });
    y += 6;

    y = heading(doc, "Skills & Learning Outcomes", y);
    course.objectives.forEach((o) => {
      doc.setFillColor(...GREEN);
      doc.circle(M + 1.6, y - 1.4, 1.4, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...SLATE);
      doc.text(doc.splitTextToSize(o, W - M * 2 - 10), M + 6, y);
      y += 6.5;
    });
  } else {
    y = heading(doc, "About CareerSync", y);
    y = body(
      doc,
      "CareerSync by BechnaSeekho is a premium career acceleration platform. We combine structured curriculum, live mentorship, real projects, mock interviews and dedicated placement assistance so learners move from skill gap to signed offer letter.",
      y,
    );
    y = heading(doc, "Programme Portfolio", y);
    doc.setFillColor(...NAVY);
    doc.rect(M, y - 5, W - M * 2, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("PROGRAMME", M + 3, y);
    doc.text("CATEGORY", M + 80, y);
    doc.text("LEVEL", M + 118, y);
    doc.text("FEE", W - M - 22, y);
    y += 8;
    courses.forEach((c, i) => {
      const meta = courseMeta(c);
      if (i % 2 === 0) {
        doc.setFillColor(...LIGHT);
        doc.rect(M, y - 5, W - M * 2, 9, "F");
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...NAVY);
      doc.text(doc.splitTextToSize(c.title, 74)[0] ?? "", M + 3, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SLATE);
      doc.text(c.category, M + 80, y);
      doc.text(c.level, M + 118, y);
      doc.setTextColor(...BLUE);
      doc.setFont("helvetica", "bold");
      doc.text(inr(meta.price), W - M - 3, y, { align: "right" });
      y += 9;
    });
    y += 6;
    y = heading(doc, "Placement Performance", y);
    const stats: [string, string][] = [
      ["Students Placed", "8,400+"],
      ["Hiring Partners", "500+"],
      ["Average Package", "Rs. 6.8 LPA"],
      ["Highest Package", "Rs. 24 LPA"],
    ];
    stats.forEach(([k, v], i) => {
      const x = M + i * ((W - M * 2) / 4);
      doc.setFillColor(...LIGHT);
      doc.roundedRect(x, y, (W - M * 2) / 4 - 4, 18, 2.5, 2.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...BLUE);
      doc.text(v, x + 4, y + 9);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...SLATE);
      doc.text(k.toUpperCase(), x + 4, y + 14.5);
    });
    y += 26;
  }

  /* Placement + pricing block (both variants) */
  if (y > 210) {
    pageFooter(doc, 2, title);
    doc.addPage();
    y = 24;
  }
  y += 4;
  y = heading(doc, "Certification & Placement Support", y);
  const support = [
    "Industry-recognised certificate issued at 100% completion",
    "Dedicated placement cell with 500+ hiring partners",
    "Resume building, LinkedIn optimisation and portfolio review",
    "Unlimited mock interviews with senior industry mentors",
    "Lifetime access to recordings, notes and future updates",
  ];
  support.forEach((s) => {
    doc.setFillColor(...GOLD);
    doc.circle(M + 1.6, y - 1.4, 1.4, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...SLATE);
    doc.text(s, M + 6, y);
    y += 6.5;
  });
  y += 4;

  if (y > H - 80) {
    pageFooter(doc, doc.getNumberOfPages(), title);
    doc.addPage();
    y = 24;
  }
  y = heading(doc, "Pricing & Contact", y);
  const meta = course ? courseMeta(course) : courseMeta(courses[0]!);
  doc.setFillColor(...NAVY);
  doc.roundedRect(M, y, W - M * 2, 34, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(inr(meta.price), M + 8, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `${inr(meta.originalPrice)} original  â€¢  ${meta.discount}% off  â€¢  EMI from ${inr(meta.emi)}/month`,
    M + 8,
    y + 23,
  );
  doc.setFillColor(...GOLD);
  doc.roundedRect(W - M - 52, y + 10, 44, 12, 6, 6, "F");
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("ENROLL NOW", W - M - 30, y + 17.5, { align: "center" });
  y += 42;

  if (y > H - 30) {
    pageFooter(doc, doc.getNumberOfPages(), title);
    doc.addPage();
    y = 24;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  doc.text(
    "hello@bechnaseekho.com   â€¢   +91 90000 00000   â€¢   careersync.bechnaseekho.com",
    M,
    y,
  );

  pageFooter(doc, doc.getNumberOfPages(), title);
  doc.save(`careersync-${kind}${course ? `-${course.id}` : ""}.pdf`);
}

