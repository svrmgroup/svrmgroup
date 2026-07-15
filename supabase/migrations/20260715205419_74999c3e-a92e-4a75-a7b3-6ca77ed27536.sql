
-- 1. Extend app_settings with editable business identity used across invoices, emails, portal
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS tagline text DEFAULT 'Every experience, uniquely curated for you',
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS website text DEFAULT 'https://svrm.group',
  ADD COLUMN IF NOT EXISTS company_whatsapp text DEFAULT '+27 73 064 1481',
  ADD COLUMN IF NOT EXISTS thank_you_message text DEFAULT 'Thank you for choosing SVRM. Our concierge team will be in touch shortly with next steps. We look forward to curating an unforgettable experience for you.',
  ADD COLUMN IF NOT EXISTS confirmation_footer text DEFAULT 'This confirmation constitutes acceptance of the SVRM Group terms of service.',
  ADD COLUMN IF NOT EXISTS portal_expiry_days integer DEFAULT 30,
  ADD COLUMN IF NOT EXISTS instagram_handle text DEFAULT '@svrmgroup';

-- Allow public read of a limited settings row so the portal / invoice can render for guests
DROP POLICY IF EXISTS "Public read app settings" ON public.app_settings;
CREATE POLICY "Public read app settings" ON public.app_settings
  FOR SELECT USING (true);

GRANT SELECT ON public.app_settings TO anon;

-- 2. Portal expiry fields on manual_bookings
ALTER TABLE public.manual_bookings
  ADD COLUMN IF NOT EXISTS portal_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS portal_completed_at timestamptz;

-- Set default portal_expires_at when a booking is created / updated with end_date
CREATE OR REPLACE FUNCTION public.set_portal_expiry()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE d integer;
BEGIN
  SELECT COALESCE(portal_expiry_days, 30) INTO d FROM public.app_settings WHERE id = 1;
  IF NEW.portal_expires_at IS NULL THEN
    NEW.portal_expires_at := COALESCE(NEW.end_date::timestamptz, now()::date::timestamptz) + make_interval(days => COALESCE(d, 30));
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_set_portal_expiry ON public.manual_bookings;
CREATE TRIGGER trg_set_portal_expiry BEFORE INSERT ON public.manual_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_portal_expiry();

-- Backfill for existing rows
UPDATE public.manual_bookings
  SET portal_expires_at = COALESCE(end_date::timestamptz, created_at::date::timestamptz) + interval '30 days'
  WHERE portal_expires_at IS NULL;

-- 3. Founder auto-admin grant for salim@svrm.group
CREATE OR REPLACE FUNCTION public.grant_founder_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'salim@svrm.group' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created_founder ON auth.users;
CREATE TRIGGER on_auth_user_created_founder
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_founder_admin();

DROP TRIGGER IF EXISTS on_auth_user_confirmed_founder ON auth.users;
CREATE TRIGGER on_auth_user_confirmed_founder
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.grant_founder_admin();

-- Grant now if the account already exists and is verified
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE lower(u.email) = 'salim@svrm.group'
  AND u.email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Add gallery_urls to cms_items for multi-image support (media library groundwork)
ALTER TABLE public.cms_items
  ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT ARRAY[]::text[];

-- Public should be able to read published items (already exists but ensure)
GRANT SELECT ON public.cms_items TO anon;
