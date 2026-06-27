CREATE TABLE public.rental_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_slug TEXT NOT NULL,
  vehicle_name TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_location TEXT NOT NULL,
  extras TEXT[] NOT NULL DEFAULT '{}',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  estimated_total NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.rental_requests TO anon, authenticated;
GRANT ALL ON public.rental_requests TO service_role;

ALTER TABLE public.rental_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a rental request"
ON public.rental_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);