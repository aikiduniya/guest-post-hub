
-- Allow public site_settings read for branding key too
DROP POLICY IF EXISTS "Public can read selected settings" ON public.site_settings;
CREATE POLICY "Public can read selected settings" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (key IN ('contact','hero','branding'));

-- Storage policies for site-assets: admin write, public read (signed URLs used)
CREATE POLICY "Admins manage site-assets"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(),'admin'))
WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Anyone read site-assets"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'site-assets');
