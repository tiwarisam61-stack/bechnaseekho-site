import type { DemoJobRecord, DemoRole } from "@/lib/careersync-demo";

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
