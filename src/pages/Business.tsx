import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const Business = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Nav />
    <PageHero
      eyebrow="For business"
      title="Hosted, on your behalf."
      subtitle="Programmes for executives, delegations and visiting clients — discreet, end-to-end, and consistent across every touchpoint."
    />

    {/* TODO: replace placeholder copy */}
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 grid gap-16">
        <div>
          <p className="eyebrow">Executive travel</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">A single point of contact.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Placeholder copy. From a one-off arrival to a recurring travel pattern, we run
            the ground game so your team and your clients arrive ready, briefed and on time.
          </p>
        </div>
        <div>
          <p className="eyebrow">Client hosting</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">Hospitality, brought in-house.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Placeholder copy. Vineyard days, tasting dinners, off-sites and incentive trips —
            curated to fit a brand, a budget and a calendar.
          </p>
        </div>
        <div>
          <p className="eyebrow">Retainers</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">A house concierge, on retainer.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Placeholder copy. For firms with regular Cape Town activity — a defined SLA,
            preferred rates, and one team that knows your people by name.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-surface-deep py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-foreground">Let's talk programmes.</h2>
        <a
          href={buildWhatsAppUrl("a business retainer")}
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

export default Business;
