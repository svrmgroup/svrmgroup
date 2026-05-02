import heroPoster from "@/assets/hero-poster.jpg";

const Hero = () => {
  return (
    <section
      id="top"
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-surface-deep"
    >
      {/* Background video with poster fallback */}
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
        <source
          src="https://cdn.coverr.co/videos/coverr-driving-on-a-coastal-road-2633/1080p.mp4"
          type="video/mp4"
        />
      </video>
      <img
        src={heroPoster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover hidden motion-reduce:block"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero-overlay)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="eyebrow animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Cape Town · Lifestyle Management
        </p>

        <h1
          className="font-serif text-foreground mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] max-w-5xl animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Curated, without compromise.
        </h1>

        <p
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground font-light animate-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          Experiences, transport, and stays — precisely arranged.
        </p>

        <div
          className="mt-12 flex flex-col sm:flex-row items-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          <a
            href="#enquire"
            className="px-8 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] font-medium hover:bg-primary-glow transition-colors duration-500 shadow-[var(--shadow-gold)]"
          >
            Make an enquiry
          </a>
          <a
            href="#services"
            className="px-8 py-4 border border-primary/70 text-gold text-xs uppercase tracking-[0.28em] font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
          >
            Explore services
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 inset-x-0 flex justify-center z-10" aria-hidden="true">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
