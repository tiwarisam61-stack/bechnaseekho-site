import { useEffect, useState } from "react";

export type DemoRole = "admin" | "company" | "employee" | "candidate";

export type DemoUserRecord = {
    id: string;
    email: string;
    password: string;
    full_name: string;
    role: DemoRole;
    company_name?: string | null;
    phone?: string | null;
};

export type DemoJobRecord = {
    id: string;
    external_id?: string | null;
    role: string;
    company: string;
    logo: string | null;
    location: string | null;
    experience: string | null;
    salary: string | null;
    employment_type: string | null;
    description: string | null;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
    is_verified: boolean;
    is_active: boolean;
    status: "approved" | "pending" | "rejected" | "changes_requested";
    industry?: string | null;
    shift?: string | null;
    open_positions?: number | null;
    responsibilities?: string[] | null;
    required_skills?: string[] | null;
    preferred_skills?: string[] | null;
    benefits?: string[] | null;
    office_address?: string | null;
    company_overview?: string | null;
    company_website?: string | null;
    recruiter_whatsapp?: string | null;
    recruiter_email?: string | null;
    recruiter_notes?: string | null;
    application_deadline?: string | null;
    posted_by?: string | null;
    version?: number | null;
};

export type DemoApplicationRecord = {
    id: string;
    job_id: string;
    user_id: string;
    full_name: string;
    email: string;
    phone: string | null;
    resume_path: string | null;
    resume_url: string | null;
    cover_letter: string | null;
    status: string;
    ai_match_score?: number | null;
    ai_match_level?: "high" | "medium" | "low" | null;
    ai_match_reason?: string | null;
    ai_matched_skills?: string[] | null;
    ai_missing_skills?: string[] | null;
    ai_score_source?: "ai" | "fallback" | null;
    ai_scored_at?: string | null;
    created_at: string;
    updated_at: string;
};

export type DemoNotificationRecord = {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    href?: string | null;
    created_at: string;
    read_at: string | null;
    metadata?: Record<string, unknown> | null;
};

export type DemoProfileRecord = {
    id: string;
    full_name: string | null;
    company_name: string | null;
    phone: string | null;
};

export type DemoTaskRecord = {
    id: string;
    title: string;
    description: string | null;
    assignee_user_id: string;
    created_by: string;
    status: "todo" | "in_progress" | "blocked" | "done";
    due_date: string | null;
    priority: "low" | "medium" | "high";
    created_at: string;
    updated_at: string;
};

export type DemoTimesheetRecord = {
    id: string;
    user_id: string;
    work_date: string;
    hours: number;
    task_summary: string;
    status: "draft" | "submitted" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
};

export type DemoLeaveRequestRecord = {
    id: string;
    user_id: string;
    leave_type: "casual" | "sick" | "earned";
    start_date: string;
    end_date: string;
    reason: string | null;
    status: "pending" | "approved" | "rejected";
    reviewed_by: string | null;
    created_at: string;
    updated_at: string;
};

export type DemoChatMessageRecord = {
    id: string;
    sender_id: string;
    receiver_id: string;
    body: string;
    created_at: string;
};

export type DemoBlogRecord = {
    id: string;
    author_id: string;
    title: string;
    body: string;
    status: "draft" | "pending_review" | "approved" | "rejected";
    reviewed_by: string | null;
    review_notes: string | null;
    created_at: string;
    updated_at: string;
};

export type DemoActivityRecord = {
    id: string;
    actor_id: string;
    actor_role: DemoRole;
    action: string;
    entity_type: string;
    entity_id: string | null;
    message: string;
    created_at: string;
};

export type DemoJobDeletionRequestRecord = {
    id: string;
    job_id: string;
    requested_by: string;
    status: "pending" | "approved" | "rejected";
    reviewed_by: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export type DemoSessionUser = {
    id: string;
    email: string;
    user_metadata: Record<string, unknown>;
    app_metadata: Record<string, unknown>;
};

export type DemoSession = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
    user: DemoSessionUser;
};

type DemoState = {
    sessionUserId: string | null;
    users: DemoUserRecord[];
    profiles: DemoProfileRecord[];
    jobs: DemoJobRecord[];
    applications: DemoApplicationRecord[];
    notifications: DemoNotificationRecord[];
    savedJobIdsByUser: Record<string, string[]>;
    tasks: DemoTaskRecord[];
    timesheets: DemoTimesheetRecord[];
    leaveRequests: DemoLeaveRequestRecord[];
    chatMessages: DemoChatMessageRecord[];
    blogs: DemoBlogRecord[];
    activity: DemoActivityRecord[];
    jobDeletionRequests: DemoJobDeletionRequestRecord[];
};

const STORAGE_KEY = "careersync-demo-state";
const RUNTIME_KEY = "__careersync_demo_runtime__";
const DEFAULT_ADMIN_ID = "demo-admin";
const DEFAULT_COMPANY_ID = "demo-company";
const DEFAULT_CANDIDATE_ID = "demo-candidate";
const DEFAULT_EMPLOYEE_ID = "demo-employee";
const DEMO_NOW = "2026-07-25T00:00:00.000Z";

let cachedStateRaw: string | null = null;
let cachedStateSnapshot: DemoState | null = null;

function nowIso(): string {
    return new Date().toISOString();
}

function demoId(prefix: string): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeJob(job: Omit<DemoJobRecord, "logo" | "created_at" | "updated_at" | "is_active"> & Partial<Pick<DemoJobRecord, "logo" | "created_at" | "updated_at" | "is_active">>): DemoJobRecord {
    const timestamp = job.created_at ?? DEMO_NOW;
    return {
        logo: job.logo ?? null,
        created_at: timestamp,
        updated_at: job.updated_at ?? timestamp,
        is_active: job.is_active ?? true,
        is_verified: job.is_verified,
        responsibilities: job.responsibilities ?? null,
        required_skills: job.required_skills ?? null,
        preferred_skills: job.preferred_skills ?? null,
        benefits: job.benefits ?? null,
        office_address: job.office_address ?? null,
        company_overview: job.company_overview ?? null,
        company_website: job.company_website ?? null,
        recruiter_whatsapp: job.recruiter_whatsapp ?? null,
        recruiter_email: job.recruiter_email ?? null,
        recruiter_notes: job.recruiter_notes ?? null,
        application_deadline: job.application_deadline ?? null,
        version: job.version ?? 1,
        industry: job.industry ?? null,
        shift: job.shift ?? null,
        open_positions: job.open_positions ?? null,
        ...job,
    };
}

