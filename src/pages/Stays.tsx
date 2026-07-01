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
import StaySearchBar from "@/components/svrm/StaySearchBar";
import CustomStayBar from "@/components/svrm/CustomStayBar";

const SUB_TYPES: StayType[] = ["villa", "apartment", "hotel"];
type TopMode = "short" | "long" | "buysell";
type SortMode = "popular" | "asc" | "desc";

const Stays = () => {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<TopMode>("short");
  const [sub, setSub] = useState<StayType>("villa");
  const [sort, setSort] = useState<SortMode>("popular");

  useEffect(() => {
    const cat = params.get("cat");
    if (cat && (["short","long","buysell"] as const).includes(cat as TopMode)) {
      setMode(cat as TopMode);
    }
  }, [params]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Luxury Villas & Accommodation Cape Town — SVRM Stays"}
        description={"Luxury villas, apartments and hotel suites in Cape Town — Camps Bay, Clifton, Bantry Bay, V&A and the Winelands. Short-term, long-term and buy/sell, handled privately by SVRM."}
        path="/stays"
        keywords="luxury villa Cape Town, Camps Bay villa rental, Clifton villa, Bantry Bay accommodation, V&A Waterfront apartment, Constantia estate rental, Winelands accommodation, luxury hotel suite Cape Town, long-term rental Cape Town, short-term let Cape Town, property for sale Cape Town, buy property Cape Town, Atlantic Seaboard villa"
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
        title="Short-term, long-term, or your own."
        subtitle="Hand-picked luxury villas, apartments and hotel suites — Camps Bay, Clifton, Bantry Bay, V&A, Constantia and the Winelands. Nightly stays, furnished long-term residences and discreet buy & sell."
        videoSrc={heroVideo.url}
      />

      <section className="pt-10 md:pt-14">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as TopMode)} className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-transparent justify-start gap-2 p-0 mb-8">
              {(["short", "long", "buysell"] as TopMode[]).map((m) => (
                <TabsTrigger
                  key={m}
                  value={m}
                  className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none"
                >
                  {m === "short" ? "Short-term" : m === "long" ? "Long-term" : "Buy & Sell"}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="short" className="mt-0">
              <div className="space-y-6 mb-12">
                <StaySearchBar />
                <CustomStayBar />
              </div>

              <Tabs value={sub} onValueChange={(v) => setSub(v as StayType)} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                  <TabsList className="bg-surface-raised">
                    {SUB_TYPES.map((t) => (
                      <TabsTrigger key={t} value={t} className="text-[11px] uppercase tracking-[0.24em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        {stayTypeLabels[t]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <p className="text-xs text-muted-foreground/80 tracking-wide max-w-xs">
                    All rates on request. Final quote confirmed on enquiry.
                  </p>
                </div>

                {SUB_TYPES.map((t) => (
                  <TabsContent key={t} value={t} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {stays
                        .filter((s) => s.type === t)
                        .map((s, i) => (
                          <StayCard key={s.slug} stay={s} index={i} />
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            <TabsContent value="long" className="mt-0 pb-12">
              <LongTermStayForm />
            </TabsContent>

            <TabsContent value="buysell" className="mt-0 pb-12">
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
