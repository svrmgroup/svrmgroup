import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, ChevronDown, Trash2 } from "lucide-react";

type Status = "new" | "in_progress" | "done" | "archived";

interface Row {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  source_page: string | null;
  status: Status;
  admin_notes: string | null;
  booking_date: string | null;
  created_at: string;
}

const STATUS_META: Record<Status, { label: string; className: string }> = {
  new: { label: "New", className: "bg-primary/20 text-gold border-primary/40" },
  in_progress: { label: "In progress", className: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
  done: { label: "Done", className: "bg-green-500/10 text-green-300 border-green-500/30" },
  archived: { label: "Archived", className: "bg-muted/20 text-muted-foreground border-border/40" },
};

const AdminEnquiries = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("enquiries")
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
    const { error } = await supabase.from("enquiries").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const counts = rows.reduce(
    (a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a),
    {} as Record<string, number>,
  );

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Enquiries</h1>
        </div>
        <p className="text-xs text-muted-foreground">{rows.length} total</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {(["all", "new", "in_progress", "done", "archived"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.22em] border transition-colors ${
              filter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "all" ? "All" : STATUS_META[s].label} {s !== "all" && counts[s] ? `· ${counts[s]}` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="border border-border/40 p-12 text-center text-sm text-muted-foreground">
          No enquiries here yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const open = openId === r.id;
            const meta = STATUS_META[r.status];
            return (
              <div key={r.id} className="border border-border/40 bg-surface-raised">
                <button
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="w-full text-left p-5 flex items-center gap-4"
                >
                  <span className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] border ${meta.className}`}>
                    {meta.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg truncate">{r.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.name} · {r.email} {r.phone ? `· ${r.phone}` : ""}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div className="border-t border-border/40 p-6 space-y-5">
                    <div className="flex flex-wrap gap-4 text-xs">
                      <a href={`mailto:${r.email}?subject=Re: ${encodeURIComponent(r.subject)}`}
                         className="flex items-center gap-2 text-gold hover:underline">
                        <Mail className="h-3.5 w-3.5" /> Reply via email
                      </a>
                      {r.phone && (
                        <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 text-gold hover:underline">
                          <Phone className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                      )}
                      {r.source_page && (
                        <span className="text-muted-foreground">From: {r.source_page}</span>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-2">Message</p>
                      <p className="text-sm whitespace-pre-wrap text-foreground/90">{r.message}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Booking date (optional)</span>
                        <input
                          type="date"
                          value={r.booking_date || ""}
                          onChange={(e) => update(r.id, { booking_date: e.target.value || null })}
                          className="mt-2 w-full bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                      </label>
                    </div>

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
                      <button
                        onClick={() => remove(r.id)}
                        className="flex items-center gap-2 text-xs text-destructive hover:underline"
                      >
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

export default AdminEnquiries;
