import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import { buildWhatsAppUrl, CONCIERGE_EMAIL } from "@/lib/whatsapp";
import { Seo } from "@/components/Seo";

const Contact = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title={"Contact SVRM | Luxury Concierge Cape Town — WhatsApp & Email"} description={"Contact SVRM, Cape Town's luxury concierge and lifestyle management group. WhatsApp +27 73 064 1481 or email concierge@svrm.group — personal reply within hours."} path="/contact" />
    <Nav />
    <PageHero
      eyebrow="Contact · Luxury Concierge Cape Town"
      title="Begin a conversation."
      subtitle="Booking is by request. Tell us what you need — a single Cape Town transfer or a complete itinerary — and our concierge team will respond personally, within hours."
    />

    <section className="pb-28">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
        <aside className="lg:col-span-2 space-y-10">
          <div>
            <p className="eyebrow">Concierge</p>
            <a
              href={`mailto:${CONCIERGE_EMAIL}`}
              className="block font-serif text-2xl md:text-3xl mt-3 text-foreground hover:text-gold transition-colors break-all"
            >
              {CONCIERGE_EMAIL}
            </a>
          </div>
          <div>
            <p className="eyebrow">WhatsApp</p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-serif text-2xl md:text-3xl mt-3 text-foreground hover:text-gold transition-colors"
            >
              Message the concierge →
            </a>
            <p className="text-xs text-muted-foreground/70 mt-3 tracking-wide">
              Personally answered, within hours.
            </p>
          </div>
          <div>
            <p className="eyebrow">Location</p>
            <p className="mt-3 text-muted-foreground">Cape Town, South Africa.<br />By appointment.</p>
          </div>
          <div className="border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              Privacy is the standard. Every enquiry is treated in confidence. SVRM operates by
              request only — there is no public booking system and no pricing without a brief.
            </p>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <EnquiryForm subject="General enquiry" />
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default Contact;
