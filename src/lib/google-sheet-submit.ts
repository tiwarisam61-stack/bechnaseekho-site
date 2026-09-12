export type GoogleSheetResumePayload = {
  type: "resume";
  fullName: string;
  email: string;
  phone: string;
  resumeName: string;
  resumeType: string;
  resumeSize: number;
  resumePath?: string;
  resumeUrl?: string;
  sourceLabel?: string;
};

export type GoogleSheetJobPayload = {
  type: "job";
  company: string;
  role: string;
  location: string;
  category: string;
  workMode: string;
  employmentType: string;
  experience: string;
  qualification: string;
  openings: string;
  deadline: string;
  salary: string;
  tags: string[];
  description: string;
  postedBy: string;
  status: string;
  action?: string;
  reviewedBy?: string;
  reviewedAt?: string;
};

export type GoogleSheetSubmitPayload = GoogleSheetResumePayload | GoogleSheetJobPayload;

export async function submitToGoogleSheet(payload: GoogleSheetSubmitPayload) {
  const response = await fetch("/api/google-sheet-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  if (!response.ok) {
    throw new Error(body?.error || "Could not submit to Google Sheet.");
  }
  return body;
}

export function buildJobSheetPayload(input: {
  company: string | null | undefined;
  role: string | null | undefined;
  location: string | null | undefined;
  salary: string | null | undefined;
  description: string | null | undefined;
  postedBy: string | null | undefined;
  status: string;
  tags?: string[] | null;
  category?: string | null;
  workMode?: string | null;
  employmentType?: string | null;
  experience?: string | null;
  qualification?: string | null;
  openings?: string | number | null;
  deadline?: string | null;
  action?: string;
  reviewedBy?: string | null;
}): GoogleSheetJobPayload {
  return {
    type: "job",
    company: input.company || "",
    role: input.role || "",
    location: input.location || "",
    category: input.category || input.tags?.[0] || "",
    workMode: input.workMode || "",
    employmentType: input.employmentType || "",
    experience: input.experience || "",
    qualification: input.qualification || "",
    openings: input.openings == null ? "" : String(input.openings),
    deadline: input.deadline || "",
    salary: input.salary || "",
    tags: input.tags || [],
    description: input.description || "",
    postedBy: input.postedBy || "",
    status: input.status,
    action: input.action,
    reviewedBy: input.reviewedBy || "",
    reviewedAt: input.reviewedBy ? new Date().toISOString() : "",
  };
}
