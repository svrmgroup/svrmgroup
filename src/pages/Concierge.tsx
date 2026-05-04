import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const Concierge = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Nav />
    <PageHero
      eyebrow="Concierge"
      title="Anything you need."
      subtitle="If it can be arranged in Cape Town, it can be arranged through us. Quietly, accurately, and on a single line of contact."
    />

    {/* TODO: replace placeholder copy */}
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 grid gap-16">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">One brief, one team, one answer.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Placeholder copy. Send a message — by WhatsApp, email, or phone — and we
            confirm in writing within hours. From there, every detail moves through one
            person who already knows your preferences.
          </p>
        </div>
        <div>
          <p className="eyebrow">What we arrange</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">From the standing reservation to the impossible table.</h2>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
            <li>· Restaurant reservations</li>
            <li>· Private events & dinners</li>
            <li>· Last-minute travel changes</li>
            <li>· Personal sourcing</li>
            <li>· Family logistics</li>
            <li>· Anything not listed</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Discretion</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">Quiet by design.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Placeholder copy. We do not publish a client list. Names, plans and preferences
            are held in a small, vetted team — and stay there.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-surface-deep py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-foreground">Tell us what you need.</h2>
        <a
          href={buildWhatsAppUrl("the concierge service")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-10 px-10 py-5 bg-primary text-primary-foreground text-xs uppercase tracking-[0.32em] font-medium hover:bg-primary-glow transition-colors duration-500 shadow-[var(--shadow-gold)]"
        >
          Book on WhatsApp
        </a>
      </div>
    </section>

    <Footer />
  </main>
);

export default Concierge;
