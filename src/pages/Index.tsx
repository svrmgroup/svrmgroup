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
      description="Private chauffeur service across Cape Town and the V&A Waterfront — Mercedes-Maybach, S-Class and V-Class with professional chauffeurs, airport transfers and private tours, plus luxury villa rentals on the Atlantic Seaboard."
      path="/"
      keywords="luxury chauffeur Cape Town, chauffeur service Cape Town, private chauffeur Cape Town, chauffeur hire Cape Town, V&A Waterfront chauffeur, V&A Waterfront transfer, Waterfront chauffeur Cape Town, Mercedes-Maybach S-Class Cape Town, Maybach chauffeur Cape Town, S-Class chauffeur, executive chauffeur Cape Town, chauffeur driven tours Cape Town, airport transfer Cape Town, airport transfers Cape Town, luxury villa rentals Cape Town, luxury villa rental Cape Town, villa rentals Camps Bay, Camps Bay villa rental, Clifton villa rental, Atlantic Seaboard villa rental, V&A Waterfront villa, V&A Waterfront apartment, V&A Waterfront accommodation, V&A Waterfront transfer, Waterfront Cape Town concierge, holiday villa Cape Town, private villa with pool Cape Town, 5 bedroom villa Camps Bay, luxury concierge Cape Town, VIP security Cape Town, executive protection Cape Town, luxury honeymoon Cape Town, luxury anniversary Cape Town, Cape Peninsula private tour, SVRM special offer, SVRM promotions, romantic packages Cape Town, honeymoon packages South Africa, proposal packages Cape Town, hot air balloon Winelands, safari packages Cape Town, Sabi Sand safari, SVRM, SVRM Group, lifestyle management South Africa, private tours Cape Town, armed close protection, armoured vehicles, private jet charter, helicopter charter, yacht charter, bespoke concierge, VIP services Cape Town, luxury services Cape Town, luxury travel company Cape Town, concierge company South Africa, chauffeur and villa packages Cape Town, luxury holiday Cape Town, VIP travel Cape Town, property management Cape Town, luxury car hire Cape Town, honeymoon and anniversary Cape Town, private tours and safari Cape Town, close protection Cape Town"

      jsonLd={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["Organization", "LocalBusiness"],
            "@id": "https://svrm.group/#organization",
            name: "SVRM Group",
            url: "https://svrm.group/",
            description:
              "Luxury chauffeur service and villa rentals across Cape Town and the V&A Waterfront — Mercedes-Maybach and S-Class chauffeur, airport transfers, private tours and Atlantic Seaboard villas.",
            telephone: "+27730641481",
            priceRange: "$$$$",
            currenciesAccepted: "ZAR, USD, EUR, GBP",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cape Town",
              addressRegion: "Western Cape",
              addressCountry: "ZA",
            },
            areaServed: [
              { "@type": "City", name: "Cape Town" },
              { "@type": "Place", name: "V&A Waterfront" },
              { "@type": "Place", name: "Camps Bay" },
              { "@type": "Place", name: "Clifton" },
              { "@type": "Place", name: "Atlantic Seaboard" },
              { "@type": "Place", name: "City Bowl" },
              { "@type": "Place", name: "Stellenbosch" },
              { "@type": "Place", name: "Franschhoek" },
              { "@type": "Country", name: "South Africa" },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
          {
            "@type": "Service",
            name: "Luxury chauffeur service in Cape Town",
            serviceType: "Chauffeur service",
            description:
              "Private chauffeur service in Cape Town with professional chauffeurs — Mercedes-Maybach S-Class, S-Class and V-Class for airport transfers, executive travel, weddings and private tours.",
            url: "https://svrm.group/chauffeur",
            provider: { "@id": "https://svrm.group/#organization" },
            areaServed: { "@type": "City", name: "Cape Town" },
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
            url: "https://svrm.group/chauffeur",
            seller: { "@id": "https://svrm.group/#organization" },
          },
          {
            "@type": "LodgingBusiness",
            name: "The Atlantic Villa, Camps Bay — SVRM Stays",
            description:
              "Signature five-bedroom, five-bathroom luxury villa in Camps Bay, Cape Town, with private pool and panoramic Atlantic views.",
            url: "https://svrm.group/stays",
            telephone: "+27730641481",
            priceRange: "ZAR 25000+",
            numberOfRooms: 5,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Camps Bay, Cape Town",
              addressRegion: "Western Cape",
              addressCountry: "ZA",
            },
            amenityFeature: [
              { "@type": "LocationFeatureSpecification", name: "Private pool", value: true },
              { "@type": "LocationFeatureSpecification", name: "Sea view", value: true },
            ],
          },
          {
            "@type": "Offer",
            name: "The Atlantic Villa, Camps Bay — luxury villa rental",
            description:
              "Five-bedroom, five-bathroom luxury villa rental in Camps Bay with private pool and panoramic Atlantic views, chauffeur and concierge available.",
            price: "25000",
            priceCurrency: "ZAR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "25000",
              priceCurrency: "ZAR",
              unitCode: "DAY",
            },
            availability: "https://schema.org/InStock",
            url: "https://svrm.group/stays",
            seller: { "@id": "https://svrm.group/#organization" },
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
            seller: { "@id": "https://svrm.group/#organization" },
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
