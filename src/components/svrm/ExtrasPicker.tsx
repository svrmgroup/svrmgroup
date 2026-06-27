import { Extra } from "@/data/extras";

interface Props {
  extras: Extra[];
  selected: string[];
  onToggle: (id: string) => void;
  label?: string;
}

const ExtrasPicker = ({ extras, selected, onToggle, label = "Add extras" }: Props) => (
  <div>
    <p className="eyebrow">{label}</p>
    <div className="mt-4 flex flex-wrap gap-2">
      {extras.map((e) => {
        const active = selected.includes(e.id);
        return (
          <button
            type="button"
            key={e.id}
            onClick={() => onToggle(e.id)}
            className={`text-[11px] uppercase tracking-[0.2em] px-3 py-2 border transition-colors duration-300 ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border/60 hover:text-foreground hover:border-primary/60"
            }`}
            title={e.note}
          >
            {e.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default ExtrasPicker;
