import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { supabase } from "@/integrations/supabase/client";

export type Role = "candidate" | "company" | "employee" | "admin" | null;

const ADMIN_EMAILS = new Set(["contact@bechnaseekho.com"]);

function normalizeRole(value: unknown): Role {
  if (value === "admin" || value === "company" || value === "employee" || value === "candidate") {
    return value;
  }
  return null;
}

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const sessionRole = normalizeRole(user?.user_metadata?.role ?? user?.app_metadata?.role);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const email = user.email?.trim().toLowerCase();

    if (email && ADMIN_EMAILS.has(email)) {
      setRole("admin");
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.warn("[CareerSync] Unable to load user role", error);
        }

        const roles = (data ?? []).map((item) => normalizeRole(item.role)).filter(Boolean) as Exclude<Role, null>[];
        const dbRole: Role =
          email && ADMIN_EMAILS.has(email) ? "admin" :
            roles.includes("admin") ? "admin" :
            roles.includes("company") ? "company" :
              roles.includes("employee") ? "employee" :
                roles.includes("candidate") ? "candidate" :
                  null;

        setRole(dbRole ?? sessionRole);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.id, authLoading, sessionRole]);

  return {
    role,
    loading,
    isCompany: role === "company",
    isEmployee: role === "employee",
    isCandidate: role === "candidate",
    isAdmin: role === "admin",
  };
}
