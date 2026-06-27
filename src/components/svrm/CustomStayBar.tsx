import { useState } from "react";
import { Wallet, MapPin, Send } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const AREAS = [
  "Any area",
  "Camps Bay",
  "Clifton",
  "Bantry Bay",
  "V&A Waterfront",
  "Sea Point",
  "Llandudno",
  "Constantia",
  "Bishopscourt",
  "City Bowl",
];

const CustomStayBar = () => {
  const { currency } = useCurrency();
  const [budget, setBudget] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [notes, setNotes] = useState("");

  const message = () => {
    const parts = [
      "Custom stay request",
      budget ? `Budget per night: ${currency} ${budget}` : "Budget: flexible",
      `Preferred area: ${area}`,
      notes ? `Notes: ${notes}` : null,
    ].filter(Boolean);
    return parts.join(" · ");
  };

  return (
    <div className="bg-gradient-to-br from-surface-raised to-surface-deep border border-primary/30 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">
        <div>
          <p className="eyebrow">Bespoke · Built around your budget</p>
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-2">
            Tell us your budget — we'll find the right place.
          </h3>
        </div>
        <p className="text-xs text-muted-foreground/80 max-w-xs">
          Off-market villas, hotel upgrades and private residences — matched to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-3 flex items-center gap-3 border border-border/60 bg-background/40 px-4 py-3">
          <Wallet className="h-4 w-4 text-gold shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Budget / night ({currency})
            </label>
            <input
              inputMode="numeric"
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
              placeholder="e.g. 8000"
              className="w-full bg-transparent text-base font-serif text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-3 flex items-center gap-3 border border-border/60 bg-background/40 px-4 py-3">
          <MapPin className="h-4 w-4 text-gold shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Preferred area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-transparent text-base font-serif text-foreground focus:outline-none"
            >
              {AREAS.map((a) => (
                <option key={a} value={a} className="bg-surface-deep">
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-4 flex items-center gap-3 border border-border/60 bg-background/40 px-4 py-3">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Notes (guests, vibe, must-haves)
            </label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 200))}
              placeholder="6 guests, sea view, pool, walking distance to beach…"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
        </div>

        <a
          href={buildWhatsAppUrl(message())}
          target="_blank"
          rel="noopener noreferrer"
          className="md:col-span-2 inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors shadow-[var(--shadow-gold)]"
        >
          <Send className="h-3.5 w-3.5" />
          Find me a stay
        </a>
      </div>
    </div>
  );
};

export default CustomStayBar;
