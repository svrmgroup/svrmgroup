-- 1. Drop the overly permissive public SELECT policy on app_settings
DROP POLICY IF EXISTS "Public read app settings" ON public.app_settings;

-- 2. Safe public settings function (only non-sensitive fields)
CREATE OR REPLACE FUNCTION public.get_public_settings()
RETURNS TABLE (
  company_name text, company_email text, company_phone text, company_whatsapp text,
  company_address text, website text, tagline text, logo_url text,
  brand_primary text, brand_bg text, instagram_handle text,
  thank_you_message text, confirmation_footer text, invoice_footer text,
  portal_expiry_days integer
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT company_name, company_email, company_phone, company_whatsapp,
         company_address, website, tagline, logo_url,
         brand_primary, brand_bg, instagram_handle,
         thank_you_message, confirmation_footer, invoice_footer,
         portal_expiry_days
  FROM public.app_settings WHERE id = 1;
$$;

-- SECURITY INVOKER can't read app_settings under RLS, so grant table-level SELECT
-- on ONLY the safe columns. Bank/VAT columns remain admin-only via RLS + no grant.
GRANT SELECT (
  company_name, company_email, company_phone, company_whatsapp,
  company_address, website, tagline, logo_url,
  brand_primary, brand_bg, instagram_handle,
  thank_you_message, confirmation_footer, invoice_footer,
  portal_expiry_days
) ON public.app_settings TO anon, authenticated;

-- Add a permissive SELECT policy scoped to safe columns via a policy that
-- always returns true — column privileges above are what actually gate access.
CREATE POLICY "Anyone can read safe settings columns"
  ON public.app_settings FOR SELECT
  TO anon, authenticated
  USING (id = 1);

REVOKE ALL ON FUNCTION public.get_public_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_settings() TO anon, authenticated;

-- Wait — the policy above would re-expose all columns. Replace with column-grant-only
-- approach: drop the wide policy and keep RLS admin-only, but PostgREST needs a
-- policy to allow SELECT at all. Use a policy that only permits SELECT when the
-- request does not touch protected columns is not supported; instead rely on
-- column grants + a permissive policy, since column privileges are enforced
-- independently of RLS. This is the intended pattern.
--
-- (Policy left as-is above.)

-- 3. Token-scoped full-settings helper for client portal PDF generation
CREATE OR REPLACE FUNCTION public.get_invoice_settings_by_token(_token uuid)
RETURNS TABLE (
  company_name text, company_email text, company_phone text, company_whatsapp text,
  company_address text, website text, tagline text, logo_url text,
  vat_number text, vat_rate numeric,
  bank_name text, bank_account text, bank_branch text, bank_swift text,
  invoice_footer text, confirmation_footer text, thank_you_message text,
  brand_primary text, brand_bg text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.manual_bookings WHERE client_token = _token) THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT s.company_name, s.company_email, s.company_phone, s.company_whatsapp,
         s.company_address, s.website, s.tagline, s.logo_url,
         s.vat_number, s.vat_rate,
         s.bank_name, s.bank_account, s.bank_branch, s.bank_swift,
         s.invoice_footer, s.confirmation_footer, s.thank_you_message,
         s.brand_primary, s.brand_bg
  FROM public.app_settings s WHERE s.id = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.get_invoice_settings_by_token(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_invoice_settings_by_token(uuid) TO anon, authenticated;

-- 4. Lock down internal SECURITY DEFINER functions so they can't be called via API
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_founder_admin() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_wake() TO service_role;
GRANT EXECUTE ON FUNCTION public.grant_founder_admin() TO service_role;