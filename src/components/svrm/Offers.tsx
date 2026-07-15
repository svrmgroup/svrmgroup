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
import CurrencySwitch from "@/components/svrm/CurrencySwitch";
import romantic from "@/assets/tours/romantic.jpg";
import chauffeur from "@/assets/svc-travel-sclass.jpg";
import safari from "@/assets/svc-exp-safari.jpg";
import villa from "@/assets/svc-stays-villa.jpg";
import { useCurrency } from "@/lib/currency";
import { useCmsItems } from "@/hooks/useCmsItems";

type Offer = {
  eyebrow: string;
  title: string;
  detail: string;
  /** Price in ZAR — converted live via the currency context. Null renders as "On request". */
  priceZAR: number | null;
  /** Original ZAR price, shown struck-through when a special applies. */
  originalZAR?: number;
  pricePrefix?: string;
  priceSuffix?: string;
  cta: string;
  to: string;
  image: string;
  /** Show the gold "Special Offer" badge and ribbon treatment. */
  special?: boolean;
};

const offers: Offer[] = [
  {
    eyebrow: "Special Offer · Self-drive",
    title: "BMW X3",
    detail: "Compact luxury SUV, dialled in. Free delivery within Cape Town.",
    priceZAR: 2000,
    originalZAR: 3000,
    priceSuffix: "/ day",
    cta: "Reserve the X3",
    to: "/rentals",
    image: bmwx3,
    special: true,
  },
  {
    eyebrow: "New · Romantic",
    title: "Cape Honeymoon Signature",
    detail: "3 nights, hot-air balloon, helicopter beach picnic, petal turndowns.",
    priceZAR: 48000,
    pricePrefix: "From ",
    cta: "See romantic packages",
    to: "/tours/romantic",
    image: romantic,
  },
  {
    eyebrow: "Chauffeur",
    title: "Private S-Class Days",
    detail: "Executive chauffeur with S-Class or E-Class, up to 8 hours in-city.",
    priceZAR: 6500,
    pricePrefix: "From ",
    priceSuffix: "/ day",
    cta: "Book a chauffeur",
    to: "/travel",
    image: chauffeur,
  },
  {
    eyebrow: "Safari",
    title: "Sabi Sand Signature",
    detail: "4 nights premium lodge, twice-daily game drives, flights included.",
    priceZAR: 28000,
    pricePrefix: "From ",
    priceSuffix: "/ pp",
    cta: "View safari tours",
    to: "/tours/safari",
    image: safari,
  },
  {
    eyebrow: "Stays",
    title: "Camps Bay Villa",
    detail: "Curated villas and residences across the Cape's best addresses.",
    priceZAR: null,
    cta: "Browse stays",
    to: "/stays",
    image: villa,
  },
];

const Offers = () => {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const { format } = useCurrency();
  const { items: cmsOffers } = useCmsItems("offers");

  const cmsMapped: Offer[] = cmsOffers.map((c) => ({
    eyebrow: c.eyebrow || "Featured",
    title: c.title,
    detail: c.summary || "",
    priceZAR: c.price_zar,
    originalZAR: c.original_price_zar ?? undefined,
    pricePrefix: c.price_prefix ?? undefined,
    priceSuffix: c.price_suffix ?? undefined,
    cta: c.cta_label || "Learn more",
    to: c.cta_href || "/contact",
    image: c.image_url || villa,
    special: /special/i.test(c.eyebrow || ""),
  }));
  const displayOffers = cmsMapped.length > 0 ? cmsMapped : offers;



  return (
    <section
      id="offers"
      className="relative py-20 md:py-28 bg-gradient-to-b from-surface-raised/60 via-surface-raised/30 to-background border-y border-primary/20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 text-gold px-3 py-1 text-[10px] tracking-[0.22em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Limited-time offers &amp; promotions
            </div>
            <h2 className="font-serif text-4xl md:text-6xl mt-2 text-foreground leading-[1.05]">
              Handpicked, this season.
            </h2>
            <div className="gold-divider w-16 mt-6" />
          </div>
          <div className="flex flex-col md:items-end gap-3">
            <p className="text-sm text-muted-foreground max-w-md md:text-right">
              A rotating selection of our best-value fleet, romantic packages
              and chauffeur days — updated regularly.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Show prices in
              </span>
              <CurrencySwitch />
            </div>
          </div>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
          className="relative"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {displayOffers.map((o) => (
              <CarouselItem
                key={o.title}
                className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Link
                  to={o.to}
                  className={`group relative block h-full bg-background overflow-hidden transition-colors ${
                    o.special
                      ? "border-2 border-primary/80 shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_20px_60px_-20px_hsl(var(--primary)/0.4)]"
                      : "border border-border/60 hover:border-primary/60"
                  }`}
                >
                  {o.special && (
                    <div className="absolute top-4 right-4 z-20 bg-primary text-primary-foreground px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium shadow-lg">
                      Special Offer
                    </div>
                  )}
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
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {o.originalZAR && (
                          <span className="text-sm text-muted-foreground/70 line-through">
                            {format(o.originalZAR)}
                          </span>
                        )}
                        {o.pricePrefix && (
                          <span className="text-xs text-muted-foreground">
                            {o.pricePrefix}
                          </span>
                        )}
                        <span
                          className={`font-serif text-xl ${
                            o.special ? "text-gold" : "text-foreground"
                          }`}
                        >
                          {o.priceZAR === null ? "On request" : format(o.priceZAR)}
                        </span>
                        {o.priceSuffix && o.priceZAR !== null && (
                          <span className="text-xs text-muted-foreground">
                            {o.priceSuffix}
                          </span>
                        )}
                      </div>
                      <span className="text-xs uppercase tracking-[0.15em] text-primary group-hover:translate-x-1 transition-transform whitespace-nowrap">
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
