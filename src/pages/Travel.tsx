import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import VehicleCard from "@/components/svrm/VehicleCard";
import { vehicles, vehicleTiers } from "@/data/vehicles";
import { Seo } from "@/components/Seo";

const tierBlurbs: Record<string, string> = {
  "Signature": "The top of the SVRM fleet — Rolls-Royce, Bentley, Lamborghini. Chauffeur-led.",
  "Premium SUV": "Off-the-grid capability without compromise. Range Rover, AMG G-Class, Porsche, BMW.",
  "Executive": "Discreet sedans and lounge vans for transfers, meetings and small parties.",
  "Everyday": "Smart everyday vehicles for longer stays — budget-friendly, fully insured.",
};

const Travel = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo
      title={"Travel — Chauffeurs, Jets & Luxury Vehicles | SVRM"}
      description={"Rolls-Royce, Bentley, Range Rover, Mercedes, BMW, Porsche, Audi — chauffeured or self-drive across Cape Town. Private aviation on request."}
      path="/travel"
    />
    <Nav />
    <PageHero
      eyebrow="Travel"
      title="Arrive without thinking about it."
      subtitle="A full fleet across four tiers — Signature, Premium SUV, Executive and Everyday. Chauffeured or self-drive."
    />

    <section className="pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs text-muted-foreground/80 tracking-wide max-w-2xl mb-12">
          Indicative daily rates. Switch currency in the top nav. Final quote confirmed on enquiry.
        </p>

        {vehicleTiers.map((tier) => {
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
      </div>
    </section>

    <section className="bg-surface-deep py-20 border-t border-border/40">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="eyebrow">Private Aviation</p>
          <h3 className="font-serif text-3xl mt-4 text-foreground">Jets & helicopters.</h3>
          <p className="text-muted-foreground mt-4">
            Private jet charter, helicopter transfers and scenic flights — sourced through trusted
            operators. Every flight quoted on request.
          </p>
        </div>
        <div>
          <p className="eyebrow">Chauffeur</p>
          <h3 className="font-serif text-3xl mt-4 text-foreground">English-speaking, NDA-bound.</h3>
          <p className="text-muted-foreground mt-4">
            Hourly hire, airport transfers and inter-city journeys with a discreet chauffeur on call
            for the length of your stay.
          </p>
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

export default Travel;
