CREATE TABLE public.partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  business_name text,
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  proposed_rates text NOT NULL,
  availability text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  photo_paths text[] NOT NULL DEFAULT '{}',
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partner_status_chk CHECK (status IN ('new','reviewing','approved','declined')),
  CONSTRAINT partner_cat_chk CHECK (category IN ('vehicle','property','experience','professional')),
  CONSTRAINT partner_consent_chk CHECK (consent = true),
  CONSTRAINT partner_len_chk CHECK (length(full_name) <= 120 AND length(email) <= 255 AND length(phone) <= 40 AND length(description) <= 3000 AND length(proposed_rates) <= 1000 AND length(availability) <= 1000 AND length(location) <= 200 AND cardinality(photo_paths) <= 6)
);
GRANT INSERT ON public.partner_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.partner_applications TO authenticated;
GRANT ALL ON public.partner_applications TO service_role;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.partner_applications FOR INSERT TO anon, authenticated WITH CHECK (status = 'new' AND admin_notes IS NULL);
CREATE POLICY "Admins read" ON public.partner_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update" ON public.partner_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete" ON public.partner_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER partner_applications_touch BEFORE UPDATE ON public.partner_applications FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE POLICY "Anyone uploads partner photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'partner-photos');
CREATE POLICY "Admins read partner photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'partner-photos' AND public.has_role(auth.uid(),'admin'));