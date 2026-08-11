import BackgroundVideo from "@/components/svrm/BackgroundVideo";
import SmartImage from "@/components/svrm/SmartImage";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  videoSrc?: string;
  posterSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const PageHero = ({ eyebrow, title, subtitle, videoSrc, posterSrc, imageSrc, imageAlt }: Props) => {
  if (videoSrc) {
    return (
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden bg-surface-deep">
        <BackgroundVideo src={videoSrc} poster={posterSrc} />
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
    <section className="relative pt-40 pb-16 md:pt-48 md:pb-24 overflow-hidden">
      {imageSrc && (
        <div className="absolute inset-0 z-0">
          <SmartImage
            src={imageSrc}
            alt={imageAlt || title}
            wrapperClassName="absolute inset-0 w-full h-full"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero-overlay)" }}
            aria-hidden="true"
          />
        </div>
      )}
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
};

export default PageHero;
