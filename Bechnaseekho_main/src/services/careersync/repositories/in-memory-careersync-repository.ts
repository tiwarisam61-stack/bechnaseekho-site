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
    getDemoJobDeletionRequests,
    getDemoSavedJobIds,
    getDemoStateSnapshot,
    getDemoTableRows,
    getDemoUserById,
    getDemoUsersByRole,
    markAllDemoNotificationsRead,
    markDemoNotificationRead,
    clearReadDemoNotifications,
    recordDemoApplication,
    rejectDemoJob,
    requestDemoJobChanges,
    reviewDemoBlog,
    reviewDemoLeaveRequest,
    submitDemoBlogForReview,
    submitDemoLeaveRequest,
    toggleDemoSavedJob,
    updateDemoApplicationStatus,
    updateDemoTaskStatus,
    useDemoSnapshot,
    createLocalDemoSupabaseClient,
    type DemoApplicationRecord,
    type DemoBlogRecord,
    type DemoJobRecord,
    type DemoLeaveRequestRecord,
    type DemoNotificationRecord,
    type DemoRole,
    type DemoTaskRecord,
    type DemoUserRecord,
} from "@/lib/careersync-demo";
import type {
    ApplyJobRequest,
    CareerSyncRepository,
    ResumeUploadRequest,
    UploadedResume,
    UpsertJobRequest,
} from "./careersync-repository";

function rows<T>(table: Parameters<typeof getDemoTableRows>[0]): T[] {
    return getDemoTableRows(table) as T[];
}

