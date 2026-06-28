import KenBurnsImage from "./KenBurnsImage";
import { Vehicle } from "@/data/vehicles";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const VehicleCard = ({ vehicle, index }: { vehicle: Vehicle; index: number }) => {
  return (
    <article className="group bg-surface-raised border border-border/40 flex flex-col">
      <KenBurnsImage
        src={vehicle.image}
        alt={vehicle.name}
        className="aspect-[16/10]"
        direction={(index % 4) as 0 | 1 | 2 | 3}
      />
      <div className="p-6 flex-1 flex flex-col">
        <p className="eyebrow">Vehicle</p>
        <h3 className="font-serif text-2xl mt-2 text-foreground">{vehicle.name}</h3>
        <p className="text-sm text-muted-foreground mt-2 flex-1">{vehicle.tagline}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">Rates</p>
            <p className="font-serif text-xl text-gold">On request</p>
          </div>
          <a
            href={buildWhatsAppUrl(`${vehicle.name} chauffeur / hire`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.24em] px-4 py-3 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
          >
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;
