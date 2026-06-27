import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import SectionBlock from "@/components/svrm/SectionBlock";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import villaImg from "@/assets/svc-stays-villa.jpg";
import penthouseImg from "@/assets/svc-stays-penthouse.jpg";
import buysellImg from "@/assets/svc-stays-buysell.jpg";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Seo } from "@/components/Seo";

const Stays = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title={"Stays & Residences — Villas & Apartments | SVRM"} description={"Short stays, long-term residences and buy/sell guidance in Cape Town — selected by SVRM, not searched."} path="/stays" />
    <Nav />
    <PageHero
      eyebrow="Stays & Residences"
      title="Selected, not searched."
      subtitle="Short stays, long-term residences and the guidance to buy or sell — handled by people who've walked every room."
    />

    <SectionBlock
      id="short-stay"
      eyebrow="Short-Stay Accommodation"
      title="One night to thirty."
      image={villaImg}
      imageAlt="A modern luxury villa with pool overlooking the ocean"
      body={
        <>
          <p>
            A short, considered list of villas and penthouses in Camps Bay, Bantry Bay, Clifton and
            Constantia — each one walked, vetted and matched to how you actually intend to use it.
          </p>
          <p>
            Housekeeping, pre-arrival provisioning and a concierge on call are part of the rate, not
            an extra.
          </p>
        </>
      }
    >
      <a
        href={buildWhatsAppUrl("short-stay residences")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
      >
        Enquire about residences
      </a>
    </SectionBlock>

    <div className="border-t border-border/40">
      <SectionBlock
        id="long-term"
        eyebrow="Long-Term Residences"
        title="A month, a season, a year."
        image={penthouseImg}
        imageAlt="Long-term luxury penthouse with floor-to-ceiling windows"
        reverse
        body={
          <>
            <p>
              High-end apartments and homes available for monthly leases — paired with full property
              management, so the residence runs itself in your absence and is ready when you return.
            </p>
            <p>
              Furnished or unfurnished. Cape Town, Stellenbosch and select coastal locations.
            </p>
          </>
        }
      >
        <a
          href={buildWhatsAppUrl("long-term residences")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Enquire about residences
        </a>
      </SectionBlock>
    </div>

    <div className="border-t border-border/40">
      <SectionBlock
        id="buy-sell"
        eyebrow="Buy & Sell"
        title="Quietly, through SVRM Real Estate."
        image={buysellImg}
        imageAlt="A contemporary luxury Cape Town villa at twilight"
        body={
          <>
            <p>
              Guidance on purchasing or selling luxury real estate, handled through the SVRM Real
              Estate division. Off-market introductions, valuations, viewings and the legal team —
              with the privacy our clients expect.
            </p>
            <p>
              Speak to us before you speak to the market.
            </p>
          </>
        }
      >
        <a
          href={buildWhatsAppUrl("real estate")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Enquire about residences
        </a>
      </SectionBlock>
    </div>

    <section className="bg-surface-deep py-24 md:py-32 border-t border-border/40">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="eyebrow">Enquire · Stays</p>
          <h2 className="font-serif text-4xl md:text-5xl mt-6 text-foreground">Tell us about the stay.</h2>
        </div>
        <EnquiryForm subject="Stays & Residences" />
      </div>
    </section>

    <Footer />
  </main>
);

export default Stays;