const DEFAULT_STATE: DemoState = {
    sessionUserId: null,
    users: [
        { id: DEFAULT_ADMIN_ID, email: "admin@gmail.com", password: "129", full_name: "CareerSync Admin", role: "admin", company_name: "BechnaSeekho", phone: "+91 90000 00001" },
        { id: DEFAULT_COMPANY_ID, email: "prateek.tyagi1@wipro.com", password: "129", full_name: "Prateek Tyagi", role: "company", company_name: "Wipro", phone: "+91 90000 00002" },
        { id: DEFAULT_EMPLOYEE_ID, email: "employee@wipro.com", password: "129", full_name: "Riya Malhotra", role: "employee", company_name: "Wipro", phone: "+91 90000 00004" },
        { id: DEFAULT_CANDIDATE_ID, email: "vasu.tyagi1@gmail.com", password: "129", full_name: "Vasu Tyagi", role: "candidate", company_name: null, phone: "+91 90000 00003" },
    ],
    profiles: [
        { id: DEFAULT_ADMIN_ID, full_name: "CareerSync Admin", company_name: "BechnaSeekho", phone: "+91 90000 00001" },
        { id: DEFAULT_COMPANY_ID, full_name: "Prateek Tyagi", company_name: "Wipro", phone: "+91 90000 00002" },
        { id: DEFAULT_EMPLOYEE_ID, full_name: "Riya Malhotra", company_name: "Wipro", phone: "+91 90000 00004" },
        { id: DEFAULT_CANDIDATE_ID, full_name: "Vasu Tyagi", company_name: null, phone: "+91 90000 00003" },
    ],
    jobs: [
        makeJob({ id: "assure-capital-insurance-advisor", external_id: "assure-capital-insurance-advisor", role: "Insurance Advisor", company: "Assure Capital", location: "Delhi, India", salary: "15K - 30K / month", experience: "0-6 Years", employment_type: "Full-time", shift: "10 AM - 6 PM", open_positions: 59, description: "Join Assure Capital to help customers choose suitable life, motor, and health insurance plans while maintaining service quality.", responsibilities: ["Understand customer requirements and suggest policy options", "Handle end-to-end insurance application workflow", "Coordinate with internal underwriting and operations"], required_skills: ["Good Communication Skills", "Positive Attitude", "Basic Calling and Follow-Up Skills"], preferred_skills: ["Insurance Sales Experience", "CRM familiarity"], benefits: ["Incentives", "On-ground support", "Fast hiring"], industry: "Insurance", is_verified: true, status: "approved", posted_by: DEFAULT_ADMIN_ID }),
        makeJob({ id: "apna-screening-network-sales-manager", external_id: "apna-screening-network-sales-manager", role: "Sales Manager", company: "Apna Screening Network", location: "Mumbai, India", salary: "8 LPA - 12 LPA", experience: "3-5 years", employment_type: "Full-time", shift: "Day Shift", open_positions: 12, description: "Lead a high-velocity inside sales team and grow strategic business accounts.", responsibilities: ["Lead a sales pod", "Track pipeline health", "Coach team members"], required_skills: ["Team Leadership", "Negotiation", "CRM"], benefits: ["Performance bonus", "Health cover"], industry: "SaaS", is_verified: true, status: "approved", posted_by: DEFAULT_COMPANY_ID }),
        makeJob({ id: "apna-screening-network-team-leader", external_id: "apna-screening-network-team-leader", role: "Team Leader", company: "Apna Screening Network", location: "Hybrid, India", salary: "7 LPA - 10 LPA", experience: "2-4 years", employment_type: "Full-time", shift: "Day Shift", open_positions: 8, description: "Own team delivery, coaching, and performance tracking for the screening desk.", responsibilities: ["Coach teammates", "Review calls", "Improve conversions"], required_skills: ["People management", "Reporting", "Stakeholder communication"], is_verified: true, status: "approved", posted_by: DEFAULT_COMPANY_ID }),
        makeJob({ id: "policy-meta-insurance-consultant", external_id: "policy-meta-insurance-consultant", role: "Insurance Consultant", company: "Policy Meta", location: "Remote", salary: "20K - 40K / month", experience: "1-3 years", employment_type: "Remote", shift: "Flexible", open_positions: 25, description: "Help families compare and buy the right insurance plans with transparent advice.", responsibilities: ["Consult customers", "Maintain CRM records", "Close qualified leads"], required_skills: ["Client handling", "Sales", "Follow up"], is_verified: true, status: "approved", posted_by: DEFAULT_ADMIN_ID }),
        makeJob({ id: "smile-india-trust-program-coordinator", external_id: "smile-india-trust-program-coordinator", role: "Program Coordinator", company: "Smile India Trust", location: "Bengaluru, India", salary: "6 LPA - 8 LPA", experience: "1-4 years", employment_type: "Full-time", shift: "Day Shift", open_positions: 6, description: "Coordinate social impact programs and partner outreach across local communities.", responsibilities: ["Coordinate events", "Report outcomes", "Support field teams"], required_skills: ["Operations", "Communication", "Project tracking"], benefits: ["Mission-driven work", "Learning budget"], is_verified: true, status: "approved", posted_by: DEFAULT_COMPANY_ID }),
        makeJob({ id: "scaler-academy-counsellor", external_id: "scaler-academy-counsellor", role: "Counsellor", company: "Scaler Academy", location: "Noida, India", salary: "7 LPA - 11 LPA", experience: "1-5 years", employment_type: "Full-time", shift: "Day Shift", open_positions: 18, description: "Guide prospective learners through the program and help them choose the right path.", responsibilities: ["Advise candidates", "Qualify leads", "Maintain funnel hygiene"], required_skills: ["Sales", "Communication", "CRM"], is_verified: true, status: "approved", posted_by: DEFAULT_ADMIN_ID }),
        makeJob({ id: "growthwave-media-digital-marketing-executive", external_id: "growthwave-media-digital-marketing-executive", role: "Digital Marketing Executive", company: "GrowthWave Media", location: "Bengaluru, Karnataka", salary: "25,000 - 35,000 / month", experience: "1-4 Years", employment_type: "Full-time", shift: "10 AM - 6 PM", open_positions: 12, description: "Plan and execute performance marketing campaigns across social and search platforms for D2C brand clients.", responsibilities: ["Plan and run paid campaigns across Meta and Google Ads", "Track campaign performance and optimise spend", "Coordinate with content and design teams"], required_skills: ["Performance Marketing", "Google Ads", "Meta Ads Manager"], preferred_skills: ["SEO Basics", "Analytics Tools", "Canva"], benefits: ["Health Insurance", "Performance Bonus", "Flexible Hours"], office_address: "Indiranagar, Bengaluru, Karnataka", company_overview: "GrowthWave Media runs performance marketing for D2C and retail brands across India.", recruiter_whatsapp: "919810006666", recruiter_notes: "Portfolio of past campaigns preferred but not mandatory.", application_deadline: "2026-09-25", industry: "Advertising", is_verified: true, status: "approved", posted_by: DEFAULT_ADMIN_ID }),
        makeJob({ id: "zenith-fintech-customer-success-associate", external_id: "zenith-fintech-customer-success-associate", role: "Customer Success Associate", company: "Zenith Fintech", location: "Pune, Maharashtra", salary: "20,000 - 28,000 / month", experience: "0-3 Years", employment_type: "Full-time", shift: "Rotational Shifts", open_positions: 25, description: "Support onboarding and day-to-day queries for retail lending customers via calls and chat.", responsibilities: ["Resolve customer queries over calls and chat", "Assist with onboarding and KYC follow-ups", "Escalate unresolved issues to the right team"], required_skills: ["Customer Handling", "Basic Computer Skills", "Hindi + English"], preferred_skills: ["BPO Experience", "CRM Tools"], benefits: ["Health Insurance", "Night Shift Allowance", "Cab Facility"], office_address: "Hinjewadi Phase 1, Pune, Maharashtra", company_overview: "Zenith Fintech provides digital lending and payments infrastructure for retail customers.", recruiter_whatsapp: "919810007777", recruiter_notes: "Rotational shifts including occasional nights. Cab facility provided.", application_deadline: "2026-09-28", industry: "Fintech", is_verified: true, status: "approved", posted_by: DEFAULT_ADMIN_ID }),
        makeJob({ id: "demo-company-frontend-engineer", role: "Frontend Engineer", company: "Wipro", location: "Bengaluru, India", salary: "16 LPA - 22 LPA", experience: "3-5 years", employment_type: "Full-time", description: "Own internal tools and customer-facing interfaces for a high-scale product org.", tags: ["React", "TypeScript", "Design Systems"], is_verified: false, status: "pending", posted_by: DEFAULT_COMPANY_ID }),
    ],
    applications: [],
    notifications: [
        { id: demoId("notif"), user_id: DEFAULT_ADMIN_ID, title: "Demo workspace ready", message: "Review pending jobs from HR accounts and approve them to publish on the public jobs board.", type: "info", href: "/careersync", created_at: DEMO_NOW, read_at: null, metadata: { scope: "admin" } },
        { id: demoId("notif"), user_id: DEFAULT_COMPANY_ID, title: "Company testing account created", message: "Submit a job from the post-job page to simulate the approval workflow.", type: "success", href: "/post-job", created_at: DEMO_NOW, read_at: null, metadata: { scope: "company" } },
        { id: demoId("notif"), user_id: DEFAULT_EMPLOYEE_ID, title: "Employee workspace enabled", message: "Submit your timesheet, manage leaves, and collaborate with HR from one workspace.", type: "info", href: "/careersync", created_at: DEMO_NOW, read_at: null, metadata: { scope: "employee" } },
        { id: demoId("notif"), user_id: DEFAULT_CANDIDATE_ID, title: "Candidate demo account ready", message: "Apply to an approved job and watch the notification flow update locally.", type: "info", href: "/careersync/jobs", created_at: DEMO_NOW, read_at: null, metadata: { scope: "candidate" } },
    ],
    savedJobIdsByUser: {},
    tasks: [
        {
            id: "task-onboarding-handbook",
            title: "Refresh onboarding handbook",
            description: "Update sections for remote joining and internal tool access.",
            assignee_user_id: DEFAULT_EMPLOYEE_ID,
            created_by: DEFAULT_COMPANY_ID,
            status: "in_progress",
            due_date: "2026-07-31",
            priority: "high",
            created_at: DEMO_NOW,
            updated_at: DEMO_NOW,
        },
    ],
    timesheets: [
        {
            id: "timesheet-1",
            user_id: DEFAULT_EMPLOYEE_ID,
            work_date: "2026-07-24",
            hours: 8,
            task_summary: "Candidate screening pipeline and hiring dashboard sync.",
            status: "submitted",
            created_at: DEMO_NOW,
            updated_at: DEMO_NOW,
        },
    ],
    leaveRequests: [
        {
            id: "leave-1",
            user_id: DEFAULT_EMPLOYEE_ID,
            leave_type: "casual",
            start_date: "2026-08-02",
            end_date: "2026-08-03",
            reason: "Family event",
            status: "pending",
            reviewed_by: null,
            created_at: DEMO_NOW,
            updated_at: DEMO_NOW,
        },
    ],
    chatMessages: [
        {
            id: "chat-1",
            sender_id: DEFAULT_COMPANY_ID,
            receiver_id: DEFAULT_EMPLOYEE_ID,
            body: "Please share your updated timesheet by EOD.",
            created_at: DEMO_NOW,
        },
    ],
    blogs: [
        {
            id: "blog-employee-1",
            author_id: DEFAULT_EMPLOYEE_ID,
            title: "How We Reduced Candidate Drop-offs",
            body: "Draft notes on improving candidate response rates through faster feedback loops.",
            status: "draft",
            reviewed_by: null,
            review_notes: null,
            created_at: DEMO_NOW,
            updated_at: DEMO_NOW,
        },
    ],
    activity: [
        {
            id: "activity-1",
            actor_id: DEFAULT_ADMIN_ID,
            actor_role: "admin",
            action: "workspace.seeded",
            entity_type: "system",
            entity_id: null,
            message: "Phase 2 enterprise demo modules were seeded.",
            created_at: DEMO_NOW,
        },
    ],
    jobDeletionRequests: [],
};

type Runtime = {
    listeners: Set<() => void>;
    authListeners: Set<(event: string, session: DemoSession | null) => void>;
};

