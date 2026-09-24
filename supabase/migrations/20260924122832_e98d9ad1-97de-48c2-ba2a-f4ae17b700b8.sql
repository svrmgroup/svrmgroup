DROP POLICY IF EXISTS "Public read cms media" ON storage.objects;
CREATE POLICY "Admins can list cms media" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));