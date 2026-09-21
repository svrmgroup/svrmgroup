import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import StayCard from "@/components/svrm/StayCard";
import LongTermStayForm from "@/components/svrm/LongTermStayForm";
import BuySellPropertyForm from "@/components/svrm/BuySellPropertyForm";
import { stays, stayTypeLabels, StayType } from "@/data/stays";
import { stayExtras } from "@/data/extras";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Seo } from "@/components/Seo";
import { MessageCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import heroVideo from "@/assets/videos/stays.mp4.asset.json";
import staysOg from "@/assets/svc-stays-villa.jpg";
import StaySearchBar from "@/components/svrm/StaySearchBar";
import CustomStayBar from "@/components/svrm/CustomStayBar";
import PropertyManagementSection from "@/components/svrm/PropertyManagementSection";

const SUB_TYPES: StayType[] = ["villa", "apartment", "hotel"];
type TopMode = "short" | "long" | "manage" | "buysell";
type SortMode = "popular" | "asc" | "desc";

const Stays = () => {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<TopMode>("short");
  const [sub, setSub] = useState<StayType>("villa");
  const [sort, setSort] = useState<SortMode>("popular");

  useEffect(() => {
    const cat = params.get("cat");
    if (cat && (["short","long","manage","buysell"] as const).includes(cat as TopMode)) {
      setMode(cat as TopMode);
    }
  }, [params]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Luxury Villas Cape Town & Property Management — SVRM Stays"}
        description={"Luxury villas, apartments and hotel suites in Camps Bay, Clifton, V&A and the Winelands. Short-term and long-term rentals, full property management for owners, and discreet buy & sell with SVRM."}
        path="/stays"
        keywords="luxury villa Cape Town, Camps Bay villa rental, Clifton villa, Bantry Bay accommodation, V&A Waterfront apartment, Constantia estate rental, Winelands accommodation, luxury hotel suite Cape Town, long-term rental Cape Town, short-term let Cape Town, property for sale Cape Town, buy property Cape Town, Atlantic Seaboard villa, Sea Point penthouse rental, Mouille Point apartment, Green Point apartment, Llandudno beach villa, Higgovale villa, De Waterkant apartment, Cape Quarter apartment, Waterclub apartment Cape Town, Azura Atlantic Green Point, Alpha Sunsets Sea Point, Skyshore Mouille Point, Rock Residence Camps Bay, Buddha Retreat Camps Bay, Solmara House Llandudno, Hamaya villa Cape Town, Iliwa villa, Stonewood at The Granger, Sandstone Higgovale, Nox Rentals Cape Town, Nox luxury apartments, holiday villa Cape Town with pool, family villa Camps Bay, ocean view apartment Cape Town, penthouse with sea view Cape Town, property management Cape Town, luxury property management Cape Town, villa management Cape Town, short term rental management Cape Town, Airbnb management Cape Town, rent out my villa Cape Town, hands-free property income, holiday home management Camps Bay"
        image={staysOg}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: "SVRM Stays — Cape Town Villas & Apartments",
            url: "https://svrm.group/stays",
            areaServed: { "@type": "City", name: "Cape Town" },
            priceRange: "$$$$",
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Luxury property management in Cape Town",
            name: "SVRM Property Management",
            url: "https://svrm.group/stays?cat=manage",
            provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group" },
            areaServed: { "@type": "City", name: "Cape Town" },
            description:
              "Fully hands-free management of luxury homes in Cape Town: maintenance, housekeeping, guest vetting, marketing to private clients and monthly owner income.",
          },
          {
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "SVRM Group — Luxury Property, Cape Town",
            url: "https://svrm.group/stays?cat=buysell",
            areaServed: { "@type": "City", name: "Cape Town" },
            priceRange: "$$$$",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Do you manage luxury properties in Cape Town?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. SVRM looks after your home end to end — maintenance, housekeeping, vetted guests and marketing to our private client base — while you receive a monthly income, completely hands-free.",
                },
              },
              {
                "@type": "Question",
                name: "Which areas do you cover for property management?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Camps Bay, Clifton, Bantry Bay, Bakoven, Llandudno, Sea Point, Green Point, V&A Waterfront, Constantia and the Winelands.",
                },
              },
              {
                "@type": "Question",
                name: "Can SVRM help me buy or sell a luxury property in Cape Town?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes — we handle discreet off-market buying and selling of luxury homes and apartments across Cape Town. Terms are confirmed on enquiry.",
                },
              },
            ],
          },
        ]}
      />
      <Nav />

      <div className="sticky top-20 z-30 bg-background/90 backdrop-blur border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Luxury Villas & Accommodation · Cape Town
          </p>
          <a
            href={buildWhatsAppUrl("a stay in Cape Town")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>

      <PageHero
        eyebrow="Stays · Luxury Villas, Apartments & Hotels in Cape Town"
        title="Luxury Villas & Accommodation Cape Town"
        subtitle="Hand-picked luxury villas, apartments and hotel suites — Camps Bay, Clifton, Bantry Bay, V&A, Constantia and the Winelands. Nightly stays, furnished long-term residences and discreet buy & sell."
        videoSrc={heroVideo.url}
      />

      <section className="pt-10 md:pt-14">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as TopMode)} className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-transparent justify-start gap-2 p-0 mb-8">
              {(["short", "long", "manage", "buysell"] as TopMode[]).map((m) => (
                <TabsTrigger
                  key={m}
                  value={m}
                  className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none"
                >
                  {m === "short" ? "Short-term" : m === "long" ? "Long-term" : m === "manage" ? "Property Management" : "Buy & Sell"}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="short" className="mt-0">
              <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground">Short-term luxury stays</h2>

              <Tabs value={sub} onValueChange={(v) => setSub(v as StayType)} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                  <TabsList className="bg-surface-raised">
                    {SUB_TYPES.map((t) => (
                      <TabsTrigger key={t} value={t} className="text-[11px] uppercase tracking-[0.24em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        {stayTypeLabels[t]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="flex items-center gap-3">
                    <label htmlFor="stay-sort" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">Sort</label>
                    <select
                      id="stay-sort"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortMode)}
                      className="bg-surface-raised border border-border/60 text-xs uppercase tracking-[0.18em] px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="popular">Popular</option>
                      <option value="asc">Price: Low to High</option>
                      <option value="desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {SUB_TYPES.map((t) => {
                  const list = stays.filter((s) => s.type === t);
                  const byPrice =
                    sort === "asc"
                      ? [...list].sort((a, b) => a.fromZAR - b.fromZAR)
                      : sort === "desc"
                        ? [...list].sort((a, b) => b.fromZAR - a.fromZAR)
                        : list;
                  const sorted = [...byPrice].sort((a, b) => Number(b.featured) - Number(a.featured));
                  return (
                    <TabsContent key={t} value={t} className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {sorted.map((s, i) => (
                          <StayCard key={s.slug} stay={s} index={i} />
                        ))}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>

              <div className="mt-12">
                <CustomStayBar />
              </div>
            </TabsContent>

            <TabsContent value="long" className="mt-0 pb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground">Long-term residences</h2>
              <LongTermStayForm />
            </TabsContent>

            <TabsContent value="manage" className="mt-0 pb-12">
              <PropertyManagementSection />
            </TabsContent>

            <TabsContent value="buysell" className="mt-0 pb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground">Buy & sell property</h2>
              <BuySellPropertyForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="bg-surface-deep py-24 md:py-32 border-t border-border/40">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Enquire · Stays</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-6 text-foreground">Tell us about the stay.</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Add a chauffeur, chef or any extra to layer onto your booking.
            </p>
          </div>
          <EnquiryForm
            subject="Stays & Residences"
            extras={stayExtras}
            extrasLabel="Add concierge extras"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Stays;
