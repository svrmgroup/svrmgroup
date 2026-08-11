-- 1. Activity log: admin-only inserts + server-derived actor fields
DROP POLICY IF EXISTS "Auth can insert own activity" ON public.activity_log;

CREATE POLICY "Admins can insert activity"
ON public.activity_log
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) AND actor_id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_activity_actor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.actor_id := auth.uid();
  NEW.actor_email := (SELECT email FROM auth.users WHERE id = auth.uid());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_activity_actor ON public.activity_log;
CREATE TRIGGER trg_set_activity_actor
BEFORE INSERT ON public.activity_log
FOR EACH ROW EXECUTE FUNCTION public.set_activity_actor();

-- 2. cms_items: scope admin management policy to authenticated role
DROP POLICY IF EXISTS "Admins manage cms_items" ON public.cms_items;

CREATE POLICY "Admins manage cms_items"
ON public.cms_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));