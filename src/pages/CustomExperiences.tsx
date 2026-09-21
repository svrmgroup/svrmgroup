import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import customImg from "@/assets/svc-custom.jpg";
import { Seo } from "@/components/Seo";
import heroVideo from "@/assets/videos/experiences.mp4.asset.json";
import SmartImage from "@/components/svrm/SmartImage";

const cards = [
  { title: "Last-minute essentials", body: "Cleaners, private chefs, a tailor at the door, the gift you forgot." },
  { title: "Events & celebrations", body: "Birthdays, proposals, milestone dinners — composed end to end." },
  { title: "Shopping & sourcing", body: "Personal stylists, private boutique appointments, sourced rarities." },
  { title: "Auto customisations", body: "From plates and tints to full bespoke interior work." },
  { title: "Health & retreats", body: "Wellness programmes, private practitioners, recovery and reset." },
  { title: "Anything else", body: "If it can be arranged, we arrange it. Ask." },
];

const CustomExperiences = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title={"Bespoke Luxury Experiences Cape Town — SVRM Concierge"} description={"Bespoke concierge in Cape Town — private chefs, cleaners, events, proposals, sourcing and last-minute requests. If it can be arranged, SVRM arranges it."} path="/experiences" keywords="bespoke concierge Cape Town, private chef Cape Town, private events concierge, proposal planning Cape Town, personal shopper Cape Town, luxury sourcing South Africa, last-minute concierge, housekeeping Cape Town, lifestyle management bespoke, luxury concierge services Cape Town, private chef hire Cape Town, in-villa chef Cape Town, marriage proposal planner Cape Town, surprise proposal setup Cape Town, birthday planner Cape Town, private party planner Cape Town, corporate event concierge Cape Town, VIP restaurant reservations Cape Town, nightlife table booking Cape Town, personal shopper South Africa, luxury gift sourcing Cape Town, housekeeping and cleaning Cape Town villas, babysitting and childcare Cape Town, medical concierge Cape Town, translator and guide Cape Town, last minute luxury Cape Town, bespoke itinerary planner South Africa" jsonLd={[{ "@context": "https://schema.org", "@type": "Service", serviceType: "Bespoke Concierge", name: "Bespoke Concierge & Custom Experiences", provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" }, areaServed: [{ "@type": "City", name: "Cape Town" }, { "@type": "AdministrativeArea", name: "Western Cape" }, { "@type": "Country", name: "South Africa" }], hasOfferCatalog: { "@type": "OfferCatalog", name: "Bespoke Concierge & Custom Experiences", itemListElement: [{ "@type": "Offer", itemOffered: { "@type": "Service", name: "Private chef & in-villa dining" } }, { "@type": "Offer", itemOffered: { "@type": "Service", name: "Proposal & celebration planning" } }, { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private events & parties" } }, { "@type": "Offer", itemOffered: { "@type": "Service", name: "Personal shopping & luxury sourcing" } }, { "@type": "Offer", itemOffered: { "@type": "Service", name: "Housekeeping & villa staffing" } }, { "@type": "Offer", itemOffered: { "@type": "Service", name: "Last-minute concierge requests" } }] } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://svrm.group/" }, { "@type": "ListItem", position: 2, name: "Bespoke Concierge & Custom Experiences", item: "https://svrm.group/experiences" }] }]} />
    <Nav />
    <PageHero
      eyebrow="Custom Experiences · Bespoke Concierge in Cape Town"
      title="Custom Experiences & Bespoke Concierge in Cape Town"
      subtitle="Bespoke concierge for Cape Town and beyond — private chefs, events, sourcing, last-minute essentials and the requests that don't fit a category, for individuals and businesses alike."
      videoSrc={heroVideo.url}
    />

    <section className="py-20 md:py-28 bg-surface-deep">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground text-center mb-12">
          Bespoke lifestyle services, arranged for you
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={c.title} className="border border-border/40 bg-surface-raised p-8">
              <p className="eyebrow">0{i + 1}</p>
              <h3 className="font-serif text-2xl mt-4 text-foreground">{c.title}</h3>
              <div className="gold-divider w-10 my-5" />
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage src={customImg} alt="Bespoke arrangement" wrapperClassName="absolute inset-0 w-full h-full" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div>
          <p className="eyebrow">Enquire</p>
          <h2 className="font-serif text-3xl md:text-5xl mt-6 text-foreground leading-[1.1]">
            Tell us the request.
          </h2>
          <div className="gold-divider w-12 mt-8" />
          <p className="mt-8 text-muted-foreground leading-relaxed">
            Share what you need and the timeframe. A member of the concierge team will respond
            personally, within hours.
          </p>
          <div className="mt-10">
            <EnquiryForm subject="Custom experience" />
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default CustomExperiences;
