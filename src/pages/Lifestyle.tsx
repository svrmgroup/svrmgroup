import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import SectionBlock from "@/components/svrm/SectionBlock";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import yachtImg from "@/assets/svc-exp-yacht.jpg";
import chefImg from "@/assets/svc-lifestyle-chef.jpg";
import { Seo } from "@/components/Seo";

const Lifestyle = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title={"Lifestyle — Private Yachts & Charters | SVRM"} description={"Private yachting and day charters along the South African coast, curated with the discretion that defines SVRM lifestyle management."} path="/lifestyle" />
    <Nav />
    <PageHero
      eyebrow="Lifestyle"
      title="A day on the water. A table no-one else has."
      subtitle="Private yachting and day charters along the South African coast, with the discretion and curation that defines SVRM."
    />

    <SectionBlock
      id="yachting"
      eyebrow="Luxury Yachting"
      title="Skippered charters, end to end."
      image={yachtImg}
      imageAlt="Luxury yacht on the Atlantic with Table Mountain in the distance"
      body={
        <>
          <p>
            Skippered yacht and catamaran charters from the V&amp;A — half-day, full-day or a multi-day
            cruise along the Atlantic seaboard. Routes shaped to weather, light and what you came here for.
          </p>
          <p>
            On board: a crew briefed on your tastes, considered catering, water toys, and the kind of
            quiet service that makes the day feel longer than it was.
          </p>
        </>
      }
    />

    <div className="border-t border-border/40">
      <SectionBlock
        id="add-ons"
        eyebrow="Curated add-ons"
        title="Private chef, sunset cruises, the unexpected."
        image={chefImg}
        imageAlt="A private chef preparing a tasting menu"
        reverse
        body={
          <>
            <p>
              Bring a private chef on board for a tasting menu against the sunset. Add a
              photographer for a milestone. Charter a second tender for the family. Each layer is
              optional, each is invisible by the time it arrives.
            </p>
            <p>
              Tell us the occasion — we'll write the rest.
            </p>
          </>
        }
      />
    </div>

    <section className="bg-surface-deep py-24 md:py-32 border-t border-border/40">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="eyebrow">Enquire · Lifestyle</p>
          <h2 className="font-serif text-4xl md:text-5xl mt-6 text-foreground">Compose your day.</h2>
        </div>
        <EnquiryForm subject="Lifestyle / yachting" />
      </div>
    </section>

    <Footer />
  </main>
);

export default Lifestyle;
