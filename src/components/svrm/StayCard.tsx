import KenBurnsImage from "./KenBurnsImage";
import { Stay } from "@/data/stays";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCurrency } from "@/lib/currency";

const StayCard = ({ stay, index }: { stay: Stay; index: number }) => {
  const { format } = useCurrency();
  const showPrice = stay.nox;

  return (
    <article className="group bg-surface-raised border border-border/40 flex flex-col">
      <KenBurnsImage
        src={stay.image}
        alt={stay.name}
        className="aspect-[16/10]"
        direction={(index % 4) as 0 | 1 | 2 | 3}
      />
      <div className="p-6 flex-1 flex flex-col">
        <p className="eyebrow">{stay.area}</p>
        <h3 className="font-serif text-2xl mt-2 text-foreground">{stay.name}</h3>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80 mt-2">{stay.beds}</p>
        <p className="text-sm text-muted-foreground mt-3 flex-1">{stay.blurb}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
              {showPrice ? "From / night" : "Rates"}
            </p>
            <p className="font-serif text-xl text-gold">
              {showPrice ? format(stay.fromZAR) : "On request"}
            </p>
            {stay.nox && (
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground/60 mt-1">
                Managed with Nox Rentals
              </p>
            )}
          </div>
          <a
            href={buildWhatsAppUrl(`${stay.name} (${stay.area})`)}
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

export default StayCard;
