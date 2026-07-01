import { useState } from "react";
import BookingSheet from "./BookingSheet";
import { useCurrency } from "@/lib/currency";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  duration: string;
  /** ZAR per person, or null for "On request". */
  fromZAR: number | null;
  title: string;
  inclusions: string[];
  subject: string;
  /** Slug for this tour package (used with source_page). */
  slug?: string;
  onEnquire?: () => void;
}

const PricingCard = ({ duration, title, inclusions, subject, fromZAR, slug, onEnquire }: Props) => {
  const [open, setOpen] = useState(false);
  const { format } = useCurrency();

  const bookable = fromZAR != null && fromZAR > 0;

  return (
    <article className="bg-surface-raised border border-border/40 p-8 flex flex-col">
      <p className="eyebrow">{duration}</p>
      <h3 className="font-serif text-2xl md:text-3xl mt-4 text-foreground">{title}</h3>
      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Pricing · guide</p>
        <p className="font-serif text-3xl text-gold mt-2">
          {bookable ? `From ${format(fromZAR)}` : "On request"}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          per person · rough guide · final quote often lower on request
        </p>
      </div>


      <ul className="mt-6 space-y-2 text-sm text-foreground/85 flex-1">
        {inclusions.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="text-gold">·</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>

      {onEnquire ? (
        <button
          type="button"
          onClick={onEnquire}
          className="mt-8 text-center px-6 py-3 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Book dates
        </button>
      ) : bookable ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-8 text-center px-6 py-3 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
          >
            Book dates
          </button>
          <BookingSheet
            open={open}
            onOpenChange={setOpen}
            kind="tour"
            name={`${title} (${duration})`}
            subtitle={subject}
            rateZAR={fromZAR}
            unit="person"
            slug={slug ?? title.toLowerCase().replace(/\s+/g, "-")}
          />
        </>
      ) : (
        <a
          href={buildWhatsAppUrl(subject)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 text-center px-6 py-3 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Book dates
        </a>
      )}
    </article>
  );
};

export default PricingCard;
