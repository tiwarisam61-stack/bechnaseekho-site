import type { AtsAnalysis, AtsOptimization } from "./ats.schema";
import { scoreRating } from "./ats.schema";

/** Premium 2-page executive ATS report (browser only). Layout-designed, not a page export. */

const BRAND = "CareerSync";
const BRAND_SUB = "by BechnaSeekho";
const SITE = "https://careersync.in";
const EMAIL = "support@careersync.in";
const VERSION = "v3.0";
const YEAR = new Date().getFullYear();

type RGB = [number, number, number];

const NAVY: RGB = [15, 23, 42];
const SLATE: RGB = [71, 85, 105];
const MUTED: RGB = [100, 116, 139];
const BLUE: RGB = [26, 115, 232];
const BLUE_DEEP: RGB = [21, 74, 189];
const BLUE_SOFT: RGB = [232, 240, 254];
const BORDER: RGB = [226, 232, 240];
const TRACK: RGB = [237, 242, 249];
const GREEN: RGB = [22, 163, 74];
const GREEN_SOFT: RGB = [220, 252, 231];
const AMBER: RGB = [217, 119, 6];
const AMBER_SOFT: RGB = [254, 243, 199];
const ORANGE: RGB = [234, 88, 12];
const RED: RGB = [220, 38, 38];
const RED_SOFT: RGB = [254, 226, 226];
const WHITE: RGB = [255, 255, 255];

type Doc = import("jspdf").jsPDF;

const PW = 595.28;
const PH = 841.89;
const M = 40;
const CW = PW - M * 2;

/* ---------------------------------------------------------------- primitives */

function gradientBand(doc: Doc, x: number, y: number, w: number, h: number, from: RGB, to: RGB, radius = 0) {
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    doc.setFillColor(
      Math.round(from[0] + (to[0] - from[0]) * t),
      Math.round(from[1] + (to[1] - from[1]) * t),
      Math.round(from[2] + (to[2] - from[2]) * t),
    );
    doc.rect(x + (w / steps) * i, y, w / steps + 0.8, h, "F");
  }
  if (radius > 0) {
    // mask the corners back to white for a rounded feel
    doc.setFillColor(...WHITE);
    doc.rect(x, y, radius, radius, "F");
    doc.rect(x + w - radius, y, radius, radius, "F");
    doc.setFillColor(...from);
    doc.circle(x + radius, y + radius, radius, "F");
    doc.setFillColor(...to);
    doc.circle(x + w - radius, y + radius, radius, "F");
  }
}

/** Soft glassmorphism card. */
function card(doc: Doc, x: number, y: number, w: number, h: number, r = 12, fill: RGB = WHITE, stroke: RGB | null = BORDER) {
  doc.setFillColor(240, 244, 250);
  doc.roundedRect(x + 1.4, y + 2.2, w, h, r, r, "F");
  doc.setFillColor(...fill);
  if (stroke) {
    doc.setDrawColor(...stroke);
    doc.setLineWidth(0.7);
    doc.roundedRect(x, y, w, h, r, r, "FD");
  } else {
    doc.roundedRect(x, y, w, h, r, r, "F");
  }
}

function logo(doc: Doc, x: number, y: number, size = 24, onDark = true) {
  doc.setFillColor(...(onDark ? WHITE : BLUE));
  doc.roundedRect(x, y, size, size, size * 0.28, size * 0.28, "F");
  doc.setFillColor(...(onDark ? BLUE : WHITE));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(size * 0.62);
  doc.text("C", x + size * 0.27, y + size * 0.72);
  doc.setFillColor(255, 138, 0);
  doc.circle(x + size * 0.82, y + size * 0.2, size * 0.13, "F");
}

function text(
  doc: Doc,
  str: string,
  x: number,
  y: number,
  o: { size?: number; bold?: boolean; color?: RGB; align?: "left" | "center" | "right"; maxWidth?: number } = {},
) {
  doc.setFont("helvetica", o.bold ? "bold" : "normal");
  doc.setFontSize(o.size ?? 9.5);
  doc.setTextColor(...(o.color ?? SLATE));
  doc.text(str, x, y, { align: o.align ?? "left", maxWidth: o.maxWidth });
}

