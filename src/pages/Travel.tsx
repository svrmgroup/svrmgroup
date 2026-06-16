import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import SectionBlock from "@/components/svrm/SectionBlock";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import sclass from "@/assets/svc-travel-sclass.jpg";
import jet from "@/assets/svc-travel-jet.jpg";
import fleet from "@/assets/svc-travel-fleet.jpg";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const Travel = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Nav />
    <PageHero
      eyebrow="Travel"
      title="Arrive without thinking about it."
      subtitle="Chauffeured cars, private aviation, luxury hire — vetted, briefed and orchestrated from the first call to the last door."
    />

    <SectionBlock
      id="chauffeuring"
      eyebrow="Chauffeuring & Car Rentals"
      title="Star-lit interiors. Quiet drivers. The SVRM plate."
      image={sclass}
      imageAlt="Luxury Mercedes S-Class interior with starlit ceiling"
      body={
        <>
          <p>
            A discreet, professionally chauffeured fleet — Mercedes S-Class and V-Class,
            Mercedes-AMG G-Wagon, Lamborghini Urus and Range Rover — finished with quilted leather,
            ambient star-lit ceilings and the SVRM plate.
          </p>
          <p>
            For airport transfers, hourly hire, inter-city journeys or a chauffeur on call for the
            length of your stay. English-speaking, NDA-bound, route-briefed.
          </p>
        </>
      }
    >
      <a
        href={buildWhatsAppUrl("chauffeuring")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
      >
        Request your journey
      </a>
    </SectionBlock>

    <div className="border-t border-border/40">
      <SectionBlock
        id="aviation"
        eyebrow="Private Jets & Helicopters"
        title="Routes opened. Quotes on request."
        image={jet}
        imageAlt="Private jet on the runway at sunset with Table Mountain backdrop"
        reverse
        body={
          <>
            <p>
              Private jet charter, helicopter transfers and scenic flights — sourced through trusted
              operators, with routing, briefing and ground transport coordinated end to end.
            </p>
            <p>
              Because routes, aircraft and timing vary, every flight is quoted on request. Send the
              brief and we'll return options within hours.
            </p>
          </>
        }
      >
        <a
          href={buildWhatsAppUrl("aviation")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Request a quote
        </a>
      </SectionBlock>
    </div>

    <div className="border-t border-border/40">
      <SectionBlock
        id="luxury-rentals"
        eyebrow="Luxury Car Rentals"
        title="The car you wanted, on the day you wanted it."
        image={fleet}
        imageAlt="Lineup of luxury cars at sunset on a coastal road"
        body={
          <>
            <p>
              Premium self-drive hire — Range Rover, G-Wagon, Urus, Bentayga and more. Delivered to
              your residence or hotel, with concierge handover and 24-hour support throughout.
            </p>
            <p>
              Daily, weekly and longer terms. Pricing on request, against the specific vehicle and
              window you have in mind.
            </p>
          </>
        }
        reverse
      >
        <a
          href={buildWhatsAppUrl("luxury car rental")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Request a vehicle
        </a>
      </SectionBlock>
    </div>

    <section className="bg-surface-deep py-24 md:py-32 border-t border-border/40">
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
