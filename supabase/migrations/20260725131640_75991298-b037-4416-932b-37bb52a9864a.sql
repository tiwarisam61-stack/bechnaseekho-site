
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_slug TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX blog_comments_slug_idx ON public.blog_comments(blog_slug, created_at DESC);

GRANT SELECT ON public.blog_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_comments TO authenticated;
GRANT ALL ON public.blog_comments TO service_role;

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blog comments" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Authed users insert own comments" ON public.blog_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own comments" ON public.blog_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comments" ON public.blog_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_blog_comments_updated
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.blog_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_slug TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (blog_slug, user_id)
);
CREATE INDEX blog_ratings_slug_idx ON public.blog_ratings(blog_slug);

GRANT SELECT ON public.blog_ratings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_ratings TO authenticated;
GRANT ALL ON public.blog_ratings TO service_role;

ALTER TABLE public.blog_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blog ratings" ON public.blog_ratings FOR SELECT USING (true);
CREATE POLICY "Authed users insert own rating" ON public.blog_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own rating" ON public.blog_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own rating" ON public.blog_ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_blog_ratings_updated
BEFORE UPDATE ON public.blog_ratings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
