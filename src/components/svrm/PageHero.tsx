interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

const PageHero = ({ eyebrow, title, subtitle }: Props) => (
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

export default PageHero;
