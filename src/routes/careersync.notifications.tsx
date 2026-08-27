import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCheck, Clock3, ArrowLeft, Bell, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import {
    clearReadCareerSyncNotifications,
    getCareerSyncDisplayName,
    markAllCareerSyncNotificationsRead,
    markCareerSyncNotificationRead,
    useCareerSyncSnapshot,
} from "@/services/careersync/careersync-service";

export const Route = createFileRoute("/careersync/notifications")({
    head: () => ({
        meta: [
            { title: "Notifications · CareerSync" },
            { name: "description", content: "Track local demo notifications for jobs, approvals, and applications." },
        ],
    }),
    component: NotificationsPage,
});

function NotificationsPage() {
    const { user } = useAuth();
    const { role } = useRole();
    const snapshot = useCareerSyncSnapshot();

    const notifications = useMemo(() => {
        if (!user) return [];
        return snapshot.notifications.filter((notification) => notification.user_id === user.id);
    }, [snapshot, user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 px-4 py-10 sm:px-6">
                <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl">
                    <Bell className="mx-auto h-10 w-10 text-blue-600" />
                    <h1 className="mt-4 text-2xl font-black text-[#0F172A]">Log in to view notifications</h1>
                    <p className="mt-2 text-sm text-slate-500">Use the local demo credentials to open your notification feed.</p>
                    <Link to="/login" className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md">
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link to="/careersync" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600">
                        <ArrowLeft className="h-4 w-4" /> Back to CareerSync
                    </Link>
                    <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                        {getCareerSyncDisplayName(user.id)} · {role ?? "guest"}
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_24px_70px_-32px_rgba(37,99,235,0.35)] sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">Notification center</p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0F172A]">Your local demo feed</h1>
                            <p className="mt-2 text-sm text-slate-600">Mark updates as read, clear the feed, or jump back to the workflow that created them.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => markAllCareerSyncNotificationsRead(user.id)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
                            >
                                <CheckCheck className="h-4 w-4" /> Mark all read
                            </button>
                            <button
                                type="button"
                                onClick={() => clearReadCareerSyncNotifications(user.id)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 ring-1 ring-rose-100 transition hover:bg-rose-100"
                            >
                                <Trash2 className="h-4 w-4" /> Clear read
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {notifications.length === 0 ? (
                            <EmptyFeed />
                        ) : notifications.map((notification) => (
                            <button
                                key={notification.id}
                                type="button"
                                onClick={() => markCareerSyncNotificationRead(notification.id)}
                                className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${notification.read_at ? "border-slate-100 bg-slate-50/70" : "border-blue-100 bg-blue-50/40"}`}
                            >
                                <div className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${notification.type === "success" ? "bg-emerald-100 text-emerald-600" : notification.type === "warning" ? "bg-amber-100 text-amber-600" : notification.type === "error" ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"}`}>
                                    <Bell className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h2 className="text-base font-bold text-[#0F172A]">{notification.title}</h2>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                                            <Clock3 className="h-3 w-3" /> {new Date(notification.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                                    {notification.href && (
                                        <div className="mt-3 inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                                            Open linked page
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function EmptyFeed() {
    return (
        <div className="grid place-items-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-blue-600 ring-1 ring-slate-100">
                <Bell className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-black text-[#0F172A]">No notifications yet</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">Try submitting a job, applying to a role, or approving a pending listing to generate updates here.</p>
        </div>
    );
}
