import { Link, Navigate, useParams } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PricingCard from "@/components/svrm/PricingCard";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import { Seo } from "@/components/Seo";
import { findTour } from "@/data/tours";

const TourDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const tour = slug ? findTour(slug) : null;
  if (!tour) return <Navigate to="/tours" replace />;

  const title = `${tour.label} — SVRM Tour`;
  const description = (tour as { summary?: string; subtitle?: string }).summary
    ?? (tour as { subtitle?: string }).subtitle
    ?? `Bespoke ${tour.label} tour in South Africa, curated end-to-end by SVRM.`;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={title.length > 60 ? `${tour.label} | SVRM` : title}
        description={String(description).slice(0, 158)}
        path={`/tours/${slug}`}
      />
      <Nav />
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <img src={tour.image} alt={tour.label} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-deep/60 via-surface-deep/30 to-surface-deep" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-12 md:pb-20 w-full">
            <Link to="/tours" className="text-xs uppercase tracking-[0.28em] text-gold hover:text-foreground">
              ← All tours
            </Link>
            <h1 className="font-serif text-5xl md:text-7xl mt-6 text-foreground leading-[1.05] max-w-3xl">
              {tour.label}
            </h1>
            <div className="gold-divider w-16 mt-8" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-serif text-2xl md:text-3xl text-foreground leading-[1.3]">{tour.blurb}</p>
          <p className="mt-8 text-muted-foreground leading-relaxed">{tour.description}</p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Packages</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-4 text-foreground">From three days to bespoke.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tour.packages.map((p) => (
              <PricingCard
                key={p.duration + p.title}
                duration={p.duration}
                title={p.title}
                fromZAR={p.fromZAR}
                inclusions={p.inclusions}
                subject={`${tour.label} — ${p.duration} ${p.title}`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-10 max-w-2xl mx-auto">
            All prices indicative, per person, excluding international flights. Every itinerary is
            personalised and quoted on request.
          </p>
        </div>
      </section>

      <section className="bg-surface-deep py-24 md:py-32 border-t border-border/40">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow">Enquire · {tour.label}</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-6 text-foreground">Send us the brief.</h2>
          </div>
          <EnquiryForm subject={tour.label} />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TourDetail;
