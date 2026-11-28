import { useParams, Navigate } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import { Seo } from "@/components/Seo";
import NotFound from "./NotFound";
import ListingGallery from "@/components/svrm/ListingGallery";
import ListingEnquiry from "@/components/svrm/ListingEnquiry";
import { Breadcrumbs, FactList, ListingFaqs, RelatedLinks, breadcrumbSchema, listingFaqSchema, useListingPage } from "@/components/svrm/ListingSections";
import { findStay, stayListing, stayUrlSlug, SITE_URL } from "@/data/listings";
import { useListingPhotos } from "@/hooks/useListingPhotos";
import { useCurrency } from "@/lib/currency";
import type { Stay } from "@/data/stays";
import { stayFacts, stayHasPublicRate } from "@/data/stayFacts";

const StayDetailInner = ({ stay }: { stay: Stay }) => {
  const l = stayListing(stay);
  const { format } = useCurrency();
  const photos = useListingPhotos("stay", stay.slug, l.photos, l.name);
  const enquiry = { id: `stay:${stay.slug}`, name: l.name, kind: "stay", url: l.url, path: l.path } as const;
  useListingPage(enquiry, "stay");
  const crumbs = [{ label: "Home", to: "/" }, { label: "Stays", to: "/stays" }, { label: l.name, to: l.path }];
  const showPrice = stay.fromZAR > 0;
  const unit = stay.type === "hotel" ? "per room per night" : "per night";
  const price = showPrice ? `From ${format(stay.fromZAR)} ${unit}, depending on season` : "Enquire for your dates";
  const rate = stayFacts[stay.slug]?.rate;
  const seasonal = showPrice && rate?.seasons?.length
    ? [...rate.seasons.map((x) => `${x.label}: from ${format(x.fromZAR)} ${unit}`), ...(rate.inclusions ? [rate.inclusions] : [])].join(" · ")
    : null;
  return (
    <main className="bg-background text-foreground min-h-screen pb-24 lg:pb-0">
      <Seo
        title={`${l.name} | Luxury Stay Cape Town — SVRM`}
        description={`${l.name} in ${l.neighbourhood}, Cape Town. ${l.bedrooms}, ${l.bathrooms}; ${l.maxGuests}. ${l.priceLabel}. Check availability on WhatsApp.`.slice(0, 300)}
        path={l.path}
        image={photos[0]?.src}
        jsonLd={[
          breadcrumbSchema(crumbs),
          listingFaqSchema(l.faqs),
          {
            "@context": "https://schema.org", "@type": "Accommodation", name: l.name, url: l.url, description: l.description,
            address: { "@type": "PostalAddress", addressLocality: `${l.neighbourhood}, Cape Town`, addressCountry: "ZA" },
            image: photos.slice(0, 4).map((p) => new URL(p.src, SITE_URL).toString()),
            ...(l.bedroomCount ? { numberOfBedrooms: l.bedroomCount } : {}),
            ...(l.bathroomCount ? { numberOfBathroomsTotal: l.bathroomCount } : {}),
            ...(l.guestCapacity ? { occupancy: { "@type": "QuantitativeValue", maxValue: l.guestCapacity } } : {}),
          },
        ]}
      />
      <Nav />
      <div className="container pt-28 md:pt-32">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-10">
            <header>
              <p className="eyebrow">{l.neighbourhood} · {stay.type === "hotel" ? "Hotel suite" : stay.type === "villa" ? "Villa" : "Apartment"}</p>
              <h1 className="font-serif text-4xl md:text-5xl mt-2">{l.name}</h1>
              <p className="mt-3 font-serif text-2xl text-gold">{price}</p>
              <p className="text-xs text-muted-foreground mt-1">{l.priceNote}</p>
            </header>
            <ListingGallery photos={photos} name={l.name} />
            <p className="text-base leading-relaxed text-muted-foreground">{l.description}</p>
            <section aria-labelledby="why-heading">
              <h2 id="why-heading" className="font-serif text-2xl">Why stay here?</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{l.why}</p>
            </section>
            <FactList facts={[
              ["Neighbourhood", l.neighbourhood],
              ["Bedrooms", l.bedrooms],
              ["Bathrooms", l.bathrooms],
              ["Maximum guests", l.maxGuests],
              ["Pool", l.pool],
              ["Amenities", l.amenities.length ? l.amenities.join(" · ") : "Your concierge will confirm"],
              ["Price", seasonal ?? price],
            ]} />
            <ListingFaqs faqs={l.faqs} title={`${l.name} — questions`} />
            <RelatedLinks links={l.related} />
          </div>
          <aside className="lg:sticky lg:top-28 self-start">
            <ListingEnquiry listing={enquiry} category="stay" />
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
};

const StayDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const stay = findStay(slug);
  if (!stay) return <NotFound />;
  if (slug !== stayUrlSlug(stay)) return <Navigate to={`/stays/${stayUrlSlug(stay)}`} replace />;
  return <StayDetailInner key={stay.slug} stay={stay} />;
};
export default StayDetail;
