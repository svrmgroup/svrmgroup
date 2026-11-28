import { Link, useParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import { Seo } from "@/components/Seo";
import NotFound from "./NotFound";
import ListingGallery from "@/components/svrm/ListingGallery";
import ListingEnquiry from "@/components/svrm/ListingEnquiry";
import { Breadcrumbs, FactList, ListingFaqs, RelatedLinks, breadcrumbSchema, listingFaqSchema, useListingPage } from "@/components/svrm/ListingSections";
import { findVehicle, vehicleListing, SITE_URL } from "@/data/listings";
import { useListingPhotos } from "@/hooks/useListingPhotos";
import { useCurrency } from "@/lib/currency";

const VehicleDetailInner = ({ slug, service }: { slug: string; service: "chauffeur" | "self-drive" }) => {
  const vehicle = findVehicle(slug)!;
  const l = vehicleListing(vehicle, service);
  const { format } = useCurrency();
  const photos = useListingPhotos("vehicle", vehicle.slug, l.photos, l.name);
  const enquiry = { id: `vehicle:${l.slug}:${service}`, name: l.name, kind: service, url: l.url, path: l.path } as const;
  useListingPage(enquiry, "vehicle");
  const parent = service === "chauffeur" ? { label: "Chauffeur", to: "/chauffeur" } : { label: "Rentals", to: "/rentals" };
  const crumbs = [{ label: "Home", to: "/" }, parent, { label: l.name, to: l.path }];
  const price = service === "chauffeur" ? `From ${format(vehicle.fromZAR)} / day` : "On enquiry";
  const title = service === "chauffeur" ? `${l.name} with Chauffeur Cape Town | SVRM Group` : `${l.name} Self-Drive Rental Cape Town | SVRM Group`;
  const description = `${l.name} ${service === "chauffeur" ? "with a private chauffeur" : "self-drive rental"} in Cape Town. ${l.passengers}. ${l.priceLabel}. Check availability on WhatsApp.`.slice(0, 300);
  return (
    <main className="bg-background text-foreground min-h-screen pb-24 lg:pb-0">
      <Seo
        title={title}
        description={description}
        path={l.path}
        image={photos[0]?.src}
        jsonLd={[
          breadcrumbSchema(crumbs),
          listingFaqSchema(l.faqs),
          {
            "@context": "https://schema.org", "@type": "Service", name: `${l.name} — ${l.serviceLabel}`, url: l.url,
            areaServed: "Cape Town", provider: { "@type": "Organization", name: "SVRM Group", url: `${SITE_URL}/` },
            image: photos.slice(0, 4).map((p) => new URL(p.src, SITE_URL).toString()),
            ...(service === "chauffeur" ? { offers: { "@type": "Offer", price: vehicle.fromZAR, priceCurrency: "ZAR", unitText: "day" } } : {}),
          },
        ]}
      />
      <Nav />
      <div className="container pt-28 md:pt-32">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-10">
            <header>
              <p className="eyebrow">{l.serviceLabel} · {vehicle.tier}</p>
              <h1 className="font-serif text-4xl md:text-5xl mt-2">{l.name}</h1>
              <p className="mt-3 font-serif text-2xl text-gold">{price}</p>
              <p className="text-xs text-muted-foreground mt-1">{l.priceNote}</p>
            </header>
            <ListingGallery photos={photos} name={l.name} />
            <p className="text-base leading-relaxed text-muted-foreground">{l.description}</p>
            <section aria-labelledby="why-heading">
              <h2 id="why-heading" className="font-serif text-2xl">{l.whyTitle}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{l.why}</p>
              <p className="mt-3 text-sm"><span className="text-foreground">Best for:</span> <span className="text-muted-foreground">{l.suits}</span></p>
            </section>
            <FactList facts={[
              ["Passengers", service === "chauffeur" ? `${l.passengers} (excluding chauffeur)` : l.passengers],
              ["Luggage", l.luggage],
              ["Cabin & features", l.features.join(" · ")],
              ["Hire options", l.hireOptions.join(" · ")],
              ["Service area", l.serviceArea],
              ["Price", `${price}${service === "chauffeur" ? " — written quote is final" : ""}`],
            ]} />
            {service === "chauffeur" && vehicle.selfDrive && <p className="text-sm text-muted-foreground">Prefer to drive yourself? <Link className="text-gold underline-offset-4 hover:underline" to={`/rentals/${vehicle.slug}`}>See the {l.name} self-drive rental</Link>.</p>}
            {service === "self-drive" && <p className="text-sm text-muted-foreground">Want a driver? <Link className="text-gold underline-offset-4 hover:underline" to={`/chauffeur/${vehicle.slug}`}>Book the {l.name} with a chauffeur</Link>.</p>}
            <ListingFaqs faqs={l.faqs} title={`${l.name} — questions`} />
            <RelatedLinks links={l.related} />
          </div>
          <aside className="lg:sticky lg:top-28 self-start">
            <ListingEnquiry listing={enquiry} category="vehicle" />
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
};

const VehicleDetail = ({ service }: { service: "chauffeur" | "self-drive" }) => {
  const { slug } = useParams<{ slug: string }>();
  const v = findVehicle(slug);
  if (!v || (service === "self-drive" && !v.selfDrive)) return <NotFound />;
  return <VehicleDetailInner key={`${v.slug}:${service}`} slug={v.slug} service={service} />;
};
export default VehicleDetail;
