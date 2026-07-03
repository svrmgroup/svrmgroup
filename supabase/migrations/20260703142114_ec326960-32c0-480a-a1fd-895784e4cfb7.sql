
-- 1. Set fixed search_path on pgmq wrapper functions that previously had none.
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

-- 2. Revoke default PUBLIC/anon/authenticated EXECUTE on internal SECURITY DEFINER
--    helpers. These are only called by edge functions running as service_role.
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb)              FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint)               FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb)   FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch()                   FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake()                       FROM PUBLIC, anon, authenticated;

-- 3. Re-grant EXECUTE explicitly to service_role for the internal callers.
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb)               TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint)               TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb)   TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch()                   TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_wake()                       TO service_role;

-- Note: public.has_role(uuid, app_role) intentionally remains executable by
-- authenticated because it is called from RLS policies; revoking EXECUTE
-- would break row-level authorization. Its search_path is already fixed.
