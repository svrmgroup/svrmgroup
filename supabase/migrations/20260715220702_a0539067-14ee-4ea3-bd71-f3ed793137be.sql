GRANT INSERT ON public.booking_change_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_change_requests TO authenticated;
GRANT ALL ON public.booking_change_requests TO service_role;