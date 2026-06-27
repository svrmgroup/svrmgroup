import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import TourBuilder from "@/components/svrm/TourBuilder";
import { Seo } from "@/components/Seo";

const TourBuilderPage = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title={"Build Your Tour — Custom Itinerary | SVRM"} description={"Design a bespoke South African tour with indicative pricing. SVRM arranges the rest and quotes against your exact brief."} path="/tours/builder" />
    <Nav />
    <PageHero
      eyebrow="Create your own"
      title="Build your tour."
      subtitle="Choose what matters. We'll quietly arrange the rest — and quote you against the exact brief."
    />
    <section className="pb-28 md:pb-40">
      <div className="max-w-7xl mx-auto px-6">
        <TourBuilder />
      </div>
    </section>
    <Footer />
  </main>
);

export default TourBuilderPage;
