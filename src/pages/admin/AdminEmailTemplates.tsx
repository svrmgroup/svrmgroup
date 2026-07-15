import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save } from "lucide-react";

const KIND_LABELS: Record<string, string> = {
  booking_confirmation: "Booking confirmation (to client, with PDF)",
  invoice_sent: "Invoice sent (to client, with PDF)",
  payment_received: "Payment received",
  payment_overdue: "Payment overdue reminder",
  staff_assignment: "Staff job assignment (internal)",
  new_inquiry: "New inquiry received (internal)",
  quote_response: "Quote response (to client)",
  welcome: "Welcome",
  change_request_received: "Change request received (internal)",
  change_request_approved: "Change request approved (to client)",
  change_request_declined: "Change request declined (to client)",
};

const PLACEHOLDERS = ["{{client_name}}", "{{client_email}}", "{{booking_code}}", "{{currency}}", "{{subtotal}}", "{{deposit_amount}}", "{{balance_due}}", "{{start_date}}", "{{end_date}}", "{{staff_name}}", "{{admin_notes}}", "{{subject}}"];

interface Template { id: string; kind: string; subject: string; body_html: string; body_text: string | null; enabled: boolean; }

const AdminEmailTemplates = () => {
  const [rows, setRows] = useState<Template[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Template>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("email_templates" as any).select("*").order("kind");
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any) || []);
    if (data && data.length && !selected) { setSelected((data as any)[0].id); setDraft((data as any)[0]); }
  };
  useEffect(() => { load(); }, []);

  const select = (t: Template) => { setSelected(t.id); setDraft(t); };

  const save = async () => {
    if (!draft.id) return;
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("email_templates" as any).update({
      subject: draft.subject, body_html: draft.body_html, body_text: draft.body_text,
      enabled: draft.enabled, updated_by: userData.user?.id ?? null,
    }).eq("id", draft.id);
    if (error) return toast.error(error.message);
    toast.success("Template saved");
    load();
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Settings</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">Email templates</h1>
        <p className="text-xs text-muted-foreground mt-2">Editable transactional emails sent via Lovable Cloud.</p>
      </header>

      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <div className="grid md:grid-cols-[320px_1fr] gap-4">
          <div className="card-luxury overflow-hidden">
            {rows.map(t => (
              <button key={t.id} onClick={() => select(t)} className={`w-full text-left px-4 py-3 border-b border-border/40 hover:bg-surface-raised/50 ${selected === t.id ? "bg-surface-raised" : ""}`}>
                <p className="text-xs">{KIND_LABELS[t.kind] || t.kind}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t.enabled ? "Enabled" : "Disabled"}</p>
              </button>
            ))}
          </div>

          {selected && draft.id && (
            <div className="card-luxury p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="eyebrow">{KIND_LABELS[draft.kind || ""] || draft.kind}</p>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={!!draft.enabled} onChange={e => setDraft({ ...draft, enabled: e.target.checked })}/>
                  Enabled
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Subject</span>
                <input value={draft.subject || ""} onChange={e => setDraft({ ...draft, subject: e.target.value })} className="input-luxury text-sm w-full mt-1"/>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">HTML body</span>
                <textarea rows={10} value={draft.body_html || ""} onChange={e => setDraft({ ...draft, body_html: e.target.value })} className="input-luxury text-sm w-full mt-1 font-mono"/>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Plain-text fallback</span>
                <textarea rows={3} value={draft.body_text || ""} onChange={e => setDraft({ ...draft, body_text: e.target.value })} className="input-luxury text-sm w-full mt-1"/>
              </label>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-2">Placeholders</p>
                <div className="flex flex-wrap gap-1">
                  {PLACEHOLDERS.map(p => (
                    <button key={p} type="button" onClick={() => navigator.clipboard.writeText(p).then(() => toast.success(`${p} copied`))} className="text-[10px] px-2 py-1 border border-border/40 hover:border-primary hover:text-gold">{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={save} className="btn-luxury text-xs flex items-center gap-2"><Save className="h-3.5 w-3.5"/> Save template</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEmailTemplates;
