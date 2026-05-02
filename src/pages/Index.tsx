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
    <>
      {/* SEO */}
      <head>
        <title>SVRM — Lifestyle Management in Cape Town</title>
        <meta
          name="description"
          content="SVRM is a Cape Town lifestyle management service curating tours, chauffeured transport, and accommodation — and anything else life requires."
        />
        <link rel="canonical" href="/" />
      </head>

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
    </>
  );
};

export default Index;
