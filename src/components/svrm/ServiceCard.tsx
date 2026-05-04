import { Link } from "react-router-dom";
import type { Service, CategorySlug } from "@/data/services";

interface Props {
  service: Service;
  category: CategorySlug;
  reverse?: boolean;
}

const ServiceCard = ({ service, category, reverse }: Props) => (
  <Link
    to={`/services/${category}/${service.slug}`}
    className="group grid grid-cols-1 md:grid-cols-2 bg-surface-raised border border-border/40 hover:border-primary/40 transition-colors duration-500 overflow-hidden"
  >
    <div className={`relative overflow-hidden aspect-[4/3] md:aspect-auto md:min-h-[320px] ${reverse ? "md:order-2" : ""}`}>
      <img
        src={service.image}
        alt={service.title}
        loading="lazy"
        width={1280}
        height={896}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/40 via-transparent to-transparent" />
    </div>
    <div className="p-8 md:p-10 flex flex-col justify-center">
      <p className="eyebrow">Signature</p>
      <h3 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">{service.title}</h3>
      <div className="gold-divider w-10 mt-5" />
      <p className="text-muted-foreground mt-5 leading-relaxed">{service.teaser}</p>
      <span className="inline-block mt-8 text-xs uppercase tracking-[0.28em] text-gold border-b border-primary/40 pb-1 self-start group-hover:border-primary transition-colors">
        Discover →
      </span>
    </div>
  </Link>
);

export default ServiceCard;
