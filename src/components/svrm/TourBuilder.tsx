import { useMemo, useState } from "react";
import { Compass, Landmark, Mountain, Ship, Plane, Sparkles, ChefHat } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import { useCurrency } from "@/lib/currency";


type ActivityId = "safari" | "cultural" | "adventure" | "yacht" | "helicopter" | "spa" | "chef";

interface Activity {
  id: ActivityId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  perDay: number;
  oneOff: number;
}

const ACTIVITIES: Activity[] = [
  { id: "safari", label: "Safari", icon: Compass, perDay: 7400, oneOff: 0 },
  { id: "cultural", label: "Cultural", icon: Landmark, perDay: 2200, oneOff: 0 },
  { id: "adventure", label: "Adventure", icon: Mountain, perDay: 3300, oneOff: 0 },
  { id: "yacht", label: "Yacht day", icon: Ship, perDay: 0, oneOff: 14800 },
  { id: "helicopter", label: "Helicopter", icon: Plane, perDay: 0, oneOff: 16650 },
  { id: "spa", label: "Spa & wellness", icon: Sparkles, perDay: 1500, oneOff: 0 },
  { id: "chef", label: "Private chef", icon: ChefHat, perDay: 4100, oneOff: 0 },
];

type Tier = "premium" | "luxury" | "ultra";
const TIERS: { id: Tier; label: string; perDay: number }[] = [
  { id: "premium", label: "Premium", perDay: 6500 },
  { id: "luxury", label: "Luxury", perDay: 12000 },
  { id: "ultra", label: "Ultra", perDay: 20400 },
];

const DURATIONS = [1, 2, 3, 5, 7, 10, 14, 21];

// Extra preferences go into the brief only; they are priced in the written quote, not the rough estimate.
const EXTRAS = [
  "Cape Peninsula & penguins", "Winelands & wine tasting", "Bo-Kaap cooking class", "Table Mountain",
  "Whale watching", "Hot-air balloon", "Golf", "Photography session", "Shopping & stylist",
  "Beach & Clifton day", "Garden Route", "Big Five day safari",
];
const PREFS: { key: string; label: string; options: string[] }[] = [
  { key: "Stay", label: "Where you'd like to stay", options: ["Private villa", "5-star hotel", "Safari lodge", "Mix", "Already booked"] },
  { key: "Vehicle", label: "Vehicle", options: ["Luxury sedan", "Luxury SUV", "Maybach", "V-Class van", "Sprinter / group"] },
  { key: "Pace", label: "Pace", options: ["Relaxed", "Balanced", "Packed"] },
  { key: "Occasion", label: "Occasion", options: ["Holiday", "Honeymoon", "Anniversary", "Birthday", "Proposal", "Business", "Family"] },
  { key: "Guide language", label: "Guide language", options: ["English", "German", "French", "Other"] },
  { key: "Dining", label: "Dining", options: ["No preference", "Halal", "Vegetarian", "Kosher", "Fine dining"] },
];
const ADDONS = ["Airport meet & greet", "Close protection", "Private chef dinner", "Flowers & décor", "Kids' seats", "Wheelchair-friendly"];

