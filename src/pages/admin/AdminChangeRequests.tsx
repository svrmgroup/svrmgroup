import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, MessageCircle } from "lucide-react";

interface Req {
  id: string; booking_id: string; requested_by_name: string | null; requested_by_email: string | null;
  changes: Record<string, unknown>; message: string | null; status: string;
  admin_notes: string | null; created_at: string;
}
interface Booking { id: string; booking_code: string; client_name: string; }

const AdminChangeRequests = () => {
  const [rows, setRows] = useState<Req[]>([]);
  const [bookings, setBookings] = useState<Record<string, Booking>>({});
  const [loading, setLoading] = useState(true);
  const [statusF, setStatusF] = useState<string>("pending");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("booking_change_requests" as any).select("*").order("created_at", { ascending: false });
    if (error) { setLoading(false); return toast.error(error.message); }
    setRows((data as any) || []);
    const ids = Array.from(new Set((data as any || []).map((r: Req) => r.booking_id)));
    if (ids.length) {
      const { data: bs } = await supabase.from("manual_bookings").select("id, booking_code, client_name").in("id", ids as string[]);
      const map: Record<string, Booking> = {};
      (bs || []).forEach((b: any) => { map[b.id] = b; });
      setBookings(map);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => statusF === "all" || r.status === statusF);

  const decide = async (r: Req, decision: "approved" | "declined") => {
    const notes = decision === "declined" ? prompt("Reason (optional):") || "" : "";
    const { data: userData } = await supabase.auth.getUser();
    if (decision === "approved") {
      const patch: Record<string, unknown> = {};
      if (r.changes && typeof r.changes === "object") {
        const c: any = r.changes;
        if (c.start_date) patch.start_date = c.start_date;
        if (c.end_date) patch.end_date = c.end_date;
        if (c.notes) patch.notes = c.notes;
      }
      if (Object.keys(patch).length) {
        await supabase.from("manual_bookings").update(patch as any).eq("id", r.booking_id);
      }
    }
    const { error } = await supabase.from("booking_change_requests" as any).update({
      status: decision, admin_notes: notes || null,
      reviewed_by: userData.user?.id ?? null, reviewed_at: new Date().toISOString(),
    }).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success(`Request ${decision}`);
    load();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Client requests</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Change requests</h1>
        </div>
        <div className="flex gap-2">
          {["pending","approved","declined","all"].map(s => (
            <button key={s} onClick={() => setStatusF(s)} className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border capitalize ${statusF === s ? "border-primary bg-primary/10 text-gold" : "border-border/40 text-muted-foreground"}`}>{s}</button>
          ))}
        </div>
      </header>

      {loading ? <p className="text-xs text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
        <div className="card-luxury p-8 text-center text-xs text-muted-foreground">No {statusF} requests.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const b = bookings[r.booking_id];
            return (
              <div key={r.id} className="card-luxury p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg">{b?.booking_code || "Booking"} — {b?.client_name || r.requested_by_name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()} · {r.status}</p>
                  </div>
                  {r.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => decide(r, "approved")} className="btn-luxury text-xs flex items-center gap-1"><Check className="h-3.5 w-3.5"/> Approve</button>
                      <button onClick={() => decide(r, "declined")} className="btn-ghost text-xs flex items-center gap-1"><X className="h-3.5 w-3.5"/> Decline</button>
                    </div>
                  )}
                </div>
                {r.message && <p className="text-sm mt-3 text-muted-foreground italic">"{r.message}"</p>}
                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  {Object.entries(r.changes || {}).map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <span className="text-muted-foreground uppercase tracking-[0.2em] text-[9px]">{k}</span>
                      <p>{String(v)}</p>
                    </div>
                  ))}
                </div>
                {r.requested_by_email && (
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                    <MessageCircle className="h-3.5 w-3.5"/> {r.requested_by_email}
                  </p>
                )}
                {r.admin_notes && <p className="text-xs mt-2 text-muted-foreground">Admin note: {r.admin_notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminChangeRequests;
