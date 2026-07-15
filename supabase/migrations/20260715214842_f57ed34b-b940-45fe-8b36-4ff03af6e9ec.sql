
DROP POLICY IF EXISTS "Public can read booking by token" ON public.manual_bookings;

CREATE OR REPLACE FUNCTION public.get_booking_by_token(_token uuid)
RETURNS SETOF public.manual_bookings
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.manual_bookings WHERE client_token = _token LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_booking_by_token(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_booking_by_token(uuid) TO anon, authenticated;
