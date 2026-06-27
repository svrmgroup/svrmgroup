import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import VehicleCard from "@/components/svrm/VehicleCard";
import { vehicles } from "@/data/vehicles";
import { Seo } from "@/components/Seo";

const Travel = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo
      title={"Travel — Chauffeurs, Jets & Luxury Vehicles | SVRM"}
      description={"Rolls-Royce, Lamborghini, Mercedes-AMG and BMW — chauffeured or self-drive across Cape Town. Private aviation on request."}
      path="/travel"
    />
    <Nav />
    <PageHero
      eyebrow="Travel"
      title="Arrive without thinking about it."
      subtitle="Five vehicles, in the sun. Chauffeured or self-drive — daily rates indicative, every booking arranged personally."
    />

    <section className="pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">The Fleet</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">Five vehicles, on request.</h2>
          </div>
          <p className="text-xs text-muted-foreground/80 tracking-wide max-w-xs">
            Indicative daily rates. Switch currency in the top nav. Final quote confirmed on enquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.slug} vehicle={v} index={i} />
          ))}
        </div>
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
