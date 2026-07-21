
REVOKE EXECUTE ON FUNCTION public.get_booking_by_token(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_invoice_settings_by_token(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_public_settings() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_booking_by_token(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_invoice_settings_by_token(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_public_settings() TO service_role;
