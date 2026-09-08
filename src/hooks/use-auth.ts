import { useEffect, useState } from "react";
import type { AuthSession, AuthUser } from "@/services/platform/auth-service";
import { applyPendingOAuthRole, getAuthSession, onAuthStateChange } from "@/services/platform/auth-service";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = onAuthStateChange((_e, s) => {
      void applyPendingOAuthRole(s);
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });
    getAuthSession()
      .then(({ data }) => {
        void applyPendingOAuthRole(data.session);
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .catch(() => {
        setSession(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, loading, isAuthed: !!user };
}
