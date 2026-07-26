ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS quotation_footer text,
  ADD COLUMN IF NOT EXISTS quotation_validity_days integer DEFAULT 14;