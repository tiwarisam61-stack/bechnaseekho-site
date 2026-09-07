import { createFileRoute } from "@tanstack/react-router";
import type { Database } from "@/integrations/supabase/types";
import type { DemoApplicationRecord, DemoJobRecord } from "@/lib/careersync-demo";

type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type JobStatus = DemoJobRecord["status"];

const JOB_STATUSES = new Set<JobStatus>(["approved", "pending", "rejected", "changes_requested"]);
const APPLICATION_STATUSES = new Set(["submitted", "under_review", "interview", "offer", "rejected", "withdrawn"]);
const RESUME_BUCKET = process.env.SUPABASE_RESUME_BUCKET || "careersync-resumes";

export const Route = createFileRoute("/api/careersync-jobs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const role = url.searchParams.get("role");
          const email = clean(url.searchParams.get("email"), 255).toLowerCase();
          const userId = clean(url.searchParams.get("userId"), 160);
          const supabaseAdmin = await getSupabaseAdmin();

          if (url.searchParams.get("resource") === "applications") {
            const applications = await listApplicationsForRole({ supabaseAdmin, role, email, userId });
            return Response.json({ applications: applications.map(toDemoApplication) });
          }

          let query = supabaseAdmin
            .from("jobs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(200);

          if (role === "company") {
            if (!email) return Response.json({ jobs: [] });
            query = query.eq("recruiter_email", email);
          } else if (role !== "admin") {
            query = query
              .eq("status", "approved")
              .eq("is_active", true)
              .eq("is_verified", true);
          }

          const { data, error } = await query;
          if (error) throw error;

          return Response.json({
            jobs: (data ?? []).map((job) => toDemoJob(job, role === "company" ? userId : null)),
          });
        } catch (error) {
          return sharedJobError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const supabaseAdmin = await getSupabaseAdmin();
          const contentType = request.headers.get("content-type") ?? "";
          if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            const file = formData.get("file");
            if (!(file instanceof File)) throw new Error("Missing required field: file");
            const resume = await uploadResumeFile({
              supabaseAdmin,
              userId: requireText(formData.get("userId"), "userId", 160),
              file,
            });
            return Response.json({ resume });
          }

          const payload = await request.json();
          if (payload?.type === "application") {
            const application = applicationPayload(payload);
            const { data: existing, error: existingError } = await supabaseAdmin
              .from("applications")
              .select("*")
              .eq("job_id", application.job_id)
              .eq("user_id", application.user_id)
              .maybeSingle();

            if (existingError) throw existingError;
            if (existing) {
              const { data: refreshed, error: refreshError } = await supabaseAdmin
                .from("applications")
                .update({
                  full_name: application.full_name,
                  email: application.email,
                  phone: application.phone,
                  resume_path: application.resume_path,
                  resume_url: application.resume_url,
                  cover_letter: application.cover_letter,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id)
                .select("*")
                .single();
              if (refreshError) throw refreshError;
              return Response.json({ application: toDemoApplication(refreshed) });
            }

            const { data, error } = await supabaseAdmin
              .from("applications")
              .insert(application)
              .select("*")
              .single();

            if (error) throw error;
            return Response.json({ application: toDemoApplication(data) });
          }

          if (payload?.type === "repair-applications") {
            const result = await repairApplications(supabaseAdmin, payload.applications);
            return Response.json(result);
          }

          const recruiterEmail = clean(payload.recruiterEmail, 255).toLowerCase();

          const { data, error } = await supabaseAdmin
            .from("jobs")
            .insert({
              ...jobPayload(payload),
              status: "pending",
              is_active: true,
              is_verified: false,
              recruiter_email: recruiterEmail || null,
              posted_by: null,
            })
            .select("*")
            .single();

          if (error) throw error;
          return Response.json({ job: toDemoJob(data, clean(payload.localOwnerId, 160) || null) });
        } catch (error) {
          return sharedJobError(error);
        }
      },
      PUT: async ({ request }) => {
        try {
          const payload = await request.json();
          const jobId = requireUuid(payload.jobId, "jobId");
          const supabaseAdmin = await getSupabaseAdmin();
          const recruiterEmail = clean(payload.recruiterEmail, 255).toLowerCase();

          const { data, error } = await supabaseAdmin
            .from("jobs")
            .update({
              ...jobPayload(payload),
              status: "pending",
              is_active: true,
              is_verified: false,
              recruiter_email: recruiterEmail || null,
            })
            .eq("id", jobId)
            .select("*")
            .single();

          if (error) throw error;
          return Response.json({ job: toDemoJob(data, clean(payload.localOwnerId, 160) || null) });
        } catch (error) {
          return sharedJobError(error);
        }
      },
      PATCH: async ({ request }) => {
        try {
          const payload = await request.json();
          if (payload?.type === "application-status") {
            const applicationId = requireUuid(payload.applicationId, "applicationId");
            const status = normalizeApplicationStatus(payload.status);
            const supabaseAdmin = await getSupabaseAdmin();
            const { data, error } = await supabaseAdmin
              .from("applications")
              .update({ status, updated_at: new Date().toISOString() })
              .eq("id", applicationId)
              .select("*")
              .single();

            if (error) throw error;
            return Response.json({ application: toDemoApplication(data) });
          }

          const jobId = requireUuid(payload.jobId, "jobId");
          const status = normalizeStatus(payload.status);
          const supabaseAdmin = await getSupabaseAdmin();

          const { data, error } = await supabaseAdmin
            .from("jobs")
            .update({
              status,
              is_verified: status === "approved",
              is_active: status !== "rejected",
            })
            .eq("id", jobId)
            .select("*")
            .single();

          if (error) throw error;
          return Response.json({ job: toDemoJob(data, null) });
        } catch (error) {
          return sharedJobError(error);
        }
      },
    },
  },
});

