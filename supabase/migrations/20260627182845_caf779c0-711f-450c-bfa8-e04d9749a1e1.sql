DROP POLICY IF EXISTS "Anyone can submit a rental request" ON public.rental_requests;
CREATE POLICY "Anyone can submit a rental request"
ON public.rental_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND length(email) BETWEEN 3 AND 255
  AND (phone IS NULL OR length(phone) <= 40)
  AND (message IS NULL OR length(message) <= 2000)
  AND length(vehicle_slug) BETWEEN 1 AND 100
  AND length(vehicle_name) BETWEEN 1 AND 150
  AND length(pickup_location) BETWEEN 1 AND 200
  AND length(currency) <= 8
  AND return_date >= pickup_date
  AND coalesce(array_length(extras, 1), 0) <= 30
  AND (estimated_total IS NULL OR (estimated_total >= 0 AND estimated_total <= 100000000))
);