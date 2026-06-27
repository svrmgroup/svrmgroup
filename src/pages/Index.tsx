import Nav from "@/components/svrm/Nav";
import Hero from "@/components/svrm/Hero";
import Intro from "@/components/svrm/Intro";
import Services from "@/components/svrm/Services";
import Testimonials from "@/components/svrm/Testimonials";
import ClosingCTA from "@/components/svrm/ClosingCTA";
import Footer from "@/components/svrm/Footer";
import { Seo } from "@/components/Seo";

const Index = () => (
  <main className="bg-background text-foreground">
    <Seo
      title="SVRM — Lifestyle Management in Cape Town"
      description="SVRM curates tours, chauffeured transport, and accommodation across Cape Town — discreet, bespoke, end-to-end lifestyle management."
      path="/"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "SVRM",
        description: "Luxury lifestyle management — tours, chauffeured transport, and accommodation in Cape Town.",
        areaServed: "Cape Town, South Africa",
        url: "https://cape-town-curator.lovable.app/",
        email: "concierge@svrm.group",
      }}
    />
    <Nav />
    <Hero />
    <Intro />
    <Services />
    <Testimonials />
    <ClosingCTA />
    <Footer />
  </main>
);

export default Index;
