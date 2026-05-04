import { Link, useParams, Navigate } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import { findService, categories } from "@/data/services";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const ServiceDetail = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const result = category && slug ? findService(category, slug) : null;

  if (!result) return <Navigate to="/services" replace />;

  const { category: cat, service } = result;
  const related = cat.services.filter((s) => s.slug !== service.slug);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      {/* Hero image */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-deep/60 via-surface-deep/30 to-surface-deep" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-16 md:pb-24 w-full">
            <Link
              to={`/services?tab=${cat.slug}`}
              className="text-xs uppercase tracking-[0.28em] text-gold hover:text-foreground transition-colors"
            >
              ← {cat.label}
            </Link>
            <h1 className="font-serif text-5xl md:text-7xl mt-6 text-foreground leading-[1.05] max-w-3xl">
              {service.title}
            </h1>
            <div className="gold-divider w-16 mt-8" />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-2">
            <p className="eyebrow">The brief</p>
            <p className="font-serif text-2xl md:text-3xl mt-6 text-foreground leading-[1.3]">
              {service.teaser}
            </p>
            <p className="mt-10 text-muted-foreground leading-relaxed text-lg">
              {service.description}
            </p>
          </div>

          <aside className="lg:sticky lg:top-32 self-start bg-surface-raised border border-border/40 p-8">
            <p className="eyebrow">What's included</p>
            <ul className="mt-6 space-y-3">
              {service.included.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-foreground/90">
                  <span className="text-gold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href={buildWhatsAppUrl(service.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 block text-center px-6 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.32em] font-medium hover:bg-primary-glow transition-colors duration-500 shadow-[var(--shadow-gold)]"
            >
              Book on WhatsApp
            </a>
            <p className="text-xs text-muted-foreground/70 mt-4 text-center tracking-wide">
              Personally answered, within hours.
            </p>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border/40 py-20 md:py-28 bg-surface-deep">
          <div className="max-w-7xl mx-auto px-6">
            <p className="eyebrow text-center">Also in {cat.label}</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${cat.slug}/${s.slug}`}
                  className="group block relative overflow-hidden aspect-[16/9]"
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-serif text-2xl text-foreground">{s.title}</h3>
                    <span className="mt-2 inline-block text-xs uppercase tracking-[0.28em] text-gold">
                      Discover →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default ServiceDetail;

export { categories };
