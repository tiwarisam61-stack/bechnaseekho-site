import type { SignupRole } from "@/lib/auth-helpers";
import type { DemoSession, DemoSessionUser } from "@/lib/careersync-demo";
import {
    firebaseSignInWithGoogle,
    firebaseSignInWithPassword,
    firebaseSendPasswordReset,
    firebaseSignOut,
    firebaseSignUpWithPassword,
    getFirebaseSession,
    onFirebaseAuthStateChange,
    type FirebaseAuthSession,
    type FirebaseAuthUser,
} from "@/lib/firebase-auth";

export type AuthSession = FirebaseAuthSession | DemoSession;
export type AuthUser = FirebaseAuthUser | DemoSessionUser;

const PENDING_OAUTH_ROLE_KEY = "careersync_pending_oauth_role";

function isSignupRole(value: unknown): value is SignupRole {
    return value === "candidate" || value === "company" || value === "employee";
}

function getPendingOAuthRole(): SignupRole | null {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(PENDING_OAUTH_ROLE_KEY);
    return isSignupRole(value) ? value : null;
}

function clearPendingOAuthRole() {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(PENDING_OAUTH_ROLE_KEY);
    }
}

export function getAuthSession() {
    return getFirebaseSession();
}

export function onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    return onFirebaseAuthStateChange(callback);
}

export function signInWithPassword(input: { email: string; password: string; role?: SignupRole | "admin" }) {
    return firebaseSignInWithPassword(input);
}

export function signUpWithPassword(input: { email: string; password: string; data?: Record<string, unknown> }) {
    return firebaseSignUpWithPassword(input);
}

export function signInWithGoogle(input: { role: SignupRole; redirectPath?: string }) {
    return firebaseSignInWithGoogle(input);
}

export function sendPasswordReset(email: string) {
    return firebaseSendPasswordReset(email);
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

    clearPendingOAuthRole();
}

export function signOut() {
    clearPendingOAuthRole();
    return firebaseSignOut();
}
