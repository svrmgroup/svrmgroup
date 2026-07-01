import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Stay } from "@/data/stays";
import { stayGalleries } from "@/data/stayGalleries";
import { useCurrency } from "@/lib/currency";
import BookingSheet from "./BookingSheet";

const StayCard = ({ stay }: { stay: Stay; index?: number }) => {
  const { format } = useCurrency();
  const showPrice = stay.nox;
  const [open, setOpen] = useState(false);

  const gallery = stayGalleries[stay.slug];
  const images = gallery && gallery.length ? gallery : [stay.image];

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
    <article className="group bg-surface-raised border border-border/40 flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-deep">
        <div className="embla h-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((src, i) => (
              <div key={i} className="relative flex-[0_0_100%] h-full">
                <img
                  src={src}
                  alt={`${stay.name} — photo ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover"
                />
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
          {stay.name}
        </h3>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80 mt-2">
          {stay.beds}
        </p>
        <p className="text-sm text-muted-foreground mt-3 flex-1">{stay.blurb}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
              {showPrice ? "From / night" : "Rates"}
            </p>
            <p className="font-serif text-xl text-gold">
              {showPrice ? format(stay.fromZAR) : "On request"}
            </p>
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
        subtitle={`${stay.area} · ${stay.beds}`}
        rateZAR={stay.fromZAR}
        unit="night"
        slug={stay.slug}
      />
    </article>
  );
};

export default StayCard;
