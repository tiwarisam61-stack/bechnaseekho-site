import type { SignupRole } from "@/lib/auth-helpers";

type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  getIdToken: () => Promise<string>;
};

type FirebaseAuth = unknown;

type FirebaseAuthModule = {
  getAuth: (app: unknown) => FirebaseAuth;
  GoogleAuthProvider: new () => unknown;
  browserLocalPersistence: unknown;
  createUserWithEmailAndPassword: (auth: FirebaseAuth, email: string, password: string) => Promise<{ user: FirebaseUser }>;
  onAuthStateChanged: (auth: FirebaseAuth, callback: (user: FirebaseUser | null) => void) => () => void;
  sendPasswordResetEmail: (auth: FirebaseAuth, email: string) => Promise<void>;
  setPersistence: (auth: FirebaseAuth, persistence: unknown) => Promise<void>;
  signInWithEmailAndPassword: (auth: FirebaseAuth, email: string, password: string) => Promise<{ user: FirebaseUser }>;
  signInWithPopup: (auth: FirebaseAuth, provider: unknown) => Promise<{ user: FirebaseUser }>;
  signOut: (auth: FirebaseAuth) => Promise<void>;
  updateProfile: (user: FirebaseUser, profile: { displayName?: string | null }) => Promise<void>;
};

type FirebaseAppModule = {
  getApps: () => unknown[];
  initializeApp: (config: Record<string, string>) => unknown;
};

export type FirebaseAuthUser = {
  id: string;
  email: string | null;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
};

export type FirebaseAuthSession = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
  expires_at: number;
  user: FirebaseAuthUser;
};

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBI-9skCIGmCbjcQTHwPs7ZE3EdzTiipAw",
  authDomain: "bechnaseekho.firebaseapp.com",
  projectId: "bechnaseekho",
  storageBucket: "bechnaseekho.firebasestorage.app",
  messagingSenderId: "773192695111",
  appId: "1:773192695111:web:0f10af8f3cd77af8472062",
};

const FIREBASE_APP_URL = "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
const FIREBASE_AUTH_URL = "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
const ROLE_PREFIX = "bns_firebase_role_";
const PROFILE_PREFIX = "bns_firebase_profile_";
const ADMIN_EMAILS = ["contact@bechnaseekho.com"];

let authPromise: Promise<{ auth: FirebaseAuth; module: FirebaseAuthModule }> | null = null;

function getStoredRole(uid: string): SignupRole | "admin" | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(`${ROLE_PREFIX}${uid}`);
  return value === "candidate" || value === "company" || value === "employee" || value === "admin" ? value : null;
}

function setStoredRole(uid: string, role: SignupRole | "admin") {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(`${ROLE_PREFIX}${uid}`, role);
  }
}

function getStoredProfile(uid: string): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(`${PROFILE_PREFIX}${uid}`) || "{}");
  } catch {
    return {};
  }
}

function setStoredProfile(uid: string, data: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(`${PROFILE_PREFIX}${uid}`, JSON.stringify(data));
  }
}

function inferRole(user: FirebaseUser): SignupRole | "admin" {
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return "admin";
  return getStoredRole(user.uid) ?? "candidate";
}

async function loadFirebaseAuth() {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is available in the browser only.");
  }
  if (!authPromise) {
    authPromise = Promise.all([
      import(/* @vite-ignore */ FIREBASE_APP_URL) as Promise<FirebaseAppModule>,
      import(/* @vite-ignore */ FIREBASE_AUTH_URL) as Promise<FirebaseAuthModule>,
    ]).then(async ([appModule, authModule]) => {
      const app = appModule.getApps().length ? appModule.getApps()[0] : appModule.initializeApp(FIREBASE_CONFIG);
      const auth = authModule.getAuth(app);
      await authModule.setPersistence(auth, authModule.browserLocalPersistence);
      return { auth, module: authModule };
    });
  }
  return authPromise;
}

export async function toFirebaseSession(user: FirebaseUser | null): Promise<FirebaseAuthSession | null> {
  if (!user) return null;
  const role = inferRole(user);
  const token = await user.getIdToken();
  const profile = getStoredProfile(user.uid);
  return {
    access_token: token,
    refresh_token: "",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: {
      id: user.uid,
      email: user.email,
      user_metadata: {
        full_name: user.displayName ?? profile.full_name ?? user.email?.split("@")[0] ?? "User",
        phone: user.phoneNumber ?? profile.phone ?? null,
        company_name: profile.company_name ?? null,
        role,
      },
      app_metadata: { role },
    },
  };
}

export async function getFirebaseSession() {
  const { auth, module } = await loadFirebaseAuth();
  return new Promise<{ data: { session: FirebaseAuthSession | null }; error: Error | null }>((resolve) => {
    const unsubscribe = module.onAuthStateChanged(auth, (user) => {
      unsubscribe();
      void toFirebaseSession(user).then((session) => resolve({ data: { session }, error: null }));
    });
  });
}

export async function firebaseSignInWithPassword(input: { email: string; password: string; role?: SignupRole | "admin" }) {
  try {
    const { auth, module } = await loadFirebaseAuth();
    const { user } = await module.signInWithEmailAndPassword(auth, input.email, input.password);
    setStoredRole(user.uid, input.role ?? inferRole(user));
    const session = await toFirebaseSession(user);
    return { data: { user: session?.user ?? null, session }, error: null };
  } catch (error) {
    return { data: { user: null, session: null }, error: error as Error };
  }
}

export async function firebaseSignUpWithPassword(input: { email: string; password: string; data?: Record<string, unknown> }) {
  try {
    const { auth, module } = await loadFirebaseAuth();
    const { user } = await module.createUserWithEmailAndPassword(auth, input.email, input.password);
    const role = (input.data?.role === "company" || input.data?.role === "employee" || input.data?.role === "candidate")
      ? input.data.role
      : "candidate";
    setStoredRole(user.uid, role);
    setStoredProfile(user.uid, input.data ?? {});
    if (input.data?.full_name) {
      await module.updateProfile(user, { displayName: String(input.data.full_name) });
    }
    const session = await toFirebaseSession(user);
    return { data: { user: session?.user ?? null, session }, error: null };
  } catch (error) {
    return { data: { user: null, session: null }, error: error as Error };
  }
}

export async function firebaseSignInWithGoogle(input: { role: SignupRole; redirectPath?: string }) {
  try {
    const { auth, module } = await loadFirebaseAuth();
    const provider = new module.GoogleAuthProvider();
    const { user } = await module.signInWithPopup(auth, provider);
    setStoredRole(user.uid, input.role);
    const session = await toFirebaseSession(user);
    window.location.href = input.redirectPath ?? "/careersync";
    return { data: { provider: "google", url: null, user: session?.user ?? null, session }, error: null };
  } catch (error) {
    return { data: { provider: "google", url: null, user: null, session: null }, error: error as Error };
  }
}

export async function firebaseSendPasswordReset(email: string) {
  try {
    const { auth, module } = await loadFirebaseAuth();
    await module.sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function firebaseSignOut() {
  try {
    const { auth, module } = await loadFirebaseAuth();
    await module.signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export function onFirebaseAuthStateChange(callback: (event: string, session: FirebaseAuthSession | null) => void) {
  let unsubscribe = () => undefined;
  void loadFirebaseAuth().then(({ auth, module }) => {
    unsubscribe = module.onAuthStateChanged(auth, (user) => {
      void toFirebaseSession(user).then((session) => callback(user ? "SIGNED_IN" : "SIGNED_OUT", session));
    });
  });
  return { data: { subscription: { unsubscribe: () => unsubscribe() } } };
}
