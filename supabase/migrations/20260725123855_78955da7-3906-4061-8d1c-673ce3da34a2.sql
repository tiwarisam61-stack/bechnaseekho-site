
-- 1. Roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('candidate', 'company', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. has_role security-definer helper (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Free-email-provider check (companies must use a real work domain)
CREATE OR REPLACE FUNCTION public.is_free_email_provider(_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
SET search_path = public
AS $$
  SELECT lower(split_part(_email, '@', 2)) = ANY (ARRAY[
    'gmail.com','googlemail.com','yahoo.com','yahoo.co.in','yahoo.co.uk',
    'outlook.com','hotmail.com','live.com','msn.com',
    'icloud.com','me.com','mac.com',
    'aol.com','protonmail.com','proton.me','pm.me',
    'zoho.com','gmx.com','gmx.us','yandex.com','yandex.ru',
    'mail.com','tutanota.com','fastmail.com','rediffmail.com'
  ])
$$;

-- 4. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Auto-create profile + role from signup metadata.
--    If someone tries to sign up as company with a free-provider email,
--    they are silently demoted to candidate.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role TEXT;
  effective_role public.app_role;
BEGIN
  requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'candidate');

  IF requested_role = 'company'
     AND NEW.email IS NOT NULL
     AND NOT public.is_free_email_provider(NEW.email) THEN
    effective_role := 'company';
  ELSE
    effective_role := 'candidate';
  END IF;

  INSERT INTO public.profiles (id, full_name, company_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, effective_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Extend jobs: moderation status + poster
ALTER TABLE public.jobs
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  ADD COLUMN posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Existing rows (seed data) should remain visible
UPDATE public.jobs SET status = 'approved' WHERE status = 'pending';

-- Rewrite public-read policy: only approved+active jobs are public
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;

CREATE POLICY "Public sees approved active jobs" ON public.jobs
  FOR SELECT TO anon, authenticated
  USING (is_active = true AND status = 'approved');

CREATE POLICY "Companies see own jobs" ON public.jobs
  FOR SELECT TO authenticated
  USING (posted_by = auth.uid() AND public.has_role(auth.uid(), 'company'));

CREATE POLICY "Admins see all jobs" ON public.jobs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Companies insert own jobs" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (
    posted_by = auth.uid()
    AND public.has_role(auth.uid(), 'company')
    AND status = 'pending'
  );

CREATE POLICY "Companies update own jobs" ON public.jobs
  FOR UPDATE TO authenticated
  USING (posted_by = auth.uid() AND public.has_role(auth.uid(), 'company'))
  WITH CHECK (posted_by = auth.uid() AND public.has_role(auth.uid(), 'company'));

CREATE POLICY "Companies delete own jobs" ON public.jobs
  FOR DELETE TO authenticated
  USING (posted_by = auth.uid() AND public.has_role(auth.uid(), 'company'));

CREATE POLICY "Admins moderate jobs" ON public.jobs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
