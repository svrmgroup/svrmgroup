import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  duration: string;
  fromPrice: string;
  title: string;
  inclusions: string[];
  subject: string;
  onEnquire?: () => void;
}

const PricingCard = ({ duration, fromPrice, title, inclusions, subject, onEnquire }: Props) => (
  <article className="bg-surface-raised border border-border/40 p-8 flex flex-col">
    <p className="eyebrow">{duration}</p>
    <h3 className="font-serif text-2xl md:text-3xl mt-4 text-foreground">{title}</h3>
    <div className="mt-6">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">From</p>
      <p className="font-serif text-3xl text-gold mt-2">{fromPrice}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">per person · indicative</p>
    </div>
    <ul className="mt-6 space-y-2 text-sm text-foreground/85 flex-1">
      {inclusions.map((i) => (
        <li key={i} className="flex gap-3">
          <span className="text-gold">·</span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
    {onEnquire ? (
      <button
        type="button"
        onClick={onEnquire}
        className="mt-8 text-center px-6 py-3 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
      >
        Enquire
      </button>
    ) : (
      <a
        href={buildWhatsAppUrl(subject)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 text-center px-6 py-3 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
      >
        Enquire
      </a>
    )}
  </article>
);

export default PricingCard;
