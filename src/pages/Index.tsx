import Nav from "@/components/svrm/Nav";

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
      title="SVRM Group | Luxury Chauffeur Service & Villa Rentals Cape Town"
      description="Private chauffeur service in Cape Town — Mercedes-Maybach, S-Class and V-Class with professional chauffeurs, airport transfers and private tours, plus luxury villa rentals on the Atlantic Seaboard."
      path="/"
      keywords="luxury chauffeur Cape Town, chauffeur service Cape Town, private chauffeur Cape Town, chauffeur hire Cape Town, Mercedes-Maybach S-Class Cape Town, Maybach chauffeur Cape Town, S-Class chauffeur, executive chauffeur Cape Town, chauffeur driven tours Cape Town, airport transfer Cape Town, airport transfers Cape Town, luxury villa rentals Cape Town, luxury villa rental Cape Town, villa rentals Camps Bay, Camps Bay villa rental, Clifton villa rental, Atlantic Seaboard villa rental, holiday villa Cape Town, private villa with pool Cape Town, 5 bedroom villa Camps Bay, luxury concierge Cape Town, VIP security Cape Town, executive protection Cape Town, luxury honeymoon Cape Town, luxury anniversary Cape Town, Cape Peninsula private tour, SVRM special offer, SVRM promotions, romantic packages Cape Town, honeymoon packages South Africa, proposal packages Cape Town, hot air balloon Winelands, safari packages Cape Town, Sabi Sand safari, SVRM, SVRM Group, lifestyle management South Africa, private tours Cape Town, armed close protection, armoured vehicles, private jet charter, helicopter charter, yacht charter, bespoke concierge, VIP services Cape Town, luxury services Cape Town, luxury travel company Cape Town, concierge company South Africa, chauffeur and villa packages Cape Town, luxury holiday Cape Town, VIP travel Cape Town, property management Cape Town, luxury car hire Cape Town, honeymoon and anniversary Cape Town, private tours and safari Cape Town, close protection Cape Town"

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
            name: "Mercedes-Maybach S-Class chauffeur — SVRM flagship",
            description:
              "SVRM's flagship chauffeur experience: Mercedes-Maybach S-Class with a private chauffeur in Cape Town, for executives, airport transfers, weddings and honeymoons.",
            price: "22000",
            priceCurrency: "ZAR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "22000",
              priceCurrency: "ZAR",
              unitCode: "DAY",
            },
            availability: "https://schema.org/InStock",
            url: "https://svrm.group/travel",
            seller: { "@type": "Organization", name: "SVRM Group" },
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
