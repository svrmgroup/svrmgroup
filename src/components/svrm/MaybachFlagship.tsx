import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import SmartImage from "@/components/svrm/SmartImage";
import BookingSheet from "@/components/svrm/BookingSheet";
import { useCurrency } from "@/lib/currency";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { vehicles } from "@/data/vehicles";

export const MAYBACH_SLUG = "mercedes-maybach-s-class";
export const MAYBACH_ALT =
  "Mercedes-Maybach S-Class chauffeur service in Cape Town — SVRM Group";

const suited = [
  "VIP & high-profile guests",
  "Executive and corporate travel",
  "Luxury airport & hotel transfers",
  "Private events and premieres",
  "Honeymoons & anniversaries",
  "Long-distance luxury travel",
];

/**
 * Flagship block for the Mercedes-Maybach S-Class. Rendered above the
 * chauffeured fleet grid. Price is held in ZAR and formatted through the
 * currency context so the selector converts correctly.
 */
const MaybachFlagship = ({ compact = false }: { compact?: boolean }) => {
  const [open, setOpen] = useState(false);
  const { format } = useCurrency();
  const maybach = vehicles.find((v) => v.slug === MAYBACH_SLUG);
  if (!maybach) return null;

  return (
    <section className="mb-16 md:mb-20 border-2 border-primary/70 bg-surface-raised">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden">
          <SmartImage
            src={maybach.image}
            alt={MAYBACH_ALT}
            priority
            wrapperClassName="absolute inset-0 w-full h-full"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase">
            Flagship
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <p className="eyebrow">Mercedes-Maybach</p>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 text-foreground leading-[1.05]">
            Mercedes-Maybach S-Class
          </h2>
          <p className="text-gold text-sm tracking-[0.18em] uppercase mt-3">
            SVRM's Flagship Chauffeur Experience
          </p>
          <div className="gold-divider w-16 mt-6" />

          <p className="text-sm text-muted-foreground leading-relaxed mt-6 max-w-xl">
            The most refined car we place a chauffeur in. Rear executive seating,
            near-silent cabin, and a driver who knows Cape Town properly — for
            guests whose time and privacy matter more than anything else on the
            itinerary.
          </p>

          {!compact && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-6">
              {suited.map((s) => (
                <li
                  key={s}
                  className="text-xs text-muted-foreground/90 flex items-start gap-2"
                >
                  <span className="mt-1.5 w-1 h-1 bg-primary shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
                From / day
              </p>
              <p className="font-serif text-3xl text-gold">
                {format(maybach.fromZAR)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-[10px] uppercase tracking-[0.24em] px-6 py-4 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
              >
                Request Maybach
              </button>
              <a
                href={buildWhatsAppUrl(
                  "Maybach enquiry — I'd like to request the Mercedes-Maybach S-Class chauffeur service.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] px-6 py-4 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/80 mt-6">
            Also available for the{" "}
            <Link to="/tours/cape-peninsula" className="text-gold hover:underline">
              Cape Peninsula private tour
            </Link>
            ,{" "}
            <Link to="/airport-transfers" className="text-gold hover:underline">
              luxury airport transfers
            </Link>
            ,{" "}
            <Link to="/honeymoon-cape-town" className="text-gold hover:underline">
              honeymoons
            </Link>{" "}
            and{" "}
            <Link to="/anniversary-cape-town" className="text-gold hover:underline">
              anniversaries
            </Link>
            .
          </p>
        </div>
      </div>

      <BookingSheet
        open={open}
        onOpenChange={setOpen}
        kind="vehicle"
        name={maybach.name}
        subtitle="Signature · chauffeured flagship"
        rateZAR={maybach.fromZAR}
        unit="day"
        slug={maybach.slug}
      />
    </section>
  );
};

export default MaybachFlagship;
