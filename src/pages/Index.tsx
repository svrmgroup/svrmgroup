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
      title="SVRM | Luxury Lifestyle Management & Concierge Cape Town"
      description="SVRM is Cape Town's private lifestyle management group — luxury chauffeur, private tours, villas, car rental, armed security and bespoke concierge across South Africa."
      path="/"
      keywords="SVRM, SVRM Group, luxury concierge Cape Town, lifestyle management South Africa, private chauffeur Cape Town, airport transfer Cape Town, private tours Cape Town, luxury villa rental Cape Town, armed close protection, armoured vehicles, private jet charter, helicopter charter, yacht charter, bespoke concierge, VIP services Cape Town"
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
