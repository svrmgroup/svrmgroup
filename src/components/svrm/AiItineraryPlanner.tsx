import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { vehicles } from "@/data/vehicles";
import { WHATSAPP_BASE } from "@/lib/whatsappMessages";
import WhatsAppGlyph from "@/components/svrm/WhatsAppGlyph";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface PlannedDay {
  day: number;
  date?: string | null;
  title: string;
  description: string;
  highlights: string[];
}

interface Plan {
  summary: string;
  vehicle: { name: string; why: string; alternative?: string | null };
  days: PlannedDay[];
  notes: string[];
}

const INTERESTS = [
  "Wine & Winelands",
  "Cape Peninsula & Cape Point",
  "Table Mountain & nature",
  "Beaches & sundowners",
  "Safari & wildlife",
  "Fine dining",
  "Shopping & lifestyle",
  "Culture & history",
  "Golf",
  "Whale watching",
  "Honeymoon / romance",
  "Family friendly",
  "Business & meetings",
];

const AiItineraryPlanner = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupSize, setGroupSize] = useState("2");
  const [pickup, setPickup] = useState("Cape Town International Airport (CPT)");
  const [dropoff, setDropoff] = useState("");
  const [luggage, setLuggage] = useState("");
  const [notes, setNotes] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);

  const toggle = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const dayCount = (() => {
    if (!startDate || !endDate) return 7;
    const a = new Date(startDate).getTime();
    const b = new Date(endDate).getTime();
    if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return 7;
    return Math.min(21, Math.max(1, Math.round((b - a) / 86400000) + 1));
  })();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-itinerary", {
        body: {
          startDate,
          endDate,
          days: dayCount,
          groupSize: Number(groupSize) || undefined,
          interests,
          pickup,
          dropoff,
          luggage,
          notes,
          fleet: vehicles.map((v) => ({
            name: v.name,
            tier: v.tier,
            fromZAR: v.fromZAR,
            tagline: v.tagline,
          })),
        },
      });
      if (fnError) throw fnError;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      setPlan((data as { itinerary: Plan }).itinerary);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't build that itinerary. Please try again or send us your brief on WhatsApp.",
      );
    } finally {
      setLoading(false);
    }
  };

  const waHref = plan
    ? `${WHATSAPP_BASE}?text=${encodeURIComponent(
        [
          "Hi SVRM Group, I'd like to enquire about a chauffeured itinerary.",
          "",
          startDate ? `Arrival: ${startDate}` : null,
          endDate ? `Departure: ${endDate}` : null,
          `Guests: ${groupSize}`,
          `Suggested vehicle: ${plan.vehicle.name}`,
          interests.length ? `Interests: ${interests.join(", ")}` : null,
          pickup ? `Pickup: ${pickup}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      )}`
    : WHATSAPP_BASE;

  const field = "input-luxury mt-2 w-full text-sm";
  const label = "text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70";

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow">Plan with SVRM</p>
        <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">
          Build your own chauffeured itinerary.
        </h2>
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          Tell us your dates, what you'd like to see and who's travelling. We'll draft a day-by-day
          chauffeured plan and recommend the right vehicle from our fleet — then confirm it with you
          personally. Pricing is always confirmed on enquiry.
        </p>
      </div>

      <form onSubmit={submit} className="border border-gold/30 bg-surface-raised p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label} htmlFor="ai-start">Arrival date</label>
            <input id="ai-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={field} required />
          </div>
          <div>
            <label className={label} htmlFor="ai-end">Departure date</label>
            <input id="ai-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={field} required />
          </div>
          <div>
            <label className={label} htmlFor="ai-group">Guests</label>
            <input id="ai-group" type="number" min={1} max={60} value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className={field} required />
          </div>
          <div>
            <label className={label} htmlFor="ai-luggage">Luggage</label>
            <input id="ai-luggage" value={luggage} onChange={(e) => setLuggage(e.target.value)} placeholder="e.g. 3 large cases, 2 cabin bags" className={field} />
          </div>
          <div>
            <label className={label} htmlFor="ai-pickup">Pickup</label>
            <input id="ai-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="ai-dropoff">Staying / drop-off</label>
            <input id="ai-dropoff" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Hotel, villa or area" className={field} />
          </div>
        </div>

        <div className="mt-8">
          <p className={label}>Interests</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {INTERESTS.map((i) => {
              const on = interests.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={on}
                  className={`text-[11px] uppercase tracking-[0.18em] px-3 py-2 border transition-colors ${
                    on
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary"
                  }`}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <label className={label} htmlFor="ai-notes">Anything else</label>
          <textarea
            id="ai-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Occasion, pace, dietary needs, children's ages, must-do experiences…"
            className={field}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.28em] text-gold border border-primary/60 px-6 py-4 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Designing your itinerary…" : "Create my itinerary"}
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.28em] text-black bg-[#25D366] px-6 py-4 hover:brightness-95 transition"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            Enquire on WhatsApp
          </a>
        </div>

        {error && <p className="text-sm text-destructive mt-5">{error}</p>}
      </form>

      {plan && (
        <div className="mt-14">
          <div className="border-t border-border/40 pt-10">
            <p className="eyebrow">Your draft itinerary</p>
            <p className="text-base text-foreground/90 mt-4 leading-relaxed max-w-3xl">{plan.summary}</p>

            <div className="mt-8 border border-gold/30 bg-surface-raised p-6">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
                Recommended vehicle
              </p>
              <h3 className="font-serif text-2xl text-gold mt-2">{plan.vehicle.name}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{plan.vehicle.why}</p>
              {plan.vehicle.alternative && (
                <p className="text-xs text-muted-foreground/80 mt-3">
                  Alternative: {plan.vehicle.alternative}
                </p>
              )}
            </div>

            <div className="mt-10 space-y-8">
              {plan.days.map((d) => (
                <article key={d.day} className="border-t border-border/40 pt-8">
                  <p className="eyebrow">
                    Day {d.day}
                    {d.date ? ` · ${d.date}` : ""}
                  </p>
                  <h3 className="font-serif text-2xl mt-3 text-foreground">{d.title}</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{d.description}</p>
                  <ul className="mt-4 space-y-2">
                    {d.highlights?.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-foreground/90">
                        <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {plan.notes?.length > 0 && (
              <ul className="mt-10 space-y-2 border-t border-border/40 pt-8">
                {plan.notes.map((n) => (
                  <li key={n} className="text-[12px] text-muted-foreground/80 leading-relaxed">
                    {n}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.28em] text-black bg-[#25D366] px-6 py-4 hover:brightness-95 transition"
              >
                <WhatsAppGlyph className="h-4 w-4" />
                Send this to SVRM
              </a>
              <a
                href="#chauffeur-enquiry"
                className="inline-flex items-center justify-center text-xs uppercase tracking-[0.28em] text-gold border border-primary/60 px-6 py-4 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Send the brief
              </a>
            </div>

            <p className="text-[11px] text-muted-foreground/70 mt-6 leading-relaxed">
              This is a draft suggestion — timings, availability and pricing are confirmed by your SVRM
              concierge on enquiry.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiItineraryPlanner;
