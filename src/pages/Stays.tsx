import { useState } from "react";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import StayCard from "@/components/svrm/StayCard";
import { stays, stayTypeLabels, StayType } from "@/data/stays";
import { stayExtras } from "@/data/extras";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Seo } from "@/components/Seo";
import { MessageCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import heroVideo from "@/assets/videos/stays.mp4.asset.json";

const TYPES: StayType[] = ["villa", "apartment", "hotel"];

const Stays = () => {
  const [tab, setTab] = useState<StayType>("villa");

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Stays — Villas, Apartments & Hotel Rooms in Cape Town | SVRM"}
        description={"Hand-picked Cape Town villas, apartments and hotel rooms — Camps Bay, Clifton, V&A, Constantia and more. Add chauffeur, chef and concierge extras."}
        path="/stays"
      />
      <Nav />

      <div className="sticky top-20 z-30 bg-background/90 backdrop-blur border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {stays.length} residences & rooms · Cape Town
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
        eyebrow="Stays & Residences"
        title="Villas, apartments & hotel rooms."
        subtitle="Across Camps Bay, Clifton, Bantry Bay, V&A, Llandudno, Bishopscourt, Constantia and more — walked, vetted and run by SVRM."
        videoSrc={heroVideo.url}
      />

      <section className="pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as StayType)} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <TabsList className="bg-surface-raised">
                {TYPES.map((t) => (
                  <TabsTrigger key={t} value={t} className="text-[11px] uppercase tracking-[0.24em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {stayTypeLabels[t]}
                  </TabsTrigger>
                ))}
              </TabsList>
              <p className="text-xs text-muted-foreground/80 tracking-wide max-w-xs">
                Indicative rates. Switch currency in the top nav. Final quote on enquiry.
              </p>
            </div>

            {TYPES.map((t) => (
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