function getRuntime(): Runtime {
    const globalAny = globalThis as typeof globalThis & { [RUNTIME_KEY]?: Runtime };
    if (!globalAny[RUNTIME_KEY]) globalAny[RUNTIME_KEY] = { listeners: new Set(), authListeners: new Set() };
    return globalAny[RUNTIME_KEY]!;
}

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function supportsLocalStorage(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadState(): DemoState {
    if (!supportsLocalStorage()) return clone(DEFAULT_STATE);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
        cachedStateRaw = JSON.stringify(DEFAULT_STATE);
        cachedStateSnapshot = clone(DEFAULT_STATE);
        return cachedStateSnapshot;
    }
    if (raw === cachedStateRaw && cachedStateSnapshot) return cachedStateSnapshot;
    try {
        const parsed = JSON.parse(raw) as Partial<DemoState>;
        cachedStateRaw = raw;
        cachedStateSnapshot = {
            ...clone(DEFAULT_STATE),
            ...parsed,
            users: Array.isArray(parsed.users) ? parsed.users : clone(DEFAULT_STATE.users),
            profiles: Array.isArray(parsed.profiles) ? parsed.profiles : clone(DEFAULT_STATE.profiles),
            jobs: Array.isArray(parsed.jobs) ? parsed.jobs : clone(DEFAULT_STATE.jobs),
            applications: Array.isArray(parsed.applications) ? parsed.applications : clone(DEFAULT_STATE.applications),
            notifications: Array.isArray(parsed.notifications) ? parsed.notifications : clone(DEFAULT_STATE.notifications),
            savedJobIdsByUser: parsed.savedJobIdsByUser && typeof parsed.savedJobIdsByUser === "object" ? (parsed.savedJobIdsByUser as Record<string, string[]>) : {},
            tasks: Array.isArray(parsed.tasks) ? parsed.tasks : clone(DEFAULT_STATE.tasks),
            timesheets: Array.isArray(parsed.timesheets) ? parsed.timesheets : clone(DEFAULT_STATE.timesheets),
            leaveRequests: Array.isArray(parsed.leaveRequests) ? parsed.leaveRequests : clone(DEFAULT_STATE.leaveRequests),
            chatMessages: Array.isArray(parsed.chatMessages) ? parsed.chatMessages : clone(DEFAULT_STATE.chatMessages),
            blogs: Array.isArray(parsed.blogs) ? parsed.blogs : clone(DEFAULT_STATE.blogs),
            activity: Array.isArray(parsed.activity) ? parsed.activity : clone(DEFAULT_STATE.activity),
            jobDeletionRequests: Array.isArray(parsed.jobDeletionRequests) ? parsed.jobDeletionRequests : clone(DEFAULT_STATE.jobDeletionRequests),
            sessionUserId: parsed.sessionUserId ?? null,
        };
        return cachedStateSnapshot;
    } catch {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
        cachedStateRaw = JSON.stringify(DEFAULT_STATE);
        cachedStateSnapshot = clone(DEFAULT_STATE);
        return cachedStateSnapshot;
    }
}

function saveState(state: DemoState) {
    const serialized = JSON.stringify(state);
    if (supportsLocalStorage()) window.localStorage.setItem(STORAGE_KEY, serialized);
    cachedStateRaw = serialized;
    cachedStateSnapshot = state;
    getRuntime().listeners.forEach((listener) => listener());
}

function setState(mutator: (state: DemoState) => DemoState | void) {
    const current = loadState();
    const next = mutator(clone(current)) ?? current;
    saveState(next);
}

function getState(): DemoState {
    return loadState();
}

function getCurrentUser(state: DemoState): DemoUserRecord | null {
    return state.users.find((user) => user.id === state.sessionUserId) ?? null;
}

function getUsersByRole(role: DemoRole): DemoUserRecord[] {
    return getState().users.filter((user) => user.role === role);
}

function createActivityEntry(state: DemoState, input: Omit<DemoActivityRecord, "id" | "created_at">) {
    state.activity.unshift({
        id: demoId("activity"),
        created_at: nowIso(),
        ...input,
    });
}

function appendAuditMessage(state: DemoState, actorId: string, action: string, message: string, entityType: string, entityId: string | null = null) {
    const actor = state.users.find((user) => user.id === actorId);
    if (!actor) return;
    createActivityEntry(state, {
        actor_id: actorId,
        actor_role: actor.role,
        action,
        entity_type: entityType,
        entity_id: entityId,
        message,
    });
}

function getDisplayName(user: DemoUserRecord | null): string {
    return user?.full_name || user?.email?.split("@")[0] || "User";
}

function toSession(user: DemoUserRecord | null): DemoSession | null {
    if (!user) return null;
    return {
        access_token: `demo-${user.id}-${Date.now()}`,
        refresh_token: `demo-refresh-${user.id}`,
        token_type: "bearer",
        expires_in: 60 * 60 * 24 * 30,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        user: {
            id: user.id,
            email: user.email,
            user_metadata: { full_name: user.full_name, company_name: user.company_name ?? null, phone: user.phone ?? null, role: user.role },
            app_metadata: { role: user.role },
        },
    };
}

function notifyAuth(event: string, session: DemoSession | null) {
    getRuntime().authListeners.forEach((listener) => listener(event, session));
}

function setCurrentSessionUser(userId: string | null) {
    setState((state) => {
        state.sessionUserId = userId;
        return state;
    });
    notifyAuth("SIGNED_IN", getAuthSession());
}

function getAuthSession(): DemoSession | null {
    return toSession(getCurrentUser(getState()));
}

function findUserByEmail(email: string): DemoUserRecord | null {
    const normalized = email.trim().toLowerCase();
    return getState().users.find((user) => user.email.toLowerCase() === normalized) ?? null;
}

function createOrUpdateUser(partial: Pick<DemoUserRecord, "email" | "password" | "full_name" | "role"> & Partial<Pick<DemoUserRecord, "company_name" | "phone">>): DemoUserRecord {
    const state = getState();
    const existing = state.users.find((user) => user.email.toLowerCase() === partial.email.toLowerCase());
    const record: DemoUserRecord = {
        id: existing?.id ?? demoId("user"),
        email: partial.email.toLowerCase(),
        password: partial.password,
        full_name: partial.full_name,
        role: partial.role,
        company_name: partial.company_name ?? existing?.company_name ?? null,
        phone: partial.phone ?? existing?.phone ?? null,
    };
    setState((next) => {
        const index = next.users.findIndex((user) => user.email.toLowerCase() === record.email.toLowerCase());
        if (index >= 0) next.users[index] = record;
        else next.users.unshift(record);
        const profileIndex = next.profiles.findIndex((profile) => profile.id === record.id);
        const profile: DemoProfileRecord = { id: record.id, full_name: record.full_name, company_name: record.company_name ?? null, phone: record.phone ?? null };
        if (profileIndex >= 0) next.profiles[profileIndex] = profile;
        else next.profiles.unshift(profile);
        return next;
    });
    return record;
}

function setDemoSessionForUser(user: DemoUserRecord) {
    setCurrentSessionUser(user.id);
    return toSession(user)!;
}

function addNotification(notification: Omit<DemoNotificationRecord, "id" | "created_at" | "read_at"> & Partial<Pick<DemoNotificationRecord, "created_at" | "read_at">>) {
    setState((state) => {
        state.notifications.unshift({ id: demoId("notif"), created_at: notification.created_at ?? nowIso(), read_at: notification.read_at ?? null, ...notification });
        return state;
    });
}

function addNotificationToUsers(userIds: string[], notification: Omit<DemoNotificationRecord, "id" | "created_at" | "read_at" | "user_id"> & Partial<Pick<DemoNotificationRecord, "created_at" | "read_at">>) {
    setState((state) => {
        userIds.forEach((userId) => {
            state.notifications.unshift({
                id: demoId("notif"),
                user_id: userId,
                created_at: notification.created_at ?? nowIso(),
                read_at: notification.read_at ?? null,
                ...notification,
            });
        });
        return state;
    });
}

function pushNotification(state: DemoState, notification: Omit<DemoNotificationRecord, "id" | "created_at" | "read_at"> & Partial<Pick<DemoNotificationRecord, "created_at" | "read_at">>) {
    state.notifications.unshift({
        id: demoId("notif"),
        created_at: notification.created_at ?? nowIso(),
        read_at: notification.read_at ?? null,
        ...notification,
    });
}

function getRowsForTable(state: DemoState, table: keyof DemoState): Record<string, unknown>[] {
    switch (table) {
        case "users": return state.users as unknown as Record<string, unknown>[];
        case "profiles": return state.profiles as unknown as Record<string, unknown>[];
        case "jobs": return state.jobs as unknown as Record<string, unknown>[];
        case "applications": return state.applications as unknown as Record<string, unknown>[];
        case "notifications": return state.notifications as unknown as Record<string, unknown>[];
        case "tasks": return state.tasks as unknown as Record<string, unknown>[];
        case "timesheets": return state.timesheets as unknown as Record<string, unknown>[];
        case "leaveRequests": return state.leaveRequests as unknown as Record<string, unknown>[];
        case "chatMessages": return state.chatMessages as unknown as Record<string, unknown>[];
        case "blogs": return state.blogs as unknown as Record<string, unknown>[];
        case "activity": return state.activity as unknown as Record<string, unknown>[];
        case "jobDeletionRequests": return state.jobDeletionRequests as unknown as Record<string, unknown>[];
        default: return [];
    }
}

