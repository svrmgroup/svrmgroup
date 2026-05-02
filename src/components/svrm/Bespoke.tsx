const Bespoke = () => (
  <section className="relative py-28 md:py-40 bg-surface-deep overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 30%, hsl(var(--primary)) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--primary-glow)) 0%, transparent 40%)",
      }}
    />
    <div className="relative max-w-4xl mx-auto px-6 text-center">
      <p className="eyebrow">Bespoke</p>
      <h2 className="font-serif text-4xl md:text-6xl mt-6 text-foreground leading-[1.1]">
        Beyond the signatures, we handle whatever life requires —
        <span className="text-gold italic"> the impossible included.</span>
      </h2>
      <p className="mt-10 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Cleaning, property, events, errands, last-minute reservations, the gift you forgot,
        the restaurant that's fully booked. If it can be arranged, we arrange it. For
        individuals and businesses alike.
      </p>
      <a
        href="#enquire"
        className="inline-block mt-12 px-8 py-4 border border-primary/70 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
      >
        Make a request
      </a>
    </div>
  </section>
);

export default Bespoke;
