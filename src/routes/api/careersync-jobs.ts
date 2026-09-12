import { createFileRoute } from "@tanstack/react-router";
import type { Database } from "@/integrations/supabase/types";
import type { DemoApplicationRecord, DemoJobRecord } from "@/lib/careersync-demo";

type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type JobStatus = DemoJobRecord["status"];
type StorageFileInsight = {
  path: string;
  fileName: string;
  folder: string;
  downloadUrl: string | null;
  uploadedAt: string | null;
  size: number | null;
  originalFileName: string | null;
  candidateName: string | null;
  candidateEmail: string | null;
  candidatePhone: string | null;
  candidateCity: string | null;
  candidateExperience: string | null;
  candidateLastRole: string | null;
  source: string | null;
};

const JOB_STATUSES = new Set<JobStatus>(["approved", "pending", "rejected", "changes_requested"]);
const APPLICATION_STATUSES = new Set(["submitted", "under_review", "interview", "offer", "rejected", "withdrawn"]);
const DEFAULT_RESUME_BUCKET = "careersync-resumes";
const APPLICATION_NOTE_LIMIT = 6000;

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
            return Response.json({ applications: applications.map((application) => toDemoApplication(application)) });
          }

          if (url.searchParams.get("resource") === "resume-download") {
            if (role !== "admin") return Response.json({ error: "Admin access required." }, { status: 403 });
            const path = requireStoragePath(url.searchParams.get("path"));
            const fileName = clean(url.searchParams.get("fileName"), 180) || path.split("/").pop() || "resume";
            const signed = await supabaseAdmin.storage
              .from(getResumeBucket())
              .createSignedUrl(path, 60 * 10, { download: fileName });

            if (signed.error) throw signed.error;
            return Response.redirect(signed.data.signedUrl, 302);
          }

          if (url.searchParams.get("resource") === "resume-insights") {
            if (role !== "admin") return Response.json({ error: "Admin access required." }, { status: 403 });
            const insights = await getResumeStorageInsights(supabaseAdmin);
            return Response.json({ resumeInsights: insights });
          }

          let query = supabaseAdmin
            .from("jobs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(200);

          if (role === "company") {
            if (!email) return Response.json({ jobs: [] });
          } else if (role !== "admin") {
            query = query
              .eq("status", "approved")
              .eq("is_active", true)
              .eq("is_verified", true);
          }

          const { data, error } = await query;
          if (error) throw error;

          const jobs = role === "company"
            ? (data ?? []).filter((job) => isCompanyJobMatch(job, email))
            : (data ?? []);

          return Response.json({
            jobs: jobs.map((job) => toDemoJob(job, role === "company" ? userId : null)),
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
              candidateName: clean(formData.get("candidateName"), 160),
              candidateEmail: clean(formData.get("candidateEmail"), 255).toLowerCase(),
              candidatePhone: clean(formData.get("candidatePhone"), 30),
              candidateCity: clean(formData.get("candidateCity"), 120),
              candidateExperience: clean(formData.get("candidateExperience"), 120),
              candidateLastRole: clean(formData.get("candidateLastRole"), 160),
              source: clean(formData.get("source"), 80),
            });
            return Response.json({ resume });
          }

          const payload = await request.json();
          if (payload?.type === "application") {
            const originalUserId = requireText(payload.userId, "userId", 160);
            const application = await applicationPayload(supabaseAdmin, payload);
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
              return Response.json({ application: toDemoApplication(refreshed, originalUserId) });
            }

            const { data, error } = await supabaseAdmin
              .from("applications")
              .insert(application)
              .select("*")
              .single();

            if (error) throw error;
            return Response.json({ application: toDemoApplication(data, originalUserId) });
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
          if (payload?.type === "application-unlock-request") {
            const applicationId = requireUuid(payload.applicationId, "applicationId");
            const supabaseAdmin = await getSupabaseAdmin();
            const { data: existing, error: existingError } = await supabaseAdmin
              .from("applications")
              .select("*")
              .eq("id", applicationId)
              .single();
            if (existingError) throw existingError;

            const nextCoverLetter = appendApplicationMeta(existing.cover_letter, [
              `Unlock Requested: true`,
              `Unlock Status: requested`,
              `Unlock Requested By: ${clean(payload.requestedBy, 120) || "Company recruiter"}`,
              `Unlock Requested At: ${new Date().toISOString()}`,
              `Admin Log: ${new Date().toISOString()} | unlock_requested | ${clean(payload.note, 240) || "Recruiter requested full profile and resume access."}`,
            ]);

            const { data, error } = await supabaseAdmin
              .from("applications")
              .update({ cover_letter: nextCoverLetter, updated_at: new Date().toISOString() })
              .eq("id", applicationId)
              .select("*")
              .single();

            if (error) throw error;
            return Response.json({ application: toDemoApplication(data) });
          }

          if (payload?.type === "application-unlock-review") {
            const applicationId = requireUuid(payload.applicationId, "applicationId");
            const approved = Boolean(payload.approved);
            const supabaseAdmin = await getSupabaseAdmin();
            const { data: existing, error: existingError } = await supabaseAdmin
              .from("applications")
              .select("*")
              .eq("id", applicationId)
              .single();
            if (existingError) throw existingError;

            const status = approved ? "under_review" : existing.status || "submitted";
            const nextCoverLetter = appendApplicationMeta(existing.cover_letter, [
              `Unlock Status: ${approved ? "approved" : "rejected"}`,
              `Unlock Reviewed By: ${clean(payload.reviewedBy, 120) || "CareerSync admin"}`,
              `Unlock Reviewed At: ${new Date().toISOString()}`,
              `Admin Log: ${new Date().toISOString()} | unlock_${approved ? "approved" : "rejected"} | ${clean(payload.note, 240) || (approved ? "Profile sharing approved for recruiter." : "Profile sharing request rejected.")}`,
            ]);

            const { data, error } = await supabaseAdmin
              .from("applications")
              .update({ status, cover_letter: nextCoverLetter, updated_at: new Date().toISOString() })
              .eq("id", applicationId)
              .select("*")
              .single();

            if (error) throw error;
            return Response.json({ application: toDemoApplication(data) });
          }

          if (payload?.type === "application-status") {
            const applicationId = requireUuid(payload.applicationId, "applicationId");
            const status = normalizeApplicationStatus(payload.status);
            const supabaseAdmin = await getSupabaseAdmin();
            const { data: existing, error: existingError } = await supabaseAdmin
              .from("applications")
              .select("cover_letter")
              .eq("id", applicationId)
              .single();
            if (existingError) throw existingError;

            const { data, error } = await supabaseAdmin
              .from("applications")
              .update({
                status,
                cover_letter: appendApplicationMeta(existing.cover_letter, [
                  `Admin Log: ${new Date().toISOString()} | status_${status} | Application moved to ${status}.`,
                ]),
                updated_at: new Date().toISOString(),
              })
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

function toDemoApplication(application: ApplicationRow, displayUserId = application.user_id): DemoApplicationRecord {
  return {
    id: application.id,
    job_id: application.job_id,
    user_id: displayUserId,
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

function requireStoragePath(value: unknown) {
  const path = clean(value, 1000);
  if (!path || path.startsWith("/") || path.includes("\\") || path.split("/").some((segment) => segment === "..")) {
    throw new Error("Invalid resume path.");
  }
  return path;
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

async function applicationPayload(
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>,
  payload: Record<string, unknown>,
) {
  const email = requireText(payload.email, "email", 255).toLowerCase();
  const fullName = requireText(payload.fullName, "fullName", 100);
  const rawUserId = requireText(payload.userId, "userId", 160);

  return {
    job_id: requireUuid(payload.jobId, "jobId"),
    user_id: await resolveApplicationUserId({ supabaseAdmin, userId: rawUserId, email, fullName }),
    full_name: fullName,
    email,
    phone: clean(payload.phone, 30) || null,
    resume_path: clean(payload.resumePath, 500) || null,
    resume_url: clean(payload.resumeUrl, 1000) || null,
    cover_letter: clean(payload.coverLetter, APPLICATION_NOTE_LIMIT) || null,
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
    cover_letter: clean(payload.cover_letter ?? payload.coverLetter, APPLICATION_NOTE_LIMIT) || null,
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

async function resolveApplicationUserId({
  supabaseAdmin,
  userId,
  email,
  fullName,
}: {
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>;
  userId: string;
  email: string;
  fullName: string;
}) {
  if (isUuid(userId)) return userId;

  const existing = await findApplicationUserId({ supabaseAdmin, userId, email });
  if (existing) return existing;

  const created = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: randomAuthPassword(),
    user_metadata: {
      full_name: fullName,
      careersync_external_user_id: userId,
    },
  });

  if (created.error) {
    const message = getErrorMessage(created.error);
    if (/already.*registered|already.*exists|duplicate|email_exists/i.test(message)) {
      const retry = await findApplicationUserId({ supabaseAdmin, userId, email });
      if (retry) return retry;
    }
    throw new Error(`Could not prepare candidate profile in Supabase Auth: ${message}`);
  }

  if (!created.data.user?.id) throw new Error("Supabase Auth did not return a candidate profile id.");
  return created.data.user.id;
}

async function findApplicationUserId({
  supabaseAdmin,
  userId,
  email,
}: {
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>;
  userId: string;
  email: string;
}) {
  if (isUuid(userId)) return userId;
  const normalizedEmail = clean(email, 255).toLowerCase();
  if (!normalizedEmail) return "";

  for (let page = 1; page <= 10; page += 1) {
    const users = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (users.error) throw new Error(`Could not read Supabase Auth users: ${getErrorMessage(users.error)}`);
    const match = users.data.users.find((authUser) => authUser.email?.toLowerCase() === normalizedEmail);
    if (match) return match.id;
    if (users.data.users.length < 1000) break;
  }

  return "";
}

async function uploadResumeFile({
  supabaseAdmin,
  userId,
  file,
  candidateName,
  candidateEmail,
  candidatePhone,
  candidateCity,
  candidateExperience,
  candidateLastRole,
  source,
}: {
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>;
  userId: string;
  file: File;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateCity?: string;
  candidateExperience?: string;
  candidateLastRole?: string;
  source?: string;
}) {
  if (file.size > 5 * 1024 * 1024) throw new Error("Resume must be under 5 MB.");
  const extension = getResumeExtension(file.name);
  const body = new Blob([await file.arrayBuffer()], { type: file.type || "application/octet-stream" });
  const path = `${safePathSegment(userId)}/${Date.now()}-${randomId()}${extension}`;
  const bucket = getResumeBucket();
  const metadata = {
    originalFileName: clean(file.name, 180) || `resume${extension}`,
    candidateName: clean(candidateName, 160),
    candidateEmail: clean(candidateEmail, 255).toLowerCase(),
    candidatePhone: clean(candidatePhone, 30),
    candidateCity: clean(candidateCity, 120),
    candidateExperience: clean(candidateExperience, 120),
    candidateLastRole: clean(candidateLastRole, 160),
    source: clean(source, 80) || "resume-upload",
  };
  let upload = await uploadResumeBlob({
    supabaseAdmin,
    bucket,
    path,
    body,
    contentType: file.type || "application/octet-stream",
    metadata,
  });

  if (upload.error && isMissingStorageBucket(upload.error)) {
    await ensureResumeBucket(supabaseAdmin, bucket);
    upload = await uploadResumeBlob({
      supabaseAdmin,
      bucket,
      path,
      body,
      contentType: file.type || "application/octet-stream",
      metadata,
    });
  }

  if (upload.error) {
    throw new Error(`Could not save resume in Supabase Storage bucket "${bucket}": ${getErrorMessage(upload.error)}`);
  }

  const signed = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 30);

  if (signed.error) {
    throw new Error(`Resume was uploaded, but signed link could not be created from bucket "${bucket}": ${getErrorMessage(signed.error)}`);
  }
  return {
    path,
    url: signed.data.signedUrl,
    name: metadata.originalFileName,
  };
}

function getResumeBucket() {
  return process.env.SUPABASE_RESUME_BUCKET || DEFAULT_RESUME_BUCKET;
}

async function uploadResumeBlob({
  supabaseAdmin,
  bucket,
  path,
  body,
  contentType,
  metadata,
}: {
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>;
  bucket: string;
  path: string;
  body: Blob;
  contentType: string;
  metadata?: Record<string, string>;
}) {
  return supabaseAdmin.storage
    .from(bucket)
    .upload(path, body, {
      contentType,
      upsert: false,
      metadata,
    });
}

async function ensureResumeBucket(supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>, bucket: string) {
  const create = await supabaseAdmin.storage.createBucket(bucket, { public: false });
  if (create.error && !/already exists|duplicate/i.test(getErrorMessage(create.error))) {
    throw new Error(`Could not create Supabase Storage bucket "${bucket}": ${getErrorMessage(create.error)}`);
  }
}

function isMissingStorageBucket(error: unknown) {
  return /bucket not found|not found/i.test(getErrorMessage(error));
}

async function getResumeStorageInsights(supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>) {
  const bucket = getResumeBucket();
  let root = await supabaseAdmin.storage.from(bucket).list("", { limit: 1000 });
  if (root.error && isMissingStorageBucket(root.error)) {
    await ensureResumeBucket(supabaseAdmin, bucket);
    root = await supabaseAdmin.storage.from(bucket).list("", { limit: 1000 });
  }
  if (root.error) throw new Error(`Could not read Supabase Storage bucket "${bucket}": ${getErrorMessage(root.error)}`);

  let storageCount = 0;
  const files: StorageFileInsight[] = [];

  for (const item of root.data ?? []) {
    if (!item.name) continue;
    if (item.metadata) {
      storageCount += 1;
      files.push(await toStorageFileInsight({ supabaseAdmin, bucket, path: item.name, folder: item.name, item }));
      continue;
    }

    const nested = await supabaseAdmin.storage.from(bucket).list(item.name, { limit: 1000 });
    if (nested.error) continue;
    for (const file of nested.data ?? []) {
      if (!file.name || !file.metadata) continue;
      storageCount += 1;
      const path = `${item.name}/${file.name}`;
      files.push(await toStorageFileInsight({ supabaseAdmin, bucket, path, folder: item.name, item: file }));
    }
  }

  const sortedFiles = files.sort((a, b) => ((a.uploadedAt ?? "") < (b.uploadedAt ?? "") ? 1 : -1));

  return {
    bucket,
    storageCount,
    samplePaths: sortedFiles.map((file) => file.path).slice(0, 100),
    storageFiles: sortedFiles.slice(0, 200),
    checkedAt: new Date().toISOString(),
  };
}

async function toStorageFileInsight({
  supabaseAdmin,
  bucket,
  path,
  folder,
  item,
}: {
  supabaseAdmin: Awaited<ReturnType<typeof getSupabaseAdmin>>;
  bucket: string;
  path: string;
  folder: string;
  item: { name: string; updated_at?: string | null; created_at?: string | null; metadata?: Record<string, unknown> | null };
}): Promise<StorageFileInsight> {
  const info = await supabaseAdmin.storage.from(bucket).info(path);
  const detailed = info.error ? null : (info.data as unknown as Record<string, unknown>);
  const detailedMetadata = detailed?.metadata && typeof detailed.metadata === "object" && !Array.isArray(detailed.metadata)
    ? (detailed.metadata as Record<string, unknown>)
    : null;
  const metadata = { ...(item.metadata ?? {}), ...(detailedMetadata ?? {}) };
  const itemSize = typeof item.metadata?.size === "number" ? item.metadata.size : null;
  const detailedSize = typeof detailed?.size === "number" ? detailed.size : null;

  return {
    path,
    fileName: item.name,
    folder,
    downloadUrl: null,
    uploadedAt: item.updated_at ?? item.created_at ?? getStorageDateText(detailed, "lastModified") ?? getStorageDateText(detailed, "createdAt") ?? null,
    size: itemSize ?? detailedSize,
    originalFileName: getStorageMetadataText(metadata, "originalFileName"),
    candidateName: getStorageMetadataText(metadata, "candidateName"),
    candidateEmail: getStorageMetadataText(metadata, "candidateEmail"),
    candidatePhone: getStorageMetadataText(metadata, "candidatePhone"),
    candidateCity: getStorageMetadataText(metadata, "candidateCity"),
    candidateExperience: getStorageMetadataText(metadata, "candidateExperience"),
    candidateLastRole: getStorageMetadataText(metadata, "candidateLastRole"),
    source: getStorageMetadataText(metadata, "source"),
  };
}

function getStorageMetadataText(metadata: Record<string, unknown> | null | undefined, key: string) {
  if (!metadata) return null;
  const direct = metadata[key];
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const nested = metadata.metadata;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    const value = (nested as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function getStorageDateText(value: Record<string, unknown> | null | undefined, key: string) {
  const raw = value?.[key];
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
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
  let jobQuery = supabaseAdmin.from("jobs").select("id, company, recruiter_email").limit(200);
  if (role === "company") {
    if (!email) return [];
  } else if (role !== "admin") {
    if (!userId && !email) return [];
    const resolvedUserId = await findApplicationUserId({ supabaseAdmin, userId, email });
    if (!resolvedUserId) return [];
    const applicationQuery = supabaseAdmin
      .from("applications")
      .select("*")
      .eq("user_id", resolvedUserId)
      .order("created_at", { ascending: false })
      .limit(200);
    const { data, error } = await applicationQuery;
    if (error) throw error;
    return (data ?? []).map((application) => ({
      ...application,
      user_id: userId || application.user_id,
    }));
  }

  const { data: jobs, error: jobsError } = await jobQuery;
  if (jobsError) throw jobsError;
  const companyJobs = role === "company"
    ? (jobs ?? []).filter((job) => isCompanyJobMatch(job as Pick<JobRow, "company" | "recruiter_email">, email))
    : (jobs ?? []);
  const jobIds = companyJobs.map((job) => job.id).filter(Boolean);
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

function isCompanyJobMatch(job: Pick<JobRow, "company" | "recruiter_email">, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return false;
  const recruiterEmail = (job.recruiter_email ?? "").trim().toLowerCase();
  if (recruiterEmail && recruiterEmail === normalizedEmail) return true;

  const domain = getCompanyEmailDomain(normalizedEmail);
  if (!domain) return false;
  const recruiterDomain = getCompanyEmailDomain(recruiterEmail);
  if (recruiterDomain && recruiterDomain === domain) return true;

  const companyKey = normalizeCompanyKey(job.company);
  return Boolean(companyKey && companyKey === normalizeCompanyKey(domain));
}

function getCompanyEmailDomain(email: string) {
  const domain = email.split("@")[1]?.trim().toLowerCase() ?? "";
  if (!domain || FREE_EMAIL_DOMAINS.has(domain)) return "";
  return domain.replace(/^www\./, "");
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "rediffmail.com",
  "proton.me",
]);

function normalizeCompanyKey(value: string | null) {
  return (value ?? "")
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\.(co\.in|com|in|net|org|io)$/i, "")
    .replace(/[^a-z0-9]+/g, "");
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

function appendApplicationMeta(current: string | null, lines: string[]) {
  const visibleText = (current ?? "").trim();
  const replaceLabels = new Set(
    lines
      .map((line) => line.split(":")[0]?.trim().toLowerCase())
      .filter((label) => label && label !== "admin log"),
  );
  const withoutOldMeta = visibleText
    .split("\n")
    .filter((line) => {
      const label = line.split(":")[0]?.trim().toLowerCase() ?? "";
      return !replaceLabels.has(label);
    })
    .join("\n")
    .trim();
  return [withoutOldMeta, ...lines].filter(Boolean).join("\n").slice(0, APPLICATION_NOTE_LIMIT);
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

function randomAuthPassword() {
  return `CareerSync-${randomId()}-${Date.now()}!`;
}

function safePathSegment(value: string) {
  return value.replace(/[^a-z0-9_-]/gi, "-").slice(0, 120) || "candidate";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function requireUuid(value: unknown, label: string) {
  const text = clean(value, 80);
  if (!isUuid(text)) {
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
