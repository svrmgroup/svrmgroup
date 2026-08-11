import { Seo } from "@/components/Seo";
import OccasionPage from "@/components/svrm/OccasionPage";
import heroImg from "@/assets/svc-stays-villa.jpg";

const Anniversary = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo
      title="Luxury Anniversary Cape Town | Bespoke Experiences — SVRM"
      description="A luxury anniversary experience in Cape Town, arranged by SVRM — Maybach chauffeur, private villa, yacht days, a Cape Peninsula tour and quietly handled romantic details."
      path="/anniversary-cape-town"
      keywords="luxury anniversary Cape Town, anniversary Cape Town, luxury anniversary experience Cape Town, luxury anniversary experiences South Africa, romantic anniversary Cape Town, anniversary concierge Cape Town"
      image={heroImg}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Luxury Anniversary Concierge",
        name: "Luxury Anniversary Experience in Cape Town",
        provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" },
        areaServed: [
          { "@type": "City", name: "Cape Town" },
          { "@type": "Country", name: "South Africa" },
        ],
        url: "https://svrm.group/anniversary-cape-town",
      }}
    />
    <OccasionPage
      eyebrow="Anniversary · Cape Town & South Africa"
      h1="Luxury anniversary experiences"
      intro="One night or one week — a bespoke anniversary in the Cape, arranged around the two of you and nothing else."
      heroImage={heroImg}
      heroAlt="Luxury anniversary experience in Cape Town arranged by SVRM Group"
      lede="Anniversaries are easy to get slightly wrong and very easy to get right with the correct hands on them. We take the brief — the year you're marking, what you loved last time, what you'd rather avoid — and build a day or a week around it. The Maybach at the door, a residence instead of a room, a table already held, and no logistics for either of you to carry."
      pillars={[
        {
          title: "Maybach chauffeur",
          body: "Our flagship Mercedes-Maybach S-Class with a chauffeur for the evening or the full stay — the simplest way to make an ordinary date feel deliberate.",
        },
        {
          title: "Luxury accommodation",
          body: "Private villas, penthouses and suites across the Atlantic seaboard and the Winelands, selected for privacy and view.",
        },
        {
          title: "Private Cape Peninsula day",
          body: "Chapman's Peak, Cape Point and Boulders Beach at your own pace, chauffeur-driven, with lunch reserved along the way.",
        },
        {
          title: "Yacht experience",
          body: "A crewed private charter from the V&A Waterfront — sunset along the Atlantic seaboard, catered to your brief.",
        },
        {
          title: "Romantic details",
          body: "Florist arrangements, petal turndowns, private-chef dinners, photographers and quiet surprise arrangements handled discreetly.",
        },
        {
          title: "Bespoke concierge",
          body: "Reservations, gifting, timing and every hand-off between them — one concierge, reachable throughout.",
        },
      ]}
      itineraryTitle="Ways clients mark the occasion"
      itinerary={[
        "An evening — Maybach chauffeur, a held table at a restaurant worth the drive, and flowers waiting when you return.",
        "A weekend — one night in a private villa, a couples spa afternoon, and a candlelit private-chef dinner.",
        "A Peninsula day — the full coastal route, unhurried, with a long lunch above the water.",
        "On the water — a private yacht sunset charter, champagne and canapés, crewed.",
        "A milestone week — Cape Town, the Winelands and a safari extension, sequenced end to end.",
      ]}
      links={[
        { to: "/travel?cat=cars", label: "Mercedes-Maybach S-Class" },
        { to: "/travel?cat=cars", label: "Chauffeur service" },
        { to: "/stays", label: "Villas & stays" },
        { to: "/tours/cape-peninsula", label: "Cape Peninsula tour" },
        { to: "/travel?cat=yachts", label: "Yacht charter" },
        { to: "/tours/romantic", label: "Romantic packages" },
        { to: "/experiences", label: "Build your own experience" },
        { to: "/honeymoon-cape-town", label: "Honeymoon experiences" },
      ]}
      enquirySubject="Luxury anniversary — Cape Town"
      enquiryDefault="We'd like to plan an anniversary in Cape Town. Our date is "
      whatsAppMessage="Hi SVRM — we'd like to plan a luxury anniversary experience in Cape Town."
      ctaLabel="Plan your anniversary"
    />
  </main>
);

export default Anniversary;
