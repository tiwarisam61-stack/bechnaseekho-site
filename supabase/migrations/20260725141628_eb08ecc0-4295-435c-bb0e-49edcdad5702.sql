
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  ) AND _user_id = auth.uid()
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Rewrite policies to reference the private function
DROP POLICY IF EXISTS "Companies see own jobs" ON public.jobs;
CREATE POLICY "Companies see own jobs" ON public.jobs
  FOR SELECT TO authenticated
  USING ((posted_by = auth.uid()) AND private.has_role(auth.uid(), 'company'::public.app_role));

DROP POLICY IF EXISTS "Admins see all jobs" ON public.jobs;
CREATE POLICY "Admins see all jobs" ON public.jobs
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Companies insert own jobs" ON public.jobs;
CREATE POLICY "Companies insert own jobs" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK ((posted_by = auth.uid()) AND private.has_role(auth.uid(), 'company'::public.app_role) AND (status = 'pending'::text));

DROP POLICY IF EXISTS "Companies update own jobs" ON public.jobs;
CREATE POLICY "Companies update own jobs" ON public.jobs
  FOR UPDATE TO authenticated
  USING ((posted_by = auth.uid()) AND private.has_role(auth.uid(), 'company'::public.app_role))
  WITH CHECK ((posted_by = auth.uid()) AND private.has_role(auth.uid(), 'company'::public.app_role));

DROP POLICY IF EXISTS "Companies delete own jobs" ON public.jobs;
CREATE POLICY "Companies delete own jobs" ON public.jobs
  FOR DELETE TO authenticated
  USING ((posted_by = auth.uid()) AND private.has_role(auth.uid(), 'company'::public.app_role));

DROP POLICY IF EXISTS "Admins moderate jobs" ON public.jobs;
CREATE POLICY "Admins moderate jobs" ON public.jobs
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins read error reports" ON public.error_reports;
CREATE POLICY "Admins read error reports" ON public.error_reports
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Drop the public-schema copy now that policies use the private one
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
