
-- Unified CMS items table for extensible content management
CREATE TABLE IF NOT EXISTS public.cms_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL, -- offers, blogs, aviation, yachts, security, experiences, home_hero, home_intro
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  eyebrow TEXT,
  summary TEXT,
  description TEXT,
  image_url TEXT,
  price_zar NUMERIC,
  original_price_zar NUMERIC,
  price_prefix TEXT,
  price_suffix TEXT,
  cta_label TEXT,
  cta_href TEXT,
  category TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);

GRANT SELECT ON public.cms_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_items TO authenticated;
GRANT ALL ON public.cms_items TO service_role;

ALTER TABLE public.cms_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published cms_items"
  ON public.cms_items FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage cms_items"
  ON public.cms_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER cms_items_touch_updated_at
  BEFORE UPDATE ON public.cms_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE INDEX IF NOT EXISTS cms_items_kind_idx ON public.cms_items (kind, sort_order);
CREATE INDEX IF NOT EXISTS cms_items_published_idx ON public.cms_items (published);
