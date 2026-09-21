import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import TourBuilder from "@/components/svrm/TourBuilder";
import { Seo } from "@/components/Seo";

const TourBuilderPage = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title={"Build a Custom Cape Town Tour | Bespoke Itinerary — SVRM"} description={"Design a bespoke Cape Town or South African tour — pick activities, duration and travellers, see an indicative range, and SVRM quotes against your exact brief."} path="/tours/builder" keywords="custom Cape Town tour, bespoke itinerary South Africa, tour builder, private tour planner Cape Town, design my safari, tailor-made Garden Route trip, build my own Cape Town tour, custom safari itinerary South Africa, private itinerary planner Cape Town, multi day Cape Town itinerary, tailor made South Africa holiday, plan a trip to Cape Town with a guide, custom Garden Route itinerary, group itinerary Cape Town" jsonLd={[{ "@context": "https://schema.org", "@type": "Service", serviceType: "Tour Planning", name: "Custom Tour Planning", provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" }, areaServed: [{ "@type": "City", name: "Cape Town" }, { "@type": "AdministrativeArea", name: "Western Cape" }, { "@type": "Country", name: "South Africa" }], hasOfferCatalog: { "@type": "OfferCatalog", name: "Custom Tour Planning", itemListElement: [{ "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Cape Town day itineraries" } }, { "@type": "Offer", itemOffered: { "@type": "Service", name: "Multi-day private tours" } }, { "@type": "Offer", itemOffered: { "@type": "Service", name: "Safari & Garden Route planning" } }, { "@type": "Offer", itemOffered: { "@type": "Service", name: "Group & family itineraries" } }] } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://svrm.group/" }, { "@type": "ListItem", position: 2, name: "Custom Tour Planning", item: "https://svrm.group/tours/builder" }] }]} />
    <Nav />
    <PageHero
      eyebrow="Create your own"
      title="Build your tour."
      subtitle="Choose what matters. We'll quietly arrange the rest — and quote you against the exact brief."
    />
    <section className="pb-28 md:pb-40">
      <div className="max-w-7xl mx-auto px-6">
        <TourBuilder />
      </div>
    </section>
    <Footer />
  </main>
);

export default TourBuilderPage;
