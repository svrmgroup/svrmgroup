import { supabase } from "@/integrations/supabase/client";

/** Fire-and-forget log of a WhatsApp link click. */
export const trackWhatsAppClick = (opts?: { sourceLabel?: string; path?: string }) => {
  try {
    void supabase.from("whatsapp_clicks").insert({
      path: opts?.path ?? (typeof window !== "undefined" ? window.location.pathname : null),
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      source_label: opts?.sourceLabel ?? null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  } catch {
    // Never let analytics break the click.
  }
};
