/** Browser-only resume text extraction (PDF / DOC / DOCX). */

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
  try {
    const mammoth = await import("mammoth/mammoth.browser.js");
    const buffer = await file.arrayBuffer();
    const result = await (mammoth as unknown as {
      extractRawText: (o: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    }).extractRawText({ arrayBuffer: buffer });
    return result.value.trim();
  } catch {
    throw new ResumeError(
      "We couldn't read this document",
      "Please save your resume as a PDF or DOCX and upload it again.",
    );
  }
}

export async function extractResumeText(file: File): Promise<string> {
  validateFile(file);
  const isPdf = /\.pdf$/i.test(file.name);
  const text = isPdf ? await extractPdf(file) : await extractDocx(file);

  if (text.replace(/\s/g, "").length < 120) {
    throw new ResumeError(
      "We couldn't find readable text in this resume",
      "This looks like a scanned or image-based file. Upload a text-based PDF or DOCX export instead.",
    );
  }
  return text.slice(0, 45000);
}