function setRowsForTable(state: DemoState, table: keyof DemoState, rows: Record<string, unknown>[]) {
    switch (table) {
        case "users": state.users = rows as unknown as DemoUserRecord[]; break;
        case "profiles": state.profiles = rows as unknown as DemoProfileRecord[]; break;
        case "jobs": state.jobs = rows as unknown as DemoJobRecord[]; break;
        case "applications": state.applications = rows as unknown as DemoApplicationRecord[]; break;
        case "notifications": state.notifications = rows as unknown as DemoNotificationRecord[]; break;
        case "tasks": state.tasks = rows as unknown as DemoTaskRecord[]; break;
        case "timesheets": state.timesheets = rows as unknown as DemoTimesheetRecord[]; break;
        case "leaveRequests": state.leaveRequests = rows as unknown as DemoLeaveRequestRecord[]; break;
        case "chatMessages": state.chatMessages = rows as unknown as DemoChatMessageRecord[]; break;
        case "blogs": state.blogs = rows as unknown as DemoBlogRecord[]; break;
        case "activity": state.activity = rows as unknown as DemoActivityRecord[]; break;
        case "jobDeletionRequests": state.jobDeletionRequests = rows as unknown as DemoJobDeletionRequestRecord[]; break;
    }
}

function applyFilters(rows: Record<string, unknown>[], filters: { kind: "eq" | "in"; column: string; value: unknown }[]) {
    return filters.reduce((acc, filter) => {
        if (filter.kind === "eq") return acc.filter((row) => String(row[filter.column] ?? "") === String(filter.value ?? ""));
        const values = Array.isArray(filter.value) ? filter.value.map((item) => String(item)) : [];
        return acc.filter((row) => values.includes(String(row[filter.column] ?? "")));
    }, rows);
}

function normalizeRows(table: keyof DemoState, payload: unknown): Record<string, unknown>[] {
    const rows = Array.isArray(payload) ? payload : [payload];
    return rows.map((row) => {
        const base = typeof row === "object" && row !== null ? { ...(row as Record<string, unknown>) } : {};
        if (!base.id) base.id = demoId(String(table));
        if (!base.created_at) base.created_at = nowIso();
        if (!base.updated_at) base.updated_at = base.created_at;
        return base;
    });
}

function enrichInsertedRow(table: keyof DemoState, row: Record<string, unknown>, state: DemoState): Record<string, unknown> {
    const now = nowIso();
    if (table === "jobs") {
        const current = getCurrentUser(state);
        return {
            logo: null,
            external_id: row.external_id ?? null,
            role: String(row.role ?? "Untitled role"),
            company: String(row.company ?? current?.company_name ?? current?.full_name ?? "Unknown company"),
            location: row.location ?? null,
            experience: row.experience ?? null,
            salary: row.salary ?? null,
            employment_type: row.employment_type ?? null,
            description: row.description ?? null,
            tags: Array.isArray(row.tags) ? row.tags : null,
            created_at: row.created_at ?? now,
            updated_at: row.updated_at ?? now,
            is_verified: Boolean(row.is_verified ?? false),
            is_active: row.is_active ?? true,
            status: (row.status as DemoJobRecord["status"]) ?? "pending",
            industry: row.industry ?? null,
            shift: row.shift ?? null,
            open_positions: row.open_positions ?? null,
            responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : null,
            required_skills: Array.isArray(row.required_skills) ? row.required_skills : null,
            preferred_skills: Array.isArray(row.preferred_skills) ? row.preferred_skills : null,
            benefits: Array.isArray(row.benefits) ? row.benefits : null,
            office_address: row.office_address ?? null,
            company_overview: row.company_overview ?? null,
            company_website: row.company_website ?? null,
            recruiter_whatsapp: row.recruiter_whatsapp ?? null,
            recruiter_email: row.recruiter_email ?? null,
            recruiter_notes: row.recruiter_notes ?? null,
            application_deadline: row.application_deadline ?? null,
            version: typeof row.version === "number" ? row.version : 1,
            posted_by: row.posted_by ?? current?.id ?? null,
            id: String(row.id ?? demoId("job")),
        };
    }
    if (table === "applications") {
        return {
            id: String(row.id ?? demoId("app")),
            job_id: String(row.job_id ?? ""),
            user_id: String(row.user_id ?? ""),
            full_name: String(row.full_name ?? ""),
            email: String(row.email ?? ""),
            phone: row.phone ?? null,
            resume_path: row.resume_path ?? null,
            resume_url: row.resume_url ?? null,
            cover_letter: row.cover_letter ?? null,
            status: String(row.status ?? "submitted"),
            ai_match_score: typeof row.ai_match_score === "number" ? row.ai_match_score : null,
            ai_match_level: row.ai_match_level === "high" || row.ai_match_level === "medium" || row.ai_match_level === "low" ? row.ai_match_level : null,
            ai_match_reason: typeof row.ai_match_reason === "string" ? row.ai_match_reason : null,
            ai_matched_skills: Array.isArray(row.ai_matched_skills) ? row.ai_matched_skills.map(String) : null,
            ai_missing_skills: Array.isArray(row.ai_missing_skills) ? row.ai_missing_skills.map(String) : null,
            ai_score_source: row.ai_score_source === "ai" || row.ai_score_source === "fallback" ? row.ai_score_source : null,
            ai_scored_at: typeof row.ai_scored_at === "string" ? row.ai_scored_at : null,
            created_at: String(row.created_at ?? now),
            updated_at: String(row.updated_at ?? now),
        };
    }
    if (table === "notifications") {
        return {
            id: String(row.id ?? demoId("notif")),
            user_id: String(row.user_id ?? ""),
            title: String(row.title ?? "Notification"),
            message: String(row.message ?? ""),
            type: (row.type as DemoNotificationRecord["type"]) ?? "info",
            href: row.href ?? null,
            created_at: String(row.created_at ?? now),
            read_at: row.read_at ?? null,
            metadata: row.metadata ?? null,
        };
    }
    if (table === "users") {
        return {
            id: String(row.id ?? demoId("user")),
            email: String(row.email ?? ""),
            password: String(row.password ?? ""),
            full_name: String(row.full_name ?? "User"),
            role: (row.role as DemoRole) ?? "candidate",
            company_name: row.company_name ?? null,
            phone: row.phone ?? null,
        };
    }
    if (table === "profiles") {
        return { id: String(row.id ?? demoId("profile")), full_name: row.full_name ?? null, company_name: row.company_name ?? null, phone: row.phone ?? null };
    }
    return row;
}

function queryTable(state: DemoState, table: keyof DemoState, config: { filters: { kind: "eq" | "in"; column: string; value: unknown }[]; orderBy?: { column: string; ascending: boolean }; limit?: number; maybeSingle?: boolean }) {
    let rows = applyFilters(getRowsForTable(state, table), config.filters);
    if (config.orderBy) {
        const { column, ascending } = config.orderBy;
        rows = [...rows].sort((left, right) => {
            const a = String(left[column] ?? "");
            const b = String(right[column] ?? "");
            if (a === b) return 0;
            return a > b ? (ascending ? 1 : -1) : (ascending ? -1 : 1);
        });
    }
    if (typeof config.limit === "number") rows = rows.slice(0, config.limit);
    return config.maybeSingle ? rows[0] ?? null : rows;
}

function mutateTable(state: DemoState, table: keyof DemoState, config: { filters: { kind: "eq" | "in"; column: string; value: unknown }[]; payload?: unknown; operation: "insert" | "update" | "delete" }) {
    if (config.operation === "insert") {
        const inserted = normalizeRows(table, config.payload).map((row) => enrichInsertedRow(table, row, state));
        setRowsForTable(state, table, [...inserted, ...getRowsForTable(state, table)]);
        if (table === "jobs") {
            const job = inserted[0] as DemoJobRecord | undefined;
            const current = getCurrentUser(state);
            if (job) {
                const adminIds = state.users.filter((user) => user.role === "admin").map((user) => user.id);
                const reviewOwnerIds = adminIds.length ? adminIds : [DEFAULT_ADMIN_ID];
                reviewOwnerIds.forEach((adminId) => {
                    pushNotification(state, {
                        user_id: adminId,
                        title: "New job pending review",
                        message: `${job.role} at ${job.company} was submitted by ${getDisplayName(current)} and is waiting for approval.`,
                        type: "warning",
                        href: "/careersync?workspace=1#jobs-approval",
                        metadata: { jobId: job.id, postedBy: current?.id ?? job.posted_by ?? null },
                    });
                });
                if (current?.role === "company") {
                    pushNotification(state, { user_id: current.id, title: "Job submitted for review", message: `Your ${job.role} listing has been queued for admin approval.`, type: "success", href: "/careersync?workspace=1#my-jobs", metadata: { jobId: job.id } });
                }
            }
        }
        if (table === "applications") {
            const application = inserted[0] as DemoApplicationRecord | undefined;
            if (application) {
                const job = state.jobs.find((item) => item.id === application.job_id);
                const ownerId = job?.posted_by ?? DEFAULT_ADMIN_ID;
                addNotification({ user_id: ownerId, title: "New application received", message: `${application.full_name} applied for ${job?.role ?? "a role"} at ${job?.company ?? "CareerSync"}.`, type: "info", href: "/careersync/jobs", metadata: { applicationId: application.id, jobId: application.job_id } });
                addNotification({ user_id: application.user_id, title: "Application submitted", message: `Your application for ${job?.role ?? "the role"} was submitted successfully.`, type: "success", href: "/careersync/notifications", metadata: { applicationId: application.id, jobId: application.job_id } });
            }
        }
        return { data: inserted.length === 1 ? inserted[0] : inserted, error: null };
    }
    if (config.operation === "update") {
        const payload = (config.payload ?? {}) as Record<string, unknown>;
        const matchedRows = applyFilters(getRowsForTable(state, table), config.filters);
        const rows = matchedRows.map((row) => ({ ...row, ...payload, updated_at: nowIso() }));
        const untouched = getRowsForTable(state, table).filter((row) => !applyFilters([row], config.filters).length);
        setRowsForTable(state, table, [...rows, ...untouched]);
        if (table === "jobs") {
            const current = getCurrentUser(state);
            rows.forEach((updatedRow, index) => {
                const previousRow = matchedRows[index] as DemoJobRecord | undefined;
                const updatedJob = updatedRow as DemoJobRecord;
                if (previousRow && previousRow.status !== "pending" && updatedJob.status === "pending" && current?.role === "company") {
                    addNotification({
                        user_id: DEFAULT_ADMIN_ID,
                        title: "Job resubmitted",
                        message: `${updatedJob.role} at ${updatedJob.company} was updated and sent back for approval by ${getDisplayName(current)}.`,
                        type: "warning",
                        href: "/careersync",
                        metadata: { jobId: updatedJob.id, postedBy: current.id },
                    });
                    addNotification({
                        user_id: current.id,
                        title: "Job sent for review",
                        message: `Your updated ${updatedJob.role} listing is waiting for admin approval again.`,
                        type: "success",
                        href: "/careersync",
                        metadata: { jobId: updatedJob.id },
                    });
                }
            });
        }
        return { data: rows, error: null };
    }
    if (config.operation === "delete") {
        const remaining = getRowsForTable(state, table).filter((row) => !applyFilters([row], config.filters).length);
        setRowsForTable(state, table, remaining);
        return { data: null, error: null };
    }
    return { data: null, error: null };
}

