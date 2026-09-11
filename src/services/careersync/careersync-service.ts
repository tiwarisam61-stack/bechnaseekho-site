import { InMemoryCareerSyncRepository } from "./repositories/in-memory-careersync-repository";
import { DEMO_ACCOUNTS, mergeSharedDemoApplications, mergeSharedDemoJobs, requestDemoApplicationProfileUnlock, reviewDemoApplicationProfileUnlock, syncDemoUserFromAuth } from "@/lib/careersync-demo";
import type {
    ApplyJobRequest,
    CareerSyncRepository,
    ResumeUploadRequest,
    UpsertJobRequest,
} from "./repositories/careersync-repository";
export type { DemoApplicationRecord, DemoJobRecord } from "@/lib/careersync-demo";
export { DEMO_ACCOUNTS };

export function syncCareerSyncWorkspaceUser(input: Parameters<typeof syncDemoUserFromAuth>[0]) {
    syncDemoUserFromAuth(input);
}

export function mergeSharedCareerSyncJobs(jobs: Parameters<typeof mergeSharedDemoJobs>[0], localOwnerId?: string | null) {
    mergeSharedDemoJobs(jobs, localOwnerId);
}

export function mergeSharedCareerSyncApplications(applications: Parameters<typeof mergeSharedDemoApplications>[0]) {
    mergeSharedDemoApplications(applications);
}

const repo: CareerSyncRepository = new InMemoryCareerSyncRepository();

export function useCareerSyncSnapshot() {
    return repo.useSnapshot();
}

export function getCareerSyncDisplayName(userId: string | null) {
    return repo.getDisplayName(userId);
}

export function listCareerSyncApprovedJobs() {
    return repo.listApprovedJobs();
}

export function listCareerSyncJobsByOwner(ownerId: string) {
    return repo.listJobsByOwner(ownerId);
}

export function getCareerSyncJob(jobId: string) {
    return repo.getJobById(jobId);
}

export function getCareerSyncUser(userId: string | null) {
    return repo.getUserById(userId);
}

export function listCareerSyncUsersByRole(role: "admin" | "company" | "employee" | "candidate") {
    return repo.getUsersByRole(role);
}

export function listCareerSyncNotifications(userId: string | null) {
    return repo.listNotifications(userId);
}

export function getCareerSyncDashboardSummary(userId: string | null) {
    const snapshot = repo.getSnapshot();
    const notifications = repo.listNotifications(userId);
    const jobs = snapshot.jobs;
    const applications = repo.listApplications();
    return {
        role: userId ? repo.getUserById(userId)?.role ?? null : null,
        totalJobs: jobs.filter((job) => job.status === "approved" && job.is_active && job.is_verified).length,
        pendingJobs: jobs.filter((job) => job.status === "pending").length,
        myJobs: jobs.filter((job) => job.posted_by === userId),
        myApplications: applications.filter((application) => application.user_id === userId),
        unreadNotifications: notifications.filter((notification) => !notification.read_at).length,
        notifications,
        employeeCount: repo.getUsersByRole("employee").length,
        pendingLeaveRequests: snapshot.leaveRequests.filter((leave) => leave.status === "pending").length,
        pendingBlogs: snapshot.blogs.filter((blog) => blog.status === "pending_review").length,
        pendingDeletionRequests: repo.listDeletionRequests().filter((request) => request.status === "pending").length,
    };
}

export function getCareerSyncAdminAnalytics() {
    const snapshot = repo.getSnapshot();
    const approvedJobs = snapshot.jobs.filter((job) => job.status === "approved" && job.is_active && job.is_verified);
    const pendingJobs = snapshot.jobs.filter((job) => job.status === "pending");
    const totalApplications = snapshot.applications.length;
    const applicationStatusCounts = snapshot.applications.reduce<Record<string, number>>((acc, application) => {
        const key = application.status || "submitted";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});
    const approvalsPerCompany = snapshot.jobs.reduce<Record<string, number>>((acc, job) => {
        if (job.status !== "approved") return acc;
        const ownerId = job.posted_by ?? "unassigned";
        acc[ownerId] = (acc[ownerId] ?? 0) + 1;
        return acc;
    }, {});

    const topCompanies = Object.entries(approvalsPerCompany)
        .map(([userId, count]) => ({
            userId,
            company: repo.getDisplayName(userId),
            approvedJobs: count,
        }))
        .sort((a, b) => b.approvedJobs - a.approvedJobs)
        .slice(0, 5);

    return {
        totals: {
            approvedJobs: approvedJobs.length,
            pendingJobs: pendingJobs.length,
            totalApplications,
            totalUsers: snapshot.users.length,
            totalHrUsers: snapshot.users.filter((user) => user.role === "company").length,
            totalEmployees: snapshot.users.filter((user) => user.role === "employee").length,
            totalCandidates: snapshot.users.filter((user) => user.role === "candidate").length,
            pendingLeaves: snapshot.leaveRequests.filter((leave) => leave.status === "pending").length,
            pendingBlogs: snapshot.blogs.filter((blog) => blog.status === "pending_review").length,
            pendingDeleteRequests: snapshot.jobDeletionRequests.filter((request) => request.status === "pending").length,
        },
        applicationStatusCounts,
        topCompanies,
    };
}

