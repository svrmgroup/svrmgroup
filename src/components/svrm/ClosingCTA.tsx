const ClosingCTA = () => (
  <section id="enquire" className="bg-surface-deep py-28 md:py-40">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <p className="eyebrow">Concierge</p>
      <h2 className="font-serif text-5xl md:text-7xl mt-6 text-foreground leading-[1.05]">
        Tell us what you need.
      </h2>
      <p className="mt-8 text-muted-foreground max-w-xl mx-auto">
        From a single transfer to a complete itinerary — share what you have in mind and we
        will respond, personally, within hours.
      </p>
      <a
        href="mailto:concierge@svrm.co.za"
        className="inline-block mt-12 px-10 py-5 bg-primary text-primary-foreground text-xs uppercase tracking-[0.32em] font-medium hover:bg-primary-glow transition-colors duration-500 shadow-[var(--shadow-gold)]"
      >
        Begin your enquiry
      </a>
    </div>
  </section>
);

export default ClosingCTA;
