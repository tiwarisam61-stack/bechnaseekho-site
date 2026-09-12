/** Browser-only resume text extraction (PDF / DOC / DOCX). */

import JSZip from "jszip";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export class ResumeError extends Error {
  hint: string;
  constructor(message: string, hint: string) {
    super(message);
    this.hint = hint;
  }
}

const EXT_RE = /\.(pdf|doc|docx)$/i;

export function validateFile(file: File) {
  if (!EXT_RE.test(file.name)) {
    throw new ResumeError(
      "That file type isn't supported",
      "Please upload your resume as a PDF, DOC or DOCX file.",
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ResumeError(
      "That file is larger than 5 MB",
      "Try exporting your resume again at a smaller size, or remove large images.",
    );
  }
  if (file.size === 0) {
    throw new ResumeError("That file looks empty", "Please pick the correct resume file and try again.");
  }
}

async function extractPdf(file: File) {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const buffer = await file.arrayBuffer();
  let doc;
  try {
    doc = await pdfjs.getDocument({ data: buffer }).promise;
  } catch (error) {
    const name = (error as { name?: string })?.name ?? "";
    if (name === "PasswordException") {
      throw new ResumeError(
        "This PDF is password protected",
        "Remove the password (or export an unlocked copy) and upload it again.",
      );
    }
    throw new ResumeError(
      "We couldn't read this PDF",
      "The file may be corrupted. Try re-exporting your resume and uploading again.",
    );
  }

  let text = "";
  const pages = Math.min(doc.numPages, 12);
  for (let i = 1; i <= pages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text +=
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ") + "\n\n";
  }
  return text.trim();
}

async function extractDocx(file: File) {
  const buffer = await file.arrayBuffer();
  try {
    const mammoth = await import("mammoth/mammoth.browser.js");
    const result = await (mammoth as unknown as {
      extractRawText: (o: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    }).extractRawText({ arrayBuffer: buffer });
    const text = result.value.trim();
    if (text) return text;
  } catch {
    // Some mobile-generated DOCX files fail in mammoth but still contain readable XML.
  }

  try {
    const zip = await JSZip.loadAsync(buffer);
    const parts = [
      await zip.file("word/document.xml")?.async("string"),
      await zip.file("word/header1.xml")?.async("string"),
      await zip.file("word/footer1.xml")?.async("string"),
    ].filter(Boolean);
    const text = parts.join("\n")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/[ \t]+/g, " ")
      .trim();
    if (text) return text;
  } catch {
    // Fall through to the user-facing error below.
  }

  throw new ResumeError(
    "We couldn't read this document",
    "Please save your resume as a fresh PDF or DOCX and upload it again.",
  );
}

async function extractLegacyDoc(file: File) {
  try {
    const raw = new TextDecoder("latin1").decode(await file.arrayBuffer());
    const text = raw
      .replace(/\u0000/g, " ")
      .replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (text.length >= 120) return text;
  } catch {
    // Fall through to the user-facing error below.
  }

  throw new ResumeError(
    "We couldn't read this old Word document",
    "Legacy .doc files are limited. Please open it in Word or Google Docs, then save as PDF or DOCX and upload again.",
  );
}

async function extractWord(file: File) {
  if (/\.doc$/i.test(file.name) && !/\.docx$/i.test(file.name)) {
    return extractLegacyDoc(file);
  }
  try {
    return await extractDocx(file);
  } catch (error) {
    if (/\.docx$/i.test(file.name)) throw error;
    try {
      return await extractLegacyDoc(file);
    } catch {
      throw error;
    }
  }
}

function tooLittleTextMessage(file: File) {
  if (/\.doc$/i.test(file.name) && !/\.docx$/i.test(file.name)) {
    throw new ResumeError(
      "We couldn't find readable text in this old Word document",
      "Please open it in Word or Google Docs, then save as PDF or DOCX and upload again.",
    );
  }
  throw new ResumeError(
    "We couldn't find readable text in this resume",
    "This looks like a scanned, image-based, or protected file. Upload a text-based PDF or DOCX export instead.",
  );
}

export async function extractResumeText(file: File): Promise<string> {
  validateFile(file);
  const isPdf = /\.pdf$/i.test(file.name);
  const text = isPdf ? await extractPdf(file) : await extractWord(file);

  if (text.replace(/\s/g, "").length < 120) {
    tooLittleTextMessage(file);
  }
  return text.slice(0, 45000);
}
