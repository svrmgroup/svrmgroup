-- Ensure no broad public privileges exist on the enquiries table
REVOKE ALL ON public.enquiries FROM PUBLIC;
REVOKE ALL ON public.enquiries FROM anon;
REVOKE ALL ON public.enquiries FROM authenticated;

-- Grant only what RLS policies allow:
-- anon: submit enquiries via the public form
GRANT INSERT ON public.enquiries TO anon;
-- authenticated: all CRUD, but admin-only rows enforced by RLS policies
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
-- service_role: full access for edge functions / admin scripts
GRANT ALL ON public.enquiries TO service_role;