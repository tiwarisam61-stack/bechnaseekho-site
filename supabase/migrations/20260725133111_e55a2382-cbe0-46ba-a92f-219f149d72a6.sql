
-- 1) Applications: add resume_path for storage reference
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS resume_path text;

-- 2) Jobs: recruiter_email for automated notifications
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS recruiter_email text;

-- 3) Indexes for scale
CREATE INDEX IF NOT EXISTS idx_jobs_active_status_created
  ON public.jobs (is_active, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON public.jobs (industry);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications (job_id);

-- 4) Error reports table (server-role only)
CREATE TABLE IF NOT EXISTS public.error_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  stack text,
  route text,
  user_id uuid,
  user_agent text,
  viewport text,
  screenshot_url text,
  extra jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.error_reports TO service_role;
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated: table is server-only via service role.

CREATE INDEX IF NOT EXISTS idx_error_reports_created_at
  ON public.error_reports (created_at DESC);

-- 5) Storage policies for the "resumes" bucket (bucket created via storage tool).
-- Each user can read/write only files under a top-level folder named after their user id.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND policyname='Users upload own resumes') THEN
    CREATE POLICY "Users upload own resumes"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND policyname='Users read own resumes') THEN
    CREATE POLICY "Users read own resumes"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND policyname='Users update own resumes') THEN
    CREATE POLICY "Users update own resumes"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND policyname='Users delete own resumes') THEN
    CREATE POLICY "Users delete own resumes"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END$$;
