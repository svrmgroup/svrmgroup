import { useState } from "react";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import VehicleCard from "@/components/svrm/VehicleCard";
import CategoryCard from "@/components/svrm/CategoryCard";
import { vehicles, vehicleTiers } from "@/data/vehicles";
import { jets, helicopters } from "@/data/aviation";
import { yachts } from "@/data/yachts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/Seo";
import heroVideo from "@/assets/videos/travel.mp4.asset.json";

const tierBlurbs: Record<string, string> = {
  "Signature": "The top of the SVRM fleet — Rolls-Royce, Bentley, Lamborghini. Chauffeur-led.",
  "Premium SUV": "Off-the-grid capability without compromise. Range Rover, AMG G-Class, Porsche, BMW.",
  "Executive": "Discreet sedans and lounge vans for transfers, meetings and small parties.",
  "Everyday": "Smart everyday vehicles for longer stays — budget-friendly, fully insured.",
  "Budget": "Reliable, lower-cost daily drivers for extended self-drive stays.",
  "Group Travel": "16-seater Sprinters, 22 & 32-seater buses and full luxury coaches — chauffeur-driven, NDA-bound.",
};

type Mode = "cars" | "jets" | "helicopters" | "yachts";

const Travel = () => {
  const [mode, setMode] = useState<Mode>("cars");
  const [carTier, setCarTier] = useState<string>("All");

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Luxury Chauffeur Service Cape Town | Private Transfers — SVRM"}
        description={"Private chauffeur-driven cars, private jets, helicopters and luxury yacht charter across Cape Town and South Africa. Discreet, NDA-bound, quoted on request."}
        path="/travel"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Do you do Cape Town airport transfers?",
              acceptedAnswer: { "@type": "Answer", text: "Yes — Cape Town International (CPT) to any address in the city, Winelands or the Atlantic seaboard. Meet-and-greet inside the terminal, luggage handled, child seats on request." },
            },
            {
              "@type": "Question",
              name: "What's the difference between a chauffeur and a private driver in Cape Town?",
              acceptedAnswer: { "@type": "Answer", text: "SVRM chauffeurs are professional drivers in suit, NDA-bound, with English fluency and local knowledge. We place the same chauffeur with you for the length of your stay so they learn your preferences." },
            },
            {
              "@type": "Question",
              name: "Can I book a chauffeured car by the hour or just for the day?",
              acceptedAnswer: { "@type": "Answer", text: "Both. Half-day (4 hours), full-day (8 hours) and multi-day arrangements are standard. Single transfers are also quoted on request." },
            },
          ],
        }}
      />

      <Nav />
      <PageHero
        eyebrow="Travel · Cape Town Chauffeur, Jets, Helicopters & Yachts"
        title="Arrive without thinking about it."
        subtitle="Private chauffeur-driven cars across Cape Town and the Western Cape, plus private jets, helicopters and luxury yacht charter — switch the category and send the brief."
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
            </TabsList>

            <TabsContent value="cars" className="mt-0">
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
                const list = vehicles.filter((v) => v.tier === tier);
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
          </Tabs>
        </div>
      </section>

      <section className="bg-surface-deep py-20 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="eyebrow">Chauffeur</p>
            <h3 className="font-serif text-3xl mt-4 text-foreground">English-speaking, NDA-bound.</h3>
            <p className="text-muted-foreground mt-4">
              Hourly hire, airport transfers and inter-city journeys with a discreet chauffeur on call
              for the length of your stay.
            </p>
          </div>
          <div>
            <p className="eyebrow">Crew</p>
            <h3 className="font-serif text-3xl mt-4 text-foreground">Pilots, captains, hosts.</h3>
            <p className="text-muted-foreground mt-4">
              Jets, helicopters and yachts are sourced through vetted operators — fully crewed, fully
              compliant, fully briefed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-24 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-6">
          <p className="eyebrow">Frequently asked · Cape Town Chauffeur & Airport Transfers</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">A few quick answers.</h2>
          <div className="mt-10 divide-y divide-border/40 border-y border-border/40">
            {[
              {
                q: "Do you do Cape Town airport transfers?",
                a: "Yes — Cape Town International (CPT) to any address in the city, Winelands or the Atlantic seaboard. Meet-and-greet inside the terminal, luggage handled, child seats on request. Booked as a single transfer or as part of a full-stay chauffeur arrangement.",
              },
              {
                q: "What's the difference between a chauffeur and a private driver in Cape Town?",
                a: "Our chauffeurs are professional drivers in suit, NDA-bound, with English fluency and local knowledge of routes, restaurants and timing. A private driver booked elsewhere is usually a one-off transfer; SVRM places the same chauffeur with you for the length of your stay so they learn your preferences.",
              },
              {
                q: "Can I book a chauffeured car by the hour or just for the day?",
                a: "Both. Half-day (4 hours), full-day (8 hours) and multi-day arrangements are standard. We also do single transfers — airport, restaurant, event — quoted on request once we know the route and timing.",
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



      <section className="bg-background py-24 md:py-32 border-t border-border/40">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Enquire · Travel</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-6 text-foreground">Send us the brief.</h2>
          </div>
          <EnquiryForm subject="Travel" />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Travel;