export function getCareerSyncCompanyAnalytics(companyUserId: string) {
    const snapshot = repo.getSnapshot();
    const jobs = snapshot.jobs.filter((job) => job.posted_by === companyUserId);
    const jobIds = new Set(jobs.map((job) => job.id));
    const applications = snapshot.applications.filter((application) => jobIds.has(application.job_id));

    const jobsByStatus = jobs.reduce<Record<string, number>>((acc, job) => {
        acc[job.status] = (acc[job.status] ?? 0) + 1;
        return acc;
    }, {});

    const applicationsByStatus = applications.reduce<Record<string, number>>((acc, application) => {
        const key = application.status || "submitted";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});

    const recentApplicants = applications
        .slice()
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, 8)
        .map((application) => {
            const job = snapshot.jobs.find((item) => item.id === application.job_id);
            return {
                ...application,
                jobTitle: job?.role ?? "Role",
                jobCompany: job?.company ?? "Company",
            };
        });

    return {
        totals: {
            jobs: jobs.length,
            activeJobs: jobs.filter((job) => job.is_active).length,
            approvedJobs: jobs.filter((job) => job.status === "approved").length,
            pendingJobs: jobs.filter((job) => job.status === "pending").length,
            applications: applications.length,
        },
        jobsByStatus,
        applicationsByStatus,
        recentApplicants,
    };
}

export function getCareerSyncCandidateProgress(candidateUserId: string) {
    const snapshot = repo.getSnapshot();
    const user = repo.getUserById(candidateUserId);
    const applications = snapshot.applications.filter((application) => application.user_id === candidateUserId);
    const hasResume = applications.some((application) => Boolean(application.resume_url));
    const hasPhone = Boolean(user?.phone && user.phone.trim().length >= 8);
    const hasApplications = applications.length > 0;

    const completionPoints = [
        Boolean(user?.full_name && user.full_name.trim().length > 1),
        hasPhone,
        hasResume,
        hasApplications,
    ].filter(Boolean).length;

    const profileCompletion = Math.round((completionPoints / 4) * 100);

    const statusBreakdown = applications.reduce<Record<string, number>>((acc, application) => {
        const key = application.status || "submitted";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});

    return {
        profileCompletion,
        hasResume,
        hasPhone,
        totalApplications: applications.length,
        statusBreakdown,
    };
}

export function getCareerSyncLeadAssignments() {
    const snapshot = repo.getSnapshot();
    const hrUsers = snapshot.users.filter((user) => user.role === "company");
    if (hrUsers.length === 0) return [] as Array<{
        applicationId: string;
        candidateName: string;
        jobTitle: string;
        assignedHrId: string;
        assignedHrName: string;
    }>;

    const pendingApplications = snapshot.applications
        .filter((application) => application.status === "submitted" || application.status === "under_review")
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    return pendingApplications.map((application, index) => {
        const assignedHr = hrUsers[index % hrUsers.length];
        const job = snapshot.jobs.find((item) => item.id === application.job_id);
        return {
            applicationId: application.id,
            candidateName: application.full_name,
            jobTitle: job?.role ?? "Role",
            assignedHrId: assignedHr.id,
            assignedHrName: assignedHr.full_name,
        };
    });
}

export function markCareerSyncNotificationRead(notificationId: string) {
    repo.markNotificationRead(notificationId);
}

export function markAllCareerSyncNotificationsRead(userId: string) {
    repo.markAllNotificationsRead(userId);
}

export function clearReadCareerSyncNotifications(userId: string) {
    repo.clearReadNotifications(userId);
}

export function getCareerSyncSavedJobIds(userId: string | null) {
    return repo.getSavedJobIds(userId);
}

export function toggleCareerSyncSavedJob(userId: string, jobId: string) {
    repo.toggleSavedJob(userId, jobId);
}

export async function uploadCareerSyncResume(request: ResumeUploadRequest) {
    return repo.uploadResume(request);
}

export function applyCareerSyncJob(request: ApplyJobRequest) {
    const existing = repo
        .listApplications()
        .find((application) => application.user_id === request.userId && application.job_id === request.jobId);
    if (existing) {
        throw new Error("You have already applied for this job.");
    }
    repo.applyToJob(request);
}

export async function createCareerSyncJob(request: UpsertJobRequest) {
    await repo.createJob(request);
}

export async function updateCareerSyncJob(jobId: string, request: UpsertJobRequest) {
    await repo.updateJob(jobId, request);
}

