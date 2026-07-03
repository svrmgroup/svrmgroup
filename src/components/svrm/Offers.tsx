import { useRef } from "react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import bmwx3 from "@/assets/vehicles/bmwx3.jpg";
import SmartImage from "@/components/svrm/SmartImage";
import romantic from "@/assets/tours/romantic.jpg";
import chauffeur from "@/assets/svc-travel-sclass.jpg";
import safari from "@/assets/svc-exp-safari.jpg";
import villa from "@/assets/svc-stays-villa.jpg";

type Offer = {
  eyebrow: string;
  title: string;
  detail: string;
  price: string;
  priceSuffix?: string;
  cta: string;
  to: string;
  image: string;
};

const offers: Offer[] = [
  {
    eyebrow: "Featured · Self-drive",
    title: "BMW X3",
    detail: "Compact SUV, dialled in. Free delivery within Cape Town.",
    price: "R2,000",
    priceSuffix: "/ day",
    cta: "Reserve the X3",
    to: "/rentals",
    image: bmwx3,
  },
  {
    eyebrow: "New · Romantic",
    title: "Cape Honeymoon Signature",
    detail: "3 nights, hot-air balloon, helicopter beach picnic, petal turndowns.",
    price: "From R48,000",
    cta: "See romantic packages",
    to: "/tours/romantic",
    image: romantic,
  },
  {
    eyebrow: "Chauffeur",
    title: "Private S-Class Days",
    detail: "Executive chauffeur with S-Class or E-Class, up to 8 hours in-city.",
    price: "From R6,500",
    priceSuffix: "/ day",
    cta: "Book a chauffeur",
    to: "/travel",
    image: chauffeur,
  },
  {
    eyebrow: "Safari",
    title: "Sabi Sand Signature",
    detail: "4 nights premium lodge, twice-daily game drives, flights included.",
    price: "From R28,000",
    priceSuffix: "/ pp",
    cta: "View safari tours",
    to: "/tours/safari",
    image: safari,
  },
  {
    eyebrow: "Stays",
    title: "Camps Bay Villa",
    detail: "Curated villas and residences across the Cape's best addresses.",
    price: "On request",
    cta: "Browse stays",
    to: "/stays",
    image: villa,
  },
];

const Offers = () => {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  return (
    <section id="offers" className="py-24 md:py-32 bg-surface-raised/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="eyebrow">Current offers</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 text-foreground">
              Handpicked, this season.
            </h2>
            <div className="gold-divider w-16 mt-6" />
          </div>
          <p className="text-sm text-muted-foreground max-w-md md:text-right">
            A rotating selection of our best-value fleet, romantic packages and
            chauffeur days — updated regularly.
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
          className="relative"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {offers.map((o) => (
              <CarouselItem
                key={o.title}
                className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Link
                  to={o.to}
                  className="group block h-full bg-background border border-border/60 hover:border-primary/60 transition-colors overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-raised">
                    <SmartImage
                      src={o.image}
                      alt={o.title}
                      wrapperClassName="absolute inset-0 w-full h-full"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-foreground/80 z-10">
                      {o.eyebrow}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <h3 className="font-serif text-2xl text-foreground">
                      {o.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
                      {o.detail}
                    </p>
                    <div className="flex items-baseline justify-between pt-3 border-t border-border/50">
                      <div>
                        <span className="font-serif text-xl text-foreground">
                          {o.price}
                        </span>
                        {o.priceSuffix && (
                          <span className="text-xs text-muted-foreground ml-1">
                            {o.priceSuffix}
                          </span>
                        )}
                      </div>
                      <span className="text-xs uppercase tracking-[0.15em] text-primary group-hover:translate-x-1 transition-transform">
                        {o.cta} →
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default Offers;
