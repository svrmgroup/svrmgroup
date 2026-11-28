CREATE OR REPLACE FUNCTION public.get_booking_by_token(_token uuid)
 RETURNS SETOF public.manual_bookings
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT * FROM public.manual_bookings
  WHERE client_token = _token
    AND (portal_expires_at IS NULL OR portal_expires_at > now())
  LIMIT 1;
$function$;