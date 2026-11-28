import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Stay } from "@/data/stays";
import { stayGalleries } from "@/data/stayGalleries";
import { Link } from "react-router-dom";
import { stayPath } from "@/data/listings";
import { useCurrency } from "@/lib/currency";
import BookingSheet from "./BookingSheet";
import SmartImage from "./SmartImage";
import { poolLabel, stayFactSummary, stayFacts, stayFeatureSummary, stayHasPublicRate } from "@/data/stayFacts";

const StayCard = ({ stay }: { stay: Stay; index?: number }) => {
  const { format } = useCurrency();
  const showPrice = stay.fromZAR > 0;
  const facts = stayFacts[stay.slug];
  const [open, setOpen] = useState(false);

  const gallery = stayGalleries[stay.slug];
  const images = gallery && gallery.length ? gallery : [stay.image];
  const factsSummary = stayFactSummary(stay.slug) || stay.beds;
  const featureSummary = stayFeatureSummary(stay.beds);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
    return () => {
      emblaApi.off("select", onSel);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi],
  );
  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi],
  );

  return (
    <article
      className={`group bg-surface-raised flex flex-col overflow-hidden ${
        stay.featured
          ? "border-2 border-primary/80 shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_20px_60px_-20px_hsl(var(--primary)/0.4)]"
          : "border border-border/40"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-deep">
        {stay.featured && (
          <div className="absolute top-3 left-3 z-20 bg-primary text-primary-foreground px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium shadow-lg">
            Featured
          </div>
        )}
        <div className="embla h-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((src, i) => (
              <div key={i} className="relative flex-[0_0_100%] h-full">
                <Link to={stayPath(stay)} aria-label={`View ${stay.name} details`} className="absolute inset-0 block">
                <SmartImage
                  src={src}
                  alt={`${stay.name} — photo ${i + 1}`}
                  loading="lazy"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  wrapperClassName="absolute inset-0 w-full h-full"
                  className="w-full h-full object-cover"
                />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-background/70 hover:bg-background text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-background/70 hover:bg-background text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {snaps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === selected ? "w-4 bg-gold" : "w-1.5 bg-background/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <p className="eyebrow">{stay.area}</p>
        <h3 className="font-serif text-xl md:text-2xl mt-2 text-foreground leading-snug break-words">
          <Link to={stayPath(stay)} className="hover:text-gold transition-colors">{stay.name}</Link>
        </h3>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80 mt-2">
          {factsSummary}
        </p>
        {featureSummary && <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">{featureSummary}</p>}
        {poolLabel(facts) && <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-foreground/75">{facts.pool.label ? poolLabel(facts) : `Pool · ${poolLabel(facts)}`}</p>}
        <p className="text-sm text-muted-foreground mt-3 flex-1">{stay.blurb}</p>
        <Link to={stayPath(stay)} className="mt-4 text-[11px] uppercase tracking-[0.22em] text-gold hover:underline underline-offset-4">View details →</Link>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
              {showPrice ? (stay.type === "hotel" ? "From / room / night" : "From / property / night") : "Rates"}
            </p>
            <p className="font-serif text-xl text-gold">
              {showPrice ? format(stay.fromZAR) : "Enquire for your dates"}
            </p>
            {showPrice && (
              <p className="text-[10px] tracking-wide text-muted-foreground/60 mt-1">Depending on season. Final pricing confirmed for your dates.</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[10px] uppercase tracking-[0.24em] px-4 py-3 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors whitespace-nowrap"
          >
            Book dates
          </button>
        </div>
      </div>

      <BookingSheet
        open={open}
        onOpenChange={setOpen}
        kind="stay"
        name={stay.name}
        subtitle={`${stay.area} · ${factsSummary}`}
        rateZAR={showPrice ? stay.fromZAR : 0}
        unit="night"
        slug={stay.slug}
      />
    </article>
  );
};

export default StayCard;
