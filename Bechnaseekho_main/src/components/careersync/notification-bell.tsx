import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, Clock3, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import {
    clearReadCareerSyncNotifications,
    getCareerSyncDisplayName,
    listCareerSyncNotifications,
    markAllCareerSyncNotificationsRead,
    markCareerSyncNotificationRead,
    useCareerSyncSnapshot,
} from "@/services/careersync/careersync-service";

export function NotificationBell({ className = "", compact = false }: { className?: string; compact?: boolean }) {
    const { user } = useAuth();
    const { role } = useRole();
    const snapshot = useCareerSyncSnapshot();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const notifications = useMemo(() => listCareerSyncNotifications(user?.id ?? null), [snapshot, user?.id]);
    const unreadCount = notifications.filter((notification) => !notification.read_at).length;

    useEffect(() => {
        const onDown = (event: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    if (!user) return null;

    const recent = notifications.slice(0, 5);

    return (
        <div ref={rootRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className={`relative inline-flex items-center justify-center rounded-full bg-white/85 text-[#1a2a4a] ring-1 ring-blue-100 transition hover:bg-white hover:ring-blue-200 ${compact ? "h-8 w-8" : "h-10 w-10"}`}
                aria-label="Open notifications"
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <span className={`absolute grid place-items-center rounded-full bg-rose-500 font-bold text-white shadow-md ${compact ? "-right-1 -top-1 h-4 min-w-4 px-0.5 text-[9px]" : "-right-0.5 -top-0.5 h-5 min-w-5 px-1 text-[10px]"}`}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-full z-50 mt-3 w-[360px] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">Notifications</p>
                                <h3 className="mt-1 text-sm font-extrabold text-[#0F172A]">{getCareerSyncDisplayName(user.id)}</h3>
                                <p className="mt-0.5 text-xs text-slate-500">{role ?? "guest"} workspace updates</p>
                            </div>
                            <Link
                                to="/careersync/notifications"
                                onClick={() => setOpen(false)}
                                className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                                Open page
                            </Link>
                        </div>

                        <div className="max-h-[360px] overflow-y-auto p-2">
                            {recent.length === 0 ? (
                                <div className="px-4 py-10 text-center text-sm text-slate-500">
                                    No notifications yet.
                                </div>
                            ) : (
                                recent.map((notification) => (
                                    <button
                                        key={notification.id}
                                        type="button"
                                        onClick={() => markCareerSyncNotificationRead(notification.id)}
                                        className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50 ${notification.read_at ? "opacity-70" : "bg-blue-50/40"}`}
                                    >
                                        <div className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${notification.type === "success" ? "bg-emerald-100 text-emerald-600" : notification.type === "warning" ? "bg-amber-100 text-amber-600" : notification.type === "error" ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"}`}>
                                            <Bell className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-bold text-[#0F172A]">{notification.title}</p>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                                    <Clock3 className="h-3 w-3" /> {new Date(notification.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                </span>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{notification.message}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
                            <button
                                type="button"
                                onClick={() => user.id && markAllCareerSyncNotificationsRead(user.id)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                            >
                                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                            </button>
                            <button
                                type="button"
                                onClick={() => user.id && clearReadCareerSyncNotifications(user.id)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                            >
                                <Trash2 className="h-3.5 w-3.5" /> Clear read
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
