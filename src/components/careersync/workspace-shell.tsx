import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
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
    mergeSharedCareerSyncApplications,
    mergeSharedCareerSyncJobs,
    syncCareerSyncWorkspaceUser,
    reviewDemoBlog,
    reviewDemoLeaveRequest,
    rejectDemoJob,
    requestDemoJobChanges,
    submitDemoBlogForReview,
    submitDemoLeaveRequest,
    updateDemoTaskStatus,
    toggleDemoSavedJob,
    updateDemoApplicationStatus,
    useDemoSnapshot,
    type DemoJobRecord,
} from "@/services/careersync/careersync-service";
import { signOut } from "@/services/platform/auth-service";
import { notifyAdminWhatsAppSilently } from "@/lib/admin-whatsapp-notify";
import { fetchSharedCareerSyncApplications, fetchSharedCareerSyncJobs, reviewSharedCareerSyncJob } from "@/lib/careersync-jobs-api";
import { getRoleLabel } from "@/lib/careersync-rbac";
import { fallbackCareerSyncMatch } from "@/lib/careersync-match";
import { buildJobSheetPayload, submitToGoogleSheet } from "@/lib/google-sheet-submit";

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
    const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;
    const companyName = typeof user?.user_metadata?.company_name === "string" ? user.user_metadata.company_name : null;
    const phone = typeof user?.user_metadata?.phone === "string" ? user.user_metadata.phone : null;

    useEffect(() => {
        if (!user || !role) return;
        syncCareerSyncWorkspaceUser({
            id: user.id,
            email: user.email,
            role,
            fullName,
            companyName,
            phone,
        });
    }, [companyName, fullName, phone, role, user?.email, user?.id]);

    useEffect(() => {
        if (!user || !role || (role !== "admin" && role !== "company")) return;
        let cancelled = false;
        Promise.all([
            fetchSharedCareerSyncJobs({ role, userId: user.id, email: user.email }),
            fetchSharedCareerSyncApplications({ role, userId: user.id, email: user.email }),
        ])
            .then(([jobs, applications]) => {
                if (cancelled) return;
                mergeSharedCareerSyncJobs(jobs, role === "company" ? user.id : null);
                mergeSharedCareerSyncApplications(applications);
            })
            .catch((error) => {
                console.warn("[CareerSync] Shared workspace sync failed", error);
            });
        return () => {
            cancelled = true;
        };
    }, [role, user?.email, user?.id]);

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
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2.5 rounded-full bg-white px-3 py-2 ring-1 ring-slate-100">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md"><ShieldCheck className="h-4 w-4" /></div>
                            <div className="leading-tight"><p className="text-sm font-black tracking-tight">CareerSync</p><p className="text-[11px] font-semibold text-slate-500">Role workspace</p></div>
                        </Link>
                        <div className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 sm:inline-flex">
                            {getRoleLabel(role)} access
                        </div>
                    </div>

                    <nav className="flex w-full flex-wrap items-center justify-start gap-2 lg:w-auto lg:flex-1">
                        {navItems.map((item) => (
                            item.href.startsWith("#") ? (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(event) => {
                                        if (role !== "company") return;
                                        event.preventDefault();
                                        window.history.replaceState(null, "", item.href);
                                        window.dispatchEvent(new CustomEvent("careersync-company-section", { detail: item.href.slice(1) }));
                                    }}
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

function sendAdminApprovalAlert(input: {
    title: string;
    message: string;
    actor?: string;
    entity?: string;
    href?: string;
}) {
    notifyAdminWhatsAppSilently({
        type: "approval_request",
        href: input.href ?? "/careersync?workspace=1",
        ...input,
    });
}

type CompanyWorkspaceTab = "overview" | "jobs" | "pipeline" | "candidates" | "analytics" | "notifications" | "profile";

const COMPANY_SECTION_TABS: Record<string, CompanyWorkspaceTab> = {
    dashboard: "overview",
    "my-jobs": "jobs",
    applicants: "candidates",
    analytics: "analytics",
    notifications: "notifications",
    profile: "profile",
};

function getCompanyWorkspaceTab(section: string) {
    return COMPANY_SECTION_TABS[section.replace(/^#/, "")] ?? "overview";
}

function CompanyWorkspace({ userId, snapshot }: { userId: string; snapshot: ReturnType<typeof useDemoSnapshot> }) {
    const myJobs = snapshot.jobs.filter((job) => job.posted_by === userId);
    const myNotifications = getDemoNotificationsForUser(userId);
    const myApplications = snapshot.applications.filter((application) => myJobs.some((job) => job.id === application.job_id));
    const companyAnalytics = getCareerSyncCompanyAnalytics(userId);
    const [activeTab, setActiveTab] = useState<CompanyWorkspaceTab>(() => {
        if (typeof window === "undefined") return "overview";
        return getCompanyWorkspaceTab(window.location.hash);
    });
    const [selectedRoleId, setSelectedRoleId] = useState<string | "all">("all");
    const [candidateQuery, setCandidateQuery] = useState("");
    const companyName = myJobs[0]?.company || snapshot.users.find((user) => user.id === userId)?.company_name || getDemoDisplayName(userId);

    const roleOptions = useMemo(() => myJobs.map((job, index) => {
        const applications = myApplications.filter((application) => application.job_id === job.id);
        const activeApplications = applications.filter((application) => !["rejected", "withdrawn"].includes(application.status));
        const avgFit = applications.length ? Math.round(applications.reduce((sum, application) => sum + getApplicationFit(application, job), 0) / applications.length) : 0;
        return {
            ...job,
            code: String(index + 1).padStart(2, "0"),
            applications,
            activeApplications,
            avgFit,
        };
    }), [myApplications, myJobs]);

    const selectedJobIds = selectedRoleId === "all" ? new Set(myJobs.map((job) => job.id)) : new Set([selectedRoleId]);
    const filteredApplications = useMemo(() => {
        const query = candidateQuery.trim().toLowerCase();
        return myApplications
            .filter((application) => selectedJobIds.has(application.job_id))
            .map((application) => {
                const job = myJobs.find((item) => item.id === application.job_id);
                return {
                    ...application,
                    job,
                    fit: getApplicationFit(application, job),
                };
            })
            .filter((application) => {
                if (!query) return true;
                return [
                    application.full_name,
                    application.email,
                    application.phone ?? "",
                    application.job?.role ?? "",
                    application.job?.company ?? "",
                    ...(application.job?.tags ?? []),
                    ...(application.job?.required_skills ?? []),
                ].join(" ").toLowerCase().includes(query);
            })
            .sort((a, b) => b.fit - a.fit || (a.created_at < b.created_at ? 1 : -1));
    }, [candidateQuery, myApplications, myJobs, selectedJobIds]);

    const openRoles = myJobs.filter((job) => job.is_active && job.status !== "rejected").length;
    const avgFit = filteredApplications.length ? Math.round(filteredApplications.reduce((sum, application) => sum + application.fit, 0) / filteredApplications.length) : 0;
    const atRiskCount = filteredApplications.filter((application) => application.fit < 62 || application.status === "submitted").length;
    const stageCounts = filteredApplications.reduce<Record<string, number>>((acc, application) => {
        const stage = recruiterStage(application.status);
        acc[stage] = (acc[stage] ?? 0) + 1;
        return acc;
    }, {});

    const tabs = [
        ["overview", "Dashboard"],
        ["jobs", "My Jobs"],
        ["pipeline", "Pipeline"],
        ["candidates", "Applicants"],
        ["analytics", "Analytics"],
        ["notifications", "Notifications"],
        ["profile", "Profile"],
    ] as const;

    useEffect(() => {
        const applyHash = () => setActiveTab(getCompanyWorkspaceTab(window.location.hash));
        const applySection = (event: Event) => {
            const section = event instanceof CustomEvent && typeof event.detail === "string" ? event.detail : "";
            setActiveTab(getCompanyWorkspaceTab(section));
        };

        applyHash();
        window.addEventListener("hashchange", applyHash);
        window.addEventListener("careersync-company-section", applySection);
        return () => {
            window.removeEventListener("hashchange", applyHash);
            window.removeEventListener("careersync-company-section", applySection);
        };
    }, []);

    return (
        <div className="min-h-screen rounded-[1.25rem] bg-[#F6F5F1] p-3 text-[#171B2B] sm:p-5">
            <div className="mx-auto max-w-[1240px] space-y-5">
                <section className="rounded-2xl bg-[#0F1424] p-5 text-white shadow-[0_22px_60px_-36px_rgba(15,20,36,0.65)] sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#3D5AFE] to-[#2438C4] font-black">
                                CS
                            </div>
                            <div>
                                <h1 className="font-display text-xl font-black tracking-tight">CareerSync — Company Dashboard</h1>
                                <p className="mt-0.5 text-xs font-semibold text-[#B7BEDA]">Recruiter workspace wired to current jobs, applicants, and notifications.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#171E33] px-3 py-2 text-xs font-semibold text-[#C9D0EE] ring-1 ring-[#2A3350]">
                                <span className="h-2 w-2 rounded-full bg-[#2FBF71] shadow-[0_0_0_4px_rgba(47,191,113,0.18)]" />
                                Live sync active
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#171E33] px-3 py-2 text-sm font-bold ring-1 ring-[#2A3350]">
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#F5A623] text-[11px] text-[#4A2F00]">{companyName.slice(0, 2).toUpperCase()}</span>
                                {companyName}
                            </span>
                        </div>
                    </div>
                </section>

                <nav className="flex gap-1 overflow-x-auto border-b border-[#E4E2DA]">
                    {tabs.map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition ${activeTab === id ? "border-[#3D5AFE] text-[#171B2B]" : "border-transparent text-[#5B6172] hover:text-[#171B2B]"}`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                    <RecruiterKpi label="Open roles" value={String(openRoles)} helper={`${companyAnalytics.totals.pendingJobs} pending approval`} tone="blue" />
                    <RecruiterKpi label="Total applicants" value={String(myApplications.length)} helper="from current workspace data" tone="amber" />
                    <RecruiterKpi label="Avg fit score" value={`${avgFit}%`} helper={avgFit >= 70 ? "healthy candidate pool" : "needs more strong fits"} tone="green" />
                    <RecruiterKpi label="At-risk candidates" value={String(atRiskCount)} helper="new or low-fit profiles" tone="red" />
                    <RecruiterKpi label="Unread alerts" value={String(myNotifications.filter((item) => !item.read_at).length)} helper="recruiter notifications" tone="slate" />
                </div>

                {activeTab === "overview" && (
                    <div className="space-y-5">
                        <div className="grid gap-3 lg:grid-cols-3">
                            <RecruiterInsight tone="red" title="Needs attention" text={`${filteredApplications.filter((application) => application.status === "submitted").length} new applicants are waiting for first review.`} />
                            <RecruiterInsight tone="blue" title="Pipeline signal" text={`${filteredApplications.filter((application) => application.fit >= 80).length} candidates have an 80%+ AI fit estimate for selected roles.`} />
                            <RecruiterInsight tone="green" title="Conversion clue" text={`${stageCounts.Interview ?? 0} candidates are already in interview stage across your visible roles.`} />
                        </div>

                        <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
                            <RecruiterPanel title="Open job roles" action={<Link to="/post-job" className="rounded-xl bg-[#0F1424] px-4 py-2 text-xs font-black text-white transition hover:bg-[#171E33]">+ Post new role</Link>}>
                                {roleOptions.length === 0 ? (
                                    <EmptyState title="No jobs yet" message="Post your first role to start building a hiring pipeline." />
                                ) : (
                                    <div className="space-y-2">
                                        {roleOptions.map((job) => (
                                            <button
                                                key={job.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedRoleId(job.id);
                                                    setActiveTab("candidates");
                                                }}
                                                className="flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-[#E4E2DA] hover:bg-[#FAFAF7]"
                                            >
                                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#E4E2DA] bg-[#F6F5F1] font-display text-sm font-black text-[#5B6172]">{job.code}</span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-black text-[#171B2B]">{job.role}</span>
                                                    <span className="mt-0.5 block truncate text-xs font-semibold text-[#5B6172]">{job.location || "Location open"} · {job.employment_type || "Role type"} · {job.status}</span>
                                                </span>
                                                <span className="text-right">
                                                    <span className="block font-display text-base font-black text-[#1A2FAE]">{job.applications.length}</span>
                                                    <span className="text-[11px] font-semibold text-[#5B6172]">matched</span>
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </RecruiterPanel>

                            <RecruiterPanel title="Top matched candidates" caption="ranked by fit">
                                <div className="space-y-2">
                                    {filteredApplications.slice(0, 5).map((application) => (
                                        <RecruiterCandidateCard key={application.id} application={application} compact />
                                    ))}
                                    {filteredApplications.length === 0 && <EmptyState title="No applicants yet" message="Applicants will appear here after candidates apply to your roles." />}
                                </div>
                            </RecruiterPanel>
                        </div>
                    </div>
                )}

                {activeTab === "pipeline" && (
                    <RecruiterPanel title="Hiring pipeline" caption="move applicants through stages from current data">
                        <RoleFilter roles={roleOptions} selectedRoleId={selectedRoleId} onSelect={setSelectedRoleId} />
                        <div className="mt-4 grid gap-3 lg:grid-cols-5">
                            {["Applied", "Screening", "Interview", "Offer", "Rejected"].map((stage) => {
                                const stageItems = filteredApplications.filter((application) => recruiterStage(application.status) === stage);
                                return (
                                    <div key={stage} className="min-h-48 rounded-xl border border-[#E4E2DA] bg-[#F6F5F1] p-3">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-wide text-[#5B6172]">{stage}</h3>
                                            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-[#5B6172] ring-1 ring-[#E4E2DA]">{stageItems.length}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {stageItems.map((application) => (
                                                <div key={application.id} className="rounded-xl border border-[#E4E2DA] bg-white p-3 shadow-sm">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-sm font-black text-[#171B2B]">{application.full_name}</p>
                                                            <p className="mt-0.5 text-[11px] font-semibold text-[#5B6172]">{application.job?.role ?? "Role"}</p>
                                                        </div>
                                                        <span className="rounded-full bg-[#DCE1FF] px-2 py-1 text-[11px] font-black text-[#1A2FAE]">{application.fit}%</span>
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                                        <ActionButton tone="neutral" onClick={() => updateDemoApplicationStatus(application.id, "under_review")}>Screen</ActionButton>
                                                        <ActionButton tone="success" onClick={() => updateDemoApplicationStatus(application.id, "interview")}>Interview</ActionButton>
                                                        <ActionButton tone="danger" onClick={() => updateDemoApplicationStatus(application.id, "rejected")}>Reject</ActionButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </RecruiterPanel>
                )}

                {activeTab === "jobs" && (
                    <RecruiterPanel title="My Jobs" caption={`${myJobs.length} roles posted from this company workspace`} action={<Link to="/post-job" className="rounded-xl bg-[#0F1424] px-4 py-2 text-xs font-black text-white transition hover:bg-[#171E33]">+ Post new role</Link>}>
                        {myJobs.length === 0 ? (
                            <EmptyState title="No jobs yet" message="Post your first role to start building a hiring pipeline." />
                        ) : (
                            <div className="grid gap-3 lg:grid-cols-2">
                                {myJobs.map((job) => <CompanyJobCard key={job.id} job={job} companyUserId={userId} />)}
                            </div>
                        )}
                    </RecruiterPanel>
                )}

                {activeTab === "candidates" && (
                    <RecruiterPanel title="AI-matched candidates" caption={`${filteredApplications.length} shown`}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <RoleFilter roles={roleOptions} selectedRoleId={selectedRoleId} onSelect={setSelectedRoleId} />
                            <input
                                value={candidateQuery}
                                onChange={(event) => setCandidateQuery(event.target.value)}
                                placeholder="Search by name, skill, or role..."
                                className="min-h-10 rounded-xl border border-[#E4E2DA] bg-[#F6F5F1] px-3 text-sm font-semibold outline-none transition focus:border-[#3D5AFE] focus:bg-white sm:w-80"
                            />
                        </div>
                        <div className="mt-4 space-y-3">
                            {filteredApplications.map((application) => <RecruiterCandidateCard key={application.id} application={application} />)}
                            {filteredApplications.length === 0 && <EmptyState title="No candidates match" message="Try clearing the search or selecting all roles." />}
                        </div>
                    </RecruiterPanel>
                )}

                {activeTab === "analytics" && (
                    <div className="grid gap-5 lg:grid-cols-2">
                        <RecruiterPanel title="Applicants by stage" caption="current pipeline">
                            <RecruiterBarList data={["Applied", "Screening", "Interview", "Offer", "Rejected"].map((stage) => ({ label: stage, value: stageCounts[stage] ?? 0 }))} />
                        </RecruiterPanel>
                        <RecruiterPanel title="Jobs by status" caption="approval and publish flow">
                            <RecruiterBarList data={toChartData(companyAnalytics.jobsByStatus)} />
                        </RecruiterPanel>
                        <RecruiterPanel title="Average fit by role" caption="AI score estimate">
                            <RecruiterBarList data={roleOptions.map((job) => ({ label: job.role, value: job.avgFit }))} suffix="%" />
                        </RecruiterPanel>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <RecruiterPanel title="Notifications" caption="Recruiter alerts for this workspace">
                        <NotificationList notifications={myNotifications} emptyLabel="No HR notifications yet." />
                    </RecruiterPanel>
                )}

                {activeTab === "profile" && (
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                        <RecruiterPanel title="Company profile" caption="visible in recruiter workspace">
                            <div className="flex items-start gap-4">
                                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#3D5AFE] font-display text-2xl font-black text-white">{companyName.slice(0, 2).toUpperCase()}</div>
                                <div>
                                    <h2 className="font-display text-2xl font-black tracking-tight text-[#171B2B]">{companyName}</h2>
                                    <p className="mt-2 text-sm font-semibold leading-6 text-[#5B6172]">
                                        {myJobs[0]?.company_overview || "Recruiter profile powered by CareerSync. Company details and open roles are pulled from current job records."}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-[#DCE1FF] px-3 py-1.5 text-xs font-black text-[#1A2FAE]">{myJobs.length} job roles</span>
                                        <span className="rounded-full bg-[#DBF3E5] px-3 py-1.5 text-xs font-black text-[#1C7A48]">{myApplications.length} applicants</span>
                                        <span className="rounded-full bg-[#FCEBCB] px-3 py-1.5 text-xs font-black text-[#8A5A00]">{getDemoDisplayName(userId)}</span>
                                    </div>
                                </div>
                            </div>
                        </RecruiterPanel>
                        <RecruiterPanel title="Recruiter plan" caption="workspace limits">
                            <div className="space-y-3">
                                <ProfileMetric label="Active job roles" value={`${companyAnalytics.totals.activeJobs} of 15`} />
                                <ProfileMetric label="Approved roles" value={String(companyAnalytics.totals.approvedJobs)} />
                                <ProfileMetric label="Pending approval" value={String(companyAnalytics.totals.pendingJobs)} />
                                <ProfileMetric label="Workspace owner" value={getDemoDisplayName(userId)} />
                            </div>
                        </RecruiterPanel>
                    </div>
                )}
            </div>
        </div>
    );
}

function getApplicationFit(application: {
    id: string;
    job_id: string;
    full_name: string;
    email: string;
    phone: string | null;
    cover_letter: string | null;
    resume_path: string | null;
    resume_url: string | null;
    ai_match_score?: number | null;
}, job?: DemoJobRecord) {
    if (typeof application.ai_match_score === "number") return application.ai_match_score;
    if (!job) return 0;
    return fallbackCareerSyncMatch({
        job,
        candidate: {
            full_name: application.full_name,
            email: application.email,
            phone: application.phone,
            cover_letter: application.cover_letter,
            resume_path: application.resume_path,
            resume_url: application.resume_url,
            resumeName: application.resume_path?.split("/").pop() ?? null,
        },
    }).fitScore;
}

function recruiterStage(status: string) {
    const normalized = status.toLowerCase().replace(/[\s-]+/g, "_");
    if (normalized.includes("reject")) return "Rejected";
    if (normalized.includes("offer")) return "Offer";
    if (normalized.includes("interview")) return "Interview";
    if (normalized.includes("review") || normalized.includes("screen")) return "Screening";
    return "Applied";
}

function RecruiterKpi({ label, value, helper, tone }: { label: string; value: string; helper: string; tone: "blue" | "amber" | "green" | "red" | "slate" }) {
    const tones = {
        blue: "bg-[#DCE1FF] text-[#1A2FAE]",
        amber: "bg-[#FCEBCB] text-[#8A5A00]",
        green: "bg-[#DBF3E5] text-[#1C7A48]",
        red: "bg-[#FBE1DF] text-[#A32D2D]",
        slate: "bg-[#EEEDE7] text-[#5B6172]",
    };
    return (
        <div className="rounded-2xl border border-[#E4E2DA] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-[#5B6172]">{label}</p>
                <span className={`grid h-6 w-6 place-items-center rounded-lg text-xs font-black ${tones[tone]}`}>◧</span>
            </div>
            <p className="mt-3 font-display text-3xl font-black tracking-tight text-[#171B2B]">{value}</p>
            <p className="mt-1 text-xs font-semibold text-[#5B6172]">{helper}</p>
        </div>
    );
}

function RecruiterPanel({ title, caption, action, children }: { title: string; caption?: string; action?: ReactNode; children: ReactNode }) {
    return (
        <section className="rounded-2xl border border-[#E4E2DA] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="font-display text-lg font-black tracking-tight text-[#171B2B]">{title}</h2>
                    {caption && <p className="mt-0.5 text-xs font-semibold text-[#5B6172]">{caption}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

function RecruiterInsight({ title, text, tone }: { title: string; text: string; tone: "blue" | "green" | "red" }) {
    const toneClass = tone === "red" ? "border-l-[#E2504A] text-[#E2504A]" : tone === "green" ? "border-l-[#2FBF71] text-[#2FBF71]" : "border-l-[#3D5AFE] text-[#3D5AFE]";
    return (
        <div className={`rounded-xl border border-[#E4E2DA] border-l-4 bg-white p-4 ${toneClass}`}>
            <p className="text-[11px] font-black uppercase tracking-wide">{title}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#171B2B]">{text}</p>
        </div>
    );
}

function RoleFilter({
    roles,
    selectedRoleId,
    onSelect,
}: {
    roles: Array<DemoJobRecord & { code: string; applications: unknown[]; activeApplications: unknown[]; avgFit: number }>;
    selectedRoleId: string | "all";
    onSelect: (id: string | "all") => void;
}) {
    return (
        <div className="flex gap-2 overflow-x-auto">
            <button
                type="button"
                onClick={() => onSelect("all")}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ring-1 transition ${selectedRoleId === "all" ? "bg-[#0F1424] text-white ring-[#0F1424]" : "bg-[#F6F5F1] text-[#5B6172] ring-[#E4E2DA] hover:text-[#171B2B]"}`}
            >
                All roles
            </button>
            {roles.map((role) => (
                <button
                    key={role.id}
                    type="button"
                    onClick={() => onSelect(role.id)}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ring-1 transition ${selectedRoleId === role.id ? "bg-[#0F1424] text-white ring-[#0F1424]" : "bg-[#F6F5F1] text-[#5B6172] ring-[#E4E2DA] hover:text-[#171B2B]"}`}
                >
                    {role.role}
                </button>
            ))}
        </div>
    );
}

function RecruiterCandidateCard({
    application,
    compact = false,
}: {
    application: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        resume_url: string | null;
        status: string;
        created_at: string;
        fit: number;
        ai_match_reason?: string | null;
        ai_matched_skills?: string[] | null;
        ai_missing_skills?: string[] | null;
        ai_score_source?: "ai" | "fallback" | null;
        job?: DemoJobRecord;
    };
    compact?: boolean;
}) {
    const fitTone = application.fit >= 80 ? "text-[#1C7A48]" : application.fit >= 68 ? "text-[#8A5A00]" : "text-[#A32D2D]";
    return (
        <article className="rounded-2xl border border-[#E4E2DA] bg-white p-4">
            <div className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0">
                    <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#EEEDE7" strokeWidth="5" />
                        <circle cx="22" cy="22" r="18" fill="none" stroke={application.fit >= 80 ? "#2FBF71" : application.fit >= 68 ? "#F5A623" : "#E2504A"} strokeWidth="5" strokeDasharray={`${application.fit * 1.13} 113`} strokeLinecap="round" />
                    </svg>
                    <span className={`absolute inset-0 grid place-items-center font-display text-sm font-black ${fitTone}`}>{application.fit}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-black text-[#171B2B]">{application.full_name}</h3>
                            <p className="mt-0.5 text-xs font-semibold text-[#5B6172]">{application.job?.role ?? "Role"} · {application.job?.location ?? "Location open"}</p>
                        </div>
                        <span className="rounded-full bg-[#F6F5F1] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#5B6172] ring-1 ring-[#E4E2DA]">{recruiterStage(application.status)}</span>
                    </div>
                    {!compact && (
                        <>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {(application.ai_matched_skills?.length ? application.ai_matched_skills : application.job?.required_skills ?? application.job?.tags ?? []).slice(0, 4).map((skill) => (
                                    <span key={skill} className="rounded-full bg-[#F6F5F1] px-2 py-1 text-[11px] font-bold text-[#5B6172] ring-1 ring-[#E4E2DA]">{skill}</span>
                                ))}
                            </div>
                            {application.ai_match_reason && (
                                <p className="mt-3 rounded-xl bg-[#F6F5F1] px-3 py-2 text-xs font-semibold leading-5 text-[#5B6172]">
                                    {application.ai_match_reason}
                                </p>
                            )}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {application.resume_url ? (
                                    <a href={application.resume_url} target="_blank" rel="noopener" className="rounded-full bg-[#F6F5F1] px-3 py-1.5 text-xs font-black text-[#171B2B] ring-1 ring-[#E4E2DA] transition hover:bg-white">Resume</a>
                                ) : (
                                    <span className="rounded-full bg-[#EEEDE7] px-3 py-1.5 text-xs font-black text-[#5B6172]">No resume</span>
                                )}
                                <a href={`mailto:${application.email}`} className="rounded-full bg-[#DCE1FF] px-3 py-1.5 text-xs font-black text-[#1A2FAE]">Email</a>
                                <ActionButton tone="neutral" onClick={() => updateDemoApplicationStatus(application.id, "under_review")}>Under review</ActionButton>
                                <ActionButton tone="success" onClick={() => updateDemoApplicationStatus(application.id, "interview")}>Interview</ActionButton>
                                <ActionButton tone="danger" onClick={() => updateDemoApplicationStatus(application.id, "rejected")}>Reject</ActionButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}

function RecruiterBarList({ data, suffix = "" }: { data: Array<{ label: string; value: number }>; suffix?: string }) {
    const max = Math.max(1, ...data.map((item) => item.value));
    return (
        <div className="space-y-3">
            {data.length === 0 ? <EmptyState title="No data yet" message="Analytics will fill in as roles and applicants are created." /> : data.map((item) => (
                <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs font-black text-[#5B6172]">
                        <span className="truncate">{item.label}</span>
                        <span>{item.value}{suffix}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[#EEEDE7]">
                        <div className="h-full rounded-full bg-[#3D5AFE]" style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E4E2DA] bg-[#F6F5F1] px-3 py-3">
            <span className="text-sm font-bold text-[#5B6172]">{label}</span>
            <strong className="text-sm text-[#171B2B]">{value}</strong>
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
                    <ActionButton tone="success" onClick={() => {
                        const startDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
                        const endDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
                        submitDemoLeaveRequest({ userId, leaveType: "casual", startDate, endDate, reason: "Personal work" });
                        sendAdminApprovalAlert({
                            title: "Leave approval requested",
                            message: `${getDemoDisplayName(userId)} requested casual leave from ${startDate} to ${endDate}.`,
                            href: "/careersync?workspace=1#employees",
                            actor: getDemoDisplayName(userId),
                            entity: "Casual leave",
                        });
                    }}>
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
                        <ActionButton key={blog.id} tone="success" onClick={() => {
                            submitDemoBlogForReview(blog.id, userId);
                            sendAdminApprovalAlert({
                                title: "Blog approval requested",
                                message: `${getDemoDisplayName(userId)} submitted "${blog.title}" for approval.`,
                                href: "/careersync?workspace=1#blog-approval",
                                actor: getDemoDisplayName(userId),
                                entity: blog.title,
                            });
                        }}>
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
    const [reviewing, setReviewing] = useState<DemoJobRecord["status"] | null>(null);
    const reviewer = getDemoDisplayName(adminUserId);
    const submitReview = async (status: DemoJobRecord["status"], action: string, localUpdate: () => void) => {
        setReviewing(status);
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
        } finally {
            setReviewing(null);
        }
    };

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
            <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                <p><span className="font-bold text-slate-800">Salary:</span> {job.salary || "Not provided"}</p>
                <p><span className="font-bold text-slate-800">Experience:</span> {job.experience || "Not provided"}</p>
                <p><span className="font-bold text-slate-800">Type:</span> {job.employment_type || "Not provided"}</p>
                <p><span className="font-bold text-slate-800">Posted by:</span> {job.posted_by ? getDemoDisplayName(job.posted_by) : job.recruiter_email || "Company workspace"}</p>
            </div>
            {job.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-amber-100">
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}
            <p className="mt-3 line-clamp-4 text-xs leading-5 text-slate-600">{job.description || "No description provided."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton tone="success" disabled={Boolean(reviewing)} onClick={() => submitReview("approved", "approved", () => approveDemoJob(job.id, adminUserId))}>
                    {reviewing === "approved" ? "Logging..." : "Approve"}
                </ActionButton>
                <ActionButton tone="warning" disabled={Boolean(reviewing)} onClick={() => submitReview("changes_requested", "changes_requested", () => requestDemoJobChanges(job.id, adminUserId, "Please add more detail to the job description and requirements."))}>
                    {reviewing === "changes_requested" ? "Logging..." : "Request changes"}
                </ActionButton>
                <ActionButton tone="danger" disabled={Boolean(reviewing)} onClick={() => submitReview("rejected", "rejected", () => rejectDemoJob(job.id, adminUserId))}>
                    {reviewing === "rejected" ? "Logging..." : "Reject"}
                </ActionButton>
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
                <ActionButton tone="danger" onClick={() => {
                    deleteDemoJob(job.id, companyUserId);
                    sendAdminApprovalAlert({
                        title: "Job deletion approval requested",
                        message: `${getDemoDisplayName(companyUserId)} requested deletion for ${job.role} at ${job.company}.`,
                        href: "/careersync?workspace=1#delete-requests",
                        actor: getDemoDisplayName(companyUserId),
                        entity: `${job.role} · ${job.company}`,
                    });
                }}>Delete</ActionButton>
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

function ActionButton({ children, tone, onClick, disabled = false }: { children: React.ReactNode; tone: "success" | "warning" | "danger" | "neutral"; onClick: () => void; disabled?: boolean }) {
    const classes = {
        success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        warning: "bg-amber-50 text-amber-700 hover:bg-amber-100",
        danger: "bg-rose-50 text-rose-700 hover:bg-rose-100",
        neutral: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    }[tone];

    return (
        <button type="button" onClick={onClick} disabled={disabled} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${classes}`}>
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
