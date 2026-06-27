import { useState } from "react";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import RentalCard from "@/components/svrm/RentalCard";
import RentalBookingSheet from "@/components/svrm/RentalBookingSheet";
import { vehicles, Vehicle } from "@/data/vehicles";
import { Seo } from "@/components/Seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

const Rentals = () => {
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [open, setOpen] = useState(false);
  const fleet = vehicles.filter((v) => v.selfDrive);

  const openSheet = (v: Vehicle) => {
    setSelected(v);
    setOpen(true);
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Car Rentals — Self-drive Luxury in Cape Town | SVRM"}
        description={"Self-drive a Range Rover, AMG G63, BMW, Mercedes, Audi or Porsche. Book pickup and return dates online. Concierge confirmation within hours."}
        path="/rentals"
      />
      <Nav />

      <div className="sticky top-20 z-30 bg-background/90 backdrop-blur border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {fleet.length} self-drive vehicles
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
        title="Self-drive, on your dates."
        subtitle="Pick a vehicle, pick your dates, add what you need — we confirm availability and deliver to you."
      />

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs text-muted-foreground/80 tracking-wide max-w-2xl mb-10">
            Daily rates indicative — calendar shows pickup → return dates. Switch currency in the top nav.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {fleet.map((v, i) => (
              <RentalCard key={v.slug} vehicle={v} index={i} onBook={openSheet} />
            ))}
          </div>
        </div>
      </section>

      <RentalBookingSheet vehicle={selected} open={open} onOpenChange={setOpen} />

      <Footer />
    </main>
  );
};

export default Rentals;
