
-- MANUAL BOOKINGS
CREATE SEQUENCE IF NOT EXISTS public.manual_booking_seq START 1000;

CREATE TABLE public.manual_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE DEFAULT ('SVRM-' || lpad(nextval('public.manual_booking_seq')::text, 6, '0')),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(12,2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  confirmation_message TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_bookings TO authenticated;
GRANT ALL ON public.manual_bookings TO service_role;
GRANT USAGE ON SEQUENCE public.manual_booking_seq TO authenticated, service_role;

ALTER TABLE public.manual_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage manual bookings"
  ON public.manual_bookings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER manual_bookings_touch
  BEFORE UPDATE ON public.manual_bookings
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- B2B LEADS
CREATE TABLE public.b2b_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  emails TEXT[] NOT NULL DEFAULT '{}',
  place_id TEXT UNIQUE,
  rating NUMERIC(3,2),
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  search_query TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.b2b_leads TO authenticated;
GRANT ALL ON public.b2b_leads TO service_role;

ALTER TABLE public.b2b_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage b2b leads"
  ON public.b2b_leads FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER b2b_leads_touch
  BEFORE UPDATE ON public.b2b_leads
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE INDEX idx_b2b_leads_status ON public.b2b_leads(status);
CREATE INDEX idx_b2b_leads_created ON public.b2b_leads(created_at DESC);
