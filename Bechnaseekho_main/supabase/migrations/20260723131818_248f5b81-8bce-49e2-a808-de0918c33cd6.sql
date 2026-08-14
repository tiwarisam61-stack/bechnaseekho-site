
-- JOBS
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  logo TEXT,
  location TEXT NOT NULL,
  experience TEXT NOT NULL,
  salary TEXT NOT NULL,
  employment_type TEXT NOT NULL DEFAULT 'Full-time',
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (is_active = true);

-- APPLICATIONS
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'applied',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own applications" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own applications" ON public.applications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own applications" ON public.applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_jobs_updated BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_applications_updated BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SEED JOBS
INSERT INTO public.jobs (role, company, location, experience, salary, employment_type, description, tags) VALUES
('Frontend Developer', 'Techvanta', 'Noida', '2-4 yrs', '₹8-14 LPA', 'Full-time', 'Build performant React apps with TypeScript, Tailwind and modern tooling.', ARRAY['React','TypeScript','Tailwind']),
('Software Engineer', 'Innovaccer', 'Gurgaon', '3-6 yrs', '₹18-28 LPA', 'Full-time', 'Design and build scalable backend services powering healthcare products.', ARRAY['Node.js','PostgreSQL','AWS']),
('UI/UX Designer', 'Uplers', 'Remote', '2-5 yrs', '₹6-12 LPA', 'Remote', 'Craft delightful product interfaces across web and mobile.', ARRAY['Figma','Design Systems']),
('Backend Developer', 'Razorpay', 'Bangalore', '3-6 yrs', '₹22-38 LPA', 'Full-time', 'Own critical payment infrastructure at massive scale.', ARRAY['Go','Kafka','Kubernetes']),
('Product Manager', 'Meesho', 'Bangalore', '4-6 yrs', '₹30-45 LPA', 'Full-time', 'Drive product strategy for our seller ecosystem.', ARRAY['Product','Analytics']),
('Data Scientist', 'Flipkart', 'Bangalore', '3-5 yrs', '₹20-32 LPA', 'Full-time', 'Build ML models powering search, ranking, and personalization.', ARRAY['Python','ML','SQL']),
('DevOps Engineer', 'PhonePe', 'Bangalore', '3-6 yrs', '₹18-30 LPA', 'Full-time', 'Own the reliability and delivery pipeline for a top payments platform.', ARRAY['AWS','Terraform','K8s']),
('Mobile Engineer', 'Swiggy', 'Hyderabad', '2-5 yrs', '₹14-24 LPA', 'Full-time', 'Ship delightful native experiences to millions of users daily.', ARRAY['Kotlin','Swift']);
