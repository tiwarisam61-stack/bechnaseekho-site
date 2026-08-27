import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CircleAlert, Clock3, Layers3, MessageSquareText, PlusCircle, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import {
    approveDemoJob,
    getDashboardSummary,
    getDemoDisplayName,
    getDemoUserById,
    rejectDemoJob,
    requestDemoJobChanges,
    updateDemoApplicationStatus,
    useDemoSnapshot,
    addDemoTimesheetEntry,
    getDemoEmployeeSnapshot,
} from "@/services/careersync/careersync-service";

export function CareerSyncDashboard() {
    const { user } = useAuth();
    const { role, isAdmin, isCompany, isEmployee, isCandidate } = useRole();
    const snapshot = useDemoSnapshot();
    const summary = useMemo(() => getDashboardSummary(user?.id ?? null), [snapshot, user?.id]);

    if (!user || !role) return null;
    const notifications = summary.notifications.slice(0, 4);
    const displayName = getDemoDisplayName(user.id);

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
                        {isCompany && <RolePill tone="emerald" label="HR / company mode" />}
                        {isEmployee && <RolePill tone="amber" label="Employee mode" />}
                        {isCandidate && <RolePill tone="cyan" label="Candidate mode" />}
                    </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard title="Approved jobs" value={String(summary.totalJobs)} note="Visible on the public board" icon={<Sparkles className="h-4 w-4" />} />
                    <MetricCard title="Pending jobs" value={String(summary.pendingJobs)} note="Waiting for approval" icon={<Clock3 className="h-4 w-4" />} />
                    <MetricCard title="My applications" value={String(summary.myApplications.length)} note="Candidate activity" icon={<UserRound className="h-4 w-4" />} />
                    <MetricCard title="Unread notifications" value={String(summary.unreadNotifications)} note="New local updates" icon={<MessageSquareText className="h-4 w-4" />} />
                </div>

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
                                <ActionButton onClick={() => approveDemoJob(job.id, userId)} tone="success">Approve</ActionButton>
                                <ActionButton onClick={() => requestDemoJobChanges(job.id, userId, "Please add more detail to the job description and requirements.")} tone="warning">Request changes</ActionButton>
                                <ActionButton onClick={() => rejectDemoJob(job.id, userId)} tone="danger">Reject</ActionButton>
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

function MetricCard({ title, value, note, icon }: { title: string; value: string; note: string; icon: React.ReactNode; }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-blue-600 ring-1 ring-slate-100">{icon}</span>
            </div>
            <div className="mt-3 text-3xl font-black text-[#0F172A]">{value}</div>
            <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
    );
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
