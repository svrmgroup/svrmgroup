DROP POLICY "Anyone can submit an enquiry" ON public.enquiries;
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND (email IS NULL OR length(email) BETWEEN 3 AND 255)
  AND length(subject) BETWEEN 1 AND 200
  AND length(message) BETWEEN 1 AND 2000
  AND phone IS NOT NULL AND length(phone) <= 40
  AND (source_page IS NULL OR length(source_page) <= 200));
DROP POLICY "Anyone can submit a rental request" ON public.rental_requests;
CREATE POLICY "Anyone can submit a rental request" ON public.rental_requests FOR INSERT TO anon, authenticated WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND (email IS NULL OR length(email) BETWEEN 3 AND 255)
  AND phone IS NOT NULL AND length(phone) <= 40
  AND (message IS NULL OR length(message) <= 2000)
  AND length(vehicle_slug) BETWEEN 1 AND 100
  AND length(vehicle_name) BETWEEN 1 AND 150
  AND length(pickup_location) BETWEEN 1 AND 200
  AND length(currency) <= 8
  AND return_date >= pickup_date
  AND COALESCE(array_length(extras, 1), 0) <= 30
  AND (estimated_total IS NULL OR (estimated_total >= 0 AND estimated_total <= 100000000)));