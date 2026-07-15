
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS thank_you_title text,
  ADD COLUMN IF NOT EXISTS thank_you_signature text;

DROP FUNCTION IF EXISTS public.get_public_settings();
DROP FUNCTION IF EXISTS public.get_invoice_settings_by_token(uuid);

CREATE OR REPLACE FUNCTION public.get_public_settings()
 RETURNS TABLE(company_name text, company_email text, company_phone text, company_whatsapp text, company_address text, website text, tagline text, logo_url text, brand_primary text, brand_bg text, instagram_handle text, thank_you_message text, confirmation_footer text, invoice_footer text, portal_expiry_days integer, thank_you_title text, thank_you_signature text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT company_name, company_email, company_phone, company_whatsapp,
         company_address, website, tagline, logo_url,
         brand_primary, brand_bg, instagram_handle,
         thank_you_message, confirmation_footer, invoice_footer,
         portal_expiry_days,
         thank_you_title, thank_you_signature
  FROM public.app_settings WHERE id = 1;
$function$;

CREATE OR REPLACE FUNCTION public.get_invoice_settings_by_token(_token uuid)
 RETURNS TABLE(company_name text, company_email text, company_phone text, company_whatsapp text, company_address text, website text, tagline text, logo_url text, vat_number text, vat_rate numeric, bank_name text, bank_account text, bank_branch text, bank_swift text, invoice_footer text, confirmation_footer text, thank_you_message text, brand_primary text, brand_bg text, thank_you_title text, thank_you_signature text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
         s.brand_primary, s.brand_bg,
         s.thank_you_title, s.thank_you_signature
  FROM public.app_settings s WHERE s.id = 1;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_public_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_settings() TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_invoice_settings_by_token(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_invoice_settings_by_token(uuid) TO anon, authenticated;
