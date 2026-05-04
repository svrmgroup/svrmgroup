import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const About = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Nav />
    <PageHero
      eyebrow="About"
      title="A small team. A long bench."
      subtitle="SVRM is a Cape Town lifestyle management studio for people who would rather live the moment than arrange it."
    />

    {/* TODO: replace placeholder copy */}
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 space-y-10 text-muted-foreground leading-relaxed text-lg">
        <p>
          Placeholder copy. SVRM was founded on a single idea: that the most luxurious
          thing in any city is a person who already knows it.
        </p>
        <p>
          We work with a deliberately small number of clients at any one time. Every brief
          is taken personally; every itinerary is walked, tasted, or driven before it is
          handed over.
        </p>
        <p>
          From a single transfer to a full season in Cape Town, we are a single line of
          contact for everything you would otherwise have to arrange yourself.
        </p>
      </div>
    </section>

    <section className="bg-surface-deep py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-foreground">Begin a conversation.</h2>
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-10 px-10 py-5 bg-primary text-primary-foreground text-xs uppercase tracking-[0.32em] font-medium hover:bg-primary-glow transition-colors duration-500 shadow-[var(--shadow-gold)]"
        >
          Message on WhatsApp
        </a>
      </div>
    </section>

    <Footer />
  </main>
);

export default About;
