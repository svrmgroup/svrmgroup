import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import RelatedLinks from "@/components/svrm/RelatedLinks";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import VehicleCard from "@/components/svrm/VehicleCard";
import MaybachFlagship, { MAYBACH_SLUG } from "@/components/svrm/MaybachFlagship";
import CategoryCard from "@/components/svrm/CategoryCard";
import KenBurnsImage from "@/components/svrm/KenBurnsImage";
import WhatsAppGlyph from "@/components/svrm/WhatsAppGlyph";
import AiItineraryPlanner from "@/components/svrm/AiItineraryPlanner";
import { vehicles, vehicleTiers } from "@/data/vehicles";
import { jets, helicopters } from "@/data/aviation";
import { yachts } from "@/data/yachts";
import { chauffeurItinerary, SEVEN_DAY_DISCOUNT } from "@/data/chauffeurItinerary";
import { useCurrency } from "@/lib/currency";
import { WHATSAPP_BASE } from "@/lib/whatsappMessages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/Seo";
import heroVideo from "@/assets/videos/travel.mp4.asset.json";
import travelOg from "@/assets/svc-travel-fleet.jpg";

const tierBlurbs: Record<string, string> = {
  "Signature": "The top of the SVRM fleet — Rolls-Royce, Bentley, Lamborghini. Chauffeur-led.",
  "Premium SUV": "Off-the-grid capability without compromise. Range Rover, AMG G-Class, Porsche, BMW.",
  "Executive": "Discreet sedans and lounge vans for transfers, meetings and small parties.",
  "Everyday": "Smart everyday vehicles for longer stays — budget-friendly, fully insured.",
  "Budget": "Reliable, lower-cost daily drivers for extended self-drive stays.",
  "Group Travel": "16-seater Sprinters, 22 & 32-seater buses and full luxury coaches — chauffeur-driven, NDA-bound.",
};

type Mode = "cars" | "jets" | "helicopters" | "yachts" | "itinerary" | "planner";

