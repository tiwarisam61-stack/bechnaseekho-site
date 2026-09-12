import type { DemoApplicationRecord, DemoJobRecord, DemoRole } from "@/lib/careersync-demo";

export type SharedJobInput = {
  role: string;
  company: string;
  location: string;
  employmentType: string;
  experience: string;
  salary: string;
  description: string;
  tags: string[];
  industry?: string | null;
  openPositions?: number | null;
  responsibilities?: string[] | null;
  requiredSkills?: string[] | null;
  preferredSkills?: string[] | null;
  applicationDeadline?: string | null;
  recruiterEmail?: string | null;
  localOwnerId?: string | null;
};

export type SharedApplicationInput = {
  jobId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  resumePath?: string | null;
  resumeUrl?: string | null;
  coverLetter?: string | null;
};

export type SharedResumeUpload = {
  path: string;
  url: string;
  name: string;
};

export type SharedResumeParseResult = {
  phone: string | null;
  email: string | null;
  name: string | null;
  city: string | null;
  totalExperience: string | null;
  lastRole: string | null;
  companies: string[];
  skills: string[];
  education: string[];
  noticePeriod: string | null;
  currentCtc: string | null;
  expectedCtc: string | null;
  languages: string[];
  summary?: string | null;
  jobGaps?: string[];
  roleFit?: string[];
  recruiterRecommendation?: string;
  confidence?: number;
  source?: "ai" | "fallback";
};

export async function fetchSharedCareerSyncJobs(input: {
  role: DemoRole;
  userId: string;
  email?: string | null;
}) {
  const params = new URLSearchParams({
    role: input.role,
    userId: input.userId,
  });
  if (input.email) params.set("email", input.email);

  const response = await fetch(`/api/careersync-jobs?${params.toString()}`);
  const body = (await response.json().catch(() => null)) as { jobs?: DemoJobRecord[]; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not load shared jobs.");
  return body?.jobs ?? [];
}

export async function fetchPublicCareerSyncJobs() {
  const response = await fetch("/api/careersync-jobs?role=public");
  const body = (await response.json().catch(() => null)) as { jobs?: DemoJobRecord[]; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not load public jobs.");
  return (body?.jobs ?? []).filter((job) => job.status === "approved" && job.is_active && job.is_verified);
}

export async function fetchSharedCareerSyncApplications(input: {
  role: DemoRole;
  userId: string;
  email?: string | null;
}) {
  const params = new URLSearchParams({
    resource: "applications",
    role: input.role,
    userId: input.userId,
  });
  if (input.email) params.set("email", input.email);

  const response = await fetch(`/api/careersync-jobs?${params.toString()}`);
  const body = (await response.json().catch(() => null)) as { applications?: DemoApplicationRecord[]; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not load shared applications.");
  return body?.applications ?? [];
}

export async function fetchSharedCareerSyncResumeInsights(input: {
  role: DemoRole;
  userId: string;
  email?: string | null;
}) {
  const params = new URLSearchParams({
    resource: "resume-insights",
    role: input.role,
    userId: input.userId,
  });
  if (input.email) params.set("email", input.email);

  const response = await fetch(`/api/careersync-jobs?${params.toString()}`);
  const body = (await response.json().catch(() => null)) as {
    resumeInsights?: {
      bucket: string;
      storageCount: number;
      samplePaths: string[];
      storageFiles?: Array<{
        path: string;
        fileName: string;
        folder: string;
        uploadedAt: string | null;
        size: number | null;
      }>;
      checkedAt: string;
    };
    error?: string;
  } | null;
  if (!response.ok) throw new Error(body?.error || "Could not load resume storage insights.");
  return body?.resumeInsights ?? null;
}

export async function persistSharedCareerSyncApplication(input: SharedApplicationInput) {
  const response = await fetch("/api/careersync-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "application", ...input }),
  });
  const body = (await response.json().catch(() => null)) as { application?: DemoApplicationRecord; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not submit application.");
  return body?.application ?? null;
}

export async function uploadSharedCareerSyncResume(input: { userId: string; file: File }): Promise<SharedResumeUpload> {
  const formData = new FormData();
  formData.set("type", "resume");
  formData.set("userId", input.userId);
  formData.set("file", input.file);

  const response = await fetch("/api/careersync-jobs", {
    method: "POST",
    body: formData,
  });
  const body = (await response.json().catch(() => null)) as { resume?: SharedResumeUpload; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not upload resume.");
  if (!body?.resume) throw new Error("Resume upload did not return a file link.");
  return body.resume;
}

export function getSharedResumeUploadUserId(source = "resume-upload") {
  const safeSource = source.replace(/[^a-z0-9_-]/gi, "-").slice(0, 40) || "resume-upload";
  if (typeof window === "undefined") return `${safeSource}-server`;

  const key = `careersync_${safeSource}_user_id`;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const userId = `${safeSource}-${random}`;
  window.localStorage.setItem(key, userId);
  return userId;
}

export async function parseSharedCareerSyncResume(input: { text: string; fileName?: string }): Promise<SharedResumeParseResult | null> {
  const response = await fetch("/api/careersync-resume-parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => null)) as { resume?: SharedResumeParseResult; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not parse resume.");
  return body?.resume ?? null;
}

export async function updateSharedCareerSyncApplicationStatus(input: {
  applicationId: string;
  status: string;
}) {
  const response = await fetch("/api/careersync-jobs", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "application-status", ...input }),
  });
  const body = (await response.json().catch(() => null)) as { application?: DemoApplicationRecord; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not update application status.");
  return body?.application ?? null;
}

export async function requestSharedCareerSyncProfileUnlock(input: {
  applicationId: string;
  requestedBy?: string | null;
  note?: string | null;
}) {
  const response = await fetch("/api/careersync-jobs", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "application-unlock-request", ...input }),
  });
  const body = (await response.json().catch(() => null)) as { application?: DemoApplicationRecord; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not request profile unlock.");
  return body?.application ?? null;
}

