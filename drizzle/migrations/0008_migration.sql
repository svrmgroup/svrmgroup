CREATE OR REPLACE FUNCTION public.upsert_contact_from_enquiry()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE c text; ci text; em text; ph text; existing uuid; is_admin boolean;
BEGIN
  SELECT country, iso INTO c, ci FROM public.country_from_phone(NEW.phone);
  em := nullif(lower(trim(coalesce(NEW.email,''))),'');
  ph := nullif(regexp_replace(coalesce(NEW.phone,''),'\D','','g'),'');
  is_admin := auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin');
  IF em IS NOT NULL THEN
    SELECT id INTO existing FROM public.contacts WHERE lower(email) = em LIMIT 1;
  END IF;
  IF existing IS NULL AND ph IS NOT NULL THEN
    SELECT id INTO existing FROM public.contacts WHERE regexp_replace(coalesce(phone,''),'\D','','g') = ph LIMIT 1;
  END IF;
  IF existing IS NOT NULL THEN
    IF is_admin THEN
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
      -- Public submissions cannot prove who they are: never overwrite saved details,
      -- only fill empty fields and record the new enquiry.
      UPDATE public.contacts SET
        name = COALESCE(nullif(contacts.name,''), NEW.name),
        email = COALESCE(contacts.email, em),
        phone = COALESCE(contacts.phone, NEW.phone),
        country = COALESCE(contacts.country, c),
        country_iso = COALESCE(contacts.country_iso, ci),
        source_page = COALESCE(contacts.source_page, NEW.source_page),
        last_enquiry_at = NEW.created_at,
        enquiry_count = contacts.enquiry_count + 1
      WHERE id = existing;
    END IF;
  ELSE
    INSERT INTO public.contacts (name, email, phone, country, country_iso, source_page, first_enquiry_at, last_enquiry_at)
    VALUES (NEW.name, em, NEW.phone, c, ci, NEW.source_page, NEW.created_at, NEW.created_at);
  END IF;
  RETURN NEW;
END;
$function$;