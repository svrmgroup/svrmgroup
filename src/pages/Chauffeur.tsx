import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import RelatedLinks from "@/components/svrm/RelatedLinks";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import VehicleCard from "@/components/svrm/VehicleCard";
import KenBurnsImage from "@/components/svrm/KenBurnsImage";
import WhatsAppGlyph from "@/components/svrm/WhatsAppGlyph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/Seo";
import { useCurrency } from "@/lib/currency";
import { vehicles, vehicleTiers } from "@/data/vehicles";
import { chauffeurItinerary, SEVEN_DAY_DISCOUNT } from "@/data/chauffeurItinerary";
import { WHATSAPP_BASE } from "@/lib/whatsappMessages";
import AiItineraryPlanner from "@/components/svrm/AiItineraryPlanner";
import heroImage from "@/assets/svc-travel-sclass.jpg";

const tierBlurbs: Record<string, string> = {
  "Signature": "Rolls-Royce, Bentley, Maybach and Lamborghini — chauffeur-led, for the occasions that matter.",
  "Premium SUV": "Range Rover, AMG G63, Mercedes GLS and Porsche — space, presence and every road covered.",
  "Executive": "S-Class, 7 Series and V-Class lounge vans for transfers, roadshows and small parties.",
  "Everyday": "Smart, comfortable chauffeured cars for longer stays and everyday running.",
  "Budget": "Cost-conscious chauffeured options for extended stays and simple daily runs.",
  "Group Travel": "16-seater Sprinters, 22 & 32-seaters and full luxury coaches — chauffeur-driven, NDA-bound.",
};

