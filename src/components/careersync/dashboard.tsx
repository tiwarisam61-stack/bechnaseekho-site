import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CircleAlert, Clock3, FileText, Layers3, MessageSquareText, PlusCircle, RefreshCw, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import {
    approveDemoJob,
    getDashboardSummary,
    getCareerSyncCandidateProgress,
    getDemoDisplayName,
    getDemoSavedJobIds,
    getDemoUserById,
    rejectDemoJob,
    requestDemoJobChanges,
    updateDemoApplicationStatus,
    useDemoSnapshot,
    addDemoTimesheetEntry,
    getDemoEmployeeSnapshot,
    mergeSharedCareerSyncJobs,
    type DemoJobRecord,
} from "@/services/careersync/careersync-service";
import { buildJobSheetPayload, submitToGoogleSheet } from "@/lib/google-sheet-submit";
import { fetchSharedCareerSyncResumeInsights, reviewSharedCareerSyncJob } from "@/lib/careersync-jobs-api";

type CandidateDashboardProfile = {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    experience: string;
};

type AdminDashboardDrilldown = "approved-jobs" | "pending-jobs" | "total-resumes" | "unread-notifications";

type AdminDashboardResumeFile = {
    path: string;
    fileName: string;
    folder: string;
    downloadUrl: string | null;
    uploadedAt: string | null;
    size: number | null;
    originalFileName?: string | null;
    candidateName?: string | null;
    candidateEmail?: string | null;
    candidatePhone?: string | null;
    candidateCity?: string | null;
    candidateExperience?: string | null;
    candidateLastRole?: string | null;
    source?: string | null;
};

