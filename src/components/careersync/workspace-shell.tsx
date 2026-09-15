import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ArrowRight, BarChart3, Briefcase, Building2, CalendarDays, CheckCircle2, Clock3, Download, Eye, FileClock, Languages, LockKeyhole, LogOut, Mail, MapPin, MessageSquareText, Phone, Plus, RefreshCw, ShieldCheck, Star, Unlock, Upload, Users, UserRound, Wallet, X } from "lucide-react";
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
    requestDemoApplicationProfileUnlock,
    submitDemoBlogForReview,
    submitDemoLeaveRequest,
    updateDemoTaskStatus,
    toggleDemoSavedJob,
    updateDemoApplicationStatus,
    reviewDemoApplicationProfileUnlock,
    useDemoSnapshot,
    type DemoApplicationRecord,
    type DemoJobRecord,
} from "@/services/careersync/careersync-service";
import type { DemoUserRecord } from "@/lib/careersync-demo";
import { signOut } from "@/services/platform/auth-service";
import { notifyAdminWhatsAppSilently } from "@/lib/admin-whatsapp-notify";
import {
    fetchPublicCareerSyncJobs,
    fetchSharedCareerSyncApplications,
    fetchSharedCareerSyncJobs,
    fetchSharedCareerSyncResumeInsights,
    repairSharedCareerSyncApplications,
    requestSharedCareerSyncDatabaseProfileUnlock,
    requestSharedCareerSyncProfileUnlock,
    reviewSharedCareerSyncProfileUnlock,
    reviewSharedCareerSyncJob,
    updateSharedCareerSyncApplicationStatus,
    uploadSharedCareerSyncResume,
    parseSharedCareerSyncResume,
    type SharedResumeParseResult,
} from "@/lib/careersync-jobs-api";
import { getRoleLabel } from "@/lib/careersync-rbac";
import { fallbackCareerSyncMatch } from "@/lib/careersync-match";
import { buildJobSheetPayload, submitToGoogleSheet } from "@/lib/google-sheet-submit";
import { extractResumeText, ResumeError } from "@/lib/resume-extract";
import { extractResumeProfile } from "@/lib/resume-profile-extract";

