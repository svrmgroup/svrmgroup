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

const DURATIONS = [3, 5, 7, 10, 14];

const TourBuilder = () => {
  const { format } = useCurrency();
  const [selected, setSelected] = useState<Set<ActivityId>>(new Set(["safari", "cultural"]));
  const [duration, setDuration] = useState(5);
  const [travellers, setTravellers] = useState(2);
  const [tier, setTier] = useState<Tier>("luxury");

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
    const summary = `${duration}-day ${tierData.label.toLowerCase()} tour for ${travellers} traveller${travellers > 1 ? "s" : ""} including ${activityLabels.join(", ") || "no activities selected yet"}.`;
    return { low, high, summary };
  }, [selected, duration, travellers, tier]);

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
                {d} days
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
      </div>

      <aside className="lg:sticky lg:top-32 self-start bg-surface-raised border border-border/40 p-8">
        <p className="eyebrow">Rough estimate</p>
        <p className="font-serif text-3xl md:text-4xl text-gold mt-4 leading-tight">
          {fmt(low)}<span className="text-muted-foreground/70 mx-2">–</span>{fmt(high)}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2 tracking-wide">per person, excl. international flights · rough only</p>
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
