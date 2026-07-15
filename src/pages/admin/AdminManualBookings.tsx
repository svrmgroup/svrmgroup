import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Copy, MessageCircle, ChevronDown, FileDown, Link as LinkIcon, Clock, CheckCircle2 } from "lucide-react";
import { buildConfirmationMessage, type LineItem } from "@/lib/confirmationMessage";
import { downloadInvoicePdf, downloadConfirmationPdf, downloadThankYouPdf } from "@/lib/invoicePdf";

type Status = "draft" | "sent" | "deposit_paid" | "confirmed" | "completed" | "cancelled";

interface Booking {
  id: string;
  booking_code: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  line_items: LineItem[];
  currency: string;
  subtotal: number;
  deposit_amount: number;
  balance_due: number;
  start_date: string | null;
  end_date: string | null;
  status: Status;
  notes: string | null;
  confirmation_message: string | null;
  client_token: string | null;
  portal_expires_at?: string | null;
  portal_completed_at?: string | null;
  created_at: string;
}

const STATUS_META: Record<Status, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted/20 text-muted-foreground border-border/40" },
  sent: { label: "Sent", className: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
  deposit_paid: { label: "Deposit paid", className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30" },
  confirmed: { label: "Confirmed", className: "bg-green-500/10 text-green-300 border-green-500/30" },
  completed: { label: "Completed", className: "bg-primary/20 text-gold border-primary/40" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

const emptyItem = (): LineItem => ({ label: "", qty: 1, unit: "night", amount: 0 });

const AdminManualBookings = () => {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // form state
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    currency: "ZAR",
    start_date: "",
    end_date: "",
    deposit_amount: 0,
    notes: "",
  });
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("manual_bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const subtotal = items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const balance = Math.max(0, subtotal - (Number(form.deposit_amount) || 0));

  const resetForm = () => {
    setForm({ client_name: "", client_email: "", client_phone: "", currency: "ZAR", start_date: "", end_date: "", deposit_amount: 0, notes: "" });
    setItems([emptyItem()]);
  };

  const create = async () => {
    if (!form.client_name.trim()) return toast.error("Client name required");
    if (items.length === 0 || items.every((i) => !i.label.trim())) return toast.error("Add at least one line item");

    const cleanItems = items.filter((i) => i.label.trim()).map((i) => ({
      label: i.label.trim(),
      qty: Number(i.qty) || undefined,
      unit: i.unit?.trim() || undefined,
      amount: Number(i.amount) || 0,
    }));

    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("manual_bookings").insert({
      client_name: form.client_name.trim(),
      client_email: form.client_email.trim() || null,
      client_phone: form.client_phone.trim() || null,
      currency: form.currency,
      line_items: cleanItems as any,
      subtotal,
      deposit_amount: Number(form.deposit_amount) || 0,
      balance_due: balance,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      notes: form.notes.trim() || null,
      created_by: userData.user?.id,
    }).select().single();

    if (error) return toast.error(error.message);

    // Generate + save confirmation message
    const msg = buildConfirmationMessage({
      booking_code: data.booking_code,
      client_name: data.client_name,
      currency: data.currency,
      line_items: cleanItems,
      subtotal: Number(data.subtotal),
      deposit_amount: Number(data.deposit_amount),
      balance_due: Number(data.balance_due),
      start_date: data.start_date,
      end_date: data.end_date,
      notes: data.notes,
    });
    await supabase.from("manual_bookings").update({ confirmation_message: msg }).eq("id", data.id);

    toast.success(`Booking ${data.booking_code} created`);
    setShowForm(false);
    resetForm();
    load();
  };

  const update = async (id: string, patch: Partial<Booking>) => {
    const { error } = await supabase.from("manual_bookings").update(patch as any).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("manual_bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const copyMsg = (msg: string) => {
    navigator.clipboard.writeText(msg);
    toast.success("Message copied");
  };

  const whatsAppTo = (phone: string, msg: string) => {
    const num = phone.replace(/\D/g, "");
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">Concierge</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Manual bookings</h1>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs uppercase tracking-[0.24em] hover:bg-primary-glow transition-colors"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "New booking"}
        </button>
      </div>

      {showForm && (
        <div className="border border-border/40 bg-surface-raised p-6 mb-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Client name *">
              <input value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.client_email} onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Phone (WhatsApp)">
              <input placeholder="+27..." value={form.client_phone} onChange={(e) => setForm((f) => ({ ...f, client_phone: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Currency">
              <select value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} className={inputCls}>
                <option>ZAR</option><option>USD</option><option>EUR</option><option>GBP</option>
              </select>
            </Field>
            <Field label="Start date">
              <input type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="End date">
              <input type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} className={inputCls} />
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Line items</p>
              <button onClick={() => setItems((it) => [...it, emptyItem()])} className="text-xs text-gold hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input placeholder="e.g. Range Rover Sport" value={item.label}
                    onChange={(e) => setItems((it) => it.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                    className={`${inputCls} col-span-5`} />
                  <input type="number" placeholder="Qty" value={item.qty ?? ""}
                    onChange={(e) => setItems((it) => it.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) || undefined } : x))}
                    className={`${inputCls} col-span-1`} />
                  <input placeholder="Unit" value={item.unit ?? ""}
                    onChange={(e) => setItems((it) => it.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))}
                    className={`${inputCls} col-span-2`} />
                  <input type="number" placeholder="Amount" value={item.amount || ""}
                    onChange={(e) => setItems((it) => it.map((x, j) => j === i ? { ...x, amount: Number(e.target.value) || 0 } : x))}
                    className={`${inputCls} col-span-3`} />
                  <button onClick={() => setItems((it) => it.filter((_, j) => j !== i))} className="col-span-1 text-destructive hover:text-destructive/80 flex justify-center">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Field label="Deposit amount">
              <input type="number" value={form.deposit_amount || ""} onChange={(e) => setForm((f) => ({ ...f, deposit_amount: Number(e.target.value) || 0 }))} className={inputCls} />
            </Field>
            <div className="text-xs space-y-1">
              <p className="text-muted-foreground">Subtotal: <span className="text-foreground">{form.currency} {subtotal.toLocaleString()}</span></p>
              <p className="text-muted-foreground">Balance due: <span className="text-gold">{form.currency} {balance.toLocaleString()}</span></p>
            </div>
          </div>

          <Field label="Internal notes">
            <textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inputCls} />
          </Field>

          <button onClick={create} className="w-full px-6 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors">
            Create booking & generate message
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="border border-border/40 p-12 text-center text-sm text-muted-foreground">No manual bookings yet.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const open = openId === r.id;
            const meta = STATUS_META[r.status] || STATUS_META.draft;
            return (
              <div key={r.id} className="border border-border/40 bg-surface-raised">
                <button onClick={() => setOpenId(open ? null : r.id)} className="w-full text-left p-5 flex items-center gap-4">
                  <span className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] border ${meta.className}`}>{meta.label}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg truncate">{r.booking_code} · {r.client_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.currency} {Number(r.subtotal).toLocaleString()} · {r.line_items?.length || 0} item(s)
                      {r.start_date && ` · ${r.start_date} → ${r.end_date}`}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                  <div className="border-t border-border/40 p-6 space-y-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <Info label="Client">{r.client_name}</Info>
                      <Info label="Email">{r.client_email || "—"}</Info>
                      <Info label="Phone">{r.client_phone || "—"}</Info>
                      <Info label="Deposit / Balance">{r.currency} {Number(r.deposit_amount).toLocaleString()} / {Number(r.balance_due).toLocaleString()}</Info>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => downloadInvoicePdf(r)}
                        className="flex items-center gap-1.5 text-xs text-gold border border-primary/40 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <FileDown className="h-3 w-3" /> Invoice PDF
                      </button>
                      <button
                        onClick={() => downloadConfirmationPdf(r)}
                        className="flex items-center gap-1.5 text-xs text-gold border border-primary/40 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <FileDown className="h-3 w-3" /> Confirmation PDF
                      </button>
                      <button
                        onClick={() => downloadThankYouPdf(r)}
                        className="flex items-center gap-1.5 text-xs text-gold border border-primary/40 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <FileDown className="h-3 w-3" /> Thank-you PDF
                      </button>
                      {r.client_token && (
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/portal/${r.client_token}`;
                            navigator.clipboard.writeText(url);
                            toast.success("Private portal link copied");
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/40 px-3 py-1.5 hover:text-gold hover:border-primary/40 transition-colors"
                        >
                          <LinkIcon className="h-3 w-3" /> Copy portal link
                        </button>
                      )}
                      {!r.portal_completed_at && (
                        <button
                          onClick={async () => {
                            if (!confirm("Mark this booking complete? The client portal link will expire immediately.")) return;
                            await update(r.id, { portal_completed_at: new Date().toISOString() } as any);
                            toast.success("Portal marked complete");
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/40 px-3 py-1.5 hover:text-gold hover:border-primary/40 transition-colors"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Mark complete
                        </button>
                      )}
                    </div>

                    {(r.portal_expires_at || r.portal_completed_at) && (
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground"/>
                        {r.portal_completed_at ? (
                          <span className="text-gold">Portal completed on {new Date(r.portal_completed_at).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-muted-foreground">Portal link expires {new Date(r.portal_expires_at!).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}

                    {r.confirmation_message && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Confirmation message</p>
                          <div className="flex gap-2">
                            <button onClick={() => copyMsg(r.confirmation_message!)} className="flex items-center gap-1.5 text-xs text-gold hover:underline">
                              <Copy className="h-3 w-3" /> Copy
                            </button>
                            {r.client_phone && (
                              <a href={whatsAppTo(r.client_phone, r.confirmation_message)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gold hover:underline">
                                <MessageCircle className="h-3 w-3" /> Send via WhatsApp
                              </a>
                            )}
                          </div>
                        </div>
                        <pre className="text-xs whitespace-pre-wrap bg-background border border-border/40 p-4 font-sans max-h-80 overflow-y-auto">{r.confirmation_message}</pre>
                      </div>
                    )}

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Status</span>
                      <select value={r.status} onChange={(e) => update(r.id, { status: e.target.value as Status })} className={`${inputCls} mt-2`}>
                        {(Object.keys(STATUS_META) as Status[]).map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                      </select>
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

const inputCls = "w-full bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
    <div className="mt-2">{children}</div>
  </label>
);

const Info = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-muted-foreground uppercase tracking-wider text-[9px] mb-1">{label}</p>
    <p>{children}</p>
  </div>
);

export default AdminManualBookings;
