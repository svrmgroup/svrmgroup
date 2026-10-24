CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  country_iso text,
  source_page text,
  enquiry_count integer NOT NULL DEFAULT 1,
  first_enquiry_at timestamptz NOT NULL DEFAULT now(),
  last_enquiry_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX contacts_email_key ON public.contacts (lower(email));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage contacts"
ON public.contacts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER contacts_touch BEFORE UPDATE ON public.contacts
FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

CREATE OR REPLACE FUNCTION public.country_from_phone(_phone text)
RETURNS TABLE(country text, iso text)
LANGUAGE sql IMMUTABLE SET search_path TO 'public'
AS $fn$
  WITH d AS (SELECT regexp_replace(coalesce(_phone,''), '[^0-9+]', '', 'g') AS p),
  n AS (SELECT CASE WHEN p LIKE '+%' THEN p WHEN p LIKE '00%' THEN '+' || substr(p,3) ELSE '+' || p END AS p FROM d)
  SELECT v.country, v.iso FROM n, (VALUES
    ('+971','United Arab Emirates','AE'),('+966','Saudi Arabia','SA'),('+974','Qatar','QA'),
    ('+965','Kuwait','KW'),('+973','Bahrain','BH'),('+968','Oman','OM'),('+972','Israel','IL'),
    ('+852','Hong Kong','HK'),('+234','Nigeria','NG'),('+233','Ghana','GH'),('+254','Kenya','KE'),
    ('+255','Tanzania','TZ'),('+256','Uganda','UG'),('+260','Zambia','ZM'),('+263','Zimbabwe','ZW'),
    ('+258','Mozambique','MZ'),('+264','Namibia','NA'),('+267','Botswana','BW'),('+230','Mauritius','MU'),
    ('+212','Morocco','MA'),('+353','Ireland','IE'),('+358','Finland','FI'),('+420','Czechia','CZ'),
    ('+351','Portugal','PT'),
    ('+27','South Africa','ZA'),('+44','United Kingdom','GB'),('+49','Germany','DE'),('+33','France','FR'),
    ('+31','Netherlands','NL'),('+41','Switzerland','CH'),('+43','Austria','AT'),('+32','Belgium','BE'),
    ('+34','Spain','ES'),('+39','Italy','IT'),('+45','Denmark','DK'),('+46','Sweden','SE'),('+47','Norway','NO'),
    ('+48','Poland','PL'),('+30','Greece','GR'),('+90','Turkey','TR'),('+91','India','IN'),('+86','China','CN'),
    ('+65','Singapore','SG'),('+81','Japan','JP'),('+82','South Korea','KR'),('+61','Australia','AU'),
    ('+64','New Zealand','NZ'),('+55','Brazil','BR'),('+54','Argentina','AR'),('+52','Mexico','MX'),
    ('+56','Chile','CL'),('+20','Egypt','EG'),
    ('+7','Russia','RU'),('+1','United States','US')
  ) AS v(dial, country, iso)
  WHERE n.p LIKE v.dial || '%'
  ORDER BY length(v.dial) DESC LIMIT 1;
$fn$;

CREATE OR REPLACE FUNCTION public.upsert_contact_from_enquiry()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $fn$
DECLARE c text; ci text;
BEGIN
  SELECT country, iso INTO c, ci FROM public.country_from_phone(NEW.phone);
  INSERT INTO public.contacts (name, email, phone, country, country_iso, source_page, first_enquiry_at, last_enquiry_at)
  VALUES (NEW.name, lower(trim(NEW.email)), NEW.phone, c, ci, NEW.source_page, NEW.created_at, NEW.created_at)
  ON CONFLICT (lower(email)) DO UPDATE SET
    name = EXCLUDED.name,
    phone = COALESCE(EXCLUDED.phone, contacts.phone),
    country = COALESCE(EXCLUDED.country, contacts.country),
    country_iso = COALESCE(EXCLUDED.country_iso, contacts.country_iso),
    source_page = COALESCE(EXCLUDED.source_page, contacts.source_page),
    last_enquiry_at = EXCLUDED.last_enquiry_at,
    enquiry_count = contacts.enquiry_count + 1;
  RETURN NEW;
END;
$fn$;

CREATE TRIGGER trg_enquiry_capture_contact AFTER INSERT ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.upsert_contact_from_enquiry();