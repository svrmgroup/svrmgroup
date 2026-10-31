ALTER TABLE public.enquiries ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.rental_requests ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.enquiries ADD CONSTRAINT enquiries_phone_required CHECK (phone IS NOT NULL AND length(regexp_replace(phone,'\D','','g')) >= 7) NOT VALID;
ALTER TABLE public.rental_requests ADD CONSTRAINT rental_requests_phone_required CHECK (phone IS NOT NULL AND length(regexp_replace(phone,'\D','','g')) >= 7) NOT VALID;
CREATE OR REPLACE FUNCTION public.upsert_contact_from_enquiry()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE c text; ci text; em text; ph text; existing uuid;
BEGIN
  SELECT country, iso INTO c, ci FROM public.country_from_phone(NEW.phone);
  em := nullif(lower(trim(coalesce(NEW.email,''))),'');
  ph := nullif(regexp_replace(coalesce(NEW.phone,''),'\D','','g'),'');
  IF em IS NOT NULL THEN
    SELECT id INTO existing FROM public.contacts WHERE lower(email) = em LIMIT 1;
  END IF;
  IF existing IS NULL AND ph IS NOT NULL THEN
    SELECT id INTO existing FROM public.contacts WHERE regexp_replace(coalesce(phone,''),'\D','','g') = ph LIMIT 1;
  END IF;
  IF existing IS NOT NULL THEN
    UPDATE public.contacts SET
      name = NEW.name,
      email = COALESCE(contacts.email, em),
      phone = COALESCE(NEW.phone, contacts.phone),
      country = COALESCE(c, contacts.country),
      country_iso = COALESCE(ci, contacts.country_iso),
      source_page = COALESCE(NEW.source_page, contacts.source_page),
      last_enquiry_at = NEW.created_at,
      enquiry_count = contacts.enquiry_count + 1
    WHERE id = existing;
  ELSE
    INSERT INTO public.contacts (name, email, phone, country, country_iso, source_page, first_enquiry_at, last_enquiry_at)
    VALUES (NEW.name, em, NEW.phone, c, ci, NEW.source_page, NEW.created_at, NEW.created_at);
  END IF;
  RETURN NEW;
END;
$function$;