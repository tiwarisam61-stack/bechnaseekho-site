
-- 1) Restrict has_role to the caller's own uid
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
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

-- 2) blog_comments: public view without user_id; base table restricted to owner reads
DROP POLICY IF EXISTS "Anyone can read blog comments" ON public.blog_comments;
CREATE POLICY "Users read own comments"
  ON public.blog_comments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE SELECT ON public.blog_comments FROM anon;

CREATE OR REPLACE VIEW public.blog_comments_public
WITH (security_invoker = false) AS
  SELECT id, blog_slug, author_name, content, created_at, updated_at
  FROM public.blog_comments;

GRANT SELECT ON public.blog_comments_public TO anon, authenticated;

-- 3) blog_ratings: public aggregate view; base rows restricted to owner
DROP POLICY IF EXISTS "Anyone can read blog ratings" ON public.blog_ratings;
CREATE POLICY "Users read own rating"
  ON public.blog_ratings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE SELECT ON public.blog_ratings FROM anon;

CREATE OR REPLACE VIEW public.blog_ratings_aggregate
WITH (security_invoker = false) AS
  SELECT blog_slug,
         AVG(rating)::numeric(10,2) AS avg_rating,
         COUNT(*)::int AS rating_count
  FROM public.blog_ratings
  GROUP BY blog_slug;

GRANT SELECT ON public.blog_ratings_aggregate TO anon, authenticated;

-- 4) error_reports: admin-only read policy (writes continue via service role)
DROP POLICY IF EXISTS "Admins read error reports" ON public.error_reports;
CREATE POLICY "Admins read error reports"
  ON public.error_reports
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
