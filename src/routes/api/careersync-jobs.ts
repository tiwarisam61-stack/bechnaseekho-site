import { createFileRoute } from "@tanstack/react-router";
import type { Database } from "@/integrations/supabase/types";
import type { DemoJobRecord } from "@/lib/careersync-demo";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type JobStatus = DemoJobRecord["status"];

const JOB_STATUSES = new Set<JobStatus>(["approved", "pending", "rejected", "changes_requested"]);

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
          const payload = await request.json();
          const supabaseAdmin = await getSupabaseAdmin();
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

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => clean(item, 80)).filter(Boolean);
}

function normalizeStatus(value: unknown): JobStatus {
  const status = clean(value, 40) as JobStatus;
  if (!JOB_STATUSES.has(status)) throw new Error("Invalid job status.");
  return status;
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
