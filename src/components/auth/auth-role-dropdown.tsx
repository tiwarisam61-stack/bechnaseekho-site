import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Building2, ShieldCheck, UserCircle2 } from "lucide-react";

type AuthRoute = "/login" | "/signup";

/**
 * Shared "Log in / Sign up" hover dropdown used on both the BechnaSeekho
 * and CareerSync navbars. Admin only appears on the login variant, never signup.
 */
export function AuthRoleDropdown({
  label,
  icon,
  buttonClassName,
  route,
  iconPosition = "left",
}: {
  label: string;
  icon: React.ReactNode;
  buttonClassName: string;
  route: AuthRoute;
  iconPosition?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to={route} search={{ role: "candidate" }} className={buttonClassName}>
        {iconPosition === "left" && icon}
        <span className="relative">{label}</span>
        {iconPosition === "right" && icon}
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full pt-2 z-50 w-64"
          >
            <div className="rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
              <RoleChoice route={route} role="candidate" title={`${label} as Candidate`}
                sub="Find jobs, build resume, track apps." icon={<UserCircle2 className="h-5 w-5 text-blue-600" />} />
              <RoleChoice route={route} role="company" title={`${label} as Recruiter`}
                sub="Post jobs, hire talent, manage HR." icon={<Building2 className="h-5 w-5 text-emerald-600" />} />
              <RoleChoice route={route} role="employee" title={`${label} as Employee`}
                sub="Manage tasks, timesheets, leave, and internal chat." icon={<UserCircle2 className="h-5 w-5 text-amber-600" />} />
              {route === "/login" && (
                <AdminRoleChoice title={`${label} as Admin`} sub="Manage platform, review jobs and moderate content."
                  icon={<ShieldCheck className="h-5 w-5 text-rose-600" />} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleChoice({
  route, role, title, sub, icon,
}: {
  route: AuthRoute;
  role: "candidate" | "company" | "employee";
  title: string; sub: string; icon: React.ReactNode;
}) {
  return (
    <Link
      to={route}
      search={{ role }}
      className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50/70"
    >
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${role === "company" ? "bg-emerald-50" : role === "employee" ? "bg-amber-50" : "bg-blue-50"}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-[#1a2a4a]">{title}</div>
        <div className="text-xs text-gray-500">{sub}</div>
      </div>
    </Link>
  );
}

function AdminRoleChoice({ title, sub, icon }: { title: string; sub: string; icon: React.ReactNode }) {
  return (
    <Link
      to="/login"
      search={{ role: "admin" }}
      className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50/70"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50">
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-[#1a2a4a]">{title}</div>
        <div className="text-xs text-gray-500">{sub}</div>
      </div>
    </Link>
  );
}
