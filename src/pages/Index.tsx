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
