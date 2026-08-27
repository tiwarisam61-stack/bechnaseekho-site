
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_free_email_provider(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
-- has_role stays executable by authenticated (needed by RLS policies for signed-in users)
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
