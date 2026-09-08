import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Loader2, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { canPostJobs, getRoleLabel } from "@/lib/careersync-rbac";
import { z } from "zod";
import {
  createCareerSyncJob,
  getCareerSyncJob,
  getCareerSyncUser,
  updateCareerSyncJob,
} from "@/services/careersync/careersync-service";

const searchSchema = z.object({
  jobId: z.string().optional(),
});

export const Route = createFileRoute("/post-job")({
  validateSearch: searchSchema,
  component: PostJobPage,
  head: () => ({
    meta: [
      { title: "Post a Job — CareerSync" },
      { name: "description", content: "Company recruiters can post a new job opening for review and publishing." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"] as const;
const EXPERIENCE_LEVELS = ["Entry", "Junior", "Mid-level", "Senior", "Lead", "Executive"] as const;

function PostJobPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/post-job" });
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  const [role_, setRoleField] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<(typeof EMPLOYMENT_TYPES)[number]>("Full-time");
  const [experience, setExperience] = useState<(typeof EXPERIENCE_LEVELS)[number]>("Mid-level");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingJob, setLoadingJob] = useState(false);

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) {
      toast.error("Log in to your CareerSync account to continue posting a job.");
      navigate({ to: "/login", search: { role: "company" } });
      return;
    }
    if (!canPostJobs(role)) {
      toast.error("Job posting is available for Recruiter and Admin accounts. Please use an authorized account to continue.");
      navigate({ to: "/careersync" });
      return;
    }
    // Prefill company name from profile
    (async () => {
      if (search.jobId) {
        setLoadingJob(true);
        const data = getCareerSyncJob(search.jobId);
        if (data && data.posted_by === user.id) {
          setRoleField(String(data.role ?? ""));
          setCompany(String(data.company ?? ""));
          setLocation(String(data.location ?? ""));
          setEmploymentType((data.employment_type as (typeof EMPLOYMENT_TYPES)[number]) ?? "Full-time");
          setExperience((data.experience as (typeof EXPERIENCE_LEVELS)[number]) ?? "Mid-level");
          setSalary(String(data.salary ?? ""));
          setDescription(String(data.description ?? ""));
          setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
        }
        setLoadingJob(false);
        return;
      }
      const profile = getCareerSyncUser(user.id);
      if (profile?.company_name) setCompany(profile.company_name);
    })();
  }, [authLoading, roleLoading, role, user, navigate, search.jobId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const jobPayload = {
      role: role_,
      company,
      location,
      employment_type: employmentType,
      experience,
      salary,
      description,
      tags: tagArray,
      status: "pending" as const,
      posted_by: user.id,
      is_active: true,
    };
    let error: Error | null = null;
    try {
      if (search.jobId) {
        await updateCareerSyncJob(search.jobId, {
          role: jobPayload.role,
          company: jobPayload.company,
          location: jobPayload.location,
          employmentType: jobPayload.employment_type,
          experience: jobPayload.experience,
          salary: jobPayload.salary,
          description: jobPayload.description,
          tags: jobPayload.tags,
          postedBy: user.id,
        });
      } else {
        await createCareerSyncJob({
          role: jobPayload.role,
          company: jobPayload.company,
          location: jobPayload.location,
          employmentType: jobPayload.employment_type,
          experience: jobPayload.experience,
          salary: jobPayload.salary,
          description: jobPayload.description,
          tags: jobPayload.tags,
          postedBy: user.id,
        });
      }
    } catch (caught) {
      error = caught instanceof Error ? caught : new Error("Could not save job.");
    }
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(search.jobId ? "Job updated and sent back for review." : "Job submitted! It will appear publicly once approved.");
    navigate({ to: "/careersync" });
  };

  if (authLoading || roleLoading || loadingJob || !user || !canPostJobs(role)) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-white">
      <header className="mx-auto max-w-4xl px-6 pt-8">
        <Link to="/careersync" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1a2a4a]">
          <ArrowLeft className="h-4 w-4" /> Back to CareerSync
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5 sm:p-10"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#1a2a4a]">Post a new job</h1>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{getRoleLabel(role)} access</p>
              <p className="text-sm text-gray-500">{search.jobId ? "Update your listing and send it back for review." : "Your listing will be reviewed and then published to CareerSync."}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Job title *" className="sm:col-span-2">
              <input required value={role_} onChange={(e) => setRoleField(e.target.value)}
                placeholder="Senior React Developer" className={inputCls} />
            </FormField>

            <FormField label="Company name *">
              <input required value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Technologies" className={inputCls} />
            </FormField>

            <FormField label="Location *">
              <input required value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru, India / Remote" className={inputCls} />
            </FormField>

            <FormField label="Employment type">
              <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as any)} className={inputCls}>
                {EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </FormField>

            <FormField label="Experience level">
              <select value={experience} onChange={(e) => setExperience(e.target.value as any)} className={inputCls}>
                {EXPERIENCE_LEVELS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </FormField>

            <FormField label="Salary range *" className="sm:col-span-2">
              <input required value={salary} onChange={(e) => setSalary(e.target.value)}
                placeholder="₹12 – 18 LPA" className={inputCls} />
            </FormField>

            <FormField label="Skills / tags (comma-separated)" className="sm:col-span-2">
              <input value={tags} onChange={(e) => setTags(e.target.value)}
                placeholder="React, TypeScript, Node.js" className={inputCls} />
            </FormField>

            <FormField label="Job description *" className="sm:col-span-2">
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)}
                rows={7} placeholder="Responsibilities, requirements, perks…"
                className={`${inputCls} resize-y font-sans leading-relaxed`} />
            </FormField>

            <div className="sm:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link to="/careersync"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50">
                Cancel
              </Link>
              <button type="submit" disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                {saving ? "Submitting…" : search.jobId ? "Resubmit for review" : "Submit for review"}
              </button>
            </div>
          </form>

          <p className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-800">
            🔒 Your job data is stored securely. Only you (and moderators) can see it until it's approved and published.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1a2a4a] outline-none ring-blue-500/20 transition focus:border-blue-500 focus:ring-4";

function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      {children}
    </label>
  );
}
