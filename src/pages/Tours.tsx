import { Link } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import { tours } from "@/data/tours";
import { Wand2 } from "lucide-react";
import { Seo } from "@/components/Seo";
import heroVideo from "@/assets/videos/tours.mp4.asset.json";

const Tours = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title={"Private Cape Town Tours | Safari, Garden Route, Marine — SVRM"} description={"Privately guided Cape Town tours — safari, Garden Route road trips, marine & wildlife, cultural, aerial and wellness itineraries. Curated end-to-end by SVRM."} path="/tours" keywords="private tours Cape Town, safari tours South Africa, Garden Route tour, Cape Peninsula tour, marine wildlife tour Cape Town, shark cage diving, whale watching Hermanus, Table Mountain tour, township cultural tour, photography tour Cape Town, helicopter scenic flight, wellness retreat South Africa, custom Cape Town itinerary" />
    <Nav />
    <PageHero
      eyebrow="Tours · Private Guided Cape Town & South Africa"
      title="South Africa, taken seriously."
      subtitle="Privately guided Cape Town tours — safari, Garden Route, marine & wildlife, cultural, aerial and wellness — assembled by theme and duration, or composed entirely around you."
      videoSrc={heroVideo.url}
    />

    <section className="pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm text-muted-foreground/90 leading-relaxed max-w-3xl mb-12 md:mb-16">
          The most-requested Cape Town tours we run: private <span className="text-foreground">safari</span> in
          the Big Five reserves, a <span className="text-foreground">helicopter tour</span> over the
          Twelve Apostles and Cape Point, a guided <span className="text-foreground">Table Mountain</span> day,
          and marine excursions to see whales, sharks and the Boulders Beach penguins. All private, all
          chauffeured, all booked through one number.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {tours.map((t) => (
          <Link
            key={t.slug}
            to={`/tours/${t.slug}`}
            className="group relative block overflow-hidden aspect-[4/3]"
          >
            <img
              src={t.image}
              alt={t.label}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover kb-a"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="eyebrow">Tour</p>
              <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground">{t.label}</h2>
              <p className="text-muted-foreground text-sm mt-3 max-w-sm">{t.blurb}</p>
              <span className="inline-block mt-5 text-xs uppercase tracking-[0.28em] text-gold border-b border-primary/40 pb-1 group-hover:border-primary transition-colors">
                See packages →
              </span>
            </div>
          </Link>
        ))}

        <Link
          to="/tours/builder"
          className="group relative block overflow-hidden aspect-[4/3] md:col-span-2 bg-surface-raised border border-primary/40"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <Wand2 className="h-10 w-10 text-gold" />
            <p className="eyebrow mt-6">Create your own</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 text-foreground">Build a bespoke tour.</h2>
            <p className="mt-4 text-muted-foreground max-w-xl">
              Choose your activities, duration and travellers — see an indicative range, then send the
              brief and we'll respond personally.
            </p>
            <span className="inline-block mt-6 text-xs uppercase tracking-[0.28em] text-gold border-b border-primary/40 pb-1 group-hover:border-primary transition-colors">
              Open the builder →
            </span>
          </div>
        </Link>
        </div>
      </div>
    </section>


    <Footer />
  </main>
);

export default Tours;
