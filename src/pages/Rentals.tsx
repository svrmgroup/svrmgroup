import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import RentalCard from "@/components/svrm/RentalCard";
import RentalBookingSheet from "@/components/svrm/RentalBookingSheet";
import CustomRentalRequest from "@/components/svrm/CustomRentalRequest";
import { vehicles, vehicleTiers, Vehicle, VehicleTier } from "@/data/vehicles";
import { Seo } from "@/components/Seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroVideo from "@/assets/videos/rentals.mp4.asset.json";

type TabKey = "All" | VehicleTier | "Custom";

const Rentals = () => {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("All");

  const fleet = vehicles.filter((v) => v.selfDrive);

  useEffect(() => {
    const cat = params.get("cat");
    if (!cat) return;
    const valid: TabKey[] = ["All", ...vehicleTiers, "Custom"];
    if (valid.includes(cat as TabKey)) setTab(cat as TabKey);
  }, [params]);

  const openSheet = (v: Vehicle) => {
    setSelected(v);
    setOpen(true);
  };

  const tabs: TabKey[] = ["All", ...vehicleTiers.filter((t) => fleet.some((v) => v.tier === t)), "Custom"];

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Luxury Car Rental Cape Town | Self-Drive Premium Fleet — SVRM"}
        description={"Self-drive luxury and budget car rental in Cape Town — BMW, Mercedes, Range Rover, Porsche and Rolls-Royce. Lower than chauffeured rates, delivered to you. Custom briefs welcome."}
        path="/rentals"
      />
      <Nav />

      <div className="sticky top-20 z-30 bg-background/90 backdrop-blur border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {fleet.length} self-drive vehicles · luxury car rental Cape Town
          </p>
          <a
            href={buildWhatsAppUrl("a car rental")}
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
        eyebrow="Car Hire & Rentals · Self-Drive Luxury in Cape Town"
        title="Self-drive, on your terms."
        subtitle="Luxury car hire and rental in Cape Town — from a sharp BMW 3 Series to a Rolls-Royce, delivered to you. Self-drive rates are lower than our chauffeured fleet. Pick your dates, your tier, or send a custom budget brief."
        videoSrc={heroVideo.url}
      />

      <section className="bg-surface-deep py-14 border-b border-border/40">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="eyebrow">Luxury car hire Cape Town</p>
            <h3 className="font-serif text-2xl md:text-3xl mt-4 text-foreground">Premium fleet, delivered.</h3>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Self-drive a Rolls-Royce, Range Rover, AMG G-Class, Porsche or Mercedes for a Garden Route
              week or a Camps Bay weekend. Delivered to your hotel, villa or Cape Town International — fully
              insured, full tank, no airport queues.
            </p>
          </div>
          <div>
            <p className="eyebrow">Budget car hire Cape Town</p>
            <h3 className="font-serif text-2xl md:text-3xl mt-4 text-foreground">Smart everyday rentals.</h3>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              For longer stays we also place reliable everyday vehicles — BMW 3 Series, Mercedes E-Class,
              VW and Toyota — at lower daily rates. Same delivery, same insurance, same one-number support.
            </p>
          </div>
        </div>
      </section>


      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-transparent justify-start gap-2 p-0 mb-10">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="text-[11px] uppercase tracking-[0.24em] px-4 py-2 border border-border/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-none"
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.filter((t) => t !== "Custom").map((t) => {
              const list = t === "All" ? fleet : fleet.filter((v) => v.tier === t);
              return (
                <TabsContent key={t} value={t} className="mt-0">
                  <p className="text-xs text-muted-foreground/80 tracking-wide max-w-2xl mb-8">
                    All self-drive rates on request — calendar shows pickup → return dates. Final quote confirmed on enquiry.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {list.map((v, i) => (
                      <RentalCard key={v.slug} vehicle={v} index={i} onBook={openSheet} />
                    ))}
                  </div>
                </TabsContent>
              );
            })}

            <TabsContent value="Custom" className="mt-0">
              <CustomRentalRequest />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <RentalBookingSheet vehicle={selected} open={open} onOpenChange={setOpen} />

      <Footer />
    </main>
  );
};

export default Rentals;