async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function toDemoJob(job: JobRow, localOwnerId: string | null): DemoJobRecord {
  const status = normalizeStatus(job.status);
  return {
    id: job.id,
    external_id: job.external_id,
    role: job.role,
    company: job.company,
    logo: job.logo,
    location: job.location,
    experience: job.experience,
    salary: job.salary,
    employment_type: job.employment_type,
    description: job.description,
    tags: job.tags ?? [],
    created_at: job.created_at,
    updated_at: job.updated_at,
    is_verified: Boolean(job.is_verified),
    is_active: Boolean(job.is_active),
    status,
    industry: job.industry,
    shift: job.shift,
    open_positions: job.open_positions,
    responsibilities: job.responsibilities ?? [],
    required_skills: job.required_skills ?? [],
    preferred_skills: job.preferred_skills ?? [],
    benefits: job.benefits ?? [],
    office_address: job.office_address,
    company_overview: job.company_overview,
    company_website: job.company_website,
    recruiter_whatsapp: job.recruiter_whatsapp,
    recruiter_email: job.recruiter_email,
    recruiter_notes: job.recruiter_notes,
    application_deadline: job.application_deadline,
    posted_by: localOwnerId,
  };
}

function toDemoApplication(application: ApplicationRow): DemoApplicationRecord {
  return {
    id: application.id,
    job_id: application.job_id,
    user_id: application.user_id,
    full_name: application.full_name,
    email: application.email,
    phone: application.phone,
    resume_path: application.resume_path,
    resume_url: application.resume_url,
    cover_letter: application.cover_letter,
    status: application.status,
    created_at: application.created_at,
    updated_at: application.updated_at,
  };
}

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function requireText(value: unknown, label: string, max: number) {
  const text = clean(value, max);
  if (!text) throw new Error(`Missing required field: ${label}`);
  return text;
}

function jobPayload(payload: Record<string, unknown>) {
  return {
    role: requireText(payload.role, "role", 120),
    company: requireText(payload.company, "company", 120),
    location: requireText(payload.location, "location", 120),
    employment_type: requireText(payload.employmentType, "employmentType", 80),
    experience: requireText(payload.experience, "experience", 80),
    salary: requireText(payload.salary, "salary", 120),
    description: requireText(payload.description, "description", 5000),
    tags: toStringArray(payload.tags).slice(0, 12),
    industry: clean(payload.industry, 120) || null,
    open_positions: typeof payload.openPositions === "number" && Number.isFinite(payload.openPositions)
      ? Math.max(1, Math.round(payload.openPositions))
      : null,
    responsibilities: toStringArray(payload.responsibilities).slice(0, 12),
    required_skills: toStringArray(payload.requiredSkills).slice(0, 12),
    preferred_skills: toStringArray(payload.preferredSkills).slice(0, 12),
    application_deadline: clean(payload.applicationDeadline, 40) || null,
  };
}

function applicationPayload(payload: Record<string, unknown>) {
  return {
    job_id: requireUuid(payload.jobId, "jobId"),
    user_id: requireText(payload.userId, "userId", 160),
    full_name: requireText(payload.fullName, "fullName", 100),
    email: requireText(payload.email, "email", 255).toLowerCase(),
    phone: clean(payload.phone, 30) || null,
    resume_path: clean(payload.resumePath, 500) || null,
    resume_url: clean(payload.resumeUrl, 1000) || null,
    cover_letter: clean(payload.coverLetter, 1500) || null,
    status: "submitted",
  };
}

