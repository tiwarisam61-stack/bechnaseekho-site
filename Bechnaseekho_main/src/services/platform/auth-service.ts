import {
    demoGetSession,
    demoOnAuthStateChange,
    demoSignInWithPassword,
    demoSignOut,
    demoSignUp,
    type DemoSession,
    type DemoSessionUser,
} from "@/lib/careersync-demo";

export type AuthSession = DemoSession;
export type AuthUser = DemoSessionUser;

export function getAuthSession() {
    return demoGetSession();
}

export function onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    return demoOnAuthStateChange(callback);
}

export function signInWithPassword(input: { email: string; password: string }) {
    return demoSignInWithPassword(input);
}

export function signUpWithPassword(input: { email: string; password: string; data?: Record<string, unknown> }) {
    return demoSignUp(input);
}

export function signOut() {
    return demoSignOut();
}