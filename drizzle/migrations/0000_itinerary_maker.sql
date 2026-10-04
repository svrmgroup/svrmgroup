CREATE TABLE public.itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL DEFAULT '',
  booking_code text,
  booking_id uuid REFERENCES public.manual_bookings(id) ON DELETE SET NULL,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'draft',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itineraries TO authenticated;
GRANT ALL ON public.itineraries TO service_role;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage itineraries" ON public.itineraries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER itineraries_touch BEFORE UPDATE ON public.itineraries FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE INDEX itineraries_booking_idx ON public.itineraries(booking_id);

CREATE TABLE public.itinerary_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  title text,
  category text NOT NULL DEFAULT 'Experiences',
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itinerary_images TO authenticated;
GRANT ALL ON public.itinerary_images TO service_role;
ALTER TABLE public.itinerary_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage itinerary images" ON public.itinerary_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));