import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell, Field } from "@/components/auth/auth-shell";
import { isFreeEmailProvider, type SignupRole } from "@/lib/auth-helpers";
import { toAuthUserMessage } from "@/lib/auth-errors";
import { RoleTabs, GoogleIcon } from "./login";
import { signInWithGoogle, signUpWithPassword } from "@/services/platform/auth-service";

const searchSchema = z.object({
  role: z.enum(["candidate", "company", "employee"]).catch("candidate"),
});

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign up — BechnaSeekho" },
      { name: "description", content: "Create your BechnaSeekho account — join as a candidate or as a company." },
    ],
  }),
});

function SignupPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/signup" });
  const [role, setRole] = useState<SignupRole>(search.role);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if ((role === "company" || role === "employee") && isFreeEmailProvider(normalizedEmail)) {
      toast.error("Company and employee accounts require a work email. Free providers (gmail, yahoo, outlook…) are not accepted.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const { data, error } = await signUpWithPassword({
      email: normalizedEmail,
      password,
      data: {
        full_name: fullName,
        company_name: role === "company" || role === "employee" ? companyName : null,
        phone,
        role,
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }

    if (data.session) {
      toast.success(role === "company"
        ? "Company account created! You're all set."
        : role === "employee"
          ? "Employee account created! You're all set."
          : "Account created! You're all set.");
      navigate({ to: "/careersync" });
      return;
    }

    toast.success("Account created. Please verify your email, then log in.");
    navigate({ to: "/login", search: { role } });
  };

  const onGoogle = async () => {
    const { error } = await signInWithGoogle({ role });
    if (error) {
      toast.error(toAuthUserMessage(error, "Google sign-up could not start."));
    }
  };

  return (
    <AuthShell
      title={role === "company" ? "Create a company account" : role === "employee" ? "Create an employee account" : "Create your account"}
      subtitle={role === "company"
        ? "Post jobs and hire the best talent. Requires a work email."
        : role === "employee"
          ? "Join your enterprise workspace. Requires a work email."
          : "Join 50,000+ professionals growing with BechnaSeekho."}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" search={{ role }} className="font-semibold text-brand hover:underline">Log in</Link>
        </>
      }
    >
      <RoleTabs role={role} onChange={setRole} />

      {(role === "company" || role === "employee") && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Company and employee accounts must sign up with a verified work email domain (not gmail, yahoo, outlook, etc.).</span>
        </div>
      )}

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
        <Field label={role === "company" ? "Your name (HR / recruiter)" : "Full name"} placeholder="Ankit Sharma"
          autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        {(role === "company" || role === "employee") && (
          <Field label="Company name" placeholder="Acme Technologies"
            autoComplete="organization" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        )}
        <Field label={role === "company" || role === "employee" ? "Work email" : "Email"} type="email"
          placeholder={role === "company" || role === "employee" ? "name@yourcompany.com" : "you@example.com"}
          autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Phone (optional)" type="tel" placeholder="+91 98765 43210"
          autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Field label="Password" type="password" placeholder="At least 8 characters"
          autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3 disabled:opacity-60">
          {loading ? "Creating…" : (
            <>
              {role === "company"
                ? <><Building2 className="h-4 w-4" /> Create company account</>
                : role === "employee"
                  ? "Create employee account"
                  : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
