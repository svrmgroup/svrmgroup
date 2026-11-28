CREATE TABLE public.listing_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_kind text NOT NULL CHECK (listing_kind IN ('vehicle','stay','tour','service')),
  listing_slug text NOT NULL CHECK (length(listing_slug) BETWEEN 1 AND 200),
  storage_path text NOT NULL,
  caption text CHECK (caption IS NULL OR length(caption) <= 300),
  alt_text text CHECK (alt_text IS NULL OR length(alt_text) <= 300),
  sort_order integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX listing_photos_listing_idx ON public.listing_photos (listing_kind, listing_slug, sort_order);
GRANT SELECT ON public.listing_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_photos TO authenticated;
GRANT ALL ON public.listing_photos TO service_role;
ALTER TABLE public.listing_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view listing photos" ON public.listing_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage listing photos" ON public.listing_photos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER listing_photos_touch BEFORE UPDATE ON public.listing_photos FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE POLICY "Anyone can view listing photo files" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'listing-photos');
CREATE POLICY "Admins upload listing photo files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'listing-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update listing photo files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'listing-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete listing photo files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'listing-photos' AND public.has_role(auth.uid(), 'admin'));