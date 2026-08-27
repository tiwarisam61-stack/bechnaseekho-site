import type {
    DemoActivityRecord,
    DemoApplicationRecord,
    DemoBlogRecord,
    DemoJobDeletionRequestRecord,
    DemoJobRecord,
    DemoLeaveRequestRecord,
    DemoNotificationRecord,
    DemoRole,
    DemoTaskRecord,
    DemoTimesheetRecord,
    DemoUserRecord,
} from "@/lib/careersync-demo";

export type UploadedResume = {
    path: string;
    url: string;
    name: string;
};

export type ResumeUploadRequest = {
    userId: string;
    file: File;
};

export type ApplyJobRequest = {
    jobId: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string | null;
    resumePath: string | null;
    resumeUrl: string | null;
    coverLetter: string | null;
};

export type UpsertJobRequest = {
    role: string;
    company: string;
    location: string;
    employmentType: string;
    experience: string;
    salary: string;
    description: string;
    tags: string[];
    postedBy: string;
};

export interface CareerSyncRepository {
    useSnapshot(): {
        users: DemoUserRecord[];
        jobs: DemoJobRecord[];
        applications: DemoApplicationRecord[];
        notifications: DemoNotificationRecord[];
        tasks: DemoTaskRecord[];
        timesheets: DemoTimesheetRecord[];
        leaveRequests: DemoLeaveRequestRecord[];
        blogs: DemoBlogRecord[];
        activity: DemoActivityRecord[];
        jobDeletionRequests: DemoJobDeletionRequestRecord[];
        savedJobIdsByUser: Record<string, string[]>;
    };
    getSnapshot(): {
        users: DemoUserRecord[];
        jobs: DemoJobRecord[];
        applications: DemoApplicationRecord[];
        notifications: DemoNotificationRecord[];
        tasks: DemoTaskRecord[];
        timesheets: DemoTimesheetRecord[];
        leaveRequests: DemoLeaveRequestRecord[];
        blogs: DemoBlogRecord[];
        activity: DemoActivityRecord[];
        jobDeletionRequests: DemoJobDeletionRequestRecord[];
        savedJobIdsByUser: Record<string, string[]>;
    };
    listApprovedJobs(): DemoJobRecord[];
    listApplications(): DemoApplicationRecord[];
    getJobById(jobId: string): DemoJobRecord | null;
    listJobsByOwner(ownerId: string): DemoJobRecord[];
    getUserById(userId: string | null): DemoUserRecord | null;
    getUsersByRole(role: DemoRole): DemoUserRecord[];
    getDisplayName(userId: string | null): string;
    getSavedJobIds(userId: string | null): string[];
    toggleSavedJob(userId: string, jobId: string): void;
    listNotifications(userId: string | null): DemoNotificationRecord[];
    markNotificationRead(notificationId: string): void;
    markAllNotificationsRead(userId: string): void;
    clearReadNotifications(userId: string): void;
    uploadResume(request: ResumeUploadRequest): Promise<UploadedResume>;
    applyToJob(request: ApplyJobRequest): void;
    createJob(request: UpsertJobRequest): Promise<void>;
    updateJob(jobId: string, request: UpsertJobRequest): Promise<void>;
    requestJobDeletion(jobId: string, actorUserId: string): void;
    approveJob(jobId: string, adminUserId: string): void;
    rejectJob(jobId: string, adminUserId: string): void;
    requestJobChanges(jobId: string, adminUserId: string, notes?: string): void;
    approveJobDeletion(requestId: string, adminUserId: string, approve: boolean, notes?: string): void;
    updateApplicationStatus(applicationId: string, status: string): void;
    listActivity(limit: number): DemoActivityRecord[];
    listDeletionRequests(): DemoJobDeletionRequestRecord[];
    listEmployeeSnapshot(userId: string): {
        tasks: DemoTaskRecord[];
        timesheets: DemoTimesheetRecord[];
        leaveRequests: DemoLeaveRequestRecord[];
        chats: {
            id: string;
            sender_id: string;
            receiver_id: string;
            body: string;
            created_at: string;
        }[];
        blogs: DemoBlogRecord[];
    };
    createTask(input: { title: string; assigneeUserId: string; createdBy: string; description?: string | null; dueDate?: string | null; priority?: DemoTaskRecord["priority"] }): void;
    updateTaskStatus(taskId: string, status: DemoTaskRecord["status"], actorUserId: string): void;
    addTimesheet(input: { userId: string; workDate: string; hours: number; taskSummary: string }): void;
    submitLeave(input: { userId: string; leaveType: DemoLeaveRequestRecord["leave_type"]; startDate: string; endDate: string; reason?: string | null }): void;
    reviewLeave(leaveId: string, reviewerId: string, approve: boolean): void;
    createBlogDraft(input: { authorId: string; title: string; body: string }): void;
    submitBlogForReview(blogId: string, authorId: string): void;
    reviewBlog(blogId: string, adminId: string, approve: boolean, notes?: string): void;
    addChatMessage(input: { senderId: string; receiverId: string; body: string }): void;
}