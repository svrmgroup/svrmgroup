
DROP POLICY IF EXISTS "Anyone can read safe settings columns" ON public.app_settings;

CREATE OR REPLACE FUNCTION public.get_public_settings()
 RETURNS TABLE(company_name text, company_email text, company_phone text, company_whatsapp text, company_address text, website text, tagline text, logo_url text, brand_primary text, brand_bg text, instagram_handle text, thank_you_message text, confirmation_footer text, invoice_footer text, portal_expiry_days integer, thank_you_title text, thank_you_signature text)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
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

REVOKE ALL ON FUNCTION public.get_public_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_settings() TO anon, authenticated;
