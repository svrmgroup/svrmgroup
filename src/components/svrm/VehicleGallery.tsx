import { useEffect, useState } from "react";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { Vehicle } from "@/data/vehicles";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import SmartImage from "./SmartImage";

const VehicleGallery = ({ vehicle }: { vehicle: Vehicle }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const photos = vehicle.gallery ?? [];
  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => { api.off("select", update); };
  }, [api]);
  if (photos.length === 0) return null;
  const photo = photos[selected];
  const move = (offset: number) => api?.scrollTo((selected + offset + photos.length) % photos.length);
  return (
    <>
      <Carousel setApi={setApi} opts={{ loop: true }} aria-label={`${vehicle.name} photos`}>
        <CarouselContent className="ml-0">
          {photos.map((image, index) => (
            <CarouselItem key={image.src} className="pl-0">
              <SmartImage src={image.src} alt={`${vehicle.name} — ${image.alt}`} wrapperClassName="aspect-[16/10]" className="w-full h-full object-contain bg-surface-deep" loading={index === 0 ? "eager" : "lazy"} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 bg-background/90" title="Previous photo" />
        <CarouselNext className="right-3 bg-background/90" title="Next photo" />
        <span className="absolute bottom-3 left-3 bg-background/90 px-2 py-1 text-xs text-foreground" aria-live="polite">{selected + 1} / {photos.length}</span>
        <Button size="icon" variant="outline" className="absolute bottom-3 right-3 bg-background/90" title="View 4K photo" aria-label="View 4K photo" onClick={() => setExpanded(true)}><Maximize2 className="h-4 w-4" /></Button>
      </Carousel>
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-5xl p-4">
          <DialogTitle>{vehicle.name} — {photo?.alt}</DialogTitle>
          {photo && <SmartImage src={photo.fullSrc} alt={`${vehicle.name} — ${photo.alt}`} priority wrapperClassName="h-[65vh]" className="w-full h-full object-contain" />}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" title="Previous photo" aria-label="Previous photo" onClick={() => move(-1)}><ChevronLeft /></Button>
            <span className="text-sm text-muted-foreground">{selected + 1} / {photos.length}</span>
            <Button variant="outline" size="icon" title="Next photo" aria-label="Next photo" onClick={() => move(1)}><ChevronRight /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default VehicleGallery;