import { supabase } from "@/integrations/supabase/client";
import { trackingFields } from "@/lib/enquiryTracking";

/** Fire-and-forget log of a WhatsApp link click with its enquiry reference. Never blocks or throws. */
export const trackWhatsAppClick = (opts?: { sourceLabel?: string; path?: string; reference?: string }) => {
  try {
    const path = opts?.path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    void trackingFields(path)
      .then((fields) =>
        supabase.from("whatsapp_clicks").insert({
          path,
          referrer: typeof document !== "undefined" ? document.referrer || null : null,
          source_label: opts?.sourceLabel ?? null,
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          reference: opts?.reference ?? null,
          ...fields,
        }),
      )
      .then(() => undefined, () => undefined);
  } catch {
    // Never let analytics break the click.
  }
};
