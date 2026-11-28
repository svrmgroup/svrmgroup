import { Link, Navigate, useParams } from "react-router-dom";
import { TourRouteMap } from "@/components/svrm/TourRouteMap";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PricingCard from "@/components/svrm/PricingCard";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import ServiceFaq from "@/components/svrm/ServiceFaq";
import { capePeninsulaTourFaqs } from "@/data/faq";
import { Seo } from "@/components/Seo";
import { findTour } from "@/data/tours";
import SmartImage from "@/components/svrm/SmartImage";
import WellnessCustomBuilder from "@/components/svrm/WellnessCustomBuilder";
import BackgroundVideo from "@/components/svrm/BackgroundVideo";
import ListingGallery from "@/components/svrm/ListingGallery";
import ListingEnquiry from "@/components/svrm/ListingEnquiry";
import { FactList, useListingPage } from "@/components/svrm/ListingSections";
import { useListingPhotos } from "@/hooks/useListingPhotos";
import type { TourCategory } from "@/data/tours";

const PENINSULA_FACTS: [string, string][] = [
  ["Typical duration", "Full day, about 8–10 hours"],
  ["Pickup areas", "Your hotel, villa or apartment — City Bowl, V&A Waterfront, Atlantic Seaboard and Southern Suburbs; other areas on request"],
  ["Route", "Camps Bay & Clifton → Hout Bay → Chapman's Peak Drive → Noordhoek → Cape Point & Cape of Good Hope → Boulders Beach & Simon's Town → back to Cape Town"],
  ["Included", "Private chauffeur and vehicle for the day, the full route at your pace, lunch reservation arranged"],
  ["Tickets & extras", "Cape Point (Table Mountain National Park) and Boulders Beach entry are arranged for you — your quote confirms whether they are included. Lunch, drinks and optional extras are paid separately."],
  ["Subject to conditions", "Chapman's Peak Drive can close in bad weather or for rockfall — we reroute via Ou Kaapse Weg. Cape Point, Boulders Beach and Chapman's Peak are standard stops when open."],
];
const PENINSULA_VEHICLES = [
  { label: "Luxury sedan or SUV (up to 4)", to: "/chauffeur" },
  { label: "Mercedes-Maybach S-Class (Maybach Signature)", to: "/chauffeur/mercedes-maybach-s-class" },
  { label: "Mercedes V-Class (larger groups, on request)", to: "/chauffeur/mercedes-v-class" },
  { label: "Maybach V-Class (on request)", to: "/chauffeur/maybach-v-class" },
];

const TourEnquirySection = ({ tour }: { tour: TourCategory }) => {
  const path = `/tours/${tour.slug}`;
  const name = tour.slug === "cape-peninsula" ? "Cape Peninsula tour" : tour.label;
  const fallback = [tour.image, ...tour.packages.map((p) => p.image)].filter((x, i, a): x is string => !!x && a.indexOf(x) === i)
    .map((src, i) => ({ src, fullSrc: src, alt: `${tour.label} — photo ${i + 1}` }));
  const photos = useListingPhotos("tour", tour.slug, fallback, tour.label);
  const enquiry = { id: `tour:${tour.slug}`, name, kind: "tour", url: `https://svrm.group${path}`, path } as const;
  useListingPage(enquiry, "tour");
  const peninsula = tour.slug === "cape-peninsula";
  return (
    <section className="pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-8">
          <ListingGallery photos={photos} name={tour.label} />
          {peninsula && (
            <>
              <div>
                <p className="eyebrow">At a glance</p>
                <h2 className="font-serif text-2xl md:text-3xl mt-3">What your Peninsula day includes</h2>
              </div>
              <FactList facts={PENINSULA_FACTS} />
              <div>
                <h3 className="font-serif text-xl">Vehicle options</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {PENINSULA_VEHICLES.map((v) => (
                    <li key={v.label}><Link to={v.to} className="block border border-border/50 p-3 text-sm hover:border-primary/60 hover:text-gold">{v.label} →</Link></li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        <aside className="lg:sticky lg:top-28 self-start">
          <ListingEnquiry listing={enquiry} category="tour" vehicleOptions={peninsula ? ["Luxury sedan or SUV", "Mercedes-Maybach S-Class", "Mercedes V-Class", "Maybach V-Class"] : undefined} />
        </aside>
      </div>
    </section>
  );
};



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
    <main className="bg-background text-foreground min-h-screen pb-24 lg:pb-0">
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
          <BackgroundVideo src={tour.video} poster={tour.image} priority />

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

      <TourEnquirySection key={tour.slug} tour={tour} />


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
                unit={p.unit}
                image={p.image}
                subject={`${tour.label} — ${p.duration} ${p.title}${datesSuffix}`}
                slug={`${tour.slug}-${p.duration.toLowerCase().replace(/\s+/g, "-")}`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-10 max-w-2xl mx-auto">
            Every itinerary is personalised. Pricing is on request —{" "}
            {tour.slug === "cape-peninsula" ? "per group of up to 4" : "per person"}, excluding
            international flights.
          </p>
        </div>
      </section>

      {tour.slug === "wellness" && <WellnessCustomBuilder datesSuffix={datesSuffix} />}

      {tour.slug === "cape-peninsula" && (
        <section className="pb-16 md:pb-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-8">
              <p className="eyebrow">The route</p>
              <h2 className="font-serif text-2xl md:text-3xl mt-3 text-foreground">Your day around the Peninsula</h2>
            </div>
            <TourRouteMap />
          </div>
        </section>
      )}

      {tour.slug === "cape-peninsula" && (
        <section className="pb-24 md:pb-28">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-8">
              <p className="eyebrow">Good to know</p>
              <h2 className="font-serif text-2xl md:text-3xl mt-3 text-foreground">Cape Peninsula tour questions</h2>
            </div>
            <ServiceFaq items={capePeninsulaTourFaqs} />
          </div>
        </section>
      )}

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
