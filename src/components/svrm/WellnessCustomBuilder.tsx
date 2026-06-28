import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const WELLNESS_OPTIONS = [
  "IV vitamin drips",
  "Sports recovery & physio",
  "Cupping therapy",
  "Cryotherapy",
  "Infrared sauna",
  "Deep-tissue massage",
  "Lymphatic drainage",
  "Acupuncture",
  "Hyperbaric oxygen",
  "Personal training",
  "Private yoga / pilates",
  "Meditation & breathwork",
  "Nutritionist consult",
  "Plant-based private chef",
  "Mobile spa to your stay",
];

interface Props {
  datesSuffix?: string;
}

const WellnessCustomBuilder = ({ datesSuffix = "" }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const toggle = (item: string) =>
    setSelected((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));

  const subject = `Custom Wellness Retreat${datesSuffix}${
    selected.length ? ` · ${selected.join(", ")}` : ""
  }${notes ? ` · Notes: ${notes.slice(0, 200)}` : ""}`;

  return (
    <section className="pb-24 md:pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-surface-raised border border-primary/40 p-8 md:p-12">
          <div className="text-center mb-10">
            <p className="eyebrow">Custom · Wellness</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">
              Build a retreat around your body.
            </h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
              IV drips, sports recovery, cupping, cryo, breathwork — pick what you need and we'll arrange
              the practitioners, mobile services and timings around your stay.
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-4">
            Select what you'd like included
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
            {WELLNESS_OPTIONS.map((item) => {
              const active = selected.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(item)}
                  className={`text-left text-xs uppercase tracking-[0.18em] px-4 py-3 border transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/60"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Specific needs, conditions or goals
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. post-marathon recovery, chronic back pain, pre-natal safe only…"
              className="mt-3 w-full bg-transparent border border-border/60 px-4 py-3 text-sm focus:outline-none focus:border-primary"
              maxLength={400}
            />
          </label>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-muted-foreground/70">
              {selected.length
                ? `${selected.length} service${selected.length > 1 ? "s" : ""} selected · price on request`
                : "Pick one or more services to send a custom brief."}
            </p>
            <a
              href={buildWhatsAppUrl(subject)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] px-6 py-3 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Send custom brief
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WellnessCustomBuilder;
