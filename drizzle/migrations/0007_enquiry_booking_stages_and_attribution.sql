ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS reference text,
  ADD COLUMN IF NOT EXISTS service text,
  ADD COLUMN IF NOT EXISTS party_size integer,
  ADD COLUMN IF NOT EXISTS chauffeur_days integer,
  ADD COLUMN IF NOT EXISTS gclid text,
  ADD COLUMN IF NOT EXISTS gbraid text,
  ADD COLUMN IF NOT EXISTS wbraid text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS landing_path text,
  ADD COLUMN IF NOT EXISTS ad_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS channel text NOT NULL DEFAULT 'form',
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS qualified_at timestamptz,
  ADD COLUMN IF NOT EXISTS quote_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS deposit_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS quote_amount numeric,
  ADD COLUMN IF NOT EXISTS booking_value numeric,
  ADD COLUMN IF NOT EXISTS direct_costs numeric,
  ADD COLUMN IF NOT EXISTS is_employment boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_duplicate boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS duplicate_of uuid REFERENCES public.enquiries(id) ON DELETE SET NULL;

ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS contribution numeric GENERATED ALWAYS AS (booking_value - COALESCE(direct_costs, 0)) STORED;

ALTER TABLE public.enquiries
  ADD CONSTRAINT enquiries_stage_chk CHECK (stage IN ('new','qualified','quote_sent','deposit_paid','completed','lost')),
  ADD CONSTRAINT enquiries_channel_chk CHECK (channel IN ('form','whatsapp')),
  ADD CONSTRAINT enquiries_reference_chk CHECK (reference IS NULL OR reference ~ '^SV-[A-Z0-9]{5,8}$'),
  ADD CONSTRAINT enquiries_party_chk CHECK (party_size IS NULL OR party_size BETWEEN 1 AND 200),
  ADD CONSTRAINT enquiries_days_chk CHECK (chauffeur_days IS NULL OR chauffeur_days BETWEEN 0 AND 90),
  ADD CONSTRAINT enquiries_attr_len_chk CHECK (
    char_length(COALESCE(service,'')) <= 40 AND char_length(COALESCE(gclid,'')) <= 200 AND
    char_length(COALESCE(gbraid,'')) <= 200 AND char_length(COALESCE(wbraid,'')) <= 200 AND
    char_length(COALESCE(utm_source,'')) <= 120 AND char_length(COALESCE(utm_medium,'')) <= 120 AND
    char_length(COALESCE(utm_campaign,'')) <= 200 AND char_length(COALESCE(utm_term,'')) <= 200 AND
    char_length(COALESCE(landing_path,'')) <= 300);

CREATE INDEX IF NOT EXISTS enquiries_reference_idx ON public.enquiries (reference);
CREATE INDEX IF NOT EXISTS enquiries_stage_idx ON public.enquiries (stage);
CREATE INDEX IF NOT EXISTS enquiries_duplicate_of_idx ON public.enquiries (duplicate_of);
CREATE INDEX IF NOT EXISTS enquiries_phone_created_idx ON public.enquiries (phone, created_at);

-- Prepare every new enquiry: visitors cannot set stages, money or flags; detect employment and repeats.
CREATE OR REPLACE FUNCTION public.enquiries_prepare()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _digits text;
  _first uuid;
  _text text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.stage := 'new';
    NEW.qualified_at := NULL; NEW.quote_sent_at := NULL; NEW.deposit_paid_at := NULL; NEW.completed_at := NULL;
    NEW.quote_amount := NULL; NEW.booking_value := NULL; NEW.direct_costs := NULL;
    NEW.is_duplicate := false; NEW.duplicate_of := NULL;
    NEW.channel := 'form';
    IF NOT NEW.ad_consent THEN NEW.gclid := NULL; NEW.gbraid := NULL; NEW.wbraid := NULL; END IF;
  END IF;

  _text := lower(COALESCE(NEW.subject,'') || ' ' || COALESCE(NEW.message,''));
  IF _text ~ '\m(job|jobs|vacancy|vacancies|career|careers|salary|cv|resume|internship|learnership|recruitment|stellenangebot|bewerbung)\M'
     OR _text ~ '(driver wanted|drivers wanted|chauffeur wanted|looking for work|looking for a job|apply for a job|employment opportunit)' THEN
    NEW.is_employment := true;
  END IF;

  _digits := regexp_replace(COALESCE(NEW.phone,''), '\D', '', 'g');
  IF length(_digits) >= 7 THEN
    SELECT e.id INTO _first FROM public.enquiries e
     WHERE regexp_replace(COALESCE(e.phone,''), '\D', '', 'g') = _digits
       AND e.created_at > now() - interval '72 hours'
       AND COALESCE(e.service,'') = COALESCE(NEW.service,'')
     ORDER BY e.created_at ASC LIMIT 1;
    IF _first IS NOT NULL THEN
      NEW.is_duplicate := true; NEW.duplicate_of := _first;
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_enquiries_prepare ON public.enquiries;
CREATE TRIGGER trg_enquiries_prepare BEFORE INSERT ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.enquiries_prepare();

