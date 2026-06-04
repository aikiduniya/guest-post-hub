
CREATE POLICY "Admins manage post covers" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'post-covers' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'post-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read post covers" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'post-covers');
