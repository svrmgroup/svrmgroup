
CREATE TABLE public.admin_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  start_date date NOT NULL,
  end_date date NOT NULL,
  guest_name text,
  guest_contact text,
  location text,
  notes text,
  status text NOT NULL DEFAULT 'confirmed',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_bookings TO authenticated;
GRANT ALL ON public.admin_bookings TO service_role;

ALTER TABLE public.admin_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage bookings" ON public.admin_bookings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER admin_bookings_touch
BEFORE UPDATE ON public.admin_bookings
FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