-- Stamp the date each booking stage is first reached (earlier stages implied).
CREATE OR REPLACE FUNCTION public.enquiries_stage_stamp()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.stage IS DISTINCT FROM OLD.stage THEN
    IF NEW.stage IN ('qualified','quote_sent','deposit_paid','completed') THEN NEW.qualified_at := COALESCE(NEW.qualified_at, now()); END IF;
    IF NEW.stage IN ('quote_sent','deposit_paid','completed') THEN NEW.quote_sent_at := COALESCE(NEW.quote_sent_at, now()); END IF;
    IF NEW.stage IN ('deposit_paid','completed') THEN NEW.deposit_paid_at := COALESCE(NEW.deposit_paid_at, now()); END IF;
    IF NEW.stage = 'completed' THEN NEW.completed_at := COALESCE(NEW.completed_at, now()); END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_enquiries_stage_stamp ON public.enquiries;
CREATE TRIGGER trg_enquiries_stage_stamp BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.enquiries_stage_stamp();

-- WhatsApp taps: reference and attribution for matching conversations.
ALTER TABLE public.whatsapp_clicks
  ADD COLUMN IF NOT EXISTS reference text,
  ADD COLUMN IF NOT EXISTS service text,
  ADD COLUMN IF NOT EXISTS gclid text,
  ADD COLUMN IF NOT EXISTS gbraid text,
  ADD COLUMN IF NOT EXISTS wbraid text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS landing_path text,
  ADD COLUMN IF NOT EXISTS ad_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS enquiry_id uuid REFERENCES public.enquiries(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS whatsapp_clicks_reference_idx ON public.whatsapp_clicks (reference);
CREATE INDEX IF NOT EXISTS whatsapp_clicks_enquiry_idx ON public.whatsapp_clicks (enquiry_id);
CREATE INDEX IF NOT EXISTS whatsapp_clicks_created_idx ON public.whatsapp_clicks (created_at);

DROP POLICY IF EXISTS "Anyone can insert a whatsapp click" ON public.whatsapp_clicks;
CREATE POLICY "Anyone can insert a whatsapp click" ON public.whatsapp_clicks
  FOR INSERT TO public
  WITH CHECK (
    char_length(COALESCE(path,'')) <= 500 AND char_length(COALESCE(source_label,'')) <= 200 AND
    char_length(COALESCE(referrer,'')) <= 1000 AND char_length(COALESCE(user_agent,'')) <= 1000 AND
    (reference IS NULL OR reference ~ '^SV-[A-Z0-9]{5,8}$') AND
    char_length(COALESCE(service,'')) <= 40 AND char_length(COALESCE(gclid,'')) <= 200 AND
    char_length(COALESCE(gbraid,'')) <= 200 AND char_length(COALESCE(wbraid,'')) <= 200 AND
    char_length(COALESCE(utm_source,'')) <= 120 AND char_length(COALESCE(utm_medium,'')) <= 120 AND
    char_length(COALESCE(utm_campaign,'')) <= 200 AND char_length(COALESCE(utm_term,'')) <= 200 AND
    char_length(COALESCE(landing_path,'')) <= 300 AND enquiry_id IS NULL AND
    (ad_consent OR (gclid IS NULL AND gbraid IS NULL AND wbraid IS NULL))
  );

GRANT UPDATE ON public.whatsapp_clicks TO authenticated;
CREATE POLICY "Admins can link whatsapp clicks" ON public.whatsapp_clicks
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));