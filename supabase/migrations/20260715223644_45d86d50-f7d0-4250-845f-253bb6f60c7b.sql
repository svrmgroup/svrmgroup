
DROP POLICY IF EXISTS "Public read staff photos" ON storage.objects;

CREATE POLICY "Admins read staff photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'staff-photos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
