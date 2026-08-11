import { Link } from "react-router-dom";

export interface RelatedLink {
  to: string;
  label: string;
}

/** Small internal-linking strip used at the foot of the service pages. */
const RelatedLinks = ({
  title = "Continue",
  links,
}: {
  title?: string;
  links: RelatedLink[];
}) => (
  <section className="pb-20">
    <div className="max-w-7xl mx-auto px-6">
      <p className="eyebrow">{title}</p>
      <div className="flex flex-wrap gap-3 mt-5">
        {links.map((l) => (
          <Link
            key={l.to + l.label}
            to={l.to}
            className="text-[11px] uppercase tracking-[0.2em] px-4 py-3 border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default RelatedLinks;
