import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { requiredPhone } from "@/lib/contactValidation";
import { SERVICE_LABEL } from "./EnquiryPipeline";
import type { Tables } from "@/integrations/supabase/types";

type Click = Tables<"whatsapp_clicks">;

const field = "w-full bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none";
const fmt = (iso: string) => new Date(iso).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

/** Match a WhatsApp conversation to its tap by the reference in the guest's first message, then log it as an enquiry. */
const WhatsAppReferences = ({ onLogged }: { onLogged: () => void }) => {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Click | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", guests: "", days: "", message: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("whatsapp_clicks").select("*").not("reference", "is", null)
      .order("created_at", { ascending: false }).limit(200);
    if (error) return toast.error(error.message);
    setClicks(data || []);
  };
  useEffect(() => { void load(); }, []);

  const q = search.trim().toUpperCase();
  const shown = clicks.filter((c) => !q || (c.reference || "").includes(q));

  const save = async () => {
    if (!active) return;
    if (!form.name.trim() || !requiredPhone.safeParse(form.phone).success) return toast.error("Name and a valid phone number are required.");
    setSaving(true);
    const guests = Number.parseInt(form.guests, 10);
    const days = Number.parseInt(form.days, 10);
    const { data, error } = await supabase.from("enquiries").insert({
      name: form.name.trim(), phone: form.phone.trim(), email: null,
      subject: `WhatsApp enquiry — ${SERVICE_LABEL[active.service || "general"] || "General"}`,
      message: form.message.trim() || "Logged from WhatsApp conversation",
      source_page: active.path?.slice(0, 200) ?? null,
      channel: "whatsapp", reference: active.reference, service: active.service,
      booking_date: form.date || null,
      party_size: guests >= 1 && guests <= 200 ? guests : null,
      chauffeur_days: days >= 1 && days <= 90 ? days : null,
      gclid: active.gclid, gbraid: active.gbraid, wbraid: active.wbraid, ad_consent: active.ad_consent,
      utm_source: active.utm_source, utm_medium: active.utm_medium, utm_campaign: active.utm_campaign, utm_term: active.utm_term,
      landing_path: active.landing_path,
    }).select("id").single();
    if (error) { setSaving(false); return toast.error(error.message); }
    await supabase.from("whatsapp_clicks").update({ enquiry_id: data.id }).eq("id", active.id);
    setSaving(false);
    setActive(null);
    setForm({ name: "", phone: "", date: "", guests: "", days: "", message: "" });
    toast.success("WhatsApp enquiry logged.");
    void load();
    onLogged();
  };

  return (
    <div className="border border-border/40 bg-surface-raised p-5 mb-8" data-testid="whatsapp-references">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <p className="eyebrow">WhatsApp references</p>
          <p className="text-xs text-muted-foreground mt-1">Find the "Ref: SV-…" from the guest's first WhatsApp message, then log the enquiry.</p>
        </div>
        <input aria-label="Search reference" placeholder="SV-…" value={search} onChange={(e) => setSearch(e.target.value)} className={`${field} max-w-[12rem] uppercase`} />
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-border/30">
        {shown.length === 0 && <p className="text-sm text-muted-foreground py-4">No WhatsApp taps with a reference yet.</p>}
        {shown.map((c) => (
          <div key={c.id} className="py-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-gold notranslate font-medium">{c.reference}</span>
            <span className="text-muted-foreground">{fmt(c.created_at)}</span>
            <span>{SERVICE_LABEL[c.service || "general"] || c.service}</span>
            <span className="text-muted-foreground truncate max-w-[12rem]">{c.path}</span>
            {(c.gclid || c.utm_source) && <span className="border border-primary/40 px-1.5 text-gold">Ad</span>}
            <span className="ml-auto">
              {c.enquiry_id ? <span className="text-green-300">Logged</span> : (
                <button onClick={() => setActive(c)} className="text-gold hover:underline">Log enquiry</button>
              )}
            </span>
          </div>
        ))}
      </div>
      {active && (
        <div className="mt-4 border-t border-border/40 pt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <p className="col-span-full text-sm">Log enquiry for <span className="text-gold">{active.reference}</span></p>
          <input aria-label="Guest name" placeholder="Guest name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
          <input aria-label="Guest phone" placeholder="Phone (+44…)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
          <input aria-label="Travel date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={field} />
          <input aria-label="Guests" type="number" placeholder="Guests" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className={field} />
          <input aria-label="Chauffeur days" type="number" placeholder="Chauffeur days" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} className={field} />
          <input aria-label="Summary" placeholder="Short summary (no sensitive details)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
          <div className="col-span-full flex gap-3 justify-end">
            <button onClick={() => setActive(null)} className="text-xs text-muted-foreground">Cancel</button>
            <button onClick={save} disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-[0.2em] disabled:opacity-60">{saving ? "Saving…" : "Save enquiry"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppReferences;
