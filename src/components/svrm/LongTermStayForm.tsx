import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const durations = ["1–3 months", "3–6 months", "6–12 months", "12 months+"];
const bedrooms = ["Studio", "1 bed", "2 bed", "3 bed", "4 bed+"];

const LongTermStayForm = () => {
  const [duration, setDuration] = useState(durations[1]);
  const [beds, setBeds] = useState(bedrooms[2]);
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const message = [
    "Long-term stay enquiry",
    `Duration: ${duration}`,
    `Bedrooms: ${beds}`,
    area ? `Area: ${area}` : null,
    budget ? `Monthly budget: ${budget}` : null,
    notes ? `Notes: ${notes}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="bg-surface-raised border border-border/40 p-8 md:p-10">
      <p className="eyebrow">Long-term Stays</p>
      <h3 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">Live in Cape Town.</h3>
      <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
        Furnished monthly and seasonal residences — Atlantic seaboard, City Bowl, Constantia and
        the Winelands. Tell us the brief and we source from our managed portfolio.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Duration</span>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none">
            {durations.map((d) => <option key={d} value={d} className="bg-surface-deep">{d}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Bedrooms</span>
          <select value={beds} onChange={(e) => setBeds(e.target.value)} className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none">
            {bedrooms.map((b) => <option key={b} value={b} className="bg-surface-deep">{b}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Preferred area</span>
          <input value={area} onChange={(e) => setArea(e.target.value.slice(0, 80))} placeholder="Camps Bay, City Bowl, Constantia…" className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none" />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Monthly budget</span>
          <input value={budget} onChange={(e) => setBudget(e.target.value.slice(0, 40))} placeholder="Open, or e.g. R 80,000" className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none" />
        </label>
      </div>

      <label className="block mt-5">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notes</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 400))} placeholder="Move-in date, pets, work-from-home setup, vehicle…" className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm min-h-[80px] resize-none focus:border-primary focus:outline-none" />
      </label>

      <a href={buildWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors">
        <MessageCircle className="h-4 w-4" />
        Send brief via WhatsApp
      </a>
    </div>
  );
};

export default LongTermStayForm;