export async function reviewSharedCareerSyncProfileUnlock(input: {
  applicationId: string;
  approved: boolean;
  reviewedBy?: string | null;
  note?: string | null;
}) {
  const response = await fetch("/api/careersync-jobs", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "application-unlock-review", ...input }),
  });
  const body = (await response.json().catch(() => null)) as { application?: DemoApplicationRecord; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not review profile unlock.");
  return body?.application ?? null;
}

export async function repairSharedCareerSyncApplications(applications: DemoApplicationRecord[]) {
  const response = await fetch("/api/careersync-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "repair-applications", applications }),
  });
  const body = (await response.json().catch(() => null)) as {
    inserted?: number;
    skipped?: number;
    applications?: DemoApplicationRecord[];
    error?: string;
  } | null;
  if (!response.ok) throw new Error(body?.error || "Could not repair applications.");
  return {
    inserted: body?.inserted ?? 0,
    skipped: body?.skipped ?? 0,
    applications: body?.applications ?? [],
  };
}

export async function persistSharedCareerSyncJob(input: SharedJobInput) {
  const response = await fetch("/api/careersync-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => null)) as { job?: DemoJobRecord; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not save shared job.");
  return body?.job ?? null;
}

export async function updateSharedCareerSyncJob(input: SharedJobInput & { jobId: string }) {
  const response = await fetch("/api/careersync-jobs", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => null)) as { job?: DemoJobRecord; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not update shared job.");
  return body?.job ?? null;
}

export async function reviewSharedCareerSyncJob(input: {
  jobId: string;
  status: DemoJobRecord["status"];
  reviewedBy?: string | null;
}) {
  const response = await fetch("/api/careersync-jobs", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => null)) as { job?: DemoJobRecord; error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not update shared job.");
  return body?.job ?? null;
}
