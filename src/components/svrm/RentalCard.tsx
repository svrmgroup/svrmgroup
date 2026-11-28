import { Link } from "react-router-dom";
import KenBurnsImage from "./KenBurnsImage";
import { Vehicle } from "@/data/vehicles";
import VehicleGallery from "./VehicleGallery";
import { vehiclePhotoAlt } from "@/seo/vehicleImages";


interface Props {
  vehicle: Vehicle;
  index: number;
  onBook: (vehicle: Vehicle) => void;
}

const RentalCard = ({ vehicle, index, onBook }: Props) => {
  return (

    <article className="group bg-surface-raised border border-border/40 flex flex-col">
      {vehicle.gallery?.length ? <VehicleGallery vehicle={vehicle} to={`/rentals/${vehicle.slug}`} /> : <Link to={`/rentals/${vehicle.slug}`} aria-label={`View ${vehicle.name} rental details`} className="block"><KenBurnsImage
        src={vehicle.image}
        alt={vehiclePhotoAlt(vehicle.name, true)}
        className="aspect-[16/10]"
        direction={(index % 4) as 0 | 1 | 2 | 3}
      /></Link>}
      <div className="p-6 flex-1 flex flex-col">
        <p className="eyebrow">Self-drive · {vehicle.tier}</p>
        <h3 className="font-serif text-2xl mt-2 text-foreground"><Link to={`/rentals/${vehicle.slug}`} className="hover:text-gold transition-colors">{vehicle.name}</Link></h3>
        <p className="text-sm text-muted-foreground mt-2 flex-1">{vehicle.tagline}</p>
        <Link to={`/rentals/${vehicle.slug}`} className="mt-4 text-[11px] uppercase tracking-[0.22em] text-gold hover:underline underline-offset-4">View details →</Link>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">Pricing</p>
            <p className="font-serif text-xl text-gold">On enquiry</p>
            <p className="text-[10px] tracking-wide text-muted-foreground/60 mt-1">Quote sent back personally</p>
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

