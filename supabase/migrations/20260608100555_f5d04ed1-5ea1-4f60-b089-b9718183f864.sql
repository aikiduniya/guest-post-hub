
-- 1) Restrict site_settings public reads to known safe keys
DROP POLICY IF EXISTS "Anyone reads settings" ON public.site_settings;
CREATE POLICY "Public reads safe settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (key IN ('contact', 'hero'));

-- 2) Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
