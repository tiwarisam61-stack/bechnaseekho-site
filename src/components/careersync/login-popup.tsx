import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { toAuthUserMessage } from "@/lib/auth-errors";
import { GoogleIcon } from "@/routes/login";
import { signInWithGoogle } from "@/services/platform/auth-service";

const STORAGE_KEY = "careersync_login_popup_count";
const MAX_SHOWS = 2;
const DELAYS_MS = [30_000, 60_000]; // first popup at 30s, second at 60s

export function CareerSyncLoginPopup() {
  const { isAuthed, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem(STORAGE_KEY) ?? "0");
  });

  useEffect(() => {
    if (loading || isAuthed) return;
    if (shown >= MAX_SHOWS) return;

    const nextDelay = DELAYS_MS[shown];
    const timer = window.setTimeout(() => setOpen(true), nextDelay);
    return () => window.clearTimeout(timer);
  }, [isAuthed, loading, shown]);

  const close = () => {
    setOpen(false);
    const next = shown + 1;
    setShown(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  const onGoogle = async () => {
    const { error } = await signInWithGoogle({ role: "candidate" });
    if (error) {
      toast.error(toAuthUserMessage(error, "Google sign-in could not start."));
    }
  };

  return (
    <AnimatePresence>
      {open && !isAuthed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 opacity-90" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-gray-600 shadow-md hover:bg-white hover:text-gray-900"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-8 pt-16 pb-8">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-lg ring-1 ring-blue-100">
                <img src="/favicon.png" alt="BechnaSeekho logo" className="h-10 w-10 rounded-xl object-cover" />
              </div>

              <h2 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-[#1a2a4a]">
                Unlock the full CareerSync experience
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                Log in or create a free account to save jobs, track applications, and get personalized recommendations.
              </p>

              <button
                onClick={onGoogle}
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#1a2a4a] shadow-sm transition hover:bg-gray-50"
              >
                <GoogleIcon /> Continue with Google
              </button>

              <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-400">
                <div className="h-px flex-1 bg-gray-200" /> or <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  search={{ role: "candidate" }}
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
                >
                  Log in <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/signup"
                  search={{ role: "candidate" }}
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Sign up
                </Link>
              </div>

              <p className="mt-4 text-center text-[11px] text-gray-400">
                {shown === 0 ? "This reminder won't show more than twice." : "Last reminder — we won't ask again."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
