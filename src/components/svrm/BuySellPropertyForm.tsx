import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const intents = ["Buy", "Sell", "Invest"];
const bedrooms = ["Studio", "1 bed", "2 bed", "3 bed", "4 bed", "5 bed+"];

const BuySellPropertyForm = () => {
  const [intent, setIntent] = useState(intents[0]);
  const [beds, setBeds] = useState(bedrooms[2]);
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const message = [
    `Property enquiry · ${intent}`,
    `Bedrooms: ${beds}`,
    area ? `Area: ${area}` : null,
    budget ? `Budget: ${budget}` : null,
    notes ? `Notes: ${notes}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="bg-surface-raised border border-border/40 p-8 md:p-10">
      <p className="eyebrow">Buy & Sell Properties</p>
      <h3 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">Own in Cape Town.</h3>
      <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
        Off-market and on-market acquisitions, disposals and investment opportunities — handled
        discreetly with our property partners.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">I want to</span>
          <select value={intent} onChange={(e) => setIntent(e.target.value)} className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none">
            {intents.map((i) => <option key={i} value={i} className="bg-surface-deep">{i}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Bedrooms</span>
          <select value={beds} onChange={(e) => setBeds(e.target.value)} className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none">
            {bedrooms.map((b) => <option key={b} value={b} className="bg-surface-deep">{b}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Area</span>
          <input value={area} onChange={(e) => setArea(e.target.value.slice(0, 80))} placeholder="Clifton, Bantry Bay, Constantia…" className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none" />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Budget / valuation</span>
          <input value={budget} onChange={(e) => setBudget(e.target.value.slice(0, 40))} placeholder="e.g. R 25m – R 40m" className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none" />
        </label>
      </div>

      <label className="block mt-5">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notes</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 400))} placeholder="Property features, timing, off-market preferences…" className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm min-h-[80px] resize-none focus:border-primary focus:outline-none" />
      </label>

      <a href={buildWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors">
        <MessageCircle className="h-4 w-4" />
        Send brief via WhatsApp
      </a>
    </div>
  );
};

export default BuySellPropertyForm;
