import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell, Field } from "@/components/auth/auth-shell";
import type { SignupRole } from "@/lib/auth-helpers";
import { toAuthUserMessage } from "@/lib/auth-errors";
import { signInWithGoogle, signInWithPassword } from "@/services/platform/auth-service";

type LoginRole = SignupRole | "admin";

const searchSchema = z.object({
  role: z.enum(["candidate", "company", "employee", "admin"]).catch("candidate"),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Log in — BechnaSeekho" },
      { name: "description", content: "Log in to BechnaSeekho as a candidate or company to continue." },
    ],
  }),
});

function LoginPage() {
  const search = useSearch({ from: "/login" });
  const [role, setRole] = useState<LoginRole>(search.role);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = search.redirect ?? "/careersync";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    window.location.href = redirectTo;
  };

  const onGoogle = async () => {
    if (role === "admin") {
      toast.info("Admin login uses email and password.");
      return;
    }
    const { error } = await signInWithGoogle({ role, redirectPath: redirectTo });
    if (error) {
      toast.error(toAuthUserMessage(error, "Google sign-in could not start."));
    }
  };

  return (
    <AuthShell
      title={role === "admin" ? "Admin login" : role === "company" ? "Company login" : role === "employee" ? "Employee login" : "Candidate login"}
      subtitle={role === "admin" ? "Access the admin dashboard." : role === "company" ? "Access your recruiter hub." : role === "employee" ? "Access your enterprise workspace." : "Continue your career journey."}
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" search={{ role: role === "admin" ? "candidate" : role }} className="font-semibold text-brand hover:underline">Sign up</Link>
        </>
      }
    >
      <LoginRoleTabs role={role} onChange={setRole} />

      {/* Demo credentials removed for production */}

      <button
        type="button"
        onClick={onGoogle}
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-gray-50"
      >
        <GoogleIcon /> Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-ink-soft">
        <div className="h-px flex-1 bg-line" /> or <div className="h-px flex-1 bg-line" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Email" type="email" placeholder={role === "company" || role === "employee" || role === "admin" ? "name@yourcompany.com" : "you@example.com"}
          autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" type="password" placeholder="••••••••" autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3 disabled:opacity-60">
          {loading ? "Signing in…" : `Log in as ${role === "admin" ? "Admin" : role === "company" ? "Company" : role === "employee" ? "Employee" : "Candidate"}`} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  );
}

export function RoleTabs({ role, onChange }: { role: SignupRole; onChange: (r: SignupRole) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1">
      {(["candidate", "company", "employee"] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`rounded-lg py-2 text-sm font-semibold transition ${role === r ? "bg-white text-ink shadow-sm" : "text-ink-soft hover:text-ink"
            }`}
        >
          {r === "candidate" ? "Candidate" : r === "company" ? "Company" : "Employee"}
        </button>
      ))}
    </div>
  );
}

/** Login-only tabs — adds an Admin option that must never appear on the signup page. */
function LoginRoleTabs({ role, onChange }: { role: LoginRole; onChange: (r: LoginRole) => void }) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-xl bg-gray-100 p-1">
      {(["candidate", "company", "employee", "admin"] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`rounded-lg py-2 text-sm font-semibold transition ${role === r ? "bg-white text-ink shadow-sm" : "text-ink-soft hover:text-ink"
            }`}
        >
          {r === "candidate" ? "Candidate" : r === "company" ? "Company" : r === "employee" ? "Employee" : "Admin"}
        </button>
      ))}
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.58v2.98h3.86c2.26-2.09 3.58-5.17 3.58-8.8z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.86-2.98c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.63H1.29A11.98 11.98 0 000 12c0 1.94.46 3.78 1.29 5.37l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}
