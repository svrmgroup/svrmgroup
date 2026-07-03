import { Link } from "react-router-dom";
import { buildWhatsAppUrlRaw } from "@/lib/whatsapp";

const ClosingCTA = () => (
  <section id="enquire" className="bg-surface-deep py-28 md:py-40 cv-auto">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <p className="eyebrow">Concierge</p>
      <h2 className="font-serif text-5xl md:text-7xl mt-6 text-foreground leading-[1.05]">
        Tell us what you need.
      </h2>
      <p className="mt-8 text-muted-foreground max-w-xl mx-auto">
        From a single transfer to a complete itinerary — share what you have in mind and we
        will respond, personally, within hours.
      </p>
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={buildWhatsAppUrlRaw("Hi SVRM, I'd like to plan something with your concierge.")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-10 py-5 bg-primary text-primary-foreground text-xs uppercase tracking-[0.32em] font-medium hover:bg-primary-glow transition-colors duration-500 shadow-[var(--shadow-gold)]"
        >
          Begin on WhatsApp
        </a>
        <Link
          to="/contact"
          className="px-10 py-5 border border-primary/60 text-gold text-xs uppercase tracking-[0.32em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Send an enquiry
        </Link>
      </div>
    </div>
  </section>
);

export default ClosingCTA;