const TourBuilder = () => {
  const { format } = useCurrency();
  const [selected, setSelected] = useState<Set<ActivityId>>(new Set(["safari", "cultural"]));
  const [duration, setDuration] = useState(5);
  const [travellers, setTravellers] = useState(2);
  const [tier, setTier] = useState<Tier>("luxury");
  const [extras, setExtras] = useState<Set<string>>(new Set());
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [prefs, setPrefs] = useState<Record<string, string>>({});
  const flip = (set: React.Dispatch<React.SetStateAction<Set<string>>>, v: string) =>
    set((s) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n; });
  const chip = (active: boolean) =>
    `px-4 py-2.5 border text-[11px] uppercase tracking-[0.18em] transition-colors ${
      active ? "border-primary bg-primary/10 text-foreground" : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
    }`;

  const toggle = (id: ActivityId) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const { low, high, summary } = useMemo(() => {
    const tierData = TIERS.find((t) => t.id === tier)!;
    const base = tierData.perDay * duration;
    let activityCost = 0;
    selected.forEach((id) => {
      const a = ACTIVITIES.find((x) => x.id === id)!;
      activityCost += a.perDay * duration + a.oneOff;
    });
    const perPerson = base + activityCost;
    const low = Math.round((perPerson * 0.85) / 500) * 500;
    const high = Math.round((perPerson * 1.15) / 500) * 500;
    const activityLabels = Array.from(selected).map((id) => ACTIVITIES.find((a) => a.id === id)!.label);
    const lines = [
      `${duration}-day ${tierData.label.toLowerCase()} tour for ${travellers} traveller${travellers > 1 ? "s" : ""} including ${activityLabels.join(", ") || "no activities selected yet"}.`,
      extras.size ? `Experiences: ${Array.from(extras).join(", ")}.` : "",
      ...Object.entries(prefs).map(([k, v]) => `${k}: ${v}.`),
      addons.size ? `Extras: ${Array.from(addons).join(", ")}.` : "",
    ].filter(Boolean);
    return { low, high, summary: lines.join(" ") };
  }, [selected, duration, travellers, tier, extras, prefs, addons]);

  const fmt = (n: number) => format(n);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-12">
        <div>
          <p className="eyebrow">Step 01 · Activities</p>
          <p className="text-sm text-muted-foreground mt-2">Choose anything you'd like included.</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ACTIVITIES.map((a) => {
              const active = selected.has(a.id);
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggle(a.id)}
                  className={`group flex flex-col items-center gap-3 p-5 border transition-all duration-300 ${
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-7 w-7 ${active ? "text-gold" : ""}`} />
                  <span className="text-xs uppercase tracking-[0.2em]">{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="eyebrow">Step 02 · Duration</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`px-6 py-3 border text-xs uppercase tracking-[0.24em] transition-colors ${
                  duration === d
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {d} {d === 1 ? "day" : "days"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="eyebrow">Step 03 · Travellers</p>
            <div className="mt-6 flex items-center gap-6">
              <button
                type="button"
                onClick={() => setTravellers((t) => Math.max(1, t - 1))}
                className="h-12 w-12 border border-border/60 text-foreground hover:border-primary"
              >
                −
              </button>
              <span className="font-serif text-4xl text-foreground w-12 text-center">{travellers}</span>
              <button
                type="button"
                onClick={() => setTravellers((t) => Math.min(12, t + 1))}
                className="h-12 w-12 border border-border/60 text-foreground hover:border-primary"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <p className="eyebrow">Step 04 · Tier</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id)}
                  className={`px-5 py-3 border text-xs uppercase tracking-[0.24em] transition-colors ${
                    tier === t.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Step 05 · Experiences</p>
          <p className="text-sm text-muted-foreground mt-2">Add the moments you don't want to miss — priced in your quote.</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {EXTRAS.map((x) => (
              <button key={x} type="button" aria-pressed={extras.has(x)} onClick={() => flip(setExtras, x)} className={chip(extras.has(x))}>{x}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Step 06 · Your preferences</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {PREFS.map((p) => (
              <div key={p.key}>
                <p className="text-xs uppercase tracking-[0.22em] text-foreground/80">{p.label}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.options.map((o) => {
                    const active = prefs[p.key] === o;
                    return (
                      <button key={o} type="button" aria-pressed={active}
                        onClick={() => setPrefs((s) => { const n = { ...s }; active ? delete n[p.key] : (n[p.key] = o); return n; })}
                        className={chip(active)}>{o}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Step 07 · Finishing touches</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {ADDONS.map((x) => (
              <button key={x} type="button" aria-pressed={addons.has(x)} onClick={() => flip(setAddons, x)} className={chip(addons.has(x))}>{x}</button>
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-32 self-start bg-surface-raised border border-border/40 p-8">
        <p className="eyebrow">Rough estimate</p>
        <p className="font-serif text-3xl md:text-4xl text-gold mt-4 leading-tight">
          {fmt(low)}<span className="text-muted-foreground/70 mx-2">–</span>{fmt(high)}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2 tracking-wide">per person, excl. international flights · rough only · experiences & extras quoted separately</p>
        <p className="text-sm text-foreground/85 mt-6 leading-relaxed">{summary}</p>
        <p className="text-xs text-muted-foreground/60 mt-4 italic">
          A rough guide — the final price is on request and personalised to your brief.
        </p>
        <div className="mt-8">
          <EnquiryForm
            subject="Bespoke tour"
            defaultMessage={`I'd like to enquire about a bespoke tour:\n\n${summary}\n\nRough estimate: ${fmt(low)} – ${fmt(high)} per person (final quote on request).`}
            compact
          />
        </div>
      </aside>
    </div>
  );
};

export default TourBuilder;
