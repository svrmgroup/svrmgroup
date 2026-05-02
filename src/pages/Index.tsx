import Nav from "@/components/svrm/Nav";
import Hero from "@/components/svrm/Hero";
import Promise from "@/components/svrm/Promise";
import Services from "@/components/svrm/Services";
import Bespoke from "@/components/svrm/Bespoke";
import Testimonials from "@/components/svrm/Testimonials";
import ClosingCTA from "@/components/svrm/ClosingCTA";
import Footer from "@/components/svrm/Footer";

const Index = () => {
  return (
    <main className="bg-background text-foreground">
        <Nav />
        <Hero />
        <Promise />
        <Services />
        <Bespoke />
        <Testimonials />
        <ClosingCTA />
      <Footer />
    </main>
  );
};

export default Index;
