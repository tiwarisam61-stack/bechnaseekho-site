import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAuthRedirectUrl } from "@/lib/auth-redirect";
import type { SignupRole } from "@/lib/auth-helpers";
import type { DemoSession, DemoSessionUser } from "@/lib/careersync-demo";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const ADMIN_EMAILS = new Set(["contact@bechnaseekho.com"]);

export type AuthUser = (User & {
    user_metadata: Record<string, unknown>;
    app_metadata: Record<string, unknown>;
}) | DemoSessionUser;

export type AuthSession = (Omit<Session, "user"> & { user: AuthUser }) | DemoSession;

const PENDING_OAUTH_ROLE_KEY = "careersync_pending_oauth_role";

function isSignupRole(value: unknown): value is SignupRole {
    return value === "candidate" || value === "company" || value === "employee";
}

function isAppRole(value: unknown): value is AppRole {
    return value === "candidate" || value === "company" || value === "employee" || value === "admin";
}

function getEmailAdminRole(user: User): AppRole | null {
    const email = user.email?.trim().toLowerCase();
    return email && ADMIN_EMAILS.has(email) ? "admin" : null;
}

function getHighestPriorityRole(roles: AppRole[]): AppRole | null {
    if (roles.includes("admin")) return "admin";
    if (roles.includes("company")) return "company";
    if (roles.includes("employee")) return "employee";
    if (roles.includes("candidate")) return "candidate";
    return null;
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

async function getRoleForUser(user: User): Promise<AppRole | null> {
    const emailAdminRole = getEmailAdminRole(user);
    if (emailAdminRole) return emailAdminRole;

    const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

    const databaseRole = getHighestPriorityRole((data ?? []).map((item) => item.role).filter(isAppRole));
    if (databaseRole) return databaseRole;

    const metadataRole = user.user_metadata?.role ?? user.app_metadata?.role;
    return isAppRole(metadataRole) ? metadataRole : null;
}

async function enrichSession(session: Session | null): Promise<AuthSession | null> {
    if (!session) return null;

    const role = await getRoleForUser(session.user);
    const user = role
        ? {
            ...session.user,
            user_metadata: { ...session.user.user_metadata, role },
            app_metadata: { ...session.user.app_metadata, role },
        }
        : session.user;

    return { ...session, user } as AuthSession;
}

export async function getAuthSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data: { session: await enrichSession(data.session) }, error };
}

export function onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
        setTimeout(() => {
            void enrichSession(session).then((enrichedSession) => callback(event, enrichedSession));
        }, 0);
    });
}

export async function signInWithPassword(input: { email: string; password: string; role?: SignupRole | "admin" }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
    });

    if (error) return { data: { user: null, session: null }, error };

    let session = await enrichSession(data.session);
    if (session?.user && !session.user.user_metadata?.role && isSignupRole(input.role)) {
        const metadata = { ...session.user.user_metadata, role: input.role };
        const { data: updated } = await supabase.auth.updateUser({ data: metadata });
        if (updated.user) {
            session = await enrichSession({ ...session, user: updated.user } as Session);
        }
    }

    return { data: { user: session?.user ?? null, session }, error: null };
}

export function signUpWithPassword(input: { email: string; password: string; data?: Record<string, unknown> }) {
    return supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
            data: input.data,
            emailRedirectTo: getAuthRedirectUrl("/careersync?workspace=1"),
        },
    });
}

export async function signInWithGoogle(input: { role: SignupRole; redirectPath?: string }) {
    setPendingOAuthRole(input.role);
    const response = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: getAuthRedirectUrl(input.redirectPath ?? "/careersync?workspace=1"),
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
        },
    });

    if (response.error) clearPendingOAuthRole();
    return response;
}

export function sendPasswordReset(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthRedirectUrl("/login"),
    });
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

    await supabase.auth.updateUser({ data: { ...metadata, role } });
    clearPendingOAuthRole();
}

export function signOut() {
    clearPendingOAuthRole();
    return supabase.auth.signOut();
}
