import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, ChevronDown, Trash2 } from "lucide-react";

type Status = "new" | "in_progress" | "done" | "archived";

interface Row {
  id: string;
  vehicle_slug: string;
  vehicle_name: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  extras: string[];
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  currency: string;
  estimated_total: number | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
}

const STATUS_META: Record<Status, { label: string; className: string }> = {
  new: { label: "New", className: "bg-primary/20 text-gold border-primary/40" },
  in_progress: { label: "In progress", className: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
  done: { label: "Confirmed", className: "bg-green-500/10 text-green-300 border-green-500/30" },
  archived: { label: "Archived", className: "bg-muted/20 text-muted-foreground border-border/40" },
};

const AdminBookings = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rental_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Row[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id: string, patch: Partial<Row>) => {
    const { error } = await supabase.from("rental_requests").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("rental_requests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">Fleet</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Rental bookings</h1>
        </div>
        <p className="text-xs text-muted-foreground">{rows.length} total</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="border border-border/40 p-12 text-center text-sm text-muted-foreground">
          No bookings yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const open = openId === r.id;
            const meta = STATUS_META[r.status];
            return (
              <div key={r.id} className="border border-border/40 bg-surface-raised">
                <button onClick={() => setOpenId(open ? null : r.id)} className="w-full text-left p-5 flex items-center gap-4">
                  <span className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] border ${meta.className}`}>
                    {meta.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg truncate">{r.vehicle_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {new Date(r.pickup_date).toLocaleDateString()} → {new Date(r.return_date).toLocaleDateString()} · {r.name}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap hidden sm:inline">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                  <div className="border-t border-border/40 p-6 space-y-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div><p className="text-muted-foreground uppercase tracking-wider text-[9px] mb-1">Pickup</p><p>{r.pickup_location}</p></div>
                      <div><p className="text-muted-foreground uppercase tracking-wider text-[9px] mb-1">Dates</p><p>{r.pickup_date} → {r.return_date}</p></div>
                      <div><p className="text-muted-foreground uppercase tracking-wider text-[9px] mb-1">Estimate</p><p>{r.estimated_total ? `${r.currency} ${r.estimated_total.toLocaleString()}` : "—"}</p></div>
                      <div><p className="text-muted-foreground uppercase tracking-wider text-[9px] mb-1">Extras</p><p>{r.extras?.length ? r.extras.join(", ") : "—"}</p></div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs">
                      <a href={`mailto:${r.email}?subject=Re: ${encodeURIComponent(r.vehicle_name)} booking`} className="flex items-center gap-2 text-gold hover:underline">
                        <Mail className="h-3.5 w-3.5" /> {r.email}
                      </a>
                      {r.phone && <span className="text-muted-foreground">{r.phone}</span>}
                    </div>

                    {r.message && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-2">Guest note</p>
                        <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                      </div>
                    )}

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Status</span>
                      <select
                        value={r.status}
                        onChange={(e) => update(r.id, { status: e.target.value as Status })}
                        className="mt-2 w-full bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      >
                        {(Object.keys(STATUS_META) as Status[]).map((s) => (
                          <option key={s} value={s}>{STATUS_META[s].label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Internal notes</span>
                      <textarea
                        defaultValue={r.admin_notes || ""}
                        onBlur={(e) => e.target.value !== (r.admin_notes || "") && update(r.id, { admin_notes: e.target.value || null })}
                        rows={3}
                        className="mt-2 w-full bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </label>

                    <div className="flex justify-end">
                      <button onClick={() => remove(r.id)} className="flex items-center gap-2 text-xs text-destructive hover:underline">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