export function requestCareerSyncJobDeletion(jobId: string, actorUserId: string) {
    repo.requestJobDeletion(jobId, actorUserId);
}

export function approveCareerSyncJob(jobId: string, adminUserId: string) {
    repo.approveJob(jobId, adminUserId);
}

export function rejectCareerSyncJob(jobId: string, adminUserId: string) {
    repo.rejectJob(jobId, adminUserId);
}

export function requestCareerSyncJobChanges(jobId: string, adminUserId: string, notes?: string) {
    repo.requestJobChanges(jobId, adminUserId, notes);
}

export function approveCareerSyncJobDeletion(requestId: string, adminUserId: string, approve: boolean, notes?: string) {
    repo.approveJobDeletion(requestId, adminUserId, approve, notes);
}

export function updateCareerSyncApplicationStatus(applicationId: string, status: string) {
    repo.updateApplicationStatus(applicationId, status);
}

export function listCareerSyncActivity(limit: number) {
    return repo.listActivity(limit);
}

export function listCareerSyncDeletionRequests() {
    return repo.listDeletionRequests();
}

export function getCareerSyncEmployeeSnapshot(userId: string) {
    return repo.listEmployeeSnapshot(userId);
}

export function createCareerSyncTask(input: { title: string; assigneeUserId: string; createdBy: string; description?: string | null; dueDate?: string | null; priority?: "low" | "medium" | "high" }) {
    repo.createTask(input);
}

export function updateCareerSyncTaskStatus(taskId: string, status: "todo" | "in_progress" | "blocked" | "done", actorUserId: string) {
    repo.updateTaskStatus(taskId, status, actorUserId);
}

export function addCareerSyncTimesheet(input: { userId: string; workDate: string; hours: number; taskSummary: string }) {
    repo.addTimesheet(input);
}

export function submitCareerSyncLeave(input: { userId: string; leaveType: "casual" | "sick" | "earned"; startDate: string; endDate: string; reason?: string | null }) {
    repo.submitLeave(input);
}

export function reviewCareerSyncLeave(leaveId: string, reviewerId: string, approve: boolean) {
    repo.reviewLeave(leaveId, reviewerId, approve);
}

export function createCareerSyncBlogDraft(input: { authorId: string; title: string; body: string }) {
    repo.createBlogDraft(input);
}

export function submitCareerSyncBlogForReview(blogId: string, authorId: string) {
    repo.submitBlogForReview(blogId, authorId);
}

export function reviewCareerSyncBlog(blogId: string, adminId: string, approve: boolean, notes?: string) {
    repo.reviewBlog(blogId, adminId, approve, notes);
}

export function addCareerSyncChatMessage(input: { senderId: string; receiverId: string; body: string }) {
    repo.addChatMessage(input);
}

// Compatibility exports for incremental migration from legacy demo helpers.
export const useDemoSnapshot = useCareerSyncSnapshot;
export const getDemoDisplayName = getCareerSyncDisplayName;
export const getDemoUserById = getCareerSyncUser;
export const getDashboardSummary = getCareerSyncDashboardSummary;
export const getDemoUsersByRole = listCareerSyncUsersByRole;
export const getDemoNotificationsForUser = listCareerSyncNotifications;
export const markDemoNotificationRead = markCareerSyncNotificationRead;
export const markAllDemoNotificationsRead = markAllCareerSyncNotificationsRead;
export const clearReadDemoNotifications = clearReadCareerSyncNotifications;
export const getDemoSavedJobIds = getCareerSyncSavedJobIds;
export const toggleDemoSavedJob = toggleCareerSyncSavedJob;
export const approveDemoJob = approveCareerSyncJob;
export const rejectDemoJob = rejectCareerSyncJob;
export const requestDemoJobChanges = requestCareerSyncJobChanges;
export const deleteDemoJob = requestCareerSyncJobDeletion;
export const approveDemoJobDeletion = approveCareerSyncJobDeletion;
export const updateDemoApplicationStatus = updateCareerSyncApplicationStatus;
export { requestDemoApplicationProfileUnlock, reviewDemoApplicationProfileUnlock };
export const getDemoActivityFeed = listCareerSyncActivity;
export const getDemoJobDeletionRequests = listCareerSyncDeletionRequests;
export const getDemoEmployeeSnapshot = getCareerSyncEmployeeSnapshot;
export const createDemoTask = createCareerSyncTask;
export const updateDemoTaskStatus = updateCareerSyncTaskStatus;
export const addDemoTimesheetEntry = addCareerSyncTimesheet;
export const submitDemoLeaveRequest = submitCareerSyncLeave;
export const reviewDemoLeaveRequest = reviewCareerSyncLeave;
export const createDemoBlogDraft = createCareerSyncBlogDraft;
export const submitDemoBlogForReview = submitCareerSyncBlogForReview;
export const reviewDemoBlog = reviewCareerSyncBlog;
export const addDemoChatMessage = addCareerSyncChatMessage;