export function CareerSyncDashboard() {
    const { user } = useAuth();
    const { role, isAdmin, isCompany, isEmployee, isCandidate } = useRole();
    const snapshot = useDemoSnapshot();
    const displayName = user?.id ? getDemoDisplayName(user.id) : "Candidate";
    const summary = useMemo(() => getDashboardSummary(user?.id ?? null), [snapshot, user?.id]);
    const candidateProgress = useMemo(() => user?.id ? getCareerSyncCandidateProgress(user.id) : null, [snapshot, user?.id]);
    const candidateSavedJobCount = useMemo(() => user?.id ? getDemoSavedJobIds(user.id).length : 0, [snapshot, user?.id]);
    const [candidateProfileVersion, setCandidateProfileVersion] = useState(0);
    const [adminResumeStorageCount, setAdminResumeStorageCount] = useState<number | null>(null);
    const [adminResumeStorageCheckedAt, setAdminResumeStorageCheckedAt] = useState<string | null>(null);
    const [adminResumeStorageFiles, setAdminResumeStorageFiles] = useState<AdminDashboardResumeFile[]>([]);
    const [adminResumeStorageLoading, setAdminResumeStorageLoading] = useState(false);
    const [activeAdminDrilldown, setActiveAdminDrilldown] = useState<AdminDashboardDrilldown | null>(null);
    const adminApprovedJobs = useMemo(() => snapshot.jobs.filter((job) => job.status === "approved" && job.is_active && job.is_verified), [snapshot.jobs]);
    const adminPendingJobs = useMemo(() => snapshot.jobs.filter((job) => job.status === "pending"), [snapshot.jobs]);
    const adminUnreadNotifications = useMemo(() => summary.notifications.filter((notification) => !notification.read_at), [summary.notifications]);
    const adminResumeFallbackFiles = useMemo<AdminDashboardResumeFile[]>(() => snapshot.applications
        .filter((application) => Boolean(application.resume_url || application.resume_path))
        .map((application) => ({
            path: application.resume_path ?? application.resume_url ?? application.id,
            fileName: getResumeFileName(application.resume_path ?? application.resume_url ?? "Uploaded resume"),
            folder: "applications",
            downloadUrl: application.resume_url,
            uploadedAt: application.created_at,
            size: null,
            candidateName: application.full_name,
            candidateEmail: application.email,
            candidatePhone: application.phone,
            candidateCity: null,
            candidateExperience: null,
            candidateLastRole: snapshot.jobs.find((job) => job.id === application.job_id)?.role ?? null,
            source: "application",
        })), [snapshot.applications, snapshot.jobs]);
    const adminResumeDetailFiles = adminResumeStorageFiles.length > 0 ? adminResumeStorageFiles : adminResumeFallbackFiles;
    const liveCandidateProgress = useMemo(() => {
        if (!user?.id || !candidateProgress) return candidateProgress;
        const userRecord = getDemoUserById(user.id);
        const latestApplication = snapshot.applications
            .filter((application) => application.user_id === user.id)
            .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))[0];
        let storedProfile: Partial<CandidateDashboardProfile> = {};
        if (typeof window !== "undefined") {
            try {
                storedProfile = JSON.parse(window.localStorage.getItem(`careersync-candidate-profile-${user.id}`) ?? "{}");
            } catch {
                storedProfile = {};
            }
        }
        const fullName = storedProfile.fullName ?? latestApplication?.full_name ?? userRecord?.full_name ?? displayName;
        const email = storedProfile.email ?? latestApplication?.email ?? user.email ?? userRecord?.email ?? "";
        const phone = storedProfile.phone ?? latestApplication?.phone ?? userRecord?.phone ?? "";
        const city = storedProfile.city ?? "";
        const experience = storedProfile.experience ?? "";
        const hasName = fullName.trim().length > 1;
        const hasPhone = phone.replace(/\D/g, "").length >= 8;
        const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        const hasCity = city.trim().length > 1 && city.trim().toLowerCase() !== "not shared";
        const hasExperience = experience.trim().length > 0 && experience.trim().toLowerCase() !== "not shared";
        const completion =
            (hasName ? 15 : 0) +
            (hasPhone ? 15 : 0) +
            (hasEmail ? 10 : 0) +
            (hasCity ? 10 : 0) +
            (hasExperience ? 15 : 0) +
            (candidateProgress.hasResume ? 20 : 0) +
            (candidateProgress.totalApplications > 0 ? 15 : 0);
        return {
            ...candidateProgress,
            profileCompletion: Math.max(0, Math.min(100, completion)),
        };
    }, [candidateProgress, candidateProfileVersion, displayName, snapshot.applications, user?.email, user?.id]);

    const refreshAdminResumeStorageCount = async (showToast = true) => {
        if (!user?.id || !isAdmin) return;
        setAdminResumeStorageLoading(true);
        try {
            const insight = await fetchSharedCareerSyncResumeInsights({ role: "admin", userId: user.id, email: user.email });
            setAdminResumeStorageCount(insight?.storageCount ?? null);
            setAdminResumeStorageCheckedAt(insight?.checkedAt ?? new Date().toISOString());
            setAdminResumeStorageFiles(insight?.storageFiles ?? []);
            if (showToast) toast.success("Supabase resume count refreshed.");
        } catch (error) {
            setAdminResumeStorageCount(null);
            setAdminResumeStorageFiles([]);
            if (showToast) toast.error(error instanceof Error ? error.message : "Could not refresh Supabase resume count.");
        } finally {
            setAdminResumeStorageLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.id || !isAdmin) {
            setAdminResumeStorageCount(null);
            setAdminResumeStorageCheckedAt(null);
            return;
        }

        let cancelled = false;
        setAdminResumeStorageLoading(true);
        void fetchSharedCareerSyncResumeInsights({ role: "admin", userId: user.id, email: user.email })
            .then((insight) => {
                if (!cancelled) {
                    setAdminResumeStorageCount(insight?.storageCount ?? null);
                    setAdminResumeStorageCheckedAt(insight?.checkedAt ?? new Date().toISOString());
                    setAdminResumeStorageFiles(insight?.storageFiles ?? []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setAdminResumeStorageCount(null);
                    setAdminResumeStorageFiles([]);
                }
            })
            .finally(() => {
                if (!cancelled) setAdminResumeStorageLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isAdmin, user?.email, user?.id]);

    useEffect(() => {
        if (!user?.id || !isCandidate || typeof window === "undefined") return;
        const refreshCandidateProgress = () => setCandidateProfileVersion((version) => version + 1);
        window.addEventListener("careersync-candidate-profile-updated", refreshCandidateProgress);
        window.addEventListener("storage", refreshCandidateProgress);
        return () => {
            window.removeEventListener("careersync-candidate-profile-updated", refreshCandidateProgress);
            window.removeEventListener("storage", refreshCandidateProgress);
        };
    }, [isCandidate, user?.id]);

    if (!user || !role) return null;
    const notifications = summary.notifications.slice(0, 4);

    return (
        <section id="dashboard" className="relative scroll-mt-28 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-[2rem] border border-blue-100 bg-white/85 p-5 shadow-[0_24px_70px_-32px_rgba(37,99,235,0.35)] backdrop-blur-xl sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-blue-600">Your Dashboard</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A] sm:text-3xl">
                            Welcome back, {displayName}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                            This is the local demo workspace. Approvals, notifications, and application status changes are stored in your browser so you can test the flow end to end.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {isAdmin && <RolePill tone="blue" label="Admin review mode" />}
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => void refreshAdminResumeStorageCount()}
                                disabled={adminResumeStorageLoading}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${adminResumeStorageLoading ? "animate-spin" : ""}`} />
                                Refresh resumes
                            </button>
                        )}
                        {isCompany && <RolePill tone="emerald" label="HR / company mode" />}
                        {isEmployee && <RolePill tone="amber" label="Employee mode" />}
                        {isCandidate && <RolePill tone="cyan" label="Candidate mode" />}
                    </div>
                </div>

                {isCandidate ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard title="My applications" value={String(summary.myApplications.length)} note="Jobs you applied for" icon={<UserRound className="h-4 w-4" />} />
                        <MetricCard title="Saved jobs" value={String(candidateSavedJobCount)} note="Roles on your shortlist" icon={<Sparkles className="h-4 w-4" />} />
                        <MetricCard title="Profile strength" value={`${liveCandidateProgress?.profileCompletion ?? 0}%`} note="Name, phone, experience, resume" icon={<ShieldCheck className="h-4 w-4" />} />
                        <MetricCard title="Unread notifications" value={String(summary.unreadNotifications)} note="Updates from CareerSync" icon={<MessageSquareText className="h-4 w-4" />} />
                    </div>
                ) : (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                            title="Approved jobs"
                            value={String(summary.totalJobs)}
                            note="Visible on the public board"
                            icon={<Sparkles className="h-4 w-4" />}
                            active={activeAdminDrilldown === "approved-jobs"}
                            onClick={isAdmin ? () => setActiveAdminDrilldown((current) => current === "approved-jobs" ? null : "approved-jobs") : undefined}
                        />
                        <MetricCard
                            title="Pending jobs"
                            value={String(summary.pendingJobs)}
                            note="Waiting for approval"
                            icon={<Clock3 className="h-4 w-4" />}
                            active={activeAdminDrilldown === "pending-jobs"}
                            onClick={isAdmin ? () => setActiveAdminDrilldown((current) => current === "pending-jobs" ? null : "pending-jobs") : undefined}
                        />
                        {isAdmin ? (
                            <MetricCard
                                title="Total resumes"
                                value={String(adminResumeStorageCount ?? summary.totalResumes)}
                                note={adminResumeStorageCheckedAt ? `Supabase count · ${new Date(adminResumeStorageCheckedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}` : "Saved in Supabase Storage"}
                                icon={<FileText className="h-4 w-4" />}
                                active={activeAdminDrilldown === "total-resumes"}
                                onClick={() => setActiveAdminDrilldown((current) => current === "total-resumes" ? null : "total-resumes")}
                            />
                        ) : (
                            <MetricCard title="My applications" value={String(summary.myApplications.length)} note="Candidate activity" icon={<UserRound className="h-4 w-4" />} />
                        )}
                        <MetricCard
                            title="Unread notifications"
                            value={String(summary.unreadNotifications)}
                            note="New local updates"
                            icon={<MessageSquareText className="h-4 w-4" />}
                            active={activeAdminDrilldown === "unread-notifications"}
                            onClick={isAdmin ? () => setActiveAdminDrilldown((current) => current === "unread-notifications" ? null : "unread-notifications") : undefined}
                        />
                    </div>
                )}

                {isAdmin && activeAdminDrilldown ? (
                    <AdminDashboardDrilldownPanel
                        active={activeAdminDrilldown}
                        approvedJobs={adminApprovedJobs}
                        pendingJobs={adminPendingJobs}
                        resumeFiles={adminResumeDetailFiles}
                        resumeLoading={adminResumeStorageLoading}
                        unreadNotifications={adminUnreadNotifications}
                        onClose={() => setActiveAdminDrilldown(null)}
                    />
                ) : null}

                <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
                    <div className="space-y-5">
                        {isAdmin && <AdminPanel userId={user.id} />}
                        {isCompany && <CompanyPanel userId={user.id} />}
                        {isEmployee && <EmployeePanel userId={user.id} />}
                        {isCandidate && <CandidatePanel userId={user.id} />}
                    </div>

                    <div className="space-y-5">
                        <PanelShell title="Recent notifications" action={<Link to="/careersync/notifications" className="text-xs font-semibold text-blue-700 hover:text-blue-800">Open page</Link>}>
                            <div className="space-y-2">
                                {notifications.length === 0 ? (
                                    <EmptyStateLine text="No recent notifications." />
                                ) : notifications.map((notification) => (
                                    <div key={notification.id} className={`rounded-2xl border px-3 py-3 ${notification.read_at ? "border-slate-100 bg-slate-50/70" : "border-blue-100 bg-blue-50/50"}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-[#0F172A]">{notification.title}</p>
                                                <p className="mt-1 text-xs text-slate-500">{notification.message}</p>
                                            </div>
                                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">{new Date(notification.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PanelShell>

                        <PanelShell title="Quick actions">
                            <div className="grid gap-2">
                                <Link to="/careersync/jobs" className="inline-flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-[#0F172A] ring-1 ring-slate-100 transition hover:bg-slate-100">
                                    Browse approved jobs <ArrowRight className="h-4 w-4 text-blue-600" />
                                </Link>
                                {isCompany && (
                                    <Link to="/post-job" className="inline-flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-100 transition hover:bg-emerald-100">
                                        Post a new role <PlusCircle className="h-4 w-4 text-emerald-600" />
                                    </Link>
                                )}
                                <Link to="/careersync/notifications" className="inline-flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900 ring-1 ring-blue-100 transition hover:bg-blue-100">
                                    View notifications <ShieldCheck className="h-4 w-4 text-blue-600" />
                                </Link>
                            </div>
                        </PanelShell>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AdminPanel({ userId }: { userId: string }) {
    const snapshot = useDemoSnapshot();
    const pendingJobs = snapshot.jobs.filter((job) => job.status === "pending");
    const submissions = snapshot.jobs.filter((job) => job.posted_by === userId);

    return (
        <PanelShell
            title="Admin review queue"
            description="Approve or reject pending jobs submitted by HR accounts."
            action={<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{pendingJobs.length} pending</span>}
        >
            <div className="space-y-3">
                {pendingJobs.length === 0 ? (
                    <EmptyStateLine text="Nothing needs review right now." />
                ) : pendingJobs.map((job) => (
                    <JobRow
                        key={job.id}
                        jobTitle={`${job.role} · ${job.company}`}
                        meta={`${job.location ?? "Remote"} · ${job.salary ?? "Salary not set"}`}
                        actions={(
                            <div className="flex flex-wrap gap-2">
                                <ActionButton onClick={() => handleAdminJobReview(job, userId, "approved", "approved", () => approveDemoJob(job.id, userId))} tone="success">Approve</ActionButton>
                                <ActionButton onClick={() => handleAdminJobReview(job, userId, "changes_requested", "changes_requested", () => requestDemoJobChanges(job.id, userId, "Please add more detail to the job description and requirements."))} tone="warning">Request changes</ActionButton>
                                <ActionButton onClick={() => handleAdminJobReview(job, userId, "rejected", "rejected", () => rejectDemoJob(job.id, userId))} tone="danger">Reject</ActionButton>
                            </div>
                        )}
                    />
                ))}
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#0F172A]">Your submitted jobs</p>
                    <span className="text-xs text-slate-500">{submissions.length} total</span>
                </div>
                <div className="mt-2 space-y-2">
                    {submissions.slice(0, 3).map((job) => (
                        <div key={job.id} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-slate-100">
                            <span className="truncate font-semibold text-slate-700">{job.role}</span>
                            <span className={`rounded-full px-2 py-0.5 font-semibold ${job.status === "approved" ? "bg-emerald-50 text-emerald-700" : job.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{job.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </PanelShell>
    );
}

async function handleAdminJobReview(job: DemoJobRecord, adminUserId: string, status: DemoJobRecord["status"], action: string, localUpdate: () => void) {
    const reviewer = getDemoDisplayName(adminUserId);
    try {
        localUpdate();
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(job.id)) {
            const sharedJob = await reviewSharedCareerSyncJob({ jobId: job.id, status, reviewedBy: reviewer });
            if (sharedJob) mergeSharedCareerSyncJobs([sharedJob]);
        }
        await submitToGoogleSheet(buildJobSheetPayload({
            company: job.company,
            role: job.role,
            location: job.location,
            category: job.tags?.[0] ?? "",
            employmentType: job.employment_type,
            experience: job.experience,
            salary: job.salary,
            tags: job.tags,
            description: job.description,
            postedBy: job.recruiter_email || job.posted_by || reviewer,
            status,
            action,
            reviewedBy: reviewer,
        }));
        toast.success(`Job ${action} and logged to Google Sheet.`);
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not log review to Google Sheet.");
    }
}

function CompanyPanel({ userId }: { userId: string }) {
    const snapshot = useDemoSnapshot();
    const myJobs = snapshot.jobs.filter((job) => job.posted_by === userId);
    const myApplications = snapshot.applications.filter((application) => myJobs.some((job) => job.id === application.job_id));

    return (
        <PanelShell title="HR workspace" description="Track your job submissions and review applications.">
            <div className="grid gap-3 sm:grid-cols-2">
                <StatChip label="My jobs" value={String(myJobs.length)} />
                <StatChip label="Applications" value={String(myApplications.length)} />
            </div>
            <div className="mt-4 space-y-3">
                {myJobs.length === 0 ? (
                    <EmptyStateLine text="Submit a job to start the workflow." />
                ) : myJobs.slice(0, 3).map((job) => (
                    <JobRow
                        key={job.id}
                        jobTitle={job.role}
                        meta={`${job.company} · ${job.status}`}
                        actions={<span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${job.status === "approved" ? "bg-emerald-50 text-emerald-700" : job.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{job.status}</span>}
                    />
                ))}
            </div>
            <div className="mt-4 rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="text-sm font-bold text-[#0F172A]">Application actions</p>
                <div className="mt-3 space-y-2">
                    {myApplications.length === 0 ? (
                        <EmptyStateLine text="No applications have been submitted to your jobs yet." />
                    ) : myApplications.slice(0, 3).map((application) => (
                        <div key={application.id} className="rounded-xl bg-white p-3 ring-1 ring-blue-100">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-[#0F172A]">{application.full_name}</p>
                                    <p className="text-xs text-slate-500">{application.email}</p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{application.status}</span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <ActionButton onClick={() => updateDemoApplicationStatus(application.id, "under_review")} tone="neutral">Mark reviewing</ActionButton>
                                <ActionButton onClick={() => updateDemoApplicationStatus(application.id, "interview")} tone="success">Move to interview</ActionButton>
                                <ActionButton onClick={() => updateDemoApplicationStatus(application.id, "rejected")} tone="danger">Reject</ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PanelShell>
    );
}

function EmployeePanel({ userId }: { userId: string }) {
    const employee = getDemoEmployeeSnapshot(userId);
    const openTasks = employee.tasks.filter((task) => task.status !== "done").length;

    return (
        <PanelShell title="Employee workspace" description="Manage your tasks, hours, and leave requests.">
            <div className="grid gap-3 sm:grid-cols-3">
                <StatChip label="Open tasks" value={String(openTasks)} />
                <StatChip label="Timesheets" value={String(employee.timesheets.length)} />
                <StatChip label="Leave requests" value={String(employee.leaveRequests.length)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton tone="neutral" onClick={() => addDemoTimesheetEntry({ userId, workDate: new Date().toISOString().slice(0, 10), hours: 8, taskSummary: "Planned work summary" })}>
                    Submit demo timesheet
                </ActionButton>
            </div>
        </PanelShell>
    );
}

function CandidatePanel({ userId }: { userId: string }) {
    const snapshot = useDemoSnapshot();
    const myApplications = snapshot.applications.filter((application) => application.user_id === userId);
    const approvedJobs = snapshot.jobs.filter((job) => job.status === "approved" && job.is_verified && job.is_active).slice(0, 3);

    return (
        <PanelShell title="Candidate workspace" description="Track your applications and discover active roles.">
            <div className="grid gap-3 sm:grid-cols-2">
                <StatChip label="Applications" value={String(myApplications.length)} />
                <StatChip label="Live jobs" value={String(approvedJobs.length)} />
            </div>
            <div className="mt-4 space-y-3">
                {myApplications.length === 0 ? (
                    <EmptyStateLine text="Apply to a role to populate your tracking list." />
                ) : myApplications.map((application) => (
                    <div key={application.id} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-[#0F172A]">{application.full_name}</p>
                                <p className="text-xs text-slate-500">{application.email}</p>
                            </div>
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{application.status}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#0F172A]">Approved jobs to apply now</p>
                    <Link to="/careersync/jobs" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">View all</Link>
                </div>
                <div className="mt-3 space-y-2">
                    {approvedJobs.map((job) => (
                        <div key={job.id} className="rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-emerald-100">
                            <p className="font-semibold text-slate-800">{job.role}</p>
                            <p className="mt-0.5 text-slate-500">{job.company} · {job.location ?? "Remote"}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PanelShell>
    );
}

function PanelShell({ title, description, action, children }: { title: string; description?: string; action?: React.ReactNode; children: React.ReactNode; }) {
    return (
        <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.45 }} className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.25)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-black text-[#0F172A]">{title}</h3>
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                </div>
                {action}
            </div>
            <div className="mt-4">{children}</div>
        </motion.section>
    );
}

function AdminDashboardDrilldownPanel({
    active,
    approvedJobs,
    pendingJobs,
    resumeFiles,
    resumeLoading,
    unreadNotifications,
    onClose,
}: {
    active: AdminDashboardDrilldown;
    approvedJobs: DemoJobRecord[];
    pendingJobs: DemoJobRecord[];
    resumeFiles: AdminDashboardResumeFile[];
    resumeLoading: boolean;
    unreadNotifications: Array<{ id: string; title: string; message: string; created_at: string; type: string; }>;
    onClose: () => void;
}) {
    const titleMap: Record<AdminDashboardDrilldown, string> = {
        "approved-jobs": "Approved jobs",
        "pending-jobs": "Pending jobs",
        "total-resumes": "Uploaded resumes",
        "unread-notifications": "Unread notifications",
    };
    const subtitleMap: Record<AdminDashboardDrilldown, string> = {
        "approved-jobs": "Live roles visible on the public job board.",
        "pending-jobs": "HR submissions waiting for admin review.",
        "total-resumes": "Profiles and resume files stored in Supabase.",
        "unread-notifications": "New admin updates that still need attention.",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 rounded-[1.75rem] border border-blue-100 bg-blue-50/45 p-4 ring-1 ring-blue-50"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">Selected summary</p>
                    <h3 className="mt-1 text-lg font-black text-[#0F172A]">{titleMap[active]}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{subtitleMap[active]}</p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                    Close
                </button>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {active === "approved-jobs" && (
                    approvedJobs.length === 0 ? (
                        <HorizontalEmptyCard title="No approved jobs" message="Approved job roles will show here." />
                    ) : approvedJobs.map((job) => (
                        <HorizontalDetailCard key={job.id} title={job.role} badge="Approved">
                            <p>{job.company}</p>
                            <p>{job.location ?? "Location not shared"}</p>
                            <p>{[job.salary, job.experience].filter(Boolean).join(" · ") || "Details not shared"}</p>
                            <p>Updated {formatDashboardDate(job.updated_at)}</p>
                        </HorizontalDetailCard>
                    ))
                )}

                {active === "pending-jobs" && (
                    pendingJobs.length === 0 ? (
                        <HorizontalEmptyCard title="No pending jobs" message="Pending job approvals will show here." />
                    ) : pendingJobs.map((job) => (
                        <HorizontalDetailCard key={job.id} title={job.role} badge="Pending" tone="amber">
                            <p>{job.company}</p>
                            <p>{job.location ?? "Location not shared"}</p>
                            <p>{[job.salary, job.experience].filter(Boolean).join(" · ") || "Details not shared"}</p>
                            <p>Requested {formatDashboardDate(job.created_at)}</p>
                        </HorizontalDetailCard>
                    ))
                )}

                {active === "total-resumes" && (
                    resumeLoading && resumeFiles.length === 0 ? (
                        <HorizontalEmptyCard title="Loading resumes" message="Checking Supabase resume storage." />
                    ) : resumeFiles.length === 0 ? (
                        <HorizontalEmptyCard title="No resumes found" message="Uploaded candidate profiles will show here." />
                    ) : resumeFiles.map((file) => (
                        <HorizontalDetailCard key={file.path} title={file.candidateName || "Candidate name not saved"} badge={file.source || file.folder}>
                            <p>{[file.candidateLastRole, file.candidateExperience, file.candidateCity].filter(Boolean).join(" · ") || "Profile details not available"}</p>
                            <p>{file.candidateEmail || file.candidatePhone || "Contact not saved"}</p>
                            <p className="break-all font-black text-blue-700">{file.originalFileName || file.fileName}</p>
                            <p>{[file.size ? formatDashboardBytes(file.size) : null, file.uploadedAt ? formatDashboardDate(file.uploadedAt) : null].filter(Boolean).join(" · ") || "Upload date not found"}</p>
                            {file.downloadUrl ? (
                                <a href={file.downloadUrl} target="_blank" rel="noreferrer" download={file.fileName} className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                                    Download
                                </a>
                            ) : null}
                        </HorizontalDetailCard>
                    ))
                )}

                {active === "unread-notifications" && (
                    unreadNotifications.length === 0 ? (
                        <HorizontalEmptyCard title="No unread notifications" message="New updates will show here." />
                    ) : unreadNotifications.map((notification) => (
                        <HorizontalDetailCard key={notification.id} title={notification.title} badge={notification.type}>
                            <p>{notification.message}</p>
                            <p>{formatDashboardDate(notification.created_at)}</p>
                        </HorizontalDetailCard>
                    ))
                )}
            </div>
        </motion.div>
    );
}

function HorizontalDetailCard({ title, badge, tone = "blue", children }: { title: string; badge: string; tone?: "blue" | "amber"; children: React.ReactNode; }) {
    const badgeClass = tone === "amber" ? "bg-amber-50 text-amber-700 ring-amber-100" : "bg-blue-50 text-blue-700 ring-blue-100";
    return (
        <article className="min-w-[18rem] max-w-[18rem] rounded-2xl bg-white p-4 text-sm text-slate-500 ring-1 ring-blue-100">
            <div className="flex items-start justify-between gap-3">
                <h4 className="text-base font-black leading-snug text-[#0F172A]">{title}</h4>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ring-1 ${badgeClass}`}>{badge}</span>
            </div>
            <div className="mt-3 space-y-1 font-semibold">{children}</div>
        </article>
    );
}

function HorizontalEmptyCard({ title, message }: { title: string; message: string; }) {
    return (
        <div className="min-w-[18rem] rounded-2xl border border-dashed border-blue-200 bg-white/70 p-4">
            <p className="text-sm font-black text-[#0F172A]">{title}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{message}</p>
        </div>
    );
}

function MetricCard({ title, value, note, icon, active = false, onClick }: { title: string; value: string; note: string; icon: React.ReactNode; active?: boolean; onClick?: () => void; }) {
    const interactiveClass = onClick ? "cursor-pointer text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_-28px_rgba(37,99,235,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" : "";
    const activeClass = active ? "bg-blue-50 ring-2 ring-blue-400 shadow-[0_18px_45px_-32px_rgba(37,99,235,0.75)]" : "bg-slate-50 ring-1 ring-slate-100";
    const content = (
        <>
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-blue-600 ring-1 ring-slate-100">{icon}</span>
            </div>
            <div className="mt-3 text-3xl font-black text-[#0F172A]">{value}</div>
            <p className="mt-1 text-xs text-slate-500">{note}</p>
        </>
    );

    if (onClick) {
        return (
            <button type="button" onClick={onClick} aria-pressed={active} className={`rounded-2xl p-4 ${activeClass} ${interactiveClass}`}>
                {content}
            </button>
        );
    }

    return (
        <div className={`rounded-2xl p-4 ${activeClass}`}>
            {content}
        </div>
    );
}

function getResumeFileName(value: string) {
    try {
        return decodeURIComponent(value.split("/").pop() || value);
    } catch {
        return value.split("/").pop() || value;
    }
}

function formatDashboardDate(value: string | null | undefined) {
    if (!value) return "Date not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date not available";
    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
    });
}

function formatDashboardBytes(value: number) {
    if (!Number.isFinite(value) || value <= 0) return "0 KB";
    const units = ["B", "KB", "MB", "GB"];
    let size = value;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }
    return `${Math.round(size)} ${units[unitIndex]}`;
}

function RolePill({ label, tone }: { label: string; tone: "blue" | "emerald" | "cyan"; }) {
    const cls = tone === "emerald" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : tone === "cyan" ? "bg-cyan-50 text-cyan-700 ring-cyan-100" : "bg-blue-50 text-blue-700 ring-blue-100";
    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>{label}</span>;
}

function StatChip({ label, value }: { label: string; value: string; }) {
    return (
        <div className="rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-black text-[#0F172A]">{value}</p>
        </div>
    );
}

function JobRow({ jobTitle, meta, actions }: { jobTitle: string; meta: string; actions: React.ReactNode; }) {
    return (
        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{jobTitle}</p>
                    <p className="text-xs text-slate-500">{meta}</p>
                </div>
                {actions}
            </div>
        </div>
    );
}

function ActionButton({ children, onClick, tone }: { children: React.ReactNode; onClick: () => void; tone: "success" | "warning" | "danger" | "neutral"; }) {
    const cls = tone === "success" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : tone === "warning" ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : tone === "danger" ? "bg-rose-50 text-rose-700 hover:bg-rose-100" : "bg-slate-100 text-slate-700 hover:bg-slate-200";
    return (
        <button type="button" onClick={onClick} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${cls}`}>
            {children}
        </button>
    );
}

function EmptyStateLine({ text }: { text: string; }) {
    return (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-3 py-3 text-sm text-slate-500">
            <CircleAlert className="h-4 w-4 text-slate-400" />
            <span>{text}</span>
        </div>
    );
}
