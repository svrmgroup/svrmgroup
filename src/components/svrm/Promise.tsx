const items = [
  { title: "Discreet", body: "Privacy is the standard, not a feature." },
  { title: "Bespoke", body: "Every detail shaped around the individual." },
  { title: "End-to-end", body: "One point of contact, every moving part handled." },
];

const Promise = () => (
  <section className="bg-surface-deep py-20 md:py-28">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
      {items.map((it, i) => (
        <div key={it.title} className="text-center md:px-8">
          <p className="eyebrow">0{i + 1}</p>
          <h3 className="font-serif text-3xl mt-4 text-foreground">{it.title}</h3>
          <div className="gold-divider w-12 mx-auto my-5" />
          <p className="text-muted-foreground text-sm leading-relaxed">{it.body}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Promise;
