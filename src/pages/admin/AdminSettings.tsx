import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Upload, FileText } from "lucide-react";
import { renderPdfBlob, invalidateInvoiceSettingsCache, type InvoiceBooking } from "@/lib/invoicePdf";

type PreviewKind = "invoice" | "confirmation" | "thank_you";

const SAMPLE_BOOKING: InvoiceBooking = {
  booking_code: "SVRM-PREVIEW",
  client_name: "Alexandra Kruger",
  client_email: "alexandra@example.com",
  client_phone: "+27 82 555 0198",
  start_date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
  end_date: new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10),
  currency: "ZAR",
  line_items: [
    { label: "Range Rover Sport — chauffeured", qty: 3, unit: "days", amount: 18000 },
    { label: "Table Mountain private helicopter transfer", qty: 1, unit: "flight", amount: 24500 },
    { label: "Villa Camps Bay — 3 nights", qty: 3, unit: "nights", amount: 45000 },
  ],
  subtotal: 87500,
  deposit_amount: 43750,
  balance_due: 43750,
  notes: "Preview only — this booking illustrates how live PDFs will render with your branding.",
};

const AdminSettings = () => {
  const [s, setS] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    const { data, error } = await supabase.from("app_settings" as any).select("*").eq("id", 1).maybeSingle();
    setLoading(false);
    if (error) return toast.error(error.message);
    setS((data as any) || {});
  })(); }, []);

  const uploadLogo = async (file: File) => {
    const path = `branding/logo-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("cms-media").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
    setS((prev: any) => ({ ...prev, logo_url: data.publicUrl }));
    toast.success("Logo uploaded — remember to save");
  };

  const save = async () => {
    const patch = { ...s };
    delete patch.id; delete patch.created_at; delete patch.updated_at;
    const { error } = await supabase.from("app_settings" as any).update(patch).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Settings saved — invoices and emails will use these values");
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Settings</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Business identity</h1>
          <p className="text-xs text-muted-foreground mt-2 max-w-2xl">
            One source of truth for everything the client sees — invoices, confirmations, PDFs, emails, portal, footer.
            Edit here, changes flow everywhere.
          </p>
        </div>
        <button onClick={save} className="btn-luxury text-xs flex items-center gap-2"><Save className="h-3.5 w-3.5"/> Save all</button>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-luxury p-5 space-y-3">
          <p className="eyebrow">Company</p>
          <F l="Company name"><input value={s.company_name || ""} onChange={e => setS({ ...s, company_name: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Tagline (appears under logo)"><input value={s.tagline || ""} onChange={e => setS({ ...s, tagline: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Address"><textarea rows={2} value={s.company_address || ""} onChange={e => setS({ ...s, company_address: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <div className="grid grid-cols-2 gap-3">
            <F l="VAT number"><input value={s.vat_number || ""} onChange={e => setS({ ...s, vat_number: e.target.value })} className="input-luxury text-sm w-full"/></F>
            <F l="VAT rate %"><input type="number" step="0.01" value={s.vat_rate ?? 15} onChange={e => setS({ ...s, vat_rate: Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
          </div>
        </div>

        <div className="card-luxury p-5 space-y-3">
          <p className="eyebrow">Contact channels</p>
          <F l="Concierge email"><input value={s.company_email || ""} onChange={e => setS({ ...s, company_email: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Office phone"><input value={s.company_phone || ""} onChange={e => setS({ ...s, company_phone: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="WhatsApp number (with country code)"><input value={s.company_whatsapp || ""} onChange={e => setS({ ...s, company_whatsapp: e.target.value })} className="input-luxury text-sm w-full" placeholder="+27 73 064 1481"/></F>
          <F l="Website"><input value={s.website || ""} onChange={e => setS({ ...s, website: e.target.value })} className="input-luxury text-sm w-full" placeholder="https://svrm.group"/></F>
          <F l="Instagram handle"><input value={s.instagram_handle || ""} onChange={e => setS({ ...s, instagram_handle: e.target.value })} className="input-luxury text-sm w-full"/></F>
        </div>

        <div className="card-luxury p-5 space-y-3">
          <p className="eyebrow">Banking (appears on invoices)</p>
          <F l="Bank name"><input value={s.bank_name || ""} onChange={e => setS({ ...s, bank_name: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Account number"><input value={s.bank_account || ""} onChange={e => setS({ ...s, bank_account: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <div className="grid grid-cols-2 gap-3">
            <F l="Branch code"><input value={s.bank_branch || ""} onChange={e => setS({ ...s, bank_branch: e.target.value })} className="input-luxury text-sm w-full"/></F>
            <F l="SWIFT / BIC"><input value={s.bank_swift || ""} onChange={e => setS({ ...s, bank_swift: e.target.value })} className="input-luxury text-sm w-full"/></F>
          </div>
        </div>

        <div className="card-luxury p-5 space-y-3">
          <p className="eyebrow">Brand & PDFs</p>
          <F l="Logo (used on invoices, emails, PDFs)">
            <div className="flex items-center gap-3">
              {s.logo_url && <img src={s.logo_url} alt="Logo" className="h-14 w-14 object-contain border border-border/40 bg-white/5 p-1"/>}
              <label className="btn-ghost text-[10px] cursor-pointer flex items-center gap-1.5">
                <Upload className="h-3 w-3"/> Upload logo
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}/>
              </label>
            </div>
            <input value={s.logo_url || ""} onChange={e => setS({ ...s, logo_url: e.target.value })} placeholder="Or paste URL" className="input-luxury text-xs w-full mt-2"/>
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F l="Primary (gold)"><input type="color" value={s.brand_primary || "#c9a961"} onChange={e => setS({ ...s, brand_primary: e.target.value })} className="input-luxury h-9 w-full"/></F>
            <F l="Dark background"><input type="color" value={s.brand_bg || "#1f1b18"} onChange={e => setS({ ...s, brand_bg: e.target.value })} className="input-luxury h-9 w-full"/></F>
          </div>
        </div>

        <div className="card-luxury p-5 space-y-3 md:col-span-2">
          <p className="eyebrow">Client-facing messages</p>
          <F l="Thank-you message (top of confirmation PDF & email)">
            <textarea rows={2} value={s.thank_you_message || ""} onChange={e => setS({ ...s, thank_you_message: e.target.value })} className="input-luxury text-sm w-full"/>
          </F>
          <F l="Invoice footer (payment terms line)">
            <textarea rows={2} value={s.invoice_footer || ""} onChange={e => setS({ ...s, invoice_footer: e.target.value })} className="input-luxury text-sm w-full"/>
          </F>
          <F l="Confirmation footer (legal note under PDF)">
            <textarea rows={2} value={s.confirmation_footer || ""} onChange={e => setS({ ...s, confirmation_footer: e.target.value })} className="input-luxury text-sm w-full"/>
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F l="Client portal expiry (days after trip end)">
              <input type="number" value={s.portal_expiry_days ?? 30} onChange={e => setS({ ...s, portal_expiry_days: Number(e.target.value) })} className="input-luxury text-sm w-full"/>
            </F>
            <div className="text-[10px] text-muted-foreground pt-6">
              Portal links auto-expire this many days after the booking's end date. New bookings get their expiry set on creation.
            </div>
          </div>
        </div>
      </div>

      <button onClick={save} className="btn-luxury text-xs flex items-center gap-2"><Save className="h-3.5 w-3.5"/> Save all</button>
    </div>
  );
};

const F = ({ l, children }: { l: string; children: React.ReactNode }) => (
  <label className="block"><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{l}</span><div className="mt-1">{children}</div></label>
);

export default AdminSettings;
