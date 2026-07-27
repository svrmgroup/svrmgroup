import { useState } from "react";
import { X, FileDown, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { downloadRentalAgreementPdf, DEFAULT_RENTAL_TERMS, type RentalAgreementData } from "@/lib/rentalAgreementPdf";

interface Props {
  initial: Partial<RentalAgreementData>;
  onClose: () => void;
}

const DEFAULT_POLICY = `Late return: charged at the daily rate per commenced 24 hours.
Refuelling: fuel cost plus R350 service fee.
Excessive cleaning / smoking: R1 500.
Traffic fine administration: R350 per fine.
Lost key / remote: at replacement cost plus R1 000 handling.`;

/** Fill-in-the-blanks editor for the SVRM self-drive rental agreement PDF. */
export default function RentalAgreementDialog({ initial, onClose }: Props) {
  const [d, setD] = useState<RentalAgreementData>({
    agreement_no: initial.agreement_no || `RA-${Date.now().toString().slice(-6)}`,
    agreement_date: initial.agreement_date || "",
    renter_name: initial.renter_name || "",
    renter_id: initial.renter_id || "",
    renter_licence: initial.renter_licence || "",
    renter_licence_expiry: initial.renter_licence_expiry || "",
    renter_phone: initial.renter_phone || "",
    renter_email: initial.renter_email || "",
    renter_address: initial.renter_address || "",
    vehicle: initial.vehicle || "",
    registration: initial.registration || "",
    colour: initial.colour || "",
    collection_at: initial.collection_at || "",
    return_at: initial.return_at || "",
    collection_location: initial.collection_location || "",
    return_location: initial.return_location || "",
    odometer_out: initial.odometer_out || "",
    fuel_out: initial.fuel_out || "Full",
    mileage_allowance: initial.mileage_allowance || "200 km per day",
    excess_mileage_charge: initial.excess_mileage_charge || "R5.50 per km",
    currency: initial.currency || "ZAR",
    daily_rate: initial.daily_rate ?? 0,
    days: initial.days ?? 1,
    extras_total: initial.extras_total ?? 0,
    total: initial.total ?? 0,
    security_deposit: initial.security_deposit ?? 0,
    amount_paid: initial.amount_paid ?? 0,
    balance_due: initial.balance_due ?? 0,
    policy_charges: initial.policy_charges || DEFAULT_POLICY,
    notes: initial.notes || "",
    terms: initial.terms || DEFAULT_RENTAL_TERMS,
  });
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<RentalAgreementData>) => setD((p) => ({ ...p, ...patch }));

  const recalc = (patch: Partial<RentalAgreementData>) => {
    const next = { ...d, ...patch };
    const total = Number(next.daily_rate || 0) * Number(next.days || 0) + Number(next.extras_total || 0);
    set({ ...patch, total, balance_due: total - Number(next.amount_paid || 0) });
  };

  const download = async () => {
    setBusy(true);
    try {
      await downloadRentalAgreementPdf(d);
      toast.success("Rental agreement downloaded");
      onClose();
    } finally { setBusy(false); }
  };

  const sendToClient = async () => {
    setBusy(true);
    try {
      await downloadRentalAgreementPdf(d);
      const msg = `Good day ${d.renter_name},\n\nPlease find attached your SVRM Group self-drive rental agreement (${d.agreement_no}) for the ${d.vehicle}. Kindly sign and return it before collection.\n\nSVRM Group`;
      const phone = (d.renter_phone || "").replace(/[^\d]/g, "");
      window.open(`https://wa.me/${phone || "27730641481"}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
      toast.success("PDF downloaded — attach it in WhatsApp to send.");
      onClose();
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-deep border border-border/60 w-full max-w-3xl my-8">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl">Rental agreement</h2>
            <p className="text-xs text-muted-foreground mt-1">Fill in every detail — the PDF is generated exactly from these fields.</p>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>

        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          <section className="grid md:grid-cols-2 gap-3">
            <F label="Agreement no." value={d.agreement_no} onChange={(v) => set({ agreement_no: v })} />
            <F label="Agreement date" value={d.agreement_date || ""} onChange={(v) => set({ agreement_date: v })} placeholder="Blank = today" />
          </section>

          <section>
            <p className="eyebrow mb-2">Renter</p>
            <div className="grid md:grid-cols-2 gap-3">
              <F label="Full name" value={d.renter_name} onChange={(v) => set({ renter_name: v })} />
              <F label="ID / passport no." value={d.renter_id || ""} onChange={(v) => set({ renter_id: v })} />
              <F label="Driver's licence no." value={d.renter_licence || ""} onChange={(v) => set({ renter_licence: v })} />
              <F label="Licence expiry" value={d.renter_licence_expiry || ""} onChange={(v) => set({ renter_licence_expiry: v })} />
              <F label="Mobile" value={d.renter_phone || ""} onChange={(v) => set({ renter_phone: v })} />
              <F label="Email" value={d.renter_email || ""} onChange={(v) => set({ renter_email: v })} />
              <div className="md:col-span-2"><F label="Address" value={d.renter_address || ""} onChange={(v) => set({ renter_address: v })} /></div>
            </div>
          </section>

          <section>
            <p className="eyebrow mb-2">Vehicle & period</p>
            <div className="grid md:grid-cols-2 gap-3">
              <F label="Vehicle" value={d.vehicle} onChange={(v) => set({ vehicle: v })} />
              <F label="Registration" value={d.registration || ""} onChange={(v) => set({ registration: v })} />
              <F label="Colour" value={d.colour || ""} onChange={(v) => set({ colour: v })} />
              <F label="Odometer out" value={d.odometer_out || ""} onChange={(v) => set({ odometer_out: v })} />
              <F label="Collection (date & time)" value={d.collection_at || ""} onChange={(v) => set({ collection_at: v })} />
              <F label="Return (date & time)" value={d.return_at || ""} onChange={(v) => set({ return_at: v })} />
              <F label="Collection location" value={d.collection_location || ""} onChange={(v) => set({ collection_location: v })} />
              <F label="Return location" value={d.return_location || ""} onChange={(v) => set({ return_location: v })} />
              <F label="Fuel level out" value={d.fuel_out || ""} onChange={(v) => set({ fuel_out: v })} />
              <F label="Mileage allowance" value={d.mileage_allowance || ""} onChange={(v) => set({ mileage_allowance: v })} />
              <F label="Excess mileage charge" value={d.excess_mileage_charge || ""} onChange={(v) => set({ excess_mileage_charge: v })} />
            </div>
          </section>

          <section>
            <p className="eyebrow mb-2">Charges</p>
            <div className="grid md:grid-cols-3 gap-3">
              <F label="Currency" value={d.currency} onChange={(v) => set({ currency: v })} />
              <F label="Daily rate" type="number" value={String(d.daily_rate ?? 0)} onChange={(v) => recalc({ daily_rate: Number(v) })} />
              <F label="Days" type="number" value={String(d.days ?? 0)} onChange={(v) => recalc({ days: Number(v) })} />
              <F label="Extras total" type="number" value={String(d.extras_total ?? 0)} onChange={(v) => recalc({ extras_total: Number(v) })} />
              <F label="Total rental" type="number" value={String(d.total ?? 0)} onChange={(v) => set({ total: Number(v), balance_due: Number(v) - Number(d.amount_paid || 0) })} />
              <F label="Security deposit" type="number" value={String(d.security_deposit ?? 0)} onChange={(v) => set({ security_deposit: Number(v) })} />
              <F label="Amount paid" type="number" value={String(d.amount_paid ?? 0)} onChange={(v) => set({ amount_paid: Number(v), balance_due: Number(d.total || 0) - Number(v) })} />
              <F label="Balance due" type="number" value={String(d.balance_due ?? 0)} onChange={(v) => set({ balance_due: Number(v) })} />
            </div>
          </section>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Standard policy charges</span>
            <textarea rows={5} value={d.policy_charges || ""} onChange={(e) => set({ policy_charges: e.target.value })} className="input-luxury text-sm w-full mt-1" />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notes</span>
            <textarea rows={3} value={d.notes || ""} onChange={(e) => set({ notes: e.target.value })} className="input-luxury text-sm w-full mt-1" />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Terms & conditions (one per line)</span>
            <textarea
              rows={8}
              value={(d.terms || []).join("\n")}
              onChange={(e) => set({ terms: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean) })}
              className="input-luxury text-sm w-full mt-1"
            />
          </label>
        </div>

        <div className="p-5 border-t border-border/40 flex flex-wrap justify-end gap-2">
          <button onClick={onClose} className="btn-ghost text-xs">Cancel</button>
          <button onClick={sendToClient} disabled={busy} className="text-xs flex items-center gap-2 text-gold border border-primary/40 px-3 py-2 hover:bg-primary/10 transition-colors disabled:opacity-50">
            <MessageCircle className="h-3.5 w-3.5" /> Send to client
          </button>
          <button onClick={download} disabled={busy} className="btn-luxury text-xs flex items-center gap-2 disabled:opacity-50">
            <FileDown className="h-3.5 w-3.5" /> {busy ? "Rendering…" : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

function F({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="input-luxury text-sm w-full mt-1" />
    </label>
  );
}