function buildQueryBuilder(table: keyof DemoState) {
    const config: { filters: { kind: "eq" | "in"; column: string; value: unknown }[]; orderBy?: { column: string; ascending: boolean }; limit?: number; maybeSingle?: boolean; payload?: unknown; operation: "select" | "insert" | "update" | "delete" } = { filters: [], operation: "select" };
    const builder: Record<string, unknown> & PromiseLike<{ data: unknown; error: null | Error }> = {
        select() { config.operation = "select"; return builder; },
        eq(column: string, value: unknown) { config.filters.push({ kind: "eq", column, value }); return builder; },
        in(column: string, value: unknown[]) { config.filters.push({ kind: "in", column, value }); return builder; },
        order(column: string, options?: { ascending?: boolean }) { config.orderBy = { column, ascending: options?.ascending ?? true }; return builder; },
        limit(count: number) { config.limit = count; return builder; },
        maybeSingle() { config.maybeSingle = true; return builder; },
        insert(payload: unknown) { config.operation = "insert"; config.payload = payload; return builder; },
        update(payload: unknown) { config.operation = "update"; config.payload = payload; return builder; },
        delete() { config.operation = "delete"; return builder; },
        then(onFulfilled, onRejected) {
            const promise = Promise.resolve().then(() => {
                const state = getState();
                if (config.operation === "select") return { data: queryTable(state, table, config), error: null };
                return mutateTable(state, table, config as { filters: { kind: "eq" | "in"; column: string; value: unknown }[]; payload?: unknown; operation: "insert" | "update" | "delete" });
            });
            return promise.then(onFulfilled, onRejected);
        },
        catch(onRejected) { return builder.then(undefined, onRejected); },
    };
    return builder;
}

function getRoleForUserId(userId: string): DemoRole | null {
    return getState().users.find((user) => user.id === userId)?.role ?? null;
}

function updateJobStatus(jobId: string, status: DemoJobRecord["status"], adminUserId: string, notes?: string) {
    setState((state) => {
        const job = state.jobs.find((item) => item.id === jobId);
        if (!job) return state;
        const previousStatus = job.status;
        job.status = status;
        job.is_verified = status === "approved";
        job.updated_at = nowIso();
        const ownerId = job.posted_by ?? DEFAULT_COMPANY_ID;
        const title = status === "approved" ? "Job approved" : status === "rejected" ? "Job rejected" : "Changes requested";
        const type = status === "approved" ? "success" : "warning";
        const message = status === "approved" ? `${job.role} at ${job.company} is now live on the public jobs board.` : notes ?? `${job.role} at ${job.company} needs updates before approval.`;
        state.notifications.unshift({ id: demoId("notif"), user_id: ownerId, title, message, type, href: status === "approved" ? "/careersync/jobs" : "/post-job", created_at: nowIso(), read_at: null, metadata: { jobId: job.id, reviewedBy: adminUserId } });
        state.notifications.unshift({ id: demoId("notif"), user_id: adminUserId, title, message: `${job.role} at ${job.company} was reviewed.`, type, href: "/careersync", created_at: nowIso(), read_at: null, metadata: { jobId: job.id } });
        if (status === "approved" && previousStatus !== "approved") {
            const candidateIds = getUsersByRole("candidate").map((user) => user.id);
            if (candidateIds.length > 0) {
                state.notifications.unshift(...candidateIds.map((candidateId) => ({
                    id: demoId("notif"),
                    user_id: candidateId,
                    title: "New approved job",
                    message: `A new ${job.role} role at ${job.company} is now available.`,
                    type: "info" as const,
                    href: "/careersync/jobs",
                    created_at: nowIso(),
                    read_at: null,
                    metadata: { jobId: job.id, reviewedBy: adminUserId },
                })));
            }
        }
        appendAuditMessage(state, adminUserId, `job.${status}`, `${job.role} at ${job.company} moved from ${previousStatus} to ${status}.`, "job", job.id);
        return state;
    });
}

function updateJobDraft(jobId: string, updates: Partial<DemoJobRecord>, actorUserId: string) {
    setState((state) => {
        const job = state.jobs.find((item) => item.id === jobId);
        if (!job) return state;
        const current = getCurrentUser(state);
        if (!current || current.id !== actorUserId) return state;
        Object.assign(job, updates, { updated_at: nowIso() });
        if (current.role === "company") {
            const currentVersion = Number((job as DemoJobRecord & { version?: number }).version ?? 1);
            (job as DemoJobRecord & { version?: number }).version = currentVersion + 1;
            job.status = "pending";
            job.is_verified = false;
            const adminUserIds = getUsersByRole("admin").map((user) => user.id);
            adminUserIds.forEach((adminId) => {
                state.notifications.unshift({
                    id: demoId("notif"),
                    user_id: adminId,
                    title: "Job resubmitted",
                    message: `${job.role} at ${job.company} was updated and is waiting for approval again.`,
                    type: "warning",
                    href: "/careersync",
                    created_at: nowIso(),
                    read_at: null,
                    metadata: { jobId: job.id, postedBy: current.id },
                });
            });
            appendAuditMessage(state, current.id, "job.updated", `${current.full_name} updated ${job.role} and sent version ${(job as DemoJobRecord & { version?: number }).version} for review.`, "job", job.id);
        }
        return state;
    });
}

function deleteJobDraft(jobId: string, actorUserId: string) {
    setState((state) => {
        const current = getCurrentUser(state);
        if (!current || current.id !== actorUserId) return state;
        const job = state.jobs.find((item) => item.id === jobId);
        if (!job) return state;
        const existingRequest = state.jobDeletionRequests.find((request) => request.job_id === jobId && request.status === "pending");
        if (existingRequest) return state;

        const request: DemoJobDeletionRequestRecord = {
            id: demoId("delete-request"),
            job_id: jobId,
            requested_by: actorUserId,
            status: "pending",
            reviewed_by: null,
            notes: null,
            created_at: nowIso(),
            updated_at: nowIso(),
        };
        state.jobDeletionRequests.unshift(request);

        const adminIds = getUsersByRole("admin").map((user) => user.id);
        adminIds.forEach((adminId) => {
            state.notifications.unshift({
                id: demoId("notif"),
                user_id: adminId,
                title: "Job deletion requested",
                message: `${current.full_name} requested deletion for ${job.role} at ${job.company}.`,
                type: "warning",
                href: "/careersync",
                created_at: nowIso(),
                read_at: null,
                metadata: { jobId, requestId: request.id },
            });
        });
        state.notifications.unshift({
            id: demoId("notif"),
            user_id: actorUserId,
            title: "Deletion request sent",
            message: `${job.role} is marked for admin deletion approval.`,
            type: "info",
            href: "/careersync",
            created_at: nowIso(),
            read_at: null,
            metadata: { jobId, requestId: request.id },
        });
        appendAuditMessage(state, actorUserId, "job.delete_requested", `${current.full_name} requested deletion for ${job.role}.`, "job", jobId);
        return state;
    });
}

function sanitizeRole(input: unknown): DemoRole {
    if (input === "admin" || input === "company" || input === "employee" || input === "candidate") return input;
    return "candidate";
}

function updateApplicationStatus(applicationId: string, status: string) {
    setState((state) => {
        const application = state.applications.find((item) => item.id === applicationId);
        if (!application) return state;
        application.status = status;
        application.updated_at = nowIso();
        const job = state.jobs.find((item) => item.id === application.job_id);
        state.notifications.unshift({ id: demoId("notif"), user_id: application.user_id, title: `Application ${status}`, message: `${job?.company ?? "The hiring team"} updated your application for ${job?.role ?? "the role"}.`, type: status === "rejected" ? "warning" : "success", href: "/careersync/notifications", created_at: nowIso(), read_at: null, metadata: { applicationId, jobId: application.job_id } });
        const actorId = job?.posted_by ?? DEFAULT_COMPANY_ID;
        appendAuditMessage(state, actorId, "application.status_updated", `Application ${application.id} moved to ${status}.`, "application", application.id);
        return state;
    });
}