const ROLE_NAVS = {
    admin: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Jobs Approval", href: "#jobs-approval" },
        { label: "Reports", href: "#reports" },
        { label: "Approval Inbox", href: "#approval-inbox" },
        { label: "Applications", href: "#applications-admin" },
        { label: "Resume Intelligence", href: "#resume-intelligence" },
        { label: "Approval Log", href: "#approval-log" },
        { label: "Data Health", href: "#data-health" },
        { label: "Lead Assignment", href: "#lead-assignment" },
        { label: "Delete Requests", href: "#delete-requests" },
        { label: "Blog Approval", href: "#blog-approval" },
        { label: "All Jobs", href: "#all-jobs" },
        { label: "User Management", href: "#user-management" },
        { label: "Users", href: "#users" },
        { label: "HR Management", href: "#hr-management" },
        { label: "Candidates", href: "#candidates" },
        { label: "Activity", href: "#activity" },
        { label: "Notifications", href: "#notifications" },
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
        { label: "Profile", href: "#profile" },
        { label: "Saved Jobs", href: "#saved-jobs" },
        { label: "Applications", href: "#applications" },
        { label: "Status Tracking", href: "#status-tracking" },
        { label: "Profile Improvements", href: "#profile-improvements" },
        { label: "Notifications", href: "#notifications" },
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
        if (!user || !role) return;
        let cancelled = false;
        const jobsPromise = role === "admin" || role === "company"
            ? fetchSharedCareerSyncJobs({ role, userId: user.id, email: user.email })
            : fetchPublicCareerSyncJobs();
        const applicationsPromise = role === "admin" || role === "company" || role === "candidate"
            ? fetchSharedCareerSyncApplications({ role, userId: user.id, email: user.email })
            : Promise.resolve([]);
        Promise.all([jobsPromise, applicationsPromise])
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

    const navItems = role === "admin" ? ROLE_NAVS.admin : role === "company" ? ROLE_NAVS.company : role === "employee" ? ROLE_NAVS.employee : ROLE_NAVS.candidate;
    const workspaceSectionIds = useMemo(
        () => new Set(navItems.filter((item) => item.href.startsWith("#")).map((item) => item.href.slice(1))),
        [navItems],
    );
    const [activeWorkspaceSection, setActiveWorkspaceSection] = useState("dashboard");

    useEffect(() => {
        if (!role) return;
        const syncActiveSection = () => {
            const hash = window.location.hash.replace("#", "");
            setActiveWorkspaceSection(workspaceSectionIds.has(hash) ? hash : "dashboard");
        };
        syncActiveSection();
        window.addEventListener("hashchange", syncActiveSection);
        return () => window.removeEventListener("hashchange", syncActiveSection);
    }, [role, workspaceSectionIds]);

    const openWorkspaceSection = (sectionId: string, href: string) => {
        setActiveWorkspaceSection(sectionId);
        window.history.replaceState(null, "", href);

        if (role === "admin" || role === "company") {
            window.dispatchEvent(new CustomEvent(role === "company" ? "careersync-company-section" : "careersync-admin-section", { detail: sectionId }));
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (role === "candidate") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (authLoading || roleLoading) {
        return <WorkspaceLoading />;
    }

    if (!user || !role) {
        return <WorkspaceLoading />;
    }

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
                                (() => {
                                    const sectionId = item.href.slice(1);
                                    const isActive = activeWorkspaceSection === sectionId;
                                    return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        openWorkspaceSection(sectionId, item.href);
                                    }}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`group relative inline-flex items-center overflow-hidden rounded-full px-3 py-2 text-xs font-black ring-1 transition duration-300 ${
                                        isActive
                                            ? "scale-[1.02] bg-blue-600 text-white shadow-lg shadow-blue-100 ring-blue-200"
                                            : "bg-white text-slate-600 ring-slate-100 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    <span className={`mr-2 h-1.5 w-1.5 rounded-full transition-all duration-300 ${isActive ? "scale-100 bg-white opacity-100" : "scale-0 bg-blue-500 opacity-0"}`} />
                                    <span className="relative z-10">{item.label}</span>
                                    <span className={`absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-white/80 transition-all duration-300 ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`} />
                                </a>
                                    );
                                })()
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
                {isCompany && <CompanyWorkspace userId={user.id} email={user.email ?? ""} snapshot={snapshot} />}
                {isEmployee && <EmployeeWorkspace userId={user.id} snapshot={snapshot} />}
                {isCandidate && <CandidateWorkspace userId={user.id} snapshot={snapshot} activeSection={activeWorkspaceSection} />}
            </main>
        </div>
    );
}

function AdminWorkspace({ userId, snapshot }: { userId: string; snapshot: ReturnType<typeof useDemoSnapshot> }) {
    const adminSectionIds = useMemo(() => new Set(ROLE_NAVS.admin.map((item) => item.href.replace("#", ""))), []);
    const [activeAdminSection, setActiveAdminSection] = useState(() => {
        if (typeof window === "undefined") return "dashboard";
        const hash = window.location.hash.replace("#", "");
        return adminSectionIds.has(hash) ? hash : "dashboard";
    });
    const [storageInsight, setStorageInsight] = useState<{
        bucket: string;
        storageCount: number;
        samplePaths: string[];
        storageFiles?: Array<{
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
        }>;
        checkedAt: string;
    } | null>(null);
    const [storageInsightError, setStorageInsightError] = useState("");
    const [storageInsightRefreshing, setStorageInsightRefreshing] = useState(false);
    const [adminResumeUpload, setAdminResumeUpload] = useState({
        fullName: "",
        phone: "",
        email: "",
        city: "",
        totalExperience: "",
        lastRole: "",
        note: "",
    });
    const [adminResumeFile, setAdminResumeFile] = useState<File | null>(null);
    const [adminResumeParsed, setAdminResumeParsed] = useState<SharedResumeParseResult | null>(null);
    const [adminResumeParseMessage, setAdminResumeParseMessage] = useState("");
    const [adminResumeParsing, setAdminResumeParsing] = useState(false);
    const [adminResumeUploading, setAdminResumeUploading] = useState(false);
    const [adminStoredResumeLog, setAdminStoredResumeLog] = useState(() => getStoredAdminResumeUploadLog());
    const [activeUserSummary, setActiveUserSummary] = useState<"all" | "hr" | "candidate" | "employee" | null>(null);
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
    const allApplications = snapshot.applications
        .map((application) => ({
            ...application,
            job: snapshot.jobs.find((job) => job.id === application.job_id),
        }))
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    const pendingUnlockApplications = allApplications.filter((application) => getUnlockStatus(application) === "requested");
    const approvalLog = allApplications.flatMap((application) =>
        getApplicationAdminLog(application).map((entry) => ({ ...entry, application })),
    ).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const dataHealth = getApplicationDataHealth(allApplications);
    const resumeInsights = getResumeStorageInsights(allApplications);
    const knownResumeUploadLog = [...resumeInsights.uploadLog, ...adminStoredResumeLog];
    const storageOnlyResumeLog = getStorageOnlyResumeLog(storageInsight, knownResumeUploadLog);
    const combinedResumeUploadLog = [...knownResumeUploadLog, ...storageOnlyResumeLog]
        .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
    const todaysResumeUploadLog = combinedResumeUploadLog.filter((entry) => isKolkataToday(entry.uploadedAt));
    const duplicateGroups = getDuplicateCandidateGroups(allApplications);
    const qualityRankings = allApplications
        .map((application) => ({ application, score: getCandidateQualityScore(application) }))
        .sort((a, b) => b.score - a.score || (a.application.created_at < b.application.created_at ? 1 : -1));
    const resumeStorageCount = storageInsight?.storageCount ?? resumeInsights.storageCount;
    const resumeUniqueCount = storageInsight ? getUniqueStoredResumeCount(storageInsight) : resumeInsights.uniqueResumeCount;
    const adminSectionClass = (id: string, className = "") => activeAdminSection === id ? className : `${className} hidden`;

    useEffect(() => {
        const syncFromLocation = () => {
            const next = window.location.hash.replace("#", "");
            setActiveAdminSection(adminSectionIds.has(next) ? next : "dashboard");
        };
        const syncFromEvent = (event: Event) => {
            const detail = (event as CustomEvent<string>).detail;
            setActiveAdminSection(adminSectionIds.has(detail) ? detail : "dashboard");
        };
        syncFromLocation();
        window.addEventListener("hashchange", syncFromLocation);
        window.addEventListener("careersync-admin-section", syncFromEvent);
        return () => {
            window.removeEventListener("hashchange", syncFromLocation);
            window.removeEventListener("careersync-admin-section", syncFromEvent);
        };
    }, [adminSectionIds]);

    const loadStorageInsights = async (cancelled?: () => boolean) => {
        if (!cancelled?.()) setStorageInsightRefreshing(true);
        try {
            const insight = await fetchSharedCareerSyncResumeInsights({ role: "admin", userId });
            if (cancelled?.()) return;
            setStorageInsight(insight);
            setStorageInsightError("");
            return true;
        } catch (error) {
            if (cancelled?.()) return;
            setStorageInsight(null);
            setStorageInsightError(error instanceof Error ? error.message : "Could not load Supabase Storage count.");
            return false;
        } finally {
            if (!cancelled?.()) setStorageInsightRefreshing(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        void loadStorageInsights(() => cancelled);
        return () => {
            cancelled = true;
        };
    }, [userId]);

    const refreshStorageInsights = async () => {
        const refreshed = await loadStorageInsights();
        if (refreshed) {
            toast.success("Supabase resume intelligence refreshed.");
        } else {
            toast.error(storageInsightError || "Could not refresh Supabase resume intelligence.");
        }
    };

    const applyAdminResumeExtract = (extracted: SharedResumeParseResult) => {
        setAdminResumeUpload((prev) => ({
            ...prev,
            fullName: extracted.name || prev.fullName,
            phone: extracted.phone || prev.phone,
            email: extracted.email || prev.email,
            city: extracted.city || prev.city,
            totalExperience: extracted.totalExperience || prev.totalExperience,
            lastRole: extracted.lastRole || prev.lastRole,
        }));
        setAdminResumeParsed(extracted);
    };

    const handleAdminResumeFile = async (file: File | null) => {
        setAdminResumeFile(file);
        setAdminResumeParsed(null);
        setAdminResumeParseMessage("");
        if (!file) return;

        setAdminResumeParsing(true);
        try {
            const text = await extractResumeText(file);
            let extracted: SharedResumeParseResult | null = null;
            try {
                extracted = await parseSharedCareerSyncResume({ text, fileName: file.name });
            } catch {
                extracted = null;
            }
            const finalExtract = extracted ?? extractResumeProfile(text);
            applyAdminResumeExtract(finalExtract);
            const facts = [
                finalExtract.name ? "name" : "",
                finalExtract.phone ? "phone" : "",
                finalExtract.email ? "email" : "",
                finalExtract.city ? "city" : "",
                finalExtract.totalExperience ? "experience" : "",
            ].filter(Boolean);
            const confidence = finalExtract.confidence ? ` (${finalExtract.confidence}% confidence)` : "";
            setAdminResumeParseMessage(
                facts.length
                    ? `Auto-filled ${facts.join(", ")} from resume${confidence}. Please review once before upload.`
                    : "Resume text was read, but key candidate details were not clearly found. Please fill them manually.",
            );
            toast.success(facts.length ? "Resume details auto-filled." : "Resume read, please review details.");
        } catch (error) {
            const message = error instanceof ResumeError
                ? `${error.message}. ${error.hint}`
                : error instanceof Error
                    ? error.message
                    : "Could not read this resume.";
            setAdminResumeParseMessage(message);
            toast.error(message);
        } finally {
            setAdminResumeParsing(false);
        }
    };

    const uploadAdminResume = async () => {
        const fullName = adminResumeUpload.fullName.trim();
        const phone = adminResumeUpload.phone.trim();
        const email = adminResumeUpload.email.trim().toLowerCase();
        const city = adminResumeUpload.city.trim();
        const totalExperience = adminResumeUpload.totalExperience.trim();
        const lastRole = adminResumeUpload.lastRole.trim();
        if (!fullName) {
            toast.error("Candidate name is required.");
            return;
        }
        if (!phone) {
            toast.error("Phone number is required for WhatsApp resumes.");
            return;
        }
        if (!adminResumeFile) {
            toast.error("Please choose a resume file.");
            return;
        }
        setAdminResumeUploading(true);
        try {
            const uploaded = await uploadSharedCareerSyncResume({
                userId: `admin-whatsapp-resume-${Date.now()}`,
                file: adminResumeFile,
                candidateName: fullName,
                candidateEmail: email,
                candidatePhone: phone,
                candidateCity: city,
                candidateExperience: totalExperience,
                candidateLastRole: lastRole,
                source: "admin-whatsapp-resume",
            });

            try {
                await submitToGoogleSheet({
                    type: "resume",
                    fullName,
                    email,
                    phone,
                    resumeName: adminResumeFile.name,
                    resumeType: adminResumeFile.type || "application/octet-stream",
                    resumeSize: adminResumeFile.size,
                    resumePath: uploaded.path,
                    resumeUrl: uploaded.url,
                    sourceLabel: "Submitted from CareerSync admin WhatsApp upload",
                });
            } catch (sheetError) {
                toast.warning(sheetError instanceof Error ? `Resume stored, but Sheet update failed: ${sheetError.message}` : "Resume stored, but Sheet update failed.");
            }

            setAdminStoredResumeLog(persistAdminResumeUploadLog({
                id: `admin-upload-${uploaded.path}`,
                candidateName: fullName,
                role: "Admin WhatsApp resume",
                company: "Supabase Storage",
                fileName: uploaded.name || adminResumeFile.name,
                uploadedAt: new Date().toISOString(),
                status: `${formatBytes(adminResumeFile.size)} stored`,
                path: uploaded.path,
                downloadUrl: getAdminResumeDownloadUrl(uploaded.path, uploaded.name || adminResumeFile.name),
                city,
                experience: totalExperience,
                lastRole,
            }));
            setAdminResumeUpload({ fullName: "", phone: "", email: "", city: "", totalExperience: "", lastRole: "", note: "" });
            setAdminResumeFile(null);
            setAdminResumeParsed(null);
            setAdminResumeParseMessage("");
            const input = document.getElementById("admin-whatsapp-resume-file") as HTMLInputElement | null;
            if (input) input.value = "";
            await loadStorageInsights();
            toast.success("Resume uploaded to Supabase Storage.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not upload resume.");
        } finally {
            setAdminResumeUploading(false);
        }
    };

    const repairApplications = async () => {
        try {
            const result = await repairSharedCareerSyncApplications(snapshot.applications);
            mergeSharedCareerSyncApplications(result.applications);
            toast.success(`Repair complete: ${result.inserted} imported, ${result.skipped} already present.`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Application repair failed.");
        }
    };

    const reviewApplicationSharing = async (applicationId: string, approved: boolean) => {
        const action = approved ? "approved for recruiter" : "rejected";
        try {
            const application = await reviewSharedCareerSyncProfileUnlock({
                applicationId,
                approved,
                reviewedBy: getDemoDisplayName(userId),
            });
            if (application) {
                mergeSharedCareerSyncApplications([application]);
            } else {
                reviewDemoApplicationProfileUnlock(applicationId, approved, userId);
            }
            toast.success(`Candidate profile ${action}.`);
        } catch (error) {
            reviewDemoApplicationProfileUnlock(applicationId, approved, userId);
            toast.warning(error instanceof Error ? error.message : `Saved locally. Shared ${action} sync failed.`);
        }
    };

    return (
        <div className="space-y-6">
            <section id="dashboard" className={adminSectionClass("dashboard")}>
                <CareerSyncDashboard />
            </section>

            <section id="jobs-approval" className={adminSectionClass("jobs-approval", "rounded-[2rem] border border-blue-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(37,99,235,0.28)] sm:p-7")}>
                <SectionHeading title="Jobs Approval" subtitle="Review HR submissions before they go public." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {pendingJobs.length === 0 ? (
                        <EmptyState title="No pending jobs" message="HR submissions will appear here for admin approval." />
                    ) : pendingJobs.map((job) => <AdminJobCard key={job.id} job={job} adminUserId={userId} />)}
                </div>
            </section>

            <section id="reports" className={adminSectionClass("reports", "rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(99,102,241,0.2)] sm:p-7")}>
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

            <section id="approval-inbox" className={adminSectionClass("approval-inbox", "rounded-[2rem] border border-amber-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(245,158,11,0.22)] sm:p-7")}>
                <SectionHeading title="Company Approval Inbox" subtitle="Review recruiter requests to unlock candidate contact and resume." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {pendingUnlockApplications.length === 0 ? (
                        <EmptyState title="No profile unlock requests" message="Recruiter unblock requests will appear here for admin approval." />
                    ) : pendingUnlockApplications.map((application) => (
                        <div key={application.id} className="rounded-3xl border border-amber-100 bg-amber-50/40 p-4 ring-1 ring-amber-100">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{application.full_name}</p>
                                    <p className="mt-1 text-xs text-slate-600">{application.job?.role ?? "Role"} · {application.job?.company ?? "Company"}</p>
                                    <p className="mt-1 text-xs font-semibold text-amber-700">{getUnlockRequestLine(application) || "Recruiter requested full profile access."}</p>
                                </div>
                                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">Unlock requested</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <ActionButton tone="success" onClick={() => void reviewApplicationSharing(application.id, true)}>Approve unlock</ActionButton>
                                <ActionButton tone="danger" onClick={() => void reviewApplicationSharing(application.id, false)}>Reject unlock</ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="applications-admin" className={adminSectionClass("applications-admin", "rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(16,185,129,0.2)] sm:p-7")}>
                <SectionHeading title="All Applications" subtitle="Admin view across every company, role, and status." />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="grid gap-2 sm:grid-cols-3">
                        <SummaryCard label="Total" value={String(allApplications.length)} icon={<Users className="h-4 w-4" />} />
                        <SummaryCard label="Resumes" value={String(allApplications.filter((item) => item.resume_url || item.resume_path).length)} icon={<FileClock className="h-4 w-4" />} />
                        <SummaryCard label="Interview" value={String(allApplications.filter((item) => recruiterStage(item.status) === "Interview").length)} icon={<CalendarDays className="h-4 w-4" />} />
                    </div>
                    <ActionButton tone="success" onClick={() => void repairApplications()}>Repair / sync cached applications</ActionButton>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {allApplications.length === 0 ? (
                        <EmptyState title="No applications yet" message="Applications from candidates will appear here after they apply." />
                    ) : allApplications.slice(0, 20).map((application) => {
                        const sharingStatus = getProfileSharingStatus(application);
                        return (
                            <div key={application.id} className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4 ring-1 ring-emerald-100">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{application.full_name}</p>
                                        <p className="mt-1 text-xs text-slate-600">{application.job?.role ?? "Role"} · {application.job?.company ?? "Company"} · {application.job?.location ?? "Location open"}</p>
                                        <p className="mt-1 text-xs text-slate-500">{application.email}{application.phone ? ` · ${application.phone}` : ""}</p>
                                    </div>
                                    <div className="flex flex-col items-start gap-1 sm:items-end">
                                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">{recruiterStage(application.status)}</span>
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${sharingStatus.tone}`}>{sharingStatus.label}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {application.resume_url ? <a href={application.resume_url} target="_blank" rel="noopener" className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#171B2B] ring-1 ring-emerald-100">Resume</a> : null}
                                    <a href={`mailto:${application.email}`} className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#1A2FAE] ring-1 ring-emerald-100">Email</a>
                                    {getUnlockStatus(application) !== "approved" && (
                                        <>
                                            <ActionButton tone="success" onClick={() => void reviewApplicationSharing(application.id, true)}>Approve profile sharing</ActionButton>
                                            <ActionButton tone="danger" onClick={() => void reviewApplicationSharing(application.id, false)}>Reject sharing</ActionButton>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section id="approval-log" className={adminSectionClass("approval-log", "rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7")}>
                <SectionHeading title="Admin Approval Log" subtitle="Profile unlock and status movement history from application records." />
                <div className="mt-5 space-y-2">
                    {approvalLog.length === 0 ? (
                        <EmptyState title="No approval log yet" message="Unlock reviews and application movements will appear here." />
                    ) : approvalLog.slice(0, 20).map((entry) => (
                        <div key={`${entry.application.id}-${entry.createdAt}-${entry.action}`} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{entry.action.replace(/_/g, " ")} · {entry.application.full_name}</p>
                                    <p className="mt-1 text-xs text-slate-500">{entry.note}</p>
                                </div>
                                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">{new Date(entry.createdAt).toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="data-health" className={adminSectionClass("data-health", "rounded-[2rem] border border-rose-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(244,63,94,0.2)] sm:p-7")}>
                <SectionHeading title="Data Health Monitor" subtitle="Find missing resumes, broken job links, and incomplete candidate details quickly." />
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <SummaryCard label="Missing resume" value={String(dataHealth.missingResume)} icon={<FileClock className="h-4 w-4" />} />
                    <SummaryCard label="Missing phone" value={String(dataHealth.missingPhone)} icon={<Phone className="h-4 w-4" />} />
                    <SummaryCard label="Missing job link" value={String(dataHealth.missingJob)} icon={<Briefcase className="h-4 w-4" />} />
                    <SummaryCard label="Pending unlock" value={String(dataHealth.pendingUnlock)} icon={<LockKeyhole className="h-4 w-4" />} />
                </div>
                <div className="mt-5 space-y-2">
                    {dataHealth.issues.length === 0 ? (
                        <EmptyState title="No data issues" message="Application data looks healthy right now." />
                    ) : dataHealth.issues.slice(0, 12).map((issue) => (
                        <div key={`${issue.application.id}-${issue.label}`} className="rounded-2xl border border-rose-100 bg-rose-50/40 px-3 py-3">
                            <p className="text-sm font-bold text-slate-900">{issue.application.full_name}</p>
                            <p className="mt-1 text-xs font-semibold text-rose-700">{issue.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="resume-intelligence" className={adminSectionClass("resume-intelligence", "rounded-[2rem] border border-blue-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(37,99,235,0.2)] sm:p-7")}>
                <SectionHeading
                    title="Resume Intelligence"
                    subtitle="Storage count, upload log, duplicate candidates, failed upload alerts, and quality scores."
                    action={(
                        <button
                            type="button"
                            onClick={() => void refreshStorageInsights()}
                            disabled={storageInsightRefreshing}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100 disabled:cursor-wait disabled:opacity-70"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${storageInsightRefreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    )}
                />
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                    <SummaryCard label="Storage Count" value={String(resumeStorageCount)} icon={<FileClock className="h-4 w-4" />} />
                    <SummaryCard label="Unique Resumes" value={String(resumeUniqueCount)} icon={<FileClock className="h-4 w-4" />} />
                    <SummaryCard label="Today's Resumes" value={String(todaysResumeUploadLog.length)} icon={<CalendarDays className="h-4 w-4" />} />
                    <SummaryCard label="Upload Logs" value={String(combinedResumeUploadLog.length)} icon={<FileClock className="h-4 w-4" />} />
                    <SummaryCard label="Failed Alerts" value={String(resumeInsights.failedAlerts.length)} icon={<X className="h-4 w-4" />} />
                    <SummaryCard label="Duplicates" value={String(duplicateGroups.length)} icon={<Users className="h-4 w-4" />} />
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                    {storageInsight
                        ? `Supabase bucket ${storageInsight.bucket} checked ${new Date(storageInsight.checkedAt).toLocaleString("en-IN")}.`
                        : storageInsightError
                            ? `Storage count fallback: ${storageInsightError}`
                            : "Checking Supabase Storage count..."}
                </p>

                <div className="mt-5 rounded-3xl border border-indigo-100 bg-indigo-50/40 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-black text-slate-900">Today's Resume Uploads</h3>
                            <p className="mt-1 text-xs font-semibold text-slate-500">Resumes uploaded today from applications, homepage, ATS, templates, and admin WhatsApp upload.</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">{todaysResumeUploadLog.length} today</span>
                    </div>
                    <div className="mt-3 grid gap-2 lg:grid-cols-2">
                        {todaysResumeUploadLog.length === 0 ? (
                            <EmptyState title="No resumes today" message="Today's uploads will appear here as soon as a resume reaches Supabase or the application log." />
                        ) : todaysResumeUploadLog.slice(0, 6).map((entry) => (
                            <div key={`today-${entry.id}`} className="rounded-2xl bg-white p-3 ring-1 ring-indigo-100">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{entry.candidateName}</p>
                                        <p className="mt-1 text-xs text-slate-500">{entry.role} · {entry.company}</p>
                                        <p className="mt-1 break-all text-xs font-black text-indigo-700">{entry.fileName}</p>
                                    </div>
                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
                                        {new Date(entry.uploadedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 rounded-3xl border border-sky-100 bg-sky-50/50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-black text-slate-900">Upload WhatsApp Resume</h3>
                            <p className="mt-1 text-xs font-semibold text-slate-500">Save resumes received on WhatsApp directly into Supabase and the admin upload log.</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-sky-700 ring-1 ring-sky-100">Admin upload</span>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-4">
                        <label className="text-xs font-black uppercase tracking-wide text-slate-500 lg:col-span-2">
                            Resume file
                            <input
                                id="admin-whatsapp-resume-file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(event) => void handleAdminResumeFile(event.target.files?.[0] ?? null)}
                                className="mt-1 w-full rounded-2xl border border-sky-100 bg-white px-3 py-2 text-xs font-semibold normal-case tracking-normal text-slate-700 file:mr-3 file:rounded-full file:border-0 file:bg-sky-50 file:px-3 file:py-1 file:text-xs file:font-black file:text-sky-700"
                            />
                        </label>
                        <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                            Candidate name
                            <input
                                value={adminResumeUpload.fullName}
                                onChange={(event) => setAdminResumeUpload((prev) => ({ ...prev, fullName: event.target.value }))}
                                placeholder="Prince Kumar"
                                className="mt-1 w-full rounded-2xl border border-sky-100 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-sky-300"
                            />
                        </label>
                        <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                            WhatsApp / phone
                            <input
                                value={adminResumeUpload.phone}
                                onChange={(event) => setAdminResumeUpload((prev) => ({ ...prev, phone: event.target.value }))}
                                placeholder="98XXXXXXXX"
                                className="mt-1 w-full rounded-2xl border border-sky-100 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-sky-300"
                            />
                        </label>
                        <label className="text-xs font-black uppercase tracking-wide text-slate-500 lg:col-span-2">
                            Email optional
                            <input
                                value={adminResumeUpload.email}
                                onChange={(event) => setAdminResumeUpload((prev) => ({ ...prev, email: event.target.value }))}
                                placeholder="candidate@email.com"
                                className="mt-1 w-full rounded-2xl border border-sky-100 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-sky-300"
                            />
                        </label>
                        <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                            City
                            <input
                                value={adminResumeUpload.city}
                                onChange={(event) => setAdminResumeUpload((prev) => ({ ...prev, city: event.target.value }))}
                                placeholder="Gurgaon"
                                className="mt-1 w-full rounded-2xl border border-sky-100 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-sky-300"
                            />
                        </label>
                        <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                            Total experience
                            <input
                                value={adminResumeUpload.totalExperience}
                                onChange={(event) => setAdminResumeUpload((prev) => ({ ...prev, totalExperience: event.target.value }))}
                                placeholder="2 years"
                                className="mt-1 w-full rounded-2xl border border-sky-100 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-sky-300"
                            />
                        </label>
                        <label className="text-xs font-black uppercase tracking-wide text-slate-500 lg:col-span-2">
                            Latest role
                            <input
                                value={adminResumeUpload.lastRole}
                                onChange={(event) => setAdminResumeUpload((prev) => ({ ...prev, lastRole: event.target.value }))}
                                placeholder="HR recruiter"
                                className="mt-1 w-full rounded-2xl border border-sky-100 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-sky-300"
                            />
                        </label>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold text-slate-500">
                                {adminResumeParsing
                                    ? "Reading resume and filling details..."
                                    : adminResumeFile
                                        ? `${adminResumeFile.name} selected`
                                        : "PDF, DOC, and DOCX files up to 5 MB are supported."}
                            </p>
                            {adminResumeParseMessage ? (
                                <p className="mt-1 text-xs font-semibold text-sky-700">{adminResumeParseMessage}</p>
                            ) : null}
                            {adminResumeParsed?.skills?.length ? (
                                <p className="mt-1 text-[11px] font-semibold text-slate-500">
                                    Skills detected: {adminResumeParsed.skills.slice(0, 6).join(", ")}
                                </p>
                            ) : null}
                        </div>
                        <button
                            type="button"
                            onClick={() => void uploadAdminResume()}
                            disabled={adminResumeUploading || adminResumeParsing}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Upload className="h-4 w-4" />
                            {adminResumeUploading ? "Uploading..." : adminResumeParsing ? "Reading..." : "Upload resume"}
                        </button>
                    </div>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-2">
                    <div className="rounded-3xl border border-blue-100 bg-blue-50/40 p-4">
                        <h3 className="text-sm font-black text-slate-900">Resume Upload Log</h3>
                        <div className="mt-3 space-y-2">
                            {combinedResumeUploadLog.length === 0 ? (
                                <EmptyState title="No resume uploads yet" message="Uploaded resumes from applications, homepage, ATS, and templates will appear here." />
                            ) : combinedResumeUploadLog.slice(0, 12).map((entry) => (
                                <div key={entry.id} className="rounded-2xl bg-white p-3 ring-1 ring-blue-100">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{entry.candidateName}</p>
                                            <p className="mt-1 text-xs text-slate-500">{entry.role} · {entry.company}</p>
                                            {(entry.city || entry.experience || entry.lastRole) ? (
                                                <p className="mt-1 text-[11px] font-semibold text-slate-500">
                                                    {[entry.lastRole, entry.experience, entry.city].filter(Boolean).join(" · ")}
                                                </p>
                                            ) : null}
                                            {entry.downloadUrl ? (
                                                <a
                                                    href={entry.downloadUrl}
                                                    download={entry.fileName}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 inline-flex items-center gap-1.5 break-all text-xs font-black text-blue-700 underline-offset-2 hover:underline"
                                                >
                                                    <Download className="h-3.5 w-3.5 shrink-0" />
                                                    {entry.fileName}
                                                </a>
                                            ) : (
                                                <p className="mt-1 text-xs font-semibold text-blue-700">{entry.fileName}</p>
                                            )}
                                            {"path" in entry && entry.path ? <p className="mt-1 break-all text-[11px] font-semibold text-slate-400">{entry.path}</p> : null}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {entry.downloadUrl ? (
                                                <a
                                                    href={entry.downloadUrl}
                                                    download={entry.fileName}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    Download
                                                </a>
                                            ) : null}
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">{entry.status}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-[11px] font-semibold text-slate-500">{new Date(entry.uploadedAt).toLocaleString("en-IN")}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-4">
                        <h3 className="text-sm font-black text-slate-900">Failed Upload Alerts</h3>
                        <div className="mt-3 space-y-2">
                            {resumeInsights.failedAlerts.length === 0 ? (
                                <EmptyState title="No failed resume alerts" message="Every submitted application has a stored resume reference." />
                            ) : resumeInsights.failedAlerts.slice(0, 8).map((alert) => (
                                <div key={alert.application.id} className="rounded-2xl bg-white p-3 ring-1 ring-rose-100">
                                    <p className="text-sm font-bold text-slate-900">{alert.application.full_name}</p>
                                    <p className="mt-1 text-xs text-slate-500">{alert.application.job?.role ?? "Role"} · {alert.application.email}</p>
                                    <p className="mt-1 text-xs font-semibold text-rose-700">{alert.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-amber-100 bg-amber-50/40 p-4">
                        <h3 className="text-sm font-black text-slate-900">Duplicate Candidate Detection</h3>
                        <div className="mt-3 space-y-2">
                            {duplicateGroups.length === 0 ? (
                                <EmptyState title="No duplicates found" message="Candidates look unique by email and phone." />
                            ) : duplicateGroups.slice(0, 8).map((group) => (
                                <div key={group.key} className="rounded-2xl bg-white p-3 ring-1 ring-amber-100">
                                    <p className="text-sm font-bold text-slate-900">{group.label}</p>
                                    <p className="mt-1 text-xs font-semibold text-amber-700">{group.items.length} applications found</p>
                                    <p className="mt-1 text-xs text-slate-500">{group.items.map((item) => item.full_name).join(", ")}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4">
                        <h3 className="text-sm font-black text-slate-900">Candidate Quality Score</h3>
                        <div className="mt-3 space-y-2">
                            {qualityRankings.length === 0 ? (
                                <EmptyState title="No candidates scored yet" message="Scores will appear once applications are submitted." />
                            ) : qualityRankings.slice(0, 8).map(({ application, score }) => (
                                <div key={application.id} className="rounded-2xl bg-white p-3 ring-1 ring-emerald-100">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{application.full_name}</p>
                                            <p className="mt-1 text-xs text-slate-500">{application.job?.role ?? "Role"} · {extractCity(application as RecruiterApplicationView)}</p>
                                        </div>
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">{score}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="lead-assignment" className={adminSectionClass("lead-assignment", "rounded-[2rem] border border-cyan-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(6,182,212,0.2)] sm:p-7")}>
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

            <section id="delete-requests" className={adminSectionClass("delete-requests", "rounded-[2rem] border border-rose-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(244,63,94,0.22)] sm:p-7")}>
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

            <section id="blog-approval" className={adminSectionClass("blog-approval", "rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(99,102,241,0.2)] sm:p-7")}>
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

            <section id="all-jobs" className={adminSectionClass("all-jobs", "rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7")}>
                <SectionHeading title="All Jobs" subtitle="Full published and pending inventory." />
                <div className="mt-5 space-y-3">
                    <CareerSyncJobsSection />
                </div>
            </section>

            <section id="users" className={adminSectionClass("users", "rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7")}>
                <SectionHeading title="Users" subtitle="All demo accounts in one place." />
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <UserSummaryCard
                        label="All users"
                        users={snapshot.users}
                        icon={<Users className="h-4 w-4" />}
                        open={activeUserSummary === "all"}
                        onToggle={() => setActiveUserSummary((current) => current === "all" ? null : "all")}
                    />
                    <UserSummaryCard
                        label="HR accounts"
                        users={hrUsers}
                        icon={<Building2 className="h-4 w-4" />}
                        open={activeUserSummary === "hr"}
                        onToggle={() => setActiveUserSummary((current) => current === "hr" ? null : "hr")}
                    />
                    <UserSummaryCard
                        label="Candidates"
                        users={candidateUsers}
                        icon={<UserRound className="h-4 w-4" />}
                        open={activeUserSummary === "candidate"}
                        onToggle={() => setActiveUserSummary((current) => current === "candidate" ? null : "candidate")}
                    />
                    <UserSummaryCard
                        label="Employees"
                        users={employeeUsers}
                        icon={<Users className="h-4 w-4" />}
                        open={activeUserSummary === "employee"}
                        onToggle={() => setActiveUserSummary((current) => current === "employee" ? null : "employee")}
                    />
                </div>
            </section>

            <section id="user-management" className={adminSectionClass("user-management", "rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(16,185,129,0.2)] sm:p-7")}>
                <SectionHeading title="User Management" subtitle="Role distribution and moderation-ready account overview." />
                <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard label="Admins" value={String(snapshot.users.filter((item) => item.role === "admin").length)} icon={<ShieldCheck className="h-4 w-4" />} />
                    <SummaryCard label="HR" value={String(snapshot.users.filter((item) => item.role === "company").length)} icon={<Building2 className="h-4 w-4" />} />
                    <SummaryCard label="Employees" value={String(snapshot.users.filter((item) => item.role === "employee").length)} icon={<Users className="h-4 w-4" />} />
                    <SummaryCard label="Candidates" value={String(snapshot.users.filter((item) => item.role === "candidate").length)} icon={<UserRound className="h-4 w-4" />} />
                </div>
            </section>

            <section id="hr-management" className={adminSectionClass("hr-management", "rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7")}>
                <SectionHeading title="HR Management" subtitle="Monitor recruiter submissions and approvals." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {hrUsers.map((user) => (
                        <UserRow key={user.id} name={user.full_name} meta={user.company_name ?? user.email} badge="HR" />
                    ))}
                </div>
            </section>

            <section id="candidates" className={adminSectionClass("candidates", "rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7")}>
                <SectionHeading title="Candidates" subtitle="Candidate demo accounts and activity." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {candidateUsers.map((user) => (
                        <UserRow key={user.id} name={user.full_name} meta={user.email} badge="Candidate" />
                    ))}
                </div>
            </section>

            <section id="notifications" className={adminSectionClass("notifications", "rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7")}>
                <SectionHeading title="Notifications" subtitle="Admin-only notifications remain isolated here." />
                <NotificationList notifications={adminNotifications} emptyLabel="No admin notifications yet." />
            </section>

            <section id="activity" className={adminSectionClass("activity", "rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7")}>
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

            <section id="settings" className={adminSectionClass("settings", "rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7")}>
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

function notifyAdminReviewRequest(input: {
    title: string;
    message: string;
    actor?: string;
    entity?: string;
    href?: string;
}) {
    sendAdminApprovalAlert(input);
}

type CompanyWorkspaceTab = "overview" | "jobs" | "pipeline" | "candidates" | "analytics" | "notifications" | "profile";
type RecruiterApplicationView = DemoApplicationRecord & {
    fit: number;
    job?: DemoJobRecord;
};
type CandidateProfileDetails = {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    city: string;
    experience: string;
    currentlyWorking: string;
    currentCompany: string;
    workingSince: string;
    previousCompany: string;
    noticePeriod: string;
    preferredCities: string;
    languages: string;
    skills: string;
    currentSalary: string;
    expectedSalary: string;
    preferredRole: string;
    workMode: string;
    summary: string;
    resumeName: string;
    resumeUrl: string;
    resumePath: string;
    resumeUpdatedAt: string;
};
type ResumeStorageInsight = {
    bucket: string;
    storageCount: number;
    samplePaths: string[];
    storageFiles?: Array<{
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
    }>;
    checkedAt: string;
};
type ResumeStorageFileInsight = NonNullable<ResumeStorageInsight["storageFiles"]>[number];
type RecruiterDatabaseProfile = {
    id: string;
    candidateName: string;
    fileName: string;
    path: string;
    role: string;
    city: string;
    experience: string;
    source: string;
    fit: number;
    matchedJob: DemoJobRecord | null;
    uploadedAt: string;
};

const RECRUITER_PIPELINE_STAGES = ["Applied", "Screening", "Shortlisted", "Interview", "Selected", "Offered", "Joined"] as const;
const RECRUITER_CLOSED_STAGES = ["Rejected", "Withdrawn", "No-show", "Offer Declined", "Not Joined"] as const;
const RECRUITER_STAGE_FILTERS = ["all", ...RECRUITER_PIPELINE_STAGES, ...RECRUITER_CLOSED_STAGES];
const REJECTION_REASONS = [
    "Experience mismatch",
    "Salary mismatch",
    "Location mismatch",
    "Skills mismatch",
    "Communication",
    "Candidate unavailable",
    "Duplicate",
    "Not interested",
    "Other",
];
const SALARY_FILTERS = ["all", "Salary shared", "Salary missing", "Within budget", "Above budget"];
const AVAILABILITY_FILTERS = ["all", "Immediate", "15 days", "30 days", "60+ days", "Unknown"];

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

function getCompanyInitials(name: string) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return (words[0] || "CS").slice(0, 2).toUpperCase();
}

function CompanyWorkspace({ userId, email, snapshot }: { userId: string; email: string; snapshot: ReturnType<typeof useDemoSnapshot> }) {
    const myJobs = snapshot.jobs.filter((job) => job.posted_by === userId);
    const myNotifications = getDemoNotificationsForUser(userId);
    const myApplications = snapshot.applications.filter((application) => myJobs.some((job) => job.id === application.job_id));
    const companyAnalytics = getCareerSyncCompanyAnalytics(userId);
    const [activeTab, setActiveTab] = useState<CompanyWorkspaceTab>(() => {
        if (typeof window === "undefined") return "overview";
        return getCompanyWorkspaceTab(window.location.hash);
    });
    const [selectedRoleId, setSelectedRoleId] = useState<string | "all">("all");
    const [stageFilter, setStageFilter] = useState<string>("all");
    const [unlockFilter, setUnlockFilter] = useState<string>("all");
    const [minFitFilter, setMinFitFilter] = useState<string>("all");
    const [cityFilter, setCityFilter] = useState("");
    const [salaryFilter, setSalaryFilter] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");
    const [databaseExperienceFilter, setDatabaseExperienceFilter] = useState("all");
    const [databaseSourceFilter, setDatabaseSourceFilter] = useState("all");
    const [candidateQuery, setCandidateQuery] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState<RecruiterApplicationView | null>(null);
    const [fitBreakdownCandidate, setFitBreakdownCandidate] = useState<RecruiterApplicationView | null>(null);
    const [rejectingCandidate, setRejectingCandidate] = useState<RecruiterApplicationView | null>(null);
    const [selectedRejectReason, setSelectedRejectReason] = useState("");
    const [addingDatabaseProfile, setAddingDatabaseProfile] = useState<RecruiterDatabaseProfile | null>(null);
    const [addToJobId, setAddToJobId] = useState("");
    const [databaseResumeInsight, setDatabaseResumeInsight] = useState<ResumeStorageInsight | null>(null);
    const [databaseResumeError, setDatabaseResumeError] = useState("");
    const [databaseUnlockingPath, setDatabaseUnlockingPath] = useState("");
    const [unlockRequests, setUnlockRequests] = useState<Set<string>>(() => {
        if (typeof window === "undefined") return new Set();
        try {
            const saved = JSON.parse(window.localStorage.getItem("careersync_profile_unlock_requests") ?? "[]") as unknown;
            return new Set(Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : []);
        } catch {
            return new Set();
        }
    });
    const companyName = myJobs[0]?.company || snapshot.users.find((user) => user.id === userId)?.company_name || getDemoDisplayName(userId);
    const companyInitials = getCompanyInitials(companyName);

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

    const selectedJobIds = useMemo(() => selectedRoleId === "all" ? new Set(myJobs.map((job) => job.id)) : new Set([selectedRoleId]), [myJobs, selectedRoleId]);
    const selectedJobs = useMemo(() => selectedRoleId === "all" ? myJobs : myJobs.filter((job) => job.id === selectedRoleId), [myJobs, selectedRoleId]);
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
                    extractCity(application),
                    extractCandidateExperience(application),
                    ...(application.job?.tags ?? []),
                    ...(application.job?.required_skills ?? []),
                ].join(" ").toLowerCase().includes(query);
            })
            .filter((application) => stageFilter === "all" || recruiterStage(application.status) === stageFilter)
            .filter((application) => {
                if (unlockFilter === "all") return true;
                const locked = !isProfileSharingApproved(application);
                if (unlockFilter === "locked") return locked;
                if (unlockFilter === "unlocked") return !locked;
                return getUnlockStatus(application) === unlockFilter;
            })
            .filter((application) => minFitFilter === "all" || application.fit >= Number(minFitFilter))
            .filter((application) => !cityFilter.trim() || extractCity(application).toLowerCase().includes(cityFilter.trim().toLowerCase()))
            .filter((application) => isApplicationSalaryMatch(application, salaryFilter))
            .filter((application) => isApplicationAvailabilityMatch(application, availabilityFilter))
            .sort((a, b) => b.fit - a.fit || (a.created_at < b.created_at ? 1 : -1));
    }, [availabilityFilter, candidateQuery, cityFilter, minFitFilter, myApplications, myJobs, salaryFilter, selectedJobIds, stageFilter, unlockFilter]);
    const databaseRecommendedProfiles = useMemo(() => getRecruiterDatabaseProfiles({
        storageInsight: databaseResumeInsight,
        jobs: selectedJobs.length ? selectedJobs : myJobs,
        existingApplications: myApplications,
        query: candidateQuery,
        cityFilter,
        experienceFilter: databaseExperienceFilter,
        sourceFilter: databaseSourceFilter,
        minFitFilter,
        salaryFilter,
        availabilityFilter,
    }), [availabilityFilter, candidateQuery, cityFilter, databaseExperienceFilter, databaseResumeInsight, databaseSourceFilter, minFitFilter, myApplications, myJobs, salaryFilter, selectedJobs]);
    const databaseSourceOptions = useMemo(() => {
        const labels = new Set((databaseResumeInsight?.storageFiles ?? []).map((file) => getResumeSourceLabel(file.folder, file.source)));
        return ["all", ...[...labels].sort((a, b) => a.localeCompare(b))];
    }, [databaseResumeInsight]);

    const openRoles = myJobs.filter((job) => job.is_active && job.status !== "rejected").length;
    const avgFit = filteredApplications.length ? Math.round(filteredApplications.reduce((sum, application) => sum + application.fit, 0) / filteredApplications.length) : 0;
    const atRiskCount = filteredApplications.filter((application) => application.fit < 62 || application.status === "submitted").length;
    const needsReviewCount = filteredApplications.filter((application) => recruiterStage(application.status) === "Applied").length;
    const strongMatchCount = filteredApplications.filter((application) => application.fit >= 80).length + databaseRecommendedProfiles.filter((profile) => profile.fit >= 80).length;
    const interviewsTodayCount = filteredApplications.filter((application) => recruiterStage(application.status) === "Interview").length;
    const offersAwaitingDecisionCount = filteredApplications.filter((application) => recruiterStage(application.status) === "Offered").length;
    const stageCounts = filteredApplications.reduce<Record<string, number>>((acc, application) => {
        const stage = recruiterStage(application.status);
        acc[stage] = (acc[stage] ?? 0) + 1;
        return acc;
    }, {});

    const updateApplicationStage = async (applicationId: string, status: string) => {
        const current = myApplications.find((application) => application.id === applicationId);
        if (current && !isProfileSharingApproved(current) && status !== "rejected") {
            toast.warning("Admin approval required before HR can move or contact this candidate.");
            return;
        }
        try {
            const application = await updateSharedCareerSyncApplicationStatus({ applicationId, status });
            if (application) mergeSharedCareerSyncApplications([application]);
            updateDemoApplicationStatus(applicationId, status);
            toast.success("Application status updated.");
        } catch (error) {
            updateDemoApplicationStatus(applicationId, status);
            toast.warning(error instanceof Error ? error.message : "Saved locally. Shared status sync failed.");
        }
    };

    const requestProfileUnlock = async (application: RecruiterApplicationView) => {
        const note = `${companyName} requested candidate profile unlock for ${application.full_name} (${application.job?.role ?? "applied role"}).`;
        const next = new Set(unlockRequests);
        next.add(application.id);
        setUnlockRequests(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("careersync_profile_unlock_requests", JSON.stringify([...next]));
        }
        try {
            const sharedApplication = await requestSharedCareerSyncProfileUnlock({
                applicationId: application.id,
                requestedBy: companyName,
                note,
            });
            if (sharedApplication) {
                mergeSharedCareerSyncApplications([sharedApplication]);
            } else {
                requestDemoApplicationProfileUnlock(application.id, companyName, note);
            }
            notifyAdminReviewRequest({
                title: "Profile unlock requested",
                message: note,
                actor: companyName,
                entity: application.full_name,
                href: "/careersync?workspace=1#approval-inbox",
            });
            toast.success("Profile unblock request sent to CareerSync admin.");
        } catch (error) {
            requestDemoApplicationProfileUnlock(application.id, companyName, note);
            notifyAdminReviewRequest({
                title: "Profile unlock requested",
                message: note,
                actor: companyName,
                entity: application.full_name,
                href: "/careersync?workspace=1#approval-inbox",
            });
            toast.warning(error instanceof Error ? error.message : "Saved locally. Shared unlock sync failed.");
        }
    };

    const requestDatabaseProfileUnlock = async (profile: RecruiterDatabaseProfile) => {
        if (!profile.matchedJob?.id) {
            toast.error("Select a job before requesting this profile.");
            return;
        }
        setDatabaseUnlockingPath(profile.path);
        try {
            const application = await requestSharedCareerSyncDatabaseProfileUnlock({
                resumePath: profile.path,
                jobId: profile.matchedJob.id,
                requestedBy: companyName,
                requesterUserId: userId,
                requesterEmail: email,
                note: `${companyName} requested database profile unlock for ${profile.candidateName} against ${profile.matchedJob.role}.`,
            });
            if (application) mergeSharedCareerSyncApplications([application]);
            notifyAdminReviewRequest({
                title: "Database profile unlock requested",
                message: `${companyName} requested ${profile.candidateName} from resume database for ${profile.matchedJob.role}.`,
                actor: companyName,
                entity: profile.candidateName,
                href: "/careersync?workspace=1#approval-inbox",
            });
            toast.success("Database profile unlock request sent to admin.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not request database profile unlock.");
        } finally {
            setDatabaseUnlockingPath("");
        }
    };

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

    useEffect(() => {
        let cancelled = false;
        void fetchSharedCareerSyncResumeInsights({ role: "company", userId })
            .then((insight) => {
                if (cancelled) return;
                setDatabaseResumeInsight(insight);
                setDatabaseResumeError("");
            })
            .catch((error) => {
                if (cancelled) return;
                setDatabaseResumeInsight(null);
                setDatabaseResumeError(error instanceof Error ? error.message : "Could not load database profiles.");
            });
        return () => {
            cancelled = true;
        };
    }, [userId]);

    return (
        <div className="min-h-screen rounded-[1.25rem] bg-[#F6F5F1] p-3 text-[#171B2B] sm:p-5">
            <div className="mx-auto max-w-[1240px] space-y-5">
                <section className="rounded-2xl bg-[#0F1424] p-5 text-white shadow-[0_22px_60px_-36px_rgba(15,20,36,0.65)] sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#3D5AFE] to-[#2438C4] font-black">
                                {companyInitials}
                            </div>
                            <div>
                                <h1 className="font-display text-xl font-black tracking-tight">{companyName} — Company Dashboard</h1>
                                <p className="mt-0.5 text-xs font-semibold text-[#B7BEDA]">Recruiter workspace for {companyName} jobs, applicants, and notifications.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#171E33] px-3 py-2 text-xs font-semibold text-[#C9D0EE] ring-1 ring-[#2A3350]">
                                <span className="h-2 w-2 rounded-full bg-[#2FBF71] shadow-[0_0_0_4px_rgba(47,191,113,0.18)]" />
                                Live sync active
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#171E33] px-3 py-2 text-sm font-bold ring-1 ring-[#2A3350]">
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#F5A623] text-[11px] text-[#4A2F00]">{companyInitials}</span>
                                {companyName}
                            </span>
                            <NotificationBell />
                            <button type="button" onClick={() => void signOut()} className="rounded-full bg-[#171E33] px-3 py-2 text-xs font-black text-[#C9D0EE] ring-1 ring-[#2A3350] transition hover:bg-[#222B46]">Sign Out</button>
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-between rounded-2xl border border-[#E4E2DA] bg-white px-4 py-3 lg:hidden">
                    <span className="font-display text-lg font-black text-[#171B2B]">{companyName}</span>
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <button type="button" onClick={() => setActiveTab("profile")} className="rounded-full bg-[#F6F5F1] px-3 py-2 text-xs font-black text-[#171B2B] ring-1 ring-[#E4E2DA]">Profile</button>
                    </div>
                </div>

                <nav className="flex gap-1 overflow-x-auto border-b border-[#E4E2DA]">
                    {tabs.map(([id, label]) => (
                        <div key={id} className="flex shrink-0">
                            <button
                                type="button"
                                onClick={() => setActiveTab(id)}
                                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition ${activeTab === id ? "border-[#3D5AFE] text-[#171B2B]" : "border-transparent text-[#5B6172] hover:text-[#171B2B]"}`}
                            >
                                {label}
                            </button>
                            {id === "overview" && (
                                <Link
                                    to="/post-job"
                                    className="shrink-0 border-b-2 border-transparent px-4 py-3 text-sm font-bold text-[#5B6172] transition hover:text-[#171B2B]"
                                >
                                    Post a Job
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                    <RecruiterKpi label="Open roles" value={String(openRoles)} helper={`${companyAnalytics.totals.pendingJobs} pending approval`} tone="blue" />
                    <RecruiterKpi label="Total applicants" value={String(myApplications.length)} helper="from current workspace data" tone="amber" />
                    <RecruiterKpi label="Avg fit score" value={`${avgFit}%`} helper={avgFit >= 70 ? "healthy candidate pool" : "needs more strong fits"} tone="green" />
                    <RecruiterKpi label="with Low Match" value={String(atRiskCount)} helper="new or low-fit profiles" tone="red" />
                    <RecruiterKpi label="Unread alerts" value={String(myNotifications.filter((item) => !item.read_at).length)} helper="recruiter notifications" tone="slate" />
                </div>

                {activeTab === "overview" && (
                    <div className="space-y-5">
                        <RecruiterPanel
                            title="Good Morning 👋"
                            caption="Start with the decisions that move hiring today."
                            action={<ActionButton tone="success" onClick={() => setActiveTab("candidates")}>Review Candidates</ActionButton>}
                        >
                            <div className="grid gap-3 md:grid-cols-4">
                                <RecruiterActionMetric label="candidates need review" value={String(needsReviewCount)} />
                                <RecruiterActionMetric label="strong matches found" value={String(strongMatchCount)} />
                                <RecruiterActionMetric label="interview today" value={String(interviewsTodayCount)} />
                                <RecruiterActionMetric label="offers awaiting decision" value={String(offersAwaitingDecisionCount)} />
                            </div>
                            <div className="mt-4 rounded-2xl bg-[#F6F5F1] p-4 ring-1 ring-[#E4E2DA]">
                                <h3 className="text-sm font-black text-[#171B2B]">Hiring Overview</h3>
                                <p className="mt-2 text-sm font-bold text-[#5B6172]">
                                    {openRoles} Active Job | {myApplications.length} Applicants | {stageCounts.Interview ?? 0} Interviews | {stageCounts.Joined ?? 0} Joinings
                                </p>
                            </div>
                        </RecruiterPanel>
                        <div className="grid gap-3 lg:grid-cols-3">
                            <RecruiterInsight tone="red" title="Needs attention" text={`${filteredApplications.filter((application) => application.status === "submitted").length} new applicants are waiting for first review.`} />
                            <RecruiterInsight
                                tone={strongMatchCount > 0 ? "green" : "blue"}
                                title="Pipeline signal"
                                text={strongMatchCount > 0
                                    ? `🔥 ${strongMatchCount} Strong Matches Found. Candidates have 80%+ fit for the selected role. Review Matches.`
                                    : "No strong matches yet. Complete your job requirements to improve matching. Improve Job Details."}
                            />
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
                                        <RecruiterCandidateCard
                                            key={application.id}
                                            application={application}
                                            compact
                                            unlockRequested={unlockRequests.has(application.id) || getUnlockStatus(application) === "requested"}
                                            onRequestUnlock={requestProfileUnlock}
                                            onOpen={setSelectedCandidate}
                                            onFitBreakdown={setFitBreakdownCandidate}
                                            onReject={(candidate) => {
                                                setRejectingCandidate(candidate);
                                                setSelectedRejectReason("");
                                            }}
                                        />
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
                        <div className="mt-4 space-y-3">
                            {[...RECRUITER_PIPELINE_STAGES, ...RECRUITER_CLOSED_STAGES].map((stage) => {
                                const stageItems = filteredApplications.filter((application) => recruiterStage(application.status) === stage);
                                return (
                                    <div key={stage} className="rounded-2xl border border-[#E4E2DA] bg-[#F6F5F1] p-3">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-wide text-[#5B6172]">{stage}</h3>
                                            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-[#5B6172] ring-1 ring-[#E4E2DA]">{stageItems.length}</span>
                                        </div>
                                        <div className="grid gap-2">
                                            {stageItems.map((application) => {
                                                const locked = !isProfileSharingApproved(application);
                                                const city = extractCity(application);
                                                const experience = extractCandidateExperience(application);
                                                return (
                                                    <div key={application.id} className="rounded-2xl border border-[#E4E2DA] bg-white p-3 shadow-sm">
                                                        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.05fr)_minmax(260px,1fr)_auto] lg:items-center">
                                                            <div className="flex min-w-0 items-center gap-3">
                                                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#DCE1FF] font-display text-sm font-black text-[#1A2FAE]">
                                                                    {getCompanyInitials(application.full_name)}
                                                                </span>
                                                                <div className="min-w-0">
                                                                    <p className="truncate text-base font-black text-[#171B2B]">{application.full_name}</p>
                                                                    <p className="mt-0.5 truncate text-xs font-semibold text-[#5B6172]">{application.job?.role ?? "Role"}</p>
                                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                                        <span className="rounded-full bg-[#F6F5F1] px-2 py-1 text-[11px] font-bold text-[#5B6172] ring-1 ring-[#E4E2DA]">{city}</span>
                                                                        <span className="rounded-full bg-[#F6F5F1] px-2 py-1 text-[11px] font-bold text-[#5B6172] ring-1 ring-[#E4E2DA]">{experience}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFitBreakdownCandidate(application)}
                                                                    className="rounded-full bg-[#DCE1FF] px-3 py-1.5 text-xs font-black text-[#1A2FAE]"
                                                                >
                                                                    {application.fit}% Match
                                                                </button>
                                                                {locked ? (
                                                                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF7E7] px-3 py-2 text-xs font-bold text-[#8A5A00]">
                                                                        <LockKeyhole className="h-3.5 w-3.5" />
                                                                        Resume/contact locked until admin approves profile sharing.
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DBF3E5] px-3 py-2 text-xs font-bold text-[#1C7A48]">
                                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                                        Profile unlocked
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5 lg:justify-end">
                                                                <ActionButton tone="neutral" onClick={() => setSelectedCandidate(application)}>Details</ActionButton>
                                                                <ActionButton tone="neutral" disabled={locked} onClick={() => void updateApplicationStage(application.id, "screening")}>Screen</ActionButton>
                                                                <ActionButton tone="success" disabled={locked} onClick={() => void updateApplicationStage(application.id, "shortlisted")}>Shortlist</ActionButton>
                                                                <ActionButton tone="success" disabled={locked} onClick={() => void updateApplicationStage(application.id, "interview")}>Interview</ActionButton>
                                                                <ActionButton tone="danger" onClick={() => {
                                                                    setRejectingCandidate(application);
                                                                    setSelectedRejectReason("");
                                                                }}>Reject</ActionButton>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {stageItems.length === 0 && (
                                                <div className="rounded-2xl border border-dashed border-[#D9D6CA] bg-white/60 px-4 py-3 text-xs font-bold text-[#8A8F9E]">
                                                    No candidates in this stage.
                                                </div>
                                            )}
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
                    <div className="space-y-5">
                        <RecruiterPanel title="Recommended profiles from database" caption={`${databaseRecommendedProfiles.length} of 20 shown from Supabase resume pool`}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <RoleFilter roles={roleOptions} selectedRoleId={selectedRoleId} onSelect={setSelectedRoleId} />
                                <input
                                    value={candidateQuery}
                                    onChange={(event) => setCandidateQuery(event.target.value)}
                                    placeholder="Search by name, skill, or role..."
                                    className="min-h-10 rounded-xl border border-[#E4E2DA] bg-[#F6F5F1] px-3 text-sm font-semibold outline-none transition focus:border-[#3D5AFE] focus:bg-white sm:w-80"
                                />
                            </div>
                            <div className="mt-3 grid gap-2 md:grid-cols-4 lg:grid-cols-8">
                                <RecruiterSelectFilter label="Fit score" value={minFitFilter} onChange={setMinFitFilter} options={["all", "60", "70", "80"]} />
                                <RecruiterSelectFilter label="Experience" value={databaseExperienceFilter} onChange={setDatabaseExperienceFilter} options={["all", "Fresher", "1+ years", "3+ years", "5+ years"]} />
                                <RecruiterSelectFilter label="Salary" value={salaryFilter} onChange={setSalaryFilter} options={SALARY_FILTERS} />
                                <RecruiterSelectFilter label="Availability" value={availabilityFilter} onChange={setAvailabilityFilter} options={AVAILABILITY_FILTERS} />
                                <RecruiterSelectFilter label="Source" value={databaseSourceFilter} onChange={setDatabaseSourceFilter} options={databaseSourceOptions} />
                                <input
                                    value={cityFilter}
                                    onChange={(event) => setCityFilter(event.target.value)}
                                    placeholder="City filter"
                                    className="min-h-10 rounded-xl border border-[#E4E2DA] bg-[#F6F5F1] px-3 text-xs font-bold outline-none transition focus:border-[#3D5AFE] focus:bg-white"
                                />
                            </div>
                            <div className="mt-4 space-y-3">
                                {databaseRecommendedProfiles.map((profile) => (
                                    <RecruiterDatabaseProfileCard
                                        key={profile.id}
                                        profile={profile}
                                        requesting={databaseUnlockingPath === profile.path}
                                        onAddToJob={(nextProfile) => {
                                            setAddingDatabaseProfile(nextProfile);
                                            setAddToJobId(nextProfile.matchedJob?.id ?? myJobs[0]?.id ?? "");
                                        }}
                                        onRequestUnlock={requestDatabaseProfileUnlock}
                                    />
                                ))}
                                {!databaseResumeInsight && !databaseResumeError && <EmptyState title="Loading database profiles" message="Checking Supabase resumes and matching the best profiles to this job." />}
                                {databaseResumeError && <EmptyState title="Could not load database profiles" message={databaseResumeError} />}
                                {databaseResumeInsight && databaseRecommendedProfiles.length === 0 && <EmptyState title="No database matches yet" message="Try clearing filters or select all roles to see more stored resumes." />}
                            </div>
                        </RecruiterPanel>

                        <RecruiterPanel title="People who applied for this job" caption={`${filteredApplications.length} applicants shown`}>
                            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                                <RecruiterSelectFilter label="Stage" value={stageFilter} onChange={setStageFilter} options={RECRUITER_STAGE_FILTERS} />
                                <RecruiterSelectFilter label="Profile" value={unlockFilter} onChange={setUnlockFilter} options={["all", "locked", "requested", "approved", "rejected", "unlocked"]} />
                                <RecruiterSelectFilter label="Salary" value={salaryFilter} onChange={setSalaryFilter} options={SALARY_FILTERS} />
                                <RecruiterSelectFilter label="Availability" value={availabilityFilter} onChange={setAvailabilityFilter} options={AVAILABILITY_FILTERS} />
                            </div>
                            <div className="mt-4 space-y-3">
                                {filteredApplications.map((application) => (
                                    <RecruiterCandidateCard
                                        key={application.id}
                                        application={application}
                                        unlockRequested={unlockRequests.has(application.id) || getUnlockStatus(application) === "requested"}
                                        onStatusChange={updateApplicationStage}
                                        onRequestUnlock={requestProfileUnlock}
                                        onOpen={setSelectedCandidate}
                                        onFitBreakdown={setFitBreakdownCandidate}
                                        onReject={(candidate) => {
                                            setRejectingCandidate(candidate);
                                            setSelectedRejectReason("");
                                        }}
                                    />
                                ))}
                                {filteredApplications.length === 0 && <EmptyState title="No applicants match" message="Actual job applicants will appear here separately from database recommendations." />}
                            </div>
                        </RecruiterPanel>
                    </div>
                )}

                {activeTab === "analytics" && (
                    <div className="grid gap-5 lg:grid-cols-2">
                        <RecruiterPanel title="Applicants by stage" caption="current pipeline">
                            <RecruiterBarList data={[...RECRUITER_PIPELINE_STAGES, ...RECRUITER_CLOSED_STAGES].map((stage) => ({ label: stage, value: stageCounts[stage] ?? 0 }))} />
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
                                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#3D5AFE] font-display text-2xl font-black text-white">{companyInitials}</div>
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
            {selectedCandidate && (
                <CandidateDetailDrawer
                    application={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                    onStatusChange={updateApplicationStage}
                    unlockRequested={unlockRequests.has(selectedCandidate.id) || getUnlockStatus(selectedCandidate) === "requested"}
                    onRequestUnlock={requestProfileUnlock}
                    onFitBreakdown={setFitBreakdownCandidate}
                    onReject={(candidate) => {
                        setRejectingCandidate(candidate);
                        setSelectedRejectReason("");
                    }}
                />
            )}
            {fitBreakdownCandidate && (
                <FitScoreBreakdownModal
                    application={fitBreakdownCandidate}
                    onClose={() => setFitBreakdownCandidate(null)}
                />
            )}
            {rejectingCandidate && (
                <RejectReasonModal
                    candidateName={rejectingCandidate.full_name}
                    selectedReason={selectedRejectReason}
                    onSelectReason={setSelectedRejectReason}
                    onClose={() => {
                        setRejectingCandidate(null);
                        setSelectedRejectReason("");
                    }}
                    onConfirm={() => {
                        if (!selectedRejectReason) {
                            toast.error("Please select a rejection reason.");
                            return;
                        }
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem(`careersync-rejection-reason-${rejectingCandidate.id}`, selectedRejectReason);
                        }
                        void updateApplicationStage(rejectingCandidate.id, "rejected").then(() => {
                            setRejectingCandidate(null);
                            setSelectedRejectReason("");
                        });
                    }}
                />
            )}
            {addingDatabaseProfile && (
                <AddDatabaseProfileToJobModal
                    profile={addingDatabaseProfile}
                    jobs={myJobs}
                    selectedJobId={addToJobId}
                    onSelectJob={setAddToJobId}
                    onClose={() => {
                        setAddingDatabaseProfile(null);
                        setAddToJobId("");
                    }}
                    onConfirm={() => {
                        const selectedJob = myJobs.find((job) => job.id === addToJobId) ?? addingDatabaseProfile.matchedJob;
                        if (!selectedJob) {
                            toast.error("Please select a job.");
                            return;
                        }
                        const profileForRequest = { ...addingDatabaseProfile, matchedJob: selectedJob };
                        void requestDatabaseProfileUnlock(profileForRequest).then(() => {
                            setAddingDatabaseProfile(null);
                            setAddToJobId("");
                        });
                    }}
                />
            )}
            <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border border-[#E4E2DA] bg-white/95 p-1 shadow-2xl backdrop-blur md:hidden">
                {[
                    ["overview", "Home"],
                    ["jobs", "Jobs"],
                    ["candidates", "Candidates"],
                    ["pipeline", "Pipeline"],
                    ["profile", "More"],
                ].map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id as CompanyWorkspaceTab)}
                        className={`rounded-xl px-2 py-2 text-[11px] font-black ${activeTab === id ? "bg-[#0F1424] text-white" : "text-[#5B6172]"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <Link to="/post-job" className="fixed bottom-20 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#0F1424] text-white shadow-2xl transition hover:bg-[#171E33] md:hidden" aria-label="Post a job">
                <Plus className="h-5 w-5" />
            </Link>
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
    if (normalized.includes("not_join")) return "Not Joined";
    if (normalized.includes("offer_decline")) return "Offer Declined";
    if (normalized.includes("no_show") || normalized.includes("noshow")) return "No-show";
    if (normalized.includes("withdraw")) return "Withdrawn";
    if (normalized.includes("reject")) return "Rejected";
    if (normalized.includes("joined")) return "Joined";
    if (normalized.includes("offered") || normalized === "offer" || normalized.includes("offer")) return "Offered";
    if (normalized.includes("selected")) return "Selected";
    if (normalized.includes("interview")) return "Interview";
    if (normalized.includes("shortlist")) return "Shortlisted";
    if (normalized.includes("review") || normalized.includes("screen")) return "Screening";
    return "Applied";
}

function isProfileSharingApproved(application: Pick<DemoApplicationRecord, "cover_letter" | "status">) {
    return getUnlockStatus(application) === "approved";
}

function getProfileSharingStatus(application: Pick<DemoApplicationRecord, "cover_letter" | "status">) {
    const unlockStatus = getUnlockStatus(application);
    if (unlockStatus === "approved") {
        return { label: "Sharing approved", tone: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" };
    }
    if (unlockStatus === "rejected") {
        return { label: "Sharing blocked", tone: "bg-rose-50 text-rose-700 ring-1 ring-rose-100" };
    }
    if (unlockStatus === "requested") {
        return { label: "Unlock requested", tone: "bg-amber-50 text-amber-700 ring-1 ring-amber-100" };
    }
    return { label: "Profile locked", tone: "bg-amber-50 text-amber-700 ring-1 ring-amber-100" };
}

function getApplicationMetaLine(application: Pick<DemoApplicationRecord, "cover_letter">, label: string) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = (application.cover_letter ?? "").match(new RegExp(`^${escaped}:\\s*(.+)$`, "im"));
    return match?.[1]?.trim() ?? "";
}

function getApplicationMetaList(application: Pick<DemoApplicationRecord, "cover_letter">, label: string) {
    const value = getApplicationMetaLine(application, label);
    if (!value) return [];
    const separator = value.includes("|") ? "|" : ",";
    return value
        .split(separator)
        .map((item) => item.trim())
        .filter(Boolean);
}

function getParsedResumeSummary(application: Pick<DemoApplicationRecord, "cover_letter">) {
    return {
        name: getApplicationMetaLine(application, "Resume Name"),
        email: getApplicationMetaLine(application, "Resume Email"),
        phone: getApplicationMetaLine(application, "Resume Phone"),
        city: getApplicationMetaLine(application, "Resume City"),
        lastRole: getApplicationMetaLine(application, "Resume Last Role"),
        companies: getApplicationMetaList(application, "Resume Companies"),
        skills: getApplicationMetaList(application, "Resume Skills"),
        education: getApplicationMetaList(application, "Resume Education"),
        noticePeriod: getApplicationMetaLine(application, "Resume Notice Period"),
        currentCtc: getApplicationMetaLine(application, "Resume Current CTC"),
        expectedCtc: getApplicationMetaLine(application, "Resume Expected CTC"),
        languages: getApplicationMetaList(application, "Resume Languages"),
        summary: getApplicationMetaLine(application, "Resume Summary"),
        jobGaps: getApplicationMetaList(application, "Resume Job Gaps"),
        roleFit: getApplicationMetaList(application, "Resume Role Fit"),
        recommendation: getApplicationMetaLine(application, "Recruiter Recommendation"),
        confidence: getApplicationMetaLine(application, "Resume Parse Confidence"),
        source: getApplicationMetaLine(application, "Resume Parse Source"),
    };
}

function getUnlockStatus(application: Pick<DemoApplicationRecord, "cover_letter" | "status">) {
    const status = getApplicationMetaLine(application, "Unlock Status").toLowerCase();
    if (status === "requested" || status === "approved" || status === "rejected") return status;
    return "locked";
}

function getUnlockRequestLine(application: Pick<DemoApplicationRecord, "cover_letter">) {
    const requestedBy = getApplicationMetaLine(application, "Unlock Requested By");
    const requestedAt = getApplicationMetaLine(application, "Unlock Requested At");
    const source = getApplicationMetaLine(application, "Resume Parse Source");
    if (!requestedBy && !requestedAt) return "";
    const date = requestedAt ? new Date(requestedAt).toLocaleString("en-IN") : "recently";
    const sourceLabel = source === "database-profile" || source === "admin-whatsapp-resume" ? " from database profile" : "";
    return `${requestedBy || "Recruiter"} requested unlock${sourceLabel} ${date}.`;
}

function getApplicationAdminLog(application: Pick<DemoApplicationRecord, "cover_letter">) {
    return (application.cover_letter ?? "")
        .split("\n")
        .filter((line) => /^\s*admin log:/i.test(line))
        .map((line) => line.replace(/^\s*admin log:\s*/i, ""))
        .map((line) => {
            const [createdAt = "", action = "log", ...noteParts] = line.split("|").map((part) => part.trim());
            return {
                createdAt: createdAt || new Date().toISOString(),
                action: action || "log",
                note: noteParts.join(" | ") || "Application workflow updated.",
            };
        });
}

function getApplicationTimeline(application: RecruiterApplicationView) {
    const locked = !isProfileSharingApproved(application);
    const unlockStatus = getUnlockStatus(application);
    const base = [
        {
            title: "Candidate applied",
            text: `${application.full_name} applied for ${application.job?.role ?? "this role"}.`,
            date: application.created_at,
            done: true,
        },
        {
            title: unlockStatus === "requested" ? "Recruiter requested unlock" : locked ? "Profile locked" : "Profile sharing approved",
            text: unlockStatus === "requested"
                ? "CareerSync admin needs to approve resume and contact visibility."
                : locked
                    ? "Resume and full contact details are still hidden from the company."
                    : "Recruiter can view contact details and resume.",
            date: getApplicationMetaLine(application, "Unlock Requested At") || application.updated_at,
            done: unlockStatus === "approved",
        },
        {
            title: `Current stage: ${recruiterStage(application.status)}`,
            text: application.ai_match_reason || "Pipeline status is synced with the shared application record.",
            date: application.updated_at,
            done: true,
        },
    ];
    return [...base, ...getApplicationAdminLog(application).map((entry) => ({
        title: entry.action.replace(/_/g, " "),
        text: entry.note,
        date: entry.createdAt,
        done: true,
    }))].sort((a, b) => (a.date > b.date ? 1 : -1));
}

function getCandidateApplicationTimeline(application: DemoApplicationRecord & { job?: DemoJobRecord }) {
    const stage = recruiterStage(application.status);
    return [
        {
            title: "Application submitted",
            text: `${application.job?.company ?? "Company"} received your application.`,
            done: true,
        },
        {
            title: "Screening",
            text: stage === "Applied" ? "Waiting for recruiter/admin review." : "Your profile has moved into review.",
            done: stage !== "Applied",
        },
        {
            title: "Interview / decision",
            text: RECRUITER_CLOSED_STAGES.includes(stage as (typeof RECRUITER_CLOSED_STAGES)[number]) ? "This application was closed." : stage === "Interview" || stage === "Offered" || stage === "Selected" || stage === "Joined" ? `Current stage: ${stage}.` : "Next update will appear here.",
            done: stage === "Interview" || stage === "Offered" || stage === "Selected" || stage === "Joined" || RECRUITER_CLOSED_STAGES.includes(stage as (typeof RECRUITER_CLOSED_STAGES)[number]),
        },
    ];
}

function getCandidateStageProgress(stage: string) {
    const order = ["Applied", "Screening", "Shortlisted", "Interview", "Selected", "Offered", "Joined"];
    if (RECRUITER_CLOSED_STAGES.includes(stage as (typeof RECRUITER_CLOSED_STAGES)[number])) return 100;
    const index = Math.max(0, order.indexOf(stage));
    return Math.round(((index + 1) / order.length) * 100);
}

function getCandidateNextStep(stage: string) {
    if (stage === "Applied") return "Next: CareerSync and the company review your resume. Keep your phone available for updates.";
    if (stage === "Screening") return "Next: Recruiter is checking basic fit. Make sure your resume and contact details are correct.";
    if (stage === "Shortlisted") return "Next: You are shortlisted. Watch notifications for interview scheduling.";
    if (stage === "Interview") return "Next: Prepare for the interview and respond quickly to recruiter calls or messages.";
    if (stage === "Selected") return "Next: Selection is positive. Wait for offer details or joining confirmation.";
    if (stage === "Offered") return "Next: Review the offer and confirm acceptance as soon as possible.";
    if (stage === "Joined") return "You are marked joined. Keep your profile updated for future opportunities.";
    if (stage === "Rejected") return "This application is closed. Use the feedback to apply to better-fit roles.";
    if (stage === "Withdrawn") return "This application was withdrawn. You can still apply to other matching jobs.";
    if (stage === "No-show") return "This application is blocked due to no-show. Contact support if this is incorrect.";
    if (stage === "Offer Declined") return "Offer was declined. Keep browsing roles that match your expectations.";
    if (stage === "Not Joined") return "This application closed after offer stage. Update availability before applying again.";
    return "Next update will appear here once the company moves your application.";
}

function getApplicationDataHealth(applications: Array<DemoApplicationRecord & { job?: DemoJobRecord }>) {
    const issues = applications.flatMap((application) => {
        const applicationIssues: Array<{ application: DemoApplicationRecord & { job?: DemoJobRecord }; label: string }> = [];
        if (!application.resume_url && !application.resume_path) applicationIssues.push({ application, label: "Resume missing or not uploaded." });
        if (!application.phone) applicationIssues.push({ application, label: "Candidate phone missing." });
        if (!application.job) applicationIssues.push({ application, label: "Application is not linked to a visible job." });
        if (!extractCandidateExperience(application as RecruiterApplicationView) || extractCandidateExperience(application as RecruiterApplicationView) === "Not shared") applicationIssues.push({ application, label: "Total experience not captured." });
        if (getUnlockStatus(application) === "requested") applicationIssues.push({ application, label: "Profile unlock request pending admin review." });
        return applicationIssues;
    });
    return {
        missingResume: applications.filter((application) => !application.resume_url && !application.resume_path).length,
        missingPhone: applications.filter((application) => !application.phone).length,
        missingJob: applications.filter((application) => !application.job).length,
        pendingUnlock: applications.filter((application) => getUnlockStatus(application) === "requested").length,
        issues,
    };
}

function getResumeStorageInsights(applications: Array<DemoApplicationRecord & { job?: DemoJobRecord }>) {
    const withResume = applications.filter((application) => application.resume_url || application.resume_path);
    const uniqueKeys = new Set(withResume.map((application) => application.resume_path || application.resume_url || application.id));
    const uploadLog = withResume
        .map((application) => ({
            id: application.id,
            candidateName: application.full_name,
            role: application.job?.role ?? "Role",
            company: application.job?.company ?? "Company",
            fileName: getApplicationMetaLine(application, "Resume File") || application.resume_path?.split("/").pop() || "Resume uploaded",
            uploadedAt: getApplicationMetaLine(application, "Resume Uploaded At") || application.updated_at || application.created_at,
            status: application.resume_url ? "stored" : "path only",
            path: application.resume_path || null,
            downloadUrl: application.resume_url || (application.resume_path ? getAdminResumeDownloadUrl(application.resume_path) : null),
            city: extractCity(application as RecruiterApplicationView),
            experience: extractCandidateExperience(application as RecruiterApplicationView),
            lastRole: getParsedResumeSummary(application).lastRole,
        }))
        .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
    const failedAlerts = applications
        .filter((application) => !application.resume_url && !application.resume_path)
        .map((application) => ({
            application,
            reason: "Application exists but no resume_url or resume_path was saved.",
        }));

    return {
        storageCount: withResume.length,
        uniqueResumeCount: uniqueKeys.size,
        uploadLog,
        failedAlerts,
    };
}

function getStorageOnlyResumeLog(
    storageInsight: {
        storageFiles?: Array<{
            path: string;
            fileName: string;
            folder: string;
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
        }>;
        samplePaths: string[];
    } | null,
    applicationUploadLog: Array<{ fileName: string; path?: string | null; candidateName: string; role: string; company: string }>,
) {
    const applicationKeys = new Set(
        applicationUploadLog.flatMap((entry) => [entry.fileName, entry.path ?? ""])
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean),
    );
    const applicationByPath = new Map(
        applicationUploadLog
            .filter((entry) => entry.path)
            .map((entry) => [entry.path!.trim().toLowerCase(), entry]),
    );
    const storageFiles = storageInsight?.storageFiles?.length
        ? storageInsight.storageFiles
        : (storageInsight?.samplePaths ?? []).map((path) => ({
            path,
            fileName: path.split("/").pop() || path,
            folder: path.split("/")[0] || "storage",
            downloadUrl: null,
            uploadedAt: null,
            size: null,
            originalFileName: null,
            candidateName: null,
            candidateEmail: null,
            candidatePhone: null,
            candidateCity: null,
            candidateExperience: null,
            candidateLastRole: null,
            source: null,
        }));

    return storageFiles
        .filter((file) => {
            const fileNameKey = file.fileName.trim().toLowerCase();
            const pathKey = file.path.trim().toLowerCase();
            return !applicationKeys.has(fileNameKey) && !applicationKeys.has(pathKey);
        })
        .map((file) => {
            const application = applicationByPath.get(file.path.trim().toLowerCase());
            return {
                id: `storage-${file.path}`,
                candidateName: getStoredCandidateName(file, application),
                role: application?.role ?? getResumeSourceLabel(file.folder, file.source),
                company: application?.company ?? "Supabase Storage",
                fileName: file.originalFileName || file.fileName,
                uploadedAt: file.uploadedAt || new Date(0).toISOString(),
                status: file.size ? `${formatBytes(file.size)} stored` : "stored",
                path: file.path,
                downloadUrl: file.downloadUrl || getAdminResumeDownloadUrl(file.path, file.originalFileName || file.fileName),
                city: file.candidateCity,
                experience: file.candidateExperience,
                lastRole: file.candidateLastRole,
            };
        });
}

function getUniqueStoredResumeCount(storageInsight: {
    storageCount: number;
    samplePaths: string[];
    storageFiles?: Array<{ path: string }>;
}) {
    const uniquePaths = new Set(
        (storageInsight.storageFiles?.length
            ? storageInsight.storageFiles.map((file) => file.path)
            : storageInsight.samplePaths
        )
            .map((path) => path.trim().toLowerCase())
            .filter(Boolean),
    );
    return uniquePaths.size || storageInsight.storageCount;
}

function getStoredCandidateName(
    file: { candidateName?: string | null; originalFileName?: string | null; fileName: string; folder: string },
    application?: { candidateName: string } | undefined,
) {
    if (file.candidateName?.trim()) return file.candidateName.trim();
    if (application?.candidateName?.trim()) return application.candidateName.trim();
    const fromFileName = humanizeResumeStorageName(file.originalFileName || file.fileName);
    return fromFileName || "Candidate name not saved";
}

function getAdminResumeDownloadUrl(path: string, fileName?: string | null) {
    const params = new URLSearchParams({
        resource: "resume-download",
        role: "admin",
        path,
    });
    if (fileName?.trim()) params.set("fileName", fileName.trim());
    return `/api/careersync-jobs?${params.toString()}`;
}

type StoredAdminResumeUploadLog = {
    id: string;
    candidateName: string;
    role: string;
    company: string;
    fileName: string;
    uploadedAt: string;
    status: string;
    path: string;
    downloadUrl: string;
    city: string;
    experience: string;
    lastRole: string;
};

const ADMIN_RESUME_UPLOAD_LOG_KEY = "careersync-admin-resume-upload-log";

function getStoredAdminResumeUploadLog(): StoredAdminResumeUploadLog[] {
    if (typeof window === "undefined") return [];
    try {
        const parsed = JSON.parse(window.localStorage.getItem(ADMIN_RESUME_UPLOAD_LOG_KEY) || "[]");
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((entry): entry is StoredAdminResumeUploadLog =>
                entry &&
                typeof entry === "object" &&
                typeof entry.path === "string" &&
                typeof entry.candidateName === "string" &&
                typeof entry.fileName === "string",
            )
            .slice(0, 100);
    } catch {
        return [];
    }
}

function persistAdminResumeUploadLog(entry: StoredAdminResumeUploadLog) {
    const next = [
        entry,
        ...getStoredAdminResumeUploadLog().filter((item) => item.path !== entry.path),
    ].slice(0, 100);
    if (typeof window !== "undefined") {
        window.localStorage.setItem(ADMIN_RESUME_UPLOAD_LOG_KEY, JSON.stringify(next));
    }
    return next;
}

function humanizeResumeStorageName(fileName: string) {
    const raw = fileName
        .replace(/\.(pdf|doc|docx)$/i, "")
        .replace(/^\d{10,}[-_]+/i, "")
        .replace(/[-_]+[0-9a-f]{8,}(?:-[0-9a-f]{4,}){2,}$/i, "")
        .trim();
    if (!raw || /^\d{10,}-[0-9a-f-]+$/i.test(raw) || /^[0-9a-f-]{20,}$/i.test(raw)) return "";
    return raw
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
        .trim();
}

function getResumeSourceLabel(folder: string, source?: string | null) {
    if (source === "careersync-home-resume" || folder.startsWith("careersync-home-resume")) return "Homepage resume upload";
    if (source === "careersync-job-application") return "Job application";
    if (source === "admin-whatsapp-resume" || folder.startsWith("admin-whatsapp-resume")) return "Admin WhatsApp resume";
    if (folder.startsWith("ats-score-checker")) return "ATS score checker";
    if (folder.startsWith("resume-template")) return "Resume template upload";
    if (folder.startsWith("firebase-")) return "Job application";
    return "Storage-only resume";
}

function formatBytes(value: number) {
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function getDuplicateCandidateGroups(applications: Array<DemoApplicationRecord & { job?: DemoJobRecord }>) {
    const groups = new Map<string, Array<DemoApplicationRecord & { job?: DemoJobRecord }>>();
    for (const application of applications) {
        const emailKey = application.email.trim().toLowerCase();
        const phoneKey = (application.phone ?? getApplicationMetaLine(application, "Resume Phone")).replace(/\D/g, "");
        const keys = [
            emailKey ? `email:${emailKey}` : "",
            phoneKey.length >= 8 ? `phone:${phoneKey}` : "",
        ].filter(Boolean);
        keys.forEach((key) => {
            groups.set(key, [...(groups.get(key) ?? []), application]);
        });
    }

    return [...groups.entries()]
        .filter(([, items]) => items.length > 1)
        .map(([key, items]) => ({
            key,
            label: key.startsWith("phone:") ? `Same phone ending ${key.slice(-4)}` : `Same email ${items[0]?.email ?? ""}`,
            items,
        }))
        .sort((a, b) => b.items.length - a.items.length);
}

function getCandidateQualityScore(application: DemoApplicationRecord & { job?: DemoJobRecord }) {
    const parsed = getParsedResumeSummary(application);
    const hasResume = Boolean(application.resume_url || application.resume_path);
    const hasPhone = Boolean(application.phone || parsed.phone);
    const hasEmail = Boolean(application.email || parsed.email);
    const hasCity = extractCity(application as RecruiterApplicationView) !== "Not shared";
    const hasExperience = extractCandidateExperience(application as RecruiterApplicationView) !== "Not shared";
    const skillCount = new Set([...(parsed.skills ?? []), ...(application.ai_matched_skills ?? [])].map((skill) => skill.toLowerCase())).size;
    const fitScore = getApplicationFit(application, application.job);
    const parseConfidence = Number(parsed.confidence);

    const score =
        (hasResume ? 20 : 0) +
        (hasPhone ? 12 : 0) +
        (hasEmail ? 8 : 0) +
        (hasCity ? 10 : 0) +
        (hasExperience ? 14 : 0) +
        Math.min(12, skillCount * 2) +
        Math.min(18, Math.round(fitScore * 0.18)) +
        (Number.isFinite(parseConfidence) ? Math.min(6, Math.round(parseConfidence * 0.06)) : 0);

    return Math.max(0, Math.min(100, score));
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

function RecruiterActionMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-[#F6F5F1] p-4 ring-1 ring-[#E4E2DA]">
            <p className="font-display text-3xl font-black text-[#171B2B]">{value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#5B6172]">{label}</p>
        </div>
    );
}

function FitScoreBreakdownModal({ application, onClose }: { application: RecruiterApplicationView; onClose: () => void }) {
    const breakdown = getFitScoreBreakdown(application);
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0F1424]/50 p-4 backdrop-blur-sm">
            <button type="button" aria-label="Close score breakdown" className="absolute inset-0 cursor-default" onClick={onClose} />
            <section className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#3D5AFE]">Fit Score</p>
                        <h2 className="mt-1 font-display text-xl font-black text-[#171B2B]">Why {application.fit}%?</h2>
                        <p className="mt-1 text-xs font-semibold text-[#5B6172]">{application.full_name} · {application.job?.role ?? "Selected role"}</p>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F6F5F1] text-[#5B6172] ring-1 ring-[#E4E2DA]">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-4 space-y-2">
                    {breakdown.rows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between rounded-xl bg-[#F6F5F1] px-3 py-2 ring-1 ring-[#E4E2DA]">
                            <span className="text-sm font-bold text-[#5B6172]">{row.label}</span>
                            <strong className={row.value === "Unknown" ? "text-sm text-[#8A8F9E]" : "text-sm text-[#171B2B]"}>{row.value}</strong>
                        </div>
                    ))}
                </div>
                <div className="mt-4 rounded-2xl bg-[#0F1424] p-4 text-white">
                    <p className="text-xs font-bold text-[#C9D0EE]">Overall Job Fit</p>
                    <p className="mt-1 font-display text-3xl font-black">{breakdown.overall}%</p>
                    <p className="mt-2 text-xs font-semibold text-[#C9D0EE]">
                        Profile data incomplete — confidence: {breakdown.confidence}
                        {breakdown.missingFields.length ? ` (${breakdown.missingFields.join(", ")} missing)` : ""}
                    </p>
                </div>
            </section>
        </div>
    );
}

function RejectReasonModal({
    candidateName,
    selectedReason,
    onSelectReason,
    onClose,
    onConfirm,
}: {
    candidateName: string;
    selectedReason: string;
    onSelectReason: (reason: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0F1424]/50 p-4 backdrop-blur-sm">
            <button type="button" aria-label="Close rejection reason" className="absolute inset-0 cursor-default" onClick={onClose} />
            <section className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
                <h2 className="font-display text-xl font-black text-[#171B2B]">Why are you rejecting?</h2>
                <p className="mt-1 text-sm font-semibold text-[#5B6172]">{candidateName}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {REJECTION_REASONS.map((reason) => (
                        <button
                            key={reason}
                            type="button"
                            onClick={() => onSelectReason(reason)}
                            className={`rounded-xl px-3 py-2 text-left text-sm font-black ring-1 transition ${selectedReason === reason ? "bg-[#0F1424] text-white ring-[#0F1424]" : "bg-[#F6F5F1] text-[#5B6172] ring-[#E4E2DA] hover:text-[#171B2B]"}`}
                        >
                            {reason}
                        </button>
                    ))}
                </div>
                <div className="mt-5 flex justify-end gap-2">
                    <ActionButton tone="neutral" onClick={onClose}>Cancel</ActionButton>
                    <ActionButton tone="danger" onClick={onConfirm}>Reject candidate</ActionButton>
                </div>
            </section>
        </div>
    );
}

function AddDatabaseProfileToJobModal({
    profile,
    jobs,
    selectedJobId,
    onSelectJob,
    onClose,
    onConfirm,
}: {
    profile: RecruiterDatabaseProfile;
    jobs: DemoJobRecord[];
    selectedJobId: string;
    onSelectJob: (jobId: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0F1424]/50 p-4 backdrop-blur-sm">
            <button type="button" aria-label="Close add to job" className="absolute inset-0 cursor-default" onClick={onClose} />
            <section className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
                <h2 className="font-display text-xl font-black text-[#171B2B]">Add Candidate</h2>
                <p className="mt-1 text-sm font-semibold text-[#5B6172]">{profile.candidateName} · {profile.fit}% match</p>
                <label className="mt-4 grid gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wide text-[#8A8F9E]">Select Job</span>
                    <select
                        value={selectedJobId}
                        onChange={(event) => onSelectJob(event.target.value)}
                        className="min-h-11 rounded-xl border border-[#E4E2DA] bg-[#F6F5F1] px-3 text-sm font-bold text-[#171B2B] outline-none transition focus:border-[#3D5AFE] focus:bg-white"
                    >
                        <option value="">Select Job</option>
                        {jobs.map((job) => (
                            <option key={job.id} value={job.id}>{job.role} — {job.location || job.company}</option>
                        ))}
                    </select>
                </label>
                <p className="mt-4 rounded-xl bg-[#F6F5F1] px-3 py-2 text-xs font-bold text-[#5B6172]">
                    Database → Shortlisted for Job → Candidate consent/contact → Recruiter Pipeline
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <ActionButton tone="neutral" onClick={onClose}>Cancel</ActionButton>
                    <ActionButton tone="success" onClick={onConfirm}>Add Candidate</ActionButton>
                </div>
            </section>
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

function RecruiterSelectFilter({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly string[];
}) {
    return (
        <label className="grid gap-1">
            <span className="text-[10px] font-black uppercase tracking-wide text-[#8A8F9E]">{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-10 rounded-xl border border-[#E4E2DA] bg-[#F6F5F1] px-3 text-xs font-bold text-[#171B2B] outline-none transition focus:border-[#3D5AFE] focus:bg-white"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option === "all" ? `All ${label.toLowerCase()}` : option}
                    </option>
                ))}
            </select>
        </label>
    );
}

function maskPhoneLast4(phone: string | null) {
    const digits = (phone ?? "").replace(/\D/g, "");
    if (!digits) return "Not shared";
    return `xxxxxx${digits.slice(-4)}`;
}

function maskEmail(email: string) {
    const [name = "", domain = ""] = email.split("@");
    if (!domain) return "Hidden";
    const visible = name.slice(0, Math.min(2, name.length));
    return `${visible}${"*".repeat(Math.max(3, name.length - visible.length))}@${domain}`;
}

function extractCity(application: RecruiterApplicationView) {
    const text = application.cover_letter ?? "";
    const cityMatch = text.match(/candidate city:\s*([^\n]+)/i);
    if (cityMatch?.[1]?.trim()) return cityMatch[1].trim();
    const parsedCity = getApplicationMetaLine(application, "Resume City");
    if (parsedCity) return parsedCity;
    const location = application.job?.location?.split(",")[0]?.trim();
    return location || "Not shared";
}

function extractCandidateExperience(application: RecruiterApplicationView) {
    const text = application.cover_letter ?? "";
    const structuredMatch = text.match(/total experience:\s*([^\n]+)/i);
    if (structuredMatch?.[1]?.trim()) return structuredMatch[1].trim();
    const parsedExperience = getApplicationMetaLine(application, "Resume Experience") || getApplicationMetaLine(application, "Resume Total Experience");
    if (parsedExperience) return parsedExperience;
    const match = text.match(/(?:^|\b)(\d{1,2}\+?)\s*(?:years?|yrs?|yr)\b/i);
    if (match) return `${match[1]} years`;
    return "Not shared";
}

function getApplicationSalarySnapshot(application: Pick<DemoApplicationRecord, "cover_letter">) {
    const parsed = getParsedResumeSummary(application);
    return {
        current: parsed.currentCtc || getApplicationMetaLine(application, "Current CTC") || "",
        expected: parsed.expectedCtc || getApplicationMetaLine(application, "Expected CTC") || "",
    };
}

function getApplicationNoticePeriod(application: Pick<DemoApplicationRecord, "cover_letter">) {
    const parsed = getParsedResumeSummary(application);
    return parsed.noticePeriod || getApplicationMetaLine(application, "Notice Period") || "";
}

function getSalaryNumber(value: string | null | undefined) {
    const text = value ?? "";
    const numberMatch = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    if (!numberMatch) return null;
    const valueNumber = Number(numberMatch[1]);
    if (!Number.isFinite(valueNumber)) return null;
    if (/k|thousand/i.test(text)) return valueNumber / 100;
    if (/lpa|lac|lakh|lakhs/i.test(text)) return valueNumber;
    return valueNumber >= 100000 ? valueNumber / 100000 : valueNumber;
}

function isSalaryWithinBudget(application: RecruiterApplicationView) {
    const expected = getSalaryNumber(getApplicationSalarySnapshot(application).expected);
    const budget = getSalaryNumber(application.job?.salary);
    if (expected === null || budget === null) return null;
    return expected <= budget;
}

function isApplicationSalaryMatch(application: RecruiterApplicationView, filter: string) {
    if (filter === "all") return true;
    const salary = getApplicationSalarySnapshot(application);
    const hasSalary = Boolean(salary.current || salary.expected);
    if (filter === "Salary shared") return hasSalary;
    if (filter === "Salary missing") return !hasSalary;
    const withinBudget = isSalaryWithinBudget(application);
    if (filter === "Within budget") return withinBudget === true;
    if (filter === "Above budget") return withinBudget === false;
    return true;
}

function isApplicationAvailabilityMatch(application: Pick<DemoApplicationRecord, "cover_letter">, filter: string) {
    if (filter === "all") return true;
    const notice = getApplicationNoticePeriod(application);
    if (!notice) return filter === "Unknown";
    const normalized = notice.toLowerCase();
    if (filter === "Immediate") return /immediate|join now|0\s*day/.test(normalized);
    if (filter === "15 days") return /15|fifteen/.test(normalized);
    if (filter === "30 days") return /30|one month|1 month/.test(normalized);
    if (filter === "60+ days") return /60|90|2 month|3 month|two month|three month/.test(normalized);
    if (filter === "Unknown") return false;
    return true;
}

function isDatabaseSalaryMatch(_file: ResumeStorageFileInsight, filter: string) {
    if (filter === "all") return true;
    return filter === "Salary missing";
}

function isDatabaseAvailabilityMatch(_file: ResumeStorageFileInsight, filter: string) {
    if (filter === "all") return true;
    return filter === "Unknown";
}

function getCandidateMatchReasons(application: RecruiterApplicationView) {
    const parsed = getParsedResumeSummary(application);
    const reasons = [
        extractCity(application) !== "Not shared" ? "Location match" : "",
        isSalaryWithinBudget(application) === true ? "Salary within budget" : "",
        extractCandidateExperience(application) !== "Not shared" ? "Relevant experience" : "",
        /immediate|0\s*day/i.test(parsed.noticePeriod) ? "Immediate joiner" : "",
    ].filter(Boolean);
    if (application.ai_matched_skills?.length) reasons.push("Relevant skills found");
    return reasons.length ? reasons.slice(0, 5) : ["Profile has resume data", "Needs more details for better match"];
}

function getFitScoreBreakdown(application: RecruiterApplicationView) {
    const parsed = getParsedResumeSummary(application);
    const city = extractCity(application);
    const experience = extractCandidateExperience(application);
    const salaryWithinBudget = isSalaryWithinBudget(application);
    const hasAvailability = Boolean(parsed.noticePeriod);
    const roleScore = application.ai_matched_skills?.length ? Math.min(95, 55 + application.ai_matched_skills.length * 8) : application.job?.role ? 80 : 55;
    const locationScore = city !== "Not shared" && application.job?.location ? 100 : null;
    const experienceScore = experience !== "Not shared" ? 60 : null;
    const skillsScore = application.ai_matched_skills?.length ? Math.min(90, 45 + application.ai_matched_skills.length * 10) : parsed.skills.length ? Math.min(85, 45 + parsed.skills.length * 6) : 55;
    const salaryScore = salaryWithinBudget === null ? null : salaryWithinBudget ? 80 : 45;
    const availabilityScore = !hasAvailability ? null : /immediate|0\s*day/i.test(parsed.noticePeriod) ? 100 : 60;
    const knownScores = [roleScore, locationScore, experienceScore, skillsScore, salaryScore, availabilityScore].filter((score): score is number => typeof score === "number");
    const computedOverall = knownScores.length ? Math.round(knownScores.reduce((sum, score) => sum + score, 0) / knownScores.length) : application.fit;
    const missingFields = [
        locationScore === null ? "location" : "",
        experienceScore === null ? "experience" : "",
        salaryScore === null ? "salary" : "",
        availabilityScore === null ? "availability" : "",
    ].filter(Boolean);
    return {
        rows: [
            { label: "Role Match", value: `${roleScore}%` },
            { label: "Location", value: locationScore === null ? "Unknown" : `${locationScore}%` },
            { label: "Experience", value: experienceScore === null ? "Unknown" : `${experienceScore}%` },
            { label: "Skills", value: `${skillsScore}%` },
            { label: "Salary", value: salaryScore === null ? "Unknown" : `${salaryScore}%` },
            { label: "Availability", value: availabilityScore === null ? "Unknown" : `${availabilityScore}%` },
        ],
        overall: Math.round((computedOverall + application.fit) / 2),
        confidence: missingFields.length >= 2 ? "Low" : missingFields.length === 1 ? "Medium" : "High",
        missingFields,
    };
}

function getStorageProfileName(file: ResumeStorageFileInsight) {
    const metadataName = file.candidateName?.trim();
    if (metadataName && !/candidate name not saved/i.test(metadataName)) return metadataName;
    const fileName = file.originalFileName || file.fileName;
    const humanName = humanizeResumeStorageName(fileName);
    return humanName || "Candidate profile";
}

function getStorageProfileRole(file: ResumeStorageFileInsight) {
    const role = file.candidateLastRole?.trim();
    if (role) return role;
    const sourceLabel = getResumeSourceLabel(file.folder, file.source);
    if (/job application/i.test(sourceLabel)) return "Applied candidate";
    if (/admin whatsapp/i.test(sourceLabel)) return "Resume from WhatsApp";
    return "Resume profile";
}

function getStorageProfileCity(file: ResumeStorageFileInsight) {
    return file.candidateCity?.trim() || "City not shared";
}

function getStorageProfileExperience(file: ResumeStorageFileInsight) {
    return file.candidateExperience?.trim() || "Experience not shared";
}

function getStorageProfileSearchText(file: ResumeStorageFileInsight) {
    return [
        getStorageProfileName(file),
        getStorageProfileRole(file),
        getStorageProfileCity(file),
        getStorageProfileExperience(file),
        file.originalFileName,
        file.fileName,
        file.path,
        getResumeSourceLabel(file.folder, file.source),
    ].filter(Boolean).join(" ").toLowerCase();
}

function scoreResumeProfileForJob(file: ResumeStorageFileInsight, job?: DemoJobRecord | null) {
    if (!job) return 35;
    const profileText = [
        getStorageProfileName(file),
        getStorageProfileRole(file),
        getStorageProfileCity(file),
        getStorageProfileExperience(file),
        file.originalFileName,
        file.fileName,
        getResumeSourceLabel(file.folder, file.source),
    ].filter(Boolean).join(" ");
    const result = fallbackCareerSyncMatch({
        job,
        candidate: {
            full_name: getStorageProfileName(file),
            email: file.candidateEmail || "",
            phone: file.candidatePhone || null,
            cover_letter: [
                `Last role: ${getStorageProfileRole(file)}`,
                `City: ${getStorageProfileCity(file)}`,
                `Experience: ${getStorageProfileExperience(file)}`,
                `Source: ${getResumeSourceLabel(file.folder, file.source)}`,
            ].join("\n"),
            resume_path: file.path,
            resume_url: null,
            resumeName: file.originalFileName || file.fileName,
            resumeText: profileText,
        },
    });
    const profileCity = normalizeDatabaseMatchText(getStorageProfileCity(file));
    const jobLocation = normalizeDatabaseMatchText(job.location);
    const roleText = normalizeDatabaseMatchText(`${getStorageProfileRole(file)} ${file.originalFileName ?? ""} ${file.fileName}`);
    const jobRoleText = normalizeDatabaseMatchText(`${job.role} ${job.description} ${(job.tags ?? []).join(" ")} ${(job.required_skills ?? []).join(" ")}`);
    const profileYears = getDatabaseExperienceYears(getStorageProfileExperience(file));
    const jobYears = getDatabaseExperienceYears(job.experience);
    const cityBonus = profileCity && jobLocation && (jobLocation.includes(profileCity) || profileCity.includes(jobLocation.split(" ")[0] ?? "")) ? 12 : 0;
    const roleBonus = getDatabaseKeywordOverlap(roleText, jobRoleText) >= 2 ? 14 : getDatabaseKeywordOverlap(roleText, jobRoleText) === 1 ? 7 : 0;
    const experienceBonus = profileYears === null || jobYears === null
        ? 0
        : profileYears >= jobYears ? 10 : profileYears + 1 >= jobYears ? 5 : -8;
    const metadataBonus = file.candidateName && (file.candidateCity || file.candidateExperience || file.candidateLastRole) ? 6 : 0;
    return Math.max(5, Math.min(98, result.fitScore + cityBonus + roleBonus + experienceBonus + metadataBonus));
}

function getRecruiterDatabaseProfiles({
    storageInsight,
    jobs,
    existingApplications,
    query,
    cityFilter,
    experienceFilter,
    sourceFilter,
    minFitFilter,
    salaryFilter,
    availabilityFilter,
}: {
    storageInsight: ResumeStorageInsight | null;
    jobs: DemoJobRecord[];
    existingApplications: DemoApplicationRecord[];
    query: string;
    cityFilter: string;
    experienceFilter: string;
    sourceFilter: string;
    minFitFilter: string;
    salaryFilter: string;
    availabilityFilter: string;
}) {
    const files = storageInsight?.storageFiles ?? [];
    const existingResumePaths = new Set(existingApplications.map((application) => application.resume_path).filter(Boolean));
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCity = cityFilter.trim().toLowerCase();
    const minFit = minFitFilter === "all" ? 0 : Number(minFitFilter);

    const profiles = files
        .filter((file) => !existingResumePaths.has(file.path))
        .filter((file) => !normalizedQuery || getStorageProfileSearchText(file).includes(normalizedQuery))
        .filter((file) => sourceFilter === "all" || getResumeSourceLabel(file.folder, file.source) === sourceFilter)
        .filter((file) => isDatabaseExperienceMatch(getStorageProfileExperience(file), experienceFilter))
        .filter((file) => isDatabaseSalaryMatch(file, salaryFilter))
        .filter((file) => isDatabaseAvailabilityMatch(file, availabilityFilter))
        .map((file) => {
            const matches = (jobs.length ? jobs : [null]).map((job) => ({
                job,
                fit: scoreResumeProfileForJob(file, job),
            }));
            const best = matches.sort((a, b) => b.fit - a.fit)[0] ?? { job: null, fit: 35 };
            return {
                id: file.path,
                candidateName: getStorageProfileName(file),
                fileName: file.originalFileName || file.fileName,
                path: file.path,
                role: getStorageProfileRole(file),
                city: getStorageProfileCity(file),
                experience: getStorageProfileExperience(file),
                source: getResumeSourceLabel(file.folder, file.source),
                fit: best.fit,
                matchedJob: best.job,
                uploadedAt: file.uploadedAt ?? "",
            } satisfies RecruiterDatabaseProfile;
        })
        .filter((profile) => !normalizedCity || profile.city.toLowerCase().includes(normalizedCity))
        .filter((profile) => profile.fit >= minFit)
        .sort((a, b) => b.fit - a.fit || (a.uploadedAt < b.uploadedAt ? 1 : -1));

    const deduped = new Map<string, RecruiterDatabaseProfile>();
    for (const profile of profiles) {
        const key = getDatabaseProfileDuplicateKey(profile);
        const existing = deduped.get(key);
        if (!existing || profile.fit > existing.fit || profile.uploadedAt > existing.uploadedAt) {
            deduped.set(key, profile);
        }
    }

    return [...deduped.values()]
        .sort((a, b) => b.fit - a.fit || (a.uploadedAt < b.uploadedAt ? 1 : -1))
        .slice(0, 20);
}

function normalizeDatabaseMatchText(value: string | null | undefined) {
    return (value ?? "").toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").trim();
}

function getDatabaseKeywordOverlap(left: string, right: string) {
    const ignored = new Set(["and", "the", "for", "with", "resume", "profile", "candidate", "years", "year"]);
    const leftWords = new Set(left.split(/\s+/).filter((word) => word.length >= 3 && !ignored.has(word)));
    const rightWords = new Set(right.split(/\s+/).filter((word) => word.length >= 3 && !ignored.has(word)));
    return [...leftWords].filter((word) => rightWords.has(word)).length;
}

function getDatabaseExperienceYears(value: string | null | undefined) {
    const text = value ?? "";
    if (/fresher|fresh|0\s*(?:year|yr)|less than 1/i.test(text)) return 0;
    const yearMatch = text.match(/(\d{1,2})(?:\+)?\s*(?:years?|yrs?|yr)/i);
    if (yearMatch) return Number(yearMatch[1]);
    const plainNumber = text.match(/\b(\d{1,2})(?:\+)?\b/);
    return plainNumber ? Number(plainNumber[1]) : null;
}

function isDatabaseExperienceMatch(experience: string, filter: string) {
    if (filter === "all") return true;
    const years = getDatabaseExperienceYears(experience);
    if (filter === "Fresher") return years === 0 || /fresher|fresh/i.test(experience);
    if (filter === "1+ years") return years !== null && years >= 1;
    if (filter === "3+ years") return years !== null && years >= 3;
    if (filter === "5+ years") return years !== null && years >= 5;
    return true;
}

function getDatabaseProfileDuplicateKey(profile: RecruiterDatabaseProfile) {
    const name = normalizeDatabaseMatchText(profile.candidateName);
    const city = normalizeDatabaseMatchText(profile.city);
    const role = normalizeDatabaseMatchText(profile.role);
    if (name && name !== "candidate profile") return `${name}|${city}|${role}`;
    return profile.fileName.toLowerCase().replace(/^\d{10,}[-_]+/, "").replace(/[-_]+[0-9a-f-]{12,}/i, "");
}

function getCandidateMessage(application: RecruiterApplicationView) {
    const text = application.cover_letter ?? "";
    const messageMatch = text.match(/candidate message:\s*([\s\S]*)/i);
    if (messageMatch?.[1]?.trim()) return messageMatch[1].trim();
    return text
        .split("\n")
        .filter((line) => !/^\s*(candidate city|total experience|resume name|resume email|resume phone|resume city|resume last role|resume companies|resume skills|resume education|resume notice period|resume current ctc|resume expected ctc|resume languages|resume summary|resume job gaps|resume role fit|recruiter recommendation|resume parse confidence|resume parse source|resume file|resume path|resume uploaded at|unlock|admin log):/i.test(line))
        .join("\n")
        .trim();
}

function getRecruiterRecommendation(application: RecruiterApplicationView) {
    const parsed = getParsedResumeSummary(application);
    if (parsed.recommendation) return parsed.recommendation;
    if (application.fit >= 82) return "Call now";
    if (application.fit < 45) return "Not ready";
    const skills = [...(parsed.skills ?? []), ...(application.ai_matched_skills ?? [])].join(" ").toLowerCase();
    if (/bpo|telecall|calling|customer/.test(skills)) return "Good for BPO";
    if (/sales|lead generation|negotiation/.test(skills)) return "Good for sales";
    if (/counselling|counsel/.test(skills)) return "Good for counselling";
    return "Needs training";
}

function RecruiterDatabaseProfileCard({
    profile,
    requesting = false,
    onAddToJob,
    onRequestUnlock,
}: {
    profile: RecruiterDatabaseProfile;
    requesting?: boolean;
    onAddToJob?: (profile: RecruiterDatabaseProfile) => void;
    onRequestUnlock?: (profile: RecruiterDatabaseProfile) => void | Promise<void>;
}) {
    const fitTone = profile.fit >= 80 ? "text-[#1C7A48]" : profile.fit >= 68 ? "text-[#8A5A00]" : "text-[#A32D2D]";
    const previewRows = [
        { label: "Experience", value: profile.experience, icon: <Briefcase className="h-3.5 w-3.5" /> },
        { label: "City", value: profile.city, icon: <MapPin className="h-3.5 w-3.5" /> },
        { label: "Phone", value: "xxxxxx----", icon: <Phone className="h-3.5 w-3.5" /> },
        { label: "Email", value: "hidden until approval", icon: <Mail className="h-3.5 w-3.5" /> },
    ];
    return (
        <article className="rounded-2xl border border-[#D8E6FF] bg-white p-4 shadow-[0_14px_36px_-30px_rgba(61,90,254,0.45)]">
            <div className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0">
                    <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#EEEDE7" strokeWidth="5" />
                        <circle cx="22" cy="22" r="18" fill="none" stroke={profile.fit >= 80 ? "#2FBF71" : profile.fit >= 68 ? "#F5A623" : "#E2504A"} strokeWidth="5" strokeDasharray={`${profile.fit * 1.13} 113`} strokeLinecap="round" />
                    </svg>
                    <span className={`absolute inset-0 grid place-items-center font-display text-sm font-black ${fitTone}`}>{profile.fit}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-black text-[#171B2B]">{profile.candidateName}</h3>
                            <p className="mt-0.5 text-xs font-semibold text-[#5B6172]">
                                {profile.role} · {profile.matchedJob?.role ?? "Best matching role"}
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-1 sm:items-end">
                            <span className="rounded-full bg-[#DCE1FF] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#1A2FAE] ring-1 ring-[#C8D2FF]">Database profile</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7E7] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#8A5A00]">
                                <LockKeyhole className="h-3 w-3" />
                                Resume locked
                            </span>
                        </div>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {previewRows.map((row) => (
                            <div key={row.label} className="rounded-xl bg-[#F6F5F1] px-3 py-2 ring-1 ring-[#E4E2DA]">
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#8A8F9E]">
                                    {row.icon}
                                    {row.label}
                                </div>
                                <p className="mt-1 truncate text-xs font-black text-[#171B2B]">{row.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#F6F5F1] px-3 py-1.5 text-xs font-black text-[#5B6172] ring-1 ring-[#E4E2DA]">{profile.source}</span>
                        <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#EEF3FF] px-3 py-1.5 text-xs font-black text-[#1A2FAE] ring-1 ring-[#D8E6FF]">
                            <FileClock className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{profile.fileName}</span>
                        </span>
                        <button
                            type="button"
                            onClick={() => onAddToJob?.(profile)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#0F1424] px-3 py-1.5 text-xs font-black text-white transition hover:bg-[#171E33]"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add to Job
                        </button>
                        <button
                            type="button"
                            disabled={requesting || !profile.matchedJob}
                            onClick={() => void onRequestUnlock?.(profile)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#FFF7E7] px-3 py-1.5 text-xs font-black text-[#8A5A00] ring-1 ring-[#FCEBCB] transition hover:bg-[#FCEBCB] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <LockKeyhole className="h-3.5 w-3.5" />
                            {requesting ? "Sending request..." : "Request unlock from admin"}
                        </button>
                    </div>
                    <p className="mt-3 text-[11px] font-bold text-[#5B6172]">
                        Database → Shortlisted for Job → Candidate consent/contact → Recruiter Pipeline
                    </p>
                </div>
            </div>
        </article>
    );
}

function RecruiterCandidateCard({
    application,
    compact = false,
    unlockRequested = false,
    onStatusChange,
    onRequestUnlock,
    onOpen,
    onFitBreakdown,
    onReject,
}: {
    application: RecruiterApplicationView;
    compact?: boolean;
    unlockRequested?: boolean;
    onStatusChange?: (applicationId: string, status: string) => void | Promise<void>;
    onRequestUnlock?: (application: RecruiterApplicationView) => void;
    onOpen?: (application: RecruiterApplicationView) => void;
    onFitBreakdown?: (application: RecruiterApplicationView) => void;
    onReject?: (application: RecruiterApplicationView) => void;
}) {
    const fitTone = application.fit >= 80 ? "text-[#1C7A48]" : application.fit >= 68 ? "text-[#8A5A00]" : "text-[#A32D2D]";
    const locked = !isProfileSharingApproved(application);
    const city = extractCity(application);
    const candidateExperience = extractCandidateExperience(application);
    const parsedResume = getParsedResumeSummary(application);
    const recommendation = getRecruiterRecommendation(application);
    const matchReasons = getCandidateMatchReasons(application);
    const phoneDigits = (application.phone ?? parsedResume.phone ?? "").replace(/[^\d]/g, "");
    const whatsappUrl = phoneDigits ? `https://wa.me/${phoneDigits.startsWith("91") ? phoneDigits : `91${phoneDigits}`}` : "";
    const visibleSkills = application.ai_matched_skills?.length
        ? application.ai_matched_skills
        : parsedResume.skills.length
            ? parsedResume.skills
            : application.job?.required_skills ?? application.job?.tags ?? [];
    const previewRows = [
        { label: "Experience", value: candidateExperience, icon: <Briefcase className="h-3.5 w-3.5" /> },
        { label: "City", value: city, icon: <MapPin className="h-3.5 w-3.5" /> },
        { label: "Current", value: parsedResume.currentCtc || "Unknown", icon: <Wallet className="h-3.5 w-3.5" /> },
        { label: "Expected", value: parsedResume.expectedCtc || "Unknown", icon: <Wallet className="h-3.5 w-3.5" /> },
        { label: "Notice", value: parsedResume.noticePeriod || "Unknown", icon: <Clock3 className="h-3.5 w-3.5" /> },
        { label: "Languages", value: parsedResume.languages.length ? parsedResume.languages.join(" + ") : "Unknown", icon: <Languages className="h-3.5 w-3.5" /> },
        { label: "Phone", value: locked ? maskPhoneLast4(application.phone) : application.phone || "Not shared", icon: <Phone className="h-3.5 w-3.5" /> },
        { label: "Email", value: locked ? maskEmail(application.email) : application.email, icon: <Mail className="h-3.5 w-3.5" /> },
    ];
    return (
        <article className="rounded-2xl border border-[#E4E2DA] bg-white p-4">
            <div className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0">
                    <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#EEEDE7" strokeWidth="5" />
                        <circle cx="22" cy="22" r="18" fill="none" stroke={application.fit >= 80 ? "#2FBF71" : application.fit >= 68 ? "#F5A623" : "#E2504A"} strokeWidth="5" strokeDasharray={`${application.fit * 1.13} 113`} strokeLinecap="round" />
                    </svg>
                    <button
                        type="button"
                        onClick={() => onFitBreakdown?.(application)}
                        className={`absolute inset-0 grid place-items-center rounded-full font-display text-sm font-black ${fitTone}`}
                        aria-label="Show fit score breakdown"
                    >
                        {application.fit}
                    </button>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-black text-[#171B2B]">{application.full_name}</h3>
                            <p className="mt-0.5 text-xs font-semibold text-[#5B6172]">{application.job?.role ?? "Role"} · {application.job?.location ?? "Location open"}</p>
                            <button type="button" onClick={() => onFitBreakdown?.(application)} className="mt-1 inline-flex items-center gap-1 text-xs font-black text-[#1A2FAE]">
                                <Star className="h-3.5 w-3.5 fill-[#1A2FAE]" />
                                {application.fit}% Match
                            </button>
                        </div>
                        <div className="flex flex-col items-start gap-1 sm:items-end">
                            <span className="rounded-full bg-[#F6F5F1] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#5B6172] ring-1 ring-[#E4E2DA]">{recruiterStage(application.status)}</span>
                            <span className="rounded-full bg-[#DCE1FF] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#1A2FAE] ring-1 ring-[#C8D2FF]">{recommendation}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${locked ? "bg-[#FFF7E7] text-[#8A5A00]" : "bg-[#DBF3E5] text-[#1C7A48]"}`}>
                                {locked ? <LockKeyhole className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                {locked ? "Locked" : "Unlocked"}
                            </span>
                        </div>
                    </div>
                    {!compact && (
                        <>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                {previewRows.map((row) => (
                                    <div key={row.label} className="rounded-xl bg-[#F6F5F1] px-3 py-2 ring-1 ring-[#E4E2DA]">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#8A8F9E]">
                                            {row.icon}
                                            {row.label}
                                        </div>
                                        <p className="mt-1 truncate text-xs font-black text-[#171B2B]">{row.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {visibleSkills.slice(0, 4).map((skill) => (
                                    <span key={skill} className="rounded-full bg-[#F6F5F1] px-2 py-1 text-[11px] font-bold text-[#5B6172] ring-1 ring-[#E4E2DA]">{skill}</span>
                                ))}
                            </div>
                            {application.ai_match_reason && (
                                <p className="mt-3 rounded-xl bg-[#F6F5F1] px-3 py-2 text-xs font-semibold leading-5 text-[#5B6172]">
                                    {application.ai_match_reason}
                                </p>
                            )}
                            <div className="mt-3 rounded-xl border border-[#E4E2DA] bg-[#FBFAF6] p-3">
                                <p className="text-xs font-black text-[#171B2B]">Why this candidate matches</p>
                                <div className="mt-2 grid gap-1.5 text-xs font-bold text-[#5B6172] sm:grid-cols-2">
                                    {matchReasons.map((reason) => (
                                        <span key={reason} className="inline-flex items-center gap-1">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#2FBF71]" />
                                            {reason}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <ActionButton tone="neutral" onClick={() => onOpen?.(application)}>Details</ActionButton>
                                {!locked && application.phone && <a href={`tel:${application.phone}`} className="rounded-full bg-[#0F1424] px-3 py-1.5 text-xs font-black text-white">Call</a>}
                                {!locked && whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener" className="rounded-full bg-[#DBF3E5] px-3 py-1.5 text-xs font-black text-[#1C7A48]">WhatsApp</a>}
                                {application.resume_url && !locked ? (
                                    <a href={application.resume_url} target="_blank" rel="noopener" className="rounded-full bg-[#F6F5F1] px-3 py-1.5 text-xs font-black text-[#171B2B] ring-1 ring-[#E4E2DA] transition hover:bg-white">Resume</a>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EEEDE7] px-3 py-1.5 text-xs font-black text-[#5B6172]">
                                        {locked ? <LockKeyhole className="h-3.5 w-3.5" /> : null}
                                        {locked ? "Resume locked" : "No resume"}
                                    </span>
                                )}
                                {!locked && <a href={`mailto:${application.email}`} className="rounded-full bg-[#DCE1FF] px-3 py-1.5 text-xs font-black text-[#1A2FAE]">Email</a>}
                                {locked && (
                                    <ActionButton tone="warning" onClick={() => onRequestUnlock?.(application)}>
                                        {unlockRequested ? "Unblock requested" : "Request to unblock profile"}
                                    </ActionButton>
                                )}
                                <ActionButton tone="success" disabled={locked} onClick={() => void onStatusChange?.(application.id, "shortlisted")}>Shortlist</ActionButton>
                                <ActionButton tone="success" disabled={locked} onClick={() => void onStatusChange?.(application.id, "interview")}>Schedule Interview</ActionButton>
                                <ActionButton tone="danger" onClick={() => onReject?.(application)}>Reject</ActionButton>
                            </div>
                        </>
                    )}
                    {compact && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            <ActionButton tone="neutral" onClick={() => onOpen?.(application)}>Details</ActionButton>
                            <ActionButton tone="neutral" onClick={() => onFitBreakdown?.(application)}>Why {application.fit}%?</ActionButton>
                            {locked && <span className="rounded-full bg-[#FFF7E7] px-3 py-1.5 text-xs font-black text-[#8A5A00]">Resume locked</span>}
                            {locked && (
                                <ActionButton tone="warning" onClick={() => onRequestUnlock?.(application)}>
                                    {unlockRequested ? "Requested" : "Request unblock"}
                                </ActionButton>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

function CandidateDetailDrawer({
    application,
    onClose,
    onStatusChange,
    unlockRequested = false,
    onRequestUnlock,
    onFitBreakdown,
    onReject,
}: {
    application: RecruiterApplicationView;
    onClose: () => void;
    onStatusChange: (applicationId: string, status: string) => void | Promise<void>;
    unlockRequested?: boolean;
    onRequestUnlock?: (application: RecruiterApplicationView) => void;
    onFitBreakdown?: (application: RecruiterApplicationView) => void;
    onReject?: (application: RecruiterApplicationView) => void;
}) {
    const noteKey = `careersync-recruiter-note-${application.id}`;
    const [note, setNote] = useState(() => (typeof window === "undefined" ? "" : window.localStorage.getItem(noteKey) ?? ""));
    const locked = !isProfileSharingApproved(application);
    const sharingStatus = getProfileSharingStatus(application);
    const city = extractCity(application);
    const candidateExperience = extractCandidateExperience(application);
    const candidateMessage = getCandidateMessage(application);
    const parsedResume = getParsedResumeSummary(application);
    const recommendation = getRecruiterRecommendation(application);
    const phoneDigits = (application.phone ?? "").replace(/[^\d]/g, "");
    const whatsappUrl = phoneDigits ? `https://wa.me/${phoneDigits.startsWith("91") ? phoneDigits : `91${phoneDigits}`}` : "";
    const moveCandidate = (status: string) => {
        void Promise.resolve(onStatusChange(application.id, status)).then(() => onClose());
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(noteKey, note);
    }, [note, noteKey]);

    const timeline = getApplicationTimeline(application);

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0F1424]/45 p-3 backdrop-blur-sm sm:p-5">
            <button type="button" aria-label="Close candidate details" className="absolute inset-0 cursor-default" onClick={onClose} />
            <aside className="relative flex h-full w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-[#E4E2DA] p-5">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${sharingStatus.tone}`}>
                                {locked ? <LockKeyhole className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                {sharingStatus.label}
                            </span>
                            <span className="rounded-full bg-[#F6F5F1] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#5B6172] ring-1 ring-[#E4E2DA]">{recruiterStage(application.status)}</span>
                        </div>
                        <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-[#171B2B]">{application.full_name}</h2>
                        <p className="mt-1 text-sm font-semibold text-[#5B6172]">{application.job?.role ?? "Applied role"} · {application.job?.company ?? "Company"} · {application.job?.location ?? "Location open"}</p>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F6F5F1] text-[#5B6172] ring-1 ring-[#E4E2DA] transition hover:bg-white hover:text-[#171B2B]">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <button type="button" onClick={() => onFitBreakdown?.(application)} className="text-left">
                            <ProfileMetric label="Fit score" value={`${application.fit}%`} />
                        </button>
                        <ProfileMetric label="Experience" value={candidateExperience} />
                        <ProfileMetric label="City" value={city} />
                    </div>

                    <section className="mt-5 rounded-2xl border border-[#E4E2DA] bg-[#F6F5F1] p-4">
                        <h3 className="text-sm font-black text-[#171B2B]">Candidate details</h3>
                        <div className="mt-3 grid gap-2 text-sm font-semibold text-[#5B6172]">
                            <CandidateInfoRow icon={<UserRound className="h-4 w-4" />} label="Name" value={application.full_name} />
                            <CandidateInfoRow icon={<MapPin className="h-4 w-4" />} label="City" value={city} />
                            <CandidateInfoRow icon={<Briefcase className="h-4 w-4" />} label="Total experience" value={candidateExperience} />
                            <CandidateInfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={locked ? maskEmail(application.email) : application.email} locked={locked} />
                            <CandidateInfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={locked ? maskPhoneLast4(application.phone) : application.phone || "Not provided"} locked={locked} />
                            <CandidateInfoRow icon={<Briefcase className="h-4 w-4" />} label="Role interest" value={application.job?.role ?? "Not mapped"} />
                            <CandidateInfoRow icon={<CalendarDays className="h-4 w-4" />} label="Applied on" value={new Date(application.created_at).toLocaleDateString("en-IN")} />
                        </div>
                    </section>

                    <section className="mt-5 rounded-2xl border border-[#E4E2DA] bg-white p-4">
                        <h3 className="text-sm font-black text-[#171B2B]">Resume intelligence</h3>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <CandidateInfoRow icon={<ShieldCheck className="h-4 w-4" />} label="Shortlist signal" value={recommendation} />
                            <CandidateInfoRow icon={<BarChart3 className="h-4 w-4" />} label="Parse confidence" value={parsedResume.confidence ? `${parsedResume.confidence}% (${parsedResume.source || "parser"})` : "Not detected"} />
                            <CandidateInfoRow icon={<Briefcase className="h-4 w-4" />} label="Last role" value={parsedResume.lastRole || "Not detected"} />
                            <CandidateInfoRow icon={<Clock3 className="h-4 w-4" />} label="Notice period" value={parsedResume.noticePeriod || "Not detected"} />
                            <CandidateInfoRow icon={<Briefcase className="h-4 w-4" />} label="Current CTC" value={parsedResume.currentCtc || "Not detected"} />
                            <CandidateInfoRow icon={<Briefcase className="h-4 w-4" />} label="Expected CTC" value={parsedResume.expectedCtc || "Not detected"} />
                        </div>
                        {parsedResume.summary && (
                            <p className="mt-4 rounded-xl bg-[#F6F5F1] px-3 py-2 text-xs font-semibold leading-5 text-[#5B6172]">{parsedResume.summary}</p>
                        )}
                        <ResumeChipGroup label="Skills picked from resume" items={parsedResume.skills} empty="No clear skills detected." />
                        <ResumeChipGroup label="Company history" items={parsedResume.companies} empty="No company names detected." />
                        <ResumeChipGroup label="Education" items={parsedResume.education} empty="No education lines detected." />
                        <ResumeChipGroup label="Role fit" items={parsedResume.roleFit} empty="No role fit detected." />
                        <ResumeChipGroup label="Possible job gaps" items={parsedResume.jobGaps} empty="No clear gaps detected." />
                        <ResumeChipGroup label="Languages" items={parsedResume.languages} empty="No languages detected." />
                    </section>

                    <section className="mt-5 rounded-2xl border border-[#E4E2DA] bg-white p-4">
                        <h3 className="text-sm font-black text-[#171B2B]">Resume access</h3>
                        {locked ? (
                            <div className="mt-3 rounded-xl bg-[#FFF7E7] p-3 text-sm font-semibold leading-6 text-[#8A5A00]">
                                <div className="flex items-start gap-2">
                                    <LockKeyhole className="mt-1 h-4 w-4 shrink-0" />
                                    <span>Resume and full contact details are locked until CareerSync admin approves profile sharing.</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRequestUnlock?.(application)}
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0F1424] px-3 py-2 text-xs font-black text-white transition hover:bg-[#171E33]"
                                >
                                    <Unlock className="h-3.5 w-3.5" />
                                    {unlockRequested ? "Unblock request sent" : "Request for unblock the profile"}
                                </button>
                            </div>
                        ) : application.resume_url ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                <a href={application.resume_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-[#DCE1FF] px-3 py-2 text-xs font-black text-[#1A2FAE]">
                                    <Eye className="h-3.5 w-3.5" />
                                    View resume
                                </a>
                                <a href={application.resume_url} download className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F5F1] px-3 py-2 text-xs font-black text-[#171B2B] ring-1 ring-[#E4E2DA]">
                                    <Download className="h-3.5 w-3.5" />
                                    Download
                                </a>
                            </div>
                        ) : (
                            <p className="mt-3 rounded-xl bg-[#F6F5F1] p-3 text-sm font-semibold text-[#5B6172]">No resume uploaded for this application.</p>
                        )}
                    </section>

                    <section className="mt-5 rounded-2xl border border-[#E4E2DA] bg-white p-4">
                        <h3 className="text-sm font-black text-[#171B2B]">Screening notes</h3>
                        <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-[#5B6172]">{candidateMessage || "No candidate message added with this application."}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {(application.ai_matched_skills?.length ? application.ai_matched_skills : parsedResume.skills.length ? parsedResume.skills : application.job?.required_skills ?? application.job?.tags ?? []).slice(0, 6).map((skill) => (
                                <span key={skill} className="rounded-full bg-[#DBF3E5] px-2.5 py-1 text-[11px] font-black text-[#1C7A48]">{skill}</span>
                            ))}
                        </div>
                        {application.ai_missing_skills?.length ? (
                            <p className="mt-3 text-xs font-semibold text-[#A32D2D]">Weak areas: {application.ai_missing_skills.slice(0, 5).join(", ")}</p>
                        ) : null}
                        <textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Add recruiter note for call, screening, or follow-up..."
                            className="mt-4 min-h-24 w-full rounded-xl border border-[#E4E2DA] bg-[#F6F5F1] px-3 py-2 text-sm font-semibold outline-none transition focus:border-[#3D5AFE] focus:bg-white"
                        />
                    </section>

                    <section className="mt-5 rounded-2xl border border-[#E4E2DA] bg-white p-4">
                        <h3 className="text-sm font-black text-[#171B2B]">Activity timeline</h3>
                        <div className="mt-4 space-y-3">
                            {timeline.map((item) => (
                                <div key={item.title} className="flex gap-3">
                                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.done ? "bg-[#2FBF71]" : "bg-[#F5A623]"}`} />
                                    <div>
                                        <p className="text-sm font-black text-[#171B2B]">{item.title}</p>
                                        <p className="mt-0.5 text-xs font-semibold leading-5 text-[#5B6172]">{item.text}</p>
                                        <p className="mt-0.5 text-[11px] font-semibold text-[#8A8F9E]">{new Date(item.date).toLocaleString("en-IN")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="border-t border-[#E4E2DA] bg-[#F6F5F1] p-4">
                    <div className="flex flex-wrap gap-2">
                        {!locked && application.phone && (
                            <a href={`tel:${application.phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#0F1424] px-3 py-2 text-xs font-black text-white">
                                <Phone className="h-3.5 w-3.5" />
                                Call now
                            </a>
                        )}
                        {!locked && whatsappUrl && (
                            <a href={whatsappUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-[#DBF3E5] px-3 py-2 text-xs font-black text-[#1C7A48]">
                                <MessageSquareText className="h-3.5 w-3.5" />
                                WhatsApp
                            </a>
                        )}
                        {locked && (
                            <ActionButton tone="warning" onClick={() => onRequestUnlock?.(application)}>
                                {unlockRequested ? "Unblock requested" : "Request for unblock the profile"}
                            </ActionButton>
                        )}
                        <ActionButton tone="neutral" disabled={locked} onClick={() => moveCandidate("screening")}>Move to screening</ActionButton>
                        <ActionButton tone="success" disabled={locked} onClick={() => moveCandidate("shortlisted")}>Shortlist</ActionButton>
                        <ActionButton tone="success" disabled={locked} onClick={() => moveCandidate("interview")}>Schedule interview</ActionButton>
                        <ActionButton tone="danger" onClick={() => onReject?.(application)}>Reject</ActionButton>
                    </div>
                </div>
            </aside>
        </div>
    );
}

function CandidateInfoRow({ icon, label, value, locked = false }: { icon: ReactNode; label: string; value: string; locked?: boolean }) {
    return (
        <div className="flex items-start gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-[#E4E2DA]">
            <span className="mt-0.5 text-[#5B6172]">{locked ? <LockKeyhole className="h-4 w-4" /> : icon}</span>
            <span>
                <span className="block text-[11px] font-black uppercase tracking-wide text-[#8A8F9E]">{label}</span>
                <span className="block break-words text-sm font-bold text-[#171B2B]">{value}</span>
            </span>
        </div>
    );
}

function ResumeChipGroup({ label, items, empty }: { label: string; items: string[]; empty: string }) {
    return (
        <div className="mt-4">
            <p className="text-[11px] font-black uppercase tracking-wide text-[#8A8F9E]">{label}</p>
            {items.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {items.slice(0, 8).map((item) => (
                        <span key={item} className="rounded-full bg-[#F6F5F1] px-2.5 py-1 text-[11px] font-black text-[#5B6172] ring-1 ring-[#E4E2DA]">
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="mt-2 rounded-xl bg-[#F6F5F1] px-3 py-2 text-xs font-semibold text-[#8A8F9E]">{empty}</p>
            )}
        </div>
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

function CandidateWorkspace({ userId, snapshot, activeSection }: { userId: string; snapshot: ReturnType<typeof useDemoSnapshot>; activeSection: string }) {
    const candidateUser = snapshot.users.find((user) => user.id === userId);
    const savedJobIds = getDemoSavedJobIds(userId);
    const approvedJobs = snapshot.jobs.filter((job) => job.status === "approved" && job.is_active && job.is_verified);
    const myApplications = snapshot.applications
        .filter((application) => application.user_id === userId)
        .map((application) => ({
            ...application,
            job: snapshot.jobs.find((job) => job.id === application.job_id),
        }))
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    const myNotifications = getDemoNotificationsForUser(userId);
    const savedJobs = approvedJobs.filter((job) => savedJobIds.includes(job.id));
    const candidateProgress = getCareerSyncCandidateProgress(userId);
    const activeApplications = myApplications.filter((application) => !RECRUITER_CLOSED_STAGES.includes(recruiterStage(application.status) as (typeof RECRUITER_CLOSED_STAGES)[number]));
    const interviewApplications = myApplications.filter((application) => ["Interview", "Selected", "Offered"].includes(recruiterStage(application.status)));
    const latestApplication = myApplications[0] ?? null;
    const latestResumeApplication = myApplications.find((application) => application.resume_url || application.resume_path) ?? null;
    const candidateProfileDefaults = useMemo<CandidateProfileDetails>(() => {
        const parsed = latestApplication ? getParsedResumeSummary(latestApplication) : null;
        const latestProfile = latestApplication ? latestApplication as RecruiterApplicationView : null;
        const latestResumeName = latestResumeApplication
            ? getApplicationMetaLine(latestResumeApplication, "Resume File") || latestResumeApplication.resume_path?.split("/").pop() || "Current resume"
            : "";
        return {
            fullName: parsed?.name || latestApplication?.full_name || candidateUser?.full_name || getDemoDisplayName(userId),
            headline: parsed?.lastRole || latestApplication?.job?.role || "Candidate profile",
            email: parsed?.email || latestApplication?.email || candidateUser?.email || "",
            phone: parsed?.phone || latestApplication?.phone || candidateUser?.phone || "",
            city: latestProfile ? extractCity(latestProfile) : "",
            experience: latestProfile ? extractCandidateExperience(latestProfile) : "",
            currentlyWorking: "",
            currentCompany: parsed?.companies?.[0] || "",
            workingSince: "",
            previousCompany: parsed?.companies?.[1] || "",
            noticePeriod: parsed?.noticePeriod || "",
            preferredCities: latestProfile ? extractCity(latestProfile) : "",
            languages: parsed?.languages?.join(", ") || "",
            skills: parsed?.skills?.join(", ") || "",
            currentSalary: parsed?.currentCtc || "",
            expectedSalary: parsed?.expectedCtc || "",
            preferredRole: parsed?.lastRole || latestApplication?.job?.role || "",
            workMode: "",
            summary: parsed?.summary || "",
            resumeName: latestResumeName,
            resumeUrl: latestResumeApplication?.resume_url || "",
            resumePath: latestResumeApplication?.resume_path || "",
            resumeUpdatedAt: latestResumeApplication?.updated_at || latestResumeApplication?.created_at || "",
        };
    }, [candidateUser?.email, candidateUser?.full_name, candidateUser?.phone, latestApplication, latestResumeApplication, userId]);
    const candidateProfileStorageKey = `careersync-candidate-profile-${userId}`;
    const [candidateProfileDraft, setCandidateProfileDraft] = useState<CandidateProfileDetails>(candidateProfileDefaults);
    const [candidateProfileSaved, setCandidateProfileSaved] = useState<CandidateProfileDetails>(candidateProfileDefaults);
    const [candidateProfileEditing, setCandidateProfileEditing] = useState(false);
    const [candidateResumeUploading, setCandidateResumeUploading] = useState(false);
    const [candidateResumeUploadMessage, setCandidateResumeUploadMessage] = useState("");
    useEffect(() => {
        if (candidateProfileEditing) return;
        if (typeof window === "undefined") {
            setCandidateProfileDraft(candidateProfileDefaults);
            setCandidateProfileSaved(candidateProfileDefaults);
            return;
        }
        const storedProfile = window.localStorage.getItem(candidateProfileStorageKey);
        if (!storedProfile) {
            setCandidateProfileDraft(candidateProfileDefaults);
            setCandidateProfileSaved(candidateProfileDefaults);
            return;
        }
        try {
            const mergedProfile = { ...candidateProfileDefaults, ...JSON.parse(storedProfile) };
            setCandidateProfileDraft(mergedProfile);
            setCandidateProfileSaved(mergedProfile);
        } catch {
            setCandidateProfileDraft(candidateProfileDefaults);
            setCandidateProfileSaved(candidateProfileDefaults);
        }
    }, [candidateProfileDefaults, candidateProfileEditing, candidateProfileStorageKey]);
    const updateCandidateProfileDraft = (field: keyof CandidateProfileDetails, value: string) => {
        setCandidateProfileDraft((current) => ({ ...current, [field]: value }));
    };
    const persistCandidateProfile = (profile: CandidateProfileDetails) => {
        setCandidateProfileDraft(profile);
        setCandidateProfileSaved(profile);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(candidateProfileStorageKey, JSON.stringify(profile));
            window.dispatchEvent(new CustomEvent("careersync-candidate-profile-updated"));
        }
    };
    const liveCandidateProgress = useMemo(() => {
        const hasName = candidateProfileDraft.fullName.trim().length > 1;
        const hasPhone = candidateProfileDraft.phone.replace(/\D/g, "").length >= 8;
        const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateProfileDraft.email.trim());
        const hasCity = candidateProfileDraft.city.trim().length > 1 && candidateProfileDraft.city.trim().toLowerCase() !== "not shared";
        const hasExperience = candidateProfileDraft.experience.trim().length > 0 && candidateProfileDraft.experience.trim().toLowerCase() !== "not shared";
        const hasResume = candidateProgress.hasResume || Boolean(candidateProfileDraft.resumeUrl || candidateProfileDraft.resumePath);
        const hasNoticePeriod = candidateProfileDraft.noticePeriod.trim().length > 0;
        const hasPreferredCities = candidateProfileDraft.preferredCities.trim().length > 0;
        const hasLanguages = candidateProfileDraft.languages.trim().length > 0;
        const hasSkills = candidateProfileDraft.skills.trim().length > 0;
        const hasEmploymentStatus = candidateProfileDraft.currentlyWorking.trim().length > 0;
        const completion =
            (hasName ? 10 : 0) +
            (hasPhone ? 10 : 0) +
            (hasEmail ? 10 : 0) +
            (hasCity ? 10 : 0) +
            (hasExperience ? 15 : 0) +
            (hasResume ? 15 : 0) +
            (candidateProgress.totalApplications > 0 ? 10 : 0) +
            (hasEmploymentStatus ? 5 : 0) +
            (hasNoticePeriod ? 5 : 0) +
            (hasPreferredCities ? 5 : 0) +
            (hasLanguages ? 5 : 0) +
            (hasSkills ? 5 : 0);
        return {
            ...candidateProgress,
            hasResume,
            profileCompletion: Math.max(0, Math.min(100, completion)),
            hasName,
            hasPhone,
            hasEmail,
            hasCity,
            hasExperience,
            hasEmploymentStatus,
            hasNoticePeriod,
            hasPreferredCities,
            hasLanguages,
            hasSkills,
        };
    }, [candidateProfileDraft, candidateProgress]);
    const saveCandidateProfileDraft = () => {
        const normalizedProfile = {
            fullName: candidateProfileDraft.fullName.trim() || candidateProfileDefaults.fullName,
            headline: candidateProfileDraft.headline.trim() || candidateProfileDefaults.headline,
            email: candidateProfileDraft.email.trim(),
            phone: candidateProfileDraft.phone.trim(),
            city: candidateProfileDraft.city.trim(),
            experience: candidateProfileDraft.experience.trim(),
            currentlyWorking: candidateProfileDraft.currentlyWorking.trim(),
            currentCompany: candidateProfileDraft.currentCompany.trim(),
            workingSince: candidateProfileDraft.workingSince.trim(),
            previousCompany: candidateProfileDraft.previousCompany.trim(),
            noticePeriod: candidateProfileDraft.noticePeriod.trim(),
            preferredCities: candidateProfileDraft.preferredCities.trim(),
            languages: candidateProfileDraft.languages.trim(),
            skills: candidateProfileDraft.skills.trim(),
            currentSalary: candidateProfileDraft.currentSalary.trim(),
            expectedSalary: candidateProfileDraft.expectedSalary.trim(),
            preferredRole: candidateProfileDraft.preferredRole.trim(),
            workMode: candidateProfileDraft.workMode.trim(),
            summary: candidateProfileDraft.summary.trim(),
            resumeName: candidateProfileDraft.resumeName.trim(),
            resumeUrl: candidateProfileDraft.resumeUrl.trim(),
            resumePath: candidateProfileDraft.resumePath.trim(),
            resumeUpdatedAt: candidateProfileDraft.resumeUpdatedAt.trim(),
        };
        persistCandidateProfile(normalizedProfile);
        setCandidateProfileEditing(false);
        toast.success("Candidate profile updated.");
    };
    const handleCandidateLatestResume = async (file: File | null) => {
        if (!file) return;
        const isAllowedFile = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type) || /\.(pdf|docx?)$/i.test(file.name);
        if (!isAllowedFile) {
            toast.error("Only PDF, DOC, or DOCX resumes are supported.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Resume must be under 5 MB.");
            return;
        }

        setCandidateResumeUploading(true);
        setCandidateResumeUploadMessage("Reading resume and updating profile...");
        try {
            const text = await extractResumeText(file);
            let extracted: SharedResumeParseResult | null = null;
            try {
                extracted = await parseSharedCareerSyncResume({ text, fileName: file.name });
            } catch {
                extracted = null;
            }
            const finalExtract = extracted ?? extractResumeProfile(text);
            const uploaded = await uploadSharedCareerSyncResume({
                userId: `candidate-profile-${userId}`,
                file,
                candidateName: finalExtract.name || candidateProfileDraft.fullName,
                candidateEmail: finalExtract.email || candidateProfileDraft.email,
                candidatePhone: finalExtract.phone || candidateProfileDraft.phone,
                candidateCity: finalExtract.city || candidateProfileDraft.city,
                candidateExperience: finalExtract.totalExperience || candidateProfileDraft.experience,
                candidateLastRole: finalExtract.lastRole || candidateProfileDraft.headline,
                source: "candidate-profile-resume",
            });
            const nextProfile: CandidateProfileDetails = {
                ...candidateProfileDraft,
                fullName: finalExtract.name || candidateProfileDraft.fullName || candidateProfileDefaults.fullName,
                headline: finalExtract.lastRole || candidateProfileDraft.headline || candidateProfileDefaults.headline,
                email: finalExtract.email || candidateProfileDraft.email,
                phone: finalExtract.phone || candidateProfileDraft.phone,
                city: finalExtract.city || candidateProfileDraft.city,
                experience: finalExtract.totalExperience || candidateProfileDraft.experience,
                currentCompany: finalExtract.companies?.[0] || candidateProfileDraft.currentCompany,
                previousCompany: finalExtract.companies?.[1] || candidateProfileDraft.previousCompany,
                noticePeriod: finalExtract.noticePeriod || candidateProfileDraft.noticePeriod,
                languages: finalExtract.languages?.length ? finalExtract.languages.join(", ") : candidateProfileDraft.languages,
                skills: finalExtract.skills?.length ? finalExtract.skills.join(", ") : candidateProfileDraft.skills,
                currentSalary: finalExtract.currentCtc || candidateProfileDraft.currentSalary,
                expectedSalary: finalExtract.expectedCtc || candidateProfileDraft.expectedSalary,
                preferredRole: finalExtract.lastRole || candidateProfileDraft.preferredRole,
                summary: finalExtract.summary || candidateProfileDraft.summary,
                resumeName: uploaded.name || file.name,
                resumeUrl: uploaded.url,
                resumePath: uploaded.path,
                resumeUpdatedAt: new Date().toISOString(),
            };
            persistCandidateProfile(nextProfile);
            setCandidateResumeUploadMessage("Latest resume uploaded and profile auto-filled.");
            toast.success(finalExtract.source === "ai" ? "AI read your resume and updated profile." : "Resume uploaded and profile updated.");
        } catch (error) {
            const message = error instanceof ResumeError
                ? `${error.message}. ${error.hint}`
                : error instanceof Error
                    ? error.message
                    : "Could not upload the latest resume.";
            setCandidateResumeUploadMessage(message);
            toast.error(message);
        } finally {
            setCandidateResumeUploading(false);
        }
    };
    const profileTasks = [
        {
            done: liveCandidateProgress.hasResume,
            label: "Resume uploaded",
            helper: liveCandidateProgress.hasResume ? "Recruiters can review your profile." : "Upload a resume before applying to more jobs.",
        },
        {
            done: liveCandidateProgress.hasPhone,
            label: "Phone available",
            helper: liveCandidateProgress.hasPhone ? "Companies can contact you after approval." : "Add your phone so HR can reach you after unlock.",
        },
        {
            done: liveCandidateProgress.hasExperience,
            label: "Experience added",
            helper: liveCandidateProgress.hasExperience ? "Your experience is included in matching." : "Add total experience so recruiters can shortlist faster.",
        },
        {
            done: liveCandidateProgress.hasNoticePeriod,
            label: "Notice period added",
            helper: liveCandidateProgress.hasNoticePeriod ? "Recruiters can plan joining timelines." : "Add notice period to improve recruiter response quality.",
        },
        {
            done: liveCandidateProgress.hasSkills,
            label: "Skills added",
            helper: liveCandidateProgress.hasSkills ? "Your skills are included in matching." : "Add 5-8 strongest skills from your role.",
        },
        {
            done: liveCandidateProgress.hasPreferredCities,
            label: "Preferred cities added",
            helper: liveCandidateProgress.hasPreferredCities ? "Location matching is clearer." : "Add all cities where you can comfortably work.",
        },
        {
            done: liveCandidateProgress.totalApplications > 0,
            label: "First application sent",
            helper: liveCandidateProgress.totalApplications > 0 ? "Your application journey has started." : "Apply to one launch role to enter the pipeline.",
        },
    ];
    const sectionFrameClass = "scroll-mt-32 rounded-[2rem] border bg-white p-5 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.12)] sm:p-7";

    return (
        <div className="space-y-6">
            {activeSection === "dashboard" && <motion.section
                key="candidate-dashboard"
                id="dashboard"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="scroll-mt-32 space-y-5"
            >
                <CareerSyncDashboard />
                <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_42%,#f8fafc_100%)] p-5 shadow-[0_30px_80px_-36px_rgba(37,99,235,0.38)] sm:p-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />
                    <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">Candidate launch dashboard</p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Your job search cockpit</h2>
                            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                                Track applications, keep your resume ready, and act quickly when a recruiter moves your profile.
                            </p>
                        </div>
                        <a href="/careersync/jobs" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700">
                            Browse jobs
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <CandidateMetricCard label="Active applications" value={String(activeApplications.length)} helper="still in hiring pipeline" icon={<Briefcase className="h-4 w-4" />} />
                        <CandidateMetricCard label="Interviews / offers" value={String(interviewApplications.length)} helper="high-priority follow-ups" icon={<CalendarDays className="h-4 w-4" />} />
                        <CandidateMetricCard label="Saved jobs" value={String(savedJobs.length)} helper="roles on your shortlist" icon={<Star className="h-4 w-4" />} />
                        <CandidateMetricCard label="Profile strength" value={`${liveCandidateProgress.profileCompletion}%`} helper="resume, skills, notice, locations" icon={<ShieldCheck className="h-4 w-4" />} />
                    </div>
                    <div className="mt-5">
                        <CandidateProfileOverviewCard
                            profile={candidateProfileDraft}
                            applicationsCount={myApplications.length}
                            profileCompletion={liveCandidateProgress.profileCompletion}
                            resumeReady={liveCandidateProgress.hasResume}
                            onResumeUpload={handleCandidateLatestResume}
                            resumeUploading={candidateResumeUploading}
                            resumeUploadMessage={candidateResumeUploadMessage}
                            onEdit={() => setCandidateProfileEditing(true)}
                        />
                        {candidateProfileEditing ? (
                            <CandidateProfileEditForm
                                profile={candidateProfileDraft}
                                onChange={updateCandidateProfileDraft}
                                onResumeUpload={handleCandidateLatestResume}
                                resumeUploading={candidateResumeUploading}
                                resumeUploadMessage={candidateResumeUploadMessage}
                                onSave={saveCandidateProfileDraft}
                                onCancel={() => {
                                    setCandidateProfileDraft(candidateProfileSaved);
                                    setCandidateProfileEditing(false);
                                }}
                            />
                        ) : null}
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Next best action</h3>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">What you should do first today.</p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">Launch ready</span>
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                <CandidateActionCard
                                    title={liveCandidateProgress.hasResume ? "Apply to fresh roles" : "Upload resume first"}
                                    text={liveCandidateProgress.hasResume ? "Your resume is available. Apply to one of the recommended jobs below." : "A resume improves matching and makes recruiter review faster."}
                                    href={liveCandidateProgress.hasResume ? "/careersync/jobs" : "#profile-improvements"}
                                />
                                <CandidateActionCard
                                    title={latestApplication ? "Track latest application" : "Start first application"}
                                    text={latestApplication ? `${latestApplication.job?.role ?? "Latest role"} is at ${recruiterStage(latestApplication.status)} stage.` : "Pick an approved job and apply to start your CareerSync journey."}
                                    href={latestApplication ? "#applications" : "/careersync/jobs"}
                                />
                                <CandidateActionCard
                                    title={savedJobs.length ? "Review saved jobs" : "Save jobs to compare"}
                                    text={savedJobs.length ? `${savedJobs.length} saved roles are waiting for a decision.` : "Save roles you like so they are easy to revisit later."}
                                    href="#saved-jobs"
                                />
                            </div>
                        </div>
                        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4">
                            <h3 className="text-sm font-black text-slate-900">Profile readiness</h3>
                            <div className="mt-4 h-3 w-full rounded-full bg-white ring-1 ring-emerald-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500" style={{ width: `${liveCandidateProgress.profileCompletion}%` }} />
                            </div>
                            <p className="mt-2 text-xs font-black text-emerald-700">{liveCandidateProgress.profileCompletion}% complete</p>
                            <div className="mt-4 space-y-2">
                                {profileTasks.map((task) => <CandidateProfileTask key={task.label} {...task} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>}

            {activeSection === "saved-jobs" && <motion.section
                key="candidate-saved-jobs"
                id="saved-jobs"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className={`${sectionFrameClass} border-slate-100`}
            >
                <SectionHeading title="Saved Jobs" subtitle="Jobs saved to your personal shortlist." />
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {savedJobs.length === 0 ? (
                        <EmptyState title="No saved jobs" message="Use Browse jobs from your cockpit to find roles and save them here." />
                    ) : savedJobs.map((job) => <SavedJobCard key={job.id} job={job} userId={userId} saved />)}
                </div>
            </motion.section>}

            {activeSection === "applications" && <motion.section
                key="candidate-applications"
                id="applications"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className={`${sectionFrameClass} border-slate-100`}
            >
                <SectionHeading title="Applications" subtitle="Your submitted applications and current status." />
                <div className="mt-5 space-y-3">
                    {myApplications.length === 0 ? (
                        <EmptyState title="No applications yet" message="Apply to a role to see it here." />
                    ) : myApplications.map((application) => <CandidateApplicationCard key={application.id} application={application} />)}
                </div>
            </motion.section>}

            {activeSection === "status-tracking" && <motion.section
                key="candidate-status-tracking"
                id="status-tracking"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="scroll-mt-32 rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(99,102,241,0.2)] sm:p-7"
            >
                <SectionHeading title="Status Tracking" subtitle="Visualize your application journey in one view." />
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <ReportChartCard
                        title="Applications by Stage"
                        subtitle="Submitted, review, interview, and beyond"
                        data={toChartData(liveCandidateProgress.statusBreakdown)}
                        tone="blue"
                    />
                    <div className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-5">
                        <div className="flex items-center gap-2 text-indigo-800">
                            <BarChart3 className="h-4 w-4" />
                            <p className="text-sm font-bold">Profile Strength</p>
                        </div>
                        <div className="mt-4 h-3 w-full rounded-full bg-white ring-1 ring-indigo-100">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500" style={{ width: `${liveCandidateProgress.profileCompletion}%` }} />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-indigo-700">{liveCandidateProgress.profileCompletion}% complete</p>
                        <div className="mt-5 space-y-3">
                            {latestApplication ? getCandidateApplicationTimeline(latestApplication).map((item) => (
                                <div key={item.title} className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-indigo-100">
                                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.done ? "bg-emerald-500" : "bg-amber-400"}`} />
                                    <div>
                                        <p className="text-xs font-black text-slate-900">{item.title}</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">{item.text}</p>
                                    </div>
                                </div>
                            )) : <EmptyState title="No timeline yet" message="Apply to a job and your journey will appear here." />}
                        </div>
                    </div>
                </div>
            </motion.section>}

            {activeSection === "profile-improvements" && <motion.section
                key="candidate-profile-improvements"
                id="profile-improvements"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="scroll-mt-32 rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_-32px_rgba(16,185,129,0.2)] sm:p-7"
            >
                <SectionHeading title="Profile Improvements" subtitle="Action checklist to improve response rate." />
                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                    {profileTasks.map((task) => (
                        <div key={task.label} className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4">
                            <ImprovementPill label={task.label} done={task.done} />
                            <p className="mt-3 text-xs font-semibold leading-5 text-slate-600">{task.helper}</p>
                        </div>
                    ))}
                </div>
            </motion.section>}

            {activeSection === "notifications" && <motion.section
                key="candidate-notifications"
                id="notifications"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className={`${sectionFrameClass} border-slate-100`}
            >
                <SectionHeading title="Notifications" subtitle="Only candidate notifications for this account." />
                <NotificationList notifications={myNotifications} emptyLabel="No candidate notifications yet." />
            </motion.section>}

            {activeSection === "profile" && <motion.section
                key="candidate-profile"
                id="profile"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className={`${sectionFrameClass} border-slate-100`}
            >
                <SectionHeading title="Profile" subtitle="Your candidate profile and contact details." />
                <div className="mt-5">
                    <CandidateProfileOverviewCard
                        profile={candidateProfileDraft}
                        applicationsCount={myApplications.length}
                        profileCompletion={liveCandidateProgress.profileCompletion}
                        resumeReady={liveCandidateProgress.hasResume}
                        onResumeUpload={handleCandidateLatestResume}
                        resumeUploading={candidateResumeUploading}
                        resumeUploadMessage={candidateResumeUploadMessage}
                        onEdit={() => setCandidateProfileEditing(true)}
                    />
                    {candidateProfileEditing ? (
                        <CandidateProfileEditForm
                            profile={candidateProfileDraft}
                            onChange={updateCandidateProfileDraft}
                            onResumeUpload={handleCandidateLatestResume}
                            resumeUploading={candidateResumeUploading}
                            resumeUploadMessage={candidateResumeUploadMessage}
                            onSave={saveCandidateProfileDraft}
                            onCancel={() => {
                                setCandidateProfileDraft(candidateProfileSaved);
                                setCandidateProfileEditing(false);
                            }}
                        />
                    ) : null}
                </div>
            </motion.section>}
        </div>
    );
}

function CandidateProfileOverviewCard({
    profile,
    applicationsCount,
    profileCompletion,
    resumeReady,
    onResumeUpload,
    resumeUploading,
    resumeUploadMessage,
    onEdit,
}: {
    profile: CandidateProfileDetails;
    applicationsCount: number;
    profileCompletion: number;
    resumeReady: boolean;
    onResumeUpload: (file: File | null) => void;
    resumeUploading: boolean;
    resumeUploadMessage: string;
    onEdit: () => void;
}) {
    const employmentLabel = profile.currentlyWorking.toLowerCase() === "yes"
        ? `${profile.currentCompany || "Current company not shared"}${profile.workingSince ? ` · since ${profile.workingSince}` : ""}`
        : profile.currentlyWorking.toLowerCase() === "no"
            ? `Previous: ${profile.previousCompany || "not shared"}`
            : "Work status not shared";
    const languageList = splitCandidateProfileList(profile.languages);
    const skillList = splitCandidateProfileList(profile.skills);
    const profileItems = [
        { label: "Email", value: profile.email || "Not shared", icon: <Mail className="h-4 w-4" /> },
        { label: "Phone", value: profile.phone || "Not shared", icon: <Phone className="h-4 w-4" /> },
        { label: "Current city", value: profile.city || "Not shared", icon: <MapPin className="h-4 w-4" /> },
        { label: "Total experience", value: profile.experience || "Not shared", icon: <Briefcase className="h-4 w-4" /> },
        { label: "Notice period", value: profile.noticePeriod || "Not shared", icon: <Clock3 className="h-4 w-4" /> },
        { label: "Preferred cities", value: profile.preferredCities || "Not shared", icon: <MapPin className="h-4 w-4" /> },
        { label: "Current salary", value: profile.currentSalary || "Not shared", icon: <Wallet className="h-4 w-4" /> },
        { label: "Expected salary", value: profile.expectedSalary || "Not shared", icon: <Wallet className="h-4 w-4" /> },
    ];

    return (
        <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_22px_60px_-32px_rgba(37,99,235,0.45)] ring-1 ring-blue-100">
            <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#0891b2_100%)] p-5 text-white">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-2xl font-black text-blue-700 shadow-xl shadow-slate-950/20">
                            {(profile.fullName || "CS").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100">Candidate profile</p>
                            <h3 className="mt-2 text-3xl font-black tracking-tight text-white">{profile.fullName || "Candidate name not saved"}</h3>
                            <p className="mt-1 text-sm font-bold text-blue-100">{profile.headline || "Candidate profile"}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white ring-1 ring-white/20">{applicationsCount} applications</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${resumeReady ? "bg-emerald-400/20 text-emerald-50 ring-emerald-200/40" : "bg-amber-300/20 text-amber-50 ring-amber-200/40"}`}>
                                    {resumeReady ? "Resume ready" : "Resume pending"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
                    >
                        <UserRound className="h-4 w-4" />
                        Edit profile
                    </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {profile.resumeUrl ? (
                        <a href={profile.resumeUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white ring-1 ring-white/25 transition hover:bg-white/25">
                            <Eye className="h-4 w-4" />
                            See current resume
                        </a>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-300/20 px-4 py-2 text-xs font-black text-amber-50 ring-1 ring-amber-200/30">
                            <FileClock className="h-4 w-4" />
                            Current resume not linked
                        </span>
                    )}
                    <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-black ring-1 transition ${resumeUploading ? "bg-white/10 text-blue-100 ring-white/20" : "bg-white text-blue-700 ring-white hover:-translate-y-0.5 hover:bg-blue-50"}`}>
                        <Upload className="h-4 w-4" />
                        {resumeUploading ? "Uploading resume..." : "Upload latest resume"}
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            disabled={resumeUploading}
                            className="sr-only"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                void onResumeUpload(file);
                                event.currentTarget.value = "";
                            }}
                        />
                    </label>
                    {profile.resumeName ? <span className="inline-flex items-center gap-2 rounded-full bg-cyan-300/15 px-4 py-2 text-xs font-black text-cyan-50 ring-1 ring-cyan-200/30">{profile.resumeName}</span> : null}
                </div>
                {resumeUploadMessage ? <p className="mt-2 text-xs font-bold text-blue-50">{resumeUploadMessage}</p> : null}
                <div className="mt-5">
                    <div className="flex items-center justify-between gap-3 text-xs font-black text-blue-50">
                        <span>Profile strength</span>
                        <span>{profileCompletion}%</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-200 to-white transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
                    </div>
                </div>
            </div>
            <div className="grid gap-3 bg-gradient-to-b from-white to-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-4">
                {profileItems.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-blue-500">
                            {item.icon}
                            <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">{item.label}</span>
                        </div>
                        <p className="mt-2 break-words text-sm font-black text-slate-950">{item.value}</p>
                    </div>
                ))}
            </div>
            <div className="grid gap-3 border-t border-slate-100 bg-white p-4 lg:grid-cols-[1fr_1fr_1.2fr]">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Work status</p>
                    <p className="mt-2 text-sm font-black text-slate-950">{employmentLabel}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">{profile.workMode || "Work mode not shared"}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Preferred role</p>
                    <p className="mt-2 text-sm font-black text-slate-950">{profile.preferredRole || profile.headline || "Not shared"}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">{profile.summary || "Add a short career summary so recruiters understand your fit faster."}</p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wide text-blue-600">Languages</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {languageList.length ? languageList.map((language) => <span key={language} className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">{language}</span>) : <span className="text-xs font-semibold text-slate-500">Not shared</span>}
                    </div>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-blue-600">Skills</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {skillList.length ? skillList.slice(0, 10).map((skill) => <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-blue-100">{skill}</span>) : <span className="text-xs font-semibold text-slate-500">Not shared</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function splitCandidateProfileList(value: string) {
    return value
        .split(/[,;\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function CandidateProfileEditForm({
    profile,
    onChange,
    onResumeUpload,
    resumeUploading,
    resumeUploadMessage,
    onSave,
    onCancel,
}: {
    profile: CandidateProfileDetails;
    onChange: (field: keyof CandidateProfileDetails, value: string) => void;
    onResumeUpload: (file: File | null) => void;
    resumeUploading: boolean;
    resumeUploadMessage: string;
    onSave: () => void;
    onCancel: () => void;
}) {
    const basicFields: Array<{ key: keyof CandidateProfileDetails; label: string; placeholder: string; inputMode?: "tel" | "email" }> = [
        { key: "fullName", label: "Full name", placeholder: "Candidate name" },
        { key: "headline", label: "Headline / role", placeholder: "Sales associate, HR recruiter..." },
        { key: "email", label: "Email", placeholder: "candidate@email.com", inputMode: "email" },
        { key: "phone", label: "Phone", placeholder: "98XXXXXXXX", inputMode: "tel" },
        { key: "city", label: "Current city", placeholder: "Gurgaon, Delhi..." },
        { key: "experience", label: "Total experience", placeholder: "3 years, Fresher..." },
    ];
    const careerFields: Array<{ key: keyof CandidateProfileDetails; label: string; placeholder: string }> = [
        { key: "currentCompany", label: "Current company", placeholder: "Company name if working currently" },
        { key: "workingSince", label: "Working since", placeholder: "Jan 2024" },
        { key: "previousCompany", label: "Previous company", placeholder: "Last company if not working currently" },
        { key: "noticePeriod", label: "Notice period", placeholder: "Immediate, 15 days, 30 days..." },
        { key: "preferredCities", label: "Comfortable work cities", placeholder: "Gurgaon, Delhi NCR, Noida..." },
        { key: "workMode", label: "Work mode", placeholder: "Office, hybrid, remote, field..." },
    ];
    const marketFields: Array<{ key: keyof CandidateProfileDetails; label: string; placeholder: string }> = [
        { key: "preferredRole", label: "Preferred role", placeholder: "HR recruiter, sales executive..." },
        { key: "currentSalary", label: "Current salary", placeholder: "4.2 LPA, 30,000/month..." },
        { key: "expectedSalary", label: "Expected salary", placeholder: "5 LPA, 40,000/month..." },
    ];

    return (
        <div className="mt-4 rounded-[2rem] border border-blue-100 bg-white p-4 shadow-[0_18px_45px_-30px_rgba(37,99,235,0.45)] ring-1 ring-blue-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-base font-black text-slate-950">Edit profile details</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">These details stay visible on the candidate dashboard.</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onCancel} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-200">
                        Cancel
                    </button>
                    <button type="button" onClick={onSave} className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-blue-700">
                        Save profile
                    </button>
                </div>
            </div>
            <div className="mt-4 rounded-3xl border border-blue-100 bg-blue-50/40 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-black text-slate-950">Resume</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{profile.resumeName || "Upload your latest resume to auto-fill profile details."}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.resumeUrl ? (
                            <a href={profile.resumeUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-blue-700 ring-1 ring-blue-100">
                                <Eye className="h-4 w-4" />
                                See current resume
                            </a>
                        ) : null}
                        <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition ${resumeUploading ? "bg-slate-100 text-slate-500" : "bg-blue-600 text-white shadow-sm hover:bg-blue-700"}`}>
                            <Upload className="h-4 w-4" />
                            {resumeUploading ? "Uploading..." : "Upload latest resume"}
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                disabled={resumeUploading}
                                className="sr-only"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;
                                    void onResumeUpload(file);
                                    event.currentTarget.value = "";
                                }}
                            />
                        </label>
                    </div>
                </div>
                {resumeUploadMessage ? <p className="mt-3 text-xs font-bold text-blue-700">{resumeUploadMessage}</p> : null}
            </div>
            <CandidateProfileFieldGroup title="Basic details" fields={basicFields} profile={profile} onChange={onChange} />
            <div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Working currently?</span>
                <div className="mt-3 flex flex-wrap gap-2">
                    {["Yes", "No", "Open to discuss"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange("currentlyWorking", option)}
                            className={`rounded-full px-4 py-2 text-xs font-black transition ${profile.currentlyWorking === option ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-blue-50"}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            <CandidateProfileFieldGroup title="Career details" fields={careerFields} profile={profile} onChange={onChange} />
            <CandidateProfileFieldGroup title="Salary and preferences" fields={marketFields} profile={profile} onChange={onChange} />
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <label className="block">
                    <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Languages</span>
                    <textarea
                        value={profile.languages}
                        onChange={(event) => onChange("languages", event.target.value)}
                        placeholder="Hindi, English, Punjabi..."
                        rows={3}
                        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </label>
                <label className="block">
                    <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Skills</span>
                    <textarea
                        value={profile.skills}
                        onChange={(event) => onChange("skills", event.target.value)}
                        placeholder="Recruitment, screening, calling, Excel..."
                        rows={3}
                        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </label>
                <label className="block lg:col-span-2">
                    <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Short profile summary</span>
                    <textarea
                        value={profile.summary}
                        onChange={(event) => onChange("summary", event.target.value)}
                        placeholder="2-3 lines about your strengths, target role, industry, and availability."
                        rows={3}
                        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </label>
            </div>
        </div>
    );
}

function CandidateProfileFieldGroup({
    title,
    fields,
    profile,
    onChange,
}: {
    title: string;
    fields: Array<{ key: keyof CandidateProfileDetails; label: string; placeholder: string; inputMode?: "tel" | "email" }>;
    profile: CandidateProfileDetails;
    onChange: (field: keyof CandidateProfileDetails, value: string) => void;
}) {
    return (
        <div className="mt-4">
            <p className="text-sm font-black text-slate-950">{title}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {fields.map((field) => (
                    <label key={field.key} className="block">
                        <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">{field.label}</span>
                        <input
                            value={profile[field.key]}
                            onChange={(event) => onChange(field.key, event.target.value)}
                            placeholder={field.placeholder}
                            inputMode={field.inputMode}
                            autoComplete={field.key === "phone" ? "tel" : field.key === "email" ? "email" : field.key === "fullName" ? "name" : undefined}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}

function CandidateMetricCard({ label, value, helper, icon }: { label: string; value: string; helper: string; icon: ReactNode }) {
    return (
        <div className="group rounded-3xl border border-white bg-white p-4 shadow-sm ring-1 ring-blue-100/80 transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-30px_rgba(37,99,235,0.6)]">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                        {icon}
                    </span>
                    <span className="text-xs font-black uppercase tracking-wide">{label}</span>
                </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>
        </div>
    );
}

function CandidateActionCard({ title, text, href }: { title: string; text: string; href: string }) {
    return (
        <a href={href} className="block rounded-2xl bg-white p-3 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-sm font-black text-slate-900">{title}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{text}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-blue-700">
                Open
                <ArrowRight className="h-3.5 w-3.5" />
            </span>
        </a>
    );
}

function CandidateProfileTask({ label, helper, done }: { label: string; helper: string; done: boolean }) {
    return (
        <div className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-emerald-100">
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${done ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"}`}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
            </span>
            <div>
                <p className="text-xs font-black text-slate-900">{label}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{helper}</p>
            </div>
        </div>
    );
}

function CandidateApplicationCard({ application }: { application: DemoApplicationRecord & { job?: DemoJobRecord } }) {
    const stage = recruiterStage(application.status);
    const progress = getCandidateStageProgress(stage);
    const resumeName = getApplicationMetaLine(application, "Resume File") || application.resume_path?.split("/").pop() || "Resume";
    const nextStep = getCandidateNextStep(stage);
    const fit = application.job ? getApplicationFit(application, application.job) : application.ai_match_score ?? 0;
    return (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                    <div className="flex flex-wrap items-start gap-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-100 font-display text-sm font-black text-blue-700">
                            {getCompanyInitials(application.job?.company ?? application.full_name)}
                        </span>
                        <div className="min-w-0">
                            <p className="text-base font-black text-slate-900">{application.job?.role ?? "Applied role"}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">{application.job?.company ?? "Company"} · {application.job?.location ?? "Location open"}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">Applied as {application.full_name} · {formatDateTime(application.created_at)}</p>
                        </div>
                    </div>
                    <div className="mt-4 h-2.5 w-full rounded-full bg-white ring-1 ring-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 ring-1 ring-blue-100">{stage}</span>
                        {fit ? <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-slate-200">{fit}% fit</span> : null}
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-slate-200">{application.email}</span>
                        {application.resume_url ? (
                            <a href={application.resume_url} target="_blank" rel="noopener" className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-slate-200">Resume</a>
                        ) : application.resume_path ? (
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-slate-200">{resumeName}</span>
                        ) : (
                            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 ring-1 ring-amber-100">Resume missing</span>
                        )}
                    </div>
                    <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-600 ring-1 ring-slate-100">{nextStep}</p>
                </div>
                <div className="min-w-[240px] rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Timeline</p>
                    <div className="mt-3 space-y-2">
                        {getCandidateApplicationTimeline(application).map((item) => (
                            <div key={item.title} className="flex gap-2 text-xs">
                                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.done ? "bg-emerald-500" : "bg-amber-400"}`} />
                                <div>
                                    <p className="font-bold text-slate-800">{item.title}</p>
                                    <p className="mt-0.5 text-slate-500">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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
                <p><span className="font-bold text-slate-800">Requested on:</span> {formatDateTime(job.created_at)}</p>
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

function SectionHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">Role workspace</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{title}</h2>
                <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
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

function UserSummaryCard({
    label,
    users,
    icon,
    open,
    onToggle,
}: {
    label: string;
    users: DemoUserRecord[];
    icon: ReactNode;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <div className={`rounded-3xl border p-4 ring-1 transition ${open ? "border-blue-200 bg-blue-50/50 ring-blue-100" : "border-slate-100 bg-slate-50 ring-slate-100"}`}>
            <button type="button" onClick={onToggle} className="block w-full text-left">
                <div className="flex items-center gap-2 text-slate-500">
                    {icon}
                    <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-3xl font-black tracking-tight text-slate-900">{users.length}</p>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                        {open ? "Hide names" : "Show names"}
                    </span>
                </div>
            </button>
            {open ? (
                <div className="mt-4 space-y-2 border-t border-blue-100 pt-3">
                    {users.length === 0 ? (
                        <p className="text-xs font-semibold text-slate-500">No users found.</p>
                    ) : users.map((user) => (
                        <div key={user.id} className="rounded-2xl bg-white px-3 py-2 ring-1 ring-blue-100">
                            <p className="text-sm font-bold text-slate-900">{user.full_name}</p>
                            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                                {[getRoleLabel(user.role), user.company_name, user.email].filter(Boolean).join(" · ")}
                            </p>
                        </div>
                    ))}
                </div>
            ) : null}
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

function formatDateTime(value: string | null | undefined) {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";
    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
    });
}

function getKolkataDateKey(value: string | Date) {
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "";
    const parts = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Kolkata",
        year: "numeric",
    }).formatToParts(date);
    const getPart = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
    return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
}

function isKolkataToday(value: string | null | undefined) {
    if (!value) return false;
    const todayKey = getKolkataDateKey(new Date());
    return getKolkataDateKey(value) === todayKey;
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
