import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Briefcase, Building2, CalendarDays, CheckCircle2, Clock3, FileClock, LogOut, ShieldCheck, Users, UserRound } from "lucide-react";
import { CareerSyncDashboard } from "@/components/careersync/dashboard";
import { NotificationBell } from "@/components/careersync/notification-bell";
import { CareerSyncJobsSection } from "@/components/careersync/jobs-section";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import {
    addDemoChatMessage,
    addDemoTimesheetEntry,
    approveDemoJob,
    approveDemoJobDeletion,
    createDemoBlogDraft,
    createDemoTask,
    deleteDemoJob,
    getDemoActivityFeed,
    getDemoDisplayName,
    getDemoEmployeeSnapshot,
    getDemoNotificationsForUser,
    getDemoJobDeletionRequests,
    getDemoUsersByRole,
    getDemoSavedJobIds,
    getCareerSyncAdminAnalytics,
    getCareerSyncCandidateProgress,
    getCareerSyncCompanyAnalytics,
    getCareerSyncLeadAssignments,
    reviewDemoBlog,
    reviewDemoLeaveRequest,
    rejectDemoJob,
    requestDemoJobChanges,
    submitDemoBlogForReview,
    submitDemoLeaveRequest,
    updateDemoTaskStatus,
    toggleDemoSavedJob,
    useDemoSnapshot,
    type DemoJobRecord,
} from "@/services/careersync/careersync-service";
import { signOut } from "@/services/platform/auth-service";
import { getRoleLabel } from "@/lib/careersync-rbac";

const ROLE_NAVS = {
    admin: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Jobs Approval", href: "#jobs-approval" },
        { label: "Platform Stats", href: "#platform-stats" },
        { label: "Reports", href: "#reports" },
        { label: "Lead Assignment", href: "#lead-assignment" },
        { label: "Delete Requests", href: "#delete-requests" },
        { label: "Blog Approval", href: "#blog-approval" },
        { label: "All Jobs", href: "#all-jobs" },
        { label: "User Management", href: "#user-management" },
        { label: "Users", href: "#users" },
        { label: "Employees", href: "#employees" },
        { label: "HR Management", href: "#hr-management" },
        { label: "Candidates", href: "#candidates" },
        { label: "Activity", href: "#activity" },
        { label: "Notifications", href: "#notifications" },
        { label: "Analytics", href: "#analytics" },
        { label: "Settings", href: "#settings" },
    ],
    company: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Post a Job", href: "/post-job" },
        { label: "My Jobs", href: "#my-jobs" },
        { label: "Applicants", href: "#applicants" },
        { label: "Analytics", href: "#analytics" },
        { label: "Notifications", href: "#notifications" },
        { label: "Profile", href: "#profile" },
    ],
    candidate: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Jobs", href: "#jobs" },
        { label: "Saved Jobs", href: "#saved-jobs" },
        { label: "Applications", href: "#applications" },
        { label: "Status Tracking", href: "#status-tracking" },
        { label: "Profile Improvements", href: "#profile-improvements" },
        { label: "Notifications", href: "#notifications" },
        { label: "Profile", href: "#profile" },
    ],
    employee: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Timesheets", href: "#timesheets" },
        { label: "Tasks", href: "#tasks" },
        { label: "Leave", href: "#leave" },
        { label: "Chat", href: "#chat" },
        { label: "Blog", href: "#blog" },
        { label: "Notifications", href: "#notifications" },
        { label: "Profile", href: "#profile" },
    ],
} as const;

