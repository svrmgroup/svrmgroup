DROP POLICY IF EXISTS "Anyone can view listing photos" ON public.listing_photos;
REVOKE SELECT ON public.listing_photos FROM anon;

CREATE OR REPLACE FUNCTION public.get_listing_photos(_kind text, _slug text)
RETURNS TABLE(id uuid, listing_kind text, listing_slug text, storage_path text, caption text, alt_text text, sort_order integer, is_cover boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.listing_kind, p.listing_slug, p.storage_path, p.caption, p.alt_text, p.sort_order, p.is_cover
  FROM public.listing_photos p
  WHERE p.listing_kind = _kind AND p.listing_slug = _slug
  ORDER BY p.sort_order, p.created_at;
$$;
GRANT EXECUTE ON FUNCTION public.get_listing_photos(text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_listed_photo_path(_path text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.listing_photos WHERE storage_path = _path);
$$;
GRANT EXECUTE ON FUNCTION public.is_listed_photo_path(text) TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view listing photo files" ON storage.objects;
CREATE POLICY "View files attached to listings" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'listing-photos' AND public.is_listed_photo_path(name));
CREATE POLICY "Admins view listing photo files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'listing-photos' AND public.has_role(auth.uid(), 'admin'));