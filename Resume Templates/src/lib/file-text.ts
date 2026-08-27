import JSZip from "jszip";

export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = (worker as { default: string }).default;
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .map((it) => ("str" in it ? (it as { str: string }).str : ""))
        .join(" ")
        .replace(/\s+/g, " "),
    );
  }
  return pages.join("\n\n");
}

export async function extractDocxText(file: File): Promise<string> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const xml = await zip.file("word/document.xml")?.async("string");
  if (!xml) throw new Error("This DOCX file could not be read.");
  return xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Legacy binary .doc — best effort text salvage. */
export async function extractDocText(file: File): Promise<string> {
  const raw = new TextDecoder("latin1").decode(await file.arrayBuffer());
  const text = raw
    .replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (text.length < 60) throw new Error("This .doc file could not be read. Please upload a PDF or DOCX.");
  return text;
}

export const RESUME_ACCEPT = ".pdf,.doc,.docx";
export const RESUME_FILE_ERROR = "Only PDF, DOC and DOCX files are supported.";

export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return extractPdfText(file);
  if (name.endsWith(".docx")) return extractDocxText(file);
  if (name.endsWith(".doc")) return extractDocText(file);
  if (name.endsWith(".txt")) return file.text();
  throw new Error(RESUME_FILE_ERROR);
}

