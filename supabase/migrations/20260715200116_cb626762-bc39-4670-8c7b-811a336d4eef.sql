
DO $$ BEGIN
  CREATE TYPE public.supplier_category AS ENUM ('transport','accommodation','tours','yachts','aviation','security','wellness','dining','events','photography','staffing','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.supplier_status AS ENUM ('active','pending','inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.suppliers_directory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  category public.supplier_category NOT NULL DEFAULT 'other',
  country text,
  city text,
  contact_name text,
  email text,
  phone text,
  whatsapp text,
  website text,
  services_offered text[] NOT NULL DEFAULT '{}',
  rate_notes text,
  rating smallint CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5)),
  status public.supplier_status NOT NULL DEFAULT 'active',
  preferred boolean NOT NULL DEFAULT false,
  last_contacted_at timestamptz,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers_directory TO authenticated;
GRANT ALL ON public.suppliers_directory TO service_role;

ALTER TABLE public.suppliers_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view suppliers_directory"
  ON public.suppliers_directory FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert suppliers_directory"
  ON public.suppliers_directory FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update suppliers_directory"
  ON public.suppliers_directory FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete suppliers_directory"
  ON public.suppliers_directory FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_suppliers_directory_touch
  BEFORE UPDATE ON public.suppliers_directory
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE INDEX idx_suppliers_directory_category ON public.suppliers_directory(category);
CREATE INDEX idx_suppliers_directory_status ON public.suppliers_directory(status);
CREATE INDEX idx_suppliers_directory_preferred ON public.suppliers_directory(preferred);