export function createLocalDemoSupabaseClient() {
    return {
        auth: {
            getSession: async () => ({ data: { session: getAuthSession() }, error: null }),
            onAuthStateChange: (callback: (event: string, session: DemoSession | null) => void) => {
                const runtime = getRuntime();
                runtime.authListeners.add(callback);
                return { data: { subscription: { unsubscribe: () => runtime.authListeners.delete(callback) } } };
            },
            signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
                const user = findUserByEmail(email);
                if (!user || user.password !== password) return { data: { user: null, session: null }, error: new Error("Invalid email or password.") };
                const session = setDemoSessionForUser(user);
                return { data: { user: session.user, session }, error: null };
            },
            signUp: async ({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, unknown> } }) => {
                const meta = options?.data ?? {};
                const role = sanitizeRole(meta.role);
                const user = createOrUpdateUser({ email, password, full_name: String(meta.full_name ?? meta.name ?? email.split("@")[0] ?? "User"), role, company_name: role === "company" ? String(meta.company_name ?? meta.organization ?? "") || null : null, phone: typeof meta.phone === "string" ? meta.phone : null });
                const session = setDemoSessionForUser(user);
                addNotification({ user_id: DEFAULT_ADMIN_ID, title: "New demo account created", message: `${user.full_name} signed up as ${role}.`, type: "info", href: "/careersync", metadata: { userId: user.id, role } });
                return { data: { user: session.user, session }, error: null };
            },
            signInWithOAuth: async () => {
                const requestedRole = typeof window !== "undefined" ? window.localStorage.getItem("careersync_pending_oauth_role") : null;
                const role = requestedRole === "company" || requestedRole === "employee" || requestedRole === "candidate" ? requestedRole : "candidate";
                const user = getState().users.find((item) => item.role === role) ?? getState().users.find((item) => item.role === "candidate");
                if (!user) return { data: { provider: null, url: null }, error: new Error("No demo candidate account is available.") };
                const session = setDemoSessionForUser(user);
                return { data: { provider: "google", url: null, user: session.user, session }, error: null };
            },
            signOut: async () => { setCurrentSessionUser(null); notifyAuth("SIGNED_OUT", null); return { error: null }; },
            setSession: async (tokens: unknown) => {
                const tokenObj = tokens as { user?: DemoSessionUser; session?: { user?: DemoSessionUser } } | null;
                const userId = tokenObj?.user?.id ?? tokenObj?.session?.user?.id ?? null;
                const user = userId ? getState().users.find((item) => item.id === userId) ?? null : null;
                if (user) setDemoSessionForUser(user);
                return { data: { session: getAuthSession() }, error: null };
            },
        },
        storage: {
            from(bucket: string) {
                return {
                    upload: async (path: string, file: File) => {
                        const url = typeof URL !== "undefined" && typeof URL.createObjectURL === "function" ? URL.createObjectURL(file) : `local://storage/${bucket}/${path}`;
                        return { data: { path, fullPath: path, signedUrl: url }, error: null };
                    },
                    createSignedUrl: async (path: string) => ({ data: { signedUrl: `local://storage/${bucket}/${path}` }, error: null }),
                };
            },
        },
        from(table: string) {
            return buildQueryBuilder(table as keyof DemoState);
        },
    };
}

export function syncDemoUserFromAuth(input: {
    id: string;
    email?: string | null;
    role?: DemoRole | null;
    fullName?: string | null;
    companyName?: string | null;
    phone?: string | null;
}) {
    if (!input.id || !input.role) return;
    const currentState = getState();
    const existing = currentState.users.find((user) => user.id === input.id);
    const fallbackName = input.email?.split("@")[0] || "User";
    const nextRecord: DemoUserRecord = {
        id: input.id,
        email: input.email || existing?.email || `${input.id}@careersync.local`,
        password: existing?.password || "",
        full_name: input.fullName || existing?.full_name || fallbackName,
        role: input.role,
        company_name: input.companyName ?? existing?.company_name ?? (input.role === "admin" ? "BechnaSeekho" : null),
        phone: input.phone ?? existing?.phone ?? null,
    };
    const existingProfile = currentState.profiles.find((item) => item.id === input.id);
    const unchanged =
        existing?.email === nextRecord.email &&
        existing?.password === nextRecord.password &&
        existing?.full_name === nextRecord.full_name &&
        existing?.role === nextRecord.role &&
        (existing?.company_name ?? null) === (nextRecord.company_name ?? null) &&
        (existing?.phone ?? null) === (nextRecord.phone ?? null) &&
        existingProfile?.full_name === nextRecord.full_name &&
        (existingProfile?.company_name ?? null) === (nextRecord.company_name ?? null) &&
        (existingProfile?.phone ?? null) === (nextRecord.phone ?? null);
    if (unchanged) return;

    setState((state) => {
        const userIndex = state.users.findIndex((user) => user.id === input.id);
        if (userIndex >= 0) state.users[userIndex] = nextRecord;
        else state.users.unshift(nextRecord);

        const profile: DemoProfileRecord = {
            id: input.id,
            full_name: nextRecord.full_name,
            company_name: nextRecord.company_name ?? null,
            phone: nextRecord.phone ?? null,
        };
        const profileIndex = state.profiles.findIndex((item) => item.id === input.id);
        if (profileIndex >= 0) state.profiles[profileIndex] = profile;
        else state.profiles.unshift(profile);
        return state;
    });
}

export function mergeSharedDemoJobs(jobs: DemoJobRecord[], localOwnerId?: string | null) {
    if (!jobs.length) return;
    setState((state) => {
        jobs.forEach((incoming) => {
            const next: DemoJobRecord = {
                ...incoming,
                posted_by: incoming.posted_by ?? localOwnerId ?? null,
                tags: incoming.tags ?? [],
                responsibilities: incoming.responsibilities ?? [],
                required_skills: incoming.required_skills ?? incoming.tags ?? [],
                preferred_skills: incoming.preferred_skills ?? [],
                benefits: incoming.benefits ?? [],
            };
            const index = state.jobs.findIndex((job) => job.id === next.id);
            if (index >= 0) state.jobs[index] = { ...state.jobs[index], ...next };
            else state.jobs.unshift(next);
        });
        return state;
    });
}

export function mergeSharedDemoApplications(applications: DemoApplicationRecord[]) {
    if (!applications.length) return;
    setState((state) => {
        applications.forEach((incoming) => {
            const next: DemoApplicationRecord = {
                ...incoming,
                phone: incoming.phone ?? null,
                resume_path: incoming.resume_path ?? null,
                resume_url: incoming.resume_url ?? null,
                cover_letter: incoming.cover_letter ?? null,
                status: incoming.status || "submitted",
            };
            const index = state.applications.findIndex((application) => application.id === next.id);
            if (index >= 0) state.applications[index] = { ...state.applications[index], ...next };
            else state.applications.unshift(next);
        });
        return state;
    });
}

export function useDemoSnapshot() {
    const [snapshot, setSnapshot] = useState(() => getState());

    useEffect(() => {
        const runtime = getRuntime();
        const syncSnapshot = () => setSnapshot(getState());

        runtime.listeners.add(syncSnapshot);
        if (typeof window !== "undefined") window.addEventListener("storage", syncSnapshot);

        return () => {
            runtime.listeners.delete(syncSnapshot);
            if (typeof window !== "undefined") window.removeEventListener("storage", syncSnapshot);
        };
    }, []);

    return snapshot;
}

export function getDemoStateSnapshot() {
    return clone(getState());
}

