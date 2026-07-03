import Nav from "@/components/svrm/Nav";
import PromoBar from "@/components/svrm/PromoBar";
import Hero from "@/components/svrm/Hero";
import Intro from "@/components/svrm/Intro";
import Offers from "@/components/svrm/Offers";
import Services from "@/components/svrm/Services";
import Testimonials from "@/components/svrm/Testimonials";
import ClosingCTA from "@/components/svrm/ClosingCTA";
import Footer from "@/components/svrm/Footer";
import { Seo } from "@/components/Seo";

const Index = () => (
  <main className="bg-background text-foreground">
    <Seo
      title="SVRM | BMW X3 R2,000/day · Luxury Concierge & Chauffeur Cape Town"
      description="Special offer — BMW X3 self-drive from R2,000/day with free Cape Town delivery. SVRM is Cape Town's private lifestyle management group: chauffeur, private tours, romantic honeymoon packages, villas, car rental, armed security and bespoke concierge."
      path="/"
      keywords="BMW X3 rental Cape Town, BMW X3 R2000 per day, cheap BMW rental Cape Town, luxury SUV rental Cape Town, self-drive BMW Cape Town, SVRM special offer, SVRM promotions, romantic packages Cape Town, honeymoon packages South Africa, proposal packages Cape Town, hot air balloon Winelands, private chauffeur Cape Town, S-Class chauffeur, safari packages Cape Town, Sabi Sand safari, villa rentals Camps Bay, SVRM, SVRM Group, luxury concierge Cape Town, lifestyle management South Africa, airport transfer Cape Town, private tours Cape Town, luxury villa rental Cape Town, armed close protection, armoured vehicles, private jet charter, helicopter charter, yacht charter, bespoke concierge, VIP services Cape Town"
      jsonLd={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            name: "SVRM Group",
            url: "https://svrm.group/",
            areaServed: [
              { "@type": "City", name: "Cape Town" },
              { "@type": "Country", name: "South Africa" },
            ],
          },
          {
            "@type": "Offer",
            name: "BMW X3 self-drive special",
            description:
              "BMW X3 luxury compact SUV, self-drive rental with free delivery within Cape Town.",
            price: "2000",
            priceCurrency: "ZAR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "2000",
              priceCurrency: "ZAR",
              unitCode: "DAY",
            },
            availability: "https://schema.org/InStock",
            url: "https://svrm.group/rentals",
            seller: { "@type": "Organization", name: "SVRM Group" },
          },
          {
            "@type": "Offer",
            name: "Cape Honeymoon Signature — Romantic Package",
            description:
              "3-night Cape honeymoon: hot-air balloon over the Winelands, helicopter beach picnic, daily rose-petal turndowns and fresh bouquets.",
            price: "48000",
            priceCurrency: "ZAR",
            availability: "https://schema.org/InStock",
            url: "https://svrm.group/tours/romantic",
            seller: { "@type": "Organization", name: "SVRM Group" },
          },
        ],
      }}
    />
    <PromoBar />
    <Nav />
    <Hero />
    <Offers />
    <Intro />
    <Services />
    <Testimonials />
    <ClosingCTA />
    <Footer />
  </main>
);

export default Index;