function toTimestampName(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

export class InMemoryCareerSyncRepository implements CareerSyncRepository {
    private readonly localClient = createLocalDemoSupabaseClient();

    useSnapshot() {
        return useDemoSnapshot();
    }

    getSnapshot() {
        return getDemoStateSnapshot();
    }

    listApprovedJobs(): DemoJobRecord[] {
        return rows<DemoJobRecord>("jobs")
            .filter((job) => job.is_active && job.is_verified && job.status === "approved")
            .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    }

    listApplications(): DemoApplicationRecord[] {
        return rows<DemoApplicationRecord>("applications");
    }

    getJobById(jobId: string): DemoJobRecord | null {
        return rows<DemoJobRecord>("jobs").find((job) => job.id === jobId) ?? null;
    }

    listJobsByOwner(ownerId: string): DemoJobRecord[] {
        return rows<DemoJobRecord>("jobs").filter((job) => job.posted_by === ownerId);
    }

    getUserById(userId: string | null): DemoUserRecord | null {
        return getDemoUserById(userId);
    }

    getUsersByRole(role: DemoRole): DemoUserRecord[] {
        return getDemoUsersByRole(role);
    }

    getDisplayName(userId: string | null): string {
        return getDemoDisplayName(userId);
    }

    getSavedJobIds(userId: string | null): string[] {
        return getDemoSavedJobIds(userId);
    }

    toggleSavedJob(userId: string, jobId: string): void {
        toggleDemoSavedJob(userId, jobId);
    }

    listNotifications(userId: string | null): DemoNotificationRecord[] {
        return rows<DemoNotificationRecord>("notifications").filter((item) => item.user_id === userId);
    }

    markNotificationRead(notificationId: string): void {
        markDemoNotificationRead(notificationId);
    }

    markAllNotificationsRead(userId: string): void {
        markAllDemoNotificationsRead(userId);
    }

    clearReadNotifications(userId: string): void {
        clearReadDemoNotifications(userId);
    }

    async uploadResume(request: ResumeUploadRequest): Promise<UploadedResume> {
        const path = `${request.userId}/${Date.now()}-${toTimestampName(request.file.name)}`;
        const url = typeof URL !== "undefined" && typeof URL.createObjectURL === "function"
            ? URL.createObjectURL(request.file)
            : `local://resumes/${path}`;
        return { path, url, name: request.file.name };
    }

    applyToJob(request: ApplyJobRequest): void {
        recordDemoApplication({
            jobId: request.jobId,
            userId: request.userId,
            fullName: request.fullName,
            email: request.email,
            phone: request.phone,
            resumePath: request.resumePath,
            resumeUrl: request.resumeUrl,
            coverLetter: request.coverLetter,
        });
    }

    async createJob(request: UpsertJobRequest): Promise<void> {
        await this.localClient
            .from("jobs")
            .insert({
                role: request.role,
                company: request.company,
                location: request.location,
                employment_type: request.employmentType,
                experience: request.experience,
                salary: request.salary,
                description: request.description,
                tags: request.tags,
                status: "pending",
                posted_by: request.postedBy,
                is_active: true,
            });
    }

    async updateJob(jobId: string, request: UpsertJobRequest): Promise<void> {
        await this.localClient
            .from("jobs")
            .update({
                role: request.role,
                company: request.company,
                location: request.location,
                employment_type: request.employmentType,
                experience: request.experience,
                salary: request.salary,
                description: request.description,
                tags: request.tags,
                status: "pending",
            })
            .eq("id", jobId)
            .eq("posted_by", request.postedBy);
    }

    requestJobDeletion(jobId: string, actorUserId: string): void {
        deleteDemoJob(jobId, actorUserId);
    }

    approveJob(jobId: string, adminUserId: string): void {
        approveDemoJob(jobId, adminUserId);
    }

    rejectJob(jobId: string, adminUserId: string): void {
        rejectDemoJob(jobId, adminUserId);
    }

    requestJobChanges(jobId: string, adminUserId: string, notes?: string): void {
        requestDemoJobChanges(jobId, adminUserId, notes);
    }

    approveJobDeletion(requestId: string, adminUserId: string, approve: boolean, notes?: string): void {
        approveDemoJobDeletion(requestId, adminUserId, approve, notes);
    }

    updateApplicationStatus(applicationId: string, status: string): void {
        updateDemoApplicationStatus(applicationId, status);
    }

    listActivity(limit: number) {
        return getDemoActivityFeed(limit);
    }

    listDeletionRequests() {
        return getDemoJobDeletionRequests();
    }

    listEmployeeSnapshot(userId: string) {
        const snapshot = getDemoEmployeeSnapshot(userId);
        return {
            tasks: snapshot.tasks,
            timesheets: snapshot.timesheets,
            leaveRequests: snapshot.leaveRequests,
            chats: snapshot.chats,
            blogs: snapshot.blogs,
        };
    }

    createTask(input: { title: string; assigneeUserId: string; createdBy: string; description?: string | null; dueDate?: string | null; priority?: DemoTaskRecord["priority"] }): void {
        createDemoTask(input);
    }

    updateTaskStatus(taskId: string, status: DemoTaskRecord["status"], actorUserId: string): void {
        updateDemoTaskStatus(taskId, status, actorUserId);
    }

    addTimesheet(input: { userId: string; workDate: string; hours: number; taskSummary: string }): void {
        addDemoTimesheetEntry(input);
    }

    submitLeave(input: { userId: string; leaveType: DemoLeaveRequestRecord["leave_type"]; startDate: string; endDate: string; reason?: string | null }): void {
        submitDemoLeaveRequest(input);
    }

    reviewLeave(leaveId: string, reviewerId: string, approve: boolean): void {
        reviewDemoLeaveRequest(leaveId, reviewerId, approve);
    }

    createBlogDraft(input: { authorId: string; title: string; body: string }): void {
        createDemoBlogDraft(input);
    }

    submitBlogForReview(blogId: string, authorId: string): void {
        submitDemoBlogForReview(blogId, authorId);
    }

    reviewBlog(blogId: string, adminId: string, approve: boolean, notes?: string): void {
        reviewDemoBlog(blogId, adminId, approve, notes);
    }

    addChatMessage(input: { senderId: string; receiverId: string; body: string }): void {
        addDemoChatMessage(input);
    }
}