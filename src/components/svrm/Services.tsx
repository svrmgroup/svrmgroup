import { Link } from "react-router-dom";
import tours from "@/assets/service-tours.jpg";
import chauffeur from "@/assets/service-chauffeur.jpg";
import stays from "@/assets/service-stays.jpg";

const services = [
  { img: tours, title: "Experiences", body: "Curated Cape Town and beyond — itineraries shaped to a life, not a checklist.", to: "/services?tab=experiences" },
  { img: chauffeur, title: "Transport", body: "Discreet, on-demand transport. Wherever the day takes you, arrive without thinking about it.", to: "/services?tab=transport" },
  { img: stays, title: "Stays", body: "Stays selected, not searched. Boutique villas, private estates, signature hotels.", to: "/services?tab=stays" },
];

const Services = () => (
  <section id="services" className="py-24 md:py-36 bg-background">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <p className="eyebrow">Our signatures</p>
        <h2 className="font-serif text-4xl md:text-6xl mt-6 text-foreground">Three signatures.</h2>
        <div className="gold-divider w-16 mx-auto mt-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {services.map((s) => (
          <Link
            key={s.title}
            to={s.to}
            className="group block"
          >
            <div className="relative overflow-hidden aspect-[4/5] bg-surface-raised">
              <img
                src={s.img}
                alt={s.title}
                width={1024}
                height={1280}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="eyebrow">Signature</p>
                <h3 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm mt-3 max-w-xs leading-relaxed">{s.body}</p>
                <span className="inline-block mt-6 text-xs uppercase tracking-[0.28em] text-gold border-b border-primary/40 pb-1 group-hover:border-primary transition-colors">
                  Discover →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/services"
          className="inline-block px-8 py-4 border border-primary/70 text-gold text-xs uppercase tracking-[0.28em] font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          View all services
        </Link>
      </div>
    </div>
  </section>
);

export default Services;
