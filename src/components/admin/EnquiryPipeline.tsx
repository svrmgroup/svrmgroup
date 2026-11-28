import type { Tables } from "@/integrations/supabase/types";

export type EnquiryRow = Tables<"enquiries">;

export const STAGES = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "quote_sent", label: "Quote sent" },
  { id: "deposit_paid", label: "Deposit paid" },
  { id: "completed", label: "Completed booking" },
  { id: "lost", label: "Lost" },
] as const;

export const SERVICE_LABEL: Record<string, string> = {
  tours: "Private tours", chauffeur: "Chauffeur", airport_transfer: "Airport transfer", honeymoon: "Honeymoon",
  occasion: "Occasion", secure_transport: "Secure transport", stays: "Stays", rentals: "Rentals",
  experiences: "Experiences", general: "General",
};

const field = "mt-1 w-full bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none";
const lbl = "text-[10px] uppercase tracking-[0.24em] text-muted-foreground";
const money = (v: number | null) => (v == null ? "—" : `R ${Math.round(v).toLocaleString("en-ZA")}`);
const num = (v: string) => (v.trim() === "" ? null : Number(v));

/** Booking stage, value and flags for one enquiry. Saves through the parent's update(). */
const EnquiryPipeline = ({ row, onUpdate }: { row: EnquiryRow; onUpdate: (patch: Partial<EnquiryRow>) => void }) => {
  const adSource = row.gclid ? "Google Ads click" : row.utm_source ? `${row.utm_source}${row.utm_medium ? ` / ${row.utm_medium}` : ""}` : "Not from an ad";
  return (
    <div className="border border-border/40 p-4 space-y-4" data-testid="enquiry-pipeline">
      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em]">
        {row.reference && <span className="border border-primary/40 px-2 py-1 text-gold notranslate">Ref {row.reference}</span>}
        <span className="border border-border/60 px-2 py-1 text-muted-foreground">{SERVICE_LABEL[row.service || "general"] || row.service}</span>
        <span className="border border-border/60 px-2 py-1 text-muted-foreground">{row.channel === "whatsapp" ? "Via WhatsApp" : "Via form"}</span>
        {row.is_duplicate && <span className="border border-amber-500/40 px-2 py-1 text-amber-300">Repeat enquiry</span>}
        {row.is_employment && <span className="border border-destructive/40 px-2 py-1 text-destructive">Job seeker</span>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <label className="block col-span-2 md:col-span-1">
          <span className={lbl}>Booking stage</span>
          <select aria-label="Booking stage" value={row.stage} onChange={(e) => onUpdate({ stage: e.target.value })} className={field}>
            {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={lbl}>Guests</span>
          <input type="number" min={1} max={200} aria-label="Guests" defaultValue={row.party_size ?? ""} onBlur={(e) => onUpdate({ party_size: num(e.target.value) })} className={field} />
        </label>
        <label className="block">
          <span className={lbl}>Chauffeur days</span>
          <input type="number" min={0} max={90} aria-label="Chauffeur days" defaultValue={row.chauffeur_days ?? ""} onBlur={(e) => onUpdate({ chauffeur_days: num(e.target.value) })} className={field} />
        </label>
        <label className="block">
          <span className={lbl}>Quote (ZAR)</span>
          <input type="number" min={0} aria-label="Quote amount" defaultValue={row.quote_amount ?? ""} onBlur={(e) => onUpdate({ quote_amount: num(e.target.value) })} className={field} />
        </label>
        <label className="block">
          <span className={lbl}>Booking value (ZAR)</span>
          <input type="number" min={0} aria-label="Booking value" defaultValue={row.booking_value ?? ""} onBlur={(e) => onUpdate({ booking_value: num(e.target.value) })} className={field} />
        </label>
        <label className="block">
          <span className={lbl}>Direct costs (ZAR)</span>
          <input type="number" min={0} aria-label="Direct costs" defaultValue={row.direct_costs ?? ""} onBlur={(e) => onUpdate({ direct_costs: num(e.target.value) })} className={field} />
        </label>
        <div>
          <span className={lbl}>Contribution</span>
          <p className="mt-2 text-sm text-gold" data-testid="contribution">{money(row.contribution)}</p>
        </div>
        <div className="flex flex-col gap-2 justify-end text-xs">
          <label className="flex items-center gap-2"><input type="checkbox" checked={row.is_employment} onChange={(e) => onUpdate({ is_employment: e.target.checked })} /> Job seeker</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={row.is_duplicate} onChange={(e) => onUpdate({ is_duplicate: e.target.checked })} /> Repeat</label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Ad source: {adSource}
        {row.utm_campaign ? ` · campaign ${row.utm_campaign}` : ""}
        {row.landing_path ? ` · landed on ${row.landing_path}` : ""}
        {row.gclid && !row.ad_consent ? " · no ad consent" : ""}
      </p>
    </div>
  );
};

export default EnquiryPipeline;
