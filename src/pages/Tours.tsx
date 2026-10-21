import { whatsappUrlFor } from "@/lib/whatsappMessages";
import { Link } from "react-router-dom";
import SmartImage from "@/components/svrm/SmartImage";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import { tours } from "@/data/tours";
import { Wand2 } from "lucide-react";
import { Seo } from "@/components/Seo";
import heroVideo from "@/assets/videos/tours.mp4.asset.json";
import toursOg from "@/assets/svc-exp-safari.jpg";

const Tours = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title={"Private Cape Town Tours with a Chauffeur | SVRM Group"} description={"Private, chauffeured Cape Town tours — Cape Peninsula and Cape Point, Boulders Beach, Stellenbosch and Franschhoek wine estates, Hermanus and the Garden Route."} path="/tours" keywords="private Cape Town tours, luxury Cape Town tours, Cape of Good Hope private tour, Cape Winelands luxury tour, Stellenbosch private tour, Franschhoek private tour, Hermanus whale watching private tour, private sightseeing Cape Town, Cape Town tours with private driver, private tours Cape Town, luxury Cape Town day tour, best Cape Town tours, safari from Cape Town, Big 5 safari South Africa, Garden Route private tour, Cape Peninsula private tour, Cape Point tour, Table Mountain private tour, whale watching Hermanus, shark cage diving Gansbaai, penguins Boulders Beach, township cultural tour Cape Town, photography tour Cape Town, helicopter scenic Cape Town, family-friendly Cape Town tour, honeymoon tour South Africa, wellness retreat Western Cape, halal-friendly tour Cape Town, Arabic speaking guide Cape Town, Mandarin speaking guide, private guide Cape Town, bespoke Cape Town itinerary, Cape Town tours, day tours from Cape Town, private tour guide Cape Town, luxury safari South Africa, Big 5 safari day trip Cape Town, Aquila safari from Cape Town, Cape Winelands tour, Stellenbosch wine tasting tour, Franschhoek wine tram tour, Bo-Kaap cooking class Cape Town, Robben Island and city tour, Table Mountain and Kirstenbosch tour, Boulders Beach penguin tour, Cape Point day tour price, Hermanus whale watching tour, Gansbaai shark cage diving tour, Garden Route 5 day tour, private Cape Town city tour, half day Cape Town tour, luxury day tour with chauffeur Cape Town, couples private tour Cape Town, family day tour Cape Town, private tour for cruise passengers Cape Town" image={toursOg} jsonLd={[{ "@context": "https://schema.org", "@type": "Service", serviceType: "Private Tours", name: "SVRM Private Tours", provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" }, areaServed: [{ "@type": "City", name: "Cape Town" }, { "@type": "Country", name: "South Africa" }] }, { "@context": "https://schema.org", "@type": "ItemList", name: "SVRM private tours", itemListElement: tours.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.label, url: `https://svrm.group/tours/${t.slug}` })) }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://svrm.group/" }, { "@type": "ListItem", position: 2, name: "Tours", item: "https://svrm.group/tours" }] }]} />
    <Nav />
    <PageHero
      eyebrow="Tours · Private Guided Cape Town & South Africa"
      title="Private Guided Tours Cape Town"
      subtitle="Privately guided Cape Town tours — safari, Garden Route, marine & wildlife, cultural, aerial and wellness — assembled by theme and duration, or composed entirely around you."
      videoSrc={heroVideo.url}
    />

    <section className="pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm text-muted-foreground/90 leading-relaxed max-w-3xl mb-12 md:mb-16">
          The most-requested Cape Town tours we run: private <span className="text-foreground">safari</span> in
          the Big Five reserves, a <span className="text-foreground">helicopter tour</span> over the
          Twelve Apostles and Cape Point, a guided <span className="text-foreground">Table Mountain</span> day,
          and marine excursions to see whales, sharks and the Boulders Beach penguins. All private, all
          chauffeured, all booked through one number.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {tours.map((t) => (
          <Link
            key={t.slug}
            to={`/tours/${t.slug}`}
            className="group relative block overflow-hidden aspect-[4/3]"
          >
            <SmartImage
              src={t.image}
              alt={t.label}
              wrapperClassName="absolute inset-0 w-full h-full"
              className="absolute inset-0 w-full h-full object-cover kb-a"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="eyebrow">Tour</p>
              <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">{t.label}</h2>
              <p className="text-muted-foreground text-sm mt-3 max-w-sm">{t.blurb}</p>
              <span className="inline-block mt-5 text-xs uppercase tracking-[0.28em] text-gold border-b border-primary/40 pb-1 group-hover:border-primary transition-colors">
                See packages →
              </span>
            </div>
          </Link>
        ))}

        <Link
          to="/tours/builder"
          className="group relative block overflow-hidden aspect-[4/3] md:col-span-2 bg-surface-raised border border-primary/40"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <Wand2 className="h-10 w-10 text-gold" />
            <p className="eyebrow mt-6">Create your own</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 text-foreground">Build a bespoke tour.</h2>
            <p className="mt-4 text-muted-foreground max-w-xl">
              Choose your activities, duration and travellers — see an indicative range, then send the
              brief and we'll respond personally.
            </p>
            <span className="inline-block mt-6 text-xs uppercase tracking-[0.28em] text-gold border-b border-primary/40 pb-1 group-hover:border-primary transition-colors">
              Open the builder →
            </span>
          </div>
        </Link>
        </div>
      </div>
    </section>

    <section className="pb-20 md:pb-28 border-t border-border/40 pt-16">
      <div className="max-w-5xl mx-auto px-6">
        <p className="eyebrow">Why go private</p>
        <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">Private tours, on your own timetable.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {[
            ["Flexibility", "Start when you like, linger where you love and skip what you don't. Your chauffeur adjusts the day as you go."],
            ["Privacy", "Just your party in the vehicle — no shared coaches, no strangers, no fixed group stops."],
            ["Pickup anywhere", "Collection from your villa, hotel, cruise terminal or the airport across Cape Town and the Winelands."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-serif text-2xl text-foreground">{t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Popular private days include the Cape Peninsula via Chapman's Peak, Cape Point and the Boulders Beach
          penguins; wine estates in Stellenbosch and Franschhoek; whale season in Hermanus; and multi-day journeys
          along the Garden Route.
        </p>
        <a href={whatsappUrlFor("/tours")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-gold underline underline-offset-4">
          Plan a private tour on WhatsApp
        </a>
      </div>
    </section>

    <Footer />
  </main>
);

export default Tours;
