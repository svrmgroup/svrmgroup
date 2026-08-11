import { Seo } from "@/components/Seo";
import OccasionPage from "@/components/svrm/OccasionPage";
import heroImg from "@/assets/tours/romantic.jpg";
import honeymoonHeroVideo from "@/assets/honeymoon-hero.mp4.asset.json";

const Honeymoon = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo
      title="Luxury Honeymoon Cape Town | Private Concierge — SVRM"
      description="A luxury honeymoon in Cape Town arranged end to end by SVRM — private chauffeur, villa stays, romantic experiences, yacht days and the Cape Peninsula. Discreet, bespoke, handled."
      path="/honeymoon-cape-town"
      keywords="luxury honeymoon Cape Town, honeymoon Cape Town, luxury honeymoon South Africa, romantic experiences Cape Town, honeymoon concierge Cape Town, private honeymoon planner South Africa"
      image={heroImg}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Luxury Honeymoon Concierge",
        name: "Luxury Honeymoon in Cape Town",
        provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" },
        areaServed: [
          { "@type": "City", name: "Cape Town" },
          { "@type": "Country", name: "South Africa" },
        ],
        url: "https://svrm.group/honeymoon-cape-town",
      }}
    />
    <OccasionPage
      eyebrow="Honeymoon · Cape Town & South Africa"
      h1="Luxury honeymoon in Cape Town"
      intro="A honeymoon shaped around the two of you — private chauffeur, a villa with the right view, and the Cape at the pace you want it."
      heroImage={heroImg}
      heroVideo={honeymoonHeroVideo.url}
      heroAlt="Luxury honeymoon in Cape Town arranged by SVRM Group"
      lede="Most couples arrive with three fixed points and a lot of empty space between them. We fill that space properly: a chauffeur who already knows your week, a private residence rather than a hotel corridor, a sunset the guidebooks don't send people to. Nothing is booked without your sign-off, and one concierge stays with you from the first message to the last transfer."
      pillars={[
        {
          title: "Private chauffeur",
          body: "A dedicated chauffeur for your stay — including our flagship Mercedes-Maybach S-Class — so neither of you ever thinks about a car, a route or an airport queue.",
        },
        {
          title: "Private accommodation",
          body: "Villas, penthouses and residences across Camps Bay, Clifton, Llandudno and the Atlantic seaboard, chosen for privacy and view rather than star rating.",
        },
        {
          title: "Romantic experiences",
          body: "Rose-petal turndowns, florist-fresh bouquets, sunrise hot-air balloon flights over the Winelands, helicopter beach picnics and candlelit private-chef dinners.",
        },
        {
          title: "Private tours",
          body: "The Cape Peninsula in a single unhurried day, Winelands estates, or a safari extension — always chauffeur-driven, never a shared coach.",
        },
        {
          title: "Yacht days",
          body: "Private charter from the V&A Waterfront for a champagne sunset along the Atlantic seaboard, crewed and catered.",
        },
        {
          title: "Dining & bespoke concierge",
          body: "Reservations where they matter, a private chef where they don't, and a 24/7 concierge for everything in between.",
        },
      ]}
      itineraryTitle="A honeymoon week, as we usually build it"
      itinerary={[
        "Arrival — meet-and-greet at Cape Town International, chauffeured transfer to your villa, flowers and turndown already in place.",
        "Cape Peninsula — a full private day through Camps Bay, Chapman's Peak, Cape Point and Boulders Beach.",
        "Winelands — estate tastings and a long lunch, chauffeured both ways.",
        "At sea — a private yacht sunset from the Waterfront, or a helicopter picnic on a secluded beach.",
        "Quiet days — spa, beach and a private-chef dinner at the villa with nothing scheduled around it.",
        "Extension — a safari, the Garden Route, or a few nights somewhere we'll recommend once we know you.",
      ]}
      links={[
        { to: "/travel?cat=cars", label: "Chauffeur service" },
        { to: "/travel?cat=cars", label: "Mercedes-Maybach S-Class" },
        { to: "/stays", label: "Villas & stays" },
        { to: "/tours/cape-peninsula", label: "Cape Peninsula tour" },
        { to: "/tours/romantic", label: "Romantic packages" },
        { to: "/travel?cat=yachts", label: "Yacht charter" },
        { to: "/experiences", label: "Build your own experience" },
        { to: "/anniversary-cape-town", label: "Anniversary experiences" },
      ]}
      enquirySubject="Luxury honeymoon — Cape Town"
      enquiryDefault="We're planning our honeymoon in Cape Town. Our dates are "
      whatsAppMessage="Hi SVRM — we'd like to plan a luxury honeymoon in Cape Town."
      ctaLabel="Plan your honeymoon"
    />
  </main>
);

export default Honeymoon;
