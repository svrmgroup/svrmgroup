import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Settings {
  id: number; company_name: string; company_email: string; company_phone: string;
  company_address: string | null; vat_number: string | null; vat_rate: number;
  bank_name: string | null; bank_account: string | null; bank_branch: string | null;
  bank_swift: string | null; invoice_footer: string | null;
  brand_primary: string; brand_bg: string;
}

const AdminSettings = () => {
  const [s, setS] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    const { data, error } = await supabase.from("app_settings" as any).select("*").eq("id", 1).maybeSingle();
    setLoading(false);
    if (error) return toast.error(error.message);
    setS((data as any) || {});
  })(); }, []);

  const save = async () => {
    const { error } = await supabase.from("app_settings" as any).update({
      company_name: s.company_name, company_email: s.company_email, company_phone: s.company_phone,
      company_address: s.company_address, vat_number: s.vat_number, vat_rate: s.vat_rate,
      bank_name: s.bank_name, bank_account: s.bank_account, bank_branch: s.bank_branch, bank_swift: s.bank_swift,
      invoice_footer: s.invoice_footer, brand_primary: s.brand_primary, brand_bg: s.brand_bg,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Settings</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">Company &amp; brand</h1>
      </header>

      <div className="card-luxury p-5 grid md:grid-cols-2 gap-3">
        <Sec title="Company">
          <F l="Name"><input value={s.company_name || ""} onChange={e => setS({ ...s, company_name: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Email"><input value={s.company_email || ""} onChange={e => setS({ ...s, company_email: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Phone"><input value={s.company_phone || ""} onChange={e => setS({ ...s, company_phone: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Address"><textarea rows={3} value={s.company_address || ""} onChange={e => setS({ ...s, company_address: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="VAT number"><input value={s.vat_number || ""} onChange={e => setS({ ...s, vat_number: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="VAT rate %"><input type="number" step="0.01" value={s.vat_rate ?? 15} onChange={e => setS({ ...s, vat_rate: Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
        </Sec>
        <Sec title="Banking">
          <F l="Bank name"><input value={s.bank_name || ""} onChange={e => setS({ ...s, bank_name: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Account"><input value={s.bank_account || ""} onChange={e => setS({ ...s, bank_account: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Branch code"><input value={s.bank_branch || ""} onChange={e => setS({ ...s, bank_branch: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="SWIFT/BIC"><input value={s.bank_swift || ""} onChange={e => setS({ ...s, bank_swift: e.target.value })} className="input-luxury text-sm w-full"/></F>
          <F l="Invoice footer"><textarea rows={2} value={s.invoice_footer || ""} onChange={e => setS({ ...s, invoice_footer: e.target.value })} className="input-luxury text-sm w-full"/></F>
        </Sec>
        <Sec title="Brand">
          <F l="Primary color"><input type="color" value={s.brand_primary || "#C9A961"} onChange={e => setS({ ...s, brand_primary: e.target.value })} className="input-luxury h-9 w-20"/></F>
          <F l="Background"><input type="color" value={s.brand_bg || "#1F1B18"} onChange={e => setS({ ...s, brand_bg: e.target.value })} className="input-luxury h-9 w-20"/></F>
        </Sec>
      </div>

      <button onClick={save} className="btn-luxury text-xs flex items-center gap-2"><Save className="h-3.5 w-3.5"/> Save settings</button>
    </div>
  );
};

const Sec = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3"><p className="eyebrow">{title}</p>{children}</div>
);
const F = ({ l, children }: { l: string; children: React.ReactNode }) => (
  <label className="block"><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{l}</span><div className="mt-1">{children}</div></label>
);

export default AdminSettings;
