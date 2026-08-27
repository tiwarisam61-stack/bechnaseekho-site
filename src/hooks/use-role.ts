import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";

export type Role = "candidate" | "company" | "employee" | "admin" | null;

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const sessionRole = (user?.user_metadata?.role ?? user?.app_metadata?.role) as Role | undefined;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }
    const preferred: Role =
      sessionRole === "admin" ? "admin" :
        sessionRole === "company" ? "company" :
          sessionRole === "employee" ? "employee" :
            sessionRole === "candidate" ? "candidate" :
              null;
    setRole(preferred);
    setLoading(false);
  }, [user, authLoading, sessionRole]);

  return {
    role,
    loading,
    isCompany: role === "company",
    isEmployee: role === "employee",
    isCandidate: role === "candidate",
    isAdmin: role === "admin",
  };
}
