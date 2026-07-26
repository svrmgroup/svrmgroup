import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addNotification, playChime, showOsNotification } from "@/lib/adminNotifications";

/**
 * Live-subscribes the admin console to new client activity and raises
 * an in-app toast, a bell entry and (when permitted) an OS pop-up.
 */
export function useAdminNotifications(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const push = (kind: any, id: string, title: string, body: string, href: string) => {
      const isNew = addNotification({ id: `${kind}:${id}`, kind, title, body, href });
      if (!isNew) return;
      toast(title, { description: body });
      playChime();
      void showOsNotification(title, body, `${kind}:${id}`, href);
    };

    const channel = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "enquiries" }, (p) => {
        const r: any = p.new;
        push("enquiry", r.id, "New enquiry", `${r.name || "Someone"} — ${r.subject || r.message?.slice(0, 60) || "New enquiry"}`, "/admin/enquiries");
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "rental_requests" }, (p) => {
        const r: any = p.new;
        push("rental", r.id, "New rental request", `${r.name || "Someone"} — ${r.vehicle_name || "vehicle"}`, "/admin/bookings");
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "manual_bookings" }, (p) => {
        const r: any = p.new;
        push("manual_booking", r.id, "Manual booking created", `${r.booking_code} — ${r.client_name}`, "/admin/manual");
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "booking_change_requests" }, (p) => {
        const r: any = p.new;
        push("change_request", r.id, "New change request", r.message?.slice(0, 80) || "A booking change was requested", "/admin/change-requests");
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled]);
}
