import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAuthRedirectUrl } from "@/lib/auth-redirect";
import type { SignupRole } from "@/lib/auth-helpers";
import type { DemoSession, DemoSessionUser } from "@/lib/careersync-demo";

export type AuthSession = Session | DemoSession;
export type AuthUser = User | DemoSessionUser;

const PENDING_OAUTH_ROLE_KEY = "careersync_pending_oauth_role";

function isSignupRole(value: unknown): value is SignupRole {
    return value === "candidate" || value === "company" || value === "employee";
}

function getPendingOAuthRole(): SignupRole | null {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(PENDING_OAUTH_ROLE_KEY);
    return isSignupRole(value) ? value : null;
}

function setPendingOAuthRole(role: SignupRole) {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(PENDING_OAUTH_ROLE_KEY, role);
    }
}

function clearPendingOAuthRole() {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(PENDING_OAUTH_ROLE_KEY);
    }
}

export function getAuthSession() {
    return supabase.auth.getSession();
}

export function onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    return supabase.auth.onAuthStateChange(callback as Parameters<typeof supabase.auth.onAuthStateChange>[0]);
}

export function signInWithPassword(input: { email: string; password: string }) {
    return supabase.auth.signInWithPassword(input);
}

export function signUpWithPassword(input: { email: string; password: string; data?: Record<string, unknown> }) {
    return supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
            data: input.data,
            emailRedirectTo: getAuthRedirectUrl("/careersync"),
        },
    });
}

export async function signInWithGoogle(input: { role: SignupRole; redirectPath?: string }) {
    setPendingOAuthRole(input.role);
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: getAuthRedirectUrl(input.redirectPath ?? "/careersync"),
        },
    });
    if (error) clearPendingOAuthRole();
    return { data, error };
}

export async function applyPendingOAuthRole(session: AuthSession | null) {
    const role = getPendingOAuthRole();
    const user = session?.user;
    if (!role || !user) return;

    const metadata = user.user_metadata ?? {};
    if (isSignupRole(metadata.role)) {
        clearPendingOAuthRole();
        return;
    }

    const { error } = await supabase.auth.updateUser({ data: { ...metadata, role } });
    if (!error) clearPendingOAuthRole();
}

export function signOut() {
    clearPendingOAuthRole();
    return supabase.auth.signOut();
}
