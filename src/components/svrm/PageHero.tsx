interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  videoSrc?: string;
  posterSrc?: string;
}

const PageHero = ({ eyebrow, title, subtitle, videoSrc, posterSrc }: Props) => {
  if (videoSrc) {
    return (
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden bg-surface-deep">
        <video
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {posterSrc && (
          <img
            src={posterSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover hidden motion-reduce:block"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero-overlay)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="font-serif text-5xl md:text-7xl mt-6 text-foreground leading-[1.05]">
            {title}
          </h1>
          <div className="gold-divider w-16 mx-auto mt-8" />
          {subtitle && (
            <p className="mt-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="pt-40 pb-16 md:pt-48 md:pb-24 bg-surface-deep">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-6 text-foreground leading-[1.05]">
          {title}
        </h1>
        <div className="gold-divider w-16 mx-auto mt-8" />
        {subtitle && (
          <p className="mt-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
