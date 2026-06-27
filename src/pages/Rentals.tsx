import { useState } from "react";
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
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("All");

  const fleet = vehicles.filter((v) => v.selfDrive);

  const openSheet = (v: Vehicle) => {
    setSelected(v);
    setOpen(true);
  };

  const tabs: TabKey[] = ["All", ...vehicleTiers.filter((t) => fleet.some((v) => v.tier === t)), "Custom"];

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Car Rentals — Self-drive Luxury & Budget in Cape Town | SVRM"}
        description={"Self-drive from a BMW 3 Series to a Rolls-Royce. Cheaper than chauffeured — pick your dates, your tier, or send a custom budget brief."}
        path="/rentals"
      />
      <Nav />

      <div className="sticky top-20 z-30 bg-background/90 backdrop-blur border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {fleet.length} self-drive vehicles · cheaper than chauffeured
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
        eyebrow="Car Rentals"
        title="Self-drive, on your terms."
        subtitle="From a sharp BMW 3 Series to a Rolls-Royce — self-drive rates are lower than our chauffeured fleet. Pick your dates, your tier, or send a custom budget brief."
        videoSrc={heroVideo.url}
      />

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
                    Daily self-drive rates indicative — calendar shows pickup → return dates. Switch currency in the top nav.
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
