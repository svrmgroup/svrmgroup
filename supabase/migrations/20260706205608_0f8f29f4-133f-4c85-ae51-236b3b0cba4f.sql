DROP POLICY IF EXISTS "Anyone can insert a whatsapp click" ON public.whatsapp_clicks;
CREATE POLICY "Anyone can insert a whatsapp click" ON public.whatsapp_clicks
FOR INSERT
WITH CHECK (
  char_length(coalesce(path, '')) <= 500
  AND char_length(coalesce(source_label, '')) <= 200
  AND char_length(coalesce(referrer, '')) <= 1000
  AND char_length(coalesce(user_agent, '')) <= 1000
);