const Chauffeur = () => {
  const { format } = useCurrency();
  const [pickSlug, setPickSlug] = useState("mercedes-maybach-s-class");
  const picked = vehicles.find((v) => v.slug === pickSlug) ?? vehicles[0];

  const sevenDay = picked.fromZAR * 7;
  const discount = Math.round(sevenDay * SEVEN_DAY_DISCOUNT);
  const total = sevenDay - discount;

  const waMessage = [
    "Hi SVRM Group, I'd like to enquire about the 7-day chauffeured Cape Town itinerary.",
    "",
    `Vehicle: ${picked.name}`,
    "Days: 7 (10% itinerary discount applied)",
  ].join("\n");
  const waHref = `${WHATSAPP_BASE}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title="Chauffeur Service Cape Town | Private Chauffeur Hire — SVRM"
        description="Private chauffeur hire in Cape Town: Maybach, S-Class, Range Rover and GLS with an NDA-bound chauffeur. Plus a 7-day chauffeured itinerary at 10% off any vehicle."
        path="/chauffeur"
        keywords="chauffeur service Cape Town, private chauffeur Cape Town, chauffeur hire Cape Town, luxury chauffeur South Africa, chauffeur driven car Cape Town, hire a driver Cape Town, personal driver Cape Town, English speaking driver Cape Town, VIP chauffeur Cape Town, executive chauffeur Cape Town, corporate chauffeur Cape Town, Maybach chauffeur Cape Town, Mercedes S-Class chauffeur Cape Town, Mercedes GLS chauffeur Cape Town, Mercedes V-Class chauffeur Cape Town, BMW 7 Series chauffeur, Rolls-Royce chauffeur Cape Town, Range Rover chauffeur Cape Town, wedding chauffeur Cape Town, matric dance chauffeur Cape Town, hourly chauffeur hire Cape Town, full day chauffeur Cape Town, multi day chauffeur Cape Town, weekly chauffeur hire Cape Town, 7 day Cape Town itinerary, 7 day chauffeured tour Cape Town, one week Cape Town itinerary with driver, private driver and guide Cape Town, Cape Town Winelands chauffeur, Stellenbosch wine tour with driver, Franschhoek wine tour chauffeur, Cape Peninsula chauffeur tour, Table Mountain private tour driver, Aquila safari transfer Cape Town, luxury airport transfer Cape Town, Cape Town airport chauffeur, close protection driver Cape Town, discreet chauffeur Cape Town, chauffeur for celebrities Cape Town, chauffeur rates Cape Town"
        image={heroImage}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Private Chauffeur Service",
            name: "SVRM Chauffeur Service Cape Town",
            provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" },
            areaServed: [
              { "@type": "City", name: "Cape Town" },
              { "@type": "AdministrativeArea", name: "Western Cape" },
              { "@type": "Country", name: "South Africa" },
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Chauffeur",
              itemListElement: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hourly & full-day chauffeur hire" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Airport transfers with chauffeur" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "7-day chauffeured Cape Town itinerary" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding & event chauffeur" } },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: "7-Day Chauffeured Cape Town Itinerary",
            description:
              "A seven-day chauffeur-driven Cape Town itinerary covering arrival and the Atlantic Seaboard, the Cape Peninsula, the Winelands, Table Mountain and Kirstenbosch, a leisure day, an Aquila Big Five safari and departure.",
            touristType: "Luxury travellers",
            provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" },
            itinerary: {
              "@type": "ItemList",
              itemListElement: chauffeurItinerary.map((d) => ({
                "@type": "ListItem",
                position: d.day,
                item: { "@type": "TouristAttraction", name: d.title, description: d.description },
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much does a chauffeur cost in Cape Town?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Chauffeured day rates depend on the vehicle, hours and route. Our 7-day itinerary applies a 10% discount to the vehicle total for any car in the fleet, and every brief is quoted before you commit.",
                },
              },
              {
                "@type": "Question",
                name: "Can I book one chauffeur for a whole week in Cape Town?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The same NDA-bound chauffeur stays with you for the length of your stay so they learn your preferences, timing and routes. Seven-day bookings receive a 10% discount on the vehicle total.",
                },
              },
              {
                "@type": "Question",
                name: "Does the 7-day itinerary include entrance fees and the safari?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The 10% discount applies to the chauffeured vehicle total. Entrance fees, tastings, restaurants and the Aquila Big Five safari are quoted separately on request as supplier rates vary by season.",
                },
              },
            ],
          },
        ]}
      />

      <Nav />
      <PageHero
        eyebrow="Chauffeur · Cape Town & Western Cape"
        title="Chauffeur Service in Cape Town"
        subtitle="A private, NDA-bound chauffeur and the vehicle of your choice — by the hour, the day, or across our signature 7-day Cape Town itinerary at 10% off the vehicle total."
        imageSrc={heroImage}
        imageAlt="Chauffeured Mercedes-Benz S-Class in Cape Town"
      />

      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-transparent justify-start gap-2 p-0 mb-10">
              <TabsTrigger
                value="itinerary"
                className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none"
              >
                7-Day Itinerary · 10% Off
              </TabsTrigger>
              <TabsTrigger
                value="fleet"
                className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none"
              >
                Chauffeur Fleet
              </TabsTrigger>
              <TabsTrigger
                value="planner"
                className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none"
              >
                Plan My Itinerary
              </TabsTrigger>
              <Link
                to="/airport-transfers"
                className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 rounded-none text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                Airport Transfers
              </Link>
            </TabsList>

            {/* ---------------- 7-day itinerary ---------------- */}
            <TabsContent value="itinerary" className="mt-0">
              <div className="mb-10 max-w-3xl">
                <p className="eyebrow">Signature Itinerary</p>
                <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">
                  Seven days of Cape Town, chauffeur-driven.
                </h2>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  One chauffeur, one vehicle and a week already mapped out — arrival, the Peninsula, the
                  Winelands, Table Mountain, a leisure day, a Big Five safari and a calm departure. Book all
                  seven days and we take <span className="text-gold">10% off the vehicle total</span>, whichever
                  car you choose.
                </p>
              </div>

              {/* Vehicle picker + price */}
              <div className="border border-gold/30 bg-surface-raised p-6 md:p-8 mb-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
                  <div>
                    <label
                      htmlFor="chauffeur-vehicle"
                      className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70"
                    >
                      Choose your vehicle
                    </label>
                    <select
                      id="chauffeur-vehicle"
                      value={pickSlug}
                      onChange={(e) => setPickSlug(e.target.value)}
                      className="input-luxury mt-2 w-full text-sm"
                    >
                      {vehicleTiers.map((tier) => (
                        <optgroup key={tier} label={tier}>
                          {vehicles
                            .filter((v) => v.tier === tier)
                            .map((v) => (
                              <option key={v.slug} value={v.slug}>
                                {v.name}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-3">
                      {picked.name} · {format(picked.fromZAR)} per day, chauffeured. Indicative guide — the
                      final quote is confirmed on enquiry.
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
                      7 days · vehicle total
                    </p>
                    <p className="text-sm text-muted-foreground line-through mt-2">{format(sevenDay)}</p>
                    <p className="font-serif text-4xl text-gold mt-1">{format(total)}</p>
                    <p className="text-xs text-gold/80 mt-2">
                      You save {format(discount)} (10% itinerary discount)
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.28em] text-black bg-[#25D366] px-6 py-4 hover:brightness-95 transition"
                  >
                    <WhatsAppGlyph className="h-4 w-4" />
                    Enquire on WhatsApp
                  </a>
                  <a
                    href="#chauffeur-enquiry"
                    className="inline-flex items-center justify-center text-xs uppercase tracking-[0.28em] text-gold border border-primary/60 px-6 py-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Send the brief
                  </a>
                </div>

                <p className="text-[11px] text-muted-foreground/70 mt-5 leading-relaxed">
                  The 10% discount applies to the chauffeured vehicle total across the seven days. Entrance
                  fees, tastings, restaurants, the Table Mountain cableway and the Aquila Big Five safari are
                  quoted separately — safari pricing is on request.
                </p>
              </div>

              {/* Days */}
              <div className="space-y-10 md:space-y-14">
                {chauffeurItinerary.map((d, i) => (
                  <article
                    key={d.day}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-border/40 pt-10"
                  >
                    <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                      <KenBurnsImage
                        src={d.image}
                        alt={`${d.eyebrow} — ${d.title}`}
                        className="aspect-[16/10]"
                        direction={(i % 4) as 0 | 1 | 2 | 3}
                      />
                    </div>
                    <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                      <p className="eyebrow">{d.eyebrow}</p>
                      <h3 className="font-serif text-2xl md:text-3xl mt-3 text-foreground">{d.title}</h3>
                      <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{d.description}</p>
                      <ul className="mt-5 space-y-2">
                        {d.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-3 text-sm text-foreground/90">
                            <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </TabsContent>

            {/* ---------------- AI planner ---------------- */}
            <TabsContent value="planner" className="mt-0">
              <AiItineraryPlanner />
            </TabsContent>

            {/* ---------------- Fleet ---------------- */}
            <TabsContent value="fleet" className="mt-0">
              <div className="mb-10 max-w-2xl">
                <p className="eyebrow">Chauffeur Fleet</p>
                <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">
                  Every car comes with a chauffeur.
                </h2>
                <p className="text-sm text-muted-foreground mt-4">
                  Rates are a guide — hours, route and add-ons decide the final quote.
                </p>
              </div>
              {vehicleTiers.map((tier) => {
                const list = vehicles.filter((v) => v.tier === tier);
                if (!list.length) return null;
                return (
                  <div key={tier} className="mb-16">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                      <h3 className="font-serif text-2xl md:text-3xl text-foreground">{tier}</h3>
                      <p className="text-sm text-muted-foreground max-w-md">{tierBlurbs[tier]}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {list.map((v, i) => (
                        <VehicleCard key={v.slug} vehicle={v} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="bg-surface-deep py-20 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-6">
          <p className="eyebrow">Frequently asked · Chauffeur hire Cape Town</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">Chauffeur questions.</h2>
          <div className="mt-10 divide-y divide-border/40 border-y border-border/40">
            {[
              {
                q: "How much does a chauffeur cost in Cape Town?",
                a: "It depends on the vehicle, the hours and the route. Day rates on this page are an indicative guide; the 7-day itinerary takes 10% off the vehicle total for any car in the fleet, and every brief is quoted in writing before you commit.",
              },
              {
                q: "Can I book one chauffeur for a whole week?",
                a: "Yes — that's the point of the 7-day itinerary. The same NDA-bound chauffeur stays with you for the week, so they learn your timing, preferences and the places you keep going back to.",
              },
              {
                q: "Can the 7-day itinerary be changed?",
                a: "Completely. Swap the safari for the Garden Route, add a yacht day, move the Winelands to a different day, or extend beyond seven days — the discount still applies to the vehicle total.",
              },
              {
                q: "Are entrance fees and the safari included?",
                a: "No — the discount is on the chauffeured vehicle. Cableway tickets, tastings, restaurants and the Aquila Big Five safari are quoted separately, with safari pricing on request.",
              },
            ].map((f) => (
              <div key={f.q} className="py-6">
                <p className="font-serif text-xl text-foreground">{f.q}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mt-3">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="chauffeur-enquiry" className="bg-background py-24 border-t border-border/40 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Enquire · Chauffeur</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-6 text-foreground">Send us the brief.</h2>
          </div>
          <EnquiryForm subject={`Chauffeur — 7-day itinerary (${picked.name})`} />
        </div>
      </section>

      <RelatedLinks
        links={[
          { to: "/travel?cat=cars", label: "Full chauffeured fleet" },
          { to: "/airport-transfers", label: "Luxury airport transfers" },
          { to: "/tours/cape-peninsula", label: "Cape Peninsula private tour" },
          { to: "/tours/aquila-safari", label: "Aquila Big Five safari" },
          { to: "/tours/culinary", label: "Winelands & culinary tours" },
          { to: "/security", label: "VIP security & close protection" },
          { to: "/stays", label: "Luxury villas & stays" },
        ]}
      />

      <Footer />
    </main>
  );
};

export default Chauffeur;
