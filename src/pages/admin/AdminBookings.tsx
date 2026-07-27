import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, ChevronDown, Trash2, Plus, FileText, FileSignature, X } from "lucide-react";
import RentalAgreementDialog from "@/components/svrm/RentalAgreementDialog";
import PdfEditorDialog from "@/components/svrm/PdfEditorDialog";

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
  const [creating, setCreating] = useState(false);
  const [agreementFor, setAgreementFor] = useState<Row | null>(null);
  const [quoteFor, setQuoteFor] = useState<Row | null>(null);

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
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted-foreground">{rows.length} total</p>
          <button onClick={() => setCreating(true)} className="btn-luxury text-xs flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" /> New rental request
          </button>
        </div>
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

                    <div className="flex flex-wrap justify-end gap-3">
                      <button onClick={() => setQuoteFor(r)} className="flex items-center gap-2 text-xs text-gold border border-primary/40 px-3 py-2 hover:bg-primary/10 transition-colors">
                        <FileText className="h-3.5 w-3.5" /> Quotation PDF
                      </button>
                      <button onClick={() => setAgreementFor(r)} className="flex items-center gap-2 text-xs text-gold border border-primary/40 px-3 py-2 hover:bg-primary/10 transition-colors">
                        <FileSignature className="h-3.5 w-3.5" /> Rental agreement
                      </button>
                      <button onClick={() => remove(r.id)} className="flex items-center gap-2 text-xs text-destructive hover:underline px-3 py-2">
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

      {creating && <NewRentalRequest onClose={() => setCreating(false)} onCreated={load} />}

      {agreementFor && (
        <RentalAgreementDialog
          initial={{
            renter_name: agreementFor.name,
            renter_email: agreementFor.email,
            renter_phone: agreementFor.phone || "",
            vehicle: agreementFor.vehicle_name,
            collection_at: agreementFor.pickup_date,
            return_at: agreementFor.return_date,
            collection_location: agreementFor.pickup_location,
            return_location: agreementFor.pickup_location,
            currency: agreementFor.currency,
            total: agreementFor.estimated_total ?? 0,
            balance_due: agreementFor.estimated_total ?? 0,
            days: Math.max(1, Math.round((new Date(agreementFor.return_date).getTime() - new Date(agreementFor.pickup_date).getTime()) / 864e5)),
            notes: agreementFor.extras?.length ? `Extras: ${agreementFor.extras.join(", ")}` : "",
          }}
          onClose={() => setAgreementFor(null)}
        />
      )}

      {quoteFor && (
        <PdfEditorDialog
          kind="quotation"
          booking={{
            booking_code: `Q-${quoteFor.id.slice(0, 6).toUpperCase()}`,
            client_name: quoteFor.name,
            client_email: quoteFor.email,
            client_phone: quoteFor.phone,
            start_date: quoteFor.pickup_date,
            end_date: quoteFor.return_date,
            currency: quoteFor.currency,
            subtotal: quoteFor.estimated_total ?? 0,
            deposit_amount: Math.round((quoteFor.estimated_total ?? 0) * 0.5),
            balance_due: Math.round((quoteFor.estimated_total ?? 0) * 0.5),
            notes: quoteFor.message,
            line_items: [
              { label: `${quoteFor.vehicle_name} self-drive rental`, qty: 1, unit: "rental", subtotal: quoteFor.estimated_total ?? 0 },
              ...(quoteFor.extras || []).map((e) => ({ label: e, qty: 1, unit: "", subtotal: 0 })),
            ],
          }}
          onClose={() => setQuoteFor(null)}
        />
      )}
    </div>
  );
};

/** Manual rental request entry — same shape as a request submitted from the site. */
function NewRentalRequest({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    name: "", email: "", phone: "", vehicle_name: "", pickup_date: today, return_date: today,
    pickup_location: "", currency: "ZAR", estimated_total: "", extras: "", message: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!f.name.trim() || !f.vehicle_name.trim()) return toast.error("Client name and vehicle are required");
    setSaving(true);
    const { error } = await supabase.from("rental_requests").insert({
      name: f.name.trim(),
      email: f.email.trim() || "manual@svrm.group",
      phone: f.phone.trim() || null,
      vehicle_name: f.vehicle_name.trim(),
      vehicle_slug: f.vehicle_name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      pickup_date: f.pickup_date,
      return_date: f.return_date,
      pickup_location: f.pickup_location.trim() || "TBC",
      currency: f.currency,
      estimated_total: f.estimated_total ? Number(f.estimated_total) : null,
      extras: f.extras ? f.extras.split(",").map((x) => x.trim()).filter(Boolean) : [],
      message: f.message.trim() || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Rental request added");
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-deep border border-border/60 w-full max-w-2xl my-8">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <h2 className="font-serif text-2xl">New rental request</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 grid md:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
          <In label="Client name" value={f.name} onChange={(v) => set("name", v)} />
          <In label="Email" value={f.email} onChange={(v) => set("email", v)} />
          <In label="Phone" value={f.phone} onChange={(v) => set("phone", v)} />
          <In label="Vehicle" value={f.vehicle_name} onChange={(v) => set("vehicle_name", v)} />
          <In label="Pickup date" type="date" value={f.pickup_date} onChange={(v) => set("pickup_date", v)} />
          <In label="Return date" type="date" value={f.return_date} onChange={(v) => set("return_date", v)} />
          <In label="Pickup location" value={f.pickup_location} onChange={(v) => set("pickup_location", v)} />
          <In label="Currency" value={f.currency} onChange={(v) => set("currency", v)} />
          <In label="Estimated total" type="number" value={f.estimated_total} onChange={(v) => set("estimated_total", v)} />
          <In label="Extras (comma separated)" value={f.extras} onChange={(v) => set("extras", v)} />
          <label className="md:col-span-2 block">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notes</span>
            <textarea rows={3} value={f.message} onChange={(e) => set("message", e.target.value)} className="input-luxury text-sm w-full mt-1" />
          </label>
        </div>
        <div className="p-5 border-t border-border/40 flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost text-xs">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-luxury text-xs disabled:opacity-50">{saving ? "Saving…" : "Add request"}</button>
        </div>
      </div>
    </div>
  );
}

function In({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-luxury text-sm w-full mt-1" />
    </label>
  );
}

export default AdminBookings;