/** Wrapped, line-clamped paragraph. Returns the y after the block. */
function paragraph(
  doc: Doc,
  str: string,
  x: number,
  y: number,
  width: number,
  o: { size?: number; bold?: boolean; color?: RGB; lh?: number; maxLines?: number } = {},
) {
  const size = o.size ?? 9.3;
  const lh = o.lh ?? size * 1.42;
  doc.setFont("helvetica", o.bold ? "bold" : "normal");
  doc.setFontSize(size);
  doc.setTextColor(...(o.color ?? SLATE));
  let lines = doc.splitTextToSize(str ?? "", width) as string[];
  if (o.maxLines && lines.length > o.maxLines) {
    lines = lines.slice(0, o.maxLines);
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[\s,.;:]+$/, "")}…`;
  }
  lines.forEach((l, i) => doc.text(l, x, y + i * lh));
  return y + lines.length * lh;
}

function scoreColor(score: number): RGB {
  if (score >= 85) return GREEN;
  if (score >= 70) return BLUE;
  if (score >= 55) return AMBER;
  return RED;
}

function scoreSoft(score: number): RGB {
  if (score >= 85) return GREEN_SOFT;
  if (score >= 70) return BLUE_SOFT;
  if (score >= 55) return AMBER_SOFT;
  return RED_SOFT;
}

function statusLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 55) return "Needs work";
  return "Critical";
}

function pill(doc: Doc, label: string, x: number, y: number, fill: RGB, color: RGB, size = 7.6, h = 15) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(size);
  const w = doc.getTextWidth(label) + 16;
  doc.setFillColor(...fill);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, "F");
  doc.setTextColor(...color);
  doc.text(label, x + 8, y + h / 2 + size * 0.35);
  return w;
}

function progress(doc: Doc, x: number, y: number, w: number, score: number, h = 5) {
  doc.setFillColor(...TRACK);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, "F");
  doc.setFillColor(...scoreColor(score));
  doc.roundedRect(x, y, Math.max(h, (w * Math.min(100, Math.max(0, score))) / 100), h, h / 2, h / 2, "F");
}

/** Circular score ring with big centred value. */
function gauge(doc: Doc, cx: number, cy: number, r: number, score: number, caption?: string) {
  const seg = 120;
  const stroke = r * 0.2;
  doc.setLineCap("round");
  doc.setLineWidth(stroke);
  doc.setDrawColor(...TRACK);
  for (let i = 0; i < seg; i++) {
    const a1 = (i / seg) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / seg) * Math.PI * 2 - Math.PI / 2;
    doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
  }
  const filled = Math.round((Math.min(100, Math.max(0, score)) / 100) * seg);
  doc.setDrawColor(...scoreColor(score));
  for (let i = 0; i < filled; i++) {
    const a1 = (i / seg) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / seg) * Math.PI * 2 - Math.PI / 2;
    doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
  }
  doc.setLineWidth(0.7);
  doc.setLineCap("butt");
  text(doc, `${Math.round(score)}`, cx, cy + r * 0.16, { size: r * 0.78, bold: true, color: NAVY, align: "center" });
  text(doc, "/ 100", cx, cy + r * 0.5, { size: r * 0.24, bold: true, color: MUTED, align: "center" });
  if (caption) text(doc, caption, cx, cy + r * 0.78, { size: r * 0.2, bold: true, color: MUTED, align: "center" });
}

function footer(doc: Doc, page: number, total: number, when: string) {
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.7);
  doc.line(M, PH - 52, PW - M, PH - 52);
  text(doc, `Generated by ${BRAND} ${BRAND_SUB}`, M, PH - 38, { size: 7.8, bold: true, color: NAVY });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  doc.setTextColor(...BLUE);
  doc.textWithLink("careersync.in", M, PH - 27, { url: SITE });
  const linkW = doc.getTextWidth("careersync.in");
  doc.setTextColor(...MUTED);
  doc.text("  ·  ", M + linkW, PH - 27);
  doc.setTextColor(...BLUE);
  doc.textWithLink(EMAIL, M + linkW + 14, PH - 27, { url: `mailto:${EMAIL}` });
  text(doc, `${when}  ·  ${VERSION}`, PW - M, PH - 38, { size: 7.6, color: MUTED, align: "right" });
  text(doc, `Page ${page} of ${total}  ·  © ${YEAR} ${BRAND}`, PW - M, PH - 27, {
    size: 7.6,
    color: MUTED,
    align: "right",
  });
}

async function qrDataUrl(): Promise<string | null> {
  try {
    const QR = await import("qrcode");
    return await QR.toDataURL(SITE, { margin: 1, width: 260, color: { dark: "#0F172A", light: "#FFFFFF" } });
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------- data helpers */

const metricScore = (a: AtsAnalysis, needle: string) => {
  const m = a.metrics.find((x) => x.label.toLowerCase().includes(needle.toLowerCase()));
  return Math.round(m?.score ?? a.overallScore);
};

function priorityOf(impact: string, index: number) {
  const nums = (impact.match(/\d+/g) ?? []).map(Number);
  const gain = nums.length ? Math.max(...nums) : Math.max(3, 12 - index * 3);
  const level: "High" | "Medium" | "Low" = gain >= 10 ? "High" : gain >= 5 ? "Medium" : "Low";
  return { level, gain };
}

const oneLine = (s: string, n = 96) => {
  const clean = (s ?? "").replace(/\s+/g, " ").trim();
  return clean.length > n ? `${clean.slice(0, n - 1)}…` : clean;
};

/* ------------------------------------------------------------------- page 01 */

async function pageOne(doc: Doc, a: AtsAnalysis, when: string, whenShort: string) {
  doc.setFillColor(250, 251, 253);
  doc.rect(0, 0, PW, PH, "F");

  /* hero */
  const heroH = 168;
  gradientBand(doc, 0, 0, PW, heroH, BLUE_DEEP, [56, 145, 250]);
  doc.setFillColor(255, 255, 255);
  const gs = doc.GState ? doc.GState({ opacity: 0.09 }) : null;
  if (gs) doc.setGState(gs);
  doc.circle(PW - 46, 22, 92, "F");
  doc.circle(72, heroH - 6, 54, "F");
  doc.circle(PW - 150, heroH - 18, 36, "F");
  if (doc.GState) doc.setGState(doc.GState({ opacity: 1 }));

  logo(doc, M, 28, 26);
  text(doc, BRAND, M + 34, 40, { size: 14.5, bold: true, color: WHITE });
  text(doc, BRAND_SUB, M + 34, 51, { size: 8.2, color: [219, 234, 254] });
  text(doc, "EXECUTIVE ATS REPORT", PW - M, 42, { size: 8, bold: true, color: [219, 234, 254], align: "right" });
  text(doc, whenShort, PW - M, 54, { size: 8.2, color: WHITE, align: "right" });

  text(doc, "Complete ATS Resume Analysis", M, 104, { size: 22, bold: true, color: WHITE });
  const p = a.profile;
  const who = [p.fullName || "Candidate", p.jobRole || p.industry].filter(Boolean).join("  ·  ");
  text(doc, who, M, 126, { size: 10.4, color: [223, 236, 254] });
  text(doc, "Recruiter-grade scoring, keyword intelligence and a 2-minute action plan.", M, 143, {
    size: 8.6,
    color: [198, 222, 253],
  });

  /* score + recruiter summary */
  const rating = scoreRating(a.overallScore);
  const cardY = heroH - 8;
  card(doc, M, cardY, CW, 148, 16);
  gauge(doc, M + 82, cardY + 74, 46, a.overallScore);

  let sx = M + 152;
  const sy = cardY + 26;
  text(doc, "RECRUITER'S OPINION", sx, sy + 6, { size: 7.6, bold: true, color: BLUE });
  const badgeW = pill(doc, statusLabel(a.overallScore).toUpperCase(), sx, sy + 14, scoreSoft(a.overallScore), scoreColor(a.overallScore));
  pill(doc, rating.label.toUpperCase(), sx + badgeW + 6, sy + 14, BLUE_SOFT, BLUE_DEEP);
  paragraph(doc, a.recruiter.recruiterImpression || a.executiveSummary, sx, sy + 48, CW - 176, {
    size: 9.3,
    lh: 13.4,
    maxLines: 5,
  });
  text(doc, `Interview readiness: ${oneLine(a.recruiter.interviewReadiness, 70)}`, sx, cardY + 130, {
    size: 8.4,
    bold: true,
    color: NAVY,
  });

  /* quick score cards */
  let y = cardY + 172;
  text(doc, "SCORE BREAKDOWN", M, y, { size: 8, bold: true, color: BLUE });
  y += 12;
  const cards = [
    { label: "ATS Score", score: Math.round(a.overallScore) },
    { label: "Keyword Match", score: metricScore(a, "Keyword Match") },
    { label: "Formatting", score: metricScore(a, "Formatting") },
    { label: "Skills", score: metricScore(a, "Skills Match") },
    { label: "Projects", score: metricScore(a, "Projects") },
    { label: "Experience", score: metricScore(a, "Experience") },
  ];
  const gap = 11;
  const cw = (CW - gap * 2) / 3;
  const ch = 66;
  cards.forEach((c, i) => {
    const x = M + (i % 3) * (cw + gap);
    const cy = y + Math.floor(i / 3) * (ch + gap);
    card(doc, x, cy, cw, ch, 11);
    doc.setFillColor(...scoreSoft(c.score));
    doc.roundedRect(x + 12, cy + 12, 16, 16, 5, 5, "F");
    doc.setFillColor(...scoreColor(c.score));
    doc.circle(x + 20, cy + 20, 3.4, "F");
    text(doc, c.label.toUpperCase(), x + 34, cy + 23, { size: 7.4, bold: true, color: MUTED });
    text(doc, `${c.score}`, x + 12, cy + 46, { size: 16, bold: true, color: NAVY });
    text(doc, "/100", x + 12 + doc.getTextWidth(`${c.score}`) + 15, cy + 46, { size: 7.6, bold: true, color: MUTED });
    text(doc, statusLabel(c.score), x + cw - 12, cy + 46, {
      size: 7.6,
      bold: true,
      color: scoreColor(c.score),
      align: "right",
    });
    progress(doc, x + 12, cy + 53, cw - 24, c.score, 4.6);
  });
  y += ch * 2 + gap + 22;

  /* strengths / improvements */
  const colW = (CW - gap) / 2;
  const listH = 128;
  card(doc, M, y, colW, listH, 12);
  card(doc, M + colW + gap, y, colW, listH, 12);
  text(doc, "TOP STRENGTHS", M + 14, y + 20, { size: 8, bold: true, color: GREEN });
  text(doc, "TOP IMPROVEMENTS", M + colW + gap + 14, y + 20, { size: 8, bold: true, color: ORANGE });

  const strengths = (a.recruiter.strengths.length ? a.recruiter.strengths : ["ATS-readable structure detected"]).slice(0, 4);
  const gaps = (a.recruiter.weaknesses.length ? a.recruiter.weaknesses : ["Add measurable achievements"]).slice(0, 4);

  strengths.forEach((s, i) => {
    const ry = y + 40 + i * 22;
    doc.setFillColor(...GREEN_SOFT);
    doc.circle(M + 18, ry - 2.6, 5.4, "F");
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(1.2);
    doc.setLineCap("round");
    doc.line(M + 15.6, ry - 2.6, M + 17.4, ry - 0.8);
    doc.line(M + 17.4, ry - 0.8, M + 20.6, ry - 5);
    doc.setLineCap("butt");
    doc.setLineWidth(0.7);
    paragraph(doc, oneLine(s, 62), M + 30, ry, colW - 44, { size: 8.5, lh: 10, maxLines: 2 });
  });
  gaps.forEach((s, i) => {
    const ry = y + 40 + i * 22;
    const x0 = M + colW + gap;
    doc.setFillColor(...AMBER_SOFT);
    doc.circle(x0 + 18, ry - 2.6, 5.4, "F");
    text(doc, "!", x0 + 16.6, ry, { size: 7.4, bold: true, color: AMBER });
    paragraph(doc, oneLine(s, 62), x0 + 30, ry, colW - 44, { size: 8.5, lh: 10, maxLines: 2 });
  });
  y += listH + 16;

  /* QR strip */
  const stripH = 74;
  card(doc, M, y, CW, stripH, 12, [246, 249, 255], BLUE_SOFT);
  const qr = await qrDataUrl();
  if (qr) doc.addImage(qr, "PNG", M + 14, y + 10, 54, 54);
  text(doc, "Scan to improve your resume online", M + 82, y + 30, { size: 11, bold: true, color: NAVY });
  text(doc, "Apply AI fixes in real time, re-score instantly and export a fresh report.", M + 82, y + 45, {
    size: 8.4,
    color: MUTED,
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.4);
  doc.setTextColor(...BLUE);
  doc.textWithLink("careersync.in", M + 82, y + 60, { url: SITE });

  footer(doc, 1, 2, when);
}

/* ------------------------------------------------------------------- page 02 */

function pageTwo(doc: Doc, a: AtsAnalysis, when: string, projected: number) {
  doc.addPage();
  doc.setFillColor(250, 251, 253);
  doc.rect(0, 0, PW, PH, "F");

  gradientBand(doc, 0, 0, PW, 6, BLUE_DEEP, [90, 165, 252]);
  logo(doc, M, 26, 20, false);
  text(doc, `${BRAND} ${BRAND_SUB}`, M + 27, 40, { size: 9, bold: true, color: NAVY });
  text(doc, "ACTION PLAN", PW - M, 40, { size: 8, bold: true, color: BLUE, align: "right" });

  let y = 72;
  text(doc, "How to Improve Your Resume", M, y, { size: 18, bold: true, color: NAVY });
  text(doc, "Highest-impact fixes first — each one is worth real ATS points.", M, y + 15, { size: 8.8, color: MUTED });
  y += 34;

  /* priority fixes */
  const ranked = a.suggestions
    .map((s, i) => ({ s, ...priorityOf(s.impact ?? "", i) }))
    .sort((x, z) => z.gain - x.gain)
    .slice(0, 3);
  const fixes = ranked.length
    ? ranked
    : [
        {
          s: {
            title: "Quantify your achievements",
            why: "Recruiters prefer measurable impact.",
            how: "Add numbers, %, currency or time saved to each senior bullet.",
            impact: "",
          },
          level: "High" as const,
          gain: 8,
        },
      ];

  fixes.forEach((f) => {
    const h = 82;
    card(doc, M, y, CW, h, 12);
    doc.setFillColor(...(f.level === "High" ? RED : f.level === "Medium" ? AMBER : BLUE));
    doc.roundedRect(M, y + 12, 3.2, h - 24, 2, 2, "F");
    pill(
      doc,
      `${f.level.toUpperCase()} PRIORITY`,
      M + 14,
      y + 12,
      f.level === "High" ? RED_SOFT : f.level === "Medium" ? AMBER_SOFT : BLUE_SOFT,
      f.level === "High" ? RED : f.level === "Medium" ? AMBER : BLUE_DEEP,
    );
    doc.setFillColor(...GREEN_SOFT);
    const gw = 62;
    doc.roundedRect(PW - M - gw - 12, y + 12, gw, 15, 7.5, 7.5, "F");
    text(doc, `+${f.gain} ATS pts`, PW - M - 12 - gw / 2, y + 22.5, { size: 7.6, bold: true, color: GREEN, align: "center" });
    text(doc, oneLine(f.s.title, 68), M + 14, y + 45, { size: 11, bold: true, color: NAVY });
    text(doc, "Why", M + 14, y + 60, { size: 7.2, bold: true, color: MUTED });
    paragraph(doc, oneLine(f.s.why, 84), M + 40, y + 60, CW / 2 - 60, { size: 8.4, lh: 10, maxLines: 2 });
    text(doc, "Fix", M + CW / 2 + 6, y + 60, { size: 7.2, bold: true, color: MUTED });
    paragraph(doc, oneLine(f.s.how, 92), M + CW / 2 + 28, y + 60, CW / 2 - 44, { size: 8.4, lh: 10, maxLines: 2 });
    y += h + 10;
  });

  /* keywords */
  y += 6;
  text(doc, "KEYWORD INTELLIGENCE", M, y, { size: 8, bold: true, color: BLUE });
  y += 10;
  const matched = [...new Set([...a.profile.keywords, ...a.profile.technicalSkills])].slice(0, 10);
  const missing = a.recruiter.missingKeywords.slice(0, 8);
  const recommended = a.profile.tools.slice(0, 6);
  const groups: { label: string; items: string[]; fill: RGB; color: RGB }[] = [
    { label: "Matched", items: matched, fill: BLUE_SOFT, color: BLUE_DEEP },
    { label: "Missing", items: missing, fill: RED_SOFT, color: RED },
    { label: "Recommended", items: recommended, fill: GREEN_SOFT, color: GREEN },
  ];
  const kh = 104;
  card(doc, M, y, CW, kh, 12);
  let ky = y + 20;
  groups.forEach((g) => {
    text(doc, g.label.toUpperCase(), M + 14, ky + 4, { size: 7.2, bold: true, color: g.color });
    let x = M + 84;
    (g.items.length ? g.items : ["None detected"]).forEach((raw) => {
      const label = oneLine(raw, 22);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.4);
      const w = doc.getTextWidth(label) + 14;
      if (x + w > PW - M - 14) return;
      pill(doc, label, x, ky - 6, g.fill, g.color, 7.4, 14);
      x += w + 5;
    });
    ky += 30;
  });
  y += kh + 16;

  /* resume snapshot */
  const snapH = 92;
  card(doc, M, y, CW, snapH, 12);
  text(doc, "RESUME SNAPSHOT", M + 14, y + 20, { size: 8, bold: true, color: BLUE });
  const exp = a.profile.experience[0];
  const edu = a.profile.education[0];
  const snap: [string, string][] = [
    ["Experience", exp ? oneLine(`${exp.role}${exp.company ? ` · ${exp.company}` : ""} ${exp.period}`, 78) : "Not detected"],
    ["Education", edu ? oneLine(`${edu.degree}${edu.institution ? ` · ${edu.institution}` : ""}`, 78) : "Not detected"],
    ["Skills", a.profile.skills.length ? `${a.profile.skills.length} detected · ${oneLine(a.profile.skills.slice(0, 5).join(", "), 60)}` : "Not detected"],
    ["Projects", a.profile.projects.length ? `${a.profile.projects.length} listed · ${oneLine(a.profile.projects[0].name, 50)}` : "None listed — add 2 with measurable impact"],
  ];
  snap.forEach(([k, v], i) => {
    const ry = y + 38 + i * 15;
    text(doc, k, M + 14, ry, { size: 8.2, bold: true, color: NAVY });
    text(doc, v, M + 82, ry, { size: 8.2, color: SLATE, maxWidth: CW - 100 });
  });
  y += snapH + 14;

  /* recommendation */
  const recH = 66;
  card(doc, M, y, CW, recH, 12, [244, 248, 255], BLUE_SOFT);
  doc.setFillColor(...BLUE);
  doc.roundedRect(M, y + 12, 3.2, recH - 24, 2, 2, "F");
  text(doc, "RECRUITER'S RECOMMENDATION", M + 14, y + 22, { size: 7.6, bold: true, color: BLUE_DEEP });
  paragraph(doc, oneLine(a.scoreMeaning || a.executiveSummary, 260), M + 14, y + 38, CW - 28, {
    size: 9,
    lh: 12,
    maxLines: 2,
    color: NAVY,
  });
  y += recH + 14;

  /* final score meter */
  const meterH = 88;
  card(doc, M, y, CW, meterH, 12);
  text(doc, "POTENTIAL AFTER FIXES", M + 14, y + 20, { size: 8, bold: true, color: BLUE });
  const now = Math.round(a.overallScore);
  text(doc, `${now}`, M + 24, y + 56, { size: 24, bold: true, color: scoreColor(now) });
  text(doc, "CURRENT", M + 24, y + 68, { size: 6.8, bold: true, color: MUTED });
  const ax = M + 84;
  const aw = CW - 240;
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(1.6);
  doc.line(ax, y + 48, ax + aw, y + 48);
  doc.setFillColor(...BLUE);
  doc.triangle(ax + aw, y + 43, ax + aw, y + 53, ax + aw + 9, y + 48, "F");
  progress(doc, ax, y + 58, aw + 9, projected, 5);
  text(doc, `+${Math.max(0, projected - now)} points available`, ax + (aw + 9) / 2, y + 40, {
    size: 8,
    bold: true,
    color: GREEN,
    align: "center",
  });
  text(doc, `${projected}`, PW - M - 96, y + 56, { size: 24, bold: true, color: GREEN });
  text(doc, "POTENTIAL", PW - M - 96, y + 68, { size: 6.8, bold: true, color: MUTED });
  doc.setFillColor(...GREEN_SOFT);
  doc.roundedRect(PW - M - 34, y + 32, 22, 34, 8, 8, "F");
  text(doc, "AI", PW - M - 23, y + 52, { size: 8.4, bold: true, color: GREEN, align: "center" });

  footer(doc, 2, 2, when);
}

/* -------------------------------------------------------------------- export */

export type ReportKind = "ats" | "resume" | "complete";

export type ReportData = {
  analysis: AtsAnalysis;
  optimization?: AtsOptimization | null;
  optimizedAnalysis?: AtsAnalysis | null;
};

/** Clean, ATS-safe optimized resume export (text-first, no decoration). */
function resumeExport(doc: Doc, optimization: AtsOptimization | null | undefined, a: AtsAnalysis, when: string) {
  const pages = () => (doc as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, PW, PH, "F");
  gradientBand(doc, 0, 0, PW, 6, BLUE_DEEP, [90, 165, 252]);
  logo(doc, M, 26, 20, false);
  text(doc, `${BRAND} ${BRAND_SUB}`, M + 27, 40, { size: 9, bold: true, color: NAVY });
  text(doc, "ATS-OPTIMIZED RESUME", PW - M, 40, { size: 8, bold: true, color: BLUE, align: "right" });

  let y = 78;
  text(doc, a.profile.fullName || "Optimized resume", M, y, { size: 17, bold: true, color: NAVY });
  y += 26;

  const body = optimization?.optimizedResume?.trim();
  const flow = (str: string, size: number, bold: boolean, color: RGB, lh: number) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    for (const line of doc.splitTextToSize(str, CW) as string[]) {
      if (y > PH - 72) {
        footer(doc, pages(), 0, when);
        doc.addPage();
        y = 72;
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);
      }
      doc.text(line, M, y);
      y += lh;
    }
  };

  if (body) {
    for (const raw of body.split("\n")) {
      const line = raw.replace(/\s+$/g, "");
      if (!line.trim()) {
        y += 7;
        continue;
      }
      const heading = /^[A-Z][A-Z\s&/]{3,}$/.test(line.trim());
      if (heading) {
        y += 6;
        flow(line.trim(), 10.5, true, BLUE_DEEP, 15);
        doc.setDrawColor(...BORDER);
        doc.line(M, y - 8, PW - M, y - 8);
        y += 4;
      } else {
        flow(line, 9.4, false, SLATE, 13);
      }
    }
  } else {
    flow("Run the AI optimizer to generate your ATS-safe resume.", 9.4, false, SLATE, 13);
  }

  if (optimization?.recommendedAdditions?.length) {
    y += 12;
    flow("RECOMMENDED ADDITIONS", 10.5, true, BLUE_DEEP, 15);
    for (const item of optimization.recommendedAdditions.slice(0, 8)) flow(`•  ${item}`, 9.2, false, SLATE, 12.5);
  }

  const total = pages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    footer(doc, i, total, when);
  }
}

export async function generateReport(kind: ReportKind, data: ReportData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const when = new Date().toLocaleString();
  const whenShort = new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  const { analysis, optimization, optimizedAnalysis } = data;
  const a = optimizedAnalysis ?? analysis;

  if (kind === "resume") {
    resumeExport(doc, optimization, a, when);
    doc.save(`CareerSync-Optimized-Resume-${Date.now()}.pdf`);
    return;
  }

  const gains = a.suggestions.reduce((sum, s, i) => sum + priorityOf(s.impact ?? "", i).gain, 0);
  const projected = Math.max(
    Math.round(a.overallScore) + 2,
    Math.min(99, Math.round(a.overallScore + gains * 0.5)),
  );

  await pageOne(doc, a, when, whenShort);
  pageTwo(doc, a, when, projected);

  doc.save(`CareerSync-${kind === "complete" ? "Executive-Report" : "ATS-Report"}-${Date.now()}.pdf`);
}
