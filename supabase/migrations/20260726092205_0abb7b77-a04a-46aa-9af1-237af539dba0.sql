DROP POLICY IF EXISTS "Public may submit change requests" ON public.booking_change_requests;
REVOKE INSERT ON public.booking_change_requests FROM anon;
DROP POLICY IF EXISTS "Admins insert change requests" ON public.booking_change_requests;
CREATE POLICY "Admins insert change requests" ON public.booking_change_requests
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));