import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Copy, MessageCircle, ChevronDown, FileDown, CheckCircle2 } from "lucide-react";
import { buildConfirmationMessage, type LineItem } from "@/lib/confirmationMessage";
import { downloadInvoicePdf, downloadConfirmationPdf, downloadThankYouPdf } from "@/lib/invoicePdf";
import PdfEditorDialog from "@/components/svrm/PdfEditorDialog";
import StaffAssigner, { type PendingAssignment } from "@/components/svrm/StaffAssigner";
import BookingExpenses from "@/components/svrm/BookingExpenses";

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
  quoted_total: number | null;
  deposit_amount: number;
  amount_paid: number;
  balance_due: number;

  start_date: string | null;
  end_date: string | null;
  status: Status;
  notes: string | null;
  confirmation_message: string | null;
  client_token: string | null;
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
  const [pdfEdit, setPdfEdit] = useState<{ booking: Booking; kind: "invoice" | "confirmation" | "thank_you" | "quotation" } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    currency: "ZAR",
    start_date: "",
    end_date: "",
    deposit_amount: 0,
    amount_paid: 0,
    total_override: "" as string,
    quoted_total: "" as string,
    notes: "",
  });
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [pendingStaff, setPendingStaff] = useState<PendingAssignment[]>([]);

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

  const itemsTotal = items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  // Total due can be overridden manually; otherwise it follows the line items.
  const subtotal = form.total_override.trim() !== "" ? Number(form.total_override) || 0 : itemsTotal;
  const quotedTotal = form.quoted_total.trim() !== "" ? Number(form.quoted_total) || 0 : null;
  const paid = Number(form.amount_paid) || 0;
  // Balance follows what has actually been paid; falls back to the deposit when nothing is logged.
  const balance = Math.max(0, subtotal - (paid > 0 ? paid : Number(form.deposit_amount) || 0));

  const resetForm = () => {
    setForm({ client_name: "", client_email: "", client_phone: "", currency: "ZAR", start_date: "", end_date: "", deposit_amount: 0, amount_paid: 0, total_override: "", quoted_total: "", notes: "" });
    setItems([emptyItem()]);
    setPendingStaff([]);
    setEditingId(null);
  };

  const startEdit = (r: Booking) => {
    setEditingId(r.id);
    const lineTotal = (r.line_items || []).reduce((s, i) => s + (Number(i.amount) || 0), 0);
    setForm({
      client_name: r.client_name || "",
      client_email: r.client_email || "",
      client_phone: r.client_phone || "",
      currency: r.currency || "ZAR",
      start_date: r.start_date || "",
      end_date: r.end_date || "",
      deposit_amount: Number(r.deposit_amount) || 0,
      amount_paid: Number(r.amount_paid) || 0,
      total_override: Number(r.subtotal) !== lineTotal ? String(Number(r.subtotal) || 0) : "",
      quoted_total: r.quoted_total != null ? String(Number(r.quoted_total)) : "",
      notes: r.notes || "",
    });
    setItems(r.line_items?.length ? r.line_items.map((i) => ({ ...i })) : [emptyItem()]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const cleanedItems = () =>
    items.filter((i) => i.label.trim()).map((i) => ({
      label: i.label.trim(),
      qty: Number(i.qty) || undefined,
      unit: i.unit?.trim() || undefined,
      amount: Number(i.amount) || 0,
    }));

  const saveEdit = async () => {
    if (!editingId) return;
    if (!form.client_name.trim()) return toast.error("Client name required");
    const cleanItems = cleanedItems();
    if (!cleanItems.length) return toast.error("Add at least one line item");

    const patch = {
      client_name: form.client_name.trim(),
      client_email: form.client_email.trim() || null,
      client_phone: form.client_phone.trim() || null,
      currency: form.currency,
      line_items: cleanItems as any,
      subtotal,
      quoted_total: quotedTotal,

      deposit_amount: Number(form.deposit_amount) || 0,
      amount_paid: paid,
      balance_due: balance,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      notes: form.notes.trim() || null,
    };

    const existing = rows.find((r) => r.id === editingId);
    const confirmation_message = buildConfirmationMessage({
      booking_code: existing?.booking_code || "",
      client_name: patch.client_name,
      currency: patch.currency,
      line_items: cleanItems,
      subtotal,
      deposit_amount: patch.deposit_amount,
      amount_paid: paid,
      balance_due: balance,
      start_date: patch.start_date,
      end_date: patch.end_date,
      notes: patch.notes,
    });

    const { error } = await supabase
      .from("manual_bookings")
      .update({ ...patch, confirmation_message } as any)
      .eq("id", editingId);
    if (error) return toast.error(error.message);

    setRows((r) => r.map((x) => (x.id === editingId ? ({ ...x, ...patch, confirmation_message } as any) : x)));
    toast.success("Booking updated");
    setShowForm(false);
    resetForm();
  };

  const create = async () => {
    if (!form.client_name.trim()) return toast.error("Client name required");
    if (items.length === 0 || items.every((i) => !i.label.trim())) return toast.error("Add at least one line item");

    const cleanItems = cleanedItems();

    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("manual_bookings").insert({
      client_name: form.client_name.trim(),
      client_email: form.client_email.trim() || null,
      client_phone: form.client_phone.trim() || null,
      currency: form.currency,
      line_items: cleanItems as any,
      subtotal,
      quoted_total: quotedTotal,

      deposit_amount: Number(form.deposit_amount) || 0,
      amount_paid: paid,
      balance_due: balance,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      notes: form.notes.trim() || null,
      created_by: userData.user?.id,
    } as any).select().single();

    if (error) return toast.error(error.message);

    // Generate + save confirmation message
    const msg = buildConfirmationMessage({
      booking_code: data.booking_code,
      client_name: data.client_name,
      currency: data.currency,
      line_items: cleanItems,
      subtotal: Number(data.subtotal),
      deposit_amount: Number(data.deposit_amount),
      amount_paid: paid,
      balance_due: Number(data.balance_due),
      start_date: data.start_date,
      end_date: data.end_date,
      notes: data.notes,
    });
    await supabase.from("manual_bookings").update({ confirmation_message: msg }).eq("id", data.id);

    if (pendingStaff.length) {
      const rows = pendingStaff.map((p) => ({
        booking_id: data.id,
        staff_id: p.staff_id,
        role: p.role || null,
        created_by: userData.user?.id ?? null,
      }));
      const { error: aErr } = await supabase.from("booking_assignments" as any).insert(rows);
      if (aErr) toast.error(`Booking created, staff assignment failed: ${aErr.message}`);
    }

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
          onClick={() => { if (showForm) { setShowForm(false); resetForm(); } else { resetForm(); setShowForm(true); } }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs uppercase tracking-[0.24em] hover:bg-primary-glow transition-colors"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "New booking"}
        </button>
      </div>

      {showForm && (
        <div className="border border-border/40 bg-surface-raised p-6 mb-8 space-y-5">
          {editingId && (
            <p className="text-[10px] uppercase tracking-[0.24em] text-gold">
              Editing {rows.find((r) => r.id === editingId)?.booking_code}
            </p>
          )}
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
            <Field label={`Total amount due (auto ${form.currency} ${itemsTotal.toLocaleString()})`}>
              <input type="number" placeholder={String(itemsTotal)} value={form.total_override}
                onChange={(e) => setForm((f) => ({ ...f, total_override: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Original quote given">
              <input type="number" placeholder="Optional" value={form.quoted_total}
                onChange={(e) => setForm((f) => ({ ...f, quoted_total: e.target.value }))} className={inputCls} />
            </Field>
            <div />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Field label="Deposit amount">
              <input type="number" value={form.deposit_amount || ""} onChange={(e) => setForm((f) => ({ ...f, deposit_amount: Number(e.target.value) || 0 }))} className={inputCls} />
            </Field>
            <Field label="Amount paid">
              <input type="number" value={form.amount_paid || ""} onChange={(e) => setForm((f) => ({ ...f, amount_paid: Number(e.target.value) || 0 }))} className={inputCls} />
            </Field>
            <div className="text-xs space-y-1">
              <p className="text-muted-foreground">Total due: <span className="text-foreground">{form.currency} {subtotal.toLocaleString()}</span></p>
              {quotedTotal !== null && quotedTotal !== subtotal && (
                <p className="text-muted-foreground">Original quote: <span className="line-through">{form.currency} {quotedTotal.toLocaleString()}</span></p>
              )}
              {subtotal > 0 && paid >= subtotal ? (
                <p className="text-gold uppercase tracking-[0.2em] text-[10px]">Paid in full</p>
              ) : (
                <p className="text-muted-foreground">Balance due: <span className="text-gold">{form.currency} {balance.toLocaleString()}</span></p>
              )}
            </div>

          </div>

          <Field label="Internal notes">
            <textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inputCls} />
          </Field>

          {!editingId && (
            <div className="border-t border-border/40 pt-4">
              <StaffAssigner value={pendingStaff} onChange={setPendingStaff} />
            </div>
          )}

          <button onClick={editingId ? saveEdit : create} className="w-full px-6 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors">
            {editingId ? "Save changes" : "Create booking & generate message"}
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
                      <Info label="Paid / Balance">
                        {Number(r.subtotal) > 0 && Number(r.amount_paid || 0) >= Number(r.subtotal)
                          ? <span className="text-gold">Paid in full</span>
                          : <>{r.currency} {Number(r.amount_paid || 0).toLocaleString()} / {Number(r.balance_due).toLocaleString()}</>}
                      </Info>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(r)}
                        className="flex items-center gap-2 px-3 py-2 border border-primary/40 text-gold text-[10px] uppercase tracking-[0.2em] hover:bg-primary/10 transition-colors"
                      >
                        Edit booking
                      </button>
                      <button
                        onClick={() => setPdfEdit({ booking: r, kind: "quotation" })}
                        className="flex items-center gap-1.5 text-xs text-gold border border-primary/40 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <FileDown className="h-3 w-3" /> Quotation PDF
                      </button>
                      <button
                        onClick={() => setPdfEdit({ booking: r, kind: "invoice" })}
                        className="flex items-center gap-1.5 text-xs text-gold border border-primary/40 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <FileDown className="h-3 w-3" /> Invoice PDF
                      </button>
                      <button
                        onClick={() => setPdfEdit({ booking: r, kind: "confirmation" })}
                        className="flex items-center gap-1.5 text-xs text-gold border border-primary/40 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <FileDown className="h-3 w-3" /> Confirmation PDF
                      </button>
                      <button
                        onClick={() => setPdfEdit({ booking: r, kind: "thank_you" })}
                        className="flex items-center gap-1.5 text-xs text-gold border border-primary/40 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <FileDown className="h-3 w-3" /> Thank-you PDF
                      </button>
                      <button
                        onClick={() => downloadInvoicePdf(r as any)}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground px-2 py-1.5"
                        title="Skip editor and download immediately"
                      >
                        Quick download
                      </button>
                      {r.status !== "completed" && (
                        <button
                          onClick={async () => {
                            if (!confirm("Mark this booking complete?")) return;
                            await update(r.id, { status: "completed" } as any);
                            toast.success("Booking marked complete");
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/40 px-3 py-1.5 hover:text-gold hover:border-primary/40 transition-colors"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Mark complete
                        </button>
                      )}
                    </div>



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

                    <div className="border-t border-border/40 pt-4">
                      <StaffAssigner bookingId={r.id} />
                    </div>

                    <div className="border-t border-border/40 pt-4">
                      <BookingExpenses bookingId={r.id} currency={r.currency} />
                    </div>

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
      {pdfEdit && (
        <PdfEditorDialog booking={pdfEdit.booking} kind={pdfEdit.kind} onClose={() => setPdfEdit(null)}/>
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
