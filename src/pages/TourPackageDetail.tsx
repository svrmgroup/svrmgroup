import { Link, useParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import NotFound from "./NotFound";
import { Seo } from "@/components/Seo";
import ListingGallery from "@/components/svrm/ListingGallery";
import ListingEnquiry from "@/components/svrm/ListingEnquiry";
import { Breadcrumbs, FactList, RelatedLinks, breadcrumbSchema, useListingPage } from "@/components/svrm/ListingSections";
import { findTourPackage, tourPackageDescription, tourPackagePath, tourPackagePhotoKey, tourPackageSlug } from "@/data/tourPackages";
import { tourPackagePhotos } from "@/data/tourPhotos";
import { useListingPhotos } from "@/hooks/useListingPhotos";
import { useCurrency } from "@/lib/currency";
import { SITE_URL } from "@/data/listings";

const TourPackageDetail = () => {
  const { slug, packageSlug } = useParams<{ slug: string; packageSlug: string }>();
  const found = findTourPackage(slug, packageSlug);
  if (!found) return <NotFound />;
  return <TourPackageDetailInner key={`${slug}:${packageSlug}`} tour={found.tour} pkg={found.pkg} />;
};

const TourPackageDetailInner = ({ tour, pkg }: { tour: NonNullable<ReturnType<typeof findTourPackage>>["tour"]; pkg: NonNullable<ReturnType<typeof findTourPackage>>["pkg"] }) => {
  const { format } = useCurrency();
  const path = tourPackagePath(tour, pkg);
  const url = `${SITE_URL}${path}`;
  const description = tourPackageDescription(tour, pkg);
  const fallback = tourPackagePhotos(tour, pkg);
  const name = `${pkg.title} · ${pkg.duration}`;
  const photos = useListingPhotos("tour", tourPackagePhotoKey(tour, pkg), fallback, name);
  const enquiry = { id: `tour-package:${tour.slug}:${tourPackageSlug(pkg)}`, name: `${tour.label} — ${name}`, kind: "tour", url, path } as const;
  useListingPage(enquiry, "tour");
  const crumbs = [{ label: "Home", to: "/" }, { label: "Tours", to: "/tours" }, { label: tour.label, to: `/tours/${tour.slug}` }, { label: pkg.title, to: path }];
  const price = pkg.fromZAR != null ? `From ${format(pkg.fromZAR)}` : "On request";
  const unit = pkg.unit ?? "per person";
  const provider = { "@type": "Organization", name: "SVRM Group", url: `${SITE_URL}/` };

  return (
    <main className="bg-background text-foreground min-h-screen pb-24 lg:pb-0">
      <Seo
        title={`${pkg.title} | ${tour.label} — SVRM`}
        description={`${description} ${price} ${unit}. Enquire on WhatsApp.`.slice(0, 300)}
        path={path}
        image={photos[0]?.src}
        jsonLd={[
          breadcrumbSchema(crumbs),
          {
            "@context": "https://schema.org",
            "@type": ["TouristTrip", "Product"],
            name,
            description,
            image: photos.map((photo) => new URL(photo.src, SITE_URL).toString()),
            url,
            provider,
            touristType: "Luxury private travellers",
            offers: {
              "@type": "Offer",
              url,
              priceCurrency: "ZAR",
              ...(pkg.fromZAR != null ? { price: pkg.fromZAR } : {}),
              availability: "https://schema.org/PreOrder",
              description: `${price} ${unit}. Final quote confirmed for your dates.`,
              seller: provider,
            },
          },
        ]}
      />
      <Nav />
      <div className="container pt-28 md:pt-32">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-10">
            <header>
              <p className="eyebrow">{tour.label} · {pkg.duration}</p>
              <h1 className="font-serif text-4xl md:text-5xl mt-2">{pkg.title}</h1>
              <p className="mt-3 font-serif text-2xl text-gold">{price}</p>
              <p className="text-xs text-muted-foreground mt-1">{unit} · indicative guide; your written quote is final.</p>
            </header>
            <ListingGallery photos={photos} name={name} />
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {fallback.map((photo) => (
                <a key={photo.source} href={photo.source} target="_blank" rel="noopener noreferrer" className="hover:text-gold underline underline-offset-4">
                  Photo: {photo.artist} · {photo.license} ↗
                </a>
              ))}
            </div>
            <section aria-labelledby="package-description">
              <h2 id="package-description" className="font-serif text-2xl">About this package</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
            </section>
            <FactList facts={[
              ["Tour style", tour.label],
              ["Duration", pkg.duration],
              ["Price", `${price} ${unit}`],
              ["Service", "Privately arranged by SVRM Group"],
            ]} />
            <section aria-labelledby="included-heading">
              <h2 id="included-heading" className="font-serif text-2xl">What’s included</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {pkg.inclusions.map((item) => (
                  <li key={item} className="border border-border/50 bg-surface-raised p-4 text-sm text-foreground/85 flex gap-3">
                    <span className="text-gold" aria-hidden>·</span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="border border-primary/30 bg-surface-raised p-6">
              <h2 className="font-serif text-xl">Good to know</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Every itinerary is personalised. Availability, weather, seasonal operations and your final route can affect the experience and price; your concierge confirms the details before you book.</p>
            </section>
            <RelatedLinks links={[
              { label: `All ${tour.label} packages`, to: `/tours/${tour.slug}` },
              { label: "Build your own tour", to: "/tours/builder" },
              { label: "Private chauffeur service", to: "/chauffeur" },
            ]} />
          </div>
          <aside className="lg:sticky lg:top-28 self-start">
            <ListingEnquiry listing={enquiry} category="tour" />
            <Link to={`/tours/${tour.slug}`} className="mt-4 block text-center text-xs uppercase tracking-[0.2em] text-gold hover:underline underline-offset-4">Compare all packages</Link>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default TourPackageDetail;
