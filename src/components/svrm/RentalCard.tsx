import KenBurnsImage from "./KenBurnsImage";
import { Vehicle, rentalRate } from "@/data/vehicles";
import { useCurrency } from "@/lib/currency";

interface Props {
  vehicle: Vehicle;
  index: number;
  onBook: (vehicle: Vehicle) => void;
}

const RentalCard = ({ vehicle, index, onBook }: Props) => {
  const { format } = useCurrency();
  const rate = rentalRate(vehicle);
  return (
    <article className="group bg-surface-raised border border-border/40 flex flex-col">
      <KenBurnsImage
        src={vehicle.image}
        alt={vehicle.name}
        className="aspect-[16/10]"
        direction={(index % 4) as 0 | 1 | 2 | 3}
      />
      <div className="p-6 flex-1 flex flex-col">
        <p className="eyebrow">Self-drive · {vehicle.tier}</p>
        <h3 className="font-serif text-2xl mt-2 text-foreground">{vehicle.name}</h3>
        <p className="text-sm text-muted-foreground mt-2 flex-1">{vehicle.tagline}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">From / day · guide</p>
            <p className="font-serif text-xl text-gold">{format(rate)}</p>
            <p className="text-[10px] tracking-wide text-muted-foreground/60 mt-1">Rough guide — final quote often lower</p>
          </div>

          <button
            type="button"
            onClick={() => onBook(vehicle)}
            className="text-[10px] uppercase tracking-[0.24em] px-4 py-3 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
          >
            Book dates
          </button>
        </div>
      </div>
    </article>
  );
};

export default RentalCard;