export function getDemoSession() { return getAuthSession(); }
export async function demoGetSession() { return { data: { session: getAuthSession() }, error: null as Error | null }; }
export function demoOnAuthStateChange(callback: (event: string, session: DemoSession | null) => void) {
    const runtime = getRuntime();
    runtime.authListeners.add(callback);
    return {
        data: {
            subscription: {
                unsubscribe: () => runtime.authListeners.delete(callback),
            },
        },
    };
}
export async function demoSignInWithPassword(input: { email: string; password: string }) {
    const user = findUserByEmail(input.email);
    if (!user || user.password !== input.password) {
        return { data: { user: null, session: null }, error: new Error("Invalid email or password.") };
    }
    const session = setDemoSessionForUser(user);
    return { data: { user: session.user, session }, error: null as Error | null };
}
export async function demoSignUp(input: { email: string; password: string; data?: Record<string, unknown> }) {
    const meta = input.data ?? {};
    const role = sanitizeRole(meta.role);
    const user = createOrUpdateUser({
        email: input.email,
        password: input.password,
        full_name: String(meta.full_name ?? meta.name ?? input.email.split("@")[0] ?? "User"),
        role,
        company_name: (role === "company" || role === "employee") ? String(meta.company_name ?? meta.organization ?? "") || null : null,
        phone: typeof meta.phone === "string" ? meta.phone : null,
    });
    const session = setDemoSessionForUser(user);
    addNotification({ user_id: DEFAULT_ADMIN_ID, title: "New demo account created", message: `${user.full_name} signed up as ${role}.`, type: "info", href: "/careersync", metadata: { userId: user.id, role } });
    return { data: { user: session.user, session }, error: null as Error | null };
}
export async function demoSignOut() {
    setCurrentSessionUser(null);
    notifyAuth("SIGNED_OUT", null);
    return { error: null as Error | null };
}
export function getDemoCurrentUser() { return getCurrentUser(getState()); }
export function getDemoRole() { return getDemoCurrentUser()?.role ?? null; }
export function getDemoUsersByRole(role: DemoRole) { return getUsersByRole(role); }
export function getDemoNotificationsForUser(userId: string | null) { return userId ? getState().notifications.filter((notification) => notification.user_id === userId) : []; }
export function getUnreadDemoNotificationCount(userId: string | null) { return getDemoNotificationsForUser(userId).filter((notification) => !notification.read_at).length; }
export function markDemoNotificationRead(notificationId: string) { setState((state) => { const notification = state.notifications.find((item) => item.id === notificationId); if (notification) notification.read_at = nowIso(); return state; }); }
export function markAllDemoNotificationsRead(userId: string) { setState((state) => { state.notifications.forEach((notification) => { if (notification.user_id === userId && !notification.read_at) notification.read_at = nowIso(); }); return state; }); }
export function clearReadDemoNotifications(userId: string) { setState((state) => { state.notifications = state.notifications.filter((notification) => notification.user_id !== userId || !notification.read_at); return state; }); }
export function getDashboardSummary(userId: string | null) {
    const state = getState();
    const notifications = getDemoNotificationsForUser(userId);
    return {
        role: userId ? getRoleForUserId(userId) : null,
        totalJobs: state.jobs.filter((job) => job.status === "approved" && job.is_active && job.is_verified).length,
        pendingJobs: state.jobs.filter((job) => job.status === "pending").length,
        myJobs: state.jobs.filter((job) => job.posted_by === userId),
        myApplications: state.applications.filter((application) => application.user_id === userId),
        unreadNotifications: notifications.filter((notification) => !notification.read_at).length,
        notifications,
        employeeCount: state.users.filter((user) => user.role === "employee").length,
        pendingLeaveRequests: state.leaveRequests.filter((leave) => leave.status === "pending").length,
        pendingBlogs: state.blogs.filter((blog) => blog.status === "pending_review").length,
        pendingDeletionRequests: state.jobDeletionRequests.filter((request) => request.status === "pending").length,
    };
}
export function approveDemoJob(jobId: string, adminUserId: string) { updateJobStatus(jobId, "approved", adminUserId); }
export function rejectDemoJob(jobId: string, adminUserId: string) { updateJobStatus(jobId, "rejected", adminUserId); }
export function requestDemoJobChanges(jobId: string, adminUserId: string, notes?: string) { updateJobStatus(jobId, "changes_requested", adminUserId, notes); }
export function resubmitDemoJob(jobId: string, actorUserId: string, updates?: Partial<DemoJobRecord>) { updateJobDraft(jobId, updates ?? {}, actorUserId); }
export function deleteDemoJob(jobId: string, actorUserId: string) { deleteJobDraft(jobId, actorUserId); }
export function approveDemoJobDeletion(requestId: string, adminUserId: string, approve: boolean, notes?: string) {
    setState((state) => {
        const request = state.jobDeletionRequests.find((item) => item.id === requestId);
        const admin = state.users.find((user) => user.id === adminUserId);
        if (!request || !admin || admin.role !== "admin") return state;

        request.status = approve ? "approved" : "rejected";
        request.reviewed_by = adminUserId;
        request.notes = notes ?? null;
        request.updated_at = nowIso();

        const job = state.jobs.find((item) => item.id === request.job_id);
        if (approve && job) {
            state.jobs = state.jobs.filter((item) => item.id !== request.job_id);
            state.applications = state.applications.filter((item) => item.job_id !== request.job_id);
        }

        state.notifications.unshift({
            id: demoId("notif"),
            user_id: request.requested_by,
            title: approve ? "Job deletion approved" : "Job deletion rejected",
            message: approve
                ? `${job?.role ?? "Your job"} was deleted after admin approval.`
                : notes ?? `${job?.role ?? "Your job"} deletion request needs additional review.`,
            type: approve ? "success" : "warning",
            href: "/careersync",
            created_at: nowIso(),
            read_at: null,
            metadata: { requestId, jobId: request.job_id },
        });
        appendAuditMessage(state, adminUserId, approve ? "job.delete_approved" : "job.delete_rejected", `${admin.full_name} ${approve ? "approved" : "rejected"} a job deletion request.`, "job", request.job_id);
        return state;
    });
}
export function updateDemoApplicationStatus(applicationId: string, status: string) { updateApplicationStatus(applicationId, status); }
export function recordDemoApplication(input: { jobId: string; userId: string; fullName: string; email: string; phone: string | null; resumePath: string | null; resumeUrl: string | null; coverLetter: string | null; }) {
    setState((state) => {
        const job = state.jobs.find((item) => item.id === input.jobId);
        const application: DemoApplicationRecord = { id: demoId("app"), job_id: input.jobId, user_id: input.userId, full_name: input.fullName, email: input.email, phone: input.phone, resume_path: input.resumePath, resume_url: input.resumeUrl, cover_letter: input.coverLetter, status: "submitted", created_at: nowIso(), updated_at: nowIso() };
        state.applications.unshift(application);
        const ownerId = job?.posted_by ?? DEFAULT_ADMIN_ID;
        state.notifications.unshift({ id: demoId("notif"), user_id: ownerId, title: "New application received", message: `${input.fullName} applied for ${job?.role ?? "a role"} at ${job?.company ?? "CareerSync"}.`, type: "info", href: "/careersync/jobs", created_at: nowIso(), read_at: null, metadata: { applicationId: application.id, jobId: input.jobId } });
        state.notifications.unshift({ id: demoId("notif"), user_id: input.userId, title: "Application submitted", message: `Your application for ${job?.role ?? "the role"} was submitted successfully.`, type: "success", href: "/careersync/notifications", created_at: nowIso(), read_at: null, metadata: { applicationId: application.id, jobId: input.jobId } });
        return state;
    });
}
export function updateDemoApplicationMatch(
    applicationId: string,
    match: {
        fitScore: number;
        matchLevel: "high" | "medium" | "low";
        matchedSkills: string[];
        missingSkills: string[];
        aiReason: string;
        source: "ai" | "fallback";
        scoredAt?: string;
    },
) {
    setState((state) => {
        const application = state.applications.find((item) => item.id === applicationId);
        if (!application) return state;
        application.ai_match_score = match.fitScore;
        application.ai_match_level = match.matchLevel;
        application.ai_match_reason = match.aiReason;
        application.ai_matched_skills = match.matchedSkills;
        application.ai_missing_skills = match.missingSkills;
        application.ai_score_source = match.source;
        application.ai_scored_at = match.scoredAt ?? nowIso();
        application.updated_at = nowIso();
        return state;
    });
}
export function getDemoTableRows(table: keyof DemoState) { return getRowsForTable(getState(), table); }
export function getDemoSavedJobIds(userId: string | null) { return userId ? (getState().savedJobIdsByUser[userId] ?? []) : []; }
export function isDemoJobSaved(userId: string | null, jobId: string) { return userId ? getDemoSavedJobIds(userId).includes(jobId) : false; }
export function toggleDemoSavedJob(userId: string, jobId: string) {
    setState((state) => {
        const current = state.savedJobIdsByUser[userId] ?? [];
        state.savedJobIdsByUser[userId] = current.includes(jobId) ? current.filter((id) => id !== jobId) : [jobId, ...current];
        return state;
    });
}
export function useDemoNotifications(userId: string | null) { return useDemoSnapshot().notifications.filter((notification) => notification.user_id === userId); }
export function useDemoJobs() { return useDemoSnapshot().jobs; }
export function useDemoSummary(userId: string | null) { const snapshot = useDemoSnapshot(); const notifications = snapshot.notifications.filter((notification) => notification.user_id === userId); return { role: userId ? getRoleForUserId(userId) : null, unreadNotifications: notifications.filter((notification) => !notification.read_at).length, notifications, jobs: snapshot.jobs, applications: snapshot.applications, savedJobIds: userId ? (snapshot.savedJobIdsByUser[userId] ?? []) : [] }; }
export function getDemoUserById(userId: string | null) { return userId ? getState().users.find((user) => user.id === userId) ?? null : null; }
export function getDemoDisplayName(userId: string | null) { return getDisplayName(getDemoUserById(userId)); }
export function getDemoActivityFeed(limit = 20) { return getState().activity.slice(0, limit); }
export function getDemoJobDeletionRequests() { return getState().jobDeletionRequests; }
export function getDemoEmployeeSnapshot(userId: string) {
    const state = getState();
    return {
        tasks: state.tasks.filter((task) => task.assignee_user_id === userId),
        timesheets: state.timesheets.filter((sheet) => sheet.user_id === userId),
        leaveRequests: state.leaveRequests.filter((leave) => leave.user_id === userId),
        chats: state.chatMessages.filter((message) => message.sender_id === userId || message.receiver_id === userId),
        blogs: state.blogs.filter((blog) => blog.author_id === userId),
    };
}
export function createDemoTask(input: { title: string; assigneeUserId: string; createdBy: string; description?: string | null; dueDate?: string | null; priority?: DemoTaskRecord["priority"]; }) {
    setState((state) => {
        const creator = state.users.find((user) => user.id === input.createdBy);
        if (!creator || (creator.role !== "admin" && creator.role !== "company")) return state;
        const task: DemoTaskRecord = {
            id: demoId("task"),
            title: input.title,
            description: input.description ?? null,
            assignee_user_id: input.assigneeUserId,
            created_by: input.createdBy,
            status: "todo",
            due_date: input.dueDate ?? null,
            priority: input.priority ?? "medium",
            created_at: nowIso(),
            updated_at: nowIso(),
        };
        state.tasks.unshift(task);
        state.notifications.unshift({
            id: demoId("notif"),
            user_id: input.assigneeUserId,
            title: "New task assigned",
            message: `You were assigned: ${input.title}`,
            type: "info",
            href: "/careersync",
            created_at: nowIso(),
            read_at: null,
            metadata: { taskId: task.id },
        });
        appendAuditMessage(state, input.createdBy, "task.created", `${creator.full_name} assigned task \"${input.title}\".`, "task", task.id);
        return state;
    });
}
export function updateDemoTaskStatus(taskId: string, status: DemoTaskRecord["status"], actorUserId: string) {
    setState((state) => {
        const task = state.tasks.find((item) => item.id === taskId);
        const actor = state.users.find((item) => item.id === actorUserId);
        if (!task || !actor) return state;
        if (task.assignee_user_id !== actorUserId && actor.role !== "admin" && actor.role !== "company") return state;
        task.status = status;
        task.updated_at = nowIso();
        appendAuditMessage(state, actorUserId, "task.status_updated", `${actor.full_name} marked task ${task.title} as ${status}.`, "task", task.id);
        return state;
    });
}
export function addDemoTimesheetEntry(input: { userId: string; workDate: string; hours: number; taskSummary: string; }) {
    setState((state) => {
        const user = state.users.find((record) => record.id === input.userId);
        if (!user) return state;
        const entry: DemoTimesheetRecord = {
            id: demoId("timesheet"),
            user_id: input.userId,
            work_date: input.workDate,
            hours: input.hours,
            task_summary: input.taskSummary,
            status: "submitted",
            created_at: nowIso(),
            updated_at: nowIso(),
        };
        state.timesheets.unshift(entry);
        const reviewOwners = state.users.filter((record) => record.role === "company").map((record) => record.id);
        reviewOwners.forEach((reviewerId) => {
            state.notifications.unshift({
                id: demoId("notif"),
                user_id: reviewerId,
                title: "New timesheet submitted",
                message: `${user.full_name} submitted ${input.hours}h for ${input.workDate}.`,
                type: "info",
                href: "/careersync",
                created_at: nowIso(),
                read_at: null,
                metadata: { timesheetId: entry.id },
            });
        });
        appendAuditMessage(state, input.userId, "timesheet.submitted", `${user.full_name} submitted a timesheet entry.`, "timesheet", entry.id);
        return state;
    });
}
export function submitDemoLeaveRequest(input: { userId: string; leaveType: DemoLeaveRequestRecord["leave_type"]; startDate: string; endDate: string; reason?: string | null; }) {
    setState((state) => {
        const user = state.users.find((record) => record.id === input.userId);
        if (!user) return state;
        const leave: DemoLeaveRequestRecord = {
            id: demoId("leave"),
            user_id: input.userId,
            leave_type: input.leaveType,
            start_date: input.startDate,
            end_date: input.endDate,
            reason: input.reason ?? null,
            status: "pending",
            reviewed_by: null,
            created_at: nowIso(),
            updated_at: nowIso(),
        };
        state.leaveRequests.unshift(leave);
        const reviewers = [
            ...state.users.filter((record) => record.role === "admin").map((record) => record.id),
            ...state.users.filter((record) => record.role === "company").map((record) => record.id),
        ];
        reviewers.forEach((reviewerId) => {
            state.notifications.unshift({
                id: demoId("notif"),
                user_id: reviewerId,
                title: "Leave request pending",
                message: `${user.full_name} requested ${input.leaveType} leave from ${input.startDate} to ${input.endDate}.`,
                type: "warning",
                href: "/careersync",
                created_at: nowIso(),
                read_at: null,
                metadata: { leaveId: leave.id },
            });
        });
        appendAuditMessage(state, input.userId, "leave.requested", `${user.full_name} submitted a leave request.`, "leave", leave.id);
        return state;
    });
}
export function reviewDemoLeaveRequest(leaveId: string, reviewerId: string, approve: boolean) {
    setState((state) => {
        const leave = state.leaveRequests.find((item) => item.id === leaveId);
        const reviewer = state.users.find((item) => item.id === reviewerId);
        if (!leave || !reviewer || (reviewer.role !== "admin" && reviewer.role !== "company")) return state;
        leave.status = approve ? "approved" : "rejected";
        leave.reviewed_by = reviewerId;
        leave.updated_at = nowIso();
        state.notifications.unshift({
            id: demoId("notif"),
            user_id: leave.user_id,
            title: approve ? "Leave approved" : "Leave rejected",
            message: approve ? "Your leave request has been approved." : "Your leave request was rejected.",
            type: approve ? "success" : "warning",
            href: "/careersync",
            created_at: nowIso(),
            read_at: null,
            metadata: { leaveId },
        });
        appendAuditMessage(state, reviewerId, approve ? "leave.approved" : "leave.rejected", `${reviewer.full_name} reviewed leave request ${leaveId}.`, "leave", leaveId);
        return state;
    });
}
export function addDemoChatMessage(input: { senderId: string; receiverId: string; body: string }) {
    setState((state) => {
        const sender = state.users.find((user) => user.id === input.senderId);
        const receiver = state.users.find((user) => user.id === input.receiverId);
        if (!sender || !receiver || !input.body.trim()) return state;
        const message: DemoChatMessageRecord = {
            id: demoId("chat"),
            sender_id: input.senderId,
            receiver_id: input.receiverId,
            body: input.body.trim(),
            created_at: nowIso(),
        };
        state.chatMessages.unshift(message);
        state.notifications.unshift({
            id: demoId("notif"),
            user_id: input.receiverId,
            title: "New message",
            message: `${sender.full_name} sent you a message in CareerSync chat.`,
            type: "info",
            href: "/careersync",
            created_at: nowIso(),
            read_at: null,
            metadata: { senderId: sender.id },
        });
        appendAuditMessage(state, input.senderId, "chat.sent", `${sender.full_name} sent a chat message to ${receiver.full_name}.`, "chat", message.id);
        return state;
    });
}
export function createDemoBlogDraft(input: { authorId: string; title: string; body: string }) {
    setState((state) => {
        const author = state.users.find((user) => user.id === input.authorId);
        if (!author || !input.title.trim() || !input.body.trim()) return state;
        const blog: DemoBlogRecord = {
            id: demoId("blog"),
            author_id: input.authorId,
            title: input.title.trim(),
            body: input.body.trim(),
            status: "draft",
            reviewed_by: null,
            review_notes: null,
            created_at: nowIso(),
            updated_at: nowIso(),
        };
        state.blogs.unshift(blog);
        appendAuditMessage(state, input.authorId, "blog.drafted", `${author.full_name} created a draft blog post.`, "blog", blog.id);
        return state;
    });
}
export function submitDemoBlogForReview(blogId: string, authorId: string) {
    setState((state) => {
        const blog = state.blogs.find((item) => item.id === blogId && item.author_id === authorId);
        const author = state.users.find((user) => user.id === authorId);
        if (!blog || !author) return state;
        blog.status = "pending_review";
        blog.updated_at = nowIso();
        const adminIds = state.users.filter((user) => user.role === "admin").map((user) => user.id);
        adminIds.forEach((adminId) => {
            state.notifications.unshift({
                id: demoId("notif"),
                user_id: adminId,
                title: "Blog pending review",
                message: `${author.full_name} submitted \"${blog.title}\" for approval.`,
                type: "warning",
                href: "/careersync",
                created_at: nowIso(),
                read_at: null,
                metadata: { blogId: blog.id },
            });
        });
        appendAuditMessage(state, authorId, "blog.submitted", `${author.full_name} submitted blog ${blog.title} for review.`, "blog", blog.id);
        return state;
    });
}
export function reviewDemoBlog(blogId: string, adminId: string, approve: boolean, notes?: string) {
    setState((state) => {
        const admin = state.users.find((user) => user.id === adminId);
        const blog = state.blogs.find((item) => item.id === blogId);
        if (!admin || admin.role !== "admin" || !blog) return state;
        blog.status = approve ? "approved" : "rejected";
        blog.reviewed_by = adminId;
        blog.review_notes = notes ?? null;
        blog.updated_at = nowIso();
        state.notifications.unshift({
            id: demoId("notif"),
            user_id: blog.author_id,
            title: approve ? "Blog approved" : "Blog rejected",
            message: approve ? `Your blog \"${blog.title}\" is approved.` : notes ?? `Your blog \"${blog.title}\" needs updates before approval.`,
            type: approve ? "success" : "warning",
            href: "/careersync",
            created_at: nowIso(),
            read_at: null,
            metadata: { blogId: blog.id },
        });
        appendAuditMessage(state, adminId, approve ? "blog.approved" : "blog.rejected", `${admin.full_name} reviewed blog ${blog.title}.`, "blog", blog.id);
        return state;
    });
}

export const DEMO_ACCOUNTS = [
    { role: "Admin", email: "admin@gmail.com", password: "129", note: "Approve jobs, review submissions, manage notifications" },
    { role: "HR / Company", email: "prateek.tyagi1@wipro.com", password: "129", note: "Submit jobs, review applications, request changes" },
    { role: "Employee", email: "employee@wipro.com", password: "129", note: "Submit timesheets, manage tasks, request leave, and write blogs" },
    { role: "Candidate", email: "vasu.tyagi1@gmail.com", password: "129", note: "Apply to jobs and track notifications" },
] as const;