const Travel = () => {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<Mode>("cars");
  const [carTier, setCarTier] = useState<string>("All");
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

  useEffect(() => {
    const cat = params.get("cat");
    if (cat && (["cars","jets","helicopters","yachts","itinerary","planner"] as const).includes(cat as Mode)) {
      setMode(cat as Mode);
    }
  }, [params]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Chauffeur Service Cape Town | Private Chauffeur & Fleet — SVRM"}
        description={"Private chauffeur hire across Cape Town — V&A Waterfront, Camps Bay, Clifton, Bantry Bay, Sea Point, Atlantic Seaboard, City Bowl, Stellenbosch, Franschhoek: Maybach, S-Class, Range Rover and GLS with an NDA-bound chauffeur, plus jets, helicopters, yachts and a 7-day chauffeured itinerary at 10% off."}
        path="/chauffeur"
        keywords="chauffeur service Cape Town, private chauffeur Cape Town, chauffeur hire Cape Town, V&A Waterfront chauffeur, Waterfront private chauffeur Cape Town, V&A Waterfront transfer, luxury chauffeur Cape Town, luxury chauffeur South Africa, chauffeur driven car Cape Town, hire a driver Cape Town, personal driver Cape Town, English speaking driver Cape Town, VIP chauffeur Cape Town, executive chauffeur Cape Town, corporate chauffeur Cape Town, Maybach chauffeur Cape Town, Mercedes-Maybach chauffeur Cape Town, Maybach S-Class Cape Town, Mercedes S-Class chauffeur Cape Town, S Class chauffeur Cape Town, Mercedes GLS hire Cape Town, Mercedes-Benz GLS chauffeur Cape Town, GLS with driver Cape Town, luxury 7 seater SUV chauffeur, premium SUV transfer Cape Town, Mercedes V-Class chauffeur Cape Town, BMW 7 Series with driver, Rolls-Royce chauffeur Cape Town, Rolls-Royce Phantom chauffeur, Range Rover chauffeur Cape Town, wedding chauffeur Cape Town, matric dance chauffeur Cape Town, hourly chauffeur hire Cape Town, full day chauffeur Cape Town, multi day chauffeur Cape Town, weekly chauffeur hire Cape Town, 7 day Cape Town itinerary, 7 day chauffeured tour Cape Town, one week Cape Town itinerary with driver, private driver and guide Cape Town, Cape Town Winelands chauffeur, Stellenbosch wine tour with driver, Franschhoek wine tour chauffeur, Cape Peninsula chauffeur tour, Table Mountain private tour driver, Aquila safari transfer Cape Town, luxury airport transfer Cape Town, Cape Town airport chauffeur, close protection driver Cape Town, discreet chauffeur Cape Town, chauffeur for celebrities Cape Town, chauffeur rates Cape Town, private jet charter Cape Town, empty leg jet Cape Town, helicopter transfer Cape Town, scenic helicopter flight Cape Town, superyacht charter Cape Town, yacht hire V&A Waterfront, luxury car fleet Cape Town, executive transfers South Africa, corporate roadshow transport, group transfers Sprinter, luxury Winelands day trip, chauffeur Cape Town price per day, book a chauffeur Cape Town, chauffeur service near me Cape Town, luxury transfer Winelands, airport chauffeur Camps Bay, chauffeur for wedding Cape Town price"
        image={travelOg}
        jsonLd={[{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Private Chauffeur Service",
          name: "SVRM Chauffeur Service Cape Town",
          provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" },
          areaServed: [{ "@type": "City", name: "Cape Town" }, { "@type": "Place", name: "V&A Waterfront" }, { "@type": "AdministrativeArea", name: "Western Cape" }, { "@type": "Country", name: "South Africa" }],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Chauffeur & Travel",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hourly & full-day chauffeur hire" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Airport transfers with chauffeur" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "7-day chauffeured Cape Town itinerary" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding & event chauffeur" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private jet charter" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Helicopter transfers & scenic flights" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Yacht & superyacht charter" } },
            ],
          },
        }, {
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
        }, {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How much does a chauffeur cost in Cape Town?",
              acceptedAnswer: { "@type": "Answer", text: "Chauffeured day rates depend on the vehicle, hours and route. Our 7-day itinerary applies a 10% discount to the vehicle total for any car in the fleet, and every brief is quoted before you commit." },
            },
            {
              "@type": "Question",
              name: "Do you do Cape Town airport transfers?",
              acceptedAnswer: { "@type": "Answer", text: "Yes — Cape Town International (CPT) to any address in the city, Winelands or the Atlantic seaboard. Meet-and-greet inside the terminal, luggage handled, child seats on request." },
            },
            {
              "@type": "Question",
              name: "Can I book one chauffeur for a whole week in Cape Town?",
              acceptedAnswer: { "@type": "Answer", text: "Yes. The same NDA-bound chauffeur stays with you for the length of your stay so they learn your preferences, timing and routes. Seven-day bookings receive a 10% discount on the vehicle total." },
            },
            {
              "@type": "Question",
              name: "Can you arrange private jets, helicopters and yachts too?",
              acceptedAnswer: { "@type": "Answer", text: "Yes — jets, helicopter transfers and superyacht charters are sourced through vetted operators, fully crewed and briefed, all under the same concierge." },
            },
            {
              "@type": "Question",
              name: "What is the hourly rate for a chauffeur in Cape Town?",
              acceptedAnswer: { "@type": "Answer", text: "Hourly chauffeur hire is available with a minimum booking, and the rate depends on the vehicle — Mercedes V-Class, S-Class, GLS, Range Rover or the Mercedes-Maybach S-Class. Send your hours and route and we quote in writing before you commit." },
            },
            {
              "@type": "Question",
              name: "Which areas of Cape Town do your chauffeurs cover?",
              acceptedAnswer: { "@type": "Answer", text: "All of Cape Town — the V&A Waterfront, Camps Bay, Clifton, Bantry Bay, Sea Point, the Atlantic Seaboard, City Bowl, Constantia, Hout Bay and Bishopscourt — plus the Winelands at Stellenbosch, Franschhoek and Paarl, the Cape Peninsula and the Garden Route." },
            },
            {
              "@type": "Question",
              name: "Do you provide English-speaking chauffeurs for international guests?",
              acceptedAnswer: { "@type": "Answer", text: "Yes. Every SVRM chauffeur is English-speaking, professionally trained, NDA-bound and briefed on your itinerary before arrival, with local knowledge of restaurants, wine estates and routes." },
            },
            {
              "@type": "Question",
              name: "Can I book a chauffeur for a wedding or corporate event in Cape Town?",
              acceptedAnswer: { "@type": "Answer", text: "Yes — wedding cars, matric dances, corporate roadshows, conference and delegation transfers, and multi-vehicle convoys with a single point of contact and a written schedule per vehicle." },
            },
            {
              "@type": "Question",
              name: "Can a chauffeur drive us to the Winelands for a wine tour?",
              acceptedAnswer: { "@type": "Answer", text: "Yes — full-day chauffeured wine tours to Stellenbosch, Franschhoek and Constantia, with tastings booked ahead and no one in your party needing to drive." },
            },
          ],
        }, {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://svrm.group/" },
            { "@type": "ListItem", position: 2, name: "Chauffeur Service Cape Town", item: "https://svrm.group/chauffeur" },
          ],
        }]}
      />

      <Nav />
      <PageHero
        eyebrow="Chauffeur & Fleet · Cape Town, Jets, Helicopters & Yachts"
        title="Chauffeur Service in Cape Town"
        subtitle="A private, NDA-bound chauffeur and the vehicle of your choice across Cape Town — V&A Waterfront, Camps Bay, Clifton, Bantry Bay, Sea Point, Atlantic Seaboard, City Bowl, Stellenbosch and Franschhoek — by the hour, the day, or across our signature 7-day itinerary at 10% off. Jets, helicopters and yachts under the same concierge."
        videoSrc={heroVideo.url}
      />

      <section className="pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-transparent justify-start gap-2 p-0 mb-10">
              {(["cars", "jets", "helicopters", "yachts"] as Mode[]).map((m) => (
                <TabsTrigger
                  key={m}
                  value={m}
                  className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none"
                >
                  {m === "cars" ? "Cars" : m === "jets" ? "Private Jets" : m === "helicopters" ? "Helicopters" : "Yachts"}
                </TabsTrigger>
              ))}
              <Link
                to="/airport-transfers"
                className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 rounded-none text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                Airport Transfers
              </Link>
              <TabsTrigger
                value="itinerary"
                className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-gold/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none text-gold"
              >
                7-Day Itinerary · 10% Off
              </TabsTrigger>
              <TabsTrigger
                value="planner"
                className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none"
              >
                Plan My Itinerary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars" className="mt-0">
              <MaybachFlagship />
              <p className="text-xs text-muted-foreground/80 tracking-wide max-w-2xl mb-6">
                Every chauffeured rate is quoted on request once we know route, hours and add-ons.
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {(["All", ...vehicleTiers] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCarTier(t)}
                    className={`text-[11px] uppercase tracking-[0.24em] px-4 py-2 border rounded-none transition-colors ${
                      carTier === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {(carTier === "All" ? vehicleTiers : [carTier as typeof vehicleTiers[number]]).map((tier) => {
                const list = vehicles.filter((v) => v.tier === tier && v.slug !== MAYBACH_SLUG);
                if (list.length === 0) return null;
                return (
                  <div key={tier} className="mb-16 md:mb-20">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                      <div>
                        <p className="eyebrow">{tier}</p>
                        <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">{tier}</h2>
                      </div>
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

            <TabsContent value="jets" className="mt-0">
              <div className="mb-10">
                <p className="eyebrow">Private Jets</p>
                <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">Jets, sourced on demand.</h2>
                <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
                  Light, midsize and heavy jets through trusted operators. Every charter quoted on request.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {jets.map((j, i) => (
                  <CategoryCard key={j.slug} eyebrow="Private Jet" name={j.name} tagline={j.tagline} meta={j.capacity} image={j.image} index={i} enquirySubject={`Private jet — ${j.name}`} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="helicopters" className="mt-0">
              <div className="mb-10">
                <p className="eyebrow">Helicopters</p>
                <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">Heli transfers & scenic flips.</h2>
                <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
                  Robinson, AS350, EC130 — from a 20-minute scenic flip over the Twelve Apostles to a Winelands transfer.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {helicopters.map((h, i) => (
                  <CategoryCard key={h.slug} eyebrow="Helicopter" name={h.name} tagline={h.tagline} meta={h.capacity} image={h.image} index={i} enquirySubject={`Helicopter — ${h.name}`} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="yachts" className="mt-0">
              <div className="mb-10">
                <p className="eyebrow">Yachts</p>
                <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">Day & overnight charter.</h2>
                <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
                  Sailing, motor and superyacht charters out of the V&A Waterfront — crewed, catered and curated.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {yachts.map((y, i) => (
                  <CategoryCard key={y.slug} eyebrow="Yacht" name={y.name} tagline={y.tagline} meta={y.capacity} image={y.image} index={i} enquirySubject={`Yacht charter — ${y.name}`} />
                ))}
              </div>
            </TabsContent>

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
          </Tabs>
        </div>
      </section>

      <section className="bg-surface-deep py-20 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="eyebrow">Chauffeur</p>
            <h2 className="font-serif text-3xl mt-4 text-foreground">English-speaking, NDA-bound.</h2>
            <p className="text-muted-foreground mt-4">
              Hourly hire, airport transfers and inter-city journeys with a discreet chauffeur on call
              for the length of your stay.
            </p>
          </div>
          <div>
            <p className="eyebrow">Crew</p>
            <h2 className="font-serif text-3xl mt-4 text-foreground">Pilots, captains, hosts.</h2>
            <p className="text-muted-foreground mt-4">
              Jets, helicopters and yachts are sourced through vetted operators — fully crewed, fully
              compliant, fully briefed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-24 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-6">
          <p className="eyebrow">Chauffeur hire · Cape Town</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">
            Private chauffeur service across Cape Town.
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mt-5 max-w-3xl">
            SVRM Group is a luxury chauffeur company in Cape Town offering chauffeur-driven cars by the
            hour, the day, the week or the length of your stay. Our fleet runs from the Mercedes-Maybach
            S-Class and Mercedes S-Class to the GLS, V-Class and Range Rover, each with a professionally
            trained, English-speaking, NDA-bound chauffeur who knows the city — airport transfers from Cape
            Town International, executive and corporate transfers, wedding cars, private Cape Peninsula and
            Table Mountain tours, and chauffeured wine tours through Stellenbosch and Franschhoek.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            <div>
              <h3 className="font-serif text-2xl text-foreground">Areas we chauffeur</h3>
              <ul className="mt-5 space-y-2 text-sm text-foreground/90">
                {[
                  "V&A Waterfront & City Bowl",
                  "Camps Bay, Clifton, Bantry Bay & Sea Point",
                  "Atlantic Seaboard & Hout Bay",
                  "Constantia, Bishopscourt & Southern Suburbs",
                  "Cape Town International Airport (CPT)",
                  "Stellenbosch, Franschhoek & Paarl Winelands",
                  "Cape Peninsula, Cape Point & Simon's Town",
                  "Hermanus, Garden Route & inter-city journeys",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-foreground">What guests book us for</h3>
              <ul className="mt-5 space-y-2 text-sm text-foreground/90">
                {[
                  "Luxury airport transfers with meet-and-greet",
                  "Hourly, full-day & multi-day chauffeur hire",
                  "Executive, corporate & roadshow transfers",
                  "Wedding, anniversary & matric dance cars",
                  "Private guided tours with a driver-guide",
                  "Chauffeured Winelands wine tours",
                  "Discreet VIP & close-protection driving",
                  "Yacht, helicopter & private jet transfers",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mt-10 max-w-3xl">
            Prefer a single vehicle and chauffeur for your whole stay? Our{" "}
            <a href="#itinerary-top" className="text-gold underline-offset-4 hover:underline">
              seven-day chauffeured Cape Town itinerary
            </a>{" "}
            takes 10% off the vehicle total, and pairs naturally with our{" "}
            <Link to="/airport-transfers" className="text-gold underline-offset-4 hover:underline">
              airport transfers
            </Link>
            ,{" "}
            <Link to="/tours" className="text-gold underline-offset-4 hover:underline">
              private tours
            </Link>{" "}
            and{" "}
            <Link to="/stays" className="text-gold underline-offset-4 hover:underline">
              luxury villas in Camps Bay and the Atlantic Seaboard
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-background py-20 md:py-24 border-t border-border/40">
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
                q: "Do you do Cape Town airport transfers?",
                a: "Yes — Cape Town International (CPT) to any address in the city, Winelands or the Atlantic seaboard. Meet-and-greet inside the terminal, luggage handled, child seats on request. Booked as a single transfer or as part of a full-stay chauffeur arrangement.",
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
              {
                q: "Can you arrange private jets, helicopters and yachts too?",
                a: "Yes — everything on this page sits under one concierge. Jets, helicopter transfers and superyacht charters are sourced through vetted operators, fully crewed and fully briefed.",
              },
              {
                q: "What is the hourly rate for a chauffeur in Cape Town?",
                a: "Hourly hire is available with a minimum booking and the rate follows the vehicle — V-Class, S-Class, GLS, Range Rover or the Mercedes-Maybach S-Class. Send us your hours and route and you get a written quote before anything is confirmed.",
              },
              {
                q: "Which areas of Cape Town do you cover?",
                a: "All of Cape Town — V&A Waterfront, Camps Bay, Clifton, Bantry Bay, Sea Point, the Atlantic Seaboard, City Bowl, Constantia and Hout Bay — plus Stellenbosch, Franschhoek and Paarl in the Winelands, the Cape Peninsula, Hermanus and the Garden Route.",
              },
              {
                q: "Are your chauffeurs English-speaking?",
                a: "Yes. Every chauffeur is English-speaking, professionally trained, NDA-bound and briefed on your itinerary before you land, with real local knowledge of restaurants, estates and routes.",
              },
              {
                q: "Can I book a chauffeur for a wedding or corporate event?",
                a: "Yes — wedding cars, matric dances, corporate roadshows, conference and delegation transfers, and multi-vehicle convoys with one point of contact and a written schedule per vehicle.",
              },
              {
                q: "Can a chauffeur take us on a Winelands wine tour?",
                a: "Yes — full-day chauffeured wine tours through Stellenbosch, Franschhoek and Constantia, with tastings arranged ahead and nobody in your party needing to drive.",
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

      <section id="chauffeur-enquiry" className="bg-background py-24 md:py-32 border-t border-border/40 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Enquire · Chauffeur & Fleet</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-6 text-foreground">Send us the brief.</h2>
          </div>
          <EnquiryForm subject={`Chauffeur & fleet — ${picked.name}`} />
        </div>
      </section>

      <RelatedLinks
        links={[
          { to: "/airport-transfers", label: "Luxury airport transfers" },
          { to: "/tours/cape-peninsula", label: "Cape Peninsula private tour" },
          { to: "/tours/aquila-safari", label: "Aquila Big Five safari" },
          { to: "/rentals", label: "Luxury car rental" },
          { to: "/security", label: "VIP security" },
          { to: "/honeymoon-cape-town", label: "Honeymoon experiences" },
          { to: "/anniversary-cape-town", label: "Anniversary experiences" },
          { to: "/stays", label: "Luxury villas & stays" },
        ]}
      />

      <Footer />
    </main>
  );
};

export default Travel;
