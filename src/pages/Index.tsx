import Nav from "@/components/svrm/Nav";
import Hero from "@/components/svrm/Hero";
import Intro from "@/components/svrm/Intro";
import Services from "@/components/svrm/Services";
import Testimonials from "@/components/svrm/Testimonials";
import ClosingCTA from "@/components/svrm/ClosingCTA";
import Footer from "@/components/svrm/Footer";

const Index = () => (
  <main className="bg-background text-foreground">
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