export function CareerSyncWorkspaceShell() {
    const { user, loading: authLoading } = useAuth();
    const { role, loading: roleLoading, isAdmin, isCompany, isEmployee, isCandidate } = useRole();
    const snapshot = useDemoSnapshot();

    if (authLoading || roleLoading) {
        return <WorkspaceLoading />;
    }

    if (!user || !role) {
        return <WorkspaceLoading />;
    }

    const navItems = role === "admin" ? ROLE_NAVS.admin : role === "company" ? ROLE_NAVS.company : role === "employee" ? ROLE_NAVS.employee : ROLE_NAVS.candidate;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 text-[#0F172A]">
            <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2.5 rounded-full bg-white px-3 py-2 ring-1 ring-slate-100">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md"><ShieldCheck className="h-4 w-4" /></div>
                            <div className="leading-tight"><p className="text-sm font-black tracking-tight">CareerSync</p><p className="text-[11px] font-semibold text-slate-500">Role workspace</p></div>
                        </Link>
                        <div className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 sm:inline-flex">
                            {getRoleLabel(role)} access
                        </div>
                    </div>

                    <nav className="flex flex-wrap items-center gap-2">
                        {navItems.map((item) => (
                            item.href.startsWith("#") ? (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-100 transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-100 transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-100 sm:flex">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-black text-white">
                                {(user.email?.[0] ?? "U").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">{getDemoDisplayName(user.id)}</p>
                                <p className="text-[11px] uppercase tracking-wide text-slate-500">{getRoleLabel(role)}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => signOut()}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-100 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {isAdmin && <AdminWorkspace userId={user.id} snapshot={snapshot} />}
                {isCompany && <CompanyWorkspace userId={user.id} snapshot={snapshot} />}
                {isEmployee && <EmployeeWorkspace userId={user.id} snapshot={snapshot} />}
                {isCandidate && <CandidateWorkspace userId={user.id} snapshot={snapshot} />}
            </main>
        </div>
    );
}

function AdminWorkspace({ userId, snapshot }: { userId: string; snapshot: ReturnType<typeof useDemoSnapshot> }) {
    const adminNotifications = getDemoNotificationsForUser(userId);
    const pendingJobs = snapshot.jobs.filter((job) => job.status === "pending");
    const approvedJobs = snapshot.jobs.filter((job) => job.status === "approved" && job.is_active && job.is_verified);
    const hrUsers = snapshot.users.filter((user) => user.role === "company");
    const employeeUsers = snapshot.users.filter((user) => user.role === "employee");
    const candidateUsers = snapshot.users.filter((user) => user.role === "candidate");
    const pendingDeletionRequests = getDemoJobDeletionRequests().filter((request) => request.status === "pending");
    const pendingBlogs = snapshot.blogs.filter((blog) => blog.status === "pending_review");
    const pendingLeaves = snapshot.leaveRequests.filter((leave) => leave.status === "pending");
    const activityFeed = getDemoActivityFeed(8);
    const adminAnalytics = getCareerSyncAdminAnalytics();
    const leadAssignments = getCareerSyncLeadAssignments().slice(0, 10);

    return (
        <div className="space-y-6">
            <section id="dashboard">
                <CareerSyncDashboard />
            </section>

            <section id="jobs-approval" className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(37,99,235,0.28)] sm:p-7">
                <SectionHeading title="Jobs Approval" subtitle="Review HR submissions before they go public." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {pendingJobs.length === 0 ? (
                        <EmptyState title="No pending jobs" message="HR submissions will appear here for admin approval." />
                    ) : pendingJobs.map((job) => <AdminJobCard key={job.id} job={job} adminUserId={userId} />)}
                </div>
            </section>

            <section id="platform-stats" className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(139,92,246,0.2)] sm:p-7">
                <SectionHeading title="Platform Statistics" subtitle="Enterprise-wide usage and pipeline counters." />
                <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                    <SummaryCard label="Users" value={String(adminAnalytics.totals.totalUsers)} icon={<Users className="h-4 w-4" />} />
                    <SummaryCard label="HR" value={String(adminAnalytics.totals.totalHrUsers)} icon={<Building2 className="h-4 w-4" />} />
                    <SummaryCard label="Employees" value={String(adminAnalytics.totals.totalEmployees)} icon={<UserRound className="h-4 w-4" />} />
                    <SummaryCard label="Candidates" value={String(adminAnalytics.totals.totalCandidates)} icon={<UserRound className="h-4 w-4" />} />
                    <SummaryCard label="Applications" value={String(adminAnalytics.totals.totalApplications)} icon={<Briefcase className="h-4 w-4" />} />
                    <SummaryCard label="Pending Leaves" value={String(adminAnalytics.totals.pendingLeaves)} icon={<CalendarDays className="h-4 w-4" />} />
                </div>
            </section>

            <section id="reports" className="rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(99,102,241,0.2)] sm:p-7">
                <SectionHeading title="Reports" subtitle="Approval and application status visuals for quick review." />
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <ReportChartCard
                        title="Application Status"
                        subtitle="Current candidate pipeline"
                        data={toChartData(adminAnalytics.applicationStatusCounts)}
                        tone="blue"
                    />
                    <ReportChartCard
                        title="Top Hiring Teams"
                        subtitle="Approved jobs by HR owner"
                        data={adminAnalytics.topCompanies.map((item) => ({ label: item.company, value: item.approvedJobs }))}
                        tone="violet"
                    />
                </div>
            </section>

            <section id="lead-assignment" className="rounded-[2rem] border border-cyan-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(6,182,212,0.2)] sm:p-7">
                <SectionHeading title="Lead Assignment" subtitle="Automatically balanced ownership across HR accounts." />
                <div className="mt-5 space-y-2">
                    {leadAssignments.length === 0 ? (
                        <EmptyState title="No pending leads" message="New applications will auto-assign here." />
                    ) : leadAssignments.map((lead) => (
                        <div key={lead.applicationId} className="rounded-2xl border border-cyan-100 bg-cyan-50/40 px-3 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{lead.candidateName} · {lead.jobTitle}</p>
                                    <p className="text-xs text-slate-500">Assigned to {lead.assignedHrName}</p>
                                </div>
                                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-700 ring-1 ring-cyan-200">Assigned</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="delete-requests" className="rounded-[2rem] border border-rose-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(244,63,94,0.22)] sm:p-7">
                <SectionHeading title="Delete Requests" subtitle="Approve or reject HR deletion requests before removing jobs." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {pendingDeletionRequests.length === 0 ? (
                        <EmptyState title="No deletion requests" message="Job deletion approvals will appear here." />
                    ) : pendingDeletionRequests.map((request) => {
                        const job = snapshot.jobs.find((item) => item.id === request.job_id);
                        return (
                            <div key={request.id} className="rounded-3xl border border-rose-100 bg-rose-50/40 p-4 ring-1 ring-rose-100">
                                <p className="text-sm font-bold text-slate-900">{job?.role ?? "Job"} · {job?.company ?? "Unknown"}</p>
                                <p className="mt-1 text-xs text-slate-500">Requested by {getDemoDisplayName(request.requested_by)}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <ActionButton tone="danger" onClick={() => approveDemoJobDeletion(request.id, userId, true, "Approved by admin")}>Approve delete</ActionButton>
                                    <ActionButton tone="neutral" onClick={() => approveDemoJobDeletion(request.id, userId, false, "Please keep this listing active")}>Reject request</ActionButton>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section id="blog-approval" className="rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(99,102,241,0.2)] sm:p-7">
                <SectionHeading title="Blog Approval" subtitle="Review employee and HR blog drafts before publishing." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {pendingBlogs.length === 0 ? (
                        <EmptyState title="No pending blogs" message="Drafts submitted for review will appear here." />
                    ) : pendingBlogs.map((blog) => (
                        <div key={blog.id} className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-4 ring-1 ring-indigo-100">
                            <p className="text-sm font-bold text-slate-900">{blog.title}</p>
                            <p className="mt-1 text-xs text-slate-500">By {getDemoDisplayName(blog.author_id)}</p>
                            <p className="mt-2 line-clamp-3 text-xs text-slate-600">{blog.body}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <ActionButton tone="success" onClick={() => reviewDemoBlog(blog.id, userId, true, "Approved")}>Approve</ActionButton>
                                <ActionButton tone="warning" onClick={() => reviewDemoBlog(blog.id, userId, false, "Please refine and resubmit")}>Request updates</ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="all-jobs" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="All Jobs" subtitle="Full published and pending inventory." />
                <div className="mt-5 space-y-3">
                    <CareerSyncJobsSection />
                </div>
            </section>

            <section id="users" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Users" subtitle="All demo accounts in one place." />
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <SummaryCard label="All users" value={String(snapshot.users.length)} icon={<Users className="h-4 w-4" />} />
                    <SummaryCard label="HR accounts" value={String(hrUsers.length)} icon={<Building2 className="h-4 w-4" />} />
                    <SummaryCard label="Candidates" value={String(candidateUsers.length)} icon={<UserRound className="h-4 w-4" />} />
                </div>
            </section>

            <section id="user-management" className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(16,185,129,0.2)] sm:p-7">
                <SectionHeading title="User Management" subtitle="Role distribution and moderation-ready account overview." />
                <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard label="Admins" value={String(snapshot.users.filter((item) => item.role === "admin").length)} icon={<ShieldCheck className="h-4 w-4" />} />
                    <SummaryCard label="HR" value={String(snapshot.users.filter((item) => item.role === "company").length)} icon={<Building2 className="h-4 w-4" />} />
                    <SummaryCard label="Employees" value={String(snapshot.users.filter((item) => item.role === "employee").length)} icon={<Users className="h-4 w-4" />} />
                    <SummaryCard label="Candidates" value={String(snapshot.users.filter((item) => item.role === "candidate").length)} icon={<UserRound className="h-4 w-4" />} />
                </div>
            </section>

            <section id="employees" className="rounded-[2rem] border border-amber-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(245,158,11,0.2)] sm:p-7">
                <SectionHeading title="Employee Management" subtitle="Employees, tasks, leave approvals, and enterprise controls." />
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <SummaryCard label="Employees" value={String(employeeUsers.length)} icon={<Users className="h-4 w-4" />} />
                    <SummaryCard label="Open tasks" value={String(snapshot.tasks.filter((task) => task.status !== "done").length)} icon={<Briefcase className="h-4 w-4" />} />
                    <SummaryCard label="Pending leaves" value={String(pendingLeaves.length)} icon={<CalendarDays className="h-4 w-4" />} />
                    <SummaryCard label="Timesheets" value={String(snapshot.timesheets.length)} icon={<FileClock className="h-4 w-4" />} />
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {employeeUsers.map((employee) => (
                        <div key={employee.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{employee.full_name}</p>
                                    <p className="text-xs text-slate-500">{employee.email}</p>
                                </div>
                                <ActionButton tone="neutral" onClick={() => createDemoTask({ title: "Weekly hiring sync", assigneeUserId: employee.id, createdBy: userId, description: "Prepare weekly hiring metrics.", dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10) })}>
                                    Assign task
                                </ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
                {pendingLeaves.length > 0 && (
                    <div className="mt-5 grid gap-3 lg:grid-cols-2">
                        {pendingLeaves.slice(0, 4).map((leave) => (
                            <div key={leave.id} className="rounded-3xl border border-amber-100 bg-amber-50/40 p-4 ring-1 ring-amber-100">
                                <p className="text-sm font-bold text-slate-900">{getDemoDisplayName(leave.user_id)} · {leave.leave_type} leave</p>
                                <p className="mt-1 text-xs text-slate-500">{leave.start_date} to {leave.end_date}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <ActionButton tone="success" onClick={() => reviewDemoLeaveRequest(leave.id, userId, true)}>Approve</ActionButton>
                                    <ActionButton tone="danger" onClick={() => reviewDemoLeaveRequest(leave.id, userId, false)}>Reject</ActionButton>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section id="hr-management" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="HR Management" subtitle="Monitor recruiter submissions and approvals." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {hrUsers.map((user) => (
                        <UserRow key={user.id} name={user.full_name} meta={user.company_name ?? user.email} badge="HR" />
                    ))}
                </div>
            </section>

            <section id="candidates" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Candidates" subtitle="Candidate demo accounts and activity." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {candidateUsers.map((user) => (
                        <UserRow key={user.id} name={user.full_name} meta={user.email} badge="Candidate" />
                    ))}
                </div>
            </section>

            <section id="notifications" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Notifications" subtitle="Admin-only notifications remain isolated here." />
                <NotificationList notifications={adminNotifications} emptyLabel="No admin notifications yet." />
            </section>

            <section id="analytics" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Analytics" subtitle="Track approval workflow health." />
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <SummaryCard label="Approved jobs" value={String(approvedJobs.length)} icon={<CheckCircle2 className="h-4 w-4" />} />
                    <SummaryCard label="Pending jobs" value={String(pendingJobs.length)} icon={<Clock3 className="h-4 w-4" />} />
                    <SummaryCard label="HR accounts" value={String(hrUsers.length)} icon={<Building2 className="h-4 w-4" />} />
                    <SummaryCard label="Employees" value={String(employeeUsers.length)} icon={<Users className="h-4 w-4" />} />
                </div>
            </section>

            <section id="activity" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Activity & Audit" subtitle="Live role-based activity feed for enterprise tracing." />
                <div className="mt-5 space-y-2">
                    {activityFeed.length === 0 ? (
                        <EmptyState title="No activity yet" message="Workflow actions will appear here." />
                    ) : activityFeed.map((entry) => (
                        <div key={entry.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{entry.action}</p>
                                    <p className="mt-1 text-xs text-slate-500">{entry.message}</p>
                                </div>
                                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">{new Date(entry.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="settings" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Settings" subtitle="RBAC is driven by local demo data and can later map to backend roles." />
                <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-100">
                    Access is scoped by role, and each notification stream is tied to its owner account.
                    <p className="mt-3 text-xs text-slate-500">TODO backend mapping: PostgreSQL RLS policies, JWT claims, SMTP, WhatsApp, push notifications, websocket updates, and enterprise REST APIs.</p>
                </div>
            </section>
        </div>
    );
}

function CompanyWorkspace({ userId, snapshot }: { userId: string; snapshot: ReturnType<typeof useDemoSnapshot> }) {
    const myJobs = snapshot.jobs.filter((job) => job.posted_by === userId);
    const myNotifications = getDemoNotificationsForUser(userId);
    const myApplications = snapshot.applications.filter((application) => myJobs.some((job) => job.id === application.job_id));
    const companyAnalytics = getCareerSyncCompanyAnalytics(userId);

    return (
        <div className="space-y-6">
            <section id="dashboard">
                <CareerSyncDashboard />
            </section>

            <section id="post-job" className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(16,185,129,0.28)] sm:p-7">
                <SectionHeading title="Post a Job" subtitle="Submit a role for admin approval." />
                <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/post-job" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700">
                        <ArrowRight className="h-4 w-4" /> Open job form
                    </Link>
                    <div className="rounded-full bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
                        Jobs are pending until approved.
                    </div>
                </div>
            </section>

            <section id="my-jobs" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="My Jobs" subtitle="Track submissions, edits, and approval status." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {myJobs.length === 0 ? (
                        <EmptyState title="No jobs yet" message="Submit your first job to create a recruiter workspace." />
                    ) : myJobs.map((job) => <CompanyJobCard key={job.id} job={job} companyUserId={userId} />)}
                </div>
            </section>

            <section id="applicants" className="rounded-[2rem] border border-cyan-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(6,182,212,0.2)] sm:p-7">
                <SectionHeading title="View Applicants" subtitle="Review resumes and advance candidate status." />
                <div className="mt-5 space-y-3">
                    {companyAnalytics.recentApplicants.length === 0 ? (
                        <EmptyState title="No applicants yet" message="Applicants appear here after job applications are submitted." />
                    ) : companyAnalytics.recentApplicants.map((application) => (
                        <div key={application.id} className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{application.full_name} · {application.jobTitle}</p>
                                    <p className="text-xs text-slate-500">{application.email}</p>
                                </div>
                                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-700 ring-1 ring-cyan-200">{application.status}</span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {application.resume_url ? (
                                    <a href={application.resume_url} target="_blank" rel="noopener" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                                        Resume Viewer
                                    </a>
                                ) : (
                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">No resume link</span>
                                )}
                                <ActionButton tone="neutral" onClick={() => updateDemoApplicationStatus(application.id, "under_review")}>Under review</ActionButton>
                                <ActionButton tone="success" onClick={() => updateDemoApplicationStatus(application.id, "interview")}>Interview</ActionButton>
                                <ActionButton tone="danger" onClick={() => updateDemoApplicationStatus(application.id, "rejected")}>Reject</ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="analytics" className="rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(99,102,241,0.2)] sm:p-7">
                <SectionHeading title="Analytics" subtitle="Jobs and applicants funnel across statuses." />
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <ReportChartCard
                        title="Jobs by Status"
                        subtitle="Approval and publish flow"
                        data={toChartData(companyAnalytics.jobsByStatus)}
                        tone="emerald"
                    />
                    <ReportChartCard
                        title="Applicants by Stage"
                        subtitle="Recruiting progress"
                        data={toChartData(companyAnalytics.applicationsByStatus)}
                        tone="blue"
                    />
                </div>
            </section>

            <section id="notifications" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Notifications" subtitle="Only HR notifications for this account." />
                <NotificationList notifications={myNotifications} emptyLabel="No HR notifications yet." />
            </section>

            <section id="profile" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Profile" subtitle="Your recruiter identity." />
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <SummaryCard label="Display name" value={getDemoDisplayName(userId)} icon={<UserRound className="h-4 w-4" />} />
                    <SummaryCard label="My jobs" value={String(myJobs.length)} icon={<Briefcase className="h-4 w-4" />} />
                    <SummaryCard label="Applications" value={String(myApplications.length)} icon={<Users className="h-4 w-4" />} />
                </div>
            </section>
        </div>
    );
}

function EmployeeWorkspace({ userId }: { userId: string; snapshot: ReturnType<typeof useDemoSnapshot> }) {
    const employee = getDemoEmployeeSnapshot(userId);
    const notifications = getDemoNotificationsForUser(userId);
    const hrUsers = getDemoUsersByRole("company");
    const adminUsers = getDemoUsersByRole("admin");
    const reviewerId = hrUsers[0]?.id ?? adminUsers[0]?.id ?? null;

    return (
        <div className="space-y-6">
            <section id="dashboard">
                <CareerSyncDashboard />
            </section>

            <section id="timesheets" className="rounded-[2rem] border border-cyan-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(6,182,212,0.24)] sm:p-7">
                <SectionHeading title="Timesheets" subtitle="Submit daily hours and task summaries for HR review." />
                <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton tone="success" onClick={() => addDemoTimesheetEntry({ userId, workDate: new Date().toISOString().slice(0, 10), hours: 8, taskSummary: "Hiring operations, dashboard clean-up, and stakeholder updates." })}>
                        Submit today timesheet
                    </ActionButton>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {employee.timesheets.length === 0 ? (
                        <EmptyState title="No timesheets" message="Use the action above to submit your first timesheet." />
                    ) : employee.timesheets.slice(0, 6).map((sheet) => (
                        <div key={sheet.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
                            <p className="text-sm font-bold text-slate-900">{sheet.work_date} · {sheet.hours}h</p>
                            <p className="mt-1 text-xs text-slate-500">{sheet.task_summary}</p>
                            <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">{sheet.status}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section id="tasks" className="rounded-[2rem] border border-amber-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(245,158,11,0.2)] sm:p-7">
                <SectionHeading title="Tasks" subtitle="Track assigned work and keep status up to date." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {employee.tasks.length === 0 ? (
                        <EmptyState title="No tasks assigned" message="Tasks from HR and admin will appear here." />
                    ) : employee.tasks.map((task) => (
                        <div key={task.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
                            <p className="text-sm font-bold text-slate-900">{task.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{task.description ?? "No description"}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">{task.priority}</span>
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">{task.status}</span>
                                <ActionButton tone="neutral" onClick={() => updateDemoTaskStatus(task.id, task.status === "done" ? "in_progress" : "done", userId)}>
                                    {task.status === "done" ? "Reopen" : "Mark done"}
                                </ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="leave" className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(16,185,129,0.2)] sm:p-7">
                <SectionHeading title="Leave Requests" subtitle="Request leave and track approval status." />
                <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton tone="success" onClick={() => submitDemoLeaveRequest({ userId, leaveType: "casual", startDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), endDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), reason: "Personal work" })}>
                        Submit leave request
                    </ActionButton>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {employee.leaveRequests.length === 0 ? (
                        <EmptyState title="No leave requests" message="Submit a leave request to start approval workflow." />
                    ) : employee.leaveRequests.slice(0, 6).map((leave) => (
                        <div key={leave.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
                            <p className="text-sm font-bold text-slate-900">{leave.leave_type} leave</p>
                            <p className="mt-1 text-xs text-slate-500">{leave.start_date} to {leave.end_date}</p>
                            <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">{leave.status}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section id="chat" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Internal Chat" subtitle="Collaborate with HR/admin from your workspace." />
                <div className="mt-5 flex flex-wrap gap-2">
                    {reviewerId && (
                        <ActionButton tone="neutral" onClick={() => addDemoChatMessage({ senderId: userId, receiverId: reviewerId, body: "Daily update: tasks are on track and timesheet submitted." })}>
                            Send update
                        </ActionButton>
                    )}
                </div>
                <div className="mt-4 space-y-2">
                    {employee.chats.length === 0 ? (
                        <EmptyState title="No messages" message="Use send update to start internal chat." />
                    ) : employee.chats.slice(0, 6).map((message) => (
                        <div key={message.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
                            <p className="text-xs font-semibold text-slate-700">{getDemoDisplayName(message.sender_id)} → {getDemoDisplayName(message.receiver_id)}</p>
                            <p className="mt-1 text-sm text-slate-600">{message.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="blog" className="rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(99,102,241,0.2)] sm:p-7">
                <SectionHeading title="Blog Workflow" subtitle="Create drafts and submit for admin approval." />
                <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton tone="neutral" onClick={() => createDemoBlogDraft({ authorId: userId, title: "Weekly Hiring Insights", body: "Observed trends from interview loops and candidate feedback." })}>
                        Create draft
                    </ActionButton>
                    {employee.blogs.filter((blog) => blog.status === "draft").slice(0, 1).map((blog) => (
                        <ActionButton key={blog.id} tone="success" onClick={() => submitDemoBlogForReview(blog.id, userId)}>
                            Submit latest draft
                        </ActionButton>
                    ))}
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {employee.blogs.length === 0 ? (
                        <EmptyState title="No blogs" message="Create your first blog draft." />
                    ) : employee.blogs.slice(0, 6).map((blog) => (
                        <div key={blog.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
                            <p className="text-sm font-bold text-slate-900">{blog.title}</p>
                            <p className="mt-1 line-clamp-3 text-xs text-slate-500">{blog.body}</p>
                            <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">{blog.status}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section id="notifications" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Notifications" subtitle="Employee-only notification stream." />
                <NotificationList notifications={notifications} emptyLabel="No employee notifications yet." />
            </section>

            <section id="profile" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Profile" subtitle="Your enterprise employee snapshot." />
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <SummaryCard label="Display name" value={getDemoDisplayName(userId)} icon={<UserRound className="h-4 w-4" />} />
                    <SummaryCard label="Tasks" value={String(employee.tasks.length)} icon={<Briefcase className="h-4 w-4" />} />
                    <SummaryCard label="Timesheets" value={String(employee.timesheets.length)} icon={<FileClock className="h-4 w-4" />} />
                    <SummaryCard label="Leave" value={String(employee.leaveRequests.length)} icon={<CalendarDays className="h-4 w-4" />} />
                </div>
            </section>
        </div>
    );
}

function CandidateWorkspace({ userId, snapshot }: { userId: string; snapshot: ReturnType<typeof useDemoSnapshot> }) {
    const savedJobIds = getDemoSavedJobIds(userId);
    const approvedJobs = snapshot.jobs.filter((job) => job.status === "approved" && job.is_active && job.is_verified);
    const myApplications = snapshot.applications.filter((application) => application.user_id === userId);
    const myNotifications = getDemoNotificationsForUser(userId);
    const savedJobs = approvedJobs.filter((job) => savedJobIds.includes(job.id));
    const candidateProgress = getCareerSyncCandidateProgress(userId);

    return (
        <div className="space-y-6">
            <section id="dashboard">
                <CareerSyncDashboard />
            </section>

            <section id="jobs" className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(37,99,235,0.28)] sm:p-7">
                <SectionHeading title="Jobs" subtitle="Browse approved roles and save ones you want to revisit." />
                <div className="mt-5">
                    <CareerSyncJobsSection />
                </div>
            </section>

            <section id="saved-jobs" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Saved Jobs" subtitle="Jobs saved to your personal shortlist." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {savedJobs.length === 0 ? (
                        <EmptyState title="No saved jobs" message="Use the save button below to keep jobs on your shortlist." />
                    ) : savedJobs.map((job) => <SavedJobCard key={job.id} job={job} userId={userId} saved />)}
                    {approvedJobs.filter((job) => !savedJobIds.includes(job.id)).slice(0, 3).map((job) => <SavedJobCard key={job.id} job={job} userId={userId} saved={false} />)}
                </div>
            </section>

            <section id="applications" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Applications" subtitle="Your submitted applications and current status." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {myApplications.length === 0 ? (
                        <EmptyState title="No applications yet" message="Apply to a role to see it here." />
                    ) : myApplications.map((application) => (
                        <div key={application.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
                            <p className="text-sm font-bold text-slate-900">{application.full_name}</p>
                            <p className="mt-1 text-xs text-slate-500">{application.email}</p>
                            <span className="mt-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                                {application.status}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section id="status-tracking" className="rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(99,102,241,0.2)] sm:p-7">
                <SectionHeading title="Status Tracking" subtitle="Visualize your application journey in one view." />
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <ReportChartCard
                        title="Applications by Stage"
                        subtitle="Submitted, review, interview, and beyond"
                        data={toChartData(candidateProgress.statusBreakdown)}
                        tone="blue"
                    />
                    <div className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-5">
                        <div className="flex items-center gap-2 text-indigo-800">
                            <BarChart3 className="h-4 w-4" />
                            <p className="text-sm font-bold">Profile Strength</p>
                        </div>
                        <div className="mt-4 h-3 w-full rounded-full bg-white ring-1 ring-indigo-100">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${candidateProgress.profileCompletion}%` }} />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-indigo-700">{candidateProgress.profileCompletion}% complete</p>
                    </div>
                </div>
            </section>

            <section id="profile-improvements" className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(16,185,129,0.2)] sm:p-7">
                <SectionHeading title="Profile Improvements" subtitle="Action checklist to improve response rate." />
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <ImprovementPill label="Phone Verified" done={candidateProgress.hasPhone} />
                    <ImprovementPill label="Resume Uploaded" done={candidateProgress.hasResume} />
                    <ImprovementPill label="Applied to Jobs" done={candidateProgress.totalApplications > 0} />
                </div>
            </section>

            <section id="notifications" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Notifications" subtitle="Only candidate notifications for this account." />
                <NotificationList notifications={myNotifications} emptyLabel="No candidate notifications yet." />
            </section>

            <section id="profile" className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7">
                <SectionHeading title="Profile" subtitle="Your candidate workspace." />
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <SummaryCard label="Display name" value={getDemoDisplayName(userId)} icon={<UserRound className="h-4 w-4" />} />
                    <SummaryCard label="Saved jobs" value={String(savedJobIds.length)} icon={<Briefcase className="h-4 w-4" />} />
                    <SummaryCard label="Applications" value={String(myApplications.length)} icon={<ArrowRight className="h-4 w-4" />} />
                </div>
            </section>
        </div>
    );
}

function AdminJobCard({ job, adminUserId }: { job: DemoJobRecord; adminUserId: string }) {
    return (
        <div className="rounded-3xl border border-amber-100 bg-amber-50/40 p-4 ring-1 ring-amber-100">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-slate-900">{job.role}</p>
                    <p className="text-xs text-slate-500">{job.company} · {job.location ?? "Remote"}</p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    {job.status}
                </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton tone="success" onClick={() => approveDemoJob(job.id, adminUserId)}>Approve</ActionButton>
                <ActionButton tone="warning" onClick={() => requestDemoJobChanges(job.id, adminUserId, "Please add more detail to the job description and requirements.")}>Request changes</ActionButton>
                <ActionButton tone="danger" onClick={() => rejectDemoJob(job.id, adminUserId)}>Reject</ActionButton>
            </div>
        </div>
    );
}

function CompanyJobCard({ job, companyUserId }: { job: DemoJobRecord; companyUserId: string }) {
    const isPending = job.status === "pending";
    return (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-slate-900">{job.role}</p>
                    <p className="text-xs text-slate-500">{job.company} · {job.location ?? "Remote"}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${isPending ? "bg-amber-50 text-amber-700" : job.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {job.status}
                </span>
            </div>
            <p className="mt-3 line-clamp-2 text-xs text-slate-600">{job.description ?? "No description yet."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/post-job" search={{ jobId: job.id }} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
                    Edit / Resubmit
                </Link>
                {isPending && <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">Awaiting admin review</span>}
                <ActionButton tone="danger" onClick={() => deleteDemoJob(job.id, companyUserId)}>Delete</ActionButton>
            </div>
        </div>
    );
}

function SavedJobCard({ job, userId, saved }: { job: DemoJobRecord; userId: string; saved: boolean }) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-4 ring-1 ring-slate-100">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-slate-900">{job.role}</p>
                    <p className="text-xs text-slate-500">{job.company} · {job.location ?? "Remote"}</p>
                </div>
                <button
                    type="button"
                    onClick={() => toggleDemoSavedJob(userId, job.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${saved ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                >
                    {saved ? "Saved" : "Save job"}
                </button>
            </div>
            <p className="mt-3 line-clamp-2 text-xs text-slate-600">{job.description ?? "No description yet."}</p>
        </div>
    );
}

function NotificationList({ notifications, emptyLabel }: { notifications: ReturnType<typeof getDemoNotificationsForUser>; emptyLabel: string }) {
    return (
        <div className="space-y-2">
            {notifications.length === 0 ? (
                <EmptyState title="No notifications" message={emptyLabel} />
            ) : notifications.slice(0, 6).map((notification) => (
                <div key={notification.id} className={`rounded-2xl border px-3 py-3 ${notification.read_at ? "border-slate-100 bg-slate-50/70" : "border-blue-100 bg-blue-50/50"}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900">{notification.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{notification.message}</p>
                        </div>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                            {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ title, message }: { title: string; message: string }) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
            <p className="font-bold text-slate-900">{title}</p>
            <p className="mt-1">{message}</p>
        </div>
    );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">Role workspace</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>
    );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="flex items-center gap-2 text-slate-500">
                {icon}
                <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</p>
        </div>
    );
}

type ChartPoint = { label: string; value: number };

function toChartData(record: Record<string, number>): ChartPoint[] {
    return Object.entries(record)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
}

function ReportChartCard({
    title,
    subtitle,
    data,
    tone,
}: {
    title: string;
    subtitle: string;
    data: ChartPoint[];
    tone: "blue" | "emerald" | "violet";
}) {
    const toneClass = tone === "emerald"
        ? "from-emerald-500 to-teal-500"
        : tone === "violet"
            ? "from-violet-500 to-indigo-500"
            : "from-blue-600 to-cyan-500";
    const max = data.reduce((acc, item) => Math.max(acc, item.value), 0) || 1;

    return (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            <div className="mt-4 space-y-2">
                {data.length === 0 ? (
                    <p className="text-xs text-slate-500">No data yet.</p>
                ) : data.map((item) => (
                    <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                            <span className="truncate pr-2">{item.label}</span>
                            <span>{item.value}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white ring-1 ring-slate-100">
                            <div className={`h-full rounded-full bg-gradient-to-r ${toneClass}`} style={{ width: `${(item.value / max) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ImprovementPill({ label, done }: { label: string; done: boolean }) {
    return (
        <div className={`rounded-2xl border p-4 ${done ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-slate-50"}`}>
            <p className="text-sm font-bold text-slate-900">{label}</p>
            <p className={`mt-1 text-xs font-semibold ${done ? "text-emerald-700" : "text-slate-500"}`}>{done ? "Completed" : "Pending"}</p>
        </div>
    );
}

function UserRow({ name, meta, badge }: { name: string; meta: string; badge: string }) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-slate-900">{name}</p>
                    <p className="mt-1 text-xs text-slate-500">{meta}</p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">{badge}</span>
            </div>
        </div>
    );
}

function ActionButton({ children, tone, onClick }: { children: React.ReactNode; tone: "success" | "warning" | "danger" | "neutral"; onClick: () => void }) {
    const classes = {
        success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        warning: "bg-amber-50 text-amber-700 hover:bg-amber-100",
        danger: "bg-rose-50 text-rose-700 hover:bg-rose-100",
        neutral: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    }[tone];

    return (
        <button type="button" onClick={onClick} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${classes}`}>
            {children}
        </button>
    );
}

function WorkspaceLoading() {
    return (
        <div className="grid min-h-screen place-items-center bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
            <div className="rounded-3xl bg-white px-6 py-5 text-sm font-semibold text-slate-600 shadow-xl ring-1 ring-slate-100">
                Loading workspace…
            </div>
        </div>
    );
}
