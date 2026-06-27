import { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCurrency } from "@/lib/currency";
import { MessageCircle } from "lucide-react";

const bodyStyles = ["Any", "Sedan", "SUV", "MPV / 7-seat", "Convertible", "Performance"];
const transmissions = ["Any", "Automatic", "Manual"];

const CustomRentalRequest = () => {
  const { currency } = useCurrency();
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState(3);
  const [body, setBody] = useState(bodyStyles[0]);
  const [trans, setTrans] = useState(transmissions[0]);
  const [notes, setNotes] = useState("");

  const message = [
    "Custom self-drive request",
    `Budget: ${budget ? `${currency} ${budget} / day` : "open"}`,
    `Duration: ${days} day${days > 1 ? "s" : ""}`,
    `Body: ${body}`,
    `Transmission: ${trans}`,
    notes ? `Notes: ${notes}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="bg-surface-raised border border-border/40 p-8 md:p-10">
      <p className="eyebrow">Don't see the right car?</p>
      <h3 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">Tell us what you need.</h3>
      <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
        Set your budget and preferences — we source from our wider fleet and partners and confirm
        availability within hours.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Daily budget ({currency})</span>
          <input
            inputMode="numeric"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
            placeholder="e.g. 2500"
            className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Duration (days)</span>
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(e) => setDays(Math.max(1, Math.min(90, Number(e.target.value) || 1)))}
            className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Body style</span>
          <select
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
          >
            {bodyStyles.map((b) => (
              <option key={b} value={b} className="bg-surface-deep">{b}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Transmission</span>
          <select
            value={trans}
            onChange={(e) => setTrans(e.target.value)}
            className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
          >
            {transmissions.map((t) => (
              <option key={t} value={t} className="bg-surface-deep">{t}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block mt-5">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 300))}
          placeholder="Dates, drivers, delivery address, anything specific…"
          className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm min-h-[80px] resize-none focus:border-primary focus:outline-none"
        />
      </label>

      <a
        href={buildWhatsAppUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        Send request via WhatsApp
      </a>
    </div>
  );
};

export default CustomRentalRequest;
