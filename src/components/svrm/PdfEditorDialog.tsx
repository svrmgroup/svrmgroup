import { useEffect, useState } from "react";
import { X, FileDown, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { downloadInvoicePdf, downloadConfirmationPdf, downloadThankYouPdf, type InvoiceBooking, type ConciergeInfo } from "@/lib/invoicePdf";
import type { LineItem } from "@/lib/confirmationMessage";

type Kind = "invoice" | "confirmation" | "thank_you";

interface Props {
  booking: any;
  kind: Kind;
  onClose: () => void;
}

const titles: Record<Kind, string> = {
  invoice: "Edit invoice",
  confirmation: "Edit confirmation",
  thank_you: "Edit thank-you note",
};

/** Modal that lets an admin tweak every field on a PDF right before downloading. */
export default function PdfEditorDialog({ booking, kind, onClose }: Props) {
  const [b, setB] = useState<InvoiceBooking>({ ...(booking as InvoiceBooking) });
  const [items, setItems] = useState<LineItem[]>(booking.line_items || []);
  const [issueDate, setIssueDate] = useState<string>("");
  const [packageTitle, setPackageTitle] = useState<string>((booking.line_items || [])[0]?.label || "");
  const [concierge, setConcierge] = useState<ConciergeInfo>({ name: "" });
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Load staff for concierge picker + preselect current assignment.
    (async () => {
      const [staffRes, assignRes] = await Promise.all([
        supabase.from("staff" as any).select("*").eq("status", "active").order("full_name"),
        booking.id
          ? (supabase as any)
              .from("booking_assignments")
              .select("staff_id, staff:staff_id(full_name, role, custom_role_title, role_description, email, phone, whatsapp)")
              .eq("booking_id", booking.id)
              .order("created_at", { ascending: true })
              .limit(1)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      setStaffList((staffRes.data as any[]) || []);
      const st = (assignRes as any).data?.staff;
      if (st) {
        setSelectedStaffId((assignRes as any).data.staff_id);
        setConcierge({
          name: st.full_name,
          role: st.custom_role_title || st.role,
          description: st.role_description,
          email: st.email,
          phone: st.phone,
          whatsapp: st.whatsapp,
        });
      }
    })();
  }, [booking.id]);

  const pickStaff = (id: string) => {
    setSelectedStaffId(id);
    const st = staffList.find((s) => s.id === id);
    if (!st) return;
    setConcierge({
      name: st.full_name,
      role: st.custom_role_title || st.role,
      description: st.role_description,
      email: st.email,
      phone: st.phone,
      whatsapp: st.whatsapp,
    });
  };

  const updateItem = (i: number, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const addItem = () =>
    setItems((prev) => [...prev, { label: "New item", qty: 1, unit: "", subtotal: 0 } as any]);

  const download = async () => {
    setDownloading(true);
    try {
      const payload: InvoiceBooking = {
        ...b,
        line_items: items,
        concierge_override: concierge.name ? concierge : null,
        package_title_override: packageTitle || null,
        issue_date_override: issueDate || null,
      };
      if (kind === "invoice") await downloadInvoicePdf(payload);
      else if (kind === "confirmation") await downloadConfirmationPdf(payload);
      else await downloadThankYouPdf(payload);
      onClose();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-deep border border-border/60 w-full max-w-3xl my-8">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl">{titles[kind]}</h2>
            <p className="text-xs text-muted-foreground mt-1">Edit any field before downloading — nothing is saved back to the booking.</p>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground"/></button>
        </div>

        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          <section className="grid md:grid-cols-2 gap-3">
            <Field label="Reference / Invoice no." value={b.booking_code} onChange={(v) => setB({ ...b, booking_code: v })}/>
            <Field label="Issue date (override)" value={issueDate} onChange={setIssueDate} placeholder="Leave blank = today"/>
            <Field label="Client name" value={b.client_name} onChange={(v) => setB({ ...b, client_name: v })}/>
            <Field label="Client email" value={b.client_email || ""} onChange={(v) => setB({ ...b, client_email: v })}/>
            <Field label="Client phone" value={b.client_phone || ""} onChange={(v) => setB({ ...b, client_phone: v })}/>
            <Field label="Start date" value={b.start_date || ""} type="date" onChange={(v) => setB({ ...b, start_date: v })}/>
            <Field label="End date" value={b.end_date || ""} type="date" onChange={(v) => setB({ ...b, end_date: v })}/>
            <Field label="Currency" value={b.currency} onChange={(v) => setB({ ...b, currency: v })}/>
          </section>

          <section>
            <p className="eyebrow mb-2">Lead organiser / concierge</p>
            <div className="grid md:grid-cols-2 gap-3">
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Assign staff</span>
                <select value={selectedStaffId} onChange={(e) => pickStaff(e.target.value)} className="input-luxury text-sm w-full mt-1">
                  <option value="">— Custom / Company —</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name} · {s.custom_role_title || s.role}</option>
                  ))}
                </select>
              </label>
              <Field label="Name" value={concierge.name || ""} onChange={(v) => setConcierge({ ...concierge, name: v })}/>
              <Field label="Role / title" value={(concierge.role as string) || ""} onChange={(v) => setConcierge({ ...concierge, role: v })}/>
              <Field label="Email" value={concierge.email || ""} onChange={(v) => setConcierge({ ...concierge, email: v })}/>
              <Field label="Phone" value={concierge.phone || ""} onChange={(v) => setConcierge({ ...concierge, phone: v })}/>
              <Field label="WhatsApp" value={concierge.whatsapp || ""} onChange={(v) => setConcierge({ ...concierge, whatsapp: v })}/>
              <label className="md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Description</span>
                <textarea rows={2} value={concierge.description || ""} onChange={(e) => setConcierge({ ...concierge, description: e.target.value })} className="input-luxury text-sm w-full mt-1"/>
              </label>
            </div>
          </section>

          <section>
            <p className="eyebrow mb-2">Package</p>
            <Field label="Package title" value={packageTitle} onChange={setPackageTitle}/>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Line items</span>
                <button onClick={addItem} className="btn-ghost text-xs flex items-center gap-1"><Plus className="h-3 w-3"/>Add</button>
              </div>
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6"><Field label={i === 0 ? "Label" : ""} value={it.label} onChange={(v) => updateItem(i, { label: v })}/></div>
                  <div className="col-span-2"><Field label={i === 0 ? "Qty" : ""} value={String(it.qty ?? "")} onChange={(v) => updateItem(i, { qty: v ? Number(v) : undefined } as any)}/></div>
                  <div className="col-span-2"><Field label={i === 0 ? "Unit" : ""} value={it.unit || ""} onChange={(v) => updateItem(i, { unit: v } as any)}/></div>
                  <div className="col-span-1"><Field label={i === 0 ? "Amount" : ""} value={String((it as any).subtotal ?? "")} onChange={(v) => updateItem(i, { subtotal: v ? Number(v) : 0 } as any)}/></div>
                  <button onClick={() => removeItem(i)} className="col-span-1 h-9 flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5"/></button>
                </div>
              ))}
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-3">
            <Field label="Subtotal" value={String(b.subtotal ?? 0)} type="number" onChange={(v) => setB({ ...b, subtotal: Number(v) })}/>
            <Field label="Deposit" value={String(b.deposit_amount ?? 0)} type="number" onChange={(v) => setB({ ...b, deposit_amount: Number(v) })}/>
            <Field label="Balance due" value={String(b.balance_due ?? 0)} type="number" onChange={(v) => setB({ ...b, balance_due: Number(v) })}/>
          </section>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Important note (callout box)</span>
            <textarea rows={3} value={b.notes || ""} onChange={(e) => setB({ ...b, notes: e.target.value })} className="input-luxury text-sm w-full mt-1"/>
          </label>
        </div>

        <div className="p-5 border-t border-border/40 flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost text-xs">Cancel</button>
          <button onClick={download} disabled={downloading} className="btn-luxury text-xs flex items-center gap-2 disabled:opacity-50">
            <FileDown className="h-3.5 w-3.5"/> {downloading ? "Rendering…" : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label>
      {label && <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>}
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="input-luxury text-sm w-full mt-1"/>
    </label>
  );
}