function repairApplicationPayload(payload: Record<string, unknown>) {
  return {
    job_id: requireUuid(payload.job_id ?? payload.jobId, "jobId"),
    user_id: requireText(payload.user_id ?? payload.userId, "userId", 160),
    full_name: requireText(payload.full_name ?? payload.fullName, "fullName", 100),
    email: requireText(payload.email, "email", 255).toLowerCase(),
    phone: clean(payload.phone, 30) || null,
    resume_path: clean(payload.resume_path ?? payload.resumePath, 500) || null,
    resume_url: clean(payload.resume_url ?? payload.resumeUrl, 1000) || null,
    cover_letter: clean(payload.cover_letter ?? payload.coverLetter, 1500) || null,
    status: normalizeApplicationStatus(payload.status || "submitted"),
  };
}

async function repairApplications(
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>,
  value: unknown,
) {
  if (!Array.isArray(value)) throw new Error("Missing required field: applications");
  const repaired: DemoApplicationRecord[] = [];
  let inserted = 0;
  let skipped = 0;

  for (const item of value.slice(0, 500)) {
    if (!item || typeof item !== "object") {
      skipped += 1;
      continue;
    }

    let application: ReturnType<typeof repairApplicationPayload>;
    try {
      application = repairApplicationPayload(item as Record<string, unknown>);
    } catch {
      skipped += 1;
      continue;
    }
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("job_id", application.job_id)
      .eq("user_id", application.user_id)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing) {
      repaired.push(toDemoApplication(existing));
      skipped += 1;
      continue;
    }

    const { data, error } = await supabaseAdmin
      .from("applications")
      .insert(application)
      .select("*")
      .single();
    if (error) throw error;
    repaired.push(toDemoApplication(data));
    inserted += 1;
  }

  return { inserted, skipped, applications: repaired };
}

async function uploadResumeFile({
  supabaseAdmin,
  userId,
  file,
}: {
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>;
  userId: string;
  file: File;
}) {
  if (file.size > 5 * 1024 * 1024) throw new Error("Resume must be under 5 MB.");
  const extension = getResumeExtension(file.name);
  const body = new Blob([await file.arrayBuffer()], { type: file.type || "application/octet-stream" });
  const path = `${safePathSegment(userId)}/${Date.now()}-${randomId()}${extension}`;
  const upload = await supabaseAdmin.storage
    .from(RESUME_BUCKET)
    .upload(path, body, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (upload.error) throw upload.error;

  const signed = await supabaseAdmin.storage
    .from(RESUME_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 30);

  if (signed.error) throw signed.error;
  return {
    path,
    url: signed.data.signedUrl,
    name: clean(file.name, 180) || `resume${extension}`,
  };
}

async function listApplicationsForRole({
  supabaseAdmin,
  role,
  email,
  userId,
}: {
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>;
  role: string | null;
  email: string;
  userId: string;
}) {
  let jobQuery = supabaseAdmin.from("jobs").select("id").limit(200);
  if (role === "company") {
    if (!email) return [];
    jobQuery = jobQuery.eq("recruiter_email", email);
  } else if (role !== "admin") {
    if (!userId) return [];
    const applicationQuery = supabaseAdmin
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200);
    const { data, error } = await applicationQuery;
    if (error) throw error;
    return data ?? [];
  }

  const { data: jobs, error: jobsError } = await jobQuery;
  if (jobsError) throw jobsError;
  const jobIds = (jobs ?? []).map((job) => job.id).filter(Boolean);
  if (!jobIds.length) return [];

  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .in("job_id", jobIds)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return data ?? [];
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => clean(item, 80)).filter(Boolean);
}

function normalizeStatus(value: unknown): JobStatus {
  const status = clean(value, 40) as JobStatus;
  if (!JOB_STATUSES.has(status)) throw new Error("Invalid job status.");
  return status;
}

function normalizeApplicationStatus(value: unknown) {
  const status = clean(value, 40).toLowerCase().replace(/[\s-]+/g, "_");
  if (!APPLICATION_STATUSES.has(status)) throw new Error("Invalid application status.");
  return status;
}

function getResumeExtension(name: string) {
  const match = clean(name, 220).toLowerCase().match(/\.(pdf|doc|docx)$/);
  if (!match) throw new Error("Only PDF or Word resumes are allowed.");
  return `.${match[1]}`;
}

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 12);
}

function safePathSegment(value: string) {
  return value.replace(/[^a-z0-9_-]/gi, "-").slice(0, 120) || "candidate";
}

function requireUuid(value: unknown, label: string) {
  const text = clean(value, 80);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) {
    throw new Error(`Invalid ${label}.`);
  }
  return text;
}

function sharedJobError(error: unknown) {
  const message = getErrorMessage(error);
  const status = /missing supabase/i.test(message) ? 503 : /missing|required|invalid/i.test(message) ? 400 : 500;
  return Response.json({ error: message }, { status });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const record = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
    const parts = [record.message, record.details, record.hint, record.code]
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
    if (parts.length) return parts.join(" ");
  }
  return "CareerSync jobs API failed.";
}
