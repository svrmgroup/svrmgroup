import heroPoster from "@/assets/hero-poster.jpg";
import droneVideo from "@/assets/hero-drone.mp4.asset.json";
import { buildWhatsAppUrlRaw } from "@/lib/whatsapp";

const Hero = () => {
  return (
    <section
      id="top"
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-surface-deep"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroPoster}
        aria-hidden="true"
      >
        <source src={droneVideo.url} type="video/mp4" />
      </video>
      <img
        src={heroPoster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover hidden motion-reduce:block"
      />

      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero-overlay)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="eyebrow animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Cape Town · Lifestyle Management
        </p>

        <h1
          className="font-serif text-foreground mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] max-w-5xl animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Curated luxury across South Africa.
        </h1>

        <p
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground font-light animate-fade-up font-mono"
          style={{ animationDelay: "0.55s" }}
        >
          Your life, precisely arranged.
        </p>

        <div
          className="mt-12 flex flex-col sm:flex-row items-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          <a
            href="#services"
            className="px-8 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] font-medium hover:bg-primary-glow transition-colors duration-500 shadow-[var(--shadow-gold)]"
          >
            Discover SVRM
          </a>
          <a
            href={buildWhatsAppUrlRaw("Hi SVRM, I saw your homepage and would like to learn more about your services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-primary/70 text-gold text-xs uppercase tracking-[0.28em] font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
          >
            Enquire
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 inset-x-0 flex justify-center z-10" aria-hidden="true">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
