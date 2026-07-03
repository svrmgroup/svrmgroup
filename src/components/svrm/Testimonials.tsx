const quotes = [
  {
    quote: "SVRM didn't book a trip — they composed one. Every car, every door, every detail, anticipated.",
    name: "A. Whitfield",
    place: "London",
  },
  {
    quote: "Calm, precise, and entirely discreet. They became the team I didn't know I needed.",
    name: "M. Okonkwo",
    place: "Cape Town",
  },
  {
    quote: "Two days into the city, my schedule looked like it had been written by someone who'd known me for years.",
    name: "S. Reinhardt",
    place: "Johannesburg",
  },
];

const Testimonials = () => (
  <section className="py-24 md:py-36 bg-background cv-auto">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <p className="eyebrow">In their words</p>
        <div className="gold-divider w-16 mx-auto mt-6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
        {quotes.map((q) => (
          <figure key={q.name} className="text-center md:text-left">
            <span className="font-serif text-5xl text-gold leading-none">"</span>
            <blockquote className="font-serif italic text-xl md:text-2xl text-foreground/90 leading-relaxed mt-4">
              {q.quote}
            </blockquote>
            <figcaption className="mt-8 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {q.name} · <span className="text-gold">{q.place}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
