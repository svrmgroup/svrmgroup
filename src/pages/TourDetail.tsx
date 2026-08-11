import { Link, Navigate, useParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PricingCard from "@/components/svrm/PricingCard";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import { Seo } from "@/components/Seo";
import { findTour } from "@/data/tours";
import SmartImage from "@/components/svrm/SmartImage";
import WellnessCustomBuilder from "@/components/svrm/WellnessCustomBuilder";
import BackgroundVideo from "@/components/svrm/BackgroundVideo";


const TourDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const tour = slug ? findTour(slug) : null;
  if (!tour) return <Navigate to="/tours" replace />;

  const title = `${tour.label} — SVRM Tour`;
  const description = (tour as { summary?: string; subtitle?: string }).summary
    ?? (tour as { subtitle?: string }).subtitle
    ?? `Bespoke ${tour.label} tour in South Africa, curated end-to-end by SVRM.`;

  const datesSuffix = "";

  const SITE = "https://svrm.group";
  const tourUrl = `${SITE}/tours/${slug}`;
  const imageUrl = new URL(tour.image, SITE).toString();
  const provider = { "@type": "Organization", name: "SVRM Group", url: `${SITE}/` };

  const pricedPackages = tour.packages.filter((p) => typeof p.fromZAR === "number");
  const lowPrice = pricedPackages.length
    ? Math.min(...pricedPackages.map((p) => p.fromZAR as number))
    : null;
  const highPrice = pricedPackages.length
    ? Math.max(...pricedPackages.map((p) => p.fromZAR as number))
    : null;

  const offers = tour.packages.map((p) => ({
    "@type": "Offer",
    name: `${p.title} · ${p.duration}`,
    url: tourUrl,
    priceCurrency: "ZAR",
    ...(typeof p.fromZAR === "number"
      ? { price: p.fromZAR, availability: "https://schema.org/InStock" }
      : { availability: "https://schema.org/PreOrder" }),
    category: p.duration,
    description: p.inclusions.join(", "),
    seller: provider,
  }));

  const tourSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["TouristTrip", "Product"],
    "@id": `${tourUrl}#tour`,
    name: tour.label,
    description: String(tour.description ?? description),
    disambiguatingDescription: tour.blurb,
    touristType: "Luxury private travellers",
    provider,
    brand: provider,
    image: imageUrl,
    url: tourUrl,
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.packages.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${p.title} (${p.duration})`,
        description: p.inclusions.join(", "),
      })),
    },
    offers:
      lowPrice !== null
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "ZAR",
            lowPrice,
            ...(highPrice !== null ? { highPrice } : {}),
            offerCount: tour.packages.length,
            availability: "https://schema.org/InStock",
            offers,
            seller: provider,
          }
        : offers,
    areaServed: [
      { "@type": "City", name: "Cape Town" },
      { "@type": "Country", name: "South Africa" },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Tours", item: `${SITE}/tours` },
      { "@type": "ListItem", position: 3, name: tour.label, item: tourUrl },
    ],
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={title.length > 60 ? `${tour.label} | SVRM` : title}
        description={String(description).slice(0, 158)}
        path={`/tours/${slug}`}
        image={tour.image}
        jsonLd={[tourSchema, breadcrumbSchema]}
      />

      <Nav />
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {tour.video ? (
          <BackgroundVideo src={tour.video} poster={tour.image} />

        ) : (
          <SmartImage src={tour.image} alt={tour.label} priority wrapperClassName="absolute inset-0 w-full h-full" className="absolute inset-0 w-full h-full object-cover" />
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


      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Packages</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">From one day to bespoke.</h2>
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
