import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { formatDate, formatDateRange } from "@/lib/locale";
import { CalendarIcon, Users } from "lucide-react";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PricingCard from "@/components/svrm/PricingCard";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import { Seo } from "@/components/Seo";
import { findTour } from "@/data/tours";
import WellnessCustomBuilder from "@/components/svrm/WellnessCustomBuilder";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const TourDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const tour = slug ? findTour(slug) : null;
  const [range, setRange] = useState<DateRange | undefined>();
  const [travellers, setTravellers] = useState(2);

  if (!tour) return <Navigate to="/tours" replace />;

  const title = `${tour.label} — SVRM Tour`;
  const description = (tour as { summary?: string; subtitle?: string }).summary
    ?? (tour as { subtitle?: string }).subtitle
    ?? `Bespoke ${tour.label} tour in South Africa, curated end-to-end by SVRM.`;

  const nights =
    range?.from && range?.to ? Math.max(1, differenceInCalendarDays(range.to, range.from)) : 0;

  const dateLabel = range?.from
    ? range.to
      ? formatDateRange(range.from, range.to, { day: "numeric", month: "short", year: "numeric" })
      : formatDate(range.from, { day: "numeric", month: "short", year: "numeric" })
    : "Select your dates";

  const datesSuffix =
    range?.from && range?.to
      ? ` · ${formatDateRange(range.from, range.to, { day: "numeric", month: "short", year: "numeric" })} · ${travellers} traveller${travellers > 1 ? "s" : ""}`
      : ` · ${travellers} traveller${travellers > 1 ? "s" : ""}`;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={title.length > 60 ? `${tour.label} | SVRM` : title}
        description={String(description).slice(0, 158)}
        path={`/tours/${slug}`}
      />
      <Nav />
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {tour.video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={tour.image}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={tour.video} type="video/mp4" />
          </video>
        ) : (
          <img src={tour.image} alt={tour.label} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-deep/60 via-surface-deep/30 to-surface-deep" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-12 md:pb-20 w-full">
            <Link to="/tours" className="text-xs uppercase tracking-[0.28em] text-gold hover:text-foreground">
              ← All tours
            </Link>
            <h1 className="font-serif text-5xl md:text-7xl mt-6 text-foreground leading-[1.05] max-w-3xl">
              {tour.label}
            </h1>
            <div className="gold-divider w-16 mt-8" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-serif text-2xl md:text-3xl text-foreground leading-[1.3]">{tour.blurb}</p>
          <p className="mt-8 text-muted-foreground leading-relaxed">{tour.description}</p>
        </div>
      </section>

      {/* Date picker + traveller selector */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-surface-raised border border-border/40 p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Preferred dates</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "mt-3 w-full flex items-center justify-between gap-3 border border-border/60 bg-transparent text-left px-4 py-3 text-sm",
                      !range && "text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4" />
                      {dateLabel}
                    </span>
                    {nights > 0 && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                        {nights} night{nights > 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-surface-raised border-border/60" align="start">
                  <Calendar
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    numberOfMonths={1}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Travellers</p>
              <div className="mt-3 flex items-center justify-between border border-border/60 px-4 py-3">
                <span className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4" />
                  {travellers} traveller{travellers > 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTravellers((n) => Math.max(1, n - 1))}
                    className="w-8 h-8 border border-border/60 text-gold hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Fewer travellers"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravellers((n) => Math.min(20, n + 1))}
                    className="w-8 h-8 border border-border/60 text-gold hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="More travellers"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/70 mt-3 text-center">
            Dates and travellers attach to your enquiry automatically.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Packages</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">From three days to bespoke.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tour.packages.map((p) => (
              <PricingCard
                key={p.duration + p.title}
                duration={p.duration}
                title={p.title}
                fromZAR={p.fromZAR}
                inclusions={p.inclusions}
                subject={`${tour.label} — ${p.duration} ${p.title}${datesSuffix}`}
                slug={`${tour.slug}-${p.duration.toLowerCase().replace(/\s+/g, "-")}`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-10 max-w-2xl mx-auto">
            Every itinerary is personalised. Pricing is on request — per person, excluding
            international flights.
          </p>
        </div>
      </section>

      {tour.slug === "wellness" && <WellnessCustomBuilder datesSuffix={datesSuffix} />}

      <section className="bg-surface-deep py-24 md:py-32 border-t border-border/40">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Enquire · {tour.label}</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-6 text-foreground">Send us the brief.</h2>
          </div>
          <EnquiryForm subject={`${tour.label}${datesSuffix}`} />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TourDetail;
