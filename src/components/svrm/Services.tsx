import { Link } from "react-router-dom";
import travel from "@/assets/svc-travel-sclass.jpg";
import lifestyle from "@/assets/svc-exp-yacht.jpg";
import stays from "@/assets/svc-stays-villa.jpg";
import tours from "@/assets/svc-exp-safari.jpg";
import custom from "@/assets/svc-custom.jpg";

const services = [
  { img: travel, title: "Travel", body: "Chauffeured cars, private jets and helicopters — orchestrated end to end.", to: "/travel" },
  { img: lifestyle, title: "Lifestyle", body: "Yachting and day charters along the South African coast, in confidence.", to: "/lifestyle" },
  { img: stays, title: "Stays & Residences", body: "Curated villas, long-term residences and luxury real estate.", to: "/stays" },
  { img: tours, title: "Tours", body: "Safari, cultural, adventure — or build your own bespoke itinerary.", to: "/tours" },
  { img: custom, title: "Custom Experiences", body: "Whatever life requires — beyond the categories, on request.", to: "/experiences" },
];

const Services = () => (
  <section id="services" className="py-24 md:py-36 bg-background">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <p className="eyebrow">Our signatures</p>
        <h2 className="font-serif text-4xl md:text-6xl mt-6 text-foreground">Five disciplines.</h2>
        <div className="gold-divider w-16 mx-auto mt-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {services.map((s, i) => (
          <Link
            key={s.title}
            to={s.to}
            className={`group block ${i === 0 ? "lg:col-span-2" : ""}`}
          >
            <div className={`relative overflow-hidden bg-surface-raised ${i === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className={`w-full h-full object-cover ${["kb-a","kb-b","kb-c","kb-d","kb-a"][i]}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="eyebrow">Signature</p>
                <h3 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm mt-3 max-w-md leading-relaxed">{s.body}</p>
                <span className="inline-block mt-6 text-xs uppercase tracking-[0.28em] text-gold border-b border-primary/40 pb-1 group-hover:border-primary transition-colors">
                  Discover →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
