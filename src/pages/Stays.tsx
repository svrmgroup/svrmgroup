import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import StayCard from "@/components/svrm/StayCard";
import { stays } from "@/data/stays";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Seo } from "@/components/Seo";
import { MessageCircle } from "lucide-react";

const Stays = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo
      title={"Stays — Villas & Apartments in Cape Town | SVRM"}
      description={"Five hand-picked Cape Town residences — Camps Bay, Clifton, Bantry Bay, V&A Waterfront and Sea Point. Selected by SVRM, not searched."}
      path="/stays"
    />
    <Nav />

    {/* Sticky WhatsApp pill at the top of the page */}
    <div className="sticky top-20 z-30 bg-background/90 backdrop-blur border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">5 residences · Cape Town</p>
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
      title="Selected, not searched."
      subtitle="Five Cape Town residences across Camps Bay, Clifton, Bantry Bay, V&A Waterfront and Sea Point — walked, vetted and run by SVRM."
    />

    <section className="pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <p className="eyebrow">The Residences</p>
          <p className="text-xs text-muted-foreground/80 tracking-wide max-w-xs">
            Indicative per-night rates. Switch currency in the top nav. Final quote on enquiry.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stays.map((s, i) => (
            <StayCard key={s.slug} stay={s} index={i} />
          ))}
        </div>
      </div>
    </section>

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
