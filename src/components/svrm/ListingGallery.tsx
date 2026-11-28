import { useEffect, useState } from "react";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import SmartImage from "./SmartImage";
import type { Photo } from "@/data/listings";

/** Swipeable photo gallery with full-screen viewing; one photo renders without carousel controls. */
const ListingGallery = ({ photos, name, fill = false }: { photos: Photo[]; name: string; fill?: boolean }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => { api.off("select", update); };
  }, [api]);
  if (!photos.length) return null;
  const many = photos.length > 1;
  const photo = photos[Math.min(selected, photos.length - 1)];
  const move = (o: number) => api?.scrollTo((selected + o + photos.length) % photos.length);
  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: many }} aria-label={`${name} photos`}>
        <CarouselContent className="ml-0">
          {photos.map((p, i) => (
            <CarouselItem key={p.src} className="pl-0">
              <SmartImage src={p.src} alt={p.alt} wrapperClassName={fill ? "aspect-[4/3] md:aspect-[16/9] h-full" : `aspect-[16/10] md:aspect-[16/9] ${p.fit === "contain" ? "bg-surface-deep" : ""}`} className={`absolute inset-0 w-full h-full ${p.fit === "contain" && !fill ? "object-contain" : "object-cover"}`} sizes="(min-width: 1024px) 66vw, 100vw" priority={i === 0} loading={i === 0 ? "eager" : "lazy"} />
              {p.caption && <p className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/85 px-3 py-1 text-xs text-foreground">{p.caption}</p>}
            </CarouselItem>
          ))}
        </CarouselContent>
        {many && <CarouselPrevious className="left-3 bg-background/90" title="Previous photo" />}
        {many && <CarouselNext className="right-3 bg-background/90" title="Next photo" />}
        {many && <span className="absolute top-3 left-3 bg-background/90 px-2 py-1 text-xs text-foreground" aria-live="polite">{selected + 1} / {photos.length}</span>}
        <Button size="icon" variant="outline" className="absolute top-3 right-3 bg-background/90" title="View full screen" aria-label="View full screen" onClick={() => setExpanded(true)}><Maximize2 className="h-4 w-4" /></Button>
      </Carousel>
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="h-[100dvh] max-w-none gap-0 border-0 p-0 sm:rounded-none [&>button]:z-10 [&>button]:bg-background/90 [&>button]:p-2">
          <DialogTitle className="sr-only">{photo.alt}</DialogTitle>
          <SmartImage src={photo.fullSrc} alt={photo.alt} original priority wrapperClassName="absolute inset-0 h-full w-full" className={`absolute inset-0 w-full h-full ${fill ? "object-cover" : "object-contain"}`} />
          {many && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-background/90 p-3">
              <Button variant="outline" size="icon" aria-label="Previous photo" onClick={() => move(-1)}><ChevronLeft /></Button>
              <span className="text-sm text-muted-foreground">{photo.caption ?? `${selected + 1} / ${photos.length}`}</span>
              <Button variant="outline" size="icon" aria-label="Next photo" onClick={() => move(1)}><ChevronRight /></Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ListingGallery;
