import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const seen = new Set<string>();

function notify(title: string, body: string) {
  toast(title, { description: body });
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      new Notification(title, { body, icon: "/svrm-icon-192.png", badge: "/svrm-icon-192.png", tag: title });
    } catch {
      /* ignore */
    }
  }
}

export function useAdminNotifications(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      // Request quietly; user can grant later from browser.
      Notification.requestPermission().catch(() => {});
    }

    const channel = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "enquiries" }, (p) => {
        const r: any = p.new;
        if (seen.has(r.id)) return;
        seen.add(r.id);
        notify("New enquiry", `${r.name} — ${r.subject}`);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "rental_requests" }, (p) => {
        const r: any = p.new;
        if (seen.has(r.id)) return;
        seen.add(r.id);
        notify("New rental request", `${r.name} — ${r.vehicle_name}`);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "manual_bookings" }, (p) => {
        const r: any = p.new;
        if (seen.has(r.id)) return;
        seen.add(r.id);
        notify("Manual booking created", `${r.booking_code} — ${r.client_name}`);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled]);
}
