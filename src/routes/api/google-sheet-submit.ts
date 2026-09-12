import { createFileRoute } from "@tanstack/react-router";

type ResumePayload = {
  type: "resume";
  fullName?: string;
  email?: string;
  phone?: string;
  resumeName?: string;
  resumeType?: string;
  resumeSize?: number;
  resumePath?: string;
  resumeUrl?: string;
};

type JobPayload = {
  type: "job";
  company?: string;
  role?: string;
  location?: string;
  category?: string;
  workMode?: string;
  employmentType?: string;
  experience?: string;
  qualification?: string;
  openings?: string;
  deadline?: string;
  salary?: string;
  tags?: string[];
  description?: string;
  postedBy?: string;
  status?: string;
  action?: string;
  reviewedBy?: string;
  reviewedAt?: string;
};

type SubmitPayload = ResumePayload | JobPayload;

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "1Yx9pYs5ovLEbtEdGqpt8rtTZoxnZsWPIibSYFbLbvUs";
const RESUME_SHEET_NAME = process.env.GOOGLE_SHEET_RESUME_TAB || "JobRequirements";
const JOBS_SHEET_NAME = process.env.GOOGLE_SHEET_JOBS_TAB || "Sheet2";

export const Route = createFileRoute("/api/google-sheet-submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = (await request.json()) as SubmitPayload;
          const row = buildRow(payload);

          await submitWithWebhook(payload.type, row);

          return Response.json({ ok: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Could not submit to Google Sheet.";
          const status = /missing google/i.test(message) ? 503 : 400;
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});

function buildRow(payload: SubmitPayload) {
  const now = new Date();
  const timestamp = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const iso = now.toISOString();

  if (payload.type === "resume") {
    requireFields(payload, ["fullName", "email", "phone", "resumeName"]);
    return [
      timestamp,
      payload.fullName || "",
      payload.phone || "",
      payload.email || "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Submitted from CareerSync homepage",
      payload.resumeName || "",
      payload.resumeType || "",
      String(payload.resumeSize || ""),
      payload.resumePath || "",
      payload.resumeUrl || "",
      iso,
    ];
  }

  requireFields(payload, ["company", "role", "location", "salary", "description", "postedBy"]);
  return [
    timestamp,
    "CareerSync post-job",
    payload.company || "",
    payload.role || "",
    payload.location || "",
    payload.category || "",
    payload.workMode || "",
    payload.employmentType || "",
    payload.experience || "",
    payload.qualification || "",
    payload.openings || "",
    payload.deadline || "",
    payload.salary || "",
    Array.isArray(payload.tags) ? payload.tags.join(", ") : "",
    payload.description || "",
    payload.postedBy || "",
    payload.status || "pending",
    payload.action || "submitted",
    payload.reviewedBy || "",
    payload.reviewedAt || "",
    iso,
  ];
}

function requireFields(payload: Record<string, unknown>, fields: string[]) {
  const missing = fields.filter((field) => !String(payload[field] ?? "").trim());
  if (missing.length) throw new Error(`Missing required field: ${missing.join(", ")}`);
}

async function submitWithWebhook(type: SubmitPayload["type"], row: string[]) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("Missing Google Sheets credentials. Add GOOGLE_SHEET_WEBHOOK_URL in Netlify.");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      spreadsheetId: SPREADSHEET_ID,
      sheetName: type === "job" ? JOBS_SHEET_NAME : RESUME_SHEET_NAME,
      type,
      row,
    }),
  });
  if (!response.ok) throw new Error(`Google Sheet webhook failed: ${await response.text()}`);
  const body = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (body && body.ok === false) throw new Error(body.error || "Google Sheet webhook rejected the submission.");
}
