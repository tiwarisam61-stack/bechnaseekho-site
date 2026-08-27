
-- Drop the security_definer views flagged by the linter
DROP VIEW IF EXISTS public.blog_comments_public;
DROP VIEW IF EXISTS public.blog_ratings_aggregate;

-- blog_comments: public reads via column grants (no user_id exposure)
CREATE POLICY "Public read safe blog comment columns"
  ON public.blog_comments
  FOR SELECT
  TO anon
  USING (true);

REVOKE SELECT ON public.blog_comments FROM anon;
GRANT SELECT (id, blog_slug, author_name, content, created_at, updated_at)
  ON public.blog_comments TO anon;

-- blog_ratings: public may read rating values, not user_id
CREATE POLICY "Public read safe blog rating columns"
  ON public.blog_ratings
  FOR SELECT
  TO anon
  USING (true);

REVOKE SELECT ON public.blog_ratings FROM anon;
GRANT SELECT (id, blog_slug, rating, created_at, updated_at)
  ON public.blog_ratings TO anon;
